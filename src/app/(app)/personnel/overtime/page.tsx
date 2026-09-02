"use client"
import { OvertimeApplicationForm } from "@/components/sms/OvertimeApplicationForm"
import { RecentOvertimeTable } from "@/components/sms/RecentOvertimeTable"

export default function OvertimePage() {
  return (
    <div className="space-y-8">
      <OvertimeApplicationForm />
      <RecentOvertimeTable />
    </div>
  )
}
