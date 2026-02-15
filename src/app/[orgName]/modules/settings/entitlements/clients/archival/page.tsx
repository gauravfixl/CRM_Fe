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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <Archive className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Archival Rules</h1>
                            <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-black uppercase tracking-widest px-3">COLD STORAGE</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Configure automated archival policies for inactive client accounts.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Archival process initiated via manual trigger")}
                        className="h-10 border-zinc-200 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all text-orange-600 hover:text-orange-700 hover:border-orange-100"
                    >
                        <Archive className="w-4 h-4 mr-2" />
                        Run Archival Now
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Archival settings reset")}
                        className="h-10 border-zinc-200 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button
                        onClick={() => handleAction("Archival rules saved")}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-100 active:scale-95 transition-all"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Rules
                    </Button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Archival Window</p>
                        <Clock className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">{archivalMonths[0]} Months</p>
                        <p className="text-[10px] text-white">Inactivity threshold</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Archived Clients</p>
                        <FolderArchive className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">342 Accounts</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">In cold storage</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Storage Saved</p>
                        <HardDrive className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">4.8 GB</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Compressed data</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Last Archival</p>
                        <Calendar className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">2 Days Ago</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Automated run</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* ARCHIVAL CONFIGURATION */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8">
                <div className="flex flex-col gap-8">
                    <div>
                        <h3 className="text-lg font-black text-zinc-900 uppercase italic tracking-tight mb-2">Inactivity Threshold</h3>
                        <p className="text-sm text-zinc-400 font-bold leading-relaxed italic mb-6">
                            Clients with no activity for the specified period will be automatically moved to cold storage.
                        </p>
                        <div className="w-full md:w-96 bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Archival After</span>
                                <span className="text-2xl font-black text-blue-600">{archivalMonths[0]}M</span>
                            </div>
                            <Slider
                                value={archivalMonths}
                                onValueChange={setArchivalMonths}
                                max={24}
                                min={3}
                                step={1}
                                className="mb-2"
                            />
                            <div className="flex justify-between text-[9px] font-bold text-zinc-300 uppercase italic">
                                <span>3 Months</span>
                                <span>24 Months</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-50">
                        <div className="flex items-start justify-between p-4 rounded-2xl border border-zinc-100 hover:border-blue-100 transition-all group">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-50 group-hover:bg-blue-50 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 transition-colors shadow-sm">
                                    <Archive className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-zinc-800 uppercase italic tracking-tight mb-1">Auto-Archive Dormant Accounts</h4>
                                    <p className="text-[11px] text-zinc-400 font-bold leading-relaxed pr-4 italic">
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

                        <div className="flex items-start justify-between p-4 rounded-2xl border border-zinc-100 hover:border-blue-100 transition-all group">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-50 group-hover:bg-blue-50 flex items-center justify-center text-zinc-400 group-hover:text-blue-600 transition-colors shadow-sm">
                                    <Database className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-zinc-800 uppercase italic tracking-tight mb-1">Compress Archived Data</h4>
                                    <p className="text-[11px] text-zinc-400 font-bold leading-relaxed pr-4 italic">
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
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200 flex items-start gap-4">
                <Archive className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                    <h4 className="text-sm font-black text-blue-900 uppercase italic mb-1">Archival Process</h4>
                    <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        Archived clients remain accessible but are moved to read-only cold storage. You can restore them anytime to active status. Archival helps optimize database performance and reduce storage costs.
                    </p>
                </div>
            </div>
        </div>
    )
}
