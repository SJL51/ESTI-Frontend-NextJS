"use client"

import { SearchTable } from "@/components/sms/SearchTable"

interface LoanRow {
    employee_id: string
    employee_name: string
    department: string
    al_no: string
    date: string
    loan_type: string
    basic_pay: number
    previous_loan: number
    amount: number
    reason: string
}

export function RecentLoansTable() {
    return (
        <SearchTable<LoanRow>
            title="Recent Loan Applications"
            searchPlaceholder="Search by employee name..."
            queryKey="recent-loans"
            method="campus_erp.api.personnel.list_recent_loans"
            emptyMessage="No loan records found."
            columns={[
                { header: "AL No.", render: (row) => row.al_no },
                { header: "Employee", render: (row) => row.employee_name },
                { header: "Department", render: (row) => row.department },
                { header: "Type", render: (row) => row.loan_type },
                { header: "Amount", render: (row) => row.amount },
                { header: "Date", render: (row) => row.date },
            ]}
            viewTitle={(row) => row.employee_name}
            viewFields={[
                { label: "AL No.", render: (row) => row.al_no },
                { label: "Employee", render: (row) => row.employee_name },
                { label: "Department", render: (row) => row.department },
                { label: "Loan Type", render: (row) => row.loan_type },
                { label: "Basic Pay", render: (row) => row.basic_pay },
                { label: "Previous Loan", render: (row) => row.previous_loan },
                { label: "Amount", render: (row) => row.amount },
                { label: "Date Filed", render: (row) => row.date },
                { label: "Reason", render: (row) => row.reason || "—" },
            ]}
        />
    )
}
