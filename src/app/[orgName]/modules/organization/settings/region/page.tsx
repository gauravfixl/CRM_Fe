"use client";

import React, { useState } from "react";
import {
    Globe,
    Map as MapIcon,
    ShieldCheck,
    Server,
    AlertTriangle,
    Clock,
    CalendarCheck,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function RegionSettingsPage() {
    const [region, setRegion] = useState("us-east");
    const [timezone, setTimezone] = useState("utc-5");

    const handleSave = () => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 3000)), {
            loading: "Migrating data residency pointers...",
            success: "Data region updated successfully.",
            error: "Migration failed. Contact support."
        });
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Region & Timezone</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage data residency, compliance zones, and organization time settings.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        className="h-9 bg-red-600 hover:bg-red-700 text-white gap-2 font-bold shadow-lg shadow-red-200 rounded-none transition-all"
                        onClick={handleSave}
                    >
                        <Server className="w-4 h-4" />
                        Update Residency
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* DATA REGION CONFIG */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-md rounded-none overflow-hidden hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-slate-900 text-white p-6 relative">
                            <div className="absolute top-0 right-0 p-6 opacity-20">
                                <Globe className="w-24 h-24 text-white" />
                            </div>
                            <CardTitle className="text-lg font-bold flex items-center gap-2 relative z-10">
                                <Server className="w-5 h-5 text-emerald-400" />
                                Primary Data Center
                            </CardTitle>
                            <CardDescription className="text-slate-400 relative z-10">
                                Physical location where your organization's data is stored at rest.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Select Region</label>
                                <Select value={region} onValueChange={setRegion}>
                                    <SelectTrigger className="h-14 bg-slate-50 border-slate-200 text-lg font-bold rounded-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="us-east">
                                            <span className="flex items-center gap-2">
                                                🇺🇸 US East (N. Virginia)
                                                <Badge className="ml-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none rounded-none text-[10px]">Recommended</Badge>
                                            </span>
                                        </SelectItem>
                                        <SelectItem value="eu-central">🇪🇺 EU Central (Frankfurt)</SelectItem>
                                        <SelectItem value="ap-southeast">🇸🇬 Asia Pacific (Singapore)</SelectItem>
                                        <SelectItem value="ca-central">🇨🇦 Canada (Central)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border border-emerald-100 bg-emerald-50/50 rounded-none flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-emerald-900 text-sm">Compliance Ready</h4>
                                        <p className="text-xs text-emerald-700 mt-1">
                                            {region.startsWith('us') ? "SOC2 Type II, HIPAA, PCI-DSS Level 1 compliant." :
                                                region.startsWith('eu') ? "GDPR, ISO 27001, SOC2 compliant." : "ISO 27001, SOC2 compliant."}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-none flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-blue-900 text-sm">Low Latency</h4>
                                        <p className="text-xs text-blue-700 mt-1">
                                            Estimated latency for your users: <span className="font-bold">24ms</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 border border-amber-200 flex gap-4 items-start">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-amber-900 uppercase">Migration Warning</h4>
                                    <p className="text-xs text-amber-800 leading-relaxed">
                                        Changing your data region will initiate a background migration process.
                                        Services may experience degraded performance for up to 4 hours.
                                        This action is logged for audit purposes.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* TIMEZONE CARD */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm rounded-none hover:shadow-md transition-shadow">
                        <CardHeader className="border-b border-slate-100 p-6 bg-slate-50/50">
                            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <CalendarCheck className="w-4 h-4 text-slate-600" />
                                Time Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Corporate Timezone</label>
                                <Select value={timezone} onValueChange={setTimezone}>
                                    <SelectTrigger className="font-medium rounded-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="utc-8">Pacific Time (US & Canada)</SelectItem>
                                        <SelectItem value="utc-5">Eastern Time (US & Canada)</SelectItem>
                                        <SelectItem value="utc+0">UTC (Coordinated Universal Time)</SelectItem>
                                        <SelectItem value="utc+1">Central European Time</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-slate-400">Affects dashboard analytics and scheduled jobs.</p>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-medium">Business Days</span>
                                    <span className="font-bold text-slate-900">Mon - Fri</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 font-medium">Fiscal Year Start</span>
                                    <span className="font-bold text-slate-900">January 1st</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 p-4 border-t border-slate-100">
                            <Button variant="outline" className="w-full h-8 text-xs font-bold uppercase rounded-none border-slate-300">
                                Edit Calendar
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
