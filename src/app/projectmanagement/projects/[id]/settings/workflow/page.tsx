"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Workflow,
    ArrowLeft,
    Plus,
    Settings2,
    GripVertical,
    ArrowRight,
    MoreHorizontal,
    ShieldAlert,
    CheckCircle2,
    Clock,
    PlayCircle,
    RotateCcw,
    Lock,
    Unlock,
    Activity,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const DEFAULT_STATES = [
    { id: "todo", name: "To Do", color: "bg-slate-100 text-slate-600", type: "Initial" },
    { id: "inprogress", name: "In Progress", color: "bg-blue-100 text-blue-600", type: "Ongoing" },
    { id: "review", name: "In Review", color: "bg-amber-100 text-amber-600", type: "Ongoing" },
    { id: "done", name: "Done", color: "bg-emerald-100 text-emerald-600", type: "Final" },
]

export default function WorkflowEditorPage() {
    const { id } = useParams()
    const router = useRouter()
    const [states, setStates] = useState(DEFAULT_STATES)

    return (
        <div className="flex flex-col h-full gap-8 max-w-[1200px] mx-auto pb-20 font-sans">
            {/* Nav Header */}
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10 rounded-full hover:bg-slate-100">
                    <ArrowLeft size={20} className="text-slate-500" />
                </Button>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Workflow Configuration</h1>
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50/50 border-indigo-100">Project Default</Badge>
                    </div>
                    <p className="text-[14px] text-slate-500 font-medium">Define statuses and allowed transitions for this project's issues.</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <Button variant="outline" className="font-bold text-[13px] h-10 border-slate-200">Revert Changes</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-6 shadow-lg shadow-indigo-100">Save Workflow</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: States & Transitions Canvas */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Visualizer Note */}
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                        <ShieldAlert size={18} className="text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-[12.5px] text-amber-800 font-medium leading-relaxed">
                            **Standard Software Workflow:** Transitions are currently set to "All-to-All" by default. You can restrict specific movements by clicking the lock icon on a connection.
                        </p>
                    </div>

                    {/* States List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-[14px] font-bold text-slate-700 tracking-tight flex items-center gap-2">
                                <Activity size={16} className="text-indigo-500" />
                                Workflow States
                            </h3>
                            <Button variant="ghost" className="text-indigo-600 font-bold text-xs gap-1.5 h-8">
                                <Plus size={14} className="stroke-[3px]" />
                                Add New State
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {states.map((state, index) => (
                                <Card key={state.id} className="group border-slate-100 shadow-none hover:border-indigo-100 transition-all bg-white relative">
                                    <CardContent className="p-4 flex items-center gap-6">
                                        <div className="cursor-grab text-slate-300 group-hover:text-slate-400">
                                            <GripVertical size={18} />
                                        </div>

                                        <div className={`h-10 px-4 rounded-lg flex items-center justify-center font-bold text-[13px] min-w-[120px] ${state.color}`}>
                                            {state.name}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-center">
                                            <p className="text-[12px] font-bold text-slate-800 tracking-tight">{state.type} State</p>
                                            <p className="text-[11px] text-slate-400 font-medium">Mapped to Board Column: <span className="text-slate-500">{state.name}</span></p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors cursor-pointer" title="Transition Permitted">
                                                <Unlock size={14} />
                                            </div>
                                            <div className="h-8 w-8 rounded-lg bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-slate-100 hover:text-slate-500 transition-colors cursor-pointer">
                                                <Settings2 size={14} />
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500">
                                                <MoreHorizontal size={16} />
                                            </Button>
                                        </div>
                                    </CardContent>

                                    {/* Connection Line Visualizer (Simplified) */}
                                    {index < states.length - 1 && (
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
                                            <div className="h-8 w-[2px] bg-slate-100 flex items-center justify-center">
                                                <div className="h-4 w-4 rounded-full border border-slate-100 bg-white flex items-center justify-center shadow-sm">
                                                    <ChevronRight size={10} className="text-slate-300 rotate-90" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Options & Preview */}
                <div className="lg:col-span-4 space-y-8">

                    {/* Rules & Automations */}
                    <Card className="border-slate-200 shadow-sm bg-slate-50/20 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 bg-white">
                            <h4 className="text-[14px] font-bold text-slate-800 tracking-tight">Workflow Rules</h4>
                        </div>
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><CheckCircle2 size={16} /></div>
                                <div className="flex-1">
                                    <p className="text-[13px] font-bold text-slate-800">Auto-assign on Done</p>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">When task moves to Done, assign to Reporter for sign-off.</p>
                                </div>
                            </div>
                            <Separator className="bg-slate-200/50" />
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Clock size={16} /></div>
                                <div className="flex-1">
                                    <p className="text-[13px] font-bold text-slate-800">SLA Trigger</p>
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Alert Lead if task stays in Review for more than 48 hours.</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full text-indigo-600 font-bold text-[12px] h-9 gap-2 mt-2 hover:bg-white underline">
                                Manage Automations
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Preview Visualization Pin */}
                    <Card className="border-indigo-100 shadow-xl shadow-indigo-50 bg-white p-6 space-y-4">
                        <h4 className="text-[14px] font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            <PlayCircle size={16} className="text-indigo-500" />
                            Preview Board Impact
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[12px] font-bold text-slate-500">
                                <span>Transition Flow</span>
                                <span className="text-indigo-600">Linear (Active)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-16 bg-slate-100 rounded border border-slate-200" />
                                <ArrowRight size={12} className="text-slate-300" />
                                <div className="h-6 w-16 bg-indigo-100 rounded border border-indigo-200 animate-pulse" />
                                <ArrowRight size={12} className="text-slate-300" />
                                <div className="h-6 w-16 bg-slate-100 rounded border border-slate-200" />
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium italic">
                                Changing the workflow will immediately affect **144 active issues** across 3 teams.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
