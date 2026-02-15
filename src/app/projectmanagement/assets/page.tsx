"use client"

import React, { useEffect } from "react"
import GlobalFileExplorer from "@/shared/components/projectmanagement/global-file-explorer"
import { useDocumentStore } from "@/shared/data/document-store"
import { useProjectStore } from "@/shared/data/projects-store"
import {
    CloudIcon,
    HardDrive,
    Files
} from "lucide-react"

export default function AssetsHubPage() {
    const [mounted, setMounted] = React.useState(false)
    const { documents } = useDocumentStore()

    useEffect(() => {
        setMounted(true)
        useDocumentStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    return (
        <div className="w-full h-full p-6 space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Central repository for workspace artifacts and files.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                            <Files size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Count</p>
                            <p className="text-sm font-bold text-slate-900">{mounted ? documents.length : 0} Files</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
                            <HardDrive size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage</p>
                            <p className="text-sm font-bold text-slate-900">1.2 GB</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Explorer Component */}
            <GlobalFileExplorer />
        </div>
    )
}
