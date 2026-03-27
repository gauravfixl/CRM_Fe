"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Share2,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    GitBranch,
    ShieldCheck,
    Database,
    Zap,
    ExternalLink,
    Settings2,
    AlertCircle,
    ArrowRight,
    MousePointer2,
    Globe,
    Linkedin,
    Facebook,
    Mail,
    Phone,
    UserPlus,
    LayoutGrid,
    MoreHorizontal,
    CheckCircle2
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
import { Switch } from "@/shared/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

// --- Mock Data: Sources ---
const SOURCES_LIST = [
    {
        id: "1",
        name: "Meta Ads (Facebook/IG)",
        category: "Paid Social",
        icon: Facebook,
        color: "text-blue-600",
        bg: "bg-blue-50",
        totalLeads: 1420,
        duplicatesDetected: "4.2%",
        qualityScore: 68,
        status: "Active",
        mappingRules: 3
    },
    {
        id: "2",
        name: "LinkedIn Ads",
        category: "Paid Social",
        icon: Linkedin,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        totalLeads: 840,
        duplicatesDetected: "1.8%",
        qualityScore: 82,
        status: "Active",
        mappingRules: 5
    },
    {
        id: "3",
        name: "Website Organic",
        category: "Owned Media",
        icon: Globe,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        totalLeads: 2100,
        duplicatesDetected: "0.5%",
        qualityScore: 91,
        status: "Active",
        mappingRules: 2
    },
    {
        id: "4",
        name: "Cold Outbound",
        category: "Direct Sales",
        icon: Mail,
        color: "text-slate-600",
        bg: "bg-slate-50",
        totalLeads: 560,
        duplicatesDetected: "12.4%",
        qualityScore: 35,
        status: "Active",
        mappingRules: 8
    },
    {
        id: "5",
        name: "Partner Referrals",
        category: "Referral",
        icon: UserPlus,
        color: "text-amber-600",
        bg: "bg-amber-50",
        totalLeads: 124,
        duplicatesDetected: "0.2%",
        qualityScore: 98,
        status: "Active",
        mappingRules: 1
    },
]

