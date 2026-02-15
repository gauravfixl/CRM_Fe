"use client"

import { useState } from "react"
import {
    ShieldCheck,
    Key,
    Lock,
    Zap,
    Monitor,
    Smartphone,
    ChevronRight,
    Info,
    CheckCircle2,
    LockKeyhole,
    History,
    ShieldAlert,
    Fingerprint,
    Cpu,
    ExternalLink,
    Search
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

export default function AuthenticationSettingsPage() {
    const [methods, setMethods] = useState({
        mfa: true,
        sso: false,
        passwordless: true,
        conditional: true
    })

    const authMethods = [
        {
            id: "mfa",
            name: "Multi-Factor Authentication",
            status: "ENFORCED",
            icon: Smartphone,
            color: "text-orange-600",
            bg: "bg-orange-50",
            desc: "Require an extra layer of security for all identities. Supports SMS, Authenticator app, and TOTP hardware.",
            active: methods.mfa
        },
        {
            id: "sso",
            name: "Single Sign-On (SSO)",
            status: "ENTERPRISE ONLY",
            icon: ExternalLink,
            color: "text-blue-600",
            bg: "bg-blue-50",
            desc: "Federate your directory with Microsoft Entra ID or Okta to allow users to sign in with their corporate credentials.",
            active: methods.sso
        },
        {
            id: "passwordless",
            name: "Passwordless Security",
            status: "EXPERIMENTAL",
            icon: Fingerprint,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            desc: "Allow users to log in using biometric sensors or FIDO2 security keys without ever typing a password.",
            active: methods.passwordless
        },
        {
            id: "conditional",
            name: "Conditional Access",
            status: "8 POLICIES ACTIVE",
            icon: LockKeyhole,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            desc: "Automatically block or challenge sign-ins based on location, device health, or user risk level.",
            active: methods.conditional
        }
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Authentication"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Security", href: "#" },
                    { label: "Auth Methods", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-none h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold">
                            Security Reports
                        </CustomButton>
                        <CustomButton className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-none h-10 px-6 font-black uppercase text-xs tracking-widest shadow-xl border-0">
                            Save Configuration
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Security Score HUD */}
                <div className="bg-zinc-950 text-white rounded-none p-1 shadow-2xl overflow-hidden flex flex-col md:flex-row border-b-8 border-b-emerald-500">
                    <div className="p-10 flex flex-col items-center justify-center md:border-r md:border-zinc-800 shrink-0">
                        <div className="relative h-32 w-32 mb-4">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-zinc-800 stroke-[3px]" />
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-emerald-500 stroke-[3px]" strokeDasharray="85, 100" strokeLinecap="square" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black italic text-white">85</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">SCORE</span>
                            </div>
                        </div>
                        <Badge className="bg-emerald-500 text-white border-0 rounded-none px-3 font-black text-[10px]">HEALTHY</Badge>
                    </div>

                    <div className="p-10 flex-1 space-y-6 relative overflow-hidden">
                        <Cpu className="absolute -bottom-6 -right-6 h-64 w-64 opacity-5 pointer-events-none" />
                        <div className="relative z-10 space-y-2">
                            <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">Identity Security Posture</h2>
                            <p className="text-zinc-300 font-medium leading-relaxed max-w-xl opacity-90">
                                Your organization's authentication infrastructure is currently resilient. Enabling <span className="text-white underline decoration-emerald-500/50">Passwordless FIDO2</span> login will improve your score to 92%.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4 relative z-10 pt-2">
                            <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 border border-zinc-800">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Strict MFA</span>
                            </div>
                            <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 border border-zinc-800">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Conditional Logic</span>
                            </div>
                            <div className="flex items-center gap-2 bg-zinc-900 px-4 py-2 border border-zinc-800">
                                <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest italic opacity-50 underline">SSO Pending</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {authMethods.map((method) => (
                        <Card key={method.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm hover:shadow-2xl transition-all group overflow-hidden border-l-4 border-l-zinc-100 dark:border-l-zinc-800 data-[active=true]:border-l-indigo-600" data-active={method.active}>
                            <CardHeader className="flex flex-row items-start justify-between pb-4">
                                <div className="flex gap-4">
                                    <div className={`h-12 w-12 flex items-center justify-center rounded-none border transition-colors ${method.active ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 border-zinc-100 dark:border-zinc-700'
                                        }`}>
                                        <method.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-black tracking-tight">{method.name}</CardTitle>
                                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${method.active ? 'text-indigo-600' : 'text-zinc-400'
                                            }`}>{method.status}</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={method.active}
                                    className="data-[state=checked]:bg-indigo-600 rounded-none h-6 w-11"
                                />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-xs font-medium text-zinc-500 leading-relaxed min-h-[40px]">
                                    {method.desc}
                                </p>
                                <div className="pt-4 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Badge className="bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-0 rounded-none text-[10px] font-black px-2 py-1">IDENTITY POLICY</Badge>
                                    </div>
                                    <CustomButton variant="ghost" className="h-10 text-[10px] text-zinc-500 font-black uppercase tracking-widest hover:text-indigo-600 group-hover:translate-x-1 transition-transform">
                                        Configuration <ChevronRight className="w-4 h-4 ml-1" />
                                    </CustomButton>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Audit & Logs */}
                <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-xl overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-row items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <History className="w-5 h-5 text-zinc-400 font-bold" />
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-widest">Critical Auth Events</CardTitle>
                                <CardDescription className="text-[10px] font-bold uppercase text-zinc-400">Real-time Directory Heartbeat</CardDescription>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                <Input placeholder="Filter entries..." className="pl-9 h-9 w-48 text-xs rounded-none border-zinc-200" />
                            </div>
                            <CustomButton variant="outline" className="h-9 rounded-none text-[10px] font-black uppercase tracking-widest border-zinc-200 bg-white dark:bg-zinc-950">
                                Full Logs
                            </CustomButton>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                            {[
                                { action: "Impossible Travel Detection", user: "Michael Chen", details: "Credential reuse detected from Stockholm, SE (Session Released)", time: "12 mins ago", severity: "high" },
                                { action: "Policy Enforcement Update", user: "Directory Admin", details: "MFA challenge bypassed for verified HR subnet", time: "1 hour ago", severity: "low" },
                                { action: "Brute Force Suppression", user: "sarah.j@fixl.com", details: "IP 182.4.1.20 blocked after 5 failed attempts", time: "3 hours ago", severity: "medium" },
                                { action: "Session Hijack Prevention", user: "Unknown Identity", details: "Token invalidation triggered for suspicious cookie reuse", time: "5 hours ago", severity: "critical" },
                            ].map((log, i) => (
                                <div key={i} className="p-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-all group">
                                    <div className="flex gap-6 items-center">
                                        <div className={`h-12 w-12 flex items-center justify-center rounded-none border font-black text-[10px] ${log.severity === 'critical' || log.severity === 'high' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            log.severity === 'medium' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-zinc-50 text-zinc-400 border-zinc-100'
                                            }`}>
                                            {log.severity.substring(0, 4).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{log.action}</p>
                                            <p className="text-xs text-zinc-400 font-medium">{log.user} <span className="mx-2">•</span> {log.details}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">{log.time}</span>
                                        <CustomButton variant="ghost" size="sm" className="h-8 px-2 text-[10px] font-bold uppercase text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Investigate
                                        </CustomButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}
