"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Search, Download, Layers, Type,
    Trash2, PencilLine, Filter, MoreVertical, Eye,
    Activity, CheckCircle2, Calendar as CalIcon, Hash,
    ToggleLeft, List, Mail, Link as LinkIcon, Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Progress } from "@/shared/components/ui/progress"
import { toast } from "@/shared/utils/toast"

type CustomField = {
    id: string
    label: string
    fieldKey: string
    entity: 'Contact' | 'Company' | 'Deal' | 'Ticket' | 'Subscription'
    type: 'Text' | 'Number' | 'Date' | 'Boolean' | 'Dropdown' | 'Email' | 'URL'
    options: string[]
    required: boolean
    defaultValue: string
    description: string
    enabled: boolean
    usageCount: number
    createdAt: string
}

const ENTITIES: CustomField['entity'][] = ["Contact", "Company", "Deal", "Ticket", "Subscription"]
const TYPES: CustomField['type'][] = ["Text", "Number", "Date", "Boolean", "Dropdown", "Email", "URL"]

const TYPE_ICONS: Record<CustomField['type'], any> = {
    Text: Type, Number: Hash, Date: CalIcon, Boolean: ToggleLeft,
    Dropdown: List, Email: Mail, URL: LinkIcon,
}
const TYPE_COLORS: Record<CustomField['type'], string> = {
    Text: "bg-slate-50 text-slate-600 border-slate-100",
    Number: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Date: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Boolean: "bg-violet-50 text-violet-600 border-violet-100",
    Dropdown: "bg-amber-50 text-amber-600 border-amber-100",
    Email: "bg-cyan-50 text-cyan-600 border-cyan-100",
    URL: "bg-rose-50 text-rose-600 border-rose-100",
}

const INITIAL: CustomField[] = [
    { id: "CF-001", label: "Industry", fieldKey: "industry", entity: "Company", type: "Dropdown", options: ["Tech", "Finance", "Healthcare", "Retail", "Other"], required: false, defaultValue: "Other", description: "Primary industry of the company.", enabled: true, usageCount: 1240, createdAt: "Jan 15, 2024" },
    { id: "CF-002", label: "Lead Score", fieldKey: "lead_score", entity: "Contact", type: "Number", options: [], required: false, defaultValue: "0", description: "Calculated lead-scoring value (0-100).", enabled: true, usageCount: 2840, createdAt: "Feb 02, 2024" },
    { id: "CF-003", label: "Next Renewal", fieldKey: "next_renewal", entity: "Subscription", type: "Date", options: [], required: true, defaultValue: "", description: "Date when subscription renews.", enabled: true, usageCount: 820, createdAt: "Mar 10, 2024" },
    { id: "CF-004", label: "Decision Maker", fieldKey: "decision_maker", entity: "Contact", type: "Boolean", options: [], required: false, defaultValue: "false", description: "Whether the contact is a buying decision-maker.", enabled: true, usageCount: 1820, createdAt: "Apr 22, 2024" },
    { id: "CF-005", label: "Source URL", fieldKey: "source_url", entity: "Deal", type: "URL", options: [], required: false, defaultValue: "", description: "Original source URL where deal originated.", enabled: true, usageCount: 420, createdAt: "May 14, 2024" },
    { id: "CF-006", label: "Account Manager Email", fieldKey: "account_manager_email", entity: "Company", type: "Email", options: [], required: false, defaultValue: "", description: "Email of assigned account manager.", enabled: false, usageCount: 0, createdAt: "Aug 01, 2024" },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    key: (v: string) => v && !/^[a-z][a-z0-9_]*$/i.test(v) ? "Use lowercase letters, numbers, underscores; start with letter" : "",
}

