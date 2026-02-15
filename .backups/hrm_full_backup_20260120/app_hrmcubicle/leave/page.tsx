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

const MyLeavePage = () => {
  const { toast } = useToast();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    {
      id: '1',
      type: 'Casual Leave',
      startDate: '2026-01-25',
      endDate: '2026-01-27',
      days: 3,
      reason: 'Family function',
      status: 'Pending',
      appliedOn: new Date().toISOString()
    },
    {
      id: '2',
      type: 'Sick Leave',
      startDate: '2026-01-15',
      endDate: '2026-01-16',
      days: 2,
      reason: 'Fever',
      status: 'Approved',
      appliedOn: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const leaveBalance = [
    { label: "Casual Leave", value: 8, total: 12, color: "bg-[#CB9DF0]" },
    { label: "Sick Leave", value: 10, total: 12, color: "bg-emerald-100" },
    { label: "Earned Leave", value: 15, total: 24, color: "bg-[#F0C1E1]" },
    { label: "Total Balance", value: 33, total: 48, color: "bg-[#FFF9BF]" },
  ];

  const handleApply = () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }

    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const newLeave: LeaveRequest = {
      id: Date.now().toString(),
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      days,
      reason: leaveForm.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString()
    };

    setLeaves([newLeave, ...leaves]);
    setIsApplyOpen(false);
    setLeaveForm({
      type: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: ''
    });
    toast({ title: "Application Submitted", description: `Applied for ${days} days of ${leaveForm.type}.` });
  };

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this leave application?")) {
      setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'Cancelled' } : l));
      toast({ title: "Leave Cancelled", description: "Your request has been cancelled." });
    }
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
    <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Leave</h1>
          <p className="text-slate-500 font-medium">Manage your leave applications and check balances.</p>
        </div>

        <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
              <Plus className="mr-2 h-5 w-5" /> Apply for Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-[2rem] border-none p-8 max-w-xl">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaveBalance.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center justify-between`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-700 opacity-60">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900">{stat.value} / <span className="text-lg opacity-50">{stat.total}</span></h3>
              </div>
              <div className="h-12 w-12 bg-white/30 rounded-2xl flex items-center justify-center">
                <Palmtree className="text-slate-800" size={24} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Leave History */}
      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
        <h2 className="text-xl font-black text-slate-900 mb-6 font-display">Leave History</h2>
        <div className="space-y-4">
          {leaves.map((leave, i) => (
            <motion.div key={leave.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <div className="p-6 bg-slate-50 rounded-[1.8rem] hover:bg-slate-100 transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <CalendarDays className="text-indigo-400 font-black" size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-black text-xl text-slate-900">{leave.type}</h3>
                        <Badge className="bg-indigo-50 text-indigo-700 border-none font-bold px-3">
                          {leave.days} {leave.days === 1 ? 'day' : 'days'}
                        </Badge>
                      </div>
                      <p className="font-bold text-slate-600 mb-1">
                        {new Date(leave.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(leave.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">Applied on {new Date(leave.appliedOn).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(leave.status)}
                    {leave.status === 'Pending' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white transition-colors">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-rose-600 font-bold" onClick={() => handleCancel(leave.id)}>
                            <Trash2 size={14} className="mr-2" /> Cancel Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 leading-relaxed"><span className="font-black text-slate-400 uppercase text-[10px] tracking-widest mr-2">Reason:</span> {leave.reason}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MyLeavePage;
