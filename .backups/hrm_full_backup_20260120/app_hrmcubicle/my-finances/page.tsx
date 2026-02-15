"use client"

import React, { useState } from "react";
import { motion } from "framer-motion";
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
  Trash2
} from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useToast } from "@/shared/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const MyFinancesPage = () => {
  const { toast } = useToast();
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [claimForm, setClaimForm] = useState({
    type: 'Travel',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    billCopy: null as any
  });

  const salaryDetails = {
    gross: 1200000,
    basic: 480000,
    hra: 240000,
    specialAllowance: 480000,
    pf: 57600,
    pt: 2400,
    tds: 120000,
    netPay: 1020000
  };

  const recentPayslips = [
    { month: 'January 2026', gross: 100000, deductions: 15000, net: 85000, status: 'Paid' },
    { month: 'December 2025', gross: 100000, deductions: 15000, net: 85000, status: 'Paid' },
    { month: 'November 2025', gross: 100000, deductions: 15000, net: 85000, status: 'Paid' },
  ];

  const [reimbursements, setReimbursements] = useState([
    { id: '1', type: 'Travel', amount: 4500, date: '2026-01-15', status: 'Approved', description: 'Client meeting travel' },
    { id: '2', type: 'Medical', amount: 2000, date: '2026-01-10', status: 'Pending', description: 'Medicine bills' },
  ]);

  const stats = [
    { label: "Annual CTC", value: `₹${(salaryDetails.gross / 100000).toFixed(1)}L`, color: "bg-[#CB9DF0]", icon: <DollarSign className="text-slate-800" />, textColor: "text-slate-900" },
    { label: "Monthly Net", value: `₹${(salaryDetails.netPay / 12 / 1000).toFixed(0)}K`, color: "bg-emerald-100", icon: <TrendingUp className="text-emerald-600" />, textColor: "text-emerald-900" },
    { label: "YTD Deductions", value: `₹${((salaryDetails.pf + salaryDetails.pt + salaryDetails.tds) / 1000).toFixed(0)}K`, color: "bg-rose-100", icon: <TrendingDown className="text-rose-600" />, textColor: "text-rose-900" },
    { label: "Pending Claims", value: reimbursements.filter(r => r.status === 'Pending').length.toString(), color: "bg-[#FFF9BF]", icon: <Receipt className="text-slate-800" />, textColor: "text-slate-900" },
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
    if (confirm("Cancel this claim?")) {
      setReimbursements(reimbursements.filter(r => r.id !== id));
      toast({ title: "Claim Cancelled" });
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfdff] p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Finances</h1>
          <p className="text-slate-500 font-medium">View your salary, payslips, and reimbursements.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-xl h-12 border-slate-200 font-bold bg-white text-slate-900">
            <Download className="mr-2 h-4 w-4" /> Form 16
          </Button>
          <Dialog open={isClaimOpen} onOpenChange={setIsClaimOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-xl h-12 px-6 shadow-lg font-bold">
                <Plus className="mr-2 h-5 w-5" /> Claim Reimbursement
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white rounded-[2rem] border-none p-8 max-w-lg">
              <DialogHeader>
                <DialogTitle>Claim Reimbursement</DialogTitle>
                <DialogDescription>Submit expense bills for reimbursement approval.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label>Expense Category *</Label>
                  <Select value={claimForm.type} onValueChange={(v) => setClaimForm({ ...claimForm, type: v })}>
                    <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Travel">Travel / Conveyance</SelectItem>
                      <SelectItem value="Medical">Medical Expenses</SelectItem>
                      <SelectItem value="Food">Food / Meals</SelectItem>
                      <SelectItem value="Internet">Internet / Mobile</SelectItem>
                      <SelectItem value="Education">Education / Certification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount *</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={claimForm.amount}
                      onChange={e => setClaimForm({ ...claimForm, amount: e.target.value })}
                      className="rounded-xl bg-slate-50 border-none h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={claimForm.date}
                      onChange={e => setClaimForm({ ...claimForm, date: e.target.value })}
                      className="rounded-xl bg-slate-50 border-none h-12"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea
                    placeholder="Explain the expense..."
                    value={claimForm.description}
                    onChange={e => setClaimForm({ ...claimForm, description: e.target.value })}
                    className="rounded-xl bg-slate-50 border-none min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Upload Receipt</Label>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 text-slate-400 mb-2" />
                      <p className="text-xs text-slate-500 font-bold">DRAG & DROP OR CLICK</p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-bold" onClick={handleClaim}>
                  Submit Claim
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`border-none shadow-lg rounded-[2rem] ${stat.color} p-6 flex items-center gap-4`}>
              <div className="h-14 w-14 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-sm">
                {stat.icon}
              </div>
              <div>
                <h3 className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</h3>
                <p className={`text-xs font-bold uppercase tracking-widest ${stat.textColor} opacity-80`}>{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Salary Breakdown */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
          <h2 className="text-xl font-black mb-8 font-display">Salary Breakdown</h2>
          <div className="space-y-5">
            {[
              { label: 'Basic Salary', val: salaryDetails.basic },
              { label: 'HRA', val: salaryDetails.hra },
              { label: 'Special Allowance', val: salaryDetails.specialAllowance },
              { label: 'Gratuity', val: 24000 },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-white/60 font-medium">{item.label}</span>
                <span className="font-black text-xl">₹{(item.val / 1000).toFixed(0)}K</span>
              </div>
            ))}

            <div className="flex justify-between items-center py-6 mt-4 border-t-2 border-dashed border-emerald-400/30">
              <div>
                <p className="text-emerald-400 font-black uppercase text-xs tracking-widest mb-1">Take Home Pay</p>
                <h3 className="font-black text-4xl text-emerald-400">₹{(salaryDetails.netPay / 12 / 1000).toFixed(0)}K <span className="text-lg opacity-60">/mo</span></h3>
              </div>
              <TrendingUp className="text-emerald-400 h-10 w-10" />
            </div>
          </div>
        </Card>

        {/* Recent Payslips */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
          <h2 className="text-xl font-black text-slate-900 mb-6 font-display">Recent Payslips</h2>
          <div className="space-y-4">
            {recentPayslips.map((slip, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.8rem] hover:bg-slate-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <FileText className="text-slate-400" size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">{slip.month}</h3>
                    <p className="text-sm text-slate-500 font-medium">Net: ₹{(slip.net / 1000).toFixed(0)}K | {slip.status}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm hover:scale-110 transition-transform">
                  <Download size={18} className="text-indigo-600" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Reimbursements */}
      <Card className="border-none shadow-xl rounded-[2.5rem] bg-indigo-50/50 p-8 border border-white">
        <h2 className="text-xl font-black text-slate-900 mb-6 font-display">Reimbursement Claims</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reimbursements.map((claim) => (
            <motion.div key={claim.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="border-none shadow-md rounded-[2rem] bg-white p-6 relative group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                      <Receipt className="text-indigo-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900">{claim.type} Claim</h3>
                      <p className="text-sm text-slate-500 font-medium">{new Date(claim.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={`${claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} border-none font-bold`}>
                      {claim.status}
                    </Badge>
                    {claim.status === 'Pending' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleCancelClaim(claim.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Amount Claimed</p>
                  <p className="font-black text-2xl text-slate-900">₹{claim.amount.toLocaleString()}</p>
                </div>
                <p className="mt-3 text-sm text-slate-500 italic">"{claim.description}"</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MyFinancesPage;
