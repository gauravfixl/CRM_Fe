"use client"

import * as React from "react"
import { useMemo } from "react"
import { Check, X, Search } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmReturnsStore, type ScmCustomerReturn } from "@/shared/data/scm/scm-returns-store"
import { useScmProcurementExtraStore, type ScmPurchaseReturn } from "@/shared/data/scm/scm-procurement-extra-store"

interface ApprovalRow {
    id: string
    type: "Customer" | "Supplier"
    reference: string
    party: string
    product: string
    quantity: number
    reason: string
    raw: ScmCustomerReturn | ScmPurchaseReturn
}

export default function ReturnApprovalsPage() {
    const { toast } = useToast()
    const customerReturns = useScmReturnsStore((s) => s.customerReturns)
    const updateCustomerReturn = useScmReturnsStore((s) => s.updateCustomerReturn)
    const purchaseReturns = useScmProcurementExtraStore((s) => s.purchaseReturns)
    const updatePurchaseReturn = useScmProcurementExtraStore((s) => s.updatePurchaseReturn)

    const rows: ApprovalRow[] = useMemo(() => {
        const fromCustomers: ApprovalRow[] = customerReturns
            .filter((r) => r.status === "Requested")
            .map((r) => ({ id: `cr_${r.id}`, type: "Customer", reference: r.returnId, party: r.customerName, product: `${r.productName} (${r.sku})`, quantity: r.quantity, reason: r.reason, raw: r }))
        const fromSuppliers: ApprovalRow[] = purchaseReturns
            .filter((r) => r.status === "Pending")
            .map((r) => ({ id: `sr_${r.id}`, type: "Supplier", reference: r.returnNumber, party: r.vendorName, product: `${r.productName} (${r.sku})`, quantity: r.quantityReturned, reason: r.reason, raw: r }))
        return [...fromCustomers, ...fromSuppliers]
    }, [customerReturns, purchaseReturns])

    const handleApprove = (row: ApprovalRow) => {
        if (row.type === "Customer") {
            updateCustomerReturn((row.raw as ScmCustomerReturn).id, { status: "Approved" })
        } else {
            updatePurchaseReturn((row.raw as ScmPurchaseReturn).id, { status: "Approved" })
        }
        toast({ title: "Return approved", description: row.reference })
    }
    const handleReject = (row: ApprovalRow) => {
        if (row.type === "Customer") {
            updateCustomerReturn((row.raw as ScmCustomerReturn).id, { status: "Rejected" })
        } else {
            updatePurchaseReturn((row.raw as ScmPurchaseReturn).id, { status: "Rejected" })
        }
        toast({ title: "Return rejected", description: row.reference })
    }
    const handleInspect = (row: ApprovalRow) => {
        toast({ title: "Inspection requested", description: row.reference })
    }

    const columns: DataTableColumn<ApprovalRow>[] = useMemo(
        () => [
            { key: "type", header: "Type", width: "120px", render: (r) => <StatusBadge status={r.type === "Customer" ? "Customer" : "Supplier"} tone={r.type === "Customer" ? "info" : "purple"} /> },
            { key: "reference", header: "Reference", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.reference}</span> },
            { key: "party", header: "Customer / Vendor", sortable: true },
            { key: "product", header: "Product" },
            { key: "quantity", header: "Qty", width: "80px", align: "right", render: (r) => <span className="tabular-nums font-semibold">{r.quantity}</span> },
            { key: "reason", header: "Reason" },
        ],
        []
    )

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Return Approvals</h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">Pending customer and supplier returns awaiting decision.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div
                    className="rounded-xl border shadow-sm p-4"
                    style={{ background: "linear-gradient(135deg, #2563eb14 0%, #2563eb06 45%, #ffffff 100%)", borderColor: "#2563eb33" }}
                >
                    <p className="text-[12px] text-[#64748B] font-medium">Customer Returns</p>
                    <p className="text-[22px] font-semibold text-blue-600 mt-1 tabular-nums leading-tight">{rows.filter((r) => r.type === "Customer").length}</p>
                </div>
                <div
                    className="rounded-xl border shadow-sm p-4"
                    style={{ background: "linear-gradient(135deg, #8b5cf614 0%, #8b5cf606 45%, #ffffff 100%)", borderColor: "#8b5cf633" }}
                >
                    <p className="text-[12px] text-[#64748B] font-medium">Supplier Returns</p>
                    <p className="text-[22px] font-semibold text-purple-600 mt-1 tabular-nums leading-tight">{rows.filter((r) => r.type === "Supplier").length}</p>
                </div>
                <div
                    className="rounded-xl border shadow-sm p-4"
                    style={{ background: "linear-gradient(135deg, #0F172A14 0%, #0F172A06 45%, #ffffff 100%)", borderColor: "#0F172A22" }}
                >
                    <p className="text-[12px] text-[#64748B] font-medium">Total Pending</p>
                    <p className="text-[22px] font-semibold text-[#0F172A] mt-1 tabular-nums leading-tight">{rows.length}</p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={rows}
                rowKey={(r) => r.id}
                searchPlaceholder="Search returns..."
                searchKeys={["reference", "party", "product", "reason"]}
                pageSize={15}
                emptyMessage="No returns pending approval."
                actions={(row) => (
                    <div className="flex items-center gap-1 justify-end">
                        <Button onClick={() => handleApprove(row)} size="sm" variant="ghost" className="h-8 px-2 text-emerald-700 hover:bg-emerald-50" title="Approve">
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleReject(row)} size="sm" variant="ghost" className="h-8 px-2 text-red-600 hover:bg-red-50" title="Reject">
                            <X className="w-4 h-4" />
                        </Button>
                        <Button onClick={() => handleInspect(row)} size="sm" variant="ghost" className="h-8 px-2 text-blue-600 hover:bg-blue-50" title="Request inspection">
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            />
        </div>
    )
}
