"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Code,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Key,
    Zap,
    Scale,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Settings2,
    ArrowUpRight,
    Layout,
    ExternalLink,
    Terminal,
    RefreshCw,
    MoreHorizontal,
    Trash2,
    Webhook,
    Shield,
    Activity,
    Server,
    Globe,
    Copy,
    Eye,
    EyeOff,
    X,
    Cpu,
    Lock,
    Globe2,
    Check,
    LayoutGrid
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"

interface APIKey {
    id: string
    name: string
    key: string
    status: "Active" | "Revoked"
    created: string
    usage: string
}

const INITIAL_KEYS: APIKey[] = [
    { id: "KEY-001", name: "Production Web Server", key: "sk_live_51...j9x2", status: "Active", created: "Jan 12, 2026", usage: "12.4k calls" },
    { id: "KEY-002", name: "Staging Environment", key: "sk_test_51...k0w4", status: "Active", created: "Feb 1, 2026", usage: "450 calls" },
    { id: "KEY-003", name: "Zapier Integration", key: "sk_live_51...m1v8", status: "Active", created: "3 days ago", usage: "8.2k calls" },
]

interface WebhookItem {
    id: string
    url: string
    event: string
    status: "Healthy" | "Failed" | "Warning"
}

const INITIAL_WEBHOOKS: WebhookItem[] = [
    { id: "WH-001", url: "https://hooks.zapier.com/v1/lead-ingest", event: "Lead Created", status: "Healthy" },
    { id: "WH-002", url: "https://api.internal-erp.com/leads", event: "Status Updated", status: "Healthy" },
    { id: "WH-003", url: "https://slack-bot.internal.com/notify", event: "Qualification Won", status: "Failed" },
]

