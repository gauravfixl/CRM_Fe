"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Building2,
    Save,
    Lock,
    Users,
    Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
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

export default function WorkspaceDefaultsPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        defaultVisibility: "private",
        allowGuestInvites: false,
        autoJoinDomain: true,
        defaultRole: "member"
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
                    <span className="text-zinc-900 font-semibold">WORKSPACES</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Workspace Defaults</h1>
                        <p className="text-xs text-zinc-500 font-medium">Configure initialization settings for new workspaces.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                            onClick={() => handleAction("Workspace settings saved")}
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
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Default</p>
                        <Lock className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md capitalize">{settings.defaultVisibility}</p>
                        <p className="text-[10px] text-white">Security level</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-zinc-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-zinc-500" />
                            Creation Policies
                        </CardTitle>
                        <CardDescription className="text-xs">Settings applied when a workspace is created.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-zinc-700">Default Visibility</Label>
                            <Select value={settings.defaultVisibility} onValueChange={(v) => setSettings({ ...settings, defaultVisibility: v })}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="private">Private (Invite Only)</SelectItem>
                                    <SelectItem value="public">Organization Public</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold text-zinc-700">Default Member Role</Label>
                            <Select value={settings.defaultRole} onValueChange={(v) => setSettings({ ...settings, defaultRole: v })}>
                                <SelectTrigger className="h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-zinc-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Users className="w-4 h-4 text-zinc-500" />
                            Access & Enrollment
                        </CardTitle>
                        <CardDescription className="text-xs">How users join workspaces.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="domain" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Auto-Join by Domain</span>
                                <span className="font-normal text-[10px] text-zinc-500">Allow users with organization email to join public workspaces automatically.</span>
                            </Label>
                            <Switch id="domain" checked={settings.autoJoinDomain} onCheckedChange={(v) => setSettings({ ...settings, autoJoinDomain: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="guest" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Allow Guest Defines</span>
                                <span className="font-normal text-[10px] text-zinc-500">Admins can invite external email addresses.</span>
                            </Label>
                            <Switch id="guest" checked={settings.allowGuestInvites} onCheckedChange={(v) => setSettings({ ...settings, allowGuestInvites: v })} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
