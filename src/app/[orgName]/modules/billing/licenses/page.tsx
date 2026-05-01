"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
    UserCheck,
    Search,
    Filter,
    Plus,
    UserMinus,
    ShieldAlert,
    MoreVertical,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard";
import { showSuccess, showWarning } from "@/utils/toast";
import { fetchUsersApi } from "@/modules/crm/organizations/hooks/orgHooks";

type LicenseUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    plan: string;
    status: string;
    assignedDate: string;
};

const ROLES = ["HR Admin", "Sales Manager", "Developer", "Marketing Lead", "Accountant"] as const;
const ROLE_FILTERS = ["All", ...ROLES] as const;
const STATUS_FILTERS = ["All", "Active", "Pending", "Suspended"] as const;

export default function LicensesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilterIndex, setRoleFilterIndex] = useState(0);
    const [statusFilterIndex, setStatusFilterIndex] = useState(0);

    const [licenseUsers, setLicenseUsers] = useState<LicenseUser[]>([
        { id: "1", name: "Sarah Miller", email: "sarah.m@fixlsolutions.com", role: "HR Admin", plan: "Enterprise Pro", status: "Active", assignedDate: "Oct 12, 2024" },
        { id: "2", name: "Robert Wilson", email: "robert.w@fixlsolutions.com", role: "Sales Manager", plan: "Enterprise Pro", status: "Active", assignedDate: "Oct 15, 2024" },
        { id: "3", name: "Elena Kostic", email: "elena.k@fixlsolutions.com", role: "Developer", plan: "Enterprise Pro", status: "Active", assignedDate: "Nov 01, 2024" },
        { id: "4", name: "James Chen", email: "james.c@fixlsolutions.com", role: "Marketing Lead", plan: "Enterprise Pro", status: "Pending", assignedDate: "Jan 10, 2025" },
        { id: "5", name: "Maria Garcia", email: "maria.g@fixlsolutions.com", role: "Accountant", plan: "Enterprise Pro", status: "Active", assignedDate: "Feb 22, 2025" },
    ]);

    // Modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState<LicenseUser | null>(null);
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formRole, setFormRole] = useState<string>(ROLES[0]);

    // Filters
    const activeRoleFilter = ROLE_FILTERS[roleFilterIndex];
    const activeStatusFilter = STATUS_FILTERS[statusFilterIndex];

    const filteredUsers = useMemo(() => {
        return licenseUsers.filter((user) => {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                !query ||
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.role.toLowerCase().includes(query);

            const matchesRole = activeRoleFilter === "All" || user.role === activeRoleFilter;
            const matchesStatus = activeStatusFilter === "All" || user.status === activeStatusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [licenseUsers, searchQuery, activeRoleFilter, activeStatusFilter]);

    // Dynamic stats
    const summary = useMemo(() => {
        const total = licenseUsers.length;
        const active = licenseUsers.filter((u) => u.status === "Active").length;
        const pending = licenseUsers.filter((u) => u.status === "Pending").length;
        const suspended = licenseUsers.filter((u) => u.status === "Suspended").length;
        const available = Math.max(0, 100 - total);

        return [
            { label: "Total Licenses", value: String(total), sub: "Enterprise Pro Plan", color: "text-white", isHighlight: true },
            { label: "Assigned", value: String(active), sub: "Active Users", color: "text-primary", isHighlight: false },
            { label: "Available", value: String(available), sub: "Ready to assign", color: "text-emerald-600", isHighlight: false },
            { label: "Pending Invitations", value: String(pending), sub: suspended > 0 ? `${suspended} suspended` : "Awaiting signup", color: "text-amber-600", isHighlight: false },
        ];
    }, [licenseUsers]);

    // Actions
    const toggleUserStatus = (id: string) => {
        setLicenseUsers((prev) =>
            prev.map((user) => {
                if (user.id !== id) return user;
                const newStatus = user.status === "Suspended" ? "Active" : "Suspended";
                showSuccess(`License ${newStatus === "Suspended" ? "suspended" : "restored"} for ${user.name}`);
                return { ...user, status: newStatus };
            })
        );
    };

    const removeUser = (id: string) => {
        const user = licenseUsers.find((u) => u.id === id);
        if (!user) return;
        const confirmed = window.confirm(`Are you sure you want to remove the license for ${user.name}?`);
        if (!confirmed) return;
        setLicenseUsers((prev) => prev.filter((u) => u.id !== id));
        showSuccess(`License removed for ${user.name}`);
    };

    const openCreateModal = () => {
        setFormName("");
        setFormEmail("");
        setFormRole(ROLES[0]);
        setShowCreateModal(true);
    };

    const handleCreate = () => {
        const trimmedName = formName.trim();
        const trimmedEmail = formEmail.trim();

        if (!trimmedName || !trimmedEmail) {
            showWarning("Please fill in all required fields");
            return;
        }

        if (/\d/.test(trimmedName)) {
            showWarning("Full name should not contain numbers");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            showWarning("Please enter a valid email address");
            return;
        }

        const newUser: LicenseUser = {
            id: String(Date.now()),
            name: trimmedName,
            email: trimmedEmail,
            role: formRole,
            plan: "Enterprise Pro",
            status: "Pending",
            assignedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        };
        setLicenseUsers((prev) => [...prev, newUser]);
        setShowCreateModal(false);
        showSuccess(`License assigned to ${newUser.name}`);
    };

    const openEditModal = (user: LicenseUser) => {
        setEditingUser(user);
        setFormName(user.name);
        setFormEmail(user.email);
        setFormRole(user.role);
        setShowEditModal(true);
    };

    const handleEdit = () => {
        if (!editingUser) return;
        const trimmedName = formName.trim();
        const trimmedEmail = formEmail.trim();

        if (!trimmedName || !trimmedEmail) {
            showWarning("Please fill in all required fields");
            return;
        }

        if (/\d/.test(trimmedName)) {
            showWarning("Full name should not contain numbers");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            showWarning("Please enter a valid email address");
            return;
        }

        setLicenseUsers((prev) =>
            prev.map((u) =>
                u.id === editingUser.id
                    ? { ...u, name: trimmedName, email: trimmedEmail, role: formRole }
                    : u
            )
        );
        setShowEditModal(false);
        setEditingUser(null);
        showSuccess("License reassigned successfully");
    };

    const cycleRoleFilter = () => {
        setRoleFilterIndex((prev) => (prev + 1) % ROLE_FILTERS.length);
    };

    const cycleStatusFilter = () => {
        setStatusFilterIndex((prev) => (prev + 1) % STATUS_FILTERS.length);
    };

    const handleExport = () => {
        const csvContent = [
            ["Name", "Email", "Role", "Plan", "Status", "Assigned Date"],
            ...licenseUsers.map(u => [u.name, u.email, u.role, u.plan, u.status, u.assignedDate]),
        ].map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `licenses-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showSuccess("License list exported");
    };

    const renderFormFields = () => (
        <div className="p-5 space-y-4 bg-white">
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Full name <span className="text-rose-500">*</span></Label>
                <Input
                    className="rounded-none border-zinc-200 h-9 text-sm"
                    placeholder="Enter full name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Email <span className="text-rose-500">*</span></Label>
                <Input
                    className="rounded-none border-zinc-200 h-9 text-sm"
                    placeholder="Enter email address"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Role</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                    <SelectTrigger className="rounded-none border-zinc-200 h-9">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                        {ROLES.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">Plan</Label>
                <Input
                    className="rounded-none border-zinc-200 h-9 text-sm bg-zinc-50"
                    value="Enterprise Pro"
                    readOnly
                />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900">License Management</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage user quotas, assign seats, and monitor license utilization across business units.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="rounded-none border-zinc-200 font-medium text-xs h-9 gap-2"
                        onClick={handleExport}
                    >
                        <Download size={14} /> Export List
                    </Button>
                    <Button
                        className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                        onClick={openCreateModal}
                    >
                        <Plus size={14} /> Assign New License
                    </Button>
                </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summary.map((item, idx) => (
                    idx === 0 ? (
                        <div key={idx} className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                            <p className="text-white text-xs opacity-80">{item.label}</p>
                            <p className="text-white text-xl font-semibold mt-1">{item.value}</p>
                            <p className="text-white text-[10px] mt-1 opacity-70">{item.sub}</p>
                        </div>
                    ) : (
                        <div key={idx} className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                            <p className="text-zinc-500 text-xs">{item.label}</p>
                            <p className="text-xl font-semibold text-zinc-900 mt-1">{item.value}</p>
                            <p className={`text-[10px] mt-1 ${item.color}`}>{item.sub}</p>
                        </div>
                    )
                ))}
            </div>

            <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search by name, email or role..."
                            className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                            onClick={cycleRoleFilter}
                        >
                            <Filter size={14} /> {activeRoleFilter === "All" ? "Filter Roles" : activeRoleFilter}
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                            onClick={cycleStatusFilter}
                        >
                            <ShieldAlert size={14} /> Status: {activeStatusFilter}
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Identity</th>
                                <th className="px-6 py-3 text-[11px] font-medium text-gray-500">License Tier</th>
                                <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Assigned Date</th>
                                <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Status</th>
                                <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-6 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</span>
                                            <span className="text-xs text-gray-500 font-medium">{user.email}</span>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="h-1.5 w-1.5 bg-primary rounded-none" />
                                                <span className="text-[10px] text-primary font-medium">{user.role}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <Badge className="bg-zinc-900 text-white border-none rounded-none px-2 py-0.5 text-[10px] font-medium">
                                            {user.plan}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-3 text-xs text-gray-600 font-medium">
                                        {user.assignedDate}
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-2">
                                            {user.status === "Active" ? (
                                                <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none">
                                                    <CheckCircle2 size={12} />
                                                    <span className="text-[10px] font-medium">{user.status}</span>
                                                </div>
                                            ) : user.status === "Pending" ? (
                                                <div className="flex items-center gap-2 px-2 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-none">
                                                    <Clock size={12} />
                                                    <span className="text-[10px] font-medium">{user.status}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-none">
                                                    <XCircle size={12} />
                                                    <span className="text-[10px] font-medium">{user.status}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-lg p-2 min-w-[160px]">
                                                <DropdownMenuLabel className="text-[10px] font-medium text-gray-400 mb-1">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    className="text-xs font-medium p-2 rounded-md cursor-pointer"
                                                    onClick={() => toggleUserStatus(user.id)}
                                                >
                                                    {user.status === "Suspended" ? "Restore License" : "Suspend Access"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-xs font-medium p-2 rounded-md cursor-pointer"
                                                    onClick={() => openEditModal(user)}
                                                >
                                                    Reassign
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-1" />
                                                <DropdownMenuItem
                                                    className="text-xs font-medium p-2 text-rose-600 rounded-md cursor-pointer flex items-center gap-2"
                                                    onClick={() => removeUser(user.id)}
                                                >
                                                    <UserMinus size={14} /> Remove License
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-xs text-gray-400 font-medium">
                                        No licenses found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                    <p className="text-[11px] font-medium text-zinc-500">
                        Showing <span className="text-zinc-900 font-semibold">{filteredUsers.length}</span> of <span className="text-zinc-900 font-semibold">{licenseUsers.length} records</span>
                    </p>
                </div>
            </div>

            {/* Assign New License Modal */}
            <Dialog open={showCreateModal} onOpenChange={(open) => { if (!open) setShowCreateModal(false); }}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <Plus size={16} /> Assign New License
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Add a new user to your Enterprise Pro plan.</p>
                    </div>
                    {renderFormFields()}
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-none text-sm text-gray-600 h-9">
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20">
                            Assign License
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reassign License Modal */}
            <Dialog open={showEditModal} onOpenChange={(open) => { if (!open) { setShowEditModal(false); setEditingUser(null); } }}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-primary/80 to-primary px-5 py-4 text-white">
                        <h2 className="text-base font-semibold flex items-center gap-2">
                            <UserCheck size={16} /> Reassign License
                        </h2>
                        <p className="text-xs opacity-80 mt-1">Update the license assignment details.</p>
                    </div>
                    {renderFormFields()}
                    <DialogFooter className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 gap-3 sm:justify-end">
                        <Button variant="ghost" onClick={() => { setShowEditModal(false); setEditingUser(null); }} className="rounded-none text-sm text-gray-600 h-9">
                            Cancel
                        </Button>
                        <Button onClick={handleEdit} className="bg-primary hover:bg-primary/90 rounded-none text-sm px-6 h-9 shadow-md shadow-primary/20">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </div>
    );
}
