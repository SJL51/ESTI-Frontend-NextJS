"use client"

import type { Control, FieldValues, Path } from "react-hook-form"
import type { FieldSpec } from "@/lib/forms/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatePickerField } from "@/components/sms/DatePickerField"
import { EmployeeSearchField } from "@/components/sms/EmployeeSearchField"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

/**
 * Renders one form field from a FieldSpec (blueprint §5.1's data-driven
 * screen model: changing a field's type/label is a spec edit, not a
 * template-code change).
 */
export function DynamicField<T extends FieldValues>({
  control,
  spec,
}: {
  control: Control<T>
  spec: FieldSpec
}) {
  return (
    <FormField
      control={control}
      name={spec.fieldname as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {spec.label}
            {spec.required ? " *" : ""}
          </FormLabel>
          <FormControl>
            {spec.fieldtype === "Select" ? (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={spec.readOnly}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(spec.options ?? "")
                    .split("\n")
                    .filter(Boolean)
                    .map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : spec.fieldtype === "Check" ? (
              <input
                type="checkbox"
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                disabled={spec.readOnly}
                className="h-4 w-4"
              />
            ) : spec.fieldtype === "Text" || spec.fieldtype === "Small Text" ? (
              <Textarea
                rows={spec.fieldtype === "Small Text" ? 3 : 5}
                readOnly={spec.readOnly}
                className="resize-none"
                {...field}
              />
            ) : spec.fieldtype === "Date" ? (
              <DatePickerField
                value={field.value}
                onChange={field.onChange}
                disabled={spec.readOnly}
              />
            ) : spec.fieldtype === "Phone" ? (
              <Input
                type="tel"
                readOnly={spec.readOnly}
                {...field}
                onChange={(e) => {
                  // Allow an optional leading "+" plus digits only — strips
                  // letters/spaces/dashes as the user types rather than
                  // validating on submit, so the field never holds garbage.
                  const raw = e.target.value
                  const cleaned = raw.startsWith("+")
                    ? "+" + raw.slice(1).replace(/[^0-9]/g, "")
                    : raw.replace(/[^0-9]/g, "")
                  field.onChange(cleaned)
                }}
              />
            ) : spec.fieldtype === "EmployeeSearch" ? (
              <EmployeeSearchField
                value={field.value}
                onChange={field.onChange}
                disabled={spec.readOnly}
              />
            ) : (
              <Input
                type={
                  spec.fieldtype === "Datetime"
                    ? "datetime-local"
                    : spec.fieldtype === "Int" || spec.fieldtype === "Float" || spec.fieldtype === "Currency"
                      ? "number"
                      : "text"
                }
                readOnly={spec.readOnly}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}