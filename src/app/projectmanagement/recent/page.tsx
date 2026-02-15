"use client"

import React, { useState, useEffect } from "react"
import {
    History,
    Layout,
    Search,
    Filter,
    Kanban,
    ChevronRight,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useIssueStore } from "@/shared/data/issue-store"
import { useProjectStore } from "@/shared/data/projects-store"
import Link from "next/link"

export default function RecentPage() {
    const [mounted, setMounted] = useState(false)
    const { issues } = useIssueStore()
    const { projects } = useProjectStore()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Mock recent items since we don't have a history store yet
    const recentItems = [
        { id: '1', type: 'project', title: 'Mission Critical Redesign', key: 'MCR', time: '10 mins ago', icon: '🚀' },
        { id: '2', type: 'issue', title: 'Implement Stripe Webhooks', key: 'MCR-102', time: '1 hour ago', parent: 'Mission Critical Redesign' },
        { id: '3', type: 'issue', title: 'Fix Layout glitch in Safari', key: 'CRM-44', time: '3 hours ago', parent: 'CRM Dashboard' },
        { id: '4', type: 'project', title: 'HRM Internal Portal', key: 'HRM', time: 'Yesterday', icon: '🏢' },
        { id: '5', type: 'issue', title: 'User Auth Bug #12', key: 'AUTH-1', time: 'Yesterday', parent: 'Security Engine' },
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
                            placeholder="Search history..."
                            className="pl-9 h-9 w-[200px] bg-white border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/10"
                        />
                    </div>
                    <Button variant="outline" size="sm" className="h-9 text-xs font-semibold gap-2">
                        <Filter size={14} /> Clear
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
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
                        {recentItems.map((item, i) => (
                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm ${item.type === 'project' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {item.type === 'project' ? <Layout size={16} /> : <Kanban size={16} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{item.title}</p>
                                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{item.key}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="outline" className="text-[10px] font-semibold text-slate-500 capitalize bg-white">
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
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 rounded-lg">
                                            <ChevronRight size={16} />
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center p-4">
                <p className="text-xs text-slate-400 italic">Showing last 5 items</p>
            </div>
        </div>
    )
}