export default function APIWebhooksPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [keys, setKeys] = useState<APIKey[]>(INITIAL_KEYS)
    const [webhooks, setWebhooks] = useState<WebhookItem[]>(INITIAL_WEBHOOKS)
    const [showConnectModal, setShowConnectModal] = useState(false)
    const [showWebhookModal, setShowWebhookModal] = useState(false)
    const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

    useEffect(() => { setIsClient(true) }, [])

    const toggleKey = (id: string) => {
        setShowKeys(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({ title: "Copied to Clipboard", description: "API Key secret has been copied securely." })
    }

    const handleGenerateKey = () => {
        const newKey: APIKey = {
            id: `KEY-00${keys.length + 1}`,
            name: "New API Client",
            key: "sk_live_" + Math.random().toString(36).substring(7),
            status: "Active",
            created: "Just now",
            usage: "0 calls"
        }
        setKeys([...keys, newKey])
        setShowConnectModal(false)
        toast({ title: "API Key Generated", description: "Store this key safely. It will not be shown again." })
    }

    const handleAddWebhook = () => {
        const newWh: WebhookItem = {
            id: `WH-00${webhooks.length + 1}`,
            url: "https://new-web-hook.io/api",
            event: "Deal Closed",
            status: "Healthy"
        }
        setWebhooks([...webhooks, newWh])
        setShowWebhookModal(false)
        toast({ title: "Webhook Registered", description: "Sending initial handshake payload to verify endpoint." })
    }

    const handleDeleteKey = (id: string) => {
        setKeys(keys.filter(k => k.id !== id))
        toast({ title: "Key Revoked", description: "This key can no longer be used for authentication." })
    }

    const STAT_CARDS = [
        { label: "Total Requests", val: "42.8k", detail: "Last 24 hours", icon: Activity, bg: "bg-slate-50/60", color: "text-slate-700", border: "border-slate-200/60" },
        { label: "Active Webhooks", val: "8 Active", detail: "Real-time sync", icon: Webhook, bg: "bg-emerald-50/40", color: "text-emerald-600", border: "border-emerald-100/60" },
        { label: "Reponse Time", val: "142ms", detail: "Global average", icon: Zap, bg: "bg-amber-50/40", color: "text-amber-600", border: "border-amber-100/60" },
        { label: "System Uptime", val: "99.99%", detail: "Level 1 health", icon: Globe2, bg: "bg-indigo-50/40", color: "text-indigo-600", border: "border-indigo-100/60" },
    ]

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-slate-900">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                                <Terminal className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900 uppercase">
                                Developer API & Webhooks
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            The backbone for custom automation. Manage secure API keys, configure OAuth applications, and set up real-time webhooks for tool synchronization.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => toast({ title: "Security Audit", description: "Running API key vulnerability scan..." })} variant="outline" className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-bold text-[11px] px-5 uppercase tracking-widest">
                        <Shield className="h-4 w-4 mr-2 text-slate-400" /> Security Audit
                    </Button>
                    <Button onClick={() => setShowConnectModal(true)} className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 shadow-slate-200 shadow-lg border-none uppercase text-[11px] tracking-widest">
                        <Plus className="h-4 w-4 mr-2" /> Generate Key
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

                {/* API Keys Table */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[17px] font-black text-slate-900 uppercase tracking-tight">Access Management (API Keys)</h3>
                            <p className="text-[12px] text-slate-500 font-medium whitespace-nowrap">Rotate keys regularly to maintain high security standards and prevent data leaks.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-50 hover:bg-transparent">
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-5">Key Identity</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secret Value</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Throughput</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {keys.map((k) => (
                                    <TableRow key={k.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <p className="text-[14px] font-bold text-slate-900">{k.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Born on {k.created}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 bg-slate-50 p-1.5 pl-3 rounded-xl border border-slate-100 w-fit shadow-inner">
                                                <code className="text-[12px] font-mono text-slate-600 font-bold">
                                                    {showKeys[k.id] ? k.key : "••••••••••••••••••••"}
                                                </code>
                                                <div className="flex items-center gap-1 ml-4 border-l pl-2 border-slate-200">
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-slate-900 rounded-lg" onClick={() => toggleKey(k.id)}>
                                                        {showKeys[k.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-slate-900 rounded-lg" onClick={() => copyToClipboard(k.key)}>
                                                        <Copy size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 h-5 px-2 text-[9px] font-black uppercase tracking-wider">Active Choice</Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <p className="text-[13px] font-semibold text-slate-900 tabular-nums">{k.usage}</p>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="icon" variant="ghost" onClick={() => handleDeleteKey(k.id)} className="h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl">
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Webhooks Area */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white overflow-hidden p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 px-2">
                        <div className="space-y-1">
                            <h3 className="text-[17px] font-black text-slate-900 uppercase tracking-tight">Outgoing Events (Webhooks)</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Transmit real-time system events to external secure endpoints globally.</p>
                        </div>
                        <Button onClick={() => setShowWebhookModal(true)} variant="outline" className="h-10 border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900 font-black px-5 rounded-xl text-[11px] uppercase tracking-widest">
                            <Plus size={14} className="mr-2" /> Register Hook
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {webhooks.map((wh) => (
                            <div key={wh.id} className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-2xl hover:shadow-slate-100/50 transition-all flex flex-col gap-6 group">
                                <div className="flex items-center justify-between">
                                    <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all shadow-sm">
                                        <Webhook size={24} />
                                    </div>
                                    <Badge className={`border shadow-sm h-6 px-3 text-[10px] font-black uppercase tracking-wider ${wh.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                                        {wh.status}
                                    </Badge>
                                </div>
                                <div className="space-y-2 min-w-0">
                                    <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest leading-none bg-indigo-50/50 w-fit px-2 py-1 rounded-lg border border-indigo-100/50">{wh.event}</p>
                                    <p className="text-[14px] font-bold text-slate-900 truncate tracking-tight">{wh.url}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listening...</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl">
                                            <Activity size={18} />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* OAuth Applications Card */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-8 px-2">
                        <div className="space-y-1">
                            <h3 className="text-[17px] font-black text-slate-900 uppercase tracking-tight">OAuth Applications</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Build and manage custom applications that access Fixl resources via OAuth 2.0.</p>
                        </div>
                        <Button onClick={() => toast({ title: "New Application", description: "Opening OAuth app creation wizard." })} variant="outline" className="h-10 border-slate-200 bg-slate-50 text-slate-900 font-black px-5 rounded-xl text-[11px] uppercase tracking-widest">
                            <Plus size={14} className="mr-2" /> New App
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 rounded-3xl bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.05),transparent)] border border-slate-100 hover:border-indigo-200 transition-all flex items-center justify-between gap-6 group">
                            <div className="flex items-center gap-5 min-w-0">
                                <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform shadow-sm">
                                    <LayoutGrid size={28} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[16px] font-black text-slate-900 uppercase tracking-tight">Fixl Internal Analytics</p>
                                    <p className="text-[11px] text-slate-400 font-medium font-mono">Client ID: fxl_app_8271039...a9</p>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-300 hover:text-slate-900 hover:bg-white rounded-xl">
                                <ArrowUpRight size={20} />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Developer Resources Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-slate-950 text-white p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Cpu size={120} />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h4 className="text-[16px] font-black uppercase tracking-tight text-white flex items-center gap-2">
                                <Code className="h-5 w-5 text-indigo-400" /> API Documentation
                            </h4>
                            <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                                Integrate your proprietary tech stack using our enterprise-ready RESTful API. Plug and play modules.
                            </p>
                        </div>
                        <Button onClick={() => toast({ title: "API Reference", description: "Opening Fixl developer docs in a new tab." })} className="w-full h-12 bg-white text-slate-950 hover:bg-slate-100 font-black rounded-xl border-none uppercase text-[11px] tracking-widest mt-2 shadow-xl shadow-slate-900/40 relative z-10">
                            Open API Reference <ExternalLink size={14} className="ml-2" />
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-[17px] font-black text-slate-900 uppercase tracking-tight">Node Integrity</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Global infrastructure health status.</p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "US East (N. Virginia)", status: "Operational", color: "bg-emerald-500" },
                                { label: "EU West (Dublin)", status: "Operational", color: "bg-emerald-500" },
                                { label: "AP South (Mumbai)", status: "Operational", color: "bg-emerald-500" },
                            ].map((s, i) => (
                                <div key={i} className="flex justify-between items-center text-[12px] p-3 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2.5 w-2.5 rounded-full ${s.color} shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
                                        <span className="font-bold text-slate-600">{s.label}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.status}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

            </div>

            {/* Generate Key Modal */}
            {showConnectModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 font-outfit">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="h-16 w-16 rounded-3xl bg-slate-100 text-slate-900 flex items-center justify-center mb-1 shadow-sm">
                                <Lock size={32} />
                            </div>
                            <h3 className="text-[26px] font-black text-slate-900 tracking-tight uppercase leading-none">Provision API Key</h3>
                            <p className="text-[13px] text-slate-500 font-medium italic">"Securing your custom integration bridge."</p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Key Configuration Name</Label>
                                <Input placeholder="e.g. Analytics Cloud Bridge" className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-5 font-bold text-slate-700" />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <Button variant="ghost" onClick={() => setShowConnectModal(false)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50">Back</Button>
                            <Button onClick={handleGenerateKey} className="flex-1 h-14 bg-slate-900 text-white font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl">Mint Credentials</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Register Webhook Modal */}
            {showWebhookModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 font-outfit">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="h-16 w-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1 shadow-sm">
                                <Webhook size={32} />
                            </div>
                            <h3 className="text-[26px] font-black text-slate-900 tracking-tight uppercase leading-none">Target Webhook</h3>
                            <p className="text-[13px] text-slate-500 font-medium italic">"Real-time data broadcast configuration."</p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination URL</Label>
                                <Input placeholder="https://api.yourdomain.com/v1/webhook" className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-5 font-bold text-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Trigger</Label>
                                <Select defaultValue="lead_created">
                                    <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700">
                                        <SelectValue placeholder="Select event" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        <SelectItem value="lead_created" className="font-bold">Lead Created</SelectItem>
                                        <SelectItem value="status_updated" className="font-bold">Status Updated</SelectItem>
                                        <SelectItem value="deal_won" className="font-bold">Deal Won</SelectItem>
                                        <SelectItem value="deal_lost" className="font-bold">Deal Lost</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <Button variant="ghost" onClick={() => setShowWebhookModal(false)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50">Cancel</Button>
                            <Button onClick={handleAddWebhook} className="flex-1 h-14 bg-indigo-600 text-white font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl shadow-indigo-200">Activate Hook</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
