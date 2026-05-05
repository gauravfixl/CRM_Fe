"use client"

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Calendar,
    Briefcase,
    Users,
    ArrowUpRight,
    LogOut,
    Activity,
    Clock,
    Hash,
    User,
    TrendingUp,
    AlertTriangle,
    Download,
    FileDown,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore, HistoryLog } from "@/shared/data/lifecycle-store";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog";

type FilterType = "All" | "growth" | "neutral" | "exit" | "warning";

const typeBadgeStyles: Record<string, string> = {
    growth: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    exit: "bg-red-50 text-red-700 border border-red-200",
    neutral: "bg-violet-50 text-violet-700 border border-violet-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
};

const typeDotStyles: Record<string, string> = {
    growth: "bg-emerald-500",
    exit: "bg-red-500",
    neutral: "bg-violet-500",
    warning: "bg-amber-500",
};

const typeLabel: Record<string, string> = {
    growth: "Growth",
    exit: "Exit",
    neutral: "Neutral",
    warning: "Warning",
};

const statusBadgeStyles: Record<string, string> = {
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Probation: "bg-amber-50 text-amber-700 border border-amber-200",
    Exited: "bg-red-50 text-red-700 border border-red-200",
    "Notice Period": "bg-orange-50 text-orange-700 border border-orange-200",
};

