"use client"

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    FileText,
    Plus,
    Search,
    Download,
    Eye,
    Send,
    Users,
    CheckSquare,
    Archive,
    FileCheck,
    Printer,
    Mail,
    Filter,
    Zap
} from "lucide-react";

type LetterTemplate = "Offer" | "Appointment" | "Confirmation" | "Relieving" | "Experience" | "Appraisal" | "Custom";

type GeneratedLetter = {
    id: string;
    employee: string;
    department: string;
    letterType: LetterTemplate;
    generatedDate: string;
    status: "Draft" | "Generated" | "Sent" | "Signed";
};

type Employee = {
    id: string;
    name: string;
    department: string;
    designation: string;
    selected: boolean;
};

const mockEmployees: Employee[] = [
    { id: "E001", name: "Priya Sharma", department: "Engineering", designation: "Senior Developer", selected: false },
    { id: "E002", name: "Rajesh Kumar", department: "Sales", designation: "Sales Manager", selected: false },
    { id: "E003", name: "Sneha Rao", department: "Design", designation: "UI Designer", selected: false },
    { id: "E004", name: "Vikram Singh", department: "Marketing", designation: "Marketing Lead", selected: false },
    { id: "E005", name: "Amit Joshi", department: "Engineering", designation: "Tech Lead", selected: false },
    { id: "E006", name: "Kavita Patel", department: "HR", designation: "HR Executive", selected: false },
    { id: "E007", name: "Deepak Nair", department: "Finance", designation: "Finance Analyst", selected: false },
    { id: "E008", name: "Arjun Reddy", department: "QA", designation: "QA Engineer", selected: false },
    { id: "E009", name: "Meera Iyer", department: "Product", designation: "Product Manager", selected: false },
    { id: "E010", name: "Rahul Verma", department: "Sales", designation: "Account Executive", selected: false },
];

const mockLetters: GeneratedLetter[] = [
    { id: "LTR-001", employee: "Priya Sharma", department: "Engineering", letterType: "Appraisal", generatedDate: "2026-03-30", status: "Sent" },
    { id: "LTR-002", employee: "Rajesh Kumar", department: "Sales", letterType: "Appraisal", generatedDate: "2026-03-30", status: "Sent" },
    { id: "LTR-003", employee: "Sneha Rao", department: "Design", letterType: "Confirmation", generatedDate: "2026-03-28", status: "Signed" },
    { id: "LTR-004", employee: "Vikram Singh", department: "Marketing", letterType: "Experience", generatedDate: "2026-03-25", status: "Generated" },
    { id: "LTR-005", employee: "Amit Joshi", department: "Engineering", letterType: "Offer", generatedDate: "2026-03-22", status: "Signed" },
    { id: "LTR-006", employee: "Kavita Patel", department: "HR", letterType: "Appointment", generatedDate: "2026-04-01", status: "Draft" },
    { id: "LTR-007", employee: "Deepak Nair", department: "Finance", letterType: "Relieving", generatedDate: "2026-04-01", status: "Generated" },
];

const mergeFields = [
    "{{employee_name}}", "{{designation}}", "{{department}}", "{{date}}", "{{salary}}",
    "{{employee_id}}", "{{joining_date}}", "{{manager_name}}", "{{company_name}}", "{{location}}"
];

