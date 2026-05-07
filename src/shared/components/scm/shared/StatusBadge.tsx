"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type StatusTone =
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "purple"

const TONE_STYLES: Record<StatusTone, string> = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
}

const STATUS_TONE_MAP: Record<string, StatusTone> = {
    // Inventory / stock
    "in stock": "success",
    "low stock": "warning",
    "out of stock": "danger",
    "overstocked": "info",
    "active": "success",
    "inactive": "neutral",
    "available": "success",
    "occupied": "info",
    "reserved": "warning",
    "damaged": "danger",
    // Order / shipment
    "pending": "warning",
    "approved": "success",
    "rejected": "danger",
    "draft": "neutral",
    "submitted": "info",
    "in transit": "info",
    "in-transit": "info",
    "delivered": "success",
    "delayed": "danger",
    "cancelled": "neutral",
    "completed": "success",
    "fulfilled": "success",
    "picked": "info",
    "packed": "info",
    "ready for dispatch": "purple",
    "received": "success",
    // Payment
    "paid": "success",
    "unpaid": "warning",
    "overdue": "danger",
    "refund pending": "warning",
    "refund processed": "success",
    "replacement pending": "warning",
    "replacement shipped": "info",
    // Priority
    "low": "neutral",
    "medium": "info",
    "high": "warning",
    "urgent": "danger",
    "critical": "danger",
}

interface StatusBadgeProps {
    status: string
    tone?: StatusTone
    className?: string
}

export function StatusBadge({ status, tone, className }: StatusBadgeProps) {
    const resolved = tone ?? STATUS_TONE_MAP[status?.toLowerCase().trim()] ?? "neutral"
    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-none border text-[11.5px] font-semibold capitalize",
                TONE_STYLES[resolved],
                className
            )}
        >
            {status}
        </span>
    )
}
