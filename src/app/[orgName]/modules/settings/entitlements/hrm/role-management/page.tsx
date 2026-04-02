"use client"

import React, { useState, useMemo, useEffect, useCallback } from "react"
import {
    ShieldCheck,
    Search,
    Plus,
    MoreHorizontal,
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
    Loader2,
    RefreshCw,
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
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
    type ActionKey,
} from "@/modules/hrm/hooks/hrmRoleHooks"

const SCOPE_OPTIONS: { value: DataScope; label: string; icon: React.ReactNode; description: string }[] = [
    { value: "Self", label: "Self", icon: <User className="w-3.5 h-3.5" />, description: "Own data only" },
    { value: "Team", label: "Team", icon: <Users className="w-3.5 h-3.5" />, description: "Team members" },
    { value: "Department", label: "Department", icon: <Building2 className="w-3.5 h-3.5" />, description: "Entire department" },
    { value: "Organization", label: "Organization", icon: <Globe className="w-3.5 h-3.5" />, description: "All org data" },
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

    // Backend state
    const [backendRoles, setBackendRoles] = useState<HrmRole[]>([])
    const [isLoadingBackend, setIsLoadingBackend] = useState(true)
    const [backendError, setBackendError] = useState(false)

    // Fetch HRM roles from backend on mount
    const loadBackendRoles = useCallback(async () => {
        setIsLoadingBackend(true)
        setBackendError(false)
        try {
            const fetched = await fetchHrmRoles()
            setBackendRoles(fetched)
        } catch (err) {
            console.error("Failed to fetch HRM roles from backend, using local store:", err)
            setBackendError(true)
        } finally {
            setIsLoadingBackend(false)
        }
    }, [])

    useEffect(() => {
        loadBackendRoles()
    }, [])

    // Create dialog
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [newRole, setNewRole] = useState({
        name: "",
        description: "",
        approvalAuthorityLevel: 0,
    })

    // Edit dialog
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editRole, setEditRole] = useState<{ name: string; description: string; approvalAuthorityLevel: number } | null>(null)
    const [editRoleId, setEditRoleId] = useState<string | null>(null)

    // Assign dialog
    const [isAssignOpen, setIsAssignOpen] = useState(false)
    const [assignData, setAssignData] = useState({ employeeId: "", employeeName: "" })

    // Delete confirm
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

    // Duplicate dialog
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

    const handleCreate = async () => {
        if (!newRole.name.trim()) return toast.error("Please enter a role name")

        // Create in local store
        createRole({
            name: newRole.name.trim(),
            description: newRole.description.trim(),
            type: "Custom",
            approvalAuthorityLevel: newRole.approvalAuthorityLevel,
            permissions: buildDefaultPermissions(),
        })

        // Also create in backend
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
        } catch {
            // Local store already updated, backend sync failed silently
        }

        toast.success(`Role "${newRole.name}" created successfully`)
        setIsCreateOpen(false)
        setNewRole({ name: "", description: "", approvalAuthorityLevel: 0 })
    }

    const handleEdit = async () => {
        if (!editRole || !editRoleId) return
        if (!editRole.name.trim()) return toast.error("Role name is required")
        updateRole(editRoleId, {
            name: editRole.name.trim(),
            description: editRole.description.trim(),
            approvalAuthorityLevel: editRole.approvalAuthorityLevel,
        })

        // Sync to backend
        try {
            const backendRole = backendRoles.find((r) => r.name === selectedRole?.name)
            if (backendRole?._id) {
                await updateHrmRole(backendRole._id, { name: editRole.name.trim() })
                await loadBackendRoles()
            }
        } catch {
            // Local store already updated
        }

        toast.success("Role updated successfully")
        setIsEditOpen(false)
        setEditRole(null)
        setEditRoleId(null)
    }

    const handleDelete = async () => {
        if (!deleteConfirmId) return
        const role = roles.find((r) => r.id === deleteConfirmId)
        if (role?.type === "System") {
            toast.error("System roles cannot be deleted")
            setDeleteConfirmId(null)
            return
        }

        // Delete from backend first
        try {
            const backendRole = backendRoles.find((r) => r.name === role?.name)
            if (backendRole?._id) {
                await deleteHrmRole(backendRole._id)
                await loadBackendRoles()
            }
        } catch {
            // Continue with local delete
        }

        deleteRole(deleteConfirmId)
        toast.success("Role deleted successfully")
        if (selectedRoleId === deleteConfirmId) setSelectedRoleId(null)
        setDeleteConfirmId(null)
    }

    const handleDuplicate = () => {
        if (!duplicateSource || !duplicateName.trim()) return toast.error("Enter a name for the duplicate role")
        createRole({
            name: duplicateName.trim(),
            description: `Duplicated from ${duplicateSource.name}`,
            type: "Custom",
            approvalAuthorityLevel: duplicateSource.approvalAuthorityLevel,
            permissions: JSON.parse(JSON.stringify(duplicateSource.permissions)),
        })
        toast.success(`Role "${duplicateName}" created from "${duplicateSource.name}"`)
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

    const handleAssign = () => {
        if (!selectedRoleId || !assignData.employeeName.trim()) return toast.error("Enter employee name")
        assignRole(
            assignData.employeeId || `emp-${Date.now()}`,
            assignData.employeeName.trim(),
            selectedRoleId,
            "Org Admin"
        )
        toast.success(`${assignData.employeeName} assigned to ${selectedRole?.name}`)
        setIsAssignOpen(false)
        setAssignData({ employeeId: "", employeeName: "" })
    }

    const togglePermissionAction = async (moduleIndex: number, action: PermissionAction) => {
        if (!selectedRole) return
        const updated = [...selectedRole.permissions]
        if (!updated[moduleIndex]) return
        updated[moduleIndex] = {
            ...updated[moduleIndex],
            actions: {
                ...updated[moduleIndex].actions,
                [action]: !updated[moduleIndex].actions[action],
            },
        }
        updatePermissions(selectedRole.id, updated)

        // Sync permissions to backend
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
        } catch {
            // Local already updated
        }
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
        updated[moduleIndex] = {
            ...updated[moduleIndex],
            hasConfidentialAccess: !updated[moduleIndex].hasConfidentialAccess,
        }
        updatePermissions(selectedRole.id, updated)
    }

    const roleAssignments = useMemo(
        () => (selectedRoleId ? assignments.filter((a) => a.roleId === selectedRoleId) : []),
        [assignments, selectedRoleId]
    )

    // Ensure all modules exist in selected role's permissions
    const fullPermissions = useMemo(() => {
        if (!selectedRole) return []
        return AVAILABLE_MODULES.map((mod) => {
            const existing = selectedRole.permissions.find((p) => p.module === mod)
            return (
                existing || {
                    module: mod,
                    actions: { view: false, create: false, edit: false, delete: false, approve: false },
                    scope: "Self" as DataScope,
                    hasConfidentialAccess: false,
                    fieldAccess: {},
                }
            )
        })
    }, [selectedRole])

    return (
        <div className="font-outfit flex flex-col h-full w-full bg-[#fafafa] overflow-hidden">
            {/* Header */}
            <div className="flex flex-col gap-1 p-6 pb-0">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>HR Governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Role Management</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Role Management</h1>
                        <p className="text-xs text-gray-500 font-medium">Create and configure HR roles with granular module-level permissions.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {backendError && (
                            <span className="text-[10px] text-amber-600 font-medium">Offline mode</span>
                        )}
                        <Button
                            variant="outline"
                            className="rounded-xl font-semibold text-xs h-10 gap-2 px-4 border-gray-200"
                            onClick={loadBackendRoles}
                            disabled={isLoadingBackend}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBackend ? "animate-spin" : ""}`} />
                            Sync
                        </Button>
                        <Button
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            New Role
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 pb-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Total Roles</p>
                                <p className="text-xl font-semibold">{roles.length}</p>
                                <p className="text-[10px] text-white/70">System + Custom</p>
                            </div>
                            <ShieldCheck className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">System Roles</p>
                                <p className="text-xl font-semibold text-gray-900">{totalSystem}</p>
                                <p className="text-[10px] text-gray-500">Protected defaults</p>
                            </div>
                            <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Custom Roles</p>
                                <p className="text-xl font-semibold text-gray-900">{totalCustom}</p>
                                <p className="text-[10px] text-gray-500">User-defined</p>
                            </div>
                            <Crown className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Assignments</p>
                                <p className="text-xl font-semibold text-gray-900">{totalAssignments}</p>
                                <p className="text-[10px] text-gray-500">Active role bindings</p>
                            </div>
                            <Users className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Main Content - Split View */}
            <div className="flex-1 flex gap-4 px-6 pb-6 min-h-0 overflow-hidden">
                {/* Left Panel - Role List */}
                <div className="w-[340px] shrink-0 bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <Input
                                placeholder="Search roles..."
                                className="pl-9 h-9 rounded-lg text-xs font-medium"
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
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-50 transition-all ${
                                        isActive ? "bg-blue-50 border-l-2 border-l-blue-600" : "hover:bg-gray-50"
                                    }`}
                                    onClick={() => { setSelectedRoleId(role.id); setActiveTab("overview") }}
                                >
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                        isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                                    }`}>
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-semibold text-gray-900 truncate">{role.name}</p>
                                            <Badge className={`text-[9px] px-1.5 py-0 rounded-full font-semibold ${
                                                role.type === "System"
                                                    ? "bg-amber-50 text-amber-600 border-none"
                                                    : "bg-emerald-50 text-emerald-600 border-none"
                                            }`}>
                                                {role.type}
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{role.description}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
                                        <Users className="w-3 h-3" />
                                        <span className="font-medium">{assignCount}</span>
                                    </div>
                                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                                        isActive ? "text-blue-500" : "text-gray-300"
                                    }`} />
                                </div>
                            )
                        })}
                        {filteredRoles.length === 0 && (
                            <div className="p-8 text-center text-xs text-gray-400">No roles found</div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Role Detail */}
                <div className="flex-1 bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden min-w-0">
                    {selectedRole ? (
                        <>
                            {/* Role Header */}
                            <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-sm font-semibold text-gray-900 truncate">{selectedRole.name}</h2>
                                            <Badge className={`text-[9px] px-1.5 py-0 rounded-full font-semibold shrink-0 ${
                                                selectedRole.type === "System" ? "bg-amber-50 text-amber-600 border-none" : "bg-emerald-50 text-emerald-600 border-none"
                                            }`}>
                                                {selectedRole.type}
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-0.5 truncate">{selectedRole.description}</p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="h-8 rounded-lg text-xs font-semibold gap-1.5 border-gray-200">
                                            Actions <ChevronDown className="w-3 h-3" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-lg">
                                        <DropdownMenuItem onClick={() => openEdit(selectedRole)}>
                                            <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openDuplicate(selectedRole)}>
                                            <Copy className="w-3.5 h-3.5 mr-2" /> Duplicate Role
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setIsAssignOpen(true)}>
                                            <UserPlus className="w-3.5 h-3.5 mr-2" /> Assign Member
                                        </DropdownMenuItem>
                                        {selectedRole.type === "Custom" && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-rose-600" onClick={() => setDeleteConfirmId(selectedRole.id)}>
                                                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Role
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Tabs */}
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                                <TabsList className="h-10 bg-transparent border-b border-gray-100 rounded-none px-5 shrink-0 gap-0 justify-start w-full">
                                    <TabsTrigger value="overview" className="text-xs font-semibold data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-4 h-10">
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="permissions" className="text-xs font-semibold data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-4 h-10">
                                        Permissions
                                    </TabsTrigger>
                                    <TabsTrigger value="members" className="text-xs font-semibold data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-4 h-10">
                                        Members ({roleAssignments.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="audit" className="text-xs font-semibold data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none px-4 h-10">
                                        Audit Log
                                    </TabsTrigger>
                                </TabsList>

                                {/* Overview Tab */}
                                <TabsContent value="overview" className="flex-1 overflow-y-auto p-5 mt-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-5">
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role Name</Label>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">{selectedRole.name}</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</Label>
                                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{selectedRole.description || "No description"}</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</Label>
                                                <div className="mt-1">
                                                    <Badge className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                                        selectedRole.type === "System" ? "bg-amber-50 text-amber-600 border-none" : "bg-emerald-50 text-emerald-600 border-none"
                                                    }`}>
                                                        {selectedRole.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-5">
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Approval Authority</Label>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                                    {APPROVAL_LEVELS.find((l) => l.value === selectedRole.approvalAuthorityLevel)?.label || "None"}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Modules</Label>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">
                                                    {selectedRole.permissions.filter((p) => Object.values(p.actions).some(Boolean)).length} / {AVAILABLE_MODULES.length}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Members</Label>
                                                <p className="text-sm font-semibold text-gray-900 mt-1">{roleAssignments.length} assigned</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</Label>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {new Date(selectedRole.updatedAt).toLocaleDateString("en-IN", {
                                                        day: "2-digit", month: "short", year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Permission Summary */}
                                    <div className="mt-8">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Permission Summary</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {fullPermissions
                                                .filter((p) => Object.values(p.actions).some(Boolean))
                                                .map((p) => (
                                                    <div key={p.module} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 bg-gray-50/50">
                                                        <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                                                            <ShieldCheck className="w-3 h-3 text-blue-500" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[10px] font-semibold text-gray-900 truncate">{p.module}</p>
                                                            <p className="text-[9px] text-gray-400 font-medium">{p.scope} scope</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            {fullPermissions.filter((p) => Object.values(p.actions).some(Boolean)).length === 0 && (
                                                <p className="text-xs text-gray-400 col-span-3">No permissions configured yet</p>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Permissions Tab */}
                                <TabsContent value="permissions" className="flex-1 overflow-y-auto mt-0">
                                    <div className="p-5 pb-2">
                                        <p className="text-xs text-gray-500 font-medium">
                                            Configure module-level access for <span className="font-semibold text-gray-900">{selectedRole.name}</span>.
                                            Toggle actions, set data scope, and enable confidential access per module.
                                        </p>
                                    </div>
                                    <Table>
                                        <TableHeader className="bg-gray-50/50 sticky top-0 z-10">
                                            <TableRow>
                                                <TableHead className="py-3 px-5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-[160px]">Module</TableHead>
                                                {ACTION_LABELS.map((a) => (
                                                    <TableHead key={a.key} className="py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center w-[72px]">
                                                        <div className="flex flex-col items-center gap-1">
                                                            {a.icon}
                                                            <span>{a.label}</span>
                                                        </div>
                                                    </TableHead>
                                                ))}
                                                <TableHead className="py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center w-[120px]">Scope</TableHead>
                                                <TableHead className="py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center w-[90px]">Confidential</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fullPermissions.map((perm, idx) => {
                                                const hasAnyAction = Object.values(perm.actions).some(Boolean)
                                                return (
                                                    <TableRow key={perm.module} className={`transition-colors ${hasAnyAction ? "bg-blue-50/30" : ""} hover:bg-gray-50/50`}>
                                                        <TableCell className="py-3 px-5">
                                                            <span className="text-xs font-semibold text-gray-900">{perm.module}</span>
                                                        </TableCell>
                                                        {ACTION_LABELS.map((a) => (
                                                            <TableCell key={a.key} className="py-3 text-center">
                                                                <div className="flex justify-center">
                                                                    <Switch
                                                                        checked={perm.actions[a.key]}
                                                                        onCheckedChange={() => togglePermissionAction(idx, a.key)}
                                                                        className="data-[state=checked]:bg-blue-600 scale-90"
                                                                    />
                                                                </div>
                                                            </TableCell>
                                                        ))}
                                                        <TableCell className="py-3 text-center">
                                                            <Select
                                                                value={perm.scope}
                                                                onValueChange={(v) => updateModuleScope(idx, v as DataScope)}
                                                            >
                                                                <SelectTrigger className="h-7 w-[110px] mx-auto text-[10px] font-semibold rounded-md border-gray-200">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {SCOPE_OPTIONS.map((s) => (
                                                                        <SelectItem key={s.value} value={s.value} className="text-xs">
                                                                            <div className="flex items-center gap-2">
                                                                                {s.icon}
                                                                                <span>{s.label}</span>
                                                                            </div>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell className="py-3 text-center">
                                                            <div className="flex justify-center">
                                                                <Switch
                                                                    checked={perm.hasConfidentialAccess}
                                                                    onCheckedChange={() => toggleConfidential(idx)}
                                                                    className="data-[state=checked]:bg-rose-500 scale-90"
                                                                />
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </TabsContent>

                                {/* Members Tab */}
                                <TabsContent value="members" className="flex-1 overflow-y-auto p-5 mt-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-xs text-gray-500 font-medium">
                                            Users assigned to <span className="font-semibold text-gray-900">{selectedRole.name}</span>
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="h-8 rounded-lg text-xs font-semibold gap-1.5 border-gray-200"
                                            onClick={() => setIsAssignOpen(true)}
                                        >
                                            <UserPlus className="w-3.5 h-3.5" /> Add Member
                                        </Button>
                                    </div>

                                    {roleAssignments.length > 0 ? (
                                        <div className="space-y-2">
                                            {roleAssignments.map((a) => (
                                                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
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
                                                        className="h-7 w-7 p-0 hover:bg-rose-50 rounded-lg"
                                                        onClick={() => {
                                                            unassignRole(a.id)
                                                            toast.success(`${a.employeeName} removed from ${selectedRole.name}`)
                                                        }}
                                                    >
                                                        <UserMinus className="w-3.5 h-3.5 text-rose-400" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <Users className="w-8 h-8 mb-2 text-gray-300" />
                                            <p className="text-xs font-medium">No members assigned</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Click "Add Member" to assign users to this role</p>
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Audit Log Tab */}
                                <TabsContent value="audit" className="flex-1 overflow-y-auto p-5 mt-0">
                                    <p className="text-xs text-gray-500 font-medium mb-4">
                                        Complete change history for <span className="font-semibold text-gray-900">{selectedRole.name}</span>
                                    </p>
                                    {selectedRole.history.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedRole.history.map((h) => (
                                                <div key={h.id} className="flex gap-3 items-start p-3 rounded-lg border border-gray-100">
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                                        h.action === "Created" ? "bg-emerald-50 text-emerald-500" :
                                                        h.action === "Permission Change" ? "bg-blue-50 text-blue-500" :
                                                        h.action === "Deleted" ? "bg-rose-50 text-rose-500" :
                                                        "bg-amber-50 text-amber-500"
                                                    }`}>
                                                        <History className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <Badge className={`text-[9px] px-1.5 py-0 rounded-full font-semibold border-none ${
                                                                h.action === "Created" ? "bg-emerald-50 text-emerald-600" :
                                                                h.action === "Permission Change" ? "bg-blue-50 text-blue-600" :
                                                                h.action === "Deleted" ? "bg-rose-50 text-rose-600" :
                                                                "bg-amber-50 text-amber-600"
                                                            }`}>
                                                                {h.action}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-gray-700 font-medium mt-1">{h.details}</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                                            {h.actor} · {new Date(h.timestamp).toLocaleString("en-IN", {
                                                                day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                            <History className="w-8 h-8 mb-2 text-gray-300" />
                                            <p className="text-xs font-medium">No audit history</p>
                                            <p className="text-[10px] text-gray-400 mt-1">Changes will appear here automatically</p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                                <ShieldCheck className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-sm font-semibold text-gray-500">Select a role</p>
                            <p className="text-xs text-gray-400 mt-1 text-center max-w-[280px]">
                                Choose a role from the left panel to view and edit its permissions, members, and audit history
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Role Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold text-sm">Create New Role</DialogTitle>
                        <DialogDescription className="text-blue-100 text-xs">Define a new HR role with custom permissions.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Role Name</Label>
                            <Input
                                className="h-9 rounded-lg text-xs"
                                value={newRole.name}
                                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                placeholder="e.g. HR Executive, Recruiter, Payroll Admin"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Description</Label>
                            <Textarea
                                className="rounded-lg text-xs min-h-[72px] resize-none"
                                value={newRole.description}
                                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                                placeholder="Briefly describe the role's responsibilities"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Approval Authority Level</Label>
                            <Select
                                value={String(newRole.approvalAuthorityLevel)}
                                onValueChange={(v) => setNewRole({ ...newRole, approvalAuthorityLevel: parseInt(v) })}
                            >
                                <SelectTrigger className="h-9 rounded-lg text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {APPROVAL_LEVELS.map((l) => (
                                        <SelectItem key={l.value} value={String(l.value)} className="text-xs">{l.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="px-5 pb-4">
                        <Button onClick={handleCreate} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">
                            Create Role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold text-sm">Edit Role</DialogTitle>
                    </DialogHeader>
                    {editRole && (
                        <>
                            <div className="grid gap-4 px-5 py-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Role Name</Label>
                                    <Input className="h-9 rounded-lg text-xs" value={editRole.name} onChange={(e) => setEditRole({ ...editRole, name: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Description</Label>
                                    <Textarea className="rounded-lg text-xs min-h-[72px] resize-none" value={editRole.description} onChange={(e) => setEditRole({ ...editRole, description: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Approval Authority Level</Label>
                                    <Select value={String(editRole.approvalAuthorityLevel)} onValueChange={(v) => setEditRole({ ...editRole, approvalAuthorityLevel: parseInt(v) })}>
                                        <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {APPROVAL_LEVELS.map((l) => (
                                                <SelectItem key={l.value} value={String(l.value)} className="text-xs">{l.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter className="px-5 pb-4">
                                <Button onClick={handleEdit} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Save Changes</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Assign Member Dialog */}
            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold text-sm">Assign Member</DialogTitle>
                        <DialogDescription className="text-blue-100 text-xs">Add a user to {selectedRole?.name}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Employee Name</Label>
                            <Input className="h-9 rounded-lg text-xs" value={assignData.employeeName} onChange={(e) => setAssignData({ ...assignData, employeeName: e.target.value })} placeholder="e.g. Rahul Sharma" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Employee ID (optional)</Label>
                            <Input className="h-9 rounded-lg text-xs" value={assignData.employeeId} onChange={(e) => setAssignData({ ...assignData, employeeId: e.target.value })} placeholder="e.g. EMP-001" />
                        </div>
                    </div>
                    <DialogFooter className="px-5 pb-4">
                        <Button onClick={handleAssign} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Assign to Role</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <DialogContent className="max-w-sm rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-gray-900">Delete Role?</DialogTitle>
                        <DialogDescription className="text-xs text-gray-500">
                            This will permanently remove the role and unassign all members. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-lg text-xs font-semibold" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                        <Button className="rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-semibold" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Duplicate Role Dialog */}
            <Dialog open={isDuplicateOpen} onOpenChange={setIsDuplicateOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold text-sm">Duplicate Role</DialogTitle>
                        <DialogDescription className="text-blue-100 text-xs">Create a copy of {duplicateSource?.name} with all permissions</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">New Role Name</Label>
                            <Input className="h-9 rounded-lg text-xs" value={duplicateName} onChange={(e) => setDuplicateName(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter className="px-5 pb-4">
                        <Button onClick={handleDuplicate} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Duplicate</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
