"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
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
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { getLeadListByOrg } from "@/hooks/leadHooks"

interface Lead {
    _id: string
    name: string
    email: string
    company: string
    stage: string
    source: string
    estimatedValue: number
    isDeleted: boolean
    createdAt: string
}

export default function LeadGlobalInsightsPage() {
    const params = useParams()
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [leads, setLeads] = useState<Lead[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    const fetchLeads = useCallback(async () => {
        try {
            const res = await getLeadListByOrg()
            const data = res?.data?.data || []
            setLeads(data)
            setIsLoaded(true)
        } catch (error) {
            console.error("Failed to fetch leads for insights:", error)
            setLeads([])
            setIsLoaded(true)
        }
    }, [])

    useEffect(() => {
        fetchLeads()
    }, [fetchLeads])

    const handleSyncStats = async () => {
        setIsRefreshing(true)
        try {
            await fetchLeads()
            toast.info("Intelligence data refreshed")
        } catch {
            toast.error("Failed to refresh data")
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleExport = () => {
        toast.info("Insight export started")
    }

    // --- Computed Stats ---
    const conversionRate = useMemo(() => {
        if (leads.length === 0) return "0.0"
        const wonCount = leads.filter(l => l.stage === "Won").length
        return ((wonCount / leads.length) * 100).toFixed(1)
    }, [leads])

    const activePipeline = useMemo(() => {
        const closedStages = ["Won", "Lost"]
        const nonClosedLeads = leads.filter(l => !closedStages.includes(l.stage))
        const total = nonClosedLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0)
        return total
    }, [leads])

    const formattedPipeline = useMemo(() => {
        if (activePipeline >= 1_000_000) {
            return `$${(activePipeline / 1_000_000).toFixed(1)}M`
        } else if (activePipeline >= 1_000) {
            return `$${(activePipeline / 1_000).toFixed(1)}K`
        }
        return `$${activePipeline.toLocaleString()}`
    }, [activePipeline])

    // --- Source Distribution ---
    const sourceDistribution = useMemo(() => {
        if (leads.length === 0) {
            return [
                { label: "Website", percentage: 0, color: "bg-blue-600", count: "0" },
                { label: "Referral", percentage: 0, color: "bg-blue-500", count: "0" },
                { label: "Social Media", percentage: 0, color: "bg-blue-400", count: "0" },
                { label: "Other", percentage: 0, color: "bg-zinc-300", count: "0" },
            ]
        }

        const sourceCounts: Record<string, number> = {}
        leads.forEach(l => {
            const src = l.source || "Other"
            sourceCounts[src] = (sourceCounts[src] || 0) + 1
        })

        const sorted = Object.entries(sourceCounts)
            .sort((a, b) => b[1] - a[1])

        const colors = ["bg-blue-600", "bg-blue-500", "bg-blue-400", "bg-zinc-300", "bg-indigo-400", "bg-cyan-400"]

        // Show top sources; group remaining into "Other" if more than 4
        let displaySources: { label: string; count: number }[]
        if (sorted.length <= 4) {
            displaySources = sorted.map(([label, count]) => ({ label, count }))
        } else {
            const top3 = sorted.slice(0, 3)
            const restCount = sorted.slice(3).reduce((sum, [, c]) => sum + c, 0)
            displaySources = [
                ...top3.map(([label, count]) => ({ label, count })),
                { label: "Other", count: restCount }
            ]
        }

        return displaySources.map((item, idx) => ({
            label: item.label,
            percentage: Math.round((item.count / leads.length) * 100),
            color: colors[idx] || "bg-zinc-300",
            count: item.count.toLocaleString(),
        }))
    }, [leads])

    const conversionLabel = useMemo(() => {
        const rate = parseFloat(conversionRate)
        if (rate >= 10) return "Optimal range"
        if (rate >= 5) return "Average range"
        return "Needs improvement"
    }, [conversionRate])

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>Strategic</span>
                    <span>/</span>
                    <span>Insights</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">Performance</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">Global Lead Intelligence</h1>
                        <p className="text-xs text-zinc-500 font-medium">Data visualization for organization-wide funnel health.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            disabled={isRefreshing}
                            onClick={handleSyncStats}
                            className="h-8 rounded-md border-zinc-200 text-xs font-medium bg-white px-3 shadow-sm active:scale-95 transition-all"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
                            Sync Stats
                        </Button>
                        <Button
                            onClick={handleExport}
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 shadow-sm active:scale-95 transition-all"
                        >
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Primary Blue Card */}
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-white text-xs opacity-80">Inbound Velocity</p>
                                <p className="text-white text-xl font-semibold">3.2 Days</p>
                                <p className="text-[10px] text-white opacity-70">+2.4% avg. win-rate</p>
                            </div>
                            <MousePointer2 className="w-5 h-5 text-white opacity-80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                {/* White Card */}
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-600">Conversion Rate</p>
                                <p className="text-xl font-semibold text-gray-900">{conversionRate}%</p>
                                <p className="text-[10px] text-emerald-500 font-medium">{conversionLabel}</p>
                            </div>
                            <Target className="w-5 h-5 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                {/* White Card */}
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-600">Engagement Score</p>
                                <p className="text-xl font-semibold text-gray-900">84/100</p>
                                <p className="text-[10px] text-zinc-400">High activity detected</p>
                            </div>
                            <Zap className="w-5 h-5 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                {/* White Card */}
                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <p className="text-xs text-gray-600">Active Pipeline</p>
                                <p className="text-xl font-semibold text-gray-900">{formattedPipeline}</p>
                                <p className="text-[10px] text-zinc-400">Total estimated value</p>
                            </div>
                            <Globe className="w-5 h-5 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Dashboard Grids */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-2">
                {/* Lead Sources Block */}
                <div className="md:col-span-8 bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Inbound Source Distribution</h3>
                            <p className="text-xs text-zinc-400 font-medium mt-0.5">Global analytical breakdown</p>
                        </div>
                        <Badge className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border-none font-medium text-[9px] px-3 py-1">Live Data</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {sourceDistribution.map((src, idx) => (
                            <SourceMetric
                                key={idx}
                                label={src.label}
                                percentage={src.percentage}
                                color={src.color}
                                count={src.count}
                            />
                        ))}
                    </div>
                </div>

                {/* Performance By BU Block */}
                <div className="md:col-span-4 bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-medium text-gray-900 mb-6">Performance By BU</h3>
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
            <div className="flex justify-between items-center text-[10px] font-medium text-zinc-400">
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
                <span className="text-xs font-medium text-zinc-700 group-hover:text-blue-600 transition-colors">{label}</span>
                <span className="text-[10px] text-zinc-400 font-medium">Business Unit</span>
            </div>
            <div className="text-right">
                <span className="text-base font-semibold text-zinc-900">{leads}</span>
                <p className={`text-[10px] font-medium mt-0.5 flex items-center justify-end gap-1 ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend === 'up' ? '12%' : '4%'}
                </p>
            </div>
        </div>
    )
}
