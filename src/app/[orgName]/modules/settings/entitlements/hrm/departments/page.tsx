"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Building2,
    Search,
    Plus,
    MoreVertical,
    UserCheck,
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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { showSuccess, showWarning } from "@/utils/toast"
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "@/modules/hrm/hooks/hrmHooks"

interface Department {
    _id: string
    name: string
    description: string
    head: string
    headName: string
    headEmail: string
    createdAt: string
}

export default function DepartmentsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [newItem, setNewItem] = useState({ name: "", description: "" })
    const [editItem, setEditItem] = useState<Department | null>(null)
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const [departments, setDepartments] = useState<Department[]>([])

    const fetchDepartments = async () => {
        try {
            const response = await getAllDepartments()
            setDepartments(response.data?.departments || [])
        } catch (err) {
            showWarning("Failed to fetch departments")
        } finally {
            setPageLoading(false)
        }
    }

    useEffect(() => {
        fetchDepartments()
    }, [])

    const deptsWithHead = departments.filter((d) => d.headName && d.headName !== "").length
    const recentlyAdded = useMemo(() => {
        const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
        return departments.filter((d) => d.createdAt && new Date(d.createdAt).getTime() > cutoff).length
    }, [departments])

    const filtered = departments.filter(
        (d) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.headName || "").toLowerCase().includes(searchQuery.toLowerCase())
    )

    const createError = useMemo(() => {
        if (!touched.newName) return ""
        const name = newItem.name.trim()
        if (!name) return "Department name is required"
        if (!/^[a-zA-Z\s]+$/.test(name)) return "Only letters and spaces allowed"
        if (name.length < 2) return "Name must be at least 2 characters"
        return ""
    }, [newItem.name, touched.newName])

    const editError = useMemo(() => {
        if (!touched.editName || !editItem) return ""
        const name = editItem.name.trim()
        if (!name) return "Department name is required"
        if (!/^[a-zA-Z\s]+$/.test(name)) return "Only letters and spaces allowed"
        if (name.length < 2) return "Name must be at least 2 characters"
        return ""
    }, [editItem, touched.editName])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched((t) => ({ ...t, newName: true }))
        const name = newItem.name.trim()
        if (!name) return showWarning("Department name is required")
        if (!/^[a-zA-Z\s]+$/.test(name)) return showWarning("Department name should not contain numbers or special characters")

        setIsLoading(true)
        try {
            await createDepartment({ name, description: newItem.description })
            setIsCreateOpen(false)
            setNewItem({ name: "", description: "" })
            setTouched({})
            showSuccess("Department created")
            await fetchDepartments()
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editItem) return
        setTouched((t) => ({ ...t, editName: true }))
        const name = editItem.name.trim()
        if (!name) return showWarning("Department name is required")
        if (!/^[a-zA-Z\s]+$/.test(name)) return showWarning("Department name should not contain numbers or special characters")

        setIsLoading(true)
        try {
            await updateDepartment(editItem._id, { name, description: editItem.description })
            setIsEditOpen(false)
            setEditItem(null)
            setTouched({})
            showSuccess("Department updated")
            await fetchDepartments()
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this department?")
        if (!confirmed) return
        try {
            await deleteDepartment(id)
            showSuccess("Department deleted")
            await fetchDepartments()
        } catch (err) {
            // handled in hook
        }
    }

    const openEdit = (d: Department) => {
        setEditItem({ ...d })
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
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Department Templates</h1>
                        <p className="text-sm text-zinc-500 mt-1">Structure your company hierarchy and define operational units.</p>
                    </div>
                    <Button
                        onClick={() => { setNewItem({ name: "", description: "" }); setTouched({}); setIsCreateOpen(true) }}
                        className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                    >
                        <Plus size={14} /> New Department
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Units</p>
                        <p className="text-white text-xl font-semibold mt-1">{departments.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Active departments</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">With Head Assigned</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{deptsWithHead}</p>
                        <p className="text-primary text-[10px] mt-1">Leadership coverage</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Recently Added</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{recentlyAdded}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Last 30 days</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Without Head</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{departments.length - deptsWithHead}</p>
                        <p className="text-amber-600 text-[10px] mt-1">Needs assignment</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search departments, descriptions or heads..."
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
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Department</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Description</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Head of Dept</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <Building2 className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                                            <p className="text-sm text-zinc-500">No departments found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((d) => (
                                        <tr key={d._id} className="hover:bg-primary/5 transition-colors group">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-primary/10 text-primary rounded-none border border-primary/10">
                                                        <Building2 size={16} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{d.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-xs text-gray-600">{d.description || "—"}</td>
                                            <td className="px-6 py-3 text-xs text-gray-600">
                                                {d.headName ? (
                                                    <span className="font-medium text-gray-900">{d.headName}</span>
                                                ) : (
                                                    <span className="text-zinc-400">Unassigned</span>
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
                                                        <DropdownMenuItem onClick={() => openEdit(d)} className="text-xs gap-2">
                                                            <Pencil size={12} /> Edit details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-600 text-xs gap-2" onClick={() => handleDelete(d._id)}>
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
                onOpenChange={(o) => { setIsCreateOpen(o); if (!o) { setNewItem({ name: "", description: "" }); setTouched({}) } }}
                title="Create Department"
                description="Add a new department to your organization hierarchy."
                icon={<Building2 className="w-5 h-5" />}
                width="md"
                onSubmit={handleCreate}
                submitLabel={isLoading ? "Creating..." : "Create Department"}
                loading={isLoading}
                submitDisabled={!!createError || !newItem.name.trim()}
            >
                <div className="space-y-4">
                    <Field label="Department Name" required error={createError} hint="Only letters and spaces">
                        <Input
                            placeholder="e.g. Operations"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            onBlur={() => setTouched((t) => ({ ...t, newName: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>
                    <Field label="Description" hint="Optional, short summary of responsibilities">
                        <Textarea
                            placeholder="e.g. Handles daily operations and logistics"
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
                title="Edit Department"
                description="Update department details and responsibilities."
                icon={<Pencil className="w-5 h-5" />}
                width="md"
                onSubmit={handleUpdate}
                submitLabel={isLoading ? "Saving..." : "Save Changes"}
                loading={isLoading}
                submitDisabled={!editItem || !!editError || !editItem.name.trim()}
            >
                {editItem && (
                    <div className="space-y-4">
                        <Field label="Department Name" required error={editError}>
                            <Input
                                value={editItem.name}
                                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                onBlur={() => setTouched((t) => ({ ...t, editName: true }))}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
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
