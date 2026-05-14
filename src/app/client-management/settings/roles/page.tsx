"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Search, Download, Shield, Lock,
    Trash2, PencilLine, Filter, MoreVertical, Eye,
    Activity, CheckCircle2, Users, Zap, Key,
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

type Role = {
    id: string
    name: string
    description: string
    type: 'System' | 'Custom'
    permissions: string[]
    users: number
    color: string
    enabled: boolean
    createdAt: string
}

const PERMISSION_GROUPS = {
    "Contacts": ["contacts.view", "contacts.create", "contacts.edit", "contacts.delete", "contacts.export"],
    "Deals": ["deals.view", "deals.create", "deals.edit", "deals.delete"],
    "Reports": ["reports.view", "reports.create", "reports.share"],
    "Settings": ["settings.view", "settings.users", "settings.billing", "settings.integrations"],
    "Admin": ["admin.audit_log", "admin.roles", "admin.workspace"],
}

const ALL_PERMISSIONS = Object.values(PERMISSION_GROUPS).flat()

const INITIAL: Role[] = [
    { id: "RL-001", name: "Administrator", description: "Full system access including workspace and billing management.", type: "System", permissions: ALL_PERMISSIONS, users: 3, color: "rose", enabled: true, createdAt: "Jan 01, 2024" },
    { id: "RL-002", name: "Sales Manager", description: "Manage sales team, deals, and reporting.", type: "System", permissions: ["contacts.view", "contacts.create", "contacts.edit", "deals.view", "deals.create", "deals.edit", "deals.delete", "reports.view", "reports.create"], users: 5, color: "indigo", enabled: true, createdAt: "Jan 01, 2024" },
    { id: "RL-003", name: "Sales Rep", description: "Standard sales rep with contact and deal access.", type: "System", permissions: ["contacts.view", "contacts.create", "contacts.edit", "deals.view", "deals.create", "deals.edit", "reports.view"], users: 14, color: "violet", enabled: true, createdAt: "Jan 01, 2024" },
    { id: "RL-004", name: "Support Agent", description: "Customer support and ticket access.", type: "System", permissions: ["contacts.view", "contacts.edit", "reports.view"], users: 8, color: "emerald", enabled: true, createdAt: "Jan 01, 2024" },
    { id: "RL-005", name: "Read Only", description: "View-only access to all sections except admin.", type: "System", permissions: ["contacts.view", "deals.view", "reports.view"], users: 2, color: "slate", enabled: true, createdAt: "Jan 01, 2024" },
    { id: "RL-006", name: "Finance Auditor", description: "Custom role for finance team audits.", type: "Custom", permissions: ["contacts.view", "deals.view", "reports.view", "reports.create", "settings.billing"], users: 1, color: "amber", enabled: true, createdAt: "Mar 15, 2025" },
]

