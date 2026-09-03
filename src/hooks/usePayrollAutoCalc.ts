// src/hooks/usePayrollAutoCalc.ts
"use client"

import { useEffect, useRef } from "react"
import type { UseFormReturn } from "react-hook-form"
import { computePayrollFields } from "@/lib/forms/payroll"

/**
 * Watches `gross_pay` on the given react-hook-form instance and
 * auto-fills the derived statutory-deduction and hourly-rate fields
 * whenever it changes (OnChange/OnKeyup equivalent for RHF).
 *
 * Every write goes through `setValue(..., { shouldDirty: true })` with a
 * genuine number — never a concatenated string — so the "72120.00" bug
 * (decimal point lost during string handling) can't recur here.
 */
export function usePayrollAutoCalc(form: UseFormReturn<Record<string, unknown>>) {
    const grossPay = form.watch("gross_pay")
    // Avoids re-running (and re-dirtying the form) when the effect fires
    // for reasons other than an actual gross_pay change, e.g. form.reset().
    const lastComputedFor = useRef<unknown>(undefined)

    useEffect(() => {
        if (grossPay === lastComputedFor.current) return
        lastComputedFor.current = grossPay

        const computed = computePayrollFields(grossPay)

        for (const [fieldname, value] of Object.entries(computed)) {
            form.setValue(fieldname, value, {
                shouldDirty: true,
                shouldValidate: false,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grossPay])
}