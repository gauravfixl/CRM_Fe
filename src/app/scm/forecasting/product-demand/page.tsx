"use client"

import * as React from "react"
import { useMemo } from "react"
import { Download, TrendingUp } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmProductsStore, type ScmProduct } from "@/shared/data/scm/scm-products-store"

interface DemandRow extends ScmProduct {
    pastSales: number
    predictedDemand: number
    recommendedPurchase: number
    riskLevel: "Low" | "Medium" | "High"
}

const computeRisk = (current: number, predicted: number): DemandRow["riskLevel"] => {
    if (predicted > current * 1.5) return "High"
    if (predicted > current) return "Medium"
    return "Low"
}

export default function ProductDemandPage() {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)

    const rows: DemandRow[] = useMemo(
        () => products.map((p) => {
            const pastSales = Math.floor(p.openingStock * 0.8) + Math.floor(Math.random() * 20)
            const predictedDemand = Math.round(pastSales * 1.15)
            const recommendedPurchase = Math.max(0, predictedDemand - p.currentStock + p.reorderLevel)
            return { ...p, pastSales, predictedDemand, recommendedPurchase, riskLevel: computeRisk(p.currentStock, predictedDemand) }
        }),
        [products]
    )

    const columns: DataTableColumn<DemandRow>[] = useMemo(
        () => [
            { key: "sku", header: "SKU", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.sku}</span> },
            { key: "productName", header: "Product", sortable: true, render: (r) => (
                <div><p className="font-medium text-[#0F172A]">{r.productName}</p><p className="text-[11.5px] text-[#94A3B8]">{r.category}</p></div>
            )},
            { key: "currentStock", header: "Current Stock", width: "120px", align: "right", sortable: true, accessor: (r) => r.currentStock, render: (r) => <span className="tabular-nums">{r.currentStock}</span> },
            { key: "pastSales", header: "Past Sales", width: "100px", align: "right", sortable: true, accessor: (r) => r.pastSales, render: (r) => <span className="tabular-nums text-[#64748B]">{r.pastSales}</span> },
            { key: "predictedDemand", header: "Predicted", width: "110px", align: "right", sortable: true, accessor: (r) => r.predictedDemand, render: (r) => <span className="tabular-nums font-semibold text-[#8b5cf6]">{r.predictedDemand}</span> },
            { key: "recommendedPurchase", header: "Recommend Buy", width: "140px", align: "right", sortable: true, accessor: (r) => r.recommendedPurchase, render: (r) => <span className={`tabular-nums font-semibold ${r.recommendedPurchase > 0 ? "text-emerald-700" : "text-[#94A3B8]"}`}>{r.recommendedPurchase}</span> },
            { key: "riskLevel", header: "Risk", width: "100px", render: (r) => <StatusBadge status={r.riskLevel} /> },
        ],
        []
    )

    const handleExport = () => {
        if (rows.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["SKU", "Product", "Category", "Current Stock", "Past Sales", "Predicted Demand", "Recommended Purchase", "Risk Level"]
        const data = rows.map((r) => [r.sku, r.productName, r.category, r.currentStock, r.pastSales, r.predictedDemand, r.recommendedPurchase, r.riskLevel])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...data].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-product-demand-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${data.length} rows exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#8b5cf6]" /> Product Demand
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Per-product demand prediction with risk assessment.</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={rows}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by product, SKU..."
                searchKeys={["productName", "sku", "category"]}
                pageSize={15}
                emptyMessage="No products to forecast."
            />
        </div>
    )
}
