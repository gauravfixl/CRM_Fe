"use client";

import React, { useState, useMemo } from "react";
import {
    CreditCard,
    Plus,
    Trash2,
    ShieldCheck,
    Mail,
    MapPin,
    AlertTriangle,
    Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";

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

    const handleUpdateEmail = () => {
        if (!billingEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        toast.promise(new Promise(res => setTimeout(res, 1000)), {
            loading: "Updating billing email...",
            success: "Billing email updated successfully.",
            error: "Failed to update email."
        });
        setEmailSaved(true);
    };

    const handleSaveAddress = () => {
        if (!address.company.trim() || !address.street.trim() || !address.city.trim() || !address.zip.trim()) {
            toast.error("Please fill in all required address fields.");
            return;
        }
        toast.promise(new Promise(res => setTimeout(res, 1000)), {
            loading: "Updating billing address...",
            success: "Billing address updated successfully.",
            error: "Failed to update address."
        });
        setIsEditAddressOpen(false);
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

                    {/* Add New Card — trigger only; side sheet rendered below */}
                    <Button
                        variant="outline"
                        className="w-full h-10 border-dashed border-2 bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900 font-medium text-xs rounded-xl gap-1.5"
                        onClick={() => setIsAddOpen(true)}
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Payment Method
                    </Button>
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

            {/* Add New Card — side sheet */}
            <SideFormSheet
                open={isAddOpen}
                onOpenChange={(o) => {
                    setIsAddOpen(o);
                    if (!o) {
                        setNewCard({ name: "", number: "", expiry: "", cvc: "" });
                        setCardErrors({});
                    }
                }}
                title="Add New Card"
                description="Securely link a new credit or debit card for future invoices."
                icon={<CreditCard className="w-5 h-5" />}
                width="md"
                onSubmit={handleAddCard}
                submitLabel="Link Card Securely"
            >
                <div className="space-y-4">
                    <Field label="Name on Card" required error={cardErrors.name}>
                        <Input
                            placeholder="e.g. John Doe"
                            value={newCard.name}
                            onChange={(e) =>
                                setNewCard((prev) => ({
                                    ...prev,
                                    name: e.target.value.replace(/[^A-Za-z\s.'-]/g, ""),
                                }))
                            }
                            className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                            maxLength={80}
                        />
                    </Field>

                    <Field label="Card Number" required error={cardErrors.number} hint="16-digit card number">
                        <Input
                            placeholder="0000 0000 0000 0000"
                            value={newCard.number}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                                const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                                setNewCard((prev) => ({ ...prev, number: formatted }));
                            }}
                            className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary font-mono tracking-wider"
                            inputMode="numeric"
                            autoComplete="cc-number"
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Expiry" required error={cardErrors.expiry} hint="MM/YY">
                            <Input
                                placeholder="12/26"
                                value={newCard.expiry}
                                onChange={(e) => {
                                    let val = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
                                    if (val.length >= 3) val = val.slice(0, 2) + "/" + val.slice(2);
                                    setNewCard((prev) => ({ ...prev, expiry: val }));
                                }}
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary font-mono"
                                maxLength={5}
                                inputMode="numeric"
                                autoComplete="cc-exp"
                            />
                        </Field>
                        <Field label="CVC" required error={cardErrors.cvc} hint="3 or 4 digits">
                            <Input
                                type="password"
                                placeholder="•••"
                                value={newCard.cvc}
                                onChange={(e) =>
                                    setNewCard((prev) => ({
                                        ...prev,
                                        cvc: e.target.value.replace(/\D/g, "").slice(0, 4),
                                    }))
                                }
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary font-mono"
                                maxLength={4}
                                inputMode="numeric"
                                autoComplete="cc-csc"
                            />
                        </Field>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-blue-800 leading-relaxed">
                            Your card information is encrypted end-to-end. We are PCI-DSS compliant.
                        </p>
                    </div>
                </div>
            </SideFormSheet>

            {/* Edit Billing Address — side sheet */}
            <SideFormSheet
                open={isEditAddressOpen}
                onOpenChange={setIsEditAddressOpen}
                title="Edit Billing Address"
                description="Update your organization's billing address."
                icon={<MapPin className="w-5 h-5" />}
                width="md"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveAddress();
                }}
                submitLabel="Save Address"
            >
                <div className="space-y-4">
                    <Field label="Company Name" required>
                        <Input
                            value={address.company}
                            onChange={(e) => setAddress((prev) => ({ ...prev, company: e.target.value }))}
                            className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                            maxLength={100}
                        />
                    </Field>
                    <Field label="Street Address" required>
                        <Input
                            value={address.street}
                            onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
                            className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                            maxLength={150}
                        />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="City" required>
                            <Input
                                value={address.city}
                                onChange={(e) =>
                                    setAddress((prev) => ({
                                        ...prev,
                                        city: e.target.value.replace(/[^A-Za-z\s.'-]/g, ""),
                                    }))
                                }
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                                maxLength={60}
                            />
                        </Field>
                        <Field label="State / Province">
                            <Input
                                value={address.state}
                                onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                                maxLength={60}
                            />
                        </Field>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Zip / Postal Code" required hint="Alphanumeric">
                            <Input
                                value={address.zip}
                                onChange={(e) =>
                                    setAddress((prev) => ({
                                        ...prev,
                                        zip: e.target.value.replace(/[^A-Za-z0-9\s-]/g, ""),
                                    }))
                                }
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                                maxLength={12}
                            />
                        </Field>
                        <Field label="Country" required>
                            <Input
                                value={address.country}
                                onChange={(e) =>
                                    setAddress((prev) => ({
                                        ...prev,
                                        country: e.target.value.replace(/[^A-Za-z\s.'-]/g, ""),
                                    }))
                                }
                                className="h-11 rounded-lg bg-white border-slate-200 focus:border-primary"
                                maxLength={60}
                            />
                        </Field>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
