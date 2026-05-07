"use client"

import * as React from "react"
import Link from "next/link"
import { useToast } from "@/shared/components/ui/use-toast"
import { Button } from "@/shared/components/ui/button"
import { ArrowRight, Check, BellOff } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AlertItem {
    id: string
    title: string
    description: string
    priority: "Low" | "Medium" | "High" | "Critical"
    createdDate: string
    assignedTo?: string
    relatedHref?: string
    relatedLabel?: string
}

interface Props {
    title: string
    subtitle: string
    icon: React.ReactNode
    accentColor: string
    items: AlertItem[]
    emptyMessage?: string
}

const PRIORITY_TONE: Record<AlertItem["priority"], string> = {
    Low: "bg-slate-100 text-slate-700 border-slate-200",
    Medium: "bg-blue-50 text-blue-700 border-blue-200",
    High: "bg-amber-50 text-amber-700 border-amber-200",
    Critical: "bg-red-50 text-red-700 border-red-200",
}

export function AlertCenter({ title, subtitle, icon, accentColor, items, emptyMessage = "No alerts at the moment. Everything is on track." }: Props) {
    const { toast } = useToast()
    const [resolved, setResolved] = React.useState<Set<string>>(new Set())
    const [dismissed, setDismissed] = React.useState<Set<string>>(new Set())

    const visibleItems = items.filter((i) => !dismissed.has(i.id))

    const summary = {
        total: visibleItems.length,
        critical: visibleItems.filter((i) => i.priority === "Critical").length,
        high: visibleItems.filter((i) => i.priority === "High").length,
        resolved: resolved.size,
    }

    const handleResolve = (id: string, alertTitle: string) => {
        setResolved((s) => new Set(s).add(id))
        toast({ title: "Alert resolved", description: alertTitle })
    }
    const handleDismiss = (id: string, alertTitle: string) => {
        setDismissed((s) => new Set(s).add(id))
        toast({ title: "Alert dismissed", description: alertTitle })
    }

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                    <span style={{ color: accentColor }}>{icon}</span> {title}
                </h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">{subtitle}</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <SummaryCard label="Total Alerts" value={summary.total} color={accentColor} />
                <SummaryCard label="Critical" value={summary.critical} color="#ef4444" />
                <SummaryCard label="High Priority" value={summary.high} color="#f59e0b" />
                <SummaryCard label="Resolved Today" value={summary.resolved} color="#10b981" />
            </div>

            {visibleItems.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm p-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A] mt-3">All clear!</p>
                    <p className="text-[12.5px] text-[#64748B] mt-1">{emptyMessage}</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {visibleItems.map((item) => {
                        const isResolved = resolved.has(item.id)
                        return (
                            <li
                                key={item.id}
                                className={cn(
                                    "rounded-xl border shadow-sm p-4 transition-all",
                                    isResolved ? "opacity-50 border-emerald-200 bg-emerald-50/30" : "hover:shadow-md"
                                )}
                                style={
                                    isResolved
                                        ? undefined
                                        : {
                                            background: `linear-gradient(135deg, ${accentColor}10 0%, ${accentColor}04 45%, #ffffff 100%)`,
                                            borderColor: `${accentColor}33`,
                                        }
                                }
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5" style={{ backgroundColor: accentColor }}>
                                        {icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 flex-wrap">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[13.5px] font-semibold text-[#0F172A]">{item.title}</p>
                                                <p className="text-[12.5px] text-[#64748B] mt-0.5">{item.description}</p>
                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold", PRIORITY_TONE[item.priority])}>
                                                        {item.priority}
                                                    </span>
                                                    <span className="text-[11.5px] text-[#94A3B8]">{item.createdDate}</span>
                                                    {item.assignedTo && (<span className="text-[11.5px] text-[#94A3B8]">· Assigned: {item.assignedTo}</span>)}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {item.relatedHref && (
                                                    <Link href={item.relatedHref}>
                                                        <Button variant="outline" size="sm" className="h-8 px-2 text-[12px] border-[#E5E7EB]">
                                                            {item.relatedLabel ?? "Open"} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {!isResolved && (
                                                    <Button onClick={() => handleResolve(item.id, item.title)} variant="ghost" size="sm" className="h-8 px-2 text-emerald-700 hover:bg-emerald-50" title="Mark resolved">
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button onClick={() => handleDismiss(item.id, item.title)} variant="ghost" size="sm" className="h-8 px-2 text-[#64748B] hover:bg-slate-100" title="Dismiss">
                                                    <BellOff className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div
            className="rounded-xl border shadow-sm p-4 transition-all duration-200"
            style={{
                background: `linear-gradient(135deg, ${color}14 0%, ${color}06 45%, #ffffff 100%)`,
                borderColor: `${color}33`,
            }}
        >
            <p className="text-[12px] font-medium text-[#64748B]">{label}</p>
            <p className="text-[22px] font-semibold mt-1 tabular-nums leading-tight" style={{ color }}>{value}</p>
        </div>
    )
}
