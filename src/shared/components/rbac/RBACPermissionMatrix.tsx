"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, LayoutGrid, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  MODULE_ACTION_CATALOG,
  MODULE_DISPLAY_NAMES,
  MODULE_GROUPS,
} from "@/shared/utils/module-permission-map"
import { getPermissionCatalog } from "@/hooks/roleNPermissionHooks"

export type PermissionEntry = { module: string; actions: string[] }

type ModuleDef = { id: string; name: string; actions: string[]; group: string }

// Build the static fallback catalog once from the central map.
// When backend exposes GET /role-permission/catalog this is replaced with live data.
const STATIC_MODULES: ModuleDef[] = Object.entries(MODULE_ACTION_CATALOG).map(
  ([id, actions]) => ({
    id,
    name: MODULE_DISPLAY_NAMES[id] || id,
    actions: actions as string[],
    group: MODULE_GROUPS[id] || "Other",
  })
)

interface RBACPermissionMatrixProps {
  value: PermissionEntry[]
  onChange: (next: PermissionEntry[]) => void
}

export function RBACPermissionMatrix({ value, onChange }: RBACPermissionMatrixProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [catalogModules, setCatalogModules] = useState<ModuleDef[] | null>(null)

  // Try to load the catalog from backend on mount.
  // If endpoint is missing (404 / null), STATIC_MODULES is used as fallback.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const catalog = await getPermissionCatalog()
        if (cancelled || !catalog || !Array.isArray(catalog.modules)) return
        const mapped: ModuleDef[] = catalog.modules.map((m: any) => ({
          id: m.id,
          name: m.name || MODULE_DISPLAY_NAMES[m.id] || m.id,
          actions: Array.isArray(m.actions) ? m.actions : [],
          group: m.group || MODULE_GROUPS[m.id] || "Other",
        }))
        setCatalogModules(mapped)
      } catch {
        // silent — fallback to static list
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Merge: prefer live catalog if loaded, otherwise use static; then fold in any
  // unknown modules referenced by current `value` so editing legacy roles works.
  const dynamicModules = useMemo(() => {
    const baseList = catalogModules ?? STATIC_MODULES
    const moduleMap = new Map<string, ModuleDef>()

    baseList.forEach((mod) => moduleMap.set(mod.id, mod))

    value.forEach((perm) => {
      if (!moduleMap.has(perm.module)) {
        const displayName = perm.module
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
        moduleMap.set(perm.module, {
          id: perm.module,
          name: displayName,
          actions: perm.actions,
          group: "Other",
        })
      } else {
        // If the role has actions outside the catalog, surface them so user can untick
        const existing = moduleMap.get(perm.module)!
        const allActions = new Set([...existing.actions, ...perm.actions])
        moduleMap.set(perm.module, {
          ...existing,
          actions: Array.from(allActions),
        })
      }
    })

    return Array.from(moduleMap.values())
  }, [value, catalogModules])

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

export { STATIC_MODULES as RBAC_MODULES }
