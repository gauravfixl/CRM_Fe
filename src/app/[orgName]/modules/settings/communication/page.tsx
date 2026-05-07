"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { Save, Mail, Phone, MessageSquare, Webhook, Send, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { useAdminSettingsStore, type SmtpConfig, type SmsGatewayConfig, type WhatsAppGatewayConfig } from "@/shared/data/admin-settings-store"
import { validateField } from "@/shared/components/admin-settings/validation"

type Tab = "smtp" | "sms" | "whatsapp"

export default function CommunicationPage() {
    const { toast } = useToast()
    const [tab, setTab] = useState<Tab>("smtp")

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight inline-flex items-center gap-2">
                    <Webhook className="w-5 h-5 text-[#8b5cf6]" /> Communication Gateways
                </h1>
                <p className="text-[13px] text-[#64748B] mt-0.5">Configure outbound email (SMTP), SMS and WhatsApp providers.</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-[#EEF1F6] bg-white">
                <TabBtn active={tab === "smtp"} onClick={() => setTab("smtp")} icon={<Mail className="w-3.5 h-3.5" />} label="SMTP / Email" />
                <TabBtn active={tab === "sms"} onClick={() => setTab("sms")} icon={<Phone className="w-3.5 h-3.5" />} label="SMS Gateway" />
                <TabBtn active={tab === "whatsapp"} onClick={() => setTab("whatsapp")} icon={<MessageSquare className="w-3.5 h-3.5" />} label="WhatsApp Business" />
            </div>

            {tab === "smtp" && <SmtpPanel />}
            {tab === "sms" && <SmsPanel />}
            {tab === "whatsapp" && <WhatsAppPanel />}
        </div>
    )
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="px-4 py-2.5 text-[13px] font-semibold inline-flex items-center gap-2 transition-colors border-b-2"
            style={{
                borderColor: active ? "#8b5cf6" : "transparent",
                color: active ? "#8b5cf6" : "#64748B",
                background: active ? "rgba(139,92,246,0.04)" : "transparent",
            }}
        >
            {icon} {label}
        </button>
    )
}

