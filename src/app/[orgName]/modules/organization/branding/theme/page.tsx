"use client";

import React, { useState, useEffect } from "react";
import {
    Palette,
    Layout,
    Moon,
    Sun,
    Monitor,
    Check,
    RotateCcw,
    Save,
    Settings,
    LayoutDashboard,
    Smartphone,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useBrandingStore } from "../../../../../../lib/useBrandingStore";
import { useTheme } from "next-themes";

export default function ThemeSettingsPage() {
    const {
        primaryColor: storePrimaryColor,
        borderRadius: storeBorderRadius,
        themeMode: storeThemeMode,
        setBranding,
        resetBranding
    } = useBrandingStore()

    const { setTheme } = useTheme()

    const [primaryColor, setPrimaryColor] = useState(storePrimaryColor);
    const [borderRadius, setBorderRadius] = useState(storeBorderRadius);
    const [mode, setMode] = useState(storeThemeMode);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setPrimaryColor(storePrimaryColor)
        setBorderRadius(storeBorderRadius)
        setMode(storeThemeMode)
    }, [storePrimaryColor, storeBorderRadius, storeThemeMode])

    const handleSave = () => {
        setBranding({
            primaryColor,
            borderRadius,
            themeMode: mode as any
        })
        setTheme(mode)
        toast.success("Theme configuration saved globally!")
    };

    const handleReset = () => {
        setPrimaryColor("#2563eb")
        setBorderRadius("0.75")
        setMode("light")
        toast.info("Theme reset to system defaults (Save to apply)");
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto pb-20">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Visual Theme & Style</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage the global colors, interface shapes and appearance mode.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="h-9 gap-2 border-slate-200 font-bold hover:bg-slate-100 transition-all active:scale-95"
                        onClick={handleReset}
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset Defaults
                    </Button>
                    <Button
                        className="h-9 bg-primary text-white gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] active:scale-95"
                        onClick={handleSave}
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Save className="w-4 h-4" />
                        Apply Theme
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* PRIMARY COLOR SELECTION */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden" style={{ borderRadius: `${borderRadius}rem` }}>
                        <CardHeader className="bg-white border-b border-slate-100 pb-4">
                            <CardTitle className="text-base font-bold">Color Palette</CardTitle>
                            <CardDescription className="text-xs">Select your brand's primary color and theme presets.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Pick Custom Color</Label>
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 border-2 border-slate-200 shadow-inner cursor-pointer overflow-hidden relative"
                                        style={{ borderRadius: `${borderRadius}rem`, backgroundColor: primaryColor }}
                                    >
                                        <input
                                            type="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer opacity-0"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <Input
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="font-mono text-lg uppercase font-bold h-12 border-slate-200"
                                            style={{ borderRadius: `${borderRadius}rem` }}
                                        />
                                        <p className="text-[10px] text-slate-400 ml-1 font-bold">HEX CODE FOR SYSTEM BRANDING</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Theme Presets</Label>
                                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                                    {[
                                        { name: "Blue", color: "#2563eb" },
                                        { name: "Violet", color: "#9333ea" },
                                        { name: "Emerald", color: "#059669" },
                                        { name: "Rose", color: "#e11d48" },
                                        { name: "Amber", color: "#d97706" },
                                        { name: "Slate", color: "#475569" },
                                        { name: "Sky", color: "#0284c7" },
                                        { name: "Midnight", color: "#0f172a" }
                                    ].map((preset) => (
                                        <button
                                            key={preset.name}
                                            onClick={() => setPrimaryColor(preset.color)}
                                            className={`group relative h-12 border-2 transition-all flex items-center justify-center ${primaryColor.toLowerCase() === preset.color.toLowerCase() ? "border-slate-900 scale-110 z-10 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"}`}
                                            title={preset.name}
                                            style={{ backgroundColor: preset.color, borderRadius: `${Number(borderRadius) * 0.5}rem` }}
                                        >
                                            {primaryColor.toLowerCase() === preset.color.toLowerCase() && <Check className="w-5 h-5 text-white stroke-[3px]" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* INTERFACE SHAPE / CORNER GEOMETRY */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden" style={{ borderRadius: `${borderRadius}rem` }}>
                        <CardHeader className="bg-white border-b border-slate-100 pb-4">
                            <CardTitle className="text-base font-bold">Corner Geometry (Radius)</CardTitle>
                            <CardDescription className="text-xs">Manage how rounded or sharp your buttons and cards appear.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Geometry Presets</Label>
                                <div className="grid grid-cols-5 gap-3">
                                    {[
                                        { val: "0", label: "Sharp", class: "rounded-none" },
                                        { val: "0.25", label: "Compact", class: "rounded-sm" },
                                        { val: "0.5", label: "Smooth", class: "rounded-md" },
                                        { val: "0.75", label: "Default", class: "rounded-lg" },
                                        { val: "1.25", label: "Curvy", class: "rounded-2xl" }
                                    ].map((rad) => (
                                        <button
                                            key={rad.val}
                                            onClick={() => setBorderRadius(rad.val)}
                                            className={`flex flex-col items-center gap-3 p-4 border-2 transition-all ${borderRadius === rad.val ? "border-primary bg-primary/5 shadow-sm" : "border-slate-100 hover:border-slate-300"}`}
                                            style={{ borderRadius: `${rad.val}rem` }}
                                        >
                                            <div className={`w-8 h-8 border-2 border-primary/40 ${rad.class}`}
                                                style={{ borderRadius: `${rad.val}rem`, borderColor: primaryColor + '44' }}
                                            />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{rad.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Custom Precise Radius</Label>
                                    <Badge variant="outline" className="font-mono text-sm px-3 py-1 bg-slate-50 border-slate-200" style={{ borderRadius: `${borderRadius}rem` }}>{borderRadius}rem</Badge>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                        <span>0rem (Sharp)</span>
                                        <span>2rem (Pill)</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="2"
                                        step="0.05"
                                        value={borderRadius}
                                        onChange={(e) => setBorderRadius(e.target.value)}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                        style={{ accentColor: primaryColor }}
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-100 flex items-center gap-3" style={{ borderRadius: `${borderRadius}rem` }}>
                                <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                                <p className="text-[10px] font-bold text-slate-400 uppercase italic">Geometry changes will propagate to all UI modules instantly.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* SIDEBAR CONFIG */}
                <div className="space-y-6">
                    {/* APPEARANCE MODE */}
                    <Card className="border-slate-200 shadow-sm overflow-hidden" style={{ borderRadius: `${borderRadius}rem` }}>
                        <CardHeader className="bg-white border-b border-slate-100 pb-4">
                            <CardTitle className="text-base font-bold">Appearance</CardTitle>
                            <CardDescription className="text-xs">Default system mode for new users.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-3">
                            {[
                                { id: "light", label: "Light Mode", icon: Sun, color: "text-amber-500" },
                                { id: "dark", label: "Dark Mode", icon: Moon, color: "text-indigo-400" },
                                { id: "system", label: "System Default", icon: Monitor, color: "text-slate-500" }
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id as any)}
                                    className={`w-full flex items-center justify-between p-4 border transition-all ${mode === m.id ? "border-primary bg-primary/5" : "border-slate-100 hover:border-slate-200"}`}
                                    style={{ borderRadius: `${borderRadius}rem` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 bg-slate-100 rounded-lg ${m.color}`}>
                                            <m.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{m.label}</span>
                                    </div>
                                    {mode === m.id && <Check className="w-4 h-4 text-primary" />}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* LIVE PREVIEW MINI */}
                    <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative" style={{ borderRadius: `${borderRadius}rem` }}>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Smartphone className="w-24 h-24" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Settings className="w-4 h-4 animate-spin-slow" style={{ color: primaryColor }} /> Quick Component Test
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="h-6 w-3/4 bg-white/10 rounded" style={{ borderRadius: `${Number(borderRadius) * 0.3}rem` }} />
                                <div className="h-3 w-1/2 bg-white/5 rounded" />
                            </div>
                            <Button
                                className="w-full font-bold h-10 shadow-lg"
                                style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}rem` }}
                            >
                                Preview Button
                            </Button>
                            <Input
                                placeholder="Input radius test"
                                className="bg-white/5 border-white/10 h-10 text-xs text-white"
                                style={{ borderRadius: `${borderRadius}rem` }}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-indigo-600 to-blue-700 text-white overflow-hidden relative" style={{ borderRadius: `${borderRadius}rem` }}>
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield className="w-20 h-20" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-white text-sm font-bold opacity-80 uppercase tracking-widest">Global Governance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-[11px] text-blue-100 leading-relaxed italic">Changes to theme properties affect all workspace members. Ensure compliance with brand guidelines.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
