"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    Filter,
    Download,
    Edit,
    Trash2,
    Eye,
    Calendar,
    DollarSign,
    Clock,
    CheckCircle,
    RefreshCw,
    Play,
    Timer,
    ArrowUpRight,
    Target,
    Layers,
    FileText,
    Settings2,
    SearchCheck
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { toast } from "@/shared/utils/toast"

// --- Mock Data ---
const RULES = [
    { id: "RR-001", name: "SaaS Subscription Nexus", type: "Subscription", method: "Pro-rata Monthly", status: "Active" },
    { id: "RR-002", name: "Professional Milestone Sync", type: "Services", method: "Event Driven", status: "Active" },
    { id: "RR-003", name: "License Perpetual Ledger", type: "License", method: "Upfront Point-in-time", status: "Active" }
]

const SCHEDULES = [
    { contract: "Acme Enterprise Nexus", total: 120000, recognized: 85000, next: "Oct 01", status: "Active" },
    { contract: "TechFlow Global 24", total: 48000, recognized: 12000, next: "Oct 15", status: "Active" }
]

export default function RevenueRecognition() {
    const [searchQuery, setSearchQuery] = useState("")
    const [schedules, setSchedules] = useState(SCHEDULES)
    const [rules, setRules] = useState(RULES)
    const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false)
    const [newRule, setNewRule] = useState({ name: '', type: 'Subscription', method: 'Pro-rata Monthly' })
    const [selectedSchedule, setSelectedSchedule] = useState<any>(null)
    const [editingRule, setEditingRule] = useState<any>(null)

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1000)), {
            loading: 'Processing revenue recognition cycle...',
            success: msg,
            error: 'Recognition cycle failed'
        })
    }

    const handleCreateRule = () => {
        if (!newRule.name) {
            toast.error("Please fill in rule name")
            return
        }
        const rule = {
            id: `RR-00${rules.length + 1}`,
            ...newRule,
            status: 'Active'
        }
        setRules([...rules, rule])
        setIsCreateRuleOpen(false)
        setNewRule({ name: '', type: 'Subscription', method: 'Pro-rata Monthly' })
        toast.success(`Logic ${rule.id} deployed`)
    }

    const handleRunCycle = () => {
        toast.promise(new Promise(r => setTimeout(r, 1500)), {
            loading: 'Synchronizing deferred schedules...',
            success: 'Recognition cycle completed for all active contracts',
            error: 'Cycle synchronization failed'
        })
    }

    const handleUpdateRule = () => {
        if (!editingRule) return
        setRules(rules.map(r => r.id === editingRule.id ? editingRule : r))
        setEditingRule(null)
        toast.success(`Logic ${editingRule.id} updated`)
    }

    const handleDeleteRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id))
        toast.success("Recognition logic removed")
    }

    const filteredSchedules = useMemo(() => {
        return schedules.filter(sc =>
            sc.contract.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [schedules, searchQuery])

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Revenue <span className="text-indigo-600">Engine</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Automated recognition schedules, deferred liability management, and ASC 606 compliance</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => handleAction("Recognition records exported")}>
                        <FileText className="w-4 h-4 text-slate-400" /> Audit Ledger
                    </Button>
                    <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2" onClick={handleRunCycle}>
                        <Play className="w-4 h-4" /> Run Cycle
                    </Button>
                </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Deferred Liability", value: "$2.45m", change: "+18.3%", trend: "up", icon: Timer, color: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100/50 text-indigo-600" },
                    { label: "Recognized (Ytd)", value: "$6.82m", change: "+12.5%", trend: "up", icon: CheckCircle, color: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100/50 text-emerald-600" },
                    { label: "Monthly Velocity", value: "$206k", change: "+8.7%", icon: Target, color: "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-100/50 text-blue-600" },
                    { label: "Compliance Index", value: "100%", icon: Settings2, color: "bg-gradient-to-br from-slate-50 to-slate-100/50 border-slate-100/50 text-slate-600" }
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.color} p-6 rounded-3xl border shadow-sm group hover:shadow-md transition-all`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-current opacity-20">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.change && (
                                <Badge variant="outline" className="font-semibold text-[10px] bg-white border-emerald-100 text-emerald-600 tracking-tight">{stat.change} ↑</Badge>
                            )}
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 leading-none mb-1">{stat.label}</p>
                        <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="schedule" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-2xl h-14 w-fit shadow-sm">
                    <TabsTrigger value="schedule" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Deferred Schedules</TabsTrigger>
                    <TabsTrigger value="rules" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Recognition Logic</TabsTrigger>
                </TabsList>

                <TabsContent value="schedule">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Active Deferred Portfolio</CardTitle>
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
                                <Input
                                    placeholder="Find contract or entity..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-11 bg-slate-50 border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4 text-slate-900">
                            {filteredSchedules.map((sc, idx) => (
                                <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:bg-white hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                                            <Layers className="w-7 h-7 text-indigo-600" />
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-md font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{sc.contract}</h4>
                                                <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 border-0 tracking-tight">{sc.status}</Badge>
                                            </div>
                                            <div className="w-full max-w-sm space-y-2">
                                                <div className="flex justify-between text-[11px] font-medium text-slate-400">
                                                    <span>Recognition: {Math.round((sc.recognized / sc.total) * 100)}%</span>
                                                    <span>Delta: {fmt(sc.total - sc.recognized)}</span>
                                                </div>
                                                <Progress value={(sc.recognized / sc.total) * 100} className="h-1.5 bg-slate-100 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10 text-right">
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-medium text-slate-400">Next Tranche</p>
                                            <p className="text-sm font-semibold text-slate-900">{sc.next}, 2024</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-medium text-slate-400">Total Value</p>
                                            <p className="text-xl font-semibold text-slate-900 tracking-tight">{fmt(sc.total)}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-indigo-600 transition-all" onClick={() => setSelectedSchedule(sc)}><Eye className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rules">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-900">
                        {rules.map((rule, idx) => (
                            <Card key={idx} className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 space-y-6 hover:shadow-2xl transition-all bg-white border border-slate-100 group">
                                <div className="flex items-center justify-between">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                        <Settings2 className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <Badge className="bg-slate-50 text-indigo-600 font-semibold text-[10px] border-0">Nexus-Enabled</Badge>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-semibold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-tight">{rule.name}</h4>
                                    <p className="text-[11px] font-medium text-slate-400">Structural Recognition Logic</p>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between py-2 border-b border-slate-50 text-xs text-slate-900">
                                        <span className="font-medium text-slate-500">Method</span>
                                        <span className="font-semibold">{rule.method}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-50 text-xs text-slate-900">
                                        <span className="font-medium text-slate-500">Type</span>
                                        <span className="font-semibold">{rule.type}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <Button variant="outline" className="flex-1 rounded-xl h-10 border-slate-200 font-semibold text-xs hover:bg-slate-50 transition-all text-slate-900" onClick={() => setEditingRule(rule)}>Edit Logic</Button>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all" onClick={() => handleDeleteRule(rule.id)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </Card>
                        ))}
                        <Dialog open={isCreateRuleOpen} onOpenChange={setIsCreateRuleOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-auto border-dashed border-2 border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-slate-400 font-semibold hover:bg-slate-50 hover:border-indigo-400 hover:text-indigo-600 gap-3 group transition-all">
                                    <div className="h-12 w-12 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-indigo-400 transition-all">
                                        <Plus className="w-5 h-5 group-hover:text-indigo-600 transition-all" />
                                    </div>
                                    <span className="text-[11px] font-medium">Architect New Rule</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Recognition <span className="text-indigo-600">Logic</span></DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-6 py-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Policy Name</Label>
                                        <Input value={newRule.name} onChange={(e) => setNewRule({ ...newRule, name: e.target.value })} placeholder="e.g. Enterprise Tier Recognition" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">Recognition Method</Label>
                                        <Select value={newRule.method} onValueChange={(v) => setNewRule({ ...newRule, method: v })}>
                                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold shadow-none">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Pro-rata Monthly">Pro-rata Monthly</SelectItem>
                                                <SelectItem value="Event Driven">Event Driven</SelectItem>
                                                <SelectItem value="Upfront Point-in-time">Upfront Point-in-time</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20" onClick={handleCreateRule}>Deploy Logic</Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                </TabsContent>
            </Tabs>

            {/* View Schedule Modal */}
            <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit text-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Contract <span className="text-indigo-600">Nexus Audit</span></DialogTitle>
                    </DialogHeader>
                    {selectedSchedule && (
                        <div className="space-y-6 py-4">
                            <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Entity Account</p>
                                    <p className="text-lg font-bold text-slate-900">{selectedSchedule.contract}</p>
                                </div>
                                <div className="text-right">
                                    <Badge className="bg-emerald-100 text-emerald-700 font-bold border-0">{selectedSchedule.status}</Badge>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs font-semibold text-slate-400">Recognition Velocity</p>
                                        <p className="text-sm font-bold text-slate-900">{Math.round((selectedSchedule.recognized / selectedSchedule.total) * 100)}% Complete</p>
                                    </div>
                                    <Progress value={(selectedSchedule.recognized / selectedSchedule.total) * 100} className="h-2 bg-slate-100 rounded-full" />
                                </div>
                                <div className="grid grid-cols-2 gap-6 pt-2">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400">Total Value</p>
                                        <p className="text-lg font-bold text-slate-900">{fmt(selectedSchedule.total)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400">Recognized</p>
                                        <p className="text-lg font-bold text-emerald-600">{fmt(selectedSchedule.recognized)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400">Next Tranche</p>
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {selectedSchedule.next}, 2024
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400">Deferred Liability</p>
                                        <p className="text-lg font-bold text-rose-600">{fmt(selectedSchedule.total - selectedSchedule.recognized)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Logic Modal */}
            <Dialog open={!!editingRule} onOpenChange={() => setEditingRule(null)}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit text-slate-900">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Modify <span className="text-indigo-600">Logic</span></DialogTitle>
                    </DialogHeader>
                    {editingRule && (
                        <div className="grid gap-6 py-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Policy Name</Label>
                                <Input value={editingRule.name} onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-700">Recognition Method</Label>
                                <Select value={editingRule.method} onValueChange={(v) => setEditingRule({ ...editingRule, method: v })}>
                                    <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Pro-rata Monthly">Pro-rata Monthly</SelectItem>
                                        <SelectItem value="Event Driven">Event Driven</SelectItem>
                                        <SelectItem value="Upfront Point-in-time">Upfront Point-in-time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20 mt-2" onClick={handleUpdateRule}>Update Structural Logic</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
