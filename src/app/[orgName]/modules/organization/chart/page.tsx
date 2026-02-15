"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Users, ZoomIn, ZoomOut, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function OrgChartPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Organization Chart"
                breadcrumbItems={[
                    { label: "Organization", href: "/modules/organization/overview" },
                    { label: "Chart", href: "/modules/organization/chart" }
                ]}
                rightControls={
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-zinc-200"><ZoomOut className="w-3.5 h-3.5" /></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-zinc-200"><ZoomIn className="w-3.5 h-3.5" /></Button>
                        <Button className="h-8 gap-2 rounded-none bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-[10px]">
                            <Download className="w-3.5 h-3.5" />
                            Export PDF
                        </Button>
                    </div>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm h-[calc(100vh-140px)]">
                    <CardHeader className="absolute top-0 left-0 z-10 w-full bg-white/50 backdrop-blur-sm border-b border-zinc-100">
                        <CardTitle className="text-lg font-bold">Hierarchy View</CardTitle>
                        <CardDescription>Visual representation of reporting lines and structure.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-full pt-20 flex items-center justify-center overflow-auto bg-grid-slate-100/50">
                        <div className="text-center text-zinc-500">
                            <div className="flex flex-col items-center gap-4">
                                {/* Mock Chart Node */}
                                <div className="bg-white p-4 rounded-xl border-2 border-indigo-600 shadow-xl w-64">
                                    <div className="w-12 h-12 rounded-full bg-zinc-100 mx-auto mb-2 border-2 border-white ring-2 ring-indigo-100" />
                                    <p className="font-bold text-zinc-900">Sarah Connor</p>
                                    <p className="text-xs text-indigo-600 font-bold uppercase tracking-wide">Chief Executive Officer</p>
                                </div>
                                <div className="h-8 w-px bg-zinc-300" />
                                <div className="w-full h-px bg-zinc-300 w-[calc(100%+2rem)]" />
                                <div className="flex gap-8 items-start pt-8">
                                    <div className="flex flex-col items-center">
                                        <div className="h-8 w-px bg-zinc-300 absolute -mt-8" />
                                        <div className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm w-48 opacity-60">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 mx-auto mb-2" />
                                            <p className="font-bold text-sm text-zinc-900">John Doe</p>
                                            <p className="text-[10px] text-zinc-500">CTO</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="h-8 w-px bg-zinc-300 absolute -mt-8" />
                                        <div className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm w-48 opacity-60">
                                            <div className="w-8 h-8 rounded-full bg-zinc-100 mx-auto mb-2" />
                                            <p className="font-bold text-sm text-zinc-900">Jane Smith</p>
                                            <p className="text-[10px] text-zinc-500">CFO</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-12 text-xs font-mono text-zinc-400">Interactive chart requires data population.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
