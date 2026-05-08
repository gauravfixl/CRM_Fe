"use client"

import * as React from "react"
import { useEffect, useRef, useState, useMemo } from "react"
import { Save, Settings as SettingsIcon, Globe, Calendar, Hash, Layout, Eye, Languages, Clock, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import Loader from "@/shared/components/custom/Loader"
import {
    useAdminSettingsStore,
    TIMEZONES, LANGUAGES, DATE_FORMATS, TIME_FORMATS, NUMBER_FORMATS, LANDING_PAGES,
    type GeneralPrefs,
} from "@/shared/data/admin-settings-store"
import { useFormatDate, useFormatTime, useFormatNumber } from "@/shared/hooks/useAdminFormatters"
import { fetchOrgAdminSettings, patchOrgAdminSettings, parseOrgSettingsResponse, buildOrgSettingsPayload } from "@/shared/hooks/useAdminSettingsApi"

export default function GeneralPreferencesPage() {
    const { toast } = useToast()
    const general = useAdminSettingsStore((s) => s.general)
    const setGeneral = useAdminSettingsStore((s) => s.setGeneral)

    const [draft, setDraft] = useState<GeneralPrefs>(general)
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const loadedRef = useRef(false)

    // Fetch live settings from backend on mount; merge backend-supported fields
    // (timezone, language) into the local store. Other fields stay local-only.
    useEffect(() => {
        if (loadedRef.current) return
        loadedRef.current = true
        let alive = true
        ;(async () => {
            try {
                const res = await fetchOrgAdminSettings()
                const parsed = parseOrgSettingsResponse(res?.data?.data ?? res?.data)
                if (alive && parsed) {
                    const merge: Partial<GeneralPrefs> = {}
                    if (parsed.timezone) merge.timezone = parsed.timezone
                    if (parsed.language) merge.language = parsed.language
                    if (Object.keys(merge).length > 0) {
                        setGeneral(merge)
                        setDraft((d) => ({ ...d, ...merge }))
                    }
                }
            } catch {
                // Backend not reachable / unauth — silently fall back to local store
            } finally {
                if (alive) setLoading(false)
            }
        })()
        return () => {
            alive = false
        }
    }, [setGeneral])

    const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(general), [draft, general])

    const formatDate = useFormatDate()
    const formatTime = useFormatTime()
    const formatNumber = useFormatNumber()
    const previewDate = formatDate(new Date())
    const previewTime = formatTime(new Date())
    const previewNumber = formatNumber(1234567.89)

    const set = <K extends keyof GeneralPrefs>(k: K, v: GeneralPrefs[K]) =>
        setDraft((d) => ({ ...d, [k]: v }))

    const onSave = async () => {
        setSaving(true)
        try {
            // Persist backend-supported fields (timezone + language)
            const payload = buildOrgSettingsPayload({
                timezone: draft.timezone,
                language: draft.language,
            })
            try {
                await patchOrgAdminSettings(payload)
            } catch {
                // ignore — fall back to local-only save
            }
            // Always update local store so display-only fields (date/number/density)
            // still propagate across the dashboard via formatter hooks
            setGeneral(draft)
            toast({ title: "Preferences saved", description: "Changes applied across the dashboard." })
        } finally {
            setSaving(false)
        }
    }
    const onReset = () => setDraft(general)

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
                        <SettingsIcon className="w-5 h-5 text-[#2563eb]" /> General Preferences
                    </h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Display, timezone and locale defaults applied across the dashboard.</p>
                </div>
                <div className="flex items-center gap-2">
                    {dirty && (
                        <Button variant="outline" onClick={onReset} className="h-9 px-3 rounded-none border-[#E5E7EB] text-[#374151] text-[13px]">
                            Reset
                        </Button>
                    )}
                    <Button onClick={onSave} disabled={!dirty || saving} className="h-9 px-3 rounded-none text-white text-[13px] disabled:opacity-50" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                        <Save className="w-4 h-4 mr-1.5" /> {saving ? "Saving…" : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <SectionCard title="Region & Time" icon={<Clock className="w-4 h-4" />} accent="#2563eb">
                        <Row label="Timezone" description="Used for all date/time displays.">
                            <Select value={draft.timezone} onValueChange={(v) => set("timezone", v)}>
                                <SelectTrigger className="h-10 w-[260px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>{TIMEZONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                            </Select>
                        </Row>
                        <Row label="First Day of Week" description="Affects weekly calendar views.">
                            <Select value={draft.firstDayOfWeek} onValueChange={(v) => set("firstDayOfWeek", v)}>
                                <SelectTrigger className="h-10 w-[260px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>{["Monday", "Sunday", "Saturday"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                        </Row>
                    </SectionCard>

                    <SectionCard title="Display Format" icon={<Hash className="w-4 h-4" />} accent="#10b981">
                        <Row label="Date Format" description="How dates render across all pages.">
                            <Select value={draft.dateFormat} onValueChange={(v) => set("dateFormat", v)}>
                                <SelectTrigger className="h-10 w-[260px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>{DATE_FORMATS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                        </Row>
                        <Row label="Time Format" description="12-hour or 24-hour clock.">
                            <Select value={draft.timeFormat} onValueChange={(v) => set("timeFormat", v)}>
                                <SelectTrigger className="h-10 w-[260px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>{TIME_FORMATS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                        </Row>
                        <Row label="Number Format" description="Thousands and decimal separators.">
                            <Select value={draft.numberFormat} onValueChange={(v) => set("numberFormat", v)}>
                                <SelectTrigger className="h-10 w-[260px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>{NUMBER_FORMATS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                        </Row>
                    </SectionCard>

                    <SectionCard title="Language & UI" icon={<Languages className="w-4 h-4" />} accent="#8b5cf6">
                        <Row label="Language" description="Application interface language.">
                            <Select value={draft.language} onValueChange={(v) => set("language", v)}>
                                <SelectTrigger className="h-10 w-[260px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>{LANGUAGES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                        </Row>
                        <Row label="Density Mode" description="Adjust list/table row spacing.">
                            <Select value={draft.densityMode} onValueChange={(v) => set("densityMode", v as any)}>
                                <SelectTrigger className="h-10 w-[260px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Comfortable">Comfortable</SelectItem>
                                    <SelectItem value="Compact">Compact</SelectItem>
                                </SelectContent>
                            </Select>
                        </Row>
                        <Row label="Default Landing Page" description="Where you arrive after login.">
                            <Select value={draft.landingPage} onValueChange={(v) => set("landingPage", v)}>
                                <SelectTrigger className="h-10 w-[260px] border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent>{LANDING_PAGES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
                        </Row>
                    </SectionCard>
                </div>

                <div className="space-y-4">
                    <div
                        className="border shadow-sm overflow-hidden rounded-none"
                        style={{ background: "linear-gradient(135deg, #2563eb14 0%, #2563eb06 45%, #ffffff 100%)", borderColor: "#2563eb33" }}
                    >
                        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: "#2563eb22" }}>
                            <span className="w-9 h-9 flex items-center justify-center text-white shrink-0 bg-blue-500" style={{ borderRadius: 0 }}>
                                <Eye className="w-4 h-4" />
                            </span>
                            <div>
                                <h3 className="text-[13.5px] font-semibold text-[#0F172A]">Live Preview</h3>
                                <p className="text-[11px] text-[#94A3B8]">Sample with current draft</p>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <PreviewRow label="Today" value={previewDate} />
                            <PreviewRow label="Now" value={previewTime} />
                            <PreviewRow label="Number" value={previewNumber} />
                            <PreviewRow label="Timezone" value={draft.timezone} />
                            <PreviewRow label="Language" value={draft.language} />
                        </div>
                    </div>

                    <div
                        className="border shadow-sm p-4 flex items-start gap-2 text-[12px] text-blue-900"
                        style={{ background: "rgba(37, 99, 235, 0.08)", borderColor: "rgba(37, 99, 235, 0.25)", borderRadius: 0 }}
                    >
                        <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                        <p>Saved preferences propagate live to every page that uses the formatter hooks (KPI cards, recent activity dates, billing amounts).</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function SectionCard({ title, icon, accent, children }: { title: string; icon: React.ReactNode; accent: string; children: React.ReactNode }) {
    return (
        <div
            className="border shadow-sm overflow-hidden rounded-none"
            style={{ background: `linear-gradient(180deg, ${accent}0d 0%, #ffffff 50%)`, borderColor: `${accent}26` }}
        >
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

function PreviewRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-[#64748B]">{label}</span>
            <span className="font-mono font-semibold text-[#0F172A]">{value}</span>
        </div>
    )
}
