"use client";

import React, { useState } from "react";
import {
    Shield,
    Globe,
    Smartphone,
    Clock,
    MapPin,
    Laptop,
    Plus,
    Trash2,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const initialIPs = [
    { id: "ip-1", address: "203.0.113.1", label: "HQ Office (VPN)", active: true },
    { id: "ip-2", address: "198.51.100.0/24", label: "Remote Dev Team", active: true },
];

export default function AccessPoliciesPage() {
    const [allowedIPs, setAllowedIPs] = useState(initialIPs);
    const [newIP, setNewIP] = useState("");
    const [newLabel, setNewLabel] = useState("");

    const [mfaEnforced, setMfaEnforced] = useState(true);
    const [deviceTrust, setDeviceTrust] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState("30");

    const handleAddIP = () => {
        if (!newIP) return;
        setAllowedIPs([...allowedIPs, { id: `ip-${Date.now()}`, address: newIP, label: newLabel || "Custom Range", active: true }]);
        setNewIP("");
        setNewLabel("");
        toast.success("IP Range allowlisted.");
    };

    const handleRemoveIP = (id: string) => {
        setAllowedIPs(prev => prev.filter(ip => ip.id !== id));
        toast.info("IP Range removed.");
    };

    const handleSave = () => {
        toast.promise(new Promise(res => setTimeout(res, 1000)), {
            loading: "Propagating firewall rules...",
            success: "Access policies applied globally.",
            error: "Failed to update policies."
        });
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-slate-600" />
                        Access & Security Policies
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Configure network restrictions, session limits, and device trust rules.</p>
                </div>
                <Button
                    className="h-9 bg-slate-900 hover:bg-slate-800 text-white gap-2 font-bold shadow-lg shadow-slate-200 rounded-none transition-all hover:translate-y-[-1px]"
                    onClick={handleSave}
                >
                    <Save className="w-4 h-4" />
                    Apply Rules
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* NETWORK SECURITY */}
                <Card className="border-none shadow-md rounded-none hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-slate-900 text-white p-6">
                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                            <Globe className="w-5 h-5 text-blue-400" /> Network Restrictions
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Limit access to specific IP addresses or subnets.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    className="rounded-none font-mono text-sm bg-slate-50"
                                    placeholder="e.g. 192.168.1.1 or 10.0.0.0/24"
                                    value={newIP}
                                    onChange={(e) => setNewIP(e.target.value)}
                                />
                                <Input
                                    className="rounded-none text-sm"
                                    placeholder="Label (optional)"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                />
                                <Button className="rounded-none bg-blue-600 font-bold" onClick={handleAddIP}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-slate-500">Allowed Ranges</Label>
                                {allowedIPs.map((ip) => (
                                    <div key={ip.id} className="flex items-center justify-between p-3 border border-slate-200 bg-white hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-slate-100 flex items-center justify-center text-slate-400">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-mono font-bold text-slate-900 text-sm">{ip.address}</p>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">{ip.label}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50"
                                            onClick={() => handleRemoveIP(ip.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-none flex gap-2">
                            <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>Enabling IP restrictions without adding your current IP may lock you out immediately.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* DEVICE & SESSION */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm rounded-none">
                        <CardHeader className="border-b border-slate-100 p-6">
                            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-600" />
                                Session Lifecycle
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label className="font-bold text-slate-700">Idle Session Timeout</Label>
                                    <span className="text-sm font-bold text-blue-600">{sessionTimeout} minutes</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="120"
                                    step="5"
                                    value={sessionTimeout}
                                    onChange={(e) => setSessionTimeout(e.target.value)}
                                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <p className="text-xs text-slate-400">Users will be automatically logged out after inactivity.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm rounded-none">
                        <CardHeader className="border-b border-slate-100 p-6">
                            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-slate-600" />
                                Device & Authentication
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50/50">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-emerald-600 mt-1" />
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Enforce MFA</h4>
                                        <p className="text-xs text-slate-500">Require 2FA for all users.</p>
                                    </div>
                                </div>
                                <Switch checked={mfaEnforced} onCheckedChange={setMfaEnforced} />
                            </div>

                            <div className="flex items-center justify-between p-3 border border-slate-100 bg-slate-50/50">
                                <div className="flex items-start gap-3">
                                    <Laptop className="w-5 h-5 text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900">Device Trust</h4>
                                        <p className="text-xs text-slate-500">Only allow managed devices (MDM).</p>
                                    </div>
                                </div>
                                <Switch checked={deviceTrust} onCheckedChange={setDeviceTrust} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
