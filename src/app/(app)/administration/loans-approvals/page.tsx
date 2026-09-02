"use client"

import { PendingLoansTable } from "@/components/sms/PendingLoansTable"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PendingLoanApprovalsPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Link href="/administration" className="transition-colors hover:text-foreground">
                            Administration
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="font-medium text-foreground">Pending Approvals</span>
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">
                        Pending Loan Approvals
                    </h1>
                </div>
            </div>

            <PendingLoansTable />
        </div>
    )
}
