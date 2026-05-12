"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { GlobalTopBar } from "@/shared/components/projectmanagement/global-top-bar"
import { ProjectSidebar } from "@/shared/components/projectmanagement/sidebar"
import { SessionProvider } from "next-auth/react"
import { SidebarProvider } from "@/shared/components/ui/sidebar"
import { DashboardAccessGate } from "@/shared/components/custom/DashboardAccessGate"
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
import { useSprintEpicStore } from "@/shared/data/sprint-epic-store"
import { useReleaseStore } from "@/shared/data/release-store"
import { useComponentStore } from "@/shared/data/component-store"
import { useCustomFieldStore } from "@/shared/data/custom-field-store"
import { useAutomationStore } from "@/shared/data/automation-store"
import { useNotificationStore } from "@/shared/data/notification-store"
import { useRolePermissionStore } from "@/shared/data/role-permission-store"
import { useWorkflowStore } from "@/shared/data/workflow-store"
import { getMyWorkspaces } from "@/modules/project-management/workspace/hooks/workspaceHooks"
import { getAllProjectsByWorkspace } from "@/modules/project-management/project/hooks/projectHooks"

export default function ProjectManagementLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const [isNavigating, setIsNavigating] = useState(false)
    const [didHydrateFromBackend, setDidHydrateFromBackend] = useState(false)
    const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId)

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
        useSprintEpicStore.persist.rehydrate()
        useReleaseStore.persist.rehydrate()
        useComponentStore.persist.rehydrate()
        useCustomFieldStore.persist.rehydrate()
        useAutomationStore.persist.rehydrate()
        useNotificationStore.persist.rehydrate()
        useRolePermissionStore.persist.rehydrate()
        useWorkflowStore.persist.rehydrate()
    }, [])

    // Backend-backed seed for sidebar + project listing
    useEffect(() => {
        const hydrateFromBackend = async () => {
            const { setWorkspaces, setActiveWorkspace } = useWorkspaceStore.getState()
            const { setProjects } = useProjectStore.getState()

            try {
                const wsRes = await getMyWorkspaces()
                const backendWorkspaces = wsRes?.data?.workspaces ?? []

                const mappedWorkspaces = backendWorkspaces.map((w: any) => ({
                    id: String(w._id),
                    name: w.name,
                    slug: w.slug ? String(w.slug) : String(w._id),
                    icon: "🚀",
                    createdAt: new Date().toISOString().slice(0, 10),
                    description: w.description ?? "",
                }))

                if (mappedWorkspaces.length > 0) {
                    setWorkspaces(mappedWorkspaces)
                    const firstId = mappedWorkspaces[0].id
                    setActiveWorkspace(firstId)

                    const projRes = await getAllProjectsByWorkspace(firstId, { page: 1, limit: 100 })
                    const backendProjects = projRes?.data?.projects ?? []

                    const mappedProjects = backendProjects.map((p: any) => ({
                        id: String(p._id),
                        workspaceId: firstId,
                        name: p.name,
                        key: String(p.name ?? "PRJ")
                            .replace(/[^a-zA-Z0-9 ]/g, "")
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .join("")
                            .substring(0, 3)
                            .toUpperCase(),
                        status: p.isArchived ? "Closing" : "Active",
                        priority: p.priority ?? undefined,
                        leadId: "",
                        memberIds: [],
                        members: 0,
                        due: "",
                        category: "General",
                        icon: "🚀",
                        type: "team" as const,
                        methodology: p.type === "scrum" ? "scrum" : "kanban",
                        starred: false,
                        description: p.description ?? "",
                        boardId: p.boardId ? String(p.boardId) : undefined,
                    }))

                    setProjects(mappedProjects)
                }
            } catch (err) {
                // Non-blocking: keep existing mock data if backend is unreachable.
                console.error("ProjectManagement backend hydrate failed:", err)
            } finally {
                setDidHydrateFromBackend(true)
            }
        }

        hydrateFromBackend()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // When user switches workspace from sidebar, refetch that workspace's projects from backend.
    useEffect(() => {
        if (!didHydrateFromBackend) return
        if (!activeWorkspaceId) return

        const syncProjects = async () => {
            const { setProjects } = useProjectStore.getState()
            try {
                const projRes = await getAllProjectsByWorkspace(activeWorkspaceId, { page: 1, limit: 100 })
                const backendProjects = projRes?.data?.projects ?? []

                const mappedProjects = backendProjects.map((p: any) => ({
                    id: String(p._id),
                    workspaceId: activeWorkspaceId,
                    name: p.name,
                    key: String(p.name ?? "PRJ")
                        .replace(/[^a-zA-Z0-9 ]/g, "")
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .substring(0, 3)
                        .toUpperCase(),
                    status: p.isArchived ? "Closing" : "Active",
                    priority: p.priority ?? undefined,
                    leadId: "",
                    memberIds: [],
                    members: 0,
                    due: "",
                    category: "General",
                    icon: "🚀",
                    type: "team" as const,
                    methodology: p.type === "scrum" ? "scrum" : "kanban",
                    starred: false,
                    description: p.description ?? "",
                    boardId: p.boardId ? String(p.boardId) : undefined,
                }))

                setProjects(mappedProjects)
            } catch (err) {
                console.error("Project sync on workspace switch failed:", err)
            }
        }

        void syncProjects()
    }, [didHydrateFromBackend, activeWorkspaceId])

    useEffect(() => {
        setIsNavigating(true)
        const timer = setTimeout(() => {
            setIsNavigating(false)
        }, 150)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <DashboardAccessGate dashboardPath="/projectmanagement" dashboardName="Project Management">
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
        </DashboardAccessGate>
    )
}
