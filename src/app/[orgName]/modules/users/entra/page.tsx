"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Users, Cloud, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EntraUsersPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Entra ID Users"
                breadcrumbItems={[
                    { label: "Identity", href: "/modules/users" },
                    { label: "Entra Sync", href: "/modules/users/entra" }
                ]}
                rightControls={
                    <Button className="h-8 gap-2 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-[10px]">
                        <RefreshCw className="w-3.5 h-3.5" />
                        Sync Now
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Directory Synchronization</CardTitle>
                        <CardDescription>Users synced from Microsoft Entra ID (formerly Azure AD).</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 m-6 rounded-none">
                        <div className="text-center text-zinc-500">
                            <Cloud className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="font-medium">No synced users found</p>
                            <p className="text-xs opacity-70 mt-1">Connect your tenant in Settings {'>'} Integrations</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
