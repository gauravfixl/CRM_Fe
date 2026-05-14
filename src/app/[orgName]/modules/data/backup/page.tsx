"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    HardDrive,
    Download,
    RefreshCw,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Database,
    ChevronRight,
    Play,
    Calendar,
    Loader2,
} from "lucide-react";
import { listBackups, createBackup } from "@/hooks/orgAdminHooks";
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

interface BackupItem {
    id: string;
    name: string;
    date: string;
    size: string;
    type: string;
    status: string;
}

export default function BackupRestorePage() {
    const router = useRouter();
    const params = useParams();
    const orgName = (params?.orgName as string) || "";

    const [showBackupModal, setShowBackupModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [backing, setBacking] = useState(false);
    const [backupProgress, setBackupProgress] = useState(0);

    const [backups, setBackups] = useState<BackupItem[]>([]);
    const [loadingBackups, setLoadingBackups] = useState(true);
    const [backupType, setBackupType] = useState<string>("full");

    const formatBytes = (bytes: any): string => {
        const n = Number(bytes);
        if (!n || Number.isNaN(n)) return "—";
        if (n < 1024) return `${n} B`;
        if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
        if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
        return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    };

    const formatDateTime = (value: any): string => {
        if (!value) return "—";
        try {
            return new Date(value).toLocaleString();
        } catch {
            return String(value);
        }
    };

    const normalizeBackup = (raw: any): BackupItem => ({
        id: raw?._id || raw?.id || "",
        name: raw?.name || raw?.label || "Backup",
        date: formatDateTime(raw?.createdAt || raw?.date),
        size: typeof raw?.size === "string" ? raw.size : formatBytes(raw?.sizeBytes || raw?.size),
        type: raw?.type === "manual" || raw?.type === "Manual" ? "Manual" : "Automated",
        status: raw?.status || "Completed",
    });

    const fetchBackups = async () => {
        try {
            setLoadingBackups(true);
            const res = await listBackups();
            const data = res?.data?.backups || res?.data?.data || res?.data || [];
            const list = Array.isArray(data) ? data : [];
            setBackups(list.map(normalizeBackup));
        } catch (err: any) {
            console.error("Failed to load backups:", err);
            toast.error(err?.response?.data?.message || "Failed to load backups");
            setBackups([]);
        } finally {
            setLoadingBackups(false);
        }
    };

    useEffect(() => {
        fetchBackups();
    }, []);

    const handleBackup = async () => {
        try {
            setBacking(true);
            setBackupProgress(30);
            await createBackup({
                type: "Manual",
                backupType,
                name: `Manual ${backupType} backup`,
                status: "Queued",
            });
            setBackupProgress(100);
            toast.success("Backup job queued successfully");
            setTimeout(() => {
                setBacking(false);
                setShowBackupModal(false);
                setBackupProgress(0);
                fetchBackups();
            }, 400);
        } catch (err: any) {
            console.error("Create backup failed:", err);
            toast.error(err?.response?.data?.message || "Failed to create backup");
            setBacking(false);
            setBackupProgress(0);
        }
    };

    const handleRestore = () => {
        toast.info("Restore is not yet supported by the backend. Contact your administrator.");
        setShowRestoreModal(false);
    };

    const handleDownloadBackup = (backupName: string) => {
        toast.info(`Download for "${backupName}" is not yet supported by the backend.`);
    };

    return (
        <div className="space-y-6 text-[#1A1A1A] font-outfit">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Backups & Restore</h1>
                    <p className="text-sm text-gray-600">Protect your data with automated backups and quick restore options.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setShowRestoreModal(true)}
                        variant="outline"
                        className="rounded-xl border-zinc-200 font-semibold text-sm h-11 gap-2 bg-white shadow-lg"
                    >
                        <RefreshCw size={16} /> Restore
                    </Button>
                    <Button
                        onClick={() => setShowBackupModal(true)}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-sm h-11 gap-2 shadow-xl shadow-blue-100 px-6"
                    >
                        <HardDrive size={16} /> Create Backup
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
                    <p className="text-xs font-semibold text-white">Total Backups</p>
                    <h2 className="text-xl font-semibold text-white">{backups.length}</h2>
                    <p className="text-[10px] mt-1 opacity-80">Last 30 days</p>
                </button>

                <button
                    type="button"
                    onClick={() => setShowBackupModal(true)}
                    className="border bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-left cursor-pointer"
                >
                    <p className="text-xs text-gray-500">Latest Backup</p>
                    <h3 className="text-xl font-semibold text-gray-900">2 hours ago</h3>
                    <p className="text-[10px] text-green-600 mt-1">Successful</p>
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${orgName}/system-health`)}
                    className="border bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-left cursor-pointer"
                >
                    <p className="text-xs text-gray-500">Total Storage</p>
                    <h3 className="text-xl font-semibold text-gray-900">8.6 GB</h3>
                    <p className="text-[10px] text-blue-600 mt-1">Across all backups</p>
                </button>

                <button
                    type="button"
                    onClick={() => router.push(`/${orgName}/usage-analytics`)}
                    className="border bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-left cursor-pointer"
                >
                    <p className="text-xs text-gray-500">Success Rate</p>
                    <h3 className="text-xl font-semibold text-gray-900">100%</h3>
                    <p className="text-[10px] text-green-600 mt-1">All backups completed</p>
                </button>
            </div>

            {/* Backup Schedule */}
            <div className="bg-white border rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-semibold text-gray-900">Automated Backup Schedule</h3>
                    <Badge className="bg-green-50 text-green-700 border-green-200 rounded-full text-[10px] font-semibold px-2 py-0.5">
                        Active
                    </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-blue-600" />
                            <span className="text-xs font-semibold text-gray-500">Frequency</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">Daily at 2:00 AM</p>
                    </div>
                    <div className="p-4 border rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <Database size={16} className="text-blue-600" />
                            <span className="text-xs font-semibold text-gray-500">Backup Type</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">Full System</p>
                    </div>
                    <div className="p-4 border rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <HardDrive size={16} className="text-blue-600" />
                            <span className="text-xs font-semibold text-gray-500">Retention</span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">30 Days</p>
                    </div>
                </div>
            </div>

            {/* Backup History */}
            <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
                <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Backup History</h3>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 rounded-full text-[10px] font-semibold px-2 py-0.5">
                        {backups.length} Backups
                    </Badge>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Backup Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Date & Time</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Size</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loadingBackups && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Loader2 size={24} className="mx-auto animate-spin text-blue-600" />
                                        <p className="text-xs text-gray-500 mt-2">Loading backups...</p>
                                    </td>
                                </tr>
                            )}
                            {!loadingBackups && backups.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                                        No backups yet. Create your first backup.
                                    </td>
                                </tr>
                            )}
                            {!loadingBackups && backups.map((backup) => (
                                <tr key={backup.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                <HardDrive size={18} />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{backup.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-700">
                                            <Clock size={12} /> {backup.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-gray-900">{backup.size}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={`${backup.type === "Automated" ? "bg-green-50 text-green-700 border-green-200" : "bg-purple-50 text-purple-700 border-purple-200"} rounded-full text-[10px] font-semibold px-2 py-0.5`}>
                                            {backup.type}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-green-600" />
                                            <span className="text-xs font-semibold text-green-600">{backup.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                onClick={() => setShowRestoreModal(true)}
                                                variant="outline"
                                                className="rounded-xl border-zinc-200 h-8 text-xs px-3 font-semibold"
                                            >
                                                <RefreshCw size={12} className="mr-1" /> Restore
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0 rounded-xl hover:bg-zinc-100"
                                                onClick={() => handleDownloadBackup(backup.name)}
                                            >
                                                <Download size={14} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing {backups.length} backups</p>
                    <Button
                        variant="link"
                        className="text-blue-600 text-sm flex items-center gap-1 group"
                        onClick={() => toast.info("Showing all backups")}
                    >
                        View All Backups <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Create Backup Modal */}
            <Dialog open={showBackupModal} onOpenChange={setShowBackupModal}>
                <DialogContent className="max-w-2xl rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <HardDrive size={80} />
                        </div>
                        <h2 className="text-lg font-semibold flex items-center gap-3">
                            <HardDrive size={20} /> Create Manual Backup
                        </h2>
                        <p className="text-sm opacity-80 mt-1">Create a snapshot of your current system data.</p>
                    </div>
                    <div className="p-6 space-y-5 bg-white">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-600">Backup Type</Label>
                            <Select value={backupType} onValueChange={setBackupType}>
                                <SelectTrigger className="rounded-lg border-zinc-200 h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="full">Full System Backup</SelectItem>
                                    <SelectItem value="database">Database Only</SelectItem>
                                    <SelectItem value="files">Files Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {backing && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span>Creating backup...</span>
                                    <span>{backupProgress}%</span>
                                </div>
                                <Progress value={backupProgress} className="h-2 rounded-lg" />
                            </div>
                        )}
                    </div>
                    <DialogFooter className="p-6 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowBackupModal(false)} className="rounded-xl text-sm text-gray-600 font-semibold" disabled={backing}>
                            Cancel
                        </Button>
                        <Button onClick={handleBackup} disabled={backing} className="bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-semibold px-10 h-9 shadow-xl shadow-blue-100">
                            {backing ? "Creating..." : "Create Backup"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Restore Modal */}
            <Dialog open={showRestoreModal} onOpenChange={setShowRestoreModal}>
                <DialogContent className="max-w-2xl rounded-xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <RefreshCw size={80} />
                        </div>
                        <h2 className="text-lg font-semibold flex items-center gap-3">
                            <AlertTriangle size={20} /> Restore from Backup
                        </h2>
                        <p className="text-sm opacity-80 mt-1">Warning: This will replace current data with backup data.</p>
                    </div>
                    <div className="p-6 space-y-5 bg-white">
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-amber-900 mb-1">Important Notice</p>
                                <p className="text-xs text-amber-800">All current data will be replaced. This action cannot be undone. Please ensure you have a recent backup before proceeding.</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-600">Select Backup to Restore</Label>
                            <Select>
                                <SelectTrigger className="rounded-lg border-zinc-200 h-9">
                                    <SelectValue placeholder="Choose backup" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    {backups.map((backup) => (
                                        <SelectItem key={backup.id} value={backup.id}>
                                            {backup.name} - {backup.date}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="p-6 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowRestoreModal(false)} className="rounded-xl text-sm text-gray-600 font-semibold">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRestore}
                            className="bg-amber-600 hover:bg-amber-700 rounded-xl text-sm font-semibold px-10 h-9 shadow-xl shadow-amber-100"
                        >
                            Restore Backup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
