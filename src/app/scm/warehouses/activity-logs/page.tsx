"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Download, Activity, ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, Sliders, Search, Filter } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

import { useScmStockMovementsStore } from "@/shared/data/scm/scm-stock-movements-store"
import { useScmWarehouseOpsStore } from "@/shared/data/scm/scm-warehouse-ops-store"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"

type ActivityType = "Stock In" | "Stock Out" | "Transfer" | "Adjustment"

interface LogRow {
    id: string
    timestamp: string
    warehouse: string
    activityType: ActivityType
    user: string
    referenceNumber: string
    description: string
}

const TYPE_META: Record<ActivityType, { color: string; bg: string; icon: React.ReactNode }> = {
    "Stock In": { color: "#10b981", bg: "#ecfdf5", icon: <ArrowDownToLine className="w-3.5 h-3.5" /> },
    "Stock Out": { color: "#f59e0b", bg: "#fffbeb", icon: <ArrowUpFromLine className="w-3.5 h-3.5" /> },
    "Transfer": { color: "#0ea5e9", bg: "#f0f9ff", icon: <ArrowRightLeft className="w-3.5 h-3.5" /> },
    "Adjustment": { color: "#8b5cf6", bg: "#f5f3ff", icon: <Sliders className="w-3.5 h-3.5" /> },
}

