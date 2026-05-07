"use client"

import * as React from "react"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
    CreditCard, Wallet, AlertOctagon, Receipt, Check, BellOff, ExternalLink, TrendingUp,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmVendorExtraStore } from "@/shared/data/scm/scm-vendor-extra-store"
import { useScmPurchaseOrdersStore } from "@/shared/data/scm/scm-purchase-orders-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

const TODAY = new Date().setHours(0, 0, 0, 0)

const daysOverdue = (iso: string) => {
    const t = new Date(iso).setHours(0, 0, 0, 0)
    return Math.max(0, Math.round((TODAY - t) / (1000 * 60 * 60 * 24)))
}

type Bucket = "current" | "1_30" | "31_60" | "61_90" | "90_plus"

const BUCKET_META: Record<Bucket, { label: string; window: string; color: string }> = {
    current: { label: "Current", window: "Not yet due", color: "#10b981" },
    "1_30": { label: "1–30 days", window: "Recently overdue", color: "#3b82f6" },
    "31_60": { label: "31–60 days", window: "Concerning", color: "#f59e0b" },
    "61_90": { label: "61–90 days", window: "Severe", color: "#ef4444" },
    "90_plus": { label: "90+ days", window: "Critical", color: "#dc2626" },
}

const BUCKETS: Bucket[] = ["current", "1_30", "31_60", "61_90", "90_plus"]

const bucketOf = (days: number): Bucket => {
    if (days <= 0) return "current"
    if (days <= 30) return "1_30"
    if (days <= 60) return "31_60"
    if (days <= 90) return "61_90"
    return "90_plus"
}

interface PaymentItem {
    id: string
    source: "Payment" | "PO"
    reference: string
    vendorName: string
    invoiceOrPO: string
    amount: number
    dueDate: string
    daysOverdue: number
    status: string
}

