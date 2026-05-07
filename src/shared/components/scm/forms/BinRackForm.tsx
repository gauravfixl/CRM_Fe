"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { LayoutGrid } from "lucide-react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Input } from "@/shared/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmWarehousesStore } from "@/shared/data/scm/scm-warehouses-store"
import { useScmProductsStore } from "@/shared/data/scm/scm-products-store"
import {
    useScmWarehouseOpsStore,
    BIN_STATUSES,
    ZONES,
    type ScmBin,
    type BinStatus,
} from "@/shared/data/scm/scm-warehouse-ops-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    warehouse: string
    zone: string
    rackNumber: string
    binNumber: string
    capacity: string
    productAssigned: string
    status: BinStatus
}

const empty: FormShape = {
    warehouse: "",
    zone: "Zone A",
    rackNumber: "",
    binNumber: "",
    capacity: "",
    productAssigned: "—",
    status: "Available",
}

const REQUIRED: Array<keyof FormShape> = ["warehouse", "zone", "rackNumber", "binNumber", "capacity", "status"]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmBin | null
    mode: "create" | "edit"
}

export function BinRackForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const warehouses = useScmWarehousesStore((s) => s.warehouses)
    const products = useScmProductsStore((s) => s.products)
    const addBin = useScmWarehouseOpsStore((s) => s.addBin)
    const updateBin = useScmWarehouseOpsStore((s) => s.updateBin)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                warehouse: initial.warehouse,
                zone: initial.zone,
                rackNumber: initial.rackNumber,
                binNumber: initial.binNumber,
                capacity: String(initial.capacity),
                productAssigned: initial.productAssigned || "—",
                status: initial.status,
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
                warehouse: data.warehouse,
                zone: data.zone,
                rackNumber: data.rackNumber.trim().toUpperCase(),
                binNumber: data.binNumber.trim().toUpperCase(),
                capacity: Number(data.capacity),
                productAssigned: data.productAssigned,
                status: data.status,
            }
            if (mode === "edit" && initial) {
                updateBin(initial.id, payload)
                toast({ title: "Bin updated", description: payload.binNumber })
            } else {
                addBin(payload)
                toast({ title: "Bin created", description: payload.binNumber })
            }
            onOpenChange(false)
        } finally { setSubmitting(false) }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Bin / Rack" : "Add Bin / Rack"}
            description="Storage location inside a warehouse."
            icon={<LayoutGrid className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save" : "Create"}
            width="md"
            accentColor="#0ea5e9"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Warehouse" required error={touched.warehouse ? errors.warehouse : undefined} className="sm:col-span-2">
                    <Select value={data.warehouse} onValueChange={(v) => { setField("warehouse", v); setTouched((t) => ({ ...t, warehouse: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                        <SelectContent>
                            {warehouses.map((w) => <SelectItem key={w.id} value={w.warehouseName}>{w.warehouseName}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="Zone" required>
                    <Select value={data.zone} onValueChange={(v) => setField("zone", v)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Rack Number" required error={touched.rackNumber ? errors.rackNumber : undefined}>
                    <Input value={data.rackNumber} onChange={(e) => setField("rackNumber", e.target.value.toUpperCase())} onBlur={() => onBlur("rackNumber")} placeholder="R-01" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Bin Number" required error={touched.binNumber ? errors.binNumber : undefined}>
                    <Input value={data.binNumber} onChange={(e) => setField("binNumber", e.target.value.toUpperCase())} onBlur={() => onBlur("binNumber")} placeholder="B-101" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Capacity (units)" required error={touched.capacity ? errors.capacity : undefined}>
                    <Input type="number" min="0" step="1" value={data.capacity} onChange={(e) => setField("capacity", e.target.value)} onBlur={() => onBlur("capacity")} placeholder="200" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Status" required>
                    <Select value={data.status} onValueChange={(v) => setField("status", v as BinStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{BIN_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Product Assigned" className="sm:col-span-2">
                    <Select value={data.productAssigned} onValueChange={(v) => setField("productAssigned", v)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="—">— (Unassigned)</SelectItem>
                            {products.map((p) => <SelectItem key={p.id} value={p.sku}>{p.sku} · {p.productName}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </Field>
            </div>
        </SideFormSheet>
    )
}
