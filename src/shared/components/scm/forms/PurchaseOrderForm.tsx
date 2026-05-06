"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { ShoppingCart, Plus, Trash2 } from "lucide-react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"
import { useScmVendorsStore, PAYMENT_TERMS } from "@/shared/data/scm/scm-vendors-store"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"
import {
    useScmPurchaseOrdersStore,
    PO_STATUSES,
    PO_PAYMENT_STATUSES,
    PO_DELIVERY_STATUSES,
    SHIPPING_TERMS,
    type ScmPurchaseOrder,
    type POLineItem,
    type POStatus,
    type POPaymentStatus,
    type PODeliveryStatus,
} from "@/shared/data/scm/scm-purchase-orders-store"
import { validateField } from "@/shared/components/scm/shared/validation"

interface LineRow extends POLineItem {
    rowId: string
}

type FormShape = {
    poNumber: string
    vendorId: string
    warehouse: string
    orderDate: string
    expectedDelivery: string
    paymentTerms: string
    shippingTerms: string
    status: POStatus
    paymentStatus: POPaymentStatus
    deliveryStatus: PODeliveryStatus
    discount: string
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)

const empty: FormShape = {
    poNumber: "",
    vendorId: "",
    warehouse: "",
    orderDate: todayStr(),
    expectedDelivery: "",
    paymentTerms: "Net 30",
    shippingTerms: "FOB Origin",
    status: "Draft",
    paymentStatus: "Unpaid",
    deliveryStatus: "Pending",
    discount: "0",
    remarks: "",
}

const REQUIRED: Array<keyof FormShape> = [
    "poNumber", "vendorId", "warehouse", "orderDate", "expectedDelivery",
    "paymentTerms", "shippingTerms", "status",
]

const newLineRow = (): LineRow => ({
    rowId: Math.random().toString(36).slice(2, 9),
    productId: "",
    productName: "",
    sku: "",
    quantity: 1,
    unitPrice: 0,
    taxRate: 0,
})

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmPurchaseOrder | null
    mode: "create" | "edit"
}

