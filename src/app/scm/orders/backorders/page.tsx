"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { Download, AlertCircle, FilePlus2, BellRing } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions } from "@/shared/components/scm/shared/RowActions"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import { useScmSalesOrdersStore, type ScmSalesOrder } from "@/shared/data/scm/scm-sales-orders-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

export default function BackordersPage() {
    const { toast } = useToast()
    const orders = useScmSalesOrdersStore((s) => s.salesOrders)
    const updateSO = useScmSalesOrdersStore((s) => s.updateSO)
    const [viewing, setViewing] = useState<ScmSalesOrder | null>(null)

    const filtered = useMemo(() => orders.filter((o) => o.fulfillmentStatus === "Awaiting Stock"), [orders])

    const handleNotify = (so: ScmSalesOrder) => toast({ title: "Customer notified", description: `${so.customerName} (${so.orderNumber})` })
    const handleCancel = (so: ScmSalesOrder) => {
        updateSO(so.id, { status: "Cancelled" })
        toast({ title: "Backorder cancelled", description: so.orderNumber })
    }

    const columns: DataTableColumn<ScmSalesOrder>[] = useMemo(
        () => [
            { key: "orderNumber", header: "Order #", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.orderNumber}</span> },
            { key: "customerName", header: "Customer", sortable: true },
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "items", header: "Items", width: "70px", align: "right", accessor: (r) => r.items.length, render: (r) => <span className="tabular-nums">{r.items.length}</span> },
            { key: "totalAmount", header: "Total", width: "130px", align: "right", sortable: true, accessor: (r) => r.totalAmount, render: (r) => <span className="tabular-nums font-semibold">{formatINR(r.totalAmount)}</span> },
            { key: "orderDate", header: "Order Date", width: "120px", render: (r) => <span className="tabular-nums">{r.orderDate}</span> },
            { key: "fulfillmentStatus", header: "Status", width: "150px", render: (r) => <StatusBadge status={r.fulfillmentStatus} /> },
        ],
        []
    )

    const handleExport = () => {
        if (filtered.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Order", "Customer", "Warehouse", "Items", "Total", "Order Date", "Status"]
        const rows = filtered.map((p) => [p.orderNumber, p.customerName, p.warehouse, p.items.length, p.totalAmount, p.orderDate, p.fulfillmentStatus])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-backorders-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} backorders exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" /> Backorders
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Orders accepted but cannot be fulfilled due to unavailable stock.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Link href="/scm/procurement/purchase-requests">
                        <Button className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#10b981", boxShadow: "0 4px 12px #10b98133" }}>
                            <FilePlus2 className="w-4 h-4 mr-1.5" /> Create Purchase Request
                        </Button>
                    </Link>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                rowKey={(r) => r.id}
                searchPlaceholder="Search backorders..."
                searchKeys={["orderNumber", "customerName", "warehouse"]}
                pageSize={15}
                emptyMessage="No backorders. All accepted orders have stock."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => (
                    <RowActions
                        extraItems={
                            <>
                                <button onClick={() => handleNotify(row)} className="w-full text-left px-2 py-1.5 text-[13px] hover:bg-slate-100 rounded-md inline-flex items-center gap-2">
                                    <BellRing className="w-3.5 h-3.5" /> Notify Customer
                                </button>
                                <button onClick={() => handleCancel(row)} className="w-full text-left px-2 py-1.5 text-[13px] hover:bg-red-50 text-red-600 rounded-md">Cancel Backorder</button>
                            </>
                        }
                    />
                )}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.orderNumber}
                description={(r) => r.customerName}
                icon={<AlertCircle className="w-5 h-5" />}
                accentColor="#ef4444"
            />
        </div>
    )
}