export default function PaymentReminderAlertsPage() {
    const { toast } = useToast()
    const payments = useScmVendorExtraStore((s) => s.payments)
    const pos = useScmPurchaseOrdersStore((s) => s.purchaseOrders)
    const [resolved, setResolved] = useState<Set<string>>(new Set())
    const [dismissed, setDismissed] = useState<Set<string>>(new Set())
    const [activeBucket, setActiveBucket] = useState<Bucket | "all">("all")

    const items: PaymentItem[] = useMemo(() => {
        const fromPayments: PaymentItem[] = payments
            .filter((p) => p.paymentStatus === "Pending" || p.paymentStatus === "Failed")
            .filter((p) => !dismissed.has(`pay_${p.id}`))
            .map((p) => ({
                id: `pay_${p.id}`,
                source: "Payment",
                reference: p.paymentId,
                vendorName: p.vendorName,
                invoiceOrPO: p.invoiceNumber,
                amount: p.amount,
                dueDate: p.paymentDate,
                daysOverdue: daysOverdue(p.paymentDate),
                status: p.paymentStatus,
            }))
        const fromPOs: PaymentItem[] = pos
            .filter((p) => p.paymentStatus === "Unpaid" && p.deliveryStatus === "Delivered")
            .filter((p) => !dismissed.has(`po_${p.id}`))
            .map((p) => ({
                id: `po_${p.id}`,
                source: "PO",
                reference: p.poNumber,
                vendorName: p.vendorName,
                invoiceOrPO: p.poNumber,
                amount: p.totalAmount,
                dueDate: p.expectedDelivery,
                daysOverdue: daysOverdue(p.expectedDelivery),
                status: p.paymentTerms,
            }))
        return [...fromPayments, ...fromPOs].sort((a, b) => b.daysOverdue - a.daysOverdue)
    }, [payments, pos, dismissed])

    const buckets = useMemo(() => {
        const out: Record<Bucket, PaymentItem[]> = { current: [], "1_30": [], "31_60": [], "61_90": [], "90_plus": [] }
        for (const i of items) out[bucketOf(i.daysOverdue)].push(i)
        return out
    }, [items])

    const totals = useMemo(() => {
        const out: Record<Bucket, number> = { current: 0, "1_30": 0, "31_60": 0, "61_90": 0, "90_plus": 0 }
        for (const b of BUCKETS) out[b] = buckets[b].reduce((s, i) => s + i.amount, 0)
        return out
    }, [buckets])

    const grandTotal = items.reduce((s, i) => s + i.amount, 0)
    const overdueOnly = items.filter((i) => i.daysOverdue > 0)
    const overdueValue = overdueOnly.reduce((s, i) => s + i.amount, 0)
    const maxBucketValue = Math.max(...BUCKETS.map((b) => totals[b]))

    const visibleItems = activeBucket === "all" ? items : buckets[activeBucket]

    const handleResolve = (i: PaymentItem) => {
        setResolved((prev) => new Set(prev).add(i.id))
        toast({ title: "Marked paid", description: i.reference })
    }
    const handleDismiss = (i: PaymentItem) => {
        setDismissed((prev) => new Set(prev).add(i.id))
        toast({ title: "Reminder dismissed", description: i.reference })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#10b981]" /> Payment Reminder Alerts
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Accounts payable aging report — outstanding obligations bucketed by overdue duration.
                    </p>
                </div>
                <Link href="/scm/vendors/payment-history">
                    <Button className="h-9 px-3 rounded-none text-white text-[13px]" style={{ backgroundColor: "#10b981", boxShadow: "0 4px 12px #10b98133" }}>
                        <Wallet className="w-4 h-4 mr-1.5" /> Payment History
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Total Outstanding" value={formatINR(grandTotal)} accent="#10b981" icon={<Wallet className="w-4 h-4" />} helper={`${items.length} obligation${items.length !== 1 ? "s" : ""}`} />
                <Stat label="Overdue Value" value={formatINR(overdueValue)} accent="#ef4444" icon={<AlertOctagon className="w-4 h-4" />} helper={`${overdueOnly.length} past due`} />
                <Stat label="90+ Days Critical" value={buckets["90_plus"].length} accent="#dc2626" icon={<AlertOctagon className="w-4 h-4" />} helper={formatINR(totals["90_plus"])} />
                <Stat label="DPO (avg)" value={items.length === 0 ? 0 : Math.round(items.reduce((s, i) => s + i.daysOverdue, 0) / items.length)} accent="#f59e0b" icon={<TrendingUp className="w-4 h-4" />} helper="days payable outstanding" />
            </div>

            {items.length === 0 ? (
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-10 text-center">
                    <div className="w-12 h-12 rounded-none bg-emerald-50 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A] mt-3">All vendors settled</p>
                    <p className="text-[12.5px] text-[#64748B] mt-1">No outstanding payments at the moment.</p>
                </div>
            ) : (
                <>
                    {/* Aging chart */}
                    <div className="border bg-white shadow-sm rounded-none">
                        <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                            <span className="w-1 h-9 bg-emerald-500 shrink-0" />
                            <div>
                                <h3 className="text-[14px] font-semibold text-[#0F172A]">AR Aging Buckets</h3>
                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Click a bucket to filter the detail table below</p>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-5 gap-3">
                                {BUCKETS.map((b) => {
                                    const meta = BUCKET_META[b]
                                    const value = totals[b]
                                    const count = buckets[b].length
                                    const heightPct = maxBucketValue === 0 ? 0 : (value / maxBucketValue) * 100
                                    const isActive = activeBucket === b
                                    return (
                                        <button
                                            key={b}
                                            onClick={() => setActiveBucket(isActive ? "all" : b)}
                                            className={`text-left transition-all ${isActive ? "ring-2" : ""}`}
                                            style={{ "--tw-ring-color": meta.color } as React.CSSProperties}
                                        >
                                            <div className="flex items-end h-32 mb-2">
                                                <div
                                                    className="w-full transition-all relative"
                                                    style={{
                                                        height: `${Math.max(heightPct, 2)}%`,
                                                        background: meta.color,
                                                        opacity: count === 0 ? 0.15 : 0.85,
                                                    }}
                                                >
                                                    {count > 0 && (
                                                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10.5px] font-bold tabular-nums whitespace-nowrap" style={{ color: meta.color }}>
                                                            {formatINR(value)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="border-t-2 pt-2" style={{ borderColor: meta.color }}>
                                                <p className="text-[11.5px] font-bold text-[#0F172A]">{meta.label}</p>
                                                <p className="text-[10px] text-[#94A3B8]">{meta.window}</p>
                                                <p className="text-[12px] font-bold tabular-nums mt-1" style={{ color: meta.color }}>
                                                    {count} <span className="text-[10px] font-medium text-[#64748B]">item{count !== 1 ? "s" : ""}</span>
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Detail table */}
                    <div className="border bg-white rounded-none shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-[#EEF1F6] flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-start gap-2 min-w-0">
                                <span className="w-1 h-9 shrink-0" style={{ background: activeBucket === "all" ? "#0F172A" : BUCKET_META[activeBucket].color }} />
                                <div className="min-w-0">
                                    <h3 className="text-[14px] font-semibold text-[#0F172A]">
                                        {activeBucket === "all" ? "All Outstanding Obligations" : `${BUCKET_META[activeBucket].label} Obligations`}
                                    </h3>
                                    <p className="text-[11.5px] text-[#94A3B8] mt-0.5">
                                        {visibleItems.length} record{visibleItems.length !== 1 ? "s" : ""} · {formatINR(visibleItems.reduce((s, i) => s + i.amount, 0))}
                                    </p>
                                </div>
                            </div>
                            {activeBucket !== "all" && (
                                <Button onClick={() => setActiveBucket("all")} variant="outline" size="sm" className="h-8 px-2 rounded-none text-[11.5px] border-[#E5E7EB]">
                                    Clear filter
                                </Button>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-[12.5px]">
                                <thead className="bg-slate-50 border-b border-[#EEF1F6] text-[10.5px] font-bold uppercase tracking-wider text-[#64748B]">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left w-[100px]">Type</th>
                                        <th className="px-4 py-2.5 text-left">Reference</th>
                                        <th className="px-4 py-2.5 text-left">Vendor</th>
                                        <th className="px-4 py-2.5 text-left">Invoice / PO</th>
                                        <th className="px-4 py-2.5 text-left w-[110px]">Due Date</th>
                                        <th className="px-4 py-2.5 text-right w-[120px]">Amount</th>
                                        <th className="px-4 py-2.5 text-right w-[100px]">Aging</th>
                                        <th className="px-4 py-2.5 text-right w-[120px]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F5F9]">
                                    {visibleItems.map((i) => {
                                        const meta = BUCKET_META[bucketOf(i.daysOverdue)]
                                        const isResolved = resolved.has(i.id)
                                        return (
                                            <tr key={i.id} className={isResolved ? "opacity-50" : "hover:bg-slate-50/60"}>
                                                <td className="px-4 py-2.5">
                                                    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded-none ${i.source === "PO" ? "bg-violet-50 text-violet-700 border border-violet-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                                                        {i.source}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 font-mono text-[11.5px] font-bold text-[#0F172A]">{i.reference}</td>
                                                <td className="px-4 py-2.5 text-[#0F172A]">{i.vendorName}</td>
                                                <td className="px-4 py-2.5 font-mono text-[11.5px] text-[#64748B]">{i.invoiceOrPO}</td>
                                                <td className="px-4 py-2.5 tabular-nums text-[#64748B]">{i.dueDate}</td>
                                                <td className="px-4 py-2.5 text-right tabular-nums font-bold text-[#0F172A]">{formatINR(i.amount)}</td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <span
                                                        className="inline-flex items-center px-1.5 py-0.5 rounded-none text-[10.5px] font-bold tabular-nums"
                                                        style={{ color: meta.color, background: `${meta.color}1a` }}
                                                    >
                                                        {i.daysOverdue === 0 ? "Current" : `${i.daysOverdue}d`}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-right">
                                                    <div className="inline-flex items-center gap-0.5">
                                                        <Link href={i.source === "PO" ? "/scm/procurement/purchase-orders" : "/scm/vendors/payment-history"}>
                                                            <Button size="sm" variant="ghost" className="h-7 px-1.5 rounded-none text-[#64748B]" title="Open">
                                                                <ExternalLink className="w-3 h-3" />
                                                            </Button>
                                                        </Link>
                                                        {!isResolved && (
                                                            <Button onClick={() => handleResolve(i)} size="sm" variant="ghost" className="h-7 px-1.5 rounded-none text-emerald-700 hover:bg-emerald-50" title="Mark paid">
                                                                <Check className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                        <Button onClick={() => handleDismiss(i)} size="sm" variant="ghost" className="h-7 px-1.5 rounded-none text-[#64748B] hover:bg-slate-100" title="Dismiss">
                                                            <BellOff className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                <tfoot className="bg-slate-50 border-t-2 border-slate-200 text-[12px] font-bold">
                                    <tr>
                                        <td colSpan={5} className="px-4 py-2.5 text-right uppercase tracking-wider text-[#64748B] text-[10.5px]">Total</td>
                                        <td className="px-4 py-2.5 text-right tabular-nums text-[#0F172A]">{formatINR(visibleItems.reduce((s, i) => s + i.amount, 0))}</td>
                                        <td colSpan={2}></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </>
            )}
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
                    {helper && <p className="text-[11px] text-[#94A3B8] mt-1 truncate">{helper}</p>}
                </div>
                <div className="w-9 h-9 rounded-none flex items-center justify-center text-white shrink-0" style={{ background: accent, boxShadow: `0 4px 12px ${accent}33` }}>
                    {icon}
                </div>
            </div>
        </div>
    )
}
