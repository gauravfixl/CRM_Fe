"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Inbox,
    Clock,
    Calendar,
    FileText,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    MoreVertical,
    Check,
    X,
    Clock9,
    Plane,
    Keyboard,
    Zap,
    ArrowRight,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/components/ui/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

const TeamRequestsPage = () => {
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("pending");
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showBatch, setShowBatch] = useState(false);
    const [filterType, setFilterType] = useState("All Types");

    useEffect(() => {
        setMounted(true);
    }, []);

    const [requests, setRequests] = useState([
        { id: "REQ-001", requester: "Sneha Reddy", img: "https://i.pravatar.cc/150?u=sneha", type: "Leave", detail: "Casual Leave (Family Vacation)", date: "Jan 22 - Jan 24", days: 3, status: "pending", priority: "Medium", timestamp: "2 hours ago", reason: "Family trip to Shimla planned since 2 months." },
        { id: "REQ-002", requester: "Viral Vora", img: "https://i.pravatar.cc/150?u=viral", type: "Attendance", detail: "Regularization (Forgot to punch out)", date: "Jan 15, 2026", days: 1, status: "pending", priority: "High", timestamp: "4 hours ago", reason: "Left early for emergency, forgot to punch out at machine." },
        { id: "REQ-003", requester: "Rajesh Kumar", img: "https://i.pravatar.cc/150?u=rajesh", type: "Asset", detail: "Request for Noise Cancelling Headphones", date: "N/A", days: 0, status: "pending", priority: "Low", timestamp: "Yesterday", reason: "Current headphones are broken, unable to focus in open office." },
        { id: "REQ-004", requester: "Sana Khan", img: "https://i.pravatar.cc/150?u=sana", type: "Shift", detail: "Change to Morning Shift", date: "Start Feb 01", days: 0, status: "approved", priority: "Medium", timestamp: "2 days ago", reason: "Personal family commitment requiring morning availability." },
    ]);

    const handleApproval = (id: string, action: "approved" | "rejected") => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: action } : r));
        toast({
            title: action === "approved" ? "Request Approved" : "Request Rejected",
            description: `Update has been sent to the requester.`,
            variant: action === "approved" ? "default" : "destructive",
        });
        setShowDetails(false);
    };

    if (!mounted) return null;

    const filteredRequests = requests.filter(r => {
        const matchesTab = activeTab === "pending" ? r.status === "pending" : r.status !== "pending";
        const matchesType = filterType === "All Types" || r.type === filterType;
        return matchesTab && matchesType;
    });

    const pendingRequests = requests.filter(r => r.status === "pending");

    const getIcon = (type: string) => {
        switch (type) {
            case "Leave": return <Plane className="h-4 w-4 text-indigo-600" />;
            case "Attendance": return <Clock9 className="h-4 w-4 text-emerald-600" />;
            case "Asset": return <Keyboard className="h-4 w-4 text-amber-600" />;
            case "Shift": return <Zap className="h-4 w-4 text-purple-600" />;
            default: return <FileText className="h-4 w-4 text-slate-600" />;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-[#fcfdff] min-h-screen text-start">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 font-sans text-start">Approvals Central</h1>
                    <div className="text-slate-500 font-medium md:flex md:items-center md:gap-2 mt-1">
                        You have <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[10px] uppercase h-5">{pendingRequests.length} pending</Badge> actions to review.
                    </div>
                </div>
                <div className="flex gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-xl border-slate-200 h-11 px-6 font-bold text-xs uppercase tracking-wider">
                                <Filter className="h-4 w-4 mr-2 text-slate-400" /> {filterType}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-2xl p-2 w-48 shadow-2xl border-slate-100">
                            {["All Types", "Leave", "Attendance", "Asset", "Shift"].map((t) => (
                                <DropdownMenuItem key={t} className="rounded-xl p-3 font-bold text-[10px] uppercase tracking-widest text-slate-600 focus:bg-indigo-50 focus:text-indigo-600" onClick={() => setFilterType(t)}>
                                    {t}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="bg-[#6366f1] hover:bg-[#4f46e5] rounded-xl font-bold shadow-lg shadow-indigo-100 h-11 px-6" onClick={() => setShowBatch(true)}>
                        Batch Actions
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="pending" className="space-y-6" onValueChange={setActiveTab}>
                <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12 border border-slate-100 text-start">
                    <TabsTrigger value="pending" className="rounded-xl font-bold text-[10px] uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-md px-10">Pending Box ({pendingRequests.length})</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-xl font-bold text-[10px] uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-md px-10">Past Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <motion.div key={req.id} variants={itemVariants}>
                                        <Card className="border-none shadow-sm group hover:shadow-xl hover:translate-y-[-2px] transition-all overflow-hidden bg-white text-start">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col lg:flex-row">
                                                    {/* Request Info */}
                                                    <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 md:items-center cursor-pointer" onClick={() => { setSelectedRequest(req); setShowDetails(true); }}>
                                                        <Avatar className="h-14 w-14 shadow-md ring-4 ring-slate-50">
                                                            <AvatarImage src={req.img} />
                                                            <AvatarFallback className="bg-indigo-600 text-white font-bold">{req.requester.substring(0, 2)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <h4 className="font-black text-slate-900 text-lg">{req.requester}</h4>
                                                                <span className="text-slate-300">•</span>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">{req.id}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm">
                                                                    {getIcon(req.type)}
                                                                </div>
                                                                <p className="text-sm font-bold text-slate-700">{req.detail}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4 pt-1">
                                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                                                    <Calendar className="h-3 w-3" /> {req.date}
                                                                </div>
                                                                <Badge variant="outline" className={`text-[8px] font-black uppercase border-none px-2 py-0.5 ${req.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
                                                                    {req.priority} Priority
                                                                </Badge>
                                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600">
                                                                    <Clock className="h-3 w-3" /> {req.timestamp}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions Strip */}
                                                    <div className="bg-slate-50/30 lg:w-[340px] p-6 flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100">
                                                        <Button
                                                            variant="outline"
                                                            className="flex-1 h-12 rounded-2xl border-rose-100 text-rose-600 hover:bg-rose-50 hover:border-rose-200 font-black text-[10px] uppercase tracking-widest shadow-none"
                                                            onClick={() => handleApproval(req.id, "rejected")}
                                                        >
                                                            <X className="h-4 w-4 mr-2" /> REJECT
                                                        </Button>
                                                        <Button
                                                            className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100"
                                                            onClick={() => handleApproval(req.id, "approved")}
                                                        >
                                                            <Check className="h-4 w-4 mr-2" /> APPROVE
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white border border-transparent hover:border-slate-100"><MoreVertical className="h-5 w-5 text-slate-400" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-[1.5rem] p-2 w-48 shadow-2xl border-slate-50">
                                                                <DropdownMenuItem className="p-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-600 focus:bg-indigo-50 focus:text-indigo-600">
                                                                    <Inbox className="h-4 w-4 mr-3" /> Forward
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="p-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-slate-600 focus:bg-indigo-50 focus:text-indigo-600">
                                                                    <AlertCircle className="h-4 w-4 mr-3" /> Mark Urgent
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="h-24 w-24 rounded-[2.5rem] bg-emerald-50 flex items-center justify-center shadow-inner border border-emerald-100/50">
                                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-slate-900">All Requests Cleared</h3>
                                        <p className="text-slate-500 font-medium">Sit back and relax, your team is all set for today.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    {filteredRequests.map((req) => (
                        <Card key={req.id} className="border-none shadow-sm opacity-80 hover:opacity-100 transition-all bg-white overflow-hidden text-start">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 grayscale border-2 border-slate-50">
                                        <AvatarImage src={req.img} />
                                        <AvatarFallback>RK</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-black text-slate-900">{req.requester}</p>
                                        <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-tight">{req.type} Request • {req.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-10">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Policy Details</p>
                                        <p className="text-[11px] font-bold text-slate-700">{req.detail}</p>
                                    </div>
                                    <Badge className={`rounded-xl px-5 py-1.5 border-none font-black text-[10px] uppercase tracking-[0.1em] ${req.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {req.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>

            {/* Request Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="rounded-[3rem] border-none shadow-2xl p-10 bg-white max-w-xl text-start">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black flex items-center gap-4">
                            Request Insight
                            <Badge className="bg-slate-100 text-slate-400 border-none text-xs">{selectedRequest?.id}</Badge>
                        </DialogTitle>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-8 py-8">
                            <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
                                    <AvatarImage src={selectedRequest.img} />
                                    <AvatarFallback>{selectedRequest.requester.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">{selectedRequest.requester}</h3>
                                    <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] mt-1">Direct Report • Sub-Team A</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 px-2">
                                <div className="space-y-2">
                                    <Label className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400">Request Type</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                                            {getIcon(selectedRequest.type)}
                                        </div>
                                        <p className="font-black text-slate-700">{selectedRequest.type}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400">Time / Period</Label>
                                    <p className="font-black text-slate-700 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> {selectedRequest.date}</p>
                                </div>
                            </div>

                            <div className="space-y-3 px-2">
                                <Label className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400">Reason / Justification</Label>
                                <p className="text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50">
                                    &quot;{selectedRequest.reason}&quot;
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button className="flex-1 h-16 rounded-[2rem] border-rose-100 text-rose-600 hover:bg-rose-50 font-black text-xs uppercase tracking-[0.2em] shadow-none border-2" onClick={() => handleApproval(selectedRequest.id, "rejected")}>REJECT</Button>
                                <Button className="flex-1 h-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200" onClick={() => handleApproval(selectedRequest.id, "approved")}>APPROVE NOW</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Batch Actions Dialog */}
            <Dialog open={showBatch} onOpenChange={setShowBatch}>
                <DialogContent className="rounded-[3rem] border-none shadow-2xl p-10 bg-white max-w-md text-start">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Batch Processing</DialogTitle>
                        <p className="text-slate-500 font-medium mt-2">Apply actions to all {pendingRequests.length} pending requests.</p>
                    </DialogHeader>
                    <div className="space-y-6 py-10">
                        <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100/50 flex gap-4">
                            <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
                            <p className="text-xs text-amber-800 font-medium leading-relaxed">Batch actions are irreversible and will notify all team members immediately. Please use with caution.</p>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 ml-2">Batch Remark</Label>
                            <Textarea placeholder="Optional: Add a comment for all processed requests..." className="rounded-[2rem] border-slate-100 p-6 min-h-[120px] focus-visible:ring-indigo-600" />
                        </div>
                    </div>
                    <DialogFooter className="flex-col gap-4 sm:flex-col">
                        <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-100" onClick={() => {
                            setRequests(requests.map(r => r.status === 'pending' ? { ...r, status: 'approved' } : r));
                            toast({ title: "Batch Approved", description: `All pending requests have been approved.` });
                            setShowBatch(false);
                        }}>APPROVE ALL PENDING</Button>
                        <Button variant="ghost" className="w-full h-14 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50" onClick={() => setShowBatch(false)}>CANCEL</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default TeamRequestsPage;
