"use client"

import { Truck } from "lucide-react"
import { ShipmentFilterView } from "@/shared/components/scm/shared/ShipmentFilterView"

export default function InTransitShipmentsPage() {
    return (
        <ShipmentFilterView
            title="In-Transit Shipments"
            description="Shipments currently on the way to their destination."
            icon={<Truck className="w-5 h-5" />}
            iconColor="#2563eb"
            statuses={["Picked Up", "In Transit", "Reached Hub", "Out for Delivery"]}
        />
    )
}
