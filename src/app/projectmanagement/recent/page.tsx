"use client"

import React, { useState, useEffect } from "react"
import {
    History,
    Layout,
    Search,
    Filter,
    Kanban,
    ChevronRight,
    Clock,
    Activity,
    Users,
    FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import Link from "next/link"

interface RecentItem {
    id: string
    type: "project" | "issue"
    title: string
    key: string
    time: string
    parent?: string
    icon?: string
}

export default function RecentPage() {
    const [mounted, setMounted] = useState(false)
    const [query, setQuery] = useState("")
    const [typeFilter, setTypeFilter] = useState<"all" | "project" | "issue">("all")
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const recentItems: RecentItem[] = [
        { id: '1', type: 'project', title: 'Mission Critical Redesign', key: 'MCR', time: '10 mins ago', icon: '🚀' },
        { id: '2', type: 'issue', title: 'Implement Stripe Webhooks', key: 'MCR-102', time: '1 hour ago', parent: 'Mission Critical Redesign' },
        { id: '3', type: 'issue', title: 'Fix Layout glitch in Safari', key: 'CRM-44', time: '3 hours ago', parent: 'CRM Dashboard' },
        { id: '4', type: 'project', title: 'HRM Internal Portal', key: 'HRM', time: 'Yesterday', icon: '🏢' },
        { id: '5', type: 'issue', title: 'User Auth Bug #12', key: 'AUTH-1', time: 'Yesterday', parent: 'Security Engine' },
    ]

    const filteredItems = recentItems.filter(item => {
        const matchesType = typeFilter === "all" || item.type === typeFilter
        const q = query.trim().toLowerCase()
        const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.key.toLowerCase().includes(q) || (item.parent ?? "").toLowerCase().includes(q)
        return matchesType && matchesQuery
    })

    const totalCount = recentItems.length
    const projectCount = recentItems.filter(i => i.type === 'project').length
    const issueCount = recentItems.filter(i => i.type === 'issue').length

    const kpis = [
        { label: "Total Activity", value: totalCount, icon: <Activity size={18} />, color: "text-indigo-800", bg: "bg-indigo-100", onClick: () => setTypeFilter("all") },
        { label: "Projects Viewed", value: projectCount, icon: <Layout size={18} />, color: "text-emerald-800", bg: "bg-emerald-100", onClick: () => setTypeFilter("project") },
        { label: "Tasks Touched", value: issueCount, icon: <Kanban size={18} />, color: "text-amber-800", bg: "bg-amber-100", onClick: () => setTypeFilter("issue") },
        { label: "Last Active", value: "10m", icon: <Clock size={18} />, color: "text-rose-800", bg: "bg-rose-100", onClick: () => setTypeFilter("all") },
    ]

    return (
        <div className="w-full h-full p-6 space-y-6 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Activity</h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Your navigation history and recent actions.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search history..."
                            className="pl-9 h-9 w-[200px] bg-white border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/10 rounded-none"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setQuery(""); setTypeFilter("all") }}
                        className="h-9 text-xs font-semibold gap-2 rounded-none"
                    >
                        <Filter size={14} /> Clear
                    </Button>
                </div>
            </div>

            {/* KPI cards — clickable, filter by type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={stat.onClick}
                        className={`block border shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all h-[75px] rounded-none cursor-pointer text-left ${stat.bg}`}
                    >
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>
                                    {stat.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-500/60" />
                        </div>
                    </button>
                ))}
            </div>

            {/* Type tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {(["all", "project", "issue"] as const).map(t => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTypeFilter(t)}
                        className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide rounded-none border-b-2 transition-colors ${typeFilter === t
                            ? "text-indigo-700 border-indigo-600"
                            : "text-slate-500 border-transparent hover:text-slate-700"
                            }`}
                    >
                        {t === "all" ? "All" : t === "project" ? "Projects" : "Tasks"}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="border border-slate-200 overflow-hidden bg-white shadow-sm rounded-none">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredItems.map((item, i) => (
                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 flex items-center justify-center text-sm rounded-none ${item.type === 'project' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {item.type === 'project' ? <Layout size={16} /> : <Kanban size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{item.title}</p>
                                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.key}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="outline" className="text-[10px] font-semibold text-slate-500 capitalize bg-white rounded-none">
                                        {item.type}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs text-slate-500 font-medium">
                                        {item.parent || "Workspace Root"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-xs text-slate-400 font-medium">
                                    {item.time}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={item.type === 'project' ? `/projectmanagement/projects/${item.id}/board` : `/projectmanagement/my-work`}>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 rounded-none">
                                            <ChevronRight size={16} />
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {filteredItems.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-xs text-slate-400 font-medium">
                                    No activity matches your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center p-4">
                <p className="text-xs text-slate-400 italic">Showing {filteredItems.length} of {totalCount} items</p>
            </div>
        </div>
    )
}
