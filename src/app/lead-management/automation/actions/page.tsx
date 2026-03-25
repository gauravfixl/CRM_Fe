"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    LayoutGrid,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Mail,
    MessageSquare,
    UserCircle2,
    Database,
    Bell,
    Share2,
    Settings2,
    Trash2,
    MoreHorizontal,
    Zap,
    Tag,
    ArrowRight,
    Play,
    ShieldCheck,
    CloudIcon,
    Code
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"

// --- Mock Data: Actions ---
const ACTIONS_LIBRARY = [
    {
        id: "1",
        name: "Assign Owner",
        category: "Distribution",
        icon: UserCircle2,
        usageCount: 1242,
        status: "Core",
        description: "Updates 'Current Owner' field using specified assignment method."
    },
    {
        id: "2",
        name: "Send Email Template",
        category: "Communication",
        icon: Mail,
        usageCount: 890,
        status: "Core",
        description: "Triggers outbound email via integrated SMTP/Provider."
    },
    {
        id: "3",
        name: "Update Lead Stage",
        category: "Field Update",
        icon: Database,
        usageCount: 2104,
        status: "Core",
        description: "Moves lead between Lifecycle stages based on logic."
    },
    {
        id: "4",
        name: "Push Browser Notify",
        category: "Notification",
        icon: Bell,
        usageCount: 412,
        status: "Addon",
        description: "Sends push notification to the active lead owner's browser."
    },
    {
        id: "5",
        name: "Add Lead Tag",
        category: "Governance",
        icon: Tag,
        usageCount: 562,
        status: "Core",
        description: "Appends specified tags to the lead's metadata."
    },
    {
        id: "6",
        name: "HTTP Webhook",
        category: "Integration",
        icon: Share2,
        usageCount: 154,
        status: "Advanced",
        description: "POSTs lead payload to an external URL (3rd party apps)."
    },
]

export default function ActionsLibraryPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <LayoutGrid className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Actions Library
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            The toolbox for your automation workflows. Define reusable steps like sending emails, updating fields, or triggering webhooks.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <ShieldCheck className="h-4 w-4 mr-2 text-slate-400" /> Permission Matrix
                    </Button>
                    <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> Define New Action
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Search & Filter Bar */}
                <div className="lg:col-span-12">
                    <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-2 rounded-2xl border border-slate-100/50 shadow-sm">
                        <div className="relative flex-1 lg:max-w-[500px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Find actions by name or description..."
                                className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-xl focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="h-10 border-slate-100 bg-white font-bold text-[12px] px-4 rounded-xl">
                                <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" /> All Categories
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Actions Grid */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {ACTIONS_LIBRARY.map((action) => (
                        <Card key={action.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden flex flex-col">
                            <CardContent className="p-6 space-y-6 flex-1">
                                <div className="flex items-start justify-between">
                                    <div className={`p-4 rounded-2xl ${action.category === 'Communication' ? 'bg-indigo-50 text-indigo-600' :
                                            action.category === 'Distribution' ? 'bg-cyan-50 text-cyan-600' :
                                                action.category === 'Integration' ? 'bg-purple-50 text-purple-600' :
                                                    'bg-slate-50 text-slate-500'
                                        }`}>
                                        <action.icon size={24} />
                                    </div>
                                    <Badge className={`border-none font-black text-[9px] h-5 px-2 uppercase tracking-wide ${action.status === 'Core' ? 'bg-emerald-50 text-emerald-600' :
                                            action.status === 'Advanced' ? 'bg-rose-50 text-rose-600' :
                                                'bg-slate-50 text-slate-400'
                                        }`}>
                                        {action.status}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-[17px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{action.name}</h4>
                                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed min-h-[40px]">
                                        {action.description}
                                    </p>
                                </div>

                                <div className="pt-2 flex items-center justify-between border-t border-slate-50 pt-4">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Usage</p>
                                        <p className="text-[14px] font-black tabular-nums text-slate-900">{action.usageCount.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latency</p>
                                        <p className="text-[14px] font-bold text-emerald-500 tabular-nums">~8ms</p>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                <Button variant="ghost" className="h-7 text-indigo-600 font-bold text-[10px] uppercase tracking-widest hover:bg-white rounded-lg px-3">
                                    Configure
                                </Button>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-900">
                                        <Settings2 size={14} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-rose-500">
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Developer Hub Side */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <Code size={150} />
                        </div>
                        <div className="space-y-4 relative z-10 max-w-lg">
                            <div className="p-3 rounded-2xl bg-white/10 w-fit">
                                <CloudIcon size={32} className="text-cyan-400" />
                            </div>
                            <h4 className="text-[20px] font-black tracking-tight">Cloud Function Actions</h4>
                            <p className="text-[14px] text-slate-400 font-medium leading-relaxed">
                                Need custom logic that isn't in the library? Deploy Node.js snippets to our serverless engine and use them as custom actions.
                            </p>
                            <Button className="h-11 bg-white text-slate-900 hover:bg-slate-50 font-black text-[12px] px-8 rounded-xl border-none shadow-xl shadow-white/5">
                                Deploy Custom Action
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-600 text-white p-8 space-y-6 relative overflow-hidden group">
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-black text-indigo-200 uppercase tracking-widest">
                                API Sync Status
                                <Zap size={16} className="text-amber-400 fill-amber-400" />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <h5 className="text-[24px] font-black tracking-tighter">100%</h5>
                                    <p className="text-[12px] font-bold text-indigo-100 uppercase">Availability</p>
                                </div>
                                <div className="space-y-1">
                                    <h5 className="text-[24px] font-black tracking-tighter">48ms</h5>
                                    <p className="text-[12px] font-bold text-indigo-100 uppercase">Global Latency</p>
                                </div>
                            </div>
                            <div className="pt-4">
                                <div className="flex justify-between items-center text-[11px] font-black mb-2 opacity-80">
                                    <span>Engine Utilization</span>
                                    <span>Normal</span>
                                </div>
                                <div className="flex gap-1 h-3">
                                    {[1, 1, 1, 1, 1, 0, 0, 0, 0, 0].map((v, i) => (
                                        <div key={i} className={`flex-1 rounded-sm ${v === 1 ? 'bg-cyan-400' : 'bg-white/10'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}
