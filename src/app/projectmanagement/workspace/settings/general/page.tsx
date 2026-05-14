"use client"

import React, { useEffect, useState } from "react"
import { Building2, Save, Globe, Lock, Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

export default function GeneralSettingsPage() {
    const [mounted, setMounted] = useState(false)
    const { activeWorkspaceId, deleteWorkspace, updateWorkspace, getActiveWorkspace, workspaces } = useWorkspaceStore()
    const ws = getActiveWorkspace()

    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [icon, setIcon] = useState("")
    const [publicVisibility, setPublicVisibility] = useState(false)
    const [securityHardening, setSecurityHardening] = useState(true)
    const [regionalCompliance, setRegionalCompliance] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [savedAt, setSavedAt] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
        useWorkspaceStore.persist.rehydrate()
    }, [])

    useEffect(() => {
        if (ws) {
            setName(ws.name || "")
            setSlug(ws.slug || "")
            setIcon(ws.icon || "")
            setPublicVisibility(ws.settings?.publicVisibility ?? false)
            setSecurityHardening(ws.settings?.securityHardening ?? true)
            setRegionalCompliance(ws.settings?.regionalCompliance ?? true)
        }
    }, [ws?.id])

    if (!mounted || !ws) return null

    const isDirty =
        name !== (ws.name || "") ||
        slug !== (ws.slug || "") ||
        icon !== (ws.icon || "") ||
        publicVisibility !== (ws.settings?.publicVisibility ?? false) ||
        securityHardening !== (ws.settings?.securityHardening ?? true) ||
        regionalCompliance !== (ws.settings?.regionalCompliance ?? true)

    const handleSave = async () => {
        if (!name.trim() || !slug.trim()) {
            alert("Name and Slug are required.")
            return
        }
        setIsSaving(true)
        await new Promise(r => setTimeout(r, 200))
        updateWorkspace(ws.id, {
            name: name.trim(),
            slug: slug.trim(),
            icon: icon.trim() || "🏢",
            settings: { publicVisibility, securityHardening, regionalCompliance },
        })
        setIsSaving(false)
        setSavedAt(new Date().toLocaleTimeString())
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">General Identity</h3>
                <p className="text-slate-500 font-medium text-[13px]">Define the core branding and identity protocols for this workspace.</p>
            </div>

            <Card className="border-slate-200 shadow-sm bg-white rounded-none overflow-hidden">
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Workspace Name <span className="text-rose-500">*</span></label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Access URL Slug <span className="text-rose-500">*</span></label>
                                <div className="flex items-center gap-2">
                                    <div className="h-10 flex items-center px-3 bg-slate-100 text-slate-500 font-bold text-xs rounded-none">fixl.app/</div>
                                    <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))} className="h-10 flex-1 rounded-none" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Workspace Brand</label>
                            <div className="flex items-center gap-5">
                                <div className="h-24 w-24 bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1 rounded-none">
                                    <span className="text-3xl">{icon || "🏢"}</span>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <p className="text-[11px] font-medium text-slate-500">Use a single emoji as the workspace icon.</p>
                                    <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="🏢" className="h-9 w-20 text-center text-xl rounded-none" maxLength={4} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-5">
                        <button
                            type="button"
                            onClick={() => setPublicVisibility(v => !v)}
                            className="p-5 bg-slate-50 border border-slate-200 hover:bg-white hover:border-indigo-300 transition-colors text-left rounded-none"
                        >
                            <Globe size={18} className={publicVisibility ? "text-indigo-600" : "text-slate-400"} />
                            <h4 className="text-sm font-bold text-slate-800 mt-3">Public Visibility</h4>
                            <p className="text-[11px] font-medium text-slate-500 mt-1">Allow search engines to index your docs.</p>
                            <div className={`mt-3 inline-flex h-5 w-9 rounded-full px-0.5 items-center transition-colors ${publicVisibility ? "bg-indigo-600 justify-end" : "bg-slate-200 justify-start"}`}>
                                <div className="h-4 w-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSecurityHardening(v => !v)}
                            className="p-5 bg-slate-50 border border-slate-200 hover:bg-white hover:border-amber-300 transition-colors text-left rounded-none"
                        >
                            <Lock size={18} className={securityHardening ? "text-amber-600" : "text-slate-400"} />
                            <h4 className="text-sm font-bold text-slate-800 mt-3">Security Hardening</h4>
                            <p className="text-[11px] font-medium text-slate-500 mt-1">Force 2FA for all users entering.</p>
                            <div className={`mt-3 inline-flex h-5 w-9 rounded-full px-0.5 items-center transition-colors ${securityHardening ? "bg-amber-600 justify-end" : "bg-slate-200 justify-start"}`}>
                                <div className="h-4 w-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRegionalCompliance(v => !v)}
                            className="p-5 bg-slate-50 border border-slate-200 hover:bg-white hover:border-emerald-300 transition-colors text-left rounded-none"
                        >
                            <Shield size={18} className={regionalCompliance ? "text-emerald-600" : "text-slate-400"} />
                            <h4 className="text-sm font-bold text-slate-800 mt-3">Regional Compliance</h4>
                            <p className="text-[11px] font-medium text-slate-500 mt-1">Enforce GDPR/CCPA storage protocols.</p>
                            <div className={`mt-3 inline-flex h-5 w-9 rounded-full px-0.5 items-center transition-colors ${regionalCompliance ? "bg-emerald-600 justify-end" : "bg-slate-200 justify-start"}`}>
                                <div className="h-4 w-4 bg-white rounded-full shadow-sm" />
                            </div>
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-rose-50 text-rose-600 font-bold text-[10px] px-3 h-7 rounded-none">Danger Zone</Badge>
                            <button
                                type="button"
                                className="text-[11px] font-bold text-rose-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={workspaces.length <= 1}
                                onClick={() => {
                                    if (activeWorkspaceId && confirm("Delete this workspace? Projects/issues remain but unattached.")) {
                                        deleteWorkspace(activeWorkspaceId)
                                    }
                                }}
                            >
                                Delete Workspace
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            {savedAt && !isDirty && <span className="text-[11px] font-bold text-emerald-600">Saved at {savedAt}</span>}
                            <Button
                                onClick={handleSave}
                                disabled={!isDirty || isSaving || !name.trim() || !slug.trim()}
                                className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2 rounded-none"
                            >
                                {isSaving ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Save Changes</>}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
