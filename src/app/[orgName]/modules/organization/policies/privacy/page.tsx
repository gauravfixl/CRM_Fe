"use client"

import React, { useState } from "react"
import {
    ShieldAlert,
    Lock,
    EyeOff,
    Database,
    FileText,
    Trash2,
    Fingerprint,
    Globe,
    Scale,
    AlertCircle,
    RefreshCcw,
    ShieldCheck,
    Key,
    Save,
    X,
    UserCheck,
    History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function DataPrivacyPage() {
    const [isWipeOpen, setIsWipeOpen] = useState(false)
    const [isConsentOpen, setIsConsentOpen] = useState(false)
    const [wipeConfirm, setWipeConfirm] = useState("")

    const handleFullWipe = () => {
        if (wipeConfirm !== "CONFIRM PURGE") return toast.error("Invalid confirmation string")

        toast.promise(new Promise(res => setTimeout(res, 3000)), {
            loading: "Scrubbing all distributed databases and purging backups...",
            success: "Clean slate protocol executed. Data purged.",
            error: "Wipe aborted. Backup redundancy detected."
        })
        setIsWipeOpen(false)
        setWipeConfirm("")
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Privacy & Consent</h1>
                    <p className="text-sm text-slate-500 mt-1">Configure global PII handling, RTBF (Right to be Forgotten) workflows, and legal consent templates.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Privacy audit trail loading...")}>
                        <History className="w-4 h-4" />
                        Audit Privacy Changes
                    </Button>
                    <Button className="h-9 bg-slate-900 hover:bg-black text-white gap-2 font-black uppercase text-[10px] tracking-widest px-6 shadow-xl" onClick={() => toast.success("Global privacy policies synchronized.")}>
                        <Save className="w-4 h-4" />
                        Save Policies
                    </Button>
                </div>
            </div>

            {/* PRIVACY STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-blue-600">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Privacy Score</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-slate-900">92/100</p>
                        <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-1 uppercase tracking-tighter italic">Excellent Compliance</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-emerald-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Masked Fields</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-emerald-600">24</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter italic">PII fields protected</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-amber-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending RTBF</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-amber-600">03</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter italic">Deletion requests</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-t-4 border-t-purple-500">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consent Rate</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-3xl font-black text-purple-600">99.2%</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tighter italic">Opt-in conversion</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {/* POLICY CONFIG */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-base font-black text-slate-900 uppercase tracking-tight">Global Privacy Controls</CardTitle>
                        <CardDescription className="text-xs font-medium">Enforce data handling protocols across all institutional firms.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {[
                                { title: "Automatic PII Masking", desc: "Redact emails, phones and addresses in all non-governance views.", icon: EyeOff, enabled: true },
                                { title: "GDPR Right to be Forgotten", desc: "Enable one-click full data deletion workflows for users.", icon: Trash2, enabled: true },
                                { title: "Immutable Audit Trail", desc: "Store privacy-related logs in a write-once, read-many vault.", icon: Fingerprint, enabled: true },
                                { title: "Geo-fencing Data", desc: "Restict PII storage to the business unit's registered region.", icon: Globe, enabled: false },
                                { title: "Third-party Sharing Lock", desc: "Globally disable all API exports to non-verified integrations.", icon: Lock, enabled: true },
                            ].map((policy, i) => (
                                <div key={i} className="px-6 py-5 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white border border-slate-100 shadow-sm rounded-2xl text-slate-400 group-hover:text-blue-500 transition-colors">
                                            <policy.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{policy.title}</p>
                                            <p className="text-[11px] text-slate-500 mt-1 font-medium">{policy.desc}</p>
                                        </div>
                                    </div>
                                    <Switch checked={policy.enabled} onCheckedChange={() => toast.info(`Policy '${policy.title}' state changed.`)} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* DANGER ZONE & SECONDARY ACTIONS */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-base font-black text-slate-900 tracking-tight">Consent Template</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">Customize the legal text shown to new leads and users during the data collection process.</p>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-[11px] text-slate-400 font-medium">
                                "By proceeding, you agree to our institutional data handling policy under the CRM Core Governance model..."
                            </div>
                            <Dialog open={isConsentOpen} onOpenChange={setIsConsentOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full h-11 rounded-2xl text-xs font-bold border-slate-200">
                                        Update Consent Template
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] p-8 border-none rounded-3xl shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">Legal Template Editor</DialogTitle>
                                        <DialogDescription className="text-slate-400 font-medium">Draft the institutional data processing notice.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-6">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Notice Body (Markdown supported)</Label>
                                        <textarea className="w-full h-64 mt-2 p-4 bg-slate-50 border-slate-100 rounded-2xl text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-none" defaultValue="By proceeding, you agree to our institutional data handling policy..." />
                                    </div>
                                    <DialogFooter>
                                        <Button className="w-full h-12 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl" onClick={() => { toast.success("Consent template versioned and deployed."); setIsConsentOpen(false); }}>
                                            Deploy New Version
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    <Card className="border-red-100 bg-red-50/10 shadow-sm rounded-3xl overflow-hidden animate-pulse hover:animate-none">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-black text-red-600 flex items-center gap-2 uppercase tracking-widest">
                                <ShieldAlert className="w-4 h-4" /> Nucleus Wipe
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-6">
                            <p className="text-[11px] text-red-700 font-bold leading-relaxed mb-4">
                                PERMANENTLY scrub all PII from the organization's entire data nexus. This action is IRREVERSIBLE and will trigger legal hold alerts.
                            </p>
                            <Dialog open={isWipeOpen} onOpenChange={setIsWipeOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" className="w-full h-11 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200">
                                        Initiate Full Wipe
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[400px] p-0 border-none rounded-3xl shadow-2xl overflow-hidden bg-white">
                                    <div className="bg-red-600 p-8 text-white text-center">
                                        <ShieldAlert className="w-16 h-16 mx-auto mb-4" />
                                        <DialogTitle className="text-2xl font-black">Destructive Protocol</DialogTitle>
                                        <p className="text-red-100 text-xs mt-2 uppercase font-bold tracking-widest">Permanent Deletion Requested</p>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="space-y-4">
                                            <p className="text-xs text-slate-500 font-bold leading-relaxed text-center">
                                                To proceed with institutional data erasure, please type <span className="text-red-600 font-black">CONFIRM PURGE</span> below.
                                            </p>
                                            <Input
                                                value={wipeConfirm}
                                                onChange={(e) => setWipeConfirm(e.target.value)}
                                                className="h-12 bg-red-50 border-red-100 text-red-600 font-black text-center text-lg uppercase tracking-widest rounded-2xl focus-visible:ring-red-500"
                                                placeholder="CONFIRM PURGE"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button variant="ghost" className="font-bold text-slate-400 h-12" onClick={() => setIsWipeOpen(false)}>Abort Mission</Button>
                                            <Button
                                                variant="destructive"
                                                className={`h-12 font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl shadow-red-100 ${wipeConfirm !== "CONFIRM PURGE" ? "opacity-50 cursor-not-allowed" : ""}`}
                                                disabled={wipeConfirm !== "CONFIRM PURGE"}
                                                onClick={handleFullWipe}
                                            >
                                                Execute Purge
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
