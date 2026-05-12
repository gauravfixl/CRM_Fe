"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Shield,
    Plus,
    Search,
    Lock,
    Users,
    Eye,
    Trash2,
    Check,
    X,
    Loader2,
    Edit3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import SidePanel from "@/shared/components/projectmanagement/side-panel"
import { useRolePermissionStore, type Role, type PermissionKey } from "@/shared/data/role-permission-store"

const schema = z.object({
    name: z.string().trim().min(2, "Role name is required").max(40),
    description: z.string().max(200).optional().or(z.literal("")),
    members: z.coerce.number().int().min(0).max(9999),
})
type FormValues = z.infer<typeof schema>

export default function PermissionsPage() {
    const [mounted, setMounted] = useState(false)
    const { roles, addRole, updateRole, deleteRole, togglePermission } = useRolePermissionStore()
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [editing, setEditing] = useState<Role | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setMounted(true)
        useRolePermissionStore.persist.rehydrate()
    }, [])

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { name: "", description: "", members: 0 },
    })

    useEffect(() => {
        if (isOpen && editing) {
            reset({ name: editing.name, description: editing.description, members: editing.members })
        } else if (isOpen) {
            reset({ name: "", description: "", members: 0 })
        }
    }, [isOpen, editing, reset])

    if (!mounted) return null

    const onSubmit = async (values: FormValues) => {
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 200))
        if (editing) {
            updateRole(editing.id, {
                name: values.name,
                description: values.description || "",
                members: values.members,
            })
        } else {
            addRole({
                name: values.name,
                description: values.description || "",
                members: values.members,
                permissions: { view: true, create: false, edit: false, delete: false, admin: false },
            })
        }
        setIsLoading(false)
        setIsOpen(false)
        setEditing(null)
        reset()
    }

    const handleDelete = (role: Role) => {
        if (role.isSystem) {
            alert("System roles cannot be deleted.")
            return
        }
        if (confirm(`Delete role "${role.name}"?`)) {
            deleteRole(role.id)
        }
    }

    const filtered = roles.filter(r => r.name.toLowerCase().includes(query.toLowerCase()) || r.description.toLowerCase().includes(query.toLowerCase()))

    const kpis = [
        { label: "Total Roles", value: roles.length, icon: <Shield size={18} />, color: "text-indigo-800", bg: "bg-indigo-100" },
        { label: "Admins", value: roles.find(r => r.name === "Admin")?.members || 0, icon: <Lock size={18} />, color: "text-rose-800", bg: "bg-rose-100" },
        { label: "All Members", value: roles.reduce((s, r) => s + r.members, 0), icon: <Users size={18} />, color: "text-emerald-800", bg: "bg-emerald-100" },
        { label: "Viewers", value: roles.find(r => r.name === "Viewer")?.members || 0, icon: <Eye size={18} />, color: "text-amber-800", bg: "bg-amber-100" },
    ]

    return (
        <div className="w-full h-full p-6 space-y-5 font-sans">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 flex items-center justify-center text-white shadow-sm rounded-none">
                            <Shield size={16} />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Permissions</h1>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">
                        Role-based access control across the workspace.
                    </p>
                </div>
                <Button onClick={() => { setEditing(null); setIsOpen(true) }} className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold gap-2 rounded-none">
                    <Plus size={14} strokeWidth={3} /> New Role
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((stat, i) => (
                    <div key={i} className={`block border shadow-sm h-[75px] rounded-none ${stat.bg}`}>
                        <div className="p-4 flex items-center justify-between w-full h-full">
                            <div className="flex items-center gap-4">
                                <div className={`h-10 w-10 bg-white ${stat.color} flex items-center justify-center shrink-0 rounded-none`}>{stat.icon}</div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight leading-none">{stat.label}</span>
                                    <span className="text-xl font-black text-slate-900 leading-none mt-1.5">{stat.value}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search roles..." className="pl-9 h-9 bg-white border-slate-200 text-xs font-medium rounded-none" />
            </div>

            <div className="border border-slate-200 bg-white shadow-sm overflow-auto rounded-none">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Role</th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-slate-500 uppercase">View</th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-slate-500 uppercase">Create</th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-slate-500 uppercase">Edit</th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-slate-500 uppercase">Delete</th>
                            <th className="px-4 py-2 text-center text-xs font-bold text-slate-500 uppercase">Admin</th>
                            <th className="px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase">Members</th>
                            <th className="px-4 py-2 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(r => (
                            <tr key={r.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                            {r.name}
                                            {r.isSystem && <Badge className="bg-slate-100 text-slate-500 text-[9px] font-bold rounded-none">SYSTEM</Badge>}
                                        </span>
                                        <span className="text-[11px] text-slate-500">{r.description}</span>
                                    </div>
                                </td>
                                {(["view", "create", "edit", "delete", "admin"] as PermissionKey[]).map(p => (
                                    <td key={p} className="px-4 py-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => togglePermission(r.id, p)}
                                            className={`h-6 w-6 inline-flex items-center justify-center rounded-none transition-colors ${r.permissions[p] ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                                        >
                                            {r.permissions[p] ? <Check size={14} /> : <X size={14} />}
                                        </button>
                                    </td>
                                ))}
                                <td className="px-4 py-3">
                                    <Badge className="bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-none">{r.members} users</Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => { setEditing(r); setIsOpen(true) }}
                                            className="h-7 w-7 inline-flex items-center justify-center text-slate-400 hover:text-indigo-600 rounded-none"
                                        >
                                            <Edit3 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={r.isSystem}
                                            onClick={() => handleDelete(r)}
                                            className={`h-7 w-7 inline-flex items-center justify-center rounded-none ${r.isSystem ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-rose-600"}`}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} className="px-4 py-10 text-center text-xs text-slate-400 font-medium">No roles found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <SidePanel
                open={isOpen}
                onClose={() => { setIsOpen(false); setEditing(null) }}
                title={editing ? "Edit Role" : "Create Role"}
                description="Add a custom role and configure its base permissions."
                width="md"
                footer={
                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditing(null) }} className="font-bold text-slate-600 rounded-none">Cancel</Button>
                        <Button type="submit" form="role-form" disabled={!isValid || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none">
                            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>) : editing ? "Save Changes" : "Create Role"}
                        </Button>
                    </div>
                }
            >
                <form id="role-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name <span className="text-rose-500">*</span></Label>
                        <Input {...register("name")} placeholder="e.g. Lead Engineer" className="rounded-none" />
                        {errors.name && <p className="text-[11px] font-semibold text-rose-600">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                        <Input {...register("description")} placeholder="What does this role do?" className="rounded-none" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Members Count</Label>
                        <Input type="number" {...register("members")} className="rounded-none" min={0} />
                        {errors.members && <p className="text-[11px] font-semibold text-rose-600">{errors.members.message}</p>}
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 bg-slate-50 p-3 border border-slate-200 rounded-none">
                        Permissions can be toggled directly from the table after creating the role.
                    </p>
                </form>
            </SidePanel>
        </div>
    )
}
