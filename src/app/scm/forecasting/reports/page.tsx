"use client"

import * as React from "react"
import Link from "next/link"
import { FileText, ArrowRight, BarChart3, Calendar, Target, Boxes } from "lucide-react"

const REPORTS = [
    { title: "Monthly Demand Forecast", description: "Month-by-month demand outlook with seasonal trends.", href: "/scm/forecasting/seasonal-trends", icon: <BarChart3 className="w-5 h-5" />, accent: "#2563eb" },
    { title: "Product Demand Report", description: "Per-product demand prediction with risk assessment.", href: "/scm/forecasting/product-demand", icon: <Boxes className="w-5 h-5" />, accent: "#10b981" },
    { title: "Category Forecast Report", description: "Aggregated forecast by product category.", href: "/scm/forecasting/seasonal-trends", icon: <FileText className="w-5 h-5" />, accent: "#8b5cf6" },
    { title: "Forecast Accuracy Report", description: "Compare past forecasts against actual sales.", href: "/scm/forecasting/dashboard", icon: <Target className="w-5 h-5" />, accent: "#f59e0b" },
    { title: "Stock Requirement Report", description: "Computed inventory needs to meet predicted demand.", href: "/scm/forecasting/reorder-suggestions", icon: <Calendar className="w-5 h-5" />, accent: "#ef4444" },
]

export default function ForecastReportsPage() {
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Forecast Reports</h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">Pre-built forecasting reports for inventory planning.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {REPORTS.map((r) => (
                    <Link key={r.title} href={r.href} className="group">
                        <div
                            className="rounded-none border shadow-sm p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
                            style={{
                                background: `linear-gradient(135deg, ${r.accent}14 0%, ${r.accent}06 45%, #ffffff 100%)`,
                                borderColor: `${r.accent}33`,
                            }}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="w-10 h-10 rounded-none flex items-center justify-center text-white shrink-0" style={{ backgroundColor: r.accent, boxShadow: `0 4px 12px ${r.accent}33` }}>
                                    {r.icon}
                                </div>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-all" style={{ color: r.accent }} />
                            </div>
                            <h3 className="text-[14px] font-semibold mt-3" style={{ color: r.accent }}>{r.title}</h3>
                            <p className="text-[12.5px] text-[#64748B] mt-0.5 leading-snug">{r.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
