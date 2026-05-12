"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Zap,
    Settings2,
    Activity,
    ChevronLeft,
    Calendar,
    Download,
    Filter,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Clock,
    Scale,
    Layers,
    MousePointer2,
    Share2,
    RefreshCw,
    ShieldCheck,
    GitBranch,
    Users,
    Search,
    X
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
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
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell
} from "recharts"

const EXECUTION_VOLUME = [
    { day: "Mon", executions: 1240 },
    { day: "Tue", executions: 1850 },
    { day: "Wed", executions: 2100 },
    { day: "Thu", executions: 1620 },
    { day: "Fri", executions: 1400 },
]

const INITIAL_WORKFLOWS = [
    { id: "1", name: "Instant Lead Routing", success: 99.8, executions: 5240 },
    { id: "2", name: "Drip: Nurture Seq A", success: 94.2, executions: 3120 },
    { id: "3", name: "Auto-Reassignment", success: 98.5, executions: 1450 },
    { id: "4", name: "Scoring: Profile Sync", success: 88.4, executions: 8400 },
]

export default function AutomationReportsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [showAuditForm, setShowAuditForm] = useState(false)
    const [workflowId, setWorkflowId] = useState("")
    const [errorThreshold, setErrorThreshold] = useState("")
    const [auditWindow, setAuditWindow] = useState("24h")
    const [auditErrors, setAuditErrors] = useState<{ workflow?: string; threshold?: string; window?: string }>({})
    const [searchWf, setSearchWf] = useState("")
    const [minSuccess, setMinSuccess] = useState("")

    useEffect(() => {
        setIsClient(true)
    }, [])

    const filteredWorkflows = useMemo(() => {
        return INITIAL_WORKFLOWS.filter(w =>
            w.name.toLowerCase().includes(searchWf.toLowerCase()) &&
            (minSuccess === "" || w.success >= parseFloat(minSuccess))
        )
    }, [searchWf, minSuccess])

    const handleAudit = () => {
        const newErrors: { workflow?: string; threshold?: string; window?: string } = {}
        if (!workflowId) newErrors.workflow = "Workflow is required"
        if (!errorThreshold.trim()) newErrors.threshold = "Threshold is required"
        else if (!/^\d+(\.\d+)?$/.test(errorThreshold) || parseFloat(errorThreshold) < 0 || parseFloat(errorThreshold) > 100) newErrors.threshold = "Threshold must be 0-100"
        if (!auditWindow) newErrors.window = "Time window is required"

        if (Object.keys(newErrors).length) {
            setAuditErrors(newErrors)
            return
        }
        setAuditErrors({})
        toast({ title: "Audit Started", description: `Workflow ${workflowId} (>${errorThreshold}% errors, ${auditWindow})` })
        setErrorThreshold("")
        setShowAuditForm(false)
    }

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }}>
            <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

                {/* Header */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-indigo-50 p-6 rounded-none border border-indigo-100 shadow-sm">
                    <div className="space-y-3">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600">
                            <ChevronLeft className="h-3 w-3 mr-1" /> Back
                        </Button>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-900 text-white shadow-lg">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                    Automation Efficiency Intelligence
                                </h1>
                            </div>
                            <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                                Measuring the impact and health of your workflow engine. Track execution volume, success rates, and total manual time saved.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button onClick={() => setShowAuditForm(true)} variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                            <ShieldCheck className="h-4 w-4 mr-2 text-slate-400" /> Error Log Audit
                        </Button>
                        <Button onClick={() => toast({ title: "Global Sync Started", description: "Refreshing all workflow execution stats..." })} className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none">
                            <RefreshCw className="h-4 w-4 mr-2" /> Global Sync
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Workflow Execution Volume</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Daily count of automated triggers firing across all active sequences.</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Executions</p>
                                <h4 className="text-[24px] font-black text-indigo-600">42,480</h4>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={EXECUTION_VOLUME}>
                                    <defs>
                                        <linearGradient id="colorExec" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ borderRadius: '0', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="executions" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorExec)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white p-8 space-y-8 flex flex-col">
                            <div className="space-y-1">
                                <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Engine Integrity</h3>
                                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest leading-tight">Success-to-Error ratio across triggers</p>
                            </div>

                            <div className="space-y-6 flex-1">
                                {[
                                    { label: "Success Rate", val: 99.2, color: "bg-emerald-500" },
                                    { label: "Throttling Frequency", val: 4.8, color: "bg-indigo-500" },
                                    { label: "Conflict Rate", val: 0.4, color: "bg-rose-500" },
                                ].map((s, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-end text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                            <span>{s.label}</span>
                                            <span className="text-slate-900">{s.val}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div className={`h-full ${s.color}`} style={{ width: `${s.val > 100 ? 100 : s.val}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-50 text-center">
                                <div className="inline-flex flex-col items-center">
                                    <h4 className="text-[28px] font-black text-slate-900 tracking-tighter">1,240 Hours</h4>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Manual Time Saved (MTD)</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-indigo-600 text-white p-8 space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Layers size={120} />
                            </div>
                            <div className="space-y-1 relative z-10">
                                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest leading-none">Global Impact Rank</p>
                                <h3 className="text-[24px] font-black tracking-tight tracking-tighter">Strategic Efficiency: A+</h3>
                            </div>
                            <p className="text-[12px] text-indigo-100/70 font-medium leading-relaxed relative z-10">
                                Platform automations have increased team response speed by <strong>8.4x</strong> compared to manual handling.
                            </p>
                            <Button onClick={() => toast({ title: "Operations Map", description: "Loading full automation dependency graph." })} className="w-full h-10 bg-white text-indigo-600 hover:bg-slate-50 font-black text-[11px] uppercase tracking-widest rounded-xl border-none relative z-10">
                                Operations Map
                            </Button>
                        </Card>
                    </div>

                    <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-8">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Top-Performing Automated Workflows</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Measuring execution success vs. total system load contributions.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-300" />
                                    <Input value={searchWf} onChange={(e) => setSearchWf(e.target.value)} placeholder="Search workflow..." className="pl-9 h-9 w-56 text-[12px]" />
                                </div>
                                <Input
                                    type="number"
                                    value={minSuccess}
                                    onChange={(e) => setMinSuccess(e.target.value)}
                                    placeholder="Min %"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className="h-9 w-24 text-[12px]"
                                />
                                <Button onClick={() => toast({ title: "All Processes", description: "Loading complete workflow registry." })} variant="ghost" size="sm" className="h-9 text-[11px] font-black uppercase text-indigo-600 bg-indigo-50 px-4">See All</Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredWorkflows.length === 0 ? (
                                <p className="text-center py-8 text-[13px] text-slate-400 font-medium">No workflows match your filter.</p>
                            ) : filteredWorkflows.map((wf, i) => (
                                <div key={wf.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-none bg-slate-50 border border-slate-100/50 group hover:border-indigo-100 transition-all gap-6">
                                    <div className="flex items-center gap-4 min-w-[300px]">
                                        <div className="p-3 rounded-xl bg-white border border-slate-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <GitBranch size={20} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="text-[15px] font-black text-slate-900 uppercase tracking-tight">{wf.name}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Executions: <span className="text-slate-900">{wf.executions.toLocaleString()}</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 max-w-[400px]">
                                        <div className="flex justify-between items-end text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                            <span>Execution Success Rate</span>
                                            <span className="text-emerald-500">{wf.success}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                                            <div className="h-full bg-emerald-500" style={{ width: `${wf.success}%` }} />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button onClick={() => toast({ title: "Workflow Settings", description: `Configuring: ${wf.name}` })} size="icon" variant="ghost" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-xl">
                                            <Settings2 size={18} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>

            </div>

            {/* Right Slide-in Audit Form */}
            {showAuditForm && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setShowAuditForm(false)} />
                    <div className="relative h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-[18px] font-bold text-slate-900">Error Log Audit</h3>
                                <p className="text-[12px] text-slate-500">Inspect failed workflow executions</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setShowAuditForm(false)} className="h-9 w-9 text-slate-400 hover:text-slate-900">
                                <X size={18} />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Workflow <span className="text-rose-500">*</span></label>
                                <Select value={workflowId} onValueChange={setWorkflowId}>
                                    <SelectTrigger className={`h-10 ${auditErrors.workflow ? "border-rose-500" : ""}`}>
                                        <SelectValue placeholder="Select a workflow" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {INITIAL_WORKFLOWS.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {auditErrors.workflow && <p className="text-[11px] text-rose-500 font-medium">{auditErrors.workflow}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Min Error Rate (%) <span className="text-rose-500">*</span></label>
                                <Input
                                    type="number"
                                    value={errorThreshold}
                                    onChange={(e) => { setErrorThreshold(e.target.value); if (auditErrors.threshold) setAuditErrors({ ...auditErrors, threshold: undefined }) }}
                                    placeholder="e.g. 2"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    className={auditErrors.threshold ? "border-rose-500" : ""}
                                />
                                {auditErrors.threshold && <p className="text-[11px] text-rose-500 font-medium">{auditErrors.threshold}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Time Window <span className="text-rose-500">*</span></label>
                                <Select value={auditWindow} onValueChange={setAuditWindow}>
                                    <SelectTrigger className={`h-10 ${auditErrors.window ? "border-rose-500" : ""}`}>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1h">Last 1 Hour</SelectItem>
                                        <SelectItem value="24h">Last 24 Hours</SelectItem>
                                        <SelectItem value="7d">Last 7 Days</SelectItem>
                                        <SelectItem value="30d">Last 30 Days</SelectItem>
                                    </SelectContent>
                                </Select>
                                {auditErrors.window && <p className="text-[11px] text-rose-500 font-medium">{auditErrors.window}</p>}
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 flex gap-3">
                            <Button variant="outline" onClick={() => setShowAuditForm(false)} className="flex-1">Cancel</Button>
                            <Button onClick={handleAudit} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">Run Audit</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
