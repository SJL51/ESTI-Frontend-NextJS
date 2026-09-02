"use client"
import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { frappe } from "@/lib/frappe"
import { MasterDetailScreen } from "@/components/sms/MasterDetailScreen"
import { KpiCardsGrid, type KpiCardData } from "@/components/sms/KpiCardsGrid"
import { employeeSpec, employeeWizardLayout } from "@/lib/forms/personnel"
import {
  Users,
  UserCheck,
  Clock,
  Briefcase,
  Hourglass,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface PersonnelKpis {
  total: number
  regular: number
  contractual: number
  part_timer: number
  probationary: number
}

export default function EmployeesPage() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ["personnel-kpis"],
    queryFn: () => frappe.call<PersonnelKpis>("campus_erp.api.personnel.get_personnel_kpis"),
  })

  const kpiData: KpiCardData[] = [
    {
      title: "Total Personnel",
      value: kpis?.total,
      icon: Users,
      cardBg: "bg-[#DCFCE7]/60 border-[#BBF7D0]",
      iconBg: "bg-[#86EFAC]/60 text-[#15803D]",
    },
    {
      title: "Regular",
      value: kpis?.regular,
      icon: UserCheck,
      cardBg: "bg-[#DBEAFE]/60 border-[#BFDBFE]",
      iconBg: "bg-[#93C5FD]/60 text-[#1E40AF]",
    },
    {
      title: "Contractual",
      value: kpis?.contractual,
      icon: Briefcase,
      cardBg: "bg-[#FEF3C7]/60 border-[#FDE68A]",
      iconBg: "bg-[#FCD34D]/60 text-[#B45309]",
    },
    {
      title: "Part Timer",
      value: kpis?.part_timer,
      icon: Clock,
      cardBg: "bg-[#F3E8FF]/60 border-[#E9D5FF]",
      iconBg: "bg-[#D8B4FE]/60 text-[#6B21A8]",
    },
    {
      title: "Probationary",
      value: kpis?.probationary,
      icon: Hourglass,
      cardBg: "bg-[#FCE7F3]/60 border-[#FBCFE8]",
      iconBg: "bg-[#F9A8D4]/60 text-[#9D174D]",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Navigation Header & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Link href="/personnel" title="Back to Personnel">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/personnel" className="transition-colors hover:text-foreground">
              Personnel
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">Employees Directory</span>
          </div>
        </div>
      </div>

      {/* Analytics KPI Cards Grid */}
      <KpiCardsGrid items={kpiData} isLoading={isLoading} />

      <MasterDetailScreen spec={employeeSpec} wizard={employeeWizardLayout} />
    </div>
  )
}
