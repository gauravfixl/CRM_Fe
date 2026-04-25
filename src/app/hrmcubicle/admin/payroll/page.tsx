"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    Banknote,
    Plus,
    Calendar,
    ShieldCheck,
    Coins,
    Trash2,
    Edit2,
    AlertCircle,
    Search,
    Save
} from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePayrollStore, type SalaryComponent } from "@/shared/data/payroll-store";
import { salaryComponentsApi, statutorySettingsApi, extractApiError } from "@/shared/api/settings-api";
import { validateSalaryComponent, validateStatutorySettings, type ValidationErrors } from "@/shared/api/settings-validators";

const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-[11px] text-rose-600 font-medium mt-1">{msg}</p> : null;
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/shared/components/ui/alert-dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Switch } from "@/shared/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

const PayrollSettingsPage = () => {
    const { salaryComponents, statutorySettings, addComponent: addSalaryComponent, updateComponent: updateSalaryComponent, deleteComponent: deleteSalaryComponent, updateStatutorySettings } = usePayrollStore();
    const { toast } = useToast();

    // Dialog States
    const [componentDialogOpen, setComponentDialogOpen] = useState(false);
    const [currentComponent, setCurrentComponent] = useState<Partial<SalaryComponent>>({});

    // Search + Delete confirmation
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

    // Pay Schedule (local controlled state)
    const [paySchedule, setPaySchedule] = useState<{ frequency: "Monthly" | "Bi-weekly" | "Weekly"; payDay: number; cutoffDay: number }>({
        frequency: "Monthly",
        payDay: 5,
        cutoffDay: 25,
    });

    // Validation + backend id map
    const [formErrors, setFormErrors] = useState<ValidationErrors>({});
    const [statutoryErrors, setStatutoryErrors] = useState<ValidationErrors>({});
    const [componentBackendIds, setComponentBackendIds] = useState<Record<string, string>>({});

    // Hydrate from backend on mount
    useEffect(() => {
        let cancel = false;
        (async () => {
            const [comps, settings] = await Promise.allSettled([
                salaryComponentsApi.list(),
                statutorySettingsApi.get(),
            ]);
            if (cancel) return;
            if (comps.status === "fulfilled" && Array.isArray(comps.value?.data)) {
                const bMap: Record<string, string> = {};
                const items: SalaryComponent[] = comps.value.data.map((c: any) => {
                    const fid = `comp-${c._id}`;
                    bMap[fid] = c._id;
                    return {
                        id: fid,
                        name: c.name,
                        type: c.type,
                        amountType: c.amountType,
                        value: c.value,
                        isTaxable: c.isTaxable,
                        isStatutory: c.isStatutory,
                    } as SalaryComponent;
                });
                if (items.length) usePayrollStore.setState({ salaryComponents: items });
                setComponentBackendIds(bMap);
            }
            if (settings.status === "fulfilled" && settings.value?.data) {
                const s = settings.value.data;
                usePayrollStore.setState({
                    statutorySettings: {
                        pfEnabled: s.pfEnabled, pfRate: s.pfRate,
                        esiEnabled: s.esiEnabled, esiRate: s.esiRate,
                        tdsEnabled: s.tdsEnabled,
                    } as any
                });
                setPaySchedule({
                    frequency: s.payFrequency,
                    payDay: s.payDay,
                    cutoffDay: s.cutoffDay,
                });
            }
        })();
        return () => { cancel = true; };
    }, []);

    const filteredEarnings = salaryComponents.filter(c =>
        c.type === 'Earning' && c.name.toLowerCase().includes(search.toLowerCase())
    );
    const filteredDeductions = salaryComponents.filter(c =>
        c.type === 'Deduction' && c.name.toLowerCase().includes(search.toLowerCase())
    );

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        const bid = componentBackendIds[deleteTarget.id];
        deleteSalaryComponent(deleteTarget.id);
        toast({ title: "Component Removed", description: `${deleteTarget.name} removed from salary structure.`, variant: "destructive" });
        if (bid) {
            try { await salaryComponentsApi.remove(bid); } catch (e) {
                toast({ title: "Backend Sync Failed", description: extractApiError(e), variant: "destructive" });
            }
        }
        setDeleteTarget(null);
    };

    const savePaySchedule = async () => {
        const errs = validateStatutorySettings(paySchedule);
        setStatutoryErrors(errs);
        if (Object.keys(errs).length > 0) {
            toast({ title: "Please fix pay schedule values", variant: "destructive" });
            return;
        }
        try {
            await statutorySettingsApi.update({
                payFrequency: paySchedule.frequency,
                payDay: paySchedule.payDay,
                cutoffDay: paySchedule.cutoffDay,
            });
            toast({ title: "Pay Schedule Saved", description: `${paySchedule.frequency} pay on day ${paySchedule.payDay}, cutoff day ${paySchedule.cutoffDay}.` });
        } catch (e) {
            toast({ title: "Saved Locally", description: extractApiError(e, "Backend unreachable."), variant: "destructive" });
        }
    };

    const handleStatutoryChange = async (updates: Record<string, any>) => {
        updateStatutorySettings(updates);
        try {
            await statutorySettingsApi.update(updates);
        } catch { /* non-fatal */ }
    };

    const handleEditComponent = (comp: SalaryComponent) => {
        setCurrentComponent(comp);
        setComponentDialogOpen(true);
    };

    const handleNewComponent = () => {
        setCurrentComponent({ name: "", type: "Earning", amountType: "Fixed", value: 0, isTaxable: true, isStatutory: false });
        setComponentDialogOpen(true);
    };

    const saveComponent = async () => {
        const errs = validateSalaryComponent(currentComponent);
        setFormErrors(errs);
        if (Object.keys(errs).length > 0) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" });
            return;
        }

        const payload = {
            name: currentComponent.name!.trim(),
            type: currentComponent.type!,
            amountType: currentComponent.amountType || "Fixed",
            value: Number(currentComponent.value),
            isTaxable: currentComponent.isTaxable !== false,
            isStatutory: !!currentComponent.isStatutory,
        };

        try {
            if (currentComponent.id) {
                const bid = componentBackendIds[currentComponent.id];
                if (bid) await salaryComponentsApi.update(bid, payload);
                updateSalaryComponent(currentComponent.id, currentComponent);
                toast({ title: "Component Updated", description: "Saved to backend." });
            } else {
                const res = await salaryComponentsApi.create(payload);
                const fid = res.data?._id ? `comp-${res.data._id}` : `comp-${Date.now()}`;
                if (res.data?._id) setComponentBackendIds(prev => ({ ...prev, [fid]: res.data._id }));
                usePayrollStore.setState((st) => ({
                    salaryComponents: [...st.salaryComponents, { ...(currentComponent as SalaryComponent), id: fid }]
                }));
                toast({ title: "Component Created", description: "Saved to backend." });
            }
        } catch (e) {
            if (currentComponent.id) {
                updateSalaryComponent(currentComponent.id, currentComponent);
            } else {
                addSalaryComponent(currentComponent as SalaryComponent);
            }
            toast({ title: "Saved Locally", description: extractApiError(e, "Backend unreachable."), variant: "destructive" });
        }

        setComponentDialogOpen(false);
        setCurrentComponent({});
        setFormErrors({});
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] overflow-hidden">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                        <Banknote size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payroll Configuration</h1>
                        <p className="text-sm font-medium text-slate-500">Manage salary components, statutory compliance, and pay cycles.</p>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* Left Column: Salary Structure */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Coins className="text-emerald-500" /> Salary Components
                            </h2>
                            <Button onClick={handleNewComponent} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-100">
                                <Plus size={18} className="mr-2" /> Add Component
                            </Button>
                        </div>

                        <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search salary components..."
                                    className="pl-9 bg-slate-50 border-slate-200"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="text-xs font-semibold text-slate-500">
                                {filteredEarnings.length + filteredDeductions.length} of {salaryComponents.length}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Earnings */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Earnings ({filteredEarnings.length})</h3>
                                {filteredEarnings.length === 0 && (
                                    <div className="text-center text-sm text-slate-400 italic p-4 bg-white rounded-xl border border-dashed border-slate-200">No earnings match your search.</div>
                                )}
                                {filteredEarnings.map(comp => (
                                    <div key={comp.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-all hover:border-emerald-200">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-bold">
                                                {comp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{comp.name}</h4>
                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                    <Badge variant="outline" className="bg-slate-50">{comp.amountType}</Badge>
                                                    {comp.isTaxable && <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-100">Taxable</Badge>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-slate-700">
                                                    {comp.amountType === 'Fixed' ? `₹${comp.value.toLocaleString()}` : `${comp.value}%`}
                                                </p>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Default Value</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => handleEditComponent(comp)}>
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => setDeleteTarget({ id: comp.id, name: comp.name })}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Deductions */}
                            <div className="space-y-4 mt-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Deductions ({filteredDeductions.length})</h3>
                                {filteredDeductions.length === 0 && (
                                    <div className="text-center text-sm text-slate-400 italic p-4 bg-white rounded-xl border border-dashed border-slate-200">No deductions match your search.</div>
                                )}
                                {filteredDeductions.map(comp => (
                                    <div key={comp.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-all hover:border-rose-200">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 font-bold">
                                                {comp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{comp.name}</h4>
                                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                    <Badge variant="outline" className="bg-slate-50">{comp.amountType}</Badge>
                                                    {comp.isStatutory && <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-100">Statutory</Badge>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-slate-700">
                                                    {comp.amountType === 'Fixed' ? `₹${comp.value.toLocaleString()}` : `${comp.value}%`}
                                                </p>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Deduction</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => handleEditComponent(comp)}>
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => setDeleteTarget({ id: comp.id, name: comp.name })}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Compliance & Settings */}
                    <div className="space-y-6">

                        {/* Statutory Settings */}
                        <Card className="rounded-2xl border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <ShieldCheck className="text-purple-600" /> Statutory Compliance
                                </CardTitle>
                                <CardDescription>Configure PF, ESI, and TDS rules.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* PF */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">PF</div>
                                            <Label className="font-bold text-slate-700">Provident Fund</Label>
                                        </div>
                                        <Switch checked={statutorySettings.pfEnabled} onCheckedChange={(val) => handleStatutoryChange({ pfEnabled: val })} />
                                    </div>
                                    {statutorySettings.pfEnabled && (
                                        <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between" >
                                            <span className="text-xs font-medium text-slate-500">Employer Contribution</span>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    className="w-16 h-8 text-right font-bold bg-white"
                                                    value={statutorySettings.pfRate}
                                                    onChange={(e) => handleStatutoryChange({ pfRate: parseFloat(e.target.value) })}
                                                />
                                                <span className="text-sm font-bold text-slate-400">%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Separator />
                                {/* ESI */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-xs">ESI</div>
                                            <Label className="font-bold text-slate-700">ESI</Label>
                                        </div>
                                        <Switch checked={statutorySettings.esiEnabled} onCheckedChange={(val) => handleStatutoryChange({ esiEnabled: val })} />
                                    </div>
                                    {statutorySettings.esiEnabled && (
                                        <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500">Employer Contribution</span>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    className="w-16 h-8 text-right font-bold bg-white"
                                                    value={statutorySettings.esiRate}
                                                    onChange={(e) => handleStatutoryChange({ esiRate: parseFloat(e.target.value) })}
                                                />
                                                <span className="text-sm font-bold text-slate-400">%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Separator />
                                {/* TDS */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">TDS</div>
                                        <Label className="font-bold text-slate-700">Tax Deducted at Source</Label>
                                    </div>
                                    <Switch checked={statutorySettings.tdsEnabled} onCheckedChange={(val) => handleStatutoryChange({ tdsEnabled: val })} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pay Cycle Settings */}
                        <Card className="rounded-2xl border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <Calendar className="text-indigo-600" /> Pay Schedule
                                </CardTitle>
                                <CardDescription>Define when your employees get paid.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500 uppercase">Frequency</Label>
                                    <Select value={paySchedule.frequency} onValueChange={(v: any) => setPaySchedule({ ...paySchedule, frequency: v })}>
                                        <SelectTrigger className="font-bold"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Monthly">Monthly</SelectItem>
                                            <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                                            <SelectItem value="Weekly">Weekly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Pay Date</Label>
                                        <div className="relative">
                                            <Input
                                                value={paySchedule.payDay}
                                                onChange={(e) => setPaySchedule({ ...paySchedule, payDay: Number(e.target.value) || 1 })}
                                                className={`pl-8 font-bold ${statutoryErrors.payDay ? "border-rose-400" : ""}`}
                                                type="number"
                                                min={1}
                                                max={31}
                                            />
                                            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                        </div>
                                        <FieldError msg={statutoryErrors.payDay} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Cutoff Date</Label>
                                        <div className="relative">
                                            <Input
                                                value={paySchedule.cutoffDay}
                                                onChange={(e) => setPaySchedule({ ...paySchedule, cutoffDay: Number(e.target.value) || 1 })}
                                                className={`pl-8 font-bold ${statutoryErrors.cutoffDay ? "border-rose-400" : ""}`}
                                                type="number"
                                                min={1}
                                                max={31}
                                            />
                                            <AlertCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                        </div>
                                        <FieldError msg={statutoryErrors.cutoffDay} />
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded">
                                    * Attendance cutoff defines the period for calculating LOPs.
                                </p>
                                <Button onClick={savePaySchedule} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                                    <Save size={14} className="mr-2" /> Save Pay Schedule
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>

            {/* Salary Component Sheet */}
            <SideFormSheet
                open={componentDialogOpen}
                onOpenChange={(v) => { setComponentDialogOpen(v); if (!v) setCurrentComponent({}); }}
                title={currentComponent.id ? `Edit ${currentComponent.type}` : `Add ${currentComponent.type || 'Component'}`}
                description={currentComponent.id ? "Modify an existing salary component." : "Create a new earning or deduction component."}
                icon={<Coins size={20} />}
                accentColor={currentComponent.id ? "#7c3aed" : "#059669"}
                width="md"
                submitLabel={currentComponent.id ? "Save Changes" : "Create Component"}
                onSubmit={(e) => { e.preventDefault(); saveComponent(); }}
            >
                <div className="space-y-4">
                    <Field label="Component Name" required error={formErrors.name || undefined}>
                        <Input value={currentComponent.name || ""} onChange={e => setCurrentComponent({ ...currentComponent, name: e.target.value })} />
                    </Field>
                    <Field label="Type" required error={formErrors.type || undefined}>
                        <Select value={currentComponent.type} onValueChange={(val: any) => setCurrentComponent({ ...currentComponent, type: val })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Earning">Earning</SelectItem>
                                <SelectItem value="Deduction">Deduction</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Calculation" required error={formErrors.amountType || undefined}>
                            <Select value={currentComponent.amountType} onValueChange={(val: any) => setCurrentComponent({ ...currentComponent, amountType: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Fixed">Fixed Amount</SelectItem>
                                    <SelectItem value="Percentage of Basic">% of Basic</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Value" required error={formErrors.value || undefined}>
                            <Input type="number" min="0" step="0.01" value={currentComponent.value ?? ""} onChange={e => setCurrentComponent({ ...currentComponent, value: parseFloat(e.target.value) })} />
                        </Field>
                    </div>
                    <div className="flex items-center gap-6 mt-2">
                        <div className="flex items-center gap-2">
                            <Switch checked={currentComponent.isTaxable} onCheckedChange={(val) => setCurrentComponent({ ...currentComponent, isTaxable: val })} />
                            <Label className="text-sm text-slate-600">Taxable</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={currentComponent.isStatutory} onCheckedChange={(val) => setCurrentComponent({ ...currentComponent, isStatutory: val })} />
                            <Label className="text-sm text-slate-600">Statutory</Label>
                        </div>
                    </div>
                </div>
            </SideFormSheet>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove this salary component?</AlertDialogTitle>
                        <AlertDialogDescription>
                            "{deleteTarget?.name}" will be removed from the salary structure. Existing payslips won't be affected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={confirmDelete}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default PayrollSettingsPage;
