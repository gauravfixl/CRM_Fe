"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Shield,
    ShieldCheck,
    Lock,
    Eye,
    EyeOff,
    Database,
    FileSearch,
    RefreshCcw,
    Save,
    AlertTriangle,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"

export default function ClientPrivacyPage() {
    const [gdprCompliance, setGdprCompliance] = useState(true)
    const [dataEncryption, setDataEncryption] = useState(true)
    const [piiMasking, setPiiMasking] = useState(true)
    const [auditLogging, setAuditLogging] = useState(true)
    const [rightToErasure, setRightToErasure] = useState(true)
    const [consentTracking, setConsentTracking] = useState(false)

    const handleAction = (msg: string) => {
        toast.success(msg)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Data Retention & Privacy</h1>
                            <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-black uppercase tracking-widest px-3">GDPR COMPLIANT</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Manage data protection, privacy policies, and regulatory compliance for client information.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Privacy audit initiated")}
                        className="h-10 border-zinc-200 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <FileSearch className="w-4 h-4 mr-2" />
                        Run Audit
                    </Button>
                    <Button
                        onClick={() => handleAction("Privacy settings saved")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-100 active:scale-95 transition-all"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Settings
                    </Button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Privacy Score</p>
                        <ShieldCheck className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">98.5%</p>
                        <p className="text-[10px] text-white">Excellent protection</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Encrypted Records</p>
                        <Lock className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">100%</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">AES-256 encryption</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">PII Fields Masked</p>
                        <EyeOff className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">12 Fields</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Protected data</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Audit Logs</p>
                        <Database className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">24,847</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Access events logged</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* PRIVACY POLICIES */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
                <h3 className="text-lg font-black text-zinc-900 uppercase italic tracking-tight mb-6">Privacy & Compliance Policies</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PolicyToggle
                        title="GDPR Compliance Mode"
                        description="Enable full GDPR compliance including right to access, rectification, and erasure."
                        icon={ShieldCheck}
                        checked={gdprCompliance}
                        onCheckedChange={setGdprCompliance}
                        color="emerald"
                    />

                    <PolicyToggle
                        title="Data Encryption at Rest"
                        description="Encrypt all client data using AES-256 encryption standards."
                        icon={Lock}
                        checked={dataEncryption}
                        onCheckedChange={setDataEncryption}
                        color="blue"
                    />

                    <PolicyToggle
                        title="PII Data Masking"
                        description="Automatically mask personally identifiable information for non-admin users."
                        icon={EyeOff}
                        checked={piiMasking}
                        onCheckedChange={setPiiMasking}
                        color="indigo"
                    />

                    <PolicyToggle
                        title="Comprehensive Audit Logging"
                        description="Log all data access, modifications, and deletions for compliance audits."
                        icon={FileSearch}
                        checked={auditLogging}
                        onCheckedChange={setAuditLogging}
                        color="amber"
                    />

                    <PolicyToggle
                        title="Right to Erasure (GDPR)"
                        description="Allow clients to request complete deletion of their personal data."
                        icon={AlertTriangle}
                        checked={rightToErasure}
                        onCheckedChange={setRightToErasure}
                        color="rose"
                    />

                    <PolicyToggle
                        title="Consent Tracking"
                        description="Track and manage client consent for data processing activities."
                        icon={CheckCircle2}
                        checked={consentTracking}
                        onCheckedChange={setConsentTracking}
                        color="teal"
                    />
                </div>
            </div>

            {/* COMPLIANCE NOTICE */}
            <div className="p-8 bg-zinc-900 rounded-3xl text-white shadow-2xl relative overflow-hidden border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="flex gap-6 items-center">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                            <Shield className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black uppercase italic tracking-widest mb-1 text-blue-400">Regulatory Compliance</h4>
                            <p className="text-xs text-white/50 font-bold leading-relaxed max-w-xl italic">
                                Your organization is compliant with GDPR, CCPA, and SOC 2 Type II standards. All client data is encrypted, access is logged, and privacy policies are enforced organization-wide.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => handleAction("Downloading compliance report (PDF)...")}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-900/40"
                    >
                        Download Compliance Report
                    </Button>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full -mr-48 -mt-48 blur-[80px]" />
            </div>
        </div>
    )
}

function PolicyToggle({ title, description, icon: Icon, checked, onCheckedChange, color = "blue" }: any) {
    return (
        <div className={`flex items-start justify-between p-4 rounded-2xl border border-zinc-100 hover:border-${color}-100 transition-all group`}>
            <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl bg-zinc-50 group-hover:bg-${color}-50 flex items-center justify-center text-zinc-400 group-hover:text-${color}-600 transition-colors shadow-sm`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-xs font-black text-zinc-800 uppercase italic tracking-tight mb-1">{title}</h4>
                    <p className="text-[11px] text-zinc-400 font-bold leading-relaxed pr-4 italic">{description}</p>
                </div>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onCheckedChange}
                className={`data-[state=checked]:bg-${color}-600 mt-1 scale-90`}
            />
        </div>
    )
}
