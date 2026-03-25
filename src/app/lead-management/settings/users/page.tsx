"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Users2, UserPlus, Search, Shield, Key, UserCheck,
    UserX, Users, ArrowUpRight, ShieldCheck, UserCog,
    Lock, Trash2, MoreHorizontal, Mail, X, Eye, EyeOff,
    CheckCircle2, ChevronLeft, ShieldAlert, Fingerprint,
    History, Zap, Globe, MessageSquare, Briefcase
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"

type UserRole = "Super Admin" | "Sales Manager" | "Sales Rep" | "Support Admin"
type UserStatus = "Active" | "Away" | "Disabled"

interface UserEntry {
    id: string
    name: string
    email: string
    role: UserRole
    team: string
    status: UserStatus
    lastLogin: string
    twoFa: boolean
}

const INITIAL_USERS: UserEntry[] = [
    { id: "U-101", name: "David Brown", email: "david@fixl.ai", role: "Super Admin", team: "Leadership", status: "Active", lastLogin: "2m ago", twoFa: true },
    { id: "U-102", name: "Sarah Miller", email: "sarah.m@fixl.ai", role: "Sales Manager", team: "Enterprise Sales", status: "Active", lastLogin: "14h ago", twoFa: true },
    { id: "U-103", name: "James Wilson", email: "james.w@fixl.ai", role: "Sales Rep", team: "Outbound", status: "Active", lastLogin: "1 day ago", twoFa: false },
    { id: "U-104", name: "Emily Davis", email: "emily.d@fixl.ai", role: "Sales Rep", team: "Inbound", status: "Away", lastLogin: "3 days ago", twoFa: false },
    { id: "U-105", name: "Michael Cheng", email: "michael@fixl.ai", role: "Support Admin", team: "Operations", status: "Disabled", lastLogin: "Mar 12", twoFa: false },
]

