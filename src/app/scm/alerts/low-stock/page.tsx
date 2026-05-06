"use client"

import * as React from "react"
import { useMemo } from "react"
import { AlertTriangle } from "lucide-react"
import { AlertCenter, type AlertItem } from "@/shared/components/scm/shared/AlertCenter"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"

export default function LowStockAlertsPage() {
    const products = useScmProductsStore((s) => s.products)

    const items: AlertItem[] = useMemo(
        () =>
            products
                .filter((p) => p.currentStock <= p.reorderLevel)
                .map((p) => ({
                    id: `low_${p.id}`,
                    title: `${p.productName} is low on stock`,
                    description: `Current: ${p.currentStock} ${p.unit}(s) · Reorder ≤ ${p.reorderLevel} · Warehouse: ${p.warehouse}`,
                    priority: p.currentStock === 0 ? "Critical" : p.currentStock < p.reorderLevel * 0.5 ? "High" : "Medium",
                    createdDate: new Date().toISOString().slice(0, 10),
                    relatedHref: "/scm/inventory/products",
                    relatedLabel: "View product",
                })),
        [products]
    )

    return (
        <AlertCenter
            title="Low Stock Alerts"
            subtitle="Products that have reached or fallen below their reorder level."
            icon={<AlertTriangle className="w-4 h-4" />}
            accentColor="#ef4444"
            items={items}
            emptyMessage="All products are above their reorder levels."
        />
    )
}
