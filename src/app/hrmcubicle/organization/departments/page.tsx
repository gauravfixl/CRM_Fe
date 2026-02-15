"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Building2,
    Plus,
    Search,
    Users,
    Edit,
    Trash2,
    MoreVertical,
    UserCheck,
    TrendingUp,
    Activity,
    ChevronRight,
    Layers,
    Target,
    Crown,
    Calendar,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganisationStore, type Department } from "@/shared/data/organisation-store";
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
import { Progress } from "@/shared/components/ui/progress";

const DepartmentsPage = () => {
    const { toast } = useToast();
    const { departments, employees, addDepartment, updateDepartment, deleteDepartment } = useOrganisationStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewMembersDialogOpen, setIsViewMembersDialogOpen] = useState(false);

    const [formData, setFormData] = useState<Partial<Department>>({
        name: "",
        code: "",
        description: "",
        headId: "",
        parentDepartmentId: "",
        isActive: true
    });

    const handleAddDepartment = () => {
        if (!formData.name || !formData.code) {
            toast({ title: "Validation Error", description: "Name and Code are required", variant: "destructive" });
            return;
        }

        addDepartment({
            ...formData,
            isActive: true
        } as Omit<Department, 'id' | 'employeeCount' | 'createdAt'>);

        toast({ title: "Department Created", description: `${formData.name} has been added to the organization structure.` });
        setIsAddDialogOpen(false);
        setFormData({
            name: "",
            code: "",
            description: "",
            headId: "",
            parentDepartmentId: "",
            isActive: true
        });
    };

    const handleUpdateDepartment = () => {
        if (!selectedDepartment || !formData.name || !formData.code) {
            toast({ title: "Validation Error", description: "Name and Code are required", variant: "destructive" });
            return;
        }

        updateDepartment(selectedDepartment.id, formData);
        toast({ title: "Department Updated", description: "Changes have been saved successfully." });
        setIsEditDialogOpen(false);
        setSelectedDepartment(null);
    };

    const handleDeleteDepartment = (id: string) => {
        const deptEmployees = employees.filter(e => e.departmentId === id);
        if (deptEmployees.length > 0) {
            toast({
                title: "Cannot Delete",
                description: `This department has ${deptEmployees.length} employees. Please reassign them first.`,
                variant: "destructive"
            });
            return;
        }

        deleteDepartment(id);
        toast({ title: "Department Deleted", description: "Department has been removed from the organization." });
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDepartmentEmployees = (deptId: string) => {
        return employees.filter(e => e.departmentId === deptId);
    };

    const getDepartmentHead = (headId?: string) => {
        if (!headId) return null;
        return employees.find(e => e.id === headId);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/20" style={{ zoom: "90%" }}>
            <header className="py-2.5 px-6 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Departments</h1>
                            <Badge className="bg-purple-100 text-purple-700 border-none font-bold text-[9px] uppercase tracking-wider h-4.5 px-2.5">
                                {departments.filter(d => d.isActive).length} Active
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-[11px] font-medium leading-none">Manage organizational structure, hierarchy, and heads.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative group flex-1 md:w-60">
                            <Search className="absolute left-3.5 top-1/2 -transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                            <Input
                                placeholder="Search departments..."
                                className="pl-10 h-9 rounded-xl bg-slate-50 border-none shadow-none font-medium text-[11px] focus-visible:ring-2 focus-visible:ring-purple-100 placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-9 px-5 font-bold shadow-xl shadow-indigo-100 transition-all gap-2 text-[11px]"
                        >
                            <Plus size={14} /> Create Department
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-5 pt-6 max-w-[1440px] mx-auto w-full space-y-5">


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <Card className="rounded-[1.25rem] border-none bg-indigo-100/90 text-indigo-700 p-4 shadow-sm ring-1 ring-indigo-200/50 transition-all hover:scale-[1.02] relative overflow-hidden group">
                        <div className="relative z-10 space-y-2.5">
                            <div className="h-8 w-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm text-indigo-600 transition-transform group-hover:scale-110">
                                <Building2 size={16} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-indigo-700/60 tracking-tight leading-none">Total Departments</p>
                                <h3 className="text-xl font-bold tracking-tight leading-none text-slate-900">{departments.length}</h3>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[1.25rem] border-none bg-emerald-100/90 text-emerald-700 p-4 shadow-sm ring-1 ring-emerald-200/50 transition-all hover:scale-[1.02] relative overflow-hidden group">
                        <div className="relative z-10 space-y-2.5">
                            <div className="h-8 w-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm text-emerald-600 transition-transform group-hover:scale-110">
                                <Activity size={16} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-emerald-700/60 tracking-tight leading-none">Active Units</p>
                                <h3 className="text-xl font-bold tracking-tight leading-none text-slate-900">{departments.filter(d => d.isActive).length}</h3>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[1.25rem] border-none bg-purple-100/90 text-purple-700 p-4 shadow-sm ring-1 ring-purple-200/50 transition-all hover:scale-[1.02] relative overflow-hidden group">
                        <div className="relative z-10 space-y-2.5">
                            <div className="h-8 w-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm text-purple-600 transition-transform group-hover:scale-110">
                                <Crown size={16} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-purple-700/60 tracking-tight leading-none">With Dept Head</p>
                                <h3 className="text-xl font-bold tracking-tight leading-none text-slate-900">{departments.filter(d => d.headId).length}</h3>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-[1.25rem] border-none bg-amber-100/90 text-amber-700 p-4 shadow-sm ring-1 ring-amber-200/50 transition-all hover:scale-[1.02] relative overflow-hidden group">
                        <div className="relative z-10 space-y-2.5">
                            <div className="h-8 w-8 bg-white/90 rounded-lg flex items-center justify-center shadow-sm text-amber-600 transition-transform group-hover:scale-110">
                                <Users size={16} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-amber-700/60 tracking-tight leading-none">Workforce Hub</p>
                                <h3 className="text-xl font-bold tracking-tight leading-none text-slate-900">{employees.length}</h3>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Departments Grid */}
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                        {filteredDepartments.map((department, i) => {
                            const deptEmployees = getDepartmentEmployees(department.id);
                            const deptHead = getDepartmentHead(department.headId);
                            const totalEmployees = employees.length;
                            const percentage = totalEmployees > 0 ? (deptEmployees.length / totalEmployees) * 100 : 0;

                            return (
                                <motion.div
                                    key={department.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="group border-none shadow-sm hover:shadow-xl transition-all rounded-[1.5rem] bg-white overflow-hidden ring-1 ring-slate-100">
                                        <CardContent className="p-3.5 space-y-2.5 flex flex-col">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-[11px] ring-1 ring-purple-100 shadow-inner">
                                                        {department.code}
                                                    </div>
                                                    <div className="space-y-0">
                                                        <h3 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                                                            {department.name}
                                                        </h3>
                                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                                                            {department.id}
                                                        </p>
                                                    </div>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-300 hover:text-slate-600">
                                                            <MoreVertical size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 w-48 font-bold">
                                                        <DropdownMenuItem
                                                            className="rounded-lg h-10 gap-2"
                                                            onClick={() => {
                                                                setSelectedDepartment(department);
                                                                setFormData(department);
                                                                setIsEditDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit size={14} /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-lg h-10 text-rose-600 focus:bg-rose-50 gap-2"
                                                            onClick={() => handleDeleteDepartment(department.id)}
                                                        >
                                                            <Trash2 size={14} /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {department.description && (
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed border-l-2 border-purple-100 pl-3 py-0.5">
                                                    {department.description}
                                                </p>
                                            )}

                                            <div className="space-y-2.5">
                                                {deptHead && (
                                                    <div className="flex items-center gap-2.5 p-3 bg-purple-50/50 rounded-xl border border-purple-100/50">
                                                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-purple-100">
                                                            <AvatarFallback className="bg-purple-600 text-white font-bold text-[10px]">
                                                                {deptHead.profileImage}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[8px] font-bold text-purple-600 uppercase tracking-widest leading-none mb-1">Dept Head</p>
                                                            <p className="text-xs font-bold text-slate-900 truncate">{deptHead.firstName} {deptHead.lastName}</p>
                                                        </div>
                                                        <div className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">
                                                            <Crown size={12} />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Users size={14} className="text-slate-400" />
                                                            <span className="text-[11px] font-bold text-slate-600">Allocation</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-purple-600 tabular-nums">{deptEmployees.length}</span>
                                                    </div>
                                                    <Progress value={percentage} className="h-1.5 bg-slate-50" />
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">
                                                        {percentage.toFixed(1)}% workforce
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className={`${department.isActive ? 'bg-emerald-50 text-emerald-600 border-none' : 'bg-slate-100 text-slate-500 border-none'} font-bold text-[8px] h-5 px-2 rounded-md uppercase tracking-tight shadow-sm`}>
                                                        {department.isActive ? <CheckCircle2 size={10} className="mr-1" /> : <AlertCircle size={10} className="mr-1" />}
                                                        {department.isActive ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-500 border-none font-bold text-[8px] h-5 px-2 rounded-md uppercase tracking-tight">
                                                        Est. {new Date(department.createdAt).getFullYear()}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="pt-1.5 border-t border-slate-50">
                                                <Button
                                                    variant="ghost"
                                                    className="w-full h-8 rounded-lg font-bold text-[10px] gap-2 text-purple-700 hover:bg-purple-100/50"
                                                    onClick={() => {
                                                        setSelectedDepartment(department);
                                                        setIsViewMembersDialogOpen(true);
                                                    }}
                                                >
                                                    <Users size={12} /> View Members <ChevronRight size={12} />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>

                {filteredDepartments.length === 0 && (
                    <Card className="rounded-[3rem] border-2 border-dashed border-slate-100 bg-white p-20">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <Building2 size={64} className="text-slate-200" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">No Departments Found</h3>
                                <p className="text-sm text-slate-500 font-medium">Try adjusting your search or create a new department.</p>
                            </div>
                        </div>
                    </Card>
                )}
            </main>

            {/* Add Department Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border border-slate-300 p-8 max-w-4xl shadow-3xl max-h-[90vh] overflow-y-auto my-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <DialogHeader className="space-y-1">
                        <div className="h-9 w-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-1 shadow-inner">
                            <Plus size={20} />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Add Department</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-[10px]">
                            Create a new organizational unit or functional division.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Department Name *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            placeholder="e.g., Engineering"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Department Code *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            placeholder="ENG"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Department Head</Label>
                                    <Select value={formData.headId} onValueChange={(v) => setFormData({ ...formData, headId: v })}>
                                        <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                            <SelectValue placeholder="Select head" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-1 font-bold max-h-[300px]">
                                            <SelectItem value="none" className="rounded-lg h-8 text-xs">No Head Assigned</SelectItem>
                                            {employees.filter(e => e.status === 'Active').map(emp => (
                                                <SelectItem key={emp.id} value={emp.id} className="rounded-lg h-8 text-xs">
                                                    {emp.firstName} {emp.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Parent Department</Label>
                                    <Select value={formData.parentDepartmentId} onValueChange={(v) => setFormData({ ...formData, parentDepartmentId: v })}>
                                        <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                            <SelectValue placeholder="Select parent" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-1 font-bold">
                                            <SelectItem value="none" className="rounded-lg h-8 text-xs">None (Top Level)</SelectItem>
                                            {departments.map(dept => (
                                                <SelectItem key={dept.id} value={dept.id} className="rounded-lg h-8 text-xs">
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Department Description</Label>
                                <Textarea
                                    className="rounded-lg bg-slate-50 border border-slate-300 min-h-[148px] p-4 font-medium text-xs focus:border-indigo-500 transition-colors"
                                    placeholder="Describe the department's core focus and responsibilities..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-10 font-bold text-xs shadow-xl shadow-indigo-100 transition-all"
                            onClick={handleAddDepartment}
                        >
                            Create Department
                        </Button>
                        <Button variant="outline" className="h-11 px-6 rounded-xl font-bold border-slate-200 text-slate-600 text-xs" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Department Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border border-slate-300 p-8 max-w-4xl shadow-3xl max-h-[90vh] overflow-y-auto my-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <DialogHeader className="space-y-1">
                        <div className="h-9 w-9 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mb-1 shadow-inner">
                            <Edit size={20} />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Edit Department</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-[10px]">
                            Update department details and configuration.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Department Name *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Department Code *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Department Head</Label>
                                    <Select value={formData.headId || "none"} onValueChange={(v) => setFormData({ ...formData, headId: v === "none" ? undefined : v })}>
                                        <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-1 font-bold max-h-[300px]">
                                            <SelectItem value="none" className="rounded-lg h-8 text-xs">No Head Assigned</SelectItem>
                                            {employees.filter(e => e.status === 'Active').map(emp => (
                                                <SelectItem key={emp.id} value={emp.id} className="rounded-lg h-8 text-xs">
                                                    {emp.firstName} {emp.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Description</Label>
                                <Textarea
                                    className="rounded-lg bg-slate-50 border border-slate-300 min-h-[96px] p-4 font-medium text-xs focus:border-indigo-500 transition-colors"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-10 font-bold text-xs shadow-xl shadow-indigo-100 transition-all"
                            onClick={handleUpdateDepartment}
                        >
                            Save Changes
                        </Button>
                        <Button variant="outline" className="h-10 px-6 rounded-lg font-bold border-slate-300 text-slate-600 text-xs" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Members Dialog */}
            < Dialog open={isViewMembersDialogOpen} onOpenChange={setIsViewMembersDialogOpen} >
                <DialogContent className="bg-white rounded-[2rem] border border-slate-200 p-6 max-w-4xl shadow-3xl max-h-[90vh] overflow-y-auto my-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <DialogHeader className="space-y-2">
                        <div className="h-11 w-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-1 shadow-inner">
                            <Users size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                                {selectedDepartment?.name} <span className="text-slate-400 font-medium ml-2">Team</span>
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium text-xs mt-1">
                                {getDepartmentEmployees(selectedDepartment?.id || '').length} employees allocated to this unit.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="py-4">
                        {selectedDepartment && getDepartmentEmployees(selectedDepartment.id).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {getDepartmentEmployees(selectedDepartment.id).map((emp) => (
                                    <div key={emp.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                            <AvatarFallback className="bg-indigo-600 text-white font-bold text-xs">
                                                {emp.profileImage}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-slate-900 truncate">{emp.firstName} {emp.lastName}</h4>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">{emp.employeeCode}</p>
                                        </div>
                                        <Badge variant="outline" className="bg-white text-slate-600 border-none font-bold text-[8px] h-5 px-2 rounded-md uppercase tracking-tight">
                                            {emp.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                <Users size={40} className="text-slate-200" />
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">No Members Found</h4>
                                    <p className="text-[10px] text-slate-400 font-medium">This department has no allocated employees yet.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="pt-4 border-t border-slate-50">
                        <Button
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 font-bold text-xs shadow-xl transition-all"
                            onClick={() => setIsViewMembersDialogOpen(false)}
                        >
                            Close List
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >
        </div >
    );
};

export default DepartmentsPage;
