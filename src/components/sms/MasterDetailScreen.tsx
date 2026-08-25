"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { frappe, getErrorMessage } from "@/lib/frappe"
import type { FormSpec, WizardLayout } from "@/lib/forms/types"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { DynamicField } from "@/components/sms/DynamicField"
import { WizardFormLayout } from "@/components/sms/WizardFormLayout"

/**
 * The ~115 legacy Master/Detail screens (blueprint §5.1): a list view plus an
 * Add/Edit detail panel, backed by one Frappe DocType.
 *
 * Render modes (priority order): wizard (inline, step-by-step) > flat dialog
 * (default, unchanged). Passing no `wizard` prop keeps a screen's existing
 * behavior completely unchanged.
 */
export function MasterDetailScreen({
  spec,
  wizard,
}: {
  spec: FormSpec
  wizard?: WizardLayout
}) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const isInlineMode = !!wizard

  const listColumns = spec.fields.filter((f) => f.inListView)
  const columns = listColumns.length ? listColumns : spec.fields.slice(0, 4)

  const { data, isLoading } = useQuery({
    queryKey: [spec.doctype, "list"],
    queryFn: () =>
      frappe.list(spec.doctype, {
        fields: ["name", ...spec.fields.map((f) => f.fieldname)],
        limit_page_length: 100,
      }),
  })

  const form = useForm<Record<string, unknown>>({ defaultValues: {} })

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      if (editing?.name) {
        return frappe.updateDoc(spec.doctype, String(editing.name), values)
      }
      return frappe.createDoc(spec.doctype, values)
    },
    onSuccess: () => {
      toast.success(`${spec.title} saved`)
      queryClient.invalidateQueries({ queryKey: [spec.doctype, "list"] })
      closeForm()
    },
    onError: (error) => toast.error(`Could not save ${spec.title}: ${getErrorMessage(error)}`),
  })

  function closeForm() {
    setDialogOpen(false)
    setFormOpen(false)
  }

  function openNew() {
    setEditing(null)
    form.reset({})
    if (isInlineMode) setFormOpen(true)
    else setDialogOpen(true)
  }

  function openRow(row: Record<string, unknown>) {
    setEditing(row)
    form.reset(row)
    if (isInlineMode) setFormOpen(true)
    else setDialogOpen(true)
  }

  const formBody = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
        className="grid gap-4"
      >
        {wizard ? (
          <WizardFormLayout spec={spec} layout={wizard} control={form.control} />
        ) : (
          spec.fields.map((f) => (
            <DynamicField key={f.fieldname} control={form.control} spec={f} />
          ))
        )}
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? "Saving…" : "Save"}
        </Button>
      </form>
    </Form>
  )

  // Inline mode: list view is fully replaced while formOpen is true.
  if (isInlineMode && formOpen) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {editing ? `Edit ${spec.title}` : `New ${spec.title}`}
          </h1>
          <Button variant="outline" onClick={closeForm}>
            Back to list
          </Button>
        </div>
        <div className="rounded-md border p-6">{formBody}</div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{spec.title}</h1>
        <Button onClick={openNew}>Add {spec.title}</Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((c) => (
                  <TableHead key={c.fieldname}>{c.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).map((row) => (
                <TableRow
                  key={String(row.name)}
                  className="cursor-pointer"
                  onClick={() => openRow(row)}
                >
                  {columns.map((c) => (
                    <TableCell key={c.fieldname}>
                      {String(row[c.fieldname] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!isInlineMode && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editing ? `Edit ${spec.title}` : `New ${spec.title}`}
              </DialogTitle>
            </DialogHeader>
            {formBody}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
