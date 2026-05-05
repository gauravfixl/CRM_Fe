"use client"

import React, { useState } from "react"
import SubHeader from "@/components/custom/SubHeader"
import {
    Lock,
    Plus,
    Search,
    MoreHorizontal,
    ChevronRight,
    Monitor,
    Globe,
    AlertTriangle,
    UserCheck,
    ShieldAlert,
    Edit3,
    Trash2,
    Activity,
    Loader2,
    Cpu,
    Zap
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Severity = "Low" | "Medium" | "High" | "Critical"
type Policy = {
    id: string
    name: string
    type: string
    enabled: boolean
    icon: any
    description: string
    severity: Severity
}

export default function ConditionalAccessPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [blockLegacyAuth, setBlockLegacyAuth] = useState(true)
    const [isNewPolicyOpen, setIsNewPolicyOpen] = useState(false)
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
    const [isLogsOpen, setIsLogsOpen] = useState(false)
    const [isManageLogicOpen, setIsManageLogicOpen] = useState(false)
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [simResult, setSimResult] = useState<{ result: string; matched: number } | null>(null)
    const [simIdentity, setSimIdentity] = useState("")
    const [simLocation, setSimLocation] = useState("")

    const [newPolicy, setNewPolicy] = useState({
        name: "",
        type: "Location-based",
        description: "",
        severity: "Medium" as Severity,
        enabled: true
    })

    const [policies, setPolicies] = useState<Policy[]>([
        { id: "1", name: "Block risky countries", type: "Location-based", enabled: true, icon: Globe, description: "Block all authentication attempts from sanctioned or high-risk regions.", severity: "Critical" },
        { id: "2", name: "Require MFA for admin", type: "Role-based", enabled: true, icon: ShieldAlert, description: "Force MFA challenge whenever a privileged role is accessed.", severity: "High" },
        { id: "3", name: "Compliant devices only", type: "Device-health", enabled: false, icon: Monitor, description: "Only allow identities on Intune managed or hybrid joined hardware.", severity: "Medium" },
    ])

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast.success("Conditional access settings saved")
        }, 800)
    }

    const togglePolicy = (id: string, value: boolean) => {
        setPolicies(prev => prev.map(p => p.id === id ? { ...p, enabled: value } : p))
        const p = policies.find(x => x.id === id)
        toast.success(`${p?.name} ${value ? "enabled" : "disabled"}`)
    }

    const handleCreatePolicy = () => {
        if (!newPolicy.name.trim()) {
            toast.error("Policy name is required")
            return
        }
        const created: Policy = {
            id: String(Date.now()),
            name: newPolicy.name,
            type: newPolicy.type,
            enabled: newPolicy.enabled,
            icon: newPolicy.type === "Location-based" ? Globe : newPolicy.type === "Role-based" ? UserCheck : Monitor,
            description: newPolicy.description || "Custom conditional access rule.",
            severity: newPolicy.severity
        }
        setPolicies(prev => [created, ...prev])
        toast.success(`Policy "${created.name}" created`)
        setIsNewPolicyOpen(false)
        setNewPolicy({ name: "", type: "Location-based", description: "", severity: "Medium", enabled: true })
    }

    const handleDeletePolicy = () => {
        if (!selectedPolicy) return
        setPolicies(prev => prev.filter(p => p.id !== selectedPolicy.id))
        toast.success(`Policy "${selectedPolicy.name}" removed`)
        setIsDeleteDialogOpen(false)
        setSelectedPolicy(null)
    }

    const runSimulation = () => {
        if (!simIdentity || !simLocation) {
            toast.error("Provide identity and location to simulate")
            return
        }
        const matched = policies.filter(p => p.enabled).length
        setSimResult({ result: matched > 0 ? "Allow with MFA" : "Allow", matched })
        toast.success("Simulation complete")
    }

    const filtered = policies.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const severityClass = (s: Severity) =>
        s === "Critical" ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" :
        s === "High" ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" :
        s === "Medium" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" :
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Conditional Access"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Conditional Access", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold text-sm" onClick={() => setIsSimulatorOpen(true)}>
                            Policy Simulator
                        </CustomButton>
                        <CustomButton
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-semibold text-sm shadow-md border-0"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : "Save Settings"}
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Settings Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                            <div className="flex gap-3 items-center min-w-0">
                                <div className="h-10 w-10 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center rounded-lg shrink-0">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Risk Protection</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">Block legacy authentication</p>
                                </div>
                            </div>
                            <Switch checked={blockLegacyAuth} onCheckedChange={(v) => { setBlockLegacyAuth(v); toast.success(`Legacy auth blocking ${v ? "enabled" : "disabled"}`) }} className="data-[state=checked]:bg-indigo-600 shrink-0" />
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                            <div className="flex gap-3 items-center min-w-0">
                                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-lg shrink-0">
                                    <UserCheck className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Active Policies</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{policies.filter(p => p.enabled).length} of {policies.length} enforced</p>
                                </div>
                            </div>
                            <CustomButton variant="outline" className="rounded-lg h-9 px-3 font-semibold text-xs" onClick={() => setIsNewPolicyOpen(true)}>
                                <Plus className="w-3.5 h-3.5 mr-1" /> New
                            </CustomButton>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium"
                        placeholder="Search conditional policies..."
                    />
                </div>

                {/* Policies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((policy) => (
                        <Card key={policy.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3 items-start min-w-0">
                                        <div className={`h-11 w-11 flex items-center justify-center rounded-lg shrink-0 transition-colors ${policy.enabled ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                                            <policy.icon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">{policy.name}</h3>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{policy.type}</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <CustomButton variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg h-8 w-8 shrink-0">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </CustomButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-lg p-1 min-w-[180px] shadow-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                            <DropdownMenuLabel className="text-xs font-semibold py-1.5 px-2 text-zinc-500">Manage</DropdownMenuLabel>
                                            <DropdownMenuItem className="text-sm font-medium py-2 flex items-center gap-2 cursor-pointer rounded-md" onClick={() => { setSelectedPolicy(policy); setIsManageLogicOpen(true) }}>
                                                <Edit3 className="w-4 h-4 text-zinc-500" /> Edit rules
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-sm font-medium py-2 flex items-center gap-2 cursor-pointer rounded-md" onClick={() => { setSelectedPolicy(policy); setIsLogsOpen(true) }}>
                                                <Activity className="w-4 h-4 text-zinc-500" /> Evaluation logs
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                                            <DropdownMenuItem className="text-sm font-medium py-2 flex items-center gap-2 cursor-pointer rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => { setSelectedPolicy(policy); setIsDeleteDialogOpen(true) }}>
                                                <Trash2 className="w-4 h-4" /> Remove policy
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 min-h-[32px]">{policy.description}</p>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={`rounded-md border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase ${policy.enabled ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                                        {policy.enabled ? "On" : "Off"}
                                    </Badge>
                                    <Badge className={`rounded-md border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase ${severityClass(policy.severity)}`}>
                                        {policy.severity} risk
                                    </Badge>
                                </div>

                                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <Switch
                                        checked={policy.enabled}
                                        onCheckedChange={(v) => togglePolicy(policy.id, v)}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                    <CustomButton variant="ghost" className="h-8 px-2 text-xs text-zinc-500 dark:text-zinc-400 font-semibold hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 group-hover:translate-x-0.5 transition-all" onClick={() => { setSelectedPolicy(policy); setIsManageLogicOpen(true) }}>
                                        Manage <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <button
                        onClick={() => setIsNewPolicyOpen(true)}
                        className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-all cursor-pointer group bg-white/50 dark:bg-zinc-900/30 rounded-xl min-h-[220px]"
                    >
                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                            <Plus className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">New Policy</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Create a new conditional gate</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* New Policy Sheet */}
            <Sheet open={isNewPolicyOpen} onOpenChange={setIsNewPolicyOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">Create new policy</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            Define a new conditional access rule.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Policy name</Label>
                            <Input
                                placeholder="e.g. Block non-compliant devices"
                                className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm"
                                value={newPolicy.name}
                                onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Condition type</Label>
                            <Select value={newPolicy.type} onValueChange={(v) => setNewPolicy({ ...newPolicy, type: v })}>
                                <SelectTrigger className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Location-based">Location-based</SelectItem>
                                    <SelectItem value="Role-based">Role-based</SelectItem>
                                    <SelectItem value="Device-health">Device-health</SelectItem>
                                    <SelectItem value="Risk-based">Risk-based</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Description</Label>
                            <Textarea
                                placeholder="Explain the intent of this policy..."
                                className="rounded-lg min-h-[88px] border-zinc-200 dark:border-zinc-700 text-sm"
                                value={newPolicy.description}
                                onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Severity</Label>
                                <Select value={newPolicy.severity} onValueChange={(v) => setNewPolicy({ ...newPolicy, severity: v as Severity })}>
                                    <SelectTrigger className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Initial status</Label>
                                <div className="flex items-center gap-3 h-10">
                                    <Switch checked={newPolicy.enabled} onCheckedChange={(v) => setNewPolicy({ ...newPolicy, enabled: v })} className="data-[state=checked]:bg-indigo-600" />
                                    <span className="text-sm font-semibold">{newPolicy.enabled ? "Enabled" : "Disabled"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="gap-2">
                        <CustomButton variant="outline" className="rounded-lg flex-1 h-10" onClick={() => setIsNewPolicyOpen(false)}>Cancel</CustomButton>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex-1 h-10" onClick={handleCreatePolicy}>Create policy</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Policy Simulator Dialog */}
            <Dialog open={isSimulatorOpen} onOpenChange={(o) => { setIsSimulatorOpen(o); if (!o) { setSimResult(null); setSimIdentity(""); setSimLocation("") } }}>
                <DialogContent className="sm:max-w-[600px] rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-indigo-600" />
                            Policy Simulator
                        </DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            Test how your policies would react to specific authentication signals.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Identity</Label>
                                <Input value={simIdentity} onChange={(e) => setSimIdentity(e.target.value)} placeholder="user@company.com" className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Location</Label>
                                <Input value={simLocation} onChange={(e) => setSimLocation(e.target.value)} placeholder="Country or IP" className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm" />
                            </div>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-indigo-500" />
                                Predicted Outcome
                            </h4>
                            {simResult ? (
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-500 dark:text-zinc-400 font-medium">Result</span>
                                        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-0 font-semibold">{simResult.result}</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-zinc-500 dark:text-zinc-400 font-medium">Matched policies</span>
                                        <span className="font-semibold">{simResult.matched}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Run the simulation to see outcomes.</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <CustomButton variant="outline" className="rounded-lg flex-1 h-10" onClick={() => setIsSimulatorOpen(false)}>Close</CustomButton>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex-1 h-10" onClick={runSimulation}>Run simulation</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Evaluation Logs Sheet */}
            <Sheet open={isLogsOpen} onOpenChange={setIsLogsOpen}>
                <SheetContent className="sm:max-w-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">Evaluation logs</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            Recent enforcement events triggered by <span className="font-semibold">{selectedPolicy?.name}</span>.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">2026-05-04 · 14:2{i}</span>
                                    <Badge className="bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border-0 text-[10px] uppercase font-semibold px-2 tracking-wide">Blocked</Badge>
                                </div>
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Login attempt from restricted IP</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">user{i}@company.com · IP 45.12.33.{i}</p>
                            </div>
                        ))}
                    </div>
                    <SheetFooter>
                        <CustomButton variant="outline" className="rounded-lg w-full h-10" onClick={() => setIsLogsOpen(false)}>Close</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Manage Logic Sheet */}
            <Sheet open={isManageLogicOpen} onOpenChange={setIsManageLogicOpen}>
                <SheetContent className="sm:max-w-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">{selectedPolicy?.name}</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            Configure the underlying rules and signals for this policy.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">Assignments</h4>
                                <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-0">All users</Badge>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">This policy applies to all users excluding the break-glass group.</p>
                            <CustomButton size="sm" variant="outline" className="h-8 rounded-lg text-xs font-semibold" onClick={() => toast.info("Open assignments editor")}>Modify groups</CustomButton>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Conditions</h4>
                            <div className="space-y-2">
                                {[
                                    { label: "Device platform", value: "Any" },
                                    { label: "Location", value: "Restricted regions" },
                                    { label: "Client app", value: "Any" }
                                ].map((c) => (
                                    <div key={c.label} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                                        <span className="text-sm font-medium">{c.label}</span>
                                        <Badge variant="outline" className="text-xs font-semibold border-zinc-200 dark:border-zinc-700">{c.value}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="gap-2">
                        <CustomButton variant="outline" className="rounded-lg flex-1 h-10" onClick={() => setIsManageLogicOpen(false)}>Cancel</CustomButton>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex-1 h-10" onClick={() => { toast.success("Policy logic updated"); setIsManageLogicOpen(false) }}>Save changes</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <div className="h-12 w-12 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-2">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">Remove policy?</DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            This will permanently delete <span className="font-semibold">{selectedPolicy?.name}</span>. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <CustomButton variant="outline" className="rounded-lg flex-1 h-10">Cancel</CustomButton>
                        </DialogClose>
                        <CustomButton className="bg-red-600 hover:bg-red-700 text-white rounded-lg flex-1 h-10" onClick={handleDeletePolicy}>Remove</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
