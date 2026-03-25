"use client"

import React, { useState, useMemo } from 'react'
import {
    Download,
    RefreshCw,
    Calendar,
    TrendingUp,
    DollarSign,
    Users,
    Target,
    BarChart3,
    ArrowUpRight,
    PieChart as PieChartIcon,
    ShieldCheck,
    Search,
    Filter,
    ArrowDownRight,
    Zap,
    Clock,
    HeartPulse,
    AlertCircle,
    Loader2,
    Globe
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { useRouter } from 'next/navigation'
import { toast } from "@/shared/utils/toast"

// --- Dynamic Data Mapping ---
const DATA_BY_RANGE = {
    "this-month": {
        metrics: [
            { title: "Monthly Revenue", value: "$1.2M", change: "+4.2%", trend: "up" as const, icon: DollarSign, color: "indigo" },
            { title: "New Clients", value: "+24", change: "+15.3%", trend: "up" as const, icon: Users, color: "emerald" },
            { title: "Growth Rate", value: "8.5%", change: "+1.2%", trend: "up" as const, icon: Target, color: "violet" },
            { title: "Churn Rate", value: "1.2%", change: "+0.3%", trend: "down" as const, icon: BarChart3, color: "rose" }
        ],
        kpis: [
            { id: 1, title: "Revenue Achievement", current: 1200000, target: 1100000, status: "Exceeded", trend: "up" },
            { id: 2, title: "Customer Retention", current: 98.2, target: 95.0, status: "Exceeded", trend: "up" },
            { id: 3, title: "Market Entry", current: 1, target: 2, status: "On Track", trend: "up" },
            { id: 4, title: "Avg Deal Size", current: 42000, target: 40000, status: "Healthy", trend: "up" }
        ],
        departments: [
            { name: "Strategic Sales", performance: 88, budget: "$350K", head: "Sarah Jenkins", color: "bg-blue-500" },
            { name: "Global Operations", performance: 82, budget: "$210K", head: "Michael Chen", color: "bg-amber-500" },
            { name: "Product Engineering", performance: 94, budget: "$520K", head: "Elena Rodriguez", color: "bg-emerald-500" },
            { name: "Customer Experience", performance: 90, budget: "$95K", head: "David Smith", color: "bg-violet-500" }
        ],
        regions: [
            { name: "North America", share: 40, growth: "+14.5%", status: "Steady" },
            { name: "Europe", share: 32, growth: "+6.2%", status: "Normal" },
            { name: "Asia Pacific", share: 18, growth: "+25.4%", status: "Aggressive" },
            { name: "Other", share: 10, growth: "+2.3%", status: "Stable" }
        ]
    },
    "this-quarter": {
        metrics: [
            { title: "Total Annual Revenue", value: "$14.2M", change: "+18.2%", trend: "up" as const, icon: DollarSign, color: "indigo" },
            { title: "Net Client Growth", value: "+142", change: "+12.5%", trend: "up" as const, icon: Users, color: "emerald" },
            { title: "Market Expansion", value: "24.5%", change: "+5.3%", trend: "up" as const, icon: Target, color: "violet" },
            { title: "Operating Margin", value: "32.8%", change: "-2.1%", trend: "down" as const, icon: BarChart3, color: "rose" }
        ],
        kpis: [
            { id: 1, title: "Revenue Achievement", current: 14200000, target: 15000000, status: "On Track", trend: "up" },
            { id: 2, title: "Customer Retention", current: 97.6, target: 95.0, status: "Exceeded", trend: "up" },
            { id: 3, title: "New Market Entry", current: 4, target: 6, status: "Critical", trend: "down" },
            { id: 4, title: "Average Deal Size", current: 45000, target: 40000, status: "Healthy", trend: "up" }
        ],
        departments: [
            { name: "Strategic Sales", performance: 92, budget: "$4.2M", head: "Sarah Jenkins", color: "bg-blue-500" },
            { name: "Global Operations", performance: 78, budget: "$2.8M", head: "Michael Chen", color: "bg-amber-500" },
            { name: "Product Engineering", performance: 95, budget: "$6.4M", head: "Elena Rodriguez", color: "bg-emerald-500" },
            { name: "Customer Experience", performance: 88, budget: "$1.2M", head: "David Smith", color: "bg-violet-500" }
        ],
        regions: [
            { name: "North America", share: 42, growth: "+15.2%", status: "Steady" },
            { name: "Europe", share: 30, growth: "+5.4%", status: "Normal" },
            { name: "Asia Pacific", share: 20, growth: "+22.1%", status: "Aggressive" },
            { name: "Other", share: 8, growth: "+1.5%", status: "Stable" }
        ]
    },
    "this-year": {
        metrics: [
            { title: "Yearly Revenue Forecast", value: "$52.4M", change: "+22.5%", trend: "up" as const, icon: DollarSign, color: "indigo" },
            { title: "Total Client Base", value: "1,240", change: "+8.9%", trend: "up" as const, icon: Users, color: "emerald" },
            { title: "Global Market Share", value: "12.4%", change: "+2.1%", trend: "up" as const, icon: Target, color: "violet" },
            { title: "Annual ROI", value: "42.8%", change: "+5.4%", trend: "up" as const, icon: BarChart3, color: "rose" }
        ],
        kpis: [
            { id: 1, title: "Revenue Achievement", current: 52400000, target: 50000000, status: "Exceeded", trend: "up" },
            { id: 2, title: "Customer Retention", current: 96.8, target: 95.0, status: "Healthy", trend: "up" },
            { id: 3, title: "New Market Entry", current: 18, target: 20, status: "On Track", trend: "up" },
            { id: 4, title: "Average Deal Size", current: 48000, target: 45000, status: "Exceeded", trend: "up" }
        ],
        departments: [
            { name: "Strategic Sales", performance: 96, budget: "$18.5M", head: "Sarah Jenkins", color: "bg-blue-500" },
            { name: "Global Operations", performance: 85, budget: "$12.2M", head: "Michael Chen", color: "bg-amber-500" },
            { name: "Product Engineering", performance: 98, budget: "$24.8M", head: "Elena Rodriguez", color: "bg-emerald-500" },
            { name: "Customer Experience", performance: 92, budget: "$5.4M", head: "David Smith", color: "bg-violet-500" }
        ],
        regions: [
            { name: "North America", share: 45, growth: "+12.4%", status: "Leading" },
            { name: "Europe", share: 28, growth: "+8.2%", status: "Stable" },
            { name: "Asia Pacific", share: 22, growth: "+18.5%", status: "High Growth" },
            { name: "Other", share: 5, growth: "+2.1%", status: "Exploring" }
        ]
    }
}

// Helper Components
const MetricCard = ({ title, value, change, trend, icon: Icon, color, path }: {
    title: string
    value: string
    change: string
    trend: "up" | "down"
    icon: any
    color: string
    path?: string
}) => {
    const router = useRouter()

    const handleClick = () => {
        if (path) {
            router.push(path)
        }
    }

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'indigo':
                return {
                    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50',
                    iconBg: 'bg-indigo-100',
                    iconColor: 'text-indigo-600',
                    border: 'border-indigo-200/50'
                }
            case 'emerald':
                return {
                    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
                    iconBg: 'bg-emerald-100',
                    iconColor: 'text-emerald-600',
                    border: 'border-emerald-200/50'
                }
            case 'violet':
                return {
                    bg: 'bg-gradient-to-br from-violet-50 to-violet-100/50',
                    iconBg: 'bg-violet-100',
                    iconColor: 'text-violet-600',
                    border: 'border-violet-200/50'
                }
            case 'rose':
                return {
                    bg: 'bg-gradient-to-br from-rose-50 to-rose-100/50',
                    iconBg: 'bg-rose-100',
                    iconColor: 'text-rose-600',
                    border: 'border-rose-200/50'
                }
            case 'cyan':
                return {
                    bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100/50',
                    iconBg: 'bg-cyan-100',
                    iconColor: 'text-cyan-600',
                    border: 'border-cyan-200/50'
                }
            case 'amber':
                return {
                    bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50',
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    border: 'border-amber-200/50'
                }
            default:
                return {
                    bg: 'bg-gradient-to-br from-gray-50 to-gray-100/50',
                    iconBg: 'bg-slate-100',
                    iconColor: 'text-slate-500',
                    border: 'border-slate-200/50'
                }
        }
    }

    const colorClasses = getColorClasses(color)

    return (
        <Card className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-${color}-100/50 ${path ? 'hover:scale-[1.02]' : ''} ${colorClasses.bg} ${colorClasses.border} border`} onClick={handleClick}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${colorClasses.iconBg} shadow-sm`}>
                            <Icon className={`h-5 w-5 ${colorClasses.iconColor}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 font-outfit">{title}</p>
                            <p className="text-2xl font-semibold text-slate-900 font-outfit">{value}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            <span className="text-sm font-semibold font-outfit">{change}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function ExecutiveReports() {
    const router = useRouter()
    const [isSyncing, setIsSyncing] = useState(false)
    const [dashboardRange, setDashboardRange] = useState("this-quarter")

    // Derived dynamic data from the selected range
    const activeData = useMemo(() => {
        return DATA_BY_RANGE[dashboardRange as keyof typeof DATA_BY_RANGE] || DATA_BY_RANGE["this-quarter"]
    }, [dashboardRange])

    // Helper for currency formatting
    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    const handleAction = (msg: string) => {
        toast.success(msg)
    }

    const handleSync = async () => {
        setIsSyncing(true)
        toast.promise(
            new Promise(r => setTimeout(r, 2000)).finally(() => setIsSyncing(false)),
            {
                loading: 'Fetching latest strategic data...',
                success: 'Dashboard synced with real-time analytics',
                error: 'Failed to sync data'
            }
        )
    }

    const handleExport = () => {
        toast.promise(
            new Promise(r => setTimeout(r, 1500)),
            {
                loading: 'Generating executive report...',
                success: 'Strategic PDF report downloaded successfully',
                error: 'Export failed'
            }
        )
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Exceeded': return 'bg-emerald-100 text-emerald-700'
            case 'On Track': return 'bg-blue-100 text-blue-700'
            case 'Healthy': return 'bg-indigo-100 text-indigo-700'
            case 'Critical': return 'bg-rose-100 text-rose-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900 font-outfit">Executive Dashboard</h1>
                            <p className="text-[14px] text-slate-500 font-medium mt-1 font-outfit">Strategic business overview and high-level KPI tracking</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm mr-2">
                                <Clock className="h-4 w-4 text-slate-400 mr-2" />
                                <select
                                    className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer font-outfit text-slate-700 outline-none"
                                    value={dashboardRange}
                                    onChange={(e) => setDashboardRange(e.target.value)}
                                >
                                    <option value="this-month">This Month</option>
                                    <option value="this-quarter">This Quarter</option>
                                    <option value="this-year">This Year</option>
                                </select>
                            </div>
                            <Button
                                variant="outline"
                                className="h-10 px-5 rounded-lg border-slate-200 font-medium bg-white shadow-sm gap-2 font-outfit"
                                onClick={handleSync}
                                disabled={isSyncing}
                            >
                                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Sync
                            </Button>
                            <Button className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm gap-2 font-outfit" onClick={handleExport}>
                                <Download className="w-4 h-4" /> Export Report
                            </Button>
                        </div>
                    </div>

                    {/* Strategic Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {activeData.metrics.map((metric: any, i: number) => (
                            <MetricCard key={metric.title} {...metric} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* KPI Performance Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-slate-900">Strategic KPI Health</CardTitle>
                            <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50" onClick={() => handleAction("Loading comprehensive KPI analytics...")}>View All KPIs</Button>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            {activeData.kpis.map((kpi: any) => (
                                <div key={kpi.id} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <h4 className="text-md font-bold text-slate-900 flex items-center gap-2">
                                                {kpi.title}
                                                <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border-0 ${getStatusStyle(kpi.status)}`}>{kpi.status}</Badge>
                                            </h4>
                                            <p className="text-xs text-slate-400 font-medium">Monthly target tracking</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-semibold text-slate-900">
                                                {typeof kpi.current === 'number' && kpi.current > 1000 ? fmt(kpi.current) : kpi.current + (kpi.title.includes('Retention') ? '%' : '')}
                                            </span>
                                            <span className="text-xs text-slate-400 font-semibold ml-1">/ {kpi.target}{kpi.title.includes('Retention') ? '%' : ''}</span>
                                        </div>
                                    </div>
                                    <div className="relative pt-1">
                                        <Progress
                                            value={(kpi.current / (kpi.target || 1)) * 100}
                                            className="h-2.5 bg-slate-100 rounded-full overflow-hidden"
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Department performance grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeData.departments.map((dept, i) => (
                            <Card key={dept.name} className="rounded-3xl border-0 shadow-sm bg-white hover:shadow-md transition-all cursor-pointer group" onClick={() => handleAction(`Opening ${dept.name} performance dashboard`)}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{dept.name}</h4>
                                            <p className="text-xs font-medium text-slate-400">Head: {dept.head}</p>
                                        </div>
                                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-semibold text-slate-400">Efficiency</p>
                                            <p className="text-2xl font-semibold text-slate-900">{dept.performance}%</p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] font-semibold text-slate-400">Budget Allocation</p>
                                            <p className="text-sm font-semibold text-slate-700">{dept.budget}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Sidebar Alerts / Recent Decisions */}
                <div className="space-y-6">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50">
                        <CardHeader className="px-8 py-6 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" /> Critical Decision Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {[
                                { type: "Budget Overrun", dept: "Global Operations", message: "Operating costs exceed forecast by 12%", time: "2h ago", priority: "High" },
                                { type: "Strategic Risk", dept: "Strategic Sales", message: "Major enterprise contract renewal delayed", time: "5h ago", priority: "Critical" },
                                { type: "Opportunity", dept: "Customer Experience", message: "Referral program showing 40% growth potential", time: "1d ago", priority: "Medium" }
                            ].map((alert, i) => (
                                <div key={i} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2 group hover:bg-white hover:border-blue-100 transition-all">
                                    <div className="flex justify-between items-center">
                                        <Badge className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border-0 ${alert.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                                            alert.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>{alert.priority}</Badge>
                                        <span className="text-[10px] font-bold text-slate-400">{alert.time}</span>
                                    </div>
                                    <h5 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{alert.type}</h5>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{alert.message}</p>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-slate-400 font-bold hover:text-blue-600 hover:bg-white text-xs" onClick={() => handleAction("Accessing decision intelligence center...")}>View All Intelligence</Button>
                        </CardContent>
                    </Card>

                    {/* Regional Performance Distribution */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50">
                        <CardHeader className="px-8 py-6 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-indigo-500" /> Regional Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            {(activeData as any).regions.map((region: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                {region.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-700">{region.name}</p>
                                                <Badge className="text-[9px] font-bold bg-slate-50 text-slate-400 border-0 p-0">{region.status}</Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[14px] font-semibold text-slate-900">{region.share}%</p>
                                            <p className="text-[11px] font-semibold text-emerald-600">{region.growth}</p>
                                        </div>
                                    </div>
                                    <Progress value={region.share} className="h-1.5 bg-slate-50" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
