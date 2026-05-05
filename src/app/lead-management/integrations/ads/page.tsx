"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    BarChart,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Facebook,
    Linkedin,
    Youtube,
    Instagram,
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
    TrendingUp,
    DollarSign,
    Layers,
    PieChart,
    Target,
    X,
    Wallet,
    Trophy,
    MousePointer2,
    ShieldCheck
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

interface AdAccount {
    id: string
    name: string
    platform: string
    status: "Active" | "Paused" | "Error"
    leads: number
    spend: string
    cpl: string
    health: "Healthy" | "Notice" | "Critical"
    iconColor: string
}

const INITIAL_AD_ACCOUNTS: AdAccount[] = [
    { id: "AD-001", name: "Meta Ads Manager", platform: "Facebook/Instagram", status: "Active", leads: 1420, spend: "$12,400", cpl: "$8.73", health: "Healthy", iconColor: "text-blue-500" },
    { id: "AD-002", name: "Google Performance Max", platform: "Google Search", status: "Active", leads: 950, spend: "$8,200", cpl: "$8.63", health: "Healthy", iconColor: "text-red-500" },
    { id: "AD-003", name: "LinkedIn Talent/Sales", platform: "LinkedIn Ads", status: "Paused", leads: 120, spend: "$4,500", cpl: "$37.50", health: "Notice", iconColor: "text-indigo-500" },
]

