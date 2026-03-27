"use client"

import { useState, useEffect, useMemo } from "react"
import {
    Shield,
    Plus,
    Search,
    Edit,
    Trash2,
    ChevronRight,
    Settings2,
    Lock,
    ExternalLink,
    History,
    AlertTriangle,
    RefreshCw,
    Users,
    KeyRound
} from "lucide-react"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

    const orgRoles = useRolesStore(state => state.roles?.organization) || []
    const customRoles = useMemo(() => orgRoles.filter((r: any) => r.isCustom), [orgRoles])

    useEffect(() => {
        const org = params.orgName as string || localStorage.getItem("orgName") || ""
        setOrgName(org)
        fetchData()
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const scopeParams = { scope: "sc-org" as const }
            const res = await getAllRolesNPermissions(scopeParams)

            if (res?.data?.permissions && res?.data?.iv) {
                const decrypted = decryptData(res.data.permissions, res.data.iv)
                useRolesStore.getState().setRoles(prev => ({
                    ...prev,
                    organization: decrypted
                }))
            }
        } catch (error) {
            console.error("Error fetching roles:", error)
            toast.error("Failed to load custom roles")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (roleId: string) => {
        try {
            await deleteRole(roleId)
            useRolesStore.getState().setRoles(prev => ({
                ...prev,
                organization: (prev.organization || []).filter((r: any) => r._id !== roleId)
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

    if (isLoading && orgRoles.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 flex flex-col items-center justify-center space-y-4 font-outfit">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="text-sm text-gray-500">Loading custom roles...</span>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 font-outfit">
            <SubHeader
                title="Custom Roles"
                breadcrumbItems={[
                    { label: "Identity & Access", href: "#" },
                    { label: "Access Management", href: "#" },
                    { label: "Custom Roles", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton
                            onClick={fetchData}
                            variant="outline"
                            className="rounded-lg h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold text-xs"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                        </CustomButton>
                        <Link href={`/${orgName}/modules/administration/roles/create`}>
                            <CustomButton className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-10 px-6 border-0 shadow-md">
                                <Plus className="w-4 h-4 mr-2" /> Create Role
                            </CustomButton>
                        </Link>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Card 1 - Primary gradient */}
                    <div className="rounded-xl bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-9 w-9 bg-white/20 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <div className="text-xl font-semibold">{customRoles.length}</div>
                        <div className="text-xs text-white/80">Custom roles</div>
                        <div className="text-[10px] text-white/60 mt-1">Active in organization</div>
                    </div>

                    {/* Card 2 */}
                    <div className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-9 w-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <KeyRound className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                        <div className="text-xl font-semibold text-gray-900">{totalPermissions}</div>
                        <div className="text-xs text-gray-500">Total permissions</div>
                        <div className="text-[10px] text-gray-400 mt-1">Across all custom roles</div>
                    </div>

                    {/* Card 3 */}
                    <div className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-9 w-9 bg-indigo-50 rounded-lg flex items-center justify-center">
                                <History className="w-5 h-5 text-indigo-600" />
                            </div>
                        </div>
                        <div className="text-xl font-semibold text-gray-900">Verified</div>
                        <div className="text-xs text-gray-500">Compliance status</div>
                        <div className="text-[10px] text-gray-400 mt-1">Last checked today</div>
                    </div>

                    {/* Card 4 */}
                    <div className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="h-9 w-9 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Lock className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-xl font-semibold text-gray-900">Granular</div>
                        <div className="text-xs text-gray-500">Security depth</div>
                        <div className="text-[10px] text-gray-400 mt-1">Fine-grained access control</div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search custom roles by name or description..."
                            className="pl-11 border-none focus-visible:ring-0 rounded-lg h-10 bg-transparent text-sm"
                        />
                    </div>
                    <CustomButton variant="ghost" className="rounded-lg h-10 px-4 font-semibold text-xs text-gray-500">
                        <Settings2 className="w-4 h-4 mr-2" /> Filters
                    </CustomButton>
                </div>

                {/* Roles Table */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-gray-700">Custom Roles</h4>
                        <Badge className="bg-blue-50 text-blue-600 rounded-full border-0 text-[10px] font-semibold px-3 py-1">
                            {filteredCustomRoles.length} roles
                        </Badge>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 hover:bg-transparent">
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500">Role name</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500">Permissions</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500">Status</TableHead>
                                    <TableHead className="px-6 py-3 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                {filteredCustomRoles.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="p-16 text-center space-y-4">
                                            <div className="h-16 w-16 bg-gray-50 dark:bg-zinc-800 flex items-center justify-center rounded-xl mx-auto">
                                                <AlertTriangle className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-gray-400">No custom roles found</p>
                                                <p className="text-xs text-gray-400">Create a custom role to get started.</p>
                                            </div>
                                            <Link href={`/${orgName}/modules/administration/roles/create`}>
                                                <CustomButton className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-10 px-6 shadow-md mt-2">
                                                    Create Custom Role
                                                </CustomButton>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCustomRoles.map((role: any) => (
                                        <TableRow key={role._id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-all group">
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center rounded-lg font-semibold text-sm">
                                                        {role.name ? role.name.charAt(0).toUpperCase() : 'C'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{role.name}</span>
                                                        <span className="text-[10px] text-gray-400">ID: {role._id ? role._id.slice(-8) : 'unknown'}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex -space-x-2">
                                                        {(role.permissions || []).slice(0, 3).map((p: any, idx: number) => (
                                                            <div key={idx} className="h-8 w-8 bg-gray-100 dark:bg-zinc-800 text-gray-600 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-semibold rounded-full">
                                                                {p.module ? p.module.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                        ))}
                                                        {(role.permissions || []).length > 3 && (
                                                            <div className="h-8 w-8 bg-blue-100 text-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-semibold rounded-full">
                                                                +{(role.permissions || []).length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-semibold text-gray-700 dark:text-zinc-200">{(role.permissions || []).length} modules</span>
                                                        <span className="text-[10px] text-gray-400">Active scope</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-4">
                                                <Badge className="rounded-full bg-emerald-50 text-emerald-600 border-0 text-[10px] font-semibold px-3 py-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div>
                                                    Active
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                    <Link href={`/${orgName}/modules/administration/roles/${role._id}/edit`}>
                                                        <CustomButton variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-lg">
                                                            <Edit className="w-4 h-4" />
                                                        </CustomButton>
                                                    </Link>
                                                    <CustomButton
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDelete(role._id)}
                                                        className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </CustomButton>
                                                    <CustomButton variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-gray-600 rounded-lg">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </CustomButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="p-6 bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center rounded-xl">
                            <Shield className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Security best practices</h5>
                            <p className="text-xs text-gray-500 mt-0.5 max-w-lg">
                                Custom roles are audited regularly. Follow the principle of least privilege when defining new roles.
                            </p>
                        </div>
                    </div>
                    <CustomButton variant="outline" className="rounded-lg border-zinc-200 dark:border-zinc-700 font-semibold text-xs h-10 px-5">
                        Learn more
                    </CustomButton>
                </div>
            </div>
        </div>
    )
}
