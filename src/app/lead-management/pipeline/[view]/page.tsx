"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    GitBranch,
    ChevronLeft,
    TrendingUp,
    Filter,
    Users,
    Clock,
    LayoutDashboard,
    AlertCircle,
    ArrowUpRight,
    Search,
    Download,
    Plus,
    MoreHorizontal,
    MoreVertical,
    Calendar,
    Target,
    BarChart3,
    ArrowRight,
    ChevronRight,
    User,
    DollarSign,
    Zap
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePipelineData, PipelineLead } from "@/shared/hooks/use-pipeline-data"

// --- Components for Each View ---

// 1. Board View (Kanban)
const BoardView = () => {
    const { leads, moveLead } = usePipelineData()
    const STAGES = [
        { id: 'new', title: 'New Leads', color: 'bg-blue-500' },
        { id: 'contacted', title: 'Contacted', color: 'bg-indigo-500' },
        { id: 'engaged', title: 'Engaged', color: 'bg-indigo-500' },
        { id: 'qualified', title: 'Qualified', color: 'bg-purple-500' },
        { id: 'proposal', title: 'Proposal', color: 'bg-amber-500' },
        { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-500' },
    ]

    return (
        <div className="flex gap-4 overflow-x-auto pb-6 min-h-[600px] custom-scrollbar">
            {STAGES.map((stage) => {
                const stageLeads = leads.filter(l => l.stage === stage.id);
                const totalValue = stageLeads.reduce((acc, lead) => acc + (parseInt(lead.value.replace(/[^0-9]/g, '')) || 0), 0);

                return (
                    <div key={stage.id} className="flex-shrink-0 w-[300px] flex flex-col gap-3 group">
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${stage.color}`} />
                                <h3 className="text-[13px] font-semibold text-slate-700">{stage.title}</h3>
                                <Badge variant="secondary" className="bg-white/50 text-slate-500 font-medium border-none h-5 px-1.5">{stageLeads.length}</Badge>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                        </div>

                        {(() => {
                            const colColors: Record<string, string> = {
                                new: "bg-slate-50 border-slate-200",
                                contacted: "bg-blue-50 border-blue-200",
                                engaged: "bg-indigo-50 border-indigo-200",
                                qualified: "bg-emerald-50 border-emerald-200",
                                proposal: "bg-amber-50 border-amber-200",
                                negotiation: "bg-orange-50 border-orange-200",
                                pending: "bg-rose-50 border-rose-200",
                                won: "bg-emerald-50 border-emerald-200",
                                lost: "bg-rose-50 border-rose-200"
                            }
                            const stageStyles = colColors[stage.id] || "bg-slate-50/50 border-slate-100"

                            return (
                                <div className={`flex flex-col gap-3 p-3 rounded-2xl min-h-[650px] border-2 border-dashed transition-all ${stageStyles} overflow-hidden`}>
                                    <div className="px-1 py-1 mb-1 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-medium text-slate-400 leading-none mb-1">Potential</p>
                                            <p className="text-[14px] font-semibold text-slate-800">${totalValue.toLocaleString()}</p>
                                        </div>
                                        <Zap className="h-3.5 w-3.5 text-slate-300" />
                                    </div>

                                    {stageLeads.map((lead) => (
                                        <Card key={lead.id} className="border-none shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing bg-white group/card ring-1 ring-slate-100">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="space-y-0.5">
                                                        <h4 className="text-[14px] font-semibold text-slate-900 leading-tight group-hover/card:text-indigo-600 transition-colors uppercase">{lead.name}</h4>
                                                        <p className="text-[11px] font-medium text-slate-500">{lead.company}</p>
                                                    </div>
                                                    <div className={`shrink-0 flex items-center justify-center p-1.5 rounded-lg ${lead.score > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                                                        <p className="text-[10px] font-bold">{lead.score}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                                                    <div className="flex items-center gap-1.5 text-slate-600">
                                                        <DollarSign className="h-3 w-3 text-slate-400" />
                                                        <span className="text-[12px] font-semibold text-slate-900 tracking-tight">{lead.value}</span>
                                                    </div>
                                                    <Avatar className="h-6 w-6 border-2 border-white shadow-sm">
                                                        <AvatarFallback className="text-[8px] font-bold bg-slate-100 text-slate-500">{lead.owner.split(' ')[0][0]}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    <Button variant="ghost" className="w-full justify-start h-10 border-dashed border-2 border-slate-200/50 text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 rounded-xl group transition-all">
                                        <Plus className="h-4 w-4 mr-2" />
                                        <span className="text-[12px] font-medium">Add Lead</span>
                                    </Button>
                                </div>
                            )
                        })()}
                    </div>
                );
            })}
        </div>
    )
}

