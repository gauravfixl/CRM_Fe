"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, Pencil, Trash2, MoreHorizontal, FileText, Search, Eye, Copy } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
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
import { useAdminSettingsStore, type DocumentTemplate } from "@/shared/data/admin-settings-store"
import { validateField } from "@/shared/components/admin-settings/validation"
import { useFormatDate } from "@/shared/hooks/useAdminFormatters"

const TYPES: DocumentTemplate["type"][] = ["Invoice", "Quotation", "Purchase Order", "Delivery Note", "Receipt", "Letter"]
const PAPER_SIZES: DocumentTemplate["paperSize"][] = ["A4", "Letter", "Legal"]
const ORIENTATIONS: DocumentTemplate["orientation"][] = ["Portrait", "Landscape"]
const STATUSES: DocumentTemplate["status"][] = ["Active", "Inactive"]

type FormShape = {
    templateName: string
    code: string
    type: DocumentTemplate["type"]
    headerText: string
    footerText: string
    paperSize: DocumentTemplate["paperSize"]
    orientation: DocumentTemplate["orientation"]
    status: DocumentTemplate["status"]
}

const empty: FormShape = {
    templateName: "", code: "", type: "Invoice",
    headerText: "", footerText: "", paperSize: "A4", orientation: "Portrait", status: "Active",
}

const REQUIRED: Array<keyof FormShape> = ["templateName", "code", "type", "paperSize", "orientation", "status"]

