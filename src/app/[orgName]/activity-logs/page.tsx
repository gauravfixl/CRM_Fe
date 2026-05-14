"use client"

import React, { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { Activity, Users, Eye, Clock, Search, Download, Loader2 } from "lucide-react"
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
import { getAllModuleActivities } from "@/hooks/activityHooks"

interface ActivityLog {
    id: string
    timestamp: string
    user: string
    initials: string
    action: string
    resource: string
    ip: string
    location: string
}

// Map API activity type to display action
const mapActivityToAction = (activity: string): string => {
    switch (activity) {
        case "create": return "Create"
        case "update": return "Update"
        case "delete": return "Delete"
        default: return activity.charAt(0).toUpperCase() + activity.slice(1)
    }
}

// Get initials from a name string
const getInitials = (name: string): string => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
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

// Map raw API activity to our ActivityLog interface
const mapApiActivity = (item: any): ActivityLog => {
    const userName = item.userId?.name || item.userId?.email || "System"
    return {
        id: item._id,
        timestamp: formatDate(item.createdAt),
        user: userName,
        initials: getInitials(userName),
        action: mapActivityToAction(item.activity),
        resource: `/${item.module}${item.description ? " - " + item.description : ""}`,
        ip: item.userId?.lastLoginIp || "-",
        location: "-",
    }
}

const actionTypes = ["All", "Create", "Update", "Delete"]

const actionBadgeClasses: Record<string, string> = {
    "Page View": "bg-zinc-100 text-zinc-700 border-zinc-200",
    "Create": "bg-green-100 text-green-700 border-green-200",
    "Update": "bg-primary/10 text-primary border-primary/20",
    "Delete": "bg-red-100 text-red-700 border-red-200",
    "Export": "bg-amber-100 text-amber-700 border-amber-200",
    "Login": "bg-purple-100 text-purple-700 border-purple-200",
}

export default function ActivityLogsPage() {
    const router = useRouter()
    const params = useParams()
    const orgName = (params?.orgName as string) || ""

    const [search, setSearch] = useState("")
    const [actionFilter, setActionFilter] = useState("All")
    const [activityData, setActivityData] = useState<ActivityLog[]>([])
    const [loading, setLoading] = useState(true)

    const fetchActivities = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getAllModuleActivities(1, 100)
            const mapped = data.map(mapApiActivity)
            setActivityData(mapped)
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to fetch activity logs")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchActivities()
    }, [fetchActivities])

    const filteredData = useMemo(() => {
        return activityData.filter((item) => {
            const matchesSearch =
                search === "" ||
                item.user.toLowerCase().includes(search.toLowerCase()) ||
                item.resource.toLowerCase().includes(search.toLowerCase()) ||
                item.action.toLowerCase().includes(search.toLowerCase()) ||
                item.ip.toLowerCase().includes(search.toLowerCase())

            const matchesAction =
                actionFilter === "All" || item.action === actionFilter

            return matchesSearch && matchesAction
        })
    }, [search, actionFilter, activityData])

    const uniqueUsersToday = useMemo(() => {
        const users = new Set(activityData.map((item) => item.user))
        return users.size
    }, [activityData])

    const totalActions = activityData.length

    const pageViews = useMemo(() => {
        return activityData.filter((item) => item.action === "Page View").length
    }, [activityData])

    const handleExport = () => {
        const header = ["Timestamp", "User", "Action", "Resource", "IP", "Location"]
        const rows = filteredData.map((item) => [
            item.timestamp || "",
            item.user || "",
            item.action || "",
            item.resource || "",
            item.ip || "",
            item.location || "",
        ])
        const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`
        const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `activity-logs-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        showSuccess("Activity logs exported successfully")
    }

    const cycleActionFilter = () => {
        const currentIndex = actionTypes.indexOf(actionFilter)
        const nextIndex = (currentIndex + 1) % actionTypes.length
        setActionFilter(actionTypes[nextIndex])
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
                            User Activity
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Real-time monitoring of user actions across the organization.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 rounded-none"
                        onClick={handleExport}
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Active Users Today - gradient primary */}
                    <button
                        type="button"
                        onClick={() => router.push(`/${orgName}/modules/users`)}
                        className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white text-left cursor-pointer transition-all hover:shadow-2xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">Active Users Today</p>
                                <p className="text-white text-xl font-semibold mt-1">{uniqueUsersToday}</p>
                            </div>
                            <div className="w-10 h-10 rounded-none bg-white/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </button>

                    {/* Total Actions */}
                    <button
                        type="button"
                        onClick={() => setActionFilter("All")}
                        className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left cursor-pointer transition-all hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Total Actions</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{totalActions}</p>
                            </div>
                            <div className="w-10 h-10 rounded-none bg-zinc-100 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-zinc-600" />
                            </div>
                        </div>
                    </button>

                    {/* Page Views */}
                    <button
                        type="button"
                        onClick={() => router.push(`/${orgName}/usage-analytics`)}
                        className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left cursor-pointer transition-all hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Page Views</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">{pageViews}</p>
                            </div>
                            <div className="w-10 h-10 rounded-none bg-zinc-100 flex items-center justify-center">
                                <Eye className="w-5 h-5 text-zinc-600" />
                            </div>
                        </div>
                    </button>

                    {/* Avg. Session Duration */}
                    <button
                        type="button"
                        onClick={() => router.push(`/${orgName}/usage-analytics`)}
                        className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left cursor-pointer transition-all hover:shadow-xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Avg. Session Duration</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">12m</p>
                            </div>
                            <div className="w-10 h-10 rounded-none bg-zinc-100 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-zinc-600" />
                            </div>
                        </div>
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Search by user, resource, action, IP..."
                            value={search}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                            className="pl-9 h-9 rounded-none"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-2 rounded-none"
                        onClick={cycleActionFilter}
                    >
                        {actionFilter === "All" ? "All Actions" : actionFilter}
                    </Button>
                </div>

                {/* Table */}
                <div className="rounded-none border border-zinc-200 bg-white shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-zinc-200 bg-zinc-50">
                                <TableHead className="w-[200px] text-xs font-semibold text-zinc-600">Timestamp</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">User</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Action</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Resource</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">IP Address</TableHead>
                                <TableHead className="text-xs font-semibold text-zinc-600">Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-zinc-50/50 border-zinc-100">
                                        <TableCell className="font-mono text-xs text-zinc-500">
                                            {item.timestamp}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                                    {item.initials}
                                                </div>
                                                <span className="text-sm font-medium text-zinc-900">
                                                    {item.user}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`rounded-none font-normal text-xs ${actionBadgeClasses[item.action] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}
                                            >
                                                {item.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-600 font-mono">
                                            {item.resource}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-zinc-500">
                                            {item.ip}
                                        </TableCell>
                                        <TableCell className="text-sm text-zinc-500">
                                            {item.location}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-sm text-zinc-400">
                                        No activity logs found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-zinc-200 bg-zinc-50">
                        <p className="text-xs text-zinc-500">
                            Showing {filteredData.length} of {activityData.length} activities
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
