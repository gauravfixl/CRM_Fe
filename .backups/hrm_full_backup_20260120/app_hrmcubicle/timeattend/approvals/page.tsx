"use client"

import React from "react";
import { CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useAttendanceStore } from "@/shared/data/attendance-store";
import { useToast } from "@/shared/components/ui/use-toast";

const AttendanceApprovalsPage = () => {
    const { logs, approveRegularization } = useAttendanceStore();
    const { toast } = useToast();

    // Filter logs with Pending Regularization
    const pendingRequests = logs.filter(l => l.regularizationStatus === 'Pending');

    const handleApprove = (id: string) => {
        approveRegularization(id);
        toast({ title: "Approved", description: "Attendance record updated." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Approvals</h1>
                <p className="text-slate-500 font-medium text-sm mt-1">Review correction requests from team.</p>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <AlertTriangle size={20} />
                    </div>
                    <h3 className="font-black text-xl text-slate-900">Pending Requests ({pendingRequests.length})</h3>
                </div>

                {pendingRequests.length === 0 ? (
                    <div className="text-center p-12 bg-slate-50 rounded-3xl">
                        <p className="text-slate-400 font-bold">All caught up! No pending requests.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingRequests.map(req => (
                            <div key={req.id} className="p-6 border border-slate-100 rounded-[1.5rem] hover:shadow-lg transition-all bg-white group flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge className="bg-slate-900 text-white border-none">{req.empName}</Badge>
                                        <span className="text-sm font-bold text-slate-500">{new Date(req.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-700 font-medium"><span className="text-slate-400 font-bold text-xs uppercase tracking-wider mr-2">Reason:</span> {req.remark}</p>
                                    <div className="flex gap-4 mt-2 text-xs font-bold text-slate-400">
                                        <span>Logged In: {req.checkIn || '--'}</span>
                                        <span>Logged Out: {req.checkOut || '--'}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold h-10" onClick={() => handleApprove(req.id)}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                                    </Button>
                                    <Button variant="ghost" className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl font-bold h-10">
                                        <XCircle className="mr-2 h-4 w-4" /> Reject
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AttendanceApprovalsPage;
