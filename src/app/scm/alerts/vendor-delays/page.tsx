"use client"

import * as React from "react"
import { useMemo } from "react"
import { Users } from "lucide-react"
import { AlertCenter, type AlertItem } from "@/shared/components/scm/shared/AlertCenter"
import { useScmPurchaseOrdersStore } from "@/shared/data/scm/scm-purchase-orders-store"

const today = new Date().toISOString().slice(0, 10)

export default function VendorDelayAlertsPage() {
    const pos = useScmPurchaseOrdersStore((s) => s.purchaseOrders)

    const items: AlertItem[] = useMemo(
        () =>
            pos
                .filter((p) => p.deliveryStatus === "Delayed" || (p.deliveryStatus !== "Delivered" && p.expectedDelivery < today))
                .map((p) => ({
                    id: `vd_${p.id}`,
                    title: `${p.vendorName} delivery is delayed`,
                    description: `PO ${p.poNumber} expected on ${p.expectedDelivery} · Status: ${p.deliveryStatus}`,
                    priority: p.totalAmount >= 100000 ? "High" : "Medium",
                    createdDate: p.expectedDelivery,
                    assignedTo: p.vendorName,
                    relatedHref: "/scm/procurement/purchase-orders",
                    relatedLabel: "Open PO",
                })),
        [pos]
    )

    return (
        <AlertCenter
            title="Vendor Delay Alerts"
            subtitle="Purchase orders where vendors have missed their delivery commitments."
            icon={<Users className="w-4 h-4" />}
            accentColor="#8b5cf6"
            items={items}
            emptyMessage="No vendor delays at the moment."
        />
    )
}
