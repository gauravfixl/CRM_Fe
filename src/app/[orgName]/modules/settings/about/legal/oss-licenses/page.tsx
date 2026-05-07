"use client"

import * as React from "react"
import { Code2, Search, ExternalLink } from "lucide-react"
import { LegalShell } from "../_components/LegalShell"
import { Input } from "@/shared/components/ui/input"

type License = {
    name: string
    version: string
    license: string
    homepage: string
    purpose: string
}

const PACKAGES: License[] = [
    { name: "next", version: "14.2.16", license: "MIT", homepage: "https://nextjs.org", purpose: "React framework — App Router, server components, routing." },
    { name: "react", version: "18.3.1", license: "MIT", homepage: "https://react.dev", purpose: "UI library powering the entire frontend." },
    { name: "react-dom", version: "18.3.1", license: "MIT", homepage: "https://react.dev", purpose: "DOM rendering bindings for React." },
    { name: "typescript", version: "5.4.5", license: "Apache-2.0", homepage: "https://www.typescriptlang.org", purpose: "Static type checking across the codebase." },
    { name: "tailwindcss", version: "3.4.17", license: "MIT", homepage: "https://tailwindcss.com", purpose: "Utility-first CSS framework." },
    { name: "@radix-ui/react-*", version: "1.x", license: "MIT", homepage: "https://www.radix-ui.com", purpose: "Headless accessible UI primitives (dialog, dropdown, tabs, etc.)." },
    { name: "shadcn/ui", version: "—", license: "MIT", homepage: "https://ui.shadcn.com", purpose: "Component recipes layered on Radix and Tailwind." },
    { name: "lucide-react", version: "0.456.0", license: "ISC", homepage: "https://lucide.dev", purpose: "Icon library used throughout the UI." },
    { name: "zustand", version: "4.5.5", license: "MIT", homepage: "https://github.com/pmndrs/zustand", purpose: "Lightweight global state management." },
    { name: "axios", version: "1.7.9", license: "MIT", homepage: "https://axios-http.com", purpose: "HTTP client for API requests." },
    { name: "framer-motion", version: "11.13.1", license: "MIT", homepage: "https://www.framer.com/motion", purpose: "Animation primitives for transitions and gestures." },
    { name: "recharts", version: "2.15.0", license: "MIT", homepage: "https://recharts.org", purpose: "Composable charts for KPI dashboards." },
    { name: "date-fns", version: "3.6.0", license: "MIT", homepage: "https://date-fns.org", purpose: "Date utilities for formatting and parsing." },
    { name: "react-hook-form", version: "7.54.1", license: "MIT", homepage: "https://react-hook-form.com", purpose: "Form-state management used in forms with heavy validation." },
    { name: "zod", version: "3.24.1", license: "MIT", homepage: "https://zod.dev", purpose: "Schema validation paired with react-hook-form." },
    { name: "@tanstack/react-table", version: "8.21.3", license: "MIT", homepage: "https://tanstack.com/table", purpose: "Headless table library for sortable, filterable lists." },
    { name: "sonner", version: "1.7.1", license: "MIT", homepage: "https://sonner.emilkowal.ski", purpose: "Toast notifications." },
    { name: "cmdk", version: "1.0.4", license: "MIT", homepage: "https://cmdk.paco.me", purpose: "Command palette primitive." },
    { name: "clsx", version: "2.1.1", license: "MIT", homepage: "https://github.com/lukeed/clsx", purpose: "Conditional className composition." },
    { name: "tailwind-merge", version: "2.5.5", license: "MIT", homepage: "https://github.com/dcastil/tailwind-merge", purpose: "Smart merge of Tailwind class strings." },
    { name: "express", version: "4.21.2", license: "MIT", homepage: "https://expressjs.com", purpose: "Backend HTTP framework." },
    { name: "mongoose", version: "8.9.5", license: "MIT", homepage: "https://mongoosejs.com", purpose: "MongoDB ODM for backend models." },
    { name: "jsonwebtoken", version: "9.0.2", license: "MIT", homepage: "https://github.com/auth0/node-jsonwebtoken", purpose: "JWT signing and verification." },
    { name: "bcryptjs", version: "2.4.3", license: "MIT", homepage: "https://github.com/dcodeIO/bcrypt.js", purpose: "Password hashing." },
    { name: "nodemailer", version: "6.9.16", license: "MIT-0", homepage: "https://nodemailer.com", purpose: "SMTP email delivery." },
    { name: "multer", version: "1.4.5-lts.1", license: "MIT", homepage: "https://github.com/expressjs/multer", purpose: "Multipart upload middleware." },
    { name: "cors", version: "2.8.5", license: "MIT", homepage: "https://github.com/expressjs/cors", purpose: "Cross-origin resource sharing middleware." },
    { name: "dotenv", version: "16.4.7", license: "BSD-2-Clause", homepage: "https://github.com/motdotla/dotenv", purpose: "Load environment variables from .env files." },
]

const LICENSE_BADGE: Record<string, string> = {
    "MIT": "#10b981",
    "Apache-2.0": "#3b82f6",
    "ISC": "#8b5cf6",
    "BSD-2-Clause": "#f59e0b",
    "BSD-3-Clause": "#f59e0b",
    "MIT-0": "#10b981",
}

