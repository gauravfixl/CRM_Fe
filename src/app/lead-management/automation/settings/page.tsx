"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    Settings2,
    ChevronLeft,
    CheckCircle2,
    Save,
    Trash2,
    ShieldCheck,
    AlertCircle,
    Info,
    Zap,
    Scale,
    Activity,
    Lock,
    RefreshCw,
    Gauge,
    Database,
    Clock
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
import { Slider } from "@/shared/components/ui/slider"

export default function AutomationSettingsPage() {
    const { toast } = useToast()
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleSave = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast({
                title: "Engine Reconfigured",
                description: "Global automation governor has been updated.",
            })
        }, 1200)
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
                        className="-ml-2 h-7 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-indigo-900 text-white shadow-lg">
                                <Settings2 className="h-5 w-5" />
                            </div>
                            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                                Automation Governance Settings
                            </h1>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium max-w-xl">
                            Configure the global limits, safety protocols, and execution rules that govern your platform's automation engine.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 border-slate-100 bg-white shadow-sm text-slate-600 font-bold text-[12px] px-5">
                        <Lock className="h-4 w-4 mr-2 text-slate-400" /> Security Audit
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 shadow-indigo-100 shadow-lg border-none"
                    >
                        {isSaving ? "Syncing..." : <><Save className="h-4 w-4 mr-2" /> Commit Changes</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Global Execution Governor */}
                <div className="lg:col-span-8 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8 space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Throttling & Concurrency</h3>
                                <p className="text-[13px] text-slate-500 font-medium">Define how many automations can fire simultaneously to protect system resources.</p>
                            </div>
                            <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[9px] px-2 h-5 uppercase tracking-wider">Dynamic Scaling</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[12px] font-bold">
                                    <span className="text-slate-700">Max Concurrent Workflows</span>
                                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">500 Flows</span>
                                </div>
                                <Slider defaultValue={[50]} max={100} step={1} className="[&>span]:bg-indigo-600" />
                                <p className="text-[10px] text-slate-400 font-medium">Higher limits increase processing speed but may affect UI response time.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[12px] font-bold">
                                    <span className="text-slate-700">Execution Batch Size</span>
                                    <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">50 Items</span>
                                </div>
                                <Slider defaultValue={[20]} max={100} step={1} className="[&>span]:bg-indigo-600" />
                                <p className="text-[10px] text-slate-400 font-medium">Batch size for high-volume ingestion (Standard: 20-50).</p>
                            </div>
                        </div>

                        <div className="space-y-6 pt-6 border-t border-slate-50">
                            <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Retry & Error Handling</h4>
                            <div className="space-y-4">
                                {[
                                    { label: "Automatic Retry on Fail", desc: "Max 3 attempts over 1 hour.", active: true },
                                    { label: "Alert Admin on Fatal Error", desc: "Push notification for uncaught exceptions.", active: true },
                                    { label: "Silent Fail-safe", desc: "Complete stage movement even if actions fail.", active: false },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="space-y-0.5">
                                            <p className="text-[14px] font-bold text-slate-900">{s.label}</p>
                                            <p className="text-[11px] font-medium text-slate-400">{s.desc}</p>
                                        </div>
                                        <Switch checked={s.active} className="data-[state=checked]:bg-indigo-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white overflow-hidden p-8 space-y-6">
                        <div className="space-y-1">
                            <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Security & Permissions</h3>
                            <p className="text-[13px] text-slate-500 font-medium">Control who can create and activate automation workflows.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={18} className="text-emerald-500" />
                                        <p className="text-[13px] font-bold text-slate-900">Mandatory 4-Eye Approval</p>
                                    </div>
                                    <Switch />
                                </div>
                                <p className="text-[11px] text-slate-500 pl-7">Require another admin to approve any workflow that affects more than 1,000 leads.</p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 space-y-2">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase">Automation Owner</p>
                                    <Select defaultValue="admins">
                                        <SelectTrigger className="rounded-xl border-slate-100 font-bold text-[13px] h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admins">Admins Only</SelectItem>
                                            <SelectItem value="managers">Managers & Admins</SelectItem>
                                            <SelectItem value="all">Everyone</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase">Log Retention</p>
                                    <Select defaultValue="90">
                                        <SelectTrigger className="rounded-xl border-slate-100 font-bold text-[13px] h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30">30 Days</SelectItem>
                                            <SelectItem value="90">90 Days</SelectItem>
                                            <SelectItem value="365">1 Year (Compliance)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Engine Health Sidebars */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-slate-900 text-white p-6 space-y-6 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform">
                            <Gauge size={180} />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Global Engine Health</p>
                                <Activity size={16} className="text-emerald-500" />
                            </div>
                            <h3 className="text-[32px] font-black tracking-tighter">Healthy</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase">
                                    <span>Workload</span>
                                    <span>24%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: '24%' }} />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/5 space-y-3 relative z-10">
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <RefreshCw size={12} /> Last system heartbeat: 2s ago
                            </div>
                            <Button className="w-full h-9 bg-white text-slate-900 hover:bg-slate-100 font-bold text-[11px] rounded-xl border-none">
                                Run Diagnostics
                            </Button>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm ring-1 ring-slate-100 rounded-3xl bg-white p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                                <Scale size={20} />
                            </div>
                            <h4 className="text-[15px] font-bold">Conflict Resolution</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Define how the system behaves when two workflows trigger for the same lead at the exact same millisecond.
                        </p>
                        <Select defaultValue="priority">
                            <SelectTrigger className="rounded-xl border-slate-100 font-bold text-[12px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="priority">Rule Priority First</SelectItem>
                                <SelectItem value="sequential">Sequential Queue</SelectItem>
                                <SelectItem value="simultaneous">Simultaneous Fire</SelectItem>
                            </SelectContent>
                        </Select>
                    </Card>

                    <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                            <Info size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[13px] font-bold text-indigo-900">Optimization Tip</p>
                            <p className="text-[11px] text-indigo-700 font-medium leading-relaxed italic">
                                "Increasing batch size from 20 to 50 could improve ingestion speed by 30% for high-volume campaigns."
                            </p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )
}
