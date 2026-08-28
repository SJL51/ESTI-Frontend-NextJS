"use client"
import { MasterDetailScreen } from "@/components/sms/MasterDetailScreen"
import { departmentSpec } from "@/lib/forms/personnel"
export default function DepartmentsPage() {
  return <MasterDetailScreen spec={departmentSpec} />
}
