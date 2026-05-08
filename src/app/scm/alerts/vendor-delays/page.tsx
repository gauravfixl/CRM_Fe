"use client"

import * as React from "react"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
    Users, AlertOctagon, Clock, TrendingDown, ExternalLink, Check, BellOff, Award,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    useScmPurchaseOrdersStore, type ScmPurchaseOrder,
} from "@/shared/data/scm/scm-purchase-orders-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

const TODAY = new Date().setHours(0, 0, 0, 0)
const TODAY_ISO = new Date().toISOString().slice(0, 10)

const daysOverdue = (expected: string) => {
    const exp = new Date(expected).setHours(0, 0, 0, 0)
    return Math.max(0, Math.round((TODAY - exp) / (1000 * 60 * 60 * 24)))
}

interface VendorRisk {
    vendorName: string
    delayedPOs: ScmPurchaseOrder[]
    totalDelays: number
    maxDays: number
    avgDays: number
    valueAtRisk: number
    riskScore: number // 0–100
}

const riskTier = (score: number) => {
    if (score >= 75) return { label: "Critical", color: "#dc2626", bg: "#fef2f2" }
    if (score >= 50) return { label: "High", color: "#ef4444", bg: "#fef2f2" }
    if (score >= 25) return { label: "Moderate", color: "#f59e0b", bg: "#fffbeb" }
    return { label: "Low", color: "#3b82f6", bg: "#eff6ff" }
}

