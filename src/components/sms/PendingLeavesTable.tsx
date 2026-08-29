"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { frappe, getErrorMessage } from "@/lib/frappe"
import { Button } from "@/components/ui/button"
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

const viewFields: RecordViewField<PendingLeaveRow>[] = [
  { label: "Employee", render: (row) => row.employee_name },
  { label: "Department", render: (row) => row.department },
  { label: "Leave Type", render: (row) => row.leave_type },
  { label: "From", render: (row) => row.from_date },
  { label: "To", render: (row) => row.to_date },
  { label: "Reason", render: (row) => row.reason },
  { label: "Date Applied", render: (row) => row.date },
]

/**
 * Cross-employee "needs a decision" queue — the ~85/~19-legacy-category
 * kind of screen this isn't, but the same underlying idea as
 * RecentLeavesTable: a SearchTable over list_pending_leaves, with an
 * Approve/Reject action column wired to the two new whitelisted methods.
 */
export function PendingLeavesTable() {
  const queryClient = useQueryClient()

  const decide = useMutation({
    mutationFn: ({ row, approve }: { row: PendingLeaveRow; approve: boolean }) =>
      frappe.call(
        approve
          ? "campus_erp.api.personnel.approve_leave_application"
          : "campus_erp.api.personnel.reject_leave_application",
        { employee_id: row.employee_id, row_name: row.name },
      ),
    onSuccess: (_data, { approve }) => {
      toast.success(approve ? "Leave approved" : "Leave rejected")
      queryClient.invalidateQueries({ queryKey: ["pending-leaves"] })
      queryClient.invalidateQueries({ queryKey: ["recent-leaves"] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return (
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
              <Button size="sm" onClick={() => decide.mutate({ row, approve: true })} disabled={decide.isPending}>
                Approve
              </Button>
              <Button size="sm" variant="destructive" onClick={() => decide.mutate({ row, approve: false })} disabled={decide.isPending}>
                Reject
              </Button>
            </div>
          ),
        },
      ]}
    />
  )
}
