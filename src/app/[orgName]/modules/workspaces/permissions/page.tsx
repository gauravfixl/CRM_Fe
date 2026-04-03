"use client"

import React, { useState, useMemo } from "react"
import {
    Shield, Plus, MoreHorizontal, Trash2, Edit3, Search, ChevronRight,
    Users, Lock, CheckSquare, Square, Save, UserPlus, X, AlertTriangle, Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"

interface Role {
    id: string
    name: string
    description: string
    memberCount: number
    type: "system" | "custom"
    permissions: string[]
}

interface Member {
    id: string
    name: string
    email: string
    roleId: string
    addedDate: string
    avatar: string
}

const ALL_PERMISSIONS = [
    "Browse Project", "Create Issues", "Edit Issues", "Delete Issues",
    "Manage Sprints", "Configure Board", "Manage Members", "Admin Settings",
    "View Reports", "Manage Workflow", "Manage Releases", "Bulk Operations",
]

const initialRoles: Role[] = [
    { id: "r1", name: "Project Owner", description: "Full access to all project settings and data", memberCount: 1, type: "system", permissions: [...ALL_PERMISSIONS] },
    { id: "r2", name: "Project Admin", description: "Can manage members, settings, and all issues", memberCount: 3, type: "system", permissions: ALL_PERMISSIONS.filter(p => p !== "Admin Settings") },
    { id: "r3", name: "Project Member", description: "Can create and edit issues, view reports", memberCount: 12, type: "system", permissions: ["Browse Project", "Create Issues", "Edit Issues", "View Reports", "Bulk Operations"] },
    { id: "r4", name: "Project Viewer", description: "Read-only access to project data", memberCount: 5, type: "system", permissions: ["Browse Project", "View Reports"] },
]

const initialMembers: Member[] = [
    { id: "m1", name: "Alice Johnson", email: "alice@company.com", roleId: "r1", addedDate: "2025-01-15", avatar: "AJ" },
    { id: "m2", name: "Bob Smith", email: "bob@company.com", roleId: "r2", addedDate: "2025-02-01", avatar: "BS" },
    { id: "m3", name: "Charlie Davis", email: "charlie@company.com", roleId: "r2", addedDate: "2025-02-10", avatar: "CD" },
    { id: "m4", name: "Diana Lee", email: "diana@company.com", roleId: "r3", addedDate: "2025-03-01", avatar: "DL" },
    { id: "m5", name: "Eve Wilson", email: "eve@company.com", roleId: "r3", addedDate: "2025-03-05", avatar: "EW" },
    { id: "m6", name: "Frank Brown", email: "frank@company.com", roleId: "r3", addedDate: "2025-03-10", avatar: "FB" },
    { id: "m7", name: "Grace Kim", email: "grace@company.com", roleId: "r3", addedDate: "2025-03-15", avatar: "GK" },
    { id: "m8", name: "Henry Park", email: "henry@company.com", roleId: "r4", addedDate: "2025-04-01", avatar: "HP" },
    { id: "m9", name: "Ivy Chen", email: "ivy@company.com", roleId: "r4", addedDate: "2025-04-05", avatar: "IC" },
    { id: "m10", name: "Jack Wang", email: "jack@company.com", roleId: "r3", addedDate: "2025-04-10", avatar: "JW" },
]

export default function PermissionsPage() {
    const [activeTab, setActiveTab] = useState("roles")
    const [roles, setRoles] = useState<Role[]>(initialRoles)
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [search, setSearch] = useState("")

    // Role dialogs
    const [showCreateRole, setShowCreateRole] = useState(false)
    const [editingRole, setEditingRole] = useState<Role | null>(null)
    const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null)
    const [roleForm, setRoleForm] = useState({ name: "", description: "", permissions: [] as string[] })

    // Permission matrix
    const [editMode, setEditMode] = useState(false)
    const [matrixState, setMatrixState] = useState<Record<string, string[]>>(() => {
        const m: Record<string, string[]> = {}
        initialRoles.forEach(r => { m[r.id] = [...r.permissions] })
        return m
    })

    // Member dialogs
    const [showAddMember, setShowAddMember] = useState(false)
    const [removeMemberId, setRemoveMemberId] = useState<string | null>(null)
    const [memberForm, setMemberForm] = useState({ email: "", roleId: "" })

    const filteredRoles = useMemo(() => roles.filter(r => r.name.toLowerCase().includes(search.toLowerCase())), [roles, search])
    const filteredMembers = useMemo(() => members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())), [members, search])

    // Role CRUD
    const handleCreateRole = () => {
        if (!roleForm.name.trim()) { toast.error("Role name is required"); return }
        const nr: Role = { id: `r${Date.now()}`, name: roleForm.name, description: roleForm.description, memberCount: 0, type: "custom", permissions: roleForm.permissions }
        setRoles(p => [...p, nr])
        setMatrixState(p => ({ ...p, [nr.id]: [...nr.permissions] }))
        setRoleForm({ name: "", description: "", permissions: [] })
        setShowCreateRole(false)
        toast.success(`Role "${nr.name}" created`)
    }

    const handleEditRole = () => {
        if (!editingRole || !roleForm.name.trim()) { toast.error("Role name is required"); return }
        setRoles(p => p.map(r => r.id === editingRole.id ? { ...r, name: roleForm.name, description: roleForm.description, permissions: roleForm.permissions } : r))
        setMatrixState(p => ({ ...p, [editingRole.id]: [...roleForm.permissions] }))
        setEditingRole(null)
        setRoleForm({ name: "", description: "", permissions: [] })
        toast.success("Role updated")
    }

    const handleDeleteRole = () => {
        if (!deleteRoleId) return
        const role = roles.find(r => r.id === deleteRoleId)
        if (role?.type === "system") { toast.error("System roles cannot be deleted"); return }
        // Move members to Project Member
        setMembers(p => p.map(m => m.roleId === deleteRoleId ? { ...m, roleId: "r3" } : m))
        setRoles(p => p.filter(r => r.id !== deleteRoleId))
        setMatrixState(p => { const next = { ...p }; delete next[deleteRoleId]; return next })
        setDeleteRoleId(null)
        toast.success(`Role "${role?.name}" deleted. Members moved to Project Member.`)
    }

    // Matrix
    const toggleMatrixPerm = (roleId: string, perm: string) => {
        if (!editMode) return
        setMatrixState(p => {
            const perms = p[roleId] || []
            return { ...p, [roleId]: perms.includes(perm) ? perms.filter(x => x !== perm) : [...perms, perm] }
        })
    }

    const saveMatrix = () => {
        setRoles(p => p.map(r => ({ ...r, permissions: matrixState[r.id] || [] })))
        setEditMode(false)
        toast.success("Permissions saved")
    }

    // Member CRUD
    const handleAddMember = () => {
        if (!memberForm.email.trim()) { toast.error("Email is required"); return }
        if (!memberForm.roleId) { toast.error("Please select a role"); return }
        if (members.find(m => m.email === memberForm.email)) { toast.error("Member already exists"); return }
        const name = memberForm.email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
        const nm: Member = { id: `m${Date.now()}`, name, email: memberForm.email, roleId: memberForm.roleId, addedDate: new Date().toISOString().split("T")[0], avatar: initials }
        setMembers(p => [...p, nm])
        setRoles(p => p.map(r => r.id === memberForm.roleId ? { ...r, memberCount: r.memberCount + 1 } : r))
        setMemberForm({ email: "", roleId: "" })
        setShowAddMember(false)
        toast.success(`Member "${name}" added`)
    }

    const handleRemoveMember = () => {
        if (!removeMemberId) return
        const member = members.find(m => m.id === removeMemberId)
        setMembers(p => p.filter(m => m.id !== removeMemberId))
        if (member) setRoles(p => p.map(r => r.id === member.roleId ? { ...r, memberCount: Math.max(0, r.memberCount - 1) } : r))
        setRemoveMemberId(null)
        toast.success(`Member "${member?.name}" removed`)
    }

    const changeMemberRole = (memberId: string, newRoleId: string) => {
        const member = members.find(m => m.id === memberId)
        if (!member) return
        const oldRoleId = member.roleId
        setMembers(p => p.map(m => m.id === memberId ? { ...m, roleId: newRoleId } : m))
        setRoles(p => p.map(r => {
            if (r.id === oldRoleId) return { ...r, memberCount: Math.max(0, r.memberCount - 1) }
            if (r.id === newRoleId) return { ...r, memberCount: r.memberCount + 1 }
            return r
        }))
        toast.success(`Role updated to ${roles.find(r => r.id === newRoleId)?.name}`)
    }

    const toggleRolePerm = (perm: string) => {
        setRoleForm(p => ({ ...p, permissions: p.permissions.includes(perm) ? p.permissions.filter(x => x !== perm) : [...p.permissions, perm] }))
    }

    return (
        <div className="flex flex-col gap-6 p-6 bg-[#fafafa] min-h-screen">
            <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium text-zinc-400">PROJECTS</span>
                <ChevronRight className="w-3 h-3 text-zinc-300" />
                <span className="text-[10px] font-medium text-zinc-400">PERMISSIONS</span>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Permissions & Roles</h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="roles" className="text-xs"><Shield className="w-3.5 h-3.5 mr-1.5" />Roles</TabsTrigger>
                    <TabsTrigger value="matrix" className="text-xs"><Lock className="w-3.5 h-3.5 mr-1.5" />Permission Matrix</TabsTrigger>
                    <TabsTrigger value="members" className="text-xs"><Users className="w-3.5 h-3.5 mr-1.5" />Members</TabsTrigger>
                </TabsList>

                {/* ===== ROLES TAB ===== */}
                <TabsContent value="roles" className="mt-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                            <Input placeholder="Search roles..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
                        </div>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setRoleForm({ name: "", description: "", permissions: [] }); setShowCreateRole(true) }}>
                            <Plus className="w-3.5 h-3.5 mr-1" />Create Role
                        </Button>
                    </div>
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Name</TableHead>
                                    <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Description</TableHead>
                                    <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Members</TableHead>
                                    <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Type</TableHead>
                                    <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase w-[60px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRoles.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center text-xs text-zinc-400 py-8">No roles found</TableCell></TableRow>
                                ) : filteredRoles.map(role => (
                                    <TableRow key={role.id}>
                                        <TableCell className="text-xs font-medium text-zinc-900">{role.name}</TableCell>
                                        <TableCell className="text-xs text-zinc-500 max-w-[250px] truncate">{role.description}</TableCell>
                                        <TableCell><Badge variant="secondary" className="text-[10px]">{role.memberCount}</Badge></TableCell>
                                        <TableCell>
                                            <Badge variant={role.type === "system" ? "default" : "outline"} className="text-[10px]">
                                                {role.type === "system" ? "System" : "Custom"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-3.5 h-3.5" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => { setRoleForm({ name: role.name, description: role.description, permissions: [...role.permissions] }); setEditingRole(role) }}>
                                                        <Edit3 className="w-3.5 h-3.5 mr-2" />Edit
                                                    </DropdownMenuItem>
                                                    {role.type === "custom" && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600" onClick={() => setDeleteRoleId(role.id)}>
                                                                <Trash2 className="w-3.5 h-3.5 mr-2" />Delete
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* ===== PERMISSION MATRIX TAB ===== */}
                <TabsContent value="matrix" className="mt-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-500">{editMode ? "Click checkboxes to modify permissions" : "Enable edit mode to change permissions"}</p>
                        <div className="flex items-center gap-2">
                            {editMode && (
                                <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={saveMatrix}>
                                    <Save className="w-3.5 h-3.5 mr-1" />Save Changes
                                </Button>
                            )}
                            <Button variant={editMode ? "destructive" : "outline"} className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => {
                                if (editMode) {
                                    // Reset to saved state
                                    const m: Record<string, string[]> = {}
                                    roles.forEach(r => { m[r.id] = [...r.permissions] })
                                    setMatrixState(m)
                                }
                                setEditMode(!editMode)
                            }}>
                                {editMode ? <><X className="w-3.5 h-3.5 mr-1" />Cancel</> : <><Edit3 className="w-3.5 h-3.5 mr-1" />Edit Mode</>}
                            </Button>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase min-w-[180px] sticky left-0 bg-white z-10">Permission</TableHead>
                                    {roles.map(role => (
                                        <TableHead key={role.id} className="text-[11px] font-semibold text-zinc-500 uppercase text-center min-w-[120px]">{role.name}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ALL_PERMISSIONS.map(perm => (
                                    <TableRow key={perm}>
                                        <TableCell className="text-xs font-medium text-zinc-700 sticky left-0 bg-white z-10">{perm}</TableCell>
                                        {roles.map(role => {
                                            const hasAccess = (matrixState[role.id] || []).includes(perm)
                                            return (
                                                <TableCell key={role.id} className="text-center">
                                                    <button onClick={() => toggleMatrixPerm(role.id, perm)} disabled={!editMode} className={`inline-flex items-center justify-center ${editMode ? "cursor-pointer hover:opacity-70" : "cursor-default"}`}>
                                                        {hasAccess ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-zinc-300" />}
                                                    </button>
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                {/* ===== MEMBERS TAB ===== */}
                <TabsContent value="members" className="mt-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                            <Input placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
                        </div>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setMemberForm({ email: "", roleId: "" }); setShowAddMember(true) }}>
                            <UserPlus className="w-3.5 h-3.5 mr-1" />Add Member
                        </Button>
                    </div>
                    <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Member</TableHead>
                                    <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Email</TableHead>
                                    <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Role</TableHead>
                                    <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase">Added</TableHead>
                                    <TableHead className="text-[11px] font-semibold text-zinc-500 uppercase w-[60px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMembers.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center text-xs text-zinc-400 py-8">No members found</TableCell></TableRow>
                                ) : filteredMembers.map(member => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-semibold">{member.avatar}</div>
                                                <span className="text-xs font-medium text-zinc-900">{member.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-zinc-500">{member.email}</TableCell>
                                        <TableCell>
                                            <Select value={member.roleId} onValueChange={v => changeMemberRole(member.id, v)}>
                                                <SelectTrigger className="h-7 text-xs w-[150px]"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {roles.map(r => <SelectItem key={r.id} value={r.id} className="text-xs">{r.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-xs text-zinc-500">{member.addedDate}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => setRemoveMemberId(member.id)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Create Role Dialog */}
            <Dialog open={showCreateRole} onOpenChange={setShowCreateRole}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Create Custom Role</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Define a new role with specific permissions.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-2">
                        <div><label className="text-xs font-medium text-zinc-500">Name</label><Input value={roleForm.name} onChange={e => setRoleForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. QA Lead" className="mt-1 h-8 text-xs" /></div>
                        <div><label className="text-xs font-medium text-zinc-500">Description</label><Input value={roleForm.description} onChange={e => setRoleForm(p => ({ ...p, description: e.target.value }))} placeholder="Role description" className="mt-1 h-8 text-xs" /></div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500">Permissions</label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {ALL_PERMISSIONS.map(perm => (
                                    <button key={perm} onClick={() => toggleRolePerm(perm)} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs border transition-colors text-left ${roleForm.permissions.includes(perm) ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-zinc-200 text-zinc-600"}`}>
                                        {roleForm.permissions.includes(perm) ? <CheckSquare className="w-3.5 h-3.5 flex-shrink-0" /> : <Square className="w-3.5 h-3.5 flex-shrink-0" />}
                                        {perm}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowCreateRole(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleCreateRole}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog open={!!editingRole} onOpenChange={o => !o && setEditingRole(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Edit Role</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Update the role details and permissions.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-2">
                        <div><label className="text-xs font-medium text-zinc-500">Name</label><Input value={roleForm.name} onChange={e => setRoleForm(p => ({ ...p, name: e.target.value }))} className="mt-1 h-8 text-xs" /></div>
                        <div><label className="text-xs font-medium text-zinc-500">Description</label><Input value={roleForm.description} onChange={e => setRoleForm(p => ({ ...p, description: e.target.value }))} className="mt-1 h-8 text-xs" /></div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500">Permissions</label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {ALL_PERMISSIONS.map(perm => (
                                    <button key={perm} onClick={() => toggleRolePerm(perm)} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs border transition-colors text-left ${roleForm.permissions.includes(perm) ? "bg-indigo-50 border-indigo-300 text-indigo-700" : "bg-white border-zinc-200 text-zinc-600"}`}>
                                        {roleForm.permissions.includes(perm) ? <CheckSquare className="w-3.5 h-3.5 flex-shrink-0" /> : <Square className="w-3.5 h-3.5 flex-shrink-0" />}
                                        {perm}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setEditingRole(null)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleEditRole}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Role Dialog */}
            <Dialog open={!!deleteRoleId} onOpenChange={o => !o && setDeleteRoleId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Delete Role</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-amber-500" />Members with this role will be moved to &quot;Project Member&quot;. This action cannot be undone.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setDeleteRoleId(null)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteRole}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Member Dialog */}
            <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Add Member</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Invite a new member to the project.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 py-2">
                        <div><label className="text-xs font-medium text-zinc-500">Email</label><Input value={memberForm.email} onChange={e => setMemberForm(p => ({ ...p, email: e.target.value }))} placeholder="user@company.com" className="mt-1 h-8 text-xs" /></div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500">Role</label>
                            <Select value={memberForm.roleId} onValueChange={v => setMemberForm(p => ({ ...p, roleId: v }))}>
                                <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue placeholder="Select a role" /></SelectTrigger>
                                <SelectContent>{roles.map(r => <SelectItem key={r.id} value={r.id} className="text-xs">{r.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setShowAddMember(false)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleAddMember}>Add Member</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Remove Member Dialog */}
            <Dialog open={!!removeMemberId} onOpenChange={o => !o && setRemoveMemberId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-zinc-900">Remove Member</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">Are you sure you want to remove {members.find(m => m.id === removeMemberId)?.name} from the project? They will lose access to all project data.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="h-8 rounded-md text-xs font-medium px-3" onClick={() => setRemoveMemberId(null)}>Cancel</Button>
                        <Button className="h-8 rounded-md text-xs font-medium px-3 shadow-sm active:scale-95 bg-red-600 hover:bg-red-700 text-white" onClick={handleRemoveMember}>Remove</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}