"use client"

import { useState } from "react"
import {
    Network,
    Plus,
    Search,
    Users,
    Shield,
    Building,
    Pencil,
    Trash2,
    ShieldCheck,
    MoreVertical,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
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

type AdminUnit = {
    id: string
    name: string
    focus: string
    members: number
    admins: number
    status: "Active" | "Review Required"
}

export default function AdministrativeUnitsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [units, setUnits] = useState<AdminUnit[]>([
        { id: "au1", name: "Engineering Unit", focus: "Technical Infrastructure", members: 42, admins: 3, status: "Active" },
        { id: "au2", name: "FinOps Global", focus: "Financial Operations", members: 12, admins: 2, status: "Active" },
        { id: "au3", name: "Human Capital", focus: "HR & Recruitment", members: 8, admins: 1, status: "Review Required" },
    ])

    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState<AdminUnit | null>(null)

    const [formName, setFormName] = useState("")
    const [formFocus, setFormFocus] = useState("")
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const totalMembers = units.reduce((s, u) => s + u.members, 0)
    const totalAdmins = units.reduce((s, u) => s + u.admins, 0)

    const filteredUnits = units.filter(
        (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.focus.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const resetForm = () => {
        setFormName("")
        setFormFocus("")
        setTouched({})
    }

    const errors: Record<string, string> = (() => {
        const e: Record<string, string> = {}
        const name = formName.trim()
        const nameRegex = /^[a-zA-Z\s]+$/
        if (touched.name) {
            if (!name) e.name = "Unit name is required"
            else if (!nameRegex.test(name)) e.name = "Only letters and spaces are allowed"
            else if (name.length < 2) e.name = "Name must be at least 2 characters"
        }
        return e
    })()

    const validateAll = () => {
        setTouched({ name: true, focus: true })
        const name = formName.trim()
        const nameRegex = /^[a-zA-Z\s]+$/
        if (!name) return "Unit name is required"
        if (!nameRegex.test(name)) return "Unit name should contain only letters and spaces"
        if (name.length < 2) return "Name must be at least 2 characters"
        return null
    }

    const openCreate = () => {
        resetForm()
        setCreateOpen(true)
    }

    const openEdit = (unit: AdminUnit) => {
        setSelectedUnit(unit)
        setFormName(unit.name)
        setFormFocus(unit.focus)
        setTouched({})
        setEditOpen(true)
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        const err = validateAll()
        if (err) return showWarning(err)

        setSubmitting(true)
        try {
            await new Promise((r) => setTimeout(r, 300))
            const newUnit: AdminUnit = {
                id: `au${Date.now()}`,
                name: formName.trim(),
                focus: formFocus.trim() || "General",
                members: 0,
                admins: 0,
                status: "Active",
            }
            setUnits((prev) => [...prev, newUnit])
            setCreateOpen(false)
            resetForm()
            showSuccess(`Unit "${newUnit.name}" created successfully`)
        } finally {
            setSubmitting(false)
        }
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUnit) return
        const err = validateAll()
        if (err) return showWarning(err)

        setSubmitting(true)
        try {
            await new Promise((r) => setTimeout(r, 300))
            setUnits((prev) =>
                prev.map((u) =>
                    u.id === selectedUnit.id
                        ? { ...u, name: formName.trim(), focus: formFocus.trim() || "General" }
                        : u
                )
            )
            setEditOpen(false)
            setSelectedUnit(null)
            resetForm()
            showSuccess(`Unit "${formName.trim()}" updated successfully`)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = (unit: AdminUnit) => {
        if (!window.confirm(`Delete unit "${unit.name}"? This action cannot be undone.`)) return
        setUnits((prev) => prev.filter((u) => u.id !== unit.id))
        showSuccess(`Unit "${unit.name}" deleted`)
    }

    const renderFormFields = () => (
        <div className="space-y-4">
            <Field label="Unit Name" required error={errors.name} hint="Only letters and spaces">
                <Input
                    placeholder="e.g. Marketing Unit"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={60}
                />
            </Field>

            <Field label="Focus Area" hint="What this unit oversees">
                <Input
                    placeholder="e.g. Digital Marketing"
                    value={formFocus}
                    onChange={(e) => setFormFocus(e.target.value)}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={80}
                />
            </Field>
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Administrative Units</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Organize delegated admin scopes without affecting licensing.
                        </p>
                    </div>
                    <Button
                        onClick={openCreate}
                        className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4"
                    >
                        <Plus size={14} />
                        Create Admin Unit
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Units</p>
                        <p className="text-white text-xl font-semibold mt-1">{units.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Active containers</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Members</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalMembers}</p>
                        <p className="text-primary text-[10px] mt-1">Across all units</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Admins</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalAdmins}</p>
                        <p className="text-zinc-400 text-[10px] mt-1">Delegated administrators</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Security Score</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">92%</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Above baseline</p>
                    </div>
                </div>

                {/* Search bar */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search units by name or focus..."
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Unit grid */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredUnits.map((unit) => (
                            <div key={unit.id} className="bg-white border border-zinc-200 rounded-none p-5 space-y-4 hover:border-primary/30 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-none flex items-center justify-center">
                                        <Building className="w-5 h-5" />
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900">
                                                <MoreVertical size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-lg p-2 min-w-[160px]">
                                            <DropdownMenuLabel className="text-[10px] font-medium text-gray-400 mb-1">Actions</DropdownMenuLabel>
                                            <DropdownMenuItem className="text-xs font-medium p-2 rounded-md cursor-pointer gap-2" onClick={() => openEdit(unit)}>
                                                <Pencil size={13} />
                                                Edit Unit
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="my-1" />
                                            <DropdownMenuItem className="text-xs font-medium p-2 text-rose-600 rounded-md cursor-pointer gap-2" onClick={() => handleDelete(unit)}>
                                                <Trash2 size={13} />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-900">{unit.name}</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">{unit.focus}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-zinc-50 border border-zinc-100 rounded-none p-3">
                                        <p className="text-[10px] font-medium text-zinc-500">Members</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Users className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-semibold text-zinc-900">{unit.members}</span>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-50 border border-zinc-100 rounded-none p-3">
                                        <p className="text-[10px] font-medium text-zinc-500">Admins</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Shield className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-semibold text-zinc-900">{unit.admins}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                                    {unit.status === "Active" ? (
                                        <div className="inline-flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-none" />
                                            <span className="text-[10px] font-medium">Active</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-2 px-2 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-none">
                                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-none" />
                                            <span className="text-[10px] font-medium">Review Required</span>
                                        </div>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs font-medium text-zinc-500 hover:text-primary h-7 px-2 rounded-none"
                                        onClick={() => showSuccess(`Managing ${unit.name}`)}
                                    >
                                        Manage
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={openCreate}
                            className="border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-10 text-center space-y-3 hover:border-primary/40 hover:bg-primary/5 transition-colors rounded-none"
                        >
                            <div className="w-12 h-12 bg-zinc-50 rounded-none flex items-center justify-center">
                                <Plus className="w-6 h-6 text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-500">Define Scope</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Create a new container for delegated admins</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Info banner */}
                <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-none">
                        <ShieldCheck size={18} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Scoping note</h3>
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                            Administrative Units do not affect standard user licensing. They are purely for permission scoping.
                        </p>
                    </div>
                </div>
            </div>

            {/* Create side sheet */}
            <SideFormSheet
                open={createOpen}
                onOpenChange={(o) => {
                    setCreateOpen(o)
                    if (!o) resetForm()
                }}
                title="Create Administrative Unit"
                description="Define a new scoped container for delegated admins."
                icon={<Network className="w-5 h-5" />}
                onSubmit={handleCreate}
                submitLabel="Create Unit"
                loading={submitting}
                width="md"
            >
                {renderFormFields()}
            </SideFormSheet>

            {/* Edit side sheet */}
            <SideFormSheet
                open={editOpen}
                onOpenChange={(o) => {
                    setEditOpen(o)
                    if (!o) {
                        setSelectedUnit(null)
                        resetForm()
                    }
                }}
                title="Edit Administrative Unit"
                description="Update the unit details."
                icon={<Network className="w-5 h-5" />}
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
