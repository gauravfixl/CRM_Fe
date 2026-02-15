"use client";

import React, { useState } from "react";
import {
    Copy,
    Play,
    Trash2,
    Search,
    Filter,
    AlertTriangle,
    CheckCircle2,
    Users,
    Mail,
    Phone,
    ChevronRight,
    Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

export default function DeduplicationPage() {
    const [showScanModal, setShowScanModal] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);

    const duplicateGroups = [
        { id: "1", field: "Email", module: "Contacts", duplicates: 24, example: "john.doe@example.com", confidence: 100 },
        { id: "2", field: "Phone", module: "Leads", duplicates: 18, example: "+1 (555) 123-4567", confidence: 95 },
        { id: "3", field: "Company Name", module: "Accounts", duplicates: 12, example: "Acme Corporation", confidence: 85 },
        { id: "4", field: "Email", module: "Leads", duplicates: 8, example: "sarah.m@company.com", confidence: 100 },
    ];

    const handleScan = () => {
        setScanning(true);
        setScanProgress(0);
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setScanning(false);
                        setShowScanModal(false);
                        setScanProgress(0);
                    }, 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Data Deduplication</h1>
                    <p className="text-sm text-gray-600">Identify and merge duplicate records to maintain data quality.</p>
                </div>
                <Button
                    onClick={() => setShowScanModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                >
                    <Play size={16} /> Run Scan
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Duplicates</p>
                    <h2 className="text-white text-2xl font-bold">62</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Across all modules</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Records Merged</p>
                    <h3 className="text-2xl font-bold text-gray-900">145</h3>
                    <p className="text-green-600 text-xs mt-1">Last 30 days</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Data Quality</p>
                    <h3 className="text-2xl font-bold text-gray-900">96.8%</h3>
                    <p className="text-blue-600 text-xs mt-1">Improved by 4.2%</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Last Scan</p>
                    <h3 className="text-2xl font-bold text-gray-900">2 hours ago</h3>
                    <p className="text-gray-600 text-xs mt-1">Automated daily</p>
                </div>
            </div>

            {/* Duplicate Groups */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search duplicates..."
                            className="pl-11 rounded-none border-zinc-200 h-10 text-sm bg-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="rounded-none border-zinc-200 h-10 text-sm gap-2 bg-white flex-1 md:flex-none">
                            <Filter size={14} /> Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Duplicate Field</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Module</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Count</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Example Value</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Confidence</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {duplicateGroups.map((group) => (
                                <tr key={group.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-50 text-orange-600 rounded-none border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                                {group.field === "Email" ? <Mail size={18} /> : group.field === "Phone" ? <Phone size={18} /> : <Users size={18} />}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{group.field}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {group.module}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Copy size={14} className="text-orange-500" />
                                            <span className="text-sm font-bold text-gray-900">{group.duplicates} records</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700 font-mono">{group.example}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Progress value={group.confidence} className="h-2 rounded-none w-20 bg-zinc-100" />
                                            <span className={`text-xs font-bold ${group.confidence === 100 ? 'text-green-600' : group.confidence >= 90 ? 'text-blue-600' : 'text-amber-600'}`}>
                                                {group.confidence}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="outline" className="rounded-none border-zinc-200 h-8 text-xs px-3">
                                                Review
                                            </Button>
                                            <Button className="rounded-none bg-green-600 hover:bg-green-700 h-8 text-xs px-3 text-white">
                                                Merge All
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {duplicateGroups.length} duplicate groups</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View Merge History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Scan Modal */}
            <Dialog open={showScanModal} onOpenChange={setShowScanModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-orange-600 to-red-700 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Copy size={80} />
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Play size={24} /> Run Duplicate Scan
                        </h2>
                        <p className="text-sm opacity-80 mt-2">Scan your database for duplicate records.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Select Module to Scan</Label>
                            <Select>
                                <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                    <SelectValue placeholder="Choose module" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Modules</SelectItem>
                                    <SelectItem value="contacts">Contacts</SelectItem>
                                    <SelectItem value="leads">Leads</SelectItem>
                                    <SelectItem value="accounts">Accounts</SelectItem>
                                    <SelectItem value="deals">Deals</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Match Criteria</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {["Email", "Phone", "Name", "Company"].map((field) => (
                                    <label key={field} className="flex items-center gap-2 p-3 border border-zinc-200 rounded-none cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                                        <input type="checkbox" defaultChecked className="rounded-none" />
                                        <span className="text-sm font-bold text-gray-700">{field}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        {scanning && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Scanning database...</span>
                                    <span>{scanProgress}%</span>
                                </div>
                                <Progress value={scanProgress} className="h-2 rounded-none" />
                            </div>
                        )}
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowScanModal(false)} className="rounded-none text-sm text-gray-600" disabled={scanning}>
                            Cancel
                        </Button>
                        <Button onClick={handleScan} disabled={scanning} className="bg-orange-600 hover:bg-orange-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-orange-100">
                            {scanning ? "Scanning..." : "Start Scan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
