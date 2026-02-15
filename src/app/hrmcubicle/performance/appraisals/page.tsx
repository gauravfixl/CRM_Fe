"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    Rocket,
    Timer,
    CheckCircle2,
    Search,
    ChevronRight,
    User,
    Calendar,
    ArrowRight,
    TrendingUp,
    ShieldCheck,
    MoreVertical,
    Download,
    Eye,
    Zap,
    Users,
    Activity,
    FileText,
    History,
    Percent,
    Award
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePerformanceStore, type Appraisal } from "@/shared/data/performance-store";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs";
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
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

const PerformanceAppraisalsPage = () => {
    const { toast } = useToast();
    const { appraisals, addAppraisal, updateAppraisal } = usePerformanceStore();

    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLaunchOpen, setIsLaunchOpen] = useState(false);
    const [activeAppraisal, setActiveAppraisal] = useState<Appraisal | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const [formData, setFormData] = useState({
        employeeName: "",
        employeeId: "",
        employeeAvatar: "",
        cycle: "Annual Appraisal 2026"
    });

    const [reviewData, setReviewData] = useState({
        proposedIncrement: "",
        proposedPromotion: "",
        hrNotes: "",
        status: "Manager Review" as Appraisal['status']
    });

    const handleLaunch = () => {
        if (!formData.employeeName || !formData.employeeId) {
            toast({ title: "Error", description: "Identity fields are required", variant: "destructive" });
            return;
        }
        addAppraisal({
            ...formData,
            employeeAvatar: formData.employeeName.charAt(0)
        });
        toast({ title: "Cycle Initialized", description: `Framework deployed for ${formData.employeeName}.` });
        setIsLaunchOpen(false);
        setFormData({ employeeName: "", employeeId: "", employeeAvatar: "", cycle: "Annual Appraisal 2026" });
    };

    const handleUpdateReview = () => {
        if (activeAppraisal) {
            updateAppraisal(activeAppraisal.id, reviewData);
            toast({ title: "Audit Updated", description: "Mapping and notes saved successfully." });
            setIsReviewOpen(false);
        }
    };

    const getStatusStyles = (status: Appraisal['status']) => {
        const styles = {
            'Draft': 'bg-slate-100 text-slate-500 border-slate-200',
            'Self Review': 'bg-blue-50 text-blue-600 border-blue-100',
            'Manager Review': 'bg-purple-50 text-purple-600 border-purple-100',
            'HR Review': 'bg-amber-50 text-amber-600 border-amber-100',
            'Calibration': 'bg-rose-50 text-rose-600 border-rose-100',
            'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100'
        };
        return styles[status] || styles['Draft'];
    };

    const filteredAppraisals = appraisals.filter(a => {
        const matchesSearch = a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || a.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || a.status.toLowerCase().replace(' ', '-') === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans" style={{ zoom: "80%" }}>
            <header className="py-2.5 px-8 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm rounded-b-3xl">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1 text-start">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Appraisals & Increments</h1>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none font-bold text-[10px] uppercase tracking-widest h-6 px-3">HR MASTER CONTROL</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-semibold">Manage end-to-end evaluation cycles, calibration, and promotion mapping.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => setIsLaunchOpen(true)}
                            className="bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100 transition-all gap-2 text-[10px] tracking-widest border-none"
                        >
                            <Rocket size={16} /> Deploy Appraisal Cycle
                        </Button>
                    </div>
                </div>
            </header>

            <main className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="rounded-3xl border border-indigo-100 bg-indigo-50 p-7 shadow-sm flex flex-col justify-between text-start group hover:shadow-md transition-all">
                        <p className="text-[10px] font-bold text-indigo-400 tracking-widest leading-none">Global Completion</p>
                        <h3 className="text-4xl font-black tracking-tight text-indigo-700">72%</h3>
                        <div className="h-1.5 w-full bg-indigo-200/50 rounded-full overflow-hidden mt-4">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: '72%' }} />
                        </div>
                    </Card>

                    <Card className="rounded-3xl border border-amber-100 bg-amber-50 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-amber-500 tracking-widest">In HR Review</p>
                            <h3 className="text-4xl font-black text-amber-700 tracking-tight">{appraisals.filter(a => a.status === 'HR Review').length}</h3>
                            <p className="text-[9px] font-bold text-amber-500/60 tracking-tight">Awaiting Final Signoff</p>
                        </div>
                    </Card>

                    <Card className="rounded-3xl border border-rose-100 bg-rose-50 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-rose-500 tracking-widest">In Calibration</p>
                            <h3 className="text-4xl font-black text-rose-700 tracking-tight">{appraisals.filter(a => a.status === 'Calibration').length}</h3>
                            <p className="text-[9px] font-bold text-rose-500/60 tracking-tight">Manager Audit Logic</p>
                        </div>
                    </Card>

                    <Card className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 flex flex-col justify-between text-start shadow-sm group hover:shadow-md transition-all">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-emerald-500 tracking-widest">Avg. Rating Scored</p>
                            <h3 className="text-4xl font-black text-emerald-700 tracking-tight">4.3</h3>
                            <p className="text-[9px] font-bold text-emerald-500/60 tracking-tight">Company Benchmark</p>
                        </div>
                    </Card>
                </div>

                <div className="space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-slate-50 border border-slate-100 p-1 rounded-2xl h-12 flex items-center">
                            <TabsList className="bg-transparent border-none gap-1">
                                <TabsTrigger value="all" className="rounded-xl px-5 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 shadow-none">Overview</TabsTrigger>
                                <TabsTrigger value="hr-review" className="rounded-xl px-5 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 shadow-none">HR Review</TabsTrigger>
                                <TabsTrigger value="calibration" className="rounded-xl px-5 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 shadow-none">Calibration</TabsTrigger>
                                <TabsTrigger value="completed" className="rounded-xl px-5 font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-indigo-600 shadow-none">Completed</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="relative group flex-1 max-w-sm">
                            <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                            <Input
                                placeholder="Search by name or ID..."
                                className="pl-11 h-12 rounded-xl bg-white border-slate-100 shadow-sm font-semibold text-sm focus-visible:ring-indigo-100"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        <div className="grid grid-cols-1 gap-4">
                            {filteredAppraisals.map((appraisal, i) => (
                                <motion.div
                                    key={appraisal.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="group border border-slate-100 shadow-sm hover:shadow-xl transition-all rounded-3xl bg-white overflow-hidden p-0 ring-1 ring-slate-100/50">
                                        <div className="flex flex-col lg:flex-row">
                                            <div className="p-6 lg:w-72 shrink-0 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-50 bg-slate-50/20 text-start">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12 border-2 border-white shadow-md ring-1 ring-slate-100 overflow-hidden rounded-xl">
                                                        <AvatarFallback className="bg-slate-900 text-white font-bold text-sm">{appraisal.employeeAvatar}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-slate-900 truncate tracking-tight text-xs leading-none">{appraisal.employeeName}</h4>
                                                        <p className="text-[9px] text-slate-400 font-bold tracking-widest mt-1">{appraisal.employeeId}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-6 space-y-3">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[8px] font-bold text-slate-300 tracking-widest">Active Cycle</p>
                                                        <p className="text-[10px] font-bold text-slate-600 italic leading-tight tracking-tight">{appraisal.cycle}</p>
                                                    </div>
                                                    {appraisal.proposedIncrement && (
                                                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100 w-fit">
                                                            <Percent size={12} className="text-emerald-600" />
                                                            <span className="text-[9px] font-bold text-emerald-900">PROPOSED: {appraisal.proposedIncrement}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex-1 p-6 space-y-5 text-start">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Badge className={`border-none font-bold text-[9px] h-6 px-3 rounded-lg tracking-widest shadow-sm ${getStatusStyles(appraisal.status)}`}>
                                                            {appraisal.status}
                                                        </Badge>
                                                        <span className="text-[9px] text-slate-300 font-bold tracking-widest italic flex items-center gap-1.5">
                                                            <Calendar size={12} className="text-slate-200" /> Last Touch: {new Date(appraisal.lastUpdated).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {appraisal.overallRating && (
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-xl border border-amber-100">
                                                            <Star size={12} className="text-amber-500 fill-amber-500" />
                                                            <span className="text-xs font-bold text-amber-900">{appraisal.overallRating}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 py-1">
                                                    {appraisal.competencies.map((comp, ci) => (
                                                        <div key={ci} className="space-y-1.5">
                                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{comp.name}</p>
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3, 4, 5].map(s => <div key={s} className={`h-1 flex-1 rounded-full ${s <= comp.rating ? 'bg-indigo-500' : 'bg-slate-100'}`} />)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <Button variant="ghost" className="text-slate-400 hover:text-indigo-600 font-bold text-[10px] gap-2 uppercase tracking-widest border-none h-8"><Download size={12} /> PDF Draft</Button>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            className="bg-slate-900 hover:bg-indigo-600 text-white rounded-xl h-10 px-6 font-bold text-[10px] gap-2 transition-all uppercase tracking-widest border-none shadow-md shadow-slate-100"
                                                            onClick={() => {
                                                                setActiveAppraisal(appraisal);
                                                                setReviewData({
                                                                    proposedIncrement: appraisal.proposedIncrement || "",
                                                                    proposedPromotion: appraisal.proposedPromotion || "",
                                                                    hrNotes: appraisal.hrNotes || "",
                                                                    status: appraisal.status
                                                                });
                                                                setIsReviewOpen(true);
                                                            }}
                                                        >
                                                            <ShieldCheck size={14} /> HR Master Audit
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Audit Dialog */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-2xl shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="space-y-3">
                        <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2 shadow-inner border border-indigo-100">
                            <Award size={28} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 uppercase">HR Master Audit & Mapping</DialogTitle>
                        <DialogDescription className="text-slate-500 font-semibold text-sm">Finalize rating, propose increments, and select promotion tracks.</DialogDescription>
                    </DialogHeader>

                    <div className="py-8 space-y-5 text-start">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Proposed Increment (%)</Label>
                                <Input
                                    className="rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm"
                                    placeholder="e.g. 10%"
                                    value={reviewData.proposedIncrement}
                                    onChange={(e) => setReviewData({ ...reviewData, proposedIncrement: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Proposed Promotion</Label>
                                <Input
                                    className="rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm"
                                    placeholder="e.g. Senior Lead"
                                    value={reviewData.proposedPromotion}
                                    onChange={(e) => setReviewData({ ...reviewData, proposedPromotion: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Workflow Status</Label>
                            <Select value={reviewData.status} onValueChange={(v) => setReviewData({ ...reviewData, status: v as any })}>
                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl p-1.5 font-bold">
                                    <SelectItem value="Manager Review" className="rounded-lg h-10 text-[11px] uppercase tracking-wide">With Manager</SelectItem>
                                    <SelectItem value="HR Review" className="rounded-lg h-10 text-[11px] uppercase tracking-wide">With HR Auditor</SelectItem>
                                    <SelectItem value="Calibration" className="rounded-lg h-10 text-[11px] uppercase tracking-wide">In Calibration</SelectItem>
                                    <SelectItem value="Completed" className="rounded-lg h-10 text-[11px] uppercase tracking-wide">Finalized</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Audit Notes</Label>
                            <Textarea
                                className="rounded-2xl bg-slate-50 border-slate-100 min-h-[100px] p-5 font-semibold text-sm focus:bg-white transition-all shadow-inner"
                                placeholder="Confidential summary..."
                                value={reviewData.hrNotes}
                                onChange={(e) => setReviewData({ ...reviewData, hrNotes: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-50 sm:justify-start">
                        <Button className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 font-bold text-[11px] uppercase tracking-widest shadow-xl transition-all border-none" onClick={handleUpdateReview}>
                            Commit Audit Decision
                        </Button>
                        <Button variant="ghost" className="h-12 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-400" onClick={() => setIsReviewOpen(false)}>Discard</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Launch Dialog */}
            <Dialog open={isLaunchOpen} onOpenChange={setIsLaunchOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-2xl shadow-3xl font-sans" style={{ zoom: "80%" }}>
                    <DialogHeader className="space-y-3">
                        <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-2 shadow-inner border border-purple-100">
                            <Rocket size={26} />
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-slate-900 uppercase">Initiate Appraisal Cycle</DialogTitle>
                        <DialogDescription className="text-slate-500 font-semibold text-sm">Select an employee to start their performance audit.</DialogDescription>
                    </DialogHeader>

                    <div className="py-8 space-y-5 text-start">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Employee Name *</Label>
                                <Input
                                    className="rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm"
                                    placeholder="Enter full name"
                                    value={formData.employeeName}
                                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Work ID *</Label>
                                <Input
                                    className="rounded-xl h-12 bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white transition-all text-sm"
                                    placeholder="e.g. EMP001"
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Review Framework / Cycle</Label>
                            <Select value={formData.cycle} onValueChange={(v) => setFormData({ ...formData, cycle: v })}>
                                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold px-5 focus:bg-white text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl p-1.5 font-bold">
                                    <SelectItem value="Annual Appraisal 2026" className="rounded-lg h-10 text-[11px] uppercase tracking-wide">Annual Audit 2026</SelectItem>
                                    <SelectItem value="Mid-Year Review" className="rounded-lg h-10 text-[11px] uppercase tracking-wide">Mid-Year Review 2026</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 pt-6 border-t border-slate-50">
                        <Button className="flex-1 bg-indigo-600 hover:bg-slate-900 text-white rounded-xl h-12 font-bold text-[11px] uppercase tracking-widest shadow-xl border-none" onClick={handleLaunch}>
                            Deploy Review Framework
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PerformanceAppraisalsPage;
