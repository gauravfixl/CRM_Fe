"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    ShieldAlert,
    Plus,
    MoreHorizontal,
    Check,
    X,
    Lock,
    Users,
    Edit3,
    Trash2,
    Loader2
} from "lucide-react";
import SubHeader from "@/components/custom/SubHeader";
import { CustomButton } from "@/components/custom/CustomButton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { getAllRolesNPermissions, addRole, deleteRole, updateRole } from "@/hooks/roleNPermissionHooks";
import { decryptData } from "@/utils/crypto";

interface RoleItem {
    id: string;
    name: string;
    users: number;
    description: string;
    type: "System" | "Custom";
    permissions: Record<string, boolean>;
}

/** Maps an API role object to the shape the UI expects. */
function mapApiRole(apiRole: any): RoleItem {
    const permMap: Record<string, boolean> = {};
    if (Array.isArray(apiRole.permissions)) {
        apiRole.permissions.forEach((p: string) => {
            permMap[p] = true;
        });
    } else if (apiRole.permissions && typeof apiRole.permissions === "object") {
        Object.entries(apiRole.permissions).forEach(([key, val]) => {
            permMap[key] = Boolean(val);
        });
    }

    return {
        id: apiRole._id || apiRole.id,
        name: apiRole.roleName || apiRole.name || "Unnamed Role",
        users: apiRole.userCount ?? apiRole.users ?? 0,
        description: apiRole.description || "",
        type: apiRole.isCustom ? "Custom" : "System",
        permissions: permMap,
    };
}

