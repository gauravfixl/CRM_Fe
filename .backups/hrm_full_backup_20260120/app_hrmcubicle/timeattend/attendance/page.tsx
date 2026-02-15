"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  AlertAngle as AlertTriangle,
  FileEdit,
  CheckCircle2,
  XCircle,
  Download,
  Filter
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useAttendanceStore } from "@/shared/data/attendance-store";
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
import { Textarea } from "@/shared/components/ui/textarea";

const AttendanceHistoryPage = () => {
  const { logs, requestRegularization } = useAttendanceStore();
  const { toast } = useToast();
  const [selectedLogId, setSelectedLogId] = useState("");
  const [reason, setReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRegularize = () => {
    if (!reason) {
      toast({ title: "Error", description: "Please enter a reason", variant: "destructive" });
      return;
    }
    requestRegularization(selectedLogId, reason);
    setIsDialogOpen(false);
    setReason("");
    toast({ title: "Request Sent", description: "Manager will approve shortly." });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present': return "bg-emerald-100 text-emerald-700";
      case 'Absent': return "bg-rose-100 text-rose-700";
      case 'Half Day': return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-500";
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Access History</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Review your daily logs and timesheets.</p>
        </div>
        <Button variant="outline" className="rounded-xl h-12 border-slate-200 font-bold text-slate-600 hover:bg-slate-50">
          <Download className="mr-2 h-4 w-4" /> Download Report
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white rounded-[2rem] border-none p-8">
          <DialogHeader>
            <DialogTitle>Regularize Attendance</DialogTitle>
            <DialogDescription>Request correction for missed punches or wrong hours.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Reason (e.g. Forgot to check-in, Biometric issue)"
              className="bg-slate-50 border-none rounded-xl min-h-[100px]"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleRegularize}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden p-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="p-4">Date</th>
              <th className="p-4">Shift</th>
              <th className="p-4">Log</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium text-slate-600">
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-[#F0C1E1]/20 rounded-xl flex items-center justify-center text-[#F0C1E1] font-bold">
                      {new Date(log.date).getDate()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short' })}</p>
                      <p className="text-xs text-slate-400">{new Date(log.date).getFullYear()}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  General (09:30 - 18:30)
                </td>
                <td className="p-4">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">In</p>
                      <p className="font-bold text-slate-900">{log.checkIn || '--:--'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Out</p>
                      <p className="font-bold text-slate-900">{log.checkOut || '--:--'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Hrs</p>
                      <p className="font-bold text-indigo-600">{log.totalHours}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge className={`border-none font-bold ${getStatusColor(log.status)}`}>
                    {log.status}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  {log.regularizationStatus === 'Pending' ? (
                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 font-bold">Pending Approval</Badge>
                  ) : log.regularizationStatus === 'Approved' ? (
                    <span className="text-emerald-500 font-bold text-xs flex items-center justify-end gap-1"><CheckCircle2 size={14} /> Regularized</span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 font-bold"
                      onClick={() => { setSelectedLogId(log.id); setIsDialogOpen(true); }}
                    >
                      Regularize
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AttendanceHistoryPage;
