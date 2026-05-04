"use client"

import React, { useState } from "react"
import SubHeader from "@/components/custom/SubHeader"
import {
    Fingerprint,
    Key,
    Plus,
    Search,
    ChevronRight,
    Lock,
    Monitor,
    KeyRound,
    BookOpen,
    Shield,
    Globe,
    Loader2,
    Trash2
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Tech = {
    id: string
    name: string
    type: string
    enabled: boolean
    icon: any
    description: string
    security: "Highest" | "Very High" | "High"
}

export default function PasswordlessSecurityPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [allowPasskeys, setAllowPasskeys] = useState(true)
    const [strictMode, setStrictMode] = useState(true)
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const [isEnableAllOpen, setIsEnableAllOpen] = useState(false)
    const [isPolicyControlOpen, setIsPolicyControlOpen] = useState(false)
    const [isNewTechOpen, setIsNewTechOpen] = useState(false)
    const [selectedTech, setSelectedTech] = useState<Tech | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const [technologies, setTechnologies] = useState<Tech[]>([
        { id: "1", name: "FIDO2 security keys", type: "Hardware factor", enabled: true, icon: Key, description: "Use physical USB or NFC keys to sign in without passwords.", security: "Highest" },
        { id: "2", name: "Passkeys (WebAuthn)", type: "Device biometric", enabled: true, icon: Fingerprint, description: "Synchronized credentials across devices using FaceID or TouchID.", security: "Very High" },
        { id: "3", name: "Platform authenticators", type: "Integrated", enabled: false, icon: Monitor, description: "Windows Hello or Apple iCloud Keychain integration.", security: "High" },
    ])

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast.success("Passwordless settings saved")
        }, 800)
    }

    const toggleTech = (id: string, value: boolean) => {
        setTechnologies(prev => prev.map(t => t.id === id ? { ...t, enabled: value } : t))
        const t = technologies.find(x => x.id === id)
        toast.success(`${t?.name} ${value ? "enabled" : "disabled"}`)
    }

    const removeTech = (id: string) => {
        const t = technologies.find(x => x.id === id)
        setTechnologies(prev => prev.filter(x => x.id !== id))
        toast.success(`${t?.name} removed`)
        setIsPolicyControlOpen(false)
    }

    const filtered = technologies.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Passwordless Security"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Passwordless", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold text-sm" onClick={() => setIsGuideOpen(true)}>
                            Setup Guide
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
                                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-lg shrink-0">
                                    <Fingerprint className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Passkey Support</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">Allow passkey sign-in</p>
                                </div>
                            </div>
                            <Switch checked={allowPasskeys} onCheckedChange={(v) => { setAllowPasskeys(v); toast.success(`Passkeys ${v ? "enabled" : "disabled"}`) }} className="data-[state=checked]:bg-indigo-600 shrink-0" />
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                            <div className="flex gap-3 items-center min-w-0">
                                <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center rounded-lg shrink-0">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Security Level</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">Strict FIDO2 enforcement</p>
                                </div>
                            </div>
                            <Switch checked={strictMode} onCheckedChange={(v) => { setStrictMode(v); toast.success(`Strict mode ${v ? "enabled" : "disabled"}`) }} className="data-[state=checked]:bg-indigo-600 shrink-0" />
                        </CardContent>
                    </Card>
                </div>

                {/* Search bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium"
                        placeholder="Search passwordless technologies..."
                    />
                </div>

                {/* Tech Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((tech) => (
                        <Card key={tech.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group">
                            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                                <div className="flex gap-3 items-start min-w-0">
                                    <div className={`h-11 w-11 flex items-center justify-center rounded-lg shrink-0 transition-colors ${tech.enabled ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                                        <tech.icon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <CardTitle className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">{tech.name}</CardTitle>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{tech.type}</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={tech.enabled}
                                    onCheckedChange={(v) => toggleTech(tech.id, v)}
                                    className="data-[state=checked]:bg-indigo-600 shrink-0 mt-1"
                                />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed min-h-[40px]">{tech.description}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Badge className={`rounded-md border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase ${tech.enabled ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'}`}>
                                        {tech.enabled ? "Active" : "Inactive"}
                                    </Badge>
                                    <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-0 rounded-md text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase">{tech.security} Security</Badge>
                                </div>
                                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end">
                                    <CustomButton variant="ghost" className="h-8 px-2 text-xs text-zinc-500 dark:text-zinc-400 font-semibold hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 group-hover:translate-x-0.5 transition-all" onClick={() => { setSelectedTech(tech); setIsPolicyControlOpen(true); }}>
                                        Policy Control <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <button
                        onClick={() => setIsNewTechOpen(true)}
                        className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-all cursor-pointer group bg-white/50 dark:bg-zinc-900/30 rounded-xl min-h-[200px]"
                    >
                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                            <Plus className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add new technology</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Register a FIDO2 / WebAuthn standard</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Setup Guide Dialog */}
            <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
                <DialogContent className="sm:max-w-2xl rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                            Passwordless Deployment Guide
                        </DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">Steps to roll out passwordless authentication.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {[
                            { step: "1", title: "Prerequisites", desc: "Ensure users are on Windows 10+ or macOS Monterey+ with biometric hardware available." },
                            { step: "2", title: "Pilot rollout", desc: "Enable passkeys for a small group first to validate device compatibility." },
                            { step: "3", title: "Registration", desc: "Users will be prompted to register a passkey on their next sign-in once enabled globally." },
                            { step: "4", title: "Monitor", desc: "Track adoption and login failures from the audit log before forcing organization-wide." }
                        ].map((s) => (
                            <div key={s.step} className="flex gap-3 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                <div className="h-7 w-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{s.step}</div>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{s.title}</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10" onClick={() => setIsGuideOpen(false)}>Got it</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Enable Globally Confirmation */}
            <Dialog open={isEnableAllOpen} onOpenChange={setIsEnableAllOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-2">
                            <Shield className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">Enable passwordless globally?</DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            This will allow all users in your organization to replace their passwords with FIDO2 / passkey credentials.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <CustomButton variant="outline" className="rounded-lg flex-1" onClick={() => setIsEnableAllOpen(false)}>Not yet</CustomButton>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex-1" onClick={() => { toast.success("Passwordless enabled for the organization"); setIsEnableAllOpen(false) }}>Enable now</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Policy Control Sheet */}
            <Sheet open={isPolicyControlOpen} onOpenChange={setIsPolicyControlOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">{selectedTech?.name}</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Configure enforcement rules for this technology.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Assignment</Label>
                            <Select defaultValue="all">
                                <SelectTrigger className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All licensed users</SelectItem>
                                    <SelectItem value="it">Security & IT groups only</SelectItem>
                                    <SelectItem value="custom">Selected users / groups</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Required States</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Hardware boot verification</span>
                                    <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">TPM 2.0 enforcement</span>
                                    <Switch className="data-[state=checked]:bg-indigo-600" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">User verification required</span>
                                    <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10 font-semibold text-sm" onClick={() => { toast.success("Policy updated"); setIsPolicyControlOpen(false) }}>Save Policy</CustomButton>
                        {selectedTech && (
                            <CustomButton variant="outline" className="rounded-lg w-full h-10 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30" onClick={() => removeTech(selectedTech.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Remove technology
                            </CustomButton>
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* New Tech Sheet */}
            <Sheet open={isNewTechOpen} onOpenChange={setIsNewTechOpen}>
                <SheetContent className="sm:max-w-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">Add a passwordless technology</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">Register a new authentication standard for your identities.</SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                        {[
                            { name: "Standard WebAuthn", icon: Globe, desc: "Cross-platform browser-based biometrics" },
                            { name: "YubiHSM Management", icon: KeyRound, desc: "Hardware security module integration" },
                            { name: "Passkey Manager", icon: Fingerprint, desc: "Cloud-synced passkey credentials" }
                        ].map((opt) => (
                            <button
                                key={opt.name}
                                onClick={() => { toast.success(`${opt.name} added`); setIsNewTechOpen(false) }}
                                className="w-full text-left p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <opt.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{opt.name}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{opt.desc}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-indigo-600" />
                                </div>
                            </button>
                        ))}
                    </div>
                    <SheetFooter>
                        <CustomButton variant="outline" className="rounded-lg w-full h-10" onClick={() => setIsNewTechOpen(false)}>Cancel</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
