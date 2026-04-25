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
    CheckCircle2,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"
import { showSuccess } from "@/shared/utils/toast"

type PolicyItem = {
    id: string
    name: string
    desc: string
    status: boolean
    severity: "Critical" | "High" | "Medium"
}

type PolicyGroup = {
    group: string
    items: PolicyItem[]
}

export default function SecurityBaselinePage() {
    const [loading, setLoading] = useState(false)

    const [policies, setPolicies] = useState<PolicyGroup[]>([
        {
            group: "Attack Surface Reduction",
            items: [
                { id: "p1", name: "Block legacy authentication", desc: "Disable IMAP, POP, and SMTP clients that don't support modern MFA.", status: true, severity: "Critical" },
                { id: "p2", name: "Restrict user consent", desc: "Prevent users from granting permissions to unverified third-party apps.", status: true, severity: "High" },
            ],
        },
        {
            group: "Credential Protection",
            items: [
                { id: "p3", name: "Require MFA for Admin Roles", desc: "Mandate multi-factor authentication for any user with privileged roles.", status: true, severity: "Critical" },
                { id: "p4", name: "Password expiration bypass detection", desc: "Flag accounts that haven't rotated credentials in 365+ days.", status: false, severity: "Medium" },
            ],
        },
    ])

    const allItems = policies.flatMap((g) => g.items)
    const totalPolicies = allItems.length
    const criticalCount = allItems.filter((p) => p.severity === "Critical").length
    const enabledCount = allItems.filter((p) => p.status).length
    const complianceScore = totalPolicies === 0 ? 0 : Math.round((enabledCount / totalPolicies) * 100)

    const togglePolicy = (policyId: string) => {
        setPolicies((prev) =>
            prev.map((group) => ({
                ...group,
                items: group.items.map((item) =>
                    item.id === policyId ? { ...item, status: !item.status } : item
                ),
            }))
        )
    }

    const handleApply = async () => {
        setLoading(true)
        try {
            await new Promise((r) => setTimeout(r, 800))
            showSuccess("Security baseline policies synced")
        } finally {
            setLoading(false)
        }
    }

    const severityBadge = (severity: PolicyItem["severity"]) => {
        if (severity === "Critical") {
            return (
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-none">
                    <span className="text-[10px] font-medium">Critical</span>
                </div>
            )
        }
        if (severity === "High") {
            return (
                <div className="inline-flex items-center gap-2 px-2 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-none">
                    <span className="text-[10px] font-medium">High</span>
                </div>
            )
        }
        return (
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-zinc-50 text-zinc-500 border border-zinc-200 rounded-none">
                <span className="text-[10px] font-medium">Medium</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Baseline Security</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Enforce organization-wide security policies aligned with industry best practices.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => showSuccess("Viewing policy history")}
                            className="rounded-none border-zinc-200 font-medium text-xs h-8 gap-1.5 px-4"
                        >
                            <History size={14} />
                            View History
                        </Button>
                        <Button
                            onClick={handleApply}
                            disabled={loading}
                            size="sm"
                            className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-5"
                        >
                            {loading ? <RefreshCw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                            {loading ? "Publishing..." : "Publish Baseline"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Policies</p>
                        <p className="text-white text-xl font-semibold mt-1">{totalPolicies}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Defined rules</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Critical</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{criticalCount}</p>
                        <p className="text-rose-600 text-[10px] mt-1">High priority policies</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Enabled</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{enabledCount}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Currently active</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Compliance Score</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{complianceScore}%</p>
                        <p className="text-primary text-[10px] mt-1">Based on enabled policies</p>
                    </div>
                </div>

                {/* Policy Groups */}
                <div className="space-y-6">
                    {policies.map((group, gIdx) => (
                        <div key={gIdx} className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                            <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-primary" />
                                <h3 className="text-sm font-semibold text-gray-900">{group.group}</h3>
                            </div>

                            <div className="divide-y divide-zinc-100">
                                {group.items.map((policy) => (
                                    <div key={policy.id} className="p-5 flex items-start justify-between gap-4 hover:bg-primary/5 transition-colors">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-semibold text-gray-900">{policy.name}</h4>
                                                {policy.severity === "Critical" && (
                                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                                                )}
                                            </div>
                                            <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">{policy.desc}</p>
                                            <div className="flex items-center gap-4 pt-1">
                                                <div className="flex items-center gap-1.5 opacity-70">
                                                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                    <span className="text-[10px] font-medium text-zinc-500">NIST Compliant</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 opacity-70">
                                                    <Eye className="w-3.5 h-3.5 text-zinc-400" />
                                                    <span className="text-[10px] font-medium text-zinc-500">Detection only</span>
                                                </div>
                                                {severityBadge(policy.severity)}
                                            </div>
                                        </div>
                                        <Switch
                                            checked={policy.status}
                                            onCheckedChange={() => togglePolicy(policy.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Banner */}
                <div className="bg-white border border-gray-200 rounded-none p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <ShieldAlert size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Identity Security Baseline (ISB v1.2)</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed max-w-2xl">
                                Applying this baseline aligns your tenant with Microsoft Entra &amp; Okta best practices.
                                Changes can take up to 30 minutes to propagate.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none border-zinc-200 font-medium text-xs h-8 gap-1.5 px-4 shrink-0"
                        onClick={() => showSuccess("PDF report downloaded")}
                    >
                        <FileText size={14} />
                        Download PDF Report
                    </Button>
                </div>
            </div>
        </div>
    )
}
