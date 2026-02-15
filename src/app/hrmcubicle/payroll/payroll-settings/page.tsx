"use client"

import React, { useState } from "react";
import {
    Settings2,
    ShieldCheck,
    Calendar,
    Building2,
    Plus,
    Save,
    Undo2,
    Trash2,
    Edit3,
    Activity,
    Scale,
    Landmark,
    Banknote,
    Clock,
    Check
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePayrollStore } from "@/shared/data/payroll-store";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const PayrollSettingsPage = () => {
    const { toast } = useToast();
    const {
        salaryComponents,
        addComponent,
        updateComponent,
        deleteComponent,
        statutorySettings,
        updateStatutorySettings
    } = usePayrollStore();

    // -- Component Form State --
    const [isComponentFormOpen, setIsComponentFormOpen] = useState(false);
    const [editingComponent, setEditingComponent] = useState<any>(null);
    const [compFormData, setCompFormData] = useState({
        name: "",
        type: "Earning" as "Earning" | "Deduction",
        amountType: "Fixed" as "Fixed" | "Percentage of Basic",
        value: "0" as string,
        isTaxable: true,
        isStatutory: false
    });

    // -- Statutory & Cycle State --
    const [statutoryFormData, setStatutoryFormData] = useState(statutorySettings);
    const [payCycleData, setPayCycleData] = useState({
        cycleStart: "1",
        cycleEnd: "31",
        payoutDay: "5",
        allowanceType: "Monthly"
    });

    // -- Bank Account Management --
    const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        bankName: "HDFC Corporate",
        accountNumber: "****8829",
        status: "Active"
    });

    // -- Handlers --
    const handleRevert = () => {
        window.location.reload(); // Simple way to revert to server state
    };

    const handleOpenBankDialog = () => {
        setIsBankDialogOpen(true);
    };

    const handleSaveBankDetails = () => {
        toast({ title: "Bank Details Updated", description: `Primary source: ${bankDetails.bankName}` });
        setIsBankDialogOpen(false);
    };

    const handleOpenCompForm = (comp?: any) => {
        if (comp) {
            setEditingComponent(comp);
            setCompFormData({
                name: comp.name,
                type: comp.type,
                amountType: comp.amountType,
                value: comp.value.toString(),
                isTaxable: comp.isTaxable,
                isStatutory: comp.isStatutory
            });
        } else {
            setEditingComponent(null);
            setCompFormData({
                name: "",
                type: "Earning",
                amountType: "Fixed",
                value: "0",
                isTaxable: true,
                isStatutory: false
            });
        }
        setIsComponentFormOpen(true);
    };

    const handleCompSubmit = () => {
        if (!compFormData.name) {
            toast({ title: "Incomplete", description: "Component Name is required.", variant: "destructive" });
            return;
        }

        const payload = {
            ...compFormData,
            value: parseFloat(compFormData.value)
        };

        if (editingComponent) {
            updateComponent(editingComponent.id, payload);
            toast({ title: "Config Updated", description: "Salary component definition refined." });
        } else {
            addComponent(payload);
            toast({ title: "Component Added", description: "New salary component added to structure." });
        }
        setIsComponentFormOpen(false);
    };

    const handleStatutoryUpdate = () => {
        updateStatutorySettings(statutoryFormData);
        toast({ title: "Settings Saved", description: "Global configuration updated successfully." });
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto" style={{ zoom: "67%" }}>
            {/* Header */}
            <div className="bg-white border-b border-slate-200 py-6 px-8 flex items-center justify-between shadow-sm sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                        <Settings2 size={20} />
                    </div>
                    <div className="text-start">
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight text-start">System Configuration</h1>
                        <p className="text-xs font-semibold text-slate-500 tracking-wide text-start italic mt-1.5 leading-none">Payroll Logic & Statutory Parameters</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={handleRevert} variant="ghost" className="h-10 text-slate-500 font-bold text-xs gap-2 px-4 hover:bg-slate-50 transition-all border-none">
                        <Undo2 size={14} /> Revert Changes
                    </Button>
                    <Button onClick={handleStatutoryUpdate} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-lg shadow-[#8B5CF6]/20 border-none transition-all">
                        <Save size={14} className="mr-2" /> Save Configuration
                    </Button>
                </div>
            </div>

            <div className="flex-1">
                <div className="p-8 pb-32 space-y-8">
                    <Tabs defaultValue="structure" className="space-y-8">
                        <div className="flex items-center justify-between">
                            <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-12 shadow-sm inline-flex">
                                <TabsTrigger value="structure" className="rounded-lg px-6 font-semibold text-xs data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white h-10 transition-all">Salary Structure</TabsTrigger>
                                <TabsTrigger value="statutory" className="rounded-lg px-6 font-semibold text-xs data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white h-10 transition-all">Statutory Core</TabsTrigger>
                                <TabsTrigger value="cycle" className="rounded-lg px-6 font-semibold text-xs data-[state=active]:bg-[#8B5CF6] data-[state=active]:text-white h-10 transition-all">Processing Cycle</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* --- TAB 1: SALARY STRUCTURE --- */}
                        <TabsContent value="structure" className="space-y-6 mt-0">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                <div className="lg:col-span-8 space-y-6">
                                    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden text-start">
                                        <CardHeader className="p-8 border-b border-slate-50 text-start">
                                            <div className="flex justify-between items-center text-start">
                                                <div className="text-start">
                                                    <CardTitle className="text-lg font-bold text-slate-900 tracking-tight text-start leading-none">Earnings & Deductions</CardTitle>
                                                    <CardDescription className="text-xs font-medium text-slate-400 mt-2 block text-start italic leading-none">Global salary mapping rules</CardDescription>
                                                </div>
                                                <Button onClick={() => handleOpenCompForm()} className="bg-[#CB9DF0] hover:bg-[#b088e0] text-white rounded-xl h-10 px-6 font-bold text-xs shadow-sm border-none">
                                                    <Plus size={14} className="mr-2" /> Add Component
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <Table>
                                                <TableHeader className="bg-slate-50/50">
                                                    <TableRow className="border-slate-100 h-14">
                                                        <TableHead className="pl-8 text-[10px] font-bold uppercase text-slate-500 tracking-wider text-start">Component Name</TableHead>
                                                        <TableHead className="text-[10px] font-bold uppercase text-slate-500 tracking-wider text-start">Type</TableHead>
                                                        <TableHead className="text-[10px] font-bold uppercase text-slate-500 tracking-wider text-start">Calculation Basis</TableHead>
                                                        <TableHead className="text-[10px] font-bold uppercase text-slate-500 tracking-wider text-start">Amount</TableHead>
                                                        <TableHead className="text-[10px] font-bold uppercase text-slate-500 tracking-wider text-start">Compliance</TableHead>
                                                        <TableHead className="text-right pr-8 text-[10px] font-bold uppercase text-slate-500 tracking-wider">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <AnimatePresence>
                                                        {salaryComponents.map((comp) => (
                                                            <motion.tr
                                                                key={comp.id}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="group hover:bg-slate-50/10 border-slate-50 border-b last:border-0 transition-colors"
                                                            >
                                                                <TableCell className="pl-8 py-5">
                                                                    <div className="flex flex-col items-start">
                                                                        <span className="text-sm font-bold text-slate-900 block leading-tight text-start">{comp.name}</span>
                                                                        <span className={cn("text-[10px] font-medium tracking-wide mt-1.5 leading-none italic", comp.isTaxable ? 'text-blue-500' : 'text-slate-400')}>
                                                                            {comp.isTaxable ? 'Taxable' : 'Tax Exempt'}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline" className={cn("border-none text-[9px] font-bold px-2 uppercase tracking-wider", comp.type === 'Earning' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}>
                                                                        {comp.type}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-xs font-medium text-slate-600 capitalize text-start">{comp.amountType}</TableCell>
                                                                <TableCell className="text-sm font-bold text-slate-700 tracking-tight text-start">
                                                                    {comp.amountType === 'Fixed' ? `₹${comp.value.toLocaleString()}` : `${comp.value}%`}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {comp.isStatutory ? <ShieldCheck size={16} className="text-[#CB9DF0]" /> : <Activity size={16} className="text-slate-200" />}
                                                                </TableCell>
                                                                <TableCell className="text-right pr-8">
                                                                    <div className="flex justify-end gap-2 text-start">
                                                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl text-slate-400 hover:text-[#CB9DF0] hover:bg-slate-100" onClick={() => handleOpenCompForm(comp)}>
                                                                            <Edit3 size={14} />
                                                                        </Button>
                                                                        <Button onClick={() => { deleteComponent(comp.id); toast({ title: "Removed", description: "Component deleted." }); }} variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                                                            <Trash2 size={14} />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </motion.tr>
                                                        ))}
                                                    </AnimatePresence>
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="lg:col-span-4 space-y-6 text-start">
                                    <Card className="rounded-3xl border border-[#8B5CF6]/20 bg-gradient-to-br from-[#8B5CF6] to-[#7c4dff] p-8 text-white relative overflow-hidden group text-start shadow-lg shadow-[#8B5CF6]/20">
                                        <div className="relative z-10 text-start flex flex-col items-start">
                                            <Badge className="bg-white/20 text-white border-none font-bold text-[10px] px-3 mb-6 leading-none h-6 shadow-md">Overview</Badge>
                                            <h3 className="text-2xl font-bold tracking-tight text-start leading-none mb-2">Structure Logic</h3>
                                            <p className="text-xs font-medium text-white/70 text-start leading-relaxed italic">Changes here are applied globally across all active employee salary structures.</p>
                                            <div className="mt-8 grid grid-cols-2 gap-4 w-full text-start">
                                                <div className="space-y-1 text-start">
                                                    <span className="text-[10px] font-medium text-white/60 block text-start">Active Components</span>
                                                    <p className="text-2xl font-bold text-white text-start">{salaryComponents.length}</p>
                                                </div>
                                                <div className="space-y-1 text-start">
                                                    <span className="text-[10px] font-medium text-white/60 block text-start">Tax Shields</span>
                                                    <p className="text-2xl font-bold text-white text-start">{salaryComponents.filter(c => !c.isTaxable).length}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Settings2 size={120} className="absolute -right-8 -bottom-8 text-white opacity-10 group-hover:scale-110 transition-transform" />
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* --- TAB 2: STATUTORY SETTINGS --- */}
                        <TabsContent value="statutory" className="mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-start">
                                {[
                                    { id: 'pf', label: 'Provident Fund (EPF)', icon: ShieldCheck, enabled: statutoryFormData.pfEnabled, rate: statutoryFormData.pfRate, desc: 'Social security contribution rules' },
                                    { id: 'esi', label: 'Medical (ESI)', icon: Activity, enabled: statutoryFormData.esiEnabled, rate: statutoryFormData.esiRate, desc: 'State insurance for eligible employees' },
                                    { id: 'tax', label: 'TDS Automation', icon: Scale, enabled: statutoryFormData.tdsEnabled, rate: null, desc: 'Auto-deduction based on tax slabs' },
                                    { id: 'pt', label: 'Professional Tax', icon: Building2, enabled: statutoryFormData.ptEnabled, rate: 200, desc: 'State-mandatory labor tax' }
                                ].map((item) => (
                                    <Card key={item.id} className="rounded-3xl border border-slate-200 bg-white p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow text-start">
                                        <div className="flex justify-between items-start text-start">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 transition-colors">
                                                <item.icon size={24} />
                                            </div>
                                            <Switch
                                                checked={item.enabled}
                                                onCheckedChange={(val) => {
                                                    const key = `${item.id}Enabled` as keyof typeof statutoryFormData;
                                                    setStatutoryFormData({ ...statutoryFormData, [key]: val });
                                                }}
                                                className="data-[state=checked]:bg-[#8B5CF6]"
                                            />
                                        </div>
                                        <div className="text-start space-y-2">
                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight text-start leading-none capitalize">{item.label}</h4>
                                            <p className="text-[10px] font-medium text-slate-400 mt-2 block text-start leading-tight italic">{item.desc}</p>
                                        </div>
                                        {item.rate !== null && (
                                            <div className="space-y-3 pt-2 text-start">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1 text-start leading-none">Rate {item.id === 'pt' ? '(Amount ₹)' : '(Percent %)'}</Label>
                                                <Input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => {
                                                        const key = `${item.id}Rate` as keyof typeof statutoryFormData;
                                                        setStatutoryFormData({ ...statutoryFormData, [key]: parseFloat(e.target.value) });
                                                    }}
                                                    className="h-11 bg-slate-50 border-none rounded-xl font-bold text-sm px-4 tabular-nums focus:ring-2 ring-slate-100 transition-all font-sans"
                                                />
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* --- TAB 3: PROCESSING CYCLE (New!) --- */}
                        <TabsContent value="cycle" className="mt-0">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-start">
                                <Card className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-start">
                                    <CardHeader className="p-0 border-b-0 space-y-2 mb-8 text-start">
                                        <CardTitle className="text-lg font-bold text-slate-900 tracking-tight text-start">Payroll Schedule</CardTitle>
                                        <CardDescription className="text-xs font-medium text-slate-400 text-start italic">Define when the payroll cycle starts and ends each month.</CardDescription>
                                    </CardHeader>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="space-y-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#8B5CF6]">
                                                <Calendar size={24} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-sans">Cycle Start Date</Label>
                                                <Select value={payCycleData.cycleStart} onValueChange={v => setPayCycleData({ ...payCycleData, cycleStart: v })}>
                                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {[...Array(28)].map((_, i) => (
                                                            <SelectItem key={i} value={`${i + 1}`}>Day {i + 1}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#8B5CF6]">
                                                <Clock size={24} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-sans">Cycle End Date</Label>
                                                <Select value={payCycleData.cycleEnd} onValueChange={v => setPayCycleData({ ...payCycleData, cycleEnd: v })}>
                                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="30">Day 30</SelectItem>
                                                        <SelectItem value="31">Day 31 (End of Month)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-500">
                                                <Banknote size={24} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-sans">Payout Date</Label>
                                                <Select value={payCycleData.payoutDay} onValueChange={v => setPayCycleData({ ...payCycleData, payoutDay: v })}>
                                                    <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold text-sm"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {[...Array(10)].map((_, i) => (
                                                            <SelectItem key={i} value={`${i + 1}`}>Day {i + 1} of Next Month</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-start flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="h-12 w-12 rounded-2xl bg-[#CB9DF0]/10 flex items-center justify-center text-[#8B5CF6]">
                                            <Landmark size={24} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-lg font-bold text-slate-900 leading-none">Bank Integration</h4>
                                            <p className="text-xs font-medium text-slate-500 italic">Connected for direct deposits</p>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                <Check size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">{bankDetails.bankName}</p>
                                                <p className="text-[10px] text-slate-500 font-medium">{bankDetails.accountNumber} • {bankDetails.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button onClick={handleOpenBankDialog} variant="outline" className="w-full mt-8 h-10 rounded-xl font-bold text-xs border-slate-200 hover:bg-slate-50">Manage Accounts</Button>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Salary Component Form Dialog */}
            <Dialog open={isComponentFormOpen} onOpenChange={setIsComponentFormOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-lg font-sans shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#CB9DF0]/10 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
                    <DialogHeader className="text-start space-y-2 relative z-10">
                        <Badge className="bg-[#CB9DF0] text-white border-none font-bold text-[9px] px-3 py-1 uppercase tracking-wider w-fit">Component Editor</Badge>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 leading-none">{editingComponent ? "Edit Component" : "New Component"}</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-400 text-start leading-none">Configure salary definition parameters</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-8 relative z-10 text-start">
                        <div className="space-y-2 text-start">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1 text-start leading-none">Name</Label>
                            <Input
                                placeholder="e.g. Basic Salary, HRA"
                                value={compFormData.name}
                                onChange={e => setCompFormData({ ...compFormData, name: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12 font-bold text-sm tracking-tight px-4 font-sans focus-visible:ring-offset-0 focus-visible:ring-[#8B5CF6]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-start">
                            <div className="space-y-2 text-start text-start">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1 text-start leading-none">Type</Label>
                                <Select value={compFormData.type} onValueChange={(v: any) => setCompFormData({ ...compFormData, type: v })}>
                                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none font-bold text-xs uppercase px-4 text-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-sans bg-white">
                                        <SelectItem value="Earning" className="rounded-lg text-xs font-bold text-emerald-600 h-10 uppercase tracking-wide">Earning</SelectItem>
                                        <SelectItem value="Deduction" className="rounded-lg text-xs font-bold text-rose-600 h-10 uppercase tracking-wide">Deduction</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2 text-start text-start">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1 text-start leading-none">Calculation</Label>
                                <Select value={compFormData.amountType} onValueChange={(v: any) => setCompFormData({ ...compFormData, amountType: v })}>
                                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none font-bold text-xs uppercase px-4 text-slate-700">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-sans bg-white">
                                        <SelectItem value="Fixed" className="rounded-lg text-xs font-bold text-slate-700 h-10 uppercase tracking-wide">Fixed Amount</SelectItem>
                                        <SelectItem value="Percentage of Basic" className="rounded-lg text-xs font-bold text-slate-700 h-10 uppercase tracking-wide">% of Basic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2 text-start text-start">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block ml-1 text-start leading-none">Value</Label>
                            <Input
                                type="number"
                                value={compFormData.value}
                                onChange={e => setCompFormData({ ...compFormData, value: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12 font-bold text-base px-6 text-slate-900 tabular-nums font-sans focus-visible:ring-offset-0 focus-visible:ring-[#8B5CF6] text-start"
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-50 text-start">
                            <div className="text-start">
                                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block text-start leading-none">Taxable Component</span>
                                <span className="text-[9px] font-medium text-slate-400 mt-1.5 block text-start leading-none italic">Include in TDS calculations</span>
                            </div>
                            <Switch checked={compFormData.isTaxable} onCheckedChange={(val) => setCompFormData({ ...compFormData, isTaxable: val })} className="data-[state=checked]:bg-[#8B5CF6]" />
                        </div>
                    </div>

                    <DialogFooter className="relative z-10 sm:justify-start">
                        <Button
                            className="w-full bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-2xl h-14 font-bold text-sm shadow-xl shadow-[#8B5CF6]/20 transition-all border-none"
                            onClick={handleCompSubmit}
                        >
                            {editingComponent ? "Update Component" : "Add Component"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bank Management Dialog */}
            <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border-none p-8 max-w-md font-sans shadow-2xl">
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-xl font-bold text-slate-900">Bank Integration</DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-400">Configure primary disbursement source</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-600">Bank Name</Label>
                            <Input
                                value={bankDetails.bankName}
                                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                                className="h-10 bg-slate-50 border-none rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-600">Account Number (Last 4)</Label>
                            <Input
                                value={bankDetails.accountNumber}
                                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                className="h-10 bg-slate-50 border-none rounded-xl"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveBankDetails} className="w-full bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-xl h-12 font-bold text-xs shadow-lg">
                            Update Banking Details
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PayrollSettingsPage;
