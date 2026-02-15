"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Globe,
    Plus,
    MoreVertical,
    Search,
    Filter,
    BarChart3,
    Activity,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCcw,
    Edit3,
    Trash2,
    Lock,
    Unlock,
    Settings2,
    Zap,
    MousePointer2,
    Users
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

export default function LeadSourcesPage() {
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

    const sources = [
        { id: "1", name: "Official Website", category: "Inbound", status: "ACTIVE", isDefault: true, usage: 1240, assignment: "Round Robin (Inbound)" },
        { id: "2", name: "Referral Partner", category: "Inbound", status: "ACTIVE", isDefault: false, usage: 842, assignment: "John Doe (Lead)" },
        { id: "3", name: "LinkedIn Ads", category: "Inbound", status: "ACTIVE", isDefault: false, usage: 312, assignment: "Sarah J." },
        { id: "4", name: "Cold Outreach", category: "Outbound", status: "ACTIVE", isDefault: false, usage: 240, assignment: "Sales Dev Team" },
        { id: "5", name: "Tech Events 2024", category: "Outbound", status: "INACTIVE", isDefault: false, usage: 120, assignment: "Manual" },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Lead Sources</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-bold uppercase tracking-widest">Inbound/Outbound</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Standardize where leads come from for reporting and automated routing.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Source metrics updated")}
                        className="h-10 border-zinc-200 text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Sync Data
                    </Button>
                    <Button
                        onClick={() => handleAction("New source creation started")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Lead Source
                    </Button>
                </div>
            </div>

            {/* SOURCE INSIGHTS - 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Top Source</p>
                        <Zap className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">Website</p>
                        <p className="text-[10px] text-white">45% of total inflow</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Active Sources</p>
                        <Activity className="w-4 h-4 text-emerald-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">12 Channels</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Standardized by Org</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Avg. Inbound</p>
                        <MousePointer2 className="w-4 h-4 text-blue-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">240/mo</p>
                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">+12% growth</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Round Robin</p>
                        <Users className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">04 Teams</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Assignment active</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                    <Input
                        placeholder="Search sources..."
                        className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-100 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-10 border-zinc-200 text-zinc-600 bg-white font-bold px-5 rounded-xl shadow-sm hover:bg-zinc-50 text-[10px] uppercase tracking-widest">
                        <Filter className="w-3.5 h-3.5 mr-2 text-zinc-400" />
                        Type: Inbound
                    </Button>
                </div>
            </div>

            {/* SOURCES TABLE */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Source Context</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Category</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Default Assignment</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Usage Count</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Status</TableHead>
                            <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sources.map((source) => (
                            <TableRow key={source.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 ${source.isDefault ? 'bg-blue-600 shadow-[0_5px_15px_rgba(37,99,235,0.4)]' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}>
                                            <MousePointer2 className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-zinc-900 italic tracking-tight group-hover:text-blue-600 transition-colors uppercase">{source.name}</span>
                                                {source.isDefault && <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none text-[8px] font-black uppercase px-2 h-4">System Default</Badge>}
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter">SOID: 00{source.id}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="outline" className={`text-[10px] font-bold border-zinc-200 shadow-sm uppercase px-2 h-5 rounded-md ${source.category === 'Inbound' ? 'text-blue-600 bg-blue-50/50 border-blue-100' : 'text-amber-600 bg-amber-50/50 border-amber-100'}`}>
                                        {source.category}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-2">
                                        <Settings2 className="w-3.5 h-3.5 text-zinc-300" />
                                        <span className="text-[11px] font-bold text-zinc-500">{source.assignment}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <span className="text-sm font-black text-zinc-700">{source.usage.toLocaleString()}</span>
                                    <p className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest mt-0.5">Captures</p>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${source.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-50' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-100'}`}>
                                        {source.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => handleAction("Editor opened")} className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all">
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg">
                                                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 shadow-xl border-zinc-100 p-2">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 px-2 py-1.5">Source Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Set as Default
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                    <Users className="w-3.5 h-3.5" />
                                                    Modify Assignment
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-zinc-50" />
                                                <DropdownMenuItem className="text-xs font-bold gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-md cursor-pointer">
                                                    {source.status === 'ACTIVE' ? <XCircle className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                                                    {source.status === 'ACTIVE' ? 'Deactivate Source' : 'Activate Source'}
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
                        Default sources cannot be deleted while assigned to active pipelines.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest transition-colors" disabled>Prev</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">Next</Button>
                    </div>
                </div>
            </div>

            {/* CHANNEL ANALYTICS - 3D GLASS STYLE */}
            <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-6">
                    <div>
                        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest italic flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            Source Mix Distribution
                        </h3>
                        <p className="text-[11px] text-zinc-400 font-medium">Capture density per standardized channel.</p>
                    </div>
                    <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[9px] uppercase px-4 py-1 tracking-widest">Real-time stats</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Search (SEO/SEM)</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-zinc-900">42%</span>
                                <span className="text-[9px] font-black text-emerald-500 uppercase pb-1">+5%</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-blue-600 w-[42%] shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Referral Engine</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-zinc-900">28%</span>
                                <span className="text-[9px] font-black text-emerald-500 uppercase pb-1">+2%</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-blue-500 w-[28%] shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Paid Inbound</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-zinc-900">18%</span>
                                <span className="text-[9px] font-black text-rose-500 uppercase pb-1">-3%</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-blue-400 w-[18%] shadow-[0_0_10px_rgba(96,165,250,0.3)]" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Outbound/Other</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-zinc-900">12%</span>
                                <span className="text-[9px] font-black text-zinc-300 uppercase pb-1">0%</span>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-zinc-300 w-[12%]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
