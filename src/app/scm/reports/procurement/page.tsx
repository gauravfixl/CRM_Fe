"use client"

import * as React from "react"
import { useMemo } from "react"
import { ReportShell, type ReportFilters } from "@/shared/components/scm/shared/ReportShell"
import { type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmPurchaseOrdersStore, type ScmPurchaseOrder } from "@/shared/data/scm/scm-purchase-orders-store"
import { useScmVendorsStore } from "@/shared/data/scm/scm-vendors-store"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

export default function ProcurementReportPage() {
    const pos = useScmPurchaseOrdersStore((s) => s.purchaseOrders)
    const vendors = useScmVendorsStore((s) => s.vendors)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)

    const columns: DataTableColumn<ScmPurchaseOrder>[] = useMemo(
        () => [
            { key: "poNumber", header: "PO #", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.poNumber}</span> },
            { key: "vendorName", header: "Vendor", sortable: true },
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "orderDate", header: "Order Date", width: "120px", sortable: true, render: (r) => <span className="tabular-nums">{r.orderDate}</span> },
            { key: "expectedDelivery", header: "Expected", width: "120px", sortable: true, render: (r) => <span className="tabular-nums">{r.expectedDelivery}</span> },
            { key: "items", header: "Items", width: "70px", align: "right", accessor: (r) => r.items.length, render: (r) => <span className="tabular-nums">{r.items.length}</span> },
            { key: "totalAmount", header: "Total", width: "130px", align: "right", sortable: true, accessor: (r) => r.totalAmount, render: (r) => <span className="tabular-nums font-semibold">{formatINR(r.totalAmount)}</span> },
            { key: "status", header: "Approval", width: "110px", render: (r) => <StatusBadge status={r.status} /> },
            { key: "deliveryStatus", header: "Delivery", width: "110px", render: (r) => <StatusBadge status={r.deliveryStatus} /> },
        ],
        []
    )

    const applyFilters = (rows: ScmPurchaseOrder[], f: ReportFilters) => rows.filter((r) => {
        if (f.warehouse !== "all" && r.warehouse !== f.warehouse) return false
        if (f.vendor !== "all" && r.vendorName !== f.vendor) return false
        if (f.fromDate && r.orderDate < f.fromDate) return false
        if (f.toDate && r.orderDate > f.toDate) return false
        return true
    })

    return (
        <ReportShell
            title="Procurement Report"
            description="Purchase order spending, vendor activity, and delivery performance."
            accentColor="#10b981"
            columns={columns}
            rows={pos}
            rowKey={(r) => r.id}
            csvFilename="scm-procurement-report"
            csvHeaders={["PO Number", "Vendor", "Warehouse", "Order Date", "Expected", "Items", "Subtotal", "Tax", "Discount", "Total", "Approval", "Payment", "Delivery"]}
            csvRow={(r) => [r.poNumber, r.vendorName, r.warehouse, r.orderDate, r.expectedDelivery, r.items.length, r.subtotal, r.taxAmount, r.discount, r.totalAmount, r.status, r.paymentStatus, r.deliveryStatus]}
            filterOptions={{
                warehouses: warehouses.map((w) => w.warehouseName),
                vendors: vendors.map((v) => v.vendorName),
            }}
            applyFilters={applyFilters}
        />
    )
}
