"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { frappe, getErrorMessage } from "@/lib/frappe"
import { EmployeeSearchField } from "@/components/sms/EmployeeSearchField"
import { DatePickerField } from "@/components/sms/DatePickerField"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const LEAVE_TYPES = ["Vacation", "Sick", "Emergency", "Paternal", "Maternal", "Others"]

export function LeaveApplicationForm() {
    const queryClient = useQueryClient()

    const [employeeId, setEmployeeId] = useState("")
    const [leaveType, setLeaveType] = useState("")
    const [otherReason, setOtherReason] = useState("")
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [halfDay, setHalfDay] = useState(false)
    const [reason, setReason] = useState("")

    const mutation = useMutation({
        mutationFn: () =>
            frappe.call("campus_erp.api.personnel.add_leave_application", {
                employee_id: employeeId,
                leave_type: leaveType,
                other_leave_reason: leaveType === "Others" ? otherReason : undefined,
                from_date: fromDate,
                to_date: toDate,
                half_day: halfDay,
                reason,
            }),
        onSuccess: () => {
            toast.success("Leave application saved")
            setEmployeeId("")
            setLeaveType("")
            setOtherReason("")
            setFromDate("")
            setToDate("")
            setHalfDay(false)
            setReason("")
            queryClient.invalidateQueries({ queryKey: ["recent-leaves"] })
        },
        onError: (err) => toast.error(getErrorMessage(err)),
    })

    const canSave = employeeId && leaveType && fromDate && toDate

    return (
        <div className="space-y-3 pt-6">
            <h1 className="text-base font-bold">File Leave Application</h1>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Employee</label>
                    <EmployeeSearchField value={employeeId} onChange={setEmployeeId} />
                </div>

                <div>
                    <label className="text-sm font-medium">Leave Type</label>
                    <Select onValueChange={(value) => setLeaveType(value ?? "")} value={leaveType}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {LEAVE_TYPES.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm font-medium">From</label>
                    <DatePickerField value={fromDate} onChange={setFromDate} />
                </div>

                <div>
                    <label className="text-sm font-medium">To</label>
                    <DatePickerField value={toDate} onChange={setToDate} />
                </div>

                {leaveType === "Others" && (
                    <div className="col-span-2">
                        <label className="text-sm font-medium">Specify Reason</label>
                        <Textarea value={otherReason} onChange={(e) => setOtherReason(e.target.value)} rows={2} />
                    </div>
                )}

                <div className="col-span-2">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={halfDay} onChange={(e) => setHalfDay(e.target.checked)} />
                        Half Day
                    </label>
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