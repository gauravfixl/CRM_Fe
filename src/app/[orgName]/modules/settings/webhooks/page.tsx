"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Webhook, Plus, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function WebhooksPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Webhooks"
                breadcrumbItems={[
                    { label: "Settings", href: "/modules/settings" },
                    { label: "Webhooks", href: "/modules/settings/webhooks" }
                ]}
                rightControls={
                    <Button className="h-8 gap-2 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px]">
                        <Plus className="w-3.5 h-3.5" />
                        Create Webhook
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Active Subscriptions</CardTitle>
                        <CardDescription>Real-time event notifications for your external systems.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-none bg-zinc-50/50">
                            <Webhook className="w-12 h-12 text-zinc-300 mb-4" />
                            <p className="text-sm font-medium text-zinc-600 text-center">No active webhooks</p>
                            <p className="text-xs text-zinc-400 text-center max-w-sm mt-1">Configure endpoints to receive JSON payloads for system events.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
