"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
    Plug, Settings2, Key, Link as LinkIcon, FileText, Eye, EyeOff,
} from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { validateField } from "../lead-validation"

export interface IntegrationFormShape {
    integrationName: string
    provider: string
    apiKey: string
    secretKey: string
    accountId: string
    endpointUrl: string
    webhookUrl: string
    direction: string
    syncFrequency: string
    integrationStatus: string
    notes: string
}

const empty: IntegrationFormShape = {
    integrationName: "",
    provider: "",
    apiKey: "",
    secretKey: "",
    accountId: "",
    endpointUrl: "",
    webhookUrl: "",
    direction: "Inbound",
    syncFrequency: "Real-time",
    integrationStatus: "Active",
    notes: "",
}

const DIRECTIONS = ["Inbound", "Outbound", "Bi-directional"]
const FREQUENCIES = ["Real-time", "Every 5 min", "Hourly", "Daily", "Weekly", "Manual"]
const STATUSES = ["Active", "Paused", "Disconnected"]

interface IntegrationFormSideProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: Partial<IntegrationFormShape> | null
    providerOptions: string[]
    onSubmit: (data: IntegrationFormShape) => void
    title?: string
    description?: string
    accentColor?: string
    submitLabel?: string
    requiredFields?: Array<keyof IntegrationFormShape>
    /** Hide certain optional fields when not relevant for this integration type */
    hideFields?: Array<keyof IntegrationFormShape>
}

const DEFAULT_REQUIRED: Array<keyof IntegrationFormShape> = [
    "integrationName", "provider", "integrationStatus",
]

