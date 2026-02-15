"use client";

import React, { useState } from "react";
import {
    Languages,
    CalendarClock,
    Binary,
    Globe2,
    Check,
    Save,
    Undo2
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
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function LanguageSettingsPage() {
    const [language, setLanguage] = useState("en-US");
    const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
    const [timeFormat, setTimeFormat] = useState("12h");
    const [numberFormat, setNumberFormat] = useState("comma"); // 1,000.00

    const handleSave = () => {
        toast.success("Localization preferences updated successfully.");
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Language & Region</h1>
                    <p className="text-sm text-slate-500 mt-1">Customize system localization formats and display language.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-9 gap-2 border-slate-200 font-bold rounded-none hover:bg-slate-100">
                        <Undo2 className="w-4 h-4" /> Reset
                    </Button>
                    <Button
                        className="h-9 bg-slate-900 hover:bg-slate-800 text-white gap-2 font-bold shadow-lg shadow-slate-200 rounded-none transition-all hover:translate-y-[-1px]"
                        onClick={handleSave}
                    >
                        <Save className="w-4 h-4" />
                        Apply Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LOCALIZATION FORM */}
                <Card className="border-slate-200 shadow-sm rounded-none hover:shadow-md transition-shadow">
                    <CardHeader className="border-b border-slate-100 p-6 bg-slate-50/50">
                        <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <Globe2 className="w-4 h-4 text-blue-600" />
                            Global Defaults
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4 text-slate-900">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">System Language</Label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger className="font-bold rounded-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="en-US">English (US)</SelectItem>
                                        <SelectItem value="en-GB">English (UK)</SelectItem>
                                        <SelectItem value="es">Español</SelectItem>
                                        <SelectItem value="fr">Français</SelectItem>
                                        <SelectItem value="de">Deutsch</SelectItem>
                                        <SelectItem value="ja">日本語</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Date Format</Label>
                                <Select value={dateFormat} onValueChange={setDateFormat}>
                                    <SelectTrigger className="font-mono rounded-none">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-none font-mono">
                                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</SelectItem>
                                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</SelectItem>
                                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Time Format</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        className={`border p-3 text-center cursor-pointer font-bold rounded-none transition-colors ${timeFormat === '12h' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                        onClick={() => setTimeFormat('12h')}
                                    >
                                        1:30 PM
                                    </div>
                                    <div
                                        className={`border p-3 text-center cursor-pointer font-bold rounded-none transition-colors ${timeFormat === '24h' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                                        onClick={() => setTimeFormat('24h')}
                                    >
                                        13:30
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* PREVIEW CARD */}
                <Card className="border-none shadow-md bg-slate-900 text-white rounded-none relative overflow-hidden flex flex-col justify-center items-center text-center p-8">
                    <div className="absolute top-0 left-0 p-32 bg-blue-600 opacity-20 blur-3xl rounded-full" />
                    <div className="absolute bottom-0 right-0 p-32 bg-indigo-600 opacity-20 blur-3xl rounded-full" />

                    <div className="relative z-10 space-y-8 w-full max-w-sm">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date Preview</p>
                            <p className="text-3xl font-black tracking-tight">
                                {dateFormat === "MM/DD/YYYY" && "01/17/2026"}
                                {dateFormat === "DD/MM/YYYY" && "17/01/2026"}
                                {dateFormat === "YYYY-MM-DD" && "2026-01-17"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Time Preview</p>
                            <p className="text-3xl font-black tracking-tight">
                                {timeFormat === "12h" && "10:45 AM"}
                                {timeFormat === "24h" && "10:45"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Currency Preview</p>
                            <p className="text-3xl font-black tracking-tight flex items-baseline justify-center gap-1">
                                <span className="text-lg opacity-50">$</span>
                                1,234.56
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
