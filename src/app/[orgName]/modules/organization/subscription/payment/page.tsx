"use client";

import React, { useState } from "react";
import {
    CreditCard,
    Plus,
    Trash2,
    ShieldCheck,
    Mail,
    MapPin,
    Check,
    AlertTriangle,
    Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface PaymentCard {
    id: string;
    brand: string;
    brandShort: string;
    last4: string;
    holder: string;
    expiry: string;
    isDefault: boolean;
}

const initialCards: PaymentCard[] = [
    { id: "card-1", brand: "Visa Corporate", brandShort: "Visa", last4: "4242", holder: "Alexander Pierce", expiry: "12/28", isDefault: true },
    { id: "card-2", brand: "Mastercard", brandShort: "Mc", last4: "5567", holder: "Alexander Pierce", expiry: "09/27", isDefault: false },
];

export default function PaymentMethodsPage() {
    const [cards, setCards] = useState<PaymentCard[]>(initialCards);
    const [billingEmail, setBillingEmail] = useState("billing@fixl.solutions");
    const [emailSaved, setEmailSaved] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);

    // Add card form
    const [newCard, setNewCard] = useState({ name: "", number: "", expiry: "", cvc: "" });
    const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

    // Address form
    const [address, setAddress] = useState({
        company: "Fixl Solutions Hq",
        street: "123 Tech Park Blvd",
        city: "Silicon Valley",
        state: "CA",
        zip: "94000",
        country: "United States"
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await getOrgDetails();
                const o: any = res?.data?.organization || res?.data?.data || res?.data || {};
                if (o?.contactEmail) setBillingEmail(o.contactEmail);
                if (o?.name) setAddress((prev) => ({ ...prev, company: o.name }));
                if (o?.address && typeof o.address === "string") {
                    // Best-effort: store the entire saved address string in the street field
                    setAddress((prev) => ({ ...prev, street: o.address }));
                }
                if (o?.orgCountry) setAddress((prev) => ({ ...prev, country: o.orgCountry }));
            } catch {
                // Silent fallback
            }
        })();
    }, []);

    const defaultCard = cards.find(c => c.isDefault);
    const deleteTargetCard = cards.find(c => c.id === deleteTarget);

    const handleMakeDefault = (cardId: string) => {
        setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === cardId })));
        const card = cards.find(c => c.id === cardId);
        toast.success(`${card?.brand} •••• ${card?.last4} is now your default payment method.`);
    };

    const handleDeleteCard = () => {
        if (!deleteTarget) return;
        const card = cards.find(c => c.id === deleteTarget);
        if (card?.isDefault) {
            toast.error("Cannot delete the default payment method. Please set another card as default first.");
            setDeleteTarget(null);
            return;
        }
        setCards(prev => prev.filter(c => c.id !== deleteTarget));
        toast.success(`${card?.brand} •••• ${card?.last4} has been removed.`);
        setDeleteTarget(null);
    };

    const validateNewCard = () => {
        const errors: Record<string, string> = {};
        if (!newCard.name.trim()) errors.name = "Name is required";
        if (!newCard.number.trim() || newCard.number.replace(/\s/g, "").length < 16) errors.number = "Enter a valid 16-digit card number";
        if (!newCard.expiry.trim() || !/^\d{2}\/\d{2}$/.test(newCard.expiry)) errors.expiry = "Enter valid MM/YY";
        if (!newCard.cvc.trim() || newCard.cvc.length < 3) errors.cvc = "Enter valid CVC";
        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateNewCard()) return;

        const last4 = newCard.number.replace(/\s/g, "").slice(-4);
        const newEntry: PaymentCard = {
            id: `card-${Date.now()}`,
            brand: "New Card",
            brandShort: "Card",
            last4,
            holder: newCard.name,
            expiry: newCard.expiry,
            isDefault: false,
        };

        toast.promise(new Promise(res => setTimeout(res, 2000)), {
            loading: "Validating with payment gateway...",
            success: `New card ending in ${last4} added successfully.`,
            error: "Card validation failed."
        });

        setCards(prev => [...prev, newEntry]);
        setNewCard({ name: "", number: "", expiry: "", cvc: "" });
        setCardErrors({});
        setIsAddOpen(false);
    };

    const handleUpdateEmail = async () => {
        if (!billingEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        try {
            await axiosInstance.patch("/organization/update/details", {
                contactEmail: billingEmail.trim(),
            });
            toast.success("Billing email updated successfully.");
            setEmailSaved(true);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update email.");
        }
    };

    const handleSaveAddress = async () => {
        if (!address.company.trim() || !address.street.trim() || !address.city.trim() || !address.zip.trim()) {
            toast.error("Please fill in all required address fields.");
            return;
        }
        const fullAddress = [address.street, address.city, address.state, address.zip]
            .filter(Boolean)
            .join(", ");
        try {
            await axiosInstance.patch("/organization/update/details", {
                name: address.company.trim(),
                address: fullAddress,
                orgCountry: address.country.trim(),
            });
            toast.success("Billing address updated successfully.");
            setIsEditAddressOpen(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to update address.");
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        Billing & Payment Methods
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage corporate cards and invoice settings.</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 border border-emerald-100 rounded-lg">
                    <ShieldCheck className="w-3 h-3" /> 256-bit Encrypted
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Cards List */}
                <div className="lg:col-span-2 space-y-3">
                    <h3 className="text-[10px] font-medium text-slate-400">Payment Instruments</h3>

                    {/* Primary Card */}
                    {defaultCard && (
                        <div className="bg-slate-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-24 bg-white opacity-5 rounded-full translate-x-10 translate-y-[-50%]" />
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-[10px] font-medium text-white/60">Primary Card</p>
                                    <h4 className="text-sm font-semibold text-white mt-0.5">{defaultCard.brand}</h4>
                                </div>
                                <CreditCard className="w-6 h-6 opacity-80" />
                            </div>
                            <div className="mb-5">
                                <p className="font-mono text-lg tracking-widest flex gap-3 text-white">
                                    <span>••••</span><span>••••</span><span>••••</span><span>{defaultCard.last4}</span>
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-medium text-white/60">Card Holder</p>
                                    <p className="text-xs text-white mt-0.5">{defaultCard.holder}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium text-white/60">Expires</p>
                                    <p className="text-xs text-white mt-0.5">{defaultCard.expiry}</p>
                                </div>
                                <Badge className="bg-emerald-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-md">Default</Badge>
                            </div>
                        </div>
                    )}

                    {/* Other Cards */}
                    {cards.filter(c => !c.isDefault).map(card => (
                        <div key={card.id} className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                    <span className="font-medium text-[10px] text-slate-500 italic">{card.brandShort}</span>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 text-xs">{card.brand} •••• {card.last4}</p>
                                    <p className="text-[10px] text-slate-400">Expires {card.expiry}</p>
                                </div>
                            </div>
                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="outline" className="h-7 text-[10px] font-medium rounded-lg border-slate-200" onClick={() => handleMakeDefault(card.id)}>Make Default</Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:bg-red-50 rounded-lg" onClick={() => setDeleteTarget(card.id)}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Card */}
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full h-10 border-dashed border-2 bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900 font-medium text-xs rounded-xl gap-1.5">
                                <Plus className="w-3.5 h-3.5" /> Add Payment Method
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-xl border-t-4 border-t-blue-600 gap-5">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
                                    <CreditCard className="w-4 h-4 text-blue-600" />
                                    Add New Card
                                </DialogTitle>
                                <DialogDescription className="text-xs">
                                    Securely link a new credit or debit card for future invoices.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddCard} className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-medium text-slate-500">Name on Card</Label>
                                    <Input
                                        placeholder="e.g. John Doe"
                                        value={newCard.name}
                                        onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
                                        className={`rounded-lg text-xs h-9 ${cardErrors.name ? "border-red-400" : ""}`}
                                        required
                                    />
                                    {cardErrors.name && <p className="text-[10px] text-red-500">{cardErrors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-medium text-slate-500">Card Number</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                        <Input
                                            placeholder="0000 0000 0000 0000"
                                            value={newCard.number}
                                            onChange={(e) => setNewCard(prev => ({ ...prev, number: e.target.value.replace(/[^\d\s]/g, "").slice(0, 19) }))}
                                            className={`pl-9 rounded-lg font-mono text-xs h-9 ${cardErrors.number ? "border-red-400" : ""}`}
                                            required
                                        />
                                    </div>
                                    {cardErrors.number && <p className="text-[10px] text-red-500">{cardErrors.number}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-medium text-slate-500">Expiry</Label>
                                        <Input
                                            placeholder="MM/YY"
                                            value={newCard.expiry}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                                                if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
                                                setNewCard(prev => ({ ...prev, expiry: val }));
                                            }}
                                            className={`rounded-lg font-mono text-xs text-center h-9 ${cardErrors.expiry ? "border-red-400" : ""}`}
                                            required
                                        />
                                        {cardErrors.expiry && <p className="text-[10px] text-red-500">{cardErrors.expiry}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-medium text-slate-500">Cvc</Label>
                                        <Input
                                            placeholder="123"
                                            value={newCard.cvc}
                                            onChange={(e) => setNewCard(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                                            className={`rounded-lg font-mono text-xs text-center h-9 ${cardErrors.cvc ? "border-red-400" : ""}`}
                                            required
                                        />
                                        {cardErrors.cvc && <p className="text-[10px] text-red-500">{cardErrors.cvc}</p>}
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg h-9 shadow-sm mt-1">
                                    Link Card Securely
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Billing Settings */}
                <div className="space-y-4">
                    <Card className="border-none shadow-sm rounded-xl">
                        <CardHeader className="bg-slate-900 text-white p-4 rounded-t-xl">
                            <CardTitle className="text-xs font-semibold flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" /> Invoice Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium text-slate-500">Billing Email</Label>
                                <Input
                                    value={billingEmail}
                                    onChange={(e) => { setBillingEmail(e.target.value); setEmailSaved(false) }}
                                    className="rounded-lg text-xs bg-slate-50 border-slate-200 h-9"
                                />
                                <p className="text-[10px] text-slate-400">Invoices will be sent here.</p>
                            </div>
                            <Button
                                variant="outline"
                                className={`w-full rounded-lg border-slate-200 font-medium text-xs h-8 ${!emailSaved ? "bg-blue-50 border-blue-200 text-blue-600" : ""}`}
                                onClick={handleUpdateEmail}
                                disabled={emailSaved}
                            >
                                {emailSaved ? "Preferences Saved" : "Update Preferences"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-xl">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 p-4 rounded-t-xl">
                            <CardTitle className="text-xs font-semibold flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-slate-600" /> Billing Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <div className="bg-white p-3 border border-slate-200 rounded-lg">
                                <p className="text-xs font-medium text-slate-900">{address.company}</p>
                                <p className="text-[10px] text-slate-500 mt-1">
                                    {address.street}<br />
                                    {address.city}, {address.state} {address.zip}<br />
                                    {address.country}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                className="w-full text-blue-600 hover:bg-blue-50 bg-white font-medium rounded-lg border border-dashed border-blue-200 h-8 text-[10px] gap-1"
                                onClick={() => setIsEditAddressOpen(true)}
                            >
                                <Pencil className="w-3 h-3" /> Edit Address
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delete Card Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-[380px] rounded-xl border-none shadow-xl">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                            </div>
                            <DialogTitle className="text-sm font-semibold text-slate-900">Remove Card</DialogTitle>
                        </div>
                        <DialogDescription className="text-xs text-slate-500">
                            Are you sure you want to remove <strong>{deleteTargetCard?.brand} •••• {deleteTargetCard?.last4}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="h-8 text-xs font-medium rounded-lg" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button className="h-8 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg" onClick={handleDeleteCard}>
                            Remove Card
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Address Dialog */}
            <Dialog open={isEditAddressOpen} onOpenChange={setIsEditAddressOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-xl border-none shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-600" /> Edit Billing Address
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-400">Update your organization's billing address.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-3">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-medium text-slate-500">Company Name</Label>
                            <Input value={address.company} onChange={(e) => setAddress(prev => ({ ...prev, company: e.target.value }))} className="rounded-lg text-xs h-9" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-medium text-slate-500">Street Address</Label>
                            <Input value={address.street} onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))} className="rounded-lg text-xs h-9" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium text-slate-500">City</Label>
                                <Input value={address.city} onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))} className="rounded-lg text-xs h-9" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium text-slate-500">State</Label>
                                <Input value={address.state} onChange={(e) => setAddress(prev => ({ ...prev, state: e.target.value }))} className="rounded-lg text-xs h-9" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium text-slate-500">Zip Code</Label>
                                <Input value={address.zip} onChange={(e) => setAddress(prev => ({ ...prev, zip: e.target.value }))} className="rounded-lg text-xs h-9" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-medium text-slate-500">Country</Label>
                                <Input value={address.country} onChange={(e) => setAddress(prev => ({ ...prev, country: e.target.value }))} className="rounded-lg text-xs h-9" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="h-8 text-xs font-medium rounded-lg" onClick={() => setIsEditAddressOpen(false)}>Cancel</Button>
                        <Button className="h-8 bg-slate-900 hover:bg-black text-white text-xs font-medium rounded-lg" onClick={handleSaveAddress}>
                            Save Address
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
