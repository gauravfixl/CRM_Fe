"use client"

import { Fragment, useState, useEffect, useMemo } from "react"
import {
  Search,
  Shield,
  Lock,
  ListTree,
  ChevronRight,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  Loader2,
  Save,
  Pencil,
  Undo2,
  Copy,
  Plus,
} from "lucide-react"
import SubHeader from "@/components/custom/SubHeader"
import { CustomButton } from "@/components/custom/CustomButton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import { decryptData } from "@/utils/crypto"
import { getAllRolesNPermissions, updateRole, addRole } from "@/hooks/roleNPermissionHooks"
import { ROLES, ROLE_SCOPE } from "@/shared/utils/module-permission-map"

interface PermissionAction {
  _id?: string
  module: string
  actions: string[]
}

interface Role {
  _id: string
  name: string
  roleName?: string
  description?: string
  isCustom?: boolean
  permissions: PermissionAction[]
  scope?: string
  userCount?: number
}

export default function PermissionSets() {
  const params = useParams()
  const router = useRouter()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [orgName, setOrgName] = useState("")

  // Matrix editor (inline edit mode)
  // - editMode === true → cells become clickable for custom roles
  // - draftPerms holds in-flight edits keyed by roleId; only diffs are saved
  const [editMode, setEditMode] = useState(false)
  const [draftPerms, setDraftPerms] = useState<Record<string, PermissionAction[]>>({})
  const [saving, setSaving] = useState(false)
  const [cloningRoleId, setCloningRoleId] = useState<string | null>(null)

  useEffect(() => {
    setOrgName((params.orgName as string) || localStorage.getItem("orgName") || "")
    fetchPermissions()
  }, [])

  const fetchPermissions = async () => {
    setLoading(true)
    try {
      // Send orgId so the backend includes this org's custom roles in the response.
      // Without orgId, only system (Global Baseline) roles are returned.
      const orgId =
        (typeof window !== "undefined" &&
          (localStorage.getItem("orgID") || localStorage.getItem("orgId"))) ||
        ""
      const scopeParams: { scope: "sc-org"; orgId?: string } = { scope: "sc-org" }
      if (orgId) scopeParams.orgId = orgId
      const response = await getAllRolesNPermissions(scopeParams)

      let rolesData: Role[] = []

      if (response?.data?.permissions && response?.data?.iv) {
        rolesData = decryptData(response.data.permissions, response.data.iv)
      } else if (response?.data?.roles) {
        rolesData = response.data.roles
      } else if (Array.isArray(response?.data)) {
        rolesData = response.data
      }

      // Normalize: some APIs return roleName instead of name
      rolesData = rolesData.map((role: any) => ({
        ...role,
        name: role.name || role.roleName || "Unnamed Role",
        permissions: Array.isArray(role.permissions) ? role.permissions : [],
      }))

      setRoles(rolesData)
    } catch (error) {
      console.error("Error fetching permissions:", error)
      toast.error("Failed to load permission matrix")
    } finally {
      setLoading(false)
    }
  }

  // Collect all unique modules and actions across all roles
  const { allModules, moduleActions } = useMemo(() => {
    const moduleMap = new Map<string, Set<string>>()

    roles.forEach((role) => {
      role.permissions?.forEach((perm) => {
        if (!moduleMap.has(perm.module)) {
          moduleMap.set(perm.module, new Set())
        }
        perm.actions?.forEach((action) => {
          moduleMap.get(perm.module)!.add(action)
        })
      })
    })

    const allModules = Array.from(moduleMap.keys()).sort()
    const moduleActions: Record<string, string[]> = {}
    allModules.forEach((mod) => {
      moduleActions[mod] = Array.from(moduleMap.get(mod)!).sort()
    })

    return { allModules, moduleActions }
  }, [roles])

  // Filter roles by search query
  const filteredRoles = useMemo(() => {
    if (!searchQuery) return roles
    const q = searchQuery.toLowerCase()
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(q) ||
        (role.description && role.description.toLowerCase().includes(q))
    )
  }, [roles, searchQuery])

  // Resolve the permissions to display for a role: draft (if editing) else saved.
  const getRolePerms = (role: Role): PermissionAction[] => {
    if (editMode && draftPerms[role._id]) return draftPerms[role._id]
    return role.permissions || []
  }

  // Check if a role has a specific action for a module
  const hasAction = (role: Role, module: string, action: string): boolean => {
    const perm = getRolePerms(role).find((p) => p.module === module)
    return perm?.actions?.includes(action) ?? false
  }

  const enterEditMode = () => {
    // Deep-clone current permissions into draft; we never mutate `roles` directly.
    const draft: Record<string, PermissionAction[]> = {}
    roles.forEach((r) => {
      draft[r._id] = (r.permissions || []).map((p) => ({
        module: p.module,
        actions: [...(p.actions || [])],
      }))
    })
    setDraftPerms(draft)
    setEditMode(true)
  }

  const exitEditMode = () => {
    setEditMode(false)
    setDraftPerms({})
  }

  const toggleAction = (role: Role, module: string, action: string) => {
    if (!role.isCustom) {
      toast.info("System roles can't be edited. Create a custom role to override.")
      return
    }
    setDraftPerms((prev) => {
      const current = prev[role._id] || []
      const moduleEntry = current.find((p) => p.module === module)
      let next: PermissionAction[]
      if (!moduleEntry) {
        next = [...current, { module, actions: [action] }]
      } else {
        const has = moduleEntry.actions.includes(action)
        const newActions = has
          ? moduleEntry.actions.filter((a) => a !== action)
          : [...moduleEntry.actions, action]
        next = current
          .map((p) => (p.module === module ? { ...p, actions: newActions } : p))
          .filter((p) => p.actions.length > 0) // drop empty modules
      }
      return { ...prev, [role._id]: next }
    })
  }

  // Roles whose draft != original. System roles excluded (backend rejects updates anyway).
  const changedRoles = useMemo(() => {
    if (!editMode) return [] as Role[]
    return roles.filter((r) => {
      if (!r.isCustom) return false
      const original = JSON.stringify(
        (r.permissions || [])
          .map((p) => ({ module: p.module, actions: [...(p.actions || [])].sort() }))
          .sort((a, b) => a.module.localeCompare(b.module))
      )
      const draft = JSON.stringify(
        (draftPerms[r._id] || [])
          .map((p) => ({ module: p.module, actions: [...(p.actions || [])].sort() }))
          .sort((a, b) => a.module.localeCompare(b.module))
      )
      return original !== draft
    })
  }, [editMode, roles, draftPerms])

  // Clone a system role into a fresh editable custom role.
  // The cloned role keeps the same permissions but gets isCustom: true and
  // a name like "OrgAdmin (Copy)". Backend's createCustomRolePermission
  // accepts our ORG_CUSTOM slug + sc-org scope.
  const cloneRoleAsCustom = async (source: Role) => {
    setCloningRoleId(source._id)
    try {
      const orgId =
        (typeof window !== "undefined" &&
          (localStorage.getItem("orgID") || localStorage.getItem("orgId"))) ||
        undefined
      const cloneName = `${source.name} (Copy)`
      const payload: any = {
        role: ROLES.ORG_CUSTOM,
        name: cloneName,
        scope: ROLE_SCOPE.ORGANIZATION,
        description: `Editable copy of system role "${source.name}"`,
        permissions: (source.permissions || []).map((p) => ({
          module: p.module,
          actions: [...(p.actions || [])],
        })),
        isCustom: true,
      }
      if (orgId) payload.orgId = orgId
      await addRole(payload)
      toast.success(`Cloned "${source.name}" → "${cloneName}". You can now edit the copy.`)
      await fetchPermissions()
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to clone role")
    } finally {
      setCloningRoleId(null)
    }
  }

  const saveChanges = async () => {
    if (changedRoles.length === 0) {
      toast.info("No changes to save")
      return
    }
    setSaving(true)
    try {
      const results = await Promise.allSettled(
        changedRoles.map((r) =>
          updateRole({ permissions: draftPerms[r._id] || [] }, r._id)
        )
      )
      const failed = results.filter((r) => r.status === "rejected").length
      const ok = results.length - failed
      if (failed === 0) {
        toast.success(`Saved ${ok} ${ok === 1 ? "role" : "roles"}`)
      } else if (ok === 0) {
        toast.error(`All ${failed} updates failed — check permissions`)
      } else {
        toast.warning(`Saved ${ok}, ${failed} failed`)
      }
      await fetchPermissions() // re-pull fresh state from backend
      setEditMode(false)
      setDraftPerms({})
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const customRolesCount = useMemo(
    () => roles.filter((r) => r.isCustom).length,
    [roles]
  )

  const stats = {
    totalRoles: roles.length,
    totalModules: allModules.length,
    totalActions: Object.values(moduleActions).reduce((sum, actions) => sum + actions.length, 0),
  }

  return (
    <div className="relative min-h-screen bg-[#F8F9FC] font-outfit">
      <SubHeader
        title="Permission Matrix"
        breadcrumbItems={[
          { label: "Identity & Access", href: "#" },
          { label: "Access Management", href: "#" },
          { label: "Permission Matrix", href: "#" },
        ]}
        rightControls={
          <div className="flex gap-2">
            <CustomButton
              variant="outline"
              size="sm"
              onClick={fetchPermissions}
              className="bg-white border-zinc-200 rounded-lg h-10 px-4"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh Matrix
            </CustomButton>
          </div>
        }
      />

      <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-primary/70 to-primary text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-xs opacity-80">Total Roles</p>
                <p className="text-white text-xl font-semibold mt-1">{stats.totalRoles}</p>
                <p className="text-white text-[10px] mt-1 opacity-70">In permission matrix</p>
              </div>
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="border bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">Modules</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.totalModules}</p>
                <p className="text-[10px] text-gray-400 mt-1">Unique modules tracked</p>
              </div>
              <ListTree className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <div className="border bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs">Action Types</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{stats.totalActions}</p>
                <p className="text-[10px] text-gray-400 mt-1">Distinct permission actions</p>
              </div>
              <Lock className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <ListTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Permission Matrix Overview</h3>
              <p className="text-[10px] text-zinc-400 font-medium">
                Read-only view of role-to-module access mappings
              </p>
            </div>
          </div>
          <div className="relative md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-4 h-14 bg-white border-zinc-200 rounded-lg shadow-sm focus:ring-blue-500/10"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white border border-zinc-200 rounded-xl shadow-xl p-16 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm text-zinc-500 font-medium">Loading permission matrix...</p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl shadow-xl p-16 flex flex-col items-center justify-center gap-4">
            <Shield className="w-8 h-8 text-zinc-300" />
            <p className="text-sm text-zinc-400 font-medium">
              {searchQuery ? "No roles match your search" : "No roles found in the directory"}
            </p>
          </div>
        ) : (
          <>
            {/* Summary Table */}
            <div className="bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-900">Role Summary</h3>
                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                  Overview of modules and actions per role
                </p>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-zinc-50/50 border-b border-zinc-100 hover:bg-transparent">
                      <TableHead className="p-4 text-xs font-semibold text-gray-500">Role</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500">Type</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500 text-center">Modules</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500 text-center">Total Actions</TableHead>
                      <TableHead className="p-4 text-xs font-semibold text-gray-500">Module Breakdown</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-zinc-50">
                    {filteredRoles.map((role) => {
                      const moduleCount = role.permissions?.length || 0
                      const totalActions = role.permissions?.reduce(
                        (sum, p) => sum + (p.actions?.length || 0),
                        0
                      ) || 0
                      return (
                        <TableRow key={role._id} className="hover:bg-indigo-50/10 transition-all">
                          <TableCell className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                <Shield className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-sm font-semibold text-gray-900">{role.name}</span>
                                <p className="text-[10px] text-zinc-400 font-medium truncate max-w-[200px]">
                                  {role.description || "No description"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="p-4">
                            <Badge
                              className={`border-0 text-xs font-medium px-3 py-1 rounded-full ${
                                role.isCustom
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-zinc-100 text-zinc-500"
                              }`}
                            >
                              {role.isCustom ? "Custom" : "System"}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-4 text-center">
                            <span className="text-sm font-semibold text-zinc-700">{moduleCount}</span>
                          </TableCell>
                          <TableCell className="p-4 text-center">
                            <span className="text-sm font-semibold text-zinc-700">{totalActions}</span>
                          </TableCell>
                          <TableCell className="p-4">
                            <div className="flex flex-wrap gap-1.5">
                              {role.permissions?.slice(0, 4).map((perm) => (
                                <Badge
                                  key={perm._id || perm.module}
                                  variant="outline"
                                  className="border-zinc-200 text-[10px] font-medium px-2 py-0.5 rounded-full"
                                >
                                  {perm.module} ({perm.actions?.length || 0})
                                </Badge>
                              ))}
                              {(role.permissions?.length || 0) > 4 && (
                                <Badge
                                  variant="outline"
                                  className="border-zinc-200 text-[10px] font-medium px-2 py-0.5 rounded-full"
                                >
                                  +{(role.permissions?.length || 0) - 4} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Detailed Permission Matrix */}
            {allModules.length > 0 && (
              <div className="bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Detailed Permission Matrix</h3>
                    <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                      Module-level action breakdown per role
                    </p>
                  </div>
                  <CustomButton
                    className="rounded-lg bg-primary text-white px-6 font-semibold text-xs h-10"
                    onClick={() => toast.info("Matrix editor coming soon")}
                  >
                    Open Matrix Editor <ChevronRight className="ml-2 w-4 h-4" />
                  </CustomButton>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-zinc-50/50 border-b border-zinc-100 hover:bg-transparent">
                        <TableHead className="p-4 text-xs font-semibold text-gray-500 sticky left-0 bg-zinc-50/50 z-10 min-w-[160px]">
                          Module / Action
                        </TableHead>
                        {filteredRoles.map((role) => (
                          <TableHead
                            key={role._id}
                            className="p-4 text-xs font-semibold text-gray-500 text-center min-w-[120px]"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span>{role.name}</span>
                              <Badge
                                className={`border-0 text-[9px] font-medium px-2 py-0 rounded-full ${
                                  role.isCustom
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-zinc-100 text-zinc-500"
                                }`}
                              >
                                {role.isCustom ? "Custom" : "System"}
                              </Badge>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allModules.map((module) => (
                        <Fragment key={`module-group-${module}`}>
                          {/* Module header row */}
                          <TableRow
                            key={`module-${module}`}
                            className="bg-indigo-50/30 border-t border-zinc-100 hover:bg-indigo-50/50"
                          >
                            <TableCell className="p-4 sticky left-0 bg-indigo-50/30 z-10">
                              <div className="flex items-center gap-2">
                                <ListTree className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="text-xs font-semibold text-indigo-700">{module}</span>
                              </div>
                            </TableCell>
                            {filteredRoles.map((role) => {
                              const perm = role.permissions?.find((p) => p.module === module)
                              return (
                                <TableCell
                                  key={`${role._id}-${module}-header`}
                                  className="p-4 text-center"
                                >
                                  <Badge
                                    variant="outline"
                                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                      perm
                                        ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                                        : "border-zinc-200 text-zinc-400"
                                    }`}
                                  >
                                    {perm ? `${perm.actions?.length || 0} actions` : "No access"}
                                  </Badge>
                                </TableCell>
                              )
                            })}
                          </TableRow>
                          {/* Action rows for this module */}
                          {moduleActions[module].map((action) => (
                            <TableRow
                              key={`${module}-${action}`}
                              className="hover:bg-zinc-50/50 transition-all border-b border-zinc-50"
                            >
                              <TableCell className="p-3 pl-10 sticky left-0 bg-white z-10">
                                <span className="text-xs text-zinc-600 font-medium">{action}</span>
                              </TableCell>
                              {filteredRoles.map((role) => (
                                <TableCell
                                  key={`${role._id}-${module}-${action}`}
                                  className="p-3 text-center"
                                >
                                  {hasAction(role, module, action) ? (
                                    <div className="flex items-center justify-center">
                                      <div className="h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <Check className="w-3.5 h-3.5" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center">
                                      <div className="h-6 w-6 rounded-full bg-zinc-50 text-zinc-300 flex items-center justify-center">
                                        <X className="w-3.5 h-3.5" />
                                      </div>
                                    </div>
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Governance Alert */}
        <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <h6 className="text-sm font-semibold text-indigo-900">Access Governance Policy Active</h6>
            <p className="text-xs text-indigo-700/80 leading-relaxed font-medium">
              This matrix provides a read-only overview of all role permissions across the organization.
              To modify permissions, navigate to the specific role&apos;s edit page from the Roles &amp; Permissions section.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
