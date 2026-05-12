"use client"

import * as React from "react"
import { useMemo } from "react"
import { ReportShell, type ReportFilters } from "@/shared/components/scm/shared/ReportShell"
import { type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmProductsStore, type ScmProduct } from "@/shared/data/scm/scm-products-store"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)

const stockStatus = (p: ScmProduct): string => {
    if (p.currentStock === 0) return "Out of Stock"
    if (p.currentStock <= p.reorderLevel) return "Low Stock"
    return "In Stock"
}

export default function InventoryReportPage() {
    const products = useScmProductsStore((s) => s.products)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const categories = useMemo(() => Array.from(new Set(products.map((p) => p.category))), [products])

    const columns: DataTableColumn<ScmProduct>[] = useMemo(
        () => [
            { key: "sku", header: "SKU", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.sku}</span> },
            { key: "productName", header: "Product", sortable: true },
            { key: "category", header: "Category", sortable: true, width: "140px" },
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "currentStock", header: "Stock", sortable: true, width: "90px", align: "right", accessor: (r) => r.currentStock, render: (r) => <span className="tabular-nums font-semibold">{r.currentStock}</span> },
            { key: "reorderLevel", header: "Reorder", width: "90px", align: "right", render: (r) => <span className="tabular-nums text-[#64748B]">{r.reorderLevel}</span> },
            { key: "value", header: "Stock Value", width: "130px", align: "right", sortable: true, accessor: (r) => r.currentStock * r.purchasePrice, render: (r) => <span className="tabular-nums font-semibold">{formatINR(r.currentStock * r.purchasePrice)}</span> },
            { key: "status", header: "Status", width: "120px", render: (r) => <StatusBadge status={stockStatus(r)} /> },
        ],
        []
    )

    const applyFilters = (rows: ScmProduct[], f: ReportFilters) => {
        return rows.filter((r) => {
            if (f.warehouse !== "all" && r.warehouse !== f.warehouse) return false
            if (f.category !== "all" && r.category !== f.category) return false
            return true
        })
    }

    return (
        <ReportShell
            title="Inventory Report"
            description="Stock levels, valuation, and status across products and warehouses."
            accentColor="#2563eb"
            columns={columns}
            rows={products}
            rowKey={(r) => r.id}
            csvFilename="scm-inventory-report"
            csvHeaders={["SKU", "Product", "Category", "Warehouse", "Stock", "Reorder", "Purchase Price", "Stock Value", "Status"]}
            csvRow={(r) => [r.sku, r.productName, r.category, r.warehouse, r.currentStock, r.reorderLevel, r.purchasePrice, r.currentStock * r.purchasePrice, stockStatus(r)]}
            filterOptions={{
                warehouses: warehouses.map((w) => w.warehouseName),
                categories,
            }}
            applyFilters={applyFilters}
        />
    )
}
