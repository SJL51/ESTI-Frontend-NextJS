"use client"

import { LeaveApplicationForm } from "@/components/sms/LeaveApplicationForm"
import { RecentLeavesTable } from "@/components/sms/RecentLeavesTable"
import { PageHeader } from "@/components/sms/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Files, Clock, CalendarDays, CheckCheck } from "lucide-react";

// TODO: stub data — replace with a real call to get_personnel_kpis
// (or a dedicated leaves-KPI endpoint) once one exists. These four
// numbers are hardcoded and do not reflect live data.
const kpiData = [
    {
        title: "Total Applications",
        value: "142",
        icon: Files,
        cardBg: "bg-[#DBEAFE]/60 border-[#BFDBFE]",
        iconBg: "bg-[#93C5FD]/60 text-[#1E40AF]",
    },
    {
        title: "Currently On Leave",
        value: "12",
        icon: Clock,
        cardBg: "bg-[#FEF3C7]/60 border-[#FDE68A]",
        iconBg: "bg-[#FCD34D]/60 text-[#B45309]",
    },
    {
        title: "Upcoming Leaves",
        value: "24",
        icon: CalendarDays,
        cardBg: "bg-[#F3E8FF]/60 border-[#E9D5FF]",
        iconBg: "bg-[#D8B4FE]/60 text-[#6B21A8]",
    },
    {
        title: "Completed",
        value: "106",
        icon: CheckCheck,
        cardBg: "bg-[#DCFCE7]/60 border-[#BBF7D0]",
        iconBg: "bg-[#86EFAC]/60 text-[#15803D]",
    },
];

export default function LeavesApplicationPage() {
    return (
        <div className="space-y-4">
            {/* Navigation Header & Breadcrumbs */}
            <PageHeader backHref="/personnel" backLabel="Personnel" current="Leave Applications" />

            {/* Analytics KPI Cards Grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {kpiData.map((kpi) => {
                    const Icon = kpi.icon
                    return (
                        <Card
                            key={kpi.title}
                            className={`rounded-xl border shadow-sm transition-all ${kpi.cardBg}`}
                        >
                            <CardContent className="flex flex-col items-center justify-center p-2.5 text-center">
                                <div className={`mb-1.5 rounded-lg p-1.5 ${kpi.iconBg}`}>
                                    <Icon className="h-4 w-4" />
                                </div>
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                                    {kpi.title}
                                </p>
                                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                                    {kpi.value}
                                </h3>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Form + Table: stacks on small/medium screens, side-by-side at lg+ */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
                <div className="lg:col-span-2">
                    <LeaveApplicationForm />
                </div>
                <div className="lg:col-span-3">
                    <RecentLeavesTable />
                </div>
            </div>
        </div>
    )
}