"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download, RotateCcw } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import { PurchaseReturnForm } from "@/shared/components/scm/forms/PurchaseReturnForm"
import { useScmProcurementExtraStore, type ScmPurchaseReturn } from "@/shared/data/scm/scm-procurement-extra-store"

export default function PurchaseReturnsPage() {
    const { toast } = useToast()
    const purchaseReturns = useScmProcurementExtraStore((s) => s.purchaseReturns)
    const deletePR = useScmProcurementExtraStore((s) => s.deletePurchaseReturn)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmPurchaseReturn | null>(null)
    const [deleting, setDeleting] = useState<ScmPurchaseReturn | null>(null)
    const [viewing, setViewing] = useState<ScmPurchaseReturn | null>(null)

    const columns: DataTableColumn<ScmPurchaseReturn>[] = useMemo(
        () => [
            { key: "returnNumber", header: "Return #", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.returnNumber}</span> },
            { key: "poNumber", header: "PO #", width: "110px", sortable: true },
            { key: "vendorName", header: "Vendor", sortable: true },
            { key: "product", header: "Product", sortable: true, accessor: (r) => r.productName, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.sku}</p></div>
            )},
            { key: "quantityReturned", header: "Qty", width: "80px", align: "right", sortable: true, accessor: (r) => r.quantityReturned, render: (r) => <span className="tabular-nums font-semibold text-red-600">{r.quantityReturned}</span> },
            { key: "refundType", header: "Action", width: "120px", render: (r) => <StatusBadge status={r.refundType} /> },
            { key: "returnDate", header: "Return Date", width: "120px", sortable: true, render: (r) => <span className="tabular-nums">{r.returnDate}</span> },
            { key: "status", header: "Status", width: "110px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (p: ScmPurchaseReturn) => { setEditing(p); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => { if (!deleting) return; deletePR(deleting.id); toast({ title: "Return deleted", description: deleting.returnNumber }); setDeleting(null) }
    const handleExport = () => {
        if (purchaseReturns.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Return", "PO", "Vendor", "Product", "SKU", "Qty Returned", "Refund Type", "Reason", "Return Date", "Status"]
        const rows = purchaseReturns.map((p) => [p.returnNumber, p.poNumber, p.vendorName, p.productName, p.sku, p.quantityReturned, p.refundType, p.reason, p.returnDate, p.status])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-purchase-returns-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} returns exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Purchase Returns</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Return defective or incorrect goods to vendors.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#ef4444", boxShadow: "0 4px 12px #ef444433" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> New Return
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={purchaseReturns}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by return, PO, vendor, product..."
                searchKeys={["returnNumber", "poNumber", "vendorName", "productName", "sku"]}
                pageSize={10}
                emptyMessage="No purchase returns yet."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => <RowActions onEdit={() => handleEdit(row)} onDelete={() => setDeleting(row)} />}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.returnNumber}
                description={(r) => `PO ${r.poNumber} · ${r.vendorName}`}
                icon={<RotateCcw className="w-5 h-5" />}
                accentColor="#ef4444"
            />

            <PurchaseReturnForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={mode} />
            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this return?" itemLabel={deleting ? deleting.returnNumber : ""} onConfirm={confirmDelete} />
        </div>
    )
}
