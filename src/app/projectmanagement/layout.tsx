"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { GlobalTopBar } from "@/shared/components/projectmanagement/global-top-bar"
import { ProjectSidebar } from "@/shared/components/projectmanagement/sidebar"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/shared/components/ui/sidebar"
import { motion, AnimatePresence } from "framer-motion"
import Loader from "@/shared/components/custom/Loader"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { useProjectStore } from "@/shared/data/projects-store"
import { useIssueStore } from "@/shared/data/issue-store"
import { useTeamStore } from "@/shared/data/team-store"
import { useDocumentStore } from "@/shared/data/document-store"
import { useProjectTemplateStore } from "@/shared/data/project-template-store"
import { useCommentStore } from "@/shared/data/comment-store"
import { useAuditLogsStore } from "@/shared/data/audit-logs-store"
import { useSprintStore } from "@/shared/data/sprint-store"

export default function ProjectManagementLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isNavigating, setIsNavigating] = useState(false)

    // Hydrate stores on mount
    useEffect(() => {
        useWorkspaceStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
        useIssueStore.persist.rehydrate()
        useTeamStore.persist.rehydrate()
        useDocumentStore.persist.rehydrate()
        useProjectTemplateStore.persist.rehydrate()
        useCommentStore.persist.rehydrate()
        useAuditLogsStore.persist.rehydrate()
        useSprintStore.persist.rehydrate()
    }, [])

    useEffect(() => {
        setIsNavigating(true)
        const timer = setTimeout(() => {
            setIsNavigating(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <SidebarProvider style={{ "--sidebar-width": "14rem" } as React.CSSProperties}>
            <div className="flex flex-col h-screen overflow-hidden w-full bg-[#f8fafc] text-foreground font-sans text-[13px] relative transition-all duration-300">
                {/* 🚀 Global Top Loader */}
                <AnimatePresence>
                    {isNavigating && (
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-600 z-[9999] shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        />
                    )}
                </AnimatePresence>

                <GlobalTopBar />
                <div className="flex flex-1 overflow-hidden pt-[63px]">
                    <ProjectSidebar />
                    <SessionProvider>
                        <main className="flex-1 overflow-y-auto bg-[#f8fafc] custom-scrollbar">
                            {/* 🕒 Main Page Loader (Circular) */}
                            <AnimatePresence mode="wait">
                                {isNavigating && <Loader />}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={pathname}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-4"
                                    style={{ zoom: "90%" }}
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
