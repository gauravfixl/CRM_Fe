"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { FileText, MoreHorizontal, Search, Filter, CheckCircle2, XCircle, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";

interface ProofSubmission {
    id: string;
    employeeName: string;
    employeeId: string;
    documentType: "HRA" | "LTA" | "80C" | "Medical" | "Other";
    amount: number;
    submittedDate: string;
    status: "Pending" | "Approved" | "Rejected";
}

const initialProofs: ProofSubmission[] = [
    { id: "PROOF-001", employeeName: "Rajesh Kumar", employeeId: "EMP-001", documentType: "HRA", amount: 60000, submittedDate: "Jan 20, 2024", status: "Pending" },
    { id: "PROOF-002", employeeName: "Priya Sharma", employeeId: "EMP-002", documentType: "80C", amount: 150000, submittedDate: "Jan 18, 2024", status: "Approved" },
    { id: "PROOF-003", employeeName: "Amit Patel", employeeId: "EMP-003", documentType: "Medical", amount: 15000, submittedDate: "Jan 15, 2024", status: "Rejected" },
    { id: "PROOF-004", employeeName: "Sneha Reddy", employeeId: "EMP-004", documentType: "LTA", amount: 25000, submittedDate: "Jan 22, 2024", status: "Approved" }
];

const ProofSubmissionPage = () => {
    const [proofs, setProofs] = useState<ProofSubmission[]>(initialProofs);
    const [activeTab, setActiveTab] = useState("all");
    const { toast } = useToast();

    const handleStatusChange = (id: string, newStatus: string) => {
        setProofs(proofs.map(p => p.id === id ? { ...p, status: newStatus as any } : p));
        toast({ title: "Status Updated", description: `Proof ${newStatus.toLowerCase()}.` });
    };

    const getFiltered = (tab: string) => {
        if (tab === "all") return proofs;
        if (tab === "pending") return proofs.filter(p => p.status === "Pending");
        if (tab === "approved") return proofs.filter(p => p.status === "Approved");
        if (tab === "rejected") return proofs.filter(p => p.status === "Rejected");
        return proofs;
    };

    const filtered = getFiltered(activeTab);

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            "Pending": "bg-amber-100 text-amber-700",
            "Approved": "bg-green-100 text-green-700",
            "Rejected": "bg-red-100 text-red-700"
        };
        return <Badge className={`border-none shadow-none font-medium px-2 py-0.5 ${styles[status]}`}>{status}</Badge>;
    };

    const TypeBadge = ({ type }: { type: string }) => {
        const styles: Record<string, string> = {
            "HRA": "bg-blue-100 text-blue-700",
            "LTA": "bg-purple-100 text-purple-700",
            "80C": "bg-indigo-100 text-indigo-700",
            "Medical": "bg-pink-100 text-pink-700",
            "Other": "bg-slate-100 text-slate-700"
        };
        return <Badge className={`border-none shadow-none font-medium px-2 py-0.5 ${styles[type]}`}>{type}</Badge>;
    };

    const formatCurrency = (amount: number) => `₹ ${amount.toLocaleString('en-IN')}`;

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Proof Submission</h2>
                    <p className="text-slate-500 text-sm mt-1">Verify employee tax-saving investment proofs.</p>
                </div>
            </div>

            <Tabs defaultValue="all" className="space-y-6 flex-1" onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full sm:w-auto overflow-x-auto justify-start h-auto rounded-none">
                        {["All", "Pending", "Approved", "Rejected"].map((tab) => (
                            <TabsTrigger key={tab.toLowerCase()} value={tab.toLowerCase()} className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium whitespace-nowrap">
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input type="search" placeholder="Search proofs..." className="pl-9 h-9 border-slate-200 bg-white shadow-sm" />
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
                                    <TableHead className="font-semibold text-slate-600">Document Type</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Amount</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Submitted Date</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length > 0 ? (
                                    filtered.map((proof) => (
                                        <TableRow key={proof.id} className="hover:bg-slate-50/50 group">
                                            <TableCell className="align-top py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{proof.employeeName}</span>
                                                    <span className="text-xs text-slate-500 mt-0.5">{proof.employeeId}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4"><TypeBadge type={proof.documentType} /></TableCell>
                                            <TableCell className="align-top py-4 text-slate-900 font-bold">{formatCurrency(proof.amount)}</TableCell>
                                            <TableCell className="align-top py-4 text-slate-600 text-sm">{proof.submittedDate}</TableCell>
                                            <TableCell className="align-top py-4"><StatusBadge status={proof.status} /></TableCell>
                                            <TableCell className="align-top py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => toast({ title: "Viewing Document", description: `Opening proof document for ${proof.employeeName}` })}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Document
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {proof.status === "Pending" && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => handleStatusChange(proof.id, "Approved")} className="text-green-600">
                                                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleStatusChange(proof.id, "Rejected")} className="text-red-600">
                                                                    <XCircle className="mr-2 h-4 w-4" /> Reject
                                                                </DropdownMenuItem>
                                                            </>
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
                                                <FileText className="h-10 w-10 text-slate-400 mb-3" />
                                                <p className="text-slate-900 font-medium">No proof submissions found</p>
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

export default ProofSubmissionPage;
