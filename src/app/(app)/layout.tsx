"use client"

import { useEffect, type ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpen,
  Building2,
  Boxes,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  UserCheck,
  Wallet,
  ChevronsUpDown,
  Sparkles,
} from "lucide-react"

import { useAuth } from "@/providers/AuthProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface NavItem {
  module: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { module: "Registrar", label: "Registrar", href: "/registrar", icon: GraduationCap },
  { module: "Finance", label: "Finance", href: "/finance", icon: Wallet },
  { module: "Personnel", label: "Personnel", href: "/personnel", icon: UserCheck },
  { module: "Asset", label: "Asset & Property", href: "/asset", icon: Boxes },
  { module: "Library", label: "Library", href: "/library", icon: BookOpen },
  { module: "Administration", label: "Administration", href: "/administration", icon: ShieldAlert },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, hasModule, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Safely extract properties if they exist on user object
  const userObj = user as Record<string, unknown> | null
  const userAvatar = typeof userObj?.avatar_url === "string" ? userObj.avatar_url : undefined
  const userEmail = typeof userObj?.email === "string" ? userObj.email : undefined

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl" />
          <Skeleton className="h-4 w-32 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!user) return null

  const initials = user.full_name
    ? user.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
    : "U"

  const filteredModules = NAV_ITEMS.filter((item) => hasModule(item.module))

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-zinc-950">
      {/* Floating Modern Sidebar Container */}
      <aside className="my-3 ml-3 flex w-64 shrink-0 flex-col rounded-2xl border border-border/60 bg-background/80 p-3 shadow-sm backdrop-blur-md transition-all">

        {/* Brand Header */}
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20 ring-1 ring-white/20">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-foreground">Campus ERP</span>
            <span className="text-[11px] font-medium text-muted-foreground/80">Management Portal</span>
          </div>
        </div>

        <div className="my-3 h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Navigation Section */}
        <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-1 py-1">

          {/* Main Group */}
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              Overview
            </span>
            <Link
              href="/dashboard"
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ease-in-out",
                pathname === "/dashboard"
                  ? "bg-secondary/80 font-semibold text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {pathname === "/dashboard" && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <LayoutDashboard className={cn("h-4 w-4 transition-transform group-hover:scale-105", pathname === "/dashboard" ? "text-primary" : "text-muted-foreground")} />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Modules Group */}
          {filteredModules.length > 0 && (
            <div className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                Modules
              </span>
              {filteredModules.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.module}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 ease-in-out",
                      isActive
                        ? "bg-secondary/80 font-semibold text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                    )}
                    <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-105", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </nav>

        {/* User Dropdown Footer */}
        <div className="mt-auto pt-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex w-full items-center justify-between rounded-xl border border-transparent p-2 text-left outline-none transition-all hover:border-border/60 hover:bg-muted/50"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={user.full_name}
                    className="h-8 w-8 shrink-0 rounded-lg object-cover ring-1 ring-border"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-xs text-primary ring-1 ring-primary/20">
                    {initials}
                  </div>
                )}
                <div className="flex flex-col truncate">
                  <span className="truncate text-xs font-semibold text-foreground">{user.full_name}</span>
                  <span className="truncate text-[11px] text-muted-foreground">{userEmail || "Authenticated"}</span>
                </div>
              </div>
              <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" side="right" className="w-56 rounded-xl p-1.5 shadow-xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex cursor-pointer items-center gap-2 rounded-lg text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}