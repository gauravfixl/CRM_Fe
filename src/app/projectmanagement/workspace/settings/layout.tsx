"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Settings,
    Shield,
    Zap,
    Share2,
    ChevronRight,
    Building2,
    Users,
    Layout
} from "lucide-react"
import { cn } from "@/lib/utils"

const SETTINGS_TABS = [
    { id: 'general', title: 'General', href: '/projectmanagement/workspace/settings/general', icon: Building2 },
    { id: 'roles', title: 'Roles & Permissions', href: '/projectmanagement/workspace/settings/roles', icon: Shield },
    { id: 'workflow', title: 'Workflow Engine', href: '/projectmanagement/workspace/settings/workflow', icon: Zap },
    { id: 'integrations', title: 'Integrations', href: '/projectmanagement/workspace/settings/integrations', icon: Share2 },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="w-full space-y-8 py-8 animate-in fade-in duration-1000 px-4 pb-32">
            {/* dynamic header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-200">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <Settings size={20} />
                        </div>
                        <h4 className="text-[12px] font-bold text-slate-400">Administrative Terminal</h4>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Workspace <span className="text-indigo-600">Preferences</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500 max-w-xl">
                        Global configuration layer for organization structure, security protocols, and operational workflows.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Side Navigation */}
                <div className="col-span-12 lg:col-span-3 space-y-2">
                    {SETTINGS_TABS.map((tab) => {
                        const isActive = pathname === tab.href
                        return (
                            <Link key={tab.id} href={tab.href}>
                                <div className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl transition-all group",
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 shadow-indigo-500/10"
                                        : "bg-white border-2 border-slate-50 text-slate-500 hover:border-indigo-100 hover:text-indigo-600"
                                )}>
                                    <div className="flex items-center gap-3">
                                        <tab.icon size={18} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600")} />
                                        <span className="text-[13px] font-semibold">{tab.title}</span>
                                    </div>
                                    <ChevronRight size={14} className={cn("transition-transform", isActive ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0")} />
                                </div>
                            </Link>
                        )
                    })}

                    <div className="pt-8 px-2 space-y-4">
                        <p className="text-[11px] font-bold text-slate-400">Status</p>
                        <div className="p-4 bg-slate-900 rounded-[32px] space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400">Latency</span>
                                <span className="text-[10px] font-bold text-emerald-400">Normal</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400">Region</span>
                                <span className="text-[10px] font-bold text-slate-100">US-East</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="col-span-12 lg:col-span-9">
                    {children}
                </div>
            </div>
        </div>
    )
}
