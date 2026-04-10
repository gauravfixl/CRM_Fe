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
    TrendingUp,
    Terminal,
    Settings,
    Users,
    BookOpen,
    SearchCode,
    BarChart3,
    Shield,
    FileText
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function LoginPoliciesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [policyStates, setPolicyStates] = useState<Record<string, boolean>>({
        p1: true,
        p2: false,
        p3: true,
        p4: true,
    })
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
    const [isNewPolicyOpen, setIsNewPolicyOpen] = useState(false)
    const [isEditLogicOpen, setIsEditLogicOpen] = useState(false)
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
    const [isAuditOpen, setIsAuditOpen] = useState(false)
    const [selectedPolicy, setSelectedPolicy] = useState<any>(null)

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
                        <CustomButton onClick={() => setIsSimulatorOpen(true)} variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-medium text-sm">
                            Policy Simulator
                        </CustomButton>
                        <CustomButton onClick={() => setIsNewPolicyOpen(true)} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-semibold text-sm shadow-lg border-0">
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
                        <CustomButton onClick={() => toast.info("Advanced policy filters coming soon")} variant="ghost" className="rounded-lg h-9 px-4 font-medium text-xs text-zinc-500">
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
                                    <CustomButton onClick={() => { setSelectedPolicy(policy); setIsEditLogicOpen(true); }} variant="ghost" className="h-8 text-xs text-gray-500 font-medium hover:text-primary group-hover:translate-x-1 transition-transform">
                                        Edit Logic <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div onClick={() => setIsTemplatesOpen(true)} className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/30 transition-all cursor-pointer group bg-white/50 dark:bg-zinc-900/50 rounded-xl">
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
                        <CustomButton onClick={() => setIsAuditOpen(true)} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-semibold text-sm border-0">
                            Audit Policies
                        </CustomButton>
                </div>
            </div>

            {/* Modals & Sheets */}

                {/* Policy Simulator Dialog */}
                <Dialog open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
                    <DialogContent className="sm:max-w-2xl rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-primary" />
                                Policy Simulator (What-If Analysis)
                            </DialogTitle>
                            <DialogDescription>
                                Predict the enforcement outcome based on specific user context and signals.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-6 grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">User Context</Label>
                                <Select defaultValue="external">
                                    <SelectTrigger className="rounded-xl h-11 border-zinc-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="internal">Known Internal User</SelectItem>
                                        <SelectItem value="external">External / Guest</SelectItem>
                                        <SelectItem value="admin">Highly Privileged Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Device State</Label>
                                <Select defaultValue="unmanaged">
                                    <SelectTrigger className="rounded-xl h-11 border-zinc-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="compliant">Policy Compliant</SelectItem>
                                        <SelectItem value="unmanaged">Unmanaged / BYOD</SelectItem>
                                        <SelectItem value="risky">High Risk Detected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Settings className="w-3 h-3" /> Enforcement Outcome
                                </h4>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 text-red-700 border border-red-100">
                                    <span className="text-sm font-bold">ACCESS BLOCKED</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest">Matched: Protocol Restriction</span>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* New Policy Sheet */}
                <Sheet open={isNewPolicyOpen} onOpenChange={setIsNewPolicyOpen}>
                    <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <SheetHeader>
                            <SheetTitle className="text-2xl font-bold tracking-tight">New Enforcement Policy</SheetTitle>
                            <SheetDescription className="text-zinc-500 font-medium italic">Define the conditions and controls for access.</SheetDescription>
                        </SheetHeader>
                        <div className="py-8 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Policy Name</Label>
                                <Input placeholder="e.g. Finance App Strict MFA" className="rounded-xl h-11 border-zinc-200" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Assignment Scope</Label>
                                <Select>
                                    <SelectTrigger className="rounded-xl h-11 border-zinc-200">
                                        <SelectValue placeholder="Select users/groups" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="all">Everywhere (Tenant Global)</SelectItem>
                                        <SelectItem value="admins">Admin Groups Only</SelectItem>
                                        <SelectItem value="guests">Guest & External Identities</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="p-4 rounded-2xl bg-primary text-white space-y-4">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-80">
                                    <Users className="w-3 h-3" /> Targeted Population
                                </div>
                                <p className="text-sm font-medium leading-relaxed italic opacity-90">
                                    This policy will affect approximately <span className="underline decoration-white/30 decoration-2">1,240 identities</span>.
                                </p>
                                <CustomButton className="w-full bg-white text-primary hover:bg-zinc-100 rounded-xl font-bold text-xs tracking-widest h-11" onClick={() => { toast.success("Policy created in report-only mode"); setIsNewPolicyOpen(false); }}>PROVISION POLICY</CustomButton>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Edit Logic Sheet */}
                <Sheet open={isEditLogicOpen} onOpenChange={setIsEditLogicOpen}>
                    <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <SheetHeader>
                            <SheetTitle className="text-2xl font-bold tracking-tight italic">Logic: {selectedPolicy?.name}</SheetTitle>
                            <SheetDescription className="text-zinc-500 font-medium italic">Adjust the underlying enforcement rules.</SheetDescription>
                        </SheetHeader>
                        <div className="py-8 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">JSON Blueprint</Label>
                                <Textarea 
                                    className="min-h-[250px] font-mono text-xs p-4 rounded-xl bg-zinc-50 border-zinc-200 italic"
                                    defaultValue={`{\n  "enforce": "true",\n  "conditions": {\n    "mfa": "required",\n    "risk": "below_medium"\n  }\n}`}
                                />
                            </div>
                            <CustomButton className="w-full h-11 bg-primary text-white rounded-xl font-bold text-xs tracking-widest" onClick={() => { toast.success("Logic blueprint updated"); setIsEditLogicOpen(false); }}>COMPOSE BLUEPRINT</CustomButton>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Templates Sheet */}
                <Sheet open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
                    <SheetContent className="sm:max-w-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <SheetHeader>
                            <SheetTitle className="text-2xl font-bold tracking-tight italic flex items-center gap-3">
                                <BookOpen className="w-6 h-6 text-primary" />
                                Policy Template Library
                            </SheetTitle>
                            <SheetDescription className="text-zinc-500 font-medium">Standardized enforcement models for quick deployment.</SheetDescription>
                        </SheetHeader>
                        <div className="py-8 space-y-4">
                            {[
                                { name: "NIST 800-63B High", desc: "Strict biometric MFA + short session TTL", version: "v2.0" },
                                { name: "ISO 27001 Access", desc: "Corporate network geofencing + device auth", version: "v1.4" },
                                { name: "GDPR Data Plane", desc: "Privacy aware login restrictions", version: "v3.1" },
                            ].map((t) => (
                                <div key={t.name} className="p-4 rounded-2xl border border-zinc-100 hover:border-primary transition-all cursor-pointer group">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{t.name}</h4>
                                        <Badge className="bg-zinc-50 text-zinc-400 font-bold text-[10px]">{t.version}</Badge>
                                    </div>
                                    <p className="text-xs text-zinc-500 italic font-medium">{t.desc}</p>
                                </div>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Audit Sheet */}
                <Sheet open={isAuditOpen} onOpenChange={setIsAuditOpen}>
                    <SheetContent className="sm:max-w-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                        <SheetHeader>
                            <SheetTitle className="text-2xl font-bold tracking-tight italic flex items-center gap-3">
                                <SearchCode className="w-6 h-6 text-primary" />
                                Policy Compliance Audit
                            </SheetTitle>
                            <SheetDescription className="text-zinc-500 font-medium">Cross-referencing your policies against current threats.</SheetDescription>
                        </SheetHeader>
                        <div className="py-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex flex-col items-center justify-center text-center">
                                    <TrendingUp className="w-8 h-8 mb-2" />
                                    <p className="text-2xl font-black">94.2%</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Health index</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-blue-50 text-blue-700 border border-blue-100 flex flex-col items-center justify-center text-center">
                                    <Activity className="w-8 h-8 mb-2" />
                                    <p className="text-2xl font-black">1.2s</p>
                                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Avg latency</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-zinc-900 text-white space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">Continuous Drift Detection</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                        <p className="text-xs font-semibold italic">Directory state matches policy definitions</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                        <p className="text-xs font-semibold italic">MFA coverage: 100% of admin accounts</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
