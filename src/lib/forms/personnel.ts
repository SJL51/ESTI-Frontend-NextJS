import { FormSpec, WizardLayout } from "./types"

export const employeeSpec: FormSpec = {
    doctype: "Personnel Info",
    title: "Personnel Directory",
    fields: [
        { fieldname: "employee_id", label: "Employee ID", fieldtype: "Data", inListView: true },
        { fieldname: "rfid", label: "RFID", fieldtype: "Data" },
        { fieldname: "last_name", label: "Last Name", fieldtype: "Data", inListView: true },
        { fieldname: "first_name", label: "First Name", fieldtype: "Data", inListView: true },
        { fieldname: "middle_name", label: "Middle Name", fieldtype: "Data" },
        { fieldname: "title", label: "Title", fieldtype: "Data" },
        { fieldname: "birthdate", label: "Birthdate", fieldtype: "Date" },
        { fieldname: "gender", label: "Gender", fieldtype: "Select", options: "Male\nFemale\nOthers" },
        { fieldname: "number_of_dependents", label: "Number of Dependents", fieldtype: "Int" },
        { fieldname: "profile", label: "Insert Profile", fieldtype: "Attach Image" },
        { fieldname: "religion", label: "Religion", fieldtype: "Data" },
        { fieldname: "marital_status", label: "Marital Status", fieldtype: "Select", options: "Single\nMarried\nDivorced\nWidowed\nSeparated" },
        { fieldname: "contact_number", label: "Contact Number", fieldtype: "Phone" },
        { fieldname: "nationality", label: "Nationality", fieldtype: "Select", options: "Filipino\nAmerican" },
        { fieldname: "birthplace", label: "Birthplace", fieldtype: "Data" },
        { fieldname: "mailing_address", label: "Mailing Address", fieldtype: "Data" },
        { fieldname: "employee_status", label: "Employee Status", fieldtype: "Select", options: "Contractual\nPart Timer\nProbationary\nRegular", inListView: true },
        { fieldname: "date_hired", label: "Date Hired", fieldtype: "Date" },
        { fieldname: "department", label: "Department", fieldtype: "Select", options: "ADMINISTRATION DEPARTMENT\nCOMPUTER SCIENCE DEPARTMENT\nELECTRONICS DEPARTMENT\nFinance\nGENERAL SERVICES DEPARTMENT\nHIGH SCHOOL DEPARTMENT\nHOTEL&RESTAURANT DEPARTMENT\nHuman Resources\nMARINE DEPT.\nProperty Custodian\nRegistrar\nSCIENCE DEPARTMENT\nTOURISM DEPARTMENT", inListView: true },
        
        // Payroll Info
        { fieldname: "emergency_contacts", label: "Emergency Contacts", fieldtype: "Small Text" },
        { fieldname: "family_dependents", label: "Family/Dependents", fieldtype: "Small Text" },
        
        // Skills
        { fieldname: "skills", label: "Skills", fieldtype: "Small Text" },
        // Payroll Policy
        { fieldname: "paid_holiday", label: "Paid Holiday", fieldtype: "Check" },
        { fieldname: "leave_credits", label: "Leave Credits", fieldtype: "Check" },
        { fieldname: "official_business", label: "Official Business", fieldtype: "Check" },
        { fieldname: "late_immunity", label: "Late Immunity", fieldtype: "Check" },
        { fieldname: "absent_immunity", label: "Absent Immunity", fieldtype: "Check" },

        // Payroll Info
        { fieldname: "tin_number", label: "TIN NUMBER", fieldtype: "Data" },
        { fieldname: "sss_number", label: "SSS NUMBER", fieldtype: "Data" },
        { fieldname: "philhealth", label: "PHILHEALTH", fieldtype: "Data" },
        { fieldname: "pag_ibig", label: "PAG-IBIG", fieldtype: "Data" },

        { fieldname: "with_holding_tax", label: "With Holding Tax", fieldtype: "Int" },
        { fieldname: "sss_deduction", label: "SSS Deduction", fieldtype: "Int" },
        { fieldname: "philhealth_deduction", label: "PHILHEALTH Deduction", fieldtype: "Int" },
        { fieldname: "pagibig_deduction", label: "PAG-IBIG Deduction", fieldtype: "Int" },

        { fieldname: "gross_pay", label: "Gross Pay", fieldtype: "Int" },
        { fieldname: "allowance", label: "Allowance", fieldtype: "Int" },
        { fieldname: "reg_rate_pre_hour", label: "Reg. Rate per Hour", fieldtype: "Int" },
        { fieldname: "reg_ot_per_hour", label: "Reg. OT per Hour", fieldtype: "Int" },

        { fieldname: "sunday_rate_per_hour", label: "Sunday Rate per Hour", fieldtype: "Int" },
        { fieldname: "sunday_ot_per_hour", label: "Sunday OT per Hour", fieldtype: "Int" },
        { fieldname: "holiday_rate_per_hour", label: "Holiday Rate per Hour", fieldtype: "Int" },
        { fieldname: "holiday_ot_per_hour", label: "Holiday OT per Hour", fieldtype: "Int" },

        { fieldname: "late_rate_per_hour", label: "Late Rate per Hour", fieldtype: "Int" },
        { fieldname: "undertime_rate_per_hour", label: "Undertime Rate per Hour", fieldtype: "Int" },
        { fieldname: "work_status", label: "Work Status", fieldtype: "Select", options: "In Active\nActive\nExecutive\nConsultant" },
        { fieldname: "with_atm_card", label: "With ATM Card", fieldtype: "Check" },
    ],
}

