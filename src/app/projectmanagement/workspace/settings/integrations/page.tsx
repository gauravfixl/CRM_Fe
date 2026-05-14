"use client"

import React, { useEffect, useState } from "react"
import { Plus, ExternalLink, Zap, Activity, Power } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useIntegrationStore } from "@/shared/data/integration-store"
import { formatDistanceToNow } from "date-fns"

export default function IntegrationsSettingsPage() {
    const [mounted, setMounted] = useState(false)
    const { integrations, toggleIntegration } = useIntegrationStore()

    useEffect(() => {
        setMounted(true)
        useIntegrationStore.persist.rehydrate()
    }, [])

    if (!mounted) return null

    const connectedCount = integrations.filter(i => i.enabled).length

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">External Nodes</h3>
                    <p className="text-slate-500 font-medium text-[13px]">Synchronize your workspace with external tools.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-none">{connectedCount} Connected</Badge>
                    <Button variant="outline" className="h-9 border-slate-200 text-xs font-bold rounded-none">
                        Developer API
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map(app => (
                    <Card key={app.id} className="border border-slate-200 shadow-sm bg-white rounded-none hover:shadow-md transition-shadow">
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="h-12 w-12 bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl rounded-none">
                                    {app.icon}
                                </div>
                                <Badge className={app.enabled
                                    ? "bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-none"
                                    : "bg-slate-50 text-slate-500 text-[10px] font-bold rounded-none"}>
                                    {app.enabled ? "Connected" : "Inactive"}
                                </Badge>
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-base font-bold text-slate-800">{app.title}</h4>
                                <p className="text-[12px] font-medium text-slate-500">{app.description}</p>
                                {app.enabled && app.connectedAt && (
                                    <p className="text-[10px] font-medium text-emerald-600">Connected {formatDistanceToNow(new Date(app.connectedAt))} ago</p>
                                )}
                            </div>
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => toggleIntegration(app.id)}
                                    className={`text-[11px] font-bold flex items-center gap-1.5 px-3 py-1.5 transition-colors rounded-none ${app.enabled
                                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                                >
                                    <Power size={12} />
                                    {app.enabled ? "Disconnect" : "Connect"}
                                </button>
                                {app.enabled && (
                                    <div className="flex items-center gap-1 text-emerald-500 font-bold text-[9px]">
                                        <Activity size={11} />
                                        Active
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border border-indigo-200 bg-indigo-50/30 rounded-none">
                <CardContent className="p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-600 text-white flex items-center justify-center rounded-none">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-slate-900">Universal Sync Architecture</h4>
                            <p className="text-xs font-medium text-slate-600 mt-0.5">Connect via API for two-way sync with any tool.</p>
                        </div>
                    </div>
                    <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-none gap-2">
                        Request API Key <ExternalLink size={12} />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
