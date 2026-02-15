"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Settings,
    Save,
    Bell,
    Lock,
    Clock,
    LayoutDashboard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function PMGlobalSettingsPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        notifications: true,
        autoArchive: false,
        enforceEstimates: true,
        allowGuestAccess: false
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
                    <span>PROJECTS</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">SETTINGS</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">System Configuration</h1>
                        <p className="text-xs text-zinc-500 font-medium">Define global policies for all workspaces and projects.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="h-8 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                            onClick={() => handleAction("Settings Saved")}
                            disabled={isLoading}
                        >
                            <Save className="w-3.5 h-3.5 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* GENERAL SETTINGS */}
                <Card className="border-zinc-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-zinc-500" />
                            General Defaults
                        </CardTitle>
                        <CardDescription className="text-xs">Control default behaviors for new projects.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="estimates" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Enforce Time Estimates</span>
                                <span className="font-normal text-[10px] text-zinc-500">Require estimates before tasks can be started.</span>
                            </Label>
                            <Switch id="estimates" checked={settings.enforceEstimates} onCheckedChange={(v) => setSettings({ ...settings, enforceEstimates: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="archive" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Auto-Archive Completed</span>
                                <span className="font-normal text-[10px] text-zinc-500">Archive projects 30 days after completion.</span>
                            </Label>
                            <Switch id="archive" checked={settings.autoArchive} onCheckedChange={(v) => setSettings({ ...settings, autoArchive: v })} />
                        </div>
                    </CardContent>
                </Card>

                {/* SECURITY SETTINGS */}
                <Card className="border-zinc-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Lock className="w-4 h-4 text-zinc-500" />
                            Security & Access
                        </CardTitle>
                        <CardDescription className="text-xs">Manage external access and visibility.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="guest" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Allow Guest Access</span>
                                <span className="font-normal text-[10px] text-zinc-500">Permit external users to view public boards.</span>
                            </Label>
                            <Switch id="guest" checked={settings.allowGuestAccess} onCheckedChange={(v) => setSettings({ ...settings, allowGuestAccess: v })} />
                        </div>
                    </CardContent>
                </Card>

                {/* NOTIFICATIONS */}
                <Card className="border-zinc-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Bell className="w-4 h-4 text-zinc-500" />
                            Notification Rules
                        </CardTitle>
                        <CardDescription className="text-xs">Configure system-wide alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="notif" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Email Digests</span>
                                <span className="font-normal text-[10px] text-zinc-500">Send daily summary emails to all users.</span>
                            </Label>
                            <Switch id="notif" checked={settings.notifications} onCheckedChange={(v) => setSettings({ ...settings, notifications: v })} />
                        </div>
                    </CardContent>
                </Card>

                {/* WORKING HOURS */}
                <Card className="border-zinc-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-500" />
                            Working Days
                        </CardTitle>
                        <CardDescription className="text-xs">Define standard sprint duration logic.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-zinc-500">Sprint Length (Weeks)</Label>
                                <Input type="number" defaultValue={2} className="h-8 text-xs" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-zinc-500">Capacity / Day (Hours)</Label>
                                <Input type="number" defaultValue={6} className="h-8 text-xs" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
