"use client"

import { useState } from "react"
import {
    ShieldCheck,
    RefreshCw,
    AlertTriangle,
    History,
    BadgeCheck,
    Eye,
    FileText,
    ShieldAlert,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

export default function SecurityBaselinePage() {
    const [loading, setLoading] = useState(false)

    const [policies, setPolicies] = useState([
        {
            group: "Attack Surface Reduction",
            items: [
                { id: "p1", name: "Block legacy authentication", desc: "Disable IMAP, POP, and SMTP clients that don't support modern MFA.", status: true, severity: "Critical" },
                { id: "p2", name: "Restrict user consent", desc: "Prevent users from granting permissions to unverified third-party apps.", status: true, severity: "High" },
            ]
        },
        {
            group: "Credential Protection",
            items: [
                { id: "p3", name: "Require MFA for Admin Roles", desc: "Mandate multi-factor authentication for any user with privileged roles.", status: true, severity: "Critical" },
                { id: "p4", name: "Password expiration bypass detection", desc: "Flag accounts that haven't rotated credentials in 365+ days.", status: false, severity: "Medium" },
            ]
        }
    ])

    const allItems = policies.flatMap((g) => g.items)
    const totalPolicies = allItems.length
    const criticalCount = allItems.filter((p) => p.severity === "Critical").length
    const enabledCount = allItems.filter((p) => p.status).length
    const complianceScore = Math.round((enabledCount / totalPolicies) * 100)

    const togglePolicy = (policyId: string) => {
        setPolicies((prev) =>
            prev.map((group) => ({
                ...group,
                items: group.items.map((item) =>
                    item.id === policyId ? { ...item, status: !item.status } : item
                ),
            }))
        )
        toast.info("Policy toggled")
    }

    const handleApply = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            toast.success("Security Baseline Policies Synced")
        }, 1500)
    }

    return (
        <div className="font-outfit relative min-h-screen bg-[#F8F9FC]">
            {/* Header */}
            <div className="px-4 md:px-8 pt-6 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-medium text-gray-400">Identity & Access</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-xs font-medium text-gray-400">Governance</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-xs font-semibold text-gray-900">Baselines</span>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Baseline Security</h1>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="rounded-xl font-semibold text-xs h-10 px-4"
                        onClick={() => toast.info("Viewing policy history")}
                    >
                        <History className="w-3.5 h-3.5 mr-2" /> View History
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={loading}
                        className="rounded-xl font-semibold text-xs h-10 px-6"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                        Publish Baseline
                    </Button>
                </div>
            </div>

            <div className="p-4 md:px-8 space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="rounded-xl bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <ShieldCheck className="w-5 h-5 text-white/80" />
                            </div>
                            <p className="text-xl font-semibold">{totalPolicies}</p>
                            <p className="text-xs text-white/80">Total Policies</p>
                            <p className="text-[10px] text-white/60 mt-0.5">Defined rules</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                            </div>
                            <p className="text-xl font-semibold text-gray-900">{criticalCount}</p>
                            <p className="text-xs text-gray-600">Critical</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">High priority policies</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            </div>
                            <p className="text-xl font-semibold text-gray-900">{enabledCount}</p>
                            <p className="text-xs text-gray-600">Enabled</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Currently active</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <ShieldAlert className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-xl font-semibold text-gray-900">{complianceScore}%</p>
                            <p className="text-xs text-gray-600">Compliance Score</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Based on enabled policies</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Policy Groups */}
                <div className="space-y-8">
                    {policies.map((group, gIdx) => (
                        <div key={gIdx} className="space-y-4">
                            <div className="flex items-center gap-4">
                                <h4 className="text-xs font-semibold text-gray-500">{group.group}</h4>
                                <Separator className="flex-1 bg-zinc-200" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {group.items.map((policy) => (
                                    <Card key={policy.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-l-4 border-l-indigo-500">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1 flex-1">
                                                    <CardTitle className="text-sm font-semibold tracking-tight text-gray-900 flex items-center gap-2">
                                                        {policy.name}
                                                        {policy.severity === "Critical" && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs font-medium text-gray-500 leading-relaxed max-w-sm">
                                                        {policy.desc}
                                                    </CardDescription>
                                                </div>
                                                <Switch
                                                    checked={policy.status}
                                                    onCheckedChange={() => togglePolicy(policy.id)}
                                                    className="data-[state=checked]:bg-indigo-600"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1.5 opacity-60">
                                                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span className="text-[10px] font-medium text-gray-400">NIST Compliant</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Eye className="w-3.5 h-3.5 text-zinc-300" />
                                                        <span className="text-[10px] font-medium text-gray-400">Detection only</span>
                                                    </div>
                                                </div>
                                                <Badge className={`rounded-full border-0 text-[10px] font-semibold ${
                                                    policy.severity === "Critical" ? "bg-orange-50 text-orange-600" :
                                                    policy.severity === "High" ? "bg-blue-50 text-blue-600" : "bg-zinc-100 text-zinc-500"
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

                {/* Footer Banner */}
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-indigo-900">Identity Security Baseline (ISB v1.2)</h4>
                        <p className="text-xs text-indigo-700/80 font-medium">
                            Applying this baseline will align your tenant with Microsoft Entra & Okta best practices. Changes might take up to 30 mins to propagate.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-xl font-semibold text-xs h-10 px-6 border-indigo-200 text-indigo-700 hover:bg-indigo-100 shrink-0"
                        onClick={() => toast.success("PDF report downloaded")}
                    >
                        <FileText className="w-4 h-4 mr-2" /> Download PDF Report
                    </Button>
                </div>
            </div>
        </div>
    )
}
