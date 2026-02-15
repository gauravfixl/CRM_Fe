"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Palmtree,
  Trash2,
  MoreVertical,
  CalendarDays
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useToast } from "@/shared/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  appliedOn: string;
}

import { useMeStore } from "@/shared/data/me-store";

const MyLeavePage = () => {
  const { toast } = useToast();
  const { leave, addLeaveRequest, cancelLeaveRequest } = useMeStore();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [leaveForm, setLeaveForm] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleApply = () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }

    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);

    if (end < start) {
      toast({
        title: "Invalid Dates",
        description: "End date cannot be earlier than start date.",
        variant: "destructive"
      });
      return;
    }

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    addLeaveRequest({
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      days,
      reason: leaveForm.reason
    });

    setIsApplyOpen(false);
    setLeaveForm({ type: 'Casual Leave', startDate: '', endDate: '', reason: '' });
    toast({ title: "Application Submitted", description: `Applied for ${days} days of ${leaveForm.type}.` });
  };

  const handleCancel = (id: string) => {
    cancelLeaveRequest(id);
    toast({ title: "Leave Cancelled", description: "Your request has been cancelled." });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending': return <Badge className="bg-blue-100 text-blue-700 border-none font-bold">Pending Approval</Badge>;
      case 'Approved': return <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold">Approved</Badge>;
      case 'Rejected': return <Badge className="bg-rose-100 text-rose-700 border-none font-bold">Rejected</Badge>;
      case 'Cancelled': return <Badge className="bg-slate-100 text-slate-500 border-none font-bold">Cancelled</Badge>;
      default: return null;
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 font-sans" style={{ zoom: "80%" }}>
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Leave</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your leave applications and check balances.</p>
        </div>

        <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-6 shadow-lg font-bold border-none">
              <Plus className="mr-2 h-5 w-5" /> Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-2xl border-none p-6 max-w-xl">
            <DialogHeader>
              <DialogTitle>Apply for Leave</DialogTitle>
              <DialogDescription>Submit a new leave application to your manager.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label>Leave Type *</Label>
                <Select value={leaveForm.type} onValueChange={(v) => setLeaveForm({ ...leaveForm, type: v })}>
                  <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                    <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                    <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="rounded-xl bg-slate-50 border-none h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="rounded-xl bg-slate-50 border-none h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reason *</Label>
                <Textarea
                  placeholder="Why are you taking leave?"
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className="rounded-xl bg-slate-50 border-none min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleApply}>
                Submit Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {leave.balances.map((stat, i) => {
          const getColor = (type: string) => {
            switch (type) {
              case 'Casual Leave': return '#E0E7FF'; // Indigo 100
              case 'Sick Leave': return '#E0F2FE';   // Sky 100
              case 'Earned Leave': return '#D1FAE5';  // Emerald 100
              default: return '#F1F5F9';
            }
          };

          const getBorderColor = (type: string) => {
            switch (type) {
              case 'Casual Leave': return 'border-indigo-200';
              case 'Sick Leave': return 'border-sky-200';
              case 'Earned Leave': return 'border-emerald-200';
              default: return 'border-slate-200';
            }
          };

          const getIconColor = (type: string) => {
            switch (type) {
              case 'Casual Leave': return 'text-indigo-600';
              case 'Sick Leave': return 'text-sky-600';
              case 'Earned Leave': return 'text-emerald-600';
              default: return 'text-slate-600';
            }
          };

          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card
                className={`border-2 ${getBorderColor(stat.type)} shadow-sm rounded-2xl p-5 flex items-center justify-between transition-all hover:shadow-md hover:scale-[1.02] transform cursor-default`}
                style={{ backgroundColor: getColor(stat.type) }}
              >
                <div>
                  <p className="text-[11px] font-bold capitalize tracking-wide text-slate-600 mb-1 opacity-80">{stat.type}</p>
                  <div className="flex items-baseline gap-1">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      {stat.total - stat.consumed}
                    </h3>
                    <span className="text-sm font-bold text-slate-500">/ {stat.total}</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-white/60 rounded-xl flex items-center justify-center shadow-inner border border-white/50">
                  <Palmtree className={getIconColor(stat.type)} size={24} />
                </div>
              </Card>
            </motion.div>
          );
        })}
        {/* Total Balance Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card
            className="border-2 border-rose-200 shadow-sm rounded-2xl p-5 flex items-center justify-between bg-[#FFE4E6] transition-all hover:shadow-md hover:scale-[1.02] transform cursor-default"
          >
            <div>
              <p className="text-[11px] font-bold capitalize tracking-wide text-slate-600 mb-1 opacity-80">Total Balance</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {leave.balances.reduce((acc, curr) => acc + (curr.total - curr.consumed), 0)}
                </h3>
                <span className="text-sm font-bold text-slate-500">/ {leave.balances.reduce((acc, curr) => acc + curr.total, 0)}</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-white/60 rounded-xl flex items-center justify-center shadow-inner border border-white/50">
              <Calendar className="text-rose-600" size={24} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Leave History */}
      <Card className="border-none shadow-xl rounded-3xl bg-white p-8 w-fit min-w-[850px] overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Leave History</h2>
            <p className="text-xs font-bold text-slate-400 mt-1">Track and manage your past applications</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {(() => {
            const filteredRequests = leave.requests.filter(r =>
              activeTab === 'All' ? true : r.status === activeTab
            );

            if (filteredRequests.length === 0) {
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200"
                >
                  <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-6 ring-4 ring-slate-50">
                    <CalendarDays className="text-slate-200" size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} requests found</h3>
                  <p className="text-sm font-bold text-slate-400 max-w-[280px]">
                    {activeTab === 'All'
                      ? "You haven't applied for any leaves yet. Click the button above to start."
                      : `There are no ${activeTab.toLowerCase()} leave applications at the moment.`}
                  </p>
                </motion.div>
              );
            }

            return filteredRequests.map((leave, i) => (
              <motion.div key={leave.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="p-6 bg-slate-50/30 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 ring-1 ring-slate-100">
                        <CalendarDays className="text-indigo-500" size={28} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg text-slate-900 tracking-tight">{leave.type}</h3>
                          <Badge className="bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold px-2.5 py-0.5 h-6 text-[10px] rounded-lg">
                            {leave.days} {leave.days === 1 ? 'Day' : 'Days'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100">
                            <Clock size={12} className="text-indigo-400" />
                            <span>{new Date(leave.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(leave.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <span className="opacity-40">•</span>
                          <span>Applied on {new Date(leave.appliedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      {getStatusBadge(leave.status)}
                      {leave.status === 'Pending' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all">
                              <MoreVertical size={18} className="text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-slate-200">
                            <DropdownMenuItem className="text-rose-600 font-bold p-3 rounded-lg cursor-pointer focus:bg-rose-50" onClick={() => handleCancel(leave.id)}>
                              <Trash2 size={16} className="mr-2" /> Cancel Request
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-3">
                    <span className="shrink-0 font-bold text-slate-400 uppercase text-[9px] tracking-widest mt-0.5">Reason</span>
                    <p className="text-[13px] font-bold text-slate-600 leading-relaxed">"{leave.reason}"</p>
                  </div>
                </div>
              </motion.div>
            ));
          })()}
        </div>
      </Card>
    </div>
  );
};

export default MyLeavePage;
