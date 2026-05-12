"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Plus, Download, ShoppingCart } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { PurchaseOrderForm } from "@/shared/components/scm/forms/PurchaseOrderForm"
import { SideFormSheet } from "@/shared/components/ui/side-form-sheet"
import {
    useScmPurchaseOrdersStore,
    type ScmPurchaseOrder,
} from "@/shared/data/scm/scm-purchase-orders-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)

export default function PurchaseOrdersPage() {
    const { toast } = useToast()
    const purchaseOrders = useScmPurchaseOrdersStore((s) => s.purchaseOrders)
    const deletePO = useScmPurchaseOrdersStore((s) => s.deletePO)

    const [formOpen, setFormOpen] = useState(false)
    const [formMode, setFormMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmPurchaseOrder | null>(null)
    const [viewing, setViewing] = useState<ScmPurchaseOrder | null>(null)
    const [deleting, setDeleting] = useState<ScmPurchaseOrder | null>(null)

    const columns = useMemo<DataTableColumn<ScmPurchaseOrder>[]>(
        () => [
            { key: "poNumber", header: "PO #", width: "110px", sortable: true, render: (r) => <span className="font-semibold text-[#0F172A]">{r.poNumber}</span> },
            { key: "vendorName", header: "Vendor", sortable: true },
            { key: "orderDate", header: "Order Date", width: "120px", sortable: true, render: (r) => <span className="tabular-nums">{r.orderDate}</span> },
            { key: "expectedDelivery", header: "Expected", width: "120px", sortable: true, render: (r) => <span className="tabular-nums">{r.expectedDelivery}</span> },
            { key: "items", header: "Items", width: "70px", align: "right", accessor: (r) => r.items.length, render: (r) => <span className="tabular-nums text-[#64748B]">{r.items.length}</span> },
            {
                key: "totalAmount",
                header: "Total",
                width: "130px",
                align: "right",
                sortable: true,
                accessor: (r) => r.totalAmount,
                render: (r) => <span className="font-semibold tabular-nums text-[#0F172A]">{formatINR(r.totalAmount)}</span>,
            },
            { key: "paymentStatus", header: "Payment", width: "100px", render: (r) => <StatusBadge status={r.paymentStatus} /> },
            { key: "deliveryStatus", header: "Delivery", width: "110px", render: (r) => <StatusBadge status={r.deliveryStatus} /> },
            { key: "status", header: "Approval", width: "110px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setFormMode("create"); setFormOpen(true) }
    const handleEdit = (po: ScmPurchaseOrder) => { setEditing(po); setFormMode("edit"); setFormOpen(true) }
    const confirmDelete = () => {
        if (!deleting) return
        deletePO(deleting.id)
        toast({ title: "PO deleted", description: deleting.poNumber })
        setDeleting(null)
    }

    const handleExport = () => {
        if (purchaseOrders.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["PO Number", "Vendor", "Warehouse", "Order Date", "Expected", "Items", "Subtotal", "Tax", "Discount", "Total", "Payment", "Delivery", "Approval"]
        const rows = purchaseOrders.map((p) => [p.poNumber, p.vendorName, p.warehouse, p.orderDate, p.expectedDelivery, p.items.length, p.subtotal, p.taxAmount, p.discount, p.totalAmount, p.paymentStatus, p.deliveryStatus, p.status])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-purchase-orders-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} POs exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Purchase Orders</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Issue and track purchase orders to vendors.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#10b981", boxShadow: "0 4px 12px #10b98133" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> New Purchase Order
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={purchaseOrders}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by PO number, vendor, warehouse..."
                searchKeys={["poNumber", "vendorName", "warehouse", "status", "paymentStatus", "deliveryStatus"]}
                pageSize={10}
                emptyMessage="No purchase orders yet."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => (
                    <RowActions
                        onView={() => setViewing(row)}
                        onEdit={() => handleEdit(row)}
                        onDelete={() => setDeleting(row)}
                    />
                )}
            />

            <PurchaseOrderForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={formMode} />

            <SideFormSheet
                open={!!viewing}
                onOpenChange={(o) => !o && setViewing(null)}
                title={viewing?.poNumber ?? "Purchase Order"}
                description={viewing ? `Vendor: ${viewing.vendorName}` : undefined}
                icon={<ShoppingCart className="w-5 h-5" />}
                hideFooter
                width="lg"
                accentColor="#10b981"
            >
                {viewing && (
                    <div className="space-y-5">
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                            <Cell label="Vendor" value={viewing.vendorName} />
                            <Cell label="Warehouse" value={viewing.warehouse} />
                            <Cell label="Order Date" value={viewing.orderDate} />
                            <Cell label="Expected Delivery" value={viewing.expectedDelivery} />
                            <Cell label="Payment Terms" value={viewing.paymentTerms} />
                            <Cell label="Shipping Terms" value={viewing.shippingTerms} />
                            <Cell label="Approval" value={<StatusBadge status={viewing.status} />} />
                            <Cell label="Payment" value={<StatusBadge status={viewing.paymentStatus} />} />
                            <Cell label="Delivery" value={<StatusBadge status={viewing.deliveryStatus} />} />
                        </dl>

                        <div>
                            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-2">Line Items</h4>
                            <div className="border border-[#EEF1F6] rounded-lg overflow-hidden">
                                <table className="w-full text-[12.5px]">
                                    <thead className="bg-[#F8FAFC] text-[11px] uppercase tracking-wide text-[#64748B]">
                                        <tr>
                                            <th className="text-left px-3 py-2 font-semibold">Product</th>
                                            <th className="text-right px-3 py-2 font-semibold">Qty</th>
                                            <th className="text-right px-3 py-2 font-semibold">Unit ₹</th>
                                            <th className="text-right px-3 py-2 font-semibold">Tax %</th>
                                            <th className="text-right px-3 py-2 font-semibold">Line ₹</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewing.items.map((it, idx) => {
                                            const line = it.quantity * it.unitPrice * (1 + it.taxRate / 100)
                                            return (
                                                <tr key={idx} className="border-t border-[#F1F5F9]">
                                                    <td className="px-3 py-2">
                                                        <p className="font-medium text-[#0F172A]">{it.productName}</p>
                                                        <p className="text-[11px] text-[#94A3B8]">{it.sku}</p>
                                                    </td>
                                                    <td className="px-3 py-2 text-right tabular-nums">{it.quantity}</td>
                                                    <td className="px-3 py-2 text-right tabular-nums">{formatINR(it.unitPrice)}</td>
                                                    <td className="px-3 py-2 text-right tabular-nums">{it.taxRate}%</td>
                                                    <td className="px-3 py-2 text-right font-semibold tabular-nums">{formatINR(line)}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-[#F8FAFC] border border-[#EEF1F6] rounded-lg p-3 text-[13px] space-y-1.5">
                            <div className="flex justify-between text-[#64748B]"><span>Subtotal</span><span className="tabular-nums font-medium text-[#0F172A]">{formatINR(viewing.subtotal)}</span></div>
                            <div className="flex justify-between text-[#64748B]"><span>Tax</span><span className="tabular-nums font-medium text-[#0F172A]">{formatINR(viewing.taxAmount)}</span></div>
                            <div className="flex justify-between text-[#64748B]"><span>Discount</span><span className="tabular-nums font-medium text-[#0F172A]">− {formatINR(viewing.discount)}</span></div>
                            <div className="flex justify-between pt-1.5 border-t border-[#EEF1F6]">
                                <span className="font-semibold text-[#0F172A]">Total</span>
                                <span className="text-[15px] font-semibold tabular-nums text-[#10b981]">{formatINR(viewing.totalAmount)}</span>
                            </div>
                        </div>

                        {viewing.remarks && (
                            <div>
                                <dt className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">Remarks</dt>
                                <dd className="mt-0.5 text-[13px] text-[#0F172A] whitespace-pre-wrap">{viewing.remarks}</dd>
                            </div>
                        )}
                    </div>
                )}
            </SideFormSheet>

            <DeleteConfirmDialog
                open={!!deleting}
                onOpenChange={(o) => !o && setDeleting(null)}
                title="Delete this purchase order?"
                itemLabel={deleting ? `${deleting.poNumber} (${deleting.vendorName})` : ""}
                onConfirm={confirmDelete}
            />
        </div>
    )
}

function Cell({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <dt className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">{label}</dt>
            <dd className="mt-0.5 text-[13px] text-[#0F172A] font-medium">{value}</dd>
        </div>
    )
}
