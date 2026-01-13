"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Plus,
    Search,
    RefreshCcw,
    MoreVertical,
    Mail,
    Briefcase,
    DollarSign,
    LayoutDashboard,
    ChevronRight,
    Filter
} from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
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
import { useLoaderStore } from "@/lib/loaderStore";
import { getLeadListByOrg, updateLeadStage } from "@/hooks/leadHooks";
import { toast } from "sonner";

// --- Types ---
interface Lead {
    _id: string;
    LeadId: string;
    name: string;
    email: string;
    company: string;
    stage: string;
    estimatedValue: number;
}

const STAGES = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost", "Hold"];

const STAGE_CONFIG: Record<string, { color: string, bg: string, border: string, dot: string }> = {
    New: { color: "text-blue-700", bg: "bg-blue-50/50", border: "border-blue-100", dot: "bg-blue-500" },
    Qualified: { color: "text-emerald-700", bg: "bg-emerald-50/50", border: "border-emerald-100", dot: "bg-emerald-500" },
    Proposal: { color: "text-amber-700", bg: "bg-amber-50/50", border: "border-amber-100", dot: "bg-amber-500" },
    Negotiation: { color: "text-purple-700", bg: "bg-purple-50/50", border: "border-purple-100", dot: "bg-purple-500" },
    Won: { color: "text-zinc-900", bg: "bg-zinc-100/50", border: "border-zinc-200", dot: "bg-zinc-900" },
    Lost: { color: "text-red-700", bg: "bg-red-50/50", border: "border-red-100", dot: "bg-red-500" },
    Hold: { color: "text-zinc-500", bg: "bg-zinc-50/50", border: "border-zinc-100", dot: "bg-zinc-400" },
};

export default function LeadKanbanPage() {
    const params = useParams();
    const router = useRouter();
    const orgName = params.orgName as string;

    const { showLoader, hideLoader } = useLoaderStore();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchLeads = async () => {
        showLoader();
        try {
            const res = await getLeadListByOrg();
            setLeads(res?.data?.data || []);
        } catch (error) {
            toast.error("Failed to load leads");
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    // Group leads by stage
    const groupedLeads = useMemo(() => {
        const groups: Record<string, Lead[]> = {};
        STAGES.forEach(stage => groups[stage] = []);

        leads.filter(l =>
            l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.company?.toLowerCase().includes(searchTerm.toLowerCase())
        ).forEach(lead => {
            if (groups[lead.stage]) {
                groups[lead.stage].push(lead);
            } else {
                // Fallback for unexpected stages
                if (!groups["New"]) groups["New"] = [];
                groups["New"].push(lead);
            }
        });
        return groups;
    }, [leads, searchTerm]);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const leadId = draggableId;
        const newStage = destination.droppableId;

        // Optimistic Update
        const originalLeads = [...leads];
        setLeads(prev => prev.map(l => l._id === leadId ? { ...l, stage: newStage } : l));

        try {
            await updateLeadStage(leadId, newStage);
            toast.success(`Moved to ${newStage}`);
        } catch (error) {
            setLeads(originalLeads);
            toast.error("Failed to update stage");
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950 overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b px-6 py-4 shadow-sm relative z-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <LayoutDashboard className="h-5 w-5 text-blue-600" />
                            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Lead Pipeline</h1>
                        </div>
                        <p className="text-sm text-zinc-500 font-normal">Visualize and manage your sales flow with drag & drop</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <CustomInput
                                placeholder="Search board..."
                                className="pl-9 h-9 font-normal text-xs border-zinc-200 bg-zinc-50/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <CustomButton variant="outline" size="sm" className="h-9" onClick={fetchLeads}>
                            <RefreshCcw className="h-3.5 w-3.5" />
                        </CustomButton>
                        <CustomButton
                            size="sm"
                            className="h-9 bg-zinc-900 hover:bg-zinc-800 text-white"
                            onClick={() => router.push(`/${orgName}/modules/crm/leads/add`)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> New Lead
                        </CustomButton>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto p-6 bg-slate-50/30">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 h-full min-w-max pb-4">
                        {STAGES.map((stage) => (
                            <div key={stage} className="w-80 flex flex-col h-full">
                                {/* Column Header */}
                                <div className={`flex items-center justify-between mb-4 p-3 rounded-xl border border-dashed ${STAGE_CONFIG[stage].border} ${STAGE_CONFIG[stage].bg}`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${STAGE_CONFIG[stage].dot}`} />
                                        <span className={`text-sm font-bold uppercase tracking-wider ${STAGE_CONFIG[stage].color}`}>{stage}</span>
                                        <Badge variant="secondary" className="bg-white/80 dark:bg-zinc-800 text-[10px] font-bold">
                                            {groupedLeads[stage].length}
                                        </Badge>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <CustomButton variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                <MoreVertical className="h-3.5 w-3.5 text-zinc-400" />
                                            </CustomButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem className="text-xs font-bold py-2">STAGE ACTIONS</DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs">Sort by Value</DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs">Sort by Date</DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs text-red-600">Archive All in Stage</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={stage}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 overflow-y-auto rounded-2xl transition-colors duration-200 p-2 min-h-[150px] ${snapshot.isDraggingOver ? "bg-zinc-100/50 dark:bg-zinc-800/20" : "bg-transparent"
                                                }`}
                                        >
                                            <AnimatePresence>
                                                {groupedLeads[stage].map((lead, index) => (
                                                    <Draggable key={lead._id} draggableId={lead._id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="mb-3"
                                                            >
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                                    whileHover={{ y: -2 }}
                                                                    className={`bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group ${snapshot.isDragging ? "shadow-xl border-blue-400 ring-2 ring-blue-400/20 rotate-1" : ""
                                                                        }`}
                                                                >
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                                                                            {lead.name}
                                                                        </h3>
                                                                        <span className="text-[10px] font-black text-zinc-400">#{lead.LeadId?.slice(-4) || "0000"}</span>
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-normal">
                                                                            <Briefcase className="h-3 w-3" />
                                                                            <span className="truncate">{lead.company || "Individual"}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-normal">
                                                                            <Mail className="h-3 w-3" />
                                                                            <span className="truncate">{lead.email}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-4 pt-3 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                                                                        <div className="flex items-center gap-1">
                                                                            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                                                                            <span className="text-xs font-bold text-zinc-900">${(lead.estimatedValue || 0).toLocaleString()}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <CustomButton variant="ghost" className="h-7 w-7 p-0 rounded-full hover:bg-zinc-100">
                                                                                        <MoreVertical className="h-3.5 w-3.5 text-zinc-400" />
                                                                                    </CustomButton>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem onClick={() => router.push(`/${orgName}/modules/crm/leads/${lead._id}`)}>View Profile</DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => router.push(`/${orgName}/modules/crm/leads/${lead._id}/edit`)}>Edit Details</DropdownMenuItem>
                                                                                    <DropdownMenuItem className="text-red-600">Mark as Junk</DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                            <CustomButton variant="ghost" className="h-7 w-7 p-0 rounded-full group-hover:bg-zinc-100 transition-colors" onClick={() => router.push(`/${orgName}/modules/crm/leads/${lead._id}`)}>
                                                                                <ChevronRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-blue-600" />
                                                                            </CustomButton>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </AnimatePresence>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </div>
    );
}
