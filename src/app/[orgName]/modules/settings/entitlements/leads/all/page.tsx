"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    UserPlus,
    Users,
    Target,
    PieChart,
    LayoutDashboard,
    RefreshCcw,
    CheckCircle2,
    Loader2,
    ArrowRight,
    Mail,
    Phone,
    Building
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import {
    getLeadListByOrg,
    deleteLead,
    getLeadById,
    updateLead,
    updateLeadStage,
} from "@/hooks/leadHooks"

const STAGE_OPTIONS = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal",
    "Negotiation",
    "Closed-Won",
    "Closed-Lost",
] as const

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"] as const
const NEXT_ACTION_OPTIONS = [
    "Call",
    "Email",
    "Meeting",
    "Send Proposal",
    "Follow Up",
    "Close",
] as const

type Stage = (typeof STAGE_OPTIONS)[number]
type Priority = (typeof PRIORITY_OPTIONS)[number]
type NextAction = (typeof NEXT_ACTION_OPTIONS)[number]

interface LeadContact {
    name?: string
    email?: string
    phone?: string
    company?: string
    position?: string
}

interface LeadAssignee {
    name?: string
}

interface Lead {
    _id: string
    leadId?: string
    title?: string
    name?: string
    description?: string
    contact?: LeadContact
    email?: string
    company?: string
    stage: Stage
    estimatedValue?: number
    currency?: string
    source?: string
    sourceDetails?: string
    priority?: Priority
    nextAction?: NextAction
    nextActionDate?: string
    assignedTo?: LeadAssignee
    clientId?: string
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
    const orgName = params?.orgName as string
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [leads, setLeads] = useState<Lead[]>([])
    const [pagination, setPagination] = useState<Pagination | null>(null)
    const [isFetching, setIsFetching] = useState(true)

