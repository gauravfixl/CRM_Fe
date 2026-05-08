"use client"

import * as React from "react"
import { useMemo } from "react"
import { ReportShell } from "@/shared/components/scm/shared/ReportShell"
import { type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { Progress } from "@/shared/components/ui/progress"
import { useScmWarehousesStore, type ScmWarehouse } from "@/shared/data/scm/scm-warehouses-store"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"

interface WhRow extends ScmWarehouse {
    productCount: number
}

export default function WarehouseReportPage() {
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const products = useScmProductsStore((s) => s.products)

    const rows: WhRow[] = useMemo(
        () =>
            warehouses.map((w) => ({
                ...w,
                productCount: products.filter((p) => p.warehouse === w.warehouseName).length,
            })),
        [warehouses, products]
    )

    const columns: DataTableColumn<WhRow>[] = useMemo(
        () => [
            { key: "warehouseCode", header: "Code", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.warehouseCode}</span> },
            { key: "warehouseName", header: "Name", sortable: true },
            { key: "city", header: "Location", sortable: true, width: "180px", accessor: (r) => `${r.city}, ${r.state}`, render: (r) => `${r.city}, ${r.state}` },
            { key: "managerName", header: "Manager", sortable: true, width: "180px" },
            { key: "productCount", header: "Products", width: "100px", align: "right", sortable: true, accessor: (r) => r.productCount, render: (r) => <span className="tabular-nums">{r.productCount}</span> },
            {
                key: "utilization",
                header: "Utilization",
                width: "200px",
                accessor: (r) => (r.storageCapacity ? r.currentUtilization / r.storageCapacity : 0),
                sortable: true,
                render: (r) => {
                    const pct = r.storageCapacity ? Math.round((r.currentUtilization / r.storageCapacity) * 100) : 0
                    return (
                        <div>
                            <div className="flex items-center justify-between text-[11.5px] text-[#64748B] mb-0.5">
                                <span className="tabular-nums">{r.currentUtilization.toLocaleString()} / {r.storageCapacity.toLocaleString()}</span>
                                <span className="font-semibold text-[#0F172A] tabular-nums">{pct}%</span>
                            </div>
                            <Progress value={pct} className="h-1.5" />
                        </div>
                    )
                },
            },
            { key: "status", header: "Status", width: "100px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    return (
        <ReportShell
            title="Warehouse Report"
            description="Capacity utilization, product counts, and warehouse performance."
            accentColor="#0ea5e9"
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            csvFilename="scm-warehouse-report"
            csvHeaders={["Code", "Name", "City", "State", "Manager", "Products", "Capacity", "Utilization", "Utilization %", "Status"]}
            csvRow={(r) => [r.warehouseCode, r.warehouseName, r.city, r.state, r.managerName, r.productCount, r.storageCapacity, r.currentUtilization, r.storageCapacity ? Math.round((r.currentUtilization / r.storageCapacity) * 100) : 0, r.status]}
        />
    )
}
