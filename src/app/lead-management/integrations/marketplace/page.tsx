"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    LayoutGrid,
    Search,
    Filter,
    ChevronLeft,
    Box,
    Globe,
    Zap,
    Scale,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Settings2,
    ArrowUpRight,
    Layout,
    ExternalLink,
    Code,
    RefreshCw,
    MoreHorizontal,
    Trash2,
    Briefcase,
    Users,
    Mail,
    Phone,
    Video,
    Share2,
    Star,
    ArrowRight,
    SearchCheck,
    Cpu,
    Network,
    X,
    Check,
    Rocket,
    Puzzle,
    CloudCog,
    LifeBuoy
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/shared/components/ui/label"

interface MarketplaceApp {
    id: string
    name: string
    category: string
    rating: number
    installs: string
    description: string
    status: "Installed" | "Native" | "Get Started"
    certified: boolean
    icon: React.ReactNode
    color: string
    bg: string
}

const MARKETPLACE_APPS: MarketplaceApp[] = [
    {
        id: "APP-01",
        name: "Salesforce Sync",
        category: "CRM",
        rating: 4.9,
        installs: "14k+",
        description: "Seamless two-way synchronization for accounts, contacts, and opportunities.",
        status: "Installed",
        certified: true,
        icon: <Cpu size={24} />,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        id: "APP-02",
        name: "Slack Connect",
        category: "Communication",
        rating: 4.7,
        installs: "8k+",
        description: "Get real-time alerts in Slack for lead state changes and deal wins.",
        status: "Native",
        certified: true,
        icon: <Network size={24} />,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    {
        id: "APP-03",
        name: "Twilio Messaging",
        category: "Outreach",
        rating: 4.8,
        installs: "12k+",
        description: "Scale your SMS and voice communication directly from the Fixl dashboard.",
        status: "Get Started",
        certified: true,
        icon: <Phone size={24} />,
        color: "text-rose-600",
        bg: "bg-rose-50"
    },
    {
        id: "APP-04",
        name: "Stripe Billing",
        category: "Finance",
        rating: 4.6,
        installs: "5k+",
        description: "Track payment status and invoice history directly on lead profiles.",
        status: "Get Started",
        certified: false,
        icon: <Briefcase size={24} />,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    },
    {
        id: "APP-05",
        name: "Mailchimp Automate",
        category: "Marketing",
        rating: 4.5,
        installs: "9k+",
        description: "Automated email sequences for incoming leads and abandoned carts.",
        status: "Get Started",
        certified: true,
        icon: <Mail size={24} />,
        color: "text-amber-600",
        bg: "bg-amber-50"
    },
    {
        id: "APP-06",
        name: "Zoom Video Demo",
        category: "Meetings",
        rating: 4.9,
        installs: "7k+",
        description: "Direct meeting scheduling and recording attachments to deals.",
        status: "Installed",
        certified: true,
        icon: <Video size={24} />,
        color: "text-cyan-600",
        bg: "bg-cyan-50"
    },
]

const CATEGORIES = ["All", "CRM", "Communication", "Outreach", "Finance", "Developer", "Marketing"]

export default function IntegrationMarketplacePage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [activeCat, setActiveCat] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => { setIsClient(true) }, [])

    const handleInstall = (appId: string) => {
        toast({ title: "Deployment Triggered", description: "Provisioning application container and mapping schemas." })
    }

    const filteredApps = MARKETPLACE_APPS.filter(app => {
        const matchesCat = activeCat === "All" || app.category === activeCat
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCat && matchesSearch
    })

    const STAT_CARDS = [
        { label: "Available Integrations", val: "420+", detail: "Across all categories", icon: Puzzle, bg: "bg-indigo-50/10", color: "text-indigo-600", border: "border-indigo-100/20" },
        { label: "Certified Nodes", val: "94 Apps", detail: "Fixl-verified security", icon: SearchCheck, bg: "bg-emerald-50/10", color: "text-emerald-600", border: "border-emerald-100/20" },
        { label: "Global Installs", val: "1.2M", detail: "Universal adoption", icon: Globe, bg: "bg-blue-50/10", color: "text-blue-600", border: "border-blue-100/20" },
        { label: "Partner Program", val: "Platinum", detail: "Priority support tier", icon: Rocket, bg: "bg-amber-50/10", color: "text-amber-600", border: "border-amber-100/20" },
    ]

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-indigo-600">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <LayoutGrid className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Integration Marketplace
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Unlock the full power of your tech stack. Connect with hundreds of native apps and third-party tools to automate your business lifecycle.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Discover applications..."
                            className="pl-9 h-11 rounded-xl border-slate-100 bg-slate-50 text-[12px] font-bold"
                        />
                    </div>
                    <Button onClick={() => toast({ title: "App Request Submitted", description: "Our team will review your application request within 2 business days." })} className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 shadow-indigo-100 shadow-lg border-none uppercase text-[11px] tracking-widest">
                        Submit App Request
                    </Button>
                </div>
            </div>

            {/* Tactical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-2xl p-5 shadow-none space-y-3`}>
                        <div className={`h-9 w-9 rounded-xl bg-white flex items-center justify-center ${s.color} shadow-sm border border-slate-100/50`}><s.icon size={18} /></div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[18px] font-semibold ${s.color}`}>{s.val}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.detail}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Categories Bar */}
                <div className="lg:col-span-12 flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat}
                            onClick={() => setActiveCat(cat)}
                            variant={activeCat === cat ? 'default' : 'ghost'}
                            className={`h-10 px-8 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${activeCat === cat ? 'bg-slate-950 text-white shadow-xl px-10' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                {/* Featured App */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-[40px] bg-slate-950 text-white p-1 overflow-hidden relative group cursor-pointer hover:ring-indigo-400/50 transition-all duration-700">
                    <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-12 translate-y--12 group-hover:scale-110 group-hover:opacity-10 transition-all duration-1000">
                        <CloudCog size={400} />
                    </div>
                    <CardContent className="p-12 xl:p-20 flex flex-col md:flex-row md:items-center justify-between gap-16 relative z-10">
                        <div className="space-y-8 flex-1">
                            <div className="flex items-center gap-4">
                                <Badge className="bg-indigo-500 text-white border-none px-4 py-1 font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-500/20">Featured Choice</Badge>
                                <Badge className="bg-white/5 text-white/50 border border-white/10 px-4 py-1 font-black text-[11px] uppercase tracking-widest rounded-lg">Version 2.4 Active</Badge>
                            </div>
                            <h2 className="text-[48px] xl:text-[64px] font-black tracking-tighter leading-none max-w-2xl bg-gradient-to-r from-white via-white to-slate-500 bg-clip-text text-transparent italic">Deep-Sync for Microsoft Ecosystem</h2>
                            <p className="text-[18px] text-slate-400 font-medium max-w-2xl leading-relaxed italic">
                                "Our most advanced integration yet. One-click synchronization for Outlook, SharePoint, and Microsoft Dynamics 365 with native AI object mapping."
                            </p>
                            <div className="flex items-center gap-6">
                                <Button onClick={() => toast({ title: "Installing...", description: "Microsoft Ecosystem sync initializing. Setting up OAuth permissions." })} className="h-14 bg-white text-slate-950 hover:bg-slate-100 font-black px-12 rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-2xl shadow-indigo-500/10">
                                    Initialize Installation
                                </Button>
                                <Button onClick={() => toast({ title: "Technical Specs", description: "Loading full documentation for Microsoft Deep-Sync integration." })} variant="ghost" className="h-14 text-white hover:text-indigo-400 font-black text-[12px] gap-3 px-8 uppercase tracking-widest group/btn">
                                    Technical Specs <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                                </Button>
                            </div>
                        </div>
                        <div className="hidden xl:flex h-64 w-64 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 rounded-[60px] shadow-[0_0_80px_rgba(99,102,241,0.2)] items-center justify-center transform rotate-12 group-hover:rotate-6 transition-all duration-700 shrink-0 border border-white/10">
                            <Puzzle size={100} className="text-white opacity-20" />
                        </div>
                    </CardContent>
                </Card>

                {/* Apps Grid */}
                {filteredApps.map((app) => (
                    <Card key={app.id} className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white group hover:ring-indigo-200 transition-all hover:translate-y-[-8px] duration-500 overflow-hidden">
                        <div className="p-8 space-y-7 flex flex-col h-full relative">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                <Puzzle size={80} />
                            </div>

                            <div className="flex items-start justify-between relative z-10">
                                <div className={`h-16 w-16 rounded-2xl ${app.bg} ${app.color} border border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                                    {app.icon}
                                </div>
                                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1 rounded-xl shadow-inner border border-amber-100 transition-colors group-hover:bg-amber-100">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-[13px] font-black leading-none">{app.rating}</span>
                                </div>
                            </div>

                            <div className="space-y-1 relative z-10">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-[20px] font-black text-slate-900 tracking-tight uppercase tracking-widest leading-none">{app.name}</h4>
                                    {app.certified && <div className="h-6 w-6 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center shadow-sm"><SearchCheck size={14} /></div>}
                                </div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{app.category} • {app.installs} Global Installs</p>
                            </div>

                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed flex-1 italic relative z-10">
                                "{app.description}"
                            </p>

                            <Button
                                onClick={() => handleInstall(app.id)}
                                variant={app.status === 'Installed' ? 'outline' : 'default'}
                                className={`w-full h-12 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all relative z-10 ${app.status === 'Installed'
                                    ? 'border-emerald-100 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50'
                                    : app.status === 'Native'
                                        ? 'bg-slate-950 text-white shadow-xl shadow-slate-200'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                                    }`}
                            >
                                {app.status === 'Installed' ? <CheckCircle2 size={16} className="mr-2" /> : null}
                                {app.status === 'Installed' ? 'Active Choice' : app.status}
                            </Button>
                        </div>
                    </Card>
                ))}

            </div>

            {/* Help Hub Footer */}
            <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                        <LifeBuoy size={28} />
                    </div>
                    <div>
                        <h4 className="text-[16px] font-black text-slate-900 uppercase">Partner Support Hub</h4>
                        <p className="text-[13px] text-slate-500 font-medium">Need a custom integration or specialized data bridge? Our developers are ready.</p>
                    </div>
                </div>
                <Button onClick={() => toast({ title: "Support Request Sent", description: "Our developer team will contact you within 24 hours." })} variant="outline" className="h-11 border-slate-300 text-slate-900 font-black px-8 rounded-xl uppercase text-[11px] tracking-widest bg-white">Contact Developer Team</Button>
            </div>

        </div>
    )
}
