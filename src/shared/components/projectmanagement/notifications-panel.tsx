"use client"

import React from "react"
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { useNotificationStore, Notification, NotificationType } from "@/shared/data/notification-store"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface NotificationsPanelProps {
    isOpen: boolean
    onClose: () => void
    userId?: string
}

export default function NotificationsPanel({ isOpen, onClose, userId = "u1" }: NotificationsPanelProps) {
    const router = useRouter()
    const { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotificationStore()

    const notifications = getNotifications(userId)
    const unreadNotifications = notifications.filter(n => !n.isRead)

    const getNotificationIcon = (type: NotificationType) => {
        const icons = {
            TASK_ASSIGNED: "📋",
            TASK_UPDATED: "✏️",
            TASK_COMMENTED: "💬",
            MENTION: "@",
            PROJECT_INVITE: "📨",
            SPRINT_STARTED: "🚀",
            SPRINT_COMPLETED: "✅",
            DEADLINE_APPROACHING: "⏰"
        }
        return icons[type] || "🔔"
    }

    const getNotificationColor = (type: NotificationType) => {
        const colors = {
            TASK_ASSIGNED: "bg-blue-100 text-blue-700",
            TASK_UPDATED: "bg-purple-100 text-purple-700",
            TASK_COMMENTED: "bg-green-100 text-green-700",
            MENTION: "bg-amber-100 text-amber-700",
            PROJECT_INVITE: "bg-indigo-100 text-indigo-700",
            SPRINT_STARTED: "bg-emerald-100 text-emerald-700",
            SPRINT_COMPLETED: "bg-teal-100 text-teal-700",
            DEADLINE_APPROACHING: "bg-red-100 text-red-700"
        }
        return colors[type] || "bg-slate-100 text-slate-700"
    }

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id)
        if (notification.actionUrl) {
            router.push(notification.actionUrl)
            onClose()
        }
    }

    const formatTime = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
        } catch {
            return "recently"
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-md p-0">
                {/* Header */}
                <SheetHeader className="sticky top-0 z-10 bg-white border-b border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <SheetTitle className="text-[16px] font-bold text-slate-900">
                                Notifications
                            </SheetTitle>
                            {unreadNotifications.length > 0 && (
                                <Badge className="bg-red-500 text-white text-[10px] font-bold border-none h-5 px-2">
                                    {unreadNotifications.length}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadNotifications.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAllAsRead(userId)}
                                    className="h-7 px-2 text-[11px] font-semibold"
                                >
                                    <CheckCheck size={14} className="mr-1" />
                                    Mark all read
                                </Button>
                            )}
                            {notifications.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        if (confirm("Clear all notifications?")) {
                                            clearAll(userId)
                                        }
                                    }}
                                    className="h-7 px-2 text-[11px] font-semibold text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={14} />
                                </Button>
                            )}
                        </div>
                    </div>
                </SheetHeader>

                {/* Notifications List */}
                <div className="overflow-y-auto h-full">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6">
                            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Bell size={28} className="text-slate-400" />
                            </div>
                            <p className="text-[14px] font-bold text-slate-900 mb-1">No notifications</p>
                            <p className="text-[12px] text-slate-500 text-center">
                                You're all caught up! We'll notify you when something new happens.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group relative ${!notification.isRead ? "bg-blue-50/30" : ""
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {/* Unread indicator */}
                                    {!notification.isRead && (
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 bg-blue-500 rounded-full" />
                                    )}

                                    <div className="flex items-start gap-3 pl-3">
                                        {/* Avatar or Icon */}
                                        {notification.actorAvatar ? (
                                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                                                <AvatarImage src={notification.actorAvatar} />
                                                <AvatarFallback className="text-[11px] font-bold bg-indigo-100 text-indigo-700">
                                                    {notification.actorName?.[0] || "?"}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-[18px] shrink-0 ${getNotificationColor(notification.type)}`}>
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-bold text-slate-900 mb-0.5">
                                                {notification.title}
                                            </p>
                                            <p className="text-[12px] text-slate-600 font-medium mb-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`text-[9px] font-bold border-none ${getNotificationColor(notification.type)}`}>
                                                    {notification.type.replace(/_/g, " ")}
                                                </Badge>
                                                <span className="text-[10px] text-slate-400 font-medium">
                                                    {formatTime(notification.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                            {!notification.isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        markAsRead(notification.id)
                                                    }}
                                                    className="h-7 w-7 p-0"
                                                    title="Mark as read"
                                                >
                                                    <Check size={14} />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteNotification(notification.id)
                                                }}
                                                className="h-7 w-7 p-0 text-red-600 hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <X size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
