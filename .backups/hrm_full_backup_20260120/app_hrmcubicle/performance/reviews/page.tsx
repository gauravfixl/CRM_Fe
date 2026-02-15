"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { FileText, UserCheck, Users, HelpCircle, CheckCircle2, MoreHorizontal, Plus, Search, Calendar, GraduationCap, Star } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { usePerformanceStore, type Review } from "@/shared/data/performance-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";

const PerformanceReviewsPage = () => {
    const [activeTab, setActiveTab] = useState("pending-reviews");
    const { toast } = useToast();
    const { reviews, addReview, updateReview } = usePerformanceStore();
    const [isRequestOpen, setIsRequestOpen] = useState(false);

    const [formData, setFormData] = useState({
        reviewerName: "",
        revieweeName: "",
        type: "Peer" as Review['type'],
        dueDate: ""
    });

    const handleRequestReview = () => {
        if (!formData.reviewerName || !formData.revieweeName || !formData.dueDate) {
            toast({ title: "Validation Error", description: "All fields are required.", variant: "destructive" });
            return;
        }
        addReview(formData);
        toast({ title: "Review Requested", description: `360 review request sent to ${formData.reviewerName}.` });
        setIsRequestOpen(false);
        setFormData({ reviewerName: "", revieweeName: "", type: "Peer", dueDate: "" });
    };

    const StatusBadge = ({ status }: { status: Review['status'] }) => {
        const styles: Record<string, string> = {
            "Pending": "bg-amber-100 text-amber-700",
            "Completed": "bg-emerald-100 text-emerald-700"
        };
        return <Badge className={`border-none font-bold rounded-lg ${styles[status]}`}>{status}</Badge>;
    };

    const getFilteredReviews = () => {
        if (activeTab === 'pending-reviews') return reviews.filter(r => r.status === 'Pending');
        if (activeTab === 'completed-reviews') return reviews.filter(r => r.status === 'Completed');
        return reviews;
    };

    const filteredReviews = getFilteredReviews();

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Reviews</h1>
                    <p className="text-slate-500 font-medium tracking-tight">"Feedback is the breakfast of champions."</p>
                </div>
                <Button
                    onClick={() => setIsRequestOpen(true)}
                    className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-bold border-none transition-all hover:scale-105"
                >
                    <Users className="mr-2 h-5 w-5" /> Request 360 Review
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Reviews", value: reviews.length, color: "bg-slate-50", text: "text-slate-900" },
                    { label: "Pending", value: reviews.filter(r => r.status === "Pending").length, color: "bg-amber-50", text: "text-amber-700" },
                    { label: "Completed", value: reviews.filter(r => r.status === "Completed").length, color: "bg-emerald-50", text: "text-emerald-700" },
                    { label: "My Input", value: reviews.filter(r => r.reviewerName === "Self").length, color: "bg-blue-50", text: "text-blue-700" },
                ].map((stat, i) => (
                    <Card key={i} className={`rounded-[2rem] border-none shadow-sm ${stat.color} p-6`}>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{stat.label}</span>
                            <span className={`text-4xl font-black ${stat.text}`}>{stat.value}</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Tabs & List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                    <div className="px-8 pt-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0">
                        <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12">
                            <TabsTrigger value="pending-reviews" className="rounded-xl px-6 font-bold">Needs Input</TabsTrigger>
                            <TabsTrigger value="completed-reviews" className="rounded-xl px-6 font-bold">Completed</TabsTrigger>
                            <TabsTrigger value="history" className="rounded-xl px-6 font-bold">All Requests</TabsTrigger>
                        </TabsList>

                        <div className="relative mb-4 sm:mb-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search reviews..." className="pl-11 rounded-2xl border-none bg-slate-50 h-11 w-full sm:w-64 font-medium" />
                        </div>
                    </div>

                    <TabsContent value={activeTab} className="m-0 flex-1 overflow-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="font-bold text-slate-900 h-14 pl-8">Reviewee</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Reviewer</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Type</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Deadline</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Status</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14 pr-8 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReviews.map((rev) => (
                                    <TableRow key={rev.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center font-black text-purple-600">
                                                    {rev.revieweeName.charAt(0)}
                                                </div>
                                                <span className="font-black text-slate-900">{rev.revieweeName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <span className="font-bold text-slate-700 text-sm italic">{rev.reviewerName}</span>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <Badge variant="outline" className="rounded-lg font-black text-[10px] uppercase border-slate-200 text-slate-500 tracking-widest">{rev.type}</Badge>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                                                <Calendar className="h-3.5 w-3.5 text-slate-300" />
                                                {rev.dueDate}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <StatusBadge status={rev.status} />
                                        </TableCell>
                                        <TableCell className="pr-8 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-9 w-9 rounded-xl p-0 text-slate-400">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-none p-2 animate-in fade-in zoom-in duration-200">
                                                    <DropdownMenuLabel className="font-black text-slate-400 text-[10px] uppercase tracking-widest px-3 py-2">Review Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3">Open Review Form</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3">Send Reminder</DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-slate-50 my-2" />
                                                    {rev.status === 'Pending' && (
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                updateReview(rev.id, { status: 'Completed' });
                                                                toast({ title: "Review Submitted", description: `Feedback for ${rev.revieweeName} has been recorded.` });
                                                            }}
                                                            className="rounded-xl font-black h-11 px-3 text-emerald-600 focus:bg-emerald-50"
                                                        >
                                                            Mark as Completed
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredReviews.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-300 gap-2">
                                                <GraduationCap className="h-12 w-12 opacity-20" />
                                                <p className="font-black text-xs uppercase tracking-widest">No reviews found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Request Dialog */}
            <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tighter">Request Review</DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-base mt-2">
                            Gather multi-rater feedback for employee growth.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-8 py-8">
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Reviewee (Employee)</Label>
                            <Input
                                placeholder="Who is being reviewed?"
                                value={formData.revieweeName}
                                onChange={(e) => setFormData({ ...formData, revieweeName: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Reviewer</Label>
                            <Input
                                placeholder="Who will give feedback?"
                                value={formData.reviewerName}
                                onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val as any })}
                                >
                                    <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 font-bold px-6 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                        <SelectItem value="Peer" className="rounded-xl h-11">Peer Review</SelectItem>
                                        <SelectItem value="Manager" className="rounded-xl h-11">Manager Review</SelectItem>
                                        <SelectItem value="Direct Report" className="rounded-xl h-11">Direct Report</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Due Date</Label>
                                <Input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={handleRequestReview}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-50 font-black border-none flex-1"
                        >
                            Send Request
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsRequestOpen(false)}
                            className="rounded-[1.25rem] h-14 px-10 font-bold text-slate-400 border-none flex-1 hover:bg-slate-50"
                        >
                            Discard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PerformanceReviewsPage;
