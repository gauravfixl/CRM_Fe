"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Zap,
    Plus,
    MoreVertical,
    GripVertical,
    ArrowRight,
    Search,
    RefreshCcw,
    Edit3,
    Trash2,
    CheckCircle2,
    Clock,
    UserMinus,
    TrendingDown,
    Activity,
    Settings,
    ShieldAlert,
    Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { motion, Reorder, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ClientLifecyclePage() {
    const [isLoading, setIsLoading] = useState(false)
    const [stages, setStages] = useState([
        { id: "1", name: "Onboarding", color: "blue", probability: 100, autoMove: true, rules: "Create welcome task" },
        { id: "2", name: "Active", color: "emerald", probability: 100, autoMove: false, rules: "Nil" },
        { id: "3", name: "At-Risk", color: "orange", probability: 60, autoMove: true, rules: "Alert Account Manager" },
        { id: "4", name: "Dormant", color: "rose", probability: 20, autoMove: true, rules: "Move to cold storage" },
        { id: "5", name: "Churned", color: "zinc", probability: 0, autoMove: false, rules: "Archival" }
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1000)
    }

    const deleteStage = (id: string) => {
        setStages(prev => prev.filter(s => s.id !== id))
        toast.success("Stage removed from lifecycle")
    }

    const toggleAutoMove = (id: string) => {
        setStages(prev => prev.map(s => s.id === id ? { ...s, autoMove: !s.autoMove } : s))
        toast.info("Auto-transition policy updated")
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Lifecycle Archetypes</h1>
                            <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-black uppercase tracking-widest px-3">Journey Mapping</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Define post-conversion relationship stages and automated state transitions.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("System sync initiated")}
                        className="h-10 border-zinc-200 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Reset Standards
                    </Button>
                    <Button
                        onClick={() => handleAction("All stages published")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-100 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Append New Archetype
                    </Button>
                </div>
            </div>

            {/* LIFECYCLE STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Health Index</p>
                        <Activity className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">8.4 / 10</p>
                        <p className="text-[10px] text-white">Positive Retention Trend</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Expansion Opps</p>
                        <Target className="w-4 h-4 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-zinc-900">$142,500</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">+12% from last month</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Churn Exposure</p>
                        <UserMinus className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">08 Partners</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Immediate Action Required</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Engagement Rate</p>
                        <Clock className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">92%</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Avg Response time: 2.4h</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-zinc-100 bg-zinc-50/20">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-black text-zinc-900 uppercase italic tracking-widest">Archetype Sequence</h3>
                            <Badge className="bg-zinc-900 text-white rounded-md text-[10px]">REORDERABLE</Badge>
                        </div>
                        <p className="text-xs text-zinc-400 font-bold italic pr-8 leading-relaxed">Drag to reorder the relationship flow. Higher stages appear first in client details.</p>
                    </div>

                    <div className="p-6">
                        <Reorder.Group axis="y" values={stages} onReorder={setStages} className="space-y-4">
                            <AnimatePresence>
                                {stages.map((stage) => (
                                    <Reorder.Item
                                        key={stage.id}
                                        value={stage}
                                        className="bg-white p-4 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex items-center justify-between group cursor-grab active:cursor-grabbing"
                                    >
                                        <div className="flex items-center gap-5">
                                            <GripVertical className="w-5 h-5 text-zinc-200 group-hover:text-blue-300 transition-colors" />
                                            <div className={`w-10 h-10 rounded-xl bg-${stage.color}-50 flex items-center justify-center text-${stage.color}-600 border border-${stage.color}-100`}>
                                                <Zap className="w-5 h-5 shadow-sm" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-zinc-900 uppercase italic italic tracking-tight mb-0.5">{stage.name}</h4>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="text-[9px] font-bold border-zinc-100 text-zinc-400 bg-zinc-50/50 uppercase h-5 rounded-md">
                                                        Prob: {stage.probability}%
                                                    </Badge>
                                                    <span className="text-[10px] text-zinc-400 font-bold italic tracking-tight">{stage.rules}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="hidden md:flex flex-col items-end mr-4">
                                                <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-1.5 leading-none">Auto Transition</label>
                                                <Switch
                                                    checked={stage.autoMove}
                                                    onCheckedChange={() => toggleAutoMove(stage.id)}
                                                    className="data-[state=checked]:bg-blue-600 scale-75"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
                                                    onClick={() => handleAction(`Editing ${stage.name}`)}
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-50 rounded-lg">
                                                            <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-52 shadow-2xl border-zinc-100 p-2 rounded-xl">
                                                        <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-lg cursor-pointer">
                                                            <Activity className="w-3.5 h-3.5" /> Force Health Scan
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-xs font-bold gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-lg cursor-pointer"
                                                            onClick={() => deleteStage(stage.id)}
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" /> Remove Archetype
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </AnimatePresence>
                        </Reorder.Group>

                        <Button
                            variant="ghost"
                            className="w-full h-14 mt-6 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-300 hover:border-blue-100 hover:bg-blue-50/20 hover:text-blue-400 transition-all font-black uppercase text-[10px] tracking-widest"
                            onClick={() => handleAction("Stage appender tool ready")}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Insert Relationship Milestone
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-zinc-900 rounded-3xl text-white shadow-2xl relative overflow-hidden border-t border-white/10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <ShieldAlert className="w-5 h-5 text-blue-400" />
                            </div>
                            <h4 className="text-sm font-black uppercase italic tracking-widest">Smart Trigger AI</h4>
                        </div>
                        <p className="text-xs text-white/50 font-bold leading-relaxed mb-8 italic">Automatically move clients to 'At-Risk' if their monthly usage drops by more than 30% or if no invoice is generated for 60 days.</p>
                        <Button className="bg-white text-zinc-900 hover:bg-zinc-100 h-10 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest w-full">Configure AI Rules</Button>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    </div>

                    <div className="p-8 bg-white rounded-3xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-black text-zinc-900 uppercase italic tracking-widest mb-2 flex items-center gap-2">
                                <Settings className="w-4 h-4 text-blue-600" />
                                Sequence Policy
                            </h3>
                            <p className="text-[11px] text-zinc-400 font-bold italic leading-relaxed">Establish global rules for non-linear movement. Should clients be allowed to move backward in the lifecycle?</p>
                        </div>
                        <div className="mt-8 flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Allow Backward Flow</span>
                            <Switch className="data-[state=checked]:bg-blue-600" defaultChecked />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
