"use client"

import { ApprovalProcessingTable, type ApprovableRow } from "@/components/sms/ApprovalProcessingTable"

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

interface OvertimeDecisionForm {}

export function PendingOvertimeTable() {
  return (
    <ApprovalProcessingTable<OvertimeRow, OvertimeDecisionForm>
      title="Pending Overtime Applications"
      queryKey="pending-overtime"
      method="campus_erp.api.personnel.list_pending_overtime"
      columns={[
        { header: "Employee", render: (row) => row.fullname },
        { header: "Date", render: (row) => `${row.from_date} – ${row.to_date}` },
        { header: "Hours", render: (row) => row.number_of_hours },
      ]}
      dialogTitle={(row) => `Overtime — ${row.fullname}`}
      emptyForm={{}}
      renderInfoGrid={(row) => (
        <>
          <div><div className="text-xs text-muted-foreground">Employee</div><div>{row.fullname}</div></div>
          <div><div className="text-xs text-muted-foreground">Employee ID</div><div>{row.employee_id}</div></div>
          <div><div className="text-xs text-muted-foreground">Date</div><div>{row.from_date} – {row.to_date}</div></div>
          <div><div className="text-xs text-muted-foreground">Time</div><div>{row.from_time} – {row.to_time}</div></div>
          <div><div className="text-xs text-muted-foreground">Hours</div><div>{row.number_of_hours}</div></div>
        </>
      )}
      renderReasonPanel={(row) => (
        <div>
          <div className="text-xs text-muted-foreground mb-1">Reason</div>
          <div className="text-sm">{row.reason}</div>
        </div>
      )}
      renderDecisionFields={() => (
        <div className="text-sm text-muted-foreground">
          Review the request, then Approve or Reject below.
        </div>
      )}
      approveMethod="campus_erp.api.personnel.approve_overtime_application"
      rejectMethod="campus_erp.api.personnel.reject_overtime_application"
      buildApprovePayload={(row) => ({ personnel_info: row.personnel_info, row_name: row.name })}
      buildRejectPayload={(row) => ({ personnel_info: row.personnel_info, row_name: row.name })}
      invalidateKeys={["pending-overtime", "recent-overtime"]}
    />
  )
}
