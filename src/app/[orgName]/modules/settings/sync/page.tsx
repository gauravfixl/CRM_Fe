"use client";

import React, { useState, useMemo } from "react";
import {
    Database,
    Plus,
    Search,
    Filter,
    MoreVertical,
    RefreshCw,
    Settings,
    Trash2,
    FileText,
    Activity,
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
import { showSuccess, showWarning } from "@/shared/utils/toast";

interface DataSource {
    id: string;
    name: string;
    type: string;
    records: string;
    lastSynced: string;
    health: number;
    status: string;
    connectionUrl?: string;
    syncInterval?: string;
}

interface SourceForm {
    name: string;
    type: string;
    connectionUrl: string;
    syncInterval: string;
}

interface FormErrors {
    name?: string;
    type?: string;
    connectionUrl?: string;
    syncInterval?: string;
}

export default function DataSyncPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Warning" | "Paused">("All");

    const [newSource, setNewSource] = useState<SourceForm>({
        name: "",
        type: "",
        connectionUrl: "",
        syncInterval: "",
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [editSource, setEditSource] = useState<SourceForm & { id: string }>({
        id: "",
        name: "",
        type: "",
        connectionUrl: "",
        syncInterval: "",
    });
    const [editFormErrors, setEditFormErrors] = useState<FormErrors>({});

    const [dataSources, setDataSources] = useState<DataSource[]>([
        { id: "1", name: "ERP System (SAP)", type: "Database", records: "145,230", lastSynced: "2 mins ago", health: 100, status: "Active", connectionUrl: "jdbc:sap://erp.company.com:30015", syncInterval: "Real-time" },
        { id: "2", name: "Marketing (HubSpot)", type: "API", records: "52,410", lastSynced: "15 mins ago", health: 95, status: "Active", connectionUrl: "https://api.hubspot.com/v3", syncInterval: "Every 15 mins" },
        { id: "3", name: "Legacy Database", type: "Database", records: "89,100", lastSynced: "2 days ago", health: 40, status: "Warning", connectionUrl: "postgresql://legacy-db:5432/main", syncInterval: "Daily" },
        { id: "4", name: "Payment Gateway", type: "Webhook", records: "23,500", lastSynced: "5 mins ago", health: 100, status: "Active", connectionUrl: "https://hooks.stripe.com/incoming", syncInterval: "Real-time" },
        { id: "5", name: "Email Service", type: "API", records: "12,300", lastSynced: "1 hour ago", health: 78, status: "Active", connectionUrl: "https://api.sendgrid.com/v3", syncInterval: "Hourly" },
    ]);

    const filteredSources = useMemo(() => {
        return dataSources.filter((source) => {
            const matchesSearch =
                searchQuery === "" ||
                source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                source.type.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "All" || source.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [dataSources, searchQuery, statusFilter]);

    const stats = useMemo(() => {
        const total = dataSources.length;
        const healthy = dataSources.filter((s) => s.health >= 90 && s.status === "Active").length;
        const syncing = dataSources.filter((s) => s.status === "Active" && s.health < 90 && s.health >= 50).length;
        const failed = dataSources.filter((s) => s.status === "Warning" || s.status === "Error" || s.health < 50).length;
        return { total, healthy, syncing, failed };
    }, [dataSources]);

    const handleCreate = () => {
        const errors: FormErrors = {};
        if (!newSource.name.trim()) errors.name = "Source name is required";
        if (!newSource.type) errors.type = "Source type is required";
        if (!newSource.connectionUrl.trim()) errors.connectionUrl = "Connection URL is required";
        if (!newSource.syncInterval) errors.syncInterval = "Sync interval is required";

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const created: DataSource = {
            id: Date.now().toString(),
            name: newSource.name.trim(),
            type: newSource.type,
            records: "0",
            lastSynced: "Never",
            health: 100,
            status: "Active",
            connectionUrl: newSource.connectionUrl.trim(),
            syncInterval: newSource.syncInterval,
        };

        setDataSources((prev) => [...prev, created]);
        setShowCreateModal(false);
        setNewSource({ name: "", type: "", connectionUrl: "", syncInterval: "" });
        setFormErrors({});
        showSuccess(`Source "${created.name}" added successfully`);
    };

    const openEdit = (source: DataSource) => {
        setEditSource({
            id: source.id,
            name: source.name,
            type: source.type,
            connectionUrl: source.connectionUrl || "",
            syncInterval: source.syncInterval || "",
        });
        setEditFormErrors({});
        setShowEditModal(true);
    };

    const handleEdit = () => {
        const errors: FormErrors = {};
        if (!editSource.name.trim()) errors.name = "Source name is required";
        if (!editSource.type) errors.type = "Source type is required";
        if (!editSource.connectionUrl.trim()) errors.connectionUrl = "Connection URL is required";
        if (!editSource.syncInterval) errors.syncInterval = "Sync interval is required";

        if (Object.keys(errors).length > 0) {
            setEditFormErrors(errors);
            return;
        }

        setDataSources((prev) =>
            prev.map((s) =>
                s.id === editSource.id
                    ? {
                          ...s,
                          name: editSource.name.trim(),
                          type: editSource.type,
                          connectionUrl: editSource.connectionUrl.trim(),
                          syncInterval: editSource.syncInterval,
                      }
                    : s
            )
        );
        setShowEditModal(false);
        setEditFormErrors({});
        showSuccess(`Source "${editSource.name}" updated successfully`);
    };

    const deleteSource = (id: string) => {
        const source = dataSources.find((s) => s.id === id);
        if (!source) return;
        const confirmed = window.confirm(
            `Are you sure you want to remove "${source.name}"? This action cannot be undone.`
        );
        if (!confirmed) return;
        setDataSources((prev) => prev.filter((s) => s.id !== id));
        showWarning(`Source "${source.name}" removed`);
    };

    const syncNow = (source: DataSource) => {
        showSuccess(`Sync triggered for ${source.name}`);
    };

    const toggleStatus = (id: string) => {
        setDataSources((prev) =>
            prev.map((source) =>
                source.id === id
                    ? {
                          ...source,
                          status: source.status === "Active" ? "Paused" : "Active",
                      }
                    : source
            )
        );
    };

    const cycleStatusFilter = () => {
        setStatusFilter((prev) => {
            if (prev === "All") return "Active";
            if (prev === "Active") return "Warning";
            if (prev === "Warning") return "Paused";
            return "All";
        });
    };

    const getHealthColor = (health: number) => {
        if (health >= 90) return "text-green-600";
        if (health >= 70) return "text-primary";
        if (health >= 50) return "text-amber-600";
        return "text-red-600";
    };

    const getHealthBarColor = (health: number) => {
        if (health >= 90) return "bg-green-500";
        if (health >= 70) return "bg-primary";
        if (health >= 50) return "bg-amber-500";
        return "bg-red-500";
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-green-50 text-green-700 border-green-200";
            case "Warning":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "Error":
                return "bg-red-50 text-red-700 border-red-200";
            case "Paused":
                return "bg-zinc-100 text-zinc-600 border-zinc-200";
            default:
                return "bg-zinc-100 text-zinc-600 border-zinc-200";
        }
    };

    const renderFormFields = (
        form: SourceForm,
        setForm: (fn: (prev: SourceForm) => SourceForm) => void,
        errors: FormErrors
    ) => (
        <div className="space-y-4">
            <Field label="Source Name" required error={errors.name || undefined}>
                <Input
                    placeholder="e.g. ERP System"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
            </Field>
            <Field label="Type" required error={errors.type || undefined}>
                <Select value={form.type} onValueChange={(val) => setForm((prev) => ({ ...prev, type: val }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Database">Database</SelectItem>
                        <SelectItem value="API">API</SelectItem>
                        <SelectItem value="Webhook">Webhook</SelectItem>
                        <SelectItem value="FTP">FTP</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                </Select>
            </Field>
            <Field label="Connection URL" required error={errors.connectionUrl || undefined}>
                <Input
                    placeholder="e.g. https://api.example.com/v3"
                    value={form.connectionUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, connectionUrl: e.target.value }))}
                />
            </Field>
            <Field label="Sync Interval" required error={errors.syncInterval || undefined}>
                <Select value={form.syncInterval} onValueChange={(val) => setForm((prev) => ({ ...prev, syncInterval: val }))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Real-time">Real-time</SelectItem>
                        <SelectItem value="Every 5 mins">Every 5 mins</SelectItem>
                        <SelectItem value="Every 15 mins">Every 15 mins</SelectItem>
                        <SelectItem value="Hourly">Hourly</SelectItem>
                        <SelectItem value="Daily">Daily</SelectItem>
                    </SelectContent>
                </Select>
            </Field>
        </div>
    );

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Data Sync Status</h1>
                    <p className="text-sm text-gray-600">Monitor and manage data source synchronization health.</p>
                </div>
                <Button
                    onClick={() => {
                        setNewSource({ name: "", type: "", connectionUrl: "", syncInterval: "" });
                        setFormErrors({});
                        setShowCreateModal(true);
                    }}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Plus size={16} /> Add Source
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-xs opacity-80">Total Sources</p>
                    <p className="text-white text-xl font-semibold mt-1">{stats.total}</p>
                    <p className="text-white text-[10px] mt-1 opacity-80">Connected data sources</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Healthy</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{stats.healthy}</p>
                    <p className="text-green-600 text-[10px] mt-1">Fully operational</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Syncing</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{stats.syncing}</p>
                    <p className="text-primary text-[10px] mt-1">In progress</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Failed</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{stats.failed}</p>
                    <p className="text-red-600 text-[10px] mt-1">Needs attention</p>
                </div>
            </div>

            {/* Data Sources Table */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search data sources..."
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
                                <Badge className={`${getStatusBadge(statusFilter)} rounded-none text-[10px] font-bold px-2 py-0.5 ml-1`}>
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Source Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Records Synced</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Last Synced</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Health %</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredSources.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Database size={40} className="text-zinc-300" />
                                            <p className="text-sm font-bold text-gray-500">No data sources found</p>
                                            <p className="text-xs text-gray-400">Try adjusting your search or filter criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSources.map((source) => (
                                    <tr key={source.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 text-primary rounded-none border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                                                    <Database size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{source.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`${
                                                source.type === "Database"
                                                    ? "bg-primary/10 text-primary border-primary/20"
                                                    : source.type === "API"
                                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                                    : source.type === "Webhook"
                                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                                    : source.type === "FTP"
                                                    ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                                                    : "bg-zinc-100 text-zinc-600 border-zinc-200"
                                            } rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                {source.type}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900">{source.records}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500">{source.lastSynced}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3 min-w-[120px]">
                                                <div className="flex-1">
                                                    <div className="w-full h-1.5 bg-zinc-100 rounded-none overflow-hidden">
                                                        <div
                                                            className={`h-full ${getHealthBarColor(source.health)} transition-all duration-500`}
                                                            style={{ width: `${source.health}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-bold ${getHealthColor(source.health)} w-10 text-right`}>
                                                    {source.health}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {(source.status === "Active" || source.status === "Paused") && (
                                                    <Switch
                                                        checked={source.status === "Active"}
                                                        onCheckedChange={() => toggleStatus(source.id)}
                                                        className="data-[state=checked]:bg-primary"
                                                    />
                                                )}
                                                <Badge className={`${getStatusBadge(source.status)} rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                    {source.status}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-none h-8 w-8">
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-none w-44">
                                                    <DropdownMenuItem
                                                        onClick={() => openEdit(source)}
                                                        className="rounded-none gap-2 text-sm"
                                                    >
                                                        <Settings size={14} /> Configure
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => syncNow(source)}
                                                        className="rounded-none gap-2 text-sm"
                                                    >
                                                        <RefreshCw size={14} /> Sync Now
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => showSuccess(`Viewing logs for ${source.name}`)}
                                                        className="rounded-none gap-2 text-sm"
                                                    >
                                                        <FileText size={14} /> View Logs
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteSource(source.id)}
                                                        className="rounded-none gap-2 text-sm text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 size={14} /> Remove
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

            {/* Create Sheet */}
            <SideFormSheet
                open={showCreateModal}
                onOpenChange={setShowCreateModal}
                title="Add Data Source"
                description="Connect a new data source for synchronization."
                icon={<Plus size={20} />}
                accentColor="#4f46e5"
                width="md"
                submitLabel="Add Source"
                onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
            >
                {renderFormFields(
                    newSource,
                    (fn) => setNewSource((prev) => fn(prev)),
                    formErrors
                )}
            </SideFormSheet>

            {/* Edit Sheet */}
            <SideFormSheet
                open={showEditModal}
                onOpenChange={setShowEditModal}
                title="Configure Source"
                description="Update connection settings for this data source."
                icon={<Settings size={20} />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Save Changes"
                onSubmit={(e) => { e.preventDefault(); handleEdit(); }}
            >
                {renderFormFields(
                    editSource,
                    (fn) => setEditSource((prev) => fn(prev)),
                    editFormErrors
                )}
            </SideFormSheet>
        </div>
    );
}
