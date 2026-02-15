"use client"

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import {
    Calendar,
    MoreHorizontal,
    Search,
    Video,
    MapPin,
    Phone,
    CheckCircle2,
    XCircle,
    Trash2,
    Clock,
    User,
    Link as LinkIcon,
    Stars,
    MessageSquare
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
import { useHireStore, type Interview } from "@/shared/data/hire-store";
import { Textarea } from "@/shared/components/ui/textarea"; // Assuming Textarea component exists
import { Card } from "@/shared/components/ui/card";

const InterviewsPage = () => {
    const { interviews, candidates, jobs, scheduleInterview, updateInterview, deleteInterview, submitFeedback } = useHireStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Schedule Form
    const [formData, setFormData] = useState({
        candidateId: "",
        interviewer: "",
        date: "",
        time: "",
        duration: "1 hour",
        mode: "Video" as "In-person" | "Video" | "Phone",
        location: "", // Physical or Link
        title: "Technical Round 1"
    });

    const [searchQuery, setSearchQuery] = useState("");

    // Feedback Form
    const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
    const [editingInterviewId, setEditingInterviewId] = useState<string | null>(null);
    const [feedbackData, setFeedbackData] = useState({
        technicalScore: 0,
        communicationScore: 0,
        cultureScore: 0,
        comments: "",
        decision: "Hire"
    });

    useEffect(() => {
        const candidateParam = searchParams.get('candidate');
        if (candidateParam) {
            // Find candidate by name (fallback logic, ideally ID)
            const candidate = candidates.find(c => `${c.firstName} ${c.lastName}` === decodeURIComponent(candidateParam));
            if (candidate) {
                setFormData(prev => ({ ...prev, candidateId: candidate.id }));
                setIsDialogOpen(true);
            }
        }
    }, [searchParams, candidates]);

    const resetForm = () => {
        setFormData({ candidateId: "", interviewer: "", date: "", time: "", duration: "1 hour", mode: "Video", location: "", title: "Technical Round 1" });
    };

    const handleSchedule = () => {
        if (!formData.candidateId || !formData.date || !formData.time) {
            toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }

        const candidate = candidates.find(c => c.id === formData.candidateId);
        if (!candidate) return;

        const interviewData = {
            candidateId: candidate.id,
            jobId: candidate.jobId,
            title: formData.title,
            interviewers: [formData.interviewer],
            date: formData.date,
            time: formData.time,
            duration: formData.duration,
            mode: formData.mode,
            meetingLink: formData.mode === 'Video' ? formData.location : undefined,
            location: formData.mode === 'In-person' ? formData.location : undefined,
        };

        if (editingInterviewId) {
            updateInterview(editingInterviewId, interviewData);
            toast({ title: "Interview Updated", description: "Schedule has been modified successfully." });
        } else {
            scheduleInterview(interviewData as any);
            toast({ title: "Interview Scheduled", description: `Meeting set with ${candidate.firstName}.` });
        }

        setIsDialogOpen(false);
        setEditingInterviewId(null);
        resetForm();
    };

    const handleReschedule = (interview: Interview) => {
        setEditingInterviewId(interview.id);
        setFormData({
            candidateId: interview.candidateId,
            interviewer: interview.interviewers[0] || "",
            date: interview.date,
            time: interview.time,
            duration: interview.duration,
            mode: interview.mode,
            location: interview.mode === 'Video' ? (interview.meetingLink || "") : (interview.location || ""),
            title: interview.title
        });
        setIsDialogOpen(true);
    };

    const handleSubmitFeedback = () => {
        if (!selectedInterviewId) return;

        const overallScore = Math.round((feedbackData.technicalScore + feedbackData.communicationScore + feedbackData.cultureScore) / 3);

        submitFeedback(selectedInterviewId, {
            interviewerId: "CURRENT_USER", // Mock ID
            skillsRating: [
                { skill: "Technical", score: feedbackData.technicalScore },
                { skill: "Communication", score: feedbackData.communicationScore },
                { skill: "Culture Fit", score: feedbackData.cultureScore }
            ],
            overallScore,
            feedback: feedbackData.comments,
            submittedAt: new Date().toISOString()
        });

        toast({ title: "Feedback Submitted", description: "Scorecard has been recorded." });
        setIsFeedbackOpen(false);
        setFeedbackData({ technicalScore: 0, communicationScore: 0, cultureScore: 0, comments: "", decision: "Hire" });
    };

    const openFeedback = (id: string) => {
        setSelectedInterviewId(id);
        setIsFeedbackOpen(true);
    };

    const filteredInterviews = interviews.filter(i => {
        const matchesTab = activeTab === "all" || i.status.toLowerCase() === activeTab;
        const candidate = candidates.find(c => c.id === i.candidateId);
        const candidateName = candidate ? `${candidate.firstName} ${candidate.lastName}`.toLowerCase() : "";
        const query = searchQuery.toLowerCase();
        const matchesSearch = candidateName.includes(query) || i.title.toLowerCase().includes(query);
        return matchesTab && matchesSearch;
    });

    return (
        <div className="flex-1 space-y-4 p-4 min-h-screen flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight">Interview Schedule</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Manage rounds, panels, and feedback collection.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setEditingInterviewId(null); setIsDialogOpen(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 px-4 shadow-lg shadow-indigo-50 font-bold text-[10px] border-none transition-all hover:scale-105 active:scale-95"
                >
                    <Calendar className="mr-2 h-3.5 w-3.5" /> Schedule Round
                </Button>
            </div>

            {/* Content Tabs */}
            <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden flex flex-col ring-1 ring-slate-100">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                    <div className="px-6 pt-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-0">
                        <TabsList className="bg-slate-50/80 p-1 rounded-xl h-10 w-full sm:w-auto">
                            {['all', 'scheduled', 'completed', 'cancelled'].map(tab => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="rounded-lg px-4 h-8 font-bold capitalize text-slate-500 text-[10px] data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
                                >
                                    {tab}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="relative w-full sm:w-60 mb-3 sm:mb-0">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300" />
                            <Input
                                placeholder="Search by name or round..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 rounded-lg border-none bg-slate-50 h-8 font-bold text-[10px] text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-100 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <TabsContent value={activeTab} className="m-0 flex-1 overflow-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-slate-50/30 sticky top-0 z-10 backdrop-blur-sm">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest pl-6 h-10">Candidate / Role</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10">Timing</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10">Interviewers</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10">Format</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10">Status</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10 pr-6 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInterviews.length > 0 ? (
                                    filteredInterviews.map((interview) => {
                                        const candidate = candidates.find(c => c.id === interview.candidateId);
                                        const job = jobs.find(j => j.id === candidate?.jobId);

                                        return (
                                            <TableRow key={interview.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                                <TableCell className="pl-6 py-3">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-bold text-slate-900 text-xs">{candidate ? `${candidate.firstName} ${candidate.lastName}` : "Unknown"}</span>
                                                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">{job?.title || "Unknown Role"} • {interview.title}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center text-violet-500">
                                                            <Calendar className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-700 text-[11px]">{new Date(interview.date).toLocaleDateString()}</span>
                                                            <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1">
                                                                <Clock className="h-2.5 w-2.5" /> {interview.time} ({interview.duration})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <div className="flex -space-x-1.5">
                                                        {interview.interviewers?.map((interviewer, i) => (
                                                            <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-400" title={interviewer}>
                                                                {interviewer.charAt(0)}
                                                            </div>
                                                        )) || <span className="text-[10px] font-medium text-slate-300">Not assigned</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Badge variant="outline" className="bg-slate-50 border-slate-50 text-slate-400 font-bold rounded-md px-1.5 h-6 gap-1 text-[9px]">
                                                        {interview.mode === 'Video' ? <Video className="h-2.5 w-2.5" /> : interview.mode === 'Phone' ? <Phone className="h-2.5 w-2.5" /> : <MapPin className="h-2.5 w-2.5" />}
                                                        {interview.mode}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-3">
                                                    <Badge className={`${interview.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : interview.status === 'Cancelled' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'} border-transparent font-bold px-2 py-0.5 rounded-md text-[8px] uppercase`}>
                                                        {interview.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="pr-6 py-3 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:text-slate-600">
                                                                <MoreHorizontal className="h-5 w-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-none p-1 font-bold">
                                                            {interview.status !== 'Completed' && (
                                                                <DropdownMenuItem onClick={() => openFeedback(interview.id)} className="rounded-xl h-10 text-indigo-600 bg-indigo-50/50 mb-1">
                                                                    <Stars className="h-4 w-4 mr-2" /> Submit Feedback
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem onClick={() => handleReschedule(interview)} className="rounded-xl h-10">Reschedule</DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-slate-50" />
                                                            <DropdownMenuItem onClick={() => { if (confirm("Delete this interview?")) deleteInterview(interview.id); }} className="rounded-xl h-10 text-red-600 focus:bg-red-50 focus:text-red-700">Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                                <Calendar className="h-10 w-10 text-slate-200" />
                                                <p className="font-bold">No interviews found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-100/50 p-5 max-w-2xl shadow-2xl top-[50%] -translate-y-1/2">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Schedule Round</DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-xs">Coordinate timing and interviewers.</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3.5">
                        <div className="space-y-1.5 p-0.5">
                            <Label className="font-bold text-slate-700 text-xs ml-1">Candidate</Label>
                            <Select value={formData.candidateId} onValueChange={(val) => setFormData({ ...formData, candidateId: val })}>
                                <SelectTrigger className="h-10 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs focus:ring-2 focus:ring-indigo-100 ring-offset-0">
                                    <SelectValue placeholder="Select Candidate" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none font-bold">
                                    {candidates.map(c => (
                                        <SelectItem key={c.id} value={c.id} className="text-xs">{c.firstName} {c.lastName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-xs ml-1">Round Title</Label>
                            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="h-10 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-xs ml-1">Interviewer</Label>
                            <Input placeholder="e.g. John Doe" value={formData.interviewer} onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })} className="h-10 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-xs ml-1">Date</Label>
                            <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="h-10 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-xs ml-1">Time</Label>
                            <Input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="h-10 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-xs ml-1">Duration</Label>
                            <Select value={formData.duration} onValueChange={(val) => setFormData({ ...formData, duration: val })}>
                                <SelectTrigger className="h-10 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none font-bold">
                                    <SelectItem value="30 mins" className="text-xs">30 mins</SelectItem>
                                    <SelectItem value="45 mins" className="text-xs">45 mins</SelectItem>
                                    <SelectItem value="1 hour" className="text-xs">1 hour</SelectItem>
                                    <SelectItem value="1.5 hours" className="text-xs">1.5 hours</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-xs ml-1">Mode</Label>
                            <Select value={formData.mode} onValueChange={(val: any) => setFormData({ ...formData, mode: val })}>
                                <SelectTrigger className="h-10 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none font-bold">
                                    <SelectItem value="Video" className="text-xs">Video Call</SelectItem>
                                    <SelectItem value="In-person" className="text-xs">In-person</SelectItem>
                                    <SelectItem value="Phone" className="text-xs">Phone</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label className="font-bold text-slate-700 ml-1">{formData.mode === 'Video' ? 'Meeting Link' : 'Location'}</Label>
                            <div className="relative">
                                {formData.mode === 'Video' ? <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /> : <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />}
                                <Input
                                    placeholder={formData.mode === 'Video' ? "zoom.us/j/..." : "Conference Room A"}
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="h-9 rounded-lg bg-slate-50 border-none font-bold px-9 text-xs"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button onClick={handleSchedule} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-bold shadow-xl border-none">
                            {editingInterviewId ? "Update Schedule" : "Schedule Interview"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Feedback Dialog */}
            <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-100/50 p-5 max-w-lg shadow-2xl top-[50%] -translate-y-1/2">
                    <DialogHeader className="mb-2">
                        <DialogTitle className="text-xl font-bold text-slate-900">Submit Scorecard</DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-xs">Rate the candidate's performance.</DialogDescription>
                    </DialogHeader>
                    <div className="py-2 space-y-5">
                        {['Technical Expertise', 'Communication', 'Culture Fit'].map((criteria, i) => {
                            const key = i === 0 ? 'technicalScore' : i === 1 ? 'communicationScore' : 'cultureScore';
                            return (
                                <div key={key} className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <Label className="font-bold text-slate-700 text-xs">{criteria}</Label>
                                        <span className="text-[10px] font-bold text-slate-400 select-none">
                                            {feedbackData[key as keyof typeof feedbackData]}/5
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((score) => (
                                            <button
                                                key={score}
                                                onClick={() => setFeedbackData({ ...feedbackData, [key]: score })}
                                                className={`flex-1 h-8 rounded-md transition-all font-bold text-xs ${(feedbackData[key as keyof typeof feedbackData] as number) >= score
                                                    ? 'bg-amber-400 text-white shadow-md scale-105'
                                                    : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
                                                    }`}
                                            >
                                                {score}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                        <div className="space-y-1.5">
                            <Label className="font-bold text-slate-700 text-xs ml-1">Comments</Label>
                            <Textarea
                                placeholder="Key strengths, weaknesses..."
                                value={feedbackData.comments}
                                onChange={(e) => setFeedbackData({ ...feedbackData, comments: e.target.value })}
                                className="h-20 rounded-lg bg-slate-50 border-none font-medium p-3 text-xs resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-2">
                        <Button onClick={handleSubmitFeedback} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-bold shadow-xl border-none text-xs">Submit Feedback</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InterviewsPage;
