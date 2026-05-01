"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Shield,
    Plus,
    Search,
    Edit,
    Trash2,
    History,
    Lock,
    KeyRound,
    AlertTriangle,
    RefreshCw,
    MoreVertical,
} from "lucide-react"
import Link from "next/link"
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
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import useRolesStore from "@/lib/roleStore"
import { deleteRole, getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks"
import { decryptData } from "@/utils/crypto"

export default function CustomRolesPage() {
    const params = useParams()
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [orgName, setOrgName] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const orgRoles = useRolesStore((state) => state.roles?.organization) || []
    const customRoles = useMemo(() => orgRoles.filter((r: any) => r.isCustom), [orgRoles])

    useEffect(() => {
        const org = (params.orgName as string) || localStorage.getItem("orgName") || ""
        setOrgName(org)
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const orgId =
                (typeof window !== "undefined" &&
                    (localStorage.getItem("orgID") || localStorage.getItem("orgId"))) ||
                ""
            const scopeParams = {
                scope: "sc-org" as const,
                ...(orgId ? { orgId } : {}),
            }
            const res = await getAllRolesNPermissions(scopeParams)

            if (res?.data?.permissions && res?.data?.iv) {
                const decrypted = decryptData(res.data.permissions, res.data.iv)
                useRolesStore.getState().setRoles((prev) => ({
                    ...prev,
                    organization: decrypted,
                }))
            }
        } catch (error) {
            console.error("Error fetching roles:", error)
            toast.error("Failed to load custom roles")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (role: any) => {
        if (!window.confirm(`Delete custom role "${role.name}"?`)) return
        try {
            await deleteRole(role._id)
            useRolesStore.getState().setRoles((prev) => ({
                ...prev,
                organization: (prev.organization || []).filter((r: any) => r._id !== role._id),
            }))
            toast.success("Custom role removed successfully")
        } catch (error) {
            toast.error("Failed to delete role")
        }
    }

    const filteredCustomRoles = customRoles.filter(
        (role: any) =>
            (role.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const totalPermissions = useMemo(() => {
        return customRoles.reduce((acc: number, role: any) => acc + (role.permissions || []).length, 0)
    }, [customRoles])

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Custom Roles</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Define organization-specific roles with fine-grained permission scopes.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={fetchData}
                            disabled={isLoading}
                            variant="outline"
                            size="sm"
                            className="rounded-none border-zinc-200 font-medium text-xs h-8 gap-1.5 px-4"
                        >
                            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Link href={`/${orgName}/modules/administration/roles/create`}>
                            <Button
                                size="sm"
                                className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-5"
                            >
                                <Plus size={14} />
                                Create Role
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Custom Roles</p>
                        <p className="text-white text-xl font-semibold mt-1">{customRoles.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Active in organization</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Permissions</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalPermissions}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Across all custom roles</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Compliance Status</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">Verified</p>
                        <p className="text-primary text-[10px] mt-1">Last checked today</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Security Depth</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">Granular</p>
                        <p className="text-zinc-400 text-[10px] mt-1">Fine-grained access control</p>
                    </div>
                </div>

                {/* Roles Table */}
                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search custom roles by name or description..."
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <span className="text-[11px] font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded-none">
                            {filteredCustomRoles.length} roles
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Role Name</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Permissions</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {isLoading && customRoles.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                                                <span className="text-xs text-zinc-500">Loading custom roles...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredCustomRoles.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-14 h-14 bg-zinc-50 flex items-center justify-center rounded-none">
                                                    <AlertTriangle className="w-6 h-6 text-zinc-300" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-zinc-500">No custom roles found</p>
                                                    <p className="text-xs text-zinc-400 mt-1">Create a custom role to get started.</p>
                                                </div>
                                                <Link href={`/${orgName}/modules/administration/roles/create`}>
                                                    <Button className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4 mt-2">
                                                        <Plus size={14} />
                                                        Create Custom Role
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomRoles.map((role: any) => (
                                        <tr key={role._id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-primary/10 text-primary rounded-none flex items-center justify-center font-semibold text-sm">
                                                        {role.name ? role.name.charAt(0).toUpperCase() : "C"}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                                                        <span className="text-[10px] text-zinc-500 font-medium">
                                                            ID: {role._id ? role._id.slice(-8) : "unknown"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex -space-x-2">
                                                        {(role.permissions || []).slice(0, 3).map((p: any, idx: number) => (
                                                            <div
                                                                key={idx}
                                                                className="h-7 w-7 bg-zinc-100 text-zinc-600 border-2 border-white flex items-center justify-center text-[10px] font-semibold rounded-none"
                                                            >
                                                                {p.module ? p.module.charAt(0).toUpperCase() : "?"}
                                                            </div>
                                                        ))}
                                                        {(role.permissions || []).length > 3 && (
                                                            <div className="h-7 w-7 bg-primary/10 text-primary border-2 border-white flex items-center justify-center text-[10px] font-semibold rounded-none">
                                                                +{(role.permissions || []).length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold text-zinc-700">
                                                            {(role.permissions || []).length} modules
                                                        </span>
                                                        <span className="text-[10px] font-medium text-zinc-500">Active scope</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="inline-flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none">
                                                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-none animate-pulse" />
                                                    <span className="text-[10px] font-medium">Active</span>
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
                                                        <DropdownMenuItem
                                                            className="text-xs font-medium p-2 rounded-md cursor-pointer gap-2"
                                                            onClick={() => router.push(`/${orgName}/modules/administration/roles/${role._id}/edit`)}
                                                        >
                                                            <Edit size={13} />
                                                            Edit Role
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="my-1" />
                                                        <DropdownMenuItem
                                                            className="text-xs font-medium p-2 text-rose-600 rounded-md cursor-pointer gap-2"
                                                            onClick={() => handleDelete(role)}
                                                        >
                                                            <Trash2 size={13} />
                                                            Delete
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

                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                        <p className="text-[11px] font-medium text-zinc-500">
                            Showing <span className="text-zinc-900 font-semibold">{filteredCustomRoles.length}</span> of <span className="text-zinc-900 font-semibold">{customRoles.length} custom roles</span>
                        </p>
                    </div>
                </div>

                {/* Info banner */}
                <div className="bg-white border border-gray-200 rounded-none p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <Shield size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Security best practices</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Custom roles are audited regularly. Follow the principle of least privilege when defining new roles.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none border-zinc-200 font-medium text-xs h-8 gap-1.5 px-4 shrink-0"
                    >
                        <KeyRound size={14} />
                        Learn More
                    </Button>
                </div>
            </div>
        </div>
    )
}
