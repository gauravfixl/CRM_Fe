"use client"

import { useMemo, useState } from "react"
import { Check, LayoutGrid, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MODULES, PERMISSIONS } from "@/shared/utils/module-permission-map"

export type PermissionEntry = { module: string; actions: string[] }

type ModuleDef = { id: string; name: string; actions: string[]; group: string }

const moduleDisplayNames: Record<string, string> = {
  [MODULES.ORGANIZATION]: "Organization",
  [MODULES.FIRM]: "Firms",
  [MODULES.USER]: "Users",
  [MODULES.ROLE_PERMISSION]: "Roles & Permissions",
  [MODULES.LEAD]: "Leads",
  [MODULES.CLIENT]: "Clients",
  [MODULES.INVOICE]: "Billing & Invoices",
  [MODULES.TAX]: "Tax",
  [MODULES.DOCUMENT]: "Documents",
  [MODULES.REPORTS]: "Reports",
  [MODULES.PROJECT_MANAGEMENT]: "Project Management",
  [MODULES.HRM_MANAGEMENT]: "HRM",
  [MODULES.EMPLOYEE]: "Employees",
  [MODULES.ONBOARDING]: "Onboarding",
  [MODULES.ATTENDANCE]: "Attendance",
  [MODULES.SHIFT]: "Shifts",
  [MODULES.LEAVE]: "Leave",
  [MODULES.HOLIDAY]: "Holidays",
  [MODULES.PAYROLL]: "Payroll",
  [MODULES.POLICY]: "Policies",
  [MODULES.SETTINGS]: "Settings",
  [MODULES.PLATFORM]: "Platform",
}

const moduleGroup: Record<string, string> = {
  [MODULES.ORGANIZATION]: "Identity & Access",
  [MODULES.FIRM]: "Identity & Access",
  [MODULES.USER]: "Identity & Access",
  [MODULES.ROLE_PERMISSION]: "Identity & Access",
  [MODULES.PLATFORM]: "Identity & Access",

  [MODULES.LEAD]: "CRM",
  [MODULES.CLIENT]: "CRM",
  [MODULES.INVOICE]: "Finance",
  [MODULES.TAX]: "Finance",

  [MODULES.DOCUMENT]: "Documents & Reports",
  [MODULES.REPORTS]: "Documents & Reports",

  [MODULES.PROJECT_MANAGEMENT]: "Project Management",

  [MODULES.HRM_MANAGEMENT]: "Human Resources",
  [MODULES.EMPLOYEE]: "Human Resources",
  [MODULES.ONBOARDING]: "Human Resources",
  [MODULES.ATTENDANCE]: "Human Resources",
  [MODULES.SHIFT]: "Human Resources",
  [MODULES.LEAVE]: "Human Resources",
  [MODULES.HOLIDAY]: "Human Resources",
  [MODULES.PAYROLL]: "Human Resources",
  [MODULES.POLICY]: "Human Resources",
  [MODULES.SETTINGS]: "Human Resources",
}

