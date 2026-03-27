"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    AlertTriangle,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Activity,
    ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SmallCard, SmallCardContent } from "@/shared/components/custom/SmallCard";
import { Dialog, DialogContent, DialogFooter } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";

export default function ErrorHandlingPage() {
    const router = useRouter();
    const params = useParams();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [newHandler, setNewHandler] = useState({ errorType: "", action: "", notification: "", severity: "" });
    const [editHandler, setEditHandler] = useState<any>(null);

    const [handlers, setHandlers] = useState([
        { id: "1", errorType: "Timeout Error", action: "Retry 3 times", notification: "Admin", severity: "High", occurrences: 45, lastSeen: "2 mins ago" },
        { id: "2", errorType: "API Failure", action: "Log & Alert", notification: "Dev Team", severity: "Critical", occurrences: 12, lastSeen: "15 mins ago" },
        { id: "3", errorType: "Validation Error", action: "Skip & Continue", notification: "None", severity: "Low", occurrences: 128, lastSeen: "5 mins ago" },
        { id: "4", errorType: "Rate Limit Exceeded", action: "Queue & Retry", notification: "Admin", severity: "Medium", occurrences: 8, lastSeen: "1 hour ago" },
        { id: "5", errorType: "Authentication Failure", action: "Log & Alert", notification: "Security Team", severity: "Critical", occurrences: 3, lastSeen: "3 hours ago" },
    ]);

    const deleteHandler = (id: string) => {
        setHandlers(prev => prev.filter(h => h.id !== id));
        toast.success("Handler deleted successfully");
    };

    const handleCreate = () => {
        if (!newHandler.errorType || !newHandler.action || !newHandler.severity) {
            toast.error("Please fill all required fields");
            return;
        }
        const h = {
            id: Date.now().toString(),
            errorType: newHandler.errorType,
            action: newHandler.action,
            notification: newHandler.notification || "None",
            severity: newHandler.severity,
            occurrences: 0,
            lastSeen: "Just now",
        };
        setHandlers(prev => [...prev, h]);
        setNewHandler({ errorType: "", action: "", notification: "", severity: "" });
        setShowCreateModal(false);
        toast.success("Handler added successfully");
    };

    const openEdit = (handler: any) => {
        setEditHandler({ ...handler });
        setShowEditModal(true);
    };

    const handleEdit = () => {
        if (!editHandler) return;
        setHandlers(prev => prev.map(h => h.id === editHandler.id ? editHandler : h));
        setShowEditModal(false);
        setEditHandler(null);
        toast.success("Handler updated successfully");
    };

    const filteredHandlers = handlers.filter(h =>
        h.errorType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.action.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalErrors24h = handlers.reduce((sum, h) => sum + h.occurrences, 0);
    const criticalCount = handlers.filter(h => h.severity === "Critical").length;

    return (
        <div className="relative min-h-screen bg-[#F8F9FC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-outfit p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 leading-none">Error Handling</h1>
                        <p className="text-xs text-zinc-500 mt-1 font-medium">Configure how automation errors are handled and reported.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-10 rounded-xl text-[11px] font-semibold border-zinc-200 dark:border-zinc-800" onClick={() => router.push(`/${params.orgName}/modules/settings/entitlements/automations/audit`)}>
                        <Activity className="w-4 h-4 mr-1.5" /> Error Log
                    </Button>
                    <Button onClick={() => setShowCreateModal(true)} className="h-10 rounded-xl text-[11px] font-semibold bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-1.5" /> Add Handler
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none rounded-none shadow-lg text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-white opacity-80">Error Handlers</p>
                            <p className="text-xl font-semibold text-white mt-1">{handlers.length}</p>
                            <p className="text-[10px] text-white/80 mt-1">Configured</p>
                        </div>
                        <AlertTriangle className="w-6 h-6 text-white/80" />
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Errors (24h)</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{totalErrors24h}</span>
                            <span className="text-[10px] text-amber-600 font-medium mt-1 block">Handled automatically</span>
                        </div>
                        <div className="h-10 w-10 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl flex items-center justify-center">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Recovery Rate</span>
                            <span className="text-xl font-semibold text-emerald-600 block">94%</span>
                            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Auto-recovered</span>
                        </div>
                        <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="bg-white dark:bg-zinc-900 border-0 rounded-none shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex items-center justify-between">
                        <div className="text-left">
                            <span className="text-[10px] font-medium text-zinc-400 block mb-1">Critical Errors</span>
                            <span className="text-xl font-semibold text-zinc-900 dark:text-white block">{criticalCount}</span>
                            <span className="text-[10px] text-rose-600 font-medium mt-1 block">Needs attention</span>
                        </div>
                        <div className="h-10 w-10 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl flex items-center justify-center">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Handlers Table */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/50">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <Input
                            placeholder="Search handlers..."
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-xl border-zinc-200 dark:border-zinc-700 h-10 text-sm bg-white dark:bg-zinc-800"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-5 py-3 text-[11px] font-medium text-zinc-500">Error Type</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Action</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Notification</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Severity</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Occurrences</th>
                                <th className="py-3 text-[11px] font-medium text-zinc-500">Last Seen</th>
                                <th className="py-3 pr-5 text-[11px] font-medium text-zinc-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHandlers.map((handler) => (
                                <tr key={handler.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 group">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-800 group-hover:bg-rose-600 group-hover:text-white transition-all">
                                                <AlertTriangle size={16} />
                                            </div>
                                            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{handler.errorType}</p>
                                        </div>
                                    </td>
                                    <td className="py-3"><span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">{handler.action}</span></td>
                                    <td className="py-3">
                                        <Badge className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-0 rounded-full text-[9px] font-medium px-2 py-0.5">
                                            {handler.notification}
                                        </Badge>
                                    </td>
                                    <td className="py-3">
                                        <Badge className={`rounded-full text-[9px] font-medium px-2 py-0.5 border-0 ${handler.severity === "Critical" ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600" :
                                            handler.severity === "High" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600" :
                                                handler.severity === "Medium" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600" :
                                                    "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                                            }`}>
                                            {handler.severity}
                                        </Badge>
                                    </td>
                                    <td className="py-3"><span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">{handler.occurrences}</span></td>
                                    <td className="py-3"><span className="text-[10px] text-zinc-500 font-medium">{handler.lastSeen}</span></td>
                                    <td className="py-3 pr-5 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800"><MoreVertical size={16} /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-200 dark:border-zinc-700 shadow-xl p-2 min-w-[180px]">
                                                <DropdownMenuLabel className="text-[10px] font-medium text-zinc-400">Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => openEdit(handler)} className="text-xs p-2 flex items-center gap-2 focus:bg-blue-600 focus:text-white cursor-pointer rounded-lg">
                                                    <Edit size={14} /> Edit Handler
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-1" />
                                                <DropdownMenuItem onClick={() => deleteHandler(handler.id)} className="text-xs p-2 text-red-600 focus:bg-red-600 focus:text-white flex items-center gap-2 cursor-pointer rounded-lg">
                                                    <Trash2 size={14} /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <p className="text-[11px] text-zinc-500 font-medium">Showing {filteredHandlers.length} of {handlers.length} handlers</p>
                    <Button variant="link" className="p-0 h-auto text-[10px] font-semibold text-blue-600 hover:no-underline">
                        View Error Log <ChevronRight size={12} className="ml-1" />
                    </Button>
                </div>
            </div>

            {/* Create Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-rose-500 to-orange-600 p-8 text-white relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={80} /></div>
                        <h2 className="text-xl font-semibold flex items-center gap-3"><Plus size={22} /> Add Error Handler</h2>
                        <p className="text-xs opacity-80 mt-2">Define how specific errors should be handled.</p>
                    </div>
                    <div className="p-8 space-y-5 bg-white dark:bg-zinc-900">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-zinc-500">Error Type</Label>
                            <Select value={newHandler.errorType} onValueChange={(v) => setNewHandler(p => ({ ...p, errorType: v }))}>
                                <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue placeholder="Select error type" /></SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="Timeout Error">Timeout Error</SelectItem>
                                    <SelectItem value="API Failure">API Failure</SelectItem>
                                    <SelectItem value="Validation Error">Validation Error</SelectItem>
                                    <SelectItem value="Rate Limit Exceeded">Rate Limit Exceeded</SelectItem>
                                    <SelectItem value="Authentication Failure">Authentication Failure</SelectItem>
                                    <SelectItem value="Network Error">Network Error</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Action</Label>
                                <Select value={newHandler.action} onValueChange={(v) => setNewHandler(p => ({ ...p, action: v }))}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue placeholder="Select action" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Retry 3 times">Retry 3 times</SelectItem>
                                        <SelectItem value="Log & Alert">Log & Alert</SelectItem>
                                        <SelectItem value="Skip & Continue">Skip & Continue</SelectItem>
                                        <SelectItem value="Queue & Retry">Queue & Retry</SelectItem>
                                        <SelectItem value="Halt Execution">Halt Execution</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-semibold text-zinc-500">Severity</Label>
                                <Select value={newHandler.severity} onValueChange={(v) => setNewHandler(p => ({ ...p, severity: v }))}>
                                    <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue placeholder="Select severity" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Critical">Critical</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[11px] font-semibold text-zinc-500">Notification Target</Label>
                            <Select value={newHandler.notification} onValueChange={(v) => setNewHandler(p => ({ ...p, notification: v }))}>
                                <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue placeholder="Select target" /></SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Dev Team">Dev Team</SelectItem>
                                    <SelectItem value="Security Team">Security Team</SelectItem>
                                    <SelectItem value="None">None</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="rounded-xl text-xs text-zinc-500">Cancel</Button>
                        <Button onClick={handleCreate} className="bg-rose-600 hover:bg-rose-700 rounded-xl text-xs px-8 h-10">Add Handler</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative">
                        <h2 className="text-xl font-semibold flex items-center gap-3"><Edit size={22} /> Edit Handler</h2>
                        <p className="text-xs opacity-80 mt-2">Update error handler configuration.</p>
                    </div>
                    {editHandler && (
                        <>
                            <div className="p-8 space-y-5 bg-white dark:bg-zinc-900">
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-zinc-500">Error Type</Label>
                                    <Select value={editHandler.errorType} onValueChange={(v) => setEditHandler((p: any) => ({ ...p, errorType: v }))}>
                                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Timeout Error">Timeout Error</SelectItem>
                                            <SelectItem value="API Failure">API Failure</SelectItem>
                                            <SelectItem value="Validation Error">Validation Error</SelectItem>
                                            <SelectItem value="Rate Limit Exceeded">Rate Limit Exceeded</SelectItem>
                                            <SelectItem value="Authentication Failure">Authentication Failure</SelectItem>
                                            <SelectItem value="Network Error">Network Error</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Action</Label>
                                        <Select value={editHandler.action} onValueChange={(v) => setEditHandler((p: any) => ({ ...p, action: v }))}>
                                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Retry 3 times">Retry 3 times</SelectItem>
                                                <SelectItem value="Log & Alert">Log & Alert</SelectItem>
                                                <SelectItem value="Skip & Continue">Skip & Continue</SelectItem>
                                                <SelectItem value="Queue & Retry">Queue & Retry</SelectItem>
                                                <SelectItem value="Halt Execution">Halt Execution</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-semibold text-zinc-500">Severity</Label>
                                        <Select value={editHandler.severity} onValueChange={(v) => setEditHandler((p: any) => ({ ...p, severity: v }))}>
                                            <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="Critical">Critical</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[11px] font-semibold text-zinc-500">Notification Target</Label>
                                    <Select value={editHandler.notification} onValueChange={(v) => setEditHandler((p: any) => ({ ...p, notification: v }))}>
                                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-700 h-11"><SelectValue /></SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Dev Team">Dev Team</SelectItem>
                                            <SelectItem value="Security Team">Security Team</SelectItem>
                                            <SelectItem value="None">None</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                                <Button variant="ghost" onClick={() => setShowEditModal(false)} className="rounded-xl text-xs text-zinc-500">Cancel</Button>
                                <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 rounded-xl text-xs px-8 h-10">Save Changes</Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
