"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Users } from "lucide-react"
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
    useScmVendorsStore,
    VENDOR_CATEGORIES,
    PAYMENT_TERMS,
    type ScmVendor,
    type VendorStatus,
} from "@/shared/data/scm/scm-vendors-store"
import { validateField } from "@/shared/components/scm/shared/validation"

const STATUSES: VendorStatus[] = ["Active", "Inactive"]
const COUNTRIES = ["India", "United States", "United Kingdom", "United Arab Emirates", "Singapore"]

type FormShape = {
    vendorName: string
    vendorCode: string
    category: string
    contactPerson: string
    phone: string
    email: string
    website: string
    gstin: string
    address: string
    city: string
    state: string
    country: string
    pincode: string
    bankName: string
    accountNumber: string
    ifsc: string
    paymentTerms: string
    status: VendorStatus
}

const empty: FormShape = {
    vendorName: "",
    vendorCode: "",
    category: "",
    contactPerson: "",
    phone: "",
    email: "",
    website: "",
    gstin: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
    paymentTerms: "Net 30",
    status: "Active",
}

const REQUIRED: Array<keyof FormShape> = [
    "vendorName", "vendorCode", "category", "contactPerson",
    "phone", "email", "address", "city", "state", "country", "pincode",
    "paymentTerms", "status",
]

interface Props {
    open: boolean
    onOpenChange: (o: boolean) => void
    initial?: ScmVendor | null
    mode: "create" | "edit"
}

