"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Database,
    Save,
    Clock,
    Trash2,
    HardDrive
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
import { Slider } from "@/components/ui/slider"

export default function EmployeeRetentionPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        retainProfiles: 7,
        anonymizeData: true,
        deleteDocuments: false,
        retainPayroll: 10
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
                    <span>HR GOVERNANCE</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">RETENTION</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Data Retention</h1>
                        <p className="text-xs text-zinc-500 font-medium">Compliance rules for ex-employee records.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className="h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95"
                            onClick={() => handleAction("Compliance policy saved")}
                            disabled={isLoading}
                        >
                            <Save className="w-3.5 h-3.5 mr-2" />
                            Save Policy
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Storage</p>
                        <Database className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">7 Yrs</p>
                        <p className="text-[10px] text-white">Default retention</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-zinc-200 shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-zinc-500" />
                            Profile Lifecycle
                        </CardTitle>
                        <CardDescription className="text-xs">Handling of personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-xs font-bold text-zinc-700">Retain ex-employee profiles</Label>
                                <span className="text-xs text-zinc-500 font-bold">{settings.retainProfiles} Years</span>
                            </div>
                            <Slider
                                defaultValue={[7]}
                                max={15}
                                step={1}
                                value={[settings.retainProfiles]}
                                onValueChange={(vals) => setSettings({ ...settings, retainProfiles: vals[0] })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 pt-2">
                            <Label htmlFor="anon" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Anonymize After Period</span>
                                <span className="font-normal text-[10px] text-zinc-500">Remove identifiers but keep stats.</span>
                            </Label>
                            <Switch id="anon" checked={settings.anonymizeData} onCheckedChange={(v) => setSettings({ ...settings, anonymizeData: v })} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-100 shadow-sm bg-blue-50/10">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-700">
                            <Trash2 className="w-4 h-4 text-blue-500" />
                            Deletion & Cleanup
                        </CardTitle>
                        <CardDescription className="text-xs text-blue-600/80">Permanent removal of sensitive files.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-xs font-bold text-zinc-700">Retain Financial Records</Label>
                                <span className="text-xs text-zinc-500 font-bold">{settings.retainPayroll} Years</span>
                            </div>
                            <Slider
                                defaultValue={[10]}
                                max={20}
                                step={1}
                                value={[settings.retainPayroll]}
                                onValueChange={(vals) => setSettings({ ...settings, retainPayroll: vals[0] })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 pt-2">
                            <Label htmlFor="docs" className="flex flex-col space-y-1">
                                <span className="text-xs font-bold text-zinc-700">Delete Uploaded Documents</span>
                                <span className="font-normal text-[10px] text-zinc-500">Remove CVs/IDs immediately on termination?</span>
                            </Label>
                            <Switch id="docs" checked={settings.deleteDocuments} onCheckedChange={(v) => setSettings({ ...settings, deleteDocuments: v })} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
