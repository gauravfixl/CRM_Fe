"use client";

import React, { useState, useEffect } from "react";
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
import { getOrgAdminSettings, updateOrgAdminSettings } from "@/hooks/orgAdminHooks";

export default function DocBrandingPage() {
    const [companyName, setCompanyName] = useState("Fixl Solutions Inc.");
    const [address, setAddress] = useState("123 Innovation Dr, Suite 400\nSan Francisco, CA 94103\nUnited States");
    const [footerNote, setFooterNote] = useState("Thank you for your business! Please pay within 30 days.");
    const [primaryColor, setPrimaryColor] = useState("#0f172a");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await getOrgAdminSettings();
                const s = res?.data?.settings || res?.data?.data || res?.data || {};
                if (s?.branding?.companyDisplayName) setCompanyName(s.branding.companyDisplayName);
                if (s?.branding?.primaryColor) setPrimaryColor(s.branding.primaryColor);
            } catch (err) {
                // Silent â€” fall back to defaults
            }
        })();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            await updateOrgAdminSettings({
                branding: {
                    companyDisplayName: companyName,
                    primaryColor,
                },
            });
            toast.success("Document settings saved");
        } catch (err: any) {
            console.error("Failed to save document branding:", err);
            toast.error(err?.response?.data?.message || "Failed to update templates");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-background p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Document Branding</h1>
                    <p className="text-sm text-muted-foreground mt-1">Configure layout for PDF Invoices, Quotes, and Purchase Orders.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="h-9 gap-2 border-border font-bold bg-card hover:bg-muted text-foreground"
                        onClick={() => {
                            toast.info("Preparing sample invoice for printing...");
                            setTimeout(() => {
                                window.print();
                            }, 500);
                        }}
                    >
                        <Printer className="w-4 h-4" />
                        Print Sample
                    </Button>
                    <Button
                        className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Save Templates"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
                {/* CONFIGURATION COLUMN */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border shadow-sm bg-card transition-shadow">
                        <CardHeader className="border-b border-border p-5 bg-muted/30">
                            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                                <Building className="w-4 h-4 text-primary" />
                                Entity Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Legal Name on Docs</Label>
                                <Input
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="font-bold bg-background border-border text-foreground focus-visible:ring-primary"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <MapPin className="w-3 h-3" /> Headquarters Address
                                </Label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 bg-background border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tax Registration ID</Label>
                                <Input
                                    defaultValue="US-99-4022-XX"
                                    className="font-mono text-sm bg-background border-border text-foreground"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm bg-card transition-shadow">
                        <CardHeader className="border-b border-border p-5 bg-muted/30">
                            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                                <AlignLeft className="w-4 h-4 text-primary" />
                                Footer & Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Default Footer Note</Label>
                                <textarea
                                    className="w-full min-h-[80px] p-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    value={footerNote}
                                    onChange={(e) => setFooterNote(e.target.value)}
                                />
                                <p className="text-[10px] text-muted-foreground">This text appears at the bottom of every generated PDF.</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accent Color</Label>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 border border-border shadow-inner rounded-md cursor-pointer overflow-hidden relative"
                                         style={{ backgroundColor: primaryColor }}>
                                        <input
                                            type="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer opacity-0"
                                        />
                                    </div>
                                    <Input
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="font-mono text-sm uppercase bg-background border-border text-foreground"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* PREVIEW COLUMN */}
                <div className="lg:col-span-3 bg-zinc-100 dark:bg-zinc-900 border border-border pt-16 pb-8 px-8 flex justify-center overflow-hidden rounded-none shadow-inner relative h-full min-h-[700px]">
                    <div className="absolute top-4 right-4 z-10">
                        <div className="bg-zinc-900 dark:bg-zinc-950 text-white text-[11px] uppercase font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm ring-1 ring-white/20">
                            <Eye className="w-3.5 h-3.5" /> <span className="leading-none mt-[1px]">A4 Preview</span>
                        </div>
                    </div>

                    {/* A4 PAPER - Theme Aware Doc Preview */}
                    <div className="bg-white dark:bg-zinc-950 w-[500px] min-h-[700px] shadow-2xl relative flex flex-col p-8 text-slate-800 dark:text-slate-200 text-[10px] leading-relaxed rounded-none border dark:border-zinc-800 transition-colors">

                        {/* PREVIEW HEADER */}
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex flex-col gap-1">
                                <div className="h-10 w-10 bg-slate-100 mb-2 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{companyName}</h2>
                                <p className="whitespace-pre-line text-slate-500 dark:text-slate-400">{address}</p>
                            </div>
                            <div className="text-right">
                                <h1 className="text-3xl font-black uppercase tracking-tighter" style={{ color: primaryColor }}>INVOICE</h1>
                                <p className="font-bold text-slate-400 dark:text-slate-500 mt-1">#INV-2026-001</p>
                                <p className="text-slate-500 dark:text-slate-400">Date: Jan 17, 2026</p>
                            </div>
                        </div>

                        {/* BILL TO */}
                        <div className="mb-8 p-4 bg-slate-50 dark:bg-zinc-900/50 border-l-4" style={{ borderLeftColor: primaryColor }}>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Bill To</p>
                            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Acme Corp International</p>
                            <p className="text-slate-500 dark:text-slate-400">4500 Business Park Blvd<br />New York, NY 10001</p>
                        </div>

                        {/* TABLE */}
                        <div className="flex-1">
                            <table className="w-full text-left mb-4">
                                <thead>
                                    <tr className="border-b-2 border-slate-900 dark:border-slate-100">
                                        <th className="py-2 text-[9px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">Item Description</th>
                                        <th className="py-2 text-[9px] font-black uppercase tracking-wider text-right text-slate-900 dark:text-slate-100">Hrs/Qty</th>
                                        <th className="py-2 text-[9px] font-black uppercase tracking-wider text-right text-slate-900 dark:text-slate-100">Rate</th>
                                        <th className="py-2 text-[9px] font-black uppercase tracking-wider text-right text-slate-900 dark:text-slate-100">Amount</th>
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
                                    <div className="flex justify-between border-b border-slate-100 dark:border-zinc-800 pb-1">
                                        <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                                        <span className="font-bold text-slate-900 dark:text-slate-100">$3,350.00</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-100 dark:border-zinc-800 pb-1">
                                        <span className="text-slate-500 dark:text-slate-400">Tax (8%)</span>
                                        <span className="font-bold text-slate-900 dark:text-slate-100">$268.00</span>
                                    </div>
                                    <div className="flex justify-between text-base pt-1" style={{ color: primaryColor }}>
                                        <span className="font-black uppercase">Total</span>
                                        <span className="font-black">$3,618.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-zinc-800 text-center text-slate-400 dark:text-slate-500">
                            <p className="font-medium text-slate-600 dark:text-slate-300 mb-1">Terms & Conditions</p>
                            <p>{footerNote}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
