import Link from "next/link"
import {
  Users,
  ArrowRight,
  CalendarDays,
  Building2,
  Banknote,
  Clock,
  ShieldAlert,
  FileText,
} from "lucide-react"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    href: "/personnel/organization",
    title: "Departments & Roles",
    description: "Structure departments, assign heads of units, and manage official designations.",
    icon: Building2,
    badge: "Setup",
    actionText: "Manage Structure",
  },
  {
    href: "/personnel/reports",
    title: "Personnel Reports",
    description: "Generate headcount, attendance summary, leave usage, and organizational metrics.",
    icon: FileText,
    badge: "Analytics",
    actionText: "View Reports",
  },
]

export default function PersonnelPage() {
  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Personnel</h1>
          <p className="text-xs text-muted-foreground">
            Manage employee directory, schedules, organization structure, and requests.
          </p>
        </div>
        <Badge variant="outline" className="text-[11px] font-normal">
          Personnel Module
        </Badge>
      </div>

      {/* Compact Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {SCREENS.map((s) => {
          const Icon = s.icon

          return (
            <Link key={s.href} href={s.href} className="group outline-none">
              <Card className="flex h-full flex-col justify-between p-3.5 transition-all duration-150 hover:border-primary/50 hover:bg-muted/30 hover:shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    {s.badge && (
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {s.badge}
                      </span>
                    )}
                  </div>

                  <div>
                    <CardTitle className="text-sm font-medium group-hover:text-primary">
                      {s.title}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2 text-xs leading-snug">
                      {s.description}
                    </CardDescription>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-primary">
                  <span>{s.actionText}</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}