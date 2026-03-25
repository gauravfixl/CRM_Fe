"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AppHeader } from "@/shared/components/app-header"
import { ClientSidebar } from "@/shared/components/client-management/sidebar"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/shared/components/ui/sidebar"
import { motion, AnimatePresence } from "framer-motion"
import Loader from "@/shared/components/custom/Loader"

export default function ClientManagementLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isNavigating, setIsNavigating] = useState(false)

    useEffect(() => {
        setIsNavigating(true)
        const timer = setTimeout(() => {
            setIsNavigating(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <SidebarProvider style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
            <div className="flex flex-col min-h-screen w-full bg-[#f8fafc] text-foreground font-outfit relative transition-all duration-300">
                {/* Global Top Loader */}
                <AnimatePresence>
                    {isNavigating && (
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 z-[9999] shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        />
                    )}
                </AnimatePresence>

                <AppHeader />
                <div className="flex flex-1 pt-[63px] overflow-hidden">
                    <ClientSidebar />
                    <SessionProvider>
                        <main className="flex-1 h-full overflow-y-auto bg-[#f8fafc] custom-scrollbar relative" style={{ zoom: "0.9" }}>
                            {/* Main Page Loader (Circular) */}
                            <AnimatePresence>
                                {isNavigating && <Loader />}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={pathname}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="p-5 h-full"
                                >
                                    {children}
                                </motion.div>
                            </AnimatePresence>
                        </main>
                    </SessionProvider>
                </div>
            </div>
        </SidebarProvider>
    )
}
