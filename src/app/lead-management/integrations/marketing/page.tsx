"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Megaphone,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Mail,
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
    Layers,
    Send,
    Users,
    MousePointer2,
    Target,
    X,
    ShieldCheck,
    Globe,
    ChevronRight,
    ArrowRight
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
import { Progress } from "@/shared/components/ui/progress"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

interface MarketingApp {
    id: string
    name: string
    category: string
    status: "Connected" | "Disconnected" | "Syncing" | "Error"
    syncFreq: string
    audienceCount: string
    lastSync: string
    health: "Healthy" | "Warning" | "Critical"
    iconColor: string
}

const INITIAL_APPS: MarketingApp[] = [
    { id: "MKT-001", name: "Mailchimp", category: "Email Marketing", status: "Connected", syncFreq: "Every 15 mins", audienceCount: "12,450", lastSync: "8 mins ago", health: "Healthy", iconColor: "text-amber-500" },
    { id: "MKT-002", name: "HubSpot Marketing", category: "Automation Suite", status: "Connected", syncFreq: "Real-time", audienceCount: "4,200", lastSync: "Just now", health: "Healthy", iconColor: "text-orange-500" },
    { id: "MKT-003", name: "SendGrid", category: "Transactional Email", status: "Error", syncFreq: "Hourly", audienceCount: "N/A", lastSync: "3h ago", health: "Warning", iconColor: "text-indigo-400" },
]

