"use client"

import * as React from "react"
import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Download, Truck } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { ShipmentForm } from "@/shared/components/scm/forms/ShipmentForm"
import { SideFormSheet } from "@/shared/components/ui/side-form-sheet"
import {
    useScmShipmentsStore,
    type ScmShipment,
} from "@/shared/data/scm/scm-shipments-store"

export default function ShipmentsListPage() {
    return (
        <Suspense fallback={null}>
            <ShipmentsListPageInner />
        </Suspense>
    )
}

function ShipmentsListPageInner() {
    const { toast } = useToast()
    const router = useRouter()
    const searchParams = useSearchParams()
    const shipments = useScmShipmentsStore((s) => s.shipments)
    const deleteShipment = useScmShipmentsStore((s) => s.deleteShipment)

    const [formOpen, setFormOpen] = useState(false)
    const [formMode, setFormMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmShipment | null>(null)
    const [viewing, setViewing] = useState<ScmShipment | null>(null)
    const [deleting, setDeleting] = useState<ScmShipment | null>(null)

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setEditing(null)
            setFormMode("create")
            setFormOpen(true)
            router.replace("/scm/shipments/list", { scroll: false })
        }
    }, [searchParams, router])

    const formatINR = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)

    const columns = useMemo<DataTableColumn<ScmShipment>[]>(
        () => [
            { key: "shipmentId", header: "Shipment", width: "110px", sortable: true, render: (r) => <span className="font-semibold text-[#0F172A]">{r.shipmentId}</span> },
            { key: "orderNumber", header: "Order #", width: "110px", sortable: true },
            {
                key: "customerName",
                header: "Customer",
                sortable: true,
                render: (r) => (
                    <div className="min-w-0">
                        <p className="font-medium text-[#0F172A] truncate">{r.customerName}</p>
                        <p className="text-[11.5px] text-[#94A3B8] truncate">{r.warehouse}</p>
                    </div>
                ),
            },
            {
                key: "courierPartner",
                header: "Courier",
                sortable: true,
                width: "180px",
                render: (r) => (
                    <div className="min-w-0">
                        <p className="font-medium text-[#0F172A] truncate">{r.courierPartner}</p>
                        <p className="text-[11.5px] text-[#94A3B8] truncate">{r.trackingNumber || "—"}</p>
                    </div>
                ),
            },
            { key: "pickupDate", header: "Pickup", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.pickupDate}</span> },
            { key: "expectedDelivery", header: "ETA", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.expectedDelivery}</span> },
            {
                key: "shippingCharges",
                header: "Charges",
                width: "110px",
                align: "right",
                sortable: true,
                accessor: (r) => r.shippingCharges,
                render: (r) => <span className="tabular-nums">{formatINR(r.shippingCharges)}</span>,
            },
            { key: "status", header: "Status", width: "130px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setFormMode("create"); setFormOpen(true) }
    const handleEdit = (s: ScmShipment) => { setEditing(s); setFormMode("edit"); setFormOpen(true) }
    const confirmDelete = () => {
        if (!deleting) return
        deleteShipment(deleting.id)
        toast({ title: "Shipment deleted", description: deleting.shipmentId })
        setDeleting(null)
    }
    const handleExport = () => {
        if (shipments.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Shipment", "Order", "Customer", "Address", "Warehouse", "Courier", "Tracking", "Weight", "Dimensions", "Charges", "Pickup", "ETA", "Delivered", "Status", "Remarks"]
        const rows = shipments.map((s) => [s.shipmentId, s.orderNumber, s.customerName, s.customerAddress, s.warehouse, s.courierPartner, s.trackingNumber, s.packageWeight, s.packageDimensions, s.shippingCharges, s.pickupDate, s.expectedDelivery, s.actualDelivery ?? "", s.status, s.remarks])
        const escape = (v: any) => { const x = String(v ?? ""); return /[",\n]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-shipments-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} shipments exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Shipments</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Track logistics, couriers, and delivery status.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#8b5cf6", boxShadow: "0 4px 12px #8b5cf633" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> Create Shipment
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={shipments}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by shipment, order, customer, courier, tracking..."
                searchKeys={["shipmentId", "orderNumber", "customerName", "courierPartner", "trackingNumber", "warehouse", "status"]}
                pageSize={10}
                emptyMessage="No shipments yet."
                actions={(row) => (
                    <RowActions
                        onView={() => setViewing(row)}
                        onEdit={() => handleEdit(row)}
                        onDelete={() => setDeleting(row)}
                    />
                )}
            />

            <ShipmentForm open={formOpen} onOpenChange={setFormOpen} initial={editing} mode={formMode} />

            <SideFormSheet
                open={!!viewing}
                onOpenChange={(o) => !o && setViewing(null)}
                title={viewing?.shipmentId ?? "Shipment"}
                description={viewing ? `Order ${viewing.orderNumber} · ${viewing.courierPartner}` : undefined}
                icon={<Truck className="w-5 h-5" />}
                hideFooter
                width="md"
                accentColor="#8b5cf6"
            >
                {viewing && (
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                        <Cell label="Status" value={<StatusBadge status={viewing.status} />} />
                        <Cell label="Customer" value={viewing.customerName} />
                        <Cell label="Warehouse" value={viewing.warehouse} />
                        <Cell label="Courier" value={viewing.courierPartner} />
                        <Cell label="Tracking #" value={viewing.trackingNumber || "—"} />
                        <Cell label="Weight" value={`${viewing.packageWeight} kg`} />
                        <Cell label="Dimensions" value={viewing.packageDimensions || "—"} />
                        <Cell label="Charges" value={formatINR(viewing.shippingCharges)} />
                        <Cell label="Pickup Date" value={viewing.pickupDate} />
                        <Cell label="Expected Delivery" value={viewing.expectedDelivery} />
                        <Cell label="Actual Delivery" value={viewing.actualDelivery || "—"} />
                        <Cell label="Created" value={viewing.createdAt} />
                        <div className="col-span-2">
                            <dt className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">Address</dt>
                            <dd className="mt-0.5 text-[13px] text-[#0F172A] font-medium whitespace-pre-wrap">{viewing.customerAddress}</dd>
                        </div>
                        {viewing.remarks && (
                            <div className="col-span-2">
                                <dt className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">Remarks</dt>
                                <dd className="mt-0.5 text-[13px] text-[#0F172A] whitespace-pre-wrap">{viewing.remarks}</dd>
                            </div>
                        )}
                    </dl>
                )}
            </SideFormSheet>

            <DeleteConfirmDialog
                open={!!deleting}
                onOpenChange={(o) => !o && setDeleting(null)}
                title="Delete this shipment?"
                itemLabel={deleting ? `${deleting.shipmentId} (${deleting.orderNumber})` : ""}
                onConfirm={confirmDelete}
            />
        </div>
    )
}

function Cell({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <dt className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">{label}</dt>
            <dd className="mt-0.5 text-[13px] text-[#0F172A] font-medium">{value}</dd>
        </div>
    )
}
