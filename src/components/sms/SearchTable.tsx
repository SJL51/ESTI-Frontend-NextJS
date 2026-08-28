"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { frappe } from "@/lib/frappe"
import { Input } from "@/components/ui/input"

export interface SearchTableColumn<T> {
    header: string
    /** Render this column's cell for a given row. */
    render: (row: T) => React.ReactNode
}

export interface SearchTableProps<T> {
    /** Optional heading shown above the search box. */
    title?: string
    /** Placeholder text for the search input. */
    searchPlaceholder?: string
    /**
     * React Query cache key prefix for this table's results — also what
     * other mutations should `invalidateQueries` against (e.g.
     * `["recent-leaves"]`) after writing a new row this table should show.
     */
    queryKey: string
    /** Whitelisted Frappe method to call, e.g. "campus_erp.api.personnel.list_recent_leaves". */
    method: string
    /** Param name the method expects for the search string. Defaults to "search". */
    searchParamName?: string
    /** Any additional fixed params to send on every call (e.g. a scoping id). */
    extraParams?: Record<string, unknown>
    /** Column definitions, rendered left to right in this order. */
    columns: SearchTableColumn<T>[]
    /** Message shown when the query returns zero rows. */
    emptyMessage?: string
    /** Optional row key extractor; defaults to row index. */
    rowKey?: (row: T, index: number) => string | number
}

/**
 * Generic searchable results table: a search input backed by a whitelisted
 * Frappe method, rendered into a plain table. Used for any "search across
 * records, show a results table" screen — extend `columns` per use case
 * instead of copying this component (see CLAUDE.md §2/§3.3).
 */
export function SearchTable<T>({
    title,
    searchPlaceholder = "Search...",
    queryKey,
    method,
    searchParamName = "search",
    extraParams,
    columns,
    emptyMessage = "No records found.",
    rowKey,
}: SearchTableProps<T>) {
    const [search, setSearch] = useState("")

    const { data: rows, isLoading } = useQuery({
        queryKey: [queryKey, search, extraParams],
        queryFn: async () => {
            const res = await frappe.call(method, {
                [searchParamName]: search,
                ...extraParams,
            })
            return res as T[]
        },
    })

    return (
        <div className="space-y-3 pt-6">
            {title ? <h2 className="text-base font-semibold">{title}</h2> : null}
            <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
            />

            {isLoading ? (
                <p className="text-sm text-gray-500">Loading...</p>
            ) : rows && rows.length > 0 ? (
                <table className="w-full text-sm border">
                    <thead>
                        <tr className="border-b bg-gray-50 text-left">
                            {columns.map((col) => (
                                <th key={col.header} className="p-2">{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={rowKey ? rowKey(row, i) : i} className="border-b">
                                {columns.map((col) => (
                                    <td key={col.header} className="p-2">{col.render(row)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-sm text-gray-500">{emptyMessage}</p>
            )}
        </div>
    )
}
