"use client";

import React, { useState, useMemo } from "react";
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
import { Input } from "@/shared/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet";
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

function detectCardType(num: string): string {
    const n = num.replace(/\s/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
    if (/^3[47]/.test(n)) return "Amex";
    if (/^6(?:011|5)/.test(n)) return "Discover";
    return "Card";
}

function formatCardNumber(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length < 3) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function PaymentsPage() {
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialMethods);
    const [submitting, setSubmitting] = useState(false);

    const [formHolder, setFormHolder] = useState("");
    const [formNumber, setFormNumber] = useState("");
    const [formExpiry, setFormExpiry] = useState("");
    const [formCvv, setFormCvv] = useState("");
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const resetForm = () => {
        setFormHolder("");
        setFormNumber("");
        setFormExpiry("");
        setFormCvv("");
        setTouched({});
    };

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        const holder = formHolder.trim();
        const number = formNumber.replace(/\s/g, "");
        const expiry = formExpiry.trim();
        const cvv = formCvv.trim();

        if (touched.holder) {
            if (!holder) e.holder = "Cardholder name is required";
            else if (!/^[A-Za-z\s.'-]+$/.test(holder)) e.holder = "Only letters, spaces, and . ' - allowed";
            else if (holder.length < 2) e.holder = "Name is too short";
        }
        if (touched.number) {
            if (!number) e.number = "Card number is required";
            else if (!/^\d{16}$/.test(number)) e.number = "Enter a valid 16-digit card number";
        }
        if (touched.expiry) {
            if (!expiry) e.expiry = "Expiry date is required";
            else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
                e.expiry = "Use MM/YY format (e.g. 12/26)";
            } else {
                const [mm, yy] = expiry.split("/").map(Number);
                const now = new Date();
                const expDate = new Date(2000 + yy, mm - 1, 1);
                const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                if (expDate < thisMonth) e.expiry = "Card has expired";
            }
        }
        if (touched.cvv) {
            if (!cvv) e.cvv = "CVV is required";
            else if (!/^\d{3,4}$/.test(cvv)) e.cvv = "CVV must be 3 or 4 digits";
        }
        return e;
    }, [formHolder, formNumber, formExpiry, formCvv, touched]);

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

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ holder: true, number: true, expiry: true, cvv: true });

        // Revalidate with all fields touched
        const holder = formHolder.trim();
        const number = formNumber.replace(/\s/g, "");
        const expiry = formExpiry.trim();
        const cvv = formCvv.trim();

        const fresh: Record<string, string> = {};
        if (!holder) fresh.holder = "Cardholder name is required";
        else if (!/^[A-Za-z\s.'-]+$/.test(holder)) fresh.holder = "Only letters allowed";
        if (!/^\d{16}$/.test(number)) fresh.number = "Enter a valid 16-digit card number";
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) fresh.expiry = "Use MM/YY format";
        if (!/^\d{3,4}$/.test(cvv)) fresh.cvv = "CVV must be 3 or 4 digits";

        if (Object.keys(fresh).length > 0) {
            showWarning("Please fix the errors before submitting");
            return;
        }

        setSubmitting(true);
        try {
            await new Promise((r) => setTimeout(r, 400));
            const last4 = number.slice(-4);
            const newMethod: PaymentMethod = {
                id: Date.now().toString(),
                type: detectCardType(number),
                last4,
                expiry,
                holder,
                isPrimary: paymentMethods.length === 0,
            };
            setPaymentMethods((prev) => [...prev, newMethod]);
            resetForm();
            setShowAddCardModal(false);
            showSuccess("Payment method added successfully");
        } finally {
            setSubmitting(false);
        }
    };

    const getCardIcon = (type: string) => {
        const map: Record<string, { bg: string; color: string; label: string }> = {
            Visa: { bg: "bg-primary/10", color: "text-primary", label: "VISA" },
            Mastercard: { bg: "bg-orange-100", color: "text-orange-600", label: "MC" },
            Amex: { bg: "bg-sky-100", color: "text-sky-600", label: "AMEX" },
            Discover: { bg: "bg-amber-100", color: "text-amber-600", label: "DISC" },
        };
        const cfg = map[type];
        if (cfg) {
            return (
                <div className={`w-8 h-5 rounded-none ${cfg.bg} ${cfg.color} flex items-center justify-center text-[10px] font-semibold`}>
                    {cfg.label}
                </div>
            );
        }
        return <CreditCard size={16} className="text-gray-400" />;
    };

    const primaryMethod = paymentMethods.find((m) => m.isPrimary);
    const cardTypePreview = detectCardType(formNumber);

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
            </div>

            {/* Add payment method side sheet */}
            <SideFormSheet
                open={showAddCardModal}
                onOpenChange={(o) => {
                    setShowAddCardModal(o);
                    if (!o) resetForm();
                }}
                title="Add Payment Method"
                description="Add a new card to your billing account."
                icon={<CreditCard className="w-5 h-5" />}
                onSubmit={handleAddCard}
                submitLabel="Add Card"
                loading={submitting}
                width="md"
            >
                <div className="space-y-4">
                    <Field
                        label="Cardholder Name"
                        required
                        error={errors.holder}
                        hint="As it appears on the card"
                    >
                        <Input
                            placeholder="John Doe"
                            value={formHolder}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^A-Za-z\s.'-]/g, "");
                                setFormHolder(val);
                            }}
                            onBlur={() => setTouched((t) => ({ ...t, holder: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field
                        label="Card Number"
                        required
                        error={errors.number}
                        hint={formNumber ? `Detected: ${cardTypePreview}` : "16-digit card number"}
                    >
                        <div className="relative">
                            <Input
                                placeholder="0000 0000 0000 0000"
                                value={formNumber}
                                onChange={(e) => setFormNumber(formatCardNumber(e.target.value))}
                                onBlur={() => setTouched((t) => ({ ...t, number: true }))}
                                inputMode="numeric"
                                autoComplete="cc-number"
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary pr-16 font-mono tracking-wider"
                            />
                            {formNumber && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                    {cardTypePreview.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label="Expiry"
                            required
                            error={errors.expiry}
                            hint="MM/YY"
                        >
                            <Input
                                placeholder="12/26"
                                value={formExpiry}
                                onChange={(e) => setFormExpiry(formatExpiry(e.target.value))}
                                onBlur={() => setTouched((t) => ({ ...t, expiry: true }))}
                                inputMode="numeric"
                                autoComplete="cc-exp"
                                maxLength={5}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary font-mono"
                            />
                        </Field>
                        <Field
                            label="CVV"
                            required
                            error={errors.cvv}
                            hint="3 or 4 digits"
                        >
                            <Input
                                type="password"
                                placeholder="123"
                                value={formCvv}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                                    setFormCvv(val);
                                }}
                                onBlur={() => setTouched((t) => ({ ...t, cvv: true }))}
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                maxLength={4}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary font-mono"
                            />
                        </Field>
                    </div>

                    <div className="flex items-start gap-2 p-3 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11.5px] text-[#475569] leading-relaxed">
                            Your card information is encrypted and securely stored. We are PCI-DSS compliant.
                        </p>
                    </div>
                </div>
            </SideFormSheet>
        </div>
    );
}
