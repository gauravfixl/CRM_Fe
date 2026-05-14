"use client"

import React, { useEffect, useState } from "react"
import { Layout, ChevronRight, Star, Package, Briefcase } from "lucide-react"
import TemplateGallery from "@/shared/components/projectmanagement/template-gallery"
import { useProjectTemplateStore } from "@/shared/data/project-template-store"

export default function TemplatesPage() {
    const [mounted, setMounted] = useState(false)
    const { listTemplates } = useProjectTemplateStore()

    useEffect(() => {
        setMounted(true)
        useProjectTemplateStore.persist?.rehydrate?.()
    }, [])

    const { system, organization } = mounted ? listTemplates({ organizationId: "org-1" }) : { system: [], organization: [] }
    const total = system.length + organization.length
    const recommendedCount = [...system, ...organization].filter(t => t.recommended).length

    const kpis = [
        { label: "Total Templates", value: total, icon: <Layout size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
        { label: "System", value: system.length, icon: <Package size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
        { label: "Custom", value: organization.length, icon: <Briefcase size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
        { label: "Recommended", value: recommendedCount, icon: <Star size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
    ]

    return (
        <div className="flex flex-col h-full font-sans">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 text-white shadow-sm rounded-none">
                            <Layout size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Project Templates</h1>
                            <p className="text-[12px] text-slate-500 font-medium">Browse and manage project templates</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                <div className="max-w-6xl mx-auto space-y-5">
                    {/* KPI cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kpis.map((stat, i) => (
                            <div
                                key={i}
                                className={`block border shadow-sm overflow-hidden hover:shadow-md transition-all h-[75px] rounded-none ${stat.bg}`}
                            >
                                <div className="p-4 flex items-center justify-between w-full h-full">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>
                                            {stat.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                            <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-500/60" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <TemplateGallery organizationId="org-1" />
                </div>
            </div>
        </div>
    )
}
