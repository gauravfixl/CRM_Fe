"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Settings2,
    ChevronLeft,
    Save,
    Trash2,
    ShieldCheck,
    AlertCircle,
    Info,
    RefreshCw,
    Lock,
    GitBranch,
    Link2,
    Database,
    Globe,
    Filter,
    Layers,
    UserCheck,
    Tag,
    Share2,
    Target
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"

export default function TrackingSettingsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast({
                title: "Tracking Protocols Updated",
                description: "Global attribution and UTM rules have been synchronized.",
            })
        }, 1200)
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-semibold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-900 text-white shadow-lg">
                                <Settings2 className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Campaign & Tracking Settings
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Configure how the platform identifies, attributes, and standardizes incoming lead traffic from all global sources.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Lock className="h-4 w-4 mr-2 text-slate-400" /> Security Audit
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none"
                    >
                        {isSaving ? "Syncing..." : <><Save className="h-4 w-4 mr-2" /> Commit Protocols</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Protocol Configuration Area */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8 space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">Source Governance Rules</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Define how the system handles ambiguous or missing source data.</p>
                            </div>
                            <Badge className="bg-indigo-50 text-indigo-600 border-none font-semibold text-[9px] px-2 h-5 uppercase tracking-wider">Default Overrides</Badge>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Default Fallback Source</p>
                                    <Select defaultValue="direct">
                                        <SelectTrigger className="h-11 rounded-xl border-slate-100 font-semibold text-[13px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="direct">Direct Traffic</SelectItem>
                                            <SelectItem value="organic">Organic Unknown</SelectItem>
                                            <SelectItem value="offline">Offline / Manual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Campaign Conflict Logic</p>
                                    <Select defaultValue="sticky">
                                        <SelectTrigger className="h-11 rounded-xl border-slate-100 font-semibold text-[13px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="sticky">Keep First Campaign (Sticky)</SelectItem>
                                            <SelectItem value="recent">Overwrite with Recent</SelectItem>
                                            <SelectItem value="multiple">Store as Array (Advanced)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                {[
                                    { label: "Enable Multi-Touch Tracking", desc: "Track every intermediate click before conversion.", active: true },
                                    { label: "Strip Personal Data from URLs", desc: "Remove PII from incoming referral strings for compliance.", active: true },
                                    { label: "Domain Matching Enforcement", desc: "Reject UTMs that don't match authorized domains.", active: false },
                                ].map((rule, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="space-y-0.5">
                                            <p className="text-[14px] font-semibold tracking-tight text-slate-900">{rule.label}</p>
                                            <p className="text-[11px] font-medium text-slate-500">{rule.desc}</p>
                                        </div>
                                        <Switch checked={rule.active} className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">UTM Standardization Architecture</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Control the naming convention and validation of tracking parameters.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Tag size={18} className="text-indigo-600" />
                                        <p className="text-[13px] font-semibold text-slate-900">Enforce Lowercase UTMs</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <p className="text-[11px] text-slate-500 pl-7">Automatically convert "Google" and "GOOGLE" to "google" to prevent source fragmentation.</p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 space-y-2">
                                    <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Global URL Identifier</p>
                                    <Input defaultValue="gclid" className="h-10 rounded-xl border-slate-100 font-semibold text-[13px]" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Internal Ref Tag</p>
                                    <Input defaultValue="fi_ref" className="h-10 rounded-xl border-slate-100 font-semibold text-[13px]" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Tracking Health Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-50 text-indigo-900 p-6 space-y-6 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-500">
                            <Share2 size={120} />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <p className="text-[10px] font-semibold tracking-wider text-indigo-600 uppercase leading-none">Global Attribution Health</p>
                            <h3 className="text-[32px] font-semibold tracking-tight">99.2%</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-semibold tracking-wider uppercase text-indigo-400">
                                    <span>Sync Integrity</span>
                                    <span className="text-emerald-600">Peak</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: '99.2%' }} />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-indigo-200/50 space-y-3 relative z-10">
                            <div className="flex items-center gap-2 text-[11px] text-indigo-500 font-medium">
                                <RefreshCw size={12} /> Last logic rebuild: 4h ago
                            </div>
                            <Button className="w-full h-9 bg-white text-indigo-600 hover:bg-slate-50 shadow-sm border border-transparent font-semibold text-[11px] uppercase tracking-widest rounded-xl">
                                Force Rebuild Index
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                                <UserCheck size={20} />
                            </div>
                            <h4 className="text-[15px] font-semibold text-slate-900">Privacy Controls</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Configure how the system handles cookie-less traffic and GDPR/CCPA compliance for incoming markers.
                        </p>
                        <Button variant="outline" className="w-full h-9 bg-white border-slate-200 text-slate-900 font-semibold text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-50">
                            Privacy Setup
                        </Button>
                    </Card>

                    <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-white text-indigo-600 border border-indigo-200 shadow-sm">
                            <Info size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-semibold text-indigo-900">Architecture Tip</p>
                            <p className="text-[11px] text-indigo-700 font-medium leading-relaxed italic">
                                "Enforcing lowercase UTMs reduced data fragmentation by 18.4% last month."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
