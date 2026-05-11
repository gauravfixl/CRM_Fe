"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Search,
    Filter,
    ChevronLeft,
    ShieldCheck,
    MoreHorizontal,
    Flame,
    ThumbsUp,
    ThumbsDown,
    Clock,
    Target,
    Plus,
    X,
    Pencil,
    Trash2
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent } from "@/shared/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

interface QualityMetric {
    id: string
    source: string
    mqlRate: number
    sqlRate: number
    conversion: number
    avgScore: number
    lossReason: string
    timeToConvert: string
}

const INITIAL_METRICS: QualityMetric[] = [
    { id: "1", source: "LinkedIn Ads", mqlRate: 64, sqlRate: 42, conversion: 18.2, avgScore: 82, lossReason: "Budget Constraints", timeToConvert: "4.2 Days" },
    { id: "2", source: "Website Organic", mqlRate: 88, sqlRate: 56, conversion: 24.1, avgScore: 91, lossReason: "Competitor Choice", timeToConvert: "2.1 Days" },
    { id: "3", source: "Meta Ads", mqlRate: 32, sqlRate: 12, conversion: 4.8, avgScore: 45, lossReason: "Low Intent / Spam", timeToConvert: "12 Days" },
    { id: "4", source: "Cold Outbound", mqlRate: 18, sqlRate: 8, conversion: 2.4, avgScore: 32, lossReason: "No Response", timeToConvert: "18 Days" },
]

const LOSS_REASONS = ["Budget Constraints", "Competitor Choice", "Low Intent / Spam", "No Response", "Timing", "Feature Gap", "Other"]

interface FormState {
    source: string
    mqlRate: string
    sqlRate: string
    conversion: string
    avgScore: string
    lossReason: string
    timeToConvert: string
}

interface FormErrors {
    source?: string
    mqlRate?: string
    sqlRate?: string
    conversion?: string
    avgScore?: string
    lossReason?: string
    timeToConvert?: string
}

const QUALITY_FILTERS = [
    { value: "All", label: "All Quality" },
    { value: "high", label: "High (80+)" },
    { value: "mid", label: "Mid (50-79)" },
    { value: "low", label: "Low (<50)" }
]

