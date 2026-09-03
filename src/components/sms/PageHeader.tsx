"use client"

import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  backHref: string
  backLabel: string
  current: string
}

/**
 * Shared "back arrow + breadcrumb" header for feature pages one level
 * below a module landing page (e.g. /personnel/leaves under /personnel).
 * Extracted 2026-09-03 — was previously copy-pasted verbatim across
 * administration/leaves-approvals, administration/loans-approvals,
 * personnel/leaves, personnel/loans, personnel/organization,
 * personnel/employees, and personnel/schedules.
 */
export function PageHeader({ backHref, backLabel, current }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Link href={backHref} title={`Back to ${backLabel}`}>
        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>

      <div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href={backHref} className="transition-colors hover:text-foreground">
            {backLabel}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">{current}</span>
        </div>
      </div>
    </div>
  )
}
