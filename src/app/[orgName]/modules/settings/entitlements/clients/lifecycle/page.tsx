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
    const [allowBackwardFlow, setAllowBackwardFlow] = useState(true)
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
        <div className="flex flex-col gap-4 p-4 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/70 to-primary flex items-center justify-center text-white shadow-sm">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-sm font-semibold text-zinc-900">Lifecycle Archetypes</h1>
                            <Badge className="bg-blue-50 text-blue-600 border-none rounded-md text-[10px] font-medium px-2">Journey Mapping</Badge>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium">Define post-conversion relationship stages and automated state transitions.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("System sync initiated")}
                        className="h-8 border-zinc-200 text-xs font-medium px-4 rounded-lg shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-3.5 h-3.5 mr-2" />
                        Reset Standards
                    </Button>
                    <Button
                        onClick={() => handleAction("All stages published")}
                        className="h-8 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 rounded-lg shadow-sm active:scale-95 transition-all"
                    >
                        <Plus className="w-3.5 h-3.5 mr-2" />
                        Append New Archetype
                    </Button>
                </div>
            </div>

            {/* LIFECYCLE STATS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none text-white rounded-xl shadow-sm">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white font-medium">Health Index</p>
                                <p className="text-xl font-semibold text-white mt-1">8.4 / 10</p>
                                <p className="text-[10px] text-white mt-1">Positive Retention Trend</p>
                            </div>
                            <Activity className="w-4 h-4 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Expansion Opps</p>
                                <p className="text-xl font-semibold text-zinc-900 mt-1">$142,500</p>
                                <p className="text-[10px] text-zinc-400 font-medium mt-1">+12% from last month</p>
                            </div>
                            <Target className="w-4 h-4 text-emerald-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Churn Exposure</p>
                                <p className="text-xl font-semibold text-zinc-900 mt-1">08 Partners</p>
                                <p className="text-[10px] text-zinc-400 font-medium mt-1">Immediate Action Required</p>
                            </div>
                            <UserMinus className="w-4 h-4 text-rose-500" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Engagement Rate</p>
                                <p className="text-xl font-semibold text-zinc-900 mt-1">92%</p>
                                <p className="text-[10px] text-zinc-400 font-medium mt-1">Avg Response time: 2.4h</p>
                            </div>
                            <Clock className="w-4 h-4 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/20">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-zinc-900">Archetype Sequence</h3>
                            <Badge className="bg-zinc-900 text-white rounded-md text-[10px] font-medium">Reorderable</Badge>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-medium pr-8 leading-relaxed">Drag to reorder the relationship flow. Higher stages appear first in client details.</p>
                    </div>

                    <div className="p-4">
                        <Reorder.Group axis="y" values={stages} onReorder={setStages} className="space-y-3">
                            <AnimatePresence>
                                {stages.map((stage) => (
                                    <Reorder.Item
                                        key={stage.id}
                                        value={stage}
                                        className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm hover:shadow-sm hover:border-blue-100 transition-all flex items-center justify-between group cursor-grab active:cursor-grabbing"
                                    >
                                        <div className="flex items-center gap-4">
                                            <GripVertical className="w-4 h-4 text-zinc-200 group-hover:text-blue-300 transition-colors" />
                                            <div className={`w-9 h-9 rounded-xl bg-${stage.color}-50 flex items-center justify-center text-${stage.color}-600 border border-${stage.color}-100`}>
                                                <Zap className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-semibold text-zinc-900 mb-0.5">{stage.name}</h4>
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="outline" className="rounded-md text-[10px] font-medium border-zinc-100 text-zinc-400 bg-zinc-50/50 h-5">
                                                        Prob: {stage.probability}%
                                                    </Badge>
                                                    <span className="text-[10px] text-zinc-400 font-medium">{stage.rules}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="hidden md:flex flex-col items-end mr-4">
                                                <label className="text-[10px] font-medium text-zinc-300 mb-1.5 leading-none">Auto Transition</label>
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
                                                    <DropdownMenuContent align="end" className="w-48 shadow-sm border-zinc-100 p-2 rounded-xl">
                                                        <DropdownMenuItem
                                                            className="text-xs font-medium gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-lg cursor-pointer"
                                                            onClick={() => {
                                                                toast.promise(new Promise(r => setTimeout(r, 1500)), {
                                                                    loading: "Running health scan...",
                                                                    success: "Health scan complete. All stages verified.",
                                                                    error: "Scan failed."
                                                                })
                                                            }}
                                                        >
                                                            <Activity className="w-3.5 h-3.5" /> Force Health Scan
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-xs font-medium gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-lg cursor-pointer"
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
                            className="w-full h-12 mt-4 border-2 border-dashed border-zinc-100 rounded-xl text-zinc-300 hover:border-blue-100 hover:bg-blue-50/20 hover:text-blue-400 transition-all font-medium text-xs"
                            onClick={() => handleAction("Stage appender tool ready")}
                        >
                            <Plus className="w-4 h-4 mr-2" /> Insert Relationship Milestone
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-900 rounded-xl text-white shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                                <ShieldAlert className="w-4 h-4 text-blue-400" />
                            </div>
                            <h4 className="text-sm font-semibold">Smart Trigger AI</h4>
                        </div>
                        <p className="text-[10px] text-white/50 font-medium leading-relaxed mb-6">Automatically move clients to 'At-Risk' if their monthly usage drops by more than 30% or if no invoice is generated for 60 days.</p>
                        <Button
                            className="bg-white text-zinc-900 hover:bg-zinc-100 h-8 px-4 rounded-lg font-medium text-xs w-full"
                            onClick={() => toast.info("AI rules configuration coming soon.")}
                        >
                            Configure AI Rules
                        </Button>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                                <Settings className="w-4 h-4 text-blue-600" />
                                Sequence Policy
                            </h3>
                            <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">Establish global rules for non-linear movement. Should clients be allowed to move backward in the lifecycle?</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                            <span className="text-[10px] font-medium text-zinc-500">Allow Backward Flow</span>
                            <Switch
                                className="data-[state=checked]:bg-blue-600"
                                checked={allowBackwardFlow}
                                onCheckedChange={(checked) => {
                                    setAllowBackwardFlow(checked)
                                    toast.info(checked ? "Backward flow enabled" : "Backward flow disabled")
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
