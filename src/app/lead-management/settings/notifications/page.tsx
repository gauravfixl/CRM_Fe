"use client"

import React, { useState, useEffect } from "react"
import {
    Activity, AlertTriangle, Bell, CheckCircle2, Clock, Globe, Mail, MessageSquare, Moon, MoreHorizontal, Pencil, Plus, Search, ShieldAlert, Slack, Smartphone, ToggleLeft, Trash2, X, Zap
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

interface NotifRule {
    id: string
    event: string
    trigger: string
    channels: string[]
    active: boolean
}

const INITIAL_RULES: NotifRule[] = [
    { id: "NR1", event: "SLA Breach", trigger: "Lead idle > 48h", channels: ["Email", "Slack"], active: true },
    { id: "NR2", event: "High Score Lead", trigger: "Score ≥ 85", channels: ["Email", "SMS"], active: true },
    { id: "NR3", event: "Stage Advanced", trigger: "Pipeline move", channels: ["In-App"], active: true },
    { id: "NR4", event: "New Assignment", trigger: "Lead owner set", channels: ["Email", "In-App"], active: false },
    { id: "NR5", event: "Win Closed", trigger: "Status = Won", channels: ["Slack", "Email", "SMS"], active: true },
]

const CHANNELS = [
    { name: "Email", icon: <Mail size={14} />, status: "Operational", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
    { name: "In-App", icon: <Bell size={14} />, status: "Operational", bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
    { name: "SMS", icon: <Smartphone size={14} />, status: "Operational", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    { name: "Slack", icon: <MessageSquare size={14} />, status: "Degraded", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
]

const STAT_CARDS = [
    { label: "Alert Rules", value: "8", sub: "Currently active", icon: Bell, bg: "bg-orange-50/10", text: "text-orange-600", border: "border-orange-100/20" },
    { label: "Channels", value: "4", sub: "Operational hubs", icon: Globe, bg: "bg-blue-50/10", text: "text-blue-600", border: "border-blue-100/20" },
    { label: "Escalations", value: "2", sub: "High priority", icon: ShieldAlert, bg: "bg-rose-50/10", text: "text-rose-600", border: "border-rose-100/20" },
    { label: "Dispatch Rate", value: "99.9%", sub: "SLA delivery", icon: Zap, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
]

const ALL_CHANNELS = ["Email", "SMS", "In-App", "Slack"]

export default function NotificationsPage() {
    const { toast } = useToast()
    const [isClient, setIsClient] = useState(false)
    const [rules, setRules] = useState<NotifRule[]>(INITIAL_RULES)
    const [quietHours, setQuietHours] = useState(false)
    const [failureAlert, setFailureAlert] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [editRule, setEditRule] = useState<NotifRule | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<NotifRule | null>(null)
    const [newRule, setNewRule] = useState({ event: "", trigger: "", channels: [] as string[] })

    useEffect(() => { setIsClient(true) }, [])

    const handleToggle = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r))
    }

    const handleToggleChannel = (channels: string[], ch: string): string[] =>
        channels.includes(ch) ? channels.filter(c => c !== ch) : [...channels, ch]

    const handleAdd = () => {
        if (!newRule.event || !newRule.trigger) { toast({ title: "Event and trigger required" }); return }
        if (newRule.channels.length === 0) { toast({ title: "Select at least one channel" }); return }
        const entry: NotifRule = { id: `NR${Date.now()}`, ...newRule, active: true }
        setRules([...rules, entry])
        setShowAddModal(false)
        setNewRule({ event: "", trigger: "", channels: [] })
        toast({ title: "✅ Rule Created", description: `"${entry.event}" rule is now active.` })
    }

    const handleSaveEdit = () => {
        if (!editRule) return
        setRules(rules.map(r => r.id === editRule.id ? editRule : r))
        setEditRule(null)
        toast({ title: "Rule Updated" })
    }

    const handleDelete = (r: NotifRule) => {
        setRules(rules.filter(x => x.id !== r.id))
        setDeleteConfirm(null)
        toast({ title: "Rule Removed" })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-orange-500">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-50 text-orange-600 border border-orange-100"><Bell className="h-5 w-5" /></div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                            Global Notification Hub
                        </h1>
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium">Configure routing rules, channels, and alert governance for your team.</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="h-10 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 border-none uppercase text-[11px] tracking-widest shadow-lg shadow-orange-100">
                    <Plus className="h-4 w-4 mr-2" /> New Rule
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-2xl p-5 shadow-none space-y-3`}>
                        <div className={`h-9 w-9 rounded-xl bg-white flex items-center justify-center ${s.text} shadow-sm`}><s.icon size={18} /></div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[18px] font-semibold ${s.text}`}>{s.value}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Channel Health */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CHANNELS.map((ch, i) => (
                    <Card key={i} className={`border border-slate-100 ${ch.bg} rounded-2xl p-5 shadow-none`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className={`h-9 w-9 rounded-xl bg-white flex items-center justify-center ${ch.text} shadow-sm`}>{ch.icon}</div>
                            <div className={`h-2 w-2 rounded-full ${ch.dot} ${ch.status === 'Operational' ? 'animate-pulse' : ''}`} />
                        </div>
                        <p className="text-[12px] font-black text-slate-900">{ch.name}</p>
                        <p className={`text-[10px] font-bold uppercase ${ch.status === 'Operational' ? 'text-emerald-600' : 'text-amber-600'}`}>{ch.status}</p>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Rules List */}
                <Card className="lg:col-span-9 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-4">
                    <h3 className="text-[16px] font-black text-slate-900">Active Routing Rules</h3>
                    {rules.map(r => (
                        <div key={r.id} className={`p-5 rounded-2xl border transition-all ${r.active ? 'bg-white border-slate-100 hover:border-orange-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                            <div className="flex items-start gap-5">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[14px] font-bold text-slate-900">{r.event}</span>
                                        {!r.active && <Badge className="bg-slate-100 text-slate-400 border-none text-[9px] font-black uppercase">Paused</Badge>}
                                    </div>
                                    <p className="text-[12px] text-slate-500 font-medium">Trigger: <em>{r.trigger}</em></p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {r.channels.map(ch => (
                                            <Badge key={ch} className="bg-orange-50 text-orange-600 border-none text-[9px] font-black uppercase">{ch}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Switch checked={r.active} onCheckedChange={() => handleToggle(r.id)} className="data-[state=checked]:bg-orange-500" />
                                    <Button size="icon" variant="ghost" onClick={() => setEditRule({ ...r })} className="h-8 w-8 text-slate-300 hover:text-amber-500 rounded-lg"><Pencil size={14} /></Button>
                                    <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(r)} className="h-8 w-8 text-slate-300 hover:text-rose-500 rounded-lg"><Trash2 size={14} /></Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </Card>

                {/* Governance Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-7 space-y-6">
                        <h4 className="text-[14px] font-black">Global Controls</h4>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Moon size={14} className="text-slate-400" />
                                        <span className="text-[12px] font-bold">Quiet Hours</span>
                                    </div>
                                    <Switch checked={quietHours} onCheckedChange={(v) => { setQuietHours(v); toast({ title: v ? "Quiet Hours On" : "Quiet Hours Off" }) }} className="data-[state=checked]:bg-orange-500" />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">Suppress non-critical alerts 10pm–8am.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle size={14} className="text-slate-400" />
                                        <span className="text-[12px] font-bold">Failure Alerts</span>
                                    </div>
                                    <Switch checked={failureAlert} onCheckedChange={setFailureAlert} className="data-[state=checked]:bg-rose-500" />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">Always alert on channel delivery failures.</p>
                            </div>
                        </div>
                        <Button onClick={() => toast({ title: "✅ Control Settings Saved" })} className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl border-none text-[11px] uppercase tracking-widest">Save Controls</Button>
                    </Card>
                </div>
            </div>

            {/* Add Rule Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[18px] font-black text-slate-900">New Notification Rule</h2>
                            <Button size="icon" variant="ghost" onClick={() => setShowAddModal(false)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Event Name</Label>
                                <Input placeholder="e.g. Meeting Missed" value={newRule.event} onChange={e => setNewRule({ ...newRule, event: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Trigger Condition</Label>
                                <Input placeholder="e.g. Task overdue > 24h" value={newRule.trigger} onChange={e => setNewRule({ ...newRule, trigger: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Delivery Channels</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {ALL_CHANNELS.map(ch => (
                                        <button key={ch} onClick={() => setNewRule({ ...newRule, channels: handleToggleChannel(newRule.channels, ch) })}
                                            className={`px-4 py-2 rounded-xl text-[12px] font-black border transition-all ${newRule.channels.includes(ch) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
                                            {ch}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1 h-11 rounded-xl border-slate-100 font-bold">Cancel</Button>
                            <Button onClick={handleAdd} className="flex-1 h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl border-none">Create Rule</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Rule Modal */}
            {editRule && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[18px] font-black text-slate-900">Edit Rule</h2>
                            <Button size="icon" variant="ghost" onClick={() => setEditRule(null)} className="h-8 w-8 text-slate-400 rounded-xl"><X size={16} /></Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Event Name</Label>
                                <Input value={editRule.event} onChange={e => setEditRule({ ...editRule, event: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Trigger Condition</Label>
                                <Input value={editRule.trigger} onChange={e => setEditRule({ ...editRule, trigger: e.target.value })} className="h-11 rounded-xl border-slate-100 bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Channels</Label>
                                <div className="flex gap-2 flex-wrap">
                                    {ALL_CHANNELS.map(ch => (
                                        <button key={ch} onClick={() => setEditRule({ ...editRule, channels: handleToggleChannel(editRule.channels, ch) })}
                                            className={`px-4 py-2 rounded-xl text-[12px] font-black border transition-all ${editRule.channels.includes(ch) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}>
                                            {ch}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" onClick={() => setEditRule(null)} className="flex-1 h-11 rounded-xl border-slate-100 font-bold">Cancel</Button>
                            <Button onClick={handleSaveEdit} className="flex-1 h-11 bg-slate-900 text-white font-bold rounded-xl border-none">Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
                        <div className="h-14 w-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600"><Trash2 size={26} /></div>
                        <div>
                            <h2 className="text-[18px] font-black text-slate-900">Delete Rule?</h2>
                            <p className="text-[13px] text-slate-500 font-medium">"{deleteConfirm.event}" rule will be permanently removed.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 h-11 rounded-xl font-bold">Cancel</Button>
                            <Button onClick={() => handleDelete(deleteConfirm)} className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl border-none">Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
