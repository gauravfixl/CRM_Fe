"use client"

import React, { useState } from "react";
import {
    Settings,
    Plus,
    Edit3,
    Trash2,
    ShieldCheck,
    CreditCard,
    GitBranch,
    Globe,
    ScanLine,
    Save,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { useExpenseStore, type ExpenseCategory, type ExpensePolicy, type CorporateCard } from "@/shared/data/expense-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { cn } from "@/lib/utils";

const categories: ExpenseCategory[] = ['Travel', 'Food', 'Accommodation', 'Transport', 'Communication', 'Medical', 'Other'];

const ExpenseSettingsPage = () => {
    const { toast } = useToast();
    const { policies, corporateCards, addPolicy, updatePolicy, deletePolicy, addCorporateCard, updateCorporateCard, deleteCorporateCard } = useExpenseStore();
    const [activeSection, setActiveSection] = useState<'policies' | 'cards' | 'workflow' | 'currency'>('policies');
    const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
    const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<ExpensePolicy | null>(null);
    const [mileageRate, setMileageRate] = useState('12');
    const [ocrEnabled, setOcrEnabled] = useState(false);
    const [baseCurrency, setBaseCurrency] = useState('INR');

    const [policyForm, setPolicyForm] = useState({
        category: '' as ExpenseCategory | '',
        maxAmount: '',
        requiresReceipt: true,
        approvalLevel: 'Manager',
        perDiem: '',
        mileageRate: '',
    });

    const [cardForm, setCardForm] = useState({
        employeeName: '',
        employeeId: '',
        cardNumber: '',
        limit: '',
    });

    const [approvalWorkflow, setApprovalWorkflow] = useState([
        { level: 1, name: 'Manager Approval', threshold: 10000, autoApprove: false },
        { level: 2, name: 'HOD Approval', threshold: 50000, autoApprove: false },
        { level: 3, name: 'Finance Head', threshold: 100000, autoApprove: false },
    ]);

    const openPolicyDialog = (policy?: ExpensePolicy) => {
        if (policy) {
            setEditingPolicy(policy);
            setPolicyForm({
                category: policy.category,
                maxAmount: String(policy.maxAmount),
                requiresReceipt: policy.requiresReceipt,
                approvalLevel: policy.approvalLevel,
                perDiem: String(policy.perDiem),
                mileageRate: String(policy.mileageRate),
            });
        } else {
            setEditingPolicy(null);
            setPolicyForm({ category: '', maxAmount: '', requiresReceipt: true, approvalLevel: 'Manager', perDiem: '', mileageRate: '' });
        }
        setIsPolicyDialogOpen(true);
    };

    const handleSavePolicy = () => {
        if (!policyForm.category || !policyForm.maxAmount) {
            toast({ title: "Validation Error", description: "Category and max amount are required.", variant: "destructive" });
            return;
        }
        const data: ExpensePolicy = {
            id: editingPolicy?.id || `EP${String(policies.length + 1).padStart(3, '0')}`,
            category: policyForm.category as ExpenseCategory,
            maxAmount: parseFloat(policyForm.maxAmount),
            requiresReceipt: policyForm.requiresReceipt,
            approvalLevel: policyForm.approvalLevel,
            perDiem: parseFloat(policyForm.perDiem) || 0,
            mileageRate: parseFloat(policyForm.mileageRate) || 0,
            isActive: editingPolicy?.isActive ?? true,
        };
        if (editingPolicy) {
            updatePolicy(editingPolicy.id, data);
            toast({ title: "Policy Updated", description: `${data.category} policy has been updated.` });
        } else {
            addPolicy(data);
            toast({ title: "Policy Created", description: `New ${data.category} policy has been created.` });
        }
        setIsPolicyDialogOpen(false);
    };

    const handleSaveCard = () => {
        if (!cardForm.employeeName || !cardForm.cardNumber || !cardForm.limit) {
            toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
            return;
        }
        const masked = '**** **** **** ' + cardForm.cardNumber.slice(-4);
        const card: CorporateCard = {
            id: `CC${String(corporateCards.length + 1).padStart(3, '0')}`,
            employeeId: cardForm.employeeId || `E${String(Date.now()).slice(-3)}`,
            employeeName: cardForm.employeeName,
            cardNumber: masked,
            limit: parseFloat(cardForm.limit),
            spent: 0,
            balance: parseFloat(cardForm.limit),
            transactions: [],
        };
        addCorporateCard(card);
        setIsCardDialogOpen(false);
        setCardForm({ employeeName: '', employeeId: '', cardNumber: '', limit: '' });
        toast({ title: "Card Added", description: `Corporate card assigned to ${card.employeeName}.` });
    };

    const sectionNav = [
        { key: 'policies' as const, label: 'Expense Policies', icon: ShieldCheck },
        { key: 'cards' as const, label: 'Corporate Cards', icon: CreditCard },
        { key: 'workflow' as const, label: 'Approval Workflow', icon: GitBranch },
        { key: 'currency' as const, label: 'Currency & Features', icon: Globe },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                        <Settings className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Expense Settings</h1>
                        <p className="text-sm text-slate-500">Configure expense policies, cards, and workflows</p>
                    </div>
                </div>
            </div>

            {/* Section Nav */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
                {sectionNav.map(nav => (
                    <button
                        key={nav.key}
                        onClick={() => setActiveSection(nav.key)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            activeSection === nav.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <nav.icon className="h-4 w-4" />
                        {nav.label}
                    </button>
                ))}
            </div>

            {/* Policies Section */}
            {activeSection === 'policies' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900">Expense Policies</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 mr-4">
                                <Label className="text-xs font-bold text-slate-500">Mileage Rate (₹/km)</Label>
                                <Input
                                    type="number"
                                    value={mileageRate}
                                    onChange={(e) => setMileageRate(e.target.value)}
                                    className="w-20 h-8 text-sm"
                                />
                                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toast({ title: "Saved", description: `Mileage rate set to ₹${mileageRate}/km.` })}>
                                    <Save className="h-3 w-3 mr-1" /> Save
                                </Button>
                            </div>
                            <Button size="sm" className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]" onClick={() => openPolicyDialog()}>
                                <Plus className="h-4 w-4" /> Add Policy
                            </Button>
                        </div>
                    </div>
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-xs font-bold text-slate-500">Category</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right">Max Amount</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-center">Receipt Required</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500">Approval Level</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right">Per Diem Rate</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-center">Status</TableHead>
                                        <TableHead className="text-xs font-bold text-slate-500 text-right pr-4">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {policies.map((policy) => (
                                        <TableRow key={policy.id}>
                                            <TableCell className="text-sm font-medium text-slate-900">{policy.category}</TableCell>
                                            <TableCell className="text-sm font-bold text-slate-900 text-right">₹{policy.maxAmount.toLocaleString()}</TableCell>
                                            <TableCell className="text-center">
                                                {policy.requiresReceipt ? (
                                                    <Badge variant="secondary" className="text-[10px] bg-green-50 text-green-700">Required</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-500">Optional</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">{policy.approvalLevel}</TableCell>
                                            <TableCell className="text-sm text-slate-600 text-right">₹{policy.perDiem.toLocaleString()}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className={cn("text-[10px]", policy.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                                                    {policy.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-600" onClick={() => openPolicyDialog(policy)}>
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400" onClick={() => updatePolicy(policy.id, { isActive: !policy.isActive })}>
                                                        {policy.isActive ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4" />}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400" onClick={() => { deletePolicy(policy.id); toast({ title: "Policy Deleted" }); }}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Corporate Cards Section */}
            {activeSection === 'cards' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900">Corporate Cards</h2>
                        <Button size="sm" className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]" onClick={() => setIsCardDialogOpen(true)}>
                            <Plus className="h-4 w-4" /> Add Card
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {corporateCards.map((card) => (
                            <Card key={card.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{card.employeeName}</p>
                                            <p className="text-xs text-slate-400">{card.employeeId}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400" onClick={() => { deleteCorporateCard(card.id); toast({ title: "Card Removed" }); }}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white mb-4">
                                        <p className="text-xs text-slate-400 mb-1">Card Number</p>
                                        <p className="text-lg font-mono tracking-wider">{card.cardNumber}</p>
                                        <div className="flex justify-between mt-3">
                                            <div>
                                                <p className="text-[10px] text-slate-400">Limit</p>
                                                <p className="text-sm font-bold">₹{card.limit.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400">Spent</p>
                                                <p className="text-sm font-bold text-amber-400">₹{card.spent.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400">Balance</p>
                                                <p className="text-sm font-bold text-green-400">₹{card.balance.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(card.spent / card.limit) * 100}%` }} />
                                        </div>
                                    </div>
                                    {card.transactions.length > 0 && (
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 mb-2">Recent Transactions</p>
                                            <div className="space-y-1.5">
                                                {card.transactions.slice(0, 4).map((txn) => (
                                                    <div key={txn.id} className="flex items-center justify-between text-xs py-1.5">
                                                        <div>
                                                            <span className="font-medium text-slate-700">{txn.merchant}</span>
                                                            <span className="text-slate-400 ml-2">{txn.date}</span>
                                                        </div>
                                                        <span className="font-bold text-slate-900">₹{txn.amount.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Approval Workflow Section */}
            {activeSection === 'workflow' && (
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-900">Approval Workflow Configuration</h2>
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <CardContent className="p-5 space-y-4">
                            {approvalWorkflow.map((level, idx) => (
                                <div key={level.level} className="flex items-center gap-4 p-4 border border-slate-100 rounded-xl">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                                        L{level.level}
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            value={level.name}
                                            onChange={(e) => {
                                                const updated = [...approvalWorkflow];
                                                updated[idx] = { ...updated[idx], name: e.target.value };
                                                setApprovalWorkflow(updated);
                                            }}
                                            className="h-8 text-sm font-medium mb-1"
                                        />
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>Threshold: up to</span>
                                            <Input
                                                type="number"
                                                value={level.threshold}
                                                onChange={(e) => {
                                                    const updated = [...approvalWorkflow];
                                                    updated[idx] = { ...updated[idx], threshold: parseFloat(e.target.value) || 0 };
                                                    setApprovalWorkflow(updated);
                                                }}
                                                className="h-7 w-28 text-xs"
                                            />
                                            <span>INR</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Label className="text-xs text-slate-500">Auto-approve</Label>
                                        <Switch
                                            checked={level.autoApprove}
                                            onCheckedChange={(v) => {
                                                const updated = [...approvalWorkflow];
                                                updated[idx] = { ...updated[idx], autoApprove: v };
                                                setApprovalWorkflow(updated);
                                            }}
                                        />
                                    </div>
                                    {idx < approvalWorkflow.length - 1 && (
                                        <ChevronRight className="h-4 w-4 text-slate-300 rotate-90 absolute -bottom-4 left-1/2 -translate-x-1/2" />
                                    )}
                                </div>
                            ))}
                            <Button size="sm" variant="outline" className="gap-1.5 w-full" onClick={() => {
                                setApprovalWorkflow([...approvalWorkflow, {
                                    level: approvalWorkflow.length + 1,
                                    name: `Level ${approvalWorkflow.length + 1} Approval`,
                                    threshold: (approvalWorkflow[approvalWorkflow.length - 1]?.threshold || 0) * 2,
                                    autoApprove: false,
                                }]);
                            }}>
                                <Plus className="h-3.5 w-3.5" /> Add Approval Level
                            </Button>
                            <div className="flex justify-end">
                                <Button size="sm" className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]" onClick={() => toast({ title: "Workflow Saved", description: "Approval workflow configuration has been saved." })}>
                                    <Save className="h-4 w-4" /> Save Workflow
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Currency & Features Section */}
            {activeSection === 'currency' && (
                <div className="space-y-4">
                    <h2 className="text-sm font-bold text-slate-900">Currency & Feature Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-5 space-y-4">
                                <h3 className="text-sm font-bold text-slate-900">Currency Settings</h3>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-500">Base Currency</Label>
                                    <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Multi-currency Support</p>
                                        <p className="text-xs text-slate-500">Allow claims in foreign currencies</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Auto Currency Conversion</p>
                                        <p className="text-xs text-slate-500">Convert foreign claims to base currency</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-5 space-y-4">
                                <h3 className="text-sm font-bold text-slate-900">Feature Toggles</h3>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <ScanLine className="h-5 w-5 text-purple-500" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Receipt OCR</p>
                                            <p className="text-xs text-slate-500">Auto-extract data from receipts</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-700">Coming Soon</Badge>
                                        <Switch checked={ocrEnabled} onCheckedChange={setOcrEnabled} disabled />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                                        <p className="text-xs text-slate-500">Notify on claim status changes</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Duplicate Detection</p>
                                        <p className="text-xs text-slate-500">Flag potential duplicate claims</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Budget Alerts</p>
                                        <p className="text-xs text-slate-500">Alert when budget thresholds are reached</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex justify-end">
                        <Button size="sm" className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]" onClick={() => toast({ title: "Settings Saved", description: "Currency and feature settings have been updated." })}>
                            <Save className="h-4 w-4" /> Save Settings
                        </Button>
                    </div>
                </div>
            )}

            {/* Add/Edit Policy Dialog */}
            <Dialog open={isPolicyDialogOpen} onOpenChange={setIsPolicyDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingPolicy ? 'Edit' : 'New'} Expense Policy</DialogTitle>
                        <DialogDescription>Configure expense limits and requirements for a category.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Category *</Label>
                            <Select value={policyForm.category} onValueChange={(v) => setPolicyForm({ ...policyForm, category: v as ExpenseCategory })}>
                                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Max Amount (INR) *</Label>
                                <Input type="number" placeholder="0" value={policyForm.maxAmount} onChange={(e) => setPolicyForm({ ...policyForm, maxAmount: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Per Diem Rate (INR)</Label>
                                <Input type="number" placeholder="0" value={policyForm.perDiem} onChange={(e) => setPolicyForm({ ...policyForm, perDiem: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Approval Level</Label>
                                <Select value={policyForm.approvalLevel} onValueChange={(v) => setPolicyForm({ ...policyForm, approvalLevel: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Manager">Manager</SelectItem>
                                        <SelectItem value="HR">HR</SelectItem>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                        <SelectItem value="Director">Director</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Mileage Rate (₹/km)</Label>
                                <Input type="number" placeholder="0" value={policyForm.mileageRate} onChange={(e) => setPolicyForm({ ...policyForm, mileageRate: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <Label className="text-sm text-slate-700">Receipt Required</Label>
                            <Switch checked={policyForm.requiresReceipt} onCheckedChange={(v) => setPolicyForm({ ...policyForm, requiresReceipt: v })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPolicyDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSavePolicy} className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
                            {editingPolicy ? 'Update' : 'Create'} Policy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Card Dialog */}
            <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Corporate Card</DialogTitle>
                        <DialogDescription>Assign a new corporate card to an employee.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Employee Name *</Label>
                                <Input placeholder="Full name" value={cardForm.employeeName} onChange={(e) => setCardForm({ ...cardForm, employeeName: e.target.value })} />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500">Employee ID</Label>
                                <Input placeholder="E001" value={cardForm.employeeId} onChange={(e) => setCardForm({ ...cardForm, employeeId: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Card Number *</Label>
                            <Input placeholder="Last 4 digits will be visible" value={cardForm.cardNumber} onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500">Card Limit (INR) *</Label>
                            <Input type="number" placeholder="0" value={cardForm.limit} onChange={(e) => setCardForm({ ...cardForm, limit: e.target.value })} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCardDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveCard} className="bg-[#8B5CF6] hover:bg-[#7C3AED]">Add Card</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ExpenseSettingsPage;
