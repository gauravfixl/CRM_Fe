"use client"

import React, { useState } from "react"
import {
    Database,
    Save,
    Clock,
    Trash2,
    ShieldCheck,
    FileX
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

export default function EmployeeRetentionPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [settings, setSettings] = useState({
        retainProfiles: 7,
        anonymizeData: true,
        deleteDocuments: false,
        retainPayroll: 10,
    })

    const handleSave = () => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success("Retention policy saved successfully")
        }, 800)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa] font-outfit">
            {/* Breadcrumb */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Hr Governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Retention</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Employee Data Retention</h1>
                        <p className="text-xs text-gray-500 font-medium">Compliance rules for ex-employee records.</p>
                    </div>
                    <Button
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        <Save className="w-4 h-4" />
                        Save Policy
                    </Button>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Storage</p>
                                <p className="text-xl font-semibold text-white tracking-tight">{settings.retainProfiles} Yrs</p>
                                <p className="text-[10px] text-white/80">Profile retention</p>
                            </div>
                            <Database className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Anonymize</p>
                                <p className="text-xl font-semibold">{settings.anonymizeData ? "Enabled" : "Disabled"}</p>
                                <p className="text-[10px] text-gray-500">After retention period</p>
                            </div>
                            <ShieldCheck className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Financial Records</p>
                                <p className="text-xl font-semibold">{settings.retainPayroll} Yrs</p>
                                <p className="text-[10px] text-gray-500">Payroll retention</p>
                            </div>
                            <Clock className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Document Deletion</p>
                                <p className="text-xl font-semibold">{settings.deleteDocuments ? "Active" : "Inactive"}</p>
                                <p className="text-[10px] text-gray-500">On termination</p>
                            </div>
                            <FileX className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Config Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-xl border bg-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            Profile Lifecycle
                        </CardTitle>
                        <CardDescription className="text-xs">Handling of personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-xs font-semibold text-gray-700">Retain ex-employee profiles</Label>
                                <span className="text-xs text-gray-500 font-semibold">{settings.retainProfiles} Years</span>
                            </div>
                            <Slider
                                defaultValue={[7]}
                                max={15}
                                min={0}
                                step={1}
                                value={[settings.retainProfiles]}
                                onValueChange={(vals) => setSettings({ ...settings, retainProfiles: vals[0] })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 pt-2">
                            <Label htmlFor="anon" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Anonymize After Period</span>
                                <span className="font-normal text-[10px] text-gray-500">Remove identifiers but keep stats.</span>
                            </Label>
                            <Switch
                                id="anon"
                                checked={settings.anonymizeData}
                                onCheckedChange={(v) => setSettings({ ...settings, anonymizeData: v })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-blue-100 bg-blue-50/10">
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-700">
                            <Trash2 className="w-4 h-4 text-blue-500" />
                            Deletion and Cleanup
                        </CardTitle>
                        <CardDescription className="text-xs text-blue-600/80">Permanent removal of sensitive files.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-xs font-semibold text-gray-700">Retain Financial Records</Label>
                                <span className="text-xs text-gray-500 font-semibold">{settings.retainPayroll} Years</span>
                            </div>
                            <Slider
                                defaultValue={[10]}
                                max={20}
                                min={0}
                                step={1}
                                value={[settings.retainPayroll]}
                                onValueChange={(vals) => setSettings({ ...settings, retainPayroll: vals[0] })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 pt-2">
                            <Label htmlFor="docs" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Delete Uploaded Documents</span>
                                <span className="font-normal text-[10px] text-gray-500">Remove CVs/IDs immediately on termination?</span>
                            </Label>
                            <Switch
                                id="docs"
                                checked={settings.deleteDocuments}
                                onCheckedChange={(v) => setSettings({ ...settings, deleteDocuments: v })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
