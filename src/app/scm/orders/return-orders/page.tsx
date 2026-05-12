"use client"

import * as React from "react"
import { useMemo } from "react"
import Link from "next/link"
import {
    PackageX, Download, ExternalLink, Clock, Truck, CheckCircle2, FileText, ArrowRight,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import {
    useScmReturnsStore,
    type ScmCustomerReturn,
    type CustomerReturnStatus,
} from "@/shared/data/scm/scm-returns-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

type StageKey = "open" | "intransit" | "received" | "resolved" | "rejected"

const STAGE_CONFIG: Record<StageKey, {
    label: string
    description: string
    accent: string
    statuses: CustomerReturnStatus[]
}> = {
    open: {
        label: "Open RMA",
        description: "Approved & awaiting pickup",
        accent: "#f59e0b",
        statuses: ["Requested", "Approved"],
    },
    intransit: {
        label: "In Transit Back",
        description: "Picked up by courier",
        accent: "#3b82f6",
        statuses: ["Picked Up"],
    },
    received: {
        label: "Inspecting",
        description: "Received at warehouse",
        accent: "#8b5cf6",
        statuses: ["Received", "Inspected"],
    },
    resolved: {
        label: "Resolved",
        description: "Refunded or replaced",
        accent: "#10b981",
        statuses: ["Refunded", "Replaced"],
    },
    rejected: {
        label: "Rejected",
        description: "Return denied",
        accent: "#ef4444",
        statuses: ["Rejected"],
    },
}

const STAGES: StageKey[] = ["open", "intransit", "received", "resolved", "rejected"]

const daysAgo = (iso: string) => {
    if (!iso) return 0
    const d = new Date(iso).getTime()
    if (Number.isNaN(d)) return 0
    return Math.max(0, Math.round((Date.now() - d) / (1000 * 60 * 60 * 24)))
}

export default function ReturnOrdersPage() {
    const { toast } = useToast()
    const customerReturns = useScmReturnsStore((s) => s.customerReturns)

    const buckets: Record<StageKey, ScmCustomerReturn[]> = useMemo(() => {
        const out = { open: [], intransit: [], received: [], resolved: [], rejected: [] } as Record<StageKey, ScmCustomerReturn[]>
        for (const r of customerReturns) {
            for (const stage of STAGES) {
                if (STAGE_CONFIG[stage].statuses.includes(r.status)) {
                    out[stage].push(r)
                    break
                }
            }
        }
        for (const k of STAGES) {
            out[k].sort((a, b) => b.returnDate.localeCompare(a.returnDate))
        }
        return out
    }, [customerReturns])

    const kpis = useMemo(() => {
        const open = buckets.open.length + buckets.intransit.length + buckets.received.length
        const refundedValue = customerReturns
            .filter((r) => r.status === "Refunded")
            .reduce((s, r) => s + r.refundAmount, 0)
        const allDays = buckets.resolved.map((r) => daysAgo(r.returnDate))
        const avgCycle = allDays.length === 0 ? 0 : Math.round(allDays.reduce((s, n) => s + n, 0) / allDays.length)
        const oldestOpen = [...buckets.open, ...buckets.intransit, ...buckets.received]
            .map((r) => daysAgo(r.returnDate))
            .reduce((max, n) => Math.max(max, n), 0)
        return { open, refundedValue, avgCycle, oldestOpen }
    }, [buckets, customerReturns])

    const handleExport = () => {
        if (customerReturns.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Stage", "Return #", "Order #", "Customer", "Product", "Qty", "Refund Amount", "Return Date", "Days", "Status"]
        const rows: any[] = []
        for (const stage of STAGES) {
            for (const r of buckets[stage]) {
                rows.push([STAGE_CONFIG[stage].label, r.returnId, r.orderNumber, r.customerName, r.productName, r.quantity, r.refundAmount, r.returnDate, daysAgo(r.returnDate), r.status])
            }
        }
        const escape = (val: any) => { const s = String(val ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-return-orders-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} return orders exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <PackageX className="w-5 h-5 text-[#f59e0b]" /> Return Orders
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Customer return order pipeline — track RMAs from request through refund or replacement.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-none border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Link href="/scm/returns/customer-returns">
                        <Button className="h-9 px-3 rounded-none text-white text-[13px]" style={{ backgroundColor: "#f59e0b", boxShadow: "0 4px 12px #f59e0b33" }}>
                            <FileText className="w-4 h-4 mr-1.5" /> Manage Records
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Open RMAs" value={kpis.open} icon={<Clock className="w-4 h-4" />} accent="#f59e0b" helper={kpis.open === 0 ? "all caught up" : "in pipeline"} />
                <Stat label="Refunded Value" value={formatINR(kpis.refundedValue)} icon={<CheckCircle2 className="w-4 h-4" />} accent="#10b981" helper="paid back to customers" />
                <Stat label="Avg Cycle (days)" value={kpis.avgCycle} icon={<Truck className="w-4 h-4" />} accent="#3b82f6" helper="request → resolved" />
                <Stat label="Oldest Open RMA" value={`${kpis.oldestOpen}d`} icon={<PackageX className="w-4 h-4" />} accent="#ef4444" helper={kpis.oldestOpen >= 14 ? "needs attention" : "within SLA"} />
            </div>

            {/* Pipeline */}
            <div className="border bg-white shadow-sm rounded-none">
                <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                    <span className="w-1 h-9 bg-amber-500 shrink-0" />
                    <div>
                        <h3 className="text-[14px] font-semibold text-[#0F172A]">RMA Pipeline</h3>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Returns grouped by stage — click any card to manage the underlying record</p>
                    </div>
                </div>

                {customerReturns.length === 0 ? (
                    <div className="p-10 text-center">
                        <PackageX className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-[13px] font-semibold text-[#0F172A]">No return orders yet</p>
                        <p className="text-[12px] text-[#64748B] mt-1">
                            Returns recorded under Returns Management → Customer Returns will appear here as a workflow pipeline.
                        </p>
                        <Link href="/scm/returns/customer-returns" className="inline-flex items-center gap-1 text-[12px] font-semibold text-amber-700 hover:underline mt-3">
                            Create a return <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-0 divide-x divide-[#EEF1F6]">
                        {STAGES.map((key) => {
                            const stage = STAGE_CONFIG[key]
                            const items = buckets[key]
                            return (
                                <div key={key} className="flex flex-col min-h-[400px] bg-slate-50/30">
                                    <div className="px-3 py-2.5 border-b border-[#EEF1F6] bg-white">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <span className="w-2 h-2 shrink-0" style={{ background: stage.accent }} />
                                                <p className="text-[11.5px] font-bold text-[#0F172A] truncate">{stage.label}</p>
                                            </div>
                                            <span
                                                className="text-[10.5px] font-bold px-1.5 py-0.5 tabular-nums"
                                                style={{ background: `${stage.accent}1a`, color: stage.accent }}
                                            >
                                                {items.length}
                                            </span>
                                        </div>
                                        <p className="text-[10.5px] text-[#94A3B8] mt-0.5 truncate">{stage.description}</p>
                                    </div>
                                    <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                                        {items.length === 0 ? (
                                            <p className="text-[11px] text-[#94A3B8] text-center py-6">—</p>
                                        ) : (
                                            items.map((r) => (
                                                <Link
                                                    key={r.id}
                                                    href={`/scm/returns/customer-returns?return=${encodeURIComponent(r.returnId)}`}
                                                    className="block bg-white border p-2.5 hover:shadow-md transition-all group"
                                                    style={{ borderColor: `${stage.accent}33`, borderLeftWidth: 3, borderLeftColor: stage.accent }}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-mono text-[10.5px] font-bold text-[#0F172A]">{r.returnId}</span>
                                                        <span className="text-[10px] text-[#94A3B8] tabular-nums">{daysAgo(r.returnDate)}d</span>
                                                    </div>
                                                    <p className="text-[12px] font-semibold text-[#0F172A] mt-1 truncate">{r.customerName}</p>
                                                    <p className="text-[10.5px] text-[#64748B] truncate">
                                                        {r.productName}
                                                    </p>
                                                    <p className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                                                        Order {r.orderNumber} · qty {r.quantity}
                                                    </p>
                                                    <div className="mt-1.5 pt-1.5 border-t border-[#F1F5F9] flex items-center justify-between gap-1">
                                                        <span className="text-[10.5px] font-bold tabular-nums" style={{ color: stage.accent }}>
                                                            {formatINR(r.refundAmount)}
                                                        </span>
                                                        <ArrowRight className="w-3 h-3 text-[#cbd5e1] group-hover:text-[#64748b] group-hover:translate-x-0.5 transition-all" />
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Reason breakdown */}
            {customerReturns.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="border bg-white shadow-sm rounded-none">
                        <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                            <span className="w-1 h-9 bg-violet-500 shrink-0" />
                            <div>
                                <h3 className="text-[14px] font-semibold text-[#0F172A]">Top Return Reasons</h3>
                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Why customers are returning</p>
                            </div>
                        </div>
                        <ul className="divide-y divide-[#F1F5F9]">
                            {Object.entries(
                                customerReturns.reduce<Record<string, number>>((acc, r) => {
                                    acc[r.reason] = (acc[r.reason] ?? 0) + 1
                                    return acc
                                }, {})
                            )
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                                .map(([reason, count]) => {
                                    const pct = (count / customerReturns.length) * 100
                                    return (
                                        <li key={reason} className="px-5 py-3">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span className="text-[12.5px] font-medium text-[#0F172A] truncate">{reason}</span>
                                                <span className="text-[11.5px] font-bold tabular-nums text-[#0F172A] shrink-0">{count}</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 overflow-hidden">
                                                <div className="h-full bg-violet-500" style={{ width: `${pct}%` }} />
                                            </div>
                                        </li>
                                    )
                                })}
                        </ul>
                    </div>

                    <div className="border bg-white shadow-sm rounded-none">
                        <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                            <span className="w-1 h-9 bg-emerald-500 shrink-0" />
                            <div>
                                <h3 className="text-[14px] font-semibold text-[#0F172A]">Resolution Mix</h3>
                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">How resolved RMAs were closed</p>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            {(() => {
                                const refunded = customerReturns.filter((r) => r.status === "Refunded").length
                                const replaced = customerReturns.filter((r) => r.status === "Replaced").length
                                const rejected = customerReturns.filter((r) => r.status === "Rejected").length
                                const total = refunded + replaced + rejected || 1
                                return (
                                    <>
                                        <ResolutionRow label="Refunded" count={refunded} pct={(refunded / total) * 100} color="#10b981" />
                                        <ResolutionRow label="Replaced" count={replaced} pct={(replaced / total) * 100} color="#3b82f6" />
                                        <ResolutionRow label="Rejected" count={rejected} pct={(rejected / total) * 100} color="#ef4444" />
                                    </>
                                )
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function Stat({
    label, value, icon, accent, helper,
}: {
    label: string
    value: string | number
    icon: React.ReactNode
    accent: string
    helper?: string
}) {
    return (
        <div
            className="border shadow-sm p-4 rounded-none"
            style={{
                background: `linear-gradient(135deg, ${accent}14 0%, ${accent}06 45%, #ffffff 100%)`,
                borderColor: `${accent}33`,
            }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-[#64748B] truncate">{label}</p>
                    <p className="mt-1.5 text-[20px] font-bold leading-tight tabular-nums truncate" style={{ color: accent }}>
                        {value}
                    </p>
                    {helper && <p className="text-[11px] text-[#94A3B8] mt-1 truncate">{helper}</p>}
                </div>
                <div
                    className="w-9 h-9 flex items-center justify-center shrink-0 text-white rounded-none"
                    style={{ background: accent, boxShadow: `0 4px 12px ${accent}33` }}
                >
                    {icon}
                </div>
            </div>
        </div>
    )
}

function ResolutionRow({ label, count, pct, color }: { label: string; count: number; pct: number; color: string }) {
    return (
        <div>
            <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[12.5px] font-medium text-[#0F172A]">{label}</span>
                <span className="text-[11.5px] tabular-nums">
                    <span className="font-bold" style={{ color }}>{count}</span>
                    <span className="text-[#94A3B8] ml-1">({pct.toFixed(0)}%)</span>
                </span>
            </div>
            <div className="h-1.5 bg-slate-100 overflow-hidden">
                <div className="h-full" style={{ width: `${pct}%`, background: color }} />
            </div>
        </div>
    )
}
