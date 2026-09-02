import Link from "next/link"
import { CheckSquare, ArrowRight, Landmark, Settings } from "lucide-react"

import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const SCREENS = [
  {
    href: "/administration/leaves-approvals",
    title: "Leaves Approval",
    description: "Review, approve, or reject pending employee leave applications and track leave balances.",
    icon: CheckSquare,
    badge: "Approval",
  },
  {
    href: "/administration/loans-approvals",
    title: "Loans Approval",
    description: "Evaluate, manage, and process submitted employee loan applications and repayment terms.",
    icon: Landmark,
    badge: "Approval",
  },
  {
    href: "/administration/configuration",
    title: "Configuration",
    description: "Manage system preferences, integration settings, and administrative controls.",
    icon: Settings,
    badge: "System",
  }
]

export default function AdminPage() {
  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Administration</h1>
          <p className="text-xs text-muted-foreground">
            Employee directory and staff records.
          </p>
        </div>
        <Badge variant="outline" className="text-[11px] font-normal">
          Administration Module
        </Badge>
      </div>

      {/* Compact Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {SCREENS.map((s) => {
          const Icon = s.icon

          return (
            <Link key={s.href} href={s.href} className="group outline-none">
              <Card className="flex flex-col justify-between p-3.5 transition-all duration-150 hover:border-primary/50 hover:bg-muted/30 hover:shadow-sm">
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
                  <span>Open Directory</span>
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