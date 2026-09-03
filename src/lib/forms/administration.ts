import type { FormSpec } from "@/lib/forms/types"

/**
 * Departments moved out of Personnel and into Administration > Configuration
 * (2026-09-03) — department master data (code/name/head) is an
 * administrative setup concern, not a personnel-workflow screen. Backs
 * `app/(app)/administration/configuration/departments/page.tsx`.
 *
 * ⚠️ `deptcode` was previously declared as `code` (wrong — the real field is
 * `deptcode`) and that fix was found reverted once already (see CLAUDE.md
 * §3, "Don't leave a fieldname/spec fix uncommitted"). Commit this file
 * immediately after moving it, don't leave it staged.
 */
export const departmentSpec: FormSpec = {
    doctype: "SMS Personnel Departments",
    title: "Departments",
    fields: [
        { fieldname: "deptcode", label: "Code", fieldtype: "Data", required: true, inListView: true },
        { fieldname: "department", label: "Department", fieldtype: "Data", required: true, inListView: true },
        { fieldname: "head", label: "Head", fieldtype: "EmployeeSearch" },
    ],
}