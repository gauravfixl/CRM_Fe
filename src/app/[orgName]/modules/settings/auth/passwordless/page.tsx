"use client"

import React, { useState } from "react"
import SubHeader from "@/components/custom/SubHeader"
import { Fingerprint, Zap, ShieldCheck, Key, Plus, Search, Info, MoreHorizontal, ChevronRight, Lock, Laptop, Smartphone, KeyRound, Monitor, Cpu } from "lucide-react"
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
import { BookOpen, Shield, Globe, MousePointer2 } from "lucide-react"

export default function PasswordlessSecurityPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isExperimental, setIsExperimental] = useState(true)
    const [isGuideOpen, setIsGuideOpen] = useState(false)
    const [isEnableAllOpen, setIsEnableAllOpen] = useState(false)
    const [isPolicyControlOpen, setIsPolicyControlOpen] = useState(false)
    const [isNewTechOpen, setIsNewTechOpen] = useState(false)
    const [selectedTech, setSelectedTech] = useState<any>(null)

    const technologies = [
        { id: "1", name: "FIDO2 security keys", type: "Hardware factor", status: "Active", icon: Key, description: "Use physical USB or NFC keys to sign in without passwords.", security: "Highest" },
        { id: "2", name: "Passkeys (WebAuthn)", type: "Device biometric", status: "Active", icon: Fingerprint, description: "Synchronized credentials across devices using FaceID or TouchID.", security: "Very High" },
        { id: "3", name: "Platform authenticators", type: "Integrated", status: "Evaluation", icon: Monitor, description: "Windows Hello or Apple iCloud Keychain integration.", security: "High" },
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Passwordless security"
                breadcrumbItems={[
                    { label: "Identity & access", href: "#" },
                    { label: "Authentication", href: "/modules/settings/auth" },
                    { label: "Passwordless", href: "/modules/settings/auth/passwordless" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold" onClick={() => setIsGuideOpen(true)}>
                            Setup guide
                        </CustomButton>
                        <CustomButton className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl h-10 px-6 font-semibold text-xs tracking-wide shadow-xl border-0" onClick={() => setIsEnableAllOpen(true)}>
                            Enable globally
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Top HUD Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <SmallCard className="bg-gradient-to-br from-violet-600 via-indigo-700 to-indigo-900 p-8 rounded-3xl col-span-1 md:col-span-2 relative overflow-hidden group shadow-2xl border-0">
                        <Fingerprint className="absolute -bottom-10 -right-10 h-64 w-64 text-white opacity-10 group-hover:scale-110 transition-transform pointer-events-none" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center gap-2">
                                <Badge className="bg-white/20 text-white border-0 rounded-full px-3 py-0.5 font-semibold tracking-wide text-xs">Zero Trust</Badge>
                                <Badge className="bg-violet-400 text-white border-0 rounded-full px-3 py-0.5 font-semibold tracking-wide text-xs">Phishing Resistant</Badge>
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight text-white italic">Beyond passwords</h2>
                            <p className="text-indigo-100/80 font-medium leading-relaxed text-sm max-w-md">
                                Passwordless authentication eliminates the weakest link in security. Passkeys and FIDO2 keys provide the highest resistance against credential harvesting.
                            </p>
                            <div className="flex items-center gap-10 pt-2">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-white">45%</span>
                                    <span className="text-xs font-semibold text-indigo-200 tracking-wide mt-1">User Migration</span>
                                </div>
                                <div className="h-10 w-px bg-white/20"></div>
                                <div className="flex flex-col">
                                    <span className="text-2xl font-semibold text-emerald-400 leading-none">Optimized</span>
                                    <span className="text-xs font-semibold text-indigo-200 tracking-wide mt-1">Attack Resistance</span>
                                </div>
                            </div>
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-violet-50 dark:bg-violet-900/20 text-violet-600 flex items-center justify-center rounded-xl font-bold">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <span className="text-xs font-semibold text-zinc-400 tracking-wide block mb-1">Experimental Mode</span>
                                <div className="text-xl font-semibold text-zinc-900 dark:text-white leading-none">Allow passkeys</div>
                            </div>
                            <Switch checked={isExperimental} onCheckedChange={setIsExperimental} className="data-[state=checked]:bg-violet-600" />
                        </div>
                    </SmallCard>

                    <SmallCard className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center p-6 space-y-4 rounded-3xl">
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center rounded-xl font-bold">
                            <Lock className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-zinc-400 tracking-wide block mb-1">Security Level</span>
                            <div className="text-xl font-semibold text-emerald-600 leading-none">Strict FIDO2</div>
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
                            placeholder="Find passwordless technologies or deployment rules..."
                        />
                    </div>
                </div>

                {/* Tech Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {technologies.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.type.toLowerCase().includes(searchQuery.toLowerCase())).map((tech) => (
                        <Card key={tech.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm hover:shadow-2xl transition-all group overflow-hidden border-t-2 border-t-zinc-50 dark:border-t-zinc-800 hover:border-t-violet-600">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <div className={`h-14 w-14 flex items-center justify-center rounded-2xl border transition-all ${tech.status === 'Active' ? 'bg-violet-600 text-white border-violet-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 border-zinc-100 dark:border-zinc-700'
                                    }`}>
                                    <tech.icon className="w-6 h-6" />
                                </div>
                                <CustomButton variant="ghost" size="icon" className="text-zinc-400 rounded-xl" onClick={() => { setSelectedTech(tech); setIsPolicyControlOpen(true); }}>
                                    <MoreHorizontal className="w-4 h-4" />
                                </CustomButton>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">{tech.name}</h3>
                                    <p className="text-xs text-zinc-400 font-medium mt-1">{tech.type}</p>
                                    <p className="text-xs text-zinc-500 mt-4 leading-relaxed line-clamp-2">{tech.description}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge className={`rounded-full border-0 text-xs font-semibold tracking-wide py-1 px-3 ${tech.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {tech.status}
                                    </Badge>
                                    <Badge className="bg-violet-50 text-violet-600 border-0 rounded-full text-xs font-semibold px-3 py-1">{tech.security} Security</Badge>
                                </div>

                                <Separator className="bg-zinc-50 dark:bg-zinc-800/50" />

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <Laptop className="h-5 w-5 text-zinc-300" />
                                        <Smartphone className="h-5 w-5 text-zinc-300" />
                                    </div>
                                    <CustomButton variant="ghost" className="h-10 text-xs text-zinc-500 font-semibold tracking-wide hover:text-violet-600 group-hover:translate-x-1 transition-transform" onClick={() => { setSelectedTech(tech); setIsPolicyControlOpen(true); }}>
                                        Policy Control <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="border-4 border-dashed border-zinc-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-6 hover:border-violet-500/20 transition-all cursor-pointer group bg-zinc-50/10 dark:bg-zinc-900/10 rounded-3xl" onClick={() => setIsNewTechOpen(true)}>
                        <div className="h-20 w-20 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500 shadow-sm border border-zinc-100 dark:border-zinc-800">
                            <Plus className="w-10 h-10 text-zinc-200 group-hover:text-violet-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-bold text-zinc-400 tracking-wide">New Tech</h4>
                            <p className="text-xs text-zinc-400 font-medium">Add FIDO2 or WebAuthn identity</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals & Sheets */}

            {/* Setup Guide Dialog */}
            <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
                <DialogContent className="sm:max-w-2xl rounded-3xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                            <BookOpen className="w-6 h-6 text-violet-600" />
                            Passwordless Deployment Guide
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Step 1: Prerequisites</h4>
                            <p className="text-xs font-medium text-zinc-500 leading-relaxed italic">
                                Ensure your users are on compliant OS versions (Windows 10+, macOS Monterey+) and have biometric hardware available.
                            </p>
                            <Badge className="bg-emerald-50 text-emerald-600 border-0 font-bold px-2">VERIFIED</Badge>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Step 2: Registration</h4>
                            <p className="text-xs font-medium text-zinc-500 leading-relaxed italic">
                                Users will be prompted to register their first passkey during their next sign-in once enabled globally.
                            </p>
                            <Badge className="bg-indigo-50 text-indigo-600 border-0 font-bold px-2">PENDING</Badge>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Enable Globally Confirmation */}
            <Dialog open={isEnableAllOpen} onOpenChange={setIsEnableAllOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <DialogHeader className="text-center items-center">
                        <div className="h-16 w-16 bg-violet-50 text-violet-600 rounded-full flex items-center justify-center mb-4">
                            <Shield className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight">Enable Passwordless Globally?</DialogTitle>
                        <DialogDescription className="text-zinc-500 font-medium">
                            This will allow all users in your organization to replace their passwords with FIDO2/Passkey credentials.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center gap-2 mt-4">
                        <CustomButton variant="outline" className="rounded-xl px-8" onClick={() => setIsEnableAllOpen(false)}>Not yet</CustomButton>
                        <CustomButton className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-8" onClick={() => { toast.success("Passwordless enabled for all tenants"); setIsEnableAllOpen(false); }}>Enable Now</CustomButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Policy Control Sheet */}
            <Sheet open={isPolicyControlOpen} onOpenChange={setIsPolicyControlOpen}>
                <SheetContent className="sm:max-w-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight">Policy: {selectedTech?.name}</SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium">Configure enforcement rules for this technology.</SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Assignment</h4>
                            <Select defaultValue="all">
                                <SelectTrigger className="rounded-xl h-11 border-zinc-200">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all">All Licensed Users</SelectItem>
                                    <SelectItem value="it">Security & IT Groups Only</SelectItem>
                                    <SelectItem value="custom">Scoped Users (Selected)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Required States</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Hardware Boot Verification</span>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">TPM 2.0 Enforcement</span>
                                    <Switch />
                                </div>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* New Tech Registration Sheet */}
            <Sheet open={isNewTechOpen} onOpenChange={setIsNewTechOpen}>
                <SheetContent className="sm:max-w-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold tracking-tight italic">Onboard Passwordless Tech</SheetTitle>
                        <SheetDescription className="text-zinc-500 font-medium italic italic">Register a new authentication standard for your identities.</SheetDescription>
                    </SheetHeader>
                    <div className="py-8 space-y-6">
                        <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-center space-y-4 group cursor-pointer hover:border-violet-500/50 transition-colors">
                            <div className="h-16 w-16 mx-auto bg-white dark:bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-200 group-hover:rotate-12 transition-transform">
                                <Globe className="w-8 h-8 text-violet-500" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold">Standard WebAuthn</h4>
                                <p className="text-xs text-zinc-500 font-medium mt-1">Cross-platform browser-based biometrics</p>
                            </div>
                            <CustomButton className="bg-violet-600 text-white rounded-xl h-10 w-full font-bold text-xs tracking-widest">PROVISION</CustomButton>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-2 hover:bg-zinc-50 transition-colors cursor-pointer">
                                <KeyRound className="w-5 h-5 text-indigo-600" />
                                <p className="text-xs font-bold leading-tight">YubiHSM Management</p>
                            </div>
                            <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-2 hover:bg-zinc-50 transition-colors cursor-pointer">
                                <MousePointer2 className="w-5 h-5 text-violet-600" />
                                <p className="text-xs font-bold leading-tight">Passkey Manager</p>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
