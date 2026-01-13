"use client";

import { useState } from "react";
import { Workflow, Search, Plus, Filter, MoreVertical, Zap, Terminal, Settings2, PlayCircle, Eye, Rocket, Layout, Box } from "lucide-react";
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

export default function LeadWorkflowsPage() {
    const [isDesignOpen, setIsDesignOpen] = useState(false);
    const [workflows] = useState([
        { id: "1", name: "Welcome Sequence", trigger: "Lead Created", status: "active", executions: 1240 },
        { id: "2", name: "High Value Alert", trigger: "Deal Value > $10,000", status: "active", executions: 85 },
        { id: "3", name: "Abandoned Cart Recovery", trigger: "Inactive > 3 Days", status: "paused", executions: 0 },
    ]);

    const handleDesign = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("New automation blueprint successfully deployed!");
        setIsDesignOpen(false);
    };

    return (
        <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-zinc-950">
            {/* Header - Sticky with negative margins to offset AppLayout's p-4 */}
            <div className="sticky top-[-1.01rem] -mt-4 -mx-4 bg-white dark:bg-zinc-900 border-b px-12 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-30">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-900 text-white rounded-xl"><Settings2 className="h-5 w-5" /></div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Automation Workflows</h1>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1 font-medium">Design and deploy automated responses for lead life-cycle events</p>
                </div>
                <div className="flex items-center gap-3">
                    <Dialog open={isDesignOpen} onOpenChange={setIsDesignOpen}>
                        <DialogTrigger asChild>
                            <CustomButton className="bg-zinc-900 text-white"><Plus className="h-4 w-4 mr-2" /> Design Workflow</CustomButton>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[650px] rounded-[48px] p-0 overflow-hidden border-none shadow-2xl">
                            <DialogHeader className="p-12 bg-zinc-950 text-white relative">
                                <div className="absolute top-0 right-0 p-12 opacity-10"><Terminal size={150} /></div>
                                <DialogTitle className="text-3xl font-black uppercase tracking-tighter flex items-center gap-4 relative z-10 italic">
                                    <Box size={32} className="text-blue-500" /> Workflow Blueprint
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleDesign} className="p-12 space-y-8 bg-white">
                                <div className="space-y-6">
                                    <CustomInput label="Blueprint Name" placeholder="e.g. Q4 Re-engagement Flow" required />
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1.5 flex flex-col">
                                            <label className="text-sm font-black uppercase text-zinc-400 tracking-widest">Entry Trigger</label>
                                            <Select defaultValue="lead_created">
                                                <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50 font-bold">
                                                    <SelectValue placeholder="When to start?" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="lead_created">New Lead Created</SelectItem>
                                                    <SelectItem value="stage_changed">Stage Updated</SelectItem>
                                                    <SelectItem value="score_met">Lead Score Reached</SelectItem>
                                                    <SelectItem value="inactivity">Inactivity Period</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5 flex flex-col">
                                            <label className="text-sm font-black uppercase text-zinc-400 tracking-widest">Immediate Action</label>
                                            <Select defaultValue="send_email">
                                                <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50 font-bold">
                                                    <SelectValue placeholder="What to do?" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="send_email">Send Internal Alert</SelectItem>
                                                    <SelectItem value="assign_team">Reassign to Team</SelectItem>
                                                    <SelectItem value="web_hook">Trigger Webhook</SelectItem>
                                                    <SelectItem value="update_score">Update Score (+50)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="pt-8 flex justify-between items-center sm:justify-between w-full">
                                    <p className="text-[10px] font-bold text-zinc-400 max-w-[200px]">Changes will be versioned and applied to incoming leads immediately.</p>
                                    <div className="flex gap-4">
                                        <CustomButton type="button" variant="ghost" onClick={() => setIsDesignOpen(false)}>Back to Lab</CustomButton>
                                        <CustomButton type="submit" className="bg-zinc-950 text-white px-12 rounded-2xl h-12 font-black uppercase tracking-tight shadow-xl shadow-zinc-200 transition-all hover:scale-105 active:scale-95">
                                            <Rocket className="h-4 w-4 mr-2" /> Launch Flow
                                        </CustomButton>
                                    </div>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="py-12 px-8 max-w-6xl mx-auto w-full space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {workflows.map((flow, idx) => (
                        <motion.div
                            key={flow.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-[320px] justify-between relative"
                        >
                            <div className="flex justify-between items-start">
                                <div className={`p-4 rounded-3xl ${flow.status === 'active' ? 'bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-100' : 'bg-zinc-50 text-zinc-400'}`}>
                                    <Zap size={24} />
                                </div>
                                <Badge className={flow.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-none px-3 uppercase text-[9px] font-black' : 'bg-zinc-50 text-zinc-400 border-none px-3 uppercase text-[9px] font-black'}>
                                    {flow.status}
                                </Badge>
                            </div>

                            <div>
                                <h3 className="text-xl font-black text-zinc-900 mb-2 truncate uppercase tracking-tighter">{flow.name}</h3>
                                <div className="flex items-center gap-2 mb-6">
                                    <Terminal className="h-3.5 w-3.5 text-zinc-400" />
                                    <span className="text-xs font-bold text-zinc-500">{flow.trigger}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-6 border-zinc-50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-zinc-300 uppercase">Executions</p>
                                    <p className="text-sm font-black text-zinc-900">{flow.executions.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-end items-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CustomButton onClick={() => toast.info(`Viewing analytics for ${flow.name}`)} variant="default" size="sm" className="h-9 w-9 p-0 rounded-2xl transition-all"><Eye size={16} /></CustomButton>
                                    <CustomButton onClick={() => toast.success(`${flow.name} restarted successfully`)} variant="default" size="sm" className="h-9 w-9 p-0 rounded-2xl transition-all"><PlayCircle size={16} /></CustomButton>
                                    <CustomButton variant="outline" size="sm" className="h-9 w-9 p-0 rounded-2xl border-zinc-100"><MoreVertical size={16} /></CustomButton>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setIsDesignOpen(true)}
                        className="border-4 border-dashed border-zinc-100 rounded-[40px] p-8 flex flex-col items-center justify-center space-y-4 text-zinc-300 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/20 transition-all cursor-pointer h-[320px]"
                    >
                        <div className="w-16 h-16 rounded-full border-4 border-dashed border-current flex items-center justify-center transition-transform hover:scale-110">
                            <Plus size={32} />
                        </div>
                        <p className="font-black uppercase tracking-widest text-sm">Create Blueprint</p>
                    </motion.div>
                </div>

                <div className="bg-zinc-900 p-10 rounded-[44px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 p-8 opacity-5"><Workflow size={200} /></div>
                    <div className="space-y-4 relative z-10 text-center md:text-left">
                        <h4 className="text-3xl font-black tracking-tighter uppercase italic">Need a custom bot?</h4>
                        <p className="text-zinc-400 text-sm font-medium max-w-md">
                            Connect lead life-cycle events to external webhooks or direct code execution using our serverless automation engine.
                        </p>
                    </div>
                    <CustomButton onClick={() => toast.promise(new Promise(r => setTimeout(r, 1000)), { loading: 'Loading Integrations Store...', success: 'Store Loaded!', error: 'Failed' })} variant="default" className="font-bold px-12 h-14 rounded-2xl shadow-xl relative z-10 uppercase tracking-tighter">
                        Explore Integrations
                    </CustomButton>
                </div>
            </div>
        </div>
    );
}
