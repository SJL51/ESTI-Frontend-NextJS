/**
 * Inclusive day count between fromDate and toDate, minus 0.5 for a half-day
 * leave. Purely a display calculation derived from fields already on the
 * record — not persisted or validated anywhere. Shared by RecentLeavesTable
 * (search results) and the Personnel wizard's "Schedules and Leaves" step
 * (child-table computed column) so both format leave duration identically.
 *
 * `halfDay` is typed loosely on purpose: RecentLeavesTable gets a real
 * number (0/1) back from the API, but ChildTableGrid has no checkbox
 * handling for "Check" fieldtype columns (see ChildTableGrid.tsx — it falls
 * through to a plain text Input), so a row edited in the wizard could store
 * half_day as an arbitrary string. Treat only clear truthy values as "half".
 */
export function calculateLeaveDays(
    fromDate: string,
    toDate: string,
    halfDay: unknown
): number | null {
    const from = new Date(fromDate)
    const to = new Date(toDate)
    if (isNaN(from.getTime()) || isNaN(to.getTime())) return null

    const diffDays = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const isHalf = halfDay === true || halfDay === 1 || halfDay === "1" || halfDay === "true"
    const days = isHalf ? diffDays - 0.5 : diffDays
    return days > 0 ? days : null
}

export function formatLeaveDays(fromDate: string, toDate: string, halfDay: unknown): string {
    const days = calculateLeaveDays(fromDate, toDate, halfDay)
    if (days === null) return "—"
    return `${days} day${days === 1 ? "" : "s"}`
}
