"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter,
    MapPin,
    Clock,
    Users,
    Star,
    Gift,
    Plane,
    Video,
    MoreHorizontal,
    Search,
    ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/shared/components/ui/select";
import { useToast } from "@/shared/components/ui/use-toast";

const TeamCalendarPage = () => {
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [viewMode, setViewMode] = useState("month");

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dates = Array.from({ length: 31 }, (_, i) => i + 1);

    const teamEvents = [
        { date: 19, type: "anniversary", name: "Vijay Shinde", label: "Work Anniv.", color: "indigo" },
        { date: 21, type: "birthday", name: "Kriti Sanon", label: "Birthday", color: "rose" },
        { date: 22, type: "leave", name: "Sana Khan", label: "On Leave", color: "amber" },
        { date: 22, type: "meeting", name: "Design Review", label: "Sync Up", color: "emerald" },
        { date: 23, type: "leave", name: "Sana Khan", label: "On Leave", color: "amber" },
        { date: 26, type: "holiday", name: "Republic Day", label: "Holiday", color: "slate" },
    ];

    const getEventForDate = (date: number) => {
        return teamEvents.filter(e => e.date === date);
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-[#fcfdff] min-h-screen text-start">

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Team Calendar</h1>
                    <p className="text-slate-500 font-medium">Coordinate shifts, leaves, and team events in one place.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select defaultValue="jan">
                        <SelectTrigger className="w-[180px] h-11 rounded-xl border-slate-200 font-bold text-slate-700 bg-white">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                            <SelectItem value="jan">January 2026</SelectItem>
                            <SelectItem value="feb">February 2026</SelectItem>
                            <SelectItem value="mar">March 2026</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button className="bg-[#6366f1] hover:bg-[#4f46e5] rounded-xl font-bold h-11 px-6 shadow-lg shadow-indigo-100">
                        <Plus className="h-4 w-4 mr-2" /> Add Event
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                {/* Main Calendar View */}
                <Card className="xl:col-span-8 border-none shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-200"><ChevronLeft className="h-4 w-4" /></Button>
                            <h2 className="text-xl font-black text-slate-900">January 2026</h2>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-200"><ChevronRight className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                            {["Day", "Week", "Month"].map(m => (
                                <Button
                                    key={m}
                                    variant={viewMode === m.toLowerCase() ? "secondary" : "ghost"}
                                    size="sm"
                                    className={`rounded-lg font-bold text-[10px] uppercase tracking-wider px-6 h-8 ${viewMode === m.toLowerCase() ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                                    onClick={() => setViewMode(m.toLowerCase())}
                                >
                                    {m}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-7 border border-slate-100 rounded-[2rem] overflow-hidden">
                            {days.map(d => (
                                <div key={d} className="py-4 bg-slate-50 border-b border-slate-100 text-center text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                    {d}
                                </div>
                            ))}
                            {dates.map((d, i) => {
                                const events = getEventForDate(d);
                                return (
                                    <div key={d} className={`min-h-[140px] p-3 border-r border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group ${i % 7 === 6 ? 'border-r-0' : ''}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-xs font-black ${d === 19 ? 'h-6 w-6 bg-indigo-600 text-white flex items-center justify-center rounded-lg shadow-md' : 'text-slate-400'}`}>{d}</span>
                                            {events.length > 0 && <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                                        </div>
                                        <div className="space-y-1.5">
                                            {events.map((ev, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`px-2 py-1.5 rounded-lg border text-[8.5px] font-bold truncate transition-transform hover:scale-105 ${ev.color === 'indigo' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                                                        ev.color === 'rose' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                                                            ev.color === 'amber' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                                                                ev.color === 'emerald' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-600'
                                                        }`}
                                                >
                                                    {ev.label}: {ev.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Event Sidebar Details */}
                <div className="xl:col-span-4 space-y-8">

                    {/* Selected Day View */}
                    <Card className="border-none shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2.5rem] p-8 overflow-hidden relative group">
                        <div className="relative z-10 space-y-8">
                            <div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Schedule Today</h3>
                                <p className="text-3xl font-black tracking-tight">Monday, Jan 19</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-3xl group/item cursor-pointer hover:bg-white/10 transition-all">
                                    <div className="h-10 w-10 shrink-0 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Star className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-sm">3rd Work Anniversary</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Vijay Shinde • Core Team</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white"><Plus className="h-4 w-4" /></Button>
                                </div>

                                <div className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-3xl group/item cursor-pointer hover:bg-white/10 transition-all">
                                    <div className="h-10 w-10 shrink-0 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <Video className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-sm">Design Sync Up</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">02:00 PM - 03:00 PM • Zoom</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white"><ArrowUpRight className="h-4 w-4" /></Button>
                                </div>
                            </div>

                            <Button className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black text-[10px] tracking-[0.2em] shadow-xl">
                                SYNC TO MY CALENDAR
                            </Button>
                        </div>
                        <CalendarIcon className="absolute top-0 right-0 h-48 w-48 -mr-12 -mt-12 opacity-5 pointer-events-none" />
                    </Card>

                    {/* Upcomng Celebrations List */}
                    <Card className="border-none shadow-sm text-start">
                        <CardHeader className="bg-slate-50/50 py-4 px-6 border-b border-slate-100 flex items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Team Celebrations</CardTitle>
                            <Gift className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent className="p-0">
                            {[
                                { name: "Kriti Sanon", event: "Birthday", date: "Jan 21", img: "https://i.pravatar.cc/150?u=kriti" },
                                { name: "Aman Gupta", event: "Work Anniversary", date: "Jan 28", img: "https://i.pravatar.cc/150?u=aman" }
                            ].map((c, i) => (
                                <div key={i} className="flex items-center gap-4 p-6 border-b border-slate-50 last:border-none hover:bg-slate-50/30 transition-colors">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={c.img} />
                                        <AvatarFallback>SR</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">{c.name}</p>
                                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">{c.event} • {c.date}</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-full font-bold text-[9px] border-slate-200">WISH</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                </div>
            </div>

        </div>
    );
};

export default TeamCalendarPage;
