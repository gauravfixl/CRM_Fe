"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { PurchaseRequestForm } from "@/shared/components/scm/forms/PurchaseRequestForm"
import { useScmProcurementExtraStore, type ScmPurchaseRequest } from "@/shared/data/scm/scm-procurement-extra-store"

export default function PurchaseRequestsPage() {
    const { toast } = useToast()
    const purchaseRequests = useScmProcurementExtraStore((s) => s.purchaseRequests)
    const deletePR = useScmProcurementExtraStore((s) => s.deletePR)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmPurchaseRequest | null>(null)
    const [deleting, setDeleting] = useState<ScmPurchaseRequest | null>(null)

    const columns: DataTableColumn<ScmPurchaseRequest>[] = useMemo(
        () => [
            { key: "requestNumber", header: "PR #", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.requestNumber}</span> },
            { key: "requestedBy", header: "Requested By", sortable: true, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.requestedBy}</p><p className="text-[11.5px] text-[#94A3B8]">{r.department}</p></div>
            )},
            { key: "product", header: "Product", sortable: true, accessor: (r) => r.productName, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.sku}</p></div>
            )},
            { key: "quantity", header: "Qty", width: "80px", align: "right", sortable: true, accessor: (r) => r.quantity, render: (r) => <span className="tabular-nums font-semibold">{r.quantity}</span> },
            { key: "requiredDate", header: "Required", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.requiredDate}</span> },
            { key: "priority", header: "Priority", width: "110px", render: (r) => <StatusBadge status={r.priority} /> },
            { key: "status", header: "Status", width: "150px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (p: ScmPurchaseRequest) => { setEditing(p); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => { if (!deleting) return; deletePR(deleting.id); toast({ title: "PR deleted", description: deleting.requestNumber }); setDeleting(null) }
    const handleExport = () => {
        if (purchaseRequests.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["PR Number", "Requested By", "Department", "Product", "SKU", "Quantity", "Required Date", "Priority", "Status", "Remarks"]
        const rows = purchaseRequests.map((p) => [p.requestNumber, p.requestedBy, p.department, p.productName, p.sku, p.quantity, p.requiredDate, p.priority, p.status, p.remarks])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-purchase-requests-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} requests exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Purchase Requests</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Submit and track requests for procurement.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#10b981", boxShadow: "0 4px 12px #10b98133" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> New Request
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={purchaseRequests}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by PR number, requester, product..."
                searchKeys={["requestNumber", "requestedBy", "department", "productName", "sku"]}
                pageSize={10}
                emptyMessage="No purchase requests yet."
                actions={(row) => <RowActions onEdit={() => handleEdit(row)} onDelete={() => setDeleting(row)} />}
            />

            <PurchaseRequestForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={mode} />
            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this request?" itemLabel={deleting ? `${deleting.requestNumber} (${deleting.productName})` : ""} onConfirm={confirmDelete} />
        </div>
    )
}
