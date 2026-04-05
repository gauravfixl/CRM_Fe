"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    ShieldCheck,
    Search,
    Eye,
    FilePlus,
    FileEdit,
    Ban,
    CheckCircle,
    Download,
    Filter,
    Users,
    Lock,
    Globe,
    Building2,
    User,
    Key,
    Crown,
    RotateCcw,
    Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    useRolesStore,
    AVAILABLE_MODULES,
    type PermissionAction,
    type DataScope,
} from "@/shared/data/roles-store"
import {
    fetchHrmRoles,
    MODULE_DISPLAY_NAMES,
    HRM_MODULES,
    type HrmRole,
} from "@/modules/hrm/hooks/hrmRoleHooks"

const ACTION_CONFIG: { key: PermissionAction; label: string; short: string; icon: React.ReactNode; color: string }[] = [
    { key: "view", label: "View", short: "V", icon: <Eye className="w-3 h-3" />, color: "bg-sky-500" },
    { key: "create", label: "Create", short: "C", icon: <FilePlus className="w-3 h-3" />, color: "bg-emerald-500" },
    { key: "edit", label: "Edit", short: "E", icon: <FileEdit className="w-3 h-3" />, color: "bg-amber-500" },
    { key: "delete", label: "Delete", short: "D", icon: <Ban className="w-3 h-3" />, color: "bg-rose-500" },
    { key: "approve", label: "Approve", short: "A", icon: <CheckCircle className="w-3 h-3" />, color: "bg-violet-500" },
]

const SCOPE_ICONS: Record<DataScope, React.ReactNode> = {
    Self: <User className="w-3 h-3 text-gray-500" />,
    Team: <Users className="w-3 h-3 text-blue-500" />,
    Department: <Building2 className="w-3 h-3 text-amber-500" />,
    Organization: <Globe className="w-3 h-3 text-emerald-500" />,
}

const SCOPE_COLORS: Record<DataScope, string> = {
    Self: "bg-gray-100 text-gray-600",
    Team: "bg-blue-50 text-blue-600",
    Department: "bg-amber-50 text-amber-600",
    Organization: "bg-emerald-50 text-emerald-600",
}

