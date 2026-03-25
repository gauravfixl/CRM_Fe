"use client"

import React, { useState } from "react"
import {
    Send,
    Clock,
    AlertTriangle,
    Activity,
    Zap,
    ShieldCheck,
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

export default function DailySendLimitsPage() {
    const [editModal, setEditModal] = useState<string | null>(null)
    const [limits, setLimits] = useState([
        { id: "1", channel: "Email", dailyLimit: 10000, currentUsage: 7420, percentage: 74, status: "Active", throttle: true },
        { id: "2", channel: "SMS", dailyLimit: 5000, currentUsage: 3200, percentage: 64, status: "Active", throttle: true },
        { id: "3", channel: "Push Notifications", dailyLimit: 50000, currentUsage: 42000, percentage: 84, status: "Active", throttle: false },
    ])

    const toggleStatus = (id: string) => {
        setLimits(prev => prev.map(l => l.id === id ? { ...l, status: l.status === "Active" ? "Paused" : "Active" } : l))
        toast.success("Channel status updated.")
    }

    const toggleThrottle = (id: string) => {
        setLimits(prev => prev.map(l => l.id === id ? { ...l, throttle: !l.throttle } : l))
        toast.success("Throttling updated.")
    }

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setEditModal(null)
        toast.success("Daily limit updated successfully.")
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-8 overflow-y-auto font-sans">
            {/* HERO */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Daily Send Limits</h1>
                        <p className="text-sm text-slate-500 mt-2 font-medium max-w-lg">Manage sending limits to prevent spam and ensure deliverability.</p>
                    </div>
                </div>
                <Button variant="outline" className="h-11 rounded-2xl border-slate-200 font-bold text-[11px] px-6 hover:bg-white hover:border-blue-500 transition-all active:scale-95">
                    <Settings className="w-4 h-4 mr-2" /> Global Settings
                </Button>
            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-gradient-to-br from-blue-600 to-indigo-800 border-none shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:-translate-y-1 transition-transform">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-blue-100 tracking-wider">Active Channels</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-3xl font-black text-white">{limits.length}</p>
                        <p className="text-[10px] text-blue-100 font-bold flex items-center gap-1 mt-1">
                            <Send className="w-3 h-3" /> With limits
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Total Sent Today</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">{limits.reduce((sum, l) => sum + l.currentUsage, 0).toLocaleString()}</p>
                        <p className="text-[10px] text-blue-500 font-bold flex items-center gap-1 mt-1">
                            <Activity className="w-3 h-3" /> Messages
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Avg. Usage</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-amber-600">74%</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                            <Zap className="w-3 h-3" /> Of daily limits
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 tracking-wider">Throttling</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-emerald-600">{limits.filter(l => l.throttle).length}</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Channels protected
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* TABLE */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">Channel Send Limits</h3>
                        <p className="text-xs text-slate-500 font-medium">Configure daily sending limits per channel.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Channel</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Daily Limit</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Current Usage</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Usage %</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Throttling</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {limits.map((limit) => (
                                <tr key={limit.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 group-hover:bg-amber-600 group-hover:text-white transition-all">
                                                <Send className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-black text-slate-900">{limit.channel}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5"><span className="text-sm font-black text-slate-900">{limit.dailyLimit.toLocaleString()}</span></td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 text-slate-400" />
                                            <span className="text-sm font-black text-slate-900">{limit.currentUsage.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-2 min-w-[180px]">
                                            <div className="flex justify-between text-xs">
                                                <span className={`font-black ${limit.percentage >= 90 ? 'text-red-600' : limit.percentage >= 75 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                    {limit.percentage}%
                                                </span>
                                                {limit.percentage >= 90 && (
                                                    <Badge className="bg-red-600 text-white border-none rounded-full text-[10px] font-bold px-2 py-0.5 flex items-center gap-1">
                                                        <AlertTriangle className="w-2.5 h-2.5" /> Near Limit
                                                    </Badge>
                                                )}
                                            </div>
                                            <Progress value={limit.percentage} className="h-1.5 bg-slate-100" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Switch checked={limit.throttle} onCheckedChange={() => toggleThrottle(limit.id)} />
                                            <Badge className={`${limit.throttle ? "bg-emerald-600" : "bg-slate-400"} text-white border-none rounded-full text-[10px] font-bold px-2 py-0.5`}>
                                                {limit.throttle ? "Enabled" : "Disabled"}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <Switch checked={limit.status === "Active"} onCheckedChange={() => toggleStatus(limit.id)} />
                                    </td>
                                    <td className="px-6 py-5">
                                        <Button variant="ghost" onClick={() => setEditModal(limit.id)} className="h-8 px-3 rounded-xl text-[10px] font-bold text-blue-600 hover:bg-blue-50 gap-1">
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
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white">
                        <DialogTitle className="text-2xl font-black tracking-tight">Edit Send Limit</DialogTitle>
                        <p className="text-amber-100 text-xs font-medium mt-2">Update the daily sending limit for this channel.</p>
                    </div>
                    <form onSubmit={handleSave} className="p-8 space-y-6 bg-white">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-400">New Daily Limit</Label>
                            <Input type="number" placeholder="e.g., 10000" className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold" />
                        </div>
                        <DialogFooter className="gap-3">
                            <Button type="button" variant="ghost" onClick={() => setEditModal(null)} className="rounded-2xl text-sm text-slate-500 font-bold">Cancel</Button>
                            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 rounded-2xl text-sm px-8 h-12 shadow-xl shadow-amber-500/20 font-bold transition-all active:scale-95 gap-2">
                                <Save className="w-4 h-4" /> Save Limit
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
