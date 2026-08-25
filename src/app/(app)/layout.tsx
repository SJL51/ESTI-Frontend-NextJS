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
import { Separator } from "@/components/ui/separator"
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
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
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

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar Navigation */}
      <aside className="flex w-64 shrink-0 flex-col border-r bg-muted/20 p-4">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight">Campus ERP</span>
            <span className="text-xs text-muted-foreground">Management Portal</span>
          </div>
        </div>

        <Separator className="my-3" />

        {/* Navigation Links */}
        <nav className="flex flex-1 flex-col gap-1">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === "/dashboard" ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          {NAV_ITEMS.filter((item) => hasModule(item.module)).map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.module}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Dropdown Footer */}
        <div className="mt-auto pt-3">
          <Separator className="mb-3" />
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex w-full items-center justify-between rounded-md p-2 hover:bg-accent hover:text-accent-foreground text-left outline-none transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={user.full_name}
                    className="h-8 w-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-medium text-xs text-muted-foreground">
                    {initials}
                  </div>
                )}
                <div className="flex flex-col truncate">
                  <span className="text-sm font-medium leading-none truncate">{user.full_name}</span>
                  <span className="text-xs text-muted-foreground truncate">{userEmail || "Authenticated"}</span>
                </div>
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground ml-2" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  )
}