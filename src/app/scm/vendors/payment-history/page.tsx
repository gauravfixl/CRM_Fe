"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, Download, CreditCard } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { useScmVendorsStore } from "@/shared/data/scm/scm-vendors-store"
import {
    useScmVendorExtraStore, PAYMENT_METHODS, PAYMENT_STATUSES,
    type ScmVendorPayment, type PaymentMethod, type PaymentStatus,
} from "@/shared/data/scm/scm-vendor-extra-store"
import { validateField } from "@/shared/components/scm/shared/validation"

const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n)

type FormShape = {
    paymentId: string
    vendorId: string
    invoiceNumber: string
    poNumber: string
    amount: string
    paymentDate: string
    paymentMethod: PaymentMethod
    paymentStatus: PaymentStatus
    remarks: string
}

const todayStr = () => new Date().toISOString().slice(0, 10)
const empty: FormShape = {
    paymentId: "", vendorId: "", invoiceNumber: "", poNumber: "",
    amount: "", paymentDate: todayStr(),
    paymentMethod: "Bank Transfer", paymentStatus: "Pending", remarks: "",
}

const REQUIRED: Array<keyof FormShape> = ["paymentId", "vendorId", "invoiceNumber", "amount", "paymentDate", "paymentMethod", "paymentStatus"]

