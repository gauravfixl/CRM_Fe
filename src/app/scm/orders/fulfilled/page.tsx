"use client"

import * as React from "react"
import { useMemo } from "react"
import { Download, CheckCircle2 } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmSalesOrdersStore, type ScmSalesOrder } from "@/shared/data/scm/scm-sales-orders-store"
import { useScmShipmentsStore } from "@/shared/data/scm/scm-shipments-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

export default function FulfilledOrdersPage() {
    const { toast } = useToast()
    const orders = useScmSalesOrdersStore((s) => s.salesOrders)
    const shipments = useScmShipmentsStore((s) => s.shipments)

    const filtered = useMemo(() => orders.filter((o) => ["Shipped", "Delivered"].includes(o.fulfillmentStatus)), [orders])

    const findShipment = (orderNumber: string) => shipments.find((s) => s.orderNumber === orderNumber)

    const columns: DataTableColumn<ScmSalesOrder>[] = useMemo(
        () => [
            { key: "orderNumber", header: "Order #", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.orderNumber}</span> },
            { key: "customerName", header: "Customer", sortable: true },
            { key: "deliveryDate", header: "Delivered On", width: "130px", accessor: (r) => findShipment(r.orderNumber)?.actualDelivery ?? "—", render: (r) => <span className="tabular-nums">{findShipment(r.orderNumber)?.actualDelivery ?? "—"}</span> },
            { key: "shipmentId", header: "Shipment", width: "110px", accessor: (r) => findShipment(r.orderNumber)?.shipmentId ?? "—", render: (r) => <span className="font-mono">{findShipment(r.orderNumber)?.shipmentId ?? "—"}</span> },
            { key: "totalAmount", header: "Total", width: "130px", align: "right", sortable: true, accessor: (r) => r.totalAmount, render: (r) => <span className="tabular-nums font-semibold">{formatINR(r.totalAmount)}</span> },
            { key: "paymentStatus", header: "Payment", width: "100px", render: (r) => <StatusBadge status={r.paymentStatus} /> },
            { key: "fulfillmentStatus", header: "Status", width: "120px", render: (r) => <StatusBadge status={r.fulfillmentStatus} /> },
        ],
        [shipments]
    )

    const handleExport = () => {
        if (filtered.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Order", "Customer", "Delivered On", "Shipment", "Total", "Payment", "Status"]
        const rows = filtered.map((p) => {
            const sh = findShipment(p.orderNumber)
            return [p.orderNumber, p.customerName, sh?.actualDelivery ?? "", sh?.shipmentId ?? "", p.totalAmount, p.paymentStatus, p.fulfillmentStatus]
        })
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-fulfilled-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} orders exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Fulfilled Orders
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Orders that have been shipped or delivered.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by order, customer..."
                searchKeys={["orderNumber", "customerName"]}
                pageSize={15}
                emptyMessage="No fulfilled orders yet."
            />
        </div>
    )
}
