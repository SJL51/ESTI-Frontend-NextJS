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
import { RecordDetailView } from "@/components/sms/RecordDetailView"

/**
 * The ~115 legacy Master/Detail screens (blueprint §5.1): a list view plus an
 * Add/Edit detail panel, backed by one Frappe DocType.
 *
 * Render modes (priority order): wizard (inline, step-by-step) > flat dialog
 * (default, unchanged). Passing no `wizard` prop keeps a screen's existing
 * behavior completely unchanged.
 *
 * Existing rows open read-only first (RecordDetailView) — editing or
 * deleting an existing record requires pressing the corresponding button
 * explicitly. New records skip straight to the editable form since there's
 * nothing to view yet.
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
  const [mode, setMode] = useState<"view" | "edit">("edit")
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
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

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!editing?.name) throw new Error("Nothing selected to delete")
      return frappe.deleteDoc(spec.doctype, String(editing.name))
    },
    onSuccess: () => {
      toast.success(`${spec.title} deleted`)
      queryClient.invalidateQueries({ queryKey: [spec.doctype, "list"] })
      setConfirmDeleteOpen(false)
      closeForm()
    },
    onError: (error) => toast.error(`Could not delete ${spec.title}: ${getErrorMessage(error)}`),
  })

  function closeForm() {
    setDialogOpen(false)
    setFormOpen(false)
  }

  function openNew() {
    setEditing(null)
    form.reset({})
    setMode("edit")
    if (isInlineMode) setFormOpen(true)
    else setDialogOpen(true)
  }

  async function openRow(row: Record<string, unknown>) {
    setEditing(row)
    form.reset(row)
    setMode("view")
    if (isInlineMode) setFormOpen(true)
    else setDialogOpen(true)
    // The list endpoint never returns child-table rows (e.g. Education) —
    // only a single-document fetch does. Re-fetch and refresh once it
    // lands; the list row is shown immediately so opening still feels instant.
    try {
      const full = await frappe.getDoc<Record<string, unknown>>(
        spec.doctype,
        String(row.name)
      )
      setEditing(full)
      form.reset(full)
    } catch {
      // Fall back silently to the list row's data — everything except
      // child-table fields is already correct from it.
    }
  }

  function startEdit() {
    setMode("edit")
  }

  function requestDelete() {
    setConfirmDeleteOpen(true)
  }

  const formBody = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
        onKeyDown={(e) => {
          // Enter submits the nearest <form> by default in every browser —
          // fine for a single-field dialog, but in a multi-step wizard it
          // saves (and closes) the record the moment someone hits Enter in
          // any text field. Block it except in a <textarea>, where Enter is
          // expected to insert a newline rather than submit.
          if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
            e.preventDefault()
          }
        }}
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

  const panelBody =
    mode === "view" && editing ? (
      <RecordDetailView
        spec={spec}
        row={editing}
        wizard={wizard}
        onEdit={startEdit}
        onClose={closeForm}
        onDelete={requestDelete}
      />
    ) : (
      formBody
    )

  function panelTitle() {
    if (mode === "view") return spec.title
    return editing ? `Edit ${spec.title}` : `New ${spec.title}`
  }

  const confirmDeleteDialog = (
    <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete {spec.title}?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          This can&apos;t be undone. This will permanently remove this record.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  // Inline mode: list view is fully replaced while formOpen is true.
  if (isInlineMode && formOpen) {
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{panelTitle()}</h1>
          <Button variant="outline" onClick={closeForm}>
            Back to list
          </Button>
        </div>
        <div className="rounded-md border p-6">{panelBody}</div>
        {confirmDeleteDialog}
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{spec.title}</h1>
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
              <DialogTitle>{panelTitle()}</DialogTitle>
            </DialogHeader>
            {panelBody}
          </DialogContent>
        </Dialog>
      )}
      {confirmDeleteDialog}
    </div>
  )
}
