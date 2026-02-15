"use client"

import React, { useState } from "react";
import {
    Settings2,
    Save,
    Plus,
    Trash2,
    ChevronRight,
    Clock,
    Shuffle,
    Bell,
    ShieldCheck,
    Zap,
    Activity,
    Database,
    Workflow,
    AlertTriangle,
    Mail,
    Smartphone,
    X,
    CheckCircle2,
    Lock,
    Globe,
    Layers,
    Tag,
    ListFilter,
    Gauge
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Separator } from "@/shared/components/ui/separator";
import { useHelpdeskStore } from "@/shared/data/helpdesk-store";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion } from "framer-motion";

const HelpdeskSettingsPage = () => {
    const { categories, slaRules, updateSLARule } = useHelpdeskStore();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("categories");

    const sections = [
        { id: "categories", label: "Categories & Routing", icon: Layers },
        { id: "sla", label: "SLA Policies", icon: Gauge },
        { id: "automations", label: "Auto-Assigned Rules", icon: Workflow },
        { id: "notifications", label: "Alert Templates", icon: Bell },
        { id: "access", label: "Functional Security", icon: ShieldCheck },
    ];

    const handleSave = (section: string) => {
        toast({ title: "Configuration Deployed", description: `${section.charAt(0).toUpperCase() + section.slice(1)} updates are now live across the desk.` });
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <Settings2 size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight uppercase">Operational Engine</h1>
                        <p className="text-sm font-medium text-slate-500">Configure global helpdesk protocols & triggers</p>
                    </div>
                </div>
                <Button onClick={() => handleSave(activeTab)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-6 font-bold gap-2 text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all">
                    <Save size={16} /> Deploy Changes
                </Button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Navigation Sidebar */}
                <div className="w-[280px] bg-white border-r border-slate-200 flex flex-col p-6 shrink-0">
                    <div className="space-y-1">
                        {sections.map((sec) => (
                            <button
                                key={sec.id}
                                onClick={() => setActiveTab(sec.id)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === sec.id ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <sec.icon size={18} className={activeTab === sec.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{sec.label}</span>
                                </div>
                                <ChevronRight size={14} className={`transition-transform duration-300 ${activeTab === sec.id ? 'rotate-90 opacity-100' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto p-4 bg-slate-900 rounded-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">Engine Version</span>
                            <span className="text-xs font-bold text-white block">V2.4.0 (Stable)</span>
                        </div>
                        <Activity size={60} className="absolute -right-4 -bottom-4 text-white/5 pointer-events-none group-hover:scale-110 transition-transform" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden bg-[#f1f5f9]/30">
                    <ScrollArea className="h-full">
                        <div className="max-w-4xl mx-auto p-12 lg:px-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-10 pb-20"
                                >
                                    {/* Categories Section */}
                                    {activeTab === "categories" && (
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Categorization & Logic</h2>
                                                <p className="text-sm font-medium text-slate-500">Define how tickets are classified and routed across departments.</p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                {categories.map((cat, i) => (
                                                    <Card key={i} className="rounded-2xl border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white">
                                                        <CardContent className="p-0">
                                                            <div className="p-6 flex items-center justify-between border-b border-slate-50">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                                                        {cat[0]}
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{cat}</h4>
                                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Mapping</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-slate-600 rounded-xl bg-slate-50"><Settings2 size={16} /></Button>
                                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-300 hover:text-rose-500 rounded-xl bg-slate-50"><Trash2 size={16} /></Button>
                                                                </div>
                                                            </div>
                                                            <div className="px-6 py-4 bg-slate-50/50 flex flex-wrap gap-2">
                                                                {["Sub-issue A", "Sub-issue B", "+ New Sub-category"].map((sub, j) => (
                                                                    <Badge key={j} className={`border-none font-bold text-[9px] h-6 px-3 uppercase tracking-widest ${sub.startsWith('+') ? 'bg-indigo-600 text-white cursor-pointer shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 shadow-sm'}`}>
                                                                        {sub}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                                <Button variant="outline" className="h-16 w-full rounded-2xl border-dashed border-2 border-slate-200 text-slate-400 font-bold uppercase tracking-widest text-[11px] gap-2 hover:bg-white hover:border-indigo-400 hover:text-indigo-600 transition-all">
                                                    <Plus size={16} /> Insert Functional Cluster
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* SLA Section */}
                                    {activeTab === "sla" && (
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Service Level Governance</h2>
                                                <p className="text-sm font-medium text-slate-500">Define response and resolution timelines based on priority matrices.</p>
                                            </div>

                                            <div className="space-y-4">
                                                {slaRules.map((rule, i) => (
                                                    <Card key={i} className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
                                                        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                                                            <div className="space-y-1">
                                                                <Badge className={`${rule.priority === 'Critical' ? 'bg-rose-50 text-rose-600' :
                                                                        rule.priority === 'High' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                                                    } font-black text-[9px] h-5 px-3 uppercase tracking-widest border-none`}>{rule.priority}</Badge>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Priority Class</p>
                                                            </div>

                                                            <div>
                                                                <div className="flex items-center gap-2 text-slate-900">
                                                                    <Clock size={16} className="text-indigo-600" />
                                                                    <span className="text-sm font-black">{rule.resolutionHours}h</span>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolution Gap</span>
                                                            </div>

                                                            <div className="md:col-span-2 flex items-center justify-end gap-6 border-l pl-8 border-slate-100">
                                                                <div className="flex flex-col items-end">
                                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Escalation Trigger</span>
                                                                    <Switch checked={true} />
                                                                </div>
                                                                <Button variant="outline" className="h-10 rounded-xl px-4 font-black text-[9px] uppercase tracking-widest border-slate-200">Reconfigure</Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>

                                            <div className="p-6 bg-slate-900 rounded-[32px] text-white flex items-center justify-between shadow-2xl overflow-hidden relative group">
                                                <div className="relative z-10 flex items-center gap-6">
                                                    <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-amber-400 animate-pulse">
                                                        <AlertTriangle size={28} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black tracking-tight uppercase leading-none mb-1">Impact Warning</h4>
                                                        <p className="text-xs font-medium text-slate-400 leading-relaxed italic">Reducing SLA hours may impact agent CSAT scores if workload is high.</p>
                                                    </div>
                                                </div>
                                                <ChevronRight size={24} className="relative z-10 text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-2" />
                                                <Zap size={140} className="absolute -right-10 -bottom-10 text-white/5 pointer-events-none group-hover:rotate-12 transition-transform duration-700" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Automations Tab */}
                                    {activeTab === "automations" && (
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Automation Workflow</h2>
                                                <p className="text-sm font-medium text-slate-500">Intelligent triggers to route tickets and maintain desk hygiene.</p>
                                            </div>

                                            <div className="space-y-4">
                                                {[
                                                    { title: "Smart Routing (Round Robin)", desc: "Distribute tickets equally among active agents", icon: Shuffle },
                                                    { title: "Auto-Close Inactive", desc: "Close resolved tickets after 48h of silence", icon: Save },
                                                    { title: "Sentiment Triage", desc: "Escalate tickets with negative sentiment automatically", icon: Activity }
                                                ].map((rule, i) => (
                                                    <Card key={i} className="rounded-2xl border-none shadow-sm bg-white overflow-hidden hover:shadow-lg transition-all">
                                                        <CardContent className="p-8 flex items-center justify-between">
                                                            <div className="flex items-center gap-6">
                                                                <div className="h-12 w-12 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                                                                    <rule.icon size={20} />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{rule.title}</h4>
                                                                    <p className="text-xs font-medium text-slate-500 mt-1">{rule.desc}</p>
                                                                </div>
                                                            </div>
                                                            <Switch checked={i === 0} />
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Notifications Tab */}
                                    {activeTab === "notifications" && (
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Alert Dispatch System</h2>
                                                <p className="text-sm font-medium text-slate-500">Configure multi-channel templates for stakeholder communication.</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Card className="rounded-[28px] border-none shadow-sm bg-white p-8 space-y-6">
                                                    <div className="flex items-center justify-between">
                                                        <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                                            <Mail size={18} />
                                                        </div>
                                                        <Switch checked />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Email Notifications</h4>
                                                        <p className="text-xs font-medium text-slate-400 mt-2 leading-relaxed italic">"You have a new support update regarding ticket # [TicketID]"</p>
                                                    </div>
                                                    <Button variant="outline" className="w-full h-11 bg-slate-50 border-slate-100 text-[10px] font-bold uppercase tracking-widest rounded-xl">Edit Template</Button>
                                                </Card>

                                                <Card className="rounded-[28px] border-none shadow-sm bg-white p-8 space-y-6 opacity-60">
                                                    <div className="flex items-center justify-between">
                                                        <div className="h-10 w-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shadow-sm">
                                                            <Smartphone size={18} />
                                                        </div>
                                                        <Switch checked={false} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight text-slate-400">Push & SMS</h4>
                                                            <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] h-4 font-bold uppercase px-2">Enterprise Plan Only</Badge>
                                                        </div>
                                                        <p className="text-xs font-medium text-slate-400 mt-2 leading-relaxed italic">Real-time mobile alerts for critical escalations.</p>
                                                    </div>
                                                    <Button disabled className="w-full h-11 bg-slate-100 text-slate-300 border-none text-[10px] font-bold uppercase tracking-widest rounded-xl font-black">Upgrade to Unlock</Button>
                                                </Card>
                                            </div>
                                        </div>
                                    )}

                                    {/* Access/Security Tab */}
                                    {activeTab === "access" && (
                                        <div className="space-y-8">
                                            <div className="space-y-2 text-rose-600">
                                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Functional Security</h2>
                                                <p className="text-sm font-medium text-slate-500">Govern access rights and sensitive data visibility protocols.</p>
                                            </div>

                                            <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden">
                                                <div className="p-8 space-y-8">
                                                    {[
                                                        { label: "Internal Notes Visibility", desc: "Allow employees to see internal agent discussions", val: false },
                                                        { label: "Recursive Deletion", desc: "Allow admins to delete tickets and history permanently", val: false },
                                                        { label: "IP Restriction", desc: "Restrict portal access to corporate VPN ranges only", val: true },
                                                        { label: "GDPR Anonymization", desc: "Auto-mask sensitive employee data after 1 year", val: true }
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between pb-6 border-b border-slate-50 last:border-none last:pb-0">
                                                            <div>
                                                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{item.label}</h4>
                                                                <p className="text-xs font-medium text-slate-400 mt-1">{item.desc}</p>
                                                            </div>
                                                            <Switch checked={item.val} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </Card>

                                            <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl border-dashed flex items-center gap-6">
                                                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                                                    <Lock size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="text-[11px] font-black text-rose-900 uppercase tracking-widest leading-none">Privacy Guard Active</h5>
                                                    <p className="text-[10px] font-medium text-rose-700/70 leading-relaxed mt-2 italic px-1">Your data is currently being handled under Global Standards. Contact IT for specialized custom overrides.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default HelpdeskSettingsPage;
