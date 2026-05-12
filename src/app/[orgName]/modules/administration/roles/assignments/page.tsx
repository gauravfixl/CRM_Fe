"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    Search,
    Users as UsersIcon,
    Shield,
    UserCheck,
    AlertTriangle,
    RefreshCw,
    UserCog,
    XCircle,
    Loader2,
    Edit3,
    CheckCircle2,
    Plus,
    User as UserIcon,
} from "lucide-react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Label } from "@/shared/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs"
import { toast } from "sonner"
import { decryptData } from "@/utils/crypto"
import {
    getAllRolesNPermissions,
    listOrgMembers,
    assignRoleToMember,
    revokeMemberRole,
} from "@/hooks/roleNPermissionHooks"
import useRolesStore from "@/lib/roleStore"
import { ROLE_DISPLAY_NAMES } from "@/shared/utils/module-permission-map"
import { useCachedFetch, invalidateCachePrefix } from "@/lib/swrCache"

type OrgUser = {
    memberId: string
    userId?: string
    name?: string
    email?: string
    role?: string         // role name OR slug, depending on backend
    roleId?: string       // RolePermission _id
    orgActive?: boolean
    joinedAt?: string
}

type Role = {
    _id: string
    name: string
    role?: string
    description?: string
    isCustom?: boolean
    permissions?: { module: string; actions: string[] }[]
}

