"use client"

import React, { useState, useMemo } from "react"
import {
    Bell, MessageSquare, ArrowRight, UserPlus, AtSign, Clock, Eye, EyeOff,
    ChevronRight, Trash2, Settings, CheckCheck, X, AlertTriangle, BellOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

type NotificationType = "comment" | "status_change" | "assignment" | "mention" | "due_date"

interface Notification {
    id: string
    type: NotificationType
    message: string
    issueKey: string
    actor: string
    time: string
    minutesAgo: number
    read: boolean
    watching: boolean
}

interface NotificationPrefs {
    assignedToMe: boolean
    mentioned: boolean
    watching: boolean
    statusChanged: boolean
    commentAdded: boolean
    sprintEvents: boolean
    dueDateApproaching: boolean
}

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
    comment: <MessageSquare className="w-4 h-4 text-blue-500" />,
    status_change: <ArrowRight className="w-4 h-4 text-green-500" />,
    assignment: <UserPlus className="w-4 h-4 text-purple-500" />,
    mention: <AtSign className="w-4 h-4 text-orange-500" />,
    due_date: <Clock className="w-4 h-4 text-red-500" />,
}

const formatRelativeTime = (mins: number): string => {
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
    if (mins < 2880) return "Yesterday"
    return `${Math.floor(mins / 1440)}d ago`
}

