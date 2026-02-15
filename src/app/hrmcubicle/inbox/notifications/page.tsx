"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    CheckCircle2,
    AlertTriangle,
    Info,
    XCircle,
    Trash2,
    Check,
    ExternalLink,
    Filter,
    Calendar,
    ArrowRight,
    Zap,
    Clock,
    MoreVertical,
    CheckCircle,
    Settings,
    Megaphone,
    FileText,
    CreditCard,
    TrendingUp,
    Layout
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { useInboxStore, type Notification, type NotificationCategory } from "@/shared/data/inbox-store";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";

const NotificationsPage = () => {
    const { toast } = useToast();
    const router = useRouter();
    const { notifications, markAsRead, markAllAsRead, deleteNotification } = useInboxStore();

    const [view, setView] = useState<'all' | 'preferences'>('all');
    const [filterCategory, setFilterCategory] = useState<NotificationCategory | 'All'>('All');
    const [unreadOnly, setUnreadOnly] = useState(false);

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const filteredNotifications = notifications.filter(n => {
        const matchesCategory = filterCategory === 'All' || n.category === filterCategory;
        const matchesUnread = !unreadOnly || !n.isRead;
        return matchesCategory && matchesUnread;
    });

    const getCategoryStyles = (category: NotificationCategory) => {
        const styles = {
            'Announcement': { icon: <Megaphone className="w-5 h-5" />, bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
            'Policy': { icon: <FileText className="w-5 h-5" />, bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
            'Payroll': { icon: <CreditCard className="w-5 h-5" />, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
            'Performance': { icon: <TrendingUp className="w-5 h-5" />, bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
            'System': { icon: <Layout className="w-5 h-5" />, bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' },
        };
        return styles[category] || styles['System'];
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) markAsRead(notification.id);
        if (notification.actionUrl) router.push(notification.actionUrl);
    };

    const categories: { label: string, value: NotificationCategory | 'All', icon: any }[] = [
        { label: "All Alerts", value: "All", icon: Bell },
        { label: "Announcements", value: "Announcement", icon: Megaphone },
        { label: "Policies", value: "Policy", icon: FileText },
        { label: "Payroll", value: "Payroll", icon: CreditCard },
        { label: "Performance", value: "Performance", icon: TrendingUp },
        { label: "System", value: "System", icon: Layout },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="p-6 border-b border-slate-100 bg-white sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Center</h1>
                            {unreadCount > 0 && <Badge className="bg-rose-500 text-white border-none font-bold text-[10px] h-6 px-2.5 rounded-lg animate-pulse">{unreadCount} New</Badge>}
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Critical system alerts, policy updates, and organization announcements.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant={view === 'all' ? 'secondary' : 'ghost'}
                            onClick={() => setView('all')}
                            className="rounded-xl font-bold text-xs h-11 px-5 transition-all gap-2"
                        >
                            <Bell size={16} /> Notification Feed
                        </Button>
                        <Button
                            variant={view === 'preferences' ? 'secondary' : 'ghost'}
                            onClick={() => setView('preferences')}
                            className="rounded-xl font-bold text-xs h-11 px-5 transition-all gap-2"
                        >
                            <Settings size={16} /> Preferences
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6 max-w-7xl mx-auto w-full space-y-6">
                {view === 'all' ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <div className="w-full lg:w-64 space-y-6">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Alert Categories</Label>
                                    <div className="space-y-1">
                                        {categories.map(cat => (
                                            <Button
                                                key={cat.value}
                                                variant="ghost"
                                                className={`w-full justify-start rounded-xl font-bold text-sm h-11 px-4 transition-all gap-3 ${filterCategory === cat.value ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:bg-white'}`}
                                                onClick={() => setFilterCategory(cat.value)}
                                            >
                                                <cat.icon size={18} className={filterCategory === cat.value ? 'text-white' : 'text-slate-400'} />
                                                <span>{cat.label}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-200" />

                                <div className="flex items-center justify-between px-2">
                                    <span className="text-sm font-bold text-slate-700">Unread Only</span>
                                    <Switch checked={unreadOnly} onCheckedChange={setUnreadOnly} />
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full rounded-2xl h-12 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 gap-2"
                                onClick={markAllAsRead}
                                disabled={unreadCount === 0}
                            >
                                <Check size={18} /> Mark All as Read
                            </Button>
                        </div>

                        {/* Notifications Feed */}
                        <div className="flex-1 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {filteredNotifications.length === 0 ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mb-4 shadow-sm border border-slate-100">
                                            <Megaphone size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">Quiet for now</h3>
                                        <p className="text-slate-500 text-sm font-medium mt-1">No alerts found in the {filterCategory === 'All' ? 'selected' : filterCategory} category.</p>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredNotifications.map((notif) => {
                                            const styles = getCategoryStyles(notif.category);
                                            return (
                                                <motion.div
                                                    key={notif.id}
                                                    layout
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="group"
                                                >
                                                    <Card
                                                        className={`border-none shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden cursor-pointer ${!notif.isRead ? 'ring-1 ring-indigo-500/20 bg-indigo-50/10' : 'bg-white ring-1 ring-slate-100'}`}
                                                        onClick={() => handleNotificationClick(notif)}
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex items-start gap-6">
                                                                <div className={`h-12 w-12 rounded-2xl ${styles.bg} ${styles.text} border ${styles.border} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                                                                    {styles.icon}
                                                                </div>

                                                                <div className="flex-1 space-y-2 min-w-0">
                                                                    <div className="flex items-center justify-between gap-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <h3 className={`font-bold text-base text-slate-900 tracking-tight leading-none ${!notif.isRead ? 'text-indigo-600' : ''}`}>
                                                                                {notif.title}
                                                                            </h3>
                                                                            {!notif.isRead && <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse" />}
                                                                        </div>
                                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
                                                                            {new Date(notif.timestamp).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-2xl">{notif.message}</p>

                                                                    <div className="flex items-center gap-4 pt-2">
                                                                        <Badge variant="outline" className={`${styles.bg} ${styles.text} ${styles.border} text-[9px] font-bold h-5 px-2 rounded-md border-none uppercase tracking-tighter`}>
                                                                            {notif.category}
                                                                        </Badge>
                                                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tabular-nums">
                                                                            <Clock size={12} /> {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                                                                        onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Notification Preferences</h2>
                            <p className="text-slate-500 font-medium text-sm">Control how and when you want to be alerted for different system actions.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: "HR Announcements", desc: "Company-wide news and event alerts.", category: "Announcement" },
                                { title: "Policy Updates", desc: "Alerts when terms, conditions, or office policies change.", category: "Policy" },
                                { title: "Payroll Alerts", desc: "Salary slips, credit confirmations, and tax reminders.", category: "Payroll" },
                                { title: "Performance Reviews", desc: "Feedback cycle start, peer review, and goals reminders.", category: "Performance" },
                                { title: "System Alerts", desc: "Maintenance notices and security login alerts.", category: "System" },
                            ].map((pref, i) => (
                                <Card key={i} className="border border-slate-100 shadow-sm rounded-3xl p-5">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-slate-900 tracking-tight">{pref.title}</h4>
                                            <p className="text-sm text-slate-500 font-medium">{pref.desc}</p>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">In-App</Label>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex flex-col items-center gap-1.5">
                                                <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email</Label>
                                                <Switch defaultChecked={i < 3} />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="pt-6 flex justify-end gap-3">
                            <Button variant="outline" className="rounded-2xl h-12 px-8 font-bold border-slate-200">Revert Changes</Button>
                            <Button className="rounded-2xl h-12 px-10 font-bold bg-slate-900 text-white shadow-xl shadow-slate-100" onClick={() => toast({ title: "Preferences Saved" })}>Update Settings</Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NotificationsPage;