export default function SourceQualityPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [metrics, setMetrics] = useState<QualityMetric[]>(INITIAL_METRICS)
    const [searchQuery, setSearchQuery] = useState("")
    const [qualityFilter, setQualityFilter] = useState("All")

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<FormState>({ source: "", mqlRate: "", sqlRate: "", conversion: "", avgScore: "", lossReason: "Budget Constraints", timeToConvert: "" })
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}
        if (!form.source.trim()) newErrors.source = "Source name is required"
        else if (form.source.trim().length < 2) newErrors.source = "Name must be at least 2 characters"
        else if (metrics.some(m => m.source.toLowerCase() === form.source.trim().toLowerCase() && m.id !== editingId)) {
            newErrors.source = "A source with this name already exists"
        }

        const validatePercent = (val: string, field: keyof FormErrors, label: string) => {
            if (!val.trim()) newErrors[field] = `${label} is required`
            else if (!/^\d+(\.\d+)?$/.test(val.trim())) newErrors[field] = "Must be a number"
            else if (parseFloat(val) < 0 || parseFloat(val) > 100) newErrors[field] = "Must be between 0 and 100"
        }
        validatePercent(form.mqlRate, "mqlRate", "MQL rate")
        validatePercent(form.sqlRate, "sqlRate", "SQL rate")
        validatePercent(form.conversion, "conversion", "Conversion rate")
        validatePercent(form.avgScore, "avgScore", "Avg score")

        if (!form.lossReason) newErrors.lossReason = "Loss reason is required"

        if (!form.timeToConvert.trim()) newErrors.timeToConvert = "Time to convert is required"
        else if (form.timeToConvert.trim().length > 30) newErrors.timeToConvert = "Must be under 30 characters"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ source: "", mqlRate: "", sqlRate: "", conversion: "", avgScore: "", lossReason: "Budget Constraints", timeToConvert: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (m: QualityMetric) => {
        setEditingId(m.id)
        setForm({
            source: m.source,
            mqlRate: m.mqlRate.toString(),
            sqlRate: m.sqlRate.toString(),
            conversion: m.conversion.toString(),
            avgScore: m.avgScore.toString(),
            lossReason: m.lossReason,
            timeToConvert: m.timeToConvert
        })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSubmit = () => {
        if (!validateForm()) {
            toast({ title: "Validation Error", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }

        const data = {
            source: form.source.trim(),
            mqlRate: parseFloat(form.mqlRate),
            sqlRate: parseFloat(form.sqlRate),
            conversion: parseFloat(form.conversion),
            avgScore: parseFloat(form.avgScore),
            lossReason: form.lossReason,
            timeToConvert: form.timeToConvert.trim()
        }

        if (editingId) {
            setMetrics(metrics.map(m => m.id === editingId ? { ...m, ...data } : m))
            toast({ title: "Source Updated", description: "Quality metrics saved." })
        } else {
            setMetrics([{ id: Math.random().toString(36).substring(2, 11), ...data }, ...metrics])
            toast({ title: "Source Tracked", description: "New quality benchmark added." })
        }

        setIsFormOpen(false)
        setEditingId(null)
        setForm({ source: "", mqlRate: "", sqlRate: "", conversion: "", avgScore: "", lossReason: "Budget Constraints", timeToConvert: "" })
        setErrors({})
    }

    const handleDelete = (id: string) => {
        setMetrics(metrics.filter(m => m.id !== id))
        toast({ title: "Source Removed", description: "Quality benchmark deleted." })
    }

    const filteredMetrics = useMemo(() => {
        return metrics.filter(m => {
            const matchesSearch = !searchQuery || m.source.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesQuality = qualityFilter === "All"
                || (qualityFilter === "high" && m.avgScore >= 80)
                || (qualityFilter === "mid" && m.avgScore >= 50 && m.avgScore < 80)
                || (qualityFilter === "low" && m.avgScore < 50)
            return matchesSearch && matchesQuality
        })
    }, [metrics, searchQuery, qualityFilter])

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header - light colorful */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50 p-6 rounded-none border border-amber-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-none bg-amber-100 text-amber-600 border border-amber-200 shadow-sm">
                                <Activity className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Source Quality Index
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            The "Quality Lens" for your marketing mix. Identify where your best-converting leads come from and which sources generate low-intent noise.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Running integrity audit..." })} className="h-10 rounded-none border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <ShieldCheck className="h-4 w-4 mr-2 text-slate-400" /> Integrity Audit
                    </Button>
                    <Button onClick={openCreate} className="h-10 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> Track New Source
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Global Quality Distribution - light colorful */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "MQL % (Avg)", val: "42.5%", icon: ThumbsUp, color: "text-indigo-600", bg: "bg-indigo-100", cardBg: "bg-indigo-50/60 border-indigo-100" },
                        { label: "High Intent Ratio", val: "0.64", icon: Flame, color: "text-orange-600", bg: "bg-orange-100", cardBg: "bg-orange-50/60 border-orange-100" },
                        { label: "Loss Rate (Spam)", val: "8.2%", icon: ThumbsDown, color: "text-rose-600", bg: "bg-rose-100", cardBg: "bg-rose-50/60 border-rose-100" },
                        { label: "Integrity Index", val: "A+", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-100", cardBg: "bg-emerald-50/60 border-emerald-100" },
                    ].map((m, i) => (
                        <Card key={i} className={`border shadow-sm rounded-none ${m.cardBg} overflow-hidden`}>
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">{m.label}</p>
                                    <h4 className="text-[22px] font-semibold tracking-tight text-slate-900 tabular-nums">{m.val}</h4>
                                </div>
                                <div className={`p-2.5 rounded-none ${m.bg} ${m.color}`}>
                                    <m.icon size={18} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Source Quality Table Area */}
                <div className="lg:col-span-12 space-y-4">
                    <div className="flex items-center justify-between px-2 gap-3 flex-wrap">
                        <h2 className="text-[16px] font-semibold tracking-tight text-slate-900">Source Performance Benchmark</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <Input
                                    placeholder="Filter sources..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-8 h-9 w-48 border-slate-200 rounded-none text-[12px] focus-visible:ring-1"
                                />
                                {searchQuery && (
                                    <Button variant="ghost" size="icon" onClick={() => setSearchQuery("")} className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6">
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                            <Select value={qualityFilter} onValueChange={setQualityFilter}>
                                <SelectTrigger className="h-9 rounded-none border-slate-200 text-[11px] font-semibold uppercase tracking-widest px-3 w-auto gap-2">
                                    <Filter className="h-3 w-3" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {QUALITY_FILTERS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredMetrics.map((s) => (
                            <Card key={s.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none group hover:ring-indigo-200 transition-all bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-50 items-center">
                                        <div className="flex-1 p-6 flex items-center gap-4 min-w-[250px]">
                                            <div className={`h-12 w-12 rounded-none flex items-center justify-center font-semibold text-[18px] tabular-nums ${s.avgScore > 80 ? 'bg-emerald-50 text-emerald-600' : s.avgScore > 60 ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600 shadow-sm shadow-rose-100'}`}>
                                                {s.avgScore}
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">{s.source}</h3>
                                                <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1"><Clock size={12} /> {s.timeToConvert} avg. conversion</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 p-6 max-w-[400px] space-y-3">
                                            <div className="flex justify-between items-end text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                                <div className="flex flex-col gap-1 items-start">
                                                    <span>MQL Rate</span>
                                                    <span className="text-slate-900 text-[12px] tabular-nums">{s.mqlRate}%</span>
                                                </div>
                                                <div className="flex flex-col gap-1 items-center">
                                                    <span>SQL Rate</span>
                                                    <span className="text-slate-900 text-[12px] tabular-nums">{s.sqlRate}%</span>
                                                </div>
                                                <div className="flex flex-col gap-1 items-end">
                                                    <span>CONV.</span>
                                                    <span className="text-emerald-600 text-[12px] font-semibold tabular-nums">{s.conversion}%</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 h-2 relative">
                                                <div className="h-full bg-indigo-600" style={{ width: `${s.mqlRate}%` }} />
                                                <div className="h-full bg-indigo-400" style={{ width: `${s.sqlRate}%` }} />
                                                <div className="h-full bg-emerald-500" style={{ width: `${s.conversion}%` }} />
                                            </div>
                                        </div>

                                        <div className="flex-1 p-6 flex flex-col items-start min-w-[180px]">
                                            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase leading-none mb-1">Primary Loss Reason</p>
                                            <span className={`text-[12px] font-semibold ${s.lossReason === 'Low Intent / Spam' ? 'text-rose-600' : 'text-slate-700'}`}>{s.lossReason}</span>
                                        </div>

                                        <div className="p-6 flex items-center justify-end gap-1">
                                            <Button size="icon" variant="ghost" onClick={() => openEdit(s)} className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-none hover:bg-indigo-50">
                                                <Pencil size={15} />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-none hover:bg-indigo-50">
                                                        <MoreHorizontal size={18} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 p-1 rounded-none shadow-xl border-slate-100">
                                                    <DropdownMenuItem onClick={() => openEdit(s)} className="py-2.5 text-[12px] font-medium"><Pencil size={14} className="mr-2" /> Edit Metrics</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => toast({ description: "Opening deep-dive analytics..." })} className="py-2.5 text-[12px] font-medium"><Activity size={14} className="mr-2" /> View Trend</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDelete(s.id)} className="py-2.5 text-[12px] font-semibold text-rose-500"><Trash2 size={14} className="mr-2" /> Remove</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredMetrics.length === 0 && (
                            <div className="p-12 text-center text-slate-400 text-[13px] font-medium border-2 border-dashed border-slate-200 rounded-none">
                                No source benchmarks match your filters.
                            </div>
                        )}
                    </div>
                </div>

                {/* Optimization Callout Bottom */}
                <div className="lg:col-span-12">
                    <Card className="border-none shadow-xl shadow-indigo-100/20 ring-1 ring-slate-100 rounded-none bg-slate-900 text-white p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:scale-125 transition-transform">
                            <Target size={200} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                            <div className="space-y-6">
                                <div className="p-3 rounded-none bg-emerald-500 w-fit shadow-xl shadow-emerald-500/20">
                                    <ThumbsUp size={32} className="fill-white" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[28px] font-semibold tracking-tight leading-tight">High-Quality Channel Identified</h3>
                                    <p className="text-[15px] text-slate-400 font-medium leading-relaxed">
                                        <strong className="font-semibold text-white">Website Organic</strong> leads are converting 4x faster than any other source. We recommend shifting 12% of the cold outbound budget to SEO initiatives.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button onClick={() => toast({ description: "Routing to budget allocator..." })} className="h-11 rounded-none bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 border-none">Allocate Budget</Button>
                                    <Button onClick={() => toast({ description: "Loading source comparison view..." })} variant="ghost" className="text-emerald-400 hover:text-white hover:bg-white/10 font-semibold h-11 px-6">Source Comparison</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { label: "Lead-to-SQL Velocity", val: 98, status: "Peak" },
                                    { label: "Data Integrity Rank", val: 94, status: "A+" },
                                    { label: "Rep Preference Rate", val: 82, status: "High" },
                                    { label: "Revenue Efficiency", val: 88, status: "Gold" },
                                ].map((stat, i) => (
                                    <div key={i} className="p-5 rounded-none bg-white/5 border border-white/10 space-y-2">
                                        <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase leading-none">{stat.label}</p>
                                        <div className="flex justify-between items-end">
                                            <h4 className="text-[20px] font-semibold tracking-tight tabular-nums">{stat.val}%</h4>
                                            <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">{stat.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

            </div>

            {/* Slide-from-Right Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b border-slate-100 bg-gradient-to-br from-amber-50 to-rose-50">
                        <SheetTitle className="text-[18px] font-semibold tracking-tight text-slate-900">
                            {editingId ? "Edit Source Quality" : "Track New Source Quality"}
                        </SheetTitle>
                        <p className="text-[12px] text-slate-500 font-medium">
                            {editingId ? "Update the quality benchmarks for this source." : "Add a new source benchmark with metrics."}
                        </p>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Source Name <span className="text-rose-500">*</span></Label>
                            <Input
                                name="source"
                                value={form.source}
                                onChange={e => { setForm({ ...form, source: e.target.value }); if (errors.source) setErrors({ ...errors, source: undefined }) }}
                                placeholder="e.g., Google Ads"
                                className={`h-11 rounded-none ${errors.source ? "border-rose-500" : ""}`}
                            />
                            {errors.source && <p className="text-[11px] text-rose-500 font-medium">{errors.source}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-[12px] font-semibold">MQL Rate (%) <span className="text-rose-500">*</span></Label>
                                <Input
                                    name="mqlRate"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={form.mqlRate}
                                    onChange={e => { setForm({ ...form, mqlRate: e.target.value }); if (errors.mqlRate) setErrors({ ...errors, mqlRate: undefined }) }}
                                    placeholder="0-100"
                                    className={`h-11 rounded-none ${errors.mqlRate ? "border-rose-500" : ""}`}
                                />
                                {errors.mqlRate && <p className="text-[11px] text-rose-500 font-medium">{errors.mqlRate}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[12px] font-semibold">SQL Rate (%) <span className="text-rose-500">*</span></Label>
                                <Input
                                    name="sqlRate"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={form.sqlRate}
                                    onChange={e => { setForm({ ...form, sqlRate: e.target.value }); if (errors.sqlRate) setErrors({ ...errors, sqlRate: undefined }) }}
                                    placeholder="0-100"
                                    className={`h-11 rounded-none ${errors.sqlRate ? "border-rose-500" : ""}`}
                                />
                                {errors.sqlRate && <p className="text-[11px] text-rose-500 font-medium">{errors.sqlRate}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-[12px] font-semibold">Conversion (%) <span className="text-rose-500">*</span></Label>
                                <Input
                                    name="conversion"
                                    type="number"
                                    min={0}
                                    max={100}
                                    step="0.1"
                                    value={form.conversion}
                                    onChange={e => { setForm({ ...form, conversion: e.target.value }); if (errors.conversion) setErrors({ ...errors, conversion: undefined }) }}
                                    placeholder="0-100"
                                    className={`h-11 rounded-none ${errors.conversion ? "border-rose-500" : ""}`}
                                />
                                {errors.conversion && <p className="text-[11px] text-rose-500 font-medium">{errors.conversion}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[12px] font-semibold">Avg Score <span className="text-rose-500">*</span></Label>
                                <Input
                                    name="avgScore"
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={form.avgScore}
                                    onChange={e => { setForm({ ...form, avgScore: e.target.value }); if (errors.avgScore) setErrors({ ...errors, avgScore: undefined }) }}
                                    placeholder="0-100"
                                    className={`h-11 rounded-none ${errors.avgScore ? "border-rose-500" : ""}`}
                                />
                                {errors.avgScore && <p className="text-[11px] text-rose-500 font-medium">{errors.avgScore}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Primary Loss Reason <span className="text-rose-500">*</span></Label>
                            <Select value={form.lossReason} onValueChange={v => { setForm({ ...form, lossReason: v }); if (errors.lossReason) setErrors({ ...errors, lossReason: undefined }) }}>
                                <SelectTrigger className={`h-11 rounded-none ${errors.lossReason ? "border-rose-500" : ""}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {LOSS_REASONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.lossReason && <p className="text-[11px] text-rose-500 font-medium">{errors.lossReason}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Time to Convert <span className="text-rose-500">*</span></Label>
                            <Input
                                name="timeToConvert"
                                value={form.timeToConvert}
                                onChange={e => { setForm({ ...form, timeToConvert: e.target.value }); if (errors.timeToConvert) setErrors({ ...errors, timeToConvert: undefined }) }}
                                placeholder="e.g., 4.2 Days"
                                className={`h-11 rounded-none ${errors.timeToConvert ? "border-rose-500" : ""}`}
                            />
                            {errors.timeToConvert && <p className="text-[11px] text-rose-500 font-medium">{errors.timeToConvert}</p>}
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-none" onClick={handleSubmit}>
                            {editingId ? "Save Changes" : "Track Source"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
