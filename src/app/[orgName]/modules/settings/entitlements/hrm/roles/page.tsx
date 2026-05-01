"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Briefcase,
    Search,
    Plus,
    MoreVertical,
    ShieldCheck,
    ArrowUpRight,
    Crown,
    Loader2,
    Pencil,
    Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { Textarea } from "@/shared/components/ui/textarea"
import { showSuccess, showWarning } from "@/utils/toast"
import {
    getAllPositions,
    getDepartmentList,
    createPosition,
    updatePosition,
    deletePosition,
} from "@/modules/hrm/hooks/hrmHooks"

interface Position {
    _id: string
    title: string
    level: string
    description: string
    isActive: boolean
    department: {
        _id: string
        name: string
    }
}

interface DeptOption {
    _id: string
    name: string
}

const LEVELS = ["Junior", "Mid", "Senior", "Lead", "Executive"]

export default function JobRolesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [newItem, setNewItem] = useState({ title: "", level: "", department: "", description: "" })
    const [editItem, setEditItem] = useState<Position | null>(null)
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const [roles, setRoles] = useState<Position[]>([])
    const [departmentOptions, setDepartmentOptions] = useState<DeptOption[]>([])

    const fetchPositions = async () => {
        try {
            const response = await getAllPositions()
            setRoles(response.data?.positions || [])
        } catch (err) {
            showWarning("Failed to fetch positions")
        } finally {
            setPageLoading(false)
        }
    }

    const fetchDepartments = async () => {
        try {
            const response = await getDepartmentList()
            setDepartmentOptions(response.data?.departments || [])
        } catch (err) {
            // silent
        }
    }

    useEffect(() => {
        fetchPositions()
        fetchDepartments()
    }, [])

    const managementRoles = roles.filter((r) => r.level === "Lead" || r.level === "Executive").length
    const entryLevel = roles.filter((r) => r.level === "Junior").length
    const seniorRoles = roles.filter((r) => r.level === "Senior").length

    const filtered = roles.filter(
        (r) =>
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.level || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.department?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    )

    const createErrors = useMemo(() => {
        const e: Record<string, string> = {}
        if (touched.title && !newItem.title.trim()) e.title = "Job title is required"
        if (touched.department && !newItem.department) e.department = "Department is required"
        return e
    }, [newItem, touched])

    const editErrors = useMemo(() => {
        const e: Record<string, string> = {}
        if (!editItem) return e
        if (touched.editTitle && !editItem.title.trim()) e.title = "Job title is required"
        return e
    }, [editItem, touched])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ title: true, department: true })
        if (!newItem.title.trim() || !newItem.department) {
            showWarning("Please fill the title and select a department")
            return
        }
        setIsLoading(true)
        try {
            await createPosition({
                title: newItem.title,
                department: newItem.department,
                level: newItem.level || undefined,
                description: newItem.description || undefined,
            })
            setIsCreateOpen(false)
            setNewItem({ title: "", level: "", department: "", description: "" })
            setTouched({})
            showSuccess("Role created")
            await fetchPositions()
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editItem) return
        setTouched((t) => ({ ...t, editTitle: true }))
        if (!editItem.title.trim()) {
            showWarning("Please fill the title")
            return
        }
        setIsLoading(true)
        try {
            await updatePosition(editItem._id, {
                title: editItem.title,
                level: editItem.level || undefined,
                description: editItem.description || undefined,
                department: editItem.department?._id || undefined,
            })
            setIsEditOpen(false)
            setEditItem(null)
            setTouched({})
            showSuccess("Role updated")
            await fetchPositions()
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this role?")
        if (!confirmed) return
        try {
            await deletePosition(id)
            showSuccess("Role deleted")
            await fetchPositions()
        } catch (err) {
            // handled in hook
        }
    }

    const openEdit = (r: Position) => {
        setEditItem({ ...r })
        setTouched({})
        setIsEditOpen(true)
    }

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Job Role Templates</h1>
                        <p className="text-sm text-zinc-500 mt-1">Standardize designations and hierarchy levels across the organization.</p>
                    </div>
                    <Button
                        onClick={() => { setNewItem({ title: "", level: "", department: "", description: "" }); setTouched({}); setIsCreateOpen(true) }}
                        className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                    >
                        <Plus size={14} /> New Role
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Roles</p>
                        <p className="text-white text-xl font-semibold mt-1">{roles.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Unique positions</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Management Roles</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{managementRoles}</p>
                        <p className="text-primary text-[10px] mt-1">Leadership positions</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Entry Level</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{entryLevel}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Junior positions</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Senior Roles</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{seniorRoles}</p>
                        <p className="text-amber-600 text-[10px] mt-1">Experienced positions</p>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search roles, departments or levels..."
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
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Job Title</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Department</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Level</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <Briefcase className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                                            <p className="text-sm text-zinc-500">No roles found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((r) => (
                                        <tr key={r._id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-primary/10 text-primary rounded-none border border-primary/10">
                                                        <Briefcase size={16} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{r.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-xs text-gray-600">{r.department?.name || "—"}</td>
                                            <td className="px-6 py-3 text-xs">
                                                {r.level ? (
                                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-none text-[10px] font-medium">{r.level}</span>
                                                ) : (
                                                    <span className="text-zinc-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-none">
                                                            <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-none">
                                                        <DropdownMenuItem onClick={() => openEdit(r)} className="text-xs gap-2">
                                                            <Pencil size={12} /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-600 text-xs gap-2" onClick={() => handleDelete(r._id)}>
                                                            <Trash2 size={12} /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create sheet */}
            <SideFormSheet
                open={isCreateOpen}
                onOpenChange={(o) => { setIsCreateOpen(o); if (!o) { setNewItem({ title: "", level: "", department: "", description: "" }); setTouched({}) } }}
                title="Create Role"
                description="Define a new job role template and map it to a department."
                icon={<Briefcase className="w-5 h-5" />}
                width="md"
                onSubmit={handleCreate}
                submitLabel={isLoading ? "Creating..." : "Create Role"}
                loading={isLoading}
                submitDisabled={!newItem.title.trim() || !newItem.department}
            >
                <div className="space-y-4">
                    <Field label="Job Title" required error={createErrors.title}>
                        <Input
                            placeholder="e.g. Sales Executive"
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field label="Department" required error={createErrors.department}>
                        <Select
                            value={newItem.department}
                            onValueChange={(v) => { setNewItem({ ...newItem, department: v }); setTouched((t) => ({ ...t, department: true })) }}
                        >
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departmentOptions.map((dept) => (
                                    <SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Level" hint="Seniority tier for this role">
                        <Select value={newItem.level} onValueChange={(v) => setNewItem({ ...newItem, level: v })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                {LEVELS.map((l) => (
                                    <SelectItem key={l} value={l}>{l}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field label="Description" hint="Optional, short summary of responsibilities">
                        <Textarea
                            placeholder="e.g. Manages sales pipeline and client relationships"
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            className="rounded-lg border-[#E5E7EB] bg-white focus:border-primary min-h-[90px] text-sm"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Edit sheet */}
            <SideFormSheet
                open={isEditOpen}
                onOpenChange={(o) => { setIsEditOpen(o); if (!o) { setEditItem(null); setTouched({}) } }}
                title="Edit Role"
                description="Update job role details and hierarchy level."
                icon={<Pencil className="w-5 h-5" />}
                width="md"
                onSubmit={handleUpdate}
                submitLabel={isLoading ? "Saving..." : "Save Changes"}
                loading={isLoading}
                submitDisabled={!editItem || !editItem.title.trim()}
            >
                {editItem && (
                    <div className="space-y-4">
                        <Field label="Job Title" required error={editErrors.title}>
                            <Input
                                value={editItem.title}
                                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                                onBlur={() => setTouched((t) => ({ ...t, editTitle: true }))}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                        <Field label="Department">
                            <Select
                                value={editItem.department?._id || ""}
                                onValueChange={(v) => {
                                    const dept = departmentOptions.find(d => d._id === v)
                                    setEditItem({ ...editItem, department: { _id: v, name: dept?.name || "" } })
                                }}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {departmentOptions.map((dept) => (
                                        <SelectItem key={dept._id} value={dept._id}>{dept.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Level">
                            <Select value={editItem.level || ""} onValueChange={(v) => setEditItem({ ...editItem, level: v })}>
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LEVELS.map((l) => (
                                        <SelectItem key={l} value={l}>{l}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Description">
                            <Textarea
                                value={editItem.description || ""}
                                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                                className="rounded-lg border-[#E5E7EB] bg-white focus:border-primary min-h-[90px] text-sm"
                            />
                        </Field>
                    </div>
                )}
            </SideFormSheet>
        </div>
    )
}
