"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Download,
    Eye,
    FileText,
    TrendingUp,
    Calendar,
    CheckCircle2,
    Receipt,
    CreditCard,
    PiggyBank,
    AlertCircle,
    MoreVertical,
    Mail,
    Send,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { useToast } from "@/shared/components/ui/use-toast";

const payslips = [
    { id: 1, month: "March 2026", payDate: "2026-03-31", gross: 125000, deductions: 22500, net: 102500, status: "Paid", tax: 12000 },
    { id: 2, month: "February 2026", payDate: "2026-02-28", gross: 125000, deductions: 22500, net: 102500, status: "Paid", tax: 12000 },
    { id: 3, month: "January 2026", payDate: "2026-01-31", gross: 125000, deductions: 22500, net: 102500, status: "Paid", tax: 12000 },
    { id: 4, month: "December 2025", payDate: "2025-12-31", gross: 120000, deductions: 21000, net: 99000, status: "Paid", tax: 11000 },
    { id: 5, month: "November 2025", payDate: "2025-11-30", gross: 120000, deductions: 21000, net: 99000, status: "Paid", tax: 11000 },
    { id: 6, month: "October 2025", payDate: "2025-10-31", gross: 120000, deductions: 21000, net: 99000, status: "Paid", tax: 11000 },
];

