"use client"

import * as React from "react"
import { Eye } from "lucide-react"
import { SideFormSheet } from "@/shared/components/ui/side-form-sheet"
import type { DataTableColumn } from "./DataTable"

interface RowDetailSheetProps<T> {
    row: T | null
    columns: DataTableColumn<T>[]
    onOpenChange: (open: boolean) => void
    title?: string | ((row: T) => string)
    description?: string | ((row: T) => string | undefined)
    icon?: React.ReactNode
    accentColor?: string
    width?: "sm" | "md" | "lg" | "xl"
    excludeKeys?: string[]
    extra?: (row: T) => React.ReactNode
}

function isEmpty(v: unknown): boolean {
    return v === null || v === undefined || v === ""
}

export function RowDetailSheet<T extends Record<string, any>>({
    row,
    columns,
    onOpenChange,
    title = "Record details",
    description,
    icon,
    accentColor = "#2563eb",
    width = "md",
    excludeKeys,
    extra,
}: RowDetailSheetProps<T>) {
    const open = !!row

    const visibleColumns = React.useMemo(
        () => columns.filter((c) => !excludeKeys?.includes(c.key)),
        [columns, excludeKeys]
    )

    const resolvedTitle = React.useMemo(() => {
        if (!row) return typeof title === "function" ? "Record details" : title
        return typeof title === "function" ? title(row) : title
    }, [row, title])

    const resolvedDescription = React.useMemo(() => {
        if (!row) return typeof description === "function" ? undefined : description
        return typeof description === "function" ? description(row) : description
    }, [row, description])

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={resolvedTitle}
            description={resolvedDescription}
            icon={icon ?? <Eye className="w-5 h-5" />}
            hideFooter
            width={width}
            accentColor={accentColor}
        >
            {row && (
                <div className="space-y-5">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-[13px]">
                        {visibleColumns.map((col) => {
                            let value: React.ReactNode
                            if (col.render) {
                                value = col.render(row)
                            } else if (col.accessor) {
                                const v = col.accessor(row)
                                value = isEmpty(v) ? "—" : String(v)
                            } else {
                                const v = row[col.key]
                                value = isEmpty(v) ? "—" : String(v)
                            }
                            return (
                                <div key={col.key} className="min-w-0">
                                    <dt className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">
                                        {col.header}
                                    </dt>
                                    <dd className="mt-0.5 text-[13px] text-[#0F172A] font-medium break-words">
                                        {value}
                                    </dd>
                                </div>
                            )
                        })}
                    </dl>
                    {extra && (
                        <div className="pt-3 border-t border-[#EEF1F6]">{extra(row)}</div>
                    )}
                </div>
            )}
        </SideFormSheet>
    )
}
