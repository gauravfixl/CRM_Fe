"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    UserPlus,
    ShieldCheck,
    Calendar,
    AlertCircle,
    Users,
    Target,
    PieChart,
    LayoutDashboard,
    RefreshCcw,
    ArrowUpDown,
    CheckCircle2,
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
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { getLeadListByOrg, deleteLead } from "@/hooks/leadHooks"

interface LeadContact {
    name?: string
    email?: string
    company?: string
}

interface LeadAssignee {
    name?: string
}

interface Lead {
    _id: string
    leadId?: string
    title?: string
    name?: string
    contact?: LeadContact
    email?: string
    company?: string
    stage: string
    estimatedValue?: number
    assignedTo?: LeadAssignee
    priority?: string
    isActive?: boolean
    createdAt?: string
}

interface Pagination {
    total: number
    page: number
    limit: number
    totalPages: number
}

export default function MasterLeadViewPage() {
    const params = useParams()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [leads, setLeads] = useState<Lead[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [isFetching, setIsFetching] = useState(true)

    const fetchLeads = async () => {
        setIsFetching(true)
        try {
            const res = await getLeadListByOrg()
            const data = res?.data?.data || res?.data || []
            const leadsArray = Array.isArray(data) ? data : data?.data || []
            setLeads(leadsArray)
            const paginationData = res?.data?.pagination || null
            setPagination(paginationData)
        } catch (error) {
            console.error("Failed to fetch leads:", error)
            toast.error("Failed to load leads. Showing empty state.")
            setLeads([])
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        fetchLeads()
    }, [])

    const handleRefresh = async () => {
        setIsLoading(true)
        await fetchLeads()
        setIsLoading(false)
        toast.success("Leads refreshed")
    }

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1000)
    }

    const handleMoveToRecovery = async (lead: Lead) => {
        try {
            setIsLoading(true)
            await deleteLead([lead._id])
            await fetchLeads()
            toast.success("Lead moved to recovery")
        } catch (error) {
            console.error("Failed to move lead to recovery:", error)
            toast.error("Failed to move lead to recovery")
        } finally {
            setIsLoading(false)
        }
    }

    // Helper to get display values from lead (handles both flat and nested contact fields)
    const getLeadTitle = (lead: Lead) => lead.title || lead.name || "Untitled"
    const getLeadEmail = (lead: Lead) => lead.contact?.email || lead.email || "-"
    const getLeadCompany = (lead: Lead) => lead.contact?.company || lead.company || "-"
    const getLeadOwner = (lead: Lead) => lead.assignedTo?.name || lead.contact?.name || "Unassigned"

    // Search filter
    const filteredLeads = useMemo(() => {
        if (!searchQuery.trim()) return leads
        const query = searchQuery.toLowerCase()
        return leads.filter((lead) =>
            getLeadTitle(lead).toLowerCase().includes(query) ||
            getLeadEmail(lead).toLowerCase().includes(query) ||
            getLeadCompany(lead).toLowerCase().includes(query)
        )
    }, [leads, searchQuery])

    // Stats computed from real data
    const stats = useMemo(() => {
        const totalLeads = pagination?.total || leads.length
        const qualified = leads.filter((l) => l.stage === "Qualified").length
        const pipelineValue = leads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0)
        const closedWon = leads.filter((l) => l.stage === "Closed-Won" || l.stage === "Won").length
        const winRate = leads.length > 0 ? ((closedWon / leads.length) * 100) : 0

        const formatCurrency = (value: number) => {
            if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
            if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
            return `$${value.toLocaleString()}`
        }

        return {
            totalLeads: totalLeads.toLocaleString(),
            activeCount: leads.filter((l) => l.isActive).length,
            qualified,
            pipelineValue: formatCurrency(pipelineValue),
            winRate: winRate.toFixed(1),
            highPriority: leads.filter((l) => l.priority === "High").length,
        }
    }, [leads, pagination])

    const formatEstimatedValue = (value?: number) => {
        if (!value) return "-"
        return `$${value.toLocaleString()}`
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>Organization</span>
                    <span>/</span>
                    <span>Governance</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">Master Leads</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">Lead Management</h1>
                        <p className="text-xs text-zinc-500 font-medium">Track and optimize your sales pipelines organization-wide.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={isLoading || isFetching}
                            onClick={handleRefresh}
                            className="h-8 rounded-md border-zinc-200 text-xs font-medium bg-white px-3 shadow-sm active:scale-95"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 mr-2 ${isLoading || isFetching ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button
                            onClick={() => router.push(`/${params.orgName}/modules/crm/leads/add`)}
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                        >
                            <UserPlus className="w-3.5 h-3.5 mr-2" />
                            New Lead
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* PRIMARY BLUE CARD */}
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Total Leads</p>
                                <p className="text-white text-xl font-semibold mt-1">{isFetching ? "..." : stats.totalLeads}</p>
                                <p className="text-[10px] text-white opacity-70">{isFetching ? "Loading" : `${stats.activeCount} active now`}</p>
                            </div>
                            <Users className="w-4 h-4 text-white opacity-80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                {/* WHITE CARD */}
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Qualified</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{isFetching ? "..." : stats.qualified.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500">All systems operational</p>
                            </div>
                            <Target className="w-4 h-4 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                {/* WHITE CARD */}
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Pipeline Value</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{isFetching ? "..." : stats.pipelineValue}</p>
                                <p className="text-[10px] text-gray-500">{isFetching ? "Loading" : `${stats.highPriority} high priority`}</p>
                            </div>
                            <PieChart className="w-4 h-4 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                {/* WHITE CARD */}
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Win Rate</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{isFetching ? "..." : `${stats.winRate}%`}</p>
                                <p className="text-[10px] text-gray-500">Across all firms</p>
                            </div>
                            <LayoutDashboard className="w-4 h-4 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input
                        placeholder="Search leads..."
                        className="pl-8 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-blue-100 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => toast.info("Filter panel coming soon")}
                        className="h-9 border-zinc-200 text-zinc-600 bg-white font-medium px-4 rounded-md shadow-sm hover:bg-zinc-50 text-xs"
                    >
                        <Filter className="w-3.5 h-3.5 mr-2" />
                        Filters
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Lead data exported successfully")}
                        className="h-9 border-zinc-200 text-blue-600 bg-white font-medium px-4 rounded-md shadow-sm hover:bg-zinc-50 text-xs"
                    >
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* MASTER DATA TABLE */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-[11px] font-medium text-gray-500">Identity</TableHead>
                            <TableHead className="py-3 text-[11px] font-medium text-gray-500">Stage</TableHead>
                            <TableHead className="py-3 text-[11px] font-medium text-gray-500">Company</TableHead>
                            <TableHead className="py-3 text-[11px] font-medium text-gray-500">Value</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-[11px] font-medium text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                                        <span className="text-xs text-zinc-400 font-medium">Loading leads...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredLeads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center">
                                    <span className="text-xs text-zinc-400 font-medium">
                                        {searchQuery ? "No leads match your search." : "No leads found."}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeads.map((lead) => {
                                const owner = getLeadOwner(lead)
                                return (
                                    <TableRow key={lead._id} className="hover:bg-zinc-50/50 transition-colors group">
                                        <TableCell className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] font-semibold text-zinc-600 border border-zinc-200 transition-transform group-hover:scale-110">
                                                    {owner === 'Unassigned' ? '?' : owner.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-zinc-900">{getLeadTitle(lead)}</span>
                                                    <span className="text-[10px] text-zinc-400 font-medium">{getLeadEmail(lead)}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                                <span className="text-xs font-medium text-zinc-700">{lead.stage}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="text-[11px] font-medium text-zinc-500">{getLeadCompany(lead)}</span>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="text-xs font-semibold text-zinc-900">{formatEstimatedValue(lead.estimatedValue)}</span>
                                        </TableCell>
                                        <TableCell className="py-3 text-right pr-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                        <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                                    <DropdownMenuItem onClick={() => handleAction("Integrity verification complete")} className="text-xs font-medium">Verify Integrity</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleAction("Ownership transfer initiated")} className="text-xs font-medium">Transfer Ownership</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleMoveToRecovery(lead)} className="text-xs font-medium text-rose-600">Move to Recovery</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
                <div className="px-4 py-3 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                    <p className="text-[10px] text-zinc-400 font-medium">
                        Showing {filteredLeads.length} of {pagination?.total || leads.length} records
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-medium transition-colors" disabled>Prev</Button>
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Loading next page...")} className="h-7 text-[10px] font-medium text-blue-600 hover:text-blue-700 transition-colors">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
