"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    Map,
    Compass,
    Flag,
    Wind,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    Building2,
    ChevronRight,
    ArrowRight,
    Award,
    HeartHandshake,
    Lightbulb,
    Zap,
    Users
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

// Types
interface RoadmapStage {
    id: number;
    account: string;
    lifecycle: 'Discovery' | 'Onboarding' | 'Adoption' | 'Value Realization' | 'Advocacy';
    duration: string;
    nextMilestone: string;
    lastTouchpoint: string;
}

const initialRoadmap: RoadmapStage[] = [
    { id: 1, account: "Global Dynamics", lifecycle: "Advocacy", duration: "1.8 years", nextMilestone: "Case Study Review", lastTouchpoint: "Yesterday" },
    { id: 2, account: "DataScale Inc", lifecycle: "Value Realization", duration: "9 months", nextMilestone: "Expansion Audit", lastTouchpoint: "3 days ago" },
    { id: 3, account: "Innova Hub", lifecycle: "Adoption", duration: "4 months", nextMilestone: "Power User Training", lastTouchpoint: "5 hours ago" },
    { id: 4, account: "Swift Apps", lifecycle: "Onboarding", duration: "2 weeks", nextMilestone: "Technical Setup", lastTouchpoint: "Last Week" },
    { id: 5, account: "Horizon Media", lifecycle: "Value Realization", duration: "1.2 years", nextMilestone: "Quarterly Review", lastTouchpoint: "2 days ago" },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue }: any) => {
    const colorClasses: any = {
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        indigo: "from-indigo-50 to-indigo-100/50 border-indigo-200/50 text-indigo-600",
        violet: "from-violet-50 to-violet-100/50 border-violet-200/50 text-violet-600",
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
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

export default function CustomerJourneyPage() {
    const [roadmap, setRoadmap] = useState<RoadmapStage[]>(initialRoadmap)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingStage, setEditingStage] = useState<RoadmapStage | null>(null)
    const { toast } = useToast()

    const [formData, setFormData] = useState<Partial<RoadmapStage>>({
        account: '',
        lifecycle: 'Discovery',
        duration: '0 months',
        nextMilestone: '',
        lastTouchpoint: 'Just now'
    })

    const metrics = useMemo(() => {
        const total = roadmap.length
        const advocates = roadmap.filter(r => r.lifecycle === 'Advocacy').length
        const maturing = roadmap.filter(r => r.lifecycle === 'Value Realization').length

        return { total, advocates, maturing, avgAge: "11.4mo" }
    }, [roadmap])

    const filteredRoadmap = useMemo(() => {
        return roadmap.filter(r => r.account.toLowerCase().includes(search.toLowerCase()))
    }, [roadmap, search])

    const handleDelete = (id: number) => {
        setRoadmap(prev => prev.filter(r => r.id !== id))
        toast({ title: "Journey Ceased", description: "Record removed from lifecycle tracking." })
    }

    const handleSave = () => {
        if (!formData.account || !formData.nextMilestone) return

        if (editingStage) {
            setRoadmap(prev => prev.map(r => r.id === editingStage.id ? { ...r, ...formData } as RoadmapStage : r))
            toast({ title: "Lifecycle Updated", description: "Customer journey phase recorded." })
        } else {
            const newId = roadmap.length > 0 ? Math.max(...roadmap.map(r => r.id)) + 1 : 1
            setRoadmap(prev => [...prev, { ...formData, id: newId } as RoadmapStage])
            toast({ title: "Journey Started", description: "New client lifecycle initialized." })
        }
        setIsDialogOpen(false)
        setEditingStage(null)
        setFormData({ account: '', lifecycle: 'Discovery', duration: '0 months', nextMilestone: '', lastTouchpoint: 'Just now' })
    }

    const getLifecycleProps = (stage: string) => {
        switch (stage) {
            case 'Discovery': return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: <Compass className="h-4 w-4" /> }
            case 'Onboarding': return { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Wind className="h-4 w-4" /> }
            case 'Adoption': return { color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: <Zap className="h-4 w-4" /> }
            case 'Value Realization': return { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <HeartHandshake className="h-4 w-4" /> }
            case 'Advocacy': return { color: 'bg-violet-50 text-violet-600 border-violet-100', icon: <Award className="h-4 w-4" /> }
            default: return { color: 'bg-slate-50 text-slate-600 border-slate-100', icon: <Flag className="h-4 w-4" /> }
        }
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Customer <span className="text-indigo-600">Journey Map</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        End-to-end lifecycle orchestration from initial discovery to brand advocacy.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { setEditingStage(null); setFormData({ account: '', lifecycle: 'Discovery', duration: '0 months', nextMilestone: '', lastTouchpoint: 'Just now' }) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-indigo-600/20 gap-2">
                            <Plus className="h-5 w-5" /> Log Transition
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingStage ? 'Transition customer' : 'Initialize journey'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Account Portfolio</Label>
                                <Input value={formData.account} onChange={e => setFormData({ ...formData, account: e.target.value })} placeholder="e.g. Globex Corp" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Lifecycle Phase</Label>
                                    <Select value={formData.lifecycle} onValueChange={(v: any) => setFormData({ ...formData, lifecycle: v })}>
                                        <SelectTrigger><SelectValue placeholder="Phase" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Discovery">Discovery</SelectItem>
                                            <SelectItem value="Onboarding">Onboarding</SelectItem>
                                            <SelectItem value="Adoption">Adoption</SelectItem>
                                            <SelectItem value="Value Realization">Value Realization</SelectItem>
                                            <SelectItem value="Advocacy">Advocacy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Duration in System</Label>
                                    <Input value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 1.2 years" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Next Critical Milestone</Label>
                                <Input value={formData.nextMilestone} onChange={e => setFormData({ ...formData, nextMilestone: e.target.value })} placeholder="e.g. Executive Business Review" />
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" /> Save Roadmap
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Total Accounts" value={metrics.total} subValue="Journey Participants" icon={Map} color="blue" />
                <MetricBox title="Advocates" value={metrics.advocates} subValue="Net Promoter Potential" icon={Award} color="violet" />
                <MetricBox title="Stabilized" value={metrics.maturing} subValue="Value Realized Phase" icon={HeartHandshake} color="emerald" />
                <MetricBox title="Avg. Lifecycle" value={metrics.avgAge} subValue="Customer Tenure" icon={ChevronRight} color="indigo" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden text-sm font-outfit">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">Client Lifecycle Matrix</h2>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search by client..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[12px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                        <th className="px-6 py-4">Account Portfolio</th>
                                        <th className="px-6 py-4">Current Phase</th>
                                        <th className="px-6 py-4">Tenure</th>
                                        <th className="px-6 py-4">Next Milestone</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredRoadmap.map((item) => {
                                        const props = getLifecycleProps(item.lifecycle)
                                        return (
                                            <tr key={item.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50/50">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                                                            <Building2 className="h-5 w-5 text-indigo-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800 font-outfit">{item.account}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 font-outfit mt-0.5">Last Sync: {item.lastTouchpoint}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold font-outfit border whitespace-nowrap shadow-sm",
                                                        props.color
                                                    )}>
                                                        {props.icon}
                                                        {item.lifecycle}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-[11px] font-bold text-slate-900 font-outfit italic">{item.duration}</td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <ArrowRight className="h-3 w-3 text-slate-300" />
                                                        <span className="text-[11px] font-bold text-slate-500 font-outfit">{item.nextMilestone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-indigo-600 transition-colors">
                                                                <MoreVertical className="h-5 w-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 font-outfit rounded-xl">
                                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => {
                                                                setEditingStage(item)
                                                                setFormData(item)
                                                                setIsDialogOpen(true)
                                                            }}>
                                                                <PencilLine className="h-4 w-4" /> Move to Phase
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                                <Lightbulb className="h-4 w-4" /> Success Playbook
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer border-t mt-1" onClick={() => handleDelete(item.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remove Tracking
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
                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 h-16 w-16 bg-slate-50 rounded-bl-full -z-0" />
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit mb-6 relative z-10">Lifecycle Funnel</h3>
                        <div className="space-y-5 relative z-10">
                            {[
                                { stage: 'Discovery', count: 4, color: 'bg-slate-400', progress: 100 },
                                { stage: 'Onboarding', count: 6, color: 'bg-blue-500', progress: 85 },
                                { stage: 'Adoption', count: 12, color: 'bg-indigo-500', progress: 65 },
                                { stage: 'Value Realization', count: 18, color: 'bg-emerald-500', progress: 45 },
                                { stage: 'Advocacy', count: 8, color: 'bg-violet-500', progress: 25 },
                            ].map((f, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between items-center text-[10px] font-bold font-outfit">
                                        <span className="text-slate-600">{f.stage}</span>
                                        <span className="text-slate-900">{f.count}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full opacity-80", f.color)} style={{ width: `${f.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-violet-100 bg-violet-50/10 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-violet-600">
                            <Plus className="h-4 w-4" />
                            <h3 className="text-xs font-bold tracking-wider font-outfit">Advocacy Candidates</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white border border-violet-100 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <p className="text-sm font-bold text-slate-800 font-outfit">DataScale Inc</p>
                                <p className="text-[11px] font-medium text-slate-500 font-outfit">Met all success milestones. High NPS (9/10).</p>
                                <Button className="w-full mt-3 py-4 bg-violet-600 text-white rounded-lg text-[10px] font-bold">
                                    Invite to Advisory Board
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Phase Velocity</h3>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Avg. Onboarding', value: '28d', icon: <Wind className="h-3 w-3 text-blue-500" /> },
                                { name: 'Trial to Value', value: '42d', icon: <HeartHandshake className="h-3 w-3 text-emerald-500" /> },
                                { name: 'Value to Advocacy', value: '180d', icon: <Award className="h-3 w-3 text-violet-500" /> },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2">
                                        {stat.icon}
                                        <span className="text-[12px] font-bold text-slate-500 font-outfit">{stat.name}</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-900 font-outfit">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
