"use client";

import React, { useState } from "react";
import {
    CreditCard,
    Plus,
    Trash2,
    ShieldCheck,
    MoreVertical,
    Star,
    Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { showSuccess, showWarning } from "@/shared/utils/toast";

interface PaymentMethod {
    id: string;
    type: string;
    last4: string;
    expiry: string;
    holder: string;
    isPrimary: boolean;
}

const initialMethods: PaymentMethod[] = [
    { id: "1", type: "Visa", last4: "4242", expiry: "12/26", holder: "John Doe", isPrimary: true },
    { id: "2", type: "Mastercard", last4: "8888", expiry: "05/27", holder: "Fixl Solutions", isPrimary: false },
];

export default function PaymentsPage() {
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialMethods);

    const [formHolder, setFormHolder] = useState("");
    const [formNumber, setFormNumber] = useState("");
    const [formExpiry, setFormExpiry] = useState("");
    const [formCvv, setFormCvv] = useState("");

    const resetForm = () => {
        setFormHolder("");
        setFormNumber("");
        setFormExpiry("");
        setFormCvv("");
    };

    const setPrimary = (id: string) => {
        setPaymentMethods((prev) =>
            prev.map((m) => ({ ...m, isPrimary: m.id === id }))
        );
        showSuccess("Payment method set as primary");
    };

    const removeMethod = (id: string) => {
        const method = paymentMethods.find((m) => m.id === id);
        if (!method) return;
        const confirmed = window.confirm(
            `Remove ${method.type} ending in ${method.last4}?`
        );
        if (!confirmed) return;
        setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
        showSuccess("Payment method removed");
    };

    const handleAddCard = () => {
        const trimmedHolder = formHolder.trim();
        const trimmedNumber = formNumber.replace(/\s/g, "");
        const trimmedExpiry = formExpiry.trim();
        const trimmedCvv = formCvv.trim();

        if (!trimmedHolder || !trimmedNumber || !trimmedExpiry || !trimmedCvv) {
            showWarning("Please fill in all fields");
            return;
        }

        if (/\d/.test(trimmedHolder)) {
            showWarning("Cardholder name should not contain numbers");
            return;
        }

        if (!/^\d{16}$/.test(trimmedNumber)) {
            showWarning("Please enter a valid 16-digit card number");
            return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(trimmedExpiry)) {
            showWarning("Please enter expiry in MM/YY format (e.g., 12/26)");
            return;
        }

        if (!/^\d{3,4}$/.test(trimmedCvv)) {
            showWarning("Please enter a valid 3 or 4 digit CVV");
            return;
        }

        const last4 = trimmedNumber.slice(-4);
        const newMethod: PaymentMethod = {
            id: Date.now().toString(),
            type: "Visa",
            last4,
            expiry: trimmedExpiry,
            holder: trimmedHolder,
            isPrimary: paymentMethods.length === 0,
        };
        setPaymentMethods((prev) => [...prev, newMethod]);
        resetForm();
        setShowAddCardModal(false);
        showSuccess("Payment method added successfully");
    };

    const getCardIcon = (type: string) => {
        if (type === "Visa") {
            return (
                <div className="w-8 h-5 rounded-none bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold">
                    VISA
                </div>
            );
        }
        if (type === "Mastercard") {
            return (
                <div className="w-8 h-5 rounded-none bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-semibold">
                    MC
                </div>
            );
        }
        return <CreditCard size={16} className="text-gray-400" />;
    };

    const primaryMethod = paymentMethods.find((m) => m.isPrimary);

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Header */}
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Payment Methods</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Manage your saved payment methods and billing preferences.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowAddCardModal(true)}
                        className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-8 gap-1.5 px-4"
                    >
                        <Plus size={14} />
                        Add Payment Method
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                    <p className="text-white text-xs opacity-80">Saved Methods</p>
                    <p className="text-white text-xl font-semibold mt-1">{paymentMethods.length}</p>
                    <p className="text-white text-[10px] mt-1 opacity-70">Payment methods on file</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                    <p className="text-zinc-500 text-xs">Primary Method</p>
                    <p className="text-xl font-semibold text-zinc-900 mt-1">{primaryMethod ? `${primaryMethod.type} ${primaryMethod.last4}` : "None"}</p>
                    <p className="text-primary text-[10px] mt-1">Default for billing</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                    <p className="text-zinc-500 text-xs">Next Charge</p>
                    <p className="text-xl font-semibold text-zinc-900 mt-1">$499.00</p>
                    <p className="text-zinc-400 text-[10px] mt-1">May 01, 2026</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                    <p className="text-zinc-500 text-xs">Security</p>
                    <p className="text-xl font-semibold text-zinc-900 mt-1">PCI-DSS</p>
                    <p className="text-emerald-600 text-[10px] mt-1">Fully compliant</p>
                </div>
            </div>

            {/* Payment cards list */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className="border border-gray-200 bg-white rounded-none p-4 space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {getCardIcon(method.type)}
                                <span className="text-sm font-medium text-gray-900">
                                    {method.type} ending in {method.last4}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {method.isPrimary && (
                                    <Badge className="rounded-none bg-green-50 text-green-700 border border-green-200 text-[10px] font-medium px-1.5 py-0 hover:bg-green-50">
                                        Primary
                                    </Badge>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-none transition-colors">
                                            <MoreVertical size={14} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-none min-w-[150px]">
                                        {!method.isPrimary && (
                                            <DropdownMenuItem
                                                className="text-xs font-medium cursor-pointer gap-2"
                                                onClick={() => setPrimary(method.id)}
                                            >
                                                <Star size={13} />
                                                Set as primary
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            className="text-xs font-medium text-red-600 focus:text-red-600 cursor-pointer gap-2"
                                            onClick={() => removeMethod(method.id)}
                                        >
                                            <Trash2 size={13} />
                                            Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{method.holder}</span>
                            <span className="text-gray-300">|</span>
                            <span>Expires {method.expiry}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-none">
                        <ShieldCheck size={18} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Security</h3>
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                            All payment data is encrypted and PCI-DSS compliant.
                        </p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-none">
                        <Globe size={18} className="text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Multi-currency</h3>
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                            Support for 135+ currencies with automatic conversion.
                        </p>
                    </div>
                </div>
            </div>

            {/* Add payment method modal */}
            <Dialog open={showAddCardModal} onOpenChange={setShowAddCardModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden border border-gray-200">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900">Add payment method</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Enter your card details below.</p>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">Cardholder name</Label>
                            <Input
                                placeholder="Name on card"
                                value={formHolder}
                                onChange={(e) => setFormHolder(e.target.value)}
                                className="rounded-none h-9 text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-medium text-gray-700">Card number</Label>
                            <Input
                                placeholder="0000 0000 0000 0000"
                                value={formNumber}
                                onChange={(e) => setFormNumber(e.target.value)}
                                className="rounded-none h-9 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">Expiry</Label>
                                <Input
                                    placeholder="MM/YY"
                                    value={formExpiry}
                                    onChange={(e) => setFormExpiry(e.target.value)}
                                    className="rounded-none h-9 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-700">CVV</Label>
                                <Input
                                    placeholder="123"
                                    value={formCvv}
                                    onChange={(e) => setFormCvv(e.target.value)}
                                    className="rounded-none h-9 text-sm"
                                    type="password"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="px-5 py-3 border-t border-gray-100 bg-gray-50 gap-2 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                resetForm();
                                setShowAddCardModal(false);
                            }}
                            className="rounded-none text-xs font-medium h-9"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddCard}
                            className="rounded-none bg-primary hover:bg-primary/90 text-xs font-medium h-9 px-5"
                        >
                            Add card
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </div>
        </div>
    );
}
