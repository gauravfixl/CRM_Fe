"use client"

import React, { useState } from "react"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

    const handleAddRole = () => {
        if (!newRole.role) {
            toast.error("Please enter a role name")
            return
        }

        const newEntry = {
            id: Math.random().toString(36).substr(2, 9),
            role: newRole.role,
            viewLevel: newRole.viewLevel,
            editAccess: newRole.editAccess,
            deleteAccess: newRole.deleteAccess
        }

        setVisibilityRules([...visibilityRules, newEntry])
        setShowAddRoleDialog(false)
        setNewRole({ role: "", viewLevel: "Assigned Only", editAccess: false, deleteAccess: false })
        toast.success("New role visibility rule added")
    }

    const handleDeleteRole = (id: string) => {
        setVisibilityRules(prev => prev.filter(r => r.id !== id))
        toast.success("Role removed from visibility matrix")
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Eye className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Access & Visibility</h1>
                            <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-black uppercase tracking-widest px-3">SECURITY LAYER</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Control who can view, edit, and delete client records across your organization.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Visibility settings reset")}
                        className="h-10 border-zinc-200 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button
                        onClick={() => setShowAddRoleDialog(true)}
                        className="h-10 bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Role
                    </Button>
                    <Button
                        onClick={() => handleAction("Visibility rules published")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-100 active:scale-95 transition-all"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Security Score</p>
                        <ShieldCheck className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">A+ Grade</p>
                        <p className="text-[10px] text-white">Optimal protection</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Restricted Roles</p>
                        <Lock className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{visibilityRules.filter(r => !r.editAccess && !r.deleteAccess).length} Roles</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Limited access</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Global Access</p>
                        <Globe className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{visibilityRules.filter(r => r.viewLevel === 'Global Access').length} Roles</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Full visibility</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Active Rules</p>
                        <Users className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">{visibilityRules.length} Rules</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Defined in matrix</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* VISIBILITY MATRIX */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Search roles..."
                            className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Role</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">View Level</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Edit Access</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-center">Delete Access</TableHead>
                            <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest text-right pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visibilityRules.map((rule) => (
                            <TableRow key={rule.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-all">
                                            <UserCheck className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-black text-zinc-900 italic tracking-tight">{rule.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4">
                                    <Badge variant="outline" className={`text-[10px] font-bold border-zinc-200 shadow-sm uppercase px-2 h-5 rounded-md ${rule.viewLevel === 'Global Access' ? 'text-emerald-600 border-emerald-100 bg-emerald-50/30' :
                                            rule.viewLevel === 'All Clients' ? 'text-blue-600 border-blue-100 bg-blue-50/30' :
                                                rule.viewLevel === 'Team Accounts' ? 'text-amber-600 border-amber-100 bg-amber-50/30' :
                                                    'text-zinc-500 bg-white'
                                        }`}>
                                        {rule.viewLevel}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <Switch
                                            checked={rule.editAccess}
                                            onCheckedChange={() => toggleAccess(rule.id, 'edit')}
                                            className="scale-75 data-[state=checked]:bg-blue-600"
                                        />
                                        <span className="text-[9px] font-black uppercase text-zinc-300 tracking-widest">
                                            {rule.editAccess ? 'ENABLED' : 'DISABLED'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-center">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <Switch
                                            checked={rule.deleteAccess}
                                            onCheckedChange={() => toggleAccess(rule.id, 'delete')}
                                            className="scale-75 data-[state=checked]:bg-rose-600"
                                        />
                                        <span className="text-[9px] font-black uppercase text-zinc-300 tracking-widest">
                                            {rule.deleteAccess ? 'ALLOWED' : 'BLOCKED'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 text-right pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg">
                                                <MoreVertical className="h-4 w-4 text-zinc-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleDeleteRole(rule.id)} className="text-rose-600 text-xs font-bold cursor-pointer">
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

            {/* ADD ROLE DIALOG */}
            <Dialog open={showAddRoleDialog} onOpenChange={setShowAddRoleDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black uppercase italic">Add Role Visibility</DialogTitle>
                        <DialogDescription className="text-xs text-zinc-500">
                            Define visibility and access permissions for a specific role.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role" className="text-xs font-bold uppercase text-zinc-600">Role Name</Label>
                            <Input
                                id="role"
                                value={newRole.role}
                                onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                                className="col-span-3 h-9"
                                placeholder="e.g. Marketing Manager"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="viewLevel" className="text-xs font-bold uppercase text-zinc-600">View Level</Label>
                            <Select
                                value={newRole.viewLevel}
                                onValueChange={(val) => setNewRole({ ...newRole, viewLevel: val })}
                            >
                                <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Assigned Only">Assigned Only</SelectItem>
                                    <SelectItem value="Team Accounts">Team Accounts</SelectItem>
                                    <SelectItem value="All Clients">All Clients</SelectItem>
                                    <SelectItem value="Global Access">Global Access</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                            <Label htmlFor="editAccess" className="text-xs font-bold uppercase text-zinc-600">Edit Access</Label>
                            <Switch
                                id="editAccess"
                                checked={newRole.editAccess}
                                onCheckedChange={(checked) => setNewRole({ ...newRole, editAccess: checked })}
                                className="data-[state=checked]:bg-blue-600Scale-75"
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                            <Label htmlFor="deleteAccess" className="text-xs font-bold uppercase text-zinc-600">Delete Access</Label>
                            <Switch
                                id="deleteAccess"
                                checked={newRole.deleteAccess}
                                onCheckedChange={(checked) => setNewRole({ ...newRole, deleteAccess: checked })}
                                className="data-[state=checked]:bg-rose-600 scale-75"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowAddRoleDialog(false)} className="h-9">Cancel</Button>
                        <Button onClick={handleAddRole} className="h-9 bg-blue-600 hover:bg-blue-700">Add Rule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* SECURITY NOTICE */}
            <div className="p-8 bg-zinc-900 rounded-3xl text-white shadow-2xl relative overflow-hidden border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="flex gap-6 items-center">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                            <Lock className="w-7 h-7 text-blue-400" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black uppercase italic tracking-widest mb-1 text-blue-400">Data Protection Policy</h4>
                            <p className="text-xs text-white/50 font-bold leading-relaxed max-w-xl italic">
                                All visibility changes are logged and audited. Ensure compliance with your organization's data governance policies before modifying access levels.
                            </p>
                        </div>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-900/40">
                        View Audit Trail
                    </Button>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full -mr-48 -mt-48 blur-[80px]" />
            </div>
        </div>
    )
}
