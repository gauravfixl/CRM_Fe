"use client"

import * as React from "react"
import { useMemo } from "react"
import { Download, Clock } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions } from "@/shared/components/scm/shared/RowActions"
import { useScmSalesOrdersStore, type ScmSalesOrder } from "@/shared/data/scm/scm-sales-orders-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

const REASON_OF_PENDING = (so: ScmSalesOrder): string => {
    if (so.status === "Draft") return "Draft / Not confirmed"
    if (so.fulfillmentStatus === "Awaiting Stock") return "Stock not available"
    if (so.paymentStatus === "Unpaid") return "Awaiting payment"
    if (so.fulfillmentStatus === "Pending") return "Waiting for picking"
    if (so.fulfillmentStatus === "Picked" || so.fulfillmentStatus === "Packed") return "Waiting for shipment"
    return "—"
}

export default function PendingOrdersPage() {
    const { toast } = useToast()
    const orders = useScmSalesOrdersStore((s) => s.salesOrders)

    const filtered = useMemo(
        () => orders.filter((o) => o.status === "Draft" || ["Pending", "Awaiting Stock", "Picked", "Packed"].includes(o.fulfillmentStatus)),
        [orders]
    )

    const columns: DataTableColumn<ScmSalesOrder>[] = useMemo(
        () => [
            { key: "orderNumber", header: "Order #", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.orderNumber}</span> },
            { key: "customerName", header: "Customer", sortable: true },
            { key: "orderDate", header: "Order Date", width: "120px", sortable: true, render: (r) => <span className="tabular-nums">{r.orderDate}</span> },
            { key: "items", header: "Items", width: "70px", align: "right", accessor: (r) => r.items.length, render: (r) => <span className="tabular-nums">{r.items.length}</span> },
            { key: "totalAmount", header: "Total", width: "130px", align: "right", sortable: true, accessor: (r) => r.totalAmount, render: (r) => <span className="tabular-nums font-semibold">{formatINR(r.totalAmount)}</span> },
            { key: "reason", header: "Pending Reason", accessor: (r) => REASON_OF_PENDING(r), render: (r) => <span className="text-amber-700 font-medium">{REASON_OF_PENDING(r)}</span> },
            { key: "fulfillmentStatus", header: "Fulfillment", width: "130px", render: (r) => <StatusBadge status={r.fulfillmentStatus} /> },
        ],
        []
    )

    const handleExport = () => {
        if (filtered.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Order Number", "Customer", "Order Date", "Items", "Total", "Pending Reason", "Fulfillment Status"]
        const rows = filtered.map((p) => [p.orderNumber, p.customerName, p.orderDate, p.items.length, p.totalAmount, REASON_OF_PENDING(p), p.fulfillmentStatus])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-pending-orders-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} orders exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-600" /> Pending Orders
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Orders waiting for stock, approval, payment, or fulfillment.</p>
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
                searchKeys={["orderNumber", "customerName", "warehouse"]}
                pageSize={15}
                emptyMessage="No pending orders. All caught up."
                actions={() => <RowActions />}
            />
        </div>
    )
}
