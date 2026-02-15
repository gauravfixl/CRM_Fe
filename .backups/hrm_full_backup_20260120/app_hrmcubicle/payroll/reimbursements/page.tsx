"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Receipt, MoreHorizontal, Search, Filter, CheckCircle2, XCircle, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";

interface Reimbursement {
    id: string;
    employeeName: string;
    employeeId: string;
    type: "Travel" | "Medical" | "Food" | "Other";
    amount: number;
    submittedDate: string;
    status: "Pending" | "Approved" | "Rejected" | "Paid";
}

const initialReimbursements: Reimbursement[] = [
    { id: "REIMB-001", employeeName: "Rajesh Kumar", employeeId: "EMP-001", type: "Travel", amount: 5000, submittedDate: "Jan 25, 2024", status: "Pending" },
    { id: "REIMB-002", employeeName: "Priya Sharma", employeeId: "EMP-002", type: "Medical", amount: 12000, submittedDate: "Jan 22, 2024", status: "Approved" },
    { id: "REIMB-003", employeeName: "Amit Patel", employeeId: "EMP-003", type: "Food", amount: 800, submittedDate: "Jan 20, 2024", status: "Paid" },
    { id: "REIMB-004", employeeName: "Sneha Reddy", employeeId: "EMP-004", type: "Travel", amount: 3500, submittedDate: "Jan 18, 2024", status: "Rejected" }
];

const ReimbursementsPage = () => {
    const [reimbursements, setReimbursements] = useState<Reimbursement[]>(initialReimbursements);
    const [activeTab, setActiveTab] = useState("all");
    const { toast } = useToast();

    const handleStatusChange = (id: string, newStatus: string) => {
        setReimbursements(reimbursements.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
        toast({ title: "Status Updated", description: `Reimbursement ${newStatus.toLowerCase()}.` });
    };

    const getFiltered = (tab: string) => {
        if (tab === "all") return reimbursements;
        if (tab === "pending") return reimbursements.filter(r => r.status === "Pending");
        if (tab === "approved") return reimbursements.filter(r => r.status === "Approved");
        if (tab === "rejected") return reimbursements.filter(r => r.status === "Rejected");
        if (tab === "paid") return reimbursements.filter(r => r.status === "Paid");
        return reimbursements;
    };

    const filtered = getFiltered(activeTab);

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            "Pending": "bg-amber-100 text-amber-700",
            "Approved": "bg-green-100 text-green-700",
            "Rejected": "bg-red-100 text-red-700",
            "Paid": "bg-blue-100 text-blue-700"
        };
        return <Badge className={`border-none shadow-none font-medium px-2 py-0.5 ${styles[status]}`}>{status}</Badge>;
    };

    const TypeBadge = ({ type }: { type: string }) => {
        const styles: Record<string, string> = {
            "Travel": "bg-purple-100 text-purple-700",
            "Medical": "bg-pink-100 text-pink-700",
            "Food": "bg-orange-100 text-orange-700",
            "Other": "bg-slate-100 text-slate-700"
        };
        return <Badge className={`border-none shadow-none font-medium px-2 py-0.5 ${styles[type]}`}>{type}</Badge>;
    };

    const formatCurrency = (amount: number) => `₹ ${amount.toLocaleString('en-IN')}`;

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Reimbursements</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage employee reimbursement claims.</p>
                </div>
            </div>

            <Tabs defaultValue="all" className="space-y-6 flex-1" onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full sm:w-auto overflow-x-auto justify-start h-auto rounded-none">
                        {["All", "Pending", "Approved", "Rejected", "Paid"].map((tab) => (
                            <TabsTrigger key={tab.toLowerCase()} value={tab.toLowerCase()} className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium whitespace-nowrap">
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input type="search" placeholder="Search claims..." className="pl-9 h-9 border-slate-200 bg-white shadow-sm" />
                        </div>
                        <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 shadow-sm">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                    </div>
                </div>

                <TabsContent value={activeTab} className="h-full mt-0">
                    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow className="hover:bg-slate-50">
                                    <TableHead className="font-semibold text-slate-600 w-[200px]">Employee</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Type</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Amount</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Submitted Date</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length > 0 ? (
                                    filtered.map((reimb) => (
                                        <TableRow key={reimb.id} className="hover:bg-slate-50/50 group">
                                            <TableCell className="align-top py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{reimb.employeeName}</span>
                                                    <span className="text-xs text-slate-500 mt-0.5">{reimb.employeeId}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4"><TypeBadge type={reimb.type} /></TableCell>
                                            <TableCell className="align-top py-4 text-slate-900 font-bold">{formatCurrency(reimb.amount)}</TableCell>
                                            <TableCell className="align-top py-4 text-slate-600 text-sm">{reimb.submittedDate}</TableCell>
                                            <TableCell className="align-top py-4"><StatusBadge status={reimb.status} /></TableCell>
                                            <TableCell className="align-top py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => toast({ title: "Viewing Details", description: `Opening claim details for ${reimb.employeeName}` })}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {reimb.status === "Pending" && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => handleStatusChange(reimb.id, "Approved")} className="text-green-600">
                                                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleStatusChange(reimb.id, "Rejected")} className="text-red-600">
                                                                    <XCircle className="mr-2 h-4 w-4" /> Reject
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                        {reimb.status === "Approved" && (
                                                            <DropdownMenuItem onClick={() => handleStatusChange(reimb.id, "Paid")} className="text-blue-600">
                                                                <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Paid
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Receipt className="h-10 w-10 text-slate-400 mb-3" />
                                                <p className="text-slate-900 font-medium">No reimbursements found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ReimbursementsPage;
