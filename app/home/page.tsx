"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import ChatInterface from "@/components/chat-interface"

export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/")
    } else {
      setIsAuthenticated(true)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <ChatInterface />
        </div>
      </main>
    </div>
  )
}
