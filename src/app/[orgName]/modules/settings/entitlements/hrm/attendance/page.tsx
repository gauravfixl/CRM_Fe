"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    Save,
    MapPin,
    Coffee,
    Monitor,
    Clock,
    LogOut,
    Timer,
    AlertTriangle,
    Hourglass,
    ArrowLeftRight,
    CalendarClock,
    CalendarMinus,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    getActiveAttendancePolicy,
    upsertAttendancePolicy,
} from "@/modules/hrm/hooks/hrmHooks"

export default function AttendanceRulesPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)

    // Local-only settings (no backend mapping)
    const [settings, setSettings] = useState({
        allowRemote: true,
        geoFencing: false,
        breakDuration: 60,
        halfDayThreshold: 4,
        autoCheckout: true,
    })

    // Backend-mapped settings
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

    // Fetch active policy on mount
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
                    // Sync halfDayThreshold (local, in hours) from backend (in minutes)
                    setSettings((prev) => ({
                        ...prev,
                        halfDayThreshold: Math.round((data.halfDayThresholdMinutes ?? 240) / 60),
                    }))
                }
            } catch (err: any) {
                // 404 means no policy exists yet - use defaults silently
                if (err?.response?.status !== 404) {
                    toast.error("Failed to load attendance policy")
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
            toast.success("Attendance rules updated")
        } catch {
            toast.error("Failed to save attendance rules")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="font-outfit flex items-center justify-center min-h-screen bg-[#fafafa]">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        )
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Hr Governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Attendance Rules</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Attendance Rules</h1>
                        <p className="text-xs text-gray-500 font-medium">Compliance and tracking configurations.</p>
                    </div>
                    <Button
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        <Save className="w-4 h-4" />
                        {isLoading ? "Saving..." : "Save Rules"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Mode</p>
                                <p className="text-xl font-semibold">{mode}</p>
                                <p className="text-[10px] text-white/70">Current policy</p>
                            </div>
                            <Monitor className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Break Duration</p>
                                <p className="text-xl font-semibold text-gray-900">{settings.breakDuration} min</p>
                                <p className="text-[10px] text-gray-500">Max allowed</p>
                            </div>
                            <Coffee className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Half-day Threshold</p>
                                <p className="text-xl font-semibold text-gray-900">{settings.halfDayThreshold} hrs</p>
                                <p className="text-[10px] text-gray-500">Minimum hours</p>
                            </div>
                            <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Auto Checkout</p>
                                <p className="text-xl font-semibold text-gray-900">{settings.autoCheckout ? "Enabled" : "Disabled"}</p>
                                <p className="text-[10px] text-gray-500">End-of-day rule</p>
                            </div>
                            <LogOut className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            Location and Access
                        </CardTitle>
                        <CardDescription className="text-xs">Where employees can clock in.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="remote" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Allow Remote Clock-in</span>
                                <span className="font-normal text-[10px] text-gray-500">Employees can mark attendance from any IP.</span>
                            </Label>
                            <Switch id="remote" checked={settings.allowRemote} onCheckedChange={(v) => setSettings({ ...settings, allowRemote: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="geo" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Enforce Geo-fencing</span>
                                <span className="font-normal text-[10px] text-gray-500">Require GPS location within office radius.</span>
                            </Label>
                            <Switch id="geo" checked={settings.geoFencing} onCheckedChange={(v) => setSettings({ ...settings, geoFencing: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="earlyPunch" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Allow Early Punch</span>
                                <span className="font-normal text-[10px] text-gray-500">Employees can clock in before shift start.</span>
                            </Label>
                            <Switch id="earlyPunch" checked={policySettings.allowEarlyPunch} onCheckedChange={(v) => setPolicySettings({ ...policySettings, allowEarlyPunch: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="latePunch" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Allow Late Punch</span>
                                <span className="font-normal text-[10px] text-gray-500">Employees can clock in after shift start.</span>
                            </Label>
                            <Switch id="latePunch" checked={policySettings.allowLatePunch} onCheckedChange={(v) => setPolicySettings({ ...policySettings, allowLatePunch: v })} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-gray-500" />
                            Breaks and Thresholds
                        </CardTitle>
                        <CardDescription className="text-xs">Daily limit calculations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Max Break Duration (Mins)</Label>
                            <Input
                                type="number"
                                className="h-9 rounded-lg"
                                value={settings.breakDuration}
                                onChange={(e) => setSettings({ ...settings, breakDuration: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Half-day Threshold (Hours)</Label>
                            <Input
                                type="number"
                                className="h-9 rounded-lg"
                                value={settings.halfDayThreshold}
                                onChange={(e) => setSettings({ ...settings, halfDayThreshold: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Late Allowed (Mins)</Label>
                            <Input
                                type="number"
                                className="h-9 rounded-lg"
                                value={policySettings.lateAllowedMinutes}
                                onChange={(e) => setPolicySettings({ ...policySettings, lateAllowedMinutes: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Absent Threshold (Mins)</Label>
                            <Input
                                type="number"
                                className="h-9 rounded-lg"
                                value={policySettings.absentThresholdMinutes}
                                onChange={(e) => setPolicySettings({ ...policySettings, absentThresholdMinutes: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Overtime Minimum (Mins)</Label>
                            <Input
                                type="number"
                                className="h-9 rounded-lg"
                                value={policySettings.overtimeMinMinutes}
                                onChange={(e) => setPolicySettings({ ...policySettings, overtimeMinMinutes: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 pt-2">
                            <Label htmlFor="auto" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Auto Checkout</span>
                                <span className="font-normal text-[10px] text-gray-500">System check-out at 11:59 PM if forgotten.</span>
                            </Label>
                            <Switch id="auto" checked={settings.autoCheckout} onCheckedChange={(v) => setSettings({ ...settings, autoCheckout: v })} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <CalendarClock className="w-4 h-4 text-gray-500" />
                            Leave and Regularization
                        </CardTitle>
                        <CardDescription className="text-xs">Leave sandwich rules and backdated attendance.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="sandwich" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Sandwich Leave Rule</span>
                                <span className="font-normal text-[10px] text-gray-500">Count weekends/holidays between consecutive leaves.</span>
                            </Label>
                            <Switch id="sandwich" checked={policySettings.sandwichLeaveRule} onCheckedChange={(v) => setPolicySettings({ ...policySettings, sandwichLeaveRule: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="backdate" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Allow Backdated Regularization</span>
                                <span className="font-normal text-[10px] text-gray-500">Employees can request attendance correction for past dates.</span>
                            </Label>
                            <Switch id="backdate" checked={policySettings.allowBackdatedRegularization} onCheckedChange={(v) => setPolicySettings({ ...policySettings, allowBackdatedRegularization: v })} />
                        </div>
                        {policySettings.allowBackdatedRegularization && (
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold text-gray-700">Max Backdate Days</Label>
                                <Input
                                    type="number"
                                    className="h-9 rounded-lg"
                                    value={policySettings.maxBackdateDays}
                                    onChange={(e) => setPolicySettings({ ...policySettings, maxBackdateDays: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
