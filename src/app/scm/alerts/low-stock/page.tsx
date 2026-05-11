"use client"

import * as React from "react"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
    AlertTriangle, Package, Warehouse, ShoppingCart, Check, BellOff, Filter, RotateCcw,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useScmProductsStore, type ScmProduct } from "@/shared/data/scm/scm-products-store"

type Urgency = "out" | "critical" | "warning"

const urgencyOf = (p: ScmProduct): Urgency => {
    if (p.currentStock === 0) return "out"
    if (p.currentStock < p.reorderLevel * 0.5) return "critical"
    return "warning"
}

const URGENCY_META: Record<Urgency, { label: string; color: string; bg: string; ring: string }> = {
    out: { label: "Out of Stock", color: "#dc2626", bg: "bg-red-50", ring: "#dc2626" },
    critical: { label: "Critical", color: "#ef4444", bg: "bg-red-50", ring: "#ef4444" },
    warning: { label: "Low", color: "#f59e0b", bg: "bg-amber-50", ring: "#f59e0b" },
}

export default function LowStockAlertsPage() {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)

    const [resolved, setResolved] = useState<Set<string>>(new Set())
    const [dismissed, setDismissed] = useState<Set<string>>(new Set())
    const [urgencyFilter, setUrgencyFilter] = useState<"all" | Urgency>("all")
    const [warehouseFilter, setWarehouseFilter] = useState<string>("all")

    const lowStock = useMemo(
        () =>
            products
                .filter((p) => p.currentStock <= p.reorderLevel)
                .filter((p) => !dismissed.has(p.id))
                .map((p) => ({ ...p, urgency: urgencyOf(p) })),
        [products, dismissed]
    )

    const warehouses = useMemo(
        () => Array.from(new Set(lowStock.map((p) => p.warehouse))).sort(),
        [lowStock]
    )

    const filtered = useMemo(
        () =>
            lowStock.filter(
                (p) =>
                    (urgencyFilter === "all" || p.urgency === urgencyFilter) &&
                    (warehouseFilter === "all" || p.warehouse === warehouseFilter)
            ),
        [lowStock, urgencyFilter, warehouseFilter]
    )

    const groupedByWarehouse = useMemo(() => {
        const groups = new Map<string, typeof filtered>()
        for (const item of filtered) {
            const list = groups.get(item.warehouse) ?? []
            list.push(item)
            groups.set(item.warehouse, list)
        }
        return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
    }, [filtered])

    const summary = {
        total: lowStock.length,
        out: lowStock.filter((p) => p.urgency === "out").length,
        critical: lowStock.filter((p) => p.urgency === "critical").length,
        resolved: resolved.size,
    }

    const handleResolve = (p: ScmProduct) => {
        setResolved((s) => new Set(s).add(p.id))
        toast({ title: "Marked resolved", description: p.productName })
    }
    const handleDismiss = (p: ScmProduct) => {
        setDismissed((s) => new Set(s).add(p.id))
        toast({ title: "Alert dismissed", description: p.productName })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-[#ef4444]" /> Low Stock Alerts
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Stock health grid — products at or below reorder level, grouped by warehouse.
                    </p>
                </div>
                <Link href="/scm/procurement/purchase-orders">
                    <Button className="h-9 px-3 rounded-none text-white text-[13px]" style={{ backgroundColor: "#ef4444", boxShadow: "0 4px 12px #ef444433" }}>
                        <ShoppingCart className="w-4 h-4 mr-1.5" /> Create Purchase Orders
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Total Alerts" value={summary.total} accent="#ef4444" icon={<AlertTriangle className="w-4 h-4" />} />
                <Stat label="Out of Stock" value={summary.out} accent="#dc2626" icon={<Package className="w-4 h-4" />} helper="zero on hand" />
                <Stat label="Critical (<50%)" value={summary.critical} accent="#f59e0b" icon={<AlertTriangle className="w-4 h-4" />} helper="below half reorder" />
                <Stat label="Resolved Today" value={summary.resolved} accent="#10b981" icon={<Check className="w-4 h-4" />} />
            </div>

            <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-3 flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#64748B]">
                    <Filter className="w-3.5 h-3.5" /> Filters
                </span>
                <Select value={urgencyFilter} onValueChange={(v) => setUrgencyFilter(v as any)}>
                    <SelectTrigger className="h-9 w-[160px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All severities</SelectItem>
                        <SelectItem value="out">Out of Stock</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="warning">Low</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                    <SelectTrigger className="h-9 w-[200px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue placeholder="All warehouses" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All warehouses</SelectItem>
                        {warehouses.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                    </SelectContent>
                </Select>
                {(urgencyFilter !== "all" || warehouseFilter !== "all") && (
                    <Button variant="ghost" onClick={() => { setUrgencyFilter("all"); setWarehouseFilter("all") }} className="h-9 rounded-none text-[12px] text-[#64748B]">
                        Clear
                    </Button>
                )}
                <span className="text-[11.5px] text-[#94A3B8] ml-auto">{filtered.length} of {lowStock.length}</span>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-10 text-center">
                    <div className="w-12 h-12 rounded-none bg-emerald-50 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A] mt-3">All products are healthy</p>
                    <p className="text-[12.5px] text-[#64748B] mt-1">No products below reorder level for the current filters.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {groupedByWarehouse.map(([warehouse, items]) => (
                        <div key={warehouse} className="border bg-white shadow-sm rounded-none">
                            <div className="px-5 py-3 border-b border-[#EEF1F6] flex items-center justify-between gap-2 bg-slate-50/50">
                                <div className="inline-flex items-center gap-2 min-w-0">
                                    <Warehouse className="w-4 h-4 text-[#64748B] shrink-0" />
                                    <h3 className="text-[13px] font-semibold text-[#0F172A] truncate">{warehouse}</h3>
                                    <span className="text-[11px] font-bold tabular-nums px-1.5 py-0.5 bg-red-100 text-red-700">{items.length}</span>
                                </div>
                                <span className="text-[11px] text-[#94A3B8] tabular-nums shrink-0">
                                    {items.reduce((s, i) => s + i.currentStock, 0)} units total
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 divide-x divide-y divide-[#F1F5F9]">
                                {items.map((p) => (
                                    <ProductHealthCard
                                        key={p.id}
                                        product={p}
                                        urgency={p.urgency}
                                        isResolved={resolved.has(p.id)}
                                        onResolve={() => handleResolve(p)}
                                        onDismiss={() => handleDismiss(p)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function ProductHealthCard({
    product, urgency, isResolved, onResolve, onDismiss,
}: {
    product: ScmProduct
    urgency: Urgency
    isResolved: boolean
    onResolve: () => void
    onDismiss: () => void
}) {
    const meta = URGENCY_META[urgency]
    const target = product.reorderLevel
    const current = product.currentStock
    const ratio = target === 0 ? 0 : Math.min(1, current / target)
    const radius = 28
    const circ = 2 * Math.PI * radius
    const dash = circ * ratio
    const deficit = Math.max(0, target - current)

    return (
        <div className={`p-4 transition-all ${isResolved ? "opacity-50 bg-emerald-50/30" : "hover:bg-slate-50/40"}`}>
            <div className="flex items-start gap-3">
                <div className="relative w-16 h-16 shrink-0">
                    <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                        <circle cx="32" cy="32" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="5" />
                        <circle
                            cx="32" cy="32" r={radius}
                            fill="none"
                            stroke={meta.ring}
                            strokeWidth="5"
                            strokeDasharray={`${dash} ${circ}`}
                            strokeLinecap="butt"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[12px] font-bold tabular-nums" style={{ color: meta.color }}>{current}</span>
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] font-semibold text-[#0F172A] truncate">{product.productName}</p>
                    <p className="text-[11px] text-[#94A3B8] font-mono">{product.sku}</p>
                    <span
                        className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-none border"
                        style={{ color: meta.color, borderColor: `${meta.color}55`, background: `${meta.color}10` }}
                    >
                        {meta.label}
                    </span>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-3 text-[11px] gap-1">
                <div>
                    <p className="text-[#94A3B8] font-medium">On Hand</p>
                    <p className="font-bold tabular-nums text-[#0F172A]">{current}</p>
                </div>
                <div>
                    <p className="text-[#94A3B8] font-medium">Reorder ≤</p>
                    <p className="font-bold tabular-nums text-[#0F172A]">{target}</p>
                </div>
                <div>
                    <p className="text-[#94A3B8] font-medium">Shortfall</p>
                    <p className="font-bold tabular-nums" style={{ color: meta.color }}>{deficit}</p>
                </div>
            </div>

            <div className="mt-3 flex items-center gap-1">
                <Link href="/scm/procurement/purchase-orders" className="flex-1">
                    <Button size="sm" variant="outline" className="w-full h-8 rounded-none text-[11.5px] border-[#E5E7EB]">
                        <RotateCcw className="w-3 h-3 mr-1" /> Reorder
                    </Button>
                </Link>
                {!isResolved && (
                    <Button onClick={onResolve} size="sm" variant="ghost" className="h-8 px-2 rounded-none text-emerald-700 hover:bg-emerald-50" title="Mark resolved">
                        <Check className="w-3.5 h-3.5" />
                    </Button>
                )}
                <Button onClick={onDismiss} size="sm" variant="ghost" className="h-8 px-2 rounded-none text-[#64748B] hover:bg-slate-100" title="Dismiss">
                    <BellOff className="w-3.5 h-3.5" />
                </Button>
            </div>
        </div>
    )
}

function Stat({ label, value, icon, accent, helper }: { label: string; value: string | number; icon: React.ReactNode; accent: string; helper?: string }) {
    return (
        <div
            className="border shadow-sm p-4 rounded-none"
            style={{ background: `linear-gradient(135deg, ${accent}14 0%, ${accent}06 45%, #ffffff 100%)`, borderColor: `${accent}33` }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[#64748B] truncate">{label}</p>
                    <p className="mt-1.5 text-[22px] font-bold tabular-nums leading-tight" style={{ color: accent }}>{value}</p>
                    {helper && <p className="text-[11px] text-[#94A3B8] mt-1">{helper}</p>}
                </div>
                <div className="w-9 h-9 rounded-none flex items-center justify-center text-white shrink-0" style={{ background: accent, boxShadow: `0 4px 12px ${accent}33` }}>
                    {icon}
                </div>
            </div>
        </div>
    )
}
