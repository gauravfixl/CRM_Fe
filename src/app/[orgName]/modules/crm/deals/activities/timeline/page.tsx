"use client";

import { useState } from "react";
import {
    History,
    Search,
    Filter,
    Plus,
    PhoneCall,
    Mail,
    CalendarClock,
    StickyNote,
    TrendingUp,
    Target,
    MoreVertical,
    Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function DealTimelinePage() {
    const [searchTerm, setSearchTerm] = useState("");

    const interactions = [
        { id: 1, type: "stage_change", title: "Moved to Negotiation", detail: "Procurement started the final review of the contract clauses.", time: "1 hour ago", user: "Admin", deal: "Enterprise License" },
        { id: 2, type: "call", title: "Follow-up Negotiation Call", detail: "Discussed 15% discount for multi-year commitment.", time: "4 hours ago", user: "Sarah Jenkins", deal: "Core Banking Upgrade" },
        { id: 3, type: "email", title: "Proposal Sent", detail: "Email sent to Decision Makers with revised quotation.", time: "Yesterday", user: "Admin", deal: "Custom API Integration" },
        { id: 4, type: "meeting", title: "Technical Discovery", detail: "Final tech stack validation with Engineering team.", time: "2 days ago", user: "Admin", deal: "Enterprise License" },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case "call": return <PhoneCall className="h-4 w-4" />;
            case "email": return <Mail className="h-4 w-4" />;
            case "meeting": return <CalendarClock className="h-4 w-4" />;
            case "note": return <StickyNote className="h-4 w-4" />;
            case "stage_change": return <TrendingUp className="h-4 w-4" />;
            default: return <History className="h-4 w-4" />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case "call": return "bg-blue-600 shadow-blue-200";
            case "email": return "bg-purple-600 shadow-purple-200";
            case "meeting": return "bg-orange-600 shadow-orange-200";
            case "note": return "bg-amber-500 shadow-amber-200";
            case "stage_change": return "bg-emerald-600 shadow-emerald-200";
            default: return "bg-zinc-900";
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950 overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b px-10 py-8 shadow-sm relative z-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-[20px] bg-blue-50 text-blue-600 shadow-inner">
                            <History className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase tracking-tighter">Global Interaction Log</h1>
                            <p className="text-sm text-zinc-500 font-medium">Monitoring all opportunity movements and client engagements</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <CustomInput
                                placeholder="Search interactions..."
                                className="pl-9 h-12 bg-zinc-50/50 border-zinc-200 rounded-xl"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <CustomButton className="h-12 bg-zinc-900 text-white px-8 rounded-xl font-bold shadow-lg shadow-zinc-200">
                            <Plus className="mr-2 h-4 w-4" /> Log Event
                        </CustomButton>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 scrollbar-hide bg-slate-50/30">
                <div className="max-w-4xl mx-auto relative">

                    {/* Central Vertical Line */}
                    <div className="absolute left-[31px] top-0 bottom-0 w-[2.5px] bg-gradient-to-b from-blue-100 via-zinc-200 to-transparent rounded-full opacity-60" />

                    <div className="space-y-16">
                        {interactions.map((event, idx) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative flex items-start gap-10 group"
                            >
                                {/* Timeline Circle */}
                                <div className={`relative z-10 w-16 h-16 rounded-[22px] flex items-center justify-center text-white shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${getColor(event.type)}`}>
                                    {getIcon(event.type)}
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 bg-white dark:bg-zinc-900 p-8 rounded-[36px] border border-zinc-200/50 shadow-sm hover:shadow-2xl transition-all duration-500 relative ring-1 ring-black/5">
                                    <div className="absolute -left-2 top-7 w-4 h-4 bg-white dark:bg-zinc-900 border-l border-t border-zinc-200/50 rotate-[-45deg]" />

                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{event.type.replace("_", " ")}</span>
                                                <div className="w-1 h-1 rounded-full bg-zinc-300" />
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase">{event.time}</span>
                                            </div>
                                            <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase">{event.title}</h3>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <CustomButton variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-zinc-50">
                                                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                </CustomButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="py-2.5">Edit Log</DropdownMenuItem>
                                                <DropdownMenuItem className="py-2.5 text-red-600">Remove Entry</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <p className="text-[15px] text-zinc-500 font-medium leading-[1.6] mb-8 italic">
                                        {event.detail}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                                                <Briefcase className="h-4 w-4 text-zinc-400" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Opportunity</p>
                                                <p className="text-sm font-black text-zinc-800">{event.deal}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase mr-1">Owner</p>
                                            <Badge variant="outline" className="bg-zinc-50 border-zinc-200 rounded-lg px-3 py-1 text-[10px] font-black">{event.user}</Badge>
                                        </div>
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
