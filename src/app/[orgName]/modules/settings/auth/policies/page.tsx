"use client"

import { useState } from "react"
import {
    ShieldCheck,
    Plus,
    Search,
    ChevronRight,
    Lock,
    Globe,
    Monitor,
    ShieldAlert,
    Terminal,
    BookOpen,
    SearchCode,
    Loader2,
    Trash2,
    MoreHorizontal,
    Users
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Impact = "Low" | "Medium" | "High" | "Critical"
type Policy = {
    id: string
    name: string
    type: string
    enforcedFor: string
    impact: Impact
    icon: any
    enabled: boolean
}

export default function LoginPoliciesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
    const [isNewPolicyOpen, setIsNewPolicyOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
    const [isAuditOpen, setIsAuditOpen] = useState(false)
    const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const [policies, setPolicies] = useState<Policy[]>([
        { id: "p1", name: "Strict admin MFA", type: "Conditional access", enforcedFor: "Admins", impact: "High", icon: Lock, enabled: true },
        { id: "p2", name: "Corporate network bypass", type: "Named location", enforcedFor: "All users", impact: "Low", icon: Globe, enabled: false },
        { id: "p3", name: "Block legacy auth", type: "Protocol restriction", enforcedFor: "External users", impact: "Critical", icon: ShieldAlert, enabled: true },
        { id: "p4", name: "Device health check", type: "Device compliance", enforcedFor: "All employees", impact: "Medium", icon: Monitor, enabled: true },
    ])

    const [simContext, setSimContext] = useState("external")
    const [simDevice, setSimDevice] = useState("unmanaged")
    const [simResult, setSimResult] = useState<{ outcome: string; matched: string } | null>(null)

    const [newPolicy, setNewPolicy] = useState({
        name: "",
        scope: "all",
        description: "",
        impact: "Medium" as Impact,
        enabled: true
    })

    const togglePolicy = (id: string, value: boolean) => {
        setPolicies(prev => prev.map(p => p.id === id ? { ...p, enabled: value } : p))
        const p = policies.find(x => x.id === id)
        toast.success(`${p?.name} ${value ? "enabled" : "disabled"}`)
    }

    const removePolicy = (id: string) => {
        const p = policies.find(x => x.id === id)
        setPolicies(prev => prev.filter(x => x.id !== id))
        toast.success(`${p?.name} removed`)
        setIsEditOpen(false)
    }

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast.success("Policies saved")
        }, 800)
    }

    const handleCreatePolicy = () => {
        if (!newPolicy.name.trim()) {
            toast.error("Policy name is required")
            return
        }
        const created: Policy = {
            id: String(Date.now()),
            name: newPolicy.name,
            type: "Conditional access",
            enforcedFor: newPolicy.scope === "all" ? "All users" : newPolicy.scope === "admins" ? "Admin groups" : "Guest & external",
            impact: newPolicy.impact,
            icon: ShieldCheck,
            enabled: newPolicy.enabled
        }
        setPolicies(prev => [created, ...prev])
        toast.success(`Policy "${created.name}" created in report-only mode`)
        setIsNewPolicyOpen(false)
        setNewPolicy({ name: "", scope: "all", description: "", impact: "Medium", enabled: true })
    }

    const runSimulation = () => {
        const blocked = simContext === "external" && simDevice !== "compliant"
        const matched = blocked ? policies.find(p => p.type === "Protocol restriction" && p.enabled)?.name || "Block legacy auth" : "None"
        setSimResult({ outcome: blocked ? "Access blocked" : "Access allowed", matched })
        toast.success("Simulation complete")
    }

    const applyTemplate = (name: string) => {
        const tmpl: Policy = {
            id: String(Date.now()),
            name,
            type: "Template",
            enforcedFor: "All users",
            impact: "High",
            icon: BookOpen,
            enabled: false
        }
        setPolicies(prev => [tmpl, ...prev])
        toast.success(`Template "${name}" applied (disabled by default)`)
        setIsTemplatesOpen(false)
    }

    const filtered = policies.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const impactClass = (i: Impact) =>
        i === "Critical" ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" :
        i === "High" ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" :
        i === "Medium" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" :
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Login Policies"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Policies", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold text-sm" onClick={() => setIsSimulatorOpen(true)}>
                            Policy Simulator
                        </CustomButton>
                        <CustomButton onClick={handleSave} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-semibold text-sm shadow-md border-0">
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
                                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-lg shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
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

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                            <div className="flex gap-3 items-center min-w-0">
                                <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center rounded-lg shrink-0">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Templates</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">Pre-built compliance models</p>
                                </div>
                            </div>
                            <CustomButton variant="outline" className="rounded-lg h-9 px-3 font-semibold text-xs" onClick={() => setIsTemplatesOpen(true)}>
                                Browse
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
                        placeholder="Search login policies..."
                        className="pl-11 h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium"
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
                                    <CustomButton variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg h-8 w-8 shrink-0" onClick={() => { setSelectedPolicy(policy); setIsEditOpen(true) }}>
                                        <MoreHorizontal className="w-4 h-4" />
                                    </CustomButton>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={`rounded-md border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase ${policy.enabled ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                                        {policy.enabled ? "Active" : "Inactive"}
                                    </Badge>
                                    <Badge className={`rounded-md border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase ${impactClass(policy.impact)}`}>
                                        {policy.impact} impact
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2 text-xs">
                                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                                    <span className="text-zinc-500 dark:text-zinc-400">Enforced for</span>
                                    <span className="font-semibold text-zinc-900 dark:text-white">{policy.enforcedFor}</span>
                                </div>

                                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <Switch
                                        checked={policy.enabled}
                                        onCheckedChange={(v) => togglePolicy(policy.id, v)}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                    <CustomButton variant="ghost" className="h-8 px-2 text-xs text-zinc-500 dark:text-zinc-400 font-semibold hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 group-hover:translate-x-0.5 transition-all" onClick={() => { setSelectedPolicy(policy); setIsEditOpen(true) }}>
                                        Edit Logic <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <button
                        onClick={() => setIsTemplatesOpen(true)}
                        className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-all cursor-pointer group bg-white/50 dark:bg-zinc-900/30 rounded-xl min-h-[220px]"
                    >
                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                            <BookOpen className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Policy templates</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Use pre-defined NIST & ISO models</p>
                        </div>
                    </button>
                </div>

                {/* Zero Trust Summary */}
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                    <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex gap-4 items-start min-w-0">
                            <div className="h-11 w-11 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Zero Trust Enforcement</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
                                    Policies are evaluated on every access token request. Changes propagate within 2 minutes across all edge points.
                                </p>
                            </div>
                        </div>
                        <CustomButton onClick={() => setIsAuditOpen(true)} className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 text-white rounded-xl h-10 px-5 font-semibold text-sm shrink-0">
                            Audit Policies
                        </CustomButton>
                    </CardContent>
                </Card>
            </div>

            {/* Policy Simulator Dialog */}
            <Dialog open={isSimulatorOpen} onOpenChange={(o) => { setIsSimulatorOpen(o); if (!o) setSimResult(null) }}>
                <DialogContent className="sm:max-w-2xl rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-indigo-600" />
                            Policy Simulator
                        </DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            Predict the enforcement outcome based on user context and signals.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">User Context</Label>
                            <Select value={simContext} onValueChange={setSimContext}>
                                <SelectTrigger className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="internal">Known internal user</SelectItem>
                                    <SelectItem value="external">External / guest</SelectItem>
                                    <SelectItem value="admin">Highly privileged admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Device State</Label>
                            <Select value={simDevice} onValueChange={setSimDevice}>
                                <SelectTrigger className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="compliant">Policy compliant</SelectItem>
                                    <SelectItem value="unmanaged">Unmanaged / BYOD</SelectItem>
                                    <SelectItem value="risky">High risk detected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-3">Predicted Outcome</h4>
                            {simResult ? (
                                <div className="space-y-2">
                                    <div className={`flex items-center justify-between p-3 rounded-lg ${simResult.outcome.includes("blocked") ? 'bg-red-50 text-red-700 border border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50'}`}>
                                        <span className="text-sm font-semibold">{simResult.outcome}</span>
                                        <span className="text-xs font-semibold">Matched: {simResult.matched}</span>
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

            {/* New Policy Sheet */}
            <Sheet open={isNewPolicyOpen} onOpenChange={setIsNewPolicyOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">New login policy</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Define the conditions and controls for access.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Policy name</Label>
                            <Input value={newPolicy.name} onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })} placeholder="e.g. Finance app strict MFA" className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Assignment scope</Label>
                            <Select value={newPolicy.scope} onValueChange={(v) => setNewPolicy({ ...newPolicy, scope: v })}>
                                <SelectTrigger className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All users (tenant global)</SelectItem>
                                    <SelectItem value="admins">Admin groups only</SelectItem>
                                    <SelectItem value="guests">Guest & external identities</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Description</Label>
                            <Textarea value={newPolicy.description} onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })} placeholder="Explain what this policy enforces..." className="rounded-lg min-h-[80px] border-zinc-200 dark:border-zinc-700 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Impact</Label>
                                <Select value={newPolicy.impact} onValueChange={(v) => setNewPolicy({ ...newPolicy, impact: v as Impact })}>
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
                                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Status</Label>
                                <div className="flex items-center gap-2 h-10">
                                    <Switch checked={newPolicy.enabled} onCheckedChange={(v) => setNewPolicy({ ...newPolicy, enabled: v })} className="data-[state=checked]:bg-indigo-600" />
                                    <span className="text-sm font-semibold">{newPolicy.enabled ? "Active" : "Inactive"}</span>
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

            {/* Edit Logic Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">{selectedPolicy?.name}</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Adjust the underlying enforcement rules.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Conditions (JSON)</Label>
                            <Textarea
                                className="min-h-[220px] text-xs p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                                defaultValue={`{
  "enforce": true,
  "conditions": {
    "mfa": "required",
    "risk": "below_medium"
  }
}`}
                            />
                        </div>
                    </div>
                    <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10 font-semibold text-sm" onClick={() => { toast.success("Policy logic updated"); setIsEditOpen(false) }}>Save changes</CustomButton>
                        {selectedPolicy && (
                            <CustomButton variant="outline" className="rounded-lg w-full h-10 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30" onClick={() => removePolicy(selectedPolicy.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Remove policy
                            </CustomButton>
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Templates Sheet */}
            <Sheet open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
                <SheetContent className="sm:max-w-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                            Policy Template Library
                        </SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Standardized enforcement models for quick deployment.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                        {[
                            { name: "NIST 800-63B High", desc: "Strict biometric MFA with short session TTL", version: "v2.0" },
                            { name: "ISO 27001 Access", desc: "Corporate network geofencing and device auth", version: "v1.4" },
                            { name: "GDPR Data Plane", desc: "Privacy-aware login restrictions", version: "v3.1" },
                        ].map((t) => (
                            <button
                                key={t.name}
                                onClick={() => applyTemplate(t.name)}
                                className="w-full text-left p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t.name}</h4>
                                    <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-0 text-[10px] font-semibold">{t.version}</Badge>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.desc}</p>
                            </button>
                        ))}
                    </div>
                    <SheetFooter>
                        <CustomButton variant="outline" className="rounded-lg w-full h-10" onClick={() => setIsTemplatesOpen(false)}>Close</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Audit Sheet */}
            <Sheet open={isAuditOpen} onOpenChange={setIsAuditOpen}>
                <SheetContent className="sm:max-w-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <SearchCode className="w-5 h-5 text-indigo-600" />
                            Policy Compliance Audit
                        </SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Cross-check your policies against active threats.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-4">
                        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-3">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Drift Detection</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">Directory state matches policy definitions</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">MFA coverage on admin accounts is active</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">Some policies in report-only mode</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <CustomButton variant="outline" className="rounded-lg w-full h-10" onClick={() => setIsAuditOpen(false)}>Close</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
