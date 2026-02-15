"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Archive,
    Save,
    Clock,
    Trash2,
    RotateCcw
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
import { Input } from "@/components/ui/input"
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
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>PROJECT GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">ARCHIVAL</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Retention Policy</h1>
                        <p className="text-xs text-zinc-500 font-medium">Automate project cleanup and data hygiene.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="h-8 rounded-md bg-white text-zinc-700 hover:text-zinc-900 border-zinc-200 text-xs font-medium px-3 shadow-sm active:scale-95"
                            onClick={() => handleAction("Recovered 3 projects")}
                        >
                            <RotateCcw className="w-3.5 h-3.5 mr-2" />
                            Recover Mode
                        </Button>
                        <Button
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                            onClick={() => handleAction("Policies saved")}
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
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Archived Projects</p>
                        <Archive className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">24</p>
                        <p className="text-[10px] text-white">Stored in cold storage</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-zinc-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-500" />
                            Auto-Archival
                        </CardTitle>
                        <CardDescription className="text-xs">Rules for moving completed projects to archive.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="auto" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Enable Auto-Archival</span>
                                <span className="font-normal text-[10px] text-zinc-500">Automatically archive projects after inactivity.</span>
                            </Label>
                            <Switch id="auto" checked={settings.enableAutoArchive} onCheckedChange={(v) => setSettings({ ...settings, enableAutoArchive: v })} />
                        </div>
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between">
                                <Label className="text-xs font-bold text-zinc-700">Days since Completion</Label>
                                <span className="text-xs text-zinc-500 font-bold">{settings.archiveAfterDays} Days</span>
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

                <Card className="border-rose-100 shadow-sm bg-rose-50/10">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-700">
                            <Trash2 className="w-4 h-4 text-rose-500" />
                            Permanent Deletion
                        </CardTitle>
                        <CardDescription className="text-xs text-rose-600/80">Draft projects and old archives cleanup.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="delete" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Enable Hard Delete</span>
                                <span className="font-normal text-[10px] text-zinc-500">Permanently remove archived data after set period.</span>
                            </Label>
                            <Switch id="delete" checked={settings.enablePermanentDelete} onCheckedChange={(v) => setSettings({ ...settings, enablePermanentDelete: v })} />
                        </div>
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between">
                                <Label className="text-xs font-bold text-zinc-700">Years in Archive</Label>
                                <span className="text-xs text-zinc-500 font-bold">{settings.deleteAfterYears} Years</span>
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
