"use client";

import React, { useState } from "react";
import {
    Mail,
    Upload,
    Eye,
    Send,
    Palette,
    LayoutTemplate,
    Image as ImageIcon,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";  // Need to ensure this exists or use native
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function EmailBrandingPage() {
    const [template, setTemplate] = useState("welcome");
    const [headerImage, setHeaderImage] = useState<string | null>(null);
    const [footerText, setFooterText] = useState("© 2026 Fixl Solutions. All rights reserved.");
    const [primaryColor, setPrimaryColor] = useState("#2563eb");

    const handleSave = () => {
        toast.promise(new Promise(res => setTimeout(res, 1200)), {
            loading: "Saving email template configurations...",
            success: "Email branding updated successfully",
            error: "Failed to save changes"
        });
    };

    const handleTestEmail = () => {
        toast.success("Test email sent to admin@example.com");
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Email Branding</h1>
                    <p className="text-sm text-slate-500 mt-1">Customize the look and feel of system-generated emails.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="h-9 gap-2 border-slate-200 font-bold rounded-none hover:bg-slate-100"
                        onClick={handleTestEmail}
                    >
                        <Send className="w-4 h-4" />
                        Send Test
                    </Button>
                    <Button
                        className="h-9 bg-blue-600 hover:bg-blue-700 text-white gap-2 font-bold shadow-lg shadow-blue-200 rounded-none transition-all hover:translate-y-[-1px]"
                        onClick={handleSave}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CONFIGURATION COLUMN */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm rounded-none hover:shadow-md transition-shadow">
                        <CardHeader className="border-b border-slate-100 p-5 bg-slate-50/50">
                            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <LayoutTemplate className="w-4 h-4 text-blue-600" />
                                General Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Active Template</Label>
                                <Select value={template} onValueChange={setTemplate}>
                                    <SelectTrigger className="rounded-none font-bold text-sm bg-white border-slate-200">
                                        <SelectValue placeholder="Select template" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none border-slate-200">
                                        <SelectItem value="welcome">Welcome Email</SelectItem>
                                        <SelectItem value="reset">Password Reset</SelectItem>
                                        <SelectItem value="invite">User Invitation</SelectItem>
                                        <SelectItem value="invoice">Invoice Notification</SelectItem>
                                        <SelectItem value="alert">Security Alert</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Brand Assets</Label>

                                <div className="border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div className="h-10 w-10 bg-blue-50 text-blue-500 rounded-none flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-700">Header Logo / Banner</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Recommended: 600x120px PNG</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Footer Text</Label>
                                    <textarea
                                        className="w-full min-h-[80px] p-3 rounded-none border border-slate-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={footerText}
                                        onChange={(e) => setFooterText(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Action Button Color</Label>
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
                <div className="relative">
                    <Card className="border-none shadow-xl bg-slate-200 h-full min-h-[600px] rounded-none overflow-hidden flex flex-col items-center pt-8 pb-8 px-4">
                        <div className="absolute top-4 right-4 flex gap-2">
                            <div className="bg-slate-800 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-none flex items-center gap-2">
                                <Eye className="w-3 h-3" /> Live Preview
                            </div>
                        </div>

                        {/* EMAIL CANVAS */}
                        <div className="bg-white w-full max-w-md shadow-2xl rounded-none overflow-hidden flex flex-col">
                            {/* EMAIL HEADER */}
                            <div className="h-24 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative">
                                {headerImage ? (
                                    <img src={headerImage} alt="Header" className="max-h-16 object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center opacity-30">
                                        <ImageIcon className="w-6 h-6 mb-1" />
                                        <span className="text-[10px] font-bold uppercase">Logo Placeholder</span>
                                    </div>
                                )}
                            </div>

                            {/* EMAIL BODY */}
                            <div className="p-8 space-y-6">
                                <h2 className="text-xl font-bold text-slate-900">
                                    {template === 'welcome' && "Welcome to Fixl Solutions!"}
                                    {template === 'reset' && "Reset Your Password"}
                                    {template === 'invite' && "You've been invited to join"}
                                    {template === 'invoice' && "New Invoice #INV-2024-001"}
                                    {template === 'alert' && "Security Alert: New Login"}
                                </h2>

                                <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                                    <p>Hi [User Name],</p>

                                    {template === 'welcome' && <p>We are thrilled to have you on board! Get started by exploring your new dashboard and setting up your profile.</p>}
                                    {template === 'reset' && <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>}
                                    {template === 'invite' && <p>Your administrator has invited you to join the <strong>Global Tech</strong> organization. Click below to accept.</p>}
                                    {template === 'invoice' && <p>A new invoice for the amount of <strong>$1,200.00</strong> has been generated for your account.</p>}
                                    {template === 'alert' && <p>We detected a new login from <strong>London, UK</strong> on a Windows device. Was this you?</p>}

                                    <div className="py-2">
                                        <button
                                            className="px-6 py-3 text-white font-bold text-sm rounded-none shadow-md hover:opacity-90 transition-opacity"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            {template === 'welcome' && "Get Started"}
                                            {template === 'reset' && "Reset Password"}
                                            {template === 'invite' && "Accept Invitation"}
                                            {template === 'invoice' && "View Invoice"}
                                            {template === 'alert' && "Secure My Account"}
                                        </button>
                                    </div>

                                    <p>
                                        Best regards,<br />
                                        The Team
                                    </p>
                                </div>
                            </div>

                            {/* EMAIL FOOTER */}
                            <div className="bg-slate-50 border-t border-slate-100 p-6 text-center text-xs text-slate-400">
                                <p>{footerText}</p>
                                <div className="mt-2 flex gap-3 justify-center opacity-60">
                                    <a href="#" className="hover:underline">Privacy Policy</a>
                                    <span>•</span>
                                    <a href="#" className="hover:underline">Terms of Service</a>
                                    <span>•</span>
                                    <a href="#" className="hover:underline">Unsubscribe</a>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
