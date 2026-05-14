"use client"

import React, { useState, useMemo } from 'react'
import {
    Download,
    Target,
    TrendingUp,
    Users,
    Award,
    BarChart3,
    Zap,
    Search,
    Star,
    Calendar,
    Loader2,
    Layers,
    RefreshCw,
    FileText,
    PencilLine
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Input } from "@/shared/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { toast } from "@/shared/utils/toast"

const DATA_BY_PERIOD = {
    "monthly": {
        metrics: [
            { title: "Team Efficacy Index", value: "94.2%", change: "+5.2%", trend: "up" as const, icon: Users, color: "indigo", path: "/client-management/analytics/clients" },
            { title: "Strategic Goal Mastery", value: "88.6%", change: "+8.1%", trend: "up" as const, icon: Target, color: "emerald", path: "/client-management/analytics/forecasting" },
            { title: "Operational Output", value: "1,240", change: "+3.5%", trend: "up" as const, icon: Zap, color: "violet", path: "/client-management/reports/executive" },
            { title: "Quality Assurance", value: "98.9%", change: "+2.8%", trend: "up" as const, icon: Award, color: "rose", path: "/client-management/reports/client" }
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
            { title: "Team Efficacy Index", value: "95.8%", change: "+1.6%", trend: "up" as const, icon: Users, color: "indigo", path: "/client-management/analytics/clients" },
            { title: "Strategic Goal Mastery", value: "91.2%", change: "+2.6%", trend: "up" as const, icon: Target, color: "emerald", path: "/client-management/analytics/forecasting" },
            { title: "Operational Output", value: "4,120", change: "+4.2%", trend: "up" as const, icon: Zap, color: "violet", path: "/client-management/reports/executive" },
            { title: "Quality Assurance", value: "99.1%", change: "+0.2%", trend: "up" as const, icon: Award, color: "rose", path: "/client-management/reports/client" }
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
            { title: "Team Efficacy Index", value: "96.4%", change: "+2.2%", trend: "up" as const, icon: Users, color: "indigo", path: "/client-management/analytics/clients" },
            { title: "Strategic Goal Mastery", value: "92.8%", change: "+4.2%", trend: "up" as const, icon: Target, color: "emerald", path: "/client-management/analytics/forecasting" },
            { title: "Operational Output", value: "18,450", change: "+12.5%", trend: "up" as const, icon: Zap, color: "violet", path: "/client-management/reports/executive" },
            { title: "Quality Assurance", value: "99.4%", change: "+0.5%", trend: "up" as const, icon: Award, color: "rose", path: "/client-management/reports/client" }
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

const getColorClasses = (color: string) => {
    switch (color) {
        case 'indigo': return { bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100/50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', border: 'border-indigo-200/50' }
        case 'emerald': return { bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', border: 'border-emerald-200/50' }
        case 'violet': return { bg: 'bg-gradient-to-br from-violet-50 to-violet-100/50', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', border: 'border-violet-200/50' }
        case 'rose': return { bg: 'bg-gradient-to-br from-rose-50 to-rose-100/50', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', border: 'border-rose-200/50' }
        default: return { bg: 'bg-gradient-to-br from-gray-50 to-gray-100/50', iconBg: 'bg-slate-100', iconColor: 'text-slate-500', border: 'border-slate-200/50' }
    }
}

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function PerformanceReports() {
    const router = useRouter()
    const [period, setPeriod] = useState("monthly")
    const [isSyncing, setIsSyncing] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const [isGenOpen, setIsGenOpen] = useState(false)
    const [genForm, setGenForm] = useState({ title: "", department: "All", period: "monthly", notes: "" })
    const [genErrors, setGenErrors] = useState<Record<string, string>>({})

    const [isTeamOpen, setIsTeamOpen] = useState(false)
    const [selectedTeam, setSelectedTeam] = useState<any>(null)

    const activeData = useMemo(() => DATA_BY_PERIOD[period as keyof typeof DATA_BY_PERIOD], [period])

    const filteredTeams = useMemo(() => {
        return activeData.teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.lead.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [activeData.teams, searchQuery])

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(resolve => setTimeout(resolve, 1500)),
            { loading: 'Synchronizing performance matrix...', success: 'Performance data synchronized', error: 'Synchronization failed' }
        ).finally(() => setIsSyncing(false))
    }

    const handleExportPDF = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1800)),
            { loading: 'Generating performance PDF...', success: 'Performance PDF exported', error: 'PDF export failed' })
    }

    const handleExportCSV = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1200)),
            { loading: 'Generating performance CSV...', success: 'Performance CSV exported', error: 'CSV export failed' })
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
        toast.success(`Performance report "${genForm.title}" queued`)
        setGenForm({ title: "", department: "All", period: "monthly", notes: "" })
        setIsGenOpen(false)
    }

    const openTeam = (t: any) => { setSelectedTeam(t); setIsTeamOpen(true) }

    const getHealthStyle = (health: string) => {
        switch (health) {
            case 'Optimal': return 'bg-emerald-100 text-emerald-700'
            case 'Steady': return 'bg-blue-100 text-blue-700'
            case 'Scaling': return 'bg-amber-100 text-amber-700'
            default: return 'bg-slate-100 text-slate-700'
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-200">
                <div className="px-6 py-6 font-outfit">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Performance Reports</h1>
                            <p className="text-[14px] text-slate-500 font-medium mt-1">Team efficiency tracking and strategic objective fulfillment</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger className="h-10 w-40 rounded-none border-slate-200 bg-white">
                                    <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="monthly">Monthly View</SelectItem>
                                    <SelectItem value="quarterly">Quarterly View</SelectItem>
                                    <SelectItem value="yearly">Fiscal Year</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="h-10 px-5 rounded-none border-slate-200 font-semibold bg-white shadow-sm gap-2" onClick={handleSync} disabled={isSyncing}>
                                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                {isSyncing ? "Syncing" : "Sync"}
                            </Button>
                            <Button variant="outline" className="h-10 px-5 rounded-none border-slate-200 font-semibold bg-white shadow-sm gap-2" onClick={handleExportCSV}>
                                <FileText className="w-4 h-4" /> CSV
                            </Button>
                            <Button variant="outline" className="h-10 px-5 rounded-none border-slate-200 font-semibold bg-white shadow-sm gap-2" onClick={handleExportPDF}>
                                <Download className="w-4 h-4" /> PDF
                            </Button>
                            <Button className="h-10 px-6 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2" onClick={() => setIsGenOpen(true)}>
                                <PencilLine className="w-4 h-4" /> Generate Report
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {activeData.metrics.map((metric: any, i: number) => {
                            const Icon = metric.icon
                            const cc = getColorClasses(metric.color)
                            return (
                                <Card key={i} className={`rounded-none cursor-pointer transition-all duration-200 hover:shadow-md ${cc.bg} ${cc.border} border`} onClick={() => router.push(metric.path)}>
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
                                                    <TrendingUp className="h-4 w-4" />
                                                    <span className="text-sm font-medium font-outfit">{metric.change}</span>
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

            <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-none border shadow-sm p-1 font-outfit">
                        <div className="flex items-center p-2 gap-3">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                                <Input
                                    placeholder="Search specific team, lead or department..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-12 bg-slate-50/50 border-0 rounded-none text-[14px] font-medium placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-indigo-100"
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-none border shadow-sm">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold text-slate-900">Departmental Efficacy Matrix</CardTitle>
                            <Badge className="rounded-none bg-slate-100 text-slate-600 border-0">{filteredTeams.length} Teams</Badge>
                        </CardHeader>
                        <CardContent className="p-8 space-y-5">
                            {filteredTeams.length > 0 ? filteredTeams.map((team: any, idx: number) => (
                                <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-none space-y-4 hover:bg-white transition-all group cursor-pointer shadow-sm hover:shadow-md" onClick={() => openTeam(team)}>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h4 className="text-md font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{team.name}</h4>
                                            <p className="text-[13px] font-medium text-slate-500">Department Lead: {team.lead}</p>
                                        </div>
                                        <Badge className={`text-[10px] font-bold px-3 py-1 rounded-none border-0 ${getHealthStyle(team.health)}`}>{team.health}</Badge>
                                    </div>
                                    <div className="grid grid-cols-3 gap-8 items-end">
                                        <div className="col-span-2 space-y-2.5">
                                            <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                                <span>Efficiency Rate</span>
                                                <span className="text-slate-900">{team.efficiency}%</span>
                                            </div>
                                            <Progress value={team.efficiency} className="h-2 bg-slate-100" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-bold text-slate-400">Active Jobs</p>
                                            <p className="text-lg font-semibold text-slate-900">{team.projects}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 text-sm text-slate-500">No teams match your search.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none border shadow-sm p-8 space-y-6 bg-white font-outfit">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-none bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm">
                                    <Star className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                                </div>
                                <h4 className="text-[16px] font-bold text-slate-900">Efficacy Leaders</h4>
                            </div>
                        </div>
                        <div className="space-y-5">
                            {activeData.leaders.map((person: any, i: number) => (
                                <div key={i} className="flex items-center gap-4 transition-all hover:translate-x-1 cursor-pointer" onClick={() => toast.success(`Opening ${person.name}'s profile...`)}>
                                    <div className="h-10 w-10 rounded-none bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-600/20">{person.avatar}</div>
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
                            <Button variant="outline" className="w-full h-11 rounded-none border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all" onClick={() => router.push('/client-management/analytics/clients')}>
                                View Global Leaderboard
                            </Button>
                        </div>
                    </Card>

                    <Card className="rounded-none border border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50 to-white text-slate-900 p-8 space-y-6 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Layers className="w-24 h-24 text-indigo-600" />
                        </div>
                        <div className="h-12 w-12 rounded-none bg-indigo-100 flex items-center justify-center border border-indigo-200 shadow-md">
                            <BarChart3 className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-bold tracking-tight">Productivity Analysis</h4>
                            <p className="text-indigo-600 text-[13px] font-medium leading-relaxed">Systematic audit of cross-departmental throughput and resource allocation.</p>
                        </div>
                        <Button className="w-full h-12 rounded-none bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all" onClick={() => router.push('/client-management/analytics/forecasting')}>
                            Launch Dynamic Audit
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Generate Report Sheet */}
            <Sheet open={isGenOpen} onOpenChange={setIsGenOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">Generate Performance Report</SheetTitle>
                        <p className="text-[12px] text-slate-500">Configure team performance snapshot.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Report Title <span className="text-rose-500">*</span></Label>
                            <Input value={genForm.title} onChange={e => setGenField("title", e.target.value)} placeholder="e.g., Q3 Team Velocity" className={`h-10 rounded-none ${genErrors.title ? "border-rose-500" : ""}`} />
                            {genErrors.title && <p className="text-[11px] text-rose-500">{genErrors.title}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Department</Label>
                            <Select value={genForm.department} onValueChange={(v: any) => setGenField("department", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="All">All Departments</SelectItem>
                                    <SelectItem value="Strategic Sales">Strategic Sales</SelectItem>
                                    <SelectItem value="Customer Success">Customer Success</SelectItem>
                                    <SelectItem value="Product Development">Product Development</SelectItem>
                                    <SelectItem value="Client Support">Client Support</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Period</Label>
                            <Select value={genForm.period} onValueChange={(v: any) => setGenField("period", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Notes</Label>
                            <Textarea value={genForm.notes} onChange={e => setGenField("notes", e.target.value)} placeholder="Comments..." className="rounded-none min-h-[100px]" />
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsGenOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleGenerate}>Generate</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Team Detail Sheet */}
            <Sheet open={isTeamOpen} onOpenChange={setIsTeamOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Team Details</SheetTitle>
                    </SheetHeader>
                    {selectedTeam && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Team</p>
                                    <p className="text-lg font-semibold text-slate-900">{selectedTeam.name}</p>
                                    <Badge className={`mt-2 rounded-none border-0 ${getHealthStyle(selectedTeam.health)}`}>{selectedTeam.health}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Lead</p><p className="font-semibold text-slate-900">{selectedTeam.lead}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Efficiency</p><p className="font-semibold text-slate-900">{selectedTeam.efficiency}%</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Active Jobs</p><p className="font-semibold text-slate-900">{selectedTeam.projects}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Health</p><p className="font-semibold text-slate-900">{selectedTeam.health}</p></div>
                                </div>
                                <div className="pt-3 border-t">
                                    <p className="text-[11px] text-slate-400 uppercase mb-2">Performance</p>
                                    <Progress value={selectedTeam.efficiency} className="h-2 bg-slate-100" />
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsTeamOpen(false)}>Close</Button>
                                <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => router.push('/client-management/reports/executive')}>Drill Down</Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
