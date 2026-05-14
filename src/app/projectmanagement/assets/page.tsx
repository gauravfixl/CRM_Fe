"use client"

import React, { useEffect, useState } from "react"
import GlobalFileExplorer from "@/shared/components/projectmanagement/global-file-explorer"
import { useDocumentStore } from "@/shared/data/document-store"
import { useProjectStore } from "@/shared/data/projects-store"
import {
    HardDrive,
    Files,
    Folder,
    Upload,
    ChevronRight,
    Image as ImageIcon
} from "lucide-react"

export default function AssetsHubPage() {
    const [mounted, setMounted] = useState(false)
    const { documents } = useDocumentStore()
    const { projects } = useProjectStore()

    useEffect(() => {
        setMounted(true)
        useDocumentStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const count = mounted ? documents.length : 0
    const imageCount = mounted ? documents.filter((d: any) => d.type?.toLowerCase().includes('image') || d.name?.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)).length : 0

    const kpis = [
        { label: "Total Files", value: count, icon: <Files size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
        { label: "Projects", value: projects.length, icon: <Folder size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
        { label: "Images", value: imageCount, icon: <ImageIcon size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
        { label: "Storage", value: "1.2 GB", icon: <HardDrive size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Central repository for workspace artifacts and files.
                    </p>
                </div>
            </div>

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

            <GlobalFileExplorer />
        </div>
    )
}
