"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserPlus,
    FileText,
    ShieldCheck,
    CalendarCheck,
    Plus,
    CheckCircle2,
    ArrowRight,
    Mail,
    FileSignature,
    XCircle,
    ExternalLink,
    Eye,
    Trash2,
    Activity
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore } from "@/shared/data/lifecycle-store";
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

const PreOnboardingPage = () => {
    const { toast } = useToast();
    const { candidates, addCandidate, removeCandidate, moveToOnboarding, updateCandidateStatus } = useLifecycleStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isBGVDialogOpen, setIsBGVDialogOpen] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);

    // Form State for New Candidate
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        department: "Engineering",
        email: "",
        joiningDate: "",
        salary: ""
    });

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'lifecycle-storage') {
                useLifecycleStore.persist.rehydrate();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Helper Functions
    const toTitleCase = (str: string) => {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getDaysToJoin = (dateStr: string) => {
        if (!dateStr || dateStr === "TBA") return null;
        const diff = new Date(dateStr).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    const stats = [
        { label: "Pending Joiners", value: candidates.filter(c => c.status !== 'Offer Rejected').length, color: "bg-[#CB9DF0]", icon: <UserPlus className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Offer Sent", value: candidates.filter(c => c.status === 'Offer Pending').length, color: "bg-[#F0C1E1]", icon: <FileSignature className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Offers Declined", value: candidates.filter(c => c.status === 'Offer Rejected').length, color: "bg-rose-100", icon: <XCircle className="text-rose-600" />, textColor: "text-rose-900" },
        { label: "Ready To Join", value: candidates.filter(c => c.status === 'Ready to Join').length, color: "bg-[#FFF9BF]", icon: <CalendarCheck className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    const filteredCandidates = candidates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = deptFilter === "All" || c.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    const departments = ["All", ...Array.from(new Set(candidates.map(c => c.department)))];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCand = {
            id: `C${Date.now()}`,
            name: formData.name,
            role: formData.role,
            department: formData.department,
            email: formData.email,
            joiningDate: formData.joiningDate || "TBA",
            salary: formData.salary || "Not Disclosed",
            status: "Offer Pending" as const,
            bgvStatus: "Pending" as const,
            avatar: formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        };
        addCandidate(newCand);
        setFormData({ name: "", role: "", department: "Engineering", email: "", joiningDate: "", salary: "" });
        setIsDialogOpen(false);
        toast({ title: "Offer Generated", description: `Candidate added. Status: Offer Pending` });
    };

    const handleSendOffer = (id: string, name: string) => {
        toast({ title: "Offer Sent", description: `Email with offer link sent to ${name}.` });
    };

    const handleOpenCandidateView = (id: string) => {
        window.open(`/offer-view/${id}`, '_blank');
    };

    const handleDeleteCandidate = (id: string, name: string) => {
        removeCandidate(id);
        toast({ title: "Candidate Removed", description: `${name} has been removed from the pipeline.`, variant: "destructive" });
    };

    const handleInitiateBGV = (id: string) => {
        updateCandidateStatus(id, "BGV In-Progress");
        toast({ title: "BGV Initiated", description: "Status updated to In-Progress." });
    };

    const handleVerifyBGV = (id: string) => {
        updateCandidateStatus(id, "BGV Verified");
        toast({ title: "BGV Verified", description: "Background check passed." });
    };

    const handleMarkReady = (id: string) => {
        updateCandidateStatus(id, "Ready to Join");
        toast({ title: "Ready for Day 1", description: "Candidate ready for Onboarding." });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pre-Onboarding</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 1: From offer rollout to joining day.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-9 px-4 shadow-lg shadow-indigo-100 font-bold text-[10px]">
                            <Plus className="mr-2 h-4 w-4" /> Create Offer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-8 max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">New Candidate Offer</DialogTitle>
                            <DialogDescription className="text-[10px] font-bold text-slate-400">Stage 0: Generate offer letter & profile.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-[11px] font-bold text-slate-700 ml-1">Full Name</Label>
                                    <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="rounded-xl h-10 border-slate-100 bg-slate-50/50" required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-[11px] font-bold text-slate-700 ml-1">Email Address</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="rounded-xl h-10 border-slate-100 bg-slate-50/50" required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="role" className="text-[11px] font-bold text-slate-700 ml-1">Role</Label>
                                    <Input id="role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="rounded-xl h-10 border-slate-100 bg-slate-50/50" required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="dept" className="text-[11px] font-bold text-slate-700 ml-1">Department</Label>
                                    <Input id="dept" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="rounded-xl h-10 border-slate-100 bg-slate-50/50" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="salary" className="text-[11px] font-bold text-slate-700 ml-1">Annual CTC (₹)</Label>
                                    <Input id="salary" placeholder="e.g. 12,00,000" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} className="rounded-xl h-10 border-slate-100 bg-slate-50/50" required />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="date" className="text-[11px] font-bold text-slate-700 ml-1">Expected Joining</Label>
                                    <Input id="date" type="date" value={formData.joiningDate} onChange={e => setFormData({ ...formData, joiningDate: e.target.value })} className="rounded-xl h-10 border-slate-100 bg-slate-50/50" />
                                </div>
                            </div>
                            <DialogFooter className="mt-4">
                                <Button type="submit" className="w-full bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-11 shadow-lg shadow-purple-100">Generate Title Draft</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} relative overflow-hidden transition-all hover:shadow-md`}>
                            <CardContent className="p-5 flex items-center justify-between relative z-10">
                                <div className="space-y-0.5">
                                    <p className={`text-[10px] font-bold ${stat.textColor || 'text-white/80'}`}>{stat.label}</p>
                                    <h3 className={`text-2xl font-bold ${stat.textColor || 'text-white'}`}>{stat.value}</h3>
                                </div>
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-sm`}>{stat.icon}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Candidates Pipeline */}
            <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-900">Stage 1 Pipeline</h2>
                    <div className="flex items-center gap-3">
                        <select
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                            className="h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-[10px] font-bold text-slate-600 outline-none hover:bg-white"
                        >
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <Input placeholder="Search..." className="pl-4 rounded-lg bg-white border border-slate-200 h-9 text-xs w-64 font-bold" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    <AnimatePresence>
                        {filteredCandidates.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest opacity-50">No candidates found matching criteria.</motion.div>
                        ) : (
                            filteredCandidates.map(c => {
                                const days = getDaysToJoin(c.joiningDate);
                                const progress = c.status === 'Ready to Join' ? 100 : c.status === 'BGV Verified' ? 80 : c.status === 'BGV In-Progress' ? 50 : c.status === 'Offer Accepted' ? 30 : 10;
                                return (
                                    <motion.div
                                        key={c.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="p-4 hover:bg-slate-50/50 transition-all group"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div className="flex gap-4 items-center flex-1">
                                                <Avatar className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-500 font-bold text-base border border-indigo-100"><AvatarFallback>{c.avatar}</AvatarFallback></Avatar>
                                                <div className="min-w-[150px]">
                                                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">{toTitleCase(c.name)}</h3>
                                                    <p className="text-[10px] text-slate-400 font-bold">{toTitleCase(c.role)} • {toTitleCase(c.department)}</p>
                                                </div>
                                                <div className="hidden lg:flex flex-col gap-1 w-40">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-bold text-slate-400">Onboarding progress</span>
                                                        <span className="text-[10px] font-bold text-indigo-500">{progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-indigo-500 rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="hidden xl:block">
                                                    {days !== null && (
                                                        <Badge variant="outline" className={`border-none font-bold text-[9px] px-2 py-0.5 rounded-full ${days <= 3 ? 'bg-rose-50 text-rose-500' : days <= 7 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                                                            {days <= 0 ? 'Joining Today' : `Joining in ${days} days`}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className={`border-none font-bold text-[9px] px-2 py-0.5 rounded-md ${c.status === 'Offer Pending' ? 'bg-slate-50 text-slate-400' : c.status === 'Offer Accepted' ? 'bg-indigo-50 text-indigo-500' : c.status === 'Ready to Join' ? 'bg-emerald-50 text-emerald-500' : c.status === 'Offer Rejected' ? 'bg-rose-50 text-rose-500' : c.status === 'BGV In-Progress' ? 'bg-amber-50 text-amber-600' : 'bg-pink-50 text-pink-500'}`}>
                                                    {toTitleCase(c.status)}
                                                </Badge>
                                                <div className="h-4 w-px bg-slate-100 mx-1" />
                                                <div className="flex items-center gap-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-lg" onClick={() => handleDeleteCandidate(c.id, c.name)}><Trash2 size={14} /></Button>
                                                    {c.status === 'Offer Pending' && (
                                                        <div className="flex gap-2">
                                                            <Button size="sm" variant="ghost" className="h-8 px-2.5 rounded-lg text-slate-400 hover:text-indigo-600 font-bold text-[10px]" onClick={() => handleOpenCandidateView(c.id)}><ExternalLink className="mr-1.5 h-3 w-3" /> View Offer</Button>
                                                            <Button size="sm" variant="outline" className="h-8 px-2.5 rounded-lg border-slate-100 font-bold text-[10px]" onClick={() => handleSendOffer(c.id, c.name)}><Mail className="mr-1.5 h-3 w-3" /> Resend</Button>
                                                        </div>
                                                    )}
                                                    {c.status === 'Offer Accepted' && <Button size="sm" variant="outline" className="h-8 px-3 rounded-lg border-amber-100 bg-amber-50/50 hover:bg-amber-100 text-amber-700 font-bold text-[10px]" onClick={() => handleInitiateBGV(c.id)}><ShieldCheck className="mr-1.5 h-3 w-3" /> Start BGV</Button>}
                                                    {c.status === 'BGV In-Progress' && <Button size="sm" className="h-8 px-3 bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-lg font-bold text-[10px]" onClick={() => { setSelectedCandidateId(c.id); setIsBGVDialogOpen(true); }}><CheckCircle2 className="mr-1.5 h-3 w-3" /> Review</Button>}
                                                    {c.status === 'BGV Verified' && <Button size="sm" className="h-8 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px]" onClick={() => handleMarkReady(c.id)}><CheckCircle2 className="mr-1.5 h-3 w-3" /> Mark Ready</Button>}
                                                    {c.status === 'Ready to Join' && <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8 px-4 font-bold shadow-md shadow-emerald-100 text-[10px]" onClick={() => moveToOnboarding(c.id, c.name)}>Move to Stage 2 <ArrowRight className="ml-1.5 h-3 w-3" /></Button>}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            </Card>

            {/* BGV Review Dialog */}
            <Dialog open={isBGVDialogOpen} onOpenChange={(open) => { setIsBGVDialogOpen(open); if (!open) setPreviewDoc(null); }}>
                <DialogContent className="bg-white rounded-[2rem] border-none shadow-2xl p-6 max-w-4xl">
                    <div className="flex gap-6 min-h-[400px]">
                        <div className="flex-1 space-y-4">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-slate-900">Verify Documents</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold text-slate-400">Review uploaded files for background verification.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2">
                                {["Aadhar Card", "PAN Card", "Degree Certificate", "Relieving Letter"].map((doc, i) => (
                                    <div key={i} className={`flex justify-between items-center p-2.5 rounded-xl border transition-all cursor-pointer ${previewDoc === doc ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`} onClick={() => setPreviewDoc(doc)}>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${previewDoc === doc ? 'bg-white text-indigo-500' : 'bg-indigo-50 text-indigo-500'}`}><FileText size={16} /></div>
                                            <div>
                                                <p className="font-bold text-xs text-slate-700">{doc}</p>
                                                <p className="text-[9px] text-slate-400 font-bold">Uploaded on 24 Jan</p>
                                            </div>
                                        </div>
                                        {previewDoc === doc && <div className="h-2 w-2 rounded-full bg-indigo-500" />}
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-10 shadow-md shadow-emerald-50 text-[11px]" onClick={() => { if (selectedCandidateId) handleVerifyBGV(selectedCandidateId); setIsBGVDialogOpen(false); }}><CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Verify</Button>
                                <Button variant="outline" onClick={() => setIsBGVDialogOpen(false)} className="rounded-xl font-bold border-slate-200 h-10 text-[11px] px-6">Reject</Button>
                            </div>
                        </div>
                        <div className="w-[450px] bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-8 text-center">
                            {previewDoc ? (
                                <div className="space-y-4 w-full">
                                    <div className="h-64 w-full bg-white rounded-lg shadow-inner flex items-center justify-center border border-slate-100"><FileSignature size={64} className="text-slate-100" /></div>
                                    <div>
                                        <p className="font-bold text-slate-600 text-sm">{previewDoc}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">Preview not available for mock file</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2 opacity-30">
                                    <Eye size={48} className="mx-auto" />
                                    <p className="font-bold text-xs">Select a document to preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PreOnboardingPage;
