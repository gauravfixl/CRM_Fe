"use client"

import React, { useState } from "react"
import SubHeader from "@/components/custom/SubHeader"
import { Settings, Lock, ShieldCheck, Zap, Plus, Search, Info, MoreHorizontal, ChevronRight, RefreshCw, KeyRound, AlertCircle, History, Terminal, ShieldAlert } from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SmallCard } from "@/components/custom/SmallCard"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

export default function PasswordPolicyPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [complex, setComplex] = useState(true)
    const [minLength, setMinLength] = useState([12])

    const rules = [
        { id: "1", name: "Complexity requirements", type: "Character set", status: "Enforced", icon: KeyRound, description: "Passwords must contain uppercase, lowercase, numbers, and special characters.", severity: "High" },
        { id: "2", name: "Password history", type: "Rotation", status: "Active", icon: History, description: "Prevent reuse of the last 24 passwords used by the identity.", severity: "Medium" },
        { id: "3", name: "Banned password list", type: "Security", status: "Enforced", icon: ShieldAlert, description: "Block common passwords like 'Password123' or 'FixlSolutions'.", severity: "Critical" },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Password policy"
                breadcrumbItems={[
                    { label: "Identity & access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Password policy", href: "/modules/settings/auth/password-policy" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold" onClick={() => toast.info("Testing password strength logic")}>
                            Policy tester
                        </CustomButton>
                        <CustomButton className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 rounded-xl h-10 px-6 font-semibold text-xs tracking-wide shadow-xl border-0" onClick={() => toast.success("Password policies published to directory")}>
                            Publish changes
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Top HUD Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SmallCard className="bg-gradient-to-br from-zinc-800 to-zinc-950 p-8 rounded-3xl col-span-1 md:col-span-2 relative overflow-hidden group shadow-2xl border-0">
                        <Lock className="absolute -bottom-10 -right-10 h-64 w-64 text-white opacity-10 group-hover:scale-110 transition-transform pointer-events-none" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-white/10 text-zinc-400 border-zinc-800 rounded-full px-3 py-0.5 font-semibold tracking-wide text-xs">Compliance Standard</Badge>
                                <Badge className="bg-emerald-500 text-white border-0 rounded-full px-3 py-0.5 font-semibold tracking-wide text-xs">NIST Compliant</Badge>
                            </div>
                            <h2 className="text-3xl font-semibold tracking-tight text-white italic">Credential hygiene</h2>
                            <p className="text-zinc-400 font-medium leading-relaxed text-sm max-w-md">
                                Define the strength and lifecycle of organization passwords. While MFA is critical, strong base credentials remain the first line of defense.
                            </p>
                            <div className="flex items-center gap-10 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-white">24</span>
                                    <span className="text-xs font-semibold text-zinc-500 tracking-wide mt-1">History Depth</span>
                                </div>
                                <div className="h-10 w-px bg-zinc-800"></div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-emerald-400 leading-none">Healthy</span>
                                    <span className="text-xs font-semibold text-zinc-500 tracking-wide mt-1">Entropy Status</span>
                                </div>
                            </div>
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center rounded-xl font-semibold">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <span className="text-xs font-semibold text-zinc-400 tracking-wide block mb-1">Rotation Policy</span>
                                <div className="text-xl font-semibold text-zinc-900 dark:text-white leading-none">90-day expiry</div>
                            </div>
                            <Switch checked={complex} onCheckedChange={setComplex} className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100" />
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-6 rounded-3xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-400 tracking-wide">Min. Length</span>
                            <span className="text-lg font-semibold text-indigo-600">{minLength[0]} characters</span>
                        </div>
                        <Slider
                            value={minLength}
                            onValueChange={setMinLength}
                            max={64}
                            min={8}
                            step={1}
                            className="py-4"
                        />
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
                            placeholder="Find password complexity rules or age policies..."
                        />
                    </div>
                </div>

                {/* Rules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rules.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.type.toLowerCase().includes(searchQuery.toLowerCase())).map((rule) => (
                        <Card key={rule.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all group overflow-hidden border-t-2 border-t-zinc-50 dark:border-t-zinc-800 hover:border-t-zinc-900 dark:hover:border-t-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div className={`h-14 w-14 flex items-center justify-center rounded-2xl border transition-all ${rule.status === 'Enforced' ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 border-zinc-100 dark:border-zinc-700'
                                    }`}>
                                    <rule.icon className="w-6 h-6" />
                                </div>
                                <CustomButton variant="ghost" size="icon" className="text-zinc-400 rounded-xl" onClick={() => toast.info(`Options for ${rule.name}`)}>
                                    <MoreHorizontal className="w-4 h-4" />
                                </CustomButton>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white tracking-tight leading-tight">{rule.name}</h3>
                                    <p className="text-xs text-zinc-400 font-medium mt-1">{rule.type}</p>
                                    <p className="text-xs text-zinc-500 mt-4 leading-relaxed line-clamp-2">{rule.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge className={`rounded-full border-0 text-xs font-semibold tracking-wide py-1 px-3 ${rule.status === 'Enforced' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {rule.status}
                                    </Badge>
                                    <Badge className={`rounded-full border-0 text-xs font-semibold tracking-wide px-3 py-1 ${rule.severity === 'Critical' ? 'bg-red-50 text-red-600' :
                                        rule.severity === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {rule.severity} importance
                                    </Badge>
                                </div>

                                <Separator className="bg-zinc-50 dark:bg-zinc-800/50" />

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <History className="h-5 w-5 text-zinc-300" />
                                        <Terminal className="h-5 w-5 text-zinc-300" />
                                    </div>
                                    <CustomButton variant="ghost" className="h-10 text-xs text-zinc-500 font-semibold tracking-wide hover:text-zinc-900 dark:hover:text-white group-hover:translate-x-1 transition-transform" onClick={() => toast.info(`Modifying logic for ${rule.name}`)}>
                                        Edit rule <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-zinc-500/20 transition-all cursor-pointer group bg-zinc-50/10 dark:bg-zinc-900/10 rounded-3xl" onClick={() => toast.info("Opening rule creation wizard")}>
                        <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500 shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <Plus className="w-10 h-10 text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-semibold text-zinc-400 tracking-wide">Add Directive</h4>
                            <p className="text-xs text-zinc-400 font-medium">Create a new complexity rule</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
