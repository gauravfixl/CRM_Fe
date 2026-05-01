"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
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
} from "lucide-react"
import { Fragment } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { toast } from "sonner"
import { useParams } from "next/navigation"
import { decryptData } from "@/utils/crypto"
import { getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks"
import { useCachedFetch } from "@/lib/swrCache"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [orgName, setOrgName] = useState("")

  useEffect(() => {
    setOrgName((params.orgName as string) || localStorage.getItem("orgName") || "")
  }, [params.orgName])

  const fetchPermissions = useCallback(async (): Promise<Role[]> => {
    const scopeParams = { scope: "sc-org" as const }
    const response = await getAllRolesNPermissions(scopeParams)

    let rolesData: Role[] = []
    if (response?.data?.permissions && response?.data?.iv) {
      rolesData = decryptData(response.data.permissions, response.data.iv) || []
    } else if (response?.data?.roles) {
      rolesData = response.data.roles
    } else if (Array.isArray(response?.data)) {
      rolesData = response.data
    }

    return rolesData.map((role: any) => ({
      ...role,
      name: role.name || role.roleName || "Unnamed Role",
      permissions: Array.isArray(role.permissions) ? role.permissions : [],
    }))
  }, [])

  const {
    data: rolesData,
    loading,
    error,
    refetch: fetchPermissionsRefetch,
  } = useCachedFetch<Role[]>("roles:org:permissions-matrix", fetchPermissions)

  const roles = rolesData ?? []
  const hasData = roles.length > 0

  // Toast only when the fetch fails AND we have nothing to show; otherwise the
  // user sees stale-but-usable cached data and a silent background retry.
  const lastErrorToast = useRef<string | null>(null)
  useEffect(() => {
    if (!error || hasData) return
    if (lastErrorToast.current === error) return
    lastErrorToast.current = error
    toast.error("Failed to load permission matrix")
  }, [error, hasData])

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

  const filteredRoles = useMemo(() => {
    if (!searchQuery) return roles
    const q = searchQuery.toLowerCase()
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(q) ||
        (role.description && role.description.toLowerCase().includes(q))
    )
  }, [roles, searchQuery])

  const hasAction = (role: Role, module: string, action: string): boolean => {
    const perm = role.permissions?.find((p) => p.module === module)
    return perm?.actions?.includes(action) ?? false
  }

  const stats = {
    totalRoles: roles.length,
    totalModules: allModules.length,
    totalActions: Object.values(moduleActions).reduce((sum, actions) => sum + actions.length, 0),
  }

  const renderTypeBadge = (isCustom?: boolean) => (
    <div
      className={`inline-flex items-center gap-2 px-2 py-1 border rounded-none ${
        isCustom
          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
          : "bg-zinc-50 text-zinc-500 border-zinc-200"
      }`}
    >
      <span className="text-[10px] font-medium">{isCustom ? "Custom" : "System"}</span>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Permission Matrix</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Read-only overview of role-to-module permissions across the organization.
            </p>
          </div>
          <Button
            onClick={fetchPermissionsRefetch}
            disabled={loading}
            variant="outline"
            size="sm"
            className="rounded-none border-zinc-200 font-medium text-xs h-8 gap-1.5 px-4"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh Matrix
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
            <p className="text-white text-xs opacity-80">Total Roles</p>
            <p className="text-white text-xl font-semibold mt-1">{stats.totalRoles}</p>
            <p className="text-white text-[10px] mt-1 opacity-70">In permission matrix</p>
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
            <p className="text-zinc-500 text-xs">Modules</p>
            <p className="text-xl font-semibold text-zinc-900 mt-1">{stats.totalModules}</p>
            <p className="text-primary text-[10px] mt-1">Unique modules tracked</p>
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
            <p className="text-zinc-500 text-xs">Action Types</p>
            <p className="text-xl font-semibold text-zinc-900 mt-1">{stats.totalActions}</p>
            <p className="text-emerald-600 text-[10px] mt-1">Distinct permission actions</p>
          </div>

          <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
            <p className="text-zinc-500 text-xs">Mode</p>
            <p className="text-xl font-semibold text-zinc-900 mt-1">Read-only</p>
            <p className="text-zinc-400 text-[10px] mt-1">Edit from role page</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ListTree size={16} className="text-primary" />
              <h3 className="text-sm font-semibold text-gray-900">Permission Matrix Overview</h3>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <Input
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
              />
            </div>
          </div>

          {loading && !hasData ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <p className="text-xs text-zinc-500 font-medium">Loading permission matrix...</p>
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-zinc-300" />
              <p className="text-sm text-zinc-500 font-medium">
                {error
                  ? error
                  : searchQuery
                    ? "No roles match your search"
                    : "No roles found in the directory"}
              </p>
              {error && !hasData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchPermissionsRefetch}
                  className="rounded-none border-zinc-200 text-xs font-medium h-8 px-3 mt-2"
                >
                  <RefreshCw size={12} className="mr-1.5" />
                  Retry
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100/50 border-b border-zinc-100">
                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Role</th>
                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Type</th>
                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Modules</th>
                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Total Actions</th>
                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Module Breakdown</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredRoles.map((role) => {
                    const moduleCount = role.permissions?.length || 0
                    const totalActions = role.permissions?.reduce((sum, p) => sum + (p.actions?.length || 0), 0) || 0
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
                        <td className="px-6 py-3">{renderTypeBadge(role.isCustom)}</td>
                        <td className="px-6 py-3 text-center">
                          <span className="text-sm font-semibold text-zinc-700">{moduleCount}</span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <span className="text-sm font-semibold text-zinc-700">{totalActions}</span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-wrap gap-1">
                            {role.permissions?.slice(0, 4).map((perm) => (
                              <span
                                key={perm._id || perm.module}
                                className="border border-zinc-200 bg-zinc-50 text-[10px] font-medium px-2 py-0.5 rounded-none text-zinc-700"
                              >
                                {perm.module} ({perm.actions?.length || 0})
                              </span>
                            ))}
                            {(role.permissions?.length || 0) > 4 && (
                              <span className="border border-zinc-200 bg-zinc-50 text-[10px] font-medium px-2 py-0.5 rounded-none text-zinc-700">
                                +{role.permissions.length - 4} more
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detailed Permission Matrix */}
        {allModules.length > 0 && filteredRoles.length > 0 && (
          <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTree size={16} className="text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Detailed Permission Matrix</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">Module-level action breakdown per role</p>
                </div>
              </div>
              <Button
                size="sm"
                className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-4"
                onClick={() => toast.info("Matrix editor coming soon")}
              >
                Open Matrix Editor
                <ChevronRight size={14} />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100/50 border-b border-zinc-100">
                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 sticky left-0 bg-zinc-100/50 z-10 min-w-[160px]">
                      Module / Action
                    </th>
                    {filteredRoles.map((role) => (
                      <th
                        key={role._id}
                        className="px-4 py-3 text-[11px] font-medium text-gray-500 text-center min-w-[120px]"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{role.name}</span>
                          <span
                            className={`text-[9px] font-medium px-2 py-0 rounded-none ${
                              role.isCustom
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : "bg-zinc-50 text-zinc-500 border border-zinc-200"
                            }`}
                          >
                            {role.isCustom ? "Custom" : "System"}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allModules.map((module) => (
                    <Fragment key={module}>
                      <tr className="bg-primary/5 border-t border-zinc-100">
                        <td className="px-6 py-3 sticky left-0 bg-primary/5 z-10">
                          <div className="flex items-center gap-2">
                            <ListTree className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-semibold text-primary">{module}</span>
                          </div>
                        </td>
                        {filteredRoles.map((role) => {
                          const perm = role.permissions?.find((p) => p.module === module)
                          return (
                            <td key={`${role._id}-${module}-header`} className="px-4 py-3 text-center">
                              <span
                                className={`text-[10px] font-medium px-2 py-0.5 rounded-none border ${
                                  perm
                                    ? "border-primary/20 bg-primary/10 text-primary"
                                    : "border-zinc-200 bg-zinc-50 text-zinc-400"
                                }`}
                              >
                                {perm ? `${perm.actions?.length || 0} actions` : "No access"}
                              </span>
                            </td>
                          )
                        })}
                      </tr>
                      {moduleActions[module].map((action) => (
                        <tr key={`${module}-${action}`} className="hover:bg-zinc-50/50 transition-colors border-b border-zinc-50">
                          <td className="px-6 py-2 pl-10 sticky left-0 bg-white z-10">
                            <span className="text-xs text-zinc-600 font-medium">{action}</span>
                          </td>
                          {filteredRoles.map((role) => (
                            <td key={`${role._id}-${module}-${action}`} className="px-4 py-2 text-center">
                              {hasAction(role, module, action) ? (
                                <div className="inline-flex items-center justify-center w-6 h-6 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none">
                                  <Check className="w-3 h-3" />
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-center w-6 h-6 bg-zinc-50 text-zinc-300 border border-zinc-200 rounded-none">
                                  <X className="w-3 h-3" />
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Governance Alert */}
        <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-none">
            <AlertCircle size={18} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Access Governance Policy Active</h3>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
              This matrix provides a read-only overview of all role permissions across the organization.
              To modify permissions, navigate to the specific role's edit page from the Roles &amp; Permissions section.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
