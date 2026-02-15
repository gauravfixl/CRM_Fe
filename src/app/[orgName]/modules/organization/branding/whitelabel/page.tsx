"use client";

import React, { useState } from "react";
import {
    Globe,
    Lock,
    Link,
    CheckCircle2,
    AlertTriangle,
    RefreshCw,
    Shield,
    Server,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SmallCard, SmallCardHeader, SmallCardContent } from "@/shared/components/custom/SmallCard";

export default function WhiteLabelPage() {
    const [customDomain, setCustomDomain] = useState("portal.mycompany.com");
    const [isVerified, setIsVerified] = useState(false);
    const [removeBranding, setRemoveBranding] = useState(true);
    const [customLogin, setCustomLogin] = useState(true);

    const handleVerify = () => {
        toast.promise(new Promise(res => setTimeout(res, 2000)), {
            loading: "Checking DNS records...",
            success: () => {
                setIsVerified(true);
                return "Domain verified successfully!";
            },
            error: "DNS propagation incomplete. Try again later."
        });
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-indigo-600" />
                        White-Label Settings
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Remove vendor branding and host the portal on your own domain.</p>
                </div>
                <Badge className="bg-indigo-600 text-white font-bold uppercase tracking-widest px-3 py-1 rounded-none shadow-md shadow-indigo-200">
                    Enterprise Feature
                </Badge>
            </div>

            {/* DOMAIN CONFIG */}
            <Card className="border-none shadow-lg rounded-none overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <CardHeader className="bg-white p-6 border-b border-slate-100">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Globe className="w-5 h-5 text-indigo-600" />
                        Custom Domain Configuration
                    </CardTitle>
                    <CardDescription>
                        Serve the application from your own subdomain (e.g., app.yourcompany.com).
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 bg-slate-50/50">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 w-full space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Domain URL</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Link className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <Input
                                        value={customDomain}
                                        onChange={(e) => {
                                            setCustomDomain(e.target.value);
                                            setIsVerified(false);
                                        }}
                                        className={`pl-10 font-mono font-medium rounded-none h-11 border-slate-200 ${isVerified ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'bg-white'}`}
                                    />
                                </div>
                                <Button
                                    className={`h-11 rounded-none px-6 font-bold gap-2 ${isVerified ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-black'}`}
                                    onClick={handleVerify}
                                    disabled={isVerified}
                                >
                                    {isVerified ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" /> Verified
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" /> Verify DNS
                                        </>
                                    )}
                                </Button>
                            </div>

                            {!isVerified && (
                                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-none flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                        <p className="font-bold">DNS Configuration Required</p>
                                        <p className="text-xs leading-relaxed opacity-90">
                                            Create a <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">CNAME</code> record in your DNS provider pointing
                                            <code className="bg-amber-100 px-1 py-0.5 mx-1 rounded font-mono font-bold">{customDomain}</code>
                                            to
                                            <code className="bg-amber-100 px-1 py-0.5 mx-1 rounded font-mono font-bold">cname.fixl.io</code>.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {isVerified && (
                                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-none flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Domain Active & Secured</p>
                                        <p className="text-xs mt-1 opacity-90">SSL Certificate auto-provisioned via Let's Encrypt.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full md:w-80 bg-white p-5 border border-slate-200 shadow-sm rounded-none">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 border-b pb-2">DNS Values</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Type</span>
                                    <Badge variant="outline" className="font-mono font-bold rounded-none">CNAME</Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Host</span>
                                    <span className="font-mono font-bold text-slate-900">portal</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Value</span>
                                    <span className="font-mono font-bold text-blue-600">cname.fixl.io</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">TTL</span>
                                    <span className="font-mono font-bold text-slate-900">3600</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* BRANDING REMOVAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SmallCard className="bg-white shadow-sm border-slate-200 hover:border-indigo-200 transition-colors">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-bold">Remove "Powered By"</CardTitle>
                            <CardDescription className="text-xs">
                                Hide vendor attribution in footer.
                            </CardDescription>
                        </div>
                        <Switch
                            checked={removeBranding}
                            onCheckedChange={setRemoveBranding}
                        />
                    </SmallCardHeader>
                </SmallCard>

                <SmallCard className="bg-white shadow-sm border-slate-200 hover:border-indigo-200 transition-colors">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-bold">Custom Login URL</CardTitle>
                            <CardDescription className="text-xs">
                                Redirect standard login to your domain.
                            </CardDescription>
                        </div>
                        <Switch
                            checked={customLogin}
                            onCheckedChange={setCustomLogin}
                        />
                    </SmallCardHeader>
                </SmallCard>
            </div>
        </div>
    );
}
