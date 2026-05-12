"use client"

import * as React from "react"
import { useMemo } from "react"
import { Download, Package, PackageCheck, ChevronRight, Boxes, Truck } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

import { useScmSalesOrdersStore, type ScmSalesOrder, type SOFulfillmentStatus } from "@/shared/data/scm/scm-sales-orders-store"

interface KanbanColumn {
    key: SOFulfillmentStatus
    title: string
    color: string
    bgColor: string
    icon: React.ReactNode
    nextStatus?: SOFulfillmentStatus
    nextLabel?: string
}

const COLUMNS: KanbanColumn[] = [
    { key: "Pending", title: "Pending", color: "#f59e0b", bgColor: "#fffbeb", icon: <Package className="w-4 h-4" />, nextStatus: "Picked", nextLabel: "Start Picking" },
    { key: "Picked", title: "Picked", color: "#2563eb", bgColor: "#eff6ff", icon: <Boxes className="w-4 h-4" />, nextStatus: "Packed", nextLabel: "Mark Packed" },
    { key: "Packed", title: "Packed", color: "#8b5cf6", bgColor: "#f5f3ff", icon: <PackageCheck className="w-4 h-4" />, nextStatus: "Shipped", nextLabel: "Ready for Dispatch" },
    { key: "Shipped", title: "Ready / Shipped", color: "#10b981", bgColor: "#ecfdf5", icon: <Truck className="w-4 h-4" /> },
]

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

export default function PickingPackingPage() {
    const { toast } = useToast()
    const orders = useScmSalesOrdersStore((s) => s.salesOrders)
    const updateSO = useScmSalesOrdersStore((s) => s.updateSO)

    const grouped = useMemo(() => {
        const map: Record<string, ScmSalesOrder[]> = { Pending: [], Picked: [], Packed: [], Shipped: [] }
        for (const o of orders) {
            if (map[o.fulfillmentStatus]) map[o.fulfillmentStatus].push(o)
        }
        return map
    }, [orders])

    const advance = (so: ScmSalesOrder, next: SOFulfillmentStatus, label: string) => {
        updateSO(so.id, { fulfillmentStatus: next })
        toast({ title: label, description: `${so.orderNumber} → ${next}` })
    }

    const handleExport = () => {
        const visible = orders.filter((o) => COLUMNS.some((c) => c.key === o.fulfillmentStatus))
        if (visible.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Order Number", "Customer", "Warehouse", "Items", "Order Date", "Total", "Fulfillment Status"]
        const rows = visible.map((p) => [p.orderNumber, p.customerName, p.warehouse, p.items.length, p.orderDate, p.totalAmount, p.fulfillmentStatus])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-pick-pack-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} orders exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Picking & Packing</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Move orders through fulfillment stages — click a card's action to advance.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            {/* Kanban grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {COLUMNS.map((col) => {
                    const items = grouped[col.key] ?? []
                    return (
                        <div key={col.key} className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm flex flex-col min-h-[400px]">
                            <div
                                className="px-4 py-3 border-b flex items-center justify-between gap-2 rounded-t-xl"
                                style={{ backgroundColor: col.bgColor, borderColor: `${col.color}33` }}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: col.color }}>
                                        {col.icon}
                                    </span>
                                    <h3 className="font-semibold text-[13.5px] text-[#0F172A] truncate">{col.title}</h3>
                                </div>
                                <span
                                    className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-[11.5px] font-semibold tabular-nums text-white shrink-0"
                                    style={{ backgroundColor: col.color }}
                                >
                                    {items.length}
                                </span>
                            </div>

                            <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[640px]">
                                {items.length === 0 ? (
                                    <div className="text-center py-10 text-[12.5px] text-[#94A3B8]">
                                        No orders in this stage.
                                    </div>
                                ) : (
                                    items.map((o) => (
                                        <KanbanCard
                                            key={o.id}
                                            order={o}
                                            accentColor={col.color}
                                            nextStatus={col.nextStatus}
                                            nextLabel={col.nextLabel}
                                            onAdvance={(next, label) => advance(o, next, label)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function KanbanCard({
    order,
    accentColor,
    nextStatus,
    nextLabel,
    onAdvance,
}: {
    order: ScmSalesOrder
    accentColor: string
    nextStatus?: SOFulfillmentStatus
    nextLabel?: string
    onAdvance: (next: SOFulfillmentStatus, label: string) => void
}) {
    return (
        <div
            className={cn(
                "group bg-white rounded-lg border border-[#EEF1F6] p-3 hover:shadow-md transition-all hover:-translate-y-0.5",
                "border-l-[3px]"
            )}
            style={{ borderLeftColor: accentColor }}
        >
            <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-[13px] text-[#0F172A]">{order.orderNumber}</p>
                <span className="text-[11px] text-[#94A3B8] tabular-nums shrink-0">{order.orderDate}</span>
            </div>
            <p className="text-[12.5px] text-[#0F172A] mt-1 truncate font-medium">{order.customerName}</p>
            <p className="text-[11.5px] text-[#64748B] truncate">{order.warehouse}</p>

            <div className="mt-2.5 flex items-center justify-between text-[11.5px]">
                <span className="text-[#64748B]">
                    <strong className="text-[#0F172A]">{order.items.length}</strong> item{order.items.length !== 1 ? "s" : ""}
                </span>
                <span className="font-semibold tabular-nums text-[#0F172A]">{formatINR(order.totalAmount)}</span>
            </div>

            {nextStatus && nextLabel && (
                <button
                    onClick={() => onAdvance(nextStatus, nextLabel)}
                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-[12px] font-medium py-1.5 rounded-md border transition-all"
                    style={{ color: accentColor, borderColor: `${accentColor}66`, backgroundColor: `${accentColor}0d` }}
                >
                    {nextLabel}
                    <ChevronRight className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    )
}
