"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    FileText, Copy, Layout, Search, Filter, MoreVertical, Plus, Trash2, PencilLine,
    Eye, Code, Sparkles, Clock, Zap, Tag, Share2, ChevronRight, RefreshCw, ShieldCheck,
    Layers, Star,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Textarea } from "@/shared/components/ui/textarea"
import { Badge } from "@/shared/components/ui/badge"
import { toast } from "@/shared/utils/toast"

interface Template {
    id: number
    name: string
    category: 'Onboarding' | 'Renewal' | 'Support' | 'Marketing' | 'Personal' | 'System'
    type: 'Email' | 'SMS' | 'Notification'
    lastUsed: string
    usageCount: number
    author: string
    content: string
    folder: 'active' | 'archives' | 'drafts' | 'trash'
    isStarred?: boolean
}

const initialTemplates: Template[] = [
    { id: 1, name: "Executive QBR Invitation", category: "Renewal", type: "Email", lastUsed: "2 hours ago", usageCount: 145, author: "Sarah J.", content: "<h1>Hello {{account.name}},</h1><p>We would like to invite you to our quarterly business review session.</p>", folder: 'active', isStarred: true },
    { id: 2, name: "Technical Kickoff Checklist", category: "Onboarding", type: "Email", lastUsed: "Yesterday", usageCount: 82, author: "Mike W.", content: "Dear Team,\n\nFinding the onboarding checklist below...", folder: 'active' },
    { id: 3, name: "SLA Resolution Alert", category: "Support", type: "SMS", lastUsed: "12 mins ago", usageCount: 1240, author: "System", content: "SLA ALERT: Case #{{case_id}} has been resolved with 99.9% uptime compliance.", folder: 'active' },
    { id: 4, name: "New Feature: AI Insights", category: "Marketing", type: "Email", lastUsed: "3 days ago", usageCount: 210, author: "Emily R.", content: "Exciting news! Our new AI Insights engine is now live...", folder: 'archives' },
    { id: 5, name: "Account Churn Risk Ping", category: "Personal", type: "Notification", lastUsed: "5 hours ago", usageCount: 15, author: "Sarah J.", content: "Heads up: Account health dropped below 20%. Execute retention sequence.", folder: 'drafts' },
    { id: 6, name: "Legacy System Alert", category: "System", type: "Notification", lastUsed: "2 months ago", usageCount: 0, author: "Admin", content: "System will undergo maintenance at UTC 02:00.", folder: 'trash' },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Renewal': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'Onboarding': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'Support': return 'bg-rose-50 text-rose-600 border-rose-100'
        case 'Marketing': return 'bg-violet-50 text-violet-600 border-violet-100'
        case 'Personal': return 'bg-indigo-50 text-indigo-600 border-indigo-100'
        default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
}

