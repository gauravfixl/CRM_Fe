"use client"

import * as React from "react"
import { useMemo } from "react"
import { ReportShell } from "@/shared/components/scm/shared/ReportShell"
import { type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { useScmPurchaseOrdersStore } from "@/shared/data/scm/scm-purchase-orders-store"
import { useScmShipmentsStore } from "@/shared/data/scm/scm-shipments-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

interface CostRow {
    id: string
    month: string
    procurementSpend: number
    taxPaid: number
    discounts: number
    shippingCost: number
    netSpend: number
}

export default function CostAnalysisReportPage() {
    const pos = useScmPurchaseOrdersStore((s) => s.purchaseOrders)
    const shipments = useScmShipmentsStore((s) => s.shipments)

    const rows: CostRow[] = useMemo(() => {
        const monthMap = new Map<string, CostRow>()
        const ensure = (month: string): CostRow => {
            if (!monthMap.has(month)) {
                monthMap.set(month, {
                    id: month,
                    month,
                    procurementSpend: 0,
                    taxPaid: 0,
                    discounts: 0,
                    shippingCost: 0,
                    netSpend: 0,
                })
            }
            return monthMap.get(month)!
        }
        for (const p of pos) {
            const m = p.orderDate.slice(0, 7)
            const r = ensure(m)
            r.procurementSpend += p.subtotal
            r.taxPaid += p.taxAmount
            r.discounts += p.discount
        }
        for (const s of shipments) {
            const m = s.pickupDate.slice(0, 7)
            const r = ensure(m)
            r.shippingCost += s.shippingCharges
        }
        for (const r of monthMap.values()) {
            r.netSpend = r.procurementSpend + r.taxPaid - r.discounts + r.shippingCost
        }
        return Array.from(monthMap.values()).sort((a, b) => b.month.localeCompare(a.month))
    }, [pos, shipments])

    const columns: DataTableColumn<CostRow>[] = useMemo(
        () => [
            { key: "month", header: "Month", width: "120px", sortable: true, render: (r) => <span className="font-semibold tabular-nums">{r.month}</span> },
            { key: "procurementSpend", header: "Procurement", align: "right", sortable: true, accessor: (r) => r.procurementSpend, render: (r) => <span className="tabular-nums">{formatINR(r.procurementSpend)}</span> },
            { key: "taxPaid", header: "Tax", align: "right", sortable: true, accessor: (r) => r.taxPaid, render: (r) => <span className="tabular-nums">{formatINR(r.taxPaid)}</span> },
            { key: "discounts", header: "Discounts", align: "right", sortable: true, accessor: (r) => r.discounts, render: (r) => <span className="tabular-nums text-emerald-700">− {formatINR(r.discounts)}</span> },
            { key: "shippingCost", header: "Shipping", align: "right", sortable: true, accessor: (r) => r.shippingCost, render: (r) => <span className="tabular-nums">{formatINR(r.shippingCost)}</span> },
            { key: "netSpend", header: "Net Spend", align: "right", sortable: true, accessor: (r) => r.netSpend, render: (r) => <span className="tabular-nums font-semibold text-[#0F172A]">{formatINR(r.netSpend)}</span> },
        ],
        []
    )

    return (
        <ReportShell
            title="Cost Analysis"
            description="Monthly spend rollup across procurement, tax, discounts, and shipping."
            accentColor="#ef4444"
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            csvFilename="scm-cost-analysis"
            csvHeaders={["Month", "Procurement", "Tax", "Discounts", "Shipping", "Net Spend"]}
            csvRow={(r) => [r.month, r.procurementSpend, r.taxPaid, r.discounts, r.shippingCost, r.netSpend]}
        />
    )
}
