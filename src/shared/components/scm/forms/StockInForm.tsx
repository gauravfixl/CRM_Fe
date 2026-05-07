"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { ArrowDownToLine } from "lucide-react"
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
import { useScmVendorsStore } from "@/shared/data/scm/scm-vendors-store"
import { useScmStockMovementsStore } from "@/shared/data/scm/scm-stock-movements-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    productId: string
    warehouse: string
    quantity: string
    unitCost: string
    supplier: string
    poNumber: string
    batchNumber: string
    expiryDate: string
    movementDate: string
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)

const empty: FormShape = {
    productId: "",
    warehouse: "",
    quantity: "",
    unitCost: "",
    supplier: "",
    poNumber: "",
    batchNumber: "",
    expiryDate: "",
    movementDate: todayStr(),
    remarks: "",
}

const REQUIRED: Array<keyof FormShape> = [
    "productId", "warehouse", "quantity", "unitCost", "movementDate",
]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
}

export function StockInForm({ open, onOpenChange }: Props) {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const vendors = useScmVendorsStore((s) => s.vendors)
    const addStockIn = useScmStockMovementsStore((s) => s.addStockIn)

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
        setData((d) => ({ ...d, [name]: value }))
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
            addStockIn({
                productId: product.id,
                productName: product.productName,
                sku: product.sku,
                warehouse: data.warehouse,
                quantity: Number(data.quantity),
                unitCost: Number(data.unitCost),
                supplier: data.supplier || undefined,
                poNumber: data.poNumber || undefined,
                batchNumber: data.batchNumber || undefined,
                expiryDate: data.expiryDate || undefined,
                movementDate: data.movementDate,
                remarks: data.remarks,
            })
            toast({ title: "Stock added", description: `${data.quantity} units of ${product.productName}` })
            onOpenChange(false)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title="Add Stock In"
            description="Record incoming stock from a supplier or transfer."
            icon={<ArrowDownToLine className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel="Save Stock In"
            width="lg"
            accentColor="#10b981"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Product" required error={touched.productId ? errors.productId : undefined} className="sm:col-span-2">
                    <Select value={data.productId} onValueChange={(v) => { setField("productId", v); setTouched((t) => ({ ...t, productId: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select a product" /></SelectTrigger>
                        <SelectContent>
                            {products.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {p.sku} · {p.productName}
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

                <Field label="Unit Cost" required error={touched.unitCost ? errors.unitCost : undefined} hint="₹ per unit">
                    <Input type="number" min="0" step="0.01" value={data.unitCost} onChange={(e) => setField("unitCost", e.target.value)} onBlur={() => onBlur("unitCost")} placeholder="0.00" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>

                <Field label="Received Date" required error={touched.movementDate ? errors.movementDate : undefined}>
                    <Input type="date" value={data.movementDate} onChange={(e) => setField("movementDate", e.target.value)} onBlur={() => onBlur("movementDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="Supplier" error={touched.supplier ? errors.supplier : undefined}>
                    <Select value={data.supplier} onValueChange={(v) => { setField("supplier", v); setTouched((t) => ({ ...t, supplier: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                        <SelectContent>
                            {vendors.map((v) => (
                                <SelectItem key={v.id} value={v.vendorName}>{v.vendorName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="PO Number" error={touched.poNumber ? errors.poNumber : undefined}>
                    <Input value={data.poNumber} onChange={(e) => setField("poNumber", e.target.value.toUpperCase())} onBlur={() => onBlur("poNumber")} placeholder="PO-2087" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>

                <Field label="Batch Number" error={touched.batchNumber ? errors.batchNumber : undefined}>
                    <Input value={data.batchNumber} onChange={(e) => setField("batchNumber", e.target.value)} onBlur={() => onBlur("batchNumber")} placeholder="B-A4-2604" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="Expiry Date" error={touched.expiryDate ? errors.expiryDate : undefined}>
                    <Input type="date" value={data.expiryDate} onChange={(e) => setField("expiryDate", e.target.value)} onBlur={() => onBlur("expiryDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="Remarks" error={touched.remarks ? errors.remarks : undefined} className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} onBlur={() => onBlur("remarks")} placeholder="Optional notes" rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
