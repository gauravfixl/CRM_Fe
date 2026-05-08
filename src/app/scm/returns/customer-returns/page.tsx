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
import { CustomerReturnForm } from "@/shared/components/scm/forms/CustomerReturnForm"
import { useScmReturnsStore, type ScmCustomerReturn } from "@/shared/data/scm/scm-returns-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)

export default function CustomerReturnsPage() {
    const { toast } = useToast()
    const customerReturns = useScmReturnsStore((s) => s.customerReturns)
    const deleteReturn = useScmReturnsStore((s) => s.deleteCustomerReturn)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmCustomerReturn | null>(null)
    const [deleting, setDeleting] = useState<ScmCustomerReturn | null>(null)
    const [viewing, setViewing] = useState<ScmCustomerReturn | null>(null)

    const columns: DataTableColumn<ScmCustomerReturn>[] = useMemo(
        () => [
            { key: "returnId", header: "Return #", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.returnId}</span> },
            { key: "orderNumber", header: "Order #", width: "110px", sortable: true },
            { key: "customerName", header: "Customer", sortable: true },
            { key: "product", header: "Product", sortable: true, accessor: (r) => r.productName, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.sku}</p></div>
            )},
            { key: "quantity", header: "Qty", width: "70px", align: "right", accessor: (r) => r.quantity, render: (r) => <span className="tabular-nums font-semibold">{r.quantity}</span> },
            { key: "reason", header: "Reason", width: "180px" },
            { key: "refundAmount", header: "Refund", width: "120px", align: "right", accessor: (r) => r.refundAmount, render: (r) => <span className="tabular-nums">{formatINR(r.refundAmount)}</span> },
            { key: "returnDate", header: "Date", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.returnDate}</span> },
            { key: "status", header: "Status", width: "120px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (r: ScmCustomerReturn) => { setEditing(r); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => { if (!deleting) return; deleteReturn(deleting.id); toast({ title: "Return deleted", description: deleting.returnId }); setDeleting(null) }
    const handleExport = () => {
        if (customerReturns.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Return", "Order", "Customer", "Product", "SKU", "Quantity", "Reason", "Refund Amount", "Return Date", "Status"]
        const rows = customerReturns.map((r) => [r.returnId, r.orderNumber, r.customerName, r.productName, r.sku, r.quantity, r.reason, r.refundAmount, r.returnDate, r.status])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-customer-returns-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} returns exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Customer Returns</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Track returns received from customers.</p>
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
                data={customerReturns}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by return, order, customer, product..."
                searchKeys={["returnId", "orderNumber", "customerName", "productName", "sku"]}
                pageSize={10}
                emptyMessage="No customer returns yet."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => <RowActions onEdit={() => handleEdit(row)} onDelete={() => setDeleting(row)} />}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.returnId}
                description={(r) => `${r.customerName} · Order ${r.orderNumber}`}
                icon={<RotateCcw className="w-5 h-5" />}
                accentColor="#ef4444"
            />

            <CustomerReturnForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={mode} />
            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this return?" itemLabel={deleting ? deleting.returnId : ""} onConfirm={confirmDelete} />
        </div>
    )
}
