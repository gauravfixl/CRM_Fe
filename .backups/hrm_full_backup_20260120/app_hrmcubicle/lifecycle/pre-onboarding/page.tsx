"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    UserPlus,
    FileText,
    ShieldCheck,
    CalendarCheck,
    Plus,
    CheckCircle2,
    Search,
    Send,
    ArrowRight,
    Mail,
    FileSignature,
    Loader2,
    XCircle,
    MoreHorizontal,
    ExternalLink,
    Eye,
    Trash2
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State for New Candidate
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        department: "Engineering",
        email: "",
        joiningDate: "",
        salary: "" // Now Used
    });

    // Stats Calculations
    const stats = [
        { label: "Pending Joinees", value: candidates.length, color: "bg-[#CB9DF0]", icon: <UserPlus className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Offer Sent", value: candidates.filter(c => c.status === 'Offer Pending').length, color: "bg-[#F0C1E1]", icon: <FileSignature className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "BGV In-Progress", value: candidates.filter(c => c.status === 'BGV In-Progress').length, color: "bg-[#FDDBBB]", icon: <ShieldCheck className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Ready to Join", value: candidates.filter(c => c.status === 'Ready to Join').length, color: "bg-[#FFF9BF]", icon: <CalendarCheck className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCand = {
            id: `C${Date.now()}`, // simple ID
            name: formData.name,
            role: formData.role,
            department: formData.department,
            email: formData.email,
            joiningDate: formData.joiningDate || "TBA",
            salary: formData.salary || "Not Disclosed", // Pass to store
            status: "Offer Pending" as const,
            bgvStatus: "Pending" as const,
            avatar: formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        };
        addCandidate(newCand);
        setFormData({ name: "", role: "", department: "Engineering", email: "", joiningDate: "", salary: "" });
        setIsDialogOpen(false);
        toast({ title: "Offer Generated", description: `Candidate added. Status: Offer Pending` });
    };

    // --- Actions for Workflow Steps ---

    const handleSendOffer = (id: string, name: string) => {
        toast({ title: "Offer Sent", description: `Email with offer link sent to ${name}.` });
    };

    const handleOpenCandidateView = (id: string) => {
        window.open(`/offer-view/${id}`, '_blank');
    };

    const handleDeleteCandidate = (id: string, name: string) => {
        removeCandidate(id);
        toast({
            title: "Candidate Removed",
            description: `${name} has been removed from the pipeline.`,
            variant: "destructive"
        });
    };

    const handleInitiateBGV = (id: string) => {
        updateCandidateStatus(id, "BGV In-Progress");
        toast({
            title: "BGV Initiated",
            description: "Request sent to verification partner. Status updated to In-Progress.",
            className: "bg-blue-50 border-blue-200 text-blue-800"
        });
    };

    const handleVerifyBGV = (id: string) => {
        updateCandidateStatus(id, "BGV Verified");
        toast({ title: "BGV Verified", description: "Background check passed." });
    };

    const handleMarkReady = (id: string) => {
        updateCandidateStatus(id, "Ready to Join");
        toast({
            title: "Ready for Day 1",
            description: "All pre-joining checks completed. Candidate ready for Onboarding.",
            className: "bg-emerald-50 border-emerald-200 text-emerald-800"
        });
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pre-Onboarding</h1>
                    <p className="text-slate-500 font-medium text-sm mt-1">Stage 1: From Offer Rollout to Joining Day.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-6 shadow-xl shadow-indigo-200 font-bold">
                            <Plus className="mr-2 h-5 w-5" /> Create Offer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-[2rem] border-none shadow-2xl p-8 max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-slate-900">New Candidate Offer</DialogTitle>
                            <DialogDescription>Stage 0: Generate offer letter & profile.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="rounded-xl" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="rounded-xl" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input id="role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="rounded-xl" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dept">Department</Label>
                                    <Input id="dept" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="rounded-xl" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="salary">Annual CTC (₹)</Label>
                                    <Input id="salary" placeholder="e.g. 12,00,000" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} className="rounded-xl" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Expected Joining</Label>
                                    <Input id="date" type="date" value={formData.joiningDate} onChange={e => setFormData({ ...formData, joiningDate: e.target.value })} className="rounded-xl" />
                                </div>
                            </div>

                            <DialogFooter className="mt-6">
                                <Button type="submit" className="w-full bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-12">Generate Offer</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} relative overflow-hidden`}>
                            <CardContent className="p-6 flex items-center justify-between relative z-10">
                                <div>
                                    <p className={`text-xs font-bold uppercase tracking-wider ${stat.textColor || 'text-white/80'}`}>{stat.label}</p>
                                    <h3 className={`text-4xl font-black mt-1 ${stat.textColor || 'text-white'}`}>{stat.value}</h3>
                                </div>
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-sm`}>{stat.icon}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Candidates Pipeline */}
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] bg-white overflow-hidden min-h-[500px]">
                <div className="p-8 border-b border-slate-50 flex justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-900">Stage 1 Pipeline</h2>
                    <Input placeholder="Search..." className="pl-4 rounded-xl bg-slate-50 border-none w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>

                <div className="divide-y divide-slate-50">
                    {candidates.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 font-medium">Pipeline is empty. Start by creating an offer.</div>
                    ) : candidates.map(c => (
                        <div key={c.id} className="p-6 hover:bg-slate-50/50 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div className="flex gap-4 items-center">
                                    <Avatar className="h-14 w-14 rounded-2xl bg-[#CB9DF0] text-white font-bold text-lg"><AvatarFallback>{c.avatar}</AvatarFallback></Avatar>
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">{c.name}</h3>
                                        <p className="text-sm text-slate-500 font-bold">{c.role} • {c.department}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge className={`border-none font-bold ${c.status === 'Offer Pending' ? 'bg-slate-100 text-slate-500' :
                                                c.status === 'Offer Accepted' ? 'bg-[#CB9DF0] text-white' :
                                                    c.status === 'Ready to Join' ? 'bg-emerald-100 text-emerald-700' :
                                                        c.status === 'BGV In-Progress' ? 'bg-[#FDDBBB] text-amber-900' :
                                                            'bg-[#F0C1E1] text-rose-700'
                                                }`}>
                                                {c.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* DELETE BUTTON */}
                                    <Button
                                        size="icon" variant="ghost"
                                        className="h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
                                        onClick={() => handleDeleteCandidate(c.id, c.name)}
                                        title="Remove Candidate"
                                    >
                                        <Trash2 size={18} />
                                    </Button>

                                    {/* Link for Candidate View Simulation */}
                                    {c.status === 'Offer Pending' && (
                                        <Button
                                            size="sm" variant="outline"
                                            className="rounded-xl border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 font-bold"
                                            onClick={() => handleOpenCandidateView(c.id)}
                                            title="Simulate Candidate View"
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" /> View Offer Link
                                        </Button>
                                    )}

                                    {/* Action Buttons */}
                                    {c.status === 'Offer Pending' && (
                                        <Button size="sm" variant="outline" className="rounded-xl border-slate-200 font-bold" onClick={() => handleSendOffer(c.id, c.name)}>
                                            <Mail className="mr-2 h-4 w-4" /> Resend Mail
                                        </Button>
                                    )}

                                    {c.status === 'Offer Accepted' && (
                                        <Button size="sm" variant="outline" className="rounded-xl border-slate-200 font-bold bg-amber-50 hover:bg-amber-100 text-amber-800" onClick={() => handleInitiateBGV(c.id)}>
                                            <ShieldCheck className="mr-2 h-4 w-4" /> Start BGV
                                        </Button>
                                    )}

                                    {c.status === 'BGV In-Progress' && (
                                        <Button size="sm" className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl font-bold" onClick={() => handleVerifyBGV(c.id)}>
                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Verify BGV
                                        </Button>
                                    )}

                                    {c.status === 'BGV Verified' && (
                                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold" onClick={() => handleMarkReady(c.id)}>
                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Finalize Joining
                                        </Button>
                                    )}

                                    {c.status === 'Ready to Join' && (
                                        <Button
                                            size="sm"
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-10 px-6 font-bold shadow-lg shadow-emerald-200"
                                            onClick={() => moveToOnboarding(c.id, c.name)}
                                        >
                                            Move to Stage 2 <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default PreOnboardingPage;
