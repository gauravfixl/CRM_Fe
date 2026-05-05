"use client";

import React, { useState, useMemo } from "react";
import {
    AlertCircle,
    Clock,
    TrendingDown,
    Plus,
    Search,
    Edit,
    Trash2,
    MoreVertical,
    Bell,
    RefreshCw,
    Filter,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { showSuccess, showWarning } from "@/shared/utils/toast";

type Alert = {
    id: string;
    rule: string;
    threshold: string;
    affectedDeals: number;
    severity: "Low" | "Medium" | "High";
    autoNotify: boolean;
    status: "Active" | "Inactive";
    description?: string;
};

const THRESHOLDS = ["7 days", "14 days", "30 days", "60 days", "90 days"] as const;
const SEVERITIES = ["Low", "Medium", "High"] as const;
const SEVERITY_FILTERS = ["All", ...SEVERITIES] as const;
const STATUS_FILTERS = ["All", "Active", "Inactive"] as const;

export default function StagnationAlertsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [severityFilterIndex, setSeverityFilterIndex] = useState(0);
    const [statusFilterIndex, setStatusFilterIndex] = useState(0);

    const [alerts, setAlerts] = useState<Alert[]>([
        { id: "1", rule: "30 Days No Activity", threshold: "30 days", affectedDeals: 12, severity: "High", autoNotify: true, status: "Active" },
        { id: "2", rule: "Stuck in Proposal", threshold: "14 days", affectedDeals: 8, severity: "Medium", autoNotify: true, status: "Active" },
        { id: "3", rule: "No Contact Attempt", threshold: "7 days", affectedDeals: 24, severity: "Low", autoNotify: false, status: "Active" },
        { id: "4", rule: "Dormant Lead", threshold: "60 days", affectedDeals: 5, severity: "High", autoNotify: true, status: "Inactive" },
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

    const [formRule, setFormRule] = useState("");
    const [formThreshold, setFormThreshold] = useState<string>(THRESHOLDS[2]);
    const [formSeverity, setFormSeverity] = useState<Alert["severity"]>("Medium");
    const [formAutoNotify, setFormAutoNotify] = useState(false);
    const [formDescription, setFormDescription] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState(false);

    const activeSeverityFilter = SEVERITY_FILTERS[severityFilterIndex];
    const activeStatusFilter = STATUS_FILTERS[statusFilterIndex];

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const rule = formRule.trim();
        const dup = alerts.find(
            (a) =>
                a.rule.toLowerCase() === rule.toLowerCase() &&
                a.id !== editingAlert?.id
        );
        if (touched.rule) {
            if (!rule) e.rule = "Rule name is required";
            else if (rule.length < 3) e.rule = "Name must be at least 3 characters";
            else if (dup) e.rule = "Rule with this name already exists";
        }
        return e;
    }, [formRule, touched, alerts, editingAlert]);

    const filteredAlerts = useMemo(() => {
        return alerts.filter((a) => {
            const q = searchQuery.toLowerCase().trim();
            const matchQ =
                !q ||
                a.rule.toLowerCase().includes(q) ||
                a.threshold.toLowerCase().includes(q);
            const matchSev = activeSeverityFilter === "All" || a.severity === activeSeverityFilter;
            const matchSt = activeStatusFilter === "All" || a.status === activeStatusFilter;
            return matchQ && matchSev && matchSt;
        });
    }, [alerts, searchQuery, activeSeverityFilter, activeStatusFilter]);

    const resetForm = () => {
        setFormRule("");
        setFormThreshold(THRESHOLDS[2]);
        setFormSeverity("Medium");
        setFormAutoNotify(false);
        setFormDescription("");
        setTouched({});
    };

    const openCreateModal = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const openEditModal = (a: Alert) => {
        setEditingAlert(a);
        setFormRule(a.rule);
        setFormThreshold(a.threshold);
        setFormSeverity(a.severity);
        setFormAutoNotify(a.autoNotify);
        setFormDescription(a.description || "");
        setTouched({});
        setShowEditModal(true);
    };

    const validateAll = () => {
        setTouched({ rule: true });
        const rule = formRule.trim();
        const dup = alerts.find(
            (a) =>
                a.rule.toLowerCase() === rule.toLowerCase() &&
                a.id !== editingAlert?.id
        );
        if (!rule) return "Rule name is required";
        if (rule.length < 3) return "Name must be at least 3 characters";
        if (dup) return "Rule with this name already exists";
        return null;
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validateAll();
        if (err) {
            showWarning(err);
            return;
        }
        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 300));
            const alert: Alert = {
                id: String(Date.now()),
                rule: formRule.trim(),
                threshold: formThreshold,
                affectedDeals: 0,
                severity: formSeverity,
                autoNotify: formAutoNotify,
                status: "Active",
                description: formDescription.trim() || undefined,
            };
            setAlerts((prev) => [...prev, alert]);
            setShowCreateModal(false);
            resetForm();
            showSuccess(`Alert rule "${alert.rule}" created`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAlert) return;
        const err = validateAll();
        if (err) {
            showWarning(err);
            return;
        }
        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 300));
            setAlerts((prev) =>
                prev.map((a) =>
                    a.id === editingAlert.id
                        ? {
                              ...a,
                              rule: formRule.trim(),
                              threshold: formThreshold,
                              severity: formSeverity,
                              autoNotify: formAutoNotify,
                              description: formDescription.trim() || undefined,
                          }
                        : a
                )
            );
            setShowEditModal(false);
            setEditingAlert(null);
            resetForm();
            showSuccess("Alert rule updated");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = (id: string) => {
        setAlerts((prev) =>
            prev.map((a) => {
                if (a.id !== id) return a;
                const newStatus = a.status === "Active" ? "Inactive" : "Active";
                showSuccess(`${a.rule} ${newStatus === "Active" ? "activated" : "deactivated"}`);
                return { ...a, status: newStatus };
            })
        );
    };

    const toggleAutoNotify = (id: string) => {
        setAlerts((prev) =>
            prev.map((a) => {
                if (a.id !== id) return a;
                const next = !a.autoNotify;
                showSuccess(`Auto notify ${next ? "enabled" : "disabled"} for ${a.rule}`);
                return { ...a, autoNotify: next };
            })
        );
    };

    const deleteAlert = (id: string) => {
        const a = alerts.find((x) => x.id === id);
        if (!a) return;
        const ok = window.confirm(`Delete alert rule "${a.rule}"?`);
        if (!ok) return;
        setAlerts((prev) => prev.filter((x) => x.id !== id));
        showSuccess(`Alert rule "${a.rule}" deleted`);
    };

    const runAudit = (id: string) => {
        const a = alerts.find((x) => x.id === id);
        if (!a) return;
        showSuccess(`Re-scanned "${a.rule}" — ${a.affectedDeals} deals matching`);
    };

    const cycleSeverityFilter = () =>
        setSeverityFilterIndex((p) => (p + 1) % SEVERITY_FILTERS.length);
    const cycleStatusFilter = () =>
        setStatusFilterIndex((p) => (p + 1) % STATUS_FILTERS.length);

    const handleExport = () => {
        const csv = [
            ["Rule", "Threshold", "Affected Deals", "Severity", "Auto Notify", "Status"],
            ...alerts.map((a) => [
                a.rule,
                a.threshold,
                a.affectedDeals,
                a.severity,
                a.autoNotify ? "Yes" : "No",
                a.status,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `stagnation-alerts-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showSuccess("Alert rules exported");
    };

    const summary = [
        {
            label: "Alert Rules",
            value: String(alerts.length),
            sub: "Configured rules",
            color: "text-white",
            isHighlight: true,
        },
        {
            label: "Stagnant Deals",
            value: String(alerts.reduce((s, a) => s + a.affectedDeals, 0)),
            sub: "Needs attention",
            color: "text-amber-600",
            isHighlight: false,
        },
        {
            label: "Alerts Sent",
            value: "156",
            sub: "This month",
            color: "text-primary",
            isHighlight: false,
        },
        {
            label: "Recovery Rate",
            value: "68%",
            sub: "Deals reactivated",
            color: "text-emerald-600",
            isHighlight: false,
        },
    ];

    const severityBadge = (severity: Alert["severity"]) => {
        if (severity === "High")
            return "bg-rose-50 text-rose-600 border-rose-100";
        if (severity === "Medium")
            return "bg-amber-50 text-amber-600 border-amber-100";
        return "bg-zinc-50 text-zinc-600 border-zinc-200";
    };

    const renderFormFields = () => (
        <div className="space-y-4">
            <Field label="Rule Name" required error={errors.rule} hint="A unique, descriptive label">
                <Input
                    placeholder="e.g. 30 Days No Activity"
                    value={formRule}
                    onChange={(e) => setFormRule(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, rule: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={80}
                />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Threshold" required hint="Inactivity window">
                    <Select value={formThreshold} onValueChange={setFormThreshold}>
                        <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                            <SelectValue placeholder="Select threshold" />
                        </SelectTrigger>
                        <SelectContent>
                            {THRESHOLDS.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {t}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Severity" required hint="Priority level">
                    <Select
                        value={formSeverity}
                        onValueChange={(v) => setFormSeverity(v as Alert["severity"])}
                    >
                        <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                            <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                            {SEVERITIES.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {s}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC]">
                <div>
                    <p className="text-[13px] font-semibold text-[#374151]">Auto Notify</p>
                    <p className="text-[11.5px] text-[#9CA3AF] mt-0.5">
                        Automatically send email and in-app alerts when the rule fires.
                    </p>
                </div>
                <Switch
                    checked={formAutoNotify}
                    onCheckedChange={setFormAutoNotify}
                    className="data-[state=checked]:bg-primary"
                />
            </div>

            <Field label="Description" hint="Optional guidance for owners">
                <Textarea
                    placeholder="Explain what triggers this alert..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="min-h-[90px] rounded-lg border-[#E5E7EB] bg-white focus:border-primary resize-none"
                    maxLength={400}
                />
            </Field>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Stagnation Alerts</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Monitor deal inactivity and trigger alerts before pipelines stall.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="rounded-none border-zinc-200 font-medium text-xs h-9 gap-2"
                            onClick={handleExport}
                        >
                            <Download size={14} /> Export
                        </Button>
                        <Button
                            className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-9 gap-2 shadow-md shadow-primary/20 px-5"
                            onClick={openCreateModal}
                        >
                            <Plus size={14} /> Create Alert Rule
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {summary.map((item, idx) =>
                        idx === 0 ? (
                            <div
                                key={idx}
                                className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white"
                            >
                                <p className="text-white text-xs opacity-80">{item.label}</p>
                                <p className="text-white text-xl font-semibold mt-1">{item.value}</p>
                                <p className="text-white text-[10px] mt-1 opacity-70">{item.sub}</p>
                            </div>
                        ) : (
                            <div
                                key={idx}
                                className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg"
                            >
                                <p className="text-zinc-500 text-xs">{item.label}</p>
                                <p className="text-xl font-semibold text-zinc-900 mt-1">{item.value}</p>
                                <p className={`text-[10px] mt-1 ${item.color}`}>{item.sub}</p>
                            </div>
                        )
                    )}
                </div>

                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                                size={16}
                            />
                            <Input
                                placeholder="Search by rule name or threshold..."
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button
                                variant="outline"
                                className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                                onClick={cycleSeverityFilter}
                            >
                                <Filter size={14} />{" "}
                                {activeSeverityFilter === "All" ? "Filter Severity" : activeSeverityFilter}
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                                onClick={cycleStatusFilter}
                            >
                                <Bell size={14} /> Status: {activeStatusFilter}
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Rule Name</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Threshold</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Affected Deals</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Severity</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Auto Notify</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredAlerts.map((alert) => (
                                    <tr
                                        key={alert.id}
                                        className="hover:bg-primary/5 transition-colors group"
                                    >
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900 leading-tight">
                                                    {alert.rule}
                                                </span>
                                                {alert.description && (
                                                    <span className="text-[10px] text-gray-500 font-medium mt-0.5 line-clamp-1">
                                                        {alert.description}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="h-1.5 w-1.5 bg-primary rounded-none" />
                                                    <span className="text-[10px] text-primary font-medium">
                                                        Stagnation Guardrail
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-50 text-zinc-700 border border-zinc-200 rounded-none w-fit">
                                                <Clock size={12} />
                                                <span className="text-[10px] font-medium">{alert.threshold}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-1.5">
                                                <TrendingDown size={12} className="text-amber-600" />
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {alert.affectedDeals}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div
                                                className={`flex items-center gap-1.5 px-2 py-1 rounded-none border w-fit ${severityBadge(
                                                    alert.severity
                                                )}`}
                                            >
                                                <AlertCircle size={12} />
                                                <span className="text-[10px] font-medium">{alert.severity}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={alert.autoNotify}
                                                    onCheckedChange={() => toggleAutoNotify(alert.id)}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                                <span
                                                    className={`text-[10px] font-medium ${
                                                        alert.autoNotify ? "text-emerald-600" : "text-zinc-400"
                                                    }`}
                                                >
                                                    {alert.autoNotify ? "Enabled" : "Disabled"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={alert.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(alert.id)}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                                <div
                                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-none border ${
                                                        alert.status === "Active"
                                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                            : "bg-zinc-50 text-zinc-500 border-zinc-200"
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-medium">{alert.status}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="rounded-none border-zinc-200 shadow-lg p-2 min-w-[160px]"
                                                >
                                                    <DropdownMenuLabel className="text-[10px] font-medium text-gray-400 mb-1">
                                                        Actions
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium p-2 rounded-md cursor-pointer flex items-center gap-2"
                                                        onClick={() => runAudit(alert.id)}
                                                    >
                                                        <RefreshCw size={14} /> Re-scan
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium p-2 rounded-md cursor-pointer flex items-center gap-2"
                                                        onClick={() => openEditModal(alert)}
                                                    >
                                                        <Edit size={14} /> Edit Rule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1" />
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium p-2 text-rose-600 rounded-md cursor-pointer flex items-center gap-2"
                                                        onClick={() => deleteAlert(alert.id)}
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filteredAlerts.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-10 text-center text-xs text-gray-400 font-medium"
                                        >
                                            No alert rules match the current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                        <p className="text-[11px] font-medium text-zinc-500">
                            Showing{" "}
                            <span className="text-zinc-900 font-semibold">{filteredAlerts.length}</span>{" "}
                            of{" "}
                            <span className="text-zinc-900 font-semibold">
                                {alerts.length} alert rules
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) resetForm();
                }}
                title="Create Alert Rule"
                description="Define a stagnation threshold and notification behavior."
                icon={<Bell className="w-5 h-5" />}
                onSubmit={handleCreate}
                submitLabel="Create Alert Rule"
                loading={submitting}
                width="md"
            >
                {renderFormFields()}
            </SideFormSheet>

            <SideFormSheet
                open={showEditModal}
                onOpenChange={(o) => {
                    setShowEditModal(o);
                    if (!o) {
                        setEditingAlert(null);
                        resetForm();
                    }
                }}
                title="Edit Alert Rule"
                description="Update threshold, severity, and notification settings."
                icon={<Edit className="w-5 h-5" />}
                onSubmit={handleEdit}
                submitLabel="Save Changes"
                loading={submitting}
                width="md"
            >
                {renderFormFields()}
            </SideFormSheet>
        </div>
    );
}
