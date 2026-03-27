"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Share2,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Globe,
    MessageSquare,
    Link2,
    Database,
    Zap,
    Activity,
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
    FileCode,
    Terminal,
    X,
    Copy,
    Save
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"

interface LeadSource {
    id: string
    name: string
    type: string
    status: string
    leads: number
    lastSync: string
    health: "Healthy" | "Warning" | "Critical"
}

const INITIAL_SOURCES: LeadSource[] = [
    { id: "SRC-001", name: "Main Website Form", type: "Embedded HTML", status: "Active", leads: 1240, lastSync: "2 mins ago", health: "Healthy" },
    { id: "SRC-002", name: "Contact Us Chatbot", type: "Intercom", status: "Active", leads: 450, lastSync: "1h ago", health: "Healthy" },
    { id: "SRC-003", name: "LinkedIn Lead Gen", type: "Native App", status: "Active", leads: 820, lastSync: "5 mins ago", health: "Healthy" },
    { id: "SRC-004", name: "Typeform Survey", type: "Webhook", status: "Paused", leads: 124, lastSync: "2 days ago", health: "Warning" },
]

export default function LeadCapturePage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [sources, setSources] = useState<LeadSource[]>(INITIAL_SOURCES)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showTestModal, setShowTestModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isTesting, setIsTesting] = useState(false)

    useEffect(() => { setIsClient(true) }, [])

    const handleAddSource = () => {
        const newSource: LeadSource = {
            id: `SRC-00${sources.length + 1}`,
            name: "New Web Gateway",
            type: "Webhook",
            status: "Active",
            leads: 0,
            lastSync: "Never",
            health: "Healthy"
        }
        setSources([newSource, ...sources])
        setShowAddModal(false)
        toast({ title: "✅ Source Added", description: "Your new capture endpoint is now ready for mapping." })
    }

    const handleRunTest = () => {
        setIsTesting(true)
        setTimeout(() => {
            setIsTesting(false)
            toast({
                title: "Test Ingestion Successful",
                description: "Sample payload verified. Data matched Lead schema 100%.",
                variant: "default"
            })
        }, 1500)
    }

    const handleDelete = (id: string) => {
        setSources(sources.filter(s => s.id !== id))
        toast({ title: "Source Disconnected", description: "Data stream from this source has been strictly terminated." })
    }

    const STAT_CARDS = [
        { label: "Active Nodes", val: "12 Sources", detail: "99.9% Uptime", icon: Link2, bg: "bg-indigo-50/10", color: "text-indigo-600", border: "border-indigo-100/20" },
        { label: "Data Ingestion", val: "2,634 Leads", detail: "Last 30 days", icon: Database, bg: "bg-emerald-50/10", color: "text-emerald-600", border: "border-emerald-100/20" },
        { label: "Capture Velocity", val: "84%", detail: "Sync avg", icon: Zap, bg: "bg-amber-50/10", color: "text-amber-600", border: "border-amber-100/20" },
        { label: "Sync Latency", val: "1.2s", detail: "Real-time edge", icon: RefreshCw, bg: "bg-cyan-50/10", color: "text-cyan-600", border: "border-cyan-100/20" },
    ]

    const filteredSources = sources.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-inner">
                                <Share2 className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Global Lead Capture & Ingestion
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-2xl">
                            The enterprise-grade entry point for all incoming data streams. Configure forms, webhooks, and trackers with high-fidelity mapping rules.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setShowTestModal(true)} className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-black text-[11px] px-5 uppercase tracking-widest rounded-xl">
                        <Terminal className="h-4 w-4 mr-2 text-slate-400" /> Test Handshake
                    </Button>
                    <Button onClick={() => setShowAddModal(true)} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 shadow-indigo-200 shadow-xl border-none uppercase text-[11px] tracking-widest rounded-xl">
                        <Plus className="h-4 w-4 mr-2" /> Initialize Source
                    </Button>
                </div>
            </div>

            {/* Tactical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-2xl p-5 shadow-none space-y-4 group hover:shadow-lg hover:shadow-slate-200/50 transition-all border-b-4 ${s.border.replace('border-', 'border-b-')}`}>
                        <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center ${s.color} shadow-sm group-hover:scale-110 transition-transform`}><s.icon size={20} /></div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[22px] font-semibold ${s.color} tracking-tight`}>{s.val}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.detail}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Sources List */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white overflow-hidden p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 px-2">
                        <div className="space-y-1">
                            <h3 className="text-[17px] font-semibold text-slate-900">Active Ingestion Nodes</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Monitoring protocol integrity and real-time lead throughput.</p>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                            <Input
                                placeholder="Search by name or type..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-11 rounded-2xl border-slate-100 bg-slate-50 text-[12px] font-bold focus-visible:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-50 hover:bg-transparent">
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-6">Source Signature</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Throughput</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Fidelity</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSources.map((src) => (
                                    <TableRow key={src.id} className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-4 py-3">
                                                <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 shadow-sm group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shrink-0">
                                                    {src.type === 'Embedded HTML' ? <Code size={22} /> : src.type === 'Intercom' ? <MessageSquare size={22} /> : <Globe size={22} />}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[15px] font-black text-slate-900 whitespace-nowrap uppercase tracking-tight">{src.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{src.id} • {src.lastSync}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] font-black uppercase bg-white text-slate-500 border-slate-200 h-6 px-2 rounded-lg">
                                                {src.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-black text-slate-900 tabular-nums text-[15px]">
                                            {src.leads.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col items-center justify-center gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${src.health === 'Healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                                    <span className={`text-[11px] font-black uppercase tracking-tight ${src.health === 'Healthy' ? 'text-emerald-600' : 'text-amber-600'}`}>{src.health}</span>
                                                </div>
                                                <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${src.health === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: src.health === 'Healthy' ? '100%' : '65%' }} />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => toast({ title: "Node Protocol", description: "Configuring logic for " + src.name })} className="h-10 w-10 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all border-none">
                                                    <Settings2 size={18} />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(src.id)} className="h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border-none">
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Governance Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-slate-950 text-white p-8 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Zap size={140} className="text-indigo-500" />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <h4 className="text-[17px] font-black uppercase tracking-tight text-indigo-400 flex items-center gap-3">
                                <ShieldCheck className="h-5 w-5 fill-indigo-400/20" /> Shield Protocol
                            </h4>
                            <p className="text-[12px] text-slate-400 font-medium leading-relaxed italic">
                                "The system is currently intercepting **Level 1** anomalies based on active fingerprinting hashes."
                            </p>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold">Auto-Deduplication</p>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Email + Phone Hash</p>
                                </div>
                                <Switch checked={true} className="data-[state=checked]:bg-indigo-500" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold">Bot Intervention</p>
                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">ReCAPTCHA v3 Grade</p>
                                </div>
                                <Switch checked={true} className="data-[state=checked]:bg-indigo-500" />
                            </div>
                        </div>
                        <Button onClick={() => toast({ title: "Shield Rules", description: "Opening spam, bot, and duplicate filtering configuration." })} className="w-full h-12 bg-white text-slate-950 hover:bg-slate-100 font-black rounded-2xl border-none uppercase text-[11px] tracking-widest relative z-10 shadow-xl shadow-indigo-500/10">
                            Configure Shield Rules
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white p-8 space-y-7">
                        <div className="space-y-1">
                            <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">Mapping Intelligence</h4>
                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed">Automatic field resolution for incoming payloads.</p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "HTML Form Parser", status: "Active", health: 100 },
                                { label: "REST Webhook Bridge", status: "Monitoring", health: 94 },
                                { label: "Intercom Data Sync", status: "Syncing", health: 100 },
                            ].map((p, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">{p.label}</span>
                                        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-[9px]">{p.status}</span>
                                    </div>
                                    <Progress value={p.health} className="h-1.5 bg-slate-50 [&>div]:bg-indigo-600" />
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => toast({ title: "Schema Table", description: "Loading global field mapping schema across all endpoints." })} variant="outline" className="w-full h-11 border-slate-100 text-indigo-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-indigo-50 transition-all">Global Schema Table</Button>
                    </Card>
                </div>

            </div>

            {/* Test Webhook Modal */}
            {showTestModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-50 rounded-full blur-3xl opacity-50" />

                        <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                            <div className="h-16 w-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1 shadow-sm border border-indigo-100">
                                <Terminal size={32} />
                            </div>
                            <h2 className="text-[26px] font-black text-slate-900 tracking-tight uppercase leading-none">Simulate Ingestion</h2>
                            <p className="text-[13px] text-slate-500 font-medium italic">"Execute a synthetic payload to verify protocol mapping."</p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="p-6 rounded-3xl bg-slate-950 text-emerald-400 font-mono text-[13px] space-y-1 shadow-2xl border border-white/5 relative group">
                                <p className="text-slate-600 mb-2">// POST /v1/ingest/test_vector</p>
                                <p>{"{"}</p>
                                <p className="pl-6"><span className="text-indigo-400">"id"</span>: <span className="text-amber-400">"FXL_SIM_1"</span>,</p>
                                <p className="pl-6"><span className="text-indigo-400">"email"</span>: <span className="text-emerald-400">"lead@capture.io"</span>,</p>
                                <p className="pl-6"><span className="text-indigo-400">"payload"</span>: <span className="text-white">"synthetic_v2"</span></p>
                                <p>{"}"}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex gap-4">
                                <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm shrink-0 border border-indigo-100">
                                    <Zap size={18} fill="currentColor" />
                                </div>
                                <p className="text-[11px] text-indigo-700 font-black leading-relaxed uppercase tracking-tighter self-center">
                                    This test bypasses the shield layer and targets the direct validation engine.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 relative z-10">
                            <Button variant="ghost" onClick={() => setShowTestModal(false)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50">Discard</Button>
                            <Button
                                onClick={handleRunTest}
                                disabled={isTesting}
                                className="flex-1 h-14 bg-slate-950 text-white font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl shadow-indigo-100/50 gap-3"
                            >
                                {isTesting ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Activity className="h-5 w-5" />}
                                {isTesting ? "Validating..." : "Execute Test"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Source Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[20px] font-black text-slate-900 uppercase">Initialize Source</h3>
                            <Button size="icon" variant="ghost" onClick={() => setShowAddModal(false)} className="rounded-full h-8 w-8"><X size={18} /></Button>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Source Display Name</Label>
                                <Input placeholder="e.g. Footer Contact Form" className="h-12 rounded-xl border-slate-100 bg-slate-50 focus-visible:ring-indigo-500" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Connection Type</Label>
                                <Select defaultValue="webhook">
                                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="html">Embedded HTML Form</SelectItem>
                                        <SelectItem value="webhook">REST API Webhook</SelectItem>
                                        <SelectItem value="native">Native App Sync</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 h-12 rounded-xl font-bold uppercase text-[11px] tracking-widest">Cancel</Button>
                            <Button onClick={handleAddSource} className="flex-1 h-12 bg-slate-900 text-white font-bold rounded-xl border-none uppercase text-[11px] tracking-widest">Create Endpoint</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

const ShieldCheck = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
)
