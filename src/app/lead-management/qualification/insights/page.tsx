"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Target,
    Zap,
    TrendingUp,
    TrendingDown,
    Activity,
    Users,
    ChevronLeft,
    Lightbulb,
    ArrowUpRight,
    Search,
    Filter,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    Settings2,
    BarChart,
    BrainCircuit,
    Gauge,
    ExternalLink
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Progress } from "@/shared/components/ui/progress"

// --- Mock Data: Insights ---
const TOP_INSIGHTS = [
    {
        id: "1",
        title: "Score vs. Conversion Correlation",
        observation: "Leads with score 65+ convert at 38%, which is 4x the baseline.",
        action: "Focus BDR efforts exclusively on 60+ band for next 14 days.",
        impact: "High",
        type: "Efficiency"
    },
    {
        id: "2",
        title: "Behavioral Leakage Detected",
        observation: "42% of High Score leads are stuck in 'Pending Response' for > 48hrs.",
        action: "Automate fallback routing for unresponded high-score leads.",
        impact: "Critical",
        type: "Operational"
    },
    {
        id: "3",
        title: "Predictive model mismatch",
        observation: "Score band 40-50 shows higher actual win rate than 50-60 in APAC region.",
        action: "Recalibrate region-based weightage for APAC geography.",
        impact: "Medium",
        type: "Intelligence"
    }
]

export default function QualificationInsightsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
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
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                                <BrainCircuit className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Qualification Insights
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            AI-driven analysis of your scoring model's actual predictivity. Identify bottlenecks and conversion anomalies.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Settings2 className="h-4 w-4 mr-2 text-slate-400" /> Model Settings
                    </Button>
                    <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Zap className="h-4 w-4 mr-2" text-amber-200 fill-amber-200 /> Optimize Model
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Predictivity Matrix */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden">
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
                                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                        <p className="text-[10px] font-semibold text-slate-400 tracking-wider font-semibold">{b.label} Band</p>
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

                            <div className="mt-8 p-6 rounded-2xl bg-indigo-50 text-slate-900 flex items-center justify-between border border-indigo-100">
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
                        <h2 className="text-[16px] font-semibold text-slate-900 px-2 flex items-center gap-2">
                            Strategy Observations <Badge className="bg-indigo-50 text-indigo-600 border-none px-2 h-5 text-[10px] font-semibold">3 Active</Badge>
                        </h2>
                        <div className="grid grid-cols-1 gap-4">
                            {TOP_INSIGHTS.map((insight) => (
                                <Card key={insight.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white overflow-hidden group hover:ring-indigo-100 transition-all">
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
                                                <Button size="sm" className="h-8 bg-slate-900 hover:bg-black text-[11px] font-semibold rounded-lg px-4">Apply Fix</Button>
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
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-[16px] font-semibold text-slate-900">Conversion Velocity</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {[
                                { label: "Lead to MQL", value: "4.2 Days", trend: "-12%", color: "text-emerald-500" },
                                { label: "MQL to SQL", value: "12.8 Days", trend: "+5%", color: "text-rose-500" },
                                { label: "SQL to Close", value: "32 Days", trend: "0%", color: "text-slate-400" },
                            ].map((v, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50/50">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-semibold text-slate-400 tracking-wider">{v.label}</p>
                                        <h4 className="text-[18px] font-semibold text-slate-900 tabular-nums">{v.value}</h4>
                                    </div>
                                    <div className={`text-[11px] font-semibold ${v.color}`}>{v.trend}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-emerald-50 text-slate-900 p-6 space-y-5">
                        <div className="flex justify-between items-start">
                            <div className="p-2.5 rounded-xl bg-white border border-emerald-100 text-emerald-600 shadow-sm">
                                <Gauge size={24} />
                            </div>
                            <Badge className="bg-emerald-100 border-none text-[9px] font-semibold text-emerald-700 px-2 uppercase">Live Optimization</Badge>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[16px] font-semibold text-slate-900">Dynamic Weightage is ON</h4>
                            <p className="text-[12px] text-slate-500 leading-relaxed font-medium">
                                System is auto-adjusting weights based on the last 500 wins across the US-EAST territory.
                            </p>
                        </div>
                        <Button variant="ghost" className="w-full text-emerald-600 font-semibold text-[11px] h-9 border border-emerald-100 hover:bg-emerald-100/50 uppercase tracking-wider">
                            Review Adjustments <ArrowRight size={14} className="ml-2" />
                        </Button>
                    </Card>

                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                        <h4 className="text-[14px] font-semibold text-slate-900 flex items-center gap-2">
                            <TrendingUp size={16} className="text-emerald-500" /> Top Performer Segment
                        </h4>
                        <div className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2.5">
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

        </div>
    )
}
