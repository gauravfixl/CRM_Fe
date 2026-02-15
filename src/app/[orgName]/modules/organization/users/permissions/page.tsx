"use client"

import React, { useState } from "react"
import {
    ShieldCheck,
    Lock,
    Unlock,
    Users,
    Settings,
    Check,
    X,
    Info,
    Search,
    ArrowRight,
    Key,
    Building2,
    ShieldAlert,
    Save,
    RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const modules = ["CRM", "HRM", "Projects", "Billing", "Admin"]
const roles = [
    { name: "Organization Admin", permissions: [true, true, true, true, true], description: "Full access to all modules and org settings." },
    { name: "Firm Owner", permissions: [true, true, true, true, false], description: "Manage business unit resources and billing." },
    { name: "Project Lead", permissions: [false, false, true, false, false], description: "Task management and resource delegation." },
    { name: "Support Agent", permissions: [true, false, false, false, false], description: "Customer interaction and ticket resolution." },
    { name: "Compliance Officer", permissions: [false, false, false, true, true], description: "Audit logs and regulatory oversight." },
]

export default function PermissionsMatrix() {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredRoles = roles.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Permissions Matrix</h1>
                    <p className="text-sm text-slate-500 mt-1">Cross-functional map of roles and their accessible system modules.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Resetting matrix to system defaults")}>
                        <RotateCcw className="w-4 h-4" />
                        Reset Matrix
                    </Button>
                    <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-black uppercase text-[10px] tracking-widest shadow-sm px-6" onClick={() => toast.success("Permissions updated across all instances")}>
                        <Save className="w-4 h-4" />
                        Publish Changes
                    </Button>
                </div>
            </div>

            {/* INFO BANNER */}
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-4 shadow-sm border-l-4 border-l-indigo-600">
                <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-indigo-950 uppercase tracking-tighter">Enterprise Access Control (EAC)</h4>
                    <p className="text-[11px] text-indigo-700/80 leading-relaxed font-bold">
                        The matrix below defines the <span className="underline">Capability Threshold</span> for each identity role.
                        Changes here will affect new assignments immediately. Existing users will migrate to the new schema within the next 30 minutes.
                    </p>
                </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search for a specific role index..."
                        className="pl-10 h-10 border-none bg-slate-50 focus-visible:ring-0 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* PERMISSIONS MATRIX */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
                    <CardTitle className="text-base font-bold text-slate-900">Role-Based Access Control Map</CardTitle>
                    <CardDescription className="text-xs font-medium">Verify or adjust module access for predefined organization roles.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/30 border-b border-slate-100">
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] w-1/3">Identity Role</th>
                                    {modules.map(mod => (
                                        <th key={mod} className="px-4 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">
                                            {mod}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRoles.map((role) => (
                                    <tr key={role.name} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                                                    {role.name}
                                                    {role.name === "Organization Admin" && (
                                                        <Badge className="bg-blue-50 text-blue-700 border-none font-black text-[8px] uppercase tracking-tighter shadow-none">System Core</Badge>
                                                    )}
                                                </span>
                                                <span className="text-[10px] font-medium text-slate-500 leading-relaxed italic">{role.description}</span>
                                            </div>
                                        </td>
                                        {role.permissions.map((hasPerm, idx) => (
                                            <td key={`${role.name}-${idx}`} className="px-4 py-5 text-center">
                                                <button
                                                    className={`h-9 w-9 rounded-xl inline-flex items-center justify-center transition-all ${hasPerm ?
                                                            'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100' :
                                                            'bg-red-50 text-red-400 border border-red-100 hover:bg-red-100 hover:text-red-600'
                                                        } ${role.name === 'Organization Admin' ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                                                    onClick={() => {
                                                        if (role.name !== 'Organization Admin') {
                                                            toast.info(`Toggling ${modules[idx]} for ${role.name}`)
                                                        }
                                                    }}
                                                >
                                                    {hasPerm ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <CardFooter className="bg-slate-50/30 border-t border-slate-100 p-4 flex justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5" /> Granular function-level overrides are available in individual role settings
                    </p>
                </CardFooter>
            </Card>

            {/* DANGER AREA BOX */}
            <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-4">
                <div className="h-10 w-10 bg-amber-100 flex items-center justify-center rounded-full shrink-0">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-amber-950 uppercase tracking-tighter">Inheritance Override Warning</h4>
                    <p className="text-xs text-amber-900/80 leading-relaxed font-bold">
                        Modifying the Organization Admin base permissions is restricted to identity owners. If you revoke "Admin" module access, you will lose the ability to manage this matrix yourself.
                    </p>
                    <div className="pt-2">
                        <Button variant="link" className="text-amber-700 p-0 h-auto text-[10px] font-black underline uppercase tracking-widest">Read RBAC Documentation</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
