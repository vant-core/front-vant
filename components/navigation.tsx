"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut } from "lucide-react"

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40">
      <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link href="/home" className="text-xl font-bold text-primary mr-8">
            AIChat
          </Link>
          <div className="flex gap-2">
            <Link
              href="/home"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/home") ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/workspace"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/workspace") ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Workspace
            </Link>
          </div>
        </div>

        <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2 bg-transparent">
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </nav>
  )
}
