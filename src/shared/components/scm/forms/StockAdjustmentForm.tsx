"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Sliders } from "lucide-react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"
import {
    useScmWarehouseOpsStore,
    ADJUSTMENT_TYPES,
    type ScmAdjustment,
    type AdjustmentType,
} from "@/shared/data/scm/scm-warehouse-ops-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    adjustmentNumber: string
    productId: string
    warehouse: string
    currentQuantity: string
    adjustedQuantity: string
    adjustmentType: AdjustmentType
    reason: string
    approvedBy: string
    adjustmentDate: string
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)
const empty: FormShape = {
    adjustmentNumber: "",
    productId: "",
    warehouse: "",
    currentQuantity: "0",
    adjustedQuantity: "",
    adjustmentType: "Correction",
    reason: "",
    approvedBy: "",
    adjustmentDate: todayStr(),
    remarks: "",
}

const REQUIRED: Array<keyof FormShape> = [
    "adjustmentNumber", "productId", "warehouse", "adjustedQuantity",
    "adjustmentType", "reason", "approvedBy", "adjustmentDate",
]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmAdjustment | null
    mode: "create" | "edit"
}

export function StockAdjustmentForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const updateProduct = useScmProductsStore((s) => s.updateProduct)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const addAdjustment = useScmWarehouseOpsStore((s) => s.addAdjustment)
    const updateAdjustment = useScmWarehouseOpsStore((s) => s.updateAdjustment)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                adjustmentNumber: initial.adjustmentNumber,
                productId: initial.productId,
                warehouse: initial.warehouse,
                currentQuantity: String(initial.currentQuantity),
                adjustedQuantity: String(initial.adjustedQuantity),
                adjustmentType: initial.adjustmentType,
                reason: initial.reason,
                approvedBy: initial.approvedBy,
                adjustmentDate: initial.adjustmentDate,
                remarks: initial.remarks,
            })
        } else {
            setData(empty)
        }
        setErrors({}); setTouched({})
    }, [open, initial, mode])

    const setField = (k: keyof FormShape, v: string) => {
        if (k === "productId") {
            const p = products.find((x) => x.id === v)
            setData((d) => ({ ...d, productId: v, currentQuantity: String(p?.currentStock ?? 0), adjustedQuantity: String(p?.currentStock ?? 0) }))
            return
        }
        setData((d) => ({ ...d, [k]: v as any }))
        if (touched[k]) {
            const err = validateField(k, v)
            setErrors((e) => ({ ...e, [k]: err ?? "" }))
        }
    }
    const onBlur = (k: keyof FormShape) => {
        setTouched((t) => ({ ...t, [k]: true }))
        const err = validateField(k, data[k])
        setErrors((e) => ({ ...e, [k]: err ?? "" }))
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
        if (!next.adjustedQuantity && Number(data.adjustedQuantity) < 0) {
            next.adjustedQuantity = "Cannot be negative"
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
            const product = products.find((p) => p.id === data.productId)
            if (!product) {
                toast({ title: "Product not found", variant: "destructive" })
                return
            }
            const payload = {
                adjustmentNumber: data.adjustmentNumber.trim().toUpperCase(),
                productId: product.id,
                productName: product.productName,
                sku: product.sku,
                warehouse: data.warehouse,
                currentQuantity: Number(data.currentQuantity),
                adjustedQuantity: Number(data.adjustedQuantity),
                adjustmentType: data.adjustmentType,
                reason: data.reason.trim(),
                approvedBy: data.approvedBy.trim(),
                adjustmentDate: data.adjustmentDate,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && initial) {
                updateAdjustment(initial.id, payload)
                toast({ title: "Adjustment updated", description: payload.adjustmentNumber })
            } else {
                addAdjustment(payload)
                // Sync product stock
                updateProduct(product.id, { currentStock: payload.adjustedQuantity })
                toast({ title: "Stock adjusted", description: `${product.productName}: ${payload.currentQuantity} → ${payload.adjustedQuantity}` })
            }
            onOpenChange(false)
        } finally { setSubmitting(false) }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Stock Adjustment" : "New Stock Adjustment"}
            description="Correct stock differences from audit, damage, loss, or manual count."
            icon={<Sliders className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save Changes" : "Create Adjustment"}
            width="lg"
            accentColor="#f59e0b"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Adjustment Number" required error={touched.adjustmentNumber ? errors.adjustmentNumber : undefined}>
                    <Input value={data.adjustmentNumber} onChange={(e) => setField("adjustmentNumber", e.target.value.toUpperCase())} onBlur={() => onBlur("adjustmentNumber")} placeholder="ADJ-412" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Adjustment Type" required error={touched.adjustmentType ? errors.adjustmentType : undefined}>
                    <Select value={data.adjustmentType} onValueChange={(v) => setField("adjustmentType", v as AdjustmentType)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{ADJUSTMENT_TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
                <Field label="Product" required error={touched.productId ? errors.productId : undefined} className="sm:col-span-2">
                    <Select value={data.productId} onValueChange={(v) => { setField("productId", v); setTouched((t) => ({ ...t, productId: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select product" /></SelectTrigger>
                        <SelectContent>
                            {products.map((p) => (<SelectItem key={p.id} value={p.id}>{p.sku} · {p.productName}</SelectItem>))}
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
                <Field label="Current Quantity" hint="Auto-filled from product">
                    <Input type="number" value={data.currentQuantity} disabled className="h-10 border-[#E5E7EB] text-[13px] tabular-nums bg-[#F8FAFC]" />
                </Field>
                <Field label="Adjusted Quantity" required error={touched.adjustedQuantity ? errors.adjustedQuantity : undefined}>
                    <Input type="number" min="0" step="1" value={data.adjustedQuantity} onChange={(e) => setField("adjustedQuantity", e.target.value)} onBlur={() => onBlur("adjustedQuantity")} placeholder="0" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Adjustment Date" required error={touched.adjustmentDate ? errors.adjustmentDate : undefined}>
                    <Input type="date" value={data.adjustmentDate} onChange={(e) => setField("adjustmentDate", e.target.value)} onBlur={() => onBlur("adjustmentDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Approved By" required error={touched.approvedBy ? errors.approvedBy : undefined}>
                    <Input value={data.approvedBy} onChange={(e) => setField("approvedBy", e.target.value)} onBlur={() => onBlur("approvedBy")} placeholder="Manager name" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Reason" required error={touched.reason ? errors.reason : undefined} className="sm:col-span-2">
                    <Input value={data.reason} onChange={(e) => setField("reason", e.target.value)} onBlur={() => onBlur("reason")} placeholder="Audit / Damage / Loss / Correction" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Remarks" error={touched.remarks ? errors.remarks : undefined} className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} onBlur={() => onBlur("remarks")} rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
