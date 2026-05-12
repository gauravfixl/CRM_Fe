"use client"

import React, { useState, useEffect, useMemo } from "react"
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
    Globe,
    Linkedin,
    Facebook,
    Mail,
    UserPlus,
    LayoutGrid,
    MoreHorizontal,
    CheckCircle2,
    X,
    Pencil,
    Trash2
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
import { Switch } from "@/shared/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

interface Source {
    id: string
    name: string
    category: string
    icon: any
    color: string
    bg: string
    totalLeads: number
    duplicatesDetected: string
    qualityScore: number
    status: string
    mappingRules: number
}

const SOURCES_LIST: Source[] = [
    { id: "1", name: "Meta Ads (Facebook/IG)", category: "Paid Social", icon: Facebook, color: "text-blue-600", bg: "bg-blue-50", totalLeads: 1420, duplicatesDetected: "4.2%", qualityScore: 68, status: "Active", mappingRules: 3 },
    { id: "2", name: "LinkedIn Ads", category: "Paid Social", icon: Linkedin, color: "text-indigo-600", bg: "bg-indigo-50", totalLeads: 840, duplicatesDetected: "1.8%", qualityScore: 82, status: "Active", mappingRules: 5 },
    { id: "3", name: "Website Organic", category: "Owned Media", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50", totalLeads: 2100, duplicatesDetected: "0.5%", qualityScore: 91, status: "Active", mappingRules: 2 },
    { id: "4", name: "Cold Outbound", category: "Direct Sales", icon: Mail, color: "text-slate-600", bg: "bg-slate-50", totalLeads: 560, duplicatesDetected: "12.4%", qualityScore: 35, status: "Active", mappingRules: 8 },
    { id: "5", name: "Partner Referrals", category: "Referral", icon: UserPlus, color: "text-amber-600", bg: "bg-amber-50", totalLeads: 124, duplicatesDetected: "0.2%", qualityScore: 98, status: "Active", mappingRules: 1 },
]

const CATEGORIES = ["Paid Social", "Owned Media", "Direct Sales", "Referral", "Events"]

interface FormState {
    name: string
    category: string
    mappingRules: string
}

interface FormErrors {
    name?: string
    category?: string
    mappingRules?: string
}

export default function SourcesMasterPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [sources, setSources] = useState<Source[]>(SOURCES_LIST)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [categoryFilter, setCategoryFilter] = useState("All")
    const [form, setForm] = useState<FormState>({ name: "", category: "Paid Social", mappingRules: "1" })
    const [errors, setErrors] = useState<FormErrors>({})
    const [governanceRules, setGovernanceRules] = useState([
        { label: "Auto-Normalize Case", desc: "Convert 'LINKEDIN' to 'LinkedIn'", active: true },
        { label: "Reject Unknown UTMs", desc: "Flag sources not in master list", active: false },
        { label: "Partner ID Validation", desc: "Force valid ID for referral traffic", active: true },
    ])

    useEffect(() => {
        setIsClient(true)
    }, [])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}
        if (!form.name.trim()) newErrors.name = "Source name is required"
        else if (form.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters"
        else if (form.name.trim().length > 60) newErrors.name = "Name must be under 60 characters"
        else if (sources.some(s => s.name.toLowerCase() === form.name.trim().toLowerCase() && s.id !== editingId)) {
            newErrors.name = "A source with this name already exists"
        }

        if (!form.category) newErrors.category = "Category is required"

        if (!form.mappingRules.trim()) newErrors.mappingRules = "Mapping rules count is required"
        else if (!/^\d+$/.test(form.mappingRules.trim())) newErrors.mappingRules = "Must be a positive whole number"
        else if (parseInt(form.mappingRules) < 0 || parseInt(form.mappingRules) > 99) newErrors.mappingRules = "Must be between 0 and 99"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", category: "Paid Social", mappingRules: "1" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (s: Source) => {
        setEditingId(s.id)
        setForm({ name: s.name, category: s.category, mappingRules: s.mappingRules.toString() })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSubmit = () => {
        if (!validateForm()) {
            toast({ title: "Validation Error", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }

        if (editingId) {
            setSources(sources.map(s => s.id === editingId ? {
                ...s,
                name: form.name.trim(),
                category: form.category,
                mappingRules: parseInt(form.mappingRules)
            } : s))
            toast({ title: "Source Updated", description: "Source details saved." })
        } else {
            const newSource: Source = {
                id: Math.random().toString(36).substring(2, 11),
                name: form.name.trim(),
                category: form.category,
                icon: Globe,
                color: "text-slate-600",
                bg: "bg-slate-50",
                totalLeads: 0,
                duplicatesDetected: "0%",
                qualityScore: 100,
                status: "Active",
                mappingRules: parseInt(form.mappingRules)
            }
            setSources([newSource, ...sources])
            toast({ title: "Source Created", description: "New master source established." })
        }

        setIsFormOpen(false)
        setEditingId(null)
        setForm({ name: "", category: "Paid Social", mappingRules: "1" })
        setErrors({})
    }

    const handleDelete = (id: string) => {
        setSources(sources.filter(s => s.id !== id))
        toast({ title: "Source Deactivated", description: "Master source removed from mapping." })
    }

    const toggleGovernanceRule = (idx: number) => {
        setGovernanceRules(governanceRules.map((r, i) => i === idx ? { ...r, active: !r.active } : r))
    }

    const filteredSources = useMemo(() => {
        return sources.filter(s => {
            const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = categoryFilter === "All" || s.category === categoryFilter
            return matchesSearch && matchesCategory
        })
    }, [sources, searchQuery, categoryFilter])

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header - light colorful */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-gradient-to-br from-indigo-50 via-cyan-50 to-emerald-50 p-6 rounded-none border border-indigo-100 shadow-sm">
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
                            <div className="p-2 rounded-none bg-indigo-100 text-indigo-600 border border-indigo-200 shadow-sm">
                                <Share2 className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Source Management & Mapping
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Normalize incoming data to avoid messy sources. Standardize 'fb', 'facebook', and 'meta' into a single clean 'Meta Ads' entity.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Opening source mapping rules editor..." })} className="h-10 rounded-none border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Database className="h-4 w-4 mr-2 text-slate-400" /> Source Mapping Rules
                    </Button>
                    <Button onClick={openCreate} className="h-10 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> Define New Source
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Standardization Tools Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="p-3 rounded-none bg-indigo-50 text-indigo-600 w-fit">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Governance & Hygiene</h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                Automation rules that clean incoming traffic sources before they enter the CRM database.
                            </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <div className="space-y-5">
                                {governanceRules.map((rule, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="space-y-0.5 max-w-[200px]">
                                            <p className="text-[13px] font-semibold text-slate-800">{rule.label}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{rule.desc}</p>
                                        </div>
                                        <Switch checked={rule.active} onCheckedChange={() => toggleGovernanceRule(i)} className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-amber-50 text-amber-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 text-amber-500 transition-transform group-hover:scale-110">
                            <GitBranch size={120} />
                        </div>
                        <h4 className="text-[15px] font-semibold relative z-10">Source-Sub-Source Map</h4>
                        <p className="text-[12px] text-amber-700 font-medium leading-relaxed relative z-10">
                            Create hierarchical structures like <strong>Paid → Meta → Lead Ads</strong> for granular reporting.
                        </p>
                        <Button onClick={() => toast({ description: "Opening hierarchy configuration." })} className="w-full h-9 rounded-none bg-white text-amber-600 hover:bg-slate-50 font-semibold text-[10px] uppercase tracking-widest border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-10">
                            Configure Hierarchy
                        </Button>
                    </Card>

                    <div className="p-5 rounded-none bg-rose-50 border border-rose-100 flex items-start gap-4">
                        <div className="p-2 rounded-none bg-white text-rose-600 border border-rose-200 shadow-sm">
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
                    <div className="flex items-center justify-between px-2 gap-3 flex-wrap">
                        <h2 className="text-[16px] font-semibold text-slate-900">Source Master Library</h2>
                        <div className="flex items-center gap-3">
                            {showSearch ? (
                                <div className="flex items-center bg-white border border-slate-200 rounded-none px-2 h-8">
                                    <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
                                    <Input
                                        autoFocus
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search sources..."
                                        className="border-none h-6 px-0 text-[12px] focus-visible:ring-0 w-40"
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
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-8 rounded-none border-slate-200 text-[11px] font-semibold uppercase tracking-widest px-3 w-auto gap-2">
                                    <Filter className="h-3 w-3 mr-1" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="All">All Categories</SelectItem>
                                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredSources.map((source) => (
                            <Card key={source.id} className="border-none shadow-sm ring-1 ring-slate-100 rounded-none group hover:ring-indigo-200 transition-all bg-white overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-4 min-w-[280px]">
                                                <div className={`p-4 rounded-none ${source.bg} ${source.color} transition-colors`}>
                                                    <source.icon size={24} />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-[15px] font-semibold text-slate-900">{source.name}</h3>
                                                        <Badge variant="outline" className="border-slate-200 text-[8px] font-semibold tracking-wider text-slate-500 px-1.5 h-4.5 rounded-none uppercase leading-none">{source.category}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1"><Zap size={10} /> {source.mappingRules} mapping rules</span>
                                                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight italic flex items-center gap-1"><CheckCircle2 size={10} className="text-emerald-500" /> Validated</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8 min-w-[220px]">
                                                <div className="space-y-0.5">
                                                    <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">Lead Volume</p>
                                                    <h4 className="text-[16px] font-semibold tabular-nums text-slate-900">{source.totalLeads.toLocaleString()}</h4>
                                                </div>
                                                <div className="space-y-0.5 text-right md:text-left">
                                                    <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">Quality Index</p>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className={`text-[16px] font-semibold tabular-nums ${source.qualityScore > 80 ? 'text-emerald-600' : 'text-amber-500'}`}>{source.qualityScore}%</h4>
                                                        <div className="h-1.5 w-12 bg-slate-100 rounded-none overflow-hidden hidden sm:block">
                                                            <div className={`h-full ${source.qualityScore > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${source.qualityScore}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 min-w-[150px] justify-end">
                                                <div className="text-right flex flex-col items-end gap-1">
                                                    <p className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase leading-none">Standardized</p>
                                                    <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50/40 text-[10px] font-semibold h-6 px-2 rounded-none">LOCKED</Badge>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-none" onClick={() => openEdit(source)}>
                                                    <Pencil size={15} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-900 rounded-none">
                                                            <MoreHorizontal size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 p-1 rounded-none shadow-xl border-slate-100">
                                                        <DropdownMenuItem onClick={() => openEdit(source)} className="py-2.5 text-[12px] font-medium"><Pencil size={14} className="mr-2" /> Edit Source</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ description: "Mapping rule editor opened." })} className="py-2.5 text-[12px] font-medium"><Settings2 size={14} className="mr-2" /> Mapping Rules</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ description: "Attribution logic editor opened." })} className="py-2.5 text-[12px] font-medium"><ExternalLink size={14} className="mr-2" /> Attribution Logic</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDelete(source.id)} className="py-2.5 text-[12px] font-semibold text-rose-500"><Trash2 size={14} className="mr-2" /> Deactivate</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredSources.length === 0 && (
                            <div className="p-12 text-center text-slate-400 text-[13px] font-medium border-2 border-dashed border-slate-200 rounded-none">
                                No sources match your filters.
                            </div>
                        )}
                    </div>

                    {/* Quality Insights Bottom Bar */}
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-none mt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-none bg-white border border-slate-200 text-indigo-600 shadow-sm">
                                <LayoutGrid size={24} />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-[14px] font-semibold text-slate-900">Standardization Intelligence</h4>
                                <p className="text-[11px] text-slate-500 font-medium leading-tight">Last 30 days: 124 variant sources merged into 5 master sources.</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={() => toast({ description: "Opening mapping history log..." })} className="bg-white border-slate-200 text-slate-900 font-semibold text-[11px] uppercase tracking-widest h-10 px-6 rounded-none shadow-sm hover:bg-slate-50">View Mapping History</Button>
                    </div>
                </div>

            </div>

            {/* Slide-from-Right Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold tracking-tight text-slate-900">
                            {editingId ? "Edit Source" : "Define New Master Source"}
                        </SheetTitle>
                        <p className="text-[12px] text-slate-500 font-medium">
                            {editingId ? "Update the source details and category." : "Add a new master source for standardization."}
                        </p>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Source Name <span className="text-rose-500">*</span></Label>
                            <Input
                                name="name"
                                value={form.name}
                                onChange={e => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }) }}
                                placeholder="e.g., TikTok Ads"
                                className={`h-11 rounded-none ${errors.name ? "border-rose-500" : ""}`}
                            />
                            {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Category <span className="text-rose-500">*</span></Label>
                            <Select value={form.category} onValueChange={v => { setForm({ ...form, category: v }); if (errors.category) setErrors({ ...errors, category: undefined }) }}>
                                <SelectTrigger className={`h-11 rounded-none ${errors.category ? "border-rose-500" : ""}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-[11px] text-rose-500 font-medium">{errors.category}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Initial Mapping Rules Count <span className="text-rose-500">*</span></Label>
                            <Input
                                name="mappingRules"
                                type="number"
                                min={0}
                                max={99}
                                value={form.mappingRules}
                                onChange={e => { setForm({ ...form, mappingRules: e.target.value }); if (errors.mappingRules) setErrors({ ...errors, mappingRules: undefined }) }}
                                placeholder="e.g., 3"
                                className={`h-11 rounded-none ${errors.mappingRules ? "border-rose-500" : ""}`}
                            />
                            {errors.mappingRules && <p className="text-[11px] text-rose-500 font-medium">{errors.mappingRules}</p>}
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-none" onClick={handleSubmit}>
                            {editingId ? "Save Changes" : "Create Source"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