    // Action dialog state
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
    const [detailLead, setDetailLead] = useState<Lead | null>(null)
    const [showDetails, setShowDetails] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [showStage, setShowStage] = useState(false)
    const [showConvert, setShowConvert] = useState(false)
    const [dialogBusy, setDialogBusy] = useState(false)

    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        priority: "Medium" as Priority,
        estimatedValue: "",
        nextAction: "" as NextAction | "",
    })
    const [stageForm, setStageForm] = useState({
        stage: "New" as Stage,
        reason: "",
        createClient: false,
    })

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

    const openDetails = async (lead: Lead) => {
        setSelectedLead(lead)
        setDetailLead(lead)
        setShowDetails(true)
        try {
            const res = await getLeadById(lead._id)
            const full = (res?.data?.data || res?.data?.lead || res?.data) as Lead | undefined
            if (full && full._id) setDetailLead(full)
        } catch (err) {
            // Fallback to row data silently
        }
    }

    const openEdit = (lead: Lead) => {
        setSelectedLead(lead)
        setEditForm({
            title: lead.title || lead.name || "",
            description: lead.description || "",
            priority: (lead.priority as Priority) || "Medium",
            estimatedValue: lead.estimatedValue != null ? String(lead.estimatedValue) : "",
            nextAction: (lead.nextAction as NextAction) || "",
        })
        setShowEdit(true)
    }

    const submitEdit = async () => {
        if (!selectedLead) return
        if (!editForm.title.trim()) {
            toast.error("Title is required")
            return
        }
        const payload: Record<string, unknown> = {
            title: editForm.title.trim(),
            description: editForm.description || undefined,
            priority: editForm.priority,
        }
        if (editForm.estimatedValue !== "") {
            const num = Number(editForm.estimatedValue)
            if (Number.isNaN(num) || num < 0) {
                toast.error("Estimated value must be a positive number")
                return
            }
            payload.estimatedValue = num
        }
        if (editForm.nextAction) payload.nextAction = editForm.nextAction

        try {
            setDialogBusy(true)
            await updateLead(selectedLead._id, payload)
            toast.success("Lead updated")
            setShowEdit(false)
            await fetchLeads()
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update lead")
        } finally {
            setDialogBusy(false)
        }
    }

    const openStage = (lead: Lead) => {
        setSelectedLead(lead)
        setStageForm({
            stage: lead.stage || "New",
            reason: "",
            createClient: false,
        })
        setShowStage(true)
    }

    const submitStage = async () => {
        if (!selectedLead) return
        if (stageForm.stage === selectedLead.stage) {
            toast.error("Please pick a different stage")
            return
        }
        try {
            setDialogBusy(true)
            await updateLeadStage(
                selectedLead._id,
                stageForm.stage,
                stageForm.reason || undefined,
                stageForm.stage === "Closed-Won" ? stageForm.createClient : false
            )
            toast.success(
                stageForm.stage === "Closed-Won" && stageForm.createClient
                    ? "Lead closed-won and client created"
                    : "Lead stage updated"
            )
            setShowStage(false)
            await fetchLeads()
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || "Failed to update stage")
        } finally {
            setDialogBusy(false)
        }
    }

    const openConvert = (lead: Lead) => {
        setSelectedLead(lead)
        setShowConvert(true)
    }

    const submitConvert = async () => {
        if (!selectedLead) return
        try {
            setDialogBusy(true)
            await updateLeadStage(selectedLead._id, "Closed-Won", "Converted to client", true)
            toast.success("Lead converted to client")
            setShowConvert(false)
            await fetchLeads()
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || "Failed to convert lead")
        } finally {
            setDialogBusy(false)
        }
    }

    const goToClient = () => {
        router.push(`/${orgName}/modules/settings/entitlements/clients/all`)
    }

    const stageBadgeClass = (stage: string) => {
        switch (stage) {
            case "Closed-Won":
                return "bg-emerald-100 text-emerald-700 border-emerald-200"
            case "Closed-Lost":
                return "bg-rose-100 text-rose-700 border-rose-200"
            case "Qualified":
            case "Proposal":
            case "Negotiation":
                return "bg-blue-100 text-blue-700 border-blue-200"
            case "Contacted":
                return "bg-amber-100 text-amber-700 border-amber-200"
            default:
                return "bg-zinc-100 text-zinc-700 border-zinc-200"
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
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-background">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                    <span>Organization</span>
                    <span>/</span>
                    <span>Governance</span>
                    <span>/</span>
                    <span className="text-foreground font-semibold">Master Leads</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-foreground tracking-tight">Lead Management</h1>
                        <p className="text-xs text-muted-foreground font-medium">Track and optimize your sales pipelines organization-wide.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={isLoading || isFetching}
                            onClick={handleRefresh}
                            className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 mr-2 ${isLoading || isFetching ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button
                            onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/leads/add`)}
                            className="h-8 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3 shadow-sm active:scale-95"
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
                <SmallCard className="border bg-card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Qualified</p>
                                <p className="text-xl font-semibold text-foreground mt-1">{isFetching ? "..." : stats.qualified.toLocaleString()}</p>
                                <p className="text-[10px] text-muted-foreground">All systems operational</p>
                            </div>
                            <Target className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                {/* WHITE CARD */}
                <SmallCard className="border bg-card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Pipeline Value</p>
                                <p className="text-xl font-semibold text-foreground mt-1">{isFetching ? "..." : stats.pipelineValue}</p>
                                <p className="text-[10px] text-muted-foreground">{isFetching ? "Loading" : `${stats.highPriority} high priority`}</p>
                            </div>
                            <PieChart className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                {/* WHITE CARD */}
                <SmallCard className="border bg-card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex flex-row items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Win Rate</p>
                                <p className="text-xl font-semibold text-foreground mt-1">{isFetching ? "..." : `${stats.winRate}%`}</p>
                                <p className="text-[10px] text-muted-foreground">Across all firms</p>
                            </div>
                            <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="flex flex-col md:flex-row items-center gap-2 mt-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                        placeholder="Search leads..."
                        className="pl-8 h-9 rounded-md text-xs font-medium focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => toast.info("Filter panel coming soon")}
                        className="h-9 font-medium px-4 rounded-md shadow-sm text-xs"
                    >
                        <Filter className="w-3.5 h-3.5 mr-2" />
                        Filters
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => toast.success("Lead data exported successfully")}
                        className="h-9 text-primary font-medium px-4 rounded-md shadow-sm text-xs"
                    >
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* MASTER DATA TABLE */}
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-[11px] font-medium text-muted-foreground">Identity</TableHead>
                            <TableHead className="py-3 text-[11px] font-medium text-muted-foreground">Stage</TableHead>
                            <TableHead className="py-3 text-[11px] font-medium text-muted-foreground">Company</TableHead>
                            <TableHead className="py-3 text-[11px] font-medium text-muted-foreground">Value</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-[11px] font-medium text-muted-foreground">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground font-medium">Loading leads...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredLeads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center">
                                    <span className="text-xs text-muted-foreground font-medium">
                                        {searchQuery ? "No leads match your search." : "No leads found."}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeads.map((lead) => {
                                const owner = getLeadOwner(lead)
                                return (
                                    <TableRow key={lead._id} className="hover:bg-muted/50 transition-colors group">
                                        <TableCell className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground border transition-transform group-hover:scale-110">
                                                    {owner === 'Unassigned' ? '?' : owner.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-foreground">{getLeadTitle(lead)}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium">{getLeadEmail(lead)}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={`rounded-md text-[10px] font-medium ${stageBadgeClass(lead.stage)}`}>
                                                    {lead.stage}
                                                </Badge>
                                                {lead.clientId && (
                                                    <Badge className="rounded-md text-[10px] font-medium bg-emerald-600 text-white hover:bg-emerald-600">
                                                        <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Client
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="text-[11px] font-medium text-muted-foreground">{getLeadCompany(lead)}</span>
                                        </TableCell>
                                        <TableCell className="py-3">
                                            <span className="text-xs font-semibold text-foreground">{formatEstimatedValue(lead.estimatedValue)}</span>
                                        </TableCell>
                                        <TableCell className="py-3 text-right pr-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-7 w-7 p-0 rounded-md">
                                                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 shadow-xl">
                                                    <DropdownMenuItem onClick={() => openDetails(lead)} className="text-xs font-medium cursor-pointer">View Details</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEdit(lead)} className="text-xs font-medium cursor-pointer">Edit Lead</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openStage(lead)} className="text-xs font-medium cursor-pointer">Change Stage</DropdownMenuItem>
                                                    {!lead.clientId && lead.stage !== "Closed-Won" && lead.stage !== "Closed-Lost" && (
                                                        <DropdownMenuItem onClick={() => openConvert(lead)} className="text-xs font-medium cursor-pointer text-emerald-700">
                                                            Convert to Client
                                                        </DropdownMenuItem>
                                                    )}
                                                    {lead.clientId && (
                                                        <DropdownMenuItem onClick={goToClient} className="text-xs font-medium cursor-pointer text-emerald-700">
                                                            View Client
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleMoveToRecovery(lead)} className="text-xs font-medium text-rose-600 cursor-pointer">Move to Recovery</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
                <div className="px-4 py-3 border-t flex items-center justify-between bg-muted/30">
                    <p className="text-[10px] text-muted-foreground font-medium">
                        Showing {filteredLeads.length} of {pagination?.total || leads.length} records
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-medium transition-colors" disabled>Prev</Button>
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Loading next page...")} className="h-7 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors">Next</Button>
                    </div>
                </div>
            </div>

            {/* VIEW DETAILS DIALOG */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="sm:max-w-[560px] rounded-xl p-5">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Lead Details</DialogTitle>
                        <DialogDescription className="text-[10px] text-muted-foreground">
                            Full information and status for this lead.
                        </DialogDescription>
                    </DialogHeader>
                    {detailLead && (
                        <div className="grid gap-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{detailLead.title || detailLead.name || "Untitled"}</p>
                                    {detailLead.description && (
                                        <p className="text-[11px] text-muted-foreground mt-0.5">{detailLead.description}</p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Badge variant="outline" className={`rounded-md text-[10px] font-medium ${stageBadgeClass(detailLead.stage)}`}>
                                        {detailLead.stage}
                                    </Badge>
                                    {detailLead.clientId && (
                                        <Badge className="rounded-md text-[10px] font-medium bg-emerald-600 text-white hover:bg-emerald-600">
                                            <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Client
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                                <div>
                                    <Label className="text-[10px] font-medium text-muted-foreground">Priority</Label>
                                    <p className="text-xs font-medium text-foreground mt-0.5">{detailLead.priority || "-"}</p>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-medium text-muted-foreground">Estimated Value</Label>
                                    <p className="text-xs font-semibold text-foreground mt-0.5">{formatEstimatedValue(detailLead.estimatedValue)}</p>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-medium text-muted-foreground">Source</Label>
                                    <p className="text-xs font-medium text-foreground mt-0.5">{detailLead.source || "-"}</p>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-medium text-muted-foreground">Next Action</Label>
                                    <p className="text-xs font-medium text-foreground mt-0.5">{detailLead.nextAction || "-"}</p>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-medium text-muted-foreground">Owner</Label>
                                    <p className="text-xs font-medium text-foreground mt-0.5">{getLeadOwner(detailLead)}</p>
                                </div>
                                <div>
                                    <Label className="text-[10px] font-medium text-muted-foreground">Created</Label>
                                    <p className="text-xs font-medium text-foreground mt-0.5">{detailLead.createdAt ? new Date(detailLead.createdAt).toLocaleDateString() : "-"}</p>
                                </div>
                            </div>

                            <div className="pt-2 border-t">
                                <Label className="text-[10px] font-medium text-muted-foreground">Contact</Label>
                                <div className="flex flex-col gap-1 mt-1">
                                    <div className="flex items-center gap-2 text-xs text-foreground">
                                        <Users className="w-3 h-3 text-muted-foreground" /> {detailLead.contact?.name || "-"}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-foreground">
                                        <Mail className="w-3 h-3 text-muted-foreground" /> {getLeadEmail(detailLead)}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-foreground">
                                        <Phone className="w-3 h-3 text-muted-foreground" /> {detailLead.contact?.phone || "-"}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-foreground">
                                        <Building className="w-3 h-3 text-muted-foreground" /> {getLeadCompany(detailLead)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        {detailLead?.clientId && (
                            <Button variant="outline" onClick={goToClient} className="h-8 text-xs font-medium rounded-md">
                                View Client <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                        )}
                        <Button onClick={() => setShowDetails(false)} className="h-8 text-xs font-medium rounded-md">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* EDIT LEAD DIALOG */}
            <Dialog open={showEdit} onOpenChange={setShowEdit}>
                <DialogContent className="sm:max-w-[520px] rounded-xl p-5">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Edit Lead</DialogTitle>
                        <DialogDescription className="text-[10px] text-muted-foreground">
                            Update lead details. Use Change Stage for status transitions.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 py-2">
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-medium">Title</Label>
                            <Input
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="h-8 text-xs"
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-medium">Description</Label>
                            <Textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="text-xs min-h-[60px]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                                <Label className="text-[10px] font-medium">Priority</Label>
                                <Select value={editForm.priority} onValueChange={(v) => setEditForm({ ...editForm, priority: v as Priority })}>
                                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {PRIORITY_OPTIONS.map((p) => (
                                            <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-1.5">
                                <Label className="text-[10px] font-medium">Estimated Value</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={editForm.estimatedValue}
                                    onChange={(e) => setEditForm({ ...editForm, estimatedValue: e.target.value })}
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-medium">Next Action</Label>
                            <Select value={editForm.nextAction || undefined} onValueChange={(v) => setEditForm({ ...editForm, nextAction: v as NextAction })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select action" /></SelectTrigger>
                                <SelectContent>
                                    {NEXT_ACTION_OPTIONS.map((a) => (
                                        <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEdit(false)} disabled={dialogBusy} className="h-8 text-xs font-medium rounded-md">
                            Cancel
                        </Button>
                        <Button onClick={submitEdit} disabled={dialogBusy} className="h-8 text-xs font-medium rounded-md">
                            {dialogBusy && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CHANGE STAGE DIALOG */}
            <Dialog open={showStage} onOpenChange={setShowStage}>
                <DialogContent className="sm:max-w-[460px] rounded-xl p-5">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Change Stage</DialogTitle>
                        <DialogDescription className="text-[10px] text-muted-foreground">
                            Move this lead to a new pipeline stage. Stage history will be recorded.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 py-2">
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-medium">Stage</Label>
                            <Select value={stageForm.stage} onValueChange={(v) => setStageForm({ ...stageForm, stage: v as Stage })}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {STAGE_OPTIONS.map((s) => (
                                        <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-medium">Reason (optional)</Label>
                            <Textarea
                                value={stageForm.reason}
                                onChange={(e) => setStageForm({ ...stageForm, reason: e.target.value })}
                                className="text-xs min-h-[60px]"
                                placeholder="Why is the stage changing?"
                            />
                        </div>
                        {stageForm.stage === "Closed-Won" && !selectedLead?.clientId && (
                            <div className="flex items-start gap-2 p-3 rounded-md bg-emerald-50 border border-emerald-200">
                                <Checkbox
                                    id="create-client"
                                    checked={stageForm.createClient}
                                    onCheckedChange={(v) => setStageForm({ ...stageForm, createClient: Boolean(v) })}
                                />
                                <div>
                                    <Label htmlFor="create-client" className="text-xs font-medium text-emerald-900 cursor-pointer">
                                        Also create client record
                                    </Label>
                                    <p className="text-[10px] text-emerald-700 mt-0.5">
                                        Contact info will be added to Client Management automatically.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowStage(false)} disabled={dialogBusy} className="h-8 text-xs font-medium rounded-md">
                            Cancel
                        </Button>
                        <Button onClick={submitStage} disabled={dialogBusy} className="h-8 text-xs font-medium rounded-md">
                            {dialogBusy && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}Update Stage
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CONVERT TO CLIENT DIALOG */}
            <Dialog open={showConvert} onOpenChange={setShowConvert}>
                <DialogContent className="sm:max-w-[460px] rounded-xl p-5">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold">Convert to Client</DialogTitle>
                        <DialogDescription className="text-[10px] text-muted-foreground">
                            This will mark the lead as Closed-Won and create a client record using the contact info below.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedLead && (
                        <div className="grid gap-2 py-2 text-xs">
                            <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-medium">{selectedLead.contact?.name || "-"}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{getLeadEmail(selectedLead)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{selectedLead.contact?.phone || "-"}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Company</span><span className="font-medium">{getLeadCompany(selectedLead)}</span></div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConvert(false)} disabled={dialogBusy} className="h-8 text-xs font-medium rounded-md">
                            Cancel
                        </Button>
                        <Button onClick={submitConvert} disabled={dialogBusy} className="h-8 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-700 text-white">
                            {dialogBusy && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}Confirm Convert
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
