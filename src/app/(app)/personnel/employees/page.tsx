"use client"
import { MasterDetailScreen } from "@/components/sms/MasterDetailScreen"
import { employeeSpec, employeeWizardLayout } from "@/lib/forms/personnel"

export default function EmployeesPage() {
  return <MasterDetailScreen spec={employeeSpec} wizard={employeeWizardLayout} />
}