export default function AdPlatformsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [accounts, setAccounts] = useState<AdAccount[]>(INITIAL_AD_ACCOUNTS)
    const [showConnectModal, setShowConnectModal] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => { setIsClient(true) }, [])

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => {
            setIsRefreshing(false)
            toast({ title: "Cost Data Refreshed", description: "Successfully updated CTR, CPC, and CPL metrics for 45 active campaigns." })
        }, 1500)
    }

    const handleConnect = () => {
        const newAcc: AdAccount = {
            id: `AD-00${accounts.length + 1}`,
            name: "TikTok Ads Global",
            platform: "TikTok For Business",
            status: "Active",
            leads: 0,
            spend: "$0.00",
            cpl: "$0.00",
            health: "Healthy",
            iconColor: "text-slate-900"
        }
        setAccounts([...accounts, newAcc])
        setShowConnectModal(false)
        toast({ title: "Account Linked", description: "Initializing lead form webhooks and historical spend sync (Backfill: 7 days)." })
    }

    const handleDelete = (id: string) => {
        setAccounts(accounts.filter(a => a.id !== id))
        toast({ title: "Connection Terminated", description: "Ad account access revoked. Attribution rules preserved for historical data." })
    }

    const STAT_CARDS = [
        { label: "Total Ad Spend", val: "$25,100", detail: "Last 30 Days", icon: Wallet, bg: "bg-blue-50/10", color: "text-blue-600", border: "border-blue-100/20" },
        { label: "Ad-Gen Leads", val: "2,490", detail: "Sync'd directly", icon: Trophy, bg: "bg-emerald-50/10", color: "text-emerald-600", border: "border-emerald-100/20" },
        { label: "Avg. CPL", val: "$10.08", detail: "Global average", icon: TrendingUp, bg: "bg-amber-50/10", color: "text-amber-600", border: "border-amber-100/20" },
        { label: "Click Through", val: "3.24%", detail: "All campaigns", icon: MousePointer2, bg: "bg-indigo-50/10", color: "text-indigo-600", border: "border-indigo-100/20" },
    ]

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-blue-600">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
                                <Target className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Paid Ad Ingestion & ROI
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Connect your ad managers to sync lead forms and ingest cost data. Match lead acquisition costs directly to pipeline value for true ROI tracking.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-bold text-[11px] px-5 uppercase tracking-widest">
                        <RefreshCw className={`h-4 w-4 mr-2 text-slate-400 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} /> Refresh Spend Data
                    </Button>
                    <Button onClick={() => setShowConnectModal(true)} className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-blue-100 shadow-lg border-none uppercase text-[11px] tracking-widest">
                        <Plus className="h-4 w-4 mr-2" /> Connect Ad Account
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

                {/* Accounts List */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Connected Ad Managers</h2>
                        <Button variant="ghost" className="h-8 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-50">Attribution Rules <ExternalLink size={12} className="ml-1.5" /></Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {accounts.map((acc) => (
                            <Card key={acc.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white group hover:ring-blue-200 transition-all overflow-hidden p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div className="flex items-center gap-5 min-w-[280px]">
                                        <div className={`h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center ${acc.iconColor} group-hover:bg-blue-600 group-hover:text-white transition-all cursor-default shadow-sm relative`}>
                                            <BarChart size={24} />
                                            <div className={`absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${acc.health === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-[16px] font-semibold text-slate-900">{acc.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] font-black uppercase text-slate-400 border-slate-100 h-4.5 px-1.5">{acc.platform}</Badge>
                                                {acc.status === 'Active' ? <div className="h-2 w-2 rounded-full bg-emerald-500" /> : <div className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-8 flex-1">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Leads Ingested</p>
                                            <h4 className="text-[15px] font-semibold text-slate-900 tabular-nums">{acc.leads.toLocaleString()}</h4>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Total Spend</p>
                                            <h4 className="text-[15px] font-semibold text-slate-900 tabular-nums">{acc.spend}</h4>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Avg Cost/Lead</p>
                                            <h4 className="text-[15px] font-semibold text-blue-600 tabular-nums">{acc.cpl}</h4>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 shrink-0">
                                        <Button size="icon" variant="ghost" onClick={() => toast({ title: "Account Settings", description: "Configuring form mapping for " + acc.name })} className="h-10 w-10 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl">
                                            <Settings2 size={18} />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleDelete(acc.id)} className="h-10 w-10 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl">
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Tracking & Attribution Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-950 text-white p-8 space-y-7 relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10">
                            <Target size={120} />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h4 className="text-[16px] font-black uppercase tracking-tight text-blue-400 flex items-center gap-2">
                                <Zap className="h-5 w-5 fill-blue-400" /> Sync Intelligence
                            </h4>
                            <p className="text-[12px] text-slate-400 font-medium">Automatic protocols for real-time form ingestion.</p>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold">Auto-Sync Lead Forms</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Native platform lead gen forms</p>
                                </div>
                                <Switch checked={true} className="data-[state=checked]:bg-blue-500" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold">UTM Capture Rule</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Auto-mapping to source fields</p>
                                </div>
                                <Switch checked={true} className="data-[state=checked]:bg-blue-500" />
                            </div>
                        </div>
                        <Button className="w-full h-12 bg-white text-slate-950 hover:bg-slate-100 font-black rounded-xl border-none uppercase text-[11px] tracking-widest mt-2 shadow-xl shadow-blue-500/10">
                            Attribution Settings
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white p-8 space-y-6">
                        <div className="space-y-1">
                            <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">Cost Integrity Score</h4>
                            <p className="text-[12px] text-slate-500 font-medium">Verifying spend data against live campaign logs.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex justify-between items-center text-[11px] font-black uppercase text-slate-500">
                                    <span>Ingestion Fidelity</span>
                                    <span className="text-blue-600 bg-white px-2 py-0.5 rounded-lg border border-blue-100">100%</span>
                                </div>
                                <Progress value={100} className="h-2 bg-white [&>div]:bg-blue-600 rounded-full" />
                            </div>
                            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3 shadow-inner">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">Recent Pulse</span>
                                    <Badge className="bg-white text-blue-600 border-blue-100 text-[9px] font-black uppercase">Success</Badge>
                                </div>
                                <p className="text-[11px] text-blue-700 font-bold leading-relaxed uppercase tracking-tighter">Successfully updated budgets for **12 active campaigns** (Google Search) at 4:32 PM.</p>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>

            {/* Connect Ad Account Modal */}
            {showConnectModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden relative">
                        <div className="absolute -top-10 -left-10 h-32 w-32 bg-blue-50 rounded-full blur-3xl opacity-50" />

                        <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                            <div className="h-16 w-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1 shadow-sm border border-blue-100">
                                <Target size={32} />
                            </div>
                            <h3 className="text-[26px] font-black text-slate-900 tracking-tight uppercase leading-none">Connect Paid Media</h3>
                            <p className="text-[13px] text-slate-500 font-medium italic">"Ingest forms and spend data for full-funnel ROI."</p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Advertising Hub</Label>
                                <Select defaultValue="facebook">
                                    <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700 shadow-sm border-none">
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                                        <SelectItem value="facebook" className="font-bold flex items-center gap-2">Meta Ads (FB/IG)</SelectItem>
                                        <SelectItem value="google" className="font-bold">Google Ads</SelectItem>
                                        <SelectItem value="linkedin" className="font-bold">LinkedIn Ads</SelectItem>
                                        <SelectItem value="tiktok" className="font-bold">TikTok Ads</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex gap-4">
                                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm shrink-0 border border-indigo-100">
                                    <ShieldCheck size={16} />
                                </div>
                                <p className="text-[11px] text-indigo-700 font-black leading-relaxed uppercase tracking-tighter self-center">
                                    This will authorize Fixl to read Ad Form responses and Campaign level spend data only.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 relative z-10">
                            <Button variant="ghost" onClick={() => setShowConnectModal(false)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50">Discard</Button>
                            <Button onClick={handleConnect} className="flex-1 h-14 bg-slate-950 text-white font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl shadow-blue-500/20">Authorize Account</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
