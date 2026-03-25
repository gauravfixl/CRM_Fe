"use client"

import React, { useState } from "react"
import {
    DollarSign,
    TrendingUp,
    Target,
    Calculator,
    Activity,
    Zap,
    Settings,
    Edit,
    Save
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle
} from "@/components/ui/dialog"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

export default function ROIConfigPage() {
    const [editModal, setEditModal] = useState<string | null>(null)
    const [configs, setConfigs] = useState([
        { id: "1", metric: "Cost Per Lead", formula: "Total Spend / Leads", target: "$50", current: "$42", performance: 84, status: "Active" },
        { id: "2", metric: "Return on Ad Spend", formula: "Revenue / Ad Spend", target: "5:1", current: "6.2:1", performance: 124, status: "Active" },
        { id: "3", metric: "Customer Acquisition Cost", formula: "Total Spend / Customers", target: "$500", current: "$420", performance: 84, status: "Active" },
    ])

    const toggleStatus = (id: string) => {
        setConfigs(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c))
        toast.success("ROI metric status updated.")
    }

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setEditModal(null)
        toast.success("ROI target updated successfully.")
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-8 overflow-y-auto font-sans">
            {/* HERO */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                        <Calculator className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">ROI Configuration</h1>
                        <p className="text-sm text-slate-500 mt-2 font-medium max-w-lg">Configure ROI metrics and targets for campaign performance tracking.</p>
                    </div>
                </div>
                <Button variant="outline" className="h-11 rounded-2xl border-slate-200 font-bold text-[11px] px-6 hover:bg-white hover:border-blue-500 transition-all active:scale-95">
                    <Settings className="w-4 h-4 mr-2" /> Advanced Settings
                </Button>
            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-indigo-800 border-none shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-transform">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-blue-100 tracking-wider">ROI Metrics</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-3xl font-black text-white">{configs.length}</p>
                        <p className="text-[10px] text-blue-100 font-bold flex items-center gap-1 mt-1">
                            <Calculator className="w-3 h-3" /> Tracked
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Avg. Performance</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">97%</p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                            <Activity className="w-3 h-3" /> Of targets
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Total ROI</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">$2.4M</p>
                        <p className="text-[10px] text-blue-500 font-bold flex items-center gap-1 mt-1">
                            <DollarSign className="w-3 h-3" /> This quarter
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Best Performer</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-emerald-600">ROAS</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                            <Target className="w-3 h-3" /> 124% of target
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">ROI Metrics & Targets</h3>
                        <p className="text-xs text-slate-500 font-medium">Track and configure performance metrics for your campaigns.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Metric</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Formula</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Target</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Current</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Performance</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {configs.map((config) => (
                                <tr key={config.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-violet-50 text-violet-600 rounded-xl border border-violet-100 group-hover:bg-violet-600 group-hover:text-white transition-all">
                                                <DollarSign className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900">{config.metric}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Badge className="bg-blue-50 text-blue-700 border-none rounded-full text-[10px] font-bold px-3 py-1">{config.formula}</Badge>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <Target className="w-3 h-3 text-slate-400" />
                                            <span className="text-sm font-black text-slate-900">{config.target}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                                            <span className="text-sm font-black text-emerald-600">{config.current}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3 min-w-[150px]">
                                            <Progress value={config.performance > 100 ? 100 : config.performance} className="h-1.5 flex-1 bg-slate-100" />
                                            <span className={`text-xs font-black ${config.performance >= 100 ? 'text-emerald-600' : config.performance >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>
                                                {config.performance}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Switch checked={config.status === "Active"} onCheckedChange={() => toggleStatus(config.id)} />
                                    </td>
                                    <td className="px-6 py-5">
                                        <Button variant="ghost" onClick={() => setEditModal(config.id)} className="h-8 px-3 rounded-xl text-[10px] font-bold text-blue-600 hover:bg-blue-50 gap-1">
                                            <Edit className="w-3 h-3" /> Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EDIT MODAL */}
            <Dialog open={!!editModal} onOpenChange={() => setEditModal(null)}>
                <DialogContent className="sm:max-w-[450px] p-0 border-none rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-8 text-white">
                        <DialogTitle className="text-2xl font-black tracking-tight">Edit ROI Target</DialogTitle>
                        <p className="text-violet-100 text-xs font-medium mt-2">Update the target value for this metric.</p>
                    </div>
                    <form onSubmit={handleSave} className="p-8 space-y-6 bg-white">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400">New Target Value</Label>
                            <Input placeholder="e.g., $50 or 5:1" className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                        </div>
                        <DialogFooter className="gap-3">
                            <Button type="button" variant="ghost" onClick={() => setEditModal(null)} className="rounded-2xl text-sm text-slate-500 font-bold">Cancel</Button>
                            <Button type="submit" className="bg-violet-600 hover:bg-violet-700 rounded-2xl text-sm px-8 h-12 shadow-xl shadow-violet-500/20 font-bold transition-all active:scale-95 gap-2">
                                <Save className="w-4 h-4" /> Save Target
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
