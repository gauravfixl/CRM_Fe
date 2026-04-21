"use client"

import React, { useState, useEffect, useRef } from "react"
import {
    Upload,
    Save,
    RotateCcw,
    Building2,
    Palette,
    ExternalLink,
    X,
    Image as ImageIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useBrandingStore } from "../../../../../lib/useBrandingStore"
import { toast } from "sonner"
import Link from "next/link"
import { useParams } from "next/navigation"

const DEFAULT_LOGO = "/images/cubicleweb.png"

export default function OrgBrandingPage() {
    const { orgName: routeOrgName } = useParams()
    const {
        logoUrl: storeLogoUrl,
        loginLogoUrl: storeLoginLogoUrl,
        orgName: storeOrgName,
        setBranding
    } = useBrandingStore()

    const [orgName, setOrgName] = useState(storeOrgName)
    const [logoUrl, setLogoUrl] = useState(storeLogoUrl)
    const [loginLogoUrl, setLoginLogoUrl] = useState(storeLoginLogoUrl)
    const [mounted, setMounted] = useState(false)

    const mainLogoInputRef = useRef<HTMLInputElement>(null)
    const loginLogoInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        setOrgName(storeOrgName)
        setLogoUrl(storeLogoUrl)
        setLoginLogoUrl(storeLoginLogoUrl)
    }, [storeLogoUrl, storeLoginLogoUrl, storeOrgName])

    const handleApplyChanges = () => {
        const trimmedName = orgName.trim();
        if (!trimmedName) {
            toast.error("Organization name is required");
            return;
        }

        const nameRegex = /^[a-zA-Z0-9\s&\-\.]+$/;
        if (!nameRegex.test(trimmedName)) {
            toast.error("Organization name contains invalid characters");
            return;
        }

        setBranding({
            orgName: trimmedName,
            logoUrl,
            loginLogoUrl
        })
        toast.success("Brand identity updated successfully!")
    }

    const handleReset = () => {
        setOrgName("Cubicle CRM")
        setLogoUrl(DEFAULT_LOGO)
        setLoginLogoUrl(DEFAULT_LOGO)
        toast.info("Identity reset to defaults (Apply to save)")
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'login') => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size exceeds 2MB limit")
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            const base64String = reader.result as string
            if (type === 'main') {
                setLogoUrl(base64String)
            } else {
                setLoginLogoUrl(base64String)
            }
            toast.success(`${type === 'main' ? 'Application' : 'Login'} logo uploaded locally`)
        }
        reader.readAsDataURL(file)
    }

    const removeLogo = (type: 'main' | 'login') => {
        if (type === 'main') {
            setLogoUrl("")
        } else {
            setLoginLogoUrl("")
        }
        toast.info("Logo removed (Apply to save changes)")
    }

    const restoreDefaultLogo = (type: 'main' | 'login') => {
        if (type === 'main') {
            setLogoUrl(DEFAULT_LOGO)
        } else {
            setLoginLogoUrl(DEFAULT_LOGO)
        }
        toast.success("Default logo restored")
    }

    if (!mounted) return null

    return (
        <div className="flex flex-col h-full w-full bg-background p-6 space-y-6 overflow-y-auto pb-20">
            {/* HIDDEN INPUTS */}
            <input
                type="file"
                ref={mainLogoInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'main')}
            />
            <input
                type="file"
                ref={loginLogoInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'login')}
            />

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Organization Branding</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage your brand identity, logos and corporate name.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 gap-2 font-bold border-border bg-card hover:bg-muted" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4" />
                        Reset All Defaults
                    </Button>
                    <Button
                        className="h-9 bg-primary text-primary-foreground gap-2 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 hover:bg-primary/90"
                        onClick={handleApplyChanges}
                    >
                        <Save className="w-4 h-4" />
                        Save Identity
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* BRAND IDENTITY */}
                <div className="md:col-span-8 space-y-6">
                    <Card className="border-border shadow-sm overflow-hidden rounded-xl bg-card">
                        <CardHeader className="bg-card border-b border-border pb-4">
                            <CardTitle className="text-base font-bold text-foreground">Identity & Assets</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">These assets represent your organization across the portal and emails.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Official Organization Name</Label>
                                <Input
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    placeholder="Enter Organization Name"
                                    className="h-11 font-medium text-lg border-border bg-background text-foreground focus:ring-primary/20"
                                />
                                <p className="text-[10px] text-muted-foreground/60">This name will appear on the Login screen, Title bar and legal documents.</p>
                            </div>

                            <Separator className="bg-border" />

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* MAIN LOGO */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Application Logo</Label>
                                        <div className="flex gap-2">
                                            {logoUrl !== DEFAULT_LOGO && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[10px] font-bold text-blue-500 px-2"
                                                    onClick={() => restoreDefaultLogo('main')}
                                                >
                                                    Use Default
                                                </Button>
                                            )}
                                            {logoUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[10px] font-bold text-red-500 px-2"
                                                    onClick={() => removeLogo('main')}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted transition-all cursor-pointer group relative min-h-[160px]"
                                        onClick={() => mainLogoInputRef.current?.click()}
                                    >
                                        {logoUrl ? (
                                            <div className="relative group/img">
                                                <img src={logoUrl} alt="Logo" className="max-h-24 w-auto object-contain transition-transform group-hover/img:scale-105" />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-muted-foreground">
                                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 text-foreground">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-bold text-foreground">Click to upload logo</p>
                                                <p className="text-[10px] mt-1 text-muted-foreground">PNG, SVG or JPG (Max 2MB)</p>
                                            </div>
                                        )}
                                        {logoUrl && (
                                            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                <p className="text-[10px] font-bold bg-card text-foreground px-3 py-1 rounded-full shadow-sm border border-border">Change Image</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* LOGIN LOGO */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Login Form Logo</Label>
                                        <div className="flex gap-2">
                                            {loginLogoUrl !== DEFAULT_LOGO && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[10px] font-bold text-muted-foreground px-2 hover:text-foreground"
                                                    onClick={() => restoreDefaultLogo('login')}
                                                >
                                                    Use Default
                                                </Button>
                                            )}
                                            {loginLogoUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[10px] font-bold text-red-400 px-2 hover:text-red-300"
                                                    onClick={() => removeLogo('login')}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className="border-2 border-dashed border-zinc-700 dark:border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center bg-zinc-900 hover:bg-zinc-800 transition-all cursor-pointer group relative min-h-[160px]"
                                        onClick={() => loginLogoInputRef.current?.click()}
                                    >
                                        {loginLogoUrl ? (
                                            <div className="relative group/img">
                                                <img src={loginLogoUrl} alt="Login Logo" className="max-h-24 w-auto object-contain transition-transform group-hover/img:scale-105 border border-white/5 p-2 rounded" />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-zinc-500">
                                                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-bold text-zinc-300">Click to upload logo</p>
                                                <p className="text-[10px] mt-1 text-zinc-400">Best on dark backgrounds</p>
                                            </div>
                                        )}
                                        {loginLogoUrl && (
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                <p className="text-[10px] font-bold bg-card text-foreground px-3 py-1 rounded-full shadow-sm border border-border">Change Image</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* QUICK ACTIONS / INFO */}
                <div className="md:col-span-4 space-y-6">
                    <Card className="border-border shadow-sm rounded-xl overflow-hidden bg-card">
                        <CardHeader className="border-b border-border">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                                <Palette className="w-4 h-4 text-primary" />
                                Visual Styling
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                                Looking to change colors, dark mode or button shapes? These are managed in the Global Theme section.
                            </p>
                            <Link href={`/${routeOrgName}/modules/organization/branding/theme`}>
                                <Button className="w-full bg-foreground text-background hover:bg-foreground/90 gap-2 font-bold rounded-lg h-10 transition-all active:scale-95 shadow-md">
                                    Go to Theme Settings
                                    <ExternalLink className="w-3 h-3" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Building2 className="w-24 h-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-primary-foreground text-base font-bold">Brand Guidelines</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex gap-2 items-start">
                                    <div className="h-5 w-5 rounded bg-white/10 flex items-center justify-center shrink-0">
                                        <ImageIcon className="h-3 w-3" />
                                    </div>
                                    <p className="text-[10px] text-primary-foreground/80 leading-relaxed">
                                        Use high-resolution transparent PNG or SVG for the application header.
                                    </p>
                                </div>
                                <div className="flex gap-2 items-start">
                                    <div className="h-5 w-5 rounded bg-white/10 flex items-center justify-center shrink-0">
                                        <Building2 className="h-3 w-3" />
                                    </div>
                                    <p className="text-[10px] text-primary-foreground/80 leading-relaxed">
                                        The Login logo should have sufficient contrast for dark backgrounds.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
