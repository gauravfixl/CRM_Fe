"use client"

import React, { useState } from "react"
import SubHeader from "@/components/custom/SubHeader"
import { Lock, Zap, ShieldCheck, MapPin, Plus, Search, Info, MoreHorizontal, ChevronRight, Monitor, Smartphone, Globe, AlertTriangle, UserCheck, ShieldAlert, Cpu, Edit3, Trash2, Activity } from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SmallCard } from "@/components/custom/SmallCard"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ConditionalAccessPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [globalBlock, setGlobalBlock] = useState(false)

    const policies = [
        { id: "1", name: "Block risky countries", type: "Location-based", status: "Active", icon: Globe, description: "Block all authentication attempts from sanctioned or high-risk regions.", severity: "Critical" },
        { id: "2", name: "Require MFA for admin", type: "Role-based", status: "Active", icon: ShieldAlert, description: "Force MFA challenge whenever a privileged role is accessed.", severity: "High" },
        { id: "3", name: "Compliant devices only", type: "Device-health", status: "Paused", icon: Monitor, description: "Only allow identities on Intune managed or hybrid joined hardware.", severity: "Medium" },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Conditional access"
                breadcrumbItems={[
                    { label: "Identity & access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Conditional access", href: "/modules/settings/auth/conditional" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold" onClick={() => toast.info("Simulating policy outcomes")}>
                            Policy simulator
                        </CustomButton>
                        <CustomButton className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-6 font-semibold text-xs tracking-wide shadow-xl border-0" onClick={() => toast.success("Conditional policies updated")}>
                            New policy
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Top HUD Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SmallCard className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 p-8 rounded-3xl col-span-1 md:col-span-2 relative overflow-hidden group shadow-2xl border-0">
                        <Lock className="absolute -bottom-10 -right-10 h-64 w-64 text-white opacity-10 group-hover:scale-110 transition-transform pointer-events-none" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-white/20 text-white border-0 rounded-full px-3 py-0.5 font-semibold tracking-wide text-xs">Smart Defense</Badge>
                                <Badge className="bg-emerald-400 text-white border-0 rounded-full px-3 py-0.5 font-semibold tracking-wide text-xs">Real-Time Eval</Badge>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white italic">Intelligent gating</h2>
                            <p className="text-emerald-100/80 font-medium leading-relaxed text-sm max-w-md">
                                Conditional access is the heart of your zero trust engine. It evaluates every sign-in signal before allowing or challenging access.
                            </p>
                            <div className="flex items-center gap-10 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-white">12</span>
                                    <span className="text-xs font-semibold text-emerald-200 tracking-wide mt-1">Active Rules</span>
                                </div>
                                <div className="h-10 w-px bg-white/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-emerald-300 leading-none italic">0.2 ms</span>
                                    <span className="text-xs font-semibold text-emerald-200 tracking-wide mt-1">Latency Overhead</span>
                                </div>
                            </div>
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center rounded-xl font-bold">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <span className="text-xs font-semibold text-zinc-400 tracking-wide block mb-1">Risk Protection</span>
                                <div className="text-xl font-semibold text-zinc-900 dark:text-white leading-none italic">Block legacy auth</div>
                            </div>
                            <Switch checked={globalBlock} onCheckedChange={setGlobalBlock} className="data-[state=checked]:bg-emerald-600" />
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center rounded-xl font-bold">
                            <UserCheck className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <span className="text-xs font-semibold text-zinc-400 tracking-wide block mb-1">Trust Level</span>
                            <div className="text-xl font-semibold text-emerald-600 leading-none italic">High assurance</div>
                        </div>
                    </SmallCard>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-sm sticky top-[64px] z-20">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 border-none focus-visible:ring-0 rounded-none h-12 bg-transparent font-medium"
                            placeholder="Find conditional policies by signal or target..."
                        />
                    </div>
                </div>

                {/* Policies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {policies.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.type.toLowerCase().includes(searchQuery.toLowerCase())).map((policy) => (
                        <Card key={policy.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all group overflow-hidden border-t-2 border-t-zinc-50 dark:border-t-zinc-800 hover:border-t-emerald-600">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div className={`h-14 w-14 flex items-center justify-center rounded-2xl border transition-all ${policy.status === 'Active' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 border-zinc-100 dark:border-zinc-700'
                                    }`}>
                                    <policy.icon className="w-6 h-6" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <CustomButton variant="ghost" size="icon" className="text-zinc-400 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </CustomButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl p-2 min-w-[160px] shadow-2xl border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                        <DropdownMenuLabel className="text-xs font-semibold tracking-wide py-2 px-3 text-zinc-400">Policy Management</DropdownMenuLabel>
                                        <DropdownMenuItem className="text-xs font-semibold py-3 flex items-center gap-3 cursor-pointer rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800" onClick={() => toast.info(`Editing ${policy.name}`)}><Edit3 className="w-4 h-4 text-zinc-400" /> Edit rules</DropdownMenuItem>
                                        <DropdownMenuItem className="text-xs font-semibold py-3 flex items-center gap-3 cursor-pointer rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800" onClick={() => toast.info(`Viewing analytics for ${policy.name}`)}><Activity className="w-4 h-4 text-zinc-400" /> Evaluation logs</DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-zinc-50 dark:bg-zinc-800 my-1" />
                                        <DropdownMenuItem className="text-xs font-semibold py-3 flex items-center gap-3 cursor-pointer rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={() => toast.error(`Deleting ${policy.name}`)}><Trash2 className="w-4 h-4" /> Remove policy</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>

                            <CardContent className="space-y-6 text-left">
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">{policy.name}</h3>
                                    <p className="text-xs text-zinc-400 font-medium mt-1 tracking-wide">{policy.type}</p>
                                    <p className="text-xs text-zinc-500 mt-4 leading-relaxed line-clamp-2 italic">{policy.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge className={`rounded-full border-0 text-xs font-semibold tracking-wide py-1 px-3 ${policy.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {policy.status === 'Active' ? 'On' : 'Off'}
                                    </Badge>
                                    <Badge className={`rounded-full border-0 text-xs font-semibold tracking-wide px-3 py-1 ${policy.severity === 'Critical' ? 'bg-red-50 text-red-600' :
                                        policy.severity === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {policy.severity} risk
                                    </Badge>
                                </div>

                                <Separator className="bg-zinc-50 dark:bg-zinc-800/50" />

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <Globe className="h-5 w-5 text-zinc-300" />
                                        <MapPin className="h-5 w-5 text-zinc-300" />
                                    </div>
                                    <CustomButton variant="ghost" className="h-10 text-xs text-zinc-500 font-semibold tracking-wide hover:text-emerald-600 group-hover:translate-x-1 transition-transform" onClick={() => toast.info(`Managing rules for ${policy.name}`)}>
                                        Manage Logic <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-emerald-500/20 transition-all cursor-pointer group bg-zinc-50/10 dark:bg-zinc-900/10 rounded-3xl" onClick={() => toast.info("Opening policy creation wizard")}>
                        <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500 shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <Plus className="w-10 h-10 text-zinc-200 group-hover:text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-semibold text-zinc-400 tracking-wide">New Policy</h4>
                            <p className="text-xs text-zinc-400 font-medium italic">Create a new conditional gate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
