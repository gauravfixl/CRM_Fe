"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download, FileSearch } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import { QuotationForm } from "@/shared/components/scm/forms/QuotationForm"
import { useScmProcurementExtraStore, type ScmQuotation } from "@/shared/data/scm/scm-procurement-extra-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)

export default function QuotationsPage() {
    const { toast } = useToast()
    const quotations = useScmProcurementExtraStore((s) => s.quotations)
    const updateQuotation = useScmProcurementExtraStore((s) => s.updateQuotation)
    const deleteQuotation = useScmProcurementExtraStore((s) => s.deleteQuotation)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmQuotation | null>(null)
    const [deleting, setDeleting] = useState<ScmQuotation | null>(null)
    const [viewing, setViewing] = useState<ScmQuotation | null>(null)

    const handleConvert = (q: ScmQuotation) => {
        updateQuotation(q.id, { status: "Converted to PO" })
        toast({ title: "Converted to PO", description: q.quotationId })
    }

    const columns: DataTableColumn<ScmQuotation>[] = useMemo(
        () => [
            { key: "quotationId", header: "Quotation #", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.quotationId}</span> },
            { key: "vendorName", header: "Vendor", sortable: true },
            { key: "product", header: "Product", sortable: true, accessor: (r) => r.productName, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.sku}</p></div>
            )},
            { key: "quantity", header: "Qty", width: "70px", align: "right", sortable: true, accessor: (r) => r.quantity, render: (r) => <span className="tabular-nums">{r.quantity}</span> },
            { key: "quotedPrice", header: "Quoted ₹", width: "120px", align: "right", sortable: true, accessor: (r) => r.quotedPrice, render: (r) => <span className="tabular-nums font-semibold">{formatINR(r.quotedPrice)}</span> },
            { key: "deliveryTime", header: "Delivery", width: "100px" },
            { key: "validityDate", header: "Valid Until", width: "120px", render: (r) => <span className="tabular-nums">{r.validityDate}</span> },
            { key: "status", header: "Status", width: "150px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (q: ScmQuotation) => { setEditing(q); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => { if (!deleting) return; deleteQuotation(deleting.id); toast({ title: "Quotation deleted", description: deleting.quotationId }); setDeleting(null) }
    const handleExport = () => {
        if (quotations.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Quotation ID", "Vendor", "Product", "SKU", "Quantity", "Quoted Price", "Delivery Time", "Validity Date", "Status", "Remarks"]
        const rows = quotations.map((q) => [q.quotationId, q.vendorName, q.productName, q.sku, q.quantity, q.quotedPrice, q.deliveryTime, q.validityDate, q.status, q.remarks])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-quotations-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} quotations exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Vendor Quotations</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Compare vendor offers and approve before raising a PO.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#8b5cf6", boxShadow: "0 4px 12px #8b5cf633" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> New Quotation
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={quotations}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by quotation, vendor, product..."
                searchKeys={["quotationId", "vendorName", "productName", "sku"]}
                pageSize={10}
                emptyMessage="No quotations yet."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => (
                    <RowActions
                        onEdit={() => handleEdit(row)}
                        onDelete={() => setDeleting(row)}
                        extraItems={
                            row.status !== "Converted to PO" && row.status !== "Expired"
                                ? <button onClick={() => handleConvert(row)} className="w-full text-left px-2 py-1.5 text-[13px] hover:bg-slate-100 rounded-md text-emerald-700">Convert to PO</button>
                                : undefined
                        }
                    />
                )}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.quotationId}
                description={(r) => `${r.vendorName} · ${r.productName}`}
                icon={<FileSearch className="w-5 h-5" />}
                accentColor="#8b5cf6"
            />

            <QuotationForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={mode} />
            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this quotation?" itemLabel={deleting ? deleting.quotationId : ""} onConfirm={confirmDelete} />
        </div>
    )
}
