"use client";

import { useState } from "react";
import {
    Settings,
    Plus,
    Save,
    LifeBuoy,
    MessageSquare,
    Clock,
    Shield,
    Users,
    Zap,
    TrendingUp,
    AlertCircle,
    ChevronRight,
    Search,
    Brain,
    Bot,
    Edit3,
    Trash2,
    Activity,
    UserPlus,
    LayoutDashboard,
    Network,
    Scale,
    GripVertical,
    RefreshCcw,
} from "lucide-react";
import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function SupportGlobalSettingsPage() {
    // STATE MANAGEMENT
    const [config, setConfig] = useState({
        aiAutoReply: true,
        sentimentAnalysis: true,
        autoEscalation: false,
        slackSync: true,
        smartRouting: true,
        agentPresence: true,
    });

    const [ticketTypes, setTicketTypes] = useState([
        { id: "1", name: "Incident", sla: "4h", priority: "High", color: "bg-rose-500" },
        { id: "2", name: "Service Request", sla: "24h", priority: "Medium", color: "bg-blue-500" },
        { id: "3", name: "Bug Report", sla: "1h", priority: "Critical", color: "bg-amber-500" },
    ]);

    const [slas, setSlas] = useState([
        { id: "1", tier: "Gold Standard", response: "15m", resolution: "2h", active: true, color: "bg-amber-500" },
        { id: "2", tier: "Business Core", response: "1h", resolution: "8h", active: true, color: "bg-emerald-500" },
        { id: "3", tier: "Standard Base", response: "4h", resolution: "24h", active: true, color: "bg-zinc-500" },
    ]);

    const handleToggle = (key: keyof typeof config) => {
        setConfig(prev => ({ ...prev, [key]: !prev[key] }));
        toast.info("Support policy re-configured.");
    };

    const handleDeploy = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
            loading: 'Flushing helpdesk caches...',
            success: 'Global Helpdesk rules synchronized!',
            error: 'Failed to sync SLA matrix.',
        });
    };

    return (
        <div className="flex flex-col min-h-full bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
            {/* Helpdesk Header */}
            <header className="sticky top-[-1.01rem] -mt-4 -mx-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-12 py-8 flex items-center justify-between z-40 transition-colors">
                <div className="flex items-center gap-6">
                    <div className="h-14 w-14 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-amber-600/30 transform rotate-2 hover:rotate-0 transition-all duration-300">
                        <LifeBuoy size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter italic leading-none">Global Helpdesk Authority</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                            <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] italic">Service Level Management • Support Engine v6.0</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <CustomButton variant="outline" className="rounded-2xl h-12 px-8 font-bold border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Audit SLA Logs</CustomButton>
                    <CustomButton onClick={handleDeploy} className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-2xl h-12 px-10 font-black uppercase tracking-tight shadow-xl hover:translate-y-[-2px] transition-all">
                        <Save className="h-4 w-4 mr-3" /> Commit SLA Rules
                    </CustomButton>
                </div>
            </header>

            <div className="py-12 px-12 max-w-[1700px] mx-auto w-full">
                <Tabs defaultValue="tickets" className="space-y-12">
                    <TabsList className="h-20 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] shadow-sm flex items-center gap-2 transition-colors">
                        {[
                            { value: "tickets", label: "Ticket Architecture", icon: MessageSquare },
                            { value: "sla", label: "SLA Matrix", icon: Clock },
                            { value: "automation", label: "Helpdesk AI", icon: Brain },
                            { value: "teams", label: "Agent Assignment", icon: Users },
                        ].map(tab => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="flex-1 rounded-[24px] px-8 font-black uppercase tracking-tighter text-xs h-full data-[state=active]:bg-amber-600 data-[state=active]:text-white transition-all gap-4"
                            >
                                <tab.icon size={18} /> {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* TICKET ARCHITECTURE */}
                    <TabsContent value="tickets" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                        <div className="bg-white dark:bg-zinc-900 rounded-[56px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden group transition-colors">
                            <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 pointer-events-none transition-all duration-1000">
                                <MessageSquare size={400} />
                            </div>
                            <div className="flex items-center justify-between mb-16 relative z-10">
                                <div>
                                    <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase italic leading-none">Global Case Classifications</h3>
                                    <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-4 uppercase tracking-widest italic leading-relaxed">Define global ticket categories and their associated default priorities.</p>
                                </div>
                                <CustomButton className="h-16 rounded-[28px] bg-amber-600 text-white font-black uppercase tracking-tight px-10 shadow-2xl shadow-amber-600/30 hover:bg-amber-500 transition-all hover:scale-105 active:scale-95">
                                    <Plus size={24} className="mr-3" /> Define Category
                                </CustomButton>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                                <AnimatePresence initial={false}>
                                    {ticketTypes.map((type) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            key={type.id}
                                            className="p-12 rounded-[56px] bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-2xl hover:border-amber-100 dark:hover:border-amber-900/40 transition-all duration-500 group relative overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between mb-12">
                                                <div className={`h-20 w-20 rounded-[30px] ${type.color} flex items-center justify-center text-white shadow-2xl transition-transform group-hover:rotate-6 duration-500`}>
                                                    <MessageSquare size={40} />
                                                </div>
                                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                                                    <CustomButton variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-white dark:bg-zinc-950 shadow-sm hover:bg-amber-50 text-amber-600" onClick={() => setTicketTypes(t => t.filter(x => x.id !== type.id))}><Trash2 size={20} /></CustomButton>
                                                </div>
                                            </div>
                                            <h4 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter mb-2 italic leading-tight">{type.name}</h4>
                                            <p className="text-base font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest italic tracking-tighter">SLA: {type.sla} TARGET</p>

                                            <div className="mt-12 pt-10 border-t border-zinc-100 dark:border-zinc-700 border-dashed flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 italic font-black text-zinc-500">Global Priority</span>
                                                <Badge className={`${type.color} text-white rounded-lg px-4 font-black uppercase text-[10px] tracking-widest leading-none py-1.5 border-none shadow-lg shadow-black/10`}>{type.priority}</Badge>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </TabsContent>

                    {/* SLA MATRIX - ADDED FULL CONTENT */}
                    <TabsContent value="sla" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                        <div className="bg-white dark:bg-zinc-900 rounded-[64px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-3xl space-y-16 transition-colors">
                            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-12">
                                <div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-6 leading-none">
                                        <Clock className="text-amber-600 h-10 w-10" /> Service Level Matrix
                                    </h3>
                                    <p className="text-sm font-bold text-zinc-400 mt-4 uppercase tracking-[0.2em] italic">Orchestrate organization-wide response and resolution commitments across global customer tiers.</p>
                                </div>
                                <Badge className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest">REAL-TIME TELEMETRY</Badge>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {slas.map(sla => (
                                    <div key={sla.id} className="p-12 rounded-[56px] bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-500 group relative">
                                        <div className="flex items-center justify-between mb-12">
                                            <div className={`h-22 w-22 rounded-[36px] ${sla.color} text-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110`}>
                                                <Shield size={36} />
                                            </div>
                                            <Switch checked={sla.active} className="data-[state=checked]:bg-amber-600 scale-110" />
                                        </div>
                                        <h4 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter italic mb-8">{sla.tier}</h4>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">First Response</span>
                                                <span className="font-black text-xl text-amber-600">{sla.response}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Resolution</span>
                                                <span className="font-black text-xl text-emerald-600">{sla.resolution}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-16 bg-zinc-900 dark:bg-black rounded-[56px] text-white shadow-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 transition-transform duration-1000 group-hover:scale-125 pointer-events-none">
                                    <TrendingUp size={300} />
                                </div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                    <div className="space-y-6 max-w-2xl">
                                        <h4 className="text-3xl font-black uppercase tracking-tighter italic text-amber-500 leading-none">Automated Escalation Rule 1.4</h4>
                                        <p className="text-base text-zinc-400 font-bold uppercase tracking-widest italic leading-relaxed">System-wide logic to bump unassigned cases to L2 Senior Agents if T+15m threshold is reached across all standard queues.</p>
                                        <CustomButton className="h-14 rounded-2xl bg-amber-600 text-white font-black px-12 uppercase tracking-widest shadow-xl">Calibrate Escalation</CustomButton>
                                    </div>
                                    <div className="h-48 w-48 bg-white/5 rounded-[48px] backdrop-blur-md border border-white/5 flex flex-col items-center justify-center gap-2">
                                        <Activity size={48} className="text-amber-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live SLA Health</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* HELPDESK AI - ADDED FULL CONTENT */}
                    <TabsContent value="automation" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="bg-zinc-900 dark:bg-zinc-950 rounded-[56px] p-16 text-white border border-white/5 shadow-3xl relative overflow-hidden group transition-colors">
                                <div className="absolute -bottom-20 -right-20 h-80 w-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                                <div className="relative z-10 space-y-12">
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 bg-amber-500/10 text-amber-400 rounded-3xl flex items-center justify-center shadow-lg border border-amber-500/20">
                                            <Bot size={40} />
                                        </div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Service Intelligence (AI)</h3>
                                    </div>
                                    <div className="space-y-6">
                                        {[
                                            { label: "Predictive Case Routing", key: "smartRouting", desc: "Agent analyzes incoming ticket vector and routes to specific specialist team." },
                                            { label: "Autonomous Sentiment Shield", key: "sentimentAnalysis", desc: "Flag tickets with aggressive sentiment for executive immediate handling." },
                                            { label: "AI Response Drafting", key: "aiAutoReply", desc: "Inject LLM-generated drafts into agent workspace based on KB library." },
                                        ].map(rule => (
                                            <div key={rule.key} className="p-10 bg-white/5 rounded-[40px] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group/row">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="font-black uppercase tracking-tight text-lg text-white group-hover/row:translate-x-1 transition-transform">{rule.label}</span>
                                                    <Switch checked={config[rule.key as keyof typeof config] as boolean} onCheckedChange={() => handleToggle(rule.key as keyof typeof config)} className="data-[state=checked]:bg-amber-500 scale-125 transition-all" />
                                                </div>
                                                <p className="text-[10px] font-bold text-zinc-500 italic uppercase tracking-widest">{rule.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="bg-white dark:bg-zinc-900 rounded-[56px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col items-center justify-center text-center space-y-10 group transition-colors">
                                    <div className="h-32 w-32 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500 rounded-full flex items-center justify-center animate-[pulse_4s_infinite] shadow-inner font-black text-3xl">🤖</div>
                                    <div className="space-y-4">
                                        <h4 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter italic leading-tight">Neural Knowledge Base</h4>
                                        <p className="text-base text-zinc-500 dark:text-zinc-400 font-bold max-w-sm mx-auto leading-relaxed uppercase tracking-tighter italic">Currently analyzing 14k historical tickets to optimize resolution drafts.</p>
                                    </div>
                                    <CustomButton variant="outline" className="rounded-[28px] border-2 px-12 h-16 uppercase font-black tracking-widest text-xs hover:bg-amber-600 hover:text-white transition-all">Train AI Node</CustomButton>
                                </div>

                                <div className="p-12 bg-gradient-to-br from-amber-600 to-orange-700 rounded-[56px] text-white shadow-3xl shadow-amber-600/30 flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform">
                                    <div className="flex items-center gap-8">
                                        <div className="h-20 w-20 bg-white/20 rounded-[32px] flex items-center justify-center backdrop-blur-md">
                                            <Zap size={32} />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black uppercase tracking-tighter italic">Zero-Touch Resolution</h4>
                                            <p className="text-xs font-bold text-amber-100 uppercase tracking-widest mt-2 italic">Automate trivial case closure at scale.</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={32} className="text-white/40" />
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* AGENT ASSIGNMENT - ADDED FULL CONTENT */}
                    <TabsContent value="teams" className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                        <div className="bg-white dark:bg-zinc-900 rounded-[64px] p-16 border border-zinc-200 dark:border-zinc-800 shadow-3xl space-y-16 transition-colors">
                            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-12">
                                <div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-6 leading-none">
                                        <Network className="text-amber-600 h-10 w-10" /> Global Assignment Matrix
                                    </h3>
                                    <p className="text-sm font-bold text-zinc-400 mt-4 uppercase tracking-[0.2em] italic">Manage agent load balancing, skill-based routing hubs, and operational shifts.</p>
                                </div>
                                <div className="flex gap-4">
                                    <Badge className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-6 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest">14 ACTIVE CLUSTERS</Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                {[
                                    { label: "Skill-Based Hubs", value: "8 Hubs", icon: Users },
                                    { label: "Round Robin Load", value: "Active", icon: RefreshCcw },
                                    { label: "Agent Presence ML", value: "Enabled", icon: Activity },
                                    { label: "Cross-Queue Balancing", value: "Enabled", icon: Network },
                                ].map(card => (
                                    <div key={card.label} className="p-8 bg-zinc-50 dark:bg-zinc-800/40 rounded-[40px] border border-zinc-100 dark:border-zinc-800 hover:shadow-xl transition-all group flex flex-col items-center text-center gap-8">
                                        <div className="h-20 w-20 bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                                            <card.icon size={32} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{card.label}</p>
                                            <p className="text-xl font-black uppercase italic tracking-tighter tracking-widest">{card.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-16 bg-zinc-900 dark:bg-black rounded-[56px] text-white shadow-3xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 transition-transform duration-1000 group-hover:scale-125 pointer-events-none">
                                    <Scale size={300} />
                                </div>
                                <div className="relative z-10 space-y-12">
                                    <h4 className="text-3xl font-black uppercase tracking-tighter italic text-amber-500 leading-none">Operational Queue Governance</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {[
                                            { label: "Priority Lane Override", desc: "Allow executive accounts to jump the global support queue regardless of agent load." },
                                            { label: "Geographic Routing Guard", desc: "Force tickets to stay within regional boundaries for compliance and low-latency handling." },
                                        ].map(rule => (
                                            <div key={rule.label} className="p-10 bg-white/5 rounded-[44px] border border-white/5 hover:bg-white/10 transition-all group/sub">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="font-black uppercase tracking-tight text-xl text-white">{rule.label}</span>
                                                    <Switch className="data-[state=checked]:bg-amber-600 scale-125" defaultChecked />
                                                </div>
                                                <p className="text-xs font-bold text-zinc-500 italic uppercase tracking-widest leading-relaxed">{rule.desc}</p>
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
