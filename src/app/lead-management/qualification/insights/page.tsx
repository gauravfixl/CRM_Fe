"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Zap,
    TrendingUp,
    Users,
    ChevronLeft,
    Lightbulb,
    ArrowRight,
    Search,
    Filter,
    AlertCircle,
    Settings2,
    BrainCircuit,
    Gauge,
    CheckCircle2,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"

const INITIAL_INSIGHTS = [
    {
        id: "1",
        title: "Score vs. Conversion Correlation",
        observation: "Leads with score 65+ convert at 38%, which is 4x the baseline.",
        action: "Focus BDR efforts exclusively on 60+ band for next 14 days.",
        impact: "High",
        type: "Efficiency",
        applied: false
    },
    {
        id: "2",
        title: "Behavioral Leakage Detected",
        observation: "42% of High Score leads are stuck in 'Pending Response' for > 48hrs.",
        action: "Automate fallback routing for unresponded high-score leads.",
        impact: "Critical",
        type: "Operational",
        applied: false
    },
    {
        id: "3",
        title: "Predictive model mismatch",
        observation: "Score band 40-50 shows higher actual win rate than 50-60 in APAC region.",
        action: "Recalibrate region-based weightage for APAC geography.",
        impact: "Medium",
        type: "Intelligence",
        applied: false
    }
]

type Settings = {
    sensitivity: string
    autoOptimize: boolean
    minSampleSize: number
}

