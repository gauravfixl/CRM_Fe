"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Bell,
    CheckCircle2,
    AlertTriangle,
    Info,
    XCircle,
    Trash2,
    Check,
    ExternalLink
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { useInboxStore, type Notification } from "@/shared/data/inbox-store";
import { useRouter } from "next/navigation";

const NotificationsPage = () => {
    const { toast } = useToast();
    const router = useRouter();
    const { notifications, markAsRead, markAllAsRead, deleteNotification } = useInboxStore();
    const [filter, setFilter] = useState<'All' | 'Unread'>('All');

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const filteredNotifications = filter === 'Unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const getTypeIcon = (type: Notification['type']) => {
        const icons = {
            'Info': <Info size={20} />,
            'Success': <CheckCircle2 size={20} />,
            'Warning': <AlertTriangle size={20} />,
            'Error': <XCircle size={20} />
        };
        return icons[type];
    };

    const getTypeColor = (type: Notification['type']) => {
        const colors = {
            'Info': 'bg-blue-100 text-blue-600',
            'Success': 'bg-emerald-100 text-emerald-600',
            'Warning': 'bg-amber-100 text-amber-600',
            'Error': 'bg-rose-100 text-rose-600'
        };
        return colors[type];
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        if (notification.actionUrl) {
            router.push(notification.actionUrl);
        }
    };

    const stats = [
        { label: "Total", value: notifications.length, color: "bg-[#CB9DF0]", icon: <Bell className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Unread", value: unreadCount, color: "bg-[#FFF9BF]", icon: <AlertTriangle className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Read", value: notifications.length - unreadCount, color: "bg-emerald-100", icon: <CheckCircle2 className="text-emerald-600" />, textColor: "text-emerald-900" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Notifications</h1>
                    <p className="text-slate-500 font-medium">Stay updated with system alerts and announcements.</p>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="rounded-xl border-slate-200 font-bold"
                        onClick={() => {
                            markAllAsRead();
                            toast({ title: "All notifications marked as read" });
                        }}
                        disabled={unreadCount === 0}
                    >
                        <Check className="mr-2 h-4 w-4" /> Mark All Read
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4`}>
                            <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3">
                <Button
                    variant={filter === 'All' ? 'default' : 'outline'}
                    className="rounded-xl font-bold"
                    onClick={() => setFilter('All')}
                >
                    All ({notifications.length})
                </Button>
                <Button
                    variant={filter === 'Unread' ? 'default' : 'outline'}
                    className="rounded-xl font-bold"
                    onClick={() => setFilter('Unread')}
                >
                    Unread ({unreadCount})
                </Button>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm">
                        <Bell className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="text-slate-400 font-bold">No notifications to display.</p>
                    </div>
                ) : (
                    filteredNotifications.map((notification, index) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                className={`border-none shadow-lg hover:shadow-xl transition-all rounded-[2rem] bg-white p-6 cursor-pointer group ${!notification.isRead ? 'border-l-4 border-l-indigo-500' : ''}`}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${getTypeColor(notification.type)} shrink-0`}>
                                        {getTypeIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className={`font-black text-lg text-slate-900 ${!notification.isRead ? 'text-indigo-600' : ''}`}>
                                                {notification.title}
                                            </h3>
                                            {!notification.isRead && (
                                                <div className="h-3 w-3 bg-indigo-500 rounded-full shrink-0 mt-1"></div>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 font-medium mb-3">{notification.message}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Badge className={`${getTypeColor(notification.type)} border-none font-bold text-xs`}>
                                                    {notification.type}
                                                </Badge>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {new Date(notification.timestamp).toLocaleString()}
                                                </span>
                                            </div>
                                            {notification.actionUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    View <ExternalLink size={14} className="ml-1" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.isRead && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 rounded-xl text-emerald-600 hover:bg-emerald-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification.id);
                                                    toast({ title: "Marked as read" });
                                                }}
                                            >
                                                <Check size={16} />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl text-rose-600 hover:bg-rose-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification(notification.id);
                                                toast({ title: "Notification deleted" });
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
