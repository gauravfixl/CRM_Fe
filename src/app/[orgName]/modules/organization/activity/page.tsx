"use client"

import React, { useState } from "react"
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
    SearchX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

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

export default function OrgActivityPage() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredActivities = activities.filter(act =>
        act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleExport = () => {
        toast.info("Exporting audit logs to CSV...")
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Activity Feed</h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time audit trail of all administrative events across the organization.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200" onClick={() => toast.success("Feed Refreshed")}>
                        <Clock className="w-4 h-4" />
                        Refresh
                    </Button>
                    <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold shadow-sm" onClick={handleExport}>
                        <Download className="w-4 h-4" />
                        Export Audit Log
                    </Button>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Total Events (24h)</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-white">1,284</p>
                        <p className="text-[10px] text-blue-100 flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-300" /> +12% from yesterday
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Critical Alerts</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-slate-900 text-left">3</p>
                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" /> Requires attention
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Active Admins</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-slate-900 text-left">12</p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 text-left">
                            <CheckCircle2 className="w-3 h-3" /> 5 online now
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Identity Sync</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-emerald-600 text-left">100%</p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1 text-left">
                            <Clock className="w-3 h-3" /> Last sync 3m ago
                        </p>
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
                <Button variant="ghost" className="h-10 text-xs font-bold gap-2 text-slate-600">
                    <Filter className="w-4 h-4" />
                    Advanced Filters
                </Button>
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
                                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => toast.info(`Viewing details for ${act.id}`)}>
                                            View Details
                                        </Button>
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
                    <Button variant="ghost" className="text-xs font-bold text-blue-600">Load More Activity</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
