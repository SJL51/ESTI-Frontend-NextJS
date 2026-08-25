import Link from "next/link"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SCREENS = [
  {
    href: "/personnel/employees",
    title: "Employees",
    description: "Personnel directory — employee IDs, departments, designations, employment status.",
  },
]

export default function PersonnelPage() {
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Personnel</h1>
        <p className="text-muted-foreground">
          Employee directory and staff records.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SCREENS.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="h-full transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
                <CardDescription>{s.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
