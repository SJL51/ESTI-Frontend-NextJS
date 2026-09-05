"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { frappe, getErrorMessage } from "@/lib/frappe"
import { Button } from "@/components/ui/button"
import { SearchTable } from "@/components/sms/SearchTable"

interface ApprovedLoanRow {
  name: string
  personnel_info: string
  employee_id: string
  employee_name: string
  department: string
  al_no: string
  date: string
  loan_type: string
  amount: number
  interest_rate: number
  term: number
  interest_cost: number
  amortization: number
  loan_balance: number
  recommended_by: string
  approved_by: string
}

function ReleaseAction({ row }: { row: ApprovedLoanRow }) {
  const queryClient = useQueryClient()
  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => frappe.me(),
    staleTime: Infinity,
  })
  const release = useMutation({
    mutationFn: () =>
      frappe.call("campus_erp.api.personnel.release_loan_application", {
        personnel_info: row.personnel_info,
        row_name: row.name,
        released_by: currentUser?.user,
      }),
    onSuccess: () => {
      toast.success("Loan released")
      queryClient.invalidateQueries({ queryKey: ["approved-loans"] })
      queryClient.invalidateQueries({ queryKey: ["recent-loans"] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  if (!row.approved_by) {
    return (
      <span className="text-xs text-muted-foreground" title="No Approved By value on record">
        Missing approval
      </span>
    )
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={(e) => {
        e.stopPropagation()
        release.mutate()
      }}
      disabled={release.isPending || !currentUser?.user}
    >
      {release.isPending ? "Releasing..." : "Release"}
    </Button>
  )
}

export function ApprovedLoansTable() {
  return (
    <SearchTable<ApprovedLoanRow>
      title="Approved Loans - Pending Release"
      searchPlaceholder="Search by employee name..."
      queryKey="approved-loans"
      method="campus_erp.api.personnel.list_approved_loans"
      emptyMessage="No approved loans awaiting release."
      columns={[
        { header: "AL No.", render: (row) => row.al_no },
        { header: "Employee", render: (row) => row.employee_name },
        { header: "Department", render: (row) => row.department },
        { header: "Type", render: (row) => row.loan_type },
        { header: "Amount", render: (row) => row.amount },
        { header: "Date", render: (row) => row.date },
        { header: "Action", render: (row) => <ReleaseAction row={row} /> },
      ]}
      viewTitle={(row) => row.employee_name}
      viewFields={[
        { label: "AL No.", render: (row) => row.al_no },
        { label: "Employee", render: (row) => row.employee_name },
        { label: "Department", render: (row) => row.department },
        { label: "Loan Type", render: (row) => row.loan_type },
        { label: "Amount", render: (row) => row.amount },
        { label: "Interest Rate", render: (row) => `${row.interest_rate}%` },
        { label: "Term (months)", render: (row) => row.term },
        { label: "Interest Cost", render: (row) => row.interest_cost },
        { label: "Amortization", render: (row) => row.amortization },
        { label: "Loan Balance", render: (row) => row.loan_balance },
        { label: "Recommended By", render: (row) => row.recommended_by || "-" },
        { label: "Approved By", render: (row) => row.approved_by || "-" },
      ]}
    />
  )
}

