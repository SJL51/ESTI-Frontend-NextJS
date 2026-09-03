"use client"

import { PendingLeavesTable } from "@/components/sms/PendingLeavesTable"
import { PageHeader } from "@/components/sms/PageHeader"

export default function PendingLeaveApprovalsPage() {
    return (
        <div className="space-y-4">
            <PageHeader backHref="/administration" backLabel="Administration" current="Pending Approvals" />
            <PendingLeavesTable />
        </div>
    )
}
