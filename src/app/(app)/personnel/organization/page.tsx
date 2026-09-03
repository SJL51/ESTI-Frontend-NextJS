"use client"
import { MasterDetailScreen } from "@/components/sms/MasterDetailScreen"
import { departmentSpec } from "@/lib/forms/personnel"
import { PageHeader } from "@/components/sms/PageHeader"

export default function DepartmentsPage() {
  return <div className="space-y-4">
    <PageHeader backHref="/personnel" backLabel="Personnel" current="Departments Directory" />
  <MasterDetailScreen spec={departmentSpec} />
  </div>
}
