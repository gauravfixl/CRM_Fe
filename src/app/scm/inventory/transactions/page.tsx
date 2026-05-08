"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Download, Filter, ArrowLeftRight } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { Input } from "@/shared/components/ui/input"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import { useScmStockMovementsStore, type ScmStockMovement } from "@/shared/data/scm/scm-stock-movements-store"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"

type DirectionFilter = "all" | "in" | "out"

export default function InventoryTransactionsPage() {
    const { toast } = useToast()
    const movements = useScmStockMovementsStore((s) => s.movements)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)

    const [direction, setDirection] = useState<DirectionFilter>("all")
    const [warehouse, setWarehouse] = useState<string>("all")
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const [viewing, setViewing] = useState<ScmStockMovement | null>(null)

    const filtered = useMemo(() => movements.filter((m) => {
        if (direction !== "all" && m.direction !== direction) return false
        if (warehouse !== "all" && m.warehouse !== warehouse) return false
        if (fromDate && m.movementDate < fromDate) return false
        if (toDate && m.movementDate > toDate) return false
        return true
    }), [movements, direction, warehouse, fromDate, toDate])

    const columns: DataTableColumn<ScmStockMovement>[] = useMemo(
        () => [
            { key: "movementDate", header: "Date", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.movementDate}</span> },
            { key: "id", header: "Txn ID", width: "120px", render: (r) => <span className="font-mono text-[12px]">{r.id}</span> },
            { key: "product", header: "Product", sortable: true, accessor: (r) => r.productName, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.sku}</p></div>
            )},
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "direction", header: "Type", width: "110px", render: (r) => (
                <StatusBadge status={r.direction === "in" ? "Stock In" : r.reason ?? "Stock Out"} tone={r.direction === "in" ? "success" : "warning"} />
            )},
            { key: "quantity", header: "Qty", width: "90px", align: "right", sortable: true, accessor: (r) => r.quantity, render: (r) => (
                <span className={`tabular-nums font-semibold ${r.direction === "in" ? "text-emerald-700" : "text-red-600"}`}>{r.direction === "in" ? "+" : "−"}{r.quantity}</span>
            )},
            { key: "referenceNumber", header: "Reference", width: "150px", render: (r) => r.referenceNumber || r.poNumber || "—" },
            { key: "remarks", header: "Remarks", render: (r) => <span className="text-[#64748B]">{r.remarks || "—"}</span> },
        ],
        []
    )

    const handleExport = () => {
        if (filtered.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Date", "Transaction ID", "Type", "Product", "SKU", "Warehouse", "Quantity", "Reference", "Remarks"]
        const rows = filtered.map((m) => [m.movementDate, m.id, m.direction === "in" ? "Stock In" : m.reason ?? "Stock Out", m.productName, m.sku, m.warehouse, (m.direction === "in" ? "+" : "-") + m.quantity, m.referenceNumber || m.poNumber || "", m.remarks ?? ""])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-transactions-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} transactions exported` })
    }

    const clearFilters = () => { setDirection("all"); setWarehouse("all"); setFromDate(""); setToDate("") }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Inventory Transactions</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Complete history of stock movements across warehouses.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#64748B]">
                        <Filter className="w-4 h-4" /> Filters
                    </div>
                    <Select value={direction} onValueChange={(v) => setDirection(v as DirectionFilter)}>
                        <SelectTrigger className="h-9 w-[140px] border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="in">Stock In only</SelectItem>
                            <SelectItem value="out">Stock Out only</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={warehouse} onValueChange={setWarehouse}>
                        <SelectTrigger className="h-9 w-[200px] border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All warehouses</SelectItem>
                            {warehouses.map((w) => <SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-9 w-[160px] border-[#E5E7EB] text-[13px]" />
                    <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-9 w-[160px] border-[#E5E7EB] text-[13px]" />
                    {(direction !== "all" || warehouse !== "all" || fromDate || toDate) && (
                        <Button variant="ghost" onClick={clearFilters} className="h-9 text-[13px] text-[#64748B]">Clear filters</Button>
                    )}
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by product, SKU, warehouse, reference..."
                searchKeys={["productName", "sku", "warehouse", "referenceNumber", "poNumber", "supplier", "issuedTo"]}
                pageSize={15}
                emptyMessage="No transactions match the filters."
                onRowClick={(row) => setViewing(row)}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.productName}
                description={(r) => `Txn ${r.id} · ${r.movementDate}`}
                icon={<ArrowLeftRight className="w-5 h-5" />}
                accentColor="#2563eb"
            />
        </div>
    )
}
