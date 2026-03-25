"use client"

import React, { useState, useMemo } from 'react'
import {
    Download,
    Target,
    TrendingUp,
    Users,
    Award,
    ArrowUpRight,
    BarChart3,
    Zap,
    Search,
    Filter,
    CheckCircle2,
    Briefcase,
    Star,
    Clock,
    Calendar,
    Loader2,
    HardDrive,
    Layers,
    PieChart,
    RefreshCw
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Input } from "@/shared/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { toast } from "@/shared/utils/toast"

// --- Enhanced Mock Data ---
// --- Enhanced Dynamic Data Mapping ---
const DATA_BY_PERIOD = {
    "monthly": {
        metrics: [
            { title: "Team Efficacy Index", value: "94.2%", change: "+5.2%", trend: "up" as const, icon: Users, color: "indigo" },
            { title: "Strategic Goal Mastery", value: "88.6%", change: "+8.1%", trend: "up" as const, icon: Target, color: "emerald" },
            { title: "Operational Output", value: "1,240", change: "+3.5%", trend: "up" as const, icon: Zap, color: "violet" },
            { title: "Quality Assurance", value: "98.9%", change: "+2.8%", trend: "up" as const, icon: Award, color: "rose" }
        ],
        teams: [
            { name: "Strategic Sales", lead: "Sarah Jenkins", efficiency: 95, health: "Optimal", projects: 12 },
            { name: "Customer Success", lead: "Michael Chen", efficiency: 82, health: "Steady", projects: 24 },
            { name: "Product Development", lead: "Elena Rodriguez", efficiency: 91, health: "Optimal", projects: 18 },
            { name: "Client Support", lead: "David Smith", efficiency: 74, health: "Scaling", projects: 45 }
        ],
        leaders: [
            { name: "Sarah Jenkins", role: "Sales Lead", score: 98, avatar: "Sj" },
            { name: "Elena Rodriguez", role: "Eng Director", score: 96, avatar: "Er" },
            { name: "Marcus Thorne", role: "Ops Manager", score: 92, avatar: "Mt" }
        ]
    },
    "quarterly": {
        metrics: [
            { title: "Team Efficacy Index", value: "95.8%", change: "+1.6%", trend: "up" as const, icon: Users, color: "indigo" },
            { title: "Strategic Goal Mastery", value: "91.2%", change: "+2.6%", trend: "up" as const, icon: Target, color: "emerald" },
            { title: "Operational Output", value: "4,120", change: "+4.2%", trend: "up" as const, icon: Zap, color: "violet" },
            { title: "Quality Assurance", value: "99.1%", change: "+0.2%", trend: "up" as const, icon: Award, color: "rose" }
        ],
        teams: [
            { name: "Strategic Sales", lead: "Sarah Jenkins", efficiency: 97, health: "Optimal", projects: 38 },
            { name: "Customer Success", lead: "Michael Chen", efficiency: 86, health: "Optimal", projects: 72 },
            { name: "Product Development", lead: "Elena Rodriguez", efficiency: 94, health: "Optimal", projects: 54 },
            { name: "Client Support", lead: "David Smith", efficiency: 78, health: "Steady", projects: 124 }
        ],
        leaders: [
            { name: "Sarah Jenkins", role: "Sales Lead", score: 99, avatar: "Sj" },
            { name: "Elena Rodriguez", role: "Eng Director", score: 97, avatar: "Er" },
            { name: "Michael Chen", role: "Cs Head", score: 95, avatar: "Mc" }
        ]
    },
    "yearly": {
        metrics: [
            { title: "Team Efficacy Index", value: "96.4%", change: "+2.2%", trend: "up" as const, icon: Users, color: "indigo" },
            { title: "Strategic Goal Mastery", value: "92.8%", change: "+4.2%", trend: "up" as const, icon: Target, color: "emerald" },
            { title: "Operational Output", value: "18,450", change: "+12.5%", trend: "up" as const, icon: Zap, color: "violet" },
            { title: "Quality Assurance", value: "99.4%", change: "+0.5%", trend: "up" as const, icon: Award, color: "rose" }
        ],
        teams: [
            { name: "Strategic Sales", lead: "Sarah Jenkins", efficiency: 98, health: "Optimal", projects: 142 },
            { name: "Customer Success", lead: "Michael Chen", efficiency: 89, health: "Optimal", projects: 284 },
            { name: "Product Development", lead: "Elena Rodriguez", efficiency: 96, health: "Optimal", projects: 212 },
            { name: "Client Support", lead: "David Smith", efficiency: 82, health: "Steady", projects: 512 }
        ],
        leaders: [
            { name: "Sarah Jenkins", role: "Sales Lead", score: 99, avatar: "Sj" },
            { name: "Elena Rodriguez", role: "Eng Director", score: 98, avatar: "Er" },
            { name: "David Smith", role: "Support Lead", score: 94, avatar: "Ds" }
        ]
    }
}

