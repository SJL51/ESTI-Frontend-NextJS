"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Building2, Save, Eye, Loader2, Edit2 } from "lucide-react"

import { frappe, getErrorMessage } from "@/lib/frappe"
import { departmentSpec } from "@/lib/forms/administration"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Form } from "@/components/ui/form"
import { DynamicField } from "@/components/sms/DynamicField"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

interface DepartmentRow {
  name: string
  deptcode?: string
  department?: string
  head?: string
}

interface PersonnelInfoRow {
  name: string
  first_name?: string
  last_name?: string
}

export default function ConfigurationPage() {
  const form = useForm<Record<string, unknown>>({ defaultValues: {} })
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      frappe.createDoc(departmentSpec.doctype, values),
    onSuccess: () => {
      toast.success("Department added")
      form.reset({})
      queryClient.invalidateQueries({ queryKey: [departmentSpec.doctype, "list"] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const [codeAndNameFields, headField] = [
    departmentSpec.fields.filter((f) => f.fieldname !== "head"),
    departmentSpec.fields.find((f) => f.fieldname === "head"),
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Configuration</h1>
          <p className="text-xs text-muted-foreground">
            System preferences, integration settings, and administrative controls.
          </p>
        </div>
        <Badge variant="outline" className="text-[11px] font-normal">
          Setting
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Building2 className="w-5 h-5" />
              <CardTitle>Add Department</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <ViewDepartmentsDialog />
              <Button
                size="sm"
                className="gap-1.5"
                disabled={mutation.isPending}
                onClick={form.handleSubmit((values) => mutation.mutate(values))}
              >
                <Save className="w-4 h-4" /> {mutation.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
          <CardDescription>
            Create a new department with its code and assigned head.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {codeAndNameFields.map((f) => (
                  <DynamicField key={f.fieldname} control={form.control} spec={f} />
                ))}
              </div>
              {headField && <DynamicField control={form.control} spec={headField} />}
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Read-only list of existing departments, opened from a "View Departments"
 * button next to Save, with an Edit action per row that opens
 * `EditDepartmentDialog`. `head` is a plain Data field storing a
 * `Personnel Info` docname (e.g. "8r99qrpoj5"), not a Link, so it's resolved
 * to "First Last" via a second batch query rather than Frappe auto-joining it.
 */
function ViewDepartmentsDialog() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<DepartmentRow | null>(null)

  const departmentsQuery = useQuery({
    queryKey: [departmentSpec.doctype, "list"],
    queryFn: () =>
      frappe.list<DepartmentRow>(departmentSpec.doctype, {
        fields: ["name", "deptcode", "department", "head"],
        order_by: "department asc",
        limit_page_length: 200,
      }),
    enabled: open,
  })

  const headNames = [...new Set((departmentsQuery.data ?? [])
    .map((d) => d.head)
    .filter((h): h is string => !!h))]

  const personnelQuery = useQuery({
    queryKey: ["Personnel Info", "heads", headNames],
    queryFn: () =>
      frappe.list<PersonnelInfoRow>("Personnel Info", {
        filters: [["name", "in", headNames]],
        fields: ["name", "first_name", "last_name"],
        limit_page_length: headNames.length,
      }),
    enabled: open && headNames.length > 0,
  })

  const headNameByPersonnelId = new Map(
    (personnelQuery.data ?? []).map((p) => [
      p.name,
      [p.first_name, p.last_name].filter(Boolean).join(" ") || p.name,
    ])
  )

  function resolveHead(head?: string) {
    if (!head) return "—"
    return headNameByPersonnelId.get(head) ?? head
  }

  return (
    <>
      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpen(true)}>
        <Eye className="w-4 h-4" /> View Departments
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Departments</DialogTitle>
            <DialogDescription>
              All departments currently configured, with their assigned head.
            </DialogDescription>
          </DialogHeader>

          {departmentsQuery.isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading departments…
            </div>
          ) : departmentsQuery.isError ? (
            <div className="py-10 text-center text-xs text-destructive">
              {getErrorMessage(departmentsQuery.error)}
            </div>
          ) : !departmentsQuery.data?.length ? (
            <div className="py-10 text-center text-xs text-muted-foreground">
              No departments yet. Add one from this page.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-xs">Code</TableHead>
                          <TableHead className="text-xs">Department</TableHead>
                          <TableHead className="text-xs">Head</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departmentsQuery.data.map((dept) => (
                          <TableRow
                            key={dept.name}
                            className="cursor-pointer"
                            onClick={() => setEditing(dept)}
                          >
                            <TableCell className="text-xs font-medium">{dept.deptcode ?? "—"}</TableCell>
                            <TableCell className="text-xs">{dept.department ?? "—"}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {personnelQuery.isLoading ? "…" : resolveHead(dept.head)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <EditDepartmentDialog department={editing} onOpenChange={(o) => !o && setEditing(null)} />
    </>
  )
}

/**
 * Edit form for a single department, reusing the exact same `departmentSpec`
 * fields (including the head personnel-picker) as "Add Department" above,
 * just pre-filled and saved via `updateDoc` instead of `createDoc`.
 */
function EditDepartmentDialog({
  department,
  onOpenChange,
}: {
  department: DepartmentRow | null
  onOpenChange: (open: boolean) => void
}) {
  const queryClient = useQueryClient()
  const form = useForm<Record<string, unknown>>({
    values: department
      ? {
        deptcode: department.deptcode,
        department: department.department,
        head: department.head,
      }
      : { deptcode: "", department: "", head: "" },
  })

  const mutation = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      frappe.updateDoc(departmentSpec.doctype, department!.name, values),
    onSuccess: () => {
      toast.success("Department updated")
      queryClient.invalidateQueries({ queryKey: [departmentSpec.doctype, "list"] })
      onOpenChange(false)
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return (
    <Dialog open={!!department} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Update this department&apos;s code, name, or assigned head.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <div className="space-y-4">
            {departmentSpec.fields
              .filter((f) => f.fieldname !== "head")
              .map((f) => (
                <DynamicField key={f.fieldname} control={form.control} spec={f} />
              ))}
            {departmentSpec.fields
              .filter((f) => f.fieldname === "head")
              .map((f) => (
                <DynamicField key={f.fieldname} control={form.control} spec={f} />
              ))}
          </div>
        </Form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={mutation.isPending}
            onClick={form.handleSubmit((values) => mutation.mutate(values))}
          >
            {mutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}