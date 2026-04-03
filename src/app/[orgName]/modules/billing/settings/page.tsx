"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FileText, Save, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { showSuccess } from "@/shared/utils/toast";

export default function BillingSettingsPage() {
    const router = useRouter();
    const params = useParams() as { orgName?: string };
    const orgName = params.orgName || "";
    const [isSaving, setIsSaving] = useState(false);
    const [companyName, setCompanyName] = useState("Fixl Solutions Private Limited");
    const [taxId, setTaxId] = useState("29AAAAA0000A1Z5");
    const [billingEmail, setBillingEmail] = useState("accounts@fixlsolutions.com");
    const [industry, setIndustry] = useState("Software & Technology");
    const [address, setAddress] = useState("102, Innovation Hub, Outer Ring Road, Bangalore, Karnataka, 560103, India");
    const [fiscalYear, setFiscalYear] = useState("April");

    const handleSave = () => {
        if (!companyName.trim() || !billingEmail.trim()) {
            return;
        }
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showSuccess("Billing details saved successfully");
        }, 800);
    };

    const quickLinks = [
        { label: "Audit Log", path: `/${orgName}/audit-logs` },
        { label: "Invoices", path: `/${orgName}/modules/billing/invoices` },
        { label: "Payment Methods", path: `/${orgName}/modules/billing/payments` },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            {/* Header */}
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Billing Details</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Manage your organization&apos;s billing information and invoice settings.
                        </p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="sm"
                        className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-5"
                    >
                        <Save size={14} />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                    <p className="text-white text-xs opacity-80">Organization</p>
                    <p className="text-white text-xl font-semibold mt-1">Fixl Solutions</p>
                    <p className="text-white text-[10px] mt-1 opacity-70">Billing entity</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                    <p className="text-zinc-500 text-xs">Tax ID</p>
                    <p className="text-xl font-semibold text-zinc-900 mt-1">29AAA...1Z5</p>
                    <p className="text-primary text-[10px] mt-1">GST registered</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                    <p className="text-zinc-500 text-xs">Currency</p>
                    <p className="text-xl font-semibold text-zinc-900 mt-1">USD</p>
                    <p className="text-zinc-400 text-[10px] mt-1">United States Dollar</p>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                    <p className="text-zinc-500 text-xs">Fiscal Year</p>
                    <p className="text-xl font-semibold text-zinc-900 mt-1">April</p>
                    <p className="text-zinc-400 text-[10px] mt-1">Start month</p>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Company Information */}
                    <div className="bg-white border border-gray-200 rounded-none">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900">Company Information</h3>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Company Legal Name</Label>
                                    <Input
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="rounded-none h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Tax ID (GST/VAT)</Label>
                                    <Input
                                        value={taxId}
                                        onChange={(e) => setTaxId(e.target.value)}
                                        className="rounded-none h-9 text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Billing Email</Label>
                                    <Input
                                        value={billingEmail}
                                        onChange={(e) => setBillingEmail(e.target.value)}
                                        className="rounded-none h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Industry</Label>
                                    <Input
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        className="rounded-none h-9 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div className="bg-white border border-gray-200 rounded-none">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900">Billing Address</h3>
                        </div>
                        <div className="p-5">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">Address</Label>
                                <Textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="rounded-none text-sm min-h-[80px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Regional Settings */}
                    <div className="bg-white border border-gray-200 rounded-none">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900">Regional Settings</h3>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-gray-600">Currency</Label>
                                <Input
                                    defaultValue="USD - United States Dollar"
                                    readOnly
                                    className="rounded-none h-9 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">Fiscal Year Start</Label>
                                <Input
                                    value={fiscalYear}
                                    onChange={(e) => setFiscalYear(e.target.value)}
                                    className="rounded-none h-9 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-6">
                    {/* Invoice Template Card */}
                    <div className="bg-gradient-to-br from-primary to-primary/80 p-5 rounded-none text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-white/10 rounded-none">
                                <FileText size={18} />
                            </div>
                            <h4 className="text-sm font-semibold">Invoice Template</h4>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                            Your billing details are automatically applied to all generated invoices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-white border border-gray-200 rounded-none">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900">Quick Links</h3>
                        </div>
                        <ul>
                            {quickLinks.map((link, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => router.push(link.path)}
                                        className="flex items-center justify-between px-5 py-3 text-sm text-zinc-600 hover:text-primary hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-b-0 w-full text-left"
                                    >
                                        {link.label}
                                        <ChevronRight size={14} className="text-zinc-300" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
