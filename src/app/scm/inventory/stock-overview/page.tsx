"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Download, Filter } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { KpiCard } from "@/shared/components/scm/shared/KpiCard"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import {
    useScmProductsStore,
    type ScmProduct,
} from "@/shared/data/scm/scm-products-store"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"
import { useScmStockMovementsStore } from "@/shared/data/scm/scm-stock-movements-store"
import { Boxes, AlertTriangle, XCircle, TrendingUp } from "lucide-react"

type StockStatusFilter = "all" | "in-stock" | "low-stock" | "out-of-stock" | "overstocked"

interface OverviewRow {
    id: string
    productName: string
    sku: string
    warehouse: string
    available: number
    reserved: number
    inTransit: number
    damaged: number
    reorderLevel: number
    stockStatus: "In Stock" | "Low Stock" | "Out of Stock" | "Overstocked"
}

const computeStatus = (available: number, reorder: number): OverviewRow["stockStatus"] => {
    if (available === 0) return "Out of Stock"
    if (available <= reorder) return "Low Stock"
    if (available > reorder * 4 && reorder > 0) return "Overstocked"
    return "In Stock"
}

export default function StockOverviewPage() {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const movements = useScmStockMovementsStore((s) => s.movements)

    const [whFilter, setWhFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<StockStatusFilter>("all")
    const [viewing, setViewing] = useState<OverviewRow | null>(null)

    const overview: OverviewRow[] = useMemo(() => {
        return products.map((p: ScmProduct) => {
            const inTransit = movements
                .filter((m) => m.productId === p.id && m.direction === "in" && m.movementDate > new Date().toISOString().slice(0, 10))
                .reduce((sum, m) => sum + m.quantity, 0)
            const damaged = movements
                .filter((m) => m.productId === p.id && m.direction === "out" && m.reason === "Damaged Goods")
                .reduce((sum, m) => sum + m.quantity, 0)
            const reserved = Math.floor(p.currentStock * 0.05) // illustrative reserved
            return {
                id: p.id,
                productName: p.productName,
                sku: p.sku,
                warehouse: p.warehouse,
                available: p.currentStock,
                reserved,
                inTransit,
                damaged,
                reorderLevel: p.reorderLevel,
                stockStatus: computeStatus(p.currentStock, p.reorderLevel),
            }
        })
    }, [products, movements])

    const filtered = useMemo(() => {
        return overview.filter((r) => {
            if (whFilter !== "all" && r.warehouse !== whFilter) return false
            if (statusFilter !== "all") {
                const map: Record<StockStatusFilter, OverviewRow["stockStatus"] | undefined> = {
                    all: undefined,
                    "in-stock": "In Stock",
                    "low-stock": "Low Stock",
                    "out-of-stock": "Out of Stock",
                    overstocked: "Overstocked",
                }
                if (map[statusFilter] && r.stockStatus !== map[statusFilter]) return false
            }
            return true
        })
    }, [overview, whFilter, statusFilter])

    const summary = useMemo(() => {
        return {
            total: overview.length,
            inStock: overview.filter((r) => r.stockStatus === "In Stock").length,
            lowStock: overview.filter((r) => r.stockStatus === "Low Stock").length,
            outOfStock: overview.filter((r) => r.stockStatus === "Out of Stock").length,
        }
    }, [overview])

    const columns = useMemo<DataTableColumn<OverviewRow>[]>(
        () => [
            {
                key: "product",
                header: "Product",
                sortable: true,
                accessor: (r) => r.productName,
                render: (r) => (
                    <div className="min-w-0">
                        <p className="font-medium text-[#0F172A] truncate">{r.productName}</p>
                        <p className="text-[11.5px] text-[#94A3B8] truncate">{r.sku}</p>
                    </div>
                ),
            },
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "available", header: "Available", width: "90px", align: "right", sortable: true, render: (r) => <span className="font-semibold tabular-nums">{r.available}</span> },
            { key: "reserved", header: "Reserved", width: "90px", align: "right", render: (r) => <span className="text-[#64748B] tabular-nums">{r.reserved}</span> },
            { key: "inTransit", header: "In Transit", width: "100px", align: "right", render: (r) => <span className="text-[#64748B] tabular-nums">{r.inTransit}</span> },
            { key: "damaged", header: "Damaged", width: "90px", align: "right", render: (r) => <span className="text-[#64748B] tabular-nums">{r.damaged}</span> },
            { key: "reorderLevel", header: "Reorder ≤", width: "100px", align: "right", render: (r) => <span className="text-[#64748B] tabular-nums">{r.reorderLevel}</span> },
            {
                key: "stockStatus",
                header: "Status",
                width: "120px",
                render: (r) => <StatusBadge status={r.stockStatus} />,
            },
        ],
        []
    )

    const handleExport = () => {
        if (filtered.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Product", "SKU", "Warehouse", "Available", "Reserved", "In Transit", "Damaged", "Reorder Level", "Status"]
        const rows = filtered.map((r) => [r.productName, r.sku, r.warehouse, r.available, r.reserved, r.inTransit, r.damaged, r.reorderLevel, r.stockStatus])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-stock-overview-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} rows exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Stock Overview</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Stock availability across products and warehouses.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-none border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Total Products" value={summary.total} icon={<Boxes className="w-5 h-5" />} accentColor="#2563eb" />
                <KpiCard label="In Stock" value={summary.inStock} icon={<TrendingUp className="w-5 h-5" />} accentColor="#10b981" />
                <KpiCard label="Low Stock" value={summary.lowStock} icon={<AlertTriangle className="w-5 h-5" />} accentColor="#f59e0b" />
                <KpiCard label="Out of Stock" value={summary.outOfStock} icon={<XCircle className="w-5 h-5" />} accentColor="#ef4444" />
            </div>

            <div className="bg-white rounded-none border border-[#EEF1F6] shadow-sm p-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748B]">
                        <Filter className="w-4 h-4" /> Filters
                    </div>
                    <Select value={whFilter} onValueChange={setWhFilter}>
                        <SelectTrigger className="h-9 w-[200px] rounded-none border-[#E5E7EB] text-[13px]">
                            <SelectValue placeholder="All warehouses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All warehouses</SelectItem>
                            {warehouses.map((w) => (
                                <SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StockStatusFilter)}>
                        <SelectTrigger className="h-9 w-[180px] rounded-none border-[#E5E7EB] text-[13px]">
                            <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="in-stock">In Stock</SelectItem>
                            <SelectItem value="low-stock">Low Stock</SelectItem>
                            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                            <SelectItem value="overstocked">Overstocked</SelectItem>
                        </SelectContent>
                    </Select>
                    {(whFilter !== "all" || statusFilter !== "all") && (
                        <Button variant="ghost" onClick={() => { setWhFilter("all"); setStatusFilter("all") }} className="h-9 text-[13px] text-[#64748B]">Clear filters</Button>
                    )}
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by product, SKU, warehouse..."
                searchKeys={["productName", "sku", "warehouse"]}
                pageSize={15}
                emptyMessage="No products match the current filters."
                onRowClick={(row) => setViewing(row)}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.productName}
                description={(r) => `${r.sku} · ${r.warehouse}`}
                icon={<Boxes className="w-5 h-5" />}
                accentColor="#2563eb"
            />
        </div>
    )
}
