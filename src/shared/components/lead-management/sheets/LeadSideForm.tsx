"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
    UserPlus, FileText, Briefcase, Building2, Tag as TagIcon,
    Sparkles, Calendar, MapPin, X,
} from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Button } from "@/shared/components/ui/button"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import { useToast } from "@/shared/components/ui/use-toast"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import type { Lead } from "../LeadInboxTable"
import { validateField } from "../lead-validation"

// ─────────────────────────────────────────────────────────────────────────────
// Reference data
// ─────────────────────────────────────────────────────────────────────────────

const SOURCES = [
    "Google", "LinkedIn", "Direct", "Referral", "Web Form", "Twitter",
    "TV Ad", "Re-engagement", "Campaign", "Cold Call", "Partner", "Other",
]
const STATUSES = [
    "New", "Awaiting Assignment", "Assigned", "SLA Breached",
    "Inactive", "Stagnant", "Dormant", "Priority", "Reactivated", "Active",
]
const STAGES = [
    "Discovery", "Initial Pitch", "Hot", "Warm", "Cold",
    "Negotiation", "Proposal", "Closed Won", "Lost",
]
const PRIORITIES = ["Low", "Medium", "High", "Urgent"]
const OWNERS = ["Unassigned", "Rajesh Kumar", "Anita Sharma", "Sunil Moitra", "Priya Singh"]

// ─────────────────────────────────────────────────────────────────────────────
// Form shape
// ─────────────────────────────────────────────────────────────────────────────

export interface LeadFormShape {
    // Identity
    title: string
    description: string
    // Primary Contact
    name: string
    position: string
    email: string
    phone: string
    website: string
    // Company & Source
    company: string
    source: string
    sourceDetails: string
    // Pipeline
    status: string
    stage: string
    value: string
    priority: string
    // Ownership
    ownerName: string
    // Next Action
    nextAction: string
    nextActionDate: string
    // Segmentation
    industry: string
    region: string
    // Tags & Notes
    tags: string[]
    notes: string
}

const empty: LeadFormShape = {
    title: "", description: "",
    name: "", position: "", email: "", phone: "", website: "",
    company: "", source: "Google", sourceDetails: "",
    status: "New", stage: "Discovery", value: "", priority: "Medium",
    ownerName: "Unassigned",
    nextAction: "", nextActionDate: "",
    industry: "", region: "",
    tags: [], notes: "",
}

const REQUIRED_FIELDS: Array<keyof LeadFormShape> = [
    "name", "email", "phone", "company", "source", "status", "stage", "value", "priority",
]

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

interface LeadSideFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: Lead | null
    onSubmit: (data: LeadFormShape) => void
    title?: string
    submitLabel?: string
}

