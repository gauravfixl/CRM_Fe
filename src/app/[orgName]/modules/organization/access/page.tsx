"use client"

import React, { useState } from "react"
import {
    Package,
    CheckCircle2,
    XCircle,
    Zap,
    Users,
    Building2,
    Lock,
    BarChart3,
    Settings,
    ShieldCheck,
    AlertCircle,
    Info,
    LayoutGrid,
    Search,
    ChevronRight,
    ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

const modules = [
    { id: "mod-crm", name: "CRM Suite", icon: Users, description: "Manage leads, deals, and client relationships across all firms.", status: true, usage: "12/12 Firms", tier: "Enterprise" },
    { id: "mod-hrm", name: "HRM Cubicle", icon: Building2, description: "Employee management, payroll, and workforce orchestration.", status: true, usage: "8/12 Firms", tier: "Enterprise" },
    { id: "mod-pm", name: "Project Management", icon: LayoutGrid, description: "Advanced task tracking, board management, and resource planning.", status: true, usage: "5/12 Firms", tier: "Business" },
    { id: "mod-acc", name: "Accounting & Fin", icon: BarChart3, description: "Ledgers, invoicing, and financial health reporting.", status: false, usage: "0/12 Firms", tier: "Enterprise" },
    { id: "mod-auto", name: "Advanced Automations", icon: Zap, description: "No-code workflows and event-driven triggers for system efficiency.", status: true, usage: "12/12 Firms", tier: "Professional" },
    { id: "mod-sec", name: "Security & Compliance", icon: Lock, description: "Audit logs, policy enforcement, and infrastructure health monitoring.", status: true, usage: "All Firms (Enforced)", tier: "Core" },
]

export default function ModuleAccessPage() {
    const [moduleList, setModuleList] = useState(modules)

    const handleToggle = (id: string, name: string, currentStatus: boolean) => {
        setModuleList(prev => prev.map(m => m.id === id ? { ...m, status: !m.status } : m))
        if (currentStatus) {
            toast.error(`${name} has been disabled for the organization.`)
        } else {
            toast.success(`${name} has been enabled for the organization.`)
        }
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Module & Entitlements</h1>
                    <p className="text-sm text-slate-500 mt-1">Configure global application availability and feature access control.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200" onClick={() => toast.info("Audit log filtered for Module changes")}>
                        <Info className="w-4 h-4" />
                        Usage Reports
                    </Button>
                    <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold shadow-sm" onClick={() => toast.info("Configuring global default mappings")}>
                        <Settings className="w-4 h-4" />
                        Configure Defaults
                    </Button>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-gradient-to-br from-slate-900 to-indigo-900 border-none shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <Package className="w-20 h-20 text-white" />
                    </div>
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Active Solutions</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-white">5 / 6</p>
                        <p className="text-[10px] text-indigo-200 font-medium flex items-center gap-1 mt-1">
                            Current Enterprise Portfolio
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Firms with custom sets</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-slate-900 text-left">4</p>
                        <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-1 text-left">
                            <Info className="w-3 h-3" /> Specific overrides active
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Org-Wide Enforced</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-slate-900 text-left">2</p>
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1 text-left">
                            <Lock className="w-3 h-3 text-emerald-500" /> Security & Core
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Module Health</p>
                    </SmallCardHeader>
                    <SmallCardContent>
                        <p className="text-2xl font-black text-emerald-600 text-left">Stable</p>
                        <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-1 text-left">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> All APIs operational
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* MODULE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                {moduleList.map((mod) => (
                    <Card key={mod.id} className={`border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md ${!mod.status ? 'grayscale-[0.5] opacity-80' : 'border-l-4 border-l-blue-500'}`}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`p-2 rounded-xl ${mod.status ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <mod.icon className="w-5 h-5 text-blue-600 font-bold" />
                                </div>
                                <Switch
                                    checked={mod.status}
                                    onCheckedChange={() => handleToggle(mod.id, mod.name, mod.status)}
                                    // Disable toggle for Security module which is Core
                                    disabled={mod.tier === 'Core'}
                                />
                            </div>
                            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                {mod.name}
                                {mod.tier === 'Core' && <Badge className="bg-slate-100 text-slate-500 text-[8px] font-black uppercase">Core</Badge>}
                            </CardTitle>
                            <CardDescription className="text-xs font-medium leading-relaxed">
                                {mod.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase">Usage Statistics</span>
                                <span className="text-xs font-bold text-slate-700">{mod.usage}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Entitlement Tier</p>
                                    <p className="text-xs font-black text-blue-600">{mod.tier}</p>
                                </div>
                                <div className="flex-1 text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">API Status</p>
                                    <p className={`text-xs font-black ${mod.status ? 'text-emerald-500' : 'text-slate-300'}`}>Operational</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-tight text-slate-500 hover:text-blue-600 h-10 gap-2 border-t border-slate-100 rounded-none">
                                Manage Config <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* ALERT BOX */}
            <div className="flex items-start gap-4 p-5 bg-amber-50/50 border border-amber-100 rounded-2xl shadow-sm">
                <div className="h-10 w-10 bg-amber-100 flex items-center justify-center rounded-full shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">Access Propagation Warning</h4>
                    <p className="text-xs text-amber-700/80 leading-relaxed font-medium">
                        Disabling a global module like <span className="font-bold underline">"CRM Suite"</span> will immediately restrict access for all firms and users.
                        In-progress workflows may be interrupted and data will remain archived until the module is re-enabled.
                    </p>
                </div>
            </div>
        </div>
    )
}
