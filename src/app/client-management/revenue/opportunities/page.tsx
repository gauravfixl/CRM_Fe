"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    Target,
    TrendingUp,
    ArrowUpRight,
    RefreshCw,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    ChevronRight,
    Building2,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    PieChart,
    CheckCircle2,
    Clock,
    Sparkles
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
interface Opportunity {
    id: number;
    client: string;
    company: string;
    type: 'New Deal' | 'Expansion' | 'Renewal';
    value: number;
    stage: 'Discovery' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closing';
    probability: number;
    expectedClose: string;
    owner: string;
}

const initialOpportunities: Opportunity[] = [
    { id: 1, client: "Enterprise Expansion", company: "Tech Co", type: "Expansion", value: 85000, stage: "Negotiation", probability: 80, expectedClose: "2024-10-30", owner: "John Doe" },
    { id: 2, client: "Global CRM Setup", company: "SysCorp", type: "New Deal", value: 240000, stage: "Discovery", probability: 35, expectedClose: "2024-12-15", owner: "Sarah Smith" },
    { id: 3, client: "Annual Service", company: "DataTech", type: "Renewal", value: 120000, stage: "Closing", probability: 95, expectedClose: "2024-11-05", owner: "Mike Johnson" },
    { id: 4, client: "Security Bundle", company: "Alpha Inc", type: "Expansion", value: 15000, stage: "Proposal", probability: 60, expectedClose: "2024-11-19", owner: "Lisa Chen" },
    { id: 5, client: "Cloud Migration", company: "BlueSky", type: "New Deal", value: 45000, stage: "Qualified", probability: 50, expectedClose: "2024-10-25", owner: "Emma Wilson" },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue, trend }: any) => {
    const colorClasses: any = {
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        rose: "from-rose-50 to-rose-100/50 border-rose-200/50 text-rose-600",
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
        indigo: "from-indigo-50 to-indigo-100/50 border-indigo-200/50 text-indigo-600",
        amber: "from-amber-50 to-amber-100/50 border-amber-200/50 text-amber-600",
        violet: "from-violet-50 to-violet-100/50 border-violet-200/50 text-violet-600",
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

export default function OpportunitiesPage() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null)
    const { toast } = useToast()

    // Form states
    const [formData, setFormData] = useState<Partial<Opportunity>>({
        client: '',
        company: '',
        type: 'New Deal',
        value: 0,
        stage: 'Discovery',
        probability: 50,
        expectedClose: '',
        owner: ''
    })

    const metrics = useMemo(() => {
        const total = opportunities.reduce((sum, item) => sum + item.value, 0)
        const weighted = opportunities.reduce((sum, item) => sum + (item.value * (item.probability / 100)), 0)
        const avgProb = opportunities.length > 0 ? (opportunities.reduce((sum, item) => sum + item.probability, 0) / opportunities.length).toFixed(0) : 0
        const highValueCount = opportunities.filter(o => o.value > 100000).length

        const formatCurrency = (val: number) => {
            if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`
            if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`
            return `$${val}`
        }

        return {
            total: formatCurrency(total),
            weighted: formatCurrency(weighted),
            avgProb: `${avgProb}%`,
            highValue: highValueCount,
            count: opportunities.length
        }
    }, [opportunities])

    const filteredOpportunities = useMemo(() => {
        return opportunities.filter(o =>
            o.client.toLowerCase().includes(search.toLowerCase()) ||
            o.company.toLowerCase().includes(search.toLowerCase()) ||
            o.owner.toLowerCase().includes(search.toLowerCase())
        )
    }, [opportunities, search])

    const handleDelete = (id: number) => {
        setOpportunities(prev => prev.filter(o => o.id !== id))
        toast({ title: "Opportunity Deleted", description: "Record has been removed successfully." })
    }

    const handleSave = () => {
        if (!formData.client || !formData.company || !formData.value) return

        if (editingOpp) {
            setOpportunities(prev => prev.map(o => o.id === editingOpp.id ? { ...o, ...formData } as Opportunity : o))
            toast({ title: "Opportunity Updated", description: "All changes have been saved." })
        } else {
            const newId = opportunities.length > 0 ? Math.max(...opportunities.map(o => o.id)) + 1 : 1
            setOpportunities(prev => [...prev, { ...formData, id: newId } as Opportunity])
            toast({ title: "Opportunity Created", description: "New deal added to your pipeline." })
        }
        setIsDialogOpen(false)
        setEditingOpp(null)
        setFormData({ client: '', company: '', type: 'New Deal', value: 0, stage: 'Discovery', probability: 50, expectedClose: '', owner: '' })
    }

    const openEdit = (opp: Opportunity) => {
        setEditingOpp(opp)
        setFormData(opp)
        setIsDialogOpen(true)
    }

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'Closing': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
            case 'Negotiation': return 'bg-indigo-50 text-indigo-600 border-indigo-100'
            case 'Proposal': return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'Qualified': return 'bg-violet-50 text-violet-600 border-violet-100'
            default: return 'bg-slate-50 text-slate-600 border-slate-100'
        }
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Active <span className="text-emerald-600">Opportunities</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Manage and track your active revenue pipeline across new sales and enterprise deals.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { setEditingOpp(null); setFormData({ client: '', company: '', type: 'New Deal', value: 0, stage: 'Discovery', probability: 50, expectedClose: '', owner: '' }) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-emerald-600/20 gap-2">
                            <Plus className="h-5 w-5" /> New Opportunity
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingOpp ? 'Edit Opportunity' : 'Create New Opportunity'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Opportunity Name</Label>
                                    <Input value={formData.client} onChange={e => setFormData({ ...formData, client: e.target.value })} placeholder="e.g. Enterprise License" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Company</Label>
                                    <Input value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="e.g. Acme Corp" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Projected Value ($)</Label>
                                    <Input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Probability (%)</Label>
                                    <Input type="number" min="0" max="100" value={formData.probability} onChange={e => setFormData({ ...formData, probability: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Stage</Label>
                                    <Select value={formData.stage} onValueChange={(v: any) => setFormData({ ...formData, stage: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Discovery">Discovery</SelectItem>
                                            <SelectItem value="Qualified">Qualified</SelectItem>
                                            <SelectItem value="Proposal">Proposal</SelectItem>
                                            <SelectItem value="Negotiation">Negotiation</SelectItem>
                                            <SelectItem value="Closing">Closing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Deal Type</Label>
                                    <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="New Deal">New Deal</SelectItem>
                                            <SelectItem value="Expansion">Expansion</SelectItem>
                                            <SelectItem value="Renewal">Renewal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Expected Close</Label>
                                    <Input type="date" value={formData.expectedClose} onChange={e => setFormData({ ...formData, expectedClose: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Owner</Label>
                                    <Input value={formData.owner} onChange={e => setFormData({ ...formData, owner: e.target.value })} placeholder="e.g. Sales Rep Name" />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" /> Save Deal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Opportunity Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Total Pipeline" value={metrics.total} subValue={`${metrics.count} Active Opportunities`} icon={Target} color="blue" trend="+12%" />
                <MetricBox title="Weighted Value" value={metrics.weighted} subValue="Adjusted Pipeline" icon={TrendingUp} color="indigo" trend="+8%" />
                <MetricBox title="Avg. Probability" value={metrics.avgProb} subValue="Likelihood to Close" icon={RefreshCw} color="violet" trend="+3%" />
                <MetricBox title="High Value Deals" value={metrics.highValue} subValue="Deals above $100k" icon={ArrowUpRight} color="emerald" trend="+2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">Pipeline Overview</h2>
                                <div className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[12px] font-bold font-outfit">{filteredOpportunities.length} Active Deals</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search deals..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                                <Button variant="outline" size="icon" className="rounded-xl text-slate-400"><Filter className="h-4.5 w-4.5" /></Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[12px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                        <th className="px-6 py-4">Opportunity & Client</th>
                                        <th className="px-6 py-4">Value</th>
                                        <th className="px-6 py-4">Stage</th>
                                        <th className="px-6 py-4">Probability</th>
                                        <th className="px-6 py-4">Expected Close</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredOpportunities.length > 0 ? filteredOpportunities.map((opp) => (
                                        <tr key={opp.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50/50">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-emerald-50 transition-colors">
                                                        <Building2 className="h-5 w-5 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 font-outfit">{opp.client}</p>
                                                        <p className="text-[11px] font-medium text-slate-500 font-outfit">{opp.company}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold text-slate-900 font-outfit">${opp.value.toLocaleString()}</td>
                                            <td className="px-6 py-5">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[11px] font-bold font-outfit border",
                                                    getStageColor(opp.stage)
                                                )}>
                                                    {opp.stage}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ width: `${opp.probability}%` }} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900 font-outfit">{opp.probability}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span className="text-[11px] font-bold font-outfit">{opp.expectedClose}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-emerald-600 transition-colors">
                                                            <MoreVertical className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 font-outfit rounded-xl border-slate-200">
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => openEdit(opp)}>
                                                            <PencilLine className="h-4 w-4" /> Edit Record
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-blue-600">
                                                            <Eye className="h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer border-t mt-1" onClick={() => handleDelete(opp.id)}>
                                                            <Trash2 className="h-4 w-4" /> Remove
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center">
                                                <p className="text-sm font-bold text-slate-500 font-outfit">No active opportunities found for this search.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <Card className="border-slate-200 shadow-none">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 font-outfit">Pipeline Stage Distribution</h3>
                                    <p className="text-sm text-slate-500 font-outfit mt-1">Movement of deals through the sales cycle</p>
                                </div>
                                <PieChart className="h-5 w-5 text-slate-400" />
                            </div>
                            <div className="space-y-6">
                                {[
                                    { stage: 'Closing', count: 2, value: '$165k', progress: 90, color: 'bg-emerald-500' },
                                    { stage: 'Negotiation', count: 3, value: '$210k', progress: 70, color: 'bg-indigo-500' },
                                    { stage: 'Proposal', count: 4, value: '$120k', progress: 50, color: 'bg-blue-500' },
                                    { stage: 'Qualified', count: 6, value: '$85k', progress: 30, color: 'bg-violet-500' },
                                    { stage: 'Discovery', count: 12, value: '$340k', progress: 15, color: 'bg-slate-400' },
                                ].map((item, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px] font-bold font-outfit">
                                            <span className="text-slate-700">{item.stage} <span className="text-slate-400 font-medium ml-2">{item.count} Deals</span></span>
                                            <span className="text-slate-900">{item.value}</span>
                                        </div>
                                        <Progress value={item.progress} className="h-1.5 bg-slate-50" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Priority Closures Card */}
                    <Card className="border-slate-200 shadow-none overflow-hidden">
                        <div className="p-6">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit mb-6">Priority Closures</h3>
                            <div className="space-y-5">
                                {opportunities.filter(o => o.probability > 70).slice(0, 4).map((deal, idx) => (
                                    <div key={idx} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1 rounded-xl transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 border border-emerald-100">
                                                {deal.client.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 font-outfit leading-none">{deal.client}</p>
                                                <p className="text-[10px] text-slate-400 font-medium font-outfit mt-1">{deal.expectedClose}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-900 font-outfit">${(deal.value / 1000).toFixed(0)}k</p>
                                            <div className="flex items-center gap-1 justify-end mt-1">
                                                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                                <span className="text-[9px] font-bold text-emerald-600 font-outfit">{deal.probability}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                            <Button variant="ghost" className="w-full text-xs font-bold font-outfit text-indigo-600 hover:text-indigo-700">
                                View Full Pipeline Analytics
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-indigo-100 bg-indigo-50/10 shadow-none relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-16 w-16 bg-indigo-600/5 rounded-bl-full transition-transform group-hover:scale-150" />
                        <div className="p-6">
                            <h3 className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 font-outfit">
                                <Sparkles className="h-4 w-4" /> AI Deal Insights
                            </h3>
                            <div className="mt-6 space-y-4">
                                <div className="p-3 bg-white border border-indigo-100 rounded-xl shadow-sm">
                                    <p className="text-[11px] font-medium text-slate-600 leading-relaxed font-outfit">
                                        <span className="text-indigo-600 font-bold font-outfit">Project Horizon</span> has been in Discovery for 24 days. Set a follow-up task now.
                                    </p>
                                </div>
                                <div className="p-3 bg-white border border-indigo-100 rounded-xl shadow-sm">
                                    <p className="text-[11px] font-medium text-slate-600 leading-relaxed font-outfit">
                                        Similar deals with <span className="text-indigo-600 font-bold font-outfit">90%+ prob.</span> usually close in 14 days. Suggest accelerating.
                                    </p>
                                </div>
                            </div>
                            <Button className="w-full mt-6 py-6 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all font-outfit font-bold">
                                Run Win-Strategy Analysis
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-slate-200 shadow-none">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Sales Momentum</h3>
                                <Clock className="h-4 w-4 text-indigo-400" />
                            </div>
                            <div className="space-y-6 relative">
                                <div className="absolute left-[20px] top-2 bottom-0 w-0.5 bg-slate-50" />
                                {[
                                    { user: 'JD', action: 'Moved to Closing', target: 'Acme Corp', time: '1h ago' },
                                    { user: 'SW', action: 'New Opportunity:', target: 'Netflix', time: '3h ago' },
                                    { user: 'MJ', action: 'Stage change for', target: 'Globex', time: '1d ago' },
                                ].map((log, i) => (
                                    <div key={i} className="relative flex items-center gap-4 group">
                                        <div className="h-10 w-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 z-10 shadow-sm group-hover:border-indigo-200 transition-colors">
                                            {log.user}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[12px] font-bold text-slate-700 font-outfit leading-tight">
                                                {log.action} <span className="text-indigo-600 font-extrabold">{log.target}</span>
                                            </p>
                                            <p className="text-[10px] font-semibold text-slate-400 font-outfit mt-0.5">{log.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
