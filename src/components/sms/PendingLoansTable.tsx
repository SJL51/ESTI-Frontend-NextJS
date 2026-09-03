"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { frappe, getErrorMessage } from "@/lib/frappe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createApprovalTable } from "@/components/sms/createApprovalTable"

export interface PendingLoanRow {
  name: string
  personnel_info: string
  employee_id: string
  employee_name: string
  department: string
  al_no: string
  date: string
  loan_type: string
  basic_pay: number
  previous_loan: number
  amount: number
  reason: string
  status: string
}

interface LoanFormState {
  interest_rate: string
  term: string
  deduction_schedule: string
  interest_cost: string
  amortization: string
  loan_balance: string
  recommended_by: string
  approved_by: string
}

/** Loan's compute-terms panel — has its own mutation, so it stays a real component. */
function LoanTermsSection({
  row,
  form,
  setForm,
}: {
  row: PendingLoanRow
  form: LoanFormState
  setForm: React.Dispatch<React.SetStateAction<LoanFormState>>
}) {
  const compute = useMutation({
    mutationFn: () =>
      frappe.call<{ interest_cost: number; amortization: number; loan_balance: number }>(
        "campus_erp.api.personnel.compute_loan_terms",
        {
          amount: row.amount,
          interest_rate: form.interest_rate || 0,
          term: form.term || 0,
        },
      ),
    onSuccess: (res) => {
      setForm((f) => ({
        ...f,
        interest_cost: String(res.interest_cost),
        amortization: String(res.amortization),
        loan_balance: String(res.loan_balance),
      }))
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  return (
    <div className="space-y-3 rounded-lg border p-3">
      <p className="text-xs font-medium text-muted-foreground">Loan Terms</p>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="interest_rate">Interest Rate (%)</Label>
          <Input
            id="interest_rate"
            type="number"
            step="0.1"
            value={form.interest_rate}
            onChange={(e) => setForm((f) => ({ ...f, interest_rate: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="term">Term (months)</Label>
          <Input
            id="term"
            type="number"
            value={form.term}
            onChange={(e) => setForm((f) => ({ ...f, term: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="deduction_schedule">Deduction Schedule</Label>
          <Select
            value={form.deduction_schedule || "1-15"}
            onValueChange={(value) => setForm((f) => ({ ...f, deduction_schedule: value ?? "1-15" }))}
          >
            <SelectTrigger id="deduction_schedule" className="w-full">
              <SelectValue placeholder="Select Schedule" />
            </SelectTrigger>
            <SelectContent align="end" className="z-50 w-max min-w-55">
              <SelectItem value="1-15">1–15 (1st cutoff only)</SelectItem>
              <SelectItem value="16-30">16–30 (2nd cutoff only)</SelectItem>
              <SelectItem value="Every Period">Every Period (both cutoffs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => compute.mutate()}
        disabled={compute.isPending || !form.interest_rate || !form.term}
      >
        {compute.isPending ? "Computing..." : "Compute"}
      </Button>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="interest_cost">Interest Cost</Label>
          <Input
            id="interest_cost"
            type="number"
            value={form.interest_cost}
            onChange={(e) => setForm((f) => ({ ...f, interest_cost: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="amortization">Amortization</Label>
          <Input
            id="amortization"
            type="number"
            value={form.amortization}
            onChange={(e) => setForm((f) => ({ ...f, amortization: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="loan_balance">Loan Balance</Label>
          <Input
            id="loan_balance"
            type="number"
            value={form.loan_balance}
            onChange={(e) => setForm((f) => ({ ...f, loan_balance: e.target.value }))}
          />
        </div>
      </div>
    </div>
  )
}

export const PendingLoansTable = createApprovalTable<PendingLoanRow, LoanFormState>({
  title: "Pending Loan Approvals",
  queryKey: "pending-loans",
  method: "campus_erp.api.personnel.list_pending_loans",
  emptyMessage: "No pending loan applications.",

  columns: [
    { header: "AL No.", render: (row) => row.al_no },
    { header: "Employee", render: (row) => row.employee_name },
    { header: "Department", render: (row) => row.department },
    { header: "Type", render: (row) => row.loan_type },
    { header: "Date Applied", render: (row) => row.date },
    { header: "Amount", render: (row) => row.amount },
  ],

  infoFields: [
    { label: "Employee Name", render: (row) => row.employee_name },
    { label: "Employee ID", render: (row) => row.employee_id },
    { label: "Department", render: (row) => row.department },
    { label: "Date Applied", render: (row) => row.date },
    { label: "Type of Loan", render: (row) => row.loan_type },
    { label: "Amount", render: (row) => row.amount },
    { label: "Basic Pay", render: (row) => row.basic_pay },
    { label: "Previous Loan", render: (row) => row.previous_loan },
  ],

  reasonField: { label: "Purpose", render: (row) => row.reason },

  dialogTitle: (row) => `Loan Processing — ${row.al_no}`,

  emptyForm: {
    interest_rate: "",
    term: "",
    deduction_schedule: "Every Period",
    interest_cost: "",
    amortization: "",
    loan_balance: "",
    recommended_by: "",
    approved_by: "",
  },

  MiddleSection: LoanTermsSection,

  renderDecisionFields: (form, setForm) => (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <Label htmlFor="recommended_by">Recommended By</Label>
        <Input
          id="recommended_by"
          value={form.recommended_by}
          onChange={(e) => setForm((f) => ({ ...f, recommended_by: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor="approved_by">Approved By</Label>
        <Input
          id="approved_by"
          value={form.approved_by}
          onChange={(e) => setForm((f) => ({ ...f, approved_by: e.target.value }))}
        />
      </div>
    </div>
  ),

  approveMethod: "campus_erp.api.personnel.approve_loan_application",
  rejectMethod: "campus_erp.api.personnel.reject_loan_application",

  buildApprovePayload: (row, form) => ({
    personnel_info: row.personnel_info,
    row_name: row.name,
    interest_rate: form.interest_rate ? Number(form.interest_rate) : null,
    term: form.term ? Number(form.term) : null,
    deduction_schedule: form.deduction_schedule || null,
    interest_cost: form.interest_cost ? Number(form.interest_cost) : null,
    amortization: form.amortization ? Number(form.amortization) : null,
    loan_balance: form.loan_balance ? Number(form.loan_balance) : null,
    recommended_by: form.recommended_by || null,
    approved_by: form.approved_by || null,
  }),
  buildRejectPayload: (row, form) => ({
    personnel_info: row.personnel_info,
    row_name: row.name,
    recommended_by: form.recommended_by || null,
    approved_by: form.approved_by || null,
  }),

  invalidateKeys: ["pending-loans", "recent-loans"],
  approveSuccessMessage: "Loan approved",
  rejectSuccessMessage: "Loan rejected",
})