"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Calendar,
    MapPin,
    Star,
    Filter,
    PartyPopper,
    Gift,
    Sparkles,
    CheckCircle2,
    Clock,
    X,
    ExternalLink,
    Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useMeStore } from "@/shared/data/me-store";

const fallbackHolidays = [
    { id: "f1", name: "Republic Day", date: "2026-01-26", day: "Monday", type: "Public", location: "All India", month: "January", status: "upcoming" as const },
    { id: "f2", name: "Holi", date: "2026-03-04", day: "Wednesday", type: "Public", location: "All India", month: "March", status: "upcoming" as const },
    { id: "f3", name: "Good Friday", date: "2026-04-03", day: "Friday", type: "Public", location: "All India", month: "April", status: "upcoming" as const },
    { id: "f4", name: "Eid-ul-Fitr", date: "2026-04-22", day: "Wednesday", type: "Optional", location: "All India", month: "April", status: "upcoming" as const },
    { id: "f5", name: "Independence Day", date: "2026-08-15", day: "Saturday", type: "Public", location: "All India", month: "August", status: "upcoming" as const },
    { id: "f6", name: "Diwali", date: "2026-11-08", day: "Sunday", type: "Public", location: "All India", month: "November", status: "upcoming" as const },
    { id: "f7", name: "Christmas", date: "2026-12-25", day: "Friday", type: "Public", location: "All India", month: "December", status: "upcoming" as const },
    { id: "f8", name: "New Year", date: "2026-01-01", day: "Thursday", type: "Public", location: "All India", month: "January", status: "past" as const },
];

