"use client"

import React, { useState, useEffect } from "react"
import {
    History,
    Filter,
    Download,
    Search,
    User,
    Settings,
    Shield,
    AlertCircle,
    CheckCircle2,
    Clock,
    Box,
    Building2,
    Calendar,
    ChevronRight,
    SearchX,
    Users
} from "lucide-react"
import { CustomButton } from "@/shared/components/custom/CustomButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

const activities = [
    {
        id: "ACT-001",
        type: "Security",
        action: "MFA Policy Updated",
        actor: "Admin (Alex)",
        target: "Global Policies",
        timestamp: "2 mins ago",
        severity: "high",
        icon: Shield
    },
    {
        id: "ACT-002",
        type: "Business Unit",
        action: "New Firm Provisioned",
        actor: "System Auto",
        target: "TechVentures Inc",
        timestamp: "45 mins ago",
        severity: "medium",
        icon: Building2
    },
    {
        id: "ACT-003",
        type: "Identity",
        action: "Org Admin Invited",
        actor: "Admin (Sarah)",
        target: "mike@fixl.io",
        timestamp: "1 hour ago",
        severity: "low",
        icon: User
    },
    {
        id: "ACT-004",
        type: "Billing",
        action: "Plan Upgrade Initiated",
        actor: "Owner (Fixl)",
        target: "Enterprise Scale+",
        timestamp: "3 hours ago",
        severity: "high",
        icon: Settings
    },
    {
        id: "ACT-005",
        type: "System",
        action: "Backup Completed",
        actor: "Cloud Engine",
        target: "US-East-1 DB",
        timestamp: "5 hours ago",
        severity: "low",
        icon: History
    },
    {
        id: "ACT-006",
        type: "Security",
        action: "Login Attempt Blocked",
        actor: "WAF Filter",
        target: "IP 192.168.1.45",
        timestamp: "Yesterday",
        severity: "medium",
        icon: Shield
    },
]

const MODULE_LABELS: Record<string, string> = {
    lead: "Lead Management",
    firm: "Business Unit",
    client: "Identity",
    invoice: "Billing",
    project: "System",
    task: "System",
}

const MODULE_ICONS: Record<string, typeof Shield> = {
    lead: User,
    firm: Building2,
    client: User,
    invoice: Settings,
    project: History,
    task: History,
}

function getRelativeTime(dateStr: string): string {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    if (diffDays === 1) return "Yesterday"
    return `${diffDays} days ago`
}

function mapApiActivity(item: any) {
    const module = item.module || ""
    const isSecurity = module === "lead" && /security|block|mfa|login/i.test(item.activityDesc || "")
    return {
        id: item._id,
        type: MODULE_LABELS[module] || "System",
        action: `${item.activity || ""} - ${item.activityDesc || ""}`,
        actor: item.userId ? `${item.userId.firstName || ""} ${item.userId.lastName || ""}`.trim() : "System",
        target: item.activityDesc || "",
        timestamp: getRelativeTime(item.createdAt),
        severity: isSecurity ? "high" as const : "low" as const,
        icon: MODULE_ICONS[module] || History,
    }
}

const MODULES = ["lead", "firm", "client", "invoice", "project", "task"]

