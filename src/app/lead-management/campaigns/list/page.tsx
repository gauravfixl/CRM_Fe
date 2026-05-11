"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Megaphone,
    Plus,
    Search,
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
    BarChart3,
    X,
    Pencil,
    Filter
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet"
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

interface Campaign {
    id: string
    name: string
    status: string
    type: string
    leads: number
    qualified: number
    conversion: number
    avgScore: number
    owner: string
    startDate: string
    endDate: string
    budget: string
    color: string
}

const CAMPAIGNS: Campaign[] = [
    { id: "1", name: "Q1 Global Enterprise Outreach", status: "Active", type: "Paid Search", leads: 1240, qualified: 420, conversion: 18.5, avgScore: 72, owner: "Sarah Jenkins", startDate: "Jan 12, 2026", endDate: "Mar 30, 2026", budget: "$45,000", color: "bg-indigo-500" },
    { id: "2", name: "Webinar: Future of Lead Ops", status: "Paused", type: "Events", leads: 850, qualified: 120, conversion: 14.1, avgScore: 65, owner: "Michael Chen", startDate: "Feb 05, 2026", endDate: "Feb 20, 2026", budget: "$12,000", color: "bg-pink-500" },
    { id: "3", name: "LinkedIn Retention - APAC", status: "Active", type: "Paid Social", leads: 450, qualified: 85, conversion: 22.4, avgScore: 81, owner: "James Wilson", startDate: "Jan 20, 2026", endDate: "Apr 15, 2026", budget: "$25,000", color: "bg-cyan-500" },
    { id: "4", name: "Cold Outreach: FinTech Vertical", status: "Completed", type: "Outbound", leads: 2100, qualified: 140, conversion: 6.8, avgScore: 42, owner: "Emily Blunt", startDate: "Nov 01, 2025", endDate: "Dec 31, 2025", budget: "$8,500", color: "bg-slate-400" },
]

interface FormState {
    name: string
    type: string
    budget: string
    owner: string
    startDate: string
    endDate: string
}

interface FormErrors {
    name?: string
    type?: string
    budget?: string
    owner?: string
    startDate?: string
    endDate?: string
}

const CHANNEL_TYPES = ["Events", "Paid Search", "Paid Social", "Outbound"]
const COLOR_PALETTE = ["bg-indigo-500", "bg-pink-500", "bg-cyan-500", "bg-amber-500", "bg-emerald-500", "bg-rose-500"]
const QUARTERS = ["This Qtr", "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026", "All Time"]

