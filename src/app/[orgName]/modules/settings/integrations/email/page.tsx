"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Mail, Calendar, RefreshCw, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EmailIntegrationsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Email & Calendar"
                breadcrumbItems={[
                    { label: "Settings", href: "/modules/settings" },
                    { label: "Integrations", href: "/modules/settings/integrations" },
                    { label: "Email", href: "/modules/settings/integrations/email" }
                ]}
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Connected Accounts</CardTitle>
                        <CardDescription>Sync emails and events with your calendar provider.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                        <div className="border border-zinc-200 bg-white p-6 flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900">Microsoft Outlook</h3>
                                <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">Two-way sync for Office 365 Exchange Online.</p>
                            </div>
                            <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-none h-8 text-xs font-bold uppercase tracking-widest">Connect</Button>
                        </div>

                        <div className="border border-zinc-200 bg-white p-6 flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                                <Mail className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-900">Google Workspace</h3>
                                <p className="text-xs text-zinc-500 mt-1 max-w-[200px]">Sync Gmail and Google Calendar events.</p>
                            </div>
                            <Button variant="outline" className="w-full border-zinc-200 text-zinc-900 rounded-none h-8 text-xs font-bold uppercase tracking-widest">Configure</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
