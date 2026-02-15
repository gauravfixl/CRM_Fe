"use client";

import { useState } from "react";
import { ListFilter, Search, Plus, Filter, MoreVertical, Trash2, UserPlus, CheckCircle2, AlertTriangle, Layers, ArrowRight, ShieldCheck } from "lucide-react";
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

export default function LeadBulkActionsPage() {
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    const actions = [
        { id: "owner", title: "Change Owner", icon: UserPlus, description: "Reassign selected leads to another salesperson or team.", color: "text-blue-600", bg: "bg-blue-50" },
        { id: "stage", title: "Bulk Update Stage", icon: Layers, description: "Advance or move multiple leads to a different stage in the funnel.", color: "text-purple-600", bg: "bg-purple-50" },
        { id: "delete", title: "Bulk Delete", icon: Trash2, description: "Permanently remove selected leads from your organization database.", color: "text-red-600", bg: "bg-red-50" },
        { id: "verify", title: "Email Verification", icon: CheckCircle2, description: "Batch verify delivery status for lead contact information.", color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    const handleApplyAction = (e: React.FormEvent) => {
        e.preventDefault();
        const action = actions.find(a => a.id === selectedAction);
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: `Executing ${action?.title}...`,
                success: `${action?.title} processed for identified segments!`,
                error: 'Failed to execute bulk operation.'
            }
        );
        setIsConfigOpen(false);
    };

    return (
        <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-zinc-950">
            {/* Header - Sticky with negative margins to offset AppLayout's p-4 */}
            <div className="sticky top-[-1.01rem] -mt-4 -mx-4 bg-white dark:bg-zinc-900 border-b px-12 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-30">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-900 text-white rounded-xl"><ListFilter className="h-5 w-5" /></div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Bulk Operations Hub</h1>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1 font-medium">Perform enterprise-scale modifications to your lead records</p>
                </div>
            </div>

            <div className="py-12 px-8 max-w-5xl mx-auto w-full space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {actions.map((action, idx) => (
                        <motion.div
                            key={action.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => { setSelectedAction(action.id); setIsConfigOpen(true); }}
                            className={`p-8 rounded-[32px] border cursor-pointer transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1
              ${selectedAction === action.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-2xl' : 'bg-white border-zinc-100 text-zinc-900 hover:border-zinc-300'}
           `}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${selectedAction === action.id ? 'bg-white/10' : action.bg}`}>
                                <action.icon className={`h-6 w-6 ${selectedAction === action.id ? 'text-white' : action.color}`} />
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-black uppercase tracking-tighter">{action.title}</h3>
                                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </div>
                            <p className={`text-sm font-normal leading-relaxed ${selectedAction === action.id ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                {action.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                    <DialogContent className="sm:max-w-[500px] rounded-[48px] p-0 overflow-hidden border-none shadow-2xl">
                        <DialogHeader className="p-10 bg-zinc-900 text-white relative">
                            <div className="absolute top-0 right-0 p-10 opacity-10"><ShieldCheck size={120} /></div>
                            <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 relative z-10">
                                {actions.find(a => a.id === selectedAction)?.title}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleApplyAction} className="p-10 space-y-6 bg-white">
                            <div className="space-y-4">
                                <div className="space-y-1.5 flex flex-col">
                                    <label className="text-xs font-black uppercase text-zinc-400 tracking-widest">Select Target Segment</label>
                                    <Select defaultValue="all">
                                        <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50 font-bold">
                                            <SelectValue placeholder="Choose segment" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Every Lead Entry</SelectItem>
                                            <SelectItem value="unassigned">Unassigned Only</SelectItem>
                                            <SelectItem value="converted">Previously Converted</SelectItem>
                                            <SelectItem value="filtered">Current Search Filter</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {selectedAction === 'owner' && (
                                    <CustomInput label="New Owner Account" placeholder="Type name or email..." required />
                                )}

                                {selectedAction === 'stage' && (
                                    <div className="space-y-1.5 flex flex-col">
                                        <label className="text-xs font-black uppercase text-zinc-400 tracking-widest">New Funnel Stage</label>
                                        <Select defaultValue="qualified">
                                            <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50 font-bold">
                                                <SelectValue placeholder="Choose stage" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">Discovery / New</SelectItem>
                                                <SelectItem value="qualified">Qualified Opportunity</SelectItem>
                                                <SelectItem value="negotiation">Price Negotiation</SelectItem>
                                                <SelectItem value="onhold">On Hold</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {selectedAction === 'delete' && (
                                    <div className="p-6 bg-red-50 border border-red-100 rounded-3xl space-y-2">
                                        <p className="text-xs font-black text-red-600 uppercase tracking-widest">Crucial Warning</p>
                                        <p className="text-xs text-red-500 font-medium leading-relaxed">
                                            This will permanently delete records across the entire organizational database. This action cannot be undone.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <DialogFooter className="pt-6">
                                <CustomButton type="button" variant="ghost" onClick={() => setIsConfigOpen(false)}>Cancel Operation</CustomButton>
                                <CustomButton type="submit" className={`px-10 rounded-2xl h-12 font-black uppercase tracking-tight
                   ${selectedAction === 'delete' ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200' : 'bg-zinc-900 hover:bg-zinc-800 text-white'}
                `}>
                                    Confirm & Execute
                                </CustomButton>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <div className="bg-amber-50 border border-amber-100 p-8 rounded-[32px] flex gap-6 items-start">
                    <div className="p-3 bg-white rounded-2xl text-amber-600 shadow-sm"><AlertTriangle className="h-6 w-6" /></div>
                    <div className="space-y-4">
                        <h4 className="text-lg font-black text-amber-900 tracking-tight">Safety Protocol</h4>
                        <p className="text-sm text-amber-800/70 font-medium leading-relaxed max-w-2xl">
                            Bulk actions are audited and can impact thousands of records simultaneously. Please ensure you have identified the correct segment using advanced filters before committing changes.
                        </p>
                        <CustomButton variant="outline" className="border-amber-200 text-amber-700 bg-transparent hover:bg-amber-100 h-10 px-6 font-bold uppercase tracking-widest text-[10px]" onClick={() => toast.info("Audit logs are being generated...")}>
                            View Audit Log
                        </CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
