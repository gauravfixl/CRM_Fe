"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import {
    FileText,
    MoreHorizontal,
    Search,
    Plus,
    Calendar,
    DollarSign,
    CheckCircle2,
    XCircle,
    Send,
    Download,
    Trash2,
    Calculator,
    ShieldCheck,
    Clock
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { useToast } from "@/shared/components/ui/use-toast";
import { useHireStore, type Offer } from "@/shared/data/hire-store";
import { Card } from "@/shared/components/ui/card";

const OfferLettersPage = () => {
    const { offers, addOffer, updateOffer, deleteOffer, submitOfferForApproval } = useHireStore();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    // Enhanced Form
    const [offerForm, setOfferForm] = useState({
        candidateName: "",
        role: "",
        department: "Engineering",
        ctc: "",
        joiningDate: "",
        expiryDate: "",
        templateId: "standard_ft",
        // Breakdown (calculated or manual)
        basic: "",
        hra: "",
        allowances: ""
    });

    const resetForm = () => {
        setOfferForm({
            candidateName: "",
            role: "",
            department: "Engineering",
            ctc: "",
            joiningDate: "",
            expiryDate: "",
            templateId: "standard_ft",
            basic: "",
            hra: "",
            allowances: ""
        });
        setEditingId(null);
    };

    // Auto-calculate breakdown when CTC changes
    const handleCtcChange = (val: string) => {
        const ctc = parseFloat(val);
        if (!isNaN(ctc)) {
            setOfferForm(prev => ({
                ...prev,
                ctc: val,
                basic: (ctc * 0.4).toFixed(0),
                hra: (ctc * 0.2).toFixed(0),
                allowances: (ctc * 0.4).toFixed(0)
            }));
        } else {
            setOfferForm(prev => ({ ...prev, ctc: val }));
        }
    };

    const handleSaveOffer = () => {
        if (!offerForm.candidateName || !offerForm.role || !offerForm.ctc) {
            toast({ title: "Validation Error", description: "Required fields missing.", variant: "destructive" });
            return;
        }

        const offerData: any = {
            candidateName: offerForm.candidateName,
            role: offerForm.role,
            department: offerForm.department,
            ctc: `₹ ${offerForm.ctc}`,
            joiningDate: offerForm.joiningDate,
            expiryDate: offerForm.expiryDate,
            templateId: offerForm.templateId,
            totalCtc: parseFloat(offerForm.ctc),
            salaryBreakdown: [
                { component: "Basic Salary", amount: parseFloat(offerForm.basic) },
                { component: "HRA", amount: parseFloat(offerForm.hra) },
                { component: "Special Allowances", amount: parseFloat(offerForm.allowances) }
            ]
        };

        if (editingId) {
            updateOffer(editingId, offerData);
            toast({ title: "Offer Updated", description: "Offer details updated." });
        } else {
            addOffer(offerData);
            toast({ title: "Draft Created", description: "Offer letter draft created successfully." });
        }
        setIsCreateOpen(false);
        resetForm();
    };

    const handleEdit = (offer: Offer) => {
        // Need to reverse-map store data to form. Simple version here.
        setOfferForm({
            candidateName: offer.candidateName,
            role: offer.role,
            department: offer.department,
            ctc: offer.ctc.replace(/[^0-9.]/g, ''),
            joiningDate: offer.joiningDate,
            expiryDate: offer.expiryDate || "",
            templateId: offer.templateId || "standard_ft",
            basic: offer.salaryBreakdown?.[0]?.amount.toString() || "",
            hra: offer.salaryBreakdown?.[1]?.amount.toString() || "",
            allowances: offer.salaryBreakdown?.[2]?.amount.toString() || ""
        });
        setEditingId(offer.id);
        setIsCreateOpen(true);
    };

    const handleSubmitApproval = (id: string) => {
        submitOfferForApproval(id);
        toast({ title: "Submitted", description: "Offer submitted for management approval.", className: "bg-emerald-50 text-emerald-800 border-emerald-200" });
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this offer letter?")) {
            deleteOffer(id);
            toast({ title: "Deleted", description: "Offer removed.", variant: "destructive" });
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            'Draft': 'bg-slate-100 text-slate-600',
            'Pending Approval': 'bg-amber-50 text-amber-700 animate-pulse border-amber-200',
            'Approved': 'bg-blue-50 text-blue-700 border-blue-200',
            'Sent': 'bg-purple-50 text-purple-700 border-purple-200',
            'Accepted': 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'Declined': 'bg-red-50 text-red-700 border-red-200',
            'Rejected': 'bg-red-50 text-red-700 border-red-200'
        };
        const icons: Record<string, React.ReactNode> = {
            'Pending Approval': <Clock className="h-3 w-3 mr-1" />,
            'Approved': <ShieldCheck className="h-3 w-3 mr-1" />,
            'Accepted': <CheckCircle2 className="h-3 w-3 mr-1" />
        };
        return (
            <Badge variant="outline" className={`${styles[status] || styles['Draft']} border font-bold px-2 py-1 rounded-lg flex items-center w-fit`}>
                {icons[status]}{status}
            </Badge>
        );
    };

    // Unified filtering for Tabs + Search
    const filteredOffers = offers.filter(o => {
        const status = (o.approvalStatus || o.status || "Draft").toLowerCase().replace(' ', '_');
        const matchesTab = activeTab === "all" || status === activeTab;

        const query = searchQuery.toLowerCase();
        const matchesSearch = o.candidateName.toLowerCase().includes(query) || o.role.toLowerCase().includes(query);

        return matchesTab && matchesSearch;
    });

    return (
        <div className="flex-1 space-y-4 p-4 min-h-screen flex flex-col bg-[#fcfdff] overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Offer Management</h1>
                    <p className="text-slate-500 font-bold text-[10px] mt-0.5">Construct offers, manage compensation, and track acceptances.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsCreateOpen(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-8 px-4 shadow-lg shadow-indigo-50 font-bold text-[10px] border-none transition-all hover:scale-105"
                >
                    <Plus className="mr-2 h-3.5 w-3.5" /> Generate Offer
                </Button>
            </div>

            {/* Content Tabs */}
            <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden flex flex-col ring-1 ring-slate-100">
                <Tabs defaultValue="all" onValueChange={setActiveTab} className="flex flex-col h-full">
                    <div className="px-6 pt-4 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-0">
                        <TabsList className="bg-slate-50/80 p-1 rounded-xl h-10 w-full sm:w-auto">
                            {['all', 'draft', 'pending_approval', 'sent', 'accepted'].map(tab => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="rounded-lg px-4 h-8 font-bold capitalize text-slate-500 text-[10px] data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
                                >
                                    {tab.replace('_', ' ')}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="relative w-full sm:w-60 mb-3 sm:mb-0">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300" />
                            <Input
                                placeholder="Search candidates or roles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 rounded-lg border-none bg-slate-50 h-8 font-bold text-[10px] text-slate-600 focus-visible:ring-2 focus-visible:ring-indigo-100 placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    <TabsContent value={activeTab} className="m-0 flex-1 overflow-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-slate-50/30 sticky top-0 z-10 backdrop-blur-sm">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest pl-6 h-10">Candidate</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10">Role Details</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10">Compensation (CTC)</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10">Timeline</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10">Status</TableHead>
                                    <TableHead className="font-bold text-slate-300 text-[9px] uppercase tracking-widest h-10 pr-6 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOffers.length > 0 ? (
                                    filteredOffers.map((offer) => (
                                        <TableRow key={offer.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                            <TableCell className="pl-6 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                                                        <FileText className="h-4 w-4" />
                                                    </div>
                                                    <span className="font-bold text-slate-900 text-xs">{offer.candidateName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700 text-xs">{offer.role}</span>
                                                    <span className="text-[9px] text-slate-300 font-bold uppercase tracking-wider">{offer.department}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex items-center gap-1 font-bold text-slate-900 text-xs">
                                                    <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                                                    {offer.ctc}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" /> {offer.joiningDate || "TBD"}
                                                    </span>
                                                    {offer.expiryDate && (
                                                        <span className="text-[9px] font-bold text-red-300">Exp: {offer.expiryDate}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <StatusBadge status={offer.approvalStatus || offer.status} />
                                            </TableCell>
                                            <TableCell className="pr-6 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:text-slate-600">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-none p-1 font-bold">
                                                        <DropdownMenuItem onClick={() => handleEdit(offer)} className="rounded-xl h-10">Edit Details</DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl h-10">Preview & Download</DropdownMenuItem> {/* Mock */}
                                                        <DropdownMenuSeparator className="bg-slate-50" />
                                                        {(offer.approvalStatus === 'Draft' || offer.status === 'Draft') && (
                                                            <DropdownMenuItem onClick={() => handleSubmitApproval(offer.id)} className="rounded-xl h-10 text-indigo-600 bg-indigo-50/50 mb-1">
                                                                <ShieldCheck className="h-4 w-4 mr-2" /> Request Approval
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => handleDelete(offer.id)} className="rounded-xl h-10 text-red-600 focus:bg-red-50">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                                <FileText className="h-10 w-10 text-slate-200" />
                                                <p className="font-bold">No offers found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </Card>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="bg-white rounded-2xl border border-slate-100/50 p-6 max-w-4xl shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar top-[50%] -translate-y-1/2">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">Generate Offer</DialogTitle>
                        <DialogDescription className="font-bold text-slate-500 text-xs">Structure compensation and terms.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-2">
                        {/* Section 1: Basic Info */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            <div className="col-span-2 grid grid-cols-[140px_1fr] items-center gap-4">
                                <Label className="font-bold text-slate-700 text-xs text-right pr-2">Offer Template</Label>
                                <Select value={offerForm.templateId} onValueChange={(val) => setOfferForm({ ...offerForm, templateId: val })}>
                                    <SelectTrigger className="h-9 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none font-bold">
                                        <SelectItem value="standard_ft" className="text-xs">Standard Full-time Employee</SelectItem>
                                        <SelectItem value="contract" className="text-xs">Contractor Agreement</SelectItem>
                                        <SelectItem value="intern" className="text-xs">Internship Offer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <Label className="font-bold text-slate-700 text-xs text-right pr-2">Candidate Name</Label>
                                <Input value={offerForm.candidateName} onChange={(e) => setOfferForm({ ...offerForm, candidateName: e.target.value })} className="h-9 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs" />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <Label className="font-bold text-slate-700 text-xs text-right pr-2">Role</Label>
                                <Input value={offerForm.role} onChange={(e) => setOfferForm({ ...offerForm, role: e.target.value })} className="h-9 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs" />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <Label className="font-bold text-slate-700 text-xs text-right pr-2">Joining Date</Label>
                                <Input type="date" value={offerForm.joiningDate} onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })} className="h-9 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs" />
                            </div>

                            <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                <Label className="font-bold text-slate-700 text-xs text-right pr-2">Offer Expiry</Label>
                                <Input type="date" value={offerForm.expiryDate} onChange={(e) => setOfferForm({ ...offerForm, expiryDate: e.target.value })} className="h-9 rounded-lg bg-slate-50 border-none font-bold px-3 text-xs" />
                            </div>
                        </div>

                        {/* Section 2: Compensation */}
                        <div className="pt-4 border-t border-slate-50 mt-2">
                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Calculator className="h-3.5 w-3.5 text-indigo-500" />
                                Compensation Structure
                            </h4>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                                    <Label className="font-bold text-slate-700 text-xs text-right pr-2">Total Annual CTC</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 1200000"
                                        value={offerForm.ctc}
                                        onChange={(e) => handleCtcChange(e.target.value)}
                                        className="h-9 rounded-lg bg-emerald-50 border-emerald-100 text-emerald-800 font-bold px-3 text-xs"
                                    />
                                </div>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-slate-400">
                                    <Label className="font-bold text-slate-600 text-xs text-right pr-2">Basic Salary</Label>
                                    <Input value={offerForm.basic} readOnly className="h-9 rounded-lg bg-slate-50/50 border-none font-medium px-3 text-xs opacity-70" />
                                </div>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-slate-400">
                                    <Label className="font-bold text-slate-600 text-xs text-right pr-2">HRA (20%)</Label>
                                    <Input value={offerForm.hra} readOnly className="h-9 rounded-lg bg-slate-50/50 border-none font-medium px-3 text-xs opacity-70" />
                                </div>
                                <div className="grid grid-cols-[140px_1fr] items-center gap-4 text-slate-400">
                                    <Label className="font-bold text-slate-600 text-xs text-right pr-2">Special Allowances</Label>
                                    <Input value={offerForm.allowances} readOnly className="h-9 rounded-lg bg-slate-50/50 border-none font-medium px-3 text-xs opacity-70" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button onClick={handleSaveOffer} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-bold shadow-xl border-none text-xs">Save Offer Draft</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OfferLettersPage;
