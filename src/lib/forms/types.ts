/**
 * Shared types for the four screen archetypes (blueprint §5.1). Each legacy
 * form maps onto one of these; a route file resolves a FormSpec and hands it
 * to the matching template component, rather than every screen being
 * hand-built bespoke React.
 */

export type FieldType =
  | "Data"
  | "Text"
  | "Small Text"
  | "Int"
  | "Float"
  | "Currency"
  | "Date"
  | "Datetime"
  | "Time"
  | "Check"
  | "Link"
  | "Select"
  | "Attach Image"
  | "Phone"
  | "EmployeeSearch"

export interface FieldSpec {
  fieldname: string
  label: string
  fieldtype: FieldType
  /** For Link: target DocType. For Select: newline-joined options. */
  options?: string
  required?: boolean
  readOnly?: boolean
  inListView?: boolean
}

export interface FormSpec {
  /** Legacy form name, kept for traceability back to the blueprint/VB source. */
  legacyForm?: string
  doctype: string
  title: string
  fields: FieldSpec[]
  /** Whitelisted campus_erp.api.* method backing this screen's primary action, if any. */
  primaryApi?: string
}

export interface ChildTableSpec {
  fieldname: string
  doctype: string
  columns: FieldSpec[]
  /** Optional heading shown above the grid — useful when a step combines a table with other fields. */
  title?: string
}

export interface EntrySpec extends FormSpec {
  childTable?: ChildTableSpec
  /** Doctype is submittable (docstatus workflow) per blueprint §5.1. */
  submittable?: boolean
  /** Workflow actions available at the current state, e.g. ["Submit for Recommendation"]. */
  workflowActions?: string[]
}

export interface ReportSpec {
  legacyForm?: string
  /** Either a registered Frappe Report name, or a raw whitelisted method. */
  report?: string
  method?: string
  title: string
  filters: FieldSpec[]
  columns: Array<{ fieldname: string; label: string; width?: number }>
  /** Optional — fields to show in a read-only detail panel when a row is clicked. */
  detailFields?: Array<{ fieldname: string; label: string }>
}

export interface WizardStepSection {
  title?: string
  fieldnames: string[]
  columns?: 1 | 2 | 3 | 4
}

export interface WizardStepColumn {
  /** "main" renders wide (2/3), "sidebar" renders narrow (1/3). */
  span: "main" | "sidebar"
  sections: WizardStepSection[]
}

export interface WizardStepDialog {
  /** Text on the button that opens the dialog. */
  buttonLabel: string
  /** Dialog heading — defaults to buttonLabel if omitted. */
  title?: string
  /** Fieldnames (from FormSpec.fields) shown inside the dialog. */
  fieldnames?: string[]
  /** An editable child-table grid shown inside the dialog (e.g. a log of infractions). */
  childTable?: ChildTableSpec
}
export interface WizardStep {
  key: string
  label: string
  /** Flat field list — used when `columns` is not set (simple steps). */
  fieldnames: string[]
  /** Sectioned two-column layout (main + sidebar) — overrides fieldnames when present. */
  columns?: WizardStepColumn[]
  /** Shown instead of fields when fieldnames is empty and columns is unset. */
  note?: string
  /** Renders an editable Frappe child-table grid for this step instead of flat fields. */
  childTable?: ChildTableSpec
  /** A button that opens a small dialog form (e.g. a grouped set of checkboxes) — can combine with fieldnames/childTable on the same step. */
  dialog?: WizardStepDialog
  /** Fields-per-row for this step's flat `fieldnames` grid (when not using `columns`/sections). Defaults to 2. */
  fieldColumns?: 1 | 2 | 3 | 4
}

export interface WizardLayout {
  steps: WizardStep[]
}