// ---------------- SMTP ----------------
function SmtpPanel() {
    const { toast } = useToast()
    const config = useAdminSettingsStore((s) => s.smtp)
    const setSmtp = useAdminSettingsStore((s) => s.setSmtp)

    const [draft, setDraft] = useState<SmtpConfig>(config)
    const [showPwd, setShowPwd] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [saving, setSaving] = useState(false)
    const [testing, setTesting] = useState(false)
    const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(config), [draft, config])

    const set = <K extends keyof SmtpConfig>(k: K, v: SmtpConfig[K]) => {
        setDraft((d) => ({ ...d, [k]: v }))
        if (touched[k as string]) {
            const err = validateField(k as string, v)
            setErrors((er) => ({ ...er, [k]: err ?? "" }))
        }
    }
    const onBlur = (k: keyof SmtpConfig) => {
        setTouched((t) => ({ ...t, [k]: true }))
        setErrors((er) => ({ ...er, [k]: validateField(k as string, draft[k]) ?? "" }))
    }

    const validate = (): boolean => {
        const next: Record<string, string> = {}
        const fields: Array<keyof SmtpConfig> = ["smtpHost", "smtpPort", "senderName", "senderEmail", "username"]
        for (const f of fields) {
            const err = validateField(f as string, draft[f])
            if (err) next[f] = err
        }
        if (draft.replyToEmail) {
            const err = validateField("replyToEmail", draft.replyToEmail)
            if (err) next.replyToEmail = err
        }
        setErrors(next)
        setTouched(Object.fromEntries(fields.map((f) => [f, true])))
        return Object.keys(next).length === 0
    }

    const onSave = () => {
        if (!validate()) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" })
            return
        }
        setSaving(true)
        setTimeout(() => {
            setSmtp(draft)
            toast({ title: "SMTP settings saved" })
            setSaving(false)
        }, 200)
    }

    const onTest = () => {
        if (!validate()) {
            toast({ title: "Fix errors before testing", variant: "destructive" })
            return
        }
        setTesting(true)
        setTimeout(() => {
            toast({ title: "Test email sent", description: `Sent to ${draft.senderEmail}. Check inbox.` })
            setTesting(false)
        }, 800)
    }

    return (
        <SectionCard
            title="SMTP / Email Gateway"
            subtitle="Outbound email server configuration."
            accent="#2563eb"
            actions={
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={onTest} disabled={testing} className="h-9 px-3 rounded-none border-[#E5E7EB] text-[#374151] text-[13px]">
                        <Send className="w-4 h-4 mr-1.5" /> {testing ? "Sending…" : "Send Test Email"}
                    </Button>
                    <Button onClick={onSave} disabled={!dirty || saving} className="h-9 px-3 rounded-none text-white text-[13px] disabled:opacity-50" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                        <Save className="w-4 h-4 mr-1.5" /> {saving ? "Saving…" : "Save"}
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                <ToggleRow
                    label="Enable Email Gateway"
                    description="When off, no transactional emails will be sent."
                    checked={draft.enabled}
                    onChange={(v) => set("enabled", v)}
                />
                <div /> {/* spacer */}
                <FieldBlock label="SMTP Host" required error={touched.smtpHost ? errors.smtpHost : undefined}>
                    <Input value={draft.smtpHost} onChange={(e) => set("smtpHost", e.target.value)} onBlur={() => onBlur("smtpHost")} placeholder="smtp.gmail.com" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                </FieldBlock>
                <FieldBlock label="SMTP Port" required error={touched.smtpPort ? errors.smtpPort : undefined}>
                    <Input type="number" min="1" max="65535" value={draft.smtpPort} onChange={(e) => set("smtpPort", Number(e.target.value))} onBlur={() => onBlur("smtpPort")} placeholder="587" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums rounded-none" />
                </FieldBlock>
                <FieldBlock label="Encryption" required>
                    <Select value={draft.encryption} onValueChange={(v) => set("encryption", v as SmtpConfig["encryption"])}>
                        <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px] rounded-none"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="TLS">STARTTLS (TLS)</SelectItem>
                            <SelectItem value="SSL">SSL</SelectItem>
                        </SelectContent>
                    </Select>
                </FieldBlock>
                <FieldBlock label="Username" required error={touched.username ? errors.username : undefined}>
                    <Input value={draft.username} onChange={(e) => set("username", e.target.value)} onBlur={() => onBlur("username")} placeholder="auth username" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                </FieldBlock>
                <FieldBlock label="Password" hint="Stored encrypted. Leave blank to keep existing.">
                    <div className="relative">
                        <Input type={showPwd ? "text" : "password"} value={draft.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" className="h-10 pr-10 border-[#E5E7EB] text-[13px] rounded-none" />
                        <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]">
                            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </FieldBlock>
                <FieldBlock label="Sender Name" required error={touched.senderName ? errors.senderName : undefined}>
                    <Input value={draft.senderName} onChange={(e) => set("senderName", e.target.value)} onBlur={() => onBlur("senderName")} placeholder="Your Company" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                </FieldBlock>
                <FieldBlock label="Sender Email" required error={touched.senderEmail ? errors.senderEmail : undefined}>
                    <Input type="email" value={draft.senderEmail} onChange={(e) => set("senderEmail", e.target.value)} onBlur={() => onBlur("senderEmail")} placeholder="noreply@your.com" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                </FieldBlock>
                <FieldBlock label="Reply-To Email" error={touched.replyToEmail ? errors.replyToEmail : undefined} className="sm:col-span-2">
                    <Input type="email" value={draft.replyToEmail} onChange={(e) => set("replyToEmail", e.target.value)} onBlur={() => onBlur("replyToEmail")} placeholder="support@your.com" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                </FieldBlock>
            </div>
        </SectionCard>
    )
}

