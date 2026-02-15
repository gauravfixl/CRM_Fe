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
    ArrowUpRight,
    TrendingUp,
    TrendingDown
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
import { useTeamStore } from "@/shared/data/team-store";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";

const TeamCalendarPage = () => {
    const { toast } = useToast();
    const { calendarEvents, addEvent, members } = useTeamStore();
    const [mounted, setMounted] = useState(false);
    const [viewMode, setViewMode] = useState("month");
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);

    // Form states
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventDate, setNewEventDate] = useState("2026-01-20");
    const [newEventType, setNewEventType] = useState<'meeting' | 'birthday' | 'anniversary' | 'holiday' | 'leave'>("meeting");

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dates = Array.from({ length: 31 }, (_, i) => i + 1);

    const getEventForDate = (date: number) => {
        // Simple day matching for January 2026
        const dateStr = `2026-01-${String(date).padStart(2, '0')}`;
        return calendarEvents.filter(e => e.date === dateStr);
    };

    const handleAddEvent = () => {
        if (!newEventTitle) return;
        addEvent({
            title: newEventTitle,
            date: newEventDate,
            type: newEventType,
            attendees: [],
            color: newEventType === 'meeting' ? 'emerald' : newEventType === 'birthday' ? 'rose' : 'indigo'
        });
        setIsAddEventOpen(false);
        setNewEventTitle("");
        toast({ title: "Event Added", description: `"${newEventTitle}" has been scheduled.` });
    };

    const todaysEvents = calendarEvents.filter(e => e.date === "2026-01-19");

    return (
        <div className="flex-1 space-y-6 p-6 bg-[#f8fafc] min-h-screen text-start">

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">Team Calendar</h1>
                    <p className="text-slate-500 font-medium text-xs mt-2">Coordinate shifts, leaves, and team events in one place.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select defaultValue="jan">
                        <SelectTrigger className="w-[160px] h-10 rounded-xl border-none shadow-sm font-bold text-slate-600 bg-white text-xs">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-xl bg-white">
                            <SelectItem value="jan" className="text-xs font-bold py-2">January 2026</SelectItem>
                            <SelectItem value="feb" className="text-xs font-bold py-2">February 2026</SelectItem>
                            <SelectItem value="mar" className="text-xs font-bold py-2">March 2026</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-10 px-5 shadow-md border-none text-xs transition-all"
                        onClick={() => setIsAddEventOpen(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Event
                    </Button>
                </div>
            </div>

            <div className="bg-indigo-50/50 p-6 rounded-[3rem] border border-indigo-100 shadow-inner">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                    {/* Main Calendar View */}
                    <Card className="xl:col-span-8 border-none shadow-xl overflow-hidden bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/50">
                        <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-100 hover:bg-slate-50 border-none shadow-sm" onClick={() => toast({ title: "Navigating", description: "Moving to December 2025." })}><ChevronLeft className="h-4 w-4" /></Button>
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">January 2026</h2>
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-100 hover:bg-slate-50 border-none shadow-sm" onClick={() => toast({ title: "Navigating", description: "Moving to February 2026." })}><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex bg-slate-100/50 p-1 rounded-xl">
                                {["Day", "Week", "Month"].map(m => (
                                    <Button
                                        key={m}
                                        variant={viewMode === m.toLowerCase() ? "secondary" : "ghost"}
                                        size="sm"
                                        className={`rounded-lg font-bold text-[10px] tracking-widest px-4 h-7 border-none ${viewMode === m.toLowerCase() ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                                        onClick={() => setViewMode(m.toLowerCase())}
                                    >
                                        {m}
                                    </Button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6">
                            <div className="grid grid-cols-7 border border-indigo-100/50 rounded-2xl overflow-hidden shadow-sm bg-white">
                                {days.map(d => (
                                    <div key={d} className="py-4 bg-indigo-50/50 border-b border-indigo-100/50 text-center text-[10px] font-bold text-indigo-600 tracking-widest uppercase">
                                        {d}
                                    </div>
                                ))}
                                {dates.map((d, i) => {
                                    const events = getEventForDate(d);
                                    return (
                                        <div key={d} className={`min-h-[110px] p-2 border-r border-b border-indigo-50/50 hover:bg-indigo-50 transition-all duration-300 cursor-pointer group ${i % 7 === 6 ? 'border-r-0' : ''}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[11px] font-extrabold ${d === 19 ? 'h-6 w-6 bg-indigo-600 text-white flex items-center justify-center rounded-lg shadow-lg' : 'text-slate-400 group-hover:text-indigo-600'}`}>{d}</span>
                                                {events.length > 0 && <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />}
                                            </div>
                                            <div className="space-y-1">
                                                {events.map((ev, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`px-2 py-1 rounded-lg border text-[9px] font-bold truncate transition-all hover:scale-105 shadow-sm border-transparent ${ev.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                                                            ev.color === 'rose' ? 'bg-rose-100 text-rose-700' :
                                                                ev.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                                                                    ev.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                            }`}
                                                    >
                                                        {ev.title}
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
                    <div className="xl:col-span-4 space-y-6">

                        {/* Selected Day View */}
                        <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-white text-slate-900 rounded-2xl p-5 overflow-hidden relative group border border-indigo-100/50">
                            <div className="relative z-10 space-y-6 text-start">
                                <div>
                                    <h3 className="text-[10px] font-bold tracking-widest text-indigo-400 mb-1">Today's Schedule</h3>
                                    <p className="text-2xl font-bold tracking-tight text-slate-900">Monday, Jan 19</p>
                                </div>

                                <div className="space-y-3">
                                    {todaysEvents.length > 0 ? todaysEvents.map((ev, idx) => (
                                        <div key={idx} className={`flex items-center gap-3 p-3 bg-white border ${ev.type === 'meeting' ? 'border-emerald-100' : 'border-indigo-100'} rounded-2xl group/item cursor-pointer hover:shadow-md transition-all`}>
                                            <div className={`h-8 w-8 shrink-0 ${ev.type === 'meeting' ? 'bg-emerald-500' : 'bg-indigo-600'} rounded-lg flex items-center justify-center shadow-md`}>
                                                {ev.type === 'meeting' ? <Video className="h-4 w-4 text-white" /> : <Star className="h-4 w-4 text-white" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-800 text-xs">{ev.title}</p>
                                                <p className="text-[9px] text-slate-400 font-bold mt-0.5 tracking-tight">
                                                    {ev.type === 'meeting' ? '02:00 PM • Zoom' : 'Team Celebration'}
                                                </p>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-slate-400 font-bold text-center py-4">No events scheduled today.</p>
                                    )}
                                </div>

                                <Button
                                    className="w-full h-10 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold text-[10px] tracking-widest shadow-md border-none transition-all"
                                    onClick={() => toast({ title: "Calendar Synced", description: "Your external calendar has been updated." })}
                                >
                                    Sync Calendar
                                </Button>
                            </div>
                            <CalendarIcon className="absolute top-0 right-0 h-40 w-40 -mr-10 -mt-10 opacity-[0.03] pointer-events-none rotate-12 text-indigo-900" />
                        </Card>

                        {/* Upcomng Celebrations List */}
                        <Card className="border-none shadow-sm text-start rounded-2xl bg-white overflow-hidden">
                            <CardHeader className="bg-slate-50/50 py-3 px-5 border-b border-slate-100 flex items-center justify-between">
                                <CardTitle className="text-[10px] font-bold text-slate-400 tracking-widest">Team Celebrations</CardTitle>
                                <Gift className="h-3.5 w-3.5 text-rose-500" />
                            </CardHeader>
                            <CardContent className="p-0">
                                {[
                                    { name: "Kriti Sanon", event: "Birthday", date: "Jan 21", img: "https://i.pravatar.cc/150?u=kriti" },
                                    { name: "Aman Gupta", event: "Work Anniversary", date: "Jan 28", img: "https://i.pravatar.cc/150?u=aman" }
                                ].map((c, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 border-b border-slate-50 last:border-none hover:bg-slate-50/30 transition-colors">
                                        <Avatar className="h-8 w-8 ring-1 ring-slate-100 shadow-sm">
                                            <AvatarImage src={c.img} />
                                            <AvatarFallback className="text-[10px]">SR</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 text-start">
                                            <p className="text-xs font-bold text-slate-800">{c.name}</p>
                                            <p className="text-[9px] font-bold text-indigo-600 tracking-tight mt-0.5">{c.event} • {c.date}</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-full font-bold text-[8px] h-6 px-3 border-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all"
                                            onClick={() => toast({ title: "Wish Sent!", description: `Your greeting has been sent to ${c.name}.` })}
                                        >
                                            Wish
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>

            {/* Add Event Dialog */}
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogContent className="rounded-[2rem] border border-slate-100 shadow-2xl p-0 bg-white max-w-sm overflow-hidden">
                    <div className="h-2 w-full bg-indigo-600" />
                    <div className="p-8 pt-6 text-start">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">New Event</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-1.5 text-start">
                                <Label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1">Event Title</Label>
                                <Input
                                    placeholder="Meeting, Lunch, etc."
                                    value={newEventTitle}
                                    onChange={(e) => setNewEventTitle(e.target.value)}
                                    className="rounded-xl bg-slate-50 border-none h-11 font-bold text-sm shadow-inner"
                                />
                            </div>
                            <div className="space-y-1.5 text-start">
                                <Label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1">Date</Label>
                                <Input
                                    type="date"
                                    value={newEventDate}
                                    onChange={(e) => setNewEventDate(e.target.value)}
                                    className="rounded-xl bg-slate-50 border-none h-11 font-bold text-sm shadow-inner"
                                />
                            </div>
                            <div className="space-y-1.5 text-start">
                                <Label className="text-[10px] font-bold text-slate-400 tracking-widest ml-1">Event Type</Label>
                                <Select value={newEventType} onValueChange={(v: any) => setNewEventType(v)}>
                                    <SelectTrigger className="rounded-xl bg-slate-50 border-none h-11 font-bold text-sm shadow-inner">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-xl bg-white">
                                        <SelectItem value="meeting" className="font-bold py-2 text-xs">Meeting</SelectItem>
                                        <SelectItem value="birthday" className="font-bold py-2 text-xs">Birthday</SelectItem>
                                        <SelectItem value="anniversary" className="font-bold py-2 text-xs">Anniversary</SelectItem>
                                        <SelectItem value="holiday" className="font-bold py-2 text-xs">Holiday</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter className="pt-2">
                            <Button
                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-indigo-100 transition-all duration-300"
                                onClick={handleAddEvent}
                            >
                                Create Event
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

        </div >
    );
};

export default TeamCalendarPage;
