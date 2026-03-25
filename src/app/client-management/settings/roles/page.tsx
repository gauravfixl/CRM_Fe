"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    Download,
    Edit,
    Trash2,
    Shield,
    Lock,
    Eye,
    CheckCircle,
    Copy,
    RefreshCw,
    ShieldCheck,
    Globe,
    History,
    FileSearch,
    ChevronRight,
    Star,
    Layers,
    Cpu,
    Webhook,
    MessageSquare,
    Link2,
    Database,
    Network,
    Magnet,
    Workflow,
    Table2,
    Zap,
    Scale,
    Gavel,
    Hammer,
    ShieldAlert,
    IterationCw,
    Repeat,
    Fingerprint,
    KeyRound,
    Verified,
    Activity,
    LockKeyhole,
    Users,
    Key,
    UserCircle2,
    Menu
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Switch } from "@/shared/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { toast } from "@/shared/utils/toast"

import { useTheme } from 'next-themes'

// --- Types ---
interface Role {
    id: string;
    name: string;
    desc: string;
    users: number;
    system: boolean;
    status: string;
}

// --- Initial Mock Data ---
const INITIAL_ROLES: Role[] = [
    { id: "ROLE-01", name: "Super Admin", desc: "Unrestricted cryptographic root access and global governance", users: 2, system: true, status: "Active" },
    { id: "ROLE-02", name: "Security Architect", desc: "Governance, audit, and Iam policy management", users: 5, system: true, status: "Active" },
    { id: "ROLE-03", name: "Team Lead", desc: "Operational management of departmental resources", users: 12, system: false, status: "Active" },
    { id: "ROLE-04", name: "Standard Auditor", desc: "Read-only access to compliance and audit logs", users: 8, system: false, status: "Active" }
]

const MATRIX = [
    { module: "Iam core", perm: "Provision identities", admin: true, architect: true, lead: false },
    { module: "Iam core", perm: "Rotate root keys", admin: true, architect: false, lead: false },
    { module: "Data layer", perm: "Execute full deletion", admin: true, architect: false, lead: false },
    { module: "Analytics", perm: "View global reports", admin: true, architect: true, lead: true }
]

