import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FormSpec } from "@/lib/forms/types"

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "—"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    return String(value)
}

export function RecordDetailView({
    spec,
    row,
    onEdit,
    onClose,
    onDelete,
}: {
    spec: FormSpec
    row: Record<string, unknown>
    onEdit: () => void
    onClose: () => void
    onDelete?: () => void
}) {
    const imageField = spec.fields.find((f) => f.fieldtype === "Attach Image")
    const restFields = spec.fields.filter((f) => f.fieldtype !== "Attach Image")
    const imageValue = imageField ? row[imageField.fieldname] : undefined

    return (
        <div className="space-y-6">
            <div className="relative">
                {imageField && (
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-muted overflow-hidden flex items-center justify-center text-muted-foreground border-2 border-background shadow-sm">
                        {typeof imageValue === "string" && imageValue ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageValue} alt={imageField.label} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14" />
                        )}
                    </div>
                )}
                <div className={imageField ? "grid grid-cols-2 gap-x-6 gap-y-4 pr-28 sm:pr-36 md:pr-44" : "grid grid-cols-2 gap-x-6 gap-y-4"}>
                    {restFields.map((f) => (
                        <div key={f.fieldname} className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">{f.label}</p>
                            <p className="text-sm">{formatValue(row[f.fieldname])}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
                {onDelete ? (
                    <Button variant="destructive" onClick={onDelete}>Delete</Button>
                ) : (
                    <span />
                )}
                <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={onEdit}>Edit</Button>
                </div>
            </div>
        </div>
    )
}