export default function VendorPaymentsPage() {
    const { toast } = useToast()
    const vendors = useScmVendorsStore((s) => s.vendors)
    const payments = useScmVendorExtraStore((s) => s.payments)
    const addPayment = useScmVendorExtraStore((s) => s.addPayment)
    const updatePayment = useScmVendorExtraStore((s) => s.updatePayment)
    const deletePayment = useScmVendorExtraStore((s) => s.deletePayment)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmVendorPayment | null>(null)
    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [deleting, setDeleting] = useState<ScmVendorPayment | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [viewing, setViewing] = useState<ScmVendorPayment | null>(null)

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setData({
                paymentId: editing.paymentId, vendorId: editing.vendorId,
                invoiceNumber: editing.invoiceNumber, poNumber: editing.poNumber,
                amount: String(editing.amount), paymentDate: editing.paymentDate,
                paymentMethod: editing.paymentMethod, paymentStatus: editing.paymentStatus,
                remarks: editing.remarks,
            })
        } else setData(empty)
        setErrors({}); setTouched({})
    }, [formOpen, editing, mode])

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
        if (!next.amount && Number(data.amount) <= 0) next.amount = "Must be greater than 0"
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
                paymentId: data.paymentId.trim().toUpperCase(),
                vendorId: data.vendorId,
                vendorName: vendor?.vendorName ?? "",
                invoiceNumber: data.invoiceNumber.trim(),
                poNumber: data.poNumber.trim().toUpperCase(),
                amount: Number(data.amount),
                paymentDate: data.paymentDate,
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                remarks: data.remarks.trim(),
            }
            if (mode === "edit" && editing) {
                updatePayment(editing.id, payload)
                toast({ title: "Payment updated", description: payload.paymentId })
            } else {
                addPayment(payload)
                toast({ title: "Payment recorded", description: payload.paymentId })
            }
            setFormOpen(false)
        } finally { setSubmitting(false) }
    }

    const columns: DataTableColumn<ScmVendorPayment>[] = useMemo(
        () => [
            { key: "paymentId", header: "Payment ID", width: "120px", sortable: true, render: (r) => <span className="font-semibold">{r.paymentId}</span> },
            { key: "vendorName", header: "Vendor", sortable: true },
            { key: "invoiceNumber", header: "Invoice", sortable: true, width: "140px" },
            { key: "poNumber", header: "PO", width: "110px" },
            { key: "amount", header: "Amount", width: "140px", align: "right", sortable: true, accessor: (r) => r.amount, render: (r) => <span className="tabular-nums font-semibold">{formatINR(r.amount)}</span> },
            { key: "paymentDate", header: "Date", width: "110px", sortable: true, render: (r) => <span className="tabular-nums">{r.paymentDate}</span> },
            { key: "paymentMethod", header: "Method", width: "130px" },
            { key: "paymentStatus", header: "Status", width: "100px", render: (r) => <StatusBadge status={r.paymentStatus} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (p: ScmVendorPayment) => { setEditing(p); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => { if (!deleting) return; deletePayment(deleting.id); toast({ title: "Payment deleted", description: deleting.paymentId }); setDeleting(null) }
    const handleExport = () => {
        if (payments.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Payment ID", "Vendor", "Invoice", "PO", "Amount", "Date", "Method", "Status", "Remarks"]
        const rows = payments.map((p) => [p.paymentId, p.vendorName, p.invoiceNumber, p.poNumber, p.amount, p.paymentDate, p.paymentMethod, p.paymentStatus, p.remarks])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-vendor-payments-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} payments exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Vendor Payment History</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Track payments made to vendors against invoices and POs.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#10b981", boxShadow: "0 4px 12px #10b98133" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> Record Payment
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={payments}
                rowKey={(r) => r.id}
                searchPlaceholder="Search by payment, vendor, invoice..."
                searchKeys={["paymentId", "vendorName", "invoiceNumber", "poNumber"]}
                pageSize={10}
                emptyMessage="No payments recorded yet."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => <RowActions onEdit={() => handleEdit(row)} onDelete={() => setDeleting(row)} />}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.paymentId}
                description={(r) => `${r.vendorName} · ${r.invoiceNumber}`}
                icon={<CreditCard className="w-5 h-5" />}
                accentColor="#10b981"
            />

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={mode === "edit" ? "Edit Payment" : "Record Payment"}
                description="Capture payment to a vendor."
                icon={<CreditCard className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Record"}
                width="lg"
                accentColor="#10b981"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Payment ID" required error={touched.paymentId ? errors.paymentId : undefined}>
                        <Input value={data.paymentId} onChange={(e) => setField("paymentId", e.target.value.toUpperCase())} onBlur={() => onBlur("paymentId")} placeholder="PAY-7830" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                    </Field>
                    <Field label="Vendor" required error={touched.vendorId ? errors.vendorId : undefined}>
                        <Select value={data.vendorId} onValueChange={(v) => { setField("vendorId", v); setTouched((t) => ({ ...t, vendorId: true })) }}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                            <SelectContent>{vendors.map((v) => <SelectItem key={v.id} value={v.id}>{v.vendorName}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Invoice Number" required error={touched.invoiceNumber ? errors.invoiceNumber : undefined}>
                        <Input value={data.invoiceNumber} onChange={(e) => setField("invoiceNumber", e.target.value)} onBlur={() => onBlur("invoiceNumber")} placeholder="INV-XX-1234" className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="PO Number">
                        <Input value={data.poNumber} onChange={(e) => setField("poNumber", e.target.value.toUpperCase())} placeholder="PO-2087" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                    </Field>
                    <Field label="Amount (₹)" required error={touched.amount ? errors.amount : undefined}>
                        <Input type="number" min="0" step="0.01" value={data.amount} onChange={(e) => setField("amount", e.target.value)} onBlur={() => onBlur("amount")} placeholder="0.00" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                    </Field>
                    <Field label="Payment Date" required error={touched.paymentDate ? errors.paymentDate : undefined}>
                        <Input type="date" value={data.paymentDate} onChange={(e) => setField("paymentDate", e.target.value)} onBlur={() => onBlur("paymentDate")} className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="Method" required>
                        <Select value={data.paymentMethod} onValueChange={(v) => setField("paymentMethod", v as PaymentMethod)}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{PAYMENT_METHODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Status" required>
                        <Select value={data.paymentStatus} onValueChange={(v) => setField("paymentStatus", v as PaymentStatus)}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{PAYMENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Remarks" className="sm:col-span-2">
                        <Textarea value={data.remarks} onChange={(e) => setField("remarks", e.target.value)} rows={2} className="border-[#E5E7EB] text-[13px] resize-none" />
                    </Field>
                </div>
            </SideFormSheet>

            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this payment?" itemLabel={deleting ? deleting.paymentId : ""} onConfirm={confirmDelete} />
        </div>
    )
}
