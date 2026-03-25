"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    Zap,
    TrendingUp,
    ArrowUpRight,
    PackagePlus,
    Layers,
    Sparkles,
    Search,
    Filter,
    MoreVertical,
    ChevronRight,
    Building2,
    Rocket,
    Plus,
    Target,
    Trash2,
    PencilLine,
    ExternalLink,
    PieChart
} from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'

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
interface Expansion {
    id: number;
    client: string;
    target: string;
    value: number;
    type: 'Upsell' | 'Cross-sell' | 'Add-on' | 'Upgrade';
    probability: number;
    segment: 'Enterprise' | 'Mid-Market' | 'SMB';
}

const initialExpansions: Expansion[] = [
    { id: 1, client: 'DataScale Inc', target: 'Professional Upgrade', value: 8500, type: 'Upsell', probability: 75, segment: 'Mid-Market' },
    { id: 2, client: 'Innova Hub', target: 'API & Webhooks Add-on', value: 2200, type: 'Add-on', probability: 90, segment: 'SMB' },
    { id: 3, client: 'Global Dynamics', target: 'Global Security Suite', value: 12000, type: 'Cross-sell', probability: 45, segment: 'Enterprise' },
    { id: 4, client: 'Swift Apps', target: 'Unlimited Seats', value: 1500, type: 'Upgrade', probability: 95, segment: 'SMB' },
    { id: 5, client: 'Horizon Media', target: 'SSO & Advanced Governance', value: 4800, type: 'Upsell', probability: 82, segment: 'Mid-Market' },
]

