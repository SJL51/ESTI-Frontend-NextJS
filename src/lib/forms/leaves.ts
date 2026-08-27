import type { ReportSpec } from "@/lib/forms/types"

export const leaveApplicationsReportSpec: ReportSpec = {
    title: "Leave Applications",
    method: "campus_erp.api.personnel.get_leave_applications",
    filters: [
        { fieldname: "employee_id", label: "Employee", fieldtype: "EmployeeSearch" },
        { fieldname: "leave_type", label: "Leave Type", fieldtype: "Select", options: "Vacation\nSick\nEmergency\nPaternal\nMaternal\nOthers" },
        { fieldname: "from_date", label: "From", fieldtype: "Date" },
        { fieldname: "to_date", label: "To", fieldtype: "Date" },
    ],
    columns: [
        { fieldname: "employee_id", label: "Employee ID" },
        { fieldname: "employee_name", label: "Employee" },
        { fieldname: "department", label: "Department" },
        { fieldname: "leave_type", label: "Leave Type" },
        { fieldname: "from_date", label: "From" },
        { fieldname: "to_date", label: "To" },
        { fieldname: "half_day", label: "Half Day" },
        { fieldname: "reason", label: "Reason" },
    ],
    detailFields: [
        { fieldname: "employee_name", label: "Employee" },
        { fieldname: "employee_id", label: "Employee ID" },
        { fieldname: "department", label: "Department" },
        { fieldname: "leave_type", label: "Leave Type" },
        { fieldname: "other_leave_reason", label: "Other Reason" },
        { fieldname: "from_date", label: "From" },
        { fieldname: "to_date", label: "To" },
        { fieldname: "half_day", label: "Half Day" },
        { fieldname: "reason", label: "Reason" },
        { fieldname: "date", label: "Date Filed" },
    ],
}
