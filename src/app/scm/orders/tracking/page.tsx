"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { Search, MapPin, Check, Clock } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { useScmSalesOrdersStore } from "@/shared/data/scm/scm-sales-orders-store"
import { useScmShipmentsStore } from "@/shared/data/scm/scm-shipments-store"

const TRACKING_STAGES = [
    "Order Placed",
    "Payment Confirmed",
    "Inventory Reserved",
    "Picked",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
] as const

const stageIndex = (orderStatus: string, paymentStatus: string, fulfillmentStatus: string, shipmentStatus?: string): number => {
    if (orderStatus === "Cancelled") return -1
    if (shipmentStatus === "Delivered" || fulfillmentStatus === "Delivered") return 7
    if (shipmentStatus === "Out for Delivery") return 6
    if (shipmentStatus === "In Transit" || shipmentStatus === "Picked Up" || fulfillmentStatus === "Shipped") return 5
    if (fulfillmentStatus === "Packed") return 4
    if (fulfillmentStatus === "Picked") return 3
    if (paymentStatus === "Paid" || paymentStatus === "Partial") return 2
    if (orderStatus === "Confirmed") return 1
    return 0
}

export default function OrderTrackingPage() {
    const orders = useScmSalesOrdersStore((s) => s.salesOrders)
    const shipments = useScmShipmentsStore((s) => s.shipments)

    const [selected, setSelected] = useState<string>(orders[0]?.orderNumber ?? "")
    const [search, setSearch] = useState("")

    const filteredList = useMemo(() => {
        const q = search.trim().toLowerCase()
        if (!q) return orders
        return orders.filter((o) =>
            o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
        )
    }, [orders, search])

    const order = useMemo(() => orders.find((o) => o.orderNumber === selected), [orders, selected])
    const shipment = useMemo(() => order ? shipments.find((s) => s.orderNumber === order.orderNumber) : null, [order, shipments])

    const currentStage = order ? stageIndex(order.status, order.paymentStatus, order.fulfillmentStatus, shipment?.status) : 0

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Order Tracking</h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">Track an order from placement to delivery.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm p-4 lg:col-span-1 max-h-[600px] overflow-y-auto">
                    <div className="relative mb-3">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="pl-8 h-9 text-[13px] border-[#E5E7EB]" />
                    </div>
                    <ul className="space-y-1">
                        {filteredList.map((o) => (
                            <li key={o.id}>
                                <button
                                    onClick={() => setSelected(o.orderNumber)}
                                    className={`w-full text-left p-2.5 rounded-lg border transition-colors ${selected === o.orderNumber ? "bg-blue-50 border-blue-200" : "border-transparent hover:bg-slate-50"}`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-semibold text-[13px] text-[#0F172A]">{o.orderNumber}</span>
                                        <StatusBadge status={o.fulfillmentStatus} />
                                    </div>
                                    <p className="text-[12px] text-[#64748B] mt-0.5 truncate">{o.customerName}</p>
                                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{o.orderDate}</p>
                                </button>
                            </li>
                        ))}
                        {filteredList.length === 0 && (
                            <li className="text-[13px] text-[#94A3B8] py-4 text-center">No orders match.</li>
                        )}
                    </ul>
                </div>

                <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm p-5 lg:col-span-2">
                    {order ? (
                        <>
                            <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                    <h3 className="text-[18px] font-semibold text-[#0F172A]">{order.orderNumber}</h3>
                                    <p className="text-[13px] text-[#64748B] mt-0.5">{order.customerName} · {order.customerEmail}</p>
                                </div>
                                <StatusBadge status={order.fulfillmentStatus} />
                            </div>

                            {currentStage === -1 ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-[13px] text-red-700">
                                    This order has been cancelled and is no longer tracked.
                                </div>
                            ) : (
                                <ol className="relative border-l-2 border-slate-200 ml-3 mt-6 space-y-4">
                                    {TRACKING_STAGES.map((stage, idx) => {
                                        const reached = idx <= currentStage
                                        const isCurrent = idx === currentStage
                                        return (
                                            <li key={stage} className="ml-6">
                                                <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-white ${reached ? "bg-emerald-500" : "bg-slate-200"}`}>
                                                    {reached ? <Check className="w-3 h-3 text-white" /> : <Clock className="w-3 h-3 text-slate-400" />}
                                                </span>
                                                <p className={`text-[13.5px] font-semibold ${isCurrent ? "text-blue-600" : reached ? "text-[#0F172A]" : "text-[#94A3B8]"}`}>
                                                    {stage}
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-[12px] text-[#64748B] mt-0.5">Current stage</p>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ol>
                            )}

                            {shipment && (
                                <div className="mt-6 bg-[#F8FAFC] rounded-lg p-4 text-[13px]">
                                    <p className="font-semibold text-[#0F172A] inline-flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#8b5cf6]" /> Shipment Details
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 mt-3">
                                        <Cell label="Shipment ID" value={shipment.shipmentId} />
                                        <Cell label="Courier" value={shipment.courierPartner} />
                                        <Cell label="Tracking" value={shipment.trackingNumber || "—"} />
                                        <Cell label="ETA" value={shipment.expectedDelivery} />
                                        <Cell label="Pickup" value={shipment.pickupDate} />
                                        <Cell label="Status" value={<StatusBadge status={shipment.status} />} />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-[#94A3B8] text-[13px] text-center py-12">Select an order from the left to view tracking details.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

function Cell({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <dt className="text-[11px] uppercase tracking-wide font-semibold text-[#94A3B8]">{label}</dt>
            <dd className="mt-0.5 text-[13px] text-[#0F172A] font-medium">{value}</dd>
        </div>
    )
}
