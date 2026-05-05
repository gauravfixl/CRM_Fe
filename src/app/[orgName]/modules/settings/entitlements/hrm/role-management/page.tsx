"use client"

import React, { useState, useMemo, useEffect, useCallback } from "react"
import {
    ShieldCheck,
    Search,
    Plus,
    Users,
    Crown,
    Pencil,
    Trash2,
    ChevronRight,
    ChevronDown,
    Eye,
    FilePlus,
    FileEdit,
    Ban,
    CheckCircle,
    UserPlus,
    UserMinus,
    History,
    Lock,
    Globe,
    Building2,
    User,
    Copy,
    RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/shared/components/ui/textarea"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/utils/toast"
import {
    useRolesStore,
    AVAILABLE_MODULES,
    type Role,
    type ModulePermission,
    type PermissionAction,
    type DataScope,
} from "@/shared/data/roles-store"
import {
    fetchHrmRoles,
    createHrmRole,
    updateHrmRole,
    deleteHrmRole,
    HRM_MODULES,
    MODULE_DISPLAY_NAMES,
    type HrmRole,
} from "@/modules/hrm/hooks/hrmRoleHooks"

const SCOPE_OPTIONS: { value: DataScope; label: string; icon: React.ReactNode }[] = [
    { value: "Self", label: "Self", icon: <User className="w-3.5 h-3.5" /> },
    { value: "Team", label: "Team", icon: <Users className="w-3.5 h-3.5" /> },
    { value: "Department", label: "Department", icon: <Building2 className="w-3.5 h-3.5" /> },
    { value: "Organization", label: "Organization", icon: <Globe className="w-3.5 h-3.5" /> },
]

const APPROVAL_LEVELS = [
    { value: 0, label: "Level 0 — No Approval Rights" },
    { value: 1, label: "Level 1 — Team Approvals" },
    { value: 2, label: "Level 2 — Department Head" },
    { value: 3, label: "Level 3 — Regional Director" },
    { value: 4, label: "Level 4 — VP / Executive" },
    { value: 5, label: "Level 5 — CXO / Full Power" },
]

const ACTION_LABELS: { key: PermissionAction; label: string; icon: React.ReactNode }[] = [
    { key: "view", label: "View", icon: <Eye className="w-3 h-3" /> },
    { key: "create", label: "Create", icon: <FilePlus className="w-3 h-3" /> },
    { key: "edit", label: "Edit", icon: <FileEdit className="w-3 h-3" /> },
    { key: "delete", label: "Delete", icon: <Ban className="w-3 h-3" /> },
    { key: "approve", label: "Approve", icon: <CheckCircle className="w-3 h-3" /> },
]

function buildDefaultPermissions(): ModulePermission[] {
    return AVAILABLE_MODULES.map((mod) => ({
        module: mod,
        actions: { view: false, create: false, edit: false, delete: false, approve: false },
        scope: "Self" as DataScope,
        hasConfidentialAccess: false,
        fieldAccess: {},
    }))
}

export default function RoleManagementPage() {
    const { roles, assignments, createRole, updateRole, deleteRole, updatePermissions, assignRole, unassignRole } = useRolesStore()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("overview")

    const [backendRoles, setBackendRoles] = useState<HrmRole[]>([])
    const [isLoadingBackend, setIsLoadingBackend] = useState(true)
    const [backendError, setBackendError] = useState(false)

    const loadBackendRoles = useCallback(async () => {
        setIsLoadingBackend(true)
        setBackendError(false)
        try {
            const fetched = await fetchHrmRoles()
            setBackendRoles(fetched)
        } catch {
            setBackendError(true)
        } finally {
            setIsLoadingBackend(false)
        }
    }, [])

    useEffect(() => { loadBackendRoles() }, [])

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newRole, setNewRole] = useState({ name: "", description: "", approvalAuthorityLevel: 0 })

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editRole, setEditRole] = useState<{ name: string; description: string; approvalAuthorityLevel: number } | null>(null)
    const [editRoleId, setEditRoleId] = useState<string | null>(null)

    const [isAssignOpen, setIsAssignOpen] = useState(false)
    const [assignData, setAssignData] = useState({ employeeId: "", employeeName: "" })

    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

    const [isDuplicateOpen, setIsDuplicateOpen] = useState(false)
    const [duplicateSource, setDuplicateSource] = useState<Role | null>(null)
    const [duplicateName, setDuplicateName] = useState("")

    const selectedRole = useMemo(() => roles.find((r) => r.id === selectedRoleId), [roles, selectedRoleId])

    const filteredRoles = useMemo(() => {
        if (!searchQuery) return roles
        return roles.filter(
            (r) =>
                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [roles, searchQuery])

    const totalCustom = roles.filter((r) => r.type === "Custom").length
    const totalSystem = roles.filter((r) => r.type === "System").length
    const totalAssignments = assignments.length

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newRole.name.trim()) return showWarning("Please enter a role name")

        createRole({
            name: newRole.name.trim(),
            description: newRole.description.trim(),
            type: "Custom",
            approvalAuthorityLevel: newRole.approvalAuthorityLevel,
            permissions: buildDefaultPermissions(),
        })

        try {
            await createHrmRole({
                name: newRole.name.trim(),
                description: newRole.description.trim(),
                role: "HRCustom",
                isCustom: true,
                permissions: HRM_MODULES.map((mod) => ({
                    module: mod,
                    actions: { view: false, create: false, edit: false, delete: false, approve: false },
                })),
            })
            await loadBackendRoles()
        } catch {}

        showSuccess(`Role "${newRole.name}" created successfully`)
        setIsCreateOpen(false)
        setNewRole({ name: "", description: "", approvalAuthorityLevel: 0 })
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editRole || !editRoleId) return
        if (!editRole.name.trim()) return showWarning("Role name is required")
        updateRole(editRoleId, {
            name: editRole.name.trim(),
            description: editRole.description.trim(),
            approvalAuthorityLevel: editRole.approvalAuthorityLevel,
        })

        try {
            const backendRole = backendRoles.find((r) => r.name === selectedRole?.name)
            if (backendRole?._id) {
                await updateHrmRole(backendRole._id, { name: editRole.name.trim() })
                await loadBackendRoles()
            }
        } catch {}

        showSuccess("Role updated successfully")
        setIsEditOpen(false)
        setEditRole(null)
        setEditRoleId(null)
    }

    const handleDelete = async () => {
        if (!deleteConfirmId) return
        const role = roles.find((r) => r.id === deleteConfirmId)
        if (role?.type === "System") {
            showWarning("System roles cannot be deleted")
            setDeleteConfirmId(null)
            return
        }

        try {
            const backendRole = backendRoles.find((r) => r.name === role?.name)
            if (backendRole?._id) {
                await deleteHrmRole(backendRole._id)
                await loadBackendRoles()
            }
        } catch {}

        deleteRole(deleteConfirmId)
        showSuccess("Role deleted successfully")
        if (selectedRoleId === deleteConfirmId) setSelectedRoleId(null)
        setDeleteConfirmId(null)
    }

    const handleDuplicate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!duplicateSource || !duplicateName.trim()) return showWarning("Enter a name for the duplicate role")
        createRole({
            name: duplicateName.trim(),
            description: `Duplicated from ${duplicateSource.name}`,
            type: "Custom",
            approvalAuthorityLevel: duplicateSource.approvalAuthorityLevel,
            permissions: JSON.parse(JSON.stringify(duplicateSource.permissions)),
        })
        showSuccess(`Role "${duplicateName}" created from "${duplicateSource.name}"`)
        setIsDuplicateOpen(false)
        setDuplicateSource(null)
        setDuplicateName("")
    }

    const openEdit = (role: Role) => {
        setEditRoleId(role.id)
        setEditRole({ name: role.name, description: role.description, approvalAuthorityLevel: role.approvalAuthorityLevel })
        setIsEditOpen(true)
    }

    const openDuplicate = (role: Role) => {
        setDuplicateSource(role)
        setDuplicateName(`${role.name} (Copy)`)
        setIsDuplicateOpen(true)
    }

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedRoleId || !assignData.employeeName.trim()) return showWarning("Enter employee name")
        assignRole(
            assignData.employeeId || `emp-${Date.now()}`,
            assignData.employeeName.trim(),
            selectedRoleId,
            "Org Admin"
        )
        showSuccess(`${assignData.employeeName} assigned to ${selectedRole?.name}`)
        setIsAssignOpen(false)
        setAssignData({ employeeId: "", employeeName: "" })
    }

    const togglePermissionAction = async (moduleIndex: number, action: PermissionAction) => {
        if (!selectedRole) return
        const updated = [...selectedRole.permissions]
        if (!updated[moduleIndex]) return
        updated[moduleIndex] = {
            ...updated[moduleIndex],
            actions: { ...updated[moduleIndex].actions, [action]: !updated[moduleIndex].actions[action] },
        }
        updatePermissions(selectedRole.id, updated)

        try {
            const backendRole = backendRoles.find((r) => r.name === selectedRole.name)
            if (backendRole?._id) {
                const hrmPerms = HRM_MODULES.map((mod) => {
                    const localPerm = updated.find((p) => p.module === MODULE_DISPLAY_NAMES[mod] || p.module === mod)
                    return {
                        module: mod,
                        actions: localPerm?.actions || { view: false, create: false, edit: false, delete: false, approve: false },
                    }
                })
                await updateHrmRole(backendRole._id, { permissions: hrmPerms })
            }
        } catch {}
    }

    const updateModuleScope = (moduleIndex: number, scope: DataScope) => {
        if (!selectedRole) return
        const updated = [...selectedRole.permissions]
        if (!updated[moduleIndex]) return
        updated[moduleIndex] = { ...updated[moduleIndex], scope }
        updatePermissions(selectedRole.id, updated)
    }

    const toggleConfidential = (moduleIndex: number) => {
        if (!selectedRole) return
        const updated = [...selectedRole.permissions]
        if (!updated[moduleIndex]) return
        updated[moduleIndex] = { ...updated[moduleIndex], hasConfidentialAccess: !updated[moduleIndex].hasConfidentialAccess }
        updatePermissions(selectedRole.id, updated)
    }

    const roleAssignments = useMemo(
        () => (selectedRoleId ? assignments.filter((a) => a.roleId === selectedRoleId) : []),
        [assignments, selectedRoleId]
    )

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

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Role Management</h1>
                        <p className="text-sm text-zinc-500 mt-1">Create and configure HR roles with granular module-level permissions.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {backendError && <span className="text-[10px] text-amber-600 font-medium">Offline mode</span>}
                        <Button
                            variant="outline"
                            onClick={loadBackendRoles}
                            disabled={isLoadingBackend}
                            className="rounded-none font-medium text-xs h-8 gap-2 px-4 border-zinc-200"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBackend ? "animate-spin" : ""}`} /> Sync
                        </Button>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                        >
                            <Plus size={14} /> New Role
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6 flex flex-col min-h-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Roles</p>
                        <p className="text-white text-xl font-semibold mt-1">{roles.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">System + Custom</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">System Roles</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalSystem}</p>
                        <p className="text-amber-600 text-[10px] mt-1">Protected defaults</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Custom Roles</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalCustom}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">User-defined</p>
                    </div>
                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Assignments</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalAssignments}</p>
                        <p className="text-primary text-[10px] mt-1">Active bindings</p>
                    </div>
                </div>

                {/* Split view */}
                <div className="flex gap-4 flex-1 min-h-[600px]">
                    {/* Left: Role list */}
                    <div className="w-[340px] shrink-0 bg-white border border-zinc-200 rounded-none shadow-lg flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                <Input
                                    placeholder="Search roles..."
                                    className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredRoles.map((role) => {
                                const isActive = selectedRoleId === role.id
                                const assignCount = assignments.filter((a) => a.roleId === role.id).length
                                return (
                                    <div
                                        key={role.id}
                                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-zinc-50 transition-all ${
                                            isActive ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-zinc-50"
                                        }`}
                                        onClick={() => { setSelectedRoleId(role.id); setActiveTab("overview") }}
                                    >
                                        <div className={`p-2.5 rounded-none border ${
                                            isActive ? "bg-primary/10 text-primary border-primary/10" : "bg-zinc-100 text-zinc-500 border-zinc-200"
                                        }`}>
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-semibold text-gray-900 truncate">{role.name}</p>
                                                <span className={`text-[9px] px-1.5 py-0 rounded-none font-semibold ${
                                                    role.type === "System" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                                }`}>
                                                    {role.type}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 truncate mt-0.5">{role.description}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
                                            <Users className="w-3 h-3" />
                                            <span className="font-medium">{assignCount}</span>
                                        </div>
                                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-primary" : "text-zinc-300"}`} />
                                    </div>
                                )
                            })}
                            {filteredRoles.length === 0 && (
                                <div className="p-8 text-center text-xs text-zinc-400">No roles found</div>
                            )}
                        </div>
                    </div>

                    {/* Right: Role detail */}
                    <div className="flex-1 bg-white border border-zinc-200 rounded-none shadow-lg flex flex-col overflow-hidden min-w-0">
                        {selectedRole ? (
                            <>
                                <div className="p-5 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-zinc-50/30">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2.5 bg-primary/10 text-primary rounded-none border border-primary/10 shrink-0">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-sm font-semibold text-gray-900 truncate">{selectedRole.name}</h2>
                                                <span className={`text-[9px] px-1.5 py-0 rounded-none font-semibold ${
                                                    selectedRole.type === "System" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                                }`}>
                                                    {selectedRole.type}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 mt-0.5 truncate">{selectedRole.description}</p>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="h-8 rounded-none text-xs font-medium gap-1.5 border-zinc-200">
                                                Actions <ChevronDown className="w-3 h-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 rounded-none">
                                            <DropdownMenuItem onClick={() => openEdit(selectedRole)} className="text-xs gap-2">
                                                <Pencil className="w-3.5 h-3.5" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openDuplicate(selectedRole)} className="text-xs gap-2">
                                                <Copy className="w-3.5 h-3.5" /> Duplicate Role
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setIsAssignOpen(true)} className="text-xs gap-2">
                                                <UserPlus className="w-3.5 h-3.5" /> Assign Member
                                            </DropdownMenuItem>
                                            {selectedRole.type === "Custom" && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-rose-600 text-xs gap-2" onClick={() => setDeleteConfirmId(selectedRole.id)}>
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete Role
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                                    <TabsList className="h-10 bg-transparent border-b border-zinc-100 rounded-none px-5 shrink-0 gap-0 justify-start w-full">
                                        <TabsTrigger value="overview" className="text-xs font-semibold data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 h-10">Overview</TabsTrigger>
                                        <TabsTrigger value="permissions" className="text-xs font-semibold data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 h-10">Permissions</TabsTrigger>
                                        <TabsTrigger value="members" className="text-xs font-semibold data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 h-10">Members ({roleAssignments.length})</TabsTrigger>
                                        <TabsTrigger value="audit" className="text-xs font-semibold data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 h-10">Audit Log</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="flex-1 overflow-y-auto p-5 mt-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-5">
                                                <div>
                                                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Role Name</p>
                                                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedRole.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Description</p>
                                                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{selectedRole.description || "No description"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Type</p>
                                                    <div className="mt-1">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-none font-semibold ${
                                                            selectedRole.type === "System" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                                                        }`}>
                                                            {selectedRole.type}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-5">
                                                <div>
                                                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Approval Authority</p>
                                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                                        {APPROVAL_LEVELS.find((l) => l.value === selectedRole.approvalAuthorityLevel)?.label || "None"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Active Modules</p>
                                                    <p className="text-sm font-semibold text-gray-900 mt-1">
                                                        {selectedRole.permissions.filter((p) => Object.values(p.actions).some(Boolean)).length} / {AVAILABLE_MODULES.length}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Members</p>
                                                    <p className="text-sm font-semibold text-gray-900 mt-1">{roleAssignments.length} assigned</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Last Updated</p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {new Date(selectedRole.updatedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Permission Summary</p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {fullPermissions.filter((p) => Object.values(p.actions).some(Boolean)).map((p) => (
                                                    <div key={p.module} className="flex items-center gap-2 p-2.5 rounded-none border border-zinc-100 bg-zinc-50/50">
                                                        <div className="p-1.5 bg-primary/10 text-primary rounded-none">
                                                            <ShieldCheck className="w-3 h-3" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-semibold text-gray-900 truncate">{p.module}</p>
                                                            <p className="text-[9px] text-gray-400 font-medium">{p.scope} scope</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {fullPermissions.filter((p) => Object.values(p.actions).some(Boolean)).length === 0 && (
                                                    <p className="text-xs text-zinc-400 col-span-3">No permissions configured yet</p>
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="permissions" className="flex-1 overflow-y-auto mt-0">
                                        <div className="p-5 pb-2">
                                            <p className="text-xs text-zinc-500 font-medium">
                                                Configure module-level access for <span className="font-semibold text-gray-900">{selectedRole.name}</span>. Toggle actions, set data scope, and enable confidential access per module.
                                            </p>
                                        </div>
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-zinc-100/50 border-b border-zinc-100 sticky top-0 z-10">
                                                    <th className="px-5 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[160px]">Module</th>
                                                    {ACTION_LABELS.map((a) => (
                                                        <th key={a.key} className="py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center w-[72px]">
                                                            <div className="flex flex-col items-center gap-1">{a.icon}<span>{a.label}</span></div>
                                                        </th>
                                                    ))}
                                                    <th className="py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center w-[120px]">Scope</th>
                                                    <th className="py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center w-[90px]">Confidential</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-100">
                                                {fullPermissions.map((perm, idx) => {
                                                    const hasAnyAction = Object.values(perm.actions).some(Boolean)
                                                    return (
                                                        <tr key={perm.module} className={`${hasAnyAction ? "bg-primary/5" : ""} hover:bg-zinc-50/50`}>
                                                            <td className="py-3 px-5 text-xs font-semibold text-gray-900">{perm.module}</td>
                                                            {ACTION_LABELS.map((a) => (
                                                                <td key={a.key} className="py-3 text-center">
                                                                    <div className="flex justify-center">
                                                                        <Switch
                                                                            checked={perm.actions[a.key]}
                                                                            onCheckedChange={() => togglePermissionAction(idx, a.key)}
                                                                            className="data-[state=checked]:bg-primary scale-90"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            ))}
                                                            <td className="py-3 text-center">
                                                                <Select value={perm.scope} onValueChange={(v) => updateModuleScope(idx, v as DataScope)}>
                                                                    <SelectTrigger className="h-7 w-[110px] mx-auto text-[10px] font-semibold rounded-none border-zinc-200">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {SCOPE_OPTIONS.map((s) => (
                                                                            <SelectItem key={s.value} value={s.value} className="text-xs">
                                                                                <div className="flex items-center gap-2">{s.icon}<span>{s.label}</span></div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </td>
                                                            <td className="py-3 text-center">
                                                                <div className="flex justify-center">
                                                                    <Switch
                                                                        checked={perm.hasConfidentialAccess}
                                                                        onCheckedChange={() => toggleConfidential(idx)}
                                                                        className="data-[state=checked]:bg-rose-500 scale-90"
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </TabsContent>

                                    <TabsContent value="members" className="flex-1 overflow-y-auto p-5 mt-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-xs text-zinc-500 font-medium">
                                                Users assigned to <span className="font-semibold text-gray-900">{selectedRole.name}</span>
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="h-8 rounded-none text-xs font-medium gap-1.5 border-zinc-200"
                                                onClick={() => setIsAssignOpen(true)}
                                            >
                                                <UserPlus className="w-3.5 h-3.5" /> Add Member
                                            </Button>
                                        </div>

                                        {roleAssignments.length > 0 ? (
                                            <div className="space-y-2">
                                                {roleAssignments.map((a) => (
                                                    <div key={a.id} className="flex items-center justify-between p-3 rounded-none border border-zinc-100 hover:border-zinc-200">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center text-primary">
                                                                <User className="w-3.5 h-3.5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-900">{a.employeeName}</p>
                                                                <p className="text-[10px] text-gray-400 font-medium">
                                                                    Assigned by {a.assignedBy} · {new Date(a.assignedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-7 w-7 p-0 hover:bg-rose-50 rounded-none"
                                                            onClick={() => {
                                                                unassignRole(a.id)
                                                                showSuccess(`${a.employeeName} removed from ${selectedRole.name}`)
                                                            }}
                                                        >
                                                            <UserMinus className="w-3.5 h-3.5 text-rose-400" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                                                <Users className="w-8 h-8 mb-2 text-zinc-300" />
                                                <p className="text-xs font-medium">No members assigned</p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="audit" className="flex-1 overflow-y-auto p-5 mt-0">
                                        <p className="text-xs text-zinc-500 font-medium mb-4">
                                            Complete change history for <span className="font-semibold text-gray-900">{selectedRole.name}</span>
                                        </p>
                                        {selectedRole.history.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedRole.history.map((h) => (
                                                    <div key={h.id} className="flex gap-3 items-start p-3 rounded-none border border-zinc-100">
                                                        <div className={`w-7 h-7 rounded-none flex items-center justify-center shrink-0 ${
                                                            h.action === "Created" ? "bg-emerald-50 text-emerald-500" :
                                                            h.action === "Permission Change" ? "bg-primary/10 text-primary" :
                                                            h.action === "Deleted" ? "bg-rose-50 text-rose-500" :
                                                            "bg-amber-50 text-amber-500"
                                                        }`}>
                                                            <History className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <span className={`text-[9px] px-1.5 py-0 rounded-none font-semibold ${
                                                                h.action === "Created" ? "bg-emerald-50 text-emerald-600" :
                                                                h.action === "Permission Change" ? "bg-primary/10 text-primary" :
                                                                h.action === "Deleted" ? "bg-rose-50 text-rose-600" :
                                                                "bg-amber-50 text-amber-600"
                                                            }`}>
                                                                {h.action}
                                                            </span>
                                                            <p className="text-xs text-gray-700 font-medium mt-1">{h.details}</p>
                                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                                {h.actor} · {new Date(h.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
                                                <History className="w-8 h-8 mb-2 text-zinc-300" />
                                                <p className="text-xs font-medium">No audit history</p>
                                            </div>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8">
                                <div className="p-4 rounded-none bg-zinc-100 mb-4">
                                    <ShieldCheck className="w-8 h-8 text-zinc-300" />
                                </div>
                                <p className="text-sm font-semibold text-zinc-500">Select a role</p>
                                <p className="text-xs text-zinc-400 mt-1 text-center max-w-[280px]">
                                    Choose a role from the left panel to view and edit its permissions, members, and audit history
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Role */}
            <SideFormSheet
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title="Create New Role"
                description="Define a new HR role with custom permissions."
                icon={<ShieldCheck className="w-5 h-5" />}
                width="md"
                onSubmit={handleCreate}
                submitLabel="Create Role"
                submitDisabled={!newRole.name.trim()}
            >
                <div className="space-y-4">
                    <Field label="Role Name" required>
                        <Input
                            placeholder="e.g. HR Executive, Recruiter, Payroll Admin"
                            value={newRole.name}
                            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>
                    <Field label="Description" hint="Briefly describe the role's responsibilities">
                        <Textarea
                            value={newRole.description}
                            onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                            className="rounded-lg border-[#E5E7EB] bg-white focus:border-primary min-h-[90px] text-sm"
                        />
                    </Field>
                    <Field label="Approval Authority Level">
                        <Select
                            value={String(newRole.approvalAuthorityLevel)}
                            onValueChange={(v) => setNewRole({ ...newRole, approvalAuthorityLevel: parseInt(v) })}
                        >
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {APPROVAL_LEVELS.map((l) => (
                                    <SelectItem key={l.value} value={String(l.value)}>{l.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            {/* Edit Role */}
            <SideFormSheet
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                title="Edit Role"
                description="Update the role's name, description, and approval level."
                icon={<Pencil className="w-5 h-5" />}
                width="md"
                onSubmit={handleEdit}
                submitLabel="Save Changes"
                submitDisabled={!editRole || !editRole.name.trim()}
            >
                {editRole && (
                    <div className="space-y-4">
                        <Field label="Role Name" required>
                            <Input
                                value={editRole.name}
                                onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                        <Field label="Description">
                            <Textarea
                                value={editRole.description}
                                onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
                                className="rounded-lg border-[#E5E7EB] bg-white focus:border-primary min-h-[90px] text-sm"
                            />
                        </Field>
                        <Field label="Approval Authority Level">
                            <Select value={String(editRole.approvalAuthorityLevel)} onValueChange={(v) => setEditRole({ ...editRole, approvalAuthorityLevel: parseInt(v) })}>
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {APPROVAL_LEVELS.map((l) => (
                                        <SelectItem key={l.value} value={String(l.value)}>{l.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                )}
            </SideFormSheet>

            {/* Assign Member */}
            <SideFormSheet
                open={isAssignOpen}
                onOpenChange={setIsAssignOpen}
                title="Assign Member"
                description={`Add a user to ${selectedRole?.name || "this role"}`}
                icon={<UserPlus className="w-5 h-5" />}
                width="md"
                onSubmit={handleAssign}
                submitLabel="Assign to Role"
                submitDisabled={!assignData.employeeName.trim()}
            >
                <div className="space-y-4">
                    <Field label="Employee Name" required>
                        <Input
                            placeholder="e.g. Rahul Sharma"
                            value={assignData.employeeName}
                            onChange={(e) => setAssignData({ ...assignData, employeeName: e.target.value })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>
                    <Field label="Employee ID" hint="Optional, for tracking">
                        <Input
                            placeholder="e.g. EMP-001"
                            value={assignData.employeeId}
                            onChange={(e) => setAssignData({ ...assignData, employeeId: e.target.value })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Duplicate */}
            <SideFormSheet
                open={isDuplicateOpen}
                onOpenChange={setIsDuplicateOpen}
                title="Duplicate Role"
                description={`Create a copy of ${duplicateSource?.name || ""} with all its permissions.`}
                icon={<Copy className="w-5 h-5" />}
                width="md"
                onSubmit={handleDuplicate}
                submitLabel="Duplicate"
                submitDisabled={!duplicateName.trim()}
            >
                <div className="space-y-4">
                    <Field label="New Role Name" required>
                        <Input
                            value={duplicateName}
                            onChange={(e) => setDuplicateName(e.target.value)}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Delete confirm */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirmId(null)}>
                    <div className="bg-white w-full max-w-sm rounded-none shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-rose-500" /> Delete Role?
                        </h3>
                        <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                            This will permanently remove the role and unassign all members. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2 mt-5">
                            <Button variant="outline" className="rounded-none text-xs font-medium h-9" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                            <Button className="rounded-none bg-rose-600 hover:bg-rose-700 text-xs font-medium h-9" onClick={handleDelete}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
