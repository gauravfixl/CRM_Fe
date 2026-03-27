"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Timer,
    Save,
    Clock,
    CalendarClock,
    CheckCircle2,
    AlertTriangle
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
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Project governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Time tracking</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Time Policies</h1>
                        <p className="text-xs text-gray-500 font-medium">Configure global time logs and estimation defaults.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                            onClick={() => handleAction("Time settings updated")}
                            disabled={isLoading}
                        >
                            <Save className="w-3.5 h-3.5" />
                            Save Config
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-white/80">Unit</p>
                            <Timer className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xl font-semibold text-white capitalize">{settings.trackingUnit}</p>
                        <p className="text-[10px] text-white/80">Standard measure</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Daily capacity</p>
                            <Clock className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{settings.dailyCapacity}h</p>
                        <p className="text-[10px] text-gray-500">Per team member</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Overtime threshold</p>
                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{settings.overtimeThreshold}h</p>
                        <p className="text-[10px] text-gray-500">Weekly limit</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Approval</p>
                            <CheckCircle2 className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{settings.approvalRequired ? "Required" : "Optional"}</p>
                        <p className="text-[10px] text-gray-500">Manager sign-off</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            General Defaults
                        </CardTitle>
                        <CardDescription className="text-xs">Base configuration for new logs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Tracking unit</Label>
                            <Select value={settings.trackingUnit} onValueChange={(v) => setSettings({ ...settings, trackingUnit: v })}>
                                <SelectTrigger className="h-9 rounded-lg">
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
                                <Label className="text-xs font-semibold text-gray-700">Daily capacity (hrs)</Label>
                                <Input type="number" value={settings.dailyCapacity} onChange={(e) => setSettings({ ...settings, dailyCapacity: parseInt(e.target.value) })} className="h-9 rounded-lg" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold text-gray-700">Overtime threshold (hrs/wk)</Label>
                                <Input type="number" value={settings.overtimeThreshold} onChange={(e) => setSettings({ ...settings, overtimeThreshold: parseInt(e.target.value) })} className="h-9 rounded-lg" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-gray-500" />
                            Rules & Validation
                        </CardTitle>
                        <CardDescription className="text-xs">Enforcement policies.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="billable" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Mark billable by default</span>
                                <span className="font-normal text-[10px] text-gray-500">New time logs assume billable status unless changed.</span>
                            </Label>
                            <Switch id="billable" checked={settings.billableDefault} onCheckedChange={(v) => setSettings({ ...settings, billableDefault: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="approval" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Require approval</span>
                                <span className="font-normal text-[10px] text-gray-500">Manager must approve logs before they are final.</span>
                            </Label>
                            <Switch id="approval" checked={settings.approvalRequired} onCheckedChange={(v) => setSettings({ ...settings, approvalRequired: v })} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
