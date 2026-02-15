"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    Info,
    Key,
    Headphones,
    Clock,
    CheckCircle2,
    XCircle,
    MessageSquare,
    AlertCircle,
    ChevronRight,
    Search,
    Filter,
    ArrowRight,
    Send,
    User,
    Calendar,
    Zap,
    LifeBuoy,
    Plane,
    CreditCard,
    Cpu,
    UserCog,
    MailCheck,
    ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useInboxStore, type Request, type RequestType, type RequestStatus } from "@/shared/data/inbox-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const RequestsPage = () => {
    const { toast } = useToast();
    const { requests, updateRequestStatus, deleteRequest } = useInboxStore();

    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [reply, setReply] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<RequestType | 'All'>('All');
    const [filterStatus, setFilterStatus] = useState<RequestStatus | 'All'>('Open');

    const getTypeStyles = (type: RequestType) => {
        const styles = {
            'Leave': { icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
            'Attendance': { icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
            'Expense': { icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            'Asset': { icon: Cpu, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
            'Profile Update': { icon: UserCog, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
            'Letter': { icon: MailCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
        };
        return styles[type] || { icon: Info, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' };
    };

    const getStatusStyles = (status: RequestStatus) => {
        const styles = {
            'Open': 'bg-blue-600 text-white shadow-blue-100',
            'In Progress': 'bg-amber-500 text-white shadow-amber-100',
            'Resolved': 'bg-emerald-600 text-white shadow-emerald-100',
            'Closed': 'bg-slate-300 text-white shadow-none'
        };
        return styles[status] || 'bg-slate-100 text-slate-400';
    };

    const handleStatusUpdate = (requestId: string, newStatus: RequestStatus) => {
        updateRequestStatus(requestId, newStatus);
        toast({ title: "Ticket Updated", description: `Status changed to ${newStatus}` });
    };

    const filteredRequests = requests.filter(r => {
        const matchesType = filterType === 'All' || r.type === filterType;
        const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
        const matchesSearch = r.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesStatus && matchesSearch;
    });

    const categories: { label: string, value: RequestType | 'All', icon: any }[] = [
        { label: "All Tickets", value: "All", icon: LifeBuoy },
        { label: "Leave", value: "Leave", icon: Plane },
        { label: "Attendance", value: "Attendance", icon: Clock },
        { label: "Expenses", value: "Expense", icon: CreditCard },
        { label: "Assets", value: "Asset", icon: Cpu },
        { label: "Profile", value: "Profile Update", icon: UserCog },
        { label: "Letters", value: "Letter", icon: MailCheck },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/20">
            <header className="p-6 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employee Support Hub</h1>
                            <Badge className="bg-emerald-600 text-white border-none font-bold text-[10px] h-6 px-3 rounded-lg uppercase tracking-wider">Help Desk</Badge>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Tracking and resolving employee-initiated actions across all departments.</p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-xl border border-slate-200">
                        {['Open', 'In Progress', 'Resolved', 'All'].map(s => (
                            <Button
                                key={s}
                                variant="ghost"
                                size="sm"
                                className={`rounded-lg font-bold text-xs h-9 px-4 transition-all ${filterStatus === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
                                onClick={() => setFilterStatus(s as any)}
                            >
                                {s}
                            </Button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="p-6 max-w-6xl mx-auto w-full space-y-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Categorization Drawer */}
                    <div className="w-full lg:w-72 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Request Type</Label>
                                <div className="space-y-1">
                                    {categories.map(cat => (
                                        <Button
                                            key={cat.value}
                                            variant="ghost"
                                            className={`w-full justify-between rounded-xl font-bold text-sm h-11 px-4 transition-all ${filterType === cat.value ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-600 hover:bg-slate-50'}`}
                                            onClick={() => setFilterType(cat.value)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <cat.icon size={16} className={filterType === cat.value ? 'text-indigo-400' : 'text-slate-400'} />
                                                <span>{cat.label}</span>
                                            </div>
                                            {filterType === cat.value && <ChevronRight size={14} />}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right: Request Flow */}
                    <div className="flex-1 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by ticket ID, subject or employee name..."
                                className="pl-11 h-14 rounded-2xl bg-white border-slate-200 focus:border-indigo-500 shadow-sm font-medium transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <AnimatePresence mode="popLayout">
                            {filteredRequests.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4 shadow-sm">
                                        <MessageSquare size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Support queue is empty</h3>
                                    <p className="text-slate-500 text-sm font-medium mt-1">No pending actions match your current view.</p>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredRequests.map((req, i) => {
                                        const styles = getTypeStyles(req.type);
                                        const statusColor = getStatusStyles(req.status);
                                        return (
                                            <motion.div
                                                key={req.id}
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: i * 0.03 }}
                                            >
                                                <Card className="group border border-slate-100 shadow-sm hover:shadow-lg transition-all rounded-3xl bg-white overflow-hidden hover:border-indigo-100">
                                                    <CardContent className="p-0">
                                                        <div className="flex flex-col md:flex-row">
                                                            <div className={`p-6 md:w-56 ${styles.bg} border-r border-slate-50 flex flex-col justify-between gap-4 shrink-0`}>
                                                                <div className="space-y-4">
                                                                    <div className={`h-11 w-11 rounded-2xl bg-white shadow-sm flex items-center justify-center ${styles.color} border ${styles.border}`}>
                                                                        <styles.icon size={20} />
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <h4 className="text-xs font-bold text-slate-400 tracking-widest">{req.type}</h4>
                                                                        <Badge className={`${statusColor} border-none font-bold text-[9px] h-5 px-3 rounded-md tracking-tight shadow-md`}>
                                                                            {req.status}
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider tabular-nums flex items-center gap-1.5">
                                                                    <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                                                                </div>
                                                            </div>

                                                            <div className="flex-1 p-6 space-y-4">
                                                                <div className="flex items-start justify-between gap-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <Avatar className="h-9 w-9 border-2 border-white ring-1 ring-slate-100 shadow-sm">
                                                                            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">{req.from.avatar}</AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="space-y-1">
                                                                            <h3 className="font-bold text-slate-900 tracking-tight leading-none text-base group-hover:text-indigo-600 transition-colors">{req.subject}</h3>
                                                                            <p className="text-xs text-slate-400 font-bold">Requested by <span className="text-slate-600">{req.from.name}</span></p>
                                                                        </div>
                                                                    </div>
                                                                    <Badge variant="outline" className={`${req.priority === 'High' ? 'text-rose-500 border-rose-100 bg-rose-50' : 'text-slate-400 border-slate-100'} text-[9px] font-bold h-5 px-2 rounded-md`}>
                                                                        {req.priority} PRIORITY
                                                                    </Badge>
                                                                </div>

                                                                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2 border-l-2 border-slate-100 pl-3">{req.message}</p>

                                                                <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                                                                    <div className="flex items-center gap-2">
                                                                        <Select value={req.status} onValueChange={(val) => handleStatusUpdate(req.id, val as RequestStatus)}>
                                                                            <SelectTrigger className="w-[140px] h-9 rounded-xl border-slate-100 bg-slate-50 font-bold text-[11px] tracking-wider">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="rounded-xl p-1 shadow-2xl border-none">
                                                                                <SelectItem value="Open" className="text-[11px] font-bold">Open</SelectItem>
                                                                                <SelectItem value="In Progress" className="text-[11px] font-bold">In Progress</SelectItem>
                                                                                <SelectItem value="Resolved" className="text-[11px] font-bold text-emerald-600 focus:text-emerald-600">Resolved</SelectItem>
                                                                                <SelectItem value="Closed" className="text-[11px] font-bold text-slate-400">Closed</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <Button
                                                                        className="h-10 px-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs transition-all gap-2 group/btn"
                                                                        onClick={() => { setSelectedRequest(req); setIsDetailDialogOpen(true); }}
                                                                    >
                                                                        <MessageSquare size={14} /> Handle Request <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Response Portal Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="bg-white rounded-[2.5rem] border-none p-10 max-w-2xl shadow-3xl">
                    <DialogHeader className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 border-4 border-slate-50 shadow-sm ring-1 ring-slate-100">
                                    <AvatarFallback className="bg-indigo-50 text-indigo-700 text-lg font-bold">{selectedRequest?.from.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-2xl text-slate-900 tracking-tight">{selectedRequest?.from.name}</h3>
                                    <Badge className="bg-slate-100 text-slate-500 border-none font-bold text-[9px] uppercase tracking-widest px-2 h-5">Employee Support Ticket</Badge>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Ticket ID</p>
                                <p className="text-sm font-bold text-slate-500 tabular-nums">#REQ-{selectedRequest?.id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="h-px bg-slate-100 w-full" />
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-indigo-100 text-indigo-600 bg-indigo-50 text-[9px] font-bold h-5 px-2 rounded-md">{selectedRequest?.type}</Badge>
                                <Badge variant="outline" className={`${selectedRequest?.priority === 'High' ? 'border-rose-100 text-rose-600 bg-rose-50' : 'border-slate-100 text-slate-400 bg-slate-50'} text-[9px] font-bold h-5 px-2 rounded-md`}>{selectedRequest?.priority} Priority</Badge>
                            </div>
                            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">{selectedRequest?.subject}</DialogTitle>
                        </div>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-6 py-6">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{selectedRequest.message}"</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-1">
                                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Send size={12} /> Communication Portal</Label>
                                    <span className="text-[10px] text-slate-300 font-medium italic">Sent to employee's workspace instanly</span>
                                </div>
                                <Textarea
                                    className="rounded-2xl bg-white border-slate-200 focus:border-indigo-500 min-h-[140px] p-5 font-medium text-sm transition-all shadow-inner"
                                    placeholder="Draft your administrative response or action steps here..."
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-3 pt-6 border-t border-slate-50 sm:justify-start">
                        <Button
                            className="flex-1 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl h-14 font-bold text-sm shadow-xl shadow-slate-200 transition-all flex gap-3 group"
                            onClick={() => {
                                if (selectedRequest) {
                                    handleStatusUpdate(selectedRequest.id, 'Resolved');
                                    setIsDetailDialogOpen(false);
                                    setReply("");
                                }
                            }}
                        >
                            <MailCheck size={18} className="group-hover:scale-110 transition-transform" /> Dispatch & Resolve Ticket
                        </Button>
                        <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold border-slate-200 text-slate-600" onClick={() => setIsDetailDialogOpen(false)}>Close Portal</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RequestsPage;
