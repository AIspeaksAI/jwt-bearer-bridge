"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Link as LinkIcon, Shield, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      label: "JWT Config",
      icon: LinkIcon,
      isActive: pathname === "/"
    },
    {
      href: "/auth",
      label: "Salesforce Auth",
      icon: Shield,
      isActive: pathname === "/auth"
    },
    {
      href: "/query",
      label: "API Query",
      icon: Database,
      isActive: pathname === "/query"
    }
  ]

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-primary-foreground rounded rotate-45"></div>
            </div>
            <h1 className="text-xl font-semibold text-foreground">JWT Bearer Bridge</h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={item.isActive ? "default" : "ghost"}
                    className={`flex items-center space-x-2 ${
                      item.isActive 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "text-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}