export default function QualificationInsightsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [insights, setInsights] = useState(INITIAL_INSIGHTS)
    const [searchTerm, setSearchTerm] = useState("")
    const [impactFilter, setImpactFilter] = useState("all")
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isOptimizing, setIsOptimizing] = useState(false)
    const [settings, setSettings] = useState<Settings>({ sensitivity: "Medium", autoOptimize: true, minSampleSize: 100 })
    const [draftSettings, setDraftSettings] = useState<Settings>(settings)
    const [errors, setErrors] = useState<{ minSampleSize?: string }>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const filteredInsights = useMemo(() => {
        return insights.filter(i => {
            const term = searchTerm.toLowerCase()
            const matchSearch = !term ||
                i.title.toLowerCase().includes(term) ||
                i.observation.toLowerCase().includes(term) ||
                i.type.toLowerCase().includes(term)
            const matchImpact = impactFilter === "all" || i.impact === impactFilter
            return matchSearch && matchImpact
        })
    }, [insights, searchTerm, impactFilter])

    const applyFix = (id: string) => {
        setInsights(prev => prev.map(i => i.id === id ? { ...i, applied: true } : i))
        toast({ title: "Fix Applied", description: "Recommended action has been queued for execution." })
    }

    const handleOptimize = () => {
        setIsOptimizing(true)
        toast({ title: "Optimizing Model", description: "Recalibrating weights based on win history..." })
        setTimeout(() => {
            setIsOptimizing(false)
            toast({ title: "Optimization Complete", description: "Model variance reduced to ±2.8%." })
        }, 2000)
    }

    const validateSettings = (): boolean => {
        const e: { minSampleSize?: string } = {}
        if (!draftSettings.minSampleSize) e.minSampleSize = "Min sample size is required"
        else if (draftSettings.minSampleSize < 10) e.minSampleSize = "Sample size must be at least 10"
        else if (draftSettings.minSampleSize > 10000) e.minSampleSize = "Sample size cannot exceed 10,000"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const saveSettings = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!validateSettings()) return
        setSettings(draftSettings)
        setIsSettingsOpen(false)
        toast({ title: "Settings Saved", description: "Model preferences updated." })
    }

    const openSettings = () => {
        setDraftSettings(settings)
        setErrors({})
        setIsSettingsOpen(true)
    }

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header — colorful light fill */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-indigo-50 p-6 border border-indigo-100 shadow-sm">
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
                            <div className="p-2 rounded-lg bg-white text-indigo-600 border border-indigo-100">
                                <BrainCircuit className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Qualification Insights
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            AI-driven analysis of your scoring model's actual predictivity. Identify bottlenecks and conversion anomalies.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={openSettings}
                        className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5"
                    >
                        <Settings2 className="h-4 w-4 mr-2 text-slate-400" /> Model Settings
                    </Button>
                    <Button
                        onClick={handleOptimize}
                        disabled={isOptimizing}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none"
                    >
                        <Zap className="h-4 w-4 mr-2 text-amber-200 fill-amber-200" /> {isOptimizing ? "Optimizing..." : "Optimize Model"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Predictivity Matrix */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden">
                        <CardHeader className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-[18px] font-semibold">Predictivity Benchmarking</CardTitle>
                                    <CardDescription className="text-[12px] font-medium text-slate-400">Actual Win-Rate vs. Score-Based Prediction.</CardDescription>
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-semibold text-[10px] px-2 h-6">Model Variance: ±4%</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
                                {[
                                    { label: "0 - 20", actual: "2%", predict: "3%", status: "Good" },
                                    { label: "21 - 40", actual: "8%", predict: "7%", status: "Good" },
                                    { label: "41 - 60", actual: "18%", predict: "22%", status: "Review" },
                                    { label: "61 - 100", actual: "44%", predict: "42%", status: "Excellent" },
                                ].map((b, i) => (
                                    <div key={i} className="p-4 bg-slate-50 border border-slate-100 space-y-3">
                                        <p className="text-[10px] font-semibold text-slate-500 tracking-wider">{b.label} Band</p>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-end">
                                                <h4 className="text-[20px] font-semibold text-slate-900 tracking-tight">{b.actual}</h4>
                                                <span className="text-[11px] font-semibold text-slate-400 mb-1">Actual</span>
                                            </div>
                                            <Progress value={parseInt(b.actual)} className="h-1.5 bg-white [&>div]:bg-indigo-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-semibold text-slate-400">Predicted: {b.predict}</span>
                                            <Badge className={`h-4 text-[8px] font-semibold px-1 ${b.status === 'Review' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'} border-none uppercase`}>{b.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-indigo-50 text-slate-900 flex items-center justify-between border border-indigo-100">
                                <div className="space-y-1">
                                    <h4 className="text-[16px] font-semibold text-indigo-600">Global Predictivity Score</h4>
                                    <p className="text-[12px] text-slate-600 font-medium">Your current qualification framework is highly predictive of revenue.</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] font-semibold text-indigo-400 uppercase">Confidence</p>
                                        <h3 className="text-[24px] font-semibold tracking-tight text-slate-900">92.4%</h3>
                                    </div>
                                    <div className="h-12 w-12 rounded-full border-4 border-indigo-600/30 flex items-center justify-center relative">
                                        <div className="absolute inset-0 border-4 border-indigo-500 rounded-full" style={{ clipPath: 'polygon(0 0, 92.4% 0, 92.4% 100%, 0% 100%)' }} />
                                        <span className="text-[10px] font-semibold">AI</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actionable Insights List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[16px] font-semibold text-slate-900 px-2 flex items-center gap-2">
                                Strategy Observations
                                <Badge className="bg-indigo-50 text-indigo-600 border-none px-2 h-5 text-[10px] font-semibold">
                                    {filteredInsights.length} Active
                                </Badge>
                            </h2>
                        </div>

                        {/* Filter / Search */}
                        <div className="flex items-center gap-3 bg-slate-50/50 p-2 border border-slate-100">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search insights..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 h-10 border-slate-100 bg-white text-[13px] rounded-lg focus-visible:ring-indigo-500"
                                />
                            </div>
                            <Select value={impactFilter} onValueChange={setImpactFilter}>
                                <SelectTrigger className="w-[160px] h-10 border-slate-100 bg-white font-semibold text-[12px] rounded-lg">
                                    <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Impacts</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {filteredInsights.length === 0 ? (
                                <div className="p-10 border-2 border-dashed border-slate-200 text-center">
                                    <p className="text-[13px] font-semibold text-slate-400">No insights match your filters.</p>
                                </div>
                            ) : filteredInsights.map((insight) => (
                                <Card key={insight.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden group hover:ring-indigo-100 transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${insight.impact === 'Critical' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                                                        {insight.impact === 'Critical' ? <AlertCircle size={18} /> : <Lightbulb size={18} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[15px] font-semibold text-slate-900">{insight.title}</h4>
                                                        <Badge variant="outline" className="h-5 text-[9px] font-semibold uppercase text-slate-400 border-slate-100">{insight.type}</Badge>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Observation</p>
                                                        <p className="text-[13px] font-medium text-slate-600 leading-relaxed">{insight.observation}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-semibold text-indigo-400 tracking-wider">Recommended Action</p>
                                                        <p className="text-[13px] font-semibold text-slate-900 leading-relaxed">{insight.action}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <Badge className={`
                                                    ${insight.impact === 'Critical' ? 'bg-rose-500' :
                                                        insight.impact === 'High' ? 'bg-indigo-500' :
                                                            'bg-slate-400'}
                                                    text-white border-none text-[9px] font-semibold px-2 h-5 uppercase
                                                `}>
                                                    {insight.impact}
                                                </Badge>
                                                {insight.applied ? (
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 h-7 text-[11px] font-semibold">
                                                        <CheckCircle2 size={12} className="mr-1.5" /> Applied
                                                    </Badge>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => applyFix(insight.id)}
                                                        className="h-8 bg-slate-900 hover:bg-black text-[11px] font-semibold rounded-lg px-4"
                                                    >
                                                        Apply Fix
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Side-bars */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-blue-50 overflow-hidden">
                        <CardHeader className="p-6 border-b border-blue-100">
                            <CardTitle className="text-[16px] font-semibold text-slate-900">Conversion Velocity</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 bg-white">
                            {[
                                { label: "Lead to MQL", value: "4.2 Days", trend: "-12%", color: "text-emerald-500" },
                                { label: "MQL to SQL", value: "12.8 Days", trend: "+5%", color: "text-rose-500" },
                                { label: "SQL to Close", value: "32 Days", trend: "0%", color: "text-slate-400" },
                            ].map((v, i) => (
                                <div key={i} className="flex justify-between items-center p-3 bg-slate-50/50">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-semibold text-slate-400 tracking-wider">{v.label}</p>
                                        <h4 className="text-[18px] font-semibold text-slate-900 tabular-nums">{v.value}</h4>
                                    </div>
                                    <div className={`text-[11px] font-semibold ${v.color}`}>{v.trend}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-emerald-100 rounded-none bg-emerald-50 text-slate-900 p-6 space-y-5">
                        <div className="flex justify-between items-start">
                            <div className="p-2.5 bg-white border border-emerald-100 text-emerald-600 shadow-sm">
                                <Gauge size={24} />
                            </div>
                            <Badge className="bg-emerald-100 border-none text-[9px] font-semibold text-emerald-700 px-2 uppercase">Live Optimization</Badge>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[16px] font-semibold text-slate-900">Dynamic Weightage is ON</h4>
                            <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                                System is auto-adjusting weights based on the last 500 wins across the US-EAST territory.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={() => toast({ title: "Adjustment Log", description: "Showing recent dynamic weight tweaks..." })}
                            className="w-full text-emerald-600 font-semibold text-[11px] h-9 border border-emerald-100 hover:bg-emerald-100/50 uppercase tracking-wider"
                        >
                            Review Adjustments <ArrowRight size={14} className="ml-2" />
                        </Button>
                    </Card>

                    <div className="p-6 bg-amber-50 border border-amber-100 space-y-4">
                        <h4 className="text-[14px] font-semibold text-slate-900 flex items-center gap-2">
                            <TrendingUp size={16} className="text-emerald-500" /> Top Performer Segment
                        </h4>
                        <div className="p-4 bg-white border border-amber-100 space-y-2.5">
                            <div className="flex items-center gap-3">
                                <Users size={14} className="text-slate-400" />
                                <span className="text-[12px] font-semibold text-slate-600">FinTech / Series B+</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-medium text-slate-500">Avg. Score</span>
                                <span className="text-[14px] font-semibold text-indigo-600">82</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-medium text-slate-500">Conversion Rate</span>
                                <span className="text-[14px] font-semibold text-emerald-500">52%</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Settings Side-drawer */}
            <SideFormSheet
                open={isSettingsOpen}
                onOpenChange={(o) => { setIsSettingsOpen(o); if (!o) setErrors({}) }}
                title="Model Settings"
                description="Tune predictive analytics behaviour."
                icon={<Settings2 size={18} />}
                onSubmit={saveSettings}
                submitLabel="Save Settings"
                accentColor="#4f46e5"
            >
                <div className="space-y-5">
                    <Field label="Sensitivity" required>
                        <Select value={draftSettings.sensitivity} onValueChange={v => setDraftSettings({ ...draftSettings, sensitivity: v })}>
                            <SelectTrigger className="h-11 rounded-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low — slow to adjust</SelectItem>
                                <SelectItem value="Medium">Medium — balanced</SelectItem>
                                <SelectItem value="High">High — fast adjustments</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Min Sample Size" required error={errors.minSampleSize} hint="Range: 10-10,000">
                        <Input
                            type="number"
                            min={10}
                            max={10000}
                            value={draftSettings.minSampleSize}
                            onChange={e => { setDraftSettings({ ...draftSettings, minSampleSize: parseInt(e.target.value) || 0 }); if (errors.minSampleSize) setErrors({}) }}
                            className="h-11 rounded-lg"
                        />
                    </Field>
                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100">
                        <div className="space-y-0.5">
                            <p className="text-[13px] font-semibold text-slate-700">Auto-Optimize</p>
                            <p className="text-[11px] text-slate-500">Apply recommended fixes automatically</p>
                        </div>
                        <Switch
                            checked={draftSettings.autoOptimize}
                            onCheckedChange={(c) => setDraftSettings({ ...draftSettings, autoOptimize: c })}
                            className="data-[state=checked]:bg-indigo-600"
                        />
                    </div>
                </div>
            </SideFormSheet>

        </div>
    )
}
