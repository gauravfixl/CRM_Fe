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
    Trash2
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

const OfferLettersPage = () => {
    const { offers, addOffer, updateOffer, deleteOffer } = useHireStore();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const [editingId, setEditingId] = useState<string | null>(null);
    const { toast } = useToast();

    const [offerForm, setOfferForm] = useState({
        candidateName: "",
        role: "",
        department: "Engineering",
        ctc: "",
        joiningDate: ""
    });

    const resetForm = () => {
        setOfferForm({
            candidateName: "",
            role: "",
            department: "Engineering",
            ctc: "",
            joiningDate: ""
        });
        setEditingId(null);
    };

    const handleSaveOffer = () => {
        if (!offerForm.candidateName || !offerForm.role || !offerForm.ctc) {
            toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
            return;
        }

        if (editingId) {
            updateOffer(editingId, offerForm);
            toast({ title: "Offer Updated", description: "Offer details have been saved." });
        } else {
            addOffer(offerForm);
            toast({ title: "Offer Created", description: "New offer letter draft created." });
        }
        setIsCreateOpen(false);
        resetForm();
    };

    const handleEdit = (offer: Offer) => {
        setOfferForm({
            candidateName: offer.candidateName,
            role: offer.role,
            department: offer.department,
            ctc: offer.ctc,
            joiningDate: offer.joiningDate
        });
        setEditingId(offer.id);
        setTimeout(() => setIsCreateOpen(true), 0);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this offer?")) {
            deleteOffer(id);
            toast({ title: "Offer Deleted", description: "Offer letter record removed.", variant: "destructive" });
        }
    };

    const handleStatusUpdate = (id: string, status: Offer['status']) => {
        const updates: Partial<Offer> = { status };
        if (status === 'Sent') updates.sentDate = new Date().toLocaleDateString();

        updateOffer(id, updates);
        toast({ title: "Status Updated", description: `Offer marked as ${status}.` });
    };

    const getFilteredOffers = (tab: string) => {
        if (tab === "all") return offers;
        return offers.filter(o => o.status.toLowerCase() === tab);
    };

    const filteredOffers = getFilteredOffers(activeTab);

    const StatusBadge = ({ status }: { status: Offer['status'] }) => {
        switch (status) {
            case "Accepted": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-bold">Accepted</Badge>;
            case "Sent": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none font-bold">Sent</Badge>;
            case "Declined": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none font-bold">Declined</Badge>;
            default: return <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none font-bold">{status}</Badge>;
        }
    };

    return (
        <div className="flex-1 space-y-8 p-8 h-full flex flex-col bg-[#fcfdff]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Offer Letters</h1>
                    <p className="text-slate-500 font-medium">Generate and manage employment offers for selected candidates.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsCreateOpen(true); }}
                    className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-2xl h-12 px-8 shadow-xl shadow-purple-100 font-bold border-none transition-all hover:scale-105"
                >
                    <Plus className="mr-2 h-5 w-5" /> Create Offer
                </Button>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                    <div className="px-8 pt-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-0">
                        <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-12">
                            <TabsTrigger value="all" className="rounded-xl px-6 font-bold">All Offers</TabsTrigger>
                            <TabsTrigger value="draft" className="rounded-xl px-6 font-bold">Drafts</TabsTrigger>
                            <TabsTrigger value="sent" className="rounded-xl px-6 font-bold">Sent</TabsTrigger>
                            <TabsTrigger value="accepted" className="rounded-xl px-6 font-bold">Accepted</TabsTrigger>
                        </TabsList>

                        <div className="relative mb-4 sm:mb-0">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search candidate..." className="pl-11 rounded-2xl border-none bg-slate-50 h-11 w-full sm:w-64 font-medium" />
                        </div>
                    </div>

                    <TabsContent value={activeTab} className="m-0 flex-1 overflow-auto custom-scrollbar">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="font-bold text-slate-900 h-14 pl-8">Candidate</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Role & Dept</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Comp (CTC)</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Joining Date</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14">Status</TableHead>
                                    <TableHead className="font-bold text-slate-900 h-14 pr-8 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOffers.map((offer) => (
                                    <TableRow key={offer.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors group">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                                    <FileText className="h-5 w-5 text-[#CB9DF0]" />
                                                </div>
                                                <span className="font-black text-slate-900">{offer.candidateName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-700 text-sm">{offer.role}</span>
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{offer.department}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm italic">
                                                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                                                {offer.ctc}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                                                <Calendar className="h-3.5 w-3.5 text-slate-300" />
                                                {offer.joiningDate || "TBD"}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-5">
                                            <StatusBadge status={offer.status} />
                                        </TableCell>
                                        <TableCell className="pr-8 py-5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-9 w-9 rounded-xl p-0 text-slate-400 hover:text-slate-600">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl border-none p-2 p-2 animate-in fade-in zoom-in duration-200">
                                                    <DropdownMenuLabel className="font-black text-slate-400 text-[10px] uppercase tracking-widest px-3 py-2">Offer Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(offer)} className="rounded-xl font-bold h-11 px-3">Edit Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3">Preview Letter</DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl font-bold h-11 px-3">
                                                        <Download className="h-4 w-4 mr-2" /> Download PDF
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-slate-50 my-2" />
                                                    {offer.status === "Draft" && (
                                                        <DropdownMenuItem
                                                            onClick={() => handleStatusUpdate(offer.id, 'Sent')}
                                                            className="rounded-xl font-black h-11 px-3 text-blue-600 focus:bg-blue-50"
                                                        >
                                                            <Send className="h-4 w-4 mr-2" /> Send Offer
                                                        </DropdownMenuItem>
                                                    )}
                                                    {offer.status === "Sent" && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusUpdate(offer.id, 'Accepted')}
                                                                className="rounded-xl font-black h-11 px-3 text-emerald-600 focus:bg-emerald-50"
                                                            >
                                                                <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Accepted
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleStatusUpdate(offer.id, 'Declined')}
                                                                className="rounded-xl font-black h-11 px-3 text-red-600 focus:bg-red-50"
                                                            >
                                                                <XCircle className="h-4 w-4 mr-2" /> Mark Declined
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    <DropdownMenuItem onClick={() => handleDelete(offer.id)} className="rounded-xl font-bold h-11 px-3 text-red-600 focus:bg-red-50">
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete Offer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {filteredOffers.length === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                                <FileText className="h-12 w-12 text-slate-100" />
                                <p className="font-bold">No offers found</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* Create Offer Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="bg-white rounded-[3rem] border-none p-10 max-w-2xl shadow-2xl">
                    <DialogHeader className="mb-8">
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
                            {editingId ? "Edit Offer" : "Create Offer Letter"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-bold text-base mt-2">
                            Fill in the details to generate an employment offer.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-8 py-2">
                        <div className="space-y-3 col-span-2">
                            <Label className="text-slate-900 font-black text-sm ml-1">Candidate Name</Label>
                            <Input
                                placeholder="Enter candidate name"
                                value={offerForm.candidateName}
                                onChange={(e) => setOfferForm({ ...offerForm, candidateName: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-900 font-black text-sm ml-1">Position / Role</Label>
                            <Input
                                placeholder="e.g. Senior Backend Dev"
                                value={offerForm.role}
                                onChange={(e) => setOfferForm({ ...offerForm, role: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-900 font-black text-sm ml-1">Department</Label>
                            <Select
                                value={offerForm.department}
                                onValueChange={(val) => setOfferForm({ ...offerForm, department: val })}
                            >
                                <SelectTrigger className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus:ring-2 focus:ring-purple-100 font-bold px-6">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2 font-bold">
                                    <SelectItem value="Engineering" className="rounded-xl h-11">Engineering</SelectItem>
                                    <SelectItem value="Design" className="rounded-xl h-11">Design</SelectItem>
                                    <SelectItem value="Marketing" className="rounded-xl h-11">Marketing</SelectItem>
                                    <SelectItem value="Sales" className="rounded-xl h-11">Sales</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-900 font-black text-sm ml-1">Annual CTC (₹)</Label>
                            <Input
                                placeholder="e.g. 18,00,000"
                                value={offerForm.ctc}
                                onChange={(e) => setOfferForm({ ...offerForm, ctc: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-slate-900 font-black text-sm ml-1">Joining Date</Label>
                            <Input
                                type="date"
                                value={offerForm.joiningDate}
                                onChange={(e) => setOfferForm({ ...offerForm, joiningDate: e.target.value })}
                                className="rounded-[1.25rem] h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-purple-100 transition-all font-bold px-6"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-12 gap-4 flex-row sm:justify-start">
                        <Button
                            onClick={handleSaveOffer}
                            className="bg-[#CB9DF0] hover:bg-[#b580e0] text-white rounded-[1.25rem] h-14 px-10 shadow-2xl shadow-purple-100 font-black border-none flex-1"
                        >
                            {editingId ? "Update Offer" : "Generate Draft"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsCreateOpen(false)}
                            className="rounded-[1.25rem] h-14 px-10 font-bold text-slate-400 border-none flex-1 hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OfferLettersPage;
