"use client"

import { PendingLoansTable } from "@/components/sms/PendingLoansTable"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PendingLoanApprovalsPage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Link href="/personnel/loans" title="Back to Loan Applications">
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
                        <Link href="/personnel/loans" className="transition-colors hover:text-foreground">
                            Loan Applications
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
