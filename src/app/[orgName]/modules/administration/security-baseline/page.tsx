"use client"

import { useState } from "react"
import {
    ShieldCheck,
    Lock,
    Zap,
    RefreshCw,
    ChevronRight,
    ShieldAlert,
    Eye,
    FileText,
    BadgeCheck,
    AlertTriangle,
    History
} from "lucide-react"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function SecurityBaselinePage() {
    const [loading, setLoading] = useState(false)

    const handleApply = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.success("Security Baseline Policies Synced")
        }, 1500)
    }

    const policies = [
        {
            group: "ATTACK SURFACE REDUCTION",
            items: [
                { id: "p1", name: "Block legacy authentication", desc: "Disable IMAP, POP, and SMTP clients that don't support modern MFA.", status: true, severity: "Critical" },
                { id: "p2", name: "Restrict user consent", desc: "Prevent users from granting permissions to unverified third-party apps.", status: true, severity: "High" },
            ]
        },
        {
            group: "CREDENTIAL PROTECTION",
            items: [
                { id: "p3", name: "Require MFA for Admin Roles", desc: "Mandate multi-factor authentication for any user with privileged roles.", status: true, severity: "Critical" },
                { id: "p4", name: "Password expiration bypass detection", desc: "Flag accounts that haven't rotated credentials in 365+ days.", status: false, severity: "Medium" },
            ]
        }
    ]

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950">
            <SubHeader
                title="Baseline Security"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Governance", href: "#" },
                    { label: "Baselines", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton
                            variant="outline"
                            size="sm"
                            className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none h-10 px-4 font-bold"
                        >
                            <History className="w-3.5 h-3.5 mr-2" /> View History
                        </CustomButton>
                        <CustomButton
                            onClick={handleApply}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 px-6 font-bold shadow-xl flex items-center gap-2"
                        >
                            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                            Publish Baseline
                        </CustomButton>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Posture Score HUD */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none shadow-2xl overflow-hidden divide-x divide-zinc-100 dark:divide-zinc-800">
                    <div className="p-8 flex flex-col items-center text-center space-y-4">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Overall Posture</p>
                        <div className="relative">
                            <div className="text-6xl font-black text-zinc-900 dark:text-white tracking-tighter">84<span className="text-zinc-300 dark:text-zinc-700">/100</span></div>
                            <Badge className="absolute -top-2 -right-8 bg-emerald-500 text-white rounded-none border-0 text-[10px] font-black px-2">OPTIMIZING</Badge>
                        </div>
                        <p className="text-xs font-bold text-zinc-500">Security profile is stronger than 72% of peers</p>
                    </div>
                    <div className="p-8 flex flex-col justify-center space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Policy Coverage</span>
                                <span className="text-xl font-black text-zinc-900 dark:text-white">18/24</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-none overflow-hidden">
                                <div className="h-full bg-blue-500 w-[75%] shadow-[0_0_12px_rgba(59,130,246,0.5)]"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">MFA Adoption</span>
                                <span className="text-xl font-black text-zinc-900 dark:text-white">96%</span>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-none overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[96%] shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-zinc-900 text-white flex flex-col justify-between group cursor-pointer relative overflow-hidden">
                        <ShieldAlert className="absolute -bottom-6 -right-6 h-32 w-32 opacity-10 group-hover:scale-110 transition-transform" />
                        <div className="space-y-1 relative z-10">
                            <h5 className="text-sm font-black tracking-tight uppercase italic">High Risk Detection</h5>
                            <p className="text-xs text-zinc-300 font-medium italic">3 anomalous logins detected in the last 24h within administration scope.</p>
                        </div>
                        <CustomButton variant="outline" className="rounded-none border-zinc-700 text-white hover:bg-zinc-800 font-black text-[10px] uppercase h-10 tracking-widest relative z-10">
                            Investigate Threats <ChevronRight className="ml-2 w-4 h-4" />
                        </CustomButton>
                    </div>
                </div>

                {/* Policy Groups */}
                <div className="space-y-10">
                    {policies.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] font-sans">{group.group}</h4>
                                <Separator className="flex-1 bg-zinc-200 dark:bg-zinc-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {group.items.map((policy) => (
                                    <Card key={policy.id} className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-none shadow-sm hover:border-indigo-500/50 transition-all border-l-4 border-l-indigo-500">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-lg font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                                                        {policy.name}
                                                        {policy.severity === 'Critical' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs font-medium text-zinc-500 leading-relaxed max-w-sm">
                                                        {policy.desc}
                                                    </CardDescription>
                                                </div>
                                                <Switch
                                                    checked={policy.status}
                                                    className="data-[state=checked]:bg-indigo-600 rounded-none h-6 w-11"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800">
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1.5 grayscale opacity-50">
                                                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">NIST Compliant</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Eye className="w-3.5 h-3.5 text-zinc-300" />
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Detection only</span>
                                                    </div>
                                                </div>
                                                <Badge className={`rounded-none border-0 text-[10px] font-black uppercase tracking-widest ${policy.severity === 'Critical' ? 'bg-orange-50 text-orange-600' :
                                                    policy.severity === 'High' ? 'bg-blue-50 text-blue-600' : 'bg-zinc-100 text-zinc-500'
                                                    }`}>
                                                    {policy.severity} Severity
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Global Footer Banner */}
                <div className="bg-indigo-600 p-8 rounded-none text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                    <Zap className="absolute -bottom-10 -left-10 h-64 w-64 opacity-10" />
                    <div className="relative z-10 space-y-2">
                        <h4 className="text-2xl font-black tracking-tighter uppercase italic">Identity Security Baseline (ISB v1.2)</h4>
                        <p className="text-zinc-100 text-sm font-medium opacity-90 italic">
                            Applying this baseline will align your tenant with Microsoft Entra & Okta best practices. Changes might take up to 30 mins to propagate.
                        </p>
                    </div>
                    <CustomButton className="bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-none h-12 px-8 uppercase text-xs tracking-widest border-0 flex-shrink-0 relative z-10">
                        Download PDF Report <FileText className="ml-2 w-4 h-4" />
                    </CustomButton>
                </div>
            </div>
        </div>
    )
}
