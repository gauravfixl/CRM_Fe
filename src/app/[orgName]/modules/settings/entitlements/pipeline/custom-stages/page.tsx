"use client";

import React, { useState, useMemo } from "react";
import {
    Layers,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    GripVertical,
    ChevronRight,
    Download,
    Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { showSuccess, showWarning } from "@/shared/utils/toast";

type Stage = {
    id: string;
    name: string;
    pipeline: string;
    order: number;
    probability: number;
    duration: string;
    status: "Active" | "Inactive";
    deals: number;
    description?: string;
};

const PIPELINES = ["Sales Pipeline", "Support Pipeline", "Onboarding Pipeline"] as const;
const PIPELINE_FILTERS = ["All", ...PIPELINES] as const;
const STATUS_FILTERS = ["All", "Active", "Inactive"] as const;

export default function CustomStagesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [pipelineFilterIndex, setPipelineFilterIndex] = useState(0);
    const [statusFilterIndex, setStatusFilterIndex] = useState(0);

    const [stages, setStages] = useState<Stage[]>([
        { id: "1", name: "Qualification", pipeline: "Sales Pipeline", order: 1, probability: 20, duration: "3 days", status: "Active", deals: 45 },
        { id: "2", name: "Proposal", pipeline: "Sales Pipeline", order: 2, probability: 50, duration: "7 days", status: "Active", deals: 28 },
        { id: "3", name: "Negotiation", pipeline: "Sales Pipeline", order: 3, probability: 75, duration: "5 days", status: "Active", deals: 18 },
        { id: "4", name: "Closed Won", pipeline: "Sales Pipeline", order: 4, probability: 100, duration: "1 day", status: "Active", deals: 156 },
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStage, setEditingStage] = useState<Stage | null>(null);

    const [formName, setFormName] = useState("");
    const [formPipeline, setFormPipeline] = useState<string>(PIPELINES[0]);
    const [formProbability, setFormProbability] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState(false);

    const activePipelineFilter = PIPELINE_FILTERS[pipelineFilterIndex];
    const activeStatusFilter = STATUS_FILTERS[statusFilterIndex];

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const name = formName.trim();
        const dup = stages.find(
            (s) =>
                s.name.toLowerCase() === name.toLowerCase() &&
                s.pipeline === formPipeline &&
                s.id !== editingStage?.id
        );
        if (touched.name) {
            if (!name) e.name = "Stage name is required";
            else if (name.length < 2) e.name = "Name must be at least 2 characters";
            else if (name.length > 60) e.name = "Name is too long";
            else if (dup) e.name = "Stage already exists in this pipeline";
        }
        if (touched.probability) {
            const p = Number(formProbability);
            if (formProbability === "") e.probability = "Probability is required";
            else if (!Number.isFinite(p)) e.probability = "Must be a number";
            else if (p < 0 || p > 100) e.probability = "Must be between 0 and 100";
        }
        return e;
    }, [formName, formProbability, formPipeline, touched, stages, editingStage]);

    const filteredStages = useMemo(() => {
        return stages.filter((s) => {
            const q = searchQuery.toLowerCase().trim();
            const matchQ =
                !q || s.name.toLowerCase().includes(q) || s.pipeline.toLowerCase().includes(q);
            const matchP = activePipelineFilter === "All" || s.pipeline === activePipelineFilter;
            const matchS = activeStatusFilter === "All" || s.status === activeStatusFilter;
            return matchQ && matchP && matchS;
        });
    }, [stages, searchQuery, activePipelineFilter, activeStatusFilter]);

    const avgDuration = useMemo(() => {
        const nums = stages
            .map((s) => parseInt(s.duration))
            .filter((n) => !Number.isNaN(n));
        if (!nums.length) return "—";
        return `${Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)} days`;
    }, [stages]);

    const resetForm = () => {
        setFormName("");
        setFormPipeline(PIPELINES[0]);
        setFormProbability("");
        setFormDescription("");
        setTouched({});
    };

    const openCreateModal = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const openEditModal = (s: Stage) => {
        setEditingStage(s);
        setFormName(s.name);
        setFormPipeline(s.pipeline);
        setFormProbability(String(s.probability));
        setFormDescription(s.description || "");
        setTouched({});
        setShowEditModal(true);
    };

    const validateAll = () => {
        setTouched({ name: true, probability: true });
        const name = formName.trim();
        const p = Number(formProbability);
        const dup = stages.find(
            (s) =>
                s.name.toLowerCase() === name.toLowerCase() &&
                s.pipeline === formPipeline &&
                s.id !== editingStage?.id
        );
        if (!name) return "Stage name is required";
        if (name.length < 2) return "Name must be at least 2 characters";
        if (dup) return "Stage already exists in this pipeline";
        if (formProbability === "") return "Probability is required";
        if (!Number.isFinite(p) || p < 0 || p > 100) return "Probability must be between 0 and 100";
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
            const newStage: Stage = {
                id: String(Date.now()),
                name: formName.trim(),
                pipeline: formPipeline,
                order: stages.filter((s) => s.pipeline === formPipeline).length + 1,
                probability: Number(formProbability),
                duration: "—",
                status: "Active",
                deals: 0,
                description: formDescription.trim() || undefined,
            };
            setStages((prev) => [...prev, newStage]);
            setShowCreateModal(false);
            resetForm();
            showSuccess(`Stage "${newStage.name}" created`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingStage) return;
        const err = validateAll();
        if (err) {
            showWarning(err);
            return;
        }
        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 300));
            setStages((prev) =>
                prev.map((s) =>
                    s.id === editingStage.id
                        ? {
                              ...s,
                              name: formName.trim(),
                              pipeline: formPipeline,
                              probability: Number(formProbability),
                              description: formDescription.trim() || undefined,
                          }
                        : s
                )
            );
            setShowEditModal(false);
            setEditingStage(null);
            resetForm();
            showSuccess("Stage updated");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleStatus = (id: string) => {
        setStages((prev) =>
            prev.map((s) => {
                if (s.id !== id) return s;
                const newStatus = s.status === "Active" ? "Inactive" : "Active";
                showSuccess(`${s.name} ${newStatus === "Active" ? "activated" : "deactivated"}`);
                return { ...s, status: newStatus };
            })
        );
    };

    const deleteStage = (id: string) => {
        const s = stages.find((x) => x.id === id);
        if (!s) return;
        const ok = window.confirm(`Delete stage "${s.name}"? This cannot be undone.`);
        if (!ok) return;
        setStages((prev) => prev.filter((x) => x.id !== id));
        showSuccess(`Stage "${s.name}" deleted`);
    };

    const moveStage = (id: string, dir: "up" | "down") => {
        setStages((prev) => {
            const list = [...prev];
            const i = list.findIndex((s) => s.id === id);
            if (i < 0) return prev;
            const j = dir === "up" ? i - 1 : i + 1;
            if (j < 0 || j >= list.length) return prev;
            [list[i], list[j]] = [list[j], list[i]];
            return list.map((s, idx) => ({ ...s, order: idx + 1 }));
        });
    };

    const cyclePipelineFilter = () =>
        setPipelineFilterIndex((p) => (p + 1) % PIPELINE_FILTERS.length);
    const cycleStatusFilter = () =>
        setStatusFilterIndex((p) => (p + 1) % STATUS_FILTERS.length);

    const handleExport = () => {
        const csv = [
            ["Order", "Stage", "Pipeline", "Probability", "Duration", "Status", "Active Deals"],
            ...stages.map((s) => [
                s.order,
                s.name,
                s.pipeline,
                `${s.probability}%`,
                s.duration,
                s.status,
                s.deals,
            ]),
        ]
            .map((r) => r.join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pipeline-stages-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showSuccess("Stages exported");
    };

    const summary = [
        {
            label: "Total Stages",
            value: String(stages.length),
            sub: "Configured across pipelines",
            color: "text-white",
            isHighlight: true,
        },
        {
            label: "Active Stages",
            value: String(stages.filter((s) => s.status === "Active").length),
            sub: "Currently in use",
            color: "text-emerald-600",
            isHighlight: false,
        },
        {
            label: "Total Active Deals",
            value: String(stages.reduce((sum, s) => sum + s.deals, 0)),
            sub: "Across all stages",
            color: "text-primary",
            isHighlight: false,
        },
        {
            label: "Avg. Duration",
            value: avgDuration,
            sub: "Per stage",
            color: "text-amber-600",
            isHighlight: false,
        },
    ];

    const renderFormFields = () => (
        <div className="space-y-4">
            <Field label="Stage Name" required error={errors.name} hint="Use a short, descriptive label">
                <Input
                    placeholder="e.g. Qualification"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    maxLength={60}
                />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Pipeline" required hint="Which pipeline this stage belongs to">
                    <Select value={formPipeline} onValueChange={setFormPipeline}>
                        <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                            <SelectValue placeholder="Select pipeline" />
                        </SelectTrigger>
                        <SelectContent>
                            {PIPELINES.map((p) => (
                                <SelectItem key={p} value={p}>
                                    {p}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                <Field
                    label="Probability (%)"
                    required
                    error={errors.probability}
                    hint="Win probability 0–100"
                >
                    <Input
                        type="number"
                        placeholder="e.g. 50"
                        value={formProbability}
                        onChange={(e) => setFormProbability(e.target.value.replace(/[^0-9]/g, ""))}
                        onBlur={() => setTouched((t) => ({ ...t, probability: true }))}
                        min={0}
                        max={100}
                        className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                    />
                </Field>
            </div>

            <Field label="Description" hint="Optional context for the team">
                <Textarea
                    placeholder="Describe what happens in this stage..."
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
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Custom Pipeline Stages</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Configure and manage stages across all institutional pipelines.
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
                            <Plus size={14} /> Create Stage
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
                                placeholder="Search stages by name or pipeline..."
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button
                                variant="outline"
                                className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                                onClick={cyclePipelineFilter}
                            >
                                <Filter size={14} />{" "}
                                {activePipelineFilter === "All" ? "Filter Pipeline" : activePipelineFilter}
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                                onClick={cycleStatusFilter}
                            >
                                <Activity size={14} /> Status: {activeStatusFilter}
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Order</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Stage</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Pipeline</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Probability</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Duration</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Active Deals</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Status</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredStages.map((stage) => (
                                    <tr
                                        key={stage.id}
                                        className="hover:bg-primary/5 transition-colors group"
                                    >
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    title="Reorder"
                                                    className="text-zinc-300 hover:text-zinc-500 cursor-grab"
                                                    onClick={() => moveStage(stage.id, "up")}
                                                >
                                                    <GripVertical size={14} />
                                                </button>
                                                <Badge className="bg-zinc-900 text-white border-none rounded-none px-2 py-0.5 text-[10px] font-medium">
                                                    {stage.order}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-900 leading-tight">
                                                    {stage.name}
                                                </span>
                                                {stage.description && (
                                                    <span className="text-[10px] text-gray-500 font-medium mt-0.5 line-clamp-1">
                                                        {stage.description}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="h-1.5 w-1.5 bg-primary rounded-none" />
                                                    <span className="text-[10px] text-primary font-medium">
                                                        Lifecycle Node
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge className="bg-zinc-900 text-white border-none rounded-none px-2 py-0.5 text-[10px] font-medium">
                                                {stage.pipeline}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-zinc-100 rounded-none overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${stage.probability}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold text-gray-900">
                                                    {stage.probability}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-xs text-gray-600 font-medium">
                                            {stage.duration}
                                        </td>
                                        <td className="px-6 py-3 text-xs font-semibold text-gray-900">
                                            {stage.deals}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={stage.status === "Active"}
                                                    onCheckedChange={() => toggleStatus(stage.id)}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                                <div
                                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-none border ${
                                                        stage.status === "Active"
                                                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                            : "bg-zinc-50 text-zinc-500 border-zinc-200"
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-medium">{stage.status}</span>
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
                                                        onClick={() => openEditModal(stage)}
                                                    >
                                                        <Edit size={14} /> Edit Stage
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium p-2 rounded-md cursor-pointer"
                                                        onClick={() => moveStage(stage.id, "up")}
                                                    >
                                                        Move Up
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium p-2 rounded-md cursor-pointer"
                                                        onClick={() => moveStage(stage.id, "down")}
                                                    >
                                                        Move Down
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1" />
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium p-2 text-rose-600 rounded-md cursor-pointer flex items-center gap-2"
                                                        onClick={() => deleteStage(stage.id)}
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStages.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-6 py-10 text-center text-xs text-gray-400 font-medium"
                                        >
                                            No stages match the current filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                        <p className="text-[11px] font-medium text-zinc-500">
                            Showing{" "}
                            <span className="text-zinc-900 font-semibold">{filteredStages.length}</span>{" "}
                            of{" "}
                            <span className="text-zinc-900 font-semibold">{stages.length} stages</span>
                        </p>
                        <Button
                            variant="link"
                            className="text-primary text-xs flex items-center gap-1 group font-medium p-0 h-auto"
                            onClick={() => showSuccess("Pipeline analytics coming soon")}
                        >
                            View Pipeline Analytics{" "}
                            <ChevronRight
                                size={14}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </Button>
                    </div>
                </div>
            </div>

            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) resetForm();
                }}
                title="Create Pipeline Stage"
                description="Add a new stage to your institutional pipeline."
                icon={<Layers className="w-5 h-5" />}
                onSubmit={handleCreate}
                submitLabel="Create Stage"
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
                        setEditingStage(null);
                        resetForm();
                    }
                }}
                title="Edit Pipeline Stage"
                description="Update configuration for this stage."
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
