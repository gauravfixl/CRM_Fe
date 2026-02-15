"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    TrendingUp,
    Users,
    Target,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    Activity,
    Filter,
    Download,
    Calendar,
    MousePointer2,
    TrendingDown,
    BarChart3,
    Globe,
    RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

export default function LeadGlobalInsightsPage() {
    const params = useParams()
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleAction = (msg: string) => {
        setIsRefreshing(true)
        setTimeout(() => {
            setIsRefreshing(false)
            toast.info(msg)
        }, 1500)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>STRATEGIC</span>
                    <span>/</span>
                    <span>INSIGHTS</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">PERFORMANCE</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Global Lead Intelligence</h1>
                        <p className="text-xs text-zinc-500 font-medium">Data visualization for organization-wide funnel health.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={isRefreshing}
                            onClick={() => handleAction("Intelligence data refreshed")}
                            className="h-8 rounded-md border-zinc-200 text-xs font-medium bg-white px-3 shadow-sm active:scale-95 transition-all"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
                            Sync Stats
                        </Button>
                        <Button
                            onClick={() => handleAction("Insight export started")}
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 shadow-sm active:scale-95 transition-all"
                        >
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS - PREMIUM 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* 3D BLUE CARD */}
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Inbound Velocity</p>
                        <MousePointer2 className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">3.2 Days</p>
                        <p className="text-[10px] text-white">+2.4% avg. win-rate</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Conversion Rate</p>
                        <Target className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">12.8%</p>
                        <p className="text-[10px] text-emerald-500 font-semibold tracking-tight">Optimal range</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Engagement Score</p>
                        <Zap className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">84/100</p>
                        <p className="text-[10px] text-zinc-400">High activity detected</p>
                    </SmallCardContent>
                </SmallCard>

                {/* 3D WHITE CARD */}
                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Active Pipeline</p>
                        <Globe className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">$4.8M</p>
                        <p className="text-[10px] text-zinc-400">Total estimated value</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* DASHBOARD GRIDS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-2">
                {/* LEAD SOURCES BLOCK */}
                <div className="md:col-span-8 bg-white rounded-lg border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">Inbound Source Distribution</h3>
                            <p className="text-xs text-zinc-400 font-medium mt-0.5">Global analytical breakdown</p>
                        </div>
                        <Badge className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-none font-bold text-[9px] px-3 py-1 uppercase tracking-widest">Live Data</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <SourceMetric label="Search Intelligence" percentage={45} color="bg-blue-600" count="1,240" />
                        <SourceMetric label="Social Channels" percentage={28} color="bg-blue-500" count="842" />
                        <SourceMetric label="Direct Referrals" percentage={15} color="bg-blue-400" count="312" />
                        <SourceMetric label="Field Actions" percentage={12} color="bg-zinc-300" count="240" />
                    </div>
                </div>

                {/* PERFORMANCE BY BU BLOCK */}
                <div className="md:col-span-4 bg-white rounded-lg border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider mb-6">Performance By BU</h3>
                    <div className="space-y-4">
                        <BUPerformance label="Fixl Solutions" leads="2.4k" trend="up" />
                        <BUPerformance label="Tech Vault" leads="1.1k" trend="up" />
                        <BUPerformance label="Global Hub" leads="842" trend="down" />
                        <BUPerformance label="Creative Lab" leads="210" trend="up" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function SourceMetric({ label, percentage, color, count }: { label: string, percentage: number, color: string, count: string }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-zinc-400">
                <span>{label}</span>
                <span className="text-zinc-900">{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full transition-all duration-1000 ${color} shadow-sm`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    )
}

function BUPerformance({ label, leads, trend }: { label: string, leads: string, trend: 'up' | 'down' }) {
    return (
        <div className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-xl border border-zinc-100 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-700 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{label}</span>
                <span className="text-[10px] text-zinc-400 font-medium">Business Unit</span>
            </div>
            <div className="text-right">
                <span className="text-base font-black text-zinc-900">{leads}</span>
                <p className={`text-[10px] font-black uppercase tracking-tighter mt-0.5 flex items-center justify-end gap-1 ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend === 'up' ? '12%' : '4%'}
                </p>
            </div>
        </div>
    )
}
