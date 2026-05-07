"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { FileSignature } from "lucide-react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { useScmVendorsStore, PAYMENT_TERMS } from "@/shared/data/scm/scm-vendors-store"
import {
    useScmVendorExtraStore, CONTRACT_STATUSES,
    type ScmVendorContract, type ContractStatus,
} from "@/shared/data/scm/scm-vendor-extra-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    contractNumber: string
    vendorId: string
    contractStartDate: string
    contractEndDate: string
    contractValue: string
    paymentTerms: string
    renewalReminderDate: string
    status: ContractStatus
    remarks: string
}

const empty: FormShape = {
    contractNumber: "", vendorId: "",
    contractStartDate: "", contractEndDate: "",
    contractValue: "", paymentTerms: "Net 30",
    renewalReminderDate: "", status: "Active", remarks: "",
}

const REQUIRED: Array<keyof FormShape> = ["contractNumber", "vendorId", "contractStartDate", "contractEndDate", "contractValue", "paymentTerms", "renewalReminderDate", "status"]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmVendorContract | null
    mode: "create" | "edit"
}

export function VendorContractForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const vendors = useScmVendorsStore((s) => s.vendors)
    const addContract = useScmVendorExtraStore((s) => s.addContract)
    const updateContract = useScmVendorExtraStore((s) => s.updateContract)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                contractNumber: initial.contractNumber, vendorId: initial.vendorId,
                contractStartDate: initial.contractStartDate, contractEndDate: initial.contractEndDate,
                contractValue: String(initial.contractValue), paymentTerms: initial.paymentTerms,
                renewalReminderDate: initial.renewalReminderDate, status: initial.status, remarks: initial.remarks,
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
        if (data.contractStartDate && data.contractEndDate && data.contractStartDate > data.contractEndDate) {
            next.contractEndDate = "End date must be after start date"
        }
        if (!next.contractValue && Number(data.contractValue) < 0) next.contractValue = "Cannot be negative"
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
            const vendor = vendors.find((v) => v.id === data.vendorId)
            const payload = {
                contractNumber: data.contractNumber.trim().toUpperCase(),
                vendorId: data.vendorId,
                vendorName: vendor?.vendorName ?? "",
                contractStartDate: data.contractStartDate,
                contractEndDate: data.contractEndDate,
                contractValue: Number(data.contractValue),
                paymentTerms: data.paymentTerms,
                renewalReminderDate: data.renewalReminderDate,
                status: data.status,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && initial) {
                updateContract(initial.id, payload)
                toast({ title: "Contract updated", description: payload.contractNumber })
            } else {
                addContract(payload)
                toast({ title: "Contract created", description: payload.contractNumber })
            }
            onOpenChange(false)
        } finally { setSubmitting(false) }
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={mode === "edit" ? "Edit Contract" : "New Vendor Contract"}
            description="Track agreement details, value, and renewal reminders."
            icon={<FileSignature className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save" : "Create Contract"}
            width="lg"
            accentColor="#8b5cf6"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Contract Number" required error={touched.contractNumber ? errors.contractNumber : undefined}>
                    <Input value={data.contractNumber} onChange={(e) => setField("contractNumber", e.target.value.toUpperCase())} onBlur={() => onBlur("contractNumber")} placeholder="VC-2026-110" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Status" required>
                    <Select value={data.status} onValueChange={(v) => setField("status", v as ContractStatus)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{CONTRACT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Vendor" required error={touched.vendorId ? errors.vendorId : undefined} className="sm:col-span-2">
                    <Select value={data.vendorId} onValueChange={(v) => { setField("vendorId", v); setTouched((t) => ({ ...t, vendorId: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                        <SelectContent>{vendors.map((v) => <SelectItem key={v.id} value={v.id}>{v.vendorName}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Start Date" required error={touched.contractStartDate ? errors.contractStartDate : undefined}>
                    <Input type="date" value={data.contractStartDate} onChange={(e) => setField("contractStartDate", e.target.value)} onBlur={() => onBlur("contractStartDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="End Date" required error={touched.contractEndDate ? errors.contractEndDate : undefined}>
                    <Input type="date" value={data.contractEndDate} onChange={(e) => setField("contractEndDate", e.target.value)} onBlur={() => onBlur("contractEndDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Contract Value (₹)" required error={touched.contractValue ? errors.contractValue : undefined}>
                    <Input type="number" min="0" step="0.01" value={data.contractValue} onChange={(e) => setField("contractValue", e.target.value)} onBlur={() => onBlur("contractValue")} placeholder="0.00" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                </Field>
                <Field label="Payment Terms" required>
                    <Select value={data.paymentTerms} onValueChange={(v) => setField("paymentTerms", v)}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{PAYMENT_TERMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                    </Select>
                </Field>
                <Field label="Renewal Reminder Date" required error={touched.renewalReminderDate ? errors.renewalReminderDate : undefined} className="sm:col-span-2">
                    <Input type="date" value={data.renewalReminderDate} onChange={(e) => setField("renewalReminderDate", e.target.value)} onBlur={() => onBlur("renewalReminderDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Remarks" className="sm:col-span-2">
                    <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                </Field>
            </div>
        </SideFormSheet>
    )
}
