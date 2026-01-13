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
    <div className="h-screen overflow-hidden bg-muted/50 text-foreground">
      {/* Fixed Header */}
      <AppHeader setSidebarOpen={setSidebarOpen} />

      <div className="flex h-full pt-[63px]">
        {/* Sidebar */}
        <Sidebar />

        <SessionProvider>
          <main className="flex-1 h-full overflow-y-auto bg-background">
            {children}
          </main>
        </SessionProvider>
      </div>
    </div>
  )
}
