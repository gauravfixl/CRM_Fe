"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    Tooltip
} from "recharts"
import {
    Target,
    ChevronLeft,
    Download,
    Zap,
    DollarSign,
    TrendingUp,
    Briefcase,
    Loader2,
    CheckCircle2,
    HelpCircle,
    ArrowRight,
    SlidersHorizontal,
    Filter
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Input } from "@/shared/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/shared/components/ui/popover"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"

interface ForecastStage {
    stage: string
    volume: number
    value: number
    prob: number
    weighted: number
}

const INITIAL_FORECAST_MODEL: ForecastStage[] = [
    { stage: 'Contacted', volume: 45, value: 540000, prob: 5, weighted: 27000 },
    { stage: 'Engaged', volume: 38, value: 420000, prob: 12, weighted: 50400 },
    { stage: 'Qualified', volume: 28, value: 360000, prob: 30, weighted: 108000 },
    { stage: 'Proposal Shared', volume: 18, value: 220000, prob: 55, weighted: 121000 },
    { stage: 'Negotiation', volume: 12, value: 180000, prob: 75, weighted: 135000 },
    { stage: 'Decision Pending', volume: 8, value: 95000, prob: 90, weighted: 85500 },
]

const MONTHLY_PROJECTION = [
    { month: 'Jan', actual: 420000, projected: 450000 },
    { month: 'Feb', actual: 380000, projected: 400000 },
    { month: 'Mar', actual: 460000, projected: 420000 },
    { month: 'Apr', actual: 0, projected: 480000 },
    { month: 'May', actual: 0, projected: 520000 },
    { month: 'Jun', actual: 0, projected: 550000 },
]

interface AdjustProbabilitiesSheetProps {
    open: boolean
    onClose: () => void
    initial: ForecastStage[]
    onSave: (next: ForecastStage[]) => void
}

function AdjustProbabilitiesSheet({ open, onClose, initial, onSave }: AdjustProbabilitiesSheetProps) {
    const [draft, setDraft] = useState<{ stage: string; prob: string }[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (open) {
            setDraft(initial.map(i => ({ stage: i.stage, prob: String(i.prob) })))
            setErrors({})
        }
    }, [open, initial])

    const validate = () => {
        const next: Record<string, string> = {}
        draft.forEach(d => {
            if (!d.prob.toString().trim()) {
                next[d.stage] = "Required"
                return
            }
            const n = parseFloat(d.prob)
            if (isNaN(n)) next[d.stage] = "Must be a number"
            else if (n < 0 || n > 100) next[d.stage] = "Must be 0-100"
        })
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        const merged = initial.map(stage => {
            const d = draft.find(x => x.stage === stage.stage)
            const newProb = d ? parseFloat(d.prob) : stage.prob
            return {
                ...stage,
                prob: newProb,
                weighted: Math.round(stage.value * (newProb / 100))
            }
        })
        onSave(merged)
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={(v) => { if (!v) onClose() }}
            title="Adjust Win Probabilities"
            description="Override per-stage win probability used in the weighted forecast calculation."
            icon={<SlidersHorizontal className="h-5 w-5" />}
            accentColor="#4f46e5"
            width="md"
            onSubmit={handleSubmit}
            submitLabel="Save Adjustments"
        >
            <div className="space-y-4">
                {draft.map((d, i) => (
                    <Field
                        key={d.stage}
                        label={`${d.stage} (%)`}
                        required
                        error={errors[d.stage]}
                    >
                        <Input
                            name={`prob_${d.stage.replace(/\s+/g, "_")}`}
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={d.prob}
                            onChange={(e) => {
                                const next = [...draft]
                                next[i] = { ...next[i], prob: e.target.value }
                                setDraft(next)
                            }}
                            className="h-10 border-slate-200 rounded-none"
                        />
                    </Field>
                ))}
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-none text-[12px] text-indigo-800">
                    Weighted projection auto-recalculates on save: <span className="font-semibold">value × probability</span>.
                </div>
            </div>
        </SideFormSheet>
    )
}

