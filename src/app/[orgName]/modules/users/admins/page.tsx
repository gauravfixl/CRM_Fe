"use client";

import { useState, useEffect, useMemo } from "react";
import {
    ShieldCheck,
    Search,
    MoreVertical,
    Shield,
    Trash2,
    Pencil,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/shared/components/ui/dialog";
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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { showSuccess, showWarning, showError } from "@/utils/toast";
import { fetchUsersApi, updateOrgUser } from "@/modules/crm/organizations/hooks/orgHooks";

type Admin = {
    id: string;
    name: string;
    email: string;
    role: "Super Admin" | "Admin";
    status: string;
    lastActive: string;
};

const ADMIN_ROLES = ["Super Admin", "Admin"] as const;
const ADMIN_ROLE_KEYS = ["Super Admin", "Admin", "super_admin", "admin", "superadmin"];

const mapApiUserToAdmin = (apiUser: any): Admin => {
    const name = [apiUser.firstName, apiUser.lastName].filter(Boolean).join(" ") || "Unknown";
    const role: Admin["role"] = apiUser.role?.toLowerCase().includes("super") ? "Super Admin" : "Admin";
    const status = apiUser.orgActive !== false ? "Active" : "Inactive";
    return { id: apiUser._id, name, email: apiUser.email || "", role, status, lastActive: "N/A" };
};

export default function AdministratorsPage() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [allNonAdminUsers, setAllNonAdminUsers] = useState<{ id: string; name: string; email: string }[]>([]);
    const [loading, setLoading] = useState(true);
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
    const [assignTouched, setAssignTouched] = useState<Record<string, boolean>>({});
    const [editTouched, setEditTouched] = useState<Record<string, boolean>>({});
    const [assigning, setAssigning] = useState(false);
    const [editing, setEditing] = useState(false);
    const [removing, setRemoving] = useState(false);

    const assignErrors = useMemo(() => {
        const e: Record<string, string> = {};
        if (assignTouched.user && !selectedUser) e.user = "Please select a user";
        if (assignTouched.role && !selectedRole) e.role = "Please select an admin role";
        return e;
    }, [selectedUser, selectedRole, assignTouched]);

    const editErrors = useMemo(() => {
        const e: Record<string, string> = {};
        if (editTouched.role && !editRole) e.role = "Please select a role";
        if (editTouched.role && editRole && editTarget && editRole === editTarget.role)
            e.role = "Pick a different role";
        return e;
    }, [editRole, editTarget, editTouched]);

    const loadAdmins = async () => {
        try {
            setLoading(true);
            const res = await fetchUsersApi();
            const data = res?.data || res || [];
            const usersArray = Array.isArray(data) ? data : data.users ? data.users : [];
            const adminUsers = usersArray.filter((u: any) =>
                ADMIN_ROLE_KEYS.some((key) => u.role?.toLowerCase() === key.toLowerCase())
            );
            setAdmins(adminUsers.map(mapApiUserToAdmin));
            const nonAdmins = usersArray.filter(
                (u: any) => !ADMIN_ROLE_KEYS.some((key) => u.role?.toLowerCase() === key.toLowerCase())
            );
            setAllNonAdminUsers(
                nonAdmins.map((u: any) => ({
                    id: u._id,
                    name: [u.firstName, u.lastName].filter(Boolean).join(" ") || "Unknown",
                    email: u.email || "",
                }))
            );
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to load administrators");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins();
    }, []);

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

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        setAssignTouched({ user: true, role: true });
        if (!selectedUser || !selectedRole) {
            showWarning("Please select a user and role");
            return;
        }
        const user = allNonAdminUsers.find((u) => u.id === selectedUser);
        if (!user) return;
        try {
            setAssigning(true);
            await updateOrgUser(user.id, { role: selectedRole });
            const newAdmin: Admin = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: selectedRole as Admin["role"],
                status: "Active",
                lastActive: "Just now",
            };
            setAdmins((prev) => [...prev, newAdmin]);
            setAllNonAdminUsers((prev) => prev.filter((u) => u.id !== selectedUser));
            setSelectedUser("");
            setSelectedRole("");
            setAssignTouched({});
            setAssignOpen(false);
            showSuccess(`${user.name} assigned as ${selectedRole}`);
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to assign admin role");
        } finally {
            setAssigning(false);
        }
    };

    const handleRemove = async () => {
        if (!removeTarget) return;
        try {
            setRemoving(true);
            await updateOrgUser(removeTarget.id, { role: "Member" });
            setAdmins((prev) => prev.filter((a) => a.id !== removeTarget.id));
            showSuccess(`${removeTarget.name} removed from administrators`);
            setRemoveTarget(null);
            setRemoveOpen(false);
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to remove admin");
        } finally {
            setRemoving(false);
        }
    };

    const handleEditRole = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditTouched({ role: true });
        if (!editTarget || !editRole) {
            showWarning("Please select a role");
            return;
        }
        if (editRole === editTarget.role) {
            showWarning("Pick a different role");
            return;
        }
        try {
            setEditing(true);
            await updateOrgUser(editTarget.id, { role: editRole });
            setAdmins((prev) =>
                prev.map((a) => (a.id === editTarget.id ? { ...a, role: editRole as Admin["role"] } : a))
            );
            showSuccess(`${editTarget.name} role updated to ${editRole}`);
            setEditTarget(null);
            setEditRole("");
            setEditTouched({});
            setEditOpen(false);
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to update role");
        } finally {
            setEditing(false);
        }
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
                    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-none p-4 text-white">
                        <p className="text-xs text-white/80">Total admins</p>
                        <p className="text-xl font-semibold text-white mt-1">{totalAdmins}</p>
                        <p className="text-[10px] text-white/60 mt-0.5">All administrators</p>
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
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-16 text-center">
                                        <p className="text-sm text-gray-500">Loading administrators...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
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

            {/* Assign Admin Role — side sheet */}
            <SideFormSheet
                open={assignOpen}
                onOpenChange={(o) => {
                    setAssignOpen(o);
                    if (!o) {
                        setAssignTouched({});
                        setSelectedUser("");
                        setSelectedRole("");
                    }
                }}
                title="Assign admin role"
                description="Grant administrative access to an existing user"
                icon={<ShieldCheck className="w-5 h-5" />}
                width="md"
                onSubmit={handleAssign}
                submitLabel="Assign role"
                loading={assigning}
            >
                <div className="space-y-4">
                    <Field
                        label="Select user"
                        required
                        error={assignErrors.user}
                        hint={
                            allNonAdminUsers.length === 0
                                ? "No non-admin users available"
                                : `${allNonAdminUsers.length} user${allNonAdminUsers.length === 1 ? "" : "s"} available`
                        }
                    >
                        <Select
                            value={selectedUser}
                            onValueChange={(v) => {
                                setSelectedUser(v);
                                setAssignTouched((t) => ({ ...t, user: true }));
                            }}
                        >
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue placeholder="Choose a user" />
                            </SelectTrigger>
                            <SelectContent>
                                {allNonAdminUsers.length === 0 ? (
                                    <div className="px-2 py-2 text-[12px] text-gray-500">
                                        No eligible users
                                    </div>
                                ) : (
                                    allNonAdminUsers.map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.name} ({user.email})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field
                        label="Admin role"
                        required
                        error={assignErrors.role}
                        hint="Super Admin = full access; Admin = limited"
                    >
                        <Select
                            value={selectedRole}
                            onValueChange={(v) => {
                                setSelectedRole(v);
                                setAssignTouched((t) => ({ ...t, role: true }));
                            }}
                        >
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ADMIN_ROLES.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            {/* Edit Admin Role — side sheet */}
            <SideFormSheet
                open={editOpen}
                onOpenChange={(o) => {
                    setEditOpen(o);
                    if (!o) {
                        setEditTouched({});
                        setEditTarget(null);
                        setEditRole("");
                    }
                }}
                title="Edit admin role"
                description={editTarget ? `Change role for ${editTarget.name}` : "Change admin role"}
                icon={<Pencil className="w-5 h-5" />}
                width="md"
                onSubmit={handleEditRole}
                submitLabel="Update role"
                loading={editing}
            >
                <div className="space-y-4">
                    {editTarget && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                                {getInitials(editTarget.name)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[13px] font-semibold text-gray-900 truncate">{editTarget.name}</p>
                                <p className="text-[11.5px] text-gray-500 truncate">{editTarget.email}</p>
                            </div>
                            <Badge variant="outline" className={`ml-auto rounded-md text-[10px] font-medium ${roleBadgeStyle(editTarget.role)}`}>
                                Current: {editTarget.role}
                            </Badge>
                        </div>
                    )}

                    <Field
                        label="New admin role"
                        required
                        error={editErrors.role}
                        hint="Must differ from current role"
                    >
                        <Select
                            value={editRole}
                            onValueChange={(v) => {
                                setEditRole(v);
                                setEditTouched((t) => ({ ...t, role: true }));
                            }}
                        >
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ADMIN_ROLES.map((role) => (
                                    <SelectItem
                                        key={role}
                                        value={role}
                                        disabled={editTarget?.role === role}
                                    >
                                        {role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            {/* Remove Admin — confirmation dialog (center, not form) */}
            <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
                <DialogContent className="sm:max-w-[440px] rounded-xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-5 pb-4 border-b border-slate-100">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">Remove admin?</h2>
                                <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">
                                    This will revoke administrative access. The user will become a regular member.
                                </p>
                            </div>
                        </div>
                    </div>
                    {removeTarget && (
                        <div className="px-5 py-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                                    {getInitials(removeTarget.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13px] font-semibold text-gray-900 truncate">{removeTarget.name}</p>
                                    <p className="text-[11.5px] text-gray-500 truncate">{removeTarget.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 gap-2 sm:justify-end">
                        <Button
                            variant="outline"
                            onClick={() => setRemoveOpen(false)}
                            disabled={removing}
                            className="h-9 text-[13px] font-medium rounded-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRemove}
                            disabled={removing}
                            variant="destructive"
                            className="h-9 text-[13px] font-medium rounded-lg gap-2"
                        >
                            {removing && (
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                            Remove admin
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
