"use client"

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    Banknote,
    Plus,
    Calendar,
    Settings,
    ShieldCheck,
    Coins,
    Percentage,
    Trash2,
    Edit2,
    Landmark,
    FileText,
    Calculator,
    AlertCircle
} from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePayrollStore, type SalaryComponent } from "@/shared/data/payroll-store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Switch } from "@/shared/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

const PayrollSettingsPage = () => {
    const { salaryComponents, statutorySettings, payCycles, addSalaryComponent, updateSalaryComponent, deleteSalaryComponent, updateStatutorySettings } = usePayrollStore();
    const { toast } = useToast();

    // Dialog States
    const [componentDialogOpen, setComponentDialogOpen] = useState(false);
    const [currentComponent, setCurrentComponent] = useState<Partial<SalaryComponent>>({});

    const handleEditComponent = (comp: SalaryComponent) => {
        setCurrentComponent(comp);
        setComponentDialogOpen(true);
    };

    const handleNewComponent = () => {
        setCurrentComponent({ name: "", type: "Earning", amountType: "Fixed", value: 0, isTaxable: true, isStatutory: false });
        setComponentDialogOpen(true);
    };

    const saveComponent = () => {
        if (!currentComponent.name) return;
        if (currentComponent.id) {
            updateSalaryComponent(currentComponent.id, currentComponent);
            toast({ title: "Component Updated", description: "Salary structure modified." });
        } else {
            addSalaryComponent(currentComponent as SalaryComponent);
            toast({ title: "New Component Added", description: "Added to salary structure." });
        }
        setComponentDialogOpen(false);
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

                        <div className="grid grid-cols-1 gap-4">
                            {/* Earnings */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Earnings</h3>
                                {salaryComponents.filter(c => c.type === 'Earning').map(comp => (
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
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => deleteSalaryComponent(comp.id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Deductions */}
                            <div className="space-y-4 mt-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1">Deductions</h3>
                                {salaryComponents.filter(c => c.type === 'Deduction').map(comp => (
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
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => deleteSalaryComponent(comp.id)}>
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
                                        <Switch checked={statutorySettings.pfEnabled} onCheckedChange={(val) => updateStatutorySettings({ pfEnabled: val })} />
                                    </div>
                                    {statutorySettings.pfEnabled && (
                                        <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between" >
                                            <span className="text-xs font-medium text-slate-500">Employer Contribution</span>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    className="w-16 h-8 text-right font-bold bg-white"
                                                    value={statutorySettings.pfRate}
                                                    onChange={(e) => updateStatutorySettings({ pfRate: parseFloat(e.target.value) })}
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
                                        <Switch checked={statutorySettings.esiEnabled} onCheckedChange={(val) => updateStatutorySettings({ esiEnabled: val })} />
                                    </div>
                                    {statutorySettings.esiEnabled && (
                                        <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500">Employer Contribution</span>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    className="w-16 h-8 text-right font-bold bg-white"
                                                    value={statutorySettings.esiRate}
                                                    onChange={(e) => updateStatutorySettings({ esiRate: parseFloat(e.target.value) })}
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
                                    <Switch checked={statutorySettings.tdsEnabled} onCheckedChange={(val) => updateStatutorySettings({ tdsEnabled: val })} />
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
                                    <Select defaultValue={payCycles[0]?.frequency || 'Monthly'}>
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
                                            <Input defaultValue={payCycles[0]?.payDay} className="pl-8 font-bold" type="number" />
                                            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-500 uppercase">Cutoff Date</Label>
                                        <div className="relative">
                                            <Input defaultValue={payCycles[0]?.attendanceCutoffDay} className="pl-8 font-bold" type="number" />
                                            <AlertCircle className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded">
                                    * Attendance cutoff defines the period for calculating LOPs.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>

            {/* Component Dialog */}
            <Dialog open={componentDialogOpen} onOpenChange={setComponentDialogOpen}>
                <DialogContent className="rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            {currentComponent.type === 'Earning' ? 'Add Earning' : 'Add Deduction'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid gap-2">
                            <Label>Component Name</Label>
                            <Input value={currentComponent.name} onChange={e => setCurrentComponent({ ...currentComponent, name: e.target.value })} className="bg-slate-50 font-medium" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Type</Label>
                            <Select value={currentComponent.type} onValueChange={(val: any) => setCurrentComponent({ ...currentComponent, type: val })}>
                                <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Earning">Earning</SelectItem>
                                    <SelectItem value="Deduction">Deduction</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Calculation</Label>
                                <Select value={currentComponent.amountType} onValueChange={(val: any) => setCurrentComponent({ ...currentComponent, amountType: val })}>
                                    <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fixed">Fixed Amount</SelectItem>
                                        <SelectItem value="Percentage of Basic">% of Basic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Value</Label>
                                <Input type="number" value={currentComponent.value} onChange={e => setCurrentComponent({ ...currentComponent, value: parseFloat(e.target.value) })} className="bg-slate-50 font-bold" />
                            </div>
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
                    <Button onClick={saveComponent} className="bg-emerald-600 text-white w-full h-12 rounded-xl font-bold hover:bg-emerald-700">Save Component</Button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PayrollSettingsPage;
