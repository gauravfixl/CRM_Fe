"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    MessageCircle,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Mail,
    Phone,
    Video,
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
    MessageSquare,
    Globe,
    Slack,
    Chrome,
    Calendar,
    Mic,
    Share2,
    X,
    Smartphone,
    Signal,
    Headset
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

interface CommChannel {
    id: string
    name: string
    type: "Email Sync" | "Messaging" | "VoIP / Calling" | "Meetings"
    status: "Active" | "Error" | "Connecting"
    protocol: string
    stats: string
    lastActive: string
    health: "Healthy" | "Failed" | "Warning"
}

const INITIAL_CHANNELS: CommChannel[] = [
    { id: "COM-001", name: "Gmail / G-Suite", type: "Email Sync", status: "Active", protocol: "OAuth 2.0", stats: "2.4k Mails/Mo", lastActive: "Now", health: "Healthy" },
    { id: "COM-002", name: "WhatsApp API", type: "Messaging", status: "Active", protocol: "Twilio Bridge", stats: "820 Messages/Mo", lastActive: "14m ago", health: "Healthy" },
    { id: "COM-003", name: "RingCentral", type: "VoIP / Calling", status: "Error", protocol: "SIP/WebRTC", stats: "140 Calls/Mo", lastActive: "2 days ago", health: "Failed" },
    { id: "COM-004", name: "Zoom Video", type: "Meetings", status: "Active", protocol: "Native Webhook", stats: "24 Demos/Mo", lastActive: "5h ago", health: "Healthy" },
]

