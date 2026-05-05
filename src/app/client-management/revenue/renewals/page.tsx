"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

import {
    RefreshCcw,
    ShieldCheck,
    AlertTriangle,
    TrendingUp,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    ArrowUpRight,
    Clock,
    History,
    CheckCircle2,
    Building,
    ChevronRight,
    Target,
    Plus,
    Trash2,
    PencilLine,
    ExternalLink
} from "lucide-react"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

// Types
interface Renewal {
    id: number;
    client: string;
    value: number;
    date: string;
    status: string;
    probability: number;
    health: string;
    healthColor: string;
}

const initialRenewals: Renewal[] = [
    { id: 1, client: 'Acme Corp', value: 45000, date: '2024-10-12', status: 'In Discussion', probability: 90, health: 'Stable', healthColor: 'text-emerald-500' },
    { id: 2, client: 'GlobalTech Solutions', value: 120000, date: '2024-10-28', status: 'At Risk', probability: 45, health: 'Critical', healthColor: 'text-rose-500' },
    { id: 3, client: 'NorthStar Ind.', value: 32500, date: '2024-11-05', status: 'Negotiating', probability: 75, health: 'Warning', healthColor: 'text-amber-500' },
    { id: 4, client: 'Cloud Nine Systems', value: 15000, date: '2024-11-12', status: 'Closing', probability: 98, health: 'Perfect', healthColor: 'text-emerald-500' },
    { id: 5, client: 'Vanguard Group', value: 88000, date: '2024-12-02', status: 'Proposed', probability: 60, health: 'Stable', healthColor: 'text-emerald-500' },
]

