"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Clock, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";

const OvertimePage = () => {
    const [activeTab, setActiveTab] = useState("ot-requests");
    const { toast } = useToast();

    const otRequests = [
        { id: "OT-001", employee: "Rajesh Kumar", date: "Jan 18, 2024", hours: 3, reason: "Project deadline", status: "Pending" },
        { id: "OT-002", employee: "Priya Sharma", date: "Jan 17, 2024", hours: 2, reason: "Client meeting", status: "Pending" }
    ];

    const approvedOT = [
        { id: "OT-003", employee: "Amit Patel", date: "Jan 15, 2024", hours: 4, approvedBy: "Manager", payout: "₹ 2,400" },
        { id: "OT-004", employee: "Sneha Reddy", date: "Jan 14, 2024", hours: 2.5, approvedBy: "Manager", payout: "₹ 1,500" }
    ];

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
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Overtime Management</h2>
                <p className="text-slate-500 text-sm mt-1">Track and approve overtime requests.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full overflow-x-auto justify-start h-auto rounded-none">
                    {["OT Requests", "Approved OT", "OT Summary"].map((tab) => (
                        <TabsTrigger key={tab.toLowerCase().replace(" ", "-")} value={tab.toLowerCase().replace(" ", "-")} className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium whitespace-nowrap">
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* OT Requests */}
                <TabsContent value="ot-requests" className="space-y-4">
                    <div className="flex justify-end">
                        <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={() => toast({ title: "Request OT", description: "Opening OT request form..." })}>
                            Request OT
                        </Button>
                    </div>
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle>Pending OT Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Request ID</TableHead>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Hours</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {otRequests.map((ot) => (
                                        <TableRow key={ot.id}>
                                            <TableCell className="font-sans text-sm">{ot.id}</TableCell>
                                            <TableCell className="font-semibold">{ot.employee}</TableCell>
                                            <TableCell>{ot.date}</TableCell>
                                            <TableCell><Badge className="bg-blue-100 text-blue-700 border-none">{ot.hours}h</Badge></TableCell>
                                            <TableCell className="text-slate-600">{ot.reason}</TableCell>
                                            <TableCell><StatusBadge status={ot.status} /></TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="sm" variant="outline" className="text-green-600" onClick={() => toast({ title: "Approved", description: "OT request approved" })}>
                                                    <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-red-600" onClick={() => toast({ title: "Rejected", description: "OT request rejected" })}>
                                                    <XCircle className="h-4 w-4 mr-1" /> Reject
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Approved OT */}
                <TabsContent value="approved-ot" className="space-y-4">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle>Approved Overtime</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Request ID</TableHead>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Hours</TableHead>
                                        <TableHead>Approved By</TableHead>
                                        <TableHead>Payout</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {approvedOT.map((ot) => (
                                        <TableRow key={ot.id}>
                                            <TableCell className="font-sans text-sm">{ot.id}</TableCell>
                                            <TableCell className="font-semibold">{ot.employee}</TableCell>
                                            <TableCell>{ot.date}</TableCell>
                                            <TableCell><Badge className="bg-green-100 text-green-700 border-none">{ot.hours}h</Badge></TableCell>
                                            <TableCell className="text-slate-600">{ot.approvedBy}</TableCell>
                                            <TableCell className="font-bold text-slate-900">{ot.payout}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* OT Summary */}
                <TabsContent value="ot-summary" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-slate-600">Total OT Hours</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold text-slate-900">156h</div>
                                    <Clock className="h-8 w-8 text-blue-600" />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">This month</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-slate-600">Total Payout</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold text-slate-900">₹ 93,600</div>
                                    <TrendingUp className="h-8 w-8 text-green-600" />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">This month</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium text-slate-600">Avg. OT/Employee</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="text-2xl font-bold text-slate-900">2.8h</div>
                                    <TrendingUp className="h-8 w-8 text-purple-600" />
                                </div>
                                <p className="text-xs text-slate-500 mt-2">This month</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default OvertimePage;
