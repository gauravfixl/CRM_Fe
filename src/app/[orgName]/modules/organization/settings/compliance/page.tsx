"use client"

import React, { useState } from "react"
import {
    ShieldCheck,
    FileShield,
    Lock,
    AlertCircle,
    CheckCircle2,
    Info,
    Download,
    History,
    Fingerprint,
    Database,
    ShieldAlert,
    ExternalLink,
    Scale,
    Gavel,
    Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

const complianceStandards = [
    { name: "GDPR Compliance", desc: "Data protection and privacy for EU citizens.", status: "Verified", date: "Jan 2024", icon: FileShield },
    { name: "SOC 2 Type II", desc: "Security, availability, and processing integrity.", status: "Active", date: "Feb 2024", icon: ShieldCheck },
    { name: "HIPAA Standard", desc: "Patient data privacy and security provisions.", status: "In-Progress", date: "Reviewing", icon: Scale },
]

export default function CompliancePage() {
    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Compliance & Regulatory</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage institutional certificates, data retention policies, and legal standards.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Downloading historical audit logs ZIP...")}>
                        <Download className="w-4 h-4" />
                        Download Audit Package
                    </Button>
                </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <SmallCard className="bg-white border-slate-200 shadow-sm border-l-4 border-l-emerald-600">
                    <SmallCardHeader className="pb-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Compliance Score</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-emerald-600">92%</p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Above industry baseline
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-l-4 border-l-blue-600">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Data Residency</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-slate-900">Multiple</p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                            US-East, EU-Central, APAC
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-l-4 border-l-indigo-600">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Active Audits</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-indigo-600">2</p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                            SOC 2 (Yearly), HIPAA
                        </p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-slate-200 shadow-sm border-l-4 border-l-amber-600">
                    <SmallCardHeader className="pb-2 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Retention Alerts</p>
                    </SmallCardHeader>
                    <SmallCardContent className="text-left">
                        <p className="text-2xl font-black text-amber-600">Low</p>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                            No critical data expiring
                        </p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* CERTIFICATES & SETTINGS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* STANDARDS */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg font-bold text-slate-900">Regulatory Certifications</CardTitle>
                            <CardDescription className="text-xs">Formal attestations of organization-wide compliance.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {complianceStandards.map((std) => (
                                    <div key={std.name} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                                <std.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900">{std.name}</h4>
                                                <p className="text-[11px] text-slate-500 font-medium mt-1">{std.desc}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <Badge className={`text-[9px] font-black uppercase tracking-widest rounded-md ${std.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    std.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        'bg-amber-50 text-amber-700 border-amber-100'
                                                }`} variant="outline">
                                                {std.status}
                                            </Badge>
                                            <span className="text-[10px] text-slate-400 font-bold">{std.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/30 border-t border-slate-100 p-4">
                            <Button variant="ghost" className="w-full text-xs font-black uppercase text-blue-600 gap-2 h-9">
                                Browse Legal Directory <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-slate-200 shadow-sm p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <History className="w-5 h-5 text-blue-600" />
                                Data Retention Policies
                            </h3>
                            <Button variant="ghost" className="text-xs font-bold text-blue-600" onClick={() => toast.info("Opening detailed retention editor")}>Edit Schedule</Button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: "Financial Records Retention", meta: "Required by Law", value: "7 Years", autoPurge: true },
                                { label: "Client CRM History", meta: "Institution Policy", value: "Indefinite", autoPurge: false },
                                { label: "Internal Activity Logs", meta: "System Default", value: "12 Months", autoPurge: true },
                            ].map((pol) => (
                                <div key={pol.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 leading-none">{pol.label}</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{pol.meta} • {pol.value}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-Purge</span>
                                        <Switch checked={pol.autoPurge} onCheckedChange={() => toast.success(`Purge policy updated for ${pol.label}`)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* SIDEBAR OPS */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-none rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                            <Gavel className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <Badge className="bg-emerald-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-2 mb-2">Legal Hold Active</Badge>
                            <h4 className="text-lg font-black tracking-tight leading-snug font-sans">Corporate Legal Hold prevents critical data purge.</h4>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed font-sans">
                                Currently 4 entities are under Legal Hold due to pending "Audit-2024". Their data retention overrides all other policies.
                            </p>
                            <Button className="w-full bg-white text-slate-950 hover:bg-slate-100 font-black uppercase text-[10px] tracking-widest h-10 mt-4 shadow-xl">
                                Review Active Holds
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-slate-200 shadow-sm p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="w-5 h-5 text-blue-600" />
                            <h3 className="text-sm font-bold text-slate-900">Compliance Officer</h3>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">JD</div>
                            <div>
                                <p className="text-xs font-bold text-slate-900 leading-none">John Doe (Legal)</p>
                                <p className="text-[10px] text-slate-500 font-medium mt-1">compliance@fixl.io</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full text-xs font-bold border-slate-200 h-10 flex items-center justify-between">
                            Authorized Registry <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                        </Button>
                    </Card>

                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <h5 className="text-[11px] font-black text-amber-900 uppercase">Policy Warning</h5>
                            <p className="text-[10px] text-amber-700/80 leading-relaxed font-medium mt-0.5">
                                Changing data residency from US to EU may require a full data migration audit and 48-hour service downtime.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
