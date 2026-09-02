"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
    Plus,
    Calendar as CalendarIcon,
    Clock,
    Trash2,
    Edit2,
    Loader2,
    ChevronRight,
    ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { frappe, getErrorMessage } from "@/lib/frappe"

// ---------------------------------------------------------------------------
// Mock Shift Data — out of scope this round, left exactly as designed.
// ---------------------------------------------------------------------------
const SHIFTS = [
    { id: "1", name: "Standard Morning", time: "08:00 AM - 05:00 PM", days: "Mon - Fri", grace: "15 mins" },
    { id: "2", name: "Evening Shift", time: "01:00 PM - 10:00 PM", days: "Mon - Fri", grace: "15 mins" },
    { id: "3", name: "Weekend Duty", time: "09:00 AM - 06:00 PM", days: "Sat - Sun", grace: "10 mins" },
]

// ---------------------------------------------------------------------------
// Holidays — real data, backed by SMS Personnel Holidays
// ---------------------------------------------------------------------------
const HOLIDAY_DOCTYPE = "SMS Personnel Holidays"

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
] as const

interface HolidayRow {
    name: string // Frappe docname (hash autoname)
    holiday_name: string
    month: (typeof MONTHS)[number]
    day: number
}

async function fetchHolidays(): Promise<HolidayRow[]> {
    return frappe.list<HolidayRow>(HOLIDAY_DOCTYPE, {
        fields: ["name", "holiday_name", "month", "day"],
        order_by: "month asc, day asc",
        limit_page_length: 100,
    })
}

const holidaySchema = z.object({
    holiday_name: z.string().min(1, "Holiday name is required"),
    month: z.enum(MONTHS, { error: "Month is required" }),
    day: z.coerce.number().int().min(1, "Day must be 1-31").max(31, "Day must be 1-31"),
})
// z.coerce.number() accepts unknown on input (e.g. the raw string from an
// <input type="number">) and outputs a real number — react-hook-form needs
// both ends of that separately, or TS can't tell the form's `day` is a number
// by the time onSubmit runs.
type HolidayFormInput = z.input<typeof holidaySchema>
type HolidayFormValues = z.output<typeof holidaySchema>

