"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Building2,
    Save,
    Lock,
    Users,
    Globe,
    UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Project governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Workspaces</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Workspace Defaults</h1>
                        <p className="text-xs text-gray-500 font-medium">Configure initialization settings for new workspaces.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                            onClick={() => handleAction("Workspace settings saved")}
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
                            <p className="text-xs text-white/80">Visibility</p>
                            <Lock className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xl font-semibold text-white capitalize">{settings.defaultVisibility}</p>
                        <p className="text-[10px] text-white/80">Security level</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Default role</p>
                            <Users className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900 capitalize">{settings.defaultRole}</p>
                        <p className="text-[10px] text-gray-500">New members</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Auto-join domain</p>
                            <Globe className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{settings.autoJoinDomain ? "Enabled" : "Disabled"}</p>
                        <p className="text-[10px] text-gray-500">Domain matching</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Guest invites</p>
                            <UserPlus className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{settings.allowGuestInvites ? "Allowed" : "Blocked"}</p>
                        <p className="text-[10px] text-gray-500">External access</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-500" />
                            Creation Policies
                        </CardTitle>
                        <CardDescription className="text-xs">Settings applied when a workspace is created.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Default visibility</Label>
                            <Select value={settings.defaultVisibility} onValueChange={(v) => setSettings({ ...settings, defaultVisibility: v })}>
                                <SelectTrigger className="h-9 rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="private">Private (Invite Only)</SelectItem>
                                    <SelectItem value="public">Organization Public</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Default member role</Label>
                            <Select value={settings.defaultRole} onValueChange={(v) => setSettings({ ...settings, defaultRole: v })}>
                                <SelectTrigger className="h-9 rounded-lg">
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

                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            Access & Enrollment
                        </CardTitle>
                        <CardDescription className="text-xs">How users join workspaces.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="domain" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Auto-join by domain</span>
                                <span className="font-normal text-[10px] text-gray-500">Allow users with organization email to join public workspaces automatically.</span>
                            </Label>
                            <Switch id="domain" checked={settings.autoJoinDomain} onCheckedChange={(v) => setSettings({ ...settings, autoJoinDomain: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="guest" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Allow guest invites</span>
                                <span className="font-normal text-[10px] text-gray-500">Admins can invite external email addresses.</span>
                            </Label>
                            <Switch id="guest" checked={settings.allowGuestInvites} onCheckedChange={(v) => setSettings({ ...settings, allowGuestInvites: v })} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
