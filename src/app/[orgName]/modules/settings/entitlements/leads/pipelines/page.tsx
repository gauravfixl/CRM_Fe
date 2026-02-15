"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    LayoutDashboard,
    Plus,
    MoreVertical,
    ChevronRight,
    Search,
    Filter,
    ArrowRight,
    GripVertical,
    Settings2,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCcw,
    Copy,
    Archive,
    History,
    ShieldCheck
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export default function LeadPipelinesPage() {
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

    const pipelines = [
        {
            id: "1",
            name: "Default Sales Pipeline",
            appliesTo: "All Firms",
            status: "ACTIVE",
            isDefault: true,
            stages: 6,
            lastModified: "12 Jan, 2024",
            modifiedBy: "Admin"
        },
        {
            id: "2",
            name: "Enterprise Deals",
            appliesTo: "Selected Firms",
            status: "ACTIVE",
            isDefault: false,
            stages: 5,
            lastModified: "10 Jan, 2024",
            modifiedBy: "Sarah J."
        },
        {
            id: "3",
            name: "Quick Conversion",
            appliesTo: "All Firms",
            status: "INACTIVE",
            isDefault: false,
            stages: 3,
            lastModified: "05 Jan, 2024",
            modifiedBy: "Admin"
        }
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* COMPACT DASHBOARD-STYLE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Lead Pipelines</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-bold uppercase tracking-widest">Org Default</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Define how a lead moves through sales stages across the organization.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Standards synced")}
                        className="h-10 border-zinc-200 text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Sync Standards
                    </Button>
                    <Button
                        onClick={() => handleAction("New pipeline creation started")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Pipeline
                    </Button>
                </div>
            </div>

            {/* PIPELINE INSIGHTS - PREMIUM 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Pipelines</p>
                        <Settings2 className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">08</p>
                        <p className="text-[10px] text-white">Inherited by 12 firms</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Active Stages</p>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">42</p>
                        <p className="text-[10px] text-zinc-400 font-medium tracking-tight">Across all pipelines</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Automation Rate</p>
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">68%</p>
                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter">15 Auto-transitions</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Compliance</p>
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">Valited</p>
                        <p className="text-[10px] text-zinc-400 font-medium">Standards met</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                    <Input
                        placeholder="Search pipelines..."
                        className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-100 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-10 border-zinc-200 text-zinc-600 bg-white font-bold px-5 rounded-xl shadow-sm hover:bg-zinc-50 text-[10px] uppercase tracking-widest">
                        <Filter className="w-3.5 h-3.5 mr-2 text-zinc-400" />
                        Status: Active
                    </Button>
                </div>
            </div>

            {/* PIPELINES TABLE */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Pipeline Identity</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Applies To</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Complexity</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Audit Info</TableHead>
                            <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pipelines.map((pipeline) => (
                            <TableRow key={pipeline.id} className="hover:bg-zinc-50/50 transition-colors group border-b-zinc-50">
                                <TableCell className="py-4 px-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 ${pipeline.isDefault ? 'bg-blue-600' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'}`}>
                                            <LayoutDashboard className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-zinc-900 tracking-tight group-hover:text-blue-600 transition-colors italic">{pipeline.name}</span>
                                                {pipeline.isDefault && <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none text-[8px] font-black uppercase px-2 h-4">Default</Badge>}
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-tighter mt-0.5 ${pipeline.status === 'ACTIVE' ? 'text-emerald-500' : 'text-zinc-400'}`}>{pipeline.status}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-tight">{pipeline.appliesTo}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-black text-zinc-700">{pipeline.stages} Stages</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(6)].map((_, i) => (
                                                <div key={i} className={`h-1 w-4 rounded-full ${i < pipeline.stages ? 'bg-blue-600' : 'bg-zinc-100'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-zinc-900">{pipeline.lastModified}</span>
                                        <span className="text-[10px] text-zinc-400 font-medium">By {pipeline.modifiedBy}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-right pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleAction("Pipeline editor opened")}
                                            className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                                        >
                                            <Settings2 className="w-4 h-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg">
                                                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 shadow-xl border-zinc-100 p-2">
                                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 px-2 py-1.5">Manage Configuration</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Set as Default
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                    <Copy className="w-3.5 h-3.5" />
                                                    Clone Pipeline
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-zinc-50" />
                                                <DropdownMenuItem className="text-xs font-bold gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-md cursor-pointer">
                                                    <Archive className="w-3.5 h-3.5" />
                                                    Archive Pipeline
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
                        Pipelines are inherited by all firm sub-units unless overridden.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest transition-colors" disabled>Prev</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">Next</Button>
                    </div>
                </div>
            </div>

            {/* PREVIEW PANEL - 3D GLASS STYLE */}
            <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-6">
                    <div>
                        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest italic">Default Pipeline Preview</h3>
                        <p className="text-[11px] text-zinc-400 font-medium">Visual sequence of sales stages for new leads.</p>
                    </div>
                    <Button variant="outline" className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest border-zinc-200">
                        Edit Stages
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative">
                    <StagePreview name="New" type="Open" prob="10%" color="bg-zinc-100 text-zinc-600" isLast={false} />
                    <StagePreview name="Contacted" type="Open" prob="25%" color="bg-blue-50 text-blue-600" isLast={false} />
                    <StagePreview name="Qualified" type="Open" prob="50%" color="bg-cyan-50 text-cyan-600" isLast={false} />
                    <StagePreview name="Negotiation" type="Open" prob="75%" color="bg-amber-50 text-amber-600" isLast={false} />
                    <StagePreview name="Won" type="Won" prob="100%" color="bg-emerald-50 text-emerald-600" isLast={false} conversion />
                    <StagePreview name="Lost" type="Lost" prob="0%" color="bg-rose-50 text-rose-600" isLast={true} />
                </div>
            </div>
        </div>
    )
}

function StagePreview({ name, type, prob, color, isLast, conversion }: { name: string, type: string, prob: string, color: string, isLast: boolean, conversion?: boolean }) {
    return (
        <div className="relative group">
            <div className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${color} border-current flex flex-col gap-2`}>
                <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase italic tracking-tighter opacity-70 leading-none">{type}</span>
                    {conversion && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <h4 className="text-xs font-black tracking-tight">{name}</h4>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] font-bold opacity-80">{prob}</span>
                    {conversion && <span className="text-[8px] font-black uppercase bg-white/40 px-1 rounded animate-pulse">Converter</span>}
                </div>
            </div>
            {!isLast && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center bg-white border border-zinc-100 rounded-full shadow-sm text-zinc-300">
                    <ChevronRight className="w-4 h-4" />
                </div>
            )}
        </div>
    )
}
