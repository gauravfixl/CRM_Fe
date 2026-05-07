"use client"

import * as React from "react"
import { useMemo } from "react"
import { Star } from "lucide-react"
import { ReportShell, type ReportFilters } from "@/shared/components/scm/shared/ReportShell"
import { type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmVendorsStore, type ScmVendor } from "@/shared/data/scm/scm-vendors-store"
import { useScmPurchaseOrdersStore } from "@/shared/data/scm/scm-purchase-orders-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

interface VendorRow extends ScmVendor {
    poCount: number
    totalSpend: number
}

export default function VendorReportPage() {
    const vendors = useScmVendorsStore((s) => s.vendors)
    const pos = useScmPurchaseOrdersStore((s) => s.purchaseOrders)

    const rows: VendorRow[] = useMemo(
        () =>
            vendors.map((v) => {
                const vendorPOs = pos.filter((p) => p.vendorId === v.id)
                return {
                    ...v,
                    poCount: vendorPOs.length,
                    totalSpend: vendorPOs.reduce((sum, p) => sum + p.totalAmount, 0),
                }
            }),
        [vendors, pos]
    )

    const columns: DataTableColumn<VendorRow>[] = useMemo(
        () => [
            { key: "vendorCode", header: "Code", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.vendorCode}</span> },
            { key: "vendorName", header: "Vendor", sortable: true },
            { key: "category", header: "Category", sortable: true, width: "180px" },
            { key: "city", header: "City", sortable: true, width: "140px" },
            { key: "poCount", header: "POs", width: "70px", align: "right", sortable: true, accessor: (r) => r.poCount, render: (r) => <span className="tabular-nums">{r.poCount}</span> },
            { key: "totalSpend", header: "Total Spend", width: "140px", align: "right", sortable: true, accessor: (r) => r.totalSpend, render: (r) => <span className="tabular-nums font-semibold">{formatINR(r.totalSpend)}</span> },
            {
                key: "rating",
                header: "Rating",
                width: "100px",
                sortable: true,
                accessor: (r) => r.rating,
                render: (r) => (
                    <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                        {r.rating.toFixed(1)} <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </span>
                ),
            },
            { key: "status", header: "Status", width: "100px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const applyFilters = (rs: VendorRow[], f: ReportFilters) => rs.filter((r) => {
        if (f.vendor !== "all" && r.vendorName !== f.vendor) return false
        return true
    })

    return (
        <ReportShell
            title="Vendor Report"
            description="Vendor performance, spend, and ratings overview."
            accentColor="#8b5cf6"
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            csvFilename="scm-vendor-report"
            csvHeaders={["Code", "Vendor", "Category", "City", "POs", "Total Spend", "Rating", "Status"]}
            csvRow={(r) => [r.vendorCode, r.vendorName, r.category, r.city, r.poCount, r.totalSpend, r.rating, r.status]}
            filterOptions={{ vendors: vendors.map((v) => v.vendorName) }}
            applyFilters={applyFilters}
        />
    )
}
