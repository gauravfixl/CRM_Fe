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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
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

const emptyPolicyForm = {
    category: '' as ExpenseCategory | '',
    maxAmount: '',
    requiresReceipt: true,
    approvalLevel: 'Manager',
    perDiem: '',
    mileageRate: '',
};

const emptyCardForm = {
    employeeName: '',
    employeeId: '',
    cardNumber: '',
    limit: '',
};

interface PendingDelete {
    kind: 'policy' | 'card' | 'workflow';
    id: string | number;
    label: string;
}

const ExpenseSettingsPage = () => {
    const { toast } = useToast();
    const { policies, corporateCards, addPolicy, updatePolicy, deletePolicy, addCorporateCard, updateCorporateCard, deleteCorporateCard } = useExpenseStore();
    const [activeSection, setActiveSection] = useState<'policies' | 'cards' | 'workflow' | 'currency'>('policies');
    const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
    const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<ExpensePolicy | null>(null);
    const [editingCard, setEditingCard] = useState<CorporateCard | null>(null);
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);

    const [mileageRate, setMileageRate] = useState('12');
    const [ocrEnabled, setOcrEnabled] = useState(false);
    const [baseCurrency, setBaseCurrency] = useState('INR');
    const [featureFlags, setFeatureFlags] = useState({
        multiCurrency: true,
        autoConvert: true,
        emailNotifications: true,
        duplicateDetection: true,
        budgetAlerts: true,
    });
    const [policyForm, setPolicyForm] = useState<typeof emptyPolicyForm>(emptyPolicyForm);
    const [cardForm, setCardForm] = useState<typeof emptyCardForm>(emptyCardForm);
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
            setPolicyForm(emptyPolicyForm);
        }
        setIsPolicyDialogOpen(true);
    };

    const handleSavePolicy = () => {
        if (!policyForm.category || !policyForm.maxAmount) {
            toast({ title: "Validation Error", description: "Category and max amount are required.", variant: "destructive" });
            return;
        }
        if (!editingPolicy && policies.some(p => p.category === policyForm.category)) {
            toast({ title: "Duplicate category", description: `A policy for ${policyForm.category} already exists.`, variant: "destructive" });
            return;
        }
        const maxAmount = parseFloat(policyForm.maxAmount);
        const perDiem = parseFloat(policyForm.perDiem) || 0;
        const mileage = parseFloat(policyForm.mileageRate) || 0;
        if (isNaN(maxAmount) || maxAmount <= 0) {
            toast({ title: "Invalid max amount", description: "Max amount must be greater than zero.", variant: "destructive" });
            return;
        }
        if (perDiem < 0 || mileage < 0) {
            toast({ title: "Invalid rate", description: "Per diem and mileage rate cannot be negative.", variant: "destructive" });
            return;
        }
        const data: ExpensePolicy = {
            id: editingPolicy?.id || `EP${String(policies.length + 1).padStart(3, '0')}`,
            category: policyForm.category as ExpenseCategory,
            maxAmount,
            requiresReceipt: policyForm.requiresReceipt,
            approvalLevel: policyForm.approvalLevel,
            perDiem,
            mileageRate: mileage,
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
        setEditingPolicy(null);
    };

    const openCardDialog = (card?: CorporateCard) => {
        if (card) {
            setEditingCard(card);
            setCardForm({
                employeeName: card.employeeName,
                employeeId: card.employeeId,
                cardNumber: card.cardNumber,
                limit: String(card.limit),
            });
        } else {
            setEditingCard(null);
            setCardForm(emptyCardForm);
        }
        setIsCardDialogOpen(true);
    };

    const handleSaveCard = () => {
        if (!cardForm.employeeName.trim() || !cardForm.cardNumber.trim() || !cardForm.limit) {
            toast({ title: "Validation Error", description: "Employee name, card number, and limit are required.", variant: "destructive" });
            return;
        }
        const limit = parseFloat(cardForm.limit);
        if (isNaN(limit) || limit <= 0) {
            toast({ title: "Invalid limit", description: "Card limit must be a positive number.", variant: "destructive" });
            return;
        }
        const digits = cardForm.cardNumber.replace(/[\s-]/g, '');
        const isMasked = cardForm.cardNumber.includes('****');
        if (!isMasked && !/^\d+$/.test(digits)) {
            toast({ title: "Invalid card number", description: "Card number must contain only digits.", variant: "destructive" });
            return;
        }
        if (!isMasked && digits.length < 12) {
            toast({ title: "Invalid card number", description: "Card number must be at least 12 digits.", variant: "destructive" });
            return;
        }
        const cardNumber = isMasked
            ? cardForm.cardNumber
            : '**** **** **** ' + digits.slice(-4);

        if (editingCard) {
            const balance = limit - editingCard.spent;
            updateCorporateCard(editingCard.id, {
                employeeName: cardForm.employeeName,
                employeeId: cardForm.employeeId || editingCard.employeeId,
                cardNumber,
                limit,
                balance,
            });
            toast({ title: "Card Updated", description: `Card for ${cardForm.employeeName} has been updated.` });
        } else {
            const card: CorporateCard = {
                id: `CC${String(corporateCards.length + 1).padStart(3, '0')}`,
                employeeId: cardForm.employeeId || `E${String(Date.now()).slice(-3)}`,
                employeeName: cardForm.employeeName,
                cardNumber,
                limit,
                spent: 0,
                balance: limit,
                transactions: [],
            };
            addCorporateCard(card);
            toast({ title: "Card Added", description: `Corporate card assigned to ${card.employeeName}.` });
        }
        setIsCardDialogOpen(false);
        setEditingCard(null);
        setCardForm(emptyCardForm);
    };

    const removeWorkflowLevel = (level: number) => {
        if (approvalWorkflow.length <= 1) {
            toast({ title: "Cannot remove", description: "At least one approval level is required.", variant: "destructive" });
            return;
        }
        setApprovalWorkflow(prev => prev.filter(l => l.level !== level).map((l, i) => ({ ...l, level: i + 1 })));
        toast({ title: "Level Removed", description: `Approval level has been removed.` });
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;
        if (pendingDelete.kind === 'policy') {
            deletePolicy(pendingDelete.id as string);
            toast({ title: "Policy Deleted", description: `${pendingDelete.label} policy removed.` });
        } else if (pendingDelete.kind === 'card') {
            deleteCorporateCard(pendingDelete.id as string);
            toast({ title: "Card Removed", description: `${pendingDelete.label} card removed.` });
        } else if (pendingDelete.kind === 'workflow') {
            removeWorkflowLevel(pendingDelete.id as number);
        }
        setPendingDelete(null);
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
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit flex-wrap">
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
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-sm font-bold text-slate-900">Expense Policies</h2>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-2 mr-4">
                                <Label className="text-xs font-bold text-slate-500">Mileage Rate (₹/km)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={mileageRate}
                                    onChange={(e) => setMileageRate(e.target.value)}
                                    className="w-20 h-8 text-sm"
                                />
                                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => {
                                    const r = parseFloat(mileageRate);
                                    if (isNaN(r) || r < 0) {
                                        toast({ title: "Invalid rate", description: "Mileage rate must be a non-negative number.", variant: "destructive" });
                                        return;
                                    }
                                    toast({ title: "Saved", description: `Mileage rate set to ₹${r}/km.` });
                                }}>
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
                                    {policies.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm">No policies defined yet. Click "Add Policy" to create one.</TableCell>
                                        </TableRow>
                                    ) : policies.map((policy) => (
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
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-600" title="Edit" onClick={() => openPolicyDialog(policy)}>
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title={policy.isActive ? 'Deactivate' : 'Activate'} onClick={() => { updatePolicy(policy.id, { isActive: !policy.isActive }); toast({ title: policy.isActive ? "Policy Deactivated" : "Policy Activated" }); }}>
                                                        {policy.isActive ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4 text-slate-400" />}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400" title="Delete" onClick={() => setPendingDelete({ kind: 'policy', id: policy.id, label: policy.category })}>
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
                        <h2 className="text-sm font-bold text-slate-900">Corporate Cards ({corporateCards.length})</h2>
                        <Button size="sm" className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]" onClick={() => openCardDialog()}>
                            <Plus className="h-4 w-4" /> Add Card
                        </Button>
                    </div>
                    {corporateCards.length === 0 ? (
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardContent className="p-8 text-center text-slate-400 text-sm">
                                No corporate cards assigned yet.
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {corporateCards.map((card) => (
                                <Card key={card.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{card.employeeName}</p>
                                                <p className="text-xs text-slate-400">{card.employeeId}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-600" title="Edit" onClick={() => openCardDialog(card)}>
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400" title="Remove" onClick={() => setPendingDelete({ kind: 'card', id: card.id, label: card.employeeName })}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
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
                                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min(100, (card.spent / card.limit) * 100)}%` }} />
                                            </div>
                                        </div>
                                        {card.transactions.length > 0 ? (
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
                                        ) : (
                                            <p className="text-xs text-slate-400 text-center py-2">No transactions yet</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
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
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700 flex-shrink-0">
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
                                                min="0"
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
                                    <div className="flex items-center gap-2 flex-shrink-0">
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
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 flex-shrink-0" title="Remove level" onClick={() => setPendingDelete({ kind: 'workflow', id: level.level, label: level.name })}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            ))}
                            <Button size="sm" variant="outline" className="gap-1.5 w-full" onClick={() => {
                                const lastThreshold = approvalWorkflow[approvalWorkflow.length - 1]?.threshold || 0;
                                setApprovalWorkflow([...approvalWorkflow, {
                                    level: approvalWorkflow.length + 1,
                                    name: `Level ${approvalWorkflow.length + 1} Approval`,
                                    threshold: lastThreshold * 2 || 10000,
                                    autoApprove: false,
                                }]);
                            }}>
                                <Plus className="h-3.5 w-3.5" /> Add Approval Level
                            </Button>
                            <div className="flex justify-end">
                                <Button size="sm" className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]" onClick={() => {
                                    for (let i = 0; i < approvalWorkflow.length; i++) {
                                        const lvl = approvalWorkflow[i];
                                        if (!lvl.name.trim()) {
                                            toast({ title: "Missing name", description: `Level ${lvl.level} needs a name.`, variant: "destructive" });
                                            return;
                                        }
                                        if (lvl.threshold < 0) {
                                            toast({ title: "Invalid threshold", description: `Level ${lvl.level} threshold cannot be negative.`, variant: "destructive" });
                                            return;
                                        }
                                        if (i > 0 && lvl.threshold <= approvalWorkflow[i - 1].threshold) {
                                            toast({ title: "Threshold order", description: `Level ${lvl.level} threshold must be greater than Level ${lvl.level - 1}.`, variant: "destructive" });
                                            return;
                                        }
                                    }
                                    toast({ title: "Workflow Saved", description: `${approvalWorkflow.length}-level approval workflow saved.` });
                                }}>
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
                                    <Switch checked={featureFlags.multiCurrency} onCheckedChange={(v) => setFeatureFlags(f => ({ ...f, multiCurrency: v }))} />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Auto Currency Conversion</p>
                                        <p className="text-xs text-slate-500">Convert foreign claims to base currency</p>
                                    </div>
                                    <Switch checked={featureFlags.autoConvert} onCheckedChange={(v) => setFeatureFlags(f => ({ ...f, autoConvert: v }))} />
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
                                    <Switch checked={featureFlags.emailNotifications} onCheckedChange={(v) => setFeatureFlags(f => ({ ...f, emailNotifications: v }))} />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Duplicate Detection</p>
                                        <p className="text-xs text-slate-500">Flag potential duplicate claims</p>
                                    </div>
                                    <Switch checked={featureFlags.duplicateDetection} onCheckedChange={(v) => setFeatureFlags(f => ({ ...f, duplicateDetection: v }))} />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Budget Alerts</p>
                                        <p className="text-xs text-slate-500">Alert when budget thresholds are reached</p>
                                    </div>
                                    <Switch checked={featureFlags.budgetAlerts} onCheckedChange={(v) => setFeatureFlags(f => ({ ...f, budgetAlerts: v }))} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex justify-end">
                        <Button size="sm" className="gap-1.5 bg-[#8B5CF6] hover:bg-[#7C3AED]" onClick={() => toast({ title: "Settings Saved", description: `Base currency: ${baseCurrency}. Feature toggles updated.` })}>
                            <Save className="h-4 w-4" /> Save Settings
                        </Button>
                    </div>
                </div>
            )}

            {/* Add/Edit Policy Sheet */}
            <SideFormSheet
                open={isPolicyDialogOpen}
                onOpenChange={(o) => { setIsPolicyDialogOpen(o); if (!o) setEditingPolicy(null); }}
                title={editingPolicy ? 'Edit Expense Policy' : 'New Expense Policy'}
                description="Configure expense limits and requirements for a category."
                icon={editingPolicy ? <Edit3 size={20} /> : <Plus size={20} />}
                accentColor={editingPolicy ? "#7c3aed" : "#4f46e5"}
                width="md"
                submitLabel={editingPolicy ? 'Update Policy' : 'Create Policy'}
                onSubmit={(e) => { e.preventDefault(); handleSavePolicy(); }}
            >
                <div className="space-y-4">
                    <Field label="Category" required>
                        <Select value={policyForm.category || undefined} onValueChange={(v) => setPolicyForm({ ...policyForm, category: v as ExpenseCategory })}>
                            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                            <SelectContent>
                                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Max Amount (INR)" required>
                            <Input type="number" min="0" placeholder="0" value={policyForm.maxAmount} onChange={(e) => setPolicyForm({ ...policyForm, maxAmount: e.target.value })} />
                        </Field>
                        <Field label="Per Diem Rate (INR)">
                            <Input type="number" min="0" placeholder="0" value={policyForm.perDiem} onChange={(e) => setPolicyForm({ ...policyForm, perDiem: e.target.value })} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Approval Level">
                            <Select value={policyForm.approvalLevel} onValueChange={(v) => setPolicyForm({ ...policyForm, approvalLevel: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Manager">Manager</SelectItem>
                                    <SelectItem value="HR">HR</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Director">Director</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Mileage Rate (₹/km)">
                            <Input type="number" min="0" placeholder="0" value={policyForm.mileageRate} onChange={(e) => setPolicyForm({ ...policyForm, mileageRate: e.target.value })} />
                        </Field>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <Label className="text-sm text-slate-700">Receipt Required</Label>
                        <Switch checked={policyForm.requiresReceipt} onCheckedChange={(v) => setPolicyForm({ ...policyForm, requiresReceipt: v })} />
                    </div>
                </div>
            </SideFormSheet>

            {/* Add / Edit Card Sheet */}
            <SideFormSheet
                open={isCardDialogOpen}
                onOpenChange={(o) => { setIsCardDialogOpen(o); if (!o) setEditingCard(null); }}
                title={editingCard ? 'Edit Corporate Card' : 'Add Corporate Card'}
                description={editingCard ? 'Update the card details.' : 'Assign a new corporate card to an employee.'}
                icon={editingCard ? <Edit3 size={20} /> : <CreditCard size={20} />}
                accentColor={editingCard ? "#7c3aed" : "#4f46e5"}
                width="md"
                submitLabel={editingCard ? 'Update Card' : 'Add Card'}
                onSubmit={(e) => { e.preventDefault(); handleSaveCard(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Employee Name" required>
                            <Input placeholder="Full name" value={cardForm.employeeName} onChange={(e) => setCardForm({ ...cardForm, employeeName: e.target.value })} />
                        </Field>
                        <Field label="Employee ID">
                            <Input placeholder="E001" value={cardForm.employeeId} onChange={(e) => setCardForm({ ...cardForm, employeeId: e.target.value })} />
                        </Field>
                    </div>
                    <Field label="Card Number" required>
                        <Input placeholder="Last 4 digits will be visible" value={cardForm.cardNumber} onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })} />
                    </Field>
                    <Field label="Card Limit (INR)" required>
                        <Input type="number" min="0" placeholder="0" value={cardForm.limit} onChange={(e) => setCardForm({ ...cardForm, limit: e.target.value })} />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Delete Confirmation */}
            <AlertDialog open={!!pendingDelete} onOpenChange={(o) => { if (!o) setPendingDelete(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {pendingDelete?.kind === 'policy' && 'Delete policy?'}
                            {pendingDelete?.kind === 'card' && 'Remove corporate card?'}
                            {pendingDelete?.kind === 'workflow' && 'Remove approval level?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {pendingDelete ? `This will permanently remove "${pendingDelete.label}". This action cannot be undone.` : ''}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ExpenseSettingsPage;
