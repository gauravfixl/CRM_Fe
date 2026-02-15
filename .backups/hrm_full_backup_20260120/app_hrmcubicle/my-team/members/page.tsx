"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Mail,
    Phone,
    Calendar,
    Building2,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    MoreVertical,
    UserPlus,
    ArrowRight
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/components/ui/use-toast";
import { useTeamStore } from "@/shared/data/team-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const TeamMembersPage = () => {
    const { toast } = useToast();
    const { members, addMember, updateMember, removeMember } = useTeamStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'On Leave'>('All');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [memberForm, setMemberForm] = useState({
        name: '',
        email: '',
        phone: '',
        designation: '',
        department: '',
    });

    const filteredMembers = members.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.designation.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || m.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = [
        { label: "Total Members", value: members.length, color: "bg-[#CB9DF0]" },
        { label: "Active", value: members.filter(m => m.status === 'Active').length, color: "bg-emerald-100" },
        { label: "On Leave", value: members.filter(m => m.status === 'On Leave').length, color: "bg-amber-100" },
    ];

    const handleAdd = () => {
        if (!memberForm.name || !memberForm.email) {
            toast({ title: "Error", description: "Name and Email are required", variant: "destructive" });
            return;
        }

        const avatar = memberForm.name.split(' ').map(n => n[0]).join('').toUpperCase();
        addMember({
            ...memberForm,
            avatar,
            status: 'Active',
            joiningDate: new Date().toISOString()
        } as any);

        setIsAddOpen(false);
        setMemberForm({ name: '', email: '', phone: '', designation: '', department: '' });
        toast({ title: "Team Member Added", description: `${memberForm.name} is now part of your team.` });
    };

    const handleEdit = (member: any) => {
        setSelectedMember(member);
        setMemberForm({
            name: member.name,
            email: member.email,
            phone: member.phone,
            designation: member.designation,
            department: member.department,
        });
        setIsEditOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedMember) return;
        updateMember(selectedMember.id, memberForm as any);
        setIsEditOpen(false);
        toast({ title: "Profile Updated", description: "Team member details saved." });
    };

    const handleDelete = (member: any) => {
        if (confirm(`Remove ${member.name} from your team?`)) {
            removeMember(member.id);
            toast({ title: "Member Removed" });
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Members</h1>
                    <p className="text-slate-500 font-medium">View and manage your team members.</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                            <Plus className="mr-2 h-5 w-5" /> Add Team Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Add Team Member</DialogTitle>
                            <DialogDescription className="font-medium text-slate-500">Invite a new person to join your department.</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-6 py-6 font-display">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Full Name *</Label>
                                <Input
                                    placeholder="Employee name"
                                    value={memberForm.name}
                                    onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Work Email *</Label>
                                <Input
                                    type="email"
                                    placeholder="email@company.com"
                                    value={memberForm.email}
                                    onChange={e => setMemberForm({ ...memberForm, email: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Phone</Label>
                                <Input
                                    placeholder="+91..."
                                    value={memberForm.phone}
                                    onChange={e => setMemberForm({ ...memberForm, phone: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Designation</Label>
                                <Input
                                    placeholder="e.g. UX Designer"
                                    value={memberForm.designation}
                                    onChange={e => setMemberForm({ ...memberForm, designation: e.target.value })}
                                    className="rounded-xl bg-slate-50 border-none h-12"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button className="w-full bg-slate-900 text-white rounded-xl h-14 font-black text-lg shadow-xl hover:scale-[1.02] transition-transform" onClick={handleAdd}>
                                Confirm Admission <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-8 relative overflow-hidden`}>
                            <h3 className="text-4xl font-black text-slate-900 relative z-10">{stat.value}</h3>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 opacity-60 relative z-10">{stat.label}</p>
                            <Users className="absolute right-[-10px] bottom-[-10px] text-black/5 h-24 w-24" />
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <Input
                        placeholder="Search by name, role or email..."
                        className="pl-14 h-14 rounded-2xl bg-white border-none shadow-md font-bold text-slate-700 placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 bg-white p-1.5 rounded-2xl shadow-md border border-slate-50">
                    {(['All', 'Active', 'On Leave'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${filterStatus === status
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMembers.map((member, i) => (
                    <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 rounded-[2.5rem] bg-white p-8 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className="flex items-center gap-5">
                                    <Avatar className="h-20 w-20 ring-4 ring-slate-50 ring-offset-2 bg-indigo-100 text-indigo-700 font-black text-2xl shadow-inner">
                                        <AvatarFallback>{member.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-black text-xl text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                                        <p className="text-sm text-slate-400 font-black uppercase tracking-wider">{member.designation}</p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all">
                                            <MoreVertical size={18} className="text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl p-2 border-none shadow-2xl">
                                        <DropdownMenuItem className="font-bold rounded-xl focus:bg-indigo-50" onClick={() => handleEdit(member)}>
                                            <Edit size={16} className="mr-2 text-indigo-600" /> Edit Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="font-bold rounded-xl focus:bg-rose-50 text-rose-600" onClick={() => handleDelete(member)}>
                                            <Trash2 size={16} className="mr-2" /> Expel from Team
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                                    <div className="flex items-center gap-4 text-slate-600">
                                        <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                            <Mail size={14} className="text-indigo-400" />
                                        </div>
                                        <span className="font-bold text-sm truncate">{member.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-slate-600">
                                        <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                            <Building2 size={14} className="text-indigo-400" />
                                        </div>
                                        <span className="font-bold text-sm">{member.department}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <Badge className={`${member.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} border-none font-black px-4 py-1.5 rounded-xl uppercase text-[10px] tracking-widest`}>
                                        {member.status}
                                    </Badge>
                                    <div className="flex items-center gap-1.5 text-slate-300 group-hover:text-indigo-400 transition-colors">
                                        <Calendar size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Joined {new Date(member.joiningDate).getMonth() + 1}/{new Date(member.joiningDate).getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Edit Team Member</DialogTitle>
                        <DialogDescription className="font-medium text-slate-500">Update employee records and designation.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-6 py-6 font-display">
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Full Name</Label>
                            <Input
                                value={memberForm.name}
                                onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Designation</Label>
                            <Input
                                value={memberForm.designation}
                                onChange={e => setMemberForm({ ...memberForm, designation: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Phone</Label>
                            <Input
                                value={memberForm.phone}
                                onChange={e => setMemberForm({ ...memberForm, phone: e.target.value })}
                                className="rounded-xl bg-slate-50 border-none h-12"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="w-full bg-slate-900 text-white rounded-xl h-14 font-black text-lg shadow-xl" onClick={handleUpdate}>
                            Save Modifications
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {filteredMembers.length === 0 && (
                <div className="text-center p-24 bg-white rounded-[3rem] shadow-sm border border-slate-50">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="text-slate-200" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-300">No personnel found</h3>
                    <p className="text-slate-400 font-medium">Try refining your search parameters.</p>
                </div>
            )}
        </div>
    );
};

export default TeamMembersPage;
