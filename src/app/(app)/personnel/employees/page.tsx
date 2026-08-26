"use client"

import { useState } from "react"
import Link from "next/link"
import { MasterDetailScreen } from "@/components/sms/MasterDetailScreen"
import { employeeSpec, employeeWizardLayout } from "@/lib/forms/personnel"
import {
  Users,
  UserCheck,
  Clock,
  Briefcase,
  Search,
  Filter,
  ArrowLeft,
  ChevronRight
} from "lucide-react"

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      {/* Navigation Header & Breadcrumbs */}
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
            <span className="font-medium text-slate-800">Employees Directory</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Employees Directory
          </h1>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Personnel</p>
            <h3 className="text-2xl font-bold text-slate-800">128</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Full Time</p>
            <h3 className="text-2xl font-bold text-slate-800">94</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Contractual / Part-time</p>
            <h3 className="text-2xl font-bold text-slate-800">22</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Probationary</p>
            <h3 className="text-2xl font-bold text-slate-800">12</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee ID, name, status..."
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

      <MasterDetailScreen spec={employeeSpec} wizard={employeeWizardLayout} />
    </div>
  )
}