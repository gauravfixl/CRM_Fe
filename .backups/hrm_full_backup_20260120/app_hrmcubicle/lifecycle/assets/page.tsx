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
    User,
    CheckCircle2,
    Users
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
    const { assets, employees, assignAsset, returnAsset } = useLifecycleStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

    const [selectedAssetId, setSelectedAssetId] = useState("");
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

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
        if (!selectedAssetId || !selectedEmployeeId) {
            toast({ title: "Error", description: "Select both asset and employee", variant: "destructive" });
            return;
        }
        assignAsset(selectedAssetId, selectedEmployeeId);
        setIsAssignDialogOpen(false);
        setSelectedAssetId("");
        setSelectedEmployeeId("");
        toast({ title: "Asset Assigned", description: "Inventory updated successfully." });
    };

    const handleReturn = (assetId: string) => {
        returnAsset(assetId);
        toast({ title: "Asset Returned", description: "Marked as Available in inventory." });
    };

    const getEmployeeName = (id?: string) => {
        if (!id) return "Unassigned";
        const emp = employees.find(e => e.id === id);
        return emp ? emp.name : "Unknown";
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Asset Allocation</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Stage 3: Manage inventory and employee assignments.</p>
                </div>

                <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-xl shadow-[#CB9DF0]/30 font-bold">
                            <Plus className="mr-2 h-5 w-5" /> Assign Asset
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                        <DialogHeader>
                            <DialogTitle>Assign Inventory</DialogTitle>
                            <DialogDescription>allocate an available asset to an active/onboarding employee.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Select Asset (Available Only)</Label>
                                <Select onValueChange={setSelectedAssetId}>
                                    <SelectTrigger className="rounded-xl h-12">
                                        <SelectValue placeholder="Choose Asset..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {assets.filter(a => a.status === 'Available').map(a => (
                                            <SelectItem key={a.id} value={a.id}>{a.name} ({a.type})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Assign To Employee</Label>
                                <Select onValueChange={setSelectedEmployeeId}>
                                    <SelectTrigger className="rounded-xl h-12">
                                        <SelectValue placeholder="Choose Employee..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.filter(e => e.status === 'Active' || e.status === 'Onboarding').map(e => (
                                            <SelectItem key={e.id} value={e.id}>{e.name} ({e.department})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-[#CB9DF0] hover:bg-[#b580e0] rounded-xl font-bold h-12" onClick={handleAssign}>Confirm Allocation</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 relative overflow-hidden group`}>
                            <div className="relative z-10">
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor || 'text-white/80'}`}>{stat.label}</p>
                                <h3 className={`text-3xl font-black mt-2 ${stat.textColor || 'text-white'}`}>{stat.value}</h3>
                            </div>
                            <div className="absolute top-0 right-0 p-8 opacity-10 transform rotate-12 group-hover:scale-125 transition-transform duration-500">
                                <Laptop size={64} />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900">Inventory Master</h2>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Search Inventory..."
                            className="pl-12 h-12 rounded-xl bg-slate-50 border-none font-medium"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#FFF9BF]/20">
                            <tr className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-[#FFF9BF]/50">
                                <th className="p-6">Asset Details</th>
                                <th className="p-6">Assigned To</th>
                                <th className="p-6">Status</th>
                                <th className="p-6">Condition</th>
                                <th className="p-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-slate-600">
                            {assets.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((asset) => (
                                <tr key={asset.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#CB9DF0]/10 group-hover:text-[#9d5ccf] transition-colors">
                                                {asset.type === 'Laptop' ? <Laptop size={20} /> : asset.type === 'Mobile' ? <Smartphone size={20} /> : <Monitor size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 group-hover:text-[#9d5ccf]">{asset.name}</h4>
                                                <p className="text-xs text-slate-400 font-bold font-mono uppercase tracking-wider">{asset.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        {asset.assignedTo ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-[#F0C1E1] text-white flex items-center justify-center text-[10px] font-bold">
                                                    <User size={12} />
                                                </div>
                                                <span className="font-bold text-slate-700">{getEmployeeName(asset.assignedTo)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        <Badge className={`border-none font-bold ${asset.status === 'Assigned' ? 'bg-[#CB9DF0] text-white' :
                                            asset.status === 'Available' ? 'bg-[#FFF9BF] text-slate-700' : 'bg-[#FDDBBB] text-amber-800'
                                            }`}>
                                            {asset.status}
                                        </Badge>
                                    </td>
                                    <td className="p-6 font-bold text-slate-500">{asset.condition}</td>
                                    <td className="p-6 text-right">
                                        {asset.status === 'Assigned' ? (
                                            <Button variant="outline" size="sm" className="rounded-lg border-slate-200 text-rose-500 hover:bg-rose-50 font-bold" onClick={() => handleReturn(asset.id)}>
                                                Return
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-slate-300 font-bold">--</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AssetAllocationPage;
