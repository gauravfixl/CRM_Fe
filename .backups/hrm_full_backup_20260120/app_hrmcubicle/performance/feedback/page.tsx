"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { MessageSquare, Heart, Shield, Send, MoreHorizontal, User } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";

const PerformanceFeedbackPage = () => {
    const [activeTab, setActiveTab] = useState("received-feedback");
    const { toast } = useToast();

    const feedbacks = [
        { id: "FB01", from: "Rajesh Kumar", content: "Great job on the UI redesign of the dashboard. The accessibility features are top-notch!", date: "2 days ago", type: "Appreciation" },
        { id: "FB02", from: "Sneha Reddy", content: "Your documentation for the new API endpoints was very clear and helpful for the frontend team.", date: "1 week ago", type: "Positive" },
        { id: "FB03", from: "Anonymous", content: "Please try to be more vocal in team meetings, your insights are valuable.", date: "2 weeks ago", type: "Constructive" }
    ];

    const TypeBadge = ({ type }: { type: string }) => {
        const styles: Record<string, string> = {
            "Appreciation": "bg-pink-100 text-pink-700",
            "Positive": "bg-green-100 text-green-700",
            "Constructive": "bg-blue-100 text-blue-700"
        };
        return <Badge variant="outline" className={`${styles[type]} border-none text-[10px] uppercase font-bold`}>{type}</Badge>;
    };

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 h-full flex flex-col bg-slate-50/50 overflow-y-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Continuous Feedback</h2>
                    <p className="text-slate-500 text-sm mt-1">Real-time appreciation and constructive feedback loop.</p>
                </div>
                <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={() => toast({ title: "Give Feedback", description: "Opening feedback composer..." })}>
                    <Send className="mr-2 h-4 w-4" /> Give Feedback
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-transparent p-0 gap-6 border-b border-transparent w-full overflow-x-auto justify-start h-auto rounded-none">
                    {["Give Feedback", "Received Feedback", "Requested Feedback", "Anonymous"].map((tab) => (
                        <TabsTrigger
                            key={tab.toLowerCase().replace(" ", "-")}
                            value={tab.toLowerCase().replace(" ", "-")}
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#6366f1] data-[state=active]:text-[#6366f1] rounded-none px-1 py-3 text-slate-500 font-medium whitespace-nowrap"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Received Feedback Tab */}
                <TabsContent value="received-feedback" className="space-y-4">
                    <div className="grid gap-4">
                        {feedbacks.map((fb) => (
                            <Card key={fb.id} className="shadow-sm border-slate-200 group hover:border-[#6366f1] transition-all">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-slate-100">
                                                <AvatarFallback className="bg-indigo-50 text-[#6366f1] font-bold">
                                                    {fb.from === "Anonymous" ? "?" : fb.from.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-slate-900">{fb.from}</h4>
                                                    <TypeBadge type={fb.type} />
                                                </div>
                                                <p className="text-xs text-slate-500">{fb.date}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100 italic text-slate-700 leading-relaxed relative">
                                        <MessageSquare className="h-4 w-4 text-slate-300 absolute -top-2 -left-2 bg-white" />
                                        "{fb.content}"
                                    </div>
                                    <div className="mt-4 flex gap-4">
                                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-pink-600">
                                            <Heart className="h-4 w-4 mr-1" /> Thank
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Give Feedback Tab */}
                <TabsContent value="give-feedback" className="space-y-4">
                    <Card className="shadow-sm border-slate-200 max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Share Feedback</CardTitle>
                            <CardDescription>Give praise or suggestions to your colleagues.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Who are you giving feedback to?</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <input placeholder="Search for colleague..." className="w-full pl-10 h-10 rounded-md border border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Feedback Category</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {["Positive", "Appreciation", "Constructive"].map(cat => (
                                        <Button key={cat} variant="outline" className="h-20 flex-col gap-2 hover:border-[#6366f1] hover:bg-indigo-50">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${cat === "Positive" ? "bg-green-100" : cat === "Appreciation" ? "bg-pink-100" : "bg-blue-100"}`}>
                                                {cat === "Positive" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : cat === "Appreciation" ? <Heart className="h-4 w-4 text-pink-600" /> : <MessageSquare className="h-4 w-4 text-blue-600" />}
                                            </div>
                                            <span className="text-xs">{cat}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Your Message</label>
                                <textarea placeholder="Write something meaningful..." className="w-full min-h-[120px] p-3 rounded-md border border-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-slate-400" />
                                    <span className="text-xs text-slate-500">Visible to: Recipient & Manager</span>
                                </div>
                                <Button className="bg-[#6366f1] hover:bg-[#5558e6]" onClick={() => toast({ title: "Feedback Sent", description: "Your feedback has been shared successfully." })}>
                                    Send Feedback
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Anonymous Feedback Tab */}
                <TabsContent value="anonymous" className="space-y-4">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="bg-slate-900 border-none rounded-t-lg">
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield className="h-5 w-5 text-indigo-400" /> Secure Anonymous Channel
                            </CardTitle>
                            <CardDescription className="text-indigo-200/70">Highest level of privacy for sensitive feedback.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-4">
                                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                                    <Shield className="h-8 w-8 text-slate-400" />
                                </div>
                                <div className="max-w-md mx-auto">
                                    <h3 className="text-lg font-bold text-slate-900">Your Identity is Protected</h3>
                                    <p className="text-sm text-slate-500 mt-2">Feedback sent through this channel will never reveal your name or employee ID to anyone, including HR and Management.</p>
                                </div>
                                <Button className="mt-4" variant="secondary">Launch Anonymous Box</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PerformanceFeedbackPage;
