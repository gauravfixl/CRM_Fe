"use client"

import React, { useEffect, useState } from "react"
import { GitBranch, Plus, ArrowRight, Settings2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProjectStore } from "@/shared/data/projects-store"
import { useWorkflowStore } from "@/shared/data/workflow-store"

export default function WorkflowSettingsPage() {
    const [mounted, setMounted] = useState(false)
    const { projects } = useProjectStore()
    const { getConfig } = useWorkflowStore()

    useEffect(() => {
        setMounted(true)
        useProjectStore.persist.rehydrate()
        useWorkflowStore.persist.rehydrate()
    }, [])

    if (!mounted) return null

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Workflow Architect</h3>
                    <p className="text-slate-500 font-medium text-[13px]">View and edit the workflow columns powering each project's board.</p>
                </div>
                <Link href="/projectmanagement/board-settings">
                    <Button className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 rounded-none">
                        <Plus size={14} /> Configure Board Columns
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {projects.length === 0 ? (
                    <Card className="border border-slate-200 bg-slate-50 rounded-none">
                        <CardContent className="py-10 text-center">
                            <GitBranch size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="text-sm font-medium text-slate-500">No projects yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    projects.map(p => {
                        const config = getConfig(p.id)
                        return (
                            <Card key={p.id} className="border border-slate-200 shadow-sm bg-white rounded-none hover:shadow-md transition-all">
                                <CardContent className="p-5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="h-12 w-12 bg-slate-900 text-white flex items-center justify-center shrink-0 rounded-none">
                                            <span className="text-xl">{p.icon || "📁"}</span>
                                        </div>
                                        <div className="space-y-1 min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge className="bg-slate-100 text-slate-600 text-[10px] font-bold rounded-none">{p.methodology?.toUpperCase() || "KANBAN"}</Badge>
                                                <Badge className="bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-none">{p.key}</Badge>
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-800 truncate">{p.name}</h4>
                                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                                {config.columns.slice().sort((a, b) => a.order - b.order).map((col) => (
                                                    <div key={col.id} className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-none">
                                                        <div className="h-2 w-2 rounded-none" style={{ backgroundColor: col.color }} />
                                                        <span className="text-[10px] font-bold text-slate-600">{col.name}</span>
                                                        {col.limit && col.limit > 0 && <span className="text-[9px] font-bold text-amber-600">WIP:{col.limit}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right hidden md:block">
                                            <p className="text-sm font-bold text-slate-800">{config.columns.length} states</p>
                                            <p className="text-[10px] font-medium text-slate-400">{config.transitions.length} transitions</p>
                                        </div>
                                        <Link href={`/projectmanagement/board-settings`}>
                                            <Button variant="outline" className="h-9 border-slate-200 text-xs font-bold rounded-none gap-1.5">
                                                <Settings2 size={14} /> Edit
                                            </Button>
                                        </Link>
                                        <Link href={`/projectmanagement/projects/${p.id}/board`}>
                                            <Button className="h-9 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-none gap-1.5">
                                                <ArrowRight size={14} />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
