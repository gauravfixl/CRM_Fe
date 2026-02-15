"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Search,
    RotateCcw,
    Trash2,
    AlertTriangle,
    History,
    MoreVertical,
    Calendar,
    ShieldAlert,
    Ghost,
    ShieldX,
    FileX,
    Clock,
    AlertCircle,
    CheckCircle2
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
import { toast } from "sonner"

export default function LeadTrashRecoveryPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isPurging, setIsPurging] = useState(false)

    const handleAction = (msg: string, isDestructive = false) => {
        if (isDestructive) setIsPurging(true)
        setTimeout(() => {
            setIsPurging(false)
            toast.success(msg)
        }, 1200)
    }

    const deletedLeads = [
        { id: "1", title: "Outdated Project Query", email: "old@spam.com", deletedAt: "10 Jan, 2024", deletedBy: "System Bot", reason: "Spam Detection" },
        { id: "2", title: "Duplicate Realty Deal", email: "bob@realty.com", deletedAt: "11 Jan, 2024", deletedBy: "Sarah Jain", reason: "Duplicate Record" },
        { id: "3", title: "Invalid Contact Data", email: "unknown@provider.net", deletedAt: "14 Jan, 2024", deletedBy: "John Doe", reason: "Bounced Email" },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>COMPLIANCE</span>
                    <span>/</span>
                    <span>SOFT-DELETE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">TRASH & RECOVERY</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                            Lead Trash Repository
                        </h1>
                        <p className="text-xs text-zinc-500 font-medium">Audit and restore Prospective data within the 90-day window.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => handleAction("Audit logs retrieved")}
                            className="h-8 rounded-md border-zinc-200 text-zinc-600 text-xs font-medium bg-white px-3 shadow-sm active:scale-95"
                        >
                            <History className="w-3.5 h-3.5 mr-2" />
                            Audit Logs
                        </Button>
                        <Button
                            disabled={isPurging}
                            onClick={() => handleAction("Global purge initiated", true)}
                            className="h-8 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95 transition-all"
                        >
                            <Trash2 className={`w-3.5 h-3.5 mr-2 ${isPurging ? 'animate-pulse' : ''}`} />
                            Purge All
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS - PREMIUM 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* 3D BLUE CARD */}
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Marked Inactive</p>
                        <ShieldX className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">112 Items</p>
                        <p className="text-[10px] text-white">Retention: 90 Days</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Detected Dups</p>
                        <FileX className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">45 Records</p>
                        <p className="text-[10px] text-zinc-400">Review required</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Expirations</p>
                        <Clock className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">14 Days</p>
                        <p className="text-[10px] text-zinc-400">Avg. time to purge</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Recovered</p>
                        <RotateCcw className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-emerald-600">12.5%</p>
                        <p className="text-[10px] text-emerald-500/60">Success rate</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input
                        placeholder="Search trash..."
                        className="pl-8 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-blue-100 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-9 border-zinc-200 text-zinc-600 bg-white font-medium px-4 rounded-md shadow-sm text-xs transition-all active:scale-95">
                        <AlertTriangle className="w-3.5 h-3.5 mr-2 text-amber-500" />
                        Critical
                    </Button>
                    <Button variant="outline" className="h-9 border-zinc-200 text-zinc-600 bg-white font-medium px-4 rounded-md shadow-sm text-xs transition-all active:scale-95">
                        <Calendar className="w-3.5 h-3.5 mr-2" />
                        Select Date
                    </Button>
                </div>
            </div>

            {/* TRASH DATA TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Archive Identity</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Reason</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Deleted By</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Deletion Stamp</TableHead>
                            <TableHead className="text-right pr-4 font-semibold text-[11px] text-zinc-500 uppercase">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {deletedLeads.map((lead) => (
                            <TableRow key={lead.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="py-3 px-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-zinc-900 transition-colors group-hover:text-blue-600">{lead.title}</span>
                                        <span className="text-[10px] text-zinc-400 font-medium italic">{lead.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <Badge variant="outline" className="rounded-sm font-semibold text-[9px] px-2 py-0.5 border-zinc-200 text-zinc-600 uppercase transition-all group-hover:bg-zinc-100">
                                        {lead.reason}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 font-medium text-xs text-zinc-600">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-[9px] font-bold text-zinc-400 border border-zinc-200 transition-transform group-hover:scale-110">
                                            {lead.deletedBy.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        {lead.deletedBy}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <span className="text-xs font-medium text-zinc-400 font-mono transition-colors group-hover:text-zinc-600">{lead.deletedAt}</span>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAction(`Restore complete`)}
                                            className="h-7 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-3 text-[10px] uppercase shadow-sm transition-all active:scale-95"
                                        >
                                            <RotateCcw className="w-3 h-3 mr-1" />
                                            Restore
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                    <MoreVertical className="h-4 w-4 text-zinc-300" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                                <DropdownMenuItem className="text-xs font-medium">Security Check</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-xs font-medium text-rose-600">Permanent Purge</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="px-4 py-3 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/10">
                    <p className="text-[10px] text-zinc-400 font-medium italic">Retention policy active: 90 days remaining</p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase text-zinc-400 transition-colors">Prev</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase text-rose-600 hover:text-rose-700 transition-colors font-semibold">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
