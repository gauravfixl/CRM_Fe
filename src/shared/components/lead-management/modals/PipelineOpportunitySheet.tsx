"use client"

import React, { useEffect, useState } from "react"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Input } from "@/shared/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import { HandMetal, X } from "lucide-react"
import type { PipelineLead } from "@/shared/hooks/use-pipeline-data"

export interface OpportunityFormData {
    name: string
    email: string
    company: string
    value: string
    source: string
    stage: string
    priority: "low" | "medium" | "high"
    ownerName: string
    tags: string[]
}

interface PipelineOpportunitySheetProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: OpportunityFormData) => void
    initialData?: PipelineLead | null
    title?: string
    stages?: { id: string; title: string }[]
}

const DEFAULT_STAGES = [
    { id: "new", title: "New" },
    { id: "contacted", title: "Contacted" },
    { id: "engaged", title: "Engaged" },
    { id: "qualified", title: "Qualified" },
    { id: "proposal", title: "Proposal Shared" },
    { id: "negotiation", title: "Negotiation" },
    { id: "pending", title: "Decision Pending" },
    { id: "won", title: "Won" },
    { id: "lost", title: "Lost" },
]

const SOURCES = ["Google", "LinkedIn", "Direct", "Referral", "Website"]
const OWNERS = ["Rajesh Kumar", "Anita Sharma", "Sunil Moitra", "David Miller", "Unassigned"]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function PipelineOpportunitySheet({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title,
    stages,
}: PipelineOpportunitySheetProps) {
    const stageList = stages && stages.length > 0 ? stages : DEFAULT_STAGES

    const [form, setForm] = useState<OpportunityFormData>({
        name: "",
        email: "",
        company: "",
        value: "",
        source: SOURCES[0],
        stage: stageList[0].id,
        priority: "medium",
        ownerName: "Unassigned",
        tags: [],
    })
    const [tagInput, setTagInput] = useState("")
    const [errors, setErrors] = useState<Partial<Record<keyof OpportunityFormData, string>>>({})

    useEffect(() => {
        if (!isOpen) return
        if (initialData) {
            setForm({
                name: initialData.name || "",
                email: initialData.email || "",
                company: initialData.company || "",
                value: initialData.value || "",
                source: initialData.source || SOURCES[0],
                stage: initialData.stage || stageList[0].id,
                priority: (initialData.priority as any) || "medium",
                ownerName: initialData.owner || "Unassigned",
                tags: initialData.tags || [],
            })
        } else {
            setForm({
                name: "",
                email: "",
                company: "",
                value: "",
                source: SOURCES[0],
                stage: stageList[0].id,
                priority: "medium",
                ownerName: "Unassigned",
                tags: [],
            })
        }
        setErrors({})
        setTagInput("")
    }, [isOpen, initialData])

    const validate = (): boolean => {
        const next: Partial<Record<keyof OpportunityFormData, string>> = {}

        if (!form.name.trim()) next.name = "Full name is required"
        else if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters"
        else if (!/^[A-Za-z][A-Za-z\s.'-]*$/.test(form.name.trim())) next.name = "Only letters, spaces, dots and hyphens allowed"

        if (!form.email.trim()) next.email = "Email is required"
        else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email address"

        if (!form.company.trim()) next.company = "Company name is required"
        else if (form.company.trim().length < 2) next.company = "Company name is too short"

        if (!form.value.trim()) next.value = "Estimated value is required"
        else {
            const numeric = parseFloat(form.value.replace(/[^0-9.]/g, ""))
            if (isNaN(numeric) || numeric <= 0) next.value = "Enter a positive amount"
        }

        if (!form.source.trim()) next.source = "Lead source is required"
        if (!form.stage.trim()) next.stage = "Stage is required"
        if (!form.ownerName.trim()) next.ownerName = "Owner is required"
        if (!form.priority) next.priority = "Priority is required"

        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        const cleaned: OpportunityFormData = {
            ...form,
            name: form.name.trim(),
            email: form.email.trim(),
            company: form.company.trim(),
            value: form.value.trim().startsWith("$")
                ? form.value.trim()
                : `$${form.value.replace(/[^0-9.]/g, "") || 0}`,
        }
        onSubmit(cleaned)
    }

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault()
            if (!form.tags.includes(tagInput.trim())) {
                setForm({ ...form, tags: [...form.tags, tagInput.trim()] })
            }
            setTagInput("")
        }
    }

    const removeTag = (tag: string) => {
        setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })
    }

    return (
        <SideFormSheet
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose()
            }}
            title={title || (initialData ? "Edit Opportunity" : "Create Opportunity")}
            description="Capture full opportunity details and stage placement."
            icon={<HandMetal className="h-5 w-5" />}
            accentColor="#4f46e5"
            width="lg"
            onSubmit={handleSubmit}
            submitLabel={initialData ? "Save Changes" : "Create Opportunity"}
        >
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Full Name" required error={errors.name}>
                        <Input
                            name="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="John Doe"
                            className="h-10 border-slate-200 rounded-none"
                        />
                    </Field>

                    <Field label="Email Address" required error={errors.email}>
                        <Input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="john@example.com"
                            className="h-10 border-slate-200 rounded-none"
                        />
                    </Field>

                    <Field label="Company" required error={errors.company}>
                        <Input
                            name="company"
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                            placeholder="Acme Corp"
                            className="h-10 border-slate-200 rounded-none"
                        />
                    </Field>

                    <Field label="Estimated Value" required error={errors.value}>
                        <Input
                            name="value"
                            value={form.value}
                            onChange={(e) => setForm({ ...form, value: e.target.value })}
                            placeholder="$10,000"
                            className="h-10 border-slate-200 rounded-none"
                        />
                    </Field>

                    <Field label="Lead Source" required error={errors.source}>
                        <Select
                            value={form.source}
                            onValueChange={(v) => setForm({ ...form, source: v })}
                        >
                            <SelectTrigger className="h-10 border-slate-200 rounded-none">
                                <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                                {SOURCES.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {s}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Pipeline Stage" required error={errors.stage}>
                        <Select
                            value={form.stage}
                            onValueChange={(v) => setForm({ ...form, stage: v })}
                        >
                            <SelectTrigger className="h-10 border-slate-200 rounded-none">
                                <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                                {stageList.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Priority" required error={errors.priority}>
                        <Select
                            value={form.priority}
                            onValueChange={(v) =>
                                setForm({ ...form, priority: v as "low" | "medium" | "high" })
                            }
                        >
                            <SelectTrigger className="h-10 border-slate-200 rounded-none">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low Priority</SelectItem>
                                <SelectItem value="medium">Medium Priority</SelectItem>
                                <SelectItem value="high">High Priority</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Owner" required error={errors.ownerName}>
                        <Select
                            value={form.ownerName}
                            onValueChange={(v) => setForm({ ...form, ownerName: v })}
                        >
                            <SelectTrigger className="h-10 border-slate-200 rounded-none">
                                <SelectValue placeholder="Assign owner" />
                            </SelectTrigger>
                            <SelectContent>
                                {OWNERS.map((o) => (
                                    <SelectItem key={o} value={o}>
                                        {o}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>

                <Field label="Tags" hint="Type a tag and press Enter to add it">
                    <div className="flex flex-wrap gap-2 p-2 min-h-[44px] border border-slate-200 rounded-none bg-white">
                        {form.tags.map((tag) => (
                            <Badge
                                key={tag}
                                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-none px-2 py-1 gap-1 rounded-none"
                            >
                                {tag}
                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => removeTag(tag)}
                                />
                            </Badge>
                        ))}
                        <input
                            name="tagInput"
                            className="flex-1 outline-none text-[13px] bg-transparent min-w-[120px] ml-1"
                            placeholder="Type and press Enter..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                        />
                    </div>
                </Field>
            </div>
        </SideFormSheet>
    )
}
