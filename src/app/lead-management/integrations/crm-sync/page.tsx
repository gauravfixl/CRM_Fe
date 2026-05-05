"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Database,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    RefreshCw,
    Share2,
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
    MoreHorizontal,
    Trash2,
    ArrowLeftRight,
    ArrowRight,
    ShieldCheck,
    History,
    FileJson,
    Server,
    X,
    FileText,
    Activity,
    Layers
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
import { Progress } from "@/shared/components/ui/progress"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"

interface CRMApp {
    id: string
    name: string
    type: string
    status: "Connected" | "Active" | "Warning" | "Error"
    direction: "Two-way" | "One-way (Out)" | "One-way (In)"
    syncFreq: string
    objects: number
    health: "Healthy" | "Warning" | "Failed"
}

const INITIAL_CRM_APPS: CRMApp[] = [
    { id: "CRM-001", name: "Salesforce", type: "Enterprise CRM", status: "Connected", direction: "Two-way", syncFreq: "Every 5 mins", objects: 4, health: "Healthy" },
    { id: "CRM-002", name: "Zoho CRM", type: "SMB CRM", status: "Active", direction: "One-way (Out)", syncFreq: "Hourly", objects: 2, health: "Healthy" },
    { id: "CRM-003", name: "SAP ERP", type: "Backend Fulfillment", status: "Warning", direction: "One-way (In)", syncFreq: "Daily", objects: 1, health: "Warning" },
]

