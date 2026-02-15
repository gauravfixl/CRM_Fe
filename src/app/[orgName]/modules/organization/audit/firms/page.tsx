"use client"

import React, { useState } from "react"
import {
    Building2,
    Search,
    Filter,
    Download,
    ChevronRight,
    MoreVertical,
    Activity,
    Users,
    Layers,
    FileText,
    SearchX,
    CheckCircle2,
    ArrowUpRight,
    Clock,
    LayoutGrid
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

const firmEvents = [
    { id: "FE-990", firm: "Fox Solutions HQ", event: "Standardized 500+ CRM Leads", actor: "System Sync", time: "5 mins ago", cat: "CRM" },
    { id: "FE-989", firm: "TechVentures Inc", event: "New Subscription Added", actor: "Admin Cooper", time: "1 hour ago", cat: "Billing" },
    { id: "FE-988", firm: "Global Trade LLC", event: "Exported Client List (PDF)", actor: "Jane Fisher", time: "3 hours ago", cat: "Security" },
    { id: "FE-987", firm: "FinCorp Hub", event: "Mass Employee Onboarding", actor: "HR Team", time: "Yesterday", cat: "HRM" },
    { id: "FE-986", firm: "Fox Solutions HQ", event: "Automation Policy Overridden", actor: "Robert Fox", time: "Yesterday", cat: "Policy" },
]

export default function FirmEventsAuditPage() {
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Business Unit Events</h1>
                    <p className="text-sm text-slate-500 mt-1">Consolidated activity monitoring across all distributed firms.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Firm-wise activity report requested")}>
                        <LayoutGrid className="w-4 h-4" />
                        Summary View
                    </Button>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Events</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-slate-900">4,582</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter italic">Last 7 days</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Most Active Firm</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-blue-600">Fox HQ</p>
                        <p className="text-[10px] text-blue-400 font-bold flex items-center gap-1 mt-1 uppercase tracking-tighter">42% of total load</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Uploads</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-indigo-600">12.4 GB</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter italic">Across 12 firms</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Sessions</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-emerald-600">82</p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 uppercase tracking-tighter">Global Real-time</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* FILTER BAR */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search for firm events, actors or IDs..."
                        className="pl-10 h-10 border-none bg-slate-50 focus-visible:ring-0 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="ghost" className="h-10 text-xs font-bold gap-2 text-slate-600">
                    <Filter className="w-4 h-4" />
                    Filter by Unit
                </Button>
            </div>

            {/* EVENTS TABLE */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-black text-slate-900 uppercase tracking-tight">Consolidated Firm Activity</CardTitle>
                        <CardDescription className="text-xs font-medium">Cross-firm event monitoring for unified oversight.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                        {firmEvents.map((evt) => (
                            <div key={evt.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="h-11 w-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm transition-colors">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm font-black text-slate-900 leading-none">{evt.event}</p>
                                            <Badge className={`text-[8px] font-black uppercase tracking-widest rounded-md border-none ${evt.cat === 'CRM' ? 'bg-blue-50 text-blue-600' :
                                                    evt.cat === 'Security' ? 'bg-red-50 text-red-600' :
                                                        evt.cat === 'HRM' ? 'bg-emerald-50 text-emerald-600' :
                                                            'bg-slate-100 text-slate-500'
                                                }`}>
                                                {evt.cat}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-medium">
                                            <span className="font-black text-slate-700 uppercase tracking-tighter">{evt.firm}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="font-bold text-slate-500">{evt.actor}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {evt.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest">{evt.id}</span>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-blue-600 transition-colors" onClick={() => toast.info(`Viewing trace for ${evt.id}`)}>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="bg-slate-50/50 border-t border-slate-100 py-4 flex justify-between items-center px-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-blue-500" /> Unified log stream active
                    </p>
                    <Button variant="ghost" className="text-xs font-black text-blue-600 gap-1 uppercase tracking-widest h-8" onClick={() => toast.success("Refined export generation...")}>
                        Export Firm Logs <Download className="w-3.5 h-3.5" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
