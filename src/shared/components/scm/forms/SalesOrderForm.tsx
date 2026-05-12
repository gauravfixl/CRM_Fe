"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { ClipboardList, Plus, Trash2 } from "lucide-react"
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
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"
import {
    useScmSalesOrdersStore,
    SO_STATUSES,
    SO_PAYMENT_STATUSES,
    SO_FULFILLMENT_STATUSES,
    type ScmSalesOrder,
    type SOLineItem,
    type SOStatus,
    type SOPaymentStatus,
    type SOFulfillmentStatus,
} from "@/shared/data/scm/scm-sales-orders-store"
import { validateField } from "@/shared/components/scm/shared/validation"

interface LineRow extends SOLineItem {
    rowId: string
}

type FormShape = {
    orderNumber: string
    customerName: string
    customerEmail: string
    customerPhone: string
    customerAddress: string
    warehouse: string
    orderDate: string
    discount: string
    status: SOStatus
    paymentStatus: SOPaymentStatus
    fulfillmentStatus: SOFulfillmentStatus
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)
const empty: FormShape = {
    orderNumber: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    warehouse: "",
    orderDate: todayStr(),
    discount: "0",
    status: "Draft",
    paymentStatus: "Unpaid",
    fulfillmentStatus: "Pending",
    remarks: "",
}

const REQUIRED: Array<keyof FormShape> = [
    "orderNumber", "customerName", "customerEmail", "customerPhone",
    "customerAddress", "warehouse", "orderDate", "status",
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
    initial?: ScmSalesOrder | null
    mode: "create" | "edit"
}

