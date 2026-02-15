"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Search,
  Download,
  Send,
  Eye,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Filter,
  TrendingUp,
  AlertCircle,
  Archive,
  RefreshCcw,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

import { CustomButton } from "@/components/custom/CustomButton";
import { CustomInput } from "@/components/custom/CustomInput";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  getAllInvoices,
  cancelInvoice,
  restoreCancelledInvoice
} from "@/hooks/invoiceHooks";
import { useLoaderStore } from "@/lib/loaderStore";

// --- Types ---
interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  clientemail: string;
  firmName: string;
  status: "Paid" | "Pending" | "Overdue" | "Draft" | "Cancelled";
  amount: number;
  invoiceDate: string;
  dueDate: string;
}

const STATUS_CONFIG: Record<string, { color: string, bg: string, icon: any, shadow: string, border: string }> = {
  Paid: { color: "text-emerald-700", bg: "bg-emerald-50", icon: CheckCircle2, shadow: "shadow-emerald-100", border: "border-emerald-100" },
  Pending: { color: "text-amber-700", bg: "bg-amber-50", icon: Clock, shadow: "shadow-amber-100", border: "border-amber-100" },
  Overdue: { color: "text-red-700", bg: "bg-red-50", icon: AlertCircle, shadow: "shadow-red-100", border: "border-red-100" },
  Draft: { color: "text-zinc-500", bg: "bg-zinc-50", icon: FileText, shadow: "shadow-zinc-100", border: "border-zinc-200" },
  Cancelled: { color: "text-zinc-400", bg: "bg-zinc-100", icon: XCircle, shadow: "shadow-zinc-50", border: "border-zinc-200" },
};

export default function AllInvoicesPage() {
  const params = useParams();
  const router = useRouter();
  const orgName = params.orgName as string;
  const { showLoader, hideLoader } = useLoaderStore();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const fetchInvoices = async () => {
    showLoader();
    try {
      const res = await getAllInvoices();
      setInvoices(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to load invoices");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const paid = invoices.filter(i => i.status === "Paid").reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const pending = invoices.filter(i => i.status === "Pending").reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const overdue = invoices.filter(i => i.status === "Overdue").reduce((sum, inv) => sum + (inv.amount || 0), 0);
    return { total, paid, pending, overdue };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch =
        inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "all" || inv.status.toLowerCase() === activeTab.toLowerCase();
      return matchesSearch && matchesTab;
    });
  }, [invoices, searchTerm, activeTab]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b px-8 py-6 shadow-sm relative z-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight uppercase">Billing Hub</h1>
              <p className="text-sm text-zinc-500 font-medium">Manage organization invoices, payments and revenue flow</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <CustomInput
                placeholder="Find invoice..."
                className="pl-9 h-11 bg-zinc-50/50 border-zinc-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CustomButton className="h-11 bg-zinc-900 text-white px-6 rounded-xl font-bold shadow-lg" onClick={() => router.push(`/${orgName}/modules/invoice/create`)}>
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </CustomButton>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 scrollbar-hide space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Total Revenue" value={stats.total} icon={TrendingUp} color="from-blue-600 to-indigo-700" />
          <StatCard label="Paid Status" value={stats.paid} icon={CheckCircle2} color="from-emerald-500 to-teal-700" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="from-amber-400 to-orange-600" />
          <StatCard label="Overdue" value={stats.overdue} icon={AlertCircle} color="from-red-500 to-rose-700" />
        </div>

        {/* Filters & Tabs */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-transparent h-auto p-0 gap-8">
              {["all", "Paid", "Pending", "Overdue", "Draft"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="px-0 py-3 text-sm font-bold uppercase tracking-widest bg-transparent border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none shadow-none"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <CustomButton variant="outline" size="sm" className="h-9 px-3 text-[11px] font-black uppercase tracking-tighter" onClick={fetchInvoices}>
              <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Reload
            </CustomButton>
            <CustomButton variant="outline" size="sm" className="h-9 px-3 text-[11px] font-black uppercase tracking-tighter">
              <Download className="mr-2 h-3.5 w-3.5" /> Export PDF
            </CustomButton>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200/50 shadow-sm overflow-hidden min-w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Invoice ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Client / Firm</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Due Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              <AnimatePresence mode="popLayout">
                {filteredInvoices.map((inv, idx) => {
                  const Config = STATUS_CONFIG[inv.status] || STATUS_CONFIG.Draft;
                  return (
                    <motion.tr
                      key={inv._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group hover:bg-blue-50/20 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl ${Config.bg} ${Config.color}`}>
                            <Config.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-zinc-900 tracking-tighter uppercase">{inv.invoiceNumber}</p>
                            <p className="text-[10px] font-bold text-zinc-400 mt-0.5">{inv.invoiceDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-zinc-800">{inv.clientName}</p>
                        <p className="text-[11px] text-zinc-400 font-medium">{inv.firmName}</p>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className={`rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${Config.bg} ${Config.color} ${Config.border}`}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-sm font-black text-zinc-900 tracking-tighter">${(inv.amount || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-zinc-300" />
                          <span className="text-xs font-bold text-zinc-500">{inv.dueDate}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <CustomButton variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-white border border-transparent hover:border-zinc-200 shadow-none" onClick={() => router.push(`/${orgName}/modules/invoice/${inv._id}`)}>
                            <Eye className="h-4 w-4 text-zinc-400" />
                          </CustomButton>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <CustomButton variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-white shadow-none">
                                <MoreVertical className="h-4 w-4 text-zinc-400" />
                              </CustomButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuItem onClick={() => router.push(`/${orgName}/modules/invoice/${inv._id}`)}>
                                <Zap className="mr-2 h-4 w-4" /> Quick View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/${orgName}/modules/invoice/${inv._id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" /> Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {inv.status !== "Cancelled" && (
                                <DropdownMenuItem className="text-red-500" onClick={() => handleCancelInvoice(inv._id)}>
                                  <Archive className="mr-2 h-4 w-4" /> Cancel Invoice
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredInvoices.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
              <FileText size={64} strokeWidth={1} className="mb-4 opacity-20" />
              <p className="font-bold text-sm uppercase tracking-widest">No matching invoices found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleCancelInvoice(id: string) {
    try {
      await cancelInvoice(id);
      toast.success("Invoice cancelled");
      fetchInvoices();
    } catch (error) {
      toast.error("Failed to cancel invoice");
    }
  }
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`relative overflow-hidden bg-white dark:bg-zinc-900 p-8 rounded-[36px] border border-zinc-200/50 shadow-sm flex items-center justify-between group`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-[0.03] rounded-full -mr-16 -mt-16 transition-all duration-500 group-hover:scale-150`} />
      <div className="space-y-1 relative z-10">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-3xl font-black text-zinc-900 tracking-tighter">${value.toLocaleString()}</p>
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-xl rotate-3 group-hover:rotate-12 transition-all relative z-10`}>
        <Icon className="h-6 w-6" />
      </div>
    </motion.div>
  );
}

import { Edit } from "lucide-react";
