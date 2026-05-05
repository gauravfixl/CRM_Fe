"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    Rocket,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    Building2,
    Play,
    Timer,
    ClipboardCheck,
    Users,
    ChevronRight,
    ArrowRight
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
interface OnboardingProject {
    id: number;
    account: string;
    stage: 'Kickoff' | 'Technical Setup' | 'Training' | 'UAT' | 'Go Live';
    progress: number;
    owner: string;
    startDate: string;
    targetDate: string;
}

const initialProjects: OnboardingProject[] = [
    { id: 1, account: "Global Dynamics", stage: "UAT", progress: 78, owner: "Sarah J.", startDate: "2024-09-12", targetDate: "2024-10-30" },
    { id: 2, account: "DataScale Inc", stage: "Training", progress: 60, owner: "Mike W.", startDate: "2024-09-25", targetDate: "2024-11-15" },
    { id: 3, account: "Innova Hub", stage: "Technical Setup", progress: 35, owner: "Sarah J.", startDate: "2024-10-05", targetDate: "2024-12-05" },
    { id: 4, account: "Swift Apps", stage: "Kickoff", progress: 12, owner: "Emily R.", startDate: "2024-10-18", targetDate: "2024-11-28" },
    { id: 5, account: "Horizon Media", stage: "Go Live", progress: 95, owner: "Mike W.", startDate: "2024-08-30", targetDate: "2024-10-25" },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue }: any) => {
    const colorClasses: any = {
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        orange: "from-orange-50 to-orange-100/50 border-orange-200/50 text-orange-600",
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
        rose: "from-rose-50 to-rose-100/50 border-rose-200/50 text-rose-600",
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

export default function OnboardingPage() {
    const [projects, setProjects] = useState<OnboardingProject[]>(initialProjects)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<OnboardingProject | null>(null)
    const { toast } = useToast()

    const [formData, setFormData] = useState<Partial<OnboardingProject>>({
        account: '',
        stage: 'Kickoff',
        owner: '',
        progress: 0,
        startDate: new Date().toISOString().split('T')[0],
        targetDate: ''
    })

    const filteredProjects = useMemo(() => {
        return projects.filter(p =>
            p.account.toLowerCase().includes(search.toLowerCase()) ||
            p.owner.toLowerCase().includes(search.toLowerCase())
        )
    }, [projects, search])

    const metrics = useMemo(() => {
        const total = projects.length
        const avgProgress = (projects.reduce((sum, p) => sum + p.progress, 0) / total).toFixed(0)
        const activeNum = projects.filter(p => p.progress < 100).length

        return { total, avgProgress: `${avgProgress}%`, activeNum, delayed: 2 }
    }, [projects])

    const handleDelete = (id: number) => {
        setProjects(prev => prev.filter(p => p.id !== id))
        toast({ title: "Project Deleted", description: "Onboarding project removed." })
    }

    const handleSave = () => {
        if (!formData.account || !formData.owner) return

        if (editingProject) {
            setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...formData } as OnboardingProject : p))
            toast({ title: "Project Updated", description: "Onboarding progress refreshed." })
        } else {
            const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1
            setProjects(prev => [...prev, { ...formData, id: newId } as OnboardingProject])
            toast({ title: "Project Started", description: "New account onboarding kickoff." })
        }
        setIsDialogOpen(false)
        setEditingProject(null)
        setFormData({ account: '', stage: 'Kickoff', owner: '', progress: 0, startDate: new Date().toISOString().split('T')[0], targetDate: '' })
    }

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'Go Live': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
            case 'UAT': return 'bg-blue-50 text-blue-600 border-blue-100'
            case 'Training': return 'bg-violet-50 text-violet-600 border-violet-100'
            case 'Technical Setup': return 'bg-orange-50 text-orange-600 border-orange-100'
            default: return 'bg-slate-50 text-slate-600 border-slate-100'
        }
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Onboarding <span className="text-orange-600">Stage Tracker</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Monitor initial account activation and technical setup velocity.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { setEditingProject(null); setFormData({ account: '', stage: 'Kickoff', owner: '', progress: 0, startDate: new Date().toISOString().split('T')[0], targetDate: '' }) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-orange-600/20 gap-2">
                            <Plus className="h-5 w-5" /> Start Onboarding
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingProject ? 'Modify activation' : 'Setup Onboarding'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Account Name</Label>
                                <Input value={formData.account} onChange={e => setFormData({ ...formData, account: e.target.value })} placeholder="e.g. Tesla Inc" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Current Stage</Label>
                                    <Select value={formData.stage} onValueChange={(v: any) => setFormData({ ...formData, stage: v })}>
                                        <SelectTrigger><SelectValue placeholder="Stage" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Kickoff">Kickoff</SelectItem>
                                            <SelectItem value="Technical Setup">Technical Setup</SelectItem>
                                            <SelectItem value="Training">Training</SelectItem>
                                            <SelectItem value="UAT">UAT</SelectItem>
                                            <SelectItem value="Go Live">Go Live</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Activation Progress (%)</Label>
                                    <Input type="number" value={formData.progress} onChange={e => setFormData({ ...formData, progress: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Activation Lead</Label>
                                    <Input value={formData.owner} onChange={e => setFormData({ ...formData, owner: e.target.value })} placeholder="Lead Name" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Go-Live Target</Label>
                                    <Input type="date" value={formData.targetDate} onChange={e => setFormData({ ...formData, targetDate: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" /> Save Progress
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricBox title="Active Activation" value={metrics.activeNum} subValue="Ongoing Onboarding" icon={Rocket} color="orange" />
                <MetricBox title="Activation Velocity" value={metrics.avgProgress} subValue="Platform Completion" icon={Timer} color="blue" />
                <MetricBox title="Onboarding Queue" value={metrics.total} subValue="Ready to Start" icon={ClipboardCheck} color="emerald" />
                <MetricBox title="Delayed/At Risk" value={metrics.delayed} subValue="Needs Attention" icon={AlertCircle} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden text-sm">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">Implementation Roadmap</h2>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search apps..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[12px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                        <th className="px-6 py-4">Account Portfolio</th>
                                        <th className="px-6 py-4">Stage</th>
                                        <th className="px-6 py-4">Milestone Progress</th>
                                        <th className="px-6 py-4">Lead</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredProjects.map((proj) => (
                                        <tr key={proj.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50/50">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 shadow-sm">
                                                        <Building2 className="h-5 w-5 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 font-outfit">{proj.account}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 font-outfit mt-0.5">Start: {proj.startDate}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[11px] font-bold font-outfit border whitespace-nowrap",
                                                    getStageColor(proj.stage)
                                                )}>
                                                    {proj.stage}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3 w-40">
                                                    <Progress value={proj.progress} className="h-2 bg-slate-100 flex-1" />
                                                    <span className="text-xs font-bold text-slate-900 font-outfit">{proj.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                                                        {proj.owner.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 font-outfit">{proj.owner}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-orange-600 transition-colors">
                                                            <MoreVertical className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 font-outfit rounded-xl">
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => {
                                                            setEditingProject(proj)
                                                            setFormData(proj)
                                                            setIsDialogOpen(true)
                                                        }}>
                                                            <PencilLine className="h-4 w-4" /> Move Stage
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                            <clipboardCheck className="h-4 w-4" /> View Checklist
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer border-t mt-1" onClick={() => handleDelete(proj.id)}>
                                                            <Trash2 className="h-4 w-4" /> Halt Onboarding
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
                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Stage Velocity</h3>
                            <ChevronRight className="h-4 w-4 text-slate-300" />
                        </div>
                        <div className="space-y-5">
                            {[
                                { stage: 'Kickoff to Setup', time: '4.2 days', icon: <Play className="h-3 w-3" /> },
                                { stage: 'Setup to Training', time: '8.5 days', icon: <Users className="h-3 w-3" /> },
                                { stage: 'Training to UAT', time: '12.0 days', icon: <ClipboardCheck className="h-3 w-3" /> },
                                { stage: 'UAT to Go-Live', time: '5.1 days', icon: <Rocket className="h-3 w-3" /> },
                            ].map((v, i) => (
                                <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                            {v.icon}
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-600 font-outfit">{v.stage}</span>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-900 font-outfit">{v.time}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-rose-100 bg-rose-50/10 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <AlertCircle className="h-4 w-4 text-rose-500" />
                            <h3 className="text-xs font-bold text-rose-600 tracking-wider font-outfit">Critical Path Blocks</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white border border-rose-100 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                                <p className="text-sm font-bold text-slate-800 font-outfit leading-none mb-1">Global Dynamics</p>
                                <p className="text-[11px] font-medium text-slate-500 font-outfit">Missing API Credentials for technical setup</p>
                                <div className="mt-3 flex items-center gap-2 text-rose-600 font-bold text-[10px] font-outfit">
                                    <Clock className="h-3 w-3" /> Delayed 48h
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 h-20 w-20 bg-emerald-50 rounded-bl-full -z-0" />
                        <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit mb-4 relative z-10">Last 24h Activity</h3>
                        <div className="space-y-5 relative z-10">
                            {[
                                { text: 'UAT passed for Horizon Media', icon: <CheckCircle2 className="h-3 w-3 text-emerald-500" /> },
                                { text: 'Kickoff deck sent to Swift Apps', icon: <ArrowRight className="h-3 w-3 text-blue-500" /> },
                                { text: 'Innova technical audit started', icon: <Play className="h-3 w-3 text-orange-500" /> },
                            ].map((act, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                        {act.icon}
                                    </div>
                                    <p className="text-[12px] font-bold text-slate-700 font-outfit">{act.text}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