export default function IntegrationFormSide({
    open,
    onOpenChange,
    initialData,
    providerOptions,
    onSubmit,
    title,
    description,
    accentColor = "#6366f1",
    submitLabel,
    requiredFields = DEFAULT_REQUIRED,
    hideFields = [],
}: IntegrationFormSideProps) {
    const { toast } = useToast()
    const [data, setData] = useState<IntegrationFormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)
    const [showSecrets, setShowSecrets] = useState(false)

    const isEdit = !!initialData?.integrationName

    useEffect(() => {
        if (!open) return
        setData({ ...empty, ...(initialData ?? {}) })
        setErrors({})
        setTouched({})
        setShowSecrets(false)
    }, [open, initialData])

    const setField = <K extends keyof IntegrationFormShape>(k: K, v: IntegrationFormShape[K]) => {
        setData((prev) => ({ ...prev, [k]: v }))
        if (touched[k]) {
            const fieldName = mapToValidatorKey(k)
            setErrors((prev) => ({ ...prev, [k]: validateField(fieldName, v) ?? "" }))
        }
    }

    const onBlur = <K extends keyof IntegrationFormShape>(k: K) => {
        setTouched((prev) => ({ ...prev, [k]: true }))
        const fieldName = mapToValidatorKey(k)
        setErrors((prev) => ({ ...prev, [k]: validateField(fieldName, data[k]) ?? "" }))
    }

    const validateAll = (): boolean => {
        const next: Record<string, string> = {}
        const fields = Object.keys(data) as Array<keyof IntegrationFormShape>
        for (const f of fields) {
            if (hideFields.includes(f)) continue
            const fieldName = mapToValidatorKey(f)
            const err = validateField(fieldName, data[f])
            if (err) next[f] = err
        }
        for (const f of requiredFields) {
            if (hideFields.includes(f)) continue
            if (!next[f] && (data[f] === "" || data[f] === null || data[f] === undefined)) {
                next[f] = `${humanize(f)} is required`
            }
        }
        setErrors(next)
        setTouched(Object.fromEntries(fields.map((f) => [f, true])))
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateAll()) {
            toast({
                title: "Please fix the highlighted fields",
                description: "Some inputs need attention before saving.",
                variant: "destructive",
            })
            return
        }
        setSubmitting(true)
        try {
            onSubmit(data)
        } finally {
            setSubmitting(false)
        }
    }

    const visible = (k: keyof IntegrationFormShape) => !hideFields.includes(k)

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={title ?? (isEdit ? "Edit Integration" : "Connect New Integration")}
            description={
                description ??
                (isEdit
                    ? "Update credentials, sync settings and connection status."
                    : "Connect a new external provider with credentials and sync configuration.")
            }
            icon={<Plug className="w-5 h-5" />}
            onSubmit={handleSubmit}
            loading={submitting}
            submitLabel={submitLabel ?? (isEdit ? "Save Changes" : "Connect")}
            width="lg"
            accentColor={accentColor}
        >
            <div className="space-y-6">
                {/* Section 1: Identity */}
                <Section icon={<Settings2 className="w-3.5 h-3.5" />} title="Identity" accent={accentColor}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field
                            label="Integration Name"
                            required
                            error={touched.integrationName ? errors.integrationName : undefined}
                            className="sm:col-span-2"
                        >
                            <Input
                                value={data.integrationName}
                                onChange={(e) => setField("integrationName", e.target.value)}
                                onBlur={() => onBlur("integrationName")}
                                placeholder="e.g. Main Website Form, Mailchimp Production"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                        <Field
                            label="Provider"
                            required
                            error={touched.provider ? errors.provider : undefined}
                        >
                            <Select
                                value={data.provider}
                                onValueChange={(v) => { setField("provider", v); setTouched((p) => ({ ...p, provider: true })) }}
                            >
                                <SelectTrigger className="h-10 rounded-none border-[#E5E7EB] text-[13px]">
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    {providerOptions.map((p) => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field
                            label="Status"
                            required
                            error={touched.integrationStatus ? errors.integrationStatus : undefined}
                        >
                            <Select
                                value={data.integrationStatus}
                                onValueChange={(v) => { setField("integrationStatus", v); setTouched((p) => ({ ...p, integrationStatus: true })) }}
                            >
                                <SelectTrigger className="h-10 rounded-none border-[#E5E7EB] text-[13px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUSES.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                </Section>

                {/* Section 2: Credentials */}
                {(visible("apiKey") || visible("secretKey") || visible("accountId")) && (
                    <Section icon={<Key className="w-3.5 h-3.5" />} title="Credentials" accent="#10b981">
                        <div className="space-y-4">
                            {visible("apiKey") && (
                                <Field
                                    label="API Key"
                                    error={touched.apiKey ? errors.apiKey : undefined}
                                    hint="8-200 chars · letters, digits, _ - . ~ + / ="
                                >
                                    <div className="relative">
                                        <Input
                                            type={showSecrets ? "text" : "password"}
                                            value={data.apiKey}
                                            onChange={(e) => setField("apiKey", e.target.value)}
                                            onBlur={() => onBlur("apiKey")}
                                            placeholder="sk_live_xxxxxxxxxxxx"
                                            className="h-10 pr-10 rounded-none border-[#E5E7EB] text-[13px] font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSecrets(!showSecrets)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
                                        >
                                            {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </Field>
                            )}
                            {visible("secretKey") && (
                                <Field
                                    label="Secret Key"
                                    error={touched.secretKey ? errors.secretKey : undefined}
                                    hint="Optional · only if provider requires"
                                >
                                    <Input
                                        type={showSecrets ? "text" : "password"}
                                        value={data.secretKey}
                                        onChange={(e) => setField("secretKey", e.target.value)}
                                        onBlur={() => onBlur("secretKey")}
                                        placeholder="••••••••••••••••"
                                        className="h-10 rounded-none border-[#E5E7EB] text-[13px] font-mono"
                                    />
                                </Field>
                            )}
                            {visible("accountId") && (
                                <Field
                                    label="Account ID"
                                    error={touched.accountId ? errors.accountId : undefined}
                                    hint="Letters, digits, _ - · max 80"
                                >
                                    <Input
                                        value={data.accountId}
                                        onChange={(e) => setField("accountId", e.target.value)}
                                        onBlur={() => onBlur("accountId")}
                                        placeholder="acct_xxxxxxxxx"
                                        className="h-10 rounded-none border-[#E5E7EB] text-[13px] font-mono"
                                    />
                                </Field>
                            )}
                        </div>
                    </Section>
                )}

                {/* Section 3: Endpoints */}
                {(visible("endpointUrl") || visible("webhookUrl")) && (
                    <Section icon={<LinkIcon className="w-3.5 h-3.5" />} title="Endpoints" accent="#f59e0b">
                        <div className="space-y-4">
                            {visible("endpointUrl") && (
                                <Field
                                    label="Endpoint URL"
                                    error={touched.endpointUrl ? errors.endpointUrl : undefined}
                                    hint="Must start with http:// or https://"
                                    required={requiredFields.includes("endpointUrl")}
                                >
                                    <Input
                                        value={data.endpointUrl}
                                        onChange={(e) => setField("endpointUrl", e.target.value)}
                                        onBlur={() => onBlur("endpointUrl")}
                                        placeholder="https://api.provider.com/v1/leads"
                                        className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                                    />
                                </Field>
                            )}
                            {visible("webhookUrl") && (
                                <Field
                                    label="Webhook URL"
                                    error={touched.webhookUrl ? errors.webhookUrl : undefined}
                                    hint="Optional · receives event callbacks"
                                >
                                    <Input
                                        value={data.webhookUrl}
                                        onChange={(e) => setField("webhookUrl", e.target.value)}
                                        onBlur={() => onBlur("webhookUrl")}
                                        placeholder="https://yourapp.com/webhooks/inbound"
                                        className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                                    />
                                </Field>
                            )}
                        </div>
                    </Section>
                )}

                {/* Section 4: Sync */}
                {(visible("direction") || visible("syncFrequency")) && (
                    <Section icon={<Settings2 className="w-3.5 h-3.5" />} title="Sync Configuration" accent="#3b82f6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {visible("direction") && (
                                <Field label="Direction" error={touched.direction ? errors.direction : undefined}>
                                    <Select
                                        value={data.direction}
                                        onValueChange={(v) => { setField("direction", v); setTouched((p) => ({ ...p, direction: true })) }}
                                    >
                                        <SelectTrigger className="h-10 rounded-none border-[#E5E7EB] text-[13px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DIRECTIONS.map((d) => (
                                                <SelectItem key={d} value={d}>{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                            {visible("syncFrequency") && (
                                <Field label="Sync Frequency" error={touched.syncFrequency ? errors.syncFrequency : undefined}>
                                    <Select
                                        value={data.syncFrequency}
                                        onValueChange={(v) => { setField("syncFrequency", v); setTouched((p) => ({ ...p, syncFrequency: true })) }}
                                    >
                                        <SelectTrigger className="h-10 rounded-none border-[#E5E7EB] text-[13px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FREQUENCIES.map((f) => (
                                                <SelectItem key={f} value={f}>{f}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                        </div>
                    </Section>
                )}

                {/* Section 5: Notes */}
                {visible("notes") && (
                    <Section icon={<FileText className="w-3.5 h-3.5" />} title="Notes" accent="#0ea5e9">
                        <Field label="Notes" error={touched.notes ? errors.notes : undefined} hint="Optional · max 500 chars">
                            <Textarea
                                value={data.notes}
                                onChange={(e) => setField("notes", e.target.value)}
                                onBlur={() => onBlur("notes")}
                                placeholder="Production credentials. Owner: data team. Renew API key by Q3."
                                rows={3}
                                className="rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                    </Section>
                )}
            </div>
        </SideFormSheet>
    )
}

function Section({
    icon, title, accent, children,
}: { icon: React.ReactNode; title: string; accent: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-3 pb-1.5 border-b border-[#F1F5F9]">
                <span
                    className="w-6 h-6 flex items-center justify-center text-white shrink-0 rounded-none"
                    style={{ background: accent }}
                >
                    {icon}
                </span>
                <h4 className="text-[12.5px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                    {title}
                </h4>
            </div>
            {children}
        </div>
    )
}

const VALIDATOR_KEY_MAP: Record<string, string> = {
    integrationName: "integrationname",
    provider: "provider",
    apiKey: "apikey",
    secretKey: "secretkey",
    accountId: "accountid",
    endpointUrl: "endpointurl",
    webhookUrl: "webhookurl",
    direction: "direction",
    syncFrequency: "syncfrequency",
    integrationStatus: "integrationstatus",
    notes: "notes",
}
const mapToValidatorKey = (k: string) => VALIDATOR_KEY_MAP[k] ?? k.toLowerCase()
const humanize = (s: string) => s.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())