export default function CommunicationChannelsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [channels, setChannels] = useState<CommChannel[]>(INITIAL_CHANNELS)
    const [showActivateModal, setShowActivateModal] = useState(false)
    const [isResyncing, setIsResyncing] = useState(false)

    useEffect(() => { setIsClient(true) }, [])

    const handleResync = () => {
        setIsResyncing(true)
        setTimeout(() => {
            setIsResyncing(false)
            toast({ title: "Global Re-sync Initiated", description: "Fetching latest thread headers from all 4 connected protocols." })
        }, 1500)
    }

    const handleActivate = () => {
        const newChannel: CommChannel = {
            id: `COM-00${channels.length + 1}`,
            name: "Slack Connect",
            type: "Messaging",
            status: "Connecting",
            protocol: "OAuth 2.0",
            stats: "0 Messages/Mo",
            lastActive: "Just now",
            health: "Healthy"
        }
        setChannels([...channels, newChannel])
        setShowActivateModal(false)
        toast({ title: "Channel Initialized", description: "Please complete the OAuth handshake to start logging events." })
    }

    const handleDelete = (id: string) => {
        setChannels(channels.filter(c => c.id !== id))
        toast({ title: "Channel Deactivated", description: "Bi-directional sync disabled for this provider." })
    }

    const STAT_CARDS = [
        { label: "Active Channels", val: "4 Active", detail: "Email, WhatsApp, Phone", icon: Signal, bg: "bg-emerald-50/40", color: "text-emerald-600", border: "border-emerald-100/60" },
        { label: "Daily Contacted", val: "142 Leads", detail: "Across all channels", icon: Smartphone, bg: "bg-indigo-50/40", color: "text-indigo-600", border: "border-indigo-100/60" },
        { label: "Sync Latency", val: "420ms", detail: "Real-time delivery", icon: Zap, bg: "bg-amber-50/40", color: "text-amber-600", border: "border-amber-100/60" },
        { label: "Support Status", val: "L3 Pro", detail: "24/7 Monitoring", icon: Headset, bg: "bg-cyan-50/40", color: "text-cyan-600", border: "border-cyan-100/60" },
    ]

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-emerald-600">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900 uppercase">
                                Communication Channel Hub
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            The nervous system of your outreach. Sync emails, log calls, and capture chat history into a single unified lead timeline.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleResync} disabled={isResyncing} className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-bold text-[11px] px-5 uppercase tracking-widest">
                        <RefreshCw className={`h-4 w-4 mr-2 text-slate-400 ${isResyncing ? 'animate-spin text-emerald-500' : ''}`} /> Global Re-sync
                    </Button>
                    <Button onClick={() => setShowActivateModal(true)} className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 shadow-emerald-100 shadow-lg border-none uppercase text-[11px] tracking-widest">
                        <Plus className="h-4 w-4 mr-2" /> Activate Channel
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

                {/* Active Channels Grid */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {channels.map((ch) => (
                        <Card key={ch.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden group hover:ring-emerald-100 transition-all p-7 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className={`p-4 rounded-2xl ${ch.health === 'Healthy' ? 'bg-slate-50 text-slate-400' : 'bg-rose-50 text-rose-500'} group-hover:bg-emerald-600 group-hover:text-white transition-all cursor-default shadow-sm border border-slate-100`}>
                                    {ch.type === 'Email Sync' ? <Mail size={24} /> : ch.type === 'Messaging' ? <MessageSquare size={24} /> : ch.type === 'Meetings' ? <Video size={24} /> : <Phone size={24} />}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={`border-none h-5 px-2 text-[9px] font-black uppercase tracking-wider ${ch.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                        {ch.status}
                                    </Badge>
                                    <div className="flex items-center">
                                        <Button size="icon" variant="ghost" onClick={() => toast({ title: "Channel Settings", description: "Opening advanced routing for " + ch.name })} className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-xl">
                                            <Settings2 size={16} />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleDelete(ch.id)} className="h-9 w-9 text-slate-300 hover:text-rose-500 rounded-xl">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-[18px] font-semibold text-slate-900 tracking-tight">{ch.name}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50/50 px-2 py-0.5 rounded-lg border border-emerald-100/50">{ch.type}</span>
                                    <span className="text-slate-200">•</span>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{ch.protocol}</span>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Throughput</p>
                                    <p className="text-[14px] font-black text-slate-900 tabular-nums">{ch.stats}</p>
                                </div>
                                <div className="text-right space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Activity Heartbeat</p>
                                    <p className="text-[12px] font-bold text-slate-600">{ch.lastActive}</p>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {/* Add More Shadow Card */}
                    <div
                        onClick={() => setShowActivateModal(true)}
                        className="border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30 flex flex-col items-center justify-center p-8 gap-3 cursor-pointer hover:bg-emerald-50/30 hover:border-emerald-200 transition-all group min-h-[220px]"
                    >
                        <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                            <Plus size={24} />
                        </div>
                        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600">Provision New Channel</p>
                    </div>
                </div>

                {/* Right Sidebar: Governance & Health */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-8 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Mic size={100} />
                        </div>
                        <div className="space-y-1 relative z-10">
                            <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Conversation Intelligence</p>
                            <h3 className="text-[20px] font-black tracking-tight leading-tight">Transcription & Logging Engine</h3>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold">Auto-log Sessions</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Capture video meeting notes</p>
                                </div>
                                <Switch checked={true} className="data-[state=checked]:bg-indigo-500" />
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold">Two-way Email</p>
                                    <p className="text-[10px] text-slate-500 font-medium">Sync replies back to CRM</p>
                                </div>
                                <Switch checked={true} className="data-[state=checked]:bg-indigo-500" />
                            </div>
                        </div>
                        <Button className="w-full h-11 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl border-none uppercase text-[11px] tracking-widest shadow-xl">
                            Privacy & Compliance
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-7 space-y-6">
                        <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">System Sync Health</h4>
                        <div className="flex items-center justify-center p-8 bg-slate-50 rounded-3xl relative">
                            <div className="h-32 w-32 rounded-full border-[10px] border-emerald-100 flex flex-col items-center justify-center border-t-emerald-500 animate-in">
                                <h2 className="text-[32px] font-black text-emerald-600 leading-none">94</h2>
                                <p className="text-[10px] font-black text-emerald-300 uppercase mt-1 tracking-widest">Grade A</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Email Reliability", score: "99%", color: "text-emerald-500" },
                                { label: "VoIP Latency", score: "24ms", color: "text-indigo-500" },
                                { label: "Chat Retention", score: "100%", color: "text-amber-500" },
                            ].map((s, i) => (
                                <div key={i} className="flex justify-between items-center text-[12px] p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                    <span className="font-bold text-slate-500 uppercase tracking-tight">{s.label}</span>
                                    <span className={`font-black ${s.color} bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm`}>{s.score}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

            </div>

            {/* Activate Channel Modal */}
            {showActivateModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex flex-col items-center text-center space-y-2">
                            <div className="h-16 w-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1 shadow-sm">
                                <Signal size={32} />
                            </div>
                            <h3 className="text-[24px] font-black text-slate-900 tracking-tight uppercase leading-none">Provision Channel</h3>
                            <p className="text-[13px] text-slate-500 font-medium italic">"Activate real-time communication logging."</p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Channel Provider</Label>
                                <Select defaultValue="slack">
                                    <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700">
                                        <SelectValue placeholder="Select platform" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        <SelectItem value="outlook" className="font-bold">Microsoft Outlook</SelectItem>
                                        <SelectItem value="slack" className="font-bold">Slack Enterprise</SelectItem>
                                        <SelectItem value="twilio" className="font-bold">Twilio SMS/VoIP</SelectItem>
                                        <SelectItem value="teams" className="font-bold">Microsoft Teams</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <Button variant="ghost" onClick={() => setShowActivateModal(false)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50">Back</Button>
                            <Button onClick={handleActivate} className="flex-1 h-14 bg-slate-900 text-white font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl shadow-slate-200">Request Access</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
