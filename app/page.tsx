"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ModernLanding } from "@/components/modern-landing"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    try {
      const userRaw = typeof window !== 'undefined' ? localStorage.getItem('user') : null
      if (userRaw) {
        router.push('/dashboard')
      }
    } catch (_) {
      // ignore
    }
  }, [router])

  return <ModernLanding />
}
