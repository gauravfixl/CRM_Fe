"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Activity,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    GitBranch,
    ShieldCheck,
    Box,
    CheckCircle2,
    Clock,
    Zap,
    Scale,
    ArrowRight,
    MousePointer2,
    Users,
    Target,
    BarChart3,
    Settings2,
    GitCommit,
    Layers,
    Info
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"

// --- Mock Data: Attribution Models ---
const ATTRIBUTION_MODELS = [
    {
        id: "1",
        name: "First-Touch Attribution",
        description: "Gives 100% of the credit to the first source the lead interacted with.",
        useCase: "Best for measuring Brand Awareness & Lead Gen efficiency.",
        status: "Active",
        popularity: 42
    },
    {
        id: "2",
        name: "Last-Touch Attribution",
        description: "Gives 100% of the credit to the last source before conversion.",
        useCase: "Best for identifying high-intent closing channels.",
        status: "Inactive",
        popularity: 18
    },
    {
        id: "3",
        name: "Linear Attribution",
        description: "Distributes credit equally across all touchpoints in the journey.",
        useCase: "Best for comprehensive journey mapping.",
        status: "Beta",
        popularity: 12
    },
    {
        id: "4",
        name: "Time-Decay Attribution",
        description: "Credit increases as touchpoints get closer to the conversion moment.",
        useCase: "Best for short sales cycles and urgent promos.",
        status: "Enterprise Only",
        popularity: 28
    },
]

