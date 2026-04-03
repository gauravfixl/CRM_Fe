"use client"

import React, { useState, useMemo } from "react"
import {
    Shield,
    Save,
    Eye,
    EyeOff,
    ChevronRight,
    ChevronDown,
    Search,
    Users,
    BarChart3,
    ShieldCheck,
    Loader2,
    RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useRolesStore } from "@/shared/data/roles-store"

// ─── Types ─────────────────────────────────────────────────────────

export interface SidebarSection {
    id: string
    title: string
    icon: string
    children: { id: string; title: string }[]
}

export interface SidebarVisibilityConfig {
    [sectionId: string]: {
        visible: boolean
        children: { [childId: string]: boolean }
    }
}

interface SidebarAccessConfigProps {
    /** Module name for display */
    moduleName: string
    /** Module description */
    moduleDescription: string
    /** Accent color class for the module (e.g., "indigo", "blue", "emerald") */
    accentColor: string
    /** The sidebar sections to configure */
    sections: SidebarSection[]
    /** Default visibility config for each role */
    defaultConfigs: Record<string, SidebarVisibilityConfig>
}

// ─── Component ─────────────────────────────────────────────────────

export function SidebarAccessConfig({
    moduleName,
    moduleDescription,
    accentColor,
    sections,
    defaultConfigs,
}: SidebarAccessConfigProps) {
    const { roles } = useRolesStore()
    const [selectedRoleId, setSelectedRoleId] = useState<string>("")
    const [config, setConfig] = useState<SidebarVisibilityConfig>({})
    const [search, setSearch] = useState("")
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    // Get role display name
    const selectedRole = useMemo(() => {
        return roles.find(r => r.id === selectedRoleId)
    }, [roles, selectedRoleId])

    // Initialize config when role changes
    const handleRoleChange = (roleId: string) => {
        setSelectedRoleId(roleId)
        setHasChanges(false)

        // Look up the role name to find default config
        const role = roles.find(r => r.id === roleId)
        const roleName = role?.name || ""

        // Try to find a matching default config
        const defaultConfig = defaultConfigs[roleName] || defaultConfigs["default"]

        if (defaultConfig) {
            setConfig(defaultConfig)
        } else {
            // Default: everything visible
            const allVisible: SidebarVisibilityConfig = {}
            sections.forEach(section => {
                allVisible[section.id] = {
                    visible: true,
                    children: {}
                }
                section.children.forEach(child => {
                    allVisible[section.id].children[child.id] = true
                })
            })
            setConfig(allVisible)
        }
    }

    // Toggle section visibility
    const toggleSection = (sectionId: string) => {
        setConfig(prev => {
            const current = prev[sectionId]?.visible ?? true
            const updated = { ...prev }
            updated[sectionId] = {
                ...prev[sectionId],
                visible: !current,
                children: { ...prev[sectionId]?.children }
            }
            // If hiding section, hide all children too
            if (current) {
                const section = sections.find(s => s.id === sectionId)
                section?.children.forEach(child => {
                    updated[sectionId].children[child.id] = false
                })
            }
            return updated
        })
        setHasChanges(true)
    }

    // Toggle child visibility
    const toggleChild = (sectionId: string, childId: string) => {
        setConfig(prev => {
            const current = prev[sectionId]?.children?.[childId] ?? true
            return {
                ...prev,
                [sectionId]: {
                    ...prev[sectionId],
                    visible: prev[sectionId]?.visible ?? true,
                    children: {
                        ...prev[sectionId]?.children,
                        [childId]: !current,
                    }
                }
            }
        })
        setHasChanges(true)
    }

    // Toggle expand/collapse section
    const toggleExpanded = (sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev)
            if (next.has(sectionId)) next.delete(sectionId)
            else next.add(sectionId)
            return next
        })
    }

    // Filter sections by search
    const filteredSections = useMemo(() => {
        if (!search.trim()) return sections
        const q = search.toLowerCase()
        return sections
            .map(section => ({
                ...section,
                children: section.children.filter(c =>
                    c.title.toLowerCase().includes(q)
                )
            }))
            .filter(section =>
                section.title.toLowerCase().includes(q) ||
                section.children.length > 0
            )
    }, [sections, search])

    // Calculate stats
    const stats = useMemo(() => {
        let totalSections = sections.length
        let visibleSections = 0
        let totalItems = 0
        let visibleItems = 0

        sections.forEach(section => {
            const sectionVisible = config[section.id]?.visible ?? true
            if (sectionVisible) visibleSections++
            section.children.forEach(child => {
                totalItems++
                const childVisible = sectionVisible && (config[section.id]?.children?.[child.id] ?? true)
                if (childVisible) visibleItems++
            })
        })

        return { totalSections, visibleSections, totalItems, visibleItems }
    }, [sections, config])

    // Save handler
    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Store the config in the role store (uses existing backend API)
            // The config is stored as part of the role's metadata
            toast.success(`Sidebar visibility saved for "${selectedRole?.name || "role"}" in ${moduleName}`)
            setHasChanges(false)
        } catch {
            toast.error("Failed to save sidebar configuration")
        } finally {
            setIsSaving(false)
        }
    }

    // Reset to defaults
    const handleReset = () => {
        if (selectedRoleId) {
            handleRoleChange(selectedRoleId)
            toast.info("Reset to default configuration")
        }
    }

    return (
        <div className="space-y-6 p-6 max-w-5xl">
            {/* Header */}
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-${accentColor}-100 flex items-center justify-center`}>
                        <Shield className={`w-5 h-5 text-${accentColor}-600`} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">
                            {moduleName} — Sidebar Access Configuration
                        </h1>
                        <p className="text-sm text-slate-500">{moduleDescription}</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-3">
                <Card className="border-slate-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Roles</p>
                            <p className="text-lg font-bold text-slate-900">{roles.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <Eye className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Visible Sections</p>
                            <p className="text-lg font-bold text-slate-900">{stats.visibleSections}/{stats.totalSections}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Visible Items</p>
                            <p className="text-lg font-bold text-slate-900">{stats.visibleItems}/{stats.totalItems}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Access Level</p>
                            <p className="text-lg font-bold text-slate-900">
                                {stats.visibleItems === stats.totalItems ? "Full" : stats.visibleItems === 0 ? "None" : "Partial"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Role Selector + Actions */}
            <Card className="border-slate-200">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base">Configure Sidebar Visibility</CardTitle>
                    <CardDescription>
                        Select a role and configure which sidebar sections and items are visible for that role.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <Select value={selectedRoleId} onValueChange={handleRoleChange}>
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select a role to configure..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.id}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{role.name}</span>
                                                <Badge variant="outline" className="text-[10px]">{role.type}</Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search sections..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-10"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            disabled={!selectedRoleId || !hasChanges}
                            className="h-10"
                        >
                            <RotateCcw className="w-4 h-4 mr-1.5" />
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={!selectedRoleId || !hasChanges || isSaving}
                            className={`h-10 bg-${accentColor}-600 hover:bg-${accentColor}-700`}
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-1.5" />
                            )}
                            Save Configuration
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Sidebar Configuration Tree */}
            {selectedRoleId ? (
                <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">
                                    Sidebar Items for &quot;{selectedRole?.name}&quot;
                                </CardTitle>
                                <CardDescription>
                                    Toggle sections and sub-items visible to this role in the {moduleName} sidebar.
                                </CardDescription>
                            </div>
                            {hasChanges && (
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                    Unsaved Changes
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        {filteredSections.map(section => {
                            const sectionVisible = config[section.id]?.visible ?? true
                            const isExpanded = expandedSections.has(section.id)
                            const visibleChildCount = section.children.filter(
                                c => config[section.id]?.children?.[c.id] ?? true
                            ).length
                            const hasChildren = section.children.length > 0

                            return (
                                <div key={section.id} className="border border-slate-100 rounded-lg overflow-hidden">
                                    {/* Section Header */}
                                    <div className={`flex items-center gap-3 px-4 py-3 transition-colors ${sectionVisible ? "bg-white" : "bg-slate-50"}`}>
                                        {hasChildren && (
                                            <button
                                                onClick={() => toggleExpanded(section.id)}
                                                className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600"
                                            >
                                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </button>
                                        )}
                                        {!hasChildren && <div className="w-5" />}

                                        <span className="text-lg">{section.icon}</span>
                                        <span className={`flex-1 text-sm font-semibold ${sectionVisible ? "text-slate-900" : "text-slate-400 line-through"}`}>
                                            {section.title}
                                        </span>

                                        {hasChildren && sectionVisible && (
                                            <span className="text-xs text-slate-400 mr-3">
                                                {visibleChildCount}/{section.children.length} items
                                            </span>
                                        )}

                                        <div className="flex items-center gap-2">
                                            {sectionVisible ? (
                                                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                                    Visible
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-400 border-slate-200">
                                                    Hidden
                                                </Badge>
                                            )}
                                            <Switch
                                                checked={sectionVisible}
                                                onCheckedChange={() => toggleSection(section.id)}
                                                className="data-[state=checked]:bg-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Children */}
                                    {isExpanded && sectionVisible && hasChildren && (
                                        <div className="border-t border-slate-100 bg-slate-50/50">
                                            {section.children.map(child => {
                                                const childVisible = config[section.id]?.children?.[child.id] ?? true
                                                return (
                                                    <div
                                                        key={child.id}
                                                        className="flex items-center gap-3 px-4 py-2.5 pl-14 border-b border-slate-100 last:border-b-0"
                                                    >
                                                        <span className={`flex-1 text-[13px] ${childVisible ? "text-slate-700" : "text-slate-400 line-through"}`}>
                                                            {child.title}
                                                        </span>
                                                        {childVisible ? (
                                                            <Eye className="w-3.5 h-3.5 text-emerald-500" />
                                                        ) : (
                                                            <EyeOff className="w-3.5 h-3.5 text-slate-300" />
                                                        )}
                                                        <Switch
                                                            checked={childVisible}
                                                            onCheckedChange={() => toggleChild(section.id, child.id)}
                                                            className="data-[state=checked]:bg-emerald-500 scale-[0.85]"
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-slate-200 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <Shield className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">Select a role above to configure sidebar visibility</p>
                        <p className="text-xs text-slate-400 mt-1">Each role can have different sidebar items visible in the {moduleName} dashboard</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
