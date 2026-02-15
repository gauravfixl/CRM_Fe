"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Users,
    Building2,
    Briefcase,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    ChevronRight,
    LayoutGrid,
    Target,
    Settings,
    DollarSign,
    Box,
    GitBranch,
    ShieldCheck,
    Mail,
    Phone,
    MapPin,
    Calendar
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
} from "@/shared/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const DepartmentDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("teams");
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [showMessageHOD, setShowMessageHOD] = useState(false);
    const [generatingReport, setGeneratingReport] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const deptId = params?.id as string;

    // Mock Data for all Departments
    const allDepartmentsData: Record<string, any> = {
        "DEPT-001": {
            id: "DEPT-001",
            name: "Engineering",
            description: "Core software development, infrastructure management, and technical innovation group.",
            head: "Rajesh Kumar",
            headRole: "VP of Engineering",
            headImg: "https://i.pravatar.cc/150?u=male1",
            stats: { headcount: 98, teams: 14, budget: "₹ 8.2 Cr", openRoles: 12 },
            teams: [
                { id: "T-001", name: "Frontend Platform", lead: "Sneha Reddy", members: 12, status: "Active", efficiency: 94 },
                { id: "T-002", name: "Backend Core", lead: "Viral Vora", members: 18, status: "Active", efficiency: 88 },
                { id: "T-003", name: "DevOps & Cloud", lead: "Aman Gupta", members: 8, status: "Active", efficiency: 96 },
            ],
            assets: [
                { id: "AS-101", name: "Dell XPS 15", category: "Hardware", assignedTo: "Sneha Reddy", date: "Jan 12, 2024" },
                { id: "AS-104", name: "AWS Enterprise Account", category: "Infrastructure", assignedTo: "DevOps", date: "Global" },
            ]
        },
        "DEPT-002": {
            id: "DEPT-002",
            name: "Product",
            description: "Product management, user research, and strategy execution unit.",
            head: "Priya Sharma",
            headRole: "Director of Product",
            headImg: "https://i.pravatar.cc/150?u=female1",
            stats: { headcount: 35, teams: 6, budget: "₹ 3.5 Cr", openRoles: 5 },
            teams: [
                { id: "T-101", name: "Core Product", lead: "Ankur Vats", members: 10, status: "Active", efficiency: 92 },
                { id: "T-102", name: "Growth & Retention", lead: "Megha Rao", members: 12, status: "Active", efficiency: 85 },
            ],
            assets: [
                { id: "AS-201", name: "MacBook Pro M2", category: "Hardware", assignedTo: "Priya Sharma", date: "Feb 10, 2024" },
                { id: "AS-202", name: "Notion Enterprise", category: "Software", assignedTo: "Product Team", date: "Jan 01, 2024" },
            ]
        },
        "DEPT-005": {
            id: "DEPT-005",
            name: "HR",
            description: "Human resources, talent acquisition, and workplace culture management.",
            head: "Vikram Singh",
            headRole: "Chief People Officer",
            headImg: "https://i.pravatar.cc/150?u=male2",
            stats: { headcount: 15, teams: 3, budget: "₹ 1.2 Cr", openRoles: 2 },
            teams: [
                { id: "T-501", name: "Talent Acquisition", lead: "Kriti Sanon", members: 8, status: "Active", efficiency: 95 },
                { id: "T-502", name: "Employee Relations", lead: "Rahul Singh", members: 7, status: "Active", efficiency: 89 },
            ],
            assets: [
                { id: "AS-501", name: "Workday License", category: "Software", assignedTo: "HR Admin", date: "Renewed" },
            ]
        }
    };

    // Fallback if ID is not in mock (supporting search-created IDs too)
    const department = allDepartmentsData[deptId] || {
        id: deptId || "UNKNOWN",
        name: "General Department",
        description: "Departmental unit for organizational management.",
        head: "Lead Administrator",
        headRole: "Department Lead",
        headImg: "https://i.pravatar.cc/150?u=admin",
        stats: { headcount: 10, teams: 2, budget: "₹ 0.5 Cr", openRoles: 1 },
        teams: [],
        assets: []
    };

    const teams = department.teams || [];
    const assets = department.assets || [];

    const filteredTeams = teams.filter((t: any) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.lead.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const members = [
        { id: 1, name: department.head || "Admin", role: department.headRole || "Lead", team: "Leadership", type: "Full-Time", status: "Present", img: department.headImg },
        { id: 2, name: "Sandeep Roy", role: "Sr. Associate", team: teams[0]?.name || "Core", type: "Full-Time", status: "Present", img: "https://i.pravatar.cc/150?u=male3" },
        { id: 3, name: "Ananya Mishra", role: "UI Designer", team: teams[0]?.name || "Core", type: "Full-Time", status: "Present", img: "https://i.pravatar.cc/150?u=female2" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const handleCreateTeam = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Team Created Successfully!",
            description: `New operational team has been registered under ${department.name}.`,
        });
        setShowAddTeam(false);
    };

    const handleGenerateReport = () => {
        setGeneratingReport(true);
        toast({
            title: "Generating Department Report",
            description: "Please wait while we compile the latest metrics...",
        });
        setTimeout(() => {
            setGeneratingReport(false);
            toast({
                title: "Report Downloaded",
                description: `${department.name}_Q1_Report.pdf has been saved.`,
            });
        }, 2000);
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-[#fcfdff] min-h-screen text-start" style={{ zoom: "90%" }}>

            {/* Breadcrumbs & Navigation */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => router.push('/hrmcubicle/organization/dashboard')}>Organization</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => router.push('/hrmcubicle/organization/departments')}>Departments</span>
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
                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase">Active Department</Badge>
                            </div>
                            <p className="text-slate-500 font-medium max-w-2xl mt-1">{department.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Dialog open={showSettings} onOpenChange={setShowSettings}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="rounded-xl border-slate-200">
                                    <Settings className="h-4 w-4 mr-2" /> Dept Settings
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2rem] max-w-lg">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">Department Settings</DialogTitle>
                                    <DialogDescription>Modify core department parameters and configurations.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-xs uppercase text-slate-400">Department Name</Label>
                                        <Input defaultValue={department.name} className="rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-xs uppercase text-slate-400">Description</Label>
                                        <Textarea defaultValue={department.description} className="rounded-xl" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase text-slate-400">Effective Budget</Label>
                                            <Input defaultValue={department.stats.budget} className="rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase text-slate-400">Headcount Limit</Label>
                                            <Input defaultValue="150" className="rounded-xl" />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button className="w-full rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700" onClick={() => {
                                        toast({ title: "Settings Saved", description: "Department configurations updated successfully." });
                                        setShowSettings(false);
                                    }}>Save Changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Button
                            className="bg-[#6366f1] hover:bg-[#4f46e5] rounded-xl font-black text-[10px] tracking-widest h-11 px-6 shadow-lg shadow-indigo-100 uppercase"
                            onClick={handleGenerateReport}
                            disabled={generatingReport}
                        >
                            {generatingReport ? "Processing..." : "Generate Report"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Top Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { label: "Total Headcount", value: department.stats.headcount, sub: "Direct & Indirect", icon: <Users className="text-indigo-600" />, bg: "bg-indigo-50" },
                    { label: "Active Teams", value: department.stats.teams, sub: "Operational Units", icon: <LayoutGrid className="text-purple-600" />, bg: "bg-purple-50" },
                    { label: "Annual Budget", value: department.stats.budget, sub: "Projected 2024", icon: <DollarSign className="text-emerald-600" />, bg: "bg-emerald-50" },
                    { label: "Open Roles", value: department.stats.openRoles, sub: "Wait-list Candidates", icon: <Briefcase className="text-rose-600" />, bg: "bg-rose-50" },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                    {stat.icon}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-300 hover:text-indigo-600 transition-colors"
                                    onClick={() => {
                                        if (stat.label === "Total Headcount") setActiveTab("members");
                                        if (stat.label === "Active Teams") setActiveTab("teams");
                                        if (stat.label === "Annual Budget") setActiveTab("assets");
                                    }}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
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
                        <AvatarImage src={department.headImg} />
                        <AvatarFallback className="bg-white text-slate-900 font-black">{department.head.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center md:text-left">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Department Head (HOD)</p>
                        <h2 className="text-3xl font-black mt-1">{department.head}</h2>
                        <p className="text-slate-400 font-medium">{department.headRole} • Reporting to CEO</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                                <Mail className="h-4 w-4 text-indigo-300" />
                                <span className="text-xs font-bold">{department.head.toLowerCase().replace(" ", ".")}@company.com</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                                <span className="text-xs font-bold">Authorized Approver</span>
                            </div>
                        </div>
                    </div>
                    <Dialog open={showMessageHOD} onOpenChange={setShowMessageHOD}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white hover:text-slate-900 rounded-xl h-12 px-8 font-black uppercase text-[10px] tracking-widest transition-all">
                                Message HOD
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Message {department.head}</DialogTitle>
                                <DialogDescription>Direct communication with the Department Head.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <Label className="font-bold text-xs uppercase text-slate-400">Your Message</Label>
                                <Textarea placeholder="Type your message here..." className="rounded-xl min-h-[120px]" />
                            </div>
                            <DialogFooter>
                                <Button className="w-full rounded-xl font-bold bg-slate-900" onClick={() => {
                                    toast({ title: "Message Sent", description: `Your query has been forwarded to ${department.head}.` });
                                    setShowMessageHOD(false);
                                }}>Send Message</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs defaultValue="teams" className="space-y-8" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <TabsList className="bg-slate-100/50 p-1 rounded-xl h-11 border border-slate-100">
                        <TabsTrigger value="teams" className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 px-6">Operational Teams</TabsTrigger>
                        <TabsTrigger value="members" className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 px-6">Members Directory</TabsTrigger>
                        <TabsTrigger value="hierarchy" className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 px-6">Org Chart</TabsTrigger>
                        <TabsTrigger value="assets" className="rounded-lg font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-indigo-600 px-6">Budget & Assets</TabsTrigger>
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
                            <Dialog open={showAddTeam} onOpenChange={setShowAddTeam}>
                                <DialogTrigger asChild>
                                    <Button className="bg-[#6366f1] hover:bg-[#4f46e5] h-11 px-6 rounded-xl font-bold shadow-lg shadow-indigo-100">
                                        <Plus className="h-4 w-4 mr-2" /> Create Team
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-[2rem] border-none shadow-2xl p-8 bg-white max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Create New Team</DialogTitle>
                                        <p className="text-slate-500 text-sm mt-2">Create a specialized functional team under {department.name}.</p>
                                    </DialogHeader>
                                    <form onSubmit={handleCreateTeam} className="space-y-6 py-6">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Team Name</Label>
                                            <Input placeholder="e.g. Design Systems" className="h-12 rounded-xl border-slate-200" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Team Lead</Label>
                                            <Select required>
                                                <SelectTrigger className="h-12 rounded-xl border-slate-200 font-bold">
                                                    <SelectValue placeholder="Select Lead" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    <SelectItem value="sr">Sneha Reddy</SelectItem>
                                                    <SelectItem value="rd">Rahul Deshmukh</SelectItem>
                                                    <SelectItem value="vv">Viral Vora</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Description</Label>
                                            <Textarea placeholder="What will this team work on?" className="min-h-[100px] rounded-xl border-slate-200" />
                                        </div>
                                        <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100">
                                            ESTABLISH TEAM
                                        </Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>

                {/* Teams Tab Content */}
                <TabsContent value="teams">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredTeams.map((team: any) => (
                            <motion.div key={team.id} variants={itemVariants}>
                                <Card className="border-none shadow-sm group hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
                                    <CardContent className="p-6">
                                        {/* ... card content ... */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                                🚀
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreHorizontal className="h-4 w-4 text-slate-400" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl p-2 w-48 shadow-xl border-slate-100">
                                                    <DropdownMenuItem
                                                        className="rounded-lg p-2 font-bold text-xs uppercase tracking-wider text-slate-600 focus:bg-indigo-50 focus:text-indigo-600"
                                                        onClick={() => toast({ title: "Edit Team", description: `Opening editor for ${team.name}...` })}
                                                    >
                                                        <Settings className="h-4 w-4 mr-2" /> Edit Team
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="rounded-lg p-2 font-bold text-xs uppercase tracking-wider text-slate-600 focus:bg-indigo-50 focus:text-indigo-600"
                                                        onClick={() => toast({ title: "Manage Members", description: `Viewing access controls for ${team.name}...` })}
                                                    >
                                                        <Users className="h-4 w-4 mr-2" /> Manage Members
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="space-y-1 mb-6">
                                            <h4 className="text-lg font-black text-slate-900">{team.name}</h4>
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Lead: {team.lead}</p>
                                        </div>

                                        <div className="flex items-center justify-between py-4 border-y border-slate-50 mb-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Members</p>
                                                <p className="text-xl font-black text-slate-800">{team.members}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase">{team.status}</Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-400">Team Efficiency</span>
                                                <span className="text-indigo-600">{team.efficiency}%</span>
                                            </div>
                                            <Progress value={team.efficiency} className="h-1.5 bg-slate-50" />
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
                        ))}
                    </motion.div>
                </TabsContent>

                {/* Members Tab Content */}
                <TabsContent value="members">
                    <Card className="border-none shadow-sm overflow-hidden rounded-2xl">
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                        <th className="px-8 py-5 text-left font-black">Employee</th>
                                        <th className="px-8 py-5 text-left font-black">Status</th>
                                        <th className="px-8 py-5 text-left font-black">Team Unit</th>
                                        <th className="px-8 py-5 text-left font-black">Deployment</th>
                                        <th className="px-8 py-5 text-center font-black">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {members.map((member) => (
                                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-11 w-11 shadow-sm border-2 border-slate-100">
                                                        <AvatarImage src={member.img} />
                                                        <AvatarFallback className="bg-indigo-600 text-white font-bold">{member.name.substring(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">{member.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{member.role}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge className={`text-[9px] font-black uppercase px-2 py-0 border-none ${member.status === 'Present' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {member.status}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-bold text-slate-600">{member.team}</td>
                                            <td className="px-8 py-5">
                                                <Badge variant="outline" className="text-[9px] font-black uppercase text-slate-400 border-slate-200">{member.type}</Badge>
                                            </td>
                                            <td className="px-8 py-5 text-center">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="h-4 w-4 text-slate-400" /></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Hierarchy Tab Content */}
                <TabsContent value="hierarchy">
                    <Card className="border-none shadow-sm p-12 flex flex-col items-center">
                        <div className="w-full max-w-4xl">
                            {/* HOD */}
                            <div className="flex flex-col items-center mb-16 relative">
                                <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl w-64 text-center relative z-10 border-4 border-indigo-500/20">
                                    <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-white/20">
                                        <AvatarImage src={department.headImg} />
                                        <AvatarFallback>{department.head.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <p className="text-xs font-black uppercase tracking-widest text-indigo-400">{department.headRole}</p>
                                    <p className="font-black text-lg">{department.head}</p>
                                </div>
                                <div className="absolute top-full h-8 w-0.5 bg-slate-200" />
                            </div>

                            {/* Team Leads Row */}
                            <div className="grid grid-cols-3 gap-8 relative pt-8 border-t-2 border-slate-100">
                                {teams.slice(0, 3).map((team: any, i: number) => (
                                    <div key={i} className="flex flex-col items-center relative">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-slate-100" />
                                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 w-56 text-center hover:border-indigo-200 transition-all group cursor-pointer hover:shadow-lg">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600">{team.name} Lead</p>
                                            <p className="font-bold text-slate-900 mt-1">{team.lead}</p>
                                            <div className="mt-4 flex -space-x-2 justify-center">
                                                {[1, 2, 3, 4].map((j) => (
                                                    <div key={j} className="h-6 w-6 rounded-full border-2 border-white bg-slate-100 text-[8px] flex items-center justify-center font-bold text-slate-400">{j}</div>
                                                ))}
                                                <div className="h-6 w-6 rounded-full border-2 border-white bg-indigo-50 text-[8px] flex items-center justify-center font-bold text-indigo-600">+{team.members - 4}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button variant="ghost" className="mt-16 font-black text-indigo-600 uppercase text-[10px] tracking-[0.2em] h-12 rounded-xl group">
                            Expand Full Org Chart <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Card>
                </TabsContent>

                {/* Assets Tab Content */}
                <TabsContent value="assets">
                    <div className="grid gap-8 lg:grid-cols-12">
                        {/* Budget Breakdown */}
                        <div className="lg:col-span-4 gap-6 flex flex-col">
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-black">Budget Allocation</CardTitle>
                                    <CardDescription>Fiscal Year 2024-25 Distribution</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {[
                                        { label: "Payroll & Benefits", val: "₹ 5.2 Cr", percent: 65, color: "bg-indigo-600" },
                                        { label: "Tools & Subscriptions", val: "₹ 1.4 Cr", percent: 15, color: "bg-purple-600" },
                                        { label: "Infrastructure (AWS/Cloud)", val: "₹ 1.2 Cr", percent: 12, color: "bg-emerald-600" },
                                        { label: "Training & Development", val: "₹ 0.4 Cr", percent: 8, color: "bg-amber-600" },
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold">
                                                <span className="text-slate-600">{item.label}</span>
                                                <span className="text-slate-900">{item.val}</span>
                                            </div>
                                            <Progress value={item.percent} className={`h-1.5 ${item.color} bg-slate-50`} />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-sm bg-indigo-600 text-white">
                                <CardContent className="p-6">
                                    <DollarSign className="h-8 w-8 mb-4 opacity-50" />
                                    <h4 className="text-xl font-black">Optimize Budget</h4>
                                    <p className="text-sm font-medium text-white/70 mt-2">Engineering is currently 4% under budget for this quarter.</p>
                                    <Button className="w-full mt-6 bg-white text-indigo-600 hover:bg-white/90 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-xl">VIEW FULL LEDGER</Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Inventory Table */}
                        <div className="lg:col-span-8">
                            <Card className="border-none shadow-sm h-full">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-black">Department Inventory</CardTitle>
                                        <CardDescription>Major assets assigned to {department.name}.</CardDescription>
                                    </div>
                                    <Button variant="outline" className="rounded-xl border-slate-200">
                                        <Box className="h-4 w-4 mr-2 text-slate-400" /> Export Inventory
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                                <th className="px-6 py-4 text-left font-black">Asset Name</th>
                                                <th className="px-6 py-4 text-left font-black">Category</th>
                                                <th className="px-6 py-4 text-left font-black">Assigned To</th>
                                                <th className="px-6 py-4 text-left font-black text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {assets.map((asset: any) => (
                                                <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <Box className="h-4 w-4 text-slate-300" />
                                                            <span className="text-sm font-bold text-slate-900">{asset.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className="text-[9px] font-black uppercase text-slate-400 border-none bg-slate-100">{asset.category}</Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-bold text-slate-600">{asset.assignedTo}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button variant="ghost" size="sm" className="text-[10px] font-black text-indigo-600 uppercase">Revoke</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DepartmentDetailPage;