export default function LeadAttributionPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [activeModel, setActiveModel] = useState("1")

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
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <GitBranch className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Lead Attribution Engine
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Decide which source gets credit for every conversion. Configure models to reflect your marketing strategy and sales cycle.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Initiating data comparison framework..." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <BarChart3 className="h-4 w-4 mr-2 text-slate-400" /> Comparison Lab
                    </Button>
                    <Button onClick={() => toast({ description: "Global configuration context loaded." })} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Settings2 className="h-4 w-4 mr-2" /> Global Setting
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Active Model & Configuration Area */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8 space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Attribution Model Selection</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Changing this will recalculate results across all performance dashboards.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Global Status</span>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-semibold text-[9px] px-2 h-5 uppercase tracking-wider">Syncing Live</Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {ATTRIBUTION_MODELS.map((model) => (
                                <div
                                    key={model.id}
                                    onClick={() => { setActiveModel(model.id); toast({ description: `Attribution engine updated to ${model.name}.` }) }}
                                    className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer group ${activeModel === model.id
                                        ? 'border-indigo-600 bg-indigo-50/20 shadow-lg shadow-indigo-100'
                                        : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2.5 rounded-2xl ${activeModel === model.id ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>
                                            {model.id === "1" ? <Target size={18} /> :
                                                model.id === "2" ? <MousePointer2 size={18} /> :
                                                    model.id === "3" ? <Layers size={18} /> :
                                                        <Clock size={18} />}
                                        </div>
                                        {activeModel === model.id && (
                                            <div className="h-5 w-5 bg-indigo-600 rounded-full flex items-center justify-center text-white ring-4 ring-white shadow-sm">
                                                <CheckCircle2 size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[15px] font-semibold text-slate-900">{model.name}</h4>
                                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-600 transition-colors">{model.description}</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-100/50 flex items-center justify-between">
                                        <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase shrink-0">Usage</span>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1 w-20 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${model.popularity}%` }} />
                                            </div>
                                            <span className="text-[10px] font-semibold text-slate-700">{model.popularity}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 rounded-2xl bg-indigo-50 text-indigo-900 space-y-4 shadow-sm border border-indigo-100">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-[13px] font-semibold tracking-tight">Attribution Logic Preview</h4>
                                <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-100 text-[9px] font-semibold uppercase">MODE: {ATTRIBUTION_MODELS.find(m => m.id === activeModel)?.name.split(' ')[0]}</Badge>
                            </div>
                            <div className="flex items-center gap-4 relative py-4">
                                <div className="absolute left-0 right-0 h-px bg-indigo-200 top-1/2 -z-0" />
                                {[
                                    { label: "Google Ad", val: "Credit: 100%", active: true },
                                    { label: "Direct", val: "Credit: 0%", active: false },
                                    { label: "Email", val: "Credit: 0%", active: false },
                                    { label: "Conversion", icon: CheckCircle2, active: true },
                                ].map((step, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-3 relative z-10">
                                        {step.icon ? (
                                            <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-indigo-50 shadow-md">
                                                <step.icon size={16} />
                                            </div>
                                        ) : (
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-semibold ring-4 ring-indigo-50 shadow-md ${step.active ? 'bg-indigo-600 text-white' : 'bg-white border border-indigo-200 text-indigo-400'}`}>
                                                0{i + 1}
                                            </div>
                                        )}
                                        <div className="text-center space-y-0.5">
                                            <p className="text-[11px] font-semibold">{step.label}</p>
                                            {step.val && <p className={`text-[9px] font-semibold uppercase tracking-wider ${step.active ? 'text-indigo-600' : 'text-slate-400'}`}>{step.val}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                                    <Clock size={20} />
                                </div>
                                <h4 className="text-[15px] font-semibold text-slate-900">Attribution Window</h4>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                    Define how long the platform remembers a touchpoint before it expires.
                                </p>
                                <Select defaultValue="30">
                                    <SelectTrigger className="rounded-xl border-slate-100 font-semibold text-[13px] h-10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="24h">24 Hours</SelectItem>
                                        <SelectItem value="7">7 Days</SelectItem>
                                        <SelectItem value="30">30 Days (Standard)</SelectItem>
                                        <SelectItem value="90">90 Days (Enterprise)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                                    <Scale size={20} />
                                </div>
                                <h4 className="text-[15px] font-semibold text-slate-900">Custom Weighting</h4>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                    Assign specific credit percentages to key events like "Demo Requested".
                                </p>
                                <Button variant="outline" onClick={() => toast({ description: "Opening custom routing weights interface..." })} className="w-full h-10 border-slate-100 text-[11px] font-semibold uppercase tracking-widest rounded-xl hover:bg-slate-50">
                                    Build Custom Model
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Attribution Health Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Engine Integrity</h4>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            {[
                                { label: "Multi-Touch Visibility", val: 100, status: "Healthy" },
                                { label: "Cookie Integrity", val: 82, status: "Warning" },
                                { label: "Mobile Cross-Tracking", val: 64, status: "Action Required" },
                            ].map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[11px] font-semibold">
                                        <span className="text-slate-500">{s.label}</span>
                                        <span className={s.status === 'Healthy' ? 'text-emerald-600' : s.status === 'Warning' ? 'text-amber-500' : 'text-rose-500'}>{s.val}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className={`h-full ${s.status === 'Healthy' ? 'bg-indigo-600' : s.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${s.val}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-emerald-50 text-emerald-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-500 transition-transform group-hover:scale-110">
                            <GitCommit size={120} />
                        </div>
                        <h4 className="text-[15px] font-semibold underline decoration-emerald-200 decoration-2 underline-offset-4 relative z-10">Identity Stitching</h4>
                        <p className="text-[12px] text-emerald-700 font-medium leading-relaxed relative z-10">
                            Merge and resolve identities across multiple devices (Desktop, Mobile) to ensure a single journey trace.
                        </p>
                        <Button onClick={() => toast({ description: "Stitching service is compiling nodes." })} className="w-full h-10 bg-white text-emerald-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-widest rounded-xl border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-10">
                            Setup Stitching
                        </Button>
                    </Card>

                    <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-white text-indigo-600 border border-indigo-200 shadow-sm">
                            <Info size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-indigo-900">Model Impact</p>
                            <p className="text-[11px] text-indigo-700 font-medium leading-relaxed italic">
                                "Switching to Last-Touch will likely increase 'Meta Ads' attribution by 24% while decreasing 'Organic' by 12%."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
