"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Edit,
    Trash2,
    Mail,
    Phone,
    Building,
    Calendar,
    Target,
    MessageSquare,
    FileText,
    Clock,
    Plus,
    Activity,
    TrendingUp,
    MoreVertical,
    ChevronRight,
    Briefcase,
    DollarSign,
    User,
    MapPin,
    CheckCircle2,
    PieChart,
    ShieldCheck,
    Zap,
    StickyNote,
    Users
} from "lucide-react";

import { CustomButton } from "@/components/custom/CustomButton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useLoaderStore } from "@/lib/loaderStore";
import { getDealById, updateDealStage } from "@/modules/crm/deals/hooks/dealHooks";
import { toast } from "sonner";

// --- Helpers ---
const STAGE_CONFIG: Record<string, { color: string, bg: string, dot: string }> = {
    New: { color: "text-blue-700", bg: "bg-blue-50/50", dot: "bg-blue-500" },
    Discovery: { color: "text-indigo-700", bg: "bg-indigo-50/50", dot: "bg-indigo-500" },
    Proposal: { color: "text-amber-700", bg: "bg-amber-50/50", dot: "bg-amber-500" },
    Negotiation: { color: "text-purple-700", bg: "bg-purple-50/50", dot: "bg-purple-500" },
    Won: { color: "text-zinc-900", bg: "bg-zinc-100/50", dot: "bg-zinc-900" },
    Lost: { color: "text-red-700", bg: "bg-red-50/50", dot: "bg-red-500" },
};

