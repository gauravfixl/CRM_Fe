"use client"

import React from "react"
import SubHeader from "@/shared/components/custom/SubHeader"
import { Zap, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export default function FeatureFlagsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <SubHeader
                title="Feature Management"
                breadcrumbItems={[
                    { label: "Settings", href: "/modules/settings" },
                    { label: "Feature Flags", href: "/modules/settings/feature-flags" }
                ]}
                rightControls={
                    <Button className="h-8 gap-2 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-widest text-[10px]">
                        Create Flag
                    </Button>
                }
            />

            <div className="flex-1 p-6 pt-0 space-y-6">
                <Card className="rounded-none border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Active Experiments</CardTitle>
                        <CardDescription>Control feature availability across your organization.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "New Dashboard Layout", id: "feat_dash_v2", status: "Beta", enabled: true, desc: "Grid-based modular dashboard with drag-and-drop support." },
                            { name: "AI Email Composer", id: "ai_email_gen", status: "Alpha", enabled: false, desc: "Generative AI assistance for sales email composition." },
                            { name: "Unified Search", id: "global_search_idx", status: "GA", enabled: true, desc: "Elasticsearch powered global navigation search." },
                        ].map((flag, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-zinc-100 bg-white hover:border-zinc-200 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded ${flag.enabled ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-100 text-zinc-400'}`}>
                                        <FlaskConical className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-bold text-zinc-900">{flag.name}</h4>
                                            <Badge variant="outline" className="text-[10px] h-4 px-1">{flag.status}</Badge>
                                        </div>
                                        <p className="text-xs text-zinc-500 mt-0.5">{flag.desc}</p>
                                        <p className="text-[10px] font-mono text-zinc-400 mt-1">{flag.id}</p>
                                    </div>
                                </div>
                                <Switch checked={flag.enabled} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
