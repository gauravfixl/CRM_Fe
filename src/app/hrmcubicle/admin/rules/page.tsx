"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap,
    AlertCircle,
    Bell,
    Clock,
    ArrowRight,
    ShieldCheck,
    Smartphone,
    Mail,
    UserPlus,
    UserMinus,
    Trophy,
    Cake,
    Briefcase,
    Calendar,
    Settings,
    Plus,
    Trash2,
    ToggleLeft,
    ChevronRight,
    Search,
    Filter,
    Play
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/components/ui/use-toast";

interface PolicyRule {
    id: string;
    name: string;
    description: string;
    category: 'Attendance' | 'Leave' | 'Engagement' | 'Security' | 'Payroll';
    trigger: string;
    action: string;
    isActive: boolean;
    lastRun?: string;
}

const INITIAL_RULES: PolicyRule[] = [
    {
        id: "rule-1",
        name: "Late Arrival Notification",
        description: "Auto-notify manager when an employee is late 3 times in a rolling month.",
        category: "Attendance",
        trigger: "Late Mark Count > 3",
        action: "Send Email Notification to Manager",
        isActive: true,
        lastRun: "2026-01-25 09:30 AM"
    },
    {
        id: "rule-2",
        name: "Automatic Leave Deduction",
        description: "Deduct 0.5 days from Casual Leave for missing punch-out without approval.",
        category: "Attendance",
        trigger: "Missing Punch-Out",
        action: "Deduct 0.5 CL & Post to Payroll",
        isActive: false
    },
    {
        id: "rule-3",
        name: "Birthday Celebration",
        description: "Post a celebratory message on the 'Engage' wall and send a push notification.",
        category: "Engagement",
        trigger: "Current Date = DOB",
        action: "Post to Wall + Push Notification",
        isActive: true,
        lastRun: "2026-01-26 08:00 AM"
    },
    {
        id: "rule-4",
        name: "Probation Expiry Alert",
        description: "Notify HR Admin 15 days before an employee's probation period ends.",
        category: "Security",
        trigger: "Days to Probation End = 15",
        action: "HR Priority Dashboard Alert",
        isActive: true,
        lastRun: "2026-01-24 10:15 AM"
    },
    {
        id: "rule-5",
        name: "Welcome Kit Trigger",
        description: "Generate IT asset request when employee status changes to 'Joined'.",
        category: "Security",
        trigger: "Status = Joined",
        action: "Create IT Ticket + Notify IT Manager",
        isActive: true
    },
    {
        id: "rule-6",
        name: "Overtime Approval Bypass",
        description: "Auto-approve overtime requests less than 2 hours for 'Senior' designations.",
        category: "Payroll",
        trigger: "OT Hours < 2 & Designation = Senior",
        action: "Auto-Approve + Payroll Sync",
        isActive: false
    }
];

