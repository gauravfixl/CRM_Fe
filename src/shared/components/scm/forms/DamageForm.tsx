"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
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
    useScmReturnsStore, DAMAGE_STATUSES, DAMAGE_REASONS,
    type ScmDamageRecord, type DamageStatus,
} from "@/shared/data/scm/scm-returns-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    damageId: string
    productId: string
    warehouse: string
    quantity: string
    damageReason: string
    reportedBy: string
    reportedDate: string
    actionTaken: string
    status: DamageStatus
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)
const empty: FormShape = {
    damageId: "", productId: "", warehouse: "", quantity: "",
    damageReason: "", reportedBy: "", reportedDate: todayStr(),
    actionTaken: "", status: "Reported", remarks: "",
}

const REQUIRED: Array<keyof FormShape> = ["damageId", "productId", "warehouse", "quantity", "damageReason", "reportedBy", "reportedDate", "status"]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmDamageRecord | null
    mode: "create" | "edit"
}

export function DamageForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const addDamage = useScmReturnsStore((s) => s.addDamage)
    const updateDamage = useScmReturnsStore((s) => s.updateDamage)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                damageId: initial.damageId, productId: initial.productId, warehouse: initial.warehouse,
                quantity: String(initial.quantity), damageReason: initial.damageReason,
                reportedBy: initial.reportedBy, reportedDate: initial.reportedDate,
                actionTaken: initial.actionTaken, status: initial.status, remarks: initial.remarks,
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
        if (!next.quantity && Number(data.quantity) <= 0) next.quantity = "Must be greater than 0"
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
                damageId: data.damageId.trim().toUpperCase(),
                productId: data.productId,
                productName: product?.productName ?? "",
                sku: product?.sku ?? "",
                warehouse: data.warehouse,
                quantity: Number(data.quantity),
                damageReason: data.damageReason,
                reportedBy: data.reportedBy.trim(),
                reportedDate: data.reportedDate,
                actionTaken: data.actionTaken.trim(),
                status: data.status,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && initial) {
                updateDamage(initial.id, payload)
                toast({ title: "Damage updated", description: payload.damageId })
            } else {
                addDamage(payload)
                toast({ title: "Damage logged", description: payload.damageId })
            }
            onOpenChange(false)
        } finally { setSubmitting(false) }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Damage Report" : "Report Damaged Goods"}
            description="Log damaged inventory items with reason and action taken."
            icon={<AlertTriangle className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save" : "Log Damage"}
            width="lg"
            accentColor="#ef4444"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Damage ID" required error={touched.damageId ? errors.damageId : undefined}>
                    <Input value={data.damageId} onChange={(e) => setField("damageId", e.target.value.toUpperCase())} onBlur={() => onBlur("damageId")} placeholder="DMG-205" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Status" required>
                    <Select value={data.status} onValueChange={(v) => setField("status", v as DamageStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{DAMAGE_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Product" required error={touched.productId ? errors.productId : undefined}>
                    <Select value={data.productId} onValueChange={(v) => { setField("productId", v); setTouched((t) => ({ ...t, productId: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select product" /></SelectTrigger>
                        <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.sku} · {p.productName}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Warehouse" required>
                    <Select value={data.warehouse} onValueChange={(v) => setField("warehouse", v)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                        <SelectContent>{warehouses.map((w) => <SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Quantity Damaged" required error={touched.quantity ? errors.quantity : undefined}>
                    <Input type="number" min="1" step="1" value={data.quantity} onChange={(e) => setField("quantity", e.target.value)} onBlur={() => onBlur("quantity")} placeholder="0" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Damage Reason" required error={touched.damageReason ? errors.damageReason : undefined}>
                    <Select value={data.damageReason} onValueChange={(v) => { setField("damageReason", v); setTouched((t) => ({ ...t, damageReason: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select reason" /></SelectTrigger>
                        <SelectContent>{DAMAGE_REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Reported By" required error={touched.reportedBy ? errors.reportedBy : undefined}>
                    <Input value={data.reportedBy} onChange={(e) => setField("reportedBy", e.target.value)} onBlur={() => onBlur("reportedBy")} placeholder="Reporter's name" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Reported Date" required error={touched.reportedDate ? errors.reportedDate : undefined}>
                    <Input type="date" value={data.reportedDate} onChange={(e) => setField("reportedDate", e.target.value)} onBlur={() => onBlur("reportedDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Action Taken" className="sm:col-span-2">
                    <Input value={data.actionTaken} onChange={(e) => setField("actionTaken", e.target.value)} placeholder="e.g. Written off, Vendor replacement requested" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Remarks" className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
