"use client"

import React, { useState, useEffect } from "react"
import SubHeader from "@/components/custom/SubHeader"
import {
    Smartphone,
    ShieldCheck,
    ShieldAlert,
    Plus,
    Search,
    LogOut,
    Key,
    ChevronRight,
    Mail,
    Copy,
    Download,
    RefreshCw,
    Loader2,
    Trash2,
    Pencil
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
import { getOrgAdminSettings, updateOrgAdminSettings } from "@/hooks/orgAdminHooks"

type Method = {
    id: string
    name: string
    type: string
    status: "Recommended" | "Legacy" | "Strongest"
    icon: any
    enabled: boolean
}

export default function MFASetupPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [enforced, setEnforced] = useState(true)
    const [sessionTimeout, setSessionTimeout] = useState("8h")
    const [isRecoveryCodesOpen, setIsRecoveryCodesOpen] = useState(false)
    const [isAddFactorOpen, setIsAddFactorOpen] = useState(false)
    const [isConfigureOpen, setIsConfigureOpen] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<Method | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    const [methods, setMethods] = useState<Method[]>([
        { id: "1", name: "Authenticator app", type: "TOTP via Google / Microsoft Authenticator", status: "Recommended", icon: ShieldCheck, enabled: true },
        { id: "2", name: "SMS verification", type: "One-time code sent via SMS", status: "Legacy", icon: Smartphone, enabled: false },
        { id: "3", name: "Security keys (FIDO2)", type: "Hardware-backed authentication", status: "Strongest", icon: Key, enabled: true },
    ])

    useEffect(() => {
        (async () => {
            try {
                const res = await getOrgAdminSettings()
                const s = res?.data?.settings || res?.data?.data || res?.data || {}
                if (typeof s?.security?.enforceMFA === "boolean") setEnforced(s.security.enforceMFA)
            } catch {
                // silent fallback
            }
        })()
    }, [])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateOrgAdminSettings({ security: { enforceMFA: enforced } })
            toast.success("MFA settings saved")
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to save MFA settings")
        } finally {
            setIsSaving(false)
        }
    }

    const recoveryCodes = [
        "4922-1029", "8821-0092", "3341-9921", "1029-4451",
        "5521-1102", "9901-2231", "4410-8821", "7712-4410"
    ]

    const toggleMethod = (id: string, value: boolean) => {
        setMethods(prev => prev.map(m => m.id === id ? { ...m, enabled: value } : m))
        const m = methods.find(x => x.id === id)
        toast.success(`${m?.name} ${value ? "enabled" : "disabled"}`)
    }

    const removeMethod = (id: string) => {
        const m = methods.find(x => x.id === id)
        setMethods(prev => prev.filter(x => x.id !== id))
        toast.success(`${m?.name} removed`)
        setIsConfigureOpen(false)
    }

    const filteredMethods = methods.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="MFA Setup"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "MFA Setup", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold text-sm" onClick={() => setIsRecoveryCodesOpen(true)}>
                            Recovery Codes
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

                {/* Settings row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                            <div className="flex gap-3 items-center min-w-0">
                                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-lg shrink-0">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Global Enforcement</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">Always require MFA</p>
                                </div>
                            </div>
                            <Switch checked={enforced} onCheckedChange={(v) => { setEnforced(v); toast.success(`MFA enforcement ${v ? "enabled" : "disabled"}`) }} className="data-[state=checked]:bg-indigo-600 shrink-0" />
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                        <CardContent className="p-5 flex items-center justify-between gap-4">
                            <div className="flex gap-3 items-center min-w-0">
                                <div className="h-10 w-10 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center rounded-lg shrink-0">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Session Timeout</p>
                                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">Auto-logout duration</p>
                                </div>
                            </div>
                            <Select value={sessionTimeout} onValueChange={(v) => { setSessionTimeout(v); toast.success("Session timeout updated") }}>
                                <SelectTrigger className="w-[120px] h-9 rounded-lg border-zinc-200 dark:border-zinc-700 text-sm font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1h">1 hour</SelectItem>
                                    <SelectItem value="4h">4 hours</SelectItem>
                                    <SelectItem value="8h">8 hours</SelectItem>
                                    <SelectItem value="24h">24 hours</SelectItem>
                                </SelectContent>
                            </Select>
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
                        placeholder="Search MFA methods..."
                    />
                </div>

                {/* Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMethods.map((method) => (
                        <Card key={method.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group">
                            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                                <div className="flex gap-3 items-start min-w-0">
                                    <div className={`h-11 w-11 flex items-center justify-center rounded-lg shrink-0 transition-colors ${method.enabled ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'}`}>
                                        <method.icon className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <CardTitle className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">{method.name}</CardTitle>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{method.type}</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={method.enabled}
                                    onCheckedChange={(v) => toggleMethod(method.id, v)}
                                    className="data-[state=checked]:bg-indigo-600 shrink-0 mt-1"
                                />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Badge className={`rounded-md border-0 text-[10px] font-semibold tracking-wide py-0.5 px-2 uppercase ${
                                    method.status === 'Recommended' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                                    method.status === 'Strongest' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' :
                                    'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                                }`}>
                                    {method.status}
                                </Badge>
                                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end">
                                    <CustomButton variant="ghost" className="h-8 px-2 text-xs text-zinc-500 dark:text-zinc-400 font-semibold hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 group-hover:translate-x-0.5 transition-all" onClick={() => { setSelectedMethod(method); setIsConfigureOpen(true); }}>
                                        Configure <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <button
                        onClick={() => setIsAddFactorOpen(true)}
                        className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-all cursor-pointer group bg-white/50 dark:bg-zinc-900/30 rounded-xl min-h-[180px]"
                    >
                        <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                            <Plus className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Add new factor</h4>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Provision another verification method</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recovery Codes Dialog */}
            <Dialog open={isRecoveryCodesOpen} onOpenChange={setIsRecoveryCodesOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Recovery Codes</DialogTitle>
                        <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            Store these codes safely. They allow access if you lose your primary MFA device.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="grid grid-cols-2 gap-2 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            {recoveryCodes.map((code) => (
                                <div key={code} className="flex items-center justify-center py-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 text-sm font-semibold tracking-wider text-zinc-700 dark:text-zinc-300">
                                    {code}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <CustomButton variant="outline" className="flex-1 rounded-lg h-10" onClick={() => { navigator.clipboard.writeText(recoveryCodes.join("\n")); toast.success("Codes copied to clipboard") }}>
                                <Copy className="w-4 h-4 mr-2" /> Copy
                            </CustomButton>
                            <CustomButton variant="outline" className="flex-1 rounded-lg h-10" onClick={() => {
                                const blob = new Blob([recoveryCodes.join("\n")], { type: "text/plain" })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement("a")
                                a.href = url
                                a.download = "mfa-recovery-codes.txt"
                                a.click()
                                URL.revokeObjectURL(url)
                                toast.success("Recovery codes downloaded")
                            }}>
                                <Download className="w-4 h-4 mr-2" /> Download
                            </CustomButton>
                            <CustomButton variant="outline" className="rounded-lg h-10 px-3" onClick={() => toast.success("New recovery codes generated")}>
                                <RefreshCw className="w-4 h-4" />
                            </CustomButton>
                        </div>
                    </div>
                    <DialogFooter>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10" onClick={() => setIsRecoveryCodesOpen(false)}>I have saved these codes</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Configure Factor Sheet */}
            <Sheet open={isConfigureOpen} onOpenChange={setIsConfigureOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">Configure {selectedMethod?.name}</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            Adjust security parameters for this verification method.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                            <Label className="font-semibold text-sm">Status</Label>
                            <Badge className={`rounded-md border-0 ${selectedMethod?.enabled ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}`}>
                                {selectedMethod?.enabled ? "Active" : "Disabled"}
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">User Experience</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Allow "Remember Device"</span>
                                    <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Require biometrics</span>
                                    <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Security Strength</h4>
                            <Select defaultValue="high">
                                <SelectTrigger className="rounded-lg h-10 border-zinc-200 dark:border-zinc-700 text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Standard verification</SelectItem>
                                    <SelectItem value="high">Hardware attestation required</SelectItem>
                                    <SelectItem value="critical">Strict device binding</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg w-full h-10" onClick={() => { toast.success("Factor configuration updated"); setIsConfigureOpen(false) }}>Save Changes</CustomButton>
                        {selectedMethod && (
                            <CustomButton variant="outline" className="rounded-lg w-full h-10 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30" onClick={() => removeMethod(selectedMethod.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Remove method
                            </CustomButton>
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Add New Factor Sheet */}
            <Sheet open={isAddFactorOpen} onOpenChange={setIsAddFactorOpen}>
                <SheetContent className="sm:max-w-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold tracking-tight">Add a verification method</SheetTitle>
                        <SheetDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                            Choose a method to add to your organization's MFA options.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-3">
                        {[
                            { name: "Microsoft Authenticator", icon: ShieldCheck, desc: "Notification-based approval & TOTP" },
                            { name: "YubiKey / FIDO2", icon: Key, desc: "Physical security keys for hardware auth" },
                            { name: "Corporate email OTP", icon: Mail, desc: "One-time code delivered to verified address" },
                        ].map((f) => (
                            <button
                                key={f.name}
                                onClick={() => { toast.success(`${f.name} added to organization`); setIsAddFactorOpen(false) }}
                                className="w-full text-left p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <f.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">{f.name}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{f.desc}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-indigo-600" />
                                </div>
                            </button>
                        ))}
                    </div>
                    <SheetFooter>
                        <CustomButton variant="outline" className="rounded-lg w-full h-10" onClick={() => setIsAddFactorOpen(false)}>Cancel</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
