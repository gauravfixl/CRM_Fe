"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Mail,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Calendar,
    RefreshCw,
    CheckCircle2,
    TrendingUp,
    Unplug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { showSuccess, showWarning } from "@/utils/toast";

interface ConnectedAccount {
    id: string;
    provider: string;
    email: string;
    type: string;
    lastSynced: string;
    status: string;
    description?: string;
}

interface AccountForm {
    provider: string;
    email: string;
    type: string;
    description: string;
}

interface FormErrors {
    provider?: string;
    email?: string;
    type?: string;
}

const defaultFormState: AccountForm = {
    provider: "",
    email: "",
    type: "",
    description: "",
};

export default function EmailIntegrationsPage() {
    const router = useRouter();
    const params = useParams();
    const orgName = (params?.orgName as string) || "";

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Paused">("All");

    const [newAccount, setNewAccount] = useState<AccountForm>({ ...defaultFormState });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [editAccount, setEditAccount] = useState<ConnectedAccount | null>(null);
    const [editForm, setEditForm] = useState<AccountForm>({ ...defaultFormState });
    const [editFormErrors, setEditFormErrors] = useState<FormErrors>({});

    const [accounts, setAccounts] = useState<ConnectedAccount[]>([
        { id: "1", provider: "Microsoft Outlook", email: "admin@company.com", type: "Both", lastSynced: "2 mins ago", status: "Active" },
        { id: "2", provider: "Google Workspace", email: "team@company.com", type: "Email", lastSynced: "15 mins ago", status: "Active" },
        { id: "3", provider: "Google Workspace", email: "hr@company.com", type: "Calendar", lastSynced: "1 hour ago", status: "Paused" },
        { id: "4", provider: "Microsoft Outlook", email: "sales@company.com", type: "Both", lastSynced: "5 mins ago", status: "Active" },
    ]);

    const filteredAccounts = useMemo(() => {
        return accounts.filter((account) => {
            const matchesSearch =
                searchQuery === "" ||
                account.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                account.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "All" || account.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [accounts, searchQuery, statusFilter]);

    const validateForm = (form: AccountForm): FormErrors => {
        const errors: FormErrors = {};
        if (!form.provider) errors.provider = "Provider is required";
        if (!form.email.trim()) errors.email = "Email address is required";
        if (!form.type) errors.type = "Account type is required";
        return errors;
    };

    const handleCreate = () => {
        const errors = validateForm(newAccount);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const created: ConnectedAccount = {
            id: Date.now().toString(),
            provider: newAccount.provider,
            email: newAccount.email.trim(),
            type: newAccount.type,
            lastSynced: "Just now",
            status: "Active",
            description: newAccount.description.trim(),
        };
        setAccounts((prev) => [...prev, created]);
        setNewAccount({ ...defaultFormState });
        setFormErrors({});
        setShowCreateModal(false);
        showSuccess(`Account "${created.email}" connected successfully`);
    };

    const openEdit = (account: ConnectedAccount) => {
        setEditAccount(account);
        setEditForm({
            provider: account.provider,
            email: account.email,
            type: account.type,
            description: account.description || "",
        });
        setEditFormErrors({});
        setShowEditModal(true);
    };

    const handleEdit = () => {
        if (!editAccount) return;
        const errors = validateForm(editForm);
        setEditFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setAccounts((prev) =>
            prev.map((a) =>
                a.id === editAccount.id
                    ? {
                          ...a,
                          provider: editForm.provider,
                          email: editForm.email.trim(),
                          type: editForm.type,
                          description: editForm.description.trim(),
                      }
                    : a
            )
        );
        setShowEditModal(false);
        setEditAccount(null);
        setEditForm({ ...defaultFormState });
        setEditFormErrors({});
        showSuccess(`Account "${editForm.email.trim()}" updated successfully`);
    };

    const disconnectAccount = (id: string) => {
        const account = accounts.find((a) => a.id === id);
        if (!account) return;
        const confirmed = window.confirm(
            `Are you sure you want to disconnect "${account.email}"? This action cannot be undone.`
        );
        if (!confirmed) return;
        setAccounts((prev) => prev.filter((a) => a.id !== id));
        showWarning(`Account "${account.email}" disconnected`);
    };

    const toggleStatus = (id: string) => {
        setAccounts((prev) =>
            prev.map((a) =>
                a.id === id
                    ? { ...a, status: a.status === "Active" ? "Paused" : "Active" }
                    : a
            )
        );
    };

    const cycleStatusFilter = () => {
        setStatusFilter((prev) => {
            if (prev === "All") return "Active";
            if (prev === "Active") return "Paused";
            return "All";
        });
    };

    const syncNow = (account: ConnectedAccount) => {
        setAccounts((prev) =>
            prev.map((a) =>
                a.id === account.id ? { ...a, lastSynced: "Just now" } : a
            )
        );
        showSuccess(`Sync triggered for "${account.email}"`);
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Email & Calendar Integration</h1>
                    <p className="text-sm text-gray-600">Connect and manage email and calendar accounts for seamless synchronization.</p>
                </div>
                <Button
                    onClick={() => {
                        setNewAccount({ ...defaultFormState });
                        setFormErrors({});
                        setShowCreateModal(true);
                    }}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Plus size={16} /> Connect Account
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button
                    type="button"
                    onClick={() => setStatusFilter("All")}
                    className={`bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer ${statusFilter === "All" ? "ring-2 ring-primary/60 ring-offset-2" : ""}`}
                >
                    <p className="text-white text-xs opacity-80">Connected Accounts</p>
                    <p className="text-white text-xl font-semibold mt-1">{accounts.length}</p>
                    <p className="text-white text-[10px] mt-1 opacity-80">Total integrations</p>
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${orgName}/modules/settings/sync`)}
                    className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                >
                    <p className="text-gray-600 text-xs">Synced Emails</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">12,847</p>
                    <p className="text-green-600 text-[10px] mt-1">+234 today</p>
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${orgName}/modules/calendar`)}
                    className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                >
                    <p className="text-gray-600 text-xs">Calendar Events</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">1,563</p>
                    <p className="text-green-600 text-[10px] mt-1">+18 this week</p>
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${orgName}/modules/settings/sync`)}
                    className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                >
                    <p className="text-gray-600 text-xs">Sync Success Rate</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">99.2%</p>
                    <p className="text-green-600 text-[10px] mt-1">Excellent reliability</p>
                </button>
            </div>

            {/* Connected Accounts List */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search by provider or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            onClick={cycleStatusFilter}
                            className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white flex-1 md:flex-none"
                        >
                            <Filter size={14} /> Filter
                            {statusFilter !== "All" && (
                                <Badge className={`ml-1 rounded-none text-[10px] font-bold px-2 py-0.5 border-none text-white ${statusFilter === "Active" ? "bg-green-600" : "bg-zinc-400"}`}>
                                    {statusFilter}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Provider</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Email Address</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Last Synced</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredAccounts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Mail size={40} className="text-zinc-300" />
                                            <p className="text-sm font-bold text-gray-500">No connected accounts found</p>
                                            <p className="text-xs text-gray-400">
                                                {searchQuery || statusFilter !== "All"
                                                    ? "Try adjusting your search or filter criteria"
                                                    : "Connect your first email or calendar account to get started"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAccounts.map((account) => (
                                    <tr key={account.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 text-primary rounded-none border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                                                    <Mail size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{account.provider}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">{account.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none text-[10px] font-bold px-2 py-0.5">
                                                {account.type}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                                <RefreshCw size={12} className="text-primary" /> {account.lastSynced}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={account.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(account.id)}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                                <Badge className={`${account.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                    {account.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none border-zinc-200 shadow-xl p-2 min-w-[180px]">
                                                    <DropdownMenuLabel className="text-xs font-bold text-gray-600">Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => openEdit(account)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Edit size={14} /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => syncNow(account)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <RefreshCw size={14} /> Sync Now
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2" />
                                                    <DropdownMenuItem
                                                        onClick={() => disconnectAccount(account.id)}
                                                        className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Trash2 size={14} /> Disconnect
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

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {filteredAccounts.length} of {accounts.length} connected accounts</p>
                    <Button variant="link" className="text-primary text-sm flex items-center gap-1 group" onClick={() => showSuccess("Sync logs exported")}>
                        View Sync Logs <TrendingUp size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Sheet */}
            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) {
                        setNewAccount({ ...defaultFormState });
                        setFormErrors({});
                    }
                }}
                title="Connect Account"
                description="Add a new email or calendar integration."
                icon={<Plus size={20} />}
                accentColor="#059669"
                width="md"
                submitLabel="Connect Account"
                onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
            >
                <div className="space-y-4">
                    <Field label="Provider" required error={formErrors.provider || undefined}>
                        <Select
                            value={newAccount.provider}
                            onValueChange={(val) => {
                                setNewAccount((prev) => ({ ...prev, provider: val }));
                                if (formErrors.provider) setFormErrors((prev) => ({ ...prev, provider: undefined }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Microsoft Outlook">Microsoft Outlook</SelectItem>
                                <SelectItem value="Google Workspace">Google Workspace</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Email Address" required error={formErrors.email || undefined}>
                        <Input
                            placeholder="e.g., user@company.com"
                            value={newAccount.email}
                            onChange={(e) => {
                                setNewAccount((prev) => ({ ...prev, email: e.target.value }));
                                if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
                            }}
                        />
                    </Field>
                    <Field label="Type" required error={formErrors.type || undefined}>
                        <Select
                            value={newAccount.type}
                            onValueChange={(val) => {
                                setNewAccount((prev) => ({ ...prev, type: val }));
                                if (formErrors.type) setFormErrors((prev) => ({ ...prev, type: undefined }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Email">Email</SelectItem>
                                <SelectItem value="Calendar">Calendar</SelectItem>
                                <SelectItem value="Both">Both</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Description">
                        <Textarea
                            placeholder="Optional notes about this integration..."
                            value={newAccount.description}
                            onChange={(e) => setNewAccount((prev) => ({ ...prev, description: e.target.value }))}
                            rows={3}
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Edit Sheet */}
            <SideFormSheet
                open={showEditModal}
                onOpenChange={(o) => {
                    setShowEditModal(o);
                    if (!o) {
                        setEditAccount(null);
                        setEditForm({ ...defaultFormState });
                        setEditFormErrors({});
                    }
                }}
                title="Edit Account"
                description="Update the integration settings for this account."
                icon={<Edit size={20} />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Save Changes"
                onSubmit={(e) => { e.preventDefault(); handleEdit(); }}
            >
                <div className="space-y-4">
                    <Field label="Provider" required error={editFormErrors.provider || undefined}>
                        <Select
                            value={editForm.provider}
                            onValueChange={(val) => {
                                setEditForm((prev) => ({ ...prev, provider: val }));
                                if (editFormErrors.provider) setEditFormErrors((prev) => ({ ...prev, provider: undefined }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Microsoft Outlook">Microsoft Outlook</SelectItem>
                                <SelectItem value="Google Workspace">Google Workspace</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Email Address" required error={editFormErrors.email || undefined}>
                        <Input
                            placeholder="e.g., user@company.com"
                            value={editForm.email}
                            onChange={(e) => {
                                setEditForm((prev) => ({ ...prev, email: e.target.value }));
                                if (editFormErrors.email) setEditFormErrors((prev) => ({ ...prev, email: undefined }));
                            }}
                        />
                    </Field>
                    <Field label="Type" required error={editFormErrors.type || undefined}>
                        <Select
                            value={editForm.type}
                            onValueChange={(val) => {
                                setEditForm((prev) => ({ ...prev, type: val }));
                                if (editFormErrors.type) setEditFormErrors((prev) => ({ ...prev, type: undefined }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Email">Email</SelectItem>
                                <SelectItem value="Calendar">Calendar</SelectItem>
                                <SelectItem value="Both">Both</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Description">
                        <Textarea
                            placeholder="Optional notes about this integration..."
                            value={editForm.description}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                            rows={3}
                        />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    );
}
