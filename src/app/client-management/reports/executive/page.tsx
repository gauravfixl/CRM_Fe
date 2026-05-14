"use client"

import React, { useState, useMemo } from 'react'
import {
    Download,
    RefreshCw,
    TrendingUp,
    DollarSign,
    Users,
    Target,
    BarChart3,
    ArrowUpRight,
    ShieldCheck,
    ArrowDownRight,
    Zap,
    Clock,
    Loader2,
    Globe,
    FileText,
    PencilLine
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { toast } from "@/shared/utils/toast"

// --- Dynamic Data Mapping ---
const DATA_BY_RANGE = {
    "this-month": {
        metrics: [
            { title: "Monthly Revenue", value: "$1.2M", change: "+4.2%", trend: "up" as const, icon: DollarSign, color: "indigo", path: "/client-management/reports/financial" },
            { title: "New Clients", value: "+24", change: "+15.3%", trend: "up" as const, icon: Users, color: "emerald", path: "/client-management/reports/client" },
            { title: "Growth Rate", value: "8.5%", change: "+1.2%", trend: "up" as const, icon: Target, color: "violet", path: "/client-management/analytics/forecasting" },
            { title: "Churn Rate", value: "1.2%", change: "+0.3%", trend: "down" as const, icon: BarChart3, color: "rose", path: "/client-management/analytics/churn" }
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
            { title: "Total Annual Revenue", value: "$14.2M", change: "+18.2%", trend: "up" as const, icon: DollarSign, color: "indigo", path: "/client-management/reports/financial" },
            { title: "Net Client Growth", value: "+142", change: "+12.5%", trend: "up" as const, icon: Users, color: "emerald", path: "/client-management/reports/client" },
            { title: "Market Expansion", value: "24.5%", change: "+5.3%", trend: "up" as const, icon: Target, color: "violet", path: "/client-management/analytics/forecasting" },
            { title: "Operating Margin", value: "32.8%", change: "-2.1%", trend: "down" as const, icon: BarChart3, color: "rose", path: "/client-management/finance/overview" }
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
            { title: "Yearly Revenue Forecast", value: "$52.4M", change: "+22.5%", trend: "up" as const, icon: DollarSign, color: "indigo", path: "/client-management/reports/financial" },
            { title: "Total Client Base", value: "1,240", change: "+8.9%", trend: "up" as const, icon: Users, color: "emerald", path: "/client-management/reports/client" },
            { title: "Global Market Share", value: "12.4%", change: "+2.1%", trend: "up" as const, icon: Target, color: "violet", path: "/client-management/analytics/forecasting" },
            { title: "Annual ROI", value: "42.8%", change: "+5.4%", trend: "up" as const, icon: BarChart3, color: "rose", path: "/client-management/finance/overview" }
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

const getColorClasses = (color: string) => {
    switch (color) {
        case 'indigo': return { bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', border: 'border-indigo-200/50' }
        case 'emerald': return { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', border: 'border-emerald-200/50' }
        case 'violet': return { bg: 'bg-gradient-to-br from-violet-50 to-violet-100/50', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', border: 'border-violet-200/50' }
        case 'rose': return { bg: 'bg-gradient-to-br from-rose-50 to-rose-100/50', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', border: 'border-rose-200/50' }
        case 'amber': return { bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', border: 'border-amber-200/50' }
        default: return { bg: 'bg-gradient-to-br from-gray-50 to-gray-100/50', iconBg: 'bg-slate-100', iconColor: 'text-slate-500', border: 'border-slate-200/50' }
    }
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    email: (v: string) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : "",
    date: (v: string) => v && isNaN(new Date(v).getTime()) ? "Enter a valid date" : "",
}

export default function ExecutiveReports() {
    const router = useRouter()
    const [isSyncing, setIsSyncing] = useState(false)
    const [dashboardRange, setDashboardRange] = useState("this-quarter")

    // Generate Report Sheet
    const [isGenOpen, setIsGenOpen] = useState(false)
    const [genForm, setGenForm] = useState({ title: "", scope: "Executive Summary", range: "this-quarter", notes: "" })
    const [genErrors, setGenErrors] = useState<Record<string, string>>({})

    // KPI Detail Sheet
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedKpi, setSelectedKpi] = useState<any>(null)

    // Alert Detail Sheet
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [selectedAlert, setSelectedAlert] = useState<any>(null)

    const activeData = useMemo(() => {
        return DATA_BY_RANGE[dashboardRange as keyof typeof DATA_BY_RANGE] || DATA_BY_RANGE["this-quarter"]
    }, [dashboardRange])

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(
            new Promise(r => setTimeout(r, 1500)).finally(() => setIsSyncing(false)),
            { loading: 'Fetching latest strategic data...', success: 'Dashboard synced with real-time analytics', error: 'Failed to sync data' }
        )
    }

    const handleExportPDF = () => {
        toast.promise(new Promise(r => setTimeout(r, 1500)),
            { loading: 'Generating executive PDF...', success: 'Strategic PDF report downloaded successfully', error: 'PDF export failed' })
    }

    const handleExportCSV = () => {
        toast.promise(new Promise(r => setTimeout(r, 1200)),
            { loading: 'Generating CSV...', success: 'Strategic CSV downloaded successfully', error: 'CSV export failed' })
    }

    const setGenField = (k: string, v: any) => {
        setGenForm(prev => ({ ...prev, [k]: v }))
        if (genErrors[k]) setGenErrors(prev => { const c = { ...prev }; delete c[k]; return c })
    }

    const validateGen = () => {
        const errs: Record<string, string> = {}
        errs.title = validators.required(genForm.title) || validators.minLen(3)(genForm.title)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setGenErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleGenerate = () => {
        if (!validateGen()) { toast.error("Please correct the highlighted fields"); return }
        toast.success(`Report "${genForm.title}" queued for generation`)
        setGenForm({ title: "", scope: "Executive Summary", range: "this-quarter", notes: "" })
        setIsGenOpen(false)
    }

    const openKpiDetail = (kpi: any) => { setSelectedKpi(kpi); setIsDetailOpen(true) }
    const openAlertDetail = (a: any) => { setSelectedAlert(a); setIsAlertOpen(true) }

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
                            <Select value={dashboardRange} onValueChange={setDashboardRange}>
                                <SelectTrigger className="h-10 w-44 rounded-none border-slate-200 bg-white">
                                    <Clock className="h-4 w-4 text-slate-400 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="this-month">This Month</SelectItem>
                                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                                    <SelectItem value="this-year">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="h-10 px-5 rounded-none border-slate-200 font-medium bg-white shadow-sm gap-2" onClick={handleSync} disabled={isSyncing}>
                                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Sync
                            </Button>
                            <Button variant="outline" className="h-10 px-5 rounded-none border-slate-200 font-medium bg-white shadow-sm gap-2" onClick={handleExportCSV}>
                                <FileText className="w-4 h-4" /> CSV
                            </Button>
                            <Button variant="outline" className="h-10 px-5 rounded-none border-slate-200 font-medium bg-white shadow-sm gap-2" onClick={handleExportPDF}>
                                <Download className="w-4 h-4" /> PDF
                            </Button>
                            <Button className="h-10 px-6 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm gap-2" onClick={() => setIsGenOpen(true)}>
                                <PencilLine className="w-4 h-4" /> Generate Report
                            </Button>
                        </div>
                    </div>

                    {/* Strategic Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {activeData.metrics.map((metric: any, i: number) => {
                            const Icon = metric.icon
                            const cc = getColorClasses(metric.color)
                            return (
                                <Card key={metric.title} className={`rounded-none cursor-pointer transition-all duration-200 hover:shadow-md ${cc.bg} ${cc.border} border`} onClick={() => router.push(metric.path)}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-none ${cc.iconBg} shadow-sm`}>
                                                    <Icon className={`h-5 w-5 ${cc.iconColor}`} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500 font-outfit">{metric.title}</p>
                                                    <p className="text-2xl font-semibold text-slate-900 font-outfit">{metric.value}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`flex items-center space-x-1 ${metric.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {metric.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                                    <span className="text-sm font-semibold font-outfit">{metric.change}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* KPI Performance Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-none border shadow-sm">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-slate-900">Strategic KPI Health</CardTitle>
                            <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50 rounded-none" onClick={() => router.push('/client-management/analytics/forecasting')}>View All KPIs</Button>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            {activeData.kpis.map((kpi: any) => (
                                <div key={kpi.id} className="space-y-3 cursor-pointer hover:bg-slate-50/50 p-3 -m-3 transition" onClick={() => openKpiDetail(kpi)}>
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <h4 className="text-md font-bold text-slate-900 flex items-center gap-2">
                                                {kpi.title}
                                                <Badge className={`text-[10px] font-bold px-2 py-0.5 rounded-none border-0 ${getStatusStyle(kpi.status)}`}>{kpi.status}</Badge>
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
                                    <Progress value={Math.min(100, (kpi.current / (kpi.target || 1)) * 100)} className="h-2 bg-slate-100" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Department performance grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeData.departments.map((dept) => (
                            <Card key={dept.name} className="rounded-none border shadow-sm bg-white hover:shadow-md transition-all cursor-pointer group" onClick={() => router.push('/client-management/reports/performance')}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{dept.name}</h4>
                                            <p className="text-xs font-medium text-slate-400">Head: {dept.head}</p>
                                        </div>
                                        <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center">
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
                    <Card className="rounded-none border shadow-sm">
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
                                <div key={i} className="p-4 bg-slate-50/50 border border-slate-100 rounded-none space-y-2 group hover:bg-white hover:border-blue-100 transition-all cursor-pointer" onClick={() => openAlertDetail(alert)}>
                                    <div className="flex justify-between items-center">
                                        <Badge className={`text-[9px] font-bold px-2 py-0.5 rounded-none border-0 ${alert.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : alert.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{alert.priority}</Badge>
                                        <span className="text-[10px] font-bold text-slate-400">{alert.time}</span>
                                    </div>
                                    <h5 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{alert.type}</h5>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{alert.message}</p>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-slate-400 font-bold hover:text-blue-600 hover:bg-white text-xs rounded-none" onClick={() => router.push('/client-management/analytics/ai-insights')}>View All Intelligence</Button>
                        </CardContent>
                    </Card>

                    {/* Regional Performance Distribution */}
                    <Card className="rounded-none border shadow-sm">
                        <CardHeader className="px-8 py-6 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-indigo-500" /> Regional Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            {activeData.regions.map((region: any, i: number) => (
                                <div key={i} className="space-y-2 cursor-pointer hover:bg-slate-50 p-2 -m-2 transition" onClick={() => toast.success(`Drilling into ${region.name}...`)}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-none bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                {region.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[13px] font-bold text-slate-700">{region.name}</p>
                                                <Badge className="text-[9px] font-bold bg-slate-50 text-slate-400 border-0 p-0 rounded-none">{region.status}</Badge>
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

            {/* Generate Report Sheet */}
            <Sheet open={isGenOpen} onOpenChange={setIsGenOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Generate Executive Report</SheetTitle>
                        <p className="text-[12px] text-slate-500">Build a tailored strategic snapshot.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Report Title <span className="text-rose-500">*</span></Label>
                            <Input value={genForm.title} onChange={e => setGenField("title", e.target.value)} placeholder="e.g., Q4 Executive Brief" className={`h-10 rounded-none ${genErrors.title ? "border-rose-500" : ""}`} />
                            {genErrors.title && <p className="text-[11px] text-rose-500">{genErrors.title}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Scope</Label>
                            <Select value={genForm.scope} onValueChange={(v: any) => setGenField("scope", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Executive Summary">Executive Summary</SelectItem>
                                    <SelectItem value="KPI Health">KPI Health</SelectItem>
                                    <SelectItem value="Departmental">Departmental</SelectItem>
                                    <SelectItem value="Regional">Regional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Time Range</Label>
                            <Select value={genForm.range} onValueChange={(v: any) => setGenField("range", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="this-month">This Month</SelectItem>
                                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                                    <SelectItem value="this-year">This Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Notes</Label>
                            <Textarea value={genForm.notes} onChange={e => setGenField("notes", e.target.value)} placeholder="Internal context..." className="rounded-none min-h-[100px]" />
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsGenOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleGenerate}>Generate</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* KPI Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">KPI Details</SheetTitle>
                    </SheetHeader>
                    {selectedKpi && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">KPI</p>
                                    <p className="text-lg font-semibold text-slate-900">{selectedKpi.title}</p>
                                    <Badge className={`mt-2 rounded-none ${getStatusStyle(selectedKpi.status)} border-0`}>{selectedKpi.status}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Current</p><p className="font-semibold text-slate-900">{selectedKpi.current > 1000 ? fmt(selectedKpi.current) : selectedKpi.current}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Target</p><p className="font-semibold text-slate-900">{selectedKpi.target}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Trend</p><p className="font-semibold text-emerald-600">{selectedKpi.trend === 'up' ? 'Upward' : 'Downward'}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Progress</p><p className="font-semibold text-slate-900">{Math.round((selectedKpi.current / (selectedKpi.target || 1)) * 100)}%</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsDetailOpen(false)}>Close</Button>
                                <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => router.push('/client-management/analytics/forecasting')}>Deep Dive</Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Alert Detail Sheet */}
            <Sheet open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-rose-50 to-amber-50">
                        <SheetTitle className="text-[18px] font-semibold">Alert Details</SheetTitle>
                    </SheetHeader>
                    {selectedAlert && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Alert Type</p>
                                    <p className="text-lg font-semibold text-slate-900">{selectedAlert.type}</p>
                                </div>
                                <div className="grid grid-cols-1 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Department</p><p className="font-semibold text-slate-900">{selectedAlert.dept}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Message</p><p className="text-sm text-slate-700">{selectedAlert.message}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Priority</p>
                                        <Badge className={`rounded-none border-0 ${selectedAlert.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : selectedAlert.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{selectedAlert.priority}</Badge>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">When</p><p className="font-semibold text-slate-900">{selectedAlert.time}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsAlertOpen(false)}>Close</Button>
                                <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => { toast.success(`Acknowledging ${selectedAlert.type}`); setIsAlertOpen(false) }}>Acknowledge</Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
