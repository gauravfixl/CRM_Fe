"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Check, X, ArrowUpRight, ChevronLeft, ChevronRight, ShoppingCart, ClipboardCheck, User, Calendar, AlertCircle, Package } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmProcurementExtraStore, type ScmPurchaseRequest } from "@/shared/data/scm/scm-procurement-extra-store"
import { useScmPurchaseOrdersStore, type ScmPurchaseOrder } from "@/shared/data/scm/scm-purchase-orders-store"

interface ApprovalRow {
    id: string
    type: "Purchase Request" | "Purchase Order"
    reference: string
    requestedBy: string
    department?: string
    summary: string
    amount: string
    rawAmount: number
    priority: string
    status: string
    date: string
    items?: { productName: string; sku: string; quantity: number; unitPrice?: number }[]
    raw: ScmPurchaseRequest | ScmPurchaseOrder
}

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

const PRIORITY_TONE: Record<string, { bg: string; text: string; border: string }> = {
    Low: { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" },
    Medium: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    High: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    Urgent: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
}

export default function ApprovalsPage() {
    const { toast } = useToast()
    const purchaseRequests = useScmProcurementExtraStore((s) => s.purchaseRequests)
    const updatePR = useScmProcurementExtraStore((s) => s.updatePR)
    const purchaseOrders = useScmPurchaseOrdersStore((s) => s.purchaseOrders)
    const updatePO = useScmPurchaseOrdersStore((s) => s.updatePO)

    const rows: ApprovalRow[] = useMemo(() => {
        const fromPR: ApprovalRow[] = purchaseRequests
            .filter((p) => p.status === "Submitted" || p.status === "Draft")
            .map((p) => ({
                id: `pr_${p.id}`,
                type: "Purchase Request",
                reference: p.requestNumber,
                requestedBy: p.requestedBy,
                department: p.department,
                summary: `${p.quantity} × ${p.productName}`,
                amount: "—",
                rawAmount: 0,
                priority: p.priority,
                status: p.status,
                date: p.requiredDate,
                items: [{ productName: p.productName, sku: p.sku, quantity: p.quantity }],
                raw: p,
            }))
        const fromPO: ApprovalRow[] = purchaseOrders
            .filter((p) => p.status === "Pending" || p.status === "Draft")
            .map((p) => ({
                id: `po_${p.id}`,
                type: "Purchase Order",
                reference: p.poNumber,
                requestedBy: p.vendorName,
                summary: `${p.items.length} item(s)`,
                amount: formatINR(p.totalAmount),
                rawAmount: p.totalAmount,
                priority: p.totalAmount >= 100000 ? "High" : p.totalAmount >= 50000 ? "Medium" : "Low",
                status: p.status,
                date: p.orderDate,
                items: p.items.map((it) => ({ productName: it.productName, sku: it.sku, quantity: it.quantity, unitPrice: it.unitPrice })),
                raw: p,
            }))
        return [...fromPR, ...fromPO]
    }, [purchaseRequests, purchaseOrders])

    const [activeIndex, setActiveIndex] = useState(0)
    const safeIndex = Math.min(activeIndex, Math.max(0, rows.length - 1))
    const active = rows[safeIndex]

    const handleApprove = (row: ApprovalRow) => {
        if (row.type === "Purchase Request") {
            updatePR((row.raw as ScmPurchaseRequest).id, { status: "Approved" })
            toast({ title: "Request approved", description: row.reference })
        } else {
            updatePO((row.raw as ScmPurchaseOrder).id, { status: "Approved" })
            toast({ title: "PO approved", description: row.reference })
        }
        if (safeIndex >= rows.length - 1) setActiveIndex(0)
    }
    const handleReject = (row: ApprovalRow) => {
        if (row.type === "Purchase Request") {
            updatePR((row.raw as ScmPurchaseRequest).id, { status: "Rejected" })
            toast({ title: "Request rejected", description: row.reference })
        } else {
            updatePO((row.raw as ScmPurchaseOrder).id, { status: "Rejected" })
            toast({ title: "PO rejected", description: row.reference })
        }
        if (safeIndex >= rows.length - 1) setActiveIndex(0)
    }
    const handleEscalate = (row: ApprovalRow) => {
        toast({ title: "Escalated to senior manager", description: row.reference })
    }

    if (rows.length === 0) {
        return (
            <div className="space-y-4">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Approval Queue</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Pending purchase requests and purchase orders awaiting approval.</p>
                </div>
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-12 text-center">
                    <div className="w-14 h-14 rounded-none bg-emerald-50 flex items-center justify-center mx-auto">
                        <Check className="w-7 h-7 text-emerald-600" />
                    </div>
                    <p className="text-[15px] font-semibold text-[#0F172A] mt-4">All caught up!</p>
                    <p className="text-[13px] text-[#64748B] mt-1">No items pending approval.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Approval Queue</h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">Review one item at a time. Use arrows to navigate or click items in the queue.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <SummaryCard label="Pending Requests" value={rows.filter((r) => r.type === "Purchase Request").length} color="#f59e0b" />
                <SummaryCard label="Pending POs" value={rows.filter((r) => r.type === "Purchase Order").length} color="#2563eb" />
                <SummaryCard label="High / Urgent" value={rows.filter((r) => r.priority === "High" || r.priority === "Urgent").length} color="#ef4444" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Queue list */}
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm lg:col-span-1 max-h-[640px] overflow-y-auto">
                    <div className="px-4 py-3 border-b border-[#EEF1F6] sticky top-0 bg-white z-10">
                        <p className="text-[13px] font-semibold text-[#0F172A]">Queue</p>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">{rows.length} pending</p>
                    </div>
                    <ul className="p-2 space-y-1">
                        {rows.map((r, idx) => {
                            const isActive = idx === safeIndex
                            return (
                                <li key={r.id}>
                                    <button
                                        onClick={() => setActiveIndex(idx)}
                                        className={cn(
                                            "w-full text-left p-2.5 rounded-none border transition-colors",
                                            isActive
                                                ? "bg-blue-50 border-blue-200"
                                                : "border-transparent hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-semibold text-[13px] text-[#0F172A] truncate">{r.reference}</span>
                                            <PriorityChip priority={r.priority} />
                                        </div>
                                        <p className="text-[12px] text-[#64748B] mt-0.5 truncate">{r.requestedBy}</p>
                                        <div className="flex items-center justify-between gap-2 mt-1">
                                            <StatusBadge status={r.type} tone={r.type === "Purchase Request" ? "info" : "purple"} />
                                            {r.amount !== "—" && (
                                                <span className="text-[11.5px] font-semibold tabular-nums text-[#0F172A]">{r.amount}</span>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>

                {/* Active card */}
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm lg:col-span-2 flex flex-col">
                    <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-center justify-between gap-3 bg-[#F8FAFC] rounded-none">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="w-9 h-9 rounded-none flex items-center justify-center shrink-0 text-white" style={{ backgroundColor: active.type === "Purchase Order" ? "#8b5cf6" : "#2563eb" }}>
                                {active.type === "Purchase Order" ? <ShoppingCart className="w-4 h-4" /> : <ClipboardCheck className="w-4 h-4" />}
                            </span>
                            <div className="min-w-0">
                                <p className="text-[15px] font-semibold text-[#0F172A]">{active.reference}</p>
                                <p className="text-[11.5px] text-[#64748B]">{active.type}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline" onClick={() => setActiveIndex((i) => Math.max(0, i - 1))} disabled={safeIndex === 0} className="h-8 w-8 p-0 border-[#E5E7EB]">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="text-[12px] text-[#64748B] px-2 tabular-nums">{safeIndex + 1} / {rows.length}</span>
                            <Button size="sm" variant="outline" onClick={() => setActiveIndex((i) => Math.min(rows.length - 1, i + 1))} disabled={safeIndex === rows.length - 1} className="h-8 w-8 p-0 border-[#E5E7EB]">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 p-5 space-y-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <DetailCell icon={<User className="w-3.5 h-3.5" />} label={active.type === "Purchase Order" ? "Vendor" : "Requested by"} value={active.requestedBy} />
                            {active.department && (
                                <DetailCell icon={<Package className="w-3.5 h-3.5" />} label="Department" value={active.department} />
                            )}
                            <DetailCell icon={<Calendar className="w-3.5 h-3.5" />} label={active.type === "Purchase Order" ? "Order Date" : "Required by"} value={active.date} />
                            <DetailCell icon={<AlertCircle className="w-3.5 h-3.5" />} label="Priority" value={<PriorityChip priority={active.priority} />} />
                            <DetailCell icon={<ClipboardCheck className="w-3.5 h-3.5" />} label="Current Status" value={<StatusBadge status={active.status} />} />
                            {active.amount !== "—" && (
                                <DetailCell icon={<ShoppingCart className="w-3.5 h-3.5" />} label="Total Amount" value={<span className="text-[15px] font-semibold text-[#10b981] tabular-nums">{active.amount}</span>} />
                            )}
                        </div>

                        {active.items && active.items.length > 0 && (
                            <div>
                                <p className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8] mb-2">Items</p>
                                <div className="border border-[#EEF1F6] rounded-none overflow-hidden">
                                    <table className="w-full text-[12.5px]">
                                        <thead className="bg-[#F8FAFC] text-[11px] uppercase tracking-wide text-[#64748B]">
                                            <tr>
                                                <th className="text-left px-3 py-2 font-semibold">Product</th>
                                                <th className="text-right px-3 py-2 font-semibold">Qty</th>
                                                {active.items.some((i) => i.unitPrice != null) && <th className="text-right px-3 py-2 font-semibold">Unit ₹</th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {active.items.map((it, idx) => (
                                                <tr key={idx} className="border-t border-[#F1F5F9]">
                                                    <td className="px-3 py-2">
                                                        <p className="font-medium text-[#0F172A]">{it.productName}</p>
                                                        <p className="text-[11px] text-[#94A3B8]">{it.sku}</p>
                                                    </td>
                                                    <td className="px-3 py-2 text-right tabular-nums">{it.quantity}</td>
                                                    {active.items!.some((i) => i.unitPrice != null) && (
                                                        <td className="px-3 py-2 text-right tabular-nums">{it.unitPrice != null ? formatINR(it.unitPrice) : "—"}</td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-5 py-4 border-t border-[#EEF1F6] bg-[#FAFBFC] flex items-center justify-between gap-2 rounded-none">
                        <Button variant="outline" onClick={() => handleEscalate(active)} className="h-10 rounded-none border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                            <ArrowUpRight className="w-4 h-4 mr-1.5" /> Escalate
                        </Button>
                        <div className="flex items-center gap-2">
                            <Button onClick={() => handleReject(active)} variant="outline" className="h-10 rounded-none border-red-200 text-red-700 hover:bg-red-50 text-[13px]">
                                <X className="w-4 h-4 mr-1.5" /> Reject
                            </Button>
                            <Button onClick={() => handleApprove(active)} className="h-10 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white text-[13px]" style={{ boxShadow: "0 4px 12px #10b98133" }}>
                                <Check className="w-4 h-4 mr-1.5" /> Approve
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PriorityChip({ priority }: { priority: string }) {
    const tone = PRIORITY_TONE[priority] ?? PRIORITY_TONE.Low
    return (
        <span className={cn("inline-flex items-center px-1.5 py-0.5 rounded-none border text-[11px] font-semibold", tone.bg, tone.text, tone.border)}>
            {priority}
        </span>
    )
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
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

function DetailCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div>
            <div className="text-[11px] uppercase tracking-wide font-semibold text-[#94A3B8] inline-flex items-center gap-1">
                {icon} {label}
            </div>
            <div className="mt-1 text-[13px] text-[#0F172A] font-medium">{value}</div>
        </div>
    )
}
