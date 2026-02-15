"use client"

import React from "react"
import { Share2, Plus, ExternalLink, ShieldCheck, Zap, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const INTEGRATIONS = [
    { title: 'Slack Connect', desc: 'Sync task updates and mentions to your Slack channels.', status: 'Connected', icon: '💬' },
    { title: 'Google Calendar', desc: 'Auto-sync project deadlines to your organizational calendar.', status: 'Connected', icon: '📆' },
    { title: 'GitHub Actions', desc: 'Trigger workflow transitions based on PR merges and commits.', status: 'Inactive', icon: '🐙' },
    { title: 'Stripe Billing', desc: 'Manage project-based billing and enterprise invoices.', status: 'Inactive', icon: '💳' },
]

export default function IntegrationsSettingsPage() {
    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">External Nodes</h3>
                    <p className="text-slate-500 font-medium text-[13px]">Synchronize your workspace with the global software ecosystem.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 px-6 border border-slate-200 rounded-xl font-bold text-[12px] text-slate-600">
                        Developer API
                    </Button>
                    <Button className="h-10 px-8 bg-slate-900 text-white rounded-xl font-bold text-[12px] gap-2 shadow-lg shadow-slate-100">
                        <Plus size={16} />
                        Marketplace
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {INTEGRATIONS.map((app, i) => (
                    <Card key={i} className="group border-none shadow-sm bg-white rounded-[40px] overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="h-16 w-16 bg-slate-50 border-2 border-slate-100 rounded-[24px] flex items-center justify-center text-3xl group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all duration-500">
                                    {app.icon}
                                </div>
                                <Badge className={app.status === 'Connected' ? 'bg-indigo-50 text-indigo-600 border-none font-bold text-[9px] px-3 h-6' : 'bg-slate-50 text-slate-400 border-none font-bold text-[9px] px-3 h-6'}>
                                    {app.status}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-none">{app.title}</h4>
                                <p className="text-[12px] font-medium text-slate-500 leading-relaxed">{app.desc}</p>
                            </div>
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <button className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1.5">
                                    Configure Connection <ExternalLink size={14} />
                                </button>
                                <div className="flex items-center gap-1 text-emerald-500 font-bold text-[9px]">
                                    <Activity size={12} />
                                    Syncing
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* API Banner */}
            <div className="bg-indigo-600 rounded-[60px] p-12 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-full w-1/3 bg-white/5 skew-x-12 translate-x-32" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-4">
                        <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center text-white backdrop-blur-xl">
                            <Zap size={24} className="fill-white" />
                        </div>
                        <h2 className="text-3xl font-bold leading-tight">
                            Universal Sync <br /> Architecture
                        </h2>
                        <p className="text-indigo-100 text-[14px] font-medium leading-relaxed max-w-md">
                            Connect your existing infrastructure and automate cross-platform state transitions with 99.9% reliability.
                        </p>
                    </div>
                    <div className="text-center md:text-right space-y-4">
                        <p className="text-[12px] font-bold text-indigo-200">Secure API access</p>
                        <Button className="h-11 px-8 bg-white text-indigo-600 hover:bg-slate-50 rounded-xl font-bold text-[13px] shadow-2xl shadow-indigo-900/40">
                            Request Key
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
