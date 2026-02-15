"use client"

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Download,
  Filter,
  Search,
  User,
  ArrowRightLeft,
  MoreHorizontal,
  LayoutGrid,
  Check,
  X,
  FileEdit,
  Settings,
  ShieldCheck
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
import { useAttendanceStore, AttendanceLog } from "@/shared/data/attendance-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

const MasterAttendancePage = () => {
  const { toast } = useToast();
  const {
    logs,
    approveRegularization,
    rejectRegularization
  } = useAttendanceStore();

  // Filtering State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All Departments");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterType, setFilterType] = useState<"All" | "Discrepancy" | "Regularization">("All");

  // Memoized filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.empId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = filterDept === "All Departments" || log.department === filterDept;
      const matchesStatus = filterStatus === "All Status" || log.status === filterStatus;

      let matchesType = true;
      if (filterType === "Discrepancy") matchesType = log.isDiscrepancy === true;
      if (filterType === "Regularization") matchesType = log.regularizationStatus === "Pending";

      return matchesSearch && matchesDept && matchesStatus && matchesType;
    });
  }, [logs, searchTerm, filterDept, filterStatus, filterType]);

  // Unique departments for filter
  const departments = useMemo(() => {
    return ["All Departments", ...Array.from(new Set(logs.map(l => l.department)))];
  }, [logs]);

  const statuses = ["All Status", "Present", "Absent", "Late", "Half Day", "On Leave", "Weekend"];

  // Handler functions
  const handleApprove = (logId: string, name: string) => {
    approveRegularization(logId);
    toast({ title: "Regularization Approved", description: `Attendance record for ${name} has been updated.` });
  };

  const handleReject = (logId: string, name: string) => {
    rejectRegularization(logId);
    toast({ title: "Request Rejected", description: `Regularization for ${name} was declined.`, variant: "destructive" });
  };

  const handleExport = () => {
    toast({ title: "Generating Report", description: "Master attendance log is being exported to Excel." });
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfdff] overflow-x-hidden overflow-y-auto">
      <div style={{
        zoom: '0.70',
        width: '100%',
      }} className="p-12 space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 pb-2 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tighter capitalize">Master Attendance Logs</h1>
            <p className="text-slate-500 font-bold text-base mt-0.5 ml-1">HR Admin: Oversee and regularize workforce time entries.</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-50 h-14 px-8"
              onClick={() => { localStorage.clear(); window.location.reload(); }}
            >
              <LayoutGrid size={18} className="mr-2" /> System reset
            </Button>
            <Button
              variant="outline"
              className="rounded-xl font-bold border-slate-200 text-slate-500 hover:bg-slate-50 h-14 px-8"
              onClick={handleExport}
            >
              <Download size={18} className="mr-2" /> Export master log
            </Button>
            <Button
              className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-black h-14 px-10 shadow-2xl shadow-purple-200"
            >
              <ShieldCheck size={18} className="mr-2" /> Compliance audit
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <Input
              className="h-14 pl-16 rounded-2xl bg-slate-50 border-none w-full font-bold text-lg placeholder:italic transition-all shadow-inner focus:bg-white focus:ring-2 focus:ring-[#CB9DF0]/20"
              placeholder="Identify employee or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-64 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-600">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl font-bold border-none shadow-2xl">
              {departments.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-64 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-600">
              <SelectValue placeholder="Work Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl font-bold border-none shadow-2xl">
              {statuses.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
            {[
              { id: "All", label: "All logs" },
              { id: "Discrepancy", label: "Anomalies" },
              { id: "Regularization", label: "Requests" }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setFilterType(t.id as any)}
                className={`px-6 py-3 rounded-xl font-bold text-xs transition-all tracking-tight
                                    ${filterType === t.id ? 'bg-white text-[#CB9DF0] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master Table */}
        <Card className="border border-slate-200 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white overflow-hidden p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/30">
                <th className="p-8 font-bold text-xs tracking-widest text-slate-400">Personnel info</th>
                <th className="p-8 font-bold text-xs tracking-widest text-slate-400">Date & shift</th>
                <th className="p-8 font-bold text-xs tracking-widest text-slate-400">Access log</th>
                <th className="p-8 font-bold text-xs tracking-widest text-slate-400">Status</th>
                <th className="p-8 font-bold text-xs tracking-widest text-slate-400">Anomalies</th>
                <th className="p-8 font-bold text-xs tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 mb-6">
                      <AlertCircle size={40} />
                    </div>
                    <p className="text-slate-300 font-bold text-xl uppercase tracking-tighter">No attendance records found.</p>
                  </td>
                </tr>
              ) : filteredLogs.map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <Avatar className="h-12 w-12 rounded-xl bg-[#F0C1E1] text-white font-black shadow-sm group-hover:scale-110 transition-transform">
                        <AvatarFallback>{log.empName[0]}{log.empName.split(' ')[1]?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-900 text-lg leading-tight">{log.empName}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">{log.empId}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-200" />
                          <span className="text-[10px] font-bold text-[#CB9DF0]">{log.department}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-700">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                      <p className="text-xs font-bold text-slate-400">General (09:30 - 18:30)</p>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-300 tracking-widest mb-1">In</p>
                        <p className="font-black text-slate-900 text-sm">{log.checkIn || '--:--'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] font-black text-slate-300 tracking-widest mb-1">Out</p>
                        <p className="font-black text-slate-900 text-sm">{log.checkOut || '--:--'}</p>
                      </div>
                      <div className="text-center bg-slate-50 px-3 py-1 rounded-lg">
                        <p className="text-[9px] font-bold text-slate-300 tracking-widest mb-1">Total</p>
                        <p className="font-bold text-indigo-600 text-sm">{log.totalHours}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <Badge className={`px-4 py-1.5 rounded-lg border-none font-bold text-[10px] shadow-sm
                                            ${log.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                        log.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                          log.status === 'Absent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-400'}`}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="p-8">
                    {log.isDiscrepancy ? (
                      <div className="flex items-center gap-2 text-rose-500 bg-rose-50 px-4 py-2 rounded-xl group-hover:scale-105 transition-transform animate-pulse border border-rose-100">
                        <AlertCircle size={14} />
                        <span className="text-[10px] font-black tracking-tight">Anomalies detected</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-500 opacity-30 group-hover:opacity-100 transition-opacity">
                        <CheckCircle2 size={14} />
                        <span className="text-[10px] font-black">Normalized</span>
                      </div>
                    )}
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {log.regularizationStatus === 'Pending' ? (
                        <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-2xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-right-4">
                          <p className="text-[10px] font-bold text-indigo-700 px-3">Review Request</p>
                          <Button
                            size="icon"
                            className="h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg"
                            onClick={() => handleApprove(log.id, log.empName)}
                          >
                            <Check size={18} />
                          </Button>
                          <Button
                            size="icon"
                            className="h-10 w-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-lg"
                            onClick={() => handleReject(log.id, log.empName)}
                          >
                            <X size={18} />
                          </Button>
                        </div>
                      ) : (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-slate-300 hover:text-[#CB9DF0]">
                            <FileEdit size={20} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-slate-300 hover:text-[#CB9DF0]">
                            <Settings size={20} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default MasterAttendancePage;