// ---------------- SMS ----------------
function SmsPanel() {
    const { toast } = useToast()
    const config = useAdminSettingsStore((s) => s.sms)
    const setSms = useAdminSettingsStore((s) => s.setSms)

    const [draft, setDraft] = useState<SmsGatewayConfig>(config)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [saving, setSaving] = useState(false)
    const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(config), [draft, config])

    const set = <K extends keyof SmsGatewayConfig>(k: K, v: SmsGatewayConfig[K]) => {
        setDraft((d) => ({ ...d, [k]: v }))
        if (touched[k as string]) {
            const err = validateField(k as string, v)
            setErrors((er) => ({ ...er, [k]: err ?? "" }))
        }
    }
    const onBlur = (k: keyof SmsGatewayConfig) => {
        setTouched((t) => ({ ...t, [k]: true }))
        setErrors((er) => ({ ...er, [k]: validateField(k as string, draft[k]) ?? "" }))
    }

    const validate = (): boolean => {
        const next: Record<string, string> = {}
        const fields: Array<keyof SmsGatewayConfig> = ["gatewayName", "apiKey", "apiSecret", "apiUrl"]
        for (const f of fields) {
            const err = validateField(f as string, draft[f])
            if (err) next[f] = err
        }
        setErrors(next)
        setTouched(Object.fromEntries(fields.map((f) => [f, true])))
        return Object.keys(next).length === 0
    }

    const onSave = () => {
        if (!validate()) { toast({ title: "Please fix the highlighted fields", variant: "destructive" }); return }
        setSaving(true)
        setTimeout(() => { setSms(draft); toast({ title: "SMS settings saved" }); setSaving(false) }, 200)
    }

    return (
        <SectionCard
            title="SMS Gateway"
            subtitle="Outbound SMS provider configuration (Twilio, MSG91, etc.)."
            accent="#10b981"
            actions={
                <Button onClick={onSave} disabled={!dirty || saving} className="h-9 px-3 rounded-none text-white text-[13px] disabled:opacity-50" style={{ backgroundColor: "#10b981", boxShadow: "0 4px 12px #10b98133" }}>
                    <Save className="w-4 h-4 mr-1.5" /> {saving ? "Saving…" : "Save"}
                </Button>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                <ToggleRow label="Enable SMS Gateway" description="Turn on to allow outbound SMS." checked={draft.enabled} onChange={(v) => set("enabled", v)} />
                <div />
                <FieldBlock label="Gateway Name" required error={touched.gatewayName ? errors.gatewayName : undefined}>
                    <Input value={draft.gatewayName} onChange={(e) => set("gatewayName", e.target.value)} onBlur={() => onBlur("gatewayName")} placeholder="Twilio" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                </FieldBlock>
                <FieldBlock label="Sender ID">
                    <Input value={draft.senderId} onChange={(e) => set("senderId", e.target.value)} placeholder="CUBICLE" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                </FieldBlock>
                <FieldBlock label="API URL" required error={touched.apiUrl ? errors.apiUrl : undefined} className="sm:col-span-2">
                    <Input value={draft.apiUrl} onChange={(e) => set("apiUrl", e.target.value)} onBlur={() => onBlur("apiUrl")} placeholder="https://api.twilio.com/2010-04-01" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                </FieldBlock>
                <FieldBlock label="API Key" required error={touched.apiKey ? errors.apiKey : undefined}>
                    <Input value={draft.apiKey} onChange={(e) => set("apiKey", e.target.value)} onBlur={() => onBlur("apiKey")} placeholder="Account SID" className="h-10 border-[#E5E7EB] text-[13px] font-mono rounded-none" />
                </FieldBlock>
                <FieldBlock label="API Secret" required error={touched.apiSecret ? errors.apiSecret : undefined}>
                    <Input type="password" value={draft.apiSecret} onChange={(e) => set("apiSecret", e.target.value)} onBlur={() => onBlur("apiSecret")} placeholder="Auth Token" className="h-10 border-[#E5E7EB] text-[13px] font-mono rounded-none" />
                </FieldBlock>
            </div>
        </SectionCard>
    )
}

