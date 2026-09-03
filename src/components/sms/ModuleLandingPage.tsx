import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface ModuleScreen {
  href: string
  title: string
  description: string
  icon: LucideIcon
  badge?: string
  /** Footer link text, e.g. "Manage Leaves". Defaults to "Open Directory". */
  actionText?: string
}

interface ModuleLandingPageProps {
  title: string
  subtitle: string
  badgeLabel: string
  screens: ModuleScreen[]
  emptyMessage?: string
}

/**
 * Shared module-index layout: header + badge + a responsive card grid
 * linking into each screen. Extracted 2026-09-03 — was previously
 * copy-pasted (with drifting subtitle/badge text — see the
 * Administration-vs-Configuration bug in FILE_LOCATIONS.md) across the
 * administration, administration/configuration, and personnel landing
 * pages. finance/page.tsx and registrar/page.tsx use a simpler
 * icon-less card variant and were left as-is — not the same shape.
 */
export function ModuleLandingPage({
  title,
  subtitle,
  badgeLabel,
  screens,
  emptyMessage = "No screens here yet.",
}: ModuleLandingPageProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Badge variant="outline" className="text-[11px] font-normal">
          {badgeLabel}
        </Badge>
      </div>

      {screens.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {screens.map((s) => {
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
                    <span>{s.actionText ?? "Open Directory"}</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
