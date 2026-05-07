"use client"

import * as React from "react"
import { useMemo } from "react"
import { CreditCard } from "lucide-react"
import { AlertCenter, type AlertItem } from "@/shared/components/scm/shared/AlertCenter"
import { useScmVendorExtraStore } from "@/shared/data/scm/scm-vendor-extra-store"
import { useScmPurchaseOrdersStore } from "@/shared/data/scm/scm-purchase-orders-store"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

export default function PaymentReminderAlertsPage() {
    const payments = useScmVendorExtraStore((s) => s.payments)
    const pos = useScmPurchaseOrdersStore((s) => s.purchaseOrders)

    const items: AlertItem[] = useMemo(() => {
        const fromPayments: AlertItem[] = payments
            .filter((p) => p.paymentStatus === "Pending" || p.paymentStatus === "Failed")
            .map((p) => ({
                id: `pay_${p.id}`,
                title: `${p.paymentStatus === "Failed" ? "Failed payment" : "Pending payment"} to ${p.vendorName}`,
                description: `${p.paymentId} · Invoice ${p.invoiceNumber} · Amount: ${formatINR(p.amount)} · Date: ${p.paymentDate}`,
                priority: p.paymentStatus === "Failed" ? "Critical" : p.amount >= 100000 ? "High" : "Medium",
                createdDate: p.paymentDate,
                assignedTo: p.vendorName,
                relatedHref: "/scm/vendors/payment-history",
                relatedLabel: "Open payment",
            }))
        const fromPOs: AlertItem[] = pos
            .filter((p) => p.paymentStatus === "Unpaid" && p.deliveryStatus === "Delivered")
            .map((p) => ({
                id: `po_pay_${p.id}`,
                title: `Payment due for PO ${p.poNumber}`,
                description: `Vendor: ${p.vendorName} · Amount: ${formatINR(p.totalAmount)} · Terms: ${p.paymentTerms}`,
                priority: p.totalAmount >= 100000 ? "High" : "Medium",
                createdDate: p.expectedDelivery,
                assignedTo: p.vendorName,
                relatedHref: "/scm/procurement/purchase-orders",
                relatedLabel: "Open PO",
            }))
        return [...fromPayments, ...fromPOs]
    }, [payments, pos])

    return (
        <AlertCenter
            title="Payment Reminder Alerts"
            subtitle="Outstanding vendor payments and overdue obligations."
            icon={<CreditCard className="w-4 h-4" />}
            accentColor="#10b981"
            items={items}
            emptyMessage="No pending payments. All vendors are settled."
        />
    )
}
