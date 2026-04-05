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
    Download
} from "lucide-react";
import SubHeader from "@/components/custom/SubHeader";
import { CustomButton } from "@/components/custom/CustomButton";
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

type OrgUser = {
    memberId: string;
    name: string;
    email: string;
    role: string;
    orgActive: boolean;
    joinedAt?: string;
};

export default function UsersListPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<OrgUser[]>([]);

    const handleInvite = () => {
        toast.info("Redirecting to invite flow...");
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
                        <CustomButton variant="outline" className="rounded-xl h-10 px-4 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-semibold" onClick={() => toast.success("CSV export started")}>
                            <Download className="w-4 h-4 mr-2" /> Export CSV
                        </CustomButton>
                        <CustomButton
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 font-semibold shadow-xl border-0"
                            onClick={handleInvite}
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add User
                        </CustomButton>
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
                                                    <DropdownMenuItem className="gap-3 text-xs font-medium py-2.5 cursor-pointer" onClick={() => toast.info(`Viewing ${user.name}'s permissions`)}>
                                                        <ShieldCheck className="w-4 h-4 text-zinc-400" /> Manage Privileges
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
                                                    <DropdownMenuItem className="gap-3 text-xs font-medium py-2.5 cursor-pointer text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20" onClick={() => toast.error(`Revoked access for ${user.name}`)}>
                                                        Deactivate Access
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
