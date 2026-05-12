"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Clock,
    Flame,
    Activity,
    ChevronLeft,
    Calendar,
    Download,
    Filter,
    ArrowUpRight,
    TrendingUp,
    AlertCircle,
    Zap,
    Scale,
    Layers,
    UserX,
    Briefcase,
    Search,
    Thermometer,
    Compass,
    Timer,
    X
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from "recharts"

const STAGE_AGING_DATA = [
    { stage: "Discovery", avgDays: 4.2, stuckCount: 124 },
    { stage: "Qualified", avgDays: 12.8, stuckCount: 85 },
    { stage: "Proposal", avgDays: 18.5, stuckCount: 42 },
    { stage: "Negotiation", avgDays: 24.1, stuckCount: 68 },
    { stage: "Contracting", avgDays: 8.4, stuckCount: 12 },
]

const STUCK_THRESHOLD_DATA = [
    { label: "Fresh (< 5 Days)", count: 2400, color: "#10b981", bg: "bg-emerald-50" },
    { label: "Stagnant (5-15 Days)", count: 1200, color: "#f59e0b", bg: "bg-amber-50" },
    { label: "Aging (15-30 Days)", count: 650, color: "#f43f5e", bg: "bg-rose-50" },
    { label: "Critical (> 30 Days)", count: 390, color: "#991b1b", bg: "bg-red-50" },
]

