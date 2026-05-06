"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { VendorContractForm } from "@/shared/components/scm/forms/VendorContractForm"
import { useScmVendorExtraStore, type ScmVendorContract } from "@/shared/data/scm/scm-vendor-extra-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

export default function VendorContractsPage() {
    const { toast } = useToast()
    const contracts = useScmVendorExtraStore((s) => s.contracts)
    const deleteContract = useScmVendorExtraStore((s) => s.deleteContract)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmVendorContract | null>(null)
    const [deleting, setDeleting] = useState<ScmVendorContract | null>(null)

    const columns: DataTableColumn<ScmVendorContract>[] = useMemo(
        () => [
            { key: "contractNumber", header: "Contract #", width: "140px", sortable: true, render: (r) => <span className="font-semibold">{r.contractNumber}</span> },
            { key: "vendorName", header: "Vendor", sortable: true },
            { key: "contractStartDate", header: "Start", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.contractStartDate}</span> },
            { key: "contractEndDate", header: "End", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.contractEndDate}</span> },
            { key: "contractValue", header: "Value", width: "140px", align: "right", sortable: true, accessor: (r) => r.contractValue, render: (r) => <span className="tabular-nums font-semibold">{formatINR(r.contractValue)}</span> },
            { key: "paymentTerms", header: "Terms", width: "100px" },
            { key: "renewalReminderDate", header: "Renewal", width: "110px", render: (r) => <span className="tabular-nums">{r.renewalReminderDate}</span> },
            { key: "status", header: "Status", width: "130px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (c: ScmVendorContract) => { setEditing(c); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => { if (!deleting) return; deleteContract(deleting.id); toast({ title: "Contract deleted", description: deleting.contractNumber }); setDeleting(null) }
    const handleExport = () => {
        if (contracts.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Contract", "Vendor", "Start", "End", "Value", "Payment Terms", "Renewal Reminder", "Status", "Remarks"]
        const rows = contracts.map((c) => [c.contractNumber, c.vendorName, c.contractStartDate, c.contractEndDate, c.contractValue, c.paymentTerms, c.renewalReminderDate, c.status, c.remarks])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-contracts-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} contracts exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Vendor Contracts</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Track vendor agreements, terms, and renewal dates.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#8b5cf6", boxShadow: "0 4px 12px #8b5cf633" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> New Contract
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={contracts}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by contract, vendor..."
                searchKeys={["contractNumber", "vendorName"]}
                pageSize={10}
                emptyMessage="No contracts yet."
                actions={(row) => <RowActions onEdit={() => handleEdit(row)} onDelete={() => setDeleting(row)} />}
            />

            <VendorContractForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={mode} />
            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this contract?" itemLabel={deleting ? deleting.contractNumber : ""} onConfirm={confirmDelete} />
        </div>
    )
}
