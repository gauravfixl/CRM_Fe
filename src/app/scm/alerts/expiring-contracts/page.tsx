"use client"

import * as React from "react"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
    FileSignature, CalendarClock, AlertCircle, Check, BellOff, ExternalLink, RotateCcw, Clock,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    useScmVendorExtraStore, type ScmVendorContract,
} from "@/shared/data/scm/scm-vendor-extra-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

const TODAY = new Date().setHours(0, 0, 0, 0)

const daysUntil = (iso: string) => {
    const t = new Date(iso).setHours(0, 0, 0, 0)
    return Math.ceil((t - TODAY) / (1000 * 60 * 60 * 24))
}

type Bucket = "expired" | "critical" | "soon" | "later"

const BUCKET_META: Record<Bucket, { label: string; window: string; color: string }> = {
    expired: { label: "Expired", window: "past due", color: "#dc2626" },
    critical: { label: "Critical", window: "≤ 15 days", color: "#ef4444" },
    soon: { label: "Soon", window: "16–30 days", color: "#f59e0b" },
    later: { label: "Later", window: "31–60 days", color: "#3b82f6" },
}

const BUCKETS: Bucket[] = ["expired", "critical", "soon", "later"]

const bucketOf = (days: number): Bucket => {
    if (days < 0) return "expired"
    if (days <= 15) return "critical"
    if (days <= 30) return "soon"
    return "later"
}

