"use client"

import * as React from "react"
import { useState } from "react"
import { Download, FileText, Filter, Printer } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"

export interface ReportFilters {
    fromDate: string
    toDate: string
    warehouse: string
    vendor: string
    product: string
    category: string
}

const emptyFilters: ReportFilters = {
    fromDate: "",
    toDate: "",
    warehouse: "all",
    vendor: "all",
    product: "all",
    category: "all",
}

interface ReportShellProps<T> {
    title: string
    description: string
    accentColor?: string
    columns: DataTableColumn<T>[]
    rows: T[]
    rowKey: (row: T) => string
    csvFilename: string
    csvHeaders: string[]
    csvRow: (row: T) => Array<string | number>
    filterOptions?: {
        warehouses?: string[]
        vendors?: string[]
        products?: string[]
        categories?: string[]
    }
    applyFilters?: (rows: T[], filters: ReportFilters) => T[]
}

export function ReportShell<T extends Record<string, any>>({
    title,
    description,
    accentColor = "#2563eb",
    columns,
    rows,
    rowKey,
    csvFilename,
    csvHeaders,
    csvRow,
    filterOptions = {},
    applyFilters,
}: ReportShellProps<T>) {
    const { toast } = useToast()
    const [filters, setFilters] = useState<ReportFilters>(emptyFilters)

    const filteredRows = applyFilters ? applyFilters(rows, filters) : rows

    const setFilter = (key: keyof ReportFilters, value: string) =>
        setFilters((f) => ({ ...f, [key]: value }))

    const clearFilters = () => setFilters(emptyFilters)
    const hasActiveFilters =
        Object.values(filters).some((v) => v && v !== "all" && v !== "")

    const handleExportCSV = () => {
        if (filteredRows.length === 0) {
            toast({ title: "No data to export", variant: "destructive" })
            return
        }
        const escape = (v: any) => {
            const s = String(v ?? "")
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
        }
        const rowsCsv = filteredRows.map((r) => csvRow(r))
        const csv = [csvHeaders, ...rowsCsv].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${csvFilename}-${new Date().toISOString().slice(0, 10)}.csv`
        document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "CSV exported", description: `${rowsCsv.length} rows` })
    }

    const handleExportPDF = () => {
        // Lightweight PDF export = open print dialog with a styled view
        toast({ title: "PDF export uses print preview", description: "Use 'Save as PDF' in the print dialog" })
        setTimeout(() => window.print(), 200)
    }

    const handlePrint = () => window.print()

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">{title}</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handlePrint} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Printer className="w-4 h-4 mr-1.5" /> Print
                    </Button>
                    <Button variant="outline" onClick={handleExportPDF} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <FileText className="w-4 h-4 mr-1.5" /> PDF
                    </Button>
                    <Button onClick={handleExportCSV} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: accentColor, boxShadow: `0 4px 12px ${accentColor}33` }}>
                        <Download className="w-4 h-4 mr-1.5" /> CSV
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm p-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748B]">
                        <Filter className="w-4 h-4" /> Filters
                    </div>
                    <Input
                        type="date"
                        value={filters.fromDate}
                        onChange={(e) => setFilter("fromDate", e.target.value)}
                        className="h-9 w-[160px] border-[#E5E7EB] text-[13px]"
                        placeholder="From"
                    />
                    <Input
                        type="date"
                        value={filters.toDate}
                        onChange={(e) => setFilter("toDate", e.target.value)}
                        className="h-9 w-[160px] border-[#E5E7EB] text-[13px]"
                        placeholder="To"
                    />
                    {filterOptions.warehouses && (
                        <Select value={filters.warehouse} onValueChange={(v) => setFilter("warehouse", v)}>
                            <SelectTrigger className="h-9 w-[180px] border-[#E5E7EB] text-[13px]">
                                <SelectValue placeholder="All warehouses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All warehouses</SelectItem>
                                {filterOptions.warehouses.map((w) => (
                                    <SelectItem key={w} value={w}>{w}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {filterOptions.vendors && (
                        <Select value={filters.vendor} onValueChange={(v) => setFilter("vendor", v)}>
                            <SelectTrigger className="h-9 w-[180px] border-[#E5E7EB] text-[13px]">
                                <SelectValue placeholder="All vendors" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All vendors</SelectItem>
                                {filterOptions.vendors.map((v) => (
                                    <SelectItem key={v} value={v}>{v}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {filterOptions.categories && (
                        <Select value={filters.category} onValueChange={(v) => setFilter("category", v)}>
                            <SelectTrigger className="h-9 w-[160px] border-[#E5E7EB] text-[13px]">
                                <SelectValue placeholder="All categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {filterOptions.categories.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={clearFilters} className="h-9 text-[13px] text-[#64748B]">
                            Clear filters
                        </Button>
                    )}
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredRows}
                rowKey={rowKey}
                pageSize={15}
                emptyMessage="No data matches the current filters."
            />
        </div>
    )
}
