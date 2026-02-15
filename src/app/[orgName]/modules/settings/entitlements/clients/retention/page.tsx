"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Database,
    ShieldAlert,
    Clock,
    History,
    FileSearch,
    RefreshCcw,
    AlertCircle,
    CheckCircle2,
    Lock,
    HardDrive,
    Trash2,
    Calendar,
    ArrowRight,
    Search,
    ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function ClientDataRetentionPage() {
    const [retentionYears, setRetentionYears] = useState([7])
    const [isScanning, setIsScanning] = useState(false)
    const [stats, setStats] = useState({
        atRisk: 12,
        archivedCount: 1450,
        complianceScore: 94
    })

    const [policies, setPolicies] = useState({
        archiveFirst: true,
        legalHold: true,
        gdprPurge: false,
        auditLogs: true
    })

    const handleScan = () => {
        setIsScanning(true)
        setTimeout(() => {
            setIsScanning(false)
            setStats(prev => ({
                ...prev,
                atRisk: Math.floor(Math.random() * 50) + 5
            }))
            toast.success("Client data audit completed")
        }, 1500)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Database className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Data Retention Engine</h1>
                            <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-black uppercase tracking-widest px-3">LEGAL COMPLIANCE</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Regulate the lifecycle of client records, contracts, and financial audit logs.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleScan}
                        disabled={isScanning}
                        className="h-10 border-zinc-200 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        {isScanning ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <FileSearch className="w-4 h-4 mr-2" />}
                        Scan Compliance Risk
                    </Button>
                    <Button
                        onClick={() => toast.success("Retention policies published")}
                        className="h-10 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-rose-100 active:scale-95 transition-all"
                    >
                        Save Configurations
                    </Button>
                </div>
            </div>

            {/* RETENTION INSIGHTS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Storage Cap</p>
                        <HardDrive className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">{retentionYears[0]} Years</p>
                        <p className="text-[10px] text-white">Standard Enterprise Window</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Records at Risk</p>
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-zinc-900 tracking-tighter">{stats.atRisk} Accounts</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Pending Purge</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Archived Vault</p>
                        <History className="w-4 h-4 text-zinc-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{stats.archivedCount}</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Read-only Cold Storage</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Compliance Score</p>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{stats.complianceScore}%</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">GDPR & FINRA Compliant</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* CONFIGURATION SIDE */}
                <div className="lg:col-span-12">
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                            <div className="max-w-md">
                                <h3 className="text-lg font-black text-zinc-900 uppercase italic tracking-tight mb-2">Global Retention Window</h3>
                                <p className="text-sm text-zinc-400 font-bold leading-relaxed italic">Determine exactly how many years a client record remains in the primary system after the last activity.</p>
                            </div>
                            <div className="w-full md:w-80 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Selected Window</span>
                                    <span className="text-2xl font-black text-rose-600">{retentionYears[0]}Y</span>
                                </div>
                                <Slider
                                    value={retentionYears}
                                    onValueChange={setRetentionYears}
                                    max={12}
                                    min={1}
                                    step={1}
                                    className="mb-2"
                                />
                                <div className="flex justify-between text-[9px] font-bold text-zinc-300 uppercase italic">
                                    <span>01 Year</span>
                                    <span>12 Years</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-zinc-50">
                            <div className="space-y-6">
                                <PolicyToggle
                                    title="Archive Before Purge"
                                    description="Automated move to cold storage instead of permanent deletion."
                                    checked={policies.archiveFirst}
                                    onCheckedChange={(v: boolean) => setPolicies({ ...policies, archiveFirst: v })}
                                    icon={HardDrive}
                                />
                                <PolicyToggle
                                    title="Automatic Legal Hold"
                                    description="Prevent deletion of accounts that have active financial disputes."
                                    checked={policies.legalHold}
                                    onCheckedChange={(v: boolean) => setPolicies({ ...policies, legalHold: v })}
                                    icon={Lock}
                                />
                            </div>
                            <div className="space-y-6">
                                <PolicyToggle
                                    title="Regulatory Audit Trail"
                                    description="Generate immutable logs of every client data access event."
                                    checked={policies.auditLogs}
                                    onCheckedChange={(v: boolean) => setPolicies({ ...policies, auditLogs: v })}
                                    icon={FileSearch}
                                />
                                <PolicyToggle
                                    title="GDPR Right to Be Forgotten"
                                    description="Enable automated hooks for client deletion requests."
                                    checked={policies.gdprPurge}
                                    onCheckedChange={(v: boolean) => setPolicies({ ...policies, gdprPurge: v })}
                                    icon={ShieldAlert}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* HISTORICAL LOGS TABLE */}
                <div className="lg:col-span-12">
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-zinc-100 bg-zinc-50/20 flex items-center justify-between">
                            <h3 className="text-sm font-black text-zinc-900 uppercase italic tracking-widest">Recent Policy Enforcement</h3>
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-rose-600 italic">View All Logs →</Button>
                        </div>
                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Event ID</TableHead>
                                    <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Action Performed</TableHead>
                                    <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Target Entity</TableHead>
                                    <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Status</TableHead>
                                    <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Timestamp</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <EnforcementRow id="RT-9012" action="Auto-Archived" target="Starbucks Corp." status="SUCCESS" time="2h ago" />
                                <EnforcementRow id="RT-8991" action="Manual Purge" target="Individual (ID: 021)" status="SUCCESS" time="5h ago" />
                                <EnforcementRow id="RT-8872" action="Legal Hold Active" target="Global Logistics Ltd" status="LOCKED" time="1d ago" />
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PolicyToggle({ title, description, checked, onCheckedChange, icon: Icon }: any) {
    return (
        <div className="flex items-start justify-between p-4 rounded-2xl border border-zinc-100 hover:border-rose-100 transition-all group">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 group-hover:bg-rose-50 flex items-center justify-center text-zinc-400 group-hover:text-rose-600 transition-colors shadow-sm">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-xs font-black text-zinc-800 uppercase italic tracking-tight mb-1">{title}</h4>
                    <p className="text-[11px] text-zinc-400 font-bold leading-relaxed pr-4 italic">{description}</p>
                </div>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
                className="data-[state=checked]:bg-rose-600 mt-1 scale-90"
            />
        </div>
    )
}

function EnforcementRow({ id, action, target, status, time }: any) {
    return (
        <TableRow className="hover:bg-zinc-50/50 transition-colors">
            <TableCell className="py-4 px-6 font-bold text-xs text-zinc-400 font-mono">{id}</TableCell>
            <TableCell className="py-4 font-black text-xs text-zinc-800 italic uppercase">{action}</TableCell>
            <TableCell className="py-4 font-bold text-xs text-zinc-600">{target}</TableCell>
            <TableCell className="py-4 text-center">
                <Badge className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {status}
                </Badge>
            </TableCell>
            <TableCell className="py-4 text-right pr-6 text-xs text-zinc-400 font-bold italic">{time}</TableCell>
        </TableRow>
    )
}
