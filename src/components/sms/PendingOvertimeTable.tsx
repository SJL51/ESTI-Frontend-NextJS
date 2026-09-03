"use client"

import { createApprovalTable } from "@/components/sms/createApprovalTable"
import type { ApprovableRow } from "@/components/sms/ApprovalProcessingTable"

interface OvertimeRow extends ApprovableRow {
  employee_id: string
  fullname: string
  from_date: string
  to_date: string
  from_time: string
  to_time: string
  reason: string
  number_of_hours: number
  status: string
}

export const PendingOvertimeTable = createApprovalTable<OvertimeRow, {}>({
  title: "Pending Overtime Applications",
  queryKey: "pending-overtime",
  method: "campus_erp.api.personnel.list_pending_overtime",

  columns: [
    { header: "Employee", render: (row) => row.fullname },
    { header: "Date", render: (row) => `${row.from_date} – ${row.to_date}` },
    { header: "Hours", render: (row) => row.number_of_hours },
  ],

  infoFields: [
    { label: "Employee", render: (row) => row.fullname },
    { label: "Employee ID", render: (row) => row.employee_id },
    { label: "Date", render: (row) => `${row.from_date} – ${row.to_date}` },
    { label: "Time", render: (row) => `${row.from_time} – ${row.to_time}` },
    { label: "Hours", render: (row) => row.number_of_hours },
  ],

  reasonField: { render: (row) => row.reason },

  dialogTitle: (row) => `Overtime — ${row.fullname}`,
  emptyForm: {},

  renderDecisionFields: () => (
    <div className="text-sm text-muted-foreground">
      Review the request, then Approve or Reject below.
    </div>
  ),

  approveMethod: "campus_erp.api.personnel.approve_overtime_application",
  rejectMethod: "campus_erp.api.personnel.reject_overtime_application",
  buildApprovePayload: (row) => ({ personnel_info: row.personnel_info, row_name: row.name }),
  buildRejectPayload: (row) => ({ personnel_info: row.personnel_info, row_name: row.name }),

  invalidateKeys: ["pending-overtime", "recent-overtime"],
})