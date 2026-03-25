"use client"

import React from 'react'
import {
    Users,
    UserPlus,
    Target,
    TrendingUp,
    Clock,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    ChevronRight,
    ArrowRight,
    Plus,
    BarChart3,
    PieChart,
    Activity,
    ExternalLink,
    Zap,
    Download,
    ShieldCheck,
    Repeat,
    Phone,
    Mail,
    Calendar,
    Search,
    Filter,
    MoreHorizontal,
    Timer,
    Flame,
    History,
    FileText,
    TrendingDown,
    AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { useRouter } from 'next/navigation'
import { useToast } from "@/shared/components/ui/use-toast"
import AddLeadDialog from '@/shared/components/custom/leads/AddLeadDialog'
import { Progress } from "@/shared/components/ui/progress"
import { motion } from 'framer-motion'
import { axiosInstance as axios } from "@/lib/axios"

// --- Fallback Mock Data (used when API returns no data) ---

const MOCK_KPI_STATS = [
    { title: "Total Leads", value: "0", change: "--", trend: "up", icon: Users, color: "blue", path: "/lead-management/database/all" },
    { title: "Active Leads", value: "0", change: "--", trend: "up", icon: ShieldCheck, color: "indigo", path: "/lead-management/database/active" },
    { title: "Qualified %", value: "0%", change: "--", trend: "up", icon: Zap, color: "amber", path: "/lead-management/qualification/scoring" },
    { title: "Conversion %", value: "0%", change: "--", trend: "down", icon: Target, color: "purple", path: "/lead-management/pipeline/funnel" },
    { title: "Avg Response", value: "--", change: "--", trend: "up", icon: Clock, color: "emerald", path: "/lead-management/inbox/priority" },
    { title: "SLA Compliance", value: "--", change: "--", trend: "up", icon: ShieldCheck, color: "teal", path: "/lead-management/routing/sla" },
    { title: "Lead Velocity", value: "--", change: "--", trend: "up", icon: Timer, color: "orange", path: "/lead-management/pipeline/aging" },
    { title: "Pipeline Value", value: "--", change: "--", trend: "up", icon: TrendingUp, color: "cyan", path: "/lead-management/pipeline/board" },
    { title: "Capture ROI", value: "--", change: "--", trend: "up", icon: BarChart3, color: "violet", path: "/lead-management/campaigns/roi" },
    { title: "Lost Leads", value: "0", change: "--", trend: "down", icon: TrendingDown, color: "rose", path: "/lead-management/database/lost" },
]

const MOCK_LEAD_SOURCES = [
    { label: "Google Ads", count: 0, percentage: 0, color: "bg-blue-600" },
    { label: "LinkedIn", count: 0, percentage: 0, color: "bg-indigo-600" },
    { label: "Direct/SEO", count: 0, percentage: 0, color: "bg-emerald-600" },
    { label: "Referrals", count: 0, percentage: 0, color: "bg-amber-600" },
]

const FUNNEL_STAGES = ["New", "Contacted", "Qualified", "Proposal", "Won"]
const FUNNEL_COLORS = ["bg-blue-600", "bg-indigo-600", "bg-violet-600", "bg-purple-600", "bg-emerald-600"]

const SLA_HEALTH = [
    { label: "Unassigned Leads", value: 0, status: "warning", desc: "Action required within 30m" },
    { label: "Breaching SLA", value: 0, status: "critical", desc: "Immediate intervention" },
    { label: "Nearing Breach", value: 0, status: "danger", desc: "Due in < 15 mins" },
]

const PERFORMANCE_LEADERBOARD = [
    { name: "Rajesh Kumar", deals: 12, value: "$145k", time: "8m", conversion: "24%", avatar: "RK" },
    { name: "Anita Sharma", deals: 9, value: "$98k", time: "11m", conversion: "19%", avatar: "AS" },
    { name: "Sunil Moitra", deals: 7, value: "$112k", time: "14m", conversion: "15%", avatar: "SM" },
]

const AGING_ANALYSIS = [
    { label: "> 30 Days (At Risk)", count: 0, color: "bg-rose-500", percentage: 0 },
    { label: "> 14 Days (Stale)", count: 0, color: "bg-orange-500", percentage: 0 },
    { label: "< 7 Days (Healthy)", count: 0, color: "bg-emerald-500", percentage: 0 },
]

const RECENT_ALERTS = [
    { id: 1, type: "SLA", msg: "8 Leads breached Response SLA in last 1 hour", time: "4m ago", severity: "critical" },
    { id: 2, type: "Routing", msg: "Automation Rule 'Round-Robin' failed for 3 inbound leads", time: "12m ago", severity: "high" },
    { id: 3, type: "Integration", msg: "WhatsApp Business API disconnected for 5 mins", time: "24m ago", severity: "high" },
]

// Helper: compute KPI stats from leads data
function computeKpiFromLeads(leads: any[]) {
    const total = leads.length
    const activeStages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Follow Up', 'Negotiation']
    const wonStages = ['Won', 'Closed Won', 'Converted']
    const lostStages = ['Lost', 'Closed Lost', 'Rejected']

    const active = leads.filter(l => activeStages.includes(l.stage || l.status))
    const won = leads.filter(l => wonStages.includes(l.stage || l.status))
    const lost = leads.filter(l => lostStages.includes(l.stage || l.status))
    const qualified = leads.filter(l => l.stage === 'Qualified' || l.stage === 'Proposal' || l.stage === 'Negotiation' || wonStages.includes(l.stage || l.status))

    const qualifiedPct = total > 0 ? Math.round((qualified.length / total) * 100) : 0
    const conversionPct = total > 0 ? ((won.length / total) * 100).toFixed(1) : '0'

    return [
        { title: "Total Leads", value: total.toLocaleString(), change: `${total}`, trend: "up" as const, icon: Users, color: "blue", path: "/lead-management/database/all" },
        { title: "Active Leads", value: active.length.toLocaleString(), change: `${active.length}`, trend: "up" as const, icon: ShieldCheck, color: "indigo", path: "/lead-management/database/active" },
        { title: "Qualified %", value: `${qualifiedPct}%`, change: `${qualifiedPct}%`, trend: "up" as const, icon: Zap, color: "amber", path: "/lead-management/qualification/scoring" },
        { title: "Conversion %", value: `${conversionPct}%`, change: `${conversionPct}%`, trend: total > 0 ? "up" as const : "down" as const, icon: Target, color: "purple", path: "/lead-management/pipeline/funnel" },
        { title: "Avg Response", value: "--", change: "--", trend: "up" as const, icon: Clock, color: "emerald", path: "/lead-management/inbox/priority" },
        { title: "SLA Compliance", value: "--", change: "--", trend: "up" as const, icon: ShieldCheck, color: "teal", path: "/lead-management/routing/sla" },
        { title: "Lead Velocity", value: "--", change: "--", trend: "up" as const, icon: Timer, color: "orange", path: "/lead-management/pipeline/aging" },
        { title: "Pipeline Value", value: "--", change: "--", trend: "up" as const, icon: TrendingUp, color: "cyan", path: "/lead-management/pipeline/board" },
        { title: "Capture ROI", value: "--", change: "--", trend: "up" as const, icon: BarChart3, color: "violet", path: "/lead-management/campaigns/roi" },
        { title: "Lost Leads", value: lost.length.toLocaleString(), change: `${lost.length}`, trend: lost.length > 0 ? "down" as const : "up" as const, icon: TrendingDown, color: "rose", path: "/lead-management/database/lost" },
    ]
}

// Helper: compute source distribution from leads
function computeSourcesFromLeads(leads: any[]) {
    const sourceMap: Record<string, number> = {}
    leads.forEach(l => {
        const src = l.source || 'Direct'
        sourceMap[src] = (sourceMap[src] || 0) + 1
    })
    const total = leads.length || 1
    const colors = ["bg-blue-600", "bg-indigo-600", "bg-emerald-600", "bg-amber-600", "bg-violet-600", "bg-rose-600"]
    return Object.entries(sourceMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([label, count], i) => ({
            label,
            count,
            percentage: Math.round((count / total) * 100),
            color: colors[i % colors.length],
        }))
}

// Helper: compute funnel from leads
function computeFunnelFromLeads(leads: any[]) {
    const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won']
    const stageLabels = ['Capture', 'Contacted', 'Qualified', 'Proposal', 'Closed Won']
    const total = leads.length || 1
    return stages.map((stage, i) => {
        const count = leads.filter(l => {
            const lStage = l.stage || l.status || ''
            if (i === 0) return true // all leads enter the funnel
            return stages.slice(i).includes(lStage)
        }).length
        const pct = Math.round((count / total) * 100)
        const widthPct = pct
        return {
            label: stageLabels[i],
            count: count.toLocaleString(),
            conv: `${pct}%`,
            time: '--',
            color: FUNNEL_COLORS[i],
            width: `w-[${widthPct}%]`,
        }
    })
}

// Helper: compute aging from leads
function computeAgingFromLeads(leads: any[]) {
    const now = new Date()
    const atRisk = leads.filter(l => {
        const created = new Date(l.createdAt || l.date)
        return (now.getTime() - created.getTime()) > 30 * 24 * 60 * 60 * 1000
    })
    const stale = leads.filter(l => {
        const created = new Date(l.createdAt || l.date)
        const days = (now.getTime() - created.getTime()) / (24 * 60 * 60 * 1000)
        return days > 14 && days <= 30
    })
    const healthy = leads.filter(l => {
        const created = new Date(l.createdAt || l.date)
        return (now.getTime() - created.getTime()) <= 7 * 24 * 60 * 60 * 1000
    })
    const total = leads.length || 1
    return [
        { label: "> 30 Days (At Risk)", count: atRisk.length, color: "bg-rose-500", percentage: Math.round((atRisk.length / total) * 100) },
        { label: "> 14 Days (Stale)", count: stale.length, color: "bg-orange-500", percentage: Math.round((stale.length / total) * 100) },
        { label: "< 7 Days (Healthy)", count: healthy.length, color: "bg-emerald-500", percentage: Math.round((healthy.length / total) * 100) },
    ]
}

// Fallback for missing icon
function CheckCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}

