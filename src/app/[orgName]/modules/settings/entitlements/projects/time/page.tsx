"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Timer,
    Save,
    Clock,
    CalendarClock,
    CheckCircle2
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

export default function TimeTrackingDefaultsPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        trackingUnit: "hours",
        billableDefault: true,
        approvalRequired: false,
        dailyCapacity: 8,
        overtimeThreshold: 40
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
                    <span>PROJECT GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">TIME TRACKING</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Time Policies</h1>
                        <p className="text-xs text-zinc-500 font-medium">Configure global time logs and estimation defaults.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                            onClick={() => handleAction("Time settings updated")}
                            disabled={isLoading}
                        >
                            <Save className="w-3.5 h-3.5 mr-2" />
                            Save Config
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Unit</p>
                        <Timer className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md capitalize">{settings.trackingUnit}</p>
                        <p className="text-[10px] text-white">Standard measure</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-zinc-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-500" />
                            General Defaults
                        </CardTitle>
                        <CardDescription className="text-xs">Base configuration for new logs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-zinc-700">Tracking Unit</Label>
                            <Select value={settings.trackingUnit} onValueChange={(v) => setSettings({ ...settings, trackingUnit: v })}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hours">Hours & Minutes</SelectItem>
                                    <SelectItem value="points">Story Points</SelectItem>
                                    <SelectItem value="days">Man Days</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-700">Daily Capacity (Hrs)</Label>
                                <Input type="number" value={settings.dailyCapacity} onChange={(e) => setSettings({ ...settings, dailyCapacity: parseInt(e.target.value) })} className="h-9" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-bold text-zinc-700">Overtime Threshold (Hrs/Wk)</Label>
                                <Input type="number" value={settings.overtimeThreshold} onChange={(e) => setSettings({ ...settings, overtimeThreshold: parseInt(e.target.value) })} className="h-9" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-zinc-500" />
                            Rules & Validation
                        </CardTitle>
                        <CardDescription className="text-xs">Enforcement policies.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="billable" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Mark Billable by Default</span>
                                <span className="font-normal text-[10px] text-zinc-500">New time logs assume billable status unless changed.</span>
                            </Label>
                            <Switch id="billable" checked={settings.billableDefault} onCheckedChange={(v) => setSettings({ ...settings, billableDefault: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="approval" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Require Approval</span>
                                <span className="font-normal text-[10px] text-zinc-500">Manager must approve logs before they are final.</span>
                            </Label>
                            <Switch id="approval" checked={settings.approvalRequired} onCheckedChange={(v) => setSettings({ ...settings, approvalRequired: v })} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
