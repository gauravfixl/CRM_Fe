"use client"

import React from "react"
import { Zap, GitBranch, Settings2, Plus, ArrowRight, Play, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const WORKFLOWS = [
    { title: 'Standard Software', steps: 4, type: 'Agile', status: 'Active' },
    { title: 'Service Desk Flow', steps: 6, type: 'Support', status: 'Active' },
    { title: 'Creative Feedback', steps: 3, type: 'Design', status: 'Draft' },
]

export default function WorkflowSettingsPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Workflow Architect</h3>
                    <p className="text-slate-500 font-medium text-[13px]">Construct and automate the logical sequences of your project lifecycles.</p>
                </div>
                <Button className="h-10 px-6 bg-indigo-600 text-white rounded-xl font-bold text-[12px] gap-2 shadow-lg shadow-indigo-100">
                    <Plus size={16} />
                    New Blueprint
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {WORKFLOWS.map((wf, i) => (
                    <Card key={i} className="group border-none shadow-sm bg-white rounded-[32px] overflow-hidden hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500">
                        <CardContent className="p-6 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 bg-slate-900 rounded-[20px] flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                                    <GitBranch size={24} />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] px-2 h-5">{wf.type}</Badge>
                                        <Badge className={wf.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] px-2 h-5' : 'bg-slate-100 text-slate-400 border-none font-bold text-[9px] px-2 h-5'}>
                                            {wf.status}
                                        </Badge>
                                    </div>
                                    <h4 className="text-[16px] font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{wf.title}</h4>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right hidden md:block">
                                    <p className="text-[12px] font-bold text-slate-800">{wf.steps} States</p>
                                    <p className="text-[9px] font-medium text-slate-400 mt-1">Architecture</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="h-9 border border-slate-200 rounded-lg font-bold text-[11px] px-4 hover:bg-slate-50 text-slate-600">Editor</Button>
                                    <Button className="h-9 w-9 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                                        <Play size={14} />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Visual Flow Mockup */}
            <div className="bg-slate-900 rounded-[50px] p-12 text-white overflow-hidden relative group">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="space-y-1">
                        <h4 className="text-xl font-bold tracking-tight">Active Blueprint Analysis</h4>
                        <p className="text-slate-400 text-[11px] font-bold">Standard Software Lifecycle (v4.2)</p>
                    </div>
                    <Button variant="ghost" className="text-indigo-400 font-bold text-[12px] gap-2">
                        View Schema <ArrowRight size={16} />
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-8 relative z-10">
                    {[
                        { name: 'To Do', color: 'bg-slate-700' },
                        { name: 'Progress', color: 'bg-indigo-600' },
                        { name: 'Review', color: 'bg-amber-600' },
                        { name: 'Done', color: 'bg-emerald-600' }
                    ].map((step, i, arr) => (
                        <React.Fragment key={i}>
                            <div className={`h-24 w-40 ${step.color} rounded-[24px] flex flex-col items-center justify-center space-y-2 shadow-2xl border-2 border-white/5 group-hover:scale-105 transition-transform duration-500`}>
                                <LayoutGrid size={20} className="opacity-50" />
                                <span className="text-[11px] font-bold">{step.name}</span>
                            </div>
                            {i < arr.length - 1 && (
                                <div className="h-[2px] w-8 bg-white/10" />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-indigo-600/20 rounded-full blur-3xl" />
            </div>
        </div>
    )
}
