"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Plus,
    Search,
    RefreshCcw,
    MoreVertical,
    Briefcase,
    DollarSign,
    LayoutDashboard,
    ChevronRight,
    Filter,
    TrendingUp,
    CheckCircle2
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
import { getDealListByOrg, updateDealStage } from "@/modules/crm/deals/hooks/dealHooks";
import { toast } from "sonner";

// --- Types ---
interface Deal {
    _id: string;
    dealId: string;
    title: string;
    company: string;
    stage: string;
    value: number;
}

const STAGES = ["New", "Discovery", "Proposal", "Negotiation", "Won", "Lost"];

const STAGE_CONFIG: Record<string, { color: string, bg: string, border: string, dot: string }> = {
    New: { color: "text-blue-700", bg: "bg-blue-50/50", border: "border-blue-100", dot: "bg-blue-500" },
    Discovery: { color: "text-indigo-700", bg: "bg-indigo-50/50", border: "border-indigo-100", dot: "bg-indigo-500" },
    Proposal: { color: "text-amber-700", bg: "bg-amber-50/50", border: "border-amber-100", dot: "bg-amber-500" },
    Negotiation: { color: "text-purple-700", bg: "bg-purple-50/50", border: "border-purple-100", dot: "bg-purple-500" },
    Won: { color: "text-zinc-900", bg: "bg-zinc-100/50", border: "border-zinc-200", dot: "bg-zinc-900" },
    Lost: { color: "text-red-700", bg: "bg-red-100/30", border: "border-red-100", dot: "bg-red-500" },
};

export default function DealKanbanPage() {
    const params = useParams();
    const router = useRouter();
    const orgName = params.orgName as string;

    const { showLoader, hideLoader } = useLoaderStore();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDeals = async () => {
        showLoader();
        try {
            const res = await getDealListByOrg();
            setDeals(res?.data?.data || []);
        } catch (error) {
            toast.error("Failed to load deals");
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        fetchDeals();
    }, []);

    const groupedDeals = useMemo(() => {
        const groups: Record<string, Deal[]> = {};
        STAGES.forEach(stage => groups[stage] = []);

        deals.filter(d =>
            d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.company?.toLowerCase().includes(searchTerm.toLowerCase())
        ).forEach(deal => {
            if (groups[deal.stage]) {
                groups[deal.stage].push(deal);
            } else {
                if (!groups["New"]) groups["New"] = [];
                groups["New"].push(deal);
            }
        });
        return groups;
    }, [deals, searchTerm]);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const dealId = draggableId;
        const newStage = destination.droppableId;

        const originalDeals = [...deals];
        setDeals(prev => prev.map(d => d._id === dealId ? { ...d, stage: newStage } : d));

        try {
            await updateDealStage(dealId, newStage);
            toast.success(`Deal moved to ${newStage}`);
        } catch (error) {
            setDeals(originalDeals);
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950 overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b px-8 py-6 shadow-sm relative z-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                            <LayoutDashboard className="h-6 w-6 text-indigo-600" />
                            Opportunity Pipeline
                        </h1>
                        <p className="text-sm text-zinc-500 font-normal mt-1">Manage your active deals and move them through sales cycles</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <CustomInput
                                placeholder="Find opportunity..."
                                className="pl-9 h-11 font-normal text-xs border-zinc-200 bg-zinc-50/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <CustomButton variant="outline" className="h-11 px-4" onClick={fetchDeals}>
                            <RefreshCcw className="h-4 w-4" />
                        </CustomButton>
                        <CustomButton className="h-11 bg-zinc-900 text-white rounded-xl shadow-lg px-6" onClick={() => router.push(`/${orgName}/modules/crm/deals/new`)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Deal
                        </CustomButton>
                    </div>
                </div>
            </div>

            {/* Kanban Board Area */}
            <div className="flex-1 overflow-x-auto p-12 bg-slate-50/30">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-8 h-full min-w-max pb-4">
                        {STAGES.map((stage) => (
                            <div key={stage} className="w-80 flex flex-col h-full">
                                {/* Stage Header */}
                                <div className={`flex items-center justify-between mb-6 p-4 rounded-[24px] border border-dashed ${STAGE_CONFIG[stage].border} ${STAGE_CONFIG[stage].bg}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${STAGE_CONFIG[stage].dot} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
                                        <span className={`text-xs font-black uppercase tracking-widest ${STAGE_CONFIG[stage].color}`}>{stage}</span>
                                        <Badge variant="secondary" className="bg-white/80 dark:bg-zinc-800 text-[10px] font-black px-2 py-0">
                                            {groupedDeals[stage].length}
                                        </Badge>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <CustomButton variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/50">
                                                <MoreVertical className="h-4 w-4 text-zinc-400" />
                                            </CustomButton>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem className="text-xs font-bold py-2">STAGE ACTIONS</DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs" onClick={() => toast.info("Sorting by value...")}>Sort by Highest Value</DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs" onClick={() => toast.info("Sorting by date...")}>Sort by Expected Close</DropdownMenuItem>
                                            <DropdownMenuItem className="text-xs text-red-600">Archive All Opportunities</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Droppable Area */}
                                <Droppable droppableId={stage}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 overflow-y-auto rounded-[32px] transition-all duration-300 p-2 min-h-[150px] ${snapshot.isDraggingOver ? "bg-white/50 border-2 border-dashed border-zinc-200" : "bg-transparent"}`}
                                        >
                                            <AnimatePresence>
                                                {groupedDeals[stage].map((deal, index) => (
                                                    <Draggable key={deal._id} draggableId={deal._id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="mb-4"
                                                            >
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                                    whileHover={{ y: -4, rotate: 1 }}
                                                                    className={`bg-white dark:bg-zinc-900 p-5 rounded-[24px] border border-zinc-200/60 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all group ${snapshot.isDragging ? "shadow-2xl border-blue-400 ring-2 ring-blue-400/20 rotate-2" : ""}`}
                                                                >
                                                                    <div className="flex justify-between items-start mb-4">
                                                                        <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                                                                            {deal.title}
                                                                        </h3>
                                                                        <span className="text-[10px] font-black text-zinc-300">#{deal.dealId?.slice(-4) || "Opportunity"}</span>
                                                                    </div>

                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                                                                            <Briefcase className="h-3 w-3 text-zinc-400" />
                                                                            <span className="truncate">{deal.company || "Individual Account"}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-5 pt-4 border-t border-dashed border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                                                                                <DollarSign className="h-3 w-3 text-emerald-600" />
                                                                            </div>
                                                                            <span className="text-[11px] font-black text-zinc-900 tracking-tight">${(deal.value || 0).toLocaleString()}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <CustomButton variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-zinc-50">
                                                                                        <MoreVertical className="h-3.5 w-3.5 text-zinc-400" />
                                                                                    </CustomButton>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end">
                                                                                    <DropdownMenuItem onClick={() => router.push(`/${orgName}/modules/crm/deals/${deal._id}`)}>View Details</DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => router.push(`/${orgName}/modules/crm/deals/${deal._id}/edit`)}>Edit Deal</DropdownMenuItem>
                                                                                    <DropdownMenuItem className="text-red-600">Archive</DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                            <CustomButton variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-zinc-50" onClick={() => router.push(`/${orgName}/modules/crm/deals/${deal._id}`)}>
                                                                                <ChevronRight className="h-4 w-4 text-zinc-300" />
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
