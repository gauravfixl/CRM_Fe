"use client"

import React from "react"
import { Building2, Save, Globe, Lock, Shield, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

export default function GeneralSettingsPage() {
    const { activeWorkspaceId, deleteWorkspace, workspaces } = useWorkspaceStore()

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">General Identity</h3>
                <p className="text-slate-500 font-medium text-[13px]">Define the core branding and identity protocols for this workspace.</p>
            </div>

            <Card className="border-none shadow-sm bg-white rounded-[40px] overflow-hidden">
                <CardContent className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 ml-1">Workspace Name</label>
                                <Input defaultValue="Fixl Solutions" className="h-11 bg-slate-50 border-none rounded-xl px-4 font-semibold text-slate-800 focus:ring-4 focus:ring-indigo-500/10 transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[12px] font-bold text-slate-500 ml-1">Access URL</label>
                                <div className="flex items-center gap-2">
                                    <div className="h-11 flex items-center px-4 bg-slate-100 rounded-xl text-slate-400 font-bold text-xs">fixl.app/</div>
                                    <Input defaultValue="workspace-alpha" className="h-11 bg-slate-50 border-none rounded-xl px-4 font-semibold text-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all flex-1" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[12px] font-bold text-slate-500 ml-1">Workspace Brand</label>
                            <div className="flex items-center gap-6">
                                <div className="h-28 w-28 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-1.5 hover:bg-white hover:border-indigo-300 transition-all cursor-pointer group">
                                    <Building2 size={24} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold">Upload Logo</span>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <p className="text-[11px] font-medium text-slate-500 max-w-[200px]">Recommended: SVG or PNG, at least 512x512px.</p>
                                    <Button variant="outline" className="h-9 rounded-lg border border-slate-200 font-bold text-[11px] text-slate-600">Change Image</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-slate-50/50 rounded-3xl space-y-4 border border-slate-100">
                            <Globe size={20} className="text-indigo-600" />
                            <div className="space-y-1">
                                <h4 className="text-[14px] font-bold text-slate-800">Public Visibility</h4>
                                <p className="text-[11px] font-medium text-slate-400">Allow search engines to index your documentation.</p>
                            </div>
                            <div className="flex h-5 w-9 bg-slate-200 rounded-full cursor-pointer relative items-center px-1">
                                <div className="h-3 w-3 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50/50 rounded-3xl space-y-4 border border-slate-100">
                            <Lock size={20} className="text-amber-600" />
                            <div className="space-y-1">
                                <h4 className="text-[14px] font-bold text-slate-800">Security Hardening</h4>
                                <p className="text-[11px] font-medium text-slate-400">Force all users to utilize 2FA before entering.</p>
                            </div>
                            <div className="flex h-5 w-9 bg-indigo-600 rounded-full cursor-pointer relative items-center px-1">
                                <div className="h-3 w-3 bg-white rounded-full shadow-sm absolute right-1" />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50/50 rounded-3xl space-y-4 border border-slate-100">
                            <Shield size={20} className="text-emerald-600" />
                            <div className="space-y-1">
                                <h4 className="text-[14px] font-bold text-slate-800">Regional Compliance</h4>
                                <p className="text-[11px] font-medium text-slate-400">Enforce GDPR and CCPA data storage protocols.</p>
                            </div>
                            <div className="flex h-5 w-9 bg-indigo-600 rounded-full cursor-pointer relative items-center px-1">
                                <div className="h-3 w-3 bg-white rounded-full shadow-sm absolute right-1" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                            <Badge className="bg-rose-50 text-rose-600 border-none font-bold text-[10px] px-3 h-7">Danger Zone</Badge>
                            <button
                                className="text-[11px] font-bold text-rose-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={workspaces.length <= 1}
                                onClick={() => {
                                    if (activeWorkspaceId && confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
                                        deleteWorkspace(activeWorkspaceId);
                                    }
                                }}
                            >
                                Delete Workspace
                            </button>
                        </div>
                        <Button className="h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[13px] shadow-lg shadow-indigo-100 gap-2">
                            <Save size={16} />
                            Commit Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
