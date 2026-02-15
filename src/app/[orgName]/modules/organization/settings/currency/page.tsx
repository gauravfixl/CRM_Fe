"use client";

import React, { useState } from "react";
import {
    Coins,
    ArrowLeftRight,
    Globe,
    RefreshCw,
    Save,
    TrendingUp,
    Settings as SettingsIcon,
    DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function CurrencySettingsPage() {
    const [baseCurrency, setBaseCurrency] = useState("USD");
    const [autoUpdateRates, setAutoUpdateRates] = useState(true);

    const handleSave = () => {
        toast.promise(new Promise(res => setTimeout(res, 1000)), {
            loading: "Updating ledger configuration...",
            success: "Currency settings saved",
            error: "Failed to update currency"
        });
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Currency & Ledger</h1>
                    <p className="text-sm text-slate-500 mt-1">Configure base currency and exchange rate handling for financial reports.</p>
                </div>
                <Button
                    className="h-9 bg-slate-900 hover:bg-slate-800 text-white gap-2 font-bold shadow-lg shadow-slate-200 rounded-none transition-all hover:translate-y-[-1px]"
                    onClick={handleSave}
                >
                    <Save className="w-4 h-4" />
                    Save Configuration
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* BASE CURRENCY CARD */}
                <Card className="border-none shadow-md rounded-none hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-blue-600 text-white p-6 rounded-none relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Coins className="w-32 h-32" />
                        </div>
                        <CardTitle className="text-xl font-bold flex items-center gap-2 relative z-10">
                            <DollarSign className="w-6 h-6" /> Base Coinage
                        </CardTitle>
                        <CardDescription className="text-blue-100 relative z-10">
                            The primary currency used for all database storage and audit logs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">System Currency</Label>
                            <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                                <SelectTrigger className="h-12 text-lg font-bold rounded-none border-slate-200 bg-slate-50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="USD">USD - United States Dollar</SelectItem>
                                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-none leading-relaxed">
                                <span className="font-bold uppercase block mb-1">Warning</span>
                                Changing the base currency requires a full re-index of all financial records.
                                Historical data may fluctuate due to exchange rate differences at the time of conversion.
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* EXCHANGE RATES CARD */}
                <Card className="border-slate-200 shadow-sm rounded-none hover:shadow-md transition-shadow">
                    <CardHeader className="border-b border-slate-100 p-6 bg-slate-50/50">
                        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-emerald-600" />
                            Exchange Rates
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Manage how multi-currency transactions are normalized.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label className="text-sm font-bold text-slate-900">Automatic Updates</Label>
                                <p className="text-xs text-slate-500">Sync with OpenExchangeRates daily at 00:00 UTC.</p>
                            </div>
                            <Switch checked={autoUpdateRates} onCheckedChange={setAutoUpdateRates} />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Rate Provider</Label>
                            <Select defaultValue="oer">
                                <SelectTrigger className="rounded-none font-medium">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="oer">Open Exchange Rates (Enterprise)</SelectItem>
                                    <SelectItem value="fixer">Fixer.io</SelectItem>
                                    <SelectItem value="ecb">European Central Bank</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-none">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Live Rates (vs USD)</span>
                                <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-600 border-emerald-200 rounded-none uppercase font-bold gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                                </Badge>
                            </div>
                            <div className="space-y-2 text-sm font-mono font-bold text-slate-700">
                                <div className="flex justify-between border-b border-slate-100 pb-1">
                                    <span>EUR</span>
                                    <span>0.914</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-1">
                                    <span>GBP</span>
                                    <span>0.782</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-1">
                                    <span>JPY</span>
                                    <span>147.45</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
