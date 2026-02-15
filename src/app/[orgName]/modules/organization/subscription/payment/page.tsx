"use client";

import React, { useState } from "react";
import {
    CreditCard,
    Plus,
    Trash2,
    ShieldCheck,
    Mail,
    MapPin,
    MoreHorizontal,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function PaymentMethodsPage() {
    const [billingEmail, setBillingEmail] = useState("billing@fixl.solutions");

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        toast.promise(new Promise(res => setTimeout(res, 2000)), {
            loading: "Validating with payment gateway...",
            success: "New card (Ending in 8899) added.",
            error: "Card validation failed."
        });
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        Billing & Payment Methods
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Manage corporate cards and invoices settings.</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 border border-emerald-100">
                    <ShieldCheck className="w-3 h-3" /> 256-bit Encrypted
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* CARDS LIST */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Payment Instruments</h3>

                    {/* Primary Card */}
                    <div className="bg-slate-900 rounded-none p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full translate-x-10 translate-y-[-50%]" />
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Primary Card</p>
                                <h4 className="text-xl font-bold mt-1">Visa Corporate</h4>
                            </div>
                            <CreditCard className="w-8 h-8 opacity-80" />
                        </div>

                        <div className="mb-6">
                            <p className="font-mono text-2xl tracking-widest flex gap-4">
                                <span>••••</span><span>••••</span><span>••••</span><span>4242</span>
                            </p>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[9px] font-bold uppercase opacity-60">Card Holder</p>
                                <p className="font-medium text-sm">ALEXANDER PIERCE</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase opacity-60">Expires</p>
                                <p className="font-medium text-sm">12/28</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-emerald-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-none">Default</span>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Card */}
                    <div className="bg-white border border-slate-200 rounded-none p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-14 bg-slate-100 rounded-none flex items-center justify-center border border-slate-200">
                                <span className="font-bold text-xs text-slate-500 italic">MC</span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 text-sm">Mastercard •••• 5567</p>
                                <p className="text-xs text-slate-400">Expires 09/27</p>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase rounded-none border-slate-200">Make Default</Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-none">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Add New Trigger */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full h-12 border-dashed border-2 bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900 font-bold rounded-none gap-2">
                                <Plus className="w-4 h-4" /> Add Payment Method
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md rounded-none border-t-4 border-t-blue-600 gap-6">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                    Add New Card
                                </DialogTitle>
                                <DialogDescription>
                                    Securely link a new credit or debit card for future invoices.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddCard} className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-slate-500">Name on Card</Label>
                                    <Input placeholder="e.g. John Doe" className="rounded-none font-bold" required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-bold text-slate-500">Card Number</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input placeholder="0000 0000 0000 0000" className="pl-10 rounded-none font-mono" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-slate-500">Expiry</Label>
                                        <Input placeholder="MM/YY" className="rounded-none font-mono text-center" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase font-bold text-slate-500">CVC</Label>
                                        <Input placeholder="123" className="rounded-none font-mono text-center" required />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-none h-11 shadow-lg mt-2">
                                    Link Card Securely
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* BILLING SETTINGS */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md rounded-none">
                        <CardHeader className="bg-slate-900 text-white p-5 rounded-none">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Invoice Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Billing Email</Label>
                                <Input
                                    value={billingEmail}
                                    onChange={(e) => setBillingEmail(e.target.value)}
                                    className="rounded-none font-bold bg-slate-50 border-slate-200"
                                />
                                <p className="text-[10px] text-slate-400">Invoices will be sent here.</p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full rounded-none border-slate-200 font-bold"
                                onClick={() => toast.success("Email preferences updated")}
                            >
                                Update Preferences
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md rounded-none">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-600" /> Billing Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-3">
                            <div className="bg-white p-3 border border-slate-200 rounded-none">
                                <p className="text-sm font-bold text-slate-900">Fixl Solutions HQ</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    123 Tech Park Blvd<br />
                                    Silicon Valley, CA 94000<br />
                                    United States
                                </p>
                            </div>
                            <Button variant="ghost" className="w-full text-blue-600 hover:bg-blue-50 bg-white font-bold rounded-none border border-dashed border-blue-200 h-9 text-xs uppercase tracking-wider">
                                Edit Address
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
