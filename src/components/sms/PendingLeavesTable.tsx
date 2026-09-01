"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { frappe, getErrorMessage } from "@/lib/frappe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { SearchTable } from "@/components/sms/SearchTable"
import type { RecordViewField } from "@/components/sms/RecordViewDialog"

export interface PendingLeaveRow {
  name: string
  personnel_info: string
  employee_id: string
  employee_name: string
  department: string
  leave_type: string
  from_date: string
  to_date: string
  half_day: number
  reason: string
  date: string
  status: string
}

interface ApproveFormState {
  days_approved: string
  with_pay: string
  without_pay: string
  immediate_superior: string
  hrd_head: string
}

const emptyApproveForm: ApproveFormState = {
  days_approved: "",
  with_pay: "",
  without_pay: "",
  immediate_superior: "",
  hrd_head: "",
}

const viewFields: RecordViewField<PendingLeaveRow>[] = [
  { label: "Employee", render: (row) => row.employee_name },
  { label: "Department", render: (row) => row.department },
  { label: "Leave Type", render: (row) => row.leave_type },
  { label: "From", render: (row) => row.from_date },
  { label: "To", render: (row) => row.to_date },
  { label: "Reason", render: (row) => row.reason },
  { label: "Date Applied", render: (row) => row.date },
]

export function PendingLeavesTable() {
  const queryClient = useQueryClient()
  const [approvingRow, setApprovingRow] = useState<PendingLeaveRow | null>(null)
  const [form, setForm] = useState<ApproveFormState>(emptyApproveForm)

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["pending-leaves"] })
    queryClient.invalidateQueries({ queryKey: ["recent-leaves"] })
  }

  const approve = useMutation({
    mutationFn: (row: PendingLeaveRow) =>
      frappe.call("campus_erp.api.personnel.approve_leave_application", {
        employee_id: row.employee_id,
        row_name: row.name,
        days_approved: form.days_approved ? Number(form.days_approved) : null,
        with_pay: form.with_pay ? Number(form.with_pay) : null,
        without_pay: form.without_pay ? Number(form.without_pay) : null,
        immediate_superior: form.immediate_superior || null,
        hrd_head: form.hrd_head || null,
      }),
    onSuccess: () => {
      toast.success("Leave approved")
      setApprovingRow(null)
      setForm(emptyApproveForm)
      invalidate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const reject = useMutation({
    mutationFn: (row: PendingLeaveRow) =>
      frappe.call("campus_erp.api.personnel.reject_leave_application", {
        employee_id: row.employee_id,
        row_name: row.name,
      }),
    onSuccess: () => {
      toast.success("Leave rejected")
      invalidate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return (
    <>
      <SearchTable<PendingLeaveRow>
        title="Pending Leave Approvals"
        queryKey="pending-leaves"
        method="campus_erp.api.personnel.list_pending_leaves"
        emptyMessage="No pending leave applications."
        rowKey={(row) => row.name}
        viewFields={viewFields}
        viewTitle={(row) => `${row.employee_name} — Leave Request`}
        columns={[
          { header: "Employee", render: (row) => row.employee_name },
          { header: "Department", render: (row) => row.department },
          { header: "Leave Type", render: (row) => row.leave_type },
          { header: "From", render: (row) => row.from_date },
          { header: "To", render: (row) => row.to_date },
          {
            header: "Actions",
            render: (row) => (
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  onClick={() => {
                    setForm(emptyApproveForm)
                    setApprovingRow(row)
                  }}
                  disabled={approve.isPending || reject.isPending}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => reject.mutate(row)}
                  disabled={approve.isPending || reject.isPending}
                >
                  Reject
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog
        open={approvingRow !== null}
        onOpenChange={(open) => {
          if (!open) setApprovingRow(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Approve Leave — {approvingRow?.employee_name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <Label htmlFor="days_approved">No. of Days Approved</Label>
              <Input
                id="days_approved"
                type="number"
                step="0.5"
                value={form.days_approved}
                onChange={(e) => setForm((f) => ({ ...f, days_approved: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="with_pay">With Pay</Label>
                <Input
                  id="with_pay"
                  type="number"
                  step="0.5"
                  value={form.with_pay}
                  onChange={(e) => setForm((f) => ({ ...f, with_pay: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="without_pay">Without Pay</Label>
                <Input
                  id="without_pay"
                  type="number"
                  step="0.5"
                  value={form.without_pay}
                  onChange={(e) => setForm((f) => ({ ...f, without_pay: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="immediate_superior">Immediate Superior</Label>
                <Input
                  id="immediate_superior"
                  value={form.immediate_superior}
                  onChange={(e) => setForm((f) => ({ ...f, immediate_superior: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="hrd_head">HRD Head</Label>
                <Input
                  id="hrd_head"
                  value={form.hrd_head}
                  onChange={(e) => setForm((f) => ({ ...f, hrd_head: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovingRow(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => approvingRow && approve.mutate(approvingRow)}
              disabled={approve.isPending}
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