export default function RolesPermissions() {
    const { theme } = useTheme()
    const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES)
    const [searchQuery, setSearchQuery] = useState("")

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [formData, setFormData] = useState<Partial<Role>>({
        name: '',
        desc: '',
        status: 'Active',
        system: false,
        users: 0
    })

    // Filtered roles
    const filteredRoles = useMemo(() => {
        return roles.filter(role =>
            role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            role.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [roles, searchQuery])

    // Stats
    const stats = useMemo(() => {
        const total = roles.length;
        const system = roles.filter(r => r.system).length;
        const totalUsers = roles.reduce((acc, r) => acc + r.users, 0);

        return [
            { label: "Privilege Sets", value: `${total} Roles`, icon: Gavel, color: "blue", bg: "bg-blue-50/50 dark:bg-blue-900/10" },
            { label: "Active Nodes", value: `${roles.filter(r => r.status === 'Active').length} Verified`, icon: ShieldCheck, color: "emerald", bg: "bg-emerald-50/50 dark:bg-emerald-900/10" },
            { label: "System Core", value: `${system} Definitions`, icon: Lock, color: "indigo", bg: "bg-indigo-50/50 dark:bg-indigo-900/10" },
            { label: "Assigned Nodes", value: `${totalUsers} Users`, icon: UserCircle2, color: "orange", bg: "bg-orange-50/50 dark:bg-orange-900/10" }
        ]
    }, [roles])

    // Handlers
    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 800)), {
            loading: 'Re-indexing entitlement matrix...',
            success: msg,
            error: 'Entitlement re-indexing failed'
        })
    }

    const openCreateDialog = () => {
        setEditingRole(null)
        setFormData({
            name: '',
            desc: '',
            status: 'Active',
            system: false,
            users: 0
        })
        setIsDialogOpen(true)
    }

    const openEditDialog = (role: Role) => {
        setEditingRole(role)
        setFormData(role)
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (!formData.name || !formData.desc) {
            toast.error("Please fill in all required fields")
            return
        }

        if (editingRole) {
            setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...formData as Role } : r))
            handleAction("Role governance policy updated")
        } else {
            const newRole: Role = {
                id: `ROLE-${(roles.length + 1).toString().padStart(2, '0')}`,
                name: formData.name as string,
                desc: formData.desc as string,
                status: formData.status as string,
                system: formData.system as boolean,
                users: 0
            }
            setRoles([...roles, newRole])
            handleAction("New privilege definition provisioned")
        }
        setIsDialogOpen(false)
    }

    const handleDelete = (id: string, isSystem: boolean) => {
        if (isSystem) {
            toast.error("System roles cannot be purged from the core registry")
            return
        }
        setRoles(roles.filter(r => r.id !== id))
        toast.success("Privilege set purged from registry")
    }

    const handleDuplicate = (role: Role) => {
        const duplicated: Role = {
            ...role,
            id: `ROLE-${(roles.length + 1).toString().padStart(2, '0')}`,
            name: `${role.name} copy`,
            system: false,
            users: 0
        }
        setRoles([...roles, duplicated])
        toast.success("Role blueprint successfully replicated")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen font-outfit transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Privilege <span className="text-blue-600">Governance</span></h1>
                    <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mt-1 text-[15px]">Define RBAC (Role-Based Access Control) Hierarchies, Manage Cryptographic Permissions, and Enforce Least-Privilege Principles</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white font-bold shadow-sm gap-2" onClick={() => handleAction("Global permission matrix exported")}>
                        <FileSearch className="w-4 h-4 text-slate-400" /> Policy audit
                    </Button>
                    <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 gap-2" onClick={openCreateDialog}>
                        <LockKeyhole className="w-4 h-4" /> Define privilege
                    </Button>
                </div>
            </div>

            {/* Governance Metrics - Light colors & Adjusted height */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className={`${stat.bg} py-6 px-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all flex items-center gap-4`}>
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center border shadow-sm shrink-0 bg-white dark:bg-slate-900 ${stat.color === 'blue' ? 'border-blue-100 dark:border-blue-900/50 text-blue-600' :
                            stat.color === 'emerald' ? 'border-emerald-100 dark:border-emerald-900/50 text-emerald-600' :
                                stat.color === 'indigo' ? 'border-indigo-100 dark:border-indigo-900/50 text-indigo-600' :
                                    'border-orange-100 dark:border-orange-900/50 text-orange-600'
                            }`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-slate-400 tracking-widest leading-none mb-1.5">{stat.label}</p>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate tracking-tight">{stat.value}</h4>
                        </div>
                        <Badge variant="outline" className="font-bold text-[9px] border-white/50 dark:border-slate-700 bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 tracking-widest hidden lg:block">Immutable</Badge>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="roles" className="space-y-6">
                <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl h-14 w-fit shadow-md">
                    <TabsTrigger value="roles" className="px-8 rounded-xl data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 font-bold text-sm h-full text-slate-500 transition-all">Role library</TabsTrigger>
                    <TabsTrigger value="matrix" className="px-8 rounded-xl data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 font-bold text-sm h-full text-slate-500 transition-all">Entitlement matrix</TabsTrigger>
                </TabsList>

                <TabsContent value="roles" className="space-y-6">
                    {/* Search Bar */}
                    <div className="relative group max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-4 h-4" />
                        <Input
                            placeholder="Filter privilege registry..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 bg-white dark:bg-slate-900 dark:text-white border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium focus:ring-1 focus:ring-blue-500 shadow-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {filteredRoles.length > 0 ? (
                            filteredRoles.map((r, idx) => (
                                <Card key={idx} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:shadow-xl transition-all border-l-4 border-l-blue-600">
                                    <div className="flex items-center gap-6 flex-1">
                                        <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                                            <Hammer className="w-8 h-8 text-blue-600 group-hover:rotate-45 transition-transform" />
                                        </div>
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-md font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors leading-none">{r.name}</h4>
                                                <Badge className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border-0 tracking-widest ${r.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>{r.status}</Badge>
                                                {r.system && <Badge className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border-0 tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400">Core system</Badge>}
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-xl group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors leading-relaxed">{r.desc}</p>
                                            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-slate-400 tracking-widest pt-1">
                                                <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-100 dark:border-slate-700 normal-case"><Users className="w-3.5 h-3.5 text-blue-500" /> Registry: {r.users} Users</span>
                                                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-500" /> Stability: High-assurance</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <Button
                                            variant="outline"
                                            className="h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-[10px] gap-2 bg-white dark:bg-slate-900 dark:text-white"
                                            onClick={() => handleDuplicate(r)}
                                        >
                                            <Copy className="w-3.5 h-3.5" /> Replicate
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-11 w-11 text-slate-400 hover:text-blue-600 rounded-xl"
                                            onClick={() => openEditDialog(r)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-11 w-11 text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                            onClick={() => handleDelete(r.id, r.system)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                <Gavel className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-slate-400">No privilege definitions found</h3>
                                <p className="text-sm text-slate-400 mt-1">Refine your search parameters or provision a new role</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="matrix">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden bg-white dark:bg-slate-900 border dark:border-slate-800">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-indigo-50/40 dark:bg-indigo-900/10 text-slate-900 dark:text-white flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold tracking-widest flex items-center gap-2">
                                <Shield className="w-4 h-4 text-indigo-500" />
                                Global Entitlement Cross-Section
                            </CardTitle>
                            <Badge variant="outline" className="border-indigo-200 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold tracking-widest bg-white/80 dark:bg-slate-800">Immutable mapping</Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono transition-colors">
                                {MATRIX.map((m, idx) => (
                                    <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center gap-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all overflow-x-auto group">
                                        <div className="w-40 space-y-1">
                                            <p className="text-[9px] font-bold text-slate-400 tracking-widest">Module</p>
                                            <p className="text-xs font-bold text-slate-900 dark:text-slate-200">{m.module}</p>
                                        </div>
                                        <div className="flex-1 space-y-1 min-w-[200px]">
                                            <p className="text-[9px] font-bold text-slate-400 tracking-widest">Entitlement Node</p>
                                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{m.perm}</p>
                                        </div>
                                        <div className="flex items-center gap-12 shrink-0 pr-4">
                                            {[
                                                { label: "Admin", val: m.admin, color: "text-blue-600" },
                                                { label: "Architect", val: m.architect, color: "text-indigo-600" },
                                                { label: "Lead", val: m.lead, color: "text-emerald-600" }
                                            ].map((r, i) => (
                                                <div key={i} className="flex flex-col items-center gap-2 w-12 text-center">
                                                    <p className="text-[8px] font-bold text-slate-400 tracking-widest">{r.label}</p>
                                                    {r.val ? (
                                                        <div className="h-6 w-6 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                                                            <CheckCircle className="w-4 h-4 text-emerald-500 shadow-sm" />
                                                        </div>
                                                    ) : (
                                                        <div className="h-6 w-6 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                                                            <ShieldAlert className="w-4 h-4 text-slate-200 dark:text-slate-700" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-xl ml-auto transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Role upsert dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl font-outfit dark:bg-slate-950 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                            {editingRole ? "Configure privilege set" : "Define new privilege"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-400 tracking-widest">Role Designation</Label>
                            <Input
                                placeholder="e.g. Lead Developer"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="rounded-xl h-11 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-400 tracking-widest">Functional Description</Label>
                            <Input
                                placeholder="Define the operational boundaries and access level..."
                                value={formData.desc}
                                onChange={e => setFormData({ ...formData, desc: e.target.value })}
                                className="rounded-xl h-11 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-400 tracking-widest">Initial Status</Label>
                                <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                                    <SelectTrigger className="rounded-xl h-11 dark:bg-slate-900 dark:border-slate-800 dark:text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Suspended">Suspended</SelectItem>
                                        <SelectItem value="Archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col justify-end">
                                <div className="flex items-center justify-between p-2 pb-1 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <div className="space-y-0.5">
                                        <Label className="text-[10px] font-bold text-slate-900 dark:text-white">Core node</Label>
                                    </div>
                                    <Switch
                                        checked={formData.system}
                                        onCheckedChange={checked => setFormData({ ...formData, system: checked })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-11 px-6 font-bold dark:border-slate-800 dark:text-white">Discard</Button>
                        <Button onClick={handleSave} className="rounded-xl h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20">
                            {editingRole ? "Re-index policy" : "Seal privilege"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
