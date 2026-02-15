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
        setBranding({
            orgName,
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
        <div className="flex flex-col h-full w-full bg-slate-50/50 p-6 space-y-6 overflow-y-auto pb-20">
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
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Organization Branding</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your brand identity, logos and corporate name.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-9 gap-2 font-bold" onClick={handleReset}>
                        <RotateCcw className="w-4 h-4" />
                        Reset All Defaults
                    </Button>
                    <Button
                        className="h-9 bg-primary text-primary-foreground gap-2 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
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
                    <Card className="border-slate-200 shadow-sm overflow-hidden rounded-xl">
                        <CardHeader className="bg-white border-b border-slate-100 pb-4">
                            <CardTitle className="text-base font-bold">Identity & Assets</CardTitle>
                            <CardDescription className="text-xs">These assets represent your organization across the portal and emails.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Organization Name</Label>
                                <Input
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    placeholder="Enter Organization Name"
                                    className="h-11 font-medium text-lg border-slate-200"
                                />
                                <p className="text-[10px] text-slate-400">This name will appear on the Login screen, Title bar and legal documents.</p>
                            </div>

                            <Separator className="bg-slate-100" />

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* MAIN LOGO */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Application Logo</Label>
                                        <div className="flex gap-2">
                                            {logoUrl !== DEFAULT_LOGO && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[10px] font-bold text-blue-600 px-2"
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
                                        className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-all cursor-pointer group relative min-h-[160px]"
                                        onClick={() => mainLogoInputRef.current?.click()}
                                    >
                                        {logoUrl ? (
                                            <div className="relative group/img">
                                                <img src={logoUrl} alt="Logo" className="max-h-24 w-auto object-contain transition-transform group-hover/img:scale-105" />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-bold text-slate-700">Click to upload logo</p>
                                                <p className="text-[10px] mt-1">PNG, SVG or JPG (Max 2MB)</p>
                                            </div>
                                        )}
                                        {logoUrl && (
                                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                <p className="text-[10px] font-bold bg-white px-3 py-1 rounded-full shadow-sm">Change Image</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* LOGIN LOGO */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Login Form Logo</Label>
                                        <div className="flex gap-2">
                                            {loginLogoUrl !== DEFAULT_LOGO && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 text-[10px] font-bold text-zinc-400 px-2 hover:text-white"
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
                                        className="border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-900 hover:bg-slate-800 transition-all cursor-pointer group relative min-h-[160px]"
                                        onClick={() => loginLogoInputRef.current?.click()}
                                    >
                                        {loginLogoUrl ? (
                                            <div className="relative group/img">
                                                <img src={loginLogoUrl} alt="Login Logo" className="max-h-24 w-auto object-contain transition-transform group-hover/img:scale-105 border border-white/5 p-2 rounded" />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-500">
                                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                <p className="text-xs font-bold text-zinc-300">Click to upload logo</p>
                                                <p className="text-[10px] mt-1">Best on dark backgrounds</p>
                                            </div>
                                        )}
                                        {loginLogoUrl && (
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                <p className="text-[10px] font-bold bg-white px-3 py-1 rounded-full shadow-sm">Change Image</p>
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
                    <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                        <CardHeader className="border-b border-slate-100">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Palette className="w-4 h-4 text-primary" />
                                Visual Styling
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                Looking to change colors, dark mode or button shapes? These are managed in the Global Theme section.
                            </p>
                            <Link href={`/${routeOrgName}/modules/organization/branding/theme`}>
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 font-bold rounded-lg h-10 transition-all active:scale-95 shadow-md">
                                    Go to Theme Settings
                                    <ExternalLink className="w-3 h-3" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Building2 className="w-24 h-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-white text-base font-bold">Brand Guidelines</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex gap-2 items-start">
                                    <div className="h-5 w-5 rounded bg-white/10 flex items-center justify-center shrink-0">
                                        <ImageIcon className="h-3 w-3" />
                                    </div>
                                    <p className="text-[10px] text-blue-100 leading-relaxed">
                                        Use high-resolution transparent PNG or SVG for the application header.
                                    </p>
                                </div>
                                <div className="flex gap-2 items-start">
                                    <div className="h-5 w-5 rounded bg-white/10 flex items-center justify-center shrink-0">
                                        <Building2 className="h-3 w-3" />
                                    </div>
                                    <p className="text-[10px] text-blue-100 leading-relaxed">
                                        The Login logo should have sufficient contrast for dark backgrounds (ideal for whitelabeling).
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
