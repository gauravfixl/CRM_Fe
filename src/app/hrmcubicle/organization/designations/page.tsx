"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Plus,
    Search,
    Users,
    Edit,
    Trash2,
    MoreVertical,
    TrendingUp,
    Award,
    Target,
    Layers,
    Building2,
    ChevronRight,
    Star,
    CheckCircle2,
    AlertCircle,
    BarChart3
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganisationStore, type Designation } from "@/shared/data/organisation-store";
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

const DesignationsPage = () => {
    const { toast } = useToast();
    const { designations, departments, employees, addDesignation, updateDesignation, deleteDesignation } = useOrganisationStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState<string>("All");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewMembersDialogOpen, setIsViewMembersDialogOpen] = useState(false);

    const [formData, setFormData] = useState<Partial<Designation>>({
        title: "",
        code: "",
        level: 1,
        grade: "",
        departmentId: "",
        description: "",
        isActive: true
    });

    const handleAddDesignation = () => {
        if (!formData.title || !formData.code) {
            toast({ title: "Validation Error", description: "Title and Code are required", variant: "destructive" });
            return;
        }

        addDesignation({
            ...formData,
            level: formData.level || 1,
            isActive: true
        } as Omit<Designation, 'id' | 'employeeCount' | 'createdAt'>);

        toast({ title: "Designation Created", description: `${formData.title} has been added to the career framework.` });
        setIsAddDialogOpen(false);
        setFormData({
            title: "",
            code: "",
            level: 1,
            grade: "",
            departmentId: "",
            description: "",
            isActive: true
        });
    };

    const handleUpdateDesignation = () => {
        if (!selectedDesignation || !formData.title || !formData.code) {
            toast({ title: "Validation Error", description: "Title and Code are required", variant: "destructive" });
            return;
        }

        updateDesignation(selectedDesignation.id, formData);
        toast({ title: "Designation Updated", description: "Changes have been saved successfully." });
        setIsEditDialogOpen(false);
        setSelectedDesignation(null);
    };

    const handleDeleteDesignation = (id: string) => {
        const designationEmployees = employees.filter(e => e.designationId === id);
        if (designationEmployees.length > 0) {
            toast({
                title: "Cannot Delete",
                description: `This designation has ${designationEmployees.length} employees. Please reassign them first.`,
                variant: "destructive"
            });
            return;
        }

        deleteDesignation(id);
        toast({ title: "Designation Deleted", description: "Designation has been removed from the system." });
    };

    const getLevelLabel = (level: number) => {
        const labels = {
            1: "Entry Level",
            2: "Mid Level",
            3: "Senior Level",
            4: "Lead / Manager",
            5: "Executive"
        };
        return labels[level as keyof typeof labels] || "Unknown";
    };

    const getLevelColor = (level: number) => {
        const colors = {
            1: "bg-blue-50 text-blue-600 border-blue-100",
            2: "bg-emerald-50 text-emerald-600 border-emerald-100",
            3: "bg-purple-50 text-purple-600 border-purple-100",
            4: "bg-amber-50 text-amber-600 border-amber-100",
            5: "bg-rose-50 text-rose-600 border-rose-100"
        };
        return colors[level as keyof typeof colors] || colors[1];
    };

    const filteredDesignations = designations.filter(des => {
        const matchesSearch =
            des.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            des.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (des.grade && des.grade.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesLevel = levelFilter === 'All' || des.level.toString() === levelFilter;
        return matchesSearch && matchesLevel;
    });

    const getDesignationEmployees = (desId: string) => {
        return employees.filter(e => e.designationId === desId);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/20" style={{ zoom: "90%" }}>
            <header className="py-3 px-6 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Designations</h1>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] uppercase tracking-wider h-5 px-3">
                                {designations.filter(d => d.isActive).length} Active
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-[11px] font-medium leading-none">Manage role hierarchy, career levels, and designation framework.</p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Select value={levelFilter} onValueChange={setLevelFilter}>
                            <SelectTrigger className="w-36 h-10 rounded-xl bg-slate-50 border-none font-bold text-xs shadow-none hover:bg-slate-100 transition-colors">
                                <SelectValue placeholder="All Levels" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                                <SelectItem value="All" className="rounded-lg h-9">All Levels</SelectItem>
                                <SelectItem value="1" className="rounded-lg h-9">Entry Level</SelectItem>
                                <SelectItem value="2" className="rounded-lg h-9">Mid Level</SelectItem>
                                <SelectItem value="3" className="rounded-lg h-9">Senior Level</SelectItem>
                                <SelectItem value="4" className="rounded-lg h-9">Lead / Manager</SelectItem>
                                <SelectItem value="5" className="rounded-lg h-9">Executive</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="relative group flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Search designations..."
                                className="pl-11 h-10 rounded-xl bg-slate-50 border-none shadow-none font-medium text-xs focus-visible:ring-2 focus-visible:ring-slate-100 placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-10 px-6 font-bold shadow-xl shadow-indigo-100 transition-all gap-2 text-xs"
                        >
                            <Plus size={16} /> Add Designation
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-6 pt-3 max-w-[1440px] mx-auto w-full space-y-4">

                {/* Level Distribution Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((level) => {
                        const levelEmployees = employees.filter(e => {
                            const designation = designations.find(d => d.id === e.designationId);
                            return designation?.level === level;
                        });
                        const cardColors = {
                            1: "bg-blue-50/50 border-blue-100 hover:bg-blue-100/50 transition-colors",
                            2: "bg-emerald-50/50 border-emerald-100 hover:bg-emerald-100/50 transition-colors",
                            3: "bg-purple-50/50 border-purple-100 hover:bg-purple-100/50 transition-colors",
                            4: "bg-amber-50/50 border-amber-100 hover:bg-amber-100/50 transition-colors",
                            5: "bg-rose-50/50 border-rose-100 hover:bg-rose-100/50 transition-colors"
                        };
                        const textColors = {
                            1: "text-blue-700",
                            2: "text-emerald-700",
                            3: "text-purple-700",
                            4: "text-amber-700",
                            5: "text-rose-700"
                        };

                        return (
                            <Card key={level} className={`rounded-[1.5rem] border p-5 shadow-sm ${cardColors[level as keyof typeof cardColors]}`}>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-[11px] font-semibold ${textColors[level as keyof typeof textColors]}`}>{getLevelLabel(level)}</p>
                                        <Badge className={`${getLevelColor(level)} border-none font-bold text-[8px] h-5 px-1.5 rounded-md`}>
                                            L{level}
                                        </Badge>
                                    </div>
                                    <h3 className={`text-xl font-bold tracking-tight tabular-nums ${textColors[level as keyof typeof textColors]}`}>{levelEmployees.length}</h3>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Designations Grid */}
                <AnimatePresence mode="popLayout">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDesignations.map((designation, i) => {
                            const desEmployees = getDesignationEmployees(designation.id);
                            const department = departments.find(d => d.id === designation.departmentId);
                            const totalEmployees = employees.length;
                            const percentage = totalEmployees > 0 ? (desEmployees.length / totalEmployees) * 100 : 0;

                            return (
                                <motion.div
                                    key={designation.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className={`group border-none shadow-sm hover:shadow-xl transition-all rounded-[2rem] overflow-hidden ring-1 ring-slate-100 ${i % 5 === 0 ? 'bg-indigo-50/50 hover:bg-indigo-50' :
                                        i % 5 === 1 ? 'bg-emerald-50/50 hover:bg-emerald-50' :
                                            i % 5 === 2 ? 'bg-amber-50/50 hover:bg-amber-50' :
                                                i % 5 === 3 ? 'bg-rose-50/50 hover:bg-rose-50' :
                                                    'bg-blue-50/50 hover:bg-blue-50'
                                        }`}>
                                        <CardContent className="p-5 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-white/20 ${getLevelColor(designation.level)} border-none shadow-inner`}>
                                                        {designation.code}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                                                            {designation.title}
                                                        </h3>
                                                        {designation.grade && (
                                                            <p className="text-[9px] font-bold text-slate-400">
                                                                Grade: {designation.grade}
                                                            </p>
                                                        )}
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
                                                                setSelectedDesignation(designation);
                                                                setFormData(designation);
                                                                setIsEditDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit size={14} /> Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-lg h-10 text-rose-600 focus:bg-rose-50 gap-2"
                                                            onClick={() => handleDeleteDesignation(designation.id)}
                                                        >
                                                            <Trash2 size={14} /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="space-y-3">
                                                <Badge variant="outline" className={`${getLevelColor(designation.level)} border-none font-bold text-[8px] h-5 px-2 rounded-md tracking-tight shadow-sm w-fit`}>
                                                    <Star size={10} className="mr-1" />
                                                    {getLevelLabel(designation.level)}
                                                </Badge>

                                                {department && (
                                                    <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                                        <Building2 size={12} className="text-slate-400" />
                                                        <span className="font-bold">{department.name}</span>
                                                    </div>
                                                )}

                                                {designation.description && (
                                                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed line-clamp-2 border-l-2 border-slate-200 pl-3">
                                                        {designation.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="pt-3 border-t border-slate-100/50">
                                                <Button
                                                    variant="ghost"
                                                    className="w-full h-9 rounded-lg font-bold text-[10px] gap-2 text-indigo-600 hover:bg-white/50"
                                                    onClick={() => {
                                                        setSelectedDesignation(designation);
                                                        setIsViewMembersDialogOpen(true);
                                                    }}
                                                >
                                                    <Users size={12} /> View Members <ChevronRight size={12} />
                                                </Button>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Users size={14} className="text-slate-400" />
                                                        <span className="text-[11px] font-bold text-slate-600">Employees</span>
                                                    </div>
                                                    <span className="text-base font-bold text-indigo-600 tabular-nums">{desEmployees.length}</span>
                                                </div>
                                                <Progress value={percentage} className="h-1.5 bg-slate-50" />
                                                <p className="text-[9px] font-bold text-slate-400 text-right">
                                                    {percentage.toFixed(1)}% workforce
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={`${designation.isActive ? 'bg-emerald-50 text-emerald-600 border-none' : 'bg-slate-100 text-slate-500 border-none'} font-bold text-[8px] h-5 px-2 rounded-md tracking-tight shadow-sm`}>
                                                    {designation.isActive ? <CheckCircle2 size={10} className="mr-1" /> : <AlertCircle size={10} className="mr-1" />}
                                                    {designation.isActive ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </AnimatePresence>

                {filteredDesignations.length === 0 && (
                    <Card className="rounded-[3rem] border-2 border-dashed border-slate-100 bg-white p-20">
                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                            <Briefcase size={64} className="text-slate-200" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">No Designations Found</h3>
                                <p className="text-sm text-slate-500 font-medium">Try adjusting your filters or add a new designation.</p>
                            </div>
                        </div>
                    </Card>
                )}
            </main>

            {/* Add Designation Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="bg-white rounded-3xl border border-slate-300 p-8 max-w-4xl shadow-3xl max-h-[90vh] overflow-y-auto my-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <DialogHeader className="space-y-1">
                        <div className="h-9 w-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-1 shadow-inner">
                            <Briefcase size={20} />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Add Designation</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-[10px]">
                            Create a new role in your career framework.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Designation Title *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            placeholder="e.g., Senior Software Engineer"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Code *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            placeholder="SSE"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Career Level *</Label>
                                        <Select value={formData.level?.toString()} onValueChange={(v) => setFormData({ ...formData, level: parseInt(v) })}>
                                            <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-1 font-bold">
                                                <SelectItem value="1" className="rounded-lg h-8 text-xs">L1 - Entry</SelectItem>
                                                <SelectItem value="2" className="rounded-lg h-8 text-xs">L2 - Mid</SelectItem>
                                                <SelectItem value="3" className="rounded-lg h-8 text-xs">L3 - Senior</SelectItem>
                                                <SelectItem value="4" className="rounded-lg h-8 text-xs">L4 - Lead</SelectItem>
                                                <SelectItem value="5" className="rounded-lg h-8 text-xs">L5 - Executive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Grade</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            placeholder="e.g., M2"
                                            value={formData.grade}
                                            onChange={(e) => setFormData({ ...formData, grade: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Department</Label>
                                        <Select value={formData.departmentId} onValueChange={(v) => setFormData({ ...formData, departmentId: v })}>
                                            <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-1 font-bold">
                                                <SelectItem value="none" className="rounded-lg h-8 text-xs">No Department</SelectItem>
                                                {departments.map(dept => (
                                                    <SelectItem key={dept.id} value={dept.id} className="rounded-lg h-8 text-xs">{dept.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Role Description</Label>
                                <Textarea
                                    className="rounded-lg bg-slate-50 border border-slate-300 min-h-[148px] p-4 font-medium text-xs focus:border-indigo-500 transition-colors"
                                    placeholder="Describe the core responsibilities and expectations for this role..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-200 sm:justify-end">
                        <Button
                            className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-lg h-10 font-bold text-xs shadow-xl shadow-indigo-100 transition-all"
                            onClick={handleAddDesignation}
                        >
                            Create Designation
                        </Button>
                        <Button variant="outline" className="h-10 px-6 rounded-lg font-bold border-slate-300 text-slate-600 text-xs" onClick={() => setIsAddDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Designation Dialog */}
            < Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} >
                <DialogContent className="bg-white rounded-3xl border border-slate-300 p-8 max-w-4xl shadow-3xl max-h-[90vh] overflow-y-auto my-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <DialogHeader className="space-y-1">
                        <div className="h-9 w-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-1 shadow-inner">
                            <Edit size={20} />
                        </div>
                        <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">Edit Designation</DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium text-[10px]">
                            Update designation details and configuration.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Designation Title *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Code *</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Career Level *</Label>
                                        <Select value={formData.level?.toString()} onValueChange={(v) => setFormData({ ...formData, level: parseInt(v) })}>
                                            <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-1 font-bold">
                                                <SelectItem value="1" className="rounded-lg h-8 text-xs">L1 - Entry</SelectItem>
                                                <SelectItem value="2" className="rounded-lg h-8 text-xs">L2 - Mid</SelectItem>
                                                <SelectItem value="3" className="rounded-lg h-8 text-xs">L3 - Senior</SelectItem>
                                                <SelectItem value="4" className="rounded-lg h-8 text-xs">L4 - Lead</SelectItem>
                                                <SelectItem value="5" className="rounded-lg h-8 text-xs">L5 - Executive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Grade</Label>
                                        <Input
                                            className="rounded-lg h-10 bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors"
                                            value={formData.grade}
                                            onChange={(e) => setFormData({ ...formData, grade: e.target.value.toUpperCase() })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] font-bold text-slate-500 capitalize tracking-widest ml-1">Department</Label>
                                        <Select value={formData.departmentId || "none"} onValueChange={(v) => setFormData({ ...formData, departmentId: v === "none" ? undefined : v })}>
                                            <SelectTrigger className="h-10 rounded-lg bg-slate-50 border border-slate-300 font-bold px-4 text-xs focus:border-indigo-500 transition-colors">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border border-slate-200 shadow-2xl p-1 font-bold">
                                                <SelectItem value="none" className="rounded-lg h-8 text-xs">No Department</SelectItem>
                                                {departments.map(dept => (
                                                    <SelectItem key={dept.id} value={dept.id} className="rounded-lg h-8 text-xs">{dept.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
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
                            onClick={handleUpdateDesignation}
                        >
                            Save Changes
                        </Button>
                        <Button variant="outline" className="h-10 px-6 rounded-lg font-bold border-slate-300 text-slate-600 text-xs" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >

            {/* View Members Dialog */}
            < Dialog open={isViewMembersDialogOpen} onOpenChange={setIsViewMembersDialogOpen} >
                <DialogContent className="bg-white rounded-[2rem] border border-slate-200 p-6 max-w-4xl shadow-3xl max-h-[90vh] overflow-y-auto my-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <DialogHeader className="space-y-2">
                        <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-1 shadow-inner">
                            <Users size={24} />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900">
                                {selectedDesignation?.title} <span className="text-slate-400 font-medium ml-2">Team</span>
                            </DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium text-xs mt-1">
                                {getDesignationEmployees(selectedDesignation?.id || '').length} employees currently holding this role.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="py-4">
                        {selectedDesignation && getDesignationEmployees(selectedDesignation.id).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {getDesignationEmployees(selectedDesignation.id).map((emp) => (
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
                                    <p className="text-[10px] text-slate-400 font-medium">There are no employees with this designation yet.</p>
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

export default DesignationsPage;
