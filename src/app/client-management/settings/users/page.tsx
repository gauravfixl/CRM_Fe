"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Plus, Search, RefreshCw, Download, Users,
    Trash2, PencilLine, Filter, MoreVertical, Eye,
    Activity, CheckCircle2, AlertCircle, Mail, Zap, UserPlus,
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

type User = {
    id: string
    name: string
    email: string
    role: 'Admin' | 'Manager' | 'Sales Rep' | 'Support' | 'Viewer'
    department: 'Sales' | 'Support' | 'Marketing' | 'Engineering' | 'Finance'
    status: 'Active' | 'Invited' | 'Suspended'
    enabled: boolean
    lastActive: string
    joinedDate: string
    phone: string
}

const ROLES: User['role'][] = ["Admin", "Manager", "Sales Rep", "Support", "Viewer"]
const DEPARTMENTS: User['department'][] = ["Sales", "Support", "Marketing", "Engineering", "Finance"]

const ROLE_COLORS: Record<string, string> = {
    Admin: "bg-rose-50 text-rose-600 border-rose-100",
    Manager: "bg-violet-50 text-violet-600 border-violet-100",
    "Sales Rep": "bg-indigo-50 text-indigo-600 border-indigo-100",
    Support: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Viewer: "bg-slate-50 text-slate-600 border-slate-100",
}

const INITIAL: User[] = [
    { id: "US-001", name: "Sarah Johnson", email: "sarah.j@fixl.io", role: "Admin", department: "Engineering", status: "Active", enabled: true, lastActive: "5 min ago", joinedDate: "Jan 15, 2024", phone: "+1 555 0184" },
    { id: "US-002", name: "Marcus Chen", email: "marcus.c@fixl.io", role: "Manager", department: "Sales", status: "Active", enabled: true, lastActive: "12 min ago", joinedDate: "Mar 02, 2024", phone: "+1 555 0220" },
    { id: "US-003", name: "Elena Rodriguez", email: "elena.r@fixl.io", role: "Sales Rep", department: "Sales", status: "Active", enabled: true, lastActive: "1 hr ago", joinedDate: "Apr 11, 2024", phone: "+1 555 0341" },
    { id: "US-004", name: "James Patel", email: "james.p@fixl.io", role: "Support", department: "Support", status: "Active", enabled: true, lastActive: "2 hr ago", joinedDate: "May 22, 2024", phone: "+1 555 0408" },
    { id: "US-005", name: "Olivia Brooks", email: "olivia.b@fixl.io", role: "Manager", department: "Marketing", status: "Active", enabled: true, lastActive: "Yesterday", joinedDate: "Jun 30, 2024", phone: "+1 555 0512" },
    { id: "US-006", name: "Daniel Kim", email: "daniel.k@fixl.io", role: "Sales Rep", department: "Sales", status: "Invited", enabled: false, lastActive: "—", joinedDate: "2 days ago", phone: "+1 555 0633" },
    { id: "US-007", name: "Priya Verma", email: "priya.v@fixl.io", role: "Viewer", department: "Finance", status: "Suspended", enabled: false, lastActive: "2 weeks ago", joinedDate: "Aug 10, 2024", phone: "+1 555 0721" },
]

const validators = {
    required: (v: string) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    email: (v: string) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : "",
}

