"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp } from "lucide-react"

interface KpiCardProps {
    label: string
    value: string | number
    icon: React.ReactNode
    accentColor?: string
    delta?: { value: string; trend: "up" | "down" | "neutral" }
    helperText?: string
    onClick?: () => void
    /** When true, applies a soft gradient tint of accentColor instead of plain white */
    tinted?: boolean
}

export function KpiCard({
    label,
    value,
    icon,
    accentColor = "#2563eb",
    delta,
    helperText,
    onClick,
    tinted = true,
}: KpiCardProps) {
    const interactive = typeof onClick === "function"
    const tintedStyle: React.CSSProperties | undefined = tinted
        ? {
            background: `linear-gradient(135deg, ${accentColor}14 0%, ${accentColor}06 45%, #ffffff 100%)`,
            borderColor: `${accentColor}33`,
        }
        : undefined
    return (
        <div
            onClick={onClick}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={(e) => {
                if (interactive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    onClick?.()
                }
            }}
            style={tintedStyle}
            className={cn(
                "group rounded-none border p-4 shadow-sm transition-all duration-200",
                tinted ? "" : "bg-white border-[#EEF1F6]",
                interactive && "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-[#64748B] truncate">{label}</p>
                    <p
                        className="mt-1 text-[22px] font-semibold leading-tight tabular-nums"
                        style={tinted ? { color: accentColor } : { color: "#0F172A" }}
                    >
                        {value}
                    </p>
                    {(delta || helperText) && (
                        <div className="mt-2 flex items-center gap-2">
                            {delta && (
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-0.5 text-[11.5px] font-semibold px-1.5 py-0.5 rounded-none",
                                        delta.trend === "up" && "bg-emerald-50 text-emerald-700",
                                        delta.trend === "down" && "bg-red-50 text-red-700",
                                        delta.trend === "neutral" && "bg-slate-100 text-slate-600"
                                    )}
                                >
                                    {delta.trend === "up" && <ArrowUp className="w-3 h-3" />}
                                    {delta.trend === "down" && <ArrowDown className="w-3 h-3" />}
                                    {delta.value}
                                </span>
                            )}
                            {helperText && (
                                <span className="text-[11.5px] text-[#94A3B8] truncate">
                                    {helperText}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div
                    className="w-10 h-10 rounded-none flex items-center justify-center shrink-0 text-white"
                    style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 4px 12px ${accentColor}33`,
                    }}
                >
                    {icon}
                </div>
            </div>
        </div>
    )
}
