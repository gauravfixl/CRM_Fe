"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    MousePointer2,
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
    Globe,
    Eye,
    Target,
    Terminal,
    Copy,
    Fingerprint,
    Info,
    X,
    ShieldCheck,
    Lock
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
import { Progress } from "@/shared/components/ui/progress"
import { Label } from "@/shared/components/ui/label"

interface Pixel {
    id: string
    name: string
    status: "Active" | "Inactive"
    fired: string
    events: string[]
    lastFired: string
}

const INITIAL_PIXELS: Pixel[] = [
    { id: "PXL-001", name: "Meta Pixel", status: "Active", fired: "12,400 times", events: ["PageView", "Lead", "Submit"], lastFired: "Just now" },
    { id: "PXL-002", name: "Google Tag", status: "Active", fired: "45,200 times", events: ["all_pages"], lastFired: "2 mins ago" },
    { id: "PXL-003", name: "LinkedIn Insight", status: "Active", fired: "8,200 times", events: ["Conversion"], lastFired: "14 mins ago" },
]

export default function TrackingPixelsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [pixels, setPixels] = useState<Pixel[]>(INITIAL_PIXELS)
    const [showConfigureModal, setShowConfigureModal] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const trackingScript = `<script>
  (function(f,i,x,l){
    f.FixlSync = f.FixlSync || [];
    f.FixlSync.push({id: 'FXL_8271_AD'});
    var s=i.createElement('script');
    s.src='https://cdn.fixl.ai/track.js';
    i.head.appendChild(s);
  })(window,document);
</script>`

    useEffect(() => { setIsClient(true) }, [])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast({ title: "Snippet Copied", description: "Master tracking script is ready for deployment." })
    }

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => {
            setIsRefreshing(false)
            toast({ title: "Signal Pulse Verified", description: "Successfully pinged 4 active tracker instances." })
        }, 1200)
    }

    const handleConfigure = () => {
        const newPixel: Pixel = {
            id: `PXL-00${pixels.length + 1}`,
            name: "TikTok Pixel Master",
            status: "Active",
            fired: "0 times",
            events: ["InitiateCheckout"],
            lastFired: "Now"
        }
        setPixels([...pixels, newPixel])
        setShowConfigureModal(false)
        toast({ title: "Tracker Provisioned", description: "Please whitelist the destination domain in Identity Settings." })
    }

    const STAT_CARDS = [
        { label: "Daily Impressions", val: "124.2k", detail: "Global footprint", icon: Globe, bg: "bg-teal-50/40", color: "text-teal-600", border: "border-teal-100/60" },
        { label: "Active Pixels", val: "8 Instances", detail: "Deployment status", icon: Target, bg: "bg-indigo-50/40", color: "text-indigo-600", border: "border-indigo-100/60" },
        { label: "Fidelity Score", val: "99.2%", detail: "Signal integrity", icon: ShieldCheck, bg: "bg-emerald-50/40", color: "text-emerald-600", border: "border-emerald-100/60" },
        { label: "Script Latency", val: "12ms", detail: "CDN edge speed", icon: Zap, bg: "bg-amber-50/40", color: "text-amber-600", border: "border-amber-100/60" },
    ]

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-teal-600">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-teal-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 shadow-sm">
                                <Activity className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900 uppercase">
                                Tracking & Pixel Intelligence
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Deploy behavioral tracking across your web properties. Identify anonymous visitors, track form abandonment, and enrich lead scoring with digital intent signals.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-bold text-[11px] px-5 uppercase tracking-widest">
                        <RefreshCw className={`h-4 w-4 mr-2 text-slate-400 ${isRefreshing ? 'animate-spin text-teal-500' : ''}`} /> Verify Signals
                    </Button>
                    <Button onClick={() => setShowConfigureModal(true)} className="h-10 bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 shadow-teal-100 shadow-lg border-none uppercase text-[11px] tracking-widest">
                        <Plus className="h-4 w-4 mr-2" /> Configure Pixel
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

                {/* Deployment Area */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white overflow-hidden p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-1">
                            <h3 className="text-[17px] font-semibold text-slate-900">Master Tracking Snippet</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Install this global script in the raw {`<head>`} section of your web properties.</p>
                        </div>
                        <Button onClick={() => copyToClipboard(trackingScript)} variant="outline" className="h-10 border-slate-200 text-teal-600 font-black text-[11px] rounded-xl hover:bg-teal-50 px-5 uppercase tracking-widest">
                            <Copy className="h-3 w-3 mr-2" /> Copy to Clipboard
                        </Button>
                    </div>

                    <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl relative group flex-1">
                        <div className="absolute top-6 right-8 text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-lg">SDK Loader / v2.4</div>
                        <pre className="text-[14px] font-mono text-teal-400 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
                            {trackingScript}
                        </pre>
                    </div>

                    <div className="mt-8 p-6 rounded-2xl bg-teal-50/50 border border-teal-100 flex items-center gap-5">
                        <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-teal-600 shrink-0 shadow-sm border border-teal-100">
                            <CheckCircle2 size={24} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[14px] font-black text-teal-900 uppercase tracking-tight">Deployment Verified</h4>
                            <p className="text-[12px] text-teal-700 font-medium italic">"Script acknowledged on **fixl.solutions**, **app.fixl.ai**, and 2 secondary nodes."</p>
                        </div>
                    </div>
                </Card>

                {/* Tracking Events Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-slate-950 text-white p-8 space-y-7 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Fingerprint size={120} />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h4 className="text-[16px] font-black uppercase tracking-tight text-teal-400">Identity Resolution</h4>
                            <p className="text-[12px] text-slate-400 font-medium leading-relaxed">Sophisticated user stitching across multiple devices and browser sessions.</p>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold">Fingerprinting</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Capture device-level signals</p>
                                </div>
                                <Switch checked={true} className="data-[state=checked]:bg-teal-500" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold">Behavioral Scoring</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Weight intent by dwell time</p>
                                </div>
                                <Switch checked={true} className="data-[state=checked]:bg-teal-500" />
                            </div>
                        </div>
                        <Button onClick={() => toast({ title: "Privacy & Consent", description: "Opening GDPR/CCPA compliance settings for tracking pixels." })} className="w-full h-12 bg-white text-slate-950 hover:bg-slate-100 font-black rounded-xl border-none uppercase text-[11px] tracking-widest mt-2">
                            Privacy & Consent Guard
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-7 space-y-4 border-b-4 border-b-teal-500">
                        <div className="flex items-center gap-2 text-teal-600">
                            <Info size={18} />
                            <h4 className="text-[12px] font-black uppercase tracking-widest">Protocol Tip</h4>
                        </div>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium italic">
                            "Enable **Form Abandonment** tracking to capture partial lead data before the user exits. Expected uplift: **+18.4% Lead Vol**."
                        </p>
                    </Card>
                </div>

                {/* External Pixels List */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-8 px-2">
                        <div className="space-y-1">
                            <h3 className="text-[17px] font-black text-slate-900 uppercase tracking-tight">External Payload Delivery (Ad Pixels)</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Mirror internal conversion events to external platform pixels for AI-driven bidding optimization.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pixels.map((px) => (
                            <div key={px.id} className="p-7 rounded-[32px] bg-slate-50/50 border border-slate-100 hover:border-teal-200 hover:bg-white hover:shadow-2xl hover:shadow-teal-100/50 transition-all space-y-6 group relative">
                                <div className="flex items-start justify-between">
                                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-all shadow-sm">
                                        <Target size={26} />
                                    </div>
                                    <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 h-6 px-3 text-[10px] font-black uppercase tracking-wider">Operational</Badge>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[18px] font-black text-slate-900 uppercase tracking-tight">{px.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                                        <p className="text-[11px] text-teal-600 font-black uppercase tracking-widest leading-none">Payload Count: {px.fired}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {px.events.map((e, idx) => (
                                        <Badge key={idx} variant="outline" className="bg-white text-[9px] font-bold text-slate-400 border-slate-200 px-2 py-0.5 rounded-lg">{e}</Badge>
                                    ))}
                                    <Badge variant="outline" className="bg-white text-[9px] font-bold text-teal-400 border-teal-100 px-2 py-0.5 rounded-lg border-dashed">+ Tracking</Badge>
                                </div>
                                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Heartbeat: {px.lastFired}</span>
                                    <div className="flex items-center gap-1">
                                        <Button onClick={() => toast({ title: "Pixel Settings", description: `Configuring events for ${px.name}` })} size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-xl"><Settings2 size={16} /></Button>
                                        <Button onClick={() => { setPixels(pixels.filter(p => p.id !== px.id)); toast({ title: "Pixel Removed", description: `${px.name} deactivated.` }); }} size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl"><Trash2 size={16} /></Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

            </div>

            {/* Configure Pixel Modal */}
            {showConfigureModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100 overflow-hidden relative">
                        <div className="absolute -top-10 -left-10 h-32 w-32 bg-teal-50 rounded-full blur-3xl opacity-50" />

                        <div className="flex flex-col items-center text-center space-y-3 relative z-10">
                            <div className="h-16 w-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mb-1 shadow-sm border border-teal-100">
                                <Target size={32} />
                            </div>
                            <h3 className="text-[26px] font-black text-slate-900 tracking-tight uppercase leading-none">Activate Node</h3>
                            <p className="text-[13px] text-slate-500 font-medium italic">"Provision a new tracking vector for your digital domain."</p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Tracker Destination</Label>
                                <Input placeholder="e.g. TikTok Alpha Pixel" className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-5 font-bold text-slate-700" />
                            </div>

                            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-4 w-4 text-teal-400" />
                                        <span className="text-[11px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-lg">Target Scope</span>
                                    </div>
                                    <Badge className="bg-teal-500 text-white border-none text-[9px]">Global</Badge>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                                    This will authorize the Master Script to relay data packets to the specified platform via secure S2S bridge.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 relative z-10">
                            <Button variant="ghost" onClick={() => setShowConfigureModal(false)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50">Discard</Button>
                            <Button onClick={handleConfigure} className="flex-1 h-14 bg-slate-950 text-white font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl shadow-teal-500/10">Authorize Node</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
