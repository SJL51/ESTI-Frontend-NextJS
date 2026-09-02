"use client"

import { LoanApplicationForm } from "@/components/sms/LoanApplicationForm"
import { RecentLoansTable } from "@/components/sms/RecentLoansTable"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LoanApplicationPage() {
    return (
        <div className="space-y-4">
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
                        <span className="font-medium text-foreground">Loan Applications</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
                <div className="lg:col-span-2">
                    <LoanApplicationForm />
                </div>
                <div className="lg:col-span-3">                
                <RecentLoansTable />
                </div>
            </div>
        </div>
    )
}
