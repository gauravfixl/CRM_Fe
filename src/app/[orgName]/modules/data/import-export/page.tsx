"use client";

import React, { useState } from "react";
import {
    Download,
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    Clock,
    ChevronRight,
    Database,
    FileSpreadsheet,
    Users,
    Briefcase,
    Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function ImportExportPage() {
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);

    const recentOperations = [
        { id: "1", type: "Export", module: "Leads", records: "1,204", status: "Completed", time: "2 mins ago", user: "Admin" },
        { id: "2", type: "Import", module: "Contacts", records: "856", status: "Completed", time: "15 mins ago", user: "Sarah M." },
        { id: "3", type: "Export", module: "Deals", records: "342", status: "Completed", time: "1 hour ago", user: "Admin" },
        { id: "4", type: "Import", module: "Products", records: "120", status: "Failed", time: "2 hours ago", user: "John D." },
    ];

    const dataModules = [
        { name: "Leads", icon: Users, count: "2,847", color: "text-blue-600", bg: "bg-blue-50" },
        { name: "Contacts", icon: Users, count: "1,523", color: "text-indigo-600", bg: "bg-indigo-50" },
        { name: "Deals", icon: Briefcase, count: "456", color: "text-green-600", bg: "bg-green-50" },
        { name: "Products", icon: Package, count: "892", color: "text-purple-600", bg: "bg-purple-50" },
    ];

    const handleImport = () => {
        setImporting(true);
        setImportProgress(0);
        const interval = setInterval(() => {
            setImportProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setImporting(false);
                        setShowImportModal(false);
                        setImportProgress(0);
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
                    <h1 className="text-[22px] font-bold tracking-tight">Import / Export Data</h1>
                    <p className="text-sm text-gray-600">Bulk transfer data between your CRM and external systems.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setShowImportModal(true)}
                        variant="outline"
                        className="rounded-none border-zinc-200 font-black text-sm h-11 gap-2 bg-white shadow-lg"
                    >
                        <Upload size={16} /> Import Data
                    </Button>
                    <Button
                        onClick={() => setShowExportModal(true)}
                        className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                    >
                        <Download size={16} /> Export Data
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-700 to-indigo-800 p-6 rounded-none shadow-xl shadow-blue-200 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <p className="text-white text-sm opacity-80">Total Operations</p>
                    <h2 className="text-white text-2xl font-bold">142</h2>
                    <p className="text-white text-xs mt-1 opacity-80">Last 30 days</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Records Imported</p>
                    <h3 className="text-2xl font-bold text-gray-900">12,450</h3>
                    <p className="text-green-600 text-xs mt-1">This month</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Records Exported</p>
                    <h3 className="text-2xl font-bold text-gray-900">8,920</h3>
                    <p className="text-blue-600 text-xs mt-1">This month</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <p className="text-gray-600 text-sm">Success Rate</p>
                    <h3 className="text-2xl font-bold text-gray-900">97.2%</h3>
                    <p className="text-green-600 text-xs mt-1">Excellent quality</p>
                </div>
            </div>

            {/* Data Modules */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Available Data Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dataModules.map((module, idx) => (
                        <div key={idx} className="p-4 border border-zinc-200 rounded-none hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`${module.bg} ${module.color} p-2 rounded-none`}>
                                    <module.icon size={20} />
                                </div>
                                <span className="text-sm font-bold text-gray-900">{module.name}</span>
                            </div>
                            <p className="text-xs text-gray-600">{module.count} records</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Operations */}
            <div className="bg-white border border-zinc-200 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Recent Operations</h3>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                        Live
                    </Badge>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Module</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Records</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-600">User</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {recentOperations.map((op) => (
                                <tr key={op.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {op.type === "Import" ? (
                                                <Upload size={16} className="text-green-600" />
                                            ) : (
                                                <Download size={16} className="text-blue-600" />
                                            )}
                                            <span className="text-sm font-bold text-gray-900">{op.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-zinc-100 text-zinc-700 border-zinc-200 rounded-none text-[10px] font-bold px-2 py-0.5">
                                            {op.module}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900">{op.records}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {op.status === "Completed" ? (
                                                <CheckCircle2 size={14} className="text-green-600" />
                                            ) : (
                                                <AlertCircle size={14} className="text-red-600" />
                                            )}
                                            <span className={`text-xs font-bold ${op.status === "Completed" ? "text-green-600" : "text-red-600"}`}>
                                                {op.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Clock size={12} /> {op.time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700">{op.user}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {recentOperations.length} recent operations</p>
                    <Button variant="link" className="text-blue-600 text-sm flex items-center gap-1 group">
                        View All History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Import Modal */}
            <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-green-700 to-emerald-800 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Upload size={80} />
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Upload size={24} /> Import Data
                        </h2>
                        <p className="text-sm opacity-80 mt-2">Upload CSV or Excel file to import records into your CRM.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Select Module</Label>
                            <Select>
                                <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                    <SelectValue placeholder="Choose data module" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="leads">Leads</SelectItem>
                                    <SelectItem value="contacts">Contacts</SelectItem>
                                    <SelectItem value="deals">Deals</SelectItem>
                                    <SelectItem value="products">Products</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Upload File</Label>
                            <div className="border-2 border-dashed border-zinc-300 rounded-none p-8 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer">
                                <FileSpreadsheet size={40} className="mx-auto text-zinc-400 mb-3" />
                                <p className="text-sm font-bold text-gray-900 mb-1">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500">CSV, XLSX (Max 10MB)</p>
                            </div>
                        </div>
                        {importing && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Importing records...</span>
                                    <span>{importProgress}%</span>
                                </div>
                                <Progress value={importProgress} className="h-2 rounded-none" />
                            </div>
                        )}
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowImportModal(false)} className="rounded-none text-sm text-gray-600" disabled={importing}>
                            Cancel
                        </Button>
                        <Button onClick={handleImport} disabled={importing} className="bg-green-600 hover:bg-green-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-green-100">
                            {importing ? "Importing..." : "Start Import"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Export Modal */}
            <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
                <DialogContent className="max-w-2xl rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Download size={80} />
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Download size={24} /> Export Data
                        </h2>
                        <p className="text-sm opacity-80 mt-2">Download your CRM data in CSV or Excel format.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Select Module</Label>
                            <Select>
                                <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                    <SelectValue placeholder="Choose data module" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="leads">Leads (2,847 records)</SelectItem>
                                    <SelectItem value="contacts">Contacts (1,523 records)</SelectItem>
                                    <SelectItem value="deals">Deals (456 records)</SelectItem>
                                    <SelectItem value="products">Products (892 records)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold text-gray-600">Export Format</Label>
                            <Select defaultValue="csv">
                                <SelectTrigger className="rounded-none border-zinc-200 h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowExportModal(false)} className="rounded-none text-sm text-gray-600">
                            Cancel
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-none text-sm px-10 h-12 shadow-xl shadow-blue-100">
                            Download Export
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
