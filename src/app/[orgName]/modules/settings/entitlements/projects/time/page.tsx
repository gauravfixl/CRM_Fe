"use client"

import React, { useState } from "react"
import {
    Timer,
    Save,
    Clock,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { showSuccess } from "@/shared/utils/toast"

export default function TimeTrackingDefaultsPage() {
    const [isSaving, setIsSaving] = useState(false)
    const [settings, setSettings] = useState({
        trackingUnit: "hours",
        billableDefault: true,
        approvalRequired: false,
        dailyCapacity: 8,
        overtimeThreshold: 40,
    })

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await new Promise((r) => setTimeout(r, 500))
            showSuccess("Time settings updated successfully")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Time Policies</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Configure global time logs and estimation defaults for all projects.
                        </p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="sm"
                        className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-5"
                    >
                        <Save size={14} />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Tracking Unit</p>
                        <p className="text-white text-xl font-semibold mt-1 capitalize">{settings.trackingUnit}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Standard measure</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Daily Capacity</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{settings.dailyCapacity}h</p>
                        <p className="text-primary text-[10px] mt-1">Per team member</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Overtime Threshold</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{settings.overtimeThreshold}h</p>
                        <p className="text-amber-600 text-[10px] mt-1">Weekly limit</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Approval</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{settings.approvalRequired ? "Required" : "Optional"}</p>
                        <p className="text-zinc-400 text-[10px] mt-1">Manager sign-off</p>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* General Defaults */}
                    <div className="bg-white border border-gray-200 rounded-none">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Clock size={16} className="text-primary" />
                            <h3 className="text-sm font-semibold text-gray-900">General Defaults</h3>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">Tracking Unit</Label>
                                <Select
                                    value={settings.trackingUnit}
                                    onValueChange={(v) => setSettings({ ...settings, trackingUnit: v })}
                                >
                                    <SelectTrigger className="rounded-none h-9 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hours">Hours &amp; Minutes</SelectItem>
                                        <SelectItem value="points">Story Points</SelectItem>
                                        <SelectItem value="days">Man Days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Daily Capacity (hrs)</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={24}
                                        value={settings.dailyCapacity}
                                        onChange={(e) => setSettings({ ...settings, dailyCapacity: parseInt(e.target.value) || 0 })}
                                        className="rounded-none h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Overtime Threshold (hrs/wk)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={168}
                                        value={settings.overtimeThreshold}
                                        onChange={(e) => setSettings({ ...settings, overtimeThreshold: parseInt(e.target.value) || 0 })}
                                        className="rounded-none h-9 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rules & Validation */}
                    <div className="bg-white border border-gray-200 rounded-none">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-primary" />
                            <h3 className="text-sm font-semibold text-gray-900">Rules &amp; Validation</h3>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="flex items-center justify-between py-1">
                                <div className="flex-1 pr-4">
                                    <p className="text-xs font-medium text-zinc-700">Mark billable by default</p>
                                    <p className="text-[11px] text-zinc-500 mt-0.5">New time logs assume billable status unless changed.</p>
                                </div>
                                <Switch
                                    checked={settings.billableDefault}
                                    onCheckedChange={(v) => setSettings({ ...settings, billableDefault: v })}
                                />
                            </div>

                            <div className="flex items-center justify-between py-1 border-t border-zinc-100 pt-4">
                                <div className="flex-1 pr-4">
                                    <p className="text-xs font-medium text-zinc-700">Require approval</p>
                                    <p className="text-[11px] text-zinc-500 mt-0.5">Manager must approve logs before they are final.</p>
                                </div>
                                <Switch
                                    checked={settings.approvalRequired}
                                    onCheckedChange={(v) => setSettings({ ...settings, approvalRequired: v })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <Timer size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Consistent time logging</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                These defaults apply to every new project unless overridden by project leads.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-amber-50 rounded-none">
                            <AlertTriangle size={18} className="text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Overtime alerts</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Users receive a notification when logged hours exceed the weekly threshold.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
