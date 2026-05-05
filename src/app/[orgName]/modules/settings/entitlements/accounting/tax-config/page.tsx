"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Calculator, Plus, Search, Filter, MoreVertical, Edit, Trash2, Globe, Building2, ChevronRight, Loader2, Info } from "lucide-react";
import { getAllOrgTaxes, getGlobalTaxes, addGlobalTax, enableTax, disableTax } from "@/hooks/taxHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { showSuccess, showError, showWarning } from "@/shared/utils/toast";

export default function TaxConfigPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [taxConfigs, setTaxConfigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");

    const [formName, setFormName] = useState("");
    const [formType, setFormType] = useState("");
    const [formRate, setFormRate] = useState("");
    const [formScope, setFormScope] = useState("");
    const [formRegions, setFormRegions] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const resetForm = () => {
        setFormName("");
        setFormType("");
        setFormRate("");
        setFormScope("");
        setFormRegions("");
        setFormDescription("");
        setTouched({});
    };

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const name = formName.trim();
        const rate = formRate.trim();
        const regions = formRegions.trim();
        const nameRegex = /^[a-zA-Z\s]+$/;

        if (touched.name) {
            if (!name) e.name = "Tax name is required";
            else if (!nameRegex.test(name)) e.name = "Only letters and spaces allowed";
            else if (name.length < 2) e.name = "Name is too short";
        }
        if (touched.type && !formType) e.type = "Tax type is required";
        if (touched.rate) {
            if (!rate) e.rate = "Tax rate is required";
            else {
                const n = parseFloat(rate);
                if (isNaN(n) || n < 0) e.rate = "Rate must be a positive number";
                else if (n > 100) e.rate = "Rate cannot exceed 100%";
            }
        }
        if (touched.scope && !formScope) e.scope = "Scope is required";
        if (touched.regions && formScope !== "global" && !regions) e.regions = "Regions are required for firm scope";
        return e;
    }, [formName, formType, formRate, formScope, formRegions, touched]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [orgRes, globalRes] = await Promise.all([
                getAllOrgTaxes(),
                getGlobalTaxes(),
            ]);
            const orgTaxes = orgRes?.data?.data || orgRes?.data || [];
            const globalTaxes = globalRes?.data?.data || globalRes?.data || [];

            const seen = new Set<string>();
            const merged: any[] = [];
            for (const t of [...globalTaxes, ...orgTaxes]) {
                const id = t._id || t.id;
                if (!seen.has(id)) {
                    seen.add(id);
                    merged.push({
                        id,
                        name: t.name || t.taxName || "Tax",
                        type: t.type || t.taxType || "Tax",
                        rate: t.rate != null ? `${t.rate}%` : (t.taxRate != null ? `${t.taxRate}%` : "0%"),
                        scope: t.isGlobal || t.scope === "Global" ? "Global" : "Firm",
                        regions: t.region || t.regions || "-",
                        status: t.disabled ? "Paused" : (t.isActive === false ? "Paused" : "Active"),
                        _raw: t,
                    });
                }
            }
            setTaxConfigs(merged);
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to load tax configurations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return taxConfigs;
        return taxConfigs.filter((t) =>
            (t.name || "").toLowerCase().includes(q) ||
            (t.type || "").toLowerCase().includes(q) ||
            (t.regions || "").toLowerCase().includes(q)
        );
    }, [taxConfigs, search]);

    const toggleStatus = async (id: string, currentStatus: string) => {
        try {
            setActionLoading(id);
            if (currentStatus === "Active") {
                await disableTax(id);
                showSuccess("Tax disabled successfully");
            } else {
                await enableTax(id);
                showSuccess("Tax enabled successfully");
            }
            fetchData();
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to toggle tax status");
        } finally {
            setActionLoading(null);
        }
    };

    const handleCreateTax = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, type: true, rate: true, scope: true, regions: true });

        const name = formName.trim();
        const rate = parseFloat(formRate);
        const regions = formRegions.trim();
        const fresh: Record<string, string> = {};
        if (!name || !/^[a-zA-Z\s]+$/.test(name)) fresh.name = "Enter a valid name";
        if (!formType) fresh.type = "Required";
        if (isNaN(rate) || rate < 0 || rate > 100) fresh.rate = "Invalid rate";
        if (!formScope) fresh.scope = "Required";
        if (formScope !== "global" && !regions) fresh.regions = "Required";

        if (Object.keys(fresh).length > 0) {
            showWarning("Please fix the errors before submitting");
            return;
        }

        try {
            setSubmitting(true);
            await addGlobalTax({
                name,
                taxName: name,
                type: formType,
                rate,
                region: regions,
                description: formDescription,
            });
            showSuccess("Tax rule created successfully");
            setShowCreateModal(false);
            resetForm();
            fetchData();
        } catch (err: any) {
            showError(err?.response?.data?.message || "Failed to create tax rule");
        } finally {
            setSubmitting(false);
        }
    };

    const deleteConfig = (id: string) => {
        if (!window.confirm("Are you sure you want to delete this tax rule?")) return;
        setTaxConfigs((prev) => prev.filter((t) => t.id !== id));
        showSuccess("Tax rule deleted");
    };

    return (
        <div className="space-y-4 text-[12.5px]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-sm font-semibold tracking-tight">Tax Configuration (Global/Firm)</h1>
                    <p className="text-xs text-slate-500">Manage tax rules and rates for different jurisdictions.</p>
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-xs h-8 gap-2 shadow-sm px-4"
                >
                    <Plus size={16} /> Add Tax Rule
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-primary/70 to-primary p-4 rounded-xl shadow-sm text-white transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-white opacity-80">Total Tax Rules</p>
                    <h2 className="text-xl font-semibold text-white">{taxConfigs.length}</h2>
                    <p className="text-[10px] text-white mt-1 opacity-80">Configured</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Active Rules</p>
                    <h3 className="text-xl font-semibold text-gray-900">{taxConfigs.filter((t) => t.status === "Active").length}</h3>
                    <p className="text-[10px] text-green-600 mt-1">Currently applied</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Global Scope</p>
                    <h3 className="text-xl font-semibold text-gray-900">{taxConfigs.filter((t) => t.scope === "Global").length}</h3>
                    <p className="text-[10px] text-blue-600 mt-1">Organization-wide</p>
                </div>
                <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm transition-all duration-300 hover:-translate-y-1">
                    <p className="text-xs text-slate-500">Firm Scope</p>
                    <h3 className="text-xl font-semibold text-gray-900">{taxConfigs.filter((t) => t.scope === "Firm").length}</h3>
                    <p className="text-[10px] text-purple-600 mt-1">Firm-specific</p>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tax rules..."
                            className="pl-11 rounded-lg border-zinc-200 h-9 text-xs bg-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="rounded-lg border-zinc-200 h-8 text-xs font-medium gap-2 bg-white flex-1 md:flex-none">
                            <Filter size={14} /> Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Tax Name</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Type</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Rate</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Scope</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Regions</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500">Status</th>
                                <th className="px-5 py-3 text-[10px] font-medium text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <div className="flex items-center justify-center gap-2 text-slate-500">
                                            <Loader2 size={18} className="animate-spin" />
                                            <span className="text-xs">Loading tax rules...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center">
                                        <span className="text-xs text-slate-500">No tax rules found.</span>
                                    </td>
                                </tr>
                            ) : filtered.map((config) => (
                                <tr key={config.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-50 text-green-600 rounded-lg border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                                                <Calculator size={16} />
                                            </div>
                                            <span className="text-xs font-medium text-gray-900">{config.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-md text-[10px] font-medium px-2 py-0.5">
                                            {config.type}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs font-medium text-gray-900">{config.rate}</span></td>
                                    <td className="px-5 py-3">
                                        <Badge className={`${config.scope === "Global" ? "bg-indigo-600" : "bg-purple-600"} text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5 flex items-center gap-1 w-fit`}>
                                            {config.scope === "Global" ? <Globe size={10} /> : <Building2 size={10} />} {config.scope}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3"><span className="text-xs text-gray-700">{config.regions}</span></td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={config.status === "Active"}
                                                onCheckedChange={() => toggleStatus(config.id, config.status)}
                                                disabled={actionLoading === config.id}
                                                className="data-[state=checked]:bg-green-600"
                                            />
                                            <Badge className={`${config.status === "Active" ? "bg-green-600" : "bg-zinc-400"} text-white border-none rounded-md text-[10px] font-medium px-2 py-0.5`}>{config.status}</Badge>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-zinc-100">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 shadow-lg p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-[10px] font-medium text-slate-500">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer">
                                                    <Edit size={14} /> Edit Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteConfig(config.id)}
                                                    className="text-xs p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">Showing {filtered.length} tax rules</p>
                    <Button variant="link" className="text-blue-600 text-xs flex items-center gap-1 group">
                        View Tax Reports <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            <SideFormSheet
                open={showCreateModal}
                onOpenChange={(o) => {
                    setShowCreateModal(o);
                    if (!o) resetForm();
                }}
                title="Add Tax Rule"
                description="Configure tax rates for different jurisdictions."
                icon={<Calculator className="w-5 h-5" />}
                onSubmit={handleCreateTax}
                submitLabel="Create Tax Rule"
                loading={submitting}
                width="md"
            >
                <div className="space-y-4">
                    <Field
                        label="Tax Name"
                        required
                        error={errors.name}
                        hint="Descriptive name for the tax rule"
                    >
                        <Input
                            placeholder="e.g., US Sales Tax"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Tax Type"
                            required
                            error={errors.type}
                        >
                            <Select
                                value={formType}
                                onValueChange={(v) => {
                                    setFormType(v);
                                    setTouched((t) => ({ ...t, type: true }));
                                }}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary text-[13px]">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="sales">Sales Tax</SelectItem>
                                    <SelectItem value="vat">VAT</SelectItem>
                                    <SelectItem value="gst">GST</SelectItem>
                                    <SelectItem value="hst">HST</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field
                            label="Tax Rate (%)"
                            required
                            error={errors.rate}
                            hint="0 to 100"
                        >
                            <Input
                                type="number"
                                placeholder="8.5"
                                value={formRate}
                                onChange={(e) => setFormRate(e.target.value)}
                                onBlur={() => setTouched((t) => ({ ...t, rate: true }))}
                                min={0}
                                max={100}
                                step="0.01"
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Scope"
                            required
                            error={errors.scope}
                        >
                            <Select
                                value={formScope}
                                onValueChange={(v) => {
                                    setFormScope(v);
                                    setTouched((t) => ({ ...t, scope: true }));
                                }}
                            >
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary text-[13px]">
                                    <SelectValue placeholder="Select scope" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="global">Global (Organization-wide)</SelectItem>
                                    <SelectItem value="firm">Firm (Specific firm)</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field
                            label="Regions"
                            required={formScope !== "global"}
                            error={errors.regions}
                            hint="Comma-separated (e.g., US, EU)"
                        >
                            <Input
                                placeholder="US, EU"
                                value={formRegions}
                                onChange={(e) => setFormRegions(e.target.value)}
                                onBlur={() => setTouched((t) => ({ ...t, regions: true }))}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                    </div>

                    <Field
                        label="Description"
                        hint="Optional additional details"
                    >
                        <Textarea
                            placeholder="Additional details about this tax rule..."
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            className="min-h-[80px] rounded-lg border-[#E5E7EB] bg-white focus:border-primary text-[13px]"
                        />
                    </Field>

                    <div className="flex items-start gap-2 p-3 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-[#475569] leading-relaxed">
                            Global rules apply to every firm in the organization. Firm rules override global rules for matching regions.
                        </p>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
