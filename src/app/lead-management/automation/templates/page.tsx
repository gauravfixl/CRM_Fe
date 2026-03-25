"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    FileText,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Mail,
    MessageSquare,
    ClipboardList,
    LayoutTemplate,
    Star,
    History,
    MoreHorizontal,
    Copy,
    ExternalLink,
    Code,
    Smartphone,
    Monitor,
    ShieldCheck,
    CheckCircle2,
    Database
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs"

// --- Mock Data: Templates ---
const TEMPLATES = [
    {
        id: "1",
        name: "Enterprise Welcome (Direct)",
        type: "Email",
        category: "Nurture",
        usage: 2402,
        performance: 72,
        status: "Published",
        lastModified: "2 days ago"
    },
    {
        id: "2",
        name: "Trial Reminder - Day 3",
        type: "Email",
        category: "Retention",
        usage: 840,
        performance: 42,
        status: "Published",
        lastModified: "1 week ago"
    },
    {
        id: "3",
        name: "Lead Re-assignment Alert",
        type: "Internal Notify",
        category: "SLA",
        usage: 124,
        performance: 98,
        status: "System",
        lastModified: "1 month ago"
    },
    {
        id: "4",
        name: "Follow-up SMS (Hot Lead)",
        type: "SMS",
        category: "Urgent",
        usage: 560,
        performance: 18,
        status: "Beta",
        lastModified: "3 days ago"
    },
    {
        id: "5",
        name: "Discovery Task Template",
        type: "Task",
        category: "Operational",
        usage: 4120,
        performance: 100,
        status: "Published",
        lastModified: "Yesterday"
    },
]

export default function AutomationTemplatesPage() {
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
                            <div className="p-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 shadow-sm">
                                <LayoutTemplate className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Communication & Action Templates
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Standardize your outreach. Manage email blueprints, SMS templates, and task structures used across all automation workflows.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <History className="h-4 w-4 mr-2 text-slate-400" /> Version History
                    </Button>
                    <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> New Template
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Search & Tabs Area */}
                <div className="lg:col-span-12 space-y-6">
                    <Tabs defaultValue="all" className="w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <TabsList className="bg-slate-100/50 p-1 rounded-xl h-11">
                                <TabsTrigger value="all" className="rounded-lg text-[12px] font-bold px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm">All Library</TabsTrigger>
                                <TabsTrigger value="email" className="rounded-lg text-[12px] font-bold px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Emails</TabsTrigger>
                                <TabsTrigger value="sms" className="rounded-lg text-[12px] font-bold px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm">SMS</TabsTrigger>
                                <TabsTrigger value="internal" className="rounded-lg text-[12px] font-bold px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Internal</TabsTrigger>
                                <TabsTrigger value="tasks" className="rounded-lg text-[12px] font-bold px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Tasks</TabsTrigger>
                            </TabsList>
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search templates..." className="pl-9 h-11 border-slate-100 bg-white rounded-xl text-[13px]" />
                            </div>
                        </div>

                        <TabsContent value="all" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {TEMPLATES.map((tmpl) => (
                                    <Card key={tmpl.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden flex flex-col">
                                        <CardContent className="p-6 space-y-6 flex-1">
                                            <div className="flex items-start justify-between">
                                                <div className={`p-3 rounded-2xl ${tmpl.type === 'Email' ? 'bg-indigo-50 text-indigo-600' :
                                                        tmpl.type === 'SMS' ? 'bg-cyan-50 text-cyan-600' :
                                                            tmpl.type === 'Task' ? 'bg-teal-50 text-teal-600' :
                                                                'bg-slate-50 text-slate-500'
                                                    }`}>
                                                    {tmpl.type === 'Email' ? <Mail size={20} /> :
                                                        tmpl.type === 'SMS' ? <Smartphone size={20} /> :
                                                            tmpl.type === 'Task' ? <ClipboardList size={20} /> :
                                                                <Bell size={20} />}
                                                </div>
                                                <Badge className={`border-none font-black text-[9px] h-5 px-2 uppercase ${tmpl.status === 'Published' ? 'bg-emerald-50 text-emerald-600' :
                                                        tmpl.status === 'Beta' ? 'bg-amber-50 text-amber-600' :
                                                            'bg-slate-100 text-slate-400'
                                                    }`}>
                                                    {tmpl.status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <span>{tmpl.category}</span>
                                                    <span>{tmpl.type}</span>
                                                </div>
                                                <h4 className="text-[17px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{tmpl.name}</h4>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50 space-y-1">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Usage</p>
                                                    <p className="text-[15px] font-black tabular-nums text-slate-900">{tmpl.usage.toLocaleString()}</p>
                                                </div>
                                                <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50 space-y-1">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Effectiveness</p>
                                                    <p className="text-[15px] font-black tabular-nums text-emerald-500">{tmpl.performance}%</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900">
                                                    <Copy size={16} />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600">
                                                    <ExternalLink size={16} />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-bold text-slate-400">{tmpl.lastModified}</span>
                                                <Button size="sm" variant="ghost" className="h-8 px-3 rounded-lg text-indigo-600 font-bold text-[11px] uppercase tracking-widest hover:bg-white">
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Shared Resources Sidebars */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                                <Database size={20} />
                            </div>
                            <h4 className="text-[15px] font-bold">Smart Variables</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Use <span className="text-indigo-600 font-mono">{"{{lead_name}}"}</span>, <span className="text-indigo-600 font-mono">{"{{owner_email}}"}</span>, and 42 other variables to personalize templates.
                        </p>
                        <Button variant="ghost" className="w-full h-9 bg-slate-50 text-indigo-600 font-bold text-[11px] rounded-xl hover:bg-indigo-50">View Variable List</Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white p-6 space-y-4 shadow-teal-100/20">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                                <Monitor size={20} />
                            </div>
                            <h4 className="text-[15px] font-bold">Visual Preview Engine</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Every template is automatically rendered for Mobile, Tablet, and Desktop views to ensure responsive compliance.
                        </p>
                        <div className="flex gap-2">
                            <Smartphone size={14} className="text-slate-300" />
                            <Monitor size={14} className="text-teal-500" />
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-slate-900 text-white p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <ShieldCheck size={100} />
                        </div>
                        <h4 className="text-[15px] font-bold">Compliance Headers</h4>
                        <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
                            Global Unsubscribe and Footer compliance settings are automatically enforced on every outbound template.
                        </p>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Verified SOC2</span>
                        </div>
                    </Card>
                </div>

            </div>

        </div>
    )
}
