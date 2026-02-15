"use client"

import React from "react";
import {
  IndianRupee,
  CreditCard,
  ShieldCheck,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Download,
  Building2,
  User,
  CheckCircle2,
  Activity,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useToast } from "@/shared/components/ui/use-toast";
import { motion } from "framer-motion";

const PayrollSummaryPage = () => {
  const { toast } = useToast();

  const bankDetails = [
    { label: "Bank Name", val: "Bank of Baroda" },
    { label: "Account Number", val: "29118100005864" },
    { label: "IFSC Code", val: "BARB0MALJAI" },
    { label: "Account Name", val: "Pooja Harplani" },
  ];

  const identityDetails = [
    { label: "PAN Number", val: "XXXXXX992Q" },
    { label: "Name on PAN", val: "Pooja Harplani" },
    { label: "Date of Birth", val: "19 Aug 2004" },
    { label: "Status", val: "Verified" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] font-sans">
      {/* Header */}
      <div className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-[#CB9DF0]/20 rounded-xl flex items-center justify-center text-[#CB9DF0]">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight text-start">Fiscal Identity</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-start">KYC & Disbursement Summary</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => toast({ title: "Update Request Sent" })} className="h-10 border-slate-200 rounded-lg font-bold text-xs gap-2 px-4 shadow-sm hover:bg-slate-50">
            Request Update
          </Button>
          <Button className="bg-[#CB9DF0] hover:bg-[#b088e0] text-white rounded-lg h-10 px-6 font-bold text-xs shadow-sm border-none">
            <Download size={14} className="mr-2" /> Export Summary
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
          {/* Primary Status Card */}
          <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl overflow-hidden relative group">
            <div className="p-10 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4 text-start">
                <Badge className="bg-[#CB9DF0] text-white border-none font-black text-[10px] uppercase tracking-widest px-4 py-1">Active Payroll Cycle</Badge>
                <h2 className="text-4xl font-black tracking-tighter text-start text-white leading-none">August 2025 Summary</h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] text-start">01 Aug - 31 Aug • Regular Disbursement</p>

                <div className="flex gap-10 pt-4">
                  <div className="text-start">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-start">Working Days</p>
                    <p className="text-2xl font-black text-white text-start">22 / 22</p>
                  </div>
                  <div className="text-start">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-start">Loss of Pay</p>
                    <p className="text-2xl font-black text-rose-500 text-start">0</p>
                  </div>
                  <div className="text-start">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 text-start">Status</p>
                    <p className="text-2xl font-black text-emerald-400 text-start uppercase">Processed</p>
                  </div>
                </div>
              </div>
              <Button className="bg-white text-slate-900 font-black text-sm px-10 py-8 rounded-[1.5rem] hover:bg-[#CB9DF0] hover:text-white transition-all shadow-xl group/btn">
                VIEW LATEST PAYSLIP <ArrowUpRight size={20} className="ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Button>
            </div>
            <Activity size={240} className="absolute -right-16 -bottom-16 text-white opacity-[0.03] group-hover:scale-110 transition-transform" />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Disbursement Matrix */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden text-start">
              <CardHeader className="p-8 border-b border-slate-50 text-start">
                <div className="flex items-center gap-4 text-start">
                  <div className="h-10 w-10 bg-[#F0C1E1]/20 rounded-xl flex items-center justify-center text-[#F0C1E1]">
                    <Building2 size={20} />
                  </div>
                  <div className="text-start">
                    <CardTitle className="text-lg font-bold text-slate-900 tracking-tight text-start">Disbursement Node</CardTitle>
                    <CardDescription className="text-xs font-semibold text-slate-400 uppercase tracking-[0.1em] text-start">Primary Bank Mapping</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 text-start">
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group">
                    <div className="text-start">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-start leading-none">Payment Mode</p>
                      <p className="text-base font-black text-slate-900 text-start leading-none">Electronic Transfer (NEFT/IMPS)</p>
                    </div>
                    <CreditCard size={20} className="text-slate-300 group-hover:text-[#CB9DF0] transition-colors" />
                  </div>

                  <div className="grid grid-cols-1 gap-y-4">
                    {bankDetails.map((detail, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-none text-start">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-start">{detail.label}</span>
                        <span className="text-sm font-black text-slate-800 text-end">{detail.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statutory Identity */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden text-start">
              <CardHeader className="p-8 border-b border-slate-50 text-start">
                <div className="flex items-center gap-4 text-start">
                  <div className="h-10 w-10 bg-[#FDDBBB]/30 rounded-xl flex items-center justify-center text-[#e6b48a]">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="text-start">
                    <CardTitle className="text-lg font-bold text-slate-900 tracking-tight text-start text-nowrap">Regulatory Profile</CardTitle>
                    <CardDescription className="text-xs font-semibold text-slate-400 uppercase tracking-[0.1em] text-start">Statutory & ID Verification</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 text-start">
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-[#CB9DF0]/5 border border-[#CB9DF0]/20 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-start">
                      <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 size={16} />
                      </div>
                      <div className="text-start">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-start leading-none">Authentication</p>
                        <p className="text-base font-black text-emerald-600 text-start leading-none italic uppercase">Verified Identity</p>
                      </div>
                    </div>
                    <Badge className="bg-white border-none text-[8px] font-black text-emerald-500 shadow-sm px-3 py-1">TRUST SCORE: 100</Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-y-4">
                    {identityDetails.map((detail, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-none text-start">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-start">{detail.label}</span>
                        <span className={`text-sm font-black text-slate-800 text-end ${detail.val === 'Verified' ? 'text-emerald-500 italic' : ''}`}>
                          {detail.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex gap-3 text-start">
                    <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white transition-all">
                      <FileText size={18} className="text-slate-300 mb-2 group-hover:text-[#F0C1E1]" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aadhar Disk</span>
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white transition-all">
                      <Download size={18} className="text-slate-300 mb-2 group-hover:text-[#CB9DF0]" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Form 12BB</span>
                    </div>
                    <div className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white transition-all text-start">
                      <Lock size={18} className="text-slate-300 mb-2 group-hover:text-[#FDDBBB]" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Archive Vault</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Alert */}
          <div className="p-6 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-start gap-4">
            <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
              <IndianRupee size={20} />
            </div>
            <div className="text-start">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight text-start leading-none mb-1">Fiscal Disclaimer</h4>
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed text-start italic">All salary disbursements are mapped to the primary bank account only. Any changes requested after the 25th of the current month will be applicable from the next billing cycle. Documentation is encrypted at rest.</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PayrollSummaryPage;
