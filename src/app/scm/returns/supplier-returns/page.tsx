"use client"

import * as React from "react"
import { useMemo } from "react"
import Link from "next/link"
import {
    Building2, Download, Receipt, Repeat, Wallet, AlertTriangle, ExternalLink, FileText,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import {
    useScmProcurementExtraStore,
    type ScmPurchaseReturn,
} from "@/shared/data/scm/scm-procurement-extra-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

interface VendorSummary {
    vendorName: string
    totalReturns: number
    totalQty: number
    refundCount: number
    replacementCount: number
    creditNoteCount: number
    pendingCount: number
    settledCount: number
    lastReturnDate: string
    estValue: number
    rows: ScmPurchaseReturn[]
}

const PURCHASE_PRICE_FALLBACK = 250 // illustrative per-unit value if PO not joined

export default function SupplierReturnsPage() {
    const { toast } = useToast()
    const purchaseReturns = useScmProcurementExtraStore((s) => s.purchaseReturns)

    const vendors: VendorSummary[] = useMemo(() => {
        const groups = new Map<string, VendorSummary>()
        for (const r of purchaseReturns) {
            const key = r.vendorName
            const existing = groups.get(key) ?? {
                vendorName: key, totalReturns: 0, totalQty: 0,
                refundCount: 0, replacementCount: 0, creditNoteCount: 0,
                pendingCount: 0, settledCount: 0,
                lastReturnDate: "", estValue: 0, rows: [],
            }
            existing.totalReturns += 1
            existing.totalQty += r.quantityReturned
            existing.estValue += r.quantityReturned * PURCHASE_PRICE_FALLBACK
            if (r.refundType === "Refund") existing.refundCount += 1
            if (r.refundType === "Replacement") existing.replacementCount += 1
            if (r.refundType === "Credit Note") existing.creditNoteCount += 1
            if (r.status === "Pending" || r.status === "Approved") existing.pendingCount += 1
            if (r.status === "Refunded" || r.status === "Replaced") existing.settledCount += 1
            if (!existing.lastReturnDate || r.returnDate > existing.lastReturnDate) {
                existing.lastReturnDate = r.returnDate
            }
            existing.rows.push(r)
            groups.set(key, existing)
        }
        return Array.from(groups.values()).sort((a, b) => b.totalReturns - a.totalReturns)
    }, [purchaseReturns])

    const kpis = useMemo(() => {
        const totalValue = purchaseReturns.reduce((s, r) => s + r.quantityReturned * PURCHASE_PRICE_FALLBACK, 0)
        const pending = purchaseReturns.filter((r) => r.status === "Pending" || r.status === "Approved").length
        const refundType = purchaseReturns.reduce(
            (acc, r) => {
                if (r.refundType === "Refund") acc.refund += 1
                if (r.refundType === "Replacement") acc.replacement += 1
                if (r.refundType === "Credit Note") acc.creditNote += 1
                return acc
            },
            { refund: 0, replacement: 0, creditNote: 0 }
        )
        return {
            totalValue,
            vendorCount: vendors.length,
            pending,
            refundType,
        }
    }, [purchaseReturns, vendors])

    const handleExport = () => {
        if (vendors.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Vendor", "Total Returns", "Total Qty", "Refunds", "Replacements", "Credit Notes", "Pending", "Settled", "Estimated Value", "Last Return"]
        const rows = vendors.map((v) => [v.vendorName, v.totalReturns, v.totalQty, v.refundCount, v.replacementCount, v.creditNoteCount, v.pendingCount, v.settledCount, v.estValue, v.lastReturnDate])
        const escape = (val: any) => { const s = String(val ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-supplier-returns-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} vendors exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#f97316]" /> Supplier Returns
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Vendor-side view of goods returned to suppliers — settlements, debit notes and quality scorecard.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-none border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Link href="/scm/procurement/purchase-returns">
                        <Button className="h-9 px-3 rounded-none text-white text-[13px]" style={{ backgroundColor: "#f97316", boxShadow: "0 4px 12px #f9731633" }}>
                            <FileText className="w-4 h-4 mr-1.5" /> Manage Records
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Total Return Value" value={formatINR(kpis.totalValue)} icon={<Wallet className="w-4 h-4" />} accent="#f97316" helper={`across ${purchaseReturns.length} returns`} />
                <Stat label="Vendors with Returns" value={kpis.vendorCount} icon={<Building2 className="w-4 h-4" />} accent="#2563eb" />
                <Stat label="Pending Settlement" value={kpis.pending} icon={<AlertTriangle className="w-4 h-4" />} accent="#ef4444" helper={kpis.pending === 0 ? "all settled" : "awaiting action"} />
                <Stat label="Refund / Replace / Credit" value={`${kpis.refundType.refund} · ${kpis.refundType.replacement} · ${kpis.refundType.creditNote}`} icon={<Repeat className="w-4 h-4" />} accent="#10b981" helper="settlement mode mix" />
            </div>

            {/* Vendor scorecard */}
            <div className="border bg-white shadow-sm rounded-none">
                <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-center justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                        <span className="w-1 h-9 bg-orange-500 shrink-0" />
                        <div className="min-w-0">
                            <h3 className="text-[14px] font-semibold text-[#0F172A] truncate">Vendor Scorecard</h3>
                            <p className="text-[11.5px] text-[#94A3B8] mt-0.5 truncate">Aggregated returns per supplier — drill in to see line items</p>
                        </div>
                    </div>
                    <span className="text-[11.5px] text-[#64748B] shrink-0 tabular-nums">{vendors.length} vendor{vendors.length !== 1 ? "s" : ""}</span>
                </div>

                {vendors.length === 0 ? (
                    <div className="p-10 text-center">
                        <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-[13px] font-semibold text-[#0F172A]">No supplier returns yet</p>
                        <p className="text-[12px] text-[#64748B] mt-1">
                            Returns recorded under Procurement → Purchase Returns will appear here grouped by vendor.
                        </p>
                        <Link href="/scm/procurement/purchase-returns" className="inline-flex items-center gap-1 text-[12px] font-semibold text-orange-700 hover:underline mt-3">
                            Create a return <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-[12.5px]">
                            <thead className="bg-slate-50 border-b border-[#EEF1F6] text-[10.5px] font-bold uppercase tracking-wider text-[#64748B]">
                                <tr>
                                    <th className="px-4 py-2.5 text-left">Vendor</th>
                                    <th className="px-4 py-2.5 text-right">Returns</th>
                                    <th className="px-4 py-2.5 text-right">Qty</th>
                                    <th className="px-4 py-2.5 text-left">Settlement Mix</th>
                                    <th className="px-4 py-2.5 text-right">Pending</th>
                                    <th className="px-4 py-2.5 text-right">Estimated Value</th>
                                    <th className="px-4 py-2.5 text-left">Last Return</th>
                                    <th className="px-4 py-2.5 text-right">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F1F5F9]">
                                {vendors.map((v) => {
                                    const totalSettlements = v.refundCount + v.replacementCount + v.creditNoteCount || 1
                                    const refundPct = (v.refundCount / totalSettlements) * 100
                                    const replacePct = (v.replacementCount / totalSettlements) * 100
                                    const creditPct = (v.creditNoteCount / totalSettlements) * 100
                                    return (
                                        <tr key={v.vendorName} className="hover:bg-slate-50/60">
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-[#0F172A]">{v.vendorName}</p>
                                                <p className="text-[10.5px] text-[#94A3B8] mt-0.5">{v.settledCount} settled · {v.pendingCount} pending</p>
                                            </td>
                                            <td className="px-4 py-3 text-right tabular-nums font-semibold">{v.totalReturns}</td>
                                            <td className="px-4 py-3 text-right tabular-nums text-red-600 font-semibold">{v.totalQty}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex h-2 w-32 overflow-hidden border border-slate-200">
                                                    <div className="bg-emerald-500" style={{ width: `${refundPct}%` }} title={`Refund ${v.refundCount}`} />
                                                    <div className="bg-blue-500" style={{ width: `${replacePct}%` }} title={`Replace ${v.replacementCount}`} />
                                                    <div className="bg-amber-500" style={{ width: `${creditPct}%` }} title={`Credit ${v.creditNoteCount}`} />
                                                </div>
                                                <div className="mt-1 flex items-center gap-2 text-[10px] text-[#64748B]">
                                                    <span><span className="inline-block w-2 h-2 bg-emerald-500 mr-1 align-middle" />R {v.refundCount}</span>
                                                    <span><span className="inline-block w-2 h-2 bg-blue-500 mr-1 align-middle" />Rp {v.replacementCount}</span>
                                                    <span><span className="inline-block w-2 h-2 bg-amber-500 mr-1 align-middle" />C {v.creditNoteCount}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {v.pendingCount > 0 ? (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-bold bg-red-50 text-red-700 border border-red-200 tabular-nums">
                                                        {v.pendingCount}
                                                    </span>
                                                ) : (
                                                    <span className="text-[#94A3B8] text-[11px]">—</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right tabular-nums font-semibold text-[#0F172A]">{formatINR(v.estValue)}</td>
                                            <td className="px-4 py-3 text-[#64748B] tabular-nums">{v.lastReturnDate}</td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={`/scm/procurement/purchase-returns?vendor=${encodeURIComponent(v.vendorName)}`}
                                                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-orange-700 hover:underline"
                                                >
                                                    Records <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Recent returns list (chronological) */}
            {purchaseReturns.length > 0 && (
                <div className="border bg-white shadow-sm rounded-none">
                    <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                        <span className="w-1 h-9 bg-slate-500 shrink-0" />
                        <div>
                            <h3 className="text-[14px] font-semibold text-[#0F172A]">Recent Activity</h3>
                            <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Latest 6 returns across all vendors</p>
                        </div>
                    </div>
                    <ul className="divide-y divide-[#F1F5F9]">
                        {[...purchaseReturns]
                            .sort((a, b) => b.returnDate.localeCompare(a.returnDate))
                            .slice(0, 6)
                            .map((r) => (
                                <li key={r.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[12.5px] font-semibold text-[#0F172A] inline-flex items-center gap-2">
                                            <span className="font-mono text-[11.5px] bg-slate-100 px-1.5 py-0.5">{r.returnNumber}</span>
                                            <span>·</span>
                                            <span className="truncate">{r.vendorName}</span>
                                        </p>
                                        <p className="text-[11.5px] text-[#64748B] mt-0.5 truncate">
                                            {r.productName} ({r.sku}) · qty {r.quantityReturned} · {r.reason}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <StatusBadge status={r.refundType} />
                                        <StatusBadge status={r.status} />
                                        <span className="text-[11px] text-[#94A3B8] tabular-nums w-20 text-right">{r.returnDate}</span>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

function Stat({
    label, value, icon, accent, helper,
}: {
    label: string
    value: string | number
    icon: React.ReactNode
    accent: string
    helper?: string
}) {
    return (
        <div
            className="border shadow-sm p-4 rounded-none"
            style={{
                background: `linear-gradient(135deg, ${accent}14 0%, ${accent}06 45%, #ffffff 100%)`,
                borderColor: `${accent}33`,
            }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-[#64748B] truncate">{label}</p>
                    <p className="mt-1.5 text-[20px] font-bold leading-tight tabular-nums truncate" style={{ color: accent }}>
                        {value}
                    </p>
                    {helper && <p className="text-[11px] text-[#94A3B8] mt-1 truncate">{helper}</p>}
                </div>
                <div
                    className="w-9 h-9 flex items-center justify-center shrink-0 text-white rounded-none"
                    style={{ background: accent, boxShadow: `0 4px 12px ${accent}33` }}
                >
                    {icon}
                </div>
            </div>
        </div>
    )
}
