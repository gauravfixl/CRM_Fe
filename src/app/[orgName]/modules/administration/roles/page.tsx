"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users as UsersIcon,
  Shield,
  AlertCircle,
  ListTree,
  UserCheck,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Zap,
  History,
  MoreVertical,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { toast } from "sonner"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { decryptData } from "@/utils/crypto"
import {
  getAllRolesNPermissions,
  deleteRole,
  listOrgMembers,
} from "@/hooks/roleNPermissionHooks"
import useRolesStore from "@/lib/roleStore"
import { getRoles } from "@/hooks/userHooks"
import { useCachedFetch, invalidateCachePrefix } from "@/lib/swrCache"

type Member = { role?: string; roleName?: string; [k: string]: any }

export default function RolesAndPermissionsPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "roles"
  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchQuery, setSearchQuery] = useState("")
  const [orgName, setOrgName] = useState("")

  const orgRoles = useRolesStore((state) => state.roles?.organization) || []

  // Resolve orgId once, synchronously, so the three cache keys are stable
  // and multi-org users don't end up sharing a cached payload across orgs.
  const orgId =
    typeof window !== "undefined"
      ? localStorage.getItem("orgID") || localStorage.getItem("orgId") || ""
      : ""
  const cacheScope = orgId || "default"

  useEffect(() => {
    setOrgName((params.orgName as string) || localStorage.getItem("orgName") || "")
  }, [params.orgName])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) setActiveTab(tab)
  }, [searchParams])

  const fetchRoles = useCallback(async () => {
    const scopeParams: Record<string, string> = { scope: "sc-org" }
    if (orgId) scopeParams.orgId = orgId
    const res = await getAllRolesNPermissions(scopeParams)
    if (res?.data?.permissions && res?.data?.iv) {
      return (decryptData(res.data.permissions, res.data.iv) || []) as any[]
    }
    return [] as any[]
  }, [orgId])

  const fetchSimpleRoles = useCallback(async () => {
    const scopeParams: Record<string, string> = { scope: "sc-org" }
    if (orgId) scopeParams.orgId = orgId
    const res = await getRoles(scopeParams)
    if (res?.data?.roles && res?.data?.iv) {
      return (decryptData(res.data.roles, res.data.iv) || []) as any[]
    }
    return [] as any[]
  }, [orgId])

  const fetchMembers = useCallback(async (): Promise<Member[]> => {
    const res = await listOrgMembers({ page: 1, limit: 200 })
    const apiMembers = res?.data?.users ?? res?.data?.members ?? []
    return Array.isArray(apiMembers) ? apiMembers : []
  }, [])

  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles,
  } = useCachedFetch<any[]>(`roles:org:${cacheScope}:full`, fetchRoles)

  const { data: simpleRolesData, refetch: refetchSimpleRoles } = useCachedFetch<any[]>(
    `roles:org:${cacheScope}:simple`,
    fetchSimpleRoles,
  )

  const { data: membersData, refetch: refetchMembers } = useCachedFetch<Member[]>(
    `members:org:${cacheScope}:p1l200`,
    fetchMembers,
  )

  // Hydrate the shared zustand store from the cache hooks. Other pages already
  // read roles via useRolesStore — keep that contract intact.
  useEffect(() => {
    if (rolesData)
      useRolesStore.getState().setRoles((prev) => ({ ...prev, organization: rolesData }))
  }, [rolesData])

  useEffect(() => {
    if (simpleRolesData) useRolesStore.getState().setSimpleRoles(simpleRolesData)
  }, [simpleRolesData])

  const members: Member[] = membersData ?? []
  const loading = rolesLoading

  const lastErrorToast = useRef<string | null>(null)
  useEffect(() => {
    if (!rolesError || orgRoles.length > 0) return
    if (lastErrorToast.current === rolesError) return
    lastErrorToast.current = rolesError
    toast.error("Failed to load security directory")
  }, [rolesError, orgRoles.length])

  const fetchData = useCallback(async () => {
    await Promise.allSettled([refetchRoles(), refetchSimpleRoles(), refetchMembers()])
  }, [refetchRoles, refetchSimpleRoles, refetchMembers])

  // Compute live user count per role from member list (frontend-side join).
  // When backend includes `userCount` on roles, that is preferred.
  const userCountByRoleName = useMemo(() => {
    const map: Record<string, number> = {}
    members.forEach((m) => {
      const key = m.role || m.roleName || ""
      if (!key) return
      map[key] = (map[key] || 0) + 1
    })
    return map
  }, [members])

  const usersForRole = (role: any): number => {
    if (typeof role.userCount === "number") return role.userCount
    return userCountByRoleName[role.name] || userCountByRoleName[role.role] || 0
  }

  const filteredRoles = useMemo(() => {
    return orgRoles.filter(
      (role: any) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [orgRoles, searchQuery])

  const stats = {
    total: orgRoles.length,
    custom: orgRoles.filter((r: any) => r.isCustom).length,
    users: orgRoles.reduce((sum: number, r: any) => sum + (r.userCount || 0), 0),
  }

  const handleDeleteRole = async (roleId: string) => {
    try {
      await deleteRole(roleId)
      useRolesStore.getState().setRoles((prev) => ({
        ...prev,
        organization: prev.organization.filter((r: any) => r._id !== roleId),
      }))
      // Drop every cached roles payload so other tabs/pages re-read fresh on
      // next mount instead of showing the just-deleted role.
      invalidateCachePrefix("roles:org:")
      toast.success("Identity role purged from directory")
    } catch (error) {
      toast.error("Failed to release role")
    }
  }

  const renderClassificationBadge = (isCustom: boolean) => {
    if (isCustom) {
      return (
        <div className="inline-flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none">
          <span className="text-[10px] font-medium">Custom Extension</span>
        </div>
      )
    }
    return (
      <div className="inline-flex items-center gap-2 px-2 py-1 bg-zinc-50 text-zinc-500 border border-zinc-200 rounded-none">
        <span className="text-[10px] font-medium">Global Baseline</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Roles &amp; Permissions</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Govern identity roles, permission matrices, and assignments across the organization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="rounded-none border-zinc-200 font-medium text-xs h-8 gap-1.5 px-4"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Sync Access
            </Button>
            <Link href={`/${orgName}/modules/administration/roles/create`}>
              <Button
                size="sm"
                className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-5"
              >
                <ShieldCheck size={14} />
                Add Global Role
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards — compact density */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-primary/80 to-primary px-4 py-3 rounded-none shadow-md shadow-primary/20 text-white">
            <p className="text-white text-[11px] opacity-80">Total Identity Roles</p>
            <p className="text-white text-lg font-semibold mt-0.5 leading-tight">{stats.total}</p>
            <p className="text-white text-[10px] mt-0.5 opacity-70">Active in directory</p>
          </div>

          <div className="bg-white border border-zinc-200 px-4 py-3 rounded-none shadow-sm">
            <p className="text-zinc-500 text-[11px]">Custom Extensions</p>
            <p className="text-lg font-semibold text-zinc-900 mt-0.5 leading-tight">{stats.custom}</p>
            <p className="text-emerald-600 text-[10px] mt-0.5">Organization specific</p>
          </div>

          <div className="bg-white border border-zinc-200 px-4 py-3 rounded-none shadow-sm">
            <p className="text-zinc-500 text-[11px]">Scoped Users</p>
            <p className="text-lg font-semibold text-zinc-900 mt-0.5 leading-tight">{stats.users}</p>
            <p className="text-primary text-[10px] mt-0.5">Assigned identities</p>
          </div>

          <div className="bg-white border border-zinc-200 px-4 py-3 rounded-none shadow-sm">
            <p className="text-zinc-500 text-[11px]">Global Audit</p>
            <p className="text-lg font-semibold text-zinc-900 mt-0.5 leading-tight">Active</p>
            <p className="text-emerald-600 text-[10px] mt-0.5">Clean directory logs</p>
          </div>
        </div>

        {/* Tabs + search */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList className="bg-white p-1 rounded-none border border-zinc-200 h-10 shadow-sm">
              <TabsTrigger
                value="roles"
                className="rounded-none px-6 font-medium text-xs data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full"
              >
                Identity Roles
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="rounded-none px-6 font-medium text-xs data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full"
              >
                Permission Matrix
              </TabsTrigger>
              <TabsTrigger
                value="assignments"
                className="rounded-none px-6 font-medium text-xs data-[state=active]:bg-primary data-[state=active]:text-white transition-all h-full"
              >
                Assignments
              </TabsTrigger>
            </TabsList>

            <div className="relative md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <Input
                placeholder="Search security assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
              />
            </div>
          </div>

          <TabsContent value="roles" className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-100/50 border-b border-zinc-100">
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Role Definition</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Classification</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Active Bindings</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Access Scope</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {loading && orgRoles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <RefreshCw className="w-6 h-6 text-primary animate-spin" />
                            <p className="text-xs text-zinc-500 font-medium">Loading roles...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredRoles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Shield className="w-8 h-8 text-zinc-300" />
                            <p className="text-sm text-zinc-500 font-medium">
                              {rolesError && orgRoles.length === 0
                                ? rolesError
                                : searchQuery
                                  ? "No roles match your search"
                                  : "No roles found in the directory"}
                            </p>
                            {rolesError && orgRoles.length === 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchData}
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
                      filteredRoles.map((role: any) => (
                        <tr key={role._id} className="hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 bg-primary/10 text-primary rounded-none flex items-center justify-center">
                                <Shield className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                                <span className="text-[10px] font-medium text-zinc-500 max-w-xs truncate">
                                  {role.description || "Managed security container"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-3">{renderClassificationBadge(role.isCustom)}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <UsersIcon className="w-3.5 h-3.5 text-zinc-400" />
                              <span className="text-sm font-semibold text-zinc-700">{role.userCount || 0} Identities</span>
                            </div>
                          </td>
                          <td className="px-6 py-3">
                            <Sheet>
                              <SheetTrigger asChild>
                                <button className="flex items-center gap-2 group/btn">
                                  <span className="inline-flex items-center gap-2 px-2 py-1 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-none cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all text-[10px] font-medium">
                                    View {role.permissions.length} Permissions
                                  </span>
                                  <ChevronRight className="w-3 h-3 text-zinc-400 group-hover/btn:translate-x-1 transition-all" />
                                </button>
                              </SheetTrigger>
                              <SheetContent
                                side="right"
                                className="w-full sm:max-w-xl p-0 rounded-none border-l border-zinc-200 shadow-2xl flex flex-col"
                              >
                                {/* Header — gradient banner */}
                                <div className="p-6 bg-gradient-to-r from-primary/90 to-primary text-white relative shrink-0">
                                  <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                                    <Shield className="h-28 w-28" />
                                  </div>
                                  <SheetHeader className="relative z-10 text-left">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="bg-white/20 text-white border-0 rounded-none px-2 py-0.5 text-[10px] font-medium">
                                        Access Policy
                                      </span>
                                      <span className="text-xs text-white/70 font-medium">
                                        {role.isCustom ? "Custom" : "System"}
                                      </span>
                                    </div>
                                    <SheetTitle className="text-xl font-semibold text-white">
                                      {role.name}
                                    </SheetTitle>
                                    <SheetDescription className="text-white/80 font-medium text-xs leading-relaxed">
                                      {role.description || "No description provided"}
                                    </SheetDescription>
                                  </SheetHeader>
                                </div>

                                {/* Body — scrollable permission list */}
                                <div className="flex-1 overflow-y-auto p-6 bg-white">
                                  <div className="mb-4 flex items-center justify-between">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                                      Permission Modules
                                    </span>
                                    <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded-none">
                                      {role.permissions.length} {role.permissions.length === 1 ? "module" : "modules"}
                                    </span>
                                  </div>
                                  <div className="space-y-3">
                                    {role.permissions.map((perm: any) => (
                                      <div
                                        key={perm._id || perm.module}
                                        className="p-4 rounded-none border border-zinc-200 bg-zinc-50/50"
                                      >
                                        <div className="flex items-center justify-between mb-3">
                                          <h6 className="text-xs font-semibold text-primary">
                                            {perm.module}
                                          </h6>
                                          <span className="text-[10px] font-medium text-zinc-500 bg-white border border-zinc-200 px-1.5 py-0.5 rounded-none">
                                            {perm.actions?.length || 0} actions
                                          </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                          {perm.actions.map((action: string) => (
                                            <span
                                              key={action}
                                              className="bg-white border border-zinc-200 text-[10px] font-medium px-2 py-0.5 rounded-none text-zinc-700"
                                            >
                                              {action}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Footer */}
                                <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex justify-end shrink-0">
                                  <Button
                                    variant="outline"
                                    className="rounded-none border-zinc-200 font-medium text-xs h-8 px-4"
                                  >
                                    Audit Policy History
                                  </Button>
                                </div>
                              </SheetContent>
                            </Sheet>
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
                                {role.isCustom && (
                                  <>
                                    <DropdownMenuSeparator className="my-1" />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <button className="flex items-center gap-2 w-full text-xs font-medium p-2 text-rose-600 rounded-md cursor-pointer hover:bg-rose-50">
                                          <Trash2 size={13} />
                                          Delete
                                        </button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent className="rounded-none border-zinc-200">
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="text-base font-semibold">Purge Access Identity?</AlertDialogTitle>
                                          <AlertDialogDescription className="text-zinc-500 text-xs leading-relaxed">
                                            Deleting <span className="text-zinc-900 font-semibold">"{role.name}"</span> will immediately revoke all associated permissions from {role.userCount || 0} users. This action is recorded in the directory audit logs.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="gap-2 pt-4">
                                          <AlertDialogCancel className="rounded-none border-zinc-200 font-medium text-xs h-9">Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleDeleteRole(role._id)}
                                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-none font-medium text-xs h-9 px-6 border-0"
                                          >
                                            Purge Access
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
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
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-2">
                <ListTree size={16} className="text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Permission Matrix Overview</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">
                    View and edit role-to-module access mappings for each role
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-100/50 border-b border-zinc-100">
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Role</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Type</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Modules</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Total Actions</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Module Breakdown</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {orgRoles.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-xs text-zinc-400 font-medium">
                          No roles found in the directory
                        </td>
                      </tr>
                    ) : (
                      orgRoles.map((role: any) => {
                        const moduleCount = role.permissions?.length || 0
                        const totalActions = role.permissions?.reduce((sum: number, p: any) => sum + (p.actions?.length || 0), 0) || 0
                        return (
                          <tr key={role._id} className="hover:bg-primary/5 transition-colors">
                            <td className="px-6 py-3">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-primary/10 text-primary rounded-none flex items-center justify-center">
                                  <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-sm font-semibold text-gray-900 block">{role.name}</span>
                                  <span className="text-[10px] text-zinc-500 font-medium truncate max-w-[200px] block">
                                    {role.description || "No description"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-3">{renderClassificationBadge(role.isCustom)}</td>
                            <td className="px-6 py-3 text-center">
                              <span className="text-sm font-semibold text-zinc-700">{moduleCount}</span>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span className="text-sm font-semibold text-zinc-700">{totalActions}</span>
                            </td>
                            <td className="px-6 py-3">
                              <div className="flex flex-wrap gap-1">
                                {role.permissions?.slice(0, 4).map((perm: any) => (
                                  <span
                                    key={perm._id}
                                    className="border border-zinc-200 bg-zinc-50 text-[10px] font-medium px-2 py-0.5 rounded-none text-zinc-700"
                                  >
                                    {perm.module} ({perm.actions?.length || 0})
                                  </span>
                                ))}
                                {role.permissions?.length > 4 && (
                                  <span className="border border-zinc-200 bg-zinc-50 text-[10px] font-medium px-2 py-0.5 rounded-none text-zinc-700">
                                    +{role.permissions.length - 4} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-3 text-right">
                              <Link href={`/${orgName}/modules/administration/roles/${role._id}/edit`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-none border-zinc-200 text-xs font-medium h-8 px-3 gap-1.5 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                                >
                                  <Edit size={12} />
                                  Edit Matrix
                                </Button>
                              </Link>
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

          <TabsContent value="assignments" className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Role Assignments</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">Manage user-to-role bindings across the organization</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-4"
                  onClick={() => toast.info("Assignment workflow coming soon")}
                >
                  <Plus size={14} />
                  New Assignment
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-100/50 border-b border-zinc-100">
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Role Name</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Type</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Assigned Users</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Permissions</th>
                      <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {orgRoles.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-xs text-zinc-400 font-medium">
                          No roles found in the directory
                        </td>
                      </tr>
                    ) : (
                      orgRoles.map((role: any) => (
                        <tr key={role._id} className="hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 bg-primary/10 text-primary rounded-none flex items-center justify-center">
                                <Shield className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3">{renderClassificationBadge(role.isCustom)}</td>
                          <td className="px-6 py-3 text-center">
                            <div className="inline-flex items-center gap-1.5">
                              <UsersIcon className="w-3.5 h-3.5 text-zinc-400" />
                              <span className="text-sm font-semibold text-zinc-700">{role.userCount || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className="text-sm font-semibold text-zinc-700">{role.permissions?.length || 0}</span>
                          </td>
                          <td className="px-6 py-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-none border-zinc-200 text-xs font-medium h-8 px-3 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                              onClick={() => toast.info(`Manage assignments for "${role.name}" coming soon`)}
                            >
                              Manage
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Governance Alert */}
        <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-none">
            <AlertCircle size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Access Governance Policy Active</h3>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              Any modifications to "Global Baseline" roles will trigger a directory-wide access re-validation request for all assigned users.
              We recommend creating "Custom Extensions" for organization-specific permission overrides.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
