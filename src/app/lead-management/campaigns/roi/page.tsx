"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Plus,
    Search,
    ChevronLeft,
    TrendingUp,
    DollarSign,
    Target,
    ArrowUpRight,
    ArrowDownRight,
    Flame,
    Scale,
    PieChart as PieChartIcon,
    RefreshCw,
    ExternalLink,
    Wallet,
    X,
    Pencil,
    Trash2,
    Filter
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
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

interface ROIStat {
    id: string
    name: string
    spend: string
    cpl: string
    cpql: string
    revenue: string
    roi: string
    pace: string
    trend: "up" | "down"
}

const INITIAL_ROI: ROIStat[] = [
    { id: "1", name: "Q1 Global Outreach", spend: "$45,000", cpl: "$36.29", cpql: "$107.14", revenue: "$210,000", roi: "4.6x", pace: "On Track", trend: "up" },
    { id: "2", name: "Webinar: Future Ops", spend: "$12,000", cpl: "$14.12", cpql: "$100.00", revenue: "$32,000", roi: "2.6x", pace: "Under Budget", trend: "down" },
    { id: "3", name: "LinkedIn APAC Retention", spend: "$25,000", cpl: "$55.56", cpql: "$294.11", revenue: "$185,000", roi: "7.4x", pace: "Aggressive", trend: "up" },
]

const PACE_OPTIONS = ["On Track", "Under Budget", "Aggressive", "Planned", "Over Budget"]

interface FormState {
    name: string
    spend: string
    cpl: string
    revenue: string
    pace: string
}

interface FormErrors {
    name?: string
    spend?: string
    cpl?: string
    revenue?: string
    pace?: string
}

const moneyRegex = /^\$?[\d,]+(\.\d{1,2})?$/

