"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Megaphone,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Calendar,
    Target,
    Activity,
    Users,
    ArrowUpRight,
    MoreHorizontal,
    Trash2,
    Settings2,
    Copy,
    Pause,
    Play,
    CheckCircle2,
    Clock,
    Tag,
    BarChart3
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"

// --- Mock Data: Campaigns ---
const CAMPAIGNS = [
    {
        id: "1",
        name: "Q1 Global Enterprise Outreach",
        status: "Active",
        type: "Paid Search",
        leads: 1240,
        qualified: 420,
        conversion: 18.5,
        avgScore: 72,
        owner: "Sarah Jenkins",
        startDate: "Jan 12, 2026",
        endDate: "Mar 30, 2026",
        budget: "$45,000",
        color: "bg-indigo-500"
    },
    {
        id: "2",
        name: "Webinar: Future of Lead Ops",
        status: "Paused",
        type: "Events",
        leads: 850,
        qualified: 120,
        conversion: 14.1,
        avgScore: 65,
        owner: "Michael Chen",
        startDate: "Feb 05, 2026",
        endDate: "Feb 20, 2026",
        budget: "$12,000",
        color: "bg-pink-500"
    },
    {
        id: "3",
        name: "LinkedIn Retention - APAC",
        status: "Active",
        type: "Paid Social",
        leads: 450,
        qualified: 85,
        conversion: 22.4,
        avgScore: 81,
        owner: "James Wilson",
        startDate: "Jan 20, 2026",
        endDate: "Apr 15, 2026",
        budget: "$25,000",
        color: "bg-cyan-500"
    },
    {
        id: "4",
        name: "Cold Outreach: FinTech Vertical",
        status: "Completed",
        type: "Outbound",
        leads: 2100,
        qualified: 140,
        conversion: 6.8,
        avgScore: 42,
        owner: "Emily Blunt",
        startDate: "Nov 01, 2025",
        endDate: "Dec 31, 2025",
        budget: "$8,500",
        color: "bg-slate-400"
    },
]

