"use client";

import React, { useState, useMemo } from "react";
import {
    Copy,
    Play,
    Search,
    Filter,
    Users,
    Mail,
    Phone,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface DuplicateGroup {
    id: string;
    field: string;
    module: string;
    duplicates: number;
    example: string;
    confidence: number;
}

const initialDuplicateGroups: DuplicateGroup[] = [
    { id: "1", field: "Email", module: "Contacts", duplicates: 24, example: "john.doe@example.com", confidence: 100 },
    { id: "2", field: "Phone", module: "Leads", duplicates: 18, example: "+1 (555) 123-4567", confidence: 95 },
    { id: "3", field: "Company Name", module: "Accounts", duplicates: 12, example: "Acme Corporation", confidence: 85 },
    { id: "4", field: "Email", module: "Leads", duplicates: 8, example: "sarah.m@company.com", confidence: 100 },
];

export default function DeduplicationPage() {
    const [showScanModal, setShowScanModal] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>(initialDuplicateGroups);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredGroups = useMemo(() => {
        if (!searchQuery.trim()) return duplicateGroups;
        const q = searchQuery.toLowerCase();
        return duplicateGroups.filter(
            (g) =>
                g.field.toLowerCase().includes(q) ||
                g.module.toLowerCase().includes(q)
        );
    }, [duplicateGroups, searchQuery]);

    const totalDuplicates = useMemo(
        () => duplicateGroups.reduce((sum, g) => sum + g.duplicates, 0),
        [duplicateGroups]
    );

    const handleScan = () => {
        setScanning(true);
        setScanProgress(0);
        const interval = setInterval(() => {
            setScanProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setScanning(false);
                        setShowScanModal(false);
                        setScanProgress(0);
                        toast.success("Scan completed successfully");
                    }, 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const handleReview = (group: DuplicateGroup) => {
        toast.info(
            `Reviewing ${group.duplicates} duplicate records in ${group.module} matched by ${group.field} (e.g. "${group.example}", ${group.confidence}% confidence)`
        );
    };

    const handleMergeAll = (group: DuplicateGroup) => {
        setDuplicateGroups((prev) => prev.filter((g) => g.id !== group.id));
        toast.success(
            `Merged ${group.duplicates} duplicate ${group.field} records in ${group.module}`
        );
    };

    const handleViewMergeHistory = () => {
        toast.info("Merge history: 145 records merged in the last 30 days across all modules");
    };

    const handleFilter = () => {
        toast.info("Filter options: Module, Confidence level, Date range");
    };

    return (
        <div className="font-outfit space-y-6 text-[#1A1A1A]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                        Data Deduplication
                    </h1>
                    <p className="text-sm text-gray-600">
                        Identify and merge duplicate records to maintain data quality.
                    </p>
                </div>
                <Button
                    onClick={() => setShowScanModal(true)}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                >
                    <Play size={16} /> Run Scan
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-xl">
                    <p className="text-xs font-semibold text-white">Total Duplicates</p>
                    <h2 className="text-xl font-semibold text-white">{totalDuplicates}</h2>
                    <p className="text-[10px] mt-1 opacity-80">Across all modules</p>
                </div>

                <div className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-xl">
                    <p className="text-xs text-gray-600">Records Merged</p>
                    <h3 className="text-xl font-semibold text-gray-900">145</h3>
                    <p className="text-[10px] text-green-600 mt-1">Last 30 days</p>
                </div>

                <div className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-xl">
                    <p className="text-xs text-gray-600">Data Quality</p>
                    <h3 className="text-xl font-semibold text-gray-900">96.8%</h3>
                    <p className="text-[10px] text-blue-600 mt-1">Improved by 4.2%</p>
                </div>

                <div className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6 rounded-xl">
                    <p className="text-xs text-gray-600">Last Scan</p>
                    <h3 className="text-xl font-semibold text-gray-900">2 hours ago</h3>
                    <p className="text-[10px] text-gray-600 mt-1">Automated daily</p>
                </div>
            </div>

            {/* Duplicate Groups */}
            <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-50/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search duplicates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 rounded-lg border-zinc-200 h-9 text-sm bg-white"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button
                            variant="outline"
                            onClick={handleFilter}
                            className="rounded-xl border-zinc-200 h-9 text-sm gap-2 font-semibold bg-white flex-1 md:flex-none"
                        >
                            <Filter size={14} /> Filter
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Duplicate Field</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Module</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Count</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Example Value</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Confidence</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredGroups.map((group) => (
                                <tr key={group.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                                {group.field === "Email" ? (
                                                    <Mail size={18} />
                                                ) : group.field === "Phone" ? (
                                                    <Phone size={18} />
                                                ) : (
                                                    <Users size={18} />
                                                )}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{group.field}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-[10px] font-semibold px-2 py-0.5">
                                            {group.module}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Copy size={14} className="text-orange-500" />
                                            <span className="text-sm font-semibold text-gray-900">
                                                {group.duplicates} records
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700 font-mono">{group.example}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Progress value={group.confidence} className="h-2 rounded-lg w-20 bg-zinc-100" />
                                            <span
                                                className={`text-xs font-semibold ${
                                                    group.confidence === 100
                                                        ? "text-green-600"
                                                        : group.confidence >= 90
                                                        ? "text-blue-600"
                                                        : "text-amber-600"
                                                }`}
                                            >
                                                {group.confidence}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleReview(group)}
                                                className="rounded-xl border-zinc-200 h-8 text-xs px-3 font-semibold"
                                            >
                                                Review
                                            </Button>
                                            <Button
                                                onClick={() => handleMergeAll(group)}
                                                className="rounded-xl bg-green-600 hover:bg-green-700 h-8 text-xs px-3 text-white font-semibold"
                                            >
                                                Merge All
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredGroups.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                                        {duplicateGroups.length === 0
                                            ? "No duplicate groups remaining. All records have been merged."
                                            : "No duplicate groups match your search."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing {filteredGroups.length} of {duplicateGroups.length} duplicate groups
                    </p>
                    <Button
                        variant="link"
                        onClick={handleViewMergeHistory}
                        className="text-blue-600 text-sm flex items-center gap-1 font-semibold group"
                    >
                        View Merge History{" "}
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Scan Modal */}
            <Dialog open={showScanModal} onOpenChange={setShowScanModal}>
                <DialogContent className="max-w-2xl rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Copy size={80} />
                        </div>
                        <h2 className="text-xl font-semibold flex items-center gap-3">
                            <Play size={20} /> Run Duplicate Scan
                        </h2>
                        <p className="text-sm opacity-80 mt-1">
                            Scan your database for duplicate records.
                        </p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-semibold text-gray-600">Select Module to Scan</Label>
                            <Select>
                                <SelectTrigger className="rounded-lg border-zinc-200 h-9">
                                    <SelectValue placeholder="Choose module" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="all">All Modules</SelectItem>
                                    <SelectItem value="contacts">Contacts</SelectItem>
                                    <SelectItem value="leads">Leads</SelectItem>
                                    <SelectItem value="accounts">Accounts</SelectItem>
                                    <SelectItem value="deals">Deals</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-semibold text-gray-600">Match Criteria</Label>
                            <div className="grid grid-cols-2 gap-3">
                                {["Email", "Phone", "Name", "Company"].map((field) => (
                                    <label
                                        key={field}
                                        className="flex items-center gap-2 p-3 border border-zinc-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all"
                                    >
                                        <input type="checkbox" defaultChecked className="rounded-lg" />
                                        <span className="text-sm font-semibold text-gray-700">{field}</span>
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
                                <Progress value={scanProgress} className="h-2 rounded-lg" />
                            </div>
                        )}
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setShowScanModal(false)}
                            className="rounded-xl text-sm text-gray-600 font-semibold"
                            disabled={scanning}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleScan}
                            disabled={scanning}
                            className="bg-blue-600 hover:bg-blue-700 rounded-xl text-sm px-10 h-9 shadow-xl shadow-blue-100 font-semibold"
                        >
                            {scanning ? "Scanning..." : "Start Scan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
