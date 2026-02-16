"use client"

import React from "react"
import { useParams } from "next/navigation"
import ActivityFeed from "@/shared/components/projectmanagement/activity-feed"
import { Activity, History } from "lucide-react"

export default function ProjectActivityPage() {
    const { id } = useParams()
    const projectId = id as string

    return (
        <div className="flex flex-col h-full font-sans">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl text-white shadow-lg shadow-blue-100">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Activity Log</h1>
                        <p className="text-[13px] text-slate-500 font-medium">Track all changes and events in this project</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
                <div className="max-w-3xl">
                    <ActivityFeed projectId={projectId} limit={100} />
                </div>
            </div>
        </div>
    )
}
