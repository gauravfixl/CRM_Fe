"use client";

import React, { useState } from "react";
import {
    GitPullRequest,
    CheckCircle2,
    XCircle,
    User,
    Shield,
    AlertTriangle,
    Plus,
    Hammer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const workflows = [
    {
        id: "wf-1",
        name: "High Value Transfers",
        trigger: "Transaction > $10,000",
        approvers: ["Finance Director", "CFO"],
        active: true,
        level: "Critical"
    },
    {
        id: "wf-2",
        name: "Firm Deletion",
        trigger: "Delete Business Unit",
        approvers: ["Org Owner"],
        active: true,
        level: "High"
    },
    {
        id: "wf-3",
        name: "Public Data Export",
        trigger: "Export List > 500 Records",
        approvers: ["Security Officer"],
        active: false,
        level: "Medium"
    },
];

export default function ApprovalPoliciesPage() {
    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <GitPullRequest className="w-6 h-6 text-slate-600" />
                        Approval Workflows
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Define multi-stakeholder sign-off chains for sensitive actions.</p>
                </div>
                <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold shadow-sm rounded-none">
                    <Plus className="w-4 h-4" />
                    New Workflow
                </Button>
            </div>

            {/* INTRO BANNER */}
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500 flex items-start gap-4 shadow-sm">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-blue-900 uppercase">Governor Mode Active</h4>
                    <p className="text-xs text-blue-800 leading-relaxed">
                        Workflows defined here act as "Gatekeepers". When a user attempts a restricted action, the operation is
                        paused and placed in a pending state until all required approvers grant consent.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {workflows.map((wf) => (
                    <Card key={wf.id} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-none overflow-hidden group">
                        <CardHeader className="bg-white border-b border-slate-100 p-5 flex flex-row items-center justify-between space-y-0">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-none ${wf.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Hammer className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-base font-bold text-slate-900">{wf.name}</CardTitle>
                                    <p className="text-xs font-mono text-slate-400 mt-0.5">{wf.id}</p>
                                </div>
                            </div>
                            <Badge variant={wf.active ? 'default' : 'secondary'} className={`rounded-none font-bold uppercase tracking-wider text-[10px] ${wf.active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {wf.active ? 'Enforced' : 'Disabled'}
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100">
                                <span className="text-xs font-bold uppercase text-slate-500">Trigger Event</span>
                                <span className="text-sm font-bold text-slate-900">{wf.trigger}</span>
                            </div>

                            <div className="space-y-3">
                                <span className="text-xs font-bold uppercase text-slate-400 tracking-widest block">Required Signatories</span>
                                <div className="flex flex-col gap-2">
                                    {wf.approvers.map((approver, idx) => (
                                        <div key={idx} className="flex items-center gap-3 relative">
                                            {/* Connector Line */}
                                            {idx !== wf.approvers.length - 1 && (
                                                <div className="absolute left-[15px] top-8 h-6 w-px bg-slate-300" />
                                            )}

                                            <div className="z-10 h-8 w-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-700 bg-white px-2 border border-dashed border-slate-300 rounded-sm">
                                                {approver}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 p-4 border-t border-slate-100 flex justify-between items-center">
                            <Badge variant="outline" className={`rounded-none border-none font-bold uppercase gap-1 ${wf.level === 'Critical' ? 'text-red-600' : wf.level === 'High' ? 'text-amber-600' : 'text-blue-600'}`}>
                                <AlertTriangle className="w-3 h-3" /> {wf.level} Severity
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase text-slate-400 hover:text-blue-600">
                                Edit Chain
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
