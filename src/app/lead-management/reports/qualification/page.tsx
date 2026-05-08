"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Target,
    Activity,
    ChevronLeft,
    Calendar,
    Download,
    Share2,
    Filter,
    CheckCircle2,
    Zap,
    Scale,
    Layers,
    Flame,
    Users,
    TrendingUp,
    Star,
    ShieldAlert,
    GitBranch,
    LayoutGrid,
    BarChart3,
    PieChart as PieChartIcon,
    UserCheck,
    X
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    LineChart,
    Line,
} from "recharts"

const SCORE_DISTRIBUTION = [
    { band: "0-20 (Cold)", count: 1240, color: "#94a3b8" },
    { band: "20-40 (Warm)", count: 1850, color: "#6366f1" },
    { band: "40-60 (Hot)", count: 920, color: "#8b5cf6" },
    { band: "60-80 (SQL Ready)", count: 420, color: "#f59e0b" },
    { band: "80-100 (Instant Sale)", count: 210, color: "#10b981" },
]

const CONVERSION_BY_BAND = [
    { band: "Cold", leads: 400, converted: 2 },
    { band: "Warm", leads: 600, converted: 18 },
    { band: "Hot", leads: 300, converted: 42 },
    { band: "SQL Ready", leads: 150, converted: 64 },
]

