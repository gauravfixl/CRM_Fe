"use client"

import React, { useState, useEffect } from "react"
import {
    Activity, ShieldCheck, FileSearch, Trash2, Download, Search,
    MoreHorizontal, Filter, Save, Globe, Lock, User, Terminal,
    Database, CheckCircle2, AlertTriangle, ArrowUpRight, History, X
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"

interface AuditEvent {
    id: string
    event: string
    user: string
    target: string
    ip: string
    time: string
    severity: "Low" | "Medium" | "High" | "Critical"
}

const INITIAL_EVENTS: AuditEvent[] = [
    { id: "A-501", event: "User Permission Change", user: "David Brown", target: "Sarah Miller (Role: Admin)", ip: "192.168.1.45", time: "2m ago", severity: "High" },
    { id: "A-502", event: "Data Export Initiated", user: "James Wilson", target: "Lead Master (CSV)", ip: "103.45.21.11", time: "14h ago", severity: "Medium" },
    { id: "A-503", event: "API Key Generated", user: "David Brown", target: "Main Backend (Prod)", ip: "192.168.1.45", time: "1 day ago", severity: "Critical" },
    { id: "A-504", event: "Schema Modification", user: "Emily Davis", target: "Lead Object (Custom Field)", ip: "172.16.0.8", time: "3 days ago", severity: "High" },
    { id: "A-505", event: "Retention Policy Update", user: "Michael Cheng", target: "Auto-Archive (365d)", ip: "192.168.1.12", time: "Mar 18", severity: "Low" },
]

const STAT_CARDS = [
    { label: "Immutable Logs", value: "142k", sub: "Total hash entries", icon: History, bg: "bg-slate-50/10", text: "text-slate-600", border: "border-slate-100/20" },
    { label: "Compliance Score", value: "94%", sub: "Global readiness", icon: ShieldCheck, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
    { label: "Storage Life", value: "7 Years", sub: "Retention policy", icon: Database, bg: "bg-blue-50/10", text: "text-blue-600", border: "border-blue-100/20" },
    { label: "DPO Requests", value: "0", sub: "Pending review", icon: Terminal, bg: "bg-indigo-50/10", text: "text-indigo-600", border: "border-indigo-100/20" },
]

export default function AuditCompliancePage() {
    const { toast } = useToast()
    const [isClient, setIsClient] = useState(false)
    const [gdprMode, setGdprMode] = useState(true)
    const [fieldHistory, setFieldHistory] = useState(true)
    const [search, setSearch] = useState("")
    const [events, setEvents] = useState<AuditEvent[]>(INITIAL_EVENTS)
    const [retentionPeriod, setRetentionPeriod] = useState("5yr")

    useEffect(() => { setIsClient(true) }, [])

    const filtered = events.filter(e =>
        e.event.toLowerCase().includes(search.toLowerCase()) ||
        e.user.toLowerCase().includes(search.toLowerCase())
    )

    const handleExportLedger = () => {
        toast({ title: "Compliance Data Exported", description: "Audit trail from last 30 days is ready. (SHA-256 Verified)" })
    }

    const handleGenerateReport = () => {
        toast({ title: "Report Generating...", description: "Building data portability and access report for DPO review." })
    }

    const handleUpdatePolicy = () => {
        toast({ title: "Policy Updated", description: `Data retention cycle set to ${retentionPeriod === 'none' ? 'Unlimited' : retentionPeriod}.` })
    }

    const handleReviewAccess = () => {
        toast({ title: "Access Rights Review", description: "Loading permission matrix for high-risk export accounts..." })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-slate-900">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-900 text-white border border-slate-800"><Terminal className="h-5 w-5" /></div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                            Audit Ledger & Compliance
                        </h1>
                    </div>
                    <p className="text-[13px] text-slate-500 font-medium tracking-tight">Verifiable immutable records of all administrative actions and compliance readiness.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleExportLedger} className="h-10 border-slate-200 font-bold text-[11px] px-5 uppercase tracking-widest bg-white">
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export Ledger
                    </Button>
                    <Button onClick={handleGenerateReport} className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 border-none uppercase text-[11px] tracking-widest shadow-lg shadow-slate-200">
                        <ShieldCheck className="h-4 w-4 mr-2" /> Compliance Audit
                    </Button>
                </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Event Ledger */}
                <Card className="lg:col-span-9 border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8 flex flex-col">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-[17px] font-semibold text-slate-900">Governance Event Ledger</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Immutable stream of administrative activities.</p>
                        </div>
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                            <Input placeholder="Search user or event..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 rounded-xl border-slate-100 bg-slate-50 text-[12px]" />
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-50 hover:bg-transparent">
                                {["Event Signature", "Actor", "Context / Target", "Audit Context", "Risk Level"].map(h => (
                                    <TableHead key={h} className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-4">{h}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((e) => (
                                <TableRow key={e.id} className="border-slate-50 hover:bg-slate-50/60 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-900 group-hover:border-slate-300 transition-colors">
                                                <History size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-900">{e.event}</p>
                                                <p className="text-[10px] font-mono text-slate-400">{e.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center font-black text-[9px]">{e.user.split(' ').map(n => n[0]).join('')}</div>
                                            <span className="text-[12px] font-bold">{e.user}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><p className="text-[12px] font-medium text-slate-500 max-w-[200px] truncate">{e.target}</p></TableCell>
                                    <TableCell>
                                        <div className="space-y-0.5">
                                            <p className="text-[12px] font-bold text-slate-900">{e.time}</p>
                                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{e.ip}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`border-none h-5 px-2 text-[9px] font-black uppercase ${e.severity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                                            e.severity === 'High' ? 'bg-rose-50 text-rose-600' :
                                                e.severity === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {e.severity}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filtered.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-30">
                            <FileSearch size={48} className="text-slate-200 mb-4" />
                            <p className="text-[14px] font-black text-slate-400 uppercase">Audit Record Missing</p>
                        </div>
                    )}
                </Card>

                {/* Sidebar Controls */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-7 space-y-6">
                        <h4 className="text-[14px] font-black uppercase tracking-tight">Compliance Advisor</h4>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[12px] font-bold text-slate-300">GDPR Privacy Hub</span>
                                    <Switch checked={gdprMode} onCheckedChange={(v) => { setGdprMode(v); toast({ title: v ? "Privacy Safe Mode ON" : "Global Privacy Relaxed" }) }} className="data-[state=checked]:bg-emerald-500" />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">Enable right-to-forget and data portability UI.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[12px] font-bold text-slate-300">Field-Level History</span>
                                    <Switch checked={fieldHistory} onCheckedChange={setFieldHistory} className="data-[state=checked]:bg-blue-500" />
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium">Record every change to individual field values.</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-3 border-t border-white/5">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Retention Period</Label>
                            <Select value={retentionPeriod} onValueChange={setRetentionPeriod}>
                                <SelectTrigger className="h-10 rounded-xl border-white/10 bg-white/5 font-black text-[12px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1yr">12 Months (Fiscal)</SelectItem>
                                    <SelectItem value="5yr">5 Years (Regulatory)</SelectItem>
                                    <SelectItem value="none">Infinite (Legacy Ledger)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleUpdatePolicy} className="w-full h-10 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl border-none text-[11px] uppercase tracking-widest">Update Policy</Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-7 space-y-4">
                        <div className="flex items-center gap-2 text-rose-600">
                            <AlertTriangle size={16} /><h4 className="text-[12px] font-black uppercase">Data Visibility Risk</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                            <strong className="text-slate-900">3</strong> accounts currently have "Export Ledgers" permission but have not used it in 90 days.
                        </p>
                        <Button variant="link" onClick={handleReviewAccess} className="p-0 h-auto text-[10px] font-black uppercase text-indigo-600">Review Access Rights →</Button>
                    </Card>
                </div>

            </div>
        </div>
    )
}
