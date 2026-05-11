"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Plus,
    ChevronLeft,
    Link as LinkIcon,
    Database,
    ArrowRight,
    Copy,
    CheckCircle2,
    AlertTriangle,
    Terminal,
    Zap,
    LayoutTemplate,
    Search,
    X,
    Pencil,
    Trash2
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet"
import { Label } from "@/shared/components/ui/label"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"

interface UTMParam {
    id: string
    key: string
    description: string
    mapping: string
    captures: number
}

const INITIAL_UTM_PARAMETERS: UTMParam[] = [
    { id: "1", key: "utm_source", description: "Identifies the source of traffic (e.g. google, linkedin)", mapping: "System Source", captures: 12450 },
    { id: "2", key: "utm_medium", description: "Identifies the medium used (e.g. cpc, email)", mapping: "Lead Channel", captures: 12450 },
    { id: "3", key: "utm_campaign", description: "Identifies the specific campaign name", mapping: "Campaign Name", captures: 11200 },
    { id: "4", key: "utm_content", description: "Used for A/B testing and content-level tracking", mapping: "Internal Reference", captures: 4500 },
    { id: "5", key: "utm_term", description: "Identifies search terms used in paid ads", mapping: "Lead Metadata", captures: 2100 },
]

interface MappingFormState {
    key: string
    description: string
    mapping: string
}

interface MappingFormErrors {
    key?: string
    description?: string
    mapping?: string
}

const MAPPING_OPTIONS = ["System Source", "Lead Channel", "Campaign Name", "Internal Reference", "Lead Metadata", "Custom Tag"]