export default function QualificationReportsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [showCalibForm, setShowCalibForm] = useState(false)
    const [signalName, setSignalName] = useState("")
    const [signalWeight, setSignalWeight] = useState("")
    const [thresholdScore, setThresholdScore] = useState("")
    const [calibErrors, setCalibErrors] = useState<{ name?: string; weight?: string; threshold?: string }>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleCalibration = () => {
        const newErrors: { name?: string; weight?: string; threshold?: string } = {}
        if (!signalName.trim()) newErrors.name = "Signal name is required"
        else if (signalName.trim().length < 3) newErrors.name = "Name must be at least 3 characters"
        if (!signalWeight.trim()) newErrors.weight = "Weight is required"
        else if (!/^\d+(\.\d+)?$/.test(signalWeight) || parseFloat(signalWeight) < 0 || parseFloat(signalWeight) > 100) newErrors.weight = "Weight must be 0-100"
        if (!thresholdScore.trim()) newErrors.threshold = "Threshold score is required"
        else if (!/^\d+$/.test(thresholdScore) || parseInt(thresholdScore) < 0 || parseInt(thresholdScore) > 100) newErrors.threshold = "Threshold must be 0-100"

        if (Object.keys(newErrors).length) {
            setCalibErrors(newErrors)
            return
        }
        setCalibErrors({})
        toast({ title: "Model Calibrated", description: `Signal "${signalName}" weight set to ${signalWeight}% with threshold ${thresholdScore}.` })
        setSignalName("")
        setSignalWeight("")
        setThresholdScore("")
        setShowCalibForm(false)
    }

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }}>
            <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-emerald-50 p-6 rounded-none border border-emerald-100 shadow-sm">
                    <div className="space-y-3">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-600">
                            <ChevronLeft className="h-3 w-3 mr-1" /> Back
                        </Button>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white text-emerald-600 border border-emerald-100 shadow-sm">
                                    <UserCheck size={20} />
                                </div>
                                <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                    Lead Qualification & Scoring Index
                                </h1>
                            </div>
                            <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                                Measuring the precision of your scoring engine. Analyze how well intent scoring predicts pipeline conversion and revenue.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={() => toast({ title: "Scoring Audit", description: "Reviewing signal weights and model accuracy." })} variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                            <ShieldAlert className="h-4 w-4 mr-2 text-slate-400" /> Scoring Audit
                        </Button>
                        <Button onClick={() => setShowCalibForm(true)} className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 shadow-emerald-100 shadow-lg border-none">
                            <TrendingUp className="h-4 w-4 mr-2" /> Calibration Hub
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Active Inventory by Intent Score</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Population count per score tier across the entire lead database.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] px-2 h-5 uppercase tracking-wider">Scoring Active</Badge>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={SCORE_DISTRIBUTION}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="band" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '0', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="count" radius={[0, 0, 0, 0]} barSize={50}>
                                        {SCORE_DISTRIBUTION.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white p-8 space-y-8 flex flex-col">
                            <div className="space-y-1">
                                <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Scoring Accuracy</h3>
                                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest leading-tight">Confidence in intent prediction</p>
                            </div>

                            <div className="space-y-6 flex-1">
                                {[
                                    { label: "High Intent Fidelity", val: 94, color: "bg-emerald-500" },
                                    { label: "Spam Detection Index", val: 88, color: "bg-indigo-500" },
                                    { label: "MQL Conversion Rate", val: 42, color: "bg-amber-500" },
                                ].map((s, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            <span>{s.label}</span>
                                            <span className="text-slate-900">{s.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className={`h-full ${s.color}`} style={{ width: `${s.val}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-50">
                                <div className="flex items-start gap-4 p-4 rounded-none bg-indigo-50 border border-indigo-100/50">
                                    <div className="p-2 rounded-lg bg-white text-indigo-600 shadow-sm">
                                        <Zap size={18} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[12px] font-bold text-indigo-900">Engine Tip</p>
                                        <p className="text-[11px] text-indigo-700 leading-relaxed italic">"Leads in the 60-80 band are converting 12% better since adding the 'Job Title' weight."</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-slate-900 text-white p-8 space-y-4 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Star size={120} />
                            </div>
                            <h4 className="text-[16px] font-black tracking-tighter">Precision Alert</h4>
                            <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
                                <strong>"Warm"</strong> leads (20-40) from LinkedIn Ads are converting <strong>no better</strong> than "Cold" leads. Consider reducing weight for LinkedIn Referral activity.
                            </p>
                            <Button onClick={() => toast({ title: "Recalibrating", description: "Adjusting scoring weights for LinkedIn source signals." })} className="w-full h-10 bg-white text-slate-900 hover:bg-slate-100 font-black text-[11px] uppercase tracking-widest rounded-xl border-none">
                                Recalibrate Logic
                            </Button>
                        </Card>
                    </div>

                    <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Qualification Yield by Score Tier</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Validating if higher scores correlate with successful conversions.</p>
                            </div>
                            <Button onClick={() => toast({ title: "Deep Correlation", description: "Building visual correlation map across all score tiers." })} variant="outline" size="sm" className="h-8 border-slate-100 text-[11px] font-black uppercase tracking-widest px-4">Deep Correlation Map</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {CONVERSION_BY_BAND.map((band, i) => (
                                <div key={i} className="p-6 rounded-none bg-slate-50 border border-slate-200/50 space-y-6 relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                                        <Target size={64} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{band.band} Tier</p>
                                        <h4 className="text-[24px] font-black text-slate-900">{((band.converted / band.leads) * 100).toFixed(1)}% Yield</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end text-[10px] font-bold">
                                            <span className="text-slate-500">CONVERTED / TOTAL</span>
                                            <span className="text-slate-900">{band.converted} / {band.leads}</span>
                                        </div>
                                        <div className="flex gap-1 h-1.5">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(band.converted / band.leads) * 100}%` }} />
                                            <div className="flex-1 h-full bg-slate-200 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>

            </div>

            {/* Right Slide-in Calibration Form */}
            {showCalibForm && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowCalibForm(false)} />
                    <div className="relative h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-[18px] font-bold text-slate-900">Calibration Hub</h3>
                                <p className="text-[12px] text-slate-500">Tune signal weights for the scoring engine</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowCalibForm(false)} className="h-9 w-9 text-slate-400 hover:text-slate-900">
                                <X size={18} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Signal Name <span className="text-rose-500">*</span></label>
                                <Input
                                    type="text"
                                    value={signalName}
                                    onChange={(e) => { setSignalName(e.target.value); if (calibErrors.name) setCalibErrors({ ...calibErrors, name: undefined }) }}
                                    placeholder="e.g. Job Title Match"
                                    className={calibErrors.name ? "border-rose-500" : ""}
                                />
                                {calibErrors.name && <p className="text-[11px] text-rose-500 font-medium">{calibErrors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Weight (0-100%) <span className="text-rose-500">*</span></label>
                                <Input
                                    type="number"
                                    value={signalWeight}
                                    onChange={(e) => { setSignalWeight(e.target.value); if (calibErrors.weight) setCalibErrors({ ...calibErrors, weight: undefined }) }}
                                    placeholder="e.g. 25"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className={calibErrors.weight ? "border-rose-500" : ""}
                                />
                                {calibErrors.weight && <p className="text-[11px] text-rose-500 font-medium">{calibErrors.weight}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">SQL Threshold Score <span className="text-rose-500">*</span></label>
                                <Input
                                    type="number"
                                    value={thresholdScore}
                                    onChange={(e) => { setThresholdScore(e.target.value); if (calibErrors.threshold) setCalibErrors({ ...calibErrors, threshold: undefined }) }}
                                    placeholder="e.g. 60"
                                    min="0"
                                    max="100"
                                    className={calibErrors.threshold ? "border-rose-500" : ""}
                                />
                                {calibErrors.threshold && <p className="text-[11px] text-rose-500 font-medium">{calibErrors.threshold}</p>}
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button variant="outline" onClick={() => setShowCalibForm(false)} className="flex-1">Cancel</Button>
                            <Button onClick={handleCalibration} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">Calibrate</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
