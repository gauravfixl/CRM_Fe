"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { ArrowRightLeft } from "lucide-react"
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
    TRANSFER_STATUSES,
    type ScmTransfer,
    type TransferStatus,
} from "@/shared/data/scm/scm-warehouse-ops-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    transferNumber: string
    fromWarehouse: string
    toWarehouse: string
    productId: string
    quantity: string
    transferDate: string
    expectedArrivalDate: string
    status: TransferStatus
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)
const empty: FormShape = {
    transferNumber: "",
    fromWarehouse: "",
    toWarehouse: "",
    productId: "",
    quantity: "",
    transferDate: todayStr(),
    expectedArrivalDate: "",
    status: "Draft",
    remarks: "",
}

const REQUIRED: Array<keyof FormShape> = [
    "transferNumber", "fromWarehouse", "toWarehouse", "productId",
    "quantity", "transferDate", "expectedArrivalDate", "status",
]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmTransfer | null
    mode: "create" | "edit"
}

export function TransferForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const addTransfer = useScmWarehouseOpsStore((s) => s.addTransfer)
    const updateTransfer = useScmWarehouseOpsStore((s) => s.updateTransfer)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                transferNumber: initial.transferNumber,
                fromWarehouse: initial.fromWarehouse,
                toWarehouse: initial.toWarehouse,
                productId: initial.productId,
                quantity: String(initial.quantity),
                transferDate: initial.transferDate,
                expectedArrivalDate: initial.expectedArrivalDate,
                status: initial.status,
                remarks: initial.remarks,
            })
        } else {
            setData(empty)
        }
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
        if (data.fromWarehouse && data.toWarehouse && data.fromWarehouse === data.toWarehouse) {
            next.toWarehouse = "Source and destination must be different"
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
            const payload = {
                transferNumber: data.transferNumber.trim().toUpperCase(),
                fromWarehouse: data.fromWarehouse,
                toWarehouse: data.toWarehouse,
                productId: product.id,
                productName: product.productName,
                sku: product.sku,
                quantity: Number(data.quantity),
                transferDate: data.transferDate,
                expectedArrivalDate: data.expectedArrivalDate,
                status: data.status,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && initial) {
                updateTransfer(initial.id, payload)
                toast({ title: "Transfer updated", description: payload.transferNumber })
            } else {
                addTransfer(payload)
                toast({ title: "Transfer created", description: payload.transferNumber })
            }
            onOpenChange(false)
        } finally { setSubmitting(false) }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Warehouse Transfer" : "New Warehouse Transfer"}
            description="Move stock between warehouse locations."
            icon={<ArrowRightLeft className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save" : "Create Transfer"}
            width="lg"
            accentColor="#0ea5e9"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Transfer Number" required error={touched.transferNumber ? errors.transferNumber : undefined}>
                    <Input value={data.transferNumber} onChange={(e) => setField("transferNumber", e.target.value.toUpperCase())} onBlur={() => onBlur("transferNumber")} placeholder="TRF-1810" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Status" required>
                    <Select value={data.status} onValueChange={(v) => setField("status", v as TransferStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{TRANSFER_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="From Warehouse" required error={touched.fromWarehouse ? errors.fromWarehouse : undefined}>
                    <Select value={data.fromWarehouse} onValueChange={(v) => { setField("fromWarehouse", v); setTouched((t) => ({ ...t, fromWarehouse: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Source" /></SelectTrigger>
                        <SelectContent>{warehouses.map((w) => <SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="To Warehouse" required error={touched.toWarehouse ? errors.toWarehouse : undefined}>
                    <Select value={data.toWarehouse} onValueChange={(v) => { setField("toWarehouse", v); setTouched((t) => ({ ...t, toWarehouse: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Destination" /></SelectTrigger>
                        <SelectContent>{warehouses.map((w) => <SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Product" required error={touched.productId ? errors.productId : undefined} className="sm:col-span-2">
                    <Select value={data.productId} onValueChange={(v) => { setField("productId", v); setTouched((t) => ({ ...t, productId: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select product" /></SelectTrigger>
                        <SelectContent>
                            {products.map((p) => <SelectItem key={p.id} value={p.id}>{p.sku} · {p.productName}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="Quantity" required error={touched.quantity ? errors.quantity : undefined}>
                    <Input type="number" min="1" step="1" value={data.quantity} onChange={(e) => setField("quantity", e.target.value)} onBlur={() => onBlur("quantity")} placeholder="0" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Transfer Date" required error={touched.transferDate ? errors.transferDate : undefined}>
                    <Input type="date" value={data.transferDate} onChange={(e) => setField("transferDate", e.target.value)} onBlur={() => onBlur("transferDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Expected Arrival" required error={touched.expectedArrivalDate ? errors.expectedArrivalDate : undefined} className="sm:col-span-2">
                    <Input type="date" value={data.expectedArrivalDate} onChange={(e) => setField("expectedArrivalDate", e.target.value)} onBlur={() => onBlur("expectedArrivalDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Remarks" className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
