"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
    Webhook,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Send,
    Globe,
    Activity,
    AlertTriangle,
    CheckCircle,
    Key,
    Loader2,
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
import { showSuccess, showWarning, showError } from "@/shared/utils/toast";
import {
    listWebhooks,
    createWebhook as apiCreateWebhook,
    updateWebhook as apiUpdateWebhook,
    deleteWebhook as apiDeleteWebhook,
} from "@/hooks/orgAdminHooks";

interface WebhookItem {
    id: string;
    name: string;
    url: string;
    events: string[];
    lastTriggered: string;
    status: string;
    failures: number;
    secret?: string;
}

interface WebhookForm {
    name: string;
    url: string;
    events: string[];
    secret: string;
}

interface FormErrors {
    name?: string;
    url?: string;
    events?: string;
}

const EVENT_OPTIONS = [
    "order.created",
    "order.updated",
    "user.created",
    "user.deleted",
    "payment.completed",
    "alert.triggered",
    "lead.created",
    "deal.closed",
];

const emptyForm: WebhookForm = { name: "", url: "", events: [], secret: "" };

export default function WebhooksPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Paused">("All");

    const [newWebhook, setNewWebhook] = useState<WebhookForm>({ ...emptyForm });
    const [formErrors, setFormErrors] = useState<FormErrors>({});

    const [editWebhook, setEditWebhook] = useState<WebhookForm & { id: string }>({ id: "", ...emptyForm });
    const [editFormErrors, setEditFormErrors] = useState<FormErrors>({});

    const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Normalize a backend webhook record into our WebhookItem shape
    const normalizeWebhook = (raw: any): WebhookItem => {
        const id = raw?._id || raw?.id || "";
        const lastTriggeredRaw = raw?.lastTriggered || raw?.lastTriggeredAt || raw?.updatedAt;
        const lastTriggered = lastTriggeredRaw
            ? new Date(lastTriggeredRaw).toLocaleString()
            : "Never";
        return {
            id,
            name: raw?.name || "—",
            url: raw?.url || "",
            events: Array.isArray(raw?.events) ? raw.events : [],
            lastTriggered,
            status: raw?.status === "Paused" || raw?.enabled === false ? "Paused" : "Active",
            failures: typeof raw?.failures === "number" ? raw.failures : 0,
            secret: raw?.secret,
        };
    };

    const fetchWebhooks = async () => {
        try {
            setLoading(true);
            const res = await listWebhooks();
            const data = res?.data?.webhooks || res?.data?.data || res?.data || [];
            const list = Array.isArray(data) ? data : [];
            setWebhooks(list.map(normalizeWebhook));
        } catch (err: any) {
            console.error("Failed to load webhooks:", err);
            showError(err?.response?.data?.message || "Failed to load webhooks");
            setWebhooks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const filteredWebhooks = useMemo(() => {
        return webhooks.filter((wh) => {
            const matchesSearch =
                searchQuery === "" ||
                wh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                wh.url.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                statusFilter === "All" || wh.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [webhooks, searchQuery, statusFilter]);

    const totalWebhooks = webhooks.length;
    const activeEndpoints = webhooks.filter((w) => w.status === "Active").length;
    const failedDeliveries = webhooks.reduce((sum, w) => sum + w.failures, 0);
    const successRate = totalWebhooks > 0
        ? (((totalWebhooks * 100 - failedDeliveries) / (totalWebhooks * 100)) * 100).toFixed(1)
        : "100.0";

    const validateForm = (form: WebhookForm): FormErrors => {
        const errors: FormErrors = {};
        if (!form.name.trim()) errors.name = "Endpoint name is required";
        if (!form.url.trim()) errors.url = "URL is required";
        if (form.events.length === 0) errors.events = "Select at least one event";
        return errors;
    };

    const handleCreate = async () => {
        const errors = validateForm(newWebhook);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                name: newWebhook.name.trim(),
                url: newWebhook.url.trim(),
                events: newWebhook.events,
                ...(newWebhook.secret ? { secret: newWebhook.secret } : {}),
            };
            await apiCreateWebhook(payload);
            showSuccess(`Webhook "${payload.name}" created successfully`);
            setShowCreateModal(false);
            setNewWebhook({ ...emptyForm });
            setFormErrors({});
            await fetchWebhooks();
        } catch (err: any) {
            console.error("Create webhook failed:", err);
            showError(err?.response?.data?.message || "Failed to create webhook");
        } finally {
            setSubmitting(false);
        }
    };

    const openEdit = (wh: WebhookItem) => {
        setEditWebhook({
            id: wh.id,
            name: wh.name,
            url: wh.url,
            events: [...wh.events],
            secret: wh.secret || "",
        });
        setEditFormErrors({});
        setShowEditModal(true);
    };

    const handleEdit = async () => {
        const errors = validateForm(editWebhook);
        if (Object.keys(errors).length > 0) {
            setEditFormErrors(errors);
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                name: editWebhook.name.trim(),
                url: editWebhook.url.trim(),
                events: editWebhook.events,
                ...(editWebhook.secret ? { secret: editWebhook.secret } : {}),
            };
            await apiUpdateWebhook(editWebhook.id, payload);
            showSuccess(`Webhook "${payload.name}" updated successfully`);
            setShowEditModal(false);
            setEditFormErrors({});
            await fetchWebhooks();
        } catch (err: any) {
            console.error("Update webhook failed:", err);
            showError(err?.response?.data?.message || "Failed to update webhook");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteWebhook = async (id: string) => {
        const wh = webhooks.find((w) => w.id === id);
        if (!wh) return;
        const confirmed = window.confirm(
            `Are you sure you want to delete "${wh.name}"? This action cannot be undone.`
        );
        if (!confirmed) return;
        try {
            await apiDeleteWebhook(id);
            showWarning(`Webhook "${wh.name}" deleted`);
            await fetchWebhooks();
        } catch (err: any) {
            console.error("Delete webhook failed:", err);
            showError(err?.response?.data?.message || "Failed to delete webhook");
        }
    };

    const toggleStatus = async (id: string) => {
        const wh = webhooks.find((w) => w.id === id);
        if (!wh) return;
        const newStatus = wh.status === "Active" ? "Paused" : "Active";
        try {
            await apiUpdateWebhook(id, { status: newStatus, enabled: newStatus === "Active" });
            setWebhooks((prev) =>
                prev.map((w) => (w.id === id ? { ...w, status: newStatus } : w))
            );
        } catch (err: any) {
            console.error("Toggle webhook failed:", err);
            showError(err?.response?.data?.message || "Failed to update webhook status");
        }
    };

    const testWebhook = (wh: WebhookItem) => {
        showSuccess(`Ping sent to ${wh.name}`);
    };

    const cycleStatusFilter = () => {
        setStatusFilter((prev) => {
            if (prev === "All") return "Active";
            if (prev === "Active") return "Paused";
            return "All";
        });
    };

    const toggleEvent = (
        form: WebhookForm,
        setForm: React.Dispatch<React.SetStateAction<any>>,
        event: string,
        errorsKey: "formErrors" | "editFormErrors",
        setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
    ) => {
        const updated = form.events.includes(event)
            ? form.events.filter((e) => e !== event)
            : [...form.events, event];
        setForm((prev: any) => ({ ...prev, events: updated }));
        if (updated.length > 0) setErrors((prev) => ({ ...prev, events: undefined }));
    };

    const renderEventCheckboxes = (
        form: WebhookForm,
        setForm: React.Dispatch<React.SetStateAction<any>>,
        errors: FormErrors,
        setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
        errorsKey: "formErrors" | "editFormErrors"
    ) => (
        <Field label="Events" required error={errors.events || undefined}>
            <div className="grid grid-cols-2 gap-2">
                {EVENT_OPTIONS.map((event) => (
                    <label
                        key={event}
                        className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-primary transition-colors"
                    >
                        <input
                            type="checkbox"
                            checked={form.events.includes(event)}
                            onChange={() => toggleEvent(form, setForm, event, errorsKey, setErrors)}
                            className="accent-primary rounded-none w-3.5 h-3.5"
                        />
                        <span className="text-xs">{event}</span>
                    </label>
                ))}
            </div>
        </Field>
    );

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Webhooks</h1>
                    <p className="text-sm text-gray-600">Manage webhook endpoints for real-time event notifications.</p>
                </div>
                <Button
                    onClick={() => {
                        setNewWebhook({ ...emptyForm });
                        setFormErrors({});
                        setShowCreateModal(true);
                    }}
                    className="rounded-none bg-primary hover:bg-primary/90 font-black text-sm h-11 gap-2 shadow-xl shadow-primary/20 px-6"
                >
                    <Plus size={16} /> Create Webhook
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-xs opacity-80">Total Webhooks</p>
                    <p className="text-white text-xl font-semibold mt-1">{totalWebhooks}</p>
                    <p className="text-white text-[10px] mt-1 opacity-80">Configured endpoints</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Active Endpoints</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{activeEndpoints}</p>
                    <p className="text-primary text-[10px] mt-1">Currently receiving events</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Failed Deliveries</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{failedDeliveries}</p>
                    <p className="text-amber-600 text-[10px] mt-1">Requires attention</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-xs">Success Rate</p>
                    <p className="text-xl font-semibold text-gray-900 mt-1">{successRate}%</p>
                    <p className="text-green-600 text-[10px] mt-1">Delivery success</p>
                </div>
            </div>

            {/* Webhooks Table */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search by name or URL..."
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
                                <Badge className={`${statusFilter === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5 ml-1`}>
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Endpoint Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">URL</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Events</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Last Triggered</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 size={32} className="text-primary animate-spin" />
                                            <p className="text-sm font-bold text-gray-500">Loading webhooks...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredWebhooks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Webhook size={40} className="text-zinc-300" />
                                            <p className="text-sm font-bold text-gray-500">No webhooks found</p>
                                            <p className="text-xs text-gray-400">Create your first webhook to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredWebhooks.map((wh) => (
                                    <tr key={wh.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 text-primary rounded-none border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                                                    <Globe size={18} />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-bold text-gray-900">{wh.name}</span>
                                                    {wh.failures > 0 && (
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <AlertTriangle size={11} className="text-amber-500" />
                                                            <span className="text-[10px] text-amber-600 font-medium">{wh.failures} failed</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-gray-600 font-mono">{wh.url}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {wh.events.map((event) => (
                                                    <Badge
                                                        key={event}
                                                        className="bg-primary/10 text-primary border-primary/20 rounded-none text-[10px] font-bold px-2 py-0.5"
                                                    >
                                                        {event}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">{wh.lastTriggered}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={wh.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(wh.id)}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                                <Badge className={`${wh.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-none text-[10px] font-bold px-2 py-0.5`}>
                                                    {wh.status}
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
                                                        onClick={() => openEdit(wh)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Edit size={14} /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => testWebhook(wh)}
                                                        className="text-sm p-2 flex items-center gap-2 focus:bg-primary focus:text-white cursor-pointer"
                                                    >
                                                        <Send size={14} /> Test Webhook
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2" />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteWebhook(wh.id)}
                                                        className="text-sm p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Trash2 size={14} /> Delete
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
                    <p className="text-sm text-gray-600">Showing {filteredWebhooks.length} of {webhooks.length} webhooks</p>
                </div>
            </div>

            {/* Create Sheet */}
            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) {
                        setNewWebhook({ ...emptyForm });
                        setFormErrors({});
                    }
                }}
                title="Create Webhook"
                description="Configure a new endpoint to receive event notifications."
                icon={<Plus size={20} />}
                accentColor="#4f46e5"
                width="md"
                loading={submitting}
                submitLabel={submitting ? "Creating..." : "Create Webhook"}
                onSubmit={(e) => { e.preventDefault(); handleCreate(); }}
            >
                <div className="space-y-4">
                    <Field label="Endpoint Name" required error={formErrors.name || undefined}>
                        <Input
                            placeholder="e.g., Order Notification"
                            value={newWebhook.name}
                            onChange={(e) => {
                                setNewWebhook((prev) => ({ ...prev, name: e.target.value }));
                                if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                            }}
                        />
                    </Field>
                    <Field label="URL" required error={formErrors.url || undefined}>
                        <Input
                            placeholder="https://api.example.com/webhooks"
                            value={newWebhook.url}
                            onChange={(e) => {
                                setNewWebhook((prev) => ({ ...prev, url: e.target.value }));
                                if (formErrors.url) setFormErrors((prev) => ({ ...prev, url: undefined }));
                            }}
                        />
                    </Field>
                    {renderEventCheckboxes(newWebhook, setNewWebhook, formErrors, setFormErrors, "formErrors")}
                    <Field label="Secret Key" hint="Optional">
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                            <Input
                                placeholder="whsec_..."
                                value={newWebhook.secret}
                                onChange={(e) => setNewWebhook((prev) => ({ ...prev, secret: e.target.value }))}
                                className="pl-9"
                            />
                        </div>
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
                title="Edit Webhook"
                description="Update endpoint configuration and subscribed events."
                icon={<Edit size={20} />}
                accentColor="#7c3aed"
                width="md"
                loading={submitting}
                submitLabel={submitting ? "Saving..." : "Save Changes"}
                onSubmit={(e) => { e.preventDefault(); handleEdit(); }}
            >
                <div className="space-y-4">
                    <Field label="Endpoint Name" required error={editFormErrors.name || undefined}>
                        <Input
                            placeholder="e.g., Order Notification"
                            value={editWebhook.name}
                            onChange={(e) => {
                                setEditWebhook((prev) => ({ ...prev, name: e.target.value }));
                                if (editFormErrors.name) setEditFormErrors((prev) => ({ ...prev, name: undefined }));
                            }}
                        />
                    </Field>
                    <Field label="URL" required error={editFormErrors.url || undefined}>
                        <Input
                            placeholder="https://api.example.com/webhooks"
                            value={editWebhook.url}
                            onChange={(e) => {
                                setEditWebhook((prev) => ({ ...prev, url: e.target.value }));
                                if (editFormErrors.url) setEditFormErrors((prev) => ({ ...prev, url: undefined }));
                            }}
                        />
                    </Field>
                    {renderEventCheckboxes(editWebhook, setEditWebhook, editFormErrors, setEditFormErrors, "editFormErrors")}
                    <Field label="Secret Key" hint="Optional">
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                            <Input
                                placeholder="whsec_..."
                                value={editWebhook.secret}
                                onChange={(e) => setEditWebhook((prev) => ({ ...prev, secret: e.target.value }))}
                                className="pl-9"
                            />
                        </div>
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    );
}
