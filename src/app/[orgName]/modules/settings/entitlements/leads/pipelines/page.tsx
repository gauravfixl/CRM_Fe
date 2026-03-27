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
            status: "Active",
            isDefault: true,
            stages: 6,
            lastModified: "12 Jan, 2024",
            modifiedBy: "Admin"
        },
        {
            id: "2",
            name: "Enterprise Deals",
            appliesTo: "Selected Firms",
            status: "Active",
            isDefault: false,
            stages: 5,
            lastModified: "10 Jan, 2024",
            modifiedBy: "Sarah J."
        },
        {
            id: "3",
            name: "Quick Conversion",
            appliesTo: "All Firms",
            status: "Inactive",
            isDefault: false,
            stages: 3,
            lastModified: "05 Jan, 2024",
            modifiedBy: "Admin"
        }
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Compact Dashboard-Style Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-semibold text-gray-900">Lead Pipelines</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-medium">Org Default</Badge>
                        </div>
                        <p className="text-xs text-gray-600 font-medium">Define how a lead moves through sales stages across the organization.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Standards synced")}
                        className="h-10 border-zinc-200 text-xs font-medium px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Sync Standards
                    </Button>
                    <Button
                        onClick={() => handleAction("New pipeline creation started")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Pipeline
                    </Button>
                </div>
            </div>

            {/* Pipeline Insights */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-white text-xs opacity-80">Total Pipelines</p>
                            <p className="text-white text-xl font-semibold">08</p>
                            <p className="text-[10px] text-white opacity-80">Inherited by 12 firms</p>
                        </div>
                        <Settings2 className="w-4 h-4 text-white" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Active Stages</p>
                            <p className="text-xl font-semibold text-gray-900">42</p>
                            <p className="text-[10px] text-gray-500">Across all pipelines</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Automation Rate</p>
                            <p className="text-xl font-semibold text-gray-900">68%</p>
                            <p className="text-[10px] text-blue-500">15 Auto-transitions</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Compliance</p>
                            <p className="text-xl font-semibold text-gray-900">Validated</p>
                            <p className="text-[10px] text-gray-500">Standards met</p>
                        </div>
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Search and Filters */}
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
                    <Button variant="outline" className="h-10 border-zinc-200 text-zinc-600 bg-white font-medium px-5 rounded-xl shadow-sm hover:bg-zinc-50 text-xs">
                        <Filter className="w-3.5 h-3.5 mr-2 text-zinc-400" />
                        Status: Active
                    </Button>
                </div>
            </div>

            {/* Pipelines Table */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="py-4 px-6 text-[11px] font-medium text-gray-500">Pipeline Identity</TableHead>
                            <TableHead className="py-4 text-[11px] font-medium text-gray-500">Applies To</TableHead>
                            <TableHead className="py-4 text-[11px] font-medium text-gray-500">Complexity</TableHead>
                            <TableHead className="py-4 text-[11px] font-medium text-gray-500">Audit Info</TableHead>
                            <TableHead className="py-4 text-right pr-6 text-[11px] font-medium text-gray-500">Actions</TableHead>
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
                                                <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{pipeline.name}</span>
                                                {pipeline.isDefault && <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none text-[8px] font-medium px-2 h-4">Default</Badge>}
                                            </div>
                                            <span className={`text-[10px] font-medium mt-0.5 ${pipeline.status === 'Active' ? 'text-emerald-500' : 'text-zinc-400'}`}>{pipeline.status}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <span className="text-[11px] font-medium text-gray-500">{pipeline.appliesTo}</span>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-semibold text-gray-900">{pipeline.stages} Stages</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(6)].map((_, i) => (
                                                <div key={i} className={`h-1 w-4 rounded-full ${i < pipeline.stages ? 'bg-blue-600' : 'bg-zinc-100'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-medium text-gray-900">{pipeline.lastModified}</span>
                                        <span className="text-[10px] text-gray-500 font-medium">By {pipeline.modifiedBy}</span>
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
                                                <DropdownMenuLabel className="text-[10px] font-medium text-zinc-400 px-2 py-1.5">Manage Configuration</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleAction("Pipeline set as default")} className="text-xs font-medium gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Set as Default
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction("Pipeline cloned successfully")} className="text-xs font-medium gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                    <Copy className="w-3.5 h-3.5" />
                                                    Clone Pipeline
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-zinc-50" />
                                                <DropdownMenuItem onClick={() => handleAction("Pipeline archived")} className="text-xs font-medium gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-md cursor-pointer">
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
                    <p className="text-[10px] text-gray-500 font-medium flex items-center gap-2">
                        <Info className="w-3.5 h-3.5" />
                        Pipelines are inherited by all firm sub-units unless overridden.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-xs font-medium transition-colors" disabled>Prev</Button>
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Loading next page...")} className="h-8 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">Next</Button>
                    </div>
                </div>
            </div>

            {/* Default Pipeline Preview */}
            <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Default Pipeline Preview</h3>
                        <p className="text-[11px] text-gray-500 font-medium">Visual sequence of sales stages for new leads.</p>
                    </div>
                    <Button variant="outline" onClick={() => handleAction("Stage editor opened")} className="h-8 rounded-lg text-xs font-medium border-zinc-200">
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
                    <span className="text-[10px] font-medium opacity-70 leading-none">{type}</span>
                    {conversion && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <h4 className="text-xs font-semibold">{name}</h4>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] font-medium opacity-80">{prob}</span>
                    {conversion && <span className="text-[8px] font-medium bg-white/40 px-1 rounded animate-pulse">Converter</span>}
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
