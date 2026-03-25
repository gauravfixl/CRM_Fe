"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    Filter,
    Download,
    Edit,
    Trash2,
    Mail,
    Lock,
    UserCheck,
    UserX,
    Users,
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
    UserCircle2,
    Verified,
    Check
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Switch } from "@/shared/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { toast } from "@/shared/utils/toast"

import { useTheme } from 'next-themes'

// --- Types ---
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    team: string;
    status: string;
    mfa: boolean;
}

// --- Initial Mock Data ---
const INITIAL_USERS: User[] = [
    { id: "USR-01", name: "John Doe", email: "john@fixl.io", role: "Super Admin", team: "Core Engineering", status: "Active", mfa: true },
    { id: "USR-02", name: "Sarah Smith", email: "sarah@fixl.io", role: "Security Architect", team: "Infrastructure", status: "Active", mfa: true },
    { id: "USR-03", name: "Alex Wong", email: "alex@fixl.io", role: "Support Lead", team: "Customer Success", status: "Active", mfa: false },
    { id: "USR-04", name: "Maria Garcia", email: "maria@fixl.io", role: "Product Manager", team: "Product", status: "Suspended", mfa: true }
]

export default function UserManagement() {
    const { theme } = useTheme()
    const [users, setUsers] = useState<User[]>(INITIAL_USERS)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        email: '',
        role: 'Standard user',
        team: 'Internal',
        status: 'Active',
        mfa: false
    })

    // Filtered users
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        })
    }, [users, searchQuery, statusFilter])

    // Stats
    const stats = useMemo(() => {
        const total = users.length;
        const active = users.filter(u => u.status === 'Active').length;
        const mfa = users.filter(u => u.mfa).length;
        const mfaPercent = total > 0 ? ((mfa / total) * 100).toFixed(1) : "0";
        const pending = users.filter(u => u.status === 'Pending').length;

        return [
            { label: "Total Identities", value: `${total} Users`, icon: Users, color: "blue", bg: "bg-blue-50/50 dark:bg-blue-900/10" },
            { label: "Active Sessions", value: `${active} Nodes`, icon: UserCheck, color: "emerald", bg: "bg-emerald-50/50 dark:bg-emerald-900/10" },
            { label: "MFA Compliance", value: `${mfaPercent}%`, icon: Fingerprint, color: "indigo", bg: "bg-indigo-50/50 dark:bg-indigo-900/10" },
            { label: "Provisioning", value: `${pending} Pending`, icon: Mail, color: "orange", bg: "bg-orange-50/50 dark:bg-orange-900/10" }
        ]
    }, [users])

    // Handlers
    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 800)), {
            loading: 'Synchronizing global Iam policies...',
            success: msg,
            error: 'Iam synchronization failed'
        })
    }

    const openCreateDialog = () => {
        setEditingUser(null)
        setFormData({
            name: '',
            email: '',
            role: 'Standard user',
            team: 'Internal',
            status: 'Active',
            mfa: false
        })
        setIsDialogOpen(true)
    }

    const openEditDialog = (user: User) => {
        setEditingUser(user)
        setFormData(user)
        setIsDialogOpen(true)
    }

    const handleSave = () => {
        if (!formData.name || !formData.email) {
            toast.error("Please fill in all required fields")
            return
        }

        if (editingUser) {
            // Update
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData as User } : u))
            handleAction("Identity entitlements updated")
        } else {
            // Create
            const newUser: User = {
                id: `USR-${(users.length + 1).toString().padStart(2, '0')}`,
                name: formData.name as string,
                email: formData.email as string,
                role: formData.role as string,
                team: formData.team as string,
                status: formData.status as string,
                mfa: formData.mfa as boolean
            }
            setUsers([...users, newUser])
            handleAction("New identity successfully provisioned")
        }
        setIsDialogOpen(false)
    }

    const handleDelete = (id: string) => {
        setUsers(users.filter(u => u.id !== id))
        toast.success("Identity purged from global registry")
    }

    const toggleMfa = (id: string) => {
        setUsers(users.map(u => u.id === id ? { ...u, mfa: !u.mfa } : u))
        toast.success("Mfa status updated asynchronously")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-screen font-outfit transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Identity & <span className="text-blue-600">Access</span></h1>
                    <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mt-1 text-[15px]">Govern organizational hierarchies, provision granular entitlements, and enforce high-assurance Mfa protocols</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white font-bold shadow-sm gap-2" onClick={() => handleAction("Global access audit report generated")}>
                        <FileSearch className="w-4 h-4 text-slate-400" /> Access audit
                    </Button>
                    <Button className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 gap-2" onClick={openCreateDialog}>
                        <Plus className="w-4 h-4" /> Provision identity
                    </Button>
                </div>
            </div>

            {/* Iam metrics - Reduced height and lighter colors */}
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
                        <Badge variant="outline" className="font-bold text-[9px] border-white/50 dark:border-slate-700 bg-white/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 tracking-widest hidden lg:block">Secured</Badge>
                    </Card>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors w-4 h-4" />
                    <Input
                        placeholder="Filter global identity registry..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-12 bg-white dark:bg-slate-900 dark:text-white border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-medium focus:ring-1 focus:ring-blue-500 shadow-sm"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48 h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white font-bold text-xs shadow-sm">
                        <SelectValue placeholder="Status: All" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                        <SelectItem value="all">Status: All</SelectItem>
                        <SelectItem value="Active">Status: Active</SelectItem>
                        <SelectItem value="Suspended">Status: Suspended</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Identity inventory */}
            <div className="grid grid-cols-1 gap-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((u, idx) => (
                        <Card key={idx} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:shadow-xl transition-all border-l-4 border-l-blue-600">
                            <div className="flex items-center gap-6 flex-1">
                                <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
                                    <UserCircle2 className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="text-md font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors leading-none">{u.name}</h4>
                                        <Badge className={`text-[9px] font-black px-2.5 py-0.5 rounded-full border-0 tracking-widest ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>{u.status}</Badge>
                                        <Badge className="text-[9px] font-black px-2.5 py-0.5 rounded-full border-0 tracking-widest bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">{u.role}</Badge>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-slate-400 tracking-widest">
                                        <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-300 lowercase"><Mail className="w-3.5 h-3.5" /> {u.email}</span>
                                        <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Node: {u.team}</span>
                                        {u.mfa && (
                                            <span className="flex items-center gap-1.5 text-blue-600 font-black tracking-widest">
                                                <Verified className="w-3.5 h-3.5" /> Mfa enforced
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button
                                    variant="outline"
                                    className="h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 font-bold text-[10px] gap-2 bg-white dark:bg-slate-900 dark:text-white"
                                    onClick={() => handleAction(`Password reset sequence for ${u.name} initialized`)}
                                >
                                    <KeyRound className="w-3.5 h-3.5" /> Reset entitlements
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-11 w-11 text-slate-400 hover:text-blue-600 rounded-xl"
                                    onClick={() => openEditDialog(u)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-11 w-11 text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                    onClick={() => handleDelete(u.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <Users className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-400">No identities found in global registry</h3>
                        <p className="text-sm text-slate-400 mt-1">Adjust your filters or provision a new identity node</p>
                    </div>
                )}
            </div>

            {/* Upsert dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md rounded-3xl font-outfit dark:bg-slate-950 dark:border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                            {editingUser ? "Configure identity" : "Provision new identity"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-black text-slate-400 tracking-widest">Full Name</Label>
                            <Input
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="rounded-xl h-11 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-black text-slate-400 tracking-widest">Email Address</Label>
                            <Input
                                placeholder="john@company.com"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="rounded-xl h-11 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 tracking-widest">Role</Label>
                                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                                    <SelectTrigger className="rounded-xl h-11 dark:bg-slate-900 dark:border-slate-800 dark:text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                                        <SelectItem value="Super Admin">Super admin</SelectItem>
                                        <SelectItem value="Security Architect">Security architect</SelectItem>
                                        <SelectItem value="Standard user">Standard user</SelectItem>
                                        <SelectItem value="Support Lead">Support lead</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black text-slate-400 tracking-widest">Team</Label>
                                <Input
                                    placeholder="e.g. Infrastructure"
                                    value={formData.team}
                                    onChange={e => setFormData({ ...formData, team: e.target.value })}
                                    className="rounded-xl h-11 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold text-slate-900 dark:text-white">Mfa authentication</Label>
                                <p className="text-xs text-slate-500">Enforce high-assurance security</p>
                            </div>
                            <Switch
                                checked={formData.mfa}
                                onCheckedChange={checked => setFormData({ ...formData, mfa: checked })}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-11 px-6 font-bold dark:border-slate-800 dark:text-white">Cancel</Button>
                        <Button onClick={handleSave} className="rounded-xl h-11 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20">
                            {editingUser ? "Sync entropy" : "Provision node"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
