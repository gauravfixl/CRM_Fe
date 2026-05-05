"use client";

import React, { useState, useMemo } from "react";
import {
    Zap,
    Plus,
    Search,
    Play,
    Edit,
    Trash2,
    MoreVertical,
    Clock,
    CheckCircle2,
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

type Automation = {
    id: string;
    name: string;
    trigger: string;
    action: string;
    conditions: number;
    status: "Active" | "Inactive";
    executions: number;
    description?: string;
};

const TRIGGERS = [
    "Deal Created",
    "Stage Changed",
    "Time-Based",
    "Deal Won",
    "Deal Lost",
    "Deal Updated",
] as const;
const ACTIONS = [
    "Assign Owner",
    "Send Email",
    "Create Task",
    "Send Slack",
    "Notification",
    "Update Field",
] as const;
const TRIGGER_FILTERS = ["All", ...TRIGGERS] as const;
const STATUS_FILTERS = ["All", "Active", "Inactive"] as const;

export default function ProcessAutomationPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [triggerFilterIndex, setTriggerFilterIndex] = useState(0);
    const [statusFilterIndex, setStatusFilterIndex] = useState(0);

    const [automations, setAutomations] = useState<Automation[]>([
        { id: "1", name: "Auto-assign to Rep", trigger: "Deal Created", action: "Assign Owner", conditions: 2, status: "Active", executions: 1204 },
        { id: "2", name: "Stage Progression Alert", trigger: "Stage Changed", action: "Send Email", conditions: 1, status: "Active", executions: 856 },
        { id: "3", name: "Stale Deal Reminder", trigger: "Time-Based", action: "Create Task", conditions: 3, status: "Active", executions: 342 },
        { id: "4", name: "Win Notification", trigger: "Deal Won", action: "Send Slack", conditions: 1, status: "Inactive", executions: 128 },
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);

    const [formName, setFormName] = useState("");
    const [formTrigger, setFormTrigger] = useState<string>(TRIGGERS[0]);
    const [formAction, setFormAction] = useState<string>(ACTIONS[0]);
    const [formConditions, setFormConditions] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState(false);

    const activeTriggerFilter = TRIGGER_FILTERS[triggerFilterIndex];
    const activeStatusFilter = STATUS_FILTERS[statusFilterIndex];

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const name = formName.trim();
        const dup = automations.find(
            (a) =>
                a.name.toLowerCase() === name.toLowerCase() &&
                a.id !== editingAutomation?.id
        );
        if (touched.name) {
            if (!name) e.name = "Automation name is required";
            else if (name.length < 3) e.name = "Name must be at least 3 characters";
            else if (dup) e.name = "An automation with this name exists";
        }
        if (touched.conditions && formConditions !== "") {
            const n = Number(formConditions);
            if (!Number.isInteger(n) || n < 0 || n > 10)
                e.conditions = "Conditions must be between 0 and 10";
        }
        return e;
    }, [formName, formConditions, touched, automations, editingAutomation]);

    const filteredAutomations = useMemo(() => {
        return automations.filter((a) => {
            const q = searchQuery.toLowerCase().trim();
            const matchQ =
                !q ||
                a.name.toLowerCase().includes(q) ||
                a.trigger.toLowerCase().includes(q) ||
                a.action.toLowerCase().includes(q);
            const matchT = activeTriggerFilter === "All" || a.trigger === activeTriggerFilter;
            const matchS = activeStatusFilter === "All" || a.status === activeStatusFilter;
            return matchQ && matchT && matchS;
        });
    }, [automations, searchQuery, activeTriggerFilter, activeStatusFilter]);

    const resetForm = () => {
        setFormName("");
        setFormTrigger(TRIGGERS[0]);
        setFormAction(ACTIONS[0]);
        setFormConditions("");
        setFormDescription("");
        setTouched({});
    };

    const openCreateModal = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const openEditModal = (a: Automation) => {
        setEditingAutomation(a);
        setFormName(a.name);
        setFormTrigger(a.trigger);
        setFormAction(a.action);
        setFormConditions(String(a.conditions));
        setFormDescription(a.description || "");
        setTouched({});
        setShowEditModal(true);
    };

    const validateAll = () => {
        setTouched({ name: true, conditions: true });
        const name = formName.trim();
        const dup = automations.find(
            (a) =>
                a.name.toLowerCase() === name.toLowerCase() &&
                a.id !== editingAutomation?.id
        );
        if (!name) return "Automation name is required";
        if (name.length < 3) return "Name must be at least 3 characters";
        if (dup) return "An automation with this name exists";
        if (formConditions !== "") {
            const n = Number(formConditions);
            if (!Number.isInteger(n) || n < 0 || n > 10)
                return "Conditions must be between 0 and 10";
        }
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
            const automation: Automation = {
                id: String(Date.now()),
                name: formName.trim(),
                trigger: formTrigger,
                action: formAction,
                conditions: formConditions ? Number(formConditions) : 0,
                status: "Active",
                executions: 0,
                description: formDescription.trim() || undefined,
            };
            setAutomations((prev) => [...prev, automation]);
            setShowCreateModal(false);
            resetForm();
            showSuccess(`Automation "${automation.name}" created`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAutomation) return;
        const err = validateAll();
        if (err) {
            showWarning(err);
            return;
        }
        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 300));
            setAutomations((prev) =>
                prev.map((a) =>
                    a.id === editingAutomation.id
                        ? {
                              ...a,
                              name: formName.trim(),
                              trigger: formTrigger,
                              action: formAction,
                              conditions: formConditions ? Number(formConditions) : a.conditions,
                              description: formDescription.trim() || undefined,
                          }
                        : a
                )
            );
            setShowEditModal(false);
            setEditingAutomation(null);
            resetForm();
            showSuccess("Automation updated");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = (id: string) => {
        setAutomations((prev) =>
            prev.map((a) => {
                if (a.id !== id) return a;
                const newStatus = a.status === "Active" ? "Inactive" : "Active";
                showSuccess(`${a.name} ${newStatus === "Active" ? "activated" : "deactivated"}`);
                return { ...a, status: newStatus };
            })
        );
    };

    const deleteAutomation = (id: string) => {
        const a = automations.find((x) => x.id === id);
        if (!a) return;
        const ok = window.confirm(`Delete automation "${a.name}"?`);
        if (!ok) return;
        setAutomations((prev) => prev.filter((x) => x.id !== id));
        showSuccess(`Automation "${a.name}" deleted`);
    };

    const testRun = (id: string) => {
        const a = automations.find((x) => x.id === id);
        if (!a) return;
        setAutomations((prev) =>
            prev.map((x) => (x.id === id ? { ...x, executions: x.executions + 1 } : x))
        );
        showSuccess(`Test run queued for "${a.name}"`);
    };

    const duplicate = (id: string) => {
        const a = automations.find((x) => x.id === id);
        if (!a) return;
        const copy: Automation = {
            ...a,
            id: String(Date.now()),
            name: `${a.name} (Copy)`,
            executions: 0,
            status: "Inactive",
        };
        setAutomations((prev) => [...prev, copy]);
        showSuccess(`Duplicated "${a.name}"`);
    };

    const cycleTriggerFilter = () =>
        setTriggerFilterIndex((p) => (p + 1) % TRIGGER_FILTERS.length);
    const cycleStatusFilter = () =>
        setStatusFilterIndex((p) => (p + 1) % STATUS_FILTERS.length);

    const handleExport = () => {
        const csv = [
            ["Name", "Trigger", "Action", "Conditions", "Status", "Executions"],
            ...automations.map((a) => [a.name, a.trigger, a.action, a.conditions, a.status, a.executions]),
        ]
            .map((row) => row.join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `automations-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showSuccess("Automations exported");
    };

    const summary = [
        {
            label: "Total Automations",
            value: String(automations.length),
            sub: "Configured workflows",
            color: "text-white",
            isHighlight: true,
        },
        {
            label: "Total Executions",
            value: automations.reduce((s, a) => s + a.executions, 0).toLocaleString(),
            sub: "All-time runs",
            color: "text-emerald-600",
            isHighlight: false,
        },
        {
            label: "Success Rate",
            value: "99.2%",
            sub: "Highly reliable",
            color: "text-primary",
            isHighlight: false,
        },
        {
            label: "Time Saved",
            value: "240 hrs",
            sub: "This month",
            color: "text-amber-600",
            isHighlight: false,
        },
    ];

    const renderFormFields = () => (
        <div className="space-y-4">
            <Field label="Automation Name" required error={errors.name} hint="A unique, descriptive label">
                <Input
                    placeholder="e.g. Auto-assign to Rep"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={80}
                />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Trigger" required hint="Event that fires the automation">
                    <Select value={formTrigger} onValueChange={setFormTrigger}>
                        <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                            <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                        <SelectContent>
                            {TRIGGERS.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {t}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field label="Action" required hint="What should happen">
                    <Select value={formAction} onValueChange={setFormAction}>
                        <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                            <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                            {ACTIONS.map((a) => (
                                <SelectItem key={a} value={a}>
                                    {a}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <Field
                label="Conditions"
                error={errors.conditions}
                hint="Number of guard conditions (0–10)"
            >
                <Input
                    type="number"
                    placeholder="e.g. 2"
                    value={formConditions}
                    onChange={(e) => setFormConditions(e.target.value.replace(/[^0-9]/g, ""))}
                    onBlur={() => setTouched((t) => ({ ...t, conditions: true }))}
                    min={0}
                    max={10}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                />
            </Field>

            <Field label="Description" hint="Optional context for team visibility">
                <Textarea
                    placeholder="Describe what this automation does..."
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
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Process Automation</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Automate pipeline workflows, trigger deal actions, and reduce manual work.
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
                            <Plus size={14} /> Create Automation
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
                                placeholder="Search by name, trigger, or action..."
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button
                                variant="outline"
                                className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                                onClick={cycleTriggerFilter}
                            >
                                <Filter size={14} />{" "}
                                {activeTriggerFilter === "All" ? "Filter Trigger" : activeTriggerFilter}
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                                onClick={cycleStatusFilter}
                            >
                                <Clock size={14} /> Status: {activeStatusFilter}
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Automation</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Trigger</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Action</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Conditions</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Executions</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredAutomations.map((auto) => (
                                    <tr
                                        key={auto.id}
                                        className="hover:bg-primary/5 transition-colors group"
                                    >
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900 leading-tight">
                                                    {auto.name}
                                                </span>
                                                {auto.description && (
                                                    <span className="text-[10px] text-gray-500 font-medium mt-0.5 line-clamp-1">
                                                        {auto.description}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="h-1.5 w-1.5 bg-primary rounded-none" />
                                                    <span className="text-[10px] text-primary font-medium">
                                                        Workflow Node
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge className="bg-zinc-900 text-white border-none rounded-none px-2 py-0.5 text-[10px] font-medium">
                                                {auto.trigger}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-none w-fit">
                                                <CheckCircle2 size={12} />
                                                <span className="text-[10px] font-medium">{auto.action}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-xs font-semibold text-gray-900">
                                            {auto.conditions}
                                        </td>
                                        <td className="px-6 py-3 text-xs font-semibold text-gray-900">
                                            {auto.executions.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={auto.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(auto.id)}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                                <div
                                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-none border ${
                                                        auto.status === "Active"
                                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                            : "bg-zinc-50 text-zinc-500 border-zinc-200"
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-medium">{auto.status}</span>
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
                                                        onClick={() => testRun(auto.id)}
                                                    >
                                                        <Play size={14} /> Test Run
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium p-2 rounded-md cursor-pointer flex items-center gap-2"
                                                        onClick={() => openEditModal(auto)}
                                                    >
                                                        <Edit size={14} /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium p-2 rounded-md cursor-pointer"
                                                        onClick={() => duplicate(auto.id)}
                                                    >
                                                        Duplicate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1" />
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium p-2 text-rose-600 rounded-md cursor-pointer flex items-center gap-2"
                                                        onClick={() => deleteAutomation(auto.id)}
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filteredAutomations.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-10 text-center text-xs text-gray-400 font-medium"
                                        >
                                            No automations match the current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
                        <p className="text-[11px] font-medium text-zinc-500">
                            Showing{" "}
                            <span className="text-zinc-900 font-semibold">
                                {filteredAutomations.length}
                            </span>{" "}
                            of{" "}
                            <span className="text-zinc-900 font-semibold">
                                {automations.length} automations
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
                title="Create Automation"
                description="Set up automated workflow actions for your pipeline."
                icon={<Zap className="w-5 h-5" />}
                onSubmit={handleCreate}
                submitLabel="Create Automation"
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
                        setEditingAutomation(null);
                        resetForm();
                    }
                }}
                title="Edit Automation"
                description="Update trigger, action, and conditions."
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