export default function CampaignsListPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [campaignsList, setCampaignsList] = useState(CAMPAIGNS)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newCampaign, setNewCampaign] = useState({ name: "", type: "Events", budget: "" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleCreateCampaign = () => {
        if (!newCampaign.name || !newCampaign.budget) {
            toast({ title: "Validation Error", description: "Campaign name and budget allocations are necessary.", variant: "destructive" })
            return
        }

        setCampaignsList([...campaignsList, {
            ...newCampaign,
            id: Math.random().toString(36).substr(2, 9),
            status: "Planned",
            leads: 0,
            qualified: 0,
            conversion: 0,
            avgScore: 0,
            owner: "Agent Antigravity",
            startDate: "TBD",
            endDate: "TBD",
            color: "bg-slate-400"
        }])
        toast({ title: "Campaign Scheduled", description: "The new macro container has been provisioned." })
        setIsAddOpen(false)
        setNewCampaign({ name: "", type: "Events", budget: "" })
    }

    const handleDelete = (id: string) => {
        setCampaignsList(campaignsList.filter(c => c.id !== id))
        toast({ title: "Campaign Archived", description: "Macro campaign correctly removed from active view." })
    }

    const toggleStatus = (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'Active' ? 'Paused' : currentStatus === 'Paused' ? 'Active' : 'Active'
        setCampaignsList(campaignsList.map(c => c.id === id ? { ...c, status: nextStatus } : c))
        toast({ description: `Campaign state transitioned to ${nextStatus}.` })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-pink-50 text-pink-600 border border-pink-100 shadow-sm">
                                <Megaphone className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Marketing Campaigns
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Track and manage your high-level marketing initiatives. Link incoming leads to specific efforts and measure cross-channel impact.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Data visualization interface initializing..." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <BarChart3 className="h-4 w-4 mr-2 text-slate-400" /> Comparison View
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> Create Campaign
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>Establish Macro Campaign</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Initiative Name</Label>
                                    <Input value={newCampaign.name} onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })} placeholder="e.g., Q2 Retargeting Push" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Primary Channel Type</Label>
                                    <Select value={newCampaign.type} onValueChange={v => setNewCampaign({ ...newCampaign, type: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Events">Field Events</SelectItem>
                                            <SelectItem value="Paid Search">Paid Search</SelectItem>
                                            <SelectItem value="Paid Social">Paid Social</SelectItem>
                                            <SelectItem value="Outbound">Cold Outbound</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Allocated Budget</Label>
                                    <Input value={newCampaign.budget} onChange={e => setNewCampaign({ ...newCampaign, budget: e.target.value })} placeholder="e.g., $15,000" className="h-11 rounded-xl" />
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleCreateCampaign}>Provision Campaign</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Campaign Inventory Area */}
                <div className="lg:col-span-12 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-6">
                            <h2 className="text-[16px] font-semibold text-slate-900">Active & Planned Campaigns</h2>
                            <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> {campaignsList.filter(c => c.status === 'Active').length} Active</span>
                                <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /> {campaignsList.filter(c => c.status === 'Paused').length} Paused</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-slate-300 mr-2" />
                            <Button variant="outline" size="sm" className="h-8 border-slate-100 text-[11px] font-semibold uppercase tracking-widest px-4">All Channels</Button>
                            <Button variant="outline" size="sm" className="h-8 border-slate-100 text-[11px] font-semibold uppercase tracking-widest px-4">This Qtr</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {campaignsList.map((campaign) => (
                            <Card key={campaign.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden flex flex-col">
                                <CardContent className="p-6 space-y-6 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className={`h-12 w-12 rounded-2xl ${campaign.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                                            <Target size={24} />
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge className={`
                                                ${campaign.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                                    campaign.status === 'Paused' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-slate-100 text-slate-500'} 
                                                border-none h-5 px-2 text-[9px] font-semibold tracking-wider uppercase
                                            `}>
                                                {campaign.status}
                                            </Badge>
                                            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{campaign.type}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-[17px] font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{campaign.name}</h3>
                                        <div className="flex items-center gap-4 pt-1">
                                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                                                <Calendar size={13} className="text-slate-300" />
                                                <span>{campaign.startDate} - {campaign.endDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1">
                                            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Leads</p>
                                            <div className="flex items-end gap-2">
                                                <h4 className="text-[20px] font-semibold tabular-nums text-slate-900">{campaign.leads.toLocaleString()}</h4>
                                                <span className="text-[10px] font-medium text-emerald-500 mb-1">+{Math.floor(Math.random() * 20)}%</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1">
                                            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">MQL/SQL</p>
                                            <h4 className="text-[20px] font-semibold tabular-nums text-indigo-600">{campaign.qualified}</h4>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                            <span>Conversion Engine</span>
                                            <span className="text-indigo-600">{campaign.conversion}%</span>
                                        </div>
                                        <Progress value={campaign.conversion * 2} className="h-1.5 [&>div]:bg-indigo-500" />
                                    </div>
                                </CardContent>

                                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-indigo-100 border border-white flex items-center justify-center text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                                            {campaign.owner.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-500">{campaign.owner}</span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                                            <Settings2 size={16} />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 p-1 rounded-xl shadow-xl border-slate-100">
                                                <DropdownMenuItem className="py-2 text-[12px] font-medium"><Copy size={14} className="mr-2" /> Duplicate</DropdownMenuItem>
                                                {campaign.status === 'Active' ? (
                                                    <DropdownMenuItem onClick={() => toggleStatus(campaign.id, campaign.status)} className="py-2 text-[12px] font-medium text-amber-600"><Pause size={14} className="mr-2" /> Pause</DropdownMenuItem>
                                                ) : campaign.status === 'Paused' ? (
                                                    <DropdownMenuItem onClick={() => toggleStatus(campaign.id, campaign.status)} className="py-2 text-[12px] font-medium text-emerald-600"><Play size={14} className="mr-2" /> Resume</DropdownMenuItem>
                                                ) : null}
                                                <DropdownMenuItem onClick={() => handleDelete(campaign.id)} className="py-2 text-[12px] font-semibold text-rose-500"><Trash2 size={14} className="mr-2" /> Archive</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {/* Create Card Placeholder */}
                        <div onClick={() => setIsAddOpen(true)} className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 space-y-4 hover:border-indigo-300 hover:bg-slate-50/50 transition-all group cursor-pointer">
                            <div className="p-4 rounded-full bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <Plus size={32} />
                            </div>
                            <div className="text-center">
                                <h4 className="text-[15px] font-semibold text-slate-900">New Macro Campaign</h4>
                                <p className="text-[12px] text-slate-500 font-medium">Define a new marketing container</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Campaign Insights Sidebar / Bottom */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                    {[
                        { label: "Global Lead Volume", val: "4,640", sub: "+12% vs last month", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
                        { label: "Avg Conversion Rate", val: "14.2%", sub: "Top performing: Paid Search", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Total Budget Paced", val: "$90.5k", sub: "Under budget by 4.2%", icon: Target, color: "text-pink-600", bg: "bg-pink-50" },
                        { label: "Marketing ROI", val: "4.8x", sub: "Predicted: 5.2x", icon: ArrowUpRight, color: "text-cyan-600", bg: "bg-cyan-50" },
                    ].map((m, i) => (
                        <Card key={i} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl bg-white p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-xl ${m.bg} ${m.color}`}>
                                    <m.icon size={18} />
                                </div>
                                <ArrowUpRight size={14} className="text-slate-300" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">{m.label}</p>
                                <h4 className="text-[20px] font-semibold tabular-nums text-slate-900">{m.val}</h4>
                                <p className="text-[11px] text-slate-500 font-medium">{m.sub}</p>
                            </div>
                        </Card>
                    ))}
                </div>

            </div>

        </div>
    )
}
