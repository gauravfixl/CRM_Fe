"use client"

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    ClipboardList,
    Search,
    Filter,
    Download,
    Eye,
    ChevronDown,
    ShieldAlert,
    Clock,
    User,
    Monitor,
    FileJson,
    Trash2
} from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { auditLogsApi, extractApiError, type ApiAuditLog } from "@/shared/api/settings-api";

type AuditAction = "Create" | "Update" | "Delete" | "Login" | "Logout";
type AuditModule = "Authentication" | "Roles & Permissions" | "Employees" | "Payroll" | "Settings";
type AuditSeverity = "Low" | "Medium" | "High" | "Critical";

interface AuditLog {
    id: string;
    timestamp: string;
    userName: string;
    userRole: "Admin" | "Manager" | "Employee";
    userId: string;
    action: AuditAction;
    module: AuditModule;
    description: string;
    severity: AuditSeverity;
    ipAddress: string;
    deviceInfo: string;
    metadata?: Record<string, any>;
}

const INITIAL_AUDIT_LOGS: AuditLog[] = [
    { id: "log-1", timestamp: new Date().toISOString(), userName: "Admin User", userRole: "Admin", userId: "usr-1", action: "Create", module: "Roles & Permissions", description: "Created new role 'Finance Auditor'", severity: "Medium", ipAddress: "192.168.1.10", deviceInfo: "Chrome 120 / Windows 11" },
    { id: "log-2", timestamp: new Date(Date.now() - 3600000).toISOString(), userName: "Manager X", userRole: "Manager", userId: "usr-2", action: "Update", module: "Employees", description: "Updated designation for Ravi Kumar", severity: "Low", ipAddress: "192.168.1.11", deviceInfo: "Firefox / macOS" },
    { id: "log-3", timestamp: new Date(Date.now() - 7200000).toISOString(), userName: "Admin User", userRole: "Admin", userId: "usr-1", action: "Delete", module: "Payroll", description: "Removed deduction 'Special Levy'", severity: "High", ipAddress: "192.168.1.10", deviceInfo: "Chrome 120 / Windows 11" },
];

const mapBackendLog = (l: ApiAuditLog): AuditLog => {
    const actor = typeof l.actorId === "object" && l.actorId
        ? `${l.actorId.firstName || ""} ${l.actorId.lastName || ""}`.trim() || l.actorId.email || "Unknown"
        : "System";
    const actorId = typeof l.actorId === "object" ? l.actorId?._id || "" : (l.actorId || "");
    const actionMap: Record<string, AuditAction> = {
        CREATE: "Create",
        UPDATE: "Update",
        DELETE: "Delete",
        APPROVE: "Update",
        REJECT: "Update",
        LOCK: "Update",
        UNLOCK: "Update",
        OVERRIDE: "Update",
    };
    const moduleMap: Record<string, AuditModule> = {
        Employee: "Employees",
        Shift: "Settings",
        Holiday: "Settings",
        AttendancePolicy: "Settings",
        ShiftAssignment: "Settings",
        LeaveRequest: "Employees",
        LeaveType: "Settings",
        LeaveBalance: "Employees",
        Payroll: "Payroll",
        PayrollRun: "Payroll",
        Policy: "Settings",
        Attendance: "Employees",
        Onboarding: "Employees",
    };
    const severity: AuditLog["severity"] =
        l.action === "DELETE" ? "High" :
            l.action === "CREATE" || l.action === "UPDATE" ? "Medium" :
                "Low";
    return {
        id: l._id,
        timestamp: l.createdAt,
        userName: actor,
        userRole: (l.actorRole || "Admin") as any,
        userId: actorId,
        action: actionMap[l.action] || "Update",
        module: moduleMap[l.entityType] || "Settings",
        description: l.message || `${l.action} on ${l.entityType}`,
        severity,
        ipAddress: l.ipAddress || "-",
        deviceInfo: l.userAgent || "-",
        metadata: { before: l.before, after: l.after, entityId: l.entityId, entityType: l.entityType } as any,
    };
};
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

