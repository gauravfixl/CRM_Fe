"use client"

import React, { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import {
    ShieldCheck,
    Eye,
    EyeOff,
    Users,
    Lock,
    Unlock,
    Search,
    RefreshCcw,
    Save,
    Building2,
    UserCheck,
    Globe,
    Plus,
    MoreVertical,
    Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ClientVisibilityPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showAddRoleDialog, setShowAddRoleDialog] = useState(false)

    const [visibilityRules, setVisibilityRules] = useState([
        { id: "1", role: "Account Manager", viewLevel: "Assigned Only", editAccess: true, deleteAccess: false },
        { id: "2", role: "Sales Director", viewLevel: "Team Accounts", editAccess: true, deleteAccess: true },
        { id: "3", role: "Finance Team", viewLevel: "All Clients", editAccess: false, deleteAccess: false },
        { id: "4", role: "Support Agent", viewLevel: "Assigned Only", editAccess: false, deleteAccess: false },
        { id: "5", role: "System Admin", viewLevel: "Global Access", editAccess: true, deleteAccess: true },
    ])

    const [newRole, setNewRole] = useState({
        role: "",
        viewLevel: "Assigned Only",
        editAccess: false,
        deleteAccess: false
    })
    const [roleTouched, setRoleTouched] = useState<Record<string, boolean>>({})
    const [submitting, setSubmitting] = useState(false)

    const roleErrors = useMemo(() => {
        const e: Record<string, string> = {}
        if (roleTouched.role) {
            const r = newRole.role.trim()
            if (!r) e.role = "Role name is required"
            else if (r.length < 2) e.role = "Name too short (min 2 chars)"
            else if (r.length > 60) e.role = "Name too long (max 60 chars)"
            else if (!/^[A-Za-z0-9\s&()./-]+$/.test(r))
                e.role = "Only letters, numbers, spaces and & ( ) . / -"
            else if (visibilityRules.some(v => v.role.toLowerCase() === r.toLowerCase()))
                e.role = "A rule for this role already exists"
        }
        return e
    }, [newRole, roleTouched, visibilityRules])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1000)
    }

    const toggleAccess = (id: string, type: 'edit' | 'delete') => {
        setVisibilityRules(prev => prev.map(r =>
            r.id === id ? {
                ...r,
                [type === 'edit' ? 'editAccess' : 'deleteAccess']: !r[type === 'edit' ? 'editAccess' : 'deleteAccess']
            } : r
        ))
        toast.info(`${type === 'edit' ? 'Edit' : 'Delete'} access updated`)
    }

    const handleAddRole = async (e: React.FormEvent) => {
        e.preventDefault()
        setRoleTouched({ role: true })

        const roleName = newRole.role.trim()
        if (!roleName) return toast.error("Role name is required")
        if (roleName.length < 2) return toast.error("Role name too short")
        if (!/^[A-Za-z0-9\s&()./-]+$/.test(roleName))
            return toast.error("Role name contains invalid characters")
        if (visibilityRules.some(v => v.role.toLowerCase() === roleName.toLowerCase()))
            return toast.error("A visibility rule for this role already exists")

        setSubmitting(true)
        await new Promise((r) => setTimeout(r, 300))

        const newEntry = {
            id: Math.random().toString(36).substr(2, 9),
            role: roleName,
            viewLevel: newRole.viewLevel,
            editAccess: newRole.editAccess,
            deleteAccess: newRole.deleteAccess
        }

        setVisibilityRules([...visibilityRules, newEntry])
        setShowAddRoleDialog(false)
        setNewRole({ role: "", viewLevel: "Assigned Only", editAccess: false, deleteAccess: false })
        setRoleTouched({})
        setSubmitting(false)
        toast.success("New role visibility rule added")
    }

    const handleDeleteRole = (id: string) => {
        setVisibilityRules(prev => prev.filter(r => r.id !== id))
        toast.success("Role removed from visibility matrix")
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border bg-white shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary/70 to-primary flex items-center justify-center text-white shadow-sm">
                        <Eye className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-sm font-semibold text-zinc-900">Access & Visibility</h1>
                            <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-medium px-2 rounded-md">Security Layer</Badge>
                        </div>
                        <p className="text-xs text-slate-500">Control who can view, edit, and delete client records across your organization.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Visibility settings reset")}
                        className="h-8 border text-xs font-medium px-4 rounded-lg shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-3.5 h-3.5 mr-2" />
                        Reset
                    </Button>
                    <Button
                        onClick={() => setShowAddRoleDialog(true)}
                        className="h-8 bg-white border text-zinc-900 hover:bg-zinc-50 text-xs font-medium px-4 rounded-lg shadow-sm transition-all"
                    >
                        <Plus className="w-3.5 h-3.5 mr-2" />
                        Add Role
                    </Button>
                    <Button
                        onClick={() => handleAction("Visibility rules published")}
                        className="h-8 bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 rounded-lg shadow-sm active:scale-95 transition-all"
                    >
                        <Save className="w-3.5 h-3.5 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none text-white shadow-lg rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs opacity-80">Security Score</p>
                        <ShieldCheck className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-white">A+ Grade</p>
                        <p className="text-[10px] text-white">Optimal protection</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500">Restricted Roles</p>
                        <Lock className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">{visibilityRules.filter(r => !r.editAccess && !r.deleteAccess).length} Roles</p>
                        <p className="text-[10px] text-slate-500">Limited access</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500">Global Access</p>
                        <Globe className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">{visibilityRules.filter(r => r.viewLevel === 'Global Access').length} Roles</p>
                        <p className="text-[10px] text-slate-500">Full visibility</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500">Active Rules</p>
                        <Users className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">{visibilityRules.length} Rules</p>
                        <p className="text-[10px] text-slate-500">Defined in matrix</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* VISIBILITY MATRIX */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Search roles..."
                            className="pl-10 h-9 bg-white border-zinc-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="px-4 py-3 text-[10px] font-medium text-slate-500">Role</TableHead>
                            <TableHead className="py-3 text-[10px] font-medium text-slate-500">View Level</TableHead>
                            <TableHead className="py-3 text-[10px] font-medium text-slate-500 text-center">Edit Access</TableHead>
                            <TableHead className="py-3 text-[10px] font-medium text-slate-500 text-center">Delete Access</TableHead>
                            <TableHead className="py-3 text-[10px] font-medium text-slate-500 text-right pr-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visibilityRules.map((rule) => (
                            <TableRow key={rule.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-all">
                                            <UserCheck className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-xs font-medium text-zinc-900">{rule.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <Badge variant="outline" className={`text-[10px] font-medium border-zinc-200 shadow-sm px-2 h-5 rounded-md ${rule.viewLevel === 'Global Access' ? 'text-emerald-600 border-emerald-100 bg-emerald-50/30' :
                                            rule.viewLevel === 'All Clients' ? 'text-blue-600 border-blue-100 bg-blue-50/30' :
                                                rule.viewLevel === 'Team Accounts' ? 'text-amber-600 border-amber-100 bg-amber-50/30' :
                                                    'text-zinc-500 bg-white'
                                        }`}>
                                        {rule.viewLevel}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <Switch
                                            checked={rule.editAccess}
                                            onCheckedChange={() => toggleAccess(rule.id, 'edit')}
                                            className="scale-75 data-[state=checked]:bg-blue-600"
                                        />
                                        <span className="text-[10px] font-medium text-zinc-300">
                                            {rule.editAccess ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <Switch
                                            checked={rule.deleteAccess}
                                            onCheckedChange={() => toggleAccess(rule.id, 'delete')}
                                            className="scale-75 data-[state=checked]:bg-rose-600"
                                        />
                                        <span className="text-[10px] font-medium text-zinc-300">
                                            {rule.deleteAccess ? 'Allowed' : 'Blocked'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg">
                                                <MoreVertical className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleDeleteRole(rule.id)} className="text-rose-600 text-xs font-medium cursor-pointer">
                                                <Trash2 className="w-3.5 h-3.5 mr-2" />
                                                Remove Role
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Add Role Visibility — side sheet */}
            <SideFormSheet
                open={showAddRoleDialog}
                onOpenChange={(o) => {
                    setShowAddRoleDialog(o)
                    if (!o) {
                        setRoleTouched({})
                        setNewRole({ role: "", viewLevel: "Assigned Only", editAccess: false, deleteAccess: false })
                    }
                }}
                title="Add Role Visibility"
                description="Define visibility and access permissions for a specific role."
                icon={<Eye className="w-5 h-5" />}
                width="md"
                onSubmit={handleAddRole}
                submitLabel="Add Rule"
                loading={submitting}
            >
                <div className="space-y-4">
                    <Field label="Role Name" required error={roleErrors.role} hint="2–60 chars. Must be unique">
                        <Input
                            value={newRole.role}
                            onChange={(e) => setNewRole({ ...newRole, role: e.target.value.slice(0, 60) })}
                            onBlur={() => setRoleTouched((t) => ({ ...t, role: true }))}
                            placeholder="e.g. Marketing Manager"
                            maxLength={60}
                            className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                        />
                    </Field>

                    <Field label="View Level" hint="What client records this role can see">
                        <Select
                            value={newRole.viewLevel}
                            onValueChange={(val) => setNewRole({ ...newRole, viewLevel: val })}
                        >
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Assigned Only">Assigned Only</SelectItem>
                                <SelectItem value="Team Accounts">Team Accounts</SelectItem>
                                <SelectItem value="All Clients">All Clients</SelectItem>
                                <SelectItem value="Global Access">Global Access</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <div className="space-y-2.5">
                        <p className="text-[13px] font-semibold text-[#374151]">Permissions</p>
                        <div className="flex items-center justify-between p-3.5 bg-[#FAFBFC] rounded-xl border border-[#EEF1F6]">
                            <div>
                                <Label htmlFor="editAccess" className="text-[13px] font-semibold text-zinc-900 cursor-pointer">
                                    Edit Access
                                </Label>
                                <p className="text-[11.5px] text-zinc-500 mt-0.5">Role can modify client records in their visibility scope</p>
                            </div>
                            <Switch
                                id="editAccess"
                                checked={newRole.editAccess}
                                onCheckedChange={(checked) => setNewRole({ ...newRole, editAccess: checked })}
                                className="data-[state=checked]:bg-primary"
                            />
                        </div>
                        <div className="flex items-center justify-between p-3.5 bg-[#FAFBFC] rounded-xl border border-[#EEF1F6]">
                            <div>
                                <Label htmlFor="deleteAccess" className="text-[13px] font-semibold text-zinc-900 cursor-pointer">
                                    Delete Access
                                </Label>
                                <p className="text-[11.5px] text-zinc-500 mt-0.5">Role can archive or permanently remove client records</p>
                            </div>
                            <Switch
                                id="deleteAccess"
                                checked={newRole.deleteAccess}
                                onCheckedChange={(checked) => setNewRole({ ...newRole, deleteAccess: checked })}
                                className="data-[state=checked]:bg-rose-600"
                            />
                        </div>
                    </div>
                </div>
            </SideFormSheet>

            {/* SECURITY NOTICE */}
            <div className="p-5 bg-zinc-900 rounded-xl text-white shadow-lg relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                    <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/10">
                            <Lock className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-1 text-blue-400">Data Protection Policy</h4>
                            <p className="text-xs text-white/50 font-medium leading-relaxed max-w-xl">
                                All visibility changes are logged and audited. Ensure compliance with your organization's data governance policies before modifying access levels.
                            </p>
                        </div>
                    </div>
                    <Button
                        onClick={() => toast.info("Audit trail feature coming soon")}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-6 rounded-lg text-xs font-medium shadow-sm"
                    >
                        View Audit Trail
                    </Button>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full -mr-48 -mt-48 blur-[80px]" />
            </div>
        </div>
    )
}
