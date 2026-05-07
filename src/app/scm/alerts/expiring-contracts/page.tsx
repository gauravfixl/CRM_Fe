"use client"

import * as React from "react"
import { useMemo } from "react"
import { FileSignature } from "lucide-react"
import { AlertCenter, type AlertItem } from "@/shared/components/scm/shared/AlertCenter"
import { useScmVendorExtraStore } from "@/shared/data/scm/scm-vendor-extra-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

const daysUntil = (dateStr: string): number => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const target = new Date(dateStr); target.setHours(0, 0, 0, 0)
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export default function ExpiringContractsPage() {
    const contracts = useScmVendorExtraStore((s) => s.contracts)

    const items: AlertItem[] = useMemo(
        () =>
            contracts
                .filter((c) => c.status === "Expiring Soon" || c.status === "Expired" || (c.status === "Active" && daysUntil(c.contractEndDate) <= 60))
                .map((c) => {
                    const days = daysUntil(c.contractEndDate)
                    return {
                        id: `c_${c.id}`,
                        title: `Contract ${c.contractNumber} ${days < 0 ? "has expired" : `expires in ${days} day(s)`}`,
                        description: `Vendor: ${c.vendorName} · Value: ${formatINR(c.contractValue)} · End: ${c.contractEndDate}`,
                        priority: days < 0 ? "Critical" : days <= 15 ? "High" : days <= 30 ? "Medium" : "Low",
                        createdDate: c.renewalReminderDate,
                        assignedTo: c.vendorName,
                        relatedHref: "/scm/vendors/contracts",
                        relatedLabel: "Open contract",
                    } as AlertItem
                }),
        [contracts]
    )

    return (
        <AlertCenter
            title="Expiring Contract Alerts"
            subtitle="Vendor contracts that are nearing expiry or already expired."
            icon={<FileSignature className="w-4 h-4" />}
            accentColor="#f59e0b"
            items={items}
            emptyMessage="No contracts expiring soon."
        />
    )
}