export default function UTMTrackingPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [utmList, setUtmList] = useState<UTMParam[]>(INITIAL_UTM_PARAMETERS)
    const [utmBuilder, setUtmBuilder] = useState({
        url: "https://example.com/demo",
        source: "google",
        medium: "cpc",
        campaign: "q1_promo"
    })
    const [builderErrors, setBuilderErrors] = useState<{ url?: string; source?: string; campaign?: string }>({})
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<MappingFormState>({ key: "", description: "", mapping: "System Source" })
    const [errors, setErrors] = useState<MappingFormErrors>({})

    useEffect(() => {
        setIsClient(true)
    }, [])

    const validateBuilder = (): boolean => {
        const newErrors: { url?: string; source?: string; campaign?: string } = {}
        if (!utmBuilder.url.trim()) newErrors.url = "URL is required"
        else if (!/^https?:\/\/.+/i.test(utmBuilder.url.trim())) newErrors.url = "Enter a valid http(s) URL"

        if (!utmBuilder.source.trim()) newErrors.source = "Source is required"
        else if (!/^[a-z0-9_-]+$/i.test(utmBuilder.source.trim())) newErrors.source = "Use letters, numbers, _, - only"

        if (!utmBuilder.campaign.trim()) newErrors.campaign = "Campaign name is required"
        else if (!/^[a-z0-9_-]+$/i.test(utmBuilder.campaign.trim())) newErrors.campaign = "Use letters, numbers, _, - only"

        setBuilderErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const generatedLink = useMemo(() => {
        return `${utmBuilder.url}?utm_source=${utmBuilder.source}&utm_medium=${utmBuilder.medium}&utm_campaign=${utmBuilder.campaign}`
    }, [utmBuilder])

    const handleCopy = () => {
        if (!validateBuilder()) {
            toast({ title: "Validation Error", description: "Fix builder fields before copying.", variant: "destructive" })
            return
        }
        navigator.clipboard.writeText(generatedLink)
        toast({ title: "Link Copied", description: "UTM-tagged URL is ready for your campaign." })
    }

    const validateForm = (): boolean => {
        const newErrors: MappingFormErrors = {}
        if (!form.key.trim()) newErrors.key = "Parameter key is required"
        else if (!/^[a-z][a-z0-9_]*$/.test(form.key.trim())) newErrors.key = "Lowercase letters/digits/_; must start with a letter"
        else if (utmList.some(u => u.key === form.key.trim() && u.id !== editingId)) newErrors.key = "This parameter key already exists"

        if (!form.description.trim()) newErrors.description = "Description is required"
        else if (form.description.trim().length < 8) newErrors.description = "Description must be at least 8 characters"
        else if (form.description.trim().length > 140) newErrors.description = "Description must be under 140 characters"

        if (!form.mapping) newErrors.mapping = "Mapping target is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ key: "", description: "", mapping: "System Source" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (u: UTMParam) => {
        setEditingId(u.id)
        setForm({ key: u.key, description: u.description, mapping: u.mapping })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSubmit = () => {
        if (!validateForm()) {
            toast({ title: "Validation Error", description: "Please correct the highlighted fields.", variant: "destructive" })
            return
        }

        if (editingId) {
            setUtmList(utmList.map(u => u.id === editingId ? { ...u, key: form.key.trim(), description: form.description.trim(), mapping: form.mapping } : u))
            toast({ title: "Mapping Updated", description: "Parameter mapping saved." })
        } else {
            const newParam: UTMParam = {
                id: Math.random().toString(36).substring(2, 11),
                key: form.key.trim(),
                description: form.description.trim(),
                mapping: form.mapping,
                captures: 0
            }
            setUtmList([newParam, ...utmList])
            toast({ title: "Mapping Created", description: "New custom parameter ready to capture." })
        }

        setIsFormOpen(false)
        setEditingId(null)
        setForm({ key: "", description: "", mapping: "System Source" })
        setErrors({})
    }

    const handleDelete = (id: string) => {
        setUtmList(utmList.filter(u => u.id !== id))
        toast({ title: "Mapping Removed", description: "Parameter no longer captured." })
    }

    const filteredUtm = useMemo(() => {
        return utmList.filter(u => !searchQuery || u.key.toLowerCase().includes(searchQuery.toLowerCase()) || u.mapping.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [utmList, searchQuery])

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header - light colorful */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-gradient-to-br from-cyan-50 via-indigo-50 to-pink-50 p-6 rounded-none border border-cyan-100 shadow-sm">
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
                            <div className="p-2 rounded-none bg-cyan-100 text-cyan-600 border border-cyan-200 shadow-sm">
                                <LinkIcon className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                UTM Parameter Engine
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Automatically capture, map, and standardize global UTM parameters. Ensure every link click translates into structured lead data.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast({ description: "Opening API SDK documentation..." })} className="h-10 rounded-none border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Terminal className="h-4 w-4 mr-2 text-slate-400" /> API SDK Docs
                    </Button>
                    <Button onClick={openCreate} className="h-10 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> Global Mapping
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Visual UTM Builder Area */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-50">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-[18px] font-semibold tracking-tight text-slate-900">UTM Builder Tool</CardTitle>
                                    <CardDescription className="text-[13px] font-medium text-slate-500">Generate standardized tracking URLs for your marketing campaigns.</CardDescription>
                                </div>
                                <div className="bg-cyan-50 text-cyan-600 p-2.5 rounded-none">
                                    <LayoutTemplate size={20} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Base Website URL <span className="text-rose-500 normal-case">*</span></label>
                                    <Input
                                        name="url"
                                        value={utmBuilder.url}
                                        onChange={(e) => { setUtmBuilder({ ...utmBuilder, url: e.target.value }); if (builderErrors.url) setBuilderErrors({ ...builderErrors, url: undefined }) }}
                                        className={`h-11 rounded-none border-slate-200 text-[13px] font-semibold ${builderErrors.url ? "border-rose-500" : ""}`}
                                        placeholder="https://yoursite.com"
                                    />
                                    {builderErrors.url && <p className="text-[11px] text-rose-500 font-medium">{builderErrors.url}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Campaign Source <span className="text-rose-500 normal-case">*</span></label>
                                    <div className="flex gap-2">
                                        <Input
                                            name="source"
                                            value={utmBuilder.source}
                                            onChange={(e) => { setUtmBuilder({ ...utmBuilder, source: e.target.value }); if (builderErrors.source) setBuilderErrors({ ...builderErrors, source: undefined }) }}
                                            className={`h-11 rounded-none border-slate-200 text-[13px] font-semibold ${builderErrors.source ? "border-rose-500" : ""}`}
                                            placeholder="e.g. google, linkedin"
                                        />
                                        <Button variant="outline" onClick={() => toast({ description: "Suggesting source values from history..." })} className="h-11 w-11 p-0 rounded-none border-slate-200"><Zap size={14} className="text-amber-500" /></Button>
                                    </div>
                                    {builderErrors.source && <p className="text-[11px] text-rose-500 font-medium">{builderErrors.source}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Campaign Medium</label>
                                    <Select
                                        value={utmBuilder.medium}
                                        onValueChange={(v) => setUtmBuilder({ ...utmBuilder, medium: v })}
                                    >
                                        <SelectTrigger className="h-11 rounded-none border-slate-200 font-semibold text-[13px]">
                                            <SelectValue placeholder="Select Medium" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-none">
                                            <SelectItem value="cpc">Paid Ads (CPC)</SelectItem>
                                            <SelectItem value="email">Email Blast</SelectItem>
                                            <SelectItem value="social">Organic Social</SelectItem>
                                            <SelectItem value="referral">Direct Referral</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Campaign Name <span className="text-rose-500 normal-case">*</span></label>
                                    <Input
                                        name="campaign"
                                        value={utmBuilder.campaign}
                                        onChange={(e) => { setUtmBuilder({ ...utmBuilder, campaign: e.target.value }); if (builderErrors.campaign) setBuilderErrors({ ...builderErrors, campaign: undefined }) }}
                                        className={`h-11 rounded-none border-slate-200 text-[13px] font-semibold ${builderErrors.campaign ? "border-rose-500" : ""}`}
                                        placeholder="e.g. summer_promo_2026"
                                    />
                                    {builderErrors.campaign && <p className="text-[11px] text-rose-500 font-medium">{builderErrors.campaign}</p>}
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-none space-y-4">
                                <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-1 px-1">
                                    <span>Generated Tracking URL</span>
                                    <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Standardized</span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white border border-slate-200 rounded-none p-3 text-[13px] font-mono text-indigo-600 break-all leading-relaxed h-[64px] overflow-hidden shadow-sm">
                                        {generatedLink}
                                    </div>
                                    <Button
                                        onClick={handleCopy}
                                        className="h-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 rounded-none border-none shadow-lg shadow-indigo-600/20"
                                    >
                                        <Copy size={18} />
                                    </Button>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">Use this link in your ads, emails, or social posts. The platform will automatically capture these values on lead creation.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white p-8 space-y-4">
                            <div className="p-3 rounded-none bg-indigo-50 text-indigo-600 w-fit">
                                <Database size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Custom Parameter Capture</h4>
                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                Define your own custom URL parameters to track unique data points like <span className="font-mono text-indigo-500 text-[11px]">click_id</span> or <span className="font-mono text-indigo-500 text-[11px]">partner_ref</span>.
                            </p>
                            <Button variant="ghost" onClick={openCreate} className="h-9 px-0 text-indigo-600 font-semibold text-[11px] uppercase tracking-widest hover:bg-transparent inline-flex items-center gap-2 group">
                                Define Custom Params <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white p-8 space-y-4">
                            <div className="p-3 rounded-none bg-emerald-50 text-emerald-600 w-fit">
                                <Zap size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Intelligent Mapping</h4>
                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                UTMs are automatically mapped to Lead Source, Channel, and Campaign entities using your standardization rules.
                            </p>
                            <Button variant="ghost" onClick={() => toast({ description: "Opening logic rules viewer..." })} className="h-9 px-0 text-emerald-600 font-semibold text-[11px] uppercase tracking-widest hover:bg-transparent inline-flex items-center gap-2 group">
                                View Logic Rules <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Tracking Inventory Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-6 space-y-6">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="text-[15px] font-semibold text-slate-900">Tracked Fields</h4>
                            <div className="flex items-center gap-2">
                                {showSearch ? (
                                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-none px-2 h-7">
                                        <Search className="h-3 w-3 text-slate-400 mr-1.5" />
                                        <Input
                                            autoFocus
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search..."
                                            className="border-none h-5 px-0 text-[11px] focus-visible:ring-0 w-24 bg-transparent"
                                        />
                                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { setShowSearch(false); setSearchQuery("") }}>
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowSearch(true)}>
                                        <Search className="h-3.5 w-3.5 text-slate-400" />
                                    </Button>
                                )}
                                <Badge className="bg-slate-50 text-slate-400 border-none font-semibold text-[10px] h-5 px-2 uppercase tracking-wider rounded-none">Library</Badge>
                            </div>
                        </div>

                        <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                            {filteredUtm.map((param) => (
                                <div key={param.id} className="p-4 rounded-none bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:ring-1 hover:ring-indigo-100 group">
                                    <div className="flex justify-between items-start mb-1">
                                        <code className="text-[12px] font-semibold text-indigo-600 tracking-tight group-hover:text-indigo-700">{param.key}</code>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(param)}>
                                                <Pencil size={11} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-rose-500" onClick={() => handleDelete(param.id)}>
                                                <Trash2 size={11} />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-[11px] text-slate-500 font-medium leading-tight max-w-[150px]">{param.description}</p>
                                        <div className="text-right">
                                            <p className="text-[12px] font-semibold text-slate-900">{param.mapping}</p>
                                            <p className="text-[10px] font-semibold text-slate-400 tabular-nums">{param.captures.toLocaleString()} hits</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredUtm.length === 0 && (
                                <div className="p-6 text-center text-slate-400 text-[12px] font-medium border-2 border-dashed border-slate-200 rounded-none">
                                    No parameters match your search.
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-rose-100 rounded-none bg-rose-50 p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-none bg-white text-rose-600 shadow-sm">
                                <AlertTriangle size={18} />
                            </div>
                            <h4 className="text-[14px] font-semibold tracking-tight text-rose-900">Unknown Parameters</h4>
                        </div>
                        <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
                            Found 12 unrecognized URL parameters (e.g. <span className="font-mono text-rose-500 font-semibold bg-white px-1 py-0.5 rounded-none">rf_id</span>) in the last 24 hours.
                        </p>
                        <Button variant="outline" onClick={() => toast({ description: "Opening unmapped parameter bucket..." })} className="w-full h-9 bg-white text-rose-700 font-semibold text-[10px] uppercase tracking-widest rounded-none hover:bg-rose-100 shadow-sm border border-rose-200">
                            Review Bucket
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-indigo-50 text-indigo-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-500 transition-transform group-hover:scale-110">
                            <Terminal size={100} />
                        </div>
                        <h4 className="text-[15px] font-semibold relative z-10 tracking-tight">Server-Side Tracking</h4>
                        <p className="text-[12px] text-indigo-700 font-medium leading-relaxed relative z-10">
                            Implement First-Party tracking to bypass ad-blockers and privacy restrictions.
                        </p>
                        <Button onClick={() => toast({ description: "Launching JS proxy setup wizard..." })} className="w-full h-10 bg-white text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-widest rounded-none border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-10">
                            Setup JS Proxy
                        </Button>
                    </Card>
                </div>

            </div>

            {/* Slide-from-Right Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b border-slate-100 bg-gradient-to-br from-cyan-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold tracking-tight text-slate-900">
                            {editingId ? "Edit UTM Mapping" : "Define Global UTM Mapping"}
                        </SheetTitle>
                        <p className="text-[12px] text-slate-500 font-medium">
                            {editingId ? "Update the parameter and target mapping." : "Add a new tracked URL parameter."}
                        </p>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Parameter Key <span className="text-rose-500">*</span></Label>
                            <Input
                                name="key"
                                value={form.key}
                                onChange={e => { setForm({ ...form, key: e.target.value }); if (errors.key) setErrors({ ...errors, key: undefined }) }}
                                placeholder="e.g., utm_content or click_id"
                                className={`h-11 rounded-none font-mono text-[13px] ${errors.key ? "border-rose-500" : ""}`}
                            />
                            {errors.key && <p className="text-[11px] text-rose-500 font-medium">{errors.key}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Description <span className="text-rose-500">*</span></Label>
                            <Input
                                name="description"
                                value={form.description}
                                onChange={e => { setForm({ ...form, description: e.target.value }); if (errors.description) setErrors({ ...errors, description: undefined }) }}
                                placeholder="What does this parameter capture?"
                                className={`h-11 rounded-none ${errors.description ? "border-rose-500" : ""}`}
                            />
                            {errors.description && <p className="text-[11px] text-rose-500 font-medium">{errors.description}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Mapping Target <span className="text-rose-500">*</span></Label>
                            <Select value={form.mapping} onValueChange={v => { setForm({ ...form, mapping: v }); if (errors.mapping) setErrors({ ...errors, mapping: undefined }) }}>
                                <SelectTrigger className={`h-11 rounded-none ${errors.mapping ? "border-rose-500" : ""}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {MAPPING_OPTIONS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.mapping && <p className="text-[11px] text-rose-500 font-medium">{errors.mapping}</p>}
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-11 rounded-none border-slate-200" onClick={() => setIsFormOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-none" onClick={handleSubmit}>
                            {editingId ? "Save Changes" : "Add Mapping"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
