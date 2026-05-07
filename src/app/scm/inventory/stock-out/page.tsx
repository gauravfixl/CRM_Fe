"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { StockOutForm } from "@/shared/components/scm/forms/StockOutForm"
import {
    useScmStockMovementsStore,
    type ScmStockMovement,
} from "@/shared/data/scm/scm-stock-movements-store"

export default function StockOutPage() {
    const { toast } = useToast()
    const movements = useScmStockMovementsStore((s) => s.movements)
    const deleteMovement = useScmStockMovementsStore((s) => s.deleteMovement)

    const [formOpen, setFormOpen] = useState(false)
    const [deleting, setDeleting] = useState<ScmStockMovement | null>(null)

    const stockOuts = useMemo(() => movements.filter((m) => m.direction === "out"), [movements])

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
            {
                key: "reason",
                header: "Reason",
                width: "160px",
                render: (r) => <StatusBadge status={r.reason ?? "—"} />,
            },
            { key: "issuedTo", header: "Issued To", width: "180px", render: (r) => r.issuedTo || "—" },
            { key: "referenceNumber", header: "Reference", width: "120px", render: (r) => r.referenceNumber || "—" },
            {
                key: "quantity",
                header: "Qty",
                width: "80px",
                align: "right",
                sortable: true,
                accessor: (r) => r.quantity,
                render: (r) => <span className="font-semibold text-red-600 tabular-nums">−{r.quantity}</span>,
            },
        ],
        []
    )

    const confirmDelete = () => {
        if (!deleting) return
        deleteMovement(deleting.id)
        toast({ title: "Stock Out entry removed", description: `${deleting.quantity} × ${deleting.productName}` })
        setDeleting(null)
    }

    const handleExport = () => {
        if (stockOuts.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Date", "Product", "SKU", "Warehouse", "Quantity", "Reason", "Reference", "Issued To", "Remarks"]
        const rows = stockOuts.map((m) => [m.movementDate, m.productName, m.sku, m.warehouse, m.quantity, m.reason ?? "", m.referenceNumber ?? "", m.issuedTo ?? "", m.remarks ?? ""])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-stock-out-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} entries exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Stock Out</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Record outgoing stock for sales, transfers, damage, or internal usage.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={() => setFormOpen(true)} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#f59e0b", boxShadow: "0 4px 12px #f59e0b33" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> Add Stock Out
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={stockOuts}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by product, SKU, reason, reference..."
                searchKeys={["productName", "sku", "warehouse", "reason", "issuedTo", "referenceNumber"]}
                pageSize={10}
                emptyMessage="No stock-out entries yet."
                actions={(row) => (
                    <RowActions onDelete={() => setDeleting(row)} />
                )}
            />

            <StockOutForm open={formOpen} onOpenChange={setFormOpen} />

            <DeleteConfirmDialog
                open={!!deleting}
                onOpenChange={(o) => !o && setDeleting(null)}
                title="Remove this stock-out entry?"
                itemLabel={deleting ? `${deleting.quantity} × ${deleting.productName} on ${deleting.movementDate}` : ""}
                onConfirm={confirmDelete}
            />
        </div>
    )
}