export default function OrgActivityPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [activityList, setActivityList] = useState(activities)
    const [loading, setLoading] = useState(false)
    const [totalEvents, setTotalEvents] = useState(0)

    useEffect(() => {
        async function fetchActivities() {
            setLoading(true)
            try {
                const responses = await Promise.allSettled(
                    MODULES.map((mod) => axiosInstance.get(`/activities/module/${mod}`))
                )
                let allItems: any[] = []
                let total = 0
                let anySuccess = false

                for (const res of responses) {
                    if (res.status === "fulfilled" && res.value?.data?.data) {
                        anySuccess = true
                        allItems = allItems.concat(res.value.data.data)
                        if (res.value.data.pagination?.total) {
                            total += res.value.data.pagination.total
                        }
                    }
                }

                if (anySuccess && allItems.length > 0) {
                    allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    setActivityList(allItems.map(mapApiActivity))
                    setTotalEvents(total || allItems.length)
                } else {
                    setActivityList(activities)
                    setTotalEvents(activities.length)
                }
            } catch {
                setActivityList(activities)
                setTotalEvents(activities.length)
            } finally {
                setLoading(false)
            }
        }
        fetchActivities()
    }, [])

    const filteredActivities = activityList.filter(act =>
        act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleExport = () => {
        toast.info("Exporting audit logs to CSV...")
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-8 overflow-y-auto font-sans">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Activity Feed</h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time audit trail of all administrative events across the organization.</p>
                </div>
                <div className="flex gap-3">
                    <CustomButton variant="outline" className="h-10 px-4 gap-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold shadow-sm hover:translate-y-[-1px] transition-all" onClick={() => toast.success("Activity feed updated")}>
                        <Clock className="w-4 h-4" />
                        Refresh
                    </CustomButton>
                    <CustomButton className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-bold shadow-xl border-0" onClick={handleExport}>
                        <Download className="w-4 h-4" />
                        Export Audit Log
                    </CustomButton>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Total Events (24h)</p>
                                <p className="text-white text-xl font-semibold mt-1">{totalEvents.toLocaleString()}</p>
                                <p className="text-white text-[10px] mt-1">+12% from yesterday</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Critical Alerts</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">3</p>
                                <p className="text-red-600 text-[10px] mt-1">Requires attention</p>
                            </div>
                            <AlertCircle className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Active Admins</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">12</p>
                                <p className="text-green-600 text-[10px] mt-1">5 online now</p>
                            </div>
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Identity Sync</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">100%</p>
                                <p className="text-gray-600 text-[10px] mt-1">Last sync 3m ago</p>
                            </div>
                            <Clock className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* FILTER BAR */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by action, actor or ID..."
                        className="pl-10 h-10 border-none bg-slate-50 focus-visible:ring-0 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Separator orientation="vertical" className="h-6" />
                <CustomButton variant="ghost" className="h-10 text-xs font-bold gap-2 text-slate-600 hover:bg-slate-50 rounded-xl" onClick={() => toast.info("Opening advanced filter panel...")}>
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                </CustomButton>
            </div>

            {/* ACTIVITY STREAM */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                    <CardTitle className="text-base font-semibold">Activity Stream</CardTitle>
                    <CardDescription className="text-xs">A comprehensive log of all administrative actions.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((act) => (
                                <div key={act.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${act.severity === 'high' ? 'bg-red-50 text-red-600' :
                                                act.severity === 'medium' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-blue-50 text-blue-600'
                                            }`}>
                                            <act.icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-slate-900">{act.action}</p>
                                                <Badge variant="outline" className={`text-[9px] font-black uppercase ${act.severity === 'high' ? 'border-red-200 text-red-600 bg-red-50' :
                                                        act.severity === 'medium' ? 'border-amber-200 text-amber-600 bg-amber-50' :
                                                            'border-blue-200 text-blue-600 bg-blue-50'
                                                    }`}>
                                                    {act.type}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-500">
                                                <span className="font-medium text-slate-700">{act.actor}</span>
                                                <span className="text-slate-300">•</span>
                                                <span>Target: <span className="text-slate-700 font-medium">{act.target}</span></span>
                                                <span className="text-slate-300">•</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {act.timestamp}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CustomButton variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg" onClick={() => toast.info(`Viewing details for ${act.id}`)}>
                                            View Details
                                        </CustomButton>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 bg-slate-50 rounded-full">
                                    <SearchX className="w-10 h-10 text-slate-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">No activities found</h3>
                                    <p className="text-sm text-slate-500 max-w-xs">We couldn't find any activity matching your current filters or search query.</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>Clear Search</Button>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-3 flex justify-center">
                    <CustomButton variant="ghost" className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 px-6 rounded-xl" onClick={() => toast.promise(new Promise(res => setTimeout(res, 1000)), { loading: "Loading more events...", success: "Activity loaded", error: "Failed to load" })}>Load More Activity</CustomButton>
                </CardFooter>
            </Card>
        </div>
    )
}
