"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    Trophy,
    Star,
    Plus,
    Coins,
    Crown,
    Sparkles,
    Zap,
    Users,
    ChevronRight,
    Gift,
    Medal,
    Target,
    TrendingUp,
    Heart,
    Search,
    Flame,
    Rocket,
    Send,
    Award,
    PartyPopper,
    Milestone,
    SearchX
} from "lucide-react";
import { useEngageStore, type Recognition } from "@/shared/data/engage-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const RewardsPage = () => {
    const { recognitions, addRecognition, userPoints } = useEngageStore();
    const { toast } = useToast();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState<Partial<Recognition>>({
        recipient: "",
        sender: "HR Admin",
        reason: "",
        awardType: "Values Hero",
        points: 50,
        category: "Peer"
    });

    const categories: Recognition["category"][] = ["Peer", "Manager", "Company"];

    const handleSave = () => {
        if (!formData.recipient || !formData.reason) {
            toast({ title: "Incomplete Shoutout", description: "Who are we celebrating, and why?", variant: "destructive" });
            return;
        }
        addRecognition(formData as Omit<Recognition, "id" | "date" | "status">);
        toast({
            title: "Success! 🎊",
            description: `${formData.recipient} has been celebrated on the Victory Wall!`,
            className: "bg-amber-500 text-white font-black"
        });
        setIsDialogOpen(false);
        setFormData({ recipient: "", sender: "HR Admin", reason: "", awardType: "Values Hero", points: 50, category: "Peer" });
    };

    const filteredRecognitions = recognitions.filter(r =>
        r.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-[#fcfdff] overflow-hidden" style={{ zoom: "80%" }}>
            {/* Victory Header */}
            <div className="px-8 py-10 bg-gradient-to-br from-[#854d0e] via-[#b45309] to-[#d97706] text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-[-10%] right-[-5%] opacity-10 rotate-12">
                    <Trophy size={280} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Crown className="text-amber-300 fill-amber-300 h-6 w-6" />
                            <span className="text-[10px] font-bold tracking-[0.4em] text-amber-200">The Victory Wall</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tighter leading-none mb-4">Celebrating Our<br />Culture Icons</h1>
                        <p className="text-white/70 font-bold text-sm max-w-md">Every shoutout is a building block of our amazing team spirit.</p>
                    </div>
                    <div className="flex flex-col items-end gap-5">
                        <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/20 flex flex-col items-center min-w-[160px] shadow-2xl">
                            <span className="text-[10px] font-bold capitalize text-white/60 mb-1 tracking-widest">Your Points</span>
                            <div className="flex items-center gap-2">
                                <Coins size={24} className="text-amber-300 fill-amber-300" />
                                <span className="text-2xl font-bold text-amber-300 tracking-tighter">{userPoints}</span>
                            </div>
                        </div>
                        <Button onClick={() => setIsDialogOpen(true)} className="bg-white text-amber-900 hover:bg-white/90 rounded-[1.5rem] h-14 px-10 font-bold text-xs tracking-widest shadow-2xl transition-all active:scale-95 border-none">
                            <Plus className="mr-2 h-5 w-5" /> Award Points
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-8 space-y-10">
                    {/* Horizontal Victory Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* High Flyers Hub */}
                        <Card className="p-5 bg-amber-50/50 rounded-[2.5rem] border-2 border-amber-200 shadow-sm flex flex-col justify-center gap-3">
                            <h2 className="text-[10px] font-bold text-slate-400 tracking-[0.3em] flex items-center gap-2 italic capitalize">
                                <Rocket className="text-amber-600" size={16} /> High Flyers
                            </h2>
                            <div className="flex -space-x-2 overflow-hidden py-1">
                                {[
                                    { name: "Rahul", avatar: "RS", color: "bg-slate-900 text-white" },
                                    { name: "Sneha", avatar: "SR", color: "bg-amber-500 text-white" },
                                    { name: "Vikram", avatar: "VS", color: "bg-indigo-500 text-white" }
                                ].map((u, i) => (
                                    <div key={i} className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold border-2 border-white shadow-lg ${u.color}`} title={u.name}>
                                        {u.avatar}
                                    </div>
                                ))}
                                <div className="h-10 w-10 rounded-xl bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm">+12</div>
                            </div>
                        </Card>

                        {/* Global Impact Center */}
                        <Card className="p-5 bg-amber-100/60 rounded-[2.5rem] border-2 border-amber-200 shadow-sm flex flex-col justify-center gap-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-bold text-amber-800 tracking-widest capitalize">Total Shoutouts</p>
                                    <p className="text-2xl font-bold text-amber-900 tracking-tighter">1,244</p>
                                </div>
                                <TrendingUp className="text-emerald-500 h-8 w-8" />
                            </div>
                            <div className="h-1.5 w-full bg-white/50 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} className="h-full bg-gradient-to-r from-amber-500 to-amber-600" />
                            </div>
                        </Card>

                        {/* Be a Spark - Horizontalized */}
                        <Card className="bg-amber-500 rounded-[2.5rem] p-5 text-white relative overflow-hidden group shadow-xl flex flex-col justify-center">
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold mb-0.5">Be a Spark!</h3>
                                <p className="text-[9px] text-white/70 mb-3 line-clamp-1 italic">Nominate for a badge now</p>
                                <Button onClick={() => setIsDialogOpen(true)} className="w-full bg-white text-amber-900 rounded-xl h-9 font-bold text-[10px] tracking-widest border-none hover:bg-white/95 capitalize transition-all active:scale-95">Start Recognition</Button>
                            </div>
                            <Sparkles className="absolute bottom-[-10px] right-[-10px] h-20 w-20 text-white/20" />
                        </Card>
                    </div>

                    {/* Main Feed Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <h2 className="text-xs font-black text-slate-300 tracking-[0.3em] flex items-center gap-3 capitalize">
                            <Sparkles size={18} className="text-amber-500" /> Recent Shoutouts
                        </h2>
                        <div className="relative group w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <Input
                                placeholder="Find a winner..."
                                className="h-12 pl-12 rounded-2xl border-slate-200 bg-white shadow-sm font-bold text-slate-900 focus:ring-4 focus:ring-amber-50 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Victory Wall Grid - Full Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
                        <AnimatePresence mode="popLayout">
                            {filteredRecognitions.map((rec, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card className="group relative rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden p-0 h-full flex flex-col">
                                        {/* Award Label */}
                                        <div className="bg-amber-50/50 px-6 py-3 border-b border-amber-100/20 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Award size={14} className="text-amber-600" />
                                                <span className="text-[10px] font-black tracking-[0.2em] text-amber-600 capitalize">{rec.awardType}</span>
                                            </div>
                                            <Badge className="bg-amber-500 text-white border-none font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg">+{rec.points} PTS</Badge>
                                        </div>

                                        <CardContent className="p-6 flex-col flex-1 flex">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="h-12 w-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center text-amber-600 shadow-inner group-hover:scale-110 transition-transform">
                                                    <Flame size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-black text-slate-900 leading-none mb-1 tracking-tight">Shoutout to {rec.recipient}!</h3>
                                                    <p className="text-[9px] font-black text-slate-400 tracking-widest capitalize">By {rec.sender}</p>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex-1 mb-6 italic text-sm font-bold text-slate-600 leading-relaxed">
                                                &ldquo;{rec.reason}&rdquo;
                                            </div>

                                            <div className="mt-auto flex items-center justify-between">
                                                <Badge variant="outline" className="border-slate-200 text-slate-400 font-bold tracking-widest text-[8px] px-2 py-0.5 capitalize">{rec.category}</Badge>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-rose-50 hover:text-rose-500 transition-all text-slate-300">
                                                        <Heart size={16} />
                                                    </Button>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-amber-50 hover:text-amber-500 transition-all text-slate-300">
                                                        <PartyPopper size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Standardized Recognition Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-5xl p-0 overflow-hidden border-2 border-slate-300 rounded-[3rem] shadow-3xl bg-white" style={{ zoom: "67%" }}>
                    <div className="bg-gradient-to-br from-[#854d0e] to-[#b45309] p-10 text-white">
                        <DialogHeader>
                            <div className="flex items-center gap-6 mb-2">
                                <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                                    <Trophy size={32} />
                                </div>
                                <div>
                                    <DialogTitle className="text-3xl font-bold tracking-tighter text-white">Crown a Colleague</DialogTitle>
                                    <DialogDescription className="text-white/40 font-medium text-xs tracking-widest mt-2 capitalize">Recognize greatness in the organization</DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                    </div>

                    <ScrollArea className="max-h-[70vh]">
                        <div className="p-10 space-y-10">
                            {/* Horizontal Grid for Recognition Fields */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {/* Left Side: Meta Details */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1 capitalize">The Hero (Recipient)</Label>
                                        <Input
                                            placeholder="e.g. Rahul Sharma"
                                            value={formData.recipient}
                                            onChange={e => setFormData({ ...formData, recipient: e.target.value })}
                                            className="h-16 border-slate-300 bg-slate-50/50 rounded-2xl px-6 font-black text-lg text-slate-900 focus:ring-4 focus:ring-amber-50 transition-all shadow-inner"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1 capitalize">Badge Type</Label>
                                            <Select value={formData.awardType} onValueChange={(v) => setFormData({ ...formData, awardType: v })}>
                                                <SelectTrigger className="h-14 border-slate-300 bg-white rounded-2xl px-6 font-bold text-slate-600"><SelectValue /></SelectTrigger>
                                                <SelectContent className="rounded-2xl border-none shadow-2xl font-bold">
                                                    <SelectItem value="Values Hero" className="rounded-xl my-1">Values Hero</SelectItem>
                                                    <SelectItem value="Star Performer" className="rounded-xl my-1">Star Performer</SelectItem>
                                                    <SelectItem value="Team Player" className="rounded-xl my-1">Team Player</SelectItem>
                                                    <SelectItem value="Innovation King" className="rounded-xl my-1">Innovation King</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1 capitalize">Appreciation Tier</Label>
                                            <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as any })}>
                                                <SelectTrigger className="h-14 border-slate-300 bg-white rounded-2xl px-6 font-bold text-slate-600"><SelectValue /></SelectTrigger>
                                                <SelectContent className="rounded-2xl border-none shadow-2xl font-bold">
                                                    <SelectItem value="Peer" className="rounded-xl my-1">Peer Shoutout</SelectItem>
                                                    <SelectItem value="Manager" className="rounded-xl my-1">Manager Spotlight</SelectItem>
                                                    <SelectItem value="Company" className="rounded-xl my-1">Company Milestone</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: The Citation */}
                                <div className="space-y-4 flex flex-col h-full">
                                    <Label className="text-[10px] font-black text-slate-400 tracking-widest ml-1 capitalize">The Citation (Why?)</Label>
                                    <Textarea
                                        placeholder="Tell the story of their legend..."
                                        value={formData.reason}
                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                        className="flex-1 min-h-[160px] border-slate-300 bg-slate-50/50 rounded-[2rem] p-6 font-bold text-sm leading-relaxed focus:ring-4 focus:ring-amber-50 resize-none shadow-inner"
                                    />
                                </div>
                            </div>

                            {/* Award Points Summary */}
                            <div className="p-8 bg-slate-900 rounded-[3rem] border-2 border-slate-300 flex items-center justify-between shadow-2xl overflow-hidden relative">
                                <div className="flex items-center gap-6 text-white relative z-10">
                                    <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-amber-500 shadow-inner border border-white/10">
                                        <Zap size={32} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black tracking-[0.2em] text-amber-500 capitalize">Culture Boost</span>
                                        <span className="text-xs font-bold text-white/40 italic">Fixed point allocation for this achievement</span>
                                    </div>
                                </div>
                                <div className="text-5xl font-black text-white relative z-10">+{formData.points} <span className="text-xs text-amber-500 uppercase tracking-widest">Pts</span></div>
                                <Sparkles className="absolute right-[-20px] top-[-20px] h-40 w-40 text-white/5" />
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-14 px-8 font-black text-slate-400 text-[10px] capitalize tracking-[0.2em] hover:text-slate-600">Cancel</Button>
                        <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700 text-white rounded-[1.5rem] h-14 px-12 font-black text-xs tracking-widest shadow-xl flex-1">
                            Cast Recognition 🏆
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RewardsPage;
