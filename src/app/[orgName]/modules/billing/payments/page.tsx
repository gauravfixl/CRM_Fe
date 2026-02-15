"use client";

import React, { useState } from "react";
import {
    CreditCard,
    Plus,
    Trash2,
    ShieldCheck,
    AlertCircle,
    MoreVertical,
    CheckCircle2,
    Calendar,
    Lock,
    Globe,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export default function PaymentsPage() {
    const [showAddCardModal, setShowAddCardModal] = useState(false);

    const [paymentMethods, setPaymentMethods] = useState([
        { id: "1", type: "Visa", last4: "4242", expiry: "12/26", holder: "John Doe", isPrimary: true, brand: "bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800" },
        { id: "2", type: "Mastercard", last4: "8888", expiry: "05/27", holder: "Fixl Solutions", isPrimary: false, brand: "bg-gradient-to-br from-zinc-800 to-zinc-950" },
    ]);

    const setPrimary = (id: string) => {
        setPaymentMethods(prev => prev.map(m => ({
            ...m,
            isPrimary: m.id === id,
            brand: m.id === id ? "bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800" : "bg-gradient-to-br from-zinc-800 to-zinc-950"
        })));
    };

    return (
        <div className="space-y-6 text-[#1A1A1A]">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-[22px] font-bold tracking-tight">Payment Sources</h1>
                    <p className="text-[13px] text-zinc-500">Manage your organization's payment sources and billing preferences settings.</p>
                </div>
                <Button
                    onClick={() => setShowAddCardModal(true)}
                    className="rounded-none bg-blue-600 hover:bg-blue-700 font-black text-[11px] h-10 gap-2 shadow-xl shadow-blue-100 uppercase tracking-widest px-8"
                >
                    <Plus size={14} /> Add Secure Source
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paymentMethods.map((method) => (
                    <div key={method.id} className="relative group perspective-1000">
                        <div className={`aspect-[1.58/1] ${method.brand} p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden rounded-none border-b-4 ${method.isPrimary ? 'border-emerald-400 shadow-blue-200/50' : 'border-zinc-700 shadow-zinc-200/50'}`}>
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 backdrop-blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full translate-y-1/2 -translate-x-1/2 backdrop-blur-2xl" />

                            <div className="flex justify-between items-start relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase tracking-[3px] opacity-60">Settlement Node</span>
                                    <span className="text-[20px] font-black tracking-tight">{method.type}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {method.isPrimary && (
                                        <Badge className="bg-emerald-400 text-emerald-950 border-none rounded-none text-[9px] font-black uppercase tracking-widest py-0.5 shadow-sm">
                                            PRIMARY
                                        </Badge>
                                    )}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="text-white/40 hover:text-white transition-colors p-1 hover:bg-white/10">
                                                <MoreVertical size={20} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-none border-zinc-700 bg-zinc-900 text-white shadow-2xl p-2 min-w-[160px]">
                                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[2pt] text-zinc-500 mb-2">Configurations</DropdownMenuLabel>
                                            {!method.isPrimary && (
                                                <DropdownMenuItem className="text-[11px] font-black uppercase tracking-tight p-2 focus:bg-blue-600 cursor-pointer" onClick={() => setPrimary(method.id)}>
                                                    Promote to Primary
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="text-[11px] font-black uppercase tracking-tight p-2 text-rose-400 focus:bg-rose-600 focus:text-white cursor-pointer group">
                                                <Trash2 size={14} className="mr-2 group-hover:scale-110 transition-transform" /> Purge Source
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="text-[24px] font-black tracking-[5pt] text-white/90 drop-shadow-md">
                                    •••• •••• •••• {method.last4}
                                </div>
                                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black uppercase tracking-[2pt] opacity-50">Authorized Holder</span>
                                        <span className="text-[13px] font-black uppercase tracking-tight">{method.holder}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black uppercase tracking-[2pt] opacity-50">Exp Cycle</span>
                                        <span className="text-[13px] font-black font-mono">{method.expiry}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => setShowAddCardModal(true)}
                    className="aspect-[1.58/1] border-2 border-dashed border-zinc-200 bg-zinc-50/50 flex flex-col items-center justify-center gap-4 text-zinc-400 hover:border-blue-400 hover:bg-blue-50/30 hover:text-blue-600 transition-all rounded-none group"
                >
                    <div className="w-14 h-14 rounded-none border-2 border-zinc-100 group-hover:border-blue-200 bg-white flex items-center justify-center shadow-lg group-hover:shadow-blue-100 transition-all rotate-45">
                        <Plus size={28} className="-rotate-45" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[3pt]">Link New Asset</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="bg-white border border-zinc-200 p-8 rounded-none space-y-5 shadow-2xl shadow-zinc-100/50">
                    <div className="flex items-center gap-4 text-blue-600">
                        <div className="p-3 bg-blue-50">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="font-black text-[15px] uppercase tracking-tight">Vault-Grade Integrity</h3>
                    </div>
                    <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">
                        All settlement credentials are encrypted via hardware security modules (HSM) and processed through Tier-1 PCI-DSS compliant infrastructure.
                    </p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-none space-y-5 shadow-2xl shadow-zinc-950/20 text-white">
                    <div className="flex items-center gap-4 text-emerald-400">
                        <div className="p-3 bg-white/5">
                            <Globe size={28} />
                        </div>
                        <h3 className="font-black text-[15px] uppercase tracking-tight">Dynamic Localization</h3>
                    </div>
                    <p className="text-[13px] text-zinc-400 font-medium leading-relaxed">
                        Support for 180+ localized payment protocols including direct clearing and regional tax compliance vectors.
                    </p>
                </div>
            </div>

            <Dialog open={showAddCardModal} onOpenChange={setShowAddCardModal}>
                <DialogContent className="max-w-md rounded-none p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-gradient-to-r from-zinc-900 to-blue-900 p-8 text-white relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Lock size={20} className="text-blue-400" /> SECURE GATEWAY
                        </h2>
                        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-[1pt] mt-2">Initialize encrypted payment source setup.</p>
                    </div>
                    <div className="p-8 space-y-6 bg-white">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[2pt] text-zinc-400">Cardholder Designation</Label>
                            <Input placeholder="LEGAL NAME ON CARD" className="rounded-none border-zinc-200 h-12 text-[14px] font-black uppercase tracking-tight" />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[2pt] text-zinc-400">Asset Number</Label>
                            <div className="relative">
                                <Input placeholder="0000 0000 0000 0000" className="pl-14 rounded-none border-zinc-200 h-12 text-[14px] font-black tracking-[2pt]" />
                                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[2pt] text-zinc-400">Validity Cycle</Label>
                                <div className="relative">
                                    <Input placeholder="MM / YY" className="pl-14 rounded-none border-zinc-200 h-12 text-[14px] font-black" />
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[2pt] text-zinc-400">Security CVC</Label>
                                <div className="relative">
                                    <Input placeholder="•••" className="pl-14 rounded-none border-zinc-200 h-12 text-[14px] font-black" />
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="p-8 bg-zinc-50 border-t border-zinc-100 gap-4 sm:justify-end">
                        <Button variant="ghost" onClick={() => setShowAddCardModal(false)} className="rounded-none font-black text-[11px] uppercase tracking-widest text-zinc-400">ABORT</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 rounded-none font-black text-[11px] px-10 h-12 uppercase tracking-widest shadow-xl shadow-blue-100 underline underline-offset-4 decoration-blue-400">AUTHORIZE SOURCE</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
