"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { frappe, getErrorMessage } from "@/lib/frappe"
import { EmployeeSearchField } from "@/components/sms/EmployeeSearchField"
import { DatePickerField } from "@/components/sms/DatePickerField"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export function OvertimeApplicationForm() {
  const queryClient = useQueryClient()

  const [employeeId, setEmployeeId] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [fromTime, setFromTime] = useState("")
  const [toTime, setToTime] = useState("")
  const [reason, setReason] = useState("")
  const [hours, setHours] = useState("")

  const mutation = useMutation({
    mutationFn: () =>
      frappe.call("campus_erp.api.personnel.add_overtime_application", {
        employee_id: employeeId,
        from_date: fromDate,
        to_date: toDate,
        from_time: fromTime,
        to_time: toTime,
        reason,
        number_of_hours: Number(hours),
      }),
    onSuccess: () => {
      toast.success("Overtime application submitted")
      setEmployeeId("")
      setFromDate("")
      setToDate("")
      setFromTime("")
      setToTime("")
      setReason("")
      setHours("")
      queryClient.invalidateQueries({ queryKey: ["recent-overtime"] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const canSave = employeeId && fromDate && toDate && fromTime && toTime && hours

  return (
    <div className="space-y-3 pt-6">
      <h1 className="text-base font-bold">File Overtime Application</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-sm font-medium">Employee</label>
          <EmployeeSearchField value={employeeId} onChange={setEmployeeId} />
        </div>

        <div>
          <label className="text-sm font-medium">From Date</label>
          <DatePickerField value={fromDate} onChange={setFromDate} />
        </div>

        <div>
          <label className="text-sm font-medium">To Date</label>
          <DatePickerField value={toDate} onChange={setToDate} />
        </div>

        <div>
          <label className="text-sm font-medium">From Time</label>
          <Input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium">To Time</label>
          <Input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium">Number of Hours</label>
          <Input type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
        </div>

        <div className="col-span-2">
          <label className="text-sm font-medium">Reason</label>
          <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
        </div>
      </div>

      <Button disabled={!canSave || mutation.isPending} onClick={() => mutation.mutate()}>
        {mutation.isPending ? "Saving..." : "Submit Overtime Application"}
      </Button>
    </div>
  )
}
