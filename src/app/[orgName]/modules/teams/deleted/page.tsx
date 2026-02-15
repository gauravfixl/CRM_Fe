"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Trash2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function DeletedGroupsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Deleted Groups"
                breadcrumbItems={[
                    { label: "Identity", href: "/modules/teams" },
                    { label: "Deleted Groups", href: "/modules/teams/deleted" }
                ]}
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Recently Deleted</CardTitle>
                        <CardDescription>Groups deleted within the last 30 days can be restored.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-200 m-6 rounded-none">
                        <div className="text-center text-zinc-500">
                            <Trash2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p className="font-medium">No deleted groups found</p>
                            <p className="text-xs opacity-70 mt-1">Recycle bin is empty</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