export default function RolesPage() {
    const [roles, setRoles] = useState<RoleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Edit role state
    const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
    const [updating, setUpdating] = useState(false);
    const [editName, setEditName] = useState("");
    const [editManageUsers, setEditManageUsers] = useState(false);
    const [editViewBilling, setEditViewBilling] = useState(false);
    const [editEditSettings, setEditEditSettings] = useState(false);

    // Refs for the create-role form fields
    const roleNameRef = useRef<HTMLInputElement>(null);
    const manageUsersRef = useRef<HTMLButtonElement>(null);
    const viewBillingRef = useRef<HTMLButtonElement>(null);
    const editSettingsRef = useRef<HTMLButtonElement>(null);

    const openEditDialog = (role: RoleItem) => {
        setEditingRole(role);
        setEditName(role.name);
        // Heuristic — derive switch states from existing permissions map
        setEditManageUsers(
            !!(role.permissions["VIEW_ORG_USER"] || role.permissions["UPDATE_ORG_USER"] || role.permissions["DELETE_ORG_USER"] || role.permissions["SEND_INVITATION"])
        );
        setEditViewBilling(
            !!(role.permissions["VIEW_INVOICE"] || role.permissions["GENERATE_REPORT"])
        );
        setEditEditSettings(!!role.permissions["EDIT_ORGANIZATION"]);
    };

    const handleUpdateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRole) return;
        const trimmed = editName.trim();

        if (!trimmed) return toast.error("Please enter a role name");
        if (/\d/.test(trimmed)) return toast.error("Role name should not contain numbers");
        if (trimmed.length < 3) return toast.error("Role name should be at least 3 characters");
        if (!editManageUsers && !editViewBilling && !editEditSettings) {
            return toast.error("Please select at least one capability");
        }

        const permissions: any[] = [];
        if (editManageUsers) {
            permissions.push({ module: "organization", actions: ["VIEW_ORG_USER", "UPDATE_ORG_USER", "DELETE_ORG_USER", "SEND_INVITATION"] });
        }
        if (editViewBilling) {
            permissions.push({ module: "invoice", actions: ["VIEW_INVOICE", "GENERATE_REPORT"] });
        }
        if (editEditSettings) {
            permissions.push({ module: "organization", actions: ["EDIT_ORGANIZATION"] });
        }

        setUpdating(true);
        try {
            await updateRole(
                {
                    name: trimmed,
                    role: trimmed.toLowerCase().replace(/\s+/g, "-"),
                    permissions,
                    scope: "sc-org",
                    isCustom: true,
                    description: `Custom role for ${trimmed}`,
                },
                editingRole.id
            );
            toast.success(`${trimmed} updated successfully`);
            setEditingRole(null);
            await fetchRoles();
        } catch (err: any) {
            console.error("Error updating role:", err);
            toast.error(err?.response?.data?.message || "Failed to update role.");
        } finally {
            setUpdating(false);
        }
    };

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        try {
            const resp = await getAllRolesNPermissions({ scope: "sc-org" });
            let rolesData: any[] = [];

            if (resp?.data?.permissions && resp?.data?.iv) {
                // Encrypted response
                rolesData = decryptData(resp.data.permissions, resp.data.iv);
            } else if (resp?.data?.roles && resp?.data?.iv) {
                // Alternative encrypted shape
                rolesData = decryptData(resp.data.roles, resp.data.iv);
            } else if (Array.isArray(resp?.data?.roles)) {
                rolesData = resp.data.roles;
            } else if (Array.isArray(resp?.data)) {
                rolesData = resp.data;
            }

            if (Array.isArray(rolesData)) {
                setRoles(rolesData.map(mapApiRole));
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            toast.error("Failed to load roles.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        const roleName = roleNameRef.current?.value?.trim();
        
        // Validation
        if (!roleName) {
            toast.error("Please enter a role name");
            return;
        }

        if (/\d/.test(roleName)) {
            toast.error("Role name should not contain numbers");
            return;
        }

        if (roleName.length < 3) {
            toast.error("Role name should be at least 3 characters");
            return;
        }

        // Read switch states from data-state attribute
        const manageUsers = manageUsersRef.current?.getAttribute("data-state") === "checked";
        const viewBilling = viewBillingRef.current?.getAttribute("data-state") === "checked";
        const editSettings = editSettingsRef.current?.getAttribute("data-state") === "checked";

        // Must have at least one permission
        if (!manageUsers && !viewBilling && !editSettings) {
            toast.error("Please select at least one capability");
            return;
        }

        // Format permissions for the backend: array of { module, actions }
        const permissions: any[] = [];
        
        if (manageUsers) {
            permissions.push({
                module: "organization",
                actions: ["VIEW_ORG_USER", "UPDATE_ORG_USER", "DELETE_ORG_USER", "SEND_INVITATION"]
            });
        }
        
        if (viewBilling) {
            permissions.push({
                module: "invoice",
                actions: ["VIEW_INVOICE", "GENERATE_REPORT"]
            });
        }
        
        if (editSettings) {
            permissions.push({
                module: "organization",
                actions: ["EDIT_ORGANIZATION"]
            });
        }

        setCreating(true);
        try {
            // Backend expects 'name' and 'role' (slug)
            await addRole({
                name: roleName,
                role: roleName.toLowerCase().replace(/\s+/g, '-'), 
                permissions,
                scope: "sc-org",
                isCustom: true,
                description: `Custom role for ${roleName}`
            });
            toast.success("New role created successfully.");
            setDialogOpen(false);
            await fetchRoles();
        } catch (error) {
            console.error("Error creating role:", error);
            toast.error("Failed to create role. Ensure all fields are valid.");
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteRole = async (role: RoleItem) => {
        setDeletingId(role.id);
        try {
            await deleteRole(role.id);
            toast.success(`Deleted ${role.name}`);
            setRoles((prev) => prev.filter((r) => r.id !== role.id));
        } catch (error) {
            console.error("Error deleting role:", error);
            toast.error(`Failed to delete ${role.name}`);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 font-outfit text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Roles & Permissions"
                breadcrumbItems={[
                    { label: "Org Admins", href: "#" },
                    { label: "Org Staff", href: "#" },
                    { label: "Org Roles", href: "#" }
                ]}
                rightControls={
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <CustomButton className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-semibold shadow-xl border-0">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Custom Role
                            </CustomButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
                            <div className="h-2 bg-indigo-600 w-full" />
                            <div className="p-6 sm:p-8 space-y-6">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Define New Role</DialogTitle>
                                    <DialogDescription className="font-medium text-zinc-500">Create a unique permission set for specific operational needs.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleCreateRole} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Role Name</label>
                                        <Input ref={roleNameRef} className="rounded-xl font-medium h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800" placeholder="e.g. Finance Manager" required />
                                    </div>
                                    <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl bg-white dark:bg-zinc-950">
                                        <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider block mb-4">Capabilities</label>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Manage Users</span>
                                            <Switch ref={manageUsersRef} className="data-[state=checked]:bg-indigo-600" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">View Billing</span>
                                            <Switch ref={viewBillingRef} className="data-[state=checked]:bg-indigo-600" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Edit Settings</span>
                                            <Switch ref={editSettingsRef} className="data-[state=checked]:bg-indigo-600" />
                                        </div>
                                    </div>
                                    <CustomButton type="submit" disabled={creating} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl h-12 text-sm">
                                        {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        {creating ? "Saving..." : "Save Role Definition"}
                                    </CustomButton>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : roles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                        <ShieldAlert className="w-12 h-12 mb-4" />
                        <p className="text-lg font-semibold">No roles found</p>
                        <p className="text-sm">Create a custom role to get started.</p>
                    </div>
                ) : (
                <div className="grid grid-cols-1 gap-6">
                    {roles.map((role) => (
                        <Card key={role.id} className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all rounded-3xl overflow-hidden group">
                            <div className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 ${role.type === 'System' ? 'border-l-4 border-l-slate-400 dark:border-l-slate-600' : 'border-l-4 border-l-indigo-500'}`}>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">{role.name}</h3>
                                        {role.type === 'System' ? (
                                            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-0 rounded-full text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 gap-1">
                                                <Lock className="w-3 h-3" /> System Locked
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-0 rounded-full text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5">
                                                Custom
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-zinc-500 font-medium">{role.description}</p>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                            <Users className="w-5 h-5 text-zinc-400" />
                                            {role.users}
                                        </span>
                                        <span className="text-[10px] font-semibold uppercase text-zinc-400 tracking-wider">Active Users</span>
                                    </div>

                                    <div className="h-12 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block" />

                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 min-w-[200px]">
                                        {Object.entries(role.permissions).map(([key, val]) => (
                                            <div key={key} className="flex items-center gap-2 text-xs">
                                                {val ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />}
                                                <span className={`font-semibold uppercase tracking-wider text-[10px] ${val ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400'}`}>{key}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <CustomButton variant="outline" size="icon" className="h-10 w-10 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800" disabled={role.type === 'System'} onClick={() => { if (role.type !== 'System') openEditDialog(role) }}>
                                            <Edit3 className="w-4 h-4 text-zinc-500" />
                                        </CustomButton>
                                        {role.type !== 'System' && (
                                            <CustomButton variant="outline" size="icon" className="h-10 w-10 rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-100" disabled={deletingId === role.id} onClick={() => handleDeleteRole(role)}>
                                                {deletingId === role.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </CustomButton>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
                )}
            </div>

            {/* EDIT ROLE DIALOG */}
            <Dialog open={!!editingRole} onOpenChange={(open) => { if (!open) setEditingRole(null); }}>
                <DialogContent className="sm:max-w-lg rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
                    <div className="h-2 bg-indigo-600 w-full" />
                    <div className="p-6 sm:p-8 space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">Edit Role</DialogTitle>
                            <DialogDescription className="font-medium text-zinc-500">Update permission set for this role.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdateRole} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider">Role Name</label>
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="rounded-xl font-medium h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                    placeholder="e.g. Finance Manager"
                                    required
                                />
                            </div>
                            <div className="space-y-4 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl bg-white dark:bg-zinc-950">
                                <label className="text-xs uppercase font-semibold text-zinc-500 tracking-wider block mb-4">Capabilities</label>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Manage Users</span>
                                    <Switch checked={editManageUsers} onCheckedChange={setEditManageUsers} className="data-[state=checked]:bg-indigo-600" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">View Billing</span>
                                    <Switch checked={editViewBilling} onCheckedChange={setEditViewBilling} className="data-[state=checked]:bg-indigo-600" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Edit Settings</span>
                                    <Switch checked={editEditSettings} onCheckedChange={setEditEditSettings} className="data-[state=checked]:bg-indigo-600" />
                                </div>
                            </div>
                            <CustomButton type="submit" disabled={updating} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl h-12 text-sm">
                                {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {updating ? "Updating..." : "Update Role"}
                            </CustomButton>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