const AutomationRulesPage = () => {
    const { toast } = useToast();
    const [rules, setRules] = useState<PolicyRule[]>(INITIAL_RULES);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categories = ["All", "Attendance", "Leave", "Engagement", "Security", "Payroll"];

    const toggleRule = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
        const rule = rules.find(r => r.id === id);
        toast({
            title: rule?.isActive ? "Rule Disabled" : "Rule Enabled",
            description: `${rule?.name} automation is now ${rule?.isActive ? 'off' : 'on'}.`,
        });
    };

    const runRuleManually = (name: string) => {
        toast({
            title: "Rule Triggered Manually",
            description: `Manual execution of '${name}' completed successfully.`,
        });
    };

    const deleteRule = (id: string) => {
        setRules(rules.filter(r => r.id !== id));
        toast({ title: "Rule Deleted", variant: "destructive" });
    };

    const filteredRules = rules.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = selectedCategory === "All" || r.category === selectedCategory;
        return matchesSearch && matchesCat;
    });

    const getCategoryIcon = (cat: string) => {
        switch (cat) {
            case 'Attendance': return Clock;
            case 'Leave': return Calendar;
            case 'Engagement': return Trophy;
            case 'Security': return ShieldCheck;
            case 'Payroll': return Briefcase;
            default: return Zap;
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden" style={{ zoom: '0.8' }}>
            {/* Header */}
            <header className="h-24 px-10 flex justify-between items-center bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Automation Engine</h1>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">HR Policy & Workflow Robotics (Layer 3)</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50">
                        <Settings size={18} className="mr-2" /> Global Config
                    </Button>
                    <Button className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xl shadow-indigo-100">
                        <Plus size={20} className="mr-2" /> Create New Automation
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-10 flex flex-col gap-8 overflow-hidden">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-4 gap-6 shrink-0">
                    {[
                        { label: "Active Automations", value: rules.filter(r => r.isActive).length, color: "text-indigo-600", bg: "bg-indigo-50", icon: Zap },
                        { label: "Executed (24h)", value: "1,248", color: "text-emerald-600", bg: "bg-emerald-50", icon: Play },
                        { label: "Warnings/Fails", value: "3", color: "text-rose-600", bg: "bg-rose-50", icon: AlertCircle },
                        { label: "Man-hours Saved", value: "342h", color: "text-amber-600", bg: "bg-amber-50", icon: Trophy }
                    ].map((stat, i) => (
                        <Card key={i} className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden group hover:shadow-md transition-all">
                            <CardContent className="p-6 flex items-center gap-5 text-start">
                                <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                                    <h3 className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-6 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 shrink-0">
                    <div className="relative flex-1">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <Input
                            className="h-14 pl-16 rounded-2xl bg-slate-50 border-none w-full font-bold text-lg placeholder:italic transition-all shadow-inner focus:bg-white focus:ring-2 focus:ring-indigo-100"
                            placeholder="Search automation rules or triggers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-6 py-3 rounded-xl font-bold text-xs transition-all tracking-tight h-11
                                    ${selectedCategory === cat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rules List */}
                <ScrollArea className="flex-1 -mx-4 px-4 overflow-y-auto">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-10">
                        <AnimatePresence mode="popLayout">
                            {filteredRules.map((rule, i) => {
                                const Icon = getCategoryIcon(rule.category);
                                return (
                                    <motion.div
                                        key={rule.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card className={`border-2 transition-all rounded-[2.5rem] bg-white overflow-hidden shadow-sm group ${rule.isActive ? 'border-indigo-100' : 'border-slate-100 opacity-70'}`}>
                                            <CardContent className="p-0">
                                                <div className="p-8">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${rule.isActive ? 'bg-indigo-600 text-white ring-8 ring-indigo-50' : 'bg-slate-200 text-slate-500'}`}>
                                                                <Icon size={24} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{rule.name}</h3>
                                                                    <Badge className={`${rule.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'} border-none text-[10px] font-black tracking-widest px-3 h-5`}>
                                                                        {rule.isActive ? 'RUNNING' : 'PAUSED'}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-sm font-medium text-slate-500 max-w-[400px] leading-relaxed italic line-clamp-2">
                                                                    "{rule.description}"
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Switch
                                                            checked={rule.isActive}
                                                            onCheckedChange={() => toggleRule(rule.id)}
                                                            className="data-[state=checked]:bg-indigo-600"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                                                    <ToggleLeft size={12} />
                                                                </div>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trigger Condition</span>
                                                            </div>
                                                            <p className="text-sm font-bold text-slate-700 font-mono bg-white px-3 py-2 rounded-lg border border-slate-200/50">
                                                                {rule.trigger}
                                                            </p>
                                                        </div>
                                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                                    <Zap size={12} />
                                                                </div>
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Automated Action</span>
                                                            </div>
                                                            <p className="text-sm font-bold text-indigo-600 font-mono bg-white px-3 py-2 rounded-lg border border-indigo-100/50">
                                                                {rule.action}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50/50 px-8 py-4 border-t border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        {rule.lastRun && (
                                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                                <Clock size={14} />
                                                                Last active: {rule.lastRun}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="font-bold text-xs text-indigo-600 hover:bg-white rounded-lg h-9 px-4 gap-2 border border-transparent hover:border-slate-200"
                                                            onClick={() => runRuleManually(rule.name)}
                                                        >
                                                            <Play size={14} /> Run Now
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                                            onClick={() => deleteRule(rule.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* Blank Slate / Create New Card */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50/10 transition-all gap-4 min-h-[300px]"
                        >
                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-indigo-400 transition-colors">
                                <Plus size={40} />
                            </div>
                            <div className="text-center">
                                <h4 className="text-xl font-bold tracking-tight">Create Custom Rule</h4>
                                <p className="text-sm font-medium opacity-70">Design complex IF-THIS-THEN-THAT logic</p>
                            </div>
                        </motion.button>
                    </div>
                </ScrollArea>
            </main>
        </div>
    );
};

export default AutomationRulesPage;
