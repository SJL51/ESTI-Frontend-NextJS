"use client"

import { LoanApplicationForm } from "@/components/sms/LoanApplicationForm"
import { RecentLoansTable } from "@/components/sms/RecentLoansTable"
import { PageHeader } from "@/components/sms/PageHeader"

export default function LoanApplicationPage() {
    return (
        <div className="space-y-4">
            <PageHeader backHref="/personnel" backLabel="Personnel" current="Loan Applications" />

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