export default function VendorDelayAlertsPage() {
    const { toast } = useToast()
    const pos = useScmPurchaseOrdersStore((s) => s.purchaseOrders)
    const [resolved, setResolved] = useState<Set<string>>(new Set())
    const [dismissed, setDismissed] = useState<Set<string>>(new Set())
    const [activeVendor, setActiveVendor] = useState<string | null>(null)

    const vendorRisks: VendorRisk[] = useMemo(() => {
        const delayedPOs = pos.filter(
            (p) =>
                !dismissed.has(p.id) &&
                (p.deliveryStatus === "Delayed" ||
                    (p.deliveryStatus !== "Delivered" && p.expectedDelivery < TODAY_ISO))
        )

        const groups = new Map<string, ScmPurchaseOrder[]>()
        for (const p of delayedPOs) {
            const list = groups.get(p.vendorName) ?? []
            list.push(p)
            groups.set(p.vendorName, list)
        }

        const out: VendorRisk[] = []
        for (const [vendor, list] of groups.entries()) {
            const days = list.map((p) => daysOverdue(p.expectedDelivery))
            const maxDays = days.reduce((m, n) => Math.max(m, n), 0)
            const avgDays = Math.round(days.reduce((s, n) => s + n, 0) / days.length)
            const valueAtRisk = list.reduce((s, p) => s + p.totalAmount, 0)
            // Risk score: weighted blend of count, max-days, value
            const countScore = Math.min(40, list.length * 10)
            const daysScore = Math.min(40, maxDays * 4)
            const valueScore = Math.min(20, valueAtRisk / 10000)
            const riskScore = Math.round(countScore + daysScore + valueScore)
            out.push({
                vendorName: vendor,
                delayedPOs: list.sort((a, b) => daysOverdue(b.expectedDelivery) - daysOverdue(a.expectedDelivery)),
                totalDelays: list.length,
                maxDays,
                avgDays,
                valueAtRisk,
                riskScore,
            })
        }
        return out.sort((a, b) => b.riskScore - a.riskScore)
    }, [pos, dismissed])

    const summary = {
        vendorCount: vendorRisks.length,
        critical: vendorRisks.filter((v) => v.riskScore >= 75).length,
        totalValue: vendorRisks.reduce((s, v) => s + v.valueAtRisk, 0),
        worstVendor: vendorRisks[0]?.vendorName ?? "—",
    }

    const handleDismissVendor = (v: VendorRisk) => {
        setDismissed((prev) => {
            const next = new Set(prev)
            v.delayedPOs.forEach((p) => next.add(p.id))
            return next
        })
        toast({ title: "Vendor alerts dismissed", description: v.vendorName })
    }

    const handleResolveVendor = (v: VendorRisk) => {
        setResolved((prev) => {
            const next = new Set(prev)
            v.delayedPOs.forEach((p) => next.add(p.id))
            return next
        })
        toast({ title: "Marked as actioned", description: v.vendorName })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#8b5cf6]" /> Vendor Delay Alerts
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Vendor risk heatmap — vendors ranked by delay volume, severity and value at risk.
                    </p>
                </div>
                <Link href="/scm/vendors/ratings">
                    <Button variant="outline" className="h-9 px-3 rounded-none border-[#E5E7EB] text-[13px]">
                        <Award className="w-4 h-4 mr-1.5" /> Vendor Scorecard
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Affected Vendors" value={summary.vendorCount} accent="#8b5cf6" icon={<Users className="w-4 h-4" />} />
                <Stat label="Critical Risk" value={summary.critical} accent="#dc2626" icon={<AlertOctagon className="w-4 h-4" />} helper="score ≥ 75" />
                <Stat label="Value at Risk" value={formatINR(summary.totalValue)} accent="#ef4444" icon={<TrendingDown className="w-4 h-4" />} />
                <Stat label="Worst Performer" value={summary.worstVendor} accent="#f59e0b" icon={<Award className="w-4 h-4" />} helper={vendorRisks[0] ? `${vendorRisks[0].totalDelays} delayed POs` : ""} />
            </div>

            {vendorRisks.length === 0 ? (
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-10 text-center">
                    <div className="w-12 h-12 rounded-none bg-emerald-50 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A] mt-3">No vendor delays</p>
                    <p className="text-[12.5px] text-[#64748B] mt-1">All vendors are delivering on schedule.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {vendorRisks.map((v) => {
                        const tier = riskTier(v.riskScore)
                        const isActioned = v.delayedPOs.every((p) => resolved.has(p.id))
                        const isExpanded = activeVendor === v.vendorName
                        return (
                            <div
                                key={v.vendorName}
                                className={`bg-white rounded-none border shadow-sm transition-all ${isActioned ? "opacity-50" : "hover:shadow-md"}`}
                                style={{ borderLeftWidth: 4, borderLeftColor: tier.color }}
                            >
                                <div className="px-4 py-3 border-b border-[#EEF1F6]">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[13px] font-semibold text-[#0F172A] truncate">{v.vendorName}</p>
                                            <p className="text-[11px] text-[#94A3B8] mt-0.5">
                                                {v.totalDelays} delayed PO{v.totalDelays !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                        <div
                                            className="px-2 py-0.5 rounded-none text-[10.5px] font-bold uppercase tracking-wider shrink-0"
                                            style={{ color: tier.color, background: tier.bg }}
                                        >
                                            {tier.label}
                                        </div>
                                    </div>

                                    {/* Risk score bar */}
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#94A3B8]">Risk Score</span>
                                            <span className="text-[12px] font-bold tabular-nums" style={{ color: tier.color }}>{v.riskScore}/100</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 overflow-hidden">
                                            <div className="h-full transition-all" style={{ width: `${v.riskScore}%`, background: tier.color }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4 py-3 grid grid-cols-3 gap-2 text-[11px]">
                                    <Metric label="Max Late" value={`${v.maxDays}d`} color={tier.color} />
                                    <Metric label="Avg Late" value={`${v.avgDays}d`} />
                                    <Metric label="At Risk" value={formatINR(v.valueAtRisk)} />
                                </div>

                                {/* Per-PO heatmap squares */}
                                <div className="px-4 pb-3">
                                    <p className="text-[10px] uppercase tracking-wider font-semibold text-[#94A3B8] mb-1.5">Affected POs ({v.totalDelays})</p>
                                    <div className="flex flex-wrap gap-1">
                                        {v.delayedPOs.slice(0, isExpanded ? undefined : 12).map((p) => {
                                            const days = daysOverdue(p.expectedDelivery)
                                            const intensity = Math.min(1, days / 14)
                                            return (
                                                <span
                                                    key={p.id}
                                                    title={`${p.poNumber} · ${days}d late · ${formatINR(p.totalAmount)}`}
                                                    className="w-5 h-5 inline-flex items-center justify-center text-[8px] font-bold text-white tabular-nums"
                                                    style={{ background: tier.color, opacity: 0.4 + intensity * 0.6 }}
                                                >
                                                    {days}
                                                </span>
                                            )
                                        })}
                                        {!isExpanded && v.delayedPOs.length > 12 && (
                                            <button
                                                onClick={() => setActiveVendor(v.vendorName)}
                                                className="px-1.5 h-5 text-[10px] font-bold border border-slate-300 hover:bg-slate-50"
                                            >
                                                +{v.delayedPOs.length - 12}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-[#EEF1F6] max-h-[200px] overflow-y-auto">
                                        <ul className="divide-y divide-[#F1F5F9] text-[11.5px]">
                                            {v.delayedPOs.map((p) => (
                                                <li key={p.id} className="px-4 py-2 flex items-center justify-between gap-2 hover:bg-slate-50">
                                                    <div className="min-w-0">
                                                        <p className="font-mono text-[11px] font-bold text-[#0F172A]">{p.poNumber}</p>
                                                        <p className="text-[10.5px] text-[#94A3B8]">Expected {p.expectedDelivery}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="font-bold tabular-nums" style={{ color: tier.color }}>{daysOverdue(p.expectedDelivery)}d late</p>
                                                        <p className="text-[10px] tabular-nums text-[#64748B]">{formatINR(p.totalAmount)}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="px-4 py-2.5 border-t border-[#EEF1F6] bg-slate-50/40 flex items-center justify-between gap-1">
                                    <button
                                        onClick={() => setActiveVendor(isExpanded ? null : v.vendorName)}
                                        className="text-[11px] font-semibold text-violet-700 hover:underline"
                                    >
                                        {isExpanded ? "Collapse" : `Show all ${v.totalDelays}`}
                                    </button>
                                    <div className="flex items-center gap-1">
                                        <Link href={`/scm/procurement/purchase-orders?vendor=${encodeURIComponent(v.vendorName)}`}>
                                            <Button size="sm" variant="ghost" className="h-7 px-2 rounded-none text-[11px] text-[#64748B] hover:bg-slate-100" title="Open POs">
                                                <ExternalLink className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                        {!isActioned && (
                                            <Button onClick={() => handleResolveVendor(v)} size="sm" variant="ghost" className="h-7 px-2 rounded-none text-emerald-700 hover:bg-emerald-50" title="Mark actioned">
                                                <Check className="w-3 h-3" />
                                            </Button>
                                        )}
                                        <Button onClick={() => handleDismissVendor(v)} size="sm" variant="ghost" className="h-7 px-2 rounded-none text-[#64748B] hover:bg-slate-100" title="Dismiss">
                                            <BellOff className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function Metric({ label, value, color }: { label: string; value: string; color?: string }) {
    return (
        <div>
            <p className="text-[9.5px] uppercase tracking-wider font-semibold text-[#94A3B8]">{label}</p>
            <p className="text-[12px] font-bold tabular-nums mt-0.5" style={{ color: color ?? "#0F172A" }}>{value}</p>
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
