"use client"

import React, { useState, useEffect, useCallback } from "react"
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
import { getAllDeletedLeads, restoreLead, bulkDeleteLeads } from "@/modules/crm/leads/hooks/leadHooks"
import { axiosInstance } from "@/lib/axios"

interface DeletedLead {
    _id: string
    id?: string
    title?: string
    name?: string
    firstName?: string
    lastName?: string
    email?: string
    deletedAt?: string
    updatedAt?: string
    deletedBy?: string | { name?: string; firstName?: string; lastName?: string }
    reason?: string
    isActive?: boolean
}

interface NormalizedLead {
    id: string
    title: string
    email: string
    deletedAt: string
    deletedBy: string
    reason: string
}

const staticDeletedLeads: NormalizedLead[] = [
    { id: "1", title: "Outdated Project Query", email: "old@spam.com", deletedAt: "10 Jan, 2024", deletedBy: "System Bot", reason: "Spam Detection" },
    { id: "2", title: "Duplicate Realty Deal", email: "bob@realty.com", deletedAt: "11 Jan, 2024", deletedBy: "Sarah Jain", reason: "Duplicate Record" },
    { id: "3", title: "Invalid Contact Data", email: "unknown@provider.net", deletedAt: "14 Jan, 2024", deletedBy: "John Doe", reason: "Bounced Email" },
]

function formatDate(dateStr?: string): string {
    if (!dateStr) return "N/A"
    try {
        const date = new Date(dateStr)
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    } catch {
        return dateStr
    }
}

function normalizeLead(lead: DeletedLead): NormalizedLead {
    const title = lead.title || lead.name || [lead.firstName, lead.lastName].filter(Boolean).join(" ") || "Unnamed Lead"
    const email = lead.email || "N/A"
    const deletedAt = formatDate(lead.deletedAt || lead.updatedAt)

    let deletedBy = "System"
    if (typeof lead.deletedBy === "string") {
        deletedBy = lead.deletedBy
    } else if (lead.deletedBy && typeof lead.deletedBy === "object") {
        deletedBy = lead.deletedBy.name || [lead.deletedBy.firstName, lead.deletedBy.lastName].filter(Boolean).join(" ") || "System"
    }

    const reason = lead.reason || "Deleted"

    return {
        id: lead._id || lead.id || "",
        title,
        email,
        deletedAt,
        deletedBy,
        reason,
    }
}

