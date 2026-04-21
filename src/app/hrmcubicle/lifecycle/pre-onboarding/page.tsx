"use client"

import React, { useState, useEffect, useMemo } from "react";
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
    Eye,
    Trash2,
    Pencil,
    ThumbsUp,
    ThumbsDown,
    Search,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useLifecycleStore, type Candidate } from "@/shared/data/lifecycle-store";
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

const DEPT_OPTIONS = ["Engineering", "Design", "Product", "Marketing", "Sales", "HR", "Finance", "Operations"];
const EMPTY_FORM = { name: "", role: "", department: "Engineering", email: "", joiningDate: "", salary: "" };

const PreOnboardingPage = () => {
    const { toast } = useToast();
    const { candidates, addCandidate, removeCandidate, updateCandidate, moveToOnboarding, updateCandidateStatus } = useLifecycleStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [deptFilter, setDeptFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isBGVOpen, setIsBGVOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<string | null>(null);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === 'lifecycle-storage-v2') useLifecycleStore.persist.rehydrate();
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    const toTitleCase = (str: string) =>
        str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const getDaysToJoin = (dateStr: string) => {
        if (!dateStr || dateStr === "TBA") return null;
        const diff = new Date(dateStr).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const selectedCandidate = useMemo(
        () => candidates.find(c => c.id === selectedId) || null,
        [candidates, selectedId]
    );

    const stats = [
        { label: "Pending Joiners", value: candidates.filter(c => c.status !== 'Offer Rejected').length, color: "bg-[#CB9DF0]", icon: <UserPlus className="text-slate-800" /> },
        { label: "Offer Sent", value: candidates.filter(c => c.status === 'Offer Pending').length, color: "bg-[#F0C1E1]", icon: <FileSignature className="text-slate-800" /> },
        { label: "BGV In Review", value: candidates.filter(c => c.status === 'BGV In-Progress' || c.status === 'BGV Verified').length, color: "bg-[#FDDBBB]", icon: <ShieldCheck className="text-slate-800" /> },
        { label: "Ready To Join", value: candidates.filter(c => c.status === 'Ready to Join').length, color: "bg-[#FFF9BF]", icon: <CalendarCheck className="text-slate-800" /> },
    ];

    const filteredCandidates = candidates.filter(c => {
        const q = searchTerm.toLowerCase();
        const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
        const matchesDept = deptFilter === "All" || c.department === deptFilter;
        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        return matchesSearch && matchesDept && matchesStatus;
    });

    const departments = ["All", ...Array.from(new Set(candidates.map(c => c.department)))];
    const statuses = ["All", "Offer Pending", "Offer Accepted", "Offer Rejected", "BGV In-Progress", "BGV Verified", "Ready to Join"];

    const validateForm = () => {
        const errs: Record<string, string> = {};
        if (!formData.name.trim()) errs.name = "Name is required";
        if (!formData.email.trim()) errs.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email";
        if (!formData.role.trim()) errs.role = "Role is required";
        if (!formData.salary.trim()) errs.salary = "CTC is required";
        if (formData.joiningDate) {
            const d = new Date(formData.joiningDate);
            if (isNaN(d.getTime())) errs.joiningDate = "Invalid date";
        }
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const openCreate = () => {
        setFormData(EMPTY_FORM);
        setFormErrors({});
        setIsCreateOpen(true);
    };

    const openEdit = (c: Candidate) => {
        setSelectedId(c.id);
        setFormData({
            name: c.name,
            role: c.role,
            department: c.department,
            email: c.email,
            joiningDate: c.joiningDate === "TBA" ? "" : c.joiningDate,
            salary: c.salary,
        });
        setFormErrors({});
        setIsEditOpen(true);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        const newCand: Candidate = {
            id: `C${Date.now()}`,
            name: formData.name.trim(),
            role: formData.role.trim(),
            department: formData.department,
            email: formData.email.trim(),
            joiningDate: formData.joiningDate || "TBA",
            salary: formData.salary || "Not Disclosed",
            status: "Offer Pending",
            bgvStatus: "Pending",
            avatar: formData.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        };
        addCandidate(newCand);
        setIsCreateOpen(false);
        toast({ title: "Offer Generated", description: `${newCand.name} added. Status: Offer Pending.` });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !selectedId) return;
        updateCandidate(selectedId, {
            name: formData.name.trim(),
            role: formData.role.trim(),
            department: formData.department,
            email: formData.email.trim(),
            joiningDate: formData.joiningDate || "TBA",
            salary: formData.salary,
            avatar: formData.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        });
        setIsEditOpen(false);
        toast({ title: "Candidate Updated", description: "Profile saved successfully." });
    };

    const confirmDelete = () => {
        if (!selectedCandidate) return;
        removeCandidate(selectedCandidate.id);
        toast({ title: "Candidate Removed", description: `${selectedCandidate.name} removed from pipeline.`, variant: "destructive" });
        setIsDeleteOpen(false);
        setSelectedId(null);
    };

    const handleAcceptOffer = (id: string) => {
        updateCandidateStatus(id, "Offer Accepted");
        toast({ title: "Offer Accepted", description: "Candidate marked as accepted. You can now start BGV." });
    };

    const handleRejectOffer = (id: string) => {
        updateCandidateStatus(id, "Offer Rejected");
        toast({ title: "Offer Rejected", description: "Candidate status updated to rejected." });
    };

    const handleResend = (name: string) => {
        toast({ title: "Offer Resent", description: `Offer email re-delivered to ${name}.` });
    };

    const handleStartBGV = (id: string) => {
        updateCandidate(id, { status: "BGV In-Progress", bgvStatus: "Pending" });
        toast({ title: "BGV Initiated", description: "Background verification started." });
    };

    const handleApproveBGV = () => {
        if (!selectedId) return;
        updateCandidate(selectedId, { status: "BGV Verified", bgvStatus: "Approved" });
        toast({ title: "BGV Verified", description: "Background check approved." });
        setIsBGVOpen(false);
        setPreviewDoc(null);
    };

    const handleRejectBGV = () => {
        if (!selectedId) return;
        updateCandidate(selectedId, { status: "Offer Rejected", bgvStatus: "Rejected" });
        toast({ title: "BGV Rejected", description: "Candidate offer has been rejected.", variant: "destructive" });
        setIsBGVOpen(false);
        setPreviewDoc(null);
    };

    const handleMarkReady = (id: string) => {
        updateCandidateStatus(id, "Ready to Join");
        toast({ title: "Ready for Day 1", description: "Candidate ready for Onboarding." });
    };

    const handleMoveToOnboarding = (id: string, name: string) => {
        moveToOnboarding(id, name);
        toast({ title: "Moved to Onboarding", description: `${name} is now in Stage 2.` });
    };

    const statusBadgeClass = (s: Candidate['status']) => {
        switch (s) {
            case 'Offer Pending': return 'bg-slate-50 text-slate-500';
            case 'Offer Accepted': return 'bg-indigo-50 text-indigo-500';
            case 'Offer Rejected': return 'bg-rose-50 text-rose-500';
            case 'BGV In-Progress': return 'bg-amber-50 text-amber-600';
            case 'BGV Verified': return 'bg-pink-50 text-pink-500';
            case 'Ready to Join': return 'bg-emerald-50 text-emerald-500';
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-4 space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pre-Onboarding</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Stage 1: From offer rollout to joining day.</p>
                </div>
                <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-9 px-4 shadow-lg shadow-indigo-100 font-bold text-[10px]">
                    <Plus className="mr-2 h-4 w-4" /> Create Offer
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-sm rounded-2xl ${stat.color} relative overflow-hidden transition-all hover:shadow-md`}>
                            <CardContent className="p-5 flex items-center justify-between relative z-10">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-900">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-sm">{stat.icon}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Pipeline */}
            <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white overflow-hidden">
                <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900">Stage 1 Pipeline</h2>
                    <div className="flex flex-wrap items-center gap-2">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-[10px] font-bold text-slate-600 outline-none hover:bg-white">
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-[10px] font-bold text-slate-600 outline-none hover:bg-white">
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input placeholder="Search name, email, role..." className="pl-8 rounded-lg bg-white border border-slate-200 h-9 text-xs w-64 font-bold" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    <AnimatePresence>
                        {filteredCandidates.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 text-center">
                                <UserPlus className="mx-auto h-10 w-10 text-slate-200 mb-3" />
                                <p className="text-slate-400 font-bold text-xs">{candidates.length === 0 ? 'No candidates yet. Create your first offer.' : 'No candidates match your filters.'}</p>
                                {candidates.length > 0 && (searchTerm || deptFilter !== 'All' || statusFilter !== 'All') && (
                                    <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setDeptFilter('All'); setStatusFilter('All'); }} className="mt-3 text-[10px] font-bold text-indigo-500 h-7">Clear filters</Button>
                                )}
                            </motion.div>
                        ) : (
                            filteredCandidates.map(c => {
                                const days = getDaysToJoin(c.joiningDate);
                                const progress = c.status === 'Ready to Join' ? 100 : c.status === 'BGV Verified' ? 80 : c.status === 'BGV In-Progress' ? 50 : c.status === 'Offer Accepted' ? 30 : c.status === 'Offer Rejected' ? 0 : 10;
                                return (
                                    <motion.div key={c.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-4 hover:bg-slate-50/50 transition-all group">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div className="flex gap-4 items-center flex-1">
                                                <Avatar className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-500 font-bold text-base border border-indigo-100"><AvatarFallback>{c.avatar}</AvatarFallback></Avatar>
                                                <div className="min-w-[150px]">
                                                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">{toTitleCase(c.name)}</h3>
                                                    <p className="text-[10px] text-slate-400 font-bold">{toTitleCase(c.role)} • {toTitleCase(c.department)}</p>
                                                </div>
                                                <div className="hidden lg:flex flex-col gap-1 w-40">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-bold text-slate-400">Progress</span>
                                                        <span className="text-[10px] font-bold text-indigo-500">{progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full rounded-full ${c.status === 'Offer Rejected' ? 'bg-rose-400' : 'bg-indigo-500'}`} />
                                                    </div>
                                                </div>
                                                <div className="hidden xl:block">
                                                    {days !== null && c.status !== 'Offer Rejected' && (
                                                        <Badge variant="outline" className={`border-none font-bold text-[9px] px-2 py-0.5 rounded-full ${days <= 3 ? 'bg-rose-50 text-rose-500' : days <= 7 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                                                            {days <= 0 ? 'Joining Today' : `Joining in ${days} days`}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                                <Badge variant="outline" className={`border-none font-bold text-[9px] px-2 py-0.5 rounded-md ${statusBadgeClass(c.status)}`}>
                                                    {toTitleCase(c.status)}
                                                </Badge>
                                                <div className="h-4 w-px bg-slate-100 mx-1" />
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="View details" onClick={() => { setSelectedId(c.id); setIsViewOpen(true); }}><Eye size={14} /></Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Edit" onClick={() => openEdit(c)}><Pencil size={14} /></Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg" title="Delete" onClick={() => { setSelectedId(c.id); setIsDeleteOpen(true); }}><Trash2 size={14} /></Button>

                                                {c.status === 'Offer Pending' && (
                                                    <>
                                                        <Button size="sm" variant="outline" className="h-8 px-2.5 rounded-lg border-slate-200 font-bold text-[10px]" onClick={() => handleResend(c.name)}><Mail className="mr-1.5 h-3 w-3" /> Resend</Button>
                                                        <Button size="sm" variant="outline" className="h-8 px-2.5 rounded-lg border-rose-100 bg-rose-50/50 hover:bg-rose-100 text-rose-600 font-bold text-[10px]" onClick={() => handleRejectOffer(c.id)}><ThumbsDown className="mr-1.5 h-3 w-3" /> Reject</Button>
                                                        <Button size="sm" className="h-8 px-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold text-[10px]" onClick={() => handleAcceptOffer(c.id)}><ThumbsUp className="mr-1.5 h-3 w-3" /> Accept</Button>
                                                    </>
                                                )}
                                                {c.status === 'Offer Accepted' && (
                                                    <Button size="sm" variant="outline" className="h-8 px-3 rounded-lg border-amber-100 bg-amber-50/50 hover:bg-amber-100 text-amber-700 font-bold text-[10px]" onClick={() => handleStartBGV(c.id)}><ShieldCheck className="mr-1.5 h-3 w-3" /> Start BGV</Button>
                                                )}
                                                {c.status === 'BGV In-Progress' && (
                                                    <Button size="sm" className="h-8 px-3 bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-lg font-bold text-[10px]" onClick={() => { setSelectedId(c.id); setIsBGVOpen(true); }}><CheckCircle2 className="mr-1.5 h-3 w-3" /> Review</Button>
                                                )}
                                                {c.status === 'BGV Verified' && (
                                                    <Button size="sm" className="h-8 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px]" onClick={() => handleMarkReady(c.id)}><CheckCircle2 className="mr-1.5 h-3 w-3" /> Mark Ready</Button>
                                                )}
                                                {c.status === 'Ready to Join' && (
                                                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-8 px-4 font-bold shadow-md shadow-emerald-100 text-[10px]" onClick={() => handleMoveToOnboarding(c.id, c.name)}>Move to Stage 2 <ArrowRight className="ml-1.5 h-3 w-3" /></Button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            </Card>

            {/* Create / Edit shared form dialog content */}
            {(isCreateOpen || isEditOpen) && (
                <Dialog open={isCreateOpen || isEditOpen} onOpenChange={(o) => { if (!o) { setIsCreateOpen(false); setIsEditOpen(false); } }}>
                    <DialogContent className="bg-white rounded-[2rem] border-2 border-slate-200 shadow-2xl p-8 max-w-3xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">{isEditOpen ? 'Edit Candidate' : 'New Candidate Offer'}</DialogTitle>
                            <DialogDescription className="text-[10px] font-bold text-slate-400">{isEditOpen ? 'Update candidate details.' : 'Stage 0: Generate offer letter & profile.'}</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={isEditOpen ? handleEdit : handleCreate} className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-[11px] font-bold text-slate-700 ml-1">Full Name</Label>
                                    <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="rounded-xl h-10 border-slate-100 bg-slate-50/50" />
                                    {formErrors.name && <p className="text-[10px] font-bold text-rose-500 ml-1">{formErrors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-[11px] font-bold text-slate-700 ml-1">Email Address</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="rounded-xl h-10 border-slate-100 bg-slate-50/50" />
                                    {formErrors.email && <p className="text-[10px] font-bold text-rose-500 ml-1">{formErrors.email}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="role" className="text-[11px] font-bold text-slate-700 ml-1">Role</Label>
                                    <Input id="role" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="rounded-xl h-10 border-slate-100 bg-slate-50/50" />
                                    {formErrors.role && <p className="text-[10px] font-bold text-rose-500 ml-1">{formErrors.role}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="dept" className="text-[11px] font-bold text-slate-700 ml-1">Department</Label>
                                    <select id="dept" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full rounded-xl h-10 border border-slate-100 bg-slate-50/50 px-3 text-xs font-bold text-slate-700 outline-none">
                                        {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="salary" className="text-[11px] font-bold text-slate-700 ml-1">Annual CTC (₹)</Label>
                                    <Input id="salary" placeholder="e.g. 12,00,000" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} className="rounded-xl h-10 border-slate-100 bg-slate-50/50" />
                                    {formErrors.salary && <p className="text-[10px] font-bold text-rose-500 ml-1">{formErrors.salary}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="date" className="text-[11px] font-bold text-slate-700 ml-1">Expected Joining</Label>
                                    <Input id="date" type="date" value={formData.joiningDate} onChange={e => setFormData({ ...formData, joiningDate: e.target.value })} className="rounded-xl h-10 border-slate-100 bg-slate-50/50" />
                                    {formErrors.joiningDate && <p className="text-[10px] font-bold text-rose-500 ml-1">{formErrors.joiningDate}</p>}
                                </div>
                            </div>
                            <DialogFooter className="mt-4 flex gap-2">
                                <Button type="button" variant="outline" onClick={() => { setIsCreateOpen(false); setIsEditOpen(false); }} className="rounded-xl h-11 px-6 font-bold border-slate-200 text-xs">Cancel</Button>
                                <Button type="submit" className="flex-1 bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-11 shadow-lg shadow-purple-100">{isEditOpen ? 'Save Changes' : 'Generate Offer'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 shadow-2xl p-6 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Remove Candidate?</DialogTitle>
                        <DialogDescription className="text-xs font-bold text-slate-400">
                            {selectedCandidate ? `This will permanently remove ${selectedCandidate.name} from the pipeline. This action cannot be undone.` : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-xl h-10 font-bold border-slate-200 text-xs">Cancel</Button>
                        <Button onClick={confirmDelete} className="bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-10 text-xs">Yes, Remove</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Offer Details */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="bg-white rounded-2xl border-2 border-slate-200 shadow-2xl p-6 max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900">Offer Details</DialogTitle>
                        <DialogDescription className="text-[10px] font-bold text-slate-400">Preview the generated offer letter.</DialogDescription>
                    </DialogHeader>
                    {selectedCandidate && (
                        <div className="space-y-3 py-2">
                            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                                <Avatar className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-500 font-bold border border-indigo-100"><AvatarFallback>{selectedCandidate.avatar}</AvatarFallback></Avatar>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{selectedCandidate.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400">{selectedCandidate.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div><p className="text-[10px] font-bold text-slate-400">Role</p><p className="font-bold text-slate-800">{selectedCandidate.role}</p></div>
                                <div><p className="text-[10px] font-bold text-slate-400">Department</p><p className="font-bold text-slate-800">{selectedCandidate.department}</p></div>
                                <div><p className="text-[10px] font-bold text-slate-400">Annual CTC</p><p className="font-bold text-slate-800">{selectedCandidate.salary}</p></div>
                                <div><p className="text-[10px] font-bold text-slate-400">Joining Date</p><p className="font-bold text-slate-800">{selectedCandidate.joiningDate}</p></div>
                                <div><p className="text-[10px] font-bold text-slate-400">Offer Status</p><Badge variant="outline" className={`border-none font-bold text-[9px] px-2 py-0.5 rounded-md ${statusBadgeClass(selectedCandidate.status)}`}>{selectedCandidate.status}</Badge></div>
                                <div><p className="text-[10px] font-bold text-slate-400">BGV Status</p><p className="font-bold text-slate-800">{selectedCandidate.bgvStatus}</p></div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsViewOpen(false)} className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white font-bold rounded-xl h-10 w-full text-xs">Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* BGV Review Dialog */}
            <Dialog open={isBGVOpen} onOpenChange={(o) => { setIsBGVOpen(o); if (!o) setPreviewDoc(null); }}>
                <DialogContent className="bg-white rounded-[2rem] border-2 border-slate-200 shadow-2xl p-6 max-w-4xl">
                    <div className="flex flex-col lg:flex-row gap-6 min-h-[400px]">
                        <div className="flex-1 space-y-4">
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-slate-900">Verify Documents</DialogTitle>
                                <DialogDescription className="text-[10px] font-bold text-slate-400">
                                    {selectedCandidate ? `Reviewing documents for ${selectedCandidate.name}.` : 'Review uploaded files.'}
                                </DialogDescription>
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
                                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-10 shadow-md shadow-emerald-50 text-[11px]" onClick={handleApproveBGV}><CheckCircle2 className="mr-2 h-4 w-4" /> Approve & Verify</Button>
                                <Button variant="outline" onClick={handleRejectBGV} className="rounded-xl font-bold border-rose-200 text-rose-600 hover:bg-rose-50 h-10 text-[11px] px-6"><XCircle className="mr-2 h-4 w-4" /> Reject</Button>
                            </div>
                        </div>
                        <div className="w-full lg:w-[450px] bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-8 text-center">
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
