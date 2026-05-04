"use client"

import React, { useState, useEffect } from "react"
import SubHeader from "@/components/custom/SubHeader"
import {
    Lock,
    Plus,
    Search,
    MoreHorizontal,
    ChevronRight,
    RefreshCw,
    KeyRound,
    History,
    ShieldAlert,
    ShieldCheck,
    Loader2,
    Trash2,
    CheckCircle2,
    XCircle
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getOrgAdminSettings, updateOrgAdminSettings } from "@/hooks/orgAdminHooks"

type Rule = {
    id: string
    name: string
    type: string
    enabled: boolean
    icon: any
    description: string
    importance: "Low" | "Medium" | "High" | "Critical"
}

const initialRules: Rule[] = [
    { id: "1", name: "Complexity requirements", type: "Character set", enabled: true, icon: KeyRound, description: "Passwords must contain uppercase, lowercase, numbers, and special characters.", importance: "High" },
    { id: "2", name: "Password history", type: "Rotation", enabled: true, icon: History, description: "Prevent reuse of the last 24 passwords used by the identity.", importance: "Medium" },
    { id: "3", name: "Banned password list", type: "Security", enabled: true, icon: ShieldAlert, description: "Block common passwords like 'Password123' or organization name variants.", importance: "Critical" },
]

