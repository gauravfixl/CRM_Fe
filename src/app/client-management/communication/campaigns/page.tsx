"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    Megaphone,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    Building2,
    Target,
    Users,
    TrendingUp,
    CheckCircle2,
    Clock,
    Play,
    Pause,
    BarChart3,
    ArrowUpRight,
    ChevronRight,
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
import { useToast } from "@/shared/components/ui/use-toast"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"

// Types
interface Campaign {
    id: number;
    name: string;
    status: 'Active' | 'Draft' | 'Paused' | 'Completed';
    audience: string;
    reach: number;
    engagement: number; // Percentage
    type: 'Email' | 'Multi-Channel' | 'SMS';
    startDate: string;
}

const initialCampaigns: Campaign[] = [
    { id: 1, name: "Q4 Partner Expansion", status: "Active", audience: "Enterprise Tier 1", reach: 1240, engagement: 42, type: "Multi-Channel", startDate: "Oct 1, 2024" },
    { id: 2, name: "AI Features Beta Teaser", status: "Paused", audience: "Power Users", reach: 3500, engagement: 68, type: "Email", startDate: "Sep 28, 2024" },
    { id: 3, name: "Annual Renewal Reminder", status: "Active", audience: "Subscription Expiring", reach: 450, engagement: 89, type: "Email", startDate: "Oct 5, 2024" },
    { id: 4, name: "Retention Drive: Inactive", status: "Draft", audience: "Inactive > 30d", reach: 890, engagement: 0, type: "SMS", startDate: "TBD" },
    { id: 5, name: "Strategic QBR Push", status: "Completed", audience: "Key Stakeholders", reach: 120, engagement: 94, type: "Multi-Channel", startDate: "Sep 15, 2024" },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue }: any) => {
    const colorClasses: any = {
        rose: "from-rose-50 to-rose-100/50 border-rose-200/50 text-rose-600",
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
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

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
    const { toast } = useToast()

    const [formData, setFormData] = useState<Partial<Campaign>>({
        name: '',
        status: 'Draft',
        audience: '',
        reach: 0,
        engagement: 0,
        type: 'Email',
        startDate: new Date().toLocaleDateString()
    })

    const metrics = useMemo(() => {
        const total = campaigns.length
        const activeCount = campaigns.filter(c => c.status === 'Active').length
        const avgEngagement = (campaigns.reduce((sum, c) => sum + c.engagement, 0) / (campaigns.filter(c => c.status !== 'Draft').length || 1)).toFixed(0)
        const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0).toLocaleString()

        return { total, activeCount, avgEngagement: `${avgEngagement}%`, totalReach }
    }, [campaigns])

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.audience.toLowerCase().includes(search.toLowerCase())
        )
    }, [campaigns, search])

    const handleDelete = (id: number) => {
        setCampaigns(prev => prev.filter(c => c.id !== id))
        toast({ title: "Campaign Retired", description: "Communication workflow has been terminated." })
    }

    const handleSave = () => {
        if (!formData.name || !formData.audience) return

        if (editingCampaign) {
            setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? { ...c, ...formData } as Campaign : c))
            toast({ title: "Parameters Updated", description: "Campaign strategy has been modified." })
        } else {
            const newId = campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1
            setCampaigns(prev => [{ ...formData, id: newId } as Campaign, ...prev])
            toast({ title: "Campaign Initialized", description: "New outreach protocol is now live." })
        }
        setIsDialogOpen(false)
        setEditingCampaign(null)
        setFormData({ name: '', status: 'Draft', audience: '', reach: 0, engagement: 0, type: 'Email', startDate: new Date().toLocaleDateString() })
    }

    const getStatusProps = (status: string) => {
        switch (status) {
            case 'Active': return { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <Play className="h-3 w-3" /> }
            case 'Paused': return { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <Pause className="h-3 w-3" /> }
            case 'Draft': return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: <Clock className="h-3 w-3" /> }
            case 'Completed': return { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <CheckCircle2 className="h-3 w-3" /> }
            default: return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: <Clock className="h-3 w-3" /> }
        }
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit text-sm">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Outreach <span className="text-rose-600">Campaigns</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Design and orchestrate multi-channel communication sequences for targeted segments.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { setEditingCampaign(null); setFormData({ name: '', status: 'Draft', audience: '', reach: 0, engagement: 0, type: 'Email', startDate: new Date().toLocaleDateString() }) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-rose-600/20 gap-2 transition-all hover:scale-105 active:scale-95">
                            <Plus className="h-5 w-5" /> Launch Campaign
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingCampaign ? 'Refine Strategy' : 'Define Outreach Protocol'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Campaign Title</Label>
                                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Q4 Executive Push" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Target Audience / Segment</Label>
                                    <Input value={formData.audience} onChange={e => setFormData({ ...formData, audience: e.target.value })} placeholder="e.g. Inactive Accounts > 50k MRR" />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2 col-span-1">
                                    <Label className="font-bold text-slate-700">Protocol Type</Label>
                                    <Select value={formData.type} onValueChange={(v: any) => setFormData({ ...formData, type: v })}>
                                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Email">Direct Email</SelectItem>
                                            <SelectItem value="SMS">SMS Gateway</SelectItem>
                                            <SelectItem value="Multi-Channel">Orchestrated (Email+SMS)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label className="font-bold text-slate-700">Initial Status</Label>
                                    <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Draft Mode</SelectItem>
                                            <SelectItem value="Active">Pulse Live</SelectItem>
                                            <SelectItem value="Paused">Hold Dispatch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <Label className="font-bold text-slate-700">Projected Reach</Label>
                                    <Input type="number" value={formData.reach} onChange={e => setFormData({ ...formData, reach: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="p-5 bg-rose-50/30 border border-rose-100 rounded-xl relative overflow-hidden">
                                <Sparkles className="absolute -right-2 -bottom-2 h-12 w-12 text-rose-500/5 rotate-12" />
                                <h4 className="text-[12px] font-bold text-rose-800 mb-2 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" /> AI Predictive Reach
                                </h4>
                                <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                                    Based on the selected segment, this campaign has a <span className="text-emerald-600 font-bold">78% probability</span> of meeting engagement KPIs.
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Save Blueprint</Button>
                            <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" /> Launch Outreach
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Active Workflows" value={metrics.activeCount} subValue="Live Pulse" icon={Play} color="rose" />
                <MetricBox title="Global Engagement" value={metrics.avgEngagement} subValue="Portfolio Score" icon={TrendingUp} color="emerald" />
                <MetricBox title="Total Reach" value={metrics.totalReach} subValue="Last 30 Days" icon={Users} color="blue" />
                <MetricBox title="High Intensity" value="3" subValue="Critical Priority" icon={Target} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden font-outfit">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">Campaign Command Center</h2>
                                <Badge variant="secondary" className="bg-rose-50 text-rose-600 border-0 font-bold ml-1">{filteredCampaigns.length} tracks</Badge>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search campaigns..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-slate-400 h-10 w-10 hover:bg-rose-50 transition-colors">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[12px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                        <th className="px-6 py-4">Campaign Track</th>
                                        <th className="px-6 py-4">Status & Type</th>
                                        <th className="px-6 py-4">Reach & Engagement</th>
                                        <th className="px-6 py-4">Start Orbit</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredCampaigns.map((c) => {
                                        const props = getStatusProps(c.status)
                                        return (
                                            <tr key={c.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50/50">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 shadow-sm text-rose-600">
                                                            <Megaphone className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 font-outfit truncate max-w-[200px]">{c.name}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 font-outfit mt-0.5 whitespace-nowrap">{c.audience || 'Unassigned Cluster'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className={cn(
                                                            "inline-flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full text-[9px] font-bold font-outfit border whitespace-nowrap shadow-sm",
                                                            props.color
                                                        )}>
                                                            {props.icon}
                                                            {c.status}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 font-outfit ml-1">{c.type} Protocol</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="space-y-1.5">
                                                        <div className="flex justify-between items-center text-[10px] font-bold font-outfit text-slate-600">
                                                            <span>{c.reach.toLocaleString()} Reach</span>
                                                            <span className="text-rose-600">{c.engagement}% Eng.</span>
                                                        </div>
                                                        <Progress value={c.engagement} className="h-1 bg-slate-50" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span className="text-[11px] font-bold font-outfit">{c.startDate}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-600 transition-colors">
                                                                <MoreVertical className="h-5 w-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 font-outfit rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => {
                                                                setEditingCampaign(c)
                                                                setFormData(c)
                                                                setIsDialogOpen(true)
                                                            }}>
                                                                <PencilLine className="h-4 w-4" /> Pivot Strategy
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                                <BarChart3 className="h-4 w-4" /> Expansion ROI
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                                {c.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                                                {c.status === 'Active' ? 'Halt Campaign' : 'Resume Pulse'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer border-t mt-1" onClick={() => handleDelete(c.id)}>
                                                                <Trash2 className="h-4 w-4" /> Archive Asset
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 h-16 w-16 bg-rose-50 rounded-bl-full -z-0 opacity-40 group-hover:scale-150 transition-transform" />
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit mb-6 relative z-10">Conversion Funnel</h3>
                        <div className="space-y-6 relative z-10">
                            {[
                                { stage: 'Initial Recall', pct: 100, color: 'bg-slate-400' },
                                { stage: 'Email Open', pct: 72, color: 'bg-blue-500' },
                                { stage: 'CTA Click', pct: 24, color: 'bg-rose-500' },
                                { stage: 'Conversion', pct: 5.8, color: 'bg-emerald-500' },
                            ].map((s, i) => (
                                <div key={i} className="space-y-1.5 text-[10px] font-bold font-outfit">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-slate-600">{s.stage}</span>
                                        <span className="text-slate-900">{s.pct}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full opacity-80", s.color)} style={{ width: `${s.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-50">
                            <p className="text-[10px] font-medium text-slate-400 leading-relaxed font-outfit italic">
                                * Aggregate data across all active enterprise tracks.
                            </p>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-emerald-100 bg-emerald-50/10 p-6 shadow-sm overflow-hidden group">
                        <div className="flex items-center gap-2 mb-6 text-emerald-600">
                            <TrendingUp className="h-4 w-4" />
                            <h3 className="text-xs font-bold tracking-wider font-outfit">Top Performer</h3>
                        </div>
                        <div className="p-4 bg-white border border-emerald-100 rounded-xl relative group-hover:shadow-md transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-3">
                                <div className="space-y-1">
                                    <p className="text-[13px] font-bold text-slate-900 font-outfit leading-tight mb-1">Q4 Partner Expansion</p>
                                    <p className="text-[10px] font-medium text-slate-400 font-outfit">Enterprise Segments</p>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="text-center p-2 rounded-lg bg-emerald-50/50">
                                    <p className="text-[12px] font-bold text-emerald-600 font-outfit">42%</p>
                                    <p className="text-[8px] font-bold text-slate-400 font-outfit">Eng. Rate</p>
                                </div>
                                <div className="text-center p-2 rounded-lg bg-blue-50/50">
                                    <p className="text-[12px] font-bold text-blue-600 font-outfit">1.2k</p>
                                    <p className="text-[8px] font-bold text-slate-400 font-outfit">Reach</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Growth Triggers</h3>
                            <ChevronRight className="h-4 w-4 text-slate-200" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { text: 'Expansion Alert V2', type: 'Email', drift: '+12%' },
                                { text: 'Renewal Ping (Automated)', type: 'SMS', drift: '+4%' },
                            ].map((t, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100 group hover:border-rose-100 transition-all cursor-pointer">
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-slate-700 font-outfit">{t.text}</p>
                                        <p className="text-[9px] font-medium text-slate-400 font-outfit">{t.type} Workflow</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-500 font-outfit">{t.drift}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