export default function UsersPage() {
    const router = useRouter()
    const [users, setUsers] = React.useState<User[]>(INITIAL)
    const [search, setSearch] = React.useState("")
    const [roleFilter, setRoleFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [selected, setSelected] = React.useState<User | null>(null)

    const [form, setForm] = React.useState({
        name: "", email: "", role: "Sales Rep" as User['role'], department: "Sales" as User['department'], phone: "", status: "Active" as User['status'],
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const stats = React.useMemo(() => ({
        total: users.length,
        active: users.filter(u => u.enabled).length,
        admins: users.filter(u => u.role === "Admin").length,
        pending: users.filter(u => u.status === "Invited").length,
    }), [users])

    const filtered = React.useMemo(() => users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
        const matchRole = roleFilter === "all" || u.role === roleFilter
        return matchSearch && matchRole
    }), [users, search, roleFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(2)(form.name)
        errs.email = validators.required(form.email) || validators.email(form.email)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", email: "", role: "Sales Rep", department: "Sales", phone: "", status: "Invited" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (u: User) => {
        setEditingId(u.id)
        setForm({ name: u.name, email: u.email, role: u.role, department: u.department, phone: u.phone, status: u.status })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        if (editingId) {
            setUsers(users.map(u => u.id === editingId ? { ...u, name: form.name.trim(), email: form.email.trim(), role: form.role, department: form.department, phone: form.phone, status: form.status } : u))
            toast.success("User updated")
        } else {
            const u: User = {
                id: `US-${String(users.length + 1).padStart(3, "0")}`,
                name: form.name.trim(), email: form.email.trim(), role: form.role,
                department: form.department, status: form.status,
                enabled: form.status === "Active", lastActive: "—",
                joinedDate: new Date().toLocaleDateString(), phone: form.phone,
            }
            setUsers([u, ...users])
            toast.success(`Invitation sent to ${u.email}`)
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: string) => {
        setUsers(users.filter(u => u.id !== id))
        toast.success("User removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setUsers(users.map(u => u.id === id ? { ...u, enabled: !current, status: !current ? "Active" : "Suspended" } : u))
        toast.success(current ? "User suspended" : "User activated")
    }

    const handleResendInvite = (u: User) => {
        toast.success(`Invitation resent to ${u.email}`)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Email", "Role", "Department", "Status", "Joined"], ...users.map(u => [u.id, u.name, u.email, u.role, u.department, u.status, u.joinedDate])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "users.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Users exported")
    }

    const openDetail = (u: User) => { setSelected(u); setIsDetailOpen(true) }

    const kpiCards = [
        { title: "Total Users", value: String(stats.total), subtitle: "In workspace", icon: Users, color: "indigo", trend: `+${stats.total}`, path: "/client-management/settings/users" },
        { title: "Active Users", value: String(stats.active), subtitle: "Currently active", icon: Activity, color: "emerald", trend: `+${stats.active}`, path: "/client-management/settings/users" },
        { title: "Admins", value: String(stats.admins), subtitle: "Workspace owners", icon: CheckCircle2, color: "rose", trend: `${stats.admins}`, path: "/client-management/settings/roles" },
        { title: "Pending Invites", value: String(stats.pending), subtitle: "Not yet accepted", icon: Mail, color: "amber", trend: stats.pending ? "Pending" : "Clear", path: "/client-management/settings/users" },
    ]
    const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
        rose: { bg: "bg-gradient-to-br from-rose-50 to-rose-100/50", border: "border-rose-200/50", text: "text-rose-600", iconBg: "bg-rose-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        User <span className="text-indigo-600">Management</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Invite team members, assign roles, and manage workspace access.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button variant="outline" className="rounded-none h-10" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />Export
                    </Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <UserPlus className="h-4 w-4 mr-2" />Invite User
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
                                <CardTitle className="text-base font-semibold">Workspace Users</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length}</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">User</th>
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3">Department</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Enabled</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map(u => (
                                            <tr key={u.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(u)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-600">
                                                            {u.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                                                            <p className="text-[11px] text-slate-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${ROLE_COLORS[u.role]}`}>{u.role}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-700">{u.department}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${u.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : u.status === "Invited" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>{u.status}</span>
                                                </td>
                                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                    <Switch checked={u.enabled} onCheckedChange={() => handleToggle(u.id, u.enabled)} className="data-[state=checked]:bg-indigo-600" />
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            {u.status === "Invited" && (
                                                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleResendInvite(u)}>
                                                                    <Mail className="h-4 w-4" /> Resend Invite
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(u)}>
                                                                <PencilLine className="h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(u)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(u.id)}>
                                                                <Trash2 className="h-4 w-4" /> Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No users match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-semibold">Role Distribution</CardTitle>
                                <p className="text-sm text-slate-500 mt-1">Users per role</p>
                            </div>
                            <Users className="h-5 w-5 text-slate-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {ROLES.map((r, idx) => {
                                const list = users.filter(u => u.role === r)
                                const progress = users.length ? (list.length / users.length) * 100 : 0
                                return (
                                    <div key={idx} className="space-y-2 cursor-pointer hover:bg-slate-50 p-2 -m-2 transition" onClick={() => setRoleFilter(r)}>
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-slate-700">{r} <span className="text-slate-400 font-medium ml-2">{list.length}</span></span>
                                            <span className="text-slate-900">{Math.round(progress)}%</span>
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
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {users.slice(0, 4).map((u, idx) => (
                                <div key={idx} className="flex items-center justify-between cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 transition" onClick={() => openDetail(u)}>
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                            {u.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-none">{u.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1">{u.lastActive}</p>
                                        </div>
                                    </div>
                                    <Badge className={`rounded-none text-[10px] border ${ROLE_COLORS[u.role]}`}>{u.role}</Badge>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 rounded-none mt-3" onClick={() => router.push('/client-management/settings/roles')}>
                                Manage Roles & Permissions
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-indigo-100 bg-indigo-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-indigo-600 tracking-wider flex items-center gap-2 uppercase">
                                <Zap className="h-4 w-4" /> Quick Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white border border-indigo-100 rounded-none">
                                <p className="text-[11px] text-slate-600">
                                    Use <span className="text-indigo-600 font-bold">groups</span> for permission inheritance.
                                </p>
                            </div>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={() => router.push('/client-management/settings/fields')}>
                                Customize Fields
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-indigo-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit User" : "Invite User"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">{editingId ? "Update user details and access." : "Send an invitation to a new team member."}</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Full Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g., Sarah Johnson" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Email <span className="text-rose-500">*</span></Label>
                            <Input type="email" value={form.email} onChange={e => setField("email", e.target.value)} placeholder="sarah.j@example.com" className={`h-10 rounded-none ${errors.email ? "border-rose-500" : ""}`} />
                            {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Role</Label>
                                <Select value={form.role} onValueChange={(v: any) => setField("role", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Department</Label>
                                <Select value={form.department} onValueChange={(v: any) => setField("department", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Phone</Label>
                            <Input value={form.phone} onChange={e => setField("phone", e.target.value)} placeholder="+1 555 0000" className="h-10 rounded-none" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Invited">Invited</SelectItem>
                                    <SelectItem value="Suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Send Invite"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Users</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Role</Label>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setRoleFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">User Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-14 w-14 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-base font-bold text-indigo-600">
                                        {selected.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                        <p className="text-sm text-slate-500">{selected.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">ID</p><p className="font-semibold text-slate-900">{selected.id}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Role</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${ROLE_COLORS[selected.role]}`}>{selected.role}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`px-2 py-0.5 rounded-none text-[11px] font-semibold border ${selected.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : selected.status === "Invited" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Department</p><p className="font-semibold text-slate-900">{selected.department}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Phone</p><p className="font-semibold text-slate-900">{selected.phone || "—"}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Last Active</p><p className="font-semibold text-slate-900">{selected.lastActive}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Joined</p><p className="font-semibold text-slate-900">{selected.joinedDate}</p></div>
                                </div>
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
