"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    MousePointer2,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    Link as LinkIcon,
    Database,
    ArrowRight,
    Copy,
    Settings2,
    CheckCircle2,
    AlertTriangle,
    Activity,
    Code,
    Terminal,
    Hash,
    Layers,
    ExternalLink,
    Zap,
    LayoutTemplate
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

// --- Mock Data: UTM Configurations ---
const UTM_PARAMETERS = [
    { id: "1", key: "utm_source", description: "Identifies the source of traffic (e.g. google, linkedin)", mapping: "System Source", captures: 12450 },
    { id: "2", key: "utm_medium", description: "Identifies the medium used (e.g. cpc, email)", mapping: "Lead Channel", captures: 12450 },
    { id: "3", key: "utm_campaign", description: "Identifies the specific campaign name", mapping: "Campaign Name", captures: 11200 },
    { id: "4", key: "utm_content", description: "Used for A/B testing and content-level tracking", mapping: "Internal Reference", captures: 4500 },
    { id: "5", key: "utm_term", description: "Identifies search terms used in paid ads", mapping: "Lead Metadata", captures: 2100 },
]

export default function UTMTrackingPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [utmBuilder, setUtmBuilder] = useState({
        url: "https://example.com/demo",
        source: "google",
        medium: "cpc",
        campaign: "q1_promo"
    })

    useEffect(() => {
        setIsClient(true)
    }, [])

    const generatedLink = `${utmBuilder.url}?utm_source=${utmBuilder.source}&utm_medium=${utmBuilder.medium}&utm_campaign=${utmBuilder.campaign}`

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLink)
        toast({ title: "Link Copied", description: "UTM-tagged URL is ready for your campaign." })
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
                            <div className="p-2 rounded-lg bg-cyan-50 text-cyan-600 border border-cyan-100 shadow-sm">
                                <LinkIcon className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                UTM Parameter Engine
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Automatically capture, map, and standardize global UTM parameters. Ensure every link click translates into structured lead data.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5">
                        <Terminal className="h-4 w-4 mr-2 text-slate-400" /> API SDK Docs
                    </Button>
                    <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none">
                        <Plus className="h-4 w-4 mr-2" /> Global Mapping
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Visual UTM Builder Area */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-50">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <CardTitle className="text-[18px] font-semibold tracking-tight text-slate-900">UTM Builder Tool</CardTitle>
                                    <CardDescription className="text-[13px] font-medium text-slate-500">Generate standardized tracking URLs for your marketing campaigns.</CardDescription>
                                </div>
                                <div className="bg-cyan-50 text-cyan-600 p-2.5 rounded-xl">
                                    <LayoutTemplate size={20} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Base Website URL</label>
                                    <Input
                                        value={utmBuilder.url}
                                        onChange={(e) => setUtmBuilder({ ...utmBuilder, url: e.target.value })}
                                        className="h-11 rounded-xl border-slate-100 text-[13px] font-semibold"
                                        placeholder="https://yoursite.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Campaign Source</label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={utmBuilder.source}
                                            onChange={(e) => setUtmBuilder({ ...utmBuilder, source: e.target.value })}
                                            className="h-11 rounded-xl border-slate-100 text-[13px] font-semibold"
                                            placeholder="e.g. google, linkedin"
                                        />
                                        <Button variant="outline" className="h-11 w-11 p-0 rounded-xl border-slate-100"><Zap size={14} className="text-amber-500" /></Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Campaign Medium</label>
                                    <Select
                                        value={utmBuilder.medium}
                                        onValueChange={(v) => setUtmBuilder({ ...utmBuilder, medium: v })}
                                    >
                                        <SelectTrigger className="h-11 rounded-xl border-slate-100 font-semibold text-[13px]">
                                            <SelectValue placeholder="Select Medium" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="cpc">Paid Ads (CPC)</SelectItem>
                                            <SelectItem value="email">Email Blast</SelectItem>
                                            <SelectItem value="social">Organic Social</SelectItem>
                                            <SelectItem value="referral">Direct Referral</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Campaign Name</label>
                                    <Input
                                        value={utmBuilder.campaign}
                                        onChange={(e) => setUtmBuilder({ ...utmBuilder, campaign: e.target.value })}
                                        className="h-11 rounded-xl border-slate-100 text-[13px] font-semibold"
                                        placeholder="e.g. summer_promo_2026"
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                                <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-1 px-1">
                                    <span>Generated Tracking URL</span>
                                    <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Standardized</span>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 text-[13px] font-mono text-indigo-600 break-all leading-relaxed h-[64px] overflow-hidden shadow-sm">
                                        {generatedLink}
                                    </div>
                                    <Button
                                        onClick={handleCopy}
                                        className="h-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 rounded-xl border-none shadow-lg shadow-indigo-600/20"
                                    >
                                        <Copy size={18} />
                                    </Button>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">Use this link in your ads, emails, or social posts. The platform will automatically capture these values on lead creation.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-4">
                            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-fit">
                                <Database size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Custom Parameter Capture</h4>
                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                Define your own custom URL parameters to track unique data points like <span className="font-mono text-indigo-500 text-[11px]">click_id</span> or <span className="font-mono text-indigo-500 text-[11px]">partner_ref</span>.
                            </p>
                            <Button variant="ghost" className="h-9 px-0 text-indigo-600 font-semibold text-[11px] uppercase tracking-widest hover:bg-transparent inline-flex items-center gap-2 group">
                                Define Custom Params <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Card>

                        <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-4">
                            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 w-fit">
                                <Zap size={24} />
                            </div>
                            <h4 className="text-[16px] font-semibold text-slate-900">Intelligent Mapping</h4>
                            <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                                UTMs are automatically mapped to Lead Source, Channel, and Campaign entities using your standardization rules.
                            </p>
                            <Button variant="ghost" className="h-9 px-0 text-emerald-600 font-semibold text-[11px] uppercase tracking-widest hover:bg-transparent inline-flex items-center gap-2 group">
                                View Logic Rules <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Tracking Inventory Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[15px] font-semibold text-slate-900">Tracked Fields</h4>
                            <Badge className="bg-slate-50 text-slate-400 border-none font-semibold text-[10px] h-5 px-2 uppercase tracking-wider">Core Library</Badge>
                        </div>

                        <div className="space-y-2">
                            {UTM_PARAMETERS.map((param) => (
                                <div key={param.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:ring-1 hover:ring-indigo-100 group">
                                    <div className="flex justify-between items-start mb-1">
                                        <code className="text-[12px] font-semibold text-indigo-600 tracking-tight group-hover:text-indigo-700">{param.key}</code>
                                        <span className="text-[9px] font-semibold tracking-wider text-slate-300 uppercase leading-none">Mapping</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-[11px] text-slate-500 font-medium leading-tight max-w-[150px]">{param.description}</p>
                                        <div className="text-right">
                                            <p className="text-[12px] font-semibold text-slate-900">{param.mapping}</p>
                                            <p className="text-[10px] font-semibold text-slate-400 tabular-nums">{param.captures.toLocaleString()} hits</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-rose-100 rounded-3xl bg-rose-50 border border-rose-100 p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-white text-rose-600 shadow-sm">
                                <AlertTriangle size={18} />
                            </div>
                            <h4 className="text-[14px] font-semibold tracking-tight text-rose-900">Unknown Parameters</h4>
                        </div>
                        <p className="text-[11px] text-rose-700 font-medium leading-relaxed">
                            Found 12 unrecognized URL parameters (e.g. <span className="font-mono text-rose-500 font-semibold bg-white px-1 py-0.5 rounded">rf_id</span>) in the last 24 hours.
                        </p>
                        <Button variant="outline" className="w-full h-9 bg-white border-transparent text-rose-700 font-semibold text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-100 shadow-sm border border-rose-200">
                            Review Bucket
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-indigo-50 text-indigo-900 p-6 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-500 transition-transform group-hover:scale-110">
                            <Terminal size={100} />
                        </div>
                        <h4 className="text-[15px] font-semibold relative z-10 tracking-tight">Server-Side Tracking</h4>
                        <p className="text-[12px] text-indigo-700 font-medium leading-relaxed relative z-10">
                            Implement First-Party tracking to bypass ad-blockers and privacy restrictions.
                        </p>
                        <Button className="w-full h-10 bg-white text-indigo-600 hover:bg-slate-50 font-semibold text-[11px] uppercase tracking-widest rounded-xl border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative z-10">
                            Setup JS Proxy
                        </Button>
                    </Card>
                </div>

            </div>

        </div>
    )
}
