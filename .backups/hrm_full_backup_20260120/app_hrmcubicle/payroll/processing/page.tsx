"use client"

import React, { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import {
    Play,
    MoreHorizontal,
    Search,
    Filter,
    DollarSign,
    Calendar,
    CheckCircle2,
    AlertCircle,
    Edit
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/ui/use-toast";

// Mock Data
interface PayrollEntry {
    id: string;
    employeeName: string;
    employeeId: string;
    department: string;
    basicSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    status: "Draft" | "Finalized" | "Paid" | "On Hold";
    month: string;
}

const initialPayrollData: PayrollEntry[] = [
    {
        id: "PAY-001",
        employeeName: "Rajesh Kumar",
        employeeId: "EMP-001",
        department: "Engineering",
        basicSalary: 80000,
        allowances: 20000,
        deductions: 8000,
        netSalary: 92000,
        status: "Finalized",
        month: "January 2024"
    },
    {
        id: "PAY-002",
        employeeName: "Priya Sharma",
        employeeId: "EMP-002",
        department: "Product",
        basicSalary: 95000,
        allowances: 25000,
        deductions: 10000,
        netSalary: 110000,
        status: "Draft",
        month: "January 2024"
    },
    {
        id: "PAY-003",
        employeeName: "Amit Patel",
        employeeId: "EMP-003",
        department: "Sales",
        basicSalary: 60000,
        allowances: 15000,
        deductions: 6000,
        netSalary: 69000,
        status: "Finalized",
        month: "January 2024"
    },
    {
        id: "PAY-004",
        employeeName: "Sneha Reddy",
        employeeId: "EMP-004",
        department: "HR",
        basicSalary: 75000,
        allowances: 18000,
        deductions: 7500,
        netSalary: 85500,
        status: "Paid",
        month: "December 2023"
    }
];

const SalaryProcessingPage = () => {
    const [payrollData, setPayrollData] = useState<PayrollEntry[]>(initialPayrollData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRunPayrollOpen, setIsRunPayrollOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [editingId, setEditingId] = useState<string | null>(null);
    const { toast } = useToast();

    // Form State
    const [formData, setFormData] = useState({
        basicSalary: "",
        allowances: "",
        deductions: ""
    });

    // Handlers
    const handleRunPayroll = () => {
        toast({
            title: "Payroll Processing Started",
            description: "Payroll for January 2024 is being processed. This may take a few minutes."
        });
        setIsRunPayrollOpen(false);

        // Simulate processing
        setTimeout(() => {
            toast({
                title: "Payroll Processed",
                description: "235 employees processed successfully.",
                className: "bg-green-50 border-green-200"
            });
        }, 2000);
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        setPayrollData(payrollData.map(p => p.id === id ? { ...p, status: newStatus as any } : p));
        toast({ title: "Status Updated", description: `Payroll status changed to ${newStatus}.` });
    };

    const handleEditClick = (entry: PayrollEntry) => {
        setFormData({
            basicSalary: entry.basicSalary.toString(),
            allowances: entry.allowances.toString(),
            deductions: entry.deductions.toString()
        });
        setEditingId(entry.id);
        setTimeout(() => setIsDialogOpen(true), 0);
    };

    const handleSaveCorrection = () => {
        if (editingId) {
            setPayrollData(payrollData.map(p => p.id === editingId ? {
                ...p,
                basicSalary: parseInt(formData.basicSalary),
                allowances: parseInt(formData.allowances),
                deductions: parseInt(formData.deductions),
                netSalary: parseInt(formData.basicSalary) + parseInt(formData.allowances) - parseInt(formData.deductions)
            } : p));
            toast({ title: "Correction Saved", description: "Salary details updated successfully." });
        }
        setIsDialogOpen(false);
        setEditingId(null);
    };

    // Filtering
    const getFilteredPayroll = (tab: string) => {
        if (tab === "all") return payrollData;
        if (tab === "draft") return payrollData.filter(p => p.status === "Draft");
        if (tab === "finalized") return payrollData.filter(p => p.status === "Finalized");
        if (tab === "paid") return payrollData.filter(p => p.status === "Paid");
        return payrollData;
    };

    const filteredPayroll = getFilteredPayroll(activeTab);

    // Helper Components
    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            "Draft": "bg-slate-100 text-slate-700",
            "Finalized": "bg-blue-100 text-blue-700",
            "Paid": "bg-green-100 text-green-700",
            "On Hold": "bg-amber-100 text-amber-700",
        };
        return <Badge className={`border-none shadow-none font-medium px-2 py-0.5 ${styles[status]}`}>{status}</Badge>;
    };

    const formatCurrency = (amount: number) => `₹ ${amount.toLocaleString('en-IN')}`;

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Salary Processing</h2>
                    <p className="text-slate-500 text-sm mt-1">Process and manage monthly payroll.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="bg-[#6366f1] hover:bg-[#5558e6] text-white" onClick={() => setIsRunPayrollOpen(true)}>
                        <Play className="mr-2 h-4 w-4" /> Run Payroll
                    </Button>

                    {/* Run Payroll Dialog */}
                    <Dialog open={isRunPayrollOpen} onOpenChange={setIsRunPayrollOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Run Payroll</DialogTitle>
                                <DialogDescription>
                                    Process salary for all employees for the selected month.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-blue-900 text-sm">Payroll Summary</h4>
                                            <div className="mt-2 space-y-1 text-sm text-blue-800">
                                                <p>Month: <strong>January 2024</strong></p>
                                                <p>Employees: <strong>235</strong></p>
                                                <p>Total Amount: <strong>₹ 1.2 Cr</strong></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    This will finalize all draft payroll entries and generate payslips. This action cannot be undone.
                                </p>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsRunPayrollOpen(false)}>Cancel</Button>
                                <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={handleRunPayroll}>
                                    Confirm & Process
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Correction Dialog */}
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setEditingId(null);
                    }}>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>Salary Correction</DialogTitle>
                                <DialogDescription>
                                    Update salary components for this employee.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="basic" className="text-right">Basic Salary</Label>
                                    <Input id="basic" type="number" value={formData.basicSalary} onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="allowances" className="text-right">Allowances</Label>
                                    <Input id="allowances" type="number" value={formData.allowances} onChange={(e) => setFormData({ ...formData, allowances: e.target.value })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="deductions" className="text-right">Deductions</Label>
                                    <Input id="deductions" type="number" value={formData.deductions} onChange={(e) => setFormData({ ...formData, deductions: e.target.value })} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4 pt-2 border-t">
                                    <Label className="text-right font-bold">Net Salary</Label>
                                    <div className="col-span-3 font-bold text-lg text-slate-900">
                                        {formatCurrency((parseInt(formData.basicSalary) || 0) + (parseInt(formData.allowances) || 0) - (parseInt(formData.deductions) || 0))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={handleSaveCorrection}>
                                    Save Correction
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Tabs & Content */}
            <Tabs defaultValue="all" className="space-y-6 flex-1" onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full sm:w-auto overflow-x-auto justify-start h-auto rounded-none">
                        {["All", "Draft", "Finalized", "Paid"].map((tab) => {
                            const val = tab.toLowerCase();
                            return (
                                <TabsTrigger
                                    key={val}
                                    value={val}
                                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium whitespace-nowrap"
                                >
                                    {tab}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Search employees..."
                                className="pl-9 h-9 border-slate-200 bg-white shadow-sm"
                            />
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
                                    <TableHead className="font-semibold text-slate-600">Department</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Basic Salary</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Allowances</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Deductions</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Net Salary</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayroll.length > 0 ? (
                                    filteredPayroll.map((entry) => (
                                        <TableRow key={entry.id} className="hover:bg-slate-50/50 group">
                                            <TableCell className="align-top py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-slate-900">{entry.employeeName}</span>
                                                    <span className="text-xs text-slate-500 mt-0.5">{entry.employeeId}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4 text-slate-600 text-sm">
                                                {entry.department}
                                            </TableCell>
                                            <TableCell className="align-top py-4 text-slate-700 font-medium">
                                                {formatCurrency(entry.basicSalary)}
                                            </TableCell>
                                            <TableCell className="align-top py-4 text-slate-700">
                                                {formatCurrency(entry.allowances)}
                                            </TableCell>
                                            <TableCell className="align-top py-4 text-red-600">
                                                -{formatCurrency(entry.deductions)}
                                            </TableCell>
                                            <TableCell className="align-top py-4 text-slate-900 font-bold">
                                                {formatCurrency(entry.netSalary)}
                                            </TableCell>
                                            <TableCell className="align-top py-4">
                                                <StatusBadge status={entry.status} />
                                            </TableCell>
                                            <TableCell className="align-top py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEditClick(entry)}>
                                                            <Edit className="mr-2 h-4 w-4" /> Make Correction
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: "Viewing Details", description: `Salary breakdown for ${entry.employeeName}` })}>
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {entry.status === "Draft" && (
                                                            <DropdownMenuItem onClick={() => handleStatusChange(entry.id, "Finalized")} className="text-blue-600">
                                                                <CheckCircle2 className="mr-2 h-4 w-4" /> Finalize
                                                            </DropdownMenuItem>
                                                        )}
                                                        {entry.status === "Finalized" && (
                                                            <DropdownMenuItem onClick={() => handleStatusChange(entry.id, "Paid")} className="text-green-600">
                                                                <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Paid
                                                            </DropdownMenuItem>
                                                        )}
                                                        {entry.status !== "On Hold" && (
                                                            <DropdownMenuItem onClick={() => handleStatusChange(entry.id, "On Hold")} className="text-amber-600">
                                                                <AlertCircle className="mr-2 h-4 w-4" /> Put On Hold
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                                    <DollarSign className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <p className="text-slate-900 font-medium">No payroll data found</p>
                                                <p className="text-slate-500 text-sm mt-1">Run payroll to process salaries.</p>
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

export default SalaryProcessingPage;
