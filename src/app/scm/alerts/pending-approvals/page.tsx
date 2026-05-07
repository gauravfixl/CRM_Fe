"use client"

import * as React from "react"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
    GitBranch, Inbox, ClipboardCheck, ShoppingCart, Check, X, ArrowUpRight, AlertCircle, User, Calendar, Building2,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
    useScmProcurementExtraStore, type ScmPurchaseRequest,
} from "@/shared/data/scm/scm-procurement-extra-store"
import {
    useScmPurchaseOrdersStore, type ScmPurchaseOrder,
} from "@/shared/data/scm/scm-purchase-orders-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

type ApprovalKind = "PR" | "PO"
type Priority = "Low" | "Medium" | "High" | "Critical"

interface ApprovalItem {
    id: string
    kind: ApprovalKind
    reference: string
    title: string
    requestedBy: string
    department?: string
    dueDate: string
    amount?: number
    priority: Priority
    items?: { name: string; sku: string; qty: number; unitPrice?: number }[]
    raw: ScmPurchaseRequest | ScmPurchaseOrder
}

const PRIORITY_RANK: Record<Priority, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 }

const PRIORITY_TONE: Record<Priority, { color: string; bg: string }> = {
    Critical: { color: "#dc2626", bg: "#fef2f2" },
    High: { color: "#f59e0b", bg: "#fffbeb" },
    Medium: { color: "#3b82f6", bg: "#eff6ff" },
    Low: { color: "#64748b", bg: "#f1f5f9" },
}