export default function TemplatesPage() {
    const router = useRouter()
    const [templates, setTemplates] = React.useState<Template[]>(initialTemplates)
    const [search, setSearch] = React.useState("")
    const [currentFolder, setCurrentFolder] = React.useState<'active' | 'archives' | 'drafts' | 'trash'>('active')
    const [categoryFilter, setCategoryFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<Template | null>(null)

    const [form, setForm] = React.useState({
        name: "", category: "Onboarding" as Template['category'],
        type: "Email" as Template['type'], author: "System Admin", content: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const total = templates.length
        const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0)
        const categories = new Set(templates.map(t => t.category)).size
        const automationRate = "88.4%"
        return { total, totalUsage: totalUsage.toLocaleString(), categories, automationRate }
    }, [templates])

    const filtered = React.useMemo(() => {
        return templates.filter(t =>
            t.folder === currentFolder &&
            (categoryFilter === "all" || t.category === categoryFilter) &&
            (t.name.toLowerCase().includes(search.toLowerCase()) ||
                t.category.toLowerCase().includes(search.toLowerCase()))
        )
    }, [templates, search, currentFolder, categoryFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.content = validators.required(form.content) || validators.minLen(5)(form.content)
        errs.author = validators.required(form.author)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", category: "Onboarding", type: "Email", author: "System Admin", content: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (t: Template) => {
        setEditingId(t.id)
        setForm({ name: t.name, category: t.category, type: t.type, author: t.author, content: t.content })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setTemplates(templates.map(t => t.id === editingId ? {
                ...t, name: form.name.trim(), category: form.category, type: form.type,
                author: form.author.trim(), content: form.content.trim(),
            } : t))
            toast.success("Template updated")
        } else {
            const newT: Template = {
                id: Date.now(),
                name: form.name.trim(),
                category: form.category,
                type: form.type,
                lastUsed: "Never",
                usageCount: 0,
                author: form.author.trim(),
                content: form.content.trim(),
                folder: 'active',
            }
            setTemplates([newT, ...templates])
            toast.success("Template created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setTemplates(templates.map(t => t.id === id ? { ...t, folder: 'trash' as const } : t))
        toast.success("Moved to trash")
    }

    const handlePermanentDelete = (id: number) => {
        setTemplates(templates.filter(t => t.id !== id))
        toast.success("Template purged")
    }

    const handleClone = (t: Template) => {
        const cloned: Template = { ...t, id: Date.now(), name: `${t.name} (Copy)`, folder: 'drafts', usageCount: 0, lastUsed: 'Never' }
        setTemplates([cloned, ...templates])
        toast.success("Template cloned")
    }

    const openDetail = (t: Template) => { setSelected(t); setIsDetailOpen(true) }

    const toggleStar = (id: number, ev: React.MouseEvent) => {
        ev.stopPropagation()
        setTemplates(templates.map(t => t.id === id ? { ...t, isStarred: !t.isStarred } : t))
    }

    const kpiCards = [
        { title: "Total Blueprints", value: String(metrics.total), subtitle: "Library Assets", icon: FileText, color: "emerald", trend: `+${metrics.total}`, path: "/client-management/communication/history" },
        { title: "Global Dispatches", value: metrics.totalUsage, subtitle: "Last 90 days", icon: Copy, color: "blue", trend: "+24%", path: "/client-management/communication/email" },
        { title: "Trigger Efficiency", value: metrics.automationRate, subtitle: "Auto Engagement", icon: Zap, color: "indigo", trend: "+5%", path: "/client-management/communication/campaigns" },
        { title: "Categories", value: String(metrics.categories), subtitle: "Active Segments", icon: Layout, color: "amber", trend: "", path: "/client-management/analytics/overview" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    const folders = [
        { id: 'active', label: 'Prime Library', icon: FileText, count: templates.filter(t => t.folder === 'active').length },
        { id: 'drafts', label: 'Drafts', icon: PencilLine, count: templates.filter(t => t.folder === 'drafts').length },
        { id: 'archives', label: 'Archives', icon: Clock, count: 0 },
        { id: 'trash', label: 'Trash', icon: Trash2, count: 0 },
    ]

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Communication <span className="text-emerald-600">Templates</span>
                        </h1>
                        <Badge className="rounded-none bg-emerald-50 text-emerald-600 border-emerald-100 border text-[10px]">
                            <ShieldCheck className="h-3 w-3 mr-1" /> Library Verified
                        </Badge>
                    </div>
                    <p className="text-[14px] font-medium text-slate-500">Standardize client outreach with reusable, high-converting design frameworks.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={() => toast.success("Library refreshed")}>
                        <RefreshCw className="h-4 w-4 mr-2" />Refresh
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />New Template
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, i) => {
                    const cc = colorMap[kpi.color]
                    const Icon = kpi.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(kpi.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">{kpi.title}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                                            {kpi.trend && <span className="text-xs font-bold text-emerald-600">{kpi.trend}</span>}
                                        </div>
                                        <p className="mt-2 text-xs text-slate-400">{kpi.subtitle}</p>
                                    </div>
                                    <div className={`h-10 w-10 rounded-none flex items-center justify-center ${cc.iconBg}`}>
                                        <Icon className={`h-5 w-5 ${cc.text}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-2">
                    <Card className="rounded-none">
                        <CardContent className="p-3">
                            <div className="space-y-1">
                                {folders.map(f => {
                                    const FIcon = f.icon
                                    return (
                                        <button key={f.id} onClick={() => setCurrentFolder(f.id as any)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none transition text-[12px] font-bold ${currentFolder === f.id ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                                            <div className="flex items-center gap-2.5">
                                                <FIcon className="h-4 w-4" />
                                                <span>{f.label}</span>
                                            </div>
                                            {f.count > 0 && (
                                                <span className={`px-1.5 py-0.5 text-[9px] rounded-none ${currentFolder === f.id ? "bg-white text-emerald-600" : "bg-emerald-50 text-emerald-700"}`}>{f.count}</span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <p className="px-3 text-[10px] font-bold text-slate-400 tracking-widest mb-3">Priority Tags</p>
                                <div className="space-y-1">
                                    {[
                                        { color: 'bg-emerald-500', name: 'Converted' },
                                        { color: 'bg-indigo-500', name: 'Strategic' },
                                        { color: 'bg-blue-500', name: 'Automated' },
                                    ].map((t, i) => (
                                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer rounded-none">
                                            <div className={`h-2 w-2 rounded-none ${t.color}`} />
                                            <span>{t.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-7 space-y-4">
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold capitalize">{currentFolder} ({filtered.length})</CardTitle>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {filtered.length > 0 ? filtered.map(t => (
                                    <div key={t.id} className={`group relative p-5 hover:bg-slate-50/80 transition cursor-pointer border-l-4 ${t.isStarred ? "border-l-amber-400 bg-amber-50/10" : "border-l-transparent"}`}
                                        onClick={() => openDetail(t)}>
                                        <div className="flex items-start gap-4">
                                            <button onClick={(e) => toggleStar(t.id, e)} className="mt-0.5">
                                                <Star className={`h-4 w-4 ${t.isStarred ? "text-amber-400 fill-amber-400" : "text-slate-300"}`} />
                                            </button>
                                            <div className="h-9 w-9 rounded-none bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-[13px] font-bold text-slate-900">{t.name}</p>
                                                    <span className="text-[10px] font-bold text-slate-400">{t.lastUsed}</span>
                                                </div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold border ${getCategoryColor(t.category)}`}>{t.category}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">{t.type}</span>
                                                    <span className="text-[10px] font-bold text-slate-900">• {t.usageCount.toLocaleString()} uses</span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 line-clamp-1 pr-16 italic">"{t.content.substring(0, 100)}..."</p>
                                            </div>
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition" onClick={e => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-none h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-none w-44">
                                                        <DropdownMenuItem onClick={() => openDetail(t)}><Eye className="h-4 w-4 mr-2" /> Preview</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openEdit(t)}><PencilLine className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleClone(t)}><Copy className="h-4 w-4 mr-2" /> Duplicate</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast.success("Template shared with team")}><Share2 className="h-4 w-4 mr-2" /> Share</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-500 border-t mt-1" onClick={() => currentFolder === 'trash' ? handlePermanentDelete(t.id) : handleDelete(t.id)}>
                                                            <Trash2 className="h-4 w-4 mr-2" /> {currentFolder === 'trash' ? 'Purge' : 'Delete'}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center">
                                        <Code className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                                        <p className="text-sm font-bold text-slate-400">No templates in {currentFolder}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3 space-y-4">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-widest uppercase">High ROI Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { text: 'Strategic QBR', color: 'emerald' },
                                    { text: 'Personalized', color: 'blue' },
                                    { text: 'SLA Dashboard', color: 'indigo' },
                                    { text: 'AI Forecast', color: 'amber' },
                                ].map((tag, i) => (
                                    <div key={i} className="px-3 py-1.5 border border-slate-200 rounded-none flex items-center gap-2 cursor-pointer hover:border-emerald-200" onClick={() => toast.success(`Tag ${tag.text} selected`)}>
                                        <Tag className="h-3 w-3 text-slate-400" />
                                        <span className="text-[10px] font-bold text-slate-600">{tag.text}</span>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full mt-5 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold tracking-widest h-10" onClick={() => router.push('/client-management/analytics/overview')}>
                                Tag Intelligence
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-widest uppercase flex items-center gap-2">
                                <Sparkles className="h-4 w-4" /> Optimization AI
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[10px] font-bold text-rose-500 mb-1">Performance Alert</p>
                                <p className="text-[12px] font-bold text-slate-800">Renewal Open-Rate Drop</p>
                                <p className="text-[11px] text-slate-500 mt-1">Strategic QBR template showing fatigue. AI recommends dynamic goal injection.</p>
                            </div>
                            <Button className="w-full rounded-none bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => toast.success("Auto-rotation engaged")}>
                                Execute Auto-Rotation
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-widest uppercase">Design Lineage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { v: 'V2.6', date: 'Oct 14', author: 'Sarah J.', desc: 'High-Touch CTA Logic' },
                                { v: 'V2.4', date: 'Oct 12', author: 'Admin', desc: 'SLA Dashboard Bridge' },
                                { v: 'V2.3', date: 'Sep 28', author: 'Mike W.', desc: 'Responsive CSS Grid' },
                            ].map((v, i) => (
                                <div key={i} className="flex items-center gap-3 hover:bg-slate-50 p-2 -m-2 cursor-pointer">
                                    <div className="h-10 w-10 rounded-none bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-800">{v.v}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-bold text-slate-700 truncate">{v.desc}</p>
                                        <p className="text-[10px] text-slate-400">{v.author} • {v.date}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-300" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-emerald-50 to-cyan-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900 flex items-center gap-2">
                            <Layers className="h-5 w-5 text-emerald-600" />
                            {editingId ? "Edit Template" : "New Template"}
                        </SheetTitle>
                        <p className="text-[12px] text-slate-500">Define a reusable communication blueprint.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Template Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g. Executive QBR Invite" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Category</Label>
                                <Select value={form.category} onValueChange={(v: any) => setField("category", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Onboarding">Onboarding</SelectItem>
                                        <SelectItem value="Renewal">Renewal</SelectItem>
                                        <SelectItem value="Support">Support</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                        <SelectItem value="Personal">Personal</SelectItem>
                                        <SelectItem value="System">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={form.type} onValueChange={(v: any) => setField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Email">Email</SelectItem>
                                        <SelectItem value="SMS">SMS</SelectItem>
                                        <SelectItem value="Notification">Notification</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Author <span className="text-rose-500">*</span></Label>
                            <Input value={form.author} onChange={e => setField("author", e.target.value)} className={`h-10 rounded-none ${errors.author ? "border-rose-500" : ""}`} />
                            {errors.author && <p className="text-[11px] text-rose-500">{errors.author}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold flex items-center gap-2">
                                Content <Code className="h-3 w-3 text-emerald-600" /> <span className="text-rose-500">*</span>
                            </Label>
                            <Textarea value={form.content} onChange={e => setField("content", e.target.value)} placeholder="<h1>Hello {{account.name}}!</h1>" className={`min-h-[180px] font-mono text-xs rounded-none ${errors.content ? "border-rose-500" : ""}`} />
                            {errors.content && <p className="text-[11px] text-rose-500">{errors.content}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Publish"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Templates</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Category</Label>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                                    <SelectItem value="Renewal">Renewal</SelectItem>
                                    <SelectItem value="Support">Support</SelectItem>
                                    <SelectItem value="Marketing">Marketing</SelectItem>
                                    <SelectItem value="Personal">Personal</SelectItem>
                                    <SelectItem value="System">System</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setCategoryFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet (Preview) */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-emerald-50">
                        <SheetTitle className="text-[18px] font-semibold">Template Preview</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Name</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">By {selected.author}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Category</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${getCategoryColor(selected.category)}`}>{selected.category}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><Badge className="rounded-none">{selected.type}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Used</p><p className="font-semibold text-slate-900">{selected.lastUsed}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Dispatches</p><p className="font-semibold text-slate-900">{selected.usageCount.toLocaleString()}</p></div>
                                </div>
                                <div className="border-t pt-3">
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">Content</p>
                                    <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-none">
                                        <pre className="whitespace-pre-wrap">{selected.content}</pre>
                                    </div>
                                </div>
                                <div className="border-t pt-3">
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-2">Variables</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['{{account.name}}', '{{contract.value}}', '{{qbr.date}}'].map((v, i) => (
                                            <Badge key={i} className="rounded-none bg-indigo-50 text-indigo-600 border-indigo-100 border font-mono text-[10px]">{v}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
