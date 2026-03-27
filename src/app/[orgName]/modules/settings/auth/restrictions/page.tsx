"use client"

import React, { useState } from "react"
import SubHeader from "@/components/custom/SubHeader"
import { ShieldAlert, Zap, ShieldCheck, Lock, Plus, Search, Info, MoreHorizontal, ChevronRight, Ban, Globe, Clock, UserX, MonitorOff, Terminal, Cpu } from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SmallCard } from "@/components/custom/SmallCard"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function LoginRestrictionsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [active, setActive] = useState(true)

    const restrictions = [
        { id: "1", name: "IP range whitelist", type: "Network", status: "Active", icon: Globe, description: "Only allow logins from corporate HQ and trusted VPN ranges.", severity: "Critical" },
        { id: "2", name: "Time-based login", type: "Schedule", status: "Active", icon: Clock, description: "Block authentication for standard users during non-business hours.", severity: "Medium" },
        { id: "3", name: "Unmanaged device block", type: "Hardware", status: "Paused", icon: MonitorOff, description: "Prevent logins from personal laptops or unverified mobile devices.", severity: "High" },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Login restrictions"
                breadcrumbItems={[
                    { label: "Identity & access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Login restrictions", href: "/modules/settings/auth/restrictions" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold" onClick={() => toast.info("Viewing restriction audit logs")}>
                            Restriction logs
                        </CustomButton>
                        <CustomButton className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-10 px-6 font-bold text-xs tracking-widest shadow-xl border-0" onClick={() => toast.success("Restriction policies updated")}>
                            Add restriction
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Top HUD Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SmallCard className="bg-gradient-to-br from-red-600 to-red-900 p-8 rounded-3xl col-span-1 md:col-span-2 relative overflow-hidden group shadow-2xl border-0">
                        <Ban className="absolute -bottom-10 -right-10 h-64 w-64 text-white opacity-10 group-hover:scale-110 transition-transform pointer-events-none" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-white/20 text-white border-0 rounded-full px-3 py-0.5 font-bold tracking-widest text-[10px] uppercase">Gated entry</Badge>
                                <Badge className="bg-red-400 text-white border-0 rounded-full px-3 py-0.5 font-bold tracking-widest text-[10px] uppercase">Strict mode</Badge>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white italic">Access boundaries</h2>
                            <p className="text-red-100/80 font-medium leading-relaxed text-sm max-w-md">
                                Define where and when users can access your environment. Restrictions provide a defensive perimeter beyond basic credentials.
                            </p>
                            <div className="flex items-center gap-10 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-white">4</span>
                                    <span className="text-[10px] font-bold text-red-200 tracking-widest mt-1 uppercase">Active gates</span>
                                </div>
                                <div className="h-10 w-px bg-white/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-emerald-400 leading-none">99.9%</span>
                                    <span className="text-[10px] font-bold text-red-200 tracking-widest mt-1 uppercase">Block accuracy</span>
                                </div>
                            </div>
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center rounded-xl font-bold">
                            <UserX className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block mb-1">Global lockout</span>
                                <div className="text-xl font-semibold text-zinc-900 dark:text-white leading-none">Smart lockout</div>
                            </div>
                            <Switch checked={active} onCheckedChange={setActive} className="data-[state=checked]:bg-red-600" />
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center rounded-xl font-bold">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block mb-1">Engine status</span>
                            <div className="text-xl font-semibold text-emerald-600 leading-none">Operational</div>
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
                            placeholder="Find login restrictions by IP, time, or factor..."
                        />
                    </div>
                </div>

                {/* Restrictions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restrictions.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.type.toLowerCase().includes(searchQuery.toLowerCase())).map((res) => (
                        <Card key={res.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all group overflow-hidden border-t-2 border-t-zinc-50 dark:border-t-zinc-800 hover:border-t-red-600">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div className={`h-14 w-14 flex items-center justify-center rounded-2xl border transition-all ${res.status === 'Active' ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 border-zinc-100 dark:border-zinc-700'
                                    }`}>
                                    <res.icon className="w-6 h-6" />
                                </div>
                                <CustomButton variant="ghost" size="icon" className="text-zinc-400 rounded-xl" onClick={() => toast.info(`Options for ${res.name}`)}>
                                    <MoreHorizontal className="w-4 h-4" />
                                </CustomButton>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">{res.name}</h3>
                                    <p className="text-xs text-zinc-400 font-medium mt-1">{res.type}</p>
                                    <p className="text-xs text-zinc-500 mt-4 leading-relaxed line-clamp-2">{res.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge className={`rounded-full border-0 text-[10px] font-bold tracking-widest py-1 px-3 uppercase ${res.status === 'Active' ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {res.status}
                                    </Badge>
                                    <Badge className={`rounded-full border-0 text-[10px] font-bold tracking-widest px-3 py-1 uppercase ${res.severity === 'Critical' ? 'bg-red-50 text-red-600' :
                                        res.severity === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {res.severity} priority
                                    </Badge>
                                </div>

                                <Separator className="bg-zinc-50 dark:bg-zinc-800/50" />

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <Globe className="h-5 w-5 text-zinc-300" />
                                        <Clock className="h-5 w-5 text-zinc-300" />
                                    </div>
                                    <CustomButton variant="ghost" className="h-10 text-[10px] text-zinc-500 font-bold tracking-widest uppercase hover:text-red-600 group-hover:translate-x-1 transition-transform" onClick={() => toast.info(`Defining bounds for ${res.name}`)}>
                                        Edit boundary <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-red-500/20 transition-all cursor-pointer group bg-zinc-50/10 dark:bg-zinc-900/10 rounded-3xl" onClick={() => toast.info("Opening restriction creation wizard")}>
                        <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500 shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <Plus className="w-10 h-10 text-zinc-200 group-hover:text-red-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-zinc-400 tracking-widest uppercase">New boundary</h4>
                            <p className="text-xs text-zinc-400 font-medium">Create a new login gate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
