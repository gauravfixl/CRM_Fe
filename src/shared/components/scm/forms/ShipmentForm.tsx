"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Truck } from "lucide-react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"
import { useScmSalesOrdersStore } from "@/shared/data/scm/scm-sales-orders-store"
import {
    useScmShipmentsStore,
    SHIPMENT_STATUSES,
    COURIER_PARTNERS,
    type ScmShipment,
    type ShipmentStatus,
} from "@/shared/data/scm/scm-shipments-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    shipmentId: string
    orderNumber: string
    customerName: string
    customerAddress: string
    warehouse: string
    courierPartner: string
    trackingNumber: string
    packageWeight: string
    packageDimensions: string
    shippingCharges: string
    pickupDate: string
    expectedDelivery: string
    status: ShipmentStatus
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)
const empty: FormShape = {
    shipmentId: "",
    orderNumber: "",
    customerName: "",
    customerAddress: "",
    warehouse: "",
    courierPartner: "",
    trackingNumber: "",
    packageWeight: "",
    packageDimensions: "",
    shippingCharges: "0",
    pickupDate: todayStr(),
    expectedDelivery: "",
    status: "Pending",
    remarks: "",
}

const REQUIRED: Array<keyof FormShape> = [
    "shipmentId", "orderNumber", "customerName", "customerAddress",
    "warehouse", "courierPartner", "packageWeight",
    "pickupDate", "expectedDelivery", "status",
]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmShipment | null
    mode: "create" | "edit"
}

