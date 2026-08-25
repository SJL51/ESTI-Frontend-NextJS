"use client"

import { useRef } from "react"
import type { Control, FieldValues, Path } from "react-hook-form"
import { User } from "lucide-react"
import type { FieldSpec } from "@/lib/forms/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

/**
 * Renders an "Attach Image" field as a circular avatar preview + dashed
 * upload box, matching the target Personnel Info design.
 *
 * TODO: this currently stores a local blob URL (URL.createObjectURL) in the
 * form field's value for preview purposes only — it does NOT upload to
 * Frappe. Real upload needs frappe.uploadFile() (POST to
 * /api/method/upload_file) wired in here once that backend helper exists,
 * per 09_Frappe_Fieldtypes_Cheatsheet.md §3 and the rebuild guide's Step 3.
 * Two open questions to resolve before wiring real upload: does `docname`
 * exist yet at upload time (new vs. editing record), and should the file be
 * public or is_private?
 */
export function PhotoUploadField<T extends FieldValues>({
  control,
  spec,
}: {
  control: Control<T>
  spec: FieldSpec
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <FormField
      control={control}
      name={spec.fieldname as Path<T>}
      render={({ field }) => {
        const preview = typeof field.value === "string" && field.value ? field.value : null

        function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
          const file = e.target.files?.[0]
          if (file) {
            const previewUrl = URL.createObjectURL(file)
            field.onChange(previewUrl)
          }
        }

        function handleRemove() {
          field.onChange("")
          if (fileInputRef.current) fileInputRef.current.value = ""
        }

        return (
          <FormItem>
            <FormLabel>{spec.label}</FormLabel>
            <FormControl>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl bg-muted/40 space-y-3">
                <div className="w-32 h-32 rounded-full bg-muted border-2 border-background shadow-sm flex items-center justify-center text-muted-foreground overflow-hidden">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={preview}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={spec.readOnly}
                    onChange={handleChange}
                  />
                  {preview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemove}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