export default function PasswordPolicyPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [rotation, setRotation] = useState(true)
    const [minLength, setMinLength] = useState([12])
    const [isTesterOpen, setIsTesterOpen] = useState(false)
    const [isEditRuleOpen, setIsEditRuleOpen] = useState(false)
    const [isAddRuleOpen, setIsAddRuleOpen] = useState(false)
    const [selectedRule, setSelectedRule] = useState<Rule | null>(null)
    const [testPassword, setTestPassword] = useState("")
    const [isPublishing, setIsPublishing] = useState(false)
    const [rules, setRules] = useState<Rule[]>(initialRules)

    const [newRule, setNewRule] = useState({
        name: "",
        type: "Character Set",
        description: "",
        importance: "Medium" as Rule["importance"],
        enabled: true
    })

    useEffect(() => {
        (async () => {
            try {
                const res = await getOrgAdminSettings()
                const s = res?.data?.settings || res?.data?.data || res?.data || {}
                const pp = s?.security?.passwordPolicy
                if (!pp) return
                if (typeof pp.minLength === "number") setMinLength([pp.minLength])
                if (typeof pp.passwordExpiryDays === "number") setRotation(pp.passwordExpiryDays > 0)
                setRules(prev => prev.map(r => {
                    if (r.id === "1") {
                        const enforced = !!(pp.requireUppercase || pp.requireLowercase || pp.requireNumber || pp.requireSpecialChar)
                        return { ...r, enabled: enforced }
                    }
                    if (r.id === "2") {
                        return { ...r, enabled: (pp.preventReuseCount ?? 0) > 0 }
                    }
                    return r
                }))
            } catch {
                // silent fallback
            }
        })()
    }, [])

    const handlePublish = async () => {
        setIsPublishing(true)
        try {
            const complexityEnabled = rules.find(r => r.id === "1")?.enabled ?? false
            const historyEnabled = rules.find(r => r.id === "2")?.enabled ?? false

            await updateOrgAdminSettings({
                security: {
                    passwordPolicy: {
                        minLength: minLength[0],
                        requireUppercase: complexityEnabled,
                        requireLowercase: complexityEnabled,
                        requireNumber: complexityEnabled,
                        requireSpecialChar: complexityEnabled,
                        passwordExpiryDays: rotation ? 90 : 365,
                        preventReuseCount: historyEnabled ? 24 : 0,
                    },
                },
            })
            toast.success("Password policy saved")
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to save password policy")
        } finally {
            setIsPublishing(false)
        }
    }

    const toggleRule = (id: string, value: boolean) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: value } : r))
        const r = rules.find(x => x.id === id)
        toast.success(`${r?.name} ${value ? "enabled" : "disabled"}`)
    }

    const removeRule = (id: string) => {
        const r = rules.find(x => x.id === id)
        setRules(prev => prev.filter(x => x.id !== id))
        toast.success(`${r?.name} removed`)
        setIsEditRuleOpen(false)
    }

    const handleAddRule = () => {
        if (!newRule.name.trim()) {
            toast.error("Rule name is required")
            return
        }
        const created: Rule = {
            id: String(Date.now()),
            name: newRule.name,
            type: newRule.type,
            enabled: newRule.enabled,
            icon: KeyRound,
            description: newRule.description || "Custom password requirement.",
            importance: newRule.importance
        }
        setRules(prev => [...prev, created])
        toast.success(`Rule "${created.name}" added`)
        setIsAddRuleOpen(false)
        setNewRule({ name: "", type: "Character Set", description: "", importance: "Medium", enabled: true })
    }

    const filtered = rules.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const importanceClass = (s: Rule["importance"]) =>
        s === "Critical" ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" :
        s === "High" ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" :
        s === "Medium" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" :
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"

    const checks = {
        length: testPassword.length >= minLength[0],
        upper: /[A-Z]/.test(testPassword),
        lower: /[a-z]/.test(testPassword),
        digit: /[0-9]/.test(testPassword),
        special: /[^A-Za-z0-9]/.test(testPassword),
    }
    const score = Object.values(checks).filter(Boolean).length
    const strength = score <= 2 ? "Weak" : score === 3 ? "Fair" : score === 4 ? "Good" : "Strong"

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Password Policy"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Password Policy", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold text-sm" onClick={() => setIsTesterOpen(true)}>
                            Policy Tester
                        </CustomButton>
                        <CustomButton
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-semibold text-sm shadow-md border-0"
                            onClick={handlePublish}
                            disabled={isPublishing}
                        >
                            {isPublishing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : "Save Policy"}
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
                                    <RefreshCw className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Rotation Policy</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">90-day expiry</p>
                                </div>
                            </div>
                            <Switch checked={rotation} onCheckedChange={(v) => { setRotation(v); toast.success(`Rotation ${v ? "enabled" : "disabled"}`) }} className="data-[state=checked]:bg-indigo-600 shrink-0" />
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <CardContent className="p-5 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex gap-3 items-center min-w-0">
                                    <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center rounded-lg shrink-0">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Minimum Length</p>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{minLength[0]} characters required</p>
                                    </div>
                                </div>
                            </div>
                            <Slider
                                value={minLength}
                                onValueChange={setMinLength}
                                max={64}
                                min={8}
                                step={1}
                                className="pt-2"
                            />
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
                        placeholder="Search password rules..."
                    />
                </div>

                {/* Rules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((rule) => (
                        <Card key={rule.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3 items-start min-w-0">
                                        <div className={`h-11 w-11 flex items-center justify-center rounded-lg shrink-0 transition-colors ${rule.enabled ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                                            <rule.icon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">{rule.name}</h3>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{rule.type}</p>
                                        </div>
                                    </div>
                                    <CustomButton variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg h-8 w-8 shrink-0" onClick={() => { setSelectedRule(rule); setIsEditRuleOpen(true) }}>
                                        <MoreHorizontal className="w-4 h-4" />
                                    </CustomButton>
                                </div>

                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 min-h-[32px]">{rule.description}</p>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={`rounded-md border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase ${rule.enabled ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                                        {rule.enabled ? "Enforced" : "Disabled"}
                                    </Badge>
                                    <Badge className={`rounded-md border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase ${importanceClass(rule.importance)}`}>
                                        {rule.importance}
                                    </Badge>
                                </div>

                                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <Switch
                                        checked={rule.enabled}
                                        onCheckedChange={(v) => toggleRule(rule.id, v)}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                    <CustomButton variant="ghost" className="h-8 px-2 text-xs text-zinc-500 dark:text-zinc-400 font-semibold hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 group-hover:translate-x-0.5 transition-all" onClick={() => { setSelectedRule(rule); setIsEditRuleOpen(true) }}>
                                        Edit Rule <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <button
                        onClick={() => setIsAddRuleOpen(true)}
                        className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-all cursor-pointer group bg-white/50 dark:bg-zinc-900/30 rounded-xl min-h-[220px]"
                    >
                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                            <Plus className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add new rule</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Create a custom requirement</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Policy Tester Dialog */}
            <Dialog open={isTesterOpen} onOpenChange={(o) => { setIsTesterOpen(o); if (!o) setTestPassword("") }}>
                <DialogContent className="sm:max-w-md rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Password Strength Tester</DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">Verify your current policy against a sample password.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Password to test</Label>
                            <Input
                                type="text"
                                placeholder="Enter a password..."
                                className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm"
                                value={testPassword}
                                onChange={(e) => setTestPassword(e.target.value)}
                            />
                        </div>
                        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Strength</h4>
                                <Badge className={`rounded-md border-0 text-[10px] font-semibold uppercase tracking-wide ${
                                    strength === "Strong" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" :
                                    strength === "Good" ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400" :
                                    strength === "Fair" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" :
                                    "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                }`}>
                                    {strength}
                                </Badge>
                            </div>
                            <div className="space-y-1.5 text-xs">
                                {[
                                    { ok: checks.length, label: `At least ${minLength[0]} characters` },
                                    { ok: checks.upper, label: "Contains uppercase letter" },
                                    { ok: checks.lower, label: "Contains lowercase letter" },
                                    { ok: checks.digit, label: "Contains a number" },
                                    { ok: checks.special, label: "Contains a special character" },
                                ].map((c) => (
                                    <div key={c.label} className="flex items-center gap-2">
                                        {c.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-zinc-300 dark:text-zinc-600" />}
                                        <span className={c.ok ? "text-zinc-700 dark:text-zinc-300 font-medium" : "text-zinc-500 dark:text-zinc-400"}>{c.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10" onClick={() => setIsTesterOpen(false)}>Done</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Rule Sheet */}
            <Sheet open={isEditRuleOpen} onOpenChange={setIsEditRuleOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">{selectedRule?.name}</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Modify the enforcement logic for this rule.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Description</Label>
                            <Textarea
                                defaultValue={selectedRule?.description}
                                className="rounded-lg min-h-[88px] border-zinc-200 dark:border-zinc-700 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Importance</Label>
                                <Select defaultValue={selectedRule?.importance}>
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
                                    <Switch
                                        checked={selectedRule?.enabled || false}
                                        onCheckedChange={(v) => {
                                            if (!selectedRule) return
                                            toggleRule(selectedRule.id, v)
                                            setSelectedRule(prev => prev ? { ...prev, enabled: v } : prev)
                                        }}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                    <span className="text-sm font-semibold">{selectedRule?.enabled ? "Enabled" : "Disabled"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10 font-semibold text-sm" onClick={() => { toast.success("Rule updated"); setIsEditRuleOpen(false) }}>Save Changes</CustomButton>
                        {selectedRule && (
                            <CustomButton variant="outline" className="rounded-lg w-full h-10 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30" onClick={() => removeRule(selectedRule.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Remove rule
                            </CustomButton>
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Add Rule Sheet */}
            <Sheet open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">New password rule</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Create a custom credential requirement.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Rule name</Label>
                            <Input value={newRule.name} onChange={(e) => setNewRule({ ...newRule, name: e.target.value })} placeholder="e.g. Reject common phrases" className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Rule type</Label>
                            <Select value={newRule.type} onValueChange={(v) => setNewRule({ ...newRule, type: v })}>
                                <SelectTrigger className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Character Set">Character Set</SelectItem>
                                    <SelectItem value="Max Age">Max Age</SelectItem>
                                    <SelectItem value="History Reuse">History Reuse</SelectItem>
                                    <SelectItem value="Blacklist Matching">Blacklist Matching</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Description</Label>
                            <Textarea value={newRule.description} onChange={(e) => setNewRule({ ...newRule, description: e.target.value })} placeholder="Explain what this rule enforces..." className="rounded-lg min-h-[80px] border-zinc-200 dark:border-zinc-700 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Importance</Label>
                                <Select value={newRule.importance} onValueChange={(v) => setNewRule({ ...newRule, importance: v as Rule["importance"] })}>
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
                                    <Switch checked={newRule.enabled} onCheckedChange={(v) => setNewRule({ ...newRule, enabled: v })} className="data-[state=checked]:bg-indigo-600" />
                                    <span className="text-sm font-semibold">{newRule.enabled ? "Enabled" : "Disabled"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="gap-2">
                        <CustomButton variant="outline" className="rounded-lg flex-1 h-10" onClick={() => setIsAddRuleOpen(false)}>Cancel</CustomButton>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex-1 h-10" onClick={handleAddRule}>Add Rule</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