export function ShipmentForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const salesOrders = useScmSalesOrdersStore((s) => s.salesOrders)
    const addShipment = useScmShipmentsStore((s) => s.addShipment)
    const updateShipment = useScmShipmentsStore((s) => s.updateShipment)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                shipmentId: initial.shipmentId,
                orderNumber: initial.orderNumber,
                customerName: initial.customerName,
                customerAddress: initial.customerAddress,
                warehouse: initial.warehouse,
                courierPartner: initial.courierPartner,
                trackingNumber: initial.trackingNumber,
                packageWeight: String(initial.packageWeight),
                packageDimensions: initial.packageDimensions,
                shippingCharges: String(initial.shippingCharges),
                pickupDate: initial.pickupDate,
                expectedDelivery: initial.expectedDelivery,
                status: initial.status,
                remarks: initial.remarks,
            })
        } else {
            setData(empty)
        }
        setErrors({}); setTouched({})
    }, [open, initial, mode])

    const setField = (name: keyof FormShape, value: string) => {
        setData((d) => ({ ...d, [name]: value as any }))
        if (touched[name]) {
            const err = validateField(name, value)
            setErrors((e) => ({ ...e, [name]: err ?? "" }))
        }
    }
    const onBlur = (name: keyof FormShape) => {
        setTouched((t) => ({ ...t, [name]: true }))
        const err = validateField(name, data[name])
        setErrors((e) => ({ ...e, [name]: err ?? "" }))
    }

    // Auto-fill customer/address from selected sales order
    const onOrderSelect = (orderNumber: string) => {
        setField("orderNumber", orderNumber)
        setTouched((t) => ({ ...t, orderNumber: true }))
        const so = salesOrders.find((s) => s.orderNumber === orderNumber)
        if (so) {
            setData((d) => ({
                ...d,
                orderNumber,
                customerName: so.customerName,
                customerAddress: so.customerAddress,
                warehouse: so.warehouse,
            }))
        }
    }

    const validateAll = (): boolean => {
        const next: Record<string, string> = {}
        const fields = Object.keys(data) as Array<keyof FormShape>
        for (const f of fields) {
            const err = validateField(f, data[f])
            if (err) next[f] = err
        }
        for (const f of REQUIRED) {
            if (!next[f] && !String(data[f] ?? "").trim()) next[f] = "This field is required"
        }
        if (!next.packageWeight && Number(data.packageWeight) <= 0) {
            next.packageWeight = "Weight must be greater than 0"
        }
        setErrors(next)
        setTouched(Object.fromEntries(fields.map((f) => [f, true])))
        return Object.keys(next).length === 0
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateAll()) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" })
            return
        }
        setSubmitting(true)
        try {
            const payload = {
                shipmentId: data.shipmentId.trim().toUpperCase(),
                orderNumber: data.orderNumber.trim().toUpperCase(),
                customerName: data.customerName.trim(),
                customerAddress: data.customerAddress.trim(),
                warehouse: data.warehouse,
                courierPartner: data.courierPartner,
                trackingNumber: data.trackingNumber.trim(),
                packageWeight: Number(data.packageWeight),
                packageDimensions: data.packageDimensions.trim(),
                shippingCharges: Number(data.shippingCharges || 0),
                pickupDate: data.pickupDate,
                expectedDelivery: data.expectedDelivery,
                status: data.status,
                remarks: data.remarks.trim(),
                actualDelivery: data.status === "Delivered" ? todayStr() : initial?.actualDelivery,
            }
            if (mode === "edit" && initial) {
                updateShipment(initial.id, payload)
                toast({ title: "Shipment updated", description: payload.shipmentId })
            } else {
                addShipment(payload)
                toast({ title: "Shipment created", description: payload.shipmentId })
            }
            onOpenChange(false)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Shipment" : "Create Shipment"}
            description={mode === "edit" ? "Update shipment details and tracking." : "Schedule a new shipment for delivery."}
            icon={<Truck className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save Changes" : "Create Shipment"}
            width="lg"
            accentColor="#8b5cf6"
        >
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-3">Shipment</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Shipment ID" required error={touched.shipmentId ? errors.shipmentId : undefined}>
                    <Input value={data.shipmentId} onChange={(e) => setField("shipmentId", e.target.value.toUpperCase())} onBlur={() => onBlur("shipmentId")} placeholder="SH-9050" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Sales Order #" required error={touched.orderNumber ? errors.orderNumber : undefined}>
                    <Select value={data.orderNumber} onValueChange={onOrderSelect}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select order" /></SelectTrigger>
                        <SelectContent>
                            {salesOrders.map((s) => (
                                <SelectItem key={s.id} value={s.orderNumber}>
                                    {s.orderNumber} · {s.customerName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="Customer Name" required error={touched.customerName ? errors.customerName : undefined}>
                    <Input value={data.customerName} onChange={(e) => setField("customerName", e.target.value)} onBlur={() => onBlur("customerName")} placeholder="Acme Corp" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Warehouse" required error={touched.warehouse ? errors.warehouse : undefined}>
                    <Select value={data.warehouse} onValueChange={(v) => { setField("warehouse", v); setTouched((t) => ({ ...t, warehouse: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                        <SelectContent>
                            {warehouses.map((w) => (<SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="Customer Address" required error={touched.customerAddress ? errors.customerAddress : undefined} className="sm:col-span-2">
                    <Textarea value={data.customerAddress} onChange={(e) => setField("customerAddress", e.target.value)} onBlur={() => onBlur("customerAddress")} placeholder="Delivery address" rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>

            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-3 mt-6">Logistics</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Courier Partner" required error={touched.courierPartner ? errors.courierPartner : undefined}>
                    <Select value={data.courierPartner} onValueChange={(v) => { setField("courierPartner", v); setTouched((t) => ({ ...t, courierPartner: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select courier" /></SelectTrigger>
                        <SelectContent>
                            {COURIER_PARTNERS.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="Tracking Number" error={touched.trackingNumber ? errors.trackingNumber : undefined}>
                    <Input value={data.trackingNumber} onChange={(e) => setField("trackingNumber", e.target.value)} onBlur={() => onBlur("trackingNumber")} placeholder="DLV0019283746" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Package Weight (kg)" required error={touched.packageWeight ? errors.packageWeight : undefined}>
                    <Input type="number" min="0" step="0.01" value={data.packageWeight} onChange={(e) => setField("packageWeight", e.target.value)} onBlur={() => onBlur("packageWeight")} placeholder="0.00" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Package Dimensions" error={touched.packageDimensions ? errors.packageDimensions : undefined} hint="L×W×H in cm">
                    <Input value={data.packageDimensions} onChange={(e) => setField("packageDimensions", e.target.value)} onBlur={() => onBlur("packageDimensions")} placeholder="30×20×15 cm" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Shipping Charges (₹)" error={touched.shippingCharges ? errors.shippingCharges : undefined}>
                    <Input type="number" min="0" step="0.01" value={data.shippingCharges} onChange={(e) => setField("shippingCharges", e.target.value)} onBlur={() => onBlur("shippingCharges")} placeholder="0.00" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Status" required error={touched.status ? errors.status : undefined}>
                    <Select value={data.status} onValueChange={(v) => { setField("status", v as ShipmentStatus); setTouched((t) => ({ ...t, status: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{SHIPMENT_STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
                <Field label="Pickup Date" required error={touched.pickupDate ? errors.pickupDate : undefined}>
                    <Input type="date" value={data.pickupDate} onChange={(e) => setField("pickupDate", e.target.value)} onBlur={() => onBlur("pickupDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Expected Delivery" required error={touched.expectedDelivery ? errors.expectedDelivery : undefined}>
                    <Input type="date" value={data.expectedDelivery} onChange={(e) => setField("expectedDelivery", e.target.value)} onBlur={() => onBlur("expectedDelivery")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Remarks" error={touched.remarks ? errors.remarks : undefined} className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} onBlur={() => onBlur("remarks")} placeholder="Optional notes" rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
