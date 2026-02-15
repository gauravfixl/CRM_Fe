"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Plus,
    Search,
    Filter,
    Download,
    Upload,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    UserCheck,
    UserX,
    Clock,
    Building2,
    ChevronDown,
    FileText,
    Activity,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganisationStore, type Employee } from "@/shared/data/organisation-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";

const EmployeesPage = () => {
    const { toast } = useToast();
    const { employees, departments, designations, locations, addEmployee, updateEmployee, deleteEmployee } = useOrganisationStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [departmentFilter, setDepartmentFilter] = useState<string>("All");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<Partial<Employee>>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfJoining: "",
        dateOfBirth: "",
        gender: "Male",
        status: "Active",
        employmentType: "Full-Time",
        departmentId: "",
        designationId: "",
        locationId: "",
        employeeCode: ""
    });

    const handleAddEmployee = () => {
        if (!formData.firstName || !formData.email || !formData.departmentId) {
            toast({ title: "Validation Error", description: "Name, Email, and Department are required", variant: "destructive" });
            return;
        }

        addEmployee({
            ...formData,
            employeeCode: `FX${new Date().getFullYear()}${String(employees.length + 1).padStart(3, '0')}`,
            profileImage: `${formData.firstName?.charAt(0)}${formData.lastName?.charAt(0)}`
        } as Omit<Employee, 'id'>);

        toast({ title: "Employee Added", description: `${formData.firstName} ${formData.lastName} has been onboarded successfully.` });
        setIsAddDialogOpen(false);
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfJoining: "",
            dateOfBirth: "",
            gender: "Male",
            status: "Active",
            employmentType: "Full-Time",
            departmentId: "",
            designationId: "",
            locationId: "",
            employeeCode: ""
        });
    };

    const handleUpdateEmployee = () => {
        if (!selectedEmployee || !formData.firstName || !formData.email || !formData.departmentId) {
            toast({ title: "Validation Error", description: "Name, Email, and Department are required", variant: "destructive" });
            return;
        }

        updateEmployee(selectedEmployee.id, formData);
        toast({ title: "Employee Updated", description: "Employee details have been updated successfully." });
        setIsEditDialogOpen(false);
        setSelectedEmployee(null);
    };

    const handleDeleteEmployee = (id: string) => {
        deleteEmployee(id);
        toast({ title: "Employee Removed", description: "Employee record has been deleted from the system." });
    };

    const handleExportCSV = () => {
        if (filteredEmployees.length === 0) {
            toast({ title: "No data", description: "There are no employee records to export.", variant: "destructive" });
            return;
        }

        const headers = ["ID", "Code", "First Name", "Last Name", "Email", "Phone", "Department", "Designation", "Location", "Status", "Joining Date"];
        const rows = filteredEmployees.map(emp => [
            emp.id,
            emp.employeeCode,
            `"${emp.firstName}"`,
            `"${emp.lastName}"`,
            `"${emp.email}"`,
            `"${emp.phone}"`,
            `"${departments.find(d => d.id === emp.departmentId)?.name || 'N/A'}"`,
            `"${designations.find(d => d.id === emp.designationId)?.title || 'N/A'}"`,
            `"${locations.find(l => l.id === emp.locationId)?.name || 'N/A'}"`,
            emp.status,
            emp.dateOfJoining
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `employees_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Export Successful", description: "Employee directory has been exported to CSV." });
    };

    const handleBulkImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split("\n").filter(l => l.trim().length > 0);
                if (lines.length <= 1) return;

                const importedEmployees = lines.slice(1).map(line => {
                    const values = line.split(",").map(v => v.replace(/"/g, '').trim());
                    return {
                        firstName: values[0] || "New",
                        lastName: values[1] || "Employee",
                        email: values[2] || `emp.${Math.random().toString(36).substring(7)}@company.com`,
                        phone: values[3] || "",
                        departmentId: departments[0]?.id || "",
                        designationId: designations[0]?.id || "",
                        locationId: locations[0]?.id || "",
                        status: "Active",
                        employmentType: "Full-Time",
                        dateOfJoining: new Date().toISOString().split('T')[0],
                        dateOfBirth: "1995-01-01",
                        gender: "Male",
                        employeeCode: `FX${new Date().getFullYear()}IMP`,
                        profileImage: values[0]?.charAt(0) || "N"
                    } as Omit<Employee, 'id'>;
                });

                const { bulkImportEmployees } = useOrganisationStore.getState();
                bulkImportEmployees(importedEmployees);
                toast({ title: "Import Successful", description: `${importedEmployees.length} employees have been added.` });
            } catch (error) {
                toast({ title: "Import Failed", description: "Please ensure the CSV format is correct.", variant: "destructive" });
            }
        };
        reader.readAsText(file);
        if (event.target) event.target.value = '';
    };

    const getStatusStyles = (status: Employee['status']) => {
        const styles = {
            'Active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
            'On Notice': 'bg-amber-50 text-amber-600 border-amber-100',
            'Exited': 'bg-slate-100 text-slate-500 border-slate-200',
            'On Leave': 'bg-blue-50 text-blue-600 border-blue-100'
        };
        return styles[status] || styles['Active'];
    };

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch =
            emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
        const matchesDepartment = departmentFilter === 'All' || emp.departmentId === departmentFilter;
        return matchesSearch && matchesStatus && matchesDepartment;
    });

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/20" style={{ zoom: "90%" }}>
            <header className="py-3 px-6 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Directory</h1>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] uppercase tracking-wider h-5 px-3 italic">
                                {employees.length} Total
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-[10px] font-medium leading-none">Comprehensive workforce management and lifecycle tracking.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv"
                            onChange={handleBulkImport}
                        />
                        <Button
                            variant="outline"
                            className="h-10 px-6 rounded-xl font-bold border-slate-200 gap-2 text-xs"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={16} /> Bulk Import
                        </Button>
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-10 px-8 font-bold shadow-xl shadow-indigo-100 transition-all gap-2 text-xs"
                        >
                            <Plus size={16} /> Add Employee
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6 pt-4 max-w-[1440px] mx-auto w-full space-y-6">
                {/* Filters */}
                <Card className="rounded-[1.5rem] border border-slate-100 shadow-sm bg-white p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative group w-full md:max-w-xs">
                            <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Search by name, email, or employee code..."
                                className="pl-11 h-10 rounded-xl bg-slate-50 border-none shadow-none font-medium text-xs focus-visible:ring-2 focus-visible:ring-indigo-100 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-3 flex-1 justify-start md:justify-end">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-36 h-10 rounded-xl bg-slate-50 border-none font-bold text-[10px] ring-1 ring-slate-100">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                    <SelectItem value="All" className="rounded-lg h-9">All Status</SelectItem>
                                    <SelectItem value="Active" className="rounded-lg h-9">Active</SelectItem>
                                    <SelectItem value="On Notice" className="rounded-lg h-9">On Notice</SelectItem>
                                    <SelectItem value="Exited" className="rounded-lg h-9">Exited</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger className="w-40 h-10 rounded-xl bg-slate-50 border-none font-bold text-[10px] ring-1 ring-slate-100">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold max-h-[250px]">
                                    <SelectItem value="All" className="rounded-lg h-9">All Depts</SelectItem>
                                    {departments.map(dept => (
                                        <SelectItem key={dept.id} value={dept.id} className="rounded-lg h-9">{dept.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                className="h-10 px-6 rounded-xl font-bold border-slate-200 gap-2 text-xs"
                                onClick={handleExportCSV}
                            >
                                <Download size={16} /> Export
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Employee Grid */}
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEmployees.map((employee, i) => {
                            const department = departments.find(d => d.id === employee.departmentId);
                            const designation = designations.find(d => d.id === employee.designationId);
                            const location = locations.find(l => l.id === employee.locationId);

                            return (
                                <motion.div
                                    key={employee.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="group border-none shadow-sm hover:shadow-xl transition-all rounded-[2.5rem] bg-white overflow-hidden ring-1 ring-slate-100">
                                        <CardContent className="p-6 space-y-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-16 w-16 border-4 border-slate-50 shadow-lg ring-1 ring-slate-100">
                                                        <AvatarFallback className="bg-indigo-600 text-white font-bold text-xl">
                                                            {employee.profileImage}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                                                            {employee.firstName} {employee.lastName}
                                                        </h3>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {employee.employeeCode}
                                                        </p>
                                                    </div>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-slate-600">
                                                            <MoreVertical size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48 font-bold">
                                                        <DropdownMenuItem
                                                            className="rounded-xl h-11 gap-2"
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                setSelectedEmployee(employee);
                                                                setIsDetailDialogOpen(true);
                                                            }}
                                                        >
                                                            <Eye size={16} /> View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-xl h-11 gap-2"
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                setSelectedEmployee(employee);
                                                                setFormData(employee);
                                                                setIsEditDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit size={16} /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-xl h-11 text-rose-600 focus:bg-rose-50 gap-2"
                                                            onClick={() => handleDeleteEmployee(employee.id)}
                                                        >
                                                            <Trash2 size={16} /> Remove
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="space-y-3">
                                                <Badge variant="outline" className={`${getStatusStyles(employee.status)} border-none font-bold text-[9px] h-6 px-3 rounded-lg uppercase tracking-tight shadow-sm`}>
                                                    {employee.status === 'Active' ? <CheckCircle2 size={12} className="mr-1" /> : <AlertCircle size={12} className="mr-1" />}
                                                    {employee.status}
                                                </Badge>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <Briefcase size={14} className="text-slate-400" />
                                                        <span className="font-bold">{designation?.title || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <Building2 size={14} className="text-slate-400" />
                                                        <span className="font-bold">{department?.name || 'N/A'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <MapPin size={14} className="text-slate-400" />
                                                        <span className="font-bold">{location?.name || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1 h-10 rounded-xl font-bold text-xs gap-2"
                                                    onClick={() => window.location.href = `mailto:${employee.email}`}
                                                >
                                                    <Mail size={14} /> Email
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1 h-10 rounded-xl font-bold text-xs gap-2"
                                                    onClick={() => window.location.href = `tel:${employee.phone}`}
                                                >
                                                    <Phone size={14} /> Call
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>

                {filteredEmployees.length === 0 && (
                    <Card className="rounded-[3rem] border-2 border-dashed border-slate-100 bg-white p-20">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <Users size={64} className="text-slate-200" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">No Employees Found</h3>
                                <p className="text-sm text-slate-500 font-medium">Try adjusting your filters or add a new employee.</p>
                            </div>
                        </div>
                    </Card>
                )}
            </main>

            {/* Add Employee Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent
                    className="bg-white rounded-[2.5rem] border border-slate-300 p-8 max-w-4xl shadow-3xl max-h-[90vh] overflow-y-auto my-4 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <DialogHeader className="space-y-2">
                        <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-1 shadow-inner">
                            <UserCheck size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Add New Employee</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-xs">
                            Complete the onboarding form to add a new team member to the organization.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">First Name *</Label>
                                <Input
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Last Name *</Label>
                                <Input
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Email *</Label>
                                <Input
                                    type="email"
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    placeholder="john.doe@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Phone</Label>
                                <Input
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Department *</Label>
                                <Select value={formData.departmentId} onValueChange={(v) => setFormData({ ...formData, departmentId: v })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        {departments.map(dept => (
                                            <SelectItem key={dept.id} value={dept.id} className="rounded-lg h-10">{dept.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Designation</Label>
                                <Select value={formData.designationId} onValueChange={(v) => setFormData({ ...formData, designationId: v })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        {designations.map(des => (
                                            <SelectItem key={des.id} value={des.id} className="rounded-lg h-10">{des.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Location</Label>
                                <Select value={formData.locationId} onValueChange={(v) => setFormData({ ...formData, locationId: v })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        {locations.map(loc => (
                                            <SelectItem key={loc.id} value={loc.id} className="rounded-lg h-10">{loc.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Date of Joining</Label>
                                <Input
                                    type="date"
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.dateOfJoining}
                                    onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Employment Type</Label>
                                <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v as any })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        <SelectItem value="Full-Time" className="rounded-lg h-10">Full-Time</SelectItem>
                                        <SelectItem value="Part-Time" className="rounded-lg h-10">Part-Time</SelectItem>
                                        <SelectItem value="Contract" className="rounded-lg h-10">Contract</SelectItem>
                                        <SelectItem value="Intern" className="rounded-lg h-10">Intern</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-10 font-bold text-xs shadow-xl shadow-indigo-100 transition-all"
                            onClick={handleAddEmployee}
                        >
                            Add to Directory
                        </Button>
                        <Button variant="outline" className="h-10 px-6 rounded-lg font-bold border-slate-300 text-slate-600 text-xs" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Employee Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border border-slate-300 p-0 max-w-4xl shadow-3xl max-h-[85vh] overflow-hidden flex flex-col">
                    <div className="p-8 pb-4 bg-slate-900 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="flex items-center gap-6 relative z-10">
                            <Avatar className="h-24 w-24 border-4 border-white/10 shadow-2xl">
                                <AvatarFallback className="bg-indigo-600 text-white font-bold text-3xl">
                                    {selectedEmployee?.profileImage}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 text-start">
                                <Badge className="bg-indigo-500 text-white border-none font-bold text-[10px] uppercase tracking-widest px-3 mb-2">
                                    {selectedEmployee?.employeeCode}
                                </Badge>
                                <DialogTitle className="text-3xl font-bold tracking-tight">
                                    {selectedEmployee?.firstName} {selectedEmployee?.lastName}
                                </DialogTitle>
                                <DialogDescription className="text-indigo-200 font-medium text-sm">
                                    {designations.find(d => d.id === selectedEmployee?.designationId)?.title || 'N/A'} • {departments.find(d => d.id === selectedEmployee?.departmentId)?.name || 'N/A'}
                                </DialogDescription>
                            </div>
                            <div className="ml-auto flex flex-col items-end gap-2 relative z-10">
                                <Badge className={`${getStatusStyles(selectedEmployee?.status || 'Active')} border-none font-bold text-[10px] h-7 px-4 rounded-full uppercase tracking-wider shadow-lg`}>
                                    {selectedEmployee?.status}
                                </Badge>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Joined: {selectedEmployee?.dateOfJoining}</p>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="work" className="flex-1 flex flex-col">
                        <div className="px-8 bg-slate-900 border-t border-white/5">
                            <TabsList className="bg-transparent border-none gap-8 h-12 p-0 justify-start">
                                {["work", "personal", "salary", "attendance", "performance"].map((tab) => (
                                    <TabsTrigger
                                        key={tab}
                                        value={tab}
                                        className="bg-transparent border-none text-slate-400 data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-0 font-bold text-[11px] uppercase tracking-widest transition-all h-full"
                                    >
                                        {tab} Info
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar text-start">
                            <TabsContent value="work" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider border-l-4 border-indigo-500 pl-3">Job Details</h4>
                                        <div className="space-y-4 ml-4">
                                            {[
                                                { label: "Reporting Manager", value: "Sarah Jenkins (Senior Director)", icon: Users },
                                                { label: "Employment Type", value: selectedEmployee?.employmentType, icon: Briefcase },
                                                { label: "Location", value: locations.find(l => l.id === selectedEmployee?.locationId)?.name, icon: MapPin },
                                                { label: "Work Shift", value: "General (9:00 AM - 6:00 PM)", icon: Clock },
                                            ].map((item, i) => (
                                                <div key={i} className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</span>
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <item.icon size={14} className="text-indigo-500" />
                                                        {item.value || 'N/A'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider border-l-4 border-emerald-500 pl-3">Onboarding Info</h4>
                                        <div className="space-y-4 ml-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Probation Status</span>
                                                <Badge className="w-fit bg-amber-50 text-amber-600 border-none font-bold text-[10px]">CONCLUDED</Badge>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Confirmation Date</span>
                                                <span className="text-sm font-bold text-slate-700">Aug 15, 2024</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="personal" className="m-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="grid grid-cols-2 gap-8">
                                    {[
                                        { label: "Full Name", value: `${selectedEmployee?.firstName} ${selectedEmployee?.lastName}` },
                                        { label: "Personal Email", value: selectedEmployee?.email },
                                        { label: "Date of Birth", value: selectedEmployee?.dateOfBirth },
                                        { label: "Gender", value: selectedEmployee?.gender },
                                        { label: "Blood Group", value: "B+ Positive" },
                                        { label: "Marital Status", value: "Married" },
                                        { label: "Permanent Address", value: "123, Tech Park Mansion, Silicon Valley, India" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</span>
                                            <span className="text-sm font-bold text-slate-700">{item.value || 'N/A'}</span>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="salary" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <Card className="border-none bg-slate-50 p-6 rounded-3xl">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-wider">Salary Structure (FY 24-25)</h4>
                                        <Button variant="outline" className="h-8 rounded-lg text-[10px] font-bold gap-2">
                                            <Download size={12} /> DOWNLOAD PAYSLIP
                                        </Button>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { label: "Basic Salary", value: "₹45,000", type: "Earnings" },
                                            { label: "HRA", value: "₹22,500", type: "Earnings" },
                                            { label: "Special Allowance", value: "₹15,000", type: "Earnings" },
                                            { label: "Provident Fund", value: "-₹1,800", type: "Deduction" },
                                            { label: "Professional Tax", value: "-₹200", type: "Deduction" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-center border-b border-slate-200/50 pb-2 last:border-0 text-start">
                                                <span className="text-[11px] font-bold text-slate-500">{item.label}</span>
                                                <span className={`text-[13px] font-bold ${item.type === 'Deduction' ? 'text-rose-600' : 'text-slate-900'}`}>{item.value}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center pt-4 border-t-2 border-slate-200">
                                            <span className="text-sm font-bold text-slate-900">Total Net Payable</span>
                                            <span className="text-xl font-bold text-indigo-600">₹80,500</span>
                                        </div>
                                    </div>
                                </Card>
                            </TabsContent>

                            <TabsContent value="attendance" className="m-0 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: "Avg Check-in", value: "09:12 AM" },
                                        { label: "On-time Rate", value: "94%" },
                                        { label: "Leaves Taken", value: "04/22" },
                                    ].map((stat, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">{stat.label}</p>
                                            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <p className="text-[11px] font-bold text-indigo-700">System Note:</p>
                                    <p className="text-[10px] font-medium text-indigo-600 mt-1">Excellent attendance record. Consistently logs in within 15 mins of shift start.</p>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>

                    <DialogFooter className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-[3rem]">
                        <Button
                            variant="outline"
                            className="h-10 px-8 rounded-xl font-bold border-slate-300 text-slate-600 text-xs"
                            onClick={() => setIsDetailDialogOpen(false)}
                        >
                            CLOSE PROFILE
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Employee Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent
                    className="bg-white rounded-[2.5rem] border border-slate-300 p-8 max-w-4xl shadow-3xl max-h-[90vh] overflow-y-auto my-4 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <DialogHeader className="space-y-2">
                        <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-1 shadow-inner">
                            <Edit size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">Edit Employee Details</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-xs">
                            Update employee information and employment details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">First Name *</Label>
                                <Input
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Last Name *</Label>
                                <Input
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Email *</Label>
                                <Input
                                    type="email"
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    placeholder="john.doe@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Phone</Label>
                                <Input
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    placeholder="+91 98765 43210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Department *</Label>
                                <Select value={formData.departmentId} onValueChange={(v) => setFormData({ ...formData, departmentId: v })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        {departments.map(dept => (
                                            <SelectItem key={dept.id} value={dept.id} className="rounded-lg h-10">{dept.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Designation</Label>
                                <Select value={formData.designationId} onValueChange={(v) => setFormData({ ...formData, designationId: v })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        {designations.map(des => (
                                            <SelectItem key={des.id} value={des.id} className="rounded-lg h-10">{des.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Location</Label>
                                <Select value={formData.locationId} onValueChange={(v) => setFormData({ ...formData, locationId: v })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        {locations.map(loc => (
                                            <SelectItem key={loc.id} value={loc.id} className="rounded-lg h-10">{loc.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Date of Joining</Label>
                                <Input
                                    type="date"
                                    className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.dateOfJoining}
                                    onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Status</Label>
                                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        <SelectItem value="Active" className="rounded-lg h-10">Active</SelectItem>
                                        <SelectItem value="On Notice" className="rounded-lg h-10">On Notice</SelectItem>
                                        <SelectItem value="Exited" className="rounded-lg h-10">Exited</SelectItem>
                                        <SelectItem value="On Leave" className="rounded-lg h-10">On Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Employment Type</Label>
                                <Select value={formData.employmentType} onValueChange={(v) => setFormData({ ...formData, employmentType: v as any })}>
                                    <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                        <SelectItem value="Full-Time" className="rounded-lg h-10">Full-Time</SelectItem>
                                        <SelectItem value="Part-Time" className="rounded-lg h-10">Part-Time</SelectItem>
                                        <SelectItem value="Contract" className="rounded-lg h-10">Contract</SelectItem>
                                        <SelectItem value="Intern" className="rounded-lg h-10">Intern</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-10 font-bold text-xs shadow-xl shadow-indigo-100 transition-all"
                            onClick={handleUpdateEmployee}
                        >
                            Save Changes
                        </Button>
                        <Button variant="outline" className="h-10 px-6 rounded-lg font-bold border-slate-300 text-slate-600 text-xs" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployeesPage;