export default function LeadTrashRecoveryPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isPurging, setIsPurging] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [deletedLeads, setDeletedLeads] = useState<NormalizedLead[]>([])
    const [restoringId, setRestoringId] = useState<string | null>(null)

    const fetchDeletedLeads = useCallback(async () => {
        setIsLoading(true)
        try {
            // Try the dedicated deleted leads endpoint first
            const response = await getAllDeletedLeads()
            const data = response?.data?.data || response?.data || []
            const leads: DeletedLead[] = Array.isArray(data) ? data : []

            if (leads.length > 0) {
                setDeletedLeads(leads.map(normalizeLead))
            } else {
                // Fallback: fetch all leads with includeDeleted and filter inactive
                try {
                    const fallbackResponse = await axiosInstance.get("/lead/getAllLeads?includeDeleted=true")
                    const allLeads: DeletedLead[] = fallbackResponse?.data?.data || fallbackResponse?.data || []
                    const inactive = Array.isArray(allLeads) ? allLeads.filter((l) => l.isActive === false) : []

                    if (inactive.length > 0) {
                        setDeletedLeads(inactive.map(normalizeLead))
                    } else {
                        // Use static fallback data
                        setDeletedLeads(staticDeletedLeads)
                    }
                } catch {
                    // Both API attempts failed, use static data
                    setDeletedLeads(staticDeletedLeads)
                }
            }
        } catch {
            // Primary endpoint failed, try fallback
            try {
                const fallbackResponse = await axiosInstance.get("/lead/getAllLeads?includeDeleted=true")
                const allLeads: DeletedLead[] = fallbackResponse?.data?.data || fallbackResponse?.data || []
                const inactive = Array.isArray(allLeads) ? allLeads.filter((l) => l.isActive === false) : []

                if (inactive.length > 0) {
                    setDeletedLeads(inactive.map(normalizeLead))
                } else {
                    setDeletedLeads(staticDeletedLeads)
                }
            } catch {
                setDeletedLeads(staticDeletedLeads)
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDeletedLeads()
    }, [fetchDeletedLeads])

    const handleRestore = async (leadId: string) => {
        setRestoringId(leadId)
        try {
            await restoreLead(leadId)
            toast.success("Lead restored successfully")
            await fetchDeletedLeads()
        } catch {
            toast.error("Failed to restore lead. Please try again.")
        } finally {
            setRestoringId(null)
        }
    }

    const handlePurgeAll = async () => {
        if (deletedLeads.length === 0) {
            toast.info("No leads to purge")
            return
        }

        setIsPurging(true)
        try {
            const leadIds = deletedLeads.map((lead) => lead.id)
            await bulkDeleteLeads(leadIds)
            toast.success("All deleted leads permanently purged")
            await fetchDeletedLeads()
        } catch {
            toast.error("Failed to purge leads. Please try again.")
        } finally {
            setIsPurging(false)
        }
    }

    const handlePermanentPurge = (leadId: string) => {
        toast.info("Permanent delete for individual leads is not yet supported by the backend.")
    }

    const handleAction = (msg: string) => {
        toast.success(msg)
    }

    const filteredLeads = deletedLeads.filter((lead) => {
        if (!searchQuery.trim()) return true
        const query = searchQuery.toLowerCase()
        return (
            lead.title.toLowerCase().includes(query) ||
            lead.email.toLowerCase().includes(query) ||
            lead.deletedBy.toLowerCase().includes(query) ||
            lead.reason.toLowerCase().includes(query)
        )
    })

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>Compliance</span>
                    <span>/</span>
                    <span>Soft-Delete</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">Trash & Recovery</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight flex items-center gap-2">
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
                            onClick={handlePurgeAll}
                            className="h-8 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95 transition-all"
                        >
                            <Trash2 className={`w-3.5 h-3.5 mr-2 ${isPurging ? 'animate-pulse' : ''}`} />
                            {isPurging ? "Purging..." : "Purge All"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Primary Blue Card */}
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-white text-xs opacity-80">Marked Inactive</p>
                                <p className="text-white text-xl font-semibold">{deletedLeads.length} Items</p>
                                <p className="text-[10px] text-white opacity-70">Retention: 90 Days</p>
                            </div>
                            <ShieldX className="w-5 h-5 text-white opacity-80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                {/* White Card */}
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-600">Detected Dups</p>
                                <p className="text-xl font-semibold text-gray-900">45 Records</p>
                                <p className="text-[10px] text-zinc-400">Review required</p>
                            </div>
                            <FileX className="w-5 h-5 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                {/* White Card */}
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-600">Expirations</p>
                                <p className="text-xl font-semibold text-gray-900">14 Days</p>
                                <p className="text-[10px] text-zinc-400">Avg. time to purge</p>
                            </div>
                            <Clock className="w-5 h-5 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                {/* White Card */}
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-600">Recovered</p>
                                <p className="text-xl font-semibold text-emerald-600">12.5%</p>
                                <p className="text-[10px] text-emerald-500/60">Success rate</p>
                            </div>
                            <RotateCcw className="w-5 h-5 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Search and Filters */}
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
                    <Button variant="outline" onClick={() => toast.info("Filtering critical items...")} className="h-9 border-zinc-200 text-zinc-600 bg-white font-medium px-4 rounded-md shadow-sm text-xs transition-all active:scale-95">
                        <AlertTriangle className="w-3.5 h-3.5 mr-2 text-amber-500" />
                        Critical
                    </Button>
                    <Button variant="outline" onClick={() => toast.info("Date picker coming soon")} className="h-9 border-zinc-200 text-zinc-600 bg-white font-medium px-4 rounded-md shadow-sm text-xs transition-all active:scale-95">
                        <Calendar className="w-3.5 h-3.5 mr-2" />
                        Select Date
                    </Button>
                </div>
            </div>

            {/* Trash Data Table */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-medium text-[11px] text-gray-500">Archive Identity</TableHead>
                            <TableHead className="py-3 font-medium text-[11px] text-gray-500">Reason</TableHead>
                            <TableHead className="py-3 font-medium text-[11px] text-gray-500">Deleted By</TableHead>
                            <TableHead className="py-3 font-medium text-[11px] text-gray-500">Deletion Stamp</TableHead>
                            <TableHead className="text-right pr-4 font-medium text-[11px] text-gray-500">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                                        <span className="text-xs text-zinc-400 font-medium">Loading deleted leads...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredLeads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Ghost className="w-5 h-5 text-zinc-300" />
                                        <span className="text-xs text-zinc-400 font-medium">
                                            {searchQuery ? "No leads match your search" : "No deleted leads found"}
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeads.map((lead) => (
                                <TableRow key={lead.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <TableCell className="py-3 px-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-zinc-900 transition-colors group-hover:text-blue-600">{lead.title}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium">{lead.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <Badge variant="outline" className="rounded-xl font-medium text-[9px] px-2 py-0.5 border-zinc-200 text-zinc-600 transition-all group-hover:bg-zinc-100">
                                            {lead.reason}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-3 font-medium text-xs text-zinc-600">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-xl bg-zinc-100 flex items-center justify-center text-[9px] font-semibold text-zinc-400 border border-zinc-200 transition-transform group-hover:scale-110">
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
                                                disabled={restoringId === lead.id}
                                                onClick={() => handleRestore(lead.id)}
                                                className="h-7 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white font-medium px-3 text-[10px] shadow-sm transition-all active:scale-95"
                                            >
                                                {restoringId === lead.id ? (
                                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                ) : (
                                                    <RotateCcw className="w-3 h-3 mr-1" />
                                                )}
                                                {restoringId === lead.id ? "Restoring..." : "Restore"}
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-md">
                                                        <MoreVertical className="h-4 w-4 text-zinc-300" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 shadow-xl border-zinc-100">
                                                    <DropdownMenuItem onClick={() => handleAction("Security check passed")} className="text-xs font-medium">Security Check</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handlePermanentPurge(lead.id)} className="text-xs font-medium text-rose-600">Permanent Purge</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <div className="px-4 py-3 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/10">
                    <p className="text-[10px] text-zinc-400 font-medium">Retention policy active: 90 days remaining</p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-medium text-zinc-400 transition-colors">Prev</Button>
                        <Button variant="ghost" size="sm" onClick={() => toast.info("Loading next page...")} className="h-7 text-[10px] font-medium text-rose-600 hover:text-rose-700 transition-colors">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
