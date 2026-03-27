"use client";

import { useState } from "react";
import {
    ShieldCheck,
    Search,
    MoreVertical,
    Shield,
    Trash2,
    Pencil,
    UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { showSuccess, showWarning } from "@/utils/toast";

type Admin = {
    id: string;
    name: string;
    email: string;
    role: "Super Admin" | "Admin";
    status: string;
    lastActive: string;
};

const ADMIN_ROLES = ["Super Admin", "Admin"] as const;

const existingUsers = [
    { id: "u1", name: "Emily Chen", email: "emily.c@fixlsolutions.com" },
    { id: "u2", name: "David Park", email: "david.p@fixlsolutions.com" },
    { id: "u3", name: "Lisa Wong", email: "lisa.w@fixlsolutions.com" },
];

const initialAdmins: Admin[] = [
    { id: "1", name: "Sarah Miller", email: "sarah.m@fixlsolutions.com", role: "Super Admin", status: "Active", lastActive: "2 mins ago" },
    { id: "2", name: "Robert Wilson", email: "robert.w@fixlsolutions.com", role: "Admin", status: "Active", lastActive: "1 hour ago" },
    { id: "3", name: "Vikas Singh", email: "vikas@fixlsolutions.com", role: "Super Admin", status: "Active", lastActive: "5 mins ago" },
];

export default function AdministratorsPage() {
    const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("All");
    const [assignOpen, setAssignOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [removeTarget, setRemoveTarget] = useState<Admin | null>(null);
    const [editTarget, setEditTarget] = useState<Admin | null>(null);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [editRole, setEditRole] = useState("");

    const filtered = admins.filter((admin) => {
        const matchesSearch =
            admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            admin.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "All" || admin.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalAdmins = admins.length;
    const superAdmins = admins.filter((a) => a.role === "Super Admin").length;
    const regularAdmins = admins.filter((a) => a.role === "Admin").length;

    const getInitials = (name: string) => {
        const parts = name.split(" ");
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name[0].toUpperCase();
    };

    const handleAssign = () => {
        if (!selectedUser || !selectedRole) {
            showWarning("Please select a user and role");
            return;
        }
        const user = existingUsers.find((u) => u.id === selectedUser);
        if (!user) return;
        const newAdmin: Admin = {
            id: Date.now().toString(),
            name: user.name,
            email: user.email,
            role: selectedRole as Admin["role"],
            status: "Active",
            lastActive: "Just now",
        };
        setAdmins((prev) => [...prev, newAdmin]);
        setSelectedUser("");
        setSelectedRole("");
        setAssignOpen(false);
        showSuccess(`${user.name} assigned as ${selectedRole}`);
    };

    const handleRemove = () => {
        if (!removeTarget) return;
        setAdmins((prev) => prev.filter((a) => a.id !== removeTarget.id));
        showSuccess(`${removeTarget.name} removed from administrators`);
        setRemoveTarget(null);
        setRemoveOpen(false);
    };

    const handleEditRole = () => {
        if (!editTarget || !editRole) return;
        setAdmins((prev) =>
            prev.map((a) => (a.id === editTarget.id ? { ...a, role: editRole as Admin["role"] } : a))
        );
        showSuccess(`${editTarget.name} role updated to ${editRole}`);
        setEditTarget(null);
        setEditRole("");
        setEditOpen(false);
    };

    const roleBadgeStyle = (role: string) => {
        if (role === "Super Admin") return "bg-primary/10 text-primary border-primary/20";
        return "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Administrators</h1>
                        <p className="text-xs text-gray-600 mt-1">Manage users with elevated access to your organization</p>
                    </div>
                    <Button
                        onClick={() => setAssignOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-white rounded-none"
                    >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Assign admin role
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-none p-4">
                        <p className="text-xs text-gray-600">Total admins</p>
                        <p className="text-xl font-semibold text-primary mt-1">{totalAdmins}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">All administrators</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-600">Super admins</p>
                        <p className="text-xl font-semibold text-gray-900 mt-1">{superAdmins}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Full access</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-4">
                        <p className="text-xs text-gray-600">Regular admins</p>
                        <p className="text-xl font-semibold text-gray-900 mt-1">{regularAdmins}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">Limited access</p>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white border border-gray-200 rounded-none p-3 flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email..."
                        className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
                    />
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-40 rounded-none h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none">
                            <SelectItem value="All">All roles</SelectItem>
                            <SelectItem value="Super Admin">Super admin</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-none overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="px-4 py-3 text-xs font-medium text-gray-600">Name & email</th>
                                <th className="px-4 py-3 text-xs font-medium text-gray-600">Admin role</th>
                                <th className="px-4 py-3 text-xs font-medium text-gray-600">Status</th>
                                <th className="px-4 py-3 text-xs font-medium text-gray-600">Last active</th>
                                <th className="px-4 py-3 text-xs font-medium text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center">
                                        <Shield className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-500">No administrators found</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-none bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                                                    {getInitials(admin.name)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                                                    <p className="text-xs text-gray-500">{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className={`rounded-none text-xs font-medium ${roleBadgeStyle(admin.role)}`}>
                                                {admin.role}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant="outline" className="rounded-none text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-200">
                                                {admin.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{admin.lastActive}</td>
                                        <td className="px-4 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                                                        <MoreVertical className="w-4 h-4 text-gray-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setEditTarget(admin);
                                                            setEditRole(admin.role);
                                                            setEditOpen(true);
                                                        }}
                                                    >
                                                        <Pencil className="w-3.5 h-3.5 mr-2" />
                                                        Edit role
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => { setRemoveTarget(admin); setRemoveOpen(true); }}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                                                        Remove admin
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Assign Admin Dialog */}
            <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden">
                    <div className="bg-primary px-6 py-4">
                        <h2 className="text-sm font-semibold text-white">Assign admin role</h2>
                        <p className="text-xs text-white/70 mt-0.5">Grant administrative access to an existing user</p>
                    </div>
                    <div className="px-6 py-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-700">Select user</Label>
                            <Select value={selectedUser} onValueChange={setSelectedUser}>
                                <SelectTrigger className="rounded-none">
                                    <SelectValue placeholder="Choose a user" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {existingUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-700">Admin role</Label>
                            <Select value={selectedRole} onValueChange={setSelectedRole}>
                                <SelectTrigger className="rounded-none">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {ADMIN_ROLES.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="px-6 py-4 border-t border-gray-100">
                        <Button variant="outline" onClick={() => setAssignOpen(false)} className="rounded-none">
                            Cancel
                        </Button>
                        <Button onClick={handleAssign} className="bg-primary hover:bg-primary/90 text-white rounded-none">
                            Assign role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Remove Admin Dialog */}
            <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden">
                    <div className="bg-primary px-6 py-4">
                        <h2 className="text-sm font-semibold text-white">Remove admin</h2>
                        <p className="text-xs text-white/70 mt-0.5">This will revoke administrative access</p>
                    </div>
                    <div className="px-6 py-4">
                        <p className="text-sm text-gray-700">
                            Are you sure you want to remove{" "}
                            <span className="font-semibold">{removeTarget?.name}</span> from administrators?
                        </p>
                    </div>
                    <DialogFooter className="px-6 py-4 border-t border-gray-100">
                        <Button variant="outline" onClick={() => setRemoveOpen(false)} className="rounded-none">
                            Cancel
                        </Button>
                        <Button onClick={handleRemove} variant="destructive" className="rounded-none">
                            Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden">
                    <div className="bg-primary px-6 py-4">
                        <h2 className="text-sm font-semibold text-white">Edit role</h2>
                        <p className="text-xs text-white/70 mt-0.5">Change admin role for {editTarget?.name}</p>
                    </div>
                    <div className="px-6 py-4 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-gray-700">Admin role</Label>
                            <Select value={editRole} onValueChange={setEditRole}>
                                <SelectTrigger className="rounded-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    {ADMIN_ROLES.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="px-6 py-4 border-t border-gray-100">
                        <Button variant="outline" onClick={() => setEditOpen(false)} className="rounded-none">
                            Cancel
                        </Button>
                        <Button onClick={handleEditRole} className="bg-primary hover:bg-primary/90 text-white rounded-none">
                            Update role
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
