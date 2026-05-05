"use client"

import React, { useState, useMemo } from "react"
import {
    DollarSign,
    TrendingUp,
    Target,
    Calculator,
    Plus,
    Search,
    Edit,
    Trash2,
    MoreVertical,
    Pencil,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/shared/utils/toast"

type ROIConfig = {
    id: string
    metric: string
    formula: string
    target: string
    current: string
    performance: number
    status: "Active" | "Paused"
}

export default function ROIConfigPage() {
    const [showFormModal, setShowFormModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [configs, setConfigs] = useState<ROIConfig[]>([
        { id: "1", metric: "Cost Per Lead", formula: "Total Spend / Leads", target: "$50", current: "$42", performance: 84, status: "Active" },
        { id: "2", metric: "Return on Ad Spend", formula: "Revenue / Ad Spend", target: "5:1", current: "6.2:1", performance: 124, status: "Active" },
        { id: "3", metric: "Customer Acquisition Cost", formula: "Total Spend / Customers", target: "$500", current: "$420", performance: 84, status: "Active" },
    ])

    const [form, setForm] = useState({
        metric: "",
        formula: "",
        target: "",
        current: "",
    })
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const errors = useMemo(() => {
        const e: Record<string, string> = {}
        if (touched.metric) {
            if (!form.metric.trim()) e.metric = "Metric name is required"
            else if (form.metric.trim().length < 2) e.metric = "Name too short"
        }
        if (touched.formula && !form.formula.trim()) e.formula = "Formula is required"
        if (touched.target && !form.target.trim()) e.target = "Target value is required"
        return e
    }, [form, touched])

    const resetForm = () => {
        setForm({ metric: "", formula: "", target: "", current: "" })
        setTouched({})
        setEditingId(null)
    }

    const openCreateModal = () => {
        resetForm()
        setShowFormModal(true)
    }

    const openEditModal = (c: ROIConfig) => {
        setEditingId(c.id)
        setForm({
            metric: c.metric,
            formula: c.formula,
            target: c.target,
            current: c.current,
        })
        setTouched({})
        setShowFormModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ metric: true, formula: true, target: true })
        if (!form.metric.trim()) return showWarning("Metric name is required")
        if (!form.formula.trim()) return showWarning("Formula is required")
        if (!form.target.trim()) return showWarning("Target value is required")

        setSubmitting(true)
        try {
            await new Promise((r) => setTimeout(r, 300))
            if (editingId) {
                setConfigs((prev) =>
                    prev.map((c) =>
                        c.id === editingId
                            ? {
                                  ...c,
                                  metric: form.metric.trim(),
                                  formula: form.formula.trim(),
                                  target: form.target.trim(),
                                  current: form.current.trim() || c.current,
                              }
                            : c
                    )
                )
                showSuccess(`${form.metric} updated successfully`)
            } else {
                setConfigs((prev) => [
                    ...prev,
                    {
                        id: String(Date.now()),
                        metric: form.metric.trim(),
                        formula: form.formula.trim(),
                        target: form.target.trim(),
                        current: form.current.trim() || "—",
                        performance: 0,
                        status: "Active",
                    },
                ])
                showSuccess(`${form.metric} metric created`)
            }
            setShowFormModal(false)
            resetForm()
        } finally {
            setSubmitting(false)
        }
    }

    const toggleStatus = (id: string) => {
        setConfigs((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c
            )
        )
        showSuccess("Roi metric status updated")
    }

    const deleteConfig = (id: string) => {
        const c = configs.find((x) => x.id === id)
        if (!c) return
        const ok = window.confirm(`Delete ${c.metric}?`)
        if (!ok) return
        setConfigs((prev) => prev.filter((x) => x.id !== id))
        showSuccess("Roi metric deleted")
    }

    const filtered = configs.filter((c) =>
        c.metric.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const avgPerformance = configs.length
        ? Math.round(configs.reduce((s, c) => s + c.performance, 0) / configs.length)
        : 0
    const bestPerformer = configs.reduce(
        (best, c) => (c.performance > (best?.performance || 0) ? c : best),
        configs[0]
    )

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Header */}
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Roi Configuration</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Configure Roi metrics and targets for campaign performance tracking.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4 shadow-md shadow-primary/20"
                    >
                        <Plus size={14} />
                        Add Metric
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Roi Metrics</p>
                        <p className="text-white text-xl font-semibold mt-1">{configs.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Tracked</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Avg. Performance</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{avgPerformance}%</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Of targets</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Roi</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">$2.4M</p>
                        <p className="text-primary text-[10px] mt-1">This quarter</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Best Performer</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">
                            {bestPerformer?.metric || "—"}
                        </p>
                        <p className="text-emerald-600 text-[10px] mt-1">
                            {bestPerformer ? `${bestPerformer.performance}% of target` : "—"}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <Input
                                placeholder="Search metrics..."
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
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Metric</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Formula</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Target</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Current</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Performance</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <DollarSign size={14} className="text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900">{c.metric}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className="rounded-none bg-primary/10 text-primary border border-primary/20 text-[10px] font-medium px-2 py-0.5 hover:bg-primary/10">
                                                {c.formula}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <Target size={12} className="text-gray-400" />
                                                <span className="text-sm font-semibold text-gray-900">{c.target}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <TrendingUp size={12} className="text-emerald-500" />
                                                <span className="text-sm font-semibold text-emerald-600">{c.current}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3 min-w-[160px]">
                                                <Progress
                                                    value={c.performance > 100 ? 100 : c.performance}
                                                    className="h-1.5 flex-1 bg-gray-100"
                                                />
                                                <span
                                                    className={`text-xs font-semibold ${
                                                        c.performance >= 100
                                                            ? "text-emerald-600"
                                                            : c.performance >= 80
                                                            ? "text-primary"
                                                            : "text-amber-600"
                                                    }`}
                                                >
                                                    {c.performance}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={c.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(c.id)}
                                                />
                                                <Badge
                                                    className={`rounded-none text-[10px] font-medium px-2 py-0.5 ${
                                                        c.status === "Active"
                                                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
                                                            : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                                                    }`}
                                                >
                                                    {c.status}
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
                                                        onClick={() => openEditModal(c)}
                                                        className="text-xs font-medium cursor-pointer gap-2"
                                                    >
                                                        <Edit size={13} />
                                                        Edit metric
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteConfig(c.id)}
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
                                            No Roi metrics found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                        <p className="text-xs text-gray-500">
                            Showing {filtered.length} of {configs.length} metrics
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
                title={editingId ? "Edit Roi Metric" : "Add Roi Metric"}
                description={
                    editingId
                        ? "Update the Roi metric details below."
                        : "Create a new metric to track campaign performance."
                }
                icon={editingId ? <Pencil className="w-5 h-5" /> : <Calculator className="w-5 h-5" />}
                width="md"
                onSubmit={handleSubmit}
                submitLabel={editingId ? "Save Changes" : "Add Metric"}
                loading={submitting}
            >
                <div className="space-y-4">
                    <Field label="Metric Name" required error={errors.metric}>
                        <Input
                            placeholder="e.g. Cost Per Lead"
                            value={form.metric}
                            onChange={(e) => setForm((f) => ({ ...f, metric: e.target.value }))}
                            onBlur={() => setTouched((t) => ({ ...t, metric: true }))}
                            className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                            maxLength={60}
                        />
                    </Field>

                    <Field label="Formula" required error={errors.formula} hint="e.g. Total Spend / Leads">
                        <Input
                            placeholder="e.g. Total Spend / Leads"
                            value={form.formula}
                            onChange={(e) => setForm((f) => ({ ...f, formula: e.target.value }))}
                            onBlur={() => setTouched((t) => ({ ...t, formula: true }))}
                            className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                            maxLength={100}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Target Value" required error={errors.target} hint="e.g. $50 or 5:1">
                            <Input
                                placeholder="$50"
                                value={form.target}
                                onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
                                onBlur={() => setTouched((t) => ({ ...t, target: true }))}
                                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                                maxLength={20}
                            />
                        </Field>

                        <Field label="Current Value" hint="Optional">
                            <Input
                                placeholder="$42"
                                value={form.current}
                                onChange={(e) => setForm((f) => ({ ...f, current: e.target.value }))}
                                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                                maxLength={20}
                            />
                        </Field>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    )
}