const BulkLettersPage = () => {
    const { toast } = useToast();
    const [letters, setLetters] = useState(mockLetters);
    const [employees, setEmployees] = useState(mockEmployees);
    const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplate | "">("");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewEmployee, setPreviewEmployee] = useState<Employee | null>(null);

    const selectedEmployees = employees.filter(e => e.selected);
    const departments = [...new Set(mockEmployees.map(e => e.department))];

    const filteredEmployees = employees.filter(e => {
        const matchDept = departmentFilter === "all" || e.department === departmentFilter;
        const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.designation.toLowerCase().includes(searchTerm.toLowerCase());
        return matchDept && matchSearch;
    });

    const toggleEmployee = (id: string) => {
        setEmployees(employees.map(e => e.id === id ? { ...e, selected: !e.selected } : e));
    };

    const toggleAll = () => {
        const allSelected = filteredEmployees.every(e => e.selected);
        const ids = new Set(filteredEmployees.map(e => e.id));
        setEmployees(employees.map(e => ids.has(e.id) ? { ...e, selected: !allSelected } : e));
    };

    const handleGenerate = () => {
        if (!selectedTemplate || selectedEmployees.length === 0) {
            toast({ title: "Selection Required", description: "Select a template and at least one employee.", variant: "destructive" });
            return;
        }
        const newLetters: GeneratedLetter[] = selectedEmployees.map((e, i) => ({
            id: `LTR-${String(letters.length + i + 1).padStart(3, "0")}`,
            employee: e.name,
            department: e.department,
            letterType: selectedTemplate,
            generatedDate: new Date().toISOString().split("T")[0],
            status: "Generated" as const,
        }));
        setLetters([...newLetters, ...letters]);
        setEmployees(employees.map(e => ({ ...e, selected: false })));
        toast({ title: "Letters Generated", description: `${newLetters.length} ${selectedTemplate} letters generated.` });
    };

    const handlePreview = (emp: Employee) => {
        setPreviewEmployee(emp);
        setIsPreviewOpen(true);
    };

    const statusBadge = (status: GeneratedLetter["status"]) => {
        const styles: Record<string, string> = {
            Draft: "bg-slate-50 text-slate-500 border-slate-200",
            Generated: "bg-blue-50 text-blue-600 border-blue-200",
            Sent: "bg-amber-50 text-amber-600 border-amber-200",
            Signed: "bg-emerald-50 text-emerald-600 border-emerald-200",
        };
        return <Badge variant="outline" className={styles[status]}>{status}</Badge>;
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="h-20 px-8 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-cyan-600 rounded-xl flex items-center justify-center text-white">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bulk Letter Generation</h1>
                        <p className="text-sm font-medium text-slate-500">Generate and distribute letters for multiple employees at once.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="font-bold border-slate-200" onClick={() => {
                        const csv = "Employee,Letter Type,Generated Date,Status\n" + mockLetters.map(l => `${l.employee},${l.letterType},${l.generatedDate},${l.status}`).join("\n");
                        const blob = new Blob([csv], { type: "text/csv" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a"); a.href = url; a.download = "bulk_letters_export.csv"; a.click(); URL.revokeObjectURL(url);
                        toast({ title: "Exported", description: "Bulk letters data exported as CSV." });
                    }}>
                        <Archive size={16} className="mr-2 text-slate-400" /> Download ZIP
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Tabs defaultValue="generate" className="h-full flex flex-col">
                    <div className="px-8 pt-4 bg-white border-b border-slate-200">
                        <TabsList className="bg-slate-100">
                            <TabsTrigger value="generate" className="font-bold">Generate Letters</TabsTrigger>
                            <TabsTrigger value="history" className="font-bold">Generated Letters</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="generate" className="flex-1 p-8 space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Template Selector */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm col-span-1">
                                <CardContent className="p-5 space-y-4">
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><FileCheck size={16} className="text-[#8B5CF6]" /> Select Template</h3>
                                    <div className="space-y-2">
                                        {(["Offer", "Appointment", "Confirmation", "Relieving", "Experience", "Appraisal", "Custom"] as LetterTemplate[]).map(t => (
                                            <div key={t} onClick={() => setSelectedTemplate(t)}
                                                className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedTemplate === t ? "border-[#8B5CF6] bg-purple-50 ring-1 ring-purple-200" : "border-slate-200 hover:bg-slate-50"}`}>
                                                <p className={`text-sm font-bold ${selectedTemplate === t ? "text-[#8B5CF6]" : "text-slate-700"}`}>{t} Letter</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Merge Field Reference */}
                                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                        <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Merge Fields</p>
                                        <div className="flex flex-wrap gap-1">
                                            {mergeFields.map(f => (
                                                <Badge key={f} variant="outline" className="text-[10px] bg-white font-mono">{f}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Employee Selector */}
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm col-span-2">
                                <CardContent className="p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Users size={16} className="text-[#8B5CF6]" /> Select Employees</h3>
                                        <Badge variant="outline" className="bg-purple-50 text-[#8B5CF6] border-purple-200">{selectedEmployees.length} selected</Badge>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                            <Input placeholder="Search employees..." className="pl-9 bg-slate-50 border-slate-200" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                        </div>
                                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                            <SelectTrigger className="w-[160px] bg-slate-50"><SelectValue placeholder="Department" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Departments</SelectItem>
                                                {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="max-h-[400px] overflow-auto border border-slate-200 rounded-xl">
                                        <Table>
                                            <TableHeader className="bg-slate-50 sticky top-0">
                                                <TableRow>
                                                    <TableHead className="w-[40px]">
                                                        <input type="checkbox" className="rounded" checked={filteredEmployees.length > 0 && filteredEmployees.every(e => e.selected)} onChange={toggleAll} />
                                                    </TableHead>
                                                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Name</TableHead>
                                                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Dept</TableHead>
                                                    <TableHead className="font-bold text-slate-500 uppercase text-xs">Designation</TableHead>
                                                    <TableHead className="font-bold text-slate-500 uppercase text-xs text-right">Preview</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredEmployees.map(emp => (
                                                    <TableRow key={emp.id} className={`hover:bg-slate-50/50 ${emp.selected ? "bg-purple-50/30" : ""}`}>
                                                        <TableCell>
                                                            <input type="checkbox" className="rounded" checked={emp.selected} onChange={() => toggleEmployee(emp.id)} />
                                                        </TableCell>
                                                        <TableCell className="font-bold text-slate-700 text-sm">{emp.name}</TableCell>
                                                        <TableCell className="text-sm text-slate-600">{emp.department}</TableCell>
                                                        <TableCell className="text-sm text-slate-600">{emp.designation}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => handlePreview(emp)} disabled={!selectedTemplate}>
                                                                <Eye size={14} />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <Button variant="outline" className="font-bold border-slate-200" onClick={handleGenerate} disabled={selectedEmployees.length === 0}>
                                            <Zap size={16} className="mr-2" /> Generate Selected ({selectedEmployees.length})
                                        </Button>
                                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={handleGenerate} disabled={!selectedTemplate || selectedEmployees.length === 0}>
                                            <FileText size={16} className="mr-2" /> Generate All
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="flex-1 p-8">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Employee</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Department</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Letter Type</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Generated Date</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Status</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {letters.map(l => (
                                        <TableRow key={l.id} className="hover:bg-slate-50/50">
                                            <TableCell className="font-bold text-slate-700">{l.employee}</TableCell>
                                            <TableCell className="text-sm text-slate-600">{l.department}</TableCell>
                                            <TableCell><Badge variant="outline" className="text-xs">{l.letterType}</Badge></TableCell>
                                            <TableCell className="text-sm text-slate-600">{l.generatedDate}</TableCell>
                                            <TableCell>{statusBadge(l.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" title="Preview" onClick={() => setPreviewLetter(l)}><Eye size={14} /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" title="Download" onClick={() => toast({ title: "Downloading", description: `Letter for ${l.employee} is being downloaded.` })}><Download size={14} /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" title="Send" onClick={() => toast({ title: "Sent", description: `Letter sent to ${l.employee} via email.` })}>
                                                        <Mail size={14} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Preview Dialog */}
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogContent className="max-w-lg border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>Letter Preview</DialogTitle>
                        <DialogDescription>{selectedTemplate} Letter for {previewEmployee?.name}</DialogDescription>
                    </DialogHeader>
                    {previewEmployee && selectedTemplate && (
                        <div className="py-4">
                            <div className="p-6 border border-slate-200 rounded-xl bg-white space-y-4 font-serif">
                                <div className="text-right text-sm text-slate-500">Date: <span className="bg-yellow-100 px-1 rounded">{"{{date}}"}</span></div>
                                <p className="text-sm text-slate-700">Dear <span className="bg-yellow-100 px-1 rounded font-bold">{previewEmployee.name}</span>,</p>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    We are pleased to issue this <strong>{selectedTemplate} Letter</strong> confirming your role as{" "}
                                    <span className="bg-yellow-100 px-1 rounded">{previewEmployee.designation}</span> in the{" "}
                                    <span className="bg-yellow-100 px-1 rounded">{previewEmployee.department}</span> department.
                                </p>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    Your compensation details as per <span className="bg-yellow-100 px-1 rounded">{"{{salary}}"}</span> are enclosed herewith.
                                </p>
                                <p className="text-sm text-slate-700 mt-6">Regards,<br /><strong><span className="bg-yellow-100 px-1 rounded">{"{{company_name}}"}</span></strong></p>
                            </div>
                            <p className="text-xs text-slate-400 mt-3 italic">Highlighted fields will be replaced with actual data during generation.</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BulkLettersPage;
