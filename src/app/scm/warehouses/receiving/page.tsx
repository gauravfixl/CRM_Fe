"use client"

import * as React from "react"
import { useMemo } from "react"
import { Download, Package, FileCheck, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

import {
    useScmPurchaseOrdersStore,
    type ScmPurchaseOrder,
    type PODeliveryStatus,
} from "@/shared/data/scm/scm-purchase-orders-store"

interface KanbanColumn {
    key: PODeliveryStatus
    title: string
    color: string
    bgColor: string
    icon: React.ReactNode
    nextStatus?: PODeliveryStatus
    nextLabel?: string
}

const COLUMNS: KanbanColumn[] = [
    { key: "Pending", title: "Pending Receipt", color: "#f59e0b", bgColor: "#fffbeb", icon: <Package className="w-4 h-4" />, nextStatus: "In Transit", nextLabel: "Mark In Transit" },
    { key: "In Transit", title: "In Transit", color: "#2563eb", bgColor: "#eff6ff", icon: <FileCheck className="w-4 h-4" />, nextStatus: "Delivered", nextLabel: "Mark Delivered" },
    { key: "Delivered", title: "Delivered", color: "#10b981", bgColor: "#ecfdf5", icon: <CheckCircle2 className="w-4 h-4" /> },
]

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

export default function ReceivingPage() {
    const { toast } = useToast()
    const pos = useScmPurchaseOrdersStore((s) => s.purchaseOrders)
    const updatePO = useScmPurchaseOrdersStore((s) => s.updatePO)

    const grouped = useMemo(() => {
        const map: Record<string, ScmPurchaseOrder[]> = { Pending: [], "In Transit": [], Delivered: [], Delayed: [] }
        for (const p of pos) {
            if (map[p.deliveryStatus]) map[p.deliveryStatus].push(p)
        }
        return map
    }, [pos])

    const advance = (po: ScmPurchaseOrder, next: PODeliveryStatus, label: string) => {
        updatePO(po.id, { deliveryStatus: next })
        toast({ title: label, description: `${po.poNumber} → ${next}` })
    }

    const handleMarkDelayed = (po: ScmPurchaseOrder) => {
        updatePO(po.id, { deliveryStatus: "Delayed" })
        toast({ title: "Marked Delayed", description: po.poNumber, variant: "destructive" })
    }

    const handleExport = () => {
        if (pos.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["PO Number", "Supplier", "Warehouse", "Order Date", "Expected", "Items", "Total", "Delivery Status"]
        const rows = pos.map((p) => [p.poNumber, p.vendorName, p.warehouse, p.orderDate, p.expectedDelivery, p.items.length, p.totalAmount, p.deliveryStatus])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-receiving-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} POs exported` })
    }

    const delayed = grouped["Delayed"] ?? []

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Receiving</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Track incoming purchase orders through delivery stages.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            {/* Delayed banner */}
            {delayed.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-red-900">{delayed.length} delayed PO{delayed.length > 1 ? "s" : ""}</p>
                        <p className="text-[12px] text-red-700 mt-0.5 truncate">
                            {delayed.map((p) => p.poNumber).join(", ")}
                        </p>
                    </div>
                </div>
            )}

            {/* Kanban grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COLUMNS.map((col) => {
                    const items = grouped[col.key] ?? []
                    return (
                        <div key={col.key} className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm flex flex-col min-h-[400px]">
                            <div className="px-4 py-3 border-b flex items-center justify-between gap-2 rounded-t-xl" style={{ backgroundColor: col.bgColor, borderColor: `${col.color}33` }}>
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: col.color }}>
                                        {col.icon}
                                    </span>
                                    <h3 className="font-semibold text-[13.5px] text-[#0F172A] truncate">{col.title}</h3>
                                </div>
                                <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-[11.5px] font-semibold tabular-nums text-white shrink-0" style={{ backgroundColor: col.color }}>
                                    {items.length}
                                </span>
                            </div>

                            <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[640px]">
                                {items.length === 0 ? (
                                    <div className="text-center py-10 text-[12.5px] text-[#94A3B8]">No POs in this stage.</div>
                                ) : (
                                    items.map((p) => (
                                        <ReceivingCard
                                            key={p.id}
                                            po={p}
                                            accentColor={col.color}
                                            nextStatus={col.nextStatus}
                                            nextLabel={col.nextLabel}
                                            onAdvance={(next, label) => advance(p, next, label)}
                                            onMarkDelayed={col.key !== "Delivered" ? () => handleMarkDelayed(p) : undefined}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Delayed lane */}
            {delayed.length > 0 && (
                <div className="bg-white rounded-xl border border-red-200 shadow-sm">
                    <div className="px-4 py-3 border-b border-red-100 bg-red-50 rounded-t-xl flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 bg-red-500">
                                <AlertTriangle className="w-4 h-4" />
                            </span>
                            <h3 className="font-semibold text-[13.5px] text-red-900">Delayed Shipments</h3>
                        </div>
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-[11.5px] font-semibold tabular-nums text-white bg-red-500">{delayed.length}</span>
                    </div>
                    <div className="p-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                        {delayed.map((p) => (
                            <ReceivingCard
                                key={p.id}
                                po={p}
                                accentColor="#ef4444"
                                nextStatus="In Transit"
                                nextLabel="Move back to In Transit"
                                onAdvance={(next, label) => advance(p, next, label)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

function ReceivingCard({
    po,
    accentColor,
    nextStatus,
    nextLabel,
    onAdvance,
    onMarkDelayed,
}: {
    po: ScmPurchaseOrder
    accentColor: string
    nextStatus?: PODeliveryStatus
    nextLabel?: string
    onAdvance: (next: PODeliveryStatus, label: string) => void
    onMarkDelayed?: () => void
}) {
    return (
        <div
            className={cn("bg-white rounded-lg border border-[#EEF1F6] p-3 hover:shadow-md transition-all hover:-translate-y-0.5 border-l-[3px]")}
            style={{ borderLeftColor: accentColor }}
        >
            <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-[13px] text-[#0F172A]">{po.poNumber}</p>
                <span className="text-[11px] text-[#94A3B8] tabular-nums shrink-0">{po.expectedDelivery}</span>
            </div>
            <p className="text-[12.5px] text-[#0F172A] mt-1 truncate font-medium">{po.vendorName}</p>
            <p className="text-[11.5px] text-[#64748B] truncate">{po.warehouse}</p>

            <div className="mt-2.5 flex items-center justify-between text-[11.5px]">
                <span className="text-[#64748B]">
                    <strong className="text-[#0F172A]">{po.items.length}</strong> item{po.items.length !== 1 ? "s" : ""}
                </span>
                <span className="font-semibold tabular-nums text-[#0F172A]">{formatINR(po.totalAmount)}</span>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
                {nextStatus && nextLabel && (
                    <button
                        onClick={() => onAdvance(nextStatus, nextLabel)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-medium py-1.5 rounded-md border transition-all"
                        style={{ color: accentColor, borderColor: `${accentColor}66`, backgroundColor: `${accentColor}0d` }}
                    >
                        {nextLabel}
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                )}
                {onMarkDelayed && (
                    <button
                        onClick={onMarkDelayed}
                        title="Mark Delayed"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors shrink-0"
                    >
                        <AlertTriangle className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    )
}
