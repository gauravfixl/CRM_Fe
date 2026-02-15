"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Sidebar } from "@/shared/components/hrm/sidebar"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/shared/components/ui/sidebar"
import { motion, AnimatePresence } from "framer-motion"
import Loader from "@/shared/components/custom/Loader"

export default function HRMLayout({ children }: { children: React.ReactNode }) {
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
        <SidebarProvider style={{ "--sidebar-width": "15rem" } as React.CSSProperties}>
            <div className="flex flex-col min-h-screen w-full bg-[#f8fafc] text-foreground font-sans text-[13px] relative transition-all duration-300">
                {/* 🚀 Global Top Loader */}
                <AnimatePresence>
                    {isNavigating && (
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 z-[9999] shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        />
                    )}
                </AnimatePresence>

                <AppHeader />
                <div className="flex flex-1 pt-[63px] overflow-hidden">
                    <Sidebar />
                    <SessionProvider>
                        <main className="flex-1 h-full overflow-y-auto bg-[#f8fafc] custom-scrollbar relative">
                            {/* 🕒 Main Page Loader (Circular) */}
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
