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
import { CustomButton } from "@/shared/components/custom/CustomButton"
import { toast } from "sonner"
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
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-8 overflow-y-auto font-sans">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Org Health & Usage</h1>
                    <p className="text-sm text-slate-500 mt-1">Real-time status of your organization's infrastructure and resources.</p>
                </div>
                <CustomButton variant="outline" className="h-10 px-4 gap-2 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold shadow-sm hover:translate-y-[-1px] transition-all" onClick={() => toast.promise(new Promise(res => setTimeout(res, 1500)), { loading: "Refreshing system status...", success: "All systems operational", error: "Failed to refresh" })}>
                    <RefreshCw className="w-4 h-4" />
                    Refresh Status
                </CustomButton>
            </div>

            {/* KEY METRICS GRID */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white text-xs opacity-80">System Uptime</p>
                                <p className="text-white text-xl font-semibold mt-1">99.99%</p>
                                <p className="text-white text-[10px] mt-1">Last 30 days performance</p>
                            </div>
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">API Traffic</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">1.2M</p>
                                <p className="text-gray-600 text-[10px] mt-1">Requests per hour (Avg)</p>
                            </div>
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Data Usage</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">74%</p>
                                <Progress value={74} className="h-1.5 mt-2 bg-slate-100" />
                            </div>
                            <Database className="w-5 h-5 text-primary" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-xs">Security Score</p>
                                <p className="text-xl font-semibold text-gray-900 mt-1">A+</p>
                                <p className="text-green-600 text-[10px] mt-1">All modules compliant</p>
                            </div>
                            <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
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
