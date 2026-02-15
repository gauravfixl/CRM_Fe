"use client";

import React, { useState } from "react";
import {
    FileText,
    Upload,
    Eye,
    Save,
    Printer,
    Building,
    MapPin,
    Hash,
    AlignLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function DocBrandingPage() {
    const [companyName, setCompanyName] = useState("Fixl Solutions Inc.");
    const [address, setAddress] = useState("123 Innovation Dr, Suite 400\nSan Francisco, CA 94103\nUnited States");
    const [footerNote, setFooterNote] = useState("Thank you for your business! Please pay within 30 days.");
    const [primaryColor, setPrimaryColor] = useState("#0f172a");

    const handleSave = () => {
        toast.promise(new Promise(res => setTimeout(res, 1200)), {
            loading: "Generating PDF templates...",
            success: "Document settings saved",
            error: "Failed to update templates"
        });
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Document Branding</h1>
                    <p className="text-sm text-slate-500 mt-1">Configure layout for PDF Invoices, Quotes, and Purchase Orders.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="h-9 gap-2 border-slate-200 font-bold rounded-none hover:bg-slate-100"
                        onClick={() => toast.info("Printing sample invoice...")}
                    >
                        <Printer className="w-4 h-4" />
                        Print Sample
                    </Button>
                    <Button
                        className="h-9 bg-slate-900 hover:bg-slate-800 text-white gap-2 font-bold shadow-lg shadow-slate-200 rounded-none transition-all hover:translate-y-[-1px]"
                        onClick={handleSave}
                    >
                        <Save className="w-4 h-4" />
                        Save Templates
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                {/* CONFIGURATION COLUMN */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm rounded-none hover:shadow-md transition-shadow">
                        <CardHeader className="border-b border-slate-100 p-5 bg-slate-50/50">
                            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Building className="w-4 h-4 text-slate-600" />
                                Entity Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Legal Name on Docs</Label>
                                <Input
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="font-bold rounded-none border-slate-200 focus-visible:ring-slate-900"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Headquarters Address
                                </Label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-none border border-slate-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none leading-relaxed"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tax Registration ID</Label>
                                <Input
                                    defaultValue="US-99-4022-XX"
                                    className="font-mono text-sm rounded-none border-slate-200"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm rounded-none hover:shadow-md transition-shadow">
                        <CardHeader className="border-b border-slate-100 p-5 bg-slate-50/50">
                            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-slate-600" />
                                Footer & Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Default Footer Note</Label>
                                <textarea
                                    className="w-full min-h-[80px] p-3 rounded-none border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                                    value={footerNote}
                                    onChange={(e) => setFooterNote(e.target.value)}
                                />
                                <p className="text-[10px] text-slate-400">This text appears at the bottom of every generated PDF.</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Accent Color</Label>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 border border-slate-200 shadow-inner rounded-none cursor-pointer overflow-hidden relative">
                                        <input
                                            type="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer p-0 border-0"
                                        />
                                    </div>
                                    <Input
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="font-mono text-sm uppercase rounded-none"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* PREVIEW COLUMN */}
                <div className="lg:col-span-3 bg-zinc-100 border border-zinc-200 p-8 flex justify-center overflow-hidden rounded-none shadow-inner relative">
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-none shadow-sm flex items-center gap-2">
                        <Eye className="w-3 h-3" /> A4 Preview
                    </div>

                    {/* A4 PAPER */}
                    <div className="bg-white w-[500px] min-h-[700px] shadow-2xl relative flex flex-col p-8 text-slate-800 text-[10px] leading-relaxed">

                        {/* HEADER */}
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex flex-col gap-1">
                                <div className="h-10 w-10 bg-slate-100 mb-2 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">{companyName}</h2>
                                <p className="whitespace-pre-line text-slate-500">{address}</p>
                            </div>
                            <div className="text-right">
                                <h1 className="text-3xl font-black uppercase tracking-tighter" style={{ color: primaryColor }}>INVOICE</h1>
                                <p className="font-bold text-slate-400 mt-1">#INV-2026-001</p>
                                <p className="text-slate-500">Date: Jan 17, 2026</p>
                            </div>
                        </div>

                        {/* BILL TO */}
                        <div className="mb-8 p-4 bg-slate-50 border-l-4" style={{ borderLeftColor: primaryColor }}>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Bill To</p>
                            <p className="font-bold text-sm text-slate-900">Acme Corp International</p>
                            <p className="text-slate-500">4500 Business Park Blvd<br />New York, NY 10001</p>
                        </div>

                        {/* TABLE */}
                        <div className="flex-1">
                            <table className="w-full text-left mb-4">
                                <thead>
                                    <tr className="border-b-2 border-slate-900">
                                        <th className="py-2 text-[9px] font-black uppercase tracking-wider">Item Description</th>
                                        <th className="py-2 text-[9px] font-black uppercase tracking-wider text-right">Hrs/Qty</th>
                                        <th className="py-2 text-[9px] font-black uppercase tracking-wider text-right">Rate</th>
                                        <th className="py-2 text-[9px] font-black uppercase tracking-wider text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <tr>
                                        <td className="py-3 font-medium">Enterprise CRM License (Annual)</td>
                                        <td className="py-3 text-right">10</td>
                                        <td className="py-3 text-right">$45.00</td>
                                        <td className="py-3 text-right font-bold">$450.00</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 font-medium">Implementation Service</td>
                                        <td className="py-3 text-right">24</td>
                                        <td className="py-3 text-right">$100.00</td>
                                        <td className="py-3 text-right font-bold">$2,400.00</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 font-medium">Data Migration Add-on</td>
                                        <td className="py-3 text-right">1</td>
                                        <td className="py-3 text-right">$500.00</td>
                                        <td className="py-3 text-right font-bold">$500.00</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="flex justify-end">
                                <div className="w-48 space-y-2">
                                    <div className="flex justify-between border-b border-slate-100 pb-1">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className="font-bold">$3,350.00</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 pb-1">
                                        <span className="text-slate-500">Tax (8%)</span>
                                        <span className="font-bold">$268.00</span>
                                    </div>
                                    <div className="flex justify-between text-base pt-1" style={{ color: primaryColor }}>
                                        <span className="font-black uppercase">Total</span>
                                        <span className="font-black">$3,618.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-slate-400">
                            <p className="font-medium text-slate-600 mb-1">Terms & Conditions</p>
                            <p>{footerNote}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
