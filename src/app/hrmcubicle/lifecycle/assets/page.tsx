"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Laptop,
    Monitor,
    Smartphone,
    MousePointer2,
    Search,
    Filter,
    Plus,
    RefreshCw,
    CheckCircle2,
    Users,
    History,
    MoreVertical,
    Trash,
    User
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore } from "@/shared/data/lifecycle-store";
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

const AssetAllocationPage = () => {
    const { toast } = useToast();
    const { assets, employees, newHires, assignAsset, returnAsset, addAsset, deleteAsset, updateAsset } = useLifecycleStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");

    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedAssetForHistory, setSelectedAssetForHistory] = useState<any>(null);

    const [selectedAssetId, setSelectedAssetId] = useState("");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

    const [newAssetForm, setNewAssetForm] = useState({
        id: "", name: "", type: "Laptop" as any, condition: "Excellent" as any, status: "Available" as any
    });

    // Stats
    const totalAssets = assets.length;
    const assignedCount = assets.filter(a => a.status === 'Assigned').length;
    const availableCount = assets.filter(a => a.status === 'Available').length;
    const repairCount = assets.filter(a => a.status === 'Repair').length;

    const stats = [
        { label: "Total Assets", value: totalAssets, color: "bg-[#CB9DF0]", textColor: "text-slate-900" },
        { label: "Assigned", value: assignedCount, color: "bg-[#F0C1E1]", textColor: "text-slate-900" },
        { label: "Available", value: availableCount, color: "bg-[#FFF9BF]", textColor: "text-slate-900" },
        { label: "In Repair", value: repairCount, color: "bg-[#FDDBBB]", textColor: "text-slate-900" },
    ];

    const handleAssign = () => {
        const asset = assets.find(a => a.id === selectedAssetId);
        const employee = employees.find(e => e.id === selectedEmployeeId) || newHires.find(h => h.id === selectedEmployeeId);

        if (!asset || !employee) {
            toast({ title: "Error", description: "Select both asset and employee", variant: "destructive" });
            return;
        }

        assignAsset(selectedAssetId, selectedEmployeeId, employee.name);
        setIsAssignDialogOpen(false);
        setSelectedAssetId("");
        setSelectedEmployeeId("");
        toast({ title: "Asset Assigned", description: `${asset.name} allocated to ${employee.name}.` });
    };

    const handleRegister = () => {
        if (!newAssetForm.id || !newAssetForm.name) {
            toast({ title: "Error", description: "Asset ID and Name are required", variant: "destructive" });
            return;
        }
        addAsset(newAssetForm);
        setNewAssetForm({ id: "", name: "", type: "Laptop", condition: "Excellent", status: "Available" });
        setIsRegisterDialogOpen(false);
        toast({ title: "Registered", description: "New item added to inventory master." });
    };

    const handleReturn = (e: React.MouseEvent, assetId: string) => {
        e.stopPropagation();
        returnAsset(assetId);
        toast({ title: "Asset Returned", description: "Marked as Available in inventory." });
    };

    const getEmployeeName = (id?: string) => {
        if (!id) return "Unassigned";
        const emp = employees.find(e => e.id === id) || newHires.find(h => h.id === id);
        return emp ? emp.name : "Unknown";
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Asset Allocation</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 3: Manage inventory and employee assignments.</p>
                </div>

                <div className="flex gap-2">
                    <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-xl h-9 px-4 border-slate-200 text-slate-500 font-bold text-[10px] hover:bg-slate-50">
                                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Register Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-xl border border-slate-100 p-6 max-w-sm shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold">Register New Asset</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold text-slate-400">Add a new device to the company inventory.</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-3 py-3">
                                <div className="space-y-1 col-span-2">
                                    <Label className="text-[11px] font-bold text-slate-700 ml-1">Asset Name</Label>
                                    <Input
                                        placeholder="e.g. MacBook Pro M3"
                                        className="h-9 rounded-xl text-xs font-bold bg-slate-50/50"
                                        value={newAssetForm.name}
                                        onChange={e => setNewAssetForm({ ...newAssetForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[11px] font-bold text-slate-700 ml-1">Asset ID / S/N</Label>
                                    <Input
                                        placeholder="ASST-00X"
                                        className="h-9 rounded-xl text-xs font-bold bg-slate-50/50"
                                        value={newAssetForm.id}
                                        onChange={e => setNewAssetForm({ ...newAssetForm, id: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[11px] font-bold text-slate-700 ml-1">Category</Label>
                                    <Select value={newAssetForm.type} onValueChange={(v: any) => setNewAssetForm({ ...newAssetForm, type: v })}>
                                        <SelectTrigger className="h-9 rounded-xl text-xs font-bold bg-slate-50/50"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl font-bold">
                                            <SelectItem value="Laptop" className="text-xs">Laptop</SelectItem>
                                            <SelectItem value="Mobile" className="text-xs">Mobile</SelectItem>
                                            <SelectItem value="Monitor" className="text-xs">Monitor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="w-full bg-[#CB9DF0] hover:bg-[#b580e0] rounded-xl font-bold h-9 text-xs" onClick={handleRegister}>Add to Inventory</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-9 px-4 shadow-sm font-bold text-[10px]">
                                <Plus className="mr-1.5 h-3.5 w-3.5" /> Assign Asset
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white rounded-xl border border-slate-100 p-6 max-w-sm shadow-2xl">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-bold">Assign Inventory</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold text-slate-400">Allocate an available asset to an active/onboarding employee.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 py-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-700 ml-1">Select Asset (Available Only)</Label>
                                    <Select onValueChange={setSelectedAssetId}>
                                        <SelectTrigger className="rounded-xl h-9 text-xs font-bold bg-slate-50/50 border-slate-100">
                                            <SelectValue placeholder="Choose Asset..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {assets.filter(a => a.status === 'Available').map(a => (
                                                <SelectItem key={a.id} value={a.id} className="text-xs font-bold">{a.name} ({a.type})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-bold text-slate-700 ml-1">Assign To Employee</Label>
                                    <Select onValueChange={setSelectedEmployeeId}>
                                        <SelectTrigger className="rounded-xl h-9 text-xs font-bold bg-slate-50/50 border-slate-100">
                                            <SelectValue placeholder="Choose Employee..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[
                                                ...employees.filter(e => e.status === 'Active' || e.status === 'Probation'),
                                                ...newHires.filter(h => h.status === 'Onboarding' || h.status === 'Pre-boarding')
                                            ].map(e => (
                                                <SelectItem key={e.id} value={e.id} className="text-xs font-bold">
                                                    {e.name} ({'role' in e ? e.role : (e as any).position} - {e.department})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="w-full bg-[#CB9DF0] hover:bg-[#b580e0] rounded-xl font-bold h-9 text-xs" onClick={handleAssign}>Confirm Allocation</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm hover:shadow-md transition-all rounded-xl ${stat.color} p-4 relative overflow-hidden group h-24`}>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <p className={`text-[10px] font-bold ${stat.textColor || 'text-white/80'}`}>{stat.label}</p>
                                <h3 className={`text-2xl font-bold ${stat.textColor || 'text-white'}`}>{stat.value}</h3>
                            </div>
                            <div className="absolute -right-2 -bottom-2 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                                <Laptop size={48} />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="border border-slate-200 shadow-sm rounded-xl bg-white overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between gap-4 items-center">
                    <div className="flex items-center gap-4">
                        <h2 className="text-sm font-bold text-slate-900">Inventory Master</h2>
                        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                            {["All", "Laptop", "Mobile", "Monitor"].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterType(cat)}
                                    className={`px-3 py-1 rounded-lg text-[9px] font-bold transition-all ${filterType === cat ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
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
                            <Input
                                placeholder="Search inventory..."
                                className="pl-9 h-9 rounded-xl bg-slate-50 border-slate-200 font-bold text-[10px]"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#FFF9BF]/30">
                            <tr className="text-[10px] font-bold text-slate-600 border-b border-[#FFF9BF]">
                                <th className="px-4 py-1">Asset Details</th>
                                <th className="px-4 py-1">Assigned To</th>
                                <th className="px-4 py-1">Status</th>
                                <th className="px-4 py-1">Condition</th>
                                <th className="px-4 py-1 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-bold text-slate-600">
                            {assets
                                .filter(a => {
                                    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase());
                                    const matchesType = filterType === "All" || a.type === filterType;
                                    const matchesStatus = filterStatus === "All" || a.status === filterStatus;
                                    return matchesSearch && matchesType && matchesStatus;
                                })
                                .map((asset) => (
                                    <tr
                                        key={asset.id}
                                        onClick={() => { setSelectedAssetForHistory(asset); setIsHistoryOpen(true); }}
                                        className="group hover:bg-slate-50/50 cursor-pointer transition-colors border-b border-slate-200 last:border-0 h-8"
                                    >
                                        <td className="px-4 py-1">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#CB9DF0]/10 group-hover:text-[#9d5ccf] transition-colors">
                                                    {asset.type === 'Laptop' ? <Laptop size={12} /> : asset.type === 'Mobile' ? <Smartphone size={12} /> : <Monitor size={12} />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 group-hover:text-[#9d5ccf] text-[10px] leading-tight">{asset.name}</h4>
                                                    <p className="text-[7px] text-slate-400 font-bold font-mono tracking-tight leading-none">{asset.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-1">
                                            {asset.assignedTo ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 rounded-full bg-[#F0C1E1] text-white flex items-center justify-center text-[7px] font-bold">
                                                        <User size={8} />
                                                    </div>
                                                    <span className="font-bold text-slate-700 text-[10px]">{getEmployeeName(asset.assignedTo)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-[10px] italic font-medium">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-1">
                                            <Badge className={`border-none font-bold text-[8px] h-4 px-1.5 ${asset.status === 'Assigned' ? 'bg-[#CB9DF0] text-white' :
                                                asset.status === 'Available' ? 'bg-[#FFF9BF] text-slate-700' : 'bg-[#FDDBBB] text-amber-800'
                                                }`}>
                                                {asset.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-1 font-bold text-slate-500 text-[10px]">{asset.condition}</td>
                                        <td className="px-4 py-1 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {asset.status === 'Assigned' ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-5 rounded-lg border-slate-200 text-rose-500 hover:bg-rose-50 font-bold text-[8px] px-2"
                                                        onClick={(e) => handleReturn(e, asset.id)}
                                                    >
                                                        Return
                                                    </Button>
                                                ) : (
                                                    <span className="text-[9px] text-slate-300 font-bold">--</span>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 p-0 text-slate-300 hover:text-rose-500"
                                                    onClick={(e) => { e.stopPropagation(); deleteAsset(asset.id); toast({ title: "Deleted", description: "Asset removed from inventory." }); }}
                                                >
                                                    <Trash size={10} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    {assets.length === 0 && (
                        <div className="h-24 flex items-center justify-center text-slate-400 text-xs font-bold">No assets found in inventory.</div>
                    )}
                </div>
            </Card>

            {/* Asset Details & History Modal */}
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="bg-white rounded-xl border border-slate-100 p-6 max-w-md shadow-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                {selectedAssetForHistory?.type === 'Laptop' ? <Laptop size={20} /> : <Smartphone size={20} />}
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold">{selectedAssetForHistory?.name}</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold text-slate-400">Inventory Status: {selectedAssetForHistory?.status} • ID: {selectedAssetForHistory?.id}</DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-[10px] font-bold">
                            <div className="space-y-1">
                                <p className="text-slate-400">Current Holder</p>
                                <p className="text-slate-900">{getEmployeeName(selectedAssetForHistory?.assignedTo)}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-slate-400">Condition</p>
                                <Badge variant="outline" className="border-slate-200 text-slate-600 text-[8px]">{selectedAssetForHistory?.condition}</Badge>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[11px] font-bold text-slate-900 flex items-center gap-2">
                                <History size={12} className="text-indigo-500" /> Audit Log (Life Cycle)
                            </h4>
                            <div className="max-h-40 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                {selectedAssetForHistory?.history?.map((log: any, i: number) => (
                                    <div key={i} className="flex gap-3 relative pb-2 border-l border-slate-100 ml-1.5 pl-4 last:border-0 last:pb-0">
                                        <div className={`absolute left-[-4px] top-0 h-2 w-2 rounded-full border-2 border-white ${log.action === 'Assigned' ? 'bg-indigo-500' : 'bg-rose-500'}`} />
                                        <div className="flex-1 space-y-0.5">
                                            <p className="text-[10px] font-bold text-slate-900">{log.action === 'Assigned' ? 'Assigned to' : 'Returned by'} {log.employeeName}</p>
                                            <p className="text-[9px] font-bold text-slate-400">{log.date}</p>
                                        </div>
                                    </div>
                                ))}
                                {(!selectedAssetForHistory?.history || selectedAssetForHistory.history.length === 0) && (
                                    <p className="text-[10px] text-slate-400 italic text-center py-4">No historical records available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <div className="flex gap-2 w-full">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-xl h-9 text-[10px] font-bold border-slate-200"
                                onClick={() => {
                                    const nextStatus = selectedAssetForHistory?.status === 'Repair' ? 'Available' : 'Repair';
                                    updateAsset(selectedAssetForHistory.id, { status: nextStatus });
                                    setIsHistoryOpen(false);
                                    toast({ title: "Status Updated", description: `Marked as ${nextStatus}.` });
                                }}
                            >
                                {selectedAssetForHistory?.status === 'Repair' ? 'Fixed' : 'Send to Repair'}
                            </Button>
                            <Button className="flex-1 bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-9 text-[10px] font-bold" onClick={() => setIsHistoryOpen(false)}>Close View</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AssetAllocationPage;
