"use client"

import React, { useState } from "react"
import {
    FolderKanban,
    Search,
    Plus,
    MoreVertical,
    LayoutDashboard,
    Layers,
    CheckCircle2,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Badge } from "@/shared/components/ui/badge"
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

type ProjectType = {
    id: string
    name: string
    key: string
    workflow: string
    projects: number
    status: "Active" | "Inactive"
}

const WORKFLOW_OPTIONS = ["Agile Scrum", "Kanban", "Simple Todo", "Stage Gate", "Standard"] as const

export default function ProjectTypesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [editItem, setEditItem] = useState<ProjectType | null>(null)

    const [formName, setFormName] = useState("")
    const [formKey, setFormKey] = useState("")
    const [formWorkflow, setFormWorkflow] = useState<string>(WORKFLOW_OPTIONS[0])
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const [types, setTypes] = useState<ProjectType[]>([
        { id: "1", name: "Software Development", key: "SW", workflow: "Agile Scrum", projects: 12, status: "Active" },
        { id: "2", name: "Marketing Campaign", key: "MKT", workflow: "Kanban", projects: 5, status: "Active" },
        { id: "3", name: "General Task", key: "GEN", workflow: "Simple Todo", projects: 8, status: "Active" },
        { id: "4", name: "Client Onboarding", key: "ONB", workflow: "Stage Gate", projects: 3, status: "Inactive" },
    ])

    const resetForm = () => {
        setFormName("")
        setFormKey("")
        setFormWorkflow(WORKFLOW_OPTIONS[0])
        setTouched({})
    }

    const errors: Record<string, string> = (() => {
        const e: Record<string, string> = {}
        const name = formName.trim()
        const key = formKey.trim()
        if (touched.name) {
            if (!name) e.name = "Type name is required"
            else if (name.length < 2) e.name = "Name must be at least 2 characters"
        }
        if (touched.key) {
            if (!key) e.key = "Key prefix is required"
            else if (!/^[A-Z]{2,4}$/.test(key.toUpperCase())) e.key = "Use 2-4 letters only"
        }
        return e
    })()

    const openCreate = () => {
        resetForm()
        setIsCreateOpen(true)
    }

    const openEdit = (t: ProjectType) => {
        setEditItem(t)
        setFormName(t.name)
        setFormKey(t.key)
        setFormWorkflow(t.workflow)
        setTouched({})
        setIsEditOpen(true)
    }

    const validateAll = () => {
        setTouched({ name: true, key: true })
        const name = formName.trim()
        const key = formKey.trim()
        if (!name) return "Type name is required"
        if (name.length < 2) return "Name must be at least 2 characters"
        if (!key) return "Key prefix is required"
        if (!/^[A-Z]{2,4}$/.test(key.toUpperCase())) return "Key must be 2-4 letters only"
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
                    key: formKey.trim().toUpperCase(),
                    workflow: formWorkflow,
                    projects: 0,
                    status: "Active",
                },
            ])
            setIsCreateOpen(false)
            resetForm()
            showSuccess("Project type created")
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
                        ? { ...t, name: formName.trim(), key: formKey.trim().toUpperCase(), workflow: formWorkflow }
                        : t
                )
            )
            setIsEditOpen(false)
            setEditItem(null)
            resetForm()
            showSuccess("Project type updated")
        } finally {
            setSubmitting(false)
        }
    }

    const deleteType = (id: string) => {
        const t = types.find((x) => x.id === id)
        if (!t) return
        if (!window.confirm(`Delete "${t.name}"?`)) return
        setTypes((prev) => prev.filter((x) => x.id !== id))
        showSuccess("Project type deleted")
    }

    const toggleStatus = (id: string) => {
        setTypes((prev) =>
            prev.map((t) =>
                t.id === id
                    ? { ...t, status: t.status === "Active" ? "Inactive" : "Active" }
                    : t
            )
        )
        showSuccess("Status updated")
    }

    const filteredTypes = types.filter(
        (t) =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.key.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeCount = types.filter((t) => t.status === "Active").length
    const totalProjects = types.reduce((sum, t) => sum + t.projects, 0)
    const uniqueWorkflows = new Set(types.map((t) => t.workflow)).size

    const renderFormFields = () => (
        <div className="space-y-4">
            <Field label="Type Name" required error={errors.name} hint="e.g. Website Redesign">
                <Input
                    placeholder="Project type name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={60}
                />
            </Field>

            <Field label="Key Prefix" required error={errors.key} hint="2-4 uppercase letters">
                <Input
                    placeholder="e.g. WEB"
                    value={formKey}
                    onChange={(e) => setFormKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ""))}
                    onBlur={() => setTouched((t) => ({ ...t, key: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary font-mono"
                    maxLength={4}
                />
            </Field>

            <Field label="Default Workflow" required hint="Governs lifecycle transitions">
                <Select value={formWorkflow} onValueChange={setFormWorkflow}>
                    <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                        <SelectValue placeholder="Select workflow" />
                    </SelectTrigger>
                    <SelectContent>
                        {WORKFLOW_OPTIONS.map((w) => (
                            <SelectItem key={w} value={w}>
                                {w}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Project Schemas</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Define project categories and their default behaviors across the organization.
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
                        <p className="text-white text-xs opacity-80">Active Types</p>
                        <p className="text-white text-xl font-semibold mt-1">{activeCount}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Project definitions</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Projects</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalProjects}</p>
                        <p className="text-primary text-[10px] mt-1">Using these types</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Workflows</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{uniqueWorkflows}</p>
                        <p className="text-zinc-400 text-[10px] mt-1">Unique process flows</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Completion Rate</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">92%</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Avg across types</p>
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
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Key Prefix</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Default Workflow</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Active Projects</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Status</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredTypes.map((t) => (
                                    <tr key={t.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center text-primary">
                                                    <FolderKanban className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900">{t.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="text-[10px] font-mono text-zinc-700 bg-zinc-100 px-2 py-1 rounded-none">{t.key}</span>
                                        </td>
                                        <td className="px-6 py-3 text-xs text-zinc-600 font-medium">{t.workflow}</td>
                                        <td className="px-6 py-3 text-center">
                                            <Badge className="rounded-none bg-zinc-900 text-white border-none px-2 py-0.5 text-[10px] font-medium">
                                                {t.projects}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {t.status === "Active" ? (
                                                <div className="inline-flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none">
                                                    <CheckCircle2 size={12} />
                                                    <span className="text-[10px] font-medium">Active</span>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-2 py-1 bg-zinc-50 text-zinc-500 border border-zinc-200 rounded-none">
                                                    <span className="text-[10px] font-medium">Inactive</span>
                                                </div>
                                            )}
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
                                                    <DropdownMenuItem className="text-xs font-medium p-2 rounded-md cursor-pointer" onClick={() => toggleStatus(t.id)}>
                                                        {t.status === "Active" ? "Deactivate" : "Activate"}
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
                                        <td colSpan={6} className="px-6 py-10 text-center text-xs text-gray-400 font-medium">
                                            No project types found.
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

            {/* Create side sheet */}
            <SideFormSheet
                open={isCreateOpen}
                onOpenChange={(o) => {
                    setIsCreateOpen(o)
                    if (!o) resetForm()
                }}
                title="Create Project Type"
                description="Define a new project template for your organization."
                icon={<FolderKanban className="w-5 h-5" />}
                onSubmit={handleCreate}
                submitLabel="Create Type"
                loading={submitting}
                width="md"
            >
                {renderFormFields()}
            </SideFormSheet>

            {/* Edit side sheet */}
            <SideFormSheet
                open={isEditOpen}
                onOpenChange={(o) => {
                    setIsEditOpen(o)
                    if (!o) {
                        setEditItem(null)
                        resetForm()
                    }
                }}
                title="Edit Project Type"
                description="Update this project type configuration."
                icon={<FolderKanban className="w-5 h-5" />}
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
