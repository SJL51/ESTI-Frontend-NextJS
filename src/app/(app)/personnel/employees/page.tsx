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
} from "lucide-react"
import { PageHeader } from "@/components/sms/PageHeader"

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
      <PageHeader backHref="/personnel" backLabel="Personnel" current="Employees Directory" />

      {/* Analytics KPI Cards Grid */}
      <KpiCardsGrid items={kpiData} isLoading={isLoading} />

      <MasterDetailScreen spec={employeeSpec} wizard={employeeWizardLayout} />
    </div>
  )
}
