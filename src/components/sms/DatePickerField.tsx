"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/**
 * Wraps shadcn's Popover + Calendar behind the same ISO "YYYY-MM-DD" string
 * contract the native <input type="date"> used, so DynamicField/react-hook-form
 * and whatever gets sent to Frappe don't need to change — only the UI does.
 */
export function DatePickerField({
  value,
  onChange,
  disabled,
}: {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  // Parse "YYYY-MM-DD" as a local date (not UTC) so the picker doesn't
  // shift a day off depending on the browser's timezone.
  const selected = React.useMemo(() => {
    if (!value) return undefined
    const [y, m, d] = value.split("-").map(Number)
    if (!y || !m || !d) return undefined
    return new Date(y, m - 1, d)
  }, [value])

  const toIsoDate = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selected && "text-muted-foreground"
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 size-4" />
        {selected ? selected.toLocaleDateString() : "Pick a date"}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (date) onChange(toIsoDate(date))
          }}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
