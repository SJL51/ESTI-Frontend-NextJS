"use client"

import Link from "next/link"
import {
    Search,
    Filter,
    ArrowLeft,
    ChevronRight,
    Plus,
    CalendarDays,
    UserCheck,
    Clock,
    History
} from "lucide-react"

export default function LeavesPage() {
    return (
        <div className="space-y-6">
            {/* Navigation Header & Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/personnel"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
                        title="Back to Personnel"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>

                    <div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Link href="/personnel" className="hover:text-slate-800 transition-colors">
                                Personnel
                            </Link>
                            <ChevronRight className="h-3 w-3" />
                            <span className="font-medium text-slate-800">Leave Applications</span>
                        </div>
                        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                            Leave Management
                        </h1>
                    </div>
                </div>

                {/* Action Button */}
                <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all text-sm self-start sm:self-auto">
                    <Plus className="w-4 h-4" />
                    Apply for Leave
                </button>
            </div>

            {/* Styled KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Leaves */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
                        <CalendarDays className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Total Leaves
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800">42</h3>
                    </div>
                </div>

                {/* Currently On Leave */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Currently On Leave
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800">6</h3>
                    </div>
                </div>

                {/* Upcoming Leaves */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Upcoming Leaves
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800">11</h3>
                    </div>
                </div>

                {/* Ended Leaves */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                        <History className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                            Ended Leaves
                        </p>
                        <h3 className="text-2xl font-bold text-slate-800">25</h3>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search employee, leave type, status..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-50">
                        <Filter className="w-4 h-4" />
                        Filter Status
                    </button>
                </div>
            </div>
        </div>
    )
}