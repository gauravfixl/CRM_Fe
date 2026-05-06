"use client"

import * as React from "react"
import { useMemo } from "react"
import { ReportShell, type ReportFilters } from "@/shared/components/scm/shared/ReportShell"
import { type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmSalesOrdersStore, type ScmSalesOrder } from "@/shared/data/scm/scm-sales-orders-store"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

export default function OrderFulfillmentReportPage() {
    const orders = useScmSalesOrdersStore((s) => s.salesOrders)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)

    const columns: DataTableColumn<ScmSalesOrder>[] = useMemo(
        () => [
            { key: "orderNumber", header: "Order #", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.orderNumber}</span> },
            { key: "customerName", header: "Customer", sortable: true },
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "orderDate", header: "Order Date", width: "120px", sortable: true, render: (r) => <span className="tabular-nums">{r.orderDate}</span> },
            { key: "items", header: "Items", width: "70px", align: "right", accessor: (r) => r.items.length, render: (r) => <span className="tabular-nums">{r.items.length}</span> },
            { key: "totalAmount", header: "Total", width: "130px", align: "right", sortable: true, accessor: (r) => r.totalAmount, render: (r) => <span className="tabular-nums font-semibold">{formatINR(r.totalAmount)}</span> },
            { key: "fulfillmentStatus", header: "Fulfillment", width: "130px", render: (r) => <StatusBadge status={r.fulfillmentStatus} /> },
            { key: "paymentStatus", header: "Payment", width: "100px", render: (r) => <StatusBadge status={r.paymentStatus} /> },
            { key: "status", header: "Status", width: "100px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const applyFilters = (rs: ScmSalesOrder[], f: ReportFilters) => rs.filter((r) => {
        if (f.warehouse !== "all" && r.warehouse !== f.warehouse) return false
        if (f.fromDate && r.orderDate < f.fromDate) return false
        if (f.toDate && r.orderDate > f.toDate) return false
        return true
    })

    return (
        <ReportShell
            title="Order Fulfillment Report"
            description="Track fulfillment progress, payments, and order outcomes."
            accentColor="#2563eb"
            columns={columns}
            rows={orders}
            rowKey={(r) => r.id}
            csvFilename="scm-order-fulfillment-report"
            csvHeaders={["Order Number", "Customer", "Warehouse", "Order Date", "Items", "Total", "Fulfillment", "Payment", "Status"]}
            csvRow={(r) => [r.orderNumber, r.customerName, r.warehouse, r.orderDate, r.items.length, r.totalAmount, r.fulfillmentStatus, r.paymentStatus, r.status]}
            filterOptions={{ warehouses: warehouses.map((w) => w.warehouseName) }}
            applyFilters={applyFilters}
        />
    )
}
