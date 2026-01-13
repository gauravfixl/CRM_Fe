"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Download,
  Trash2,
  RefreshCcw,
  Mail,
  Briefcase
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
import { getLeadListByOrg } from "@/hooks/leadHooks";
import { toast } from "sonner";

// --- Types ---
interface Lead {
  _id: string;
  LeadId: string;
  name: string;
  email: string;
  company: string;
  stage: "New" | "Qualified" | "Proposal" | "Negotiation" | "Won" | "Lost" | "Hold";
  source: string;
  estimatedValue: number;
  assignedTo?: { email: string; name: string };
  isDeleted: boolean;
  createdAt: string;
}

export default function LeadsPage() {
  const params = useParams();
  const router = useRouter();
  const orgName = params.orgName as string;

  const { showLoader, hideLoader } = useLoaderStore();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  // Filters from URL
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "all";

  const filterConfig = {
    all: { title: "Lead Management", subtitle: "Track, manage and optimize your sales pipelines" },
    mine: { title: "My Enterprise Leads", subtitle: "Records currently assigned to your account" },
    recent: { title: "Recently Viewed", subtitle: "Leads you've interacted with in the last 7 days" },
    unassigned: { title: "Unassigned Records", subtitle: "Leads waiting for an owner assignment" },
    converted: { title: "Converted Opportunities", subtitle: "Successful conversions ready for lifecycle management" },
  } as const;

  const currentView = filterConfig[currentFilter as keyof typeof filterConfig] || filterConfig.all;

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    let result = leads;

    // Apply URL Filter
    if (currentFilter === "mine") {
      result = result.filter(l => l.assignedTo?.name === "Admin" || !l.assignedTo);
    } else if (currentFilter === "unassigned") {
      result = result.filter(l => !l.assignedTo);
    } else if (currentFilter === "converted") {
      result = result.filter(l => l.stage === "Won");
    } else if (currentFilter === "recent") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      result = result.filter(l => new Date(l.createdAt) > sevenDaysAgo);
    }

    // Apply Search Term
    if (searchTerm) {
      result = result.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [leads, currentFilter, searchTerm]);

  // Stats with VIBRANT, DARKER gradients - now using filtered data for better feedback
  const stats = useMemo(() => {
    const total = filteredLeads.length;
    const qualified = filteredLeads.filter(l => l.stage === "Qualified").length;
    const pipelineValue = filteredLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
    const winRate = total > 0 ? (filteredLeads.filter(l => l.stage === "Won").length / total) * 100 : 0;

    return [
      {
        label: `${currentFilter === 'all' ? 'Total' : 'Selected'} Leads`,
        value: total,
        icon: Users,
        gradient: "from-blue-600 via-blue-700 to-indigo-800",
        shadow: "shadow-blue-200/50 dark:shadow-blue-900/20",
        iconBg: "bg-white/20"
      },
      {
        label: "Qualified",
        value: qualified,
        icon: Target,
        gradient: "from-purple-600 via-fuchsia-600 to-indigo-700",
        shadow: "shadow-purple-200/50 dark:shadow-purple-900/20",
        iconBg: "bg-white/20"
      },
      {
        label: "Pipeline Value",
        value: `$${pipelineValue.toLocaleString()}`,
        icon: DollarSign,
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
  }, [filteredLeads, currentFilter]);

  // Fetch Logic
  const fetchLeads = async () => {
    showLoader();
    try {
      const res = await getLeadListByOrg();
      setLeads(res?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch leads", error);
      toast.error("Failed to load leads");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedLeads(filteredLeads.map(l => l._id));
    else setSelectedLeads([]);
  };

  const toggleLeadSelection = (id: string) => {
    setSelectedLeads(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStageBadge = (stage: Lead["stage"]) => {
    const styles: Record<string, string> = {
      New: "bg-blue-100 text-blue-700 border-blue-200",
      Qualified: "bg-emerald-100 text-emerald-700 border-emerald-200",
      Proposal: "bg-amber-100 text-amber-700 border-amber-200",
      Negotiation: "bg-purple-100 text-purple-700 border-purple-200",
      Won: "bg-zinc-900 text-white border-zinc-900",
      Lost: "bg-red-100 text-red-700 border-red-200",
      Hold: "bg-zinc-100 text-zinc-600 border-zinc-200",
    };
    return <Badge variant="outline" className={`${styles[stage]} font-normal px-2 py-0.5 text-[10px]`}>{stage}</Badge>;
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 dark:bg-zinc-950">
      {/* 1. Page Header - Sticky with negative margins to offset AppLayout's p-4 */}
      <div className="sticky top-[-1.01rem] -mt-4 -mx-4 bg-white dark:bg-zinc-900 border-b px-6 py-4 shadow-sm z-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{currentView.title}</h1>
            <p className="text-sm text-zinc-500 font-normal">{currentView.subtitle}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <CustomButton variant="outline" className="h-9 font-normal text-xs" onClick={fetchLeads}>
              <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Refresh
            </CustomButton>
            <CustomButton
              className="h-9 font-normal text-xs bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md"
              onClick={() => router.push(`/${orgName}/modules/crm/leads/add`)}
            >
              <Plus className="mr-2 h-4 w-4" /> New Lead
            </CustomButton>
          </motion.div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 2. SUPER VIBRANT STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${stat.gradient} ${stat.shadow} border-0 flex flex-col justify-between h-32 group`}
            >
              {/* Animated Inner Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />

              <div className="flex items-center justify-between z-10">
                <div className={`p-2.5 rounded-xl ${stat.iconBg} backdrop-blur-md shadow-inner`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <Users className="h-8 w-8 text-white/10 absolute right-4 top-4" />
              </div>

              <div className="z-10 mt-auto">
                <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <span className="text-[10px] text-white/60 font-medium">real-time</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. Filter & Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm"
        >
          <div className="p-4 border-b flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-50/30">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <CustomInput
                  placeholder="Search leads, email, or company..."
                  className="pl-9 h-10 font-normal text-sm border-zinc-200 bg-white focus-visible:ring-zinc-900 rounded-lg shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <CustomButton variant="outline" className="h-10 px-4 font-normal text-zinc-600 rounded-lg border-zinc-200">
                <Filter className="mr-2 h-4 w-4 text-zinc-400" /> Filters
              </CustomButton>
            </div>

            <AnimatePresence>
              {selectedLeads.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2"
                >
                  <p className="text-xs font-semibold text-zinc-500 px-2 py-1 bg-zinc-100 rounded-md">
                    {selectedLeads.length} selected
                  </p>
                  <CustomButton variant="ghost" size="sm" className="h-9 text-xs font-normal text-red-500 hover:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete selected
                  </CustomButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50/50 border-b">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] pl-6 py-4">
                    <Checkbox
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-400 uppercase py-4 tracking-widest">Lead Identity</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-400 uppercase py-4 tracking-widest">Stage</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-400 uppercase py-4 tracking-widest">Company Info</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-400 uppercase py-4 tracking-widest">Estimate</TableHead>
                  <TableHead className="text-[10px] font-bold text-zinc-400 uppercase py-4 tracking-widest text-right pr-6">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead, idx) => (
                      <motion.tr
                        key={lead._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 * idx }}
                        className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors border-b last:border-0"
                      >
                        <TableCell className="pl-6">
                          <Checkbox
                            checked={selectedLeads.includes(lead._id)}
                            onCheckedChange={() => toggleLeadSelection(lead._id)}
                          />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">{lead.name}</span>
                            <span className="text-xs text-zinc-500 font-normal flex items-center gap-1.5 mt-1">
                              <Mail className="h-3 w-3" /> {lead.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {getStageBadge(lead.stage)}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm text-zinc-600 dark:text-zinc-400 font-normal">{lead.company || "Individual"}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            ${(lead.estimatedValue || 0).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <CustomButton variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-zinc-200">
                                <MoreVertical className="h-4 w-4 text-zinc-500" />
                              </CustomButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="text-xs" onClick={() => router.push(`/${orgName}/modules/crm/leads/${lead._id}`)}>
                                View Journey
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs" onClick={() => router.push(`/${orgName}/modules/crm/leads/${lead._id}/edit`)}>
                                Edit Particulars
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-xs text-red-600">
                                Remove Lead
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="flex flex-col items-center justify-center space-y-3"
                        >
                          <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900">
                            <Search className="h-10 w-10 text-zinc-300" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900">No records matching your search</p>
                            <p className="text-xs text-zinc-500">Try using different keywords or clearing filters</p>
                          </div>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
