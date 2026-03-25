"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Mail,
    Send,
    Inbox,
    FileText,
    BarChart3,
    Search,
    Filter,
    ChevronLeft,
    Plus,
    Download,
    MoreHorizontal,
    Zap,
    Scale,
    AlertCircle,
    UserCheck,
    Briefcase,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
    Eye,
    MousePointer2,
    Clock,
    LayoutGrid,
    MessageSquare,
    Globe,
    ExternalLink,
    Layers
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"

// --- Mock Data ---
const EMAIL_STATS = [
    { label: "Emails Sent", val: "1,240", icon: Send, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Open Rate", val: "48.2%", icon: Eye, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Click Rate", val: "12.4%", icon: MousePointer2, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Replies", val: "84", icon: MessageSquare, color: "text-cyan-600", bg: "bg-cyan-50" },
]

const PERFORMANCE_MAILS = [
    {
        id: "EML-001",
        subject: "Re: Follow-up on Technical Vetting",
        lead: "Aarav Sharma",
        status: "Opened",
        time: "14m ago",
        opens: 3,
        clicks: 1,
        priority: "High"
    },
    {
        id: "EML-002",
        subject: "New Platform ROI Modeling - Deck Attached",
        lead: "Ishani Gupta",
        status: "Clicked",
        time: "1h ago",
        opens: 5,
        clicks: 3,
        priority: "Critical"
    },
    {
        id: "EML-003",
        subject: "Introduction: Nexus Tech and Fixl",
        lead: "Zoya Khan",
        status: "Sent",
        time: "4h ago",
        opens: 0,
        clicks: 0,
        priority: "Medium"
    },
]

const INITIAL_TEMPLATES = [
    { title: "Enterprise Intro", usage: 142, conversion: "18%" },
    { title: "Follow-up: No Reply", usage: 89, conversion: "12%" },
    { title: "Re-engagement: V2", usage: 64, conversion: "24%" },
]

export default function EmailsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
    const [isSequenceOpen, setIsSequenceOpen] = useState(false)
    const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false)
    const [newTemplate, setNewTemplate] = useState({ title: "", conversion: "0%" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleAddTemplate = () => {
        if (!newTemplate.title) return
        setTemplates([{ ...newTemplate, usage: 0 }, ...templates])
        setIsAddTemplateOpen(false)
        setNewTemplate({ title: "", conversion: "0%" })
        toast({
            title: "Template Saved",
            description: "New template has been added to the library.",
        })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-sm">
                                <Mail size={20} />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Email Outreach Intelligence
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Track the performance of your communication engine. Audit open rates, link clicks, and automated sequence progression to refine your messaging.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <BarChart3 className="h-4 w-4 mr-2 text-slate-400" /> Templates Performance
                    </Button>
                    <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> Compose Email
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Global Email Stats */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {EMAIL_STATS.map((s, i) => (
                        <Card key={i} className={`border-none shadow-sm ring-1 ring-slate-100 rounded-2xl ${s.bg} p-4 space-y-3`}>
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-xl bg-white/80 ${s.color} shadow-sm`}>
                                    <s.icon size={18} />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-400/50">30D Summary</span>
                            </div>
                            <div className="space-y-0.5">
                                <p className={`text-[10px] font-semibold tracking-wider font-medium opacity-70 ${s.color}`}>{s.label}</p>
                                <h4 className="text-[20px] font-semibold text-slate-900">{s.val}</h4>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Performance Feed */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Real-time Outreach Tracking</h3>
                            <p className="text-[11px] text-slate-500 font-semibold font-medium">Active tracking enabled</p>
                        </div>
                        <Button variant="ghost" className="h-8 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 px-4">See Tracking Log</Button>
                    </div>

                    <div className="space-y-3">
                        {PERFORMANCE_MAILS.map((mail) => (
                            <div key={mail.id} className="p-5 rounded-2xl bg-white border border-slate-100 group hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-default">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-600 transition-colors ${mail.status === 'Opened' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400 group-hover:text-white'}`}>
                                            <Send size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[15px] font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{mail.subject}</h4>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-indigo-600 text-white border-none h-4.5 px-2 text-[9px] font-semibold">{mail.lead}</Badge>
                                                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5"><Clock size={12} /> {mail.time}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="flex flex-col items-center">
                                            <p className="text-[9px] font-semibold text-slate-300">Opens</p>
                                            <div className="flex items-center gap-1">
                                                <Eye size={12} className="text-emerald-500" />
                                                <span className="text-[13px] font-semibold text-slate-900">{mail.opens}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-[9px] font-semibold text-slate-300">Clicks</p>
                                            <div className="flex items-center gap-1">
                                                <MousePointer2 size={12} className="text-amber-500" />
                                                <span className="text-[13px] font-semibold text-slate-900">{mail.clicks}</span>
                                            </div>
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-200 hover:text-slate-900">
                                            <ExternalLink size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Sequences & Templates Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-3xl bg-indigo-50 text-slate-900 p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 text-indigo-400 translate-x-4 translate-y-4">
                            <Layers size={120} />
                        </div>
                        <h4 className="text-[16px] font-semibold">Active Nurture Sync</h4>
                        <div className="space-y-4 relative z-10">
                            <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                                Aarav Sharma has moved to **Step 3** of the "Enterprise Discovery" sequence. Next automated mail in 2 days.
                            </p>
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                                    <span>Sequence Progress</span>
                                    <span className="text-indigo-600">60%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-sm">
                                    <div className="h-full bg-indigo-500" style={{ width: '60%' }} />
                                </div>
                            </div>
                            <Dialog open={isSequenceOpen} onOpenChange={setIsSequenceOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full h-10 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-xl border-none text-[11px] shadow-lg shadow-indigo-200">
                                        Edit Sequence
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white rounded-3xl">
                                    <DialogHeader>
                                        <DialogTitle>Edit Nurture Sequence</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <p className="text-[13px] text-slate-500 font-medium">Customize the "Enterprise Discovery" sequence for Aarav Sharma.</p>
                                        <div className="space-y-3">
                                            {["Step 1: Case Study Intro", "Step 2: Pricing Logic", "Step 3: Executive Session"].map((step, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                    <span className="text-[12px] font-bold text-slate-700">{step}</span>
                                                    <Badge className="bg-indigo-100 text-indigo-600 border-none font-bold text-[9px]">Active</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Button className="w-full h-11 bg-indigo-600 text-white font-bold rounded-xl" onClick={() => setIsSequenceOpen(false)}>Save Changes</Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[14px] font-semibold text-slate-900 tracking-tight">Winning Templates</h4>
                            <Dialog open={isAddTemplateOpen} onOpenChange={setIsAddTemplateOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                        <Plus size={16} />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white rounded-3xl">
                                    <DialogHeader>
                                        <DialogTitle>Create New Template</DialogTitle>
                                    </DialogHeader>
                                    <div className="py-4 space-y-4">
                                        <Input
                                            placeholder="Template Name"
                                            className="h-11 rounded-xl"
                                            value={newTemplate.title}
                                            onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                                        />
                                        <Input placeholder="Conversion Goal (%)" className="h-11 rounded-xl" value={newTemplate.conversion} onChange={(e) => setNewTemplate({ ...newTemplate, conversion: e.target.value })} />
                                    </div>
                                    <Button className="w-full h-11 bg-indigo-600 font-semibold rounded-xl" onClick={handleAddTemplate}>Save Template</Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="space-y-4">
                            {templates.map((t, i) => (
                                <div key={i} className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all cursor-pointer">
                                    <div className="space-y-0.5">
                                        <h5 className="text-[13px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{t.title}</h5>
                                        <p className="text-[10px] text-slate-400 font-semibold">{t.usage} times used</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[12px] font-semibold text-emerald-500">{t.conversion}</p>
                                        <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">Conv.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full h-9 border-slate-100 text-indigo-600 font-semibold text-[10px] rounded-xl hover:bg-indigo-50">Global Templates library</Button>
                    </Card>
                </div>

            </div >

        </div >
    )
}