export function VendorForm({ open, onOpenChange, initial, mode }: Props) {
    const { toast } = useToast()
    const addVendor = useScmVendorsStore((s) => s.addVendor)
    const updateVendor = useScmVendorsStore((s) => s.updateVendor)

    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (!open) return
        if (initial && mode === "edit") {
            setData({
                vendorName: initial.vendorName,
                vendorCode: initial.vendorCode,
                category: initial.category,
                contactPerson: initial.contactPerson,
                phone: initial.phone,
                email: initial.email,
                website: initial.website,
                gstin: initial.gstin,
                address: initial.address,
                city: initial.city,
                state: initial.state,
                country: initial.country,
                pincode: initial.pincode,
                bankName: initial.bankName,
                accountNumber: initial.accountNumber,
                ifsc: initial.ifsc,
                paymentTerms: initial.paymentTerms,
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
            if (!next[f] && !String(data[f] ?? "").trim()) next[f] = "This field is required"
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
                ...data,
                vendorName: data.vendorName.trim(),
                vendorCode: data.vendorCode.trim().toUpperCase(),
                contactPerson: data.contactPerson.trim(),
                phone: data.phone.trim(),
                email: data.email.trim(),
                website: data.website.trim(),
                gstin: data.gstin.trim().toUpperCase(),
                address: data.address.trim(),
                city: data.city.trim(),
                state: data.state.trim(),
                pincode: data.pincode.trim(),
                bankName: data.bankName.trim(),
                accountNumber: data.accountNumber.trim(),
                ifsc: data.ifsc.trim().toUpperCase(),
            }
            if (mode === "edit" && initial) {
                updateVendor(initial.id, payload)
                toast({ title: "Vendor updated", description: payload.vendorName })
            } else {
                addVendor(payload)
                toast({ title: "Vendor created", description: payload.vendorName })
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
            title={mode === "edit" ? "Edit Vendor" : "Add Vendor"}
            description={mode === "edit" ? "Update vendor details." : "Register a new supplier or vendor."}
            icon={<Users className="w-5 h-5" />}
            onSubmit={onSubmit}
            loading={submitting}
            submitLabel={mode === "edit" ? "Save Changes" : "Create Vendor"}
            width="xl"
            accentColor="#8b5cf6"
        >
            <SectionHeader>Basic Info</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Vendor Name" required error={touched.vendorName ? errors.vendorName : undefined} className="sm:col-span-2">
                    <Input value={data.vendorName} onChange={(e) => setField("vendorName", e.target.value)} onBlur={() => onBlur("vendorName")} placeholder="e.g. PaperCo Industries" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Vendor Code" required error={touched.vendorCode ? errors.vendorCode : undefined}>
                    <Input value={data.vendorCode} onChange={(e) => setField("vendorCode", e.target.value.toUpperCase())} onBlur={() => onBlur("vendorCode")} placeholder="VND-PC01" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
                <Field label="Category" required error={touched.category ? errors.category : undefined}>
                    <Select value={data.category} onValueChange={(v) => { setField("category", v); setTouched((t) => ({ ...t, category: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>{VENDOR_CATEGORIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
                <Field label="Status" required error={touched.status ? errors.status : undefined}>
                    <Select value={data.status} onValueChange={(v) => { setField("status", v as VendorStatus); setTouched((t) => ({ ...t, status: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select status" /></SelectTrigger>
                        <SelectContent>{STATUSES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
                <Field label="Payment Terms" required error={touched.paymentTerms ? errors.paymentTerms : undefined}>
                    <Select value={data.paymentTerms} onValueChange={(v) => { setField("paymentTerms", v); setTouched((t) => ({ ...t, paymentTerms: true })) }}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select terms" /></SelectTrigger>
                        <SelectContent>{PAYMENT_TERMS.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
            </div>

            <SectionHeader className="mt-6">Contact</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Contact Person" required error={touched.contactPerson ? errors.contactPerson : undefined}>
                    <Input value={data.contactPerson} onChange={(e) => setField("contactPerson", e.target.value)} onBlur={() => onBlur("contactPerson")} placeholder="Suresh Mehta" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Phone" required error={touched.phone ? errors.phone : undefined}>
                    <Input value={data.phone} onChange={(e) => setField("phone", e.target.value)} onBlur={() => onBlur("phone")} placeholder="+919812340001" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Email" required error={touched.email ? errors.email : undefined}>
                    <Input type="email" value={data.email} onChange={(e) => setField("email", e.target.value)} onBlur={() => onBlur("email")} placeholder="sales@paperco.in" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Website" error={touched.website ? errors.website : undefined} hint="Include http(s)://">
                    <Input value={data.website} onChange={(e) => setField("website", e.target.value)} onBlur={() => onBlur("website")} placeholder="https://paperco.in" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="GSTIN" error={touched.gstin ? errors.gstin : undefined} hint="15-char GSTIN format">
                    <Input value={data.gstin} onChange={(e) => setField("gstin", e.target.value.toUpperCase())} onBlur={() => onBlur("gstin")} placeholder="27AABCP1234F1Z5" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
            </div>

            <SectionHeader className="mt-6">Address</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                        <SelectContent>{COUNTRIES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                    </Select>
                </Field>
                <Field label="Pincode" required error={touched.pincode ? errors.pincode : undefined}>
                    <Input value={data.pincode} onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} onBlur={() => onBlur("pincode")} placeholder="400093" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
            </div>

            <SectionHeader className="mt-6">Banking (optional)</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Bank Name" error={touched.bankName ? errors.bankName : undefined}>
                    <Input value={data.bankName} onChange={(e) => setField("bankName", e.target.value)} onBlur={() => onBlur("bankName")} placeholder="HDFC Bank" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="Account Number" error={touched.accountNumber ? errors.accountNumber : undefined}>
                    <Input value={data.accountNumber} onChange={(e) => setField("accountNumber", e.target.value.replace(/\D/g, ""))} onBlur={() => onBlur("accountNumber")} placeholder="501023456789" className="h-10 border-[#E5E7EB] text-[13px]" />
                </Field>
                <Field label="IFSC" error={touched.ifsc ? errors.ifsc : undefined} className="sm:col-span-2">
                    <Input value={data.ifsc} onChange={(e) => setField("ifsc", e.target.value.toUpperCase())} onBlur={() => onBlur("ifsc")} placeholder="HDFC0001234" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                </Field>
            </div>
        </SideFormSheet>
    )
}

function SectionHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <h4 className={`text-[12px] font-semibold uppercase tracking-wide text-[#64748B] mb-3 ${className}`}>
            {children}
        </h4>
    )
}
