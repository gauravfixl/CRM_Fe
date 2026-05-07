"use client"

import * as React from "react"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
    Truck, MapPin, Clock, AlertOctagon, Phone, Check, BellOff, ArrowRight,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmShipmentsStore, type ScmShipment } from "@/shared/data/scm/scm-shipments-store"

const TODAY_ISO = new Date().toISOString().slice(0, 10)
const TODAY_TIME = new Date().setHours(0, 0, 0, 0)

const daysBetween = (a: string, b: string) => {
    const A = new Date(a).setHours(0, 0, 0, 0)
    const B = new Date(b).setHours(0, 0, 0, 0)
    return Math.round((B - A) / (1000 * 60 * 60 * 24))
}

const severityForDays = (days: number) => {
    if (days <= 1) return { label: "Slight", color: "#f59e0b", bg: "#fffbeb" }
    if (days <= 3) return { label: "Moderate", color: "#f97316", bg: "#fff7ed" }
    if (days <= 7) return { label: "High", color: "#ef4444", bg: "#fef2f2" }
    return { label: "Critical", color: "#dc2626", bg: "#fef2f2" }
}

export default function DelayedShipmentAlertsPage() {
    const { toast } = useToast()
    const shipments = useScmShipmentsStore((s) => s.shipments)

    const [resolved, setResolved] = useState<Set<string>>(new Set())
    const [dismissed, setDismissed] = useState<Set<string>>(new Set())

    const delayed = useMemo(() => {
        return shipments
            .filter((s) => s.status === "Delayed" || (s.status !== "Delivered" && s.status !== "Cancelled" && s.expectedDelivery < TODAY_ISO))
            .filter((s) => !dismissed.has(s.id))
            .map((s) => ({ ...s, daysLate: Math.max(0, daysBetween(s.expectedDelivery, TODAY_ISO)) }))
            .sort((a, b) => b.daysLate - a.daysLate)
    }, [shipments, dismissed])

    const summary = {
        total: delayed.length,
        critical: delayed.filter((s) => s.daysLate > 7).length,
        avgDays: delayed.length === 0 ? 0 : Math.round(delayed.reduce((sum, s) => sum + s.daysLate, 0) / delayed.length),
        affectedCouriers: new Set(delayed.map((s) => s.courierPartner)).size,
    }

    const handleResolve = (s: ScmShipment) => {
        setResolved((prev) => new Set(prev).add(s.id))
        toast({ title: "Marked resolved", description: s.shipmentId })
    }
    const handleDismiss = (s: ScmShipment) => {
        setDismissed((prev) => new Set(prev).add(s.id))
        toast({ title: "Alert dismissed", description: s.shipmentId })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <Truck className="w-5 h-5 text-[#ef4444]" /> Delayed Shipment Alerts
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">
                        Tracking timeline — visualize how late each shipment is from its expected delivery.
                    </p>
                </div>
                <Link href="/scm/shipments/delayed">
                    <Button variant="outline" className="h-9 px-3 rounded-none border-[#E5E7EB] text-[#374151] text-[13px]">
                        <Truck className="w-4 h-4 mr-1.5" /> Open Delayed Shipments
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Delayed Shipments" value={summary.total} accent="#ef4444" icon={<Truck className="w-4 h-4" />} />
                <Stat label="Critical (>7 days)" value={summary.critical} accent="#dc2626" icon={<AlertOctagon className="w-4 h-4" />} />
                <Stat label="Avg Days Late" value={summary.avgDays} accent="#f59e0b" icon={<Clock className="w-4 h-4" />} helper="across all delays" />
                <Stat label="Couriers Impacted" value={summary.affectedCouriers} accent="#8b5cf6" icon={<MapPin className="w-4 h-4" />} />
            </div>

            {delayed.length === 0 ? (
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-10 text-center">
                    <div className="w-12 h-12 rounded-none bg-emerald-50 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A] mt-3">All shipments on track</p>
                    <p className="text-[12.5px] text-[#64748B] mt-1">No delivery delays at the moment.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {delayed.map((s) => {
                        const isResolved = resolved.has(s.id)
                        const sev = severityForDays(s.daysLate)
                        const totalSpan = Math.max(1, daysBetween(s.pickupDate, TODAY_ISO))
                        const expectedAt = daysBetween(s.pickupDate, s.expectedDelivery)
                        const expectedPct = Math.max(0, Math.min(100, (expectedAt / totalSpan) * 100))
                        return (
                            <li
                                key={s.id}
                                className={`bg-white rounded-none border shadow-sm transition-all ${isResolved ? "opacity-50 border-emerald-200" : "hover:shadow-md"}`}
                                style={!isResolved ? { borderLeftWidth: 4, borderLeftColor: sev.color } : { borderLeftWidth: 4, borderLeftColor: "#10b981" }}
                            >
                                <div className="px-5 py-3 border-b border-[#EEF1F6] flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-none flex items-center justify-center text-white shrink-0" style={{ background: sev.color }}>
                                            <Truck className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[13.5px] font-semibold text-[#0F172A] inline-flex items-center gap-2">
                                                <span className="font-mono text-[11.5px] bg-slate-100 px-1.5 py-0.5">{s.shipmentId}</span>
                                                <span className="truncate">{s.customerName}</span>
                                            </p>
                                            <p className="text-[11.5px] text-[#64748B] mt-0.5 truncate">
                                                {s.courierPartner} · Track: <span className="font-mono">{s.trackingNumber}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10.5px] font-bold uppercase tracking-wider border"
                                            style={{ color: sev.color, borderColor: `${sev.color}55`, background: `${sev.color}10` }}
                                        >
                                            {sev.label} · {s.daysLate}d late
                                        </span>
                                    </div>
                                </div>

                                <div className="px-5 py-4">
                                    <div className="relative h-12">
                                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200" />
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1" style={{ width: `${expectedPct}%`, background: "#10b981" }} />
                                        <div className="absolute top-1/2 -translate-y-1/2 h-1" style={{ left: `${expectedPct}%`, right: 0, background: sev.color, opacity: 0.55 }} />

                                        <Marker pct={0} color="#10b981" label="Pickup" date={s.pickupDate} />
                                        <Marker pct={expectedPct} color="#10b981" label="Expected" date={s.expectedDelivery} dashed />
                                        <Marker pct={100} color={sev.color} label="Today" date={TODAY_ISO} solid />
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11.5px]">
                                        <Cell label="Pickup" value={s.pickupDate} />
                                        <Cell label="Expected" value={s.expectedDelivery} valueStyle={{ color: "#10b981" }} />
                                        <Cell label="Delay" value={`${s.daysLate} day${s.daysLate !== 1 ? "s" : ""}`} valueStyle={{ color: sev.color, fontWeight: 700 }} />
                                        <Cell label="Status" value={s.status} />
                                    </div>
                                </div>

                                <div className="px-5 py-3 border-t border-[#EEF1F6] bg-slate-50/40 flex items-center justify-between gap-2 flex-wrap">
                                    <div className="text-[11.5px] text-[#64748B] inline-flex items-center gap-1.5 min-w-0">
                                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{s.customerAddress}</span>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <Button variant="outline" size="sm" className="h-8 px-2 rounded-none text-[11.5px] border-[#E5E7EB]">
                                            <Phone className="w-3.5 h-3.5 mr-1" /> Contact courier
                                        </Button>
                                        <Link href="/scm/shipments/list">
                                            <Button variant="outline" size="sm" className="h-8 px-2 rounded-none text-[11.5px] border-[#E5E7EB]">
                                                Open <ArrowRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </Link>
                                        {!isResolved && (
                                            <Button onClick={() => handleResolve(s)} size="sm" variant="ghost" className="h-8 px-2 rounded-none text-emerald-700 hover:bg-emerald-50">
                                                <Check className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                        <Button onClick={() => handleDismiss(s)} size="sm" variant="ghost" className="h-8 px-2 rounded-none text-[#64748B] hover:bg-slate-100">
                                            <BellOff className="w-3.5 h-3.5" />
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
}

function Marker({ pct, color, label, date, dashed, solid }: { pct: number; color: string; label: string; date: string; dashed?: boolean; solid?: boolean }) {
    return (
        <div className="absolute top-0 -translate-x-1/2" style={{ left: `${pct}%` }}>
            <div
                className="w-3 h-3 rounded-none mx-auto"
                style={{
                    background: solid ? color : "#fff",
                    border: `2px solid ${color}`,
                    borderStyle: dashed ? "dashed" : "solid",
                }}
            />
            <p className="text-[10px] font-bold mt-1 text-center" style={{ color }}>{label}</p>
            <p className="text-[9.5px] text-[#94A3B8] mt-0.5 text-center tabular-nums whitespace-nowrap">{date}</p>
        </div>
    )
}

function Cell({ label, value, valueStyle }: { label: string; value: string; valueStyle?: React.CSSProperties }) {
    return (
        <div>
            <p className="text-[10.5px] font-medium uppercase tracking-wider text-[#94A3B8]">{label}</p>
            <p className="text-[12.5px] font-semibold text-[#0F172A] mt-0.5 tabular-nums" style={valueStyle}>{value}</p>
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
                    <p className="mt-1.5 text-[22px] font-bold tabular-nums leading-tight" style={{ color: accent }}>{value}</p>
                    {helper && <p className="text-[11px] text-[#94A3B8] mt-1">{helper}</p>}
                </div>
                <div className="w-9 h-9 rounded-none flex items-center justify-center text-white shrink-0" style={{ background: accent, boxShadow: `0 4px 12px ${accent}33` }}>
                    {icon}
                </div>
            </div>
        </div>
    )
}