export function SalesOrderForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const addSO = useScmSalesOrdersStore((s) => s.addSO)
    const updateSO = useScmSalesOrdersStore((s) => s.updateSO)

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
                orderNumber: initial.orderNumber,
                customerName: initial.customerName,
                customerEmail: initial.customerEmail,
                customerPhone: initial.customerPhone,
                customerAddress: initial.customerAddress,
                warehouse: initial.warehouse,
                orderDate: initial.orderDate,
                discount: String(initial.discount),
                status: initial.status,
                paymentStatus: initial.paymentStatus,
                fulfillmentStatus: initial.fulfillmentStatus,
                remarks: initial.remarks,
            })
            setItems(initial.items.map((it) => ({ rowId: Math.random().toString(36).slice(2, 9), ...it })))
        } else {
            setData(empty)
            setItems([newLineRow()])
        }
        setErrors({}); setTouched({}); setItemError("")
    }, [open, initial, mode])

    const totals = useMemo(() => {
        const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0)
        const tax = items.reduce((s, it) => s + (it.quantity * it.unitPrice * it.taxRate) / 100, 0)
        const discount = Number(data.discount) || 0
        return { subtotal, tax, discount, total: Math.max(0, subtotal + tax - discount) }
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
                        unitPrice: r.unitPrice || product?.sellingPrice || 0,
                        taxRate: r.taxRate || product?.taxRate || 0,
                    }
                }
                return { ...r, [key]: value }
            })
        )
    }
    const addItem = () => setItems((rows) => [...rows, newLineRow()])
    const removeItem = (rowId: string) => setItems((rows) => (rows.length > 1 ? rows.filter((r) => r.rowId !== rowId) : rows))

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
            const lineItems: SOLineItem[] = items.map(({ rowId, ...rest }) => rest)
            const payload = {
                orderNumber: data.orderNumber.trim().toUpperCase(),
                customerName: data.customerName.trim(),
                customerEmail: data.customerEmail.trim(),
                customerPhone: data.customerPhone.trim(),
                customerAddress: data.customerAddress.trim(),
                warehouse: data.warehouse,
                orderDate: data.orderDate,
                items: lineItems,
                subtotal: totals.subtotal,
                taxAmount: totals.tax,
                discount: totals.discount,
                totalAmount: totals.total,
                status: data.status,
                paymentStatus: data.paymentStatus,
                fulfillmentStatus: data.fulfillmentStatus,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && initial) {
                updateSO(initial.id, payload)
                toast({ title: "Sales Order updated", description: payload.orderNumber })
            } else {
                addSO(payload)
                toast({ title: "Sales Order created", description: payload.orderNumber })
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
            title={mode === "edit" ? "Edit Sales Order" : "Create Sales Order"}
            description={mode === "edit" ? "Update sales order details and items." : "Capture a new customer sales order."}
            icon={<ClipboardList className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save Changes" : "Create Order"}
            width="xl"
            accentColor="#2563eb"
        >
            <h4 className="text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-3">Customer & Order</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Order Number" required error={touched.orderNumber ? errors.orderNumber : undefined}>
                    <Input value={data.orderNumber} onChange={(e) => setField("orderNumber", e.target.value.toUpperCase())} onBlur={() => onBlur("orderNumber")} placeholder="SO-3090" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Order Date" required error={touched.orderDate ? errors.orderDate : undefined}>
                    <Input type="date" value={data.orderDate} onChange={(e) => setField("orderDate", e.target.value)} onBlur={() => onBlur("orderDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Customer Name" required error={touched.customerName ? errors.customerName : undefined}>
                    <Input value={data.customerName} onChange={(e) => setField("customerName", e.target.value)} onBlur={() => onBlur("customerName")} placeholder="Acme Corp" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Customer Email" required error={touched.customerEmail ? errors.customerEmail : undefined}>
                    <Input type="email" value={data.customerEmail} onChange={(e) => setField("customerEmail", e.target.value)} onBlur={() => onBlur("customerEmail")} placeholder="ops@acmecorp.com" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Customer Phone" required error={touched.customerPhone ? errors.customerPhone : undefined}>
                    <Input value={data.customerPhone} onChange={(e) => setField("customerPhone", e.target.value)} onBlur={() => onBlur("customerPhone")} placeholder="+919811112233" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Warehouse" required error={touched.warehouse ? errors.warehouse : undefined}>
                    <Select value={data.warehouse} onValueChange={(v) => { setField("warehouse", v); setTouched((t) => ({ ...t, warehouse: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select fulfillment warehouse" /></SelectTrigger>
                        <SelectContent>
                            {warehouses.map((w) => (<SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="Customer Address" required error={touched.customerAddress ? errors.customerAddress : undefined} className="sm:col-span-2">
                    <Textarea value={data.customerAddress} onChange={(e) => setField("customerAddress", e.target.value)} onBlur={() => onBlur("customerAddress")} placeholder="Delivery address" rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
                <Field label="Order Status" required error={touched.status ? errors.status : undefined}>
                    <Select value={data.status} onValueChange={(v) => { setField("status", v as SOStatus); setTouched((t) => ({ ...t, status: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{SO_STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
                <Field label="Payment Status">
                    <Select value={data.paymentStatus} onValueChange={(v) => setField("paymentStatus", v as SOPaymentStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{SO_PAYMENT_STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
                <Field label="Fulfillment Status" className="sm:col-span-2">
                    <Select value={data.fulfillmentStatus} onValueChange={(v) => setField("fulfillmentStatus", v as SOFulfillmentStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{SO_FULFILLMENT_STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
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
                                    {products.map((p) => (<SelectItem key={p.id} value={p.id}>{p.sku} · {p.productName} ({p.currentStock} avail.)</SelectItem>))}
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
                    <div className="flex justify-between text-[#64748B]"><span>Subtotal</span><span className="tabular-nums font-medium text-[#0F172A]">{formatINR(totals.subtotal)}</span></div>
                    <div className="flex justify-between text-[#64748B]"><span>Tax</span><span className="tabular-nums font-medium text-[#0F172A]">{formatINR(totals.tax)}</span></div>
                    <div className="flex justify-between text-[#64748B]"><span>Discount</span><span className="tabular-nums font-medium text-[#0F172A]">− {formatINR(totals.discount)}</span></div>
                    <div className="flex justify-between pt-1.5 border-t border-[#EEF1F6]">
                        <span className="font-semibold text-[#0F172A]">Total</span>
                        <span className="text-[15px] font-semibold tabular-nums text-[#2563eb]">{formatINR(totals.total)}</span>
                    </div>
                </div>
                <Field label="Remarks" className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} placeholder="Optional notes" rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
