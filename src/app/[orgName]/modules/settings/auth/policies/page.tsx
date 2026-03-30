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
    ShieldAlert,
    Activity,
    TrendingUp
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
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
        { id: "p1", name: "Strict Admin MFA", type: "Conditional Access", enforcedFor: "Admins", impact: "High", icon: Lock },
        { id: "p2", name: "Corporate Network Bypass", type: "Named Location", enforcedFor: "All Users", impact: "Low", icon: Globe },
        { id: "p3", name: "Block Legacy Auth", type: "Protocol Restriction", enforcedFor: "External Users", impact: "Critical", icon: ShieldAlert },
        { id: "p4", name: "Device Health Check", type: "Device Compliance", enforcedFor: "All Employees", impact: "Medium", icon: Monitor },
    ]

    const togglePolicy = (id: string) => {
        setPolicyStates((prev) => ({ ...prev, [id]: !prev[id] }))
        toast.info(`Policy ${policyStates[id] ? "disabled" : "enabled"}`)
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 font-outfit">
            <SubHeader
                title="Conditional Access & Policies"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Policies", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton onClick={() => toast.info("Opening policy simulator")} variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-medium text-sm">
                            Policy Simulator
                        </CustomButton>
                        <CustomButton onClick={() => toast.info("Creating new policy")} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-semibold text-sm shadow-lg border-0">
                            <Plus className="w-4 h-4 mr-2" /> New Policy
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Top Stats Cards - matching dashboard pattern */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white text-xs opacity-80">Active Policies</p>
                                    <p className="text-white text-xl font-semibold mt-1">18</p>
                                    <p className="text-white text-[10px] mt-1">Across all identity scopes</p>
                                </div>
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Simulated Mode</p>
                                    <p className="text-xl font-semibold text-gray-900 mt-1">04</p>
                                    <p className="text-blue-600 text-[10px] mt-1">Report-only policies</p>
                                </div>
                                <Activity className="w-5 h-5 text-primary" />
                            </div>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Signals Evaluated</p>
                                    <p className="text-xl font-semibold text-gray-900 mt-1">1,242</p>
                                    <p className="text-green-600 text-[10px] mt-1">Last hour</p>
                                </div>
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                        </SmallCardContent>
                    </SmallCard>

                    <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <SmallCardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-xs">Blocked Attempts</p>
                                    <p className="text-xl font-semibold text-gray-900 mt-1">3</p>
                                    <p className="text-orange-600 text-[10px] mt-1">By Geo-Fencing</p>
                                </div>
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                        </SmallCardContent>
                    </SmallCard>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search enforcement policies by name or scope..."
                            className="pl-11 border-none focus-visible:ring-0 rounded-lg h-10 bg-transparent text-sm font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2 pr-2">
                        <CustomButton onClick={() => toast.info("Opening filters")} variant="ghost" className="rounded-lg h-9 px-4 font-medium text-xs text-zinc-500">
                            <Settings2 className="w-3.5 h-3.5 mr-2" /> Policy Filters
                        </CustomButton>
                    </div>
                </div>

                {/* Policy Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {policies.map((policy) => (
                        <Card key={policy.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 group overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-3 p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all ${policyStates[policy.id] ? 'bg-gradient-to-r from-primary/70 to-primary text-white' : 'bg-zinc-100 text-zinc-400'
                                        }`}>
                                        <policy.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{policy.name}</h4>
                                        <p className="text-xs text-gray-500">{policy.type}</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={policyStates[policy.id]}
                                    onCheckedChange={() => togglePolicy(policy.id)}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </CardHeader>
                            <CardContent className="space-y-4 px-4 pb-4">
                                <div className="flex items-center gap-2">
                                    <Badge className={`rounded-lg border-0 text-xs font-medium px-2 py-0.5 ${policy.impact === 'Critical' ? 'bg-orange-50 text-orange-600' :
                                        policy.impact === 'High' ? 'bg-blue-50 text-blue-600' :
                                            policy.impact === 'Medium' ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {policy.impact} Impact
                                    </Badge>
                                </div>

                                <Separator className="bg-zinc-100 dark:bg-zinc-800/50" />

                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500">Enforced For</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">{policy.enforcedFor}</p>
                                    </div>
                                    <span className={`text-xs font-medium ${policyStates[policy.id] ? 'text-green-600' : 'text-zinc-400'}`}>
                                        {policyStates[policy.id] ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-end pt-1">
                                    <CustomButton onClick={() => toast.info("Editing policy logic")} variant="ghost" className="h-8 text-xs text-gray-500 font-medium hover:text-primary group-hover:translate-x-1 transition-transform">
                                        Edit Logic <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Template Card */}
                    <div onClick={() => toast.info("Browsing policy templates")} className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/30 transition-all cursor-pointer group bg-white/50 dark:bg-zinc-900/50 rounded-xl">
                        <div className="h-12 w-12 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6 text-zinc-300 group-hover:text-primary" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">Policy Templates</h4>
                            <p className="text-xs text-gray-400 mt-0.5">Use pre-defined NIST & ISO standards</p>
                        </div>
                    </div>
                </div>

                {/* Zero Trust Card */}
                <div className="bg-white rounded-xl shadow-md border p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/70 to-primary flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-gray-900">Zero Trust Enforcement</h4>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Policies are evaluated on every access token request. Changes propagate within 2 minutes across all edge points.
                                </p>
                            </div>
                        </div>
                        <CustomButton onClick={() => toast.info("Starting policy audit")} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-semibold text-sm border-0">
                            Audit Policies
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    )
}
