"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Settings, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AppConfigPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Application Configuration"
                breadcrumbItems={[
                    { label: "Settings", href: "/modules/settings" },
                    { label: "App Config", href: "/modules/settings/app-config" }
                ]}
                rightControls={
                    <Button className="h-8 gap-2 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px]">
                        <Save className="w-3.5 h-3.5" />
                        Save Config
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Global Settings</CardTitle>
                        <CardDescription>System-wide defaults for all modules.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold">Default Currency</Label>
                                <p className="text-xs text-zinc-500">Used for financial reporting across all modules</p>
                            </div>
                            <Select defaultValue="usd">
                                <SelectTrigger className="w-[180px] rounded-none">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="usd">USD ($)</SelectItem>
                                    <SelectItem value="eur">EUR (€)</SelectItem>
                                    <SelectItem value="gbp">GBP (£)</SelectItem>
                                    <SelectItem value="inr">INR (₹)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold">Date Format</Label>
                                <p className="text-xs text-zinc-500">how dates are displayed to users</p>
                            </div>
                            <Select defaultValue="mdy">
                                <SelectTrigger className="w-[180px] rounded-none">
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold">Enable Developer Mode</Label>
                                <p className="text-xs text-zinc-500">Show technical IDs and advanced debugging options</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