const HistoryPage = () => {
    const { toast } = useToast();
    const { employees, history } = useLifecycleStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<FilterType>("All");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
    const [detailEvent, setDetailEvent] = useState<HistoryLog | null>(null);
    const [isBulkExportOpen, setIsBulkExportOpen] = useState(false);
    const [timelineSearch, setTimelineSearch] = useState("");

    const selectedEmp = useMemo(() => employees.find(e => e.id === selectedEmpId) || null, [employees, selectedEmpId]);

    const empHistory = useMemo(() => {
        if (!selectedEmpId) return [];
        return history
            .filter(h => h.employeeId === selectedEmpId)
            .filter(h => filterType === "All" ? true : h.type === filterType)
            .filter(h => {
                if (dateFrom && new Date(h.date) < new Date(dateFrom)) return false;
                if (dateTo && new Date(h.date) > new Date(dateTo)) return false;
                return true;
            })
            .filter(h => {
                const q = timelineSearch.toLowerCase();
                if (!q) return true;
                return h.title.toLowerCase().includes(q) || h.description.toLowerCase().includes(q);
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [history, selectedEmpId, filterType, dateFrom, dateTo, timelineSearch]);

    // Sort employees by most recent activity
    const sortedEmployees = useMemo(() => [...employees].sort((a, b) => {
        const aLatest = history.filter(h => h.employeeId === a.id).sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime())[0];
        const bLatest = history.filter(h => h.employeeId === b.id).sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime())[0];
        const at = aLatest ? new Date(aLatest.date).getTime() : 0;
        const bt = bLatest ? new Date(bLatest.date).getTime() : 0;
        return bt - at;
    }), [employees, history]);

    const filteredEmployees = useMemo(() => sortedEmployees.filter(e => {
        const q = searchTerm.toLowerCase();
        return !q || e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q) || e.department.toLowerCase().includes(q);
    }), [sortedEmployees, searchTerm]);

    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

    // Stats
    const totalEvents = history.length;
    const growthEvents = history.filter(h => h.type === "growth").length;
    const exitEvents = history.filter(h => h.type === "exit").length;
    const totalEmployees = employees.length;

    const stats = [
        { label: "Total Events", value: totalEvents, color: "bg-[#CB9DF0]", icon: <Activity className="text-slate-800" size={18} /> },
        { label: "Growth Events", value: growthEvents, color: "bg-[#FFF9BF]", icon: <TrendingUp className="text-slate-800" size={18} /> },
        { label: "Exit Events", value: exitEvents, color: "bg-[#F0C1E1]", icon: <LogOut className="text-slate-800" size={18} /> },
        { label: "Total Employees", value: totalEmployees, color: "bg-[#FDDBBB]", icon: <Users className="text-slate-800" size={18} /> },
    ];

    const filters: { label: string; value: FilterType }[] = [
        { label: "All", value: "All" },
        { label: "Growth", value: "growth" },
        { label: "Neutral", value: "neutral" },
        { label: "Exit", value: "exit" },
        { label: "Warning", value: "warning" },
    ];

    const clearFilters = () => { setFilterType("All"); setDateFrom(""); setDateTo(""); setTimelineSearch(""); };
    const hasActiveFilters = filterType !== "All" || dateFrom || dateTo || timelineSearch;

    const handleExportHistory = () => {
        if (!selectedEmp) {
            toast({ title: "No employee selected", description: "Please select an employee first.", variant: "destructive" });
            return;
        }
        const lines = [
            `Employee History Report`,
            `${"=".repeat(40)}`,
            `Employee: ${selectedEmp.name}`,
            `Role: ${selectedEmp.role}`,
            `Department: ${selectedEmp.department}`,
            `Status: ${selectedEmp.status}`,
            `Join Date: ${selectedEmp.joinDate}`,
            selectedEmp.lwd ? `Last Working Day: ${selectedEmp.lwd}` : '',
            ``,
            `--- Timeline Events (${empHistory.length}) ---`,
            ...empHistory.map((e, i) => `${i + 1}. [${formatDate(e.date)}] ${e.title} (${typeLabel[e.type] || e.type})\n   ${e.description}`),
            ``,
            `Generated: ${new Date().toLocaleDateString()}`,
        ].filter(Boolean);
        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `history_${selectedEmp.name.replace(/\s+/g, "_")}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded", description: `Timeline for ${selectedEmp.name} saved.` });
    };

    const handleBulkExport = () => {
        const headers = "Employee,Role,Department,Status,Event Date,Event Title,Event Type,Event Description";
        const rows = history.map(h => {
            const emp = employees.find(e => e.id === h.employeeId);
            const role = emp?.role || 'N/A';
            const dept = emp?.department || 'N/A';
            const status = emp?.status || 'N/A';
            const clean = (s: string) => (s || '').replace(/"/g, '""');
            return `"${clean(h.employeeName)}","${clean(role)}","${clean(dept)}","${clean(status)}","${h.date}","${clean(h.title)}","${h.type}","${clean(h.description)}"`;
        }).join("\n");
        const csv = `Bulk Employee History Export\nGenerated: ${new Date().toLocaleDateString()}\nTotal events: ${history.length}\n\n${headers}\n${rows}`;
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `all_history_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setIsBulkExportOpen(false);
        toast({ title: "Bulk Export Complete", description: `${history.length} events exported as CSV.` });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Employee History</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 10: Complete chronological timeline of employee events.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {filters.map((f) => (
                        <button key={f.value} onClick={() => setFilterType(f.value)} className={`px-3 py-1.5 text-[10px] font-bold rounded-xl border transition-colors duration-150 ${filterType === f.value ? "bg-[#CB9DF0] text-white border-[#CB9DF0]" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                            {f.label}
                        </button>
                    ))}
                    <Button variant="outline" className="rounded-xl h-8 px-3 border-slate-200 text-slate-500 font-bold text-[10px] hover:bg-slate-50" onClick={() => setIsBulkExportOpen(true)} disabled={history.length === 0}>
                        <FileDown className="mr-1 h-3 w-3" /> Bulk Export
                    </Button>
                    {selectedEmp && (
                        <Button variant="outline" className="rounded-xl h-8 px-3 border-slate-200 text-slate-500 font-bold text-[10px] hover:bg-slate-50" onClick={handleExportHistory}>
                            <Download className="mr-1 h-3 w-3" /> Export
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} overflow-hidden hover:shadow-md transition-all`}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-700">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm">{stat.icon}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Date range + timeline search toolbar (only when employee selected) */}
            {selectedEmp && (
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3">
                    <div className="flex flex-col md:flex-row gap-3 items-end md:items-center">
                        <div className="flex gap-2 items-center flex-1 flex-wrap">
                            <div className="space-y-0.5">
                                <Label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide ml-1">From</Label>
                                <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-9 w-40 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-bold" />
                            </div>
                            <div className="space-y-0.5">
                                <Label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide ml-1">To</Label>
                                <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-9 w-40 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-bold" />
                            </div>
                            <div className="relative flex-1 min-w-[180px]">
                                <Label className="text-[9px] font-bold text-slate-500 uppercase tracking-wide ml-1">Search Timeline</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                                    <Input placeholder="Search title or description..." value={timelineSearch} onChange={e => setTimelineSearch(e.target.value)} className="pl-8 h-9 rounded-xl bg-slate-50 border border-slate-200 font-bold text-[10px]" />
                                </div>
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-[10px] font-bold text-indigo-500 whitespace-nowrap">Clear all filters</Button>
                        )}
                    </div>
                </Card>
            )}

            {/* Two-column layout */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
                {/* Employee list */}
                <div className="w-full lg:w-1/3 flex flex-col min-h-0">
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-full">
                        <div className="p-3 border-b border-slate-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <Input type="text" placeholder="Search name, role, dept..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 rounded-xl h-9 text-xs font-bold border border-slate-200" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1 max-h-[600px]">
                            {filteredEmployees.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                    <Users size={28} className="mb-2 text-slate-300" />
                                    <p className="text-xs font-bold">{employees.length === 0 ? 'No employees yet.' : 'No matches found.'}</p>
                                </div>
                            ) : filteredEmployees.map((emp) => {
                                const isSelected = selectedEmpId === emp.id;
                                const empEvents = history.filter(h => h.employeeId === emp.id).length;
                                return (
                                    <button key={emp.id} onClick={() => setSelectedEmpId(emp.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors duration-150 ${isSelected ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-700"}`}>
                                        <Avatar className="h-9 w-9 rounded-xl flex-shrink-0">
                                            <AvatarFallback className={isSelected ? "bg-[#CB9DF0] text-white text-xs font-bold" : "bg-violet-100 text-violet-700 text-xs font-bold"}>{emp.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-bold truncate ${isSelected ? "text-white" : "text-slate-800"}`}>{emp.name}</p>
                                            <p className={`text-[10px] font-bold truncate ${isSelected ? "text-slate-400" : "text-slate-500"}`}>{emp.role}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isSelected ? "bg-white/15 text-slate-300" : statusBadgeStyles[emp.status] || "bg-slate-100 text-slate-600"}`}>{emp.status}</span>
                                            <span className={`text-[9px] font-bold ${isSelected ? "text-slate-400" : "text-slate-300"}`}>{empEvents} event{empEvents !== 1 ? 's' : ''}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Timeline */}
                <div className="w-full lg:w-2/3 flex flex-col min-h-0">
                    {selectedEmp ? (
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-full overflow-y-auto custom-scrollbar">
                            <div className="p-5 border-b border-slate-100">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-12 w-12 rounded-2xl flex-shrink-0">
                                        <AvatarFallback className="bg-[#CB9DF0] text-white text-sm font-bold">{selectedEmp.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-base font-bold text-slate-900">{selectedEmp.name}</h2>
                                        <p className="text-xs text-slate-500 font-bold">{selectedEmp.role} · {selectedEmp.department}</p>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5">
                                                <Calendar size={10} /> Joined {formatDate(selectedEmp.joinDate)}
                                            </span>
                                            {selectedEmp.lwd ? (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
                                                    <LogOut size={10} /> LWD {formatDate(selectedEmp.lwd)}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                                                    Currently Active
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-2 py-0.5">
                                                <Activity size={10} /> {empHistory.length} event{empHistory.length !== 1 ? "s" : ""}
                                            </span>
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold rounded-full px-2 py-0.5 ${statusBadgeStyles[selectedEmp.status] || "bg-slate-100 text-slate-600"}`}>{selectedEmp.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-5">
                                {empHistory.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                                        <Clock size={28} className="text-slate-300" />
                                        <p className="text-xs font-bold">{hasActiveFilters ? 'No events match your filters.' : 'No events recorded yet.'}</p>
                                        {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearFilters} className="text-[10px] font-bold text-indigo-500">Clear filters</Button>}
                                    </div>
                                ) : (
                                    <div className="relative pl-8">
                                        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200" />
                                        <div className="space-y-4">
                                            {empHistory.map((event, idx) => (
                                                <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }} className="relative group">
                                                    <div className={`absolute -left-8 top-1.5 h-3 w-3 rounded-full border-2 border-white shadow-sm z-10 ${typeDotStyles[event.type] || "bg-slate-400"}`} />
                                                    <div onClick={() => setDetailEvent(event)} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all duration-150 cursor-pointer">
                                                        <div className="flex items-start justify-between gap-3 mb-1">
                                                            <h4 className="text-xs font-bold text-slate-800">{event.title}</h4>
                                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${typeBadgeStyles[event.type] || "bg-slate-100 text-slate-600"}`}>
                                                                {typeLabel[event.type] || event.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 leading-relaxed mb-1 font-medium">{event.description}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold">{formatDate(event.date)}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ) : (
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center h-full text-slate-400 py-20">
                            <Users size={40} className="mb-3 text-slate-300" />
                            <p className="text-sm font-bold">Select an employee to view their timeline</p>
                            <p className="text-[10px] text-slate-300 mt-1 font-bold">Employees are sorted by most recent activity</p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Event detail dialog */}
            <Dialog open={!!detailEvent} onOpenChange={(open) => { if (!open) setDetailEvent(null); }}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-lg shadow-2xl">
                    <DialogHeader className="mb-3">
                        <DialogTitle className="text-lg font-bold text-slate-900">Event Details</DialogTitle>
                    </DialogHeader>
                    {detailEvent && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${detailEvent.type === "growth" ? "bg-emerald-100 text-emerald-600" : detailEvent.type === "exit" ? "bg-red-100 text-red-600" : detailEvent.type === "warning" ? "bg-amber-100 text-amber-600" : "bg-violet-100 text-violet-600"}`}>
                                        {detailEvent.type === "growth" && <ArrowUpRight size={16} />}
                                        {detailEvent.type === "exit" && <LogOut size={16} />}
                                        {detailEvent.type === "warning" && <AlertTriangle size={16} />}
                                        {detailEvent.type === "neutral" && <Activity size={16} />}
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800">{detailEvent.title}</h4>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">{detailEvent.description}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100">
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><Calendar size={12} /> Date</span>
                                    <span className="text-xs font-bold text-slate-800">{formatDate(detailEvent.date)}</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><User size={12} /> Employee</span>
                                    <span className="text-xs font-bold text-slate-800">{detailEvent.employeeName}</span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><Briefcase size={12} /> Type</span>
                                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${typeBadgeStyles[detailEvent.type] || "bg-slate-100 text-slate-600"}`}>
                                        {typeLabel[detailEvent.type] || detailEvent.type}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2"><Hash size={12} /> Reference ID</span>
                                    <span className="text-[10px] font-bold text-slate-500 font-mono">{detailEvent.id}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setDetailEvent(null)} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-10 w-full text-xs mt-2">Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Export Confirm */}
            <Dialog open={isBulkExportOpen} onOpenChange={setIsBulkExportOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-6 max-w-sm shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Export All History?</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">A CSV containing all {history.length} history events across all employees will be downloaded.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setIsBulkExportOpen(false)} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button onClick={handleBulkExport} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-10 text-xs flex-1">Download CSV</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HistoryPage;