export default function MarketingPlatformsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [apps, setApps] = useState<MarketingApp[]>(INITIAL_APPS)
    const [showAddModal, setShowAddModal] = useState(false)
    const [isSyncingAll, setIsSyncingAll] = useState(false)

    useEffect(() => { setIsClient(true) }, [])

    const handleSyncAll = () => {
        setIsSyncingAll(true)
        setTimeout(() => {
            setIsSyncingAll(false)
            toast({ title: "Global Sync Complete", description: "All audience segments updated across 4 platforms." })
        }, 2000)
    }

    const handleDelete = (id: string) => {
        setApps(apps.filter(app => app.id !== id))
        toast({ title: "Integration Removed", description: "Platform access revoked and sync jobs terminated." })
    }

    const handleAdd = () => {
        const newApp: MarketingApp = {
            id: `MKT-00${apps.length + 1}`,
            name: "Klaviyo",
            category: "E-commerce Email",
            status: "Syncing",
            syncFreq: "Real-time",
            audienceCount: "0",
            lastSync: "Just now",
            health: "Healthy",
            iconColor: "text-rose-500"
        }
        setApps([...apps, newApp])
        setShowAddModal(false)
        toast({ title: "Platform Connected", description: "Establishing initial handshake... initial data mapping required." })
    }

    const STAT_CARDS = [
        { label: "Synced Users", val: "18.4k", detail: "Across 4 apps", icon: Users, bg: "bg-indigo-50/10", color: "text-indigo-600", border: "border-indigo-100/20" },
        { label: "Active Nurtures", val: "24 Flows", detail: "Triggered from CRM", icon: Zap, bg: "bg-amber-50/10", color: "text-amber-600", border: "border-amber-100/20" },
        { label: "Delivery Health", val: "99.2%", detail: "Mail server trust", icon: Send, bg: "bg-emerald-50/10", color: "text-emerald-600", border: "border-emerald-100/20" },
        { label: "Engagement Hub", val: "+14%", detail: "Sync ROI this month", icon: Target, bg: "bg-cyan-50/10", color: "text-cyan-600", border: "border-cyan-100/20" },
    ]

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-pink-500">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-pink-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-pink-50 text-pink-600 border border-pink-100 shadow-sm">
                                <Megaphone className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Marketing Sync & Automation
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Synchronize lead segments with your ESP and Marketing Cloud. Drive automated nurture sequences based on pipeline status changes.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleSyncAll} disabled={isSyncingAll} className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-bold text-[11px] px-5 uppercase tracking-widest">
                        <RefreshCw className={`h-4 w-4 mr-2 text-slate-400 ${isSyncingAll ? 'animate-spin text-pink-500' : ''}`} /> Sync All Audiences
                    </Button>
                    <Button onClick={() => setShowAddModal(true)} className="h-10 bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 shadow-pink-100 shadow-lg border-none uppercase text-[11px] tracking-widest">
                        <Plus className="h-4 w-4 mr-2" /> Connect App
                    </Button>
                </div>
            </div>

            {/* Tactical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-2xl p-5 shadow-none space-y-3`}>
                        <div className={`h-9 w-9 rounded-xl bg-white flex items-center justify-center ${s.color} shadow-sm`}><s.icon size={18} /></div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[18px] font-semibold ${s.color}`}>{s.val}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.detail}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Apps Grid */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Connected Platforms</h2>
                        <Button variant="ghost" onClick={() => router.push('/lead-management/integrations/marketplace')} className="h-8 text-pink-600 font-black text-[10px] uppercase tracking-widest">Marketplace Hub <ArrowRight size={12} className="ml-1.5" /></Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {apps.map((app) => (
                            <Card key={app.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white group hover:ring-pink-100 transition-all overflow-hidden p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-5 min-w-[300px]">
                                        <div className={`h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center ${app.iconColor} group-hover:bg-pink-600 group-hover:text-white transition-all cursor-default relative`}>
                                            <Mail size={24} />
                                            <div className={`absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${app.health === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[16px] font-bold text-slate-900 tracking-tight">{app.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] font-black uppercase text-slate-400 border-slate-100 h-4.5 px-1.5">{app.category}</Badge>
                                                <span className="text-[11px] font-medium text-slate-400">• {app.syncFreq}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:flex items-center gap-8">
                                        <div className="flex flex-col md:items-center">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Audience</p>
                                            <h4 className="text-[15px] font-bold text-slate-900 tabular-nums">{app.audienceCount}</h4>
                                        </div>

                                        <div className="flex flex-col md:items-end">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Last Sync</p>
                                            <h4 className="text-[13px] font-bold text-slate-600">{app.lastSync}</h4>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 shrink-0">
                                        <Button size="icon" variant="ghost" onClick={() => toast({ title: "Connection Settings", description: `Configuring sync rules for ${app.name}` })} className="h-10 w-10 text-slate-300 hover:text-pink-600 hover:bg-pink-50 rounded-xl">
                                            <Settings2 size={18} />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleDelete(app.id)} className="h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Mapping & Integrity Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8">
                        <div className="space-y-1 mb-7">
                            <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">Sync Integrity</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Tracking data fidelity during audience uploads.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex justify-between text-[11px] font-black uppercase text-slate-500">
                                    <span>Field Accuracy</span>
                                    <span className="text-pink-600 leading-none py-1 px-2 bg-white rounded-lg border border-pink-100 shadow-sm">98.4%</span>
                                </div>
                                <Progress value={98.4} className="h-2 bg-white [&>div]:bg-pink-500" />
                            </div>

                            <div className="space-y-4 pt-4">
                                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Global Mapping Health</h4>
                                {[
                                    { field: "Email Address", status: "Verified" },
                                    { field: "Lead Score", status: "Dynamic" },
                                    { field: "Funnel Stage", status: "Synced" },
                                ].map((m, i) => (
                                    <div key={i} className="flex justify-between items-center text-[12px] p-3 rounded-xl border border-slate-50 hover:border-pink-50 group transition-all">
                                        <span className="font-bold text-slate-600 group-hover:text-slate-900">{m.field}</span>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none h-5 px-2 text-[9px] font-black uppercase tracking-wider">{m.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button onClick={() => toast({ title: "Data Mapping", description: "Opening field mapping editor for marketing platform sync." })} variant="outline" className="w-full h-11 text-pink-600 font-black text-[11px] mt-8 bg-transparent border-slate-100 hover:bg-pink-50 hover:border-pink-100 rounded-xl uppercase tracking-widest">Adjust Data Mapping</Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-950 text-white p-8 space-y-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Layers size={100} />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-pink-400"><Zap size={18} /></div>
                            <h4 className="text-[15px] font-bold tracking-tight text-white">Nurture Re-flow</h4>
                        </div>
                        <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                            Automatically re-trigger email sequences when a previously "Cold" lead performs a high-intent behavioral action.
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Automation Lock</span>
                            <Switch checked={true} className="data-[state=checked]:bg-pink-500" />
                        </div>
                    </Card>
                </div>

            </div>

            {/* Add Connection Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <div className="h-16 w-16 rounded-3xl bg-pink-50 text-pink-600 flex items-center justify-center mb-2">
                                <Plus size={32} />
                            </div>
                            <h3 className="text-[24px] font-black text-slate-900 tracking-tight uppercase leading-none">Connect Platform</h3>
                            <p className="text-[13px] text-slate-500 font-medium italic">"Bridge your CRM data with marketing reach."</p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Service</Label>
                                <Select defaultValue="klaviyo">
                                    <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700">
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        <SelectItem value="mailchimp" className="font-bold">Mailchimp</SelectItem>
                                        <SelectItem value="hubspot" className="font-bold">HubSpot Marketing</SelectItem>
                                        <SelectItem value="klaviyo" className="font-bold">Klaviyo</SelectItem>
                                        <SelectItem value="sendinblue" className="font-bold">Brevo (Sendinblue)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex gap-4">
                                <ShieldCheck className="h-5 w-5 text-indigo-500 shrink-0" />
                                <p className="text-[11px] text-indigo-600 font-bold leading-relaxed uppercase tracking-tight">
                                    Establishing this connection will allow bidirectional sync of 7 base contact fields and 3 custom tags.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <Button variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50">Discard</Button>
                            <Button onClick={handleAdd} className="flex-1 h-14 bg-slate-900 text-white font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl shadow-slate-200">Auth & Connect</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
