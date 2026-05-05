"use client"

import React, { useState } from "react"
import {
    Signal,
    Search,
    Plus,
    MoreVertical,
    ArrowUp,
    ArrowDown,
    Minus,
    AlertTriangle,
    TrendingUp,
    Clock,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Slider } from "@/shared/components/ui/slider"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/shared/utils/toast"

type Priority = {
    id: string
    name: string
    score: number
    color: string
    icon: React.ReactNode
}

const COLOR_OPTIONS = ["rose", "orange", "blue", "zinc", "emerald", "purple", "amber"] as const

const colorHex: Record<string, string> = {
    rose: "#f43f5e",
    orange: "#f97316",
    blue: "#3b82f6",
    zinc: "#71717a",
    emerald: "#10b981",
    purple: "#a855f7",
    amber: "#f59e0b",
}

export default function PriorityLevelsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [editItem, setEditItem] = useState<Priority | null>(null)

    const [formName, setFormName] = useState("")
    const [formScore, setFormScore] = useState<number>(50)
    const [formColor, setFormColor] = useState<string>("zinc")
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const [priorities, setPriorities] = useState<Priority[]>([
        { id: "1", name: "Urgent", score: 90, color: "rose", icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> },
        { id: "2", name: "High", score: 70, color: "orange", icon: <ArrowUp className="w-3.5 h-3.5 text-orange-500" /> },
        { id: "3", name: "Medium", score: 50, color: "blue", icon: <Minus className="w-3.5 h-3.5 text-primary" /> },
        { id: "4", name: "Low", score: 30, color: "zinc", icon: <ArrowDown className="w-3.5 h-3.5 text-zinc-500" /> },
    ])

    const resetForm = () => {
        setFormName("")
        setFormScore(50)
        setFormColor("zinc")
        setTouched({})
    }

    const errors: Record<string, string> = (() => {
        const e: Record<string, string> = {}
        const name = formName.trim()
        if (touched.name) {
            if (!name) e.name = "Priority name is required"
            else if (name.length < 2) e.name = "Name must be at least 2 characters"
        }
        return e
    })()

    const openCreate = () => {
        resetForm()
        setIsCreateOpen(true)
    }

    const openEdit = (p: Priority) => {
        setEditItem(p)
        setFormName(p.name)
        setFormScore(p.score)
        setFormColor(p.color)
        setTouched({})
        setIsEditOpen(true)
    }

    const validateAll = () => {
        setTouched({ name: true })
        const name = formName.trim()
        if (!name) return "Priority name is required"
        if (name.length < 2) return "Name must be at least 2 characters"
        return null
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        const err = validateAll()
        if (err) return showWarning(err)
        setSubmitting(true)
        try {
            await new Promise((r) => setTimeout(r, 300))
            setPriorities((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    name: formName.trim(),
                    score: formScore,
                    color: formColor,
                    icon: <Minus className="w-3.5 h-3.5 text-zinc-500" />,
                },
            ])
            setIsCreateOpen(false)
            resetForm()
            showSuccess("Priority level created")
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editItem) return
        const err = validateAll()
        if (err) return showWarning(err)
        setSubmitting(true)
        try {
            await new Promise((r) => setTimeout(r, 300))
            setPriorities((prev) =>
                prev.map((p) =>
                    p.id === editItem.id
                        ? { ...p, name: formName.trim(), score: formScore, color: formColor }
                        : p
                )
            )
            setIsEditOpen(false)
            setEditItem(null)
            resetForm()
            showSuccess("Priority level updated")
        } finally {
            setSubmitting(false)
        }
    }

    const deletePriority = (id: string) => {
        const p = priorities.find((x) => x.id === id)
        if (!p) return
        if (!window.confirm(`Delete priority "${p.name}"?`)) return
        setPriorities((prev) => prev.filter((x) => x.id !== id))
        showSuccess("Priority level deleted")
    }

    const filteredPriorities = priorities
        .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => b.score - a.score)

    const avgScore =
        priorities.length > 0
            ? Math.round(priorities.reduce((sum, p) => sum + p.score, 0) / priorities.length)
            : 0
    const urgentCount = priorities.filter((p) => p.score >= 80).length

    const renderFormFields = () => (
        <div className="space-y-4">
            <Field label="Priority Name" required error={errors.name} hint="e.g. Critical">
                <Input
                    placeholder="Priority name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={40}
                />
            </Field>

            <Field label={`Weight Score (${formScore}/100)`} hint="Higher score = higher urgency">
                <Slider
                    value={[formScore]}
                    max={100}
                    step={1}
                    onValueChange={(vals) => setFormScore(vals[0])}
                />
            </Field>

            <Field label="Color Tag" hint="Used in badges and priority markers">
                <div className="flex gap-2 flex-wrap">
                    {COLOR_OPTIONS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setFormColor(c)}
                            className={`w-8 h-8 rounded-none border-2 transition-all ${formColor === c ? "border-primary scale-110" : "border-zinc-200"}`}
                            style={{ backgroundColor: colorHex[c] }}
                            aria-label={c}
                        />
                    ))}
                </div>
            </Field>
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Priority Matrix</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Standardize urgency levels and SLA weights for every task.
                        </p>
                    </div>
                    <Button
                        onClick={openCreate}
                        className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4"
                    >
                        <Plus size={14} />
                        New Priority
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Levels</p>
                        <p className="text-white text-xl font-semibold mt-1">{priorities.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Importance tiers</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Avg Score</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{avgScore}</p>
                        <p className="text-primary text-[10px] mt-1">Across all levels</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Urgent Tasks</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{urgentCount}</p>
                        <p className="text-rose-600 text-[10px] mt-1">Score 80 or above</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Resolution Rate</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">92%</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Last 30 days</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search priorities..."
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Priority Name</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Weight Score</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Color Tag</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredPriorities.map((p) => (
                                    <tr key={p.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-none bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                                    {p.icon}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1.5 bg-zinc-100 rounded-none overflow-hidden">
                                                    <div className="h-full" style={{ width: `${p.score}%`, backgroundColor: colorHex[p.color] }}></div>
                                                </div>
                                                <span className="text-xs text-zinc-600 font-semibold">{p.score}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-none" style={{ backgroundColor: `${colorHex[p.color]}15`, color: colorHex[p.color], border: `1px solid ${colorHex[p.color]}30` }}>
                                                <div className="w-2 h-2 rounded-none" style={{ backgroundColor: colorHex[p.color] }}></div>
                                                <span className="text-[10px] font-medium capitalize">{p.color}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-lg p-2 min-w-[160px]">
                                                    <DropdownMenuLabel className="text-[10px] font-medium text-gray-400 mb-1">Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="text-xs font-medium p-2 rounded-md cursor-pointer" onClick={() => openEdit(p)}>
                                                        Edit Priority
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1" />
                                                    <DropdownMenuItem className="text-xs font-medium p-2 text-rose-600 rounded-md cursor-pointer" onClick={() => deletePriority(p.id)}>
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPriorities.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-xs text-gray-400 font-medium">
                                            No priority levels found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                        <p className="text-[11px] font-medium text-zinc-500">
                            Showing <span className="text-zinc-900 font-semibold">{filteredPriorities.length}</span> of <span className="text-zinc-900 font-semibold">{priorities.length} priorities</span>
                        </p>
                    </div>
                </div>
            </div>

            <SideFormSheet
                open={isCreateOpen}
                onOpenChange={(o) => {
                    setIsCreateOpen(o)
                    if (!o) resetForm()
                }}
                title="Create Priority Level"
                description="Define a new urgency tier with its weight."
                icon={<Signal className="w-5 h-5" />}
                onSubmit={handleCreate}
                submitLabel="Create Priority"
                loading={submitting}
                width="md"
            >
                {renderFormFields()}
            </SideFormSheet>

            <SideFormSheet
                open={isEditOpen}
                onOpenChange={(o) => {
                    setIsEditOpen(o)
                    if (!o) {
                        setEditItem(null)
                        resetForm()
                    }
                }}
                title="Edit Priority Level"
                description="Update the priority details."
                icon={<Signal className="w-5 h-5" />}
                onSubmit={handleEdit}
                submitLabel="Save Changes"
                loading={submitting}
                width="md"
            >
                {renderFormFields()}
            </SideFormSheet>
        </div>
    )
}