const typeColors: Record<string, string> = {
    Public: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Optional: "bg-amber-50 text-amber-700 border-amber-200",
    Restricted: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

type Holiday = { id: string; name: string; date: string; day: string; type: string; location: string; month: string; status: "upcoming" | "past" };

export default function MyHolidaysPage() {
    const router = useRouter();
    const storeHolidays = useMeStore(s => s.holidays);
    const loadMyHolidays = useMeStore(s => s.loadMyHolidays);

    const [filter, setFilter] = useState<string>("all");
    const [view, setView] = useState<"upcoming" | "past">("upcoming");
    const [detailOpen, setDetailOpen] = useState<Holiday | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                await loadMyHolidays();
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [loadMyHolidays]);

    const holidays: Holiday[] = storeHolidays.length > 0 ? storeHolidays : fallbackHolidays;

    const filtered = holidays
        .filter(h => h.status === view)
        .filter(h => filter === "all" || h.type === filter);

    const handleRequestLeave = () => {
        router.push("/hrmcubicle/leave");
    };

    const stats = [
        { label: "Total Holidays", value: holidays.length, icon: Calendar, color: "indigo" },
        { label: "Public", value: holidays.filter(h => h.type === "Public").length, icon: Star, color: "emerald" },
        { label: "Optional", value: holidays.filter(h => h.type === "Optional").length, icon: Gift, color: "amber" },
        { label: "Restricted", value: holidays.filter(h => h.type === "Restricted").length, icon: Sparkles, color: "rose" },
    ];

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 font-sans" style={{ zoom: "80%" }}>
            <div className="mx-auto space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            My Holidays
                            {loading && <Loader2 size={16} className="animate-spin text-indigo-600" />}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {storeHolidays.length > 0 ? `${storeHolidays.length} holidays from server` : "Company holiday calendar"}
                        </p>
                    </div>
                    <Button onClick={handleRequestLeave} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100">
                        <Calendar size={16} className="mr-2" /> Request Leave
                    </Button>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl bg-${s.color}-50 flex items-center justify-center`}>
                                        <s.icon className={`text-${s.color}-600`} size={22} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                        <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <Card className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex gap-2">
                            <Button variant={view === "upcoming" ? "default" : "ghost"} onClick={() => setView("upcoming")} className={view === "upcoming" ? "bg-indigo-600 text-white rounded-lg" : "text-slate-600 rounded-lg"}>
                                Upcoming
                            </Button>
                            <Button variant={view === "past" ? "default" : "ghost"} onClick={() => setView("past")} className={view === "past" ? "bg-indigo-600 text-white rounded-lg" : "text-slate-600 rounded-lg"}>
                                Past
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter size={14} className="text-slate-400" />
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-[160px] h-9 rounded-lg text-sm">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Public">Public</SelectItem>
                                    <SelectItem value="Optional">Optional</SelectItem>
                                    <SelectItem value="Restricted">Restricted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5">
                        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map(h => {
                                const d = new Date(h.date);
                                return (
                                    <motion.div key={h.id} variants={itemVariants}>
                                        <Card onClick={() => setDetailOpen(h)} className="group bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer">
                                            <CardContent className="p-5 space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="text-center bg-indigo-50 rounded-xl p-3 min-w-[64px]">
                                                        <p className="text-[10px] font-bold text-indigo-500 uppercase">{d.toLocaleString("en-US", { month: "short" })}</p>
                                                        <p className="text-2xl font-bold text-indigo-700 leading-none">{d.getDate()}</p>
                                                    </div>
                                                    <Badge className={`${typeColors[h.type]} border text-[10px] font-semibold`}>{h.type}</Badge>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-base">{h.name}</h3>
                                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                        <Clock size={11} /> {h.day}
                                                    </p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                                        <MapPin size={11} /> {h.location}
                                                    </p>
                                                </div>
                                                {view === "past" && (
                                                    <Badge className="bg-slate-100 text-slate-600 border-none text-[10px]">
                                                        <CheckCircle2 size={10} className="mr-1" /> Passed
                                                    </Badge>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                        {filtered.length === 0 && (
                            <div className="text-center py-12 text-slate-400">
                                <PartyPopper size={40} className="mx-auto mb-2 opacity-40" />
                                <p className="text-sm">No holidays in this filter</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!detailOpen} onOpenChange={v => !v && setDetailOpen(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-0 max-w-md overflow-hidden">
                    {detailOpen && (() => {
                        const d = new Date(detailOpen.date);
                        return (
                            <>
                                <div className={`p-6 ${detailOpen.type === "Public" ? "bg-gradient-to-br from-emerald-500 to-emerald-700" : detailOpen.type === "Optional" ? "bg-gradient-to-br from-amber-500 to-amber-700" : "bg-gradient-to-br from-indigo-500 to-indigo-700"} text-white relative`}>
                                    <Button size="sm" variant="ghost" onClick={() => setDetailOpen(null)} className="absolute top-3 right-3 text-white hover:bg-white/10 h-8 w-8 p-0"><X size={16} /></Button>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/20 backdrop-blur rounded-2xl p-4 min-w-[76px] text-center">
                                            <p className="text-[11px] font-bold uppercase opacity-90">{d.toLocaleString("en-US", { month: "short" })}</p>
                                            <p className="text-3xl font-bold leading-none">{d.getDate()}</p>
                                            <p className="text-[10px] opacity-80 mt-1">{d.getFullYear()}</p>
                                        </div>
                                        <div>
                                            <Badge className="bg-white/20 text-white border-white/30 border text-[10px]">{detailOpen.type}</Badge>
                                            <h2 className="text-2xl font-bold mt-2">{detailOpen.name}</h2>
                                            <p className="text-sm opacity-90 mt-1">{detailOpen.day}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Location</p>
                                            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1"><MapPin size={13} /> {detailOpen.location}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Status</p>
                                            <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                                                {detailOpen.status === "past" ? <><CheckCircle2 size={13} className="text-emerald-600" /> Passed</> : <><Clock size={13} className="text-amber-600" /> Upcoming</>}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-xs font-semibold text-slate-700 mb-1">Holiday Type Info</p>
                                        <p className="text-xs text-slate-600">
                                            {detailOpen.type === "Public" && "Mandatory company-wide holiday. Office is closed for everyone."}
                                            {detailOpen.type === "Optional" && "Choose whether to take this day off. Optional holidays count towards your annual quota."}
                                            {detailOpen.type === "Restricted" && "Regional observance. Availability depends on your work location and policy."}
                                        </p>
                                    </div>
                                    {detailOpen.status === "upcoming" && (
                                        <Button onClick={handleRequestLeave} className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 font-bold">
                                            <ExternalLink size={14} className="mr-2" /> Plan Leave Around This Holiday
                                        </Button>
                                    )}
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
