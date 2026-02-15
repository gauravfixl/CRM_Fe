"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    Plus,
    Edit,
    Trash2,
    Users,
    Lock,
    Unlock,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import { useRolesStore, AVAILABLE_MODULES, type Role, type ModulePermission, type DataScope } from "@/shared/data/roles-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Checkbox } from "@/shared/components/ui/checkbox";

const RolesPage = () => {
    const { toast } = useToast();
    const { roles, createRole, updateRole, deleteRole } = useRolesStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "Custom" as "System" | "Custom"
    });

    const handleCreate = () => {
        if (!formData.name) {
            toast({ title: "Error", description: "Role name is required", variant: "destructive" });
            return;
        }

        createRole({
            name: formData.name,
            description: formData.description,
            type: formData.type,
            permissions: []
        });

        setIsCreateOpen(false);
        setFormData({ name: "", description: "", type: "Custom" });
        toast({ title: "Role Created", description: `${formData.name} has been created successfully.` });
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setFormData({ name: role.name, description: role.description, type: role.type });
        setIsEditOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedRole) return;

        updateRole(selectedRole.id, {
            name: formData.name,
            description: formData.description
        });

        setIsEditOpen(false);
        setSelectedRole(null);
        toast({ title: "Role Updated", description: "Changes saved successfully." });
    };

    const handleDelete = (role: Role) => {
        if (role.type === 'System') {
            toast({ title: "Cannot Delete", description: "System roles cannot be deleted.", variant: "destructive" });
            return;
        }

        if (role.assignedTo.length > 0) {
            toast({ title: "Cannot Delete", description: "Role is assigned to employees. Unassign first.", variant: "destructive" });
            return;
        }

        deleteRole(role.id);
        toast({ title: "Role Deleted", description: `${role.name} has been removed.` });
    };

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        { label: "Total Roles", value: roles.length, color: "bg-[#CB9DF0]", icon: <Shield className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "System Roles", value: roles.filter(r => r.type === 'System').length, color: "bg-[#F0C1E1]", icon: <Lock className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Custom Roles", value: roles.filter(r => r.type === 'Custom').length, color: "bg-[#FFF9BF]", icon: <Unlock className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Active Assignments", value: roles.reduce((sum, r) => sum + r.assignedTo.length, 0), color: "bg-emerald-100", icon: <Users className="text-emerald-600" />, textColor: "text-emerald-900" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Roles & Permissions</h1>
                    <p className="text-slate-500 font-medium">Manage user roles and access control across the system.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                            <Plus className="mr-2 h-5 w-5" /> Create Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                        <DialogHeader>
                            <DialogTitle>Create New Role</DialogTitle>
                            <DialogDescription>Define a new role with custom permissions.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label>Role Name *</Label>
                                <Input
                                    placeholder="e.g. Team Lead"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Brief description of role responsibilities..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none min-h-[80px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleCreate}>
                                Create Role
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                        <DialogHeader>
                            <DialogTitle>Edit Role</DialogTitle>
                            <DialogDescription>Update role details.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label>Role Name *</Label>
                                <Input
                                    placeholder="e.g. Team Lead"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                    disabled={selectedRole?.type === 'System'}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Brief description..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none min-h-[80px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleUpdate}>
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4`}>
                            <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search roles..."
                        className="pl-12 h-12 rounded-xl bg-white border-none shadow-sm font-medium"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200 h-12 w-12">
                    <Filter size={18} />
                </Button>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoles.map((role) => (
                    <Card key={role.id} className="border-none shadow-lg hover:shadow-xl transition-all rounded-[2rem] bg-white p-6 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${role.type === 'System' ? 'bg-indigo-100 text-indigo-600' : 'bg-violet-100 text-violet-600'}`}>
                                    {role.type === 'System' ? <Lock size={20} /> : <Unlock size={20} />}
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-slate-900">{role.name}</h3>
                                    <Badge className={`mt-1 text-[10px] font-bold ${role.type === 'System' ? 'bg-indigo-100 text-indigo-700' : 'bg-violet-100 text-violet-700'} border-none`}>
                                        {role.type}
                                    </Badge>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical size={16} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                    <DropdownMenuItem onClick={() => handleEdit(role)} className="cursor-pointer">
                                        <Edit size={14} className="mr-2" /> Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.location.href = `/hrmcubicle/admin/roles/permissions?role=${role.id}`} className="cursor-pointer">
                                        <Shield size={14} className="mr-2" /> Manage Permissions
                                    </DropdownMenuItem>
                                    {role.type === 'Custom' && (
                                        <DropdownMenuItem onClick={() => handleDelete(role)} className="cursor-pointer text-rose-600">
                                            <Trash2 size={14} className="mr-2" /> Delete Role
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-2">{role.description}</p>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Permissions</span>
                                <span className="text-sm font-black text-slate-900">{role.permissions.length} Modules</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned To</span>
                                <span className="text-sm font-black text-indigo-600">{role.assignedTo.length} Users</span>
                            </div>
                        </div>

                        <Button
                            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 font-bold"
                            onClick={() => window.location.href = `/hrmcubicle/admin/roles/permissions?role=${role.id}`}
                        >
                            Configure Permissions
                        </Button>
                    </Card>
                ))}
            </div>

            {filteredRoles.length === 0 && (
                <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm">
                    <p className="text-slate-400 font-bold">No roles found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default RolesPage;