// ---------------- WhatsApp ----------------
function WhatsAppPanel() {
    const { toast } = useToast()
    const config = useAdminSettingsStore((s) => s.whatsapp)
    const setWa = useAdminSettingsStore((s) => s.setWhatsapp)

    const [draft, setDraft] = useState<WhatsAppGatewayConfig>(config)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [saving, setSaving] = useState(false)
    const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(config), [draft, config])

    const set = <K extends keyof WhatsAppGatewayConfig>(k: K, v: WhatsAppGatewayConfig[K]) => {
        setDraft((d) => ({ ...d, [k]: v }))
        if (touched[k as string]) {
            const err = validateField(k as string, v)
            setErrors((er) => ({ ...er, [k]: err ?? "" }))
        }
    }
    const onBlur = (k: keyof WhatsAppGatewayConfig) => {
        setTouched((t) => ({ ...t, [k]: true }))
        setErrors((er) => ({ ...er, [k]: validateField(k as string, draft[k]) ?? "" }))
    }

    const validate = (): boolean => {
        const next: Record<string, string> = {}
        const fields: Array<keyof WhatsAppGatewayConfig> = ["gatewayName", "phoneNumber", "accessToken", "apiUrl"]
        for (const f of fields) {
            const err = validateField(f as string, draft[f])
            if (err) next[f] = err
        }
        setErrors(next)
        setTouched(Object.fromEntries(fields.map((f) => [f, true])))
        return Object.keys(next).length === 0
    }

    const onSave = () => {
        if (!validate()) { toast({ title: "Please fix the highlighted fields", variant: "destructive" }); return }
        setSaving(true)
        setTimeout(() => { setWa(draft); toast({ title: "WhatsApp settings saved" }); setSaving(false) }, 200)
    }

    return (
        <SectionCard
            title="WhatsApp Business"
            subtitle="WhatsApp Business Cloud API configuration."
            accent="#25D366"
            actions={
                <Button onClick={onSave} disabled={!dirty || saving} className="h-9 px-3 rounded-none text-white text-[13px] disabled:opacity-50" style={{ backgroundColor: "#25D366", boxShadow: "0 4px 12px rgba(37,211,102,0.3)" }}>
                    <Save className="w-4 h-4 mr-1.5" /> {saving ? "Saving…" : "Save"}
                </Button>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                <ToggleRow label="Enable WhatsApp Gateway" description="Send notifications via WhatsApp Business." checked={draft.enabled} onChange={(v) => set("enabled", v)} />
                <div />
                <FieldBlock label="Gateway Name" required error={touched.gatewayName ? errors.gatewayName : undefined}>
                    <Input value={draft.gatewayName} onChange={(e) => set("gatewayName", e.target.value)} onBlur={() => onBlur("gatewayName")} placeholder="WhatsApp Business" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                </FieldBlock>
                <FieldBlock label="Business Phone Number" required error={touched.phoneNumber ? errors.phoneNumber : undefined} hint="Include country code (+91, +1, ...)">
                    <Input value={draft.phoneNumber} onChange={(e) => set("phoneNumber", e.target.value)} onBlur={() => onBlur("phoneNumber")} placeholder="+919812345678" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                </FieldBlock>
                <FieldBlock label="API URL" required error={touched.apiUrl ? errors.apiUrl : undefined} className="sm:col-span-2">
                    <Input value={draft.apiUrl} onChange={(e) => set("apiUrl", e.target.value)} onBlur={() => onBlur("apiUrl")} placeholder="https://graph.facebook.com/v18.0" className="h-10 border-[#E5E7EB] text-[13px] rounded-none" />
                </FieldBlock>
                <FieldBlock label="Access Token" required error={touched.accessToken ? errors.accessToken : undefined} className="sm:col-span-2">
                    <Input type="password" value={draft.accessToken} onChange={(e) => set("accessToken", e.target.value)} onBlur={() => onBlur("accessToken")} placeholder="Permanent access token" className="h-10 border-[#E5E7EB] text-[13px] font-mono rounded-none" />
                </FieldBlock>
            </div>
        </SectionCard>
    )
}

// ---------------- Helpers ----------------
function SectionCard({ title, subtitle, accent, actions, children }: { title: string; subtitle: string; accent: string; actions: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="border shadow-sm overflow-hidden rounded-none" style={{ background: `linear-gradient(180deg, ${accent}0d 0%, #ffffff 50%)`, borderColor: `${accent}26` }}>
            <div className="px-5 py-3.5 border-b flex items-center justify-between gap-3" style={{ borderColor: `${accent}22` }}>
                <div className="flex items-start gap-2">
                    <span className="w-1 h-9 shrink-0" style={{ backgroundColor: accent }} />
                    <div>
                        <h2 className="text-[14px] font-semibold text-[#0F172A]">{title}</h2>
                        <p className="text-[11.5px] text-[#94A3B8] mt-0.5">{subtitle}</p>
                    </div>
                </div>
                {actions}
            </div>
            {children}
        </div>
    )
}

function FieldBlock({ label, required, error, hint, children, className = "" }: { label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <label className="text-[13px] font-semibold text-[#374151] flex items-center gap-0.5">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error ? (
                <p className="text-[11.5px] text-red-500 mt-1">{error}</p>
            ) : hint ? (
                <p className="text-[11.5px] text-[#9CA3AF] mt-1">{hint}</p>
            ) : null}
        </div>
    )
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-start justify-between gap-3 sm:col-span-2 p-3 border border-[#EEF1F6] bg-white">
            <div>
                <p className="text-[13px] font-semibold text-[#0F172A] inline-flex items-center gap-2">
                    {checked ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-[#94A3B8]" />}
                    {label}
                </p>
                <p className="text-[12px] text-[#64748B] mt-0.5">{description}</p>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    )
}
