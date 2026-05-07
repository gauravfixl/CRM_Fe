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
import { useScmPurchaseOrdersStore } from "@/shared/data/scm/scm-purchase-orders-store"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"
import {
    useScmProcurementExtraStore, PURCHASE_RETURN_STATUSES, REFUND_TYPES,
    type ScmPurchaseReturn, type PurchaseReturnStatus, type RefundType,
} from "@/shared/data/scm/scm-procurement-extra-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    returnNumber: string
    poNumber: string
    vendorName: string
    productId: string
    quantityReturned: string
    reason: string
    refundType: RefundType
    returnDate: string
    status: PurchaseReturnStatus
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)
const empty: FormShape = {
    returnNumber: "", poNumber: "", vendorName: "", productId: "",
    quantityReturned: "", reason: "", refundType: "Refund",
    returnDate: todayStr(), status: "Pending", remarks: "",
}

const REQUIRED: Array<keyof FormShape> = ["returnNumber", "poNumber", "vendorName", "productId", "quantityReturned", "reason", "refundType", "returnDate", "status"]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmPurchaseReturn | null
    mode: "create" | "edit"
}

export function PurchaseReturnForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const pos = useScmPurchaseOrdersStore((s) => s.purchaseOrders)
    const products = useScmProductsStore((s) => s.products)
    const addPR = useScmProcurementExtraStore((s) => s.addPurchaseReturn)
    const updatePR = useScmProcurementExtraStore((s) => s.updatePurchaseReturn)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                returnNumber: initial.returnNumber, poNumber: initial.poNumber,
                vendorName: initial.vendorName, productId: initial.productId,
                quantityReturned: String(initial.quantityReturned), reason: initial.reason,
                refundType: initial.refundType, returnDate: initial.returnDate,
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

    const onPOSelect = (poNumber: string) => {
        const po = pos.find((p) => p.poNumber === poNumber)
        if (po) setData((d) => ({ ...d, poNumber, vendorName: po.vendorName }))
        else setField("poNumber", poNumber)
        setTouched((t) => ({ ...t, poNumber: true }))
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
        if (!next.quantityReturned && Number(data.quantityReturned) <= 0) next.quantityReturned = "Must be greater than 0"
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
                returnNumber: data.returnNumber.trim().toUpperCase(),
                poNumber: data.poNumber.trim().toUpperCase(),
                vendorName: data.vendorName.trim(),
                productId: data.productId,
                productName: product?.productName ?? "",
                sku: product?.sku ?? "",
                quantityReturned: Number(data.quantityReturned),
                reason: data.reason.trim(),
                refundType: data.refundType,
                returnDate: data.returnDate,
                status: data.status,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && initial) {
                updatePR(initial.id, payload)
                toast({ title: "Return updated", description: payload.returnNumber })
            } else {
                addPR(payload)
                toast({ title: "Return created", description: payload.returnNumber })
            }
            onOpenChange(false)
        } finally { setSubmitting(false) }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Purchase Return" : "New Purchase Return"}
            description="Return defective or incorrect goods to a vendor."
            icon={<RotateCcw className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save" : "Create Return"}
            width="lg"
            accentColor="#ef4444"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Return Number" required error={touched.returnNumber ? errors.returnNumber : undefined}>
                    <Input value={data.returnNumber} onChange={(e) => setField("returnNumber", e.target.value.toUpperCase())} onBlur={() => onBlur("returnNumber")} placeholder="PRET-302" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="PO Number" required error={touched.poNumber ? errors.poNumber : undefined}>
                    <Select value={data.poNumber} onValueChange={onPOSelect}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select PO" /></SelectTrigger>
                        <SelectContent>{pos.map((p) => <SelectItem key={p.id} value={p.poNumber}>{p.poNumber} · {p.vendorName}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Vendor Name" required error={touched.vendorName ? errors.vendorName : undefined}>
                    <Input value={data.vendorName} onChange={(e) => setField("vendorName", e.target.value)} onBlur={() => onBlur("vendorName")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Product" required error={touched.productId ? errors.productId : undefined}>
                    <Select value={data.productId} onValueChange={(v) => { setField("productId", v); setTouched((t) => ({ ...t, productId: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select product" /></SelectTrigger>
                        <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.sku} · {p.productName}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Quantity Returned" required error={touched.quantityReturned ? errors.quantityReturned : undefined}>
                    <Input type="number" min="1" step="1" value={data.quantityReturned} onChange={(e) => setField("quantityReturned", e.target.value)} onBlur={() => onBlur("quantityReturned")} placeholder="0" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Refund / Replacement" required>
                    <Select value={data.refundType} onValueChange={(v) => setField("refundType", v as RefundType)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{REFUND_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Return Date" required error={touched.returnDate ? errors.returnDate : undefined}>
                    <Input type="date" value={data.returnDate} onChange={(e) => setField("returnDate", e.target.value)} onBlur={() => onBlur("returnDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Status" required>
                    <Select value={data.status} onValueChange={(v) => setField("status", v as PurchaseReturnStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{PURCHASE_RETURN_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Reason" required error={touched.reason ? errors.reason : undefined} className="sm:col-span-2">
                    <Input value={data.reason} onChange={(e) => setField("reason", e.target.value)} onBlur={() => onBlur("reason")} placeholder="e.g. Damaged in transit, wrong item shipped" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Remarks" className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
