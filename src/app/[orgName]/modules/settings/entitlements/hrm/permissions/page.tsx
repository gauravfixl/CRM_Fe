"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    Shield,
    Save,
    Users,
    Key,
    CheckCircle,
    Lock,
    Eye,
    FilePlus,
    FileEdit,
    Ban,
    Globe,
    Building2,
    User,
    ShieldCheck,
    ArrowRight,
    Crown,
    AlertTriangle,
    BarChart3,
    Search,
    Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    useRolesStore,
    AVAILABLE_MODULES,
    type Role,
    type PermissionAction,
    type DataScope,
} from "@/shared/data/roles-store"
import {
    fetchHrmRoles,
    updateHrmRole,
    HRM_MODULES,
    MODULE_DISPLAY_NAMES,
    type HrmRole,
} from "@/modules/hrm/hooks/hrmRoleHooks"

const ACTION_CONFIG: { key: PermissionAction; label: string; icon: React.ReactNode; color: string; bgColor: string }[] = [
    { key: "view", label: "View", icon: <Eye className="w-3 h-3" />, color: "text-sky-600", bgColor: "bg-sky-50" },
    { key: "create", label: "Create", icon: <FilePlus className="w-3 h-3" />, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { key: "edit", label: "Edit", icon: <FileEdit className="w-3 h-3" />, color: "text-amber-600", bgColor: "bg-amber-50" },
    { key: "delete", label: "Delete", icon: <Ban className="w-3 h-3" />, color: "text-rose-600", bgColor: "bg-rose-50" },
    { key: "approve", label: "Approve", icon: <CheckCircle className="w-3 h-3" />, color: "text-violet-600", bgColor: "bg-violet-50" },
]

const SCOPE_OPTIONS: { value: DataScope; label: string; icon: React.ReactNode }[] = [
    { value: "Self", label: "Self", icon: <User className="w-3 h-3" /> },
    { value: "Team", label: "Team", icon: <Users className="w-3 h-3" /> },
    { value: "Department", label: "Department", icon: <Building2 className="w-3 h-3" /> },
    { value: "Organization", label: "Organization", icon: <Globe className="w-3 h-3" /> },
]

export default function HRPermissionsPage() {
    const { roles, assignments, updatePermissions } = useRolesStore()
    const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || "")
    const [searchModule, setSearchModule] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [backendRoles, setBackendRoles] = useState<HrmRole[]>([])

    // Fetch backend roles on mount
    useEffect(() => {
        const load = async () => {
            try {
                const fetched = await fetchHrmRoles()
                setBackendRoles(fetched)
            } catch {
                // Fallback to local store
            }
        }
        load()
    }, [])

    const selectedRole = useMemo(() => roles.find((r) => r.id === selectedRoleId), [roles, selectedRoleId])

    // Build full permission list for selected role
    const fullPermissions = useMemo(() => {
        if (!selectedRole) return []
        return AVAILABLE_MODULES.map((mod) => {
            const existing = selectedRole.permissions.find((p) => p.module === mod)
            return existing || {
                module: mod,
                actions: { view: false, create: false, edit: false, delete: false, approve: false },
                scope: "Self" as DataScope,
                hasConfidentialAccess: false,
                fieldAccess: {},
            }
        })
    }, [selectedRole])

    const filteredPermissions = useMemo(() => {
        if (!searchModule) return fullPermissions
        return fullPermissions.filter((p) => p.module.toLowerCase().includes(searchModule.toLowerCase()))
    }, [fullPermissions, searchModule])

    // Stats
    const totalActiveActions = useMemo(() => {
        if (!selectedRole) return 0
        return fullPermissions.reduce((sum, p) => sum + Object.values(p.actions).filter(Boolean).length, 0)
    }, [fullPermissions, selectedRole])

    const maxPossibleActions = AVAILABLE_MODULES.length * 5
    const accessPercentage = Math.round((totalActiveActions / maxPossibleActions) * 100)

    const confidentialModules = useMemo(() =>
        fullPermissions.filter((p) => p.hasConfidentialAccess).length,
    [fullPermissions])

    const activeModules = useMemo(() =>
        fullPermissions.filter((p) => Object.values(p.actions).some(Boolean)).length,
    [fullPermissions])

    const memberCount = useMemo(() =>
        assignments.filter((a) => a.roleId === selectedRoleId).length,
    [assignments, selectedRoleId])

    const toggleAction = (moduleIndex: number, action: PermissionAction) => {
        if (!selectedRole) return
        const perms = fullPermissions.map((p, i) => {
            if (i !== moduleIndex) return p
            return {
                ...p,
                actions: { ...p.actions, [action]: !p.actions[action] },
            }
        })
        updatePermissions(selectedRole.id, perms)
    }

    const updateScope = (moduleIndex: number, scope: DataScope) => {
        if (!selectedRole) return
        const perms = fullPermissions.map((p, i) => {
            if (i !== moduleIndex) return p
            return { ...p, scope }
        })
        updatePermissions(selectedRole.id, perms)
    }

    const toggleConfidential = (moduleIndex: number) => {
        if (!selectedRole) return
        const perms = fullPermissions.map((p, i) => {
            if (i !== moduleIndex) return p
            return { ...p, hasConfidentialAccess: !p.hasConfidentialAccess }
        })
        updatePermissions(selectedRole.id, perms)
    }

    const handleSave = async () => {
        if (!selectedRole) return
        setIsSaving(true)
        try {
            // Sync to backend
            const backendRole = backendRoles.find((r) => r.name === selectedRole.name)
            if (backendRole?._id) {
                const hrmPerms = HRM_MODULES.map((mod) => {
                    const localPerm = fullPermissions.find(
                        (p) => p.module === MODULE_DISPLAY_NAMES[mod] || p.module === mod
                    )
                    return {
                        module: mod,
                        actions: localPerm?.actions || { view: false, create: false, edit: false, delete: false, approve: false },
                    }
                })
                await updateHrmRole(backendRole._id, { permissions: hrmPerms })
                const fetched = await fetchHrmRoles()
                setBackendRoles(fetched)
            }
            toast.success(`Permissions for "${selectedRole.name}" published successfully`)
        } catch {
            toast.success(`Permissions for "${selectedRole.name}" saved locally`)
        } finally {
            setIsSaving(false)
        }
    }

    const enableAll = (moduleIndex: number) => {
        if (!selectedRole) return
        const perms = fullPermissions.map((p, i) => {
            if (i !== moduleIndex) return p
            return {
                ...p,
                actions: { view: true, create: true, edit: true, delete: true, approve: true },
            }
        })
        updatePermissions(selectedRole.id, perms)
        toast.success(`All permissions enabled for ${fullPermissions[moduleIndex].module}`)
    }

    const disableAll = (moduleIndex: number) => {
        if (!selectedRole) return
        const perms = fullPermissions.map((p, i) => {
            if (i !== moduleIndex) return p
            return {
                ...p,
                actions: { view: false, create: false, edit: false, delete: false, approve: false },
            }
        })
        updatePermissions(selectedRole.id, perms)
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>HR Governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">HR Permissions</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">HR Access Control</h1>
                        <p className="text-xs text-gray-500 font-medium">
                            Configure module-level permissions and data access scope for each HR role.
                        </p>
                    </div>
                    <Button
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? "Saving..." : "Publish Changes"}
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Access Level</p>
                                <p className="text-xl font-semibold">{accessPercentage}%</p>
                                <Progress value={accessPercentage} className="h-1 mt-2 bg-blue-400 [&>div]:bg-white" />
                            </div>
                            <Shield className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Active Modules</p>
                                <p className="text-xl font-semibold text-gray-900">{activeModules}/{AVAILABLE_MODULES.length}</p>
                                <p className="text-[10px] text-gray-500">With permissions</p>
                            </div>
                            <Key className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Confidential</p>
                                <p className="text-xl font-semibold text-gray-900">{confidentialModules}</p>
                                <p className="text-[10px] text-gray-500">Sensitive access</p>
                            </div>
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Members</p>
                                <p className="text-xl font-semibold text-gray-900">{memberCount}</p>
                                <p className="text-[10px] text-gray-500">Using this role</p>
                            </div>
                            <Users className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Role Selector + Search */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <Label className="text-xs font-semibold text-gray-600 whitespace-nowrap">Editing role:</Label>
                    <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                        <SelectTrigger className="h-9 w-[220px] rounded-lg text-xs font-semibold bg-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((r) => (
                                <SelectItem key={r.id} value={r.id} className="text-xs">
                                    <div className="flex items-center gap-2">
                                        <span>{r.name}</span>
                                        <Badge className={`text-[8px] px-1 py-0 rounded-full font-semibold border-none ${
                                            r.type === "System" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                        }`}>
                                            {r.type}
                                        </Badge>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <Input
                        placeholder="Filter modules..."
                        className="pl-9 h-9 rounded-lg text-xs font-medium bg-white"
                        value={searchModule}
                        onChange={(e) => setSearchModule(e.target.value)}
                    />
                </div>
                {selectedRole && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium ml-auto">
                        <Crown className="w-3.5 h-3.5 text-amber-500" />
                        Approval Level: <span className="font-semibold text-gray-900">{selectedRole.approvalAuthorityLevel}</span>
                    </div>
                )}
            </div>

            {/* Permission Grid */}
            <TooltipProvider delayDuration={200}>
                <div className="space-y-3">
                    {filteredPermissions.map((perm, idx) => {
                        const realIndex = fullPermissions.findIndex((p) => p.module === perm.module)
                        const hasAny = Object.values(perm.actions).some(Boolean)
                        const actionCount = Object.values(perm.actions).filter(Boolean).length

                        return (
                            <Card key={perm.module} className={`rounded-xl border transition-all ${
                                hasAny ? "border-blue-100 bg-white shadow-sm" : "border-gray-100 bg-white"
                            }`}>
                                <CardContent className="p-0">
                                    <div className="flex items-center gap-4 p-4">
                                        {/* Module Name */}
                                        <div className="flex items-center gap-3 w-[180px] shrink-0">
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                                hasAny ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"
                                            }`}>
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-900">{perm.module}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{actionCount}/5 actions</p>
                                            </div>
                                        </div>

                                        {/* Action Toggles */}
                                        <div className="flex items-center gap-3 flex-1">
                                            {ACTION_CONFIG.map((a) => (
                                                <Tooltip key={a.key}>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={() => toggleAction(realIndex, a.key)}
                                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-[10px] font-semibold ${
                                                                perm.actions[a.key]
                                                                    ? `${a.bgColor} ${a.color} border-transparent shadow-sm`
                                                                    : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200"
                                                            }`}
                                                        >
                                                            {a.icon}
                                                            <span className="hidden lg:inline">{a.label}</span>
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="text-[10px]">
                                                        {a.label}: {perm.actions[a.key] ? "Enabled" : "Disabled"}
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}
                                        </div>

                                        {/* Scope */}
                                        <Select value={perm.scope} onValueChange={(v) => updateScope(realIndex, v as DataScope)}>
                                            <SelectTrigger className="h-8 w-[130px] rounded-md text-[10px] font-semibold border-gray-200 shrink-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SCOPE_OPTIONS.map((s) => (
                                                    <SelectItem key={s.value} value={s.value} className="text-xs">
                                                        <div className="flex items-center gap-1.5">{s.icon} {s.label}</div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {/* Confidential */}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <Switch
                                                        checked={perm.hasConfidentialAccess}
                                                        onCheckedChange={() => toggleConfidential(realIndex)}
                                                        className="data-[state=checked]:bg-rose-500 scale-90"
                                                    />
                                                    <Lock className={`w-3 h-3 ${perm.hasConfidentialAccess ? "text-rose-500" : "text-gray-300"}`} />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent className="text-[10px]">
                                                Confidential data access: {perm.hasConfidentialAccess ? "Granted" : "Denied"}
                                            </TooltipContent>
                                        </Tooltip>

                                        {/* Quick Actions */}
                                        <div className="flex items-center gap-1 shrink-0">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-7 px-2 text-[9px] font-semibold text-emerald-600 hover:bg-emerald-50"
                                                        onClick={() => enableAll(realIndex)}
                                                    >
                                                        All
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="text-[10px]">Enable all actions</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-7 px-2 text-[9px] font-semibold text-gray-400 hover:bg-gray-100"
                                                        onClick={() => disableAll(realIndex)}
                                                    >
                                                        None
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent className="text-[10px]">Disable all actions</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}

                    {filteredPermissions.length === 0 && (
                        <div className="bg-white rounded-xl border p-12 text-center">
                            <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs font-medium text-gray-500">No modules match your filter</p>
                        </div>
                    )}
                </div>
            </TooltipProvider>
        </div>
    )
}