export default function OssLicensesPage() {
    const [query, setQuery] = React.useState("")
    const [licenseFilter, setLicenseFilter] = React.useState<string>("all")

    const licenses = React.useMemo(() => {
        const set = new Set(PACKAGES.map((p) => p.license))
        return ["all", ...Array.from(set).sort()]
    }, [])

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase()
        return PACKAGES.filter((p) => {
            if (licenseFilter !== "all" && p.license !== licenseFilter) return false
            if (!q) return true
            return p.name.toLowerCase().includes(q) || p.purpose.toLowerCase().includes(q)
        })
    }, [query, licenseFilter])

    return (
        <LegalShell
            title="Open Source Licenses"
            subtitle="Cubicle ERP is built on the shoulders of the open-source community. We gratefully acknowledge the projects below."
            lastUpdated="2026-04-30"
            accent="#6366f1"
            icon={<Code2 className="w-6 h-6 text-white" />}
            sections={[
                {
                    heading: "Acknowledgement",
                    body: (
                        <p>
                            Cubicle ERP includes open-source software components governed by their respective licenses. The
                            license text and source code for each component is available from the project&apos;s homepage. If a
                            component is missing from the list below, please email{" "}
                            <a href="mailto:legal@cubicleerp.com" className="text-[#6366f1] hover:underline">legal@cubicleerp.com</a>{" "}
                            and we will publish a correction.
                        </p>
                    ),
                },
                {
                    heading: "Browse Components",
                    children: (
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                    <Input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search by package name or purpose…"
                                        className="pl-9 h-9 rounded-none text-[12.5px]"
                                    />
                                </div>
                                <select
                                    value={licenseFilter}
                                    onChange={(e) => setLicenseFilter(e.target.value)}
                                    className="h-9 px-3 border text-[12.5px] bg-white rounded-none border-input"
                                >
                                    {licenses.map((l) => (
                                        <option key={l} value={l}>{l === "all" ? "All licenses" : l}</option>
                                    ))}
                                </select>
                                <span className="text-[11.5px] text-[#94A3B8] sm:px-2">
                                    {filtered.length} of {PACKAGES.length}
                                </span>
                            </div>

                            <div className="border bg-white shadow-sm rounded-none overflow-x-auto">
                                <table className="w-full text-[12.5px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-[#EEF1F6] text-[10.5px] font-bold uppercase tracking-wider text-[#64748B]">
                                            <th className="px-3 py-2.5 text-left">Package</th>
                                            <th className="px-3 py-2.5 text-left">Version</th>
                                            <th className="px-3 py-2.5 text-left">License</th>
                                            <th className="px-3 py-2.5 text-left">Purpose</th>
                                            <th className="px-3 py-2.5 text-right">Source</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F1F5F9]">
                                        {filtered.map((p) => (
                                            <tr key={p.name} className="hover:bg-slate-50/60">
                                                <td className="px-3 py-2.5 font-mono text-[12px] font-semibold text-[#0F172A]">{p.name}</td>
                                                <td className="px-3 py-2.5 font-mono text-[11.5px] text-[#64748B]">{p.version}</td>
                                                <td className="px-3 py-2.5">
                                                    <span
                                                        className="inline-flex px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-white rounded-none"
                                                        style={{ background: LICENSE_BADGE[p.license] ?? "#64748B" }}
                                                    >
                                                        {p.license}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2.5 text-[#475569]">{p.purpose}</td>
                                                <td className="px-3 py-2.5 text-right">
                                                    <a
                                                        href={p.homepage}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-[#6366f1] hover:underline text-[11.5px]"
                                                    >
                                                        Site <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                        {filtered.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-3 py-6 text-center text-[12px] text-[#94A3B8]">
                                                    No matching components.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ),
                },
                {
                    heading: "License Texts",
                    body: (
                        <p>
                            The full text of each license is available at{" "}
                            <a
                                href="https://cubicleerp.com/legal/oss-licenses.txt"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#6366f1] hover:underline inline-flex items-center gap-1"
                            >
                                cubicleerp.com/legal/oss-licenses.txt <ExternalLink className="w-3 h-3" />
                            </a>{" "}
                            or by request to <a href="mailto:legal@cubicleerp.com" className="text-[#6366f1] hover:underline">legal@cubicleerp.com</a>.
                            Customers running self-hosted or on-prem deployments will find the same file at{" "}
                            <span className="font-mono text-[12px]">/usr/share/doc/cubicle-erp/THIRD_PARTY_NOTICES</span>.
                        </p>
                    ),
                },
                {
                    heading: "Copyleft Components",
                    body: (
                        <p>
                            Cubicle ERP does not statically link any GPL or AGPL-licensed components into the distributed product.
                            Where copyleft tooling is used at build time only (e.g. development utilities), the obligations of the
                            license do not extend to the deployed Service. If you believe a copyleft component has been
                            inadvertently included, please notify <a href="mailto:legal@cubicleerp.com" className="text-[#6366f1] hover:underline">legal@cubicleerp.com</a> for prompt review.
                        </p>
                    ),
                },
            ]}
        />
    )
}