export default function RoleAssignmentsPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const focusMemberId = searchParams.get("memberId")
    const focusRoleSlug = searchParams.get("role")
    const action = searchParams.get("action") // "new" → auto-open new-assignment dialog
    const [orgName, setOrgName] = useState("")
    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState<"byUser" | "byRole">("byUser")
    const [roleFilter, setRoleFilter] = useState<string | null>(null) // role slug
    const [savingFor, setSavingFor] = useState<string | null>(null)

    // Per-user assign / change role dialog
    const [assignTarget, setAssignTarget] = useState<OrgUser | null>(null)
    const [assignRoleId, setAssignRoleId] = useState<string>("")

    // "New Assignment" dialog (pick user + role together)
    const [newAssignOpen, setNewAssignOpen] = useState(false)
    const [newAssignUserId, setNewAssignUserId] = useState<string>("")
    const [newAssignRoleId, setNewAssignRoleId] = useState<string>("")
    const [newAssignSaving, setNewAssignSaving] = useState(false)

    const orgRoles = useRolesStore((state) => state.roles?.organization) as Role[] | undefined

    const orgId =
        typeof window !== "undefined"
            ? localStorage.getItem("orgID") || localStorage.getItem("orgId") || ""
            : ""
    const cacheScope = orgId || "default"

    const fetchRolesData = useCallback(async (): Promise<Role[]> => {
        const params: any = { scope: "sc-org" }
        if (orgId) params.orgId = orgId
        const res = await getAllRolesNPermissions(params)
        if (res?.data?.permissions && res?.data?.iv) {
            return (decryptData(res.data.permissions, res.data.iv) || []) as Role[]
        }
        return []
    }, [orgId])

    const fetchMembersData = useCallback(async (): Promise<OrgUser[]> => {
        const res = await listOrgMembers({ page: 1, limit: 100 })
        const apiUsers = res?.data?.users ?? res?.data?.members ?? []
        return apiUsers as OrgUser[]
    }, [])

    const {
        data: rolesData,
        error: rolesError,
        refetch: refetchRoles,
    } = useCachedFetch<Role[]>(`roles:org:${cacheScope}:assignments`, fetchRolesData)

    const {
        data: usersData,
        loading: usersLoading,
        error: usersError,
        refetch: refetchUsers,
        setData: setUsersData,
    } = useCachedFetch<OrgUser[]>(`members:org:${cacheScope}:assignments`, fetchMembersData)

    // Mirror role payload into the shared zustand store so other pages stay in sync.
    useEffect(() => {
        if (rolesData)
            useRolesStore.getState().setRoles((prev) => ({ ...prev, organization: rolesData }))
    }, [rolesData])

    const users: OrgUser[] = usersData ?? []
    const loading = usersLoading
    const loadError = rolesError || usersError

    useEffect(() => {
        const org = (params.orgName as string) || localStorage.getItem("orgName") || ""
        setOrgName(org)
    }, [params.orgName])

    // Permission-denied (403) on members is the most common failure — surface
    // it as a toast only once per error, and only when there's nothing to show.
    const lastUsersErrorToast = useRef<string | null>(null)
    useEffect(() => {
        if (!usersError || users.length > 0) return
        if (lastUsersErrorToast.current === usersError) return
        lastUsersErrorToast.current = usersError
        toast.error(
            usersError.toLowerCase().includes("permission") || usersError.includes("403")
                ? "You don't have permission to view organization users (VIEW_ORG_USER)."
                : usersError,
        )
    }, [usersError, users.length])

    const loadAll = useCallback(async () => {
        await Promise.allSettled([refetchRoles(), refetchUsers()])
    }, [refetchRoles, refetchUsers])

    // Apply URL filters once on mount: ?role=<slug> → switch tab + filter
    useEffect(() => {
        if (focusRoleSlug) {
            setRoleFilter(focusRoleSlug)
            setActiveTab("byRole")
        }
        if (action === "new") {
            setNewAssignOpen(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusRoleSlug, action])

    // Auto-open the per-user assign dialog when navigated with ?memberId=...
    useEffect(() => {
        if (!focusMemberId || users.length === 0) return
        const target = users.find((u) => u.memberId === focusMemberId)
        if (target) openAssign(target)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusMemberId, users.length])

    const filtered = useMemo(() => {
        let list = users
        // Apply role-slug filter from URL (?role=OrgAdmin) when set
        if (roleFilter) {
            const f = roleFilter.toLowerCase()
            list = list.filter((u) => (u.role || "").toLowerCase() === f)
        }
        if (!search.trim()) return list
        const q = search.toLowerCase()
        return list.filter(
            (u) =>
                (u.name || "").toLowerCase().includes(q) ||
                (u.email || "").toLowerCase().includes(q) ||
                (u.role || "").toLowerCase().includes(q)
        )
    }, [users, search, roleFilter])

    // Resolve the focused role's display info from the store, if any
    const focusedRole = useMemo(() => {
        if (!roleFilter) return null
        return (orgRoles || []).find(
            (r) => (r.role || r.name) === roleFilter || r.name === roleFilter
        )
    }, [roleFilter, orgRoles])

    // Users available to be assigned in the New Assignment dialog —
    // when ?role= filter is active, pre-select the focused role and let admin
    // pick from members who do NOT already have it.
    const usersForNewAssignment = useMemo(() => {
        if (!roleFilter) return users
        return users.filter((u) => (u.role || "").toLowerCase() !== roleFilter.toLowerCase())
    }, [users, roleFilter])

    const stats = useMemo(() => {
        const totalUsers = users.length
        const activeUsers = users.filter((u) => u.orgActive !== false).length
        const totalRoles = (orgRoles || []).length
        const customRoles = (orgRoles || []).filter((r) => r.isCustom).length
        return { totalUsers, activeUsers, totalRoles, customRoles }
    }, [users, orgRoles])

    const groupedByRole = useMemo(() => {
        const map = new Map<string, OrgUser[]>()
        filtered.forEach((u) => {
            const k = u.role || "Unassigned"
            if (!map.has(k)) map.set(k, [])
            map.get(k)!.push(u)
        })
        return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length)
    }, [filtered])

    const openAssign = (user: OrgUser) => {
        setAssignTarget(user)
        // pre-select existing role by name match
        const found = (orgRoles || []).find(
            (r) => r.name === user.role || r.role === user.role
        )
        setAssignRoleId(found?._id || "")
    }

    const closeAssign = () => {
        setAssignTarget(null)
        setAssignRoleId("")
    }

    const submitAssign = async () => {
        if (!assignTarget || !assignRoleId) {
            toast.error("Pick a role to assign")
            return
        }
        const role = (orgRoles || []).find((r) => r._id === assignRoleId)
        if (!role) {
            toast.error("Selected role not found")
            return
        }
        // Backend (PUT /organization/updateuser/:memberId) looks up RolePermission
        // by `{ role: <slug>, isCustom: <bool> }` — so we pass slug + custom flag.
        const roleSlug = role.role || role.name // fallback to name if slug missing
        setSavingFor(assignTarget.memberId)
        try {
            await assignRoleToMember(assignTarget.memberId, {
                roleSlug,
                isCustom: Boolean(role.isCustom),
            })
            setUsersData((prev) =>
                (prev ?? []).map((u) =>
                    u.memberId === assignTarget.memberId
                        ? { ...u, role: roleSlug, roleId: assignRoleId }
                        : u
                )
            )
            invalidateCachePrefix("members:org:")
            toast.success(`Role assigned to ${assignTarget.name}`)
            closeAssign()
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to assign role")
        } finally {
            setSavingFor(null)
        }
    }

    // Pre-select role + user when the New Assignment dialog opens
    useEffect(() => {
        if (!newAssignOpen) return
        // If ?role= filter is set, pre-fill the role select
        if (focusedRole?._id && !newAssignRoleId) {
            setNewAssignRoleId(focusedRole._id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newAssignOpen, focusedRole?._id])

    const closeNewAssign = () => {
        setNewAssignOpen(false)
        setNewAssignUserId("")
        setNewAssignRoleId("")
    }

    const submitNewAssign = async () => {
        if (!newAssignUserId || !newAssignRoleId) {
            toast.error("Pick both a user and a role")
            return
        }
        const role = (orgRoles || []).find((r) => r._id === newAssignRoleId)
        const user = users.find((u) => u.memberId === newAssignUserId)
        if (!role || !user) {
            toast.error("Selected user or role not found")
            return
        }
        const roleSlug = role.role || role.name
        setNewAssignSaving(true)
        try {
            await assignRoleToMember(user.memberId, {
                roleSlug,
                isCustom: Boolean(role.isCustom),
            })
            setUsersData((prev) =>
                (prev ?? []).map((u) =>
                    u.memberId === user.memberId
                        ? { ...u, role: roleSlug, roleId: newAssignRoleId }
                        : u
                )
            )
            invalidateCachePrefix("members:org:")
            toast.success(`${role.name} assigned to ${user.name}`)
            closeNewAssign()
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to assign role")
        } finally {
            setNewAssignSaving(false)
        }
    }

    const handleRevoke = async (user: OrgUser) => {
        // Backend has no first-class revoke endpoint — DELETE /organization/deleteuser
        // removes the member from the org entirely. Make the destructive nature
        // explicit so the admin doesn't lose data accidentally.
        if (
            !window.confirm(
                `Remove "${user.name}" from the organization?\n\nThis revokes their role and removes their membership. They'll need to be re-invited to rejoin.`
            )
        ) {
            return
        }
        setSavingFor(user.memberId)
        try {
            await revokeMemberRole(user.memberId)
            setUsersData((prev) => (prev ?? []).filter((u) => u.memberId !== user.memberId))
            invalidateCachePrefix("members:org:")
            toast.success(`${user.name} removed from organization`)
        } catch (e: any) {
            toast.error(e?.response?.data?.message || "Failed to remove member")
        } finally {
            setSavingFor(null)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Role Assignments</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Assign or change the role bound to each organization user. Role permissions take
                            effect immediately.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={loadAll}
                            disabled={loading}
                            variant="outline"
                            size="sm"
                            className="rounded-none border-zinc-200 font-medium text-xs h-8 gap-1.5 px-4"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            Refresh
                        </Button>
                        <Link href={`/${orgName}/modules/administration/roles/create`}>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-none border-zinc-200 font-medium text-xs h-8 gap-1.5 px-4"
                            >
                                <Shield size={14} />
                                Create Role
                            </Button>
                        </Link>
                        <Button
                            onClick={() => setNewAssignOpen(true)}
                            size="sm"
                            className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-5"
                        >
                            <Plus size={14} />
                            New Assignment
                        </Button>
                    </div>
                </div>

                {/* Role-filter banner — visible when navigated via ?role= */}
                {roleFilter && (
                    <div className="mt-4 flex items-center justify-between bg-primary/5 border border-primary/20 rounded-none px-4 py-2.5">
                        <div className="flex items-center gap-2">
                            <Shield size={14} className="text-primary" />
                            <span className="text-xs font-medium text-zinc-700">
                                Filtered by role:&nbsp;
                                <span className="font-semibold text-primary">
                                    {focusedRole?.name || ROLE_DISPLAY_NAMES[roleFilter] || roleFilter}
                                </span>
                                &nbsp;· showing {filtered.length} {filtered.length === 1 ? "user" : "users"}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRoleFilter(null)}
                            className="rounded-none text-xs font-medium h-7 px-3 text-zinc-600 hover:bg-white"
                        >
                            <XCircle size={12} className="mr-1.5" />
                            Clear filter
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Users</p>
                        <p className="text-white text-xl font-semibold mt-1">{stats.totalUsers}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Across organization</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Active Users</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{stats.activeUsers}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Currently authorized</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Available Roles</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{stats.totalRoles}</p>
                        <p className="text-primary text-[10px] mt-1">In directory</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Custom Roles</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{stats.customRoles}</p>
                        <p className="text-zinc-400 text-[10px] mt-1">Org-specific extensions</p>
                    </div>
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as "byUser" | "byRole")}
                    className="space-y-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <TabsList className="bg-white p-1 rounded-none border border-zinc-200 h-10 shadow-sm">
                            <TabsTrigger
                                value="byUser"
                                className="rounded-none px-6 font-medium text-xs data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full"
                            >
                                By User
                            </TabsTrigger>
                            <TabsTrigger
                                value="byRole"
                                className="rounded-none px-6 font-medium text-xs data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full"
                            >
                                By Role
                            </TabsTrigger>
                        </TabsList>
                        <div className="relative md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search by name, email or role..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                            />
                        </div>
                    </div>

                    {/* By User table */}
                    <TabsContent value="byUser" className="space-y-6">
                        <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                            <th className="px-6 py-3 text-[11px] font-medium text-gray-500">User</th>
                                            <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Email</th>
                                            <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Current Role</th>
                                            <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Status</th>
                                            <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {loading && users.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                                                        <span className="text-xs text-zinc-500">Loading users...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <AlertTriangle className="w-6 h-6 text-zinc-300" />
                                                        <span className="text-xs text-zinc-500">
                                                            {loadError && users.length === 0
                                                                ? loadError
                                                                : users.length === 0
                                                                    ? "No organization users found yet — invite someone from the Users page."
                                                                    : roleFilter
                                                                        ? `No users currently hold the ${ROLE_DISPLAY_NAMES[roleFilter] || roleFilter} role.`
                                                                        : "No users match your search."}
                                                        </span>
                                                        {loadError && users.length === 0 && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={loadAll}
                                                                className="rounded-none border-zinc-200 text-xs font-medium h-8 px-3 mt-2"
                                                            >
                                                                <RefreshCw size={12} className="mr-1.5" />
                                                                Retry
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((user) => {
                                                const displayRole =
                                                    user.role
                                                        ? ROLE_DISPLAY_NAMES[user.role] || user.role
                                                        : "Unassigned"
                                                return (
                                                    <tr key={user.memberId} className="hover:bg-primary/5 transition-colors">
                                                        <td className="px-6 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-9 h-9 bg-primary/10 text-primary rounded-none flex items-center justify-center font-semibold text-sm">
                                                                    {(user.name || "?").charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-semibold text-gray-900">{user.name || "Unnamed user"}</span>
                                                                    <span className="text-[10px] text-zinc-500 font-medium">
                                                                        ID: {user.memberId.slice(-8)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3 text-xs text-zinc-700 font-medium">
                                                            {user.email || "—"}
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <div className="inline-flex items-center gap-2 px-2 py-1 bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-none text-[11px] font-medium">
                                                                <Shield className="w-3 h-3" />
                                                                {displayRole}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <div
                                                                className={`inline-flex items-center gap-2 px-2 py-1 rounded-none text-[10px] font-medium ${
                                                                    user.orgActive !== false
                                                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                                        : "bg-zinc-100 text-zinc-500 border border-zinc-200"
                                                                }`}
                                                            >
                                                                {user.orgActive !== false ? (
                                                                    <>
                                                                        <CheckCircle2 className="w-3 h-3" />
                                                                        Active
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <XCircle className="w-3 h-3" />
                                                                        Inactive
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-3 text-right">
                                                            <div className="flex items-center gap-2 justify-end">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => openAssign(user)}
                                                                    disabled={savingFor === user.memberId}
                                                                    className="rounded-none border-zinc-200 text-xs font-medium h-8 px-3 gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                                                >
                                                                    {savingFor === user.memberId ? (
                                                                        <Loader2 size={12} className="animate-spin" />
                                                                    ) : (
                                                                        <Edit3 size={12} />
                                                                    )}
                                                                    {user.role ? "Change Role" : "Assign Role"}
                                                                </Button>
                                                                {user.role && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRevoke(user)}
                                                                        disabled={savingFor === user.memberId}
                                                                        title="Removes the member from the organization (no role-only revoke endpoint exists yet)"
                                                                        className="rounded-none text-xs font-medium h-8 px-3 text-rose-600 hover:bg-rose-50"
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>

                    {/* By Role grouping */}
                    <TabsContent value="byRole" className="space-y-4">
                        {loading && users.length === 0 ? (
                            <div className="bg-white border border-zinc-200 rounded-none shadow-lg p-12 text-center">
                                <RefreshCw className="w-6 h-6 text-primary animate-spin mx-auto" />
                                <span className="text-xs text-zinc-500 mt-3 block">Loading...</span>
                            </div>
                        ) : groupedByRole.length === 0 ? (
                            <div className="bg-white border border-zinc-200 rounded-none shadow-lg p-12 text-center">
                                <span className="text-xs text-zinc-500">No bindings found.</span>
                            </div>
                        ) : (
                            groupedByRole.map(([roleName, roleUsers]) => (
                                <div key={roleName} className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                                    <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-primary" />
                                            <span className="text-sm font-semibold text-gray-900">
                                                {ROLE_DISPLAY_NAMES[roleName] || roleName}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded-none">
                                            {roleUsers.length} {roleUsers.length === 1 ? "user" : "users"}
                                        </span>
                                    </div>
                                    <div className="divide-y divide-zinc-100">
                                        {roleUsers.map((u) => (
                                            <div key={u.memberId} className="px-5 py-3 flex items-center justify-between hover:bg-primary/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-none flex items-center justify-center font-semibold text-xs">
                                                        {(u.name || "?").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">{u.name}</div>
                                                        <div className="text-[10px] text-zinc-500">{u.email}</div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openAssign(u)}
                                                    className="rounded-none text-xs font-medium h-8 px-3 hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <UserCog size={12} className="mr-1.5" />
                                                    Manage
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Assign role dialog */}
            <Dialog open={!!assignTarget} onOpenChange={(open) => !open && closeAssign()}>
                <DialogContent className="rounded-none border-zinc-200 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold flex items-center gap-2">
                            <UserCheck size={16} className="text-primary" />
                            {assignTarget?.role ? "Change Role" : "Assign Role"}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            Updating <span className="font-semibold text-zinc-900">{assignTarget?.name}</span>'s role
                            takes effect immediately. They may need to refresh to see new modules.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Label className="text-xs font-medium text-zinc-600">Select role</Label>
                        <Select value={assignRoleId} onValueChange={setAssignRoleId}>
                            <SelectTrigger className="rounded-none h-10 text-xs">
                                <SelectValue placeholder="Pick from directory" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                {(orgRoles || []).length === 0 && (
                                    <div className="px-3 py-2 text-xs text-zinc-500">No roles available</div>
                                )}
                                {(orgRoles || []).map((r) => (
                                    <SelectItem key={r._id} value={r._id} className="text-xs font-medium">
                                        <div className="flex items-center gap-2">
                                            <Shield size={12} />
                                            <span>{r.name}</span>
                                            {r.isCustom && (
                                                <span className="text-[9px] font-medium px-1.5 py-0.5 bg-emerald-50 text-emerald-600">Custom</span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={closeAssign}
                            className="rounded-none border-zinc-200 text-xs h-8 px-4"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={submitAssign}
                            disabled={!assignRoleId || savingFor === assignTarget?.memberId}
                            className="rounded-none bg-primary hover:bg-primary/90 text-xs h-8 px-5 gap-2"
                        >
                            {savingFor === assignTarget?.memberId ? (
                                <>
                                    <Loader2 size={12} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <UserCheck size={12} />
                                    Confirm
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* New Assignment dialog — pick user + role together */}
            <Dialog
                open={newAssignOpen}
                onOpenChange={(open) => (open ? setNewAssignOpen(true) : closeNewAssign())}
            >
                <DialogContent className="rounded-none border-zinc-200 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base font-semibold flex items-center gap-2">
                            <Plus size={16} className="text-primary" />
                            New Role Assignment
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            Bind a role to an organization user. The change takes effect
                            immediately and resets any prior permission overrides.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-1">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-zinc-600 flex items-center gap-1.5">
                                <UserIcon size={12} /> User
                            </Label>
                            <Select value={newAssignUserId} onValueChange={setNewAssignUserId}>
                                <SelectTrigger className="rounded-none h-10 text-xs">
                                    <SelectValue placeholder="Select an organization user" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none max-h-[260px]">
                                    {usersForNewAssignment.length === 0 && (
                                        <div className="px-3 py-2 text-xs text-zinc-500">
                                            {roleFilter
                                                ? "All users already have this role"
                                                : "No org users available"}
                                        </div>
                                    )}
                                    {usersForNewAssignment.map((u) => (
                                        <SelectItem
                                            key={u.memberId}
                                            value={u.memberId}
                                            className="text-xs font-medium"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{u.name || "Unnamed"}</span>
                                                <span className="text-[10px] text-zinc-500">
                                                    {u.email} · current:{" "}
                                                    {u.role
                                                        ? ROLE_DISPLAY_NAMES[u.role] || u.role
                                                        : "Unassigned"}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-medium text-zinc-600 flex items-center gap-1.5">
                                <Shield size={12} /> Role
                            </Label>
                            <Select value={newAssignRoleId} onValueChange={setNewAssignRoleId}>
                                <SelectTrigger className="rounded-none h-10 text-xs">
                                    <SelectValue placeholder="Pick from directory" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none max-h-[260px]">
                                    {(orgRoles || []).length === 0 && (
                                        <div className="px-3 py-2 text-xs text-zinc-500">
                                            No roles available — create one first
                                        </div>
                                    )}
                                    {(orgRoles || []).map((r) => (
                                        <SelectItem
                                            key={r._id}
                                            value={r._id}
                                            className="text-xs font-medium"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Shield size={12} />
                                                <span>{r.name}</span>
                                                {r.isCustom && (
                                                    <span className="text-[9px] font-medium px-1.5 py-0.5 bg-emerald-50 text-emerald-600">
                                                        Custom
                                                    </span>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="text-[11px] leading-relaxed text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-none px-3 py-2">
                            <span className="font-semibold text-zinc-700">Heads up:</span>{" "}
                            Backend currently rejects assignment of <span className="font-semibold">SuperAdmin</span> and <span className="font-semibold">OrgAdmin</span>. If the user is the org creator, their own role can&apos;t be changed.
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={closeNewAssign}
                            className="rounded-none border-zinc-200 text-xs h-8 px-4"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={submitNewAssign}
                            disabled={!newAssignUserId || !newAssignRoleId || newAssignSaving}
                            className="rounded-none bg-primary hover:bg-primary/90 text-xs h-8 px-5 gap-2"
                        >
                            {newAssignSaving ? (
                                <>
                                    <Loader2 size={12} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <UserCheck size={12} />
                                    Create Assignment
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
