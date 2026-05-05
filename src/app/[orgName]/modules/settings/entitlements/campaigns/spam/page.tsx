"use client"

import React, { useState, useMemo } from "react"
import {
    Shield,
    AlertTriangle,
    CheckCircle2,
    Plus,
    Search,
    Edit,
    Trash2,
    MoreVertical,
    Pencil,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/shared/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/shared/utils/toast"

type ProtectionRule = {
    id: string
    rule: string
    type: "Compliance" | "Content" | "Deliverability"
    severity: "Critical" | "High" | "Medium"
    violations: number
    compliance: number
    status: "Active" | "Paused"
    description?: string
}

const ruleTypes = ["Compliance", "Content", "Deliverability"] as const
const severities = ["Critical", "High", "Medium"] as const

export default function SpamProtectionPage() {
    const [showFormModal, setShowFormModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [protections, setProtections] = useState<ProtectionRule[]>([
        { id: "1", rule: "Unsubscribe Link Required", type: "Compliance", severity: "Critical", violations: 0, compliance: 100, status: "Active" },
        { id: "2", rule: "Spam Word Filter", type: "Content", severity: "High", violations: 12, compliance: 94, status: "Active" },
        { id: "3", rule: "Bounce Rate Monitor", type: "Deliverability", severity: "Medium", violations: 3, compliance: 98, status: "Active" },
    ])

    const [form, setForm] = useState({
        rule: "",
        type: "Content" as "Compliance" | "Content" | "Deliverability",
        severity: "Medium" as "Critical" | "High" | "Medium",
        description: "",
    })
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const errors = useMemo(() => {
        const e: Record<string, string> = {}
        if (touched.rule) {
            if (!form.rule.trim()) e.rule = "Rule name is required"
            else if (form.rule.trim().length < 2) e.rule = "Name too short"
        }
        if (touched.description && form.description.length > 250)
            e.description = "Description too long (max 250)"
        return e
    }, [form, touched])

    const resetForm = () => {
        setForm({ rule: "", type: "Content", severity: "Medium", description: "" })
        setTouched({})
        setEditingId(null)
    }

    const openCreateModal = () => {
        resetForm()
        setShowFormModal(true)
    }

    const openEditModal = (p: ProtectionRule) => {
        setEditingId(p.id)
        setForm({
            rule: p.rule,
            type: p.type,
            severity: p.severity,
            description: p.description || "",
        })
        setTouched({})
        setShowFormModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ rule: true, description: true })
        if (!form.rule.trim()) return showWarning("Rule name is required")

        setSubmitting(true)
        try {
            await new Promise((r) => setTimeout(r, 300))
            if (editingId) {
                setProtections((prev) =>
                    prev.map((p) =>
                        p.id === editingId
                            ? {
                                  ...p,
                                  rule: form.rule.trim(),
                                  type: form.type,
                                  severity: form.severity,
                                  description: form.description.trim(),
                              }
                            : p
                    )
                )
                showSuccess(`${form.rule} updated successfully`)
            } else {
                setProtections((prev) => [
                    ...prev,
                    {
                        id: String(Date.now()),
                        rule: form.rule.trim(),
                        type: form.type,
                        severity: form.severity,
                        violations: 0,
                        compliance: 100,
                        status: "Active",
                        description: form.description.trim(),
                    },
                ])
                showSuccess(`${form.rule} protection rule created`)
            }
            setShowFormModal(false)
            resetForm()
        } finally {
            setSubmitting(false)
        }
    }

    const toggleStatus = (id: string) => {
        setProtections((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, status: p.status === "Active" ? "Paused" : "Active" } : p
            )
        )
        showSuccess("Protection rule status updated")
    }

    const deleteRule = (id: string) => {
        const p = protections.find((x) => x.id === id)
        if (!p) return
        const ok = window.confirm(`Delete ${p.rule}?`)
        if (!ok) return
        setProtections((prev) => prev.filter((x) => x.id !== id))
        showSuccess("Protection rule deleted")
    }

    const filtered = protections.filter((p) =>
        p.rule.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const avgCompliance = protections.length
        ? Math.round(protections.reduce((s, p) => s + p.compliance, 0) / protections.length)
        : 0
    const totalViolations = protections.reduce((s, p) => s + p.violations, 0)

    const severityClasses = (s: ProtectionRule["severity"]) => {
        switch (s) {
            case "Critical":
                return "bg-red-50 text-red-700 border border-red-200 hover:bg-red-50"
            case "High":
                return "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50"
            default:
                return "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10"
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Header */}
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Spam Protection</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Ensure compliance and protect sender reputation across all channels.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4 shadow-md shadow-primary/20"
                    >
                        <Plus size={14} />
                        Add Rule
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Protection Rules</p>
                        <p className="text-white text-xl font-semibold mt-1">{protections.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Configured</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Avg. Compliance</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{avgCompliance}%</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Across all rules</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Violations</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalViolations}</p>
                        <p className="text-amber-600 text-[10px] mt-1">This month</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Sender Score</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">98</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Excellent reputation</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <Input
                                placeholder="Search protection rules..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 rounded-none border-gray-200 h-9 text-xs focus:ring-primary bg-white"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Rule Name</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Type</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Severity</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Violations</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Compliance</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className="text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900">{p.rule}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className="rounded-none bg-primary/10 text-primary border border-primary/20 text-[10px] font-medium px-2 py-0.5 hover:bg-primary/10">
                                                {p.type}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                className={`rounded-none text-[10px] font-medium px-2 py-0.5 flex items-center gap-1 w-fit ${severityClasses(
                                                    p.severity
                                                )}`}
                                            >
                                                {p.severity === "Critical" && <AlertTriangle size={10} />}
                                                {p.severity}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.violations === 0 ? (
                                                <Badge className="rounded-none bg-green-50 text-green-700 border border-green-200 text-[10px] font-medium px-2 py-0.5 flex items-center gap-1 w-fit hover:bg-green-50">
                                                    <CheckCircle2 size={10} /> None
                                                </Badge>
                                            ) : (
                                                <span className="text-sm font-semibold text-amber-600">
                                                    {p.violations}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3 min-w-[160px]">
                                                <Progress
                                                    value={p.compliance}
                                                    className="h-1.5 flex-1 bg-gray-100"
                                                />
                                                <span
                                                    className={`text-xs font-semibold ${
                                                        p.compliance >= 95 ? "text-emerald-600" : "text-amber-600"
                                                    }`}
                                                >
                                                    {p.compliance}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={p.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(p.id)}
                                                />
                                                <Badge
                                                    className={`rounded-none text-[10px] font-medium px-2 py-0.5 ${
                                                        p.status === "Active"
                                                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
                                                            : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                                                    }`}
                                                >
                                                    {p.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-none transition-colors">
                                                        <MoreVertical size={14} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none min-w-[150px]">
                                                    <DropdownMenuLabel className="text-[10px] font-medium text-zinc-400">
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => openEditModal(p)}
                                                        className="text-xs font-medium cursor-pointer gap-2"
                                                    >
                                                        <Edit size={13} />
                                                        Edit rule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteRule(p.id)}
                                                        className="text-xs font-medium text-red-600 focus:text-red-600 cursor-pointer gap-2"
                                                    >
                                                        <Trash2 size={13} />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-xs text-gray-400">
                                            No protection rules found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                        <p className="text-xs text-gray-500">
                            Showing {filtered.length} of {protections.length} rules
                        </p>
                    </div>
                </div>
            </div>

            {/* Create / Edit side sheet */}
            <SideFormSheet
                open={showFormModal}
                onOpenChange={(o) => {
                    setShowFormModal(o)
                    if (!o) resetForm()
                }}
                title={editingId ? "Edit Protection Rule" : "Add Protection Rule"}
                description={
                    editingId
                        ? "Update the protection rule details below."
                        : "Create a new spam protection rule for your campaigns."
                }
                icon={editingId ? <Pencil className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                width="md"
                onSubmit={handleSubmit}
                submitLabel={editingId ? "Save Changes" : "Add Rule"}
                loading={submitting}
            >
                <div className="space-y-4">
                    <Field label="Rule Name" required error={errors.rule}>
                        <Input
                            placeholder="e.g. Content Keyword Filter"
                            value={form.rule}
                            onChange={(e) => setForm((f) => ({ ...f, rule: e.target.value }))}
                            onBlur={() => setTouched((t) => ({ ...t, rule: true }))}
                            className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                            maxLength={80}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Rule Type">
                            <Select
                                value={form.type}
                                onValueChange={(v) =>
                                    setForm((f) => ({
                                        ...f,
                                        type: v as "Compliance" | "Content" | "Deliverability",
                                    }))
                                }
                            >
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ruleTypes.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Severity">
                            <Select
                                value={form.severity}
                                onValueChange={(v) =>
                                    setForm((f) => ({
                                        ...f,
                                        severity: v as "Critical" | "High" | "Medium",
                                    }))
                                }
                            >
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                    <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                    {severities.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field
                        label="Description"
                        error={errors.description}
                        hint={`${form.description.length}/250 characters (optional)`}
                    >
                        <Textarea
                            placeholder="Describe what this rule enforces..."
                            value={form.description}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, description: e.target.value.slice(0, 250) }))
                            }
                            className="rounded-lg bg-white border-[#E5E7EB] focus:border-primary text-[13px] min-h-[90px]"
                        />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    )
}
