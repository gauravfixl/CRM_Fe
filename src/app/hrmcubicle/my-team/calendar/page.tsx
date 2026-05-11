"use client"

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
    Clock,
    Star,
    Gift,
    Video,
    Edit,
    Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
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
    DialogDescription,
} from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { getHolidaysByYear, createHoliday, deleteHoliday } from "@/modules/hrm/hooks/hrmHooks";
import { validateEventForm, ValidationErrors } from "@/shared/utils/form-validation";

const TeamCalendarPage = () => {
    const { toast } = useToast();
    const { calendarEvents, addEvent, updateEvent, deleteEvent } = useTeamStore();
    const [mounted, setMounted] = useState(false);
    const [viewMode, setViewMode] = useState("month");
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [dayEventsOpen, setDayEventsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>("");

    // Form states
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventDate, setNewEventDate] = useState("2026-01-20");
    const [newEventTime, setNewEventTime] = useState("");
    const [newEventLocation, setNewEventLocation] = useState("");
    const [newEventType, setNewEventType] = useState<'meeting' | 'birthday' | 'anniversary' | 'holiday' | 'leave'>("meeting");
    const [currentMonth, setCurrentMonth] = useState(0); // 0 = January 2026
    const [currentYear, setCurrentYear] = useState(2026);
    const [backendAvailable, setBackendAvailable] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync holidays from backend on mount
    useEffect(() => {
        const syncHolidays = async () => {
            try {
                const res = await getHolidaysByYear(currentYear);
                const backendHolidays = res?.data?.data ?? res?.data ?? [];
                if (Array.isArray(backendHolidays)) {
                    const store = useTeamStore.getState();
                    const existingHolidayTitles = new Set(
                        store.calendarEvents.filter(e => e.type === 'holiday').map(e => e.title + e.date)
                    );
                    backendHolidays.forEach((h: any) => {
                        const date = new Date(h.date).toISOString().slice(0, 10);
                        const key = (h.name || "") + date;
                        if (!existingHolidayTitles.has(key)) {
                            store.addEvent({
                                title: h.name,
                                date,
                                type: 'holiday',
                                attendees: [],
                                color: 'indigo',
                            });
                        }
                    });
                }
                setBackendAvailable(true);
            } catch {
                setBackendAvailable(false);
            }
        };
        syncHolidays();
    }, [currentYear]);

    if (!mounted) return null;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getEventForDate = (date: number) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        return calendarEvents.filter(e => e.date === dateStr);
    };

    const todayDate = new Date();
    const isCurrentMonth = todayDate.getFullYear() === currentYear && todayDate.getMonth() === currentMonth;
    const todayDay = isCurrentMonth ? todayDate.getDate() : -1;

    const openAddDialog = (dateStr?: string) => {
        setEditingEvent(null);
        setNewEventTitle("");
        setNewEventDate(dateStr || `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-20`);
        setNewEventTime("");
        setNewEventLocation("");
        setNewEventType("meeting");
        setIsAddEventOpen(true);
    };

    const openEditDialog = (event: any) => {
        setEditingEvent(event);
        setNewEventTitle(event.title);
        setNewEventDate(event.date);
        setNewEventTime(event.time || "");
        setNewEventLocation(event.location || "");
        setNewEventType(event.type);
        setIsAddEventOpen(true);
        setDayEventsOpen(false);
    };

    const handleSaveEvent = async () => {
        const errors = validateEventForm({
            title: newEventTitle,
            date: newEventDate,
            time: newEventTime,
            location: newEventLocation,
            type: newEventType,
        });
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast({ title: "Please fix form errors", description: "Some fields are invalid.", variant: "destructive" });
            return;
        }
        setFormErrors({});
        setIsSubmitting(true);

        const colorMap: Record<string, string> = {
            meeting: 'emerald',
            birthday: 'rose',
            anniversary: 'rose',
            holiday: 'indigo',
            leave: 'amber',
        };
        const payload = {
            title: newEventTitle,
            date: newEventDate,
            type: newEventType,
            attendees: editingEvent?.attendees || [],
            color: colorMap[newEventType] || 'slate',
            time: newEventTime,
            location: newEventLocation,
        };

        try {
            // Only holidays go to backend — other events are local
            if (newEventType === 'holiday' && !editingEvent && backendAvailable) {
                try {
                    await createHoliday({
                        name: newEventTitle,
                        date: newEventDate,
                        type: "National",
                        isPaid: true,
                    });
                } catch { /* fall through to local */ }
            }

            if (editingEvent) {
                updateEvent(editingEvent.id, payload);
                toast({ title: "Event Updated", description: `"${newEventTitle}" has been saved.` });
            } else {
                addEvent(payload);
                toast({ title: "Event Added", description: newEventType === 'holiday' && backendAvailable ? `"${newEventTitle}" synced to holiday calendar.` : `"${newEventTitle}" scheduled locally.` });
            }
            setIsAddEventOpen(false);
            setEditingEvent(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEvent = async (id: string, title: string) => {
        const event = calendarEvents.find(e => e.id === id);
        deleteEvent(id);
        if (event?.type === 'holiday' && backendAvailable) {
            try { await deleteHoliday(id); } catch {}
        }
        toast({ title: "Event Removed", description: `"${title}" has been deleted.`, variant: "destructive" });
    };

    const openDayEvents = (dateStr: string) => {
        setSelectedDate(dateStr);
        setDayEventsOpen(true);
    };

    const getEventsForSelectedDate = () => {
        return calendarEvents.filter(e => e.date === selectedDate);
    };

    const todayDateStr = todayDate.toISOString().split('T')[0];
    const todaysEvents = calendarEvents.filter(e => e.date === todayDateStr);

    const handleSyncCalendar = () => {
        let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//HRM Team Calendar//EN\r\nCALSCALE:GREGORIAN\r\n";
        calendarEvents.forEach(ev => {
            const dateFormatted = ev.date.replace(/-/g, "");
            icsContent += "BEGIN:VEVENT\r\n";
            icsContent += `UID:${ev.id}@fixl-hrm\r\n`;
            icsContent += `DTSTART;VALUE=DATE:${dateFormatted}\r\n`;
            icsContent += `DTEND;VALUE=DATE:${dateFormatted}\r\n`;
            icsContent += `SUMMARY:${ev.title}\r\n`;
            icsContent += `DESCRIPTION:${ev.type}${ev.time ? ' at ' + ev.time : ''}${ev.location ? ' - ' + ev.location : ''}\r\n`;
            if (ev.location) icsContent += `LOCATION:${ev.location}\r\n`;
            icsContent += "END:VEVENT\r\n";
        });
        icsContent += "END:VCALENDAR\r\n";
        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Team_Calendar.ics";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: "Calendar Exported", description: "ICS file downloaded. Import it into your calendar app." });
    };

    return (
        <div className="flex-1 space-y-6 p-6 bg-[#f8fafc] min-h-screen text-start" style={{ zoom: "90%" }}>

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">Team Calendar</h1>
                    <p className="text-slate-500 font-medium text-xs mt-2">Coordinate shifts, leaves, and team events in one place.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={`${currentYear}-${currentMonth}`} onValueChange={(v) => {
                        const [y, m] = v.split('-').map(Number);
                        setCurrentYear(y);
                        setCurrentMonth(m);
                    }}>
                        <SelectTrigger className="w-[180px] h-10 rounded-xl border border-slate-200 shadow-sm font-bold text-slate-600 bg-white text-xs">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-xl bg-white max-h-[300px]">
                            {monthNames.map((name, idx) => (
                                <SelectItem key={`2026-${idx}`} value={`2026-${idx}`} className="text-xs font-bold py-2">{name} 2026</SelectItem>
                            ))}
                            {monthNames.map((name, idx) => (
                                <SelectItem key={`2027-${idx}`} value={`2027-${idx}`} className="text-xs font-bold py-2">{name} 2027</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold h-10 px-5 shadow-md border-none text-xs transition-all"
                        onClick={() => openAddDialog()}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Event
                    </Button>
                </div>
            </div>

            <div className="bg-indigo-50/50 p-6 rounded-[3rem] border border-indigo-100 shadow-inner">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                    {/* Main Calendar */}
                    <Card className="xl:col-span-8 border-none shadow-xl overflow-hidden bg-white/80 backdrop-blur-md rounded-[2rem] border border-white/50">
                        <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-100 hover:bg-slate-50 border-none shadow-sm" onClick={handlePrevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">{monthNames[currentMonth]} {currentYear}</h2>
                                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-slate-100 hover:bg-slate-50 border-none shadow-sm" onClick={handleNextMonth}><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                            <div className="flex bg-slate-100/50 p-1 rounded-xl">
                                {["Day", "Week", "Month"].map(m => (
                                    <Button
                                        key={m}
                                        variant={viewMode === m.toLowerCase() ? "secondary" : "ghost"}
                                        size="sm"
                                        className={`rounded-lg font-bold text-[10px] tracking-widest px-4 h-7 border-none ${viewMode === m.toLowerCase() ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                                        onClick={() => {
                                            setViewMode(m.toLowerCase());
                                            if (m !== "Month") toast({ title: `${m} View`, description: `Switching to ${m.toLowerCase()} view. Currently showing month grid.` });
                                        }}
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
                                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                                    <div key={`empty-${i}`} className="min-h-[110px] p-2 border-r border-b border-indigo-50/50" />
                                ))}
                                {dates.map((d, i) => {
                                    const events = getEventForDate(d);
                                    const cellIndex = firstDayOfWeek + i;
                                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                    return (
                                        <div
                                            key={d}
                                            onClick={() => events.length > 0 ? openDayEvents(dateStr) : openAddDialog(dateStr)}
                                            className={`min-h-[110px] p-2 border-r border-b border-indigo-50/50 hover:bg-indigo-50 transition-all duration-300 cursor-pointer group ${cellIndex % 7 === 6 ? 'border-r-0' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[11px] font-extrabold ${d === todayDay ? 'h-6 w-6 bg-indigo-600 text-white flex items-center justify-center rounded-lg shadow-lg' : 'text-slate-400 group-hover:text-indigo-600'}`}>{d}</span>
                                                {events.length > 0 && <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />}
                                            </div>
                                            <div className="space-y-1">
                                                {events.slice(0, 3).map((ev) => (
                                                    <div
                                                        key={ev.id}
                                                        className={`px-2 py-1 rounded-lg border text-[9px] font-bold truncate transition-all hover:scale-105 shadow-sm border-transparent ${ev.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                                                            ev.color === 'rose' ? 'bg-rose-100 text-rose-700' :
                                                                ev.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                                                                    ev.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                                                            }`}
                                                    >
                                                        {ev.title}
                                                    </div>
                                                ))}
                                                {events.length > 3 && (
                                                    <div className="text-[9px] font-bold text-indigo-500">+{events.length - 3} more</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar */}
                    <div className="xl:col-span-4 space-y-6">

                        <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-white text-slate-900 rounded-2xl p-5 overflow-hidden relative group border border-indigo-100/50">
                            <div className="relative z-10 space-y-6 text-start">
                                <div>
                                    <h3 className="text-[10px] font-bold tracking-widest text-indigo-400 mb-1">Today's Schedule</h3>
                                    <p className="text-2xl font-bold tracking-tight text-slate-900">{todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                </div>

                                <div className="space-y-3">
                                    {todaysEvents.length > 0 ? todaysEvents.map((ev) => (
                                        <div key={ev.id} className={`flex items-center gap-3 p-3 bg-white border ${ev.type === 'meeting' ? 'border-emerald-100' : 'border-indigo-100'} rounded-2xl group/item cursor-pointer hover:shadow-md transition-all`} onClick={() => openEditDialog(ev)}>
                                            <div className={`h-8 w-8 shrink-0 ${ev.type === 'meeting' ? 'bg-emerald-500' : 'bg-indigo-600'} rounded-lg flex items-center justify-center shadow-md`}>
                                                {ev.type === 'meeting' ? <Video className="h-4 w-4 text-white" /> : <Star className="h-4 w-4 text-white" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-slate-800 text-xs">{ev.title}</p>
                                                <p className="text-[9px] text-slate-400 font-bold mt-0.5 tracking-tight">
                                                    {ev.time ? ev.time + (ev.location ? ` • ${ev.location}` : '') : ev.type}
                                                </p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover/item:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); handleDeleteEvent(ev.id, ev.title); }}>
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-slate-400 font-bold text-center py-4">No events scheduled today.</p>
                                    )}
                                </div>

                                <Button
                                    className="w-full h-10 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold text-[10px] tracking-widest shadow-md border-none transition-all"
                                    onClick={handleSyncCalendar}
                                >
                                    Sync Calendar
                                </Button>
                            </div>
                            <CalendarIcon className="absolute top-0 right-0 h-40 w-40 -mr-10 -mt-10 opacity-[0.03] pointer-events-none rotate-12 text-indigo-900" />
                        </Card>

                        {/* Upcoming Celebrations */}
                        <Card className="border-none shadow-sm text-start rounded-2xl bg-white overflow-hidden">
                            <CardHeader className="bg-slate-50/50 py-3 px-5 border-b border-slate-100 flex items-center justify-between">
                                <CardTitle className="text-[10px] font-bold text-slate-400 tracking-widest">Team Celebrations</CardTitle>
                                <Gift className="h-3.5 w-3.5 text-rose-500" />
                            </CardHeader>
                            <CardContent className="p-0">
                                {calendarEvents
                                    .filter(e => (e.type === 'birthday' || e.type === 'anniversary') && new Date(e.date) >= new Date(new Date().toDateString()))
                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                    .slice(0, 4)
                                    .map((c) => (
                                        <div key={c.id} className="flex items-center gap-3 p-4 border-b border-slate-50 last:border-none hover:bg-slate-50/30 transition-colors">
                                            <Avatar className="h-8 w-8 ring-1 ring-slate-100 shadow-sm">
                                                <AvatarFallback className="text-[10px] bg-rose-50 text-rose-600 font-bold">{c.title.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 text-start">
                                                <p className="text-xs font-bold text-slate-800">{c.title}</p>
                                                <p className="text-[9px] font-bold text-indigo-600 tracking-tight mt-0.5 capitalize">{c.type} • {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full font-bold text-[8px] h-6 px-3 border-slate-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all"
                                                onClick={() => toast({ title: `${c.type === 'birthday' ? 'Birthday' : 'Anniversary'} Wish Sent!`, description: `A personalized greeting has been delivered for ${c.title}.` })}
                                            >
                                                Wish
                                            </Button>
                                        </div>
                                    ))}
                                {calendarEvents.filter(e => (e.type === 'birthday' || e.type === 'anniversary') && new Date(e.date) >= new Date(new Date().toDateString())).length === 0 && (
                                    <div className="text-center p-6 text-[10px] font-bold text-slate-400">No upcoming celebrations.</div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>

            {/* Add/Edit Event Dialog */}
            <SideFormSheet
                open={isAddEventOpen}
                onOpenChange={(open) => { setIsAddEventOpen(open); if (!open) { setEditingEvent(null); setFormErrors({}); } }}
                title={editingEvent ? "Edit Event" : "New Event"}
                description={editingEvent ? "Update event details below." : "Schedule a new team event."}
                accentColor="#4f46e5"
                width="md"
                loading={isSubmitting}
                submitLabel={editingEvent ? "Save Changes" : "Create Event"}
                onSubmit={(e) => { e.preventDefault(); handleSaveEvent(); }}
                footer={
                    <>
                        {editingEvent && (
                            <Button type="button" variant="outline" className="border-rose-100 text-rose-500 hover:bg-rose-50 rounded-lg h-10 px-4 font-bold mr-auto" onClick={() => { handleDeleteEvent(editingEvent.id, editingEvent.title); setIsAddEventOpen(false); setEditingEvent(null); }}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                        )}
                        <Button type="button" variant="outline" onClick={() => { setIsAddEventOpen(false); setEditingEvent(null); setFormErrors({}); }} disabled={isSubmitting} className="h-10 px-5 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6]">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="h-10 px-5 rounded-lg text-white hover:brightness-110" style={{ backgroundColor: "#4f46e5", boxShadow: "0 4px 12px #4f46e533" }}>
                            {isSubmitting ? "Saving..." : (editingEvent ? "Save Changes" : "Create Event")}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Field label="Event Title" required hint="min 2 chars" error={formErrors.title || undefined}>
                        <Input
                            placeholder="Meeting, Lunch, etc."
                            value={newEventTitle}
                            onChange={(e) => { setNewEventTitle(e.target.value); if (formErrors.title) setFormErrors({ ...formErrors, title: "" }); }}
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Date" required error={formErrors.date || undefined}>
                            <Input
                                type="date"
                                value={newEventDate}
                                onChange={(e) => { setNewEventDate(e.target.value); if (formErrors.date) setFormErrors({ ...formErrors, date: "" }); }}
                            />
                        </Field>
                        <Field label="Time">
                            <Input
                                type="time"
                                value={newEventTime}
                                onChange={(e) => setNewEventTime(e.target.value)}
                            />
                        </Field>
                    </div>
                    <Field label="Location">
                        <Input
                            placeholder="Zoom, Conference Room A..."
                            value={newEventLocation}
                            onChange={(e) => setNewEventLocation(e.target.value)}
                        />
                    </Field>
                    <Field label="Event Type">
                        <Select value={newEventType} onValueChange={(v: any) => setNewEventType(v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="meeting">Meeting</SelectItem>
                                <SelectItem value="birthday">Birthday</SelectItem>
                                <SelectItem value="anniversary">Anniversary</SelectItem>
                                <SelectItem value="holiday">Holiday</SelectItem>
                                <SelectItem value="leave">Leave</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            {/* Day Events Dialog */}
            <Dialog open={dayEventsOpen} onOpenChange={setDayEventsOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-indigo-600" />
                            {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-sm">{getEventsForSelectedDate().length} event(s)</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
                        {getEventsForSelectedDate().map(ev => (
                            <div key={ev.id} className={`p-4 rounded-xl border ${ev.color === 'emerald' ? 'bg-emerald-50 border-emerald-100' : ev.color === 'rose' ? 'bg-rose-50 border-rose-100' : ev.color === 'amber' ? 'bg-amber-50 border-amber-100' : 'bg-indigo-50 border-indigo-100'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 text-sm">{ev.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge className="bg-white text-slate-600 border-none text-[9px] font-bold capitalize">{ev.type}</Badge>
                                            {ev.time && <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" />{ev.time}</span>}
                                        </div>
                                        {ev.location && <p className="text-[10px] text-slate-500 font-bold mt-1">📍 {ev.location}</p>}
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white" onClick={() => openEditDialog(ev)}>
                                            <Edit className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-white" onClick={() => handleDeleteEvent(ev.id, ev.title)}>
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-xl h-10 font-bold" onClick={() => setDayEventsOpen(false)}>Close</Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 font-bold border-none" onClick={() => { setDayEventsOpen(false); openAddDialog(selectedDate); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Event
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div >
    );
};

export default TeamCalendarPage;