const AuditLogsPage = () => {
    const [logs, setLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
    const clearOldLogs = (cutoffIso: string) => {
        const cutoff = Date.parse(cutoffIso);
        setLogs((prev) => prev.filter((l) => Date.parse(l.timestamp) >= cutoff));
    };
    const { toast } = useToast();

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [moduleFilter, setModuleFilter] = useState<string>("all");
    const [actionFilter, setActionFilter] = useState<string>("all");
    const [severityFilter, setSeverityFilter] = useState<string>("all");

    // View State
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Hydrate from backend
    useEffect(() => {
        let cancel = false;
        (async () => {
            setIsLoading(true);
            try {
                const res = await auditLogsApi.list({ page: 1, limit: 100 });
                if (cancel || !Array.isArray(res?.data)) return;
                if (res.data.length) {
                    const mapped = res.data.map(mapBackendLog);
                    setLogs(mapped);
                }
            } catch {
                // Fall back to local mock
            } finally {
                if (!cancel) setIsLoading(false);
            }
        })();
        return () => { cancel = true; };
    }, []);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch =
                (log.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.userName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.id ?? "").toLowerCase().includes(searchTerm.toLowerCase());

            const matchesModule = moduleFilter === "all" || log.module === moduleFilter;
            const matchesAction = actionFilter === "all" || log.action === actionFilter;
            const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;

            return matchesSearch && matchesModule && matchesAction && matchesSeverity;
        });
    }, [logs, searchTerm, moduleFilter, actionFilter, severityFilter]);

    const handleExport = async () => {
        try {
            const blob = await auditLogsApi.exportCsv({
                entityType: moduleFilter === "all" ? undefined : moduleFilter,
                action: actionFilter === "all" ? undefined : actionFilter.toUpperCase(),
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `audit-logs-${Date.now()}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast({ title: "Export Complete", description: "CSV downloaded." });
        } catch (e) {
            // Fallback: generate CSV client-side from filtered logs
            const header = "Timestamp,User,Role,Action,Module,Description,Severity,IP\n";
            const rows = filteredLogs.map(l =>
                `"${new Date(l.timestamp).toISOString()}","${l.userName}","${l.userRole}","${l.action}","${l.module}","${(l.description || "").replace(/"/g, '""')}","${l.severity}","${l.ipAddress || ""}"`
            ).join("\n");
            const blob = new Blob([header + rows], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `audit-logs-${Date.now()}.csv`; a.click();
            URL.revokeObjectURL(url);
            toast({ title: "Export Complete (local)", description: extractApiError(e, "Generated locally.") });
        }
    };

    const handleClearLogs = () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        clearOldLogs(thirtyDaysAgo.toISOString());
        toast({ title: "Cleaned Up (local)", description: "Old logs removed from the view. Backend audit logs are immutable." });
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                        <ClipboardList size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Audit Logs</h1>
                        <p className="text-sm font-medium text-slate-500">Track security events, user activity, and data changes.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold border-slate-200" onClick={handleClearLogs}>
                        <Trash2 size={16} className="mr-2 text-slate-400" /> Cleanup
                    </Button>
                    <Button variant="outline" className="font-bold border-slate-200" onClick={handleExport}>
                        <Download size={16} className="mr-2 text-slate-400" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white px-8 py-4 border-b border-slate-200 flex flex-wrap gap-4 items-center justify-between shadow-sm z-10">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by User, Description, or ID..."
                        className="pl-9 bg-slate-50 border-slate-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={moduleFilter} onValueChange={setModuleFilter}>
                        <SelectTrigger className="w-[180px] bg-slate-50 font-medium">
                            <SelectValue placeholder="Module" />
                        </SelectTrigger>
                        <SelectContent className="max-h-80">
                            <SelectItem value="all">All Modules</SelectItem>
                            <SelectItem value="Authentication">Authentication</SelectItem>
                            <SelectItem value="Roles & Permissions">Roles & Permissions</SelectItem>
                            <SelectItem value="Employees">Employees</SelectItem>
                            <SelectItem value="Payroll">Payroll</SelectItem>
                            <SelectItem value="Settings">Settings</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                        <SelectTrigger className="w-[150px] bg-slate-50 font-medium">
                            <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto p-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs w-[180px]">Timestamp</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">User</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Action</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs w-[400px]">Description</TableHead>
                                <TableHead className="font-bold text-slate-500 uppercase text-xs">Severity</TableHead>
                                <TableHead className="text-right w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => setSelectedLog(log)}>
                                    <TableCell className="font-mono text-xs text-slate-500">
                                        {new Date(log.timestamp).toLocaleDateString()} <span className="opacity-50 mx-1">|</span> {new Date(log.timestamp).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700 text-sm">{log.userName}</span>
                                            <span className="text-[10px] text-slate-400">{log.userRole}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            ${log.action === 'Create' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                log.action === 'Delete' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                                                    log.action === 'Update' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                        log.action === 'Login' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
                                                            'bg-slate-50 text-slate-600 border-slate-200'}
                                        `}>
                                            {log.action}
                                        </Badge>
                                        <span className="text-xs text-slate-400 ml-2 font-medium">{log.module}</span>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium text-slate-600 truncate max-w-[400px]">
                                        {log.description}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`
                                            ${log.severity === 'Critical' ? 'bg-red-500 text-white hover:bg-red-600' :
                                                log.severity === 'High' ? 'bg-orange-500 text-white hover:bg-orange-600' :
                                                    log.severity === 'Medium' ? 'bg-yellow-500 text-white hover:bg-yellow-600' :
                                                        'bg-slate-200 text-slate-600 hover:bg-slate-300'}
                                            border-none
                                        `}>
                                            {log.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                            <Eye size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredLogs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-slate-400">
                                        No logs found matching your filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Log Details Sheet */}
            <Sheet open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                <SheetContent className="w-[600px] sm:w-[540px]">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="flex items-center gap-2">
                            <ShieldAlert className="text-slate-900" /> Event Details
                        </SheetTitle>
                        <SheetDescription>Log ID: {selectedLog?.id}</SheetDescription>
                    </SheetHeader>
                    {selectedLog && (
                        <div className="space-y-6">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Core Info</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500 block flex items-center gap-1"><User size={10} /> Actor</span>
                                        <span className="font-bold text-slate-800">{selectedLog.userName}</span>
                                        <span className="text-xs text-slate-400 block">{selectedLog.userId}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500 block flex items-center gap-1"><Clock size={10} /> Time</span>
                                        <span className="font-bold text-slate-800">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500 block flex items-center gap-1"><Monitor size={10} /> IP / Device</span>
                                        <span className="font-bold text-slate-800">{selectedLog.ipAddress}</span>
                                        <span className="text-xs text-slate-400 block truncate">{selectedLog.deviceInfo}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500 block">Severity</span>
                                        <Badge className={`
                                            ${selectedLog.severity === 'Critical' ? 'bg-red-500' :
                                                selectedLog.severity === 'High' ? 'bg-orange-500' :
                                                    selectedLog.severity === 'Medium' ? 'bg-yellow-500' :
                                                        'bg-slate-400'} text-white border-none
                                        `}>
                                            {selectedLog.severity}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Message</h3>
                                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                    <p className="font-medium text-slate-800">{selectedLog.description}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="secondary" className="bg-slate-100">{selectedLog.module}</Badge>
                                        <Badge variant="outline">{selectedLog.action}</Badge>
                                    </div>
                                </div>
                            </div>

                            {selectedLog.metadata && (
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <FileJson size={14} /> Metadata
                                    </h3>
                                    <div className="bg-slate-950 rounded-xl p-4 overflow-auto max-h-60">
                                        <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                                            {JSON.stringify(selectedLog.metadata, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default AuditLogsPage;
