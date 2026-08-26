"use client"

import { useEffect, useState } from "react"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { FormSpec, WizardLayout, ChildTableSpec, FieldSpec } from "@/lib/forms/types"

function ReadOnlyChildTable({
    spec,
    rows,
}: {
    spec: ChildTableSpec
    rows: Array<Record<string, unknown>>
}) {
    return (
        <div className="space-y-2">
            {spec.title && (
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {spec.title}
                </h2>
            )}
            {!rows.length ? (
                <p className="text-sm text-muted-foreground">No records.</p>
            ) : (
                <div className="overflow-x-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        {spec.columns.map((c) => (
                            <TableHead key={c.fieldname}>{c.label}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={i}>
                            {spec.columns.map((c) => (
                                <TableCell key={c.fieldname} className="max-w-xs whitespace-normal wrap-break-word align-top">
                                    {String(row[c.fieldname] ?? "—")}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
                </div>
            )}
        </div>
    )
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "—"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    return String(value)
}

function FieldGrid({
    fields,
    row,
    columns = 2,
}: {
    fields: FieldSpec[]
    row: Record<string, unknown>
    columns?: 1 | 2 | 3 | 4
}) {
    const colClass =
        columns === 1
            ? "grid-cols-1"
            : columns === 3
            ? "grid-cols-1 sm:grid-cols-3"
            : columns === 4
            ? "grid-cols-1 sm:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2"
    return (
        <div className={cn("grid gap-4", colClass)}>
            {fields.map((f) => (
                <div key={f.fieldname} className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{f.label}</p>
                    <p className="text-sm whitespace-pre-line">{formatValue(row[f.fieldname])}</p>
                </div>
            ))}
        </div>
    )
}

export function RecordDetailView({
    spec,
    row,
    wizard,
    onEdit,
    onClose,
    onDelete,
}: {
    spec: FormSpec
    row: Record<string, unknown>
    wizard?: WizardLayout
    onEdit: () => void
    onClose: () => void
    onDelete?: () => void
}) {
    const [activeStep, setActiveStep] = useState(0)
    const [dialogOpen, setDialogOpen] = useState(false)

    // Reset to the first step whenever a different record is opened.
    useEffect(() => {
        setActiveStep(0)
    }, [row.name])

    const imageField = spec.fields.find((f) => f.fieldtype === "Attach Image")
    const restFields = spec.fields.filter((f) => f.fieldtype !== "Attach Image")
    const imageValue = imageField ? row[imageField.fieldname] : undefined
    const byName = new Map<string, FieldSpec>(spec.fields.map((f) => [f.fieldname, f]))

    const actionButtons = (
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
    )

    // No wizard layout — original flat single-panel behavior, unchanged.
    if (!wizard) {
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
                    <div className={imageField ? "pr-28 sm:pr-36 md:pr-44" : ""}>
                        <FieldGrid fields={restFields} row={row} />
                    </div>
                </div>
                {actionButtons}
            </div>
        )
    }

    // Wizard layout present — mirror WizardFormLayout's step-pager exactly:
    // one step visible at a time, same breadcrumb, same Back/Next.
    const step = wizard.steps[activeStep]
    const isFirst = activeStep === 0
    const isLast = activeStep === wizard.steps.length - 1
    const hasColumns = !!step.columns && step.columns.length > 0
    const isComingSoon = !hasColumns && !step.childTable && !step.dialog && step.fieldnames.length === 0

    const mainColumn = step.columns?.find((c) => c.span === "main")
    const sidebarColumn = step.columns?.find((c) => c.span === "sidebar")

    // Only show the avatar on whichever step actually references the image
    // field, same as PhotoUploadField only appearing on that step in edit mode.
    const stepFieldnames = hasColumns
        ? (step.columns ?? []).flatMap((c) => c.sections.flatMap((s) => s.fieldnames))
        : step.fieldnames
    const showImageThisStep = !!imageField && stepFieldnames.includes(imageField.fieldname)

    const stepContent = isComingSoon ? (
        <div className="rounded-md border border-dashed p-8 text-center">
            <p className="font-medium">{step.label} — not built yet</p>
            <p className="text-sm text-muted-foreground mt-2">
                {step.note ?? "This step needs its own fields/DocType before it can be filled in here."}
            </p>
        </div>
    ) : hasColumns ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mainColumn && (
                <div className="lg:col-span-2 space-y-6">
                    {mainColumn.sections.map((section, i) => {
                        const fields = section.fieldnames
                            .filter((fn) => fn !== imageField?.fieldname)
                            .map((fn) => byName.get(fn))
                            .filter((f): f is FieldSpec => !!f)
                        if (!fields.length) return null
                        return (
                            <div key={section.title ?? i} className="space-y-3">
                                {section.title && (
                                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {section.title}
                                    </h2>
                                )}
                                <FieldGrid fields={fields} row={row} columns={section.columns} />
                            </div>
                        )
                    })}
                </div>
            )}
            {sidebarColumn && (
                <div className="space-y-6">
                    {showImageThisStep && (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-muted overflow-hidden flex items-center justify-center text-muted-foreground border-2 border-background shadow-sm">
                            {typeof imageValue === "string" && imageValue ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={imageValue} alt={imageField!.label} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-8 h-8 sm:w-10 sm:h-10" />
                            )}
                        </div>
                    )}
                    {sidebarColumn.sections.map((section, i) => {
                        const fields = section.fieldnames
                            .filter((fn) => fn !== imageField?.fieldname)
                            .map((fn) => byName.get(fn))
                            .filter((f): f is FieldSpec => !!f)
                        if (!fields.length) return null
                        return (
                            <div key={section.title ?? i} className="space-y-3">
                                {section.title && (
                                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        {section.title}
                                    </h2>
                                )}
                                <FieldGrid fields={fields} row={row} columns={section.columns} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    ) : (
        <div className="space-y-6">
            {step.childTable && (
                <ReadOnlyChildTable
                    spec={step.childTable}
                    rows={(row[step.childTable.fieldname] as Array<Record<string, unknown>>) ?? []}
                />
            )}
            {step.fieldnames.length > 0 && (
                <FieldGrid
                    fields={step.fieldnames.map((fn) => byName.get(fn)).filter((f): f is FieldSpec => !!f)}
                    row={row}
                    columns={step.fieldColumns}
                />
            )}
        </div>
    )

    return (
        <div className="grid gap-6">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm">
                {wizard.steps.map((s, i) => (
                    <span key={s.key} className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setActiveStep(i)}
                            className={cn(
                                "font-medium hover:underline cursor-pointer",
                                i === activeStep
                                    ? "text-foreground"
                                    : i < activeStep
                                    ? "text-foreground/70"
                                    : "text-muted-foreground"
                            )}
                        >
                            {s.label}
                        </button>
                        {i < wizard.steps.length - 1 && <span className="text-muted-foreground">/</span>}
                    </span>
                ))}
            </div>
            <Separator />

            {stepContent}

            {step.dialog && (
                <div>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(true)}>
                        {step.dialog.buttonLabel}
                    </Button>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogContent className="max-w-sm">
                            <DialogHeader>
                                <DialogTitle>{step.dialog.title ?? step.dialog.buttonLabel}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-3">
                                {step.dialog.childTable && (
                                    <ReadOnlyChildTable
                                        spec={step.dialog.childTable}
                                        rows={(row[step.dialog.childTable.fieldname] as Array<Record<string, unknown>>) ?? []}
                                    />
                                )}
                                {(step.dialog.fieldnames ?? []).length > 0 && (
                                    <FieldGrid
                                        fields={(step.dialog.fieldnames ?? []).map((fn) => byName.get(fn)).filter((f): f is FieldSpec => !!f)}
                                        row={row}
                                        columns={1}
                                    />
                                )}
                            </div>
                            <div className="flex justify-end pt-2">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}

            {actionButtons}
        </div>
    )
}