export default function SourcesMasterPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [sources, setSources] = useState(SOURCES_LIST)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [newSource, setNewSource] = useState({ name: "", category: "Paid Social" })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleCreateSource = () => {
        if (!newSource.name) {
            toast({ title: "Incomplete Data", description: "Source nomenclature must be provided.", variant: "destructive" })
            return
        }
        setSources([...sources, {
            ...newSource,
            id: Math.random().toString(36).substr(2, 9),
            icon: Globe,
            color: "text-slate-600",
            bg: "bg-slate-50",
            totalLeads: 0,
            duplicatesDetected: "0%",
            qualityScore: 100,
            status: "Active",
            mappingRules: 0
        }])
        toast({ title: "Source Provisioned", description: "New master source node established." })
        setIsAddOpen(false)
        setNewSource({ name: "", category: "Paid Social" })
    }

    const handleDelete = (id: string) => {
        setSources(sources.filter(s => s.id !== id))
        toast({ title: "Source Deprecated", description: "Master source suspended from mapping." })
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
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <Share2 className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Source Management & Mapping
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Normalize incoming data to avoid messy sources. Standardize 'fb', 'facebook', and 'meta' into a single clean 'Meta Ads' entity.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Opening global rule matrix mapping..." })} className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Database className="h-4 w-4 mr-2 text-slate-400" /> Source Mapping Rules
                    </Button>
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                                <Plus className="h-4 w-4 mr-2" /> Define New Source
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-3xl p-6">
                            <DialogHeader>
                                <DialogTitle>Establish Master Source</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Master Entity Name</Label>
                                    <Input value={newSource.name} onChange={e => setNewSource({ ...newSource, name: e.target.value })} placeholder="e.g., TikTok Ads" className="h-11 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[12px] font-semibold">Broad Domain Category</Label>
                                    <Select value={newSource.category} onValueChange={v => setNewSource({ ...newSource, category: v })}>
                                        <SelectTrigger className="h-11 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Paid Social">Paid Social Platform</SelectItem>
                                            <SelectItem value="Owned Media">Owned Properties</SelectItem>
                                            <SelectItem value="Direct Sales">Outbound Fleet</SelectItem>
                                            <SelectItem value="Referral">Partner / Channel</SelectItem>
                                            <SelectItem value="Events">Field & Virtual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button className="h-11 w-full bg-indigo-600 font-semibold rounded-xl" onClick={handleCreateSource}>Establish Root Source</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Standardization Tools Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Governance & Hygiene</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                Automation rules that clean incoming traffic sources before they enter the CRM database.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <div className="space-y-5">
                                {[
                                    { label: "Auto-Normalize Case", desc: "Convert 'LINKEDIN' to 'LinkedIn'", active: true },
                                    { label: "Reject Unknown UTMs", desc: "Flag sources not in master list", active: false },
                                    { label: "Partner ID Validation", desc: "Force valid ID for referral traffic", active: true },
                                ].map((rule, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="space-y-0.5 max-w-[200px]">
                                            <p className="text-[13px] font-semibold text-slate-800">{rule.label}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{rule.desc}</p>
                                        </div>
                                        <Switch checked={rule.active} className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-amber-50 text-amber-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 text-amber-500 transition-transform group-hover:scale-110">
                            <GitBranch size={120} />
                        </div>
                        <h4 className="text-[15px] font-semibold relative z-10">Source-Sub-Source Map</h4>
                        <p className="text-[12px] text-amber-700 font-medium leading-relaxed relative z-10">
                            Create hierarchical structures like <strong>Paid → Meta → Lead Ads</strong> for granular reporting.
                        </p>
                        <Button onClick={() => toast({ description: "Opening advanced nested routing grid." })} className="w-full h-9 bg-white text-amber-600 hover:bg-slate-50 font-semibold text-[10px] uppercase tracking-widest rounded-xl border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-10">
                            Configure Hierarchy
                        </Button>
                    </Card>

                    <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-white text-rose-600 border border-rose-200 shadow-sm">
                            <AlertCircle size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-rose-900">Unmapped Traffic Alert</p>
                            <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
                                42 leads detected with source <strong>"fb_ads_test"</strong>. No mapping rule found.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sources Master Inventory */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[16px] font-semibold text-slate-900">Source Master Library</h2>
                        <div className="flex items-center gap-4">
                            <Search className="h-4 w-4 text-slate-300" />
                            <Filter className="h-4 w-4 text-slate-300" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {sources.map((source) => (
                            <Card key={source.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-2xl group hover:ring-indigo-100 transition-all bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            {/* Info Section */}
                                            <div className="flex items-center gap-4 min-w-[280px]">
                                                <div className={`p-4 rounded-xl ${source.bg} ${source.color} transition-colors`}>
                                                    <source.icon size={24} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-[15px] font-semibold text-slate-900">{source.name}</h3>
                                                        <Badge variant="outline" className="border-slate-100 text-[8px] font-semibold tracking-wider text-slate-500 px-1.5 h-4.5 rounded uppercase leading-none">{source.category}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><Zap size={10} /> {source.mappingRules} mapping rules</span>
                                                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight italic flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500" /> Validated</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats Section */}
                                            <div className="grid grid-cols-2 gap-8 min-w-[220px]">
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">Lead Volume</p>
                                                    <h4 className="text-[16px] font-semibold tabular-nums text-slate-900">{source.totalLeads.toLocaleString()}</h4>
                                                </div>
                                                <div className="space-y-0.5 text-right md:text-left">
                                                    <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">Quality Index</p>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className={`text-[16px] font-semibold tabular-nums ${source.qualityScore > 80 ? 'text-emerald-600' : 'text-amber-500'}`}>{source.qualityScore}%</h4>
                                                        <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                                            <div className={`h-full ${source.qualityScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${source.qualityScore}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-6 min-w-[150px] justify-end">
                                                <div className="text-right flex flex-col items-end gap-1">
                                                    <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase leading-none">Standardized</p>
                                                    <Badge variant="outline" className="border-emerald-100 text-emerald-600 bg-emerald-50/20 text-[10px] font-semibold h-6 px-2">LOCKED</Badge>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-xl">
                                                            <MoreHorizontal size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 p-1 rounded-xl shadow-xl border-slate-100">
                                                        <DropdownMenuItem onClick={() => toast({ description: "Ingress rule editor active." })} className="py-2.5 text-[12px] font-medium"><Settings2 size={14} className="mr-2" /> Mapping Rules</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ description: "Opening global weight parameters." })} className="py-2.5 text-[12px] font-medium"><ExternalLink size={14} className="mr-2" /> Attribution Logic</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(source.id)} className="py-2.5 text-[12px] font-semibold text-rose-500"><AlertCircle size={14} className="mr-2" /> Deactivate</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Quality Insights Bottom Bar */}
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-indigo-600 shadow-sm">
                                <LayoutGrid size={24} />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-[14px] font-semibold text-slate-900">Standardization Intelligence</h4>
                                <p className="text-[11px] text-slate-500 font-medium leading-tight">Last 30 days: 124 variant sources merged into 5 master sources.</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => toast({ description: "Parsing global data stream events." })} className="bg-white border-slate-200 text-slate-900 font-semibold text-[11px] uppercase tracking-widest h-10 px-6 rounded-xl shadow-sm hover:bg-slate-50">View Mapping History</Button>
                    </div>
                </div>

            </div>

        </div>
    )
}
