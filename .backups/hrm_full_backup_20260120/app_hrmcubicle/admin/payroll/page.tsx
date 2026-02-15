"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    Plus,
    Edit,
    Trash2,
    TrendingUp,
    TrendingDown,
    Percent,
    FileText
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

interface SalaryComponent {
    id: string;
    name: string;
    type: 'Earning' | 'Deduction';
    calculationType: 'Fixed' | 'Percentage';
    value: number;
    isStatutory: boolean;
    isActive: boolean;
}

const PayrollSettingsPage = () => {
    const { toast } = useToast();
    const [components, setComponents] = useState<SalaryComponent[]>([
        { id: '1', name: 'Basic Salary', type: 'Earning', calculationType: 'Percentage', value: 40, isStatutory: false, isActive: true },
        { id: '2', name: 'HRA', type: 'Earning', calculationType: 'Percentage', value: 50, isStatutory: false, isActive: true },
        { id: '3', name: 'Special Allowance', type: 'Earning', calculationType: 'Percentage', value: 10, isStatutory: false, isActive: true },
        { id: '4', name: 'PF (Employee)', type: 'Deduction', calculationType: 'Percentage', value: 12, isStatutory: true, isActive: true },
        { id: '5', name: 'Professional Tax', type: 'Deduction', calculationType: 'Fixed', value: 200, isStatutory: true, isActive: true },
        { id: '6', name: 'TDS', type: 'Deduction', calculationType: 'Percentage', value: 10, isStatutory: true, isActive: true },
    ]);

    const [isComponentDialogOpen, setIsComponentDialogOpen] = useState(false);
    const [componentForm, setComponentForm] = useState({
        name: '',
        type: 'Earning' as 'Earning' | 'Deduction',
        calculationType: 'Percentage' as 'Fixed' | 'Percentage',
        value: 0
    });

    const handleCreateComponent = () => {
        if (!componentForm.name || !componentForm.value) {
            toast({ title: "Error", description: "All fields are required", variant: "destructive" });
            return;
        }

        const newComponent: SalaryComponent = {
            id: Date.now().toString(),
            ...componentForm,
            isStatutory: false,
            isActive: true
        };

        setComponents([...components, newComponent]);
        setIsComponentDialogOpen(false);
        setComponentForm({ name: '', type: 'Earning', calculationType: 'Percentage', value: 0 });
        toast({ title: "Component Added", description: `${componentForm.name} has been created.` });
    };

    const handleDeleteComponent = (id: string) => {
        setComponents(components.filter(c => c.id !== id));
        toast({ title: "Component Deleted" });
    };

    const earnings = components.filter(c => c.type === 'Earning');
    const deductions = components.filter(c => c.type === 'Deduction');

    const stats = [
        { label: "Earning Components", value: earnings.length, color: "bg-emerald-100", icon: <TrendingUp className="text-emerald-600" />, textColor: "text-emerald-900" },
        { label: "Deduction Components", value: deductions.length, color: "bg-rose-100", icon: <TrendingDown className="text-rose-600" />, textColor: "text-rose-900" },
        { label: "Statutory", value: components.filter(c => c.isStatutory).length, color: "bg-[#CB9DF0]", icon: <FileText className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payroll Settings</h1>
                    <p className="text-slate-500 font-medium">Configure salary structure and statutory components.</p>
                </div>

                <Dialog open={isComponentDialogOpen} onOpenChange={setIsComponentDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                            <Plus className="mr-2 h-5 w-5" /> Add Component
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                        <DialogHeader>
                            <DialogTitle>Create Salary Component</DialogTitle>
                            <DialogDescription>Add a new earning or deduction component.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label>Component Name *</Label>
                                <Input
                                    placeholder="e.g. Transport Allowance"
                                    value={componentForm.name}
                                    onChange={e => setComponentForm({ ...componentForm, name: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={componentForm.type} onValueChange={(v) => setComponentForm({ ...componentForm, type: v as 'Earning' | 'Deduction' })}>
                                        <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Earning">Earning</SelectItem>
                                            <SelectItem value="Deduction">Deduction</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Calculation</Label>
                                    <Select value={componentForm.calculationType} onValueChange={(v) => setComponentForm({ ...componentForm, calculationType: v as 'Fixed' | 'Percentage' })}>
                                        <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Fixed">Fixed Amount</SelectItem>
                                            <SelectItem value="Percentage">Percentage</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Value *</Label>
                                <Input
                                    type="number"
                                    placeholder={componentForm.calculationType === 'Fixed' ? "Amount in ₹" : "Percentage %"}
                                    value={componentForm.value || ''}
                                    onChange={e => setComponentForm({ ...componentForm, value: parseFloat(e.target.value) })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleCreateComponent}>
                                Create Component
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4`}>
                            <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Tabs defaultValue="earnings" className="w-full">
                <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <TabsTrigger value="earnings" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">Earnings</TabsTrigger>
                    <TabsTrigger value="deductions" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">Deductions</TabsTrigger>
                    <TabsTrigger value="statutory" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">Statutory</TabsTrigger>
                </TabsList>

                <TabsContent value="earnings" className="space-y-4 mt-6">
                    {earnings.map((component) => (
                        <Card key={component.id} className="border-none shadow-lg rounded-[2rem] bg-white p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-slate-900">{component.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className="bg-emerald-100 text-emerald-700 border-none text-xs font-bold">
                                            {component.calculationType === 'Fixed' ? `₹${component.value}` : `${component.value}%`}
                                        </Badge>
                                        {component.isStatutory && (
                                            <Badge className="bg-indigo-100 text-indigo-700 border-none text-xs font-bold">Statutory</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl text-rose-500 hover:bg-rose-50"
                                onClick={() => handleDeleteComponent(component.id)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="deductions" className="space-y-4 mt-6">
                    {deductions.map((component) => (
                        <Card key={component.id} className="border-none shadow-lg rounded-[2rem] bg-white p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                                    <TrendingDown size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-slate-900">{component.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className="bg-rose-100 text-rose-700 border-none text-xs font-bold">
                                            {component.calculationType === 'Fixed' ? `₹${component.value}` : `${component.value}%`}
                                        </Badge>
                                        {component.isStatutory && (
                                            <Badge className="bg-indigo-100 text-indigo-700 border-none text-xs font-bold">Statutory</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl text-rose-500 hover:bg-rose-50"
                                onClick={() => handleDeleteComponent(component.id)}
                                disabled={component.isStatutory}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="statutory" className="space-y-6 mt-6">
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
                        <h3 className="font-black text-xl mb-6">Statutory Compliance Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                                    <Percent size={16} /> Provident Fund (PF)
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Employee Contribution</span>
                                        <span className="font-bold">12%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Employer Contribution</span>
                                        <span className="font-bold">12%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                                    <DollarSign size={16} /> Professional Tax (PT)
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Monthly Deduction</span>
                                        <span className="font-bold">₹200</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Applicable States</span>
                                        <span className="font-bold">Karnataka, MH</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                                    <FileText size={16} /> TDS (Tax Deduction)
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Tax Regime</span>
                                        <span className="font-bold">New Regime</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Auto Calculate</span>
                                        <span className="font-bold">Enabled</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                                    <TrendingUp size={16} /> ESI (Insurance)
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Threshold</span>
                                        <span className="font-bold">₹21,000/month</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/70">Rate</span>
                                        <span className="font-bold">0.75%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PayrollSettingsPage;
