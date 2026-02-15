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
    Clock
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

const InterviewsPage = () => {
    const { interviews, candidates, scheduleInterview, updateInterview, cancelInterview, deleteInterview } = useHireStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        candidateName: "",
        role: "",
        date: "",
        time: "",
        duration: "1 hour",
        interviewer: "",
        mode: "Video" as "In-person" | "Video" | "Phone",
        location: ""
    });

    useEffect(() => {
        const candidateParam = searchParams.get('candidate');
        if (candidateParam) {
            setFormData(prev => ({ ...prev, candidateName: decodeURIComponent(candidateParam) }));
            setTimeout(() => setIsDialogOpen(true), 0);
        }
    }, [searchParams]);

    const resetForm = () => {
        setFormData({ candidateName: "", role: "", date: "", time: "", duration: "1 hour", interviewer: "", mode: "Video", location: "" });
    };

    const handleSaveInterview = () => {
        if (!formData.candidateName || !formData.date || !formData.time) {
            toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }

        const selectedCandidate = candidates.find(c => c.name === formData.candidateName);

        scheduleInterview({
            candidateId: selectedCandidate?.id || `TEMP-${Date.now()}`,
            candidateName: formData.candidateName,
            position: formData.role || selectedCandidate?.position || "Not Specified",
            interviewer: formData.interviewer,
            date: formData.date,
            time: formData.time,
            duration: formData.duration,
            mode: formData.mode,
            type: "Technical",
            location: formData.location
        });

        toast({ title: "Interview Scheduled", description: `Interview scheduled for ${formData.candidateName}` });
        setIsDialogOpen(false);
        resetForm();
    };

    const handleAddClick = () => {
        resetForm();
        setTimeout(() => setIsDialogOpen(true), 0);
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        updateInterview(id, { status: newStatus as any });
        toast({ title: "Status Updated", description: `Interview marked as ${newStatus}.` });
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this interview?")) {
            deleteInterview(id);
            toast({ title: "Interview Deleted", description: "Interview has been removed.", variant: "destructive" });
        }
    };

    const handleCancel = (id: string) => {
        cancelInterview(id);
        toast({ title: "Interview Cancelled", description: "The interview was marked as cancelled.", variant: "destructive" });
    };

    const getFilteredInterviews = (tab: string) => {
        if (tab === "all") return interviews;
        if (tab === "scheduled") return interviews.filter(i => i.status === "Scheduled");
        if (tab === "completed") return interviews.filter(i => i.status === "Completed");
        if (tab === "cancelled") return interviews.filter(i => i.status === "Cancelled");
        return interviews;
    };

    const filteredInterviews = getFilteredInterviews(activeTab);

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Interviews</h1>
                    <p className="text-slate-500 font-medium italic">"Great vision without great people is irrelevant."</p>
                </div>
                <Button
                    onClick={handleAddClick}
                    className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-bold border-none transition-all hover:scale-105 active:scale-95"
                >
                    <Calendar className="mr-2 h-5 w-5" /> Schedule Interview
                </Button>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                    <div className="px-8 pt-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0">
                        <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12">
                            <TabsTrigger value="all" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">All</TabsTrigger>
                            <TabsTrigger value="scheduled" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Scheduled</TabsTrigger>
                            <TabsTrigger value="completed" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Completed</TabsTrigger>
                            <TabsTrigger value="cancelled" className="rounded-xl px-6 font-bold data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm">Cancelled</TabsTrigger>
                        </TabsList>

                        <div className="relative mb-4 sm:mb-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search candidate..."
                                className="pl-11 rounded-2xl border-none bg-slate-50 h-11 w-full sm:w-64 font-medium focus-visible:ring-2 focus-visible:ring-purple-100"
                            />
                        </div>
                    </div>

                    <TabsContent value={activeTab} className="m-0 flex-1 overflow-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="font-bold text-slate-900 h-14 pl-8">Candidate & Role</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Schedule</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Interviewer</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Mode</TableHead>
                                    <TabsTrigger value="status" className="hidden"></TabsTrigger>
                                    <TableHead className="font-bold text-slate-900 h-14">Status</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14 pr-8 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInterviews.map((interview) => (
                                    <TableRow key={interview.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-slate-900">{interview.candidateName}</span>
                                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{interview.position}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                                                    <Calendar className="h-3.5 w-3.5 text-[#CB9DF0]" />
                                                    {interview.date}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {interview.time} ({interview.duration})
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <span className="font-bold text-slate-700 text-sm">{interview.interviewer}</span>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex items-center gap-2">
                                                {interview.mode === "Video" ? (
                                                    <Badge className="bg-blue-50 text-blue-600 border-none shadow-none font-bold rounded-lg h-7 gap-1.5 ring-1 ring-blue-100">
                                                        <Video className="h-3 w-3" /> Video
                                                    </Badge>
                                                ) : interview.mode === "In-person" ? (
                                                    <Badge className="bg-purple-50 text-purple-600 border-none shadow-none font-bold rounded-lg h-7 gap-1.5 ring-1 ring-purple-100">
                                                        <MapPin className="h-3 w-3" /> In-person
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-amber-50 text-amber-600 border-none shadow-none font-bold rounded-lg h-7 gap-1.5 ring-1 ring-amber-100">
                                                        <Phone className="h-3 w-3" /> Phone
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <Select value={interview.status} onValueChange={(val) => handleStatusChange(interview.id, val)}>
                                                <SelectTrigger className="w-32 h-9 text-[11px] font-black rounded-xl border-none bg-slate-100 focus:ring-2 focus:ring-purple-100 shadow-sm">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                    <SelectItem value="Scheduled" className="rounded-xl font-bold text-[11px] mb-1">Scheduled</SelectItem>
                                                    <SelectItem value="Completed" className="rounded-xl font-bold text-[11px] mb-1">Completed</SelectItem>
                                                    <SelectItem value="Cancelled" className="rounded-xl font-bold text-[11px] text-red-600">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="pr-8 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-9 w-9 rounded-xl p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-none p-2 animate-in fade-in zoom-in duration-200">
                                                    <DropdownMenuLabel className="font-black text-slate-400 text-[10px] uppercase tracking-widest px-3 py-2">Interview Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3 focus:bg-slate-50">Reschedule Interview</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3 focus:bg-slate-50">Add Feedback</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-slate-50 my-2" />
                                                    {interview.status === "Scheduled" && (
                                                        <DropdownMenuItem className="rounded-xl font-bold h-11 px-3 text-amber-600 focus:bg-amber-50" onClick={() => handleCancel(interview.id)}>
                                                            <XCircle className="h-4 w-4 mr-2" /> Cancel Interview
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3 text-red-600 focus:bg-red-50" onClick={() => handleDelete(interview.id)}>
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete Record
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {filteredInterviews.length === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                                <Calendar className="h-12 w-12 text-slate-100" />
                                <p className="font-bold">No interviews found</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Schedule Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-2xl shadow-2xl">
                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">Schedule Interview</DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold text-base mt-2">
                            Set up a new meeting with the candidate.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-8 py-2">
                        <div className="space-y-3 col-span-2">
                            <Label className="text-slate-900 font-black text-sm ml-1">Candidate Selection</Label>
                            <Select
                                value={formData.candidateName}
                                onValueChange={(val) => {
                                    const cand = candidates.find(c => c.name === val);
                                    setFormData({ ...formData, candidateName: val, role: cand?.position || formData.role });
                                }}
                            >
                                <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 font-bold px-6">
                                    <SelectValue placeholder="Choose a candidate..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold max-h-[300px]">
                                    {candidates.map(c => (
                                        <SelectItem key={c.id} value={c.name} className="rounded-xl h-11">{c.name} ({c.position})</SelectItem>
                                    ))}
                                    {candidates.length === 0 && <SelectItem value="none" disabled>No candidates available</SelectItem>}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-900 font-black text-sm ml-1">Position / Role</Label>
                            <Input
                                placeholder="e.g. Frontend Dev"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-900 font-black text-sm ml-1">Interviewer</Label>
                            <Input
                                placeholder="Interviewer name"
                                value={formData.interviewer}
                                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-900 font-black text-sm ml-1">Date</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-900 font-black text-sm ml-1">Time</Label>
                            <Input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-900 font-black text-sm ml-1">Mode</Label>
                            <Select
                                value={formData.mode}
                                onValueChange={(val) => setFormData({ ...formData, mode: val as any })}
                            >
                                <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 font-bold px-6">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                    <SelectItem value="Video" className="rounded-xl h-11">Video Call</SelectItem>
                                    <SelectItem value="In-person" className="rounded-xl h-11">In-person Meeting</SelectItem>
                                    <SelectItem value="Phone" className="rounded-xl h-11">Phone Call</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {formData.mode !== "In-person" ? (
                            <div className="space-y-3">
                                <Label className="text-slate-900 font-black text-sm ml-1">Duration</Label>
                                <Select
                                    value={formData.duration}
                                    onValueChange={(val) => setFormData({ ...formData, duration: val })}
                                >
                                    <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 font-bold px-6">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                        <SelectItem value="30 mins" className="rounded-xl h-11">30 Minutes</SelectItem>
                                        <SelectItem value="45 mins" className="rounded-xl h-11">45 Minutes</SelectItem>
                                        <SelectItem value="1 hour" className="rounded-xl h-11">1 Hour</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <Label className="text-slate-900 font-black text-sm ml-1">Location / Room</Label>
                                <Input
                                    placeholder="Meeting Room A"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6"
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-12 gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={handleSaveInterview}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-100 font-black border-none flex-1"
                        >
                            Schedule Meeting
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
                            className="rounded-[1.25rem] h-14 px-10 font-bold text-slate-400 border-none flex-1 hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InterviewsPage;
