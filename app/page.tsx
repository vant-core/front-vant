"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthForm from "@/components/auth-form"

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      router.push("/home")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return null
  }

  return <AuthForm />
}
