"use client"

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Users,
    Briefcase,
    Plus,
    Search,
    MoreHorizontal,
    ChevronRight,
    LayoutGrid,
    Target,
    Settings,
    DollarSign,
    Box,
    ShieldCheck,
    Mail,
    Pencil,
    Trash2,
    UserPlus,
    UserMinus,
    Download,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Progress } from "@/shared/components/ui/progress";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useOrganisationStore, type Team } from "@/shared/data/organisation-store";

const DepartmentDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();

    const departments = useOrganisationStore((s) => s.departments);
    const employees = useOrganisationStore((s) => s.employees);
    const designations = useOrganisationStore((s) => s.designations);
    const teams = useOrganisationStore((s) => s.teams);
    const updateDepartment = useOrganisationStore((s) => s.updateDepartment);
    const addTeam = useOrganisationStore((s) => s.addTeam);
    const updateTeam = useOrganisationStore((s) => s.updateTeam);
    const deleteTeam = useOrganisationStore((s) => s.deleteTeam);
    const addTeamMember = useOrganisationStore((s) => s.addTeamMember);
    const removeTeamMember = useOrganisationStore((s) => s.removeTeamMember);

    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("teams");
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [showEditTeam, setShowEditTeam] = useState(false);
    const [showManageMembers, setShowManageMembers] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showMessageHOD, setShowMessageHOD] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [generatingReport, setGeneratingReport] = useState(false);

    const [teamForm, setTeamForm] = useState({ name: "", leadId: "", mission: "" });
    const [settingsForm, setSettingsForm] = useState({ name: "", code: "", description: "", headId: "" });
    const [messageBody, setMessageBody] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    const deptId = params?.id as string;
    const department = departments.find((d) => d.id === deptId);

    useEffect(() => {
        if (department) {
            setSettingsForm({
                name: department.name,
                code: department.code,
                description: department.description || "",
                headId: department.headId || "",
            });
        }
    }, [department]);

    if (!mounted) return null;

    if (!department) {
        return (
            <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center">
                    <Trash2 className="h-7 w-7 text-rose-500" />
                </div>
                <h1 className="text-2xl font-black text-slate-900">Department Not Found</h1>
                <p className="text-slate-500 max-w-md">
                    The department with ID <span className="font-bold text-slate-700">{deptId}</span> does not exist or has been removed.
                </p>
                <Button onClick={() => router.push("/hrmcubicle/organization/departments")} className="rounded-xl">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Departments
                </Button>
            </div>
        );
    }

    const hod = department.headId ? employees.find((e) => e.id === department.headId) : undefined;
    const hodDesignation = hod?.designationId ? designations.find((d) => d.id === hod.designationId) : undefined;

    const deptEmployees = employees.filter((e) => e.departmentId === department.id);
    const activeEmployees = deptEmployees.filter((e) => e.status === "Active");
    const deptTeams = teams.filter((t) => t.departmentId === department.id);

    const openRoles = designations.filter((d) => d.departmentId === department.id && d.isActive).length;
    const totalBudget = deptEmployees.length * 65000;

    const formatINR = (n: number) => {
        if (n >= 10000000) return `\u20B9 ${(n / 10000000).toFixed(1)} Cr`;
        if (n >= 100000) return `\u20B9 ${(n / 100000).toFixed(1)} L`;
        return `\u20B9 ${n.toLocaleString("en-IN")}`;
    };

    const filteredTeams = deptTeams.filter((t) => {
        const lead = employees.find((e) => e.id === t.leadId);
        const leadName = lead ? `${lead.firstName} ${lead.lastName}` : "";
        const q = searchQuery.toLowerCase();
        return t.name.toLowerCase().includes(q) || leadName.toLowerCase().includes(q) || t.mission.toLowerCase().includes(q);
    });

    const filteredMembers = deptEmployees.filter((e) => {
        const q = searchQuery.toLowerCase();
        return (
            `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
            e.employeeCode.toLowerCase().includes(q) ||
            e.email.toLowerCase().includes(q)
        );
    });

    const handleCreateTeam = (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamForm.name.trim() || !teamForm.leadId) {
            toast({ title: "Missing Fields", description: "Team name and lead are required.", variant: "destructive" });
            return;
        }
        addTeam({
            name: teamForm.name.trim(),
            departmentId: department.id,
            leadId: teamForm.leadId,
            mission: teamForm.mission.trim() || `Operational unit under ${department.name}`,
            memberIds: [teamForm.leadId],
            stats: { velocity: 0, tasksCompleted: 0, uptime: "0%" },
        });
        toast({ title: "Team Created", description: `${teamForm.name} has been added under ${department.name}.` });
        setTeamForm({ name: "", leadId: "", mission: "" });
        setShowAddTeam(false);
    };

    const openEditTeam = (team: Team) => {
        setSelectedTeam(team);
        setTeamForm({ name: team.name, leadId: team.leadId, mission: team.mission });
        setShowEditTeam(true);
    };

    const handleUpdateTeam = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeam) return;
        if (!teamForm.name.trim() || !teamForm.leadId) {
            toast({ title: "Missing Fields", description: "Team name and lead are required.", variant: "destructive" });
            return;
        }
        updateTeam(selectedTeam.id, {
            name: teamForm.name.trim(),
            leadId: teamForm.leadId,
            mission: teamForm.mission.trim(),
        });
        toast({ title: "Team Updated", description: `${teamForm.name} has been saved.` });
        setShowEditTeam(false);
        setSelectedTeam(null);
    };

    const handleDeleteTeam = (team: Team) => {
        if (!window.confirm(`Dissolve team "${team.name}"? This cannot be undone.`)) return;
        deleteTeam(team.id);
        toast({ title: "Team Dissolved", description: `${team.name} has been removed.` });
    };

    const openManageMembers = (team: Team) => {
        setSelectedTeam(team);
        setShowManageMembers(true);
    };

    const handleToggleMember = (employeeId: string) => {
        if (!selectedTeam) return;
        const isMember = selectedTeam.memberIds.includes(employeeId);
        if (isMember) {
            if (employeeId === selectedTeam.leadId) {
                toast({ title: "Cannot remove lead", description: "Reassign the team lead first.", variant: "destructive" });
                return;
            }
            removeTeamMember(selectedTeam.id, employeeId);
        } else {
            addTeamMember(selectedTeam.id, employeeId);
        }
        const updated = useOrganisationStore.getState().teams.find((t) => t.id === selectedTeam.id);
        if (updated) setSelectedTeam(updated);
    };

    const handleSaveSettings = () => {
        if (!settingsForm.name.trim() || !settingsForm.code.trim()) {
            toast({ title: "Missing Fields", description: "Department name and code are required.", variant: "destructive" });
            return;
        }
        updateDepartment(department.id, {
            name: settingsForm.name.trim(),
            code: settingsForm.code.trim(),
            description: settingsForm.description.trim(),
            headId: settingsForm.headId || undefined,
        });
        toast({ title: "Settings Saved", description: `${settingsForm.name} has been updated.` });
        setShowSettings(false);
    };

    const handleGenerateReport = () => {
        setGeneratingReport(true);
        const rows = [
            ["Department", department.name],
            ["Code", department.code],
            ["Headcount", String(deptEmployees.length)],
            ["Active Employees", String(activeEmployees.length)],
            ["Teams", String(deptTeams.length)],
            ["Open Roles", String(openRoles)],
            ["Estimated Budget", formatINR(totalBudget)],
        ];
        const csv = rows.map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${department.name.replace(/\s+/g, "_")}_Report.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setTimeout(() => {
            setGeneratingReport(false);
            toast({ title: "Report Downloaded", description: `${department.name}_Report.csv saved.` });
        }, 600);
    };

    const handleSendMessage = () => {
        if (!messageBody.trim()) {
            toast({ title: "Message empty", description: "Please type a message before sending.", variant: "destructive" });
            return;
        }
        toast({ title: "Message Sent", description: `Message delivered to ${hod ? `${hod.firstName} ${hod.lastName}` : "HOD"}.` });
        setMessageBody("");
        setShowMessageHOD(false);
    };

    const handleExportInventory = () => {
        const header = ["Employee", "Code", "Status", "Type", "Email"];
        const rows = deptEmployees.map((e) => [
            `${e.firstName} ${e.lastName}`,
            e.employeeCode,
            e.status,
            e.employmentType,
            e.email,
        ]);
        const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${department.name.replace(/\s+/g, "_")}_Inventory.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Export Started", description: "Inventory CSV downloaded." });
    };

    const stats = [
        { label: "Total Headcount", value: deptEmployees.length, sub: "Direct members", icon: <Users className="text-indigo-600" />, bg: "bg-indigo-50", target: "members" },
        { label: "Active Teams", value: deptTeams.length, sub: "Operational units", icon: <LayoutGrid className="text-purple-600" />, bg: "bg-purple-50", target: "teams" },
        { label: "Est. Budget", value: formatINR(totalBudget), sub: "Annualized payroll", icon: <DollarSign className="text-emerald-600" />, bg: "bg-emerald-50", target: "assets" },
        { label: "Open Roles", value: openRoles, sub: "Active designations", icon: <Briefcase className="text-rose-600" />, bg: "bg-rose-50", target: "members" },
    ];

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

    const budgetBreakdown = [
        { label: "Payroll & Benefits", percent: 65, color: "bg-indigo-600" },
        { label: "Tools & Subscriptions", percent: 15, color: "bg-purple-600" },
        { label: "Infrastructure", percent: 12, color: "bg-emerald-600" },
        { label: "Training & Development", percent: 8, color: "bg-amber-600" },
    ];

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-[#fcfdff] min-h-screen text-start" style={{ zoom: "90%" }}>
            {/* Breadcrumbs & Navigation */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => router.push("/hrmcubicle/organization/dashboard")}>Organization</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => router.push("/hrmcubicle/organization/departments")}>Departments</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-indigo-600">{department.name}</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50" onClick={() => router.back()}>
                            <ArrowLeft className="h-5 w-5 text-slate-600" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black tracking-tight text-slate-900">{department.name}</h1>
                                <Badge className={`border-none font-black text-[10px] uppercase ${department.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                                    {department.isActive ? "Active" : "Inactive"}
                                </Badge>
                                <Badge variant="outline" className="border-slate-200 text-[10px] font-bold uppercase text-slate-500">{department.code}</Badge>
                            </div>
                            <p className="text-slate-500 font-medium max-w-2xl mt-1">
                                {department.description || "No description set for this department yet."}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl border-slate-200" onClick={() => setShowSettings(true)}>
                            <Settings className="h-4 w-4 mr-2" /> Dept Settings
                        </Button>
                        <Button
                            className="bg-[#6366f1] hover:bg-[#4f46e5] rounded-xl font-black text-[10px] tracking-widest h-11 px-6 shadow-lg shadow-indigo-100 uppercase"
                            onClick={handleGenerateReport}
                            disabled={generatingReport}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {generatingReport ? "Processing..." : "Generate Report"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveTab(stat.target)}>
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.bg}`}>{stat.icon}</div>
                                <ChevronRight className="h-4 w-4 text-slate-300" />
                            </div>
                            <div className="mt-4">
                                <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-[11px] text-slate-500 font-medium mt-1">{stat.sub}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Department Head Section */}
            <Card className="border-none shadow-sm bg-gradient-to-r from-slate-900 to-slate-800 text-white overflow-hidden relative">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 translate-x-32" />
                <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <Avatar className="h-24 w-24 border-4 border-white/20 shadow-2xl">
                        <AvatarImage src={hod?.profileImage} />
                        <AvatarFallback className="bg-white text-slate-900 font-black">
                            {hod ? `${hod.firstName[0]}${hod.lastName[0]}` : "NA"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Department Head (HOD)</p>
                        <h2 className="text-3xl font-black mt-1">
                            {hod ? `${hod.firstName} ${hod.lastName}` : "No Head Assigned"}
                        </h2>
                        <p className="text-slate-400 font-medium">
                            {hodDesignation?.title || (hod ? "Department Lead" : "Assign one from Dept Settings")}
                        </p>
                        {hod && (
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                                    <Mail className="h-4 w-4 text-indigo-300" />
                                    <span className="text-xs font-bold">{hod.email}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                                    <span className="text-xs font-bold">Authorized Approver</span>
                                </div>
                            </div>
                        )}
                    </div>
                    {hod && (
                        <Button
                            variant="outline"
                            className="bg-transparent border-white/20 text-white hover:bg-white hover:text-slate-900 rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest transition-all"
                            onClick={() => setShowMessageHOD(true)}
                        >
                            Message HOD
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs value={activeTab} className="space-y-8" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <TabsList className="bg-slate-100/50 p-1 rounded-xl h-11 border border-slate-100">
                        <TabsTrigger value="teams" className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 px-6">Operational Teams</TabsTrigger>
                        <TabsTrigger value="members" className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 px-6">Members</TabsTrigger>
                        <TabsTrigger value="hierarchy" className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 px-6">Org Chart</TabsTrigger>
                        <TabsTrigger value="assets" className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 px-6">Budget</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search within dept..."
                                className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {activeTab === "teams" && (
                            <Button className="bg-[#6366f1] hover:bg-[#4f46e5] h-11 px-6 rounded-xl font-bold shadow-lg shadow-indigo-100" onClick={() => setShowAddTeam(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Create Team
                            </Button>
                        )}
                    </div>
                </div>

                {/* Teams Tab Content */}
                <TabsContent value="teams">
                    {filteredTeams.length === 0 ? (
                        <Card className="border-none shadow-sm p-16 flex flex-col items-center gap-3 text-center">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                                <LayoutGrid className="h-7 w-7 text-indigo-500" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">No teams yet</h3>
                            <p className="text-sm text-slate-500 max-w-sm">Create the first operational team under {department.name} to start tracking members and velocity.</p>
                            <Button className="mt-3 rounded-xl bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowAddTeam(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Create Team
                            </Button>
                        </Card>
                    ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredTeams.map((team) => {
                                const lead = employees.find((e) => e.id === team.leadId);
                                const efficiency = Math.min(100, team.stats?.velocity || Math.floor(60 + Math.random() * 35));
                                return (
                                    <motion.div key={team.id} variants={itemVariants}>
                                        <Card className="border-none shadow-sm group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                                        🚀
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreHorizontal className="h-4 w-4 text-slate-400" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-xl p-2 w-48 shadow-xl border-slate-100">
                                                            <DropdownMenuItem className="rounded-lg p-2 font-bold text-xs uppercase tracking-wider text-slate-600 focus:bg-indigo-50 focus:text-indigo-600" onClick={() => openEditTeam(team)}>
                                                                <Pencil className="h-4 w-4 mr-2" /> Edit Team
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-lg p-2 font-bold text-xs uppercase tracking-wider text-slate-600 focus:bg-indigo-50 focus:text-indigo-600" onClick={() => openManageMembers(team)}>
                                                                <Users className="h-4 w-4 mr-2" /> Manage Members
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="rounded-lg p-2 font-bold text-xs uppercase tracking-wider text-rose-600 focus:bg-rose-50 focus:text-rose-600" onClick={() => handleDeleteTeam(team)}>
                                                                <Trash2 className="h-4 w-4 mr-2" /> Dissolve
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className="space-y-1 mb-6">
                                                    <h4 className="text-lg font-black text-slate-900">{team.name}</h4>
                                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                                                        Lead: {lead ? `${lead.firstName} ${lead.lastName}` : "Unassigned"}
                                                    </p>
                                                    {team.mission && (
                                                        <p className="text-xs text-slate-500 line-clamp-2 pt-1">{team.mission}</p>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between py-4 border-y border-slate-50 mb-6">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Members</p>
                                                        <p className="text-xl font-black text-slate-800">{team.memberIds.length}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uptime</p>
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase">{team.stats?.uptime || "99%"}</Badge>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-slate-400">Team Efficiency</span>
                                                        <span className="text-indigo-600">{efficiency}%</span>
                                                    </div>
                                                    <Progress value={efficiency} className="h-1.5 bg-slate-50" />
                                                </div>

                                                <Button
                                                    className="w-full mt-6 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100 rounded-xl h-10 font-black text-[10px] tracking-widest uppercase"
                                                    onClick={() => router.push(`/hrmcubicle/organization/teams/${team.id}`)}
                                                >
                                                    View Workhub
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </TabsContent>

                {/* Members Tab Content */}
                <TabsContent value="members">
                    <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
                        <CardContent className="p-0">
                            {filteredMembers.length === 0 ? (
                                <div className="p-16 flex flex-col items-center gap-3 text-center">
                                    <Users className="h-10 w-10 text-slate-300" />
                                    <p className="text-sm font-bold text-slate-600">No members match your search.</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                            <th className="px-8 py-5 text-left font-black">Employee</th>
                                            <th className="px-8 py-5 text-left font-black">Status</th>
                                            <th className="px-8 py-5 text-left font-black">Designation</th>
                                            <th className="px-8 py-5 text-left font-black">Deployment</th>
                                            <th className="px-8 py-5 text-center font-black">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filteredMembers.map((member) => {
                                            const desig = designations.find((d) => d.id === member.designationId);
                                            const statusColor =
                                                member.status === "Active" ? "bg-green-50 text-green-600" :
                                                    member.status === "On Leave" ? "bg-amber-50 text-amber-600" :
                                                        member.status === "On Notice" ? "bg-orange-50 text-orange-600" : "bg-slate-100 text-slate-500";
                                            return (
                                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-11 w-11 shadow-sm border-2 border-slate-100">
                                                                <AvatarImage src={member.profileImage} />
                                                                <AvatarFallback className="bg-indigo-600 text-white font-bold">{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-900">{member.firstName} {member.lastName}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{member.employeeCode} · {member.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <Badge className={`text-[9px] font-black uppercase px-2 py-0 border-none ${statusColor}`}>{member.status}</Badge>
                                                    </td>
                                                    <td className="px-8 py-5 text-xs font-bold text-slate-600">{desig?.title || "—"}</td>
                                                    <td className="px-8 py-5">
                                                        <Badge variant="outline" className="text-[9px] font-black uppercase text-slate-400 border-slate-200">{member.employmentType}</Badge>
                                                    </td>
                                                    <td className="px-8 py-5 text-center">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreHorizontal className="h-4 w-4 text-slate-400" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl p-2 w-44 shadow-xl border-slate-100">
                                                                <DropdownMenuItem className="rounded-lg p-2 font-bold text-xs uppercase tracking-wider" onClick={() => router.push(`/hrmcubicle/organization/employees?focus=${member.id}`)}>
                                                                    <Users className="h-4 w-4 mr-2" /> View Profile
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="rounded-lg p-2 font-bold text-xs uppercase tracking-wider" onClick={() => (window.location.href = `mailto:${member.email}`)}>
                                                                    <Mail className="h-4 w-4 mr-2" /> Email
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Hierarchy Tab Content */}
                <TabsContent value="hierarchy">
                    <Card className="border-none shadow-sm p-12 flex flex-col items-center">
                        <div className="w-full max-w-4xl">
                            {/* HOD */}
                            <div className="flex flex-col items-center mb-12 relative">
                                <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl w-64 text-center relative z-10 border-4 border-indigo-500/20">
                                    <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-white/20">
                                        <AvatarImage src={hod?.profileImage} />
                                        <AvatarFallback>{hod ? `${hod.firstName[0]}${hod.lastName[0]}` : "NA"}</AvatarFallback>
                                    </Avatar>
                                    <p className="text-xs font-black uppercase tracking-widest text-indigo-400">
                                        {hodDesignation?.title || "Department Head"}
                                    </p>
                                    <p className="font-black text-lg">{hod ? `${hod.firstName} ${hod.lastName}` : "Unassigned"}</p>
                                </div>
                                {deptTeams.length > 0 && <div className="absolute top-full h-8 w-0.5 bg-slate-200" />}
                            </div>

                            {/* Team Leads Row */}
                            {deptTeams.length === 0 ? (
                                <p className="text-center text-sm text-slate-500">No teams yet. Create a team to build out this department's hierarchy.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative pt-8 border-t-2 border-slate-100">
                                    {deptTeams.slice(0, 6).map((team, i) => {
                                        const lead = employees.find((e) => e.id === team.leadId);
                                        const otherMembers = team.memberIds.filter((id) => id !== team.leadId).slice(0, 4);
                                        return (
                                            <div key={i} className="flex flex-col items-center relative">
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-slate-100" />
                                                <div
                                                    className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 w-56 text-center hover:border-indigo-200 transition-all group cursor-pointer hover:shadow-lg"
                                                    onClick={() => router.push(`/hrmcubicle/organization/teams/${team.id}`)}
                                                >
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600">{team.name} Lead</p>
                                                    <p className="font-bold text-slate-900 mt-1">{lead ? `${lead.firstName} ${lead.lastName}` : "Unassigned"}</p>
                                                    {otherMembers.length > 0 && (
                                                        <div className="mt-4 flex -space-x-2 justify-center">
                                                            {otherMembers.map((mid) => {
                                                                const m = employees.find((e) => e.id === mid);
                                                                return (
                                                                    <div key={mid} className="h-6 w-6 rounded-full border-2 border-white bg-slate-100 text-[8px] flex items-center justify-center font-bold text-slate-400">
                                                                        {m ? m.firstName[0] : "?"}
                                                                    </div>
                                                                );
                                                            })}
                                                            {team.memberIds.length - 1 > 4 && (
                                                                <div className="h-6 w-6 rounded-full border-2 border-white bg-indigo-50 text-[8px] flex items-center justify-center font-bold text-indigo-600">
                                                                    +{team.memberIds.length - 1 - 4}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            className="mt-12 font-black text-indigo-600 uppercase text-[10px] tracking-[0.2em] h-12 rounded-xl group"
                            onClick={() => router.push("/hrmcubicle/organization/chart")}
                        >
                            Expand Full Org Chart <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Card>
                </TabsContent>

                {/* Assets / Budget Tab */}
                <TabsContent value="assets">
                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="lg:col-span-4 gap-6 flex flex-col">
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-black">Budget Allocation</CardTitle>
                                    <CardDescription>Estimated {formatINR(totalBudget)} annualized</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {budgetBreakdown.map((item, i) => {
                                        const val = Math.round(totalBudget * (item.percent / 100));
                                        return (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span className="text-slate-600">{item.label}</span>
                                                    <span className="text-slate-900">{formatINR(val)}</span>
                                                </div>
                                                <Progress value={item.percent} className={`h-1.5 ${item.color} bg-slate-50`} />
                                            </div>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm bg-indigo-600 text-white">
                                <CardContent className="p-6">
                                    <DollarSign className="h-8 w-8 mb-4 opacity-50" />
                                    <h4 className="text-xl font-black">Headcount Snapshot</h4>
                                    <p className="text-sm font-medium text-white/70 mt-2">
                                        {activeEmployees.length} active out of {deptEmployees.length} allocated.
                                    </p>
                                    <Button
                                        className="w-full mt-6 bg-white text-indigo-600 hover:bg-white/90 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl"
                                        onClick={() => setActiveTab("members")}
                                    >
                                        VIEW MEMBERS
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-8">
                            <Card className="border-none shadow-sm h-full">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-black">Department Roster</CardTitle>
                                        <CardDescription>All people allocated to {department.name}</CardDescription>
                                    </div>
                                    <Button variant="outline" className="rounded-xl border-slate-200" onClick={handleExportInventory}>
                                        <Box className="h-4 w-4 mr-2 text-slate-400" /> Export CSV
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {deptEmployees.length === 0 ? (
                                        <div className="p-12 text-center text-sm text-slate-500">No employees allocated yet.</div>
                                    ) : (
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                    <th className="px-6 py-4 text-left font-black">Employee</th>
                                                    <th className="px-6 py-4 text-left font-black">Designation</th>
                                                    <th className="px-6 py-4 text-left font-black">Type</th>
                                                    <th className="px-6 py-4 text-right font-black">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {deptEmployees.slice(0, 12).map((emp) => {
                                                    const desig = designations.find((d) => d.id === emp.designationId);
                                                    return (
                                                        <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-8 w-8">
                                                                        <AvatarImage src={emp.profileImage} />
                                                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px]">{emp.firstName[0]}{emp.lastName[0]}</AvatarFallback>
                                                                    </Avatar>
                                                                    <span className="text-sm font-bold text-slate-900">{emp.firstName} {emp.lastName}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Badge variant="outline" className="text-[9px] font-black uppercase text-slate-400 border-none bg-slate-100">{desig?.title || "—"}</Badge>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="text-xs font-bold text-slate-600">{emp.employmentType}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-[10px] font-black text-indigo-600 uppercase"
                                                                    onClick={() => (window.location.href = `mailto:${emp.email}`)}
                                                                >
                                                                    Email
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Settings Dialog */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogContent className="rounded-[2rem] max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Department Settings</DialogTitle>
                        <DialogDescription>Modify core department parameters and configurations.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase text-slate-400">Department Name</Label>
                            <Input value={settingsForm.name} onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase text-slate-400">Department Code</Label>
                            <Input value={settingsForm.code} onChange={(e) => setSettingsForm({ ...settingsForm, code: e.target.value })} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase text-slate-400">Description</Label>
                            <Textarea value={settingsForm.description} onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase text-slate-400">Head of Department</Label>
                            <Select value={settingsForm.headId || "none"} onValueChange={(v) => setSettingsForm({ ...settingsForm, headId: v === "none" ? "" : v })}>
                                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select HOD" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Unassigned</SelectItem>
                                    {deptEmployees.map((e) => (
                                        <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName} · {e.employeeCode}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-xl" onClick={() => setShowSettings(false)}>Cancel</Button>
                        <Button className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700" onClick={handleSaveSettings}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Message HOD Dialog */}
            <Dialog open={showMessageHOD} onOpenChange={setShowMessageHOD}>
                <DialogContent className="rounded-[2rem] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Message {hod ? `${hod.firstName} ${hod.lastName}` : "HOD"}</DialogTitle>
                        <DialogDescription>Direct communication with the Department Head.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Label className="font-bold text-xs uppercase text-slate-400">Your Message</Label>
                        <Textarea
                            placeholder="Type your message here..."
                            className="rounded-xl min-h-[120px]"
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-xl" onClick={() => setShowMessageHOD(false)}>Cancel</Button>
                        <Button className="rounded-xl font-bold bg-slate-900" onClick={handleSendMessage}>Send Message</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Team Dialog */}
            <Dialog open={showAddTeam} onOpenChange={(o) => { setShowAddTeam(o); if (!o) setTeamForm({ name: "", leadId: "", mission: "" }); }}>
                <DialogContent className="rounded-[2rem] border-none shadow-2xl p-8 bg-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Create New Team</DialogTitle>
                        <DialogDescription>Create a specialized functional team under {department.name}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateTeam} className="space-y-6 py-6">
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Team Name *</Label>
                            <Input
                                placeholder="e.g. Design Systems"
                                className="h-12 rounded-xl border-slate-200"
                                value={teamForm.name}
                                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Team Lead *</Label>
                            <Select value={teamForm.leadId} onValueChange={(v) => setTeamForm({ ...teamForm, leadId: v })}>
                                <SelectTrigger className="h-12 rounded-xl border-slate-200 font-bold">
                                    <SelectValue placeholder="Select Lead" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {deptEmployees.length === 0 ? (
                                        <SelectItem value="none" disabled>No employees in department</SelectItem>
                                    ) : (
                                        deptEmployees.map((e) => (
                                            <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName} · {e.employeeCode}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Mission / Description</Label>
                            <Textarea
                                placeholder="What will this team work on?"
                                className="min-h-[100px] rounded-xl border-slate-200"
                                value={teamForm.mission}
                                onChange={(e) => setTeamForm({ ...teamForm, mission: e.target.value })}
                            />
                        </div>
                        <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100">
                            Establish Team
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Team Dialog */}
            <Dialog open={showEditTeam} onOpenChange={(o) => { setShowEditTeam(o); if (!o) setSelectedTeam(null); }}>
                <DialogContent className="rounded-[2rem] border-none shadow-2xl p-8 bg-white max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Edit Team</DialogTitle>
                        <DialogDescription>Update details for {selectedTeam?.name}.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateTeam} className="space-y-6 py-6">
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Team Name *</Label>
                            <Input className="h-12 rounded-xl border-slate-200" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Team Lead *</Label>
                            <Select value={teamForm.leadId} onValueChange={(v) => setTeamForm({ ...teamForm, leadId: v })}>
                                <SelectTrigger className="h-12 rounded-xl border-slate-200 font-bold"><SelectValue placeholder="Select Lead" /></SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {deptEmployees.map((e) => (
                                        <SelectItem key={e.id} value={e.id}>{e.firstName} {e.lastName} · {e.employeeCode}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Mission</Label>
                            <Textarea className="min-h-[100px] rounded-xl border-slate-200" value={teamForm.mission} onChange={(e) => setTeamForm({ ...teamForm, mission: e.target.value })} />
                        </div>
                        <div className="flex gap-3">
                            <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => setShowEditTeam(false)}>Cancel</Button>
                            <Button type="submit" className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black uppercase text-[10px] tracking-widest">Save</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Manage Members Dialog */}
            <Dialog open={showManageMembers} onOpenChange={(o) => { setShowManageMembers(o); if (!o) setSelectedTeam(null); }}>
                <DialogContent className="rounded-[2rem] border-none shadow-2xl p-0 bg-white max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader className="p-6 pb-2 border-b border-slate-100">
                        <DialogTitle className="text-xl font-black">Manage Members · {selectedTeam?.name}</DialogTitle>
                        <DialogDescription>Add or remove employees from this team. Lead cannot be removed directly.</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {deptEmployees.length === 0 ? (
                            <p className="text-sm text-slate-500 p-6 text-center">No employees available in this department.</p>
                        ) : (
                            deptEmployees.map((emp) => {
                                const isMember = selectedTeam?.memberIds.includes(emp.id);
                                const isLead = selectedTeam?.leadId === emp.id;
                                return (
                                    <div key={emp.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={emp.profileImage} />
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs">{emp.firstName[0]}{emp.lastName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {emp.firstName} {emp.lastName}
                                                    {isLead && <Badge className="ml-2 bg-indigo-50 text-indigo-600 border-none text-[9px]">Lead</Badge>}
                                                </p>
                                                <p className="text-[10px] text-slate-500 font-medium">{emp.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={isMember ? "outline" : "default"}
                                            className={`rounded-lg text-xs ${isMember ? "border-rose-200 text-rose-600 hover:bg-rose-50" : "bg-indigo-600 hover:bg-indigo-700"}`}
                                            disabled={isLead}
                                            onClick={() => handleToggleMember(emp.id)}
                                        >
                                            {isMember ? <><UserMinus className="h-3 w-3 mr-1" /> Remove</> : <><UserPlus className="h-3 w-3 mr-1" /> Add</>}
                                        </Button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <DialogFooter className="p-4 border-t border-slate-100">
                        <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800" onClick={() => setShowManageMembers(false)}>Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DepartmentDetailPage;
