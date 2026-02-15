"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Zap, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function DynamicMembershipPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Dynamic Membership Rules"
                breadcrumbItems={[
                    { label: "Identity", href: "/modules/teams" },
                    { label: "Automation", href: "/modules/teams/dynamic" }
                ]}
                rightControls={
                    <Button className="h-8 gap-2 rounded-none bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-widest text-[10px]">
                        <Plus className="w-3.5 h-3.5" />
                        New Role
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Automation Rules</CardTitle>
                        <CardDescription>Automatically add or remove users from groups based on their attributes.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 m-6 rounded-none">
                        <div className="text-center text-zinc-500">
                            <Zap className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="font-medium">No active rules</p>
                            <Button variant="link" className="text-amber-600">Create dynamic rule</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