export default function ActivityLogsPage() {
    const { toast } = useToast()
    const movements = useScmStockMovementsStore((s) => s.movements)
    const transfers = useScmWarehouseOpsStore((s) => s.transfers)
    const adjustments = useScmWarehouseOpsStore((s) => s.adjustments)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)

    const [warehouseFilter, setWarehouseFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState<"all" | ActivityType>("all")
    const [search, setSearch] = useState("")

    const allLogs: LogRow[] = useMemo(() => {
        const fromMovements: LogRow[] = movements.map((m) => ({
            id: `mov_${m.id}`,
            timestamp: m.movementDate,
            warehouse: m.warehouse,
            activityType: m.direction === "in" ? "Stock In" : "Stock Out",
            user: m.supplier ?? m.issuedTo ?? "System",
            referenceNumber: m.referenceNumber || m.poNumber || "—",
            description: `${m.direction === "in" ? "+" : "−"}${m.quantity} ${m.productName} (${m.sku})`,
        }))
        const fromTransfers: LogRow[] = transfers.map((t) => ({
            id: `trf_${t.id}`,
            timestamp: t.transferDate,
            warehouse: t.fromWarehouse,
            activityType: "Transfer",
            user: "System",
            referenceNumber: t.transferNumber,
            description: `${t.quantity} × ${t.productName} → ${t.toWarehouse}`,
        }))
        const fromAdjustments: LogRow[] = adjustments.map((a) => ({
            id: `adj_${a.id}`,
            timestamp: a.adjustmentDate,
            warehouse: a.warehouse,
            activityType: "Adjustment",
            user: a.approvedBy,
            referenceNumber: a.adjustmentNumber,
            description: `${a.adjustmentType}: ${a.currentQuantity} → ${a.adjustedQuantity} (${a.productName})`,
        }))
        return [...fromMovements, ...fromTransfers, ...fromAdjustments].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    }, [movements, transfers, adjustments])

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return allLogs.filter((l) => {
            if (warehouseFilter !== "all" && l.warehouse !== warehouseFilter) return false
            if (typeFilter !== "all" && l.activityType !== typeFilter) return false
            if (!q) return true
            return (
                l.warehouse.toLowerCase().includes(q) ||
                l.activityType.toLowerCase().includes(q) ||
                l.user.toLowerCase().includes(q) ||
                l.referenceNumber.toLowerCase().includes(q) ||
                l.description.toLowerCase().includes(q)
            )
        })
    }, [allLogs, warehouseFilter, typeFilter, search])

    // Group by date
    const grouped = useMemo(() => {
        const groups = new Map<string, LogRow[]>()
        for (const l of filtered) {
            if (!groups.has(l.timestamp)) groups.set(l.timestamp, [])
            groups.get(l.timestamp)!.push(l)
        }
        return Array.from(groups.entries())
    }, [filtered])

    const summary = useMemo(() => ({
        total: allLogs.length,
        in: allLogs.filter((l) => l.activityType === "Stock In").length,
        out: allLogs.filter((l) => l.activityType === "Stock Out").length,
        transfer: allLogs.filter((l) => l.activityType === "Transfer").length,
        adjust: allLogs.filter((l) => l.activityType === "Adjustment").length,
    }), [allLogs])

    const formatDateLabel = (d: string) => {
        const date = new Date(d)
        const today = new Date(); today.setHours(0, 0, 0, 0)
        const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)
        if (date.toDateString() === today.toDateString()) return "Today"
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
        return date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })
    }

    const handleExport = () => {
        if (filtered.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Date", "Log ID", "Warehouse", "Activity", "User", "Reference", "Description"]
        const rows = filtered.map((l) => [l.timestamp, l.id, l.warehouse, l.activityType, l.user, l.referenceNumber, l.description])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-activity-logs-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} logs exported` })
    }

    const clearFilters = () => { setWarehouseFilter("all"); setTypeFilter("all"); setSearch("") }
    const hasActiveFilters = warehouseFilter !== "all" || typeFilter !== "all" || search.trim() !== ""

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#0ea5e9]" /> Warehouse Activity Logs
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Chronological audit trail of all warehouse activities.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Stat label="Total Activities" value={summary.total} color="#0ea5e9" icon={<Activity className="w-4 h-4" />} />
                <Stat label="Stock In" value={summary.in} color="#10b981" icon={<ArrowDownToLine className="w-4 h-4" />} />
                <Stat label="Stock Out" value={summary.out} color="#f59e0b" icon={<ArrowUpFromLine className="w-4 h-4" />} />
                <Stat label="Transfers" value={summary.transfer} color="#0ea5e9" icon={<ArrowRightLeft className="w-4 h-4" />} />
                <Stat label="Adjustments" value={summary.adjust} color="#8b5cf6" icon={<Sliders className="w-4 h-4" />} />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-3 flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs..." className="pl-8 h-9 border-[#E5E7EB] text-[13px]" />
                </div>
                <span className="text-[12px] font-medium text-[#64748B] inline-flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" /> Filters:</span>
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                    <SelectTrigger className="h-9 w-[200px] border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All warehouses</SelectItem>
                        {warehouses.map((w) => <SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                    <SelectTrigger className="h-9 w-[180px] border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All activities</SelectItem>
                        <SelectItem value="Stock In">Stock In</SelectItem>
                        <SelectItem value="Stock Out">Stock Out</SelectItem>
                        <SelectItem value="Transfer">Transfer</SelectItem>
                        <SelectItem value="Adjustment">Adjustment</SelectItem>
                    </SelectContent>
                </Select>
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters} className="h-9 text-[13px] text-[#64748B]">Clear</Button>
                )}
                <span className="ml-auto text-[12px] text-[#64748B]">{filtered.length} log{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Timeline */}
            {grouped.length === 0 ? (
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-12 text-center">
                    <p className="text-[13px] text-[#64748B]">No activity logs match the current filters.</p>
                </div>
            ) : (
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-5">
                    <div className="space-y-6">
                        {grouped.map(([date, logs]) => (
                            <div key={date}>
                                {/* Date header */}
                                <div className="flex items-center gap-3 mb-3 sticky top-0 bg-white z-10 py-1">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#EEF1F6] text-[12px] font-semibold text-[#0F172A]">
                                        {formatDateLabel(date)}
                                    </span>
                                    <span className="text-[11px] text-[#94A3B8] tabular-nums">{date}</span>
                                    <span className="text-[11px] text-[#94A3B8]">· {logs.length} {logs.length === 1 ? "activity" : "activities"}</span>
                                    <div className="flex-1 h-px bg-[#EEF1F6]" />
                                </div>

                                {/* Timeline entries for this date */}
                                <ol className="relative border-l-2 border-[#EEF1F6] ml-4 space-y-3">
                                    {logs.map((log) => {
                                        const meta = TYPE_META[log.activityType]
                                        return (
                                            <li key={log.id} className="ml-6 relative">
                                                {/* Dot on the line */}
                                                <span
                                                    className="absolute -left-[34px] top-1 w-7 h-7 rounded-full ring-4 ring-white flex items-center justify-center text-white shadow-sm"
                                                    style={{ backgroundColor: meta.color }}
                                                >
                                                    {meta.icon}
                                                </span>

                                                {/* Entry card */}
                                                <div
                                                    className={cn(
                                                        "rounded-none border border-[#EEF1F6] p-3 hover:shadow-sm transition-all border-l-[3px]"
                                                    )}
                                                    style={{ borderLeftColor: meta.color, backgroundColor: meta.bg }}
                                                >
                                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span
                                                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold text-white"
                                                                    style={{ backgroundColor: meta.color }}
                                                                >
                                                                    {log.activityType}
                                                                </span>
                                                                <span className="font-mono text-[11.5px] text-[#64748B]">{log.referenceNumber}</span>
                                                                <span className="text-[11px] text-[#94A3B8]">·</span>
                                                                <span className="text-[11.5px] text-[#64748B]">{log.warehouse}</span>
                                                            </div>
                                                            <p className="text-[13px] text-[#0F172A] mt-1 font-medium">{log.description}</p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide">User</p>
                                                            <p className="text-[12px] font-medium text-[#0F172A]">{log.user}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ol>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function Stat({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
    return (
        <div
            className="rounded-none border shadow-sm p-4 flex items-center justify-between gap-2 transition-all duration-200"
            style={{
                background: `linear-gradient(135deg, ${color}14 0%, ${color}06 45%, #ffffff 100%)`,
                borderColor: `${color}33`,
            }}
        >
            <div className="min-w-0">
                <p className="text-[11.5px] font-medium text-[#64748B] truncate">{label}</p>
                <p className="text-[20px] font-semibold mt-0.5 tabular-nums leading-tight" style={{ color }}>{value}</p>
            </div>
            <div className="w-9 h-9 rounded-none flex items-center justify-center text-white shrink-0" style={{ backgroundColor: color, boxShadow: `0 4px 12px ${color}33` }}>
                {icon}
            </div>
        </div>
    )
}