const COLORS = [
    { value: "indigo", class: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { value: "violet", class: "bg-violet-50 text-violet-600 border-violet-100" },
    { value: "emerald", class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { value: "rose", class: "bg-rose-50 text-rose-600 border-rose-100" },
    { value: "amber", class: "bg-amber-50 text-amber-600 border-amber-100" },
    { value: "slate", class: "bg-slate-50 text-slate-600 border-slate-100" },
    { value: "cyan", class: "bg-cyan-50 text-cyan-600 border-cyan-100" },
]

const COLOR_MAP: Record<string, string> = Object.fromEntries(COLORS.map(c => [c.value, c.class]))

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function RolesPage() {
    const router = useRouter()
    const [roles, setRoles] = React.useState<Role[]>(INITIAL)
    const [search, setSearch] = React.useState("")
    const [typeFilter, setTypeFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<Role | null>(null)

    const [form, setForm] = React.useState({
        name: "", description: "", color: "indigo", permissions: [] as string[],
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => ({
        total: roles.length,
        custom: roles.filter(r => r.type === "Custom").length,
        users: roles.reduce((a, r) => a + r.users, 0),
        permissions: ALL_PERMISSIONS.length,
    }), [roles])

    const filtered = React.useMemo(() => roles.filter(r => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
        const matchType = typeFilter === "all" || r.type === typeFilter
        return matchSearch && matchType
    }), [roles, search, typeFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const togglePermission = (perm: string) => {
        setForm(prev => ({ ...prev, permissions: prev.permissions.includes(perm) ? prev.permissions.filter(p => p !== perm) : [...prev.permissions, perm] }))
    }

    const toggleGroup = (group: string) => {
        const perms = PERMISSION_GROUPS[group as keyof typeof PERMISSION_GROUPS]
        const allSelected = perms.every(p => form.permissions.includes(p))
        setForm(prev => ({ ...prev, permissions: allSelected ? prev.permissions.filter(p => !perms.includes(p)) : Array.from(new Set([...prev.permissions, ...perms])) }))
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(3)(form.name)
        errs.description = validators.required(form.description) || validators.minLen(8)(form.description)
        if (form.permissions.length === 0) errs.permissions = "Select at least one permission"
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", description: "", color: "indigo", permissions: [] })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (r: Role) => {
        if (r.type === "System") { toast.error("System roles cannot be edited"); return }
        setEditingId(r.id)
        setForm({ name: r.name, description: r.description, color: r.color, permissions: [...r.permissions] })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setRoles(roles.map(r => r.id === editingId ? { ...r, name: form.name.trim(), description: form.description.trim(), color: form.color, permissions: form.permissions } : r))
            toast.success("Role updated")
        } else {
            const r: Role = {
                id: `RL-${String(roles.length + 1).padStart(3, "0")}`,
                name: form.name.trim(), description: form.description.trim(),
                type: "Custom", permissions: form.permissions, users: 0,
                color: form.color, enabled: true, createdAt: new Date().toLocaleDateString(),
            }
            setRoles([r, ...roles])
            toast.success(`Role "${r.name}" created`)
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        const r = roles.find(x => x.id === id)
        if (r?.type === "System") { toast.error("System roles cannot be removed"); return }
        setRoles(roles.filter(r => r.id !== id))
        toast.success("Role removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        const r = roles.find(x => x.id === id)
        if (r?.type === "System") { toast.error("System roles cannot be disabled"); return }
        setRoles(roles.map(r => r.id === id ? { ...r, enabled: !current } : r))
        toast.success(current ? "Role disabled" : "Role enabled")
    }

    const handleDuplicate = (r: Role) => {
        const copy: Role = {
            ...r,
            id: `RL-${String(roles.length + 1).padStart(3, "0")}`,
            name: `${r.name} (Copy)`,
            type: "Custom", users: 0,
            createdAt: new Date().toLocaleDateString(),
        }
        setRoles([copy, ...roles])
        toast.success("Role duplicated")
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Type", "Users", "Permissions"], ...roles.map(r => [r.id, r.name, r.type, r.users, r.permissions.length])].map(x => x.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "roles.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Roles exported")
    }

    const openDetail = (r: Role) => { setSelected(r); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Total Roles", value: String(stats.total), subtitle: `${stats.custom} custom roles`, icon: Shield, color: "indigo", trend: `+${stats.total}`, path: "/client-management/settings/roles" },
        { title: "Assigned Users", value: String(stats.users), subtitle: "Across all roles", icon: Users, color: "emerald", trend: `+${stats.users}`, path: "/client-management/settings/users" },
        { title: "Custom Roles", value: String(stats.custom), subtitle: "User-defined", icon: Key, color: "violet", trend: stats.custom ? `+${stats.custom}` : "0", path: "/client-management/settings/roles" },
        { title: "Permissions", value: String(stats.permissions), subtitle: "Available scopes", icon: Lock, color: "amber", trend: "—", path: "/client-management/settings/roles" },
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
                        Roles & <span className="text-indigo-600">Permissions</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Define access control rules for your team with custom roles and granular permissions.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />New Role
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
                                <CardTitle className="text-base font-semibold">Roles</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search roles..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3">Type</th>
                                            <th className="px-6 py-3">Users</th>
                                            <th className="px-6 py-3">Permissions</th>
                                            <th className="px-6 py-3">Enabled</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(r => (
                                            <tr key={r.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(r)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-9 w-9 rounded-none border flex items-center justify-center ${COLOR_MAP[r.color]}`}>
                                                            <Shield className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                                                            <p className="text-[11px] text-slate-500 line-clamp-1 max-w-[300px]">{r.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={`rounded-none text-[10px] ${r.type === "System" ? "bg-slate-100 text-slate-700" : "bg-indigo-50 text-indigo-700"}`}>{r.type}</Badge>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">{r.users}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Progress value={(r.permissions.length / ALL_PERMISSIONS.length) * 100} className="w-16 h-1.5" />
                                                        <span className="text-xs font-bold text-slate-900">{r.permissions.length}/{ALL_PERMISSIONS.length}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <Switch checked={r.enabled} onCheckedChange={() => handleToggle(r.id, r.enabled)} className="data-[state=checked]:bg-indigo-600" disabled={r.type === "System"} />
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(r)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleDuplicate(r)}>
                                                                <Plus className="h-4 w-4" /> Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(r)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(r.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No roles match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Permission Coverage</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Permissions assigned per role</p>
                            </div>
                            <Lock className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {roles.map((r, idx) => {
                                const progress = (r.permissions.length / ALL_PERMISSIONS.length) * 100
                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{r.name} <span className="text-slate-400 font-medium ml-2">{r.users} users</span></span>
                                            <span className="text-slate-900">{r.permissions.length} / {ALL_PERMISSIONS.length}</span>
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
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Largest Teams</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...roles].sort((a, b) => b.users - a.users).slice(0, 4).map((r, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 transition" onClick={() => openDetail(r)}>
                                    <div className="flex items-center gap-3">
                                        <div className={`h-9 w-9 rounded-none border flex items-center justify-center ${COLOR_MAP[r.color]}`}>
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{r.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{r.permissions.length} permissions</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-900">{r.users}</p>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />
                                            <span className="text-[9px] font-bold text-emerald-600">{r.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Zap className="h-4 w-4" /> RBAC Best Practices
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Apply <span className="text-indigo-600 font-bold">least privilege</span> by default.
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => router.push('/client-management/settings/users')}>
                                Manage Users
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Role" : "Create Custom Role"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Configure granular permissions.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Role Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., Finance Auditor" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Description <span className="text-rose-500">*</span></Label>
                            <textarea value={form.description} onChange={e => setField("description", e.target.value)} placeholder="Describe role responsibilities..." rows={3} className={`w-full p-2 text-sm rounded-none border ${errors.description ? "border-rose-500" : "border-slate-200"}`} />
                            {errors.description && <p className="text-[11px] text-rose-500">{errors.description}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Color</Label>
                            <div className="flex flex-wrap gap-2">
                                {COLORS.map(c => (
                                    <button key={c.value} type="button" onClick={() => setField("color", c.value)}
                                        className={`h-8 w-8 rounded-none border-2 ${c.class} ${form.color === c.value ? "ring-2 ring-offset-1 ring-indigo-500" : "border-transparent"}`}>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[12px] font-semibold">Permissions <span className="text-rose-500">*</span></Label>
                            <div className={`border rounded-none ${errors.permissions ? "border-rose-500" : "border-slate-200"}`}>
                                {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
                                    const groupCount = perms.filter(p => form.permissions.includes(p)).length
                                    const allSelected = groupCount === perms.length
                                    return (
                                        <div key={group} className="border-b last:border-0">
                                            <div className="flex items-center justify-between p-3 bg-slate-50 cursor-pointer" onClick={() => toggleGroup(group)}>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" checked={allSelected} onChange={() => { }} className="h-4 w-4" />
                                                    <span className="text-xs font-bold text-slate-700">{group}</span>
                                                </div>
                                                <Badge className="rounded-none bg-slate-100 text-slate-600 text-[10px]">{groupCount} / {perms.length}</Badge>
                                            </div>
                                            <div className="p-2 grid grid-cols-1 gap-1">
                                                {perms.map(p => (
                                                    <label key={p} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-slate-50">
                                                        <input type="checkbox" checked={form.permissions.includes(p)} onChange={() => togglePermission(p)} className="h-4 w-4" />
                                                        <span className="text-xs font-mono text-slate-700">{p}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {errors.permissions && <p className="text-[11px] text-rose-500">{errors.permissions}</p>}
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Create Role"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Roles</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Type</Label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="System">System</SelectItem>
                                    <SelectItem value="Custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setTypeFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Role Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className={`h-12 w-12 rounded-none border flex items-center justify-center ${COLOR_MAP[selected.color]}`}>
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                        <Badge className={`rounded-none text-[10px] ${selected.type === "System" ? "bg-slate-100 text-slate-700" : "bg-indigo-50 text-indigo-700"}`}>{selected.type}</Badge>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">{selected.description}</p>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">ID</p><p className="font-semibold text-slate-900">{selected.id}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Users</p><p className="font-semibold text-slate-900">{selected.users}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Permissions</p><p className="font-semibold text-slate-900">{selected.permissions.length} of {ALL_PERMISSIONS.length}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Created</p><p className="font-semibold text-slate-900">{selected.createdAt}</p></div>
                                </div>
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase mb-2">Permissions</p>
                                    <div className="flex flex-wrap gap-1">
                                        {selected.permissions.slice(0, 30).map(p => <Badge key={p} className="rounded-none bg-slate-100 text-slate-700 font-mono text-[10px]">{p}</Badge>)}
                                        {selected.permissions.length > 30 && <Badge className="rounded-none bg-indigo-50 text-indigo-700">+{selected.permissions.length - 30} more</Badge>}
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                {selected.type !== "System" && (
                                    <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                        <PencilLine className="h-4 w-4 mr-2" />Edit
                                    </Button>
                                )}
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => handleDuplicate(selected)}>
                                    <Plus className="h-4 w-4 mr-2" />Duplicate
                                </Button>
                                {selected.type !== "System" && (
                                    <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
