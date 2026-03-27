"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Archive,
    Save,
    Clock,
    Trash2,
    RotateCcw,
    CalendarDays
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
import { Slider } from "@/components/ui/slider"

export default function ProjectArchivalPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        enableAutoArchive: true,
        archiveAfterDays: 90,
        enablePermanentDelete: false,
        deleteAfterYears: 2
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
                    <span className="text-gray-900 font-semibold">Archival</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Retention Policy</h1>
                        <p className="text-xs text-gray-500 font-medium">Automate project cleanup and data hygiene.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="h-10 rounded-xl bg-white text-gray-700 hover:text-gray-900 border-gray-200 text-xs font-semibold px-5 shadow-sm"
                            onClick={() => handleAction("Recovered 3 projects")}
                        >
                            <RotateCcw className="w-3.5 h-3.5 mr-2" />
                            Recover Mode
                        </Button>
                        <Button
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                            onClick={() => handleAction("Policies saved")}
                            disabled={isLoading}
                        >
                            <Save className="w-3.5 h-3.5" />
                            Save Rules
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-white/80">Archived projects</p>
                            <Archive className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xl font-semibold text-white">24</p>
                        <p className="text-[10px] text-white/80">Stored in cold storage</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Auto-archival</p>
                            <Clock className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{settings.enableAutoArchive ? "Enabled" : "Disabled"}</p>
                        <p className="text-[10px] text-gray-500">Automation status</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Archive after</p>
                            <CalendarDays className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{settings.archiveAfterDays}d</p>
                        <p className="text-[10px] text-gray-500">Days of inactivity</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="px-4 py-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-xs text-gray-600">Hard delete</p>
                            <Trash2 className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900">{settings.enablePermanentDelete ? "Enabled" : "Disabled"}</p>
                        <p className="text-[10px] text-gray-500">After {settings.deleteAfterYears} years</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-xl border shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            Auto-Archival
                        </CardTitle>
                        <CardDescription className="text-xs">Rules for moving completed projects to archive.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="auto" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Enable auto-archival</span>
                                <span className="font-normal text-[10px] text-gray-500">Automatically archive projects after inactivity.</span>
                            </Label>
                            <Switch id="auto" checked={settings.enableAutoArchive} onCheckedChange={(v) => setSettings({ ...settings, enableAutoArchive: v })} />
                        </div>
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between">
                                <Label className="text-xs font-semibold text-gray-700">Days since completion</Label>
                                <span className="text-xs text-gray-500 font-semibold">{settings.archiveAfterDays} days</span>
                            </div>
                            <Slider
                                defaultValue={[90]}
                                max={365}
                                step={1}
                                value={[settings.archiveAfterDays]}
                                onValueChange={(vals) => setSettings({ ...settings, archiveAfterDays: vals[0] })}
                                disabled={!settings.enableAutoArchive}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-rose-100 shadow-sm bg-rose-50/10">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-rose-700">
                            <Trash2 className="w-4 h-4 text-rose-500" />
                            Permanent Deletion
                        </CardTitle>
                        <CardDescription className="text-xs text-rose-600/80">Draft projects and old archives cleanup.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="delete" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Enable hard delete</span>
                                <span className="font-normal text-[10px] text-gray-500">Permanently remove archived data after set period.</span>
                            </Label>
                            <Switch id="delete" checked={settings.enablePermanentDelete} onCheckedChange={(v) => setSettings({ ...settings, enablePermanentDelete: v })} />
                        </div>
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between">
                                <Label className="text-xs font-semibold text-gray-700">Years in archive</Label>
                                <span className="text-xs text-gray-500 font-semibold">{settings.deleteAfterYears} years</span>
                            </div>
                            <Slider
                                defaultValue={[2]}
                                max={10}
                                step={1}
                                value={[settings.deleteAfterYears]}
                                onValueChange={(vals) => setSettings({ ...settings, deleteAfterYears: vals[0] })}
                                disabled={!settings.enablePermanentDelete}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
