"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import Link from "next/link"
import { Download, AlertTriangle, FilePlus2, BellRing } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { KpiCard } from "@/shared/components/scm/shared/KpiCard"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import { useScmProductsStore, type ScmProduct } from "@/shared/data/scm/scm-products-store"

interface LowStockRow extends ScmProduct {
    requiredQuantity: number
    severity: "Critical" | "Warning"
    lastPurchaseDate: string
}

export default function LowStockAlertsPage() {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const [viewing, setViewing] = useState<LowStockRow | null>(null)

    const rows: LowStockRow[] = useMemo(
        () =>
            products
                .filter((p) => p.currentStock <= p.reorderLevel)
                .map((p) => ({
                    ...p,
                    requiredQuantity: Math.max(p.reorderLevel * 2 - p.currentStock, 1),
                    severity: p.currentStock === 0 ? "Critical" : "Warning",
                    lastPurchaseDate: "2026-04-25",
                })),
        [products]
    )

    const summary = useMemo(() => ({
        critical: rows.filter((r) => r.severity === "Critical").length,
        warning: rows.filter((r) => r.severity === "Warning").length,
        totalShortfall: rows.reduce((s, r) => s + r.requiredQuantity, 0),
    }), [rows])

    const columns: DataTableColumn<LowStockRow>[] = useMemo(
        () => [
            { key: "sku", header: "SKU", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.sku}</span> },
            { key: "productName", header: "Product", sortable: true, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.brand} · {r.category}</p></div>
            )},
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "currentStock", header: "Current", width: "90px", align: "right", sortable: true, accessor: (r) => r.currentStock, render: (r) => <span className={`tabular-nums font-semibold ${r.currentStock === 0 ? "text-red-600" : "text-amber-700"}`}>{r.currentStock}</span> },
            { key: "reorderLevel", header: "Reorder ≤", width: "100px", align: "right", render: (r) => <span className="tabular-nums text-[#64748B]">{r.reorderLevel}</span> },
            { key: "requiredQuantity", header: "Required", width: "100px", align: "right", render: (r) => <span className="tabular-nums font-semibold">{r.requiredQuantity}</span> },
            { key: "lastPurchaseDate", header: "Last PO", width: "120px", render: (r) => <span className="text-[#64748B] tabular-nums">{r.lastPurchaseDate}</span> },
            { key: "severity", header: "Severity", width: "100px", render: (r) => <StatusBadge status={r.severity === "Critical" ? "Out of Stock" : "Low Stock"} /> },
        ],
        []
    )

    const handleNotifyTeam = () => {
        toast({ title: "Notification sent", description: `${rows.length} low-stock items shared with procurement.` })
    }

    const handleExport = () => {
        if (rows.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["SKU", "Product", "Category", "Warehouse", "Current Stock", "Reorder Level", "Required Quantity", "Severity"]
        const data = rows.map((r) => [r.sku, r.productName, r.category, r.warehouse, r.currentStock, r.reorderLevel, r.requiredQuantity, r.severity])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...data].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-low-stock-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${data.length} alerts exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Low Stock Alerts</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Products at or below their reorder level.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleNotifyTeam} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <BellRing className="w-4 h-4 mr-1.5" /> Notify Procurement
                    </Button>
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Link href="/scm/procurement/purchase-orders">
                        <Button className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#10b981", boxShadow: "0 4px 12px #10b98133" }}>
                            <FilePlus2 className="w-4 h-4 mr-1.5" /> Create PO
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <KpiCard label="Critical (Out of Stock)" value={summary.critical} icon={<AlertTriangle className="w-5 h-5" />} accentColor="#ef4444" />
                <KpiCard label="Warning (Low Stock)" value={summary.warning} icon={<AlertTriangle className="w-5 h-5" />} accentColor="#f59e0b" />
                <KpiCard label="Total Shortfall (units)" value={summary.totalShortfall} icon={<AlertTriangle className="w-5 h-5" />} accentColor="#2563eb" />
            </div>

            <DataTable
                columns={columns}
                data={rows}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by SKU, product, warehouse..."
                searchKeys={["sku", "productName", "category", "warehouse"]}
                pageSize={15}
                emptyMessage="No low-stock alerts. All inventory is above reorder level."
                onRowClick={(row) => setViewing(row)}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.productName}
                description={(r) => `${r.sku} · ${r.warehouse}`}
                icon={<AlertTriangle className="w-5 h-5" />}
                accentColor="#ef4444"
            />
        </div>
    )
}
