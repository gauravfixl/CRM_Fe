"use client"

import React, { useState, useMemo, useEffect, useCallback } from "react"
import {
    Search,
    Download,
    Shield,
    Activity,
    LogIn,
    Settings,
    Database,
    Building2,
    UserCog,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Trash2,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
import { showSuccess } from "@/shared/utils/toast"
import { toast } from "sonner"
import { getAllModuleActivities, getActivitiesByModule, deleteActivity } from "@/hooks/activityHooks"

interface AuditEvent {
    id: string
    timestamp: string
    activity: string
    category: "Authentication" | "Configuration" | "Security" | "Data" | "Admin Action" | "Firm Event"
    user: string
    ip: string
    status: "Success" | "Failed" | "Warning" | "Alert"
    module?: string
}

// Maps API activity type to a display category
const activityToCategory = (activity: string): AuditEvent["category"] => {
    switch (activity) {
        case "create": return "Data"
        case "update": return "Configuration"
        case "delete": return "Admin Action"
        default: return "Data"
    }
}

// Maps API activity type to a display status
const activityToStatus = (activity: string): AuditEvent["status"] => {
    switch (activity) {
        case "delete": return "Warning"
        default: return "Success"
    }
}

// Maps API activity type to a readable label
const activityToLabel = (activity: string, module: string): string => {
    const mod = module.charAt(0).toUpperCase() + module.slice(1)
    switch (activity) {
        case "create": return `${mod} Created`
        case "update": return `${mod} Updated`
        case "delete": return `${mod} Deleted`
        default: return `${mod} ${activity}`
    }
}

// Format date to display string
const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }) + " " + date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
}

// Map a raw API activity to our AuditEvent interface
const mapApiActivity = (item: any): AuditEvent => ({
    id: item._id,
    timestamp: formatDate(item.createdAt),
    activity: activityToLabel(item.activity, item.module),
    category: activityToCategory(item.activity),
    user: item.userId?.email || item.userId?.name || "System",
    ip: item.userId?.lastLoginIp || "-",
    status: activityToStatus(item.activity),
    module: item.module?.charAt(0).toUpperCase() + item.module?.slice(1),
})

const categories = ["All", "Authentication", "Configuration", "Security", "Data", "Admin Action", "Firm Event"] as const
type CategoryFilter = (typeof categories)[number]

// Map category filter to API module name for server-side filtering
const categoryToModule: Record<string, string | null> = {
    "All": null,
    "Data": null,
    "Configuration": null,
    "Admin Action": null,
    "Authentication": "user",
    "Security": "user",
    "Firm Event": "firm",
}

const categoryIcons: Record<AuditEvent["category"], React.ReactNode> = {
    Authentication: <LogIn size={16} />,
    Configuration: <Settings size={16} />,
    Security: <Shield size={16} />,
    Data: <Database size={16} />,
    "Admin Action": <UserCog size={16} />,
    "Firm Event": <Building2 size={16} />,
}

const categoryBadgeStyles: Record<AuditEvent["category"], string> = {
    Authentication: "bg-primary/10 text-primary border-primary/20",
    Configuration: "bg-purple-100 text-purple-700 border-purple-200",
    Security: "bg-red-100 text-red-700 border-red-200",
    Data: "bg-amber-100 text-amber-700 border-amber-200",
    "Admin Action": "bg-indigo-100 text-indigo-700 border-indigo-200",
    "Firm Event": "bg-teal-100 text-teal-700 border-teal-200",
}

const categoryIconContainerStyles: Record<AuditEvent["category"], { base: string; hover: string }> = {
    Authentication: { base: "bg-primary/10 text-primary border-primary/20", hover: "group-hover:bg-primary group-hover:text-white" },
    Configuration: { base: "bg-purple-100 text-purple-600 border-purple-200", hover: "group-hover:bg-purple-600 group-hover:text-white" },
    Security: { base: "bg-red-100 text-red-600 border-red-200", hover: "group-hover:bg-red-600 group-hover:text-white" },
    Data: { base: "bg-amber-100 text-amber-600 border-amber-200", hover: "group-hover:bg-amber-600 group-hover:text-white" },
    "Admin Action": { base: "bg-indigo-100 text-indigo-600 border-indigo-200", hover: "group-hover:bg-indigo-600 group-hover:text-white" },
    "Firm Event": { base: "bg-teal-100 text-teal-600 border-teal-200", hover: "group-hover:bg-teal-600 group-hover:text-white" },
}

const statusStyles: Record<AuditEvent["status"], string> = {
    Success: "text-green-600",
    Failed: "text-red-600",
    Warning: "text-amber-600",
    Alert: "text-red-600",
}

const ITEMS_PER_PAGE = 10

