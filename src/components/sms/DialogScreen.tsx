"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { frappe, getErrorMessage } from "@/lib/frappe"
import type { FieldSpec } from "@/lib/forms/types"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { DynamicField } from "@/components/sms/DynamicField"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * The ~19 legacy modal prompts/utilities (blueprint §5.1): small dialogs like
 * password change, settings toggles, override confirmations — a single-column
 * form with one primary action, never a full page.
 *
 * Two backing modes (2026-09-03, added for Departments' move to
 * Administration > Configuration): pass `method` for a whitelisted
 * campus_erp.api.* RPC (the original/only mode), or `doctype` to hit the
 * generic /api/resource/<doctype> REST endpoints directly via frappe.js's
 * createDoc/updateDoc — the same thing MasterDetailScreen already does for
 * simple master-data doctypes with no custom business logic. Exactly one of
 * the two must be provided.
 *
 * Pass `recordName` + `initialValues` to edit an existing document instead
 * of creating a new one — the dialog stays otherwise identical.
 */
export function DialogScreen({
  title,
  fields,
  method,
  doctype,
  recordName,
  initialValues,
  submitLabel,
  open,
  onOpenChange,
  onSuccess,
}: {
  title: string
  fields: FieldSpec[]
  /** Whitelisted campus_erp.api.* method to call with the form values. */
  method?: string
  /** Alternative to `method` — creates/updates a doc directly via /api/resource/<doctype>. */
  doctype?: string
  /** When set (with `doctype`), the dialog updates this existing document instead of creating a new one. */
  recordName?: string
  /** Values to prefill the form with — typically the row being edited. Ignored when creating. */
  initialValues?: Record<string, unknown>
  /** Button label override. Defaults to "Save" when editing, "Confirm" when creating. */
  submitLabel?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}) {
  const form = useForm<Record<string, unknown>>({ defaultValues: initialValues ?? {} })

  // Re-sync whenever the dialog opens for a (possibly different) record —
  // covers both "Add" (initialValues undefined -> blank form) and "Edit"
  // (initialValues -> prefilled form) without needing separate components.
  useEffect(() => {
    if (open) form.reset(initialValues ?? {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, recordName])

  const mutation = useMutation({
    mutationFn: (values: Record<string, unknown>) => {
      if (method) return frappe.call(method, values)
      if (doctype) {
        return recordName
          ? frappe.updateDoc(doctype, recordName, values)
          : frappe.createDoc(doctype, values)
      }
      throw new Error("DialogScreen requires either `method` or `doctype`")
    },
    onSuccess: () => {
      toast.success(`${title} complete`)
      onOpenChange(false)
      onSuccess?.()
    },
    onError: (error) => toast.error(`${title} failed: ${getErrorMessage(error)}`),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            className="grid gap-4"
          >
            {fields.map((f) => (
              <DynamicField key={f.fieldname} control={form.control} spec={f} />
            ))}
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Working…" : submitLabel ?? (recordName ? "Save" : "Confirm")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}