export const employeeWizardLayout: WizardLayout = {
    steps: [
        {
            key: "personnel_info",
            label: "Personnel Info",
            fieldnames: [],
            columns: [
                {
                    span: "main",
                    sections: [
                        {
                            title: "System Identification",
                            fieldnames: ["employee_id", "rfid"],
                            columns: 2,
                        },
                        {
                            title: "Personal Information",
                            fieldnames: ["first_name", "middle_name", "last_name", "title", "birthdate", "gender", "number_of_dependents", "marital_status", "nationality", "religion"],
                            columns: 4,
                        },
                        {
                            title: "Contact & Location",
                            fieldnames: ["contact_number", "birthplace", "mailing_address"],
                            columns: 2,
                        },
                    ],
                },
                {
                    span: "sidebar",
                    sections: [
                        {
                            fieldnames: ["profile"],
                            columns: 1,
                        },
                        {
                            title: "Employment Details",
                            fieldnames: ["employee_status", "date_hired", "department"],
                            columns: 1,
                        },
                    ],
                },
            ],
            dialog: {
                buttonLabel: "View Infractions",
                title: "Infractions",
                childTable: {
                    fieldname: "infractions",
                    doctype: "SMS Personnel Infractions",
                    columns: [
                        { fieldname: "date", label: "Date", fieldtype: "Date" },
                        { fieldname: "violation", label: "Violation", fieldtype: "Data" },
                        { fieldname: "violation_details", label: "Violation Details", fieldtype: "Small Text" },
                    ],
                },
            },
        },
        {
            key: "primary_contacts",
            label: "Primary Contacts",
            fieldnames: ["emergency_contacts", "family_dependents" ],
        },
        {
            key: "education",
            label: "Education",
            fieldnames: [],
            childTable: {
                fieldname: "education",
                doctype: "SMS Personnel Education",
                title: "Education",
                columns: [
                    { fieldname: "level", label: "Level", fieldtype: "Select", options: "Elementary\nSecondary\nTertiary\nGraduate School" },
                    { fieldname: "school", label: "School", fieldtype: "Data" },
                    { fieldname: "year", label: "Year", fieldtype: "Data" },
                    { fieldname: "degree", label: "Degree", fieldtype: "Data" },
                ],
            },
        },
        {
            key: "skills_seminars",
            label: "Skills / Seminars Attended",
            fieldnames: ["skills"],
            childTable: {
                fieldname: "seminars_attended",
                doctype: "SMS Personnel Seminar",
                title: "Seminars Attended",
                columns: [
                    { fieldname: "topic", label: "Topic", fieldtype: "Data" },
                    { fieldname: "certificate", label: "Certificate", fieldtype: "Data" },
                    { fieldname: "vanue_training_center", label: "Venue/Training Center", fieldtype: "Data" },
                    { fieldname: "date", label: "Date", fieldtype: "Date", },
                ]
            },
        },
        {
            key: "payroll_info",
            label: "Payroll Info",
            fieldnames: ["tin_number", "sss_number", "philhealth", "pag_ibig", "with_holding_tax", "sss_deduction", "philhealth_deduction", "pagibig_deduction", "gross_pay", "allowance", "reg_rate_pre_hour", "reg_ot_per_hour", "sunday_rate_per_hour", "sunday_ot_per_hour", "holiday_rate_per_hour", "holiday_ot_per_hour", "late_rate_per_hour", "undertime_rate_per_hour", "work_status", "with_atm_card", ],
            fieldColumns: 4,
            dialog: {
                buttonLabel: "Policy",
                title: "Policy",
                fieldnames: ["paid_holiday", "leave_credits", "official_business", "late_immunity", "absent_immunity"],
            },
        },
        {
            key: "schedules_leaves",
            label: "Schedules and Leaves",
            fieldnames: [],
            note: "Shift assignment, rest days, and leave credit allocations — needs its own fields/DocType.",
        },
        {
            key: "benefits",
            label: "Benefits",
            fieldnames: [],
            note: "Allowances, HMO, and other perks — needs its own fields/DocType.",
        },
        {
            key: "loan_ledgers",
            label: "Loan Ledgers",
            fieldnames: [],
            note: "Existing loans, deduction history, and balances — needs its own child-table DocType (typically view-only during onboarding).",
        },
    ],
}
