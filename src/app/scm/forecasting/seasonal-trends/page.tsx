"use client"

import * as React from "react"
import { useState } from "react"
import { Calendar } from "lucide-react"
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
    ResponsiveContainer, Legend,
} from "recharts"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"

const SEASONAL_DATA = [
    { month: "Jan", winter: 380, summer: 90, festive: 200 },
    { month: "Feb", winter: 320, summer: 110, festive: 180 },
    { month: "Mar", winter: 220, summer: 180, festive: 220 },
    { month: "Apr", winter: 140, summer: 280, festive: 200 },
    { month: "May", winter: 80, summer: 380, festive: 230 },
    { month: "Jun", winter: 60, summer: 420, festive: 250 },
    { month: "Jul", winter: 50, summer: 410, festive: 270 },
    { month: "Aug", winter: 80, summer: 360, festive: 320 },
    { month: "Sep", winter: 140, summer: 280, festive: 360 },
    { month: "Oct", winter: 220, summer: 200, festive: 480 },
    { month: "Nov", winter: 320, summer: 130, festive: 520 },
    { month: "Dec", winter: 400, summer: 90, festive: 460 },
]

const REGIONS = ["All India", "North", "South", "East", "West", "Central"]
const SEASONS = ["All seasons", "Winter", "Summer", "Monsoon", "Festive"]

export default function SeasonalTrendsPage() {
    const products = useScmProductsStore((s) => s.products)
    const [product, setProduct] = useState("all")
    const [region, setRegion] = useState("All India")
    const [season, setSeason] = useState("All seasons")
    const [year, setYear] = useState("2026")

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#8b5cf6]" /> Seasonal Trends
                </h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">Demand patterns by season, region, and year.</p>
            </div>

            <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[12px] font-medium text-[#64748B]">Filters:</span>
                    <Select value={product} onValueChange={setProduct}>
                        <SelectTrigger className="h-9 w-[200px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue placeholder="All products" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All products</SelectItem>
                            {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.sku} · {p.productName}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger className="h-9 w-[160px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{REGIONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={season} onValueChange={setSeason}>
                        <SelectTrigger className="h-9 w-[150px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{SEASONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="h-9 w-[110px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {["2024", "2025", "2026", "2027"].map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div
                className="rounded-none border shadow-sm p-4"
                style={{ background: "linear-gradient(180deg, #8b5cf60d 0%, #ffffff 50%)", borderColor: "#8b5cf626" }}
            >
                <div className="flex items-start gap-2 mb-3">
                    <span className="w-1 h-9 rounded-none shrink-0 bg-violet-500" />
                    <div>
                        <h3 className="text-[14px] font-semibold text-[#0F172A]">Monthly Demand by Season</h3>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Stacked area chart showing seasonal demand contributions</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={340}>
                    <AreaChart data={SEASONAL_DATA}>
                        <defs>
                            <linearGradient id="winter" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} /></linearGradient>
                            <linearGradient id="summer" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} /></linearGradient>
                            <linearGradient id="festive" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} /></linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F6" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
                        <ReTooltip contentStyle={{ background: "white", border: "1px solid #EEF1F6", borderRadius: 0, fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        <Area type="monotone" dataKey="winter" stackId="1" stroke="#3b82f6" fill="url(#winter)" />
                        <Area type="monotone" dataKey="summer" stackId="1" stroke="#f59e0b" fill="url(#summer)" />
                        <Area type="monotone" dataKey="festive" stackId="1" stroke="#ef4444" fill="url(#festive)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Insight title="Winter peak" value="Dec" detail="Highest winter demand in December (400 units)" color="#3b82f6" />
                <Insight title="Summer peak" value="Jun" detail="Summer demand peaks in June (420 units)" color="#f59e0b" />
                <Insight title="Festive peak" value="Nov" detail="Pre-Diwali festive bump in November (520 units)" color="#ef4444" />
            </div>
        </div>
    )
}

function Insight({ title, value, detail, color }: { title: string; value: string; detail: string; color: string }) {
    return (
        <div
            className="rounded-none border shadow-sm p-4 transition-all duration-200"
            style={{
                background: `linear-gradient(135deg, ${color}14 0%, ${color}06 45%, #ffffff 100%)`,
                borderColor: `${color}33`,
            }}
        >
            <p className="text-[12px] font-medium text-[#64748B]">{title}</p>
            <p className="text-[26px] font-bold mt-1 leading-tight" style={{ color }}>{value}</p>
            <p className="text-[12px] text-[#94A3B8] mt-1">{detail}</p>
        </div>
    )
}
