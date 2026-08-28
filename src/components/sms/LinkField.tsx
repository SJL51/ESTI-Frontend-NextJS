"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { frappe } from "@/lib/frappe"

export function LinkField({
  doctype,
  value,
  onChange,
  disabled,
}: {
  doctype: string
  value?: string
  onChange: (name: string) => void
  disabled?: boolean
}) {
  const [query, setQuery] = useState(value ?? "")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setQuery(value ?? "")
  }, [value])

  const { data: results } = useQuery({
    queryKey: ["link-search", doctype, query],
    queryFn: async () => {
      const res = await frappe.list<{ name: string }>(doctype, {
        fields: ["name"],
        filters: query ? [["name", "like", `%${query}%`]] : undefined,
        limit_page_length: 20,
      })
      return res
    },
    enabled: open,
  })

  return (
    <div className="relative">
      <input
        className="w-full border rounded px-2 py-1 text-sm"
        placeholder={`Search ${doctype}...`}
        value={query}
        disabled={disabled}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          onChange("")
        }}
        onBlur={() => {
          setTimeout(() => setOpen(false), 150)
        }}
      />
      {open && results && results.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full shadow max-h-48 overflow-auto">
          {results.map((r) => (
            <li
              key={r.name}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
              onMouseDown={() => {
                setQuery(r.name)
                onChange(r.name)
                setOpen(false)
              }}
            >
              {r.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
