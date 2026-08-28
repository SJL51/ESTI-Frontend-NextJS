"use client"

import { SearchTable } from "@/components/sms/SearchTable"

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
                { header: "Department", render: (row) => row.department },
                { header: "Type", render: (row) => row.leave_type },
                { header: "From", render: (row) => row.from_date },
                { header: "To", render: (row) => row.to_date },
                { header: "Half Day", render: (row) => (row.half_day ? "Yes" : "No") },
            ]}
        />
    )
}
