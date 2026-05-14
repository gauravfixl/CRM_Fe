"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
    Package,
    Loader2,
} from "lucide-react";
import { listDataJobs, createDataJob } from "@/hooks/orgAdminHooks";
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
import { toast } from "sonner";

interface DataJob {
    id: string;
    type: string;
    module: string;
    records: string;
    status: string;
    time: string;
    user: string;
}

export default function ImportExportPage() {
    const router = useRouter();
    const params = useParams();
    const orgName = (params?.orgName as string) || "";

    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);

    const [recentOperations, setRecentOperations] = useState<DataJob[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [importModule, setImportModule] = useState<string>("");
    const [exportModule, setExportModule] = useState<string>("");
    const [exportFormat, setExportFormat] = useState<string>("csv");

    const formatRelativeTime = (value: any): string => {
        if (!value) return "—";
        try {
            const diffMs = Date.now() - new Date(value).getTime();
            const diffMin = Math.floor(diffMs / 60000);
            if (diffMin < 1) return "Just now";
            if (diffMin < 60) return `${diffMin} mins ago`;
            const diffH = Math.floor(diffMin / 60);
            if (diffH < 24) return `${diffH} hour${diffH > 1 ? "s" : ""} ago`;
            const diffD = Math.floor(diffH / 24);
            return `${diffD} day${diffD > 1 ? "s" : ""} ago`;
        } catch {
            return "—";
        }
    };

    const normalizeJob = (raw: any): DataJob => ({
        id: raw?._id || raw?.id || "",
        type: raw?.type || raw?.operation || "Export",
        module: raw?.module || raw?.entity || "—",
        records: (raw?.records || raw?.recordCount || 0).toLocaleString(),
        status: raw?.status || "Pending",
        time: formatRelativeTime(raw?.createdAt || raw?.startedAt),
        user: raw?.user?.name || raw?.createdBy?.name || raw?.createdBy || "Admin",
    });

    const fetchJobs = async () => {
        try {
            setLoadingJobs(true);
            const res = await listDataJobs();
            const data = res?.data?.jobs || res?.data?.data || res?.data || [];
            const list = Array.isArray(data) ? data : [];
            setRecentOperations(list.map(normalizeJob));
        } catch (err: any) {
            console.error("Failed to load data jobs:", err);
            toast.error(err?.response?.data?.message || "Failed to load recent operations");
            setRecentOperations([]);
        } finally {
            setLoadingJobs(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const dataModules = [
        { name: "Leads", icon: Users, count: "2,847", color: "text-blue-600", bg: "bg-blue-50" },
        { name: "Contacts", icon: Users, count: "1,523", color: "text-indigo-600", bg: "bg-indigo-50" },
        { name: "Deals", icon: Briefcase, count: "456", color: "text-green-600", bg: "bg-green-50" },
        { name: "Products", icon: Package, count: "892", color: "text-purple-600", bg: "bg-purple-50" },
    ];

    const handleImport = async () => {
        if (!importModule) {
            toast.error("Please select a module to import");
            return;
        }
        try {
            setImporting(true);
            setImportProgress(20);
            await createDataJob({
                type: "Import",
                module: importModule,
                status: "Queued",
            });
            setImportProgress(100);
            toast.success("Import job queued successfully");
            setTimeout(() => {
                setImporting(false);
                setShowImportModal(false);
                setImportProgress(0);
                setImportModule("");
                fetchJobs();
            }, 400);
        } catch (err: any) {
            console.error("Import job failed:", err);
            toast.error(err?.response?.data?.message || "Failed to start import");
            setImporting(false);
            setImportProgress(0);
        }
    };

    const handleExport = async () => {
        if (!exportModule) {
            toast.error("Please select a module to export");
            return;
        }
        try {
            await createDataJob({
                type: "Export",
                module: exportModule,
                format: exportFormat,
                status: "Queued",
            });
            toast.success("Export job queued. You'll be notified when ready.");
            setShowExportModal(false);
            setExportModule("");
            fetchJobs();
        } catch (err: any) {
            console.error("Export job failed:", err);
            toast.error(err?.response?.data?.message || "Failed to start export");
        }
    };

    return (
        <div className="space-y-6 text-[#1A1A1A] font-outfit">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Import / Export Data</h1>
                    <p className="text-sm text-gray-600">Bulk transfer data between your CRM and external systems.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setShowImportModal(true)}
                        variant="outline"
                        className="rounded-xl border-zinc-200 font-semibold text-sm h-11 gap-2 bg-white shadow-lg"
                    >
                        <Upload size={16} /> Import Data
                    </Button>
                    <Button
                        onClick={() => setShowExportModal(true)}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                    >
                        <Download size={16} /> Export Data
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <button
                    type="button"
                    onClick={() => router.push(`/${orgName}/audit-logs`)}
                    className="bg-gradient-to-r from-primary/70 to-primary text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-left cursor-pointer"
                >
                    <p className="text-xs font-semibold text-white">Total Operations</p>
                    <h2 className="text-xl font-semibold text-white">142</h2>
                    <p className="text-[10px] mt-1 opacity-80">Last 30 days</p>
                </button>

                <button
                    type="button"
                    onClick={() => setShowImportModal(true)}
                    className="border bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-left cursor-pointer"
                >
                    <p className="text-xs text-gray-500">Records Imported</p>
                    <h3 className="text-xl font-semibold text-gray-900">12,450</h3>
                    <p className="text-[10px] text-green-600 mt-1">This month</p>
                </button>

                <button
                    type="button"
                    onClick={() => setShowExportModal(true)}
                    className="border bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-left cursor-pointer"
                >
                    <p className="text-xs text-gray-500">Records Exported</p>
                    <h3 className="text-xl font-semibold text-gray-900">8,920</h3>
                    <p className="text-[10px] text-blue-600 mt-1">This month</p>
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${orgName}/usage-analytics`)}
                    className="border bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-left cursor-pointer"
                >
                    <p className="text-xs text-gray-500">Success Rate</p>
                    <h3 className="text-xl font-semibold text-gray-900">97.2%</h3>
                    <p className="text-[10px] text-green-600 mt-1">Excellent quality</p>
                </button>
            </div>

            {/* Data Modules */}
            <div className="bg-white border rounded-xl shadow-lg p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Available Data Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {dataModules.map((module, idx) => (
                        <div key={idx} className="p-4 border rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`${module.bg} ${module.color} p-2 rounded-lg`}>
                                    <module.icon size={20} />
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{module.name}</span>
                            </div>
                            <p className="text-xs text-gray-600">{module.count} records</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Operations */}
            <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Recent Operations</h3>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-[10px] font-semibold px-2 py-0.5">
                        Live
                    </Badge>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Module</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Records</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Time</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">User</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loadingJobs && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 size={24} className="mx-auto animate-spin text-blue-600" />
                                        <p className="text-xs text-gray-500 mt-2">Loading operations...</p>
                                    </td>
                                </tr>
                            )}
                            {!loadingJobs && recentOperations.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                                        No operations yet. Start your first import or export.
                                    </td>
                                </tr>
                            )}
                            {!loadingJobs && recentOperations.map((op) => (
                                <tr key={op.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {op.type === "Import" ? (
                                                <Upload size={16} className="text-green-600" />
                                            ) : (
                                                <Download size={16} className="text-blue-600" />
                                            )}
                                            <span className="text-sm font-semibold text-gray-900">{op.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-zinc-100 text-zinc-700 border-zinc-200 rounded-full text-[10px] font-semibold px-2 py-0.5">
                                            {op.module}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-gray-900">{op.records}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {op.status === "Completed" ? (
                                                <CheckCircle2 size={14} className="text-green-600" />
                                            ) : (
                                                <AlertCircle size={14} className="text-red-600" />
                                            )}
                                            <span className={`text-xs font-semibold ${op.status === "Completed" ? "text-green-600" : "text-red-600"}`}>
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
                    <Button
                        variant="link"
                        className="text-blue-600 text-sm flex items-center gap-1 group"
                        onClick={() => toast.info("Showing all operation history")}
                    >
                        View All History <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Import Modal */}
            <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
                <DialogContent className="max-w-2xl rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Upload size={80} />
                        </div>
                        <h2 className="text-lg font-semibold flex items-center gap-3">
                            <Upload size={20} /> Import Data
                        </h2>
                        <p className="text-sm opacity-80 mt-1">Upload CSV or Excel file to import records into your CRM.</p>
                    </div>
                    <div className="p-6 space-y-5 bg-white">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-600">Select Module</Label>
                            <Select value={importModule} onValueChange={setImportModule}>
                                <SelectTrigger className="rounded-lg border-zinc-200 h-9">
                                    <SelectValue placeholder="Choose data module" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="leads">Leads</SelectItem>
                                    <SelectItem value="contacts">Contacts</SelectItem>
                                    <SelectItem value="deals">Deals</SelectItem>
                                    <SelectItem value="products">Products</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-600">Upload File</Label>
                            <div className="border-2 border-dashed border-zinc-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer">
                                <FileSpreadsheet size={40} className="mx-auto text-zinc-400 mb-3" />
                                <p className="text-sm font-semibold text-gray-900 mb-1">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500">CSV, XLSX (Max 10MB)</p>
                            </div>
                        </div>
                        {importing && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Importing records...</span>
                                    <span>{importProgress}%</span>
                                </div>
                                <Progress value={importProgress} className="h-2 rounded-lg" />
                            </div>
                        )}
                    </div>
                    <DialogFooter className="p-6 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowImportModal(false)} className="rounded-xl text-sm text-gray-600 font-semibold" disabled={importing}>
                            Cancel
                        </Button>
                        <Button onClick={handleImport} disabled={importing} className="bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold px-10 h-9 shadow-xl shadow-blue-100">
                            {importing ? "Importing..." : "Start Import"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Export Modal */}
            <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
                <DialogContent className="max-w-2xl rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Download size={80} />
                        </div>
                        <h2 className="text-lg font-semibold flex items-center gap-3">
                            <Download size={20} /> Export Data
                        </h2>
                        <p className="text-sm opacity-80 mt-1">Download your CRM data in CSV or Excel format.</p>
                    </div>
                    <div className="p-6 space-y-5 bg-white">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-600">Select Module</Label>
                            <Select value={exportModule} onValueChange={setExportModule}>
                                <SelectTrigger className="rounded-lg border-zinc-200 h-9">
                                    <SelectValue placeholder="Choose data module" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="leads">Leads</SelectItem>
                                    <SelectItem value="contacts">Contacts</SelectItem>
                                    <SelectItem value="deals">Deals</SelectItem>
                                    <SelectItem value="products">Products</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-600">Export Format</Label>
                            <Select value={exportFormat} onValueChange={setExportFormat}>
                                <SelectTrigger className="rounded-lg border-zinc-200 h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="p-6 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowExportModal(false)} className="rounded-xl text-sm text-gray-600 font-semibold">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleExport}
                            className="bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold px-10 h-9 shadow-xl shadow-blue-100"
                        >
                            Download Export
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
