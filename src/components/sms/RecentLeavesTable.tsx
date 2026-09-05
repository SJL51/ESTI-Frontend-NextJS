"use client"

import { SearchTable } from "@/components/sms/SearchTable"
import { formatLeaveDays } from "@/lib/leave-days"

interface LeaveRow {
    employee_id: string
    employee_name: string
    department: string
    leave_type: string
    from_date: string
    to_date: string
    half_day: number
    reason: string
    date: string
    status: string
}

export function RecentLeavesTable() {
    return (
        <SearchTable<LeaveRow>
            title="Recent Leave Applications"
            searchPlaceholder="Search by employee name..."
            queryKey="recent-leaves"
            method="campus_erp.api.personnel.list_recent_leaves"
            emptyMessage="No leave records found."
            columns={[
                { header: "Employee", render: (row) => row.employee_name },
                { header: "Status", render: (row) => row.status },
                { header: "Department", render: (row) => row.department },
                { header: "Type", render: (row) => row.leave_type },
                { header: "From", render: (row) => row.from_date },
                { header: "To", render: (row) => row.to_date },
                { header: "Half Day", render: (row) => (row.half_day ? "Yes" : "No") },
                { header: "Days Out", render: (row) => formatLeaveDays(row.from_date, row.to_date, row.half_day) },
            ]}
            viewTitle={(row) => row.employee_name}
            viewFields={[
                { label: "Employee", render: (row) => row.employee_name },
                { label: "Status", render: (row) => row.status },
                { label: "Department", render: (row) => row.department },
                { label: "Leave Type", render: (row) => row.leave_type },
                { label: "From", render: (row) => row.from_date },
                { label: "To", render: (row) => row.to_date },
                { label: "Half Day", render: (row) => (row.half_day ? "Yes" : "No") },
                { label: "Days Out", render: (row) => formatLeaveDays(row.from_date, row.to_date, row.half_day) },
                { label: "Date Filed", render: (row) => row.date },
                { label: "Reason", render: (row) => row.reason || "—" },
            ]}
        />
    )
}