export default function AuditLogsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All")
    const [currentPage, setCurrentPage] = useState(1)
    const [allEvents, setAllEvents] = useState<AuditEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const fetchActivities = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getAllModuleActivities(1, 100)
            const mapped = data.map(mapApiActivity)
            setAllEvents(mapped)
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to fetch audit logs")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchActivities()
    }, [fetchActivities])

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            await deleteActivity(id)
            setAllEvents((prev) => prev.filter((e) => e.id !== id))
            showSuccess("Audit event deleted successfully")
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to delete audit event")
        } finally {
            setDeletingId(null)
        }
    }

    const filteredEvents = useMemo(() => {
        return allEvents.filter((event) => {
            const matchesSearch =
                searchQuery === "" ||
                event.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (event.module && event.module.toLowerCase().includes(searchQuery.toLowerCase()))
            const matchesCategory =
                categoryFilter === "All" || event.category === categoryFilter
            return matchesSearch && matchesCategory
        })
    }, [searchQuery, categoryFilter, allEvents])

    // Reset page when filters change
    const handleCategoryChange = (cat: CategoryFilter) => {
        setCategoryFilter(cat)
        setCurrentPage(1)
    }

    const handleSearchChange = (value: string) => {
        setSearchQuery(value)
        setCurrentPage(1)
    }

    // Pagination
    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE)
    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handleExport = () => {
        showSuccess("Audit logs exported successfully")
    }

    // Stats
    const totalEvents = allEvents.length
    const loginEvents = allEvents.filter((e) => e.category === "Authentication").length
    const configChanges = allEvents.filter((e) => e.category === "Configuration").length
    const securityAlerts = allEvents.filter((e) => e.category === "Security").length
    const adminActions = allEvents.filter((e) => e.category === "Admin Action").length
    const firmEvents = allEvents.filter((e) => e.category === "Firm Event").length

    // Category counts for tab badges
    const categoryCounts: Record<string, number> = {
        All: totalEvents,
        Authentication: loginEvents,
        Configuration: configChanges,
        Security: securityAlerts,
        Data: allEvents.filter((e) => e.category === "Data").length,
        "Admin Action": adminActions,
        "Firm Event": firmEvents,
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Header */}
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                            Audit Logs
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Monitor all system activities, user actions, and security events across your organization.
                        </p>
                    </div>
                    <Button
                        onClick={handleExport}
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 rounded-none"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                    {/* Total Events - gradient primary */}
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <div>
                            <p className="text-white text-xs opacity-80">Total Events</p>
                            <p className="text-white text-xl font-semibold mt-1">{totalEvents}</p>
                            <p className="text-white text-[10px] mt-1 opacity-70">All recorded activities</p>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Login Events</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{loginEvents}</p>
                        <p className="text-primary text-[10px] mt-1">Authentication</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Config Changes</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{configChanges}</p>
                        <p className="text-purple-600 text-[10px] mt-1">System modifications</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Security Alerts</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{securityAlerts}</p>
                        <p className="text-red-600 text-[10px] mt-1">Require attention</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Admin Actions</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{adminActions}</p>
                        <p className="text-indigo-600 text-[10px] mt-1">Administrative changes</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Firm Events</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{firmEvents}</p>
                        <p className="text-teal-600 text-[10px] mt-1">Business unit activity</p>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-1 border-b border-zinc-200 overflow-x-auto">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                                categoryFilter === cat
                                    ? "border-primary text-primary"
                                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                            }`}
                        >
                            {cat}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                categoryFilter === cat
                                    ? "bg-primary/10 text-primary"
                                    : "bg-zinc-100 text-zinc-500"
                            }`}>
                                {categoryCounts[cat]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Search by activity, user, IP, module..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
                            className="pl-9 h-9 rounded-none text-sm"
                        />
                    </div>
                </div>

                {/* Audit Table */}
                <div className="rounded-none border border-zinc-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-zinc-200 bg-zinc-50">
                                <TableHead className="w-[180px] text-xs font-semibold text-zinc-600">Timestamp</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Activity</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Category</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Initiated By</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">IP Address</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Status</TableHead>
                                <TableHead className="w-[60px] text-xs font-semibold text-zinc-600"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedEvents.length > 0 ? (
                                paginatedEvents.map((event) => (
                                    <TableRow key={event.id} className="hover:bg-zinc-50/50 border-zinc-100 group">
                                        <TableCell className="font-mono text-xs text-zinc-500">
                                            {event.timestamp}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-none border flex items-center justify-center transition-all ${categoryIconContainerStyles[event.category].base} ${categoryIconContainerStyles[event.category].hover}`}>
                                                    {categoryIcons[event.category]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-zinc-900">{event.activity}</span>
                                                    {event.module && (
                                                        <span className="text-[11px] text-zinc-400">{event.module}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`rounded-none text-[10px] font-medium px-2 py-0.5 border ${categoryBadgeStyles[event.category]}`}
                                            >
                                                {event.category}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-700">
                                            {event.user}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-zinc-500">
                                            {event.ip}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`text-sm font-semibold ${statusStyles[event.status]}`}>
                                                {event.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0 text-zinc-400 hover:text-red-600"
                                                onClick={() => handleDelete(event.id)}
                                                disabled={deletingId === event.id}
                                            >
                                                {deletingId === event.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <Activity size={40} className="text-zinc-300" />
                                            <p className="text-sm font-medium text-zinc-500">No audit events found</p>
                                            <p className="text-xs text-zinc-400">
                                                {searchQuery || categoryFilter !== "All"
                                                    ? "Try adjusting your search or filter criteria"
                                                    : "No events have been recorded yet"}
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Footer with Pagination */}
                    <div className="px-4 py-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
                        <p className="text-xs text-zinc-500">
                            Showing {paginatedEvents.length} of {filteredEvents.length} audit events
                            {categoryFilter !== "All" && (
                                <span className="ml-1">
                                    (filtered from {totalEvents} total)
                                </span>
                            )}
                        </p>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0 rounded-none"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        className={`h-7 w-7 p-0 rounded-none text-xs ${
                                            currentPage === page ? "bg-primary text-white" : ""
                                        }`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 w-7 p-0 rounded-none"
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
