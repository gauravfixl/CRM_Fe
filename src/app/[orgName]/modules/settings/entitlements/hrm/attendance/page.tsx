"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    CalendarClock,
    Save,
    MapPin,
    AlertCircle,
    Coffee
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function AttendanceRulesPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        allowRemote: true,
        geoFencing: false,
        breakDuration: 60,
        halfDayThreshold: 4,
        autoCheckout: true
    })

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>HR GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">ATTENDANCE RULES</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Time & Attendance</h1>
                        <p className="text-xs text-zinc-500 font-medium">Compliance and tracking configurations.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                            onClick={() => handleAction("Attendance rules updated")}
                            disabled={isLoading}
                        >
                            <Save className="w-3.5 h-3.5 mr-2" />
                            Save Rules
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Mode</p>
                        <CalendarClock className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">Hybrid</p>
                        <p className="text-[10px] text-white">Current Policy</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-zinc-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-zinc-500" />
                            Location & Access
                        </CardTitle>
                        <CardDescription className="text-xs">Where employees can clock in.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="remote" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Allow Remote Clock-In</span>
                                <span className="font-normal text-[10px] text-zinc-500">Employees can mark attendance from any IP.</span>
                            </Label>
                            <Switch id="remote" checked={settings.allowRemote} onCheckedChange={(v) => setSettings({ ...settings, allowRemote: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="geo" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Enforce Geo-Fencing</span>
                                <span className="font-normal text-[10px] text-zinc-500">Require GPS location within office radius.</span>
                            </Label>
                            <Switch id="geo" checked={settings.geoFencing} onCheckedChange={(v) => setSettings({ ...settings, geoFencing: v })} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Coffee className="w-4 h-4 text-zinc-500" />
                            Breaks & Thresholds
                        </CardTitle>
                        <CardDescription className="text-xs">Daily limit calculations.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-zinc-700">Max Break Duration (Mins)</Label>
                            <Input
                                type="number"
                                className="h-9"
                                value={settings.breakDuration}
                                onChange={(e) => setSettings({ ...settings, breakDuration: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-zinc-700">Half-Day Threshold (Hours)</Label>
                            <Input
                                type="number"
                                className="h-9"
                                value={settings.halfDayThreshold}
                                onChange={(e) => setSettings({ ...settings, halfDayThreshold: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 pt-2">
                            <Label htmlFor="auto" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Auto Checkout</span>
                                <span className="font-normal text-[10px] text-zinc-500">System check-out at 11:59 PM if forgotten.</span>
                            </Label>
                            <Switch id="auto" checked={settings.autoCheckout} onCheckedChange={(v) => setSettings({ ...settings, autoCheckout: v })} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
