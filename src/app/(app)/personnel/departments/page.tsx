"use client"
import { MasterDetailScreen } from "@/components/sms/MasterDetailScreen"
import { departmentSpec } from "@/lib/forms/personnel"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
export default function DepartmentsPage() {
  return <div className="space-y-4">
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
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Employees Directory
        </h1>
      </div>
    </div>
  <MasterDetailScreen spec={departmentSpec} />
  </div>
}
