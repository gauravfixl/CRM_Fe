"use client"

import React, { useState } from "react"
import SubHeader from "@/components/custom/SubHeader"
import { Smartphone, ShieldCheck, ShieldAlert, Plus, Search, Info, LogOut, Key, CheckCircle2, ChevronRight, MoreVertical, SmartphoneIcon, Mail, Laptop } from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SmallCard } from "@/components/custom/SmallCard"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

export default function MFASetupPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [enforced, setEnforced] = useState(true)

    const methods = [
        { id: "1", name: "Authenticator app", type: "Security app", status: "Recommended", icon: ShieldCheck, hardware: false, popularity: "85%" },
        { id: "2", name: "SMS verification", type: "Phone number", status: "Legacy", icon: Smartphone, hardware: false, popularity: "12%" },
        { id: "3", name: "Security keys (FIDO2)", type: "Hardware", status: "Strongest", icon: Key, hardware: true, popularity: "3%" },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="MFA setup"
                breadcrumbItems={[
                    { label: "Identity & access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "MFA setup", href: "/modules/settings/auth/mfa" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold" onClick={() => toast.info("Downloading recovery codes")}>
                            Recovery codes
                        </CustomButton>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-bold text-xs tracking-widest shadow-xl border-0" onClick={() => toast.success("MFA configuration preserved")}>
                            Save settings
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Top HUD Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SmallCard className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl col-span-1 md:col-span-2 relative overflow-hidden group shadow-xl border-0">

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-white/20 text-white border-0 rounded-full px-3 py-0.5 font-bold tracking-widest text-[10px] uppercase">Identity shield</Badge>
                                <Badge className="bg-emerald-500 text-white border-0 rounded-full px-3 py-0.5 font-bold tracking-widest text-[10px] uppercase">Enforced</Badge>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white italic">Multi-factor security</h2>
                            <p className="text-indigo-100/80 font-medium leading-relaxed text-sm max-w-md">
                                Multi-factor authentication adds an essential layer of security. We recommend requiring an authenticator app for all privileged roles.
                            </p>
                            <div className="flex items-center gap-10 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-white">98%</span>
                                    <span className="text-[10px] font-bold text-indigo-200 tracking-widest mt-1 uppercase">Adoption rate</span>
                                </div>
                                <div className="h-10 w-px bg-white/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-emerald-400 leading-none">Healthy</span>
                                    <span className="text-[10px] font-bold text-indigo-200 tracking-widest mt-1 uppercase">Policy status</span>
                                </div>
                            </div>
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center rounded-xl font-bold">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block mb-1">Global enforcement</span>
                                <div className="text-xl font-semibold text-zinc-900 dark:text-white leading-none">Always require MFA</div>
                            </div>
                            <Switch checked={enforced} onCheckedChange={setEnforced} className="data-[state=checked]:bg-indigo-600" />
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center rounded-xl font-bold">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase block mb-1">Session timeout</span>
                            <div className="text-xl font-semibold text-zinc-900 dark:text-white leading-none">8 hours sliding</div>
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
                            placeholder="Find MFA methods or verified factors..."
                        />
                    </div>
                </div>

                {/* Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {methods.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.type.toLowerCase().includes(searchQuery.toLowerCase())).map((method) => (
                        <Card key={method.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all group overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div className={`h-14 w-14 flex items-center justify-center rounded-2xl border transition-all ${method.status === 'Recommended' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 border-zinc-100 dark:border-zinc-700'
                                    }`}>
                                    <method.icon className="w-6 h-6" />
                                </div>
                                <CustomButton variant="ghost" size="icon" className="text-zinc-400 rounded-xl" onClick={() => toast.info(`Options for ${method.name}`)}>
                                    <MoreVertical className="w-4 h-4" />
                                </CustomButton>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">{method.name}</h3>
                                        {method.hardware && <Badge className="bg-amber-100 text-amber-700 border-0 text-[8px] font-bold uppercase rounded-md px-1">Hardware</Badge>}
                                    </div>
                                    <p className="text-xs text-zinc-400 font-medium">{method.type}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge className={`rounded-full border-0 text-[10px] font-bold tracking-widest py-1 px-3 uppercase ${method.status === 'Recommended' ? 'bg-emerald-50 text-emerald-600' :
                                        method.status === 'Strongest' ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {method.status}
                                    </Badge>
                                    <div className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                                        {method.popularity} usage
                                    </div>
                                </div>

                                <Separator className="bg-zinc-50 dark:bg-zinc-800/50" />

                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        <Laptop className="h-5 w-5 text-zinc-300" />
                                        <Smartphone className="h-5 w-5 text-zinc-300" />
                                        <Mail className="h-5 w-5 text-zinc-300" />
                                    </div>
                                    <CustomButton variant="ghost" className="h-10 text-[10px] text-zinc-500 font-bold tracking-widest uppercase hover:text-indigo-600 group-hover:translate-x-1 transition-transform" onClick={() => toast.info(`Configuring ${method.name}`)}>
                                        Configure factor <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-indigo-500/20 transition-all cursor-pointer group bg-zinc-50/10 dark:bg-zinc-900/10 rounded-3xl" onClick={() => toast.info("Opening factor addition wizard")}>
                        <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500 shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <Plus className="w-10 h-10 text-zinc-200 group-hover:text-indigo-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-zinc-400 tracking-widest uppercase">Add new factor</h4>
                            <p className="text-xs text-zinc-400 font-medium">Provision another verification method</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
