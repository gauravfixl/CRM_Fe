"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Briefcase,
    TrendingUp,
    Award,
    DollarSign,
    Download,
    Trash2,
    RefreshCcw,
    Mail,
    Users,
    CheckCircle,
    FolderKanban
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoaderStore } from "@/lib/loaderStore";
import { getDealListByOrg } from "@/modules/crm/deals/hooks/dealHooks";
import { toast } from "sonner";

// --- Types ---
interface Deal {
    _id: string;
    dealId: string;
    title: string;
    company: string;
    stage: string;
    value: number;
    expectedCloseDate: string;
    assignedTo: string;
}

const STAGE_COLORS: Record<string, string> = {
    New: "bg-blue-100 text-blue-800 border-blue-200",
    Discovery: "bg-indigo-100 text-indigo-800 border-indigo-200",
    Proposal: "bg-amber-100 text-amber-800 border-amber-200",
    Negotiation: "bg-purple-100 text-purple-800 border-purple-200",
    Won: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Lost: "bg-red-100 text-red-800 border-red-200",
};

export default function DealsPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const orgName = params.orgName as string;
    const filterType = searchParams.get("filter");

    const { showLoader, hideLoader } = useLoaderStore();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDeals, setSelectedDeals] = useState<string[]>([]);

    // Stats calculation
    const stats = useMemo(() => {
        const total = deals.length;
        const wonCount = deals.filter(d => d.stage === "Won").length;
        const totalValue = deals.reduce((acc, d) => acc + (d.value || 0), 0);
        const winRate = total > 0 ? (wonCount / total) * 100 : 0;

        return [
            {
                label: "Pipeline Value",
                value: `$${totalValue.toLocaleString()}`,
                icon: DollarSign,
                gradient: "from-blue-600 via-blue-700 to-indigo-800",
                shadow: "shadow-blue-200/50 dark:shadow-blue-900/20",
                iconBg: "bg-white/20"
            },
            {
                label: "Active Deals",
                value: deals.filter(d => d.stage !== "Won" && d.stage !== "Lost").length,
                icon: Briefcase,
                gradient: "from-purple-600 via-fuchsia-600 to-indigo-700",
                shadow: "shadow-purple-200/50 dark:shadow-purple-900/20",
                iconBg: "bg-white/20"
            },
            {
                label: "Closed Deals",
                value: deals.filter(d => d.stage === "Won" || d.stage === "Lost").length,
                icon: Award,
                gradient: "from-emerald-500 via-teal-600 to-cyan-700",
                shadow: "shadow-emerald-200/50 dark:shadow-emerald-900/20",
                iconBg: "bg-white/20"
            },
            {
                label: "Win Rate",
                value: `${winRate.toFixed(0)}%`,
                icon: TrendingUp,
                gradient: "from-orange-500 via-rose-500 to-red-600",
                shadow: "shadow-orange-200/50 dark:shadow-orange-900/20",
                iconBg: "bg-white/20"
            },
        ];
    }, [deals]);

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

    const filteredDeals = useMemo(() => {
        let result = deals;

        if (filterType === "won") result = result.filter(d => d.stage === "Won");
        else if (filterType === "lost") result = result.filter(d => d.stage === "Lost");
        else if (filterType === "open") result = result.filter(d => d.stage !== "Won" && d.stage !== "Lost");

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(d =>
                d.title?.toLowerCase().includes(term) ||
                d.company?.toLowerCase().includes(term)
            );
        }
        return result;
    }, [deals, searchTerm, filterType]);

    const toggleSelectAll = () => {
        if (selectedDeals.length === filteredDeals.length) setSelectedDeals([]);
        else setSelectedDeals(filteredDeals.map(d => d._id));
    };

    const toggleSelectDeal = (id: string) => {
        setSelectedDeals(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950 overflow-hidden">
            {/* Header Section */}
            <div className="bg-white dark:bg-zinc-900 border-b px-8 py-6 shadow-sm relative z-10 transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                            Opportunities
                        </h1>
                        <p className="text-sm text-zinc-500 font-normal">Track your business opportunities and close high-value deals</p>
                    </motion.div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <CustomInput
                                placeholder="Search deals..."
                                className="pl-9 h-11 font-normal text-xs border-zinc-200 bg-zinc-50/50 focus:bg-white transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <CustomButton variant="outline" className="h-11 shadow-sm px-4" onClick={fetchDeals}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                        </CustomButton>
                        <CustomButton className="h-11 bg-zinc-900 border-zinc-900 text-white hover:bg-zinc-800 shadow-lg px-6" onClick={() => router.push(`/${orgName}/modules/crm/deals/new`)}>
                            <Plus className="mr-2 h-4 w-4" /> New Deal
                        </CustomButton>
                    </div>
                </div>
            </div>

            {/* Stats Cards Section */}
            <div className="p-8 pb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -5 }}
                            className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-[32px] ${stat.shadow} text-white relative overflow-hidden group`}
                        >
                            <div className={`absolute top-0 right-0 p-8 ${stat.iconBg} rounded-bl-[64px] transition-transform group-hover:scale-110`}>
                                <stat.icon className="h-6 w-6 opacity-40" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">{stat.label}</p>
                            <h2 className="text-3xl font-black tracking-tighter">{stat.value}</h2>
                            <div className="mt-4 flex items-center gap-2">
                                <Badge className="bg-white/20 text-white border-0 text-[10px] font-bold">+12.5%</Badge>
                                <span className="text-[10px] font-medium opacity-60 italic">vs last month</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Table Section */}
            <div className="flex-1 overflow-hidden p-8">
                <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200/60 dark:border-zinc-800 shadow-xl flex flex-col h-full transition-colors duration-300">
                    {/* Table Toolbar */}
                    <div className="px-6 py-4 border-b flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="text-[10px] font-black uppercase bg-white border-zinc-100">{filteredDeals.length} Deals</Badge>
                            {selectedDeals.length > 0 && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
                                    <div className="w-[1px] h-4 bg-zinc-200 mx-2" />
                                    <CustomButton variant="ghost" size="sm" className="h-8 text-xs text-red-600 font-bold hover:bg-red-50">
                                        <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete ({selectedDeals.length})
                                    </CustomButton>
                                </motion.div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <CustomButton variant="outline" size="sm" className="h-9 px-4 text-xs font-bold border-zinc-200">
                                <Download className="mr-2 h-3.5 w-3.5" /> Export
                            </CustomButton>
                            <CustomButton variant="outline" size="sm" className="h-9 px-4 text-xs font-bold border-zinc-200">
                                <Filter className="mr-2 h-3.5 w-3.5" /> Filter Results
                            </CustomButton>
                        </div>
                    </div>

                    {/* Actual Table */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <Table>
                            <TableHeader className="bg-zinc-50/30 sticky top-0 z-20">
                                <TableRow className="hover:bg-transparent border-b">
                                    <TableHead className="w-12 text-center">
                                        <Checkbox
                                            checked={selectedDeals.length === filteredDeals.length && filteredDeals.length > 0}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-zinc-400">Deal Opportunity</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-zinc-400">Account / Company</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-zinc-400">Pipeline Stage</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-zinc-400">Contract Value</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-zinc-400">Owner</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {filteredDeals.length > 0 ? (
                                        filteredDeals.map((deal) => (
                                            <motion.tr
                                                layout
                                                key={deal._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer border-b last:border-0 transition-colors"
                                                onClick={() => router.push(`/${orgName}/modules/crm/deals/${deal._id}`)}
                                            >
                                                <TableCell className="w-12 text-center" onClick={(e) => e.stopPropagation()}>
                                                    <Checkbox
                                                        checked={selectedDeals.includes(deal._id)}
                                                        onCheckedChange={() => toggleSelectDeal(deal._id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors uppercase tracking-tighter">
                                                            {deal.title}
                                                        </p>
                                                        <p className="text-[10px] text-zinc-400 font-medium">#{deal.dealId || "DEAL-5021"}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-zinc-500">
                                                            {deal.company?.charAt(0) || "B"}
                                                        </div>
                                                        <span className="text-sm text-zinc-600 font-medium">{deal.company || "Not Linked"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={`text-[10px] font-black border-0 uppercase ${STAGE_COLORS[deal.stage] || "bg-zinc-100"}`}>
                                                        {deal.stage}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm font-black text-zinc-900 tracking-tighter">${(deal.value || 0).toLocaleString()}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-blue-600 text-[10px] text-white flex items-center justify-center font-bold">A</div>
                                                        <span className="text-xs text-zinc-500 font-medium">{deal.assignedTo || "Admin User"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <CustomButton variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </CustomButton>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => router.push(`/${orgName}/modules/crm/deals/${deal._id}/edit`)}>Edit Deal</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">Archive Opportunity</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                                                    <Construction className="h-10 w-10" />
                                                    <p className="text-sm font-medium">No deals found in this view</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Add these to imports
import { Construction } from "lucide-react";
