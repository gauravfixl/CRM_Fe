"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ScrollText, Printer } from "lucide-react"
import { Button } from "@/shared/components/ui/button"

export type LegalSection = {
    heading: string
    body?: React.ReactNode
    bullets?: string[]
    children?: React.ReactNode
}

export function LegalShell({
    title,
    subtitle,
    lastUpdated,
    effectiveDate,
    accent = "#475569",
    icon,
    sections,
}: {
    title: string
    subtitle?: string
    lastUpdated: string
    effectiveDate?: string
    accent?: string
    icon?: React.ReactNode
    sections: LegalSection[]
}) {
    const params = useParams<{ orgName: string }>()
    const orgName = params?.orgName ?? ""

    const print = () => {
        if (typeof window !== "undefined") window.print()
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Link href={`/${orgName}/modules/settings/about`}>
                    <Button variant="outline" size="sm" className="h-8 rounded-none text-[12px] gap-1">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to About
                    </Button>
                </Link>
                <span className="text-[11.5px] text-[#94A3B8]">/ Legal & Compliance / {title}</span>
            </div>

            <div
                className="border shadow-sm overflow-hidden p-6 text-white relative rounded-none"
                style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 50%, ${accent}aa 100%)`, borderColor: "transparent" }}
            >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)" }} />
                <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 flex items-center justify-center bg-white/15 border border-white/20" style={{ borderRadius: 0 }}>
                            {icon ?? <ScrollText className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Legal Document</p>
                            <h1 className="text-[24px] font-black text-white mt-0.5">{title}</h1>
                            {subtitle && <p className="text-white/80 text-[12.5px] mt-1 max-w-2xl">{subtitle}</p>}
                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/15 text-[11px] font-semibold border border-white/20">
                                    Last updated: <span className="font-mono">{lastUpdated}</span>
                                </span>
                                {effectiveDate && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/15 text-[11px] font-semibold border border-white/20">
                                        Effective: <span className="font-mono">{effectiveDate}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button onClick={print} variant="outline" size="sm" className="h-8 rounded-none text-[12px] gap-1 bg-white/10 hover:bg-white/20 text-white border-white/30">
                        <Printer className="w-3.5 h-3.5" /> Print
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <aside className="lg:col-span-1 lg:sticky lg:top-4 lg:self-start">
                    <div className="border bg-white shadow-sm rounded-none">
                        <div className="px-4 py-3 border-b border-[#EEF1F6] flex items-start gap-2">
                            <span className="w-1 h-7" style={{ background: accent }} />
                            <div>
                                <h3 className="text-[12.5px] font-semibold text-[#0F172A]">On this page</h3>
                                <p className="text-[10.5px] text-[#94A3B8]">{sections.length} sections</p>
                            </div>
                        </div>
                        <ol className="divide-y divide-[#F1F5F9]">
                            {sections.map((s, i) => (
                                <li key={s.heading}>
                                    <a href={`#sec-${i + 1}`} className="block px-4 py-2.5 hover:bg-slate-50 transition-colors group">
                                        <span className="text-[10.5px] font-mono text-[#94A3B8] mr-1.5">{String(i + 1).padStart(2, "0")}</span>
                                        <span className="text-[12px] font-medium text-[#0F172A] group-hover:text-[#1e293b]">{s.heading}</span>
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </div>
                </aside>

                <div className="lg:col-span-3 border bg-white shadow-sm rounded-none">
                    <div className="px-6 py-5 divide-y divide-[#F1F5F9]">
                        {sections.map((s, i) => (
                            <section key={s.heading} id={`sec-${i + 1}`} className="py-5 first:pt-0 last:pb-0 scroll-mt-6">
                                <div className="flex items-start gap-2 mb-3">
                                    <span className="text-[10.5px] font-mono text-white px-1.5 py-0.5" style={{ background: accent, borderRadius: 0 }}>
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <h2 className="text-[15px] font-bold text-[#0F172A]">{s.heading}</h2>
                                </div>
                                {s.body && <div className="text-[13px] text-[#475569] leading-relaxed space-y-2">{s.body}</div>}
                                {s.bullets && (
                                    <ul className="mt-2 space-y-1.5 ml-1">
                                        {s.bullets.map((b, j) => (
                                            <li key={j} className="text-[12.5px] text-[#475569] flex items-start gap-2">
                                                <span className="w-1 h-1 mt-2 shrink-0" style={{ background: accent }} />
                                                <span>{b}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {s.children && <div className="mt-3">{s.children}</div>}
                            </section>
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-center text-[11px] text-[#94A3B8] pt-2 pb-4">
                Questions about this document? Contact{" "}
                <a href="mailto:legal@cubicleerp.com" className="text-[#2563eb] hover:underline">legal@cubicleerp.com</a>
                {" · "}© 2026 Fixl Solutions Pvt. Ltd.
            </div>
        </div>
    )
}
