"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { frappe } from "@/lib/frappe"

interface PersonnelSearchResult {
  employee_id: string
  first_name: string
  last_name: string
  middle_name?: string
  department: string
}

export function EmployeeSearchField({
  value,
  onChange,
  disabled,
}: {
  value?: string
  onChange: (employeeId: string) => void
  disabled?: boolean
}) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<PersonnelSearchResult | null>(null)

  const { data: results } = useQuery({
    queryKey: ["personnel-search", query],
    queryFn: async () => {
      const res = await frappe.call("campus_erp.api.personnel.search_personnel", { query })
      return res as PersonnelSearchResult[]
    },
    enabled: query.length > 1,
  })

  return (
    <div className="relative">
      <input
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder="Search by name..."
        value={query}
        disabled={disabled}
        onChange={(e) => {
          setQuery(e.target.value)
          if (selected) {
            setSelected(null)
            onChange("")
          }
        }}
      />
      {results && results.length > 0 && query.length > 1 && !selected && (
        <ul className="absolute z-10 bg-white border w-full shadow max-h-48 overflow-auto">
          {results.map((emp) => {
            const fullName = `${emp.first_name} ${emp.last_name}`
            return (
              <li
                key={emp.employee_id}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setSelected(emp)
                  setQuery(fullName)
                  onChange(emp.employee_id)
                }}
              >
                {fullName} — {emp.department}
              </li>
            )
          })}
        </ul>
      )}
      {selected && (
        <p className="text-xs text-gray-500 mt-1">
          Selected: {selected.first_name} {selected.last_name} — {selected.department} (
          {selected.employee_id})
        </p>
      )}
    </div>
  )
}
