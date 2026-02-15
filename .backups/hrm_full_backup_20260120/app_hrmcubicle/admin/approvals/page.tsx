"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    GitBranch,
    Plus,
    Edit,
    Trash2,
    Power,
    PowerOff,
    Clock,
    Bell,
    CheckCircle2,
    AlertTriangle,
    ChevronRight
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/components/ui/use-toast";
import { useApprovalMatrixStore, type ApprovalFlow, type ApprovalLevel, type ApprovalType } from "@/shared/data/approval-matrix-store";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

const ApprovalMatrixPage = () => {
    const { toast } = useToast();
    const { flows, toggleFlowStatus, deleteFlow } = useApprovalMatrixStore();
    const [selectedType, setSelectedType] = useState<ApprovalType | 'All'>('All');

    const filteredFlows = selectedType === 'All'
        ? flows
        : flows.filter(f => f.type === selectedType);

    const stats = [
        { label: "Total Flows", value: flows.length, color: "bg-[#CB9DF0]", icon: <GitBranch className="text-slate-800" />, textColor: "text-slate-900" },
        { label: "Active", value: flows.filter(f => f.isActive).length, color: "bg-emerald-100", icon: <Power className="text-emerald-600" />, textColor: "text-emerald-900" },
        { label: "Inactive", value: flows.filter(f => !f.isActive).length, color: "bg-rose-100", icon: <PowerOff className="text-rose-600" />, textColor: "text-rose-900" },
        { label: "With Escalation", value: flows.filter(f => f.escalationRule?.enabled).length, color: "bg-[#FFF9BF]", icon: <Bell className="text-slate-800" />, textColor: "text-slate-900" },
    ];

    const getTypeColor = (type: ApprovalType) => {
        const colors: Record<ApprovalType, string> = {
            'Leave': 'bg-blue-100 text-blue-700',
            'Attendance': 'bg-purple-100 text-purple-700',
            'Expense': 'bg-emerald-100 text-emerald-700',
            'Asset': 'bg-amber-100 text-amber-700',
            'Exit': 'bg-rose-100 text-rose-700',
            'Payroll': 'bg-indigo-100 text-indigo-700'
        };
        return colors[type];
    };

    return (
        <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Approval Matrix</h1>
                    <p className="text-slate-500 font-medium">Configure multi-level approval workflows for various processes.</p>
                </div>

                <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                    <Plus className="mr-2 h-5 w-5" /> Create Workflow
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Filter Tabs */}
            <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as ApprovalType | 'All')} className="w-full">
                <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <TabsTrigger value="All" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">All</TabsTrigger>
                    <TabsTrigger value="Leave" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">Leave</TabsTrigger>
                    <TabsTrigger value="Attendance" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">Attendance</TabsTrigger>
                    <TabsTrigger value="Expense" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">Expense</TabsTrigger>
                    <TabsTrigger value="Asset" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">Asset</TabsTrigger>
                    <TabsTrigger value="Exit" className="rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white font-bold">Exit</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Approval Flows */}
            <div className="space-y-6">
                {filteredFlows.map((flow) => (
                    <Card key={flow.id} className="border-none shadow-xl hover:shadow-2xl transition-all rounded-[2.5rem] bg-white p-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Left: Flow Info */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-14 w-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                                            <GitBranch size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-xl text-slate-900">{flow.name}</h3>
                                            <p className="text-sm text-slate-500 font-medium">{flow.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${getTypeColor(flow.type)} border-none font-bold`}>
                                            {flow.type}
                                        </Badge>
                                        <Badge className={`${flow.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'} border-none font-bold`}>
                                            {flow.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Approval Levels Visualization */}
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Approval Flow</h4>
                                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                        {flow.levels.map((level, idx) => (
                                            <React.Fragment key={idx}>
                                                <div className="flex flex-col items-center min-w-[140px]">
                                                    <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center font-black text-indigo-600 border-2 border-indigo-200 shadow-sm">
                                                        L{level.level}
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-900 mt-2 text-center">{level.approverRole}</p>
                                                    {level.condition && (
                                                        <p className="text-[10px] text-slate-400 mt-1 text-center italic">{level.condition}</p>
                                                    )}
                                                    {level.isMandatory && (
                                                        <Badge className="mt-1 bg-rose-100 text-rose-700 text-[9px] border-none">Required</Badge>
                                                    )}
                                                </div>
                                                {idx < flow.levels.length - 1 && (
                                                    <ChevronRight className="text-slate-300 shrink-0" size={20} />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    {flow.escalationRule?.enabled && (
                                        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                                            <Clock className="text-amber-600" size={18} />
                                            <div>
                                                <p className="text-xs font-bold text-amber-900">Escalation</p>
                                                <p className="text-[10px] text-amber-700">After {flow.escalationRule.afterHours}h → {flow.escalationRule.escalateTo}</p>
                                            </div>
                                        </div>
                                    )}
                                    {flow.autoApprovalRules?.enabled && (
                                        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                                            <CheckCircle2 className="text-emerald-600" size={18} />
                                            <div>
                                                <p className="text-xs font-bold text-emerald-900">Auto-Approval</p>
                                                <p className="text-[10px] text-emerald-700">{flow.autoApprovalRules.conditions.length} rules active</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex lg:flex-col gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    className="rounded-xl border-slate-200 font-bold h-10"
                                    onClick={() => toast({ title: "Edit Flow", description: "Edit functionality coming soon" })}
                                >
                                    <Edit size={16} className="mr-2" /> Edit
                                </Button>
                                <Button
                                    variant="outline"
                                    className={`rounded-xl font-bold h-10 ${flow.isActive ? 'border-rose-200 text-rose-600 hover:bg-rose-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'}`}
                                    onClick={() => {
                                        toggleFlowStatus(flow.id);
                                        toast({ title: flow.isActive ? "Flow Deactivated" : "Flow Activated" });
                                    }}
                                >
                                    {flow.isActive ? <PowerOff size={16} className="mr-2" /> : <Power size={16} className="mr-2" />}
                                    {flow.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredFlows.length === 0 && (
                <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-sm">
                    <p className="text-slate-400 font-bold">No approval flows found for this category.</p>
                </div>
            )}
        </div>
    );
};

export default ApprovalMatrixPage;
