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
    GripVertical,
    LayoutGrid,
    List,
    Trash2,
    Filter,
    ArrowUpDown,
    Download,
    Plus
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

const CandidatesPage = () => {
    const { candidates, addCandidate, updateCandidate, deleteCandidate } = useHireStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const { toast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        source: "LinkedIn",
        resumeUrl: ""
    });

    const stages = [
        { id: "New", title: "New Applied", color: "bg-slate-100", textColor: "text-slate-600" },
        { id: "Screening", title: "Screening", color: "bg-blue-100", textColor: "text-blue-600" },
        { id: "Interview", title: "Interview", color: "bg-purple-100", textColor: "text-purple-600" },
        { id: "Offer", title: "Offered", color: "bg-amber-100", textColor: "text-amber-600" },
        { id: "Hired", title: "Hired", color: "bg-emerald-100", textColor: "text-emerald-600" },
        { id: "Rejected", title: "Rejected", color: "bg-red-100", textColor: "text-red-600" }
    ];

    // Filtered candidates
    const filteredCandidates = useMemo(() => {
        return candidates.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.position.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [candidates, searchQuery, statusFilter]);

    // Handlers
    const resetForm = () => {
        setFormData({ name: "", email: "", phone: "", role: "", source: "LinkedIn", resumeUrl: "" });
    };

    const handleSave = () => {
        if (!formData.name || !formData.email || !formData.role) {
            toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }

        if (editingId) {
            updateCandidate(editingId, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                position: formData.role,
                source: formData.source,
                resumeUrl: formData.resumeUrl
            });
            toast({ title: "Candidate Updated", description: "Candidate details saved successfully." });
        } else {
            addCandidate({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                position: formData.role,
                source: formData.source,
                resumeUrl: formData.resumeUrl
            });
            toast({ title: "Candidate Added", description: `${formData.name} has been added to the pipeline.` });
        }
        setIsDialogOpen(false);
        setEditingId(null);
        resetForm();
    };

    const handleEditClick = (candidate: Candidate) => {
        setFormData({
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone,
            role: candidate.position,
            source: candidate.source,
            resumeUrl: candidate.resumeUrl || ""
        });
        setEditingId(candidate.id);
        setIsDialogOpen(true);
    };

    const handleAddClick = () => {
        resetForm();
        setEditingId(null);
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this candidate?")) {
            deleteCandidate(id);
            toast({ title: "Deleted", description: "Candidate removed successfully.", variant: "destructive" });
        }
    };

    const handleStageChange = (id: string, newStage: string) => {
        updateCandidate(id, { status: newStage as any });
        toast({ title: "Stage Updated", description: `Candidate moved to ${newStage}.` });
    };

    const handleViewResume = (candidate: Candidate) => {
        if (candidate.resumeUrl) {
            window.open(candidate.resumeUrl, '_blank');
            toast({ title: "Opening Resume", description: `Viewing resume for ${candidate.name}` });
        } else {
            toast({ title: "No Resume", description: "Resume not attached.", variant: "destructive" });
        }
    };

    const KanbanCard = ({ candidate }: { candidate: Candidate }) => (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-50 transition-all group relative cursor-grab active:cursor-grabbing"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-xl">
                        <AvatarFallback className="bg-slate-50 text-slate-400 font-black rounded-xl text-xs uppercase italic">
                            {candidate.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-black text-slate-900 text-sm leading-tight">{candidate.name}</h4>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mt-0.5">{candidate.position}</p>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <MoreHorizontal className="h-4 w-4 text-slate-300" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-[1.25rem] shadow-2xl border-none p-2 font-bold animate-in fade-in zoom-in duration-200">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400 px-3 py-2">Candidate Record</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(candidate)} className="rounded-xl h-11"><Briefcase className="h-4 w-4 mr-2" /> Modify Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewResume(candidate)} className="rounded-xl h-11"><FileText className="h-4 w-4 mr-2" /> View Resume</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/hrmcubicle/hire/interviews?candidate=${encodeURIComponent(candidate.name)}`)} className="rounded-xl h-11"><Calendar className="h-4 w-4 mr-2" /> Schedule Call</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-50 my-2" />
                        <DropdownMenuItem className="text-red-600 font-bold rounded-xl h-11 focus:bg-red-50 focus:text-red-600" onClick={() => handleDelete(candidate.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Disqualify
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                    <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Mail className="h-3 w-3" />
                    </div>
                    {candidate.email}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                    <div className="h-6 w-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Star className="h-3 w-3" />
                    </div>
                    {candidate.rating > 0 ? (
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className={`h-2.5 w-2.5 ${star <= candidate.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-100'}`} />
                            ))}
                        </div>
                    ) : <span className="text-slate-300 italic">No ratings yet</span>}
                </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <Badge className="bg-slate-50 text-slate-400 border-none shadow-none text-[10px] font-black h-6 px-3 rounded-lg uppercase tracking-tighter italic">
                    {candidate.source}
                </Badge>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-slate-300 uppercase leading-none mb-0.5">Applied</span>
                    <span className="text-[10px] font-bold text-slate-500 leading-none">{candidate.appliedDate}</span>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Talent Pipeline</h1>
                    <p className="text-slate-500 font-medium italic">Track and manage prospective hires across the recruitment funnel.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-100 p-1 rounded-2xl h-12 shadow-inner">
                        <Button
                            variant={viewMode === "kanban" ? "white" : "ghost"}
                            onClick={() => setViewMode("kanban")}
                            className={`rounded-xl px-4 h-10 font-black flex gap-2 ${viewMode === 'kanban' ? 'shadow-sm' : 'text-slate-400'}`}
                        >
                            <LayoutGrid className="h-4 w-4" /> Kanban
                        </Button>
                        <Button
                            variant={viewMode === "table" ? "white" : "ghost"}
                            onClick={() => setViewMode("table")}
                            className={`rounded-xl px-4 h-10 font-black flex gap-2 ${viewMode === 'table' ? 'shadow-sm' : 'text-slate-400'}`}
                        >
                            <List className="h-4 w-4" /> Table
                        </Button>
                    </div>
                    <Button
                        onClick={handleAddClick}
                        className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-black border-none transition-all hover:scale-105 active:scale-95"
                    >
                        <UserPlus className="mr-2 h-5 w-5" /> Add Candidate
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-[2rem] shadow-sm border border-slate-50">
                <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-purple-400 transition-colors" />
                    <Input
                        placeholder="Search by name, email or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-14 rounded-2xl border-none bg-slate-50 h-14 w-full font-bold text-slate-700 focus-visible:ring-2 focus-visible:ring-purple-100 transition-all shadow-inner"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px] h-14 rounded-2xl border-none bg-slate-50 font-bold text-slate-600 px-6 shadow-inner">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-slate-400" />
                            <span>{statusFilter === 'all' ? 'All Stages' : statusFilter}</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold max-h-[300px]">
                        <SelectItem value="all" className="rounded-xl h-11">All Stages</SelectItem>
                        {stages.map(s => (
                            <SelectItem key={s.id} value={s.id} className="rounded-xl h-11">{s.title}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="flex gap-2">
                    <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400">
                        <ArrowUpDown className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-slate-50 text-slate-400">
                        <Download className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {viewMode === "kanban" ? (
                    <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
                        <div className="flex gap-8 h-full min-w-max pb-4">
                            {stages.map((stage) => {
                                const stageCandidates = filteredCandidates.filter(c => c.status === stage.id);
                                return (
                                    <div key={stage.id} className="w-80 flex flex-col gap-6">
                                        <div className="flex items-center justify-between px-3">
                                            <div className="flex items-center gap-3">
                                                <Badge className={`${stage.color} ${stage.textColor} border-none shadow-none font-black rounded-xl h-9 px-4 italic uppercase text-[10px] tracking-widest`}>
                                                    {stage.title}
                                                </Badge>
                                                <span className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">{stageCandidates.length}</span>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-200 hover:text-slate-400">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="flex-1 bg-slate-100/30 rounded-[2.5rem] p-4 space-y-4 overflow-y-auto custom-scrollbar border-2 border-dashed border-slate-50 min-h-[400px]">
                                            <AnimatePresence>
                                                {stageCandidates.map(candidate => (
                                                    <KanbanCard key={candidate.id} candidate={candidate} />
                                                ))}
                                            </AnimatePresence>
                                            {stageCandidates.length === 0 && (
                                                <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-50 rounded-3xl gap-2">
                                                    <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center">
                                                        <Plus className="h-4 w-4 text-slate-200" />
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic text-center px-4">Drag here to move to {stage.id}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden flex-1">
                        <div className="overflow-auto h-full custom-scrollbar">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                                    <TableRow className="border-none hover:bg-transparent">
                                        <TableHead className="font-black text-slate-900 h-16 pl-10 text-xs uppercase tracking-widest">Candidate</TableHead>
                                        <TableHead className="font-black text-slate-900 h-16 text-xs uppercase tracking-widest">Role</TableHead>
                                        <TableHead className="font-black text-slate-900 h-16 text-xs uppercase tracking-widest">Pipeline Stage</TableHead>
                                        <TableHead className="font-black text-slate-900 h-16 text-xs uppercase tracking-widest">Evaluation</TableHead>
                                        <TableHead className="font-black text-slate-900 h-16 text-xs uppercase tracking-widest">Applied</TableHead>
                                        <TableHead className="font-black text-slate-900 h-16 pr-10 text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCandidates.map((candidate) => (
                                        <TableRow key={candidate.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                            <TableCell className="pl-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-11 w-11 rounded-2xl shadow-sm">
                                                        <AvatarFallback className="bg-slate-50 text-slate-400 font-black rounded-2xl text-xs uppercase italic">
                                                            {candidate.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-slate-900 text-base tracking-tight">{candidate.name}</span>
                                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mt-0.5">{candidate.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 font-bold text-slate-600 text-sm tracking-tight">{candidate.position}</TableCell>
                                            <TableCell className="py-6">
                                                <Select value={candidate.status} onValueChange={(val) => handleStageChange(candidate.id, val)}>
                                                    <SelectTrigger className="w-36 h-10 text-[11px] font-black rounded-xl border-none bg-slate-50 shadow-sm focus:ring-2 focus:ring-purple-100">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                                        {stages.map(s => (
                                                            <SelectItem key={s.id} value={s.id} className="text-[11px] font-bold rounded-xl h-10">{s.title}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="flex items-center gap-1">
                                                    <Star className={`h-4 w-4 ${candidate.rating > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-100'}`} />
                                                    <span className="text-xs font-black text-slate-900 mt-0.5">{candidate.rating > 0 ? candidate.rating : '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter italic">{candidate.source}</span>
                                                    <span className="text-xs font-bold text-slate-500 mt-1">{candidate.appliedDate}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-10 py-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-10 w-10 p-0 text-slate-200 hover:text-slate-400 rounded-xl hover:bg-white border-2 border-transparent hover:border-slate-50 shadow-none">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 rounded-[1.25rem] shadow-2xl border-none p-2 font-bold">
                                                        <DropdownMenuItem className="rounded-xl h-11 px-3" onClick={() => handleEditClick(candidate)}><Briefcase className="h-4 w-4 mr-2" /> Edit Details</DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl h-11 px-3" onClick={() => handleViewResume(candidate)}><FileText className="h-4 w-4 mr-2" /> View Resume</DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-slate-50 my-2" />
                                                        <DropdownMenuItem className="rounded-xl h-11 px-3 text-red-600 focus:bg-red-50 focus:text-red-600" onClick={() => handleDelete(candidate.id)}>Disqualify</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                )}
            </div>

            {/* Candidate Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tight tracking-tighter">
                            {editingId ? "Modify Applicant" : "Scout Talent"}
                        </DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-base mt-2 italic">
                            Building a world-class team starts with accurate profiles.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-8 py-8">
                        <div className="space-y-3 col-span-2">
                            <Label className="font-black text-slate-900 text-sm ml-1">Full Identity</Label>
                            <Input
                                placeholder="e.g. Ishita Sharma"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6 shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Digital Reach (Email)</Label>
                            <Input
                                type="email"
                                placeholder="ishita@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6 shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Connect (Phone)</Label>
                            <Input
                                placeholder="+91 91234 56789"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6 shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Target Role</Label>
                            <Input
                                placeholder="e.g. Sr. Cloud Architect"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6 shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Talent Source</Label>
                            <Select
                                value={formData.source}
                                onValueChange={(val) => setFormData({ ...formData, source: val })}
                            >
                                <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 font-bold px-6 shadow-inner">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                    <SelectItem value="LinkedIn" className="rounded-xl h-11 px-3">LinkedIn Recruiter</SelectItem>
                                    <SelectItem value="Referral" className="rounded-xl h-11 px-3">Internal Referral</SelectItem>
                                    <SelectItem value="Careers Page" className="rounded-xl h-11 px-3">Direct Application</SelectItem>
                                    <SelectItem value="Agency" className="rounded-xl h-11 px-3">Headhunting Agency</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={handleSave}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-50 font-black border-none flex-1"
                        >
                            {editingId ? "Apply Changes" : "Confirm Addition"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
                            className="rounded-[1.25rem] h-14 px-10 font-bold text-slate-400 border-none flex-1 hover:bg-slate-50"
                        >
                            Discard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CandidatesPage;