export default function CampaignsListPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [campaignsList, setCampaignsList] = useState<Campaign[]>(CAMPAIGNS)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [channelFilter, setChannelFilter] = useState("All Channels")
    const [qtrFilter, setQtrFilter] = useState("This Qtr")
    const [form, setForm] = useState<FormState>({ name: "", type: "Events", budget: "", owner: "", startDate: "", endDate: "" })
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}
        if (!form.name.trim()) newErrors.name = "Campaign name is required"
        else if (form.name.trim().length < 3) newErrors.name = "Name must be at least 3 characters"
        else if (form.name.trim().length > 80) newErrors.name = "Name must be under 80 characters"

        if (!form.type) newErrors.type = "Channel type is required"

        if (!form.budget.trim()) newErrors.budget = "Budget is required"
        else if (!/^\$?[\d,]+(\.\d{1,2})?$/.test(form.budget.trim())) newErrors.budget = "Enter a valid amount (e.g., $15,000)"

        if (!form.owner.trim()) newErrors.owner = "Owner name is required"
        else if (!/^[a-zA-Z\s.'-]{2,50}$/.test(form.owner.trim())) newErrors.owner = "Enter a valid owner name"

        if (!form.startDate) newErrors.startDate = "Start date is required"
        if (!form.endDate) newErrors.endDate = "End date is required"
        if (form.startDate && form.endDate && new Date(form.startDate) > new Date(form.endDate)) {
            newErrors.endDate = "End date must be after start date"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const formatDate = (iso: string): string => {
        if (!iso) return "TBD"
        const d = new Date(iso)
        return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", type: "Events", budget: "", owner: "", startDate: "", endDate: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (c: Campaign) => {
        setEditingId(c.id)
        setForm({
            name: c.name,
            type: c.type,
            budget: c.budget,
            owner: c.owner,
            startDate: "",
            endDate: ""
        })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSubmit = () => {
        if (!validateForm()) {
            toast({ title: "Validation Error", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }

        if (editingId) {
            setCampaignsList(campaignsList.map(c => c.id === editingId ? {
                ...c,
                name: form.name.trim(),
                type: form.type,
                budget: form.budget.trim(),
                owner: form.owner.trim()
            } : c))
            toast({ title: "Campaign Updated", description: "Your changes have been saved." })
        } else {
            const newCampaign: Campaign = {
                id: Math.random().toString(36).substring(2, 11),
                name: form.name.trim(),
                type: form.type,
                budget: form.budget.trim(),
                owner: form.owner.trim(),
                startDate: formatDate(form.startDate),
                endDate: formatDate(form.endDate),
                status: "Planned",
                leads: 0,
                qualified: 0,
                conversion: 0,
                avgScore: 0,
                color: COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]
            }
            setCampaignsList([newCampaign, ...campaignsList])
            toast({ title: "Campaign Created", description: "Your new campaign is now active." })
        }

        setIsFormOpen(false)
        setEditingId(null)
        setForm({ name: "", type: "Events", budget: "", owner: "", startDate: "", endDate: "" })
        setErrors({})
    }

    const handleDelete = (id: string) => {
        setCampaignsList(campaignsList.filter(c => c.id !== id))
        toast({ title: "Campaign Archived", description: "Campaign removed from active view." })
    }

    const handleDuplicate = (c: Campaign) => {
        const dup: Campaign = { ...c, id: Math.random().toString(36).substring(2, 11), name: `${c.name} (Copy)`, status: "Planned" }
        setCampaignsList([dup, ...campaignsList])
        toast({ title: "Campaign Duplicated", description: `Created a copy of "${c.name}".` })
    }

    const toggleStatus = (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'Active' ? 'Paused' : currentStatus === 'Paused' ? 'Active' : 'Active'
        setCampaignsList(campaignsList.map(c => c.id === id ? { ...c, status: nextStatus } : c))
        toast({ description: `Campaign ${nextStatus === 'Active' ? 'resumed' : 'paused'}.` })
    }

    const filteredCampaigns = useMemo(() => {
        return campaignsList.filter(c => {
            const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.owner.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesChannel = channelFilter === "All Channels" || c.type === channelFilter
            return matchesSearch && matchesChannel
        })
    }, [campaignsList, searchQuery, channelFilter])

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header - light colorful */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-gradient-to-br from-pink-50 via-indigo-50 to-cyan-50 p-6 rounded-none border border-pink-100 shadow-sm">
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
                            <div className="p-2 rounded-none bg-pink-100 text-pink-600 border border-pink-200 shadow-sm">
                                <Megaphone className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Marketing Campaigns
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Track and manage your high-level marketing initiatives. Link incoming leads to specific efforts and measure cross-channel impact.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Loading campaign comparison view..." })} className="h-10 rounded-none border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <BarChart3 className="h-4 w-4 mr-2 text-slate-400" /> Comparison View
                    </Button>
                    <Button onClick={openCreate} className="h-10 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> Create Campaign
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Inventory Area */}
                <div className="lg:col-span-12 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between px-2 gap-3">
                        <div className="flex items-center gap-6">
                            <h2 className="text-[16px] font-semibold text-slate-900">Active & Planned Campaigns</h2>
                            <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500" /> {campaignsList.filter(c => c.status === 'Active').length} Active</span>
                                <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-amber-500" /> {campaignsList.filter(c => c.status === 'Paused').length} Paused</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {showSearch ? (
                                <div className="flex items-center bg-white border border-slate-200 rounded-none px-2 h-8">
                                    <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
                                    <Input
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by name or owner..."
                                        className="border-none h-6 px-0 text-[12px] focus-visible:ring-0 w-48"
                                    />
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setShowSearch(false); setSearchQuery("") }}>
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ) : (
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSearch(true)}>
                                    <Search className="h-4 w-4 text-slate-400" />
                                </Button>
                            )}
                            <Select value={channelFilter} onValueChange={setChannelFilter}>
                                <SelectTrigger className="h-8 rounded-none border-slate-200 text-[11px] font-semibold uppercase tracking-widest px-3 w-auto gap-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="All Channels">All Channels</SelectItem>
                                    {CHANNEL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Select value={qtrFilter} onValueChange={setQtrFilter}>
                                <SelectTrigger className="h-8 rounded-none border-slate-200 text-[11px] font-semibold uppercase tracking-widest px-3 w-auto gap-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {QUARTERS.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCampaigns.map((campaign) => (
                            <Card key={campaign.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none group hover:ring-indigo-200 transition-all bg-white overflow-hidden flex flex-col">
                                <CardContent className="p-6 space-y-6 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className={`h-12 w-12 rounded-none ${campaign.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                                            <Target size={24} />
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <Badge className={`
                                                ${campaign.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                                    campaign.status === 'Paused' ? 'bg-amber-50 text-amber-600' :
                                                        campaign.status === 'Planned' ? 'bg-indigo-50 text-indigo-600' :
                                                            'bg-slate-100 text-slate-500'}
                                                border-none h-5 px-2 text-[9px] font-semibold tracking-wider uppercase rounded-none
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
                                        <div className="p-4 rounded-none bg-indigo-50/40 border border-indigo-100/40 space-y-1">
                                            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Leads</p>
                                            <div className="flex items-end gap-2">
                                                <h4 className="text-[20px] font-semibold tabular-nums text-slate-900">{campaign.leads.toLocaleString()}</h4>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-none bg-pink-50/40 border border-pink-100/40 space-y-1">
                                            <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">MQL/SQL</p>
                                            <h4 className="text-[20px] font-semibold tabular-nums text-indigo-600">{campaign.qualified}</h4>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                            <span>Conversion Engine</span>
                                            <span className="text-indigo-600">{campaign.conversion}%</span>
                                        </div>
                                        <Progress value={campaign.conversion * 2} className="h-1.5 rounded-none [&>div]:bg-indigo-500" />
                                    </div>
                                </CardContent>

                                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-indigo-100 border border-white flex items-center justify-center text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                                            {campaign.owner.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-500">{campaign.owner}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => openEdit(campaign)}>
                                            <Settings2 size={16} />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                                    <MoreHorizontal size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40 p-1 rounded-none shadow-xl border-slate-100">
                                                <DropdownMenuItem onClick={() => openEdit(campaign)} className="py-2 text-[12px] font-medium"><Pencil size={14} className="mr-2" /> Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDuplicate(campaign)} className="py-2 text-[12px] font-medium"><Copy size={14} className="mr-2" /> Duplicate</DropdownMenuItem>
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
                        <div onClick={openCreate} className="border-2 border-dashed border-slate-200 rounded-none flex flex-col items-center justify-center p-8 space-y-4 hover:border-indigo-300 hover:bg-slate-50/50 transition-all group cursor-pointer min-h-[280px]">
                            <div className="p-4 rounded-full bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                <Plus size={32} />
                            </div>
                            <div className="text-center">
                                <h4 className="text-[15px] font-semibold text-slate-900">New Campaign</h4>
                                <p className="text-[12px] text-slate-500 font-medium">Define a new marketing initiative</p>
                            </div>
                        </div>

                        {filteredCampaigns.length === 0 && (
                            <div className="col-span-full p-12 text-center text-slate-400 text-[13px] font-medium border-2 border-dashed border-slate-200 rounded-none">
                                No campaigns match your filter criteria.
                            </div>
                        )}
                    </div>
                </div>

                {/* Insights Bottom Cards - light colorful */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
                    {[
                        { label: "Global Lead Volume", val: "4,640", sub: "+12% vs last month", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", cardBg: "bg-indigo-50/60 border-indigo-100" },
                        { label: "Avg Conversion Rate", val: "14.2%", sub: "Top performing: Paid Search", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-100", cardBg: "bg-emerald-50/60 border-emerald-100" },
                        { label: "Total Budget Paced", val: "$90.5k", sub: "Under budget by 4.2%", icon: Target, color: "text-pink-600", bg: "bg-pink-100", cardBg: "bg-pink-50/60 border-pink-100" },
                        { label: "Marketing ROI", val: "4.8x", sub: "Predicted: 5.2x", icon: ArrowUpRight, color: "text-cyan-600", bg: "bg-cyan-100", cardBg: "bg-cyan-50/60 border-cyan-100" },
                    ].map((m, i) => (
                        <Card key={i} className={`border shadow-sm rounded-none ${m.cardBg} p-5 space-y-4`}>
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-none ${m.bg} ${m.color}`}>
                                    <m.icon size={18} />
                                </div>
                                <ArrowUpRight size={14} className="text-slate-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">{m.label}</p>
                                <h4 className="text-[20px] font-semibold tabular-nums text-slate-900">{m.val}</h4>
                                <p className="text-[11px] text-slate-600 font-medium">{m.sub}</p>
                            </div>
                        </Card>
                    ))}
                </div>

            </div>

            {/* Slide-from-Right Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-pink-50">
                        <SheetTitle className="text-[18px] font-semibold tracking-tight text-slate-900">
                            {editingId ? "Edit Campaign" : "Create New Campaign"}
                        </SheetTitle>
                        <p className="text-[12px] text-slate-500 font-medium">
                            {editingId ? "Update the marketing initiative details." : "Define a new marketing initiative for tracking."}
                        </p>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Campaign Name <span className="text-rose-500">*</span></Label>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={e => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }) }}
                                placeholder="e.g., Q2 Retargeting Push"
                                className={`h-11 rounded-none ${errors.name ? "border-rose-500" : ""}`}
                            />
                            {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Channel Type <span className="text-rose-500">*</span></Label>
                            <Select value={form.type} onValueChange={v => { setForm({ ...form, type: v }); if (errors.type) setErrors({ ...errors, type: undefined }) }}>
                                <SelectTrigger className={`h-11 rounded-none ${errors.type ? "border-rose-500" : ""}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {CHANNEL_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-[11px] text-rose-500 font-medium">{errors.type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Allocated Budget <span className="text-rose-500">*</span></Label>
                            <Input
                                name="budget"
                                value={form.budget}
                                onChange={e => { setForm({ ...form, budget: e.target.value }); if (errors.budget) setErrors({ ...errors, budget: undefined }) }}
                                placeholder="e.g., $15,000"
                                className={`h-11 rounded-none ${errors.budget ? "border-rose-500" : ""}`}
                            />
                            {errors.budget && <p className="text-[11px] text-rose-500 font-medium">{errors.budget}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Owner Name <span className="text-rose-500">*</span></Label>
                            <Input
                                name="owner"
                                value={form.owner}
                                onChange={e => { setForm({ ...form, owner: e.target.value }); if (errors.owner) setErrors({ ...errors, owner: undefined }) }}
                                placeholder="e.g., Sarah Jenkins"
                                className={`h-11 rounded-none ${errors.owner ? "border-rose-500" : ""}`}
                            />
                            {errors.owner && <p className="text-[11px] text-rose-500 font-medium">{errors.owner}</p>}
                        </div>

                        {!editingId && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Start Date <span className="text-rose-500">*</span></Label>
                                    <Input
                                        type="date"
                                        name="startDate"
                                        value={form.startDate}
                                        onChange={e => { setForm({ ...form, startDate: e.target.value }); if (errors.startDate) setErrors({ ...errors, startDate: undefined }) }}
                                        className={`h-11 rounded-none ${errors.startDate ? "border-rose-500" : ""}`}
                                    />
                                    {errors.startDate && <p className="text-[11px] text-rose-500 font-medium">{errors.startDate}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">End Date <span className="text-rose-500">*</span></Label>
                                    <Input
                                        type="date"
                                        name="endDate"
                                        value={form.endDate}
                                        onChange={e => { setForm({ ...form, endDate: e.target.value }); if (errors.endDate) setErrors({ ...errors, endDate: undefined }) }}
                                        className={`h-11 rounded-none ${errors.endDate ? "border-rose-500" : ""}`}
                                    />
                                    {errors.endDate && <p className="text-[11px] text-rose-500 font-medium">{errors.endDate}</p>}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-none" onClick={handleSubmit}>
                            {editingId ? "Save Changes" : "Create Campaign"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
