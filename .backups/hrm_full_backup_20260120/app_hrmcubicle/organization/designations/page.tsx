"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building2, Users, Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganizationStore, type Designation } from "@/shared/data/organization-store";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const DesignationsPage = () => {
    const { toast } = useToast();
    const { designations, addDesignation, updateDesignation, deleteDesignation } = useOrganizationStore();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
    const [designationForm, setDesignationForm] = useState({
        title: '',
        level: '',
        department: ''
    });

    const handleAdd = () => {
        if (!designationForm.title || !designationForm.level) {
            toast({ title: "Error", description: "Title and Level are required", variant: "destructive" });
            return;
        }

        addDesignation({
            title: designationForm.title,
            level: designationForm.level,
            department: designationForm.department
        });
        setIsAddOpen(false);
        setDesignationForm({ title: '', level: '', department: '' });
        toast({ title: "Designation Created", description: `${designationForm.title} has been created.` });
    };

    const handleEdit = (designation: Designation) => {
        setSelectedDesignation(designation);
        setDesignationForm({
            title: designation.title,
            level: designation.level,
            department: designation.department
        });
        setIsEditOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedDesignation || !designationForm.title || !designationForm.level) return;

        updateDesignation(selectedDesignation.id, {
            title: designationForm.title,
            level: designationForm.level,
            department: designationForm.department
        });
        setIsEditOpen(false);
        toast({ title: "Designation Updated", description: "Changes saved successfully." });
    };

    const handleDelete = (designation: Designation) => {
        if (confirm(`Are you sure you want to delete ${designation.title}?`)) {
            deleteDesignation(designation.id);
            toast({ title: "Designation Deleted", description: `${designation.title} has been removed.` });
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Designations</h1>
                    <p className="text-slate-500 font-medium">Manage job titles and organizational hierarchy.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                            <Plus className="mr-2 h-5 w-5" /> Add Designation
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border-none p-8">
                        <DialogHeader>
                            <DialogTitle>Add New Designation</DialogTitle>
                            <DialogDescription>Create a new job title in the organization.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-2">
                                <Label>Job Title *</Label>
                                <Input
                                    placeholder="e.g. Senior Developer, Manager"
                                    value={designationForm.title}
                                    onChange={e => setDesignationForm({ ...designationForm, title: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Level *</Label>
                                <Select value={designationForm.level} onValueChange={(v) => setDesignationForm({ ...designationForm, level: v })}>
                                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="L3">L3 - Junior</SelectItem>
                                        <SelectItem value="L4">L4 - Mid-level</SelectItem>
                                        <SelectItem value="L5">L5 - Senior</SelectItem>
                                        <SelectItem value="L6">L6 - Lead</SelectItem>
                                        <SelectItem value="L7">L7 - Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Input
                                    placeholder="e.g. Engineering"
                                    value={designationForm.department}
                                    onChange={e => setDesignationForm({ ...designationForm, department: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleAdd}>
                                Create Designation
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designations.map((des, i) => (
                    <motion.div key={des.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className="border-none shadow-lg hover:shadow-xl transition-all rounded-[2rem] bg-white p-6 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                                    <Briefcase className="text-purple-600" size={24} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-indigo-100 text-indigo-700 border-none font-bold">
                                        {des.level}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                                <MoreVertical size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(des)}>
                                                <Edit size={14} className="mr-2" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(des)} className="text-rose-600">
                                                <Trash2 size={14} className="mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            <h3 className="font-black text-xl text-slate-900 mb-2">{des.title}</h3>
                            <div className="space-y-3 mt-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={16} className="text-slate-400" />
                                        <span className="text-sm font-medium text-slate-600">Department</span>
                                    </div>
                                    <span className="font-bold text-slate-900 text-sm">{des.department}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-slate-400" />
                                        <span className="text-sm font-medium text-slate-600">Count</span>
                                    </div>
                                    <span className="font-black text-indigo-600 text-lg">{des.count}</span>
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
                        <DialogTitle>Edit Designation</DialogTitle>
                        <DialogDescription>Update designation information.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input
                                value={designationForm.title}
                                onChange={e => setDesignationForm({ ...designationForm, title: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Level</Label>
                            <Select value={designationForm.level} onValueChange={(v) => setDesignationForm({ ...designationForm, level: v })}>
                                <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L3">L3 - Junior</SelectItem>
                                    <SelectItem value="L4">L4 - Mid-level</SelectItem>
                                    <SelectItem value="L5">L5 - Senior</SelectItem>
                                    <SelectItem value="L6">L6 - Lead</SelectItem>
                                    <SelectItem value="L7">L7 - Manager</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <Input
                                value={designationForm.department}
                                onChange={e => setDesignationForm({ ...designationForm, department: e.target.value })}
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

export default DesignationsPage;
