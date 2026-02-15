"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    CalendarClock,
    MessageSquare,
    PhoneCall,
    Mail,
    StickyNote,
    MoreVertical,
    Plus,
    RefreshCcw,
    Search,
    Filter,
    History,
    TrendingUp,
    Target
} from "lucide-react";
import { motion } from "framer-motion";

import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useLoaderStore } from "@/lib/loaderStore";
import { getLeadListByOrg } from "@/hooks/leadHooks";
import { toast } from "sonner";

// --- Types ---
interface Activity {
    id: string;
    type: "call" | "email" | "meeting" | "note" | "stage_change";
    title: string;
    description: string;
    timestamp: string;
    leadName: string;
    user: string;
}

export default function LeadActivitiesPage() {
    const params = useParams();
    const { showLoader, hideLoader } = useLoaderStore();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Simulated Activities for Professional UI demonstration (Integration would come from interactions API)
    const simulatedActivities: Activity[] = [
        { id: "1", type: "stage_change", title: "Stage Updated to 'Qualified'", description: "Lead score increased after initial discovery call.", timestamp: "2024-01-12T10:30:00Z", leadName: "Acme Corp", user: "Admin" },
        { id: "2", type: "call", title: "Outbound Discovery Call", description: "Discussed budget and implementation timeline. Prospect is interested in Q1 rollout.", timestamp: "2024-01-12T09:15:00Z", leadName: "Zylker Inc", user: "Admin" },
        { id: "3", type: "email", title: "Proposal Sent", description: "Sent detailed quotation for Enterprise Plan (50 users).", timestamp: "2024-01-11T16:45:00Z", leadName: "Global Tech", user: "Admin" },
        { id: "4", type: "note", title: "Internal Strategy Note", description: "Follow up via phone if email is not opened by Friday.", timestamp: "2024-01-11T14:20:00Z", leadName: "Skyline Ventures", user: "Admin" },
        { id: "5", type: "meeting", title: "Technical Demo", description: "Showcased API integrations and custom reporting dashboard.", timestamp: "2024-01-10T11:00:00Z", leadName: "Acme Corp", user: "Admin" },
    ];

    useEffect(() => {
        // In a real scenario, we'd fetch from getInteractions and getLeadStageHistory
        setActivities(simulatedActivities);
    }, []);

    const getActivityIcon = (type: Activity["type"]) => {
        switch (type) {
            case "call": return <PhoneCall className="h-4 w-4" />;
            case "email": return <Mail className="h-4 w-4" />;
            case "meeting": return <CalendarClock className="h-4 w-4" />;
            case "note": return <StickyNote className="h-4 w-4" />;
            case "stage_change": return <TrendingUp className="h-4 w-4" />;
            default: return <History className="h-4 w-4" />;
        }
    };

    const getActivityColor = (type: Activity["type"]) => {
        switch (type) {
            case "call": return "bg-blue-600 shadow-blue-200";
            case "email": return "bg-purple-600 shadow-purple-200";
            case "meeting": return "bg-orange-600 shadow-orange-200";
            case "note": return "bg-amber-500 shadow-amber-200";
            case "stage_change": return "bg-emerald-600 shadow-emerald-200";
            default: return "bg-zinc-600 shadow-zinc-200";
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950 overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b px-8 py-6 shadow-sm relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-100/50 text-orange-600">
                                <History className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Activities Timeline</h1>
                                <p className="text-sm text-zinc-500 font-normal">A chronological stream of all lead interactions and updates</p>
                            </div>
                        </div>
                    </motion.div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <CustomInput
                                placeholder="Search interactions..."
                                className="pl-9 h-10 font-normal text-xs border-zinc-200 bg-zinc-50/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <CustomButton variant="outline" className="h-10">
                            <Filter className="mr-2 h-4 w-4" /> Filters
                        </CustomButton>
                        <CustomButton className="h-10 bg-zinc-900 text-white">
                            <Plus className="mr-2 h-4 w-4" /> Log Interaction
                        </CustomButton>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10">
                <div className="max-w-4xl mx-auto relative">

                    {/* Central Vertical Line */}
                    <div className="absolute left-[31px] top-0 bottom-0 w-[2px] bg-zinc-200 dark:bg-zinc-800 rounded-full" />

                    <div className="space-y-12">
                        {activities.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())).map((activity, idx) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative flex items-start gap-8 group"
                            >
                                {/* Timeline Node */}
                                <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110 ${getActivityColor(activity.type)}`}>
                                    {getActivityIcon(activity.type)}
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 relative">

                                    {/* Arrow indicator */}
                                    <div className="absolute -left-2 top-6 w-4 h-4 bg-white dark:bg-zinc-900 border-l border-t border-zinc-200/60 transition-colors rotate-[-45deg]" />

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{activity.type.replace("_", " ")}</span>
                                                <div className="w-1 h-1 rounded-full bg-zinc-300" />
                                                <span className="text-xs text-zinc-400">{new Date(activity.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{activity.title}</h3>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <CustomButton variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-zinc-100">
                                                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                </CustomButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="text-xs">Edit Log</DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs text-red-600">Delete Permanently</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed mb-5">
                                        {activity.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200">
                                                <Target className="h-3 w-3 text-zinc-500" />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-800">{activity.leadName}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-zinc-400 font-medium">Recorded by</span>
                                            <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 bg-zinc-50">{activity.user}</Badge>
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
