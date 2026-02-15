"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import {
    Plus,
    MapPin,
    Briefcase,
    MoreHorizontal,
    Search,
    Filter,
    Users,
    DollarSign,
    Clock,
    Eye,
    CheckCircle2,
    AlertCircle,
    Copy,
    Send
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/ui/use-toast";
import { useHireStore, type Job } from "@/shared/data/hire-store";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";

const JOB_TEMPLATES = [
    {
        id: "temp_fe_senior",
        category: "Engineering",
        title: "Senior Frontend Engineer",
        department: "Engineering",
        skills: "React, TypeScript, TailwindCSS, Next.js",
        description: "We are looking for a Senior Frontend Engineer to lead our web development efforts. You will be responsible for architecting and building scalable UI components."
    },
    {
        id: "temp_be_go",
        category: "Engineering",
        title: "Backend Engineer (Go)",
        department: "Engineering",
        skills: "Go, Kubernetes, gRPC, PostgreSQL",
        description: "Join our core infrastructure team to build high-performance microservices using Go."
    },
    {
        id: "temp_prod_des",
        category: "Design",
        title: "Product Designer",
        department: "Design",
        skills: "Figma, Prototyping, Design Systems",
        description: "We need a visionary Product Designer to craft intuitive and beautiful user experiences."
    },
    {
        id: "temp_pm",
        category: "Design", // Grouping with Design/Product
        title: "Product Manager",
        department: "Product",
        skills: "Roadmapping, Agile, Jira, Analytics",
        description: "Drive the product vision and execution, working closely with engineering and design teams."
    }
];

