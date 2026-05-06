"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download, AlertTriangle } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { DamageForm } from "@/shared/components/scm/forms/DamageForm"
import { useScmReturnsStore, type ScmDamageRecord } from "@/shared/data/scm/scm-returns-store"

export default function DamagedGoodsPage() {
    const { toast } = useToast()
    const damages = useScmReturnsStore((s) => s.damages)
    const deleteDamage = useScmReturnsStore((s) => s.deleteDamage)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmDamageRecord | null>(null)
    const [deleting, setDeleting] = useState<ScmDamageRecord | null>(null)

    const columns: DataTableColumn<ScmDamageRecord>[] = useMemo(
        () => [
            { key: "damageId", header: "Damage ID", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.damageId}</span> },
            { key: "product", header: "Product", sortable: true, accessor: (r) => r.productName, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.sku}</p></div>
            )},
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "quantity", header: "Qty", width: "80px", align: "right", sortable: true, accessor: (r) => r.quantity, render: (r) => <span className="tabular-nums font-semibold text-red-600">{r.quantity}</span> },
            { key: "damageReason", header: "Reason", width: "180px" },
            { key: "reportedBy", header: "Reported By", width: "150px" },
            { key: "reportedDate", header: "Date", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.reportedDate}</span> },
            { key: "status", header: "Status", width: "120px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (d: ScmDamageRecord) => { setEditing(d); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => { if (!deleting) return; deleteDamage(deleting.id); toast({ title: "Damage record deleted", description: deleting.damageId }); setDeleting(null) }
    const handleExport = () => {
        if (damages.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Damage ID", "Product", "SKU", "Warehouse", "Quantity", "Reason", "Reported By", "Date", "Action Taken", "Status", "Remarks"]
        const rows = damages.map((d) => [d.damageId, d.productName, d.sku, d.warehouse, d.quantity, d.damageReason, d.reportedBy, d.reportedDate, d.actionTaken, d.status, d.remarks])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-damaged-goods-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} records exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" /> Damaged Goods
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Log and track damaged inventory across warehouses.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#ef4444", boxShadow: "0 4px 12px #ef444433" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> Report Damage
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={damages}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by damage ID, product, warehouse..."
                searchKeys={["damageId", "productName", "sku", "warehouse", "damageReason", "reportedBy"]}
                pageSize={10}
                emptyMessage="No damaged goods reported."
                actions={(row) => <RowActions onEdit={() => handleEdit(row)} onDelete={() => setDeleting(row)} />}
            />

            <DamageForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={mode} />
            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this damage record?" itemLabel={deleting ? deleting.damageId : ""} onConfirm={confirmDelete} />
        </div>
    )
}
