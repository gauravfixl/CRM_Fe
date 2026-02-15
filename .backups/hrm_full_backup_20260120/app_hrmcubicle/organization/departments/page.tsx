"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Users, User, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganizationStore, type Department } from "@/shared/data/organization-store";
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

const DepartmentsPage = () => {
    const { toast } = useToast();
    const { departments, addDepartment, updateDepartment, deleteDepartment } = useOrganizationStore();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [deptForm, setDeptForm] = useState({
        name: '',
        headOfDepartment: '',
        description: ''
    });

    const handleAdd = () => {
        if (!deptForm.name || !deptForm.headOfDepartment) {
            toast({ title: "Error", description: "Name and Head are required", variant: "destructive" });
            return;
        }

        addDepartment({
            name: deptForm.name,
            headOfDepartment: deptForm.headOfDepartment,
            description: deptForm.description
        });
        setIsAddOpen(false);
        setDeptForm({ name: '', headOfDepartment: '', description: '' });
        toast({ title: "Department Created", description: `${deptForm.name} has been created.` });
    };

    const handleEdit = (dept: Department) => {
        setSelectedDept(dept);
        setDeptForm({
            name: dept.name,
            headOfDepartment: dept.headOfDepartment,
            description: dept.description
        });
        setIsEditOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedDept || !deptForm.name || !deptForm.headOfDepartment) return;

        updateDepartment(selectedDept.id, {
            name: deptForm.name,
            headOfDepartment: deptForm.headOfDepartment,
            description: deptForm.description
        });
        setIsEditOpen(false);
        toast({ title: "Department Updated", description: "Changes saved successfully." });
    };

    const handleDelete = (dept: Department) => {
        if (confirm(`Are you sure you want to delete ${dept.name}?`)) {
            deleteDepartment(dept.id);
            toast({ title: "Department Deleted", description: `${dept.name} has been removed.` });
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Departments</h1>
                    <p className="text-slate-500 font-medium">Manage organizational departments and structure.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                            <Plus className="mr-2 h-5 w-5" /> Add Department
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                        <DialogHeader>
                            <DialogTitle>Add New Department</DialogTitle>
                            <DialogDescription>Create a new department in your organization.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label>Department Name *</Label>
                                <Input
                                    placeholder="e.g. Engineering, Sales"
                                    value={deptForm.name}
                                    onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Head of Department *</Label>
                                <Input
                                    placeholder="Manager name"
                                    value={deptForm.headOfDepartment}
                                    onChange={e => setDeptForm({ ...deptForm, headOfDepartment: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Brief description of the department..."
                                    value={deptForm.description}
                                    onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none min-h-[100px]"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleAdd}>
                                Create Department
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, i) => (
                    <motion.div key={dept.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all rounded-[2rem] bg-white p-8 group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-16 w-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                                    <Building2 className="text-indigo-600" size={28} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="text-right">
                                        <p className="font-black text-3xl text-indigo-600">{dept.employeeCount}</p>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Employees</p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                                <MoreVertical size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(dept)}>
                                                <Edit size={14} className="mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(dept)} className="text-rose-600">
                                                <Trash2 size={14} className="mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <h3 className="font-black text-2xl text-slate-900 mb-3">{dept.name}</h3>
                            <p className="text-sm text-slate-600 font-medium mb-6">{dept.description}</p>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <User size={18} className="text-slate-400" />
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Department Head</p>
                                        <p className="font-bold text-slate-900">{dept.headOfDepartment}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                    <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                        <DialogDescription>Update department information.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label>Department Name</Label>
                            <Input
                                value={deptForm.name}
                                onChange={e => setDeptForm({ ...deptForm, name: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Head of Department</Label>
                            <Input
                                value={deptForm.headOfDepartment}
                                onChange={e => setDeptForm({ ...deptForm, headOfDepartment: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={deptForm.description}
                                onChange={e => setDeptForm({ ...deptForm, description: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none min-h-[100px]"
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

export default DepartmentsPage;