// Derived from backend enums (module-permission-map.ts)
const MODULE_ACTION_MAP: Record<string, string[]> = {
  [MODULES.PLATFORM]: [
    PERMISSIONS.MANAGE_PLATFORM_SETTINGS,
    PERMISSIONS.MANAGE_SUBSCRIPTIONS,
    PERMISSIONS.VIEW_PLATFORM_ANALYTICS,
  ],
  [MODULES.ORGANIZATION]: [
    PERMISSIONS.CREATE_ORGANIZATION,
    PERMISSIONS.EDIT_ORGANIZATION,
    PERMISSIONS.DELETE_ORGANIZATION,
    PERMISSIONS.VIEW_ORG,
    PERMISSIONS.VIEW_ORG_ANALYTICS,
    PERMISSIONS.EXPORT_ORG_DATA,
    PERMISSIONS.MANAGE_ORG_SESSIONS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.MANAGE_AUDIT_LOGS,
    PERMISSIONS.MANAGE_SUBSCRIPTIONS,
  ],
  [MODULES.USER]: [
    PERMISSIONS.VIEW_USER,
    PERMISSIONS.VIEW_ALL_USERS,
    PERMISSIONS.VIEW_ORG_USER,
    PERMISSIONS.CREATE_USER,
    PERMISSIONS.UPDATE_ORG_USER,
    PERMISSIONS.DELETE_USER,
    PERMISSIONS.DELETE_ORG_USER,
    PERMISSIONS.SUSPEND_USER,
    PERMISSIONS.SEND_INVITATION,
  ],
  [MODULES.FIRM]: [
    PERMISSIONS.CREATE_FIRM,
    PERMISSIONS.EDIT_FIRM,
    PERMISSIONS.DELETE_FIRM,
    PERMISSIONS.VIEW_FIRM,
  ],
  [MODULES.ROLE_PERMISSION]: [
    PERMISSIONS.CREATE_ROLE,
    PERMISSIONS.EDIT_ROLE,
    PERMISSIONS.DELETE_ROLE,
    PERMISSIONS.VIEW_ROLE,
    PERMISSIONS.MANAGE_PERMISSIONS,
    PERMISSIONS.AUDIT_PERMISSIONS,
    PERMISSIONS.CHANGE_MEMBER_ROLE,
  ],
  [MODULES.LEAD]: [
    PERMISSIONS.CREATE_LEAD,
    PERMISSIONS.EDIT_LEAD,
    PERMISSIONS.DELETE_LEAD,
    PERMISSIONS.VIEW_LEAD,
    PERMISSIONS.ASSIGN_LEAD,
  ],
  [MODULES.CLIENT]: [
    PERMISSIONS.CREATE_CLIENT,
    PERMISSIONS.EDIT_CLIENT,
    PERMISSIONS.DELETE_CLIENT,
    PERMISSIONS.VIEW_CLIENT_LIST,
  ],
  [MODULES.INVOICE]: [
    PERMISSIONS.GENERATE_REPORT,
    PERMISSIONS.EXPORT_DATA,
  ],
  [MODULES.TAX]: [PERMISSIONS.GENERATE_REPORT, PERMISSIONS.EXPORT_DATA],
  [MODULES.DOCUMENT]: [
    PERMISSIONS.UPLOAD_DOCUMENT,
    PERMISSIONS.DOWNLOAD_DOCUMENT,
  ],
  [MODULES.REPORTS]: [
    PERMISSIONS.GENERATE_REPORT,
    PERMISSIONS.EXPORT_DATA,
  ],
  [MODULES.PROJECT_MANAGEMENT]: [
    PERMISSIONS.CREATE_PROJECT,
    PERMISSIONS.EDIT_PROJECT,
    PERMISSIONS.DELETE_PROJECT,
    PERMISSIONS.VIEW_PROJECT,
    PERMISSIONS.VIEW_ALL_PROJECT,
    PERMISSIONS.CREATE_TASK,
    PERMISSIONS.EDIT_TASK,
    PERMISSIONS.VIEW_TASK,
    PERMISSIONS.VIEW_ALL_TASKS,
    PERMISSIONS.CREATE_BOARD,
    PERMISSIONS.VIEW_BOARD,
    PERMISSIONS.VIEW_ALL_BOARD,
    PERMISSIONS.CREATE_WORKFLOW,
    PERMISSIONS.VIEW_WORKFLOW,
    PERMISSIONS.CREATE_TEAM,
    PERMISSIONS.VIEW_TEAM,
  ],
  [MODULES.HRM_MANAGEMENT]: [
    PERMISSIONS.CREATE_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
    PERMISSIONS.DELETE_EMPLOYEE,
    PERMISSIONS.VIEW_EMPLOYEE_PROFILE,
    PERMISSIONS.VIEW_ALL_EMPLOYEES,
    PERMISSIONS.CREATE_JOB_POSTING,
    PERMISSIONS.REVIEW_APPLICATIONS,
    PERMISSIONS.HIRE_CANDIDATE,
    PERMISSIONS.APPROVE_TIMESHEETS,
  ],
  [MODULES.EMPLOYEE]: [
    PERMISSIONS.VIEW_EMPLOYEE_PROFILE,
    PERMISSIONS.VIEW_ALL_EMPLOYEES,
  ],
  [MODULES.ONBOARDING]: [
    PERMISSIONS.CREATE_EMPLOYEE,
    PERMISSIONS.EDIT_EMPLOYEE,
  ],
  [MODULES.ATTENDANCE]: [PERMISSIONS.MANAGE_ATTENDANCE, PERMISSIONS.APPROVE_TIMESHEETS],
  [MODULES.LEAVE]: [PERMISSIONS.MANAGE_EMPLOYE_LEAVE],
  [MODULES.PAYROLL]: [PERMISSIONS.MANAGE_PAYROLL, PERMISSIONS.VIEW_PAYSLIPS],
  [MODULES.POLICY]: [PERMISSIONS.MANAGE_PAYROLL],
  [MODULES.SHIFT]: [PERMISSIONS.MANAGE_ATTENDANCE],
  [MODULES.HOLIDAY]: [PERMISSIONS.MANAGE_ATTENDANCE],
  [MODULES.SETTINGS]: [PERMISSIONS.EDIT_ORGANIZATION],
}

