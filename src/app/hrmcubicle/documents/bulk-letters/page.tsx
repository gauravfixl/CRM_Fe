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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { useDocumentsStore, type BulkLetterRecord } from "@/shared/data/documents-store";
import { toast } from "sonner";
import { required, minLength, maxLength, isEmail, isEmployeeId, firstError } from "@/shared/utils/validators";
import {
    FileText,
    Plus,
    Search,
    Download,
    Eye,
    Send,
    Users,
    Archive,
    FileCheck,
    Mail,
    Zap,
    Trash2,
    MoreHorizontal,
    Pencil,
    RefreshCw,
} from "lucide-react";

type LetterTemplateName = "Offer" | "Appointment" | "Confirmation" | "Relieving" | "Experience" | "Appraisal" | "Custom";
type LetterStatus = BulkLetterRecord['status'];

type EmployeeRow = {
    id: string;
    name: string;
    department: string;
    designation: string;
    selected: boolean;
};

const initialEmployees: EmployeeRow[] = [
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

const mergeFields = [
    "{{employee_name}}", "{{designation}}", "{{department}}", "{{date}}", "{{salary}}",
    "{{employee_id}}", "{{joining_date}}", "{{manager_name}}", "{{company_name}}", "{{location}}"
];

const BulkLettersPage = () => {
    const { bulkLetters, addBulkLetters, updateBulkLetter, deleteBulkLetter, bulkDeleteBulkLetters } = useDocumentsStore();

    const [employees, setEmployees] = useState(initialEmployees);
    const [selectedTemplate, setSelectedTemplate] = useState<LetterTemplateName | "">("");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // history filters
    const [historySearch, setHistorySearch] = useState("");
    const [historyStatus, setHistoryStatus] = useState("all");
    const [historyType, setHistoryType] = useState("all");
    const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);

    // dialogs
    const [previewEmployee, setPreviewEmployee] = useState<EmployeeRow | null>(null);
    const [previewLetter, setPreviewLetter] = useState<BulkLetterRecord | null>(null);
    const [editingLetter, setEditingLetter] = useState<BulkLetterRecord | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [sendLetter, setSendLetter] = useState<BulkLetterRecord | null>(null);
    const [sendEmail, setSendEmail] = useState("");
    const [downloadAllOpen, setDownloadAllOpen] = useState(false);

    const selectedEmployees = employees.filter(e => e.selected);
    const departments = Array.from(new Set(initialEmployees.map(e => e.department)));

    const filteredEmployees = employees.filter(e => {
        const matchDept = departmentFilter === "all" || e.department === departmentFilter;
        const matchSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) || e.designation.toLowerCase().includes(searchTerm.toLowerCase());
        return matchDept && matchSearch;
    });

    const filteredLetters = bulkLetters.filter(l => {
        const matchSearch = l.employee.toLowerCase().includes(historySearch.toLowerCase()) ||
            l.letterType.toLowerCase().includes(historySearch.toLowerCase()) ||
            l.id.toLowerCase().includes(historySearch.toLowerCase());
        const matchStatus = historyStatus === "all" || l.status === historyStatus;
        const matchType = historyType === "all" || l.letterType === historyType;
        return matchSearch && matchStatus && matchType;
    });

    const allHistorySelected = filteredLetters.length > 0 && filteredLetters.every(l => selectedHistoryIds.includes(l.id));

    const toggleEmployee = (id: string) => {
        setEmployees(employees.map(e => e.id === id ? { ...e, selected: !e.selected } : e));
    };

    const toggleAllVisible = () => {
        const allSelected = filteredEmployees.every(e => e.selected);
        const ids = new Set(filteredEmployees.map(e => e.id));
        setEmployees(employees.map(e => ids.has(e.id) ? { ...e, selected: !allSelected } : e));
    };

    const toggleHistorySelect = (id: string) => {
        setSelectedHistoryIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleHistorySelectAll = () => {
        if (allHistorySelected) {
            setSelectedHistoryIds(prev => prev.filter(id => !filteredLetters.some(l => l.id === id)));
        } else {
            const ids = filteredLetters.map(l => l.id);
            setSelectedHistoryIds(prev => Array.from(new Set([...prev, ...ids])));
        }
    };

    const generate = (target: "selected" | "all") => {
        if (!selectedTemplate) {
            toast.error("Select a template first");
            return;
        }
        const targets = target === "selected" ? selectedEmployees : filteredEmployees;
        if (targets.length === 0) {
            toast.error(target === "selected" ? "Select at least one employee" : "No employees match current filters");
            return;
        }
        if (targets.length > 100) {
            toast.error("Maximum 100 letters per generation batch");
            return;
        }
        // Skip employees that already have a recent (today) letter of this type
        const today = new Date().toISOString().split("T")[0];
        const dupes = targets.filter(e => bulkLetters.some(b => b.employeeId === e.id && b.letterType === selectedTemplate && b.generatedDate === today));
        const fresh = targets.filter(e => !dupes.find(d => d.id === e.id));
        if (fresh.length === 0) {
            toast.error(`All ${targets.length} selected employee(s) already have a "${selectedTemplate}" letter today`);
            return;
        }
        addBulkLetters(fresh.map(e => ({
            employee: e.name,
            employeeId: e.id,
            department: e.department,
            designation: e.designation,
            letterType: selectedTemplate,
            status: "Generated",
        })));
        if (target === "selected") {
            setEmployees(employees.map(e => ({ ...e, selected: false })));
        }
        if (dupes.length > 0) {
            toast.warning(`${fresh.length} generated · ${dupes.length} skipped (already issued today)`);
        } else {
            toast.success(`${fresh.length} ${selectedTemplate} letter${fresh.length > 1 ? 's' : ''} generated`);
        }
    };

    const handleDownloadAll = () => {
        const csvHeader = "ID,Employee,Employee ID,Department,Letter Type,Generated Date,Status\n";
        const csvRows = bulkLetters.map(l => `${l.id},${l.employee},${l.employeeId},${l.department},${l.letterType},${l.generatedDate},${l.status}`).join("\n");
        const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bulk_letters_export_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Exported ${bulkLetters.length} letters as CSV`);
        setDownloadAllOpen(false);
    };

    const handleDownloadSingle = (l: BulkLetterRecord) => {
        const content = `${l.letterType} Letter\n\nEmployee: ${l.employee}\nID: ${l.employeeId}\nDepartment: ${l.department}\nDesignation: ${l.designation || "—"}\nGenerated: ${l.generatedDate}\nStatus: ${l.status}\nLetter ID: ${l.id}`;
        const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${l.id}_${l.letterType}_${l.employee.replace(/\s+/g, "_")}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Downloaded letter for ${l.employee}`);
    };

    const handleSendEmail = () => {
        if (!sendLetter) return;
        const trimmed = sendEmail.trim();
        const err = firstError(
            required(trimmed, "Recipient email"),
            isEmail(trimmed, "Recipient email"),
            maxLength(trimmed, 254, "Recipient email"),
        );
        if (err) { toast.error(err); return; }
        updateBulkLetter(sendLetter.id, { status: "Sent" });
        toast.success(`Letter sent to ${trimmed}`);
        setSendLetter(null);
        setSendEmail("");
    };

    const handleSaveEdit = () => {
        if (!editingLetter) return;
        const err = firstError(
            required(editingLetter.employee, "Employee name"),
            minLength(editingLetter.employee, 2, "Employee name"),
            maxLength(editingLetter.employee, 80, "Employee name"),
            required(editingLetter.employeeId, "Employee ID"),
            isEmployeeId(editingLetter.employeeId, "Employee ID"),
            required(editingLetter.department, "Department"),
            maxLength(editingLetter.department, 60, "Department"),
            editingLetter.designation ? maxLength(editingLetter.designation, 80, "Designation") : null,
            required(editingLetter.letterType, "Letter type"),
            required(editingLetter.status, "Status"),
        );
        if (err) { toast.error(err); return; }
        updateBulkLetter(editingLetter.id, {
            ...editingLetter,
            employee: editingLetter.employee.trim(),
            employeeId: editingLetter.employeeId.trim(),
            department: editingLetter.department.trim(),
            designation: editingLetter.designation?.trim(),
        });
        toast.success("Letter updated");
        setEditingLetter(null);
    };

    const confirmDelete = () => {
        if (!deleteId) return;
        deleteBulkLetter(deleteId);
        setSelectedHistoryIds(prev => prev.filter(id => id !== deleteId));
        toast.success("Letter deleted");
        setDeleteId(null);
    };

    const confirmBulkDelete = () => {
        const count = selectedHistoryIds.length;
        bulkDeleteBulkLetters(selectedHistoryIds);
        setSelectedHistoryIds([]);
        setBulkDeleteOpen(false);
        toast.success(`${count} letters deleted`);
    };

    const statusBadge = (status: LetterStatus) => {
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
                    <Button variant="outline" className="font-bold border-slate-200" onClick={() => setDownloadAllOpen(true)}>
                        <Archive size={16} className="mr-2 text-slate-400" /> Export All (CSV)
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Tabs defaultValue="generate" className="h-full flex flex-col">
                    <div className="px-8 pt-4 bg-white border-b border-slate-200">
                        <TabsList className="bg-slate-100">
                            <TabsTrigger value="generate" className="font-bold">Generate Letters</TabsTrigger>
                            <TabsTrigger value="history" className="font-bold">Generated Letters ({bulkLetters.length})</TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Generate Tab */}
                    <TabsContent value="generate" className="flex-1 p-8 space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm col-span-1">
                                <CardContent className="p-5 space-y-4">
                                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><FileCheck size={16} className="text-[#8B5CF6]" /> Select Template</h3>
                                    <div className="space-y-2">
                                        {(["Offer", "Appointment", "Confirmation", "Relieving", "Experience", "Appraisal", "Custom"] as LetterTemplateName[]).map(t => (
                                            <div key={t} onClick={() => setSelectedTemplate(t)}
                                                className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedTemplate === t ? "border-[#8B5CF6] bg-purple-50 ring-1 ring-purple-200" : "border-slate-200 hover:bg-slate-50"}`}>
                                                <p className={`text-sm font-bold ${selectedTemplate === t ? "text-[#8B5CF6]" : "text-slate-700"}`}>{t} Letter</p>
                                            </div>
                                        ))}
                                    </div>
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
                                                        <input type="checkbox" className="rounded" checked={filteredEmployees.length > 0 && filteredEmployees.every(e => e.selected)} onChange={toggleAllVisible} />
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
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setPreviewEmployee(emp)} disabled={!selectedTemplate} title={!selectedTemplate ? "Select a template first" : "Preview"}>
                                                                <Eye size={14} />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {filteredEmployees.length === 0 && (
                                                    <TableRow><TableCell colSpan={5} className="h-24 text-center text-slate-400">No employees match current filters.</TableCell></TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <Button variant="outline" className="font-bold border-slate-200" onClick={() => generate("selected")} disabled={selectedEmployees.length === 0 || !selectedTemplate}>
                                            <Zap size={16} className="mr-2" /> Generate Selected ({selectedEmployees.length})
                                        </Button>
                                        <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={() => generate("all")} disabled={!selectedTemplate || filteredEmployees.length === 0}>
                                            <FileText size={16} className="mr-2" /> Generate For All Visible ({filteredEmployees.length})
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="flex-1 p-8 space-y-4">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-slate-200 flex flex-wrap gap-3 items-center">
                                <div className="relative w-72">
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Search by employee or type..." className="pl-9 bg-slate-50 border-slate-200" value={historySearch} onChange={e => setHistorySearch(e.target.value)} />
                                </div>
                                <Select value={historyStatus} onValueChange={setHistoryStatus}>
                                    <SelectTrigger className="w-[140px] bg-slate-50 font-medium"><SelectValue placeholder="Status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="Draft">Draft</SelectItem>
                                        <SelectItem value="Generated">Generated</SelectItem>
                                        <SelectItem value="Sent">Sent</SelectItem>
                                        <SelectItem value="Signed">Signed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={historyType} onValueChange={setHistoryType}>
                                    <SelectTrigger className="w-[140px] bg-slate-50 font-medium"><SelectValue placeholder="Type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="Offer">Offer</SelectItem>
                                        <SelectItem value="Appointment">Appointment</SelectItem>
                                        <SelectItem value="Confirmation">Confirmation</SelectItem>
                                        <SelectItem value="Relieving">Relieving</SelectItem>
                                        <SelectItem value="Experience">Experience</SelectItem>
                                        <SelectItem value="Appraisal">Appraisal</SelectItem>
                                        <SelectItem value="Custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                                {(historySearch || historyStatus !== "all" || historyType !== "all") && (
                                    <Button variant="ghost" size="sm" className="text-xs font-bold text-slate-500" onClick={() => { setHistorySearch(""); setHistoryStatus("all"); setHistoryType("all"); }}>
                                        <RefreshCw size={14} className="mr-1.5" /> Reset
                                    </Button>
                                )}
                                <div className="ml-auto flex gap-2">
                                    {selectedHistoryIds.length > 0 && (
                                        <Button variant="outline" className="font-bold border-rose-100 bg-rose-50/40 text-rose-600" onClick={() => setBulkDeleteOpen(true)}>
                                            <Trash2 size={14} className="mr-2" /> Delete ({selectedHistoryIds.length})
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="w-10">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                                checked={allHistorySelected}
                                                onChange={toggleHistorySelectAll}
                                            />
                                        </TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Employee</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Department</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Letter Type</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Generated</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs">Status</TableHead>
                                        <TableHead className="font-bold text-slate-500 uppercase text-xs text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLetters.map(l => (
                                        <TableRow key={l.id} className={`hover:bg-slate-50/50 ${selectedHistoryIds.includes(l.id) ? 'bg-purple-50/30' : ''}`}>
                                            <TableCell>
                                                <input
                                                    type="checkbox"
                                                    className="rounded"
                                                    checked={selectedHistoryIds.includes(l.id)}
                                                    onChange={() => toggleHistorySelect(l.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-bold text-slate-700 text-sm">{l.employee}</p>
                                                    <p className="text-xs text-slate-400">ID: {l.employeeId}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">{l.department}</TableCell>
                                            <TableCell><Badge variant="outline" className="text-xs">{l.letterType}</Badge></TableCell>
                                            <TableCell className="text-sm text-slate-600">{l.generatedDate}</TableCell>
                                            <TableCell>{statusBadge(l.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" title="Preview" onClick={() => setPreviewLetter(l)}><Eye size={14} /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" title="Download" onClick={() => handleDownloadSingle(l)}><Download size={14} /></Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" title="Send" onClick={() => { setSendLetter(l); setSendEmail(""); }}>
                                                        <Mail size={14} />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" title="More"><MoreHorizontal size={14} /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-52">
                                                            <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase">Manage</DropdownMenuLabel>
                                                            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setEditingLetter({ ...l })}>
                                                                <Pencil size={14} className="text-indigo-500" /> Edit Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2 cursor-pointer text-rose-600" onClick={() => setDeleteId(l.id)}>
                                                                <Trash2 size={14} /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredLetters.length === 0 && (
                                        <TableRow><TableCell colSpan={7} className="h-32 text-center text-slate-400">
                                            {bulkLetters.length === 0 ? "No letters generated yet. Switch to the Generate tab to create some." : "No letters match the current filters."}
                                        </TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Employee preview (template + employee combined) */}
            <Dialog open={!!previewEmployee} onOpenChange={(open) => !open && setPreviewEmployee(null)}>
                <DialogContent className="max-w-lg border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>Letter Preview</DialogTitle>
                        <DialogDescription>{selectedTemplate} Letter for {previewEmployee?.name}</DialogDescription>
                    </DialogHeader>
                    {previewEmployee && selectedTemplate && (
                        <div className="py-4">
                            <div className="p-6 border border-slate-200 rounded-xl bg-white space-y-4 font-serif">
                                <div className="text-right text-sm text-slate-500">Date: <span className="bg-yellow-100 px-1 rounded">{new Date().toLocaleDateString()}</span></div>
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
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPreviewEmployee(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* History row preview */}
            <Dialog open={!!previewLetter} onOpenChange={(open) => !open && setPreviewLetter(null)}>
                <DialogContent className="max-w-lg border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle>{previewLetter?.letterType} Letter</DialogTitle>
                        <DialogDescription>For {previewLetter?.employee} · {previewLetter?.id}</DialogDescription>
                    </DialogHeader>
                    {previewLetter && (
                        <div className="py-4 space-y-3">
                            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="font-bold text-slate-500">Employee</span><span className="text-slate-800">{previewLetter.employee}</span></div>
                                <div className="flex justify-between"><span className="font-bold text-slate-500">Employee ID</span><span className="text-slate-800">{previewLetter.employeeId}</span></div>
                                <div className="flex justify-between"><span className="font-bold text-slate-500">Department</span><span className="text-slate-800">{previewLetter.department}</span></div>
                                {previewLetter.designation && (
                                    <div className="flex justify-between"><span className="font-bold text-slate-500">Designation</span><span className="text-slate-800">{previewLetter.designation}</span></div>
                                )}
                                <div className="flex justify-between"><span className="font-bold text-slate-500">Letter Type</span><span className="text-slate-800">{previewLetter.letterType}</span></div>
                                <div className="flex justify-between"><span className="font-bold text-slate-500">Generated</span><span className="text-slate-800">{previewLetter.generatedDate}</span></div>
                                <div className="flex justify-between items-center"><span className="font-bold text-slate-500">Status</span>{statusBadge(previewLetter.status)}</div>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setPreviewLetter(null)}>Close</Button>
                        {previewLetter && (
                            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold" onClick={() => { handleDownloadSingle(previewLetter); }}>
                                <Download size={14} className="mr-2" /> Download
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Letter */}
            <SideFormSheet
                open={!!editingLetter}
                onOpenChange={(o) => { if (!o) setEditingLetter(null); }}
                title="Edit Letter"
                description="Update letter details."
                icon={<Pencil size={20} />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Save Changes"
                onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Employee Name" required>
                            <Input value={editingLetter?.employee || ""} onChange={e => setEditingLetter(prev => prev ? { ...prev, employee: e.target.value } : null)} />
                        </Field>
                        <Field label="Employee ID" required>
                            <Input value={editingLetter?.employeeId || ""} onChange={e => setEditingLetter(prev => prev ? { ...prev, employeeId: e.target.value } : null)} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Department" required>
                            <Input value={editingLetter?.department || ""} onChange={e => setEditingLetter(prev => prev ? { ...prev, department: e.target.value } : null)} />
                        </Field>
                        <Field label="Designation">
                            <Input value={editingLetter?.designation || ""} onChange={e => setEditingLetter(prev => prev ? { ...prev, designation: e.target.value } : null)} />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Letter Type" required>
                            <Select value={editingLetter?.letterType} onValueChange={(v) => setEditingLetter(prev => prev ? { ...prev, letterType: v } : null)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Offer">Offer</SelectItem>
                                    <SelectItem value="Appointment">Appointment</SelectItem>
                                    <SelectItem value="Confirmation">Confirmation</SelectItem>
                                    <SelectItem value="Relieving">Relieving</SelectItem>
                                    <SelectItem value="Experience">Experience</SelectItem>
                                    <SelectItem value="Appraisal">Appraisal</SelectItem>
                                    <SelectItem value="Custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Status" required>
                            <Select value={editingLetter?.status} onValueChange={(v: LetterStatus) => setEditingLetter(prev => prev ? { ...prev, status: v } : null)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Draft">Draft</SelectItem>
                                    <SelectItem value="Generated">Generated</SelectItem>
                                    <SelectItem value="Sent">Sent</SelectItem>
                                    <SelectItem value="Signed">Signed</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                </div>
            </SideFormSheet>

            {/* Send via email */}
            <SideFormSheet
                open={!!sendLetter}
                onOpenChange={(o) => { if (!o) { setSendLetter(null); setSendEmail(""); } }}
                title="Send Letter"
                description={sendLetter ? `Email ${sendLetter.letterType} letter to ${sendLetter.employee}.` : undefined}
                icon={<Send size={20} />}
                accentColor="#4f46e5"
                width="sm"
                submitLabel="Send"
                onSubmit={(e) => { e.preventDefault(); handleSendEmail(); }}
            >
                <div className="space-y-4">
                    <Field label="Recipient Email" required>
                        <Input type="email" placeholder="employee@email.com" value={sendEmail} onChange={e => setSendEmail(e.target.value)} />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Delete single */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Trash2 size={20} className="text-rose-500" /> Delete Letter?</DialogTitle>
                        <DialogDescription>This letter record will be permanently removed.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 text-white font-bold" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk delete */}
            <Dialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Trash2 size={20} className="text-rose-500" /> Delete {selectedHistoryIds.length} Letters?</DialogTitle>
                        <DialogDescription>All selected letters will be permanently removed.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkDeleteOpen(false)}>Cancel</Button>
                        <Button className="bg-rose-500 hover:bg-rose-600 text-white font-bold" onClick={confirmBulkDelete}>Delete All</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Export confirm */}
            <Dialog open={downloadAllOpen} onOpenChange={setDownloadAllOpen}>
                <DialogContent className="max-w-md border-2 border-slate-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><Archive size={20} className="text-cyan-600" /> Export All Letters?</DialogTitle>
                        <DialogDescription>A CSV containing all {bulkLetters.length} letter records will be downloaded.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDownloadAllOpen(false)}>Cancel</Button>
                        <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold" onClick={handleDownloadAll}>Export CSV</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BulkLettersPage;
