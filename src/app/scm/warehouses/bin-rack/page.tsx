"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { BinRackForm } from "@/shared/components/scm/forms/BinRackForm"
import { useScmWarehouseOpsStore, type ScmBin } from "@/shared/data/scm/scm-warehouse-ops-store"

export default function BinRackPage() {
    const { toast } = useToast()
    const bins = useScmWarehouseOpsStore((s) => s.bins)
    const deleteBin = useScmWarehouseOpsStore((s) => s.deleteBin)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmBin | null>(null)
    const [deleting, setDeleting] = useState<ScmBin | null>(null)

    const columns: DataTableColumn<ScmBin>[] = useMemo(
        () => [
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "zone", header: "Zone", sortable: true, width: "100px" },
            { key: "rackNumber", header: "Rack", sortable: true, width: "100px", render: (r) => <span className="font-mono">{r.rackNumber}</span> },
            { key: "binNumber", header: "Bin", sortable: true, width: "100px", render: (r) => <span className="font-mono font-semibold">{r.binNumber}</span> },
            { key: "capacity", header: "Capacity", sortable: true, width: "100px", align: "right", accessor: (r) => r.capacity, render: (r) => <span className="tabular-nums">{r.capacity}</span> },
            { key: "productAssigned", header: "Product", render: (r) => <span className={r.productAssigned === "—" ? "text-[#94A3B8]" : "text-[#0F172A] font-medium"}>{r.productAssigned}</span> },
            { key: "status", header: "Status", width: "110px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (b: ScmBin) => { setEditing(b); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => { if (!deleting) return; deleteBin(deleting.id); toast({ title: "Bin deleted", description: deleting.binNumber }); setDeleting(null) }
    const handleExport = () => {
        if (bins.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Warehouse", "Zone", "Rack", "Bin", "Capacity", "Product Assigned", "Status"]
        const rows = bins.map((b) => [b.warehouse, b.zone, b.rackNumber, b.binNumber, b.capacity, b.productAssigned, b.status])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-bin-rack-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} bins exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Bin / Rack Management</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Define internal storage locations within each warehouse.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#0ea5e9", boxShadow: "0 4px 12px #0ea5e933" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> Add Bin
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={bins}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by warehouse, zone, rack, bin..."
                searchKeys={["warehouse", "zone", "rackNumber", "binNumber", "productAssigned"]}
                pageSize={15}
                emptyMessage="No bins yet. Add one to start tracking storage locations."
                actions={(row) => <RowActions onEdit={() => handleEdit(row)} onDelete={() => setDeleting(row)} />}
            />

            <BinRackForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={mode} />
            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this bin?" itemLabel={deleting ? `${deleting.binNumber} (${deleting.warehouse})` : ""} onConfirm={confirmDelete} />
        </div>
    )
}