const initialNotifications: Notification[] = [
    { id: "n1", type: "comment", message: "Alice commented on PROJ-123: \"Looks good, let's ship it\"", issueKey: "PROJ-123", actor: "Alice Johnson", time: "2m ago", minutesAgo: 2, read: false, watching: true },
    { id: "n2", type: "status_change", message: "Bob changed PROJ-456 status to Done", issueKey: "PROJ-456", actor: "Bob Smith", time: "8m ago", minutesAgo: 8, read: false, watching: false },
    { id: "n3", type: "mention", message: "You were mentioned in PROJ-789 by Charlie", issueKey: "PROJ-789", actor: "Charlie Davis", time: "15m ago", minutesAgo: 15, read: false, watching: false },
    { id: "n4", type: "assignment", message: "Diana assigned PROJ-234 to you", issueKey: "PROJ-234", actor: "Diana Lee", time: "32m ago", minutesAgo: 32, read: false, watching: false },
    { id: "n5", type: "due_date", message: "PROJ-567 is due in 2 hours", issueKey: "PROJ-567", actor: "System", time: "45m ago", minutesAgo: 45, read: true, watching: true },
    { id: "n6", type: "comment", message: "Eve added a comment on PROJ-890: \"Need more details on the edge case\"", issueKey: "PROJ-890", actor: "Eve Wilson", time: "1h ago", minutesAgo: 68, read: false, watching: true },
    { id: "n7", type: "status_change", message: "Frank moved PROJ-111 to In Review", issueKey: "PROJ-111", actor: "Frank Brown", time: "2h ago", minutesAgo: 124, read: true, watching: false },
    { id: "n8", type: "mention", message: "You were mentioned in PROJ-222 by Grace", issueKey: "PROJ-222", actor: "Grace Kim", time: "3h ago", minutesAgo: 185, read: false, watching: false },
    { id: "n9", type: "assignment", message: "Henry reassigned PROJ-333 to you", issueKey: "PROJ-333", actor: "Henry Park", time: "4h ago", minutesAgo: 245, read: true, watching: false },
    { id: "n10", type: "comment", message: "Ivy commented on PROJ-444: \"PR approved, merging now\"", issueKey: "PROJ-444", actor: "Ivy Chen", time: "5h ago", minutesAgo: 310, read: true, watching: true },
    { id: "n11", type: "due_date", message: "PROJ-555 is overdue by 1 day", issueKey: "PROJ-555", actor: "System", time: "6h ago", minutesAgo: 380, read: false, watching: false },
    { id: "n12", type: "status_change", message: "Jack moved PROJ-666 to Testing", issueKey: "PROJ-666", actor: "Jack Wang", time: "8h ago", minutesAgo: 490, read: true, watching: false },
    { id: "n13", type: "mention", message: "You were mentioned in PROJ-777 sprint retrospective by Kate", issueKey: "PROJ-777", actor: "Kate Li", time: "Yesterday", minutesAgo: 1500, read: true, watching: false },
    { id: "n14", type: "comment", message: "Leo commented on PROJ-888: \"Fixed the regression\"", issueKey: "PROJ-888", actor: "Leo Zhang", time: "Yesterday", minutesAgo: 1600, read: true, watching: true },
    { id: "n15", type: "assignment", message: "Mia assigned PROJ-999 to you", issueKey: "PROJ-999", actor: "Mia Taylor", time: "Yesterday", minutesAgo: 1800, read: true, watching: false },
    { id: "n16", type: "due_date", message: "PROJ-100 due date is approaching (tomorrow)", issueKey: "PROJ-100", actor: "System", time: "Yesterday", minutesAgo: 2000, read: false, watching: true },
    { id: "n17", type: "status_change", message: "Noah changed PROJ-200 from Backlog to Todo", issueKey: "PROJ-200", actor: "Noah Garcia", time: "2d ago", minutesAgo: 3000, read: true, watching: false },
    { id: "n18", type: "comment", message: "Olivia commented on PROJ-300: \"Can we discuss the approach?\"", issueKey: "PROJ-300", actor: "Olivia Brown", time: "2d ago", minutesAgo: 3200, read: true, watching: false },
]

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
    const [activeTab, setActiveTab] = useState("all")
    const [showPrefsDialog, setShowPrefsDialog] = useState(false)
    const [showClearConfirm, setShowClearConfirm] = useState(false)
    const [search, setSearch] = useState("")
    const [prefs, setPrefs] = useState<NotificationPrefs>({
        assignedToMe: true, mentioned: true, watching: true, statusChanged: true,
        commentAdded: true, sprintEvents: false, dueDateApproaching: true,
    })

    const stats = useMemo(() => ({
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        mentions: notifications.filter(n => n.type === "mention").length,
        watching: notifications.filter(n => n.watching).length,
    }), [notifications])

    const filtered = useMemo(() => {
        let list = notifications
        if (activeTab === "unread") list = list.filter(n => !n.read)
        if (activeTab === "mentions") list = list.filter(n => n.type === "mention")
        if (activeTab === "watching") list = list.filter(n => n.watching)
        if (search) list = list.filter(n => n.message.toLowerCase().includes(search.toLowerCase()) || n.issueKey.toLowerCase().includes(search.toLowerCase()))
        return list.sort((a, b) => a.minutesAgo - b.minutesAgo)
    }, [notifications, activeTab, search])

    const markAsRead = (id: string) => {
        setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n))
        toast.success("Marked as read")
    }

    const markAsUnread = (id: string) => {
        setNotifications(p => p.map(n => n.id === id ? { ...n, read: false } : n))
        toast.success("Marked as unread")
    }

    const markAllAsRead = () => {
        setNotifications(p => p.map(n => ({ ...n, read: true })))
        toast.success("All notifications marked as read")
    }

    const clearAll = () => {
        setNotifications([])
        setShowClearConfirm(false)
        toast.success("All notifications cleared")
    }

    const handleNotificationClick = (n: Notification) => {
        if (!n.read) setNotifications(p => p.map(x => x.id === n.id ? { ...x, read: true } : x))
        toast.info(`Navigating to ${n.issueKey}`)
    }

    const togglePref = (key: keyof NotificationPrefs) => {
        setPrefs(p => ({ ...p, [key]: !p[key] }))
    }

    const renderToggle = (label: string, description: string, checked: boolean, onChange: () => void) => (
        <div className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0">
            <div>
                <p className="text-xs font-medium text-zinc-700">{label}</p>
                <p className="text-[10px] text-zinc-400">{description}</p>
            </div>
            <button onClick={onChange} className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-zinc-200"}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
            </button>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 p-6 bg-[#fafafa] min-h-screen">
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-400">PROJECTS</span>
                <ChevronRight className="w-3 h-3 text-zinc-300" />
                <span className="text-[10px] font-medium text-zinc-400">NOTIFICATIONS</span>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Notifications</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => setShowPrefsDialog(true)}>
                        <Settings className="w-3.5 h-3.5 mr-1" />Preferences
                    </Button>
                    <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={markAllAsRead} disabled={stats.unread === 0}>
                        <CheckCheck className="w-3.5 h-3.5 mr-1" />Mark All Read
                    </Button>
                    <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 text-red-600 hover:text-red-700" onClick={() => setShowClearConfirm(true)} disabled={notifications.length === 0}>
                        <Trash2 className="w-3.5 h-3.5 mr-1" />Clear All
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                <SmallCard><SmallCardHeader><Bell className="w-4 h-4 text-indigo-500" /><span className="text-xs font-medium text-zinc-500">Total</span></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{stats.total}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><EyeOff className="w-4 h-4 text-blue-500" /><span className="text-xs font-medium text-zinc-500">Unread</span></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{stats.unread}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><AtSign className="w-4 h-4 text-orange-500" /><span className="text-xs font-medium text-zinc-500">Mentions</span></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{stats.mentions}</span></SmallCardContent></SmallCard>
                <SmallCard><SmallCardHeader><Eye className="w-4 h-4 text-green-500" /><span className="text-xs font-medium text-zinc-500">Watching</span></SmallCardHeader><SmallCardContent><span className="text-xl font-bold text-zinc-900">{stats.watching}</span></SmallCardContent></SmallCard>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                        <TabsTrigger value="unread" className="text-xs">Unread {stats.unread > 0 && <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">{stats.unread}</Badge>}</TabsTrigger>
                        <TabsTrigger value="mentions" className="text-xs">Mentions</TabsTrigger>
                        <TabsTrigger value="watching" className="text-xs">Watching</TabsTrigger>
                    </TabsList>
                    <div className="relative max-w-xs w-64">
                        <Bell className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                        <Input placeholder="Search notifications..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
                    </div>
                </div>

                {["all", "unread", "mentions", "watching"].map(tab => (
                    <TabsContent key={tab} value={tab} className="mt-4">
                        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm divide-y divide-zinc-100">
                            {filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                                    <BellOff className="w-8 h-8 mb-2" />
                                    <p className="text-xs">No notifications</p>
                                </div>
                            ) : filtered.map(n => (
                                <div key={n.id} onClick={() => handleNotificationClick(n)} className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-zinc-50 ${!n.read ? "bg-indigo-50/30" : ""}`}>
                                    {/* Unread dot */}
                                    <div className="flex items-center pt-1">
                                        <div className={`w-2 h-2 rounded-full ${!n.read ? "bg-indigo-500" : "bg-transparent"}`} />
                                    </div>
                                    {/* Icon */}
                                    <div className="pt-0.5">{TYPE_ICONS[n.type]}</div>
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs ${!n.read ? "font-medium text-zinc-900" : "text-zinc-600"} leading-relaxed`}>{n.message}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-zinc-400">{formatRelativeTime(n.minutesAgo)}</span>
                                            {n.watching && <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">Watching</Badge>}
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                        {!n.read ? (
                                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Mark as read" onClick={() => markAsRead(n.id)}>
                                                <Eye className="w-3.5 h-3.5 text-zinc-400" />
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="icon" className="h-7 w-7" title="Mark as unread" onClick={() => markAsUnread(n.id)}>
                                                <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Preferences Dialog */}
            <Dialog open={showPrefsDialog} onOpenChange={setShowPrefsDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Notification Preferences</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Configure which notifications you want to receive.</DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        {renderToggle("Assigned to me", "When an issue is assigned to you", prefs.assignedToMe, () => togglePref("assignedToMe"))}
                        {renderToggle("@Mentioned", "When you are mentioned in a comment", prefs.mentioned, () => togglePref("mentioned"))}
                        {renderToggle("Watching", "Updates on issues you are watching", prefs.watching, () => togglePref("watching"))}
                        {renderToggle("Status changed", "When issue status changes", prefs.statusChanged, () => togglePref("statusChanged"))}
                        {renderToggle("Comment added", "When a new comment is added", prefs.commentAdded, () => togglePref("commentAdded"))}
                        {renderToggle("Sprint events", "Sprint start, end, and planning events", prefs.sprintEvents, () => togglePref("sprintEvents"))}
                        {renderToggle("Due date approaching", "Reminders for upcoming due dates", prefs.dueDateApproaching, () => togglePref("dueDateApproaching"))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowPrefsDialog(false)}>Close</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setShowPrefsDialog(false); toast.success("Preferences saved") }}>Save Preferences</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Clear All Confirmation */}
            <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Clear All Notifications</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" />This will permanently delete all {notifications.length} notifications. This action cannot be undone.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-red-600 hover:bg-red-700 text-white" onClick={clearAll}>Clear All</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}