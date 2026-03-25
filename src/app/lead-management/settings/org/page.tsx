"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
    Building2, Globe, Clock, Save, Upload, CheckCircle2,
    Layout, Zap, Users, DollarSign, Bell, Shield,
    ChevronLeft, Palette, Globe2, Moon, Sun,
    Smartphone, Monitor, Briefcase, Mail, ShieldCheck,
    ArrowUpRight
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Progress } from "@/shared/components/ui/progress"

const STATS = [
    { label: "Active Users", value: "24", sub: "2 seats free", icon: Users, bg: "bg-indigo-50/10", text: "text-indigo-600", border: "border-indigo-100/20" },
    { label: "Regional Hub", value: "IST +5:30", sub: "Mumbai Corridor", icon: Globe2, bg: "bg-blue-50/10", text: "text-blue-600", border: "border-blue-100/20" },
    { label: "Base Currency", value: "USD ($)", sub: "Global clearing", icon: DollarSign, bg: "bg-emerald-50/10", text: "text-emerald-600", border: "border-emerald-100/20" },
    { label: "Security Level", value: "Enterprise", sub: "2FA Enforced", icon: ShieldCheck, bg: "bg-amber-50/10", text: "text-amber-600", border: "border-amber-100/20" },
]

export default function OrganizationPreferencesPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [quietHours, setQuietHours] = useState(false)
    const [brandColor, setBrandColor] = useState("#4F46E5")
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [form, setForm] = useState({
        companyName: "Fixl Solutions",
        website: "https://fixl.solutions",
        currency: "USD",
        language: "en",
        timezone: "ist",
        dateFormat: "mmm-dd",
        defaultOwner: "david",
        startTime: "09:00 AM",
        endTime: "06:00 PM",
        defaultView: "exec",
    })

    useEffect(() => { setIsClient(true) }, [])

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => setLogoPreview(ev.target?.result as string)
        reader.readAsDataURL(file)
        toast({ title: "Branding Updated", description: "Your custom logo has been cached for deployment." })
    }

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast({ title: "✅ Configuration Published", description: "Global organization preferences are now active." })
        }, 1200)
    }

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => setBrandColor(e.target.value)

    const handleSystemAudit = () => {
        toast({ title: "System Audit Initiated", description: "Analyzing global propagation status and certificate validity..." })
    }

    const handleViewGuidelines = () => {
        toast({ title: "Brand Guidelines", description: "Loading corporate design system and legal usage PDFs..." })
    }

    if (!isClient) return null

    return (
        <div className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-[5px] border-l-slate-900">
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="-ml-2 h-7 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-100 text-slate-900 border border-slate-200 shadow-sm">
                                <Building2 size={22} />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Organization & Identity
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Configure your corporate identity, regional standards, and global platform defaults. These settings propagate to all sub-modules.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleSystemAudit} className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-bold text-[11px] px-5 uppercase tracking-widest">
                        <Monitor className="h-4 w-4 mr-2 text-slate-400" /> System Audit
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 shadow-slate-200 shadow-lg border-none uppercase text-[11px] tracking-widest">
                        {isSaving ? "Syncing..." : <><Save className="h-4 w-4 mr-2" /> Publish Changes</>}
                    </Button>
                </div>
            </div>

            {/* Tactical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {STATS.map((s, i) => (
                    <Card key={i} className={`border ${s.border} ${s.bg} rounded-3xl p-5 shadow-none space-y-3 transition-all hover:scale-[1.02] cursor-default`}>
                        <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center ${s.text} shadow-sm border border-slate-100/50`}>
                            <s.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className={`text-[20px] font-semibold ${s.text}`}>{s.value}</h4>
                            <p className="text-[11px] text-slate-500 font-normal">{s.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Platform Visuals */}
                <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-white overflow-hidden p-8">
                    <div className="flex justify-between items-start mb-10 px-2">
                        <div className="space-y-1">
                            <h3 className="text-[17px] font-semibold text-slate-900">Platform Visuals & Themes</h3>
                            <p className="text-[12px] text-slate-500 font-medium">Control the visual aesthetic of your internal CRM and client portals.</p>
                        </div>
                    </div>

                    <div className="flex flex-col xl:flex-row items-start gap-12 px-2">
                        <div className="space-y-4 w-full xl:w-fit shrink-0">
                            <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Mark / Logo</Label>
                            <div onClick={() => fileInputRef.current?.click()}
                                className="h-40 w-64 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-slate-100/50 transition-all group overflow-hidden relative shadow-inner">
                                {logoPreview
                                    ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-6" />
                                    : <>
                                        <div className="p-4 rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                            <Upload size={24} className="text-slate-300 group-hover:text-indigo-500" />
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Resource</span>
                                    </>}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium italic">
                                <Shield size={12} /> SSL Encrypted asset hosting
                            </div>
                        </div>

                        <div className="flex-1 space-y-8 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand Primary Accent</Label>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-12 w-16 shrink-0 group">
                                            <input type="color" value={brandColor} onChange={handleColorChange}
                                                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-10" />
                                            <div className="h-full w-full rounded-2xl border border-slate-100 shadow-sm" style={{ backgroundColor: brandColor }} />
                                        </div>
                                        <Input value={brandColor.toUpperCase()} onChange={(e) => setBrandColor(e.target.value)}
                                            className="h-12 font-mono text-[14px] font-bold border-slate-100 bg-slate-50 rounded-2xl px-5 flex-1" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Interface Rendering</Label>
                                    <div className="flex items-center justify-between h-12 px-5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <Moon size={16} className="text-slate-400" />
                                            <span className="text-[13px] font-bold text-slate-600">Adaptive Dark Env</span>
                                        </div>
                                        <Switch checked={darkMode} onCheckedChange={setDarkMode} className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-indigo-50/30 border border-indigo-100 flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                                    <Palette size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[13px] font-black text-indigo-900 uppercase tracking-tight">AI Theme Advisor</h4>
                                    <p className="text-[12px] text-indigo-700/70 font-medium leading-relaxed italic">
                                        "Detected a high-contrast palette. We suggest using a semibold font-weight for better readability on tablet devices."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Right Sidebar - System Defaults */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-[32px] bg-slate-950 text-white p-8 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Zap size={140} className="text-indigo-400" />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h4 className="text-[16px] font-black uppercase tracking-tight text-white flex items-center gap-2">
                                <Zap className="h-5 w-5 text-amber-400" /> Branding Intelligence
                            </h4>
                            <p className="text-[12px] text-slate-400 leading-relaxed font-medium">
                                A consistent brand identity across your platform improves customer trust signals by up to <strong className="text-white">34%</strong>.
                            </p>
                        </div>
                        <div className="space-y-3 relative z-10">
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
                                <span>Health Check</span>
                                <span className="text-emerald-400">98% OPTIMIZED</span>
                            </div>
                            <Progress value={98} className="h-1.5 bg-white/5" />
                        </div>
                        <Button onClick={handleViewGuidelines} className="w-full h-12 bg-white text-slate-950 hover:bg-slate-100 font-black rounded-xl border-none uppercase text-[11px] tracking-widest mt-2 shadow-xl shadow-slate-900/40 relative z-10">
                            View Brand Guidelines <ArrowUpRight size={14} className="ml-2" />
                        </Button>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-8 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-[15px] font-black text-slate-900 uppercase tracking-tight">System Defaults</h3>
                            <p className="text-[12px] text-slate-500 font-medium whitespace-nowrap">Standard fallback patterns.</p>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Lead Owner</Label>
                                <Select value={form.defaultOwner} onValueChange={(v) => setForm({ ...form, defaultOwner: v })}>
                                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold text-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        <SelectItem value="david">David Brown (Admin)</SelectItem>
                                        <SelectItem value="emily">Emily Davis (Sr. Rep)</SelectItem>
                                        <SelectItem value="round-robin">🔄 Round Robin (Auto)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-indigo-500" />
                                        <span className="text-[12px] font-black text-slate-700 uppercase tracking-tight">Global Quiet Hours</span>
                                    </div>
                                    <Switch checked={quietHours} onCheckedChange={setQuietHours} className="data-[state=checked]:bg-indigo-600" />
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">"Suppress outbound notifications during non-working hours to ensure employee wellbeing."</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Regional & Foundations */}
                <Card className="lg:col-span-12 border-none shadow-sm ring-1 ring-slate-100 rounded-[40px] bg-white overflow-hidden p-10">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-semibold text-slate-900">Corporate Foundations</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Standardize how your organization appears in the system ledger.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Legal Company Name</Label>
                                    <Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                                        className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Website URL</Label>
                                    <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                                        className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold px-5" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Clearing Currency</Label>
                                    <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                                        <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            <SelectItem value="USD">USD ($) — American Dollar</SelectItem>
                                            <SelectItem value="EUR">EUR (€) — Euro Economy</SelectItem>
                                            <SelectItem value="INR">INR (₹) — Indian Rupee</SelectItem>
                                            <SelectItem value="GBP">GBP (£) — British Pound</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Display Language</Label>
                                    <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                                        <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            <SelectItem value="en">English (Legacy)</SelectItem>
                                            <SelectItem value="hi">Hindi (Global)</SelectItem>
                                            <SelectItem value="es">Spanish (Unified)</SelectItem>
                                            <SelectItem value="fr">French (Native)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-semibold text-slate-900">Regional Synchrony</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Ensure all timestamps and fiscal periods align with your local laws.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">HQ Timezone</Label>
                                    <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
                                        <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            <SelectItem value="ist">(GMT+5:30) Mumbai, India</SelectItem>
                                            <SelectItem value="pst">(GMT-8:00) Pacific Coast</SelectItem>
                                            <SelectItem value="utc">(GMT+0:00) Universal Clock</SelectItem>
                                            <SelectItem value="est">(GMT-5:00) Eastern Seaboard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Reporting Date Format</Label>
                                    <Select value={form.dateFormat} onValueChange={(v) => setForm({ ...form, dateFormat: v })}>
                                        <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            <SelectItem value="mmm-dd">Jan 20, 2026 (Alpha)</SelectItem>
                                            <SelectItem value="dd-mm">20/01/2026 (Metric)</SelectItem>
                                            <SelectItem value="mm-dd">01/20/2026 (Imperial)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex items-center justify-between h-14 px-6 rounded-2xl bg-slate-50 border border-slate-100 mt-2 hover:bg-white hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-5 w-5 text-indigo-500" />
                                            <span className="text-[14px] font-bold text-slate-700">Auto-Detect Visitor Locale</span>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

            </div>
        </div>
    )
}
