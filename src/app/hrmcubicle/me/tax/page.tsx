"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    TrendingDown,
    Shield,
    Home,
    Heart,
    Baby,
    GraduationCap,
    Plus,
    Download,
    AlertCircle,
    CheckCircle2,
    Upload,
    Trash2,
    Edit3,
    Paperclip,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useToast } from "@/shared/components/ui/use-toast";

type Investment = {
    id: number;
    sectionId: string;
    type: string;
    amount: number;
    proof: string | null;
    date: string;
};

const sectionMeta = [
    { id: "80C", name: "Section 80C", desc: "PPF, ELSS, LIC, Tuition Fee, Home Loan Principal", limit: 150000, icon: Shield, color: "indigo", types: ["PPF", "ELSS Mutual Fund", "LIC Premium", "Tuition Fee", "Home Loan Principal", "NSC", "Sukanya Samriddhi"] },
    { id: "80D", name: "Section 80D", desc: "Health Insurance Premium (Self + Parents)", limit: 75000, icon: Heart, color: "rose", types: ["Self & Family Insurance", "Parents Insurance (< 60)", "Parents Insurance (60+)", "Preventive Health Check"] },
    { id: "HRA", name: "HRA Exemption", desc: "House Rent Allowance (rent receipts required)", limit: 240000, icon: Home, color: "emerald", types: ["Monthly Rent", "Annual Rent Paid"] },
    { id: "80E", name: "Section 80E", desc: "Interest on Education Loan", limit: 200000, icon: GraduationCap, color: "blue", types: ["Education Loan Interest"] },
    { id: "80CCD", name: "Section 80CCD(1B)", desc: "NPS Additional Contribution", limit: 50000, icon: TrendingDown, color: "amber", types: ["NPS Tier 1 Contribution"] },
    { id: "80DD", name: "Section 80DD", desc: "Dependent with Disability", limit: 125000, icon: Baby, color: "violet", types: ["Disability Maintenance", "Severe Disability Maintenance"] },
];

const initialInvestments: Investment[] = [
    { id: 1, sectionId: "80C", type: "PPF", amount: 50000, proof: "ppf_receipt.pdf", date: "2026-03-15" },
    { id: 2, sectionId: "80C", type: "ELSS Mutual Fund", amount: 55000, proof: "elss_statement.pdf", date: "2026-02-20" },
    { id: 3, sectionId: "80D", type: "Self & Family Insurance", amount: 25000, proof: "insurance.pdf", date: "2026-04-01" },
    { id: 4, sectionId: "80D", type: "Parents Insurance (60+)", amount: 10000, proof: null, date: "2026-04-01" },
    { id: 5, sectionId: "HRA", type: "Annual Rent Paid", amount: 180000, proof: "rent_receipts.pdf", date: "2026-03-31" },
    { id: 6, sectionId: "80CCD", type: "NPS Tier 1 Contribution", amount: 25000, proof: "nps_statement.pdf", date: "2026-03-10" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } };
