"use client"

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Laptop,
    Monitor,
    Smartphone,
    Search,
    Filter,
    Plus,
    RefreshCw,
    Users,
    History,
    Trash,
    User,
    Pencil,
    PackagePlus,
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore, InventoryAsset } from "@/shared/data/lifecycle-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const TYPE_OPTIONS: InventoryAsset['type'][] = ["Laptop", "Mobile", "Monitor"];
const CONDITION_OPTIONS: InventoryAsset['condition'][] = ["Excellent", "Good", "Used"];
const STATUS_OPTIONS: InventoryAsset['status'][] = ["Available", "Assigned", "Repair"];

const EMPTY_FORM = { id: "", name: "", type: "Laptop" as InventoryAsset['type'], condition: "Excellent" as InventoryAsset['condition'], status: "Available" as InventoryAsset['status'] };

const AssetAllocationPage = () => {
    const { toast } = useToast();
    const { assets, employees, newHires, assignAsset, returnAsset, addAsset, deleteAsset, updateAsset, loadAssetsFromApi, syncAssetToApi } = useLifecycleStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");

    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

    const [assignForm, setAssignForm] = useState({ assetId: "", employeeId: "" });
    const [registerForm, setRegisterForm] = useState(EMPTY_FORM);
    const [editForm, setEditForm] = useState(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => { loadAssetsFromApi(); }, [loadAssetsFromApi]);

    const selectedAsset = useMemo(() => assets.find(a => a.id === selectedAssetId) || null, [assets, selectedAssetId]);

    const eligibleEmployees = useMemo(() => [
        ...employees.filter(e => e.status === 'Active' || e.status === 'Probation').map(e => ({ id: e.id, name: e.name, role: e.role, department: e.department })),
        ...newHires.filter(h => h.status === 'Onboarding' || h.status === 'Pre-boarding').map(h => ({ id: h.id, name: h.name, role: h.position, department: h.department })),
    ], [employees, newHires]);

    const availableAssets = useMemo(() => assets.filter(a => a.status === 'Available'), [assets]);

    const totalAssets = assets.length;
    const assignedCount = assets.filter(a => a.status === 'Assigned').length;
    const availableCount = assets.filter(a => a.status === 'Available').length;
    const repairCount = assets.filter(a => a.status === 'Repair').length;

    const stats = [
        { label: "Total Assets", value: totalAssets, color: "bg-[#CB9DF0]" },
        { label: "Assigned", value: assignedCount, color: "bg-[#F0C1E1]" },
        { label: "Available", value: availableCount, color: "bg-[#FFF9BF]" },
        { label: "In Repair", value: repairCount, color: "bg-[#FDDBBB]" },
    ];

    const generateAssetId = () => {
        let n = assets.length + 1;
        let candidate = `ASST-${String(n).padStart(3, '0')}`;
        while (assets.some(a => a.id === candidate)) {
            n += 1;
            candidate = `ASST-${String(n).padStart(3, '0')}`;
        }
        return candidate;
    };

    const getEmployeeName = (id?: string) => {
        if (!id) return "Unassigned";
        const emp = employees.find(e => e.id === id) || newHires.find(h => h.id === id);
        return emp ? emp.name : "Unknown";
    };

    const filteredAssets = assets.filter(a => {
        const q = searchTerm.toLowerCase();
        const holder = a.assignedTo ? getEmployeeName(a.assignedTo).toLowerCase() : "";
        const matchesSearch = !q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || holder.includes(q);
        const matchesType = filterType === "All" || a.type === filterType;
        const matchesStatus = filterStatus === "All" || a.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const openRegister = () => {
        setRegisterForm({ ...EMPTY_FORM, id: generateAssetId() });
        setFormErrors({});
        setIsRegisterOpen(true);
    };

    const openEdit = (a: InventoryAsset) => {
        setSelectedAssetId(a.id);
        setEditForm({ id: a.id, name: a.name, type: a.type, condition: a.condition, status: a.status });
        setFormErrors({});
        setIsEditOpen(true);
    };

    const validate = (form: typeof EMPTY_FORM, checkIdCollision: boolean) => {
        const errs: Record<string, string> = {};
        if (!form.id.trim()) errs.id = "Asset ID is required";
        else if (checkIdCollision && assets.some(a => a.id === form.id)) errs.id = "Asset ID already exists";
        if (!form.name.trim()) errs.name = "Asset name is required";
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleRegister = () => {
        if (!validate(registerForm, true)) return;
        addAsset({ id: registerForm.id.trim(), name: registerForm.name.trim(), type: registerForm.type, condition: registerForm.condition, status: registerForm.status });
        syncAssetToApi('create', { name: registerForm.name, assetId: registerForm.id, type: registerForm.type, condition: registerForm.condition, status: registerForm.status });
        setIsRegisterOpen(false);
        toast({ title: "Registered", description: "New item added to inventory master." });
    };

    const handleEdit = () => {
        if (!editForm.name.trim()) {
            setFormErrors({ name: "Name is required" });
            return;
        }
        updateAsset(editForm.id, { name: editForm.name.trim(), type: editForm.type, condition: editForm.condition, status: editForm.status });
        syncAssetToApi('update', { id: editForm.id, data: { name: editForm.name, type: editForm.type, condition: editForm.condition, status: editForm.status } });
        setIsEditOpen(false);
        toast({ title: "Asset Updated", description: "Changes saved successfully." });
    };

    const handleAssign = () => {
        const asset = assets.find(a => a.id === assignForm.assetId);
        const employee = eligibleEmployees.find(e => e.id === assignForm.employeeId);
        if (!asset || !employee) {
            toast({ title: "Select both fields", description: "Asset and employee are required.", variant: "destructive" });
            return;
        }
        assignAsset(asset.id, employee.id, employee.name);
        syncAssetToApi('assign', { assetId: asset.id, employeeId: employee.id });
        setIsAssignOpen(false);
        setAssignForm({ assetId: "", employeeId: "" });
        toast({ title: "Asset Assigned", description: `${asset.name} allocated to ${employee.name}.` });
    };

    const handleReturn = (id: string) => {
        returnAsset(id);
        syncAssetToApi('return', { assetId: id });
        toast({ title: "Asset Returned", description: "Marked as Available in inventory." });
    };

    const handleDelete = () => {
        if (!selectedAsset) return;
        deleteAsset(selectedAsset.id);
        syncAssetToApi('delete', { id: selectedAsset.id });
        setIsDeleteOpen(false);
        setSelectedAssetId(null);
        toast({ title: "Deleted", description: "Asset removed from inventory.", variant: "destructive" });
    };

    const handleToggleRepair = () => {
        if (!selectedAsset) return;
        const nextStatus: InventoryAsset['status'] = selectedAsset.status === 'Repair' ? 'Available' : 'Repair';
        updateAsset(selectedAsset.id, { status: nextStatus });
        syncAssetToApi('update', { id: selectedAsset.id, data: { status: nextStatus } });
        setIsHistoryOpen(false);
        toast({ title: "Status Updated", description: `Marked as ${nextStatus}.` });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Asset Allocation</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 3: Manage inventory and employee assignments.</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" onClick={openRegister} className="rounded-xl h-9 px-4 border-slate-200 text-slate-500 font-bold text-[10px] hover:bg-slate-50">
                        <PackagePlus className="mr-1.5 h-3.5 w-3.5" /> Register Item
                    </Button>
                    <Button onClick={() => { setAssignForm({ assetId: "", employeeId: "" }); setIsAssignOpen(true); }} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-9 px-4 shadow-sm font-bold text-[10px]" disabled={availableAssets.length === 0}>
                        <Plus className="mr-1.5 h-3.5 w-3.5" /> Assign Asset
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm hover:shadow-md transition-all rounded-xl ${stat.color} p-4 relative overflow-hidden group h-24`}>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <p className="text-[10px] font-bold text-slate-900">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            </div>
                            <div className="absolute -right-2 -bottom-2 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                                <Laptop size={48} />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Inventory table */}
            <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                    <div className="flex items-center gap-4 flex-wrap">
                        <h2 className="text-sm font-bold text-slate-900">Inventory Master</h2>
                        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                            {["All", "Laptop", "Mobile", "Monitor"].map(cat => (
                                <button key={cat} onClick={() => setFilterType(cat)} className={`px-3 py-1 rounded-lg text-[9px] font-bold transition-all ${filterType === cat ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-32 h-8 rounded-xl bg-slate-50 border-slate-200 text-[10px] font-bold">
                                <Filter className="h-3 w-3 mr-2" /> <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl font-bold">
                                <SelectItem value="All" className="text-xs">All Status</SelectItem>
                                <SelectItem value="Available" className="text-xs">Available</SelectItem>
                                <SelectItem value="Assigned" className="text-xs">Assigned</SelectItem>
                                <SelectItem value="Repair" className="text-xs">In Repair</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <Input placeholder="Search asset, ID, employee..." className="pl-9 h-9 rounded-xl bg-slate-50 border-slate-200 font-bold text-[10px]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#FFF9BF]/30">
                            <tr className="text-[10px] font-bold text-slate-600 border-b border-[#FFF9BF]">
                                <th className="px-4 py-2">Asset Details</th>
                                <th className="px-4 py-2">Assigned To</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Condition</th>
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-bold text-slate-600">
                            {filteredAssets.map((asset) => (
                                <tr key={asset.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-200 last:border-0">
                                    <td className="px-4 py-2 cursor-pointer" onClick={() => { setSelectedAssetId(asset.id); setIsHistoryOpen(true); }}>
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#CB9DF0]/10 group-hover:text-[#9d5ccf] transition-colors">
                                                {asset.type === 'Laptop' ? <Laptop size={14} /> : asset.type === 'Mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 group-hover:text-[#9d5ccf] text-[11px] leading-tight">{asset.name}</h4>
                                                <p className="text-[8px] text-slate-400 font-bold font-mono tracking-tight leading-none">{asset.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        {asset.assignedTo ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-5 w-5 rounded-full bg-[#F0C1E1] text-white flex items-center justify-center">
                                                    <User size={10} />
                                                </div>
                                                <span className="font-bold text-slate-700 text-[10px]">{getEmployeeName(asset.assignedTo)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-[10px] italic font-medium">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <Badge className={`border-none font-bold text-[9px] h-5 px-2 ${asset.status === 'Assigned' ? 'bg-[#CB9DF0] text-white' : asset.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#FDDBBB] text-amber-800'}`}>
                                            {asset.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-2 font-bold text-slate-500 text-[10px]">{asset.condition}</td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {asset.status === 'Assigned' && (
                                                <Button variant="outline" size="sm" className="h-7 rounded-lg border-slate-200 text-rose-500 hover:bg-rose-50 font-bold text-[9px] px-2" onClick={() => handleReturn(asset.id)}>
                                                    Return
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50" title="Edit" onClick={() => openEdit(asset)}>
                                                <Pencil size={12} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50" title="History" onClick={() => { setSelectedAssetId(asset.id); setIsHistoryOpen(true); }}>
                                                <History size={12} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-slate-300 hover:text-rose-500 hover:bg-rose-50" title="Delete" onClick={() => { setSelectedAssetId(asset.id); setIsDeleteOpen(true); }}>
                                                <Trash size={12} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredAssets.length === 0 && (
                        <div className="py-10 text-center">
                            <Laptop className="mx-auto h-10 w-10 text-slate-200 mb-3" />
                            <p className="text-slate-400 font-bold text-xs">{assets.length === 0 ? 'No assets in inventory. Register your first item.' : 'No assets match your filters.'}</p>
                            {assets.length > 0 && (searchTerm || filterType !== 'All' || filterStatus !== 'All') && (
                                <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setFilterType('All'); setFilterStatus('All'); }} className="mt-3 text-[10px] font-bold text-indigo-500 h-7">Clear filters</Button>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            {/* Register Dialog */}
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogContent className="bg-white rounded-xl border-2 border-slate-200 p-6 max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Register New Asset</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400">Add a new device to the company inventory.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 py-3">
                        <div className="space-y-1 col-span-2">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Asset Name</Label>
                            <Input placeholder="e.g. MacBook Pro M3" className="h-9 rounded-xl text-xs font-bold bg-slate-50/50" value={registerForm.name} onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })} />
                            {formErrors.name && <p className="text-[10px] font-bold text-rose-500 ml-1">{formErrors.name}</p>}
                        </div>
                        <div className="space-y-1 col-span-2">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Asset ID / Serial No.</Label>
                            <Input placeholder="ASST-00X" className="h-9 rounded-xl text-xs font-bold bg-slate-50/50" value={registerForm.id} onChange={e => setRegisterForm({ ...registerForm, id: e.target.value })} />
                            {formErrors.id && <p className="text-[10px] font-bold text-rose-500 ml-1">{formErrors.id}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Category</Label>
                            <Select value={registerForm.type} onValueChange={(v: InventoryAsset['type']) => setRegisterForm({ ...registerForm, type: v })}>
                                <SelectTrigger className="h-9 rounded-xl text-xs font-bold bg-slate-50/50"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl font-bold">
                                    {TYPE_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Condition</Label>
                            <Select value={registerForm.condition} onValueChange={(v: InventoryAsset['condition']) => setRegisterForm({ ...registerForm, condition: v })}>
                                <SelectTrigger className="h-9 rounded-xl text-xs font-bold bg-slate-50/50"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl font-bold">
                                    {CONDITION_OPTIONS.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Initial Status</Label>
                            <Select value={registerForm.status} onValueChange={(v: InventoryAsset['status']) => setRegisterForm({ ...registerForm, status: v })}>
                                <SelectTrigger className="h-9 rounded-xl text-xs font-bold bg-slate-50/50"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl font-bold">
                                    <SelectItem value="Available" className="text-xs">Available</SelectItem>
                                    <SelectItem value="Repair" className="text-xs">In Repair</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsRegisterOpen(false)} className="rounded-xl h-9 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button className="flex-1 bg-[#CB9DF0] hover:bg-[#b580e0] rounded-xl font-bold h-9 text-xs" onClick={handleRegister}>Add to Inventory</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-white rounded-xl border-2 border-slate-200 p-6 max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Edit Asset</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400">Update asset details. Assigned status can only be changed by returning the asset.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-3 py-3">
                        <div className="space-y-1 col-span-2">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Asset Name</Label>
                            <Input className="h-9 rounded-xl text-xs font-bold bg-slate-50/50" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                            {formErrors.name && <p className="text-[10px] font-bold text-rose-500 ml-1">{formErrors.name}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Category</Label>
                            <Select value={editForm.type} onValueChange={(v: InventoryAsset['type']) => setEditForm({ ...editForm, type: v })}>
                                <SelectTrigger className="h-9 rounded-xl text-xs font-bold bg-slate-50/50"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl font-bold">
                                    {TYPE_OPTIONS.map(t => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Condition</Label>
                            <Select value={editForm.condition} onValueChange={(v: InventoryAsset['condition']) => setEditForm({ ...editForm, condition: v })}>
                                <SelectTrigger className="h-9 rounded-xl text-xs font-bold bg-slate-50/50"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl font-bold">
                                    {CONDITION_OPTIONS.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Status</Label>
                            <Select value={editForm.status} onValueChange={(v: InventoryAsset['status']) => setEditForm({ ...editForm, status: v })}>
                                <SelectTrigger className="h-9 rounded-xl text-xs font-bold bg-slate-50/50"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl font-bold">
                                    {STATUS_OPTIONS.filter(s => s !== 'Assigned' || editForm.status === 'Assigned').map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl h-9 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold h-9 text-xs" onClick={handleEdit}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign Dialog */}
            <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                <DialogContent className="bg-white rounded-xl border-2 border-slate-200 p-6 max-w-md shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">Assign Inventory</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400">Allocate an available asset to an active/onboarding employee.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-3">
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Select Asset (Available Only)</Label>
                            <Select value={assignForm.assetId} onValueChange={v => setAssignForm({ ...assignForm, assetId: v })}>
                                <SelectTrigger className="rounded-xl h-9 text-xs font-bold bg-slate-50/50 border-slate-100"><SelectValue placeholder="Choose Asset..." /></SelectTrigger>
                                <SelectContent>
                                    {availableAssets.length === 0 ? (
                                        <div className="px-3 py-2 text-xs font-bold text-slate-400">No available assets</div>
                                    ) : availableAssets.map(a => (
                                        <SelectItem key={a.id} value={a.id} className="text-xs font-bold">{a.name} ({a.type})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold text-slate-700 ml-1">Assign To Employee</Label>
                            <Select value={assignForm.employeeId} onValueChange={v => setAssignForm({ ...assignForm, employeeId: v })}>
                                <SelectTrigger className="rounded-xl h-9 text-xs font-bold bg-slate-50/50 border-slate-100"><SelectValue placeholder="Choose Employee..." /></SelectTrigger>
                                <SelectContent>
                                    {eligibleEmployees.length === 0 ? (
                                        <div className="px-3 py-2 text-xs font-bold text-slate-400">No eligible employees</div>
                                    ) : eligibleEmployees.map(e => (
                                        <SelectItem key={e.id} value={e.id} className="text-xs font-bold">{e.name} ({e.role} - {e.department})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsAssignOpen(false)} className="rounded-xl h-9 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button className="flex-1 bg-[#CB9DF0] hover:bg-[#b580e0] rounded-xl font-bold h-9 text-xs" onClick={handleAssign}>Confirm Allocation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Delete Asset?</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">
                            {selectedAsset ? `Permanently remove "${selectedAsset.name}" (${selectedAsset.id}) from inventory. ${selectedAsset.status === 'Assigned' ? 'This asset is currently assigned — consider returning first.' : ''}` : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button onClick={handleDelete} className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-10 text-xs">Yes, Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* History / Details */}
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="bg-white rounded-xl border-2 border-slate-200 p-6 max-w-md shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                {selectedAsset?.type === 'Laptop' ? <Laptop size={20} /> : selectedAsset?.type === 'Mobile' ? <Smartphone size={20} /> : <Monitor size={20} />}
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold">{selectedAsset?.name}</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold text-slate-400">Status: {selectedAsset?.status} • ID: {selectedAsset?.id}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-[10px] font-bold">
                            <div className="space-y-1">
                                <p className="text-slate-400">Current Holder</p>
                                <p className="text-slate-900">{getEmployeeName(selectedAsset?.assignedTo)}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-slate-400">Condition</p>
                                <Badge variant="outline" className="border-slate-200 text-slate-600 text-[9px]">{selectedAsset?.condition}</Badge>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-900 flex items-center gap-2"><History size={12} className="text-indigo-500" /> Audit Log</h4>
                            <div className="max-h-40 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {selectedAsset?.history?.map((log, i) => (
                                    <div key={i} className="flex gap-3 relative pb-2 border-l border-slate-100 ml-1.5 pl-4 last:border-0 last:pb-0">
                                        <div className={`absolute left-[-4px] top-0 h-2 w-2 rounded-full border-2 border-white ${log.action === 'Assigned' ? 'bg-indigo-500' : 'bg-rose-500'}`} />
                                        <div className="flex-1 space-y-0.5">
                                            <p className="text-[10px] font-bold text-slate-900">{log.action === 'Assigned' ? 'Assigned to' : 'Returned by'} {log.employeeName}</p>
                                            <p className="text-[9px] font-bold text-slate-400">{log.date}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!selectedAsset?.history || selectedAsset.history.length === 0) && (
                                    <p className="text-[10px] text-slate-400 italic text-center py-4">No historical records available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <div className="flex gap-2 w-full">
                            {selectedAsset?.status !== 'Assigned' && (
                                <Button variant="outline" className="flex-1 rounded-xl h-9 text-[10px] font-bold border-slate-200" onClick={handleToggleRepair}>
                                    {selectedAsset?.status === 'Repair' ? 'Mark Fixed' : 'Send to Repair'}
                                </Button>
                            )}
                            <Button className="flex-1 bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-9 text-[10px] font-bold" onClick={() => setIsHistoryOpen(false)}>Close</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AssetAllocationPage;
