"use client"

import * as React from "react"
import { AlertTriangle, BellRing, PhoneCall, Calendar } from "lucide-react"
import { ShipmentFilterView } from "@/shared/components/scm/shared/ShipmentFilterView"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmShipmentsStore } from "@/shared/data/scm/scm-shipments-store"

export default function DelayedShipmentsPage() {
    const { toast } = useToast()
    const updateShipment = useScmShipmentsStore((s) => s.updateShipment)

    return (
        <ShipmentFilterView
            title="Delayed Shipments"
            description="Shipments that missed their expected delivery date."
            icon={<AlertTriangle className="w-5 h-5" />}
            iconColor="#ef4444"
            statuses={["Delayed"]}
            extraAction={(row) => (
                <div className="inline-flex items-center gap-1 justify-end">
                    <button onClick={() => toast({ title: "Customer notified", description: row.customerName })} className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-blue-50 text-blue-600" title="Notify customer">
                        <BellRing className="w-4 h-4" />
                    </button>
                    <button onClick={() => toast({ title: "Courier contacted", description: row.courierPartner })} className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-amber-50 text-amber-600" title="Contact courier">
                        <PhoneCall className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            const newDate = new Date()
                            newDate.setDate(newDate.getDate() + 3)
                            const next = newDate.toISOString().slice(0, 10)
                            updateShipment(row.id, { expectedDelivery: next, status: "In Transit" })
                            toast({ title: "Delivery rescheduled", description: `${row.shipmentId} → ${next}` })
                        }}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-emerald-50 text-emerald-600"
                        title="Reschedule"
                    >
                        <Calendar className="w-4 h-4" />
                    </button>
                </div>
            )}
        />
    )
}
