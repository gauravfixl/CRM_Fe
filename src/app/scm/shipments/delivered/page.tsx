"use client"

import { CheckCircle2 } from "lucide-react"
import { ShipmentFilterView } from "@/shared/components/scm/shared/ShipmentFilterView"

export default function DeliveredShipmentsPage() {
    return (
        <ShipmentFilterView
            title="Delivered Shipments"
            description="Shipments successfully delivered to customers."
            icon={<CheckCircle2 className="w-5 h-5" />}
            iconColor="#10b981"
            statuses={["Delivered"]}
        />
    )
}
