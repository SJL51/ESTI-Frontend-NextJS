"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { useAuth } from "@/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"

const loginSchema = z.object({
    usr: z.string().min(1, "Username or email is required"),
    pwd: z.string().min(1, "Password is required"),
})

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const { login } = useAuth()
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { usr: "", pwd: "" },
    })

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setSubmitting(true)
        try {
            await login(values.usr, values.pwd)
            router.push("/")
        } catch {
            toast.error("Invalid username or password")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your credentials below to log into your account
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="usr"
                        render={({ field }) => (
                            <FormItem className="grid gap-2 space-y-0">
                                <FormLabel>Username or Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="m@example.com"
                                        autoComplete="username"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="pwd"
                        render={({ field }) => (
                            <FormItem className="grid gap-2 space-y-0">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Password</FormLabel>
                                    <a
                                        href="#"
                                        className="text-sm font-medium underline-offset-4 hover:underline"
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <FormControl>
                                    <Input
                                        type="password"
                                        autoComplete="current-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={submitting} className="w-full">
                        {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                        {submitting ? "Signing in…" : "Sign In"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}