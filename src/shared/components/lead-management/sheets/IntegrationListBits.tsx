"use client"

import * as React from "react"
import {
    Search, Filter, Send, Pencil, Trash2, Zap,
} from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"

// ─── Stat tile ───────────────────────────────────────────────────────────
export function Stat({
    label, value, icon, accent, helper,
}: {
    label: string
    value: string | number
    icon: React.ReactNode
    accent: string
    helper?: string
}) {
    return (
        <div
            className="border shadow-sm p-4 rounded-none"
            style={{
                background: `linear-gradient(135deg, ${accent}14 0%, ${accent}06 45%, #ffffff 100%)`,
                borderColor: `${accent}33`,
            }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[#64748B] truncate">{label}</p>
                    <p className="mt-1.5 text-[20px] font-bold tabular-nums leading-tight truncate" style={{ color: accent }}>
                        {value}
                    </p>
                    {helper && <p className="text-[11px] text-[#94A3B8] mt-1 truncate">{helper}</p>}
                </div>
                <div
                    className="w-9 h-9 rounded-none flex items-center justify-center text-white shrink-0"
                    style={{ background: accent, boxShadow: `0 4px 12px ${accent}33` }}
                >
                    {icon}
                </div>
            </div>
        </div>
    )
}

// ─── Filter bar ──────────────────────────────────────────────────────────
export function FilterBar({
    search, onSearch,
    statusFilter, onStatusFilter,
    providerFilter, onProviderFilter, providerOptions,
    visible, total,
}: {
    search: string; onSearch: (v: string) => void
    statusFilter: string; onStatusFilter: (v: string) => void
    providerFilter: string; onProviderFilter: (v: string) => void
    providerOptions: string[]
    visible: number; total: number
}) {
    return (
        <div className="bg-white border border-[#EEF1F6] shadow-sm rounded-none p-3 flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                <Input
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search by name or provider..."
                    className="pl-8 h-9 rounded-none border-[#E5E7EB] text-[13px]"
                />
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#64748B]">
                <Filter className="w-3.5 h-3.5" /> Filter
            </span>
            <Select value={statusFilter} onValueChange={onStatusFilter}>
                <SelectTrigger className="h-9 w-[140px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                    <SelectItem value="Disconnected">Disconnected</SelectItem>
                </SelectContent>
            </Select>
            <Select value={providerFilter} onValueChange={onProviderFilter}>
                <SelectTrigger className="h-9 w-[160px] rounded-none border-[#E5E7EB] text-[13px]">
                    <SelectValue placeholder="All providers" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All providers</SelectItem>
                    {providerOptions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
            </Select>
            {(statusFilter !== "all" || providerFilter !== "all" || search) && (
                <Button
                    variant="ghost"
                    onClick={() => { onSearch(""); onStatusFilter("all"); onProviderFilter("all") }}
                    className="h-9 rounded-none text-[12px] text-[#64748B]"
                >
                    Clear
                </Button>
            )}
            <span className="text-[11.5px] text-[#94A3B8] ml-auto">{visible} of {total}</span>
        </div>
    )
}

// ─── Generic list table ──────────────────────────────────────────────────
export interface ListColumn<T> {
    key: string
    label: string
    align?: "left" | "right" | "center"
    width?: string
    render: (item: T) => React.ReactNode
}

export interface ListItemBase {
    id: string
    integrationName: string
    provider: string
    integrationStatus: string
    lastSync: string
}

export function ListTable<T extends ListItemBase>({
    items, columns, onEdit, onDelete, onTest,
    accentBg = "bg-indigo-50", accentText = "text-indigo-600", accentBorder = "border-indigo-100",
    rowIcon,
}: {
    items: T[]
    columns: ListColumn<T>[]
    onEdit: (i: T) => void
    onDelete: (i: T) => void
    onTest?: (i: T) => void
    accentBg?: string
    accentText?: string
    accentBorder?: string
    rowIcon?: React.ReactNode
}) {
    return (
        <div className="bg-white border border-[#EEF1F6] shadow-sm rounded-none overflow-x-auto">
            <table className="w-full text-[12.5px]">
                <thead className="bg-slate-50 border-b border-[#EEF1F6] text-[10.5px] font-bold uppercase tracking-wider text-[#64748B]">
                    <tr>
                        <th className="px-4 py-2.5 text-left">Integration</th>
                        <th className="px-4 py-2.5 text-left">Provider</th>
                        {columns.map((c) => (
                            <th
                                key={c.key}
                                className={`px-4 py-2.5 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"}`}
                                style={c.width ? { width: c.width } : undefined}
                            >
                                {c.label}
                            </th>
                        ))}
                        <th className="px-4 py-2.5 text-left w-[110px]">Status</th>
                        <th className="px-4 py-2.5 text-left w-[110px]">Last Sync</th>
                        <th className="px-4 py-2.5 text-right w-[140px]">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan={5 + columns.length} className="px-4 py-10 text-center text-[#94A3B8]">
                                No records match the current filters.
                            </td>
                        </tr>
                    ) : (
                        items.map((i) => (
                            <tr key={i.id} className="hover:bg-slate-50/60">
                                <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-7 h-7 flex items-center justify-center ${accentBg} ${accentText} rounded-none border ${accentBorder}`}>
                                            {rowIcon ?? <Zap className="w-3.5 h-3.5" />}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-[#0F172A]">{i.integrationName}</p>
                                            <p className="text-[10.5px] text-[#94A3B8] font-mono">{i.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-2.5">
                                    <span className="inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded-none border bg-white text-slate-600 border-slate-200">
                                        {i.provider}
                                    </span>
                                </td>
                                {columns.map((c) => (
                                    <td
                                        key={c.key}
                                        className={`px-4 py-2.5 ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"}`}
                                    >
                                        {c.render(i)}
                                    </td>
                                ))}
                                <td className="px-4 py-2.5">
                                    <span className={`inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded-none border ${
                                        i.integrationStatus === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                            i.integrationStatus === "Paused" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                "bg-slate-50 text-slate-700 border-slate-200"
                                    }`}>
                                        {i.integrationStatus}
                                    </span>
                                </td>
                                <td className="px-4 py-2.5 tabular-nums text-[#64748B]">{i.lastSync}</td>
                                <td className="px-4 py-2.5 text-right">
                                    <div className="inline-flex items-center gap-0.5">
                                        {onTest && (
                                            <Button onClick={() => onTest(i)} size="sm" variant="ghost" className="h-7 px-1.5 rounded-none text-[#64748B] hover:bg-slate-100" title="Test">
                                                <Send className="w-3.5 h-3.5" />
                                            </Button>
                                        )}
                                        <Button onClick={() => onEdit(i)} size="sm" variant="ghost" className="h-7 px-1.5 rounded-none text-blue-600 hover:bg-blue-50" title="Edit">
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button onClick={() => onDelete(i)} size="sm" variant="ghost" className="h-7 px-1.5 rounded-none text-red-600 hover:bg-red-50" title="Disconnect">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

// ─── Tinted page header ──────────────────────────────────────────────────
export function PageHeader({
    icon, title, description, accent, onBack, primaryLabel, onPrimary, primaryIcon,
}: {
    icon: React.ReactNode
    title: string
    description: string
    accent: string
    onBack: () => void
    primaryLabel?: string
    onPrimary?: () => void
    primaryIcon?: React.ReactNode
}) {
    return (
        <div
            className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-5 border shadow-sm rounded-none"
            style={{
                background: `linear-gradient(135deg, ${accent}14 0%, ${accent}06 45%, #ffffff 100%)`,
                borderColor: `${accent}33`,
            }}
        >
            <div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="-ml-2 h-7 text-[11px] font-semibold text-slate-400 hover:text-indigo-600 rounded-none"
                >
                    ← Back to Dashboard
                </Button>
                <div className="flex items-center gap-3 mt-1">
                    <div
                        className="p-2 text-white shadow-sm rounded-none"
                        style={{ background: accent, boxShadow: `0 4px 12px ${accent}33` }}
                    >
                        {icon}
                    </div>
                    <div>
                        <h1 className="text-[20px] font-semibold text-slate-900 leading-tight">{title}</h1>
                        <p className="text-[12.5px] text-slate-500 max-w-2xl">{description}</p>
                    </div>
                </div>
            </div>
            {primaryLabel && onPrimary && (
                <Button
                    onClick={onPrimary}
                    className="h-9 text-white font-semibold px-4 rounded-none"
                    style={{ background: accent, boxShadow: `0 4px 12px ${accent}33` }}
                >
                    {primaryIcon}
                    <span className={primaryIcon ? "ml-1.5" : ""}>{primaryLabel}</span>
                </Button>
            )}
        </div>
    )
}
