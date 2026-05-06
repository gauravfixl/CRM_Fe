"use client"

import * as React from "react"
import { useMemo } from "react"
import { ReportShell, type ReportFilters } from "@/shared/components/scm/shared/ReportShell"
import { type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmShipmentsStore, type ScmShipment } from "@/shared/data/scm/scm-shipments-store"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)

export default function ShipmentReportPage() {
    const shipments = useScmShipmentsStore((s) => s.shipments)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)

    const columns: DataTableColumn<ScmShipment>[] = useMemo(
        () => [
            { key: "shipmentId", header: "Shipment", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.shipmentId}</span> },
            { key: "orderNumber", header: "Order", width: "110px", sortable: true },
            { key: "customerName", header: "Customer", sortable: true },
            { key: "warehouse", header: "Warehouse", sortable: true, width: "180px" },
            { key: "courierPartner", header: "Courier", sortable: true, width: "150px" },
            { key: "pickupDate", header: "Pickup", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.pickupDate}</span> },
            { key: "expectedDelivery", header: "ETA", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.expectedDelivery}</span> },
            { key: "shippingCharges", header: "Charges", width: "110px", align: "right", sortable: true, accessor: (r) => r.shippingCharges, render: (r) => <span className="tabular-nums">{formatINR(r.shippingCharges)}</span> },
            { key: "status", header: "Status", width: "130px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const applyFilters = (rs: ScmShipment[], f: ReportFilters) => rs.filter((r) => {
        if (f.warehouse !== "all" && r.warehouse !== f.warehouse) return false
        if (f.fromDate && r.pickupDate < f.fromDate) return false
        if (f.toDate && r.pickupDate > f.toDate) return false
        return true
    })

    return (
        <ReportShell
            title="Shipment Report"
            description="Logistics, delivery performance, and courier-wise activity."
            accentColor="#8b5cf6"
            columns={columns}
            rows={shipments}
            rowKey={(r) => r.id}
            csvFilename="scm-shipment-report"
            csvHeaders={["Shipment", "Order", "Customer", "Warehouse", "Courier", "Tracking", "Weight (kg)", "Charges", "Pickup", "ETA", "Delivered", "Status"]}
            csvRow={(r) => [r.shipmentId, r.orderNumber, r.customerName, r.warehouse, r.courierPartner, r.trackingNumber, r.packageWeight, r.shippingCharges, r.pickupDate, r.expectedDelivery, r.actualDelivery ?? "", r.status]}
            filterOptions={{ warehouses: warehouses.map((w) => w.warehouseName) }}
            applyFilters={applyFilters}
        />
    )
}
