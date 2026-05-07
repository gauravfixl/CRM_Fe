"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, Pencil, Trash2, MoreHorizontal, Hash, RotateCcw, Receipt } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { useToast } from "@/shared/components/ui/use-toast"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { useAdminSettingsStore, type NumberingScheme } from "@/shared/data/admin-settings-store"
import { validateField } from "@/shared/components/admin-settings/validation"

const RESET_FREQ: NumberingScheme["resetFrequency"][] = ["Never", "Yearly", "Monthly", "Daily"]
const STATUSES: NumberingScheme["status"][] = ["Active", "Inactive"]
const COMMON_DOCS = ["Invoice", "Quotation", "Purchase Order", "Sales Order", "Delivery Note", "Receipt", "Customer ID", "Vendor ID", "Project ID", "Lead ID"]

type FormShape = {
    documentType: string
    prefix: string
    suffix: string
    padding: string
    nextNumber: string
    resetFrequency: NumberingScheme["resetFrequency"]
    status: NumberingScheme["status"]
}

const empty: FormShape = {
    documentType: "Invoice", prefix: "INV-", suffix: "", padding: "4", nextNumber: "1",
    resetFrequency: "Yearly", status: "Active",
}

export default function NumberingSchemesPage() {
    const { toast } = useToast()
    const schemes = useAdminSettingsStore((s) => s.numberingSchemes)
    const addNumberingScheme = useAdminSettingsStore((s) => s.addNumberingScheme)
    const updateNumberingScheme = useAdminSettingsStore((s) => s.updateNumberingScheme)
    const deleteNumberingScheme = useAdminSettingsStore((s) => s.deleteNumberingScheme)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<NumberingScheme | null>(null)
    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)
    const [deleting, setDeleting] = useState<NumberingScheme | null>(null)
    const [resetting, setResetting] = useState<NumberingScheme | null>(null)

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setData({
                documentType: editing.documentType, prefix: editing.prefix, suffix: editing.suffix,
                padding: String(editing.padding), nextNumber: String(editing.nextNumber),
                resetFrequency: editing.resetFrequency, status: editing.status,
            })
        } else setData(empty)
        setErrors({}); setTouched({})
    }, [formOpen, editing, mode])

    const setField = (k: keyof FormShape, v: string) => {
        setData((d) => ({ ...d, [k]: v as any }))
        if (touched[k as string]) setErrors((e) => ({ ...e, [k]: validateField(k as string, v) ?? "" }))
    }
    const onBlur = (k: keyof FormShape) => {
        setTouched((t) => ({ ...t, [k]: true }))
        setErrors((e) => ({ ...e, [k]: validateField(k as string, data[k]) ?? "" }))
    }

    const validate = () => {
        const next: Record<string, string> = {}
        if (!data.documentType.trim()) next.documentType = "Document type is required"
        const prefixErr = validateField("prefix", data.prefix)
        if (prefixErr) next.prefix = prefixErr
        const suffixErr = validateField("suffix", data.suffix)
        if (suffixErr) next.suffix = suffixErr
        const paddingErr = validateField("padding", data.padding)
        if (paddingErr) next.padding = paddingErr
        const nextErr = validateField("nextNumber", data.nextNumber)
        if (nextErr) next.nextNumber = nextErr
        if (!data.nextNumber) next.nextNumber = "Next number is required"
        setErrors(next)
        setTouched({ documentType: true, prefix: true, suffix: true, padding: true, nextNumber: true })
        return Object.keys(next).length === 0
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) { toast({ title: "Please fix the highlighted fields", variant: "destructive" }); return }
        setSubmitting(true)
        try {
            const payload = {
                documentType: data.documentType.trim(),
                prefix: data.prefix.trim().toUpperCase(),
                suffix: data.suffix.trim().toUpperCase(),
                padding: Number(data.padding) || 0,
                nextNumber: Number(data.nextNumber) || 1,
                resetFrequency: data.resetFrequency,
                status: data.status,
            }
            if (mode === "edit" && editing) {
                updateNumberingScheme(editing.id, payload)
                toast({ title: "Scheme updated", description: payload.documentType })
            } else {
                addNumberingScheme(payload)
                toast({ title: "Scheme added", description: payload.documentType })
            }
            setFormOpen(false)
        } finally { setSubmitting(false) }
    }

    const livePreview = useMemo(() => {
        const n = String(Number(data.nextNumber) || 0).padStart(Number(data.padding) || 0, "0")
        return `${data.prefix}${n}${data.suffix}`
    }, [data.prefix, data.suffix, data.padding, data.nextNumber])

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-[#10b981]" /> Numbering Schemes
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Auto-generated number formats for invoices, POs, customer IDs, and more.</p>
                </div>
                <Button onClick={() => { setEditing(null); setMode("create"); setFormOpen(true) }} className="h-9 px-3 rounded-none text-white text-[13px]" style={{ backgroundColor: "#10b981", boxShadow: "0 4px 12px #10b98133" }}>
                    <Plus className="w-4 h-4 mr-1.5" /> New Scheme
                </Button>
            </div>

            <div className="bg-white border border-[#EEF1F6] shadow-sm overflow-hidden rounded-none">
                <table className="w-full text-[13px]">
                    <thead className="bg-[#F8FAFC] border-b border-[#EEF1F6]">
                        <tr>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B]">Document Type</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[120px]">Prefix</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[100px]">Padding</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[120px]">Next #</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B]">Sample Output</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[110px]">Reset</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[100px]">Status</th>
                            <th className="w-[80px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {schemes.length === 0 ? (
                            <tr><td colSpan={8} className="text-center py-12 text-[#94A3B8] text-[13px]">No numbering schemes defined.</td></tr>
                        ) : schemes.map((s) => (
                            <tr key={s.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#FAFBFC]">
                                <td className="px-4 py-2.5 font-semibold text-[#0F172A]">{s.documentType}</td>
                                <td className="px-4 py-2.5 font-mono text-[12.5px] text-[#0F172A]">{s.prefix}{s.suffix && ` … ${s.suffix}`}</td>
                                <td className="px-4 py-2.5 tabular-nums text-[#64748B]">{s.padding}</td>
                                <td className="px-4 py-2.5 tabular-nums text-[#0F172A] font-semibold">{s.nextNumber.toLocaleString()}</td>
                                <td className="px-4 py-2.5">
                                    <span className="font-mono font-bold text-[13px] text-[#10b981] px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-none">{s.sample}</span>
                                </td>
                                <td className="px-4 py-2.5 text-[#64748B]">{s.resetFrequency}</td>
                                <td className="px-4 py-2.5">
                                    <span className="inline-flex items-center px-2 py-0.5 border text-[11.5px] font-semibold rounded-none" style={{
                                        background: s.status === "Active" ? "rgba(16,185,129,0.08)" : "rgba(148,163,184,0.10)",
                                        borderColor: s.status === "Active" ? "rgba(16,185,129,0.30)" : "rgba(148,163,184,0.30)",
                                        color: s.status === "Active" ? "#047857" : "#475569",
                                    }}>{s.status}</span>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-none">
                                                <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuItem onClick={() => { setEditing(s); setMode("edit"); setFormOpen(true) }} className="text-[13px] cursor-pointer">
                                                <Pencil className="w-4 h-4 mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setResetting(s)} className="text-[13px] cursor-pointer">
                                                <RotateCcw className="w-4 h-4 mr-2" /> Reset Counter
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => setDeleting(s)} className="text-[13px] cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={mode === "edit" ? "Edit Numbering Scheme" : "Add Numbering Scheme"}
                description="Define how the system auto-generates numbers for a document type."
                icon={<Hash className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Add"}
                width="md"
                accentColor="#10b981"
            >
                <div className="space-y-4">
                    <Field label="Document Type" required error={touched.documentType ? errors.documentType : undefined}>
                        <Select value={COMMON_DOCS.includes(data.documentType) ? data.documentType : "__custom__"} onValueChange={(v) => {
                            if (v !== "__custom__") setField("documentType", v)
                        }}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {COMMON_DOCS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                <SelectItem value="__custom__">Custom (type below)</SelectItem>
                            </SelectContent>
                        </Select>
                        {!COMMON_DOCS.includes(data.documentType) && (
                            <Input value={data.documentType} onChange={(e) => setField("documentType", e.target.value)} placeholder="Custom document type" className="h-10 border-[#E5E7EB] text-[13px] rounded-none mt-2" />
                        )}
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Prefix" error={touched.prefix ? errors.prefix : undefined}>
                            <Input value={data.prefix} onChange={(e) => setField("prefix", e.target.value.toUpperCase())} onBlur={() => onBlur("prefix")} placeholder="INV-" className="h-10 border-[#E5E7EB] text-[13px] uppercase font-mono rounded-none" />
                        </Field>
                        <Field label="Suffix" error={touched.suffix ? errors.suffix : undefined}>
                            <Input value={data.suffix} onChange={(e) => setField("suffix", e.target.value.toUpperCase())} onBlur={() => onBlur("suffix")} placeholder="-FY26" className="h-10 border-[#E5E7EB] text-[13px] uppercase font-mono rounded-none" />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Padding (zeros)" required error={touched.padding ? errors.padding : undefined} hint="0–12 leading zeros">
                            <Input type="number" min="0" max="12" value={data.padding} onChange={(e) => setField("padding", e.target.value)} onBlur={() => onBlur("padding")} className="h-10 border-[#E5E7EB] text-[13px] tabular-nums rounded-none" />
                        </Field>
                        <Field label="Next Number" required error={touched.nextNumber ? errors.nextNumber : undefined}>
                            <Input type="number" min="0" value={data.nextNumber} onChange={(e) => setField("nextNumber", e.target.value)} onBlur={() => onBlur("nextNumber")} className="h-10 border-[#E5E7EB] text-[13px] tabular-nums rounded-none" />
                        </Field>
                    </div>
                    <Field label="Reset Frequency" required>
                        <Select value={data.resetFrequency} onValueChange={(v) => setField("resetFrequency", v as NumberingScheme["resetFrequency"])}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{RESET_FREQ.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Status" required>
                        <Select value={data.status} onValueChange={(v) => setField("status", v as NumberingScheme["status"])}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>

                    <div className="border bg-emerald-50 border-emerald-200 p-3 rounded-none">
                        <p className="text-[11px] uppercase tracking-wide font-semibold text-emerald-700">Live Preview</p>
                        <p className="text-[20px] font-bold font-mono text-emerald-700 mt-1">{livePreview}</p>
                        <p className="text-[11px] text-emerald-700/80 mt-1">Will reset {data.resetFrequency.toLowerCase()}.</p>
                    </div>
                </div>
            </SideFormSheet>

            <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this scheme?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span>You are about to delete the <span className="font-semibold text-[#0F172A]">{deleting?.documentType}</span> numbering scheme. New documents will need a new scheme.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (!deleting) return
                                deleteNumberingScheme(deleting.id)
                                toast({ title: "Scheme deleted", description: deleting.documentType })
                                setDeleting(null)
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={!!resetting} onOpenChange={(o) => !o && setResetting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset counter to 1?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span>This sets the <span className="font-semibold text-[#0F172A]">{resetting?.documentType}</span> next-number back to 1. Future documents will start from <span className="font-mono">{resetting?.prefix}{"1".padStart(resetting?.padding || 0, "0")}{resetting?.suffix}</span>.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (!resetting) return
                                updateNumberingScheme(resetting.id, { nextNumber: 1 })
                                toast({ title: "Counter reset", description: `${resetting.documentType} → starts from 1` })
                                setResetting(null)
                            }}
                            className="bg-amber-600 hover:bg-amber-700"
                        >
                            Reset
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
