"use client";

import { useState } from "react";
import { Calendar, Search, Plus, Filter, MoreVertical, MapPin, Video, Users, Clock, CalendarCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function LeadMeetingsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    const mockMeetings = [
        { id: "1", title: "Technical Architecture Demo", lead: "Zylker Inc", type: "virtual", date: "Oct 15, 2023", time: "02:00 PM", status: "scheduled" },
        { id: "2", title: "Budget Negotiation", lead: "Acme Corp", type: "onsite", date: "Today", time: "11:30 AM", status: "completed" },
        { id: "3", title: "Discovery Workshop", lead: "Global Tech", type: "virtual", date: "Oct 18, 2023", time: "10:00 AM", status: "scheduled" },
    ];

    const handleSchedule = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Discovery meeting scheduled successfully!");
        setIsScheduleOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950">
            <div className="bg-white dark:bg-zinc-900 border-b px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative z-10">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Calendar className="h-5 w-5" /></div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Meetings & Sessions</h1>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">Schedule and manage discovery sessions with potential leads</p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                        <DialogTrigger asChild>
                            <CustomButton className="bg-zinc-900 text-white"><Plus className="h-4 w-4 mr-2" /> Schedule Meeting</CustomButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
                            <DialogHeader className="p-10 bg-blue-600 text-white">
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                    <CalendarCheck size={28} /> Schedule Session
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSchedule} className="p-10 space-y-6 bg-white">
                                <div className="space-y-4">
                                    <CustomInput label="Meeting Title" placeholder="e.g. Discovery Call, Price Negotiation..." required />
                                    <CustomInput label="Target Lead" placeholder="Search for a lead..." required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <CustomInput label="Date" type="date" required />
                                        <CustomInput label="Time" type="time" required />
                                    </div>
                                    <div className="space-y-1.5 flex flex-col">
                                        <label className="text-sm font-medium">Meeting Type</label>
                                        <Select defaultValue="virtual">
                                            <SelectTrigger className="h-11 rounded-xl border-zinc-200">
                                                <SelectValue placeholder="Location type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="virtual">Virtual (Zoom/Teams)</SelectItem>
                                                <SelectItem value="onsite">On-Site Visit</SelectItem>
                                                <SelectItem value="phone">Phone Appointment</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter className="pt-6">
                                    <CustomButton type="button" variant="ghost" onClick={() => setIsScheduleOpen(false)}>Cancel</CustomButton>
                                    <CustomButton type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-xl">Book Session</CustomButton>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-12 max-w-5xl mx-auto w-full space-y-6">
                    <div className="flex gap-4 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <CustomInput
                                placeholder="Search meeting titles, leads or platforms..."
                                className="pl-10 h-11 bg-white border-zinc-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <CustomButton variant="outline" className="h-11"><Filter className="h-4 w-4 mr-2" /> Filters</CustomButton>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockMeetings.map((meeting, idx) => (
                            <motion.div
                                key={meeting.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-6 rounded-[32px] border border-zinc-200 shadow-sm hover:shadow-xl transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl ${meeting.status === 'completed' ? 'bg-zinc-100 text-zinc-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-200'}`}>
                                        {meeting.type === 'virtual' ? <Video size={18} /> : <MapPin size={18} />}
                                    </div>
                                    <Badge className={`${meeting.status === 'completed' ? 'bg-zinc-50 text-zinc-400' : 'bg-blue-50 text-blue-600'} border-none text-[9px] font-black uppercase tracking-widest`}>
                                        {meeting.status}
                                    </Badge>
                                </div>

                                <h3 className="text-sm font-black text-zinc-900 mb-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{meeting.title}</h3>
                                <p className="text-xs text-zinc-500 mb-6 font-medium">{meeting.lead}</p>

                                <div className="space-y-3 border-t pt-6 border-zinc-50">
                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
                                        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                                        <span>{meeting.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
                                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                                        <span>{meeting.time}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
