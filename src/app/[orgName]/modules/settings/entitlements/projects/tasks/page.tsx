"use client"

import React, { useState } from "react"
import {
    CheckSquare,
    Search,
    Plus,
    MoreVertical,
    Bug,
    BookOpen,
    Zap,
    Layout,
    TrendingUp,
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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/shared/utils/toast"

type TaskType = {
    id: string
    name: string
    code: string
    icon: React.ReactNode
}

export default function TaskTypesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [editItem, setEditItem] = useState<TaskType | null>(null)

    const [formName, setFormName] = useState("")
    const [formCode, setFormCode] = useState("")
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const [types, setTypes] = useState<TaskType[]>([
        { id: "1", name: "Epic", code: "EPC", icon: <Layout className="w-4 h-4 text-purple-500" /> },
        { id: "2", name: "User Story", code: "STY", icon: <BookOpen className="w-4 h-4 text-primary" /> },
        { id: "3", name: "Task", code: "TSK", icon: <CheckSquare className="w-4 h-4 text-emerald-500" /> },
        { id: "4", name: "Bug", code: "BUG", icon: <Bug className="w-4 h-4 text-rose-500" /> },
        { id: "5", name: "Spike", code: "SPK", icon: <Zap className="w-4 h-4 text-amber-500" /> },
    ])

    const resetForm = () => {
        setFormName("")
        setFormCode("")
        setTouched({})
    }

    const errors: Record<string, string> = (() => {
        const e: Record<string, string> = {}
        const name = formName.trim()
        const code = formCode.trim()
        const duplicate = types.find(
            (t) => t.code.toUpperCase() === code.toUpperCase() && t.id !== editItem?.id
        )
        if (touched.name) {
            if (!name) e.name = "Type name is required"
            else if (name.length < 2) e.name = "Name must be at least 2 characters"
        }
        if (touched.code) {
            if (!code) e.code = "Code is required"
            else if (!/^[A-Z]{3}$/.test(code.toUpperCase())) e.code = "Code must be exactly 3 letters"
            else if (duplicate) e.code = "This code is already in use"
        }
        return e
    })()

    const openCreate = () => {
        resetForm()
        setIsCreateOpen(true)
    }

    const openEdit = (t: TaskType) => {
        setEditItem(t)
        setFormName(t.name)
        setFormCode(t.code)
        setTouched({})
        setIsEditOpen(true)
    }

    const validateAll = () => {
        setTouched({ name: true, code: true })
        const name = formName.trim()
        const code = formCode.trim()
        if (!name) return "Type name is required"
        if (name.length < 2) return "Name must be at least 2 characters"
        if (!code) return "Code is required"
        if (!/^[A-Z]{3}$/.test(code.toUpperCase())) return "Code must be exactly 3 letters"
        const duplicate = types.find(
            (t) => t.code.toUpperCase() === code.toUpperCase() && t.id !== editItem?.id
        )
        if (duplicate) return "This code is already in use"
        return null
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        const err = validateAll()
        if (err) return showWarning(err)
        setSubmitting(true)
        try {
            await new Promise((r) => setTimeout(r, 300))
            setTypes((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    name: formName.trim(),
                    code: formCode.trim().toUpperCase(),
                    icon: <CheckSquare className="w-4 h-4 text-zinc-500" />,
                },
            ])
            setIsCreateOpen(false)
            resetForm()
            showSuccess("Task type created")
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
            setTypes((prev) =>
                prev.map((t) =>
                    t.id === editItem.id
                        ? { ...t, name: formName.trim(), code: formCode.trim().toUpperCase() }
                        : t
                )
            )
            setIsEditOpen(false)
            setEditItem(null)
            resetForm()
            showSuccess("Task type updated")
        } finally {
            setSubmitting(false)
        }
    }

    const deleteType = (id: string) => {
        const t = types.find((x) => x.id === id)
        if (!t) return
        if (!window.confirm(`Delete task type "${t.name}"?`)) return
        setTypes((prev) => prev.filter((x) => x.id !== id))
        showSuccess("Task type deleted")
    }

    const filteredTypes = types.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const bugCount = types.filter((t) => t.code === "BUG").length

    const renderFormFields = () => (
        <div className="space-y-4">
            <Field label="Type Name" required error={errors.name} hint="e.g. Sub-Task">
                <Input
                    placeholder="Task type name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={40}
                />
            </Field>

            <Field label="Code" required error={errors.code} hint="Exactly 3 uppercase letters">
                <Input
                    placeholder="e.g. SUB"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
                    onBlur={() => setTouched((t) => ({ ...t, code: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary font-mono"
                    maxLength={3}
                />
            </Field>
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Issue Types</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Standardize the classification of work items across projects.
                        </p>
                    </div>
                    <Button
                        onClick={openCreate}
                        className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4"
                    >
                        <Plus size={14} />
                        New Type
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Types</p>
                        <p className="text-white text-xl font-semibold mt-1">{types.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Defined schemas</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Active Tasks</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">128</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Across all types</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Bug Reports</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{bugCount}</p>
                        <p className="text-rose-600 text-[10px] mt-1">Bug type defined</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Completion Rate</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">87%</p>
                        <p className="text-primary text-[10px] mt-1">Last 30 days</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search types..."
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
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Type Name</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Code</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredTypes.map((t) => (
                                    <tr key={t.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-none bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                                    {t.icon}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="text-[10px] font-mono text-zinc-700 bg-zinc-100 px-2 py-1 rounded-none">{t.code}</span>
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
                                                    <DropdownMenuItem className="text-xs font-medium p-2 rounded-md cursor-pointer" onClick={() => openEdit(t)}>
                                                        Edit Type
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1" />
                                                    <DropdownMenuItem className="text-xs font-medium p-2 text-rose-600 rounded-md cursor-pointer" onClick={() => deleteType(t.id)}>
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTypes.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-10 text-center text-xs text-gray-400 font-medium">
                                            No task types found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                        <p className="text-[11px] font-medium text-zinc-500">
                            Showing <span className="text-zinc-900 font-semibold">{filteredTypes.length}</span> of <span className="text-zinc-900 font-semibold">{types.length} types</span>
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
                title="Create Task Type"
                description="Define a new category for tasks."
                icon={<CheckSquare className="w-5 h-5" />}
                onSubmit={handleCreate}
                submitLabel="Create Type"
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
                title="Edit Task Type"
                description="Update the task type details."
                icon={<CheckSquare className="w-5 h-5" />}
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
