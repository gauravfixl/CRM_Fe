"use client"

import React, { useState, useMemo } from "react";
import {
    Layers, Plus, Edit, Trash2, Calculator, Check, X, Copy,
    ChevronRight, Settings, DollarSign, Percent, ToggleLeft, ToggleRight, Download
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table";
import {
    Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useSalaryStore, type TemplateComponent, type SalaryTemplate } from "@/shared/data/salary-store";
import { usePayrollStore } from "@/shared/data/payroll-store";

const SalaryStructurePage = () => {
    const { toast } = useToast();
    const { salaryTemplates, addTemplate, updateTemplate, deleteTemplate } = useSalaryStore();
    const { salaryComponents, addComponent, updateComponent, deleteComponent } = usePayrollStore();
    const [activeTab, setActiveTab] = useState("components");

    // Component Dialog
    const [isCompDialogOpen, setIsCompDialogOpen] = useState(false);
    const [editingComp, setEditingComp] = useState<string | null>(null);
    const [compForm, setCompForm] = useState({ name: "", type: "Earning" as "Earning" | "Deduction", amountType: "Fixed" as "Fixed" | "Percentage of Basic", value: 0, isTaxable: true, isStatutory: false });

    // Template Dialog
    const [isTempDialogOpen, setIsTempDialogOpen] = useState(false);
    const [editingTemp, setEditingTemp] = useState<string | null>(null);
    const [tempForm, setTempForm] = useState({ name: "", ctcRange: "", isDefault: false, components: [] as TemplateComponent[] });

    // CTC Calculator
    const [ctcAmount, setCtcAmount] = useState(1200000);
    const [selectedTemplateId, setSelectedTemplateId] = useState(salaryTemplates[0]?.id || "");

    const handleSaveComponent = () => {
        if (!compForm.name) { toast({ title: "Validation Error", description: "Component name is required.", variant: "destructive" }); return; }
        if (editingComp) {
            updateComponent(editingComp, compForm);
            toast({ title: "Component Updated", description: `${compForm.name} has been updated.` });
        } else {
            addComponent(compForm);
            toast({ title: "Component Added", description: `${compForm.name} has been added to salary structure.` });
        }
        setIsCompDialogOpen(false);
        setEditingComp(null);
        setCompForm({ name: "", type: "Earning", amountType: "Fixed", value: 0, isTaxable: true, isStatutory: false });
    };

    const handleEditComponent = (comp: typeof salaryComponents[0]) => {
        setCompForm({ name: comp.name, type: comp.type, amountType: comp.amountType, value: comp.value, isTaxable: comp.isTaxable, isStatutory: comp.isStatutory });
        setEditingComp(comp.id);
        setIsCompDialogOpen(true);
    };

    const handleDeleteComponent = (id: string) => {
        deleteComponent(id);
        toast({ title: "Component Deleted", description: "Salary component removed." });
    };

    const handleSaveTemplate = () => {
        if (!tempForm.name) { toast({ title: "Validation Error", description: "Template name is required.", variant: "destructive" }); return; }
        const tComponents: TemplateComponent[] = salaryComponents.map((c, i) => ({
            componentId: c.id, name: c.name, type: c.type, calculationType: c.amountType === "Percentage of Basic" ? "% of Basic" as const : "Fixed" as const, value: c.value, isActive: i < 6
        }));
        if (editingTemp) {
            updateTemplate(editingTemp, { name: tempForm.name, ctcRange: tempForm.ctcRange, isDefault: tempForm.isDefault, components: tComponents });
            toast({ title: "Template Updated", description: `${tempForm.name} updated.` });
        } else {
            addTemplate({ name: tempForm.name, ctcRange: tempForm.ctcRange, isDefault: tempForm.isDefault, components: tComponents });
            toast({ title: "Template Created", description: `${tempForm.name} created.` });
        }
        setIsTempDialogOpen(false);
        setEditingTemp(null);
        setTempForm({ name: "", ctcRange: "", isDefault: false, components: [] });
    };

    const ctcBreakup = useMemo(() => {
        const template = salaryTemplates.find(t => t.id === selectedTemplateId);
        if (!template) return [];
        const basic = ctcAmount * 0.4;
        return template.components.filter(c => c.isActive).map(c => {
            let amount = 0;
            if (c.calculationType === "% of Basic") amount = basic * (c.value / 100);
            else if (c.calculationType === "% of CTC") amount = ctcAmount * (c.value / 100);
            else amount = c.value;
            return { name: c.name, type: c.type, monthly: Math.round(amount / 12), annual: Math.round(amount) };
        });
    }, [ctcAmount, selectedTemplateId, salaryTemplates]);

    // FBP State
    const [fbpCategories] = useState([
        { id: "1", name: "Food Coupons", limit: 26400, flexible: true },
        { id: "2", name: "Telephone Reimbursement", limit: 18000, flexible: true },
        { id: "3", name: "Driver Salary", limit: 10800, flexible: false },
        { id: "4", name: "Car Lease", limit: 30000, flexible: false },
        { id: "5", name: "Fuel Allowance", limit: 21600, flexible: true },
    ]);
    const [fbpToggles, setFbpToggles] = useState<Record<string, boolean>>({ "1": true, "2": true, "3": false, "4": false, "5": true });

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "67%" }}>
            <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]"><Layers size={20} /></div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Salary Structure Builder</h1>
                        <p className="text-xs font-semibold text-slate-500 capitalize tracking-wider">Components, Templates & Flexi Benefits</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-10 rounded-lg font-bold text-xs gap-2 border-slate-200" onClick={() => {
                        const csv = ["Component,Type,Calculation,Value,Taxable,Statutory", ...salaryComponents.map(c => `${c.name},${c.type},${c.amountType},${c.value},${c.isTaxable},${c.isStatutory}`)].join("\n");
                        const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "salary_components.csv"; a.click(); URL.revokeObjectURL(url);
                        toast({ title: "Exported", description: "Salary components exported to CSV." });
                    }}><Download size={14} /> Export</Button>
                </div>
            </div>

            <div className="flex-1 p-8 space-y-6 pb-32">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
                        {[{ id: "components", label: "Pay Components" }, { id: "templates", label: "Salary Templates" }, { id: "fbp", label: "Flexi Benefits (FBP)" }, { id: "calculator", label: "CTC Calculator" }].map(t => (
                            <TabsTrigger key={t.id} value={t.id} className="rounded-lg px-5 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm">{t.label}</TabsTrigger>
                        ))}
                    </TabsList>

                    {/* COMPONENTS TAB */}
                    <TabsContent value="components" className="mt-6">
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-0">
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-slate-900">Pay Components ({salaryComponents.length})</h3>
                                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs" onClick={() => { setEditingComp(null); setCompForm({ name: "", type: "Earning", amountType: "Fixed", value: 0, isTaxable: true, isStatutory: false }); setIsCompDialogOpen(true); }}><Plus size={14} className="mr-1.5" /> Add Component</Button>
                                </div>
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="border-none"><TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest pl-5">Component</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Type</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Calculation</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Value</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Taxable</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Statutory</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest text-right pr-5">Actions</TableHead></TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {salaryComponents.map(c => (
                                            <TableRow key={c.id} className="border-slate-50 hover:bg-slate-50/50">
                                                <TableCell className="pl-5 font-bold text-slate-900 text-sm">{c.name}</TableCell>
                                                <TableCell><Badge variant="outline" className={cn("font-bold text-[9px] px-2", c.type === "Earning" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100")}>{c.type}</Badge></TableCell>
                                                <TableCell className="text-xs font-bold text-slate-500">{c.amountType}</TableCell>
                                                <TableCell className="text-xs font-bold text-slate-900">{c.amountType === "Percentage of Basic" ? `${c.value}%` : `₹${c.value.toLocaleString()}`}</TableCell>
                                                <TableCell>{c.isTaxable ? <Check size={14} className="text-emerald-500" /> : <X size={14} className="text-slate-300" />}</TableCell>
                                                <TableCell>{c.isStatutory ? <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] font-bold">Statutory</Badge> : <span className="text-slate-300 text-xs">-</span>}</TableCell>
                                                <TableCell className="text-right pr-5">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => handleEditComponent(c)}><Edit size={13} className="text-slate-400" /></Button>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg" onClick={() => handleDeleteComponent(c.id)}><Trash2 size={13} className="text-red-400" /></Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TEMPLATES TAB */}
                    <TabsContent value="templates" className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-900">Salary Templates ({salaryTemplates.length})</h3>
                            <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs" onClick={() => { setEditingTemp(null); setTempForm({ name: "", ctcRange: "", isDefault: false, components: [] }); setIsTempDialogOpen(true); }}><Plus size={14} className="mr-1.5" /> New Template</Button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {salaryTemplates.map(t => (
                                <Card key={t.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-base font-bold text-slate-900">{t.name}</h4>
                                                    {t.isDefault && <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border-none text-[8px] font-bold">Default</Badge>}
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">CTC Range: {t.ctcRange}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setEditingTemp(t.id); setTempForm({ name: t.name, ctcRange: t.ctcRange, isDefault: t.isDefault, components: t.components }); setIsTempDialogOpen(true); }}><Edit size={13} className="text-slate-400" /></Button>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { deleteTemplate(t.id); toast({ title: "Template Deleted" }); }}><Trash2 size={13} className="text-red-400" /></Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {t.components.filter(c => c.isActive).slice(0, 6).map((c, i) => (
                                                <div key={i} className="flex items-center justify-between text-xs">
                                                    <span className="font-medium text-slate-600">{c.name}</span>
                                                    <span className="font-bold text-slate-900">{c.calculationType === "Fixed" ? `₹${c.value.toLocaleString()}` : `${c.value}% ${c.calculationType}`}</span>
                                                </div>
                                            ))}
                                            {t.components.filter(c => c.isActive).length > 6 && <p className="text-[10px] text-slate-400 font-bold">+{t.components.filter(c => c.isActive).length - 6} more components</p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* FBP TAB */}
                    <TabsContent value="fbp" className="mt-6">
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Flexi Benefits Plan</h3>
                                        <p className="text-xs font-medium text-slate-500 mt-0.5">Configure which salary components employees can customize</p>
                                    </div>
                                    <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs" onClick={() => toast({ title: "FBP Saved", description: "Flexi benefit configuration updated." })}>Save Configuration</Button>
                                </div>
                                <div className="space-y-3">
                                    {fbpCategories.map(cat => (
                                        <div key={cat.id} className={cn("p-4 rounded-xl border flex items-center justify-between transition-all", fbpToggles[cat.id] ? "border-[#8B5CF6]/20 bg-[#8B5CF6]/5" : "border-slate-100 bg-slate-50/50")}>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{cat.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400">Annual Limit: ₹{cat.limit.toLocaleString()}</p>
                                            </div>
                                            <Button variant="ghost" className="h-9 px-3 rounded-lg" onClick={() => setFbpToggles(prev => ({ ...prev, [cat.id]: !prev[cat.id] }))}>
                                                {fbpToggles[cat.id] ? <ToggleRight size={24} className="text-[#8B5CF6]" /> : <ToggleLeft size={24} className="text-slate-300" />}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* CTC CALCULATOR TAB */}
                    <TabsContent value="calculator" className="mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <Card className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardContent className="p-6 space-y-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]"><Calculator size={20} /></div>
                                        <h3 className="text-base font-bold text-slate-900">CTC Calculator</h3>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500">Annual CTC (₹)</Label>
                                        <Input type="number" value={ctcAmount} onChange={e => setCtcAmount(Number(e.target.value))} className="h-10 rounded-lg font-bold text-sm" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-slate-500">Salary Template</Label>
                                        <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                                            <SelectTrigger className="h-10 rounded-lg font-bold text-xs"><SelectValue placeholder="Select template" /></SelectTrigger>
                                            <SelectContent className="rounded-xl font-bold">
                                                {salaryTemplates.map(t => <SelectItem key={t.id} value={t.id} className="text-xs">{t.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="p-4 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/10 text-center">
                                        <p className="text-[10px] font-bold text-slate-400">Monthly Take-Home (Est.)</p>
                                        <p className="text-2xl font-bold text-[#8B5CF6] mt-1">₹{Math.round(ctcAmount * 0.72 / 12).toLocaleString()}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardContent className="p-0">
                                    <div className="p-5 border-b border-slate-100">
                                        <h3 className="text-sm font-bold text-slate-900">Salary Breakup for ₹{(ctcAmount / 100000).toFixed(1)} LPA</h3>
                                    </div>
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow className="border-none"><TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest pl-5">Component</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest">Type</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest text-right">Monthly</TableHead><TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest text-right pr-5">Annual</TableHead></TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ctcBreakup.map((row, i) => (
                                                <TableRow key={i} className="border-slate-50">
                                                    <TableCell className="pl-5 font-bold text-slate-900 text-xs">{row.name}</TableCell>
                                                    <TableCell><Badge variant="outline" className={cn("text-[8px] font-bold", row.type === "Earning" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600")}>{row.type}</Badge></TableCell>
                                                    <TableCell className="text-right font-bold text-xs text-slate-700">₹{row.monthly.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right pr-5 font-bold text-xs text-slate-900">₹{row.annual.toLocaleString()}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="border-t-2 border-slate-200 bg-slate-50">
                                                <TableCell className="pl-5 font-bold text-slate-900 text-sm" colSpan={2}>Total CTC</TableCell>
                                                <TableCell className="text-right font-bold text-sm text-[#8B5CF6]">₹{Math.round(ctcAmount / 12).toLocaleString()}</TableCell>
                                                <TableCell className="text-right pr-5 font-bold text-sm text-[#8B5CF6]">₹{ctcAmount.toLocaleString()}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Component Dialog */}
            <Dialog open={isCompDialogOpen} onOpenChange={setIsCompDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-6 max-w-lg shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{editingComp ? "Edit Component" : "Add Pay Component"}</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-500">Define earnings or deduction component.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Name</Label><Input value={compForm.name} onChange={e => setCompForm({ ...compForm, name: e.target.value })} className="h-9 rounded-lg text-xs font-bold" placeholder="e.g. House Rent Allowance" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Type</Label><Select value={compForm.type} onValueChange={v => setCompForm({ ...compForm, type: v as any })}><SelectTrigger className="h-9 rounded-lg text-xs font-bold"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl font-bold"><SelectItem value="Earning" className="text-xs">Earning</SelectItem><SelectItem value="Deduction" className="text-xs">Deduction</SelectItem></SelectContent></Select></div>
                            <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Calculation</Label><Select value={compForm.amountType} onValueChange={v => setCompForm({ ...compForm, amountType: v as any })}><SelectTrigger className="h-9 rounded-lg text-xs font-bold"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl font-bold"><SelectItem value="Fixed" className="text-xs">Fixed Amount</SelectItem><SelectItem value="Percentage of Basic" className="text-xs">% of Basic</SelectItem></SelectContent></Select></div>
                        </div>
                        <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Value</Label><Input type="number" value={compForm.value} onChange={e => setCompForm({ ...compForm, value: Number(e.target.value) })} className="h-9 rounded-lg text-xs font-bold" /></div>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={compForm.isTaxable} onChange={e => setCompForm({ ...compForm, isTaxable: e.target.checked })} className="rounded" /><span className="text-xs font-bold text-slate-600">Taxable</span></label>
                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={compForm.isStatutory} onChange={e => setCompForm({ ...compForm, isStatutory: e.target.checked })} className="rounded" /><span className="text-xs font-bold text-slate-600">Statutory</span></label>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsCompDialogOpen(false)} className="rounded-lg h-9 px-6 font-bold text-xs">Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-6 font-bold text-xs" onClick={handleSaveComponent}>{editingComp ? "Save Changes" : "Add Component"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Template Dialog */}
            <Dialog open={isTempDialogOpen} onOpenChange={setIsTempDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-6 max-w-lg shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">{editingTemp ? "Edit Template" : "New Salary Template"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">Template Name</Label><Input value={tempForm.name} onChange={e => setTempForm({ ...tempForm, name: e.target.value })} className="h-9 rounded-lg text-xs font-bold" placeholder="e.g. Standard India" /></div>
                        <div className="space-y-1.5"><Label className="text-[10px] font-bold text-slate-500">CTC Range</Label><Input value={tempForm.ctcRange} onChange={e => setTempForm({ ...tempForm, ctcRange: e.target.value })} className="h-9 rounded-lg text-xs font-bold" placeholder="e.g. ₹5L - ₹15L" /></div>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={tempForm.isDefault} onChange={e => setTempForm({ ...tempForm, isDefault: e.target.checked })} className="rounded" /><span className="text-xs font-bold text-slate-600">Set as Default Template</span></label>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setIsTempDialogOpen(false)} className="rounded-lg h-9 px-6 font-bold text-xs">Cancel</Button>
                        <Button className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-6 font-bold text-xs" onClick={handleSaveTemplate}>{editingTemp ? "Save" : "Create Template"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SalaryStructurePage;
