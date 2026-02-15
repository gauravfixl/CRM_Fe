"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { FileText, MoreHorizontal, Search, Filter, Download, Mail, Eye } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";

interface Payslip {
    id: string;
    employeeName: string;
    employeeId: string;
    month: string;
    netSalary: number;
    status: "Generated" | "Pending" | "Sent";
    generatedDate: string;
}

const initialPayslips: Payslip[] = [
    { id: "PS-001", employeeName: "Rajesh Kumar", employeeId: "EMP-001", month: "January 2024", netSalary: 92000, status: "Generated", generatedDate: "Jan 30, 2024" },
    { id: "PS-002", employeeName: "Priya Sharma", employeeId: "EMP-002", month: "January 2024", netSalary: 110000, status: "Sent", generatedDate: "Jan 30, 2024" },
    { id: "PS-003", employeeName: "Amit Patel", employeeId: "EMP-003", month: "January 2024", netSalary: 69000, status: "Pending", generatedDate: "-" },
    { id: "PS-004", employeeName: "Sneha Reddy", employeeId: "EMP-004", month: "December 2023", netSalary: 85500, status: "Sent", generatedDate: "Dec 29, 2023" }
];

const PayslipsPage = () => {
    const [payslips, setPayslips] = useState<Payslip[]>(initialPayslips);
    const [activeTab, setActiveTab] = useState("all");
    const { toast } = useToast();

    const handleStatusChange = (id: string, newStatus: string) => {
        setPayslips(payslips.map(p => p.id === id ? { ...p, status: newStatus as any } : p));
        toast({ title: "Status Updated", description: `Payslip status changed to ${newStatus}.` });
    };

    const handleDownload = (name: string) => {
        toast({ title: "Downloading", description: `Downloading payslip for ${name}...` });
    };

    const handleEmail = (name: string) => {
        toast({ title: "Email Sent", description: `Payslip sent to ${name} via email.` });
    };

    const getFiltered = (tab: string) => {
        if (tab === "all") return payslips;
        if (tab === "generated") return payslips.filter(p => p.status === "Generated");
        if (tab === "pending") return payslips.filter(p => p.status === "Pending");
        if (tab === "sent") return payslips.filter(p => p.status === "Sent");
        return payslips;
    };

    const filtered = getFiltered(activeTab);

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            "Generated": "bg-blue-100 text-blue-700",
            "Pending": "bg-amber-100 text-amber-700",
            "Sent": "bg-green-100 text-green-700"
        };
        return <Badge className={`border-none shadow-none font-medium px-2 py-0.5 ${styles[status]}`}>{status}</Badge>;
    };

    const formatCurrency = (amount: number) => `₹ ${amount.toLocaleString('en-IN')}`;

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Payslips</h2>
                    <p className="text-slate-500 text-sm mt-1">Generate and manage employee payslips.</p>
                </div>
                <Button className="bg-[#6366f1] hover:bg-[#5558e6] text-white" onClick={() => toast({ title: "Generating Payslips", description: "Bulk payslip generation started..." })}>
                    <FileText className="mr-2 h-4 w-4" /> Generate All
                </Button>
            </div>

            <Tabs defaultValue="all" className="space-y-6 flex-1" onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full sm:w-auto overflow-x-auto justify-start h-auto rounded-none">
                        {["All", "Generated", "Pending", "Sent"].map((tab) => (
                            <TabsTrigger key={tab.toLowerCase()} value={tab.toLowerCase()} className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium whitespace-nowrap">
                                {tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input type="search" placeholder="Search payslips..." className="pl-9 h-9 border-slate-200 bg-white shadow-sm" />
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
                                    <TableHead className="font-semibold text-slate-600">Month</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Net Salary</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Generated Date</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length > 0 ? (
                                    filtered.map((slip) => (
                                        <TableRow key={slip.id} className="hover:bg-slate-50/50 group">
                                            <TableCell className="align-top py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{slip.employeeName}</span>
                                                    <span className="text-xs text-slate-500 mt-0.5">{slip.employeeId}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4 text-slate-600">{slip.month}</TableCell>
                                            <TableCell className="align-top py-4 text-slate-900 font-bold">{formatCurrency(slip.netSalary)}</TableCell>
                                            <TableCell className="align-top py-4 text-slate-600 text-sm">{slip.generatedDate}</TableCell>
                                            <TableCell className="align-top py-4"><StatusBadge status={slip.status} /></TableCell>
                                            <TableCell className="align-top py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => toast({ title: "Viewing Payslip", description: `Opening payslip for ${slip.employeeName}` })}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Payslip
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDownload(slip.employeeName)}>
                                                            <Download className="mr-2 h-4 w-4" /> Download PDF
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEmail(slip.employeeName)}>
                                                            <Mail className="mr-2 h-4 w-4" /> Send via Email
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {slip.status !== "Sent" && (
                                                            <DropdownMenuItem onClick={() => handleStatusChange(slip.id, "Sent")} className="text-green-600">
                                                                Mark as Sent
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
                                                <FileText className="h-10 w-10 text-slate-400 mb-3" />
                                                <p className="text-slate-900 font-medium">No payslips found</p>
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

export default PayslipsPage;
