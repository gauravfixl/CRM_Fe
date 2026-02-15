"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CalendarCheck,
  Coffee,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
  TrendingUp,
  Download,
  UserPlus,
  Search,
  Filter
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useAttendanceStore } from "@/shared/data/attendance-store";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const TimeAttendDashboard = () => {
  const { toast } = useToast();
  const { logs, clockIn, clockOut } = useAttendanceStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    empId: "",
    empName: "",
    action: "in"
  });

  // Prevent Hydration Error
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock Team Data (In production, this would come from employee store)
  const teamMembers = [
    { id: "EMP001", name: "Drashi Garg", status: "In", time: "09:28 AM", avatar: "DG", dept: "Engineering" },
    { id: "EMP002", name: "Aditya Singh", status: "In", time: "09:30 AM", avatar: "AS", dept: "Sales" },
    { id: "EMP003", name: "Rohan Gupta", status: "Late", time: "10:15 AM", avatar: "RG", dept: "Engineering" },
    { id: "EMP004", name: "Sneha Kapoor", status: "Absent", time: "--", avatar: "SK", dept: "HR" },
    { id: "EMP005", name: "Vikram Malhotra", status: "In", time: "09:45 AM", avatar: "VM", dept: "Product" },
    { id: "EMP006", name: "Priya Sharma", status: "Leave", time: "--", avatar: "PS", dept: "Marketing" },
  ];

  const handleManualEntry = () => {
    if (!manualEntry.empId || !manualEntry.empName) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    if (manualEntry.action === "in") {
      clockIn(manualEntry.empId, manualEntry.empName);
      toast({ title: "Attendance Marked", description: `${manualEntry.empName} clocked in successfully.` });
    } else {
      clockOut(manualEntry.empId);
      toast({ title: "Checkout Recorded", description: `${manualEntry.empName} clocked out.` });
    }

    setIsManualEntryOpen(false);
    setManualEntry({ empId: "", empName: "", action: "in" });
  };

  if (!isMounted) return <div className="p-8">Loading Dashboard...</div>;

  // Calculate Stats
  const presentCount = teamMembers.filter(m => m.status === 'In').length;
  const lateCount = teamMembers.filter(m => m.status === 'Late').length;
  const absentCount = teamMembers.filter(m => m.status === 'Absent').length;
  const onLeaveCount = teamMembers.filter(m => m.status === 'Leave').length;

  const stats = [
    { label: "Present Today", value: presentCount, color: "bg-[#CB9DF0]", icon: <UserCheck className="text-slate-800" />, textColor: "text-slate-900" },
    { label: "Late Arrivals", value: lateCount, color: "bg-[#F0C1E1]", icon: <Clock className="text-slate-800" />, textColor: "text-slate-900" },
    { label: "On Leave", value: onLeaveCount, color: "bg-[#FFF9BF]", icon: <Coffee className="text-slate-800" />, textColor: "text-slate-900" },
    { label: "Absent", value: absentCount, color: "bg-rose-100", icon: <AlertTriangle className="text-rose-600" />, textColor: "text-rose-900" },
  ];

  return (
    <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Attendance</h1>
          <p className="text-slate-500 font-medium">Monitor and manage workforce attendance in real-time.</p>
        </div>

        <div className="flex gap-3">
          <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                <UserPlus className="mr-2 h-5 w-5" /> Manual Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-[2rem] border-none p-8">
              <DialogHeader>
                <DialogTitle>Manual Attendance Entry</DialogTitle>
                <DialogDescription>Mark attendance for employees who forgot to punch or had biometric issues.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <Input
                    placeholder="e.g. EMP007"
                    value={manualEntry.empId}
                    onChange={e => setManualEntry({ ...manualEntry, empId: e.target.value })}
                    className="rounded-xl bg-slate-50 border-none h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Employee Name</Label>
                  <Input
                    placeholder="e.g. Rahul Verma"
                    value={manualEntry.empName}
                    onChange={e => setManualEntry({ ...manualEntry, empName: e.target.value })}
                    className="rounded-xl bg-slate-50 border-none h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select value={manualEntry.action} onValueChange={v => setManualEntry({ ...manualEntry, action: v })}>
                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Clock In</SelectItem>
                      <SelectItem value="out">Clock Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleManualEntry}>
                  Submit Entry
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="rounded-xl h-12 border-slate-200 font-bold text-slate-600 hover:bg-slate-50">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4`}>
              <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                {stat.icon}
              </div>
              <div>
                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Live Team Status */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h3 className="font-black text-xl text-slate-900">Live Team Status</h3>
            <p className="text-sm text-slate-500 font-medium">Real-time attendance tracking for {currentTime.toLocaleDateString()}</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Search employee..." className="pl-10 rounded-xl bg-slate-50 border-none h-10 w-64" />
            </div>
            <Button variant="outline" size="icon" className="rounded-xl border-slate-200">
              <Filter size={18} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-4 border border-slate-100 rounded-[1.5rem] hover:shadow-md transition-all bg-white group">
              <div className="flex items-center gap-4">
                <Avatar className={`h-12 w-12 font-bold ${member.status === 'In' ? 'bg-emerald-100 text-emerald-700' :
                    member.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                      member.status === 'Leave' ? 'bg-blue-100 text-blue-700' :
                        'bg-rose-100 text-rose-700'
                  }`}>
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{member.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{member.dept}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                <Badge className={`border-none font-bold text-xs ${member.status === 'In' ? 'bg-emerald-100 text-emerald-700' :
                    member.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                      member.status === 'Leave' ? 'bg-blue-100 text-blue-700' :
                        'bg-rose-100 text-rose-700'
                  }`}>
                  {member.status}
                </Badge>
                <span className="text-xs text-slate-500 font-bold font-mono">{member.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
          <h3 className="font-black text-xl mb-6">Department Attendance Rate</h3>
          <div className="space-y-4">
            <DeptBar name="Engineering" rate={92} color="from-[#CB9DF0] to-violet-500" />
            <DeptBar name="Sales" rate={88} color="from-[#F0C1E1] to-pink-500" />
            <DeptBar name="Product" rate={95} color="from-emerald-400 to-emerald-600" />
            <DeptBar name="HR & Admin" rate={100} color="from-amber-400 to-orange-500" />
          </div>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white p-8">
          <h3 className="font-black text-xl text-slate-900 mb-6">Pending Actions</h3>
          <div className="space-y-3">
            <ActionItem icon={<AlertTriangle className="text-amber-500" />} title="3 Regularization Requests" action="Review" />
            <ActionItem icon={<Clock className="text-indigo-500" />} title="5 Late Punch-ins Today" action="View" />
            <ActionItem icon={<CheckCircle2 className="text-emerald-500" />} title="Weekly Report Ready" action="Download" />
          </div>
        </Card>
      </div>
    </div>
  );
};

function DeptBar({ name, rate, color }: any) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2 opacity-80">
        <span>{name}</span>
        <span>{rate}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${rate}%` }} />
      </div>
    </div>
  );
}

function ActionItem({ icon, title, action }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <span className="font-bold text-slate-900 text-sm">{title}</span>
      </div>
      <Button variant="ghost" size="sm" className="text-indigo-600 font-bold group-hover:bg-indigo-50">
        {action}
      </Button>
    </div>
  );
}

export default TimeAttendDashboard;
