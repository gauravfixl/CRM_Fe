"use client";

import { useState } from "react";
import {
    Settings,
    Plus,
    Save,
    Workflow,
    Mail,
    Activity,
    TrendingUp,
    Edit3,
    Trash2,
    Copy,
    CheckCircle,
    Target,
    Briefcase,
    UserPlus,
    UserCheck,
    LayoutDashboard,
    Zap,
    MoreVertical,
    GripVertical,
    ChevronRight,
    Search,
    ShieldAlert,
    Database,
    Lock,
    Globe,
    Bot,
} from "lucide-react";
import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CRMGlobalSettingsPage() {
    // State Management
    const [leadStages, setLeadStages] = useState([
        { id: "1", name: "New Lead", color: "bg-blue-500", description: "Freshly imported or submitted lead" },
        { id: "2", name: "Contacted", color: "bg-cyan-500", description: "Initial outreach completed" },
        { id: "3", name: "Qualified", color: "bg-emerald-500", description: "Lead meets MQL criteria" },
        { id: "4", name: "Lost", color: "bg-red-500", description: "Lead is no longer interested" },
    ]);

    const [dealStages, setDealStages] = useState([
        { id: "1", name: "Draft", probability: 10, active: true },
        { id: "2", name: "Proposal Sent", probability: 30, active: true },
        { id: "3", name: "Negotiation", probability: 70, active: true },
        { id: "4", name: "Closed Won", probability: 100, active: true },
    ]);

    const [clientCategories, setClientCategories] = useState([
        { id: "1", name: "Enterprise", discount: "15%", portal: true },
        { id: "2", name: "SME", discount: "5%", portal: true },
        { id: "3", name: "Standard", discount: "0%", portal: false },
    ]);

    const [automation, setAutomation] = useState({
        roundRobin: true,
        autoScoring: true,
        botCheck: true,
        forecasting: false,
        aiAnswering: true,
        autoNurture: false,
    });

    const [isAddStageOpen, setIsAddStageOpen] = useState(false);
    const [newStage, setNewStage] = useState({ name: "", color: "bg-blue-500", description: "" });

    const handleToggle = (key: keyof typeof automation) => {
        setAutomation(prev => ({ ...prev, [key]: !prev[key] }));
        toast.info(`${key.replace(/([A-Z])/g, ' $1').trim()} Updated`);
    };

    const addLeadStage = () => {
        if (!newStage.name) return toast.error("Name required");
        setLeadStages(prev => [...prev, { ...newStage, id: Math.random().toString(36).substr(2, 9) }]);
        setNewStage({ name: "", color: "bg-blue-500", description: "" });
        setIsAddStageOpen(false);
        toast.success("New lifecycle stage added");
    };

    const handleDeploy = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
            loading: 'Propagating CRM configuration...',
            success: 'Strategic CRM settings deployed!',
            error: 'Deployment failed.',
        });
    };

    return (
        <div className="flex flex-col min-h-full bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors">
            {/* Header */}
            <header className="sticky top-[-1.01rem] -mt-4 -mx-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-12 py-8 flex items-center justify-between z-40">
                <div className="flex items-center gap-6">
                    <div className="h-14 w-14 bg-cyan-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-cyan-600/20 transform rotate-2">
                        <Target size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic">CRM Control Center</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Global Lead & Deal Governance</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <CustomButton variant="outline" className="rounded-2xl h-12 px-6 font-bold border-zinc-200 dark:border-zinc-700">Export .JSON</CustomButton>
                    <CustomButton onClick={handleDeploy} className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-2xl px-10 h-12 font-black uppercase tracking-tight shadow-xl hover:scale-[1.02]">
                        <Save className="h-4 w-4 mr-2" /> Sync Module
                    </CustomButton>
                </div>
            </header>

            <div className="py-12 px-12 max-w-[1700px] mx-auto w-full">
                <Tabs defaultValue="leads" className="space-y-12">
                    <TabsList className="h-20 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] shadow-sm flex items-center gap-2">
                        {[
                            { value: "leads", label: "Lead Lifecycle", icon: UserPlus },
                            { value: "deals", label: "Deal Pipelines", icon: Briefcase },
                            { value: "clients", label: "Client Policy", icon: UserCheck },
                            { value: "sales", label: "Sales Engine", icon: Zap },
                            { value: "governance", label: "Data Governance", icon: CheckCircle },
                        ].map(tab => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex-1 rounded-[24px] px-8 font-black uppercase tracking-tighter text-xs h-full data-[state=active]:bg-zinc-900 dark:data-[state=active]:bg-zinc-100 data-[state=active]:text-white dark:data-[state=active]:text-zinc-900 transition-all gap-3"
                            >
                                <tab.icon size={18} /> {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* LEAD LIFECYCLE */}
                    <TabsContent value="leads" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-[48px] p-12 border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-10 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase italic">Pipeline Milestones</h3>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Define logic for lead progression.</p>
                                    </div>
                                    <Dialog open={isAddStageOpen} onOpenChange={setIsAddStageOpen}>
                                        <DialogTrigger asChild>
                                            <CustomButton className="rounded-3xl bg-cyan-600 text-white font-black uppercase tracking-tight px-8 h-14 shadow-lg">
                                                <Plus size={20} className="mr-2" /> New Milestone
                                            </CustomButton>
                                        </DialogTrigger>
                                        <DialogContent className="rounded-[40px] p-12 bg-white dark:bg-zinc-900 max-w-lg">
                                            <DialogHeader className="mb-6">
                                                <DialogTitle className="text-3xl font-black uppercase tracking-tighter italic">Create Milestone</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-6">
                                                <CustomInput label="Milestone Name" placeholder="e.g. Qualified" value={newStage.name} onChange={e => setNewStage({ ...newStage, name: e.target.value })} />
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-zinc-400">Color Variant</label>
                                                    <div className="flex gap-3">
                                                        {["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"].map(c => (
                                                            <button key={c} onClick={() => setNewStage({ ...newStage, color: c })} className={`h-10 w-10 rounded-full ${c} ${newStage.color === c ? 'ring-4 ring-zinc-200' : ''}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogFooter className="pt-10">
                                                <CustomButton onClick={addLeadStage} className="w-full h-14 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-2xl font-black uppercase">Initialize Stage</CustomButton>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="space-y-4">
                                    {leadStages.map((stage, idx) => (
                                        <div key={stage.id} className="group flex items-center justify-between p-8 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-[32px] hover:bg-white dark:hover:bg-zinc-800 transition-all">
                                            <div className="flex items-center gap-8">
                                                <GripVertical size={24} className="text-zinc-300 pointer-events-none" />
                                                <div className={`h-14 w-14 rounded-2xl ${stage.color} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                                                    0{idx + 1}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-xl uppercase tracking-tighter">{stage.name}</h4>
                                                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">{stage.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <CustomButton variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-red-50 text-red-600" onClick={() => setLeadStages(l => l.filter(s => s.id !== stage.id))}><Trash2 size={20} /></CustomButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-zinc-900 rounded-[48px] p-12 text-white border border-white/5 space-y-10 shadow-2xl overflow-hidden relative">
                                <Activity className="absolute -bottom-20 -right-20 h-64 w-64 text-cyan-500/10" />
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                                    <Zap className="text-cyan-400" /> Scorer Engine
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { label: "Behavioral Intent", key: "autoScoring", color: "text-cyan-400" },
                                        { label: "Round Robin Routing", key: "roundRobin", color: "text-amber-400" },
                                        { label: "Anti-Spam Filter", key: "botCheck", color: "text-rose-400" },
                                    ].map(rule => (
                                        <div key={rule.key} className="flex items-center justify-between p-8 bg-white/5 rounded-[32px] border border-white/5 hover:bg-white/10 transition-all">
                                            <span className="font-black text-sm uppercase tracking-tight">{rule.label}</span>
                                            <Switch checked={automation[rule.key as keyof typeof automation]} onCheckedChange={() => handleToggle(rule.key as keyof typeof automation)} className="data-[state=checked]:bg-cyan-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* DEAL PIPELINES */}
                    <TabsContent value="deals" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white dark:bg-zinc-900 rounded-[56px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden group">
                            <TrendingUp className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-all duration-1000" size={400} />
                            <div className="flex items-center justify-between mb-16 relative z-10">
                                <div>
                                    <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none">Deal Architecture</h3>
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-4 italic">Configure winning probabilities for multi-stage pipelines.</p>
                                </div>
                                <CustomButton className="h-16 rounded-[28px] border-2 border-dashed border-zinc-200 dark:border-zinc-700 px-10 font-black uppercase tracking-tight hover:bg-zinc-50">
                                    <Plus size={20} className="mr-3" /> Add Phase
                                </CustomButton>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
                                {dealStages.map((stage, idx) => (
                                    <div key={stage.id} className="p-10 rounded-[44px] bg-zinc-50 dark:bg-zinc-800/40 border-2 border-transparent hover:border-cyan-500 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-2xl transition-all group/card">
                                        <Badge className="mb-8 px-5 py-2 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-none font-black text-[10px] tracking-widest">{stage.probability}% WIN-RATE</Badge>
                                        <h4 className="text-2xl font-black uppercase tracking-tighter italic mb-10 leading-none">{stage.name}</h4>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">PHASE 0{idx + 1}</span>
                                            <CustomButton variant="ghost" className="h-12 w-12 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700"><Edit3 size={18} /></CustomButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* CLIENT POLICY */}
                    <TabsContent value="clients" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white dark:bg-zinc-900 rounded-[56px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
                            <div className="flex items-center justify-between mb-16">
                                <div>
                                    <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Account Logic</h3>
                                    <p className="text-sm font-black text-zinc-400 uppercase tracking-widest mt-2">Segmented corporate management rules.</p>
                                </div>
                                <CustomButton className="h-16 px-12 rounded-3xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 font-black uppercase tracking-tight shadow-xl">Create Account Tier</CustomButton>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {clientCategories.map(cat => (
                                    <div key={cat.id} className="p-12 rounded-[56px] bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-2xl transition-all group">
                                        <div className="flex items-center justify-between mb-12">
                                            <h4 className="text-2xl font-black uppercase tracking-tighter italic">{cat.name}</h4>
                                            <UserCheck size={28} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Preferred Yield</span>
                                                <span className="font-black text-xl text-emerald-600 dark:text-emerald-400">{cat.discount}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Portal Enabled</span>
                                                <Switch checked={cat.portal} className="scale-110 data-[state=checked]:bg-emerald-500" />
                                            </div>
                                        </div>
                                        <div className="mt-12 pt-10 border-t border-dashed border-zinc-200 dark:border-zinc-700 flex gap-4">
                                            <CustomButton variant="ghost" className="flex-1 rounded-2xl h-14 bg-white dark:bg-zinc-900 shadow-sm font-black uppercase text-[10px] tracking-widest">Global Policy</CustomButton>
                                            <CustomButton variant="ghost" className="h-14 w-14 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm text-red-500"><Trash2 size={20} /></CustomButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* SALES ENGINE (Automation) - ADDED FULL CONTENT */}
                    <TabsContent value="sales" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="bg-zinc-900 rounded-[56px] p-16 text-white border border-white/5 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                    <Bot size={300} />
                                </div>
                                <div className="space-y-12 relative z-10">
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none flex items-center gap-6">
                                        <Bot size={48} className="text-cyan-400" /> AI Sales Agent
                                    </h3>
                                    <p className="text-base font-bold text-zinc-400 italic uppercase tracking-widest leading-relaxed">System-wide autonomous sales logic and lead nurturing orchestration.</p>
                                    <div className="space-y-8">
                                        {[
                                            { label: "Predictive Intent Replying", key: "aiAnswering", icon: Mail, desc: "Agent automatically drafts responses based on lead sentiment." },
                                            { label: "Automatic Drip Nurture", key: "autoNurture", icon: Workflow, desc: "Trigger email sequences based on activity milestones." },
                                            { label: "Churn Prevention Shield", key: "forecasting", icon: ShieldAlert, desc: "Auto-flag accounts showing signs of decreasing engagement." },
                                        ].map(rule => (
                                            <div key={rule.key} className="p-10 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all group/rule">
                                                <div className="flex items-center gap-6">
                                                    <div className="h-14 w-14 rounded-2xl bg-white/5 text-cyan-400 flex items-center justify-center border border-white/5 group-hover/rule:bg-cyan-500/10 transition-all">
                                                        <rule.icon size={28} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-lg uppercase tracking-tight leading-none">{rule.label}</h4>
                                                        <p className="text-[10px] font-bold text-zinc-500 mt-2 uppercase italic tracking-widest">{rule.desc}</p>
                                                    </div>
                                                </div>
                                                <Switch checked={automation[rule.key as keyof typeof automation]} onCheckedChange={() => handleToggle(rule.key as keyof typeof automation)} className="scale-125 data-[state=checked]:bg-cyan-500" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="bg-white dark:bg-zinc-900 rounded-[56px] p-14 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-10">
                                    <div className="h-32 w-32 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-600 rounded-full flex items-center justify-center animate-pulse shadow-inner">
                                        <Globe size={64} />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-3xl font-black uppercase tracking-tighter italic">Global Sales API</h4>
                                        <p className="text-base text-zinc-500 dark:text-zinc-400 font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-tighter italic">Currently synchronizing with 14 external marketplaces and lead providers.</p>
                                    </div>
                                    <CustomButton variant="outline" className="rounded-[28px] border-2 px-12 h-16 uppercase font-black tracking-widest text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all hover:scale-105">Calibrate Sync Engine</CustomButton>
                                </div>

                                <div className="p-12 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-[56px] text-white shadow-3xl shadow-cyan-600/20 flex items-center gap-8 group cursor-pointer hover:scale-[1.02] transition-transform">
                                    <div className="h-20 w-20 bg-white/20 rounded-[32px] flex items-center justify-center backdrop-blur-md group-hover:rotate-12 transition-transform">
                                        <Activity size={32} />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Sales Velocity Meta</h4>
                                        <p className="text-xs font-bold text-white/70 uppercase tracking-widest mt-2 italic leading-relaxed">Optimize rep performance with AI-driven daily task orchestration.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* DATA GOVERNANCE (Security) - ADDED FULL CONTENT */}
                    <TabsContent value="governance" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white dark:bg-zinc-900 rounded-[64px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-16">
                            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-12">
                                <div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-6 leading-none">
                                        <Lock size={40} className="text-rose-600" /> Data Governance Matrix
                                    </h3>
                                    <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-4 uppercase tracking-[0.2em] italic">Manage enterprise-level CRM access controls and data retention policies.</p>
                                </div>
                                <Badge className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl px-8 py-3 font-black uppercase text-xs tracking-widest shadow-2xl">V2.4 STABLE ENGINE</Badge>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                <div className="space-y-12">
                                    <div className="p-12 bg-zinc-50 dark:bg-zinc-800/40 rounded-[48px] border border-zinc-100 dark:border-zinc-800 hover:border-rose-200 transition-all group/card">
                                        <div className="flex items-center justify-between mb-10">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic">Access Model</span>
                                            <Badge className="bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-none font-black px-4 uppercase text-[10px]">Tiered Hybrid</Badge>
                                        </div>
                                        <div className="space-y-6">
                                            {[
                                                { label: "IP Restriction Matrix", status: "Enabled", type: "Security" },
                                                { label: "GDPR Compliance Vault", status: "Active", type: "Legal" },
                                                { label: "Lead Portability Policy", status: "Standard", type: "Export" },
                                            ].map(item => (
                                                <div key={item.label} className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
                                                    <span className="font-black text-xs uppercase tracking-tight italic">{item.label}</span>
                                                    <Badge variant="ghost" className="font-black uppercase text-[10px] tracking-widest text-zinc-400">{item.status}</Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        {["Log Retention", "Encryption Hub", "Masking Rules", "Audit Log v4"].map((item, idx) => (
                                            <div key={idx} className="p-10 border-2 border-zinc-100 dark:border-zinc-800 rounded-[40px] hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all cursor-pointer font-black text-xs uppercase tracking-widest text-center shadow-sm flex flex-col items-center justify-center gap-4">
                                                <Database size={24} className="opacity-40" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-16 bg-zinc-900 dark:bg-black rounded-[56px] text-white shadow-3xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-16 opacity-5 rotate-[-15deg] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                        <ShieldAlert size={300} />
                                    </div>
                                    <h4 className="text-2xl font-black uppercase tracking-tighter italic text-rose-500 relative z-10">Critical Compliance Controls</h4>
                                    <div className="space-y-8 mt-12 relative z-10">
                                        {[
                                            { label: "Double Opt-In Verification", key: "botCheck", desc: "Require email validation for every new lead captured." },
                                            { label: "Data Residency Guard", key: "slackSync", desc: "Automatically restrict lead storage to regional node boundaries." },
                                            { label: "Automated PII Masking", key: "autoScoring", desc: "Hide sensitive lead fields from standard sales representatives." },
                                        ].map(rule => (
                                            <div key={rule.label} className="p-10 bg-white/5 rounded-[40px] border border-white/5 hover:bg-white/10 hover:border-rose-500/30 transition-all group/row">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="font-black uppercase tracking-tight text-lg text-white">{rule.label}</span>
                                                    <Switch className="data-[state=checked]:bg-rose-500 scale-125" />
                                                </div>
                                                <p className="text-[10px] font-bold text-zinc-500 italic uppercase tracking-widest">{rule.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
