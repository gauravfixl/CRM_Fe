"use client"

import * as React from "react"
import { useEffect, useRef, useState, useMemo } from "react"
import {
    Save, Globe, Calendar, DollarSign, CalendarDays, Pencil, Trash2, MoreHorizontal, Plus,
} from "lucide-react"
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
import Loader from "@/shared/components/custom/Loader"
import {
    useAdminSettingsStore, CURRENCIES, FISCAL_MONTHS, WEEK_DAYS, type Holiday,
} from "@/shared/data/admin-settings-store"
import { validateField } from "@/shared/components/admin-settings/validation"
import { useFormatCurrency, useFormatDate } from "@/shared/hooks/useAdminFormatters"
import { fetchOrgAdminSettings, patchOrgAdminSettings, parseOrgSettingsResponse, buildOrgSettingsPayload } from "@/shared/hooks/useAdminSettingsApi"

const HOLIDAY_TYPES: Holiday["type"][] = ["Public", "Optional", "Restricted"]

export default function LocalizationPage() {
    const { toast } = useToast()
    const localization = useAdminSettingsStore((s) => s.localization)
    const setLocalization = useAdminSettingsStore((s) => s.setLocalization)
    const holidays = useAdminSettingsStore((s) => s.holidays)
    const addHoliday = useAdminSettingsStore((s) => s.addHoliday)
    const updateHoliday = useAdminSettingsStore((s) => s.updateHoliday)
    const deleteHoliday = useAdminSettingsStore((s) => s.deleteHoliday)

    const [draft, setDraft] = useState(localization)
    const [savingLoc, setSavingLoc] = useState(false)
    const [loading, setLoading] = useState(true)
    const loadedRef = useRef(false)
    const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(localization), [draft, localization])

    // Sync currency from backend on mount (other localization fields stay local — no backend yet)
    useEffect(() => {
        if (loadedRef.current) return
        loadedRef.current = true
        let alive = true
        ;(async () => {
            try {
                const res = await fetchOrgAdminSettings()
                const parsed = parseOrgSettingsResponse(res?.data?.data ?? res?.data)
                if (alive && parsed?.currency) {
                    setLocalization({ defaultCurrency: parsed.currency })
                    setDraft((d) => ({ ...d, defaultCurrency: parsed.currency! }))
                }
            } catch {
                // backend unreachable — fall back to local store
            } finally {
                if (alive) setLoading(false)
            }
        })()
        return () => { alive = false }
    }, [setLocalization])

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<Holiday | null>(null)
    const [holidayDraft, setHolidayDraft] = useState({ holidayName: "", holidayDate: "", type: "Public" as Holiday["type"] })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)
    const [deleting, setDeleting] = useState<Holiday | null>(null)

    const fmtCurr = useFormatCurrency()
    const fmtDate = useFormatDate()

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setHolidayDraft({ holidayName: editing.holidayName, holidayDate: editing.holidayDate, type: editing.type })
        } else {
            setHolidayDraft({ holidayName: "", holidayDate: "", type: "Public" })
        }
        setErrors({}); setTouched({})
    }, [formOpen, editing, mode])

    const onSaveLoc = async () => {
        setSavingLoc(true)
        try {
            // Persist currency to backend (other fields not yet supported by backend schema)
            try {
                await patchOrgAdminSettings(buildOrgSettingsPayload({ currency: draft.defaultCurrency }))
            } catch {
                // ignore — local-only save
            }
            setLocalization(draft)
            toast({ title: "Localization saved", description: "Currency propagates instantly across the dashboard." })
        } finally {
            setSavingLoc(false)
        }
    }

    const toggleWorkingDay = (d: string) =>
        setDraft((s) => ({ ...s, workingDays: s.workingDays.includes(d) ? s.workingDays.filter((x) => x !== d) : [...s.workingDays, d] }))

    const validateHoliday = () => {
        const next: Record<string, string> = {}
        const nameErr = validateField("holidayName", holidayDraft.holidayName)
        if (nameErr) next.holidayName = nameErr
        if (!holidayDraft.holidayDate) next.holidayDate = "Date is required"
        if (!holidayDraft.type) next.type = "Type is required"
        setErrors(next)
        setTouched({ holidayName: true, holidayDate: true, type: true })
        return Object.keys(next).length === 0
    }

    const onSubmitHoliday = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateHoliday()) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" })
            return
        }
        setSubmitting(true)
        try {
            const payload = { holidayName: holidayDraft.holidayName.trim(), holidayDate: holidayDraft.holidayDate, type: holidayDraft.type }
            if (mode === "edit" && editing) {
                updateHoliday(editing.id, payload)
                toast({ title: "Holiday updated", description: payload.holidayName })
            } else {
                addHoliday(payload)
                toast({ title: "Holiday added", description: payload.holidayName })
            }
            setFormOpen(false)
        } finally { setSubmitting(false) }
    }

    const sortedHolidays = useMemo(() => [...holidays].sort((a, b) => a.holidayDate.localeCompare(b.holidayDate)), [holidays])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                        <Globe className="w-5 h-5 text-[#0ea5e9]" /> Localization
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Currency, fiscal calendar, working days and holidays.</p>
                </div>
                <Button onClick={onSaveLoc} disabled={!dirty || savingLoc} className="h-9 px-3 rounded-none text-white text-[13px] disabled:opacity-50" style={{ backgroundColor: "#0ea5e9", boxShadow: "0 4px 12px #0ea5e933" }}>
                    <Save className="w-4 h-4 mr-1.5" /> {savingLoc ? "Saving…" : "Save Settings"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <SectionCard title="Currency" icon={<DollarSign className="w-4 h-4" />} accent="#10b981">
                        <Row label="Default Currency" description="Used everywhere by default for monetary values.">
                            <Select value={draft.defaultCurrency} onValueChange={(v) => setDraft((s) => ({ ...s, defaultCurrency: v }))}>
                                <SelectTrigger className="h-10 w-[200px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                        </Row>
                        <Row label="Secondary Currency" description="Optional alternate display.">
                            <Select value={draft.secondaryCurrency} onValueChange={(v) => setDraft((s) => ({ ...s, secondaryCurrency: v }))}>
                                <SelectTrigger className="h-10 w-[200px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                        </Row>
                    </SectionCard>

                    <SectionCard title="Fiscal Calendar" icon={<Calendar className="w-4 h-4" />} accent="#f59e0b">
                        <Row label="Fiscal Year Starts In" description="First month of the financial year (e.g., April for India).">
                            <Select value={draft.fiscalYearStart} onValueChange={(v) => setDraft((s) => ({ ...s, fiscalYearStart: v }))}>
                                <SelectTrigger className="h-10 w-[200px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>{FISCAL_MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                            </Select>
                        </Row>
                    </SectionCard>

                    <SectionCard title="Working Days" icon={<CalendarDays className="w-4 h-4" />} accent="#8b5cf6">
                        <div className="px-5 py-4">
                            <p className="text-[12.5px] text-[#64748B] mb-3">Toggle the days that count as business days.</p>
                            <div className="flex flex-wrap gap-2">
                                {WEEK_DAYS.map((d) => {
                                    const active = draft.workingDays.includes(d)
                                    return (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => toggleWorkingDay(d)}
                                            className="h-9 px-4 text-[12.5px] font-medium border transition-all rounded-none"
                                            style={{
                                                background: active ? "linear-gradient(135deg, #8b5cf614, #8b5cf606)" : "#fff",
                                                borderColor: active ? "#8b5cf6" : "#E5E7EB",
                                                color: active ? "#8b5cf6" : "#64748B",
                                            }}
                                        >
                                            {d}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </SectionCard>
                </div>

                <div className="space-y-4">
                    <div
                        className="border shadow-sm overflow-hidden rounded-none"
                        style={{ background: "linear-gradient(135deg, #10b98114 0%, #10b98106 45%, #ffffff 100%)", borderColor: "#10b98133" }}
                    >
                        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "#10b98122" }}>
                            <span className="w-9 h-9 flex items-center justify-center text-white shrink-0 bg-emerald-500" style={{ borderRadius: 0 }}>
                                <DollarSign className="w-4 h-4" />
                            </span>
                            <div>
                                <h3 className="text-[13.5px] font-semibold text-[#0F172A]">Live Preview</h3>
                                <p className="text-[11px] text-[#94A3B8]">Sample formatting</p>
                            </div>
                        </div>
                        <div className="p-4 space-y-2.5 text-[12.5px]">
                            <div className="flex justify-between"><span className="text-[#64748B]">Sample amount</span><span className="font-mono font-semibold text-[#0F172A]">{fmtCurr(125000)}</span></div>
                            <div className="flex justify-between"><span className="text-[#64748B]">Today</span><span className="font-mono font-semibold text-[#0F172A]">{fmtDate(new Date())}</span></div>
                            <div className="flex justify-between"><span className="text-[#64748B]">FY Starts</span><span className="font-mono font-semibold text-[#0F172A]">{draft.fiscalYearStart}</span></div>
                            <div className="flex justify-between"><span className="text-[#64748B]">Working Days</span><span className="font-mono font-semibold text-[#0F172A]">{draft.workingDays.length}/7</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Holidays */}
            <div className="border bg-white shadow-sm rounded-none">
                <div className="px-5 py-3.5 border-b border-[#EEF1F6] flex items-center justify-between">
                    <div className="flex items-start gap-2">
                        <span className="w-1 h-9 bg-amber-500 shrink-0" />
                        <div>
                            <h2 className="text-[14px] font-semibold text-[#0F172A]">Holidays</h2>
                            <p className="text-[11.5px] text-[#94A3B8] mt-0.5">Calendar exceptions used by HR & Project modules.</p>
                        </div>
                    </div>
                    <Button onClick={() => { setEditing(null); setMode("create"); setFormOpen(true) }} className="h-9 px-3 rounded-none text-white text-[13px]" style={{ backgroundColor: "#f59e0b", boxShadow: "0 4px 12px #f59e0b33" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> Add Holiday
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-[13px]">
                        <thead className="bg-[#F8FAFC] border-b border-[#EEF1F6]">
                            <tr>
                                <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B]">Holiday</th>
                                <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[200px]">Date</th>
                                <th className="text-left px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[140px]">Type</th>
                                <th className="text-right px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-wide text-[#64748B] w-[80px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedHolidays.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-[#94A3B8] text-[13px]">No holidays defined.</td></tr>
                            ) : sortedHolidays.map((h) => (
                                <tr key={h.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#FAFBFC]">
                                    <td className="px-4 py-2.5 font-medium text-[#0F172A]">{h.holidayName}</td>
                                    <td className="px-4 py-2.5 tabular-nums text-[#0F172A]">{fmtDate(h.holidayDate)}</td>
                                    <td className="px-4 py-2.5">
                                        <span className="inline-flex items-center px-2 py-0.5 border text-[11.5px] font-semibold capitalize rounded-none"
                                            style={{
                                                background: h.type === "Public" ? "rgba(16,185,129,0.08)" : h.type === "Optional" ? "rgba(245,158,11,0.08)" : "rgba(148,163,184,0.10)",
                                                borderColor: h.type === "Public" ? "rgba(16,185,129,0.30)" : h.type === "Optional" ? "rgba(245,158,11,0.30)" : "rgba(148,163,184,0.30)",
                                                color: h.type === "Public" ? "#047857" : h.type === "Optional" ? "#b45309" : "#475569",
                                            }}
                                        >
                                            {h.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-none">
                                                    <MoreHorizontal className="w-4 h-4 text-[#64748B]" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-40">
                                                <DropdownMenuItem onClick={() => { setEditing(h); setMode("edit"); setFormOpen(true) }} className="text-[13px] cursor-pointer">
                                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setDeleting(h)} className="text-[13px] cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
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
            </div>

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={mode === "edit" ? "Edit Holiday" : "Add Holiday"}
                description="Calendar exception for HR and Project planning."
                icon={<Calendar className="w-5 h-5" />}
                onSubmit={onSubmitHoliday}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Add"}
                width="md"
                accentColor="#f59e0b"
            >
                <div className="space-y-4">
                    <Field label="Holiday Name" required error={touched.holidayName ? errors.holidayName : undefined}>
                        <Input
                            value={holidayDraft.holidayName}
                            onChange={(e) => {
                                const v = e.target.value
                                setHolidayDraft((d) => ({ ...d, holidayName: v }))
                                if (touched.holidayName) setErrors((er) => ({ ...er, holidayName: validateField("holidayName", v) ?? "" }))
                            }}
                            onBlur={() => { setTouched((t) => ({ ...t, holidayName: true })); setErrors((er) => ({ ...er, holidayName: validateField("holidayName", holidayDraft.holidayName) ?? "" })) }}
                            placeholder="e.g. Republic Day"
                            className="h-10 border-[#E5E7EB] text-[13px] rounded-none"
                        />
                    </Field>
                    <Field label="Date" required error={touched.holidayDate ? errors.holidayDate : undefined}>
                        <Input
                            type="date"
                            value={holidayDraft.holidayDate}
                            onChange={(e) => setHolidayDraft((d) => ({ ...d, holidayDate: e.target.value }))}
                            onBlur={() => setTouched((t) => ({ ...t, holidayDate: true }))}
                            className="h-10 border-[#E5E7EB] text-[13px] rounded-none"
                        />
                    </Field>
                    <Field label="Type" required>
                        <Select value={holidayDraft.type} onValueChange={(v) => setHolidayDraft((d) => ({ ...d, type: v as Holiday["type"] }))}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                            <SelectContent>{HOLIDAY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this holiday?</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span>You are about to delete <span className="font-semibold text-[#0F172A]">{deleting?.holidayName}</span>. This cannot be undone.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (!deleting) return
                                deleteHoliday(deleting.id)
                                toast({ title: "Holiday deleted", description: deleting.holidayName })
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

function SectionCard({ title, icon, accent, children }: { title: string; icon: React.ReactNode; accent: string; children: React.ReactNode }) {
    return (
        <div className="border shadow-sm overflow-hidden rounded-none" style={{ background: `linear-gradient(180deg, ${accent}0d 0%, #ffffff 50%)`, borderColor: `${accent}26` }}>
            <div className="px-5 py-3.5 border-b flex items-start gap-2" style={{ borderColor: `${accent}22` }}>
                <span className="w-1 h-9 shrink-0" style={{ backgroundColor: accent }} />
                <div className="flex items-center gap-2">
                    <span style={{ color: accent }}>{icon}</span>
                    <h2 className="text-[14px] font-semibold text-[#0F172A]">{title}</h2>
                </div>
            </div>
            <div className="divide-y divide-[#F1F5F9]">{children}</div>
        </div>
    )
}

function Row({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 px-5 py-4">
            <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-[#0F172A]">{label}</p>
                <p className="text-[12.5px] text-[#64748B] mt-0.5">{description}</p>
            </div>
            <div className="shrink-0">{children}</div>
        </div>
    )
}
