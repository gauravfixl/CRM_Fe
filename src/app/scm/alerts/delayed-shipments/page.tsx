"use client"

import * as React from "react"
import { useMemo } from "react"
import { Truck } from "lucide-react"
import { AlertCenter, type AlertItem } from "@/shared/components/scm/shared/AlertCenter"
import { useScmShipmentsStore } from "@/shared/data/scm/scm-shipments-store"

export default function DelayedShipmentAlertsPage() {
    const shipments = useScmShipmentsStore((s) => s.shipments)

    const items: AlertItem[] = useMemo(
        () =>
            shipments
                .filter((s) => s.status === "Delayed")
                .map((s) => ({
                    id: `del_${s.id}`,
                    title: `Shipment ${s.shipmentId} is delayed`,
                    description: `Customer: ${s.customerName} · Courier: ${s.courierPartner} · Expected: ${s.expectedDelivery}`,
                    priority: "High",
                    createdDate: s.pickupDate,
                    assignedTo: s.courierPartner,
                    relatedHref: "/scm/shipments/delayed",
                    relatedLabel: "View shipment",
                })),
        [shipments]
    )

    return (
        <AlertCenter
            title="Delayed Shipment Alerts"
            subtitle="Shipments that have missed their expected delivery date."
            icon={<Truck className="w-4 h-4" />}
            accentColor="#ef4444"
            items={items}
            emptyMessage="All shipments are on schedule."
        />
    )
}
