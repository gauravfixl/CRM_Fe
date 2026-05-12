"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download, ArrowRight, Truck } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import { TransferForm } from "@/shared/components/scm/forms/TransferForm"
import { useScmWarehouseOpsStore, type ScmTransfer } from "@/shared/data/scm/scm-warehouse-ops-store"

export default function WarehouseTransfersPage() {
    const { toast } = useToast()
    const transfers = useScmWarehouseOpsStore((s) => s.transfers)
    const deleteTransfer = useScmWarehouseOpsStore((s) => s.deleteTransfer)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmTransfer | null>(null)
    const [deleting, setDeleting] = useState<ScmTransfer | null>(null)
    const [viewing, setViewing] = useState<ScmTransfer | null>(null)

    const columns: DataTableColumn<ScmTransfer>[] = useMemo(
        () => [
            { key: "transferNumber", header: "Transfer #", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.transferNumber}</span> },
            { key: "route", header: "Route", accessor: (r) => `${r.fromWarehouse} → ${r.toWarehouse}`, render: (r) => (
                <div className="inline-flex items-center gap-1.5 text-[#0F172A]">
                    <span className="font-medium">{r.fromWarehouse}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span className="font-medium">{r.toWarehouse}</span>
                </div>
            )},
            { key: "product", header: "Product", sortable: true, accessor: (r) => r.productName, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.sku}</p></div>
            )},
            { key: "quantity", header: "Qty", width: "80px", align: "right", sortable: true, accessor: (r) => r.quantity, render: (r) => <span className="tabular-nums font-semibold">{r.quantity}</span> },
            { key: "transferDate", header: "Transfer Date", width: "120px", sortable: true, render: (r) => <span className="tabular-nums">{r.transferDate}</span> },
            { key: "expectedArrivalDate", header: "Expected", width: "120px", sortable: true, render: (r) => <span className="tabular-nums">{r.expectedArrivalDate}</span> },
            { key: "status", header: "Status", width: "120px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (t: ScmTransfer) => { setEditing(t); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => { if (!deleting) return; deleteTransfer(deleting.id); toast({ title: "Transfer deleted", description: deleting.transferNumber }); setDeleting(null) }

    const handleExport = () => {
        if (transfers.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Transfer Number", "From", "To", "Product", "SKU", "Quantity", "Transfer Date", "Expected", "Status", "Remarks"]
        const rows = transfers.map((t) => [t.transferNumber, t.fromWarehouse, t.toWarehouse, t.productName, t.sku, t.quantity, t.transferDate, t.expectedArrivalDate, t.status, t.remarks])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-transfers-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} transfers exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Warehouse Transfers</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Move stock between warehouse locations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#0ea5e9", boxShadow: "0 4px 12px #0ea5e933" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> New Transfer
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={transfers}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by transfer number, product, warehouse..."
                searchKeys={["transferNumber", "productName", "sku", "fromWarehouse", "toWarehouse"]}
                pageSize={10}
                emptyMessage="No transfers yet."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => <RowActions onEdit={() => handleEdit(row)} onDelete={() => setDeleting(row)} />}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.transferNumber}
                description={(r) => `${r.fromWarehouse} → ${r.toWarehouse}`}
                icon={<Truck className="w-5 h-5" />}
                accentColor="#0ea5e9"
            />

            <TransferForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={mode} />
            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this transfer?" itemLabel={deleting ? `${deleting.transferNumber} (${deleting.productName})` : ""} onConfirm={confirmDelete} />
        </div>
    )
}
