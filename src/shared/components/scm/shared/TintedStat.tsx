"use client"

import * as React from "react"

interface TintedStatProps {
    label: string
    value: number | string
    color: string
    icon?: React.ReactNode
    suffix?: string
}

/**
 * Compact statistic card with light gradient tint matching `color`.
 * Use as a drop-in replacement for the local `Stat` / `SummaryCard` patterns.
 */
export function TintedStat({ label, value, color, icon, suffix }: TintedStatProps) {
    return (
        <div
            className="rounded-xl border shadow-sm p-4 flex items-center justify-between gap-2 transition-all duration-200"
            style={{
                background: `linear-gradient(135deg, ${color}14 0%, ${color}06 45%, #ffffff 100%)`,
                borderColor: `${color}33`,
            }}
        >
            <div className="min-w-0">
                <p className="text-[12px] font-medium text-[#64748B] truncate">{label}</p>
                <p className="text-[22px] font-semibold mt-1 tabular-nums leading-tight" style={{ color }}>
                    {value}
                    {suffix && <span className="text-[14px] text-[#94A3B8] ml-0.5 font-medium">{suffix}</span>}
                </p>
            </div>
            {icon && (
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: color, boxShadow: `0 4px 12px ${color}33` }}
                >
                    {icon}
                </div>
            )}
        </div>
    )
}
