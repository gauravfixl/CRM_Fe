"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Download, Filter } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions } from "@/shared/components/scm/shared/RowActions"
import { useScmReturnsStore, type ScmCustomerReturn } from "@/shared/data/scm/scm-returns-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)

type StatusFilter = "all" | "refund-pending" | "refund-processed" | "replacement-pending" | "replacement-shipped" | "completed" | "rejected"

export default function RefundReplacementStatusPage() {
    const { toast } = useToast()
    const customerReturns = useScmReturnsStore((s) => s.customerReturns)
    const updateReturn = useScmReturnsStore((s) => s.updateCustomerReturn)

    const [filter, setFilter] = useState<StatusFilter>("all")

    const filtered = useMemo(() => {
        if (filter === "all") return customerReturns
        const map: Record<StatusFilter, string[]> = {
            "all": [],
            "refund-pending": ["Approved", "Inspected"],
            "refund-processed": ["Refunded"],
            "replacement-pending": ["Approved", "Picked Up"],
            "replacement-shipped": ["Replaced"],
            "completed": ["Refunded", "Replaced"],
            "rejected": ["Rejected"],
        }
        return customerReturns.filter((r) => map[filter].includes(r.status))
    }, [customerReturns, filter])

    const summary = useMemo(() => ({
        refundPending: customerReturns.filter((r) => r.status === "Approved" || r.status === "Inspected").length,
        refundProcessed: customerReturns.filter((r) => r.status === "Refunded").length,
        replacementShipped: customerReturns.filter((r) => r.status === "Replaced").length,
        rejected: customerReturns.filter((r) => r.status === "Rejected").length,
    }), [customerReturns])

    const handleProcessRefund = (r: ScmCustomerReturn) => {
        updateReturn(r.id, { status: "Refunded" })
        toast({ title: "Refund processed", description: `${r.returnId} - ${formatINR(r.refundAmount)}` })
    }
    const handleShipReplacement = (r: ScmCustomerReturn) => {
        updateReturn(r.id, { status: "Replaced" })
        toast({ title: "Replacement shipped", description: r.returnId })
    }

    const columns: DataTableColumn<ScmCustomerReturn>[] = useMemo(
        () => [
            { key: "returnId", header: "Return", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.returnId}</span> },
            { key: "orderNumber", header: "Order", width: "110px" },
            { key: "customerName", header: "Customer", sortable: true },
            { key: "product", header: "Product", accessor: (r) => r.productName, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.sku}</p></div>
            )},
            { key: "quantity", header: "Qty", width: "70px", align: "right", render: (r) => <span className="tabular-nums">{r.quantity}</span> },
            { key: "refundAmount", header: "Amount", width: "120px", align: "right", accessor: (r) => r.refundAmount, render: (r) => <span className="tabular-nums">{formatINR(r.refundAmount)}</span> },
            { key: "returnDate", header: "Return Date", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.returnDate}</span> },
            { key: "status", header: "Status", width: "130px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Refund / Replacement Status</h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">Track refunds and replacements for customer returns.</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <Stat label="Refund Pending" value={summary.refundPending} color="#f59e0b" />
                <Stat label="Refunded" value={summary.refundProcessed} color="#10b981" />
                <Stat label="Replaced" value={summary.replacementShipped} color="#2563eb" />
                <Stat label="Rejected" value={summary.rejected} color="#ef4444" />
            </div>

            <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-4 flex items-center gap-3">
                <span className="text-[12px] font-medium text-[#64748B] inline-flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" /> Filter:</span>
                <Select value={filter} onValueChange={(v) => setFilter(v as StatusFilter)}>
                    <SelectTrigger className="h-9 w-[220px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="refund-pending">Refund Pending</SelectItem>
                        <SelectItem value="refund-processed">Refund Processed</SelectItem>
                        <SelectItem value="replacement-pending">Replacement Pending</SelectItem>
                        <SelectItem value="replacement-shipped">Replacement Shipped</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                rowKey={(r) => r.id}
                searchPlaceholder="Search returns..."
                searchKeys={["returnId", "orderNumber", "customerName", "productName"]}
                pageSize={15}
                emptyMessage="No returns match the filter."
                actions={(row) => (
                    <RowActions
                        extraItems={
                            <>
                                {row.status !== "Refunded" && row.status !== "Rejected" && (
                                    <button onClick={() => handleProcessRefund(row)} className="w-full text-left px-2 py-1.5 text-[13px] hover:bg-emerald-50 text-emerald-700 rounded-none">Process Refund</button>
                                )}
                                {row.status !== "Replaced" && row.status !== "Rejected" && (
                                    <button onClick={() => handleShipReplacement(row)} className="w-full text-left px-2 py-1.5 text-[13px] hover:bg-blue-50 text-blue-700 rounded-none">Ship Replacement</button>
                                )}
                            </>
                        }
                    />
                )}
            />
        </div>
    )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div
            className="rounded-none border shadow-sm p-4 transition-all duration-200"
            style={{
                background: `linear-gradient(135deg, ${color}14 0%, ${color}06 45%, #ffffff 100%)`,
                borderColor: `${color}33`,
            }}
        >
            <p className="text-[12px] font-medium text-[#64748B]">{label}</p>
            <p className="text-[22px] font-semibold mt-1 tabular-nums leading-tight" style={{ color }}>{value}</p>
        </div>
    )
}
