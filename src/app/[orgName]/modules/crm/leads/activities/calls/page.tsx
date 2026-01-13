"use client";

import { useState } from "react";
import { Phone, Search, Plus, Filter, MoreVertical, PhoneIncoming, PhoneOutgoing, Clock, CheckCircle2 } from "lucide-react";
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

export default function LeadCallsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLogOpen, setIsLogOpen] = useState(false);

    const mockCalls = [
        { id: "1", type: "outgoing", lead: "Acme Corp", duration: "12m 45s", date: "Today, 10:30 AM", outcome: "Interested" },
        { id: "2", type: "incoming", lead: "Zylker Inc", duration: "05m 20s", date: "Yesterday, 04:15 PM", outcome: "Voicemail" },
        { id: "3", type: "outgoing", lead: "Global Tech", duration: "08m 10s", date: "Oct 10, 2023", outcome: "Busy" },
    ];

    const handleLogCall = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Call log recorded successfully!");
        setIsLogOpen(false);
    };

    return (
        <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-zinc-950">
            {/* Header - Sticky with negative margins to offset AppLayout's p-4 */}
            <div className="sticky top-[-1.01rem] -mt-4 -mx-4 bg-white dark:bg-zinc-900 border-b px-8 py-6 shadow-sm z-30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Phone className="h-5 w-5" /></div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Call Logs</h1>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1 font-medium">Review call history and record outcomes for lead interactions</p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={isLogOpen} onOpenChange={setIsLogOpen}>
                        <DialogTrigger asChild>
                            <CustomButton className="bg-zinc-900 text-white"><Plus className="h-4 w-4 mr-2" /> Log New Call</CustomButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
                            <DialogHeader className="p-8 bg-emerald-600 text-white">
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                    <PhoneOutgoing size={24} /> Log Interaction
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleLogCall} className="p-8 space-y-6 bg-white">
                                <div className="space-y-4">
                                    <CustomInput label="Lead Name" placeholder="Search for a lead..." required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium">Call Type</label>
                                            <Select defaultValue="outgoing">
                                                <SelectTrigger className="rounded-lg h-10 border-zinc-200">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="outgoing">Outgoing</SelectItem>
                                                    <SelectItem value="incoming">Incoming</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium">Outcome</label>
                                            <Select defaultValue="interested">
                                                <SelectTrigger className="rounded-lg h-10 border-zinc-200">
                                                    <SelectValue placeholder="Select outcome" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="interested">Interested</SelectItem>
                                                    <SelectItem value="voicemail">Voicemail</SelectItem>
                                                    <SelectItem value="busy">Busy / No Answer</SelectItem>
                                                    <SelectItem value="not_now">Follow up later</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <CustomInput label="Duration" placeholder="e.g. 15m 30s" />
                                </div>
                                <DialogFooter className="pt-4">
                                    <CustomButton type="button" variant="ghost" onClick={() => setIsLogOpen(false)}>Cancel</CustomButton>
                                    <CustomButton type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">Save Log</CustomButton>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="py-12 px-8 max-w-5xl mx-auto w-full space-y-6">
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <CustomInput
                            placeholder="Search leads, outcomes or dates..."
                            className="pl-10 h-11 bg-white border-zinc-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <CustomButton variant="outline" className="h-11"><Filter className="h-4 w-4 mr-2" /> Filters</CustomButton>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="divide-y divide-zinc-100">
                        {mockCalls.map((call, idx) => (
                            <motion.div
                                key={call.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 hover:bg-zinc-50 transition-all group flex gap-6 cursor-pointer items-center"
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                      ${call.type === 'incoming' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}
                   `}>
                                    {call.type === 'incoming' ? <PhoneIncoming className="h-5 w-5" /> : <PhoneOutgoing className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-sm font-bold text-zinc-900 truncate uppercase tracking-tight">{call.lead}</h3>
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{call.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs font-medium text-zinc-500 flex items-center gap-1"><Clock className="h-3 w-3" /> {call.duration}</span>
                                        <span className="text-zinc-300">•</span>
                                        <Badge className={`border-none text-[9px] uppercase font-bold
                            ${call.outcome === 'Interested' ? 'bg-emerald-50 text-emerald-600' :
                                                call.outcome === 'Voicemail' ? 'bg-zinc-50 text-zinc-500' : 'bg-red-50 text-red-600'}
                         `}>{call.outcome}</Badge>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CustomButton variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full"><MoreVertical className="h-4 w-4" /></CustomButton>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
