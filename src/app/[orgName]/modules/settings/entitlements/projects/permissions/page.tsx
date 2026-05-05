"use client"

import React, { useState } from "react"
import {
    Shield,
    Save,
    Lock,
    Users,
    ListChecks,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"
import { showSuccess } from "@/shared/utils/toast"

type Permission = {
    id: string
    action: string
    admin: boolean
    member: boolean
    viewer: boolean
}

export default function IssuePermissionsPage() {
    const [isSaving, setIsSaving] = useState(false)

    const [permissions, setPermissions] = useState<Permission[]>([
        { id: "1", action: "Create Tasks", admin: true, member: true, viewer: false },
        { id: "2", action: "Edit Any Task", admin: true, member: false, viewer: false },
        { id: "3", action: "Edit Own Task", admin: true, member: true, viewer: false },
        { id: "4", action: "Delete Tasks", admin: true, member: false, viewer: false },
        { id: "5", action: "Move Status", admin: true, member: true, viewer: false },
        { id: "6", action: "Comment", admin: true, member: true, viewer: true },
    ])

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await new Promise((r) => setTimeout(r, 500))
            showSuccess("Permissions saved globally")
        } finally {
            setIsSaving(false)
        }
    }

    const togglePermission = (id: string, role: "admin" | "member" | "viewer") => {
        setPermissions((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [role]: !p[role] } : p))
        )
    }

    const totalActions = permissions.length
    const memberEnabled = permissions.filter((p) => p.member).length
    const viewerEnabled = permissions.filter((p) => p.viewer).length

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Issue Permissions</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Control strict access levels for project actions across roles.
                        </p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="sm"
                        className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-5"
                    >
                        <Save size={14} />
                        {isSaving ? "Saving..." : "Save Matrix"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Roles Configured</p>
                        <p className="text-white text-xl font-semibold mt-1">3</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Admin, Member, Viewer</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Actions</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalActions}</p>
                        <p className="text-primary text-[10px] mt-1">Permission rules</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Member Access</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{memberEnabled}/{totalActions}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Actions enabled</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Viewer Access</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{viewerEnabled}/{totalActions}</p>
                        <p className="text-zinc-400 text-[10px] mt-1">Actions enabled</p>
                    </div>
                </div>

                {/* Matrix Table */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-2">
                        <Shield size={16} className="text-primary" />
                        <h3 className="text-sm font-semibold text-gray-900">Permission Matrix</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Action</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center w-32">Admin</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center w-32">Member</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center w-32">Viewer</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {permissions.map((p) => (
                                    <tr key={p.id} className="hover:bg-primary/5 transition-colors">
                                        <td className="px-6 py-3 text-xs font-semibold text-gray-900">{p.action}</td>
                                        <td className="px-6 py-3 text-center">
                                            <div className="flex justify-center">
                                                <Switch checked={p.admin} onCheckedChange={() => togglePermission(p.id, "admin")} disabled />
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <div className="flex justify-center">
                                                <Switch checked={p.member} onCheckedChange={() => togglePermission(p.id, "member")} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <div className="flex justify-center">
                                                <Switch checked={p.viewer} onCheckedChange={() => togglePermission(p.id, "viewer")} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                        <p className="text-[11px] font-medium text-zinc-500">
                            Admin role has full access by default and cannot be modified here.
                        </p>
                    </div>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <Shield size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Global policy</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                This matrix applies to every project unless overridden.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <Users size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Role-based access</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Each user inherits permissions from their assigned role.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <ListChecks size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Audit logged</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Changes to the permission matrix are recorded in the audit log.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
