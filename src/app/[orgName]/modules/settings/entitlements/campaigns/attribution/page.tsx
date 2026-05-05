"use client"

import React, { useState, useMemo } from "react"
import {
    TrendingUp,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Pencil,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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

type AttributionModel = {
    id: string
    name: string
    type: "Single Touch" | "Multi Touch"
    weight: string
    description: string
    status: "Active" | "Paused"
    campaigns: number
}

const modelTypes = ["Single Touch", "Multi Touch"] as const

export default function AttributionModelsPage() {
    const [showFormModal, setShowFormModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [models, setModels] = useState<AttributionModel[]>([
        { id: "1", name: "First Touch", type: "Single Touch", weight: "100%", description: "Credits first interaction", status: "Active", campaigns: 45 },
        { id: "2", name: "Last Touch", type: "Single Touch", weight: "100%", description: "Credits last interaction", status: "Active", campaigns: 89 },
        { id: "3", name: "Linear", type: "Multi Touch", weight: "Equal", description: "Equal credit to all touchpoints", status: "Active", campaigns: 24 },
        { id: "4", name: "Time Decay", type: "Multi Touch", weight: "Weighted", description: "More recent gets more credit", status: "Paused", campaigns: 12 },
    ])

    const [form, setForm] = useState({
        name: "",
        type: "Single Touch" as "Single Touch" | "Multi Touch",
        weight: "100%",
        description: "",
    })
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const errors = useMemo(() => {
        const e: Record<string, string> = {}
        if (touched.name) {
            if (!form.name.trim()) e.name = "Model name is required"
            else if (form.name.trim().length < 2) e.name = "Name too short"
        }
        if (touched.description && form.description.length > 200)
            e.description = "Description too long (max 200)"
        return e
    }, [form, touched])

    const resetForm = () => {
        setForm({ name: "", type: "Single Touch", weight: "100%", description: "" })
        setTouched({})
        setEditingId(null)
    }

    const openCreateModal = () => {
        resetForm()
        setShowFormModal(true)
    }

    const openEditModal = (m: AttributionModel) => {
        setEditingId(m.id)
        setForm({
            name: m.name,
            type: m.type,
            weight: m.weight,
            description: m.description,
        })
        setTouched({})
        setShowFormModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ name: true, description: true })
        if (!form.name.trim()) return showWarning("Model name is required")

        setSubmitting(true)
        try {
            await new Promise((r) => setTimeout(r, 300))
            if (editingId) {
                setModels((prev) =>
                    prev.map((m) =>
                        m.id === editingId
                            ? {
                                  ...m,
                                  name: form.name.trim(),
                                  type: form.type,
                                  weight: form.weight.trim() || "100%",
                                  description: form.description.trim(),
                              }
                            : m
                    )
                )
                showSuccess(`${form.name} updated successfully`)
            } else {
                setModels((prev) => [
                    ...prev,
                    {
                        id: String(Date.now()),
                        name: form.name.trim(),
                        type: form.type,
                        weight: form.weight.trim() || "100%",
                        description: form.description.trim(),
                        status: "Active",
                        campaigns: 0,
                    },
                ])
                showSuccess(`${form.name} attribution model created`)
            }
            setShowFormModal(false)
            resetForm()
        } finally {
            setSubmitting(false)
        }
    }

    const toggleStatus = (id: string) => {
        setModels((prev) =>
            prev.map((m) =>
                m.id === id ? { ...m, status: m.status === "Active" ? "Paused" : "Active" } : m
            )
        )
        showSuccess("Attribution model status updated")
    }

    const deleteModel = (id: string) => {
        const m = models.find((x) => x.id === id)
        if (!m) return
        const ok = window.confirm(`Delete ${m.name}?`)
        if (!ok) return
        setModels((prev) => prev.filter((x) => x.id !== id))
        showSuccess("Attribution model deleted")
    }

    const filtered = models.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeCount = models.filter((m) => m.status === "Active").length
    const totalCampaigns = models.reduce((sum, m) => sum + m.campaigns, 0)

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Header */}
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Attribution Models</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Configure how campaign success is attributed across touchpoints.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4 shadow-md shadow-primary/20"
                    >
                        <Plus size={14} />
                        Create Model
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Attribution Models</p>
                        <p className="text-white text-xl font-semibold mt-1">{models.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Configured</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Active Models</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{activeCount}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">In use</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Campaigns</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalCampaigns}</p>
                        <p className="text-primary text-[10px] mt-1">Using attribution</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Accuracy</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">92%</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Model performance</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <Input
                                placeholder="Search models..."
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
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Model Name</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Type</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Weight</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Description</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Campaigns</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((m) => (
                                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp size={14} className="text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900">{m.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className="rounded-none bg-primary/10 text-primary border border-primary/20 text-[10px] font-medium px-2 py-0.5 hover:bg-primary/10">
                                                {m.type}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{m.weight}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{m.description}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{m.campaigns}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={m.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(m.id)}
                                                />
                                                <Badge
                                                    className={`rounded-none text-[10px] font-medium px-2 py-0.5 ${
                                                        m.status === "Active"
                                                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
                                                            : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                                                    }`}
                                                >
                                                    {m.status}
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
                                                        onClick={() => openEditModal(m)}
                                                        className="text-xs font-medium cursor-pointer gap-2"
                                                    >
                                                        <Edit size={13} />
                                                        Edit model
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteModel(m.id)}
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
                                            No attribution models found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                        <p className="text-xs text-gray-500">
                            Showing {filtered.length} of {models.length} models
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
                title={editingId ? "Edit Attribution Model" : "Create Attribution Model"}
                description={
                    editingId
                        ? "Update the attribution model details below."
                        : "Define how campaign touchpoints are credited."
                }
                icon={editingId ? <Pencil className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                width="md"
                onSubmit={handleSubmit}
                submitLabel={editingId ? "Save Changes" : "Create Model"}
                loading={submitting}
            >
                <div className="space-y-4">
                    <Field label="Model Name" required error={errors.name}>
                        <Input
                            placeholder="e.g. First Touch"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                            className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                            maxLength={60}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Model Type">
                            <Select
                                value={form.type}
                                onValueChange={(v) => setForm((f) => ({ ...f, type: v as "Single Touch" | "Multi Touch" }))}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modelTypes.map((t) => (
                                        <SelectItem key={t} value={t}>
                                            {t}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Weight" hint="e.g. 100%, Equal, Weighted">
                            <Input
                                placeholder="100%"
                                value={form.weight}
                                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                                maxLength={20}
                            />
                        </Field>
                    </div>

                    <Field
                        label="Description"
                        error={errors.description}
                        hint={`${form.description.length}/200 characters (optional)`}
                    >
                        <Textarea
                            placeholder="Describe how this model works..."
                            value={form.description}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, description: e.target.value.slice(0, 200) }))
                            }
                            className="rounded-lg bg-white border-[#E5E7EB] focus:border-primary text-[13px] min-h-[90px]"
                        />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    )
}
