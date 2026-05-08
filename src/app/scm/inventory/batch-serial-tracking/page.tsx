"use client"

import * as React from "react"
import { useMemo } from "react"
import { Download, AlertTriangle } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmStockMovementsStore } from "@/shared/data/scm/scm-stock-movements-store"

interface BatchRow {
    id: string
    productName: string
    sku: string
    batchNumber: string
    serialNumber: string
    manufacturingDate: string
    expiryDate: string
    warehouse: string
    quantity: number
    status: "Active" | "Expiring Soon" | "Expired"
}

const today = new Date().toISOString().slice(0, 10)
const addDays = (d: string, days: number) => {
    const dt = new Date(d)
    dt.setDate(dt.getDate() + days)
    return dt.toISOString().slice(0, 10)
}

export default function BatchSerialTrackingPage() {
    const { toast } = useToast()
    const movements = useScmStockMovementsStore((s) => s.movements)

    const rows: BatchRow[] = useMemo(() => {
        // Show all stock-in movements that have batch or serial info, plus a few synthesized rows for completeness
        const fromMovements = movements.filter((m) => m.direction === "in" && (m.batchNumber || m.expiryDate)).map((m) => {
            const expiry = m.expiryDate ?? ""
            const status: BatchRow["status"] = !expiry ? "Active" : expiry < today ? "Expired" : expiry < addDays(today, 60) ? "Expiring Soon" : "Active"
            return {
                id: m.id,
                productName: m.productName,
                sku: m.sku,
                batchNumber: m.batchNumber ?? "—",
                serialNumber: "—",
                manufacturingDate: addDays(m.movementDate, -180),
                expiryDate: expiry || "—",
                warehouse: m.warehouse,
                quantity: m.quantity,
                status,
            }
        })
        const synthesized: BatchRow[] = [
            { id: "bs_seed1", productName: "Wireless Mouse", sku: "PRD-1003", batchNumber: "B-MOUSE-2604", serialNumber: "SN-CLP-0019283746", manufacturingDate: "2025-11-15", expiryDate: "—", warehouse: "North Warehouse", quantity: 64, status: "Active" },
            { id: "bs_seed2", productName: "Stainless Steel Bottle 750ml", sku: "PRD-1005", batchNumber: "B-HX-2602", serialNumber: "—", manufacturingDate: "2026-01-10", expiryDate: "—", warehouse: "Central Warehouse", quantity: 92, status: "Active" },
        ]
        return [...fromMovements, ...synthesized]
    }, [movements])

    const summary = useMemo(() => ({
        active: rows.filter((r) => r.status === "Active").length,
        expiring: rows.filter((r) => r.status === "Expiring Soon").length,
        expired: rows.filter((r) => r.status === "Expired").length,
    }), [rows])

    const columns: DataTableColumn<BatchRow>[] = useMemo(
        () => [
            { key: "product", header: "Product", sortable: true, accessor: (r) => r.productName, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.sku}</p></div>
            )},
            { key: "batchNumber", header: "Batch", width: "150px", sortable: true, render: (r) => <span className="font-mono text-[12.5px]">{r.batchNumber}</span> },
            { key: "serialNumber", header: "Serial", width: "180px", render: (r) => <span className="font-mono text-[12px]">{r.serialNumber}</span> },
            { key: "manufacturingDate", header: "Mfg Date", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.manufacturingDate}</span> },
            { key: "expiryDate", header: "Expiry", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.expiryDate}</span> },
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "quantity", header: "Qty", width: "80px", align: "right", sortable: true, accessor: (r) => r.quantity, render: (r) => <span className="tabular-nums font-semibold">{r.quantity}</span> },
            { key: "status", header: "Status", width: "130px", render: (r) => <StatusBadge status={r.status === "Expiring Soon" ? "Warning" : r.status} tone={r.status === "Active" ? "success" : r.status === "Expiring Soon" ? "warning" : "danger"} /> },
        ],
        []
    )

    const handleExport = () => {
        if (rows.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Product", "SKU", "Batch", "Serial", "Manufacturing Date", "Expiry Date", "Warehouse", "Quantity", "Status"]
        const data = rows.map((r) => [r.productName, r.sku, r.batchNumber, r.serialNumber, r.manufacturingDate, r.expiryDate, r.warehouse, r.quantity, r.status])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...data].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-batch-serial-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${data.length} records exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Batch / Serial Tracking</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Trace products by batch, serial number, and expiry.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div
                    className="rounded-xl border shadow-sm p-4"
                    style={{ background: "linear-gradient(135deg, #10b98114 0%, #10b98106 45%, #ffffff 100%)", borderColor: "#10b98133" }}
                >
                    <p className="text-[12px] text-[#64748B] font-medium">Active Batches</p>
                    <p className="text-[22px] font-semibold text-emerald-700 mt-1 tabular-nums leading-tight">{summary.active}</p>
                </div>
                <div
                    className="rounded-xl border shadow-sm p-4"
                    style={{ background: "linear-gradient(135deg, #f59e0b14 0%, #f59e0b06 45%, #ffffff 100%)", borderColor: "#f59e0b33" }}
                >
                    <p className="text-[12px] text-[#64748B] font-medium">Expiring Soon (60 days)</p>
                    <p className="text-[22px] font-semibold text-amber-700 mt-1 tabular-nums leading-tight">{summary.expiring}</p>
                </div>
                <div
                    className="rounded-xl border shadow-sm p-4"
                    style={{ background: "linear-gradient(135deg, #ef444414 0%, #ef444406 45%, #ffffff 100%)", borderColor: "#ef444433" }}
                >
                    <p className="text-[12px] text-[#64748B] font-medium">Expired</p>
                    <p className="text-[22px] font-semibold text-red-600 mt-1 tabular-nums leading-tight">{summary.expired}</p>
                </div>
            </div>

            {summary.expired > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-[13px] text-red-700">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p><strong>{summary.expired} expired batch(es)</strong> detected. Action required to write off or quarantine these stock units.</p>
                </div>
            )}

            <DataTable
                columns={columns}
                data={rows}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by product, batch, serial, warehouse..."
                searchKeys={["productName", "sku", "batchNumber", "serialNumber", "warehouse"]}
                pageSize={15}
                emptyMessage="No tracked batches yet."
            />
        </div>
    )
}
