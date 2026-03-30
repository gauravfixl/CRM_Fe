"use client"

import { useState } from "react"
import {
    ShieldCheck,
    Plus,
    Search,
    Settings2,
    ToggleLeft,
    ToggleRight,
    ChevronRight,
    MoreVertical,
    Lock,
    Globe,
    Monitor,
    Smartphone,
    Info,
    Zap,
    ShieldAlert
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function LoginPoliciesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [policyStates, setPolicyStates] = useState<Record<string, boolean>>({
        p1: true,
        p2: false,
        p3: true,
        p4: true,
    })

    const policies = [
        { id: "p1", name: "Strict Admin MFA", type: "Conditional Access", enforcedFor: "Admins", status: true, impact: "High", icon: Lock },
        { id: "p2", name: "Corporate Network Bypass", type: "Named Location", enforcedFor: "All Users", status: false, impact: "Low", icon: Globe },
        { id: "p3", name: "Block Legacy Auth", type: "Protocol Restriction", enforcedFor: "External Users", status: true, impact: "Critical", icon: ShieldAlert },
        { id: "p4", name: "Device Health Check", type: "Device Compliance", enforcedFor: "All Employees", status: true, impact: "Medium", icon: Monitor },
    ]

    const togglePolicy = (id: string) => {
        setPolicyStates((prev) => ({ ...prev, [id]: !prev[id] }))
        toast.info(`Policy ${policyStates[id] ? "disabled" : "enabled"}`)
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Conditional Access & Policies"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Policies", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton onClick={() => toast.info("Opening policy simulator")} variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold">
                            Policy Simulator
                        </CustomButton>
                        <CustomButton onClick={() => toast.info("Creating new policy")} className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl h-10 px-6 font-bold text-xs tracking-widest shadow-xl border-0">
                            <Plus className="w-4 h-4 mr-2" /> New Policy
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Policy HUD */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden divide-x divide-zinc-100 dark:divide-zinc-800">
                    <div className="p-8 space-y-4">
                        <span className="text-xs font-bold text-zinc-400 tracking-widest">Active Enforcement</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold italic">18</span>
                            <span className="text-xs font-bold text-emerald-500 tracking-tight">Active</span>
                        </div>
                        <p className="text-xs font-bold text-zinc-400 tracking-widest">Across all identity scopes</p>
                    </div>
                    <div className="p-8 space-y-4">
                        <span className="text-xs font-bold text-zinc-400 tracking-widest">Simulated Mode</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold italic text-zinc-300">04</span>
                            <span className="text-xs font-bold text-blue-500 tracking-tight">Testing</span>
                        </div>
                        <p className="text-xs font-bold text-zinc-400 tracking-widest">Report-only active policies</p>
                    </div>
                    <div className="p-6 space-y-4 col-span-1 md:col-span-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white relative overflow-hidden group rounded-r-2xl">
                        <Zap className="absolute -bottom-10 -right-10 h-48 w-48 opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="relative z-10 space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-indigo-600 text-white rounded-lg border-0 text-xs font-bold px-2">Real-time</Badge>
                                <h5 className="text-sm font-bold tracking-widest">Signal Evaluation</h5>
                            </div>
                            <p className="text-zinc-300 font-medium leading-relaxed italic opacity-90">
                                Evaluated 1,242 signals in the last hour. 3 authentication attempts blocked by <span className="text-white italic underline decoration-indigo-500/50">Geo-Fencing</span> policy.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search enforcement policies by name or scope..."
                            className="pl-11 border-none focus-visible:ring-0 rounded-lg h-12 bg-transparent font-bold"
                        />
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                        <CustomButton onClick={() => toast.info("Opening filters")} variant="ghost" className="rounded-lg h-10 px-4 font-bold text-xs tracking-widest text-zinc-500">
                            <Settings2 className="w-3.5 h-3.5 mr-2" /> Policy Filters
                        </CustomButton>
                    </div>
                </div>

                {/* Policy Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {policies.map((policy) => (
                        <Card key={policy.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-2xl transition-all group overflow-hidden border-t-4 border-t-zinc-900 data-[impact=Critical]:border-t-orange-600 data-[impact=High]:border-t-indigo-600" data-impact={policy.impact}>
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div className={`h-12 w-12 flex items-center justify-center border transition-all rounded-lg ${policyStates[policy.id] ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-300 border-zinc-100'
                                    }`}>
                                    <policy.icon className="w-6 h-6" />
                                </div>
                                <Switch
                                    checked={policyStates[policy.id]}
                                    onCheckedChange={() => togglePolicy(policy.id)}
                                    className="data-[state=checked]:bg-indigo-600 rounded-xl h-6 w-11"
                                />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">{policy.name}</h4>
                                        <Badge className={`rounded-lg border-0 text-[8px] font-bold tracking-widest px-2 ${policy.impact === 'Critical' ? 'bg-orange-50 text-orange-600' : 'bg-zinc-50 text-zinc-400'
                                            }`}>
                                            {policy.impact} Impact
                                        </Badge>
                                    </div>
                                    <p className="text-xs font-bold text-zinc-400 tracking-widest">{policy.type}</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold tracking-widest text-zinc-500">
                                        <span>Enforced For</span>
                                        <span className="text-zinc-900 dark:text-zinc-100 italic">{policy.enforcedFor}</span>
                                    </div>
                                    <Separator className="bg-zinc-50 dark:bg-zinc-800/50" />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <span className={`text-xs font-bold tracking-[0.2em] ${policyStates[policy.id] ? 'text-emerald-500' : 'text-zinc-300'
                                        }`}>
                                        {policyStates[policy.id] ? 'Directory Active' : 'Inactive (Staging)'}
                                    </span>
                                    <CustomButton onClick={() => toast.info("Editing policy logic")} variant="ghost" className="h-10 text-xs text-zinc-500 font-bold tracking-widest hover:text-indigo-600 group-hover:translate-x-1 transition-transform">
                                        Edit Logic <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Template Card */}
                    <div onClick={() => toast.info("Browsing policy templates")} className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-indigo-500/20 transition-all cursor-pointer group bg-white/50 dark:bg-zinc-900/50 rounded-2xl">
                        <div className="h-16 w-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 text-zinc-300" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-zinc-400 tracking-widest">Policy Templates</h4>
                            <p className="text-xs text-zinc-400 font-medium">Use pre-defined NIST & ISO standards</p>
                        </div>
                    </div>
                </div>

                {/* Simulation Footer */}
                <div className="bg-indigo-600 p-8 rounded-2xl text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 mt-12 relative overflow-hidden">
                    <ShieldCheck className="absolute -bottom-10 -left-10 h-64 w-64 opacity-10" />
                    <div className="relative z-10 space-y-2 text-center md:text-left">
                        <h4 className="text-2xl font-bold tracking-tighter text-white">Directory Zero Trust Enforcement</h4>
                        <p className="text-zinc-100 text-sm font-medium opacity-90 max-w-lg leading-relaxed italic">
                            Policies are evaluated every time a user requests an access token. Changes to conditional access might take up to 2 minutes to propagate across all edge points.
                        </p>
                    </div>
                    <CustomButton onClick={() => toast.info("Starting policy audit")} className="relative z-10 bg-white text-indigo-600 hover:bg-zinc-100 rounded-xl h-14 px-12 font-bold text-xs tracking-widest border-0">
                        Audit All Policies
                    </CustomButton>
                </div>
            </div>
        </div>
    )
}
