"use client"

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import {
    UserPlus,
    MoreHorizontal,
    Search,
    Mail,
    Phone,
    Briefcase,
    Star,
    FileText,
    Calendar,
    LayoutGrid,
    List,
    Trash2,
    Filter,
    ArrowUpDown,
    Download,
    Plus,
    Tag,
    History,
    MessageSquare,
    Link as LinkIcon
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useHireStore, type Candidate } from "@/shared/data/hire-store";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";

const CandidatesPage = () => {
    const { candidates, jobs, addCandidate, updateCandidate, deleteCandidate, moveCandidateStage, addCandidateNote } = useHireStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    // Form Stats
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobId: "",
        source: "LinkedIn",
        resumeUrl: "",
        tagsInput: "",
        notes: ""
    });

    // Stages Config
    const stages = [
        { id: "New", title: "New Applied", color: "bg-slate-50/50", textColor: "text-slate-500", dot: "bg-slate-400", bar: "bg-slate-200" },
        { id: "Screening", title: "Screening", color: "bg-sky-50/60", textColor: "text-sky-600", dot: "bg-sky-400", bar: "bg-sky-400" },
        { id: "Interview", title: "Interview", color: "bg-indigo-50/60", textColor: "text-indigo-600", dot: "bg-indigo-400", bar: "bg-indigo-400" },
        { id: "Offer", title: "Offered", color: "bg-amber-50/60", textColor: "text-amber-600", dot: "bg-amber-400", bar: "bg-amber-400" },
        { id: "Hired", title: "Hired", color: "bg-emerald-50/60", textColor: "text-emerald-600", dot: "bg-emerald-400", bar: "bg-emerald-400" },
        { id: "Rejected", title: "Rejected", color: "bg-rose-50/60", textColor: "text-rose-600", dot: "bg-rose-400", bar: "bg-rose-400" }
    ];

    const filteredCandidates = useMemo(() => {
        return candidates.filter(c => {
            const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
                c.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || c.stage === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [candidates, searchQuery, statusFilter]);

    const resetForm = () => {
        setFormData({ firstName: "", lastName: "", email: "", phone: "", jobId: "", source: "LinkedIn", resumeUrl: "", tagsInput: "", notes: "" });
        setEditingCandidate(null);
    };

    const handleSave = () => {
        if (!formData.firstName || !formData.email || !formData.jobId) {
            toast({ title: "Validation Error", description: "Name, Email and Job Position are required.", variant: "destructive" });
            return;
        }

        // Duplicate Detection
        const isDuplicate = candidates.some(c => c.email.toLowerCase() === formData.email.toLowerCase() && c.id !== editingCandidate?.id);
        if (isDuplicate) {
            toast({
                title: "Duplicate Candidate",
                description: "This candidate email already exists in the pipeline.",
                variant: "destructive"
            });
            return;
        }

        const tags = formData.tagsInput.split(",").map(t => t.trim()).filter(Boolean);

        if (editingCandidate) {
            updateCandidate(editingCandidate.id, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                jobId: formData.jobId,
                source: formData.source,
                resumeUrl: formData.resumeUrl,
                tags
            });
            if (formData.notes) addCandidateNote(editingCandidate.id, formData.notes);
            toast({ title: "Profile Updated", description: "Candidate details updated successfully." });
        } else {
            addCandidate({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                location: "Remote", // Default
                jobId: formData.jobId,
                source: formData.source,
                resumeUrl: formData.resumeUrl,
                tags
            });
            // Note is handled separately if needed, or we can add logic to add note immediately (store update needed for atomic add)
            toast({ title: "Candidate Added", description: `${formData.firstName} has been added to the pipeline.` });
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const openEdit = (c: Candidate) => {
        setEditingCandidate(c);
        setFormData({
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            phone: c.phone,
            jobId: c.jobId,
            source: c.source,
            resumeUrl: c.resumeUrl || "",
            tagsInput: c.tags.join(", "),
            notes: ""
        });
        setIsDialogOpen(true);
    };

    const handleStageMove = (id: string, stage: string) => {
        moveCandidateStage(id, stage as any);
        toast({ title: "Stage Updated", description: `Candidate moved to ${stage}` });
    };

    const handleDeleteCandidate = (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            deleteCandidate(id);
            toast({ title: "Candidate Deleted", description: "The profile has been removed.", variant: "destructive" });
        }
    };

    return (
        <div className={`flex-1 space-y-4 p-4 bg-[#fcfdff] flex flex-col ${viewMode === 'kanban' ? 'h-full overflow-hidden' : 'min-h-screen overflow-y-auto'}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight">Talent Pipeline</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Track applicants, schedule interviews, and manage hiring workflows.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg h-8 shadow-inner">
                        <Button
                            variant={viewMode === "kanban" ? "secondary" : "ghost"}
                            onClick={() => setViewMode("kanban")}
                            className={`rounded-md px-2.5 h-7 font-bold flex gap-1.5 text-[10px] ${viewMode === 'kanban' ? 'shadow-sm text-slate-900 bg-white hover:bg-white' : 'text-slate-400'}`}
                        >
                            <LayoutGrid className="h-3 w-3" /> Kanban
                        </Button>
                        <Button
                            variant={viewMode === "table" ? "secondary" : "ghost"}
                            onClick={() => setViewMode("table")}
                            className={`rounded-md px-2.5 h-7 font-bold flex gap-1.5 text-[10px] ${viewMode === 'table' ? 'shadow-sm text-slate-900 bg-white hover:bg-white' : 'text-slate-400'}`}
                        >
                            <List className="h-3 w-3" /> Table
                        </Button>
                    </div>
                    <Button
                        onClick={() => { resetForm(); setIsDialogOpen(true); }}
                        className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-lg h-8 px-4 shadow-lg shadow-purple-50 font-bold text-[10px] border-none transition-all hover:scale-105 active:scale-95"
                    >
                        <UserPlus className="mr-2 h-3.5 w-3.5" /> Add Candidate
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center bg-white p-2.5 rounded-xl shadow-sm border border-slate-100">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300 group-focus-within:text-purple-400 transition-colors" />
                    <Input
                        placeholder="Search by name, email or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 rounded-lg border-none bg-slate-50 h-9 w-full font-bold text-[11px] text-slate-700 focus-visible:ring-2 focus-visible:ring-purple-100 transition-all shadow-inner placeholder:text-slate-300"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px] h-9 rounded-lg border-none bg-slate-50 font-bold text-[11px] text-slate-500 px-4 shadow-inner">
                        <div className="flex items-center gap-2">
                            <Filter className="h-3 w-3 text-slate-300" />
                            <span>{statusFilter === 'all' ? 'All Stages' : statusFilter}</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-2xl p-1 font-bold">
                        <SelectItem value="all" className="rounded-lg h-9 text-[11px]">All Stages</SelectItem>
                        {stages.map(s => (
                            <SelectItem key={s.id} value={s.id} className="rounded-lg h-9 text-[11px]">{s.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* View Content */}
            {viewMode === "kanban" ? (
                <div className="flex-1 overflow-x-auto pb-2 custom-scrollbar">
                    <div className="flex gap-3 h-full min-w-max pb-2">
                        {stages.map((stage) => {
                            const stageCandidates = filteredCandidates.filter(c => c.stage === stage.id);
                            return (
                                <div key={stage.id} className="w-60 flex flex-col gap-2.5 h-full">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1 h-1 rounded-full ${stage.dot}`} />
                                            <span className={`font-bold text-[9px] uppercase tracking-widest ${stage.textColor}`}>{stage.title}</span>
                                        </div>
                                        <Badge variant="secondary" className="bg-white/80 text-slate-400 font-bold rounded-md px-1.5 text-[8px] shadow-none border border-slate-100">
                                            {stageCandidates.length}
                                        </Badge>
                                    </div>
                                    <div className={`flex-1 ${stage.color} rounded-xl p-2 space-y-2 overflow-y-auto custom-scrollbar border border-dashed border-slate-200 relative`}>
                                        <div className={`absolute top-0 left-0 right-0 h-0.5 ${stage.bar} rounded-t-xl opacity-30`} />
                                        <AnimatePresence>
                                            {stageCandidates.map(candidate => {
                                                const job = jobs.find(j => j.id === candidate.jobId);
                                                return (
                                                    <motion.div
                                                        key={candidate.id}
                                                        layout
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing relative"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-8 w-8 rounded-lg border border-slate-50">
                                                                    <AvatarFallback className={`font-bold rounded-lg text-[9px] uppercase ${stage.textColor} ${stage.color}`}>
                                                                        {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <h4 className="font-bold text-slate-900 text-[11px] leading-tight">{candidate.firstName} {candidate.lastName}</h4>
                                                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5 line-clamp-1">{job?.title || "Unknown Role"}</p>
                                                                </div>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-5 w-5 p-0 opacity-20 group-hover:opacity-100 transition-opacity">
                                                                        <MoreHorizontal className="h-3 w-3 text-slate-400" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-xl border-none p-1 font-bold">
                                                                    <DropdownMenuItem onClick={() => openEdit(candidate)} className="rounded-lg text-xs">View Profile</DropdownMenuItem>
                                                                    <DropdownMenuSeparator className="bg-slate-50" />
                                                                    {stages.map(s => s.id !== stage.id && (
                                                                        <DropdownMenuItem key={s.id} onClick={() => handleStageMove(candidate.id, s.id)} className="rounded-lg text-[9px] uppercase">
                                                                            Move to {s.title}
                                                                        </DropdownMenuItem>
                                                                    ))}
                                                                    <DropdownMenuSeparator className="bg-slate-50" />
                                                                    <DropdownMenuItem onClick={() => handleDeleteCandidate(candidate.id, `${candidate.firstName} ${candidate.lastName}`)} className="rounded-lg text-xs text-red-600 focus:text-red-700 focus:bg-red-50">
                                                                        Delete Candidate
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        <div className="flex flex-wrap gap-1 mb-3">
                                                            {candidate.tags && candidate.tags.slice(0, 2).map((tag, i) => (
                                                                <Badge key={i} variant="outline" className="border-slate-50 bg-slate-50/30 text-slate-400 rounded-md font-bold text-[8px] px-1 h-4">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                            {candidate.rating > 0 && (
                                                                <Badge className="bg-amber-50 text-amber-500 border-amber-50 rounded-md font-bold text-[8px] px-1 h-4 gap-0.5">
                                                                    <Star className="h-2 w-2 fill-amber-500" /> {candidate.rating}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                                            <div className="flex items-center gap-1 text-[8px] font-bold text-slate-300">
                                                                <Calendar className="h-2.5 w-2.5" />
                                                                {candidate.appliedDate}
                                                            </div>
                                                            <Badge className="bg-slate-50 text-slate-300 border-none shadow-none text-[8px] font-bold h-4 px-1.5 rounded-md uppercase tracking-tighter">
                                                                {candidate.source}
                                                            </Badge>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden ring-1 ring-slate-100/50">
                    <div className="overflow-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-slate-50/50 sticky top-0 z-10 backdrop-blur-md">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="font-bold text-slate-400 h-10 pl-8 text-[9px] uppercase tracking-widest">Candidate</TableHead>
                                    <TableHead className="font-bold text-slate-400 h-10 text-[9px] uppercase tracking-widest">Applying For</TableHead>
                                    <TableHead className="font-bold text-slate-400 h-10 text-[9px] uppercase tracking-widest">Current Stage</TableHead>
                                    <TableHead className="font-bold text-slate-400 h-10 text-[9px] uppercase tracking-widest">Rating</TableHead>
                                    <TableHead className="font-bold text-slate-400 h-10 text-[9px] uppercase tracking-widest">Applied</TableHead>
                                    <TableHead className="font-bold text-slate-400 h-10 pr-8 text-right"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCandidates.map((candidate) => {
                                    const job = jobs.find(j => j.id === candidate.jobId);
                                    return (
                                        <TableRow key={candidate.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                            <TableCell className="pl-8 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 rounded-lg">
                                                        <AvatarFallback className="bg-violet-50 text-violet-500 font-bold rounded-lg text-[10px] uppercase">
                                                            {candidate.firstName.charAt(0)}{candidate.lastName.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 text-xs tracking-tight">{candidate.firstName} {candidate.lastName}</span>
                                                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter mt-0.5">{candidate.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 font-bold text-slate-500 text-xs">{job?.title || "Unknown"}</TableCell>
                                            <TableCell className="py-3">
                                                <Badge variant="outline" className={`${stages.find(s => s.id === candidate.stage)?.color} ${stages.find(s => s.id === candidate.stage)?.textColor} border-transparent font-bold uppercase text-[8px] h-5`}>
                                                    {stages.find(s => s.id === candidate.stage)?.title}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex items-center gap-1">
                                                    <Star className={`h-3 w-3 ${candidate.rating > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-100'}`} />
                                                    <span className="text-[10px] font-bold text-slate-900 mt-0.5">{candidate.rating || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3 text-[10px] font-bold text-slate-400">{candidate.appliedDate}</TableCell>
                                            <TableCell className="pr-8 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4 text-slate-300" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-none p-1 font-bold">
                                                        <DropdownMenuItem onClick={() => openEdit(candidate)} className="rounded-lg text-xs">View Profile</DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-slate-50" />
                                                        {stages.map(s => s.id !== candidate.stage && (
                                                            <DropdownMenuItem key={s.id} onClick={() => handleStageMove(candidate.id, s.id)} className="rounded-lg text-[9px] uppercase">
                                                                Move to {s.title}
                                                            </DropdownMenuItem>
                                                        ))}
                                                        <DropdownMenuSeparator className="bg-slate-50" />
                                                        <DropdownMenuItem onClick={() => handleDeleteCandidate(candidate.id, `${candidate.firstName} ${candidate.lastName}`)} className="rounded-lg text-xs text-red-600 focus:text-red-700 focus:bg-red-50">
                                                            Delete Candidate
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* Deep Profile Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[2rem] border-none p-0 max-w-4xl shadow-2xl h-[85vh] flex flex-col overflow-hidden">
                    <div className="px-8 pt-6 pb-4 border-b border-slate-50 flex items-start justify-between bg-white">
                        <div>
                            <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                                {editingCandidate ? "Candidate Profile" : "Add New Candidate"}
                            </DialogTitle>
                            <DialogDescription className="font-bold text-slate-500 text-xs mt-0.5">
                                {editingCandidate ? `Managing profile for ${editingCandidate.firstName} ${editingCandidate.lastName}` : "Create a new candidate application manually."}
                            </DialogDescription>
                        </div>
                        {editingCandidate && (
                            <div className="flex gap-2">
                                <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold">
                                    <Mail className="h-4 w-4 mr-2" /> Email
                                </Button>
                                <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 font-bold">
                                    <Phone className="h-4 w-4 mr-2" /> Call
                                </Button>
                            </div>
                        )}
                    </div>

                    <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-8 border-b border-slate-50 bg-white">
                            <TabsList className="bg-transparent h-12 p-0 gap-6">
                                <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#CB9DF0] data-[state=active]:text-[#CB9DF0] data-[state=active]:shadow-none px-0 font-bold h-full text-xs">Profile Details</TabsTrigger>
                                <TabsTrigger value="timeline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#CB9DF0] data-[state=active]:text-[#CB9DF0] data-[state=active]:shadow-none px-0 font-bold h-full text-xs" disabled={!editingCandidate}>Activity Logs</TabsTrigger>
                                <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#CB9DF0] data-[state=active]:text-[#CB9DF0] data-[state=active]:shadow-none px-0 font-bold h-full text-xs" disabled={!editingCandidate}>Notes</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="details" className="flex-1 overflow-y-auto custom-scrollbar p-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-[#CB9DF0]" /> Professional Info
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700 ml-1">Applying For</Label>
                                            <Select
                                                value={formData.jobId}
                                                onValueChange={(val) => setFormData({ ...formData, jobId: val })}
                                            >
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                                                    <SelectValue placeholder="Select Job" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-none font-bold">
                                                    {jobs.filter(j => j.workflowStatus === 'Active' || j.workflowStatus === 'Draft').map(job => (
                                                        <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700 ml-1">Source</Label>
                                            <Select
                                                value={formData.source}
                                                onValueChange={(val) => setFormData({ ...formData, source: val })}
                                            >
                                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-none font-bold">
                                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                                    <SelectItem value="Referral">Referral</SelectItem>
                                                    <SelectItem value="Agency">Agency</SelectItem>
                                                    <SelectItem value="CareerPage">Career Page</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label className="font-bold text-slate-700 ml-1">Resume Link (URL)</Label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input
                                                    className="pl-10 h-12 rounded-xl bg-slate-50 border-none font-medium"
                                                    placeholder="https://drive.google.com/..."
                                                    value={formData.resumeUrl}
                                                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label className="font-bold text-slate-700 ml-1">Skills & Tags</Label>
                                            <div className="relative">
                                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <Input
                                                    className="pl-10 h-12 rounded-xl bg-slate-50 border-none font-medium"
                                                    placeholder="React, Figma, Urgent Hiring (comma separated)"
                                                    value={formData.tagsInput}
                                                    onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-wide flex items-center gap-2">
                                        <UserPlus className="h-4 w-4 text-[#CB9DF0]" /> Personal Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700 ml-1">First Name</Label>
                                            <Input
                                                className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700 ml-1">Last Name</Label>
                                            <Input
                                                className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label className="font-bold text-slate-700 ml-1">Email Address</Label>
                                            <Input
                                                type="email"
                                                className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label className="font-bold text-slate-700 ml-1">Phone Number</Label>
                                            <Input
                                                className="h-12 rounded-xl bg-slate-50 border-none font-bold"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                        {!editingCandidate && (
                                            <div className="col-span-2 space-y-2">
                                                <Label className="font-bold text-slate-700 ml-1">Initial Note</Label>
                                                <Textarea
                                                    className="h-24 rounded-xl bg-slate-50 border-none font-medium resize-none"
                                                    placeholder="Quick screening note..."
                                                    value={formData.notes}
                                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="timeline" className="flex-1 overflow-y-auto custom-scrollbar p-8">
                            <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
                                {editingCandidate?.communicationLog?.length ? (
                                    editingCandidate.communicationLog.map((log) => (
                                        <div key={log.id} className="relative pl-10">
                                            <div className="absolute left-0 top-1 h-10 w-10 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center z-10">
                                                <History className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-black text-slate-900 text-sm">{log.action}</span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(log.timestamp).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-slate-600 text-xs font-medium">{log.details}</p>
                                                <span className="text-[10px] font-bold text-purple-400 mt-2 block">by {log.performer}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 text-slate-400 font-bold italic">No activity recorded yet for this candidate.</div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="p-6 border-t border-slate-50 bg-slate-50/30 gap-3">
                        <Button
                            onClick={handleSave}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-10 shadow-xl shadow-indigo-100 font-bold border-none flex-1"
                        >
                            {editingCandidate ? "Save Changes" : "Add Candidate"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
                            className="rounded-xl h-11 px-8 font-bold text-slate-400 border border-slate-200 hover:bg-white flex-1 transition-all"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CandidatesPage;