const ROLES = [
    { name: "Super Admin", count: 2, access: "Full Root Control", color: "text-rose-600", bg: "bg-rose-50" },
    { name: "Sales Manager", count: 4, access: "Team Oversight", color: "text-indigo-600", bg: "bg-indigo-50" },
    { name: "Sales Rep", count: 12, access: "Pipeline Restricted", color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Support Admin", count: 1, access: "Ops Maintenance", color: "text-amber-600", bg: "bg-amber-50" },
]

const STAT_CARDS = [
    { label: "Active Nodes", value: "24 Users", sub: "2 seats available", icon: UserCheck, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
    { label: "Root Access", value: "8 Roles", sub: "Custom ACL sets", icon: Fingerprint, bg: "bg-indigo-50/10", text: "text-indigo-600", border: "border-indigo-100/20" },
    { label: "Team Structure", value: "4 Nodes", sub: "Functional units", icon: Users, bg: "bg-blue-50/10", text: "text-blue-600", border: "border-blue-100/20" },
    { label: "Active Ratio", value: "92%", sub: "Live engagement", icon: Zap, bg: "bg-amber-50/10", text: "text-amber-600", border: "border-amber-100/20" },
]

export default function UsersAccessPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [users, setUsers] = useState<UserEntry[]>(INITIAL_USERS)
    const [search, setSearch] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [showResetModal, setShowResetModal] = useState<UserEntry | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<UserEntry | null>(null)
    const [resetPassVisible, setResetPassVisible] = useState(false)
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "Sales Rep" as UserRole, team: "Outbound" })
    const [newPassword, setNewPassword] = useState("")

    useEffect(() => { setIsClient(true) }, [])

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email) {
            toast({ title: "Infrastructure Error", description: "Identity parameters cannot be null." })
            return
        }
        const newEntry: UserEntry = {
            id: `U-${Date.now()}`,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            team: newUser.team,
            status: "Active",
            lastLogin: "Just now",
            twoFa: false,
        }
        setUsers([newEntry, ...users])
        setShowModal(false)
        setNewUser({ name: "", email: "", role: "Sales Rep", team: "Outbound" })
        toast({ title: "✅ User Provisioned", description: `Invitation protocol initiated for ${newEntry.name}.` })
    }

    const handleToggleStatus = (id: string) => {
        setUsers(users.map(u => {
            if (u.id !== id) return u
            const next = u.status === "Active" ? "Disabled" : "Active"
            toast({ title: `Account ${next}`, description: `Auth tokens for ${u.name} have been ${next === 'Active' ? 'restored' : 'voided'}.` })
            return { ...u, status: next as UserStatus }
        }))
    }

    const handleDelete = (user: UserEntry) => {
        setUsers(users.filter(u => u.id !== user.id))
        setShowDeleteConfirm(null)
        toast({ title: "Identity Purged", description: `${user.name}'s data bridge has been strictly terminated.` })
    }

    const handleResetPassword = () => {
        if (!newPassword) { toast({ title: "Security Warning", description: "Password entropy must be defined." }); return }
        setShowResetModal(null)
        setNewPassword("")
        toast({ title: "✅ Credentials Reminted", description: `New authentication hash active for ${showResetModal?.name}.` })
    }

    const handlePermissionAudit = () => {
        toast({ title: "🔍 Deep Compliance Scan", description: "Auditing all ACL sets across primary and secondary nodes..." })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-indigo-600">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                User Directory & ACL
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Corporate authentication hub. Manage personnel, assign high-fidelity roles, and configure team-based access protocols.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handlePermissionAudit} className="h-11 border-slate-200 bg-white shadow-sm text-slate-600 font-bold text-[11px] px-6 uppercase tracking-widest rounded-xl hover:bg-slate-50">
                        <ShieldAlert className="h-4 w-4 mr-2 text-slate-400" /> Compliance Audit
                    </Button>
                    <Button onClick={() => setShowModal(true)} className="h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 shadow-indigo-100 shadow-lg border-none uppercase text-[11px] tracking-widest rounded-xl">
                        <UserPlus className="h-4 w-4 mr-2" /> Provision Member
                    </Button>
                </div>
            </div>

            {/* Tactical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-[28px] p-6 shadow-none space-y-4 hover:translate-y-[-4px] transition-all cursor-default group`}>
                        <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center ${s.text} shadow-sm border border-slate-100/50 group-hover:scale-110 transition-transform`}>
                            <s.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[22px] font-semibold ${s.text}`}>{s.value}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Users Directory */}
                <Card className="lg:col-span-9 border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white overflow-hidden p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 px-2">
                        <div className="space-y-1">
                            <h3 className="text-[17px] font-semibold text-slate-900">Active Infrastructure Nodes</h3>
                            <p className="text-[12px] text-slate-500 font-medium whitespace-nowrap">Propagating real-time permissions across {filtered.length} active directory entries.</p>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Scan by name or email hash..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-11 h-11 rounded-2xl border-slate-100 bg-slate-50/50 text-[13px] font-bold focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-50 hover:bg-transparent">
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-5">Personnel Member</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role & Team Hub</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Auth (2FA)</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Protocol</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Last Pulse</TableHead>
                                    <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((u) => (
                                    <TableRow key={u.id} className="border-slate-50 hover:bg-slate-50/60 transition-colors group">
                                        <TableCell>
                                            <div className="flex items-center gap-4 py-1">
                                                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center font-black text-white text-[13px] shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
                                                    {u.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[14px] font-bold text-slate-900 leading-none">{u.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium italic">{u.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                                                    <span className="text-[13px] font-semibold text-slate-700">{u.role}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-medium tracking-wide ml-4">{u.team}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {u.twoFa
                                                ? <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] h-6 px-3 font-black uppercase tracking-wider rounded-xl">Certified</Badge>
                                                : <Badge className="bg-slate-50 text-slate-400 border border-slate-100 text-[10px] h-6 px-3 font-black uppercase tracking-wider rounded-xl">Insecure</Badge>
                                            }
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={`border border-transparent h-6 px-3 text-[10px] font-black uppercase tracking-wider rounded-xl ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : u.status === 'Disabled' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-600'}`}>
                                                {u.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[13px] font-semibold text-slate-900 tracking-tight">{u.lastLogin}</span>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Global Node</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                                                        <MoreHorizontal size={18} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-[20px] p-2 border-slate-100 shadow-2xl animate-in zoom-in-95 duration-200">
                                                    <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Controls</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => setShowResetModal(u)} className="rounded-xl px-3 py-2.5 text-[13px] font-bold gap-3 cursor-pointer hover:bg-slate-50 mb-1 active:scale-95 transition-all">
                                                        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600"><Lock size={15} /></div> Remint Credentials
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleToggleStatus(u.id)} className="rounded-xl px-3 py-2.5 text-[13px] font-bold gap-3 cursor-pointer hover:bg-slate-50 mb-1 active:scale-95 transition-all">
                                                        {u.status === 'Active'
                                                            ? <><div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500"><UserX size={15} /></div> Void Session</>
                                                            : <><div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500"><UserCheck size={15} /></div> Restore Auth</>
                                                        }
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-[13px] font-bold gap-3 cursor-pointer hover:bg-slate-50 mb-1 active:scale-95 transition-all">
                                                        <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Mail size={15} /></div> Dispatch Invite
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                    <DropdownMenuItem onClick={() => setShowDeleteConfirm(u)} className="rounded-xl px-3 py-2.5 text-[13px] font-bold text-rose-600 gap-3 cursor-pointer hover:bg-rose-50 active:scale-95 transition-all">
                                                        <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600"><Trash2 size={15} /></div> Purge Entity
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* ACL Hub Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-slate-950 text-white p-8 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Shield size={140} className="text-white" />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <h4 className="text-[17px] font-black uppercase tracking-tight flex items-center gap-3">
                                <History className="h-5 w-5 text-indigo-400" /> ACL Definitions
                            </h4>
                            <div className="space-y-3">
                                {ROLES.map((r, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/item">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[14px] font-bold group-hover/item:text-indigo-300 transition-colors">{r.name}</span>
                                            <Badge className="bg-white/10 text-white border-none text-[10px] font-black h-5 px-2">{r.count}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Lock size={10} className="text-slate-500" />
                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{r.access}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button onClick={() => toast({ title: "ACL Architect", description: "Configuring global permission trees..." })}
                            className="w-full h-12 bg-white text-slate-950 hover:bg-slate-100 font-black rounded-2xl border-none uppercase text-[11px] tracking-widest relative z-10 shadow-xl shadow-slate-900/40">
                            Manage Framework
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-emerald-100 rounded-[32px] bg-emerald-50/50 p-8 space-y-6 border-l-[5px] border-l-emerald-500">
                        <div className="flex items-center gap-3 text-emerald-600">
                            <ShieldCheck size={24} />
                            <h4 className="text-[14px] font-black uppercase tracking-tight">Security Protocol</h4>
                        </div>
                        <p className="text-[12px] text-slate-600 leading-relaxed font-medium italic">
                            "System wide analysis complete. <strong>{INITIAL_USERS.filter(u => !u.twoFa).length}</strong> accounts are currently operating without Multi-Factor Authentication hashes."
                        </p>
                        <Button size="sm" onClick={() => toast({ title: "2FA Protocol Engaged", description: "Broadcasting MFA setup requests to vulnerable nodes..." })}
                            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black border-none text-[11px] uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-200">
                            Enforce MFA Now
                        </Button>
                    </Card>

                    {/* Quick Access Card */}
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white p-8 space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100"><Briefcase size={20} /></div>
                            <h4 className="text-[14px] font-black text-slate-900 uppercase">Team Hierarchy</h4>
                        </div>
                        <div className="space-y-2">
                            {['Leadership HQ', 'Enterprise Sales', 'Regional Operations'].map((team, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[12px] p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group/team">
                                    <span className="font-bold text-slate-600 group-hover/team:text-indigo-600">{team}</span>
                                    <ArrowUpRight size={14} className="text-slate-300 group-hover/team:text-indigo-500" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modals - Same functional logic, enhanced visual identity */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="text-center space-y-3">
                            <div className="h-16 w-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm border border-indigo-100">
                                <UserPlus size={32} />
                            </div>
                            <h2 className="text-[26px] font-black text-slate-900 tracking-tight uppercase leading-none">Invite Personnel</h2>
                            <p className="text-[13px] text-slate-500 font-medium italic">"Initializing secure invitation handshake."</p>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</Label>
                                <Input placeholder="e.g. Jonathan Sterling" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-5 font-bold text-slate-700 focus:bg-white transition-all shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Email Address</Label>
                                <Input placeholder="j.sterling@fixl.ai" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-5 font-bold text-slate-700 focus:bg-white transition-all shadow-inner" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Framework Role</Label>
                                    <Select value={newUser.role} onValueChange={v => setNewUser({ ...newUser, role: v as UserRole })}>
                                        <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-[13px] px-5 shadow-inner"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-2xl p-2 animate-in zoom-in-95 duration-200">
                                            <SelectItem value="Super Admin" className="rounded-xl font-bold py-2.5">Super Admin</SelectItem>
                                            <SelectItem value="Sales Manager" className="rounded-xl font-bold py-2.5">Sales Manager</SelectItem>
                                            <SelectItem value="Sales Rep" className="rounded-xl font-bold py-2.5">Sales Rep</SelectItem>
                                            <SelectItem value="Support Admin" className="rounded-xl font-bold py-2.5">Support Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Organizational Team</Label>
                                    <Select value={newUser.team} onValueChange={v => setNewUser({ ...newUser, team: v })}>
                                        <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50 font-bold text-[13px] px-5 shadow-inner"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-2xl p-2 animate-in zoom-in-95 duration-200">
                                            <SelectItem value="Outbound" className="rounded-xl font-bold py-2.5">Outbound Sales</SelectItem>
                                            <SelectItem value="Inbound" className="rounded-xl font-bold py-2.5">Inbound Growth</SelectItem>
                                            <SelectItem value="Enterprise Sales" className="rounded-xl font-bold py-2.5">Enterprise Hub</SelectItem>
                                            <SelectItem value="Operations" className="rounded-xl font-bold py-2.5">Core Operations</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-slate-50">
                            <Button variant="ghost" onClick={() => setShowModal(false)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">Cancel</Button>
                            <Button onClick={handleAddUser} className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all">Send Invite Protocol</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="text-center space-y-3">
                            <div className="h-16 w-16 rounded-3xl bg-slate-50 text-slate-900 flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                                <Lock size={32} />
                            </div>
                            <h2 className="text-[26px] font-black text-slate-900 tracking-tight uppercase leading-none">Reset Auth</h2>
                            <p className="text-[13px] text-slate-500 font-medium italic">"Forging new encryption keys for {showResetModal.name}."</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">New Master Pass</Label>
                                <div className="relative">
                                    <Input
                                        type={resetPassVisible ? "text" : "password"}
                                        placeholder="Min. 24 character entropy"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="h-14 rounded-2xl border-slate-100 bg-slate-50 px-5 font-bold text-slate-700 focus:bg-white transition-all shadow-inner pr-12"
                                    />
                                    <Button size="icon" variant="ghost" onClick={() => setResetPassVisible(!resetPassVisible)}
                                        className="absolute right-3 top-3 h-8 w-8 text-slate-300 hover:text-indigo-500 rounded-lg">
                                        {resetPassVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-2">
                            <Button variant="ghost" onClick={() => setShowResetModal(null)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50">Cancel</Button>
                            <Button onClick={handleResetPassword} className="flex-1 h-14 bg-slate-900 text-white font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl active:scale-[0.98] transition-all">Remint Auth</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm p-10 space-y-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="text-center space-y-5">
                            <div className="h-20 w-20 rounded-[30px] bg-rose-50 flex items-center justify-center mx-auto text-rose-500 shadow-sm border border-rose-100 animate-pulse">
                                <Trash2 size={36} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-[24px] font-black text-slate-900 uppercase tracking-tight leading-none">Purge Node?</h2>
                                <p className="text-[13px] text-slate-500 font-medium leading-relaxed italic">
                                    "This will permanently terminate identity hash for <strong>{showDeleteConfirm.name}</strong> and void all associated sessions."
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-2">
                            <Button variant="ghost" onClick={() => setShowDeleteConfirm(null)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[12px] tracking-widest text-slate-400 hover:bg-slate-50">Abort</Button>
                            <Button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 h-14 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl border-none uppercase text-[12px] tracking-widest shadow-xl shadow-rose-100 active:scale-[0.98] transition-all">Execute Purge</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
