"use client"

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  CreditCard,
  PiggyBank,
  Receipt,
  Plus,
  Upload,
  Calendar,
  IndianRupee,
  MoreVertical,
  Trash2,
  ArrowUpRight,
  Search,
  Filter,
  Activity,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useToast } from "@/shared/components/ui/use-toast";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/shared/components/ui/sheet";

import { useMeStore } from "@/shared/data/me-store";

const downloadCSV = (filename: string, csvContent: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const MyFinancesPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { finances, updateUser } = useMeStore();
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [expenseFilter, setExpenseFilter] = useState<'All' | 'Pending' | 'Approved'>('All');
  const [claimForm, setClaimForm] = useState({
    type: 'Travel',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    billCopy: null as any
  });

  const [reimbursements, setReimbursements] = useState([
    { id: '1', type: 'Travel', amount: 4500, date: '2026-01-15', status: 'Approved', description: 'Client meeting travel' },
    { id: '2', type: 'Medical', amount: 2000, date: '2026-01-10', status: 'Pending', description: 'Medicine bills' },
  ]);
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);

  const stats = [
    { label: "Annual CTC", value: finances.salary.ytd, color: "text-purple-700", cardBg: "bg-purple-100", icon: DollarSign },
    { label: "Monthly Net", value: finances.salary.takeHome, color: "text-emerald-700", cardBg: "bg-emerald-100", icon: TrendingUp },
    { label: "YTD Deductions", value: finances.salary.deductions, color: "text-rose-700", cardBg: "bg-rose-100", icon: TrendingDown },
    { label: "Pending Claims", value: reimbursements.filter(r => r.status === 'Pending').length.toString(), color: "text-amber-700", cardBg: "bg-amber-100", icon: Receipt },
  ];

  const handleClaim = () => {
    if (!claimForm.amount || !claimForm.description || !claimForm.date) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }

    const newClaim = {
      id: Date.now().toString(),
      type: claimForm.type,
      amount: parseFloat(claimForm.amount),
      date: claimForm.date,
      status: 'Pending',
      description: claimForm.description
    };

    setReimbursements([newClaim as any, ...reimbursements]);
    setIsClaimOpen(false);
    setClaimForm({ type: 'Travel', amount: '', date: new Date().toISOString().split('T')[0], description: '', billCopy: null });
    toast({ title: "Claim Submitted", description: "Reimbursement claim sent for approval." });
  };

  const handleCancelClaim = (id: string) => {
    setReimbursements(reimbursements.filter(r => r.id !== id));
    toast({ title: "Claim Cancelled" });
  };

  const formatINR = (amt: number) => `₹${amt.toLocaleString("en-IN")}`;

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] font-sans" style={{ zoom: "90%" }}>
      {/* Professional Header */}
      <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-start">
          <div className="h-9 w-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
            <IndianRupee size={18} />
          </div>
          <div className="text-start">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight text-start leading-none mb-1">Fiscal Terminal</h1>
            <p className="text-[10px] font-bold text-slate-500 capitalize tracking-wide text-start leading-none opacity-60">Personal earnings & claims console</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-lg border-slate-100 font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50"
            onClick={() => {
              const csv = "Category,Amount,Section\nGross Salary," + finances.salary.ytd + ",Income\nTax Deducted," + finances.salary.deductions + ",TDS\nTax Saved," + finances.salary.taxSaved + ",80C\nNet Take Home," + finances.salary.takeHome + ",Net\n";
              downloadCSV("tax-report-fy-2025-26.csv", csv);
              toast({ title: "Tax Report Downloaded", description: "Your FY 2025-26 tax report CSV has been saved." });
            }}
          >
            <Download size={14} className="text-slate-400" /> Tax year 2025-26
          </Button>
          <Button
            className="bg-[#CB9DF0] hover:bg-[#b088e0] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-sm border-none"
            onClick={() => setIsClaimOpen(true)}
          >
            <Plus size={14} className="mr-2" /> New Expense Claim
          </Button>
        </div>
      </div>

      <SideFormSheet
        open={isClaimOpen}
        onOpenChange={setIsClaimOpen}
        title="Claim Reimbursement"
        description="Submit expenditures for fiscal reconciliation."
        icon={<Receipt size={20} />}
        accentColor="#4f46e5"
        width="md"
        submitLabel="Initialize Submission"
        onSubmit={(e) => { e.preventDefault(); handleClaim(); }}
      >
        <div className="space-y-4">
          <Field label="Expense Node" required>
            <Select value={claimForm.type} onValueChange={(v) => setClaimForm({ ...claimForm, type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['Travel', 'Medical', 'Food', 'Internet', 'Education'].map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantum (₹)" required>
              <Input
                type="number"
                placeholder="0.00"
                value={claimForm.amount}
                onChange={e => setClaimForm({ ...claimForm, amount: e.target.value })}
              />
            </Field>
            <Field label="Cycle Date" required>
              <Input
                type="date"
                value={claimForm.date}
                onChange={e => setClaimForm({ ...claimForm, date: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Justification" required>
            <Textarea
              placeholder="Brief technical description of expense..."
              value={claimForm.description}
              onChange={e => setClaimForm({ ...claimForm, description: e.target.value })}
              className="min-h-[100px]"
            />
          </Field>
        </div>
      </SideFormSheet>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* High-Density Matrix Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {stats.map((stat, i) => (
              <Card key={i} className={`rounded-2xl border-none ${stat.cardBg} shadow-sm overflow-hidden text-start group hover:shadow-md transition-all`}>
                <CardContent className="p-5 text-start flex items-center justify-between">
                  <div className="text-start">
                    <p className="text-[12px] font-bold text-slate-600 capitalize tracking-wide leading-none mb-2 text-start opacity-70">{stat.label}</p>
                    <p className="text-[22px] font-bold text-slate-900 tracking-tight leading-none text-start">{stat.value}</p>
                  </div>
                  <div className={`h-11 w-11 bg-white ${stat.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                    <stat.icon size={20} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Salary Dashboard Node */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="rounded-3xl border-none bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-900 shadow-xl overflow-hidden relative group">
                <div className="p-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-12 lg:col-span-7 space-y-6 text-start">
                    <div className="text-start">
                      <Badge className="bg-indigo-600 text-white border-none font-bold text-[10px] px-3 py-1 capitalize tracking-wide mb-4 shadow-lg shadow-indigo-200">Earnings Protocol</Badge>
                      <h2 className="text-2xl font-bold tracking-tight text-start text-slate-900 leading-none">Net Disbursement Target</h2>
                      <p className="text-slate-500 font-bold capitalize tracking-wide text-[11px] mt-3 text-start">Predicted MoM disbursement based on current attendance</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 text-start">
                      <div className="text-start">
                        <p className="text-[11px] font-bold text-slate-400 capitalize tracking-wide text-start leading-none mb-2">Monthly Take Home</p>
                        <p className="text-3xl font-bold text-emerald-600 text-start leading-none">{finances.salary.takeHome}</p>
                      </div>
                      <div className="text-start">
                        <p className="text-[11px] font-bold text-slate-400 capitalize tracking-wide text-start leading-none mb-2">Cycle Accuracy</p>
                        <p className="text-3xl font-bold text-indigo-600 text-start leading-none">99.2%</p>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2 text-start">
                      <Button
                        variant="outline"
                        className="h-11 rounded-xl bg-white/60 border-indigo-100 text-slate-700 px-6 font-bold text-xs capitalize hover:bg-white"
                        onClick={() => router.push("/hrmcubicle/my-finances/summary")}
                      >
                        Full ledger
                      </Button>
                      <Button
                        className="h-11 bg-indigo-500 text-white px-8 rounded-xl font-bold text-xs capitalize shadow-xl shadow-indigo-100 hover:bg-indigo-600 border-none tracking-wide"
                        onClick={() => {
                          const csv = "Date,Description,Debit,Credit,Balance\n2026-01-31,Salary Credit,0," + finances.salary.takeHome + "," + finances.salary.takeHome + "\n2026-01-31,TDS Deduction," + finances.salary.deductions + ",0,0\n2026-01-31,PF Contribution,1800,0,0\n";
                          downloadCSV("jv-report.csv", csv);
                          toast({ title: "JV Report Downloaded", description: "Your Journal Voucher report CSV has been saved." });
                        }}
                      >
                        Download JV
                      </Button>
                    </div>
                  </div>

                  <div className="hidden lg:block lg:col-span-5 border-l border-indigo-100/50 pl-8 space-y-5">
                    {[
                      { label: 'Net Monthly', val: finances.salary.takeHome, pct: '100%' },
                      { label: 'Annual CTC', val: finances.salary.ytd, pct: 'YTD' },
                      { label: 'Statutory Deductions', val: finances.salary.deductions, pct: 'Tax/PF', color: 'text-rose-500' },
                      { label: 'Tax Savings', val: finances.salary.taxSaved, pct: 'Sec 80C', color: 'text-emerald-500' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-start">
                        <div className="text-start">
                          <span className="text-[11px] font-bold text-slate-400 capitalize tracking-wide block text-start leading-none">{item.label}</span>
                          <span className={`text-lg font-bold ${item.color || 'text-slate-900'} text-start leading-none block mt-1`}>{item.val}</span>
                        </div>
                        <Badge className="bg-white text-indigo-500 border-none font-bold text-[9px] uppercase shadow-sm">{item.pct}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <ShieldCheck size={280} className="absolute -right-20 -bottom-20 text-indigo-900 opacity-[0.03] group-hover:scale-110 transition-transform" />
              </Card>

              {/* Claims Node */}
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="text-start">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight text-start leading-none capitalize">Expense Ledger</h3>
                    <p className="text-[11px] font-bold text-slate-400 capitalize tracking-wide mt-2 text-start">Recent reimbursement activity & tracking</p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-100">
                    {['All', 'Pending', 'Approved'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setExpenseFilter(tab as any)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${expenseFilter === tab
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-400 hover:text-slate-600'
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(() => {
                    const filtered = reimbursements.filter(r =>
                      expenseFilter === 'All' ? true : r.status === expenseFilter
                    );

                    if (filtered.length === 0) {
                      return (
                        <div className="col-span-full py-16 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-center">
                          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                            <Receipt className="text-slate-200" size={32} />
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mb-1">No {expenseFilter !== 'All' ? expenseFilter.toLowerCase() : ''} records</h4>
                          <p className="text-[11px] font-bold text-slate-400">There are no reimbursement claims to display here.</p>
                        </div>
                      );
                    }

                    return filtered.map((claim) => {
                      const getCardStyle = (type: string) => {
                        switch (type) {
                          case 'Travel': return 'bg-indigo-50 hover:bg-indigo-100';
                          case 'Medical': return 'bg-emerald-50 hover:bg-emerald-100';
                          case 'Food': return 'bg-amber-50 hover:bg-amber-100';
                          default: return 'bg-slate-50 hover:bg-slate-100';
                        }
                      };
                      return (
                        <motion.div key={claim.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
                          <Card
                            onClick={() => setSelectedClaim(claim)}
                            className={`rounded-2xl border-none ${getCardStyle(claim.type)} p-6 shadow-sm group hover:shadow-md transition-all text-start relative overflow-hidden h-full cursor-pointer`}
                          >
                            <div className="flex justify-between items-start mb-6 text-start">
                              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors shadow-sm">
                                <Receipt size={18} />
                              </div>
                              <div className="flex flex-col items-end gap-2 text-end">
                                <Badge className={`${claim.status === 'Approved' ? 'bg-white text-emerald-700 shadow-sm' : 'bg-white text-amber-700 shadow-sm'} border-none font-bold text-[10px] capitalize px-3`}>
                                  {claim.status}
                                </Badge>
                                {claim.status === 'Pending' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-white transition-all"
                                    onClick={(e) => { e.stopPropagation(); handleCancelClaim(claim.id); }}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1 mb-6 text-start">
                              <h4 className="text-base font-bold text-slate-900 capitalize tracking-tight text-start leading-none text-nowrap truncate">{claim.type} claim</h4>
                              <p className="text-[11px] font-bold text-slate-500 capitalize tracking-wide text-start opacity-75">{new Date(claim.date).toLocaleDateString()} • Ref:{claim.id}</p>
                            </div>
                            <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between text-start">
                              <span className="text-[10px] font-bold text-slate-500 capitalize tracking-wide text-start leading-none opacity-75">Net amount</span>
                              <span className="text-xl font-bold text-slate-800 text-end leading-none">₹{claim.amount.toLocaleString()}</span>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    });
                  })()}
                </div>
              </div>

            </div>

            {/* Document & History Sidebar */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden text-start">
                <CardHeader className="p-6 pb-2 text-start">
                  <div className="flex justify-between items-center text-nowrap">
                    <CardTitle className="text-[11px] font-bold text-slate-400 capitalize tracking-wide text-start mb-0">Identity vault</CardTitle>
                    <Activity size={14} className="text-[#CB9DF0]" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-start">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none text-start">Recent Payslips</h3>
                  <div className="space-y-3">
                    {finances.payslips.length > 0 ? (
                      finances.payslips.map((slip, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer group text-start"
                          onClick={() => setSelectedPayslip(slip)}
                        >
                          <div className="flex items-center gap-4 text-start">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 transition-colors shadow-sm">
                              <FileText size={18} />
                            </div>
                            <div className="text-start">
                              <p className="text-[12px] font-bold text-slate-900 capitalize leading-none mb-1 text-start">{slip.month}</p>
                              <p className="text-[11px] font-bold text-slate-400 capitalize leading-none tracking-wide text-start">{slip.net} • Paid</p>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-10 w-10 rounded-xl bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast({ title: "Download Started", description: "Your payslip pdf is downloading..." });
                            }}
                          >
                            <Download size={16} className="text-indigo-600" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-center">
                        <FileText className="text-slate-200 mb-3" size={32} />
                        <p className="text-[11px] font-bold text-slate-400">No payslips generated yet</p>
                      </div>
                    )}
                  </div>
                  <Button
                    className="w-full h-12 bg-indigo-500 text-white rounded-2xl font-bold capitalize text-[11px] tracking-wide shadow-xl shadow-indigo-100 mt-4 border-none hover:bg-indigo-600"
                    onClick={() => router.push("/hrmcubicle/me/documents")}
                  >
                    Browse all records
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-none bg-gradient-to-br from-[#CB9DF0] to-[#b088e0] p-8 text-white relative overflow-hidden group text-start">
                <div className="relative z-10 space-y-6 text-start">
                  <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="text-start">
                    <h4 className="text-xl font-bold tracking-tight leading-loose text-start">Tax Declaration FY 2026</h4>
                    <p className="text-white/80 text-[11px] font-bold capitalize tracking-wide text-start">Ensure all investment proofs are uploaded by Mar 10 for TDS reconciliation.</p>
                  </div>
                  <Button
                    className="w-full h-11 bg-white text-slate-900 font-bold text-[11px] capitalize tracking-wide rounded-xl hover:bg-slate-50 shadow-lg border-none"
                    onClick={() => router.push("/hrmcubicle/payroll/tax-declarations")}
                  >
                    Review declaration
                  </Button>
                </div>
                <Activity size={120} className="absolute -right-8 -bottom-8 text-white opacity-[0.1] group-hover:scale-110 transition-transform" />
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* 🪟 Slide-in: Claim Details */}
      <Sheet open={!!selectedClaim} onOpenChange={(open) => !open && setSelectedClaim(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-white rounded-none border-l border-slate-200 p-0 flex flex-col">
          {selectedClaim && (
            <>
              <SheetHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                <Badge className={`w-fit text-[10px] font-bold ${selectedClaim.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} border-none`}>
                  {selectedClaim.status}
                </Badge>
                <SheetTitle className="text-lg font-bold text-slate-900 tracking-tight text-start mt-2">{selectedClaim.type} Claim</SheetTitle>
                <SheetDescription className="text-xs font-medium text-slate-500 text-start">Reference #{selectedClaim.id}</SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-none text-center">
                  <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide mb-1">Amount</p>
                  <p className="text-3xl font-bold text-indigo-900">{formatINR(selectedClaim.amount)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-slate-100 rounded-none">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{selectedClaim.type}</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded-none">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Date</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{new Date(selectedClaim.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-none">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Description</p>
                  <p className="text-xs font-medium text-slate-700 leading-relaxed">{selectedClaim.description}</p>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-10 rounded-none border-slate-200 text-slate-700 font-bold text-xs"
                  onClick={() => setSelectedClaim(null)}
                >
                  Close
                </Button>
                {selectedClaim.status === 'Pending' && (
                  <Button
                    variant="outline"
                    className="flex-1 h-10 rounded-none border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs"
                    onClick={() => {
                      handleCancelClaim(selectedClaim.id);
                      setSelectedClaim(null);
                    }}
                  >
                    <Trash2 size={14} className="mr-1.5" /> Cancel
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* 🪟 Slide-in: Payslip Details */}
      <Sheet open={!!selectedPayslip} onOpenChange={(open) => !open && setSelectedPayslip(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-white rounded-none border-l border-slate-200 p-0 flex flex-col">
          {selectedPayslip && (
            <>
              <SheetHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                <Badge className="w-fit text-[10px] font-bold bg-emerald-100 text-emerald-700 border-none">Paid</Badge>
                <SheetTitle className="text-lg font-bold text-slate-900 tracking-tight text-start mt-2">{selectedPayslip.month} Payslip</SheetTitle>
                <SheetDescription className="text-xs font-medium text-slate-500 text-start">Net pay credited to bank account</SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-none text-center">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1">Net Pay</p>
                  <p className="text-3xl font-bold text-emerald-900">{selectedPayslip.net}</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-none">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Quick Breakdown</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Gross Salary</span>
                      <span className="font-bold text-slate-800">{finances.salary.ytd}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500 font-medium">Deductions</span>
                      <span className="font-bold text-rose-600">{finances.salary.deductions}</span>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-bold">Take Home</span>
                      <span className="font-bold text-emerald-700">{selectedPayslip.net}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-10 rounded-none border-slate-200 text-slate-700 font-bold text-xs"
                  onClick={() => setSelectedPayslip(null)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1 h-10 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  onClick={() => {
                    toast({ title: 'Download Started', description: `Downloading payslip for ${selectedPayslip.month}.` });
                  }}
                >
                  <Download size={14} className="mr-1.5" /> Download PDF
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MyFinancesPage;