const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function MyTaxPage() {
    const { toast } = useToast();
    const [regime, setRegime] = useState<"old" | "new">("old");
    const [investments, setInvestments] = useState<Investment[]>(initialInvestments);
    const [addOpen, setAddOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [editing, setEditing] = useState<Investment | null>(null);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [form, setForm] = useState({ type: "", amount: "", proof: "" });

    const sectionsWithTotal = useMemo(() => {
        return sectionMeta.map(s => {
            const secInv = investments.filter(i => i.sectionId === s.id);
            const declared = Math.min(s.limit, secInv.reduce((a, i) => a + i.amount, 0));
            return { ...s, declared, investments: secInv };
        });
    }, [investments]);

    const totalDeclared = sectionsWithTotal.reduce((a, s) => a + s.declared, 0);
    const totalLimit = sectionsWithTotal.reduce((a, s) => a + s.limit, 0);
    const taxRate = regime === "old" ? 0.30 : 0.20;
    const taxSaved = Math.round(totalDeclared * taxRate);
    const newRegimeOnly = new Set(["80CCD"]);
    const deadline = "2026-06-30";

    const openAdd = (sectionId: string) => {
        const s = sectionMeta.find(x => x.id === sectionId);
        setActiveSection(sectionId);
        setEditing(null);
        setForm({ type: s?.types[0] || "", amount: "", proof: "" });
        setAddOpen(true);
    };

    const openEdit = (inv: Investment) => {
        setActiveSection(inv.sectionId);
        setEditing(inv);
        setForm({ type: inv.type, amount: String(inv.amount), proof: inv.proof || "" });
        setAddOpen(true);
    };

    const saveInvestment = () => {
        if (!form.type) {
            toast({ title: "Select type", description: "Please pick an investment type.", variant: "destructive" });
            return;
        }
        const amt = Number(form.amount);
        if (!form.amount || Number.isNaN(amt) || amt <= 0) {
            toast({ title: "Invalid amount", description: "Amount must be greater than ₹0.", variant: "destructive" });
            return;
        }
        // Section limit check (sum of existing + new must not exceed section limit)
        const sectionMetaEntry = sectionMeta.find(s => s.id === activeSection);
        if (sectionMetaEntry) {
            const others = investments.filter(i => i.sectionId === activeSection && (!editing || i.id !== editing.id));
            const newTotal = others.reduce((a, i) => a + i.amount, 0) + amt;
            if (newTotal > sectionMetaEntry.limit) {
                const remaining = sectionMetaEntry.limit - others.reduce((a, i) => a + i.amount, 0);
                toast({
                    title: "Exceeds section limit",
                    description: `${sectionMetaEntry.name} limit is ₹${sectionMetaEntry.limit.toLocaleString("en-IN")}. You can add at most ₹${remaining.toLocaleString("en-IN")} more.`,
                    variant: "destructive"
                });
                return;
            }
            // Duplicate type check (only for create)
            if (!editing && others.some(i => i.type === form.type)) {
                toast({
                    title: "Duplicate investment",
                    description: `${form.type} already exists in ${sectionMetaEntry.name}. Edit the existing entry instead.`,
                    variant: "destructive"
                });
                return;
            }
        }
        // Proof file extension check
        if (form.proof) {
            const ext = form.proof.split(".").pop()?.toLowerCase();
            if (ext && !["pdf", "jpg", "jpeg", "png"].includes(ext)) {
                toast({ title: "Invalid proof file", description: "Only PDF, JPG, or PNG files are accepted.", variant: "destructive" });
                return;
            }
        }
        if (editing) {
            setInvestments(investments.map(i => i.id === editing.id ? { ...i, type: form.type, amount: Number(form.amount), proof: form.proof || null } : i));
            toast({ title: "Investment updated", description: `${form.type} updated successfully.` });
        } else {
            const newInv: Investment = {
                id: Math.max(0, ...investments.map(i => i.id)) + 1,
                sectionId: activeSection!,
                type: form.type,
                amount: Number(form.amount),
                proof: form.proof || null,
                date: new Date().toISOString().split("T")[0],
            };
            setInvestments([...investments, newInv]);
            toast({ title: "Investment added", description: `${form.type} of ${inr(Number(form.amount))} recorded.` });
        }
        setAddOpen(false);
        setEditing(null);
        setActiveSection(null);
        setForm({ type: "", amount: "", proof: "" });
    };

    const deleteInvestment = (id: number) => {
        const inv = investments.find(i => i.id === id);
        setInvestments(investments.filter(i => i.id !== id));
        toast({ title: "Investment removed", description: `${inv?.type} has been deleted.` });
    };

    const handleProofsUpload = () => {
        toast({ title: "Proofs uploaded", description: "Your proof documents are now under review." });
        setUploadOpen(false);
    };

    const handleForm16 = () => {
        toast({ title: "Form 16 download started", description: "PDF will be emailed and downloaded shortly." });
    };

    const activeSectionMeta = sectionMeta.find(s => s.id === activeSection);

    return (
        <div className="flex-1 min-h-screen bg-[#f8fafc] p-6 space-y-6 font-sans" style={{ zoom: "80%" }}>
            <div className="mx-auto space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Tax Declarations</h1>
                        <p className="text-sm text-slate-500 mt-1">FY 2025-26 · Income Tax Declarations & Investment Proofs</p>
                    </div>
                    <Button onClick={handleForm16} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-indigo-100">
                        <Download size={16} className="mr-2" /> Download Form 16
                    </Button>
                </div>

                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                    <CardContent className="p-5 flex items-center gap-4 flex-wrap">
                        <AlertCircle className="text-amber-600 shrink-0" size={22} />
                        <div className="flex-1 min-w-[200px]">
                            <p className="text-sm font-bold text-amber-900">Proof submission deadline: {new Date(deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                            <p className="text-xs text-amber-700 mt-0.5">Submit investment proofs to avoid extra TDS deduction in final payslip.</p>
                        </div>
                        <Button onClick={() => setUploadOpen(true)} variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 rounded-lg">
                            <Upload size={14} className="mr-2" /> Upload Proofs
                        </Button>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <Card className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl text-white shadow-xl shadow-indigo-300/30 border-none">
                        <CardContent className="p-6 space-y-4">
                            <p className="text-xs font-semibold text-indigo-200 uppercase">Tax Regime</p>
                            <div className="flex gap-2">
                                <Button onClick={() => setRegime("old")} className={regime === "old" ? "flex-1 bg-white text-indigo-700 hover:bg-indigo-50 rounded-lg font-bold" : "flex-1 bg-indigo-500/30 text-white hover:bg-indigo-500/50 rounded-lg"}>Old</Button>
                                <Button onClick={() => setRegime("new")} className={regime === "new" ? "flex-1 bg-white text-indigo-700 hover:bg-indigo-50 rounded-lg font-bold" : "flex-1 bg-indigo-500/30 text-white hover:bg-indigo-500/50 rounded-lg"}>New</Button>
                            </div>
                            <p className="text-[11px] text-indigo-200 leading-relaxed">
                                {regime === "old" ? "Claim 80C, 80D, HRA, and more. Higher slab rate with deductions." : "Lower slab rate. Limited deductions — only NPS (80CCD) and standard deduction apply."}
                            </p>
                            <div className="border-t border-indigo-400/30 pt-4 space-y-3">
                                <div>
                                    <p className="text-xs text-indigo-200">Total Declared</p>
                                    <p className="text-2xl font-bold">{inr(totalDeclared)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-200">Estimated Tax Saved ({Math.round(taxRate * 100)}% slab)</p>
                                    <p className="text-2xl font-bold text-emerald-300">{inr(taxSaved)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-200">Max Claimable Remaining</p>
                                    <p className="text-lg font-semibold">{inr(Math.max(0, totalLimit - totalDeclared))}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg">Declaration Sections</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                                {sectionsWithTotal.map(s => {
                                    const pct = s.limit > 0 ? Math.min(100, (s.declared / s.limit) * 100) : 0;
                                    const disabled = regime === "new" && !newRegimeOnly.has(s.id);
                                    return (
                                        <motion.div key={s.id} variants={itemVariants}>
                                            <div className={`p-4 rounded-2xl border border-slate-100 transition-all ${disabled ? "opacity-50" : "hover:border-indigo-200 hover:shadow-md"}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className={`h-10 w-10 rounded-xl bg-${s.color}-50 flex items-center justify-center shrink-0`}>
                                                        <s.icon className={`text-${s.color}-600`} size={18} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                                                            <p className="font-semibold text-slate-900">{s.name}</p>
                                                            {disabled ? (
                                                                <Badge className="bg-slate-100 text-slate-500 border-none text-[10px]">Not available in New Regime</Badge>
                                                            ) : s.declared > 0 ? (
                                                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"><CheckCircle2 size={10} className="mr-1" />Declared</Badge>
                                                            ) : (
                                                                <Badge className="bg-slate-100 text-slate-600 border-none text-[10px]">Not Started</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-slate-500 mb-3">{s.desc}</p>
                                                        <div className="flex items-center justify-between text-xs mb-1.5">
                                                            <span className="text-slate-500">Declared: <span className="font-bold text-slate-900">{inr(s.declared)}</span></span>
                                                            <span className="text-slate-500">Limit: <span className="font-bold text-slate-900">{inr(s.limit)}</span></span>
                                                        </div>
                                                        <Progress value={pct} className="h-1.5" />

                                                        {s.investments.length > 0 && (
                                                            <div className="mt-3 space-y-1.5">
                                                                {s.investments.map(inv => (
                                                                    <div key={inv.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                            <span className="text-xs font-medium text-slate-900 truncate">{inv.type}</span>
                                                                            {inv.proof ? (
                                                                                <Paperclip size={10} className="text-emerald-600 shrink-0" />
                                                                            ) : (
                                                                                <AlertCircle size={10} className="text-amber-500 shrink-0" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-xs font-bold text-slate-900 mr-1">{inr(inv.amount)}</span>
                                                                            <Button disabled={disabled} size="sm" variant="ghost" onClick={() => openEdit(inv)} className="h-6 w-6 p-0 text-slate-500 hover:text-indigo-600">
                                                                                <Edit3 size={11} />
                                                                            </Button>
                                                                            <Button disabled={disabled} size="sm" variant="ghost" onClick={() => deleteInvestment(inv.id)} className="h-6 w-6 p-0 text-slate-500 hover:text-rose-600">
                                                                                <Trash2 size={11} />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="flex gap-2 mt-3">
                                                            <Button disabled={disabled} size="sm" variant="outline" onClick={() => openAdd(s.id)} className="h-8 text-xs rounded-lg"><Plus size={12} className="mr-1" />Add Investment</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <SideFormSheet
                open={addOpen}
                onOpenChange={setAddOpen}
                title={editing ? "Edit Investment" : `Add Investment — ${activeSectionMeta?.name || ""}`}
                description={activeSectionMeta?.desc}
                icon={editing ? <Edit3 size={20} /> : <Plus size={20} />}
                accentColor="#4f46e5"
                width="md"
                submitLabel={editing ? "Save Changes" : "Add Investment"}
                onSubmit={(e) => { e.preventDefault(); saveInvestment(); }}
            >
                <div className="space-y-4">
                    <Field label="Investment Type">
                        <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {activeSectionMeta?.types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Amount (₹)" required hint={activeSectionMeta ? `Section limit: ${inr(activeSectionMeta.limit)}` : undefined}>
                        <Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0" />
                    </Field>
                    <Field label="Proof Document (file name)" hint="Leave blank to upload later.">
                        <Input value={form.proof} onChange={e => setForm({ ...form, proof: e.target.value })} placeholder="e.g., ppf_receipt.pdf" />
                    </Field>
                </div>
            </SideFormSheet>

            <SideFormSheet
                open={uploadOpen}
                onOpenChange={setUploadOpen}
                title="Upload Proof Documents"
                description="Upload proofs for your declared investments before the deadline."
                icon={<Upload size={20} />}
                accentColor="#d97706"
                width="md"
                submitLabel="Upload & Submit"
                onSubmit={(e) => { e.preventDefault(); handleProofsUpload(); }}
            >
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-amber-300 transition-all">
                        <Upload className="mx-auto text-slate-400" size={28} />
                        <p className="text-sm font-semibold text-slate-700 mt-2">Drop files here or click to browse</p>
                        <p className="text-xs text-slate-500 mt-1">Accepted: PDF, JPG, PNG · Max 10 MB per file</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-xs text-amber-800">
                            <strong>Missing proofs:</strong> {investments.filter(i => !i.proof).length} investment(s) without documents
                        </p>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
