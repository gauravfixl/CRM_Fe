"use client"

import React, { useState, useEffect, useMemo } from "react"
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
    ShieldCheck,
    Loader2
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
import { getLeadListByOrg } from "@/hooks/leadHooks"

interface Lead {
    _id: string
    name: string
    stage: string
    source: string
    estimatedValue: number
    assignedTo?: { email: string; name: string }
    isDeleted: boolean
    createdAt: string
}

const LEAD_STAGES = [
    { name: "New", type: "Open", prob: "10%", color: "bg-zinc-100 text-zinc-600" },
    { name: "Contacted", type: "Open", prob: "25%", color: "bg-blue-50 text-blue-600" },
    { name: "Qualified", type: "Open", prob: "50%", color: "bg-cyan-50 text-cyan-600" },
    { name: "Proposal", type: "Open", prob: "60%", color: "bg-violet-50 text-violet-600" },
    { name: "Negotiation", type: "Open", prob: "75%", color: "bg-amber-50 text-amber-600" },
    { name: "Closed-Won", type: "Won", prob: "100%", color: "bg-emerald-50 text-emerald-600" },
    { name: "Closed-Lost", type: "Lost", prob: "0%", color: "bg-rose-50 text-rose-600" },
]

export default function LeadPipelinesPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [leads, setLeads] = useState<Lead[]>([])
    const [filteredViews, setFilteredViews] = useState<Array<{
        id: string
        name: string
        appliesTo: string
        status: string
        isDefault: boolean
        stages: number
        lastModified: string
        modifiedBy: string
        filterSource?: string
    }>>([])
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [newViewName, setNewViewName] = useState("")
    const [newViewSource, setNewViewSource] = useState("")

    const fetchLeads = async () => {
        setIsFetching(true)
        try {
            const res = await getLeadListByOrg()
            setLeads(res?.data?.data || [])
        } catch (error) {
            console.error("Failed to fetch leads for pipelines:", error)
            toast.error("Failed to load lead data")
            setLeads([])
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchLeads()
    }, [])

    const stageCounts = useMemo(() => {
        const counts: Record<string, number> = {}
        LEAD_STAGES.forEach(s => { counts[s.name] = 0 })
        leads.forEach(lead => {
            const stage = lead.stage || "New"
            if (counts[stage] !== undefined) {
                counts[stage]++
            }
        })
        return counts
    }, [leads])

    const stageValues = useMemo(() => {
        const values: Record<string, number> = {}
        LEAD_STAGES.forEach(s => { values[s.name] = 0 })
        leads.forEach(lead => {
            const stage = lead.stage || "New"
            if (values[stage] !== undefined) {
                values[stage] += lead.estimatedValue || 0
            }
        })
        return values
    }, [leads])

    const conversionRates = useMemo(() => {
        const rates: Record<string, string> = {}
        for (let i = 1; i < LEAD_STAGES.length; i++) {
            const prevStage = LEAD_STAGES[i - 1].name
            const currStage = LEAD_STAGES[i].name
            const prevCount = stageCounts[prevStage] || 0
            const currCount = stageCounts[currStage] || 0
            if (prevCount > 0) {
                rates[currStage] = ((currCount / prevCount) * 100).toFixed(0) + "%"
            } else {
                rates[currStage] = "—"
            }
        }
        return rates
    }, [stageCounts])

    const totalStages = LEAD_STAGES.length
    const activeLeads = leads.filter(l => !l.isDeleted).length
    const totalPipelineValue = useMemo(() => leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0), [leads])
    const overallConversionRate = useMemo(() => {
        const newCount = stageCounts["New"] || 0
        const wonCount = stageCounts["Closed-Won"] || 0
        if (newCount === 0) return "0%"
        return ((wonCount / newCount) * 100).toFixed(1) + "%"
    }, [stageCounts])
    const avgDealSize = useMemo(() => {
        if (activeLeads === 0) return 0
        return totalPipelineValue / activeLeads
    }, [totalPipelineValue, activeLeads])

    const formatCurrency = (val: number) => {
        if (val >= 1_000_000) return "$" + (val / 1_000_000).toFixed(1) + "M"
        if (val >= 1_000) return "$" + (val / 1_000).toFixed(1) + "K"
        return "$" + val.toFixed(0)
    }

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1200)
    }

    const handleSyncStandards = () => {
        fetchLeads()
        toast.success("Pipeline data refreshed from server")
    }

    const handleCreatePipeline = () => {
        if (!newViewName.trim()) {
            toast.error("Please enter a pipeline view name")
            return
        }
        const now = new Date()
        const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        const newView = {
            id: `view-${Date.now()}`,
            name: newViewName.trim(),
            appliesTo: newViewSource ? `Source: ${newViewSource}` : "All Firms",
            status: "Active" as const,
            isDefault: false,
            stages: LEAD_STAGES.length,
            lastModified: dateStr,
            modifiedBy: "Current User",
            filterSource: newViewSource || undefined,
        }
        setFilteredViews(prev => [...prev, newView])
        setNewViewName("")
        setNewViewSource("")
        setCreateDialogOpen(false)
        toast.success(`Pipeline view "${newView.name}" created`)
    }

    const defaultPipeline = useMemo(() => {
        const now = new Date()
        const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
        return {
            id: "default",
            name: "Default Sales Pipeline",
            appliesTo: "All Firms",
            status: "Active",
            isDefault: true,
            stages: LEAD_STAGES.length,
            lastModified: dateStr,
            modifiedBy: "System",
        }
    }, [])

    const pipelines = useMemo(() => [defaultPipeline, ...filteredViews], [defaultPipeline, filteredViews])

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
                        onClick={handleSyncStandards}
                        disabled={isFetching}
                        className="h-10 border-zinc-200 text-xs font-medium px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
                        Sync Standards
                    </Button>
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Pipeline
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Create Pipeline View</DialogTitle>
                                <DialogDescription>
                                    Create a filtered pipeline view. All views use the same backend stages (New through Closed).
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-gray-700">View Name</label>
                                    <Input
                                        placeholder="e.g., Enterprise Deals"
                                        value={newViewName}
                                        onChange={(e) => setNewViewName(e.target.value)}
                                        className="h-9 text-xs"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-gray-700">Filter by Source (optional)</label>
                                    <Input
                                        placeholder="e.g., Website, Referral"
                                        value={newViewSource}
                                        onChange={(e) => setNewViewSource(e.target.value)}
                                        className="h-9 text-xs"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="text-xs">Cancel</Button>
                                <Button onClick={handleCreatePipeline} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">Create View</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Pipeline Insights */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-white text-xs opacity-80">Active Leads</p>
                            <p className="text-white text-xl font-semibold">{isFetching ? "..." : String(activeLeads).padStart(2, "0")}</p>
                            <p className="text-[10px] text-white opacity-80">{isFetching ? "Loading..." : `${totalStages} stages configured`}</p>
                        </div>
                        <Settings2 className="w-4 h-4 text-white" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Total Pipeline Value</p>
                            <p className="text-xl font-semibold text-gray-900">{isFetching ? "..." : formatCurrency(totalPipelineValue)}</p>
                            <p className="text-[10px] text-gray-500">{isFetching ? "Loading..." : `${activeLeads} active leads`}</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Conversion Rate</p>
                            <p className="text-xl font-semibold text-gray-900">{isFetching ? "..." : overallConversionRate}</p>
                            <p className="text-[10px] text-blue-500">{isFetching ? "Loading..." : `${stageCounts["Closed-Won"] || 0} won deals`}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Avg Deal Size</p>
                            <p className="text-xl font-semibold text-gray-900">{isFetching ? "..." : formatCurrency(avgDealSize)}</p>
                            <p className="text-[10px] text-gray-500">{isFetching ? "Loading..." : `${pipelines.length} pipeline(s)`}</p>
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

                {isFetching ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                        <span className="ml-2 text-xs text-zinc-400 font-medium">Loading stage data...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative">
                        {LEAD_STAGES.map((stage, idx) => (
                            <StagePreview
                                key={stage.name}
                                name={stage.name}
                                type={stage.type}
                                prob={stage.prob}
                                color={stage.color}
                                isLast={idx === LEAD_STAGES.length - 1}
                                conversion={stage.type === "Won"}
                                count={stageCounts[stage.name] || 0}
                                value={stageValues[stage.name] || 0}
                                conversionRate={conversionRates[stage.name]}
                                formatCurrency={formatCurrency}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function StagePreview({ name, type, prob, color, isLast, conversion, count, value, conversionRate, formatCurrency }: { name: string, type: string, prob: string, color: string, isLast: boolean, conversion?: boolean, count?: number, value?: number, conversionRate?: string, formatCurrency?: (val: number) => string }) {
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
                    {count !== undefined && <span className="text-[9px] font-semibold">{count} leads</span>}
                </div>
                {value !== undefined && value > 0 && formatCurrency && (
                    <div className="text-[9px] font-medium opacity-80">{formatCurrency(value)}</div>
                )}
                <div className="flex items-center justify-between">
                    {conversionRate && <span className="text-[8px] font-medium opacity-70">{conversionRate} from prev</span>}
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
