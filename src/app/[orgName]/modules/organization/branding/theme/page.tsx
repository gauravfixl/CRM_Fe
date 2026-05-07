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
import { getOrgAdminSettings, updateOrgAdminSettings } from "@/hooks/orgAdminHooks";

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
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setPrimaryColor(storePrimaryColor)
        setBorderRadius(storeBorderRadius)
        setMode(storeThemeMode)
    }, [storePrimaryColor, storeBorderRadius, storeThemeMode])

    useEffect(() => {
        (async () => {
            try {
                const res = await getOrgAdminSettings()
                const s = res?.data?.settings || res?.data?.data || res?.data || {}
                const remoteColor = s?.branding?.primaryColor
                if (remoteColor) {
                    setPrimaryColor(remoteColor)
                    setBranding({ primaryColor: remoteColor })
                }
            } catch (err) {
                // Silent â€” fall back to Zustand store
            }
        })()
    }, [setBranding])

    const handleSave = async () => {
        try {
            setSaving(true)
            await updateOrgAdminSettings({ branding: { primaryColor } })
            setBranding({
                primaryColor,
                borderRadius,
                themeMode: mode as any
            })
            setTheme(mode)
            toast.success("Theme configuration saved globally!")
        } catch (err: any) {
            console.error("Failed to save theme:", err)
            toast.error(err?.response?.data?.message || "Failed to save theme")
        } finally {
            setSaving(false)
        }
    };

    const handleReset = () => {
        setPrimaryColor("#2563eb")
        setBorderRadius("0.75")
        setMode("light")
        toast.info("Theme reset to system defaults (Save to apply)");
    };

    if (!mounted) return null;

    return (
        <div className="flex flex-col h-full w-full bg-background p-6 space-y-6 overflow-y-auto pb-20">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Visual Theme & Style</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage the global colors, interface shapes and appearance mode.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="h-9 gap-2 border-border font-bold hover:bg-muted text-foreground transition-all active:scale-95 bg-card"
                        onClick={handleReset}
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset Defaults
                    </Button>
                    <Button
                        className="h-9 bg-primary text-primary-foreground gap-2 font-bold shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px] active:scale-95"
                        onClick={handleSave}
                        disabled={saving}
                        style={{ backgroundColor: primaryColor }}
                    >
                        <Save className="w-4 h-4" />
                        {saving ? "Saving..." : "Apply Theme"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* PRIMARY COLOR SELECTION */}
                    <Card className="border-border shadow-sm overflow-hidden bg-card" style={{ borderRadius: `${borderRadius}rem` }}>
                        <CardHeader className="bg-card border-b border-border pb-4">
                            <CardTitle className="text-base font-bold text-foreground">Color Palette</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">Select your brand's primary color and theme presets.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pick Custom Color</Label>
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 border-2 border-border shadow-inner cursor-pointer overflow-hidden relative"
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
                                            className="font-mono text-lg uppercase font-bold h-12 border-border bg-background text-foreground"
                                            style={{ borderRadius: `${borderRadius}rem` }}
                                        />
                                        <p className="text-[10px] text-muted-foreground ml-1 font-bold">HEX CODE FOR SYSTEM BRANDING</p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Theme Presets</Label>
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
                                            className={`group relative h-12 border-2 transition-all flex items-center justify-center ${primaryColor.toLowerCase() === preset.color.toLowerCase() ? "border-foreground scale-110 z-10 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"}`}
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
                    <Card className="border-border shadow-sm overflow-hidden bg-card" style={{ borderRadius: `${borderRadius}rem` }}>
                        <CardHeader className="bg-card border-b border-border pb-4">
                            <CardTitle className="text-base font-bold text-foreground">Corner Geometry (Radius)</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">Manage how rounded or sharp your buttons and cards appear.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Geometry Presets</Label>
                                <div className="grid grid-cols-5 gap-3">
                                    {[
                                        { val: "0", label: "Sharp", class: "rounded-none" },
                                        { val: "0.25", label: "Compact", class: "rounded-sm" },
                                        { val: "0.5", label: "Smooth", class: "rounded-md" },
                                        { val: "0.75", label: "Default", class: "rounded-lg" },
                                        { val: "1.25", label: "Curvy", class: "rounded-none" }
                                    ].map((rad) => (
                                        <button
                                            key={rad.val}
                                            onClick={() => setBorderRadius(rad.val)}
                                            className={`flex flex-col items-center gap-3 p-4 border-2 transition-all ${borderRadius === rad.val ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/30 bg-background"}`}
                                            style={{ borderRadius: `${rad.val}rem` }}
                                        >
                                            <div className={`w-8 h-8 border-2 ${rad.class}`}
                                                style={{ borderRadius: `${rad.val}rem`, borderColor: primaryColor + '44' }}
                                            />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{rad.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Custom Precise Radius</Label>
                                    <Badge variant="outline" className="font-mono text-sm px-3 py-1 bg-muted border-border text-foreground" style={{ borderRadius: `${borderRadius}rem` }}>{borderRadius}rem</Badge>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
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
                                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                        style={{ accentColor: primaryColor }}
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-muted/50 border border-border flex items-center gap-3" style={{ borderRadius: `${borderRadius}rem` }}>
                                <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
                                <p className="text-[10px] font-bold text-muted-foreground uppercase italic text-center w-full">Geometry changes will propagate to all UI modules instantly.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* SIDEBAR CONFIG */}
                <div className="space-y-6">
                    {/* APPEARANCE MODE */}
                    <Card className="border-border shadow-sm overflow-hidden bg-card" style={{ borderRadius: `${borderRadius}rem` }}>
                        <CardHeader className="bg-card border-b border-border pb-4">
                            <CardTitle className="text-base font-bold text-foreground">Appearance</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">Default system mode for new users.</CardDescription>
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
                                    className={`w-full flex items-center justify-between p-4 border transition-all ${mode === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/20 bg-background"}`}
                                    style={{ borderRadius: `${borderRadius}rem` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 bg-muted rounded-lg ${m.color}`}>
                                            <m.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-foreground">{m.label}</span>
                                    </div>
                                    {mode === m.id && <Check className="w-4 h-4 text-primary" />}
                                </button>
                            ))}
                        </CardContent>
                    </Card>

                    {/* LIVE PREVIEW MINI */}
                    <Card className="border-none shadow-xl bg-zinc-900 text-white overflow-hidden relative" style={{ borderRadius: `${borderRadius}rem` }}>
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Smartphone className="w-24 h-24 text-white" />
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
                                className="w-full font-bold h-10 shadow-lg text-white"
                                style={{ backgroundColor: primaryColor, borderRadius: `${borderRadius}rem` }}
                                onClick={() => toast.success("This is how your primary buttons will feel!")}
                            >
                                Preview Button
                            </Button>
                            <Input
                                placeholder="Input radius test"
                                className="bg-white/5 border-white/10 h-10 text-xs text-white placeholder:text-white/30"
                                style={{ borderRadius: `${borderRadius}rem` }}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-indigo-600 to-blue-700 text-white overflow-hidden relative" style={{ borderRadius: `${borderRadius}rem` }}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-white">
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
