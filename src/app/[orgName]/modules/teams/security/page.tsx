"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Shield, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function SecurityGroupsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Security Groups"
                breadcrumbItems={[
                    { label: "Identity", href: "/modules/teams" },
                    { label: "Security Groups", href: "/modules/teams/security" }
                ]}
                rightControls={
                    <Button className="h-8 gap-2 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px]">
                        <Plus className="w-3.5 h-3.5" />
                        New Group
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Security Groups</CardTitle>
                        <CardDescription>Manage security groups and membership for resource access.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 m-6 rounded-none">
                        <div className="text-center text-zinc-500">
                            <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="font-medium">No security groups found</p>
                            <Button variant="link" className="text-indigo-600">Create your first group</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
