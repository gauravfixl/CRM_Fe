"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    Heart,
    Activity,
    AlertCircle,
    CheckCircle2,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    Building2,
    TrendingUp,
    TrendingDown,
    MessageSquare,
    Zap,
    LifeBuoy,
    ChevronRight,
    ArrowUpRight
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
import { Progress } from "@/shared/components/ui/progress"
import { useToast } from "@/shared/components/ui/use-toast"

// Types
interface ClientHealth {
    id: number;
    account: string;
    healthScore: number;
    usageScore: number;
    supportScore: number;
    sentiment: 'Positive' | 'Neutral' | 'Mixed' | 'Decline';
    trend: 'Improving' | 'Stable' | 'At Risk' | 'Declining';
    lastSync: string;
}

const initialHealthData: ClientHealth[] = [
    { id: 1, account: "Global Dynamics", healthScore: 92, usageScore: 95, supportScore: 88, sentiment: "Positive", trend: "Improving", lastSync: "2h ago" },
    { id: 2, account: "DataScale Inc", healthScore: 75, usageScore: 82, supportScore: 60, sentiment: "Mixed", trend: "Stable", lastSync: "5h ago" },
    { id: 3, account: "Innova Hub", healthScore: 42, usageScore: 30, supportScore: 55, sentiment: "Decline", trend: "At Risk", lastSync: "1d ago" },
    { id: 4, account: "Swift Apps", healthScore: 88, usageScore: 90, supportScore: 85, sentiment: "Positive", trend: "Stable", lastSync: "3h ago" },
    { id: 5, account: "Horizon Media", healthScore: 65, usageScore: 70, supportScore: 45, sentiment: "Neutral", trend: "Declining", lastSync: "12h ago" },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue }: any) => {
    const colorClasses: any = {
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
        rose: "from-rose-50 to-rose-100/50 border-rose-200/50 text-rose-600",
        amber: "from-amber-50 to-amber-100/50 border-amber-200/50 text-amber-600",
    }
    const currentClasses = colorClasses[color] || colorClasses.blue
    return (
        <Card className={cn("bg-gradient-to-br border shadow-none transition-all hover:shadow-md", currentClasses.split(' ').slice(0, 3).join(' '))}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 tracking-wide font-outfit mb-2">{title}</p>
                        <h3 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight leading-none">{value}</h3>
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

export default function ClientHealthPage() {
    const [healthData, setHealthData] = useState<ClientHealth[]>(initialHealthData)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingHealth, setEditingHealth] = useState<ClientHealth | null>(null)
    const { toast } = useToast()

    const [formData, setFormData] = useState<Partial<ClientHealth>>({
        account: '',
        healthScore: 50,
        usageScore: 50,
        supportScore: 50,
        sentiment: 'Neutral',
        trend: 'Stable',
        lastSync: 'Just now'
    })

    const metrics = useMemo(() => {
        const total = healthData.length
        const avgScore = (healthData.reduce((sum, h) => sum + h.healthScore, 0) / total).toFixed(0)
        const atRisk = healthData.filter(h => h.healthScore < 50).length
        const highHealth = healthData.filter(h => h.healthScore > 80).length

        return { total, avgScore, atRisk, highHealth }
    }, [healthData])

    const filteredHealth = useMemo(() => {
        return healthData.filter(h => h.account.toLowerCase().includes(search.toLowerCase()))
    }, [healthData, search])

    const handleDelete = (id: number) => {
        setHealthData(prev => prev.filter(h => h.id !== id))
        toast({ title: "Health Record Removed", description: "Account no longer tracked for automated health sync." })
    }

    const handleSave = () => {
        if (!formData.account) return

        if (editingHealth) {
            setHealthData(prev => prev.map(h => h.id === editingHealth.id ? { ...h, ...formData } as ClientHealth : h))
            toast({ title: "Health Refreshed", description: "Real-time client health metrics updated." })
        } else {
            const newId = healthData.length > 0 ? Math.max(...healthData.map(h => h.id)) + 1 : 1
            setHealthData(prev => [...prev, { ...formData, id: newId } as ClientHealth])
            toast({ title: "Monitoring Started", description: "Account added to global health engine." })
        }
        setIsDialogOpen(false)
        setEditingHealth(null)
        setFormData({ account: '', healthScore: 50, usageScore: 50, supportScore: 50, sentiment: 'Neutral', trend: 'Stable', lastSync: 'Just now' })
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "bg-emerald-500"
        if (score >= 50) return "bg-amber-500"
        return "bg-rose-500"
    }

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'Improving': return <TrendingUp className="h-3 w-3 text-emerald-500" />
            case 'At Risk': return <AlertCircle className="h-3 w-3 text-rose-500" />
            case 'Declining': return <TrendingDown className="h-3 w-3 text-rose-500" />
            default: return <Activity className="h-3 w-3 text-slate-400" />
        }
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Client <span className="text-rose-600">Health Radar</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Real-time sentiment and platform usage analytics to prevent churn.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { setEditingHealth(null); setFormData({ account: '', healthScore: 50, usageScore: 50, supportScore: 50, sentiment: 'Neutral', trend: 'Stable', lastSync: 'Just now' }) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-rose-600/20 gap-2">
                            <Plus className="h-5 w-5" /> Sync Health Data
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingHealth ? 'Recalibrate health' : 'Setup health monitor'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Client Account</Label>
                                <Input value={formData.account} onChange={e => setFormData({ ...formData, account: e.target.value })} placeholder="e.g. Acme Corp" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Health Score (%)</Label>
                                    <Input type="number" value={formData.healthScore} onChange={e => setFormData({ ...formData, healthScore: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Usage (%)</Label>
                                    <Input type="number" value={formData.usageScore} onChange={e => setFormData({ ...formData, usageScore: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Support (%)</Label>
                                    <Input type="number" value={formData.supportScore} onChange={e => setFormData({ ...formData, supportScore: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Trend Status</Label>
                                    <Select value={formData.trend} onValueChange={(v: any) => setFormData({ ...formData, trend: v })}>
                                        <SelectTrigger><SelectValue placeholder="Trend" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Improving">Improving</SelectItem>
                                            <SelectItem value="Stable">Stable</SelectItem>
                                            <SelectItem value="At Risk">At Risk</SelectItem>
                                            <SelectItem value="Declining">Declining</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Current Sentiment</Label>
                                    <Select value={formData.sentiment} onValueChange={(v: any) => setFormData({ ...formData, sentiment: v })}>
                                        <SelectTrigger><SelectValue placeholder="Sentiment" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Positive">Positive</SelectItem>
                                            <SelectItem value="Neutral">Neutral</SelectItem>
                                            <SelectItem value="Mixed">Mixed</SelectItem>
                                            <SelectItem value="Decline">Decline</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" /> Refresh Radar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Avg Health Score" value={`${metrics.avgScore}%`} subValue="System Portfolio health" icon={Heart} color="rose" />
                <MetricBox title="Retention Risk" value={metrics.atRisk} subValue="Deals Below 50%" icon={AlertCircle} color="amber" />
                <MetricBox title="Engagement Lead" value={metrics.highHealth} subValue="Likely to Expand" icon={Zap} color="emerald" />
                <MetricBox title="Monitored Clients" value={metrics.total} subValue="In Radar System" icon={Activity} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden text-sm font-outfit">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">Global Health Inventory</h2>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by client..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[12px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                        <th className="px-6 py-4">Account Portfolio</th>
                                        <th className="px-6 py-4">Health Score</th>
                                        <th className="px-6 py-4">Status & Trend</th>
                                        <th className="px-6 py-4">Usage/Support</th>
                                        <th className="px-6 py-4">Sync</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredHealth.map((health) => (
                                        <tr key={health.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50/50">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-rose-50 transition-colors">
                                                        <Building2 className="h-5 w-5 text-rose-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 font-outfit">{health.account}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 font-outfit mt-0.5">Automated Monitor</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-10 w-10 flex items-center justify-center">
                                                        <svg className="h-full w-full transform -rotate-90">
                                                            <circle cx="20" cy="20" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4" />
                                                            <circle cx="20" cy="20" r="16" fill="transparent" stroke={health.healthScore >= 80 ? '#10b981' : health.healthScore >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="4" strokeDasharray={100} strokeDashoffset={100 - health.healthScore} />
                                                        </svg>
                                                        <span className="absolute text-[10px] font-bold text-slate-900">{health.healthScore}%</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full text-[10px] font-bold font-outfit border whitespace-nowrap",
                                                            health.sentiment === 'Positive' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                                health.sentiment === 'Decline' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                    "bg-slate-50 text-slate-600 border-slate-100"
                                                        )}>
                                                            {health.sentiment}
                                                        </span>
                                                        {getTrendIcon(health.trend)}
                                                    </div>
                                                    <span className="text-[10px] font-medium text-slate-400 font-outfit">{health.trend}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-2 w-32">
                                                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                                                        <span>Usage</span>
                                                        <span>{health.usageScore}%</span>
                                                    </div>
                                                    <Progress value={health.usageScore} className="h-1 bg-slate-50" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-[11px] font-bold text-slate-400 font-outfit whitespace-nowrap">{health.lastSync}</td>
                                            <td className="px-6 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-600 transition-colors">
                                                            <MoreVertical className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 font-outfit rounded-xl">
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => {
                                                            setEditingHealth(health)
                                                            setFormData(health)
                                                            setIsDialogOpen(true)
                                                        }}>
                                                            <PencilLine className="h-4 w-4" /> Recalibrate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                            <MessageSquare className="h-4 w-4" /> Sentiment Audit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer border-t mt-1" onClick={() => handleDelete(health.id)}>
                                                            <Trash2 className="h-4 w-4" /> Disable Monitor
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 h-16 w-16 bg-blue-50 rounded-bl-full -z-0" />
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit mb-6 relative z-10">Health Breakdown</h3>
                        <div className="space-y-5 relative z-10">
                            {[
                                { name: 'Product Adoption', value: 85, color: 'bg-blue-500' },
                                { name: 'Billing Stability', value: 92, color: 'bg-emerald-500' },
                                { name: 'Support Tickets', value: 44, color: 'bg-rose-500' },
                                { name: 'Account Engagement', value: 72, color: 'bg-indigo-500' },
                            ].map((s, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[12px] font-bold text-slate-700 font-outfit">{s.name}</span>
                                        <span className="text-[12px] font-bold text-slate-900 font-outfit">{s.value}%</span>
                                    </div>
                                    <Progress value={s.value} className={cn("h-1.5 bg-slate-50", s.color)} />
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-rose-100 bg-rose-50/10 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-rose-600">
                            <AlertCircle className="h-4 w-4" />
                            <h3 className="text-xs font-bold tracking-wider font-outfit">Critical Churn Risk</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white border border-rose-100 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="text-sm font-bold text-slate-800 font-outfit">Innova Hub</p>
                                    <span className="text-[10px] font-extrabold text-rose-600 px-1.5 py-0.5 bg-rose-50 rounded italic">Action Required</span>
                                </div>
                                <p className="text-[11px] font-medium text-slate-500 font-outfit leading-relaxed">
                                    Login volume dropped by <span className="text-rose-600 font-bold">45%</span> in 7 days. Possible executive replacement at account.
                                </p>
                            </div>
                        </div>
                        <Button className="w-full mt-4 py-5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/20">
                            Run Risk Playbook
                        </Button>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Success signals</h3>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="space-y-5">
                            {[
                                { text: 'Upsell opportunity in Global Dynamics', icon: <ArrowUpRight className="h-3 w-3 text-emerald-500" /> },
                                { text: 'New champion found in DataScale', icon: <CheckCircle2 className="h-3 w-3 text-blue-500" /> },
                                { text: 'Service expansion for Swift Apps', icon: <LifeBuoy className="h-3 w-3 text-violet-500" /> },
                            ].map((sig, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-7 w-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                        {sig.icon}
                                    </div>
                                    <p className="text-[12px] font-bold text-slate-700 font-outfit">{sig.text}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
