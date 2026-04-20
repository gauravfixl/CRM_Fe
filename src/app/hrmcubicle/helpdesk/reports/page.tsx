"use client"

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Users,
    CheckCircle2,
    AlertCircle,
    Download,
    Target,
    Activity,
    FileBarChart,
    BrainCircuit,
    Star
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useHelpdeskStore, type Ticket } from "@/shared/data/helpdesk-store";
import { helpdeskApi } from "@/shared/data/helpdesk-api";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion } from "framer-motion";

const HelpdeskReportsPage = () => {
    const router = useRouter();
    const { tickets: storeTickets, agents, categories, automations, addAutomation } = useHelpdeskStore();
    const { toast } = useToast();
    const [timeRange, setTimeRange] = useState("30");
    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [apiTickets, setApiTickets] = useState<Ticket[] | null>(null);
    const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const list = await helpdeskApi.fetchAllTickets({ limit: 500 });
                if (!cancelled) {
                    setApiTickets(list);
                    setBackendAvailable(true);
                }
            } catch {
                if (!cancelled) setBackendAvailable(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const tickets = apiTickets !== null ? apiTickets : storeTickets;

    const rangeDays = Number(timeRange);
    const rangeStart = useMemo(() => new Date(Date.now() - rangeDays * 86400000), [rangeDays]);

    const filteredTickets = useMemo(() =>
        tickets.filter(t => new Date(t.createdAt) >= rangeStart)
        , [tickets, rangeStart]);

    const stats = useMemo(() => {
        const total = filteredTickets.length || tickets.length;
        const resolvedCount = filteredTickets.filter(t => t.status === "Resolved" || t.status === "Closed").length;
        const breachedCount = filteredTickets.filter(t => t.slaStatus === "Breached").length;
        const compliance = total ? Math.round(((total - breachedCount) / total) * 100) : 100;
        return {
            totalResolved: resolvedCount || tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length,
            total,
            compliance,
            breaches: breachedCount,
            avgCsat: agents.length ? (agents.reduce((s, a) => s + a.csatScore, 0) / agents.length).toFixed(1) : "0"
        };
    }, [filteredTickets, tickets, agents]);

    const categoryData = useMemo(() => {
        return categories.map(cat => {
            const count = filteredTickets.filter(t => t.category === cat.name).length;
            return { name: cat.name, count };
        }).filter(c => c.count > 0).slice(0, 4);
    }, [categories, filteredTickets]);

    const pieData = useMemo(() => {
        const byCategory: Record<string, number> = {};
        filteredTickets.forEach(t => { byCategory[t.category] = (byCategory[t.category] || 0) + 1; });
        const total = Object.values(byCategory).reduce((a, b) => a + b, 0) || 1;
        const colors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-400", "bg-rose-500"];
        return Object.entries(byCategory)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([name, val], i) => ({ name, val: `${Math.round((val / total) * 100)}%`, count: val, color: colors[i] || "bg-slate-400" }));
    }, [filteredTickets]);

    const handleExport = () => {
        const rows: string[][] = [
            ["Report Range", `Last ${timeRange} Days`],
            ["Generated", new Date().toISOString()],
            [],
            ["Metric", "Value"],
            ["Total (range)", String(stats.total)],
            ["Resolved", String(stats.totalResolved)],
            ["SLA Compliance", `${stats.compliance}%`],
            ["SLA Breaches", String(stats.breaches)],
            ["Avg CSAT", stats.avgCsat],
            [],
            ["Category", "Tickets"],
            ...categoryData.map(c => [c.name, String(c.count)]),
            [],
            ["Agent", "Resolved", "CSAT", "Avg Time"],
            ...agents.map(a => [a.name, String(a.ticketsResolved), String(a.csatScore), a.avgResolutionTime])
        ];
        const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `helpdesk-report-${timeRange}d-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast({ title: "Report Exported", description: `CSV report for last ${timeRange} days ready.` });
    };

    const handleDeployMitigation = () => {
        const existing = automations.find(a => a.title.startsWith("Auto-mitigate"));
        if (existing) {
            toast({ title: "Already Deployed", description: "Auto-mitigation rule is active.", variant: "destructive" });
            return;
        }
        addAutomation({
            title: "Auto-mitigate Payroll Spike",
            description: "Pre-assign payroll tickets to Finance Team when volume exceeds threshold.",
            enabled: true,
            type: "routing",
            condition: "category == 'Payroll' AND volume > threshold"
        });
        toast({ title: "Mitigation Deployed", description: "Auto-routing rule added. View in Settings > Automations." });
    };

    const trend30 = useMemo(() => Array.from({ length: 30 }, (_, i) => 30 + ((i * 7) % 70)), []);

    const topAgents = useMemo(() =>
        [...agents].sort((a, b) => b.csatScore - a.csatScore).slice(0, 5)
        , [agents]);

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <BarChart3 size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight uppercase flex items-center gap-2">
                            Analytical Intelligence
                            {backendAvailable === false && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full normal-case">Offline</span>}
                            {backendAvailable === true && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full normal-case">Live</span>}
                        </h1>
                        <p className="text-sm font-medium text-slate-500">Executive decision support & trends</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="h-10 w-48 border-slate-200 font-bold text-xs uppercase tracking-widest bg-white shadow-sm rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="7">Last 7 Days</SelectItem>
                            <SelectItem value="30">Last 30 Days</SelectItem>
                            <SelectItem value="90">Last Quarter</SelectItem>
                            <SelectItem value="365">Full Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 gap-2 text-xs uppercase tracking-widest shadow-lg shadow-slate-200 rounded-xl transition-all" onClick={handleExport}>
                        <Download size={16} /> Export Intelligence
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 space-y-8 pb-12">
                    {/* Top Level KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            { label: "SLA Compliance", val: `${stats.compliance}%`, trend: stats.compliance >= 90 ? "+2.1%" : "-1.2%", icon: Target, cardBg: "bg-[#CB9DF0]" },
                            { label: "Avg Resolution", val: "4.8h", trend: "-1.5h", icon: Clock, cardBg: "bg-[#F0C1E1]" },
                            { label: "Resolved Vol", val: String(stats.totalResolved), trend: `+${stats.totalResolved}`, icon: CheckCircle2, cardBg: "bg-[#FFF9BF]" },
                            { label: "Customer SAT", val: `${stats.avgCsat}/5`, trend: "+0.2", icon: Star, cardBg: "bg-[#FDDBBB]" },
                            { label: "SLA Breaches", val: String(stats.breaches), trend: stats.breaches > 0 ? `-${stats.breaches}` : "+0", icon: AlertCircle, cardBg: "bg-rose-100" },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                                <Card className={`border-none shadow-sm ${stat.cardBg} hover:shadow-xl transition-all group rounded-2xl`}>
                                    <CardContent className="p-6">
                                        <div className="h-10 w-10 bg-white/30 text-slate-800 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform backdrop-blur-sm">
                                            <stat.icon size={20} />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest block">{stat.label}</span>
                                            <span className="text-2xl font-black text-slate-900 leading-none">{stat.val}</span>
                                            <div className={`flex items-center gap-1 text-[10px] font-bold mt-1 ${stat.trend.startsWith('+') || stat.trend.startsWith('-') && stat.label !== "SLA Breaches" ? 'text-emerald-700' : 'text-rose-700'}`}>
                                                {stat.trend.startsWith('+') ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                                                {stat.trend} VS LAST
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Trend Visualization */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden rounded-3xl">
                                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                            <TrendingUp size={16} className="text-indigo-600" /> Resolution Velocity Trend
                                        </h3>
                                        <p className="text-xs font-medium text-slate-500 mt-1">Daily throughput over {timeRange} days</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">
                                            High Perf
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-8">
                                    <div className="h-[280px] flex items-end justify-between gap-1.5 relative">
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-1">
                                            {[0, 1, 2, 3, 4].map(l => <div key={l} className="w-full h-px bg-slate-300 border-dashed" />)}
                                        </div>
                                        {trend30.map((val, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${val}%` }}
                                                transition={{ delay: i * 0.02, type: 'spring' }}
                                                className="flex-1 relative group"
                                            >
                                                <div className={`w-full rounded-t-sm transition-all duration-300 ${i > 20 ? 'bg-indigo-600' : 'bg-slate-100 group-hover:bg-slate-200'}`} />
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                                                    {val} RESOLVED
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-6 px-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Week 01</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Week 02</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-indigo-600 underline underline-offset-4">Today</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden self-start">
                                    <div className="p-6 border-b border-slate-50">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <PieChart size={14} className="text-amber-500" /> Issue Distribution
                                        </h4>
                                    </div>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center justify-center py-4 relative">
                                            <div className="h-40 w-40 rounded-full border-[18px] border-emerald-500 border-t-indigo-500 border-r-amber-400 border-l-rose-500 rotate-45 group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-lg font-black text-slate-900 leading-none">{stats.total}</span>
                                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Tickets</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-4 gap-x-8 pt-4">
                                            {pieData.map((item, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-2 w-2 rounded-full ${item.color}`} />
                                                        <span className="text-[11px] font-bold text-slate-600">{item.name}</span>
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-900">{item.val}</span>
                                                </div>
                                            ))}
                                            {pieData.length === 0 && <span className="text-[10px] text-slate-400 italic font-bold col-span-2 text-center">No data for range</span>}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden self-start">
                                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Users size={14} className="text-emerald-500" /> High Performance Agents
                                        </h4>
                                        <button className="text-[10px] font-bold text-indigo-600 uppercase hover:underline" onClick={() => router.push("/hrmcubicle/helpdesk/agent-management")}>View All</button>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            {topAgents.map((agent) => (
                                                <div key={agent.id} onClick={() => router.push("/hrmcubicle/helpdesk/agent-management")} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-xl shadow-slate-200">
                                                            {agent.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[11px] font-bold text-slate-800 leading-none">{agent.name}</span>
                                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                                <Star size={10} className="fill-amber-400 text-amber-400" />
                                                                <span className="text-[10px] font-black text-slate-500 uppercase">{agent.csatScore} Rating</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black text-emerald-600 block">{agent.ticketsResolved}</span>
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Yield</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {topAgents.length === 0 && <span className="text-[10px] text-slate-400 italic font-bold block text-center">No agents yet</span>}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Analytics Sidebar */}
                        <div className="space-y-8">
                            <Card className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl">
                                <div className="relative z-10 space-y-6">
                                    <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                                        <BrainCircuit size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black tracking-tight uppercase leading-none mb-2">Automated Insights</h4>
                                        <p className="text-xs font-medium text-slate-400 leading-relaxed italic">
                                            Ticket volume for <strong className="text-white">Payroll</strong> is likely to spike by <strong className="text-emerald-400">18%</strong> next Tuesday based on monthly patterns.
                                        </p>
                                    </div>
                                    <Button className="w-full h-11 bg-white text-slate-900 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-400 hover:text-white transition-all gap-2" onClick={handleDeployMitigation}>
                                        Deploy Mitigation <ArrowUpRight size={14} />
                                    </Button>
                                </div>
                                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                    <TrendingUp size={160} />
                                </div>
                            </Card>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                                    <AlertCircle size={14} className="text-rose-500" /> Category Volume
                                </h4>
                                <div className="space-y-3">
                                    {categoryData.map((cat, i) => {
                                        const trend = i % 2 === 0 ? `+${5 + i * 3}%` : `-${2 + i}%`;
                                        return (
                                            <div key={i} onClick={() => router.push("/hrmcubicle/helpdesk/support-queue")} className="p-5 bg-white border border-slate-200 rounded-3xl group hover:border-indigo-100 transition-all cursor-pointer">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{cat.name}</span>
                                                    <Badge className={`${trend.startsWith('+') ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'} border-none font-bold text-[9px] h-5`}>{trend}</Badge>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${trend.startsWith('+') ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (cat.count / Math.max(1, stats.total)) * 100 * 3)}%` }} />
                                                </div>
                                                <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>{cat.count} Tickets</span>
                                                    <span>SLA {stats.compliance}%</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {categoryData.length === 0 && <span className="text-[10px] text-slate-400 italic font-bold block text-center">No tickets in range</span>}
                                </div>
                            </div>

                            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[28px] border-dashed text-center space-y-4">
                                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center mx-auto text-indigo-600 border border-indigo-100 shadow-sm">
                                    <FileBarChart size={20} />
                                </div>
                                <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Monthly Ops Summary</h5>
                                <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic px-4">View a compiled snapshot of this month's performance.</p>
                                <Button variant="outline" className="h-9 w-full rounded-xl border-indigo-200 text-indigo-600 text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all" onClick={() => setIsSummaryOpen(true)}>Generate Summary</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>

            {/* Summary Dialog */}
            <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
                <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
                    <DialogHeader className="bg-slate-50 border-b border-slate-200 p-6">
                        <DialogTitle className="flex items-center gap-2"><FileBarChart size={18} /> Operations Summary</DialogTitle>
                        <DialogDescription>Snapshot for last {timeRange} days.</DialogDescription>
                    </DialogHeader>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">SLA Compliance</span>
                                <div className="text-2xl font-black text-emerald-800 mt-1">{stats.compliance}%</div>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">Resolved</span>
                                <div className="text-2xl font-black text-indigo-800 mt-1">{stats.totalResolved}</div>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Breaches</span>
                                <div className="text-2xl font-black text-amber-800 mt-1">{stats.breaches}</div>
                            </div>
                            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest">Avg CSAT</span>
                                <div className="text-2xl font-black text-rose-800 mt-1">{stats.avgCsat}</div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                            <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Top Issue Categories</h5>
                            {pieData.slice(0, 3).map(p => (
                                <div key={p.name} className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-slate-800">{p.name}</span>
                                    <span className="font-black text-slate-600">{p.count} ({p.val})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200">
                        <Button variant="ghost" onClick={() => setIsSummaryOpen(false)}>Close</Button>
                        <Button onClick={() => { handleExport(); setIsSummaryOpen(false); }} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                            <Download size={14} /> Download CSV
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default HelpdeskReportsPage;
