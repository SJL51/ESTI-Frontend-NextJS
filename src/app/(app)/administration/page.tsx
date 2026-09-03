import { CheckSquare, Landmark, Settings } from "lucide-react"
import { ModuleLandingPage } from "@/components/sms/ModuleLandingPage"

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
  },
]

export default function AdminPage() {
  return (
    <ModuleLandingPage
      title="Administration"
      subtitle="Approvals and system-wide configuration."
      badgeLabel="Administration Module"
      screens={SCREENS}
    />
  )
}
