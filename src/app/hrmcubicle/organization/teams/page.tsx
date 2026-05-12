"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Plus,
    Search,
    Zap,
    Target,
    ChevronRight,
    ArrowUpRight,
    LayoutGrid,
    Building2,
    Crown,
    CheckCircle2,
    MoreVertical,
    Edit,
    Trash2
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useOrganisationStore, type Team } from "@/shared/data/organisation-store";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const TeamsPage = () => {
    const router = useRouter();
    const { toast } = useToast();
    const { teams, departments, employees, addTeam, updateTeam, deleteTeam } = useOrganisationStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState<string>("All");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [formData, setFormData] = useState<Partial<Team>>({
        name: "",
        departmentId: "",
        leadId: "",
        mission: "",
        memberIds: [],
        stats: { velocity: 80, tasksCompleted: 0, uptime: "100%" }
    });

    const handleAddTeam = () => {
        if (!formData.name || !formData.leadId || !formData.departmentId) {
            toast({ title: "Validation Error", description: "Name, Lead, and Department are required", variant: "destructive" });
            return;
        }
        addTeam({
            ...formData,
            memberIds: [formData.leadId!],
            stats: formData.stats || { velocity: 80, tasksCompleted: 0, uptime: "100%" }
        } as Omit<Team, 'id' | 'createdAt'>);
        toast({ title: "Team Created", description: `${formData.name} is now operational.` });
        setIsAddDialogOpen(false);
        setFormData({ name: "", departmentId: "", leadId: "", mission: "", memberIds: [], stats: { velocity: 80, tasksCompleted: 0, uptime: "100%" } });
    };

    const handleUpdateTeam = () => {
        if (!selectedTeam || !formData.name) return;
        updateTeam(selectedTeam.id, formData);
        toast({ title: "Team Updated", description: "Team configurations saved." });
        setIsEditDialogOpen(false);
        setSelectedTeam(null);
    };

    const handleDeleteTeam = (id: string) => {
        deleteTeam(id);
        toast({ title: "Team Dissolved", description: "Team has been removed from organization." });
    };

    const filteredTeams = teams.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = departmentFilter === 'All' || t.departmentId === departmentFilter;
        return matchesSearch && matchesDept;
    });

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/20" style={{ zoom: "90%" }}>
            <header className="py-4 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Teams</h1>
                            <Badge className="bg-indigo-600 text-white border-none font-bold text-[10px] uppercase tracking-wider h-5 px-3">
                                {teams.length} Specialized Units
                            </Badge>
                        </div>
                        <p className="text-slate-500 text-[11px] font-medium leading-none">Collaborative workforces across functional departments.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-10 px-8 font-bold shadow-xl shadow-indigo-100 transition-all gap-2 text-xs"
                        >
                            <Plus size={16} /> Create Team
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 pt-6 max-w-[1440px] mx-auto w-full space-y-8">
                {/* 📊 Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="rounded-xl border-none bg-gradient-to-br from-indigo-50 to-indigo-100/60 p-6 shadow-sm ring-1 ring-indigo-100">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Total Teams</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-extrabold text-indigo-700 leading-none">{teams.length}</h3>
                            <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <LayoutGrid size={20} />
                            </div>
                        </div>
                    </Card>
                    <Card className="rounded-xl border-none bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-6 shadow-sm ring-1 ring-emerald-100">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">Active Members</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-extrabold text-emerald-700 leading-none">
                                {Array.from(new Set(teams.flatMap(t => t.memberIds))).length}
                            </h3>
                            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <Users size={20} />
                            </div>
                        </div>
                    </Card>
                    <Card className="rounded-xl border-none bg-gradient-to-br from-amber-50 to-amber-100/60 p-6 shadow-sm ring-1 ring-amber-100">
                        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-3">Avg. Velocity</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-extrabold text-amber-700 leading-none">
                                {Math.round(teams.reduce((acc, t) => acc + t.stats.velocity, 0) / (teams.length || 1))}%
                            </h3>
                            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                <Zap size={20} />
                            </div>
                        </div>
                    </Card>
                    <Card className="rounded-xl border-none bg-gradient-to-br from-violet-50 to-violet-100/60 p-6 shadow-sm ring-1 ring-violet-100 overflow-hidden relative group">
                        <Target className="absolute -right-4 -bottom-4 h-24 w-24 text-violet-100 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-3">Goal Alignment</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-2xl font-extrabold text-violet-700 leading-none">94%</h3>
                            <ArrowUpRight className="text-violet-500 mb-1" size={24} />
                        </div>
                    </Card>
                </div>

                {/* 🔍 Search & Filters */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search teams..."
                            className="pl-11 h-11 rounded-xl bg-white border-slate-200 shadow-none font-bold text-xs focus-visible:ring-2 focus-visible:ring-indigo-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                        <SelectTrigger className="w-48 h-11 rounded-xl bg-white border-slate-200 font-bold text-xs ring-1 ring-slate-100">
                            <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl p-2 font-bold">
                            <SelectItem value="All" className="rounded-lg h-10">All Departments</SelectItem>
                            {departments.map(d => (
                                <SelectItem key={d.id} value={d.id} className="rounded-lg h-10">{d.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* 🟦 Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredTeams.map((team, i) => {
                            const lead = employees.find(e => e.id === team.leadId);
                            const dept = departments.find(d => d.id === team.departmentId);

                            return (
                                <motion.div
                                    key={team.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => router.push(`/hrmcubicle/organization/teams/${team.id}`)}
                                    className="cursor-pointer"
                                >
                                    <Card className="group relative border-none shadow-sm hover:shadow-2xl transition-all rounded-[3rem] bg-white overflow-hidden ring-1 ring-slate-100">
                                        <CardContent className="p-8 space-y-6">
                                            <div className="flex justify-between items-start">
                                                <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-110">
                                                    <Zap size={24} className="text-indigo-400" />
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-slate-300 hover:text-slate-600 rounded-full"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <MoreVertical size={16} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 w-48 font-bold">
                                                        <DropdownMenuItem
                                                            className="rounded-xl h-11 gap-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedTeam(team);
                                                                setFormData(team);
                                                                setIsEditDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit size={16} /> Edit Team
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="rounded-xl h-11 text-rose-600 focus:bg-rose-50 gap-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteTeam(team.id);
                                                            }}
                                                        >
                                                            <Trash2 size={16} /> Dissolve
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                                                        {team.name}
                                                    </h3>
                                                    <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold text-[8px] rounded uppercase">{dept?.code}</Badge>
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-500 leading-relaxed line-clamp-2 italic">
                                                    {team.mission}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 italic transition-colors group-hover:bg-white group-hover:shadow-inner">
                                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                                    <AvatarFallback className="bg-slate-900 text-white font-bold text-xs uppercase">{lead?.profileImage}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Team Lead</p>
                                                    <p className="text-xs font-bold text-slate-900 leading-none mt-0.5">{lead?.firstName} {lead?.lastName}</p>
                                                </div>
                                                <Crown size={14} className="ml-auto text-amber-500" />
                                            </div>

                                            <div className="pt-2 flex items-center justify-between border-t border-slate-50 italic">
                                                <div className="flex -space-x-3">
                                                    {team.memberIds.slice(0, 4).map((mId, idx) => {
                                                        const m = employees.find(e => e.id === mId);
                                                        return (
                                                            <Avatar key={idx} className="h-8 w-8 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                                                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-[8px] uppercase">{m?.profileImage}</AvatarFallback>
                                                            </Avatar>
                                                        );
                                                    })}
                                                    {team.memberIds.length > 4 && (
                                                        <div className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white text-[8px] font-bold text-slate-600 flex items-center justify-center ring-1 ring-slate-100">
                                                            +{team.memberIds.length - 4}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                                                    Enter Workhub <ChevronRight size={14} />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </main>

            {/* Add Team Sheet */}
            <SideFormSheet
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                title="Create New Team"
                description="Define a new specialized unit to drive specific business objectives."
                icon={<Plus size={20} />}
                accentColor="#4f46e5"
                width="md"
                submitLabel="Launch Team"
                onSubmit={(e) => { e.preventDefault(); handleAddTeam(); }}
            >
                <div className="space-y-4">
                    <Field label="Team Name" required>
                        <Input
                            placeholder="e.g. Growth Hacking Team"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Department" required>
                            <Select value={formData.departmentId} onValueChange={(v) => setFormData({ ...formData, departmentId: v })}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent className="max-h-[250px]">
                                    {departments.map(d => (
                                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Team Lead" required>
                            <Select value={formData.leadId} onValueChange={(v) => setFormData({ ...formData, leadId: v })}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {employees.map(emp => (
                                        <SelectItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field label="Team Mission">
                        <Input
                            placeholder="State the core objective..."
                            value={formData.mission}
                            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                        />
                    </Field>
                </div>
            </SideFormSheet>

            {/* Edit Team Sheet */}
            <SideFormSheet
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                title="Update Team"
                description="Modify team identity and strategic orientation."
                icon={<Edit size={20} />}
                accentColor="#7c3aed"
                width="md"
                submitLabel="Save Changes"
                onSubmit={(e) => { e.preventDefault(); handleUpdateTeam(); }}
            >
                <div className="space-y-4">
                    <Field label="Team Name" required>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Department">
                            <Select value={formData.departmentId} onValueChange={(v) => setFormData({ ...formData, departmentId: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {departments.map(d => (
                                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Team Lead">
                            <Select value={formData.leadId} onValueChange={(v) => setFormData({ ...formData, leadId: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {employees.map(emp => (
                                        <SelectItem key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field label="Team Mission">
                        <Input
                            value={formData.mission}
                            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                        />
                    </Field>
                </div>
            </SideFormSheet>
        </div>
    );
};

export default TeamsPage;