function HolidayDialog({
    open,
    onOpenChange,
    defaultValues,
    onSubmit,
    submitting,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultValues?: HolidayFormValues
    onSubmit: (values: HolidayFormValues) => void
    submitting: boolean
}) {
    const isEdit = Boolean(defaultValues)
    const form = useForm<HolidayFormInput, unknown, HolidayFormValues>({
        resolver: zodResolver(holidaySchema),
        values: defaultValues ?? { holiday_name: "", month: "January", day: 1 },
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Edit Holiday" : "Add Holiday"}</DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? "Update this holiday's details."
                                : "Add a new official holiday to the calendar."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label htmlFor="holiday_name">Holiday Name</Label>
                        <Input
                            id="holiday_name"
                            placeholder="e.g. Independence Day"
                            {...form.register("holiday_name")}
                        />
                        {form.formState.errors.holiday_name && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.holiday_name.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="month">Month</Label>
                            <Select
                                value={form.watch("month")}
                                onValueChange={(v) => form.setValue("month", v as HolidayFormValues["month"], { shouldValidate: true })}
                            >
                                <SelectTrigger id="month">
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MONTHS.map((m) => (
                                        <SelectItem key={m} value={m}>
                                            {m}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="day">Day</Label>
                            <Input
                                id="day"
                                type="number"
                                min={1}
                                max={31}
                                {...form.register("day")}
                            />
                            {form.formState.errors.day && (
                                <p className="text-xs text-destructive">
                                    {form.formState.errors.day.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {isEdit ? "Save Changes" : "Add Holiday"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function HolidaysTab() {
    const queryClient = useQueryClient()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<HolidayRow | null>(null)

    const { data: holidays, isLoading, isError, error } = useQuery({
        queryKey: ["holidays"],
        queryFn: fetchHolidays,
    })

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ["holidays"] })

    const createMutation = useMutation({
        mutationFn: (values: HolidayFormValues) =>
            frappe.createDoc(HOLIDAY_DOCTYPE, values),
        onSuccess: () => {
            toast.success("Holiday added")
            setDialogOpen(false)
            invalidate()
        },
        onError: (err) => toast.error(getErrorMessage(err)),
    })

    const updateMutation = useMutation({
        mutationFn: ({ name, values }: { name: string; values: HolidayFormValues }) =>
            frappe.updateDoc(HOLIDAY_DOCTYPE, name, values),
        onSuccess: () => {
            toast.success("Holiday updated")
            setDialogOpen(false)
            setEditing(null)
            invalidate()
        },
        onError: (err) => toast.error(getErrorMessage(err)),
    })

    const deleteMutation = useMutation({
        mutationFn: (name: string) => frappe.deleteDoc(HOLIDAY_DOCTYPE, name),
        onSuccess: () => {
            toast.success("Holiday deleted")
            invalidate()
        },
        onError: (err) => toast.error(getErrorMessage(err)),
    })

    const handleAdd = () => {
        setEditing(null)
        setDialogOpen(true)
    }

    const handleEdit = (row: HolidayRow) => {
        setEditing(row)
        setDialogOpen(true)
    }

    const handleDelete = (row: HolidayRow) => {
        if (confirm(`Delete "${row.holiday_name}"? This can't be undone.`)) {
            deleteMutation.mutate(row.name)
        }
    }

    const handleSubmit = (values: HolidayFormValues) => {
        if (editing) {
            updateMutation.mutate({ name: editing.name, values })
        } else {
            createMutation.mutate(values)
        }
    }

    const submitting = createMutation.isPending || updateMutation.isPending

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-base font-medium">Official Holidays</CardTitle>
                    <CardDescription className="text-xs">
                        Maintain the holiday calendar for timekeeping and payroll calculations.
                    </CardDescription>
                </div>
                <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={handleAdd}>
                    <Plus className="h-3.5 w-3.5" />
                    Add Holiday
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 py-10 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Loading holidays…
                    </div>
                ) : isError ? (
                    <div className="py-10 text-center text-xs text-destructive">
                        {getErrorMessage(error)}
                    </div>
                ) : !holidays?.length ? (
                    <div className="py-10 text-center text-xs text-muted-foreground">
                        No holidays yet. Add the first one above.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs">Holiday Name</TableHead>
                                <TableHead className="text-xs">Month</TableHead>
                                <TableHead className="text-xs">Day</TableHead>
                                <TableHead className="text-right text-xs">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {holidays.map((holiday) => (
                                <TableRow key={holiday.name}>
                                    <TableCell className="font-medium text-xs">{holiday.holiday_name}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        <Badge variant="secondary" className="font-normal text-[10px]">
                                            {holiday.month}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{holiday.day}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                onClick={() => handleEdit(holiday)}
                                            >
                                                <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive"
                                                onClick={() => handleDelete(holiday)}
                                                disabled={deleteMutation.isPending}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <HolidayDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                defaultValues={editing ?? undefined}
                onSubmit={handleSubmit}
                submitting={submitting}
            />
        </Card>
    )
}

// ---------------------------------------------------------------------------
export default function SchedulesPage() {
    return (
        <div className="space-y-6">
                        <div className="flex items-center gap-4">
                <Link href="/personnel" title="Back to Personnel">
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>

                <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Link href="/personnel" className="transition-colors hover:text-foreground">
                            Personnel
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="font-medium text-foreground">Attendance & Schedules</span>
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">
                        Attendance & Schedules
                    </h1>
                </div>
            </div>

            <Tabs defaultValue="shifts" className="w-full space-y-4">
                <div className="flex items-center justify-between">
                    <TabsList className="grid w-[320px] grid-cols-2">
                        <TabsTrigger value="shifts" className="flex items-center gap-2 text-xs">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Shift Schedules</span>
                        </TabsTrigger>
                        <TabsTrigger value="holidays" className="flex items-center gap-2 text-xs">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            <span>Holiday Calendar</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* TAB 1: SHIFT SCHEDULES — mock, out of scope for now */}
                <TabsContent value="shifts" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div>
                                <CardTitle className="text-base font-medium">Work Shift Patterns</CardTitle>
                                <CardDescription className="text-xs">
                                    Define working hours, shift routines, and grace period settings.
                                </CardDescription>
                            </div>
                            <Button size="sm" className="h-8 gap-1.5 text-xs">
                                <Plus className="h-3.5 w-3.5" />
                                Add Shift Pattern
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-xs">Shift Name</TableHead>
                                        <TableHead className="text-xs">Working Hours</TableHead>
                                        <TableHead className="text-xs">Applicable Days</TableHead>
                                        <TableHead className="text-xs">Grace Period</TableHead>
                                        <TableHead className="text-right text-xs">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {SHIFTS.map((shift) => (
                                        <TableRow key={shift.id}>
                                            <TableCell className="font-medium text-xs">{shift.name}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{shift.time}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{shift.days}</TableCell>
                                            <TableCell className="text-xs">
                                                <Badge variant="secondary" className="font-normal text-[10px]">
                                                    {shift.grace}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                                        <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TAB 2: HOLIDAYS — real data */}
                <TabsContent value="holidays" className="space-y-4">
                    <HolidaysTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}