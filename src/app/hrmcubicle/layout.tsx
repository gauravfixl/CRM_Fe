"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { Sidebar } from "@/shared/components/hrm/sidebar"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/shared/components/ui/sidebar"
import { DashboardAccessGate } from "@/shared/components/custom/DashboardAccessGate"
import { motion, AnimatePresence } from "framer-motion"
import Loader from "@/shared/components/custom/Loader"
import { useAuthStore } from "@/lib/useAuthStore"
import axios from "@/lib/axios"

export default function HRMLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isNavigating, setIsNavigating] = useState(false)
    const [isHrmAuthChecking, setIsHrmAuthChecking] = useState(true)
    const { user } = useAuthStore()

    // Check and setup HRM authentication
    useEffect(() => {
        const setupHrmAuth = async () => {
            try {
                // Check if HRM cookies exist by making a test call
                const testResponse = await axios.get("/hrm/attendance/me").catch(() => null)

                // If test call succeeds, HRM auth is already set
                if (testResponse?.status === 200) {
                    setIsHrmAuthChecking(false)
                    return
                }

                // If user is logged in CRM but not HRM, auto-login to HRM
                if (user?.email) {
                    // Get password from localStorage if available (from recent login)
                    const recentPassword = sessionStorage.getItem("_temp_pwd")

                    if (recentPassword) {
                        await axios.post("/hrm/auth/login", {
                            email: user.email,
                            password: recentPassword
                        })
                        // Clear temp password
                        sessionStorage.removeItem("_temp_pwd")
                    }
                }
            } catch (error) {
                console.error("HRM auth setup failed:", error)
            } finally {
                setIsHrmAuthChecking(false)
            }
        }

        setupHrmAuth()
    }, [user])

    useEffect(() => {
        setIsNavigating(true)
        const timer = setTimeout(() => {
            setIsNavigating(false)
        }, 150)
        return () => clearTimeout(timer)
    }, [pathname])

    // Show loader while checking HRM auth
    if (isHrmAuthChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
                <Loader />
            </div>
        )
    }

    return (
        <DashboardAccessGate dashboardPath="/hrmcubicle" dashboardName="HRM / Workforce">
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
        </DashboardAccessGate>
    )
}
