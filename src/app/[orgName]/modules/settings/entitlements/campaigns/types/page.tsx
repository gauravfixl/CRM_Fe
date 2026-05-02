"use client"

import React, { useState, useMemo } from "react"
import {
    Megaphone,
    Plus,
    Search,
    Filter,
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

type CampaignType = {
    id: string
    name: string
    category: string
    channels: string[]
    defaultBudget: string
    status: "Active" | "Paused"
    usage: number
    description?: string
}

const categories = ["Email Marketing", "Paid Advertising", "Events", "Organic"]

export default function CampaignTypesPage() {
    const [showFormModal, setShowFormModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [campaignTypes, setCampaignTypes] = useState<CampaignType[]>([
        { id: "1", name: "Email Campaign", category: "Email Marketing", channels: ["Email"], defaultBudget: "$5,000", status: "Active", usage: 156 },
        { id: "2", name: "Social Media Ads", category: "Paid Advertising", channels: ["Facebook", "LinkedIn"], defaultBudget: "$10,000", status: "Active", usage: 89 },
        { id: "3", name: "Webinar Series", category: "Events", channels: ["Email", "Social"], defaultBudget: "$3,000", status: "Active", usage: 24 },
        { id: "4", name: "Content Marketing", category: "Organic", channels: ["Blog", "SEO"], defaultBudget: "$2,000", status: "Paused", usage: 45 },
    ])

    const [form, setForm] = useState({
        name: "",
        category: "Email Marketing",
        budget: "",
        description: "",
    })
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const errors = useMemo(() => {
        const e: Record<string, string> = {}
        if (touched.name) {
            if (!form.name.trim()) e.name = "Type name is required"
            else if (form.name.trim().length < 2) e.name = "Name too short"
        }
        if (touched.budget) {
            const n = parseFloat(form.budget)
            if (!form.budget.trim()) e.budget = "Default budget is required"
            else if (isNaN(n) || n < 0) e.budget = "Enter a valid amount"
        }
        return e
    }, [form, touched])

    const resetForm = () => {
        setForm({ name: "", category: "Email Marketing", budget: "", description: "" })
        setTouched({})
        setEditingId(null)
    }

    const openCreateModal = () => {
        resetForm()
        setShowFormModal(true)
    }

    const openEditModal = (t: CampaignType) => {
        setEditingId(t.id)
        setForm({
            name: t.name,
            category: t.category,
            budget: t.defaultBudget.replace(/[^0-9.]/g, ""),
            description: t.description || "",
        })
        setTouched({})
        setShowFormModal(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ name: true, budget: true })
        if (!form.name.trim()) return showWarning("Type name is required")
        const budgetNum = parseFloat(form.budget)
        if (isNaN(budgetNum) || budgetNum < 0) return showWarning("Enter a valid default budget")

        setSubmitting(true)
        try {
            await new Promise((r) => setTimeout(r, 300))
            if (editingId) {
                setCampaignTypes((prev) =>
                    prev.map((c) =>
                        c.id === editingId
                            ? {
                                  ...c,
                                  name: form.name.trim(),
                                  category: form.category,
                                  defaultBudget: `$${budgetNum.toLocaleString()}`,
                                  description: form.description.trim(),
                              }
                            : c
                    )
                )
                showSuccess(`${form.name} updated successfully`)
            } else {
                setCampaignTypes((prev) => [
                    ...prev,
                    {
                        id: String(Date.now()),
                        name: form.name.trim(),
                        category: form.category,
                        channels: ["Email"],
                        defaultBudget: `$${budgetNum.toLocaleString()}`,
                        status: "Active",
                        usage: 0,
                        description: form.description.trim(),
                    },
                ])
                showSuccess(`${form.name} campaign type created`)
            }
            setShowFormModal(false)
            resetForm()
        } finally {
            setSubmitting(false)
        }
    }

    const toggleStatus = (id: string) => {
        setCampaignTypes((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c
            )
        )
        showSuccess("Campaign type status updated")
    }

    const deleteType = (id: string) => {
        const t = campaignTypes.find((c) => c.id === id)
        if (!t) return
        const ok = window.confirm(`Delete ${t.name}?`)
        if (!ok) return
        setCampaignTypes((prev) => prev.filter((c) => c.id !== id))
        showSuccess("Campaign type deleted")
    }

    const filtered = campaignTypes.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const totalBudget = campaignTypes.reduce((sum, c) => {
        const n = parseFloat(c.defaultBudget.replace(/[^0-9.]/g, "")) || 0
        return sum + n
    }, 0)

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Header */}
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Campaign Types</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Define and manage different types of marketing campaigns across your organization.
                        </p>
                    </div>
                    <Button
                        onClick={openCreateModal}
                        className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4 shadow-md shadow-primary/20"
                    >
                        <Plus size={14} />
                        Create Type
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Campaign Types</p>
                        <p className="text-white text-xl font-semibold mt-1">{campaignTypes.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Configured across channels</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Active Types</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">
                            {campaignTypes.filter((c) => c.status === "Active").length}
                        </p>
                        <p className="text-emerald-600 text-[10px] mt-1">Currently available</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Campaigns</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">
                            {campaignTypes.reduce((sum, c) => sum + c.usage, 0)}
                        </p>
                        <p className="text-primary text-[10px] mt-1">Created this year</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Budget</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">
                            ${totalBudget.toLocaleString()}
                        </p>
                        <p className="text-zinc-400 text-[10px] mt-1">Default allocation</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <Input
                                placeholder="Search campaign types..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 rounded-none border-gray-200 h-9 text-xs focus:ring-primary bg-white"
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="rounded-none border-gray-200 text-xs h-9 gap-2 w-full sm:w-auto font-medium"
                        >
                            <Filter size={14} />
                            Filter
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Type Name</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Category</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Channels</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Default Budget</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Usage</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                                    <th className="px-4 py-3 text-xs font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((t) => (
                                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Megaphone size={14} className="text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900">{t.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge className="rounded-none bg-primary/10 text-primary border border-primary/20 text-[10px] font-medium px-2 py-0.5 hover:bg-primary/10">
                                                {t.category}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1 flex-wrap">
                                                {t.channels.map((ch, i) => (
                                                    <Badge
                                                        key={i}
                                                        className="rounded-none bg-zinc-100 text-zinc-600 border border-zinc-200 text-[10px] font-medium px-1.5 py-0 hover:bg-zinc-100"
                                                    >
                                                        {ch}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{t.defaultBudget}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{t.usage}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={t.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(t.id)}
                                                />
                                                <Badge
                                                    className={`rounded-none text-[10px] font-medium px-2 py-0.5 ${
                                                        t.status === "Active"
                                                            ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
                                                            : "bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                                                    }`}
                                                >
                                                    {t.status}
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
                                                        onClick={() => openEditModal(t)}
                                                        className="text-xs font-medium cursor-pointer gap-2"
                                                    >
                                                        <Edit size={13} />
                                                        Edit type
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteType(t.id)}
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
                                            No campaign types found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                        <p className="text-xs text-gray-500">
                            Showing {filtered.length} of {campaignTypes.length} campaign types
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
                title={editingId ? "Edit Campaign Type" : "Create Campaign Type"}
                description={
                    editingId
                        ? "Update the campaign type details below."
                        : "Define a new campaign type for your marketing efforts."
                }
                icon={editingId ? <Pencil className="w-5 h-5" /> : <Megaphone className="w-5 h-5" />}
                width="md"
                onSubmit={handleSubmit}
                submitLabel={editingId ? "Save Changes" : "Create Type"}
                loading={submitting}
            >
                <div className="space-y-4">
                    <Field label="Type Name" required error={errors.name}>
                        <Input
                            placeholder="e.g. Email Campaign"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                            className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                            maxLength={60}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category">
                            <Select
                                value={form.category}
                                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field label="Default Budget (USD)" required error={errors.budget}>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-[14px]">$</span>
                                <Input
                                    type="number"
                                    placeholder="5000"
                                    value={form.budget}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            budget: e.target.value.replace(/[^0-9.]/g, ""),
                                        }))
                                    }
                                    onBlur={() => setTouched((t) => ({ ...t, budget: true }))}
                                    className="h-11 pl-7 rounded-lg bg-white border-[#E5E7EB] focus:border-primary font-mono"
                                    min={0}
                                />
                            </div>
                        </Field>
                    </div>

                    <Field
                        label="Description"
                        hint={`${form.description.length}/200 characters (optional)`}
                    >
                        <Textarea
                            placeholder="Describe this campaign type..."
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
