"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
    ShieldCheck, Info, BookOpen, MessageSquare, Mail, Phone, ExternalLink, Copy, Sparkles, Check, Award, Globe, CreditCard, Server, GitBranch,
    ScrollText, Lock, FileSignature, ShieldAlert, Code2,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

const APP_INFO = {
    productName: "Cubicle ERP",
    edition: "Enterprise",
    version: "2.6.0",
    build: "2026.05.07-a3f9c12",
    apiVersion: "v3",
    license: "Annual Subscription · Pro Tier",
    licenseExpiry: "2027-04-30",
    nodeVersion: "20.11.1",
    region: "ap-south-1 (Mumbai)",
    instance: "prod-cluster-04",
}

const SUPPORT_LINKS = [
    { icon: <BookOpen className="w-4 h-4" />, title: "Documentation", desc: "Complete user & admin guides", href: "https://docs.cubicleerp.com", accent: "#2563eb" },
    { icon: <MessageSquare className="w-4 h-4" />, title: "Community Forum", desc: "Ask & answer with other users", href: "https://community.cubicleerp.com", accent: "#10b981" },
    { icon: <Mail className="w-4 h-4" />, title: "Email Support", desc: "support@cubicleerp.com", href: "mailto:support@cubicleerp.com", accent: "#8b5cf6" },
    { icon: <Phone className="w-4 h-4" />, title: "Priority Phone", desc: "+91-80-1234-5678 (Mon–Fri 9-6 IST)", href: "tel:+918012345678", accent: "#f59e0b" },
]

const LEGAL_LINKS = [
    { title: "Terms of Service", slug: "terms-of-service", desc: "User agreement & subscription terms", icon: <ScrollText className="w-3.5 h-3.5" />, accent: "#2563eb" },
    { title: "Privacy Policy", slug: "privacy-policy", desc: "How we handle personal data", icon: <Lock className="w-3.5 h-3.5" />, accent: "#10b981" },
    { title: "Data Processing Addendum", slug: "dpa", desc: "GDPR processor obligations", icon: <FileSignature className="w-3.5 h-3.5" />, accent: "#8b5cf6" },
    { title: "Acceptable Use Policy", slug: "aup", desc: "Prohibited activities & enforcement", icon: <ShieldAlert className="w-3.5 h-3.5" />, accent: "#f59e0b" },
    { title: "Security Whitepaper", slug: "security-whitepaper", desc: "Infrastructure & encryption details", icon: <ShieldCheck className="w-3.5 h-3.5" />, accent: "#0ea5e9" },
    { title: "Open Source Licenses", slug: "oss-licenses", desc: "Third-party components & licenses", icon: <Code2 className="w-3.5 h-3.5" />, accent: "#6366f1" },
]

const RELEASE_HIGHLIGHTS = [
    { ver: "2.6.0", date: "2026-05-01", changes: ["Added Settings module with 10 admin pages", "New Supply Chain Management module", "Light-color KPI cards across dashboards"] },
    { ver: "2.5.4", date: "2026-04-15", changes: ["HRM Reports Hub backend hooks", "RBAC frontend completion", "Performance improvements on dashboard load"] },
    { ver: "2.5.0", date: "2026-03-20", changes: ["Multi-firm switching support", "Branding & theme customization", "Activity logs with deep filtering"] },
]

