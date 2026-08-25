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

export interface WizardStep {
  key: string
  label: string
  /** Flat field list — used when `columns` is not set (simple steps). */
  fieldnames: string[]
  /** Sectioned two-column layout (main + sidebar) — overrides fieldnames when present. */
  columns?: WizardStepColumn[]
  /** Shown instead of fields when fieldnames is empty and columns is unset. */
  note?: string
}

export interface WizardLayout {
  steps: WizardStep[]
}
