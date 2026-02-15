"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Calendar, CheckCircle2, XCircle, Plus, Search, FileText } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";

const LeavePage = () => {
    const { toast } = useToast();
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    // Dynamic Lists
    const [leaveRequests, setLeaveRequests] = useState([
        { id: "LV-001", employee: "Rajesh Kumar", type: "Casual Leave", from: "2024-01-22", to: "2024-01-23", days: 2, status: "Pending", reason: "Family Function" },
        { id: "LV-002", employee: "Priya Sharma", type: "Sick Leave", from: "2024-01-20", to: "2024-01-20", days: 1, status: "Approved", reason: "Viral Fever" }
    ]);

    const [balances, setBalances] = useState({ casual: 8, sick: 10, earned: 15 });

    // New Request State
    const [newLeave, setNewLeave] = useState({ type: "Casual Leave", from: "", to: "", reason: "" });

    // Handle Approval
    const handleAction = (id: string, newStatus: "Approved" | "Rejected") => {
        setLeaveRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status: newStatus } : req
        ));

        if (newStatus === "Approved") {
            const req = leaveRequests.find(r => r.id === id);
            toast({ title: "Request Approved", description: `Leave for ${req?.employee} has been confirmed.` });
        } else {
            toast({ title: "Request Rejected", description: "The leave request has been denied.", variant: "destructive" });
        }
    };

    // Handle New Application
    const handleApply = () => {
        if (!newLeave.from || !newLeave.to || !newLeave.reason) {
            toast({ title: "Error", description: "Please fill all fields.", variant: "destructive" });
            return;
        }

        const days = 1; // Simplified for mock
        const request = {
            id: `LV-00${leaveRequests.length + 1}`,
            employee: "Self (Current User)",
            type: newLeave.type,
            from: newLeave.from,
            to: newLeave.to,
            days: days,
            status: "Pending",
            reason: newLeave.reason
        };

        setLeaveRequests([request, ...leaveRequests]);
        setIsApplyModalOpen(false);
        setNewLeave({ type: "Casual Leave", from: "", to: "", reason: "" });
        toast({ title: "Application Submitted", description: "Your leave request is now pending approval." });
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            "Pending": "bg-amber-100 text-amber-700",
            "Approved": "bg-green-100 text-green-700",
            "Rejected": "bg-red-100 text-red-700"
        };
        return <Badge className={`border-none ${styles[status]}`}>{status}</Badge>;
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50 overflow-y-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Leave Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage employee leave requests and balances.</p>
                </div>

                <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#6366f1] hover:bg-[#5558e6]">
                            <Plus className="mr-2 h-4 w-4" /> Apply Leave
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Apply for Leave</DialogTitle>
                            <DialogDescription>Submit a new leave request for approval.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Leave Type</Label>
                                <Select value={newLeave.type} onValueChange={(v) => setNewLeave({ ...newLeave, type: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                                        <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>From Date</Label>
                                    <Input type="date" value={newLeave.from} onChange={(e) => setNewLeave({ ...newLeave, from: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label>To Date</Label>
                                    <Input type="date" value={newLeave.to} onChange={(e) => setNewLeave({ ...newLeave, to: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Reason</Label>
                                <Input value={newLeave.reason} onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })} placeholder="Why are you taking leave?" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
                            <Button className="bg-[#6366f1]" onClick={handleApply}>Submit Application</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                {[
                    { label: "Casual Leave", val: balances.casual, color: "blue" },
                    { label: "Sick Leave", val: balances.sick, color: "green" },
                    { label: "Earned Leave", val: balances.earned, color: "purple" },
                    { label: "Total Balance", val: balances.casual + balances.sick + balances.earned, color: "slate" }
                ].map((stat, i) => (
                    <Card key={i} className="shadow-sm border-slate-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold text-slate-500 uppercase">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-black text-${stat.color}-600`}>{stat.val}</div>
                            <p className="text-[10px] text-slate-400 mt-1">Available Days</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="leave-requests" className="space-y-6">
                <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full overflow-x-auto justify-start h-auto rounded-none">
                    {["Leave Requests", "Leave Calendar", "Policies"].map((tab) => (
                        <TabsTrigger key={tab.toLowerCase().replace(" ", "-")} value={tab.toLowerCase().replace(" ", "-")} className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium">
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="leave-requests" className="space-y-4 pt-2">
                    <Card className="shadow-sm border-slate-200">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leaveRequests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell>
                                                <div className="font-semibold text-slate-900">{req.employee}</div>
                                                <div className="text-xs text-slate-500">{req.reason}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-slate-50 border-slate-200 font-normal">{req.type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-slate-700">{req.from} to {req.to}</div>
                                                <div className="text-[10px] text-slate-400">{req.days} Day(s)</div>
                                            </TableCell>
                                            <TableCell><StatusBadge status={req.status} /></TableCell>
                                            <TableCell className="text-right">
                                                {req.status === "Pending" ? (
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" className="h-8 text-green-600 hover:bg-green-50 border-green-200" onClick={() => handleAction(req.id, "Approved")}>
                                                            <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="h-8 text-red-600 hover:bg-red-50 border-red-200" onClick={() => handleAction(req.id, "Rejected")}>
                                                            <XCircle className="h-4 w-4 mr-1" /> Reject
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button variant="ghost" size="sm" className="h-8 text-slate-400">View Details</Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default LeavePage;
