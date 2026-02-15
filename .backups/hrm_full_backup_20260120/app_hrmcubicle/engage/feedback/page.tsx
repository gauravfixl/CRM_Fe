"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { MessageSquarePlus, Inbox, ShieldCheck, Send, MoreHorizontal, User, Sparkles, Plus, Trash2, Edit, Calendar, Lock } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useEngageStore, type Feedback } from "@/shared/data/engage-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";

const EmployeeFeedbackEngagePage = () => {
    const [activeTab, setActiveTab] = useState("all");
    const { toast } = useToast();
    const { feedbacks, addFeedback, updateFeedback } = useEngageStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeFeedback, setActiveFeedback] = useState<Feedback | null>(null);

    const [formData, setFormData] = useState({
        employeeName: "Sneha Reddy",
        category: "General" as Feedback['category'],
        content: "",
        anonymous: false
    });

    const resetForm = () => {
        setFormData({ employeeName: "Sneha Reddy", category: "General", content: "", anonymous: false });
        setActiveFeedback(null);
    };

    const handleSave = () => {
        if (!formData.content) {
            toast({ title: "Error", description: "Feedback content cannot be empty.", variant: "destructive" });
            return;
        }

        addFeedback({
            ...formData,
            employeeName: formData.anonymous ? "Anonymous" : formData.employeeName
        });

        toast({ title: "Feedback Sent", description: formData.anonymous ? "Your anonymous suggestion has been delivered." : "Thank you for your feedback!" });
        setIsDialogOpen(false);
        resetForm();
    };

    const StatusBadge = ({ status }: { status: Feedback['status'] }) => {
        const styles: Record<string, string> = {
            "Open": "bg-blue-100 text-blue-700",
            "Reviewed": "bg-purple-100 text-purple-700",
            "Resolved": "bg-emerald-100 text-emerald-700"
        };
        return <Badge className={`border-none font-bold rounded-lg px-3 ${styles[status]}`}>{status}</Badge>;
    };

    const filteredFeedbacks = feedbacks.filter(f => activeTab === 'all' || (activeTab === 'anonymous' && f.anonymous) || (activeTab === 'mine' && !f.anonymous));

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workplace Feedback</h1>
                    <p className="text-slate-500 font-medium italic">"Feedback is the fuel for organizational brilliance."</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsDialogOpen(true); }}
                    className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-bold border-none transition-all hover:scale-105"
                >
                    <MessageSquarePlus className="mr-2 h-5 w-5" /> Share Suggestion
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12">
                        <TabsTrigger value="all" className="rounded-xl px-8 font-bold">Recent Pulse</TabsTrigger>
                        <TabsTrigger value="mine" className="rounded-xl px-8 font-bold">My Feedback</TabsTrigger>
                        <TabsTrigger value="anonymous" className="rounded-xl px-8 font-bold flex gap-2">
                            <Lock className="h-3.5 w-3.5" /> Anonymous
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="grid grid-cols-1 gap-6 m-0">
                        {filteredFeedbacks.map((fb) => (
                            <Card key={fb.id} className="rounded-[2.5rem] border-none shadow-sm bg-white hover:shadow-xl hover:shadow-purple-50 transition-all group overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center font-black text-indigo-600">
                                                {fb.anonymous ? <ShieldCheck className="h-6 w-6" /> : <User className="h-6 w-6" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{fb.anonymous ? "Secure Anonymous Feedback" : fb.employeeName}</h3>
                                                    <StatusBadge status={fb.status} />
                                                </div>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <Badge className="bg-slate-50 text-slate-400 border-none rounded-lg h-6 px-3 font-black text-[10px] uppercase tracking-widest">{fb.category}</Badge>
                                                    <span className="text-xs font-black text-slate-300 italic flex items-center gap-1.5 uppercase tracking-tighter">
                                                        <Calendar className="h-3.5 w-3.5" /> {fb.date}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 text-slate-300 hover:text-slate-600">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-none p-2 animate-in fade-in zoom-in duration-200">
                                                <DropdownMenuLabel className="font-black text-slate-400 text-[10px] uppercase tracking-widest px-3 py-2">Engagement Actions</DropdownMenuLabel>
                                                <DropdownMenuItem className="rounded-xl font-bold h-11 px-3">Mark as Reviewed</DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        updateFeedback(fb.id, { status: 'Resolved' });
                                                        toast({ title: "Issue Resolved", description: "The feedback has been marked as resolved." });
                                                    }}
                                                    className="rounded-xl font-bold h-11 px-3 text-emerald-600"
                                                >
                                                    Mark as Resolved
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-50 my-2" />
                                                <DropdownMenuItem className="rounded-xl font-bold h-11 px-3 text-red-600">Archived</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="bg-slate-50/50 rounded-2xl p-6 relative">
                                        <p className="text-slate-600 font-bold leading-relaxed text-sm italic">
                                            "{fb.content}"
                                        </p>
                                        <div className="absolute -top-3 left-6">
                                            <Sparkles className="h-6 w-6 text-indigo-100 fill-indigo-100" />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center gap-4 text-xs font-black text-slate-300 uppercase tracking-widest">
                                        <span className="flex items-center gap-2"><Inbox className="h-3.5 w-3.5" /> 2 Responses from Admin</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Feedback Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tighter">Suggestion Box</DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-base mt-2">
                            Help us build a better workplace. Your voice matters.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-8 py-8">
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Category</Label>
                            <Select onValueChange={(val) => setFormData({ ...formData, category: val as any })} defaultValue={formData.category}>
                                <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none font-bold px-6">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                    <SelectItem value="General">General Feedback</SelectItem>
                                    <SelectItem value="Work Environment">Work Environment</SelectItem>
                                    <SelectItem value="Management">Management Pulse</SelectItem>
                                    <SelectItem value="Policies">Company Policies</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Your Message</Label>
                            <Textarea
                                placeholder="Describe your suggestion or concern in detail..."
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="rounded-[2rem] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold p-8 min-h-[160px] italic shadow-inner"
                            />
                        </div>
                        <div className="flex items-center space-x-3 p-6 bg-indigo-50/50 rounded-[1.5rem] border-2 border-dashed border-indigo-100">
                            <input
                                type="checkbox"
                                id="anon"
                                checked={formData.anonymous}
                                onChange={e => setFormData({ ...formData, anonymous: e.target.checked })}
                                className="h-5 w-5 accent-[#CB9DF0] rounded-md transition-all"
                            />
                            <div className="flex flex-col">
                                <Label htmlFor="anon" className="font-black text-indigo-900 text-xs uppercase cursor-pointer">Post Anonymously</Label>
                                <span className="text-[10px] text-indigo-400 font-bold">Your identity will be hidden even from administrators.</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={handleSave}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-50 font-black border-none flex-1"
                        >
                            <Send className="mr-2 h-4 w-4" /> Send Feedback
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
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

export default EmployeeFeedbackEngagePage;
