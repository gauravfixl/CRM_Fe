"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Mail, Phone, Building2, MapPin, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganizationStore } from "@/shared/data/organization-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const EmployeesPage = () => {
    const { toast } = useToast();
    const { employees, addEmployee, updateEmployee, deleteEmployee } = useOrganizationStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [employeeForm, setEmployeeForm] = useState({
        name: '',
        email: '',
        phone: '',
        designation: '',
        department: '',
        location: '',
        employmentType: 'Full-time' as const
    });

    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAdd = () => {
        if (!employeeForm.name || !employeeForm.email) {
            toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
            return;
        }

        const avatar = employeeForm.name.split(' ').map(n => n[0]).join('').toUpperCase();
        addEmployee({
            ...employeeForm,
            avatar,
            joiningDate: new Date().toISOString(),
            reportingTo: 'Manager',
            status: 'Active'
        });

        setIsAddOpen(false);
        setEmployeeForm({ name: '', email: '', phone: '', designation: '', department: '', location: '', employmentType: 'Full-time' });
        toast({ title: "Employee Added", description: `${employeeForm.name} has been added successfully.` });
    };

    const handleEdit = (emp: any) => {
        setSelectedEmployee(emp);
        setEmployeeForm({
            name: emp.name,
            email: emp.email,
            phone: emp.phone,
            designation: emp.designation,
            department: emp.department,
            location: emp.location,
            employmentType: emp.employmentType
        });
        setIsEditOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedEmployee) return;

        updateEmployee(selectedEmployee.id, employeeForm);
        setIsEditOpen(false);
        toast({ title: "Employee Updated", description: "Changes saved successfully." });
    };

    const handleDelete = (emp: any) => {
        if (confirm(`Are you sure you want to remove ${emp.name}?`)) {
            deleteEmployee(emp.id);
            toast({ title: "Employee Removed", description: `${emp.name} has been removed.` });
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Employees</h1>
                    <p className="text-slate-500 font-medium">Manage all employees across the organization.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                            <Plus className="mr-2 h-5 w-5" /> Add Employee
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Employee</DialogTitle>
                            <DialogDescription>Enter employee details to add them to the organization.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-6 py-4">
                            <div className="space-y-2">
                                <Label>Full Name *</Label>
                                <Input
                                    placeholder="John Doe"
                                    value={employeeForm.name}
                                    onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email *</Label>
                                <Input
                                    type="email"
                                    placeholder="john@company.com"
                                    value={employeeForm.email}
                                    onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input
                                    placeholder="+91 98765 43210"
                                    value={employeeForm.phone}
                                    onChange={e => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Designation</Label>
                                <Input
                                    placeholder="Software Engineer"
                                    value={employeeForm.designation}
                                    onChange={e => setEmployeeForm({ ...employeeForm, designation: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Input
                                    placeholder="Engineering"
                                    value={employeeForm.department}
                                    onChange={e => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    placeholder="Bangalore"
                                    value={employeeForm.location}
                                    onChange={e => setEmployeeForm({ ...employeeForm, location: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleAdd}>
                                Add Employee
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <Input
                    placeholder="Search employees..."
                    className="pl-12 h-12 rounded-xl bg-white border-none shadow-sm"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((emp, i) => (
                    <motion.div key={emp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all rounded-[2rem] bg-white p-6 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 bg-indigo-100 text-indigo-700 font-bold text-xl">
                                        <AvatarFallback>{emp.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-black text-lg text-slate-900">{emp.name}</h3>
                                        <p className="text-sm text-slate-500 font-medium">{emp.designation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={`${emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} border-none font-bold`}>
                                        {emp.status}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                                <MoreVertical size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(emp)}>
                                                <Edit size={14} className="mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(emp)} className="text-rose-600">
                                                <Trash2 size={14} className="mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl">
                                <div className="flex items-center gap-3 text-sm">
                                    <Building2 size={16} className="text-slate-400" />
                                    <span className="font-medium text-slate-700">{emp.department}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span className="font-medium text-slate-600">{emp.location}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail size={16} className="text-slate-400" />
                                    <span className="font-medium text-slate-600 truncate">{emp.email}</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-white rounded-[2rem] border-none p-8 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                        <DialogDescription>Update employee information.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6 py-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                value={employeeForm.name}
                                onChange={e => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={employeeForm.email}
                                onChange={e => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                                value={employeeForm.phone}
                                onChange={e => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Designation</Label>
                            <Input
                                value={employeeForm.designation}
                                onChange={e => setEmployeeForm({ ...employeeForm, designation: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployeesPage;
