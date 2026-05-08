"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download, ClipboardCheck } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import { StockAdjustmentForm } from "@/shared/components/scm/forms/StockAdjustmentForm"
import { useScmWarehouseOpsStore, type ScmAdjustment } from "@/shared/data/scm/scm-warehouse-ops-store"

export default function StockAdjustmentPage() {
    const { toast } = useToast()
    const adjustments = useScmWarehouseOpsStore((s) => s.adjustments)
    const deleteAdjustment = useScmWarehouseOpsStore((s) => s.deleteAdjustment)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmAdjustment | null>(null)
    const [deleting, setDeleting] = useState<ScmAdjustment | null>(null)
    const [viewing, setViewing] = useState<ScmAdjustment | null>(null)

    const columns: DataTableColumn<ScmAdjustment>[] = useMemo(
        () => [
            { key: "adjustmentNumber", header: "Adjustment", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.adjustmentNumber}</span> },
            { key: "adjustmentDate", header: "Date", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.adjustmentDate}</span> },
            { key: "product", header: "Product", sortable: true, accessor: (r) => r.productName, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.sku}</p></div>
            )},
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "currentQuantity", header: "Before", width: "80px", align: "right", render: (r) => <span className="tabular-nums text-[#64748B]">{r.currentQuantity}</span> },
            { key: "adjustedQuantity", header: "After", width: "80px", align: "right", render: (r) => <span className="tabular-nums font-semibold text-[#0F172A]">{r.adjustedQuantity}</span> },
            {
                key: "delta", header: "Δ", width: "70px", align: "right",
                accessor: (r) => r.adjustedQuantity - r.currentQuantity,
                render: (r) => {
                    const d = r.adjustedQuantity - r.currentQuantity
                    return <span className={`tabular-nums font-semibold ${d > 0 ? "text-emerald-700" : d < 0 ? "text-red-600" : "text-[#64748B]"}`}>{d > 0 ? "+" : ""}{d}</span>
                }
            },
            { key: "adjustmentType", header: "Type", width: "150px", render: (r) => <StatusBadge status={r.adjustmentType} /> },
            { key: "approvedBy", header: "Approved By", width: "140px" },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (a: ScmAdjustment) => { setEditing(a); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => {
        if (!deleting) return
        deleteAdjustment(deleting.id)
        toast({ title: "Adjustment deleted", description: deleting.adjustmentNumber })
        setDeleting(null)
    }
    const handleExport = () => {
        if (adjustments.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Adjustment", "Date", "Product", "SKU", "Warehouse", "Before", "After", "Δ", "Type", "Reason", "Approved By", "Remarks"]
        const rows = adjustments.map((a) => [a.adjustmentNumber, a.adjustmentDate, a.productName, a.sku, a.warehouse, a.currentQuantity, a.adjustedQuantity, a.adjustedQuantity - a.currentQuantity, a.adjustmentType, a.reason, a.approvedBy, a.remarks])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-stock-adjustments-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} adjustments exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Stock Adjustment</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Correct inventory differences from audit, damage, or manual counts.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#f59e0b", boxShadow: "0 4px 12px #f59e0b33" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> New Adjustment
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={adjustments}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by number, product, warehouse, reason..."
                searchKeys={["adjustmentNumber", "productName", "sku", "warehouse", "reason", "approvedBy"]}
                pageSize={10}
                emptyMessage="No adjustments yet."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => (
                    <RowActions onEdit={() => handleEdit(row)} onDelete={() => setDeleting(row)} />
                )}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.adjustmentNumber}
                description={(r) => `${r.productName} · ${r.adjustmentDate}`}
                icon={<ClipboardCheck className="w-5 h-5" />}
                accentColor="#f59e0b"
            />

            <StockAdjustmentForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={mode} />

            <DeleteConfirmDialog
                open={!!deleting}
                onOpenChange={(o) => !o && setDeleting(null)}
                title="Delete this adjustment?"
                itemLabel={deleting ? `${deleting.adjustmentNumber} (${deleting.productName})` : ""}
                onConfirm={confirmDelete}
            />
        </div>
    )
}
