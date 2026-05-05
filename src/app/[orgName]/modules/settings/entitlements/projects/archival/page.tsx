"use client"

import React, { useState } from "react"
import {
    Archive,
    Save,
    Clock,
    Trash2,
    RotateCcw,
    CalendarDays,
    AlertTriangle,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/shared/components/ui/label"
import { Slider } from "@/shared/components/ui/slider"
import { showSuccess } from "@/shared/utils/toast"

export default function ProjectArchivalPage() {
    const [isSaving, setIsSaving] = useState(false)
    const [isRecovering, setIsRecovering] = useState(false)
    const [settings, setSettings] = useState({
        enableAutoArchive: true,
        archiveAfterDays: 90,
        enablePermanentDelete: false,
        deleteAfterYears: 2,
    })

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await new Promise((r) => setTimeout(r, 500))
            showSuccess("Archival policies saved")
        } finally {
            setIsSaving(false)
        }
    }

    const handleRecover = async () => {
        setIsRecovering(true)
        try {
            await new Promise((r) => setTimeout(r, 500))
            showSuccess("Recovered 3 projects from archive")
        } finally {
            setIsRecovering(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Retention Policy</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Automate project cleanup and manage data hygiene over time.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleRecover}
                            disabled={isRecovering}
                            variant="outline"
                            size="sm"
                            className="rounded-none border-zinc-200 font-medium text-xs h-8 gap-1.5 px-4"
                        >
                            <RotateCcw size={14} />
                            {isRecovering ? "Recovering..." : "Recover Mode"}
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            size="sm"
                            className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-5"
                        >
                            <Save size={14} />
                            {isSaving ? "Saving..." : "Save Rules"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Archived Projects</p>
                        <p className="text-white text-xl font-semibold mt-1">24</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Stored in cold storage</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Auto-archival</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{settings.enableAutoArchive ? "Enabled" : "Disabled"}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Automation status</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Archive After</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{settings.archiveAfterDays}d</p>
                        <p className="text-primary text-[10px] mt-1">Days of inactivity</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Hard Delete</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{settings.enablePermanentDelete ? "Enabled" : "Disabled"}</p>
                        <p className="text-rose-600 text-[10px] mt-1">After {settings.deleteAfterYears} years</p>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Auto-Archival */}
                    <div className="bg-white border border-gray-200 rounded-none">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Clock size={16} className="text-primary" />
                            <h3 className="text-sm font-semibold text-gray-900">Auto-Archival</h3>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="flex items-center justify-between py-1">
                                <div className="flex-1 pr-4">
                                    <p className="text-xs font-medium text-zinc-700">Enable auto-archival</p>
                                    <p className="text-[11px] text-zinc-500 mt-0.5">Automatically archive projects after inactivity.</p>
                                </div>
                                <Switch
                                    checked={settings.enableAutoArchive}
                                    onCheckedChange={(v) => setSettings({ ...settings, enableAutoArchive: v })}
                                />
                            </div>

                            <div className="space-y-3 pt-4 border-t border-zinc-100">
                                <div className="flex justify-between">
                                    <Label className="text-xs font-medium text-zinc-600">Days since completion</Label>
                                    <span className="text-xs text-primary font-semibold">{settings.archiveAfterDays} days</span>
                                </div>
                                <Slider
                                    max={365}
                                    step={1}
                                    value={[settings.archiveAfterDays]}
                                    onValueChange={(vals) => setSettings({ ...settings, archiveAfterDays: vals[0] })}
                                    disabled={!settings.enableAutoArchive}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Permanent Deletion */}
                    <div className="bg-white border border-rose-100 rounded-none">
                        <div className="px-5 py-4 border-b border-rose-100 bg-rose-50/30 flex items-center gap-2">
                            <Trash2 size={16} className="text-rose-500" />
                            <h3 className="text-sm font-semibold text-rose-700">Permanent Deletion</h3>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="flex items-center justify-between py-1">
                                <div className="flex-1 pr-4">
                                    <p className="text-xs font-medium text-zinc-700">Enable hard delete</p>
                                    <p className="text-[11px] text-zinc-500 mt-0.5">Permanently remove archived data after the set period.</p>
                                </div>
                                <Switch
                                    checked={settings.enablePermanentDelete}
                                    onCheckedChange={(v) => setSettings({ ...settings, enablePermanentDelete: v })}
                                />
                            </div>

                            <div className="space-y-3 pt-4 border-t border-zinc-100">
                                <div className="flex justify-between">
                                    <Label className="text-xs font-medium text-zinc-600">Years in archive</Label>
                                    <span className="text-xs text-rose-600 font-semibold">{settings.deleteAfterYears} years</span>
                                </div>
                                <Slider
                                    max={10}
                                    step={1}
                                    value={[settings.deleteAfterYears]}
                                    onValueChange={(vals) => setSettings({ ...settings, deleteAfterYears: vals[0] })}
                                    disabled={!settings.enablePermanentDelete}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <Archive size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Cold storage</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Archived projects are moved to lower-cost storage and remain fully searchable.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <CalendarDays size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Scheduled cleanup</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Automated rules run nightly to keep data volumes predictable.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-amber-50 rounded-none">
                            <AlertTriangle size={18} className="text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Permanent action</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Hard-deleted projects cannot be recovered. Confirm retention needs before enabling.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
