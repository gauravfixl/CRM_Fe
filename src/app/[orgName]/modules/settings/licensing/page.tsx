"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { CreditCard, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function LicensingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="License Management"
                breadcrumbItems={[
                    { label: "Settings", href: "/modules/settings" },
                    { label: "Licensing", href: "/modules/settings/licensing" }
                ]}
                rightControls={
                    <Button className="h-8 gap-2 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px]">
                        Purchase More Seats
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { title: "Platform Users", used: 2847, total: 5000, color: "bg-blue-600" },
                        { title: "CRM Power Users", used: 45, total: 50, color: "bg-emerald-600" },
                        { title: "Finance Admin Seats", used: 3, total: 5, color: "bg-amber-600" },
                        { title: "Project Managers", used: 12, total: 20, color: "bg-purple-600" },
                    ].map((license, i) => (
                        <Card key={i} className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wide text-zinc-500">{license.title}</CardTitle>
                                    <Badge variant="outline" className="font-mono">{license.used} / {license.total}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end justify-between mb-2">
                                    <span className="text-2xl font-black text-zinc-900">{Math.round((license.used / license.total) * 100)}%</span>
                                    <span className="text-xs font-semibold text-zinc-400">Utilization</span>
                                </div>
                                <Progress value={(license.used / license.total) * 100} className="h-2 bg-zinc-100" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
