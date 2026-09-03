import {
  Users,
  CalendarDays,
  Building2,
  Banknote,
  Clock,
  ShieldAlert,
  ClockPlus,
} from "lucide-react"
import { ModuleLandingPage } from "@/components/sms/ModuleLandingPage"

const SCREENS = [
  {
    href: "/personnel/employees",
    title: "Employees Directory",
    description: "Manage employee profiles, designations, ID assignments, and employment status.",
    icon: Users,
    badge: "Core Data",
    actionText: "Open Directory",
  },
  {
    href: "/personnel/leaves",
    title: "Leaves & Time Off",
    description: "Review pending applications, track leave balances, and configure vacation or sick policies.",
    icon: CalendarDays,
    badge: "Management",
    actionText: "Manage Leaves",
  },
  {
    href: "/personnel/loans",
    title: "Loans & Advance Pay",
    description: "Process new loan requests, monitor active payment balances, and view approval status.",
    icon: Banknote,
    badge: "Financial",
    actionText: "Manage Loans",
  },
  {
    href: "/personnel/deductions",
    title: "Deduction Rules",
    description: "Configure statutory, company-wide, and custom recurring payroll deductions.",
    icon: ShieldAlert,
    badge: "Payroll Setup",
    actionText: "Manage Deductions",
  },
  {
    href: "/personnel/schedules",
    title: "Attendance & Holidays",
    description: "Define work shifts, roster schedules, and maintain company calendar holidays.",
    icon: Clock,
    badge: "Operations",
    actionText: "Configure Schedule",
  },
  {
    href: "/personnel/overtime",
    title: "Overtime Application",
    description: "Submit overtime requests, track approval status, and manage extra work hours.",
    icon: ClockPlus,
    badge: "Requests",
    actionText: "Apply Overtime",
  },
]

export default function PersonnelPage() {
  return (
    <ModuleLandingPage
      title="Personnel"
      subtitle="Manage employee directory, schedules, organization structure, and requests."
      badgeLabel="Personnel Module"
      screens={SCREENS}
    />
  )
}
