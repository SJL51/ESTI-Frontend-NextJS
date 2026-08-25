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
        {
            fieldname: "marital_status", label: "Marital Status", fieldtype: "Select", options: "Single\nMarried\nDivorced\nWidowed\nSeparated" },
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
            fieldnames: [],
            note: "Certifications and professional development history — needs its own child-table DocType.",
        },
        {
            key: "payroll_info",
            label: "Payroll Info",
            fieldnames: [],
            note: "Salary setup, tax status, SSS/PhilHealth/Pag-IBIG, and bank accounts — needs its own fields/DocType.",
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