// 2. Funnel View
const FunnelView = () => {
    const { leads } = usePipelineData()
    const totalLeadsCount = leads.length

    const funnelStages = [
        { label: 'Total Leads', count: totalLeadsCount, percentage: '100%', color: 'bg-blue-500' },
        { label: 'Contacted', count: leads.filter(l => l.stage === 'contacted').length, percentage: totalLeadsCount > 0 ? ((leads.filter(l => l.stage === 'contacted').length / totalLeadsCount) * 100).toFixed(1) + '%' : '0%', color: 'bg-indigo-500' },
        { label: 'Qualified', count: leads.filter(l => l.stage === 'qualified').length, percentage: totalLeadsCount > 0 ? ((leads.filter(l => l.stage === 'qualified').length / totalLeadsCount) * 100).toFixed(1) + '%' : '0%', color: 'bg-purple-500' },
        { label: 'Won', count: leads.filter(l => l.stage === 'won').length, percentage: totalLeadsCount > 0 ? ((leads.filter(l => l.stage === 'won').length / totalLeadsCount) * 100).toFixed(1) + '%' : '0%', color: 'bg-emerald-500' },
    ]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm bg-white p-6">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-lg font-semibold text-slate-800">Conversion Funnel Visualizer</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-4">
                    {funnelStages.map((stage, idx) => (
                        <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between text-[13px]">
                                <span className="font-semibold text-slate-700">{stage.label}</span>
                                <span className="font-semibold text-slate-900">{stage.count} <span className="text-slate-400 text-[11px] font-normal">({stage.percentage})</span></span>
                            </div>
                            <div className="h-10 w-full bg-slate-50 rounded-lg overflow-hidden flex">
                                <div
                                    className={`${stage.color} h-full opacity-90 relative transition-all duration-1000`}
                                    style={{ width: stage.percentage }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card className="border-none shadow-sm bg-indigo-600 text-white p-6">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-sm font-semibold opacity-80">Overall win rate</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                        <div className="text-4xl font-bold mb-2">{totalLeadsCount > 0 ? ((leads.filter(l => l.stage === 'won').length / totalLeadsCount) * 100).toFixed(1) + '%' : '0%'}</div>
                        <p className="text-[13px] opacity-80 leading-relaxed font-medium">
                            Your conversion tracking is live. Add more leads to improve statistical significance.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// 3. Stage Performance
const StagePerformance = () => {
    const tableData = [
        { stage: 'New Leads', count: 245, avgDays: 1.2, convRate: '68%', dropOff: '32%' },
        { stage: 'Contacted', count: 167, avgDays: 4.5, convRate: '52%', dropOff: '48%' },
        { stage: 'Qualified', count: 87, avgDays: 8.2, convRate: '45%', dropOff: '55%' },
        { stage: 'Proposal', count: 39, avgDays: 12.5, convRate: '62%', dropOff: '38%' },
        { stage: 'Negotiation', count: 24, avgDays: 15.0, convRate: '88%', dropOff: '12%' },
    ]

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-medium text-slate-500">Pipeline stage</th>
                            <th className="px-6 py-4 text-[11px] font-medium text-slate-500 text-center">Volume</th>
                            <th className="px-6 py-4 text-[11px] font-medium text-slate-500 text-center">Avg. time in stage</th>
                            <th className="px-6 py-4 text-[11px] font-medium text-slate-500 text-center">Conv. rate</th>
                            <th className="px-6 py-4 text-[11px] font-medium text-slate-500 text-center text-rose-500">Drop-off</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {tableData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <span className="text-[13px] font-semibold text-slate-900">{row.stage}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-[13px] font-medium text-slate-600">{row.count}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Badge variant="outline" className={`font-semibold ${row.avgDays > 10 ? 'border-rose-100 bg-rose-50 text-rose-600' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>
                                        {row.avgDays} Days
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-[13px] font-semibold text-emerald-600">{row.convRate}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-[13px] font-medium text-rose-500">{row.dropOff}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white p-6">
                    <div className="flex items-center gap-3 mb-4 text-amber-600">
                        <AlertCircle className="h-5 w-5" />
                        <h4 className="text-[14px] font-semibold">Bottleneck alert</h4>
                    </div>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                        Leads are spending <strong>8.2 days</strong> in the "Qualified" stage, which is a 40% increase from last month. Qualification criteria might be too broad.
                    </p>
                </Card>
                <Card className="border-none shadow-sm bg-white p-6">
                    <div className="flex items-center gap-3 mb-4 text-emerald-600">
                        <Zap className="h-5 w-5" />
                        <h4 className="text-[14px] font-semibold">Top efficiency</h4>
                    </div>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                        The "Negotiation" stage has an <strong>88% conversion rate</strong>. Closing strategies are effective once the deal reaches this phase.
                    </p>
                </Card>
                <Card className="border-none shadow-sm bg-white p-6">
                    <div className="flex items-center gap-3 mb-4 text-blue-600">
                        <Target className="h-5 w-5" />
                        <h4 className="text-[14px] font-semibold">Forecast impact</h4>
                    </div>
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                        Current pipeline velocity suggests <strong>$142,500</strong> will be realized in revenue over the next 30 days based on stage conversion rates.
                    </p>
                </Card>
            </div>
        </div>
    )
}

// 4. By Owner View
const ByOwnerView = () => {
    const ownersData = [
        { name: 'Rajesh K.', avatar: 'https://i.pravatar.cc/150?u=1', pipeValue: '$145,000', leads: 42, convRate: '24%', speed: '12 Days' },
        { name: 'Anita S.', avatar: 'https://i.pravatar.cc/150?u=2', pipeValue: '$98,400', leads: 28, convRate: '18%', speed: '15 Days' },
        { name: 'Sunil M.', avatar: 'https://i.pravatar.cc/150?u=5', pipeValue: '$112,000', leads: 35, convRate: '21%', speed: '13 Days' },
        { name: 'Pooja V.', avatar: 'https://i.pravatar.cc/150?u=7', pipeValue: '$56,000', leads: 19, convRate: '15%', speed: '18 Days' },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ownersData.map((owner, idx) => (
                <Card key={idx} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow group">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-indigo-50 shadow-sm">
                                    <AvatarImage src={owner.avatar} />
                                    <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-[16px] font-bold text-slate-900 leading-tight">{owner.name}</h3>
                                    <p className="text-[12px] font-medium text-slate-400">Senior Account Executive</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600">
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                                <p className="text-[10px] font-medium text-slate-400 mb-1">Pipeline value</p>
                                <p className="text-lg font-bold text-slate-900">{owner.pipeValue}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                                <p className="text-[10px] font-medium text-slate-400 mb-1">Conv. rate</p>
                                <p className="text-lg font-bold text-indigo-600">{owner.convRate}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                                <p className="text-[10px] font-medium text-slate-400 mb-1">Leads count</p>
                                <p className="text-lg font-bold text-slate-900">{owner.leads}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/50">
                                <p className="text-[10px] font-medium text-slate-400 mb-1">Avg. speed</p>
                                <p className="text-lg font-bold text-slate-900">{owner.speed}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-50">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-medium text-slate-400">Q1 target progress</span>
                                <span className="text-[11px] font-bold text-indigo-600">72%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: '72%' }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

// 5. Aging Analysis View
const AgingView = () => {
    const agingLeads = [
        { name: 'Rohan Deshmukh', company: 'Global Logistics', stage: 'Negotiation', days: 28, value: '$45,000', priority: 'High', owner: 'Rajesh K.' },
        { name: 'Sanya Iyer', company: 'Creative Co', stage: 'New Leads', days: 15, value: '$9,500', priority: 'Medium', owner: 'Sunil M.' },
        { name: 'Ishaan Gupta', company: 'Innovate Labs', stage: 'Qualified', days: 12, value: '$28,000', priority: 'High', owner: 'Rajesh K.' },
        { name: 'Vivek Singh', company: 'BuildRight Inc', stage: 'Proposal', days: 10, value: '$15,000', priority: 'Low', owner: 'Anita S.' },
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Stalled > 30 Days', count: 12, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Aging 14-30 Days', count: 28, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Healthy < 14 Days', count: 145, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Avg. Lead Age', count: '14.2d', color: 'text-slate-600', bg: 'bg-slate-50' },
                ].map((stat, i) => (
                    <Card key={i} className={`border-none shadow-sm ${stat.bg} p-4`}>
                        <p className="text-[10px] font-medium text-slate-400 mb-1">{stat.label}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                    </Card>
                ))}
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-slate-50 bg-white px-6 py-4">
                    <CardTitle className="text-sm font-semibold text-slate-800">Critical stagnant records (prioritized)</CardTitle>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-medium text-slate-500">Lead / company</th>
                                <th className="px-6 py-4 text-[10px] font-medium text-slate-500 text-center">Current stage</th>
                                <th className="px-6 py-4 text-[10px] font-medium text-slate-500 text-center text-rose-500">Days stagnant</th>
                                <th className="px-6 py-4 text-[10px] font-medium text-slate-500 text-center">Value</th>
                                <th className="px-6 py-4 text-[10px] font-medium text-slate-500 text-center">Priority</th>
                                <th className="px-6 py-4 text-[10px] font-medium text-slate-500 text-center">Intervention</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {agingLeads.map((lead, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="space-y-0.5">
                                            <p className="text-[13px] font-bold text-slate-900 leading-none">{lead.name}</p>
                                            <p className="text-[11px] font-medium text-slate-500">{lead.company}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none h-6 px-2">{lead.stage}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-[13px] font-bold ${lead.days > 20 ? 'text-rose-600' : 'text-amber-600'}`}>{lead.days} Days</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-[13px] font-semibold text-slate-900">{lead.value}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge className={`font-bold border-none h-6 px-2 ${lead.priority === 'High' ? 'bg-rose-100 text-rose-600' :
                                            lead.priority === 'Medium' ? 'bg-amber-100 text-amber-600' :
                                                'bg-slate-100 text-slate-500'
                                            }`}>
                                            {lead.priority}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 text-[11px] shadow-sm">
                                            Remind Rep
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

// --- Main Page Implementation ---

const VIEW_CONFIG: Record<string, { title: string; desc: string; icon: any; accent: string; component: React.FC }> = {
    board: {
        title: "Operational Board",
        desc: "Interactive lead lifecycle funnel. Drag leads through stages to update pipeline reality.",
        icon: LayoutDashboard,
        accent: "emerald",
        component: BoardView
    },
    funnel: {
        title: "Conversion Analysis",
        desc: "The 'Big Picture' funnel view. Identify leakage points and conversion efficiency from source to win.",
        icon: TrendingUp,
        accent: "blue",
        component: FunnelView
    },
    performance: {
        title: "Stage Velocity Dashboard",
        desc: "Data-driven analysis of how fast deals are moving. Benchmark your actuals against targets.",
        icon: Filter,
        accent: "amber",
        component: StagePerformance
    },
    owners: {
        title: "Rep Performance Index",
        desc: "Comparative pipeline health and conversion accuracy across the entire sales department.",
        icon: Users,
        accent: "indigo",
        component: ByOwnerView
    },
    aging: {
        title: "Aging & Deal Rot Analysis",
        desc: "The manager's critical watchlist. Immediate visibility into leads that have stalled beyond SLAs.",
        icon: Clock,
        accent: "rose",
        component: AgingView
    },
}

export default function PipelineViewPage() {
    const params = useParams()
    const router = useRouter()
    const view = (params.view as string) || 'board'
    const config = VIEW_CONFIG[view] || VIEW_CONFIG.board
    const ActiveComponent = config.component

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/lead-management')}
                        className="-ml-2 h-7 text-[10px] font-medium text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Lead Control Center
                    </Button>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg bg-${config.accent}-50 text-${config.accent}-600`}>
                                <config.icon className="h-4 w-4" />
                            </div>
                            <h1 className="text-[20px] font-bold tracking-tight text-slate-900 leading-none">
                                {config.title}
                            </h1>
                        </div>
                        <p className="text-[12px] text-slate-500 font-medium max-w-xl leading-relaxed">
                            {config.desc}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-10 px-4 flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-[12px] font-medium text-slate-600">Last 30 days</span>
                    </div>
                    <Button variant="outline" className="h-10 border-slate-200 text-slate-600 font-medium bg-white px-4 shadow-sm hover:bg-slate-50 transition-all">
                        <Download className="h-4 w-4 mr-2 text-slate-400" /> Report PDF
                    </Button>
                    <Button className={`h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 shadow-sm border-none transition-all`}>
                        Pipeline Setup
                    </Button>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="flex items-center gap-6 px-6 py-4 bg-white/50 rounded-2xl border border-dashed border-slate-200">
                <div className="flex items-center gap-3">
                    <p className="text-[10px] font-medium text-slate-400 leading-none">Total pipeline</p>
                    <p className="text-[15px] font-semibold text-slate-900">$425,000</p>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                    <p className="text-[10px] font-medium text-slate-400 leading-none">Avg. velocity</p>
                    <p className="text-[15px] font-semibold text-slate-900">14.2 Days</p>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                    <p className="text-[10px] font-medium text-emerald-600 leading-none flex items-center gap-1">
                        <Zap className="h-3 w-3" /> Live Updates
                    </p>
                </div>
            </div>

            {/* Dynamic View Content */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-700">
                <ActiveComponent />
            </div>

        </div>
    )
}
