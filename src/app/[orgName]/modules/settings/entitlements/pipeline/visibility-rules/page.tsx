"use client";

import React, { useState, useMemo } from "react";
import {
    Eye,
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    MoreVertical,
    Shield,
    Lock,
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

type Rule = {
    id: string;
    name: string;
    scope: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    status: "Active" | "Inactive";
    notes?: string;
};

const SCOPES = [
    "Team Members",
    "Managers",
    "Admins",
    "Partners",
    "Executives",
    "External Auditors",
] as const;
const SCOPE_FILTERS = ["All", ...SCOPES] as const;
const STATUS_FILTERS = ["All", "Active", "Inactive"] as const;

export default function VisibilityRulesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [scopeFilterIndex, setScopeFilterIndex] = useState(0);
    const [statusFilterIndex, setStatusFilterIndex] = useState(0);

    const [rules, setRules] = useState<Rule[]>([
        { id: "1", name: "Team Visibility", scope: "Team Members", canView: true, canEdit: false, canDelete: false, status: "Active" },
        { id: "2", name: "Manager Override", scope: "Managers", canView: true, canEdit: true, canDelete: false, status: "Active" },
        { id: "3", name: "Admin Full Access", scope: "Admins", canView: true, canEdit: true, canDelete: true, status: "Active" },
        { id: "4", name: "External Partner View", scope: "Partners", canView: true, canEdit: false, canDelete: false, status: "Inactive" },
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);

    const [formName, setFormName] = useState("");
    const [formScope, setFormScope] = useState<string>(SCOPES[0]);
    const [formCanView, setFormCanView] = useState(true);
    const [formCanEdit, setFormCanEdit] = useState(false);
    const [formCanDelete, setFormCanDelete] = useState(false);
    const [formNotes, setFormNotes] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState(false);

    const activeScopeFilter = SCOPE_FILTERS[scopeFilterIndex];
    const activeStatusFilter = STATUS_FILTERS[statusFilterIndex];

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const name = formName.trim();
        const dup = rules.find(
            (r) =>
                r.name.toLowerCase() === name.toLowerCase() &&
                r.id !== editingRule?.id
        );
        if (touched.name) {
            if (!name) e.name = "Rule name is required";
            else if (name.length < 3) e.name = "Name must be at least 3 characters";
            else if (dup) e.name = "Rule with this name already exists";
        }
        return e;
    }, [formName, touched, rules, editingRule]);

    const filteredRules = useMemo(() => {
        return rules.filter((r) => {
            const q = searchQuery.toLowerCase().trim();
            const matchQ =
                !q || r.name.toLowerCase().includes(q) || r.scope.toLowerCase().includes(q);
            const matchSc = activeScopeFilter === "All" || r.scope === activeScopeFilter;
            const matchSt = activeStatusFilter === "All" || r.status === activeStatusFilter;
            return matchQ && matchSc && matchSt;
        });
    }, [rules, searchQuery, activeScopeFilter, activeStatusFilter]);

    const resetForm = () => {
        setFormName("");
        setFormScope(SCOPES[0]);
        setFormCanView(true);
        setFormCanEdit(false);
        setFormCanDelete(false);
        setFormNotes("");
        setTouched({});
    };

    const openCreateModal = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const openEditModal = (r: Rule) => {
        setEditingRule(r);
        setFormName(r.name);
        setFormScope(r.scope);
        setFormCanView(r.canView);
        setFormCanEdit(r.canEdit);
        setFormCanDelete(r.canDelete);
        setFormNotes(r.notes || "");
        setTouched({});
        setShowEditModal(true);
    };

    const validateAll = () => {
        setTouched({ name: true });
        const name = formName.trim();
        const dup = rules.find(
            (r) =>
                r.name.toLowerCase() === name.toLowerCase() &&
                r.id !== editingRule?.id
        );
        if (!name) return "Rule name is required";
        if (name.length < 3) return "Name must be at least 3 characters";
        if (dup) return "Rule with this name already exists";
        if (!formCanView && !formCanEdit && !formCanDelete)
            return "Grant at least one permission";
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
            const rule: Rule = {
                id: String(Date.now()),
                name: formName.trim(),
                scope: formScope,
                canView: formCanView,
                canEdit: formCanEdit,
                canDelete: formCanDelete,
                status: "Active",
                notes: formNotes.trim() || undefined,
            };
            setRules((prev) => [...prev, rule]);
            setShowCreateModal(false);
            resetForm();
            showSuccess(`Visibility rule "${rule.name}" created`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRule) return;
        const err = validateAll();
        if (err) {
            showWarning(err);
            return;
        }
        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 300));
            setRules((prev) =>
                prev.map((r) =>
                    r.id === editingRule.id
                        ? {
                              ...r,
                              name: formName.trim(),
                              scope: formScope,
                              canView: formCanView,
                              canEdit: formCanEdit,
                              canDelete: formCanDelete,
                              notes: formNotes.trim() || undefined,
                          }
                        : r
                )
            );
            setShowEditModal(false);
            setEditingRule(null);
            resetForm();
            showSuccess("Visibility rule updated");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = (id: string) => {
        setRules((prev) =>
            prev.map((r) => {
                if (r.id !== id) return r;
                const newStatus = r.status === "Active" ? "Inactive" : "Active";
                showSuccess(`${r.name} ${newStatus === "Active" ? "activated" : "deactivated"}`);
                return { ...r, status: newStatus };
            })
        );
    };

    const togglePermission = (id: string, perm: "canView" | "canEdit" | "canDelete") => {
        setRules((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [perm]: !r[perm] } : r))
        );
    };

    const deleteRule = (id: string) => {
        const r = rules.find((x) => x.id === id);
        if (!r) return;
        const ok = window.confirm(`Delete visibility rule "${r.name}"?`);
        if (!ok) return;
        setRules((prev) => prev.filter((x) => x.id !== id));
        showSuccess(`Visibility rule "${r.name}" deleted`);
    };

    const cycleScopeFilter = () =>
        setScopeFilterIndex((p) => (p + 1) % SCOPE_FILTERS.length);
    const cycleStatusFilter = () =>
        setStatusFilterIndex((p) => (p + 1) % STATUS_FILTERS.length);

    const handleExport = () => {
        const csv = [
            ["Rule", "Scope", "View", "Edit", "Delete", "Status"],
            ...rules.map((r) => [
                r.name,
                r.scope,
                r.canView ? "Yes" : "No",
                r.canEdit ? "Yes" : "No",
                r.canDelete ? "Yes" : "No",
                r.status,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `visibility-rules-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showSuccess("Visibility rules exported");
    };

    const summary = [
        {
            label: "Visibility Rules",
            value: String(rules.length),
            sub: "Access control policies",
            color: "text-white",
            isHighlight: true,
        },
        {
            label: "Protected Deals",
            value: "1,204",
            sub: "Access controlled",
            color: "text-emerald-600",
            isHighlight: false,
        },
        {
            label: "User Groups",
            value: String(new Set(rules.map((r) => r.scope)).size),
            sub: "With permissions",
            color: "text-primary",
            isHighlight: false,
        },
        {
            label: "Compliance",
            value: "100%",
            sub: "All rules enforced",
            color: "text-amber-600",
            isHighlight: false,
        },
    ];

    const PermToggle = ({
        checked,
        onChange,
        label,
    }: {
        checked: boolean;
        onChange: (v: boolean) => void;
        label: string;
    }) => (
        <div className="flex items-center justify-between p-4 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC]">
            <div>
                <p className="text-[13px] font-semibold text-[#374151]">{label}</p>
                <p className="text-[11.5px] text-[#9CA3AF] mt-0.5">
                    {label === "Can View" && "Users in this scope can read deal data."}
                    {label === "Can Edit" && "Users in this scope can modify deal fields."}
                    {label === "Can Delete" && "Users in this scope can remove deals."}
                </p>
            </div>
            <Switch
                checked={checked}
                onCheckedChange={onChange}
                className="data-[state=checked]:bg-primary"
            />
        </div>
    );

    const renderFormFields = () => (
        <div className="space-y-4">
            <Field label="Rule Name" required error={errors.name} hint="A unique, descriptive label">
                <Input
                    placeholder="e.g. Team Visibility"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={80}
                />
            </Field>

            <Field label="Scope" required hint="User group this rule applies to">
                <Select value={formScope} onValueChange={setFormScope}>
                    <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                        <SelectValue placeholder="Select user group" />
                    </SelectTrigger>
                    <SelectContent>
                        {SCOPES.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>

            <div className="space-y-3">
                <label className="text-[13px] font-semibold text-[#374151]">
                    Permissions <span className="text-red-500">*</span>
                </label>
                <PermToggle checked={formCanView} onChange={setFormCanView} label="Can View" />
                <PermToggle checked={formCanEdit} onChange={setFormCanEdit} label="Can Edit" />
                <PermToggle checked={formCanDelete} onChange={setFormCanDelete} label="Can Delete" />
            </div>

            <Field label="Notes" hint="Optional rationale or policy link">
                <Textarea
                    placeholder="Explain when this rule applies..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
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
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Visibility Rules</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Govern who can view, edit, or delete pipeline deals across user groups.
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
                            <Plus size={14} /> Create Rule
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
                                placeholder="Search by name or scope..."
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button
                                variant="outline"
                                className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                                onClick={cycleScopeFilter}
                            >
                                <Filter size={14} />{" "}
                                {activeScopeFilter === "All" ? "Filter Scope" : activeScopeFilter}
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                                onClick={cycleStatusFilter}
                            >
                                <Lock size={14} /> Status: {activeStatusFilter}
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Rule</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Scope</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">View</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Edit</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Delete</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredRules.map((rule) => (
                                    <tr
                                        key={rule.id}
                                        className="hover:bg-primary/5 transition-colors group"
                                    >
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900 leading-tight">
                                                    {rule.name}
                                                </span>
                                                {rule.notes && (
                                                    <span className="text-[10px] text-gray-500 font-medium mt-0.5 line-clamp-1">
                                                        {rule.notes}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="h-1.5 w-1.5 bg-primary rounded-none" />
                                                    <span className="text-[10px] text-primary font-medium">
                                                        Access Policy
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 text-white rounded-none w-fit">
                                                <Users size={10} />
                                                <span className="text-[10px] font-medium">{rule.scope}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <Switch
                                                checked={rule.canView}
                                                onCheckedChange={() => togglePermission(rule.id, "canView")}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <Switch
                                                checked={rule.canEdit}
                                                onCheckedChange={() => togglePermission(rule.id, "canEdit")}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <Switch
                                                checked={rule.canDelete}
                                                onCheckedChange={() => togglePermission(rule.id, "canDelete")}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={rule.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(rule.id)}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                                <div
                                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-none border ${
                                                        rule.status === "Active"
                                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                            : "bg-zinc-50 text-zinc-500 border-zinc-200"
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-medium">{rule.status}</span>
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
                                                        onClick={() => openEditModal(rule)}
                                                    >
                                                        <Edit size={14} /> Edit Rule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1" />
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium p-2 text-rose-600 rounded-md cursor-pointer flex items-center gap-2"
                                                        onClick={() => deleteRule(rule.id)}
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRules.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-10 text-center text-xs text-gray-400 font-medium"
                                        >
                                            No visibility rules match the current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                        <p className="text-[11px] font-medium text-zinc-500">
                            Showing{" "}
                            <span className="text-zinc-900 font-semibold">{filteredRules.length}</span>{" "}
                            of{" "}
                            <span className="text-zinc-900 font-semibold">{rules.length} rules</span>
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
                title="Create Visibility Rule"
                description="Define access control for pipeline data visibility."
                icon={<Eye className="w-5 h-5" />}
                onSubmit={handleCreate}
                submitLabel="Create Rule"
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
                        setEditingRule(null);
                        resetForm();
                    }
                }}
                title="Edit Visibility Rule"
                description="Update scope and permission flags."
                icon={<Shield className="w-5 h-5" />}
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
