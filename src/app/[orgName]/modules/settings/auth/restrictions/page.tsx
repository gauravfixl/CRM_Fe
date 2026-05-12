"use client"

import React, { useState, useEffect } from "react"
import SubHeader from "@/components/custom/SubHeader"
import {
    Plus,
    Search,
    MoreHorizontal,
    ChevronRight,
    Globe,
    Clock,
    UserX,
    MonitorOff,
    History,
    Loader2,
    Trash2
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getOrgAdminSettings, updateOrgAdminSettings } from "@/hooks/orgAdminHooks"

type Severity = "Low" | "Medium" | "High" | "Critical"
type Restriction = {
    id: string
    name: string
    type: string
    enabled: boolean
    icon: any
    description: string
    severity: Severity
    mode: "Block" | "Challenge"
}

export default function LoginRestrictionsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [smartLockout, setSmartLockout] = useState(true)
    const [savingActive, setSavingActive] = useState(false)
    const [isLogsOpen, setIsLogsOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedRes, setSelectedRes] = useState<Restriction | null>(null)

    const [restrictions, setRestrictions] = useState<Restriction[]>([
        { id: "1", name: "IP range whitelist", type: "Network", enabled: true, icon: Globe, description: "Only allow logins from corporate HQ and trusted VPN ranges.", severity: "Critical", mode: "Block" },
        { id: "2", name: "Time-based login", type: "Schedule", enabled: true, icon: Clock, description: "Block authentication for standard users during non-business hours.", severity: "Medium", mode: "Challenge" },
        { id: "3", name: "Unmanaged device block", type: "Hardware", enabled: false, icon: MonitorOff, description: "Prevent logins from personal laptops or unverified mobile devices.", severity: "High", mode: "Block" },
    ])

    const [newRes, setNewRes] = useState({
        name: "",
        type: "Network",
        description: "",
        severity: "Medium" as Severity,
        enabled: true
    })

    useEffect(() => {
        (async () => {
            try {
                const res = await getOrgAdminSettings()
                const s = res?.data?.settings || res?.data?.data || res?.data || {}
                const ipR = s?.security?.ipRestrictions
                if (typeof ipR?.enabled === "boolean") setSmartLockout(ipR.enabled)
            } catch {
                // silent fallback
            }
        })()
    }, [])

    const handleLockoutChange = async (newVal: boolean) => {
        const prev = smartLockout
        setSmartLockout(newVal)
        setSavingActive(true)
        try {
            await updateOrgAdminSettings({ security: { ipRestrictions: { enabled: newVal } } })
            toast.success(`Smart lockout ${newVal ? "enabled" : "disabled"}`)
        } catch (err: any) {
            setSmartLockout(prev)
            toast.error(err?.response?.data?.message || "Failed to update lockout")
        } finally {
            setSavingActive(false)
        }
    }

    const toggleRestriction = (id: string, value: boolean) => {
        setRestrictions(prev => prev.map(r => r.id === id ? { ...r, enabled: value } : r))
        const r = restrictions.find(x => x.id === id)
        toast.success(`${r?.name} ${value ? "enabled" : "disabled"}`)
    }

    const removeRestriction = (id: string) => {
        const r = restrictions.find(x => x.id === id)
        setRestrictions(prev => prev.filter(x => x.id !== id))
        toast.success(`${r?.name} removed`)
        setIsEditOpen(false)
    }

    const handleAdd = () => {
        if (!newRes.name.trim()) {
            toast.error("Restriction name is required")
            return
        }
        const iconForType = newRes.type === "Network" ? Globe :
            newRes.type === "Schedule" ? Clock :
                newRes.type === "Geographic" ? Globe : MonitorOff
        const created: Restriction = {
            id: String(Date.now()),
            name: newRes.name,
            type: newRes.type,
            enabled: newRes.enabled,
            icon: iconForType,
            description: newRes.description || "Custom login restriction.",
            severity: newRes.severity,
            mode: "Block"
        }
        setRestrictions(prev => [created, ...prev])
        toast.success(`Restriction "${created.name}" added`)
        setIsAddOpen(false)
        setNewRes({ name: "", type: "Network", description: "", severity: "Medium", enabled: true })
    }

    const updateMode = (mode: "Block" | "Challenge") => {
        if (!selectedRes) return
        setRestrictions(prev => prev.map(r => r.id === selectedRes.id ? { ...r, mode } : r))
        setSelectedRes(prev => prev ? { ...prev, mode } : prev)
        toast.success(`Mode set to ${mode}`)
    }

    const filtered = restrictions.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const severityClass = (s: Severity) =>
        s === "Critical" ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" :
        s === "High" ? "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" :
        s === "Medium" ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" :
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Login Restrictions"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Login Restrictions", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold text-sm" onClick={() => setIsLogsOpen(true)}>
                            View Logs
                        </CustomButton>
                        <CustomButton onClick={() => setIsAddOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-semibold text-sm shadow-md border-0">
                            <Plus className="w-4 h-4 mr-2" /> Add Restriction
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
                                    <UserX className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Global Lockout</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">Smart lockout protection</p>
                                </div>
                            </div>
                            <Switch checked={smartLockout} onCheckedChange={handleLockoutChange} disabled={savingActive} className="data-[state=checked]:bg-indigo-600 shrink-0" />
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                            <div className="flex gap-3 items-center min-w-0">
                                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-lg shrink-0">
                                    <History className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Active Restrictions</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{restrictions.filter(r => r.enabled).length} of {restrictions.length} enforced</p>
                                </div>
                            </div>
                            <CustomButton variant="outline" className="rounded-lg h-9 px-3 font-semibold text-xs" onClick={() => setIsLogsOpen(true)}>
                                View Logs
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
                        placeholder="Search login restrictions..."
                    />
                </div>

                {/* Restrictions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((res) => (
                        <Card key={res.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3 items-start min-w-0">
                                        <div className={`h-11 w-11 flex items-center justify-center rounded-lg shrink-0 transition-colors ${res.enabled ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                                            <res.icon className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">{res.name}</h3>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{res.type}</p>
                                        </div>
                                    </div>
                                    <CustomButton variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg h-8 w-8 shrink-0" onClick={() => { setSelectedRes(res); setIsEditOpen(true) }}>
                                        <MoreHorizontal className="w-4 h-4" />
                                    </CustomButton>
                                </div>

                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 min-h-[32px]">{res.description}</p>

                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={`rounded-md border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase ${res.enabled ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                                        {res.enabled ? "Active" : "Paused"}
                                    </Badge>
                                    <Badge className={`rounded-md border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase ${severityClass(res.severity)}`}>
                                        {res.severity}
                                    </Badge>
                                    <Badge className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 border-0 rounded-md text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase">
                                        {res.mode}
                                    </Badge>
                                </div>

                                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                    <Switch
                                        checked={res.enabled}
                                        onCheckedChange={(v) => toggleRestriction(res.id, v)}
                                        className="data-[state=checked]:bg-indigo-600"
                                    />
                                    <CustomButton variant="ghost" className="h-8 px-2 text-xs text-zinc-500 dark:text-zinc-400 font-semibold hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 group-hover:translate-x-0.5 transition-all" onClick={() => { setSelectedRes(res); setIsEditOpen(true) }}>
                                        Edit <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-all cursor-pointer group bg-white/50 dark:bg-zinc-900/30 rounded-xl min-h-[220px]"
                    >
                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                            <Plus className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">New restriction</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Create a new login gate</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Restriction Logs Sheet */}
            <Sheet open={isLogsOpen} onOpenChange={setIsLogsOpen}>
                <SheetContent className="sm:max-w-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <History className="w-5 h-5 text-indigo-600" />
                            Restriction Logs
                        </SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Recent events where access was restricted by these policies.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                        {[
                            { user: "j.doe@example.com", reason: "IP range mismatch", time: "2 min ago", location: "Mumbai, IN", status: "Blocked" },
                            { user: "admin@fixl.solutions", reason: "After-hours access", time: "45 min ago", location: "San Francisco, US", status: "Blocked" },
                            { user: "m.smith@corp.com", reason: "Unmanaged device", time: "3 hours ago", location: "London, UK", status: "Challenged" },
                        ].map((log, i) => (
                            <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                <div className="space-y-1 min-w-0">
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{log.user}</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {log.reason} <span className="mx-1.5 text-zinc-300">•</span> {log.location}
                                    </p>
                                </div>
                                <div className="text-right shrink-0 ml-3">
                                    <Badge className={`mb-1 rounded-md border-0 text-[10px] font-semibold uppercase tracking-wide ${log.status === 'Blocked' ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'}`}>{log.status}</Badge>
                                    <p className="text-[10px] font-medium text-zinc-400">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <SheetFooter>
                        <CustomButton variant="outline" className="rounded-lg w-full h-10" onClick={() => setIsLogsOpen(false)}>Close</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Add Restriction Sheet */}
            <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">New login restriction</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Establish a new access perimeter.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Name</Label>
                            <Input value={newRes.name} onChange={(e) => setNewRes({ ...newRes, name: e.target.value })} placeholder="e.g. Asia-Pacific offices" className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Type</Label>
                            <Select value={newRes.type} onValueChange={(v) => setNewRes({ ...newRes, type: v })}>
                                <SelectTrigger className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Network">IP range / CIDR</SelectItem>
                                    <SelectItem value="Schedule">Time window</SelectItem>
                                    <SelectItem value="Geographic">Geographic region</SelectItem>
                                    <SelectItem value="Hardware">Device serial / ID</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Description</Label>
                            <Textarea value={newRes.description} onChange={(e) => setNewRes({ ...newRes, description: e.target.value })} placeholder="Explain what this restriction enforces..." className="rounded-lg min-h-[80px] border-zinc-200 dark:border-zinc-700 text-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Severity</Label>
                                <Select value={newRes.severity} onValueChange={(v) => setNewRes({ ...newRes, severity: v as Severity })}>
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
                                    <Switch checked={newRes.enabled} onCheckedChange={(v) => setNewRes({ ...newRes, enabled: v })} className="data-[state=checked]:bg-indigo-600" />
                                    <span className="text-sm font-semibold">{newRes.enabled ? "Enabled" : "Disabled"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="gap-2">
                        <CustomButton variant="outline" className="rounded-lg flex-1 h-10" onClick={() => setIsAddOpen(false)}>Cancel</CustomButton>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex-1 h-10" onClick={handleAdd}>Add Restriction</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Edit Restriction Sheet */}
            <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">{selectedRes?.name}</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Adjust the enforcement logic for this restriction.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-5">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Enforcement Mode</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {(["Block", "Challenge"] as const).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => updateMode(m)}
                                        className={`p-3 rounded-lg border text-left transition-all ${selectedRes?.mode === m ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30' : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'}`}
                                    >
                                        <div className="text-sm font-semibold">{m}</div>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{m === "Block" ? "Disallow access" : "Step-up MFA"}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-semibold">Active</Label>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Currently enforcing</p>
                            </div>
                            <Switch
                                checked={selectedRes?.enabled || false}
                                onCheckedChange={(v) => {
                                    if (!selectedRes) return
                                    toggleRestriction(selectedRes.id, v)
                                    setSelectedRes(prev => prev ? { ...prev, enabled: v } : prev)
                                }}
                                className="data-[state=checked]:bg-indigo-600"
                            />
                        </div>
                    </div>
                    <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10 font-semibold text-sm" onClick={() => { toast.success("Restriction updated"); setIsEditOpen(false) }}>Save changes</CustomButton>
                        {selectedRes && (
                            <CustomButton variant="outline" className="rounded-lg w-full h-10 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30" onClick={() => removeRestriction(selectedRes.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Remove restriction
                            </CustomButton>
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
