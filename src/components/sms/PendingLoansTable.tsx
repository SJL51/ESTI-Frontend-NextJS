"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { frappe, getErrorMessage } from "@/lib/frappe"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { SearchTable } from "@/components/sms/SearchTable"
import type { RecordViewField } from "@/components/sms/RecordViewDialog"

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

interface ApproveFormState {
  interest_rate: string
  term: string
  deduction_schedule: string
  interest_cost: string
  amortization: string
  loan_balance: string
  recommended_by: string
  approved_by: string
}

const emptyApproveForm: ApproveFormState = {
  interest_rate: "",
  term: "",
  deduction_schedule: "Every Period",
  interest_cost: "",
  amortization: "",
  loan_balance: "",
  recommended_by: "",
  approved_by: "",
}

const viewFields: RecordViewField<PendingLoanRow>[] = [
  { label: "AL No.", render: (row) => row.al_no },
  { label: "Employee", render: (row) => row.employee_name },
  { label: "Department", render: (row) => row.department },
  { label: "Loan Type", render: (row) => row.loan_type },
  { label: "Date Applied", render: (row) => row.date },
  { label: "Amount", render: (row) => row.amount },
  { label: "Basic Pay", render: (row) => row.basic_pay },
  { label: "Previous Loan", render: (row) => row.previous_loan },
  { label: "Reason", render: (row) => row.reason },
]

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="rounded-md border bg-muted/40 px-2 py-1.5 text-sm">
        {value === "" || value === null || value === undefined ? "—" : value}
      </p>
    </div>
  )
}

export function PendingLoansTable() {
  const queryClient = useQueryClient()
  const [approvingRow, setApprovingRow] = useState<PendingLoanRow | null>(null)
  const [form, setForm] = useState<ApproveFormState>(emptyApproveForm)

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["pending-loans"] })
    queryClient.invalidateQueries({ queryKey: ["recent-loans"] })
  }

  const closeDialog = () => {
    setApprovingRow(null)
    setForm(emptyApproveForm)
  }

  const compute = useMutation({
    mutationFn: () =>
      frappe.call<{ interest_cost: number; amortization: number; loan_balance: number }>(
        "campus_erp.api.personnel.compute_loan_terms",
        {
          amount: approvingRow?.amount,
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

  const approve = useMutation({
    mutationFn: (row: PendingLoanRow) =>
      frappe.call("campus_erp.api.personnel.approve_loan_application", {
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
    onSuccess: () => {
      toast.success("Loan approved")
      closeDialog()
      invalidate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const reject = useMutation({
    mutationFn: (row: PendingLoanRow) =>
      frappe.call("campus_erp.api.personnel.reject_loan_application", {
        personnel_info: row.personnel_info,
        row_name: row.name,
        recommended_by: form.recommended_by || null,
        approved_by: form.approved_by || null,
      }),
    onSuccess: () => {
      toast.success("Loan rejected")
      closeDialog()
      invalidate()
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })

  const busy = approve.isPending || reject.isPending || compute.isPending

  return (
    <>
      <SearchTable<PendingLoanRow>
        title="Pending Loan Approvals"
        queryKey="pending-loans"
        method="campus_erp.api.personnel.list_pending_loans"
        emptyMessage="No pending loan applications."
        rowKey={(row) => row.name}
        viewFields={viewFields}
        viewTitle={(row) => `${row.employee_name} — Loan Application`}
        columns={[
          { header: "AL No.", render: (row) => row.al_no },
          { header: "Employee", render: (row) => row.employee_name },
          { header: "Department", render: (row) => row.department },
          { header: "Type", render: (row) => row.loan_type },
          { header: "Date Applied", render: (row) => row.date },
          { header: "Amount", render: (row) => row.amount },
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
                  Process
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog
        open={approvingRow !== null}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Loan Processing — {approvingRow?.al_no}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <InfoField label="Employee Name" value={approvingRow?.employee_name} />
              <InfoField label="Employee ID" value={approvingRow?.employee_id} />
              <InfoField label="Department" value={approvingRow?.department} />
              <InfoField label="Date Applied" value={approvingRow?.date} />
              <InfoField label="Type of Loan" value={approvingRow?.loan_type} />
              <InfoField label="Amount" value={approvingRow?.amount} />
              <InfoField label="Basic Pay" value={approvingRow?.basic_pay} />
              <InfoField label="Previous Loan" value={approvingRow?.previous_loan} />
            </div>

            <div className="space-y-1">
              <Label>Purpose</Label>
              <Textarea value={approvingRow?.reason ?? ""} readOnly rows={2} className="resize-none bg-muted/40" />
            </div>

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
                    value={form.deduction_schedule}
                    onValueChange={(value) => setForm((f) => ({ ...f, deduction_schedule: value ?? "Every Period" }))}
                  >
                    <SelectTrigger id="deduction_schedule" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              variant="destructive"
              onClick={() => approvingRow && reject.mutate(approvingRow)}
              disabled={busy}
            >
              {reject.isPending ? "Rejecting..." : "Reject"}
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="outline" onClick={closeDialog} disabled={busy}>
                Cancel
              </Button>
              <Button
                onClick={() => approvingRow && approve.mutate(approvingRow)}
                disabled={busy}
              >
                {approve.isPending ? "Approving..." : "Approve"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
