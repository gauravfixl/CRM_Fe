"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Coins, UserCheck, Settings, FileText, CheckCircle2, MoreHorizontal } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";

const ShiftAllowancePage = () => {
    const [activeTab, setActiveTab] = useState("eligible-employees");
    const { toast } = useToast();

    const eligibleEmployees = [
        { id: "EMP001", name: "Rajesh Kumar", shift: "Night Shift", allowancePerShift: "₹ 500", shiftsWorked: 12, totalAmount: "₹ 6,000" },
        { id: "EMP005", name: "Vikram Singh", shift: "Night Shift", allowancePerShift: "₹ 500", shiftsWorked: 10, totalAmount: "₹ 5,000" },
        { id: "EMP012", name: "Suresh Raina", shift: "Evening Shift", allowancePerShift: "₹ 300", shiftsWorked: 15, totalAmount: "₹ 4,500" }
    ];

    const allowanceRules = [
        { id: "RULE-01", shiftName: "Night Shift", startTime: "10:00 PM", amount: "₹ 500", frequency: "Per Shift" },
        { id: "RULE-02", shiftName: "Evening Shift", startTime: "06:00 PM", amount: "₹ 300", frequency: "Per Shift" },
        { id: "RULE-03", shiftName: "Early Morning", startTime: "04:00 AM", amount: "₹ 200", frequency: "Per Shift" }
    ];

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50 overflow-y-auto">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Shift Allowance</h2>
                <p className="text-slate-500 text-sm mt-1">Manage and track allowance for shift-based employees.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full overflow-x-auto justify-start h-auto rounded-none">
                    {["Eligible Employees", "Allowance Rules", "Allowance Summary"].map((tab) => (
                        <TabsTrigger
                            key={tab.toLowerCase().replace(" ", "-")}
                            value={tab.toLowerCase().replace(" ", "-")}
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium whitespace-nowrap"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Eligible Employees Tab */}
                <TabsContent value="eligible-employees" className="space-y-4">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Eligible Employees</CardTitle>
                                <CardDescription>List of employees eligible for shift allowance in the current cycle.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => toast({ title: "Sync Employees", description: "Syncing eligible employees based on shifts..." })}>
                                <UserCheck className="mr-2 h-4 w-4" /> Sync Employees
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Shift</TableHead>
                                        <TableHead>Allowance/Shift</TableHead>
                                        <TableHead>Shifts Worked</TableHead>
                                        <TableHead>Total Amount</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {eligibleEmployees.map((emp) => (
                                        <TableRow key={emp.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-semibold text-slate-900">{emp.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{emp.shift}</Badge>
                                            </TableCell>
                                            <TableCell>{emp.allowancePerShift}</TableCell>
                                            <TableCell>{emp.shiftsWorked}</TableCell>
                                            <TableCell className="font-bold text-slate-900">{emp.totalAmount}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => toast({ title: "View Details", description: `Viewing details for ${emp.name}` })}>View Payout Details</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => toast({ title: "Hold Payment", description: "Payment put on hold." })}>Hold Payment</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Allowance Rules Tab */}
                <TabsContent value="allowance-rules" className="space-y-4">
                    <div className="flex justify-end">
                        <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={() => toast({ title: "Add Rule", description: "Opening allowance rule form..." })}>
                            <Settings className="mr-2 h-4 w-4" /> Add Rule
                        </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {allowanceRules.map((rule) => (
                            <Card key={rule.id} className="shadow-sm border-slate-200">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{rule.shiftName}</CardTitle>
                                        <Badge className="bg-indigo-100 text-indigo-700 border-none">{rule.startTime}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Amount</span>
                                        <span className="font-bold text-slate-900 text-lg">{rule.amount}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-500">Frequency</span>
                                        <span className="text-sm font-medium text-slate-700">{rule.frequency}</span>
                                    </div>
                                    <div className="pt-4 flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: "Edit Rule", description: `Editing rule for ${rule.shiftName}` })}>Edit</Button>
                                        <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700" onClick={() => toast({ title: "Delete Rule", description: `Deleting rule for ${rule.shiftName}`, variant: "destructive" })}>Delete</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Allowance Summary Tab */}
                <TabsContent value="allowance-summary" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="shadow-sm border-slate-200 bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Total Allowance Payout</CardTitle>
                                <Coins className="h-4 w-4 text-slate-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">₹ 2,45,000</div>
                                <p className="text-xs text-green-600 mt-1 flex items-center">
                                    <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-slate-200 bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Total Eligible Employees</CardTitle>
                                <UserCheck className="h-4 w-4 text-slate-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">84</div>
                                <p className="text-xs text-slate-500 mt-1">Across 3 shift categories</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm border-slate-200 bg-white">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Report Status</CardTitle>
                                <FileText className="h-4 w-4 text-slate-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">Generated</div>
                                <p className="text-xs text-slate-500 mt-1">Last generated today at 10:00 AM</p>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle>Recent Payout Batches</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Batch ID</TableHead>
                                        <TableHead>Month</TableHead>
                                        <TableHead>Employees</TableHead>
                                        <TableHead>Total Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-sans text-xs uppercase">BATCH-2024-JAN</TableCell>
                                        <TableCell>January 2024</TableCell>
                                        <TableCell>84</TableCell>
                                        <TableCell>₹ 2,45,000</TableCell>
                                        <TableCell><Badge className="bg-green-100 text-green-700 border-none">Ready for Payroll</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Download</Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-sans text-xs uppercase">BATCH-2023-DEC</TableCell>
                                        <TableCell>December 2023</TableCell>
                                        <TableCell>78</TableCell>
                                        <TableCell>₹ 2,18,500</TableCell>
                                        <TableCell><Badge className="bg-slate-100 text-slate-700 border-none">Processed</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm">Download</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

// Helper component for trending up icon
const TrendingUp = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

export default ShiftAllowancePage;
