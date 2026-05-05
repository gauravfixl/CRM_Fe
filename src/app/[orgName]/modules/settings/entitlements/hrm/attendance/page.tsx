"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    Save,
    MapPin,
    Coffee,
    Monitor,
    Clock,
    LogOut,
    CalendarClock,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/components/ui/label"
import { showSuccess, showError } from "@/utils/toast"
import {
    getActiveAttendancePolicy,
    upsertAttendancePolicy,
} from "@/modules/hrm/hooks/hrmHooks"

export default function AttendanceRulesPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    const [settings, setSettings] = useState({
        allowRemote: true,
        geoFencing: false,
        breakDuration: 60,
        halfDayThreshold: 4,
        autoCheckout: true,
    })

    const [policySettings, setPolicySettings] = useState({
        lateAllowedMinutes: 15,
        halfDayThresholdMinutes: 240,
        absentThresholdMinutes: 480,
        overtimeMinMinutes: 60,
        allowEarlyPunch: false,
        allowLatePunch: true,
        sandwichLeaveRule: false,
        allowBackdatedRegularization: true,
        maxBackdateDays: 3,
    })

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const response = await getActiveAttendancePolicy()
                const data = response?.data?.data
                if (data) {
                    setPolicySettings({
                        lateAllowedMinutes: data.lateAllowedMinutes ?? 15,
                        halfDayThresholdMinutes: data.halfDayThresholdMinutes ?? 240,
                        absentThresholdMinutes: data.absentThresholdMinutes ?? 480,
                        overtimeMinMinutes: data.overtimeMinMinutes ?? 60,
                        allowEarlyPunch: data.allowEarlyPunch ?? false,
                        allowLatePunch: data.allowLatePunch ?? true,
                        sandwichLeaveRule: data.sandwichLeaveRule ?? false,
                        allowBackdatedRegularization: data.allowBackdatedRegularization ?? true,
                        maxBackdateDays: data.maxBackdateDays ?? 3,
                    })
                    setSettings((prev) => ({
                        ...prev,
                        halfDayThreshold: Math.round((data.halfDayThresholdMinutes ?? 240) / 60),
                    }))
                }
            } catch (err: any) {
                if (err?.response?.status !== 404) {
                    showError("Failed to load attendance policy")
                }
            } finally {
                setIsFetching(false)
            }
        }
        fetchPolicy()
    }, [])

    const mode = useMemo(() => {
        if (settings.allowRemote && settings.geoFencing) return "Hybrid"
        if (settings.allowRemote && !settings.geoFencing) return "Remote"
        return "Office"
    }, [settings.allowRemote, settings.geoFencing])

    const handleSave = async () => {
        setIsLoading(true)
        try {
            await upsertAttendancePolicy({
                lateAllowedMinutes: policySettings.lateAllowedMinutes,
                halfDayThresholdMinutes: settings.halfDayThreshold * 60,
                absentThresholdMinutes: policySettings.absentThresholdMinutes,
                overtimeMinMinutes: policySettings.overtimeMinMinutes,
                allowEarlyPunch: policySettings.allowEarlyPunch,
                allowLatePunch: policySettings.allowLatePunch,
                sandwichLeaveRule: policySettings.sandwichLeaveRule,
                allowBackdatedRegularization: policySettings.allowBackdatedRegularization,
                maxBackdateDays: policySettings.maxBackdateDays,
            })
            showSuccess("Attendance rules updated")
        } catch {
            showError("Failed to save attendance rules")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        )
    }

    const ToggleRow = ({
        title, desc, checked, onChange,
    }: { title: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) => (
        <div className="flex items-center justify-between gap-4 py-3 border-b border-zinc-100 last:border-0">
            <div className="flex-1">
                <p className="text-xs font-semibold text-zinc-700">{title}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Attendance Rules</h1>
                        <p className="text-sm text-zinc-500 mt-1">Compliance and tracking configuration for clock-ins, breaks, and regularization.</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                    >
                        <Save size={14} /> {isLoading ? "Saving..." : "Save Rules"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Work Mode</p>
                        <p className="text-white text-xl font-semibold mt-1">{mode}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Current policy</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Break Duration</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{settings.breakDuration} min</p>
                        <p className="text-primary text-[10px] mt-1">Max allowed</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Half-day Threshold</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{settings.halfDayThreshold} hrs</p>
                        <p className="text-amber-600 text-[10px] mt-1">Minimum work hours</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Auto Checkout</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{settings.autoCheckout ? "Enabled" : "Disabled"}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">End-of-day rule</p>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Location & Access */}
                    <div className="bg-white border border-zinc-200 rounded-none shadow-lg">
                        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/30 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-zinc-500" />
                            <h3 className="text-sm font-semibold text-zinc-900">Location & Access</h3>
                        </div>
                        <div className="px-5 py-2">
                            <ToggleRow
                                title="Allow Remote Clock-in"
                                desc="Employees can mark attendance from any IP."
                                checked={settings.allowRemote}
                                onChange={(v) => setSettings({ ...settings, allowRemote: v })}
                            />
                            <ToggleRow
                                title="Enforce Geo-fencing"
                                desc="Require GPS location within office radius."
                                checked={settings.geoFencing}
                                onChange={(v) => setSettings({ ...settings, geoFencing: v })}
                            />
                            <ToggleRow
                                title="Allow Early Punch"
                                desc="Employees can clock in before shift start."
                                checked={policySettings.allowEarlyPunch}
                                onChange={(v) => setPolicySettings({ ...policySettings, allowEarlyPunch: v })}
                            />
                            <ToggleRow
                                title="Allow Late Punch"
                                desc="Employees can clock in after shift start."
                                checked={policySettings.allowLatePunch}
                                onChange={(v) => setPolicySettings({ ...policySettings, allowLatePunch: v })}
                            />
                        </div>
                    </div>

                    {/* Breaks & Thresholds */}
                    <div className="bg-white border border-zinc-200 rounded-none shadow-lg">
                        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/30 flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-zinc-500" />
                            <h3 className="text-sm font-semibold text-zinc-900">Breaks & Thresholds</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Max Break (min)</Label>
                                    <Input
                                        type="number"
                                        value={settings.breakDuration}
                                        onChange={(e) => setSettings({ ...settings, breakDuration: parseInt(e.target.value) || 0 })}
                                        className="rounded-none h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Half-day (hours)</Label>
                                    <Input
                                        type="number"
                                        value={settings.halfDayThreshold}
                                        onChange={(e) => setSettings({ ...settings, halfDayThreshold: parseInt(e.target.value) || 0 })}
                                        className="rounded-none h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Late Allowed (min)</Label>
                                    <Input
                                        type="number"
                                        value={policySettings.lateAllowedMinutes}
                                        onChange={(e) => setPolicySettings({ ...policySettings, lateAllowedMinutes: parseInt(e.target.value) || 0 })}
                                        className="rounded-none h-9 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Absent After (min)</Label>
                                    <Input
                                        type="number"
                                        value={policySettings.absentThresholdMinutes}
                                        onChange={(e) => setPolicySettings({ ...policySettings, absentThresholdMinutes: parseInt(e.target.value) || 0 })}
                                        className="rounded-none h-9 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">Overtime Minimum (min)</Label>
                                <Input
                                    type="number"
                                    value={policySettings.overtimeMinMinutes}
                                    onChange={(e) => setPolicySettings({ ...policySettings, overtimeMinMinutes: parseInt(e.target.value) || 0 })}
                                    className="rounded-none h-9 text-sm"
                                />
                            </div>
                            <div className="pt-2 border-t border-zinc-100">
                                <ToggleRow
                                    title="Auto Checkout"
                                    desc="System checks out at 11:59 PM if employee forgets."
                                    checked={settings.autoCheckout}
                                    onChange={(v) => setSettings({ ...settings, autoCheckout: v })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Leave & Regularization */}
                    <div className="bg-white border border-zinc-200 rounded-none shadow-lg lg:col-span-2">
                        <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/30 flex items-center gap-2">
                            <CalendarClock className="w-4 h-4 text-zinc-500" />
                            <h3 className="text-sm font-semibold text-zinc-900">Leave & Regularization</h3>
                        </div>
                        <div className="px-5 py-2">
                            <ToggleRow
                                title="Sandwich Leave Rule"
                                desc="Count weekends or holidays between consecutive leaves as leaves."
                                checked={policySettings.sandwichLeaveRule}
                                onChange={(v) => setPolicySettings({ ...policySettings, sandwichLeaveRule: v })}
                            />
                            <ToggleRow
                                title="Allow Backdated Regularization"
                                desc="Employees can request attendance correction for past dates."
                                checked={policySettings.allowBackdatedRegularization}
                                onChange={(v) => setPolicySettings({ ...policySettings, allowBackdatedRegularization: v })}
                            />
                            {policySettings.allowBackdatedRegularization && (
                                <div className="py-3 space-y-1.5">
                                    <Label className="text-xs font-medium text-zinc-600">Max Backdate Days</Label>
                                    <Input
                                        type="number"
                                        value={policySettings.maxBackdateDays}
                                        onChange={(e) => setPolicySettings({ ...policySettings, maxBackdateDays: parseInt(e.target.value) || 0 })}
                                        className="rounded-none h-9 text-sm max-w-xs"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
