"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Globe, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function M365GroupsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="M365 Groups"
                breadcrumbItems={[
                    { label: "Identity", href: "/modules/teams" },
                    { label: "M365 Groups", href: "/modules/teams/m365" }
                ]}
                rightControls={
                    <Button className="h-8 gap-2 rounded-none bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-[10px]">
                        <Plus className="w-3.5 h-3.5" />
                        New M365 Group
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Microsoft 365 Groups</CardTitle>
                        <CardDescription>Collaborate with colleagues inside and outside your organization.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 m-6 rounded-none">
                        <div className="text-center text-zinc-500">
                            <Globe className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="font-medium">No M365 groups found</p>
                            <Button variant="link" className="text-blue-600">Create a collaboration group</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
