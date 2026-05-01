"use client";

import React, { useEffect, useState } from "react";
import {
    Users,
    Search,
    Filter,
    MoreHorizontal,
    ShieldCheck,
    UserPlus,
    Mail,
    Download,
    Plus,
    Loader2,
    ShieldCheck as RoleIcon,
    AtSign
} from "lucide-react";
import SubHeader from "@/components/custom/SubHeader";
import { CustomButton } from "@/components/custom/CustomButton";
import { useParams, useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { updateOrgUser } from "@/modules/crm/organizations/hooks/orgHooks";
import { getAllRolesNPermissions } from "@/hooks/roleNPermissionHooks";
import { decryptData } from "@/utils/crypto";
import { ROLE_DISPLAY_NAMES } from "@/shared/utils/module-permission-map";

type OrgUser = {
    memberId: string;
    name: string;
    email: string;
    role: string;
    orgActive: boolean;
    joinedAt?: string;
};

export default function UsersListPage() {
    const router = useRouter();
    const params = useParams();
    const orgName =
        (params?.orgName as string) ||
        (typeof window !== "undefined" ? localStorage.getItem("orgName") || "" : "");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<OrgUser[]>([]);
    const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

    const handleExportCSV = () => {
        const header = ["Name", "Email", "Role", "Status", "Joined"];
        const rows = users.map((u) => [
            u.name || "",
            u.email || "",
            u.role || "",
            u.orgActive ? "Active" : "Inactive",
            u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : "",
        ]);
        const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
        const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `org-users-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("CSV exported");
    };

    const handleDeactivateUser = async (user: OrgUser) => {
        setDeactivatingId(user.memberId);
        try {
            await updateOrgUser(user.memberId, { orgActive: false });
            setUsers((prev) =>
                prev.map((u) => (u.memberId === user.memberId ? { ...u, orgActive: false } : u))
            );
            toast.success(`Revoked access for ${user.name}`);
        } catch (err: any) {
            console.error("Failed to deactivate user:", err);
            toast.error(err?.response?.data?.message || "Failed to deactivate user");
        } finally {
            setDeactivatingId(null);
        }
    };
    
    // Form and Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteData, setInviteData] = useState({
        name: "",
        email: "",
        role: ""
    });
    const [roles, setRoles] = useState<{ name: string; id: string; roleId: string; isCustom?: boolean }[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const orgId =
                    (typeof window !== "undefined" &&
                        (localStorage.getItem("orgID") || localStorage.getItem("orgId"))) ||
                    "";
                const params: any = { scope: "sc-org" };
                if (orgId) params.orgId = orgId;
                const res = await getAllRolesNPermissions(params);

                let list: any[] = [];
                if (res?.data?.permissions && res?.data?.iv) {
                    list = decryptData(res.data.permissions, res.data.iv) || [];
                } else if (Array.isArray(res?.data?.roles)) {
                    list = res.data.roles;
                } else if (Array.isArray(res?.data)) {
                    list = res.data;
                }

                setRoles(
                    list.map((r: any) => ({
                        name: ROLE_DISPLAY_NAMES[r.name] || r.name,
                        id: r.role || r.name,
                        roleId: r._id || r.id || r.role || r.name,
                        isCustom: !!r.isCustom,
                    }))
                );
            } catch (e) {
                console.error("Failed to load roles", e);
                toast.error("Failed to load roles for invitation");
            }
        };
        fetchRoles();
    }, []);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Validation: No numbers allowed in name
        if (/\d/.test(val)) {
            toast.error("Name should not contain numbers");
            return;
        }
        setInviteData({ ...inviteData, name: val });
    };

    const handleInviteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Comprehensive Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!inviteData.name?.trim()) {
            toast.error("Please enter a full name");
            return;
        }

        if (/\d/.test(inviteData.name)) {
            toast.error("Name should not contain numbers");
            return;
        }

        if (!inviteData.email?.trim()) {
            toast.error("Please enter an email address");
            return;
        }

        if (!emailRegex.test(inviteData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (!inviteData.role) {
            toast.error("Please select an assigned role");
            return;
        }

        setIsInviting(true);
        try {
            // Find the selected role to send both slug and roleId — backend can pick either.
            const selectedRole = roles.find((r) => r.id === inviteData.role);
            await axiosInstance.post("/organization/createInvite", {
                email: inviteData.email.trim(),
                role: inviteData.role, // ROLES enum slug, e.g. "OrgAdmin", "OrgCustom"
                roleId: selectedRole?.roleId, // RolePermission _id (preferred by new backend)
                name: inviteData.name.trim(),
            });
            toast.success(`Invitation sent successfully to ${inviteData.email}`);
            setIsDialogOpen(false);
            setInviteData({ name: "", email: "", role: "" });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to send invitation");
        } finally {
            setIsInviting(false);
        }
    };

    useEffect(() => {
        const fetchOrgUsers = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get("/organization/users/all?page=1&limit=50");
                const apiUsers = res?.data?.users ?? [];
                setUsers(apiUsers);
            } catch (e: any) {
                toast.error(e?.response?.data?.message || "Failed to load organization users.");
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOrgUsers();
    }, []);

    const filtered = users.filter((u) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            (u.name || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q) ||
            (u.role || "").toLowerCase().includes(q)
        );
    });

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 font-outfit text-zinc-900 dark:text-zinc-100">
            <SubHeader
                title="Organization Users"
                breadcrumbItems={[
                    { label: "Org Admins", href: "#" },
                    { label: "Org Staff", href: "#" },
                    { label: "Users List", href: "#" }
                ]}
                rightControls={
                    <div className="flex gap-2">
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold" onClick={handleExportCSV}>
                            <Download className="w-4 h-4 mr-2" /> Export CSV
                        </CustomButton>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <CustomButton
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-semibold shadow-xl border-0"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Add User
                                </CustomButton>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px] rounded-3xl border-0 shadow-2xl p-0 overflow-hidden bg-white dark:bg-zinc-950">
                                <div className="h-2 bg-indigo-600 w-full" />
                                <div className="p-6 sm:p-8 space-y-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                                            <UserPlus className="w-6 h-6 text-indigo-600" />
                                            Add New User
                                        </DialogTitle>
                                        <DialogDescription className="font-medium text-zinc-500">
                                            Invite a new member to join your organization team.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleInviteSubmit} className="space-y-5">
                                        <div className="space-y-2">
                                            <label className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Full Name</label>
                                            <div className="relative">
                                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                                <Input 
                                                    placeholder="John Doe" 
                                                    className="pl-11 rounded-xl h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-medium"
                                                    value={inviteData.name}
                                                    onChange={handleNameChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Email Address <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                                <Input 
                                                    type="email"
                                                    required
                                                    placeholder="john@example.com" 
                                                    className="pl-11 rounded-xl h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-medium"
                                                    value={inviteData.email}
                                                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs uppercase font-bold text-zinc-500 tracking-wider">Assigned Role <span className="text-red-500">*</span></label>
                                            <Select value={inviteData.role} onValueChange={(val) => setInviteData({ ...inviteData, role: val })}>
                                                <SelectTrigger className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <RoleIcon className="h-4 w-4 text-zinc-400" />
                                                        <SelectValue placeholder="Select a role" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 shadow-xl">
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.id} className="font-medium focus:bg-indigo-50 dark:focus:bg-indigo-950/20">
                                                            {role.name}
                                                        </SelectItem>
                                                    ))}
                                                    {roles.length === 0 && (
                                                        <div className="p-4 text-center text-xs text-zinc-500">No roles found</div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            <CustomButton type="button" variant="ghost" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setIsDialogOpen(false)}>
                                                Cancel
                                            </CustomButton>
                                            <CustomButton 
                                                type="submit" 
                                                disabled={isInviting}
                                                className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-12 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                                            >
                                                {isInviting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Invitation"}
                                            </CustomButton>
                                        </div>
                                    </form>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                }
            />

            <div className="p-4 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* FILTERS & SEARCH */}
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-2 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-2xl">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search by name, email or role..."
                            className="pl-11 border-none shadow-none focus-visible:ring-0 p-0 text-sm font-medium h-10 w-full bg-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
                    <CustomButton variant="ghost" className="h-9 font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white gap-2 rounded-xl" onClick={() => toast.info("Opening advanced filters")}>
                        <Filter className="w-4 h-4" /> Filters
                    </CustomButton>
                </div>

                {/* USERS TABLE */}
                <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm rounded-3xl overflow-hidden min-h-[400px]">
                    <CardContent className="p-0">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-500 font-semibold border-b border-zinc-100 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4">User Details</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Last Active</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50 text-sm">
                                {loading && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-zinc-400 font-medium">Loading user list...</td>
                                    </tr>
                                )}
                                {!loading && filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-10 text-zinc-400 font-medium">No users found matching your search.</td>
                                    </tr>
                                )}
                                {!loading && filtered.map((user) => (
                                    <tr key={user.memberId} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-10 w-10 rounded-full border border-zinc-200 dark:border-zinc-700">
                                                    <AvatarFallback className="font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                                                        {(user.name?.[0] || "?").toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold tracking-tight text-zinc-900 dark:text-white">{user.name}</p>
                                                    <p className="text-xs text-zinc-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="w-4 h-4 text-zinc-400" />
                                                <span className="font-medium text-zinc-700 dark:text-zinc-300 tracking-wide text-xs">{user.role}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                className={`rounded-full border-0 font-medium text-xs px-2 py-0.5 ${
                                                    user.orgActive ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                                                }`}
                                            >
                                                {user.orgActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 font-medium text-xs">
                                            {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <CustomButton variant="ghost" size="icon" className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </CustomButton>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl w-48 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-xl">
                                                    <DropdownMenuLabel className="text-xs font-semibold text-zinc-400">User Management</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                                                    <DropdownMenuItem className="gap-3 text-xs font-medium py-2.5 cursor-pointer" onClick={() => toast.info(`Emailing ${user.name}`)}>
                                                        <Mail className="w-4 h-4 text-zinc-400" /> Send Message
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-3 text-xs font-medium py-2.5 cursor-pointer"
                                                        onClick={() => {
                                                            const target = orgName
                                                                ? `/${orgName}/modules/administration/roles/assignments?memberId=${user.memberId}`
                                                                : `/modules/administration/roles/assignments?memberId=${user.memberId}`;
                                                            router.push(target);
                                                        }}
                                                    >
                                                        <ShieldCheck className="w-4 h-4 text-zinc-400" /> Manage Privileges
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                                                    <DropdownMenuItem className="gap-3 text-xs font-medium py-2.5 cursor-pointer text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20" disabled={deactivatingId === user.memberId || !user.orgActive} onClick={() => handleDeactivateUser(user)}>
                                                        {deactivatingId === user.memberId ? "Deactivating..." : "Deactivate Access"}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