const breakup = [
    { label: "Basic Salary", amount: 62500, type: "earning" },
    { label: "HRA", amount: 25000, type: "earning" },
    { label: "Special Allowance", amount: 30000, type: "earning" },
    { label: "Performance Bonus", amount: 7500, type: "earning" },
    { label: "Provident Fund", amount: 7500, type: "deduction" },
    { label: "Professional Tax", amount: 200, type: "deduction" },
    { label: "Income Tax (TDS)", amount: 12000, type: "deduction" },
    { label: "Health Insurance", amount: 2800, type: "deduction" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function MyPayslipsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [selected, setSelected] = useState<any>(null);
    const [correctionOpen, setCorrectionOpen] = useState<any>(null);
    const [correctionText, setCorrectionText] = useState("");
    const [emailOpen, setEmailOpen] = useState<any>(null);

    const ytdGross = payslips.reduce((a, p) => a + p.gross, 0);
    const ytdNet = payslips.reduce((a, p) => a + p.net, 0);
    const ytdTax = payslips.reduce((a, p) => a + p.tax, 0);

    const handleDownload = (month: string) => {
        toast({ title: "Download started", description: `Payslip for ${month} is being downloaded as PDF.` });
    };

    const handleForm16 = () => {
        toast({ title: "Form 16 requested", description: "Your Form 16 will be emailed within 24 hours." });
    };

    const submitCorrection = () => {
        if (!correctionText.trim()) {
            toast({ title: "Describe the issue", description: "Please provide details about the correction needed.", variant: "destructive" });
            return;
        }
        toast({ title: "Correction request raised", description: `A ticket has been created for ${correctionOpen.month}. Redirecting to Helpdesk...` });
        setCorrectionOpen(null);
        setCorrectionText("");
        setTimeout(() => router.push("/hrmcubicle/me/helpdesk"), 800);
    };

    const sendEmail = () => {
        toast({ title: "Email sent", description: `Payslip for ${emailOpen.month} emailed to your registered address.` });
        setEmailOpen(null);
    };

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 font-sans" style={{ zoom: "80%" }}>
            <div className="mx-auto space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Payslips</h1>
                        <p className="text-sm text-slate-500 mt-1">Monthly salary slips and earnings history</p>
                    </div>
                    <Button onClick={handleForm16} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100">
                        <Download size={16} className="mr-2" /> Download Form 16
                    </Button>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "YTD Gross", value: inr(ytdGross), icon: TrendingUp, color: "indigo" },
                        { label: "YTD Net Pay", value: inr(ytdNet), icon: PiggyBank, color: "emerald" },
                        { label: "Tax Paid", value: inr(ytdTax), icon: Receipt, color: "amber" },
                        { label: "Payslips", value: payslips.length.toString(), icon: FileText, color: "blue" },
                    ].map((s, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl bg-${s.color}-50 flex items-center justify-center`}>
                                        <s.icon className={`text-${s.color}-600`} size={22} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                        <p className="text-lg font-bold text-slate-900 truncate">{s.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <Card className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg">Recent Payslips</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {payslips.map(p => (
                                    <div key={p.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                                                <Calendar className="text-indigo-600" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{p.month}</p>
                                                <p className="text-xs text-slate-500">Paid on {new Date(p.payDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-900">{inr(p.net)}</p>
                                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                                                    <CheckCircle2 size={10} className="mr-1" /> {p.status}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button size="sm" variant="ghost" onClick={() => setSelected(p)} className="h-9 w-9 rounded-lg" title="View details">
                                                    <Eye size={15} />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleDownload(p.month)} className="h-9 w-9 rounded-lg" title="Download PDF">
                                                    <Download size={15} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="sm" variant="ghost" className="h-9 w-9 rounded-lg"><MoreVertical size={15} /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuItem onClick={() => setEmailOpen(p)}><Mail size={13} className="mr-2" />Email Payslip</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setCorrectionOpen(p)}><AlertCircle size={13} className="mr-2" />Request Correction</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl text-white shadow-xl shadow-indigo-300/30 border-none">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <CreditCard size={20} />
                                <h3 className="font-bold text-lg">Current Month</h3>
                            </div>
                            <div>
                                <p className="text-xs text-indigo-200">Net Pay (March 2026)</p>
                                <p className="text-3xl font-bold mt-1">{inr(payslips[0].net)}</p>
                            </div>
                            <div className="space-y-2 pt-3 border-t border-indigo-400/30">
                                <div className="flex justify-between text-sm">
                                    <span className="text-indigo-200">Gross</span>
                                    <span className="font-semibold">{inr(payslips[0].gross)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-indigo-200">Deductions</span>
                                    <span className="font-semibold">- {inr(payslips[0].deductions)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-indigo-200">Tax (TDS)</span>
                                    <span className="font-semibold">- {inr(payslips[0].tax)}</span>
                                </div>
                            </div>
                            <Button onClick={() => setSelected(payslips[0])} className="w-full bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl h-11 font-bold mt-2">
                                View Full Breakup
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={!!selected} onOpenChange={v => !v && setSelected(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <FileText className="text-indigo-600" size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold">{selected?.month} Payslip</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div>
                            <p className="text-xs font-bold text-emerald-600 uppercase mb-2">Earnings</p>
                            {breakup.filter(b => b.type === "earning").map((b, i) => (
                                <div key={i} className="flex justify-between py-1.5 text-sm">
                                    <span className="text-slate-600">{b.label}</span>
                                    <span className="font-semibold text-slate-900">{inr(b.amount)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-3">
                            <p className="text-xs font-bold text-rose-600 uppercase mb-2">Deductions</p>
                            {breakup.filter(b => b.type === "deduction").map((b, i) => (
                                <div key={i} className="flex justify-between py-1.5 text-sm">
                                    <span className="text-slate-600">{b.label}</span>
                                    <span className="font-semibold text-slate-900">- {inr(b.amount)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-between">
                            <span className="font-bold text-indigo-900">Net Pay</span>
                            <span className="text-xl font-bold text-indigo-700">{inr(selected?.net || 0)}</span>
                        </div>
                        <Button onClick={() => selected && handleDownload(selected.month)} className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 font-bold">
                            <Download size={15} className="mr-2" /> Download PDF
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={!!correctionOpen} onOpenChange={v => !v && setCorrectionOpen(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-lg">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                            <AlertCircle className="text-amber-600" size={24} />
                        </div>
                        <DialogTitle className="text-2xl font-bold">Request Correction</DialogTitle>
                        <DialogDescription>
                            Payslip: <strong>{correctionOpen?.month}</strong> · This will raise a ticket with the Payroll team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div>
                            <Label className="text-xs font-semibold">What needs correction?</Label>
                            <Textarea rows={5} value={correctionText} onChange={e => setCorrectionText(e.target.value)} placeholder="Describe the issue (e.g., LTA reimbursement is missing, PF deduction is incorrect, bonus not reflected...)" className="mt-1" />
                        </div>
                        <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600">
                            A ticket will be auto-created in Helpdesk with category "Payroll" and high priority. You'll get updates via email.
                        </div>
                    </div>
                    <DialogFooter className="gap-3 mt-4">
                        <Button variant="ghost" onClick={() => { setCorrectionOpen(null); setCorrectionText(""); }}>Cancel</Button>
                        <Button onClick={submitCorrection} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl">
                            <Send size={14} className="mr-2" /> Raise Ticket
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!emailOpen} onOpenChange={v => !v && setEmailOpen(null)}>
                <DialogContent className="bg-white rounded-2xl border-none p-8 max-w-md">
                    <DialogHeader className="space-y-3">
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <Mail className="text-indigo-600" size={24} />
                        </div>
                        <DialogTitle className="text-xl font-bold">Email Payslip</DialogTitle>
                        <DialogDescription>
                            Send payslip for <strong>{emailOpen?.month}</strong> to your registered email address.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 mt-2">
                        <Button variant="ghost" onClick={() => setEmailOpen(null)}>Cancel</Button>
                        <Button onClick={sendEmail} className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                            <Send size={14} className="mr-2" /> Send Email
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
