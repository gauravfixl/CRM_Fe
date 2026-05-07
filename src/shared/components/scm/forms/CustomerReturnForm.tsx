"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { RotateCcw } from "lucide-react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmSalesOrdersStore } from "@/shared/data/scm/scm-sales-orders-store"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"
import {
    useScmReturnsStore, CUSTOMER_RETURN_STATUSES, CUSTOMER_RETURN_REASONS,
    type ScmCustomerReturn, type CustomerReturnStatus,
} from "@/shared/data/scm/scm-returns-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    returnId: string
    orderNumber: string
    customerName: string
    productId: string
    quantity: string
    reason: string
    returnDate: string
    refundAmount: string
    status: CustomerReturnStatus
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)
const empty: FormShape = {
    returnId: "", orderNumber: "", customerName: "", productId: "",
    quantity: "", reason: "", returnDate: todayStr(),
    refundAmount: "", status: "Requested", remarks: "",
}

const REQUIRED: Array<keyof FormShape> = ["returnId", "orderNumber", "customerName", "productId", "quantity", "reason", "returnDate", "status"]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmCustomerReturn | null
    mode: "create" | "edit"
}

export function CustomerReturnForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const orders = useScmSalesOrdersStore((s) => s.salesOrders)
    const products = useScmProductsStore((s) => s.products)
    const addReturn = useScmReturnsStore((s) => s.addCustomerReturn)
    const updateReturn = useScmReturnsStore((s) => s.updateCustomerReturn)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                returnId: initial.returnId, orderNumber: initial.orderNumber, customerName: initial.customerName,
                productId: initial.productId, quantity: String(initial.quantity), reason: initial.reason,
                returnDate: initial.returnDate, refundAmount: String(initial.refundAmount),
                status: initial.status, remarks: initial.remarks,
            })
        } else setData(empty)
        setErrors({}); setTouched({})
    }, [open, initial, mode])

    const setField = (k: keyof FormShape, v: string) => {
        setData((d) => ({ ...d, [k]: v as any }))
        if (touched[k]) setErrors((e) => ({ ...e, [k]: validateField(k, v) ?? "" }))
    }
    const onBlur = (k: keyof FormShape) => {
        setTouched((t) => ({ ...t, [k]: true }))
        setErrors((e) => ({ ...e, [k]: validateField(k, data[k]) ?? "" }))
    }
    const onOrderSelect = (orderNumber: string) => {
        const so = orders.find((o) => o.orderNumber === orderNumber)
        if (so) setData((d) => ({ ...d, orderNumber, customerName: so.customerName }))
        else setField("orderNumber", orderNumber)
        setTouched((t) => ({ ...t, orderNumber: true }))
    }

    const validateAll = () => {
        const next: Record<string, string> = {}
        const fields = Object.keys(data) as Array<keyof FormShape>
        for (const f of fields) {
            const err = validateField(f, data[f])
            if (err) next[f] = err
        }
        for (const f of REQUIRED) {
            if (!next[f] && !String(data[f] ?? "").trim()) next[f] = "This field is required"
        }
        if (!next.quantity && Number(data.quantity) <= 0) next.quantity = "Must be greater than 0"
        if (!next.refundAmount && Number(data.refundAmount || 0) < 0) next.refundAmount = "Cannot be negative"
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
            const product = products.find((p) => p.id === data.productId)
            const payload = {
                returnId: data.returnId.trim().toUpperCase(),
                orderNumber: data.orderNumber.trim().toUpperCase(),
                customerName: data.customerName.trim(),
                productId: data.productId,
                productName: product?.productName ?? "",
                sku: product?.sku ?? "",
                quantity: Number(data.quantity),
                reason: data.reason.trim(),
                returnDate: data.returnDate,
                refundAmount: Number(data.refundAmount || 0),
                status: data.status,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && initial) {
                updateReturn(initial.id, payload)
                toast({ title: "Return updated", description: payload.returnId })
            } else {
                addReturn(payload)
                toast({ title: "Return created", description: payload.returnId })
            }
            onOpenChange(false)
        } finally { setSubmitting(false) }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Return" : "New Customer Return"}
            description="Capture a return request from a customer."
            icon={<RotateCcw className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save" : "Create Return"}
            width="lg"
            accentColor="#ef4444"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Return ID" required error={touched.returnId ? errors.returnId : undefined}>
                    <Input value={data.returnId} onChange={(e) => setField("returnId", e.target.value.toUpperCase())} onBlur={() => onBlur("returnId")} placeholder="RET-410" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Status" required>
                    <Select value={data.status} onValueChange={(v) => setField("status", v as CustomerReturnStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{CUSTOMER_RETURN_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Order Number" required error={touched.orderNumber ? errors.orderNumber : undefined}>
                    <Select value={data.orderNumber} onValueChange={onOrderSelect}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select order" /></SelectTrigger>
                        <SelectContent>{orders.map((o) => <SelectItem key={o.id} value={o.orderNumber}>{o.orderNumber} · {o.customerName}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Customer Name" required error={touched.customerName ? errors.customerName : undefined}>
                    <Input value={data.customerName} onChange={(e) => setField("customerName", e.target.value)} onBlur={() => onBlur("customerName")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Product" required error={touched.productId ? errors.productId : undefined}>
                    <Select value={data.productId} onValueChange={(v) => { setField("productId", v); setTouched((t) => ({ ...t, productId: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select product" /></SelectTrigger>
                        <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.sku} · {p.productName}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Quantity" required error={touched.quantity ? errors.quantity : undefined}>
                    <Input type="number" min="1" step="1" value={data.quantity} onChange={(e) => setField("quantity", e.target.value)} onBlur={() => onBlur("quantity")} placeholder="0" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Return Reason" required error={touched.reason ? errors.reason : undefined}>
                    <Select value={data.reason} onValueChange={(v) => { setField("reason", v); setTouched((t) => ({ ...t, reason: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select reason" /></SelectTrigger>
                        <SelectContent>{CUSTOMER_RETURN_REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Refund Amount (₹)" error={touched.refundAmount ? errors.refundAmount : undefined}>
                    <Input type="number" min="0" step="0.01" value={data.refundAmount} onChange={(e) => setField("refundAmount", e.target.value)} onBlur={() => onBlur("refundAmount")} placeholder="0.00" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Return Date" required error={touched.returnDate ? errors.returnDate : undefined} className="sm:col-span-2">
                    <Input type="date" value={data.returnDate} onChange={(e) => setField("returnDate", e.target.value)} onBlur={() => onBlur("returnDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Remarks" className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
