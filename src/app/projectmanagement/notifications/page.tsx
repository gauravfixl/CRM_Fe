"use client"

import React, { useEffect, useState } from "react"
import {
    Bell,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    AtSign,
    UserPlus,
    Trash2,
    Calendar,
    PlayCircle,
    Flag,
    UserCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useNotificationStore, type NotificationType } from "@/shared/data/notification-store"

const TYPE_LABEL: Record<NotificationType, string> = {
    TASK_ASSIGNED: "Assignment",
    TASK_UPDATED: "Status",
    TASK_COMMENTED: "Comment",
    MENTION: "Mention",
    PROJECT_INVITE: "Invite",
    SPRINT_STARTED: "Sprint",
    SPRINT_COMPLETED: "Sprint",
    DEADLINE_APPROACHING: "Deadline",
}

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
    TASK_ASSIGNED: <UserPlus size={14} />,
    TASK_UPDATED: <CheckCircle2 size={14} />,
    TASK_COMMENTED: <MessageSquare size={14} />,
    MENTION: <AtSign size={14} />,
    PROJECT_INVITE: <UserCheck size={14} />,
    SPRINT_STARTED: <PlayCircle size={14} />,
    SPRINT_COMPLETED: <Flag size={14} />,
    DEADLINE_APPROACHING: <Calendar size={14} />,
}

const TYPE_BG: Record<NotificationType, string> = {
    TASK_ASSIGNED: "bg-emerald-500",
    TASK_UPDATED: "bg-indigo-500",
    TASK_COMMENTED: "bg-blue-500",
    MENTION: "bg-amber-500",
    PROJECT_INVITE: "bg-purple-500",
    SPRINT_STARTED: "bg-emerald-500",
    SPRINT_COMPLETED: "bg-indigo-500",
    DEADLINE_APPROACHING: "bg-rose-500",
}

type FilterId = "all" | "unread" | NotificationType

const CURRENT_USER_ID = "u1"

function getRelativeTime(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 30) return `${days}d ago`
    return new Date(iso).toLocaleDateString()
}

export default function NotificationsPage() {
    const [mounted, setMounted] = useState(false)
    const { notifications, markAsRead, markAllAsRead, deleteNotification, toggleRead } = useNotificationStore() as any
    const [typeFilter, setTypeFilter] = useState<FilterId>("all")

    useEffect(() => {
        setMounted(true)
        useNotificationStore.persist.rehydrate()
    }, [])

    if (!mounted) return null

    const filtered = notifications.filter((n: any) => {
        if (typeFilter === "all") return true
        if (typeFilter === "unread") return !n.isRead
        return n.type === typeFilter
    })

    const unreadCount = notifications.filter((n: any) => !n.isRead).length

    const kpis: { label: string; value: number; icon: React.ReactNode; color: string; bg: string; filter: FilterId }[] = [
        { label: "All", value: notifications.length, icon: <Bell size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", filter: "all" },
        { label: "Unread", value: unreadCount, icon: <AlertCircle size={18} />, color: "text-rose-800", bg: "bg-rose-100", filter: "unread" },
        { label: "Mentions", value: notifications.filter((n: any) => n.type === "MENTION").length, icon: <AtSign size={18} />, color: "text-amber-800", bg: "bg-amber-100", filter: "MENTION" },
        { label: "Assignments", value: notifications.filter((n: any) => n.type === "TASK_ASSIGNED").length, icon: <UserPlus size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", filter: "TASK_ASSIGNED" },
    ]

    const handleMarkAllRead = () => {
        markAllAsRead(CURRENT_USER_ID)
    }

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <Bell size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notifications</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Mentions, assignments, comments and system events.
                    </p>
                </div>
                <Button onClick={handleMarkAllRead} disabled={unreadCount === 0} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                    <CheckCircle2 size={14} /> Mark all read
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setTypeFilter(stat.filter)}
                        className={cn(
                            "block border shadow-sm h-[75px] rounded-none text-left transition-all hover:shadow-md hover:-translate-y-0.5",
                            stat.bg,
                            typeFilter === stat.filter && "ring-2 ring-indigo-500"
                        )}
                    >
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>{stat.icon}</div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                {([
                    { id: "all", label: "All" },
                    { id: "unread", label: "Unread" },
                    { id: "MENTION", label: "Mentions" },
                    { id: "TASK_ASSIGNED", label: "Assignments" },
                    { id: "TASK_COMMENTED", label: "Comments" },
                    { id: "TASK_UPDATED", label: "Status" },
                    { id: "SPRINT_STARTED", label: "Sprints" },
                    { id: "DEADLINE_APPROACHING", label: "Deadlines" },
                ] as { id: FilterId; label: string }[]).map(t => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setTypeFilter(t.id)}
                        className={cn(
                            "px-3 py-1.5 text-[11px] font-bold border-b-2 transition-colors rounded-none whitespace-nowrap",
                            typeFilter === t.id ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700"
                        )}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                {filtered.length === 0 ? (
                    <div className="py-14 text-center">
                        <Bell size={32} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-sm font-medium text-slate-500">No notifications.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {filtered.map((n: any) => (
                            <div key={n.id} className={cn("flex items-start gap-3 p-4 transition-colors", n.isRead ? "bg-white hover:bg-slate-50" : "bg-indigo-50/40 hover:bg-indigo-50/70")}>
                                <div className={`h-9 w-9 flex items-center justify-center text-white rounded-none ${TYPE_BG[n.type as NotificationType] || "bg-slate-500"}`}>
                                    {TYPE_ICON[n.type as NotificationType]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className={cn("text-sm", n.isRead ? "font-bold text-slate-700" : "font-black text-slate-900")}>{n.title}</h4>
                                        {!n.isRead && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                                        <Badge className="bg-slate-50 text-slate-500 text-[9px] font-bold rounded-none">{TYPE_LABEL[n.type as NotificationType] || n.type}</Badge>
                                    </div>
                                    <p className="text-[11px] text-slate-500">{n.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{getRelativeTime(n.createdAt)}{n.actorName && ` · by ${n.actorName}`}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => markAsRead(n.id)}
                                        className="h-7 px-2 text-[10px] font-bold text-slate-500 hover:text-indigo-600 rounded-none"
                                    >
                                        {n.isRead ? "Read" : "Mark read"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => deleteNotification(n.id)}
                                        className="h-7 w-7 flex items-center justify-center text-slate-300 hover:text-rose-600 rounded-none"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
