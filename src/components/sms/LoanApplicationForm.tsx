"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { frappe, getErrorMessage } from "@/lib/frappe"
import { EmployeeSearchField } from "@/components/sms/EmployeeSearchField"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const LOAN_TYPES = ["Salary Loan", "SSS Loan", "Pag-IBIG Loan", "Other"]

export function LoanApplicationForm() {
    const queryClient = useQueryClient()

    const [employeeId, setEmployeeId] = useState("")
    const [loanType, setLoanType] = useState("")
    const [basicPay, setBasicPay] = useState("")
    const [previousLoan, setPreviousLoan] = useState("")
    const [amount, setAmount] = useState("")
    const [reason, setReason] = useState("")

    const mutation = useMutation({
        mutationFn: () =>
            frappe.call("campus_erp.api.personnel.add_loan_application", {
                personnel_info: employeeId,
                loan_type: loanType,
                basic_pay: basicPay || undefined,
                previous_loan: previousLoan || undefined,
                amount,
                reason,
            }),
        onSuccess: (res: any) => {
            toast.success(`Loan application saved (${res?.al_no ?? ""})`)
            setEmployeeId("")
            setLoanType("")
            setBasicPay("")
            setPreviousLoan("")
            setAmount("")
            setReason("")
            queryClient.invalidateQueries({ queryKey: ["recent-loans"] })
        },
        onError: (err) => toast.error(getErrorMessage(err)),
    })

    const canSave = employeeId && loanType && amount

    return (
        <div className="space-y-3 pt-6">
            <h1 className="text-base font-bold">File Loan Application</h1>

            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="text-sm font-medium">Employee</label>
                    <EmployeeSearchField value={employeeId} onChange={setEmployeeId} />
                </div>

                <div>
                    <label className="text-sm font-medium">Type of Loan</label>
                    <Select onValueChange={(value) => setLoanType(value ?? "")} value={loanType}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {LOAN_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm font-medium">Amount</label>
                    <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>

                <div>
                    <label className="text-sm font-medium">Basic Pay</label>
                    <Input type="number" value={basicPay} onChange={(e) => setBasicPay(e.target.value)} />
                </div>

                <div>
                    <label className="text-sm font-medium">Previous Loan</label>
                    <Input type="number" value={previousLoan} onChange={(e) => setPreviousLoan(e.target.value)} />
                </div>

                <div className="col-span-2">
                    <label className="text-sm font-medium">Reason</label>
                    <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
                </div>
            </div>

            <Button disabled={!canSave || mutation.isPending} onClick={() => mutation.mutate()}>
                {mutation.isPending ? "Saving..." : "Save"}
            </Button>
        </div>
    )
}