export default function CustomFieldsPage() {
    const router = useRouter()
    const [fields, setFields] = React.useState<CustomField[]>(INITIAL)
    const [search, setSearch] = React.useState("")
    const [entityFilter, setEntityFilter] = React.useState("all")
    const [typeFilter, setTypeFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<CustomField | null>(null)

    const [form, setForm] = React.useState({
        label: "", fieldKey: "", entity: "Contact" as CustomField['entity'], type: "Text" as CustomField['type'],
        optionsStr: "", required: false, defaultValue: "", description: "",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => ({
        total: fields.length,
        active: fields.filter(f => f.enabled).length,
        required: fields.filter(f => f.required).length,
        entities: new Set(fields.map(f => f.entity)).size,
    }), [fields])

    const filtered = React.useMemo(() => fields.filter(f => {
        const matchSearch = f.label.toLowerCase().includes(search.toLowerCase()) || f.fieldKey.toLowerCase().includes(search.toLowerCase())
        const matchEntity = entityFilter === "all" || f.entity === entityFilter
        const matchType = typeFilter === "all" || f.type === typeFilter
        return matchSearch && matchEntity && matchType
    }), [fields, search, entityFilter, typeFilter])

    const setFieldValue = (field: string, value: any) => {
        setForm(prev => {
            const next = { ...prev, [field]: value }
            if (field === "label" && !editingId) {
                next.fieldKey = value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")
            }
            return next
        })
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.label = validators.required(form.label) || validators.minLen(2)(form.label)
        errs.fieldKey = validators.required(form.fieldKey) || validators.key(form.fieldKey)
        if (form.type === "Dropdown" && !form.optionsStr.trim()) errs.optionsStr = "Dropdown options required"
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ label: "", fieldKey: "", entity: "Contact", type: "Text", optionsStr: "", required: false, defaultValue: "", description: "" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (f: CustomField) => {
        setEditingId(f.id)
        setForm({ label: f.label, fieldKey: f.fieldKey, entity: f.entity, type: f.type, optionsStr: f.options.join(", "), required: f.required, defaultValue: f.defaultValue, description: f.description })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const opts = form.optionsStr.split(",").map(s => s.trim()).filter(Boolean)
        if (editingId) {
            setFields(fields.map(f => f.id === editingId ? { ...f, label: form.label.trim(), fieldKey: form.fieldKey, entity: form.entity, type: form.type, options: opts, required: form.required, defaultValue: form.defaultValue, description: form.description.trim() } : f))
            toast.success("Field updated")
        } else {
            const f: CustomField = {
                id: `CF-${String(fields.length + 1).padStart(3, "0")}`,
                label: form.label.trim(), fieldKey: form.fieldKey, entity: form.entity, type: form.type,
                options: opts, required: form.required, defaultValue: form.defaultValue,
                description: form.description.trim(), enabled: true, usageCount: 0,
                createdAt: new Date().toLocaleDateString(),
            }
            setFields([f, ...fields])
            toast.success(`Field "${f.label}" created`)
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setFields(fields.filter(f => f.id !== id))
        toast.success("Field removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setFields(fields.map(f => f.id === id ? { ...f, enabled: !current } : f))
        toast.success(current ? "Field hidden" : "Field visible")
    }

    const handleExport = () => {
        const csv = [["ID", "Label", "Key", "Entity", "Type", "Required", "Enabled", "Usage"], ...fields.map(f => [f.id, f.label, f.fieldKey, f.entity, f.type, f.required, f.enabled, f.usageCount])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "custom-fields.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Fields exported")
    }

    const openDetail = (f: CustomField) => { setSelected(f); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Total Fields", value: String(stats.total), subtitle: "Custom field definitions", icon: Layers, color: "indigo", trend: `+${stats.total}`, path: "/client-management/settings/fields" },
        { title: "Active Fields", value: String(stats.active), subtitle: "Visible in forms", icon: Activity, color: "emerald", trend: `+${stats.active}`, path: "/client-management/settings/fields" },
        { title: "Required Fields", value: String(stats.required), subtitle: "Mandatory inputs", icon: CheckCircle2, color: "amber", trend: `${stats.required}`, path: "/client-management/settings/fields" },
        { title: "Entity Coverage", value: String(stats.entities), subtitle: "Entities customized", icon: Type, color: "violet", trend: "+1", path: "/client-management/settings/fields" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Custom <span className="text-indigo-600">Fields</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Extend CRM records with custom field definitions across entities.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />New Field
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
                                            <span className={`text-xs font-bold ${cc.text}`}>{kpi.trend}</span>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold">Custom Fields</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search fields..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Field</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Entity</th>
                                            <th className="px-6 py-3">Usage</th>
                                            <th className="px-6 py-3">Enabled</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(f => {
                                            const Icon = TYPE_ICONS[f.type]
                                            return (
                                                <tr key={f.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(f)}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-9 w-9 rounded-none border flex items-center justify-center ${TYPE_COLORS[f.type]}`}>
                                                                <Icon className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-semibold text-slate-800">{f.label}</p>
                                                                    {f.required && <Badge className="rounded-none bg-rose-50 text-rose-600 text-[9px] border border-rose-100">Required</Badge>}
                                                                </div>
                                                                <p className="text-[11px] font-mono text-slate-500">{f.fieldKey}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${TYPE_COLORS[f.type]}`}>{f.type}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge className="rounded-none bg-slate-100 text-slate-700">{f.entity}</Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{f.usageCount.toLocaleString()}</td>
                                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                        <Switch checked={f.enabled} onCheckedChange={() => handleToggle(f.id, f.enabled)} className="data-[state=checked]:bg-indigo-600" />
                                                    </td>
                                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="rounded-none">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(f)}>
                                                                    <PencilLine className="h-4 w-4" /> Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(f)}>
                                                                    <Eye className="h-4 w-4" /> View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(f.id)}>
                                                                    <Trash2 className="h-4 w-4" /> Remove
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            )
                                        }) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No custom fields match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Field Distribution by Entity</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Number of custom fields per entity</p>
                            </div>
                            <Layers className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {ENTITIES.map((e, idx) => {
                                const list = fields.filter(f => f.entity === e)
                                const max = Math.max(...ENTITIES.map(en => fields.filter(f => f.entity === en).length), 1)
                                const progress = (list.length / max) * 100
                                return (
                                    <div key={idx} className="space-y-2 cursor-pointer hover:bg-slate-50 p-2 -m-2 transition" onClick={() => setEntityFilter(e)}>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{e} <span className="text-slate-400 font-medium ml-2">{list.length} fields</span></span>
                                            <span className="text-slate-900">{list.reduce((s, f) => s + f.usageCount, 0).toLocaleString()} uses</span>
                                        </div>
                                        <Progress value={progress} className="h-1.5 bg-slate-50" />
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Most Used Fields</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...fields].sort((a, b) => b.usageCount - a.usageCount).slice(0, 4).map((f, idx) => {
                                const Icon = TYPE_ICONS[f.type]
                                return (
                                    <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 transition" onClick={() => openDetail(f)}>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-9 w-9 rounded-none border flex items-center justify-center ${TYPE_COLORS[f.type]}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 leading-none">{f.label}</p>
                                                <p className="text-[10px] text-slate-400 mt-1 font-mono">{f.fieldKey}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-900">{f.usageCount.toLocaleString()}</p>
                                            <Badge className="rounded-none bg-slate-100 text-slate-600 text-[9px]">{f.entity}</Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Zap className="h-4 w-4" /> Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Use <span className="text-indigo-600 font-bold">consistent naming</span> in field keys (snake_case).
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => router.push('/client-management/settings/roles')}>
                                Manage Permissions
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Field" : "Create Custom Field"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Configure field metadata and validation.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Field Label <span className="text-rose-500">*</span></Label>
                            <Input value={form.label} onChange={e => setFieldValue("label", e.target.value)} placeholder="e.g., Industry" className={`h-10 rounded-none ${errors.label ? "border-rose-500" : ""}`} />
                            {errors.label && <p className="text-[11px] text-rose-500">{errors.label}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Field Key <span className="text-rose-500">*</span></Label>
                            <Input value={form.fieldKey} onChange={e => setFieldValue("fieldKey", e.target.value)} placeholder="e.g., industry" className={`h-10 rounded-none font-mono text-xs ${errors.fieldKey ? "border-rose-500" : ""}`} />
                            {errors.fieldKey && <p className="text-[11px] text-rose-500">{errors.fieldKey}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Entity</Label>
                                <Select value={form.entity} onValueChange={(v: any) => setFieldValue("entity", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {ENTITIES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={form.type} onValueChange={(v: any) => setFieldValue("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {form.type === "Dropdown" && (
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Options (comma separated) <span className="text-rose-500">*</span></Label>
                                <Input value={form.optionsStr} onChange={e => setFieldValue("optionsStr", e.target.value)} placeholder="e.g., Tech, Finance, Retail" className={`h-10 rounded-none ${errors.optionsStr ? "border-rose-500" : ""}`} />
                                {errors.optionsStr && <p className="text-[11px] text-rose-500">{errors.optionsStr}</p>}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Default Value</Label>
                            <Input value={form.defaultValue} onChange={e => setFieldValue("defaultValue", e.target.value)} placeholder="Optional default" className="h-10 rounded-none" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Description</Label>
                            <textarea value={form.description} onChange={e => setFieldValue("description", e.target.value)} placeholder="Field description..." rows={3} className="w-full p-2 text-sm rounded-none border border-slate-200" />
                        </div>
                        <div className="flex items-center justify-between p-3 border border-slate-200">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">Required Field</p>
                                <p className="text-[11px] text-slate-500">Must be filled when creating records</p>
                            </div>
                            <Switch checked={form.required} onCheckedChange={(v) => setFieldValue("required", v)} className="data-[state=checked]:bg-indigo-600" />
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Create Field"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Fields</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Entity</Label>
                            <Select value={entityFilter} onValueChange={setEntityFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Entities</SelectItem>
                                    {ENTITIES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Type</Label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Types</SelectItem>
                                    {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setEntityFilter("all"); setTypeFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Field Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    {(() => {
                                        const Icon = TYPE_ICONS[selected.type]
                                        return (
                                            <div className={`h-12 w-12 rounded-none border flex items-center justify-center ${TYPE_COLORS[selected.type]}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                        )
                                    })()}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-semibold text-slate-900">{selected.label}</p>
                                            {selected.required && <Badge className="rounded-none bg-rose-50 text-rose-600 border border-rose-100 text-[10px]">Required</Badge>}
                                        </div>
                                        <p className="text-xs font-mono text-slate-500">{selected.fieldKey}</p>
                                    </div>
                                </div>
                                {selected.description && <p className="text-sm text-slate-600">{selected.description}</p>}
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">ID</p><p className="font-semibold text-slate-900">{selected.id}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${TYPE_COLORS[selected.type]}`}>{selected.type}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Entity</p><Badge className="rounded-none">{selected.entity}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Usage</p><p className="font-semibold text-slate-900">{selected.usageCount.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Default</p><p className="font-semibold text-slate-900 font-mono text-xs">{selected.defaultValue || "—"}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Created</p><p className="font-semibold text-slate-900">{selected.createdAt}</p></div>
                                </div>
                                {selected.options.length > 0 && (
                                    <div>
                                        <p className="text-[11px] text-slate-400 uppercase mb-2">Options</p>
                                        <div className="flex flex-wrap gap-1">
                                            {selected.options.map(o => <Badge key={o} className="rounded-none bg-slate-100 text-slate-700">{o}</Badge>)}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Remove
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