export default function AboutPage() {
    const { toast } = useToast()
    const params = useParams<{ orgName: string }>()
    const orgName = params?.orgName ?? ""

    const copy = (label: string, value: string) => {
        navigator.clipboard?.writeText(value)
        toast({ title: `${label} copied`, description: value })
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                    <Info className="w-5 h-5 text-[#2563eb]" /> About & Help
                </h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">Version, license, support and legal information.</p>
            </div>

            {/* Hero - Product banner */}
            <div
                className="border shadow-sm overflow-hidden p-6 text-white relative rounded-none"
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #6366f1 50%, #8b5cf6 100%)", borderColor: "transparent" }}
            >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)" }} />
                <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{APP_INFO.edition} Edition</p>
                        <h2 className="text-[28px] font-black text-white mt-1">{APP_INFO.productName}</h2>
                        <p className="text-white/80 text-[13px] mt-1">Version <span className="font-mono font-bold">{APP_INFO.version}</span> · Build <span className="font-mono">{APP_INFO.build}</span></p>
                        <div className="flex items-center gap-3 mt-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/15 text-[11px] font-semibold border border-white/20">
                                <Check className="w-3 h-3" /> Up to date
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/15 text-[11px] font-semibold border border-white/20">
                                <Award className="w-3 h-3" /> Licensed
                            </span>
                        </div>
                    </div>
                    <Sparkles className="w-12 h-12 text-amber-300/80" />
                </div>
            </div>

            {/* System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border bg-white shadow-sm rounded-none">
                    <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                        <span className="w-1 h-9 bg-blue-500" />
                        <div>
                            <h3 className="text-[14px] font-semibold text-[#0F172A]">System Information</h3>
                            <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Read-only — for support tickets</p>
                        </div>
                    </div>
                    <div className="divide-y divide-[#F1F5F9]">
                        <InfoRow icon={<GitBranch className="w-3.5 h-3.5" />} label="Version" value={APP_INFO.version} onCopy={() => copy("Version", APP_INFO.version)} />
                        <InfoRow icon={<GitBranch className="w-3.5 h-3.5" />} label="Build" value={APP_INFO.build} mono onCopy={() => copy("Build", APP_INFO.build)} />
                        <InfoRow icon={<Server className="w-3.5 h-3.5" />} label="API Version" value={APP_INFO.apiVersion} />
                        <InfoRow icon={<Server className="w-3.5 h-3.5" />} label="Node.js" value={APP_INFO.nodeVersion} mono />
                        <InfoRow icon={<Globe className="w-3.5 h-3.5" />} label="Region" value={APP_INFO.region} />
                        <InfoRow icon={<Server className="w-3.5 h-3.5" />} label="Instance" value={APP_INFO.instance} mono onCopy={() => copy("Instance ID", APP_INFO.instance)} />
                    </div>
                </div>

                <div className="border shadow-sm rounded-none" style={{ background: "linear-gradient(180deg, #10b9810d 0%, #ffffff 50%)", borderColor: "#10b98126" }}>
                    <div className="px-5 py-3.5 border-b flex items-start gap-2" style={{ borderColor: "#10b98122" }}>
                        <span className="w-1 h-9 bg-emerald-500" />
                        <div>
                            <h3 className="text-[14px] font-semibold text-[#0F172A]">License</h3>
                            <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Subscription details</p>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #10b981, #059669)", borderRadius: 0 }}>
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[15px] font-bold text-[#0F172A]">{APP_INFO.license}</p>
                                <p className="text-[12px] text-[#64748B]">Renews on {APP_INFO.licenseExpiry}</p>
                            </div>
                        </div>
                        <Link href="/modules/billing/plan">
                            <Button className="w-full h-9 rounded-none text-white text-[13px]" style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 12px #10b98133" }}>
                                <CreditCard className="w-4 h-4 mr-1.5" /> View Plan & Billing
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Help & Support */}
            <div className="border bg-white shadow-sm rounded-none">
                <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                    <span className="w-1 h-9 bg-violet-500" />
                    <div>
                        <h3 className="text-[14px] font-semibold text-[#0F172A]">Help & Support</h3>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Get help when you need it</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-5">
                    {SUPPORT_LINKS.map((s) => (
                        <a
                            key={s.title}
                            href={s.href}
                            target={s.href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="border p-3 transition-all hover:shadow-md hover:-translate-y-0.5 rounded-none"
                            style={{ background: `linear-gradient(135deg, ${s.accent}14, ${s.accent}06 45%, #ffffff 100%)`, borderColor: `${s.accent}33` }}
                        >
                            <div className="w-9 h-9 flex items-center justify-center text-white mb-2" style={{ background: s.accent, boxShadow: `0 4px 12px ${s.accent}33`, borderRadius: 0 }}>
                                {s.icon}
                            </div>
                            <p className="text-[13px] font-semibold text-[#0F172A] inline-flex items-center gap-1">
                                {s.title}
                                {s.href.startsWith("http") && <ExternalLink className="w-3 h-3 text-[#94A3B8]" />}
                            </p>
                            <p className="text-[11.5px] text-[#64748B] mt-0.5">{s.desc}</p>
                        </a>
                    ))}
                </div>
            </div>

            {/* Release notes + Legal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 border bg-white shadow-sm rounded-none">
                    <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                        <span className="w-1 h-9 bg-amber-500" />
                        <div>
                            <h3 className="text-[14px] font-semibold text-[#0F172A]">Release Highlights</h3>
                            <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Recent product updates</p>
                        </div>
                    </div>
                    <ul className="divide-y divide-[#F1F5F9]">
                        {RELEASE_HIGHLIGHTS.map((r) => (
                            <li key={r.ver} className="px-5 py-4">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <p className="text-[13.5px] font-semibold text-[#0F172A] inline-flex items-center gap-2">
                                        <span className="font-mono text-[11.5px] bg-blue-50 text-blue-700 px-2 py-0.5 border border-blue-200 rounded-none">v{r.ver}</span>
                                        {r.ver === APP_INFO.version && <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-none">Current</span>}
                                    </p>
                                    <span className="text-[11.5px] text-[#94A3B8] tabular-nums">{r.date}</span>
                                </div>
                                <ul className="space-y-1 ml-1">
                                    {r.changes.map((c, i) => (
                                        <li key={i} className="text-[12.5px] text-[#64748B] flex items-start gap-1.5">
                                            <Check className="w-3 h-3 mt-1 text-emerald-600 shrink-0" /> {c}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border bg-white shadow-sm rounded-none">
                    <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-start gap-2">
                        <span className="w-1 h-9 bg-slate-500" />
                        <div>
                            <h3 className="text-[14px] font-semibold text-[#0F172A]">Legal & Compliance</h3>
                            <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Policies and agreements</p>
                        </div>
                    </div>
                    <ul className="divide-y divide-[#F1F5F9]">
                        {LEGAL_LINKS.map((l) => (
                            <li key={l.title}>
                                <Link
                                    href={`/${orgName}/modules/settings/about/legal/${l.slug}`}
                                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <span
                                            className="w-7 h-7 flex items-center justify-center text-white shrink-0"
                                            style={{ background: l.accent, borderRadius: 0 }}
                                        >
                                            {l.icon}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-[12.5px] font-semibold text-[#0F172A] truncate">{l.title}</p>
                                            <p className="text-[10.5px] text-[#94A3B8] truncate">{l.desc}</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#64748B] group-hover:translate-x-0.5 transition-all shrink-0" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="text-center text-[11px] text-[#94A3B8] pt-4">
                © 2026 Fixl Solutions Pvt. Ltd. All rights reserved. · Made with ♥ in India
            </div>
        </div>
    )
}

function InfoRow({ icon, label, value, mono, onCopy }: { icon: React.ReactNode; label: string; value: string; mono?: boolean; onCopy?: () => void }) {
    return (
        <div className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50/40 transition-colors">
            <div className="flex items-center gap-2 min-w-0">
                <span className="text-[#94A3B8]">{icon}</span>
                <span className="text-[12.5px] text-[#64748B]">{label}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[13px] font-semibold text-[#0F172A] ${mono ? "font-mono text-[12px]" : ""}`}>{value}</span>
                {onCopy && (
                    <Button onClick={onCopy} variant="ghost" size="icon" className="h-7 w-7 rounded-none hover:bg-slate-200" title="Copy">
                        <Copy className="w-3 h-3 text-[#94A3B8]" />
                    </Button>
                )}
            </div>
        </div>
    )
}
