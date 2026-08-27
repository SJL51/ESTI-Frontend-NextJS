"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { frappe } from "@/lib/frappe"
import { Input } from "@/components/ui/input"

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
    const [search, setSearch] = useState("")

    const { data: leaves, isLoading } = useQuery({
        queryKey: ["recent-leaves", search],
        queryFn: async () => {
            const res = await frappe.call("campus_erp.api.personnel.list_recent_leaves", { search })
            return res as LeaveRow[]
        },
    })

    return (
        <div className="space-y-3 pt-6">
            <h2 className="text-base font-semibold">Recent Leave Applications</h2>
            <Input
                placeholder="Search by employee name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
            />

            {isLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
            ) : leaves && leaves.length > 0 ? (
                <table className="w-full text-sm border">
                    <thead>
                        <tr className="border-b bg-gray-50 text-left">
                            <th className="p-2">Employee</th>
                            <th className="p-2">Department</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">From</th>
                            <th className="p-2">To</th>
                            <th className="p-2">Half Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.map((row, i) => (
                            <tr key={i} className="border-b">
                                <td className="p-2">{row.employee_name}</td>
                                <td className="p-2">{row.department}</td>
                                <td className="p-2">{row.leave_type}</td>
                                <td className="p-2">{row.from_date}</td>
                                <td className="p-2">{row.to_date}</td>
                                <td className="p-2">{row.half_day ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-sm text-gray-500">No leave records found.</p>
            )}
        </div>
    )
}