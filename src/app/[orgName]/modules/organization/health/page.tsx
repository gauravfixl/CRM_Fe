"use client"

import React from "react"
import {
    Activity,
    Zap,
    Database,
    Server,
    ShieldCheck,
    RefreshCw,
    AlertCircle,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard"
import { Badge } from "@/components/ui/badge"

export default function OrgHealthPage() {
    const systems = [
        { name: "Central API", status: "Operational", uptime: "99.98%", latency: "45ms" },
        { name: "Authentication Service", status: "Operational", uptime: "100%", latency: "12ms" },
        { name: "Database Cluster", status: "Operational", uptime: "99.95%", latency: "8ms" },
        { name: "File Storage (S3)", status: "Operational", uptime: "100%", latency: "120ms" },
        { name: "Email Relay", status: "Operational", uptime: "99.90%", latency: "250ms" },
    ]

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Org Health & Usage</h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time status of your organization's infrastructure and resources.</p>
                </div>
                <Button variant="outline" className="h-9 gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refresh Status
                </Button>
            </div>

            {/* KEY METRICS GRID */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="p-0 bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between p-3 pb-0">
                        <p className="text-[10px] text-white font-medium uppercase tracking-wider opacity-90">System Uptime</p>
                        <Zap className="w-3.5 h-3.5 text-white/90" />
                    </SmallCardHeader>
                    <SmallCardContent className="p-3 pt-1">
                        <p className="text-xl font-bold text-white drop-shadow-sm">99.99%</p>
                        <p className="text-[9px] text-blue-100/80 mt-0.5">Last 30 days performance</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="p-0 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between p-3 pb-0">
                        <p className="text-[10px] text-zinc-500 font-medium tracking-tight">API Traffic</p>
                        <Activity className="w-3.5 h-3.5 text-blue-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="p-3 pt-1">
                        <p className="text-xl font-bold text-zinc-900">1.2M</p>
                        <p className="text-[9px] text-zinc-400 mt-0.5">Requests per hour (Avg)</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="p-0 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between p-3 pb-0">
                        <p className="text-[10px] text-zinc-500 font-medium tracking-tight">Data Usage</p>
                        <Database className="w-3.5 h-3.5 text-emerald-500" />
                    </SmallCardHeader>
                    <SmallCardContent className="p-3 pt-1">
                        <div className="flex items-end justify-between">
                            <p className="text-xl font-bold text-zinc-900">74%</p>
                        </div>
                        <Progress value={74} className="h-1 mt-1.5" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="p-0 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between p-3 pb-0">
                        <p className="text-[10px] text-zinc-500 font-medium tracking-tight">Security Score</p>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    </SmallCardHeader>
                    <SmallCardContent className="p-3 pt-1">
                        <p className="text-xl font-bold text-zinc-900">A+</p>
                        <p className="text-[9px] text-zinc-400 mt-0.5">All modules compliant</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* System Status */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="bg-white border-b border-slate-100">
                        <CardTitle className="text-base font-semibold">Service Status</CardTitle>
                        <CardDescription className="text-xs">Live operational status of core microservices.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {systems.map((system, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-full ${system.status === "Operational" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{system.name}</p>
                                            <p className="text-[10px] text-slate-400">Uptime: {system.uptime}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] font-bold">
                                            {system.status}
                                        </Badge>
                                        <p className="text-[10px] text-slate-400 mt-1">Lat: {system.latency}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Resource Distribution */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold">Resource Distribution</CardTitle>
                        <CardDescription className="text-xs">Allocation of storage and compute across business units.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span>Fixl Solutions HQ</span>
                                <span className="text-blue-600">45%</span>
                            </div>
                            <Progress value={45} className="h-2 bg-slate-100" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span>Mumbai Branch</span>
                                <span className="text-emerald-600">30%</span>
                            </div>
                            <Progress value={30} className="h-2 bg-slate-100" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span>Dubai Office</span>
                                <span className="text-amber-600">15%</span>
                            </div>
                            <Progress value={15} className="h-2 bg-slate-100" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-semibold">
                                <span>Other Resources</span>
                                <span className="text-slate-400">10%</span>
                            </div>
                            <Progress value={10} className="h-2 bg-slate-100" />
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-blue-700">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <p className="text-xs font-medium">Storage usage is approaching 80% limit on HQ unit. Consider upgrading plan.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
