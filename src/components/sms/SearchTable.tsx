"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { frappe } from "@/lib/frappe"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { RecordViewDialog, type RecordViewField } from "@/components/sms/RecordViewDialog"

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
    /**
     * Optional — when provided, rows become clickable and open a
     * `RecordViewDialog` showing these fields (can be a fuller field set
     * than `columns`, e.g. including a long reason/notes field that isn't
     * worth a table column). Omit to leave rows non-interactive.
     */
    viewFields?: RecordViewField<T>[]
    /** Dialog title for the view popup. Defaults to this table's `title`. Can vary per row. */
    viewTitle?: (row: T) => string
}

/**
 * Generic searchable results table: a search input backed by a whitelisted
 * Frappe method, rendered into a plain table, with an optional click-to-view
 * detail dialog per row (`viewFields`). Used for any "search across records,
 * show a results table" screen — extend `columns`/`viewFields` per use case
 * instead of copying this component (see CLAUDE.md §3.2a).
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
    viewFields,
    viewTitle,
}: SearchTableProps<T>) {
    const [search, setSearch] = useState("")
    const [selected, setSelected] = useState<T | null>(null)

    const { data: rows, isLoading, isError, error } = useQuery({
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
            ) : isError ? (
                <p className="text-sm text-red-600">
                    Something went wrong loading results
                    {error instanceof Error ? `: ${error.message}` : "."}
                </p>
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
                            <tr
                                key={rowKey ? rowKey(row, i) : i}
                                className={cn("border-b", viewFields && "cursor-pointer hover:bg-gray-50")}
                                onClick={viewFields ? () => setSelected(row) : undefined}
                            >
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

            {viewFields ? (
                <RecordViewDialog<T>
                    open={selected !== null}
                    onOpenChange={(open) => {
                        if (!open) setSelected(null)
                    }}
                    row={selected}
                    fields={viewFields}
                    title={selected && viewTitle ? viewTitle(selected) : title}
                />
            ) : null}
        </div>
    )
}
