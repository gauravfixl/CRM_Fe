"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { ClipboardList } from "lucide-react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmPurchaseOrdersStore } from "@/shared/data/scm/scm-purchase-orders-store"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"
import {
    useScmProcurementExtraStore, GRN_QUALITY_STATUSES,
    type ScmGRN, type GRNQualityStatus,
} from "@/shared/data/scm/scm-procurement-extra-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    grnNumber: string
    poNumber: string
    vendorName: string
    warehouse: string
    receivedDate: string
    expectedQuantity: string
    receivedQuantity: string
    rejectedQuantity: string
    qualityStatus: GRNQualityStatus
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)
const empty: FormShape = {
    grnNumber: "", poNumber: "", vendorName: "", warehouse: "",
    receivedDate: todayStr(), expectedQuantity: "0", receivedQuantity: "",
    rejectedQuantity: "0", qualityStatus: "Pending", remarks: "",
}

const REQUIRED: Array<keyof FormShape> = ["grnNumber", "poNumber", "vendorName", "warehouse", "receivedDate", "receivedQuantity", "qualityStatus"]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmGRN | null
    mode: "create" | "edit"
}

export function GRNForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const pos = useScmPurchaseOrdersStore((s) => s.purchaseOrders)
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const addGRN = useScmProcurementExtraStore((s) => s.addGRN)
    const updateGRN = useScmProcurementExtraStore((s) => s.updateGRN)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                grnNumber: initial.grnNumber, poNumber: initial.poNumber, vendorName: initial.vendorName,
                warehouse: initial.warehouse, receivedDate: initial.receivedDate,
                expectedQuantity: String(initial.expectedQuantity), receivedQuantity: String(initial.receivedQuantity),
                rejectedQuantity: String(initial.rejectedQuantity), qualityStatus: initial.qualityStatus, remarks: initial.remarks,
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
        if (po) {
            const totalQty = po.items.reduce((s, i) => s + i.quantity, 0)
            setData((d) => ({ ...d, poNumber, vendorName: po.vendorName, warehouse: po.warehouse, expectedQuantity: String(totalQty) }))
        } else {
            setField("poNumber", poNumber)
        }
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
        if (!next.receivedQuantity && Number(data.receivedQuantity) < 0) next.receivedQuantity = "Cannot be negative"
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
            const payload = {
                grnNumber: data.grnNumber.trim().toUpperCase(),
                poNumber: data.poNumber.trim().toUpperCase(),
                vendorName: data.vendorName.trim(),
                warehouse: data.warehouse,
                receivedDate: data.receivedDate,
                expectedQuantity: Number(data.expectedQuantity),
                receivedQuantity: Number(data.receivedQuantity),
                rejectedQuantity: Number(data.rejectedQuantity || 0),
                qualityStatus: data.qualityStatus,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && initial) {
                updateGRN(initial.id, payload)
                toast({ title: "GRN updated", description: payload.grnNumber })
            } else {
                addGRN(payload)
                toast({ title: "GRN created", description: payload.grnNumber })
            }
            onOpenChange(false)
        } finally { setSubmitting(false) }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit GRN" : "New Goods Received Note"}
            description="Confirm goods received against a purchase order."
            icon={<ClipboardList className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save" : "Create GRN"}
            width="lg"
            accentColor="#10b981"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="GRN Number" required error={touched.grnNumber ? errors.grnNumber : undefined}>
                    <Input value={data.grnNumber} onChange={(e) => setField("grnNumber", e.target.value.toUpperCase())} onBlur={() => onBlur("grnNumber")} placeholder="GRN-5040" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
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
                <Field label="Warehouse" required>
                    <Select value={data.warehouse} onValueChange={(v) => setField("warehouse", v)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                        <SelectContent>{warehouses.map((w) => <SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Received Date" required error={touched.receivedDate ? errors.receivedDate : undefined}>
                    <Input type="date" value={data.receivedDate} onChange={(e) => setField("receivedDate", e.target.value)} onBlur={() => onBlur("receivedDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Quality Status" required>
                    <Select value={data.qualityStatus} onValueChange={(v) => setField("qualityStatus", v as GRNQualityStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{GRN_QUALITY_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Expected Quantity">
                    <Input type="number" value={data.expectedQuantity} disabled className="h-10 border-[#E5E7EB] text-[13px] tabular-nums bg-[#F8FAFC]" />
                </Field>
                <Field label="Received Quantity" required error={touched.receivedQuantity ? errors.receivedQuantity : undefined}>
                    <Input type="number" min="0" step="1" value={data.receivedQuantity} onChange={(e) => setField("receivedQuantity", e.target.value)} onBlur={() => onBlur("receivedQuantity")} placeholder="0" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Rejected Quantity" error={touched.rejectedQuantity ? errors.rejectedQuantity : undefined}>
                    <Input type="number" min="0" step="1" value={data.rejectedQuantity} onChange={(e) => setField("rejectedQuantity", e.target.value)} onBlur={() => onBlur("rejectedQuantity")} placeholder="0" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Remarks" className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} rows={2} placeholder="Quality observations, condition of goods..." className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
