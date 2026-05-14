"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Users,
    UserPlus,
    Zap,
    AlertCircle,
    Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const DEFAULT_CAPACITY = 40 // hours/points per sprint

export default function WorkloadReport() {
    const [mounted, setMounted] = useState(false)
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()
    const [projectFilter, setProjectFilter] = useState<string>("all")
    const [query, setQuery] = useState("")

    useEffect(() => {
        setMounted(true)
        useIssueStore.persist.rehydrate()
        useProjectStore.persist.rehydrate()
    }, [])

    const filteredIssues = useMemo(() => {
        const list = projectFilter === "all" ? issues : issues.filter(i => i.projectId === projectFilter)
        // Only active (non-done) issues count toward workload
        return list.filter(i => i.status !== "DONE" && i.status !== "COMPLETED")
    }, [issues, projectFilter])

    // Compute load per assignee
    const teamLoad = useMemo(() => {
        const map: Record<string, { name: string; avatar: string; assigneeId: string; used: number; tasks: number }> = {}
        filteredIssues.forEach(i => {
            const assigneeId = i.assigneeId || "unassigned"
            const name = i.assignee?.name || (assigneeId === "unassigned" ? "Unassigned" : assigneeId)
            const avatar = i.assignee?.avatar || ""
            if (!map[assigneeId]) {
                map[assigneeId] = { name, avatar, assigneeId, used: 0, tasks: 0 }
            }
            map[assigneeId].used += i.storyPoints || 0
            map[assigneeId].tasks += 1
        })
        return Object.values(map).sort((a, b) => b.used - a.used)
    }, [filteredIssues])

    const filtered = teamLoad.filter(m => !query.trim() || m.name.toLowerCase().includes(query.toLowerCase()))

    const totalPoints = teamLoad.reduce((s, m) => s + m.used, 0)
    const totalCapacity = Math.max(1, teamLoad.length) * DEFAULT_CAPACITY
    const occupancyPercent = Math.round((totalPoints / totalCapacity) * 100)
    const overloadedCount = teamLoad.filter(m => m.used > DEFAULT_CAPACITY).length
    const unassignedPts = (teamLoad.find(m => m.assigneeId === "unassigned")?.used) || 0

    if (!mounted) return null

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-widest">
                        <Users size={14} />
                        Resource Planning
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Workload & Capacity</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Identify bottlenecks and balance team workload.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Select value={projectFilter} onValueChange={setProjectFilter}>
                        <SelectTrigger className="h-9 w-44 text-xs rounded-none">
                            <SelectValue placeholder="All projects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All projects</SelectItem>
                            {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Occupancy", value: `${occupancyPercent}%`, icon: <Users size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
                    { label: "Overloaded", value: overloadedCount, icon: <AlertCircle size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
                    { label: "Active Members", value: teamLoad.filter(m => m.assigneeId !== "unassigned").length, icon: <UserPlus size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
                    { label: "Unassigned Pts", value: `${unassignedPts}`, icon: <Zap size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
                ].map((stat, i) => (
                    <div key={i} className={`block border shadow-sm h-[75px] rounded-none ${stat.bg}`}>
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>{stat.icon}</div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Team Distribution */}
            <div className="border border-slate-200 bg-white shadow-sm rounded-none">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Team Workload</h3>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">Cross-reference occupancy vs available story points</p>
                    </div>
                    <div className="relative w-56">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find member..." className="pl-9 h-9 bg-white border-slate-200 text-xs font-medium rounded-none" />
                    </div>
                </div>
                <div className="p-6 space-y-5">
                    {filtered.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-8">No active tasks to compute workload.</p>
                    ) : (
                        filtered.map((member, i) => {
                            const loadPercentage = (member.used / DEFAULT_CAPACITY) * 100
                            const isOverloaded = loadPercentage > 100

                            return (
                                <div key={member.assigneeId} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 ring-2 ring-white rounded-none">
                                                {member.avatar && <AvatarImage src={member.avatar} />}
                                                <AvatarFallback className="rounded-none">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">{member.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.tasks} active tasks</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className={`text-[13px] font-bold ${isOverloaded ? 'text-rose-600' : 'text-slate-800'}`}>
                                                    {member.used} / {DEFAULT_CAPACITY} pts
                                                </span>
                                                <Badge className={`${isOverloaded ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'} text-[10px] font-bold rounded-none`}>
                                                    {Math.round(loadPercentage)}% Load
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-none overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${isOverloaded ? 'bg-rose-500' : loadPercentage > 80 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                                            style={{ width: `${Math.min(loadPercentage, 100)}%` }}
                                        />
                                    </div>
                                    {isOverloaded && (
                                        <div className="flex items-center gap-1.5 text-rose-500">
                                            <AlertCircle size={10} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Exceeds capacity</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