const JobOpeningsPage = () => {
    const { jobs, addJob, updateJob, deleteJob, submitJobForApproval } = useHireStore();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    // Enhanced Form State
    const [formData, setFormData] = useState({
        title: "",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        experience: "1-3 Years",
        salaryRange: "",
        description: "",
        hiringManagerId: "EMP-001", // Mock default
        skillsInput: ""
    });

    const resetForm = () => {
        setFormData({
            title: "",
            department: "Engineering",
            location: "Remote",
            type: "Full-time",
            experience: "1-3 Years",
            salaryRange: "",
            description: "",
            hiringManagerId: "EMP-001",
            skillsInput: ""
        });
        setEditingId(null);
    };

    const handleSaveJob = () => {
        if (!formData.title || !formData.salaryRange) {
            toast({ title: "Validation Error", description: "Title and Salary Range are required.", variant: "destructive" });
            return;
        }

        const skills = formData.skillsInput.split(",").map(s => s.trim()).filter(Boolean);

        if (editingId) {
            updateJob(editingId, {
                title: formData.title,
                department: formData.department,
                location: formData.location,
                type: formData.type as any,
                experience: formData.experience,
                salaryRange: formData.salaryRange,
                description: formData.description,
                skills,
                hiringManagerId: formData.hiringManagerId
            });
            toast({ title: "Job Updated", description: "Job requisition updated successfully." });
        } else {
            addJob({
                title: formData.title,
                department: formData.department,
                location: formData.location,
                type: formData.type as any,
                experience: formData.experience,
                salaryRange: formData.salaryRange,
                description: formData.description,
                skills,
                hiringManagerId: formData.hiringManagerId,
                recruiters: ["EMP-REC-1"]
            });
            toast({ title: "Job Drafted", description: "New job requisition drafted. Submit for approval to activate." });
        }
        setIsCreateOpen(false);
        resetForm();
    };

    const handleEditClick = (job: Job) => {
        setFormData({
            title: job.title,
            department: job.department,
            location: job.location,
            type: job.type,
            experience: job.experience,
            salaryRange: job.salaryRange,
            description: job.description,
            hiringManagerId: job.hiringManagerId,
            skillsInput: job.skills.join(", ")
        });
        setEditingId(job.id);
        setIsCreateOpen(true);
    };

    const handleDeleteJob = (id: string) => {
        if (confirm("Permanently delete this requisition?")) {
            deleteJob(id);
            toast({ title: "Requisition Deleted", description: "The job has been removed.", variant: "destructive" });
        }
    };

    const handleSubmitForApproval = (id: string) => {
        submitJobForApproval(id);
        toast({
            title: "Submitted for Approval",
            description: "Hiring managers have been notified.",
            variant: "default",
            className: "bg-emerald-50 border-emerald-200 text-emerald-800"
        });
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            'Draft': "bg-slate-100 text-slate-600 border-slate-200",
            'Pending Approval': "bg-amber-50 text-amber-700 border-amber-200 animate-pulse",
            'Approved': "bg-emerald-50 text-emerald-700 border-emerald-200",
            'Active': "bg-blue-50 text-blue-700 border-blue-200",
            'Closed': "bg-red-50 text-red-700 border-red-200",
            'On Hold': "bg-orange-50 text-orange-700 border-orange-200"
        };
        return (
            <Badge variant="outline" className={`${styles[status] || styles['Draft']} font-bold px-3 py-1 rounded-lg border shadow-sm`}>
                {status}
            </Badge>
        );
    };

    const filteredJobs = jobs
        .filter(j => activeTab === 'all' || j.workflowStatus.toLowerCase().replace(' ', '_') === activeTab)
        .filter(j =>
            j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            j.department.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="flex-1 space-y-4 p-4 min-h-screen flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Talent Requisitions</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Manage job openings, approvals, and recruitment pipelines.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsCreateOpen(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 px-4 shadow-lg shadow-indigo-50 font-bold text-[10px] border-none transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="mr-2 h-3.5 w-3.5" /> Create Requisition
                </Button>
            </div>

            {/* Main Content */}
            <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden flex-1 flex flex-col">
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="flex flex-col h-full">
                    <div className="px-6 pt-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-0">
                        <TabsList className="bg-slate-50/80 p-1 rounded-xl h-10 w-full sm:w-auto overflow-hidden justify-start">
                            {[
                                { id: 'all', label: 'All Jobs' },
                                { id: 'active', label: 'Active' },
                                { id: 'pending_approval', label: 'Approvals' },
                                { id: 'draft', label: 'Drafts' },
                                { id: 'closed', label: 'Closed' }
                            ].map(tab => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="rounded-lg px-4 h-8 font-bold text-[10px] uppercase tracking-wide data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all text-slate-500"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="relative w-full sm:w-64 mb-3 sm:mb-0">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                            <Input
                                placeholder="Search requisitions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 rounded-lg border-none bg-slate-50 h-8 font-bold text-[10px] text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-100 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <TabsContent value={activeTab} className="m-0 overflow-auto custom-scrollbar min-h-[200px]">
                        <Table>
                            <TableHeader className="bg-slate-50/30 sticky top-0 z-10 backdrop-blur-sm">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest pl-6 h-10">Position Details</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10">Hiring Stats</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10">Department</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10">Status</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10 pr-6 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map((job) => (
                                        <TableRow key={job.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                            <TableCell className="pl-6 py-3 align-top">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors cursor-pointer">{job.title}</span>
                                                    <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-300">
                                                        <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> {job.location}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-100" />
                                                        <span className="flex items-center gap-1"><Briefcase className="h-2.5 w-2.5" /> {job.type}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-100" />
                                                        <span className="text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-[4px] uppercase">{job.salaryRange}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 align-top">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-center">
                                                        <div className="text-base font-bold text-slate-900 leading-none">{job.applicantsCount}</div>
                                                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">Applicants</span>
                                                    </div>
                                                    <div className="w-px h-6 bg-slate-50" />
                                                    <div className="text-center">
                                                        <div className="text-base font-bold text-slate-900 leading-none">{job.views}</div>
                                                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-wider">Views</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 align-top">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-[10px] shadow-inner">
                                                        {job.department.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-slate-700 text-xs">{job.department}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 align-top">
                                                <Badge variant="outline" className={`${job.workflowStatus === 'Draft' ? 'bg-slate-50 text-slate-400 border-slate-50' : job.workflowStatus === 'Active' ? 'bg-blue-50 text-blue-500 border-blue-50' : 'bg-emerald-50 text-emerald-500 border-emerald-50'} font-bold px-2 py-0.5 rounded-md border text-[8px] uppercase`}>
                                                    {job.workflowStatus}
                                                </Badge>
                                                {job.workflowStatus === 'Draft' && (
                                                    <Button
                                                        variant="link"
                                                        className="h-5 p-0 text-[8px] font-bold text-indigo-400 mt-0.5"
                                                        onClick={() => handleSubmitForApproval(job.id)}
                                                    >
                                                        Submit for Approval
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell className="pr-6 py-3 align-top text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl text-slate-300 hover:text-slate-600 hover:bg-slate-100">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-none p-2 font-bold">
                                                        <DropdownMenuItem onClick={() => handleEditClick(job)} className="rounded-xl h-10">Edit Requisition</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => router.push(`/hrmcubicle/hire/candidates?jobId=${job.id}`)} className="rounded-xl h-10">View Candidates</DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-slate-50 my-1" />
                                                        {job.workflowStatus === 'Draft' && (
                                                            <DropdownMenuItem onClick={() => handleSubmitForApproval(job.id)} className="rounded-xl h-10 text-indigo-600 bg-indigo-50/50">
                                                                <Send className="h-3.5 w-3.5 mr-2" /> Submit Approval
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => handleDeleteJob(job.id)} className="rounded-xl h-10 text-red-600 focus:text-red-700 focus:bg-red-50">
                                                            <AlertCircle className="h-3.5 w-3.5 mr-2" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center shadow-inner">
                                                    <Search className="h-8 w-8 text-slate-300" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">No requisitions found</h3>
                                                    <p className="text-slate-400 font-bold text-sm mt-1">Try changing tabs or create a new job.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </Card>

            {/* Create Job Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="bg-white rounded-2xl border-none p-6 max-w-4xl shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
                            {editingId ? "Edit Requisition" : "New Talent Requisition"}
                        </DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-xs flex items-center justify-between">
                            <span>Define the role, requirements, and hiring team.</span>

                            {!editingId && (
                                <Select onValueChange={(val) => {
                                    const template = JOB_TEMPLATES.find(t => t.id === val);
                                    if (template) {
                                        setFormData(prev => ({
                                            ...prev,
                                            title: template.title,
                                            department: template.department,
                                            description: template.description,
                                            skillsInput: template.skills
                                        }));
                                        toast({ title: "Template Loaded", description: `Loaded details for ${template.title}` });
                                    }
                                }}>
                                    <SelectTrigger className="w-[180px] h-9 rounded-xl bg-indigo-50 border-indigo-100 text-indigo-700 font-bold text-[10px]">
                                        <div className="flex items-center gap-2">
                                            <Copy className="h-3 w-3" />
                                            <span>Load Template...</span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-xl font-bold">
                                        <SelectGroup>
                                            <SelectLabel className="pl-2 text-[9px] uppercase text-slate-400 tracking-widest">Engineering</SelectLabel>
                                            {JOB_TEMPLATES.filter(t => t.category === 'Engineering').map(t => (
                                                <SelectItem key={t.id} value={t.id} className="rounded-lg text-[10px]">{t.title}</SelectItem>
                                            ))}
                                            <SelectLabel className="pl-2 text-[9px] uppercase text-slate-400 tracking-widest mt-2">Design & Product</SelectLabel>
                                            {JOB_TEMPLATES.filter(t => t.category === 'Design').map(t => (
                                                <SelectItem key={t.id} value={t.id} className="rounded-lg text-[10px]">{t.title}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-3 gap-5">
                        <div className="space-y-1 col-span-1">
                            <Label className="font-bold text-slate-700 text-[10px] ml-1">Job Title</Label>
                            <Input
                                placeholder="e.g. Senior Product Designer"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="h-9 rounded-lg bg-white border-slate-200 font-bold text-xs px-3 focus-visible:ring-2 focus-visible:ring-indigo-100"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="font-bold text-slate-700 text-[10px] ml-1">Department</Label>
                            <Select value={formData.department} onValueChange={(v) => setFormData({ ...formData, department: v })}>
                                <SelectTrigger className="h-9 rounded-lg bg-white border-slate-200 font-bold px-3 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200 shadow-xl font-bold p-1">
                                    <SelectItem value="Engineering" className="rounded-lg h-8 text-[10px]">Engineering</SelectItem>
                                    <SelectItem value="Design" className="rounded-lg h-8 text-[10px]">Design</SelectItem>
                                    <SelectItem value="Product" className="rounded-lg h-8 text-[10px]">Product</SelectItem>
                                    <SelectItem value="Marketing" className="rounded-lg h-8 text-[10px]">Marketing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label className="font-bold text-slate-700 text-[10px] ml-1">Employment Type</Label>
                            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as any })}>
                                <SelectTrigger className="h-9 rounded-lg bg-white border-slate-200 font-bold px-3 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200 shadow-xl font-bold p-1">
                                    <SelectItem value="Full-time" className="rounded-lg h-8 text-[10px]">Full-time</SelectItem>
                                    <SelectItem value="Part-time" className="rounded-lg h-8 text-[10px]">Part-time</SelectItem>
                                    <SelectItem value="Contract" className="rounded-lg h-8 text-[10px]">Contract</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label className="font-bold text-slate-700 text-[10px] ml-1">Salary Range</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                <Input
                                    placeholder="e.g. ₹25L - ₹40L"
                                    value={formData.salaryRange}
                                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                                    className="h-9 rounded-lg bg-white border-slate-200 font-bold px-8 text-xs focus-visible:ring-2 focus-visible:ring-indigo-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="font-bold text-slate-700 text-[10px] ml-1">Experience Level</Label>
                            <Select value={formData.experience} onValueChange={(v) => setFormData({ ...formData, experience: v })}>
                                <SelectTrigger className="h-9 rounded-lg bg-white border-slate-200 font-bold px-3 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200 shadow-xl font-bold p-1">
                                    <SelectItem value="Fresher" className="rounded-lg h-8 text-[10px]">Fresher / Entry</SelectItem>
                                    <SelectItem value="1-3 Years" className="rounded-lg h-8 text-[10px]">1-3 Years</SelectItem>
                                    <SelectItem value="3-5 Years" className="rounded-lg h-8 text-[10px]">3-5 Years</SelectItem>
                                    <SelectItem value="5+ Years" className="rounded-lg h-8 text-[10px]">5+ Years</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <Label className="font-bold text-slate-700 text-[10px] ml-1">Skills (Comma separated)</Label>
                            <Input
                                placeholder="e.g. React, Node.js"
                                value={formData.skillsInput}
                                onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                                className="h-9 rounded-lg bg-white border-slate-200 font-bold px-3 text-xs focus-visible:ring-2 focus-visible:ring-indigo-100"
                            />
                        </div>

                        <div className="col-span-3 space-y-1">
                            <Label className="font-bold text-slate-700 text-[10px] ml-1">Job Description</Label>
                            <Textarea
                                placeholder="Describe the role responsibilities and requirements..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="min-h-[80px] rounded-lg bg-white border-slate-200 font-medium px-3 py-2 focus-visible:ring-2 focus-visible:ring-indigo-100 resize-none text-xs"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6 gap-2 flex-row justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setIsCreateOpen(false)}
                            className="rounded-lg h-9 px-6 font-bold text-slate-400 border border-slate-100 hover:bg-slate-50 transition-all text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveJob}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-9 px-6 shadow-md shadow-indigo-50 font-bold border-none transition-all hover:scale-[1.02] text-xs"
                        >
                            {editingId ? "Save Changes" : "Create Requisition"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default JobOpeningsPage;