export default function ForecastPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isRunningAI, setIsRunningAI] = useState(false)
    const [forecastModel, setForecastModel] = useState<ForecastStage[]>(INITIAL_FORECAST_MODEL)
    const [adjustOpen, setAdjustOpen] = useState(false)

    // Filters
    const [filterOpen, setFilterOpen] = useState(false)
    const [minProb, setMinProb] = useState("")
    const [stageFilter, setStageFilter] = useState("all")

    const filteredModel = useMemo(() => forecastModel.filter(m => {
        if (stageFilter !== "all" && m.stage !== stageFilter) return false
        if (minProb) {
            const n = parseFloat(minProb) || 0
            if (m.prob < n) return false
        }
        return true
    }), [forecastModel, stageFilter, minProb])

    const activeFilterCount = (stageFilter !== "all" ? 1 : 0) + (minProb ? 1 : 0)

    const totalPipelineValue = forecastModel.reduce((acc, stage) => acc + stage.value, 0)
    const weightedForecastValue = forecastModel.reduce((acc, stage) => acc + stage.weighted, 0)

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    })

    const handleRunAI = () => {
        setIsRunningAI(true)
        setTimeout(() => {
            setIsRunningAI(false)
            toast({
                title: "Prediction AI Complete",
                description: "Win probabilities updated based on historical Q1 performance.",
            })
        }, 2000)
    }

    const handleSaveProbabilities = (next: ForecastStage[]) => {
        setForecastModel(next)
        setAdjustOpen(false)
        toast({
            title: "Probabilities Updated",
            description: "Weighted forecast has been recalculated.",
        })
    }

    const handleExport = () => {
        const headers = ["Stage", "Volume", "Raw Value", "Win Prob", "Weighted Projection"]
        const rows = forecastModel.map(m => [m.stage, m.volume.toString(), m.value.toString(), m.prob + "%", m.weighted.toString()])
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `Outcome_Forecast_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast({ title: "Export Success", description: "Forecast data exported to CSV." })
    }

    const handleClearFilters = () => {
        setMinProb("")
        setStageFilter("all")
        setFilterOpen(false)
    }

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500" style={{ zoom: 0.9 }}>

            {/* Structural Header (light indigo) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-indigo-50 p-4 rounded-none border border-indigo-100 shadow-sm">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/lead-management/pipeline/board')}
                        className="-ml-2 h-7 text-[10px] font-medium text-slate-500 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back to Pipeline
                    </Button>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-none bg-white text-indigo-600 border border-indigo-100">
                                <Target className="h-4 w-4" />
                            </div>
                            <h1 className="text-[20px] font-bold tracking-tight text-slate-900">
                                Outcome Forecast
                            </h1>
                        </div>
                        <p className="text-[12px] text-slate-600 font-medium max-w-xl">
                            Predicted pipeline outcomes based on stage-weighted probability modeling.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="h-10 border-slate-200 text-slate-600 font-medium bg-white px-4 rounded-none relative">
                                <Filter className="h-4 w-4 mr-2 text-slate-400" /> Filters
                                {activeFilterCount > 0 && (
                                    <Badge className="ml-2 bg-indigo-600 text-white border-none h-5 px-1.5 text-[10px] rounded-none">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-4 rounded-none border-slate-200 shadow-xl">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[13px] font-semibold">Forecast Filters</h4>
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="text-[11px] font-medium text-indigo-600 hover:underline"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-slate-500">Stage</label>
                                    <Select value={stageFilter} onValueChange={setStageFilter}>
                                        <SelectTrigger className="h-9 rounded-none border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Stages</SelectItem>
                                            {forecastModel.map(m => (
                                                <SelectItem key={m.stage} value={m.stage}>{m.stage}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase text-slate-500">Min Probability (%)</label>
                                    <Input
                                        name="minProb"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={minProb}
                                        onChange={(e) => setMinProb(e.target.value)}
                                        placeholder="0-100"
                                        className="h-9 rounded-none border-slate-200"
                                    />
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline" onClick={handleExport} className="h-10 border-slate-200 text-slate-600 font-medium bg-white px-4 rounded-none">
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Export CSV
                    </Button>
                    <Button
                        onClick={handleRunAI}
                        disabled={isRunningAI}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 shadow-sm border-none disabled:opacity-50 rounded-none"
                    >
                        {isRunningAI ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                        {isRunningAI ? "Processing..." : "Run Prediction AI"}
                    </Button>
                </div>
            </div>

            {/* Core Forecasting Metrics (colorful) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <Card className="border border-indigo-100 shadow-sm ring-0 rounded-none bg-indigo-50 p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-200 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
                        <DollarSign size={150} />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-500 text-white font-bold h-5 px-1.5 rounded-none text-[9px] border-none">AI Confidence: 92%</Badge>
                            </div>
                            <p className="text-[11px] font-medium text-slate-500 mt-2">Weighted forecast value</p>
                            <h3 className="text-[42px] font-bold tracking-tight tabular-nums leading-none text-indigo-600">
                                {formatter.format(weightedForecastValue)}
                            </h3>
                        </div>
                        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-medium block">Total pipeline</span>
                                <span className="text-[18px] font-semibold text-slate-900 tracking-tight">{formatter.format(totalPipelineValue)}</span>
                            </div>
                            <div className="h-10 w-px bg-slate-200" />
                            <div className="space-y-1 text-right">
                                <span className="text-[10px] text-slate-400 font-medium block">Efficiency</span>
                                <span className="text-[18px] font-semibold text-emerald-600 tracking-tight">
                                    {totalPipelineValue > 0 ? ((weightedForecastValue / totalPipelineValue) * 100).toFixed(1) : "0"}%
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="border border-emerald-100 shadow-sm rounded-none bg-emerald-50 p-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[11px] font-medium text-emerald-600 leading-none">Expected closures</p>
                            <h3 className="text-[28px] font-bold text-emerald-900 leading-none">24 Deals</h3>
                        </div>
                        <div className="p-3 rounded-none bg-white text-emerald-600 border border-emerald-100">
                            <Briefcase size={24} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] font-semibold text-emerald-700">Goal progress (Q1)</span>
                            <span className="text-[12px] font-bold text-emerald-700">85% Achieved</span>
                        </div>
                        <Progress value={85} className="h-2.5 bg-emerald-100" />
                    </div>
                    <div className="pt-4 flex items-center gap-2 text-[12px] font-medium text-emerald-700 leading-relaxed">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        You are on track to beat your quarterly target by <span className="font-bold text-emerald-600">$54k</span>.
                    </div>
                </Card>

                <Card className="border border-amber-100 shadow-sm rounded-none bg-amber-50 p-8 flex flex-col justify-center">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-[16px] font-bold text-amber-900">Quota Burn Down</CardTitle>
                    </CardHeader>
                    <div className="space-y-6">
                        <div className="flex items-end justify-between">
                            <div className="space-y-1">
                                <span className="text-[11px] font-medium text-amber-600">Quota remaining</span>
                                <div className="text-[24px] font-bold text-amber-900">$105k</div>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] font-medium text-emerald-600 bg-white px-2 py-1 rounded-none border border-emerald-100">22 days left</span>
                            </div>
                        </div>
                        <div className="h-3 w-full bg-amber-100 rounded-none overflow-hidden flex">
                            <div className="h-full bg-amber-600 w-[78%] border-r border-white/30" />
                            <div className="h-full bg-amber-300 w-[12%] border-r border-white/30 animate-pulse" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Stage Weighting Model */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-none overflow-hidden">
                    <CardHeader className="p-6 border-b border-slate-50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-[16px] font-bold text-slate-900">Weighted Probability Model</CardTitle>
                            <CardDescription className="text-[12px] font-medium mt-1">Calculation based on historical stage-to-win conversions</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAdjustOpen(true)}
                            className="h-8 border-slate-200 text-[11px] font-medium rounded-none"
                        >
                            <SlidersHorizontal className="h-3 w-3 mr-1.5" /> Adjust probabilities
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-left text-[11px] font-medium text-slate-400">Lifecycle stage</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-medium text-slate-400">Active deals</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-medium text-slate-400">Raw value</th>
                                        <th className="px-6 py-4 text-center text-[11px] font-medium text-slate-400">Win probability</th>
                                        <th className="px-6 py-4 text-right text-[11px] font-medium text-slate-400">Weighted projection</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredModel.length > 0 ? filteredModel.map((m, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                                    <span className="text-[14px] font-bold text-slate-900">{m.stage}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-[14px] font-bold text-slate-600">{m.volume}</td>
                                            <td className="px-6 py-4 text-center text-[14px] font-bold text-slate-700">{formatter.format(m.value)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 h-6 px-2 font-bold text-[10px] rounded-none">
                                                    {m.prob}%
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right bg-slate-50/20">
                                                <span className="text-[15px] font-bold text-indigo-600 tabular-nums tracking-tight">
                                                    {formatter.format(m.weighted)}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-[12px] font-medium text-slate-400">
                                                No stages match your filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot className="bg-slate-50/80">
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-right text-[12px] font-bold text-slate-500">Aggregate weighted total</td>
                                        <td className="px-6 py-4 text-right text-[20px] font-bold text-indigo-700 tabular-nums tracking-tight">
                                            {formatter.format(weightedForecastValue)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Projections */}
                <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100 rounded-none overflow-hidden">
                    <CardHeader className="p-6 bg-slate-50/50">
                        <CardTitle className="text-[16px] font-bold text-slate-900">Projected vs Actual</CardTitle>
                        <CardDescription className="text-[12px] font-medium leading-none mt-2">H1 2026 performance trajectory</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MONTHLY_PROJECTION}>
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="projected" fill="#e2e8f0" radius={[0, 0, 0, 0]} />
                                    <Bar dataKey="actual" fill="#6366f1" radius={[0, 0, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-none bg-indigo-50 border border-indigo-100">
                                <TrendingUp className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold text-indigo-900">Upside Potential Identified</p>
                                    <p className="text-[11px] font-medium text-indigo-700 leading-relaxed">
                                        Closing 20% more deals in 'Qualified' stage could add <span className="font-bold underline">$114,000</span> to this month's revenue outcome.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => toast({ title: "Calculation Method", description: "Weighted = Raw value × Win probability per stage." })}
                                className="flex items-center justify-between w-full group cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4 text-slate-300 group-hover:text-indigo-500" />
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">How is this calculated?</span>
                                </div>
                                <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500" />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AdjustProbabilitiesSheet
                open={adjustOpen}
                onClose={() => setAdjustOpen(false)}
                initial={forecastModel}
                onSave={handleSaveProbabilities}
            />
        </div>
    )
}
