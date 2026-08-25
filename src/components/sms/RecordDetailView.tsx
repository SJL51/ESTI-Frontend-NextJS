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
}: {
    spec: FormSpec
    row: Record<string, unknown>
    onEdit: () => void
    onClose: () => void
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {spec.fields.map((f) => (
                    <div key={f.fieldname} className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">{f.label}</p>
                        <p className="text-sm">{formatValue(row[f.fieldname])}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="outline" onClick={onClose}>Close</Button>
                <Button onClick={onEdit}>Edit</Button>
            </div>
        </div>
    )
}