export default function AgingBottleneckPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [showDiagForm, setShowDiagForm] = useState(false)
    const [diagStage, setDiagStage] = useState("Negotiation")
    const [diagThreshold, setDiagThreshold] = useState("")
    const [diagAction, setDiagAction] = useState("")
    const [diagErrors, setDiagErrors] = useState<{ stage?: string; threshold?: string; action?: string }>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleDiagnose = () => {
        const newErrors: { stage?: string; threshold?: string; action?: string } = {}
        if (!diagStage) newErrors.stage = "Stage is required"
        if (!diagThreshold.trim()) newErrors.threshold = "Threshold is required"
        else if (!/^\d+$/.test(diagThreshold) || parseInt(diagThreshold) <= 0) newErrors.threshold = "Enter a positive integer"
        if (!diagAction.trim()) newErrors.action = "Recommended action is required"
        else if (diagAction.trim().length < 5) newErrors.action = "Action must be at least 5 characters"

        if (Object.keys(newErrors).length) {
            setDiagErrors(newErrors)
            return
        }
        setDiagErrors({})
        toast({ title: "Diagnostic Run", description: `Stage: ${diagStage}, threshold ${diagThreshold} days. Action: ${diagAction}` })
        setDiagAction("")
        setDiagThreshold("")
        setShowDiagForm(false)
    }

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }}>
            <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-orange-50 p-6 rounded-none border border-orange-100 shadow-sm">
                    <div className="space-y-3">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-orange-600">
                            <ChevronLeft className="h-3 w-3 mr-1" /> Back
                        </Button>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white text-orange-600 border border-orange-100 shadow-sm">
                                    <Timer className="h-5 w-5" />
                                </div>
                                <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                    Aging & Bottleneck Diagnostics
                                </h1>
                            </div>
                            <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                                Identifying where your pipeline is losing momentum. Audit high-friction stages and stuck leads before they become dead inventory.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={() => toast({ title: "Heatmap View", description: "Switching to visual aging heatmap mode." })} variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                            <Thermometer className="h-4 w-4 mr-2 text-rose-400" /> Heatmap View
                        </Button>
                        <Button onClick={() => setShowDiagForm(true)} className="h-10 bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 shadow-orange-100 shadow-lg border-none">
                            <Activity className="h-4 w-4 mr-2" /> Diagnose Pipeline
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Lead Inventory Aging Threshhold</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Population distribution based on time since last meaningful activity.</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                                <Flame size={24} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {STUCK_THRESHOLD_DATA.map((t, i) => (
                                <Card key={i} className={`border-none shadow-none ring-1 ring-slate-100 rounded-none ${t.bg} p-6 space-y-4`}>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.label}</p>
                                        <h4 className="text-[28px] font-black text-slate-900">{t.count.toLocaleString()}</h4>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/70 rounded-full overflow-hidden">
                                        <div className="h-full" style={{ backgroundColor: t.color, width: `${(t.count / 3000) * 100}%` }} />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </Card>

                    <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-8">
                        <div className="space-y-1 mb-8">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Average Days in Stage</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Identifying structural bottlenecks where leads spend the most time.</p>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={STAGE_AGING_DATA} margin={{ top: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#475569' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '0', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="avgDays" radius={[0, 0, 0, 0]} barSize={40}>
                                        {STAGE_AGING_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.avgDays > 15 ? '#f43f5e' : entry.avgDays > 10 ? '#f59e0b' : '#6366f1'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <Card className="lg:col-span-4 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white p-8 space-y-8 flex flex-col">
                        <div className="space-y-1">
                            <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Stuck Leads Alert</h3>
                            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest leading-tight">Leads {`>`} 14 days without activity</p>
                        </div>

                        <div className="space-y-6 flex-1">
                            {STAGE_AGING_DATA.slice(0, 4).map((s, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[12px] font-black text-slate-900">{s.stage}</span>
                                            <span className="text-[10px] font-bold text-slate-400">Aging: {s.avgDays} days avg.</span>
                                        </div>
                                        <Badge className="bg-rose-50 text-rose-600 border-none font-black text-[9px] h-4">{s.stuckCount} leads</Badge>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500" style={{ width: `${(s.stuckCount / 150) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-indigo-600 text-white p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white/10">
                                    <AlertCircle size={20} />
                                </div>
                                <h4 className="text-[14px] font-bold">Health Protocol</h4>
                            </div>
                            <p className="text-[11px] text-indigo-100/70 leading-relaxed font-medium">
                                Enabling "Auto-Reassignment" for leads that exceed 21 days in Negotiation could save 12% of at-risk revenue.
                            </p>
                            <Button onClick={() => toast({ title: "Protocol Enforced", description: "Auto-reassignment rule activated for stuck leads > 21 days." })} className="w-full h-9 bg-white text-indigo-600 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest rounded-xl border-none">
                                Enforce Protocol
                            </Button>
                        </Card>
                    </Card>

                    <div className="lg:col-span-12">
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-slate-900 text-white p-8 relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 p-12 opacity-5 scale-150">
                                <Compass size={200} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                                <div className="space-y-6">
                                    <div className="p-3 rounded-2xl bg-rose-500 w-fit">
                                        <AlertCircle size={28} className="text-white" />
                                    </div>
                                    <h3 className="text-[28px] font-black tracking-tighter leading-tight">Critical Bottleneck: Negotiation Phase</h3>
                                    <p className="text-[15px] text-slate-400 font-medium leading-relaxed">
                                        <strong>68 leads</strong> are stuck in the Negotiation stage for an average of <strong>24.1 days</strong>. This is 42% longer than the company average. Recommended action: Audit contract templates and legal approval response times.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <Button onClick={() => toast({ title: "Audit Initiated", description: "Running diagnostic on Negotiation stage contracts." })} className="h-11 bg-white text-slate-900 hover:bg-slate-100 font-black px-8 rounded-xl border-none">Diagnostic Audit</Button>
                                        <Button onClick={() => toast({ title: "Leads Panel", description: "Filtering stuck leads in Negotiation stage." })} variant="ghost" className="text-rose-400 hover:text-white font-bold h-11 px-6 underline decoration-rose-400/50">View Stuck Leads</Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "Pipeline Stagnation", val: "22%", status: "At Risk" },
                                        { label: "Avg Days to Close", val: "28.4d", status: "+4.2d" },
                                        { label: "Decay Probability", val: "14%", status: "Low" },
                                        { label: "Lost Opportunity", val: "$124k", status: "Critical" },
                                    ].map((stat, i) => (
                                        <div key={i} className="p-5 rounded-none bg-white/5 border border-white/10 space-y-1">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                            <div className="flex justify-between items-end">
                                                <h4 className="text-[20px] font-black">{stat.val}</h4>
                                                <span className={`text-[10px] font-bold ${i === 3 ? 'text-rose-500' : 'text-emerald-400'}`}>{stat.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>

            </div>

            {/* Right Slide-in Diagnose Form */}
            {showDiagForm && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowDiagForm(false)} />
                    <div className="relative h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-[18px] font-bold text-slate-900">Diagnose Pipeline</h3>
                                <p className="text-[12px] text-slate-500">Configure bottleneck diagnostic</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowDiagForm(false)} className="h-9 w-9 text-slate-400 hover:text-slate-900">
                                <X size={18} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Pipeline Stage <span className="text-rose-500">*</span></label>
                                <Select value={diagStage} onValueChange={setDiagStage}>
                                    <SelectTrigger className={`h-10 ${diagErrors.stage ? "border-rose-500" : ""}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Discovery">Discovery</SelectItem>
                                        <SelectItem value="Qualified">Qualified</SelectItem>
                                        <SelectItem value="Proposal">Proposal</SelectItem>
                                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                                        <SelectItem value="Contracting">Contracting</SelectItem>
                                    </SelectContent>
                                </Select>
                                {diagErrors.stage && <p className="text-[11px] text-rose-500 font-medium">{diagErrors.stage}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Threshold Days <span className="text-rose-500">*</span></label>
                                <Input
                                    type="number"
                                    value={diagThreshold}
                                    onChange={(e) => { setDiagThreshold(e.target.value); if (diagErrors.threshold) setDiagErrors({ ...diagErrors, threshold: undefined }) }}
                                    placeholder="e.g. 21"
                                    min="1"
                                    className={diagErrors.threshold ? "border-rose-500" : ""}
                                />
                                {diagErrors.threshold && <p className="text-[11px] text-rose-500 font-medium">{diagErrors.threshold}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Recommended Action <span className="text-rose-500">*</span></label>
                                <textarea
                                    value={diagAction}
                                    onChange={(e) => { setDiagAction(e.target.value); if (diagErrors.action) setDiagErrors({ ...diagErrors, action: undefined }) }}
                                    placeholder="What should happen for stuck leads..."
                                    rows={4}
                                    className={`w-full rounded-md border px-3 py-2 text-sm ${diagErrors.action ? "border-rose-500" : "border-slate-200"} focus:outline-none focus:ring-1 focus:ring-orange-500`}
                                />
                                {diagErrors.action && <p className="text-[11px] text-rose-500 font-medium">{diagErrors.action}</p>}
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button variant="outline" onClick={() => setShowDiagForm(false)} className="flex-1">Cancel</Button>
                            <Button onClick={handleDiagnose} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">Run Diagnostic</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
