"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export interface RecordViewField<T> {
    label: string
    render: (row: T) => React.ReactNode
}

export interface RecordViewDialogProps<T> {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** The row to show. Dialog renders nothing (but stays mounted) when null. */
    row: T | null
    /** Fields to show, in order, as a two-column key/value grid. */
    fields: RecordViewField<T>[]
    title?: string
}

/**
 * Generic read-only "view details" dialog for a single row from any table —
 * pass the row plus a `fields` list ({label, render}) and it renders a
 * two-column key/value grid inside a shadcn Dialog. Wired into SearchTable's
 * optional row-click view (see CLAUDE.md §3.2a), but usable standalone
 * anywhere else a "click a row, see its details" popup is needed.
 */
export function RecordViewDialog<T>({
    open,
    onOpenChange,
    row,
    fields,
    title = "Details",
}: RecordViewDialogProps<T>) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {row ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 py-2 text-sm">
                        {fields.map((f) => (
                            <div key={f.label} className="space-y-0.5">
                                <p className="text-xs font-medium text-gray-500">{f.label}</p>
                                <p>{f.render(row)}</p>
                            </div>
                        ))}
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}
