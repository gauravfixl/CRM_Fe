"use client"

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Plus, Star, Map, History, MoreHorizontal, Trash2, Edit, X } from "lucide-react";
import { useToast } from "@/shared/components/ui/use-toast";
import { useEngageStore, type Event } from "@/shared/data/engage-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/shared/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const EventsPage = () => {
    const [activeTab, setActiveTab] = useState("Upcoming");
    const { toast } = useToast();
    const { events, addEvent, toggleRegistration, deleteEvent } = useEngageStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        category: "Social",
        date: "",
        time: "",
        location: ""
    });

    const resetForm = () => {
        setFormData({ title: "", category: "Social", date: "", time: "", location: "" });
    };

    const handleSave = () => {
        if (!formData.title || !formData.date || !formData.location) {
            toast({ title: "Error", description: "Please fill in all mandatory fields.", variant: "destructive" });
            return;
        }
        addEvent(formData);
        toast({ title: "Event Created", description: "Your event has been scheduled." });
        setIsDialogOpen(false);
        resetForm();
    };

    const filteredEvents = activeTab === 'Calendar' ? [] : events.filter(e => {
        const eventDate = new Date(e.date);
        const today = new Date();
        if (activeTab === 'Upcoming') return eventDate >= today;
        if (activeTab === 'Past') return eventDate < today;
        if (activeTab === 'My') return e.registered;
        return true;
    });

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Events & Celebrations</h1>
                    <p className="text-slate-500 font-medium">Keep track of company-wide events, workshops, and celebrations.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsDialogOpen(true); }}
                    className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-bold border-none transition-all hover:scale-105"
                >
                    <Plus className="mr-2 h-5 w-5" /> Create Event
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 flex-1 flex flex-col">
                <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12 w-fit">
                    <TabsTrigger value="Upcoming" className="rounded-xl px-8 font-bold">Upcoming</TabsTrigger>
                    <TabsTrigger value="Past" className="rounded-xl px-8 font-bold">Past Events</TabsTrigger>
                    <TabsTrigger value="My" className="rounded-xl px-8 font-bold">My Schedule</TabsTrigger>
                    <TabsTrigger value="Calendar" className="rounded-xl px-8 font-bold">Calendar</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 m-0 flex-1 h-auto">
                    {activeTab !== 'Calendar' && filteredEvents.map((event, i) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="rounded-[2.5rem] border-none shadow-sm bg-white hover:shadow-xl hover:shadow-purple-50 transition-all group overflow-hidden flex flex-col h-full border-t-8 border-[#CB9DF0]">
                                <CardContent className="p-8 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <Badge className="bg-purple-50 text-[#CB9DF0] border-none font-black px-4 py-2 rounded-xl h-9 italic uppercase text-[10px] tracking-widest">{event.category}</Badge>
                                        <div className="flex items-center gap-1">
                                            <div className="flex -space-x-2 mr-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-black text-slate-300 uppercase">{event.attendees} Registered</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-purple-600 transition-colors mb-6">{event.title}</h3>

                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                            <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Calendar className="h-4 w-4" />
                                            </div>
                                            {event.date}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                            <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            {event.time}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                            <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-50 flex gap-4">
                                        <Button
                                            onClick={() => toggleRegistration(event.id)}
                                            className={`flex-1 rounded-2xl h-12 font-black transition-all ${event.registered
                                                    ? 'bg-slate-100 text-slate-400 hover:bg-slate-200 border-none'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                                                }`}
                                        >
                                            {event.registered ? 'Cancel RSVP' : 'Join Event'}
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-12 w-12 rounded-2xl p-0 text-slate-300">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-none p-2 font-bold">
                                                <DropdownMenuItem className="rounded-xl h-11 px-3"><Edit className="h-4 w-4 mr-2" /> Modify Event</DropdownMenuItem>
                                                <DropdownMenuItem className="rounded-xl h-11 px-3"><Plus className="h-4 w-4 mr-2" /> Add to iCal</DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-slate-50 my-2" />
                                                <DropdownMenuItem
                                                    onClick={() => deleteEvent(event.id)}
                                                    className="rounded-xl h-11 px-3 text-red-600 focus:bg-red-50 focus:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" /> Cancel Event
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    {activeTab === 'Calendar' && (
                        <div className="col-span-full">
                            <Card className="rounded-[3rem] border-none shadow-sm bg-white p-10">
                                <div className="grid grid-cols-7 gap-4">
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                        <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400 pb-4">{day}</div>
                                    ))}
                                    {Array.from({ length: 35 }, (_, i) => i - 2).map((day, idx) => (
                                        <div key={idx} className={`h-32 rounded-[2rem] p-4 relative border-2 ${day === 25 ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-50'} ${day <= 0 || day > 31 ? 'opacity-10' : ''}`}>
                                            <span className={`text-xs font-black ${day === 25 ? 'text-indigo-600' : 'text-slate-400'}`}>{day > 0 && day <= 31 ? day : ''}</span>
                                            {day === 25 && (
                                                <div className="mt-2 p-2 bg-indigo-500 rounded-xl text-[8px] font-black text-white uppercase tracking-tighter truncate">
                                                    Tech Summit
                                                </div>
                                            )}
                                            {day === 22 && (
                                                <div className="mt-2 p-2 bg-amber-400 rounded-xl text-[8px] font-black text-white uppercase tracking-tighter truncate">
                                                    PM Workshop
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Event Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-2xl shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-slate-900 tracking-tighter">Plan Celebration</DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-base mt-2">
                            Events bring teams together. Let's make it memorable.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-8 py-8">
                        <div className="space-y-3">
                            <Label className="font-black text-slate-900 text-sm ml-1">Event Name</Label>
                            <Input
                                placeholder="What's the occasion?"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Category</Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, category: val })} defaultValue={formData.category}>
                                    <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none font-bold px-6">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                        <SelectItem value="Social">Social / Fun</SelectItem>
                                        <SelectItem value="Training">Training / Workshop</SelectItem>
                                        <SelectItem value="Professional">Business Meeting</SelectItem>
                                        <SelectItem value="Holiday">Company Holiday</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Location</Label>
                                <Input
                                    placeholder="Zoom / Office / Venue"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Date</Label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="font-black text-slate-900 text-sm ml-1">Time Range</Label>
                                <Input
                                    placeholder="e.g. 10 AM - 1 PM"
                                    value={formData.time}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 font-bold px-6"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-8 gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={handleSave}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-50 font-black border-none flex-1"
                        >
                            Schedule Event
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
                            className="rounded-[1.25rem] h-14 px-10 font-bold text-slate-400 border-none flex-1 hover:bg-slate-50"
                        >
                            Discard
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EventsPage;
