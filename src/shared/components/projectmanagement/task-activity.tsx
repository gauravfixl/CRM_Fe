"use client"

import React from "react"
import { useCollaborationStore, Activity } from "@/shared/data/collaboration-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import {
    Activity as ActivityIcon,
    ArrowRight,
    MessageSquare,
    Layers,
    Flag,
    User,
    CheckCircle2,
    Clock
} from "lucide-react"

interface TaskActivityProps {
    taskId: string;
}

export default function TaskActivity({ taskId }: TaskActivityProps) {
    const { getActivitiesByTask } = useCollaborationStore()
    const activities = getActivitiesByTask(taskId)

    // Sort newest first
    const sortedActivities = [...activities].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const getIcon = (type: string) => {
        switch (type) {
            case "STATUS_CHANGE": return <Layers size={14} className="text-blue-500" />
            case "PRIORITY_CHANGE": return <Flag size={14} className="text-rose-500" />
            case "COMMENT_ADD": return <MessageSquare size={14} className="text-emerald-500" />
            case "ASSIGNEE_CHANGE": return <User size={14} className="text-indigo-500" />
            default: return <ActivityIcon size={14} className="text-slate-400" />
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {sortedActivities.length === 0 ? (
                <div className="text-center py-20 opacity-30">
                    <Clock size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Audit trail empty</p>
                </div>
            ) : (
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-100 before:via-slate-200 before:to-transparent">
                    {sortedActivities.map((activity) => (
                        <div key={activity.id} className="relative flex items-start gap-4">
                            {/* Icon Wrapper */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm z-10">
                                {getIcon(activity.type)}
                            </div>

                            <div className="flex-1 pt-1.5 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-[13px] text-slate-600 leading-tight">
                                        <span className="font-black text-slate-800 uppercase tracking-tight mr-1">{activity.userName}</span>
                                        <span className="font-medium text-slate-500">{activity.detail}</span>
                                    </p>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap ml-4">
                                        {formatDistanceToNow(new Date(activity.createdAt))} ago
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        {activity.type.replace("_", " ")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
