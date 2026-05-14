"use client"

import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Plus, Pencil, Trash2, MoreHorizontal, Mail, Search, Eye, Copy } from "lucide-react"
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
import { useAdminSettingsStore, type EmailTemplate } from "@/shared/data/admin-settings-store"
import { validateField } from "@/shared/components/admin-settings/validation"
import { useFormatDate } from "@/shared/hooks/useAdminFormatters"
import { fetchOrgAdminSettings, patchOrgAdminSettings, parseOrgSettingsResponse, buildOrgSettingsPayload } from "@/shared/hooks/useAdminSettingsApi"

const CATEGORIES: EmailTemplate["category"][] = ["Onboarding", "Transactional", "Marketing", "System"]
const STATUSES: EmailTemplate["status"][] = ["Active", "Inactive"]

type FormShape = {
    templateName: string
    code: string
    subject: string
    body: string
    category: EmailTemplate["category"]
    status: EmailTemplate["status"]
}

const empty: FormShape = { templateName: "", code: "", subject: "", body: "", category: "Transactional", status: "Active" }

const REQUIRED: Array<keyof FormShape> = ["templateName", "code", "subject", "body", "category", "status"]

export default function EmailTemplatesPage() {
    const { toast } = useToast()
    const templates = useAdminSettingsStore((s) => s.emailTemplates)
    const addEmailTemplate = useAdminSettingsStore((s) => s.addEmailTemplate)
    const updateEmailTemplate = useAdminSettingsStore((s) => s.updateEmailTemplate)
    const deleteEmailTemplate = useAdminSettingsStore((s) => s.deleteEmailTemplate)
    const fmtDate = useFormatDate()

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<EmailTemplate | null>(null)
    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)
    const [deleting, setDeleting] = useState<EmailTemplate | null>(null)
    const [viewing, setViewing] = useState<EmailTemplate | null>(null)

    const [search, setSearch] = useState("")
    const [filterCategory, setFilterCategory] = useState<string>("all")

    // Sync subjects/bodies from backend's branding.emailTemplates (3 fixed slots: invoice/reminder/welcome)
    // into the matching mock-store templates by code. Other templates stay local-only.
    const loadedRef = useRef(false)
    useEffect(() => {
        if (loadedRef.current) return
        loadedRef.current = true
        let alive = true
        ;(async () => {
            try {
                const res = await fetchOrgAdminSettings()
                const parsed = parseOrgSettingsResponse(res?.data?.data ?? res?.data)
                if (!alive || !parsed?.emailTemplates) return
                const slotMap: Record<string, "invoice" | "reminder" | "welcome"> = {
                    "INV-SEND": "invoice",
                    "PWD-RST": "reminder",
                    "WELCOME-01": "welcome",
                }
                templates.forEach((t) => {
                    const slot = slotMap[t.code]
                    if (!slot) return
                    const remoteBody = parsed.emailTemplates![slot]
                    if (remoteBody && remoteBody !== t.body) {
                        updateEmailTemplate(t.id, { body: remoteBody })
                    }
                })
            } catch {
                // backend unreachable — local fallback
            }
        })()
        return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setData({
                templateName: editing.templateName, code: editing.code, subject: editing.subject,
                body: editing.body, category: editing.category, status: editing.status,
            })
        } else setData(empty)
        setErrors({}); setTouched({})
    }, [formOpen, editing, mode])

    /** Persist body to backend if this template maps to one of the 3 branding slots */
    const persistToBackend = async (code: string, body: string) => {
        const slotMap: Record<string, "invoice" | "reminder" | "welcome"> = {
            "INV-SEND": "invoice",
            "PWD-RST": "reminder",
            "WELCOME-01": "welcome",
        }
        const slot = slotMap[code]
        if (!slot) return
        try {
            await patchOrgAdminSettings(buildOrgSettingsPayload({ emailTemplates: { [slot]: body } }))
        } catch {
            // ignore — silent local-only save
        }
    }

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

    const onSubmit = async (e: React.FormEvent) => {
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
                subject: data.subject.trim(),
                body: data.body,
                category: data.category,
                status: data.status,
            }
            if (mode === "edit" && editing) {
                updateEmailTemplate(editing.id, payload)
                await persistToBackend(payload.code, payload.body)
                toast({ title: "Template updated", description: payload.templateName })
            } else {
                addEmailTemplate(payload)
                await persistToBackend(payload.code, payload.body)
                toast({ title: "Template created", description: payload.templateName })
            }
            setFormOpen(false)
        } finally { setSubmitting(false) }
    }

    const filtered = useMemo(() => templates.filter((t) => {
        if (filterCategory !== "all" && t.category !== filterCategory) return false
        if (search.trim()) {
            const q = search.toLowerCase()
            return [t.templateName, t.code, t.subject].some((v) => v.toLowerCase().includes(q))
        }
        return true
    }), [templates, search, filterCategory])

    const summary = useMemo(() => ({
        total: templates.length,
        active: templates.filter((t) => t.status === "Active").length,
        marketing: templates.filter((t) => t.category === "Marketing").length,
        system: templates.filter((t) => t.category === "System").length,
    }), [templates])

    const onDuplicate = (t: EmailTemplate) => {
        addEmailTemplate({
            templateName: `${t.templateName} (copy)`,
            code: `${t.code}-COPY`,
            subject: t.subject,
            body: t.body,
            category: t.category,
            status: "Inactive",
        })
        toast({ title: "Duplicated", description: `${t.templateName} (copy)` })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <Mail className="w-5 h-5 text-[#2563eb]" /> Email Templates
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">System and user-facing email templates with merge tokens.</p>
                </div>
                <Button onClick={() => { setEditing(null); setMode("create"); setFormOpen(true) }} className="h-9 px-3 rounded-none text-white text-[13px]" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                    <Plus className="w-4 h-4 mr-1.5" /> New Template
                </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Stat label="Total" value={summary.total} color="#2563eb" onClick={() => setFilterCategory("all")} />
                <Stat label="Active" value={summary.active} color="#10b981" onClick={() => setFilterCategory("all")} />
                <Stat label="Marketing" value={summary.marketing} color="#f59e0b" onClick={() => setFilterCategory("Marketing")} />
                <Stat label="System" value={summary.system} color="#8b5cf6" onClick={() => setFilterCategory("System")} />
            </div>

            <div className="bg-white border border-[#EEF1F6] shadow-sm p-4 flex flex-wrap items-center gap-3 rounded-none">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, code, subject..." className="pl-8 h-9 text-[13px] border-[#E5E7EB] rounded-none" />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="h-9 w-[180px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B]">Subject</th>
                            <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[140px]">Category</th>
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
                                <td className="px-4 py-2.5 text-[#64748B] truncate max-w-[300px]">{t.subject}</td>
                                <td className="px-4 py-2.5">
                                    <Badge text={t.category} tone={t.category === "Marketing" ? "amber" : t.category === "System" ? "violet" : t.category === "Onboarding" ? "blue" : "emerald"} />
                                </td>
                                <td className="px-4 py-2.5 tabular-nums text-[#64748B]">{fmtDate(t.updatedAt)}</td>
                                <td className="px-4 py-2.5">
                                    <Badge text={t.status} tone={t.status === "Active" ? "emerald" : "slate"} />
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

            {/* Edit/Create Form */}
            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={mode === "edit" ? "Edit Email Template" : "New Email Template"}
                description="Use {{tokens}} for dynamic merge fields like {{firstName}}, {{orgName}}, {{invoiceNumber}}."
                icon={<Mail className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Create"}
                width="lg"
                accentColor="#2563eb"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Template Name" required error={touched.templateName ? errors.templateName : undefined}>
                        <Input value={data.templateName} onChange={(e) => setField("templateName", e.target.value)} onBlur={() => onBlur("templateName")} placeholder="e.g. Welcome Email" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                    </Field>
                    <Field label="Code" required error={touched.code ? errors.code : undefined}>
                        <Input value={data.code} onChange={(e) => setField("code", e.target.value.toUpperCase())} onBlur={() => onBlur("code")} placeholder="WELCOME-01" className="h-10 border-[#E5E7EB] text-[13px] uppercase rounded-none" />
                    </Field>
                    <Field label="Category" required>
                        <Select value={data.category} onValueChange={(v) => setField("category", v as EmailTemplate["category"])}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Status" required>
                        <Select value={data.status} onValueChange={(v) => setField("status", v as EmailTemplate["status"])}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Subject" required error={touched.subject ? errors.subject : undefined} className="sm:col-span-2">
                        <Input value={data.subject} onChange={(e) => setField("subject", e.target.value)} onBlur={() => onBlur("subject")} placeholder="Welcome to {{orgName}}!" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                    </Field>
                    <Field label="Body" required error={touched.body ? errors.body : undefined} className="sm:col-span-2" hint="Supports {{tokens}}, plain text or HTML.">
                        <Textarea value={data.body} onChange={(e) => setField("body", e.target.value)} onBlur={() => onBlur("body")} rows={10} placeholder="Hi {{firstName}}, ..." className="border-[#E5E7EB] text-[13px] resize-none rounded-none font-mono" />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Preview */}
            <SideFormSheet
                open={!!viewing}
                onOpenChange={(o) => !o && setViewing(null)}
                title={viewing?.templateName ?? "Template"}
                description={viewing ? `Code ${viewing.code}` : undefined}
                icon={<Eye className="w-5 h-5" />}
                hideFooter
                width="lg"
                accentColor="#2563eb"
            >
                {viewing && (
                    <div className="space-y-4">
                        <Cell label="Subject" value={viewing.subject} mono />
                        <Cell label="Category" value={viewing.category} />
                        <Cell label="Status" value={viewing.status} />
                        <div>
                            <p className="text-[11.5px] uppercase tracking-wide font-semibold text-[#94A3B8] mb-1.5">Body</p>
                            <pre className="text-[12.5px] text-[#0F172A] bg-[#F8FAFC] p-4 border border-[#EEF1F6] whitespace-pre-wrap font-mono rounded-none">{viewing.body}</pre>
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
                                deleteEmailTemplate(deleting.id)
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

function Stat({ label, value, color, onClick }: { label: string; value: number; color: string; onClick?: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="border shadow-sm p-4 rounded-none text-left cursor-pointer transition-all hover:shadow-md"
            style={{ background: `linear-gradient(135deg, ${color}14 0%, ${color}06 45%, #ffffff 100%)`, borderColor: `${color}33` }}
        >
            <p className="text-[12px] font-medium text-[#64748B]">{label}</p>
            <p className="text-[22px] font-semibold mt-1 tabular-nums leading-tight" style={{ color }}>{value}</p>
        </button>
    )
}

function Badge({ text, tone }: { text: string; tone: "emerald" | "amber" | "violet" | "blue" | "slate" }) {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
        emerald: { bg: "rgba(16,185,129,0.08)", text: "#047857", border: "rgba(16,185,129,0.30)" },
        amber: { bg: "rgba(245,158,11,0.08)", text: "#b45309", border: "rgba(245,158,11,0.30)" },
        violet: { bg: "rgba(139,92,246,0.08)", text: "#6d28d9", border: "rgba(139,92,246,0.30)" },
        blue: { bg: "rgba(37,99,235,0.08)", text: "#1d4ed8", border: "rgba(37,99,235,0.30)" },
        slate: { bg: "rgba(148,163,184,0.10)", text: "#475569", border: "rgba(148,163,184,0.30)" },
    }
    const s = styles[tone]
    return (
        <span className="inline-flex items-center px-2 py-0.5 border text-[11.5px] font-semibold capitalize rounded-none" style={{ background: s.bg, borderColor: s.border, color: s.text }}>{text}</span>
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
