"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Clock,
    Save,
    Calendar,
    Users,
    Sun
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function WorkingHoursPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        shiftName: "General Shift",
        startTime: "09:00",
        endTime: "18:00",
        workDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        timezone: "UTC+5:30",
        gracePeriod: 15
    })

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const toggleDay = (day: string) => {
        if (settings.workDays.includes(day)) {
            setSettings({ ...settings, workDays: settings.workDays.filter(d => d !== day) })
        } else {
            setSettings({ ...settings, workDays: [...settings.workDays, day] })
        }
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>HR GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">WORKING HOURS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Shift Configuration</h1>
                        <p className="text-xs text-zinc-500 font-medium">Define standard operating hours and work weeks.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                            onClick={() => handleAction("Shift policy saved")}
                            disabled={isLoading}
                        >
                            <Save className="w-3.5 h-3.5 mr-2" />
                            Save Schedule
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Weekly Hours</p>
                        <Clock className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">40</p>
                        <p className="text-[10px] text-white">Standard capacity</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-zinc-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Sun className="w-4 h-4 text-zinc-500" />
                            Daily Schedule
                        </CardTitle>
                        <CardDescription className="text-xs">Timing for the default shift.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-zinc-700">Shift Name</Label>
                            <Input value={settings.shiftName} onChange={(e) => setSettings({ ...settings, shiftName: e.target.value })} className="h-9" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-700">Start Time</Label>
                                <Input type="time" value={settings.startTime} onChange={(e) => setSettings({ ...settings, startTime: e.target.value })} className="h-9" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-700">End Time</Label>
                                <Input type="time" value={settings.endTime} onChange={(e) => setSettings({ ...settings, endTime: e.target.value })} className="h-9" />
                            </div>
                        </div>
                        <div className="grid gap-2 pt-2">
                            <Label className="text-xs font-bold text-zinc-700">Timezone</Label>
                            <Select value={settings.timezone} onValueChange={(v) => setSettings({ ...settings, timezone: v })}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UTC">UTC (GMT)</SelectItem>
                                    <SelectItem value="UTC-5">EST (New York)</SelectItem>
                                    <SelectItem value="UTC+5:30">IST (India)</SelectItem>
                                    <SelectItem value="UTC+1">CET (Berlin)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-zinc-500" />
                            Work Week
                        </CardTitle>
                        <CardDescription className="text-xs">Active working days.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-wrap gap-2">
                            {days.map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className={`h-10 w-10 rounded-full text-xs font-bold flex items-center justify-center transition-all ${settings.workDays.includes(day)
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                        : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
                                        }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-zinc-100">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="grace" className="flex flex-col space-y-1">
                                    <span className="text-xs font-bold text-zinc-700">Late Grace Period (Mins)</span>
                                    <span className="font-normal text-[10px] text-zinc-500">Allowed delay before marking as late.</span>
                                </Label>
                                <Input
                                    type="number"
                                    className="w-20 h-8 text-right font-mono"
                                    value={settings.gracePeriod}
                                    onChange={(e) => setSettings({ ...settings, gracePeriod: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