export default function CostROIPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [roiStats, setRoiStats] = useState<ROIStat[]>(INITIAL_ROI)
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [paceFilter, setPaceFilter] = useState("All")

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<FormState>({ name: "", spend: "", cpl: "", revenue: "", pace: "Planned" })
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}
        if (!form.name.trim()) newErrors.name = "Campaign name is required"
        else if (form.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters"
        else if (form.name.trim().length > 60) newErrors.name = "Name must be under 60 characters"

        if (!form.spend.trim()) newErrors.spend = "Total spend is required"
        else if (!moneyRegex.test(form.spend.trim())) newErrors.spend = "Enter a valid amount (e.g., $25,000)"

        if (!form.cpl.trim()) newErrors.cpl = "CPL is required"
        else if (!moneyRegex.test(form.cpl.trim())) newErrors.cpl = "Enter a valid amount (e.g., $15.50)"

        if (form.revenue.trim() && !moneyRegex.test(form.revenue.trim())) {
            newErrors.revenue = "Enter a valid amount (e.g., $50,000)"
        }

        if (!form.pace) newErrors.pace = "Pace status is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const formatMoney = (val: string): string => {
        const cleaned = val.trim()
        return cleaned.startsWith("$") ? cleaned : `$${cleaned}`
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", spend: "", cpl: "", revenue: "", pace: "Planned" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (s: ROIStat) => {
        setEditingId(s.id)
        setForm({ name: s.name, spend: s.spend, cpl: s.cpl, revenue: s.revenue, pace: s.pace })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSubmit = () => {
        if (!validateForm()) {
            toast({ title: "Validation Error", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }

        if (editingId) {
            setRoiStats(roiStats.map(s => s.id === editingId ? {
                ...s,
                name: form.name.trim(),
                spend: formatMoney(form.spend),
                cpl: formatMoney(form.cpl),
                revenue: form.revenue.trim() ? formatMoney(form.revenue) : s.revenue,
                pace: form.pace
            } : s))
            toast({ title: "Budget Updated", description: "Campaign financials saved." })
        } else {
            const newStat: ROIStat = {
                id: Math.random().toString(36).substring(2, 11),
                name: form.name.trim(),
                spend: formatMoney(form.spend),
                cpl: formatMoney(form.cpl),
                cpql: "$0.00",
                revenue: form.revenue.trim() ? formatMoney(form.revenue) : "$0.00",
                roi: "0.0x",
                pace: form.pace,
                trend: "up"
            }
            setRoiStats([newStat, ...roiStats])
            toast({ title: "Budget Created", description: "Financial line entry added." })
        }

        setIsFormOpen(false)
        setEditingId(null)
        setForm({ name: "", spend: "", cpl: "", revenue: "", pace: "Planned" })
        setErrors({})
    }

    const handleDelete = (id: string) => {
        setRoiStats(roiStats.filter(s => s.id !== id))
        toast({ title: "Budget Removed", description: "Financial entry archived." })
    }

    const filteredStats = useMemo(() => {
        return roiStats.filter(s => {
            const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesPace = paceFilter === "All" || s.pace === paceFilter
            return matchesSearch && matchesPace
        })
    }, [roiStats, searchQuery, paceFilter])

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header - light colorful */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-gradient-to-br from-emerald-50 via-cyan-50 to-indigo-50 p-6 rounded-none border border-emerald-100 shadow-sm">
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
                            <div className="p-2 rounded-none bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-sm">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Cost & ROI Intelligence
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Track every dollar spent vs every lead generated. Measure CPL, CPQL, and predicted revenue ROI across all active campaigns.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Syncing spend from financial database..." })} className="h-10 rounded-none border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <RefreshCw className="h-4 w-4 mr-2 text-slate-400" /> Sync Spend Data
                    </Button>
                    <Button onClick={openCreate} className="h-10 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> Budget Entry
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Global Financial Metrics - light colorful */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Spend (MTD)", val: "$82.5k", icon: Wallet, color: "text-indigo-600", bg: "bg-indigo-100", cardBg: "bg-indigo-50/60 border-indigo-100" },
                        { label: "Avg CPL", val: "$34.12", icon: Target, color: "text-cyan-600", bg: "bg-cyan-100", cardBg: "bg-cyan-50/60 border-cyan-100" },
                        { label: "Avg CPQL", val: "$112.40", icon: Flame, color: "text-amber-600", bg: "bg-amber-100", cardBg: "bg-amber-50/60 border-amber-100" },
                        { label: "Overall ROI", val: "4.2x", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100", cardBg: "bg-emerald-50/60 border-emerald-100" },
                    ].map((m, i) => (
                        <Card key={i} className={`border shadow-sm rounded-none ${m.cardBg} overflow-hidden`}>
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">{m.label}</p>
                                    <h4 className="text-[22px] font-semibold tabular-nums text-slate-900">{m.val}</h4>
                                </div>
                                <div className={`p-2.5 rounded-none ${m.bg} ${m.color}`}>
                                    <m.icon size={18} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Campaign Financial Inventory */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2 gap-3 flex-wrap">
                        <h2 className="text-[16px] font-semibold text-slate-900">Campaign Financials</h2>
                        <div className="flex items-center gap-3">
                            {showSearch ? (
                                <div className="flex items-center bg-white border border-slate-200 rounded-none px-2 h-8">
                                    <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
                                    <Input
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Filter campaigns..."
                                        className="border-none h-6 px-0 text-[12px] focus-visible:ring-0 w-40"
                                    />
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setShowSearch(false); setSearchQuery("") }}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSearch(true)}>
                                    <Search className="h-4 w-4 text-slate-400" />
                                </Button>
                            )}
                            <Select value={paceFilter} onValueChange={setPaceFilter}>
                                <SelectTrigger className="h-8 rounded-none border-slate-200 text-[11px] font-semibold uppercase tracking-widest px-3 w-auto gap-2">
                                    <Filter className="h-3 w-3" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="All">All Pace</SelectItem>
                                    {PACE_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50/60 text-[10px] font-semibold h-6 px-2 rounded-none">BUDGET TRACKING ACTIVE</Badge>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredStats.map((stat) => (
                            <Card key={stat.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none group hover:ring-emerald-200 transition-all bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4 min-w-[280px]">
                                                <div className="p-3 rounded-none bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                                    <DollarSign size={22} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-[15px] font-semibold text-slate-900">{stat.name}</h3>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Spent: <span className="text-slate-900">{stat.spend}</span></span>
                                                        <Badge className="bg-slate-50 text-slate-500 border-none px-1.5 h-4.5 text-[9px] font-semibold uppercase tracking-wider rounded-none">{stat.pace}</Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8 min-w-[180px]">
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">CPL</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <h4 className="text-[15px] font-semibold tabular-nums text-slate-900">{stat.cpl}</h4>
                                                        {stat.trend === 'up' ? <ArrowUpRight size={10} className="text-emerald-500" /> : <ArrowDownRight size={10} className="text-rose-500" />}
                                                    </div>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">CPQL</p>
                                                    <h4 className="text-[15px] font-semibold tabular-nums text-indigo-600">{stat.cpql}</h4>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end min-w-[150px]">
                                                <p className="text-[9px] font-semibold tracking-wider text-slate-300 uppercase leading-none mb-1">Total ROI</p>
                                                <div className="flex items-baseline gap-1">
                                                    <h3 className="text-[20px] font-semibold tabular-nums text-emerald-600 tracking-tighter">{stat.roi}</h3>
                                                </div>
                                                <span className="text-[10px] font-semibold text-slate-400">Rev: {stat.revenue}</span>
                                            </div>

                                            <div className="flex items-center gap-1 justify-end">
                                                <Button size="icon" variant="ghost" onClick={() => openEdit(stat)} className="h-9 w-9 text-slate-400 hover:text-indigo-600 rounded-none">
                                                    <Pencil size={15} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-none">
                                                            <ExternalLink size={15} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 p-1 rounded-none shadow-xl border-slate-100">
                                                        <DropdownMenuItem onClick={() => openEdit(stat)} className="py-2.5 text-[12px] font-medium"><Pencil size={14} className="mr-2" /> Edit Budget</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ description: "Detail view loading..." })} className="py-2.5 text-[12px] font-medium"><ExternalLink size={14} className="mr-2" /> View Detail</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(stat.id)} className="py-2.5 text-[12px] font-semibold text-rose-500"><Trash2 size={14} className="mr-2" /> Remove</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredStats.length === 0 && (
                            <div className="p-12 text-center text-slate-400 text-[13px] font-medium border-2 border-dashed border-slate-200 rounded-none">
                                No financial entries match your filters.
                            </div>
                        )}
                    </div>
                </div>

                {/* Efficiency Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-none bg-indigo-50 text-indigo-600">
                                <Scale size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Spend Efficiency</h4>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-slate-50">
                            {[
                                { label: "Budget Pacing", val: 84, color: "bg-indigo-600", status: "Nominal" },
                                { label: "Market CPQL Baseline", val: 120, color: "bg-amber-500", status: "High Cost" },
                                { label: "Channel Saturation", val: 42, color: "bg-emerald-500", status: "Scaleable" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider uppercase">
                                        <span className="text-slate-400">{s.label}</span>
                                        <span className="text-slate-900">{s.status}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-none overflow-hidden">
                                        <div className={`h-full ${s.color}`} style={{ width: `${s.val > 100 ? 100 : s.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-indigo-50 text-indigo-900 p-8 space-y-4 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-500 transition-transform group-hover:scale-110">
                            <PieChartIcon size={120} />
                        </div>
                        <h4 className="text-[16px] font-semibold tracking-tight relative z-10">Financial Modeling</h4>
                        <p className="text-[12px] text-indigo-700 font-medium leading-relaxed relative z-10">
                            Project future results by adjusting your CPL and Budget variables.
                        </p>
                        <Button onClick={() => toast({ description: "Calculator tool loading..." })} className="w-full h-10 rounded-none bg-white text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-widest border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-10">
                            Launch Calculator
                        </Button>
                    </Card>

                    <div className="p-5 rounded-none bg-emerald-50 border border-emerald-100 flex items-start gap-4">
                        <div className="p-2 rounded-none bg-white text-emerald-600 border border-emerald-200 shadow-sm">
                            <TrendingUp size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-emerald-900">Optimization Goal</p>
                            <p className="text-[11px] text-emerald-700 font-medium leading-relaxed italic">
                                "Reducing CPQL by 12% on APAC Retention would yield an additional $22k in projected revenue."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Slide-from-Right Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b border-slate-100 bg-gradient-to-br from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold tracking-tight text-slate-900">
                            {editingId ? "Edit Budget Entry" : "Allocate Campaign Budget"}
                        </SheetTitle>
                        <p className="text-[12px] text-slate-500 font-medium">
                            {editingId ? "Update the financial details." : "Set spend, CPL, and pace for tracking."}
                        </p>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Campaign Name <span className="text-rose-500">*</span></Label>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={e => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }) }}
                                placeholder="e.g., APAC Expansion Q3"
                                className={`h-11 rounded-none ${errors.name ? "border-rose-500" : ""}`}
                            />
                            {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Total Projected Spend <span className="text-rose-500">*</span></Label>
                            <Input
                                name="spend"
                                value={form.spend}
                                onChange={e => { setForm({ ...form, spend: e.target.value }); if (errors.spend) setErrors({ ...errors, spend: undefined }) }}
                                placeholder="e.g., $25,000"
                                className={`h-11 rounded-none ${errors.spend ? "border-rose-500" : ""}`}
                            />
                            {errors.spend && <p className="text-[11px] text-rose-500 font-medium">{errors.spend}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Target Baseline CPL <span className="text-rose-500">*</span></Label>
                            <Input
                                name="cpl"
                                value={form.cpl}
                                onChange={e => { setForm({ ...form, cpl: e.target.value }); if (errors.cpl) setErrors({ ...errors, cpl: undefined }) }}
                                placeholder="e.g., $15.50"
                                className={`h-11 rounded-none ${errors.cpl ? "border-rose-500" : ""}`}
                            />
                            {errors.cpl && <p className="text-[11px] text-rose-500 font-medium">{errors.cpl}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Projected Revenue (optional)</Label>
                            <Input
                                name="revenue"
                                value={form.revenue}
                                onChange={e => { setForm({ ...form, revenue: e.target.value }); if (errors.revenue) setErrors({ ...errors, revenue: undefined }) }}
                                placeholder="e.g., $50,000"
                                className={`h-11 rounded-none ${errors.revenue ? "border-rose-500" : ""}`}
                            />
                            {errors.revenue && <p className="text-[11px] text-rose-500 font-medium">{errors.revenue}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Pace Status <span className="text-rose-500">*</span></Label>
                            <Select value={form.pace} onValueChange={v => { setForm({ ...form, pace: v }); if (errors.pace) setErrors({ ...errors, pace: undefined }) }}>
                                <SelectTrigger className={`h-11 rounded-none ${errors.pace ? "border-rose-500" : ""}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {PACE_OPTIONS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.pace && <p className="text-[11px] text-rose-500 font-medium">{errors.pace}</p>}
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-none" onClick={handleSubmit}>
                            {editingId ? "Save Changes" : "Create Budget"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
