"use client"

import { useState } from "react"
import type { Control } from "react-hook-form"
import { DynamicField } from "@/components/sms/DynamicField"
import { PhotoUploadField } from "@/components/sms/PhotoUploadField"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { FormSpec, FieldSpec, WizardLayout, WizardStepSection } from "@/lib/forms/types"

function SectionBlock({
  section,
  byName,
  control,
}: {
  section: WizardStepSection
  byName: Map<string, FieldSpec>
  control: Control<any>
}) {
  const colsClass =
    section.columns === 1
      ? "grid-cols-1"
      : section.columns === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : section.columns === 4
      ? "grid-cols-1 sm:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2"

  return (
    <div className="space-y-4">
      {section.title && (
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {section.title}
        </h2>
      )}
      <div className={cn("grid gap-4", colsClass)}>
        {section.fieldnames.map((fname) => {
          const fieldSpec = byName.get(fname)
          if (!fieldSpec) return null // silent gap — fieldname typo vs spec.fields
          return fieldSpec.fieldtype === "Attach Image" ? (
            <PhotoUploadField key={fname} control={control} spec={fieldSpec} />
          ) : (
            <DynamicField key={fname} control={control} spec={fieldSpec} />
          )
        })}
      </div>
    </div>
  )
}

export function WizardFormLayout({
  spec,
  layout,
  control,
}: {
  spec: FormSpec
  layout: WizardLayout
  control: Control<any>
}) {
  const [activeStep, setActiveStep] = useState(0)

  const byName = new Map<string, FieldSpec>(spec.fields.map((f) => [f.fieldname, f]))
  const step = layout.steps[activeStep]
  const isFirst = activeStep === 0
  const isLast = activeStep === layout.steps.length - 1
  const hasColumns = !!step.columns && step.columns.length > 0
  const isComingSoon = !hasColumns && step.fieldnames.length === 0

  const mainColumn = step.columns?.find((c) => c.span === "main")
  const sidebarColumn = step.columns?.find((c) => c.span === "sidebar")

  return (
    <div className="grid gap-6">
      {/* Breadcrumb — display-only, no click-to-jump by design */}
      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-sm">
        {layout.steps.map((s, i) => (
          <span key={s.key} className="flex items-center gap-2">
            <span
              className={cn(
                "font-medium",
                i === activeStep
                  ? "text-foreground"
                  : i < activeStep
                  ? "text-foreground/70"
                  : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
            {i < layout.steps.length - 1 && (
              <span className="text-muted-foreground">/</span>
            )}
          </span>
        ))}
      </div>
      <Separator />

      {isComingSoon ? (
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="font-medium">{step.label} — not built yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            {step.note ?? "This step needs its own fields/DocType before it can be filled in here."}
          </p>
        </div>
      ) : hasColumns ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {mainColumn && (
            <div className="lg:col-span-2 space-y-6">
              {mainColumn.sections.map((section, i) => (
                <SectionBlock key={section.title ?? i} section={section} byName={byName} control={control} />
              ))}
            </div>
          )}
          {sidebarColumn && (
            <div className="space-y-6">
              {sidebarColumn.sections.map((section, i) => (
                <SectionBlock key={section.title ?? i} section={section} byName={byName} control={control} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {step.fieldnames.map((fname) => {
            const fieldSpec = byName.get(fname)
            if (!fieldSpec) return null
            return <DynamicField key={fname} control={control} spec={fieldSpec} />
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isFirst}
          onClick={() => setActiveStep((s) => s - 1)}
        >
          Back
        </Button>
        {!isLast && (
          <Button type="button" onClick={() => setActiveStep((s) => s + 1)}>
            Next
          </Button>
        )}
      </div>
    </div>
  )
}
