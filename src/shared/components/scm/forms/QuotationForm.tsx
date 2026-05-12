"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { FileText } from "lucide-react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"
import { useScmVendorsStore } from "@/shared/data/scm/scm-vendors-store"
import {
    useScmProcurementExtraStore,
    QUOTATION_STATUSES,
    type ScmQuotation, type QuotationStatus,
} from "@/shared/data/scm/scm-procurement-extra-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    quotationId: string
    vendorId: string
    productId: string
    quantity: string
    quotedPrice: string
    deliveryTime: string
    validityDate: string
    status: QuotationStatus
    remarks: string
}

const empty: FormShape = {
    quotationId: "",
    vendorId: "",
    productId: "",
    quantity: "",
    quotedPrice: "",
    deliveryTime: "",
    validityDate: "",
    status: "Pending",
    remarks: "",
}

const REQUIRED: Array<keyof FormShape> = ["quotationId", "vendorId", "productId", "quantity", "quotedPrice", "deliveryTime", "validityDate", "status"]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmQuotation | null
    mode: "create" | "edit"
}

export function QuotationForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const vendors = useScmVendorsStore((s) => s.vendors)
    const addQuotation = useScmProcurementExtraStore((s) => s.addQuotation)
    const updateQuotation = useScmProcurementExtraStore((s) => s.updateQuotation)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                quotationId: initial.quotationId, vendorId: initial.vendorId,
                productId: initial.productId, quantity: String(initial.quantity),
                quotedPrice: String(initial.quotedPrice), deliveryTime: initial.deliveryTime,
                validityDate: initial.validityDate, status: initial.status, remarks: initial.remarks,
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
        if (!next.quantity && Number(data.quantity) <= 0) next.quantity = "Quantity must be greater than 0"
        if (!next.quotedPrice && Number(data.quotedPrice) < 0) next.quotedPrice = "Cannot be negative"
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
            const vendor = vendors.find((v) => v.id === data.vendorId)
            const payload = {
                quotationId: data.quotationId.trim().toUpperCase(),
                vendorId: data.vendorId,
                vendorName: vendor?.vendorName ?? "",
                productId: data.productId,
                productName: product?.productName ?? "",
                sku: product?.sku ?? "",
                quantity: Number(data.quantity),
                quotedPrice: Number(data.quotedPrice),
                deliveryTime: data.deliveryTime.trim(),
                validityDate: data.validityDate,
                status: data.status,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && initial) {
                updateQuotation(initial.id, payload)
                toast({ title: "Quotation updated", description: payload.quotationId })
            } else {
                addQuotation(payload)
                toast({ title: "Quotation created", description: payload.quotationId })
            }
            onOpenChange(false)
        } finally { setSubmitting(false) }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Quotation" : "New Vendor Quotation"}
            description="Capture vendor pricing for comparison and approval."
            icon={<FileText className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save" : "Create"}
            width="lg"
            accentColor="#8b5cf6"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Quotation ID" required error={touched.quotationId ? errors.quotationId : undefined}>
                    <Input value={data.quotationId} onChange={(e) => setField("quotationId", e.target.value.toUpperCase())} onBlur={() => onBlur("quotationId")} placeholder="QT-2210" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Status" required>
                    <Select value={data.status} onValueChange={(v) => setField("status", v as QuotationStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{QUOTATION_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Vendor" required error={touched.vendorId ? errors.vendorId : undefined}>
                    <Select value={data.vendorId} onValueChange={(v) => { setField("vendorId", v); setTouched((t) => ({ ...t, vendorId: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                        <SelectContent>{vendors.map((v) => <SelectItem key={v.id} value={v.id}>{v.vendorName}</SelectItem>)}</SelectContent>
                    </Select>
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
                <Field label="Quoted Price (per unit)" required error={touched.quotedPrice ? errors.quotedPrice : undefined}>
                    <Input type="number" min="0" step="0.01" value={data.quotedPrice} onChange={(e) => setField("quotedPrice", e.target.value)} onBlur={() => onBlur("quotedPrice")} placeholder="0.00" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Delivery Time" required error={touched.deliveryTime ? errors.deliveryTime : undefined}>
                    <Input value={data.deliveryTime} onChange={(e) => setField("deliveryTime", e.target.value)} onBlur={() => onBlur("deliveryTime")} placeholder="e.g. 5 days" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Validity Date" required error={touched.validityDate ? errors.validityDate : undefined}>
                    <Input type="date" value={data.validityDate} onChange={(e) => setField("validityDate", e.target.value)} onBlur={() => onBlur("validityDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Remarks" className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
