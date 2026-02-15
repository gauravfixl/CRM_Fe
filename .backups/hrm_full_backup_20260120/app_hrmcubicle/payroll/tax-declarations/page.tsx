"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { FileCheck, MoreHorizontal, Search, Filter, Eye, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";

interface TaxDeclaration {
    id: string;
    employeeName: string;
    employeeId: string;
    regime: "Old" | "New";
    declaredAmount: number;
    submittedDate: string;
    status: "Pending" | "Submitted" | "Verified";
}

const initialDeclarations: TaxDeclaration[] = [
    { id: "TAX-001", employeeName: "Rajesh Kumar", employeeId: "EMP-001", regime: "Old", declaredAmount: 150000, submittedDate: "Jan 15, 2024", status: "Submitted" },
    { id: "TAX-002", employeeName: "Priya Sharma", employeeId: "EMP-002", regime: "New", declaredAmount: 0, submittedDate: "Jan 12, 2024", status: "Verified" },
    { id: "TAX-003", employeeName: "Amit Patel", employeeId: "EMP-003", regime: "Old", declaredAmount: 120000, submittedDate: "-", status: "Pending" },
    { id: "TAX-004", employeeName: "Sneha Reddy", employeeId: "EMP-004", regime: "Old", declaredAmount: 180000, submittedDate: "Jan 10, 2024", status: "Verified" }
];

const TaxDeclarationsPage = () => {
    const [declarations, setDeclarations] = useState<TaxDeclaration[]>(initialDeclarations);
    const [activeTab, setActiveTab] = useState("all");
    const { toast } = useToast();

    const handleStatusChange = (id: string, newStatus: string) => {
        setDeclarations(declarations.map(d => d.id === id ? { ...d, status: newStatus as any } : d));
        toast({ title: "Status Updated", description: `Declaration ${newStatus.toLowerCase()}.` });
    };

    const getFiltered = (tab: string) => {
        if (tab === "all") return declarations;
        if (tab === "pending") return declarations.filter(d => d.status === "Pending");
        if (tab === "submitted") return declarations.filter(d => d.status === "Submitted");
        if (tab === "verified") return declarations.filter(d => d.status === "Verified");
        return declarations;
    };

    const filtered = getFiltered(activeTab);

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            "Pending": "bg-amber-100 text-amber-700",
            "Submitted": "bg-blue-100 text-blue-700",
            "Verified": "bg-green-100 text-green-700"
        };
        return <Badge className={`border-none shadow-none font-medium px-2 py-0.5 ${styles[status]}`}>{status}</Badge>;
    };

    const RegimeBadge = ({ regime }: { regime: string }) => {
        const styles: Record<string, string> = {
            "Old": "bg-purple-100 text-purple-700",
            "New": "bg-indigo-100 text-indigo-700"
        };
        return <Badge className={`border-none shadow-none font-medium px-2 py-0.5 ${styles[regime]}`}>{regime} Regime</Badge>;
    };

    const formatCurrency = (amount: number) => `₹ ${amount.toLocaleString('en-IN')}`;

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Tax Declarations</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage employee tax declarations and regime selection.</p>
                </div>
            </div>

            <Tabs defaultValue="all" className="space-y-6 flex-1" onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full sm:w-auto overflow-x-auto justify-start h-auto rounded-none">
                        {["All", "Pending", "Submitted", "Verified"].map((tab) => (
                            <TabsTrigger key={tab.toLowerCase()} value={tab.toLowerCase()} className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium whitespace-nowrap">
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input type="search" placeholder="Search declarations..." className="pl-9 h-9 border-slate-200 bg-white shadow-sm" />
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
                                    <TableHead className="font-semibold text-slate-600">Tax Regime</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Declared Amount</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Submitted Date</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length > 0 ? (
                                    filtered.map((decl) => (
                                        <TableRow key={decl.id} className="hover:bg-slate-50/50 group">
                                            <TableCell className="align-top py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{decl.employeeName}</span>
                                                    <span className="text-xs text-slate-500 mt-0.5">{decl.employeeId}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4"><RegimeBadge regime={decl.regime} /></TableCell>
                                            <TableCell className="align-top py-4 text-slate-900 font-bold">{formatCurrency(decl.declaredAmount)}</TableCell>
                                            <TableCell className="align-top py-4 text-slate-600 text-sm">{decl.submittedDate}</TableCell>
                                            <TableCell className="align-top py-4"><StatusBadge status={decl.status} /></TableCell>
                                            <TableCell className="align-top py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => toast({ title: "Viewing Declaration", description: `Opening declaration for ${decl.employeeName}` })}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Declaration
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: "Downloading", description: "Downloading declaration PDF..." })}>
                                                            <Download className="mr-2 h-4 w-4" /> Download PDF
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <FileCheck className="h-10 w-10 text-slate-400 mb-3" />
                                                <p className="text-slate-900 font-medium">No declarations found</p>
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

export default TaxDeclarationsPage;
