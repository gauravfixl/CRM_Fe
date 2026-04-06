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
    Filter,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore, HistoryLog } from "@/shared/data/lifecycle-store";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";

type FilterType = "All" | "growth" | "exit";

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
    const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
    const [detailEvent, setDetailEvent] = useState<HistoryLog | null>(null);

    const selectedEmp = useMemo(
        () => employees.find((e) => e.id === selectedEmpId) || null,
        [employees, selectedEmpId]
    );

    const empHistory = useMemo(() => {
        if (!selectedEmpId) return [];
        return history
            .filter((h) => h.employeeId === selectedEmpId)
            .filter((h) => {
                if (filterType === "All") return true;
                if (filterType === "growth") return h.type === "growth";
                if (filterType === "exit") return h.type === "exit";
                return true;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [history, selectedEmpId, filterType]);

    const filteredEmployees = useMemo(() => {
        return employees.filter((e) =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employees, searchTerm]);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Stats
    const totalEvents = history.length;
    const growthEvents = history.filter(h => h.type === "growth").length;
    const exitEvents = history.filter(h => h.type === "exit").length;
    const totalEmployees = employees.length;

    const stats = [
        { label: "Total Events", value: totalEvents, color: "bg-[#CB9DF0]", icon: <Activity className="text-slate-800" size={20} /> },
        { label: "Growth Events", value: growthEvents, color: "bg-[#FFF9BF]", icon: <TrendingUp className="text-slate-800" size={20} /> },
        { label: "Exit Events", value: exitEvents, color: "bg-[#F0C1E1]", icon: <LogOut className="text-slate-800" size={20} /> },
        { label: "Total Employees", value: totalEmployees, color: "bg-[#FDDBBB]", icon: <Users className="text-slate-800" size={20} /> },
    ];

    const filters: { label: string; value: FilterType; icon: React.ReactNode }[] = [
        { label: "All Events", value: "All", icon: <Activity size={14} /> },
        { label: "Milestones", value: "growth", icon: <TrendingUp size={14} /> },
        { label: "Separations", value: "exit", icon: <LogOut size={14} /> },
    ];

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
            ``,
            `--- Timeline Events ---`,
            ...empHistory.map((e, i) =>
                `${i + 1}. [${formatDate(e.date)}] ${e.title} (${typeLabel[e.type] || e.type})\n   ${e.description}`
            ),
            ``,
            `Total Events: ${empHistory.length}`,
            `Generated: ${new Date().toLocaleDateString()}`,
        ];
        const blob = new Blob([lines.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `history_${selectedEmp.name.replace(/\s+/g, "_")}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded", description: "Employee history report has been downloaded." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Employee History</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 10: Complete chronological timeline of employee events.</p>
                </div>
                <div className="flex items-center gap-2">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilterType(f.value)}
                            className={`px-3 py-1.5 text-[10px] font-bold rounded-xl border transition-colors duration-150 flex items-center gap-1.5 ${filterType === f.value
                                ? "bg-[#8B5CF6] text-white border-[#8B5CF6]"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                                }`}
                        >
                            {f.icon}
                            {f.label}
                        </button>
                    ))}
                    {selectedEmp && (
                        <Button
                            variant="outline"
                            className="rounded-xl h-8 px-3 border-slate-200 text-slate-500 font-bold text-[10px] hover:bg-slate-50"
                            onClick={handleExportHistory}
                        >
                            <Download className="mr-1 h-3 w-3" /> Export
                        </Button>
                    )}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} relative overflow-hidden transition-all hover:shadow-md`}>
                            <CardContent className="p-5 flex items-center justify-between relative z-10">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-700">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-sm">{stat.icon}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Two-column layout */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Left panel - Employee list */}
                <div className="w-1/3 flex flex-col min-h-0">
                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-full">
                        {/* Search */}
                        <div className="p-3 border-b border-slate-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <Input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 rounded-xl h-9 text-xs font-bold border border-slate-200"
                                />
                            </div>
                        </div>

                        {/* Employee list */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                            {filteredEmployees.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                    <Users size={32} className="mb-2 text-slate-300" />
                                    <p className="text-sm font-medium">No employees found</p>
                                </div>
                            ) : (
                                filteredEmployees.map((emp) => {
                                    const isSelected = selectedEmpId === emp.id;
                                    const empEvents = history.filter(h => h.employeeId === emp.id).length;
                                    return (
                                        <button
                                            key={emp.id}
                                            onClick={() => setSelectedEmpId(emp.id)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors duration-150 ${isSelected
                                                ? "bg-slate-900 text-white"
                                                : "hover:bg-slate-50 text-slate-700"
                                                }`}
                                        >
                                            <Avatar className="h-9 w-9 rounded-xl flex-shrink-0">
                                                <AvatarFallback
                                                    className={
                                                        isSelected
                                                            ? "bg-[#8B5CF6] text-white text-xs font-bold"
                                                            : "bg-violet-100 text-violet-700 text-xs font-bold"
                                                    }
                                                >
                                                    {emp.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-semibold truncate ${isSelected ? "text-white" : "text-slate-800"}`}>
                                                    {emp.name}
                                                </p>
                                                <p className={`text-xs truncate ${isSelected ? "text-slate-400" : "text-slate-500"}`}>
                                                    {emp.role}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span
                                                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${isSelected
                                                        ? "bg-white/15 text-slate-300"
                                                        : statusBadgeStyles[emp.status] || "bg-slate-100 text-slate-600"
                                                        }`}
                                                >
                                                    {emp.status}
                                                </span>
                                                <span className={`text-[9px] font-bold ${isSelected ? "text-slate-400" : "text-slate-300"}`}>
                                                    {empEvents} events
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right panel */}
                <div className="w-2/3 flex flex-col min-h-0">
                    {selectedEmp ? (
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col h-full overflow-y-auto custom-scrollbar">
                            {/* Employee profile header */}
                            <div className="p-5 border-b border-slate-100">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-12 w-12 rounded-2xl flex-shrink-0">
                                        <AvatarFallback className="bg-[#8B5CF6] text-white text-lg font-bold">
                                            {selectedEmp.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-bold text-slate-900">{selectedEmp.name}</h2>
                                        <p className="text-sm text-slate-500">{selectedEmp.role} · {selectedEmp.department}</p>
                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1">
                                                <Calendar size={12} />
                                                Joined {formatDate(selectedEmp.joinDate)}
                                            </span>
                                            {selectedEmp.lwd && (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-full px-3 py-1">
                                                    <LogOut size={12} />
                                                    LWD {formatDate(selectedEmp.lwd)}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 bg-violet-50 border border-violet-200 rounded-full px-3 py-1">
                                                <Activity size={12} />
                                                {empHistory.length} event{empHistory.length !== 1 ? "s" : ""}
                                            </span>
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1 ${statusBadgeStyles[selectedEmp.status] || "bg-slate-100 text-slate-600"}`}>
                                                {selectedEmp.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="flex-1 p-5">
                                {empHistory.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                        <Clock size={32} className="mb-2 text-slate-300" />
                                        <p className="text-sm font-medium">No events found for this filter</p>
                                    </div>
                                ) : (
                                    <div className="relative pl-8">
                                        {/* Connector line */}
                                        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-slate-200" />

                                        <div className="space-y-5">
                                            {empHistory.map((event, idx) => (
                                                <motion.div
                                                    key={event.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="relative group"
                                                >
                                                    {/* Dot */}
                                                    <div
                                                        className={`absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm z-10 ${typeDotStyles[event.type] || "bg-slate-400"}`}
                                                    />

                                                    {/* Event card */}
                                                    <div
                                                        onClick={() => setDetailEvent(event)}
                                                        className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-150 cursor-pointer"
                                                    >
                                                        <div className="flex items-start justify-between gap-3 mb-1.5">
                                                            <h4 className="text-sm font-semibold text-slate-800">{event.title}</h4>
                                                            <span
                                                                className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${typeBadgeStyles[event.type] || "bg-slate-100 text-slate-600"}`}
                                                            >
                                                                {typeLabel[event.type] || event.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 leading-relaxed mb-2">{event.description}</p>
                                                        <p className="text-xs text-slate-400 font-medium">{formatDate(event.date)}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ) : (
                        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col items-center justify-center h-full text-slate-400">
                            <Users size={40} className="mb-3 text-slate-300" />
                            <p className="text-sm font-medium">Select an employee to view their timeline</p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Event detail dialog */}
            <Dialog open={!!detailEvent} onOpenChange={(open) => { if (!open) setDetailEvent(null); }}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 p-0 max-w-lg shadow-lg">
                    <div className="p-6">
                        <DialogHeader className="mb-5">
                            <DialogTitle className="text-lg font-bold text-slate-900">Event Details</DialogTitle>
                        </DialogHeader>
                        {detailEvent && (
                            <div className="space-y-4">
                                {/* Event info card */}
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        {detailEvent.type === "growth" && (
                                            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                                <ArrowUpRight size={16} className="text-emerald-600" />
                                            </div>
                                        )}
                                        {detailEvent.type === "exit" && (
                                            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                                                <LogOut size={16} className="text-red-600" />
                                            </div>
                                        )}
                                        {detailEvent.type === "neutral" && (
                                            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                                <Activity size={16} className="text-violet-600" />
                                            </div>
                                        )}
                                        {detailEvent.type === "warning" && (
                                            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                                <AlertTriangle size={16} className="text-amber-600" />
                                            </div>
                                        )}
                                        <h4 className="text-base font-semibold text-slate-800">{detailEvent.title}</h4>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed">{detailEvent.description}</p>
                                </div>

                                {/* Metadata */}
                                <div className="rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100">
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                            <Calendar size={13} /> Date
                                        </span>
                                        <span className="text-sm font-semibold text-slate-800">{formatDate(detailEvent.date)}</span>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                            <User size={13} /> Employee
                                        </span>
                                        <span className="text-sm font-semibold text-slate-800">{detailEvent.employeeName}</span>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                            <Briefcase size={13} /> Type
                                        </span>
                                        <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full ${typeBadgeStyles[detailEvent.type] || "bg-slate-100 text-slate-600"}`}>
                                            {typeLabel[detailEvent.type] || detailEvent.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                            <Hash size={13} /> Reference ID
                                        </span>
                                        <span className="text-xs font-medium text-slate-500 font-mono">{detailEvent.id}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HistoryPage;