export default function ExpiringContractsPage() {
    const { toast } = useToast()
    const contracts = useScmVendorExtraStore((s) => s.contracts)
    const [resolved, setResolved] = useState<Set<string>>(new Set())
    const [dismissed, setDismissed] = useState<Set<string>>(new Set())

    const tracked = useMemo(() => {
        return contracts
            .filter((c) => !dismissed.has(c.id))
            .filter((c) => {
                const days = daysUntil(c.contractEndDate)
                return c.status !== "Terminated" && days <= 60
            })
            .map((c) => ({ ...c, daysLeft: daysUntil(c.contractEndDate) }))
            .sort((a, b) => a.daysLeft - b.daysLeft)
    }, [contracts, dismissed])

    const grouped = useMemo(() => {
        const out: Record<Bucket, typeof tracked> = { expired: [], critical: [], soon: [], later: [] }
        for (const c of tracked) out[bucketOf(c.daysLeft)].push(c)
        return out
    }, [tracked])

    const summary = {
        total: tracked.length,
        expired: grouped.expired.length,
        critical: grouped.critical.length,
        valueAtRisk: tracked.reduce((s, c) => s + c.contractValue, 0),
    }

    // Timeline math: minimum -30 (already expired) to +60 days
    const TL_MIN = -30
    const TL_MAX = 60
    const tlSpan = TL_MAX - TL_MIN

    const handleResolve = (c: ScmVendorContract) => {
        setResolved((prev) => new Set(prev).add(c.id))
        toast({ title: "Marked actioned", description: c.contractNumber })
    }
    const handleDismiss = (c: ScmVendorContract) => {
        setDismissed((prev) => new Set(prev).add(c.id))
        toast({ title: "Alert dismissed", description: c.contractNumber })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <FileSignature className="w-5 h-5 text-[#f59e0b]" /> Expiring Contract Alerts
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Renewal timeline — vendor contracts plotted by expiry date for proactive renewal action.
                    </p>
                </div>
                <Link href="/scm/vendors/contracts">
                    <Button className="h-9 px-3 rounded-none text-white text-[13px]" style={{ backgroundColor: "#f59e0b", boxShadow: "0 4px 12px #f59e0b33" }}>
                        <RotateCcw className="w-4 h-4 mr-1.5" /> Manage Contracts
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Tracked Contracts" value={summary.total} accent="#f59e0b" icon={<FileSignature className="w-4 h-4" />} />
                <Stat label="Already Expired" value={summary.expired} accent="#dc2626" icon={<AlertCircle className="w-4 h-4" />} helper="action overdue" />
                <Stat label="Critical (≤15 days)" value={summary.critical} accent="#ef4444" icon={<Clock className="w-4 h-4" />} />
                <Stat label="Value at Risk" value={formatINR(summary.valueAtRisk)} accent="#8b5cf6" icon={<CalendarClock className="w-4 h-4" />} />
            </div>

            {tracked.length === 0 ? (
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-10 text-center">
                    <div className="w-12 h-12 rounded-none bg-emerald-50 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A] mt-3">All contracts safe</p>
                    <p className="text-[12.5px] text-[#64748B] mt-1">No contracts expiring within 60 days.</p>
                </div>
            ) : (
                <>
                    {/* Timeline visualization */}
                    <div className="border bg-white shadow-sm rounded-none">
                        <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                            <span className="w-1 h-9 bg-amber-500 shrink-0" />
                            <div>
                                <h3 className="text-[14px] font-semibold text-[#0F172A]">Renewal Timeline</h3>
                                <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Contracts laid out by expiry — past 30 days through next 60 days</p>
                            </div>
                        </div>
                        <div className="p-5">
                            {/* Axis */}
                            <div className="relative h-9 mb-2">
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-slate-300" />
                                {[-30, -15, 0, 15, 30, 45, 60].map((d) => {
                                    const pct = ((d - TL_MIN) / tlSpan) * 100
                                    const isToday = d === 0
                                    return (
                                        <div key={d} className="absolute top-0 -translate-x-1/2" style={{ left: `${pct}%` }}>
                                            <div
                                                className="w-px h-3 mx-auto"
                                                style={{ background: isToday ? "#0F172A" : "#cbd5e1" }}
                                            />
                                            <p
                                                className="text-[10px] mt-1 text-center tabular-nums whitespace-nowrap"
                                                style={{ color: isToday ? "#0F172A" : "#94A3B8", fontWeight: isToday ? 700 : 500 }}
                                            >
                                                {isToday ? "Today" : d > 0 ? `+${d}d` : `${d}d`}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Contract markers */}
                            <div className="relative min-h-[260px] border-l border-r border-slate-200 bg-gradient-to-r from-red-50/30 via-amber-50/30 to-blue-50/20">
                                {/* Today line */}
                                <div
                                    className="absolute top-0 bottom-0 w-0.5 bg-[#0F172A] z-10"
                                    style={{ left: `${((0 - TL_MIN) / tlSpan) * 100}%` }}
                                />

                                {tracked.map((c, idx) => {
                                    const days = c.daysLeft
                                    const clamped = Math.max(TL_MIN, Math.min(TL_MAX, days))
                                    const pct = ((clamped - TL_MIN) / tlSpan) * 100
                                    const meta = BUCKET_META[bucketOf(days)]
                                    const isResolved = resolved.has(c.id)
                                    const top = (idx % 6) * 38 + 10
                                    return (
                                        <div
                                            key={c.id}
                                            className={`absolute group ${isResolved ? "opacity-40" : ""}`}
                                            style={{ left: `${pct}%`, top }}
                                        >
                                            <Link href="/scm/vendors/contracts" className="block">
                                                <div
                                                    className="relative -translate-x-1/2 px-2 py-1 text-white text-[10.5px] font-semibold tabular-nums whitespace-nowrap shadow-sm hover:scale-105 transition-transform"
                                                    style={{ background: meta.color }}
                                                    title={`${c.vendorName} · ${c.contractNumber} · ${c.contractEndDate}`}
                                                >
                                                    {c.contractNumber}
                                                    <span className="ml-1 opacity-80">{days < 0 ? `${Math.abs(days)}d ago` : `${days}d`}</span>
                                                </div>
                                            </Link>
                                            {/* Tooltip preview */}
                                            <div className="absolute z-20 left-1/2 top-full mt-1 -translate-x-1/2 w-56 bg-white border border-slate-200 shadow-lg p-2.5 text-[11px] hidden group-hover:block">
                                                <p className="font-semibold text-[#0F172A]">{c.vendorName}</p>
                                                <p className="text-[10.5px] text-[#94A3B8] font-mono mt-0.5">{c.contractNumber}</p>
                                                <p className="text-[10.5px] text-[#64748B] mt-1">Ends: <span className="font-semibold tabular-nums">{c.contractEndDate}</span></p>
                                                <p className="text-[10.5px] text-[#64748B]">Value: <span className="font-semibold tabular-nums">{formatINR(c.contractValue)}</span></p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Legend */}
                            <div className="mt-4 flex items-center gap-3 flex-wrap text-[11px]">
                                {BUCKETS.map((b) => (
                                    <span key={b} className="inline-flex items-center gap-1.5">
                                        <span className="w-3 h-3" style={{ background: BUCKET_META[b].color }} />
                                        <span className="text-[#0F172A] font-semibold">{BUCKET_META[b].label}</span>
                                        <span className="text-[#94A3B8]">({BUCKET_META[b].window})</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bucketed details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {BUCKETS.map((b) => {
                            const meta = BUCKET_META[b]
                            const items = grouped[b]
                            return (
                                <div key={b} className="border bg-white rounded-none shadow-sm">
                                    <div className="px-3 py-2.5 border-b border-[#EEF1F6] flex items-center justify-between" style={{ borderBottomColor: `${meta.color}33` }}>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-2 h-2 shrink-0" style={{ background: meta.color }} />
                                            <p className="text-[12px] font-bold text-[#0F172A] truncate">{meta.label}</p>
                                            <span className="text-[10px] text-[#94A3B8]">({meta.window})</span>
                                        </div>
                                        <span
                                            className="text-[10.5px] font-bold tabular-nums px-1.5 py-0.5"
                                            style={{ background: `${meta.color}1a`, color: meta.color }}
                                        >
                                            {items.length}
                                        </span>
                                    </div>
                                    {items.length === 0 ? (
                                        <p className="text-[11px] text-[#94A3B8] text-center py-6">—</p>
                                    ) : (
                                        <ul className="divide-y divide-[#F1F5F9]">
                                            {items.map((c) => {
                                                const isResolved = resolved.has(c.id)
                                                return (
                                                    <li key={c.id} className={`px-3 py-2.5 ${isResolved ? "opacity-50" : "hover:bg-slate-50"}`}>
                                                        <div className="flex items-center justify-between gap-2 min-w-0">
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-[11.5px] font-semibold text-[#0F172A] truncate">{c.vendorName}</p>
                                                                <p className="text-[10.5px] text-[#94A3B8] font-mono truncate">{c.contractNumber}</p>
                                                            </div>
                                                            <span className="text-[10.5px] font-bold tabular-nums shrink-0" style={{ color: meta.color }}>
                                                                {c.daysLeft < 0 ? `${Math.abs(c.daysLeft)}d ago` : `${c.daysLeft}d`}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 flex items-center justify-between gap-2">
                                                            <span className="text-[10.5px] text-[#64748B] tabular-nums">{formatINR(c.contractValue)}</span>
                                                            <div className="flex items-center gap-0.5">
                                                                <Link href="/scm/vendors/contracts">
                                                                    <Button size="sm" variant="ghost" className="h-6 px-1 rounded-none text-[#64748B]" title="Open">
                                                                        <ExternalLink className="w-2.5 h-2.5" />
                                                                    </Button>
                                                                </Link>
                                                                {!isResolved && (
                                                                    <Button onClick={() => handleResolve(c)} size="sm" variant="ghost" className="h-6 px-1 rounded-none text-emerald-700 hover:bg-emerald-50" title="Mark actioned">
                                                                        <Check className="w-2.5 h-2.5" />
                                                                    </Button>
                                                                )}
                                                                <Button onClick={() => handleDismiss(c)} size="sm" variant="ghost" className="h-6 px-1 rounded-none text-[#64748B] hover:bg-slate-100" title="Dismiss">
                                                                    <BellOff className="w-2.5 h-2.5" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )}
                                </div>
                            )
                        })}
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
