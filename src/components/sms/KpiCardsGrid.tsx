"use client"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface KpiCardData {
  title: string
  value: number | string | undefined
  icon: LucideIcon
  cardBg: string
  iconBg: string
}

interface KpiCardsGridProps {
  items: KpiCardData[]
  isLoading?: boolean
  /**
   * Tailwind grid-column classes, responsive. Defaults assume ~4-5 cards;
   * override for a different item count (e.g. "grid-cols-2 sm:grid-cols-4"
   * for a 4-card grid) since Tailwind can't compute this from items.length
   * at runtime.
   */
  columnsClassName?: string
}

/**
 * Reusable analytics KPI card row — small icon + label + big number.
 * Pass isLoading to show "…" instead of stale/zero values while a query
 * is in flight, rather than flashing 0 before real data arrives.
 */
export function KpiCardsGrid({
  items,
  isLoading = false,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
}: KpiCardsGridProps) {
  return (
    <div className={`grid gap-3 ${columnsClassName}`}>
      {items.map((kpi) => {
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
                {isLoading ? "…" : kpi.value ?? 0}
              </h3>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
