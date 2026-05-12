"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { ArrowUpFromLine } from "lucide-react"
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
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"
import {
    useScmStockMovementsStore,
    STOCK_OUT_REASONS,
    type StockOutReason,
} from "@/shared/data/scm/scm-stock-movements-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    productId: string
    warehouse: string
    quantity: string
    reason: StockOutReason | ""
    referenceNumber: string
    issuedTo: string
    movementDate: string
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)

const empty: FormShape = {
    productId: "",
    warehouse: "",
    quantity: "",
    reason: "",
    referenceNumber: "",
    issuedTo: "",
    movementDate: todayStr(),
    remarks: "",
}

const REQUIRED: Array<keyof FormShape> = ["productId", "warehouse", "quantity", "reason", "movementDate"]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
}

export function StockOutForm({ open, onOpenChange }: Props) {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const addStockOut = useScmStockMovementsStore((s) => s.addStockOut)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (open) {
            setData(empty)
            setErrors({})
            setTouched({})
        }
    }, [open])

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
        if (!next.quantity && Number(data.quantity) <= 0) next.quantity = "Quantity must be greater than 0"

        if (data.productId && data.quantity) {
            const product = products.find((p) => p.id === data.productId)
            if (product && Number(data.quantity) > product.currentStock) {
                next.quantity = `Only ${product.currentStock} units available in stock`
            }
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
            addStockOut({
                productId: product.id,
                productName: product.productName,
                sku: product.sku,
                warehouse: data.warehouse,
                quantity: Number(data.quantity),
                reason: data.reason as StockOutReason,
                referenceNumber: data.referenceNumber || undefined,
                issuedTo: data.issuedTo || undefined,
                movementDate: data.movementDate,
                remarks: data.remarks,
            })
            toast({ title: "Stock issued", description: `${data.quantity} units of ${product.productName}` })
            onOpenChange(false)
        } finally {
            setSubmitting(false)
        }
    }

    const selectedProduct = products.find((p) => p.id === data.productId)

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title="Add Stock Out"
            description="Record outgoing stock for sales, transfers, damage, or internal usage."
            icon={<ArrowUpFromLine className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel="Save Stock Out"
            width="lg"
            accentColor="#f59e0b"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Product" required error={touched.productId ? errors.productId : undefined} className="sm:col-span-2" hint={selectedProduct ? `Available: ${selectedProduct.currentStock} ${selectedProduct.unit}(s)` : undefined}>
                    <Select value={data.productId} onValueChange={(v) => { setField("productId", v); setTouched((t) => ({ ...t, productId: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select a product" /></SelectTrigger>
                        <SelectContent>
                            {products.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {p.sku} · {p.productName} ({p.currentStock} avail.)
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Warehouse" required error={touched.warehouse ? errors.warehouse : undefined}>
                    <Select value={data.warehouse} onValueChange={(v) => { setField("warehouse", v); setTouched((t) => ({ ...t, warehouse: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                        <SelectContent>
                            {warehouses.map((w) => (
                                <SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Quantity" required error={touched.quantity ? errors.quantity : undefined}>
                    <Input type="number" min="1" step="1" value={data.quantity} onChange={(e) => setField("quantity", e.target.value)} onBlur={() => onBlur("quantity")} placeholder="0" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>

                <Field label="Reason" required error={touched.reason ? errors.reason : undefined}>
                    <Select value={data.reason} onValueChange={(v) => { setField("reason", v as StockOutReason); setTouched((t) => ({ ...t, reason: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select reason" /></SelectTrigger>
                        <SelectContent>
                            {STOCK_OUT_REASONS.map((r) => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Issued Date" required error={touched.movementDate ? errors.movementDate : undefined}>
                    <Input type="date" value={data.movementDate} onChange={(e) => setField("movementDate", e.target.value)} onBlur={() => onBlur("movementDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="Reference Number" error={touched.referenceNumber ? errors.referenceNumber : undefined}>
                    <Input value={data.referenceNumber} onChange={(e) => setField("referenceNumber", e.target.value)} onBlur={() => onBlur("referenceNumber")} placeholder="SO-3082" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="Issued To" error={touched.issuedTo ? errors.issuedTo : undefined}>
                    <Input value={data.issuedTo} onChange={(e) => setField("issuedTo", e.target.value)} onBlur={() => onBlur("issuedTo")} placeholder="Customer / Department" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="Remarks" error={touched.remarks ? errors.remarks : undefined} className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} onBlur={() => onBlur("remarks")} placeholder="Optional notes" rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
