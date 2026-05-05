"use client"

import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import {
    TrendingUp,
    AlertCircle,
    ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Progress } from "@/shared/components/ui/progress"

// Mock Data for Revenue Overview
const revenueMetrics = [
    {
        title: "Annual Recurring (ARR)",
        value: "$4.62M",
        change: "+19.2%",
        trend: "up",
        subtitle: "Next 12 Month Projection"
    },
    {
        title: "Monthly Recurring (MRR)",
        value: "$385k",
        change: "+13.2%",
        trend: "up",
        subtitle: "Aug $1.37/Client"
    },
    {
        title: "Net Revenue Retention",
        value: "112%",
        change: "+2.8%",
        trend: "up",
        subtitle: "Over Last Quarter +NRR%"
    },
    {
        title: "Renewal Pipeline",
        value: "$1.24M",
        change: "Stable",
        trend: "stable",
        subtitle: "Next 90 Days"
    }
]

const performanceData = [
    { month: 'Jan', actual: 320, forecast: 310 },
    { month: 'Feb', actual: 340, forecast: 330 },
    { month: 'Mar', actual: 360, forecast: 350 },
    { month: 'Apr', actual: 380, forecast: 370 },
    { month: 'May', actual: 400, forecast: 390 },
    { month: 'Jun', actual: 420, forecast: 410 },
    { month: 'Jul', actual: 440, forecast: 430 },
    { month: 'Aug', actual: 460, forecast: 450 },
    { month: 'Sep', forecast: 480 },
    { month: 'Oct', forecast: 500 },
    { month: 'Nov', forecast: 520 },
    { month: 'Dec', forecast: 540 }
]

const pipelineData = [
    { title: "New opportunities", value: "$640k", progress: 75 },
    { title: "Expansion engine", value: "$312k", progress: 60 }
]

export default function RevenueOverviewPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-outfit text-sm">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6">
                <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                    Revenue <span className="text-indigo-600">Strategic Control Center</span>
                </h1>
                <p className="text-[15px] text-slate-500 font-outfit mt-1">
                    High-level visibility into your platform's commercial performance, from real-time MRR tracking to future growth forecasting.
                </p>
            </div>

            <div className="px-8 py-8 space-y-8">
                {/* Key Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200/50 border">
                        <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-slate-400 tracking-wide font-outfit mb-1">
                                        Annual Recurring (ARR)
                                    </p>
                                    <p className="text-2xl font-bold text-slate-900 font-outfit mb-1">
                                        $4.62M
                                    </p>
                                    <p className="text-xs text-slate-400 font-outfit">
                                        Next 12 Month Projection
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center space-x-1 text-emerald-600">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span className="text-sm font-medium font-outfit">+19.2%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200/50 border">
                        <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-slate-400 tracking-wide font-outfit mb-1">
                                        Monthly Recurring (MRR)
                                    </p>
                                    <p className="text-2xl font-bold text-slate-900 font-outfit mb-1">
                                        $385k
                                    </p>
                                    <p className="text-xs text-slate-400 font-outfit">
                                        Aug $1.37/client
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center space-x-1 text-blue-600">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span className="text-sm font-medium font-outfit">+13.2%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-violet-50 to-violet-100/50 border-violet-200/50 border">
                        <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-slate-400 tracking-wide font-outfit mb-1">
                                        Net Revenue Retention
                                    </p>
                                    <p className="text-2xl font-bold text-slate-900 font-outfit mb-1">
                                        112%
                                    </p>
                                    <p className="text-xs text-slate-400 font-outfit">
                                        Over last quarter +NRR%
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center space-x-1 text-violet-600">
                                        <ArrowUpRight className="h-4 w-4" />
                                        <span className="text-sm font-medium font-outfit">+2.8%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200/50 border">
                        <CardContent className="p-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-slate-400 tracking-wide font-outfit mb-1">
                                        Renewal Pipeline
                                    </p>
                                    <p className="text-2xl font-bold text-slate-900 font-outfit mb-1">
                                        $1.24M
                                    </p>
                                    <p className="text-xs text-slate-400 font-outfit">
                                        Next 90 Days
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center space-x-1 text-amber-600">
                                        <span className="text-sm font-medium font-outfit">Stable</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* Revenue Performance Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="font-outfit text-sm">Revenue Performance & Forecast</CardTitle>
                            <p className="text-xs text-slate-500 font-outfit">Actual performance vs projected growth trajectory</p>
                        </CardHeader>
                        <CardContent className="pt-1">
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="month"
                                        className="font-outfit text-[10px]"
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        className="font-outfit text-[10px]"
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(value) => `$${value}k`}
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '4px',
                                            fontSize: '10px'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="actual"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        dot={{ fill: '#6366f1', strokeWidth: 1, r: 2 }}
                                        name="Actual"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="forecast"
                                        stroke="#94a3b8"
                                        strokeWidth={1.5}
                                        strokeDasharray="3 3"
                                        dot={{ fill: '#94a3b8', strokeWidth: 1, r: 2 }}
                                        name="Forecast"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                            <div className="flex items-center justify-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    <span className="text-[10px] text-slate-500 font-outfit">Actual</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-[2px] bg-gray-400"></div>
                                    <span className="text-[10px] text-slate-500 font-outfit">Forecast</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Side Cards */}
                    <div className="space-y-3">
                        {/* At-Risk Revenue */}
                        <Card className="border-rose-200 bg-rose-50/30">
                            <CardHeader className="pb-2">
                                <div className="flex items-center space-x-1">
                                    <AlertCircle className="h-3 w-3 text-rose-500" />
                                    <CardTitle className="text-rose-700 font-outfit text-xs">At-Risk Revenue</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-1">
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-lg font-bold text-rose-700 font-outfit">$245.6k</p>
                                        <p className="text-[10px] text-rose-600 font-outfit">Found In 8 High-Priority Accounts</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] text-rose-600 font-outfit">Risk Level</span>
                                            <span className="text-[9px] text-rose-700 font-outfit font-medium">15.3% Of Total ARR</span>
                                        </div>
                                        <Progress value={15.3} className="h-1 bg-rose-100" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Commercial Pipeline */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="font-outfit text-xs">Commercial Pipeline</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-1 space-y-2">
                                {pipelineData.map((item, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-1">
                                                <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-orange-500' : 'bg-cyan-500'}`}></div>
                                                <span className="text-[10px] font-medium text-slate-700 font-outfit">
                                                    {item.title}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-900 font-outfit">
                                                {item.value}
                                            </span>
                                        </div>
                                        <Progress value={item.progress} className="h-1" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
