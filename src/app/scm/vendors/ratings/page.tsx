"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Star, Download, Trophy, Medal, Search } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { useScmVendorsStore, type ScmVendor } from "@/shared/data/scm/scm-vendors-store"

const PARAMS = [
    "Product Quality",
    "Delivery Timeliness",
    "Pricing",
    "Communication",
    "Compliance",
    "After-Sales Support",
] as const

export default function VendorRatingsPage() {
    const { toast } = useToast()
    const vendors = useScmVendorsStore((s) => s.vendors)
    const updateVendor = useScmVendorsStore((s) => s.updateVendor)

    const [editing, setEditing] = useState<ScmVendor | null>(null)
    const [scores, setScores] = useState<Record<string, number>>({})
    const [submitting, setSubmitting] = useState(false)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (editing) {
            const init = PARAMS.reduce<Record<string, number>>((acc, p) => {
                acc[p] = Math.max(1, Math.min(5, Math.round(editing.rating)))
                return acc
            }, {})
            setScores(init)
        }
    }, [editing])

    const setScore = (param: string, val: number) => setScores((s) => ({ ...s, [param]: val }))

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editing) return
        setSubmitting(true)
        try {
            const avg = Object.values(scores).reduce((a, b) => a + b, 0) / PARAMS.length
            updateVendor(editing.id, { rating: Math.round(avg * 10) / 10 })
            toast({ title: "Rating saved", description: `${editing.vendorName}: ${avg.toFixed(1)}/5` })
            setEditing(null)
        } finally { setSubmitting(false) }
    }

    const ranked = useMemo(() => {
        const sorted = [...vendors].sort((a, b) => b.rating - a.rating)
        const q = search.trim().toLowerCase()
        if (!q) return sorted
        return sorted.filter((v) => v.vendorName.toLowerCase().includes(q) || v.vendorCode.toLowerCase().includes(q) || v.category.toLowerCase().includes(q))
    }, [vendors, search])

    const podium = useMemo(() => [...vendors].sort((a, b) => b.rating - a.rating).slice(0, 3), [vendors])
    const others = useMemo(() => {
        const top3Ids = new Set(podium.map((v) => v.id))
        return ranked.filter((v) => !top3Ids.has(v.id))
    }, [ranked, podium])

    const summary = useMemo(() => {
        const total = vendors.length
        const avg = total === 0 ? 0 : vendors.reduce((s, v) => s + v.rating, 0) / total
        const fiveStars = vendors.filter((v) => v.rating >= 4.5).length
        const lowRated = vendors.filter((v) => v.rating < 3.5).length
        return { total, avg, fiveStars, lowRated }
    }, [vendors])

    const handleExport = () => {
        if (vendors.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Rank", "Code", "Vendor", "Category", "Rating", "Status"]
        const rows = ranked.map((v, idx) => [idx + 1, v.vendorCode, v.vendorName, v.category, v.rating, v.status])
        const escape = (val: any) => { const s = String(val ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-vendor-ratings-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} vendors exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Vendor Ratings</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Rate vendors on 6 parameters and see the leaderboard.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-none border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryStat label="Vendors Rated" value={summary.total} color="#2563eb" />
                <SummaryStat label="Average Rating" value={summary.avg.toFixed(1)} color="#f59e0b" suffix="/5" />
                <SummaryStat label="Top Performers (≥4.5)" value={summary.fiveStars} color="#10b981" />
                <SummaryStat label="Low Rated (<3.5)" value={summary.lowRated} color="#ef4444" />
            </div>

            {/* Podium — Top 3 */}
            {podium.length > 0 && (
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <h3 className="text-[14px] font-semibold text-[#0F172A]">Top Performers</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        {[1, 0, 2].map((podiumIdx) => {
                            const v = podium[podiumIdx]
                            if (!v) return <div key={podiumIdx} />
                            const rank = podiumIdx + 1
                            const meta =
                                rank === 1 ? { color: "#f59e0b", bg: "from-amber-100 to-amber-50", icon: <Trophy className="w-5 h-5" />, height: "h-32" }
                                : rank === 2 ? { color: "#94a3b8", bg: "from-slate-100 to-slate-50", icon: <Medal className="w-5 h-5" />, height: "h-24" }
                                : { color: "#a16207", bg: "from-orange-100 to-orange-50", icon: <Medal className="w-5 h-5" />, height: "h-20" }
                            return (
                                <div key={v.id} className="flex flex-col items-center">
                                    <div className={cn("w-full rounded-none bg-gradient-to-b p-4 text-center shadow-sm border", meta.bg)} style={{ borderColor: `${meta.color}33` }}>
                                        <div className="w-12 h-12 rounded-none mx-auto flex items-center justify-center text-white shadow-md" style={{ backgroundColor: meta.color }}>
                                            {meta.icon}
                                        </div>
                                        <p className="text-[11px] uppercase tracking-wide font-semibold mt-2" style={{ color: meta.color }}>Rank #{rank}</p>
                                        <p className="text-[14px] font-semibold text-[#0F172A] mt-1 truncate">{v.vendorName}</p>
                                        <p className="text-[11.5px] text-[#64748B] mt-0.5">{v.category}</p>
                                        <div className="mt-3 flex items-center justify-center gap-1">
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <Star key={n} className={`w-4 h-4 ${n <= Math.round(v.rating) ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
                                            ))}
                                        </div>
                                        <p className="text-[20px] font-bold mt-1 tabular-nums" style={{ color: meta.color }}>{v.rating.toFixed(1)}</p>
                                    </div>
                                    <div className={cn("w-full rounded-none", meta.height)} style={{ backgroundColor: `${meta.color}20`, marginTop: "8px" }} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-3">
                <div className="relative max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vendor by name, code, category..." className="pl-8 h-9 rounded-none border-[#E5E7EB] text-[13px]" />
                </div>
            </div>

            {/* Other rankings */}
            {others.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {others.map((v, idx) => {
                        const rank = (search ? ranked.findIndex((r) => r.id === v.id) : podium.length + idx) + 1
                        return (
                            <VendorCard
                                key={v.id}
                                vendor={v}
                                rank={rank}
                                onRate={() => setEditing(v)}
                            />
                        )
                    })}
                </div>
            )}

            {ranked.length === 0 && (
                <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-12 text-center">
                    <p className="text-[13px] text-[#64748B]">No vendors match the search.</p>
                </div>
            )}

            {/* Rating form */}
            <SideFormSheet
                open={!!editing}
                onOpenChange={(o) => !o && setEditing(null)}
                title={editing ? `Rate ${editing.vendorName}` : "Rate Vendor"}
                description="Score 1 (poor) to 5 (excellent) on each parameter."
                icon={<Star className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel="Save Rating"
                width="md"
                accentColor="#f59e0b"
            >
                <div className="space-y-4">
                    {PARAMS.map((p) => (
                        <div key={p} className="flex items-center justify-between gap-3 py-2 border-b border-[#F1F5F9] last:border-0">
                            <span className="text-[13px] font-medium text-[#0F172A]">{p}</span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => setScore(p, n)}
                                        className="p-1 hover:scale-110 transition-transform"
                                        aria-label={`${n} stars`}
                                    >
                                        <Star className={`w-5 h-5 ${n <= (scores[p] ?? 0) ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
                                    </button>
                                ))}
                                <span className="ml-2 text-[12.5px] font-semibold tabular-nums text-[#64748B] w-6">{scores[p] ?? 0}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </SideFormSheet>
        </div>
    )
}

function VendorCard({ vendor, rank, onRate }: { vendor: ScmVendor; rank: number; onRate: () => void }) {
    const fillPct = (vendor.rating / 5) * 100
    const accent = vendor.rating >= 4.5 ? "#10b981" : vendor.rating >= 3.5 ? "#f59e0b" : "#ef4444"
    return (
        <div
            className="rounded-none border shadow-sm p-4 hover:shadow-md transition-all"
            style={{
                background: `linear-gradient(135deg, ${accent}10 0%, ${accent}05 45%, #ffffff 100%)`,
                borderColor: `${accent}33`,
            }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-none bg-slate-100 flex items-center justify-center text-[13px] font-bold text-[#64748B] shrink-0">
                        #{rank}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold text-[#0F172A] truncate">{vendor.vendorName}</p>
                        <p className="text-[11.5px] text-[#94A3B8] truncate">{vendor.vendorCode} · {vendor.category}</p>
                    </div>
                </div>
                <StatusBadge status={vendor.status} />
            </div>

            <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(vendor.rating) ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
                        ))}
                    </div>
                    <span className="text-[14px] font-bold tabular-nums text-[#0F172A]">{vendor.rating.toFixed(1)}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-none overflow-hidden">
                    <div
                        className="h-full rounded-none transition-all"
                        style={{
                            width: `${fillPct}%`,
                            backgroundColor: vendor.rating >= 4.5 ? "#10b981" : vendor.rating >= 3.5 ? "#f59e0b" : "#ef4444",
                        }}
                    />
                </div>
            </div>

            <Button onClick={onRate} variant="outline" size="sm" className="w-full mt-3 h-8 rounded-none text-[12px] border-[#E5E7EB]">
                <Star className="w-3.5 h-3.5 mr-1" /> Rate Vendor
            </Button>
        </div>
    )
}

function SummaryStat({ label, value, color, suffix }: { label: string; value: number | string; color: string; suffix?: string }) {
    return (
        <div
            className="rounded-none border shadow-sm p-4 transition-all duration-200"
            style={{
                background: `linear-gradient(135deg, ${color}14 0%, ${color}06 45%, #ffffff 100%)`,
                borderColor: `${color}33`,
            }}
        >
            <p className="text-[12px] font-medium text-[#64748B]">{label}</p>
            <p className="text-[22px] font-semibold mt-1 tabular-nums leading-tight" style={{ color }}>
                {value}{suffix && <span className="text-[14px] text-[#94A3B8] ml-0.5">{suffix}</span>}
            </p>
        </div>
    )
}
