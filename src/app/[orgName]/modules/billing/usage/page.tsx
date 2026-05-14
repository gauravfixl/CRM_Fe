"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    Users,
    HardDrive,
    Zap,
    BarChart3,
    TrendingUp,
    AlertTriangle,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Progress } from "@/shared/components/ui/progress"
import axiosInstance from "@/lib/axios"

const defaultUsageData = [
    { title: "Active Users", used: 42, limit: 100, unit: "", icon: Users, color: "text-primary", bg: "bg-primary/10", progressColor: "bg-primary" },
    { title: "Cloud Storage", used: 156, limit: 500, unit: "GB", icon: HardDrive, color: "text-indigo-600", bg: "bg-indigo-50", progressColor: "bg-indigo-500" },
    { title: "API Calls / Month", used: 850000, limit: 1000000, unit: "", icon: Zap, color: "text-amber-600", bg: "bg-amber-50", progressColor: "bg-amber-500" },
    { title: "Workspaces", used: 8, limit: 25, unit: "", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50", progressColor: "bg-emerald-500" },
]

function formatNumber(n: number): string {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k`
    return String(n)
}

export default function UsageLimitsPage() {
    const router = useRouter()
    const params = useParams() as { orgName?: string }
    const orgName = params.orgName || ""

    const [usageData, setUsageData] = useState(defaultUsageData)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosInstance
            .get("/OrgBilling/current-plan")
            .then((res: any) => {
                const limits = res.data?.currentPlan?.planSnapshot?.limits
                if (limits) {
                    setUsageData((prev) =>
                        prev.map((item) => {
                            if (item.title === "Active Users" && limits.maxUsers != null) {
                                return { ...item, limit: limits.maxUsers }
                            }
                            if (item.title === "Workspaces" && limits.maxProjects != null) {
                                return { ...item, limit: limits.maxProjects }
                            }
                            if (item.title === "Cloud Storage" && limits.maxStorageGB != null) {
                                return { ...item, limit: limits.maxStorageGB }
                            }
                            return item
                        })
                    )
                }
            })
            .catch(() => {
                // Keep default mock data as fallback
            })
            .finally(() => setLoading(false))
    }, [])

    const overallUsage = Math.round(
        usageData.reduce((sum, d) => sum + (d.used / d.limit) * 100, 0) / usageData.length
    )

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                            Usage & Limits
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Track resource consumption and quota utilization across your organization.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 gap-2 rounded-none text-xs font-medium"
                        onClick={() => router.push(`/${orgName}/modules/billing/upgrade`)}
                    >
                        <TrendingUp className="w-3.5 h-3.5" />
                        Request Upgrade
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        type="button"
                        onClick={() => router.push(`/${orgName}/usage-analytics`)}
                        className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white text-left cursor-pointer transition-all hover:shadow-2xl"
                    >
                        <p className="text-white text-xs opacity-80">Overall Usage</p>
                        <p className="text-white text-xl font-semibold mt-1">{overallUsage}%</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Average across all resources</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push(`/${orgName}/modules/users`)}
                        className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left cursor-pointer transition-all hover:shadow-xl"
                    >
                        <p className="text-zinc-500 text-xs">Active Users</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{usageData[0].used} / {usageData[0].limit}</p>
                        <p className="text-primary text-[10px] mt-1">{Math.round((usageData[0].used / usageData[0].limit) * 100)}% utilized</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push(`/${orgName}/modules/data/backup`)}
                        className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left cursor-pointer transition-all hover:shadow-xl"
                    >
                        <p className="text-zinc-500 text-xs">Storage Used</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{usageData[1].used} / {usageData[1].limit} GB</p>
                        <p className="text-indigo-600 text-[10px] mt-1">{Math.round((usageData[1].used / usageData[1].limit) * 100)}% utilized</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push(`/${orgName}/api-usage`)}
                        className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left cursor-pointer transition-all hover:shadow-xl"
                    >
                        <p className="text-zinc-500 text-xs">API Calls</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{formatNumber(usageData[2].used)} / {formatNumber(usageData[2].limit)}</p>
                        <p className="text-amber-600 text-[10px] mt-1">{Math.round((usageData[2].used / usageData[2].limit) * 100)}% {Math.round((usageData[2].used / usageData[2].limit) * 100) >= 80 ? "— Near limit" : "utilized"}</p>
                    </button>
                </div>

                {/* Detailed Usage Bars */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
                        <h3 className="text-sm font-semibold text-zinc-900">Resource Breakdown</h3>
                    </div>
                    <div className="p-6 space-y-8">
                        {usageData.map((item, idx) => {
                            const percentage = Math.round((item.used / item.limit) * 100)
                            const isNearLimit = percentage >= 80
                            return (
                                <div key={idx} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`${item.bg} ${item.color} p-2.5 rounded-none border border-current/10`}>
                                                <item.icon size={18} />
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium text-zinc-900">{item.title}</span>
                                                {isNearLimit && (
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <AlertTriangle size={10} className="text-amber-500" />
                                                        <span className="text-[10px] text-amber-600 font-medium">Approaching limit</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-900">
                                            {formatNumber(item.used)}{item.unit} <span className="text-zinc-400 font-normal">/ {formatNumber(item.limit)}{item.unit}</span>
                                        </span>
                                    </div>
                                    <Progress
                                        value={percentage}
                                        className="h-[6px] rounded-none bg-zinc-100"
                                    />
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className={isNearLimit ? "text-amber-600 font-medium" : "text-zinc-400 font-medium"}>
                                            {isNearLimit ? "Near Limit" : "Healthy"}
                                        </span>
                                        <span className="font-semibold text-zinc-900">{percentage}%</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
