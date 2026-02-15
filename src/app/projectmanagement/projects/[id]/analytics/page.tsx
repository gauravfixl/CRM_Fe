"use client"

import React from "react"
import { useParams } from "next/navigation"
import ProjectAnalyticsDashboard from "@/shared/components/projectmanagement/project-analytics-dashboard"
import { BarChart3, TrendingUp } from "lucide-react"

export default function ProjectAnalyticsPage() {
    const { id } = useParams()
    const projectId = id as string

    return (
        <div className="flex flex-col h-full font-sans">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Project Analytics</h1>
                        <p className="text-[13px] text-slate-500 font-medium">Insights, metrics, and performance tracking</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                <ProjectAnalyticsDashboard projectId={projectId} />
            </div>
        </div>
    )
}