export default function UniversalLeadDashboard() {
    const router = useRouter()
    const { toast } = useToast()
    const [alerts, setAlerts] = React.useState(RECENT_ALERTS)
    const [leads, setLeads] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)

    // Fetch leads from API on mount
    React.useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await axios.get('/lead/getAllLeads')
                const apiLeads = response?.data?.leads || response?.data || []
                if (Array.isArray(apiLeads)) {
                    setLeads(apiLeads)
                }
            } catch (err) {
                console.error('Failed to fetch leads:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchLeads()
    }, [])

    // Compute dynamic data from API leads
    const KPI_STATS = React.useMemo(() =>
        leads.length > 0 ? computeKpiFromLeads(leads) : MOCK_KPI_STATS,
        [leads]
    )
    const LEAD_SOURCES = React.useMemo(() =>
        leads.length > 0 ? computeSourcesFromLeads(leads) : MOCK_LEAD_SOURCES,
        [leads]
    )
    const FUNNEL_DATA = React.useMemo(() =>
        leads.length > 0 ? computeFunnelFromLeads(leads) : FUNNEL_STAGES.map((s, i) => ({
            label: s, count: "0", conv: "0%", time: "--", color: FUNNEL_COLORS[i], width: "w-[0%]"
        })),
        [leads]
    )
    const agingAnalysis = React.useMemo(() =>
        leads.length > 0 ? computeAgingFromLeads(leads) : AGING_ANALYSIS,
        [leads]
    )

    const handleSync = () => {
        toast({
            title: "System Synchronization",
            description: "Syncing latest lead data from all connected channels...",
        })
    }

    const handleExport = () => {
        const headers = ["Metric", "Value", "Trend"]
        const data = KPI_STATS.map(s => [s.title, s.value, s.change])
        const csvContent = [headers, ...data].map(e => e.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `Universal_Lead_Audit_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
            title: "Export Successful",
            description: "Metric audit report has been generated and downloaded.",
        })
    }

    const handleClearAlerts = () => {
        setAlerts([])
        toast({
            title: "Alerts Cleared",
            description: "All critical system alerts have been archived.",
        })
    }

    return (
        <div className="space-y-6 pb-16 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[22px] font-semibold tracking-tight text-slate-900 leading-tight">System Health & Performance</h1>
                    <p className="text-[14px] text-slate-500 font-medium mt-0.5 mt-1">Universal Lead Management Control Center — Capture to Conversion Intelligence.</p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="bg-white border-slate-200 text-slate-700 font-medium shadow-sm h-10 px-4 hover:bg-slate-50 transition-colors"
                    >
                        <Download className="h-4 w-4 mr-2" /> Audit Report
                    </Button>
                    <AddLeadDialog />
                </div>
            </div>

            {/* 1. KPI Summary Cards (2 Rows Grid) */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
                {KPI_STATS.map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <Card
                            onClick={() => router.push(stat.path)}
                            className={`relative border border-${stat.color}-200 shadow-sm bg-${stat.color}-50 hover:bg-${stat.color}-100 transition-all duration-300 group cursor-pointer overflow-hidden active:scale-95 h-full`}
                        >
                            <CardContent className="p-4 relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg bg-white border border-${stat.color}-100 text-${stat.color}-600 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <stat.icon className="h-4 w-4" />
                                    </div>
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 border border-${stat.color}-100/50`}>
                                        {stat.trend === 'up' ?
                                            <ArrowUpRight className={`h-3 w-3 ${stat.title.includes('Lost') ? 'text-rose-600' : 'text-emerald-600'}`} /> :
                                            <ArrowDownRight className={`h-3 w-3 ${stat.title.includes('Lost') ? 'text-emerald-600' : 'text-rose-600'}`} />
                                        }
                                        <span className={`text-[10px] font-bold ${stat.title.includes('Lost') ? (stat.trend === 'up' ? 'text-rose-600' : 'text-emerald-600') : (stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600')}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-medium text-slate-500">{stat.title}</p>
                                    <motion.p
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="text-[18px] font-semibold text-slate-800 tracking-tight leading-none"
                                    >
                                        {stat.value}
                                    </motion.p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Middle Section: Funnel & SLA Health */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* 3. Funnel Snapshot */}
                <Card className="lg:col-span-8 border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-50">
                        <div>
                            <CardTitle className="text-[15px] font-semibold text-slate-800">Pipeline Funnel Analysis</CardTitle>
                            <p className="text-[12px] text-slate-400 font-normal">Conversion efficiency & drop-off rates across stages</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.push('/lead-management/pipeline/funnel')} className="h-8 text-indigo-600 font-bold text-[12px] group">
                            Deep Dive <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {FUNNEL_DATA.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="flex items-center gap-6 group"
                                >
                                    <div className="w-28 shrink-0">
                                        <p className="text-[13px] font-bold text-slate-700">{item.label}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded">{item.conv}</span>
                                            <span className="text-[11px] font-medium text-slate-400">Avg {item.time}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="relative h-9 w-full bg-slate-50/50 rounded-md overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: item.width.replace('w-', '').replace('[', '').replace(']', '').replace('full', '100%') }}
                                                whileHover={{ scaleY: 1.05, filter: 'brightness(1.1)' }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.2, ease: "circOut", delay: 0.2 + (i * 0.1) }}
                                                className={`h-full ${item.color} relative flex items-center justify-end pr-4 shadow-sm cursor-pointer`}
                                            >
                                                <motion.span
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    transition={{ delay: 1 + (i * 0.1) }}
                                                    className="text-[12px] font-bold text-white drop-shadow-sm"
                                                >
                                                    {item.count}
                                                </motion.span>

                                                {/* Glossy Overlay Effect */}
                                                <div className="absolute inset-x-0 top-0 h-[30%] bg-white/10" />
                                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-black/10" />
                                            </motion.div>
                                        </div>
                                    </div>
                                    {i < FUNNEL_DATA.length - 1 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.8 + (i * 0.1) }}
                                            className="w-16 text-right hidden md:block"
                                        >
                                            <p className="text-[11px] font-bold text-rose-500">-{Math.round(100 - (parseInt(FUNNEL_DATA[i + 1].conv) / parseInt(item.conv) * 100))}%</p>
                                            <p className="text-[9px] font-bold text-slate-300 uppercase leading-none">Drop-off</p>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 4. SLA & Assignment Health */}
                <Card className="lg:col-span-4 border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="pb-4 border-b border-slate-50">
                        <CardTitle className="text-[15px] font-semibold text-slate-800 flex items-center gap-2">
                            <Repeat className="h-4 w-4 text-cyan-500" /> Operational Discipline
                        </CardTitle>
                        <p className="text-[12px] text-slate-400 font-normal">Assignment health & response timers</p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {SLA_HEALTH.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-5 hover:bg-slate-50/50 transition-colors flex items-center justify-between group cursor-pointer"
                                    onClick={() => router.push('/lead-management/inbox/sla')}
                                >
                                    <div className="space-y-1">
                                        <p className="text-[13px] font-medium text-slate-700">{item.label}</p>
                                        <p className="text-[11px] font-normal text-slate-400">{item.desc}</p>
                                    </div>
                                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm
                                        ${item.status === 'critical' ? 'bg-rose-100 text-rose-600' : item.status === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-orange-100 text-orange-600'}
                                        group-hover:scale-110 group-hover:rotate-6 transition-transform`}
                                    >
                                        {item.value}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="p-5 bg-slate-50/30 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Compliance Score</p>
                                <p className="text-[16px] font-bold text-emerald-600 mt-1">94.2% Healthy</p>
                            </div>
                            <Button size="sm" variant="ghost" className="h-8 text-[11px] font-bold text-indigo-600" onClick={() => router.push('/lead-management/routing')}>
                                View Rules <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Section Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 2. Lead Capture & Source Snapshot */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[14px] font-semibold text-slate-800 flex items-center gap-2">
                            <PieChart className="h-4 w-4 text-indigo-500" /> Acquisition Source
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5 px-6 pb-6">
                        {LEAD_SOURCES.map((source, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-[12px]">
                                    <span className="font-bold text-slate-700">{source.label}</span>
                                    <span className="font-bold text-slate-400">{source.count} <span className="text-slate-900 ml-1">({source.percentage}%)</span></span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${source.percentage}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                                        className={`h-full ${source.color} rounded-full`}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 5. Activity & Engagement Snapshot */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[14px] font-semibold text-slate-800 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-500" /> Activity Discipline
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div
                                onClick={() => router.push('/lead-management/activities/calls')}
                                className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center gap-3 cursor-pointer hover:bg-blue-100/50 transition-colors active:scale-95"
                            >
                                <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-blue-900 leading-none">425</p>
                                    <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase">Calls</p>
                                </div>
                            </div>
                            <div
                                onClick={() => router.push('/lead-management/activities/emails')}
                                className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center gap-3 cursor-pointer hover:bg-purple-100/50 transition-colors active:scale-95"
                            >
                                <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-purple-900 leading-none">1,102</p>
                                    <p className="text-[10px] font-bold text-purple-400 mt-1 uppercase">Emails</p>
                                </div>
                            </div>
                            <div
                                onClick={() => router.push('/lead-management/activities/meetings')}
                                className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center gap-3 cursor-pointer hover:bg-amber-100/50 transition-colors active:scale-95"
                            >
                                <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                    <Calendar className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-amber-900 leading-none">84</p>
                                    <p className="text-[10px] font-bold text-amber-400 mt-1 uppercase">Meetings</p>
                                </div>
                            </div>
                            <div
                                onClick={() => router.push('/lead-management/activities/overdue')}
                                className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center gap-3 cursor-pointer hover:bg-rose-100/50 transition-colors active:scale-95"
                            >
                                <div className="h-8 w-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                                    <History className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[14px] font-bold text-rose-900 leading-none">56</p>
                                    <p className="text-[10px] font-bold text-rose-400 mt-1 uppercase">Overdue</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Leads w/o Activity</p>
                                <p className="text-[14px] font-bold text-rose-600">32 Leads</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500 font-bold">Health: Stable</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* 6. Lead Quality & Scoring Overview */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[14px] font-semibold text-slate-800 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-indigo-500" /> Quality & Scoring
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                                    <span>HIGH SCORE</span>
                                    <span>65%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "65%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, ease: "circOut" }}
                                        className="h-full bg-emerald-500 rounded-full"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                                    <span>MQL COUNT</span>
                                    <span>425</span>
                                </div>
                                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "80%" }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                                        className="h-full bg-indigo-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Elite Tier Leads (Score > 90)", count: 24, trend: "up", change: 8, path: "/lead-management/qualification/insights" },
                                { label: "Mid-Market Qualified", count: 186, trend: "up", change: 12, path: "/lead-management/qualification/distribution" },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => router.push(item.path)}
                                    className="flex items-center justify-between p-3 rounded-lg border border-slate-50 group hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer active:scale-95"
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-[12px] font-bold text-slate-700">{item.label}</p>
                                        <p className="text-[10px] font-medium text-slate-400">Monthly Growth: <span className="text-emerald-500 font-bold">+{item.change}%</span></p>
                                    </div>
                                    <p className="text-[16px] font-bold text-slate-900">{item.count}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 7. Performance Snapshot */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-[14px] font-semibold text-slate-800 flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-500" /> Rep Productivity
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => router.push('/lead-management/reports/performance')} className="h-7 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Team Stats</Button>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="space-y-3">
                            {PERFORMANCE_LEADERBOARD.map((rep, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[12px] font-bold text-slate-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            {rep.avatar}
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-bold text-slate-900 leading-none">{rep.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold text-emerald-600">{rep.deals} Deals</span>
                                                <span className="text-[10px] font-medium text-slate-300">|</span>
                                                <span className="text-[10px] font-bold text-indigo-500">Conv: {rep.conversion}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[13px] font-bold text-slate-900">{rep.value}</p>
                                        <p className="text-[10px] font-medium text-slate-400 flex items-center justify-end gap-1"><Timer className="h-2.5 w-2.5" /> {rep.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 8. Aging & Risk Indicators */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[14px] font-semibold text-slate-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" /> Pipeline Aging & Risk
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="flex gap-1.5 h-4 mb-6 rounded-full overflow-hidden">
                            {agingAnalysis.map((item, i) => (
                                <div key={i} className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                            ))}
                        </div>
                        <div className="space-y-4">
                            {agingAnalysis.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                                        <p className="text-[13px] font-bold text-slate-700">{item.label}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-[13px] font-bold text-slate-900">{item.count}</p>
                                        <span className="text-[11px] font-bold text-slate-400 w-10 text-right">{item.percentage}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 10. Alerts Panel */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-[14px] font-semibold text-slate-800 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-amber-500" /> Critical System Alerts
                        </CardTitle>
                        <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Badge variant="destructive" className="text-[9px] uppercase tracking-widest font-bold">Live</Badge>
                        </motion.div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50 max-h-[280px] overflow-y-auto custom-scrollbar">
                            {alerts.length > 0 ? alerts.map((alert) => (
                                <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer border-l-4 border-transparent hover:border-indigo-500">
                                    <div className="flex justify-between items-start mb-1">
                                        <Badge className={`text-[9px] font-bold border-none capitalize 
                                            ${alert.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {alert.type}
                                        </Badge>
                                        <span className="text-[10px] font-medium text-slate-400">{alert.time}</span>
                                    </div>
                                    <p className="text-[12px] font-bold text-slate-700 leading-snug group-hover:text-slate-900">{alert.msg}</p>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-400">
                                    <ShieldCheck className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                    <p className="text-[12px] font-bold uppercase tracking-widest">System is healthy</p>
                                </div>
                            )}
                        </div>
                        <Button variant="ghost" onClick={handleClearAlerts} className="w-full h-10 text-[11px] font-bold text-slate-400 hover:text-indigo-600 border-t border-slate-50">
                            Clear Notifications <ArrowRight className="h-3 w-3 ml-2" />
                        </Button>
                    </CardContent>
                </Card>

            </div>

            {/* 9. Conversion & Forecast Summary */}
            <Card className="border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                <CardContent className="p-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-2">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Revenue Forecast</p>
                            <h3 className="text-3xl font-black tracking-tight text-slate-900">$3.2M <span className="text-[14px] font-bold text-slate-400 ml-1">Expected</span></h3>
                            <p className="text-[12px] text-slate-500 font-medium">Based on weighted pipeline value</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase mb-2">
                                    <span>Target Progress</span>
                                    <span className="text-indigo-600">74%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full w-[74%] shadow-sm" />
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-tight">We are <span className="text-indigo-600 font-bold">$125k</span> away from hitting Q1 targets.</p>
                        </div>
                        <div className="md:col-span-2 flex items-center md:justify-end gap-6 text-right">
                            <div className="hidden lg:block text-right">
                                <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Efficiency Ratio</p>
                                <p className="text-xl font-bold text-slate-900">1:4.2 <span className="text-[12px] text-emerald-500 font-bold italic ml-1">Top 5%</span></p>
                            </div>
                            <Button onClick={() => router.push('/lead-management/reports/executive')} className="bg-slate-900 hover:bg-indigo-600 text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95">
                                View Full Analytics Report
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
