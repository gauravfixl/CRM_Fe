"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { ClipboardCheck } from "lucide-react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"
import {
    useScmProcurementExtraStore,
    PR_STATUSES, PR_PRIORITIES, DEPARTMENTS,
    type ScmPurchaseRequest, type PRStatus, type PRPriority,
} from "@/shared/data/scm/scm-procurement-extra-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    requestNumber: string
    requestedBy: string
    department: string
    productId: string
    quantity: string
    requiredDate: string
    priority: PRPriority
    status: PRStatus
    remarks: string
}

const empty: FormShape = {
    requestNumber: "",
    requestedBy: "",
    department: "",
    productId: "",
    quantity: "",
    requiredDate: "",
    priority: "Medium",
    status: "Draft",
    remarks: "",
}

const REQUIRED: Array<keyof FormShape> = ["requestNumber", "requestedBy", "department", "productId", "quantity", "requiredDate", "priority", "status"]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmPurchaseRequest | null
    mode: "create" | "edit"
}

export function PurchaseRequestForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const products = useScmProductsStore((s) => s.products)
    const addPR = useScmProcurementExtraStore((s) => s.addPR)
    const updatePR = useScmProcurementExtraStore((s) => s.updatePR)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                requestNumber: initial.requestNumber, requestedBy: initial.requestedBy,
                department: initial.department, productId: initial.productId,
                quantity: String(initial.quantity), requiredDate: initial.requiredDate,
                priority: initial.priority, status: initial.status, remarks: initial.remarks,
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
                requestNumber: data.requestNumber.trim().toUpperCase(),
                requestedBy: data.requestedBy.trim(),
                department: data.department,
                productId: data.productId,
                productName: product?.productName ?? "",
                sku: product?.sku ?? "",
                quantity: Number(data.quantity),
                requiredDate: data.requiredDate,
                priority: data.priority,
                status: data.status,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && initial) {
                updatePR(initial.id, payload)
                toast({ title: "PR updated", description: payload.requestNumber })
            } else {
                addPR(payload)
                toast({ title: "PR created", description: payload.requestNumber })
            }
            onOpenChange(false)
        } finally { setSubmitting(false) }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Purchase Request" : "New Purchase Request"}
            description="Request items from the procurement team."
            icon={<ClipboardCheck className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save" : "Submit Request"}
            width="lg"
            accentColor="#10b981"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Request Number" required error={touched.requestNumber ? errors.requestNumber : undefined}>
                    <Input value={data.requestNumber} onChange={(e) => setField("requestNumber", e.target.value.toUpperCase())} onBlur={() => onBlur("requestNumber")} placeholder="PR-1050" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Status" required>
                    <Select value={data.status} onValueChange={(v) => setField("status", v as PRStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{PR_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Requested By" required error={touched.requestedBy ? errors.requestedBy : undefined}>
                    <Input value={data.requestedBy} onChange={(e) => setField("requestedBy", e.target.value)} onBlur={() => onBlur("requestedBy")} placeholder="Full name" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Department" required>
                    <Select value={data.department} onValueChange={(v) => setField("department", v)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select department" /></SelectTrigger>
                        <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Product" required error={touched.productId ? errors.productId : undefined} className="sm:col-span-2">
                    <Select value={data.productId} onValueChange={(v) => { setField("productId", v); setTouched((t) => ({ ...t, productId: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select product" /></SelectTrigger>
                        <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.sku} · {p.productName}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Quantity" required error={touched.quantity ? errors.quantity : undefined}>
                    <Input type="number" min="1" step="1" value={data.quantity} onChange={(e) => setField("quantity", e.target.value)} onBlur={() => onBlur("quantity")} placeholder="0" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Required Date" required error={touched.requiredDate ? errors.requiredDate : undefined}>
                    <Input type="date" value={data.requiredDate} onChange={(e) => setField("requiredDate", e.target.value)} onBlur={() => onBlur("requiredDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Priority" required className="sm:col-span-2">
                    <Select value={data.priority} onValueChange={(v) => setField("priority", v as PRPriority)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{PR_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Remarks" className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
