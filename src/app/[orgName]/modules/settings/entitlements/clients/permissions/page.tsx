"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    ShieldCheck,
    Lock,
    Unlock,
    Eye,
    EyeOff,
    Edit3,
    Trash2,
    Search,
    RefreshCcw,
    UserCircle,
    ShieldAlert,
    FileText,
    Users,
    Key,
    Save,
    Info,
    ArrowRight,
    Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function ClientPermissionsPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const [roles, setRoles] = useState([
        { id: "1", name: "System Admin", access: "Full Access", maskData: false, status: "ACTIVE" },
        { id: "2", name: "Account Manager", access: "Entity Specified", maskData: true, status: "ACTIVE" },
        { id: "3", name: "Sales Representative", access: "Restricted View", maskData: true, status: "ACTIVE" },
        { id: "4", name: "Financial Auditor", access: "Read Global", maskData: false, status: "ACTIVE" },
        { id: "5", name: "External Associate", access: "View Only (Assigned)", maskData: true, status: "INACTIVE" }
    ])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1200)
    }

    const toggleMasking = (id: string) => {
        setRoles(prev => prev.map(r => r.id === id ? { ...r, maskData: !r.maskData } : r))
        toast.info("Data masking policy updated for role")
    }

    const toggleRoleStatus = (id: string) => {
        setRoles(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : r))
        toast.success("Security group status modified")
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Governance & Access</h1>
                            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black uppercase tracking-widest px-3">SECURITY LAYER</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Define granular permissions and PII data masking protocols for all client records.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Standards synced with global policy")}
                        className="h-10 border-zinc-200 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Reset Defaults
                    </Button>
                    <Button
                        onClick={() => handleAction("All permission changes broadcasted")}
                        className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Apply Global Changes
                    </Button>
                </div>
            </div>

            {/* SECURITY INSIGHTS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Breach Score</p>
                        <ShieldAlert className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">ZERO / 10</p>
                        <p className="text-[10px] text-white">Highest Security Tier</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Privileged Accounts</p>
                        <UserCircle className="w-4 h-4 text-indigo-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-zinc-900">03 Roles</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Full Edit Capabilities</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Dormant Groups</p>
                        <Users className="w-4 h-4 text-rose-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">01 Group</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Inactive permissions</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Audit Visibility</p>
                        <Eye className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">Global</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Read-only logging active</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12">
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                                <Input
                                    placeholder="Search security groups..."
                                    className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-emerald-100"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <Table>
                            <TableHeader className="bg-zinc-50/50">
                                <TableRow className="hover:bg-transparent border-b-zinc-100">
                                    <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-left">Role Profile</TableHead>
                                    <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Base Access Tier</TableHead>
                                    <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Data Masking</TableHead>
                                    <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Status</TableHead>
                                    <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Enforcement</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {roles.map((role, idx) => (
                                        <TableRow key={role.id} className="hover:bg-zinc-50/50 transition-colors group">
                                            <TableCell className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                                                        <Key className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-black text-zinc-900 italic tracking-tight group-hover:text-emerald-600 transition-colors">{role.name}</span>
                                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter italic">Unified Scope</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge variant="outline" className={`text-[10px] font-bold border-zinc-200 shadow-sm uppercase px-2 h-5 rounded-md ${role.access === 'Full Access' ? 'text-emerald-600 border-emerald-100 bg-emerald-50/30' :
                                                    role.access === 'Restricted View' ? 'text-amber-600 border-amber-100 bg-amber-50/30' :
                                                        'text-zinc-500 bg-white'
                                                    }`}>
                                                    {role.access}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 text-center">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <Switch
                                                        checked={role.maskData}
                                                        onCheckedChange={() => toggleMasking(role.id)}
                                                        className="scale-75 data-[state=checked]:bg-emerald-500"
                                                    />
                                                    <span className="text-[9px] font-black uppercase text-zinc-300 tracking-widest">{role.maskData ? 'PII HIDDEN' : 'PII EXPOSED'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 text-center">
                                                <Badge className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${role.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {role.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4 text-right pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                                                        onClick={() => handleAction(`Configuring ${role.name}`)}
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Switch
                                                        checked={role.status === 'ACTIVE'}
                                                        onCheckedChange={() => toggleRoleStatus(role.id)}
                                                        className="scale-75 data-[state=checked]:bg-zinc-900"
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="lg:col-span-12">
                    <div className="p-8 bg-zinc-900 rounded-3xl text-white shadow-2xl relative overflow-hidden border-t border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                            <div className="flex gap-6 items-center">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                                    <Shield className="w-7 h-7 text-emerald-400" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase italic tracking-widest mb-1 text-emerald-400">Strict Data Masking (SDM)</h4>
                                    <p className="text-xs text-white/50 font-bold leading-relaxed max-w-xl italic">When enabled, PII data (Phone, Email, Tax IDs) will be partially hidden (e.g., ****@gmail.com) for all roles except System Admin. This is a irreversible policy for current session.</p>
                                </div>
                            </div>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-900/40">Activate Vault Lock</Button>
                        </div>
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-[80px]" />
                    </div>
                </div>

                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PermissionSnippet title="Mass Export" capability="BLOCK" icon={FileText} />
                    <PermissionSnippet title="Bulk Deletion" capability="BLOCK" icon={Trash2} color="rose" />
                    <PermissionSnippet title="API Access" capability="RESTRICT" icon={ArrowRight} color="indigo" />
                </div>
            </div>
        </div>
    )
}

function PermissionSnippet({ title, capability, icon: Icon, color = "emerald" }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between group hover:border-zinc-300 transition-all">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:text-${color}-500 transition-colors`}>
                    <Icon className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-black uppercase italic tracking-widest text-zinc-500 group-hover:text-zinc-900 transition-colors">{title}</h5>
            </div>
            <Badge className={`bg-${color}-50 text-${color}-600 border-none font-black text-[9px] tracking-widest px-3 py-1`}>{capability}</Badge>
        </div>
    )
}
