"use client";

import React, { useState, useMemo } from "react";
import {
    Percent,
    Plus,
    Search,
    Edit,
    Trash2,
    TrendingUp,
    Target,
    BarChart3,
    Filter,
    MoreVertical,
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
    stage: string;
    probability: number;
    autoAdjust: boolean;
    basedOn: string;
    status: "Active" | "Inactive";
    deals: number;
    notes?: string;
};

const STAGES = ["Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"] as const;
const BASES = ["Stage Entry", "Activity Level", "Manual", "Fixed", "AI Forecast"] as const;
const BASIS_FILTERS = ["All", ...BASES] as const;
const STATUS_FILTERS = ["All", "Active", "Inactive"] as const;

export default function ProbabilityRulesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [basisFilterIndex, setBasisFilterIndex] = useState(0);
    const [statusFilterIndex, setStatusFilterIndex] = useState(0);

    const [rules, setRules] = useState<Rule[]>([
        { id: "1", stage: "Qualification", probability: 20, autoAdjust: true, basedOn: "Stage Entry", status: "Active", deals: 45 },
        { id: "2", stage: "Proposal", probability: 50, autoAdjust: true, basedOn: "Activity Level", status: "Active", deals: 28 },
        { id: "3", stage: "Negotiation", probability: 75, autoAdjust: false, basedOn: "Manual", status: "Active", deals: 18 },
        { id: "4", stage: "Closed Won", probability: 100, autoAdjust: false, basedOn: "Fixed", status: "Active", deals: 156 },
    ]);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingRule, setEditingRule] = useState<Rule | null>(null);

    const [formStage, setFormStage] = useState<string>(STAGES[0]);
    const [formProbability, setFormProbability] = useState("");
    const [formBasedOn, setFormBasedOn] = useState<string>(BASES[0]);
    const [formAutoAdjust, setFormAutoAdjust] = useState(false);
    const [formNotes, setFormNotes] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState(false);

    const activeBasisFilter = BASIS_FILTERS[basisFilterIndex];
    const activeStatusFilter = STATUS_FILTERS[statusFilterIndex];

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const dup = rules.find(
            (r) => r.stage === formStage && r.id !== editingRule?.id
        );
        if (touched.stage && dup) e.stage = "A rule for this stage already exists";
        if (touched.probability) {
            const p = Number(formProbability);
            if (formProbability === "") e.probability = "Probability is required";
            else if (!Number.isFinite(p)) e.probability = "Must be a number";
            else if (p < 0 || p > 100) e.probability = "Must be between 0 and 100";
        }
        return e;
    }, [formStage, formProbability, touched, rules, editingRule]);

    const filteredRules = useMemo(() => {
        return rules.filter((r) => {
            const q = searchQuery.toLowerCase().trim();
            const matchQ =
                !q ||
                r.stage.toLowerCase().includes(q) ||
                r.basedOn.toLowerCase().includes(q);
            const matchB = activeBasisFilter === "All" || r.basedOn === activeBasisFilter;
            const matchS = activeStatusFilter === "All" || r.status === activeStatusFilter;
            return matchQ && matchB && matchS;
        });
    }, [rules, searchQuery, activeBasisFilter, activeStatusFilter]);

    const avgProb = useMemo(() => {
        if (!rules.length) return "—";
        const sum = rules.reduce((a, r) => a + r.probability, 0);
        return `${Math.round(sum / rules.length)}%`;
    }, [rules]);

    const resetForm = () => {
        setFormStage(STAGES[0]);
        setFormProbability("");
        setFormBasedOn(BASES[0]);
        setFormAutoAdjust(false);
        setFormNotes("");
        setTouched({});
    };

    const openCreateModal = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const openEditModal = (r: Rule) => {
        setEditingRule(r);
        setFormStage(r.stage);
        setFormProbability(String(r.probability));
        setFormBasedOn(r.basedOn);
        setFormAutoAdjust(r.autoAdjust);
        setFormNotes(r.notes || "");
        setTouched({});
        setShowEditModal(true);
    };

    const validateAll = () => {
        setTouched({ stage: true, probability: true });
        const p = Number(formProbability);
        const dup = rules.find(
            (r) => r.stage === formStage && r.id !== editingRule?.id
        );
        if (dup) return "A rule for this stage already exists";
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
            const rule: Rule = {
                id: String(Date.now()),
                stage: formStage,
                probability: Number(formProbability),
                autoAdjust: formAutoAdjust,
                basedOn: formBasedOn,
                status: "Active",
                deals: 0,
                notes: formNotes.trim() || undefined,
            };
            setRules((prev) => [...prev, rule]);
            setShowCreateModal(false);
            resetForm();
            showSuccess(`Rule created for ${rule.stage}`);
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
                              stage: formStage,
                              probability: Number(formProbability),
                              basedOn: formBasedOn,
                              autoAdjust: formAutoAdjust,
                              notes: formNotes.trim() || undefined,
                          }
                        : r
                )
            );
            setShowEditModal(false);
            setEditingRule(null);
            resetForm();
            showSuccess("Rule updated");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleAutoAdjust = (id: string) => {
        setRules((prev) =>
            prev.map((r) => {
                if (r.id !== id) return r;
                const next = !r.autoAdjust;
                showSuccess(`Auto-adjust ${next ? "enabled" : "disabled"} for ${r.stage}`);
                return { ...r, autoAdjust: next };
            })
        );
    };

    const toggleStatus = (id: string) => {
        setRules((prev) =>
            prev.map((r) => {
                if (r.id !== id) return r;
                const newStatus = r.status === "Active" ? "Inactive" : "Active";
                showSuccess(`${r.stage} rule ${newStatus === "Active" ? "activated" : "deactivated"}`);
                return { ...r, status: newStatus };
            })
        );
    };

    const deleteRule = (id: string) => {
        const r = rules.find((x) => x.id === id);
        if (!r) return;
        const ok = window.confirm(`Delete probability rule for "${r.stage}"?`);
        if (!ok) return;
        setRules((prev) => prev.filter((x) => x.id !== id));
        showSuccess(`Rule for ${r.stage} deleted`);
    };

    const cycleBasisFilter = () =>
        setBasisFilterIndex((p) => (p + 1) % BASIS_FILTERS.length);
    const cycleStatusFilter = () =>
        setStatusFilterIndex((p) => (p + 1) % STATUS_FILTERS.length);

    const handleExport = () => {
        const csv = [
            ["Stage", "Probability", "Based On", "Auto Adjust", "Status", "Deals"],
            ...rules.map((r) => [
                r.stage,
                `${r.probability}%`,
                r.basedOn,
                r.autoAdjust ? "Yes" : "No",
                r.status,
                r.deals,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `probability-rules-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showSuccess("Rules exported");
    };

    const summary = [
        {
            label: "Total Rules",
            value: String(rules.length),
            sub: "Probability configurations",
            color: "text-white",
            isHighlight: true,
        },
        {
            label: "Auto-Adjust Enabled",
            value: String(rules.filter((r) => r.autoAdjust).length),
            sub: "Dynamic recalculation",
            color: "text-emerald-600",
            isHighlight: false,
        },
        {
            label: "Avg. Probability",
            value: avgProb,
            sub: "Across pipeline",
            color: "text-primary",
            isHighlight: false,
        },
        {
            label: "Forecast Accuracy",
            value: "94%",
            sub: "Last quarter",
            color: "text-amber-600",
            isHighlight: false,
        },
    ];

    const renderFormFields = () => (
        <div className="space-y-4">
            <Field label="Pipeline Stage" required error={errors.stage} hint="Each stage can have one rule">
                <Select value={formStage} onValueChange={setFormStage}>
                    <SelectTrigger
                        className="h-11 rounded-lg border-[#E5E7EB] bg-white"
                        onBlur={() => setTouched((t) => ({ ...t, stage: true }))}
                    >
                        <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                        {STAGES.map((s) => (
                            <SelectItem key={s} value={s}>
                                {s}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                    label="Probability (%)"
                    required
                    error={errors.probability}
                    hint="Win chance 0–100"
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

                <Field label="Based On" required hint="Calculation basis">
                    <Select value={formBasedOn} onValueChange={setFormBasedOn}>
                        <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                            <SelectValue placeholder="Select basis" />
                        </SelectTrigger>
                        <SelectContent>
                            {BASES.map((b) => (
                                <SelectItem key={b} value={b}>
                                    {b}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-[#E5E7EB] bg-[#FAFBFC]">
                <div>
                    <p className="text-[13px] font-semibold text-[#374151]">Auto-Adjust</p>
                    <p className="text-[11.5px] text-[#9CA3AF] mt-0.5">
                        Continuously update probability based on deal activity.
                    </p>
                </div>
                <Switch
                    checked={formAutoAdjust}
                    onCheckedChange={setFormAutoAdjust}
                    className="data-[state=checked]:bg-primary"
                />
            </div>

            <Field label="Notes" hint="Optional rationale for this rule">
                <Textarea
                    placeholder="e.g. Base rate from historical conversion data..."
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
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Probability Rules</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Configure win probability calculations and forecast engines per stage.
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
                                placeholder="Search by stage or calculation basis..."
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button
                                variant="outline"
                                className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                                onClick={cycleBasisFilter}
                            >
                                <Filter size={14} />{" "}
                                {activeBasisFilter === "All" ? "Filter Basis" : activeBasisFilter}
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-none border-zinc-200 text-xs h-9 gap-2 flex-1 md:flex-none font-medium bg-white"
                                onClick={cycleStatusFilter}
                            >
                                <BarChart3 size={14} /> Status: {activeStatusFilter}
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Stage</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Probability</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Based On</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Auto Adjust</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Active Deals</th>
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
                                                    {rule.stage}
                                                </span>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <span className="h-1.5 w-1.5 bg-primary rounded-none" />
                                                    <span className="text-[10px] text-primary font-medium">
                                                        Probability Node
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-zinc-100 rounded-none overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary"
                                                        style={{ width: `${rule.probability}%` }}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp size={12} className="text-emerald-600" />
                                                    <span className="text-xs font-semibold text-gray-900">
                                                        {rule.probability}%
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge className="bg-zinc-900 text-white border-none rounded-none px-2 py-0.5 text-[10px] font-medium">
                                                {rule.basedOn}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={rule.autoAdjust}
                                                    onCheckedChange={() => toggleAutoAdjust(rule.id)}
                                                    className="data-[state=checked]:bg-primary"
                                                />
                                                <span
                                                    className={`text-[10px] font-medium ${
                                                        rule.autoAdjust ? "text-emerald-600" : "text-zinc-400"
                                                    }`}
                                                >
                                                    {rule.autoAdjust ? "Enabled" : "Disabled"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-xs font-semibold text-gray-900">
                                            {rule.deals}
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
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium p-2 rounded-md cursor-pointer"
                                                        onClick={() => toggleAutoAdjust(rule.id)}
                                                    >
                                                        {rule.autoAdjust ? "Disable Auto-Adjust" : "Enable Auto-Adjust"}
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
                                            No probability rules match the current filters.
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
                title="Create Probability Rule"
                description="Define a win probability for a pipeline stage."
                icon={<Percent className="w-5 h-5" />}
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
                title="Edit Probability Rule"
                description="Update configuration for this rule."
                icon={<Target className="w-5 h-5" />}
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
