"use client"

import { SearchTable } from "@/components/sms/SearchTable"

interface OvertimeRow {
  name: string
  personnel_info: string
  employee_id: string
  fullname: string
  from_date: string
  to_date: string
  from_time: string
  to_time: string
  number_of_hours: number
  status: string
}

export function RecentOvertimeTable() {
  return (
    <SearchTable<OvertimeRow>
      title="Recent Overtime Applications"
      queryKey="recent-overtime"
      method="campus_erp.api.personnel.list_recent_overtime"
      rowKey={(row) => row.name}
      columns={[
        { header: "Employee", render: (row) => row.fullname },
        { header: "Date", render: (row) => `${row.from_date} – ${row.to_date}` },
        { header: "Hours", render: (row) => row.number_of_hours },
        { header: "Status", render: (row) => row.status },
      ]}
    />
  )
}
