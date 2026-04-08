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
    const fileInputRef = React.useRef<HTMLInputElement>(null);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setHeaderImage(reader.result as string);
            toast.success("Header image uploaded successfully!");
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col h-full w-full bg-background p-6 space-y-6 overflow-y-auto">
            {/* HIDDEN FILE INPUT */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
            />
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Email Branding</h1>
                    <p className="text-sm text-muted-foreground mt-1">Customize the look and feel of system-generated emails.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="h-9 gap-2 border-border font-bold bg-card hover:bg-muted text-foreground"
                        onClick={handleTestEmail}
                    >
                        <Send className="w-4 h-4" />
                        Send Test
                    </Button>
                    <Button
                        className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
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
                    <Card className="border-border shadow-sm bg-card transition-shadow">
                        <CardHeader className="border-b border-border p-5 bg-muted/30">
                            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                General Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Template</Label>
                                <Select value={template} onValueChange={setTemplate}>
                                    <SelectTrigger className="font-bold text-sm bg-background border-border text-foreground">
                                        <SelectValue placeholder="Select template" />
                                    </SelectTrigger>
                                    <SelectContent className="border-border bg-card">
                                        <SelectItem value="welcome">Welcome Email</SelectItem>
                                        <SelectItem value="reset">Password Reset</SelectItem>
                                        <SelectItem value="invite">User Invitation</SelectItem>
                                        <SelectItem value="invoice">Invoice Notification</SelectItem>
                                        <SelectItem value="alert">Security Alert</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator className="bg-border" />

                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Brand Assets</Label>

                                <div 
                                    className="border-2 border-dashed border-border p-6 flex flex-col items-center justify-center text-center hover:bg-muted font-bold transition-colors cursor-pointer group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm font-bold text-foreground">Header Logo / Banner</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">Recommended: 600x120px PNG</p>
                                </div>
                                {headerImage && (
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="w-full text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 dark:border-red-900/30" 
                                        onClick={() => { setHeaderImage(null); toast.info("Header image removed"); }}
                                    >
                                        Remove Image
                                    </Button>
                                )}

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Footer Text</Label>
                                    <textarea
                                        className="w-full min-h-[80px] p-3 bg-background border border-border text-foreground text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                                        value={footerText}
                                        onChange={(e) => setFooterText(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Action Button Color</Label>
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
                <div className="relative h-full">
                    {/* Live Preview Badge */}
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                        <div className="bg-zinc-900 dark:bg-zinc-950 text-white text-[11px] uppercase font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm ring-1 ring-white/20">
                            <Eye className="w-3.5 h-3.5" /> <span className="leading-none mt-[1px]">Live Preview</span>
                        </div>
                    </div>

                    <Card className="border-none shadow-xl bg-zinc-200 dark:bg-zinc-900/50 h-full min-h-[600px] rounded-xl flex flex-col items-center pt-14 pb-8 px-4 relative">

                        {/* EMAIL CANVAS - Theme Aware Preview */}
                        <div className="bg-white dark:bg-zinc-950 w-full max-w-md shadow-2xl rounded-sm overflow-hidden flex flex-col border dark:border-zinc-800 transition-colors">
                            {/* EMAIL HEADER */}
                            <div className="h-24 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-center relative">
                                {headerImage ? (
                                    <img src={headerImage} alt="Header" className="max-h-16 object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center opacity-30 text-zinc-900 dark:text-zinc-100">
                                        <Mail className="w-6 h-6 mb-1" />
                                        <span className="text-[10px] font-bold uppercase">Logo Placeholder</span>
                                    </div>
                                )}
                            </div>

                            {/* EMAIL BODY */}
                            <div className="p-8 space-y-6">
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                    {template === 'welcome' && "Welcome to Fixl Solutions!"}
                                    {template === 'reset' && "Reset Your Password"}
                                    {template === 'invite' && "You've been invited to join"}
                                    {template === 'invoice' && "New Invoice #INV-2024-001"}
                                    {template === 'alert' && "Security Alert: New Login"}
                                </h2>

                                <div className="space-y-4 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
                                    <p>Hi [User Name],</p>

                                    {template === 'welcome' && <p>We are thrilled to have you on board! Get started by exploring your new dashboard and setting up your profile.</p>}
                                    {template === 'reset' && <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>}
                                    {template === 'invite' && <p>Your administrator has invited you to join the <strong>Global Tech</strong> organization. Click below to accept.</p>}
                                    {template === 'invoice' && <p>A new invoice for the amount of <strong>$1,200.00</strong> has been generated for your account.</p>}
                                    {template === 'alert' && <p>We detected a new login from <strong>London, UK</strong> on a Windows device. Was this you?</p>}

                                    <div className="py-2">
                                        <button
                                            className="px-6 py-3 text-white font-bold text-sm rounded-md shadow-md hover:opacity-90 transition-opacity"
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
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 p-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
                                <p>{footerText}</p>
                                <div className="mt-2 flex gap-3 justify-center opacity-70">
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
