"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { ShieldCheck, Save, Clock, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function HRSettingsPage() {
    const params = useParams()
    const [settings, setSettings] = useState({
        autoBoarding: true,
        leaveAccrual: true,
        payrollAuto: false
    })

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>HRM</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">SETTINGS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">HR Configuration</h1>
                        <p className="text-xs text-zinc-500 font-medium">Define workforce policies and automation rules.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="h-8 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3 shadow-sm" onClick={() => toast.success("Configuration saved")}>
                            <Save className="w-3.5 h-3.5 mr-2" />
                            Save Config
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-zinc-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Users className="w-4 h-4 text-zinc-500" />
                            Onboarding Automation
                        </CardTitle>
                        <CardDescription className="text-xs">Streamline new hire setup.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="boarding" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Auto-Provision Accounts</span>
                                <span className="font-normal text-[10px] text-zinc-500">Create system accounts upon offer acceptance.</span>
                            </Label>
                            <Switch id="boarding" checked={settings.autoBoarding} onCheckedChange={(v) => setSettings({ ...settings, autoBoarding: v })} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-zinc-500" />
                            Leave Policies
                        </CardTitle>
                        <CardDescription className="text-xs">Manage accruals and carry-overs.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="accrual" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Monthly Accrual</span>
                                <span className="font-normal text-[10px] text-zinc-500">Automatically add leave balance on 1st of month.</span>
                            </Label>
                            <Switch id="accrual" checked={settings.leaveAccrual} onCheckedChange={(v) => setSettings({ ...settings, leaveAccrual: v })} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
