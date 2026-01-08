"use client"

import { useState } from "react"
import type React from "react"
import { AppHeader } from "@/components/app-header"
import { Sidebar } from "@/components/hrm/sidebar"
import { SessionProvider } from "next-auth/react"
export default function HRMLayout({ children }: { children: React.ReactNode }) {
  // Track sidebar open/close
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-muted/50 text-foreground">
      {/* Pass both sidebarOpen and setSidebarOpen to AppHeader */}
      <AppHeader setSidebarOpen={setSidebarOpen} />

      <div className="flex">
        {/* Sidebar visibility controlled by state */}
        <Sidebar  />

         <SessionProvider><main className="flex-1 min-h-[calc(100vh-64px)] overflow-hidden ">{children}</main></SessionProvider>
      </div>
    </div>
  )
}