const ALL_MODULES: ModuleDef[] = Object.entries(MODULE_ACTION_MAP).map(
  ([id, actions]) => ({
    id,
    name: moduleDisplayNames[id] || id,
    actions,
    group: moduleGroup[id] || "Other",
  })
)

interface RBACPermissionMatrixProps {
  value: PermissionEntry[]
  onChange: (next: PermissionEntry[]) => void
}

export function RBACPermissionMatrix({ value, onChange }: RBACPermissionMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Build dynamic module list from both hardcoded modules AND backend data
  const dynamicModules = useMemo(() => {
    const moduleMap = new Map<string, ModuleDef>()

    // First, add all hardcoded modules
    ALL_MODULES.forEach(mod => {
      moduleMap.set(mod.id, mod)
    })

    // Then, add any modules from backend that aren't in our hardcoded list
    value.forEach(perm => {
      if (!moduleMap.has(perm.module)) {
        // Create a dynamic module definition for backend modules we don't know about
        const displayName = perm.module
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')

        moduleMap.set(perm.module, {
          id: perm.module,
          name: displayName,
          actions: perm.actions, // Use the actions from backend
          group: "Other",
        })
      } else {
        // If module exists in hardcoded list, merge actions from backend
        const existing = moduleMap.get(perm.module)!
        const allActions = new Set([...existing.actions, ...perm.actions])
        moduleMap.set(perm.module, {
          ...existing,
          actions: Array.from(allActions),
        })
      }
    })

    return Array.from(moduleMap.values())
  }, [value])

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return dynamicModules
    return dynamicModules.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.group.toLowerCase().includes(q)
    )
  }, [searchQuery, dynamicModules])

  const groupedModules = useMemo(() => {
    const groups: Record<string, ModuleDef[]> = {}
    filteredModules.forEach((m) => {
      if (!groups[m.group]) groups[m.group] = []
      groups[m.group].push(m)
    })
    return groups
  }, [filteredModules])

  const isActionSelected = (moduleId: string, action: string) =>
    Boolean(value.find((p) => p.module === moduleId)?.actions.includes(action))

  const toggleAction = (moduleId: string, action: string) => {
    const existing = value.find((p) => p.module === moduleId)
    if (!existing) {
      onChange([...value, { module: moduleId, actions: [action] }])
      return
    }
    const has = existing.actions.includes(action)
    const nextActions = has
      ? existing.actions.filter((a) => a !== action)
      : [...existing.actions, action]
    const next = value
      .map((p) => (p.module === moduleId ? { ...p, actions: nextActions } : p))
      .filter((p) => p.actions.length > 0)
    onChange(next)
  }

  const toggleAllForModule = (moduleId: string, actions: string[]) => {
    const existing = value.find((p) => p.module === moduleId)
    const isAll = existing && existing.actions.length === actions.length
    if (isAll) {
      onChange(value.filter((p) => p.module !== moduleId))
    } else {
      const others = value.filter((p) => p.module !== moduleId)
      onChange([...others, { module: moduleId, actions: [...actions] }])
    }
  }

  const totalSelectedActions = value.reduce((acc, p) => acc + p.actions.length, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 bg-white border border-zinc-200 p-2 rounded-xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search modules to configure permissions..."
            className="pl-11 border-none focus-visible:ring-0 rounded-lg h-9 bg-transparent font-medium"
          />
        </div>
        <Badge className="bg-zinc-100 text-zinc-600 rounded-full border-0 text-xs font-medium px-3 h-7">
          {filteredModules.length} modules
        </Badge>
        <Badge className="bg-indigo-50 text-indigo-700 rounded-full border-0 text-xs font-medium px-3 h-7">
          {totalSelectedActions} actions
        </Badge>
      </div>

      {Object.keys(groupedModules).length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center text-sm text-zinc-400 font-medium">
          No modules match your search.
        </div>
      ) : (
        Object.entries(groupedModules).map(([group, modules]) => (
          <div key={group} className="space-y-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 px-1">
              {group}
            </h3>
            <div className="space-y-3">
              {modules.map((module) => {
                const isModuleActive = value.some((p) => p.module === module.id)
                const selectedCount =
                  value.find((p) => p.module === module.id)?.actions.length || 0
                const isAllSelected = selectedCount === module.actions.length

                return (
                  <Card
                    key={module.id}
                    className={`bg-white border-zinc-200 rounded-xl shadow-sm transition-all overflow-hidden ${isModuleActive ? "border-l-4 border-l-indigo-600" : ""
                      }`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center border transition-colors ${isModuleActive
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white text-zinc-400 border-zinc-200"
                            }`}
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold">
                            {module.name}
                          </CardTitle>
                          <p className="text-[10px] font-medium text-gray-500">
                            {module.id} · {selectedCount}/{module.actions.length} actions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`all-${module.id}`}
                          checked={isAllSelected}
                          onCheckedChange={() =>
                            toggleAllForModule(module.id, module.actions)
                          }
                          className="rounded-sm border-zinc-300"
                        />
                        <Label
                          htmlFor={`all-${module.id}`}
                          className="text-xs font-medium text-gray-500 cursor-pointer"
                        >
                          Select All
                        </Label>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {module.actions.map((action) => {
                        const selected = isActionSelected(module.id, action)
                        return (
                          <button
                            type="button"
                            key={action}
                            onClick={() => toggleAction(module.id, action)}
                            className={`p-3 border rounded-lg cursor-pointer flex items-center gap-3 transition-all text-left ${selected
                              ? "bg-indigo-50 border-indigo-200"
                              : "bg-white border-zinc-100 hover:border-zinc-300"
                              }`}
                          >
                            <div
                              className={`h-4 w-4 rounded-sm border flex items-center justify-center shrink-0 transition-all ${selected
                                ? "bg-indigo-600 border-indigo-600"
                                : "bg-white border-zinc-300"
                                }`}
                            >
                              {selected && (
                                <Check className="w-3 h-3 text-white stroke-[3px]" />
                              )}
                            </div>
                            <span
                              className={`text-xs font-medium capitalize ${selected ? "text-indigo-900" : "text-zinc-600"
                                }`}
                            >
                              {action ? action.replaceAll("_", " ").toLowerCase() : ""}
                            </span>
                          </button>
                        )
                      })}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export { ALL_MODULES as RBAC_MODULES }
