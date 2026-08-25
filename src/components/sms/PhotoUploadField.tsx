"use client"

import { useRef, useState } from "react"
import type { Control, FieldValues, Path } from "react-hook-form"
import { Loader2, User } from "lucide-react"
import { toast } from "sonner"
import { frappe, getErrorMessage } from "@/lib/frappe"
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
 * Uploads immediately on file select via frappe.uploadFile() (POST
 * /api/method/upload_file, public by default) and stores the resulting
 * permanent file_url as the field's value — not a local blob URL — so the
 * image still resolves after save/reload/reopen. Uploaded standalone
 * (no doctype/docname at upload time) so this works identically for new
 * and existing records.
 */
export function PhotoUploadField<T extends FieldValues>({
  control,
  spec,
}: {
  control: Control<T>
  spec: FieldSpec
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  return (
    <FormField
      control={control}
      name={spec.fieldname as Path<T>}
      render={({ field }) => {
        const preview = typeof field.value === "string" && field.value ? field.value : null

        async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
          const file = e.target.files?.[0]
          if (!file) return
          setUploading(true)
          try {
            const { file_url } = await frappe.uploadFile(file)
            field.onChange(file_url)
          } catch (error) {
            toast.error(`Could not upload photo: ${getErrorMessage(error)}`)
            if (fileInputRef.current) fileInputRef.current.value = ""
          } finally {
            setUploading(false)
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
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : preview ? (
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
                    disabled={spec.readOnly || uploading}
                    onChange={handleChange}
                  />
                  {preview && !uploading && (
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
