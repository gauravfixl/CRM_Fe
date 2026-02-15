"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Lock,
    Plus,
    MoreVertical,
    Search,
    Filter,
    ShieldCheck,
    ShieldAlert,
    UserCheck,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCcw,
    Edit3,
    Trash2,
    Settings2,
    Users,
    Network,
    Key,
    Eye,
    Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function LeadPermissionsPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1200)
    }

    const permissionMatrix = [
        { role: "Global Admin", create: true, edit: true, delete: true, convert: true, viewAll: true, type: "SYSTEM" },
        { role: "Sales Manager", create: true, edit: true, delete: false, convert: true, viewAll: true, type: "CUSTOM" },
        { role: "Sales Representative", create: true, edit: "OWN", delete: false, convert: true, viewAll: false, type: "CUSTOM" },
        { role: "Support Desk", create: false, edit: false, delete: false, convert: false, viewAll: true, type: "CUSTOM" },
        { role: "External Partner", create: true, edit: "OWN", delete: false, convert: false, viewAll: false, type: "GUEST" },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Baseline Permissions</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-bold uppercase tracking-widest">Access Control</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Define foundational access roles and capabilities for Lead Management management.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Global permission matrix audited")}
                        className="h-10 border-zinc-200 text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Audit Roles
                    </Button>
                    <Button
                        onClick={() => handleAction("Baseline published to all firms")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Push Baseline
                    </Button>
                </div>
            </div>

            {/* SECURITY INSIGHTS - 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Access Model</p>
                        <Key className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">RBAC</p>
                        <p className="text-[10px] text-white">Role-Based Access Logic</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Active Roles</p>
                        <Users className="w-4 h-4 text-blue-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">12 Defined</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Standardized by Org</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20_40_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Data Visibility</p>
                        <Eye className="w-4 h-4 text-emerald-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">Restricted</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Owner-only editing active</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Override Mode</p>
                        <Zap className="w-4 h-4 text-rose-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-rose-600">Off</p>
                        <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tighter">Firms cannot override</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* ROLE PERMISSION TABLE */}
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden mt-2">
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest italic group-hover:text-blue-600 transition-colors">Default Role Permission Matrix</h3>
                    <Button variant="outline" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white shadow-sm">
                        Configure Permissions
                    </Button>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Base Role</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Create</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Edit</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Delete</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Convert</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">View All</TableHead>
                            <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permissionMatrix.map((item, idx) => (
                            <TableRow key={idx} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.type === 'SYSTEM' ? 'bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-zinc-900 uppercase italic tracking-tight group-hover:text-blue-600 transition-colors">{item.role}</span>
                                            <span className="text-[9px] font-black uppercase text-zinc-300 tracking-tighter">{item.type} DEFINED</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <PermissionToggle active={item.create} />
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <PermissionToggle active={item.edit} />
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <PermissionToggle active={item.delete} />
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <PermissionToggle active={item.convert} />
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <PermissionToggle active={item.viewAll} />
                                </TableCell>
                                <TableCell className="py-4 text-right pr-6">
                                    <Button size="sm" variant="ghost" disabled={item.type === 'SYSTEM'} className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100 text-zinc-300 transition-all">
                                        <Settings2 className="w-3.5 h-3.5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/10">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic flex items-center gap-2">
                        <Info className="w-3.5 h-3.5" />
                        Permissions are baseline defaults. Firms can be blocked from overriding these in global settings.
                    </p>
                </div>
            </div>

            {/* OVERRIDE SETTINGS - 3D GLASS STYLE */}
            <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8 border-b border-zinc-100 pb-6">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    <div>
                        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest italic">Global Sovereignty Policy</h3>
                        <p className="text-[11px] text-zinc-400 font-medium">Control whether child firms can define their own lead permission matrices.</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-zinc-50/50 rounded-xl border border-zinc-100 group transition-all hover:bg-white hover:border-blue-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                            <Network className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-zinc-800 uppercase italic tracking-tighter">Firm-Level Authority Override</span>
                            <span className="text-[10px] text-zinc-400 font-bold mt-1">Status: Restricted by Org Admin</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Enable Firm Overrides?</span>
                        <Switch checked={false} className="data-[state=checked]:bg-blue-600 shadow-sm" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function PermissionToggle({ active }: { active: boolean | string }) {
    if (active === true) return <div className="flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.2)]" /></div>
    if (active === false) return <div className="flex items-center justify-center"><XCircle className="w-4 h-4 text-zinc-100" /></div>
    if (active === "OWN") return <div className="flex items-center justify-center"><Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none text-[8px] font-black uppercase tracking-tighter px-2 h-4">OWNER ONLY</Badge></div>
    return null
}
