"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { RefreshCw, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function DataSyncPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Data Synchronization"
                breadcrumbItems={[
                    { label: "Settings", href: "/modules/settings" },
                    { label: "Data Sync", href: "/modules/settings/sync" }
                ]}
                rightControls={
                    <Button className="h-8 gap-2 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px]">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Sync Now
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Sync Health</CardTitle>
                        <CardDescription>Monitor connectivity with external data sources.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { name: "ERP System (SAP)", status: "Healthy", lastSync: "2 mins ago", health: 100 },
                            { name: "Marketing Automation (HubSpot)", status: "Syncing...", lastSync: "In progress", health: 65 },
                            { name: "Legacy Database", status: "Warning", lastSync: "2 days ago", health: 40 },
                        ].map((source, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-zinc-900">{source.name}</h4>
                                        {source.health === 100 ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        ) : source.health < 50 ? (
                                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                                        ) : (
                                            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                                        )}
                                    </div>
                                    <span className="text-xs font-mono text-zinc-500">{source.lastSync}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Progress value={source.health} className={`h-1.5 ${source.health === 100 ? 'text-emerald-600' : source.health < 50 ? 'text-amber-600' : 'text-blue-600'}`} />
                                    <span className="text-xs font-bold w-8 text-right">{source.health}%</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
