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
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import {
    Plus,
    MapPin,
    Briefcase,
    MoreHorizontal,
    Search,
    Filter,
    Users
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

const JobOpeningsPage = () => {
    const { jobs, addJob, updateJob, deleteJob } = useHireStore();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("active");
    const [editingId, setEditingId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    // Form Stats
    const [newJob, setNewJob] = useState({
        title: "",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        experience: "1-3 Years"
    });

    const handleSaveJob = () => {
        if (editingId) {
            updateJob(editingId, {
                title: newJob.title,
                department: newJob.department,
                location: newJob.location,
                type: newJob.type as any,
                experience: newJob.experience
            });
            toast({
                title: "Job Updated",
                description: `${newJob.title} has been updated successfully.`,
            });
        } else {
            addJob({
                title: newJob.title || "Untitled Job",
                department: newJob.department,
                location: newJob.location,
                type: newJob.type as any,
                experience: newJob.experience
            });
            toast({
                title: "Job Posted",
                description: `${newJob.title || "Untitled Job"} is now active.`,
            });
        }
        setIsCreateOpen(false);
        setEditingId(null);
        setNewJob({ title: "", department: "Engineering", location: "Remote", type: "Full-time", experience: "1-3 Years" });
    };

    const handleEditClick = (job: Job) => {
        setNewJob({
            title: job.title,
            department: job.department,
            location: job.location,
            type: job.type,
            experience: job.experience
        });
        setEditingId(job.id);
        // Small timeout to allow dropdown to close cleanly before dialog opens
        // This prevents 'pointer-events: none' freezing issues
        setTimeout(() => setIsCreateOpen(true), 0);
    };

    const handleCreateClick = () => {
        setNewJob({ title: "", department: "Engineering", location: "Remote", type: "Full-time", experience: "1-3 Years" });
        setEditingId(null);
        setIsCreateOpen(true);
    };

    const handleCloseJob = (id: string) => {
        updateJob(id, { status: "Closed" });
        toast({
            title: "Job Closed",
            description: "The job position has been marked as closed.",
        });
    };

    const handleDeleteJob = (id: string) => {
        if (confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
            deleteJob(id);
            toast({
                title: "Job Deleted",
                description: "The job position has been permanently removed.",
                variant: "destructive"
            });
        }
    };

    const handleViewApplicants = (job: Job) => {
        // Mock navigation
        toast({
            title: "Navigating",
            description: `Viewing applicants for ${job.title}...`,
        });
        router.push(`/hrmcubicle/hire/candidates?jobId=${job.id}`);
    };

    const handleShareLink = (job: Job) => {
        navigator.clipboard.writeText(`https://hrm.company.com/jobs/${job.id}`);
        toast({
            title: "Link Copied",
            description: "Job link copied to clipboard.",
        });
    };

    const getFilteredJobs = (tabValue: string) => {
        if (tabValue === "all") return jobs;
        if (tabValue === "active") return jobs.filter(j => j.status === "Active");
        if (tabValue === "drafts") return jobs.filter(j => j.status === "Draft");
        if (tabValue === "closed") return jobs.filter(j => j.status === "Closed");
        return [];
    };

    const StatusBadge = ({ status }: { status: string }) => {
        if (status === "Active") return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none shadow-none font-medium px-2 py-0.5">Active</Badge>;
        if (status === "Draft") return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none shadow-none font-medium px-2 py-0.5">Draft</Badge>;
        if (status === "Closed") return <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none shadow-none font-medium px-2 py-0.5">Closed</Badge>;
        return <Badge variant="outline">{status}</Badge>;
    };

    const filteredJobs = getFilteredJobs(activeTab);

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Job Openings</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage all your open positions and track hiring progress.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button className="bg-[#6366f1] hover:bg-[#5558e6] text-white" onClick={handleCreateClick}>
                        <Plus className="mr-2 h-4 w-4" /> Post New Job
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={(open) => {
                        setIsCreateOpen(open);
                        if (!open) setEditingId(null);
                    }}>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Edit Job Details" : "Post a Job"}</DialogTitle>
                                <DialogDescription>
                                    {editingId ? "Update the job requirements and details." : "Create a new job opening. This will be visible to your hiring team immediately."}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="title" className="text-right">Job Title</Label>
                                    <Input
                                        id="title"
                                        value={newJob.title}
                                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                        placeholder="e.g. Senior Product Manager"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="dept" className="text-right">Department</Label>
                                    <Select
                                        onValueChange={(v) => setNewJob({ ...newJob, department: v })}
                                        defaultValue={newJob.department}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Engineering">Engineering</SelectItem>
                                            <SelectItem value="Design">Design</SelectItem>
                                            <SelectItem value="Marketing">Marketing</SelectItem>
                                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                                            <SelectItem value="Sales">Sales</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="location" className="text-right">Location</Label>
                                    <Input
                                        id="location"
                                        value={newJob.location}
                                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                        placeholder="e.g. New York, Remote"
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="exp" className="text-right">Experience</Label>
                                    <Select
                                        onValueChange={(v) => setNewJob({ ...newJob, experience: v })}
                                        defaultValue={newJob.experience}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select experience" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Fresher">Fresher</SelectItem>
                                            <SelectItem value="1-3 Years">1-3 Years</SelectItem>
                                            <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                                            <SelectItem value="5+ Years">5+ Years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="type" className="text-right">Type</Label>
                                    <Select
                                        onValueChange={(v) => setNewJob({ ...newJob, type: v })}
                                        defaultValue={newJob.type}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select employment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Full-time">Full-time</SelectItem>
                                            <SelectItem value="Part-time">Part-time</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                            <SelectItem value="Internship">Internship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={handleSaveJob}>
                                    {editingId ? "Save Changes" : "Create Job"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="active" className="space-y-6 flex-1" onValueChange={setActiveTab}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full sm:w-auto overflow-x-auto justify-start h-auto rounded-none">
                        <TabsTrigger
                            value="active"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium"
                        >
                            Active Jobs
                        </TabsTrigger>
                        <TabsTrigger
                            value="drafts"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium"
                        >
                            Drafts
                        </TabsTrigger>
                        <TabsTrigger
                            value="closed"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium"
                        >
                            Closed
                        </TabsTrigger>
                        <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium"
                        >
                            All Jobs
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Search by title, dept..."
                                className="pl-9 h-9 border-slate-200 bg-white shadow-sm"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 shadow-sm">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                    </div>
                </div>

                <TabsContent value={activeTab} className="h-full mt-0">
                    <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow className="hover:bg-slate-50">
                                    <TableHead className="font-semibold text-slate-600 w-[300px]">Job Title</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Pipeline</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Location</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Type</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Posted Date</TableHead>
                                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map((job) => (
                                        <TableRow key={job.id} className="hover:bg-slate-50/50 group">
                                            <TableCell className="align-top py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span
                                                        className="font-semibold text-slate-900 group-hover:text-[#6366f1] transition-colors cursor-pointer"
                                                        onClick={() => handleViewApplicants(job)}
                                                    >
                                                        {job.title}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span className="">{job.department}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                        <span className="">{job.id}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4">
                                                <div
                                                    className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 -ml-1 rounded"
                                                    onClick={() => handleViewApplicants(job)}
                                                >
                                                    <Users className="h-4 w-4 text-slate-400" />
                                                    <span className="font-medium text-slate-700">{job.applicants}</span>
                                                    <span className="text-slate-500 text-sm">Applicants</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                                    {job.location}
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4">
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <div className="flex items-center gap-1.5 text-slate-700">
                                                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                                                        {job.type}
                                                    </div>
                                                    <span className="text-xs text-slate-500 pl-5">Exp: {job.experience}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="align-top py-4 text-slate-600 text-sm">
                                                {job.postedDate}
                                            </TableCell>
                                            <TableCell className="align-top py-4">
                                                <StatusBadge status={job.status} />
                                            </TableCell>
                                            <TableCell className="align-top py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEditClick(job)}>
                                                            Edit Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleViewApplicants(job)}>
                                                            View Applicants
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleShareLink(job)}>
                                                            Share Job Link
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {job.status === "Active" && (
                                                            <DropdownMenuItem className="text-amber-600" onClick={() => handleCloseJob(job.id)}>
                                                                Mark as Filled
                                                            </DropdownMenuItem>
                                                        )}
                                                        {job.status !== "Closed" && (
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleCloseJob(job.id)}>
                                                                Close Job
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem className="text-red-600 font-medium" onClick={() => handleDeleteJob(job.id)}>
                                                            Delete Job
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-48 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                                    <Search className="h-5 w-5 text-slate-400" />
                                                </div>
                                                <p className="text-slate-900 font-medium">No jobs found</p>
                                                <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or create a new job.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default JobOpeningsPage;
