"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    Filter,
    Download,
    CheckCircle,
    X,
    Clock,
    AlertTriangle,
    User,
    DollarSign,
    RefreshCw,
    Activity,
    ShieldCheck,
    Gavel,
    Hammer,
    Scale,
    Users,
    ChevronRight,
    Star,
    Zap,
    ScrollText,
    History,
    CheckSquare,
    XSquare,
    ClipboardCheck
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "@/shared/utils/toast"

// --- Mock Data ---
const PENDING = [
    { id: "APP-01", type: "Discount Approval", requestor: "John Doe", client: "Acme Corp", amount: "$2,400", priority: "High", date: "Oct 04" },
    { id: "APP-02", type: "Contract Amendment", requestor: "Sarah Smith", client: "TechFlow Solutions", amount: "$15,000", priority: "Medium", date: "Oct 04" }
]

const RULES = [
    { id: "AR-01", name: "High-Value Acquisition", threshold: "> $10,000", type: "Strategic", status: "Active" },
    { id: "AR-02", name: "Discount Sentinel", threshold: "> 20%", type: "Financial", status: "Active" }
]

export default function Approvals() {
    const [searchQuery, setSearchQuery] = useState("")

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1000)), {
            loading: 'Processing governance request...',
            success: msg,
            error: 'Governance action failed'
        })
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Governance <span className="text-blue-600">Approvals</span></h1>
                    <p className="text-lg font-medium text-slate-500 mt-1 text-[15px]">Multi-stage approval workflows, compliance gates, and strategic override management</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-bold shadow-sm gap-2" onClick={() => handleAction("Approval history exported")}>
                        <History className="w-4 h-4 text-slate-400" /> Audit Log
                    </Button>
                    <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 gap-2" onClick={() => handleAction("Rule architect opened")}>
                        <Scale className="w-4 h-4" /> Create Rule
                    </Button>
                </div>
            </div>

            {/* Governance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Pending Queue", value: "12 Requests", icon: Clock, color: "blue" },
                    { label: "Studio Success", value: "98.5%", icon: ClipboardCheck, color: "emerald" },
                    { label: "Avg Decision Lag", value: "1.4 Hours", icon: Activity, color: "rose" },
                    { label: "Policy Coverage", value: "94%", icon: ShieldCheck, color: "indigo" }
                ].map((stat, i) => (
                    <Card key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border shadow-sm ${stat.color === 'blue' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                    stat.color === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                        stat.color === 'rose' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                            'bg-indigo-50 border-indigo-100 text-indigo-600'
                                }`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <Badge variant="outline" className="font-black text-[9px] border-emerald-100 text-emerald-600 tracking-widest uppercase">Stable</Badge>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                        <h4 className="text-xl font-black text-slate-900">{stat.value}</h4>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="pending" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-2xl h-14 w-fit shadow-md">
                    <TabsTrigger value="pending" className="px-8 rounded-xl data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold text-sm h-full text-slate-500 transition-all">Pending Queue</TabsTrigger>
                    <TabsTrigger value="rules" className="px-8 rounded-xl data-[state=active]:bg-slate-100 data-[state=active]:text-blue-600 font-bold text-sm h-full text-slate-500 transition-all">Governance Rules</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-4 h-4" />
                            <Input placeholder="Filter by entity or requestor..." className="pl-12 h-12 bg-white border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 font-bold text-xs uppercase tracking-widest gap-2 bg-white" onClick={() => handleAction("Bulk approval triggered")}>
                            <CheckSquare className="w-4 h-4" /> Process Selected
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {PENDING.map((req, idx) => (
                            <Card key={idx} className="p-6 bg-white border border-slate-100 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:shadow-xl transition-all overflow-hidden relative">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${req.priority === 'High' ? 'bg-rose-500' : 'bg-amber-500'
                                    }`} />
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                        <Gavel className="w-7 h-7 text-indigo-600 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-md font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors leading-none">{req.client}</h4>
                                            <Badge className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border-0 uppercase tracking-widest ${req.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                                }`}>{req.priority} Priority</Badge>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Requestor: {req.requestor}</span>
                                            <span className="flex items-center gap-1.5 font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200"><DollarSign className="w-3.5 h-3.5" /> Valuation: {req.amount}</span>
                                            <span className="flex items-center gap-1.5 text-blue-600"><Clock className="w-3.5 h-3.5" /> Filed: {req.date}, 2024</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Button variant="outline" className="h-11 px-6 rounded-2xl border-slate-200 font-bold text-[10px] uppercase tracking-widest gap-2 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all" onClick={() => handleAction(`Request ${req.id} rejected`)}>
                                        <XSquare className="w-4 h-4" /> Reject
                                    </Button>
                                    <Button className="h-11 px-8 rounded-2xl bg-slate-900 border-0 hover:bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest gap-2 transition-colors shadow-lg shadow-slate-900/10 group-hover:shadow-blue-600/20" onClick={() => handleAction(`Request ${req.id} approved`)}>
                                        <CheckSquare className="w-4 h-4 fill-current" /> Approve
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="rules">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {RULES.map((rule, idx) => (
                            <Card key={idx} className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 space-y-6 hover:shadow-2xl transition-all border border-slate-100 group bg-white">
                                <div className="flex items-center justify-between">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                                        <Hammer className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <Badge className="bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase border-0">{rule.status}</Badge>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors leading-tight">{rule.name}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rule.type} Enforcement Node</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Trigger Threshold</p>
                                    <p className="text-lg font-black text-slate-900 tracking-tight">{rule.threshold}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" className="flex-1 rounded-xl h-11 border-slate-200 font-bold text-xs uppercase tracking-widest" onClick={() => handleAction(`Rule ${rule.id} configuration opened`)}>Adjust</Button>
                                    <Button variant="ghost" size="icon" className="h-11 w-11 text-rose-500 rounded-xl hover:bg-rose-50"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
