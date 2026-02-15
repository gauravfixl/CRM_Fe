"use client";

import { useState } from "react";
import { Mail, Search, Plus, Filter, MoreVertical, Send, User, ChevronRight, X } from "lucide-react";
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
import { CustomTextarea } from "@/components/custom/CustomTextArea";
import { toast } from "sonner";

export default function LeadEmailsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<any>(null);

    const mockEmails = [
        { id: "1", subject: "Proposal Follow-up", lead: "Acme Corp", status: "opened", date: "2 hours ago", snippet: "Hello, I wanted to check if you had a chance to review the proposal...", body: "Hi Team,\n\nI hope you're doing well. I'm following up on the proposal sent last Tuesday. Have you had a chance to look it over?\n\nBest regards,\nAdmin" },
        { id: "2", subject: "Technical Demo Invitation", lead: "Zylker Inc", status: "sent", date: "5 hours ago", snippet: "We are excited to invite you to a personalized demo of our platform...", body: "Hello,\n\nWe would like to invite you to a live demo of Fixl Solutions next week.\n\nPlease let us know your availability.\n\nCheers!" },
        { id: "3", subject: "Welcome to Our Platform", lead: "Global Tech", status: "replied", date: "1 day ago", snippet: "Thank you for joining our community! Here is a list of resources...", body: "Welcome aboard!\n\nWe're thrilled to have Global Tech with us. Here's your onboarding kit.\n\nRegards,\nThe Support Team" },
    ];

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Email sent successfully to lead!");
        setIsComposeOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950">
            <div className="bg-white dark:bg-zinc-900 border-b px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative z-10">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Mail className="h-5 w-5" /></div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Email Communications</h1>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">Manage and track all email interactions with your leads</p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                        <DialogTrigger asChild>
                            <CustomButton className="bg-zinc-900 text-white"><Plus className="h-4 w-4 mr-2" /> Compose Email</CustomButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] rounded-[32px] p-0 overflow-hidden border-none shadow-2xl">
                            <DialogHeader className="p-8 bg-zinc-900 text-white">
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                    <Send size={24} className="text-blue-400" /> New Message
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSendEmail} className="p-8 space-y-6 bg-white">
                                <div className="space-y-4">
                                    <CustomInput label="Recipient Email" placeholder="lead@company.com" required />
                                    <CustomInput label="Subject" placeholder="Enter subject line..." required />
                                    <CustomTextarea label="Message Body" placeholder="Write your message here..." className="min-h-[200px]" required />
                                </div>
                                <DialogFooter className="pt-4">
                                    <CustomButton type="button" variant="ghost" onClick={() => setIsComposeOpen(false)}>Cancel</CustomButton>
                                    <CustomButton type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8">Send Message</CustomButton>
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
                                placeholder="Search subjects, leads or content..."
                                className="pl-10 h-11 bg-white border-zinc-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <CustomButton variant="outline" className="h-11"><Filter className="h-4 w-4 mr-2" /> Filters</CustomButton>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
                        <div className="divide-y divide-zinc-100">
                            {mockEmails.map((email, idx) => (
                                <motion.div
                                    key={email.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => setSelectedEmail(email)}
                                    className="p-6 hover:bg-zinc-50 transition-all group flex gap-6 cursor-pointer items-center"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                                        <Send className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-sm font-bold text-zinc-900 truncate uppercase tracking-tight">{email.subject}</h3>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{email.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-medium text-zinc-500">{email.lead}</span>
                                            <span className="text-zinc-300">•</span>
                                            {email.status === "opened" && <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] uppercase font-bold">Opened</Badge>}
                                            {email.status === "sent" && <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[9px] uppercase font-bold">Sent</Badge>}
                                            {email.status === "replied" && <Badge className="bg-purple-50 text-purple-600 border-purple-100 text-[9px] uppercase font-bold">Replied</Badge>}
                                        </div>
                                        <p className="text-xs text-zinc-500 line-clamp-1 italic">"{email.snippet}"</p>
                                    </div>
                                    <div className="text-zinc-300 group-hover:text-zinc-900 transition-colors">
                                        <ChevronRight size={18} />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Detail View */}
            <AnimatePresence>
                {selectedEmail && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/20 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="bg-white h-full w-full max-w-2xl rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="p-8 border-b flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black uppercase tracking-tight">{selectedEmail.lead}</h2>
                                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{selectedEmail.date}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedEmail(null)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                    <X size={20} className="text-zinc-400" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-12 space-y-8">
                                <div>
                                    <h3 className="text-2xl font-black text-zinc-900 mb-6">{selectedEmail.subject}</h3>
                                    <div className="p-8 bg-zinc-50 rounded-[32px] text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap font-medium">
                                        {selectedEmail.body}
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <CustomButton className="flex-1 h-12 bg-zinc-900 text-white rounded-2xl">Reply Now</CustomButton>
                                    <CustomButton variant="outline" className="flex-1 h-12 rounded-2xl">Forward</CustomButton>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
