"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Info,
    Key,
    Headphones,
    Clock,
    CheckCircle2,
    XCircle,
    MessageSquare,
    AlertCircle
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/components/ui/use-toast";
import { useInboxStore, type Request } from "@/shared/data/inbox-store";
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

const RequestsPage = () => {
    const { toast } = useToast();
    const { requests, updateRequestStatus, deleteRequest } = useInboxStore();
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [reply, setReply] = useState("");

    const getTypeIcon = (type: Request['type']) => {
        const icons = {
            'Document': <FileText size={20} />,
            'Information': <Info size={20} />,
            'Access': <Key size={20} />,
            'Support': <Headphones size={20} />
        };
        return icons[type];
    };

    const getTypeColor = (type: Request['type']) => {
        const colors = {
            'Document': 'bg-blue-100 text-blue-700',
            'Information': 'bg-purple-100 text-purple-700',
            'Access': 'bg-amber-100 text-amber-700',
            'Support': 'bg-emerald-100 text-emerald-700'
        };
        return colors[type];
    };

    const getPriorityColor = (priority: Request['priority']) => {
        const colors = {
            'Low': 'bg-slate-100 text-slate-600',
            'Medium': 'bg-amber-100 text-amber-700',
            'High': 'bg-rose-100 text-rose-700'
        };
        return colors[priority];
    };

    const getStatusColor = (status: Request['status']) => {
        const colors = {
            'Open': 'bg-blue-100 text-blue-700',
            'In Progress': 'bg-amber-100 text-amber-700',
            'Resolved': 'bg-emerald-100 text-emerald-700',
            'Closed': 'bg-slate-100 text-slate-500'
        };
        return colors[status];
    };

    const handleStatusChange = (requestId: string, newStatus: Request['status']) => {
        updateRequestStatus(requestId, newStatus);
        toast({ title: "Status Updated", description: `Request marked as ${newStatus}` });
    };

    const handleViewDetails = (request: Request) => {
        setSelectedRequest(request);
        setIsDetailDialogOpen(true);
    };

    const openRequests = requests.filter(r => r.status === 'Open' || r.status === 'In Progress');
    const closedRequests = requests.filter(r => r.status === 'Resolved' || r.status === 'Closed');

    const stats = [
        { label: "Open", value: requests.filter(r => r.status === 'Open').length, color: "bg-[#CB9DF0]", icon: <Clock className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "In Progress", value: requests.filter(r => r.status === 'In Progress').length, color: "bg-[#FFF9BF]", icon: <AlertCircle className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Resolved", value: requests.filter(r => r.status === 'Resolved').length, color: "bg-emerald-100", icon: <CheckCircle2 className="text-emerald-600" />, textColor: "text-emerald-900" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Requests</h1>
                    <p className="text-slate-500 font-medium">Manage employee requests and queries.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                        <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4`}>
                            <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Active Requests */}
            <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-900">Active Requests</h2>
                {openRequests.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm">
                        <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={48} />
                        <p className="text-slate-400 font-bold">No active requests.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {openRequests.map((request, index) => (
                            <motion.div
                                key={request.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="border-none shadow-lg hover:shadow-xl transition-all rounded-[2rem] bg-white p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <Avatar className="h-12 w-12 bg-indigo-100 text-indigo-700 font-bold">
                                            <AvatarFallback>{request.from.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-lg text-slate-900 mb-1">{request.from.name}</h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge className={`${getTypeColor(request.type)} border-none font-bold text-xs`}>
                                                    {request.type}
                                                </Badge>
                                                <Badge className={`${getPriorityColor(request.priority)} border-none font-bold text-xs`}>
                                                    {request.priority}
                                                </Badge>
                                                <Badge className={`${getStatusColor(request.status)} border-none font-bold text-xs`}>
                                                    {request.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                                        <h4 className="font-bold text-slate-900 mb-2">{request.subject}</h4>
                                        <p className="text-sm text-slate-600 font-medium line-clamp-2">{request.message}</p>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-4">
                                        <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                                        <span>Updated: {new Date(request.updatedAt).toLocaleTimeString()}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Select
                                            value={request.status}
                                            onValueChange={(v) => handleStatusChange(request.id, v as Request['status'])}
                                        >
                                            <SelectTrigger className="flex-1 rounded-xl h-10 bg-slate-50 border-none font-bold text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Open">Open</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Resolved">Resolved</SelectItem>
                                                <SelectItem value="Closed">Closed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl border-slate-200 font-bold"
                                            onClick={() => handleViewDetails(request)}
                                        >
                                            <MessageSquare size={14} className="mr-2" /> Reply
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Closed Requests */}
            {closedRequests.length > 0 && (
                <div className="space-y-6">
                    <h2 className="text-xl font-black text-slate-900">Closed Requests</h2>
                    <div className="space-y-3">
                        {closedRequests.map((request) => (
                            <Card key={request.id} className="border-none shadow-sm rounded-[2rem] bg-white p-4 opacity-60">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 bg-slate-100 text-slate-600 font-bold">
                                            <AvatarFallback>{request.from.avatar}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{request.subject}</h3>
                                            <p className="text-xs text-slate-500 font-medium">{request.from.name}</p>
                                        </div>
                                    </div>
                                    <Badge className={`${getStatusColor(request.status)} border-none font-bold`}>
                                        {request.status}
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Detail Dialog */}
            <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
                <DialogContent className="bg-white rounded-[2rem] border-none p-8 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                        <DialogDescription>View and respond to this request.</DialogDescription>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-6 py-4">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-14 w-14 bg-indigo-100 text-indigo-700 font-bold text-lg">
                                    <AvatarFallback>{selectedRequest.from.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="font-black text-xl text-slate-900">{selectedRequest.from.name}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge className={`${getTypeColor(selectedRequest.type)} border-none font-bold`}>
                                            {selectedRequest.type}
                                        </Badge>
                                        <Badge className={`${getPriorityColor(selectedRequest.priority)} border-none font-bold`}>
                                            {selectedRequest.priority} Priority
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl">
                                <h4 className="font-black text-lg text-slate-900 mb-3">{selectedRequest.subject}</h4>
                                <p className="text-sm text-slate-700 font-medium leading-relaxed">{selectedRequest.message}</p>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-slate-900 mb-2 block">Your Response</label>
                                <Textarea
                                    placeholder="Type your reply here..."
                                    className="bg-slate-50 border-none rounded-xl min-h-[120px]"
                                    value={reply}
                                    onChange={e => setReply(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold"
                            onClick={() => {
                                if (selectedRequest) {
                                    updateRequestStatus(selectedRequest.id, 'In Progress');
                                    toast({ title: "Reply Sent", description: "The employee will be notified." });
                                    setIsDetailDialogOpen(false);
                                    setReply("");
                                }
                            }}
                        >
                            Send Reply
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RequestsPage;