export function PurchaseOrderForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const vendors = useScmVendorsStore((s) => s.vendors)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const addPO = useScmPurchaseOrdersStore((s) => s.addPO)
    const updatePO = useScmPurchaseOrdersStore((s) => s.updatePO)

    const [data, setData] = useState<FormShape>(empty)
    const [items, setItems] = useState<LineRow[]>([newLineRow()])
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)
    const [itemError, setItemError] = useState<string>("")

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                poNumber: initial.poNumber,
                vendorId: initial.vendorId,
                warehouse: initial.warehouse,
                orderDate: initial.orderDate,
                expectedDelivery: initial.expectedDelivery,
                paymentTerms: initial.paymentTerms,
                shippingTerms: initial.shippingTerms,
                status: initial.status,
                paymentStatus: initial.paymentStatus,
                deliveryStatus: initial.deliveryStatus,
                discount: String(initial.discount),
                remarks: initial.remarks,
            })
            setItems(
                initial.items.map((it) => ({
                    rowId: Math.random().toString(36).slice(2, 9),
                    ...it,
                }))
            )
        } else {
            setData(empty)
            setItems([newLineRow()])
        }
        setErrors({})
        setTouched({})
        setItemError("")
    }, [open, initial, mode])

    const totals = useMemo(() => {
        const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0)
        const tax = items.reduce((s, it) => s + (it.quantity * it.unitPrice * it.taxRate) / 100, 0)
        const discount = Number(data.discount) || 0
        return {
            subtotal,
            tax,
            discount,
            total: Math.max(0, subtotal + tax - discount),
        }
    }, [items, data.discount])

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

    const setItemField = (rowId: string, key: keyof LineRow, value: any) => {
        setItems((rows) =>
            rows.map((r) => {
                if (r.rowId !== rowId) return r
                if (key === "productId") {
                    const product = products.find((p) => p.id === value)
                    return {
                        ...r,
                        productId: value,
                        productName: product?.productName ?? "",
                        sku: product?.sku ?? "",
                        unitPrice: r.unitPrice || product?.purchasePrice || 0,
                        taxRate: r.taxRate || product?.taxRate || 0,
                    }
                }
                return { ...r, [key]: value }
            })
        )
    }

    const addItem = () => setItems((rows) => [...rows, newLineRow()])
    const removeItem = (rowId: string) => {
        setItems((rows) => (rows.length > 1 ? rows.filter((r) => r.rowId !== rowId) : rows))
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
        setErrors(next)
        setTouched(Object.fromEntries(fields.map((f) => [f, true])))

        let lineError = ""
        if (items.length === 0) lineError = "Add at least one line item"
        else {
            for (const it of items) {
                if (!it.productId) { lineError = "Select a product for every line item"; break }
                if (it.quantity <= 0) { lineError = "Each line item must have quantity > 0"; break }
                if (it.unitPrice < 0) { lineError = "Unit price cannot be negative"; break }
            }
        }
        setItemError(lineError)

        return Object.keys(next).length === 0 && !lineError
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateAll()) {
            toast({ title: "Please fix the highlighted issues", variant: "destructive" })
            return
        }
        setSubmitting(true)
        try {
            const vendor = vendors.find((v) => v.id === data.vendorId)
            const lineItems: POLineItem[] = items.map(({ rowId, ...rest }) => rest)
            const payload = {
                poNumber: data.poNumber.trim().toUpperCase(),
                vendorId: data.vendorId,
                vendorName: vendor?.vendorName ?? "",
                warehouse: data.warehouse,
                orderDate: data.orderDate,
                expectedDelivery: data.expectedDelivery,
                items: lineItems,
                subtotal: totals.subtotal,
                taxAmount: totals.tax,
                discount: totals.discount,
                totalAmount: totals.total,
                paymentTerms: data.paymentTerms,
                shippingTerms: data.shippingTerms,
                status: data.status,
                paymentStatus: data.paymentStatus,
                deliveryStatus: data.deliveryStatus,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && initial) {
                updatePO(initial.id, payload)
                toast({ title: "Purchase Order updated", description: payload.poNumber })
            } else {
                addPO(payload)
                toast({ title: "Purchase Order created", description: payload.poNumber })
            }
            onOpenChange(false)
        } finally {
            setSubmitting(false)
        }
    }

    const formatINR = (n: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Purchase Order" : "Create Purchase Order"}
            description={mode === "edit" ? "Update PO details and line items." : "Issue a new purchase order to a vendor."}
            icon={<ShoppingCart className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save Changes" : "Create PO"}
            width="xl"
            accentColor="#10b981"
        >
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-3">Header</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="PO Number" required error={touched.poNumber ? errors.poNumber : undefined}>
                    <Input value={data.poNumber} onChange={(e) => setField("poNumber", e.target.value.toUpperCase())} onBlur={() => onBlur("poNumber")} placeholder="PO-2090" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Vendor" required error={touched.vendorId ? errors.vendorId : undefined}>
                    <Select value={data.vendorId} onValueChange={(v) => { setField("vendorId", v); setTouched((t) => ({ ...t, vendorId: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                        <SelectContent>
                            {vendors.map((v) => (<SelectItem key={v.id} value={v.id}>{v.vendorName}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="Warehouse" required error={touched.warehouse ? errors.warehouse : undefined}>
                    <Select value={data.warehouse} onValueChange={(v) => { setField("warehouse", v); setTouched((t) => ({ ...t, warehouse: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                        <SelectContent>
                            {warehouses.map((w) => (<SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="Order Date" required error={touched.orderDate ? errors.orderDate : undefined}>
                    <Input type="date" value={data.orderDate} onChange={(e) => setField("orderDate", e.target.value)} onBlur={() => onBlur("orderDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Expected Delivery" required error={touched.expectedDelivery ? errors.expectedDelivery : undefined}>
                    <Input type="date" value={data.expectedDelivery} onChange={(e) => setField("expectedDelivery", e.target.value)} onBlur={() => onBlur("expectedDelivery")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Payment Terms" required error={touched.paymentTerms ? errors.paymentTerms : undefined}>
                    <Select value={data.paymentTerms} onValueChange={(v) => { setField("paymentTerms", v); setTouched((t) => ({ ...t, paymentTerms: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{PAYMENT_TERMS.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
                <Field label="Shipping Terms" required error={touched.shippingTerms ? errors.shippingTerms : undefined}>
                    <Select value={data.shippingTerms} onValueChange={(v) => { setField("shippingTerms", v); setTouched((t) => ({ ...t, shippingTerms: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{SHIPPING_TERMS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
                <Field label="Approval Status" required error={touched.status ? errors.status : undefined}>
                    <Select value={data.status} onValueChange={(v) => { setField("status", v as POStatus); setTouched((t) => ({ ...t, status: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{PO_STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
                <Field label="Payment Status">
                    <Select value={data.paymentStatus} onValueChange={(v) => setField("paymentStatus", v as POPaymentStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{PO_PAYMENT_STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
                <Field label="Delivery Status">
                    <Select value={data.deliveryStatus} onValueChange={(v) => setField("deliveryStatus", v as PODeliveryStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{PO_DELIVERY_STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
            </div>

            <div className="flex items-center justify-between mt-6 mb-3">
                <h4 className="text-[12px] font-semibold uppercase tracking-wide text-[#64748B]">Line Items</h4>
                <Button type="button" variant="outline" size="sm" onClick={addItem} className="h-8 text-[12px] border-[#E5E7EB]">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
                </Button>
            </div>

            <div className="space-y-2">
                {items.map((it) => (
                    <div key={it.rowId} className="grid grid-cols-12 gap-2 items-start bg-[#FAFBFC] border border-[#EEF1F6] rounded-lg p-2.5">
                        <div className="col-span-12 sm:col-span-5">
                            <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide">Product</label>
                            <Select value={it.productId} onValueChange={(v) => setItemField(it.rowId, "productId", v)}>
                                <SelectTrigger className="h-9 border-[#E5E7EB] text-[12.5px] mt-1"><SelectValue placeholder="Select product" /></SelectTrigger>
                                <SelectContent>
                                    {products.map((p) => (<SelectItem key={p.id} value={p.id}>{p.sku} · {p.productName}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                            <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide">Qty</label>
                            <Input type="number" min="1" step="1" value={it.quantity} onChange={(e) => setItemField(it.rowId, "quantity", Number(e.target.value))} className="h-9 border-[#E5E7EB] text-[12.5px] mt-1 tabular-nums" />
                        </div>
                        <div className="col-span-4 sm:col-span-2">
                            <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide">Unit ₹</label>
                            <Input type="number" min="0" step="0.01" value={it.unitPrice} onChange={(e) => setItemField(it.rowId, "unitPrice", Number(e.target.value))} className="h-9 border-[#E5E7EB] text-[12.5px] mt-1 tabular-nums" />
                        </div>
                        <div className="col-span-3 sm:col-span-2">
                            <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide">Tax %</label>
                            <Input type="number" min="0" step="0.01" value={it.taxRate} onChange={(e) => setItemField(it.rowId, "taxRate", Number(e.target.value))} className="h-9 border-[#E5E7EB] text-[12.5px] mt-1 tabular-nums" />
                        </div>
                        <div className="col-span-1 flex items-end justify-end h-full">
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(it.rowId)} disabled={items.length <= 1} className="h-9 w-9 text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {itemError && <p className="text-[12px] text-red-600">{itemError}</p>}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Discount" hint="₹ flat discount">
                    <Input type="number" min="0" step="0.01" value={data.discount} onChange={(e) => setField("discount", e.target.value)} className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <div className="bg-[#F8FAFC] border border-[#EEF1F6] rounded-lg p-3 text-[13px] space-y-1.5">
                    <div className="flex items-center justify-between text-[#64748B]"><span>Subtotal</span><span className="tabular-nums font-medium text-[#0F172A]">{formatINR(totals.subtotal)}</span></div>
                    <div className="flex items-center justify-between text-[#64748B]"><span>Tax</span><span className="tabular-nums font-medium text-[#0F172A]">{formatINR(totals.tax)}</span></div>
                    <div className="flex items-center justify-between text-[#64748B]"><span>Discount</span><span className="tabular-nums font-medium text-[#0F172A]">− {formatINR(totals.discount)}</span></div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-[#EEF1F6]">
                        <span className="font-semibold text-[#0F172A]">Total</span>
                        <span className="text-[15px] font-semibold tabular-nums text-[#10b981]">{formatINR(totals.total)}</span>
                    </div>
                </div>
                <Field label="Remarks" className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} placeholder="Optional notes" rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
