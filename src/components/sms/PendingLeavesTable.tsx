"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { InfoField } from "@/components/sms/InfoField"
import { ApprovalProcessingTable } from "@/components/sms/ApprovalProcessingTable"
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
  vacation_leave: number
  sick_leave: number
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
  return (
    <ApprovalProcessingTable<PendingLeaveRow, ApproveFormState>
      title="Pending Leave Approvals"
      queryKey="pending-leaves"
      method="campus_erp.api.personnel.list_pending_leaves"
      emptyMessage="No pending leave applications."
      viewFields={viewFields}
      viewTitle={(row) => `${row.employee_name} — Leave Request`}
      columns={[
        { header: "Employee", render: (row) => row.employee_name },
        { header: "Department", render: (row) => row.department },
        { header: "Leave Type", render: (row) => row.leave_type },
        { header: "Date Applied", render: (row) => row.date },
        { header: "From", render: (row) => row.from_date },
        { header: "To", render: (row) => row.to_date },
      ]}
      dialogTitle={(row) => `Leave Processing — ${row.employee_name}`}
      emptyForm={emptyApproveForm}
      renderInfoGrid={(row) => (
        <>
          <InfoField label="Employee Name" value={row.employee_name} />
          <InfoField label="Employee ID" value={row.employee_id} />
          <InfoField label="Department" value={row.department} />
          <InfoField label="Status" value={row.status} />
          <InfoField label="Type of Leave" value={row.leave_type} />
          <InfoField label="Date Applied" value={row.date} />
          <InfoField label="From" value={row.from_date} />
          <InfoField label="To" value={row.to_date} />
        </>
      )}
      renderReasonPanel={(row) => (
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Reason</Label>
          <Textarea
            value={row.reason ?? ""}
            readOnly
            rows={2}
            className="min-h-[70px] resize-none bg-muted/30 focus-visible:ring-0"
          />
        </div>
      )}
      MiddleSection={({ row }) => (
        <div className="space-y-2 rounded-lg border bg-card p-3">
          <p className="text-xs font-semibold text-muted-foreground">Leave Credits</p>
          <div className="grid grid-cols-2 gap-3">
            <InfoField label="Vacation Balance" value={row.vacation_leave} />
            <InfoField label="Sick Balance" value={row.sick_leave} />
          </div>
        </div>
      )}
      renderDecisionFields={(form, setForm) => (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="days_approved">No. of Days Approved</Label>
            <Input
              id="days_approved"
              type="number"
              step="0.5"
              placeholder="0.0"
              value={form.days_approved}
              onChange={(e) => setForm((f) => ({ ...f, days_approved: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="with_pay">With Pay</Label>
              <Input
                id="with_pay"
                type="number"
                step="0.5"
                placeholder="0.0"
                value={form.with_pay}
                onChange={(e) => setForm((f) => ({ ...f, with_pay: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="without_pay">Without Pay</Label>
              <Input
                id="without_pay"
                type="number"
                step="0.5"
                placeholder="0.0"
                value={form.without_pay}
                onChange={(e) => setForm((f) => ({ ...f, without_pay: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="immediate_superior">Immediate Superior</Label>
              <Input
                id="immediate_superior"
                placeholder="Name or ID"
                value={form.immediate_superior}
                onChange={(e) => setForm((f) => ({ ...f, immediate_superior: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hrd_head">HRD Head</Label>
              <Input
                id="hrd_head"
                placeholder="Name or ID"
                value={form.hrd_head}
                onChange={(e) => setForm((f) => ({ ...f, hrd_head: e.target.value }))}
              />
            </div>
          </div>
        </div>
      )}
      approveMethod="campus_erp.api.personnel.approve_leave_application"
      rejectMethod="campus_erp.api.personnel.reject_leave_application"
      buildApprovePayload={(row, form) => ({
        personnel_info: row.personnel_info,
        row_name: row.name,
        days_approved: form.days_approved ? Number(form.days_approved) : null,
        with_pay: form.with_pay ? Number(form.with_pay) : null,
        without_pay: form.without_pay ? Number(form.without_pay) : null,
        immediate_superior: form.immediate_superior || null,
        hrd_head: form.hrd_head || null,
      })}
      buildRejectPayload={(row, form) => ({
        personnel_info: row.personnel_info,
        row_name: row.name,
        immediate_superior: form.immediate_superior || null,
        hrd_head: form.hrd_head || null,
      })}
      invalidateKeys={["pending-leaves", "recent-leaves"]}
      approveSuccessMessage="Leave approved"
      rejectSuccessMessage="Leave rejected"
    />
  )
}