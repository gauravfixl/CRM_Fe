"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Clock,
    Plus,
    MoreVertical,
    Search,
    Filter,
    Archive,
    Trash2,
    ShieldAlert,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCcw,
    Edit3,
    History,
    Calendar,
    Database,
    AlertTriangle,
    FileSearch,
    Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"

export default function LeadDataRetentionPage() {
    const params = useParams()
    const [retentionMonths, setRetentionMonths] = useState([24])
    const [isLoading, setIsLoading] = useState(false)
    const [recordsAtRisk, setRecordsAtRisk] = useState(124)

    const [policies, setPolicies] = useState({
        autoPurge: false,
        archiveBeforePurge: true,
        gdprHook: true
    })

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1200)
    }

    const handleScan = () => {
        setIsLoading(true)
        setTimeout(() => {
            // Mock dynamic calculation based on slider
            const newVal = Math.floor(Math.random() * 500) + (60 - retentionMonths[0]) * 10
            setRecordsAtRisk(newVal)
            setIsLoading(false)
            toast.success("Impact scan complete: Found data for purge")
        }, 1500)
    }

    const impactData = [
        { id: "1", stage: "Lost Leads", count: 1240 - (retentionMonths[0] * 10), action: "Auto-Archive", status: "PENDING" },
        { id: "2", stage: "Unqualified Leads", count: 842 - (retentionMonths[0] * 5), action: "Auto-Delete", status: "ACTIVE" },
        { id: "3", stage: "Contacted (Inactive > 1yr)", count: 312, action: "Auto-Archive", status: "ACTIVE" },
        { id: "4", stage: "Won Leads", count: 2847, action: "Exempt (Stay Forever)", status: "SYSTEM" },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Lead Retention Policy</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-bold uppercase tracking-widest">Compliance</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Define data lifecycle rules for archiving and permanent deletion of lead records.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleScan}
                        disabled={isLoading}
                        className="h-10 border-zinc-200 text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all active:scale-95"
                    >
                        <FileSearch className={`w-4 h-4 mr-2 ${isLoading ? 'animate-bounce' : ''}`} />
                        Scan Impact
                    </Button>
                    <Button
                        onClick={() => handleAction("Retention policy updated for Org")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Save & Apply
                    </Button>
                </div>
            </div>

            {/* RETENTION INSIGHTS - 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Storage Cap</p>
                        <Database className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">{retentionMonths} Months</p>
                        <p className="text-[10px] text-white">Global retention window</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Records at Risk</p>
                        <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{recordsAtRisk} Items</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Pending purge cycle</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20_40_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Archived Data</p>
                        <Archive className="w-4 h-4 text-blue-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">1.2 GB</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Cold storage utilized</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Compliance Score</p>
                        <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-emerald-600">GDPR Ready</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Data lifecycle active</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* CONFIGURATION SECTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
                <div className="md:col-span-8 bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-6">
                        <div>
                            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest italic">Global Retention Window</h3>
                            <p className="text-[11px] text-zinc-400 font-medium mt-1">Adjust how long lead data persists after the last activity.</p>
                        </div>
                        <Badge className="bg-blue-600 text-white border-none font-black text-xs px-4 py-1 tracking-widest">{retentionMonths} MONTHS</Badge>
                    </div>

                    <div className="py-12 px-4">
                        <Slider
                            defaultValue={retentionMonths}
                            max={60}
                            min={6}
                            step={6}
                            onValueChange={setRetentionMonths}
                            className="w-full cursor-pointer"
                        />
                        <div className="flex justify-between mt-6 px-1">
                            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter italic">Min: 6 Months</span>
                            <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter italic">Max: 5 Years</span>
                        </div>
                    </div>

                    <div className="mt-8 bg-zinc-50/50 border border-dashed border-zinc-100 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <History className="w-4 h-4 text-zinc-400" />
                            <span className="text-xs font-black text-zinc-600 uppercase tracking-widest italic">Retention Impact Analysis</span>
                        </div>
                        <Table>
                            <TableHeader className="bg-transparent">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest">Leads Classification</TableHead>
                                    <TableHead className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest text-center">Record Count</TableHead>
                                    <TableHead className="font-bold text-[10px] text-zinc-400 uppercase tracking-widest">Planned Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {impactData.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-transparent border-none">
                                        <TableCell className="py-2">
                                            <span className="text-[11px] font-bold text-zinc-700 uppercase italic">{item.stage}</span>
                                        </TableCell>
                                        <TableCell className="py-2 text-center">
                                            <span className="text-[11px] font-black text-zinc-900">{item.count.toLocaleString()}</span>
                                        </TableCell>
                                        <TableCell className="py-2">
                                            <Badge variant="outline" className={`text-[8px] font-black uppercase border-none px-2 h-5 rounded-full ${item.status === 'SYSTEM' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                                {item.action}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="md:col-span-4 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                        <h3 className="text-xs font-black text-zinc-900 uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            Auto-Cleanup Policy
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-zinc-800 transition-colors group-hover:text-blue-600 uppercase italic">Enable Auto-Purge</span>
                                    <span className="text-[10px] text-zinc-400 font-medium mt-0.5 leading-relaxed">Permanently delete data after archive window.</span>
                                </div>
                                <Switch
                                    checked={policies.autoPurge}
                                    onCheckedChange={(v) => setPolicies(p => ({ ...p, autoPurge: v }))}
                                    className="data-[state=checked]:bg-rose-600 shadow-sm"
                                />
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-zinc-800 transition-colors group-hover:text-blue-600 uppercase italic">Archive Before Purge</span>
                                    <span className="text-[10px] text-zinc-400 font-medium mt-0.5 leading-relaxed">Move to cold storage for 6 months first.</span>
                                </div>
                                <Switch
                                    checked={policies.archiveBeforePurge}
                                    onCheckedChange={(v) => setPolicies(p => ({ ...p, archiveBeforePurge: v }))}
                                    className="data-[state=checked]:bg-blue-600 shadow-sm"
                                />
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-zinc-800 transition-colors group-hover:text-blue-600 uppercase italic">GDPR Deletion Hook</span>
                                    <span className="text-[10px] text-zinc-400 font-medium mt-0.5 leading-relaxed">Trigger purge on user deletion request.</span>
                                </div>
                                <Switch
                                    checked={policies.gdprHook}
                                    onCheckedChange={(v) => setPolicies(p => ({ ...p, gdprHook: v }))}
                                    className="data-[state=checked]:bg-blue-600 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-600 rounded-xl p-8 text-white shadow-xl shadow-rose-200 border-t border-white/20">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="w-5 h-5 text-white/60" />
                            <h4 className="text-xs font-black uppercase tracking-widest italic">Compliance Lock</h4>
                        </div>
                        <p className="text-[11px] font-bold leading-relaxed opacity-90 mb-6 italic">
                            Legal and regulatory 'Won' leads are automatically exempt from retention cycles and stored indefinitely for audit purposes.
                        </p>
                        <div className="flex items-center justify-between p-4 bg-white/10 border border-white/20 rounded-xl">
                            <span className="text-[10px] font-black uppercase italic tracking-widest">Won Lead Exemption</span>
                            <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
