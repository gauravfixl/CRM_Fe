"use client"

import type React from "react"
import { AppHeader } from "@/components/app-header"
import { Sidebar } from "@/components/hrm/sidebar"
import { SessionProvider } from "next-auth/react"
import { SidebarInset, SidebarProvider } from "@/shared/components/ui/sidebar"

export default function HRMLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex flex-col min-h-screen w-full bg-muted/50 text-foreground">
                <AppHeader />
                <div className="flex flex-1 pt-[63px] overflow-hidden">
                    <Sidebar />
                    <SessionProvider>
                        <main className="flex-1 h-full overflow-y-auto bg-background p-6">
                            {children}
                        </main>
                    </SessionProvider>
                </div>
            </div>
        </SidebarProvider>
    )
}