export default function CRMSyncPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [apps, setApps] = useState<CRMApp[]>(INITIAL_CRM_APPS)
    const [showConnectModal, setShowConnectModal] = useState(false)
    const [isGlobalSyncing, setIsGlobalSyncing] = useState(false)

    useEffect(() => { setIsClient(true) }, [])

    const handleGlobalResync = () => {
        setIsGlobalSyncing(true)
        setTimeout(() => {
            setIsGlobalSyncing(false)
            toast({ title: "Master Sync Complete", description: "Fidelity audit passed for 12,450 records across linked CRMs." })
        }, 2000)
    }

    const handleDelete = (id: string) => {
        setApps(apps.filter(a => a.id !== id))
        toast({ title: "Master Link Severed", description: "CRM bridge dismantled. Local data retained, sync stopped." })
    }

    const handleConnect = () => {
        const newApp: CRMApp = {
            id: `CRM-00${apps.length + 1}`,
            name: "HubSpot CRM",
            type: "Marketing CRM",
            status: "Connected",
            direction: "Two-way",
            syncFreq: "Every 15 mins",
            objects: 3,
            health: "Healthy"
        }
        setApps([...apps, newApp])
        setShowConnectModal(false)
        toast({ title: "Handshake Successful", description: "Mapping 14 core objects from HubSpot into Fixl Local Storage." })
    }

    const STAT_CARDS = [
        { label: "Master Records", val: "42.8k", detail: "Synced successfully", icon: Layers, bg: "bg-indigo-50/10", color: "text-indigo-600", border: "border-indigo-100/20" },
        { label: "Sync Health", val: "98.2%", detail: "Integrity score", icon: ShieldCheck, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
        { label: "Daily Collisions", val: "144", detail: "Automerged", icon: Zap, bg: "bg-amber-50/10", color: "text-amber-600", border: "border-amber-100/20" },
        { label: "Data Latency", val: "1.2s", detail: "Avg bridge speed", icon: Activity, bg: "bg-cyan-50/10", color: "text-cyan-600", border: "border-cyan-100/20" },
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
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <Database className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                CRM & Data Synchronization
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Bridge the gap between lead management and your core CRM/ERP. Manage complex field mapping, object syncing, and conflict resolution protocols.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleGlobalResync} disabled={isGlobalSyncing} className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[11px] px-5 uppercase tracking-widest">
                        <History className={`h-4 w-4 mr-2 text-slate-400 ${isGlobalSyncing ? 'animate-spin text-indigo-500' : ''}`} /> Global Re-sync
                    </Button>
                    <Button onClick={() => setShowConnectModal(true)} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none uppercase text-[11px] tracking-widest">
                        <Plus className="h-4 w-4 mr-2" /> Connect CRM
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
                        <h2 className="text-[14px] font-semibold text-slate-900 uppercase tracking-widest tracking-tight">Master Data Connections</h2>
                        <Button onClick={() => toast({ title: "Mapping Library", description: "Opening advanced field mapping editor." })} variant="ghost" className="h-8 text-indigo-600 font-semibold text-[10px] uppercase tracking-widest hover:bg-indigo-50">Advanced Mapping Library <ExternalLink size={12} className="ml-1.5" /></Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {apps.map((app) => (
                            <Card key={app.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white group hover:ring-indigo-200 transition-all overflow-hidden p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-5 min-w-[280px]">
                                        <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-default shadow-sm relative">
                                            <Server size={24} />
                                            <div className={`absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${app.health === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[16px] font-semibold text-slate-900">{app.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] font-medium uppercase text-slate-400 border-slate-100 h-4.5 px-1.5">{app.type}</Badge>
                                                <span className="text-[11px] font-medium text-slate-400">• {app.syncFreq}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:flex items-center gap-12">
                                        <div className="flex flex-col md:items-center">
                                            <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">Flow Direction</p>
                                            <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                                                {app.direction === 'Two-way' ? <ArrowLeftRight size={14} className="text-indigo-600" /> : <ArrowRight size={14} className="text-indigo-600" />}
                                                <h4 className="text-[12px] font-semibold text-slate-900 uppercase tracking-tighter whitespace-nowrap">{app.direction}</h4>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:items-end">
                                            <p className="text-[10px] font-semibold text-slate-300 uppercase tracking-widest">Object Ingest</p>
                                            <h4 className="text-[14px] font-semibold text-slate-900 tabular-nums uppercase">{app.objects} Mapped</h4>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 shrink-0">
                                        <Button size="icon" variant="ghost" onClick={() => toast({ title: "Channel Settings", description: "Configuring sync rules for " + app.name })} className="h-10 w-10 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl">
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

                {/* Conflict & Protocol Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-50 p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-200">
                            <ShieldCheck size={100} />
                        </div>
                        <h4 className="text-[16px] font-semibold uppercase tracking-tight text-indigo-600">Conflict Governance</h4>
                        <div className="space-y-4 relative z-10">
                            <div className="p-5 rounded-2xl bg-white/50 border border-indigo-100 space-y-3 shadow-inner">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">Global Sync Strategy</p>
                                <Select defaultValue="recent">
                                    <SelectTrigger className="h-10 bg-white border-indigo-100 text-slate-900 text-[12px] font-semibold rounded-xl ring-offset-indigo-50">
                                        <SelectValue placeholder="Select Strategy" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-indigo-100 text-slate-900 rounded-xl">
                                        <SelectItem value="recent" className="font-semibold">Most Recent Wins</SelectItem>
                                        <SelectItem value="crm" className="font-semibold">CRM is Master</SelectItem>
                                        <SelectItem value="fixl" className="font-semibold">Fixl is Master</SelectItem>
                                        <SelectItem value="manual" className="font-semibold">Manual Approval</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[11px] text-slate-400 font-medium italic">"Ensures data consistency during bi-directional overlap."</p>
                            </div>
                        </div>
                        <Button onClick={() => toast({ title: "Advanced Protocols", description: "Loading merge conflict resolution rules." })} className="w-full h-12 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-xl border-none uppercase text-[11px] tracking-widest mt-2 shadow-xl shadow-indigo-100/50">
                            Advanced Protocols
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-[17px] font-semibold text-slate-900 uppercase tracking-tight">Data Integrity Guard</h3>
                            <p className="text-[12px] text-slate-500 font-medium tracking-tight whitespace-nowrap">Audit real-time fidelity between platform objects.</p>
                        </div>
                        <div className="space-y-5">
                            {[
                                { label: "Lead <=> Contact", health: 100 },
                                { label: "Company <=> Account", health: 92 },
                                { label: "Note <=> Activity", health: 84 },
                            ].map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-semibold uppercase pt-1">
                                        <span className="text-slate-500">{s.label}</span>
                                        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 shadow-sm">{s.health}%</span>
                                    </div>
                                    <Progress value={s.health} className="h-2 bg-slate-50 [&>div]:bg-indigo-600 rounded-full" />
                                </div>
                            ))}
                        </div>
                        <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0 border border-indigo-100">
                                <FileJson size={16} />
                            </div>
                            <p className="text-[11px] text-indigo-700 font-semibold leading-relaxed uppercase tracking-tighter">Field-level validation enforced for all PII data points.</p>
                        </div>
                    </Card>
                </div>

            </div>

            {/* Connect CRM Modal */}
            {showConnectModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden relative">
                        <div className="absolute -top-10 -left-10 h-32 w-32 bg-indigo-50 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-cyan-50 rounded-full blur-3xl opacity-50" />

                        <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                            <div className="h-16 w-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1 shadow-sm border border-indigo-100">
                                <CloudSync size={32} />
                            </div>
                            <h3 className="text-[26px] font-black text-slate-900 tracking-tight uppercase leading-none">Bridge Master Data</h3>
                            <p className="text-[13px] text-slate-500 font-medium italic">"Establish an enterprise-grade sync pipeline."</p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">CRM Provider</Label>
                                <Select defaultValue="hubspot">
                                    <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700">
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        <SelectItem value="salesforce" className="font-bold">Salesforce Enterprise</SelectItem>
                                        <SelectItem value="hubspot" className="font-bold">HubSpot CRM</SelectItem>
                                        <SelectItem value="zoho" className="font-bold">Zoho CRM</SelectItem>
                                        <SelectItem value="dynamics" className="font-bold">Microsoft Dynamics 365</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Sync Intensity</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="h-12 rounded-2xl border-indigo-100 bg-indigo-50/50 text-indigo-600 font-black text-[10px] uppercase tracking-widest">Real-time (Push)</Button>
                                    <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest">Batch (Daily)</Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 relative z-10">
                            <Button variant="ghost" onClick={() => setShowConnectModal(false)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50">Cancel</Button>
                            <Button onClick={handleConnect} className="flex-1 h-14 bg-slate-900 text-white font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl shadow-indigo-100/50">Authorize CRM</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

const CloudSync = ({ className, size = 24 }: { className?: string, size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
        <path d="M12 6v4l3 3" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="m7.8 16.2-2.9 2.9" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="m7.8 7.8-2.9-2.9" />
    </svg>
)