export default function LeadSideForm({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    title,
    submitLabel,
}: LeadSideFormProps) {
    const { toast } = useToast()
    const [data, setData] = useState<LeadFormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)
    const [tagInput, setTagInput] = useState("")
    const [tagError, setTagError] = useState<string | null>(null)

    const isEdit = !!initialData

    useEffect(() => {
        if (!open) return
        if (initialData) {
            const init = initialData as any
            setData({
                title: init.title ?? "",
                description: init.description ?? "",
                name: initialData.name ?? "",
                position: init.position ?? "",
                email: initialData.email ?? "",
                phone: init.phone ?? "",
                website: init.website ?? "",
                company: initialData.company ?? "",
                source: initialData.source ?? "Google",
                sourceDetails: init.sourceDetails ?? "",
                status: initialData.status ?? "New",
                stage: initialData.stage ?? "Discovery",
                value: initialData.value ?? "",
                priority: (init.priority as string) ?? "Medium",
                ownerName: initialData.ownerName ?? "Unassigned",
                nextAction: init.nextAction ?? "",
                nextActionDate: init.nextActionDate ?? "",
                industry: init.industry ?? "",
                region: init.region ?? "",
                tags: initialData.tags ?? [],
                notes: init.notes ?? "",
            })
        } else {
            setData(empty)
        }
        setErrors({})
        setTouched({})
        setTagInput("")
        setTagError(null)
    }, [open, initialData])

    const setField = <K extends keyof LeadFormShape>(k: K, v: LeadFormShape[K]) => {
        setData((prev) => ({ ...prev, [k]: v }))
        if (touched[k]) {
            setErrors((prev) => ({ ...prev, [k]: validateField(k as string, v) ?? "" }))
        }
    }

    const onBlur = <K extends keyof LeadFormShape>(k: K) => {
        setTouched((prev) => ({ ...prev, [k]: true }))
        setErrors((prev) => ({ ...prev, [k]: validateField(k as string, data[k]) ?? "" }))
    }

    const validateAll = (): boolean => {
        const next: Record<string, string> = {}
        const fields = Object.keys(data) as Array<keyof LeadFormShape>
        for (const f of fields) {
            if (f === "tags") continue
            const err = validateField(f as string, data[f])
            if (err) next[f] = err
        }
        for (const f of REQUIRED_FIELDS) {
            if (!next[f] && (data[f] === "" || data[f] === null || data[f] === undefined)) {
                next[f] = `${f.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())} is required`
            }
        }
        setErrors(next)
        setTouched(Object.fromEntries(fields.map((f) => [f, true])))
        return Object.keys(next).length === 0
    }

    const handleAddTag = () => {
        const v = tagInput.trim()
        if (!v) return
        const err = validateField("tag", v)
        if (err) { setTagError(err); return }
        if (data.tags.includes(v)) { setTagError("Tag already added"); return }
        setData((prev) => ({ ...prev, tags: [...prev.tags, v] }))
        setTagInput("")
        setTagError(null)
    }

    const removeTag = (tag: string) => {
        setData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
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

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title={title ?? (isEdit ? "Edit Lead" : "Create New Lead")}
            description={
                isEdit
                    ? "Update lead details, contact, pipeline and ownership."
                    : "Capture a new prospect with full identity, contact and qualification details."
            }
            icon={isEdit ? <FileText className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            onSubmit={handleSubmit}
            loading={submitting}
            submitLabel={submitLabel ?? (isEdit ? "Update Lead" : "Create Lead")}
            width="xl"
            accentColor="#6366f1"
        >
            <div className="space-y-6">
                {/* Section 1: Lead Identity */}
                <Section icon={<FileText className="w-3.5 h-3.5" />} title="Lead Identity" accent="#6366f1">
                    <div className="grid grid-cols-1 gap-4">
                        <Field
                            label="Lead Title"
                            error={touched.title ? errors.title : undefined}
                            hint="Optional — give this opportunity a memorable name"
                        >
                            <Input
                                value={data.title}
                                onChange={(e) => setField("title", e.target.value)}
                                onBlur={() => onBlur("title")}
                                placeholder="e.g. Q3 Enterprise Renewal — Acme Corp"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                        <Field
                            label="Description"
                            error={touched.description ? errors.description : undefined}
                            hint="Optional · max 500 chars"
                        >
                            <Textarea
                                value={data.description}
                                onChange={(e) => setField("description", e.target.value)}
                                onBlur={() => onBlur("description")}
                                placeholder="Potential high-value client from referral. Decision-maker engaged on call."
                                rows={3}
                                className="rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                    </div>
                </Section>

                {/* Section 2: Primary Contact */}
                <Section icon={<UserPlus className="w-3.5 h-3.5" />} title="Primary Contact" accent="#10b981">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Full Name" required error={touched.name ? errors.name : undefined}>
                            <Input
                                value={data.name}
                                onChange={(e) => setField("name", e.target.value)}
                                onBlur={() => onBlur("name")}
                                placeholder="Jane Doe"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                        <Field label="Position" error={touched.position ? errors.position : undefined}>
                            <Input
                                value={data.position}
                                onChange={(e) => setField("position", e.target.value)}
                                onBlur={() => onBlur("position")}
                                placeholder="VP of Procurement"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                        <Field label="Email" required error={touched.email ? errors.email : undefined}>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setField("email", e.target.value)}
                                onBlur={() => onBlur("email")}
                                placeholder="jane@acme.com"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                        <Field label="Phone" required error={touched.phone ? errors.phone : undefined}>
                            <Input
                                value={data.phone}
                                onChange={(e) => setField("phone", e.target.value)}
                                onBlur={() => onBlur("phone")}
                                placeholder="+91 98765 43210"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                        <Field
                            label="Website"
                            error={touched.website ? errors.website : undefined}
                            hint="Must start with http:// or https://"
                            className="sm:col-span-2"
                        >
                            <Input
                                value={data.website}
                                onChange={(e) => setField("website", e.target.value)}
                                onBlur={() => onBlur("website")}
                                placeholder="https://acme.com"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                    </div>
                </Section>

                {/* Section 3: Company & Source */}
                <Section icon={<Building2 className="w-3.5 h-3.5" />} title="Company & Source" accent="#f59e0b">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Company" required error={touched.company ? errors.company : undefined}>
                            <Input
                                value={data.company}
                                onChange={(e) => setField("company", e.target.value)}
                                onBlur={() => onBlur("company")}
                                placeholder="Acme Corp"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                        <Field label="Source" required error={touched.source ? errors.source : undefined}>
                            <Select
                                value={data.source}
                                onValueChange={(v) => { setField("source", v); setTouched((p) => ({ ...p, source: true })) }}
                            >
                                <SelectTrigger className="h-10 rounded-none border-[#E5E7EB] text-[13px]">
                                    <SelectValue placeholder="Where did they come from?" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SOURCES.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field
                            label="Source Details"
                            error={touched.sourceDetails ? errors.sourceDetails : undefined}
                            hint="Campaign name, UTM source, referrer name, etc."
                            className="sm:col-span-2"
                        >
                            <Input
                                value={data.sourceDetails}
                                onChange={(e) => setField("sourceDetails", e.target.value)}
                                onBlur={() => onBlur("sourceDetails")}
                                placeholder="utm_campaign=q3-enterprise"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                    </div>
                </Section>

                {/* Section 4: Pipeline & Qualification */}
                <Section icon={<Sparkles className="w-3.5 h-3.5" />} title="Pipeline & Qualification" accent="#3b82f6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Status" required error={touched.status ? errors.status : undefined}>
                            <Select
                                value={data.status}
                                onValueChange={(v) => { setField("status", v); setTouched((p) => ({ ...p, status: true })) }}
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
                        <Field label="Stage" required error={touched.stage ? errors.stage : undefined}>
                            <Select
                                value={data.stage}
                                onValueChange={(v) => { setField("stage", v); setTouched((p) => ({ ...p, stage: true })) }}
                            >
                                <SelectTrigger className="h-10 rounded-none border-[#E5E7EB] text-[13px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STAGES.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field
                            label="Estimated Value"
                            required
                            error={touched.value ? errors.value : undefined}
                            hint="e.g. 12500, $1.2M, ₹85,000"
                        >
                            <Input
                                value={data.value}
                                onChange={(e) => setField("value", e.target.value)}
                                onBlur={() => onBlur("value")}
                                placeholder="$25,000"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px] tabular-nums"
                            />
                        </Field>
                        <Field label="Priority" required error={touched.priority ? errors.priority : undefined}>
                            <Select
                                value={data.priority}
                                onValueChange={(v) => { setField("priority", v); setTouched((p) => ({ ...p, priority: true })) }}
                            >
                                <SelectTrigger className="h-10 rounded-none border-[#E5E7EB] text-[13px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRIORITIES.map((p) => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field
                            label="Owner"
                            error={touched.ownerName ? errors.ownerName : undefined}
                            className="sm:col-span-2"
                        >
                            <Select
                                value={data.ownerName}
                                onValueChange={(v) => { setField("ownerName", v); setTouched((p) => ({ ...p, ownerName: true })) }}
                            >
                                <SelectTrigger className="h-10 rounded-none border-[#E5E7EB] text-[13px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {OWNERS.map((o) => (
                                        <SelectItem key={o} value={o}>{o}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                </Section>

                {/* Section 5: Next Action & Segmentation */}
                <Section icon={<Calendar className="w-3.5 h-3.5" />} title="Next Action & Segmentation" accent="#8b5cf6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Next Action" error={touched.nextAction ? errors.nextAction : undefined}>
                            <Input
                                value={data.nextAction}
                                onChange={(e) => setField("nextAction", e.target.value)}
                                onBlur={() => onBlur("nextAction")}
                                placeholder="Demo call with technical team"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                        <Field
                            label="Next Action Date"
                            error={touched.nextActionDate ? errors.nextActionDate : undefined}
                            hint="Today or future"
                        >
                            <Input
                                type="date"
                                value={data.nextActionDate}
                                onChange={(e) => setField("nextActionDate", e.target.value)}
                                onBlur={() => onBlur("nextActionDate")}
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                        <Field label="Industry" error={touched.industry ? errors.industry : undefined}>
                            <Input
                                value={data.industry}
                                onChange={(e) => setField("industry", e.target.value)}
                                onBlur={() => onBlur("industry")}
                                placeholder="SaaS / FinTech / Manufacturing"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                        <Field label="Region" error={touched.region ? errors.region : undefined}>
                            <Input
                                value={data.region}
                                onChange={(e) => setField("region", e.target.value)}
                                onBlur={() => onBlur("region")}
                                placeholder="APAC / EMEA / North America"
                                className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                    </div>
                </Section>

                {/* Section 6: Tags & Notes */}
                <Section icon={<TagIcon className="w-3.5 h-3.5" />} title="Tags & Notes" accent="#0ea5e9">
                    <div className="space-y-4">
                        <Field
                            label="Tags"
                            error={tagError ?? undefined}
                            hint="Press Enter to add · letters/digits/spaces/_/- · max 30 chars"
                        >
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => { setTagInput(e.target.value); setTagError(null) }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") { e.preventDefault(); handleAddTag() }
                                    }}
                                    placeholder="Type a tag and press Enter"
                                    className="h-10 rounded-none border-[#E5E7EB] text-[13px]"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddTag}
                                    variant="outline"
                                    className="h-10 rounded-none border-[#E5E7EB] text-[12.5px]"
                                >
                                    Add
                                </Button>
                            </div>
                            {data.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {data.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-none gap-1 text-[11.5px] font-medium"
                                        >
                                            {tag}
                                            <X
                                                className="h-3 w-3 cursor-pointer hover:text-red-600"
                                                onClick={() => removeTag(tag)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </Field>
                        <Field label="Notes" error={touched.notes ? errors.notes : undefined} hint="Optional · max 500 chars">
                            <Textarea
                                value={data.notes}
                                onChange={(e) => setField("notes", e.target.value)}
                                onBlur={() => onBlur("notes")}
                                placeholder="Asked for pricing comparison. Send proposal by next Friday."
                                rows={3}
                                className="rounded-none border-[#E5E7EB] text-[13px]"
                            />
                        </Field>
                    </div>
                </Section>
            </div>
        </SideFormSheet>
    )
}

function Section({
    icon, title, accent, children,
}: {
    icon: React.ReactNode
    title: string
    accent: string
    children: React.ReactNode
}) {
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
