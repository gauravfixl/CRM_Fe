"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Archive,
    Clock,
    Database,
    HardDrive,
    RefreshCcw,
    Save,
    Calendar,
    FolderArchive
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"

export default function ClientArchivalRulesPage() {
    const [archivalMonths, setArchivalMonths] = useState([12])
    const [autoArchive, setAutoArchive] = useState(true)
    const [compressData, setCompressData] = useState(true)

    const handleAction = (msg: string) => {
        toast.success(msg)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary/70 to-primary flex items-center justify-center text-white shadow-sm">
                        <Archive className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-sm font-semibold text-zinc-900">Archival Rules</h1>
                            <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-medium px-2 rounded-md">Cold Storage</Badge>
                        </div>
                        <p className="text-xs text-slate-500">Configure automated archival policies for inactive client accounts.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Archival process initiated via manual trigger")}
                        className="h-8 border text-xs font-medium px-4 rounded-lg shadow-sm bg-white hover:bg-zinc-50 transition-all text-orange-600 hover:text-orange-700 hover:border-orange-100"
                    >
                        <Archive className="w-3.5 h-3.5 mr-2" />
                        Run Archival Now
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Archival settings reset")}
                        className="h-8 border text-xs font-medium px-4 rounded-lg shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-3.5 h-3.5 mr-2" />
                        Reset
                    </Button>
                    <Button
                        onClick={() => handleAction("Archival rules saved")}
                        className="h-8 bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 rounded-lg shadow-sm active:scale-95 transition-all"
                    >
                        <Save className="w-3.5 h-3.5 mr-2" />
                        Save Rules
                    </Button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none text-white shadow-lg rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs opacity-80">Archival Window</p>
                        <Clock className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-white">{archivalMonths[0]} Months</p>
                        <p className="text-[10px] text-white">Inactivity threshold</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500">Archived Clients</p>
                        <FolderArchive className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">342 Accounts</p>
                        <p className="text-[10px] text-slate-500">In cold storage</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500">Storage Saved</p>
                        <HardDrive className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">4.8 GB</p>
                        <p className="text-[10px] text-slate-500">Compressed data</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-xs text-slate-500">Last Archival</p>
                        <Calendar className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-xl font-semibold text-zinc-900">2 Days Ago</p>
                        <p className="text-[10px] text-slate-500">Automated run</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* ARCHIVAL CONFIGURATION */}
            <div className="bg-white rounded-xl border shadow-sm p-5">
                <div className="flex flex-col gap-6">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-900 mb-2">Inactivity Threshold</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                            Clients with no activity for the specified period will be automatically moved to cold storage.
                        </p>
                        <div className="w-full md:w-96 bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-medium text-slate-500">Archival After</span>
                                <span className="text-xl font-semibold text-blue-600">{archivalMonths[0]}M</span>
                            </div>
                            <Slider
                                value={archivalMonths}
                                onValueChange={setArchivalMonths}
                                max={24}
                                min={3}
                                step={1}
                                className="mb-2"
                            />
                            <div className="flex justify-between text-[10px] font-medium text-zinc-300">
                                <span>3 Months</span>
                                <span>24 Months</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-50">
                        <div className="flex items-start justify-between p-4 rounded-xl border border-zinc-100 hover:border-blue-100 transition-all group">
                            <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-lg bg-zinc-50 group-hover:bg-blue-50 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 transition-colors shadow-sm">
                                    <Archive className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-zinc-800 mb-1">Auto-Archive Dormant Accounts</h4>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed pr-4">
                                        Automatically move inactive clients to archival storage.
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={autoArchive}
                                onCheckedChange={setAutoArchive}
                                className="data-[state=checked]:bg-blue-600 mt-1 scale-90"
                            />
                        </div>

                        <div className="flex items-start justify-between p-4 rounded-xl border border-zinc-100 hover:border-blue-100 transition-all group">
                            <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-lg bg-zinc-50 group-hover:bg-blue-50 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 transition-colors shadow-sm">
                                    <Database className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-zinc-800 mb-1">Compress Archived Data</h4>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed pr-4">
                                        Reduce storage costs by compressing archived records.
                                    </p>
                                </div>
                            </div>
                            <Switch
                                checked={compressData}
                                onCheckedChange={setCompressData}
                                className="data-[state=checked]:bg-blue-600 mt-1 scale-90"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* INFO NOTICE */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-3">
                <Archive className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                    <h4 className="text-xs font-semibold text-blue-900 mb-1">Archival Process</h4>
                    <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        Archived clients remain accessible but are moved to read-only cold storage. You can restore them anytime to active status. Archival helps optimize database performance and reduce storage costs.
                    </p>
                </div>
            </div>
        </div>
    )
}
