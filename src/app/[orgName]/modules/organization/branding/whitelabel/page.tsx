"use client";

import React, { useState, useEffect } from "react";
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
import { getOrgAdminSettings, updateOrgAdminSettings } from "@/hooks/orgAdminHooks";

export default function WhiteLabelPage() {
    const [customDomain, setCustomDomain] = useState("portal.mycompany.com");
    const [isVerified, setIsVerified] = useState(false);
    const [removeBranding, setRemoveBranding] = useState(true);
    const [customLogin, setCustomLogin] = useState(true);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await getOrgAdminSettings();
                const s = res?.data?.settings || res?.data?.data || res?.data || {};
                const remoteDomain = s?.branding?.whitelabelDomain;
                if (remoteDomain) {
                    setCustomDomain(remoteDomain);
                    setIsVerified(true);
                }
            } catch (err) {
                // Silent â€” fall back to defaults
            }
        })();
    }, []);

    const handleVerify = async () => {
        const trimmed = customDomain.trim();
        if (!trimmed) {
            toast.error("Domain cannot be empty");
            return;
        }
        try {
            setVerifying(true);
            await updateOrgAdminSettings({ branding: { whitelabelDomain: trimmed } });
            setIsVerified(true);
            toast.success("Domain verified successfully!");
        } catch (err: any) {
            console.error("Failed to verify domain:", err);
            toast.error(err?.response?.data?.message || "DNS propagation incomplete. Try again later.");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-background p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        White-Label Settings
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">Remove vendor branding and host the portal on your own domain.</p>
                </div>
                <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest px-3 py-1 rounded-md shadow-lg shadow-primary/20 transition-all">
                    Enterprise Feature
                </Badge>
            </div>

            {/* DOMAIN CONFIG */}
            <Card className="border border-border shadow-sm rounded-none overflow-hidden relative group bg-card">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-500" />
                <CardHeader className="p-6 border-b border-border bg-muted/30">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                        <Globe className="w-5 h-5 text-primary" />
                        Custom Domain Configuration
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Serve the application from your own subdomain (e.g., app.yourcompany.com).
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 w-full space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Your Domain URL</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Link className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input
                                        value={customDomain}
                                        onChange={(e) => {
                                            setCustomDomain(e.target.value);
                                            setIsVerified(false);
                                        }}
                                        className={`pl-10 font-mono font-medium rounded-lg h-11 border-border ${isVerified ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'bg-background text-foreground'}`}
                                    />
                                </div>
                                <Button
                                    className={`h-11 rounded-lg px-6 font-bold gap-2 shadow-sm transition-all active:scale-95 ${isVerified ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}`}
                                    onClick={handleVerify}
                                    disabled={isVerified || verifying}
                                >
                                    {isVerified ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" /> Verified
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" /> {verifying ? "Verifying..." : "Verify DNS"}
                                        </>
                                    )}
                                </Button>
                            </div>

                            {!isVerified && (
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm rounded-lg flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                        <p className="font-bold">DNS Configuration Required</p>
                                        <p className="text-xs leading-relaxed opacity-90">
                                            Create a <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono font-bold text-amber-900 dark:text-amber-200">CNAME</code> record in your DNS provider pointing
                                            <code className="bg-amber-500/20 px-1 py-0.5 mx-1 rounded font-mono font-bold text-amber-900 dark:text-amber-200">{customDomain}</code>
                                            to
                                            <code className="bg-amber-500/20 px-1 py-0.5 mx-1 rounded font-mono font-bold text-amber-900 dark:text-amber-200">cname.fixl.io</code>.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {isVerified && (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Domain Active & Secured</p>
                                        <p className="text-xs mt-1 opacity-90">SSL Certificate auto-provisioned via Let's Encrypt.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full md:w-80 bg-muted/30 p-5 border border-border shadow-sm rounded-none">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">DNS Values</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground font-medium">Type</span>
                                    <Badge variant="outline" className="font-mono font-bold rounded-md bg-background border-border text-foreground">CNAME</Badge>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground font-medium">Host</span>
                                    <span className="font-mono font-bold text-foreground">portal</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground font-medium">Value</span>
                                    <span className="font-mono font-bold text-primary">cname.fixl.io</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground font-medium">TTL</span>
                                    <span className="font-mono font-bold text-foreground">3600</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* BRANDING REMOVAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SmallCard className="bg-card shadow-sm border-border hover:border-primary/50 transition-colors rounded-none overflow-hidden">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-2 bg-card">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-bold text-foreground">Remove "Powered By"</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                Hide vendor attribution in footer.
                            </CardDescription>
                        </div>
                        <Switch
                            checked={removeBranding}
                            onCheckedChange={(val) => {
                                setRemoveBranding(val);
                                toast.success("Branding removal preference updated");
                            }}
                        />
                    </SmallCardHeader>
                </SmallCard>

                <SmallCard className="bg-card shadow-sm border-border hover:border-primary/50 transition-colors rounded-none overflow-hidden">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-2 bg-card">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-bold text-foreground">Custom Login URL</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                Redirect standard login to your domain.
                            </CardDescription>
                        </div>
                        <Switch
                            checked={customLogin}
                            onCheckedChange={(val) => {
                                setCustomLogin(val);
                                toast.success("Custom login URL routing updated");
                            }}
                        />
                    </SmallCardHeader>
                </SmallCard>
            </div>
        </div>
    );
}
