/**
 * Inclusive day count between fromDate and toDate, minus 0.5 for a half-day
 * leave. Purely a display calculation derived from fields already on the
 * record — not persisted or validated anywhere. Shared by RecentLeavesTable
 * (search results) and the Personnel wizard's "Schedules and Leaves" step
 * (child-table computed column) so both format leave duration identically.
 *
 * `halfDay` is typed loosely defensively, not because it needs to be:
 * RecentLeavesTable gets a real number (0/1) back from the API, and
 * ChildTableGrid now renders a real Checkbox for "Check" fieldtype columns
 * (fixed — see ChildTableGrid.tsx), storing a clean 1/0. The loose checks
 * below are kept as a safety net for any older/unmigrated records that may
 * still hold a stray string value from before that fix.
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
