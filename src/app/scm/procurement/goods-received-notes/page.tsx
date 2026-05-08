"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { GRNForm } from "@/shared/components/scm/forms/GRNForm"
import { useScmProcurementExtraStore, type ScmGRN } from "@/shared/data/scm/scm-procurement-extra-store"

export default function GRNPage() {
    const { toast } = useToast()
    const grns = useScmProcurementExtraStore((s) => s.grns)
    const deleteGRN = useScmProcurementExtraStore((s) => s.deleteGRN)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmGRN | null>(null)
    const [deleting, setDeleting] = useState<ScmGRN | null>(null)

    const columns: DataTableColumn<ScmGRN>[] = useMemo(
        () => [
            { key: "grnNumber", header: "GRN #", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.grnNumber}</span> },
            { key: "poNumber", header: "PO #", width: "110px", sortable: true },
            { key: "vendorName", header: "Vendor", sortable: true },
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "receivedDate", header: "Received", width: "120px", sortable: true, render: (r) => <span className="tabular-nums">{r.receivedDate}</span> },
            { key: "expectedQuantity", header: "Expected", width: "90px", align: "right", render: (r) => <span className="tabular-nums">{r.expectedQuantity}</span> },
            { key: "receivedQuantity", header: "Received", width: "90px", align: "right", render: (r) => <span className="tabular-nums font-semibold text-emerald-700">{r.receivedQuantity}</span> },
            { key: "rejectedQuantity", header: "Rejected", width: "90px", align: "right", render: (r) => <span className={`tabular-nums ${r.rejectedQuantity > 0 ? "text-red-600 font-semibold" : "text-[#94A3B8]"}`}>{r.rejectedQuantity}</span> },
            { key: "qualityStatus", header: "Quality", width: "110px", render: (r) => <StatusBadge status={r.qualityStatus} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (g: ScmGRN) => { setEditing(g); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => { if (!deleting) return; deleteGRN(deleting.id); toast({ title: "GRN deleted", description: deleting.grnNumber }); setDeleting(null) }
    const handleExport = () => {
        if (grns.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["GRN", "PO", "Vendor", "Warehouse", "Received Date", "Expected", "Received", "Rejected", "Quality", "Remarks"]
        const rows = grns.map((g) => [g.grnNumber, g.poNumber, g.vendorName, g.warehouse, g.receivedDate, g.expectedQuantity, g.receivedQuantity, g.rejectedQuantity, g.qualityStatus, g.remarks])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-grns-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} GRNs exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Goods Received Notes</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Confirm receipt and quality of goods against purchase orders.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#10b981", boxShadow: "0 4px 12px #10b98133" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> New GRN
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={grns}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by GRN, PO, vendor..."
                searchKeys={["grnNumber", "poNumber", "vendorName", "warehouse"]}
                pageSize={10}
                emptyMessage="No GRNs yet."
                actions={(row) => <RowActions onEdit={() => handleEdit(row)} onDelete={() => setDeleting(row)} />}
            />

            <GRNForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={mode} />
            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this GRN?" itemLabel={deleting ? `${deleting.grnNumber} (${deleting.poNumber})` : ""} onConfirm={confirmDelete} />
        </div>
    )
}
