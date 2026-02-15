"use client";

import React, { useState } from "react";
import {
    Archive,
    Clock,
    FileText,
    Mail,
    Database,
    Scale,
    AlertTriangle,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function RetentionPolicyPage() {
    const [auditLogRetention, setAuditLogRetention] = useState("7y");
    const [fileRetention, setFileRetention] = useState("3y");
    const [emailRetention, setEmailRetention] = useState("5y");
    const [legalHold, setLegalHold] = useState(false);

    const handleSave = () => {
        toast.promise(new Promise(res => setTimeout(res, 2000)), {
            loading: "Updating global retention rules...",
            success: "Policy updated successfully.",
            error: "Failed to update policy."
        });
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Archive className="w-6 h-6 text-slate-600" />
                        Data Retention Policies
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Configure automated lifecycle management for organizational data.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        className="h-9 bg-slate-900 hover:bg-slate-800 text-white gap-2 font-bold shadow-lg shadow-slate-200 rounded-none transition-all hover:translate-y-[-1px]"
                        onClick={handleSave}
                    >
                        <Save className="w-4 h-4" />
                        Save Policy
                    </Button>
                </div>
            </div>

            {/* LEGAL HOLD ALERT */}
            <div className={`p-6 border-l-4 rounded-none shadow-sm flex items-start gap-4 transition-colors ${legalHold ? 'bg-red-50 border-red-500' : 'bg-emerald-50 border-emerald-500'}`}>
                <div className={`p-2 rounded-full ${legalHold ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    <Scale className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-bold ${legalHold ? 'text-red-900' : 'text-emerald-900'}`}>
                            Legal Hold Status: {legalHold ? "ACTIVE" : "INACTIVE"}
                        </h3>
                        <Switch checked={legalHold} onCheckedChange={setLegalHold} />
                    </div>
                    <p className={`text-sm mt-1 font-medium ${legalHold ? 'text-red-800' : 'text-emerald-800'}`}>
                        {legalHold
                            ? "All automated deletion schedules are currently suspended. Data cannot be purged until this hold is lifted."
                            : "Standard retention schedules are active. Data will be automatically purged according to the policies below."
                        }
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* AUDIT LOGS */}
                <Card className="border-t-4 border-t-amber-500 border-x-0 border-b-0 shadow-md rounded-none hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <Clock className="w-5 h-5 text-amber-500" /> Audit Log Retention
                        </CardTitle>
                        <CardDescription>System access and activity tracking.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="uppercase text-xs font-bold text-slate-500">Retention Period</Label>
                            <Select value={auditLogRetention} onValueChange={setAuditLogRetention} disabled={legalHold}>
                                <SelectTrigger className="font-bold rounded-none h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="1y">1 Year</SelectItem>
                                    <SelectItem value="3y">3 Years</SelectItem>
                                    <SelectItem value="5y">5 Years</SelectItem>
                                    <SelectItem value="7y">7 Years (Compliance Standard)</SelectItem>
                                    <SelectItem value="forever">Indefinite</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-slate-400 bg-slate-50 p-3 italic">
                            Used for security audits, compliance reporting, and incident investigation.
                        </p>
                    </CardContent>
                </Card>

                {/* USER FILES */}
                <Card className="border-t-4 border-t-blue-500 border-x-0 border-b-0 shadow-md rounded-none hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <Database className="w-5 h-5 text-blue-500" /> User Files & Blobs
                        </CardTitle>
                        <CardDescription>Documents, images, and attachments.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="uppercase text-xs font-bold text-slate-500">Retention Period</Label>
                            <Select value={fileRetention} onValueChange={setFileRetention} disabled={legalHold}>
                                <SelectTrigger className="font-bold rounded-none h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="1y">1 Year</SelectItem>
                                    <SelectItem value="3y">3 Years</SelectItem>
                                    <SelectItem value="5y">5 Years</SelectItem>
                                    <SelectItem value="forever">Indefinite (High Storage Cost)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-slate-400 bg-slate-50 p-3 italic">
                            Applies to all files stored in cloud object storage buckets linked to this org.
                        </p>
                    </CardContent>
                </Card>

                {/* COMMUNICATIONS */}
                <Card className="border-t-4 border-t-indigo-500 border-x-0 border-b-0 shadow-md rounded-none hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <Mail className="w-5 h-5 text-indigo-500" /> Communication Data
                        </CardTitle>
                        <CardDescription>Chat logs, emails, and notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="uppercase text-xs font-bold text-slate-500">Retention Period</Label>
                            <Select value={emailRetention} onValueChange={setEmailRetention} disabled={legalHold}>
                                <SelectTrigger className="font-bold rounded-none h-11">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="6m">6 Months</SelectItem>
                                    <SelectItem value="1y">1 Year</SelectItem>
                                    <SelectItem value="3y">3 Years</SelectItem>
                                    <SelectItem value="5y">5 Years</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-slate-400 bg-slate-50 p-3 italic">
                            Includes internal chat messages and logged email correspondence.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* AUTO PURGE SETTINGS */}
            <Card className="border-none shadow-sm rounded-none">
                <CardHeader className="bg-slate-50 p-5 border-b border-slate-100">
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Archive className="w-4 h-4 text-slate-500" />
                        Soft-Delete Recovery Window
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1">
                            <p className="font-bold text-slate-900">Trash Bin Lifespan</p>
                            <p className="text-sm text-slate-500">How long deleted items remain recoverable before permanent purge.</p>
                        </div>
                        <div className="w-full md:w-64">
                            <Select defaultValue="30d">
                                <SelectTrigger className="font-bold rounded-none h-11 bg-slate-50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="7d">7 Days</SelectItem>
                                    <SelectItem value="14d">14 Days</SelectItem>
                                    <SelectItem value="30d">30 Days (Standard)</SelectItem>
                                    <SelectItem value="90d">90 Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
