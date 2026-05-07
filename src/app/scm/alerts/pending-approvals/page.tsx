"use client"

import * as React from "react"
import { useMemo } from "react"
import { GitBranch } from "lucide-react"
import { AlertCenter, type AlertItem } from "@/shared/components/scm/shared/AlertCenter"
import { useScmProcurementExtraStore } from "@/shared/data/scm/scm-procurement-extra-store"
import { useScmPurchaseOrdersStore } from "@/shared/data/scm/scm-purchase-orders-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

export default function PendingApprovalsAlertsPage() {
    const purchaseRequests = useScmProcurementExtraStore((s) => s.purchaseRequests)
    const purchaseOrders = useScmPurchaseOrdersStore((s) => s.purchaseOrders)

    const items: AlertItem[] = useMemo(() => {
        const fromPR: AlertItem[] = purchaseRequests
            .filter((p) => p.status === "Submitted")
            .map((p) => ({
                id: `pr_${p.id}`,
                title: `Purchase Request ${p.requestNumber} awaits approval`,
                description: `${p.requestedBy} (${p.department}) · ${p.quantity} × ${p.productName} · Required by ${p.requiredDate}`,
                priority: p.priority === "Urgent" ? "Critical" : p.priority === "High" ? "High" : p.priority === "Medium" ? "Medium" : "Low",
                createdDate: p.createdAt,
                relatedHref: "/scm/procurement/approvals",
                relatedLabel: "Review",
            }))
        const fromPO: AlertItem[] = purchaseOrders
            .filter((p) => p.status === "Pending" || p.status === "Draft")
            .map((p) => ({
                id: `po_${p.id}`,
                title: `Purchase Order ${p.poNumber} awaits approval`,
                description: `Vendor: ${p.vendorName} · Total: ${formatINR(p.totalAmount)} · Items: ${p.items.length}`,
                priority: p.totalAmount >= 100000 ? "High" : "Medium",
                createdDate: p.orderDate,
                relatedHref: "/scm/procurement/approvals",
                relatedLabel: "Review",
            }))
        return [...fromPR, ...fromPO]
    }, [purchaseRequests, purchaseOrders])

    return (
        <AlertCenter
            title="Pending Approval Alerts"
            subtitle="Purchase requests and orders waiting for your approval."
            icon={<GitBranch className="w-4 h-4" />}
            accentColor="#f59e0b"
            items={items}
            emptyMessage="Nothing awaiting approval."
        />
    )
}
