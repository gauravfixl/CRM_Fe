"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    ChevronLeft,
    Bell,
    CheckCircle2,
    Trophy,
    Target,
    Activity,
    Lock,
    Unlock,
    Save,
    ArrowRight,
    Users,
    Mail,
} from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useToast } from "@/shared/components/ui/use-toast"
import { Switch } from "@/shared/components/ui/switch"
import { Input } from "@/shared/components/ui/input"
import { Slider } from "@/shared/components/ui/slider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"

type NotifyForm = {
    email: string
    onMql: boolean
    onSql: boolean
    digest: string
}

type AuthRule = {
    role: string
    canReverse: boolean
    requiresApproval: boolean
}

export default function ScoreThresholdsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [mqlThreshold, setMqlThreshold] = useState([40])
    const [sqlThreshold, setSqlThreshold] = useState([75])
    const [isSaving, setIsSaving] = useState(false)
    const [mqlTriggers, setMqlTriggers] = useState(true)
    const [sqlTriggers, setSqlTriggers] = useState(true)

    const [isNotifyOpen, setIsNotifyOpen] = useState(false)
    const [notifyForm, setNotifyForm] = useState<NotifyForm>({ email: "", onMql: true, onSql: true, digest: "Daily" })
    const [notifyErrors, setNotifyErrors] = useState<{ email?: string; digest?: string }>({})

    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const authRules: AuthRule[] = [
        { role: "Sales Manager", canReverse: true, requiresApproval: false },
        { role: "BDR Lead", canReverse: false, requiresApproval: true },
        { role: "Account Executive", canReverse: false, requiresApproval: true },
    ]

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleSave = () => {
        if (mqlThreshold[0] >= sqlThreshold[0]) {
            toast({
                title: "Invalid Thresholds",
                description: "MQL threshold must be lower than SQL threshold.",
                variant: "destructive"
            })
            return
        }
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast({
                title: "Thresholds Synced",
                description: "MQL/SQL automation rules updated platform-wide.",
            })
        }, 1200)
    }

    const validateNotify = (): boolean => {
        const e: { email?: string; digest?: string } = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!notifyForm.email.trim()) e.email = "Email is required"
        else if (!emailRegex.test(notifyForm.email.trim())) e.email = "Enter a valid email address"
        if (!notifyForm.digest) e.digest = "Digest frequency is required"
        setNotifyErrors(e)
        return Object.keys(e).length === 0
    }

    const saveNotify = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!validateNotify()) return
        setIsNotifyOpen(false)
        toast({ title: "Notifications Configured", description: `Alerts will go to ${notifyForm.email}.` })
    }

    if (!isClient) return null

    return (
        <div style={{ zoom: 0.9 }} className="space-y-6 pb-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">

            {/* Structural Header — colorful light fill */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-amber-50 p-6 border border-amber-100 shadow-sm">
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
                            <div className="p-2 rounded-lg bg-white text-amber-600 border border-amber-100 shadow-sm">
                                <Trophy className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">
                                Score Thresholds & Governance
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium max-w-xl">
                            Establish the gatekeeping logic for Lifecycle stages. Define when a lead is passed from Marketing to Sales.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsNotifyOpen(true)}
                        className="h-10 border-slate-200 bg-white shadow-sm text-slate-600 font-semibold text-[12px] px-5"
                    >
                        <Bell className="h-4 w-4 mr-2 text-slate-400" /> Notify Settings
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-indigo-100 shadow-lg border-none transition-all active:scale-95"
                    >
                        {isSaving ? "Updating Lifecycle..." : <><Save className="h-4 w-4 mr-2" /> Commit Rules</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Threshold Configuration */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-none bg-white overflow-hidden p-8 space-y-12">

                        {/* MQL Section */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[18px] font-semibold text-slate-900">Marketing Qualified Lead (MQL)</h3>
                                        <Badge className="bg-indigo-50 text-indigo-600 border-none px-2 h-5 text-[9px] font-semibold uppercase">Phase 1 Gate</Badge>
                                    </div>
                                    <p className="text-[12px] text-slate-400 font-medium">Automatic hand-off to Nurturing or BDR team.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider leading-none">Min Score Requirement</span>
                                    <h4 className="text-[32px] font-semibold text-indigo-600 tracking-tighter leading-none mt-2">{mqlThreshold[0]}</h4>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <Slider
                                    value={mqlThreshold}
                                    onValueChange={setMqlThreshold}
                                    max={100}
                                    step={5}
                                    className="[&_[role=slider]]:bg-indigo-600 [&_[role=slider]]:border-indigo-600"
                                />
                                <div className="flex justify-between text-[11px] font-semibold text-slate-300 px-1">
                                    <span>Cold (0)</span>
                                    <span>Neutral (50)</span>
                                    <span>Qualified (100)</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-slate-50 w-full" />

                        {/* SQL Section */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[18px] font-semibold text-slate-900">Sales Qualified Lead (SQL)</h3>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 h-5 text-[9px] font-semibold uppercase">Final Conversion Gate</Badge>
                                    </div>
                                    <p className="text-[12px] text-slate-400 font-medium">Automatic assignment to Account Executive & CRM entry.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-semibold text-slate-400 tracking-wider leading-none">Min Score Requirement</span>
                                    <h4 className="text-[32px] font-semibold text-emerald-500 tracking-tighter leading-none mt-2">{sqlThreshold[0]}</h4>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <Slider
                                    value={sqlThreshold}
                                    onValueChange={setSqlThreshold}
                                    max={100}
                                    step={5}
                                    className="[&_[role=slider]]:bg-emerald-500 [&_[role=slider]]:border-emerald-500 shadow-xl shadow-emerald-50"
                                />
                                <div className="flex justify-between text-[11px] font-semibold text-slate-300 px-1">
                                    <span>Cold (0)</span>
                                    <span>Neutral (50)</span>
                                    <span>Qualified (100)</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Automation Logic visualization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none bg-indigo-50 p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between text-[14px] font-semibold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <Unlock size={14} className="text-indigo-600" /> MQL Triggers
                                </div>
                                <Switch
                                    checked={mqlTriggers}
                                    onCheckedChange={setMqlTriggers}
                                    className="data-[state=checked]:bg-indigo-600"
                                />
                            </div>
                            <div className={`space-y-2 ${!mqlTriggers ? 'opacity-50' : ''}`}>
                                {[
                                    "Move Stage to 'Nurturing'",
                                    "Auto-Assign to BDR Hub",
                                    "Enable 'Direct Email' Sequence"
                                ].map((action, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                                        <CheckCircle2 size={12} className="text-indigo-500" /> {action}
                                    </div>
                                ))}
                            </div>
                        </Card>
                        <Card className="border-none shadow-sm ring-1 ring-emerald-100 rounded-none bg-emerald-50 p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between text-[14px] font-semibold text-slate-700">
                                <div className="flex items-center gap-2">
                                    <Lock size={14} className="text-emerald-600" /> SQL Triggers
                                </div>
                                <Switch
                                    checked={sqlTriggers}
                                    onCheckedChange={setSqlTriggers}
                                    className="data-[state=checked]:bg-emerald-600"
                                />
                            </div>
                            <div className={`space-y-2 ${!sqlTriggers ? 'opacity-50' : ''}`}>
                                {[
                                    "Move Stage to 'Discovery'",
                                    "Notify Account Executive",
                                    "Sync to Salesforce/HubSpot"
                                ].map((action, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                                        <CheckCircle2 size={12} className="text-emerald-500" /> {action}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Analytics Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-blue-100 rounded-none bg-blue-50 overflow-hidden">
                        <CardHeader className="p-6 border-b border-blue-100">
                            <CardTitle className="text-[16px] font-semibold text-slate-900">Conversion Impact</CardTitle>
                            <CardDescription className="text-[11px] font-medium text-slate-600">How current thresholds affect your volume.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Expected MQLs</p>
                                    <h4 className="text-[20px] font-semibold text-slate-900 tracking-tight">{Math.max(0, Math.round(800 - mqlThreshold[0] * 14))} <span className="text-[11px] font-semibold text-slate-400">/ mo</span></h4>
                                </div>
                                <div className="p-3 bg-indigo-50 text-indigo-600">
                                    <Activity size={18} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Expected SQLs</p>
                                    <h4 className="text-[20px] font-semibold text-slate-900 tracking-tight">{Math.max(0, Math.round(180 - sqlThreshold[0] * 1.8))} <span className="text-[11px] font-semibold text-slate-400">/ mo</span></h4>
                                </div>
                                <div className="p-3 bg-emerald-50 text-emerald-600">
                                    <Users size={18} />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 space-y-3">
                                <p className="text-[11px] font-semibold text-slate-400 tracking-wider">AI Recommendation</p>
                                <div className="p-4 bg-amber-50 border border-amber-100 space-y-2">
                                    <p className="text-[12px] font-semibold text-amber-800 leading-tight">
                                        Lower MQL threshold to 35.
                                    </p>
                                    <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                                        Data shows leads around 35 score have 82% win rate in your current segment.
                                    </p>
                                    <Button
                                        size="sm"
                                        onClick={() => { setMqlThreshold([35]); toast({ title: "AI Recommendation Applied", description: "MQL threshold set to 35." }) }}
                                        className="h-8 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-semibold rounded-lg mt-2"
                                    >
                                        Apply Recommendation
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-indigo-100 rounded-none bg-indigo-50 text-slate-900 overflow-hidden relative">
                        <CardContent className="p-6 space-y-4">
                            <div className="h-10 w-10 bg-white border border-indigo-100 flex items-center justify-center">
                                <Target size={20} className="text-indigo-600" />
                            </div>
                            <h4 className="text-[16px] font-semibold tracking-tight">Lifecycle Governance</h4>
                            <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                                Once a lead hits a threshold, a "Governance Lock" prevents manual stage reversal unless authorized.
                            </p>
                            <Button
                                variant="ghost"
                                onClick={() => setIsAuthOpen(true)}
                                className="w-full text-indigo-600 font-semibold text-[11px] uppercase tracking-widest p-0 flex justify-start hover:bg-transparent"
                            >
                                View Authorization Rules <ArrowRight size={12} className="ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* Notify Settings Side-drawer */}
            <SideFormSheet
                open={isNotifyOpen}
                onOpenChange={(o) => { setIsNotifyOpen(o); if (!o) setNotifyErrors({}) }}
                title="Notification Preferences"
                description="Choose who gets alerted on threshold events."
                icon={<Bell size={18} />}
                onSubmit={saveNotify}
                submitLabel="Save Preferences"
                accentColor="#4f46e5"
            >
                <div className="space-y-5">
                    <Field label="Recipient Email" required error={notifyErrors.email}>
                        <Input
                            type="email"
                            value={notifyForm.email}
                            onChange={e => { setNotifyForm({ ...notifyForm, email: e.target.value }); if (notifyErrors.email) setNotifyErrors({ ...notifyErrors, email: undefined }) }}
                            placeholder="alerts@company.com"
                            className="h-11 rounded-lg"
                        />
                    </Field>
                    <Field label="Digest Frequency" required error={notifyErrors.digest}>
                        <Select value={notifyForm.digest} onValueChange={v => setNotifyForm({ ...notifyForm, digest: v })}>
                            <SelectTrigger className="h-11 rounded-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Realtime">Real-time</SelectItem>
                                <SelectItem value="Hourly">Hourly digest</SelectItem>
                                <SelectItem value="Daily">Daily digest</SelectItem>
                                <SelectItem value="Weekly">Weekly digest</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100">
                        <div className="space-y-0.5">
                            <p className="text-[13px] font-semibold text-slate-700">Notify on MQL events</p>
                            <p className="text-[11px] text-slate-500">When a lead crosses MQL threshold</p>
                        </div>
                        <Switch
                            checked={notifyForm.onMql}
                            onCheckedChange={(c) => setNotifyForm({ ...notifyForm, onMql: c })}
                            className="data-[state=checked]:bg-indigo-600"
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100">
                        <div className="space-y-0.5">
                            <p className="text-[13px] font-semibold text-slate-700">Notify on SQL events</p>
                            <p className="text-[11px] text-slate-500">When a lead crosses SQL threshold</p>
                        </div>
                        <Switch
                            checked={notifyForm.onSql}
                            onCheckedChange={(c) => setNotifyForm({ ...notifyForm, onSql: c })}
                            className="data-[state=checked]:bg-emerald-600"
                        />
                    </div>
                </div>
            </SideFormSheet>

            {/* Authorization Rules Side-drawer */}
            <SideFormSheet
                open={isAuthOpen}
                onOpenChange={setIsAuthOpen}
                title="Authorization Rules"
                description="Who can reverse a governance-locked stage."
                icon={<Lock size={18} />}
                hideFooter
                accentColor="#0f172a"
            >
                <div className="space-y-3">
                    {authRules.map((r, i) => (
                        <div key={i} className="p-4 bg-slate-50 border border-slate-100 space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-[13px] font-semibold text-slate-800">{r.role}</p>
                                {r.canReverse ? (
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none">Direct</Badge>
                                ) : (
                                    <Badge className="bg-amber-50 text-amber-600 border-none">Approval</Badge>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">
                                {r.canReverse
                                    ? "Can reverse stage without additional approval."
                                    : "Requires Sales Manager sign-off before reversal."}
                            </p>
                        </div>
                    ))}
                </div>
            </SideFormSheet>

        </div>
    )
}
