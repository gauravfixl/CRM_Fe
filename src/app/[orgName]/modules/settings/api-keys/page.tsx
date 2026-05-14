"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    Key,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Copy,
    Trash2,
    Shield,
    Clock,
    AlertTriangle,
    Activity,
    Loader2,
} from "lucide-react";
import {
    listApiKeys,
    createApiKey as apiCreateApiKey,
    revokeApiKey as apiRevokeApiKey,
} from "@/hooks/orgAdminHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { showSuccess, showWarning, showError } from "@/utils/toast";

interface ApiKey {
    id: string;
    name: string;
    key: string;
    permissions: string;
    created: string;
    expires: string;
    status: string;
}

interface KeyForm {
    name: string;
    permissions: string;
    expiry: string;
}

interface FormErrors {
    name?: string;
    permissions?: string;
    expiry?: string;
}

const defaultFormState: KeyForm = {
    name: "",
    permissions: "",
    expiry: "",
};

function generateRandomKey(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "sk_live_";
    for (let i = 0; i < 24; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function maskKey(key: string): string {
    if (key.length <= 11) return key;
    return key.slice(0, 7) + "..." + key.slice(-4);
}

function getExpiryDate(expiry: string): string {
    const now = new Date();
    if (expiry === "30 days") {
        now.setDate(now.getDate() + 30);
    } else if (expiry === "90 days") {
        now.setDate(now.getDate() + 90);
    } else if (expiry === "1 year") {
        now.setFullYear(now.getFullYear() + 1);
    } else {
        return "Never";
    }
    return now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getTodayFormatted(): string {
    return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function APIKeysPage() {
    const router = useRouter();
    const params = useParams();
    const orgName = (params?.orgName as string) || "";

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Expired">("All");

    const [newKey, setNewKey] = useState<KeyForm>({ ...defaultFormState });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const formatDate = (value: any): string => {
        if (!value) return "—";
        try {
            return new Date(value).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return String(value);
        }
    };

    const normalizeKey = (raw: any): ApiKey => {
        const id = raw?._id || raw?.id || "";
        const status =
            raw?.status === "Revoked" || raw?.revoked === true
                ? "Revoked"
                : raw?.expiresAt && new Date(raw.expiresAt) < new Date()
                ? "Expired"
                : "Active";
        return {
            id,
            name: raw?.name || "—",
            key: raw?.key || raw?.maskedKey || raw?.prefix || "",
            permissions: raw?.permissions || raw?.scope || "Full Access",
            created: formatDate(raw?.createdAt || raw?.created),
            expires: raw?.expiresAt ? formatDate(raw.expiresAt) : "Never",
            status,
        };
    };

    const fetchKeys = async () => {
        try {
            setLoading(true);
            const res = await listApiKeys();
            const data = res?.data?.apiKeys || res?.data?.keys || res?.data?.data || res?.data || [];
            const list = Array.isArray(data) ? data : [];
            setApiKeys(list.map(normalizeKey));
        } catch (err: any) {
            console.error("Failed to load API keys:", err);
            showError(err?.response?.data?.message || "Failed to load API keys");
            setApiKeys([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const filteredKeys = useMemo(() => {
        return apiKeys.filter((k) => {
            const matchesSearch =
                searchQuery === "" ||
                k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                k.permissions.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "All" || k.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [apiKeys, searchQuery, statusFilter]);

    const validateForm = (form: KeyForm): FormErrors => {
        const errors: FormErrors = {};
        if (!form.name.trim()) errors.name = "Key name is required";
        if (!form.permissions) errors.permissions = "Permissions are required";
        if (!form.expiry) errors.expiry = "Expiry is required";
        return errors;
    };

    const handleCreate = async () => {
        const errors = validateForm(newKey);
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        try {
            setSubmitting(true);
            // Compute expiry date for backend
            let expiresAt: string | null = null;
            if (newKey.expiry === "30 days") {
                const d = new Date();
                d.setDate(d.getDate() + 30);
                expiresAt = d.toISOString();
            } else if (newKey.expiry === "90 days") {
                const d = new Date();
                d.setDate(d.getDate() + 90);
                expiresAt = d.toISOString();
            } else if (newKey.expiry === "1 year") {
                const d = new Date();
                d.setFullYear(d.getFullYear() + 1);
                expiresAt = d.toISOString();
            }

            const payload: any = {
                name: newKey.name.trim(),
                permissions: newKey.permissions,
            };
            if (expiresAt) payload.expiresAt = expiresAt;

            const res = await apiCreateApiKey(payload);
            const generatedKey =
                res?.data?.key || res?.data?.apiKey?.key || res?.data?.plainKey || "";
            if (generatedKey) {
                navigator.clipboard?.writeText(generatedKey).catch(() => {});
                showSuccess(
                    `API key created and copied to clipboard. This is the only time the full key will be shown.`
                );
            } else {
                showSuccess("API key created successfully");
            }
            setNewKey({ ...defaultFormState });
            setFormErrors({});
            setShowCreateModal(false);
            await fetchKeys();
        } catch (err: any) {
            console.error("Create API key failed:", err);
            showError(err?.response?.data?.message || "Failed to create API key");
        } finally {
            setSubmitting(false);
        }
    };

    const revokeKey = async (id: string) => {
        const key = apiKeys.find((k) => k.id === id);
        if (!key) return;
        const confirmed = window.confirm(
            `Revoke "${key.name}"? This cannot be undone and any application using this key will stop working.`
        );
        if (!confirmed) return;
        try {
            await apiRevokeApiKey(id);
            showWarning(`API key "${key.name}" revoked`);
            await fetchKeys();
        } catch (err: any) {
            console.error("Revoke API key failed:", err);
            showError(err?.response?.data?.message || "Failed to revoke API key");
        }
    };

    const copyKeyToClipboard = (key: string) => {
        navigator.clipboard.writeText(key);
        showSuccess("API key copied to clipboard");
    };

    const cycleStatusFilter = () => {
        setStatusFilter((prev) => {
            if (prev === "All") return "Active";
            if (prev === "Active") return "Expired";
            return "All";
        });
    };

    const totalKeys = apiKeys.length;
    const activeKeys = apiKeys.filter((k) => k.status === "Active").length;
    const expiredKeys = apiKeys.filter((k) => k.status === "Expired").length;

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">API Keys</h1>
                    <p className="text-sm text-gray-600">Manage API keys for programmatic access to your organization's data.</p>
                </div>
                <Button
                    onClick={() => {
                        setNewKey({ ...defaultFormState });
                        setFormErrors({});
                        setShowCreateModal(true);
                    }}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Plus size={16} /> Generate Key
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button
                    type="button"
                    onClick={() => setStatusFilter("All")}
                    className={`bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer ${statusFilter === "All" ? "ring-2 ring-primary/60 ring-offset-2" : ""}`}
                >
                    <p className="text-white text-xs opacity-80">Total Keys</p>
                    <p className="text-white text-xl font-semibold mt-1">{totalKeys}</p>
                    <p className="text-white text-[10px] mt-1 opacity-80">All generated keys</p>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter("Active")}
                    className={`bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${statusFilter === "Active" ? "ring-2 ring-green-500" : ""}`}
                >
                    <p className="text-gray-600 text-xs">Active Keys</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{activeKeys}</p>
                    <p className="text-green-600 text-[10px] mt-1">Currently valid</p>
                </button>

                <button
                    type="button"
                    onClick={() => setStatusFilter("Expired")}
                    className={`bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${statusFilter === "Expired" ? "ring-2 ring-amber-500" : ""}`}
                >
                    <p className="text-gray-600 text-xs">Expired Keys</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{expiredKeys}</p>
                    <p className="text-amber-600 text-[10px] mt-1">Need renewal</p>
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${orgName}/api-usage`)}
                    className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                >
                    <p className="text-gray-600 text-xs">API Requests 30d</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">24,891</p>
                    <p className="text-green-600 text-[10px] mt-1">Last 30 days</p>
                </button>
            </div>

            {/* API Keys Table */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search by name, permissions..."
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
                                <Badge className={`ml-1 rounded-none text-[10px] font-bold px-2 py-0.5 border-none text-white ${statusFilter === "Active" ? "bg-green-600" : "bg-amber-500"}`}>
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Key Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">API Key</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Permissions</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Created</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Expires</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 size={32} className="text-primary animate-spin" />
                                            <p className="text-sm font-bold text-gray-500">Loading API keys...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredKeys.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Key size={40} className="text-zinc-300" />
                                            <p className="text-sm font-bold text-gray-500">No API keys found</p>
                                            <p className="text-xs text-gray-400">
                                                {searchQuery || statusFilter !== "All"
                                                    ? "Try adjusting your search or filter criteria"
                                                    : "Generate your first API key to get started"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredKeys.map((apiKey) => (
                                    <tr key={apiKey.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 text-primary rounded-none border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                                                    <Key size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{apiKey.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs text-gray-600 bg-zinc-100 px-2 py-1 rounded-none font-mono">
                                                    {maskKey(apiKey.key)}
                                                </code>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyKeyToClipboard(apiKey.key)}
                                                    className="h-7 w-7 p-0 rounded-none hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <Copy size={13} />
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none text-[10px] font-bold px-2 py-0.5">
                                                {apiKey.permissions}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                                <Clock size={12} className="text-primary" /> {apiKey.created}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                                {apiKey.status === "Expired" ? (
                                                    <AlertTriangle size={12} className="text-amber-500" />
                                                ) : (
                                                    <Clock size={12} className="text-green-500" />
                                                )}
                                                {apiKey.expires}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={`${apiKey.status === "Active" ? "bg-green-600" : "bg-amber-500"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                {apiKey.status}
                                            </Badge>
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
                                                        onClick={() => copyKeyToClipboard(apiKey.key)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Copy size={14} /> Copy Key
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2" />
                                                    <DropdownMenuItem
                                                        onClick={() => revokeKey(apiKey.id)}
                                                        className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Trash2 size={14} /> Revoke Key
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
                    <p className="text-sm text-gray-600">Showing {filteredKeys.length} of {apiKeys.length} API keys</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Shield size={14} className="text-primary" />
                        Keys are encrypted at rest
                    </div>
                </div>
            </div>

            {/* Create Sheet */}
            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) {
                        setNewKey({ ...defaultFormState });
                        setFormErrors({});
                    }
                }}
                title="Generate API Key"
                description="Create a new API key for programmatic access."
                icon={<Key size={20} />}
                accentColor="#4f46e5"
                width="md"
                loading={submitting}
                submitLabel={submitting ? "Generating..." : "Generate Key"}
                onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
            >
                <div className="space-y-4">
                    <Field label="Key Name" required error={formErrors.name || undefined}>
                        <Input
                            placeholder="e.g., Production API"
                            value={newKey.name}
                            onChange={(e) => {
                                setNewKey((prev) => ({ ...prev, name: e.target.value }));
                                if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                            }}
                        />
                    </Field>
                    <Field label="Permissions" required error={formErrors.permissions || undefined}>
                        <Select
                            value={newKey.permissions}
                            onValueChange={(val) => {
                                setNewKey((prev) => ({ ...prev, permissions: val }));
                                if (formErrors.permissions) setFormErrors((prev) => ({ ...prev, permissions: undefined }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select permissions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Full Access">Full Access</SelectItem>
                                <SelectItem value="Read Only">Read Only</SelectItem>
                                <SelectItem value="Write Only">Write Only</SelectItem>
                                <SelectItem value="Webhooks Only">Webhooks Only</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Expiry" required error={formErrors.expiry || undefined}>
                        <Select
                            value={newKey.expiry}
                            onValueChange={(val) => {
                                setNewKey((prev) => ({ ...prev, expiry: val }));
                                if (formErrors.expiry) setFormErrors((prev) => ({ ...prev, expiry: undefined }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select expiry period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30 days">30 days</SelectItem>
                                <SelectItem value="90 days">90 days</SelectItem>
                                <SelectItem value="1 year">1 year</SelectItem>
                                <SelectItem value="Never">Never</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    );
}
