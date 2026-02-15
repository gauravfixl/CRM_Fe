"use client"

import React from "react"
import TemplateGallery from "@/shared/components/projectmanagement/template-gallery"
import { Layout, Sparkles } from "lucide-react"

export default function TemplatesPage() {
    return (
        <div className="flex flex-col h-full font-sans">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-white shadow-lg shadow-purple-100">
                        <Layout size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Project Templates</h1>
                        <p className="text-[13px] text-slate-500 font-medium">Browse and manage project templates</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <TemplateGallery organizationId="org-1" />
                </div>
            </div>
        </div>
    )
}
