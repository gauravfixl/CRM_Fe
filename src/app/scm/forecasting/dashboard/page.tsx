"use client"

import * as React from "react"
import { useMemo } from "react"
import { TrendingUp, Sparkles, AlertCircle, Target, BarChart3 } from "lucide-react"
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as ReTooltip, ResponsiveContainer, Legend,
} from "recharts"
import { KpiCard } from "@/shared/components/scm/shared/KpiCard"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"

const accuracyTrend = [
    { month: "Dec", accuracy: 78 },
    { month: "Jan", accuracy: 82 },
    { month: "Feb", accuracy: 84 },
    { month: "Mar", accuracy: 81 },
    { month: "Apr", accuracy: 87 },
    { month: "May", accuracy: 89 },
]

const upcomingDemand = [
    { week: "W1", forecast: 220, actual: 215 },
    { week: "W2", forecast: 245, actual: 248 },
    { week: "W3", forecast: 260, actual: null },
    { week: "W4", forecast: 290, actual: null },
    { week: "W5", forecast: 310, actual: null },
]

export default function ForecastDashboardPage() {
    const products = useScmProductsStore((s) => s.products)

    const highDemand = useMemo(() => {
        return products
            .map((p) => ({ ...p, forecast: Math.round(p.currentStock * 1.6 + p.reorderLevel * 1.2) }))
            .sort((a, b) => b.forecast - a.forecast)
            .slice(0, 5)
    }, [products])

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#8b5cf6]" /> Demand Forecast Dashboard
                </h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">Predictive analytics for upcoming inventory needs.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Forecast Accuracy" value="89%" icon={<Target className="w-5 h-5" />} accentColor="#10b981" delta={{ value: "2.3%", trend: "up" }} helperText="vs last month" />
                <KpiCard label="Predicted Demand (Next Mo)" value="₹ 4.2L" icon={<TrendingUp className="w-5 h-5" />} accentColor="#2563eb" delta={{ value: "12%", trend: "up" }} />
                <KpiCard label="High-Demand SKUs" value={highDemand.length} icon={<BarChart3 className="w-5 h-5" />} accentColor="#f59e0b" />
                <KpiCard label="Risk Items" value={3} icon={<AlertCircle className="w-5 h-5" />} accentColor="#ef4444" helperText="reorder needed" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="Forecast Accuracy Trend" subtitle="Monthly forecast vs actual" accentColor="#10b981">
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={accuracyTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F6" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} domain={[60, 100]} />
                            <ReTooltip contentStyle={{ background: "white", border: "1px solid #EEF1F6", borderRadius: 8, fontSize: 12 }} />
                            <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: "#10b981" }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="5-Week Demand Outlook" subtitle="Forecast vs Actual (units)" accentColor="#8b5cf6">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={upcomingDemand}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F6" vertical={false} />
                            <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                            <ReTooltip contentStyle={{ background: "white", border: "1px solid #EEF1F6", borderRadius: 8, fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: 12 }} />
                            <Bar dataKey="forecast" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            <div
                className="rounded-xl border shadow-sm p-4"
                style={{ background: "linear-gradient(180deg, #f59e0b0d 0%, #ffffff 50%)", borderColor: "#f59e0b26" }}
            >
                <div className="flex items-start gap-2 mb-3">
                    <span className="w-1 h-9 rounded-full shrink-0 bg-amber-500" />
                    <div>
                        <h3 className="text-[14px] font-semibold text-[#0F172A]">Top Predicted High-Demand Products</h3>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Based on history, season, and reorder patterns</p>
                    </div>
                </div>
                <div className="space-y-2">
                    {highDemand.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-[#FAFBFC] rounded-lg">
                            <div className="min-w-0">
                                <p className="font-medium text-[13.5px] text-[#0F172A] truncate">{p.productName}</p>
                                <p className="text-[12px] text-[#64748B]">{p.sku} · {p.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[14px] font-semibold tabular-nums text-[#8b5cf6]">{p.forecast} units</p>
                                <p className="text-[11px] text-[#94A3B8]">forecasted demand</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ChartCard({ title, subtitle, children, accentColor = "#8b5cf6" }: { title: string; subtitle?: string; children: React.ReactNode; accentColor?: string }) {
    return (
        <div
            className="rounded-xl border shadow-sm p-4 overflow-hidden"
            style={{ background: `linear-gradient(180deg, ${accentColor}0d 0%, #ffffff 50%)`, borderColor: `${accentColor}26` }}
        >
            <div className="mb-3 flex items-start gap-2">
                <span className="w-1 h-9 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                <div>
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">{title}</h3>
                    {subtitle && <p className="text-[11.5px] text-[#94A3B8] mt-0.5">{subtitle}</p>}
                </div>
            </div>
            {children}
        </div>
    )
}
