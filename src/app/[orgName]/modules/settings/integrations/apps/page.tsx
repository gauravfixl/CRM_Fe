"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Box,
    Zap,
    Clock,
    Database,
    Settings,
    Eye,
    Link2,
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
import { showSuccess, showWarning } from "@/utils/toast";

interface ExternalApp {
    id: string;
    name: string;
    category: string;
    permissions: string;
    connectedSince: string;
    status: string;
    dataShared: string;
    description?: string;
}

interface AppForm {
    name: string;
    category: string;
    permissions: string;
    description: string;
}

const emptyForm: AppForm = { name: "", category: "", permissions: "", description: "" };

const categories = [
    "Communication",
    "Project Management",
    "CRM",
    "Automation",
    "Marketing",
    "Analytics",
];

export default function ExternalAppsPage() {
    const router = useRouter();
    const params = useParams();
    const orgName = (params?.orgName as string) || "";

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Paused">("All");

    const [newApp, setNewApp] = useState<AppForm>({ ...emptyForm });
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof AppForm, string>>>({});

    const [editApp, setEditApp] = useState<ExternalApp & AppForm>({
        id: "", name: "", category: "", permissions: "", connectedSince: "", status: "", dataShared: "", description: "",
    });
    const [editFormErrors, setEditFormErrors] = useState<Partial<Record<keyof AppForm, string>>>({});

    const [apps, setApps] = useState<ExternalApp[]>([
        { id: "1", name: "Slack", category: "Communication", permissions: "Send Messages, Read Channels", connectedSince: "Jan 10, 2026", status: "Active", dataShared: "Messages, Alerts" },
        { id: "2", name: "Jira", category: "Project Management", permissions: "Create Issues, Read Projects", connectedSince: "Feb 5, 2026", status: "Active", dataShared: "Tasks, Bugs" },
        { id: "3", name: "Salesforce", category: "CRM", permissions: "Read/Write Contacts", connectedSince: "Dec 15, 2025", status: "Active", dataShared: "Contacts, Deals" },
        { id: "4", name: "Zapier", category: "Automation", permissions: "Trigger Workflows", connectedSince: "Mar 1, 2026", status: "Paused", dataShared: "Events" },
        { id: "5", name: "HubSpot", category: "Marketing", permissions: "Read Analytics", connectedSince: "Nov 20, 2025", status: "Active", dataShared: "Campaigns, Leads" },
    ]);

    const filteredApps = useMemo(() => {
        return apps.filter((app) => {
            const matchesSearch =
                !searchQuery ||
                app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                app.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "All" || app.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [apps, searchQuery, statusFilter]);

    const handleCreate = () => {
        const errors: Partial<Record<keyof AppForm, string>> = {};
        if (!newApp.name.trim()) errors.name = "App name is required";
        if (!newApp.category) errors.category = "Category is required";
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            showWarning("Please fill in all required fields");
            return;
        }
        const created: ExternalApp = {
            id: Date.now().toString(),
            name: newApp.name.trim(),
            category: newApp.category,
            permissions: newApp.permissions.trim() || "Not configured",
            connectedSince: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            status: "Active",
            dataShared: "N/A",
            description: newApp.description.trim(),
        };
        setApps((prev) => [...prev, created]);
        setShowCreateModal(false);
        setNewApp({ ...emptyForm });
        setFormErrors({});
        showSuccess(`"${created.name}" connected successfully`);
    };

    const openEdit = (app: ExternalApp) => {
        setEditApp({
            ...app,
            description: app.description || "",
        });
        setEditFormErrors({});
        setShowEditModal(true);
    };

    const handleEdit = () => {
        const errors: Partial<Record<keyof AppForm, string>> = {};
        if (!editApp.name.trim()) errors.name = "App name is required";
        if (!editApp.category) errors.category = "Category is required";
        if (Object.keys(errors).length > 0) {
            setEditFormErrors(errors);
            showWarning("Please fill in all required fields");
            return;
        }
        setApps((prev) =>
            prev.map((a) =>
                a.id === editApp.id
                    ? { ...a, name: editApp.name.trim(), category: editApp.category, permissions: editApp.permissions.trim() || a.permissions, description: editApp.description.trim() }
                    : a
            )
        );
        setShowEditModal(false);
        showSuccess(`"${editApp.name}" updated successfully`);
    };

    const disconnectApp = (id: string) => {
        const target = apps.find((a) => a.id === id);
        if (!window.confirm(`Are you sure you want to disconnect "${target?.name}"? This action cannot be undone.`)) return;
        setApps((prev) => prev.filter((a) => a.id !== id));
        showSuccess(`"${target?.name}" disconnected successfully`);
    };

    const toggleStatus = (id: string) => {
        setApps((prev) =>
            prev.map((a) =>
                a.id === id ? { ...a, status: a.status === "Active" ? "Paused" : "Active" } : a
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

    const handleCreateModalChange = (open: boolean) => {
        setShowCreateModal(open);
        if (!open) {
            setNewApp({ ...emptyForm });
            setFormErrors({});
        }
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">External Apps</h1>
                    <p className="text-sm text-gray-600">Connect and manage third-party applications and their access permissions to your CRM data.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Plus size={16} /> Connect App
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button
                    type="button"
                    onClick={() => setStatusFilter("All")}
                    className={`bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer ${statusFilter === "All" ? "ring-2 ring-primary/60 ring-offset-2" : ""}`}
                >
                    <p className="text-white text-xs opacity-80">Connected Apps</p>
                    <p className="text-white text-xl font-semibold mt-1">{apps.length}</p>
                    <p className="text-white text-[10px] mt-1 opacity-80">Total integrations</p>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter("Active")}
                    className={`bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${statusFilter === "Active" ? "ring-2 ring-green-500" : ""}`}
                >
                    <p className="text-gray-600 text-xs">Active Integrations</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{apps.filter((a) => a.status === "Active").length}</p>
                    <p className="text-green-600 text-[10px] mt-1">Currently running</p>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter("Paused")}
                    className={`bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${statusFilter === "Paused" ? "ring-2 ring-amber-500" : ""}`}
                >
                    <p className="text-gray-600 text-xs">Pending Authorization</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{apps.filter((a) => a.status === "Paused").length}</p>
                    <p className="text-amber-600 text-[10px] mt-1">Awaiting action</p>
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${orgName}/modules/settings/sync`)}
                    className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                >
                    <p className="text-gray-600 text-xs">Data Synced</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{apps.reduce((sum, a) => sum + a.dataShared.split(",").length, 0)}</p>
                    <p className="text-primary text-[10px] mt-1">Data categories shared</p>
                </button>
            </div>

            {/* Apps Table */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search by name or category..."
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
                                <Badge className={`ml-1 rounded-none text-[10px] font-bold px-1.5 py-0 border-none ${statusFilter === "Active" ? "bg-green-600 text-white" : "bg-zinc-400 text-white"}`}>
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">App Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Permissions</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Connected Since</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-zinc-100 rounded-full">
                                                <Search size={24} className="text-zinc-400" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-500">No external apps found</p>
                                            <p className="text-xs text-gray-400">
                                                {searchQuery || statusFilter !== "All"
                                                    ? "Try adjusting your search or filter criteria"
                                                    : "Connect your first external app to get started"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredApps.map((app) => (
                                    <tr key={app.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 text-primary rounded-none border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                                                    <Box size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{app.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none text-[10px] font-bold px-2 py-0.5">
                                                {app.category}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">{app.permissions}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                                <Clock size={12} /> {app.connectedSince}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={app.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(app.id)}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                                <Badge className={`${app.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                    {app.status}
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
                                                        onClick={() => openEdit(app)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Settings size={14} /> Configure
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => showSuccess(`Viewing data shared with "${app.name}": ${app.dataShared}`)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Eye size={14} /> View Data
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2" />
                                                    <DropdownMenuItem
                                                        onClick={() => disconnectApp(app.id)}
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
                    <p className="text-sm text-gray-600">
                        Showing {filteredApps.length} of {apps.length} connected apps
                    </p>
                </div>
            </div>

            {/* Create Sheet */}
            <SideFormSheet
                open={showCreateModal}
                onOpenChange={handleCreateModalChange}
                title="Connect External App"
                description="Add a new third-party application integration."
                icon={<Link2 size={20} />}
                accentColor="#059669"
                width="md"
                submitLabel="Connect App"
                onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
            >
                <div className="space-y-4">
                    <Field label="App Name" required error={formErrors.name || undefined}>
                        <Input
                            placeholder="e.g., Slack"
                            value={newApp.name}
                            onChange={(e) => {
                                setNewApp({ ...newApp, name: e.target.value });
                                if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                            }}
                        />
                    </Field>
                    <Field label="Category" required error={formErrors.category || undefined}>
                        <Select
                            value={newApp.category}
                            onValueChange={(val) => {
                                setNewApp({ ...newApp, category: val });
                                if (formErrors.category) setFormErrors({ ...formErrors, category: undefined });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Permissions">
                        <Input
                            placeholder="e.g., Read Data, Send Messages"
                            value={newApp.permissions}
                            onChange={(e) => setNewApp({ ...newApp, permissions: e.target.value })}
                        />
                    </Field>
                    <Field label="Description">
                        <Input
                            placeholder="Brief description of the integration"
                            value={newApp.description}
                            onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Edit Sheet */}
            <SideFormSheet
                open={showEditModal}
                onOpenChange={(o) => {
                    setShowEditModal(o);
                    if (!o) setEditFormErrors({});
                }}
                title="Configure App"
                description="Update the app configuration and permissions."
                icon={<Edit size={20} />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Save Changes"
                onSubmit={(e) => { e.preventDefault(); handleEdit(); }}
            >
                <div className="space-y-4">
                    <Field label="App Name" required error={editFormErrors.name || undefined}>
                        <Input
                            placeholder="e.g., Slack"
                            value={editApp.name}
                            onChange={(e) => {
                                setEditApp({ ...editApp, name: e.target.value });
                                if (editFormErrors.name) setEditFormErrors({ ...editFormErrors, name: undefined });
                            }}
                        />
                    </Field>
                    <Field label="Category" required error={editFormErrors.category || undefined}>
                        <Select
                            value={editApp.category}
                            onValueChange={(val) => {
                                setEditApp({ ...editApp, category: val });
                                if (editFormErrors.category) setEditFormErrors({ ...editFormErrors, category: undefined });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Permissions">
                        <Input
                            placeholder="e.g., Read Data, Send Messages"
                            value={editApp.permissions}
                            onChange={(e) => setEditApp({ ...editApp, permissions: e.target.value })}
                        />
                    </Field>
                    <Field label="Description">
                        <Input
                            placeholder="Brief description of the integration"
                            value={editApp.description}
                            onChange={(e) => setEditApp({ ...editApp, description: e.target.value })}
                        />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    );
}
