"use client"

import React, { useState } from "react"
import SubHeader from "@/components/custom/SubHeader"
import { Smartphone, ShieldCheck, ShieldAlert, Plus, Search, Info, LogOut, Key, CheckCircle2, ChevronRight, MoreVertical, SmartphoneIcon, Mail, Laptop } from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SmallCard } from "@/components/custom/SmallCard"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Download, RefreshCw } from "lucide-react"

export default function MFASetupPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [enforced, setEnforced] = useState(true)
    const [isRecoveryCodesOpen, setIsRecoveryCodesOpen] = useState(false)
    const [isAddFactorOpen, setIsAddFactorOpen] = useState(false)
    const [isConfigureOpen, setIsConfigureOpen] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<any>(null)
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast.success("MFA configuration preserved")
        }, 1000)
    }

    const recoveryCodes = [
        "4922-1029", "8821-0092", "3341-9921", "1029-4451",
        "5521-1102", "9901-2231", "4410-8821", "7712-4410"
    ]

    const methods = [
        { id: "1", name: "Authenticator app", type: "Security app", status: "Recommended", icon: ShieldCheck, hardware: false, popularity: "85%" },
        { id: "2", name: "SMS verification", type: "Phone number", status: "Legacy", icon: Smartphone, hardware: false, popularity: "12%" },
        { id: "3", name: "Security keys (FIDO2)", type: "Hardware", status: "Strongest", icon: Key, hardware: true, popularity: "3%" },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="MFA setup"
                breadcrumbItems={[
                    { label: "Identity & access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "MFA setup", href: "/modules/settings/auth/mfa" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold" onClick={() => setIsRecoveryCodesOpen(true)}>
                            Recovery codes
                        </CustomButton>
                        <CustomButton 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-semibold text-xs tracking-wide shadow-xl border-0" 
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save settings"}
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Top HUD Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SmallCard className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl col-span-1 md:col-span-2 relative overflow-hidden group shadow-xl border-0">

                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-white/20 text-white border-0 rounded-full px-3 py-0.5 font-semibold tracking-wide text-xs">Identity Shield</Badge>
                                <Badge className="bg-emerald-500 text-white border-0 rounded-full px-3 py-0.5 font-semibold tracking-wide text-xs">Enforced</Badge>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white italic">Multi-factor security</h2>
                            <p className="text-indigo-100/80 font-medium leading-relaxed text-sm max-w-md">
                                Multi-factor authentication adds an essential layer of security. We recommend requiring an authenticator app for all privileged roles.
                            </p>
                            <div className="flex items-center gap-10 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-white">98%</span>
                                    <span className="text-xs font-semibold text-indigo-200 tracking-wide mt-1">Adoption Rate</span>
                                </div>
                                <div className="h-10 w-px bg-white/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-emerald-400 leading-none">Healthy</span>
                                    <span className="text-xs font-semibold text-indigo-200 tracking-wide mt-1">Policy Status</span>
                                </div>
                            </div>
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 flex items-center justify-center rounded-xl font-bold">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <span className="text-xs font-semibold text-zinc-400 tracking-wide block mb-1">Global Enforcement</span>
                                <div className="text-xl font-semibold text-zinc-900 dark:text-white leading-none">Always require MFA</div>
                            </div>
                            <Switch checked={enforced} onCheckedChange={setEnforced} className="data-[state=checked]:bg-indigo-600" />
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center rounded-xl font-bold">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-zinc-400 tracking-wide block mb-1">Session Timeout</span>
                            <div className="text-xl font-semibold text-zinc-900 dark:text-white leading-none">8 hours sliding</div>
                        </div>
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
                            placeholder="Find MFA methods or verified factors..."
                        />
                    </div>
                </div>

                {/* Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {methods.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.type.toLowerCase().includes(searchQuery.toLowerCase())).map((method) => (
                        <Card key={method.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all group overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div className={`h-14 w-14 flex items-center justify-center rounded-2xl border transition-all ${method.status === 'Recommended' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 border-zinc-100 dark:border-zinc-700'
                                    }`}>
                                    <method.icon className="w-6 h-6" />
                                </div>
                                <CustomButton variant="ghost" size="icon" className="text-zinc-400 rounded-xl" onClick={() => { setSelectedMethod(method); setIsConfigureOpen(true); }}>
                                    <MoreVertical className="w-4 h-4" />
                                </CustomButton>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">{method.name}</h3>
                                        {method.hardware && <Badge className="bg-amber-100 text-amber-700 border-0 text-[8px] font-semibold rounded-md px-1">Hardware</Badge>}
                                    </div>
                                    <p className="text-xs text-zinc-400 font-medium">{method.type}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge className={`rounded-full border-0 text-xs font-semibold tracking-wide py-1 px-3 ${method.status === 'Recommended' ? 'bg-emerald-50 text-emerald-600' :
                                        method.status === 'Strongest' ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {method.status}
                                    </Badge>
                                    <div className="text-xs font-semibold text-zinc-500 tracking-wide">
                                        {method.popularity} Usage
                                    </div>
                                </div>

                                <Separator className="bg-zinc-50 dark:bg-zinc-800/50" />

                                <div className="flex items-center justify-between">
                                    <div className="flex -space-x-2">
                                        <Laptop className="h-5 w-5 text-zinc-300" />
                                        <Smartphone className="h-5 w-5 text-zinc-300" />
                                        <Mail className="h-5 w-5 text-zinc-300" />
                                    </div>
                                    <CustomButton variant="ghost" className="h-10 text-xs text-zinc-500 font-semibold tracking-wide hover:text-indigo-600 group-hover:translate-x-1 transition-transform" onClick={() => { setSelectedMethod(method); setIsConfigureOpen(true); }}>
                                        Configure Factor <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-indigo-500/20 transition-all cursor-pointer group bg-zinc-50/10 dark:bg-zinc-900/10 rounded-3xl" onClick={() => setIsAddFactorOpen(true)}>
                        <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500 shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <Plus className="w-10 h-10 text-zinc-200 group-hover:text-indigo-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-zinc-400 tracking-wide">Add New Factor</h4>
                            <p className="text-xs text-zinc-400 font-medium">Provision another verification method</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recovery Codes Dialog */}
            <Dialog open={isRecoveryCodesOpen} onOpenChange={setIsRecoveryCodesOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight">Recovery Codes</DialogTitle>
                        <DialogDescription className="text-zinc-500 font-medium">
                            Store these safely. They allow access if you lose your primary MFA device.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <div className="grid grid-cols-2 gap-3 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 font-mono text-sm tracking-widest text-zinc-600 dark:text-zinc-400">
                            {recoveryCodes.map((code) => (
                                <div key={code} className="flex items-center justify-center py-2 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                    {code}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                            <CustomButton variant="outline" className="flex-1 rounded-xl h-11" onClick={() => { navigator.clipboard.writeText(recoveryCodes.join("\n")); toast.success("Codes copied to clipboard"); }}>
                                <Copy className="w-4 h-4 mr-2" /> Copy
                            </CustomButton>
                            <CustomButton variant="outline" className="flex-1 rounded-xl h-11" onClick={() => toast.success("Downloading as PDF...")}>
                                <Download className="w-4 h-4 mr-2" /> Download
                            </CustomButton>
                            <CustomButton variant="outline" className="rounded-xl h-11" onClick={() => toast.info("Regenerating codes...")}>
                                <RefreshCw className="w-4 h-4" />
                            </CustomButton>
                        </div>
                    </div>
                    <DialogFooter>
                        <CustomButton className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl w-full" onClick={() => setIsRecoveryCodesOpen(false)}>I have saved these codes</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Configure Factor Sheet */}
            <Sheet open={isConfigureOpen} onOpenChange={setIsConfigureOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight">Configure {selectedMethod?.name}</SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium">
                            Adjust security parameters for this verification method.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="font-bold">Status</Label>
                                <Badge className="bg-emerald-50 text-emerald-600 border-0">ACTIVE</Badge>
                            </div>
                            <Separator className="bg-zinc-50 dark:bg-zinc-800" />
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">User Experience</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Allow "Remember Device"</span>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Require Biometrics</span>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Security Strength</h4>
                                <Select defaultValue="high">
                                    <SelectTrigger className="rounded-xl h-11 border-zinc-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-zinc-100">
                                        <SelectItem value="low">Standard Verification</SelectItem>
                                        <SelectItem value="high">Hardware Attestation Required</SelectItem>
                                        <SelectItem value="critical">Strict Device Binding</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <SheetFooter>
                        <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl w-full h-12" onClick={() => { toast.success("Factor configuration updated"); setIsConfigureOpen(false); }}>Save Changes</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Add New Factor Sheet */}
            <Sheet open={isAddFactorOpen} onOpenChange={setIsAddFactorOpen}>
                <SheetContent className="sm:max-w-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight">Provision New Factor</SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium">
                            Expand your authentication surface by adding a new verification method.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { name: "Microsoft Authenticator", icon: ShieldCheck, desc: "Notification-based approval & TOTP" },
                                { name: "YubiKey / FIDO2", icon: Key, desc: "Physical security keys for hardware auth" },
                                { name: "Corporate Email", icon: Mail, desc: "OTP delivered to verified company address" },
                            ].map((f) => (
                                <div key={f.name} className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <f.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{f.name}</p>
                                            <p className="text-xs text-zinc-500 font-medium">{f.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <SheetFooter>
                        <CustomButton variant="outline" className="rounded-xl w-full" onClick={() => setIsAddFactorOpen(false)}>Cancel</CustomButton>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    )
}