export default function PermissionMatrixPage() {
    const { roles } = useRolesStore()
    const [searchModule, setSearchModule] = useState("")
    const [filterAction, setFilterAction] = useState<string>("all")
    const [filterScope, setFilterScope] = useState<string>("all")
    const [backendRoles, setBackendRoles] = useState<HrmRole[]>([])
    const [isLoadingBackend, setIsLoadingBackend] = useState(true)

    // Fetch from backend on mount
    useEffect(() => {
        const load = async () => {
            try {
                const fetched = await fetchHrmRoles()
                setBackendRoles(fetched)
            } catch {
                // Fallback to local store
            } finally {
                setIsLoadingBackend(false)
            }
        }
        load()
    }, [])

    const filteredModules = useMemo(() => {
        let modules = AVAILABLE_MODULES
        if (searchModule) {
            modules = modules.filter((m) => m.toLowerCase().includes(searchModule.toLowerCase()))
        }
        return modules
    }, [searchModule])

    // Stats
    const totalPermissions = useMemo(() => {
        let count = 0
        roles.forEach((r) => {
            r.permissions.forEach((p) => {
                Object.values(p.actions).forEach((v) => { if (v) count++ })
            })
        })
        return count
    }, [roles])

    const confidentialCount = useMemo(() => {
        let count = 0
        roles.forEach((r) => {
            r.permissions.forEach((p) => { if (p.hasConfidentialAccess) count++ })
        })
        return count
    }, [roles])

    const orgScopeCount = useMemo(() => {
        let count = 0
        roles.forEach((r) => {
            r.permissions.forEach((p) => {
                if (p.scope === "Organization" && Object.values(p.actions).some(Boolean)) count++
            })
        })
        return count
    }, [roles])

    const handleExport = () => {
        // Build CSV
        const headers = ["Module", ...roles.flatMap((r) => [`${r.name} - Actions`, `${r.name} - Scope`, `${r.name} - Confidential`])]
        const rows = AVAILABLE_MODULES.map((mod) => {
            const cols = [mod]
            roles.forEach((r) => {
                const perm = r.permissions.find((p) => p.module === mod)
                if (perm) {
                    const actions = ACTION_CONFIG.filter((a) => perm.actions[a.key]).map((a) => a.short).join(",") || "-"
                    cols.push(actions, perm.scope, perm.hasConfidentialAccess ? "Yes" : "No")
                } else {
                    cols.push("-", "-", "No")
                }
            })
            return cols
        })

        const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "permission-matrix.csv"
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Permission matrix exported as CSV")
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>HR Governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Permission Matrix</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Permission Matrix</h1>
                        <p className="text-xs text-gray-500 font-medium">
                            Cross-role comparison of module permissions across all HR roles.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-xl font-semibold text-xs h-10 gap-2 px-5 border-gray-200"
                        onClick={handleExport}
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Total Roles</p>
                                <p className="text-xl font-semibold text-white tracking-tight">{roles.length}</p>
                                <p className="text-[10px] text-white/70">In permission matrix</p>
                            </div>
                            <ShieldCheck className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Active Permissions</p>
                                <p className="text-xl font-semibold text-gray-900">{totalPermissions}</p>
                                <p className="text-[10px] text-gray-500">Enabled actions</p>
                            </div>
                            <Key className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Confidential Access</p>
                                <p className="text-xl font-semibold text-gray-900">{confidentialCount}</p>
                                <p className="text-[10px] text-gray-500">Sensitive data grants</p>
                            </div>
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Org-wide Access</p>
                                <p className="text-xl font-semibold text-gray-900">{orgScopeCount}</p>
                                <p className="text-[10px] text-gray-500">Organization scope</p>
                            </div>
                            <Globe className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <Input
                        placeholder="Search modules..."
                        className="pl-9 h-9 rounded-lg text-xs font-medium bg-white"
                        value={searchModule}
                        onChange={(e) => setSearchModule(e.target.value)}
                    />
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Actions:</span>
                {ACTION_CONFIG.map((a) => (
                    <div key={a.key} className="flex items-center gap-1.5">
                        <div className={`w-4 h-4 rounded ${a.color} flex items-center justify-center text-white`}>
                            <span className="text-[8px] font-bold">{a.short}</span>
                        </div>
                        <span className="text-[10px] font-medium text-gray-600">{a.label}</span>
                    </div>
                ))}
                <span className="text-gray-300">|</span>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Scope:</span>
                {(["Self", "Team", "Department", "Organization"] as DataScope[]).map((s) => (
                    <div key={s} className="flex items-center gap-1">
                        {SCOPE_ICONS[s]}
                        <span className="text-[10px] font-medium text-gray-600">{s}</span>
                    </div>
                ))}
            </div>

            {/* Matrix Table */}
            <TooltipProvider delayDuration={200}>
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50/80 sticky top-0 z-10">
                                <TableRow>
                                    <TableHead className="py-3 px-5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[180px] sticky left-0 bg-gray-50/80 z-20">
                                        Module
                                    </TableHead>
                                    {roles.map((role) => (
                                        <TableHead key={role.id} className="py-3 text-center min-w-[140px]">
                                            <div className="flex flex-col items-center gap-1">
                                                <Badge className={`text-[9px] px-1.5 py-0 rounded-full font-semibold border-none ${
                                                    role.type === "System" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                                }`}>
                                                    {role.type}
                                                </Badge>
                                                <span className="text-[11px] font-semibold text-gray-900">{role.name}</span>
                                                <span className="text-[9px] text-gray-400 font-medium">
                                                    Level {role.approvalAuthorityLevel}
                                                </span>
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredModules.map((mod, modIdx) => (
                                    <TableRow key={mod} className={`${modIdx % 2 === 0 ? "bg-white" : "bg-gray-50/30"} hover:bg-blue-50/20 transition-colors`}>
                                        <TableCell className="py-3 px-5 sticky left-0 bg-inherit z-10">
                                            <span className="text-xs font-semibold text-gray-900">{mod}</span>
                                        </TableCell>
                                        {roles.map((role) => {
                                            const perm = role.permissions.find((p) => p.module === mod)
                                            const hasAny = perm && Object.values(perm.actions).some(Boolean)

                                            return (
                                                <TableCell key={role.id} className="py-3 text-center">
                                                    {perm && hasAny ? (
                                                        <div className="flex flex-col items-center gap-1.5">
                                                            {/* Action pills */}
                                                            <div className="flex items-center gap-0.5 justify-center">
                                                                {ACTION_CONFIG.map((a) => (
                                                                    <Tooltip key={a.key}>
                                                                        <TooltipTrigger asChild>
                                                                            <div
                                                                                className={`w-5 h-5 rounded flex items-center justify-center text-[8px] font-bold transition-all ${
                                                                                    perm.actions[a.key]
                                                                                        ? `${a.color} text-white shadow-sm`
                                                                                        : "bg-gray-100 text-gray-300"
                                                                                }`}
                                                                            >
                                                                                {a.short}
                                                                            </div>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="text-[10px]">
                                                                            {a.label}: {perm.actions[a.key] ? "Enabled" : "Disabled"}
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                ))}
                                                            </div>
                                                            {/* Scope badge */}
                                                            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${SCOPE_COLORS[perm.scope]}`}>
                                                                {SCOPE_ICONS[perm.scope]}
                                                                <span>{perm.scope}</span>
                                                            </div>
                                                            {/* Confidential indicator */}
                                                            {perm.hasConfidentialAccess && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="flex items-center gap-0.5 text-[9px] text-rose-500 font-semibold">
                                                                            <Lock className="w-2.5 h-2.5" />
                                                                            Confidential
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className="text-[10px]">
                                                                        Has access to confidential/sensitive data
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-300 font-medium">No access</span>
                                                    )}
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                                {filteredModules.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={roles.length + 1} className="py-8 text-center text-xs text-gray-400">
                                            No modules match your search
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </TooltipProvider>
        </div>
    )
}
