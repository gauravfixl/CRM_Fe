"use client";

import React, { useState } from "react";
import { FileText, Save, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { showSuccess } from "@/shared/utils/toast";

export default function BillingSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showSuccess("Billing details saved successfully");
        }, 1000);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">Billing Details</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your organization's billing information and invoice settings.
                    </p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-none bg-primary hover:bg-primary/90 h-9 text-sm font-medium gap-2 px-5"
                >
                    <Save size={14} />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
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
                                    <Label className="text-xs font-medium text-gray-600">Company Legal Name</Label>
                                    <Input
                                        defaultValue="Fixl Solutions Private Limited"
                                        className="rounded-none h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-gray-600">Tax ID (GST/VAT)</Label>
                                    <Input
                                        defaultValue="29AAAAA0000A1Z5"
                                        className="rounded-none h-9 text-sm font-mono"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-gray-600">Billing Email</Label>
                                    <Input
                                        defaultValue="accounts@fixlsolutions.com"
                                        className="rounded-none h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-gray-600">Industry</Label>
                                    <Input
                                        defaultValue="Software & Technology"
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
                                <Label className="text-xs font-medium text-gray-600">Address</Label>
                                <Textarea
                                    defaultValue="102, Innovation Hub, Outer Ring Road, Bangalore, Karnataka, 560103, India"
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
                                <Label className="text-xs font-medium text-gray-600">Fiscal Year Start</Label>
                                <Input
                                    defaultValue="April"
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
                            {["Audit Log", "Tax Certificates", "Purchase Orders"].map((label, i) => (
                                <li key={i}>
                                    <a
                                        href="#"
                                        className="flex items-center justify-between px-5 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                                    >
                                        {label}
                                        <ChevronRight size={14} className="text-gray-300" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
