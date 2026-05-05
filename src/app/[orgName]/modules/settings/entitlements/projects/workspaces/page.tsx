"use client"

import React, { useState } from "react"
import {
    Building2,
    Save,
    Lock,
    Users,
    Globe,
    UserPlus,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Switch } from "@/shared/components/ui/switch"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { showSuccess } from "@/shared/utils/toast"

export default function WorkspaceDefaultsPage() {
    const [isSaving, setIsSaving] = useState(false)
    const [settings, setSettings] = useState({
        defaultVisibility: "private",
        allowGuestInvites: false,
        autoJoinDomain: true,
        defaultRole: "member",
    })

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await new Promise((r) => setTimeout(r, 500))
            showSuccess("Workspace settings saved successfully")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Workspace Defaults</h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Configure initialization settings for every new workspace.
                        </p>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="sm"
                        className="rounded-none bg-primary hover:bg-primary/90 h-8 text-xs font-medium gap-2 px-5"
                    >
                        <Save size={14} />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Visibility</p>
                        <p className="text-white text-xl font-semibold mt-1 capitalize">{settings.defaultVisibility}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Security level</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Default Role</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1 capitalize">{settings.defaultRole}</p>
                        <p className="text-primary text-[10px] mt-1">New members</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Auto-join Domain</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{settings.autoJoinDomain ? "Enabled" : "Disabled"}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Domain matching</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Guest Invites</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{settings.allowGuestInvites ? "Allowed" : "Blocked"}</p>
                        <p className="text-zinc-400 text-[10px] mt-1">External access</p>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Creation Policies */}
                    <div className="bg-white border border-gray-200 rounded-none">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Building2 size={16} className="text-primary" />
                            <h3 className="text-sm font-semibold text-gray-900">Creation Policies</h3>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">Default Visibility</Label>
                                <Select
                                    value={settings.defaultVisibility}
                                    onValueChange={(v) => setSettings({ ...settings, defaultVisibility: v })}
                                >
                                    <SelectTrigger className="rounded-none h-9 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="private">Private (Invite Only)</SelectItem>
                                        <SelectItem value="public">Organization Public</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium text-zinc-600">Default Member Role</Label>
                                <Select
                                    value={settings.defaultRole}
                                    onValueChange={(v) => setSettings({ ...settings, defaultRole: v })}
                                >
                                    <SelectTrigger className="rounded-none h-9 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Access & Enrollment */}
                    <div className="bg-white border border-gray-200 rounded-none">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Users size={16} className="text-primary" />
                            <h3 className="text-sm font-semibold text-gray-900">Access &amp; Enrollment</h3>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="flex items-center justify-between py-1">
                                <div className="flex-1 pr-4">
                                    <p className="text-xs font-medium text-zinc-700">Auto-join by domain</p>
                                    <p className="text-[11px] text-zinc-500 mt-0.5">Users with an organization email can join public workspaces automatically.</p>
                                </div>
                                <Switch
                                    checked={settings.autoJoinDomain}
                                    onCheckedChange={(v) => setSettings({ ...settings, autoJoinDomain: v })}
                                />
                            </div>

                            <div className="flex items-center justify-between py-1 border-t border-zinc-100 pt-4">
                                <div className="flex-1 pr-4">
                                    <p className="text-xs font-medium text-zinc-700">Allow guest invites</p>
                                    <p className="text-[11px] text-zinc-500 mt-0.5">Admins can invite external email addresses.</p>
                                </div>
                                <Switch
                                    checked={settings.allowGuestInvites}
                                    onCheckedChange={(v) => setSettings({ ...settings, allowGuestInvites: v })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <Lock size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Privacy first</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Private workspaces restrict access to invited members only.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <Globe size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Domain matching</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Automatically provision users whose email matches your verified domain.
                            </p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-none p-5 flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-none">
                            <UserPlus size={18} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Guest collaboration</h3>
                            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                Invite clients or partners with scoped viewer access when needed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