const healthTrendData = [
    { name: 'Week 1', health: 82 },
    { name: 'Week 2', health: 85 },
    { name: 'Week 3', health: 84 },
    { name: 'Week 4', health: 88 },
    { name: 'Week 5', health: 87 },
    { name: 'Week 6', health: 91 },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue, trend }: any) => {
    const colorClasses: any = {
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        rose: "from-rose-50 to-rose-100/50 border-rose-200/50 text-rose-600",
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
        indigo: "from-indigo-50 to-indigo-100/50 border-indigo-200/50 text-indigo-600",
        amber: "from-amber-50 to-amber-100/50 border-amber-200/50 text-amber-600",
    }
    const currentClasses = colorClasses[color] || colorClasses.indigo
    return (
        <Card className={cn("bg-gradient-to-br border shadow-none transition-all hover:shadow-md", currentClasses.split(' ').slice(0, 3).join(' '))}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 tracking-wide font-outfit mb-2">{title}</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight leading-none">{value}</h3>
                            {trend && (
                                <span className={cn("text-xs font-bold font-outfit flex items-center gap-0.5",
                                    trend.startsWith('+') ? "text-emerald-600" : "text-rose-600"
                                )}>
                                    {trend}
                                </span>
                            )}
                        </div>
                        <p className="mt-2 text-xs font-medium text-slate-400 font-outfit">{subValue}</p>
                    </div>
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-white/60 shadow-sm border border-white/50", currentClasses.split(' ').pop())}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function RenewalsPage() {
    const [renewals, setRenewals] = useState<Renewal[]>(initialRenewals)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingRenewal, setEditingRenewal] = useState<Renewal | null>(null)

    // Form states
    const [formData, setFormData] = useState<Partial<Renewal>>({
        client: '',
        value: 0,
        date: '',
        status: 'Proposed',
        probability: 50,
        health: 'Stable',
        healthColor: 'text-emerald-500'
    })

    // Derive Metrics
    const metrics = useMemo(() => {
        const totalValue = renewals.reduce((sum, item) => sum + item.value, 0)
        const avgProb = renewals.length > 0 ? (renewals.reduce((sum, item) => sum + item.probability, 0) / renewals.length).toFixed(1) : 0
        const atRiskValue = renewals.filter(r => r.health === 'Critical').reduce((sum, item) => sum + item.value, 0)

        const formatCurrency = (val: number) => {
            if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`
            if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`
            return `$${val}`
        }

        return {
            totalValue: formatCurrency(totalValue),
            avgProb: `${avgProb}%`,
            atRisk: formatCurrency(atRiskValue),
            count: renewals.length
        }
    }, [renewals])

    const filteredRenewals = useMemo(() => {
        return renewals.filter(r =>
            r.client.toLowerCase().includes(search.toLowerCase()) ||
            r.status.toLowerCase().includes(search.toLowerCase())
        )
    }, [renewals, search])

    const handleDelete = (id: number) => {
        setRenewals(prev => prev.filter(r => r.id !== id))
    }

    const handleSave = () => {
        if (!formData.client || !formData.value || !formData.date) return

        if (editingRenewal) {
            setRenewals(prev => prev.map(r => r.id === editingRenewal.id ? { ...r, ...formData } as Renewal : r))
        } else {
            const newId = renewals.length > 0 ? Math.max(...renewals.map(r => r.id)) + 1 : 1
            setRenewals(prev => [...prev, { ...formData, id: newId } as Renewal])
        }
        setIsDialogOpen(false)
        setEditingRenewal(null)
        setFormData({ client: '', value: 0, date: '', status: 'Proposed', probability: 50, health: 'Stable', healthColor: 'text-emerald-500' })
    }

    const openEdit = (renewal: Renewal) => {
        setEditingRenewal(renewal)
        setFormData(renewal)
        setIsDialogOpen(true)
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Revenue <span className="text-indigo-600">Protection</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Ensure business continuity with real-time tracking of upcoming renewals and risk mitigation.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { setEditingRenewal(null); setFormData({ client: '', value: 0, date: '', status: 'Proposed', probability: 50, health: 'Stable', healthColor: 'text-emerald-500' }) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-indigo-600/20 gap-2">
                            <Plus className="h-5 w-5" /> New Renewal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingRenewal ? 'Edit Renewal' : 'Add New Renewal'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Account Name</Label>
                                    <Input value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} placeholder="e.g. Acme Corp" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Contract Value ($)</Label>
                                    <Input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Renewal Date</Label>
                                    <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Status</Label>
                                    <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Proposed">Proposed</SelectItem>
                                            <SelectItem value="In Discussion">In Discussion</SelectItem>
                                            <SelectItem value="Negotiating">Negotiating</SelectItem>
                                            <SelectItem value="Closing">Closing</SelectItem>
                                            <SelectItem value="At Risk">At Risk</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Probability (%)</Label>
                                    <Input type="number" min="0" max="100" value={formData.probability} onChange={e => setFormData({ ...formData, probability: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Health Status</Label>
                                    <Select value={formData.health} onValueChange={v => {
                                        const colorMap: any = { 'Perfect': 'text-emerald-500', 'Stable': 'text-emerald-500', 'Warning': 'text-amber-500', 'Critical': 'text-rose-500' }
                                        setFormData({ ...formData, health: v, healthColor: colorMap[v] })
                                    }}>
                                        <SelectTrigger><SelectValue placeholder="Health" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Perfect">Perfect</SelectItem>
                                            <SelectItem value="Stable">Stable</SelectItem>
                                            <SelectItem value="Warning">Warning</SelectItem>
                                            <SelectItem value="Critical">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSave}>Save Record</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <MetricBox title="Renewal Pipeline" value={metrics.totalValue} subValue={`Active Projects: ${metrics.count}`} icon={RefreshCcw} color="blue" trend="+12%" />
                <MetricBox title="Expected Churn" value={metrics.atRisk} subValue="Probabilistic Risk" icon={AlertTriangle} color="rose" trend="-2%" />
                <MetricBox title="Renewal Rate" value="96.2%" subValue="Last 12 Months" icon={ShieldCheck} color="emerald" trend="+0.4%" />
                <MetricBox title="Avg. Probability" value={metrics.avgProb} subValue="Pipeline Confidence" icon={TrendingUp} color="indigo" trend="+1.2%" />
                <MetricBox title="Avg Health Score" value="88/100" subValue="Account Performance" icon={Target} color="amber" trend="+5" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">Upcoming Renewals</h2>
                                <div className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[12px] font-bold font-outfit">{filteredRenewals.length} found</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search accounts..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                                <Button variant="outline" size="icon" className="rounded-xl text-slate-400"><Filter className="h-4.5 w-4.5" /></Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[12px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                        <th className="px-6 py-4">Account Name</th>
                                        <th className="px-6 py-4">Contract Value</th>
                                        <th className="px-6 py-4">Renewal Date</th>
                                        <th className="px-6 py-4">Account Health</th>
                                        <th className="px-6 py-4">Probability</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredRenewals.length > 0 ? filteredRenewals.map((item) => (
                                        <tr key={item.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50/50">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-indigo-50 transition-colors">
                                                        <Building className="h-5 w-5 text-indigo-600" />
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-800 font-outfit">{item.client}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold text-slate-900 font-outfit">${item.value.toLocaleString()}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-[13px] font-bold text-slate-500 tracking-tight font-outfit">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[12px] font-bold font-outfit", item.healthColor)}>
                                                    <div className={cn("h-1.5 w-1.5 rounded-full", item.healthColor.replace('text', 'bg'))} />
                                                    {item.health}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                        <div
                                                            className={cn("h-full rounded-full transition-all duration-700",
                                                                item.probability > 80 ? "bg-emerald-500" : item.probability > 50 ? "bg-blue-500" : "bg-rose-500"
                                                            )}
                                                            style={{ width: `${item.probability}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900 font-outfit">{item.probability}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-indigo-600 transition-colors">
                                                            <MoreVertical className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 font-outfit">
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => openEdit(item)}>
                                                            <PencilLine className="h-4 w-4" /> Edit Record
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer" onClick={() => handleDelete(item.id)}>
                                                            <Trash2 className="h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer border-t mt-1">
                                                            <ExternalLink className="h-4 w-4" /> CRM Link
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                        <Search className="h-6 w-6" />
                                                    </div>
                                                    <p className="text-sm font-bold text-slate-500 font-outfit">No active renewals found for this search.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 font-outfit">Renewal Health Velocity</h3>
                                <p className="text-sm text-slate-500 font-outfit mt-1">Account health score movements in current pipeline</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                                <span className="text-xs font-bold text-slate-900 font-outfit">Avg. Health: 88%</span>
                            </div>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={healthTrendData}>
                                    <defs>
                                        <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                    <YAxis hide domain={[0, 100]} />
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '700' }} />
                                    <Area type="monotone" dataKey="health" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorHealth)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Strategy Sidebar */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Retention Summary</h3>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="space-y-5">
                            <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-start gap-4 hover:bg-orange-50 transition-colors">
                                <div className="h-12 w-12 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[15px] font-bold text-slate-900 font-outfit">Immediate Risk Alert</p>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed font-outfit">3 high-value contracts expiring within 14 days without signed renewals.</p>
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-4 hover:bg-emerald-50 transition-colors">
                                <div className="h-12 w-12 shrink-0 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[15px] font-bold text-slate-900 font-outfit">Renewal Forecasting</p>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed font-outfit">Projected retention for Q4 is 98.2%, outperforming target of 95%.</p>
                                </div>
                            </div>
                        </div>
                        <Button className="w-full mt-8 py-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-xl shadow-indigo-600/20 gap-2 font-outfit transition-all transform hover:scale-[1.02]">
                            Full Retention Audit <ArrowUpRight className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-6 font-outfit">Churn Risk Factors</h3>
                        <div className="space-y-4">
                            {[
                                { factor: 'Low Platform Usage', weight: 'High Risk', color: 'text-rose-600', bg: 'bg-rose-50' },
                                { factor: 'No Support Activity', weight: 'Medium Risk', color: 'text-amber-600', bg: 'bg-amber-50' },
                                { factor: 'Key Contact Change', weight: 'Neutral', color: 'text-slate-600', bg: 'bg-slate-50' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 group hover:border-slate-200 transition-all cursor-default">
                                    <span className="text-[13px] font-bold text-slate-700 font-outfit">{item.factor}</span>
                                    <span className={cn("text-[12px] font-bold px-2 py-1 rounded-md font-outfit", item.bg, item.color)}>{item.weight}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-8 font-outfit">Recent mitigation wins</h3>
                        <div className="space-y-6 relative">
                            <div className="absolute left-[23px] top-2 bottom-0 w-0.5 bg-slate-50" />
                            {[
                                { user: 'JR', action: 'Restored health for', target: 'Acme Corp', time: '2h ago' },
                                { user: 'SM', action: 'Upsold Enterprise to', target: 'Netflix', time: '5h ago' },
                                { user: 'AW', action: 'Initiated recovery for', target: 'Globex', time: '1d ago' },
                            ].map((win, i) => (
                                <div key={i} className="relative flex items-center gap-5 group">
                                    <div className="h-[46px] w-[46px] rounded-full bg-white border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 z-10 shadow-sm group-hover:border-indigo-200 transition-colors">
                                        {win.user}
                                    </div>
                                    <div className="flex-1 space-y-0.5">
                                        <p className="text-[13px] font-bold text-slate-700 font-outfit leading-snug">
                                            {win.action} <span className="text-indigo-600 font-extrabold">{win.target}</span>
                                        </p>
                                        <div className="flex items-center gap-1.5">
                                            <History className="h-3 w-3 text-slate-300" />
                                            <p className="text-[12px] font-semibold text-slate-400 font-outfit">{win.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
