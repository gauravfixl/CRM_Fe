"use client"

import React from "react"
import Link from "next/link"
import { usePathname, useParams, useSearchParams } from "next/navigation"
import {
    Layout,
    Layers,
    Clock,
    Target,
    BarChart3,
    Users,
    BookOpen,
    Settings,
    MoreHorizontal,
    Share2,
    Star,
    ChevronDown,
    Zap,
    ListFilter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProjectStore } from "@/shared/data/projects-store"

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const params = useParams()
    const searchParams = useSearchParams()
    const id = params.id as string

    // Fetch project from store
    const { getProjectById } = useProjectStore()
    const project = getProjectById(id)
    const projectName = project?.name || "Project"

    // Define navigation tabs
    const TABS = [
        { name: "Summary", href: `/projectmanagement/projects/${id}/summary`, icon: null },
        { name: "List", href: `/projectmanagement/projects/${id}/list`, icon: null },
        { name: "Board", href: `/projectmanagement/projects/${id}/board`, icon: null },
        { name: "Backlog", href: `/projectmanagement/projects/${id}/backlog`, icon: null },
        { name: "Code", href: `/projectmanagement/projects/${id}/code`, icon: null },
        { name: "Forms", href: `/projectmanagement/projects/${id}/forms`, icon: null },
        { name: "Timeline", href: `/projectmanagement/projects/${id}/timeline`, icon: null },
        { name: "Pages", href: `/projectmanagement/projects/${id}/wiki`, icon: null },
        { name: "Issues", href: `/projectmanagement/projects/${id}/issues`, icon: null },
        { name: "Documents", href: `/projectmanagement/projects/${id}/documents`, icon: null },
        { name: "Analytics", href: `/projectmanagement/projects/${id}/analytics`, icon: null },
        { name: "Activity", href: `/projectmanagement/projects/${id}/activity`, icon: null },
        { name: "Reports", href: `/projectmanagement/projects/${id}/reports`, icon: null },
        { name: "Teams", href: `/projectmanagement/projects/${id}/teams`, icon: null },
        { name: "Settings", href: `/projectmanagement/projects/${id}/settings`, icon: null },
    ]

    return (
        <div className="flex flex-col h-full bg-white min-h-screen">
            {/* 1. Project Header Area (Compacted) */}
            <div className="px-6 pt-2 pb-0 bg-white">

                {/* Breadcrumbs & Actions (Tightened) */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500">
                        <Link href="/projectmanagement/projects" className="hover:underline hover:text-indigo-600 transition-colors">Projects</Link>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-800 font-semibold">{projectName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:bg-slate-50">
                            <Share2 size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:bg-slate-50">
                            <Zap size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:bg-slate-50">
                            <MoreHorizontal size={14} />
                        </Button>
                    </div>
                </div>

                {/* Project Identity (Compacted) */}
                <div className="flex items-center gap-4 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-100">
                        <Layout className="text-white h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{projectName}</h1>
                            <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600" />
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium leading-none mt-1">Strategic Mission Portfolio</p>
                    </div>
                    <div className="ml-auto">
                        <div className="flex -space-x-2">
                            {project?.memberIds?.slice(0, 5).map((mid, i) => (
                                <Avatar key={i} className="h-8 w-8 border-2 border-white ring-1 ring-slate-100 shadow-sm">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${mid}`} />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Horizontal Navigation Tabs (High-Density) */}
                <div className="flex items-center gap-1 border-b border-slate-100">
                    {TABS.map((tab) => {
                        const isActive = pathname.startsWith(tab.href);
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`
                                    relative px-4 py-3 text-[13px] font-semibold transition-all
                                    ${isActive
                                        ? "text-indigo-600"
                                        : "text-slate-500 hover:text-slate-800"
                                    }
                                `}
                            >
                                {tab.name}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-600 rounded-t-full shadow-[0_-4px_10px_rgba(99,102,241,0.2)]" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Content Area (Optimized) */}
            <div className="flex-1 overflow-auto bg-white p-4 relative custom-scrollbar">
                {children}


            </div>
        </div>
    )
}

function PlusIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
