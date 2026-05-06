"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Warehouse } from "lucide-react"
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
import {
    useScmWarehousesStore,
    type ScmWarehouse,
    type WarehouseStatus,
} from "@/shared/data/scm/scm-warehouses-store"
import { validateField } from "@/shared/components/scm/shared/validation"

const STATUSES: WarehouseStatus[] = ["Active", "Inactive"]
const COUNTRIES = ["India", "United States", "United Kingdom", "United Arab Emirates", "Singapore"]

type FormShape = {
    warehouseName: string
    warehouseCode: string
    address: string
    city: string
    state: string
    country: string
    pincode: string
    managerName: string
    contact: string
    storageCapacity: string
    status: WarehouseStatus
}

const empty: FormShape = {
    warehouseName: "",
    warehouseCode: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    managerName: "",
    contact: "",
    storageCapacity: "",
    status: "Active",
}

const REQUIRED: Array<keyof FormShape> = [
    "warehouseName", "warehouseCode", "address", "city", "state",
    "country", "pincode", "managerName", "contact", "storageCapacity", "status",
]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmWarehouse | null
    mode: "create" | "edit"
}

export function WarehouseForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const addWarehouse = useScmWarehousesStore((s) => s.addWarehouse)
    const updateWarehouse = useScmWarehousesStore((s) => s.updateWarehouse)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                warehouseName: initial.warehouseName,
                warehouseCode: initial.warehouseCode,
                address: initial.address,
                city: initial.city,
                state: initial.state,
                country: initial.country,
                pincode: initial.pincode,
                managerName: initial.managerName,
                contact: initial.contact,
                storageCapacity: String(initial.storageCapacity),
                status: initial.status,
            })
        } else {
            setData(empty)
        }
        setErrors({})
        setTouched({})
    }, [open, initial, mode])

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
            if (!next[f] && !String(data[f] ?? "").trim()) {
                next[f] = "This field is required"
            }
        }
        setErrors(next)
        setTouched(Object.fromEntries(fields.map((f) => [f, true])))
        return Object.keys(next).length === 0
    }

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateAll()) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" })
            return
        }
        setSubmitting(true)
        try {
            const payload = {
                warehouseName: data.warehouseName.trim(),
                warehouseCode: data.warehouseCode.trim().toUpperCase(),
                address: data.address.trim(),
                city: data.city.trim(),
                state: data.state.trim(),
                country: data.country,
                pincode: data.pincode.trim(),
                managerName: data.managerName.trim(),
                contact: data.contact.trim(),
                storageCapacity: Number(data.storageCapacity),
                status: data.status,
            }
            if (mode === "edit" && initial) {
                updateWarehouse(initial.id, payload)
                toast({ title: "Warehouse updated", description: payload.warehouseName })
            } else {
                addWarehouse(payload)
                toast({ title: "Warehouse created", description: payload.warehouseName })
            }
            onOpenChange(false)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Warehouse" : "Add Warehouse"}
            description={mode === "edit" ? "Update warehouse details." : "Register a new warehouse location."}
            icon={<Warehouse className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save Changes" : "Create Warehouse"}
            width="lg"
            accentColor="#0ea5e9"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Warehouse Name" required error={touched.warehouseName ? errors.warehouseName : undefined} className="sm:col-span-2">
                    <Input value={data.warehouseName} onChange={(e) => setField("warehouseName", e.target.value)} onBlur={() => onBlur("warehouseName")} placeholder="e.g. Central Warehouse" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="Warehouse Code" required error={touched.warehouseCode ? errors.warehouseCode : undefined}>
                    <Input value={data.warehouseCode} onChange={(e) => setField("warehouseCode", e.target.value.toUpperCase())} onBlur={() => onBlur("warehouseCode")} placeholder="WH-CTL" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>

                <Field label="Status" required error={touched.status ? errors.status : undefined}>
                    <Select value={data.status} onValueChange={(v) => { setField("status", v as WarehouseStatus); setTouched((t) => ({ ...t, status: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>

                <Field label="Address" required error={touched.address ? errors.address : undefined} className="sm:col-span-2">
                    <Textarea value={data.address} onChange={(e) => setField("address", e.target.value)} onBlur={() => onBlur("address")} placeholder="Street, building, area" rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>

                <Field label="City" required error={touched.city ? errors.city : undefined}>
                    <Input value={data.city} onChange={(e) => setField("city", e.target.value)} onBlur={() => onBlur("city")} placeholder="Mumbai" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="State" required error={touched.state ? errors.state : undefined}>
                    <Input value={data.state} onChange={(e) => setField("state", e.target.value)} onBlur={() => onBlur("state")} placeholder="Maharashtra" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="Country" required error={touched.country ? errors.country : undefined}>
                    <Select value={data.country} onValueChange={(v) => { setField("country", v); setTouched((t) => ({ ...t, country: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select country" /></SelectTrigger>
                        <SelectContent>{COUNTRIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>

                <Field label="Pincode" required error={touched.pincode ? errors.pincode : undefined} hint="6 digits">
                    <Input value={data.pincode} onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} onBlur={() => onBlur("pincode")} placeholder="400072" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="Manager Name" required error={touched.managerName ? errors.managerName : undefined}>
                    <Input value={data.managerName} onChange={(e) => setField("managerName", e.target.value)} onBlur={() => onBlur("managerName")} placeholder="Rohit Sharma" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="Manager Contact" required error={touched.contact ? errors.contact : undefined} hint="10–15 digits, optional +">
                    <Input value={data.contact} onChange={(e) => setField("contact", e.target.value)} onBlur={() => onBlur("contact")} placeholder="+919812345678" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>

                <Field label="Storage Capacity" required error={touched.storageCapacity ? errors.storageCapacity : undefined} hint="Total units" className="sm:col-span-2">
                    <Input type="number" min="0" step="1" value={data.storageCapacity} onChange={(e) => setField("storageCapacity", e.target.value)} onBlur={() => onBlur("storageCapacity")} placeholder="20000" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
