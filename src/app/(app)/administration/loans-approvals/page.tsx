"use client"

import { PendingLoansTable } from "@/components/sms/PendingLoansTable"
import { PageHeader } from "@/components/sms/PageHeader"

export default function PendingLoanApprovalsPage() {
    return (
        <div className="space-y-4">
            <PageHeader backHref="/administration" backLabel="Administration" current="Pending Approvals" />
            <PendingLoansTable />
        </div>
    )
}
