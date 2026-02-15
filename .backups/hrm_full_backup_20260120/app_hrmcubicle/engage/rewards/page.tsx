"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Trophy, Heart, Gift, Star, Award, Zap, Send, TrendingUp, Sparkles, User, ChevronRight, Clock } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useEngageStore } from "@/shared/data/engage-store";
import { motion, AnimatePresence } from "framer-motion";

const RewardsRecognitionPage = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("give-recognition");
    const { recognitions, userPoints, addRecognition, addPoints } = useEngageStore();

    // Form State
    const [formData, setFormData] = useState({ to: "", reason: "", award: "Thank You" });

    const awardTypes = [
        { icon: <Star className="h-5 w-5" />, label: "Thank You", color: "text-blue-500", bg: "bg-blue-50" },
        { icon: <Zap className="h-5 w-5" />, label: "Above & Beyond", color: "text-amber-500", bg: "bg-amber-50" },
        { icon: <Award className="h-5 w-5" />, label: "Values Hero", color: "text-purple-500", bg: "bg-purple-50" },
        { icon: <Heart className="h-5 w-5" />, label: "Team Player", color: "text-rose-500", bg: "bg-rose-50" }
    ];

    const handlePost = () => {
        if (!formData.to || !formData.reason) {
            toast({ title: "Validation Error", description: "Who are you praising and why?", variant: "destructive" });
            return;
        }

        addRecognition({
            from: "Sneha Reddy", // Mocking current user
            to: formData.to,
            reason: formData.reason,
            award: formData.award
        });

        addPoints(10);
        setFormData({ to: "", reason: "", award: "Thank You" });
        toast({ title: "Recognition Broadcasted!", description: "10 Karma points added to your profile." });
    };

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Rewards & Recognition</h1>
                    <p className="text-slate-500 font-medium italic">"Appreciation can change a day, even change a life."</p>
                </div>
                <div className="flex gap-4">
                    <Card className="h-14 px-6 rounded-2xl flex items-center gap-3 border-none bg-amber-50 shadow-sm">
                        <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-amber-700 animate-bounce" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 opacity-70">Karma Balance</span>
                            <span className="text-lg font-black text-amber-900 leading-none">{userPoints}</span>
                        </div>
                    </Card>
                    <Button
                        onClick={() => toast({ title: "Coming Soon", description: "The Rewards Boutique is opening next week!" })}
                        className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-14 px-8 shadow-xl shadow-purple-100 font-black border-none transition-all hover:scale-105"
                    >
                        <Gift className="mr-2 h-5 w-5" /> Visit Perks Store
                    </Button>
                </div>
            </div>

            {/* Dynamic Wall */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
                {/* Recognition Interface */}
                <div className="lg:col-span-12 xl:col-span-4 space-y-8">
                    <Card className="rounded-[3rem] border-none shadow-sm bg-white p-10">
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Share a Shoutout</h2>
                        <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed">Publicly recognize your colleagues for their outstanding work.</p>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Team Member</Label>
                                <div className="relative">
                                    <Input
                                        placeholder="Type name (e.g. Rahul Sharma)"
                                        value={formData.to}
                                        onChange={e => setFormData({ ...formData, to: e.target.value })}
                                        className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6 pl-12"
                                    />
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Choose an Award</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    {awardTypes.map((award, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setFormData({ ...formData, award: award.label })}
                                            className={`flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all border-4 ${formData.award === award.label
                                                    ? 'border-[#CB9DF0] bg-purple-50/50 scale-[1.05]'
                                                    : 'border-transparent bg-slate-50 hover:bg-slate-100'
                                                }`}
                                        >
                                            <div className={`p-3 rounded-2xl ${award.bg} ${award.color} mb-3 shadow-sm`}>
                                                {award.icon}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 line-clamp-1">{award.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Why do they deserve this?</Label>
                                <Textarea
                                    placeholder="Write a heartfelt message..."
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    className="rounded-[2rem] bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold p-8 min-h-[160px] italic shadow-inner"
                                />
                            </div>

                            <Button
                                onClick={handlePost}
                                className="w-full bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.5rem] h-16 shadow-2xl shadow-purple-50 font-black border-none flex-1 group"
                            >
                                <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Broadcast Praise
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Recognition Feed */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                    <div className="flex items-center justify-between px-6">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-amber-400" /> Wall of Fame
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sort by:</span>
                            <Badge className="bg-slate-50 text-slate-600 border-none rounded-lg h-7 font-black italic cursor-pointer">Recent First</Badge>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <AnimatePresence mode="popLayout">
                            {recognitions.map((rec, i) => (
                                <motion.div
                                    key={rec.id}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="rounded-[3rem] border-none shadow-sm bg-white p-8 relative overflow-hidden group hover:shadow-xl hover:shadow-purple-50 transition-all">
                                        <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
                                            <div className="h-20 w-20 shrink-0 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-2xl shadow-lg shadow-indigo-100">
                                                {rec.to.charAt(0)}
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <div>
                                                        <h4 className="text-xl font-black text-slate-900">{rec.to}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs font-black text-slate-400 italic">Recognized by {rec.from}</span>
                                                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter flex items-center gap-1.5">
                                                                <Clock className="h-3 w-3" /> {rec.date}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Badge className="bg-amber-50 text-amber-600 border-none font-black px-4 py-2 rounded-xl h-9 italic flex gap-2">
                                                        <Star className="h-3.5 w-3.5 fill-current" /> {rec.award}
                                                    </Badge>
                                                </div>
                                                <p className="text-slate-600 font-bold leading-relaxed italic text-sm border-l-4 border-indigo-100 pl-4 py-1 bg-slate-50/50 rounded-r-xl">
                                                    "{rec.reason}"
                                                </p>
                                                <div className="flex items-center gap-4 pt-2">
                                                    <Button variant="ghost" className="h-9 rounded-xl px-4 text-[10px] font-black uppercase text-slate-400 hover:text-rose-500 gap-2">
                                                        <Heart className="h-3 w-3" /> 24 High-Fives
                                                    </Button>
                                                    <Button variant="ghost" className="h-9 rounded-xl px-4 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-500 gap-2">
                                                        Add Comment
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Decorative background element */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/20 rounded-bl-[100%] blur-3xl group-hover:bg-indigo-100/30 transition-colors" />
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <Button variant="ghost" className="w-full h-16 rounded-[2rem] font-black text-slate-400 hover:bg-slate-50 gap-2">
                        Load more memories <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RewardsRecognitionPage;
