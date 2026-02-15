"use client";

import React, { useState } from "react";
import {
    CheckCircle2,
    Circle,
    CalendarCheck,
    ArrowRight,
    PartyPopper,
    Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const steps = [
    { id: 1, title: "Company Profile", desc: "Set up logo and contact details", completed: true },
    { id: 2, title: "Domain Verification", desc: "Verify ownership of your domain", completed: true },
    { id: 3, title: "Invite Administrators", desc: "Add key stakeholders", completed: false },
    { id: 4, title: "Configure Billing", desc: "Add payment method", completed: false },
    { id: 5, title: "Data Region", desc: "Select primary data residency", completed: true },
];

export default function OnboardingPage() {
    const completedCount = steps.filter(s => s.completed).length;
    const progress = (completedCount / steps.length) * 100;

    const handleComplete = (title: string) => {
        toast.success(`Action initiated: ${title}`);
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Onboarding Checklist</h1>
                    <p className="text-sm text-slate-500 mt-1">Complete these steps to fully activate your organization.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* PROGRESS CARD */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-md rounded-none overflow-hidden hover:shadow-lg transition-shadow bg-blue-600 text-white relative">
                        <div className="absolute top-0 right-0 p-12 bg-white opacity-10 rounded-full translate-x-10 translate-y-[-50%]" />

                        <div className="p-8 flex flex-col items-center text-center space-y-6 relative z-10">
                            <div className="relative">
                                <PartyPopper className={`w-16 h-16 ${progress === 100 ? 'text-yellow-300 animate-bounce' : 'text-blue-200'}`} />
                            </div>

                            <div className="space-y-2 max-w-lg">
                                <h2 className="text-2xl font-black">{progress === 100 ? "You're all set!" : "Let's get you started"}</h2>
                                <p className="text-blue-100">
                                    {progress === 100
                                        ? "Your organization is fully configured and ready for production use."
                                        : `You have completed ${completedCount} out of ${steps.length} recommended setup tasks.`}
                                </p>
                            </div>

                            <div className="w-full max-w-md space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-blue-200">
                                    <span>Progress</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-3 bg-blue-800 rounded-none" indicatorClassName="bg-white" />
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-sm rounded-none">
                        <CardHeader className="border-b border-slate-100 p-6 bg-white">
                            <CardTitle className="text-lg font-bold text-slate-900">Action Items</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {steps.map((step) => (
                                    <div key={step.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                                                {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold ${step.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{step.title}</h4>
                                                <p className="text-xs text-slate-500">{step.desc}</p>
                                            </div>
                                        </div>
                                        {!step.completed && (
                                            <Button
                                                size="sm"
                                                className="bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-none gap-2 opacity-0 group-hover:opacity-100 transition-all"
                                                onClick={() => handleComplete(step.title)}
                                            >
                                                Start <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* HELP SIDEBAR */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm rounded-none bg-emerald-50/50">
                        <CardHeader className="p-6 pb-2">
                            <div className="h-10 w-10 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full mb-4">
                                <CalendarCheck className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-base font-bold text-emerald-900">Schedule a Demo</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <p className="text-sm text-emerald-800 leading-relaxed mb-4">
                                Need help configuring complex workflows? Book a session with our solutions engineer.
                            </p>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-none">
                                Book Now
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm rounded-none bg-white">
                        <CardHeader className="p-6 pb-2">
                            <div className="h-10 w-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-full mb-4">
                                <Send className="w-5 h-5" />
                            </div>
                            <CardTitle className="text-base font-bold text-slate-900">Contact Support</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2">
                            <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                Stuck on a step? Our support team is available 24/7 to assist you.
                            </p>
                            <Button variant="outline" className="w-full font-bold rounded-none border-slate-200">
                                Open Ticket
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
