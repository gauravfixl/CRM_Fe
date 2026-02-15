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
            case "Attendance": return <Clock className="h-4 w-4 text-emerald-600" />;
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
        <div className="flex-1 space-y-6 p-6 bg-[#f8fafc] min-h-screen text-start">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">Approvals Central</h1>
                    <div className="text-slate-500 font-medium text-xs md:flex md:items-center md:gap-2 mt-2">
                        You have <Badge className="bg-amber-100 text-amber-700 border-none font-bold text-[9px] px-2 shadow-none">{pendingRequests.length} Pending</Badge> actions to review.
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="rounded-xl border-none shadow-sm h-10 px-5 font-bold text-xs bg-white text-slate-600">
                                <Filter className="h-4 w-4 mr-2 text-slate-400" /> {filterType}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-xl p-1 w-48 shadow-xl border-none bg-white">
                            {["All Types", "Leave", "Attendance", "Asset", "Shift"].map((t) => (
                                <DropdownMenuItem key={t} className="rounded-lg p-2.5 font-bold text-[10px] tracking-widest text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 cursor-pointer" onClick={() => setFilterType(t)}>
                                    {t}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-10 px-5 shadow-md border-none text-xs transition-all" onClick={() => setShowBatch(true)}>
                        Batch Action
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="pending" className="space-y-5" onValueChange={setActiveTab}>
                <TabsList className="bg-slate-100/50 p-1 rounded-xl h-10 border border-slate-100/50 w-full md:w-auto">
                    <TabsTrigger value="pending" className="rounded-lg font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full border-none">Pending Box ({pendingRequests.length})</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg font-bold text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full border-none">History</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="bg-indigo-100 p-6 rounded-[2rem] border border-indigo-200 shadow-inner"
                        >
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((req) => (
                                    <motion.div key={req.id} variants={itemVariants} className="mb-4 last:mb-0">
                                        <Card className="border-none shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 overflow-hidden bg-white text-start rounded-2xl border border-white/50">
                                            <CardContent className="p-0">
                                                <div className="flex flex-col lg:flex-row">
                                                    {/* Request Info */}
                                                    <div className="flex-1 p-4 flex flex-col md:flex-row gap-4 md:items-center cursor-pointer" onClick={() => { setSelectedRequest(req); setShowDetails(true); }}>
                                                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm border border-slate-50">
                                                            <AvatarImage src={req.img} />
                                                            <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-xs">{req.requester.substring(0, 2)}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 space-y-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-bold text-slate-800 text-[15px] tracking-tight">{req.requester}</h4>
                                                                <span className="text-slate-200">•</span>
                                                                <span className="text-[9px] font-bold text-slate-400 tracking-widest bg-slate-50 px-2 py-0.5 rounded-md">{req.id}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-7 w-7 rounded-lg bg-indigo-50/50 flex items-center justify-center border border-indigo-100/20">
                                                                    {getIcon(req.type)}
                                                                </div>
                                                                <p className="text-xs font-bold text-slate-600">{req.detail}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4 pt-1">
                                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                                                                    <Calendar className="h-3 w-3" /> {req.date}
                                                                </div>
                                                                <Badge className={`text-[8px] font-bold border-none px-2 py-0.5 shadow-none rounded-md ${req.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
                                                                    {req.priority}
                                                                </Badge>
                                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-500">
                                                                    <Clock className="h-3 w-3" /> {req.timestamp}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions Strip */}
                                                    <div className="bg-slate-50/20 lg:w-[280px] p-4 flex items-center gap-2 border-t lg:border-t-0 lg:border-l border-slate-100">
                                                        <Button
                                                            variant="outline"
                                                            className="flex-1 h-9 rounded-xl border-none shadow-sm text-rose-500 hover:bg-rose-50 font-bold text-[10px] tracking-widest bg-white"
                                                            onClick={(e) => { e.stopPropagation(); handleApproval(req.id, "rejected"); }}
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            className="flex-1 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] tracking-widest shadow-sm border-none transition-all"
                                                            onClick={(e) => { e.stopPropagation(); handleApproval(req.id, "approved"); }}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border-none text-slate-300 hover:text-slate-600"><MoreVertical className="h-4 w-4" /></Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl p-1 w-44 shadow-xl border-none bg-white">
                                                                <DropdownMenuItem className="p-2.5 rounded-lg font-bold text-[10px] tracking-widest text-slate-600 cursor-pointer focus:bg-indigo-50" onClick={() => toast({ title: "Forwarded", description: `Request ${req.id} has been forwarded to HR.` })}>
                                                                    <Inbox className="h-3.5 w-3.5 mr-2.5" /> Forward
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="p-2.5 rounded-lg font-bold text-[10px] tracking-widest text-slate-600 cursor-pointer focus:bg-rose-50 focus:text-rose-600" onClick={() => toast({ title: "Prioritized", description: `Request ${req.id} marked as critically urgent.` })}>
                                                                    <AlertCircle className="h-3.5 w-3.5 mr-2.5" /> Mark Urgent
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
                                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-inner border border-emerald-100/50">
                                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">All Caught Up!</h3>
                                        <p className="text-slate-400 font-medium text-xs">No pending requests to review right now.</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </TabsContent>

                <TabsContent value="history" className="">
                    <div className="bg-slate-100 p-6 rounded-[2rem] border border-slate-200 shadow-inner space-y-4">
                        {filteredRequests.map((req) => (
                            <Card key={req.id} className="border-none shadow-sm opacity-80 hover:opacity-100 transition-all bg-white overflow-hidden text-start rounded-2xl border border-slate-100/50">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-start">
                                        <Avatar className="h-9 w-9 ring-1 ring-slate-100 grayscale-75">
                                            <AvatarImage src={req.img} />
                                            <AvatarFallback className="text-xs">RK</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 leading-tight">{req.requester}</p>
                                            <p className="text-[9px] text-indigo-500 font-bold tracking-widest mt-1">{req.type} Request • {req.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[9px] font-bold text-slate-400 tracking-widest">Detail</p>
                                            <p className="text-[11px] font-bold text-slate-600 leading-none mt-1">{req.detail}</p>
                                        </div>
                                        <Badge className={`rounded-lg px-3 py-1 border-none font-bold text-[8px] tracking-widest shadow-none capitalize ${req.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {req.status}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Request Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="rounded-2xl border-none shadow-xl p-6 bg-white max-w-lg text-start">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
                            Request Insight
                            <Badge className="bg-slate-100 text-slate-400 border-none text-[8px] h-5 shadow-none">ID: {selectedRequest?.id}</Badge>
                        </DialogTitle>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-6 py-6 text-start">
                            <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                                <Avatar className="h-14 w-14 ring-2 ring-white shadow-md">
                                    <AvatarImage src={selectedRequest.img} />
                                    <AvatarFallback className="font-bold">{selectedRequest.requester.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{selectedRequest.requester}</h3>
                                    <p className="text-indigo-600 font-bold tracking-widest text-[9px] mt-1">Direct Report • Sub-Team A</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 px-1">
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-[9px] tracking-widest text-slate-400 ml-1">Type</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-lg bg-indigo-50/50 flex items-center justify-center border border-indigo-100/20">
                                            {getIcon(selectedRequest.type)}
                                        </div>
                                        <p className="font-bold text-slate-700 text-xs">{selectedRequest.type}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="font-bold text-[9px] tracking-widest text-slate-400 ml-1">Period</Label>
                                    <p className="font-bold text-slate-700 text-xs flex items-center gap-2 mt-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" /> {selectedRequest.date}</p>
                                </div>
                            </div>

                            <div className="space-y-2 px-1">
                                <Label className="font-bold text-[9px] tracking-widest text-slate-400 ml-1">Reason / Justification</Label>
                                <p className="text-slate-600 font-bold text-xs leading-relaxed bg-slate-50 shadow-inner p-4 rounded-xl border border-slate-100">
                                    {selectedRequest.reason}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-3">
                                <Button className="flex-1 h-10 rounded-xl border-none shadow-sm text-rose-500 hover:bg-rose-50 font-bold text-xs tracking-widest bg-slate-50" onClick={() => handleApproval(selectedRequest.id, "rejected")}>Reject</Button>
                                <Button className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-widest shadow-md border-none transition-all" onClick={() => handleApproval(selectedRequest.id, "approved")}>Approve Now</Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Batch Actions Dialog */}
            <Dialog open={showBatch} onOpenChange={setShowBatch}>
                <DialogContent className="rounded-2xl border-none shadow-xl p-6 bg-white max-w-sm text-start">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold tracking-tight">Batch Processing</DialogTitle>
                        <p className="text-slate-500 font-medium text-xs mt-1">Apply actions to all {pendingRequests.length} pending items.</p>
                    </DialogHeader>
                    <div className="space-y-5 py-6">
                        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100/30 flex gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-amber-800 font-bold leading-relaxed">Batch actions are irreversible and will notify all team members immediately. Please use with caution.</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-[9px] uppercase tracking-widest text-slate-400 ml-1">Batch Remark</Label>
                            <Textarea placeholder="Add a comment for all processed requests..." className="rounded-xl border-none bg-slate-100/50 p-4 min-h-[100px] text-xs font-bold focus:bg-white shadow-inner" />
                        </div>
                    </div>
                    <DialogFooter className="flex-col gap-3">
                        <Button className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-[11px] tracking-widest shadow-md border-none transition-all" onClick={() => {
                            setRequests(requests.map(r => r.status === 'pending' ? { ...r, status: 'approved' } : r));
                            toast({ title: "Batch Approved", description: `All ${pendingRequests.length} pending requests have been approved.` });
                            setShowBatch(false);
                        }}>Approve All Pending</Button>
                        <Button variant="ghost" className="w-full h-11 rounded-xl font-bold text-[11px] tracking-widest text-slate-400 border-none" onClick={() => setShowBatch(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default TeamRequestsPage;
