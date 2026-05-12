"use client"

import React, { useState } from "react"
import {
    Workflow,
    Search,
    Plus,
    MoreVertical,
    ArrowRightCircle,
    CheckCircle2,
    Circle,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/shared/utils/toast"

type WorkflowStatus = {
    id: string
    name: string
    category: "todo" | "progress" | "done"
    color: string
}

const COLOR_OPTIONS = ["zinc", "blue", "indigo", "purple", "emerald", "rose", "amber", "orange"] as const

export default function WorkflowStatusPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [editItem, setEditItem] = useState<WorkflowStatus | null>(null)

    const [formName, setFormName] = useState("")
    const [formCategory, setFormCategory] = useState<"todo" | "progress" | "done">("todo")
    const [formColor, setFormColor] = useState<string>("zinc")
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const [statuses, setStatuses] = useState<WorkflowStatus[]>([
        { id: "1", name: "Backlog", category: "todo", color: "zinc" },
        { id: "2", name: "To Do", category: "todo", color: "blue" },
        { id: "3", name: "In Progress", category: "progress", color: "indigo" },
        { id: "4", name: "In Review", category: "progress", color: "purple" },
        { id: "5", name: "Done", category: "done", color: "emerald" },
        { id: "6", name: "Cancelled", category: "done", color: "rose" },
    ])

    const resetForm = () => {
        setFormName("")
        setFormCategory("todo")
        setFormColor("zinc")
        setTouched({})
    }

    const errors: Record<string, string> = (() => {
        const e: Record<string, string> = {}
        const name = formName.trim()
        if (touched.name) {
            if (!name) e.name = "Status name is required"
            else if (name.length < 2) e.name = "Name must be at least 2 characters"
        }
        return e
    })()

    const openCreate = () => {
        resetForm()
        setIsCreateOpen(true)
    }

    const openEdit = (s: WorkflowStatus) => {
        setEditItem(s)
        setFormName(s.name)
        setFormCategory(s.category)
        setFormColor(s.color)
        setTouched({})
        setIsEditOpen(true)
    }

    const validateAll = () => {
        setTouched({ name: true })
        const name = formName.trim()
        if (!name) return "Status name is required"
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
            setStatuses((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    name: formName.trim(),
                    category: formCategory,
                    color: formColor,
                },
            ])
            setIsCreateOpen(false)
            resetForm()
            showSuccess("Workflow status created")
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
            setStatuses((prev) =>
                prev.map((s) =>
                    s.id === editItem.id
                        ? { ...s, name: formName.trim(), category: formCategory, color: formColor }
                        : s
                )
            )
            setIsEditOpen(false)
            setEditItem(null)
            resetForm()
            showSuccess("Workflow status updated")
        } finally {
            setSubmitting(false)
        }
    }

    const deleteStatus = (id: string) => {
        const s = statuses.find((x) => x.id === id)
        if (!s) return
        if (!window.confirm(`Delete status "${s.name}"?`)) return
        setStatuses((prev) => prev.filter((x) => x.id !== id))
        showSuccess("Workflow status deleted")
    }

    const filteredStatuses = statuses.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const todoCount = statuses.filter((s) => s.category === "todo").length
    const progressCount = statuses.filter((s) => s.category === "progress").length
    const doneCount = statuses.filter((s) => s.category === "done").length

    const colorStyle = (c: string): React.CSSProperties => {
        const map: Record<string, string> = {
            zinc: "#71717a",
            blue: "#3b82f6",
            indigo: "#6366f1",
            purple: "#a855f7",
            emerald: "#10b981",
            rose: "#f43f5e",
            amber: "#f59e0b",
            orange: "#f97316",
        }
        return { backgroundColor: map[c] || "#71717a" }
    }

    const renderFormFields = () => (
        <div className="space-y-4">
            <Field label="Status Name" required error={errors.name} hint="e.g. QA Review">
                <Input
                    placeholder="Status name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={40}
                />
            </Field>

            <Field label="Category Phase" required hint="Groups the status in reports">
                <Select value={formCategory} onValueChange={(v) => setFormCategory(v as typeof formCategory)}>
                    <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                        <SelectValue placeholder="Select phase" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todo">To Do (Open)</SelectItem>
                        <SelectItem value="progress">In Progress (Active)</SelectItem>
                        <SelectItem value="done">Done (Completed)</SelectItem>
                    </SelectContent>
                </Select>
            </Field>

            <Field label="Color Tag" hint="Used in badges and board columns">
                <div className="flex gap-2 flex-wrap">
                    {COLOR_OPTIONS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setFormColor(c)}
                            className={`w-8 h-8 rounded-none border-2 transition-all ${formColor === c ? "border-primary scale-110" : "border-zinc-200"}`}
                            style={colorStyle(c)}
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
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Workflow Configuration</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Define flow states and transitions for tasks across all projects.
                        </p>
                    </div>
                    <Button
                        onClick={openCreate}
                        className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4"
                    >
                        <Plus size={14} />
                        New Status
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Statuses</p>
                        <p className="text-white text-xl font-semibold mt-1">{statuses.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Across all flows</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">To Do Phases</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{todoCount}</p>
                        <p className="text-zinc-400 text-[10px] mt-1">Open statuses</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">In Progress Phases</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{progressCount}</p>
                        <p className="text-primary text-[10px] mt-1">Active statuses</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Done Phases</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{doneCount}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Completed statuses</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search statuses..."
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
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Status Name</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Category Phase</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Color Code</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredStatuses.map((s) => (
                                    <tr key={s.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-none shadow-sm" style={colorStyle(s.color)}></div>
                                                <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                {s.category === "todo" && <Circle className="w-3.5 h-3.5 text-zinc-400" />}
                                                {s.category === "progress" && <ArrowRightCircle className="w-3.5 h-3.5 text-primary" />}
                                                {s.category === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                                <span className="text-xs text-zinc-600 capitalize font-medium">{s.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <span className="text-[10px] font-mono text-zinc-700 bg-zinc-100 px-2 py-1 rounded-none capitalize">{s.color}</span>
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
                                                    <DropdownMenuItem className="text-xs font-medium p-2 rounded-md cursor-pointer" onClick={() => openEdit(s)}>
                                                        Edit Status
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1" />
                                                    <DropdownMenuItem className="text-xs font-medium p-2 text-rose-600 rounded-md cursor-pointer" onClick={() => deleteStatus(s.id)}>
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStatuses.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-xs text-gray-400 font-medium">
                                            No statuses found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                        <p className="text-[11px] font-medium text-zinc-500">
                            Showing <span className="text-zinc-900 font-semibold">{filteredStatuses.length}</span> of <span className="text-zinc-900 font-semibold">{statuses.length} statuses</span>
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
                title="Create Status"
                description="Add a new step to your project workflows."
                icon={<Workflow className="w-5 h-5" />}
                onSubmit={handleCreate}
                submitLabel="Create Status"
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
                title="Edit Status"
                description="Update this workflow status configuration."
                icon={<Workflow className="w-5 h-5" />}
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