export default function DealDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const dealId = params.id as string;
    const orgName = params.orgName as string;

    const { showLoader, hideLoader } = useLoaderStore();
    const [deal, setDeal] = useState<any>(null);

    useEffect(() => {
        const fetchDeal = async () => {
            try {
                showLoader();
                const response = await getDealById(dealId);
                if (response.data?.data) {
                    setDeal(response.data.data);
                }
            } catch (err) {
                toast.error("Failed to load deal details");
            } finally {
                hideLoader();
            }
        };
        if (dealId) fetchDeal();
    }, [dealId]);

    if (!deal) return null;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-zinc-950 overflow-hidden">
            {/* Dynamic Header */}
            <div className="bg-white dark:bg-zinc-900 border-b px-8 py-4 shadow-sm relative z-50 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-6">
                    <CustomButton variant="outline" size="sm" onClick={() => router.back()} className="h-10 px-4 rounded-xl border-zinc-200 shadow-sm">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Pipeline
                    </CustomButton>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400 text-xs font-black uppercase tracking-widest">Opportunities</span>
                        <ChevronRight className="h-3 w-3 text-zinc-300" />
                        <span className="text-zinc-900 dark:text-zinc-100 text-sm font-black uppercase tracking-tighter">{deal.title}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CustomButton variant="outline" className="h-10 px-5 rounded-xl border-zinc-200 font-bold" onClick={() => router.push(`/${orgName}/modules/crm/deals/${dealId}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" /> Modify Opportunity
                    </CustomButton>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <CustomButton className="h-10 bg-zinc-900 text-white rounded-xl shadow-lg px-6 font-bold">
                                Actions <MoreVertical className="ml-2 h-4 w-4" />
                            </CustomButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem className="font-bold text-xs py-3">LOG COMMUNICATION</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">Schedule Negotiation Meeting</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">Send Revised Proposal</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 text-xs font-bold border-t mt-2 pt-3">DELETE PERMANENTLY</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                <div className="max-w-[1500px] mx-auto grid grid-cols-12 gap-10">

                    {/* LEFT CONTENT AREA */}
                    <div className="col-span-12 lg:col-span-8 space-y-10">

                        {/* Opportunity Hero Section */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-zinc-900 rounded-[40px] p-12 border border-zinc-200/40 shadow-2xl overflow-hidden relative"
                        >
                            {/* Animated Background Decor */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/30 rounded-full blur-[100px] -mr-40 -mt-40" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50/20 rounded-full blur-[80px] -ml-32 -mb-32" />

                            <div className="relative flex flex-col md:flex-row gap-10 items-start md:items-center">
                                <div className="w-28 h-28 rounded-[36px] bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-indigo-500/20 ring-8 ring-white">
                                    {deal.title?.[0] || "O"}
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-none group cursor-default">
                                            {deal.title}
                                            <Badge className="ml-4 align-middle px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] bg-blue-50 text-blue-700 border-blue-100 shadow-sm">ACTIVE</Badge>
                                        </h1>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                                        <div className="flex items-center gap-2.5 text-zinc-500 font-bold text-sm tracking-tight">
                                            <div className="p-2 bg-zinc-50 rounded-lg"><Building className="h-4 w-4 text-blue-500" /></div>
                                            <span>{deal.firm?.FirmName || "Unmapped Account"}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-zinc-500 font-bold text-sm tracking-tight">
                                            <div className="p-2 bg-zinc-50 rounded-lg"><Calendar className="h-4 w-4 text-purple-500" /></div>
                                            <span>Created {deal.createdAt ? new Date(deal.createdAt).toLocaleDateString() : "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-zinc-500 font-bold text-sm tracking-tight">
                                            <div className="p-2 bg-zinc-50 rounded-lg"><Zap className="h-4 w-4 text-amber-500" /></div>
                                            <span>Priority: <span className="text-zinc-900">{deal.priority || "Standard"}</span></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-900 dark:bg-zinc-800 p-8 rounded-[32px] text-center min-w-[200px] shadow-2xl">
                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Deal Value</p>
                                    <div className="flex items-center justify-center gap-1.5 text-4xl font-black text-white tracking-tighter">
                                        <DollarSign className="h-6 w-6 text-emerald-400" />
                                        <span>{(deal.estimatedValue || deal.value || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Smart Tabs Container */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200/40 shadow-sm overflow-hidden min-h-[500px]">
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="bg-zinc-50/50 dark:bg-zinc-800/50 w-full justify-start h-20 px-8 gap-12 rounded-none border-b border-zinc-100">
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none font-black text-xs uppercase tracking-widest h-20 relative">
                                        Opportunity Overview
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full opacity-0 data-[state=active]:opacity-100 transition-opacity" />
                                    </TabsTrigger>
                                    <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none font-black text-xs uppercase tracking-widest h-20 relative">
                                        Interaction Log
                                    </TabsTrigger>
                                    <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none font-black text-xs uppercase tracking-widest h-20 relative">
                                        Pipeline Stages
                                    </TabsTrigger>
                                </TabsList>

                                <div className="p-12">
                                    <TabsContent value="overview" className="mt-0 space-y-12">
                                        {/* Key Attributes Grid */}
                                        <div className="grid grid-cols-2 gap-16">
                                            <div className="space-y-10">
                                                <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
                                                    <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Strategy Parameters</h3>
                                                    <PieChart className="h-4 w-4 text-zinc-300" />
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">LS</div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-zinc-400 uppercase mb-0.5">Lead Source</p>
                                                                <p className="text-sm font-black text-zinc-800">{deal.source || "Organic Outreach"}</p>
                                                            </div>
                                                        </div>
                                                        <Badge className="bg-white border-zinc-100 text-zinc-500 font-bold scale-90">VERIFIED</Badge>
                                                    </div>

                                                    <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <p className="text-[10px] font-black text-zinc-400 uppercase">Closing Probability</p>
                                                            <p className="text-lg font-black text-blue-600">75%</p>
                                                        </div>
                                                        <Progress value={75} className="h-2.5 bg-blue-100 [&>div]:bg-blue-600" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-10">
                                                <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
                                                    <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Milestone Timeline</h3>
                                                    <Clock className="h-4 w-4 text-zinc-300" />
                                                </div>
                                                <div className="space-y-8">
                                                    <div className="flex gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0"><Calendar className="h-5 w-5" /></div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Target Close Date</p>
                                                            <p className="text-base font-black text-zinc-900">{deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "Pending Confirmation"}</p>
                                                            <p className="text-[10px] text-emerald-600 font-bold mt-1">Estimating Q1 Lifecycle</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-5">
                                                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0"><ShieldCheck className="h-5 w-5" /></div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Contract Tenure</p>
                                                            <p className="text-base font-black text-zinc-900">12 Month Enterprise Subscription</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description Area */}
                                        <div className="bg-slate-50 dark:bg-zinc-800/20 p-10 rounded-[40px] border border-dashed border-zinc-200">
                                            <div className="flex items-center gap-2 mb-6">
                                                <StickyNote className="h-4 w-4 text-zinc-400" />
                                                <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">Opportunity Specification</h3>
                                            </div>
                                            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal italic">
                                                "{deal.description || "The client is seeking a full-scale digital transformation partner of their core billing systems. Our proposal covers API integrations with their legacy SAP systems and a custom reporting dashboard for their C-level executives."}"
                                            </p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="timeline" className="mt-0">
                                        <div className="flex flex-col items-center justify-center py-24 space-y-6 opacity-30">
                                            <Activity className="h-16 w-16 text-zinc-200" />
                                            <div className="text-center">
                                                <h3 className="text-xl font-black uppercase tracking-tighter">Activity Stream</h3>
                                                <p className="text-sm">No recent interactions logged for this opportunity.</p>
                                            </div>
                                            <CustomButton variant="outline" className="rounded-2xl border-2">Record New Interaction</CustomButton>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="history" className="mt-0 space-y-8">
                                        <div className="flex flex-col gap-8">
                                            {[
                                                { stage: "Negotiation", date: "Jan 12, 10:45 AM", note: "Procurement started the final review of the contract clauses." },
                                                { stage: "Proposal", date: "Jan 08, 04:15 PM", note: "Sent the revised enterprise pricing plan (15% loyalty discount applied)." },
                                                { stage: "Discovery", date: "Jan 05, 11:30 AM", note: "Technical requirements gathering session with the VP of Engineering." },
                                            ].map((history, idx) => (
                                                <div key={idx} className="flex gap-8 relative items-start group">
                                                    {idx < 2 && <div className="absolute left-[20px] top-10 bottom-[-32px] w-[2px] bg-zinc-100 group-last:hidden" />}
                                                    <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-black text-xs z-10 shadow-xl">{3 - idx}</div>
                                                    <div className="flex-1 bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm transition-all hover:shadow-xl hover:border-blue-100 group cursor-default">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <Badge className="bg-blue-50 text-blue-700 font-black uppercase text-[10px] border-0">{history.stage}</Badge>
                                                                <span className="text-zinc-300">/</span>
                                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{history.date}</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-zinc-600 font-medium leading-relaxed">{history.note}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    </div>

                    {/* SIDEBAR WIDGETS */}
                    <div className="col-span-12 lg:col-span-4 space-y-10">

                        {/* Health Meter Card */}
                        <div className="bg-zinc-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-bl-[64px] transition-transform group-hover:scale-110">
                                <Target className="h-8 w-8 opacity-20" />
                            </div>
                            <h3 className="text-lg font-black mb-10 flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-emerald-400" /> Deal Health
                            </h3>

                            <div className="space-y-8 relative z-10">
                                <div className="flex items-end justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Momentum Score</p>
                                        <p className="text-4xl font-black text-white italic">EXCELLENT</p>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-emerald-400">92</span>
                                        <span className="text-xs font-bold text-white/30">/ 100</span>
                                    </div>
                                </div>
                                <Progress value={92} className="h-4 bg-white/5 [&>div]:bg-emerald-400 shadow-inner" />
                                <div className="bg-white/5 p-5 rounded-2xl border border-white/10">
                                    <p className="text-[11px] text-white/70 font-medium leading-relaxed italic">
                                        "Proposal was viewed 4 times by Decision Makers in the last 48 hours. Ready for final push."
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Account Synergy Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-10 border border-zinc-200/40 shadow-sm relative overflow-hidden">
                            <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-50 pb-6 mb-8">Account Logistics</h3>
                            <div className="space-y-8">
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm"><Users className="h-5 w-5" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Key Decision Maker</p>
                                        <p className="text-base font-black text-zinc-900 leading-tight">Sarah Jenkins</p>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">VP Global Ops</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm"><MapPin className="h-5 w-5" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">HQ / Jurisdiction</p>
                                        <p className="text-base font-black text-zinc-900 leading-tight">London, United Kingdom</p>
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 text-zinc-900 flex items-center justify-center flex-shrink-0 shadow-sm"><Briefcase className="h-5 w-5" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Account Owner</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-bold text-zinc-800 underline underline-offset-4">John Admin</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Record Call Widget */}
                        <div className="bg-blue-600/5 dark:bg-blue-900/10 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-[40px] p-10 text-center">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20">
                                <Phone className="h-8 w-8" />
                            </div>
                            <h4 className="text-lg font-black text-zinc-900 tracking-tight mb-2">Engage Decision Makers</h4>
                            <p className="text-xs text-zinc-500 font-medium mb-8">Record the outcome of your latest discovery or negotiation call.</p>
                            <CustomButton className="w-full bg-blue-600 text-white h-12 rounded-2xl font-bold shadow-lg hover:bg-blue-700">Record Call Log</CustomButton>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
