"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, ChevronsUpDown, Search } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/lib/utils"

export interface DataTableColumn<T> {
    key: string
    header: string
    width?: string
    sortable?: boolean
    align?: "left" | "right" | "center"
    render?: (row: T) => React.ReactNode
    accessor?: (row: T) => string | number | null | undefined
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[]
    data: T[]
    rowKey: (row: T) => string
    searchable?: boolean
    searchPlaceholder?: string
    searchKeys?: Array<keyof T>
    pageSize?: number
    emptyMessage?: string
    actions?: (row: T) => React.ReactNode
    onRowClick?: (row: T) => void
}

export function DataTable<T extends Record<string, any>>({
    columns,
    data,
    rowKey,
    searchable = true,
    searchPlaceholder = "Search...",
    searchKeys,
    pageSize = 10,
    emptyMessage = "No records found",
    actions,
    onRowClick,
}: DataTableProps<T>) {
    const [query, setQuery] = useState("")
    const [page, setPage] = useState(1)
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

    const filtered = useMemo(() => {
        if (!query.trim()) return data
        const q = query.trim().toLowerCase()
        const keys = searchKeys ?? (Object.keys(data[0] ?? {}) as Array<keyof T>)
        return data.filter((row) =>
            keys.some((k) => {
                const v = row[k]
                if (v === null || v === undefined) return false
                return String(v).toLowerCase().includes(q)
            })
        )
    }, [data, query, searchKeys])

    const sorted = useMemo(() => {
        if (!sortKey) return filtered
        const col = columns.find((c) => c.key === sortKey)
        if (!col) return filtered
        const accessor = col.accessor ?? ((r: T) => r[sortKey])
        return [...filtered].sort((a, b) => {
            const av = accessor(a)
            const bv = accessor(b)
            if (av == null && bv == null) return 0
            if (av == null) return 1
            if (bv == null) return -1
            if (typeof av === "number" && typeof bv === "number") {
                return sortDir === "asc" ? av - bv : bv - av
            }
            const aS = String(av).toLowerCase()
            const bS = String(bv).toLowerCase()
            return sortDir === "asc" ? aS.localeCompare(bS) : bS.localeCompare(aS)
        })
    }, [filtered, sortKey, sortDir, columns])

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
    const safePage = Math.min(page, totalPages)
    const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)

    const toggleSort = (key: string) => {
        if (sortKey !== key) {
            setSortKey(key)
            setSortDir("asc")
        } else {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        }
    }

    return (
        <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm overflow-hidden">
            {searchable && (
                <div className="px-4 py-3 border-b border-[#EEF1F6] flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                        <Input
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setPage(1)
                            }}
                            placeholder={searchPlaceholder}
                            className="pl-8 h-9 text-[13px] border-[#E5E7EB]"
                        />
                    </div>
                    <span className="text-[12px] text-[#64748B] ml-auto">
                        {sorted.length} {sorted.length === 1 ? "record" : "records"}
                    </span>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                    <thead className="bg-[#F8FAFC] border-b border-[#EEF1F6]">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    style={col.width ? { width: col.width } : undefined}
                                    className={cn(
                                        "px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] select-none",
                                        col.align === "right" && "text-right",
                                        col.align === "center" && "text-center",
                                        (!col.align || col.align === "left") && "text-left",
                                        col.sortable && "cursor-pointer hover:text-[#0F172A]"
                                    )}
                                    onClick={() => col.sortable && toggleSort(col.key)}
                                >
                                    <span className="inline-flex items-center gap-1">
                                        {col.header}
                                        {col.sortable && (
                                            <ChevronsUpDown
                                                className={cn(
                                                    "w-3 h-3",
                                                    sortKey === col.key ? "text-[#2563eb]" : "text-[#CBD5E1]"
                                                )}
                                            />
                                        )}
                                    </span>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-4 py-2.5 text-right text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[80px]">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-4 py-12 text-center text-[#94A3B8] text-[13px]"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            pageRows.map((row) => (
                                <tr
                                    key={rowKey(row)}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                    className={cn(
                                        "border-b border-[#F1F5F9] last:border-b-0 transition-colors",
                                        onRowClick
                                            ? "cursor-pointer hover:bg-[#F8FAFC]"
                                            : "hover:bg-[#FAFBFC]"
                                    )}
                                >
                                    {columns.map((col) => {
                                        const accessor = col.accessor ?? ((r: T) => r[col.key])
                                        const content = col.render ? col.render(row) : (accessor(row) ?? "—")
                                        return (
                                            <td
                                                key={col.key}
                                                className={cn(
                                                    "px-4 py-2.5 text-[13px] text-[#0F172A] align-middle",
                                                    col.align === "right" && "text-right",
                                                    col.align === "center" && "text-center"
                                                )}
                                            >
                                                {content}
                                            </td>
                                        )
                                    })}
                                    {actions && (
                                        <td
                                            className="px-4 py-2 text-right align-middle"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {actions(row)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {sorted.length > pageSize && (
                <div className="px-4 py-3 border-t border-[#EEF1F6] flex items-center justify-between text-[12.5px] text-[#64748B]">
                    <span>
                        Showing {(safePage - 1) * pageSize + 1}–
                        {Math.min(safePage * pageSize, sorted.length)} of {sorted.length}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={safePage <= 1}
                            className="h-8 px-2 border-[#E5E7EB]"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="px-2 font-medium text-[#0F172A]">
                            {safePage} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={safePage >= totalPages}
                            className="h-8 px-2 border-[#E5E7EB]"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
