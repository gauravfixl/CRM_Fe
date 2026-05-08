"use client"

import * as React from "react"
import { useMemo } from "react"
import { Download } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmShipmentsStore, type ScmShipment, type ShipmentStatus } from "@/shared/data/scm/scm-shipments-store"

interface Props {
    title: string
    description: string
    icon?: React.ReactNode
    iconColor?: string
    statuses: ShipmentStatus[]
    extraAction?: (row: ScmShipment) => React.ReactNode
}

export function ShipmentFilterView({ title, description, icon, iconColor = "#8b5cf6", statuses, extraAction }: Props) {
    const { toast } = useToast()
    const shipments = useScmShipmentsStore((s) => s.shipments)

    const filtered = useMemo(() => shipments.filter((s) => statuses.includes(s.status)), [shipments, statuses])

    const formatINR = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)

    const columns: DataTableColumn<ScmShipment>[] = useMemo(
        () => [
            { key: "shipmentId", header: "Shipment", width: "110px", sortable: true, render: (r) => <span className="font-semibold">{r.shipmentId}</span> },
            { key: "orderNumber", header: "Order", width: "110px", sortable: true },
            {
                key: "customerName", header: "Customer", sortable: true,
                render: (r) => (
                    <div><p className="font-medium text-[#0F172A]">{r.customerName}</p><p className="text-[11.5px] text-[#94A3B8] truncate">{r.warehouse}</p></div>
                ),
            },
            {
                key: "courier", header: "Courier", sortable: true, width: "180px",
                render: (r) => (
                    <div><p className="font-medium text-[#0F172A]">{r.courierPartner}</p><p className="text-[11.5px] text-[#94A3B8] truncate">{r.trackingNumber || "—"}</p></div>
                ),
            },
            { key: "pickupDate", header: "Pickup", width: "110px", render: (r) => <span className="tabular-nums">{r.pickupDate}</span> },
            { key: "expectedDelivery", header: "ETA", width: "110px", render: (r) => <span className="tabular-nums">{r.expectedDelivery}</span> },
            { key: "shippingCharges", header: "Charges", width: "110px", align: "right", accessor: (r) => r.shippingCharges, render: (r) => <span className="tabular-nums">{formatINR(r.shippingCharges)}</span> },
            { key: "status", header: "Status", width: "130px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleExport = () => {
        if (filtered.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Shipment", "Order", "Customer", "Warehouse", "Courier", "Tracking", "Pickup", "ETA", "Charges", "Status"]
        const rows = filtered.map((s) => [s.shipmentId, s.orderNumber, s.customerName, s.warehouse, s.courierPartner, s.trackingNumber, s.pickupDate, s.expectedDelivery, s.shippingCharges, s.status])
        const escape = (v: any) => { const x = String(v ?? ""); return /[",\n]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-shipments-${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} shipments exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        {icon && <span style={{ color: iconColor }}>{icon}</span>} {title}
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">{description}</p>
                </div>
                <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                    <Download className="w-4 h-4 mr-1.5" /> Export
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={filtered}
                rowKey={(r) => r.id}
                searchPlaceholder="Search shipments..."
                searchKeys={["shipmentId", "orderNumber", "customerName", "courierPartner", "trackingNumber"]}
                pageSize={15}
                emptyMessage="No shipments in this status."
                actions={extraAction}
            />
        </div>
    )
}
