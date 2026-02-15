"use client"

import React, { useState } from "react"
import {
    Globe,
    Clock,
    Coins,
    Calendar,
    CheckCircle2,
    Save,
    RefreshCw,
    Info,
    Languages,
    MapPin,
    ArrowRight,
    LucideIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface LocaleOptionProps {
    label: string
    description: string
    icon: LucideIcon
    value: string
    options: { label: string; value: string }[]
    onChange: (val: string) => void
}

const LocaleOption = ({ label, description, icon: Icon, value, options, onChange }: LocaleOptionProps) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl shadow-sm gap-4 transition-all hover:border-blue-200">
        <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-blue-50 flex items-center justify-center rounded-xl text-blue-600 shrink-0">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h4 className="text-sm font-bold text-slate-900 leading-none">{label}</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">{description}</p>
            </div>
        </div>
        <div className="w-full md:w-64">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-slate-50/50 text-xs font-bold">
                    <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                    {options.map(opt => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs font-semibold py-2.5 rounded-lg cursor-pointer">
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    </div>
)

export default function LocalizationPage() {
    const [locale, setLocale] = useState({
        language: "en-US",
        timezone: "UTC-5",
        currency: "USD",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12h"
    })

    const handleSave = () => {
        toast.success("Localization settings updated successfully!", {
            description: "Changes will reflect across all user interfaces in the next session."
        })
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Regional & Localization</h1>
                    <p className="text-sm text-slate-500 mt-1">Configure default regional settings for all Business Units in the organization.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold" onClick={() => toast.info("Resetting to system defaults...")}>
                        <RefreshCw className="w-4 h-4" />
                        Reset Defaults
                    </Button>
                    <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-black uppercase text-[10px] tracking-widest shadow-sm px-6" onClick={handleSave}>
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* SUMMARY INFO */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-3 shadow-sm">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-blue-700 leading-relaxed">
                    Regional settings defined here will serve as the <span className="font-bold">Global Baseline</span>.
                    Individual firms can override these settings in their respective "Business Unit Settings" if required by local jurisdiction.
                </p>
            </div>

            {/* OPTIONS GRID */}
            <div className="flex flex-col gap-4">
                <LocaleOption
                    label="System Language"
                    description="The default language for the user interface and system notifications."
                    icon={Languages}
                    value={locale.language}
                    onChange={(v) => setLocale(p => ({ ...p, language: v }))}
                    options={[
                        { label: "English (United States)", value: "en-US" },
                        { label: "English (United Kingdom)", value: "en-GB" },
                        { label: "Hindi (India)", value: "hi-IN" },
                        { label: "Spanish (Spain)", value: "es-ES" },
                        { label: "French (France)", value: "fr-FR" },
                    ]}
                />

                <LocaleOption
                    label="Organization Timezone"
                    description="Default timezone for timestamps, audit logs, and scheduled tasks."
                    icon={Clock}
                    value={locale.timezone}
                    onChange={(v) => setLocale(p => ({ ...p, timezone: v }))}
                    options={[
                        { label: "(UTC-05:00) Eastern Time (US & Canada)", value: "UTC-5" },
                        { label: "(UTC+05:30) Chennai, Kolkata, Mumbai", value: "UTC+5.5" },
                        { label: "(UTC+00:00) London, Dublin, Lisbon", value: "UTC+0" },
                        { label: "(UTC+08:00) Singapore, Hong Kong", value: "UTC+8" },
                    ]}
                />

                <LocaleOption
                    label="Base Currency"
                    description="Primary currency for billing, accounting, and financial reporting."
                    icon={Coins}
                    value={locale.currency}
                    onChange={(v) => setLocale(p => ({ ...p, currency: v }))}
                    options={[
                        { label: "USD - United States Dollar ($)", value: "USD" },
                        { label: "INR - Indian Rupee (₹)", value: "INR" },
                        { label: "EUR - Euro (€)", value: "EUR" },
                        { label: "GBP - British Pound (£)", value: "GBP" },
                    ]}
                />

                <LocaleOption
                    label="Date Format"
                    description="How dates will be displayed across the platform and in exports."
                    icon={Calendar}
                    value={locale.dateFormat}
                    onChange={(v) => setLocale(p => ({ ...p, dateFormat: v }))}
                    options={[
                        { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
                        { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
                        { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
                    ]}
                />
            </div>

            {/* PREVIEW CARD */}
            <Card className="bg-slate-900 text-white border-none rounded-3xl p-8 relative overflow-hidden group shadow-2xl mt-4">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Globe className="w-40 h-40 text-white" />
                </div>
                <div className="relative z-10 space-y-6">
                    <div>
                        <Badge className="bg-blue-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-3 mb-4">Live Format Preview</Badge>
                        <h4 className="text-xl font-black tracking-tight">Everything in its right place.</h4>
                        <p className="text-sm text-slate-400 font-medium max-w-sm mt-1">Check how your regional settings will affect data representation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Financial Records</p>
                            <p className="text-2xl font-black text-white">{locale.currency === 'USD' ? '$' : locale.currency === 'INR' ? '₹' : '€'} 1,245.00</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date & Time</p>
                            <p className="text-lg font-bold text-white">Mar 24, 2024 • 14:30</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Location Context</p>
                            <p className="text-lg font-bold text-white flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                {locale.timezone.split(')')[1]?.trim() || 'Eastern Time'}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
