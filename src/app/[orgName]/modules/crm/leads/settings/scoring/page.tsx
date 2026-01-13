"use client";

import { useState } from "react";
import { ChartBar, Search, Plus, Filter, MoreVertical, Star, Activity, Target, Zap, Settings, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

export default function LeadScoringPage() {
    const [isRuleOpen, setIsRuleOpen] = useState(false);
    const [scoringRules, setScoringRules] = useState([
        { id: "1", condition: "Email Opened", points: "+10", type: "engagement" },
        { id: "2", condition: "Form Submitted", points: "+50", type: "intent" },
        { id: "3", condition: "Invalid Email", points: "-100", type: "reputation" },
    ]);

    const handleAddRule = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Scoring rule updated and live!");
        setIsRuleOpen(false);
    };

    return (
        <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-zinc-950">
            {/* Header - Sticky with negative margins to offset AppLayout's p-4 */}
            <div className="sticky top-[-1.01rem] -mt-4 -mx-4 bg-white dark:bg-zinc-900 border-b px-12 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm z-30">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Zap className="h-5 w-5" /></div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Smart Scoring Engine</h1>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1 font-medium">Configure automated lead prioritizing based on behavioral data</p>
                </div>
                <div className="flex items-center gap-3">
                    <CustomButton onClick={() => toast.success("Configuration published to production!")} className="bg-zinc-900 text-white shadow-xl"><Star className="h-4 w-4 mr-2" /> Publish Rules</CustomButton>
                </div>
            </div>

            <div className="py-12 px-8 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Rules List */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest bg-zinc-50 px-4 py-1.5 rounded-full border border-zinc-100">Live Scoring Rules</h3>

                            <Dialog open={isRuleOpen} onOpenChange={setIsRuleOpen}>
                                <DialogTrigger asChild>
                                    <CustomButton variant="outline" size="sm" className="h-9 font-bold px-4 border-dashed border-zinc-300 hover:border-blue-500 hover:text-blue-600 transition-all"><Plus size={14} className="mr-2" /> Add Rule</CustomButton>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
                                    <DialogHeader className="p-10 bg-zinc-900 text-white">
                                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                            <Settings size={24} className="text-blue-400" /> Configure Rule
                                        </DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAddRule} className="p-10 space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5 flex flex-col">
                                                <label className="text-sm font-medium">Trigger Event</label>
                                                <Select defaultValue="email_opened">
                                                    <SelectTrigger className="h-11 rounded-xl border-zinc-200">
                                                        <SelectValue placeholder="Choose event" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="email_opened">Email Opened</SelectItem>
                                                        <SelectItem value="link_clicked">Link Clicked</SelectItem>
                                                        <SelectItem value="website_visit">Website Visit</SelectItem>
                                                        <SelectItem value="form_submit">Form Submission</SelectItem>
                                                        <SelectItem value="no_reply">No Reply (3 days)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <CustomInput label="Score Impact" type="number" placeholder="50" required />
                                                <div className="space-y-1.5 flex flex-col">
                                                    <label className="text-sm font-medium">Action</label>
                                                    <Select defaultValue="add">
                                                        <SelectTrigger className="h-11 rounded-xl border-zinc-200">
                                                            <SelectValue placeholder="Add/Subtract" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="add">Add Points</SelectItem>
                                                            <SelectItem value="subtract">Subtract Points</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter className="pt-6">
                                            <CustomButton type="button" variant="ghost" onClick={() => setIsRuleOpen(false)}>Discard</CustomButton>
                                            <CustomButton type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 rounded-xl">Save & Deploy</CustomButton>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-4">
                            {scoringRules.map((rule, idx) => (
                                <div key={rule.id} className="p-5 rounded-2xl border border-zinc-50 bg-zinc-50/50 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rule.points.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {rule.points.startsWith('+') ? <Plus size={18} /> : <Target size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-800">{rule.condition}</p>
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{rule.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className={`text-sm font-black p-2 rounded-lg ${rule.points.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {rule.points}
                                        </span>
                                        <CustomButton variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 rounded-full hover:bg-zinc-100"><MoreVertical size={14} /></CustomButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-10"><Activity size={180} /></div>
                        <h4 className="text-2xl font-black mb-4 tracking-tighter uppercase italic">Predictive AI Insights</h4>
                        <p className="text-indigo-100/70 text-sm leading-relaxed max-w-sm mb-8 font-medium">
                            Your current scoring model identifies "Won" leads with 82% accuracy. Leads with a score above 150 have a 3x higher conversion rate.
                        </p>
                        <CustomButton onClick={() => toast.info("Opening AI Analytics Dashboard...")} className="bg-white text-indigo-900 hover:bg-indigo-50 font-black px-10 h-12 uppercase tracking-tight rounded-xl">View Analysis</CustomButton>
                    </div>
                </div>

                {/* Right: Info Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border p-8 rounded-[40px] border-zinc-100 shadow-sm">
                        <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50 pb-6 mb-8 text-center">Engine Performance</h4>
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-zinc-500">Live Signals</span>
                                <Badge className="bg-blue-50 text-blue-600 border-none px-3 font-bold">24 Active</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-zinc-500">System Latency</span>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 font-bold">8.2ms</Badge>
                            </div>
                            <Separator className="bg-zinc-50" />
                            <div className="p-6 bg-zinc-50 rounded-3xl space-y-3">
                                <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-blue-600" />
                                    <span className="text-[10px] font-black uppercase text-zinc-800">Threshold Alert</span>
                                </div>
                                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
                                    Leads are automatically disqualified once their composite score drops below -500. This action is irreversible.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