// Helper Components
const MetricCard = ({ title, value, change, trend, icon: Icon, color }: {
    title: string
    value: string
    change: string
    trend: "up" | "down"
    icon: any
    color: string
}) => {
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
        <Card className={`transition-all duration-200 hover:shadow-lg hover:shadow-${color}-100/50 ${colorClasses.bg} ${colorClasses.border} border`}>
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
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-sm font-medium font-outfit">{change}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function PerformanceReports() {
    const [period, setPeriod] = useState("monthly")
    const [isSyncing, setIsSyncing] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Dynamic Data Selection based on Period
    const activeData = useMemo(() => DATA_BY_PERIOD[period as keyof typeof DATA_BY_PERIOD], [period])

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Synchronizing performance matrix...',
                success: 'Performance data synchronized',
                error: 'Synchronization failed'
            }
        ).finally(() => setIsSyncing(false))
    }

    const handleExport = () => {
        setIsExporting(true)
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 2000)),
            {
                loading: 'Generating efficiency report...',
                success: 'Team performance report exported',
                error: 'Export failed'
            }
        ).finally(() => setIsExporting(false))
    }

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1200)), {
            loading: 'Analysing performance vectors...',
            success: msg,
            error: 'Analysis failed'
        })
    }

    const getHealthStyle = (health: string) => {
        switch (health) {
            case 'Optimal': return 'bg-emerald-100 text-emerald-700'
            case 'Steady': return 'bg-blue-100 text-blue-700'
            case 'Scaling': return 'bg-amber-100 text-amber-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-6 font-outfit">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Performance Reports</h1>
                            <p className="text-[14px] text-slate-500 font-medium mt-1">Team efficiency tracking and strategic objective fulfillment</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm mr-2">
                                <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                                <select
                                    className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-slate-700 outline-none"
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                >
                                    <option value="monthly">Monthly View</option>
                                    <option value="quarterly">Quarterly View</option>
                                    <option value="yearly">Fiscal Year</option>
                                </select>
                            </div>
                            <Button
                                variant="outline"
                                className="h-10 px-5 rounded-lg border-slate-200 font-semibold bg-white shadow-sm gap-2"
                                onClick={handleSync}
                                disabled={isSyncing}
                            >
                                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                {isSyncing ? "Syncing" : "Sync"}
                            </Button>
                            <Button
                                className="h-10 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2"
                                onClick={handleExport}
                                disabled={isExporting}
                            >
                                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {isExporting ? "Exporting" : "Export Ledgers"}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {activeData.metrics.map((metric: any, i: number) => (
                            <MetricCard key={i} {...metric} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Areas */}
            <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Search & Strategy */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-1 font-outfit">
                        <div className="flex items-center p-2 gap-3">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                                <Input
                                    placeholder="Search specific team, lead or department..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-12 bg-slate-50/50 border-0 rounded-2xl text-[14px] font-medium placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-100"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Performance Content */}
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-slate-900">Departmental Efficacy Matrix</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-5">
                            {activeData.teams.map((team: any, idx: number) => (
                                <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-4 hover:bg-white transition-all group cursor-pointer shadow-sm hover:shadow-md">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h4 className="text-md font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{team.name}</h4>
                                            <p className="text-[13px] font-medium text-slate-500">Department Lead: {team.lead}</p>
                                        </div>
                                        <Badge className={`text-[10px] font-bold px-3 py-1 rounded-full border-0 ${getHealthStyle(team.health)}`}>{team.health}</Badge>
                                    </div>
                                    <div className="grid grid-cols-3 gap-8 items-end">
                                        <div className="col-span-2 space-y-2.5">
                                            <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                                <span>Efficiency Rate</span>
                                                <span className="text-slate-900">{team.efficiency}%</span>
                                            </div>
                                            <Progress value={team.efficiency} className="h-2 bg-slate-100 rounded-full" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-bold text-slate-400">Active Jobs</p>
                                            <p className="text-lg font-semibold text-slate-900">{team.projects}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar Intelligence */}
                <div className="space-y-6">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 space-y-6 bg-white font-outfit">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm">
                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                                </div>
                                <h4 className="text-[16px] font-bold text-slate-900">Efficacy Leaders</h4>
                            </div>
                        </div>
                        <div className="space-y-5">
                            {activeData.leaders.map((person: any, i: number) => (
                                <div key={i} className="flex items-center gap-4 transition-all hover:translate-x-1">
                                    <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-600/20">{person.avatar}</div>
                                    <div className="flex-1 space-y-0.5">
                                        <p className="text-sm font-bold text-slate-900">{person.name}</p>
                                        <p className="text-[11px] font-medium text-slate-500">{person.role}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-indigo-600">{person.score}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-slate-50">
                            <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all" onClick={() => handleAction("Loading global efficacy leaderboard...")}>
                                View Global Leaderboard
                            </Button>
                        </div>
                    </Card>

                    <Card className="rounded-3xl border border-indigo-100 shadow-xl shadow-slate-200/50 bg-gradient-to-br from-indigo-50 to-white text-slate-900 p-8 space-y-6 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Layers className="w-24 h-24 text-indigo-600" />
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-md">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-bold tracking-tight">Productivity Analysis</h4>
                            <p className="text-indigo-600 text-[13px] font-medium leading-relaxed">Systematic audit of cross-departmental throughput and resource allocation.</p>
                        </div>
                        <Button className="w-full h-12 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all" onClick={() => handleAction("Dynamic productivity audit initialised...")}>
                            Launch Dynamic Audit
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}
