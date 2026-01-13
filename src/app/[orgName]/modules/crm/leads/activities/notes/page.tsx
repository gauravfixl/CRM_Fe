"use client";

import { useState } from "react";
import { StickyNote, Search, Plus, Filter, MoreVertical, Hash, Bookmark, Save } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function LeadNotesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isNoteOpen, setIsNoteOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<any>(null);

    const mockNotes = [
        { id: "1", title: "Customer Pain Points", lead: "Zylker Inc", date: "Today, 02:30 PM", content: "Client is primarily concerned about the data migration process and downtime during implementation...", category: "Product" },
        { id: "2", title: "Relationship Mapping", lead: "Acme Corp", date: "Yesterday, 11:00 AM", content: "John is the primary decision maker but CTO needs to sign off on security protocols...", category: "Strategy" },
        { id: "3", title: "Pricing Feedback", lead: "Global Tech", date: "Oct 10, 2023", content: "They found the Enterprise pricing slightly higher than competitors. Consider 10% discount...", category: "Sales" },
    ];

    const handleSaveNote = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(editingNote ? "Note updated successfully!" : "Quick note saved!");
        setIsNoteOpen(false);
        setEditingNote(null);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950">
            <div className="bg-white dark:bg-zinc-900 border-b px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative z-10">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><StickyNote className="h-5 w-5" /></div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Internal Notes</h1>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">Capture insights and private internal documentation for your leads</p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={isNoteOpen} onOpenChange={(open) => { setIsNoteOpen(open); if (!open) setEditingNote(null); }}>
                        <DialogTrigger asChild>
                            <CustomButton className="bg-zinc-900 text-white"><Plus className="h-4 w-4 mr-2" /> Quick Note</CustomButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
                            <DialogHeader className="p-10 bg-amber-500 text-white">
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                    <StickyNote size={28} /> {editingNote ? 'Edit Insight' : 'New Context'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSaveNote} className="p-10 space-y-6 bg-white">
                                <div className="space-y-4">
                                    <CustomInput label="Note Title" placeholder="e.g. Budget Constraints, Team Structure..." defaultValue={editingNote?.title} required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <CustomInput label="Associated Lead" placeholder="Search lead..." defaultValue={editingNote?.lead} required />
                                        <div className="space-y-1.5 flex flex-col">
                                            <label className="text-sm font-medium">Category</label>
                                            <Select defaultValue={editingNote?.category?.toLowerCase() || "strategy"}>
                                                <SelectTrigger className="h-11 rounded-xl border-zinc-200">
                                                    <SelectValue placeholder="Choose type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="product">Product Feedback</SelectItem>
                                                    <SelectItem value="strategy">Strategy</SelectItem>
                                                    <SelectItem value="sales">Sales Intelligence</SelectItem>
                                                    <SelectItem value="competitor">Competitor Intel</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <CustomTextarea label="Observation" placeholder="What did you learn about this lead?" className="min-h-[150px]" defaultValue={editingNote?.content} required />
                                </div>
                                <DialogFooter className="pt-6">
                                    <CustomButton type="button" variant="ghost" onClick={() => setIsNoteOpen(false)}>Discard</CustomButton>
                                    <CustomButton type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-10 rounded-xl">
                                        <Save className="h-4 w-4 mr-2" /> {editingNote ? 'Update Note' : 'Save Note'}
                                    </CustomButton>
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
                                placeholder="Search across notes and lead names..."
                                className="pl-10 h-11 bg-white border-zinc-200 shadow-none border-dashed"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <CustomButton variant="outline" className="h-11"><Bookmark className="h-4 w-4 mr-2" /> Bookmarks</CustomButton>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {mockNotes.map((note, idx) => (
                            <motion.div
                                key={note.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => { setEditingNote(note); setIsNoteOpen(true); }}
                                className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col relative overflow-hidden cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform"><StickyNote size={120} /></div>

                                <div className="flex justify-between items-start mb-6 z-10">
                                    <Badge className="bg-zinc-50 text-zinc-400 border-none text-[9px] font-black uppercase tracking-widest">{note.category}</Badge>
                                    <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">{note.date}</span>
                                </div>

                                <h3 className="text-xl font-black text-zinc-900 mb-2 truncate z-10 uppercase tracking-tight">{note.title}</h3>
                                <div className="flex items-center gap-1.5 mb-6 text-xs font-bold text-blue-600 z-10 uppercase tracking-tighter">
                                    <Hash size={12} /> {note.lead}
                                </div>

                                <p className="text-sm text-zinc-500 font-normal leading-relaxed line-clamp-4 z-10 italic">
                                    "{note.content}"
                                </p>

                                <div className="mt-8 pt-6 border-t border-zinc-50 flex justify-between items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-zinc-900 text-[8px] flex items-center justify-center text-white font-bold">A</div>
                                        <span className="text-[10px] font-bold text-zinc-400">Recorded by Admin</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CustomButton variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full"><MoreVertical className="h-4 w-4" /></CustomButton>
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
