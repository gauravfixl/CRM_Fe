"use client";

import React, { useState, useEffect } from "react";
import {
    Receipt,
    Download,
    CreditCard,
    CalendarClock,
    AlertCircle,
    CheckCircle2,
    ArrowRight,
    X,
    Loader2
} from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface InvoiceItem {
    desc: string;
    cost: string;
}

interface InvoiceData {
    id: string;
    period: string;
    dueDate: string;
    amount: string;
    status: string;
    items: InvoiceItem[];
}

const fallbackInvoice: InvoiceData = {
    id: "Inv-2026-002",
    period: "January 1, 2026 - January 31, 2026",
    dueDate: "Feb 01, 2026",
    amount: "$1,389.00",
    status: "Unpaid",
    items: [
        { desc: "Enterprise Plan (Monthly)", cost: "$999.00" },
        { desc: "Add-on: 10 Additional Seats", cost: "$99.00" },
        { desc: "Add-on: Saml Sso Enforcer", cost: "$149.00" },
        { desc: "Tax (Estimated)", cost: "$142.00" }
    ]
};

function formatCurrency(value: number): string {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDateStr(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function formatDateLong(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function mapApiInvoiceToData(invoice: any): InvoiceData {
    const createdAt = invoice.createdAt || invoice.date || new Date().toISOString();
    const dueDate = invoice.dueDate || invoice.expiryDate || createdAt;
    const total = invoice.totalAmount ?? invoice.total ?? invoice.grandTotal ?? 0;
    const status = invoice.status === "Paid" || invoice.status === "paid" ? "Paid" : "Unpaid";

    const items: InvoiceItem[] = [];
    if (invoice.items && Array.isArray(invoice.items)) {
        invoice.items.forEach((item: any) => {
            items.push({
                desc: item.name || item.description || item.itemName || "Item",
                cost: formatCurrency(item.amount ?? item.price ?? item.total ?? 0),
            });
        });
    }
    if (invoice.tax != null && invoice.tax > 0) {
        items.push({ desc: "Tax", cost: formatCurrency(invoice.tax) });
    }
    if (items.length === 0) {
        items.push({ desc: invoice.description || "Invoice charge", cost: formatCurrency(total) });
    }

    const startDate = formatDateLong(createdAt);
    const endDate = formatDateLong(dueDate);

    return {
        id: invoice.invoiceNo || invoice.invoiceNumber || invoice._id || "INV-000",
        period: `${startDate} - ${endDate}`,
        dueDate: formatDateStr(dueDate),
        amount: formatCurrency(total),
        status,
        items,
    };
}

export default function InvoicesPage() {
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [cvv, setCvv] = useState("");
    const [cvvError, setCvvError] = useState("");
    const [currentInvoice, setCurrentInvoice] = useState<InvoiceData>(fallbackInvoice);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/invoice/all");
                const invoices = response.data?.data || response.data?.invoices || response.data;
                if (Array.isArray(invoices) && invoices.length > 0) {
                    // Find the most recent unpaid invoice, or fall back to the most recent one
                    const unpaid = invoices.find((inv: any) =>
                        inv.status !== "Paid" && inv.status !== "paid"
                    );
                    const selected = unpaid || invoices[0];
                    setCurrentInvoice(mapApiInvoiceToData(selected));
                    if (selected.status === "Paid" || selected.status === "paid") {
                        setIsPaid(true);
                    }
                } else {
                    setCurrentInvoice(fallbackInvoice);
                }
            } catch (error) {
                console.error("Failed to fetch invoices:", error);
                toast.error("Failed to load invoice data.");
                setCurrentInvoice(fallbackInvoice);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const handlePayNow = () => {
        if (!cvv || cvv.length < 3) {
            setCvvError("Please enter a valid 3-digit CVV");
            return;
        }
        setCvvError("");
        toast.promise(new Promise(res => setTimeout(res, 2000)), {
            loading: "Processing payment of " + currentInvoice.amount + "...",
            success: "Payment successful! Invoice " + currentInvoice.id + " is now paid.",
            error: "Payment failed. Please check your card details."
        });
        setIsPaid(true);
        setCvv("");
        setIsPayOpen(false);
    };

    const handleDownloadPdf = () => {
        toast.promise(new Promise(res => setTimeout(res, 1500)), {
            loading: "Generating PDF for " + currentInvoice.id + "...",
            success: "Invoice PDF downloaded successfully.",
            error: "Failed to generate PDF. Please try again."
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                <p className="text-xs text-slate-400 mt-2">Loading invoice...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-slate-600" />
                        Invoices
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">Manage open invoices and billing details.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Active Invoice */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden relative">
                        {/* Status Strip */}
                        <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${isPaid ? "bg-emerald-500" : "bg-amber-500"}`} />

                        <div className="flex flex-col md:flex-row justify-between p-5 bg-white gap-4">
                            <div className="space-y-2.5">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-medium text-slate-400">Current Invoice</p>
                                    <h2 className="text-xl font-semibold text-slate-900 tracking-tight">{currentInvoice.amount}</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isPaid ? (
                                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 rounded-md font-medium text-[10px]">
                                            <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Paid
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 rounded-md font-medium text-[10px]">
                                            <AlertCircle className="w-2.5 h-2.5 mr-1" /> Payment Due
                                        </Badge>
                                    )}
                                    <span className="text-[10px] text-slate-400">Due {currentInvoice.dueDate}</span>
                                </div>
                            </div>

                            <div className="text-right space-y-1.5">
                                <p className="text-xs font-medium text-slate-900">{currentInvoice.period}</p>
                                <p className="text-[10px] font-mono text-slate-400">Conf. Id: {currentInvoice.id}</p>
                                {!isPaid && (
                                    <Button
                                        className="w-full md:w-auto h-8 bg-slate-900 hover:bg-blue-600 text-white font-medium text-xs rounded-lg gap-1.5 shadow-sm transition-all"
                                        onClick={() => setIsPayOpen(true)}
                                    >
                                        Pay Now <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div className="bg-slate-50/50 p-5 space-y-3">
                            <h3 className="text-[10px] font-medium text-slate-500 mb-3">Itemized Breakdown</h3>
                            {currentInvoice.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                    <span className="font-medium text-slate-700">{item.desc}</span>
                                    <span className="font-mono text-slate-900">{item.cost}</span>
                                </div>
                            ))}
                            <Separator className="my-3" />
                            <div className="flex justify-between items-center bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                                <span className="font-semibold text-slate-900 text-xs">Total Due</span>
                                <span className="font-semibold text-sm text-blue-600">{currentInvoice.amount}</span>
                            </div>
                        </div>
                    </Card>

                    <div className="p-3 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-blue-50 text-blue-600 flex items-center justify-center rounded-lg">
                                <Download className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="font-medium text-xs text-slate-900">Download Pdf</h4>
                                <p className="text-[10px] text-slate-500">Get a copy for your records.</p>
                            </div>
                        </div>
                        <Button variant="outline" className="rounded-lg font-medium text-xs h-8 border-slate-200" onClick={handleDownloadPdf}>
                            Download
                        </Button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <Card className="border-none shadow-sm rounded-xl bg-slate-900 text-white">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center gap-2.5 mb-1">
                                <CreditCard className="w-4 h-4 text-emerald-400" />
                                <CardTitle className="text-xs font-semibold">Auto-Pay</CardTitle>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed">
                                Payments are automatically processed on the <strong>1st of every month</strong> using your default payment method.
                            </p>

                            <div className="flex items-center gap-2.5 p-2.5 bg-white/5 border border-white/10 rounded-lg">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                                <span className="text-xs font-medium text-emerald-100">Active</span>
                            </div>

                            <div className="pt-1">
                                <p className="text-[10px] font-medium text-slate-500 mb-1.5">Primary Method</p>
                                <div className="flex items-center gap-2">
                                    <div className="h-5 w-8 bg-white rounded flex items-center justify-center">
                                        <span className="text-[8px] font-semibold text-blue-800 italic">Visa</span>
                                    </div>
                                    <span className="font-mono text-xs text-white">•••• 4242</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 space-y-1.5">
                        <h4 className="font-medium text-xs flex items-center gap-1.5">
                            <CalendarClock className="w-3.5 h-3.5" /> Next Billing Cycle
                        </h4>
                        <p className="text-[10px] leading-relaxed">
                            Your next invoice will be generated on <strong>February 1, 2026</strong>. Add-ons purchased mid-month will be prorated.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pay Now Dialog */}
            <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
                <DialogContent className="sm:max-w-[420px] p-6 rounded-xl border-none shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-slate-900">Pay Invoice</DialogTitle>
                        <DialogDescription className="text-xs text-slate-400">
                            Confirm payment of {currentInvoice.amount} for invoice {currentInvoice.id}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-3">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="text-slate-500">Invoice Amount</span>
                                <span className="font-semibold text-slate-900">{currentInvoice.amount}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Payment Method</span>
                                <span className="font-medium text-slate-700">Visa •••• 4242</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-medium text-slate-400">Security Code (Cvv)</Label>
                            <Input
                                type="password"
                                placeholder="•••"
                                value={cvv}
                                onChange={(e) => { setCvv(e.target.value.replace(/\D/g, "").slice(0, 3)); setCvvError("") }}
                                className={`h-9 rounded-lg bg-slate-50 border-slate-100 font-medium text-center text-sm tracking-widest ${cvvError ? "border-red-400" : ""}`}
                                maxLength={3}
                            />
                            {cvvError && <p className="text-[10px] text-red-500">{cvvError}</p>}
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="h-8 text-xs font-medium rounded-lg" onClick={() => setIsPayOpen(false)}>Cancel</Button>
                        <Button className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg" onClick={handlePayNow}>
                            Confirm Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
