"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { StockInForm } from "@/shared/components/scm/forms/StockInForm"
import {
    useScmStockMovementsStore,
    type ScmStockMovement,
} from "@/shared/data/scm/scm-stock-movements-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)

export default function StockInPage() {
    const { toast } = useToast()
    const movements = useScmStockMovementsStore((s) => s.movements)
    const deleteMovement = useScmStockMovementsStore((s) => s.deleteMovement)

    const [formOpen, setFormOpen] = useState(false)
    const [deleting, setDeleting] = useState<ScmStockMovement | null>(null)

    const stockIns = useMemo(() => movements.filter((m) => m.direction === "in"), [movements])

    const columns = useMemo<DataTableColumn<ScmStockMovement>[]>(
        () => [
            { key: "movementDate", header: "Date", width: "120px", sortable: true, render: (r) => <span className="tabular-nums">{r.movementDate}</span> },
            {
                key: "product",
                header: "Product",
                sortable: true,
                accessor: (r) => r.productName,
                render: (r) => (
                    <div className="min-w-0">
                        <p className="font-medium text-[#0F172A] truncate">{r.productName}</p>
                        <p className="text-[11.5px] text-[#94A3B8] truncate">{r.sku}</p>
                    </div>
                ),
            },
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "supplier", header: "Supplier", width: "180px", render: (r) => r.supplier || "—" },
            { key: "poNumber", header: "PO #", width: "110px", render: (r) => r.poNumber || "—" },
            { key: "batchNumber", header: "Batch", width: "120px", render: (r) => r.batchNumber || "—" },
            {
                key: "quantity",
                header: "Qty",
                width: "80px",
                align: "right",
                sortable: true,
                accessor: (r) => r.quantity,
                render: (r) => <span className="font-semibold text-emerald-700 tabular-nums">+{r.quantity}</span>,
            },
            {
                key: "unitCost",
                header: "Unit Cost",
                width: "110px",
                align: "right",
                accessor: (r) => r.unitCost ?? 0,
                render: (r) => <span className="tabular-nums">{r.unitCost != null ? formatINR(r.unitCost) : "—"}</span>,
            },
        ],
        []
    )

    const confirmDelete = () => {
        if (!deleting) return
        deleteMovement(deleting.id)
        toast({ title: "Stock In entry removed", description: `${deleting.quantity} × ${deleting.productName}` })
        setDeleting(null)
    }

    const handleExport = () => {
        if (stockIns.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Date", "Product", "SKU", "Warehouse", "Quantity", "Unit Cost", "Supplier", "PO Number", "Batch", "Expiry", "Remarks"]
        const rows = stockIns.map((m) => [m.movementDate, m.productName, m.sku, m.warehouse, m.quantity, m.unitCost ?? "", m.supplier ?? "", m.poNumber ?? "", m.batchNumber ?? "", m.expiryDate ?? "", m.remarks ?? ""])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-stock-in-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} entries exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Stock In</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Record incoming stock from suppliers or warehouse transfers.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={() => setFormOpen(true)} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#10b981", boxShadow: "0 4px 12px #10b98133" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> Add Stock In
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={stockIns}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by product, SKU, supplier, PO..."
                searchKeys={["productName", "sku", "warehouse", "supplier", "poNumber", "batchNumber"]}
                pageSize={10}
                emptyMessage="No stock-in entries yet."
                actions={(row) => (
                    <RowActions onDelete={() => setDeleting(row)} />
                )}
            />

            <StockInForm open={formOpen} onOpenChange={setFormOpen} />

            <DeleteConfirmDialog
                open={!!deleting}
                onOpenChange={(o) => !o && setDeleting(null)}
                title="Remove this stock-in entry?"
                itemLabel={deleting ? `${deleting.quantity} × ${deleting.productName} on ${deleting.movementDate}` : ""}
                onConfirm={confirmDelete}
            />
        </div>
    )
}
