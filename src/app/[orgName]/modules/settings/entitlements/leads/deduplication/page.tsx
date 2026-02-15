"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Copy,
    Plus,
    MoreVertical,
    Search,
    Filter,
    ShieldAlert,
    ScanSearch,
    Fingerprint,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCcw,
    Edit3,
    Trash2,
    Lock,
    Unlock,
    Settings2,
    AlertTriangle,
    Layers,
    Binary
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
import { toast } from "sonner"

export default function LeadDeduplicationRulesPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1200)
    }

    const matchingRules = [
        { id: "1", name: "Exact Email Match", fields: "Work Email", logic: "Exact", action: "Block Creation", priority: 1, status: "ACTIVE" },
        { id: "2", name: "Company + Domain Check", fields: "Company Name, Website Domain", logic: "Fuzzy", action: "Warn User", priority: 2, status: "ACTIVE" },
        { id: "3", name: "Phone Fingerprint", fields: "Primary Phone", logic: "Exact", action: "Block Creation", priority: 3, status: "ACTIVE" },
        { id: "4", name: "Full Name + Region", fields: "Full Name, Country", logic: "Fuzzy", action: "Warn User", priority: 4, status: "INACTIVE" },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Copy className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Deduplication Guard</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-bold uppercase tracking-widest">Data Integrity</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Prevent duplicate lead creation through exact and fuzzy matching logic.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Global scan complete: 42 potential dups found")}
                        className="h-10 border-zinc-200 text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <ScanSearch className="w-4 h-4 mr-2" />
                        Scan Database
                    </Button>
                    <Button
                        onClick={() => handleAction("New matching rule creation started")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Rule
                    </Button>
                </div>
            </div>

            {/* INTEGRITY INSIGHTS - 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Guard Status</p>
                        <ShieldAlert className="w-4 h-4 text-white animate-pulse" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">Active</p>
                        <p className="text-[10px] text-white">Blocking active: 03 Rules</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Dups Blocked</p>
                        <Fingerprint className="w-4 h-4 text-blue-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">142</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">In the last 30 days</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Fuzzy Matches</p>
                        <Binary className="w-4 h-4 text-amber-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">84%</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Certainty threshold</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Auto-Merge</p>
                        <Layers className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-400 italic">BETA</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Feature locked by Org</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MATCHING RULES TABLE */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden mt-2">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Search matching rules..."
                            className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-100 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest w-12 text-center">Pri</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Rule Name</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Target Fields</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Logic</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Integrity Action</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Status</TableHead>
                            <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {matchingRules.map((rule) => (
                            <TableRow key={rule.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="py-4 px-6 text-center">
                                    <span className="text-xs font-black text-blue-600">{rule.priority}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-zinc-900 uppercase tracking-tight italic group-hover:text-blue-600 transition-colors">{rule.name}</span>
                                        <span className="text-[9px] font-black uppercase text-zinc-300 tracking-tighter mt-0.5">DUID: 0X{rule.id}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="outline" className="text-[10px] font-bold border-zinc-100 text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded shadow-none">
                                        {rule.fields}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <Settings2 className="w-3.5 h-3.5 text-blue-400" />
                                        <span className={`text-[11px] font-bold ${rule.logic === 'Exact' ? 'text-zinc-900' : 'text-amber-600'}`}>{rule.logic} Match</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className={`w-3.5 h-3.5 ${rule.action === 'Block Creation' ? 'text-rose-500' : 'text-amber-500'}`} />
                                        <span className={`text-[11px] font-bold uppercase tracking-tighter ${rule.action === 'Block Creation' ? 'text-rose-600' : 'text-amber-600'}`}>{rule.action}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Switch
                                        checked={rule.status === 'ACTIVE'}
                                        className="data-[state=checked]:bg-blue-600 scale-75"
                                    />
                                </TableCell>
                                <TableCell className="py-4 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2 text-zinc-300">
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all">
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg">
                                                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 shadow-xl border-zinc-100 p-2">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 px-2 py-1.5">Rule Strategy</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                    <RefreshCcw className="w-3.5 h-3.5" />
                                                    Re-evaluate Priority
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-zinc-50" />
                                                <DropdownMenuItem className="text-xs font-bold gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-md cursor-pointer">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Remove Guard
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/10">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic flex items-center gap-2">
                        <Info className="w-3.5 h-3.5" />
                        Exact match rules are performed before fuzzy logic to ensure data speed.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest transition-colors" disabled>Prev</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">Next</Button>
                    </div>
                </div>
            </div>

            {/* SECURITY WARNING - 3D GLASS STYLE */}
            <div className="bg-rose-50/50 rounded-xl border border-rose-100 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white border border-rose-100 flex items-center justify-center text-rose-500 shadow-md">
                        <AlertTriangle className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest italic">Bulk Import Conflict</h3>
                        <p className="text-[11px] text-rose-600 font-medium">Blocking mode is bypassed during API/Bulk imports by default.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-5 rounded-xl border border-rose-100/50 shadow-inner">
                    <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-bold text-rose-900">Apply rules to API/Bulk Imports?</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Recommendation: OFF</span>
                        <Switch className="data-[state=checked]:bg-rose-600" />
                    </div>
                </div>
            </div>
        </div>
    )
}