export default function PendingApprovalsAlertsPage() {
    const { toast } = useToast()
    const purchaseRequests = useScmProcurementExtraStore((s) => s.purchaseRequests)
    const updatePR = useScmProcurementExtraStore((s) => s.updatePR)
    const purchaseOrders = useScmPurchaseOrdersStore((s) => s.purchaseOrders)
    const updatePO = useScmPurchaseOrdersStore((s) => s.updatePO)

    const [activeId, setActiveId] = useState<string | null>(null)
    const [resolved, setResolved] = useState<Set<string>>(new Set())
    const [filter, setFilter] = useState<"all" | "PR" | "PO">("all")

    const items: ApprovalItem[] = useMemo(() => {
        const fromPR: ApprovalItem[] = purchaseRequests
            .filter((p) => p.status === "Submitted")
            .map((p) => ({
                id: `pr_${p.id}`,
                kind: "PR",
                reference: p.requestNumber,
                title: `${p.quantity} × ${p.productName}`,
                requestedBy: p.requestedBy,
                department: p.department,
                dueDate: p.requiredDate,
                priority:
                    p.priority === "Urgent" ? "Critical" :
                    p.priority === "High" ? "High" :
                    p.priority === "Medium" ? "Medium" : "Low",
                items: [{ name: p.productName, sku: p.sku, qty: p.quantity }],
                raw: p,
            }))
        const fromPO: ApprovalItem[] = purchaseOrders
            .filter((p) => p.status === "Pending" || p.status === "Draft")
            .map((p) => ({
                id: `po_${p.id}`,
                kind: "PO",
                reference: p.poNumber,
                title: `${p.items.length} item(s) · ${p.vendorName}`,
                requestedBy: p.vendorName,
                dueDate: p.expectedDelivery,
                amount: p.totalAmount,
                priority: p.totalAmount >= 200000 ? "Critical" : p.totalAmount >= 100000 ? "High" : "Medium",
                items: p.items.map((it) => ({ name: it.productName, sku: it.sku, qty: it.quantity, unitPrice: it.unitPrice })),
                raw: p,
            }))
        return [...fromPR, ...fromPO].sort((a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority])
    }, [purchaseRequests, purchaseOrders])

    const filtered = useMemo(
        () => items.filter((i) => filter === "all" || i.kind === filter).filter((i) => !resolved.has(i.id)),
        [items, filter, resolved]
    )

    const active = filtered.find((i) => i.id === activeId) ?? filtered[0] ?? null

    const summary = {
        total: filtered.length,
        critical: filtered.filter((i) => i.priority === "Critical").length,
        prCount: filtered.filter((i) => i.kind === "PR").length,
        poValue: filtered.filter((i) => i.kind === "PO").reduce((s, i) => s + (i.amount ?? 0), 0),
    }

    const approve = (item: ApprovalItem) => {
        if (item.kind === "PR") updatePR((item.raw as ScmPurchaseRequest).id, { status: "Approved" })
        else updatePO((item.raw as ScmPurchaseOrder).id, { status: "Approved" })
        setResolved((prev) => new Set(prev).add(item.id))
        toast({ title: "Approved", description: item.reference })
    }
    const reject = (item: ApprovalItem) => {
        if (item.kind === "PR") updatePR((item.raw as ScmPurchaseRequest).id, { status: "Rejected" })
        else updatePO((item.raw as ScmPurchaseOrder).id, { status: "Rejected" })
        setResolved((prev) => new Set(prev).add(item.id))
        toast({ title: "Rejected", description: item.reference })
    }
    const escalate = (item: ApprovalItem) => {
        toast({ title: "Escalated", description: item.reference })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-[#f59e0b]" /> Pending Approval Alerts
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Triage inbox — review pending requests and orders one at a time, approve or reject directly.
                    </p>
                </div>
                <div className="flex items-center gap-1 border bg-white rounded-none">
                    <FilterTab label="All" count={items.filter((i) => !resolved.has(i.id)).length} active={filter === "all"} onClick={() => setFilter("all")} />
                    <FilterTab label="Requests" count={items.filter((i) => i.kind === "PR" && !resolved.has(i.id)).length} active={filter === "PR"} onClick={() => setFilter("PR")} />
                    <FilterTab label="Orders" count={items.filter((i) => i.kind === "PO" && !resolved.has(i.id)).length} active={filter === "PO"} onClick={() => setFilter("PO")} />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="In Queue" value={summary.total} accent="#f59e0b" icon={<Inbox className="w-4 h-4" />} />
                <Stat label="Critical Priority" value={summary.critical} accent="#dc2626" icon={<AlertCircle className="w-4 h-4" />} />
                <Stat label="Purchase Requests" value={summary.prCount} accent="#3b82f6" icon={<ClipboardCheck className="w-4 h-4" />} />
                <Stat label="PO Value Held" value={formatINR(summary.poValue)} accent="#10b981" icon={<ShoppingCart className="w-4 h-4" />} helper="awaiting approval" />
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-10 text-center">
                    <div className="w-12 h-12 rounded-none bg-emerald-50 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A] mt-3">Inbox zero</p>
                    <p className="text-[12.5px] text-[#64748B] mt-1">No items awaiting approval right now.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Inbox list */}
                    <div className="lg:col-span-5 border bg-white rounded-none shadow-sm flex flex-col max-h-[680px]">
                        <div className="px-4 py-2.5 border-b border-[#EEF1F6] flex items-center justify-between">
                            <p className="text-[12px] font-semibold text-[#0F172A]">Queue</p>
                            <span className="text-[11px] text-[#94A3B8] tabular-nums">{filtered.length} open</span>
                        </div>
                        <ul className="flex-1 overflow-y-auto divide-y divide-[#F1F5F9]">
                            {filtered.map((item) => {
                                const isActive = active?.id === item.id
                                const tone = PRIORITY_TONE[item.priority]
                                return (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => setActiveId(item.id)}
                                            className={cn(
                                                "w-full text-left px-4 py-3 transition-colors flex items-start gap-2.5",
                                                isActive ? "bg-amber-50/60" : "hover:bg-slate-50"
                                            )}
                                            style={isActive ? { borderLeft: `3px solid #f59e0b`, paddingLeft: "13px" } : { borderLeft: `3px solid transparent`, paddingLeft: "13px" }}
                                        >
                                            <span
                                                className="w-1.5 h-1.5 mt-2 shrink-0"
                                                style={{ background: tone.color }}
                                                title={item.priority}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-mono text-[11px] font-bold text-[#0F172A]">{item.reference}</span>
                                                    <span
                                                        className="text-[9.5px] font-bold uppercase tracking-wider px-1 py-0.5"
                                                        style={{ color: tone.color, background: tone.bg }}
                                                    >
                                                        {item.kind}
                                                    </span>
                                                </div>
                                                <p className="text-[12.5px] font-semibold text-[#0F172A] mt-0.5 truncate">{item.title}</p>
                                                <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                                                    {item.requestedBy} {item.department && `· ${item.department}`}
                                                </p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[10.5px] text-[#94A3B8] tabular-nums">Due {item.dueDate}</span>
                                                    {item.amount != null && (
                                                        <span className="text-[10.5px] font-bold tabular-nums text-emerald-700">{formatINR(item.amount)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    {/* Preview pane */}
                    <div className="lg:col-span-7 border bg-white rounded-none shadow-sm flex flex-col">
                        {active ? (
                            <>
                                <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div
                                            className="w-10 h-10 rounded-none flex items-center justify-center text-white shrink-0"
                                            style={{ background: active.kind === "PO" ? "#8b5cf6" : "#3b82f6" }}
                                        >
                                            {active.kind === "PO" ? <ShoppingCart className="w-4 h-4" /> : <ClipboardCheck className="w-4 h-4" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[15px] font-semibold text-[#0F172A]">{active.reference}</p>
                                            <p className="text-[12px] text-[#64748B] truncate">
                                                {active.kind === "PO" ? "Purchase Order" : "Purchase Request"} · {active.title}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className="inline-flex items-center px-2 py-0.5 rounded-none text-[10.5px] font-bold uppercase tracking-wider"
                                        style={{ color: PRIORITY_TONE[active.priority].color, background: PRIORITY_TONE[active.priority].bg }}
                                    >
                                        {active.priority} priority
                                    </span>
                                </div>

                                <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <DetailCell icon={<User className="w-3 h-3" />} label={active.kind === "PO" ? "Vendor" : "Requested by"} value={active.requestedBy} />
                                        {active.department && <DetailCell icon={<Building2 className="w-3 h-3" />} label="Department" value={active.department} />}
                                        <DetailCell icon={<Calendar className="w-3 h-3" />} label={active.kind === "PO" ? "Expected" : "Required by"} value={active.dueDate} />
                                        {active.amount != null && (
                                            <DetailCell icon={<ShoppingCart className="w-3 h-3" />} label="Total Amount" value={
                                                <span className="text-[14px] font-bold text-emerald-600 tabular-nums">{formatINR(active.amount)}</span>
                                            } />
                                        )}
                                    </div>

                                    {active.items && active.items.length > 0 && (
                                        <div className="border border-[#EEF1F6] rounded-none overflow-hidden">
                                            <table className="w-full text-[12px]">
                                                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-[#64748B]">
                                                    <tr>
                                                        <th className="text-left px-3 py-2 font-bold">Product</th>
                                                        <th className="text-right px-3 py-2 font-bold">Qty</th>
                                                        {active.items.some((i) => i.unitPrice != null) && <th className="text-right px-3 py-2 font-bold">Unit ₹</th>}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#F1F5F9]">
                                                    {active.items.map((it, i) => (
                                                        <tr key={i}>
                                                            <td className="px-3 py-2">
                                                                <p className="font-medium text-[#0F172A]">{it.name}</p>
                                                                <p className="text-[10.5px] text-[#94A3B8] font-mono">{it.sku}</p>
                                                            </td>
                                                            <td className="px-3 py-2 text-right tabular-nums">{it.qty}</td>
                                                            {active.items!.some((i) => i.unitPrice != null) && (
                                                                <td className="px-3 py-2 text-right tabular-nums">{it.unitPrice != null ? formatINR(it.unitPrice) : "—"}</td>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                <div className="px-5 py-3 border-t border-[#EEF1F6] bg-slate-50/40 flex items-center justify-between gap-2">
                                    <Button onClick={() => escalate(active)} variant="outline" size="sm" className="h-9 px-3 rounded-none text-[12px] border-[#E5E7EB]">
                                        <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Escalate
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <Button onClick={() => reject(active)} variant="outline" size="sm" className="h-9 px-3 rounded-none border-red-200 text-red-700 hover:bg-red-50 text-[12px]">
                                            <X className="w-3.5 h-3.5 mr-1" /> Reject
                                        </Button>
                                        <Button onClick={() => approve(active)} size="sm" className="h-9 px-3 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white text-[12px]" style={{ boxShadow: "0 4px 12px #10b98133" }}>
                                            <Check className="w-3.5 h-3.5 mr-1" /> Approve
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center p-8">
                                <p className="text-[12.5px] text-[#94A3B8]">Select an item from the queue.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

function FilterTab({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "px-3 h-9 text-[12px] font-medium border-r last:border-r-0 inline-flex items-center gap-1.5 transition-colors",
                active ? "bg-amber-50 text-amber-700" : "text-[#64748B] hover:bg-slate-50"
            )}
        >
            {label}
            <span className={cn("text-[10.5px] font-bold tabular-nums px-1 py-0.5", active ? "bg-amber-100" : "bg-slate-100")}>{count}</span>
        </button>
    )
}

function DetailCell({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div>
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-[#94A3B8] inline-flex items-center gap-1">
                {icon} {label}
            </div>
            <div className="mt-0.5 text-[13px] font-medium text-[#0F172A]">{value}</div>
        </div>
    )
}

function Stat({ label, value, icon, accent, helper }: { label: string; value: string | number; icon: React.ReactNode; accent: string; helper?: string }) {
    return (
        <div
            className="border shadow-sm p-4 rounded-none"
            style={{ background: `linear-gradient(135deg, ${accent}14 0%, ${accent}06 45%, #ffffff 100%)`, borderColor: `${accent}33` }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[#64748B] truncate">{label}</p>
                    <p className="mt-1.5 text-[20px] font-bold tabular-nums leading-tight truncate" style={{ color: accent }}>{value}</p>
                    {helper && <p className="text-[11px] text-[#94A3B8] mt-1">{helper}</p>}
                </div>
                <div className="w-9 h-9 rounded-none flex items-center justify-center text-white shrink-0" style={{ background: accent, boxShadow: `0 4px 12px ${accent}33` }}>
                    {icon}
                </div>
            </div>
        </div>
    )
}