const chartData = [
    { name: 'Upsells', value: 45, color: '#4f46e5' },
    { name: 'Cross-sells', value: 30, color: '#8b5cf6' },
    { name: 'Add-ons', value: 25, color: '#d946ef' },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue, trend }: any) => {
    const colorClasses: any = {
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        indigo: "from-indigo-50 to-indigo-100/50 border-indigo-200/50 text-indigo-600",
        violet: "from-violet-50 to-violet-100/50 border-violet-200/50 text-violet-600",
        fuchsia: "from-fuchsia-50 to-fuchsia-100/50 border-fuchsia-200/50 text-fuchsia-600",
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

export default function ExpansionPage() {
    const [expansions, setExpansions] = useState<Expansion[]>(initialExpansions)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingExp, setEditingExp] = useState<Expansion | null>(null)

    // Form states
    const [formData, setFormData] = useState<Partial<Expansion>>({
        client: '',
        target: '',
        value: 0,
        type: 'Upsell',
        probability: 50,
        segment: 'Mid-Market'
    })

    const metrics = useMemo(() => {
        const total = expansions.reduce((sum, item) => sum + item.value, 0)
        const avg = expansions.length > 0 ? (total / expansions.length).toFixed(0) : 0
        const highProb = expansions.filter(e => e.probability > 80).length

        const formatCurrency = (val: number) => {
            if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`
            return `$${val}`
        }

        return {
            total: formatCurrency(total),
            avg: formatCurrency(Number(avg)),
            highProbCount: highProb,
            count: expansions.length
        }
    }, [expansions])

    const filteredExpansions = useMemo(() => {
        return expansions.filter(e =>
            e.client.toLowerCase().includes(search.toLowerCase()) ||
            e.type.toLowerCase().includes(search.toLowerCase()) ||
            e.target.toLowerCase().includes(search.toLowerCase())
        )
    }, [expansions, search])

    const handleDelete = (id: number) => {
        setExpansions(prev => prev.filter(e => e.id !== id))
    }

    const handleSave = () => {
        if (!formData.client || !formData.value || !formData.target) return

        if (editingExp) {
            setExpansions(prev => prev.map(e => e.id === editingExp.id ? { ...e, ...formData } as Expansion : e))
        } else {
            const newId = expansions.length > 0 ? Math.max(...expansions.map(e => e.id)) + 1 : 1
            setExpansions(prev => [...prev, { ...formData, id: newId } as Expansion])
        }
        setIsDialogOpen(false)
        setEditingExp(null)
        setFormData({ client: '', target: '', value: 0, type: 'Upsell', probability: 50, segment: 'Mid-Market' })
    }

    const openEdit = (exp: Expansion) => {
        setEditingExp(exp)
        setFormData(exp)
        setIsDialogOpen(true)
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Revenue <span className="text-violet-600">Expansion Engine</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Identify upsell paths and cross-sell opportunities to maximize account lifetime value.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { setEditingExp(null); setFormData({ client: '', target: '', value: 0, type: 'Upsell', probability: 50, segment: 'Mid-Market' }) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-violet-600/20 gap-2">
                            <Plus className="h-5 w-5" /> New Opportunity
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingExp ? 'Edit Opportunity' : 'Add New Expansion'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Client Name</Label>
                                    <Input value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} placeholder="e.g. Acme Corp" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Projected Value ($)</Label>
                                    <Input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Target Offer</Label>
                                <Input value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} placeholder="e.g. Enterprise License Upgrade" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Expansion Type</Label>
                                    <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Upsell">Upsell</SelectItem>
                                            <SelectItem value="Cross-sell">Cross-sell</SelectItem>
                                            <SelectItem value="Add-on">Add-on</SelectItem>
                                            <SelectItem value="Upgrade">Upgrade</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Segment</Label>
                                    <Select value={formData.segment} onValueChange={(v: any) => setFormData({ ...formData, segment: v })}>
                                        <SelectTrigger><SelectValue placeholder="Segment" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                                            <SelectItem value="Mid-Market">Mid-Market</SelectItem>
                                            <SelectItem value="SMB">SMB</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Probability ({formData.probability}%)</Label>
                                <Input type="range" min="0" max="100" value={formData.probability} onChange={e => setFormData({ ...formData, probability: Number(e.target.value) })} />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-violet-600 hover:bg-violet-700 text-white" onClick={handleSave}>Save Record</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Expansion Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <MetricBox title="Expansion Pipeline" value={metrics.total} subValue={`${metrics.count} Active Deals`} icon={Zap} color="blue" trend="+18%" />
                <MetricBox title="Upsell Velocity" value="2.4/mo" subValue="MoM Growth" icon={PackagePlus} color="indigo" trend="+4%" />
                <MetricBox title="Avg. Expansion" value={metrics.avg} subValue="Per Account" icon={Layers} color="fuchsia" trend="+5%" />
                <MetricBox title="High Confidence" value={metrics.highProbCount} subValue="Prob. > 80%" icon={Rocket} color="violet" trend="+22%" />
                <MetricBox title="Growth Signals" value="14 active" subValue="AI Recommendations" icon={Target} color="amber" trend="+3" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">High-Probability Paths</h2>
                                <div className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[12px] font-bold font-outfit">{filteredExpansions.length} paths</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search deals..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                                <Button variant="outline" size="icon" className="rounded-xl text-slate-400"><Filter className="h-4.5 w-4.5" /></Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[12px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                        <th className="px-6 py-4">Client & Offer</th>
                                        <th className="px-6 py-4">Type & Segment</th>
                                        <th className="px-6 py-4">Projected Value</th>
                                        <th className="px-6 py-4">Probability</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredExpansions.length > 0 ? filteredExpansions.map((offer) => (
                                        <tr key={offer.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50/50">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-violet-50 transition-colors">
                                                        <Building2 className="h-5 w-5 text-violet-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 font-outfit">{offer.client}</p>
                                                        <p className="text-[11px] font-medium text-slate-500 font-outfit">{offer.target}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className={cn(
                                                        "inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-[11px] font-bold font-outfit border",
                                                        offer.type === 'Upsell' ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                                                            offer.type === 'Add-on' ? "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100" :
                                                                "bg-violet-50 text-violet-600 border-violet-100"
                                                    )}>
                                                        {offer.type}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold font-outfit ml-1">{offer.segment}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold text-slate-900 font-outfit">${offer.value.toLocaleString()}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                        <div className="h-full bg-violet-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(139,92,246,0.3)]" style={{ width: `${offer.probability}%` }} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900 font-outfit">{offer.probability}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-violet-600 transition-colors">
                                                            <MoreVertical className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 font-outfit">
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => openEdit(offer)}>
                                                            <PencilLine className="h-4 w-4" /> Edit Deal
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer" onClick={() => handleDelete(offer.id)}>
                                                            <Trash2 className="h-4 w-4" /> Remove
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer border-t mt-1">
                                                            <ExternalLink className="h-4 w-4" /> View Account
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <p className="text-sm font-bold text-slate-500 font-outfit">No expansion deals found for this search.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 font-outfit">Expansion Contribution</h3>
                                <p className="text-sm text-slate-500 font-outfit mt-1">Volume by expansion category and account segment</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-indigo-600" />
                                    <span className="text-xs font-bold text-slate-500 font-outfit">Upsells</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-fuchsia-600" />
                                    <span className="text-xs font-bold text-slate-500 font-outfit">Add-ons</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: 'white', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Segment Breakdown Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Segment Potential</h3>
                            <PieChart className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Enterprise', value: '$450k', color: 'bg-indigo-600', count: 12 },
                                { name: 'Mid-Market', value: '$282k', color: 'bg-indigo-400', count: 24 },
                                { name: 'SMB', value: '$110k', color: 'bg-indigo-200', count: 48 },
                            ].map((seg) => (
                                <div key={seg.name} className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-2 w-2 rounded-full", seg.color)} />
                                        <div>
                                            <p className="text-[13px] font-bold text-slate-800 font-outfit leading-none">{seg.name}</p>
                                            <p className="text-[11px] font-medium text-slate-400 font-outfit mt-1">{seg.count} targets</p>
                                        </div>
                                    </div>
                                    <span className="text-[14px] font-bold text-slate-900 font-outfit">{seg.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/10 p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-16 w-16 bg-indigo-600/5 rounded-bl-full transition-transform group-hover:scale-150" />
                        <h3 className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 font-outfit">
                            <Sparkles className="h-4 w-4" /> AI Growth Triggers
                        </h3>
                        <div className="mt-6 space-y-4">
                            <div className="p-4 bg-white border border-indigo-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                                <p className="text-sm font-medium text-slate-600 leading-relaxed font-outfit">
                                    <span className="text-indigo-600 font-bold font-outfit">Tesla</span> users have exceeded seat limits by <span className="text-indigo-600 font-bold font-outfit">15%</span> for 2 months.
                                </p>
                            </div>
                            <div className="p-4 bg-white border border-indigo-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                                <p className="text-sm font-medium text-slate-600 leading-relaxed font-outfit">
                                    High adoption of 'Advanced Analytics' in <span className="text-indigo-600 font-bold font-outfit">Globex</span> suggests potential for Enterprise upgrade.
                                </p>
                            </div>
                        </div>
                        <Button className="w-full mt-6 py-6 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all font-outfit">
                            Push Expansion Playbook
                        </Button>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Growth Channels</h3>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="space-y-4">
                            {chartData.map((item) => (
                                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-slate-200 transition-all cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-[13px] font-bold text-slate-700 font-outfit">{item.name}</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-900 font-outfit">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Sales Momentum</h3>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="space-y-6 relative">
                            <div className="absolute left-[23px] top-2 bottom-0 w-0.5 bg-slate-50" />
                            {[
                                { user: 'JR', action: 'Closed expansion for', target: 'Acme Corp', time: '2h ago' },
                                { user: 'SM', action: 'Upgraded license for', target: 'Netflix', time: '5h ago' },
                                { user: 'AW', action: 'Added security suite to', target: 'Globex', time: '1d ago' },
                            ].map((win, i) => (
                                <div key={i} className="relative flex items-center gap-5 group">
                                    <div className="h-[46px] w-[46px] rounded-full bg-white border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 z-10 shadow-sm group-hover:border-violet-200 transition-colors">
                                        {win.user}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] font-bold text-slate-700 font-outfit leading-snug">
                                            {win.action} <span className="text-violet-600 font-extrabold">{win.target}</span>
                                        </p>
                                        <p className="text-[12px] font-semibold text-slate-400 font-outfit mt-0.5">{win.time}</p>
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