export default function DocumentTemplatesPage() {
    const { toast } = useToast()
    const templates = useAdminSettingsStore((s) => s.documentTemplates)
    const addDocumentTemplate = useAdminSettingsStore((s) => s.addDocumentTemplate)
    const updateDocumentTemplate = useAdminSettingsStore((s) => s.updateDocumentTemplate)
    const deleteDocumentTemplate = useAdminSettingsStore((s) => s.deleteDocumentTemplate)
    const fmtDate = useFormatDate()

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<DocumentTemplate | null>(null)
    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)
    const [deleting, setDeleting] = useState<DocumentTemplate | null>(null)
    const [viewing, setViewing] = useState<DocumentTemplate | null>(null)

    const [search, setSearch] = useState("")
    const [filterType, setFilterType] = useState<string>("all")

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setData({
                templateName: editing.templateName, code: editing.code, type: editing.type,
                headerText: editing.headerText, footerText: editing.footerText,
                paperSize: editing.paperSize, orientation: editing.orientation, status: editing.status,
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
                templateName: data.templateName.trim(),
                code: data.code.trim().toUpperCase(),
                type: data.type,
                headerText: data.headerText.trim(),
                footerText: data.footerText.trim(),
                paperSize: data.paperSize,
                orientation: data.orientation,
                status: data.status,
            }
            if (mode === "edit" && editing) {
                updateDocumentTemplate(editing.id, payload)
                toast({ title: "Template updated", description: payload.templateName })
            } else {
                addDocumentTemplate(payload)
                toast({ title: "Template created", description: payload.templateName })
            }
            setFormOpen(false)
        } finally { setSubmitting(false) }
    }

    const filtered = useMemo(() => templates.filter((t) => {
        if (filterType !== "all" && t.type !== filterType) return false
        if (search.trim()) {
            const q = search.toLowerCase()
            return [t.templateName, t.code, t.type].some((v) => v.toLowerCase().includes(q))
        }
        return true
    }), [templates, search, filterType])

    const onDuplicate = (t: DocumentTemplate) => {
        addDocumentTemplate({
            templateName: `${t.templateName} (copy)`,
            code: `${t.code}-COPY`,
            type: t.type,
            headerText: t.headerText,
            footerText: t.footerText,
            paperSize: t.paperSize,
            orientation: t.orientation,
            status: "Inactive",
        })
        toast({ title: "Duplicated", description: `${t.templateName} (copy)` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#0ea5e9]" /> Document Templates
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">PDF templates for invoices, quotations, POs and other business documents.</p>
                </div>
                <Button onClick={() => { setEditing(null); setMode("create"); setFormOpen(true) }} className="h-9 px-3 rounded-none text-white text-[13px]" style={{ backgroundColor: "#0ea5e9", boxShadow: "0 4px 12px #0ea5e933" }}>
                    <Plus className="w-4 h-4 mr-1.5" /> New Template
                </Button>
            </div>

            <div className="bg-white border border-[#EEF1F6] shadow-sm p-4 flex flex-wrap items-center gap-3 rounded-none">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search templates..." className="pl-8 h-9 text-[13px] border-[#E5E7EB] rounded-none" />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="h-9 w-[200px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                </Select>
                <span className="text-[12px] text-[#64748B] ml-auto">{filtered.length} {filtered.length === 1 ? "template" : "templates"}</span>
            </div>

            <div className="bg-white border border-[#EEF1F6] shadow-sm overflow-hidden rounded-none">
                <table className="w-full text-[13px]">
                    <thead className="bg-[#F8FAFC] border-b border-[#EEF1F6]">
                        <tr>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[120px]">Code</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B]">Name</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[150px]">Type</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[150px]">Paper</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[120px]">Updated</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[100px]">Status</th>
                            <th className="w-[80px]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-12 text-[#94A3B8] text-[13px]">No templates match.</td></tr>
                        ) : filtered.map((t) => (
                            <tr key={t.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#FAFBFC]">
                                <td className="px-4 py-2.5 font-mono text-[12px] text-[#0F172A]">{t.code}</td>
                                <td className="px-4 py-2.5 font-semibold text-[#0F172A]">{t.templateName}</td>
                                <td className="px-4 py-2.5 text-[#64748B]">{t.type}</td>
                                <td className="px-4 py-2.5 text-[#64748B] tabular-nums">{t.paperSize} · {t.orientation}</td>
                                <td className="px-4 py-2.5 tabular-nums text-[#64748B]">{fmtDate(t.updatedAt)}</td>
                                <td className="px-4 py-2.5">
                                    <span className="inline-flex items-center px-2 py-0.5 border text-[11.5px] font-semibold rounded-none"
                                        style={{
                                            background: t.status === "Active" ? "rgba(16,185,129,0.08)" : "rgba(148,163,184,0.10)",
                                            borderColor: t.status === "Active" ? "rgba(16,185,129,0.30)" : "rgba(148,163,184,0.30)",
                                            color: t.status === "Active" ? "#047857" : "#475569",
                                        }}
                                    >{t.status}</span>
                                </td>
                                <td className="px-4 py-2 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-none">
                                                <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44">
                                            <DropdownMenuItem onClick={() => setViewing(t)} className="text-[13px] cursor-pointer">
                                                <Eye className="w-4 h-4 mr-2" /> Preview
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => { setEditing(t); setMode("edit"); setFormOpen(true) }} className="text-[13px] cursor-pointer">
                                                <Pencil className="w-4 h-4 mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onDuplicate(t)} className="text-[13px] cursor-pointer">
                                                <Copy className="w-4 h-4 mr-2" /> Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => setDeleting(t)} className="text-[13px] cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
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
                title={mode === "edit" ? "Edit Document Template" : "New Document Template"}
                description="Used to render PDFs for invoices, quotations and other documents."
                icon={<FileText className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Create"}
                width="lg"
                accentColor="#0ea5e9"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Template Name" required error={touched.templateName ? errors.templateName : undefined}>
                        <Input value={data.templateName} onChange={(e) => setField("templateName", e.target.value)} onBlur={() => onBlur("templateName")} placeholder="e.g. Standard Invoice" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                    </Field>
                    <Field label="Code" required error={touched.code ? errors.code : undefined}>
                        <Input value={data.code} onChange={(e) => setField("code", e.target.value.toUpperCase())} onBlur={() => onBlur("code")} placeholder="INV-STD" className="h-10 border-[#E5E7EB] text-[13px] uppercase rounded-none" />
                    </Field>
                    <Field label="Document Type" required>
                        <Select value={data.type} onValueChange={(v) => setField("type", v as DocumentTemplate["type"])}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Status" required>
                        <Select value={data.status} onValueChange={(v) => setField("status", v as DocumentTemplate["status"])}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Paper Size" required>
                        <Select value={data.paperSize} onValueChange={(v) => setField("paperSize", v as DocumentTemplate["paperSize"])}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{PAPER_SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Orientation" required>
                        <Select value={data.orientation} onValueChange={(v) => setField("orientation", v as DocumentTemplate["orientation"])}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{ORIENTATIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Header Text" className="sm:col-span-2" hint="Shown at the top of every page.">
                        <Textarea value={data.headerText} onChange={(e) => setField("headerText", e.target.value)} rows={3} placeholder="TAX INVOICE" className="border-[#E5E7EB] text-[13px] resize-none rounded-none" />
                    </Field>
                    <Field label="Footer Text" className="sm:col-span-2" hint="Shown at the bottom (e.g., terms, thank you note).">
                        <Textarea value={data.footerText} onChange={(e) => setField("footerText", e.target.value)} rows={3} placeholder="Thank you for your business." className="border-[#E5E7EB] text-[13px] resize-none rounded-none" />
                    </Field>
                </div>
            </SideFormSheet>

            <SideFormSheet
                open={!!viewing}
                onOpenChange={(o) => !o && setViewing(null)}
                title={viewing?.templateName ?? "Template"}
                description={viewing ? `Code ${viewing.code} · ${viewing.type}` : undefined}
                icon={<Eye className="w-5 h-5" />}
                hideFooter
                width="md"
                accentColor="#0ea5e9"
            >
                {viewing && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Cell label="Type" value={viewing.type} />
                            <Cell label="Status" value={viewing.status} />
                            <Cell label="Paper" value={viewing.paperSize} />
                            <Cell label="Orientation" value={viewing.orientation} />
                            <Cell label="Updated" value={fmtDate(viewing.updatedAt)} />
                            <Cell label="Code" value={viewing.code} mono />
                        </div>
                        <div>
                            <p className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8] mb-1.5">Header</p>
                            <pre className="text-[12.5px] text-[#0F172A] bg-[#F8FAFC] p-4 border border-[#EEF1F6] whitespace-pre-wrap rounded-none">{viewing.headerText || "—"}</pre>
                        </div>
                        <div>
                            <p className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8] mb-1.5">Footer</p>
                            <pre className="text-[12.5px] text-[#0F172A] bg-[#F8FAFC] p-4 border border-[#EEF1F6] whitespace-pre-wrap rounded-none">{viewing.footerText || "—"}</pre>
                        </div>
                    </div>
                )}
            </SideFormSheet>

            <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this template?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span>You are about to delete <span className="font-semibold text-[#0F172A]">{deleting?.templateName}</span>. This cannot be undone.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (!deleting) return
                                deleteDocumentTemplate(deleting.id)
                                toast({ title: "Template deleted", description: deleting.templateName })
                                setDeleting(null)
                            }}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

function Cell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div>
            <p className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">{label}</p>
            <p className={`mt-0.5 text-[13px] text-[#0F172A] font-medium ${mono ? "font-mono" : ""}`}>{value}</p>
        </div>
    )
}
