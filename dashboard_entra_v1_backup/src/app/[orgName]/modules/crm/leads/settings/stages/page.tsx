"use client";

import { useState } from "react";
import {
    Settings,
    Plus,
    GripVertical,
    Trash2,
    CheckCircle2,
    TrendingUp,
    LayoutDashboard
} from "lucide-react";
import { motion, Reorder } from "framer-motion";

import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function LeadSettingsStagesPage() {
    const [stages, setStages] = useState([
        { id: "1", name: "New", color: "bg-blue-500", active: true },
        { id: "2", name: "Qualified", color: "bg-emerald-500", active: true },
        { id: "3", name: "Proposal", color: "bg-amber-500", active: true },
        { id: "4", name: "Negotiation", color: "bg-purple-500", active: true },
        { id: "5", name: "Won", color: "bg-zinc-900", active: true },
        { id: "6", name: "Lost", color: "bg-red-500", active: true },
        { id: "7", name: "Hold", color: "bg-zinc-400", active: true },
    ]);

    const [newStage, setNewStage] = useState("");

    const handleAddStage = () => {
        if (!newStage.trim()) return;
        setStages([...stages, { id: Date.now().toString(), name: newStage, color: "bg-zinc-500", active: true }]);
        setNewStage("");
        toast.success("New stage added successfully");
    };

    return (
        <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-zinc-950">
            {/* Header - Sticky with negative margins to offset AppLayout's p-4 */}
            <div className="sticky top-[-1.01rem] -mt-4 -mx-4 bg-white dark:bg-zinc-900 border-b px-8 py-6 shadow-sm z-30">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-zinc-100 text-zinc-900">
                        <Settings className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Lead Pipeline Configuration</h1>
                        <p className="text-sm text-zinc-500 font-normal">Manage lead stages and workflow cycles</p>
                    </div>
                </div>
            </div>

            <div className="py-12 px-8 max-w-2xl mx-auto w-full space-y-10">
                <div className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200/50 shadow-xl">
                    <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" /> Pipeline Stages
                    </h3>

                    <Reorder.Group axis="y" values={stages} onReorder={setStages} className="space-y-3 mb-8">
                        {stages.map((stage) => (
                            <Reorder.Item
                                key={stage.id}
                                value={stage}
                                className="bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-2xl border border-zinc-100 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-blue-200 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <GripVertical className="h-4 w-4 text-zinc-300" />
                                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                                    <span className="text-sm font-bold text-zinc-800">{stage.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] font-bold bg-white px-2 py-0 border-zinc-100">Active</Badge>
                                    <CustomButton variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </CustomButton>
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>

                    <div className="flex gap-2">
                        <CustomInput
                            placeholder="New stage name..."
                            className="bg-zinc-50 font-normal"
                            value={newStage}
                            onChange={(e) => setNewStage(e.target.value)}
                        />
                        <CustomButton className="bg-zinc-900 text-white" onClick={handleAddStage}>
                            <Plus className="h-4 w-4 mr-2" /> Add Stage
                        </CustomButton>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><LayoutDashboard className="h-5 w-5" /></div>
                        <div>
                            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Visibility</p>
                            <p className="text-sm font-bold">Standard CRM Workflow</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 className="h-5 w-5" /></div>
                        <div>
                            <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Automation</p>
                            <p className="text-sm font-bold">Smart Conversion Active</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
